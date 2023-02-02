import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  Alert,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  RefreshControl,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { IconButton, Card, Button } from "react-native-paper";
import VectorImage from "react-native-vector-image";
import { useDispatch, useSelector } from "react-redux";
import { FILTER, SPEED } from "../../../assets/svg";
import { DateItem } from "../../../pureComponents/dateItem";
import { AppNavigator } from "../../../navigations";
import { DateModalComp } from "../../../components/dateModalComp";
import { getMenuList } from "../../../redux/homeReducer";
import { DashboardTopTabNavigator } from "../../../navigations/dashboardTopTabNavigator";
import { TargetSettingsTab } from "../../../navigations/targetSettingsTab";
import { HomeStackIdentifiers } from "../../../navigations/appNavigator";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import { TargetAchivementComp } from "./targetAchivementComp";
import {
  HeaderComp,
  DropDownComponant,
  DatePickerComponent,
} from "../../../components";
import {
  DateSelectItem,
  TargetDropdown,
  DateSelectItemForTargetSettings,
  RadioTextItem,
} from "../../../pureComponents";

import {
  getEmployeesActiveBranch,
  getEmployeesRolls,
  updateStartDate,
  updateEndDate,
  addTargetMapping,
  updateIsTeam,
  getAllTargetMapping,
  getEmployeesDropDownData,
  updateMonth,
  updateTargetType,
  getSpecialDropValue,
  updateSpecial,
  saveFilterPayload,
} from "../../../redux/targetSettingsReducer";

import { updateIsTeamPresent } from "../../../redux/homeReducer";
import { showToast } from "../../../utils/toast";
import { LoaderComponent } from "../../../components";
import Orientation from "react-native-orientation-locker";
import { useIsFocused } from "@react-navigation/native";
import { useIsDrawerOpen } from "@react-navigation/drawer";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 30) / 2;

const widthForBoxItem = (screenWidth - 30) / 3;
const dateFormat = "YYYY-MM-DD";

const BoxComp = ({ width, name, value, iconName, bgColor }) => {
  return (
    <View style={{ width: width, padding: 2 }}>
      <View style={[styles.boxView, { backgroundColor: bgColor }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton
            icon={iconName}
            size={12}
            color={Colors.WHITE}
            style={{ margin: 0, padding: 0 }}
          />
          <Text
            style={{ fontSize: 12, fontWeight: "600", color: Colors.WHITE }}
          >
            {value}
          </Text>
        </View>
        <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.WHITE }}>
          {name}
        </Text>
      </View>
    </View>
  );
};

const titleNames = [
  "Live Bookings",
  "Complaints",
  "Deliveries",
  "Loss In Revenue",
  "Pending Tasks",
];
const iconNames = [
  "shopping",
  "account-supervisor",
  "currency-usd",
  "cart",
  "currency-usd",
];
const colorNames = ["#85b1f4", "#f1ab48", "#79e069", "#e36e7a", "#5acce8"];

const TargetSettingsScreen = ({ route, navigation }) => {
  const homeSelector = useSelector((state) => state.homeReducer);
  const selector = useSelector((state) => state.targetSettingsReducer);
  const dispatch = useDispatch();
  const [salesDataAry, setSalesDataAry] = useState([]);
  const [selectedBranchName, setSelectedBranchName] = useState("");
  const [primaryDepartment, setPrimaryDepartment] = useState("");
  const [hrmsRole, sethrmsRole] = useState("");

  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownData, setDropDownData] = useState(null);
  const [retailData, setRetailData] = useState(null);
  const [dealerRank, setDealerRank] = useState(null);
  const [dealerCount, setDealerCount] = useState(null);
  const [groupDealerRank, setGroupDealerRank] = useState(null);
  const [groupDealerCount, setGroupDealerCount] = useState(null);
  const [isTeamPresent, setIsTeamPresent] = useState(false);
  const [isTeam, setIsTeam] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [datePickerId, setDatePickerId] = useState("");

  const isFocused = useIsFocused();
  const isDrawerOpen = useIsDrawerOpen();

  useEffect(() => {
    if (isFocused || (isFocused && isDrawerOpen)) {
      Orientation.unlockAllOrientations();
    }
  }, [isFocused, isDrawerOpen]);

  useEffect(() => {
    dispatch(saveFilterPayload(route.params));
  }, [route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      initialTask();
    });
    return unsubscribe;
  }, [navigation]);

  const setCurrentMonthDate = async () => {
    return new Promise((resolve) => {
      const dateFormat = "YYYY-MM-DD";
      const currentDate = moment().format(dateFormat);
      let monthArr = [];
      monthArr = selector.monthList.filter((item) => {
        return item.id === new Date().getMonth() + 1;
      });
      if (monthArr.length > 0) {
        dispatch(
          updateMonth({ key: "", value: monthArr[0].name, id: monthArr[0].id })
        );
      }
      const monthFirstDate = moment(currentDate, dateFormat)
        .subtract(0, "months")
        .startOf("month")
        .format(dateFormat);
      const monthLastDate = moment(currentDate, dateFormat)
        .subtract(0, "months")
        .endOf("month")
        .format(dateFormat);
      dispatch(updateStartDate(monthFirstDate));
      setFromDate(monthFirstDate);

      dispatch(updateEndDate(monthLastDate));
      setToDate(monthLastDate);
      resolve();
    });
  };

  const initialTask = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      let hrmsRole = await jsonObj.hrmsRole;
      let primaryDepartment = await jsonObj.primaryDepartment;
      await setPrimaryDepartment(primaryDepartment);
      await sethrmsRole(hrmsRole);
      const payload = {
        orgId: jsonObj.orgId,
        empId: jsonObj.empId,
      };

      const payload3 = {
        orgId: jsonObj.orgId,
        empId: jsonObj.empId,
        selectedIds: [],
      };

      const dateFormat = "YYYY-MM-DD";
      const currentDate = moment().format(dateFormat);
      let monthArr = [];
      monthArr = selector.monthList.filter((item) => {
        return item.id === new Date().getMonth() + 1;
      });
      if (monthArr.length > 0) {
        dispatch(
          updateMonth({ key: "", value: monthArr[0].name, id: monthArr[0].id })
        );
      }
      const monthFirstDate = moment(currentDate, dateFormat)
        .subtract(0, "months")
        .startOf("month")
        .format(dateFormat);
      const monthLastDate = moment(currentDate, dateFormat)
        .subtract(0, "months")
        .endOf("month")
        .format(dateFormat);
      dispatch(updateStartDate(monthFirstDate));
      setFromDate(monthFirstDate);

      dispatch(updateEndDate(monthLastDate));
      setToDate(monthLastDate);
      const payload2 = {
        empId: jsonObj.empId,
        pageNo: 1,
        size: 500,
        startDate: monthFirstDate,
        endDate: monthLastDate,
        // "targetType": selector.targetType
      };
      if (jsonObj.roles.length > 0) {
        let rolesArr = [];
        rolesArr = jsonObj.roles.filter((item) => {
          return (
            item === "Admin Prod" ||
            item === "App Admin" ||
            item === "Manager" ||
            item === "TL" ||
            item === "General Manager" ||
            item === "branch manager" ||
            item === "Testdrive_Manager"
          );
        });
        if (rolesArr.length > 0) {
          dispatch(updateIsTeamPresent(true));
        }
      }

      Promise.all([
        dispatch(
          getSpecialDropValue({
            bu: "1",
            dropdownType: "Specialselection",
            parentId: 0,
          })
        ),
        dispatch(getEmployeesActiveBranch(payload)),
        dispatch(getEmployeesRolls(payload)),
        dispatch(getAllTargetMapping(payload2)),
      ]).then(() => {});
    }
  };

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    switch (key) {
      case "TARGET_MODEL":
        setDataForDropDown(selector.monthList);
        break;
      case "SPECIAL_MODEL":
        setDataForDropDown(selector.specialOcation);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const updateSelectedDate = (date, key) => {
    const formatDate = moment(date).format(dateFormat);
    switch (key) {
      case "START_DATE":
        dispatch(updateStartDate(formatDate));
        setFromDate(formatDate);
        break;
      case "END_DATE":
        dispatch(updateEndDate(formatDate));
        setToDate(formatDate);
        break;
    }
  };

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key);
  };

  const moveToFilter = () => {
    navigation.navigate("FILTER_TARGET_SCREEN", {
      isFromLogin: false,
      fromScreen: "TARGET_PLANNING",
    });
  };

  const onRefresh = () => {
    dispatch(saveFilterPayload({}));
  };

  return (
    <SafeAreaView style={styles.container}>
      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (item && item.id < moment().month() + 1) {
            showToast("Targets cannot be set for previous months.");
            return;
          }
          setShowDropDownModel(false);
          setDropDownData({
            key: dropDownKey,
            value: item.name,
            id: item.id,
          });
          if (selector.targetType === "MONTHLY") {
            dispatch(
              updateMonth({ key: dropDownKey, value: item.name, id: item.id })
            );

            const dateFormat = "YYYY-MM-DD";
            const currentDate = moment().format(dateFormat);
            const splitDate = currentDate.split("-");
            const tempDate = new Date(splitDate[0], item.id - 1, 1, 1, 1, 1);
            const selectedMonthDate = moment(tempDate).format(dateFormat);
            const monthFirstDate = moment(selectedMonthDate, dateFormat)
              .subtract(0, "months")
              .startOf("month")
              .format(dateFormat);
            const monthLastDate = moment(selectedMonthDate, dateFormat)
              .subtract(0, "months")
              .endOf("month")
              .format(dateFormat);
            dispatch(updateStartDate(monthFirstDate));
            setFromDate(monthFirstDate);

            dispatch(updateEndDate(monthLastDate));
            setToDate(monthLastDate);
          } else if (selector.targetType === "SPECIAL") {
            dispatch(
              updateSpecial({
                key: dropDownKey,
                value: item.name,
                id: item.id,
                keyId: item.key,
              })
            );
          }
        }}
      />
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {
          if (Platform.OS === "android") {
            if (selectedDate) {
              updateSelectedDate(selectedDate, datePickerId);
            }
          } else {
            updateSelectedDate(selectedDate, datePickerId);
          }
          setShowDatePicker(false);
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <HeaderComp
        // title={"Monthly Target Planning"}
        title={"Target Planning"}
        // branchName={selectedBranchName}
        menuClicked={() => navigation.openDrawer()}
        filterClicked={() => moveToFilter()}

        // branchClicked={() => moveToSelectBranch()}
      />
      <View style={{ flex: 1, padding: 10 }}>
        <FlatList
          data={[1, 2, 3]}
          listKey={"TOP_FLAT_LIST"}
          keyExtractor={(item, index) => "TOP" + index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={selector.isLoading}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            if (index === 0) {
              return (
                <>
                  {homeSelector.isTeamPresent && !homeSelector.isDSE && (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: "50%",
                          justifyContent: "center",
                          flexDirection: "row",
                          borderColor: Colors.RED,
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 41,
                          marginTop: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            // setIsTeam(true)
                            // if(primaryDepartment === 'Sales')
                            dispatch(updateIsTeam(false));
                            // else showToast('Access Denied')
                          }}
                          style={{
                            width: "50%",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: selector.isTeam
                              ? Colors.WHITE
                              : Colors.RED,
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              color: selector.isTeam
                                ? Colors.BLACK
                                : Colors.WHITE,
                              fontWeight: "600",
                            }}
                          >
                            Self
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            // setIsTeam(false)
                            dispatch(updateIsTeam(true));
                          }}
                          style={{
                            width: "50%",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: selector.isTeam
                              ? Colors.RED
                              : Colors.WHITE,
                            borderTopRightRadius: 5,
                            borderBottomRightRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              color: selector.isTeam
                                ? Colors.WHITE
                                : Colors.BLACK,
                              fontWeight: "600",
                            }}
                          >
                            Teams
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {homeSelector.isDSE && (
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          borderColor: Colors.RED,
                          borderWidth: 1,
                          borderRadius: 5,
                          height: 41,
                          marginTop: 10,
                          justifyContent: "center",
                          width: "80%",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            // setIsTeam(true)
                            // if (primaryDepartment === 'Sales')
                            dispatch(updateIsTeam(false));
                            // else showToast('Access Denied')
                          }}
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: Colors.RED,
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              color: Colors.WHITE,
                              fontWeight: "600",
                            }}
                          >
                            Self
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {/* {homeSelector.isMD &&
                                        <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', borderColor: Colors.RED, borderWidth: 1, borderRadius: 5, height: 41, marginTop: 10, justifyContent: 'center', width: '80%' }}>
                                                <TouchableOpacity onPress={() => {
                                                    // setIsTeam(false)
                                                    dispatch(updateIsTeam(true))
                                                }} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.RED, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                                                    <Text style={{ fontSize: 16, color: Colors.WHITE, fontWeight: '600' }}>Teams</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    } */}
                </>
              );
            } else if (index === 1) {
              return (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      paddingBottom: 0,
                      paddingTop: 10,
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <DateSelectItemForTargetSettings
                        disabled={selector.targetType === "MONTHLY"}
                        // disabled={false}
                        label={"Start Date"}
                        placeholder={"Set Target"}
                        value={fromDate}
                        onPress={() => showDatePickerMethod("START_DATE")}
                      />
                    </View>

                    <View style={{ width: "45%" }}>
                      <DateSelectItemForTargetSettings
                        // disabled={false}
                        disabled={selector.targetType === "MONTHLY"}
                        label={"End Date"}
                        placeholder={"Set Target"}
                        value={toDate}
                        onPress={() => showDatePickerMethod("END_DATE")}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      width: "100%",
                      paddingBottom: 10,
                    }}
                  >
                    {/* <View style={styles.radioGroupBcVw}>
                                            <RadioTextItem
                                                label={"Monthly"}
                                                value={"MONTHLY"}
                                                // disabled={true}
                                                status={selector.targetType === "MONTHLY" ? true : false}
                                                onPress={() => {
                                                    setCurrentMonthDate().then(() => {
                                                        dispatch(updateTargetType("MONTHLY"))
                                                    })
                                                }}
                                            />
                                            <RadioTextItem
                                                label={"Special"}
                                                value={"SPECIAL"}
                                                // disabled={true}
                                                status={selector.targetType === "SPECIAL" ? true : false}
                                                onPress={() => {
                                                    dispatch(updateTargetType("SPECIAL"))
                                                }}
                                            />
                                        </View> */}
                    <TargetDropdown
                      // disabled={selector.targetType === "SPECIAL"}
                      label={"Select Target"}
                      // value={selector.selectedMonth && selector.targetType === "MONTHLY" ? selector.selectedMonth.value : ''}
                      value={
                        selector.selectedMonth &&
                        selector.targetType === "MONTHLY"
                          ? selector.selectedMonth.value
                          : selector.selectedSpecial &&
                            selector.targetType === "SPECIAL"
                          ? selector.selectedSpecial.value
                          : ""
                      }
                      onPress={() => {
                        if (selector.targetType === "SPECIAL") {
                          showDropDownModelMethod(
                            "SPECIAL_MODEL",
                            "Select Target"
                          );
                        } else if (selector.targetType === "MONTHLY") {
                          showDropDownModelMethod(
                            "TARGET_MODEL",
                            "Select Target"
                          );
                        }
                      }}
                    />
                  </View>
                </>
              );
            } else if (index === 2) {
              return (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <View
                    style={{
                      width: "95%",
                      minHeight: 400,
                      // borderWidth: 1,
                      shadowColor: Colors.DARK_GRAY,
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowRadius: 4,
                      shadowOpacity: 0.5,
                      elevation: 3,
                      marginHorizontal: 20,
                    }}
                  >
                    <TargetSettingsTab />
                    {/* {homeSelector.isDSE && primaryDepartment === 'Sales' ? <TargetSettingsTab /> :
                                        <Text style={{fontSize:16, color: Colors.BLACK, textAlign:'center'}}>Access Denied</Text>} */}
                  </View>
                </View>
              );
            }
          }}
        />
      </View>
      {!selector.isLoading ? null : (
        <LoaderComponent
          visible={selector.isLoading}
          onRequestClose={() => {}}
        />
      )}
    </SafeAreaView>
  );
};

export default TargetSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  shadow: {
    //   overflow: 'hidden',
    borderRadius: 4,
    width: "100%",
    height: 250,
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 3,
    position: "relative",
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.WHITE,
  },
  barVw: {
    backgroundColor: Colors.WHITE,
    width: 40,
    height: "70%",
    justifyContent: "center",
  },
  text2: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  text3: {
    fontSize: 18,
    fontWeight: "800",
  },
  dateVw: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: Colors.WHITE,
    marginBottom: 5,
    paddingLeft: 5,
    height: 50,
  },
  boxView: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: Colors.WHITE,
    paddingVertical: 5,
  },

  performView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    // borderWidth: 1,
    // borderColor: Colors.BORDER_COLOR,
    backgroundColor: Colors.WHITE,
    marginBottom: 5,
    // paddingLeft: 5,
    // height: 100,
    // backgroundColor: 'red'
  },

  rankView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: Colors.BORDER_COLOR,
    // backgroundColor: Colors.WHITE,
    marginBottom: 5,
    paddingLeft: 3,
    height: 80,
    width: "100%",
  },
  rankIconBox: {
    height: 40,
    width: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#d2d2d2",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  rankHeadingText: {
    fontSize: 10,
    fontWeight: "500",
  },
  rankText: {
    fontSize: 16,
    fontWeight: "700",
  },
  rankText2: {
    fontSize: 20,
    fontWeight: "700",
  },
  baseText: {
    fontSize: 10,
    fontWeight: "800",
  },
  rankBox: {
    paddingTop: 5,
    height: 80,
    width: "32%",
    // backgroundColor: 'red',
    marginRight: 10,
  },
  rankBox2: {
    paddingTop: 5,
    height: 80,
    width: "30%",
    // backgroundColor: 'red',
    marginRight: 10,
  },

  retailBox: {
    paddingTop: 5,
    height: 80,
    width: "20%",
    // backgroundColor: 'red',
    marginRight: 10,
    alignItems: "flex-end",
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 35,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
});
