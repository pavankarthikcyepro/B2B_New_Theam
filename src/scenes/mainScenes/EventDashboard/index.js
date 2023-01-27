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
  Image,
  Platform,
  PermissionsAndroid,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { IconButton, Card, Button, Portal } from "react-native-paper";
import VectorImage from "react-native-vector-image";
import { useDispatch, useSelector } from "react-redux";
import { FILTER, SPEED } from "../../../assets/svg";
import { DateItem } from "../../../pureComponents/dateItem";
import { AppNavigator } from "../../../navigations";
import {
  dateSelected,
  showDateModal,
  getCustomerTypeList,
  getSourceOfEnquiryList,
  getVehicalModalList,
  getOrganaizationHirarchyList,
  getLeadSourceTableList,
  getVehicleModelTableList,
  getEventTableList,
  getTaskTableList,
  getLostDropChartData,
  getTargetParametersData,
  getTargetParametersAllData,
  getTargetParametersEmpData,
  getSalesData,
  getSalesComparisonData,
  getDealerRanking,
  getGroupDealerRanking,
  updateIsTeam,
  updateIsTeamPresent,
  getBranchIds,
  downloadFile,
  updateIsMD,
  updateIsDSE,
  updateTargetData,
  getNewTargetParametersAllData,
  getTotalTargetParametersData,
  getTargetParametersEmpDataInsights,
  updateIsRankHide,
  getReceptionistData,
  updateIsModalVisible,
  getReceptionistManagerData,
} from "../../../redux/homeReducer";
import { getCallRecordingCredentials } from "../../../redux/callRecordingReducer";
import { updateData, updateIsManager } from "../../../redux/sideMenuReducer";
import * as acctionCreator from "../../../redux/targetSettingsReducer";
import {
  DateRangeComp,
  DatePickerComponent,
  SortAndFilterComp,
} from "../../../components";
import { DateModalComp } from "../../../components/dateModalComp";
import { getMenuList } from "../../../redux/homeReducer";
import { DashboardTopTabNavigator } from "../../../navigations/dashboardTopTabNavigator";
import { DashboardTopTabNavigatorNew } from "../../../navigations/dashboardTopTabNavigatorNew";
import { HomeStackIdentifiers } from "../../../navigations/appNavigator";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import { TargetAchivementComp } from "./targetAchivementComp";
import {
  HeaderComp,
  DropDownComponant,
  LoaderComponent,
} from "../../../components";
import { TargetDropdown } from "../../../pureComponents";
import RNFetchBlob from "rn-fetch-blob";

import empData from "../../../get_target_params_for_emp.json";
import allData from "../../../get_target_params_for_all_emps.json";
import targetData from "../../../get_target_params.json";
import AttendanceForm from "../../../components/AttendanceForm";
import URL from "../../../networking/endpoints";
import { client } from "../../../networking/client";
import Geolocation from "@react-native-community/geolocation";
import {
  createDateTime,
  getDistanceBetweenTwoPoints,
  officeRadius,
} from "../../../service";
import ReactNativeModal from "react-native-modal";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { monthNamesCap } from "../Attendance/AttendanceTop";
import { getNotificationList } from "../../../redux/notificationReducer";
import AttendanceFromSelf from "../../../components/AttendanceFromSelf";
import EventDashBoardTargetScreen from "./EventTabs";

const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};
const receptionistRole = ["Reception", "CRM"];

const EventDashBoardScreen = ({ route, navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [salesDataAry, setSalesDataAry] = useState([]);

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
  const [roles, setRoles] = useState([]);
  const [headerText, setHeaderText] = useState("");
  const [isButtonPresent, setIsButtonPresent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState(false);
  const [reason, setReason] = useState(false);
  const [initialPosition, setInitialPosition] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState({});
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [userData, setUserData] = useState({
    empId: 0,
    empName: "",
    hrmsRole: "",
    orgId: 0,
    branchs: [],
  });

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      setTargetData().then(() => {}); //Commented to resolved filter issue for Home Screen
    });
  }, [navigation]);


  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const setTargetData = async () => {
    let obj = {
      empData: (await AsyncStore.getData("TARGET_EMP"))
        ? JSON.parse(await AsyncStore.getData("TARGET_EMP"))
        : empData,
      allEmpData: (await AsyncStore.getData("TARGET_EMP_ALL"))
        ? JSON.parse(await AsyncStore.getData("TARGET_EMP_ALL"))
        : allData.employeeTargetAchievements,
      allTargetData: (await AsyncStore.getData("TARGET_ALL"))
        ? JSON.parse(await AsyncStore.getData("TARGET_ALL"))
        : allData.overallTargetAchivements,
      targetData: (await AsyncStore.getData("TARGET_DATA"))
        ? JSON.parse(await AsyncStore.getData("TARGET_DATA"))
        : targetData,
    };
    dispatch(updateTargetData(obj));
  };

  useEffect(() => {
    if (selector.self_target_parameters_data.length > 0) {
      let tempRetail = [];
      tempRetail = selector.self_target_parameters_data.filter((item) => {
        return item.paramName.toLowerCase() === "invoice";
      });
      if (tempRetail.length > 0) {
        setRetailData(tempRetail[0]);
      }
    } else {
    }
  }, [selector.self_target_parameters_data]); //selector.self_target_parameters_data
  // self data END

  // insights data
  useEffect(() => {
    if (selector.insights_target_parameters_data.length > 0) {
      let tempRetail = [];
      tempRetail = selector.insights_target_parameters_data.filter((item) => {
        return item.paramName.toLowerCase() === "invoice";
      });
      if (tempRetail.length > 0) {
        setRetailData(tempRetail[0]);
      }
    } else {
    }
  }, [selector.insights_target_parameters_data]); //selector.self_target_parameters_data

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (selector.allDealerData.length > 0) {
        let tempArr = [],
          allArray = selector.allDealerData;
        setDealerCount(selector.allDealerData.length);
        tempArr = allArray.filter((item) => {
          return item.empId === jsonObj.empId;
        });
        if (tempArr.length > 0) {
          setDealerRank(tempArr[0].rank);
        } else {
        }
      }
    }
  }, [selector.allDealerData]);

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (selector.allGroupDealerData.length > 0) {
        let tempArr = [],
          allArray = selector.allGroupDealerData;
        setGroupDealerCount(selector.allGroupDealerData.length);
        tempArr = allArray.filter((item) => {
          return item.empId === jsonObj.empId;
        });
        if (tempArr.length > 0) {
          setGroupDealerRank(tempArr[0].rank);
        } else {
        }
      }
    }
  }, [selector.allGroupDealerData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
    });

    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    setIsTeam(selector.isTeam);
  }, [selector.isTeam]);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingHorizontal: 10 }}
      >
        <View>
          {isTeamPresent && !selector.isDSE && (
            <View style={{ ...styles.view9, marginTop: 25 }}>
              <View style={styles.view10}>
                <TouchableOpacity
                  onPress={() => {
                    // setIsTeam(true)
                    dispatch(updateIsTeam(false));
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
                      color: selector.isTeam ? Colors.BLACK : Colors.WHITE,
                      fontWeight: "600",
                    }}
                  >
                    Insights
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
                      color: selector.isTeam ? Colors.WHITE : Colors.BLACK,
                      fontWeight: "600",
                    }}
                  >
                    Teams
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {selector.isDSE && (
            <View style={styles.view9}>
              <View style={styles.view10}>
                <TouchableOpacity
                  onPress={() => {
                    // setIsTeam(true)
                    dispatch(updateIsTeam(false));
                  }}
                  style={styles.touchable2}
                >
                  <Text style={styles.txt4}>Dashboard</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* 2222 */}
        <View style={{ marginTop: 8, alignItems: "center" }}>
          <View
            style={{
              shadowColor: Colors.DARK_GRAY,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowRadius: 4,
              shadowOpacity: 0.5,
              marginHorizontal: 4,
              height:"90%",
            }}
          >
            {(selector.target_parameters_data.length > 0 ||
              (isTeamPresent &&
                selector.all_target_parameters_data.length > 0)) && (
              <EventDashBoardTargetScreen />
            )}
          </View>
        </View>
      </ScrollView>
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default EventDashBoardScreen;

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
    // elevation: 3,
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
    backgroundColor: Colors.WHITE,
    marginBottom: 5,
  },

  rankView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 3,
    height: 70,
    marginTop: 10,
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
    textAlign: "center",
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
    marginRight: 10,
  },
  rankBox2: {
    paddingTop: 5,
    height: 80,
    width: "30%",
    marginRight: 10,
  },

  retailBox: {
    paddingTop: 5,
    height: 80,
    width: "20%",
    marginRight: 10,
    alignItems: "flex-end",
  },
  rankIcon: { width: 25, height: 25 },
  cardView: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
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
    marginTop: "35%",
    // marginLeft: "15%",
    marginRight: "1%",
    elevation: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    top: 0,
    right: 0,
    position: "absolute",
  },
  actionButtonContainer: {
    // backgroundColor: "white",
    justifyContent: "space-evenly",
    flexDirection: "column",
  },
  divider: {
    width: "85%",
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignSelf: "center",
    // opacity: 0.7,
  },

  bannerListContainer: {},
  bannerImage: {
    marginTop: 10,
    marginBottom: 10,
    padding: 15,
    width: Dimensions.get("screen").width - 70,
    height: Dimensions.get("screen").width / 2.3,
    backgroundColor: Colors.BLACK,
    borderRadius: 5,
  },
  paginationContainer: {
    paddingVertical: 0,
    marginBottom: 10,
  },
  paginationDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: -7,
  },
  inactiveDotStyle: {
    height: 14,
    width: 14,
    borderRadius: 7,
  },

  hideRankRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  hideRankBox: {
    paddingTop: 5,
    height: 80,
    alignItems: "center",
  },
  view1: {
    width: "100%",
    alignItems: "flex-end",
    marginVertical: 6,
  },
  tochable1: {
    width: 140,
    height: 30,
    borderColor: Colors.RED,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  etvbrlTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.RED,
  },
  view2: {
    marginTop: 5,
    marginLeft: 5,
  },
  view3: {
    flexDirection: "row",
  },
  view4: {
    marginTop: 5,
  },
  view5: {
    flexDirection: "row",
  },
  view6: {
    marginTop: 5,
    marginLeft: 3,
  },
  view7: {
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  view8: { flexDirection: "column", alignItems: "center" },
  view9: {
    flexDirection: "row",
    marginBottom: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  view10: {
    flexDirection: "row",
    borderColor: Colors.RED,
    borderWidth: 1,
    borderRadius: 5,
    height: 28,
    marginTop: 2,
    justifyContent: "center",
    width: "80%",
  },
  touchable2: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.RED,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },

  txt4: {
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: "600",
  },
});
