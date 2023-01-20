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
import { updateTheTeamAttendanceFilter } from "../../../redux/homeReducer";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);

const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 8;
const profileBgWidth = profileWidth + 5;

const image = "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg";

const TeamAttendanceScreen = ({ route, navigation }) => {
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
  const data = [
    {
      role: "Sales Manager",
      employee: [
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 105,
          orgID: 18,
          empName: "Suresh",
        },
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 104,
          orgID: 18,
          empName: "Suresh",
        },
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 106,
          orgID: 18,
          empName: "Suresh",
        },
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 109,
          orgID: 18,
          empName: "Suresh",
        },
      ],
    },
    {
      role: "Sales Consultant",
      employee: [
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 90,
          orgID: 18,
          empName: "Suresh",
        },
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 91,
          orgID: 18,
          empName: "Suresh",
        },
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 92,
          orgID: 18,
          empName: "Suresh",
        },
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 93,
          orgID: 18,
          empName: "Suresh",
        },
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 94,
          orgID: 18,
          empName: "Suresh",
        },
        {
          profilePic:
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg",
          empId: 95,
          orgID: 18,
          empName: "Suresh",
        },
      ],
    },
  ];

  useEffect(() => {
    getInitialParameters();
    // getEmployeeList();
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
      setLoading(true);
      setEmployeeList({});
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let payload =
          data?.length > 0
            ? data
            : [(selectedLocation.id, selectedDealerCode.id)];
        const response = await client.post(
          URL.GET_EMPLOYEES_DROP_DOWN_DATA_FOR_ATTENDANCE(
            jsonObj.orgId,
            jsonObj.empId
          ),
          payload
        );
        const json = await response.json();
        if (!json.status) {
          setEmployeeList(json);
          dispatch(updateTheTeamAttendanceFilter([]));
        }
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
          justifyContent: "space-around",
          marginTop: 10,
          flexDirection: "row",
        }}
      >
        <View style={{ flexDirection: "column", width: "80%" }}>
          <View style={{ marginVertical: 5 }}>
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
          </View>
        </View>

        {/* <View style={{ marginVertical: 5 }}>
          <DropDownSelectionItem
            label={"Month & Years"}
            value={selectedMonthYear.name}
            onPress={() => dropDownItemClicked("Month & Years")}
            takeMinHeight={true}
          />
        </View> */}
        <View>
          <IconButton
            icon="filter-outline"
            style={{ padding: 0, margin: 0 }}
            color={Colors.BLACK}
            size={35}
            onPress={() =>
              navigation.navigate(AttendanceTopTabNavigatorIdentifiers.filter)
            }
          />
        </View>
      </View>

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

export default TeamAttendanceScreen;

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
