import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";

import { LoaderComponent } from "../../../components";
import { Colors } from "../../../styles";
import { client } from "../../../networking/client";
import URL, { baseUrl } from "../../../networking/endpoints";
import { Calendar } from "react-native-calendars";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import { MenuIcon } from "../../../navigations/appNavigator";
import { GeolocationTopTabNavigatorIdentifiers } from "../../../navigations/geolocationNavigator";
import { monthNamesCap } from "../Attendance/AttendanceTop";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 6;
const profileBgWidth = profileWidth + 5;

const GeoLocationScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState({});
  const [userData, setUserData] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon navigation={navigation} />,
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    getAttendance();
  }, [currentMonth]);

  const getAttendance = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        var d = currentMonth;
        setUserData(jsonObj);
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
                    element.isPresent === 1 ? Colors.RED : Colors.GRAY,
                },
                text: {
                  color: Colors.WHITE,
                  fontWeight: "bold",
                },
              },
            };

            let date = new Date(element.createdtimestamp);
            let formatedDate = moment(date).format(dateFormat);
            dateArray.push(formatedDate);
            newArray.push(format);
          }
          var obj = {};
          for (let i = 0; i < newArray.length; i++) {
            const element = newArray[i];
            obj[dateArray[i]] = element;
          }
          setLoading(false);
          setMarker(obj);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const isCurrentDate = (day) => {
    let selectedDate = day.dateString;
    navigation.navigate(GeolocationTopTabNavigatorIdentifiers.tripList, {
      empId: userData.empId,
      orgId: userData.orgId,
      date: selectedDate,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Calendar
          onDayPress={(day) => {
            isCurrentDate(day);
          }}
          onDayLongPress={(day) => {}}
          monthFormat={"MMM yyyy"}
          onMonthChange={(month) => {
            setCurrentMonth(new Date(month.dateString));
          }}
          hideExtraDays={true}
          // firstDay={1}
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
