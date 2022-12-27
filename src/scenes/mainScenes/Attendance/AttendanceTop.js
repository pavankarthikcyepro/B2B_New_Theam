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
import { useSafeAreaFrame } from "react-native-safe-area-context";
import VerifyAttendance from "../../../components/VerifyAttendance";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
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

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => <MenuIcon navigation={navigation} />,
  //   });
  // }, [navigation]);

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

  const renderItem = ({ item }) => {
    return (
      <Swipeable style={styles.swipeableView} rightButtons={rightButtons}>
        <View style={styles.shadowView}>
          <View style={styles.dateDayMasterView}>
            <View style={styles.dateDayView}>
              <Text style={styles.dateDayTxt}>{"01"}</Text>
              <Text style={styles.dateDayTxt}>{"MON"}</Text>
            </View>
          </View>
          <View style={styles.employeeLeaveView}>
            <View style={styles.elView}>
              <Text style={styles.elTxt}>{"EL"}</Text>
            </View>
          </View>
          <View style={styles.punchMasterView}>
            <View style={styles.punchInView}>
              <Text style={styles.punchTitle}>{"Punch In"}</Text>
              <Text style={styles.punchTime}>{"10:30 AM"}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.punchInView}>
              <Text style={styles.punchTitle}>{"Punch Out"}</Text>
              <Text style={styles.punchTime}>{"10:30 PM"}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  const rightButtons = [
    <TouchableHighlight
      onPress={() => {
        setAttendance(true);
      }}
      style={{
        backgroundColor: "#646446",
        height: 65,
        width: "18%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
        Punch In
      </Text>
    </TouchableHighlight>,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <VerifyAttendance
        visible={attendance}
        showReason={reason}
        inVisible={() => {
          getAttendance();
          setAttendance(false);
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
  swipeableView: {
    width: "98%",
    marginVertical: 5,
    marginHorizontal: "2%",
  },
});
