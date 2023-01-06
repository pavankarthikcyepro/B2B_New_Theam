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
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import Geolocation from "@react-native-community/geolocation";
import { getDistanceBetweenTwoPoints, officeRadius } from "../../../service";
import Swipeable from "react-native-swipeable";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import VerifyAttendance from "../../../components/VerifyAttendance";
import AttendanceForm from "../../../components/AttendanceForm";
import AttendanceFromSelf from "../../../components/AttendanceFromSelf";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const currentDay = new Date().getDate();
const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};
var monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const monthNamesCap = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDays = (year, month) => {
  return new Date(year, month, 0).getDate();
};

function getAllDaysInMonth(year, month) {
  const date = new Date(year, month, 1);

  const dates = [];

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

const AttendanceTopTabScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState(false);
  const [reason, setReason] = useState(false);
  const [initialPosition, setInitialPosition] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthData, setMonthData] = useState([]);
  const [logOut, setLogOut] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => <MenuIcon navigation={navigation} />,
  //   });
  // }, [navigation]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getCurrentLocation();
      setLoading(true);
      getAttendance();
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    getAttendance();
  }, [currentMonth]);

  function selectedMonth(params) {
    return monthNames[params.getMonth()];
  }

  function nextMonth(params) {
    if (params.getMonth() == 11) {
      return monthNames[0];
    } else {
      return monthNames[params.getMonth() + 1];
    }
  }

  function previousMonth(params) {
    if (params.getMonth() === 0) {
      return monthNames[monthNames.length - 1];
    } else {
      return monthNames[params.getMonth() - 1];
    }
  }

  const getCurrentLocation = async () => {
    try {
      Geolocation.getCurrentPosition(
        (position) => {
          const initialPosition = JSON.stringify(position);
          let json = JSON.parse(initialPosition);
          setInitialPosition(json.coords);
          let dist = getDistanceBetweenTwoPoints(
            officeLocation.latitude,
            officeLocation.longitude,
            json?.coords?.latitude,
            json?.coords?.longitude
          );
          if (dist > officeRadius) {
            setReason(true); ///true for reason
          } else {
            setReason(false);
          }
        },
        (error) => {
          // console.log(JSON.stringify(error));
        },
        { enableHighAccuracy: true }
      );
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const getAttendance = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const d = currentMonth;
        const response = await client.get(
          URL.GET_ATTENDANCE_EMPID(
            jsonObj.empId,
            jsonObj.orgId,
            monthNamesCap[d.getMonth()]
          )
        );

        const json = await response.json();
        const daysInMonth = getDays(new Date().getFullYear(), d.getMonth());
        let newArr = [];
        const date = new Date(d);
        let dates = getAllDaysInMonth(date.getFullYear(), date.getMonth());
        for (let i = 0; i < dates.length; i++) {
          const element = dates[i];
          const attendance = json.filter(
            (e) =>
              new Date(e.createdtimestamp).getDate() ==
              new Date(element).getDate()
          );
          const format = {
            date: element,
            ...attendance[0],
          };
          newArr.push(format);
        }
        let latestDate = new Date(
          json[json.length - 1].createdtimestamp
        ).getDate();
        let currentDate = new Date().getDate();
        if (json) {
          setMonthData([...newArr]);
          if (
            json[json.length - 1].punchIn != null &&
            latestDate == currentDate
          ) {
            setLogOut(true);
          } else {
            setLogOut(false);
          }
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm.toUpperCase();
    return strTime;
  }

  const renderItem = ({ item }) => {
    var punchIntime = new Date("February 04, 2011 " + item?.punchIn);
    var punchOuttime = new Date("February 04, 2011 " + item?.punchOut);
    var options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    var punchInString = punchIntime.toLocaleString("en-US", options);
    var punchOutString = punchOuttime.toLocaleString("en-US", options);
    const date = new Date(item?.date);
    const day = date.getDate();
    const weekDay = date.getDay();
    if (
      day == currentDay &&
      date.getMonth() == new Date().getMonth() &&
      date.getFullYear() == new Date().getFullYear()
    ) {
      return (
        <Swipeable
          style={styles.swipeableView}
          rightButtons={
            item?.punchIn == null ? rightButtons : rightButtonsPunchOut
          }
        >
          <TouchableOpacity
            onPress={() => {
              !item?.punchOut && setAttendance(true);
            }}
            style={{
              ...(item?.isAbsent == 1
                ? styles.leaveShadowView
                : item?.holiday == 1
                ? styles.holidayShadowView
                : styles.shadowView),
              backgroundColor: "#c4c4c4",
            }}
          >
            <View style={styles.dateDayMasterView}>
              <View style={styles.dateDayView}>
                <Text style={styles.dateDayTxt}>{day}</Text>
                <Text style={styles.dateDayTxt}>
                  {weekdays[weekDay]?.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.employeeLeaveView}>
              {item?.isAbsent == 1 || item?.holiday == 1 ? (
                <View style={styles.elView}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.elTxt,
                      fontSize:
                        item?.isAbsent == 1 ? 14 : item?.holiday == 1 ? 12 : 14,
                    }}
                  >
                    {item?.isAbsent == 1
                      ? "EL"
                      : item?.holiday == 1
                      ? "Holiday"
                      : ""}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={styles.punchMasterView}>
              <View style={styles.punchInView}>
                <Text style={styles.punchTitle}>{"Punch In"}</Text>
                <Text style={styles.punchTime}>
                  {item?.punchIn == null
                    ? "··:·· AM"
                    : Platform.OS === "ios"
                    ? punchInString
                    : formatAMPM(punchIntime)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.punchInView}>
                <Text style={styles.punchTitle}>{"Punch Out"}</Text>
                <Text style={styles.punchTime}>
                  {item?.punchOut == null
                    ? "··:·· PM"
                    : Platform.OS === "ios"
                    ? punchOutString
                    : formatAMPM(punchOuttime)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    } else {
      return (
        <View style={styles.swipeableView}>
          <View
            style={
              item?.isAbsent == 1
                ? styles.leaveShadowView
                : item?.holiday == 1
                ? styles.holidayShadowView
                : styles.shadowView
            }
          >
            <View style={styles.dateDayMasterView}>
              <View style={styles.dateDayView}>
                <Text style={styles.dateDayTxt}>{day}</Text>
                <Text style={styles.dateDayTxt}>
                  {weekdays[weekDay].toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.employeeLeaveView}>
              {item?.isAbsent == 1 || item?.holiday == 1 ? (
                <View style={styles.elView}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.elTxt,
                      fontSize:
                        item?.isAbsent == 1 ? 14 : item?.holiday == 1 ? 12 : 14,
                    }}
                  >
                    {item?.isAbsent == 1
                      ? "EL"
                      : item?.holiday == 1
                      ? "Holiday"
                      : ""}
                  </Text>
                </View>
              ) : null}
            </View>
            <View style={styles.punchMasterView}>
              <View style={styles.punchInView}>
                <Text style={styles.punchTitle}>{"Punch In"}</Text>
                <Text style={styles.punchTime}>
                  {item?.punchIn == null
                    ? "··:·· AM"
                    : Platform.OS === "ios"
                    ? punchInString
                    : formatAMPM(punchIntime)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.punchInView}>
                <Text style={styles.punchTitle}>{"Punch Out"}</Text>
                <Text style={styles.punchTime}>
                  {item?.punchOut == null
                    ? "··:·· PM"
                    : Platform.OS === "ios"
                    ? punchOutString
                    : formatAMPM(punchOuttime)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }
  };

  const rightButtons = [
    <TouchableHighlight
      onPress={() => {
        setAttendance(true);
      }}
      style={styles.rightButtonsView}
    >
      <Text style={styles.punchInTxt}>Punch In</Text>
    </TouchableHighlight>,
  ];
  const rightButtonsPunchOut = [
    <TouchableHighlight
      onPress={() => {
        setAttendance(true);
      }}
      style={styles.rightButtonsView}
    >
      <Text style={styles.punchOutTxt}>Punch Out</Text>
    </TouchableHighlight>,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <VerifyAttendance
        visible={attendance}
        showReason={reason}
        logOut={logOut}
        inVisible={() => {
          // getAttendance();
          setAttendance(false);
        }}
        onLogin={() => {
          setAttendance(false);
          setTimeout(() => {
            setShowModal(true);
          }, 250);
        }}
      />
      <AttendanceFromSelf
        visible={showModal}
        showReason={reason}
        inVisible={() => {
          getAttendance();
          setShowModal(false);
        }}
      />
      <View style={styles.headerView}>
        <TouchableOpacity
          onPress={() => {
            var d = currentMonth;
            d.setMonth(d.getMonth() - 1);
            setCurrentMonth(new Date(d));
          }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={Colors.RED} />
          <Text style={{ color: Colors.RED }}>
            {previousMonth(currentMonth)}
          </Text>
        </TouchableOpacity>

        <Text style={{ color: Colors.RED }}>{selectedMonth(currentMonth)}</Text>
        <TouchableOpacity
          onPress={() => {
            var d = currentMonth;
            d.setMonth(d.getMonth() + 1);
            setCurrentMonth(new Date(d));
          }}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ color: Colors.RED }}>{nextMonth(currentMonth)}</Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={20}
            color={Colors.RED}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={monthData}
        nestedScrollEnabled
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
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
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    paddingVertical: 15,
  },
  dateDayView: {
    width: "85%",
    backgroundColor: "lightgrey",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 6,
    justifyContent: "space-evenly",
    height: 40,
  },
  dateDayTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateDayMasterView: {
    width: "15%",
    justifyContent: "center",
  },
  employeeLeaveView: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  elTxt: {
    color: "#fff",
    padding: 2.5,
    fontWeight: "700",
    fontSize: 14,
  },
  punchMasterView: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  punchInView: {
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
  },
  punchTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#646464",
  },
  punchTime: {
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 40,
    borderWidth: 0.5,
    borderColor: "#646464",
  },
  elView: {
    backgroundColor: Colors.RED,
    borderRadius: 2.5,
  },
  shadowView: {
    ...GlobalStyle.shadow,
    flexDirection: "row",
    width: "95%",
    height: 65,
    alignSelf: "center",
    padding: 7,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  leaveShadowView: {
    ...GlobalStyle.shadow,
    flexDirection: "row",
    width: "95%",
    height: 65,
    alignSelf: "center",
    padding: 7,
    backgroundColor: "#d3d3d3",
    borderRadius: 10,
  },
  holidayShadowView: {
    ...GlobalStyle.shadow,
    flexDirection: "row",
    width: "95%",
    height: 65,
    alignSelf: "center",
    padding: 7,
    backgroundColor: "#ffcccb",
    borderRadius: 10,
  },
  swipeableView: {
    width: "98%",
    marginVertical: 5,
    marginHorizontal: "2%",
  },
  rightButtonsView: {
    ...GlobalStyle.shadow,
    backgroundColor: "#646464",
    height: 65,
    width: "18%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  punchInTxt: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  punchOutTxt: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
