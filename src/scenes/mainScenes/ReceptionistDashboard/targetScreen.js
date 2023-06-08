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
  getCRM_ReceptionistDashboradVol2,
  getEmployeesList,
  getNewTargetParametersAllData,
  getReceptionistData,
  getReceptionistDataForRecepDashboard,
  getReportingManagerList,
  getTotalOftheTeam,
  getTotalTargetParametersData,
  getUserWiseTargetParameters,
  updateEmployeeDataBasedOnDelegate,
  updatereceptionistDataObjectData,
} from "../../../redux/homeReducer";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AppNavigator } from "../../../navigations";
import { IconButton } from "react-native-paper";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AnimLoaderComp from "../../../components/AnimLoaderComp";
import _ from "lodash";

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

const data = [
  {
    id: 0,
    name: "Enquiry",
  },
  {
    id: 1,
    name: "Booking",
  },
  {
    id: 2,
    name: "Retail",
  },
  {
    id: 3,
    name: "Lost",
  },
];
const receptionistRole = ["Reception", "CRM"];
const ReceptionistDashBoardTargetScreen = ({ route }) => {
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
  const isFocused = useIsFocused();
  const [branches, setBranches] = useState([]);
  const [togglePercentage, setTogglePercentage] = useState(0);
  const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
  const [toggleParamsMetaData, setToggleParamsMetaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const translation = useRef(new Animated.Value(0)).current;
  const [slideRight, setSlideRight] = useState();

  const [isViewCREExpanded, setIsViewCreExpanded] = useState(false);
  const [creIndex, setcreIndex] = useState(false);
  const [creFirstLevelSelfData, setCreFirstLevelSelfData] = useState([]);
  const [creFirstLevelData, setCreFirstLevelData] = useState([]);
  const [creSecondLevelData, setCreSecondLevelData] = useState([]);
  const [storeCREFirstLevelLocal, setStoreCREFirstLevelLocal] = useState([]);

  const [secondLevelCRMdata, setSecondLevelCRMdata] = useState([]);
  const [thirdLevelCRMdata, setThirdLevelCRMdata] = useState([]);
  const [storeSelectedRecData, setStoreSelectedRecData] = useState([]);
  const [storeFirstLevelSelectedRecData, setStoreFirstLevelSelectedRecData] =
    useState([]);
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const [isShowSalesConsultant, setisShowSalesConsultant] = useState(false);
  const [indexLocal, setIndexLocal] = useState(-1);
  const [storeSecondLevelLocal, setstoreSecondLevelLocal] = useState([]);
  const [storeFirstLevelLocal, setStoreFirstLevelLocal] = useState([]);

  const [CRM_filterParameters, setCRM_filterParameters] = useState([]);
  const [crmFirstLevelData, setCrmFirstLevelData] = useState([]);
  const [crmFirstLevelDataOwn, setCrmFirstLevelDataOwn] = useState([]);
  const [crmFirstLevelTotalData, setCrmFirstLevelTotalData] = useState([]);
  const [crmSecondLevelData, setcrmSecondLevelData] = useState([]);
  const [crmThirdLevelData, setCrmThirdLevelData] = useState([]);
  const [filterExapand, setfilterExapand] = useState(false);
  const [crm_recep_firstLevelExpand, setCrm_recep_firstLevelExpand] =
    useState(false);
  const [crm_recep_firstLevelIndex, setCrm_recep_firstLevelIndex] =
    useState(false);
  const [crm_recep_FirstLevelOwndata, setcrm_recep_FirstLevelOwndata] =
    useState([]);
  const [crm_recep_secondLevel, setcrm_recep_secondLevel] = useState([]);

  const [indexLocalFirstLevel, setIndexLocalFirstLevel] = useState(-1);

  const [crmVol2Level0, setCrmVol2Level0] = useState([])
  const [crmVol2Level1, setCrmVol2Level1] = useState([])
  const [crmVol2AlluserData, setCrmVol2AlluserData] = useState([])
  // const [crmVol2ReportingData, setCrmVol2ReportingData] =useState(datav2.reportingUser)
  const [crmVol2ReportingData, setCrmVol2ReportingData] = useState([])
  const [crmVol2ReportingAllTree, setCrmVol2ReportingAllTree] = useState([])
  const [crmVol2ReportingLevel1, setCrmVol2ReportingLevel1] = useState([])
  const [isViewExpandedCRMReporting, setIsViewExpandedCRMReporting] = useState(false);
  const [crmVol2NonReportingData, setCrmVol2NonReportingData] = useState([])
  const [isCRM_Non_reportingVol2Level0Expanded, seIsCRM_Non_reportingVol2Level0Expanded] = useState(false);
  const [isRecepVol2Level0Expanded, setIsRecepVol2Level0Expanded] = useState(false);

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
    if (
      !_.isEmpty(selector.receptionistDataV2?.fullResponse) &&
      _.isEmpty(selector.saveReceptionistfilterObj.selectedempId) &&
      selector.receptionistDataV2?.fullResponse !== undefined
    ) {
      let tempArrCRMFIRst = [];
      let tempArrCRMFirsttotal = [];
      let tempArrCRMSecond = [];
      let tempArrCRMFirstOwn = [];

      let firstLevelData = selector.receptionistDataV2?.fullResponse?.CRM?.map(
        (item) => {
          Array.prototype.push.apply(tempArrCRMFirsttotal, [item.data]);

          // setCrmFirstLevelTotalData(item.data)

          let firstLevel = item.data.manager.filter(
            (item2) => item2.emp_id === item.emp_id
          );
          if (firstLevel.length > 0) {
            Array.prototype.push.apply(tempArrCRMFIRst, firstLevel);
          }

          let firstLevelOwn = item.data.manager.filter((item2) => {
            if (item2.emp_id === item.emp_id) {
              let tempOwn = item2.salesconsultant.filter(
                (item3) => item3.emp_id === item.emp_id
              );
              if (tempOwn.length > 0) {
                Array.prototype.push.apply(tempArrCRMFirstOwn, tempOwn);
              }
            }
          });
        }
      );

      setCrmFirstLevelDataOwn(tempArrCRMFirstOwn);
      setCrmFirstLevelTotalData(tempArrCRMFirsttotal);

      setCrmFirstLevelData(tempArrCRMFIRst);

      let tempArr = [];
      let tempArrSelf = selector.receptionistDataV2.fullResponse.CRE?.map(
        (item) => item
      );

      let firstLevelDataLevel2 =
        selector.receptionistDataV2.fullResponse.CRE?.map((item, index) => {
          let firstLevel = item.data.consultantList?.filter(
            (item2) => item2.emp_id === item.emp_id
          );

          if (firstLevel.length > 0) {
            // tempArr.push(firstLevel);
            Array.prototype.push.apply(tempArr, firstLevel);
          }
        });

      setCreFirstLevelData(tempArr);
      setCreFirstLevelSelfData(tempArrSelf);

      // let firstLevelDataLevel2 = selector.receptionistDataV2.fullResponse.CRE.map(item => {

      //   setCreFirstLevelSelfData(item);
      //   let firstLevel = item.salesconsultant.filter(item2 => item2.emp_id === item.emp_id)
      //   let salesPeopleUnderCre = item.salesconsultant.filter(item2 => item2.emp_id !== item.emp_id)

      //   // let consultantForCRM = item.data.filter(item2 => item2.emp_id !== userData.empId)
      //   if (salesPeopleUnderCre.length > 0) {
      //     setCreSecondLevelData(salesPeopleUnderCre)
      //   }
      //   if (firstLevel.length > 0) {
      //     setCreFirstLevelData(firstLevel)
      //   }

      // })
    }

    if (selector.receptionistDataV2) {
      let totalKey1 = selector?.receptionistDataV2?.enquirysCount;
      let totalKey2 = selector?.receptionistDataV2?.bookingsCount;
      let totalKey3 = selector?.receptionistDataV2?.RetailCount;
      let totalKey4 = selector?.receptionistDataV2?.totalLostCount;

      let total = [totalKey1, totalKey2, totalKey3, totalKey4];
      setTotalofTeam(total);
    }
  }, [selector.receptionistDataV2]);
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
      setCrmVol2AlluserData([])
      setCrmVol2Level0([])
      setCrmVol2Level1([])
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
      setisShowSalesConsultant(false);
      setIsViewExpanded(false);
      setIsViewCreExpanded(false);
      dispatch(updatereceptionistDataObjectData({}));
      setfilterExapand(false);
      setCrm_recep_firstLevelExpand(false);
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

  useEffect(() => {
    if (selector.receptionistData_ReceptionistDashboard_xrole) {
      let totalKey1 =
        selector?.receptionistData_ReceptionistDashboard_xrole?.enquirysCount;
      let totalKey2 =
        selector?.receptionistData_ReceptionistDashboard_xrole?.bookingsCount;
      let totalKey3 =
        selector?.receptionistData_ReceptionistDashboard_xrole?.RetailCount;
      let totalKey4 =
        selector?.receptionistData_ReceptionistDashboard_xrole?.totalLostCount;

      let total = [totalKey1, totalKey2, totalKey3, totalKey4];
      setTotalofTeam(total);
    }
  }, [selector.receptionistData_ReceptionistDashboard_xrole]);

  useEffect(() => {
    if (selector.receptionistData_CRM) {
      let totalKey1 = selector?.receptionistData_CRM?.enquirysCount;
      let totalKey2 = selector?.receptionistData_CRM?.bookingsCount;
      let totalKey3 = selector?.receptionistData_CRM?.RetailCount;
      let totalKey4 = selector?.receptionistData_CRM?.totalLostCount;

      let total = [totalKey1, totalKey2, totalKey3, totalKey4];
      setTotalofTeam(total);
    }
  }, [selector.receptionistData_CRM]);

  useEffect(() => {
    getDataBasedOnfilter();
  }, [selector.saveReceptionistfilterObj, isFocused]);

  useEffect(() => {

    // findDataFromObject(selector.receptionistDataV3.fullResponse);
    if (!_.isEmpty(selector.receptionistData_CRM_vol2?.fullResponse)) {

      let modified = selector.receptionistData_CRM_vol2?.fullResponse?.self?.allTreeData?.map(v => ({ ...v, isOpenInner: false, innerData: [] }))

      setCrmVol2AlluserData(modified);
      let tempFilterIds = selector.receptionistData_CRM_vol2?.fullResponse?.self?.level1?.map((item) => item.empId)

      let tempArr = modified?.filter((item) => tempFilterIds.includes(item.empId))


      setCrmVol2Level1(tempArr);
      if (selector.receptionistData_CRM_vol2.fullResponse?.self != null || selector.receptionistData_CRM_vol2.fullResponse?.self != undefined) {
        setCrmVol2Level0([selector.receptionistData_CRM_vol2?.fullResponse?.self?.selfUser]);
      }
      setCrmVol2ReportingData(selector.receptionistData_CRM_vol2?.fullResponse?.reportingUser)

      setCrmVol2NonReportingData(selector.receptionistData_CRM_vol2?.fullResponse?.nonReportingUser)


      if (selector.receptionistData_CRM_vol2) {
        let totalKey1 = selector?.receptionistData_CRM_vol2?.enquirysCount;
        let totalKey2 = selector?.receptionistData_CRM_vol2?.bookingsCount;
        let totalKey3 = selector?.receptionistData_CRM_vol2?.RetailCount;
        let totalKey4 = selector?.receptionistData_CRM_vol2?.totalLostCount;

        let total = [totalKey1, totalKey2, totalKey3, totalKey4];
        setTotalofTeam(total);
        // setSelfInsightsData()
      }
    }


  }, [selector.receptionistData_CRM_vol2])

  const getDataBasedOnfilter = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (selector.saveReceptionistfilterObj?.selectedempId) {
        if (
          !_.isEmpty(selector.saveReceptionistfilterObj?.selectedDesignation)
        ) {
          if (
            selector.saveReceptionistfilterObj?.selectedDesignation[0] ===
            "Reception"
          ) {
            // let payload = {
            //   orgId: jsonObj.orgId,
            //   loggedInEmpId:
            //     selector.saveReceptionistfilterObj.selectedempId[0],
            //   startDate: selector.saveReceptionistfilterObj.startDate,
            //   endDate: selector.saveReceptionistfilterObj.endDate,
            //   dealerCodes: selector.saveReceptionistfilterObj.dealerCodes,
            // };
            // dispatch(getReceptionistDataForRecepDashboard(payload));

            let payloadXrole = {
              orgId: jsonObj.orgId,
              loggedInEmpId: selector.saveReceptionistfilterObj.selectedempId[0],
              dashboardType: "reception",
            };
            dispatch(getCRM_ReceptionistDashboradVol2(payloadXrole))
          }
        } else {
        }
      }
    }
  };

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

  function navigateToEMS(
    params = "",
    screenName = "",
    selectedEmpId = [],
    isIgnore = false,
    parentId = "",
    istotalClick = false,
    isSelf
  ) {
    navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
    setTimeout(() => {
      if (selector.saveReceptionistfilterObj?.selectedempId) {
        // setTimeout(() => {
        //   navigation.navigate("LEADS", {
        //     screenName: "Home",
        //     params: params,
        //     moduleType: "",
        //     employeeDetail: "",
        //     selectedEmpId: selector.saveReceptionistfilterObj?.selectedempId,
        //     startDate: selector.saveReceptionistfilterObj.startDate,
        //     endDate: selector.saveReceptionistfilterObj.endDate,
        //     dealerCodes: selector.saveReceptionistfilterObj.dealerCodes,
        //     ignoreSelectedId: isIgnore
        //   });
        // }, 1000);
        if (parentId) {
          setTimeout(() => {
            navigation.navigate("LEADS", {
              screenName: "TargetScreenCRM",
              params: params,
              moduleType: "",
              employeeDetail: "",
              selectedEmpId: selectedEmpId,
              startDate: "",
              endDate: "",
              dealerCodes: [],
              ignoreSelectedId: isIgnore,
              parentId: parentId,
              istotalClick: istotalClick,
              self: isSelf,
            });
          }, 1000);
        } else {
          setTimeout(() => {
            navigation.navigate("LEADS", {
              screenName: "Home",
              params: params,
              moduleType: "",
              employeeDetail: "",
              selectedEmpId: selector.saveReceptionistfilterObj?.selectedempId,
              startDate: selector.saveReceptionistfilterObj.startDate,
              endDate: selector.saveReceptionistfilterObj.endDate,
              dealerCodes: selector.saveReceptionistfilterObj.dealerCodes,
              ignoreSelectedId: isIgnore,
            });
          }, 1000);
        }
      } else if (isIgnore) {
        if (parentId) {
          if (istotalClick) {
            setTimeout(() => {
              navigation.navigate("LEADS", {
                screenName: "TargetScreenCRM",
                params: params,
                moduleType: "",
                employeeDetail: "",
                selectedEmpId: selectedEmpId,
                startDate: "",
                endDate: "",
                dealerCodes: [],
                ignoreSelectedId: isIgnore,
                parentId: parentId,
                istotalClick: true,
                self: isSelf,
                dashboardType: "reception",
              });
            }, 1000);
          } else {
            setTimeout(() => {
              navigation.navigate("LEADS", {
                screenName: "TargetScreenCRM",
                params: params,
                moduleType: "",
                employeeDetail: "",
                selectedEmpId: selectedEmpId,
                startDate: "",
                endDate: "",
                dealerCodes: [],
                ignoreSelectedId: isIgnore,
                parentId: parentId,
                istotalClick: false,
              });
            }, 1000);
          }
        } else {
          setTimeout(() => {
            navigation.navigate("LEADS", {
              screenName: "Home",
              params: params,
              moduleType: "",
              employeeDetail: "",
              selectedEmpId: selectedEmpId,
              startDate: "",
              endDate: "",
              dealerCodes: [],
              ignoreSelectedId: isIgnore,
            });
          }, 1000);
        }
      } else {
        navigation.navigate("LEADS", {
          screenName: "ReceptionistHome",
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
        });
      }
    }, 1000);
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
    if (selector.saveReceptionistfilterObj.selectedempId) {
      navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
        screen: "DROP_ANALYSIS",
        params: {
          emp_id: params,
          fromScreen: "targetScreenReceptionist",
          dealercodes: selector.saveReceptionistfilterObj.dealerCodes,
          isFilterApplied: true,
          isSelf: isSelf,
          xrole: xrole,
          isForDropped: false,
          parentId: parentId,
        },
      });
      // navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
      //   screen: "DROP_ANALYSIS",
      //   params: { emp_id: params, fromScreen: "targetScreenReceptionist", dealercodes: selector.saveReceptionistfilterObj.dealerCodes, isFilterApplied: true, isSelf: isSelf, xrole: xrole, isForDropped: false },
      // });
    } else {
      if (isfromTree) {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: {
            emp_id: params,
            fromScreen: "targetScreenReceptionist",
            dealercodes: [],
            isFilterApplied: true,
            parentId: parentId,
            isSelf: isSelf,
            xrole: xrole,
            isForDropped: false,
            dashboardType: "reception",
          },
        });
      } else {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: {
            emp_id: params,
            fromScreen: "targetScreenReceptionist",
            dealercodes: [],
            isFilterApplied: false,
            isSelf: isSelf,
            xrole: xrole,
            isForDropped: false,
            dashboardType: "reception",
          },
        });
      }
    }
  }

  function navigateToDropAnalysisVol2(leadIdList) {
    navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
      screen: "DROP_ANALYSIS",
      params: {
        emp_id: "",
        fromScreen: "targetScreen1CRMVol2",
        dealercodes: leadIdList,
        isFilterApplied: false,
        parentId: "",
        isSelf: false,
      },
    });
  }



  function navigateToEmsVol2(leadidList) {
    navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
      screen: "EMS",
      params: {
        screen: "LEADS",
        params: {
          screenName: "TargetScreenCRMVol2",
          params: "",
          moduleType: "",
          employeeDetail: "",
          selectedEmpId: "",
          startDate: "",
          endDate: "",
          dealerCodes: leadidList, // sending lead ids in this 
          ignoreSelectedId: false,
          parentId: "",
          istotalClick: false,
        },
      },
    });
  }
  

  // vol 2 code for insight
  const renderItem = (item, index) => {
    return (
      <View
        style={{
          // width: 300,
          padding: 10,
          borderColor:
            index === 0
              ? Colors.PURPLE
              : index === 2
                ? Colors.RED
                : index === 3
                  ? Colors.YELLOW
                  : Colors.BLUE_V2,
          borderWidth: 1,
          borderRadius: 10,
          justifyContent: "center",
          marginVertical: 10,
          // marginStart:'8%'
        }}
      >
        <View style={styles.scondView}>
          <Text
            style={{
              fontSize: 16,
              // color: index === 0 ? Colors.CORAL : Colors.GREEN_V2,
              color: Colors.BLACK,
              fontWeight: "700",
              paddingVertical: 10,
            }}
          >
            {item.name}
          </Text>

          <TouchableOpacity
            onPress={() => {
              {
                // todo add logic for redirections filer applied
                if (selector.saveReceptionistfilterObj.selectedempId) {
                  if (
                    selector.saveReceptionistfilterObj?.selectedDesignation &&
                    selector.saveReceptionistfilterObj
                      ?.selectedDesignation[0] === "Reception"
                  ) {
                    item.id === 0
                      ? selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryCount
                         > 0 &&
                      navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryLeads)
                      : item.id === 1
                        ? selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingCount > 0 &&
                        navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingLeads)
                        : item.id === 2
                          ? selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailCount > 0 &&
                          navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailLeads)
                          : item.id === 3
                            ? selector.receptionistData_CRM_vol2?.fullResponse?.totalLostCount > 0 &&
                            navigateToDropAnalysisVol2(
                              selector.receptionistData_CRM_vol2?.fullResponse?.totalLostLeads
                            )
                            : null;
                  } else {
                    item.id === 0
                      ? selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryCount
                      > 0 &&
                      navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryLeads)
                      : item.id === 1
                        ? selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingCount > 0 &&
                        navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingLeads)
                        : item.id === 2
                          ? selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailCount > 0 &&
                          navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailLeads)
                          : item.id === 3
                            ? selector.receptionistData_CRM_vol2?.fullResponse?.totalLostCount > 0 &&
                            navigateToDropAnalysisVol2(
                              selector.receptionistData_CRM_vol2?.fullResponse?.totalLostLeads
                            )
                            : null;
                  }
                } else {
                  if (userData.hrmsRole === "CRM") {
                    item.id === 0
                      ? selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryCount
                      > 0 &&
                      navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryLeads)
                      : item.id === 1
                        ? selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingCount > 0 &&
                        navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingLeads)
                        : item.id === 2
                          ? selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailCount > 0 &&
                          navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailLeads)
                          : item.id === 3
                            ? selector.receptionistData_CRM_vol2?.fullResponse?.totalLostCount > 0 &&
                            navigateToDropAnalysisVol2(
                              selector.receptionistData_CRM_vol2?.fullResponse?.totalLostLeads
                            )
                            : null;
                  } else {
                    item.id === 0
                      ? selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryCount
                      > 0 &&
                      navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryLeads)
                      : item.id === 1
                        ? selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingCount > 0 &&
                        navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingLeads)
                        : item.id === 2
                          ? selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailCount > 0 &&
                          navigateToEmsVol2(selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailLeads)
                          : item.id === 3
                            ? selector.receptionistData_CRM_vol2?.fullResponse?.totalLostCount > 0 &&
                            navigateToDropAnalysisVol2(
                              selector.receptionistData_CRM_vol2?.fullResponse?.totalLostLeads
                            )
                            : null;
                  }
                }
              }
            }}
          >
            {selector.saveReceptionistfilterObj?.selectedDesignation &&
              selector.saveReceptionistfilterObj?.selectedDesignation[0] ===
              "Reception" ? (
              item.id === 0 ? (
                <Text style={styles.txt10}>
                  {" "}
                  {
                      selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryCount
                  }{" "}
                </Text>
              ) : item.id === 1 ? (
                <Text style={styles.txt10}>
                  {" "}
                  {
                        selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingCount 
                  }{" "}
                </Text>
              ) : item.id === 2 ? (
                <Text style={styles.txt10}>
                  {" "}
                  {
                          selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailCount
                  }{" "}
                </Text>
              ) : item.id === 3 ? (
                <Text style={styles.txt10}>
                  {" "}
                  {
                            selector.receptionistData_CRM_vol2?.fullResponse?.totalLostCount
                  }{" "}
                </Text>
              ) : (
                <Text style={styles.txt10}>0</Text>
              )
            ) : userData.hrmsRole === "CRM" ? (
              item.id === 0 ? (
                <Text style={styles.txt10}>
                  {" "}
                    {selector.receptionistData_CRM_vol2.enquirysCount}{" "}
                </Text>
              ) : item.id === 1 ? (
                <Text style={styles.txt10}>
                  {" "}
                      {selector.receptionistData_CRM_vol2.bookingsCount}{" "}
                </Text>
              ) : item.id === 2 ? (
                <Text style={styles.txt10}>
                  {" "}
                        {selector.receptionistData_CRM_vol2.RetailCount}{" "}
                </Text>
              ) : item.id === 3 ? (
                <Text style={styles.txt10}>
                  {" "}
                          {selector.receptionistData_CRM_vol2.totalLostCount}{" "}
                </Text>
              ) : (
                <Text style={styles.txt10}>0</Text>
              )
            ) : item.id === 0 ? (
              <Text style={styles.txt10}>
                {" "}
                    {selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryCount}{" "}
              </Text>
            ) : item.id === 1 ? (
              <Text style={styles.txt10}>
                {" "}
                      {selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingCount}{" "}
              </Text>
            ) : item.id === 2 ? (
              <Text style={styles.txt10}>
                {" "}
                        {selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailCount}{" "}
              </Text>
            ) : item.id === 3 ? (
              <Text style={styles.txt10}>
                {" "}
                          {selector.receptionistData_CRM_vol2?.fullResponse?.totalLostCount}{" "}
              </Text>
            ) : (
              <Text style={styles.txt10}>0</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // vol 1 code for insight
  // const renderItem = (item, index) => {
  //   return (
  //     <View
  //       style={{
  //         // width: 300,
  //         padding: 10,
  //         borderColor:
  //           index === 0
  //             ? Colors.PURPLE
  //             : index === 2
  //             ? Colors.RED
  //             : index === 3
  //             ? Colors.YELLOW
  //             : Colors.BLUE_V2,
  //         borderWidth: 1,
  //         borderRadius: 10,
  //         justifyContent: "center",
  //         marginVertical: 10,
  //         // marginStart:'8%'
  //       }}
  //     >
  //       <View style={styles.scondView}>
  //         <Text
  //           style={{
  //             fontSize: 16,
  //             // color: index === 0 ? Colors.CORAL : Colors.GREEN_V2,
  //             color: Colors.BLACK,
  //             fontWeight: "700",
  //             paddingVertical: 10,
  //           }}
  //         >
  //           {item.name}
  //         </Text>

  //         <TouchableOpacity
  //           onPress={() => {
  //             {
  //               // todo add logic for redirections filer applied
  //               if (selector.saveReceptionistfilterObj.selectedempId) {
  //                 if (
  //                   selector.saveReceptionistfilterObj?.selectedDesignation &&
  //                   selector.saveReceptionistfilterObj
  //                     ?.selectedDesignation[0] === "Reception"
  //                 ) {
  //                   item.id === 0
  //                     ? selector.receptionistData_ReceptionistDashboard_xrole
  //                         .enquirysCount > 0 &&
  //                       navigateToEMS("ENQUIRY", "", [userData.empId], true)
  //                     : item.id === 1
  //                     ? selector.receptionistData_ReceptionistDashboard_xrole
  //                         .bookingsCount > 0 &&
  //                       navigateToEMS("BOOKING", "", [userData.empId], true)
  //                     : item.id === 2
  //                     ? selector.receptionistData_ReceptionistDashboard_xrole
  //                         .RetailCount > 0 &&
  //                       navigateToEMS(
  //                         "INVOICECOMPLETED",
  //                         "",
  //                         [userData.empId],
  //                         true
  //                       )
  //                     : item.id === 3
  //                     ? selector.receptionistData_ReceptionistDashboard_xrole
  //                         .totalLostCount > 0 &&
  //                       navigateToDropAnalysis(
  //                         selector.saveReceptionistfilterObj.selectedempId[0]
  //                       )
  //                     : null;
  //                 } else {
  //                   item.id === 0
  //                     ? selector.receptionistDataV2.enquirysCount > 0 &&
  //                       navigateToEMS("ENQUIRY", "", [userData.empId], true)
  //                     : item.id === 1
  //                     ? navigateToEMS("BOOKING", "", [userData.empId], true)
  //                     : item.id === 2
  //                     ? selector.receptionistDataV2.RetailCount > 0 &&
  //                       navigateToEMS(
  //                         "INVOICECOMPLETED",
  //                         "",
  //                         [userData.empId],
  //                         true
  //                       )
  //                     : item.id === 3
  //                     ? navigateToDropAnalysis(
  //                         selector.saveReceptionistfilterObj.selectedempId[0]
  //                       )
  //                     : null;
  //                 }
  //               } else {
  //                 if (userData.hrmsRole === "CRM") {
  //                   item.id === 0
  //                     ? selector.receptionistData_CRM.enquirysCount > 0 &&
  //                       navigateToEMS(
  //                         "ENQUIRY",
  //                         "",
  //                         [],
  //                         true,
  //                         userData.empId,
  //                         true,
  //                         false
  //                       )
  //                     : item.id === 1
  //                     ? selector.receptionistData_CRM.bookingsCount > 0 &&
  //                       navigateToEMS(
  //                         "BOOKING",
  //                         "",
  //                         [],
  //                         true,
  //                         userData.empId,
  //                         true,
  //                         false
  //                       )
  //                     : item.id === 2
  //                     ? selector.receptionistData_CRM.RetailCount > 0 &&
  //                       navigateToEMS(
  //                         "INVOICECOMPLETED",
  //                         "",
  //                         [],
  //                         true,
  //                         userData.empId,
  //                         true,
  //                         false
  //                       )
  //                     : item.id === 3
  //                     ? selector.receptionistData_CRM.totalLostCount > 0 &&
  //                       navigateToDropAnalysis(
  //                         userData.empId,
  //                         false,
  //                         "",
  //                         false,
  //                         false
  //                       )
  //                     : null;
  //                 } else {
  //                   item.id === 0
  //                     ? selector.receptionistDataV2.enquirysCount > 0 &&
  //                       navigateToEMS(
  //                         "ENQUIRY",
  //                         "",
  //                         [userData.empId],
  //                         false,
  //                         userData.empId,
  //                         true,
  //                         false
  //                       )
  //                     : item.id === 1
  //                     ? selector.receptionistDataV2.bookingsCount > 0 &&
  //                       navigateToEMS(
  //                         "BOOKING",
  //                         "",
  //                         [userData.empId],
  //                         false,
  //                         userData.empId,
  //                         true,
  //                         false
  //                       )
  //                     : item.id === 2
  //                     ? selector.receptionistDataV2.RetailCount > 0 &&
  //                       navigateToEMS(
  //                         "INVOICECOMPLETED",
  //                         "",
  //                         [userData.empId],
  //                         false,
  //                         userData.empId,
  //                         true,
  //                         false
  //                       )
  //                     : item.id === 3
  //                     ? selector.receptionistDataV2.totalLostCount > 0 &&
  //                       navigateToDropAnalysis(
  //                         userData.empId,
  //                         false,
  //                         "",
  //                         false,
  //                         true
  //                       )
  //                     : null;
  //                 }
  //               }
  //             }
  //           }}
  //         >
  //           {selector.saveReceptionistfilterObj?.selectedDesignation &&
  //           selector.saveReceptionistfilterObj?.selectedDesignation[0] ===
  //             "Reception" ? (
  //             item.id === 0 ? (
  //               <Text style={styles.txt10}>
  //                 {" "}
  //                 {
  //                   selector.receptionistData_ReceptionistDashboard_xrole
  //                     .enquirysCount
  //                 }{" "}
  //               </Text>
  //             ) : item.id === 1 ? (
  //               <Text style={styles.txt10}>
  //                 {" "}
  //                 {
  //                   selector.receptionistData_ReceptionistDashboard_xrole
  //                     .bookingsCount
  //                 }{" "}
  //               </Text>
  //             ) : item.id === 2 ? (
  //               <Text style={styles.txt10}>
  //                 {" "}
  //                 {
  //                   selector.receptionistData_ReceptionistDashboard_xrole
  //                     .RetailCount
  //                 }{" "}
  //               </Text>
  //             ) : item.id === 3 ? (
  //               <Text style={styles.txt10}>
  //                 {" "}
  //                 {
  //                   selector.receptionistData_ReceptionistDashboard_xrole
  //                     .totalLostCount
  //                 }{" "}
  //               </Text>
  //             ) : (
  //               <Text style={styles.txt10}>0</Text>
  //             )
  //           ) : userData.hrmsRole === "CRM" ? (
  //             item.id === 0 ? (
  //               <Text style={styles.txt10}>
  //                 {" "}
  //                 {selector.receptionistData_CRM.enquirysCount}{" "}
  //               </Text>
  //             ) : item.id === 1 ? (
  //               <Text style={styles.txt10}>
  //                 {" "}
  //                 {selector.receptionistData_CRM.bookingsCount}{" "}
  //               </Text>
  //             ) : item.id === 2 ? (
  //               <Text style={styles.txt10}>
  //                 {" "}
  //                 {selector.receptionistData_CRM.RetailCount}{" "}
  //               </Text>
  //             ) : item.id === 3 ? (
  //               <Text style={styles.txt10}>
  //                 {" "}
  //                 {selector.receptionistData_CRM.totalLostCount}{" "}
  //               </Text>
  //             ) : (
  //               <Text style={styles.txt10}>0</Text>
  //             )
  //           ) : item.id === 0 ? (
  //             <Text style={styles.txt10}>
  //               {" "}
  //               {selector.receptionistDataV2.enquirysCount}{" "}
  //             </Text>
  //           ) : item.id === 1 ? (
  //             <Text style={styles.txt10}>
  //               {" "}
  //               {selector.receptionistDataV2.bookingsCount}{" "}
  //             </Text>
  //           ) : item.id === 2 ? (
  //             <Text style={styles.txt10}>
  //               {" "}
  //               {selector.receptionistDataV2.RetailCount}{" "}
  //             </Text>
  //           ) : item.id === 3 ? (
  //             <Text style={styles.txt10}>
  //               {" "}
  //               {selector.receptionistDataV2.totalLostCount}{" "}
  //             </Text>
  //           ) : (
  //             <Text style={styles.txt10}>0</Text>
  //           )}
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // };

  const renderCRMTreeFilter = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {selector.receptionistData_ReceptionistDashboard_xrole.consultantList
          ?.length > 0 &&
          selector.receptionistData_ReceptionistDashboard_xrole.consultantList?.map(
            (item, index) => {
              if (
                item.emp_id ===
                selector.saveReceptionistfilterObj.selectedempId[0]
              ) {
                return (
                  <View
                    key={`${item.emp_name} ${index}`}
                    style={{
                      borderColor: filterExapand ? Colors.PINK : "",
                      borderWidth: filterExapand ? 1 : 0,
                      borderRadius: 10,
                      margin: filterExapand ? 10 : 0,
                    }}
                  >
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
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.emp_name}
                          {"  "}
                          {"-   " + item?.roleName}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}></View>
                      <View style={{ flexDirection: "row" }}>
                        {selector.receptionistData_ReceptionistDashboard_xrole
                          ?.fullResponse?.childUserCount > 0 && (
                          <Animated.View
                            style={{
                              transform: [{ translateX: translation }],
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
                              <Text>
                                {
                                  selector
                                    .receptionistData_ReceptionistDashboard_xrole
                                    ?.fullResponse?.childUserCount
                                }
                              </Text>
                            </View>
                          </Animated.View>
                        )}
                        <SourceModelView
                          onClick={() => {
                            if (filterExapand) {
                              handleSourceModalNavigation(
                                item,
                                selector.saveReceptionistfilterObj
                                  .selectedempId[0],
                                [item.emp_id]
                              );
                            } else {
                              handleSourceModalNavigation(
                                item,
                                item.emp_id,
                                []
                              );
                            }
                            // navigation.navigate(
                            //   "RECEP_SOURCE_MODEL",
                            //   {
                            //     empId: item?.emp_id,
                            //     headerTitle: item?.emp_name,
                            //     loggedInEmpId: item.emp_id,
                            //     type: "TEAM",
                            //     moduleType: "home",
                            //     headerTitle: "Source/Model",
                            //     orgId: userData.orgId,
                            //     role: userData.hrmsRole,
                            //     branchList: userData.branchs.map(
                            //       (a) => a.branchId
                            //     ),
                            //   }
                            // );
                          }}
                          style={{
                            transform: [{ translateX: translation }],
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
                          <RenderLevel1NameViewCRM
                            level={0}
                            item={item}
                            branchName={item.branch}
                            color={Colors.CORAL}
                            receptionManager={true}
                            navigation={navigation}
                            titleClick={async (e) => {
                              setfilterExapand(!filterExapand);
                              // setIsViewExpanded(!isViewExpanded)
                            }}
                            roleName={item.roleName}
                            stopLocation={true}
                          />
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: "rgba(223,228,231,0.67)",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            {[
                              filterExapand
                                ? item.enquiryCount
                                : selector
                                    .receptionistData_ReceptionistDashboard_xrole
                                    .enquirysCount || 0,
                              filterExapand
                                ? item.bookingCount
                                : selector
                                    .receptionistData_ReceptionistDashboard_xrole
                                    .bookingsCount || 0,
                              filterExapand
                                ? item.retailCount
                                : selector
                                    .receptionistData_ReceptionistDashboard_xrole
                                    .RetailCount || 0,
                              filterExapand
                                ? item.droppedCount
                                : selector
                                    .receptionistData_ReceptionistDashboard_xrole
                                    .totalLostCount || 0,
                            ].map((e, indexss) => {
                              return (
                                <Pressable
                                  onPress={() => {
                                    // todo redirections logic filter UI
                                    if (e > 0) {
                                      if (filterExapand) {
                                        if (indexss === 0) {
                                          navigateToEMS(
                                            "ENQUIRY",
                                            "",
                                            [item.emp_id],
                                            true,
                                            selector.saveReceptionistfilterObj
                                              .selectedempId[0],
                                            false
                                          );
                                        } else if (indexss === 1) {
                                          navigateToEMS(
                                            "BOOKING",
                                            "",
                                            [item.emp_id],
                                            true
                                          );
                                        } else if (indexss === 2) {
                                          navigateToEMS(
                                            "INVOICECOMPLETED",
                                            "",
                                            [item.emp_id],
                                            true
                                          );
                                        } else if (indexss === 3) {
                                          // todo navigate to lost
                                          navigateToDropAnalysis(
                                            selector.saveReceptionistfilterObj
                                              .selectedempId[0],
                                            true,
                                            item.emp_id,
                                            false
                                          );
                                        }
                                      } else {
                                        if (indexss === 0) {
                                          navigateToEMS(
                                            "ENQUIRY",
                                            "",
                                            [item.emp_id],
                                            true
                                          );
                                        } else if (indexss === 1) {
                                          navigateToEMS(
                                            "BOOKING",
                                            "",
                                            [item.emp_id],
                                            true
                                          );
                                        } else if (indexss === 2) {
                                          navigateToEMS(
                                            "INVOICECOMPLETED",
                                            "",
                                            [item.emp_id],
                                            true
                                          );
                                        } else if (indexss === 3) {
                                          // todo navigate to lost
                                          navigateToDropAnalysis(
                                            selector.saveReceptionistfilterObj
                                              .selectedempId[0],
                                            true
                                          );
                                        }
                                      }
                                    }
                                  }}
                                >
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
                                        textDecorationLine:
                                          e > 0 ? "underline" : "none",
                                        // marginLeft: 50,
                                      }}
                                    >
                                      {e || 0}
                                    </Text>
                                  </View>
                                </Pressable>
                              );
                            })}
                          </View>
                        </View>
                        {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                      </View>
                    </View>
                    {filterExapand && renderCRMTreeFilterAppliedLevel2()}
                  </View>
                );
              }
            }
          )}
      </View>
    );
  };

  const renderCRMTreeFilterAppliedLevel2 = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {selector.receptionistData_ReceptionistDashboard_xrole.consultantList
          ?.length > 0 &&
          selector.receptionistData_ReceptionistDashboard_xrole.consultantList?.map(
            (item, index) => {
              if (
                item.emp_id !==
                selector.saveReceptionistfilterObj.selectedempId[0]
              ) {
                return (
                  <View
                    key={`${item.emp_name} ${index}`}
                    style={
                      {
                        // borderColor: filterExapand ? Colors.PINK : "",
                        // borderWidth: filterExapand ? 1 : 0,
                        // borderRadius: 10,
                        // margin: filterExapand ? 10 : 0
                      }
                    }
                  >
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
                          style={{
                            fontSize: 12,
                            fontWeight: "600",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.emp_name}
                          {"  "}
                          {"-   " + item?.roleName}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}></View>
                      <View style={{ flexDirection: "row" }}>
                        {selector.receptionistData_ReceptionistDashboard_xrole
                          ?.fullResponse?.childUserCount > 0 && (
                          <Animated.View
                            style={{
                              transform: [{ translateX: translation }],
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
                              <Text>
                                {
                                  selector
                                    .receptionistData_ReceptionistDashboard_xrole
                                    ?.fullResponse?.childUserCount
                                }
                              </Text>
                            </View>
                          </Animated.View>
                        )}
                        <SourceModelView
                          onClick={() => {
                            handleSourceModalNavigation(
                              item,
                              selector.saveReceptionistfilterObj
                                .selectedempId[0],
                              [item.emp_id]
                            );
                          }}
                          style={{
                            transform: [{ translateX: translation }],
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
                          <RenderLevel1NameViewCRM
                            level={0}
                            item={item}
                            branchName={item.branch}
                            color={"#2C97DE"}
                            receptionManager={true}
                            navigation={navigation}
                            titleClick={async (e) => {
                              // setIsViewExpanded(!isViewExpanded)
                            }}
                            roleName={item.roleName}
                            stopLocation={true}
                          />
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: "rgba(223,228,231,0.67)",
                              alignItems: "center",
                              flexDirection: "row",
                            }}
                          >
                            {[
                              item.enquiryCount || 0,
                              item.bookingCount || 0,
                              item.retailCount || 0,
                              item.droppedCount || 0,
                            ].map((e, indexss) => {
                              return (
                                <Pressable
                                  onPress={() => {
                                    // todo redirections logic filter UI
                                    if (e > 0) {
                                      if (indexss === 0) {
                                        navigateToEMS(
                                          "ENQUIRY",
                                          "",
                                          [item.emp_id],
                                          true,
                                          selector.saveReceptionistfilterObj
                                            .selectedempId[0]
                                        );
                                      } else if (indexss === 1) {
                                        navigateToEMS(
                                          "BOOKING",
                                          "",
                                          [item.emp_id],
                                          true,
                                          selector.saveReceptionistfilterObj
                                            .selectedempId[0]
                                        );
                                      } else if (indexss === 2) {
                                        navigateToEMS(
                                          "INVOICECOMPLETED",
                                          "",
                                          [item.emp_id],
                                          true,
                                          selector.saveReceptionistfilterObj
                                            .selectedempId[0]
                                        );
                                      } else if (indexss === 3) {
                                        // todo navigate to lost
                                        navigateToDropAnalysis(
                                          selector.saveReceptionistfilterObj
                                            .selectedempId[0],
                                          true,
                                          item.emp_id,
                                          false
                                        );
                                      }
                                    }
                                  }}
                                >
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
                                        textDecorationLine:
                                          e > 0 ? "underline" : "none",
                                        // marginLeft: 50,
                                      }}
                                    >
                                      {e || 0}
                                    </Text>
                                  </View>
                                </Pressable>
                              );
                            })}
                          </View>
                        </View>
                        {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                      </View>
                    </View>
                  </View>
                );
              }
            }
          )}
      </View>
    );
  };

  const renderCRMTree = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmFirstLevelData?.length > 0 &&
          crmFirstLevelData?.map((item, index) => {
            if (selector.receptionistDataV2?.fullResponse?.CRM.length > 0) {
              return (
                <View
                  key={`${item.emp_name} ${index}`}
                  style={{
                    borderColor:
                      isViewExpanded && indexLocalFirstLevel === index
                        ? Colors.PINK
                        : "",
                    borderWidth:
                      isViewExpanded && indexLocalFirstLevel === index ? 1 : 0,
                    borderRadius: 10,
                    margin:
                      isViewExpanded && indexLocalFirstLevel === index ? 10 : 0,
                  }}
                >
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
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {item.emp_name}
                        {"  "}
                        {"-   " + item?.roleName}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}></View>
                    <View style={{ flexDirection: "row" }}>
                      {selector.receptionistDataV2?.fullResponse
                        ?.childUserCount > 0 && (
                        <Animated.View
                          style={{
                            transform: [{ translateX: translation }],
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
                            <Text>
                              {
                                selector.receptionistDataV2?.fullResponse?.CRM[
                                  index
                                ].data.childUserCount
                              }
                            </Text>
                          </View>
                        </Animated.View>
                      )}
                      <SourceModelView
                        onClick={() => {
                          if (isViewExpanded) {
                            // handleSourceModalNavigation()
                            handleSourceModalNavigation(
                              item,
                              item?.emp_id,
                              [item.emp_id],
                              "CRM_INd"
                            );
                          } else {
                            handleSourceModalNavigation(
                              item,
                              "",
                              [],
                              "CRM",
                              true
                            );
                          }

                          // navigation.navigate(
                          //   "RECEP_SOURCE_MODEL",
                          //   {
                          //     empId: item?.emp_id,
                          //     headerTitle: item?.emp_name,
                          //     loggedInEmpId: item.emp_id,
                          //     type: "TEAM",
                          //     moduleType: "home",
                          //     headerTitle: "Source/Model",
                          //     orgId: userData.orgId,
                          //     role: userData.hrmsRole,
                          //     branchList: userData.branchs.map(
                          //       (a) => a.branchId
                          //     ),
                          //   }
                          // );
                        }}
                        style={{
                          transform: [{ translateX: translation }],
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
                        <RenderLevel1NameViewCRM
                          level={0}
                          item={item}
                          branchName={item.branch}
                          color={"#C62159"}
                          receptionManager={true}
                          navigation={navigation}
                          titleClick={async (e) => {
                            formateFirstLevelData(item, index);
                          }}
                          roleName={item.roleName}
                          stopLocation={true}
                        />
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(223,228,231,0.67)",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          {/* {[
                            isViewExpanded ? item.contactCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalEnquiryCount : 0 || 0,
                        isViewExpanded ? item.enquiryCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalBookingCount : 0 || 0,
                        isViewExpanded ? item.bookingCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalRetailCount : 0 || 0,
                        isViewExpanded ? item.retailCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalLostCount : 0 || 0,
                        ] */}

                          {[
                            isViewExpanded && indexLocalFirstLevel === index
                              ? crmFirstLevelDataOwn[index].enquiryCount
                              : crmFirstLevelTotalData
                              ? crmFirstLevelTotalData[index]?.totalEnquiryCount
                              : 0 || 0,
                            isViewExpanded && indexLocalFirstLevel === index
                              ? crmFirstLevelDataOwn[index].bookingCount
                              : crmFirstLevelTotalData
                              ? crmFirstLevelTotalData[index]?.totalBookingCount
                              : 0 || 0,
                            isViewExpanded && indexLocalFirstLevel === index
                              ? crmFirstLevelDataOwn[index].retailCount
                              : crmFirstLevelTotalData
                              ? crmFirstLevelTotalData[index]?.totalRetailCount
                              : 0 || 0,
                            isViewExpanded && indexLocalFirstLevel === index
                              ? crmFirstLevelDataOwn[index].droppedCount
                              : crmFirstLevelTotalData
                              ? crmFirstLevelTotalData[index]?.totalLostCount
                              : 0 || 0,
                          ].map((e, indexss) => {
                            return (
                              <Pressable
                                onPress={() => {
                                  // todo redirections logic  first level
                                  if (e > 0) {
                                    if (!isViewExpanded) {
                                      if (indexss === 0) {
                                        navigateToEMS(
                                          "ENQUIRY",
                                          "",
                                          [item.emp_id],
                                          true,
                                          item.emp_id,
                                          true,
                                          true
                                        );
                                      } else if (indexss === 1) {
                                        navigateToEMS(
                                          "BOOKING",
                                          "",
                                          [item.emp_id],
                                          true,
                                          item.emp_id,
                                          true,
                                          true
                                        );
                                      } else if (indexss === 2) {
                                        navigateToEMS(
                                          "INVOICECOMPLETED",
                                          "",
                                          [item.emp_id],
                                          true,
                                          item.emp_id,
                                          true,
                                          true
                                        );
                                      } else if (indexss === 3) {
                                        navigateToDropAnalysis(
                                          item.emp_id,
                                          false,
                                          "",
                                          true
                                        );
                                      }
                                    } else {
                                      if (indexss === 0) {
                                        navigateToEMS(
                                          "ENQUIRY",
                                          "",
                                          [item.emp_id],
                                          true,
                                          storeFirstLevelLocal.emp_id
                                        );
                                      } else if (indexss === 1) {
                                        navigateToEMS(
                                          "BOOKING",
                                          "",
                                          [item.emp_id],
                                          true,
                                          storeFirstLevelLocal.emp_id
                                        );
                                      } else if (indexss === 2) {
                                        navigateToEMS(
                                          "INVOICECOMPLETED",
                                          "",
                                          [item.emp_id],
                                          true,
                                          storeFirstLevelLocal.emp_id
                                        );
                                      } else if (indexss === 3) {
                                        // todo navigate to lost

                                        navigateToDropAnalysis(
                                          item.emp_id,
                                          true,
                                          item.emp_id
                                        );
                                      }
                                    }
                                  }
                                }}
                              >
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
                                      textDecorationLine:
                                        e > 0 ? "underline" : "none",
                                      // marginLeft: 50,
                                    }}
                                  >
                                    {e || 0}
                                  </Text>
                                </View>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                      {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                    </View>
                  </View>
                  {isViewExpanded &&
                    indexLocalFirstLevel === index &&
                    renderCRMTreeChild()}
                </View>
              );
            }
          })}
        {renderCREFirstLevel()}
      </View>
    );
  };

  const formatCRrSecondLeveleData = (item, index) => {
    setcreIndex(index);

    if (index === creIndex) {
      setIsViewCreExpanded(!isViewCREExpanded);
    } else {
      setIsViewCreExpanded(true);
    }

    setStoreCREFirstLevelLocal(item);

    let salesPeopleUnderCre = creFirstLevelSelfData[
      index
    ].data.consultantList.filter((item2) => item2.emp_id !== item.emp_id);
    setCreSecondLevelData(salesPeopleUnderCre);
  };

  const renderCREFirstLevel = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {creFirstLevelData?.length > 0 &&
          creFirstLevelData?.map((item, index) => {
            return (
              <View
                key={`${item.emp_name} ${index}`}
                style={{
                  borderColor:
                    isViewCREExpanded && index === creIndex ? Colors.BLUE : "",
                  borderWidth: isViewCREExpanded && index === creIndex ? 1 : 0,
                  borderRadius: 10,
                  margin: isViewCREExpanded && index === creIndex ? 10 : 0,
                }}
              >
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
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.emp_name}
                      {"  "}
                      {"-   " + item?.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}></View>
                  <View style={{ flexDirection: "row" }}>
                    {/* {selector.receptionistDataV2?.fullResponse?.childUserCount > 0 && (
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
                            <Text>{selector.receptionistDataV2?.fullResponse?.childUserCount}</Text>
                          </View>
                        </Animated.View>
                      )} */}
                    <SourceModelView
                      onClick={() => {
                        if (isViewCREExpanded) {
                          // handleSourceModalNavigation()
                          handleSourceModalNavigation(item, item?.emp_id, [
                            item.emp_id,
                          ]);
                        } else {
                          handleSourceModalNavigation(item);
                        }

                        // navigation.navigate(
                        //   "RECEP_SOURCE_MODEL",
                        //   {
                        //     empId: item?.emp_id,
                        //     headerTitle: item?.emp_name,
                        //     loggedInEmpId: item.emp_id,
                        //     type: "TEAM",
                        //     moduleType: "home",
                        //     headerTitle: "Source/Model",
                        //     orgId: userData.orgId,
                        //     role: userData.hrmsRole,
                        //     branchList: userData.branchs.map(
                        //       (a) => a.branchId
                        //     ),
                        //   }
                        // );
                      }}
                      style={{
                        transform: [{ translateX: translation }],
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={item.branch}
                        color={Colors.CORAL}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {
                          formatCRrSecondLeveleData(item, index);
                        }}
                        roleName={item.roleName}
                        stopLocation={true}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(223,228,231,0.67)",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {/* {[
                          isViewExpanded ? item.enquiryCount :  selector.receptionistDataV2.enquirysCount || 0,
                          isViewExpanded ? item.bookingCount :  selector.receptionistDataV2.bookingsCount || 0,
                          isViewExpanded ? item.retailCount  :  selector.receptionistDataV2.RetailCount || 0,
                          isViewExpanded ? item.droppedCount :  selector.receptionistDataV2.totalLostCount || 0,
                        ] */}

                        {/* {[
                            isViewCREExpanded ? item.enquiryCount : creFirstLevelSelfData ? creFirstLevelSelfData.enquiryCount : 0 || 0,
                            isViewCREExpanded ? item.bookingCount : creFirstLevelSelfData ? creFirstLevelSelfData.bookingCount : 0 || 0,
                            isViewCREExpanded ? item.retailCount : creFirstLevelSelfData ? creFirstLevelSelfData.retailCount : 0 || 0,
                            isViewCREExpanded ? item.droppedCount : creFirstLevelSelfData ? creFirstLevelSelfData.droppedCount : 0 || 0,
                          ]. */}
                        {[
                          isViewCREExpanded && index === creIndex
                            ? item.enquiryCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].data.enquirysCount
                            : 0 || 0,
                          isViewCREExpanded && index === creIndex
                            ? item.bookingCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].data.bookingsCount
                            : 0 || 0,
                          isViewCREExpanded && index === creIndex
                            ? item.retailCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].data.RetailCount
                            : 0 || 0,
                          isViewCREExpanded && index === creIndex
                            ? item.droppedCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].data.totalLostCount
                            : 0 || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections logic  first level

                                if (e > 0) {
                                  if (isViewCREExpanded) {
                                    if (indexss === 0) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [item.emp_id],
                                        true,
                                        creFirstLevelSelfData[index].emp_id,
                                        false
                                      );
                                    } else if (indexss === 1) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [item.emp_id],
                                        true,
                                        creFirstLevelSelfData[index].emp_id,
                                        false
                                      );
                                    } else if (indexss === 2) {
                                      navigateToEMS(
                                        "INVOICECOMPLETED",
                                        "",
                                        [item.emp_id],
                                        true,
                                        creFirstLevelSelfData[index].emp_id,
                                        false
                                      );
                                    } else if (indexss === 3) {
                                      // todo navigate to lost
                                      navigateToDropAnalysis(
                                        item.emp_id,
                                        true,
                                        item.emp_id
                                      );
                                    }
                                  } else {
                                    // if (item.roleName.toLowerCase() === "field dse") {
                                    //   if (e > 0) {
                                    //     if (indexss === 0) {

                                    //       navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                    //     } else if (indexss === 1) {
                                    //       navigateToEMS("BOOKING", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                    //     } else if (indexss === 2) {
                                    //       navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                    //     } else if (indexss === 3) {
                                    //       // todo navigate to lost
                                    //       navigateToDropAnalysis(storeFirstLevelLocal.emp_id, true, item.emp_id)
                                    //     }
                                    //   }

                                    //   return;
                                    // }

                                    if (indexss === 0) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [item.emp_id],
                                        true
                                      );
                                      // navigateToEMS("ENQUIRY", "", [item.emp_id] );
                                    } else if (indexss === 1) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [item.emp_id],
                                        true
                                      );
                                    } else if (indexss === 2) {
                                      navigateToEMS(
                                        "INVOICECOMPLETED",
                                        "",
                                        [item.emp_id],
                                        true
                                      );
                                    } else if (indexss === 3) {
                                      // todo navigate to lost
                                      navigateToDropAnalysis(item.emp_id, true);
                                    }
                                  }
                                }

                                // if (!isViewCREExpanded) {
                                //     if (indexss === 0) {

                                //       navigateToEMS("ENQUIRY", "", [item.emp_id], true, userData.empId, true);
                                //     } else if (indexss === 1) {
                                //       navigateToEMS("BOOKING", "", [item.emp_id], true, userData.empId, true);
                                //     } else if (indexss === 2) {
                                //       navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, userData.empId, true);
                                //     } else if (indexss === 3) {
                                //       // todo navigate to lost
                                //       navigateToDropAnalysis(item.emp_id)
                                //     }
                                //   }
                                //   else {
                                //     if (indexss === 0) {

                                //       navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                //     } else if (indexss === 1) {
                                //       navigateToEMS("BOOKING", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                //     } else if (indexss === 2) {
                                //       navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                //     } else if (indexss === 3) {
                                //       // todo navigate to lost
                                //       navigateToDropAnalysis(item.emp_id, true)
                                //     }
                                //   }
                                // // }
                              }}
                            >
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
                                    textDecorationLine:
                                      e > 0 ? "underline" : "none",
                                    // marginLeft: 50,
                                  }}
                                >
                                  {e || 0}
                                </Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                    {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                  </View>
                </View>
                {isViewCREExpanded &&
                  index === creIndex &&
                  renderCRETreeSaleConsultants()}
              </View>
            );
          })}
      </View>
    );
  };

  const renderCRETreeSaleConsultants = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {creSecondLevelData?.length > 0 &&
          creSecondLevelData?.map((item, index) => {
            return (
              <View
                key={`${item.emp_name} ${index}`}
                style={
                  {
                    // borderColor: isViewExpanded ? Colors.PINK : "",
                    // borderWidth: isViewExpanded ? 1 : 0,
                    // borderRadius: 10,
                    // margin: isViewExpanded ? 10 : 0
                  }
                }
              >
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
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.emp_name}
                      {"  "}
                      {"-   " + item.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}></View>
                  <SourceModelView
                    onClick={() => {
                      handleSourceModalNavigation(
                        item,
                        storeCREFirstLevelLocal.emp_id,
                        [item.emp_id]
                      );
                    }}
                    style={{
                      transform: [
                        {
                          translateX: translation,
                        },
                      ],
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
                  <View style={[styles.view6]}>
                    <View style={styles.view7}>
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={item.branch}
                        color={"#2C97DE"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {}}
                        roleName={item.roleName}
                        stopLocation={true}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(223,228,231,0.67)",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {[
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                          item.droppedCount || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections logic  third level

                                if (e > 0) {
                                  if (indexss === 0) {
                                    navigateToEMS(
                                      "ENQUIRY",
                                      "",
                                      [item.emp_id],
                                      true,
                                      storeCREFirstLevelLocal.emp_id
                                    );
                                  } else if (indexss === 1) {
                                    navigateToEMS(
                                      "BOOKING",
                                      "",
                                      [item.emp_id],
                                      true,
                                      storeCREFirstLevelLocal.emp_id
                                    );
                                  } else if (indexss === 2) {
                                    navigateToEMS(
                                      "INVOICECOMPLETED",
                                      "",
                                      [item.emp_id],
                                      true,
                                      storeCREFirstLevelLocal.emp_id
                                    );
                                  } else if (indexss === 3) {
                                    // todo navigate to lost
                                    navigateToDropAnalysis(
                                      storeCREFirstLevelLocal.emp_id,
                                      true,
                                      item.emp_id
                                    );
                                  }
                                }
                              }}
                            >
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
                                    textDecorationLine:
                                      e > 0 ? "underline" : "none",
                                    // marginLeft: 50,
                                  }}
                                >
                                  {e || 0}
                                </Text>
                              </View>
                            </Pressable>
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
      </View>
    );
  };

  const formateFirstLevelData = (data, index) => {
    setStoreFirstLevelLocal(data);
    let findSelectedRecData = data?.salesconsultant?.filter(
      (item) => item.emp_id === data.emp_id
    );
    setStoreFirstLevelSelectedRecData(findSelectedRecData);
    setIndexLocalFirstLevel(index);
    if (index === indexLocalFirstLevel) {
      setIsViewExpanded(!isViewExpanded);
    } else {
      setIsViewExpanded(true);
    }

    let tempArr = [];
    let tempInside = [];
    let firstLevelData = selector.receptionistDataV2?.fullResponse.CRM.map(
      (item) => {
        if (item.emp_id === data.emp_id) {
          let temp = item.data.manager.filter(
            (item2) => item2.emp_id !== data.emp_id
          );
          let temp2 = item.data.manager.filter((item3) => {
            if (item3.emp_id === data.emp_id) {
              tempInside = item3.salesconsultant.filter(
                (item4) => item4.emp_id !== data.emp_id
              );
            }
          });

          tempArr.push(...temp);
          Array.prototype.push.apply(tempArr, tempInside);
        }
      }
    );
    setcrmSecondLevelData(tempArr);
  };

  const formatCRM_recep_firstLevel = (item, index) => {
    setCrm_recep_firstLevelIndex(index);
    if (index === crm_recep_firstLevelIndex) {
      setCrm_recep_firstLevelExpand(!crm_recep_firstLevelExpand);
    } else {
      setCrm_recep_firstLevelExpand(true);
    }

    let findCRM_Recep_Otherdata = item.salesconsultant.filter(
      (item2) => item2.emp_id !== item.emp_id
    );
    let findCRM_Recep_OwnData = item.salesconsultant.filter(
      (item2) => item2.emp_id === item.emp_id
    );

    setcrm_recep_FirstLevelOwndata(findCRM_Recep_OwnData);
    setcrm_recep_secondLevel(findCRM_Recep_Otherdata);
  };

  const renderCRMTreeChild = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmSecondLevelData.length > 0 &&
          crmSecondLevelData.map((item, index) => {
            // if (item.emp_id == userData.empId) {
            return (
              <View
                key={`${item.emp_name} ${index}`}
                style={{
                  borderColor:
                    isShowSalesConsultant && indexLocal === index
                      ? Colors.BLUE
                      : "",
                  borderWidth:
                    isShowSalesConsultant && indexLocal === index ? 1 : 0,
                  borderRadius: 10,
                  margin:
                    isShowSalesConsultant && indexLocal === index ? 10 : 0,
                }}
              >
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
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.emp_name}
                      {"  "}
                      {"-   " + item?.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}></View>
                  <SourceModelView
                    onClick={() => {
                      if (isShowSalesConsultant) {
                        handleSourceModalNavigation(
                          item,
                          storeSecondLevelLocal.emp_id,
                          [storeSecondLevelLocal.emp_id]
                        );
                      } else {
                        if (item.roleName === "Field DSE") {
                          handleSourceModalNavigation(
                            item,
                            storeFirstLevelLocal.emp_id,
                            [item.emp_id]
                          );
                        } else {
                          handleSourceModalNavigation(item);
                        }
                      }
                    }}
                    style={{
                      transform: [{ translateX: translation }],
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
                  <View style={[styles.view6]}>
                    <View style={styles.view7}>
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={item.branch}
                        color={"#C62159"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {
                          // setThirdLevelCRMdata([])
                          // todo add condition for sales consultants

                          formateSaleConsutantDataCRM(item, index);
                        }}
                        roleName={item.roleName}
                        stopLocation={true}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(223,228,231,0.67)",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {[
                          isShowSalesConsultant &&
                          indexLocal === index &&
                          storeSelectedRecData
                            ? storeSelectedRecData[0]?.enquiryCount
                            : item.enquiryCount || 0,
                          isShowSalesConsultant &&
                          indexLocal === index &&
                          storeSelectedRecData
                            ? storeSelectedRecData[0]?.bookingCount
                            : item.bookingCount || 0,
                          isShowSalesConsultant &&
                          indexLocal === index &&
                          storeSelectedRecData
                            ? storeSelectedRecData[0]?.retailCount
                            : item.retailCount || 0,
                          isShowSalesConsultant &&
                          indexLocal === index &&
                          storeSelectedRecData
                            ? storeSelectedRecData[0]?.droppedCount
                            : item.droppedCount || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections logic  second level
                                if (e > 0) {
                                  // if (indexss === 0) {

                                  //   navigateToEMS("ENQUIRY", "", [item.emp_id], true);
                                  // } else if (indexss === 1) {
                                  //   navigateToEMS("BOOKING", "", [item.emp_id], true);
                                  // } else if (indexss === 2) {
                                  //   navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true);
                                  // } else if (indexss === 3) {
                                  //   // todo navigate to lost
                                  //   navigateToDropAnalysis(item.emp_id, true)
                                  // }

                                  if (isShowSalesConsultant) {
                                    if (indexss === 0) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [item.emp_id],
                                        true,
                                        storeSelectedRecData[0].emp_id,
                                        false
                                      );
                                    } else if (indexss === 1) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [item.emp_id],
                                        true,
                                        storeSelectedRecData[0].emp_id,
                                        false
                                      );
                                    } else if (indexss === 2) {
                                      navigateToEMS(
                                        "INVOICECOMPLETED",
                                        "",
                                        [item.emp_id],
                                        true,
                                        storeSelectedRecData[0].emp_id,
                                        false
                                      );
                                    } else if (indexss === 3) {
                                      // todo navigate to lost
                                      navigateToDropAnalysis(
                                        item.emp_id,
                                        true,
                                        item.emp_id
                                      );
                                    }
                                  } else {
                                    if (
                                      item.roleName.toLowerCase() ===
                                      "field dse"
                                    ) {
                                      if (e > 0) {
                                        if (indexss === 0) {
                                          navigateToEMS(
                                            "ENQUIRY",
                                            "",
                                            [item.emp_id],
                                            true,
                                            storeFirstLevelLocal.emp_id
                                          );
                                        } else if (indexss === 1) {
                                          navigateToEMS(
                                            "BOOKING",
                                            "",
                                            [item.emp_id],
                                            true,
                                            storeFirstLevelLocal.emp_id
                                          );
                                        } else if (indexss === 2) {
                                          navigateToEMS(
                                            "INVOICECOMPLETED",
                                            "",
                                            [item.emp_id],
                                            true,
                                            storeFirstLevelLocal.emp_id
                                          );
                                        } else if (indexss === 3) {
                                          // todo navigate to lost
                                          navigateToDropAnalysis(
                                            storeFirstLevelLocal.emp_id,
                                            true,
                                            item.emp_id
                                          );
                                        }
                                      }

                                      return;
                                    }

                                    if (indexss === 0) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [item.emp_id],
                                        true
                                      );
                                      // navigateToEMS("ENQUIRY", "", [item.emp_id] );
                                    } else if (indexss === 1) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [item.emp_id],
                                        true
                                      );
                                    } else if (indexss === 2) {
                                      navigateToEMS(
                                        "INVOICECOMPLETED",
                                        "",
                                        [item.emp_id],
                                        true
                                      );
                                    } else if (indexss === 3) {
                                      // todo navigate to lost
                                      navigateToDropAnalysis(item.emp_id, true);
                                    }
                                  }
                                }
                              }}
                            >
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
                                    textDecorationLine:
                                      e > 0 ? "underline" : "none",
                                    // marginLeft: 50,
                                  }}
                                >
                                  {e || 0}
                                </Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                    {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                  </View>
                </View>
                {isShowSalesConsultant &&
                  indexLocal === index &&
                  renderCRMTreeChildSaleConsultants()}
              </View>
            );
            // }
          })}
      </View>
    );
  };

  const renderCRMTreeChildSaleConsultants = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {thirdLevelCRMdata?.length > 0 &&
          thirdLevelCRMdata?.map((item, index) => {
            if (
              item.emp_id !== userData.empId &&
              storeSelectedRecData[0].emp_id !== item.emp_id
            ) {
              return (
                <View
                  key={`${item.emp_name} ${index}`}
                  style={
                    {
                      // borderColor: isViewExpanded ? Colors.PINK : "",
                      // borderWidth: isViewExpanded ? 1 : 0,
                      // borderRadius: 10,
                      // margin: isViewExpanded ? 10 : 0
                    }
                  }
                >
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
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {item.emp_name}
                        {"  "}
                        {"-   " + item.roleName}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}></View>
                    <SourceModelView
                      onClick={() => {
                        handleSourceModalNavigation(
                          item,
                          storeSecondLevelLocal.emp_id,
                          [item.emp_id]
                        );
                      }}
                      style={{
                        transform: [
                          {
                            translateX: translation,
                          },
                        ],
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
                    <View style={[styles.view6]}>
                      <View style={styles.view7}>
                        <RenderLevel1NameViewCRM
                          level={0}
                          item={item}
                          branchName={item.branch}
                          color={"#C62159"}
                          receptionManager={true}
                          navigation={navigation}
                          titleClick={async (e) => {}}
                          roleName={item.roleName}
                          stopLocation={true}
                        />
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(223,228,231,0.67)",
                            alignItems: "center",
                            flexDirection: "row",
                          }}
                        >
                          {[
                            item.enquiryCount || 0,
                            item.bookingCount || 0,
                            item.retailCount || 0,
                            item.droppedCount || 0,
                          ].map((e, indexss) => {
                            return (
                              <Pressable
                                onPress={() => {
                                  // todo redirections logic  third level
                                  if (e > 0) {
                                    if (indexss === 0) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [item.emp_id],
                                        true,
                                        storeSecondLevelLocal.emp_id
                                      );
                                    } else if (indexss === 1) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [item.emp_id],
                                        true,
                                        storeSecondLevelLocal.emp_id
                                      );
                                    } else if (indexss === 2) {
                                      navigateToEMS(
                                        "INVOICECOMPLETED",
                                        "",
                                        [item.emp_id],
                                        true,
                                        storeSecondLevelLocal.emp_id
                                      );
                                    } else if (indexss === 3) {
                                      // todo navigate to lost
                                      navigateToDropAnalysis(
                                        storeSecondLevelLocal.emp_id,
                                        true,
                                        item.emp_id
                                      );
                                    }
                                  }
                                }}
                              >
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
                                      textDecorationLine:
                                        e > 0 ? "underline" : "none",
                                      // marginLeft: 50,
                                    }}
                                  >
                                    {e || 0}
                                  </Text>
                                </View>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                      {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                    </View>
                  </View>
                </View>
              );
            }
          })}
      </View>
    );
  };

  const renderCRM_receptionistFirstLevel = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {selector.receptionistData_CRM.consultantList?.length > 0 &&
          selector.receptionistData_CRM.consultantList?.map((item, index) => {
            // if (item.emp_id === selector.saveCRMfilterObj.selectedempId[0]) {
            return (
              <View
                key={`${item.emp_name} ${index}`}
                style={{
                  borderColor:
                    crm_recep_firstLevelExpand &&
                    crm_recep_firstLevelIndex == index
                      ? Colors.PINK
                      : "",
                  borderWidth:
                    crm_recep_firstLevelExpand &&
                    crm_recep_firstLevelIndex == index
                      ? 1
                      : 0,
                  borderRadius: 10,
                  margin:
                    crm_recep_firstLevelExpand &&
                    crm_recep_firstLevelIndex == index
                      ? 10
                      : 0,
                }}
              >
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
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.emp_name}
                      {"  "}
                      {"-   " + item?.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}></View>
                  <View style={{ flexDirection: "row" }}>
                    {selector.receptionistData?.fullResponse?.childUserCount >
                      0 && (
                      <Animated.View
                        style={{
                          transform: [{ translateX: translation }],
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
                          <Text>
                            {
                              selector.receptionistData?.fullResponse
                                ?.childUserCount
                            }
                          </Text>
                        </View>
                      </Animated.View>
                    )}
                    <SourceModelView
                      onClick={() => {
                        if (crm_recep_firstLevelExpand) {
                          handleSourceModalNavigation(item, item.emp_id, [
                            item.emp_id,
                          ]);
                        } else {
                          handleSourceModalNavigation(item, item.emp_id, []);
                          // navigation.navigate(
                          //   "RECEP_SOURCE_MODEL",
                          //   {
                          //     empId: item?.emp_id,
                          //     headerTitle: item?.emp_name,
                          //     loggedInEmpId: item.emp_id,
                          //     type: "TEAM",
                          //     moduleType: "home",
                          //     headerTitle: "Source/Model",
                          //     orgId: userData.orgId,
                          //     role: userData.hrmsRole,
                          //     branchList: userData.branchs.map(
                          //       (a) => a.branchId
                          //     ),
                          //   }
                          // );
                        }
                        // navigation.navigate(
                        //   "RECEP_SOURCE_MODEL",
                        //   {
                        //     empId: item?.emp_id,
                        //     headerTitle: item?.emp_name,
                        //     loggedInEmpId: item.emp_id,
                        //     type: "TEAM",
                        //     moduleType: "home",
                        //     headerTitle: "Source/Model",
                        //     orgId: userData.orgId,
                        //     role: userData.hrmsRole,
                        //     branchList: userData.branchs.map(
                        //       (a) => a.branchId
                        //     ),
                        //   }
                        // );
                      }}
                      style={{
                        transform: [{ translateX: translation }],
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={item.branch}
                        color={Colors.CORAL}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {
                          formatCRM_recep_firstLevel(item, index);

                          // setIsViewExpanded(!isViewExpanded)
                        }}
                        roleName={item.roleName}
                        stopLocation={true}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(223,228,231,0.67)",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {[
                          crm_recep_firstLevelExpand &&
                          crm_recep_firstLevelIndex == index &&
                          crm_recep_FirstLevelOwndata
                            ? crm_recep_FirstLevelOwndata[0].enquiryCount || 0
                            : item.enquiryCount || 0,
                          crm_recep_firstLevelExpand &&
                          crm_recep_firstLevelIndex == index &&
                          crm_recep_FirstLevelOwndata
                            ? crm_recep_FirstLevelOwndata[0].bookingsCount || 0
                            : item.bookingCount || 0,
                          crm_recep_firstLevelExpand &&
                          crm_recep_firstLevelIndex == index &&
                          crm_recep_FirstLevelOwndata
                            ? crm_recep_FirstLevelOwndata[0].retailCount
                            : item.retailCount || 0,
                          crm_recep_firstLevelExpand &&
                          crm_recep_firstLevelIndex == index &&
                          crm_recep_FirstLevelOwndata
                            ? crm_recep_FirstLevelOwndata[0].droppedCount
                            : item.droppedCount || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections logic filter UI
                                // if (e > 0) {
                                if (crm_recep_firstLevelExpand) {
                                  if (indexss === 0) {
                                    navigateToEMS(
                                      "ENQUIRY",
                                      "",
                                      [item.emp_id],
                                      true,
                                      crm_recep_FirstLevelOwndata[0].emp_id,
                                      false
                                    );
                                  } else if (indexss === 1) {
                                    navigateToEMS(
                                      "BOOKING",
                                      "",
                                      [item.emp_id],
                                      true,
                                      crm_recep_FirstLevelOwndata[0].emp_id,
                                      false
                                    );
                                  } else if (indexss === 2) {
                                    navigateToEMS(
                                      "INVOICECOMPLETED",
                                      "",
                                      [item.emp_id],
                                      true,
                                      crm_recep_FirstLevelOwndata[0].emp_id,
                                      false
                                    );
                                  } else if (indexss === 3) {
                                    // todo navigate to lost
                                    navigateToDropAnalysis(
                                      crm_recep_FirstLevelOwndata[0].emp_id,
                                      true,
                                      item.emp_id,
                                      false
                                    );
                                  }
                                } else {
                                  if (indexss === 0) {
                                    navigateToEMS(
                                      "ENQUIRY",
                                      "",
                                      [item.emp_id],
                                      true
                                    );
                                  } else if (indexss === 1) {
                                    navigateToEMS(
                                      "BOOKING",
                                      "",
                                      [item.emp_id],
                                      true
                                    );
                                  } else if (indexss === 2) {
                                    navigateToEMS(
                                      "INVOICECOMPLETED",
                                      "",
                                      [item.emp_id],
                                      true
                                    );
                                  } else if (indexss === 3) {
                                    // todo navigate to lost
                                    navigateToDropAnalysis(item.emp_id, true);
                                  }
                                }

                                // }
                              }}
                            >
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
                                    textDecorationLine:
                                      e > 0 ? "underline" : "none",
                                    // marginLeft: 50,
                                  }}
                                >
                                  {e || 0}
                                </Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                    {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                  </View>
                </View>
                {crm_recep_firstLevelExpand &&
                  crm_recep_firstLevelIndex == index &&
                  renderCRM_receptionistSecondLevel()}
              </View>
            );
            // }
          })}
      </View>
    );
  };
  const renderCRM_receptionistSecondLevel = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crm_recep_secondLevel?.length > 0 &&
          crm_recep_secondLevel?.map((item, index) => {
            // if (item.emp_id === selector.saveCRMfilterObj.selectedempId[0]) {
            return (
              <View
                key={`${item.emp_name} ${index}`}
                style={
                  {
                    // borderColor: crm_recep_firstLevelExpand && crm_recep_firstLevelIndex == index ? Colors.PINK : "",
                    // borderWidth: crm_recep_firstLevelExpand && crm_recep_firstLevelIndex == index ? 1 : 0,
                    // borderRadius: 10,
                    // margin: crm_recep_firstLevelExpand && crm_recep_firstLevelIndex == index ? 10 : 0
                  }
                }
              >
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
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.emp_name}
                      {"  "}
                      {"-   " + item?.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}></View>
                  <View style={{ flexDirection: "row" }}>
                    {selector.receptionistData?.fullResponse?.childUserCount >
                      0 && (
                      <Animated.View
                        style={{
                          transform: [{ translateX: translation }],
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
                          <Text>
                            {
                              selector.receptionistData?.fullResponse
                                ?.childUserCount
                            }
                          </Text>
                        </View>
                      </Animated.View>
                    )}
                    <SourceModelView
                      onClick={() => {
                        handleSourceModalNavigation(
                          item,
                          crm_recep_FirstLevelOwndata[0].emp_id,
                          [item.emp_id]
                        );
                      }}
                      style={{
                        transform: [{ translateX: translation }],
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={item.branch}
                        color={"#2C97DE"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {
                          // formatCRM_recep_firstLevel(item, index)
                          // setIsViewExpanded(!isViewExpanded)
                        }}
                        roleName={item.roleName}
                        stopLocation={true}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(223,228,231,0.67)",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {[
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                          item.droppedCount || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections logic filter UI
                                // if (e > 0) {
                                // todo manthan
                                if (indexss === 0) {
                                  navigateToEMS(
                                    "ENQUIRY",
                                    "",
                                    [item.emp_id],
                                    true,
                                    crm_recep_FirstLevelOwndata[0].emp_id,
                                    false
                                  );
                                } else if (indexss === 1) {
                                  navigateToEMS(
                                    "BOOKING",
                                    "",
                                    [item.emp_id],
                                    true,
                                    crm_recep_FirstLevelOwndata[0].emp_id,
                                    false
                                  );
                                } else if (indexss === 2) {
                                  navigateToEMS(
                                    "INVOICECOMPLETED",
                                    "",
                                    [item.emp_id],
                                    true,
                                    crm_recep_FirstLevelOwndata[0].emp_id,
                                    false
                                  );
                                } else if (indexss === 3) {
                                  // todo navigate to lost
                                  navigateToDropAnalysis(
                                    crm_recep_FirstLevelOwndata[0].emp_id,
                                    true,
                                    item.emp_id,
                                    false
                                  );
                                }
                                // }
                              }}
                            >
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
                                    textDecorationLine:
                                      e > 0 ? "underline" : "none",
                                    // marginLeft: 50,
                                  }}
                                >
                                  {e || 0}
                                </Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                    {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                  </View>
                </View>
                {/* {crm_recep_firstLevelExpand && crm_recep_firstLevelIndex ==  index  && renderCRMTreeFilterAppliedLevel2()} */}
              </View>
            );
            // }
          })}
      </View>
    );
  };

  const formateSaleConsutantDataCRM = (itemMain, index) => {
    // let salesconsultant = item.salesconsultant;

    setIndexLocal(index);

    if (index === indexLocal) {
      setisShowSalesConsultant(!isShowSalesConsultant);
    } else {
      setisShowSalesConsultant(true);
    }

    setThirdLevelCRMdata(itemMain?.salesconsultant);
    setstoreSecondLevelLocal(itemMain);

    let findSelectedRecData = itemMain?.salesconsultant?.filter(
      (item) => item.emp_id === itemMain.emp_id
    );
    setStoreSelectedRecData(findSelectedRecData);
  };


  const handleNavigationTOSourcrModelVol2 = (item, leadlist) => {

    navigation.navigate("RECEP_SOURCE_MODEL_RECEPTIONIST", {
      empId: "",
      headerTitle: item.empName,
      loggedInEmpId: "",
      type: "TEAM",
      moduleType: "ReceptionistDashboard",
      // headerTitle: "Source/Model",
      orgId: userData.orgId,
      role: item.roleName,
      branchList: userData.branchs.map((a) => a.branchId),
      empList: "",
      self: false,
      leadId_list: leadlist
    });

  }

  const handleSourceModalNavigation = (
    item,
    parentId = "",
    empList = [],
    role = "",
    self = false
  ) => {
    switch (item.roleName.toLowerCase()) {
      case "tele caller":
        navigation.navigate("RECEP_SOURCE_MODEL_RECEPTIONIST", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "ReceptionistDashboard",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: item.roleName,
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
        });
        break;
      case "reception":
        navigation.navigate("RECEP_SOURCE_MODEL_RECEPTIONIST", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "ReceptionistDashboard",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: item.roleName,
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
        });
        break;
      case "cre":
        navigation.navigate("RECEP_SOURCE_MODEL_RECEPTIONIST", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "ReceptionistDashboard",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: item.roleName,
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
        });
        break;
      case "field dse":
        navigation.navigate("RECEP_SOURCE_MODEL_RECEPTIONIST", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "ReceptionistDashboard",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: item.roleName,
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
        });
        // navigation.navigate(
        //   AppNavigator
        //     .HomeStackIdentifiers
        //     .sourceModel,
        //   {
        //     empId:
        //       item.emp_id,
        //     headerTitle:
        //       item.emp_name,
        //     type: "TEAM",
        //     moduleType:
        //       "home",
        //   }
        // );

        break;
      case "crm":
        navigation.navigate("RECEP_SOURCE_MODEL_RECEPTIONIST", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "ReceptionistDashboard",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: role === "CRM" ? "CRM" : "CRM_INd",
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
          self: self,
        });
        break;
      default:
        break;
    }
  };

  const renderReceptionistCRMVol2 = ()=>{
    return (
      <>
        {crmVol2Level0?.length > 0 &&
          crmVol2Level0?.map((item, index) => {
            return (
              <View
                style={{
                  borderRadius: 10,
                  borderWidth: isRecepVol2Level0Expanded ? 2 : 0,
                  borderColor: "#C62159",
                  backgroundColor: "#FFFFFF",
                }}
              >



                <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 12,
                      // width: Dimensions.get("screen").width - 28,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item?.empName}
                      {"  "}
                      {"-   " + item?.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 12, }}>
                    {item?.childCount >
                      0 && (
                        // <Animated.View
                        //   style={{
                        //     transform: [{ translateX: translation }],
                        //   }}
                        // >
                        <View
                          style={{
                            backgroundColor: "lightgrey",
                            flexDirection: "row",
                            paddingHorizontal: 7,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "space-between",
                            // marginBottom: 5,
                            alignSelf: "center",
                            marginLeft: 7,
                            // transform: [{ translateX: translation }],
                          }}
                        >
                          <MaterialIcons
                            name="person"
                            size={15}
                            color={Colors.BLACK}
                          />
                          <Text>
                            {
                              item?.childCount
                            }
                          </Text>
                        </View>
                        // </Animated.View>
                      )}
                    <Pressable
                      style={{ alignSelf: "center" }}
                      onPress={() => {
                        if (!isRecepVol2Level0Expanded) {
                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.total.retailLeads)
                          Array.prototype.push.apply(tempArry, item.total.lostLeads)


                          // handleSourcrModelNavigationVol2(item, tempArry,)
                          handleNavigationTOSourcrModelVol2(item, tempArry)
                        } else {
                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.self.retailLeads)
                          Array.prototype.push.apply(tempArry, item.self.lostLeads)

                          handleNavigationTOSourcrModelVol2(item, tempArry)
                        }
                        // handleSourceModalNavigation(item, item.emp_id, [])
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: Colors.BLUE,
                          marginLeft: 8,
                          paddingRight: 12,
                        }}
                      >
                        Source/Model
                      </Text>
                    </Pressable>
                  </View>
                </View>
                {/*Source/Model View END */}
                <View style={[{ flexDirection: "row" }]}>
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
                      {/* todo */}
                      <RenderLevel1NameViewCRMVol2
                        level={0}
                        item={item}
                        branchName={getBranchName(item?.branchName)}
                        color={Colors.CORAL}
                        titleClick={async () => {

                          seIsCRM_Non_reportingVol2Level0Expanded(false)
                          setIsRecepVol2Level0Expanded(!isRecepVol2Level0Expanded);
                          return;
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(223,228,231,0.67)",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {/* {[
                          item.contactCount || 0,
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                        ]. */}
                        {/* {[
                          selector.receptionist_self_data?.contactsCount || 0,
                          selector.receptionist_self_data?.enquirysCount || 0,
                          selector.receptionist_self_data?.bookingsCount || 0,
                          selector.receptionist_self_data?.RetailCount || 0,
                        ]. */}
                        {[
                          
                          isRecepVol2Level0Expanded ? item.self.enquiryCount : item?.total?.enquiryCount || 0,

                          isRecepVol2Level0Expanded ? item.self.bookingCount : item?.total?.bookingCount || 0,
                          isRecepVol2Level0Expanded ? item.self.retailCount : item?.total?.retailCount || 0,
                          isRecepVol2Level0Expanded ? item.self.lostCount : item?.total?.lostCount || 0,

                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (isRecepVol2Level0Expanded) {
                                    if (index === 0) {
                                      navigateToEmsVol2(item.self.enquiryLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.self.bookingLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.self.retailLeads)
                                    } else if (index === 3) {
                                      navigateToDropAnalysisVol2(item.self.lostLeads)
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToEmsVol2(item.total.enquiryLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.total.bookingLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.total.retailLeads)
                                    } else if (index === 3) {
                                      navigateToDropAnalysisVol2(item.total.lostLeads)
                                    }
                                  }
                                }
                                // // todo redirections logic filter UI
                                // if (e > 0) {
                                //   if (index === 0) {
                                //     navigateToEMS("Contact", "", [], false, userData.empId, true);

                                //   } else if (index === 1) {
                                //     navigateToEMS("ENQUIRY", "", [], false, userData.empId, true);
                                //   } else if (index === 2) {
                                //     navigateToEMS("BOOKING", "", [], false, userData.empId, true);
                                //   } else if (index === 3) {
                                //     navigateToEMS("Invoice", "", [], false, userData.empId, true);
                                //   }
                                // }
                              }}
                            >
                              <View
                                style={{
                                  width: 55,
                                  height: 30,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  // marginLeft: 10,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    textDecorationLine:
                                      e > 0 ? "underline" : "none",
                                    // marginLeft: 50,
                                  }}
                                >
                                  {e || 0}
                                </Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                      {/* <View
                      style={{
                        width: "100%",
                        height: boxHeight,
                        flexDirection: "row",
                        alignSelf: "center",
                        // backgroundColor: "red",
                      }}
                    >
                      {renderFilterData(item, "#C62159")}
                    </View> */}
                    </View>
                    {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                  </View>
                </View>
                {isRecepVol2Level0Expanded && renderCRMNewTreeLevel1()}
              </View>
            );
          })}
        {renderCRMReportingUserTreeVol2()}
        {renderCRMNonReportingUserTreeVol2()}
      </>
    );
  }

  const oncllickOfEmployeeForCRm = async (item = [], index, allData, herirarchyLevel) => {

    let modifeidArray = [...crmVol2AlluserData];
    let storeTemp = [...crmVol2Level1];

    // let modifiedData = _.cloneDeep(originalData);
    // console.log("manthan {...selector.receptionistDataV3CRM.fullResponse} ", item.empId);

    // for (let index = 0; index < modifiedData.length; index++) {
    //   const element = modifiedData[index];

    //   if (element.selfUser.empId == item.empId) {
    //     element.selfUser.isOpenInner = !element.selfUser.isOpenInner;
    //   }

    // }



    let tempNewArray = await modifeidArray.filter(i => i.managerId != i.empId && i.managerId == item.empId)


    await item.isOpenInner ? (item.isOpenInner = false,
      item.innerData = []) : (item.isOpenInner = true, item.innerData.push(...tempNewArray))

    // Array.prototype.push.apply(storeTemp, tempNewArray)


    await setCrmVol2Level1(storeTemp);


  }

  

  const renderCRMNewTreeLevel1 = () => {
    // todo manthan

    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmVol2Level1?.length > 0 &&
          crmVol2Level1?.map((item, index) => {
            return renderDynamicTree(item, index, [],
              color,
              0)

          })}
        {/* {renderCRMReportingUserTreeVol2()} */}
      </View>
    );
  };

  const formateReportingUserData = async (item, index, originalData, heirarchyLevel) => {

    // console.log("manthan {...selector.receptionistDataV3CRM.fullResponse} ", { ...selector.receptionistDataV3CRM.fullResponse });
    // let modifiedData =  [...crmVol2ReportingData];
    let modifiedData = _.cloneDeep(originalData);
    let id = "";
    let data = [];
    let findLevel1Id = modifiedData.map((itemInner, indexInner) => {

      if (itemInner.selfUser.empId == item.empId) {
        id = itemInner.level1[0].empId;
        data = itemInner.allTreeData;
      }
    })
    setCrmVol2ReportingAllTree(data);

    let findInnderDataLevel1 = data.filter((item2, index2) => item2.empId == id);


    for (let index = 0; index < modifiedData.length; index++) {
      const element = modifiedData[index];
      if (element.selfUser.empId == item.empId) {

        element.selfUser.isOpenInner = !element.selfUser.isOpenInner;
        element.selfUser.innerData = findInnderDataLevel1;
      } else {
        element.selfUser.isOpenInner = false;
        element.selfUser.innerData = [];
      }

    }

    setCrmVol2ReportingData(modifiedData)


  }


  const formateReportingUserDataForLevelN = async (item, index, originalData, heirarchyLevel) => {


    let modifiedData = _.cloneDeep(originalData);

    let filtrData = modifiedData.filter((itemInn) => itemInn.managerId != itemInn.empId && itemInn.managerId == item.empId)

    await item.isOpenInner ? (item.isOpenInner = false,
      item.innerData = []) : (item.isOpenInner = true, item.innerData.push(...filtrData))

    setCrmVol2ReportingData([...crmVol2ReportingData])


  }

  const renderDynamicTree = (item, index, allData, levelColors, newLevel) => {
    const hierarchyLevel = newLevel;
    const borderColor = levelColors[hierarchyLevel % levelColors.length];

    return (
      <View
        key={`${item.empName} ${index}`}
        style={[
          {
            // borderColor: item.isOpenInner ? borderColor : "",
            // borderWidth: item.isOpenInner ? 2 : 0,
            // borderRadius: 10,
            // margin: item.isOpenInner ? 10 : 0,
          },
          item.isOpenInner && {
            borderRadius: 10,
            borderWidth: 2,
            borderColor: borderColor,
            backgroundColor: "#FFFFFF",
          },
        ]}
      // style={{
      //   borderColor: item.isOpenInner ? borderColor : "",
      //   borderWidth: item.isOpenInner ? 2 : 0,
      //   borderRadius: 10,
      //   margin: item.isOpenInner ? 10 : 0,
      // }}
      >


        <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
          <View
            style={{
              paddingHorizontal: 8,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 12,
              // width: Dimensions.get("screen").width - 28,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {item?.empName}
              {"  "}
              {"-   " + item?.roleName}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 12, }}>
            {item?.childCount >
              0 && (
                // <Animated.View
                //   style={{
                //     transform: [{ translateX: translation }],
                //   }}
                // >
                <View
                  style={{
                    backgroundColor: "lightgrey",
                    flexDirection: "row",
                    paddingHorizontal: 7,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                    // marginBottom: 5,
                    alignSelf: "center",
                    marginLeft: 7,
                    // transform: [{ translateX: translation }],
                  }}
                >
                  <MaterialIcons
                    name="person"
                    size={15}
                    color={Colors.BLACK}
                  />
                  <Text>
                    {
                      item?.childCount
                    }
                  </Text>
                </View>
                // </Animated.View>
              )}
            <SourceModelView
              onClick={() => {
                if (!item.isOpenInner) {

                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.total.retailLeads)
                  Array.prototype.push.apply(tempArry, item.total.lostLeads)


                  handleNavigationTOSourcrModelVol2(item, tempArry)
                } else {
                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.self.retailLeads)
                  Array.prototype.push.apply(tempArry, item.self.lostLeads)

                  handleNavigationTOSourcrModelVol2(item, tempArry)
                }


                // navigation.navigate(
                //   "RECEP_SOURCE_MODEL",
                //   {
                //     empId: item?.emp_id,
                //     headerTitle: item?.emp_name,
                //     loggedInEmpId: item.emp_id,
                //     type: "TEAM",
                //     moduleType: "home",
                //     headerTitle: "Source/Model",
                //     orgId: userData.orgId,
                //     role: userData.hrmsRole,
                //     branchList: userData.branchs.map(
                //       (a) => a.branchId
                //     ),
                //   }
                // );
              }}
              style={{
                // transform: [{ translateX: translation }],
              }}
            />
          </View>
        </View>
        {/*Source/Model View END */}
        <View style={[{ flexDirection: "row" }]}>
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
              {/* todo */}
              <RenderLevel1NameViewCRMVol2
                level={0}
                item={item}
                branchName={getBranchName(item?.branchId)}
                color={borderColor}
                titleClick={async () => {
                  if (userData.hrmsRole == "CRM") {
                    oncllickOfEmployeeForCRm(item, index, allData, newLevel);
                  } else {
                    // oncllickOfEmployee(item, index, allData, newLevel);
                  }
                }}
              />
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(223,228,231,0.67)",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {/* {[
                          item.contactCount || 0,
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                        ]. */}
                {/* {[
                          selector.receptionist_self_data?.contactsCount || 0,
                          selector.receptionist_self_data?.enquirysCount || 0,
                          selector.receptionist_self_data?.bookingsCount || 0,
                          selector.receptionist_self_data?.RetailCount || 0,
                        ]. */}
                {[
                  
                  item.isOpenInner ? item.self.enquiryCount : item.total.enquiryCount || 0,

                  item.isOpenInner ? item.self.bookingCount : item.total.bookingCount || 0,
                  item.isOpenInner ? item.self.retailCount : item.total.retailCount || 0,
                  item.isOpenInner ? item.self.lostCount : item.total.lostCount || 0,

                ].map((e, index) => {
                  return (
                    <Pressable
                      onPress={() => {
                        if (e > 0) {
                          if (item.isOpenInner) {
                            if (index === 0) {
                              navigateToEmsVol2(item.self.enquiryLeads)

                            } else if (index === 1) {
                              navigateToEmsVol2(item.self.bookingLeads)
                            } else if (index === 2) {
                              navigateToEmsVol2(item.total.retailLeads)
                            } else if (index === 3) {
                              navigateToDropAnalysisVol2(item.total.lostLeads)
                            }
                          } else {
                            if (index === 0) {
                              navigateToEmsVol2(item.total.enquiryLeads)

                            } else if (index === 1) {
                              navigateToEmsVol2(item.total.bookingLeads)
                            } else if (index === 2) {
                              navigateToEmsVol2(item.total.retailLeads)
                            } else if (index === 3) {
                              navigateToDropAnalysisVol2(item.total.lostLeads)

                            }
                          }
                        }
                        // // todo redirections logic filter UI
                        // if (e > 0) {
                        //   if (index === 0) {
                        //     navigateToEMS("Contact", "", [], false, userData.empId, true);

                        //   } else if (index === 1) {
                        //     navigateToEMS("ENQUIRY", "", [], false, userData.empId, true);
                        //   } else if (index === 2) {
                        //     navigateToEMS("BOOKING", "", [], false, userData.empId, true);
                        //   } else if (index === 3) {
                        //     navigateToEMS("Invoice", "", [], false, userData.empId, true);
                        //   }
                        // }
                      }}
                    >
                      <View
                        style={{
                          width: 55,
                          height: 30,
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            textDecorationLine:
                              e > 0 ? "underline" : "none",
                            // marginLeft: 50,
                          }}
                        >
                          {e || 0}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              {/* <View
                      style={{
                        width: "100%",
                        height: boxHeight,
                        flexDirection: "row",
                        alignSelf: "center",
                        // backgroundColor: "red",
                      }}
                    >
                      {renderFilterData(item, "#C62159")}
                    </View> */}
            </View>
            {/* GET EMPLOYEE TOTAL MAIN ITEM */}
          </View>
        </View>
        {/* {item.isOpenInner && renderCRMTreeChild()} */}

        {item.isOpenInner &&
          item.innerData.length > 0 &&
          item.innerData.map((innerItem1, innerIndex1) => {
            return renderDynamicTree(
              item.innerData[innerIndex1],
              innerIndex1,
              item.innerData,
              levelColors,
              hierarchyLevel + 1
            );
          })}
      </View>
    );
  }

  const renderDynamicTreeReportingUser = (item, index, allData, levelColors, newLevel) => {
    const hierarchyLevel = newLevel;
    const borderColor = levelColors[hierarchyLevel % levelColors.length];

    return (
      <View
        key={`${item.empName} ${index}`}
        style={[
          {
            // borderColor: item.isOpenInner ? borderColor : "",
            // borderWidth: item.isOpenInner ? 2 : 0,
            // borderRadius: 10,
            // margin: item.isOpenInner ? 10 : 0,
          },
          item.isOpenInner && {
            borderRadius: 10,
            borderWidth: 2,
            borderColor: borderColor,
            backgroundColor: "#FFFFFF",
          },
        ]}
      // style={{
      //   borderColor: item.isOpenInner ? borderColor : "",
      //   borderWidth: item.isOpenInner ? 2 : 0,
      //   borderRadius: 10,
      //   margin: item.isOpenInner ? 10 : 0,
      // }}
      >

        <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
          <View
            style={{
              paddingHorizontal: 8,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 12,
              // width: Dimensions.get("screen").width - 28,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {item?.empName}
              {"  "}
              {"-   " + item?.roleName}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 12, }}>
            {item?.childCount >
              0 && (
                // <Animated.View
                //   style={{
                //     transform: [{ translateX: translation }],
                //   }}
                // >
                <View
                  style={{
                    backgroundColor: "lightgrey",
                    flexDirection: "row",
                    paddingHorizontal: 7,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                    // marginBottom: 5,
                    alignSelf: "center",
                    marginLeft: 7,
                    // transform: [{ translateX: translation }],
                  }}
                >
                  <MaterialIcons
                    name="person"
                    size={15}
                    color={Colors.BLACK}
                  />
                  <Text>
                    {
                      item?.childCount
                    }
                  </Text>
                </View>
                // </Animated.View>
              )}
            <SourceModelView
              onClick={() => {
                if (!item.isOpenInner) {

                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.total.retailLeads)
                  Array.prototype.push.apply(tempArry, item.total.lostLeads)


                  handleNavigationTOSourcrModelVol2(item, tempArry)
                } else {
                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.self.retailLeads)
                  Array.prototype.push.apply(tempArry, item.self.lostLeads)

                  handleNavigationTOSourcrModelVol2(item, tempArry)
                }


                // navigation.navigate(
                //   "RECEP_SOURCE_MODEL",
                //   {
                //     empId: item?.emp_id,
                //     headerTitle: item?.emp_name,
                //     loggedInEmpId: item.emp_id,
                //     type: "TEAM",
                //     moduleType: "home",
                //     headerTitle: "Source/Model",
                //     orgId: userData.orgId,
                //     role: userData.hrmsRole,
                //     branchList: userData.branchs.map(
                //       (a) => a.branchId
                //     ),
                //   }
                // );
              }}
              style={{
                // transform: [{ translateX: translation }],
              }}
            />
          </View>
        </View>

        {/*Source/Model View END */}
        <View style={[{ flexDirection: "row" }]}>
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
              {/* todo */}
              <RenderLevel1NameViewCRMVol2
                level={0}
                item={item}
                branchName={getBranchName(item?.branchId)}
                color={borderColor}
                titleClick={async () => {
                  formateReportingUserDataForLevelN(item, index, crmVol2ReportingAllTree, hierarchyLevel)
                }}
              />
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(223,228,231,0.67)",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {/* {[
                          item.contactCount || 0,
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                        ]. */}
                {/* {[
                          selector.receptionist_self_data?.contactsCount || 0,
                          selector.receptionist_self_data?.enquirysCount || 0,
                          selector.receptionist_self_data?.bookingsCount || 0,
                          selector.receptionist_self_data?.RetailCount || 0,
                        ]. */}
                {[
              
                  item.isOpenInner ? item.self.enquiryCount : item.total.enquiryCount || 0,

                  item.isOpenInner ? item.self.bookingCount : item.total.bookingCount || 0,
                  item.isOpenInner ? item.self.retailCount : item.total.retailCount || 0,
                  item.isOpenInner ? item.self.lostCount : item.total.lostCount || 0,

                ].map((e, index) => {
                  return (
                    <Pressable
                      onPress={() => {
                        if (e > 0) {
                          if (item.isOpenInner) {
                            if (index === 0) {
                              navigateToEmsVol2(item.self.enquiryLeads)

                            } else if (index === 1) {
                              navigateToEmsVol2(item.self.bookingLeads)
                            } else if (index === 2) {
                              navigateToEmsVol2(item.self.retailLeads)
                            } else if (index === 3) {
                              navigateToDropAnalysisVol2(item.self.lostLeads)
                            }
                          } else {
                            if (index === 0) {
                              navigateToEmsVol2(item.total.enquiryLeads)

                            } else if (index === 1) {
                              navigateToEmsVol2(item.total.bookingLeads)
                            } else if (index === 2) {
                              navigateToEmsVol2(item.total.retailLeads)
                            } else if (index === 3) {
                              navigateToDropAnalysisVol2(item.total.lostLeads)

                            }
                          }
                        }
                        // // todo redirections logic filter UI
                        // if (e > 0) {
                        //   if (index === 0) {
                        //     navigateToEMS("Contact", "", [], false, userData.empId, true);

                        //   } else if (index === 1) {
                        //     navigateToEMS("ENQUIRY", "", [], false, userData.empId, true);
                        //   } else if (index === 2) {
                        //     navigateToEMS("BOOKING", "", [], false, userData.empId, true);
                        //   } else if (index === 3) {
                        //     navigateToEMS("Invoice", "", [], false, userData.empId, true);
                        //   }
                        // }
                      }}
                    >
                      <View
                        style={{
                          width: 55,
                          height: 30,
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            textDecorationLine:
                              e > 0 ? "underline" : "none",
                            // marginLeft: 50,
                          }}
                        >
                          {e || 0}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              {/* <View
                      style={{
                        width: "100%",
                        height: boxHeight,
                        flexDirection: "row",
                        alignSelf: "center",
                        // backgroundColor: "red",
                      }}
                    >
                      {renderFilterData(item, "#C62159")}
                    </View> */}
            </View>
            {/* GET EMPLOYEE TOTAL MAIN ITEM */}
          </View>
        </View>
        {/* {item.isOpenInner && renderCRMTreeChild()} */}

        {item.isOpenInner &&
          item.innerData.length > 0 &&
          item.innerData.map((innerItem1, innerIndex1) => {
            return renderDynamicTreeReportingUser(
              item.innerData[innerIndex1],
              innerIndex1,
              item.innerData,
              levelColors,
              hierarchyLevel + 1
            );
          })}
      </View>
    );
  }

  const renderCRMReportingUserTreeVol2 = () => {
    // todo manthan
    const borderColor = color[4 % color.length];
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmVol2ReportingData?.length > 0 &&
          crmVol2ReportingData?.map((item, index) => {
            // if (item.empId === userData.empId) {
            return (
              <View
                style={{
                  borderRadius: 10,
                  borderWidth: item.selfUser.isOpenInner ? 2 : 0,
                  borderColor: "#C62159",
                  backgroundColor: "#FFFFFF",
                }}
              >

                <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 12,
                      // width: Dimensions.get("screen").width - 28,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.selfUser?.empName}
                      {"  "}
                      {"-   " + item.selfUser?.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 12, }}>
                    {item.selfUser?.childCount >
                      0 && (
                        // <Animated.View
                        //   style={{
                        //     transform: [{ translateX: translation }],
                        //   }}
                        // >
                        <View
                          style={{
                            backgroundColor: "lightgrey",
                            flexDirection: "row",
                            paddingHorizontal: 7,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "space-between",
                            // marginBottom: 5,
                            alignSelf: "center",
                            marginLeft: 7,
                            // transform: [{ translateX: translation }],
                          }}
                        >
                          <MaterialIcons
                            name="person"
                            size={15}
                            color={Colors.BLACK}
                          />
                          <Text>
                            {
                              item.selfUser?.childCount
                            }
                          </Text>
                        </View>
                        // </Animated.View>
                      )}
                    <Pressable
                      style={{ alignSelf: "flex-end" }}
                      onPress={() => {
                        if (!item.selfUser.isOpenInner) {
                          console.log("manthan ooo >> ", JSON.stringify(item));
                          let tempArry = [];
                          
                          Array.prototype.push.apply(tempArry, item?.selfUser.total.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item?.selfUser.total.bookingLeads)
                          Array.prototype.push.apply(tempArry, item?.selfUser.total.retailLeads)
                          Array.prototype.push.apply(tempArry, item?.selfUser.total.lostLeads)



                          // handleSourcrModelNavigationVol2(item, tempArry,)
                          handleNavigationTOSourcrModelVol2(item?.selfUser, tempArry)
                        } else {
                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item?.selfUser.self.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item?.selfUser.self.bookingLeads)
                          Array.prototype.push.apply(tempArry, item?.selfUser.self.retailLeads)
                          Array.prototype.push.apply(tempArry, item?.selfUser.self.lostLeads)

                          handleNavigationTOSourcrModelVol2(item?.selfUser, tempArry)
                        }
                        // handleSourceModalNavigation(item, item.emp_id, [])
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: Colors.BLUE,
                          marginLeft: 8,
                          paddingRight: 12,
                        }}
                      >
                        Source/Model
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/*Source/Model View END */}
                <View style={[{ flexDirection: "row" }]}>
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
                      {/* todo */}
                      <RenderLevel1NameViewCRMVol2
                        level={0}
                        item={item.selfUser}
                        branchName={getBranchName(item?.selfUser.branchName)}
                        color={Colors.CORAL}
                        titleClick={async () => {
                          formateReportingUserData(item.selfUser, index, crmVol2ReportingData, 0);
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(223,228,231,0.67)",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {/* {[
                          item.contactCount || 0,
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                        ]. */}
                        {/* {[
                          selector.receptionist_self_data?.contactsCount || 0,
                          selector.receptionist_self_data?.enquirysCount || 0,
                          selector.receptionist_self_data?.bookingsCount || 0,
                          selector.receptionist_self_data?.RetailCount || 0,
                        ]. */}
                        {[
                         
                          item.selfUser.isOpenInner ? item.selfUser.self.enquiryCount : item.selfUser.total.enquiryCount || 0,

                          item.selfUser.isOpenInner ? item.selfUser.self.bookingCount : item.selfUser.total.bookingCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.retailCount : item.selfUser.total.retailCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.lostCount : item.selfUser.total.lostCount || 0,

                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (item.selfUser.isOpenInner) {
                                    if (index === 0) {
                                      navigateToEmsVol2(item.selfUser.self.enquiryLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.selfUser.self.bookingLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.selfUser.self.retailLeads)
                                    } else if (index === 3) {
                                      navigateToDropAnalysisVol2(item.selfUser.self.lostLeads)
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToEmsVol2(item.selfUser.total.enquiryLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.selfUser.total.bookingLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.selfUser.total.retailLeads)
                                    } else if (index === 3) {
                                      navigateToDropAnalysisVol2(item.selfUser.total.lostLeads)
                                    }
                                  }
                                }
                                // // todo redirections logic filter UI
                                // if (e > 0) {
                                //   if (index === 0) {
                                //     navigateToEMS("Contact", "", [], false, userData.empId, true);

                                //   } else if (index === 1) {
                                //     navigateToEMS("ENQUIRY", "", [], false, userData.empId, true);
                                //   } else if (index === 2) {
                                //     navigateToEMS("BOOKING", "", [], false, userData.empId, true);
                                //   } else if (index === 3) {
                                //     navigateToEMS("Invoice", "", [], false, userData.empId, true);
                                //   }
                                // }
                              }}
                            >
                              <View
                                style={{
                                  width: 55,
                                  height: 30,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginLeft: 10,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    textDecorationLine:
                                      e > 0 ? "underline" : "none",
                                    // marginLeft: 50,
                                  }}
                                >
                                  {e || 0}
                                </Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                      {/* <View
                      style={{
                        width: "100%",
                        height: boxHeight,
                        flexDirection: "row",
                        alignSelf: "center",
                        // backgroundColor: "red",
                      }}
                    >
                      {renderFilterData(item, "#C62159")}
                    </View> */}
                    </View>
                    {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                  </View>
                </View>
                {item.selfUser.isOpenInner && renderReportingUserTree(item.selfUser)}
              </View>
            );
            // }
          })}
        {/* {renderCREFirstLevel()} */}
      </View>
    );
  };


  const renderReportingUserTree = (item) => {

    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {item.innerData.length > 0 &&
          item.innerData.map((item, index) => {
            return renderDynamicTreeReportingUser(item, index, item,
              color,
              1)

          })}

      </View>
    );
  }


  const formateNonReportingUserData = async (item, index, originalData, heirarchyLevel) => {

    // console.log("manthan {...selector.receptionistDataV3CRM.fullResponse} ", { ...selector.receptionistDataV3CRM.fullResponse });
    // let modifiedData =  [...crmVol2ReportingData];
    let modifiedData = _.cloneDeep(originalData);
    let id = "";
    let data = [];
    let findLevel1Id = modifiedData.map((itemInner, indexInner) => {

      if (itemInner.selfUser.empId == item.empId) {
        id = itemInner.level1[0].empId;
        data = itemInner.allTreeData;
      }
    })
    setCrmVol2ReportingAllTree(data);

    let findInnderDataLevel1 = data.filter((item2, index2) => item2.empId == id);


    for (let index = 0; index < modifiedData.length; index++) {
      const element = modifiedData[index];
      if (element.selfUser.empId == item.empId) {

        element.selfUser.isOpenInner = !element.selfUser.isOpenInner;
        element.selfUser.innerData = findInnderDataLevel1;
      } else {
        element.selfUser.isOpenInner = false;
        element.selfUser.innerData = [];
      }

    }

    setCrmVol2NonReportingData(modifiedData)


  }


  const renderCRMNonReportingUserTreeVol2 = () => {
    // todo manthan
    const borderColor = color[4 % color.length];
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmVol2NonReportingData?.length > 0 &&
          crmVol2NonReportingData?.map((item, index) => {
            // if (item.empId === userData.empId) {
            return (
              <View
                style={{
                  borderRadius: 10,
                  borderWidth: item.selfUser.isOpenInner ? 2 : 0,
                  borderColor: borderColor,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 12,
                      // width: Dimensions.get("screen").width - 28,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.selfUser?.empName}
                      {"  "}
                      {"-   " + item.selfUser?.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 12, }}>
                    {item.selfUser?.childCount >
                      0 && (
                        // <Animated.View
                        //   style={{
                        //     transform: [{ translateX: translation }],
                        //   }}
                        // >
                        <View
                          style={{
                            backgroundColor: "lightgrey",
                            flexDirection: "row",
                            paddingHorizontal: 7,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "space-between",
                            // marginBottom: 5,
                            alignSelf: "center",
                            marginLeft: 7,
                            // transform: [{ translateX: translation }],
                          }}
                        >
                          <MaterialIcons
                            name="person"
                            size={15}
                            color={Colors.BLACK}
                          />
                          <Text>
                            {
                              item.selfUser?.childCount
                            }
                          </Text>
                        </View>
                        // </Animated.View>
                      )}
                    <Pressable
                      style={{ alignSelf: "flex-end" }}
                      onPress={() => {
                        if (!item.selfUser.isOpenInner) {
                          let tempArry = [];
                          
                          Array.prototype.push.apply(tempArry, item.selfUser.total.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.total.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.total.retailLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.total.lostLeads)


                          // handleSourcrModelNavigationVol2(item, tempArry,)
                          handleNavigationTOSourcrModelVol2(item.selfUser, tempArry)
                        } else {
                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item.selfUser.self.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.self.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.self.retailLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.self.lostLeads)

                          handleNavigationTOSourcrModelVol2(item.selfUser, tempArry)
                        }
                        // handleSourceModalNavigation(item, item.emp_id, [])
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: Colors.BLUE,
                          marginLeft: 8,
                          paddingRight: 12,
                        }}
                      >
                        Source/Model
                      </Text>
                    </Pressable>
                  </View>
                </View>
                {/*Source/Model View END */}
                <View style={[{ flexDirection: "row" }]}>
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
                      {/* todo */}
                      <RenderLevel1NameViewCRMVol2
                        level={0}
                        item={item.selfUser}
                        branchName={getBranchName(item?.selfUser.branchName)}
                        color={borderColor}
                        titleClick={async () => {
                          formateNonReportingUserData(item.selfUser, index, crmVol2NonReportingData, 0);
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: "rgba(223,228,231,0.67)",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {/* {[
                          item.contactCount || 0,
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                        ]. */}
                        {/* {[
                          selector.receptionist_self_data?.contactsCount || 0,
                          selector.receptionist_self_data?.enquirysCount || 0,
                          selector.receptionist_self_data?.bookingsCount || 0,
                          selector.receptionist_self_data?.RetailCount || 0,
                        ]. */}
                        {[
                        
                          item.selfUser.isOpenInner ? item.selfUser.self.enquiryCount : item.selfUser.total.enquiryCount || 0,

                          item.selfUser.isOpenInner ? item.selfUser.self.bookingCount : item.selfUser.total.bookingCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.retailCount : item.selfUser.total.retailCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.lostCount : item.selfUser.total.lostCount || 0,

                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (item.selfUser.isOpenInner) {
                                    if (index === 0) {
                                      navigateToEmsVol2(item.selfUser.self.enquiryLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.selfUser.self.bookingLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.selfUser.self.retailLeads)
                                    } else if (index === 3) {
                                      navigateToDropAnalysisVol2(item.selfUser.self.lostLeads)
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToEmsVol2(item.selfUser.total.enquiryLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.selfUser.total.bookingLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.selfUser.total.retailLeads)
                                    } else if (index === 3) {
                                      navigateToDropAnalysisVol2(item.selfUser.total.lostLeads)
                                    }
                                  }
                                }
                                // // todo redirections logic filter UI
                                // if (e > 0) {
                                //   if (index === 0) {
                                //     navigateToEMS("Contact", "", [], false, userData.empId, true);

                                //   } else if (index === 1) {
                                //     navigateToEMS("ENQUIRY", "", [], false, userData.empId, true);
                                //   } else if (index === 2) {
                                //     navigateToEMS("BOOKING", "", [], false, userData.empId, true);
                                //   } else if (index === 3) {
                                //     navigateToEMS("Invoice", "", [], false, userData.empId, true);
                                //   }
                                // }
                              }}
                            >
                              <View
                                style={{
                                  width: 55,
                                  height: 30,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginLeft: 10,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontWeight: "700",
                                    textDecorationLine:
                                      e > 0 ? "underline" : "none",
                                    // marginLeft: 50,
                                  }}
                                >
                                  {e || 0}
                                </Text>
                              </View>
                            </Pressable>
                          );
                        })}
                      </View>
                      {/* <View
                      style={{
                        width: "100%",
                        height: boxHeight,
                        flexDirection: "row",
                        alignSelf: "center",
                        // backgroundColor: "red",
                      }}
                    >
                      {renderFilterData(item, "#C62159")}
                    </View> */}
                    </View>
                    {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                  </View>
                </View>
                {item.selfUser.isOpenInner && renderReportingUserTree(item.selfUser)}
              </View>

            );
            // }
          })}
        {/* {renderCREFirstLevel()} */}
      </View>
    );
  };


  return (
    <React.Fragment>
      {!selector.isLoading ? (
        <View style={styles.container}>
          {!receptionistRole.includes(userData.hrmsRole) ? (
            selector.isTeam ? (
              <View>
                <View style={styles.titleDashboardContainer}>
                  <Text style={styles.dashboardText}>Dashboard</Text>
                </View>
                <View style={styles.view1}>
                  <View style={styles.view2}>
                    <View style={styles.percentageToggleView}></View>
                  </View>
                </View>
                {isLoading ? (
                  <AnimLoaderComp visible={true} />
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
                        {/* <View
                          style={{ width: 100, height: 20, marginRight: 5 }}
                        ></View> */}
                        {/* <View
                            style={{ width: 100, height: 20, marginRight: 5, alignItems: "center" }}
                          >
                            <Text style={{
                              fontSize: 9,
                              color: Colors.RED,
                              fontWeight: "600",
                              alignSelf: "center",
                              textAlign: "center",

                              marginTop: 10
                            }}>Employee</Text>

                          </View> */}
                        <View
                          style={{
                            width: 100,
                            height: 20,
                            marginRight: 5,
                            alignItems: "flex-start",
                            marginLeft: 10,
                          }}
                        >
                          <View
                            style={[
                              styles.itemBox,
                              {
                                width: 55,
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color: Colors.RED,
                                fontSize: 12,
                              }}
                            >
                              Employee
                            </Text>
                          </View>
                        </View>
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
                    {/* {CRM_filterParameters.length == 0 ? renderCRMtreeFirstLevel() : null} */}
                    {!selector.saveReceptionistfilterObj.selectedempId
                      ? renderCRMTree()
                      : selector.saveReceptionistfilterObj
                          ?.selectedDesignation &&
                        selector.saveReceptionistfilterObj
                          ?.selectedDesignation[0] === "Reception"
                      ? renderCRMTreeFilter()
                      : null}
                    {/* // : renderCRMTreeFilterApplied()}  */}
                    {/* Grand Total Section */}
                    {totalOfTeam && (
                      <View
                        style={{
                          width: Dimensions.get("screen").width - 35,
                          marginTop: 20,
                        }}
                      >
                        <View style={{ alignItems: "flex-end" }}>
                          <SourceModelView
                            onClick={() => {
                              if (
                                selector.saveReceptionistfilterObj.selectedempId
                              ) {
                                navigation.navigate(
                                  "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                  {
                                    empId:
                                      selector.saveReceptionistfilterObj
                                        .selectedempId[0],
                                    loggedInEmpId:
                                      selector.saveReceptionistfilterObj
                                        .selectedempId[0],
                                    // type: "TEAM",
                                    moduleType: "ReceptionistDashboard",
                                    headerTitle: "Source/Model",
                                    orgId: userData.orgId,
                                    role: selector.saveReceptionistfilterObj
                                      ?.selectedDesignation[0],
                                    branchList: userData.branchs.map(
                                      (a) => a.branchId
                                    ),
                                    // empList: selector.saveCRMfilterObj.selectedempId,
                                    self: true,
                                  }
                                );
                              } else {
                                if (userData.hrmsRole === "CRM") {
                                  navigation.navigate(
                                    "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                    {
                                      empId: userData.empId,
                                      headerTitle: "Source/Model",
                                      loggedInEmpId: userData.empId,
                                      orgId: userData.orgId,
                                      role: "CRM",
                                      moduleType: "ReceptionistDashboard",
                                      dashboardType: "reception",
                                      self: false,
                                    }
                                  );
                                } else {
                                  navigation.navigate(
                                    "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                    {
                                      empId: userData.empId,
                                      headerTitle: "Source/Model",
                                      loggedInEmpId: userData.empId,
                                      orgId: userData.orgId,
                                      role: "xrole",
                                      moduleType: "ReceptionistDashboard",
                                    }
                                  );
                                }
                              }
                            }}
                            style={{
                              transform: [{ translateX: translation }],
                            }}
                          />
                        </View>
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
          ) : selector.isTeam ? (
            // For CRM login Receptionist dashboard
            <View>
              <View style={styles.view1}>
                <View style={styles.view2}>
                  <View style={styles.percentageToggleView}></View>
                </View>
              </View>
              {isLoading ? (
                <AnimLoaderComp visible={true} />
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
                      {/* <View
                        style={{ width: 100, height: 20, marginRight: 5 }}
                      ></View> */}
                      {/* <View
                            style={{ width: 100, height: 20, marginRight: 5, alignItems: "center" }}
                          >
                            <Text style={{
                              fontSize: 9,
                              color: Colors.RED,
                              fontWeight: "600",
                              alignSelf: "center",
                              textAlign: "center",

                              // marginTop: 10
                            }}>Employee</Text>

                          </View> */}
                      <View
                        style={{
                          width: 100,
                          height: 20,
                          marginRight: 5,
                          alignItems: "flex-start",
                          marginLeft: 10,
                        }}
                      >
                        <View
                          style={[
                            styles.itemBox,
                            {
                              width: 55,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color: Colors.RED,
                              fontSize: 12,
                            }}
                          >
                            Employee
                          </Text>
                        </View>
                      </View>

                      <View style={styles.view4}>
                        {toggleParamsMetaData.map((param) => {
                          return (
                            <View
                              style={[
                                styles.itemBox,
                                {
                                  width:
                                    param.paramName === "DROPPED" ? 60 : 60,
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
                        {/* new code for vol2 CRM receptionsit dashboard start */}
                          {renderReceptionistCRMVol2()}

                        {totalOfTeam && (
                        <View
                          style={{
                            width: Dimensions.get("screen").width - 35,
                            marginTop: 20,
                          }}
                        >
                          <View style={{ alignItems: "flex-end" }}>
                            <SourceModelView
                              onClick={() => {
                                let tempArry = [];
                                Array.prototype.push.apply(tempArry, selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryLeads)
                                Array.prototype.push.apply(tempArry, selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingLeads)
                                Array.prototype.push.apply(tempArry, selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailLeads)
                                Array.prototype.push.apply(tempArry, selector.receptionistData_CRM_vol2?.fullResponse?.totalLostLeads)
                                console.log("manthan jjjd ", tempArry);
                                let item = {
                                  empName:"Grand Total",
                                  roleName:""
                                }
                                handleNavigationTOSourcrModelVol2(item,tempArry)
                                // if (
                                //   selector.saveReceptionistfilterObj.selectedempId
                                // ) {
                                //   navigation.navigate(
                                //     "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                //     {
                                //       empId:
                                //         selector.saveReceptionistfilterObj
                                //           .selectedempId[0],
                                //       loggedInEmpId:
                                //         selector.saveReceptionistfilterObj
                                //           .selectedempId[0],
                                //       // type: "TEAM",
                                //       moduleType: "ReceptionistDashboard",
                                //       headerTitle: "Source/Model",
                                //       orgId: userData.orgId,
                                //       role: selector.saveReceptionistfilterObj
                                //         ?.selectedDesignation[0],
                                //       branchList: userData.branchs.map(
                                //         (a) => a.branchId
                                //       ),
                                //       // empList: selector.saveCRMfilterObj.selectedempId,
                                //       self: true,
                                //     }
                                //   );
                                // } else {
                                //   if (userData.hrmsRole === "CRM") {
                                //     navigation.navigate(
                                //       "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                //       {
                                //         empId: userData.empId,
                                //         headerTitle: "Source/Model",
                                //         loggedInEmpId: userData.empId,
                                //         orgId: userData.orgId,
                                //         role: "CRM",
                                //         moduleType: "ReceptionistDashboard",
                                //         dashboardType: "reception",
                                //         self: false,
                                //       }
                                //     );
                                //   } else {
                                //     navigation.navigate(
                                //       "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                //       {
                                //         empId: userData.empId,
                                //         headerTitle: "Source/Model",
                                //         loggedInEmpId: userData.empId,
                                //         orgId: userData.orgId,
                                //         role: "xrole",
                                //         moduleType: "ReceptionistDashboard",
                                //       }
                                //     );
                                //   }
                                // }
                              }}
                              style={{
                                transform: [{ translateX: translation }],
                              }}
                            />
                          </View>
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
                                    marginLeft:10
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
                                          marginLeft:10
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

                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                      {/* new code for vol2 CRM receptionsit dashboard end */}

                  {/* for CRM login Receptionist dashboard  */}
                  {/* {CRM_filterParameters.length == 0 ? renderCRMtreeFirstLevel() : null} */}
                  {/* {!selector.saveReceptionistfilterObj.selectedempId
                    ? renderCRM_receptionistFirstLevel()
                    : selector.saveReceptionistfilterObj?.selectedDesignation &&
                      selector.saveReceptionistfilterObj
                        ?.selectedDesignation[0] === "Reception"
                    ? renderCRMTreeFilter()
                    : null} */}
                  {/* // : renderCRMTreeFilterApplied()}  */}
                  {/* Grand Total Section */}
                  {/* {totalOfTeam && (
                    <View
                      style={{
                        width: Dimensions.get("screen").width - 35,
                        marginTop: 20,
                      }}
                    >
                      <View style={{ alignItems: "flex-end" }}>
                        <SourceModelView
                          onClick={() => {
                            if (
                              selector.saveReceptionistfilterObj.selectedempId
                            ) {
                              navigation.navigate(
                                "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                {
                                  empId:
                                    selector.saveReceptionistfilterObj
                                      .selectedempId[0],
                                  loggedInEmpId:
                                    selector.saveReceptionistfilterObj
                                      .selectedempId[0],
                                  // type: "TEAM",
                                  moduleType: "ReceptionistDashboard",
                                  headerTitle: "Source/Model",
                                  orgId: userData.orgId,
                                  role: selector.saveReceptionistfilterObj
                                    ?.selectedDesignation[0],
                                  branchList: userData.branchs.map(
                                    (a) => a.branchId
                                  ),
                                  // empList: selector.saveCRMfilterObj.selectedempId,
                                  self: true,
                                }
                              );
                            } else {
                              if (userData.hrmsRole === "CRM") {
                                navigation.navigate(
                                  "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                  {
                                    empId: userData.empId,
                                    headerTitle: "Source/Model",
                                    loggedInEmpId: userData.empId,
                                    orgId: userData.orgId,
                                    role: "CRM",
                                    moduleType: "ReceptionistDashboard",
                                    dashboardType: "reception",
                                    self: false,
                                  }
                                );
                              } else {
                                navigation.navigate(
                                  "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                  {
                                    empId: userData.empId,
                                    headerTitle: "Source/Model",
                                    loggedInEmpId: userData.empId,
                                    orgId: userData.orgId,
                                    role: "xrole",
                                    moduleType: "ReceptionistDashboard",
                                  }
                                );
                              }
                            }
                          }}
                          style={{
                            transform: [{ translateX: translation }],
                          }}
                        />
                      </View>
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
                             
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  )} */}
                </ScrollView>
              )}
            </View>
          ) : null}

          {selector.isTeam && receptionistRole.includes(userData.hrmsRole)
            ? null
            : // IF Self or insights
              true && (
                <>
                  <>
                    {true && !selector.isTeam ? (
                      <>
                        {true && (
                          <View style={{ paddingHorizontal: "8%" }}>
                            <View style={styles.titleDashboardContainer}>
                              <Text style={styles.dashboardText}>
                                Dashboard
                              </Text>
                            </View>
                            <View style={styles.newView}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "600",
                                  color: Colors.BLUE,
                                  marginLeft: 8,
                                }}
                              >
                                Leads Allocated
                              </Text>
                              <SourceModelView
                                style={{ alignSelf: "flex-end" }}
                                onClick={() => {
                                  let tempArry = [];
                                  Array.prototype.push.apply(tempArry, selector.receptionistData_CRM_vol2?.fullResponse?.totalEnquiryLeads)
                                  Array.prototype.push.apply(tempArry, selector.receptionistData_CRM_vol2?.fullResponse?.totalBookingLeads)
                                  Array.prototype.push.apply(tempArry, selector.receptionistData_CRM_vol2?.fullResponse?.totalRetailLeads)
                                  Array.prototype.push.apply(tempArry, selector.receptionistData_CRM_vol2?.fullResponse?.totalLostLeads)
                                  
                                  let item = {
                                    empName: "Source/Model",
                                    roleName: ""
                                  }
                                  handleNavigationTOSourcrModelVol2(item, tempArry)
                                  // if (
                                  //   selector.saveReceptionistfilterObj
                                  //     .selectedempId
                                  // ) {
                                  //   navigation.navigate(
                                  //     "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                  //     {
                                  //       empId:
                                  //         selector.saveReceptionistfilterObj
                                  //           .selectedempId[0],
                                  //       loggedInEmpId:
                                  //         selector.saveReceptionistfilterObj
                                  //           .selectedempId[0],
                                  //       // type: "TEAM",
                                  //       moduleType: "ReceptionistDashboard",
                                  //       headerTitle: "Source/Model",
                                  //       orgId: userData.orgId,
                                  //       role: selector.saveReceptionistfilterObj
                                  //         ?.selectedDesignation[0],
                                  //       branchList: userData.branchs.map(
                                  //         (a) => a.branchId
                                  //       ),
                                  //       // empList: selector.saveCRMfilterObj.selectedempId,
                                  //       self: true,
                                  //     }
                                  //   );
                                  // } else {
                                  //   if (userData.hrmsRole === "CRM") {
                                  //     navigation.navigate(
                                  //       "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                  //       {
                                  //         empId: userData.empId,
                                  //         headerTitle: "Source/Model",
                                  //         loggedInEmpId: userData.empId,
                                  //         orgId: userData.orgId,
                                  //         role: "CRM",
                                  //         moduleType: "ReceptionistDashboard",
                                  //         dashboardType: "reception",
                                  //         self: false,
                                  //       }
                                  //     );
                                  //   } else {
                                  //     navigation.navigate(
                                  //       "RECEP_SOURCE_MODEL_RECEPTIONIST",
                                  //       {
                                  //         empId: userData.empId,
                                  //         headerTitle: "Source/Model",
                                  //         loggedInEmpId: userData.empId,
                                  //         orgId: userData.orgId,
                                  //         role: "xrole",
                                  //         moduleType: "ReceptionistDashboard",
                                  //       }
                                  //     );
                                  //   }
                                  // }
                                }}
                              />
                            </View>
                            {/* todo */}
                            <FlatList
                              data={data}
                              bounces={false}
                              renderItem={({ item, index }) =>
                                renderItem(item, index)
                              }
                              contentContainerStyle={{ width: "100%" }}
                            />
                          </View>
                        )}

                        {/* digital dashboard old code  */}
                        {/* <View style={styles.view14}>
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
                            data={selector.receptionistDataV2.consultantList}
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
                                          item?.enquiryCount > 0 &&
                                            navigateToEMS();
                                        }}
                                        style={{
                                          padding: 2,
                                          textDecorationLine:
                                            item?.enquiryCount > 0
                                              ? "underline"
                                              : "none",
                                        }}
                                      >
                                        {item?.enquiryCount}
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
                                    selector.receptionistDataV2
                                      .totalAllocatedCount > 0 &&
                                      navigateToEMS();
                                  }}
                                  style={{
                                    padding: 2,
                                    textDecorationLine:
                                      selector.receptionistDataV2
                                        .totalAllocatedCount > 0
                                        ? "underline"
                                        : "none",
                                  }}
                                >
                                  {
                                    selector.receptionistDataV2
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
                                      selector.receptionistDataV2.bookingsCount >
                                      0
                                        ? "underline"
                                        : "none",
                                  }}
                                >
                                  {selector.receptionistDataV2.bookingsCount}
                                </Text>
                              </View>
                              <View style={styles.view20}>
                                <Text
                                  onPress={() => {
                                    selector.receptionistDataV2.RetailCount > 0 &&
                                      navigateToEMS();
                                  }}
                                  style={{
                                    padding: 2,
                                    textDecorationLine:
                                      selector.receptionistDataV2.RetailCount > 0
                                        ? "underline"
                                        : "none",
                                  }}
                                >
                                  {selector.receptionistDataV2.RetailCount}
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
                                      selector.receptionistDataV2.totalLostCount >
                                      0
                                        ? "underline"
                                        : "none",
                                  }}
                                >
                                  {selector.receptionistDataV2.totalLostCount}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.view21}>
                            <View style={{ ...styles.statWrap, width: "33%" }}>
                              <Text style={styles.txt5}>E2B</Text>
                              {selector.receptionistDataV2.bookingsCount !==
                                null &&
                              selector.receptionistDataV2.enquirysCount !==
                                null ? (
                                <Text
                                  style={{
                                    color:
                                      Math.floor(
                                        (parseInt(
                                          selector.receptionistDataV2
                                            .bookingsCount
                                        ) /
                                          parseInt(
                                            selector.receptionistDataV2
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
                                    selector.receptionistDataV2.bookingsCount
                                  ) === 0 ||
                                  parseInt(
                                    selector.receptionistDataV2.enquirysCount
                                  ) === 0
                                    ? 0
                                    : Math.round(
                                        (parseInt(
                                          selector.receptionistDataV2
                                            .bookingsCount
                                        ) /
                                          parseInt(
                                            selector.receptionistDataV2
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
                              {selector.receptionistDataV2.bookingsCount !==
                                null &&
                              selector.receptionistDataV2.RetailCount !== null ? (
                                <Text
                                  style={{
                                    color:
                                      Math.floor(
                                        (parseInt(
                                          selector.receptionistDataV2.RetailCount
                                        ) /
                                          parseInt(
                                            selector.receptionistDataV2
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
                                    selector.receptionistDataV2.RetailCount
                                  ) === 0 ||
                                  parseInt(
                                    selector.receptionistDataV2.bookingsCount
                                  ) === 0
                                    ? 0
                                    : Math.round(
                                        (parseInt(
                                          selector.receptionistDataV2.RetailCount
                                        ) /
                                          parseInt(
                                            selector.receptionistDataV2
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
                              {selector.receptionistDataV2.enquirysCount !==
                                null &&
                              selector.receptionistDataV2.RetailCount !== null ? (
                                <Text
                                  style={{
                                    color:
                                      Math.floor(
                                        (parseInt(
                                          selector.receptionistDataV2.RetailCount
                                        ) /
                                          parseInt(
                                            selector.receptionistDataV2
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
                                    selector.receptionistDataV2.RetailCount
                                  ) === 0 ||
                                  parseInt(
                                    selector.receptionistDataV2.enquirysCount
                                  ) === 0
                                    ? 0
                                    : Math.round(
                                        (parseInt(
                                          selector.receptionistDataV2.RetailCount
                                        ) /
                                          parseInt(
                                            selector.receptionistDataV2
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
                          </View>
                        </ScrollView> */}
                        {/* digital dashboard old code  */}
                      </>
                    ) : null}
                  </>
                </>
              )}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <AnimLoaderComp visible={selector.isLoading} />
        </View>
        // <LoaderComponent
        //   visible={selector.isLoading}
        //   onRequestClose={() => {}}
        // />
      )}
    </React.Fragment>
  );
};

export default ReceptionistDashBoardTargetScreen;

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

export const RenderLevel1NameViewCRM = ({
  level,
  item,
  branchName = "",
  color,
  titleClick,
  navigation,
  disable = false,
  receptionManager = false,
  stopLocation = false,
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
            {item?.emp_name?.charAt(0)}
          </Text>
        </TouchableOpacity>
        {/* {level === 0 && !!branchName && ( */}
        {branchName ? (
          <TouchableOpacity
            disabled={stopLocation}
            onPress={() => {
              if (item.roleName !== "MD" && item.roleName !== "CEO") {
                navigation.navigate(
                  AppNavigator.HomeStackIdentifiers.location,
                  {
                    empId: item.empId,
                    orgId: item.orgId,
                  }
                );
              }
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <IconButton
              icon="map-marker"
              style={{ padding: 0, margin: 0 }}
              color={Colors.RED}
              size={8}
            />
            <Text style={{ fontSize: 8 }} numberOfLines={2}>
              {branchName}
            </Text>
          </TouchableOpacity>
        ) : null}
        {/* )} */}
      </View>
      {/* <View
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
      </View> */}
    </View>
  );
};

export const RenderLevel1NameViewCRMVol2 = ({
  level,
  item,
  branchName = "",
  color,
  titleClick,
  disable = false,
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
      <View style={{ justifyContent: "center", alignItems: "center" }}>
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
        {level === 0 && !!item?.branchName && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="map-marker"
              style={{ padding: 0, margin: 0 }}
              color={Colors.RED}
              size={8}
            />
            <Text style={{ fontSize: 8, width: "70%" }} numberOfLines={1}>
              {item?.branchName}
            </Text>
          </View>
        )}
      </View>
      {/* <View
        style={{
          width: "35%",
          justifyContent: "center",
          textAlign: "center",
          alignItems: "flex-end",
          display: "flex",
          flexDirection: "column",
          marginRight: 5,
        }}
      >
        <Text
          style={{
            fontSize: 6,
            fontWeight: "bold",
            paddingVertical: 6,
            height: 25,
          }}
        >
          CNT
        </Text>
      </View> */}
    </View>
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
  txt10: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  newView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginRight: 10,
  },
  titleDashboardContainer: {
    paddingVertical: 5,
    backgroundColor: Colors.LIGHT_GRAY,
    marginBottom: 10,
    paddingHorizontal: 45,
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
