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
  TouchableWithoutFeedback,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { IconButton, Card, Button } from "react-native-paper";
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
import ReactNativeModal from "react-native-modal";

const HomeScreen = ({ route, navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [salesDataAry, setSalesDataAry] = useState([]);
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
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState({});

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      setTargetData().then((r) => console.log(r)); //Commented to resolved filter issue for Home Screen
    });
  }, [navigation]);

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

  useEffect(async () => {
    // if (await AsyncStore.getData(AsyncStore.Keys.IS_LOGIN) === 'true'){
    updateBranchNameInHeader();
    getMenuListFromServer();
    getCustomerType();
    checkLoginUserAndEnableReportButton();
    getLoginEmployeeDetailsFromAsyn();
    // }

    const unsubscribe = navigation.addListener("focus", () => {
      updateBranchNameInHeader(); //Commented to resolved filter issue for Home Screen
      getLoginEmployeeDetailsFromAsyn(); //Commented to resolved filter issue for Home Screen
    });

    return unsubscribe;
  }, [navigation]);

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
        branchId: jsonObj.branchId,
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
        dispatch(
          getDealerRanking({
            payload: {
              endDate: monthLastDate,
              loggedInEmpId: jsonObj.empId,
              startDate: monthFirstDate,
              levelSelected: null,
              pageNo: 0,
              size: 0,
            },
            orgId: jsonObj.orgId,
            branchId: jsonObj.branchId,
          })
        ),
        dispatch(
          getGroupDealerRanking({
            payload: {
              endDate: monthLastDate,
              loggedInEmpId: jsonObj.empId,
              startDate: monthFirstDate,
              levelSelected: null,
              pageNo: 0,
              size: 0,
            },
            orgId: jsonObj.orgId,
          })
        ),
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
        jsonObj?.hrmsRole === "Sales Head"
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
          endDate: monthLastDate,
          loggedInEmpId: jsonObj.empId,
          startDate: monthFirstDate,
          levelSelected: null,
          empId: jsonObj.empId,
        };
        getAllTargetParametersDataFromServer(payload, jsonObj.orgId)
          .then((x) =>
            console.log(`getAllTargetParametersDataFromServer:: success: ${x}`)
          )
          .catch((y) =>
            console.log(`getAllTargetParametersDataFromServer:: error: ${y}`)
          );
      }
      if (jsonObj?.hrmsRole.toLowerCase().includes("manager")) {
        dispatch(updateIsManager(true));
      } else {
        dispatch(updateIsManager(false));
      }

      if (jsonObj?.hrmsRole.toLowerCase().includes("dse")) {
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
        endDate: monthLastDate,
        loggedInEmpId: jsonObj.empId,
        startDate: monthFirstDate,
        levelSelected: null,
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
            .then((x) =>
              console.log(
                `getAllTargetParametersDataFromServer:: success: ${x}`
              )
            )
            .catch((y) =>
              console.log(`getAllTargetParametersDataFromServer:: error: ${y}`)
            );
      } else {
        getTargetParametersDataFromServer(payload).catch((y) =>
          console.log("getTargetParametersDataFromServer:: home/index.js: ", y)
        );
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
      endDate: monthLastDate,
      loggedInEmpId: empId,
      startDate: monthFirstDate,
      levelSelected: null,
      empId: empId,
    };

    Promise.all([
      dispatch(getLeadSourceTableList(payload)),
      dispatch(getVehicleModelTableList(payload)),
      dispatch(getEventTableList(payload)),
      // dispatch(getLostDropChartData(payload))
    ]).then(() => {});

    getTaskTableDataFromServer(empId, payload);
    getTargetParametersDataFromServer(payload).catch((y) =>
      console.log("587 home/index.js: ", y)
    );
  };

  const getTaskTableDataFromServer = (empId, oldPayload) => {
    const payload = {
      ...oldPayload,
      pageNo: 0,
      size: 5,
    };
    Promise.all([
      dispatch(getTaskTableList(payload)),
      dispatch(getSalesData(payload)),
      dispatch(getSalesComparisonData(payload)),
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
      levelSelected: null,
      pageNo: 0,
      size: 100,
    };
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

  const downloadFileFromServer = async () => {
    setLoading(true);
    Promise.all([dispatch(getBranchIds({}))])
      .then(async (res) => {
        let branchIds = [];
        let employeeData = await AsyncStore.getData(
          AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        if (employeeData) {
          const jsonObj = JSON.parse(employeeData);
          if (res[0]?.payload.length > 0) {
            let braches = res[0]?.payload;
            for (let i = 0; i < braches.length; i++) {
              branchIds.push(braches[i].id);
              if (i == braches.length - 1) {
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
                let payload = {
                  branchIdList: branchIds,
                  orgId: jsonObj.orgId,
                  fromDate: monthFirstDate + " 00:00:00",
                  toDate: monthLastDate + " 23:59:59",
                };
                Promise.all([dispatch(downloadFile(payload))])
                  .then(async (res) => {
                    if (res[0]?.payload?.downloadUrl) {
                      downloadInLocal(res[0]?.payload?.downloadUrl);
                    } else {
                      setLoading(false);
                    }
                  })
                  .catch(() => {
                    setLoading(false);
                  });
              }
            }
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const downloadFileFromServer1 = async () => {
    if (!isEmpty(options) && Platform.OS === "ios") {
      setShowModal(true);
    } else {
      setLoading(true);
      Promise.all([dispatch(getBranchIds({}))])
        .then(async (res) => {
          let branchIds = [];
          let employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
          );
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
            let payload7 = {
              orgId: jsonObj.orgId,
              reportFrequency: "MONTHLY",
              reportType: "ORG",
              location: "Khammam",
            };
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            var lastDay = new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            ).setHours(23, 59, 59, 999);
            let dateFormat1 = moment(firstDay).format("YYYY-MM-DD HH:mm:ss");
            let dateFormat2 = moment(lastDay).format("YYYY-MM-DD HH:mm:ss");
            let newPayload = {
              branchIdList: [],
              fromDate: dateFormat1,
              orgId: jsonObj.orgId,
              toDate: dateFormat2,
            };
            Promise.all([dispatch(downloadFile(newPayload))])
              .then(async (res) => {
                if (res[0]?.payload?.downloadUrl) {
                  console.log(res[0]?.payload);
                  let path = res[0]?.payload;
                  if (Platform.OS === "android") {
                    for (const property in path) {
                      console.log(`${property}: ${path[property]}`);
                      downloadInLocal(path[property]);
                    }
                  }
                  if (Platform.OS === "ios") {
                    setLoading(false);
                    setOptions(path);
                    setShowModal(true);
                  }
                } else {
                  setLoading(false);
                }
              })
              .catch(() => {
                setLoading(false);
              });
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  const downloadInLocal = async (url) => {
    const { config, fs } = RNFetchBlob;
    let downloadDir = Platform.select({
      ios: fs.dirs.DocumentDir,
      android: fs.dirs.DownloadDir,
    });
    let date = new Date();
    let file_ext = getFileExtention(url);
    file_ext = "." + file_ext[0];
    let options = {};
    if (Platform.OS === "android") {
      options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification: true,
          path:
            downloadDir +
            "/ETVBRL_" +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            file_ext, // this is the path where your downloaded file will live in
          description: "Downloading image.",
        },
      };
      config(options)
        .fetch("GET", url)
        .then((res) => {
          setLoading(false);
          RNFetchBlob.android.actionViewIntent(res.path());
          // do some magic here
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
    if (Platform.OS === "ios") {
      options = {
        fileCache: true,
        path:
          downloadDir +
          "/ETVBRL_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        // mime: 'application/xlsx',
        // appendExt: 'xlsx',
        //path: filePath,
        //appendExt: fileExt,
        notification: true,
      };

      config(options)
        .fetch("GET", url)
        .then((res) => {
          setLoading(false);
          setTimeout(() => {
            // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
            RNFetchBlob.ios.openDocument(res.data); //<---Property to display downloaded file on documaent viewer
            // Alert.alert(CONSTANTS.APP_NAME,'File download successfully');
          }, 300);
        })
        .catch((errorMessage) => {
          setLoading(false);
        });
    }
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  const RenderModal = () => {
    return (
      <ReactNativeModal
        onBackdropPress={() => {
          setShowModal(false);
        }}
        transparent={true}
        visible={showModal}
      >
        <View style={styles.newModalContainer}>
          <TouchableWithoutFeedback
            style={styles.actionButtonContainer}
            onPress={() => {}}
          >
            <>
              <Button
                onPress={() => {
                  downloadInLocal(options?.downloadUrl);
                  setShowModal(false);
                }}
                color="black"
              >
                {"ETVBRL Excel"}
              </Button>

              <View style={styles.divider} />
              <Button
                onPress={() => {
                  downloadInLocal(options?.downloadUrl1);
                  setShowModal(false);
                }}
                color="black"
              >
                {"EBR"}
              </Button>
              <View style={styles.divider} />
              <Button
                onPress={() => {
                  downloadInLocal(options?.downloadUrl2);
                  setShowModal(false);
                }}
                color="black"
              >
                {"Support"}
              </Button>
            </>
          </TouchableWithoutFeedback>
        </View>
      </ReactNativeModal>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <RenderModal />
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
      <HeaderComp
        title={headerText}
        branchName={selectedBranchName}
        menuClicked={() => navigation.openDrawer()}
        branchClicked={() => moveToSelectBranch()}
        filterClicked={() => moveToFilter()}
      />
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        {/* 0000 */}
        <View>
          {isButtonPresent && (
            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
                marginVertical: 6,
              }}
            >
              <TouchableOpacity
                style={{
                  width: 140,
                  height: 30,
                  borderColor: Colors.RED,
                  borderWidth: 1,
                  borderRadius: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={downloadFileFromServer1}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <IconButton
                    icon={"download"}
                    size={16}
                    color={Colors.RED}
                    style={{ margin: 0, padding: 0 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: Colors.RED,
                    }}
                  >
                    ETVBRL Report
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {!selector.isMD && (
            <>
              <View style={styles.rankView}>
                <View style={styles.rankBox}>
                  <Text style={styles.rankHeadingText}>Dealer Ranking</Text>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.rankIconBox}
                      onPress={() => {
                        navigation.navigate(
                          AppNavigator.HomeStackIdentifiers.leaderboard
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
                  <Text style={styles.rankHeadingText}>Branch Ranking</Text>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.rankIconBox}
                      onPress={() => {
                        navigation.navigate(
                          AppNavigator.HomeStackIdentifiers.branchRanking
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
                          <Text style={[styles.rankText]}>{dealerRank}</Text>
                          <Text style={[styles.rankText]}>/{dealerCount}</Text>
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
                        <Text style={[styles.rankText, { color: Colors.RED }]}>
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
                        <Text style={styles.baseText}>Ach v/s Tar</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {/* 1111 */}
        <View>
          {isTeamPresent && !selector.isDSE && (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 2,
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
                  height: 28,
                  marginTop: 2,
                  justifyContent: "center",
                  width: "80%",
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
            <View
              style={{
                flexDirection: "row",
                marginBottom: 2,
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
                  height: 28,
                  justifyContent: "center",
                  width: "80%",
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
              <DashboardTopTabNavigatorNew />
            )}
          </View>
        </View>
      </View>
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default HomeScreen;

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
});
