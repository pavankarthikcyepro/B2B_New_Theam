import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  Platform,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as AsyncStore from "../../../asyncStore";
import empData from "../../../get_target_params_for_emp.json";
import allData from "../../../get_target_params_for_all_emps.json";
import targetData from "../../../get_target_params.json";
import {
  downloadFile,
  getBranchIds,
  getCustomerTypeList,
  getDealerRanking,
  getEventTableList,
  getGroupDealerRanking,
  getLeadSourceTableList,
  getMenuList,
  getNewTargetParametersAllData,
  getOrganaizationHirarchyList,
  getSalesComparisonData,
  getSalesData,
  getSourceOfEnquiryList,
  getTargetParametersData,
  getTargetParametersEmpData,
  getTargetParametersEmpDataInsights,
  getTaskTableList,
  getTotalTargetParametersData,
  getVehicalModalList,
  getVehicleModelTableList,
  updateIsDSE,
  updateIsMD,
  updateIsTeam,
  updateIsTeamPresent,
  updateTargetData,
} from "../../../redux/liveLeadsReducer";
import { AppNavigator } from "../../../navigations";
import { getCallRecordingCredentials } from "../../../redux/callRecordingReducer";
import moment from "moment/moment";
import { updateIsManager } from "../../../redux/sideMenuReducer";
import RNFetchBlob from "rn-fetch-blob";
import {
  DropDownComponant,
  HeaderComp,
  LoaderComponent,
} from "../../../components";
import { Colors } from "../../../styles";
import { DashboardTopTabNavigatorNew } from "../../../navigations/dashboardTopTabNavigatorNew";
import ParametersScreen from "./parametersScreen";
import Orientation from "react-native-orientation-locker";
import { useIsFocused } from "@react-navigation/native";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import { IconButton } from "react-native-paper";
import _ from "lodash";
const receptionistRole = ["Reception", "Tele Caller", "CRE"];
const crmRole = ["CRM"];

const LiveLeadsScreen = ({ route, navigation }) => {
  const selector = useSelector((state) => state.liveLeadsReducer);
  const dispatch = useDispatch();
  const [selectedBranchName, setSelectedBranchName] = useState("");

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
  const [hrmsRole, setHrmsRole] = useState("");
  let numk = 0;

  const isFocused = useIsFocused();
  const isDrawerOpen = useIsDrawerOpen();

  useEffect(() => {
    if (isFocused || (isFocused && isDrawerOpen)) {
      Orientation.unlockAllOrientations();
    }
  }, [isFocused, isDrawerOpen]);

  useLayoutEffect(() => {
    const sub = navigation.addListener("focus", () => {
      getUserData();
    });
    return sub;
  }, [navigation]);

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);

      // if (!_.isEmpty(selector.saveLiveleadObject)) {
      //   getDashboadTableDataFromServer(jsonObj.empId);
      //   // getInsightsDataFilter(selector.saveLiveleadObject.startDate, selector.saveLiveleadObject.endDate
      //   //   , selector.saveLiveleadObject.levelSelected, selector.saveLiveleadObject?.selectedempId)
      // }
      if (isFocused) {
        getDashboadTableDataFromServer(jsonObj.empId);
        // getLoginEmployeeDetailsFromAsyn();
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().format(dateFormat);
        const payload = {
          endDate: currentDate,
          loggedInEmpId: jsonObj.empId,
          startDate: "2021-01-01",
          levelSelected: null,
          empId: jsonObj.empId,
        };
        getAllTargetParametersDataFromServer(payload, jsonObj.orgId);
      }
    }
  }, [selector.levelSelected, selector.saveLiveleadObject, isFocused]);

  const getUserData = async () => {
    try {
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );

      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);

        if (crmRole.includes(jsonObj.hrmsRole)) {
          navigation.setOptions({
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: "600",
            },
            headerStyle: {
              backgroundColor: Colors.DARK_GRAY,
            },
            headerTintColor: Colors.WHITE,
            headerBackTitleVisible: false,
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <SearchIcon /> */}
                <MyTaskFilter
                  navigation={navigation}
                  screenName="CRM_LIVE_FILTERS"
                />
              </View>
            ),
          });
        } else {
          navigation.setOptions({
            headerTitleStyle: {
              fontSize: 16,
              fontWeight: "600",
            },
            headerStyle: {
              backgroundColor: Colors.DARK_GRAY,
            },
            headerTintColor: Colors.WHITE,
            headerBackTitleVisible: false,
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <SearchIcon /> */}
                <MyTaskFilter
                  navigation={navigation}
                  screenName="LIVE_LEADS_FILTERS"
                />
              </View>
            ),
          });
        }
      }
    } catch (error) {
      alert(error);
    }
  };
  const setTargetData = async () => {
    numk++;
    // commented manthan
    // let obj = {
    //   empData: (await AsyncStore.getData("TARGET_EMP_LIVE_LEADS"))
    //     ? JSON.parse(await AsyncStore.getData("TARGET_EMP_LIVE_LEADS"))
    //     : empData,
    //   allEmpData: (await AsyncStore.getData("TARGET_EMP_ALL_LIVE_LEADS"))
    //     ? JSON.parse(await AsyncStore.getData("TARGET_EMP_ALL_LIVE_LEADS"))
    //     : allData.employeeTargetAchievements,
    //   allTargetData: (await AsyncStore.getData("TARGET_ALL_LIVE_LEADS"))
    //     ? JSON.parse(await AsyncStore.getData("TARGET_ALL_LIVE_LEADS"))
    //     : allData.overallTargetAchivements,
    //   targetData: (await AsyncStore.getData("TARGET_DATA_LIVE_LEADS"))
    //     ? JSON.parse(await AsyncStore.getData("TARGET_DATA_LIVE_LEADS"))
    //     : targetData,
    // };
    // dispatch(updateTargetData(obj));
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
  }, [selector.insights_target_parameters_data]); //selector.insights_target_parameters_data

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

  useEffect(async () => {
    // if (await AsyncStore.getData(AsyncStore.Keys.IS_LOGIN) === 'true'){
    updateBranchNameInHeader();
    getMenuListFromServer();
    // getCustomerType(); not geting used in live leads
    checkLoginUserAndEnableReportButton();
    // getLoginEmployeeDetailsFromAsyn();
    // }

    const unsubscribe = navigation.addListener("focus", () => {
      updateBranchNameInHeader();
      if (route.params.fromScreen === "") {
        getLoginEmployeeDetailsFromAsyn();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const MyTaskFilter = ({ navigation, screenName = "" }) => {
    // const screen = useSelector((state) => state.mytaskReducer.currentScreen);
    // if (screen === "TODAY") return <React.Fragment></React.Fragment>;
    return (
      <IconButton
        icon="filter-outline"
        style={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        color={Colors.WHITE}
        size={25}
        onPress={() => {
          navigation.navigate(screenName, {});
        }}
      />
    );
  };
  const getCustomerType = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(getCustomerTypeList(jsonObj.orgId));
    }
  };

  const updateBranchNameInHeader = async () => {
    await AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_NAME).then(
      (branchName) => {
        if (branchName) {
          setSelectedBranchName(branchName);
        }
      }
    );
  };

  const moveToSelectBranch = () => {
    navigation.navigate(AppNavigator.HomeStackIdentifiers.select_branch, {
      isFromLogin: false,
    });
  };
  const moveToFilter = () => {
    navigation.navigate(AppNavigator.HomeStackIdentifiers.filter, {
      isFromLogin: false,
    });
  };
  const getMenuListFromServer = async () => {
    let name = await AsyncStore.getData(AsyncStore.Keys.USER_NAME);
    if (name) {
      dispatch(getMenuList(name));
    }
  };

  const checkLoginUserAndEnableReportButton = async () => {
    let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
    let orgId = await AsyncStore.getData(AsyncStore.Keys.ORG_ID);
    let data = {
      empId: empId,
      orgId: orgId,
    };

    dispatch(getCallRecordingCredentials(data));

    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      let findMdArr = [];

      findMdArr = jsonObj.roles.filter((item) => {
        return item === "MD";
      });
      if (findMdArr.length > 0) {
        setIsButtonPresent(true);
      }
    }
  };

  const getLoginEmployeeDetailsFromAsyn = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      const payload = {
        orgId: jsonObj.orgId,
        empId: jsonObj.empId,
      };
      setHeaderText(jsonObj.empName);
      setHrmsRole(jsonObj.hrmsRole);
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

      Promise.all([
        dispatch(getOrganaizationHirarchyList(payload)),
        // dispatch(getSourceOfEnquiryList(jsonObj.orgId)), not getting used in live leads
        // dispatch(  not getting used in live leads
        //   getVehicalModalList({
        //     bu: jsonObj.orgId,
        //     dropdownType: "model",
        //     parentId: 0,
        //   })
        // ),
        // dispatch( not getting used in live-leads
        //   getDealerRanking({
        //     payload: {
        //       endDate: monthLastDate,
        //       loggedInEmpId: jsonObj.empId,
        //       startDate: monthFirstDate,
        //       levelSelected: null,
        //       pageNo: 0,
        //       size: 0,
        //     },
        //     orgId: jsonObj.orgId,
        //     branchId: jsonObj.branchId,
        //   })
        // ),
        // dispatch( not getting used in live-leads
        //   getGroupDealerRanking({
        //     payload: {
        //       endDate: monthLastDate,
        //       loggedInEmpId: jsonObj.empId,
        //       startDate: monthFirstDate,
        //       levelSelected: null,
        //       pageNo: 0,
        //       size: 0,
        //     },
        //     orgId: jsonObj.orgId,
        //   })
        // ),
      ]).then(() => {});
      // if (
      //   jsonObj?.hrmsRole === "Admin" ||
      //   jsonObj?.hrmsRole === "Admin Prod" ||
      //   jsonObj?.hrmsRole === "App Admin" ||
      //   jsonObj?.hrmsRole === "Manager" ||
      //   jsonObj?.hrmsRole === "TL" ||
      //   jsonObj?.hrmsRole === "General Manager" ||
      //   jsonObj?.hrmsRole === "branch manager" ||
      //   jsonObj?.hrmsRole === "Testdrive_Manager" ||
      //   jsonObj?.hrmsRole === "MD" ||
      //   jsonObj?.hrmsRole === "Business Head" ||
      //   jsonObj?.hrmsRole === "Sales Manager" ||
      //   jsonObj?.hrmsRole === "Sales Head"
      // )
      if (jsonObj?.isTeam.toLowerCase().includes("y")) {
        dispatch(updateIsTeamPresent(true));
        setIsTeamPresent(true);
        if (jsonObj?.hrmsRole === "MD" || jsonObj?.hrmsRole === "App Admin") {
          dispatch(updateIsMD(true));
          if (jsonObj?.hrmsRole === "MD") {
            setIsButtonPresent(true);
          }
        } else {
          dispatch(updateIsMD(false));
        }
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
        const payload = {
          endDate: currentDate,
          loggedInEmpId: jsonObj.empId,
          startDate: "2021-01-01",
          levelSelected: null,
          empId: jsonObj.empId,
        };
        // commented manthan
        // getAllTargetParametersDataFromServer(payload, jsonObj.orgId)
        //   .then((x) => {})
        //   .catch((y) => {});
      } else {
        setIsTeamPresent(false);
        dispatch(updateIsTeamPresent(false));
        dispatch(updateIsTeam(false));
      }
      if (jsonObj?.hrmsRole.toLowerCase().includes("manager")) {
        dispatch(updateIsManager(true));
      } else {
        dispatch(updateIsManager(false));
      }

      if (
        jsonObj?.hrmsRole.toLowerCase().includes("dse") ||
        jsonObj?.hrmsRole.toLowerCase().includes("dealer head") ||
        jsonObj?.hrmsRole.toLowerCase().includes("sales consultant")
      ) {
        dispatch(updateIsDSE(true));
        dispatch(updateIsTeam(false));
      } else {
        dispatch(updateIsDSE(false));
      }

      if (jsonObj?.roles.length > 0) {
        let rolesArr = [],
          mdArr = [],
          dseArr = [];
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
          setRoles(rolesArr);
        }
      }
      // commented manthan
      // getDashboadTableDataFromServer(jsonObj.empId);
    }
  };
  //
  // const getHomeData = async() => {
  //     let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
  //     if (employeeData) {
  //         const jsonObj = JSON.parse(employeeData);
  //         const dateFormat = "YYYY-MM-DD";
  //         const currentDate = moment().format(dateFormat)
  //         const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
  //         const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
  //         const payload = {
  //             "endDate": monthLastDate,
  //             "loggedInEmpId": jsonObj.empId,
  //             "startDate": monthFirstDate,
  //             "levelSelected": null,
  //             "empId": jsonObj.empId
  //         }
  //         if(isTeamPresent){
  //             dispatch(getTargetParametersData({
  //                 ...payload,
  //                 "pageNo": 0,
  //                 "size": 5,
  //             })),
  //                 getAllTargetParametersDataFromServer(payload, jsonObj.orgId)
  //                     .then(x => {})
  //                     .catch(y => {});
  //         }
  //         else{
  //             getTargetParametersDataFromServer(payload).catch(y=> {});
  //         }
  //     }
  // }

  const getDashboadTableDataFromServer = (empId) => {
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
    const payload = {
      endDate: monthLastDate,
      loggedInEmpId: empId,
      startDate: "2021-01-01",
      levelSelected: null,
      empId: empId,
      pageNo: 0,
      size: 5,
    };

    // todo
    // let payload3 = getInsightsDataFilter(selector.saveLiveleadObject.startDate, selector.saveLiveleadObject.endDate
    //   , selector.saveLiveleadObject.levelSelected, selector.saveLiveleadObject?.selectedempId);
    let payload4 = {
      endDate: selector.saveLiveleadObject.endDate
        ? selector.saveLiveleadObject.endDate
        : monthLastDate,
      loggedInEmpId: selector.saveLiveleadObject?.selectedempId
        ? selector.saveLiveleadObject?.selectedempId[0]
        : empId,
      startDate: selector.saveLiveleadObject.startDate
        ? selector.saveLiveleadObject.startDate
        : monthFirstDate,
      levelSelected: selector.saveLiveleadObject.levelSelected, // countey , zone etc ids active-levels API
      empId: selector.saveLiveleadObject?.selectedempId
        ? selector.saveLiveleadObject?.selectedempId[0]
        : empId,
      pageNo: 0,
      size: 5,
      empSelected: selector.saveLiveleadObject?.selectedempId
        ? selector.saveLiveleadObject?.selectedempId
        : null, // selected employes id active-dropdowns APi
    };

    Promise.all([
      // dispatch(getLeadSourceTableList(payload)), not getting used in live leads
      // dispatch(getVehicleModelTableList(payload)),not getting used in live leads
      // dispatch(getEventTableList(payload)),,not getting used in live leads
      // dispatch(getLostDropChartData(payload))
    ]).then(() => {});

    getTaskTableDataFromServer(empId, payload);
    payload.startDate = "2021-01-01"; // for live leads
    // todo  manthan changed payload to payload4
    getTargetParametersDataFromServer(payload4).catch((y) => {});
  };

  const getTaskTableDataFromServer = (empId, oldPayload) => {
    const payload = {
      ...oldPayload,
      pageNo: 0,
      size: 5,
    };
    Promise.all([
      // dispatch(getTaskTableList(payload)), not getting used in live lead
      // dispatch(getSalesData(payload)), not getting used in live leads
      // dispatch(getSalesComparisonData(payload)), not getting used in live leads
    ]).then(() => {});
  };

  const getTargetParametersDataFromServer = async (payload) => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    let isTeamPresentLocal = false;
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      const allRoles = [
        "Admin",
        "Admin Prod",
        "App Admin",
        "Manager",
        "TL",
        "General Manager",
        "branch manager",
        "Testdrive_Manager",
        "MD",
        "Business Head",
        "Sales Manager",
      ];
      if (allRoles.includes(jsonObj?.hrmsRole)) {
        isTeamPresentLocal = true;
      }

      const payload1 = {
        ...payload,
        pageNo: 0,
        size: 5,
      };

      //   if (jsonObj?.hrmsRole.toLowerCase().includes("dse") && route.params.fromScreen == ""){
      //
      //   // dispatch(getTargetParametersData(payload1))
      // }

      if (
        !receptionistRole.includes(jsonObj.hrmsRole) &&
        !crmRole.includes(jsonObj.hrmsRole)
      ) {
        Promise.allSettled([
          // commented manthan
          // dispatch(getTargetParametersData(payload1)),
          dispatch(
            !isTeamPresentLocal
              ? getTargetParametersEmpData(payload1)
              : getTargetParametersEmpDataInsights(payload1)
          ),
        ])
          .then(() => {})
          .catch((y) => {});
      }
    }
  };

  const getInsightsDataFilter = async (
    startdate,
    enddate,
    levelSelected,
    empSelected
  ) => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      let payload = {
        endDate: enddate,
        loggedInEmpId: jsonObj.empId,
        startDate: startdate,
        levelSelected: levelSelected, // countey , zone etc ids active-levels API
        empId: jsonObj.empId,
        pageNo: 0,
        size: 5,
        empSelected: empSelected ? [empSelected] : null, // selected employes id active-dropdowns APi
      };
      return payload;
      // dispatch(getTargetParametersEmpDataInsights(payload))
    }
  };

  const getAllTargetParametersDataFromServer = async (payload, orgId) => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    let isTeamPresentLocal = false;
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);

      const allRoles = [
        "Admin",
        "Admin Prod",
        "App Admin",
        "Manager",
        "TL",
        "General Manager",
        "branch manager",
        "Testdrive_Manager",
        "MD",
        "Business Head",
        "Sales Manager",
      ];
      if (allRoles.includes(jsonObj?.hrmsRole)) {
        isTeamPresentLocal = true;
      }

      const payload1 = {
        ...payload,
        pageNo: 0,
        size: 5,
        endDate: moment().add(0, "day").endOf("month").format("YYYY-MM-DD"),
      };
      const payload2 = {
        orgId: orgId,
        selectedEmpId: payload.empId,
        endDate: moment().add(0, "day").endOf("month").format("YYYY-MM-DD"),
        loggedInEmpId: payload.empId,
        empId: payload.empId,
        startDate: payload.startDate,
        levelSelected: null,
        pageNo: 0,
        size: 5000,
      };
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
      const payload4 = {
        orgId: orgId,
        endDate: selector.saveLiveleadObject.endDate
          ? selector.saveLiveleadObject.endDate
          : monthLastDate,
        loggedInEmpId: selector.saveLiveleadObject?.selectedempId
          ? selector.saveLiveleadObject?.selectedempId[0]
          : jsonObj.empId,
        startDate: selector.saveLiveleadObject.startDate
          ? selector.saveLiveleadObject.startDate
          : monthFirstDate,
        levelSelected: selector.saveLiveleadObject.levelSelected
          ? selector.saveLiveleadObject.levelSelected
          : null, // countey , zone etc ids active-levels API
        empId: selector.saveLiveleadObject?.selectedempId
          ? selector.saveLiveleadObject?.selectedempId[0]
          : jsonObj.empId,
        pageNo: 0,
        size: 5000,
        empSelected: selector.saveLiveleadObject?.selectedempId
          ? selector.saveLiveleadObject?.selectedempId
          : null, // selected employes id active-dropdowns APi
        selectedEmpId: selector.saveLiveleadObject?.selectedempId
          ? selector.saveLiveleadObject?.selectedempId[0]
          : jsonObj.empId,
      };
      // if (!selector.saveLiveleadObject?.selectedempId) {
      dispatch(getNewTargetParametersAllData(payload4)); // TEAM
      // }
      //todo
      if (!crmRole.includes(jsonObj.hrmsRole)) {
        Promise.allSettled([
          //dispatch(getTargetParametersAllData(payload1)),
          dispatch(getTotalTargetParametersData(payload4)), // grand total

          // dispatch(isTeamPresentLocal ? getTargetParametersEmpDataInsights(payload1) : getTargetParametersEmpData(payload1))
        ])
          .then(() => {})
          .catch((y) => {});
      }
    }
  };

  useEffect(() => {
    if (Object.keys(selector.sales_data).length > 0) {
      const dataObj = selector.sales_data;
      const data = [
        dataObj.liveBookings,
        dataObj.complaints,
        dataObj.deliveries,
        dataObj.dropRevenue,
        dataObj.pendingOrders,
      ];
      // setSalesDataAry(data);
    }
  }, [selector.sales_data]);

  useEffect(() => {
    setIsTeam(selector.isTeam);
  }, [selector.isTeam]);

  return (
    <SafeAreaView style={styles.container}>
      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          setShowDropDownModel(false);
          setDropDownData({ key: dropDownKey, value: item.name, id: item.id });
        }}
      />
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <FlatList
          data={[1, 2, 3]}
          listKey={"TOP_FLAT_LIST"}
          keyExtractor={(item, index) => "TOP" + index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            if (index === 0) {
              return (
                <>
                  {/*{isButtonPresent &&*/}
                  {/*    <View style={{ width: '100%', alignItems: 'flex-end', marginBottom: 15 }}>*/}
                  {/*        <TouchableOpacity style={{ width: 130, height: 30, backgroundColor: Colors.RED, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }} onPress={downloadFileFromServer1}>*/}
                  {/*            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>ETVBRL Report</Text>*/}
                  {/*        </TouchableOpacity>*/}
                  {/*    </View>*/}
                  {/*}*/}
                  {!selector.isMD && (
                    <>
                      {/* {!receptionistRole.includes(hrmsRole) && (
                        <View style={styles.rankView}>
                          <View style={styles.rankBox}>
                            <Text style={styles.rankHeadingText}>
                              Dealer Ranking
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                              }}
                            >
                              <TouchableOpacity
                                style={styles.rankIconBox}
                                onPress={() => {
                                  navigation.navigate(
                                    AppNavigator.HomeStackIdentifiers
                                      .leaderboard
                                  );
                                }}
                              >
                                <Image
                                  style={styles.rankIcon}
                                  source={require("../../../assets/images/perform_rank.png")}
                                />
                              </TouchableOpacity>
                              <View
                                style={{
                                  marginTop: 5,
                                  marginLeft: 3,
                                }}
                              >
                                {groupDealerRank !== null && (
                                  <Text style={styles.rankText}>
                                    {groupDealerRank}/{groupDealerCount}
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={styles.rankBox}>
                            <Text style={styles.rankHeadingText}>
                              Branch Ranking
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                              }}
                            >
                              <TouchableOpacity
                                style={styles.rankIconBox}
                                onPress={() => {
                                  navigation.navigate(
                                    AppNavigator.HomeStackIdentifiers
                                      .branchRanking
                                  );
                                }}
                              >
                                <Image
                                  style={styles.rankIcon}
                                  source={require("../../../assets/images/perform_rank.png")}
                                />
                              </TouchableOpacity>
                              <View
                                style={{
                                  marginTop: 5,
                                  marginLeft: 3,
                                }}
                              >
                                {dealerRank !== null && (
                                  <View style={{ flexDirection: "row" }}>
                                    <Text style={[styles.rankText]}>
                                      {dealerRank}
                                    </Text>
                                    <Text style={[styles.rankText]}>
                                      /{dealerCount}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>
                          <View style={styles.rankBox}>
                            <Text style={styles.rankHeadingText}>Retails</Text>
                            <View
                              style={{
                                flexDirection: "row",
                              }}
                            >
                              <View style={styles.rankIconBox}>
                                <Image
                                  style={styles.rankIcon}
                                  source={require("../../../assets/images/retail.png")}
                                />
                              </View>
                              <View
                                style={{
                                  marginTop: 5,
                                  marginLeft: 5,
                                }}
                              >
                                <View style={{ flexDirection: "row" }}>
                                  <Text
                                    style={[styles.rankText, { color: "red" }]}
                                  >
                                    {retailData?.achievment}
                                  </Text>
                                  <Text style={[styles.rankText]}>
                                    /{retailData?.target}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    marginTop: 5,
                                  }}
                                >
                                  <Text style={styles.baseText}>
                                    Ach v/s Tar
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      )} */}
                    </>
                  )}
                </>
              );
            } else if (index === 1) {
              return (
                <>
                  {isTeamPresent && !selector.isDSE && (
                    <View
                      style={{
                        flexDirection: "row",
                        marginVertical: 15,
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
                          // height: 40,
                          marginTop: 10,
                          justifyContent: "center",
                          width: "95%",
                        }}
                      >
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
                            padding: 8,
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
                            padding: 8,
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
                  {selector.isDSE && (
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 15,
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 15,
                      }}
                    >
                      {/* <View style={styles.titleDashboardContainer}>
                        <Text style={styles.dashboardText}>Dashboard</Text>
                      </View> */}
                      <View
                        style={{
                          flexDirection: "row",
                          borderColor: Colors.RED,
                          borderWidth: 1,
                          borderRadius: 5,
                          // height: 28,
                          justifyContent: "center",
                          width: "95%",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            // setIsTeam(true)
                            dispatch(updateIsTeam(false));
                          }}
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: Colors.RED,
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                            padding: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              color: Colors.WHITE,
                              fontWeight: "600",
                            }}
                          >
                            Dashboard
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
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
                      minHeight: 40,
                      shadowColor: Colors.DARK_GRAY,
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowRadius: 4,
                      shadowOpacity: 0.5,
                      marginHorizontal: 20,
                    }}
                  >
                    {(selector.target_parameters_data.length > 0 ||
                      (isTeamPresent &&
                        selector.all_target_parameters_data.length > 0)) && (
                      <ParametersScreen />
                    )}
                  </View>
                </View>
              );
            }
          }}
        />
      </View>
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default LiveLeadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: Colors.WHITE,
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
  titleDashboardContainer: {
    paddingVertical: 10,
    backgroundColor: "#e5e5e5",
    marginBottom: 10,
    paddingHorizontal: 70,
    borderRadius: 50,
    alignSelf: "center",
  },
  dashboardText: {
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.PINK,
    textDecorationLine: "underline",
  },
});
