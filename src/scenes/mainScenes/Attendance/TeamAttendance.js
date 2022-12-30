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

import {
  DatePickerComponent,
  DateRangeComp,
  DropDownComponant,
  LoaderComponent,
} from "../../../components";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import { Button, IconButton } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import { DropDownSelectionItem } from "../../../pureComponents";
import { AttendanceTopTabNavigatorIdentifiers } from "../../../navigations/attendanceTopTabNavigator";
import { getUserWiseTargetParameters } from "../../../redux/homeReducer";

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
const profileWidth = screenWidth / 8;
const profileBgWidth = profileWidth + 5;

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

const TeamAttendanceScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dropDownData, setDropDownData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDealerCode, setSelectedDealerCode] = useState("");
  const [selectedMonthYear, setSelectedMonthYear] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [allParameters, setAllParameters] = useState([]);

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
  }, []);

  const getInitialParameters = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const payload = getEmployeePayload(employeeData, jsonObj);
        Promise.all([dispatch(getUserWiseTargetParameters(payload))])
          .then(async (res) => {
            let originalData = res[0].payload.employeeTargetAchievements;
            if (originalData.length > 0) {
              let myParams = [
                ...originalData.filter((item) => item.empId === jsonObj.empId),
              ];
              myParams[0] = {
                ...myParams[0],
                isOpenInner: false,
                employeeTargetAchievements: [],
                // targetAchievements: newArray,
                // tempTargetAchievements: newArray,
              };
              setAllParameters(myParams);
            }
          })
          .catch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployeePayload = (employeeData, item) => {
    const jsonObj = JSON.parse(employeeData);
    const dateFormat = "YYYY-MM-DD";
    const currentDate = moment().format(dateFormat);
    const monthFirstDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .startOf("month")
      .format(dateFormat);
    const monthLastDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .endOf("month")
      .format(dateFormat);
    return {
      orgId: jsonObj.orgId,
      selectedEmpId: item.empId || item.id,
      endDate: monthLastDate,
      loggedInEmpId: jsonObj.empId,
      empId: item.empId || item.id,
      startDate: monthFirstDate,
      levelSelected: null,
      pageNo: 0,
      size: 100,
    };
  };

  const dropdownList = [{ name: "JP Nagar" }, { name: "HCR" }];

  const dropDownItemClicked = async (item) => {
    setSelectedKey(item);
    setShowDropDownModel(true);
  };

  const onEmployeeNameClick = async (item, index, lastParameter) => {
    try {
      let localData = [...allParameters];
      let current = lastParameter[index].isOpenInner;
      console.log("KKKKKK", current);
      for (let i = 0; i < lastParameter.length; i++) {
        lastParameter[i].isOpenInner = false;
        if (i === lastParameter.length - 1) {
          lastParameter[index].isOpenInner = !current;
        }
      }
      if (!current) {
        let employeeData = await AsyncStore.getData(
          AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        if (employeeData) {
          const jsonObj = JSON.parse(employeeData);
          const payload = getEmployeePayload(employeeData, item);
          Promise.all([dispatch(getUserWiseTargetParameters(payload))]).then(
            async (res) => {
              let tempRawData = [];
              tempRawData = res[0]?.payload?.employeeTargetAchievements.filter(
                (emp) => emp.empId !== item.empId
              );
              let newIds = res[0]?.payload?.employeeTargetAchievements.map(
                (emp) => emp.empId
              );
              if (tempRawData.length > 0) {
                for (let i = 0; i < tempRawData.length; i++) {
                  // tempRawData[i].empName = tempRawData[i].empName,
                  tempRawData[i] = {
                    ...tempRawData[i],
                    isOpenInner: false,
                    employeeTargetAchievements: [],
                    // tempTargetAchievements: tempRawData[i]?.targetAchievements,
                  };
                }
              }
              console.log("tempRawData", tempRawData);
              setAllParameters([...tempRawData]);
            }
          );
        }
      } else {
        setAllParameters([...tempRawData]);
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <DropDownComponant
        visible={showDropDownModel}
        multiple={false}
        headerTitle={"Select"}
        data={dropdownList}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          switch (selectedKey) {
            case "Location":
              setSelectedLocation(item.name);
              break;
            case "Dealer Code":
              setSelectedDealerCode(item.name);
              break;
            case "Month & Years":
              setSelectedMonthYear(item.name);
              break;
            default:
              break;
          }
          setShowDropDownModel(false);
        }}
      />
      <View style={{ width: "95%", alignSelf: "center", marginTop: 10 }}>
        <View style={{ marginVertical: 5 }}>
          <DropDownSelectionItem
            label={"Location"}
            value={selectedLocation}
            onPress={() => dropDownItemClicked("Location")}
            takeMinHeight={true}
          />
        </View>
        <View style={{ marginVertical: 5 }}>
          <DropDownSelectionItem
            label={"Dealer Code"}
            value={selectedDealerCode}
            onPress={() => dropDownItemClicked("Dealer Code")}
            takeMinHeight={true}
          />
        </View>
        <View style={{ marginVertical: 5 }}>
          <DropDownSelectionItem
            label={"Month & Years"}
            value={selectedMonthYear}
            onPress={() => dropDownItemClicked("Month & Years")}
            takeMinHeight={true}
          />
        </View>
      </View>
      <ScrollView>
        {/* {allParameters.map((item, index) => {
          return (
            <>
              <View>
                <Text
                  onPress={async () => {
                    let localData = [...allParameters];
                    await onEmployeeNameClick(item, index, localData);
                  }}
                  style={{ textAlign: "center" }}
                >
                  {item.empName}
                </Text>
              </View>
              {item.isOpenInner &&
                item.employeeTargetAchievements.length > 0 &&
                item.employeeTargetAchievements.map(
                  (innerItem1, innerIndex1) => {
                    return (
                      <>
                        <View>
                          <Text
                            onPress={async () => {
                              let localData = [...allParameters];
                              await onEmployeeNameClick(
                                innerItem1,
                                innerIndex1,
                                localData
                              );
                            }}
                            style={{ textAlign: "center" }}
                          >
                            {innerItem1.empName}
                          </Text>
                        </View>
                      </>
                    );
                  }
                )}
            </>
          );
        })} */}
        {data.map((item, index) => {
          return (
            <View style={{ flexDirection: "column", marginVertical: 10 }}>
              <View>
                <Text
                  style={{ fontSize: 15, fontWeight: "700", marginLeft: 20 }}
                >
                  {item.role}
                </Text>
              </View>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                {item.employee.map((innerItem, innerIndex) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.jumpTo(
                          AttendanceTopTabNavigatorIdentifiers.leave,
                          {
                            empId: innerItem.empId,
                            orgID: innerItem.orgID,
                          }
                        );
                      }}
                      style={{ alignItems: "center", justifyContent: "center" }}
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
                            uri: innerItem.profilePic,
                          }}
                        />
                      </View>
                      <Text style={{ textAlign: "center" }}>
                        {innerItem.empName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
      <LoaderComponent visible={loading} />
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
