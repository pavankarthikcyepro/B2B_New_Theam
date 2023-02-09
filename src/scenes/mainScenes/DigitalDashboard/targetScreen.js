import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Colors } from "../../../styles";
import { LoaderComponent } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import * as AsyncStore from "../../../asyncStore";
import { ScrollView } from "react-native-gesture-handler";

import {
  delegateTask,
  getEmployeesList,
  getNewTargetParametersAllData,
  getReportingManagerList,
  getTotalOftheTeam,
  getTotalTargetParametersData,
  getUserWiseTargetParameters,
  updateEmployeeDataBasedOnDelegate,
} from "../../../redux/homeReducer";
import { useNavigation } from "@react-navigation/native";
import { AppNavigator } from "../../../navigations";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 5;
const color = [
  "#9f31bf",
  "#00b1ff",
  "#fb03b9",
  "#ffa239",
  "#d12a78",
  "#0800ff",
  "#1f93ab",
  "#ec3466",
];
const receptionistRole = ["Reception", "CRM"];
const DigitalDashBoardTargetScreen = ({ route }) => {
  const navigation = useNavigation();
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();

  const [retailData, setRetailData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [enqData, setEnqData] = useState(null);

  const [visitData, setVisitData] = useState(null);
  const [TDData, setTDData] = useState(null);
  const [exgData, setExgData] = useState(null);
  const [finData, setFinData] = useState(null);
  const [insData, setInsData] = useState(null);
  const [exwData, setExwData] = useState(null);
  const [accData, setAccData] = useState(null);
  const [lostLeadsData, setLostLeadsData] = useState(null);
  const [selfInsightsData, setSelfInsightsData] = useState([]);

  const [dateDiff, setDateDiff] = useState(null);
  const [isTeamPresent, setIsTeamPresent] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [showShuffleModal, setShowShuffleModal] = useState(false);
  const [delegateButtonClick, setDelegateButtonClick] = useState(false);
  const [headerTitle, setHeaderTitle] = useState(
    "Selected employee has Active tasks. Please delegate to another employee"
  );
  const [dropDownPlaceHolder, setDropDownPlaceHolder] = useState("Employees");
  const [allParameters, setAllParameters] = useState([]);
  const [receptionistTeamParameters, setReceptionistTeamParameters] = useState(
    []
  );
  const [totalOfTeam, setTotalofTeam] = useState([]);
  const [myParameters, setMyParameters] = useState([]);

  const [selectedName, setSelectedName] = useState("");

  const [employeeListDropdownItem, setEmployeeListDropdownItem] = useState(0);
  const [employeeDropdownList, setEmployeeDropdownList] = useState([]);
  const [
    reoprtingManagerListDropdownItem,
    setReoprtingManagerListDropdownItem,
  ] = useState(0);
  const [reoprtingManagerDropdownList, setReoprtingManagerDropdownList] =
    useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [branches, setBranches] = useState([]);
  const [togglePercentage, setTogglePercentage] = useState(0);
  const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
  const [toggleParamsMetaData, setToggleParamsMetaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const translation = useRef(new Animated.Value(0)).current;
  const [slideRight, setSlideRight] = useState();
  const [userData, setUserData] = useState({
    empId: 0,
    empName: "",
    hrmsRole: "",
    orgId: 0,
    branchs: [],
  });
  const scrollViewRef = useRef();
  const paramsMetadata = [
    // 'Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'
    {
      color: "#FA03B9",
      paramName: "Enquiry",
      shortName: "Enq",
      initial: "E",
      toggleIndex: 0,
    },
    {
      color: "#FA03B9",
      paramName: "Test Drive",
      shortName: "TD",
      initial: "T",
      toggleIndex: 0,
    },
    {
      color: "#9E31BE",
      paramName: "Home Visit",
      shortName: "Visit",
      initial: "V",
      toggleIndex: 0,
    },
    {
      color: "#1C95A6",
      paramName: "Booking",
      shortName: "Bkg",
      initial: "B",
      toggleIndex: 0,
    },
    {
      color: "#C62159",
      paramName: "INVOICE",
      shortName: "Retail",
      initial: "R",
      toggleIndex: 0,
    },
    {
      color: "#C62159",
      paramName: "DROPPED",
      shortName: "Lost",
      initial: "DRP",
      toggleIndex: 0,
    },
    {
      color: "#9E31BE",
      paramName: "Exchange",
      shortName: "Exg",
      initial: "Ex",
      toggleIndex: 1,
    },
    {
      color: "#EC3466",
      paramName: "Finance",
      shortName: "Fin",
      initial: "F",
      toggleIndex: 1,
    },
    {
      color: "#1C95A6",
      paramName: "Insurance",
      shortName: "Ins",
      initial: "I",
      toggleIndex: 1,
    },
    {
      color: "#1C95A6",
      paramName: "EXTENDEDWARRANTY",
      shortName: "ExW",
      initial: "ExW",
      toggleIndex: 1,
    },
    {
      color: "#C62159",
      paramName: "Accessories",
      shortName: "Acc",
      initial: "A",
      toggleIndex: 1,
    },
  ];

  const crmMetaData = [
    // 'Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'
    {
      color: "#FA03B9",
      paramName: "Enquiry",
      shortName: "Enq",
      initial: "E",
      toggleIndex: 0,
    },
    {
      color: "#1C95A6",
      paramName: "Booking",
      shortName: "Bkg",
      initial: "B",
      toggleIndex: 0,
    },
    {
      color: "#C62159",
      paramName: "INVOICE",
      shortName: "Retail",
      initial: "R",
      toggleIndex: 0,
    },
    {
      color: "#C62159",
      paramName: "DROPPED",
      shortName: "Lost",
      initial: "DRP",
      toggleIndex: 0,
    },
  ];

  useEffect(() => {
    const dateFormat = "YYYY-MM-DD";
    const currentDate = moment().format(dateFormat);
    const monthLastDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .endOf("month")
      .format(dateFormat);
    setDateDiff(
      (new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const isInsights = selector.isTeamPresent && !selector.isDSE;
    const isSelf = selector.isDSE;
    const dashboardSelfParamsData = isSelf
      ? selector.self_target_parameters_data
      : selector.insights_target_parameters_data;
    if (dashboardSelfParamsData.length > 0) {
      let tempRetail = [];
      tempRetail = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "invoice";
      });
      if (tempRetail.length > 0) {
        setRetailData(tempRetail[0]);
      }

      let tempBooking = [];
      tempBooking = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "booking";
      });
      if (tempBooking.length > 0) {
        setBookingData(tempBooking[0]);
      }

      let tempEnq = [];
      tempEnq = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "enquiry";
      });
      if (tempEnq.length > 0) {
        setEnqData(tempEnq[0]);
      }

      let tempVisit = [];
      tempVisit = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "home visit";
      });
      if (tempVisit.length > 0) {
        setVisitData(tempVisit[0]);
      }

      let tempTD = [];
      tempTD = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "test drive";
      });
      if (tempTD.length > 0) {
        setTDData(tempTD[0]);
      }

      let tempEXG = [];
      tempEXG = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "exchange";
      });
      if (tempEXG.length > 0) {
        setExgData(tempEXG[0]);
      }

      let tempFin = [];
      tempFin = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "finance";
      });
      if (tempFin.length > 0) {
        setFinData(tempFin[0]);
      }

      let tempIns = [];
      tempIns = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "insurance";
      });
      if (tempIns.length > 0) {
        setInsData(tempIns[0]);
      }

      let tempExw = [];
      tempExw = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "extendedwarranty";
      });
      if (tempExw.length > 0) {
        setExwData(tempExw[0]);
      }

      let tempAcc = [];
      tempAcc = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "accessories";
      });
      if (tempAcc.length > 0) {
        setAccData(tempAcc[0]);
      }

      let tempDropped = [];
      tempDropped = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "dropped";
      });
      if (tempDropped.length > 0) {
        setLostLeadsData(tempDropped[0]);
      }

      setSelfInsightsData([
        tempEnq[0],
        tempTD[0],
        tempVisit[0],
        tempBooking[0],
        tempRetail[0],
        tempDropped[0],
        tempEXG[0],
        tempFin[0],
        tempIns[0],
        tempExw[0],
        tempAcc[0],
      ]);
    } else {
    }

    const unsubscribe = navigation.addListener("focus", () => {
      const dateFormat = "YYYY-MM-DD";
      const currentDate = moment().format(dateFormat);
      const monthLastDate = moment(currentDate, dateFormat)
        .subtract(0, "months")
        .endOf("month")
        .format(dateFormat);
      setDateDiff(
        (new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
    });

    return unsubscribe;
  }, [
    selector.self_target_parameters_data,
    selector.insights_target_parameters_data,
  ]); //selector.self_target_parameters_data]

  useEffect(async () => {
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
      if (true) {
        getReceptionManagerTeam(jsonObj);
      }
      if (
        selector.login_employee_details.hasOwnProperty("roles") &&
        selector.login_employee_details.roles.length > 0
      ) {
        let rolesArr = [];
        rolesArr = selector.login_employee_details?.roles.filter((item) => {
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
          setIsTeamPresent(true);
        }
      }
    }

    try {
      const branchData = await AsyncStore.getData("BRANCHES_DATA");
      if (branchData) {
        const branchesList = JSON.parse(branchData);
        setBranches([...branchesList]);
      }
    } catch (e) {
      // Alert.alert('Error occurred - Employee total', `${JSON.stringify(e)}`);
    }
  }, [selector.login_employee_details]);

  useEffect(() => {
    setTogglePercentage(0);
    setIsTeam(selector.isTeam);
    if (selector.isTeam) {
      setToggleParamsIndex(0);
      let data = [...crmMetaData];
      data = data.filter((x) => x.toggleIndex === 0);
      setToggleParamsMetaData([...data]);
    }
  }, [selector.isTeam]);

  useEffect(() => {
    setEmployeeDropdownList(
      selector.employee_list.map(({ name: label, id: value, ...rest }) => ({
        value,
        label,
        ...rest,
      }))
    );
  }, [selector.employee_list]);

  useEffect(() => {
    allParameters[0] = {
      ...allParameters[0],
      targetAchievements: selector.totalParameters,
    };
    setAllParameters(allParameters);
  }, [selector.totalParameters]);

  useEffect(async () => {
    setIsLoading(true);
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        if (selector.all_emp_parameters_data.length > 0) {
          let myParams = [
            ...selector.all_emp_parameters_data.filter(
              (item) => item.empId === jsonObj.empId
            ),
          ];
          myParams[0] = {
            ...myParams[0],
            isOpenInner: false,
            employeeTargetAchievements: [],
            targetAchievements: selector.totalParameters,
            tempTargetAchievements: myParams[0]?.targetAchievements,
          };
          setAllParameters(myParams);
          // setMyParameters(myParams);
          // let tempParams = [
          //   ...selector.all_emp_parameters_data.filter(
          //     (item) => item.empId !== jsonObj.empId
          //   ),
          // ];
          // for (let i = 0; i < tempParams.length; i++) {
          //   tempParams[i] = {
          //     ...tempParams[i],
          //     isOpenInner: false,
          //     employeeTargetAchievements: [],
          //     tempTargetAchievements: tempParams[i]?.targetAchievements,
          //   };
          //   // tempParams[i]["isOpenInner"] = false;
          //   // tempParams[i]["employeeTargetAchievements"] = [];
          //   if (i === tempParams.length - 1) {
          //     setAllParameters([...tempParams]);
          //   }
          //   let newIds = tempParams.map((emp) => emp.empId);
          //   for (let k = 0; k < newIds.length; k++) {
          //     const element = newIds[k].toString();
          //     let tempPayload = getTotalPayload(employeeData, element);
          //     const response = await client.post(
          //       URL.GET_TOTAL_TARGET_PARAMS(),
          //       tempPayload
          //     );
          //     const json = await response.json();
          //     tempParams[k].targetAchievements = json;
          //     setAllParameters([...tempParams]);
          //   }
          // }
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [selector.all_emp_parameters_data]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setSelfInsightsData([]);
      setLostLeadsData(null);
      setAccData(null);
      setExwData(null);
      setInsData(null);
      setFinData(null);
      setExgData(null);
      setTDData(null);
      setVisitData(null);
      setEnqData(null);
      setBookingData(null);
      setRetailData(null);
      setSlideRight(0);
    });
    setSlideRight(0);
  }, [navigation, selector.isTeam]);

  useEffect(() => {
    Animated.timing(translation, {
      toValue: slideRight,
      duration: 0,
      useNativeDriver: true,
    }).start();
  }, [slideRight]);

  const getReceptionManagerTeam = async (userData) => {
    try {
      let payload = {
        orgId: userData.orgId,
        branchList: userData.branchs.map((a) => a.branchId),
      };
      const response = await client.post(
        URL.RECEPTIONIST_MANAGER_TEAM(),
        payload
      );
      const json = await response.json();
      if (json.empName) {
        setReceptionistTeamParameters(json.empName);
        let totalKey1 = json.empName.reduce(
          (acc, obj) => acc + obj.totalAllocatedCount,
          0
        );
        let totalKey2 = json.empName.reduce(
          (acc, obj) => acc + obj.bookingCount,
          0
        );
        let totalKey3 = json.empName.reduce(
          (acc, obj) => acc + obj.RetailCount,
          0
        );
        let totalKey4 = json.empName.reduce(
          (acc, obj) => acc + obj.totalDroppedCount,
          0
        );
        let total = [totalKey1, totalKey2, totalKey3, totalKey4];
        setTotalofTeam(total);
      }
    } catch (error) {}
  };
  const getColor = (ach, tar) => {
    if (ach > 0 && tar === 0) {
      return "#1C95A6";
    } else if (ach === 0 || tar === 0) {
      return "#FA03B9";
    } else {
      if ((ach / tar) * 100 === 50) {
        return "#EC3466";
      } else if ((ach / tar) * 100 > 50) {
        return "#1C95A6";
      } else if ((ach / tar) * 100 < 50) {
        return "#FA03B9";
      }
    }
  };
  // Main Dashboard params Data

  const getBranchName = (branchId) => {
    let branchName = "";
    if (branches.length > 0) {
      const branch = branches.find((x) => +x.branchId === +branchId);
      if (branch) {
        branchName = branch.branchName.split(" - ")[0];
      }
    }
    return branchName;
  };

  const getTotalPayload = (employeeData, item) => {
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
      endDate: monthLastDate,
      loggedInEmpId: item,
      empId: item,
      startDate: monthFirstDate,
      // empSelected: item,
      pageNo: 0,
      size: 100,
      orgId: jsonObj.orgId,
      selectedEmpId: item,
      levelSelected: null,
    };
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
      selectedEmpId: item.empId,
      endDate: monthLastDate,
      loggedInEmpId: jsonObj.empId,
      empId: item.empId,
      startDate: monthFirstDate,
      levelSelected: null,
      pageNo: 0,
      size: 100,
    };
  };

  const getNewPayloadForTotal = (employeeData, item, employeeIds) => {
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
      endDate: monthLastDate,
      loggedInEmpId: employeeIds,
      startDate: monthFirstDate,
      levelSelected: null,
      pageNo: 0,
      size: 100,
      orgId: jsonObj.orgId,
      empSelected: employeeIds,
      selectedEmpId: employeeIds,
    };
  };

  const onEmployeeNameClick = async (item, index, lastParameter) => {
    let localData = [...allParameters];
    let current = lastParameter[index].isOpenInner;
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
                  branchName: getBranchName(tempRawData[i].branchId),
                  employeeTargetAchievements: [],
                  tempTargetAchievements: tempRawData[i]?.targetAchievements,
                };
                if (i === tempRawData.length - 1) {
                  lastParameter[index].employeeTargetAchievements = tempRawData;
                  let newIds = tempRawData.map((emp) => emp.empId);
                  if (true) {
                    // if (newIds.length >= 2) {
                    for (let i = 0; i < newIds.length; i++) {
                      const element = newIds[i].toString();
                      let tempPayload = getTotalPayload(employeeData, element);
                      const response = await client.post(
                        URL.GET_TOTAL_TARGET_PARAMS(),
                        tempPayload
                      );
                      const json = await response.json();
                      if (Array.isArray(json)) {
                        lastParameter[index].employeeTargetAchievements[
                          i
                        ].targetAchievements = json;
                      }
                    }
                  }
                }
              }
            }
            setAllParameters([...localData]);
          }
        );
      }
    } else {
      setAllParameters([...localData]);
    }
  };

  const toggleParamsView = (event) => {
    const index = event.nativeEvent.selectedSegmentIndex;
    let data = [...paramsMetadata];
    if (index !== 2) {
      data = data.filter((x) => x.toggleIndex === index);
    } else {
      data = [...paramsMetadata];
    }
    setToggleParamsMetaData([...data]);
    setToggleParamsIndex(index);
  };

  function navigateToEMS(params) {
    navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
    setTimeout(() => {
      navigation.navigate("LEADS", {
        // param: param === "INVOICE" ? "Retail" : param,
        // moduleType: "home",
        // employeeDetail: "",
      });
    }, 1000);
  }

  function navigateToDropLostCancel(params) {
    navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis);
  }
  return (
    <React.Fragment>
      {!selector.isLoading ? (
        <View style={styles.container}>
          {!receptionistRole.includes(userData.hrmsRole) ? (
            selector.isTeam ? (
              <View>
                <View style={styles.view1}>
                  <View style={styles.view2}>
                    <View style={styles.percentageToggleView}></View>
                  </View>
                </View>
                {isLoading ? (
                  <ActivityIndicator
                    color={Colors.RED}
                    size={"large"}
                    style={{ marginTop: 15 }}
                  />
                ) : (
                  <ScrollView
                    contentContainerStyle={styles.scrollview}
                    horizontal={true}
                    directionalLockEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    ref={scrollViewRef}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                      scrollViewRef?.current?.scrollTo({
                        y: 0,
                        animated: true,
                      });
                    }}
                    onScroll={(e) => {
                      setSlideRight(e.nativeEvent.contentOffset.x);
                    }}
                    bounces={false}
                    scrollEventThrottle={16}
                  >
                    <View>
                      <View key={"headers"} style={styles.view3}>
                        <View
                          style={{ width: 100, height: 20, marginRight: 5 }}
                        ></View>
                        <View style={styles.view4}>
                          {toggleParamsMetaData.map((param) => {
                            return (
                              <View
                                style={[
                                  styles.itemBox,
                                  {
                                    width:
                                      param.paramName === "DROPPED" ? 60 : 55,
                                  },
                                ]}
                                key={param.shortName}
                              >
                                <Text
                                  style={{
                                    color: param.color,
                                    fontSize:
                                      param.paramName === "DROPPED" ? 11 : 12,
                                  }}
                                >
                                  {param.shortName}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                      <ScrollView
                      // style={{ height: selector.isMD ? "81%" : "80%" }}
                      >
                        {receptionistTeamParameters.length > 0 &&
                          receptionistTeamParameters.map((item, index) => {
                            return (
                              <View key={`${item.empName} ${index}`}>
                                <View
                                  style={{
                                    paddingHorizontal: 8,
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: 12,
                                    width: Dimensions.get("screen").width - 28,
                                  }}
                                >
                                  <View style={{ flexDirection: "row" }}>
                                    <Text
                                      onPress={() => {
                                        navigation.navigate(
                                          AppNavigator.HomeStackIdentifiers
                                            .location,
                                          {
                                            empId: item.empId,
                                            orgId: item.orgId,
                                          }
                                        );
                                      }}
                                      style={{
                                        fontSize: 12,
                                        fontWeight: "600",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      {item.empName}
                                      {"  "}
                                      {"-   " + item?.roleName}
                                    </Text>
                                  </View>
                                  <View style={{ flexDirection: "row" }}></View>
                                </View>
                                {/*Source/Model View END */}
                                <View
                                  style={[
                                    { flexDirection: "row" },
                                    item.isOpenInner && {
                                      borderRadius: 10,
                                      borderWidth: 2,
                                      borderColor: "#C62159",
                                      marginHorizontal: 6,
                                      overflow: "hidden",
                                    },
                                  ]}
                                >
                                  {/*RIGHT SIDE VIEW*/}
                                  <View style={[styles.view6]}>
                                    <View style={styles.view7}>
                                      <RenderLevel1NameView
                                        level={0}
                                        item={item}
                                        branchName={item.branch}
                                        color={"#C62159"}
                                        receptionManager={true}
                                        navigation={navigation}
                                        titleClick={async () => {}}
                                        roleName={item.roleName}
                                      />
                                      <View
                                        style={{
                                          flex: 1,
                                          backgroundColor:
                                            "rgba(223,228,231,0.67)",
                                          alignItems: "center",
                                          flexDirection: "row",
                                        }}
                                      >
                                        {[
                                          item.totalAllocatedCount || 0,
                                          item.bookingCount || 0,
                                          item.RetailCount || 0,
                                          item.totalDroppedCount || 0,
                                        ].map((e) => {
                                          return (
                                            <View
                                              style={{
                                                width: 55,
                                                height: 30,
                                                justifyContent: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontSize: 16,
                                                  fontWeight: "700",
                                                  // marginLeft: 50,
                                                }}
                                              >
                                                {e || 0}
                                              </Text>
                                            </View>
                                          );
                                        })}
                                      </View>
                                    </View>
                                    {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                                  </View>
                                </View>
                              </View>
                            );
                          })}
                      </ScrollView>
                    </View>
                    {/* Grand Total Section */}
                    {totalOfTeam && (
                      <View
                        style={{
                          width: Dimensions.get("screen").width - 35,
                          marginTop: 20,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            height: 40,
                            backgroundColor: Colors.RED,
                          }}
                        >
                          <View
                            style={{
                              width: 100,
                              justifyContent: "space-around",
                              flexDirection: "row",
                              backgroundColor: Colors.RED,
                            }}
                          >
                            <View />
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={[
                                  styles.grandTotalText,
                                  {
                                    color: Colors.WHITE,
                                    fontSize: 12,
                                  },
                                ]}
                              >
                                Total
                              </Text>
                            </View>
                            <View style={{ alignSelf: "flex-end" }}>
                              <View
                                style={{
                                  paddingRight: 2,
                                  height: 20,
                                  justifyContent: "center",
                                }}
                              >
                                <Text style={styles.txt7}></Text>
                              </View>

                              <View
                                style={{
                                  height: 20,
                                  justifyContent: "center",
                                }}
                              >
                                <Text style={styles.txt7}></Text>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              minHeight: 40,
                              flexDirection: "column",
                            }}
                          >
                            <View
                              style={{
                                minHeight: 40,
                                flexDirection: "row",
                              }}
                            >
                              <View
                                style={{
                                  // alignContent: "center",
                                  // justifyContent: "center",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                {totalOfTeam.map((e) => {
                                  return (
                                    <View
                                      style={{
                                        width: 55,
                                        height: 30,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 16,
                                          fontWeight: "700",
                                          color: Colors.WHITE,
                                        }}
                                      >
                                        {e || 0}
                                      </Text>
                                    </View>
                                  );
                                })}
                                {/* <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    marginLeft: 50,
                                    color: Colors.WHITE,
                                  }}
                                >
                                  {totalOfTeam}
                                </Text> */}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  </ScrollView>
                )}
              </View>
            ) : null
          ) : null}
          {selector.isTeam && receptionistRole.includes(userData.hrmsRole)
            ? null
            : // IF Self or insights
              true && (
                <>
                  <>
                    {true && !selector.isTeam ? (
                      <>
                        <View style={styles.view14}>
                          <SourceModelView
                            style={{ alignSelf: "flex-end" }}
                            onClick={() => {
                              navigation.navigate("RECEP_SOURCE_MODEL", {
                                empId: userData.empId,
                                headerTitle: "Source/Model",
                                loggedInEmpId: userData.empId,
                                orgId: userData.orgId,
                                role: userData.hrmsRole,
                                branchList: userData.branchs.map(
                                  (a) => a.branchId
                                ),
                              });
                            }}
                          />
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <View style={styles.view15}>
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: "35%",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "400",
                                  textDecorationLine: "underline",
                                  textDecorationColor: "#00b1ff",
                                }}
                              >
                                {"Consultant Name"}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "60%",
                              }}
                            >
                              <Text
                                style={{ ...styles.txt4, width: "25%" }}
                                numberOfLines={2}
                              >
                                {"Enq"}
                              </Text>
                              <Text
                                style={{ ...styles.txt4, width: "25%" }}
                                numberOfLines={2}
                              >
                                {"Bkg"}
                              </Text>
                              <Text
                                style={{ ...styles.txt4, width: "25%" }}
                                numberOfLines={2}
                              >
                                {"Retail"}
                              </Text>
                              <Text
                                style={{ ...styles.txt4, width: "25%" }}
                                numberOfLines={2}
                              >
                                {"Lost"}
                              </Text>
                            </View>
                          </View>
                          <FlatList
                            data={selector.receptionistData.consultantList}
                            style={{ marginTop: 10 }}
                            nestedScrollEnabled
                            renderItem={({ item }) => {
                              Array.prototype.random = function () {
                                return this[
                                  Math.floor(Math.random() * this.length)
                                ];
                              };
                              let selectedColor = color.random();
                              return (
                                <View style={styles.view16}>
                                  <View style={styles.view17}>
                                    <Text numberOfLines={1}>
                                      {item?.emp_name}
                                    </Text>
                                  </View>
                                  <View style={styles.view18}>
                                    <View
                                      style={{
                                        minWidth: 45,
                                        height: 25,
                                        borderColor: Colors.RED,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text
                                        onPress={() => {
                                          item?.allocatedCount > 0 &&
                                            navigateToEMS();
                                        }}
                                        style={{
                                          padding: 2,
                                          textDecorationLine:
                                            item?.allocatedCount > 0
                                              ? "underline"
                                              : "none",
                                        }}
                                      >
                                        {item?.allocatedCount}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        minWidth: 45,
                                        height: 25,
                                        borderColor: Colors.RED,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text
                                        onPress={() => {
                                          item?.bookingCount > 0 &&
                                            navigateToEMS();
                                        }}
                                        style={{
                                          padding: 2,
                                          textDecorationLine:
                                            item?.bookingCount > 0
                                              ? "underline"
                                              : "none",
                                        }}
                                      >
                                        {item?.bookingCount}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        minWidth: 45,
                                        height: 25,
                                        borderColor: Colors.RED,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text
                                        onPress={() => {
                                          item?.retailCount > 0 &&
                                            navigateToEMS();
                                        }}
                                        style={{
                                          padding: 2,
                                          textDecorationLine:
                                            item?.retailCount > 0
                                              ? "underline"
                                              : "none",
                                        }}
                                      >
                                        {item?.retailCount}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        minWidth: 45,
                                        height: 25,
                                        borderColor: Colors.RED,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text
                                        onPress={() => {
                                          navigateToDropLostCancel();
                                        }}
                                        style={{
                                          padding: 2,
                                          textDecorationLine:
                                            item?.droppedCount > 0
                                              ? "underline"
                                              : "none",
                                        }}
                                      >
                                        {item?.droppedCount}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                              );
                            }}
                          />
                          <View style={styles.view16}>
                            <View
                              style={{
                                justifyContent: "center",
                                alignItems: "center",
                                width: "35%",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontWeight: "600",
                                  color: "#00b1ff",
                                }}
                              >
                                {"          Total"}
                              </Text>
                            </View>
                            <View style={styles.view18}>
                              <View style={styles.view20}>
                                <Text
                                  onPress={() => {
                                    selector.receptionistData
                                      .totalAllocatedCount > 0 &&
                                      navigateToEMS();
                                  }}
                                  style={{
                                    padding: 2,
                                    textDecorationLine:
                                      selector.receptionistData
                                        .totalAllocatedCount > 0
                                        ? "underline"
                                        : "none",
                                  }}
                                >
                                  {
                                    selector.receptionistData
                                      .totalAllocatedCount
                                  }
                                </Text>
                              </View>
                              <View style={styles.view20}>
                                <Text
                                  onPress={() => {
                                    navigateToDropLostCancel();
                                  }}
                                  style={{
                                    padding: 2,
                                    textDecorationLine:
                                      selector.receptionistData.bookingsCount >
                                      0
                                        ? "underline"
                                        : "none",
                                  }}
                                >
                                  {selector.receptionistData.bookingsCount}
                                </Text>
                              </View>
                              <View style={styles.view20}>
                                <Text
                                  onPress={() => {
                                    selector.receptionistData.RetailCount > 0 &&
                                      navigateToEMS();
                                  }}
                                  style={{
                                    padding: 2,
                                    textDecorationLine:
                                      selector.receptionistData.RetailCount > 0
                                        ? "underline"
                                        : "none",
                                  }}
                                >
                                  {selector.receptionistData.RetailCount}
                                </Text>
                              </View>
                              <View style={styles.view20}>
                                <Text
                                  onPress={() => {
                                    navigateToDropLostCancel();
                                  }}
                                  style={{
                                    padding: 2,
                                    textDecorationLine:
                                      selector.receptionistData.totalLostCount >
                                      0
                                        ? "underline"
                                        : "none",
                                  }}
                                >
                                  {selector.receptionistData.totalLostCount}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.view21}>
                            <View style={{ ...styles.statWrap, width: "33%" }}>
                              <Text style={styles.txt5}>E2B</Text>
                              {selector.receptionistData.bookingsCount !==
                                null &&
                              selector.receptionistData.enquirysCount !==
                                null ? (
                                <Text
                                  style={{
                                    color:
                                      Math.floor(
                                        (parseInt(
                                          selector.receptionistData
                                            .bookingsCount
                                        ) /
                                          parseInt(
                                            selector.receptionistData
                                              .enquirysCount
                                          )) *
                                          100
                                      ) > 40
                                        ? "#14ce40"
                                        : "#ff0000",
                                    fontSize: 12,
                                    marginRight: 4,
                                  }}
                                >
                                  {parseInt(
                                    selector.receptionistData.bookingsCount
                                  ) === 0 ||
                                  parseInt(
                                    selector.receptionistData.enquirysCount
                                  ) === 0
                                    ? 0
                                    : Math.round(
                                        (parseInt(
                                          selector.receptionistData
                                            .bookingsCount
                                        ) /
                                          parseInt(
                                            selector.receptionistData
                                              .enquirysCount
                                          )) *
                                          100
                                      )}
                                  %
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    color: "#ff0000",
                                    fontSize: 12,
                                  }}
                                >
                                  0%
                                </Text>
                              )}
                            </View>
                            <View style={{ ...styles.statWrap, width: "33%" }}>
                              <Text style={styles.txt6}>B2R</Text>
                              {selector.receptionistData.bookingsCount !==
                                null &&
                              selector.receptionistData.RetailCount !== null ? (
                                <Text
                                  style={{
                                    color:
                                      Math.floor(
                                        (parseInt(
                                          selector.receptionistData.RetailCount
                                        ) /
                                          parseInt(
                                            selector.receptionistData
                                              .bookingsCount
                                          )) *
                                          100
                                      ) > 40
                                        ? "#14ce40"
                                        : "#ff0000",
                                    fontSize: 12,
                                    marginRight: 4,
                                  }}
                                >
                                  {parseInt(
                                    selector.receptionistData.RetailCount
                                  ) === 0 ||
                                  parseInt(
                                    selector.receptionistData.bookingsCount
                                  ) === 0
                                    ? 0
                                    : Math.round(
                                        (parseInt(
                                          selector.receptionistData.RetailCount
                                        ) /
                                          parseInt(
                                            selector.receptionistData
                                              .bookingsCount
                                          )) *
                                          100
                                      )}
                                  %
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    color: "#ff0000",
                                    fontSize: 12,
                                  }}
                                >
                                  0%
                                </Text>
                              )}
                            </View>
                            <View style={{ ...styles.statWrap, width: "33%" }}>
                              <Text style={styles.txt6}>E2R</Text>
                              {selector.receptionistData.enquirysCount !==
                                null &&
                              selector.receptionistData.RetailCount !== null ? (
                                <Text
                                  style={{
                                    color:
                                      Math.floor(
                                        (parseInt(
                                          selector.receptionistData
                                            .enquirysCount
                                        ) /
                                          parseInt(
                                            selector.receptionistData
                                              .RetailCount
                                          )) *
                                          100
                                      ) > 40
                                        ? "#14ce40"
                                        : "#ff0000",
                                    fontSize: 12,
                                    marginRight: 4,
                                  }}
                                >
                                  {parseInt(
                                    selector.receptionistData.enquirysCount
                                  ) === 0 ||
                                  parseInt(
                                    selector.receptionistData.RetailCount
                                  ) === 0
                                    ? 0
                                    : Math.round(
                                        (parseInt(
                                          selector.receptionistData
                                            .enquirysCount
                                        ) /
                                          parseInt(
                                            selector.receptionistData
                                              .RetailCount
                                          )) *
                                          100
                                      )}
                                  %
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    color: "#ff0000",
                                    fontSize: 12,
                                  }}
                                >
                                  0%
                                </Text>
                              )}
                            </View>
                          </View>
                        </ScrollView>
                      </>
                    ) : null}
                  </>
                </>
              )}
        </View>
      ) : (
        <LoaderComponent
          visible={selector.isLoading}
          onRequestClose={() => {}}
        />
      )}
    </React.Fragment>
  );
};

export default DigitalDashBoardTargetScreen;

export const SourceModelView = ({ style = null, onClick }) => {
  return (
    <Animated.View style={style}>
      <Pressable onPress={onClick}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: Colors.BLUE,
            marginLeft: 8,
            textDecorationLine: "underline",
          }}
        >
          Source/Model
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export const RenderLevel1NameView = ({
  level,
  item,
  branchName = "",
  color,
  titleClick,
  navigation,
  disable = false,
  receptionManager = false,
}) => {
  return (
    <View
      style={{
        width: 100,
        justifyContent: "center",
        textAlign: "center",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <View
        style={{ width: 60, justifyContent: "center", alignItems: "center" }}
      >
        <TouchableOpacity
          disabled={disable}
          style={{
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: color,
            borderRadius: 20,
            marginTop: 5,
            marginBottom: 5,
          }}
          onPress={titleClick}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#fff",
            }}
          >
            {item?.empName?.charAt(0)}
          </Text>
        </TouchableOpacity>
        {/* {level === 0 && !!branchName && ( */}
        {branchName ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="map-marker"
              style={{ padding: 0, margin: 0 }}
              color={Colors.RED}
              size={8}
            />
            <Text style={{ fontSize: 8 }} numberOfLines={2}>
              {branchName}
            </Text>
          </View>
        ) : null}
        {/* )} */}
      </View>
      <View
        style={{
          width: "25%",
          justifyContent: "space-around",
          textAlign: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>
          {receptionManager ? "" : "ACH"}
        </Text>
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>
          {receptionManager ? "" : "TGT"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingTop: 10,
  },
  statWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    backgroundColor: "#F5F5F5",
  },
  itemBox: {
    width: 55,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  shuffleBGView: {
    width: 30,
    height: 30,
    borderRadius: 60 / 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  dropdownContainer: {
    backgroundColor: "white",
    padding: 13,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    width: "95%",
    height: 45,
    borderRadius: 5,
    margin: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  grandTotalText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  totalView: { minHeight: 40, alignItems: "center", justifyContent: "center" },
  totalText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
    textAlign: "center",
  },
  percentageToggleView: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  paramsToggleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: Colors.RED,
    paddingBottom: 8,
  },
  paramsToggleControl: {
    marginHorizontal: 4,
    justifyContent: "center",
    alignSelf: "flex-end",
    height: 24,
    marginTop: 8,
    width: "75%",
  },
  view1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: Colors.RED,
    paddingBottom: 8,
  },

  view2: { height: 24, width: "20%", marginLeft: 4 },
  scrollview: {
    paddingRight: 0,
    flexDirection: "column",
  },
  view3: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    paddingBottom: 4,
    borderBottomColor: Colors.GRAY,
    marginLeft: 0,
  },
  view4: {
    width: "100%",
    height: 20,
    flexDirection: "row",
  },
  view5: {
    backgroundColor: "lightgrey",
    flexDirection: "row",
    paddingHorizontal: 7,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    alignSelf: "flex-start",
    marginLeft: 7,
  },
  view6: {
    width: "100%",
    minHeight: 40,
    flexDirection: "column",
    paddingHorizontal: 2,
  },
  view7: {
    width: "100%",
    minHeight: 40,
    flexDirection: "row",
  },
  view8: {
    minHeight: 40,
    flexDirection: "column",
    width: "98%",
  },
  view9: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  view10: {
    paddingHorizontal: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  matView: {
    backgroundColor: "lightgrey",
    flexDirection: "row",
    paddingHorizontal: 7,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    alignSelf: "flex-start",
    marginLeft: 7,
  },
  view11: {
    paddingHorizontal: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  view12: {
    flexDirection: "row",
    height: 40,
    backgroundColor: Colors.CORAL,
  },
  txt1: {
    fontSize: 10,
    fontWeight: "bold",
    paddingVertical: 6,
    paddingRight: 2,
    height: 22,
    color: Colors.WHITE,
  },
  txt2: {
    fontSize: 10,
    fontWeight: "bold",
    paddingVertical: 6,
    height: 25,
    color: Colors.WHITE,
  },
  view13: {
    width: "62%",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 15,
    flexDirection: "row",
    paddingRight: 16,
  },
  txt3: { fontSize: 14, fontWeight: "600" },
  view14: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 10,
    marginRight: 10,
  },
  view15: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  txt4: {
    fontSize: 13,
    fontWeight: "400",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  view16: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  view17: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "35%",
  },
  view18: {
    width: "60%",
    justifyContent: "space-around",
    flexDirection: "row",
    height: 25,
    alignItems: "center",
    // marginTop: 8,
    marginLeft: 20,
  },
  view19: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
    marginVertical: 8,
  },
  view20: {
    minWidth: 45,
    height: 25,
    borderColor: "#00b1ff",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  view21: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
    marginHorizontal: 8,
  },
  txt5: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    flexDirection: "row",
  },
  txt6: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  txt7: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
});
