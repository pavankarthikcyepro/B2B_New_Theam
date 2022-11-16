import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../../../styles";
import { LoaderComponent } from "../../../../components";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import * as AsyncStore from "../../../../asyncStore";
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
} from "../../../../redux/homeReducer";
import { RenderGrandTotal } from "./components/RenderGrandTotal";
import { RenderEmployeeParameters } from "./components/RenderEmployeeParameters";
import { RenderSelfInsights } from "./components/RenderSelfInsights";
import { useNavigation } from "@react-navigation/native";
import { AppNavigator } from "../../../../navigations";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import PercentageToggleControl from "./components/EmployeeView/PercentageToggleControl";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { client } from "../../../../networking/client";
import URL from "../../../../networking/endpoints";

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 5;

const TargetScreen = ({ route }) => {
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

  const getEmployeeListFromServer = async (user) => {
    const payload = {
      empId: user.empId,
    };
    dispatch(getEmployeesList(payload));
  };

  const getReportingManagerListFromServer = async (user) => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(
        delegateTask({
          fromUserId: jsonObj.empId,
          toUserId: user.empId,
        })
      );
    }
    dispatch(getReportingManagerList(user.orgId));
  };

  const updateEmployeeData = async () => {
    if (
      employeeListDropdownItem !== 0 &&
      reoprtingManagerListDropdownItem !== 0
    ) {
      const payload = {
        empID: selectedUser.empId,
        managerID: reoprtingManagerListDropdownItem,
      };
      Promise.all([dispatch(updateEmployeeDataBasedOnDelegate(payload))]).then(
        async () => {
          setDelegateButtonClick(false);
          setHeaderTitle(
            "Selected employees has Active tasks. Please delegate to another employee"
          );
          setDropDownPlaceHolder("Employees");

          setEmployeeListDropdownItem(0);
          setEmployeeDropdownList([]);
          setReoprtingManagerListDropdownItem(0);
          setReoprtingManagerDropdownList([]);
          setSelectedUser(null);
          const employeeData = await AsyncStore.getData(
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
            const payload2 = {
              orgId: jsonObj.orgId,
              selectedEmpId: jsonObj.empId,
              endDate: monthLastDate,
              loggedInEmpId: jsonObj.empId,
              empId: jsonObj.empId,
              startDate: monthFirstDate,
              levelSelected: null,
              pageNo: 0,
              size: 100,
            };
            Promise.allSettled([
              dispatch(getNewTargetParametersAllData(payload2)),
              dispatch(getTotalTargetParametersData(payload2)),
            ]).then(() => { });
          }
        }
      );
    }
  };

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
      let data = [...paramsMetadata];
      data = data.filter((x) => x.toggleIndex === 0);
      setToggleParamsMetaData([...data]);
    }
  }, [selector.isTeam]);

  // const handleModalDropdownDataForShuffle = (user) => {
  //     if (delegateButtonClick) {
  //         getReportingManagerListFromServer(user);
  //         setShowShuffleModal(true);
  //         // setReoprtingManagerDropdownList(selector.reporting_manager_list.map(({ name: label, id: value, ...rest }) => ({ value, label, ...rest })));
  //     } else {
  //         getEmployeeListFromServer(user);
  //         setShowShuffleModal(true);
  //         // setEmployeeDropdownList(selector.employee_list.map(({ name: label, id: value, ...rest }) => ({ value, label, ...rest })));
  //     }
  // }

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
    setReoprtingManagerDropdownList(
      selector.reporting_manager_list.map(
        ({ name: label, id: value, ...rest }) => ({ value, label, ...rest })
      )
    );
  }, [selector.reporting_manager_list]);

  useEffect(async () => {
    setIsLoading(true);
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        if (selector.all_emp_parameters_data.length > 0) {
          let tempParams = [
            ...selector.all_emp_parameters_data.filter(
              (item) => item.empId !== jsonObj.empId
            ),
          ];
          for (let i = 0; i < tempParams.length; i++) {
            tempParams[i] = {
              ...tempParams[i],
              isOpenInner: false,
              employeeTargetAchievements: [],
              tempTargetAchievements: tempParams[i]?.targetAchievements,
            };
            // tempParams[i]["isOpenInner"] = false;
            // tempParams[i]["employeeTargetAchievements"] = [];
            if (i === tempParams.length - 1) {
              setAllParameters([...tempParams]);
            }
            let newIds = tempParams.map((emp) => emp.empId);
            for (let k = 0; k < newIds.length; k++) {
              const element = newIds[k].toString();
              let tempPayload = getTotalPayload(employeeData, element);
              const response = await client.post(
                URL.GET_TOTAL_TARGET_PARAMS(),
                tempPayload
              );
              const json = await response.json();
              tempParams[k].targetAchievements = json;
              setAllParameters([...tempParams]);
            }
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [selector.all_emp_parameters_data]);

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
  const renderData = (item, color) => {
    return (
      <View
        style={{ flexDirection: "row", backgroundColor: Colors.BORDER_COLOR }}
      >
        <RenderEmployeeParameters
          item={item}
          displayType={togglePercentage}
          params={toggleParamsMetaData}
          navigation={navigation}
          moduleType={"home"}
        />
      </View>
    );
  };

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
                  if (newIds.length >= 2) {
                    for (let i = 0; i < newIds.length; i++) {
                      const element = newIds[i].toString();
                      let tempPayload = getTotalPayload(employeeData,
                        element,
                      );
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

  return (
    <>
      {!selector.isLoading ? (
        <View style={styles.container}>
          {selector.isTeam ? (
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottomWidth: 2,
                  borderBottomColor: Colors.RED,
                  paddingBottom: 8,
                }}
              >
                <SegmentedControl
                  style={{
                    marginHorizontal: 4,
                    justifyContent: "center",
                    alignSelf: "flex-end",
                    height: 24,
                    marginTop: 8,
                    width: "75%",
                    backgroundColor: "rgb(211,211,211,0.65)",
                  }}
                  values={["ETVBRL", "Allied", "View All"]}
                  selectedIndex={toggleParamsIndex}
                  tintColor={Colors.RED}
                  fontStyle={{ color: Colors.BLACK, fontSize: 10 }}
                  activeFontStyle={{ color: Colors.WHITE, fontSize: 10 }}
                  onChange={(event) => toggleParamsView(event)}
                />
                <View style={{ height: 24, width: "20%", marginLeft: 4 }}>
                  <View style={styles.percentageToggleView}>
                    <PercentageToggleControl
                      toggleChange={(x) => setTogglePercentage(x)}
                    />
                  </View>
                </View>
              </View>
               {isLoading ? <ActivityIndicator color={Colors.RED} size={'large'} style={{ marginTop: 15 }} /> :
              <ScrollView
                contentContainerStyle={{
                  paddingRight: 0,
                  flexDirection: "column",
                }}
                horizontal={true}
                directionalLockEnabled={true}
                showsHorizontalScrollIndicator={false}
              >
                <View>
                  {/* TOP Header view */}
                  <View
                    key={"headers"}
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 0.5,
                      paddingBottom: 4,
                      borderBottomColor: Colors.GRAY,
                      marginLeft: 0,
                    }}
                  >
                    <View
                      style={{ width: 100, height: 20, marginRight: 5 }}
                    ></View>
                    <View
                      style={{
                        width: "100%",
                        height: 20,
                        flexDirection: "row",
                      }}
                    >
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
                  {/* Employee params section */}
                  <ScrollView
                    style={{ height: Dimensions.get("screen").height / 2.2 }}
                  // style={{ height: selector.isMD ? "81%" : "80%" }}
                  >
                    {allParameters.length > 0 &&
                      allParameters.map((item, index) => {
                        return (
                          <View key={`${item.empId} ${index}`}>
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
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "600",
                                  textTransform: "capitalize",
                                }}
                              >
                                {item.empName}
                              </Text>
                              <SourceModelView
                                onClick={() => {
                                  navigation.navigate(
                                    AppNavigator.HomeStackIdentifiers
                                      .sourceModel,
                                    {
                                      empId: item.empId,
                                      headerTitle: item.empName,
                                      loggedInEmpId:
                                        selector.login_employee_details.empId,
                                      orgId:
                                        selector.login_employee_details.orgId,
                                      type: "TEAM",
                                      moduleType: "home",
                                    }
                                  );
                                }}
                              />
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
                              <View
                                style={[
                                  {
                                    width: "100%",
                                    minHeight: 40,
                                    flexDirection: "column",
                                    paddingHorizontal: 2,
                                  },
                                ]}
                              >
                                <View
                                  style={{
                                    width: "100%",
                                    minHeight: 40,
                                    flexDirection: "row",
                                  }}
                                >
                                  <RenderLevel1NameView
                                    level={0}
                                    item={item}
                                    branchName={getBranchName(item.branchId)}
                                    color={"#C62159"}
                                    titleClick={async () => {
                                      let localData = [...allParameters];
                                      await onEmployeeNameClick(
                                        item,
                                        index,
                                        localData
                                      );
                                    }}
                                  />
                                  {renderData(item, "#C62159")}
                                </View>

                                {item.isOpenInner &&
                                  item.employeeTargetAchievements.length >
                                  0 &&
                                  item.employeeTargetAchievements.map(
                                    (innerItem1, innerIndex1) => {
                                      return (
                                        <View
                                          key={innerIndex1}
                                          style={[
                                            {
                                              width: "100%",
                                              minHeight: 40,
                                              flexDirection: "column",
                                              overflow: "hidden",
                                            },
                                            innerItem1.isOpenInner && {
                                              borderRadius: 10,
                                              borderWidth: 2,
                                              borderColor: Colors.CORAL,
                                              backgroundColor: "#FFFFFF",
                                            },
                                          ]}
                                        >
                                          <View
                                            style={[
                                              {
                                                minHeight: 40,
                                                flexDirection: "column",
                                                width: "98%",
                                              },
                                            ]}
                                          >
                                            <View
                                              style={{
                                                width:
                                                  Dimensions.get("screen")
                                                    .width - 40,
                                              }}
                                            >
                                              <View
                                                style={{
                                                  paddingHorizontal: 4,
                                                  display: "flex",
                                                  flexDirection: "row",
                                                  justifyContent:
                                                    "space-between",
                                                  marginTop: 8,
                                                }}
                                              >
                                                <Text
                                                  style={{
                                                    fontSize: 10,
                                                    fontWeight: "500",
                                                  }}
                                                >
                                                  {innerItem1.empName}
                                                </Text>
                                                <SourceModelView
                                                  onClick={() => {
                                                    navigation.navigate(
                                                      AppNavigator
                                                        .HomeStackIdentifiers
                                                        .sourceModel,
                                                      {
                                                        empId:
                                                          innerItem1.empId,
                                                        headerTitle:
                                                          innerItem1.empName,
                                                        type: "TEAM",
                                                        moduleType: "home",
                                                      }
                                                    );
                                                  }}
                                                />
                                              </View>
                                              {/*Source/Model View END */}
                                              <View
                                                style={{
                                                  flexDirection: "row",
                                                }}
                                              >
                                                <RenderLevel1NameView
                                                  level={1}
                                                  item={innerItem1}
                                                  color={Colors.CORAL}
                                                  titleClick={async () => {
                                                    const localData = [
                                                      ...allParameters,
                                                    ];
                                                    const localParameter =
                                                      localData[index]
                                                        .employeeTargetAchievements;
                                                    await onEmployeeNameClick(
                                                      innerItem1,
                                                      innerIndex1,
                                                      localParameter
                                                    );
                                                  }}
                                                />
                                                {renderData(
                                                  innerItem1,
                                                  "#F59D00"
                                                )}
                                              </View>
                                            </View>
                                            {innerItem1.isOpenInner &&
                                              innerItem1
                                                .employeeTargetAchievements
                                                .length > 0 &&
                                              innerItem1.employeeTargetAchievements.map(
                                                (innerItem2, innerIndex2) => {
                                                  return (
                                                    <View
                                                      key={innerIndex2}
                                                      style={[
                                                        {
                                                          width: "100%",
                                                          minHeight: 40,
                                                          flexDirection:
                                                            "column",
                                                        },
                                                        innerItem2.isOpenInner && {
                                                          borderRadius: 10,
                                                          borderWidth: 2,
                                                          borderColor:
                                                            "#2C97DE",
                                                          backgroundColor:
                                                            "#EEEEEE",
                                                          marginHorizontal: 5,
                                                          overflow: "hidden",
                                                        },
                                                      ]}
                                                    >
                                                      <View
                                                        style={{
                                                          paddingHorizontal: 4,
                                                          display: "flex",
                                                          flexDirection:
                                                            "row",
                                                          justifyContent:
                                                            "space-between",
                                                          paddingVertical: 4,
                                                          width:
                                                            Dimensions.get(
                                                              "screen"
                                                            ).width -
                                                            (innerItem2.isOpenInner
                                                              ? 47
                                                              : 42),
                                                        }}
                                                      >
                                                        <Text
                                                          style={{
                                                            fontSize: 10,
                                                            fontWeight: "500",
                                                          }}
                                                        >
                                                          {innerItem2.empName}
                                                        </Text>
                                                        <SourceModelView
                                                          onClick={() => {
                                                            navigation.navigate(
                                                              AppNavigator
                                                                .HomeStackIdentifiers
                                                                .sourceModel,
                                                              {
                                                                empId:
                                                                  innerItem2.empId,
                                                                headerTitle:
                                                                  innerItem2.empName,
                                                                type: "TEAM",
                                                                moduleType:
                                                                  "home",
                                                              }
                                                            );
                                                          }}
                                                        />
                                                      </View>
                                                      <View
                                                        style={{
                                                          flexDirection:
                                                            "row",
                                                        }}
                                                      >
                                                        <RenderLevel1NameView
                                                          level={2}
                                                          item={innerItem2}
                                                          color={"#2C97DE"}
                                                          titleClick={async () => {
                                                            const localData =
                                                              [
                                                                ...allParameters,
                                                              ];
                                                            const localParameter =
                                                              localData[index]
                                                                .employeeTargetAchievements[
                                                                innerIndex1
                                                              ]
                                                                .employeeTargetAchievements;
                                                            await onEmployeeNameClick(
                                                              innerItem2,
                                                              innerIndex2,
                                                              localParameter
                                                            );
                                                          }}
                                                        />
                                                        {renderData(
                                                          innerItem2,
                                                          "#2C97DE"
                                                        )}
                                                      </View>
                                                      {innerItem2.isOpenInner &&
                                                        innerItem2
                                                          .employeeTargetAchievements
                                                          .length > 0 &&
                                                        innerItem2.employeeTargetAchievements.map(
                                                          (
                                                            innerItem3,
                                                            innerIndex3
                                                          ) => {
                                                            return (
                                                              <View
                                                                key={
                                                                  innerIndex3
                                                                }
                                                                style={[
                                                                  {
                                                                    width:
                                                                      "98%",
                                                                    minHeight: 40,
                                                                    flexDirection:
                                                                      "column",
                                                                  },
                                                                  innerItem3.isOpenInner && {
                                                                    borderRadius: 10,
                                                                    borderWidth: 1,
                                                                    borderColor:
                                                                      "#EC3466",
                                                                    backgroundColor:
                                                                      "#FFFFFF",
                                                                    marginHorizontal: 5,
                                                                  },
                                                                ]}
                                                              >
                                                                <View
                                                                  style={{
                                                                    paddingHorizontal: 4,
                                                                    display:
                                                                      "flex",
                                                                    flexDirection:
                                                                      "row",
                                                                    justifyContent:
                                                                      "space-between",
                                                                    paddingVertical: 4,
                                                                  }}
                                                                >
                                                                  <Text
                                                                    style={{
                                                                      fontSize: 10,
                                                                      fontWeight:
                                                                        "500",
                                                                    }}
                                                                  >
                                                                    {
                                                                      innerItem3.empName
                                                                    }
                                                                  </Text>
                                                                  <SourceModelView
                                                                    onClick={() => {
                                                                      navigation.navigate(
                                                                        AppNavigator
                                                                          .HomeStackIdentifiers
                                                                          .sourceModel,
                                                                        {
                                                                          empId:
                                                                            innerItem3.empId,
                                                                          headerTitle:
                                                                            innerItem3.empName,
                                                                          type: "TEAM",
                                                                          moduleType:
                                                                            "home",
                                                                        }
                                                                      );
                                                                    }}
                                                                  />
                                                                </View>
                                                                <View
                                                                  style={{
                                                                    flexDirection:
                                                                      "row",
                                                                  }}
                                                                >
                                                                  <RenderLevel1NameView
                                                                    level={3}
                                                                    item={
                                                                      innerItem3
                                                                    }
                                                                    color={
                                                                      "#EC3466"
                                                                    }
                                                                    titleClick={async () => {
                                                                      const localData =
                                                                        [
                                                                          ...allParameters,
                                                                        ];
                                                                      const localParameter =
                                                                        localData[
                                                                          index
                                                                        ]
                                                                          .employeeTargetAchievements[
                                                                          innerIndex1
                                                                        ]
                                                                          .employeeTargetAchievements[
                                                                          innerIndex2
                                                                        ]
                                                                          .employeeTargetAchievements;
                                                                      await onEmployeeNameClick(
                                                                        innerItem3,
                                                                        innerIndex3,
                                                                        localParameter
                                                                      );
                                                                    }}
                                                                  />

                                                                  {renderData(
                                                                    innerItem3,
                                                                    "#EC3466"
                                                                  )}
                                                                </View>
                                                                {innerItem3.isOpenInner &&
                                                                  innerItem3
                                                                    .employeeTargetAchievements
                                                                    .length >
                                                                  0 &&
                                                                  innerItem3.employeeTargetAchievements.map(
                                                                    (
                                                                      innerItem4,
                                                                      innerIndex4
                                                                    ) => {
                                                                      return (
                                                                        <View
                                                                          key={
                                                                            innerIndex4
                                                                          }
                                                                          style={[
                                                                            {
                                                                              width:
                                                                                "98%",
                                                                              minHeight: 40,
                                                                              flexDirection:
                                                                                "column",
                                                                            },
                                                                            innerItem4.isOpenInner && {
                                                                              borderRadius: 10,
                                                                              borderWidth: 1,
                                                                              borderColor:
                                                                                "#1C95A6",
                                                                              backgroundColor:
                                                                                "#EEEEEE",
                                                                              marginHorizontal: 5,
                                                                            },
                                                                          ]}
                                                                        >
                                                                          <View
                                                                            style={{
                                                                              flexDirection:
                                                                                "row",
                                                                            }}
                                                                          >
                                                                            <RenderLevel1NameView
                                                                              level={
                                                                                4
                                                                              }
                                                                              item={
                                                                                innerItem4
                                                                              }
                                                                              color={
                                                                                "#1C95A6"
                                                                              }
                                                                              titleClick={async () => {
                                                                                const localData =
                                                                                  [
                                                                                    ...allParameters,
                                                                                  ];
                                                                                const localParameter =
                                                                                  localData[
                                                                                    index
                                                                                  ]
                                                                                    .employeeTargetAchievements[
                                                                                    innerIndex1
                                                                                  ]
                                                                                    .employeeTargetAchievements[
                                                                                    innerIndex2
                                                                                  ]
                                                                                    .employeeTargetAchievements[
                                                                                    innerIndex3
                                                                                  ]
                                                                                    .employeeTargetAchievements;
                                                                                await onEmployeeNameClick(
                                                                                  innerItem4,
                                                                                  innerIndex4,
                                                                                  localParameter
                                                                                );
                                                                              }}
                                                                            />
                                                                            {renderData(
                                                                              innerItem4,
                                                                              "#1C95A6"
                                                                            )}
                                                                          </View>
                                                                          {innerItem4.isOpenInner &&
                                                                            innerItem4
                                                                              .employeeTargetAchievements
                                                                              .length >
                                                                            0 &&
                                                                            innerItem4.employeeTargetAchievements.map(
                                                                              (
                                                                                innerItem5,
                                                                                innerIndex5
                                                                              ) => {
                                                                                return (
                                                                                  <View
                                                                                    key={
                                                                                      innerIndex5
                                                                                    }
                                                                                    style={[
                                                                                      {
                                                                                        width:
                                                                                          "98%",
                                                                                        minHeight: 40,
                                                                                        flexDirection:
                                                                                          "column",
                                                                                      },
                                                                                      innerItem5.isOpenInner && {
                                                                                        borderRadius: 10,
                                                                                        borderWidth: 1,
                                                                                        borderColor:
                                                                                          "#C62159",
                                                                                        backgroundColor:
                                                                                          "#FFFFFF",
                                                                                        marginHorizontal: 5,
                                                                                      },
                                                                                    ]}
                                                                                  >
                                                                                    <View
                                                                                      style={{
                                                                                        flexDirection:
                                                                                          "row",
                                                                                      }}
                                                                                    >
                                                                                      <RenderLevel1NameView
                                                                                        level={
                                                                                          5
                                                                                        }
                                                                                        item={
                                                                                          innerItem5
                                                                                        }
                                                                                        color={
                                                                                          "#C62159"
                                                                                        }
                                                                                        titleClick={async () => {
                                                                                          const localData =
                                                                                            [
                                                                                              ...allParameters,
                                                                                            ];
                                                                                          const localParameter =
                                                                                            localData[
                                                                                              index
                                                                                            ]
                                                                                              .employeeTargetAchievements[
                                                                                              innerIndex1
                                                                                            ]
                                                                                              .employeeTargetAchievements[
                                                                                              innerIndex2
                                                                                            ]
                                                                                              .employeeTargetAchievements[
                                                                                              innerIndex3
                                                                                            ]
                                                                                              .employeeTargetAchievements[
                                                                                              innerIndex4
                                                                                            ]
                                                                                              .employeeTargetAchievements;
                                                                                          await onEmployeeNameClick(
                                                                                            innerItem5,
                                                                                            innerIndex5,
                                                                                            localParameter
                                                                                          );
                                                                                        }}
                                                                                      />
                                                                                      {renderData(
                                                                                        innerItem5,
                                                                                        "#C62159"
                                                                                      )}
                                                                                    </View>
                                                                                    {innerItem5.isOpenInner &&
                                                                                      innerItem5
                                                                                        .employeeTargetAchievements
                                                                                        .length >
                                                                                      0 &&
                                                                                      innerItem5.employeeTargetAchievements.map(
                                                                                        (
                                                                                          innerItem6,
                                                                                          innerIndex6
                                                                                        ) => {
                                                                                          return (
                                                                                            <View
                                                                                              key={
                                                                                                innerIndex6
                                                                                              }
                                                                                              style={[
                                                                                                {
                                                                                                  width:
                                                                                                    "98%",
                                                                                                  minHeight: 40,
                                                                                                  flexDirection:
                                                                                                    "column",
                                                                                                },
                                                                                                innerItem6.isOpenInner && {
                                                                                                  borderRadius: 10,
                                                                                                  borderWidth: 1,
                                                                                                  borderColor:
                                                                                                    "#C62159",
                                                                                                  backgroundColor:
                                                                                                    "#FFFFFF",
                                                                                                  marginHorizontal: 5,
                                                                                                },
                                                                                              ]}
                                                                                            >
                                                                                              <View
                                                                                                style={{
                                                                                                  flexDirection:
                                                                                                    "row",
                                                                                                }}
                                                                                              >
                                                                                                <RenderLevel1NameView
                                                                                                  level={
                                                                                                    6
                                                                                                  }
                                                                                                  item={
                                                                                                    innerItem6
                                                                                                  }
                                                                                                  color={
                                                                                                    "#C62159"
                                                                                                  }
                                                                                                  titleClick={async () => {
                                                                                                    const localData =
                                                                                                      [
                                                                                                        ...allParameters,
                                                                                                      ];
                                                                                                    const localParameter =
                                                                                                      localData[
                                                                                                        index
                                                                                                      ]
                                                                                                        .employeeTargetAchievements[
                                                                                                        innerIndex1
                                                                                                      ]
                                                                                                        .employeeTargetAchievements[
                                                                                                        innerIndex2
                                                                                                      ]
                                                                                                        .employeeTargetAchievements[
                                                                                                        innerIndex3
                                                                                                      ]
                                                                                                        .employeeTargetAchievements[
                                                                                                        innerIndex4
                                                                                                      ]
                                                                                                        .employeeTargetAchievements[
                                                                                                        innerIndex5
                                                                                                      ]
                                                                                                        .employeeTargetAchievements;
                                                                                                    await onEmployeeNameClick(
                                                                                                      innerItem6,
                                                                                                      innerIndex6,
                                                                                                      localParameter
                                                                                                    );
                                                                                                  }}
                                                                                                />
                                                                                                {renderData(
                                                                                                  innerItem6,
                                                                                                  "#C62159"
                                                                                                )}
                                                                                              </View>
                                                                                            </View>
                                                                                          );
                                                                                        }
                                                                                      )}
                                                                                  </View>
                                                                                );
                                                                              }
                                                                            )}
                                                                        </View>
                                                                      );
                                                                    }
                                                                  )}
                                                              </View>
                                                            );
                                                          }
                                                        )}
                                                    </View>
                                                  );
                                                }
                                              )}
                                          </View>
                                        </View>
                                      );
                                    }
                                  )}
                                {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                              </View>
                            </View>
                          </View>
                        );
                      })}
                  </ScrollView>
                </View>
                {/* Grand Total Section */}
                {selector.totalParameters.length > 0 && (
                  <View
                    style={{ width: Dimensions.get("screen").width - 35 }}
                  >
                    <SourceModelView
                      style={{ alignSelf: "flex-end" }}
                      onClick={async () => {
                          let employeeData = await AsyncStore.getData(
                            AsyncStore.Keys.LOGIN_EMPLOYEE
                          );
                          if (employeeData) {
                            const jsonObj = JSON.parse(employeeData);
                            navigation.navigate(
                              AppNavigator.HomeStackIdentifiers.sourceModel,
                              {
                                empId: selector.login_employee_details.empId,
                                headerTitle: "Grand Total",
                                loggedInEmpId: jsonObj.empId,
                                type: "TEAM",
                                moduleType: "home",
                                orgId: selector.login_employee_details.orgId,
                              }
                            );
                          }
                        }}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        height: 40,
                        backgroundColor: Colors.CORAL,
                      }}
                    >
                      <View
                        style={{
                          width: 100,
                          justifyContent: "space-around",
                          flexDirection: "row",
                          backgroundColor: Colors.RED,
                          height: 45,
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
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "bold",
                              paddingVertical: 6,
                              paddingRight: 2,
                              height: 22,
                              color: Colors.WHITE,
                            }}
                          >
                            ACH
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "bold",
                              paddingVertical: 6,
                              height: 25,
                              color: Colors.WHITE,
                            }}
                          >
                            TGT
                          </Text>
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
                          <RenderGrandTotal
                            totalParams={selector.totalParameters}
                            displayType={togglePercentage}
                            params={toggleParamsMetaData}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>}
            </View>
          ) : (
            // IF Self or insights
            <>
              <View style={{ flexDirection: "row", marginVertical: 8 }}>
                <View
                  style={{
                    width: "62%",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: 15,
                    flexDirection: "row",
                    paddingRight: 16,
                  }}
                >
                  <View
                    style={[
                      styles.percentageToggleView,
                      { marginVertical: -8 },
                    ]}
                  >
                    <PercentageToggleControl
                      toggleChange={(x) => setTogglePercentage(x)}
                    />
                  </View>

                  <SourceModelView
                    style={{ alignSelf: "flex-end" }}
                    onClick={() => {
                      navigation.navigate(
                        AppNavigator.HomeStackIdentifiers.sourceModel,
                        {
                          empId: selector.login_employee_details.empId,
                          headerTitle: "Source/Model",
                          loggedInEmpId: selector.login_employee_details.empId,
                          type: selector.isDSE ? "SELF" : "INSIGHTS",
                          moduleType: "home",
                        }
                      );
                    }}
                  />
                </View>
                <View style={{ width: "30%", flexDirection: "row" }}>
                  <Text style={{ fontSize: 14, fontWeight: "600" }}>
                    Balance
                  </Text>
                  <View style={{ marginRight: 15 }}></View>
                  <Text style={{ fontSize: 14, fontWeight: "600" }}>
                    AR/Day
                  </Text>
                </View>
              </View>
              {/* Header view end */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <>
                  <View style={{paddingRight:10}}>
                    <View
                      style={{
                        width: "42%",
                        marginLeft: "14%",
                        marginBottom: -6,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontSize: 8 }}>ACH</Text>
                      <Text style={{ fontSize: 8 }}>TGT</Text>
                    </View>
                    <RenderSelfInsights
                      data={selfInsightsData}
                      type={togglePercentage}
                      navigation={navigation}
                      moduleType={"home"}
                    />
                  </View>
                </>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 16,
                    justifyContent: "space-between",
                    marginHorizontal: 8,
                  }}
                >
                  <View style={{ flexGrow: 1 }}>
                    <View style={{ height: 4 }}></View>
                    <View style={styles.statWrap}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: "600",
                          flexDirection: "row",
                        }}
                      >
                        E2B
                      </Text>
                      {bookingData !== null && enqData !== null ? (
                        <Text
                          style={{
                            color:
                              Math.floor(
                                (parseInt(bookingData?.achievment) /
                                  parseInt(enqData?.achievment)) *
                                100
                              ) > 40
                                ? "#14ce40"
                                : "#ff0000",
                            fontSize: 12,
                            marginRight: 4,
                          }}
                        >
                          {parseInt(bookingData?.achievment) === 0 ||
                            parseInt(enqData?.achievment) === 0
                            ? 0
                            : Math.round(
                              (parseInt(bookingData?.achievment) /
                                parseInt(enqData?.achievment)) *
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

                    <View style={{ height: 4 }}></View>
                    <View style={styles.statWrap}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        E2V
                      </Text>
                      {enqData !== null && visitData !== null ? (
                        <Text
                          style={{
                            color:
                              Math.floor(
                                (parseInt(visitData?.achievment) /
                                  parseInt(enqData?.achievment)) *
                                100
                              ) > 40
                                ? "#14ce40"
                                : "#ff0000",
                            fontSize: 12,
                            marginRight: 4,
                          }}
                        >
                          {parseInt(enqData?.achievment) === 0 ||
                            parseInt(visitData?.achievment) === 0
                            ? 0
                            : Math.round(
                              (parseInt(visitData?.achievment) /
                                parseInt(enqData?.achievment)) *
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

                    <View style={{ height: 4 }}></View>
                    <View style={styles.statWrap}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        FIN
                      </Text>
                      {finData !== null && retailData !== null ? (
                        <Text
                          style={{
                            color:
                              Math.floor(
                                (parseInt(finData?.achievment) /
                                  parseInt(retailData?.achievment)) *
                                100
                              ) > 40
                                ? "#14ce40"
                                : "#ff0000",
                            fontSize: 12,
                            marginRight: 4,
                          }}
                        >
                          {parseInt(finData?.achievment) === 0 ||
                            parseInt(retailData?.achievment) === 0
                            ? 0
                            : Math.round(
                              (parseInt(finData?.achievment) /
                                parseInt(retailData?.achievment)) *
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

                  <View style={{ flexGrow: 1, marginHorizontal: 2 }}>
                    <View style={{ height: 4 }}></View>
                    <View style={styles.statWrap}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        B2R
                      </Text>
                      {bookingData !== null && retailData !== null && (
                        <Text
                          style={{
                            color:
                              Math.floor(
                                (parseInt(retailData?.achievment) /
                                  parseInt(bookingData?.achievment)) *
                                100
                              ) > 40
                                ? "#14ce40"
                                : "#ff0000",
                            fontSize: 12,
                            marginRight: 4,
                          }}
                        >
                          {parseInt(bookingData?.achievment) === 0 ||
                            parseInt(retailData?.achievment) === 0
                            ? 0
                            : Math.round(
                              (parseInt(retailData?.achievment) /
                                parseInt(bookingData?.achievment)) *
                              100
                            )}
                          %
                        </Text>
                      )}
                    </View>

                    <View style={{ height: 4 }}></View>
                    <View style={styles.statWrap}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        E2TD
                      </Text>
                      {TDData !== null && enqData !== null && (
                        <Text
                          style={{
                            color:
                              Math.round(
                                (parseInt(TDData?.achievment) /
                                  parseInt(enqData?.achievment)) *
                                100
                              ) > 40
                                ? "#14ce40"
                                : "#ff0000",
                            fontSize: 12,
                            marginRight: 4,
                          }}
                        >
                          {parseInt(TDData?.achievment) === 0 ||
                            parseInt(enqData?.achievment) === 0
                            ? 0
                            : Math.floor(
                              (parseInt(TDData?.achievment) /
                                parseInt(enqData?.achievment)) *
                              100
                            )}
                          %
                        </Text>
                      )}
                    </View>

                    <View style={{ height: 4 }}></View>
                    <View style={styles.statWrap}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        INS
                      </Text>
                      {insData !== null && retailData !== null && (
                        <Text
                          style={{
                            color:
                              Math.round(
                                (parseInt(insData?.achievment) /
                                  parseInt(retailData?.achievment)) *
                                100
                              ) > 40
                                ? "#14ce40"
                                : "#ff0000",
                            fontSize: 12,
                            marginRight: 4,
                          }}
                        >
                          {parseInt(insData?.achievment) === 0 ||
                            parseInt(retailData?.achievment) === 0
                            ? 0
                            : Math.floor(
                              (parseInt(insData?.achievment) /
                                parseInt(retailData?.achievment)) *
                              100
                            )}
                          %
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={{ flexGrow: 1 }}>
                    <View style={{ height: 4 }}></View>
                    <View style={styles.statWrap}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        E2R
                      </Text>
                      {retailData !== null && enqData !== null && (
                        <Text
                          style={{
                            color:
                              Math.floor(
                                (parseInt(retailData?.achievment) /
                                  parseInt(enqData?.achievment)) *
                                100
                              ) > 40
                                ? "#14ce40"
                                : "#ff0000",
                            fontSize: 12,
                            marginRight: 4,
                          }}
                        >
                          {parseInt(retailData?.achievment) === 0 ||
                            parseInt(enqData?.achievment) === 0
                            ? 0
                            : Math.round(
                              (parseInt(retailData?.achievment) /
                                parseInt(enqData?.achievment)) *
                              100
                            )}
                          %
                        </Text>
                      )}
                    </View>

                    <View style={{ height: 4 }}></View>
                    <View style={styles.statWrap}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        EXG
                      </Text>
                      {exgData !== null && retailData !== null && (
                        <Text
                          style={{
                            color:
                              Math.round(
                                (parseInt(exgData?.achievment) /
                                  parseInt(retailData?.achievment)) *
                                100
                              ) > 40
                                ? "#14ce40"
                                : "#ff0000",
                            fontSize: 12,
                            marginRight: 4,
                          }}
                        >
                          {parseInt(exgData?.achievment) === 0 ||
                            parseInt(retailData?.achievment) === 0
                            ? 0
                            : Math.floor(
                              (parseInt(exgData?.achievment) /
                                parseInt(retailData?.achievment)) *
                              100
                            )}
                          %
                        </Text>
                      )}
                    </View>

                    <View style={{ height: 4 }}></View>
                    <View style={styles.statWrap}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        EXW
                      </Text>
                      {exwData !== null && retailData !== null ? (
                        <Text
                          style={{
                            color:
                              Math.floor(
                                (parseInt(exwData?.achievment) /
                                  parseInt(retailData?.achievment)) *
                                100
                              ) > 40
                                ? "#14ce40"
                                : "#ff0000",
                            fontSize: 12,
                            marginRight: 4,
                          }}
                        >
                          {parseInt(exwData?.achievment) === 0 ||
                            parseInt(retailData?.achievment) === 0
                            ? 0
                            : Math.round(
                              (parseInt(exwData?.achievment) /
                                parseInt(retailData?.achievment)) *
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
                </View>
                <View style={{ marginHorizontal: 8 }}>
                  <View style={{ height: 4 }}></View>
                  <View style={styles.statWrap}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      Accessories/Car
                    </Text>
                    {accData !== null && retailData !== null && (
                      <Text
                        style={{
                          color:
                            Math.round(
                              (parseInt(accData?.achievment) /
                                parseInt(retailData?.achievment)) *
                              100
                            ) > 40
                              ? "#14ce40"
                              : "#ff0000",
                          fontSize: 12,
                          marginRight: 4,
                        }}
                      >
                        {parseInt(accData?.achievment) === 0 ||
                          parseInt(retailData?.achievment) === 0
                          ? 0
                          : Math.floor(
                            (parseInt(accData?.achievment) /
                              parseInt(retailData?.achievment)) *
                            100
                          )}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={{ height: 20 }}></View>
              </ScrollView>
            </>
          )}
        </View>
      ) : (
        <LoaderComponent
          visible={selector.isLoading}
          onRequestClose={() => { }}
        />
      )}
    </>
  );
};

export default TargetScreen;

export const SourceModelView = ({ style = null, onClick }) => {
  return (
    <Pressable style={style} onPress={onClick}>
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
  );
};

export const RenderLevel1NameView = ({
  level,
  item,
  branchName = "",
  color,
  titleClick,
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
            {item.empName.charAt(0)}
          </Text>
        </TouchableOpacity>
        {level === 0 && !!branchName && (
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
        )}
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
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>ACH</Text>
        <Text style={{ fontSize: 10, fontWeight: "bold" }}>TGT</Text>
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
});
