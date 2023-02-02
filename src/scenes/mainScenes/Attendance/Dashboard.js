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
  ScrollView,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  DatePickerComponent,
  DateRangeComp,
  DropDownComponant,
} from "../../../components";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import { DropDownSelectionItem } from "../../../pureComponents";
import { AttendanceTopTabNavigatorIdentifiers } from "../../../navigations/attendanceTopTabNavigator";
import PieChart from "react-native-pie-chart";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { DateRangeCompOne } from "../../../components/dateRangeComp";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);

const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 8;
const profileBgWidth = profileWidth + 5;

const item1Width = screenWidth - 10;
const item2Width = item1Width - 10;
const baseItemWidth = item2Width / 3.4;
const itemWidth = baseItemWidth - 10;

const series = [60, 40];
const sliceColor = ["#5BBD66", Colors.RED];
const chartHeight = itemWidth - 20;
const overlayViewHeight = chartHeight - 10;

const AttendanceDashboard = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [todaysLeave, setTodaysLeave] = useState([]);
  const [todaysPresent, setTodaysPresent] = useState([]);
  const [todaysWFH, setTodaysWFH] = useState([]);
  const [todaysNoLogged, setTodaysNoLogged] = useState([]);
  const [selectedFromDate, setSelectedFromDate] = useState(currentDate);
  const [selectedToDate, setSelectedToDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");

  const fromDateRef = useRef(selectedFromDate);
  const toDateRef = useRef(selectedToDate);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Present" },
    { key: "second", title: "Leave" },
    { key: "third", title: "WFH" },
    { key: "fourth", title: "No Logged" },
  ]);

  useEffect(() => {
    // setFromDateState(lastMonthFirstDate);
    // setToDateState(currentDate);
    // getEmployeeList(lastMonthFirstDate, currentDate);
  }, []);

  useEffect(() => {
    // setFromDateState(lastMonthFirstDate);
    // setToDateState(currentDate);
    // getEmployeeList(lastMonthFirstDate, currentDate);
    navigation.addListener("focus", () => {
      if (route?.params?.params) {
        setFromDateState(route?.params?.params?.fromDate);
        getChartData(
          route?.params?.params?.fromDate,
          route?.params?.params?.fromDate,
          route?.params?.params?.selectedID,
          route?.params?.params?.orgId
        );
      } else {
        getEmployeeList(currentDate);
      }
    });
  }, [route.params]);

  useEffect(() => {
    if (selector.selectedIDS.length > 0) {
      // getEmployeeList(selector.selectedIDS);
    }
  }, [selector.selectedIDS]);

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

  const getChartData = async (start, end, id, orgId) => {
    try {
      setLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let newPayload = {
          userId: id ? id : jsonObj.empId,
          orgId: orgId ? orgId : jsonObj.orgId,
          date: start,
        };
        const response2 = await client.post(
          URL.GET_TEAM_ATTENDANCE_COUNT(),
          newPayload
        );
        const json = await response2.json();
        if (json) {
          let newData = [
            { label: "Present", value: json?.data?.totalPresent || 0 },
            { label: "Leave", value: json?.data?.totalAbsent || 0 },
            { label: "WFH", value: json?.data?.totalWFH || 0 },
            {
              label: "No Logged",
              value: json?.data?.totalNotLoggedIn || 0,
            },
          ];
          setChartData(newData);
          let todaysPresent = json.data.users.filter(
            (e) => e.status == "PRESENT"
          );
          let todaysLeave = json.data.users.filter((e) => e.status == "ABSENT");
          let todaysNoLogged = json.data.users.filter(
            (e) => e.status == "NOT LOGGED IN"
          );
          let todaysWFH = json.data.users.filter(
            (e) => e.status == "WORK FROM HOME"
          );
          setTodaysPresent(todaysPresent);
          setTodaysLeave(todaysLeave);
          setTodaysNoLogged(todaysNoLogged);
          setTodaysWFH(todaysWFH);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const getEmployeeList = async (start) => {
    try {
      setLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let newPayload = {
          userId: jsonObj.empId,
          orgId: jsonObj.orgId,
          date: start,
        };
        const response2 = await client.post(
          URL.GET_TEAM_ATTENDANCE_COUNT(),
          newPayload
        );
        const json = await response2.json();
        if (json) {
          let newData = [
            { label: "Present", value: json?.data?.totalPresent || 0 },
            { label: "Leave", value: json?.data?.totalAbsent || 0 },
            { label: "WFH", value: json?.data?.totalWFH || 0 },
            {
              label: "No Logged",
              value: json?.data?.totalNotLoggedIn || 0,
            },
          ];
          setChartData(newData);
          let todaysPresent = json.data.users.filter(
            (e) => e.status == "PRESENT"
          );
          let todaysLeave = json.data.users.filter((e) => e.status == "ABSENT");
          let todaysNoLogged = json.data.users.filter(
            (e) => e.status == "NOT LOGGED IN"
          );
          let todaysWFH = json.data.users.filter(
            (e) => e.status == "WORK FROM HOME"
          );
          setTodaysPresent(todaysPresent);
          setTodaysLeave(todaysLeave);
          setTodaysNoLogged(todaysNoLogged);
          setTodaysWFH(todaysWFH);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const updateSelectedDate = (date, key) => {
    const formatDate = moment(date).format(dateFormat);
    switch (key) {
      case "FROM_DATE":
        setFromDateState(formatDate);
        getChartData(formatDate, formatDate);
        break;
      case "TO_DATE":
        setToDateState(formatDate);
        getChartData(selectedFromDate, formatDate);
        break;
    }
  };

  const FirstRoute = () => <RenderView data={todaysPresent} />;
  const SecondRoute = () => <RenderView data={todaysLeave} />;
  const ThirdRoute = () => <RenderView data={todaysWFH} />;
  const FourthRoute = () => <RenderView data={todaysNoLogged} />;

  const RenderView = ({ data }) => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.tableTitle}>
          <View style={{ flex: 0.25 }}>
            <Text style={styles.tableTitleTxt}>{"Location"}</Text>
          </View>
          <View style={{ flex: 0.25 }}>
            <Text style={styles.tableTitleTxt}>{"Branch"}</Text>
          </View>
          <View style={{ flex: 0.25 }}>
            <Text style={styles.tableTitleTxt}>{"Employee Name"}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <FlatList
          style={{ flex: 1 }}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={() =>
            loading ? (
              <ActivityIndicator size="large" color={Colors.RED} />
            ) : (
              <View style={styles.noDataView}>
                <Text style={styles.tableTitleTxt}>No Data</Text>
              </View>
            )
          }
          ItemSeparatorComponent={() => {
            return <View style={{ height: 10 }} />;
          }}
        />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.titleView}>
        <View style={{ flex: 0.25 }}>
          <Text style={styles.parametersTxt}>{item?.location}</Text>
        </View>
        <View style={{ flex: 0.25 }}>
          <Text style={styles.parametersTxt}>{item?.branch}</Text>
        </View>
        <View style={{ flex: 0.25 }}>
          <Text style={styles.parametersTxt}>{item?.name}</Text>
        </View>
      </View>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
  });

  const renderAttendance = (item) => {
    return (
      <View
        style={{
          width: itemWidth - 10,
          height: 120,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PieChart
          widthAndHeight={chartHeight}
          series={series}
          sliceColor={sliceColor}
        />
        <View
          style={{
            position: "absolute",
            width: overlayViewHeight,
            height: overlayViewHeight,
            borderRadius: overlayViewHeight / 2,
            backgroundColor: Colors.WHITE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            {item.value}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "400",
              textAlign: "center",
            }}
          >
            {item.label}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <View
        style={{
          width: "90%",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ width: "85%", alignSelf: "flex-start" }}>
          <DateRangeCompOne
            fromDate={selectedFromDate}
            toDate={selectedToDate}
            fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
            toDateClicked={() => showDatePickerMethod("TO_DATE")}
          />
        </View>
        <View>
          <IconButton
            icon="filter-outline"
            style={{ padding: 0, margin: 0 }}
            color={Colors.BLACK}
            size={35}
            onPress={() =>
              navigation.navigate(
                AttendanceTopTabNavigatorIdentifiers.dashboardFilter
              )
            }
          />
        </View>
        {/* <Button
          mode="text"
          color={Colors.RED}
          labelStyle={{
            textTransform: "none",
            fontSize: 14,
            fontWeight: "600",
          }}
          onPress={() => {
            setFromDateState("");
            setToDateState("");
            getEmployeeList();
          }}
        >
          Clear
        </Button> */}
      </View>
      <View style={styles.chartView}>
        {chartData.length > 0 &&
          !loading &&
          chartData.map((item) => {
            return renderAttendance(item);
          })}
      </View>
      {loading && (
        <View>
          <ActivityIndicator size="large" color={Colors.RED} />
        </View>
      )}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const renderTabBar = (props) => {
  return (
    <TabBar
      {...props}
      renderLabel={({ focused, route }) => {
        return (
          <Text
            size={20}
            category="Medium"
            style={[
              styles.titleText,
              { color: focused ? Colors.RED : Colors.DARK_GRAY },
            ]}
          >
            {route.title}
          </Text>
        );
      }}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBar}
    />
  );
};
export default AttendanceDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  titleText: {
    fontSize: 12,
    fontWeight: "600",
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
    margin: 10,
  },
  tabBar: {
    backgroundColor: "#ffffff",
    // borderBottomWidth: 1,
    // borderColor: Colors.BLACK,
  },
  indicatorStyle: {
    backgroundColor: Colors.RED,
    padding: 1.5,
    marginBottom: -2,
  },
  titleView: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  parametersTxt: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.DARK_GRAY,
  },
  tableTitle: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  tableTitleTxt: {
    fontSize: 14,
    fontWeight: "bold",
  },
  noDataView: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.BLACK,
    marginBottom: 10,
  },
  chartView: {
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    ...GlobalStyle.shadow,
  },
});
