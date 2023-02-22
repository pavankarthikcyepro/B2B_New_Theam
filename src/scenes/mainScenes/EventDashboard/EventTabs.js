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
  getUserWiseTargetParameters2,
  updateEmployeeDataBasedOnDelegate,
} from "../../../redux/homeReducer";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AppNavigator } from "../../../navigations";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import PercentageToggleControl from "../Home/TabScreens/components/EmployeeView/PercentageToggleControl";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { RenderGrandTotal } from "../Home/TabScreens/components/RenderGrandTotal";
import EventInsights from "./Insights";
import { RenderEmployeeParameters } from "../Home/TabScreens/components/RenderEmployeeParameters";

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
const EventDashBoardTargetScreen = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
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
  const [dropDownPlaceHolder, setDropDownPlaceHolder] = useState("Employees");
  const [allParameters, setAllParameters] = useState([]);
  const [receptionistTeamParameters, setReceptionistTeamParameters] = useState(
    []
  );
  const [totalOfTeam, setTotalofTeam] = useState([]);
  const [employeeDropdownList, setEmployeeDropdownList] = useState([]);

  const [branches, setBranches] = useState([]);
  const [togglePercentage, setTogglePercentage] = useState(0);
  const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
  const [toggleParamsMetaData, setToggleParamsMetaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const translation = useRef(new Animated.Value(0)).current;
  const [slideRight, setSlideRight] = useState();
  const [leadSource, setLeadSource] = useState([]);
  const [userData, setUserData] = useState({
    empId: 0,
    empName: "",
    hrmsRole: "",
    orgId: 0,
    branchs: [],
  });
  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));
  const scrollViewRef = useRef();
  const paramsMetadata = [
    {
      color: "#FA03B9",
      paramName: "PreEnquiry",
      shortName: "Con",
      initial: "C",
      toggleIndex: 0,
    },
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
    {
      color: "#9E31BE",
      paramName: "CONTACT PER CAR",
      shortName: "Cont/Car",
      initial: "CC",
      toggleIndex: 0,
    },
    {
      color: "#1C95A6",
      paramName: "ENQUIRY PER CAR",
      shortName: "Enq/Car",
      initial: "EC",
      toggleIndex: 0,
    },
    {
      color: "#C62159",
      paramName: "BOOKING PER CAR",
      shortName: "Bkg/Car",
      initial: "BC",
      toggleIndex: 0,
    },
  ];

  useEffect(() => {
    handleAnimation();
  }, [isLoading]);

  const handleAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ).start();
  };

  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  const animatedStyle = {
    transform: [
      {
        rotate: interpolateRotating,
      },
    ],
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

  const getFormattedInitialData = async (empId, initial, employees) => {
    const url = URL.EVENT_DASHBOARD();
    const response = await client.post(url, getTotalPayload(empId, employees));
    const newJson = await response.json();
    if (response.ok && newJson.length > 0) {
      if (initial) {
        setLeadSource(newJson);
      }
      return getFormattedIndividualData(newJson);
    }
    return null;
  };

  const getFormattedIndividualData = (value) => {
    const json = value;
    let data = Object.assign([], json);

    for (let i = 0; i < paramsMetadata.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[j].paramName === paramsMetadata[i].paramName) {
          let tmpIndex = Object.assign({}, json[j]);
          tmpIndex.toggleIndex = paramsMetadata[i].toggleIndex;
          data[j] = Object.assign({}, tmpIndex);
        }
      }
    }

    let newData = [...data];
    let tmpArr = [];
    for (let i = 0; i < newData.length; i++) {
      if (tmpArr.length > 0) {
        let existIndex = -1;
        for (let j = 0; j < tmpArr.length; j++) {
          if (tmpArr[j].paramName == newData[i].paramName) {
            existIndex = j;
            break;
          }
        }
        if (existIndex > -1) {
          tmpArr[existIndex].achievment =
            Number(tmpArr[existIndex].achievment) +
            Number(newData[i].achievment);
        } else {
          tmpArr.push(newData[i]);
        }
      } else {
        tmpArr.push(newData[i]);
      }
    }

    const groupedSources = Object.assign([], tmpArr);
    return groupedSources;
  };

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
        // getReceptionManagerTeam(jsonObj);
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
      let data = [...paramsMetadata];
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
          let selfData = await getFormatSelfData(employeeData, jsonObj.empId);
          if (selfData) {
            let myData = selfData?.employeeTargetAchievements?.filter(
              (e) => e.empId === jsonObj.empId
            )[0]?.targetAchievements;
            let employees = [];
            for (
              let i = 0;
              i < selfData?.employeeTargetAchievements.length;
              i++
            ) {
              const element = selfData?.employeeTargetAchievements[i];
              if (element.empId !== jsonObj.empId) {
                employees.push(element.empId);
              }
            }
            myParams[0] = {
              ...myParams[0],
              isOpenInner: false,
              employeeTargetAchievements: [],
              targetAchievements: await getFormattedInitialData(
                jsonObj.empId,
                true,
                employees
              ),
              tempTargetAchievements: getFormattedIndividualData(myData),
            };
            setAllParameters(myParams);
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [selector.all_emp_parameters_data, isFocused]);

  const getFormatSelfData = async (employeeData, empId, initial) => {
    const url = URL.GET_TEAMS_EVENT_PARAMS();
    // console.log("SELDFFF", getEmployeePayload(employeeData, { empId: empId }));
    const response = await client.post(
      url,
      getEmployeePayload(employeeData, { empId: empId })
    );
    const newJson = await response.json();
    return newJson;
  };

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

  const getTotalPayload = (item, employees) => {
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
      startDate: monthFirstDate,
      levelSelected: null,
      empId: item,
      pageNo: 0,
      size: 5,
      // empSelected: employees,
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

  const onEmployeeNameClick = async (item, index, lastParameter) => {
    if (item.childCount < 1) {
      return;
    }

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
        Promise.all([dispatch(getUserWiseTargetParameters2(payload))]).then(
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
                  tempTargetAchievements: getFormattedIndividualData(
                    tempRawData[i]?.targetAchievements
                  ),
                };
                if (i === tempRawData.length - 1) {
                  lastParameter[index].employeeTargetAchievements = tempRawData;
                  let newIds = tempRawData.map((emp) => emp.empId);
                  // if (newIds.length >= 2) {
                  for (let i = 0; i < newIds.length; i++) {
                    const element = newIds[i].toString();
                    let tempPayload = getTotalPayload(element);
                    const response = await client.post(
                      URL.EVENT_DASHBOARD(),
                      tempPayload
                    );
                    const json = await response.json();

                    if (Array.isArray(json)) {
                      lastParameter[index].employeeTargetAchievements[
                        i
                      ].targetAchievements =
                        lastParameter[index].employeeTargetAchievements[i]
                          .childCount == 0
                          ? getFormattedIndividualData(
                              tempRawData[i]?.targetAchievements
                            )
                          : getFormattedIndividualData(json);
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
    }, 100);
  }

  function navigateToDropLostCancel(params) {
    navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropLostCancel);
  }

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
          hideTgt={true}
        />
      </View>
    );
  };

  return (
    <React.Fragment>
      <>
        {!selector.isLoading || true ? (
          selector.isTeam ? (
            <View style={styles.container}>
              <View>
                <View style={styles.view1}>
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
                  <View style={styles.view2}>
                    <View style={styles.percentageToggleView}>
                      <PercentageToggleControl
                        toggleChange={(x) => setTogglePercentage(x)}
                      />
                    </View>
                  </View>
                </View>
                {isLoading ? (
                  <View
                    style={{
                      marginVertical: 15,
                      justifyContent: "center",
                      alignSelf: "center",
                      borderRadius: 8,
                    }}
                  >
                    <Animated.Image
                      style={[{ width: 40, height: 40 }, animatedStyle]}
                      resizeMode={"contain"}
                      source={require("../../../assets/images/cy.png")}
                    />
                  </View>
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
                      // handleScroll(e)
                    }}
                    bounces={false}
                    scrollEventThrottle={16}
                  >
                    <View>
                      {/* TOP Header view */}
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
                      {/* Employee params section */}
                      <View
                        style={{
                          height: Dimensions.get("screen").height / 2.7,
                        }}
                      >
                        <ScrollView
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
                                      width:
                                        Dimensions.get("screen").width - 28,
                                    }}
                                  >
                                    <View style={{ flexDirection: "row" }}>
                                      <Text
                                        style={{
                                          fontSize: 12,
                                          fontWeight: "600",
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {item.empName}
                                        {/* {item?.childCount > 1 ? "  |" : ""} */}
                                      </Text>
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                      {item?.childCount > 1 && (
                                        <Animated.View
                                          style={{
                                            transform: [
                                              { translateX: translation },
                                            ],
                                          }}
                                        >
                                          <View
                                            style={{
                                              backgroundColor: "lightgrey",
                                              flexDirection: "row",
                                              paddingHorizontal: 7,
                                              borderRadius: 10,
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              marginBottom: 5,
                                              alignSelf: "flex-start",
                                              marginLeft: 7,
                                              // transform: [{ translateX: translation }],
                                            }}
                                          >
                                            <MaterialIcons
                                              name="person"
                                              size={15}
                                              color={Colors.BLACK}
                                            />
                                            <Text>{item?.childCount}</Text>
                                          </View>
                                        </Animated.View>
                                      )}
                                      <SourceModelView
                                        onClick={() => {
                                          navigation.navigate(
                                            AppNavigator
                                              .EventDashboardStackIdentifiers
                                              .sourceModel,
                                            {
                                              empId: item.empId,
                                              headerTitle: item.empName,
                                              loggedInEmpId:
                                                selector.login_employee_details
                                                  .empId,
                                              orgId:
                                                selector.login_employee_details
                                                  .orgId,
                                              type: "TEAM",
                                              moduleType: "home",
                                            }
                                          );
                                        }}
                                        style={{
                                          transform: [
                                            { translateX: translation },
                                          ],
                                        }}
                                      />
                                    </View>
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
                                          branchName={getBranchName(
                                            item.branchId
                                          )}
                                          color={"#C62159"}
                                          navigation={navigation}
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
                                                <View style={[styles.view8]}>
                                                  <View
                                                    style={{
                                                      width:
                                                        Dimensions.get("screen")
                                                          .width - 40,
                                                    }}
                                                  >
                                                    <View style={styles.view9}>
                                                      <View
                                                        style={styles.view10}
                                                      >
                                                        <Text
                                                          onPress={() => {
                                                            navigation.navigate(
                                                              AppNavigator
                                                                .HomeStackIdentifiers
                                                                .location,
                                                              {
                                                                empId:
                                                                  innerItem1.empId,
                                                                orgId:
                                                                  innerItem1.orgId,
                                                              }
                                                            );
                                                          }}
                                                          style={{
                                                            fontSize: 10,
                                                            fontWeight: "500",
                                                          }}
                                                        >
                                                          {innerItem1.empName}
                                                          {/* {innerItem1?.childCount >
                                                      1
                                                        ? "  |"
                                                        : ""} */}
                                                        </Text>
                                                      </View>
                                                      <View
                                                        style={{
                                                          flexDirection: "row",
                                                        }}
                                                      >
                                                        {innerItem1?.childCount >
                                                          1 && (
                                                          <Animated.View
                                                            style={{
                                                              transform: [
                                                                {
                                                                  translateX:
                                                                    translation,
                                                                },
                                                              ],
                                                            }}
                                                          >
                                                            <View
                                                              style={{
                                                                backgroundColor:
                                                                  "lightgrey",
                                                                flexDirection:
                                                                  "row",
                                                                paddingHorizontal: 7,
                                                                borderRadius: 10,
                                                                alignItems:
                                                                  "center",
                                                                justifyContent:
                                                                  "space-between",
                                                                marginBottom: 5,
                                                                alignSelf:
                                                                  "flex-start",
                                                                marginLeft: 7,
                                                              }}
                                                            >
                                                              <MaterialIcons
                                                                name="person"
                                                                size={15}
                                                                color={
                                                                  Colors.BLACK
                                                                }
                                                              />
                                                              <Text>
                                                                {
                                                                  innerItem1?.childCount
                                                                }
                                                              </Text>
                                                            </View>
                                                          </Animated.View>
                                                        )}
                                                        <SourceModelView
                                                          onClick={() => {
                                                            navigation.navigate(
                                                              AppNavigator
                                                                .EventDashboardStackIdentifiers
                                                                .sourceModel,
                                                              {
                                                                empId:
                                                                  innerItem1.empId,
                                                                headerTitle:
                                                                  innerItem1.empName,
                                                                type: "TEAM",
                                                                moduleType:
                                                                  "home",
                                                              }
                                                            );
                                                          }}
                                                          style={{
                                                            transform: [
                                                              {
                                                                translateX:
                                                                  translation,
                                                              },
                                                            ],
                                                          }}
                                                        />
                                                      </View>
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
                                                        navigation={navigation}
                                                        branchName={getBranchName(
                                                          innerItem1.branchId
                                                        )}
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
                                                      (
                                                        innerItem2,
                                                        innerIndex2
                                                      ) => {
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
                                                                overflow:
                                                                  "hidden",
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
                                                              <View
                                                                style={{
                                                                  flexDirection:
                                                                    "row",
                                                                }}
                                                              >
                                                                <Text
                                                                  onPress={() => {
                                                                    navigation.navigate(
                                                                      AppNavigator
                                                                        .HomeStackIdentifiers
                                                                        .location,
                                                                      {
                                                                        empId:
                                                                          innerItem2.empId,
                                                                        orgId:
                                                                          innerItem2.orgId,
                                                                      }
                                                                    );
                                                                  }}
                                                                  style={{
                                                                    fontSize: 10,
                                                                    fontWeight:
                                                                      "500",
                                                                  }}
                                                                >
                                                                  {
                                                                    innerItem2.empName
                                                                  }
                                                                  {/* {innerItem2?.childCount >
                                                              1
                                                                ? "  |"
                                                                : ""} */}
                                                                </Text>
                                                              </View>
                                                              <View
                                                                style={{
                                                                  flexDirection:
                                                                    "row",
                                                                }}
                                                              >
                                                                {innerItem2?.childCount >
                                                                  1 && (
                                                                  <Animated.View
                                                                    style={{
                                                                      transform:
                                                                        [
                                                                          {
                                                                            translateX:
                                                                              translation,
                                                                          },
                                                                        ],
                                                                    }}
                                                                  >
                                                                    <View
                                                                      style={{
                                                                        backgroundColor:
                                                                          "lightgrey",
                                                                        flexDirection:
                                                                          "row",
                                                                        paddingHorizontal: 7,
                                                                        borderRadius: 10,
                                                                        alignItems:
                                                                          "center",
                                                                        justifyContent:
                                                                          "space-between",
                                                                        marginBottom: 5,
                                                                        alignSelf:
                                                                          "flex-start",
                                                                        marginLeft: 7,
                                                                      }}
                                                                    >
                                                                      <MaterialIcons
                                                                        name="person"
                                                                        size={
                                                                          15
                                                                        }
                                                                        color={
                                                                          Colors.BLACK
                                                                        }
                                                                      />
                                                                      <Text>
                                                                        {
                                                                          innerItem2?.childCount
                                                                        }
                                                                      </Text>
                                                                    </View>
                                                                  </Animated.View>
                                                                )}
                                                                <SourceModelView
                                                                  onClick={() => {
                                                                    navigation.navigate(
                                                                      AppNavigator
                                                                        .EventDashboardStackIdentifiers
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
                                                                  style={{
                                                                    transform: [
                                                                      {
                                                                        translateX:
                                                                          translation,
                                                                      },
                                                                    ],
                                                                  }}
                                                                />
                                                              </View>
                                                            </View>
                                                            <View
                                                              style={{
                                                                flexDirection:
                                                                  "row",
                                                              }}
                                                            >
                                                              <RenderLevel1NameView
                                                                level={2}
                                                                item={
                                                                  innerItem2
                                                                }
                                                                color={
                                                                  "#2C97DE"
                                                                }
                                                                navigation={
                                                                  navigation
                                                                }
                                                                branchName={getBranchName(
                                                                  innerItem2.branchId
                                                                )}
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
                                                                        style={
                                                                          styles.view11
                                                                        }
                                                                      >
                                                                        <View
                                                                          style={{
                                                                            flexDirection:
                                                                              "row",
                                                                          }}
                                                                        >
                                                                          <Text
                                                                            onPress={() => {
                                                                              navigation.navigate(
                                                                                AppNavigator
                                                                                  .HomeStackIdentifiers
                                                                                  .location,
                                                                                {
                                                                                  empId:
                                                                                    innerItem3.empId,
                                                                                  orgId:
                                                                                    innerItem3.orgId,
                                                                                }
                                                                              );
                                                                            }}
                                                                            style={{
                                                                              fontSize: 10,
                                                                              fontWeight:
                                                                                "500",
                                                                            }}
                                                                          >
                                                                            {
                                                                              innerItem3.empName
                                                                            }
                                                                            {/* {innerItem3?.childCount >
                                                                        1
                                                                          ? "  |"
                                                                          : ""} */}
                                                                          </Text>
                                                                        </View>
                                                                        <View
                                                                          style={{
                                                                            flexDirection:
                                                                              "row",
                                                                          }}
                                                                        >
                                                                          {innerItem3?.childCount >
                                                                            1 && (
                                                                            <Animated.View
                                                                              style={{
                                                                                transform:
                                                                                  [
                                                                                    {
                                                                                      translateX:
                                                                                        translation,
                                                                                    },
                                                                                  ],
                                                                              }}
                                                                            >
                                                                              <View
                                                                                style={{
                                                                                  backgroundColor:
                                                                                    "lightgrey",
                                                                                  flexDirection:
                                                                                    "row",
                                                                                  paddingHorizontal: 7,
                                                                                  borderRadius: 10,
                                                                                  alignItems:
                                                                                    "center",
                                                                                  justifyContent:
                                                                                    "space-between",
                                                                                  marginBottom: 5,
                                                                                  alignSelf:
                                                                                    "flex-start",
                                                                                  marginLeft: 7,
                                                                                }}
                                                                              >
                                                                                <MaterialIcons
                                                                                  name="person"
                                                                                  size={
                                                                                    15
                                                                                  }
                                                                                  color={
                                                                                    Colors.BLACK
                                                                                  }
                                                                                />
                                                                                <Text>
                                                                                  {
                                                                                    innerItem3?.childCount
                                                                                  }
                                                                                </Text>
                                                                              </View>
                                                                            </Animated.View>
                                                                          )}
                                                                          <SourceModelView
                                                                            onClick={() => {
                                                                              navigation.navigate(
                                                                                AppNavigator
                                                                                  .EventDashboardStackIdentifiers
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
                                                                            style={{
                                                                              transform:
                                                                                [
                                                                                  {
                                                                                    translateX:
                                                                                      translation,
                                                                                  },
                                                                                ],
                                                                            }}
                                                                          />
                                                                        </View>
                                                                      </View>
                                                                      <View
                                                                        style={{
                                                                          flexDirection:
                                                                            "row",
                                                                        }}
                                                                      >
                                                                        <RenderLevel1NameView
                                                                          level={
                                                                            3
                                                                          }
                                                                          item={
                                                                            innerItem3
                                                                          }
                                                                          color={
                                                                            "#EC3466"
                                                                          }
                                                                          navigation={
                                                                            navigation
                                                                          }
                                                                          branchName={getBranchName(
                                                                            innerItem3.branchId
                                                                          )}
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
                                                                                  style={
                                                                                    styles.view11
                                                                                  }
                                                                                >
                                                                                  <Text
                                                                                    onPress={() => {
                                                                                      navigation.navigate(
                                                                                        AppNavigator
                                                                                          .HomeStackIdentifiers
                                                                                          .location,
                                                                                        {
                                                                                          empId:
                                                                                            innerItem4.empId,
                                                                                          orgId:
                                                                                            innerItem4.orgId,
                                                                                        }
                                                                                      );
                                                                                    }}
                                                                                    style={{
                                                                                      fontSize: 10,
                                                                                      fontWeight:
                                                                                        "500",
                                                                                    }}
                                                                                  >
                                                                                    {
                                                                                      innerItem4.empName
                                                                                    }
                                                                                  </Text>
                                                                                </View>
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
                                                                                    navigation={
                                                                                      navigation
                                                                                    }
                                                                                    branchName={getBranchName(
                                                                                      innerItem4.branchId
                                                                                    )}
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
                                                                                            style={
                                                                                              styles.view11
                                                                                            }
                                                                                          >
                                                                                            <Text
                                                                                              onPress={() => {
                                                                                                navigation.navigate(
                                                                                                  AppNavigator
                                                                                                    .HomeStackIdentifiers
                                                                                                    .location,
                                                                                                  {
                                                                                                    empId:
                                                                                                      innerItem5.empId,
                                                                                                    orgId:
                                                                                                      innerItem5.orgId,
                                                                                                  }
                                                                                                );
                                                                                              }}
                                                                                              style={{
                                                                                                fontSize: 10,
                                                                                                fontWeight:
                                                                                                  "500",
                                                                                              }}
                                                                                            >
                                                                                              {
                                                                                                innerItem5.empName
                                                                                              }
                                                                                            </Text>
                                                                                          </View>
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
                                                                                              navigation={
                                                                                                navigation
                                                                                              }
                                                                                              branchName={getBranchName(
                                                                                                innerItem5.branchId
                                                                                              )}
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
                                                                                                      style={
                                                                                                        styles.view11
                                                                                                      }
                                                                                                    >
                                                                                                      <Text
                                                                                                        onPress={() => {
                                                                                                          navigation.navigate(
                                                                                                            AppNavigator
                                                                                                              .HomeStackIdentifiers
                                                                                                              .location,
                                                                                                            {
                                                                                                              empId:
                                                                                                                innerItem6.empId,
                                                                                                              orgId:
                                                                                                                innerItem6.orgId,
                                                                                                            }
                                                                                                          );
                                                                                                        }}
                                                                                                        style={{
                                                                                                          fontSize: 10,
                                                                                                          fontWeight:
                                                                                                            "500",
                                                                                                        }}
                                                                                                      >
                                                                                                        {
                                                                                                          innerItem6.empName
                                                                                                        }
                                                                                                      </Text>
                                                                                                    </View>
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
                                                                                                        navigation={
                                                                                                          navigation
                                                                                                        }
                                                                                                        branchName={getBranchName(
                                                                                                          innerItem6.branchId
                                                                                                        )}
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
                    </View>
                    {/* Grand Total Section */}
                    {selector.totalParameters.length > 0 && (
                      <View
                        style={{
                          width: Dimensions.get("screen").width - 35,
                          position: "relative",
                          bottom: 0,
                        }}
                      >
                        <SourceModelView
                          style={{
                            transform: [{ translateX: translation }],
                            alignSelf: "flex-end",
                          }}
                          onClick={async () => {
                            let employeeData = await AsyncStore.getData(
                              AsyncStore.Keys.LOGIN_EMPLOYEE
                            );
                            if (employeeData) {
                              const jsonObj = JSON.parse(employeeData);
                              navigation.navigate(
                                AppNavigator.EventDashboardStackIdentifiers
                                  .sourceModel,
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

                        <View style={styles.view12}>
                          <View
                            style={{
                              width: 105,
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
                            <View style={{ alignSelf: "center" }}>
                              <View
                                style={{
                                  paddingRight: 2,
                                  height: 20,
                                  justifyContent: "center",
                                }}
                              >
                                <Text style={styles.txt7}>ACH</Text>
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
                              <RenderGrandTotal
                                totalParams={getFormattedIndividualData(
                                  leadSource
                                )}
                                displayType={togglePercentage}
                                params={toggleParamsMetaData}
                                hideTgt={true}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    )}
                  </ScrollView>
                )}
              </View>
            </View>
          ) : (
            // IF Self or insights
            <View style={{ flex: 1 }}>
              <EventInsights />
            </View>
          )
        ) : (
          <LoaderComponent visible={false} onRequestClose={() => {}} />
        )}
      </>
    </React.Fragment>
  );
};

export default EventDashBoardTargetScreen;

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
          Events
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
