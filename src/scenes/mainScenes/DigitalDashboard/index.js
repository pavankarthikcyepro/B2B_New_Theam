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
  get_xrole_SalesManagerDigitalTeam,
  getCRM_ReceptionistManagerData,
  updatereceptionistDataObjectData,
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
import DigitalDashBoardTargetScreen from "./targetScreen";
import { useIsFocused } from "@react-navigation/native";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import Orientation from "react-native-orientation-locker";
import _ from "lodash";
const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};
const receptionistRole = ["Reception", "CRM"];

const DigitalDashBoardScreen = ({ route, navigation }) => {
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

  const isFocused = useIsFocused();
  const isDrawerOpen = useIsDrawerOpen();

  useEffect(() => {
    if (isFocused || (isFocused && isDrawerOpen)) {
      Orientation.unlockAllOrientations();
    }
  }, [isFocused, isDrawerOpen]);

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      getCurrentLocation();
      dispatch(updatereceptionistDataObjectData({}));
      setTargetData().then(() => {}); //Commented to resolved filter issue for Home Screen
    });
  }, [navigation]);

  const getCurrentLocation = async () => {
    try {
      if (Platform.OS === "ios") {
        Geolocation.requestAuthorization();
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: "whenInUse",
        });
      }
      Geolocation.getCurrentPosition(
        (position) => {
          const initialPosition = JSON.stringify(position);
          let json = JSON.parse(initialPosition);
          setInitialPosition(json.coords);
        },
        (error) => {},
        { enableHighAccuracy: true }
      );
    } catch (error) {}
  };

  useEffect(() => {
    if (
      selector.isModalVisible
      // && !isEmpty(initialPosition)
    ) {
      getDetails();
    }
  }, [selector.isModalVisible, initialPosition]);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const getDetails = async () => {
    try {
      var startDate = createDateTime("8:30");
      var startBetween = createDateTime("11:30");
      var endBetween = createDateTime("20:30");
      var endDate = createDateTime("21:30");
      var now = new Date();
      var isBetween = startDate <= now && now <= endDate;
      if (true) {
        let employeeData = await AsyncStore.getData(
          AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        if (employeeData) {
          const jsonObj = JSON.parse(employeeData);
          dispatch(getNotificationList(jsonObj.empId));
          var d = new Date();
          const response = await client.get(
            URL.GET_ATTENDANCE_EMPID(
              jsonObj.empId,
              jsonObj.orgId,
              monthNamesCap[d.getMonth()]
            )
          );
          const json = await response.json();
          if (json.length != 0) {
            let date = new Date(json[json.length - 1].createdtimestamp);
            // let dist = getDistanceBetweenTwoPoints(
            //   officeLocation.latitude,
            //   officeLocation.longitude,
            //   initialPosition?.latitude,
            //   initialPosition?.longitude
            // );
            // if (dist > officeRadius) {
            //   setReason(true); ///true for reason
            // } else {
            //   setReason(false);
            // }
            if (date.getDate() != new Date().getDate()) {
              setAttendance(true);
              // if (startDate <= now && now <= startBetween) {
              //   setAttendance(true);
              // } else {
              //   setAttendance(false);
              // }
            } else {
              // if (endBetween <= now && now <= endDate && json.isLogOut == 0) {
              //   setAttendance(true);
              // } else {
              //   setAttendance(false);
              // }
            }
          } else {
            setAttendance(true);
            //  if (startDate <= now && now <= startBetween) {
            //    setAttendance(true);
            //  } else {
            //    setAttendance(false);
            //  }
          }
        }
      }
      dispatch(updateIsModalVisible(false));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(async () => {
    // if (userData.hrmsRole === "Reception") {
    //   let payload = {
    //     orgId: userData.orgId,
    //     loggedInEmpId: userData.empId,
    //   };
    //   dispatch(getReceptionistData(payload));
    // } else
    if (true) {
      // let payload = {
      //   orgId: userData.orgId,
      //   loggedInEmpId: userData.empId,
      //   "dashboardType": "digital"
      // };
      // dispatch(get_xrole_SalesManagerDigitalTeam(payload))
      // dispatch(getReceptionistManagerData(payload));
    }
  }, [userData]);

  const setTargetData = async () => {
    // let obj = {
    //   empData: (await AsyncStore.getData("TARGET_EMP"))
    //     ? JSON.parse(await AsyncStore.getData("TARGET_EMP"))
    //     : empData,
    //   allEmpData: (await AsyncStore.getData("TARGET_EMP_ALL"))
    //     ? JSON.parse(await AsyncStore.getData("TARGET_EMP_ALL"))
    //     : allData.employeeTargetAchievements,
    //   allTargetData: (await AsyncStore.getData("TARGET_ALL"))
    //     ? JSON.parse(await AsyncStore.getData("TARGET_ALL"))
    //     : allData.overallTargetAchivements,
    //   targetData: (await AsyncStore.getData("TARGET_DATA"))
    //     ? JSON.parse(await AsyncStore.getData("TARGET_DATA"))
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
    // if (await AsyncStore.getData(AsyncStore.Keys.IS_LOGIN) === 'true'){
    getMenuListFromServer();
    // getCustomerType();
    checkLoginUserAndEnableReportButton();
    // getLoginEmployeeDetailsFromAsyn();
    // }

    const unsubscribe = navigation.addListener("focus", () => {
      getLoginEmployeeDetailsFromAsyn(); //Commented to resolved filter issue for Home Screen
    });

    return unsubscribe;
  }, [navigation, selector.saveCRMfilterObj]);

  const getCustomerType = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(getCustomerTypeList(jsonObj.orgId));
    }
  };

  const moveToSelectBranch = () => {
    navigation.navigate(AppNavigator.HomeStackIdentifiers.select_branch, {
      isFromLogin: false,
    });
  };
  const moveToFilter = () => {
    navigation.navigate("DIGITAL_DASHBOARD_FILTER", {
      isFromLogin: false,
    });
    // if (userData.hrmsRole == "Reception" || userData.hrmsRole == "CRM") {
    //   navigation.navigate(
    //     AppNavigator.HomeStackIdentifiers.receptionistFilter,
    //     {
    //       isFromLogin: false,
    //     }
    //   );
    // } else {
    //   navigation.navigate(AppNavigator.HomeStackIdentifiers.filter, {
    //     isFromLogin: false,
    //   });
    // }
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
      setUserData({
        empId: jsonObj.empId,
        empName: jsonObj.empName,
        hrmsRole: jsonObj.hrmsRole,
        orgId: jsonObj.orgId,
        branchs: jsonObj.branchs,
      });
      const payload = {
        orgId: jsonObj.orgId,
        empId: jsonObj.empId,
      };
      setHeaderText(jsonObj.empName);
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
      let payloadXrole = {
        orgId: jsonObj.orgId,
        loggedInEmpId: jsonObj.empId,
        dashboardType: "digital",
      };

      if (!selector.saveCRMfilterObj.selectedempId) {
        dispatch(get_xrole_SalesManagerDigitalTeam(payloadXrole));
      }

      Promise.all([
       
        dispatch(getOrganaizationHirarchyList(payload)),
        dispatch(getSourceOfEnquiryList(jsonObj.orgId)),
        dispatch(
          getVehicalModalList({
            bu: jsonObj.orgId,
            dropdownType: "model",
            parentId: 0,
          })
        ),
        // dispatch(
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
        // dispatch(
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
      if (
        jsonObj?.hrmsRole === "Admin" ||
        jsonObj?.hrmsRole === "Admin Prod" ||
        jsonObj?.hrmsRole === "App Admin" ||
        jsonObj?.hrmsRole === "Manager" ||
        jsonObj?.hrmsRole === "TL" ||
        jsonObj?.hrmsRole === "General Manager" ||
        jsonObj?.hrmsRole === "branch manager" ||
        jsonObj?.hrmsRole === "Testdrive_Manager" ||
        jsonObj?.hrmsRole === "MD" ||
        jsonObj?.hrmsRole === "Business Head" ||
        jsonObj?.hrmsRole === "Sales Manager" ||
        jsonObj?.hrmsRole === "Sales Head" ||
        jsonObj?.hrmsRole === "CRM"
      ) {
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
          endDate: selector?.filterIds?.endDate
            ? selector.filterIds.endDate
            : monthLastDate,
          loggedInEmpId: jsonObj.empId,
          startDate: selector?.filterIds?.startDate
            ? selector.filterIds.startDate
            : monthFirstDate,
          empId: jsonObj.empId,
        };
        if (selector.filterIds?.empSelected?.length) {
          payload["empSelected"] = selector.filterIds.empSelected;
        } else {
          payload["levelSelected"] = selector.filterIds?.levelSelected?.length
            ? selector.filterIds.levelSelected
            : null;
        }
        getAllTargetParametersDataFromServer(payload, jsonObj.orgId)
          .then((x) => {})
          .catch((y) => {});
      } else {
        setIsTeamPresent(false);
        dispatch(updateIsTeamPresent(false));
        dispatch(updateIsTeam(false));
      }

      if (
        jsonObj?.hrmsRole === "Business Head" ||
        jsonObj?.hrmsRole === "MD" ||
        jsonObj?.hrmsRole === "General Manager" ||
        jsonObj?.hrmsRole === "Admin" ||
        jsonObj?.hrmsRole === "App Admin" ||
        jsonObj?.hrmsRole === "Admin Prod"
      ) {
        dispatch(updateIsRankHide(true));
      } else {
        dispatch(updateIsRankHide(false));
      }

      if (jsonObj?.hrmsRole.toLowerCase().includes("manager")) {
        dispatch(updateIsManager(true));
      } else {
        dispatch(updateIsManager(false));
      }

      if (
        jsonObj?.hrmsRole.toLowerCase().includes("dse") ||
        jsonObj?.hrmsRole.toLowerCase().includes("sales consultant")
      ) {
        dispatch(updateIsDSE(true));
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
      getDashboadTableDataFromServer(jsonObj.empId);
    }
  };

  const getHomeData = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
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
      const payload = {
        endDate: selector?.filterIds?.endDate
          ? selector.filterIds.endDate
          : monthLastDate,
        loggedInEmpId: jsonObj.empId,
        startDate: selector?.filterIds?.startDate
          ? selector.filterIds.startDate
          : monthFirstDate,
        empId: jsonObj.empId,
      };
      if (isTeamPresent) {
        dispatch(
          getTargetParametersData({
            ...payload,
            pageNo: 0,
            size: 5,
          })
        ),
          getAllTargetParametersDataFromServer(payload, jsonObj.orgId)
            .then((x) => {})
            .catch((y) => {});
      } else {
        getTargetParametersDataFromServer(payload).catch((y) => {});
      }
    }
  };

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
      endDate: selector?.filterIds?.endDate
        ? selector.filterIds.endDate
        : monthLastDate,
      loggedInEmpId: empId,
      startDate: selector?.filterIds?.startDate
        ? selector.filterIds.startDate
        : monthFirstDate,
      empId: empId,
    };
    if (selector.filterIds?.empSelected?.length) {
      payload["empSelected"] = selector.filterIds.empSelected;
    } else {
      payload["levelSelected"] = selector.filterIds?.levelSelected?.length
        ? selector.filterIds.levelSelected
        : null;
    }

    Promise.all([
      // dispatch(getLeadSourceTableList(payload)),
      // dispatch(getVehicleModelTableList(payload)),
      // dispatch(getEventTableList(payload)),
      // dispatch(getLostDropChartData(payload))
    ]).then(() => {});

    getTaskTableDataFromServer(empId, payload);
    getTargetParametersDataFromServer(payload).catch((y) => {});
  };

  const getTaskTableDataFromServer = (empId, oldPayload) => {
    const payload = {
      ...oldPayload,
      pageNo: 0,
      size: 5,
    };
    // commented not used
    // Promise.all([
    //   dispatch(getTaskTableList(payload)),
    //   dispatch(getSalesData(payload)),
    //   dispatch(getSalesComparisonData(payload)),
    // ]).then(() => {});
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
    }

    const payload1 = {
      ...payload,
      pageNo: 0,
      size: 5,
    };
    Promise.allSettled([
      dispatch(getTargetParametersData(payload1)),
      dispatch(
        !isTeamPresentLocal
          ? getTargetParametersEmpData(payload1)
          : getTargetParametersEmpDataInsights(payload1)
      ),
    ])
      .then(() => {})
      .catch((y) => {});
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
    }

    const payload1 = {
      ...payload,
      pageNo: 0,
      size: 5,
    };
    const payload2 = {
      orgId: orgId,
      selectedEmpId: payload.empId,
      endDate: payload.endDate,
      loggedInEmpId: payload.empId,
      empId: payload.empId,
      startDate: payload.startDate,
      pageNo: 0,
      size: 100,
    };
    if (selector.filterIds?.empSelected?.length) {
      payload2["empSelected"] = [];
      // payload2["empSelected"] = selector.filterIds.empSelected;
    } else {
      payload2["levelSelected"] = [];
      // payload2["levelSelected"] = selector.filterIds?.levelSelected?.length
      //   ? selector.filterIds.levelSelected
      //   : null;
    }
    Promise.allSettled([
      //dispatch(getTargetParametersAllData(payload1)),
      dispatch(getTotalTargetParametersData(payload2)),
      dispatch(getNewTargetParametersAllData(payload2)),
      dispatch(
        isTeamPresentLocal
          ? getTargetParametersEmpDataInsights(payload1)
          : getTargetParametersEmpData(payload1)
      ),
    ])
      .then(() => {})
      .catch((y) => {});
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
      setSalesDataAry(data);
    }
  }, [selector.sales_data]);

  useEffect(() => {
    setIsTeam(selector.isTeam);
  }, [selector.isTeam]);


 

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    switch (key) {
      case "TARGET_MODEL":
        setDataForDropDown([
          {
            id: 1,
            name: "Target 1",
            isChecked: false,
          },
          {
            id: 2,
            name: "Target 2",
            isChecked: false,
          },
          {
            id: 3,
            name: "Target 3",
            isChecked: false,
          },
        ]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  function navigateToEMS(params = "", screenName = "", selectedEmpId = []) {
    if (screenName) {
      navigation.navigate(screenName);
    }

    if (!screenName) {
      if (selector.saveCRMfilterObj?.selectedempId) {
        if (
          selector.saveCRMfilterObj?.selectedDesignation &&
          selector.saveCRMfilterObj?.selectedDesignation[0] === "CRM"
        ) {
          navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
            screen: "EMS",
            params: {
              screen: "LEADS",
              params: {
                screenName: "TargetScreenCRM",
                params: params,
                moduleType: "",
                employeeDetail: "",
                selectedEmpId: selectedEmpId,
                startDate: "",
                endDate: "",
                dealerCodes: [],
                ignoreSelectedId: false,
                parentId: selector.saveCRMfilterObj?.selectedempId[0],
                istotalClick: true,
                self: true,
              },
            },
          });
        } else {
          navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
            screen: "EMS",
            params: {
              screen: "LEADS",
              params: {
                screenName: "Home",
                params: params,
                moduleType: "",
                employeeDetail: "",
                selectedEmpId: selector.saveCRMfilterObj?.selectedempId,
                startDate: selector.saveCRMfilterObj.startDate,
                endDate: selector.saveCRMfilterObj.endDate,
                dealerCodes: selector.saveCRMfilterObj.dealerCodes,
                ignoreSelectedId: true,
              },
            },
          });
        }
      } else if (userData.hrmsRole === "CRM") {
        navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
          screen: "EMS",
          params: {
            screen: "LEADS",
            params: {
              screenName: "TargetScreenCRM",
              params: params,
              moduleType: "",
              employeeDetail: "",
              selectedEmpId: selectedEmpId,
              startDate: "",
              endDate: "",
              dealerCodes: [],
              ignoreSelectedId: false,
              parentId: selectedEmpId[0],
              istotalClick: true,
              self: false,
            },
          },
        });
      } else {
        navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
          screen: "EMS",
          params: {
            screen: "LEADS",
            params: {
              screenName: "DigitalHome",
              params: params,
              moduleType: "",
              employeeDetail: "",
              selectedEmpId: selectedEmpId,
              startDate: selector.receptionistFilterIds.startDate,
              endDate: selector.receptionistFilterIds.endDate,
              dealerCodes: selector.receptionistFilterIds.dealerCodes,
              ignoreSelectedId: true,
              istotalClick: false,
              self: false,
              parentId: selectedEmpId[0],
            },
          },
        });
      }
    }
  }

  function navigateToDropLostCancel(params) {
    // navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis);
    navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
      screen: "DROP_ANALYSIS",
      params: { emp_id: "", fromScreen: "" },
    });
  }
  function navigateToDropAnalysis(
    params,
    isfromTree = false,
    parentId = "",
    isSelf = false,
    xrole = false
  ) {
    if (selector.saveCRMfilterObj.selectedempId) {
      if (
        selector.saveCRMfilterObj?.selectedDesignation &&
        selector.saveCRMfilterObj?.selectedDesignation[0] === "CRM"
      ) {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: {
            emp_id: selector.saveCRMfilterObj.selectedempId[0],
            fromScreen: "targetScreenDigital",
            dealercodes: selector.saveCRMfilterObj.dealerCodes,
            isFilterApplied: true,
            isSelf: true,
            xrole: false,
            isForDropped: true,
          },
        });
      } else {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: {
            emp_id: params,
            fromScreen: "targetScreenDigital",
            dealercodes: selector.saveCRMfilterObj.dealerCodes,
            isFilterApplied: true,
            isSelf: isSelf,
            xrole: false,
            isForDropped: false,
          },
        });
      }
    } else {
      if (isfromTree) {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: {
            emp_id: params,
            fromScreen: "targetScreenDigital",
            dealercodes: [],
            isFilterApplied: true,
            parentId: parentId,
            isSelf: isSelf,
            xrole: xrole,
            isForDropped: false,
          },
        });
      } else {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: {
            emp_id: params,
            fromScreen: "targetScreenDigital",
            dealercodes: [],
            isFilterApplied: false,
            isSelf: isSelf,
            xrole: xrole,
            isForDropped: true,
          },
        });
      }
    }
  }

  function navigateToContact(params) {
    navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
      screen: "EMS",
      params: {
        screen: "PRE_ENQUIRY",
        params: {
          screenName: "digital",
          params: params,
          moduleType: "",
          employeeDetail: "",
          selectedEmpId: !_.isEmpty(selector.saveCRMfilterObj.selectedempId)
            ? selector.saveCRMfilterObj.selectedempId[0]
            : "",
          startDate: selector.saveCRMfilterObj.startDate,
          endDate: selector.saveCRMfilterObj.endDate,
          dealerCodes: selector.saveCRMfilterObj.dealerCodes,
          ignoreSelectedId: "",
          parentId: "",
          // param: param === "INVOICE" ? "Retail" : param,
          // moduleType: "home",
          // employeeDetail: "",
        },
      },
    });
  }
  return (
    <SafeAreaView style={styles.container}>
      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          setShowDropDownModel(false);
          setDropDownData({
            key: dropDownKey,
            value: item.name,
            id: item.id,
          });
        }}
      />
      {/* <Button onPress={()=>{navigation.navigate(AppNavigator.HomeStackIdentifiers.location);}} /> */}
      <HeaderComp
        title={headerText}
        branchName={false}
        menuClicked={() => navigation.openDrawer()}
        branchClicked={() => moveToSelectBranch()}
        filterClicked={() => moveToFilter()}
        notification={false}
        filter={true}
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingHorizontal: 10 }}
      >
        {/* 0000 */}
        <View>
          {true && (
            <View style={styles.view7}>
              <TouchableOpacity
                onPress={() => {
                  if (
                    !_.isEmpty(selector.saveCRMfilterObj.selectedempId) &&
                    !_.isEmpty(selector.saveCRMfilterObj?.selectedDesignation)
                  ) {
                    if (
                      selector.saveCRMfilterObj?.selectedDesignation[0] ===
                      "CRM"
                    ) {
                      if (
                        selector?.receptionistDataDigitalFilter?.fullResponse
                          ?.managerPreInquiryCount > 0
                      ) {
                        navigateToContact("Contact");
                      }
                    } else {
                      if (
                        selector?.receptionistDataDigitalFilter_CRE
                          ?.contactsCount > 0
                      ) {
                        navigateToContact("Contact");
                      }
                    }
                  } else {
                    if (selector.receptionistData.contactsCount > 0) {
                      navigateToContact("Contact");
                    }
                  }
                }}
                style={styles.view8}
              >
                <Text numberOfLines={2} style={styles.rankHeadingText}>
                  {"Contact"}
                </Text>
                <View style={styles.cardView}>
                  <Text style={{ ...styles.rankText, color: Colors.PINK }}>
                    {selector.saveCRMfilterObj.selectedempId
                      ? selector.saveCRMfilterObj?.selectedDesignation &&
                        selector.saveCRMfilterObj?.selectedDesignation[0] ===
                          "CRM"
                        ? selector?.receptionistDataDigitalFilter?.fullResponse
                            ?.managerPreInquiryCount || 0
                        : selector?.receptionistDataDigitalFilter_CRE
                            ?.contactsCount || 0
                      : selector.receptionistData?.contactsCount || 0}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (
                    selector.saveCRMfilterObj.selectedempId &&
                    selector.saveCRMfilterObj?.selectedDesignation
                  ) {
                    if (
                      selector.saveCRMfilterObj?.selectedDesignation[0] ===
                      "CRM"
                    ) {
                      if (
                        selector?.receptionistDataDigitalFilter?.fullResponse
                          ?.managerEnquiryCount > 0
                      ) {
                        navigateToEMS("ENQUIRY", "", [userData.empId]);
                      }
                    } else {
                      if (
                        selector?.receptionistDataDigitalFilter_CRE
                          ?.enquirysCount > 0
                      ) {
                        navigateToEMS("ENQUIRY", "", [userData.empId]);
                      }
                    }
                  } else {
                    if (selector.receptionistData.enquirysCount > 0) {
                      navigateToEMS("ENQUIRY", "", [userData.empId]);
                    }
                  }

                  // selector?.receptionistDataDigitalFilter_CRE?.enquirysCount || selector?.receptionistDataDigitalFilter?.fullResponse?.managerEnquiryCount || selector.receptionistData.enquirysCount > 0 &&
                  //   navigateToEMS("ENQUIRY", "", [userData.empId]);
                }}
                style={styles.view8}
              >
                <Text numberOfLines={2} style={styles.rankHeadingText}>
                  {"Enquiry"}
                </Text>
                <View style={styles.cardView}>
                  <Text style={{ ...styles.rankText, color: Colors.PINK }}>
                    {selector.saveCRMfilterObj.selectedempId
                      ? selector.saveCRMfilterObj?.selectedDesignation &&
                        selector.saveCRMfilterObj?.selectedDesignation[0] ===
                          "CRM"
                        ? selector?.receptionistDataDigitalFilter?.fullResponse
                            ?.managerEnquiryCount || 0
                        : selector?.receptionistDataDigitalFilter_CRE
                            ?.enquirysCount || 0
                      : selector.receptionistData?.enquirysCount || 0}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (
                    selector.saveCRMfilterObj.selectedempId &&
                    selector.saveCRMfilterObj?.selectedDesignation
                  ) {
                    if (
                      selector.saveCRMfilterObj?.selectedDesignation[0] ===
                      "CRM"
                    ) {
                      if (
                        selector?.receptionistDataDigitalFilter?.fullResponse
                          ?.managerBookingCount > 0
                      ) {
                        navigateToEMS("BOOKING", "", [userData.empId]);
                      }
                    } else {
                      if (
                        selector?.receptionistDataDigitalFilter_CRE
                          ?.bookingsCount > 0
                      ) {
                        navigateToEMS("BOOKING", "", [userData.empId]);
                      }
                    }
                  } else {
                    if (selector.receptionistData?.bookingsCount > 0) {
                      navigateToEMS("BOOKING", "", [userData.empId]);
                    }
                  }

                  selector?.receptionistDataDigitalFilter_CRE?.bookingsCount ||
                    selector?.receptionistDataDigitalFilter?.fullResponse
                      ?.managerBookingCount ||
                    (selector.receptionistData.bookingsCount > 0 &&
                      navigateToEMS("BOOKING", "", [userData.empId]));
                }}
                style={styles.view8}
              >
                <Text style={styles.rankHeadingText}>{"Booking"}</Text>
                <View style={styles.cardView}>
                  <Text style={{ ...styles.rankText, color: Colors.PINK }}>
                    {selector.saveCRMfilterObj.selectedempId
                      ? selector.saveCRMfilterObj?.selectedDesignation &&
                        selector.saveCRMfilterObj?.selectedDesignation[0] ===
                          "CRM"
                        ? selector?.receptionistDataDigitalFilter?.fullResponse
                            ?.managerBookingCount || 0
                        : selector?.receptionistDataDigitalFilter_CRE
                            ?.bookingsCount || 0
                      : selector.receptionistData?.bookingsCount || 0}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (
                    selector.saveCRMfilterObj.selectedempId &&
                    selector.saveCRMfilterObj?.selectedDesignation
                  ) {
                    if (
                      selector.saveCRMfilterObj?.selectedDesignation[0] ===
                      "CRM"
                    ) {
                      if (
                        selector?.receptionistDataDigitalFilter?.fullResponse
                          ?.managerRetailCount > 0
                      ) {
                        navigateToEMS("INVOICECOMPLETED", "", [userData.empId]);
                      }
                    } else {
                      if (
                        selector?.receptionistDataDigitalFilter_CRE
                          ?.RetailCount > 0
                      ) {
                        navigateToEMS("INVOICECOMPLETED", "", [userData.empId]);
                      }
                    }
                  } else {
                    if (selector.receptionistData.RetailCount > 0) {
                      navigateToEMS("INVOICECOMPLETED", "", [userData.empId]);
                    }
                  }

                  // selector?.receptionistDataDigitalFilter_CRE?.RetailCount || selector?.receptionistDataDigitalFilter?.fullResponse?.managerRetailCount || selector.receptionistData.RetailCount > 0 && navigateToEMS("INVOICECOMPLETED", "", [userData.empId]);
                }}
                style={styles.view8}
              >
                <Text style={styles.rankHeadingText}>{"Retail"}</Text>
                <View style={styles.cardView}>
                  <Text style={{ ...styles.rankText, color: Colors.PINK }}>
                    {selector.saveCRMfilterObj.selectedempId
                      ? selector.saveCRMfilterObj?.selectedDesignation &&
                        selector.saveCRMfilterObj?.selectedDesignation[0] ===
                          "CRM"
                        ? selector?.receptionistDataDigitalFilter?.fullResponse
                            ?.managerRetailCount || 0
                        : selector?.receptionistDataDigitalFilter_CRE
                            ?.RetailCount || 0
                      : selector.receptionistData?.RetailCount || 0}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (
                    selector.saveCRMfilterObj.selectedempId &&
                    selector.saveCRMfilterObj?.selectedDesignation
                  ) {
                    if (
                      selector.saveCRMfilterObj?.selectedDesignation[0] ===
                      "CRM"
                    ) {
                      if (
                        selector?.receptionistDataDigitalFilter?.fullResponse
                          ?.managerDroppedCount > 0
                      ) {
                        navigateToDropAnalysis(
                          userData.empId,
                          false,
                          "",
                          false,
                          true
                        );
                      }
                    } else {
                      if (
                        selector?.receptionistDataDigitalFilter_CRE
                          ?.totalDroppedCount > 0
                      ) {
                        navigateToDropAnalysis(
                          userData.empId,
                          false,
                          "",
                          false,
                          true
                        );
                      }
                    }
                  } else {
                    if (selector.receptionistData.totalDroppedCount > 0) {
                      navigateToDropAnalysis(
                        userData.empId,
                        false,
                        "",
                        false,
                        true
                      );
                    }
                  }
                  // selector?.receptionistDataDigitalFilter_CRE?.totalDroppedCount || selector?.receptionistDataDigitalFilter?.fullResponse?.managerDroppedCount || selector.receptionistData.totalDroppedCount > 0 &&
                  //   navigateToDropAnalysis(userData.empId, false, "", false, true)
                }}
                style={styles.view8}
              >
                <Text
                  numberOfLines={1}
                  style={{ ...styles.rankHeadingText, width: 50 }}
                >
                  {"Drop"}
                </Text>
                <View style={styles.cardView}>
                  <Text style={{ ...styles.rankText, color: Colors.PINK }}>
                    {selector.saveCRMfilterObj.selectedempId
                      ? selector.saveCRMfilterObj?.selectedDesignation &&
                        selector.saveCRMfilterObj?.selectedDesignation[0] ===
                          "CRM"
                        ? selector?.receptionistDataDigitalFilter?.fullResponse
                            ?.managerDroppedCount || 0
                        : selector?.receptionistDataDigitalFilter_CRE
                            ?.totalDroppedCount || 0
                      : selector.receptionistData?.totalDroppedCount || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* 1111 */}
        <View>
          {isTeamPresent && !selector.isDSE && (
            <View style={styles.view9}>
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
                    padding: 8,
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
                    padding: 8,
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
          {selector.isDSE && (null
            // <View style={styles.view9}>
            //   <View style={styles.view10}>
            //     <TouchableOpacity
            //       onPress={() => {
            //         // setIsTeam(true)
            //         dispatch(updateIsTeam(false));
            //       }}
            //       style={styles.touchable2}
            //     >
            //       <Text style={styles.txt4}>Dashboard</Text>
            //     </TouchableOpacity>
            //   </View>
            // </View>
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
              height: isButtonPresent ? "93%" : "90%",
            }}
          >
            {(selector.target_parameters_data.length > 0 ||
              (isTeamPresent &&
                selector.all_target_parameters_data.length > 0)) && (
              <DigitalDashBoardTargetScreen />
            )}
          </View>
        </View>
      </ScrollView>
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default DigitalDashBoardScreen;

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
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  view10: {
    flexDirection: "row",
    borderColor: Colors.RED,
    borderWidth: 1,
    borderRadius: 5,
    // height: 28,
    marginTop: 2,
    justifyContent: "center",
    width: "95%",
  },
  touchable2: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.RED,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 8,
  },

  txt4: {
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: "600",
  },
});
