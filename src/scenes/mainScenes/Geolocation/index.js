import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { LoaderComponent } from "../../../components";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import AttendanceForm from "../../../components/AttendanceForm";
import { MenuIcon } from "../../../navigations/appNavigator";
import WeeklyCalendar from "react-native-weekly-calendar";
import Geolocation from "@react-native-community/geolocation";
import { getDistanceBetweenTwoPoints, officeRadius } from "../../../service";
import { AppNavigator } from "../../../navigations";
import { GeolocationTopTabNavigatorIdentifiers } from "../../../navigations/geolocationNavigator";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};
const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 6;
const profileBgWidth = profileWidth + 5;

const GeoLocationScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isWeek, setIsWeek] = useState(false);
  const [marker, setMarker] = useState({});
  const [attendance, setAttendance] = useState(false);
  const [weeklyRecord, setWeeklyRecord] = useState([]);
  const [reason, setReason] = useState(false);
  const [initialPosition, setInitialPosition] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [attendanceCount, setAttendanceCount] = useState({
    holidays: 0,
    leave: 0,
    present: 0,
    wfh: 0,
  });
  const [userData, setUserData] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon navigation={navigation} />,
    });
  }, [navigation]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getCurrentLocation();
      // setLoading(true);
      // getAttendance();
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    getAttendance();
  }, []);

  const getCurrentLocation = async () => {
    try {
      // if (Platform.OS === "ios") {
      //   Geolocation.requestAuthorization();
      //   Geolocation.setRNConfiguration({
      //     skipPermissionRequests: false,
      //     authorizationLevel: "whenInUse",
      //   });
      // }
      Geolocation.getCurrentPosition(
        (position) => {
          console.log("Sss", position);
          const initialPosition = JSON.stringify(position);
          let json = JSON.parse(initialPosition);
          setInitialPosition(json.coords);
          let dist = getDistanceBetweenTwoPoints(
            officeLocation.latitude,
            officeLocation.longitude,
            json?.coords?.latitude,
            json?.coords?.longitude
          );
          console.log("LLLLL", dist);
          if (dist > officeRadius) {
            setReason(true); ///true for reason
          } else {
            setReason(false);
          }
        },
        (error) => {
          console.log(JSON.stringify(error));
        },
        { enableHighAccuracy: true }
      );
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const getAttendance = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        getProfilePic(jsonObj);
        getAttendanceCount(jsonObj);
        setUserData(jsonObj);
        const response = await client.get(
          URL.GET_ATTENDANCE_EMPID(jsonObj.empId, jsonObj.orgId)
        );
        const json = await response.json();
        if (json) {
          let newArray = [];
          let dateArray = [];
          let weekArray = [];
          for (let i = 0; i < json.length; i++) {
            const element = json[i];
            let format = {
              // marked: true,
              // dotColor: element.isPresent === 1 ? Colors.GREEN : Colors.RED,
              customStyles: {
                container: {
                  backgroundColor:
                    element.isPresent === 1 ? Colors.GREEN : "#ff5d68",
                },
                text: {
                  color: Colors.WHITE,
                  fontWeight: "bold",
                },
              },
            };

            let date = new Date(element.createdtimestamp);
            let formatedDate = moment(date).format(dateFormat);
            let weekReport = {
              start: formatedDate,
              // duration: "00:20:00",
              note: element.comments,
              reason: element.reason,
              color: element.isPresent === 1 ? Colors.GREEN : "#ff5d68",
              status: element.isPresent === 1 ? "Present" : "Absent",
            };
            dateArray.push(formatedDate);
            newArray.push(format);
            weekArray.push(weekReport);
          }
          var obj = {};
          for (let i = 0; i < newArray.length; i++) {
            const element = newArray[i];
            obj[dateArray[i]] = element;
          }
          setLoading(false);
          setWeeklyRecord(weekArray);
          setMarker(obj);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const isCurrentDate = (day) => {
    let selectedDate = day.dateString;
    if (currentDate === selectedDate) {
    //   setAttendance(true);
      navigation.navigate(GeolocationTopTabNavigatorIdentifiers.map, {
        empId: userData.empId,
        orgId: userData.orgId,
      });
    }
  };

  const isCurrentDateForWeekView = (day) => {
    let selectedDate = moment(day).format(dateFormat);
    if (currentDate === selectedDate) {
      setAttendance(true);
    }
  };

  const getProfilePic = (userData) => {
    fetch(
      `http://automatestaging-724985329.ap-south-1.elb.amazonaws.com:8081/sales/employeeprofilepic/get/${userData.empId}/${userData.orgId}/${userData.branchId}`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.length > 0) {
          setImageUri(json[json.length - 1].documentPath);
        } else {
          setImageUri(
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
          );
        }
      })
      .catch((error) => {
        setImageUri(
          "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
        );
        console.error(error);
      });
  };

  const getAttendanceCount = async (jsonObj) => {
    try {
      const response = await client.get(
        URL.GET_ATTENDANCE_COUNT(jsonObj.empId, jsonObj.orgId)
      );
      const json = await response.json();
      if (json) {
        setAttendanceCount({
          holidays: json.holidays || 0,
          leave: json.leave || 0,
          present: json.present || 0,
          wfh: json.wfh || 0,
        });
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <AttendanceForm
        visible={attendance}
        showReason={reason}
        inVisible={() => {
          getAttendance();
          setAttendance(false);
        }}
      />
      {/* <View style={styles.profilePicView}>
        <View
          style={{
            ...GlobalStyle.shadow,
            ...styles.profilePicBG,
          }}
        >
          <Image
            style={styles.profilePic}
            source={{
              uri: imageUri,
            }}
          />
        </View>
        <View style={styles.hoursView}>
          <Text style={styles.totalHours}>{"Total Hours"}</Text>
          <Text style={styles.totalHoursValue}>{"120"}</Text>
        </View>
      </View> */}
      {!isWeek && (
        <View>
          <Calendar
            onDayPress={(day) => {
              console.log("selected day", day);
              isCurrentDate(day);
            }}
            onDayLongPress={(day) => {
              console.log("selected day", day);
            }}
            monthFormat={"MMM yyyy"}
            onMonthChange={(month) => {
              console.log("month changed", month);
            }}
            hideExtraDays={true}
            firstDay={1}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            enableSwipeMonths={true}
            theme={{
              arrowColor: Colors.RED,
              dotColor: Colors.RED,
              textMonthFontWeight: "500",
              monthTextColor: Colors.RED,
              indicatorColor: Colors.RED,
              dayTextColor: Colors.BLACK,
              selectedDayBackgroundColor: Colors.GRAY,
              textDayFontWeight: "500",
            }}
            markingType={"custom"}
            markedDates={marker}
          />
        </View>
      )}

      {isWeek && (
        <View style={{ flex: 1, marginTop: 10 }}>
          <WeeklyCalendar
            events={weeklyRecord}
            titleFormat={"MMM yyyy"}
            titleStyle={{
              color: Colors.RED,
              fontSize: 15,
              fontWeight: "500",
              marginVertical: 10,
            }}
            themeColor={Colors.RED}
            dayLabelStyle={{
              color: Colors.RED,
            }}
            onDayPress={(day) => {
              console.log("selected dayssss", day);
              isCurrentDateForWeekView(day);
            }}
            renderEvent={(event, j) => {
              return (
                <View
                  style={{ ...styles.eventNote, backgroundColor: event.color }}
                >
                  <Text style={styles.eventText}>{event.status}</Text>
                  {event.note?.length > 0 && (
                    <Text style={styles.eventText}>
                      {"Comment: " + event.note}
                    </Text>
                  )}
                  {event.reason?.length > 0 && (
                    <Text style={styles.eventText}>
                      {"Reason: " + event.reason}
                    </Text>
                  )}
                </View>
              );
            }}
          />
        </View>
      )}
      {/* <View style={styles.parameterListContain}>
        <View style={styles.parameterView}>
          <View
            style={{ ...styles.parameterMarker, backgroundColor: Colors.GREEN }}
          />
          <View style={styles.parameterCountView}>
            <Text style={styles.parameterText}>{"Present"}</Text>
            <Text style={styles.parameterText}>{attendanceCount.present}</Text>
          </View>
        </View>
        <View style={styles.parameterView}>
          <View
            style={{ ...styles.parameterMarker, backgroundColor: Colors.RED }}
          />
          <View style={styles.parameterCountView}>
            <Text style={styles.parameterText}>{"Leave"}</Text>
            <Text style={styles.parameterText}>{attendanceCount.leave}</Text>
          </View>
        </View>
        <View style={styles.parameterView}>
          <View
            style={{
              ...styles.parameterMarker,
              backgroundColor: Colors.LIGHT_GRAY,
            }}
          />
          <View style={styles.parameterCountView}>
            <Text style={styles.parameterText}>{"Holiday"}</Text>
            <Text style={styles.parameterText}>{attendanceCount.holidays}</Text>
          </View>
        </View>
        <View style={styles.parameterView}>
          <View
            style={{
              ...styles.parameterMarker,
              backgroundColor: Colors.SKY_LIGHT_BLUE_COLOR,
            }}
          />
          <View style={styles.parameterCountView}>
            <Text style={styles.parameterText}>{"WFH"}</Text>
            <Text style={styles.parameterText}>{attendanceCount.wfh}</Text>
          </View>
        </View>
      </View> */}
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default GeoLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  component: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "grey",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  arrowButton: {
    paddingHorizontal: 10,
  },
  title: {
    color: "grey",
    fontWeight: "bold",
  },
  week: {
    width: "100%",
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 5,
  },
  weekdayLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  weekdayLabel: {
    flex: 1,
    alignItems: "center",
  },
  weekdayLabelText: {
    color: "grey",
  },
  weekdayNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  weekDayNumber: {
    flex: 1,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDayNumberCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
  },
  weekDayNumberTextToday: {
    color: "white",
  },
  schedule: {
    width: "100%",
  },
  pickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  picker: {
    backgroundColor: "white",
    paddingBottom: 20,
  },
  modal: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  blurredArea: {
    flex: 1,
    opacity: 0.7,
    backgroundColor: "black",
  },
  modalButton: {
    padding: 15,
  },
  modalButtonText: {
    fontSize: 20,
  },
  indicator: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    position: "absolute",
  },
  day: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopColor: "grey",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dayLabel: {
    width: "20%",
    alignItems: "center",
    padding: 10,
    borderRightColor: "grey",
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  monthDateText: {
    fontSize: 20,
  },
  dayText: {},
  allEvents: {
    width: "80%",
  },
  event: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  eventDuration: {
    width: "30%",
    justifyContent: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationDot: {
    width: 4,
    height: 4,
    backgroundColor: "grey",
    marginRight: 5,
    alignSelf: "center",
    borderRadius: 4 / 2,
  },
  durationDotConnector: {
    height: 20,
    borderLeftColor: "grey",
    borderLeftWidth: StyleSheet.hairlineWidth,
    position: "absolute",
    left: 2,
  },
  durationText: {
    color: "grey",
    fontSize: 12,
  },
  eventNote: {
    backgroundColor: "skyblue",
    flex: 1,
    justifyContent: "center",
    paddingLeft: 15,
  },
  lineSeparator: {
    width: "100%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 4,
    height: 4,
    marginTop: 1,
    alignSelf: "center",
    borderRadius: 4 / 2,
    position: "absolute",
    bottom: "10%",
  },
  eventText: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.WHITE,
  },
  parameterCountView: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-between",
  },
  parameterMarker: {
    height: 25,
    width: 25,
    backgroundColor: "red",
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: "#646464",
  },
  parameterView: {
    flexDirection: "row",
    width: "60%",
    alignItems: "center",
    marginTop: 10,
  },
  parameterListContain: {
    width: "100%",
    marginTop: 10,
    marginLeft: 10,
  },
  parameterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  totalHours: {
    color: "#646464",
    fontSize: 16,
    fontWeight: "700",
  },
  totalHoursValue: {
    color: "#252525",
    fontSize: 17,
    fontWeight: "700",
  },
  hoursView: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePicView: {
    marginHorizontal: 25,
    marginVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: profileWidth,
    height: profileWidth,
    borderRadius: profileWidth / 2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profilePicBG: {
    width: profileWidth,
    height: profileWidth,
    borderRadius: profileWidth / 2,
    borderColor: "#fff",
  },
});
