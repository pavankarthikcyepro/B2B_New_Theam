import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";

import { LoaderComponent } from "../../../components";
import { Colors } from "../../../styles";
import { client } from "../../../networking/client";
import URL, { baseUrl } from "../../../networking/endpoints";
import { Calendar } from "react-native-calendars";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import { HomeStackIdentifiers } from "../../../navigations/appNavigator";
import { monthNamesCap } from "../Attendance/AttendanceTop";
import { SceneMap, TabView } from "react-native-tab-view";
import {
  DISTANCE,
  FULL_TIME,
  TRAVEL_TIME,
  TRIP_ICON,
} from "../../../assets/icon";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 6;
const profileBgWidth = profileWidth + 5;
const layout = {
  "This Week": {
    trips: 0,
    travelDistance: 0,
    travelTime: 0,
    startTime: "NA",
    endTime: "NA",
  },
  Today: {
    trips: 0,
    travelDistance: 0,
    travelTime: 0,
    startTime: "00:00:00 AM",
    endTime: "00:00:00 PM",
  },
  "This Month": {
    trips: 0,
    travelDistance: 0,
    travelTime: 0,
    startTime: "NA",
    endTime: "NA",
  },
};

const EmployeeLocationsScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [marker, setMarker] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [stats, setStats] = useState(layout);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log("route.params", route.params);
  }, [route.params]);

  useEffect(() => {
    navigation.setOptions({
      title: route?.params?.name
        ? route?.params?.name + "'s Geolocation"
        : "Geolocation",
    });
  }, [navigation]);

  useEffect(() => {
    setLoading(true);
    getAttendance(route.params);
  }, [currentMonth]);

  useEffect(() => {
    if (route.params) {
      getTabBarData(route.params);
    }
  }, [route.params]);

  const getTabBarData = async (params) => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const response = await client.get(
          URL.GEOLOCATION_DETAILS(params.empId, params.orgId)
        );
        const json = await response.json();
        if (response.ok) {
          setStats(json);
        } else {
          setStats(layout);
        }
      }
    } catch (error) {}
  };

  const getAttendance = async (params) => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        var d = currentMonth;
        const response = await client.get(
          URL.GET_ATTENDANCE_EMPID(
            params.empId,
            params.orgId,
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
              // marked: true,
              // dotColor: element.isPresent === 1 ? Colors.GREEN : Colors.RED,
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
            // let weekReport = {
            //   start: formatedDate,
            //   // duration: "00:20:00",
            //   note: element.comments,
            //   reason: element.reason,
            //   color: element.isPresent === 1 ? Colors.GREEN : "#ff5d68",
            //   status: element.isPresent === 1 ? "Present" : "Absent",
            // };
            dateArray.push(formatedDate);
            newArray.push(format);
            // weekArray.push(weekReport);
          }
          var obj = {};
          for (let i = 0; i < newArray.length; i++) {
            const element = newArray[i];
            obj[dateArray[i]] = element;
          }
          setLoading(false);
          // setWeeklyRecord(weekArray);
          setMarker(obj);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const isCurrentDate = (day) => {
    let selectedDate = day.dateString;
    navigation.navigate(HomeStackIdentifiers.location, {
      empId: route.params.empId,
      orgId: route.params.orgId,
      date: selectedDate,
    });
  };
  const handleTabPress = (index) => {
    setIndex(index);
  };

  const renderTabBar = (props) => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            style={[styles.tabItem, index === i && styles.activeTab]}
            onPress={() => handleTabPress(i)}
          >
            <Text style={[styles.tabText, index === i && styles.activeTabTxt]}>
              {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const Card = ({ title, value, icon }) => {
    return (
      <View
        style={[
          {
            borderRadius: 12,
            borderColor: Colors.BLACK,
            justifyContent: "space-around",
            padding: 10,
            backgroundColor: Colors.WHITE,
            shadowColor: Colors.DARK_GRAY,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowRadius: 2,
            shadowOpacity: 0.5,
            elevation: 3,
            width: "45%",
          },
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 12,
              backgroundColor: "#ffb6c1",
              borderRadius: 25,
            }}
          >
            <Image
              source={icon}
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
            />
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ color: Colors.BLACK, fontSize: 15 }}>{title}</Text>
          <Text
            disabled={title === "Trips" ? false : true}
            onPress={() => {}}
            style={{
              color: Colors.RED,
              fontSize: 14,
              fontWeight: "bold",
              marginTop: 5,
              textDecorationLine: title === "Trips" ? "underline" : "none",
              textDecorationColor: Colors.RED,
            }}
          >
            {value}
          </Text>
        </View>
      </View>
    );
  };

  function formattedDate(params) {
    if (params === "NA") {
      return params;
    } else {
      const formattedTime = moment(params, "hh:mm:ss A").format("hh:mm a");
      return formattedTime;
    }
  }

  function formattedTime(diffInSeconds) {
    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours}hr ${minutes}min ${seconds}sec`;
  }

  const commonTab = () => (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginTop: 10,
        }}
      >
        <Card title={"Trips"} value={stats["Today"].trips} icon={TRIP_ICON} />
        <Card
          title={"Start & End Time"}
          value={
            formattedDate(stats["Today"].startTime) +
            " - " +
            formattedDate(stats["Today"].endTime)
          }
          icon={FULL_TIME}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <Card
          title={"Travel Distance"}
          value={stats["Today"].travelDistance + " KM"}
          icon={DISTANCE}
        />
        <Card
          title={"Travel Time"}
          value={formattedTime(stats["Today"].travelTime)}
          icon={TRAVEL_TIME}
        />
      </View>
    </ScrollView>
  );

  const commonTab1 = () => (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginTop: 10,
        }}
      >
        <Card
          title={"Trips"}
          value={stats["This Week"].trips}
          icon={TRIP_ICON}
        />
        <Card
          title={"Start & End Time"}
          value={
            formattedDate(stats["This Week"].startTime) +
            " - " +
            formattedDate(stats["This Week"].endTime)
          }
          icon={FULL_TIME}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <Card
          title={"Travel Distance"}
          value={stats["This Week"].travelDistance + " KM"}
          icon={DISTANCE}
        />
        <Card
          title={"Travel Time"}
          value={formattedTime(stats["This Week"].travelTime)}
          icon={TRAVEL_TIME}
        />
      </View>
    </ScrollView>
  );

  const commonTab2 = () => (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginTop: 10,
        }}
      >
        <Card
          title={"Trips"}
          value={stats["This Month"].trips}
          icon={TRIP_ICON}
        />
        <Card
          title={"Start & End Time"}
          value={
            formattedDate(stats["This Month"].startTime) +
            " - " +
            formattedDate(stats["This Month"].endTime)
          }
          icon={FULL_TIME}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <Card
          title={"Travel Distance"}
          value={stats["This Month"].travelDistance + " KM"}
          icon={DISTANCE}
        />
        <Card
          title={"Travel Time"}
          value={formattedTime(stats["This Month"].travelTime)}
          icon={TRAVEL_TIME}
        />
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    tab1: commonTab,
    tab2: commonTab1,
    tab3: commonTab2,
  });
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
            "stylesheet.calendar.header": {
              dayTextAtIndex0: {
                color: Colors.GRAY,
              },
              dayTextAtIndex6: {
                color: Colors.GRAY,
              },
            },
            "stylesheet.day.basic": {
              dayTextAtIndex0: {
                color: Colors.GRAY,
              },
              dayTextAtIndex6: {
                color: Colors.GRAY,
              },
            },
            arrowColor: Colors.RED,
            dotColor: Colors.RED,
            textMonthFontWeight: "500",
            monthTextColor: Colors.RED,
            indicatorColor: Colors.RED,
            dayTextColor: Colors.BLACK,
            selectedDayBackgroundColor: Colors.GRAY,
            textDayFontWeight: "500",
            textDayStyle: {
              color: Colors.BLACK,
            },
            textSectionTitleColor: Colors.BLACK,
          }}
          markingType={"custom"}
          markedDates={marker}
        />
      </View>
      <LoaderComponent visible={loading} />
      <TabView
        navigationState={{
          index,
          routes: [
            { key: "tab1", title: "Today" },
            { key: "tab2", title: "This Week" },
            { key: "tab3", title: "This Month" },
          ],
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
      />
    </SafeAreaView>
  );
};

export default EmployeeLocationsScreen;

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
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    backgroundColor: Colors.BORDER_COLOR,
    width: "95%",
    alignSelf: "center",
    borderRadius: 5,
    height: 35,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    width: "23.75%",
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: Colors.RED,
  },
  tabText: {
    fontSize: 13,
    color: Colors.BLACK,
    fontWeight: "600",
  },
  activeTabTxt: { color: Colors.WHITE },
  tabContent: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});
