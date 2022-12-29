import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

import {
  DatePickerComponent,
  DateRangeComp,
  LoaderComponent,
} from "../../../components";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import { useNavigation } from "@react-navigation/native";
import { Button, IconButton } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import AttendanceForm from "../../../components/AttendanceForm";
import { MenuIcon } from "../../../navigations/appNavigator";
import WeeklyCalendar from "react-native-weekly-calendar";
import Geolocation from "@react-native-community/geolocation";
import { getDistanceBetweenTwoPoints, officeRadius } from "../../../service";
import { monthNamesCap } from "./AttendanceTop";
import ReactNativeModal from "react-native-modal";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);

const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};
const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 6;
const profileBgWidth = profileWidth + 5;
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const LocalButtonComp = ({ title, onPress, disabled }) => {
  return (
    <Button
      style={{ marginHorizontal: 20 }}
      mode="contained"
      color={Colors.RED}
      disabled={disabled}
      labelStyle={{ textTransform: "none" }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};

const AttendanceScreen = ({ route, navigation }) => {
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
    totalTime: "0",
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [datePickerId, setDatePickerId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hoverReasons, setHoverReasons] = useState("");
  const [notes, setNotes] = useState("");
  const fromDateRef = useRef(selectedFromDate);
  const toDateRef = useRef(selectedToDate);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon navigation={navigation} />,
    });
  }, [navigation]);

  useEffect(() => {
    console.log(route?.params);
  }, [route.params]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getCurrentLocation();
      setFromDateState(lastMonthFirstDate);
      setToDateState(currentDate);
      // setLoading(true);
      // getAttendance();
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    getAttendance();
  }, [currentMonth]);

  const setFromDateState = (date) => {
    fromDateRef.current = date;
    setSelectedFromDate((x) => date);
  };

  const setToDateState = (date) => {
    toDateRef.current = date;
    setSelectedToDate((x) => date);
  };

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key);
  };

  const updateSelectedDate = (date, key) => {
    const formatDate = moment(date).format(dateFormat);
    switch (key) {
      case "FROM_DATE":
        setFromDateState(formatDate);
        break;
      case "TO_DATE":
        setToDateState(formatDate);
        break;
    }
  };

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
        var d = currentMonth;
        const response = await client.get(
          URL.GET_ATTENDANCE_EMPID(
            jsonObj.empId,
            jsonObj.orgId,
            monthNamesCap[d.getMonth()]
          )
        );
        const json = await response.json();
        if (json) {
          let newArray = [];
          let dateArray = [];
          let weekArray = [];
          for (let i = 0; i < json.length; i++) {
            const element = json[i];
            let format = {
              customStyles: {
                container: {
                  backgroundColor:
                    element.isPresent === 1
                      ? element.wfh === 1
                        ? Colors.SKY_LIGHT_BLUE_COLOR
                        : Colors.GREEN
                      : element.holiday === 1
                      ? Colors.DARK_GRAY
                      : element.wfh === 1
                      ? Colors.SKY_LIGHT_BLUE_COLOR
                      : "#ff5d68",
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
      let d = currentMonth;
      const response = await client.get(
        URL.GET_ATTENDANCE_COUNT(
          jsonObj.empId,
          jsonObj.orgId,
          monthNamesCap[d.getMonth()]
        )
      );
      const json = await response.json();
      if (json) {
        setAttendanceCount({
          holidays: json?.holidays || 0,
          leave: json?.leave || 0,
          present: json?.present || 0,
          wfh: json?.wfh || 0,
          totalTime: json?.totalTime || "0",
        });
      }
    } catch (error) {}
  };

  const RenderModal = () => {
    return (
      <ReactNativeModal
        onBackdropPress={() => {
          setShowModal(false);
        }}
        transparent={true}
        visible={showModal}
      >
        <View style={styles.newModalContainer}>
          <Text>{"Reason: " + hoverReasons}</Text>
          <Text>{"Note: " + notes}</Text>
        </View>
      </ReactNativeModal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <RenderModal />
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        maximumDate={new Date()}
        value={new Date()}
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (Platform.OS === "android") {
            if (selectedDate) {
              updateSelectedDate(selectedDate, datePickerId);
            }
          } else {
            updateSelectedDate(selectedDate, datePickerId);
          }
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <AttendanceForm
        visible={attendance}
        showReason={reason}
        inVisible={() => {
          getAttendance();
          setAttendance(false);
        }}
      />
      <View
        style={{ width: "90%", alignSelf: "center", flexDirection: "column" }}
      >
        <DateRangeComp
          fromDate={selectedFromDate}
          toDate={selectedToDate}
          fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
          toDateClicked={() => showDatePickerMethod("TO_DATE")}
        />
        <LocalButtonComp
          title={"Download Report"}
          onPress={() => {}}
          disabled={false}
        />
      </View>
      <View style={styles.profilePicView}>
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
          <Text style={styles.totalHoursValue}>
            {attendanceCount.totalTime}
          </Text>
        </View>
      </View>
      {/* <View
        style={{
          flexDirection: "row",
          marginBottom: 2,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 25,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderColor: Colors.RED,
            borderWidth: 1,
            borderRadius: 5,
            height: 35,
            marginTop: 2,
            justifyContent: "center",
            width: "80%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsWeek(true);
            }}
            style={{
              width: "50%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: !isWeek ? Colors.WHITE : Colors.RED,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: !isWeek ? Colors.BLACK : Colors.WHITE,
                fontWeight: "600",
              }}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsWeek(false);
            }}
            style={{
              width: "50%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: !isWeek ? Colors.RED : Colors.WHITE,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: !isWeek ? Colors.WHITE : Colors.BLACK,
                fontWeight: "600",
              }}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View> */}
      {!isWeek && (
        <View>
          <Calendar
            onDayPress={(day) => {
              console.log("selected day", day);
              let week = new Date(day.dateString);
              const weekDay = week.getDay();
              console.log(weekdays[weekDay]);
              isCurrentDate(day);
            }}
            onDayLongPress={(day) => {
              console.log("selected day", day);
              let newData = weeklyRecord.filter(
                (e) => e.start === day.dateString
              )[0];
              setHoverReasons(newData?.reason || "");
              setNotes(newData?.note || "");
              let week = new Date(day.dateString);
              const weekDay = week.getDay();
              if (weekDay == 0 || weekDay == 6) {
              } else {
                setShowModal(true);
              }
            }}
            monthFormat={"MMM yyyy"}
            onMonthChange={(month) => {
              console.log("month changed", month);
              setCurrentMonth(new Date(month.dateString));
            }}
            // dayComponent={({ date, state }) => {
            //   return (
            //     <View>
            //       <Text
            //         style={{
            //           textAlign: "center",
            //           color: state === "disabled" ? "gray" : "black",
            //         }}
            //       >
            //         {date.day}
            //       </Text>
            //     </View>
            //   );
            // }}
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
      <View style={styles.parameterListContain}>
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
              backgroundColor: Colors.DARK_GRAY,
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
      </View>
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default AttendanceScreen;

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
  newModalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    maxHeight: "50%",
    maxWidth: "100%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: "30%",
    marginLeft: "30%",
    elevation: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    top: 5,

    position: "absolute",
  },
});
