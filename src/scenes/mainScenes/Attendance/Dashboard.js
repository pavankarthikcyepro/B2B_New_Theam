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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { DropDownComponant } from "../../../components";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import { ActivityIndicator, Button, IconButton } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import { DropDownSelectionItem } from "../../../pureComponents";
import { AttendanceTopTabNavigatorIdentifiers } from "../../../navigations/attendanceTopTabNavigator";
import PieChart from "react-native-pie-chart";

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
const image = "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg";
const chartHeight = itemWidth - 20;
const overlayViewHeight = chartHeight - 10;

const AttendanceDashboard = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.homeReducer);
  const [loading, setLoading] = useState(false);
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dropDownData, setDropDownData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    name: "",
    id: 0,
  });
  const [selectedDealerCode, setSelectedDealerCode] = useState({
    name: "",
    id: 0,
  });
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    name: "",
    id: 0,
  });
  const [selectedKey, setSelectedKey] = useState("");
  const [allParameters, setAllParameters] = useState([]);
  const [dropdownList, setDropdownList] = useState({});
  const [employeeList, setEmployeeList] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // getInitialParameters();
    getEmployeeList();
  }, []);

  useEffect(() => {
    if (selectedLocation.id != 0 && selectedDealerCode.id != 0) {
      getEmployeeList();
    }
  }, [selectedLocation, selectedDealerCode]);

  useEffect(() => {
    if (selector.selectedIDS.length > 0) {
      getEmployeeList(selector.selectedIDS);
    }
  }, [selector.selectedIDS]);

  const getInitialParameters = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const response = await client.get(
          URL.ORG_HIRARCHY(jsonObj.orgId, jsonObj.branchId)
        );
        const json = await response.json();
        setDropdownList(json);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployeeList = async (data) => {
    try {
      //   setLoading(true);
      setEmployeeList({});
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        // let payload =
        //   data.length > 0
        //     ? data
        //     : [(selectedLocation.id, selectedDealerCode.id)];
        // const response = await client.post(
        //   URL.GET_EMPLOYEES_DROP_DOWN_DATA_FOR_ATTENDANCE(
        //     jsonObj.orgId,
        //     jsonObj.empId
        //   ),
        //   payload
        // // );
        // const json = await response.json();
        let newPayload = {
          userId: 942,
          orgId: "18",
          startDate: "2023-01-01",
          endDate: "2023-01-15",
        };
        const response2 = await client.post(
          URL.GET_TEAM_ATTENDANCE_COUNT(),
          newPayload
        );
        const json = await response2.json();
        let newData = [
          { label: "Present", value: json?.totalData?.totalPresent || 0 },
          { label: "Leave", value: json?.totalData?.totalAbsent || 0 },
          { label: "WFH", value: json?.totalData?.totalWFH || 0 },
          { label: "No Logged", value: json?.totalData?.totalNotLoggedIn || 0 },
        ];
        setChartData(newData);
        // if (!json.status) {
        //   setEmployeeList(json);
        // }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const dropDownItemClicked = async (item) => {
    setSelectedKey(item);
    switch (item) {
      case "Location":
        setDropDownData(dropdownList["Location"].sublevels);
        break;
      case "Dealer Code":
        setDropDownData(dropdownList["Dealer Code"].sublevels);
        break;
      case "Month & Years":
        setDropDownData(dropdownList["Dealer Code"].sublevels);
        break;
      default:
        break;
    }
    setShowDropDownModel(true);
  };

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
        {/* <PIEICON width={chartHeight} height={chartHeight} /> */}
        {/* // Overlay View */}
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
      <DropDownComponant
        visible={showDropDownModel}
        multiple={false}
        headerTitle={"Select"}
        data={dropDownData}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          let newdata = { name: item.name, id: item.id };
          switch (selectedKey) {
            case "Location":
              setSelectedLocation(newdata);
              break;
            case "Dealer Code":
              setSelectedDealerCode(newdata);
              break;
            case "Month & Years":
              setSelectedMonthYear(newdata);
              break;
            default:
              break;
          }
          setShowDropDownModel(false);
        }}
      />
      <View
        style={{
          width: "95%",
          alignSelf: "center",
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-around",
          ...GlobalStyle.shadow,
        }}
      >
        {chartData.length > 0 &&
          chartData.map((item) => {
            return renderAttendance(item);
          })}
      </View>

      {/* <View style={{ width: "95%", alignSelf: "center", marginTop: 10 }}> */}
      {/* <View style={{ marginVertical: 5 }}>
          <DropDownSelectionItem
            label={"Location"}
            value={selectedLocation.name}
            onPress={() => dropDownItemClicked("Location")}
            takeMinHeight={true}
          />
        </View>
        <View style={{ marginVertical: 5 }}>
          <DropDownSelectionItem
            label={"Dealer Code"}
            value={selectedDealerCode.name}
            onPress={() => dropDownItemClicked("Dealer Code")}
            takeMinHeight={true}
          />
        </View> */}
      {/* <View style={{ marginVertical: 5 }}>
          <DropDownSelectionItem
            label={"Month & Years"}
            value={selectedMonthYear.name}
            onPress={() => dropDownItemClicked("Month & Years")}
            takeMinHeight={true}
          />
        </View> */}
      {/* </View> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading && (
          <View>
            <ActivityIndicator size="large" color={Colors.RED} />
          </View>
        )}
        {Object.keys(employeeList).map(function (key, index) {
          return (
            <View style={{ flexDirection: "column", marginVertical: 10 }}>
              {Object.values(employeeList)[index].length > 0 && (
                <View>
                  <Text
                    style={{ fontSize: 15, fontWeight: "700", marginLeft: 20 }}
                  >
                    {Object.keys(employeeList)[index]}
                  </Text>
                </View>
              )}
              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                {Object.values(employeeList)[index].map(
                  (innerItem, innerIndex) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(
                            AttendanceTopTabNavigatorIdentifiers.team_attendance,
                            {
                              empId: innerItem.code,
                              orgId: innerItem.orgId || 18,
                              branchId: innerItem.branch || 286,
                              empName: innerItem.name || "",
                              profilePic: innerItem.docPath || image,
                            }
                          );
                        }}
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{
                            ...GlobalStyle.shadow,
                            ...styles.profilePicBG,
                          }}
                        >
                          <Image
                            style={styles.profilePic}
                            source={{
                              uri: innerItem.docPath || image,
                            }}
                          />
                        </View>
                        <Text
                          numberOfLines={1}
                          style={{
                            textAlign: "center",
                            width: profileWidth + 10,
                          }}
                        >
                          {innerItem.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AttendanceDashboard;

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
    margin: 10,
  },
});
