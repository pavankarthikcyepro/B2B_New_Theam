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
  TouchableHighlight,
  FlatList,
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
import Swipeable from "react-native-swipeable";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};

const AttendanceTopTabScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isWeek, setIsWeek] = useState(false);
  const [marker, setMarker] = useState({});
  const [attendance, setAttendance] = useState(false);
  const [weeklyRecord, setWeeklyRecord] = useState([]);
  const [reason, setReason] = useState(false);
  const [initialPosition, setInitialPosition] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  function selectedMonth(params) {
    let d = moment(params);
    d.month(); // 1
    console.log(d.month(), params,new Date());
    return d.format("MMM YYYY");
  }

  function nextMonth(params) {
    let current = params;
    current.setMonth(current.getMonth() + 1);
    let d = moment(current);
    d.month(); 
    return d.format("MMM");
  }

  function previousMonth(params) {
    let current = params;
    current.setMonth(current.getMonth() - 1);
    let d = moment(current);
    d.month();
    return d.format("MMM");
  }

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
      setAttendance(true);
    }
  };

  const isCurrentDateForWeekView = (day) => {
    let selectedDate = moment(day).format(dateFormat);
    if (currentDate === selectedDate) {
      setAttendance(true);
    }
  };

  //   const leftContent = <Text>Pull to activate</Text>;

  const renderItem = ({ item }) => {
    return (
      <Swipeable
        style={{ width: "98%", marginVertical: 5, marginHorizontal: "2%" }}
        rightButtons={rightButtons}
      >
        <View
          style={{
            ...GlobalStyle.shadow,
            flexDirection: "row",
            width: "95%",
            height: 65,
            alignSelf: "center",
            padding: 7,
            backgroundColor: "#fff",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              width: "15%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "85%",
                backgroundColor: "lightgrey",
                alignSelf: "center",
                alignItems: "center",
                borderRadius: 6,
                justifyContent: "space-evenly",
                height: 40,
              }}
            >
              <Text>{"01"}</Text>
              <Text>{"MON"}</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              width: "15%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ backgroundColor: "red" }}>
              <Text style={{ color: "#fff", padding: 2.5, fontWeight: "600" }}>
                {"EL"}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              width: "70%",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                height: 50,
              }}
            >
              <Text>{"Punch In"}</Text>
              <Text>{"10:30 AM"}</Text>
            </View>
            <View
              style={{
                height: 40,
                borderWidth: 0.5,
              }}
            />
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                height: 50,
              }}
            >
              <Text>{"Punch Out"}</Text>
              <Text>{"10:30 PM"}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };
  const rightButtons = [
    <TouchableHighlight
      style={{
        backgroundColor: "#646446",
        height: 65,
        width: "18%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
      }}
    >
      <Text style={{ color: "#fff" }}>Punch In</Text>
    </TouchableHighlight>,
  ];

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
      {/* {!isWeek && (
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
            style={{ padding: 0 }}
            markingType={"custom"}
            markedDates={marker}
          />
        </View>
      )} */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
          alignSelf: "center",
          paddingVertical: 15,
        }}
      >
        <TouchableOpacity style={{ flexDirection: "row" }}>
          <MaterialIcons name="arrow-back-ios" size={20} color={Colors.BLACK} />
          <Text>{previousMonth(currentMonth)}</Text>
        </TouchableOpacity>
        <Text>{selectedMonth(currentMonth)}</Text>
        <TouchableOpacity style={{ flexDirection: "row" }}>
          <Text>{nextMonth(currentMonth)}</Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={20}
            color={Colors.BLACK}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={[0, 0, 0, 0, 0, 0]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
      />
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default AttendanceTopTabScreen;

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
});
