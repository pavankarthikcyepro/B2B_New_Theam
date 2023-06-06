import React, { useEffect, useRef, useState, useMemo } from "react";
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
import { Colors } from "../../../../styles";
import { LoaderComponent } from "../../../../components";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import * as AsyncStore from "../../../../asyncStore";
import { ScrollView } from "react-native-gesture-handler";

import {
  delegateTask,
  getCRMDataV2,
  getEmployeesList,
  getNewTargetParametersAllData,
  getReceptionistData,
  getReceptionistDataV2,
  getReportingManagerList,
  getTotalOftheTeam,
  getTotalTargetParametersData,
  getUserWiseTargetParameters,
  updateEmployeeDataBasedOnDelegate,
  updateLoader,
} from "../../../../redux/homeReducer";
import { RenderGrandTotal } from "./components/RenderGrandTotal";
import { RenderEmployeeParameters } from "./components/RenderEmployeeParameters";
import { RenderSelfInsights } from "./components/RenderSelfInsights";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AppNavigator } from "../../../../navigations";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import PercentageToggleControl from "./components/EmployeeView/PercentageToggleControl";
import { IconButton } from "react-native-paper";
import { client } from "../../../../networking/client";
import URL from "../../../../networking/endpoints";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TextTicker from "react-native-text-ticker";
import AnimLoaderComp from "../../../../components/AnimLoaderComp";
import { isArrayBufferView } from "util/types";
import _, { isEmpty } from "lodash";
import Lottie from "lottie-react-native";

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

const receptionistRole = ["Reception", "CRM", "Tele Caller", "CRE"];
const receptionistRoleV2 = ["Reception", "Tele Caller", "CRE"];
const CRMRole = ["CRM"];
const TargetScreenCRM = ({ route }) => {
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
  const [filterExapand, setfilterExapand] = useState(false);
  const [tempLevel2, setTempLevel2] = useState([]);
  const [receptionistVol2AlluserData, setReceptionistVol2AlluserData] = useState([])
  const [receptionistVol2Level0, setReceptionistVol2Level0] = useState([])
  const [receptionistVol2Level1, setReceptionistVol2Level1] = useState([])
  const [crmVol2Level0, setCrmVol2Level0] = useState([])
  const [crmVol2Level1, setCrmVol2Level1] = useState([])
  const [crmVol2AlluserData, setCrmVol2AlluserData] = useState([])
  // const [crmVol2ReportingData, setCrmVol2ReportingData] =useState(datav2.reportingUser)
  const [crmVol2ReportingData, setCrmVol2ReportingData] = useState([])
  const [crmVol2ReportingAllTree, setCrmVol2ReportingAllTree] = useState([])
  const [crmVol2ReportingLevel1, setCrmVol2ReportingLevel1] = useState([])
  const [isViewExpandedCRMReporting, setIsViewExpandedCRMReporting] = useState(false);
  const [crmVol2NonReportingData, setCrmVol2NonReportingData] = useState([])

  const [userData, setUserData] = useState({
    empId: 0,
    empName: "",
    hrmsRole: "",
    orgId: 0,
    branchs: [],
  });
  const [isParentClicked, setisParentClicked] = useState(false);
  const [teamLoader, setTeamLoader] = useState(false);
  const [teamMember, setTeamMember] = useState("");
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

  const data2 = [
    {
      empName: "pallavi sanjay ",
      id: 1,
      isOpen: true,
      children: [
        {
          empName: "Nivedithas",
          isOpen: true,
          id: 11,
          parentId: 1,
          children: [
            {
              empName: "cheten",
              id: 111,
              isOpen: false,
              // children: [],
            },
          ],
        },
        {
          empName: "kartika",
          isOpen: true,
          parentId: 1,
          id: 22,
          children: [
            {
              empName: "cheten",
              id: 222,
              isOpen: false,
              // children: [],
            },
          ],
        },

        {
          empName: "cheten",
          id: 33,
          parentId: 1,
          isOpen: false,
          // children: [],
        },
      ],
    },

    {
      empName: "Node 2",
      isOpen: true,
      id: 2,
      children: [
        {
          empName: "Nivedithas",
          isOpen: true,
          id: 12,
          parentId: 2,
          children: [
            {
              empName: "cheten",
              id: 121,
              isOpen: false,
              // children: [],
            },
          ],
        },
        {
          empName: "kartika",
          isOpen: true,
          parentId: 2,
          id: 22,
          children: [
            {
              empName: "cheten",
              id: 222,
              isOpen: false,
              // children: [],
            },
          ],
        },

        {
          empName: "cheten",
          id: 33,
          parentId: 2,
          isOpen: false,
          // children: [],
        },
      ],
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
            ]).then(() => {});
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
      setTimeout(() => {
        dispatch(updateLoader(false));
      }, 500);
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
      if (jsonObj.hrmsRole == "CRM") {
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
    // if (selector.isTeam) {
      setToggleParamsIndex(0);
      // let data =
      //   userData.hrmsRole == "CRM" ? [...crmMetaData] : [...paramsMetadata];
      
      //  let data =
      //    receptionistRole.includes(userData.hrmsRole) ? [...crmMetaData] : [...paramsMetadata];
    let data = [...crmMetaData];
      data = data.filter((x) => x.toggleIndex === 0);
      setToggleParamsMetaData([...data]);
    // }
  }, [selector.isTeam]);


  

  useEffect(() => {
    if (
      selector.receptionistData?.fullResponse &&
      _.isEmpty(selector.saveCRMfilterObj.selectedempId)
    ) {
      let data = selector.receptionistData.fullResponse?.manager;
      if (data?.length > 0) {
        let otherUserData;
        otherUserData = data.filter((item) => {
          return item.emp_id !== userData.empId;
        });
        let consultantDataForCRM = data.filter((item) => {
          return item.emp_id === userData.empId;
        });

        if (consultantDataForCRM.length > 0) {
          consultantDataForCRM.map((item) => {
            item.salesconsultant.forEach((element) => {
              if (element.emp_id !== userData.empId) {
                otherUserData.unshift(element);
              }
            });
          });
        }

        setSecondLevelCRMdata([...otherUserData]);
      }

      let tempArr = [];
      let tempArrSelf = selector.receptionistData.fullResponse.CRE?.map(
        (item) => item
      );

      let firstLevelDataLevel2 =
        selector.receptionistData.fullResponse.CRE?.map((item, index) => {
          let firstLevel = item.salesconsultant?.filter(
            (item2) => item2.emp_id === item.emp_id
          );

          if (firstLevel?.length > 0) {
            // tempArr.push(firstLevel);
            Array.prototype.push.apply(tempArr, firstLevel);
          }
        });

      setCreFirstLevelData(tempArr);
      setCreFirstLevelSelfData(tempArrSelf);

      // let firstLevelDataLevel2 = selector.receptionistData.fullResponse.CRE.map(item => {

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

    if (selector.receptionistData) {
      let totalKey1 = selector?.receptionistData?.enquirysCount;
      let totalKey2 = selector?.receptionistData?.bookingsCount;
      let totalKey3 = selector?.receptionistData?.RetailCount;
      let totalKey4 = selector?.receptionistData?.totalLostCount;

      let total = [totalKey1, totalKey2, totalKey3, totalKey4];
      setTotalofTeam(total);
    }
  }, [selector.receptionistData]);

  useEffect(() => {

    // findDataFromObject(selector.receptionistDataV3.fullResponse);
    if (!_.isEmpty(selector.receptionistDataV3.fullResponse)){
      
      let modified = selector.receptionistDataV3?.fullResponse?.self?.allTreeData?.map(v => ({ ...v, isOpenInner: false,innerData:[] }))
      setReceptionistVol2AlluserData(modified);
      let tempFilterIds = selector.receptionistDataV3?.fullResponse?.self?.level1?.map((item) => item.empId)
      
      let tempArr = modified.filter((item) => tempFilterIds.includes(item.empId))


      setReceptionistVol2Level1(tempArr);
      setReceptionistVol2Level0([selector.receptionistDataV3.fullResponse.self.selfUser]);

      if (selector.receptionistDataV3) {
        let totalKey1 = selector?.receptionistDataV3?.enquirysCount;
        let totalKey2 = selector?.receptionistDataV3?.bookingsCount;
        let totalKey3 = selector?.receptionistDataV3?.RetailCount;
        let totalKey4 = selector?.receptionistDataV3?.totalLostCount;

        let total = [totalKey1, totalKey2, totalKey3, totalKey4];
        setTotalofTeam(total);
      }
    }
    setTimeout(() => {
      dispatch(updateLoader(false));
    }, 500);
     
  }, [selector.receptionistDataV3])

  useEffect(() => {

    // findDataFromObject(selector.receptionistDataV3.fullResponse);
    if (!_.isEmpty(selector.receptionistDataV3CRM?.fullResponse)) {
      
      let modified = selector.receptionistDataV3CRM?.fullResponse?.self?.allTreeData?.map(v => ({ ...v, isOpenInner: false, innerData: [] }))

      setCrmVol2AlluserData(modified);
      let tempFilterIds = selector.receptionistDataV3CRM?.fullResponse?.self?.level1?.map((item) => item.empId)

      let tempArr = modified.filter((item) => tempFilterIds.includes(item.empId))


      setCrmVol2Level1(tempArr);
      setCrmVol2Level0([selector.receptionistDataV3CRM.fullResponse.self.selfUser]);

      setCrmVol2ReportingData(selector.receptionistDataV3CRM.fullResponse.reportingUser)

      setCrmVol2NonReportingData(selector.receptionistDataV3CRM.fullResponse.nonReportingUser)
      

      if (selector.receptionistDataV3CRM) {
        let totalKey1 = selector?.receptionistDataV3CRM?.enquirysCount;
        let totalKey2 = selector?.receptionistDataV3CRM?.bookingsCount;
        let totalKey3 = selector?.receptionistDataV3CRM?.RetailCount;
        let totalKey4 = selector?.receptionistDataV3CRM?.totalLostCount;

        let total = [totalKey1, totalKey2, totalKey3, totalKey4];
        setTotalofTeam(total);
      }
    }

    setTimeout(() => {
      dispatch(updateLoader(false));
    }, 500);
   
  }, [selector.receptionistDataV3CRM])

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
  
  const formateReportingUserData = async (item, index,originalData,heirarchyLevel) => {

    // console.log("manthan {...selector.receptionistDataV3CRM.fullResponse} ", { ...selector.receptionistDataV3CRM.fullResponse });
    // let modifiedData =  [...crmVol2ReportingData];
    let modifiedData = _.cloneDeep(originalData);
    let id="";
    let data=[]; 
    let findLevel1Id = modifiedData.map((itemInner,indexInner) => { 
     
      if (itemInner.selfUser.empId == item.empId){
        id = itemInner.level1[0].empId;
        data = itemInner.allTreeData;
    }})
    setCrmVol2ReportingAllTree(data);
  
    let findInnderDataLevel1 = data.filter((item2, index2) =>  item2.empId == id);
    

    for (let index = 0; index < modifiedData.length; index++) {
      const element = modifiedData[index];
      if (element.selfUser.empId == item.empId) {
       
        element.selfUser.isOpenInner = !element.selfUser.isOpenInner;
        element.selfUser.innerData = findInnderDataLevel1;
      }else{
        element.selfUser.isOpenInner = false;
        element.selfUser.innerData = [];
      }
      
    }
    
    setCrmVol2ReportingData(modifiedData)
   

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

  const formateReportingUserDataForLevelN = async (item, index, originalData, heirarchyLevel) => {

  
    let modifiedData = _.cloneDeep(originalData);
    
    let filtrData = modifiedData.filter((itemInn) => itemInn.managerId != itemInn.empId && itemInn.managerId == item.empId)
  
    await item.isOpenInner ? (item.isOpenInner = false,
      item.innerData = []) : (item.isOpenInner = true, item.innerData.push(...filtrData))
    
    setCrmVol2ReportingData([...crmVol2ReportingData])


  }
  const findDataFromObject = (test)=>{
    const { self=[] } = test;

    const arrFromSelf = [];
    const nameWithLevelInit = [];
    const ValueWithLevelInit = [];

    Object.keys(self).forEach((key,index) => {
      // console.log("manthan ss ", index);
      if (key?.includes('level')) {
        // console.log("manthan ss ", key.at(index));
        nameWithLevelInit.push(key)
      }
    })
    Object.entries(self).forEach((key)=>{
      if (key[0].includes("level")){
       
        // ValueWithLevelInit.push(key[1]);
        
        // setTempLevel2()
      }
      
    })

    Object.values(self).forEach((key, item) => {
     
    })

    
    nameWithLevelInit.map((name) => arrFromSelf.push({ [name]: self[name] }))

    
  }

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
      setIsViewExpanded(false);
      setIsViewCreExpanded(false);
      setisShowSalesConsultant(false);
      setfilterExapand(false);
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
    if (selector.saveCRMfilterObj?.selectedempId) {
      CRMFilterApplied();
    }
  }, [selector.saveCRMfilterObj]);



  
  const oncllickOfEmployee = async(item = [],index,allData,herirarchyLevel)=>{

    let modifeidArray = [...receptionistVol2AlluserData];
    let storeTemp = [...receptionistVol2Level1];
    


    //   let temp = modifeidArray.map((itemLocal, indexLocal) =>
    //     index == indexLocal ?
    //       { ...itemLocal, isOpenInner: true } : { ...itemLocal, isOpenInner: false }
    //   )
    
    let tempNewArray = await modifeidArray.filter(i => i.managerId != i.empId && i.managerId == item.empId)
    
      
    await item.isOpenInner ? (item.isOpenInner = false,
    item.innerData = [] ):( item.isOpenInner = true, item.innerData.push(...tempNewArray))

    
     
   
   
    // Array.prototype.push.apply(storeTemp, tempNewArray)
    

   await setReceptionistVol2Level1(storeTemp);
    

  }

  const CRMFilterApplied = () => {
    if (userData.orgId > 0) {
      let payload = {
        orgId: userData.orgId,
        loggedInEmpId: selector.saveCRMfilterObj.selectedempId[0],
        startDate: selector.saveCRMfilterObj.startDate,
        endDate: selector.saveCRMfilterObj.endDate,
        dealerCodes: selector.saveCRMfilterObj.dealerCodes,
      };
      dispatch(getCRMDataV2(payload));
    }
  };

  const getReceptionManagerTeam = async (userData) => {
    try {
      let payload = {
        orgId: userData.orgId,
        loggedInEmpId: userData.empId,
      };
      // let payload = {
      //   orgId: userData.orgId,
      //   loggedInEmpId: selector.saveCRMfilterObj?.selectedempId[0] ? selector.saveCRMfilterObj?.selectedempId[0] : userData.empID ,
      // };
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
    setTeamMember(item.empName);
    let localData = [...allParameters];
    let current = lastParameter[index].isOpenInner;
    for (let i = 0; i < lastParameter.length; i++) {
      lastParameter[i].isOpenInner = false;
      if (i === lastParameter.length - 1) {
        lastParameter[index].isOpenInner = !current;
      }
    }
    if (!current) {
      setTeamLoader(true);
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
            setTeamLoader(false);
          }
        );
      }
    } else {
      setAllParameters([...localData]);
      setTeamLoader(false);
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

  
  function navigateToEmsVol2(leadidList){
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

  function navigateToEMS(
    params = "",
    screenName = "",
    selectedEmpId = [],
    isIgnore = false,
    parentId = "",
    istotalClick = false,
    isSelf
  ) {
    if (selector.saveCRMfilterObj?.selectedempId) {
      if (parentId) {
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
              ignoreSelectedId: isIgnore,
              parentId: parentId,
              istotalClick: false,
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
              ignoreSelectedId: isIgnore,
            },
          },
        });
      }
    } else if (isIgnore) {
      if (parentId) {
        if (istotalClick) {
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
                ignoreSelectedId: isIgnore,
                parentId: parentId,
                istotalClick: true,
                self: isSelf,
              },
            },
          });
        } else {
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
                ignoreSelectedId: isIgnore,
                parentId: parentId,
                istotalClick: false,
              },
            },
          });
        }
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
              selectedEmpId: selectedEmpId,
              startDate: "",
              endDate: "",
              dealerCodes: [],
              ignoreSelectedId: isIgnore,
            },
          },
        });
      }
    } else {
      navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
        screen: "EMS",
        params: {
          screen: "LEADS",
          params: {
            screenName: "TARGETSCREEN1",
            params: params,
            moduleType: "",
            employeeDetail: "",
            selectedEmpId: selectedEmpId,
            startDate: selector.receptionistFilterIds.startDate,
            endDate: selector.receptionistFilterIds.endDate,
            dealerCodes: selector.receptionistFilterIds.dealerCodes,
            ignoreSelectedId: false,
          },
        },
      });
    }
  }

  function navigateToDropLostCancel(params) {
    navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
      screen: "DROP_ANALYSIS",
      params: {
        emp_id: params,
        fromScreen: "targetScreen1",
        dealercodes: selector.receptionistFilterIds.dealerCodes,
      },
    });
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

  function navigateToDropAnalysis(
    params,
    isfromTree = false,
    parentId = "",
    isSelf = false
  ) {
    if (selector.saveCRMfilterObj.selectedempId) {
      navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
        screen: "DROP_ANALYSIS",
        params: {
          emp_id: params,
          fromScreen: "targetScreen1CRM",
          dealercodes: selector.saveCRMfilterObj.dealerCodes,
          isFilterApplied: true,
          parentId: parentId,
          isSelf: isSelf,
        },
      });
    } else {
      if (isfromTree) {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: {
            emp_id: params,
            fromScreen: "targetScreen1CRM",
            dealercodes: [],
            isFilterApplied: true,
            parentId: parentId,
            isSelf: isSelf,
          },
        });
      } else {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: {
            emp_id: params,
            fromScreen: "targetScreen1CRM",
            dealercodes: [],
            isFilterApplied: false,
            isSelf: isSelf,
          },
        });
      }
    }
  }

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
                if (selector.saveCRMfilterObj.selectedempId) {
                  item.id === 0
                    ? selector.receptionistDataV3CRM.enquirysCount > 0 &&
                    navigateToEmsVol2(selector.receptionistDataV3CRM.fullResponse.totalEnquiryLeads)
                    : item.id === 1
                      ? navigateToEmsVol2(selector.receptionistDataV3CRM.fullResponse.totalBookingLeads)
                      : item.id === 2
                        ? selector.receptionistDataV3CRM.RetailCount > 0 &&
                        navigateToEmsVol2(selector.receptionistDataV3CRM.fullResponse.totalRetailLeads)
                        : item.id === 3
                          ?      navigateToDropAnalysisVol2(selector.receptionistDataV3CRM.fullResponse.totalRetailLeads)
                          : null;
                } else {
                  item.id === 0
                    ? selector.receptionistDataV3CRM.enquirysCount > 0 &&
                    navigateToEmsVol2(selector.receptionistDataV3CRM.fullResponse.totalEnquiryLeads)
                    : item.id === 1
                      ? navigateToEmsVol2(selector.receptionistDataV3CRM.fullResponse.totalBookingLeads)
                      : item.id === 2
                        ? selector.receptionistDataV3CRM.RetailCount > 0 &&
                        navigateToEmsVol2(selector.receptionistDataV3CRM.fullResponse.totalRetailLeads)
                        : item.id === 3
                          ? navigateToDropAnalysisVol2(selector.receptionistDataV3CRM.fullResponse.totalLostLeads)
                          : null;
                }
              }
            }}
          >
            {item.id === 0 ? (
              <Text style={styles.txt10}>
                {" "}
                {selector.receptionistDataV3CRM.enquirysCount}{" "}
              </Text>
            ) : item.id === 1 ? (
              <Text style={styles.txt10}>
                {" "}
                  {selector.receptionistDataV3CRM.bookingsCount}{" "}
              </Text>
            ) : item.id === 2 ? (
              <Text style={styles.txt10}>
                {" "}
                    {selector.receptionistDataV3CRM.RetailCount}{" "}
              </Text>
            ) : item.id === 3 ? (
              <Text style={styles.txt10}>
                {" "}
                      {selector.receptionistDataV3CRM.totalLostCount}{" "}
              </Text>
            ) : (
              <Text style={styles.txt10}>0</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // vol1 working code for CRM dashbaord 
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
  //               if (selector.saveCRMfilterObj.selectedempId) {
  //                 item.id === 0
  //                   ? selector.receptionistData.enquirysCount > 0 &&
  //                     navigateToEMS("ENQUIRY", "", [userData.empId], true)
  //                   : item.id === 1
  //                   ? navigateToEMS("BOOKING", "", [userData.empId], true)
  //                   : item.id === 2
  //                   ? selector.receptionistData.RetailCount > 0 &&
  //                     navigateToEMS(
  //                       "INVOICECOMPLETED",
  //                       "",
  //                       [userData.empId],
  //                       true
  //                     )
  //                   : item.id === 3
  //                   ? navigateToDropAnalysis(
  //                       selector.saveCRMfilterObj.selectedempId[0]
  //                     )
  //                   : null;
  //               } else {
  //                 item.id === 0
  //                   ? selector.receptionistData.enquirysCount > 0 &&
  //                     navigateToEMS(
  //                       "ENQUIRY",
  //                       "",
  //                       [userData.empId],
  //                       true,
  //                       userData.empId,
  //                       true,
  //                       false
  //                     )
  //                   : item.id === 1
  //                   ? navigateToEMS(
  //                       "BOOKING",
  //                       "",
  //                       [userData.empId],
  //                       true,
  //                       userData.empId,
  //                       true,
  //                       false
  //                     )
  //                   : item.id === 2
  //                   ? selector.receptionistData.RetailCount > 0 &&
  //                     navigateToEMS(
  //                       "INVOICECOMPLETED",
  //                       "",
  //                       [userData.empId],
  //                       true,
  //                       userData.empId,
  //                       true,
  //                       false
  //                     )
  //                   : item.id === 3
  //                   ? navigateToDropAnalysis(userData.empId)
  //                   : null;
  //               }
  //             }
  //           }}
  //         >
  //           {item.id === 0 ? (
  //             <Text style={styles.txt10}>
  //               {" "}
  //               {selector.receptionistData.enquirysCount}{" "}
  //             </Text>
  //           ) : item.id === 1 ? (
  //             <Text style={styles.txt10}>
  //               {" "}
  //               {selector.receptionistData.bookingsCount}{" "}
  //             </Text>
  //           ) : item.id === 2 ? (
  //             <Text style={styles.txt10}>
  //               {" "}
  //               {selector.receptionistData.RetailCount}{" "}
  //             </Text>
  //           ) : item.id === 3 ? (
  //             <Text style={styles.txt10}>
  //               {" "}
  //               {selector.receptionistData.totalLostCount}{" "}
  //             </Text>
  //           ) : (
  //             <Text style={styles.txt10}>0</Text>
  //           )}
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // };

  const renderCRMTreeFilterApplied = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {selector.receptionistData.consultantList?.length > 0 &&
          selector.receptionistData.consultantList?.map((item, index) => {
            if (item.emp_id === selector.saveCRMfilterObj.selectedempId[0]) {
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
                        {"-   " + item.roleName}
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
                          if (filterExapand) {
                            handleSourceModalNavigation(
                              item,
                              selector.saveCRMfilterObj.selectedempId[0],
                              [item.emp_id]
                            );
                          } else {
                            navigation.navigate("RECEP_SOURCE_MODEL", {
                              empId: item?.emp_id,
                              headerTitle: item?.emp_name,
                              loggedInEmpId: item.emp_id,
                              type: "TEAM",
                              moduleType: "home",
                              headerTitle: "Source/Model",
                              orgId: userData.orgId,
                              role: userData.hrmsRole,
                              branchList: userData.branchs.map(
                                (a) => a.branchId
                              ),
                            });
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
                              : selector.receptionistData.enquirysCount || 0,
                            filterExapand
                              ? item.bookingCount
                              : selector.receptionistData.bookingsCount || 0,
                            filterExapand
                              ? item.retailCount
                              : selector.receptionistData.RetailCount || 0,
                            filterExapand
                              ? item.droppedCount
                              : selector.receptionistData.totalLostCount || 0,
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
                                          selector.saveCRMfilterObj
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
                                          selector.saveCRMfilterObj
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
                                          selector.saveCRMfilterObj
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
          })}
      </View>
    );
  };

  const renderCRMTreeFilterAppliedLevel2 = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {selector.receptionistData.consultantList?.length > 0 &&
          selector.receptionistData.consultantList?.map((item, index) => {
            if (item.emp_id !== selector.saveCRMfilterObj.selectedempId[0]) {
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
                            selector.saveCRMfilterObj.selectedempId[0],
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
                                        selector.saveCRMfilterObj
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
          })}
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
    ].salesconsultant.filter((item2) => item2.emp_id !== item.emp_id);
    setCreSecondLevelData(salesPeopleUnderCre);
  };

  const renderCREFirstLevel = () => {
    // todo manthan
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {creFirstLevelData.length > 0 &&
          creFirstLevelData.map((item, index) => {
            return (
              <View
                key={`${item.emp_name} ${index}`}
                style={{
                  borderColor:
                    isViewCREExpanded && index === creIndex ? Colors.RED : "",
                  borderWidth: isViewCREExpanded && index === creIndex ? 2 : 0,
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
                    {/* {selector.receptionistData?.fullResponse?.childUserCount > 0 && (
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
                            <Text>{selector.receptionistData?.fullResponse?.childUserCount}</Text>
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
                          isViewExpanded ? item.enquiryCount :  selector.receptionistData.enquirysCount || 0,
                          isViewExpanded ? item.bookingCount :  selector.receptionistData.bookingsCount || 0,
                          isViewExpanded ? item.retailCount  :  selector.receptionistData.RetailCount || 0,
                          isViewExpanded ? item.droppedCount :  selector.receptionistData.totalLostCount || 0,
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
                            ? creFirstLevelSelfData[index].enquiryCount
                            : 0 || 0,
                          isViewCREExpanded && index === creIndex
                            ? item.bookingCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].bookingCount
                            : 0 || 0,
                          isViewCREExpanded && index === creIndex
                            ? item.bookingCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].retailCount
                            : 0 || 0,
                          isViewCREExpanded && index === creIndex
                            ? item.droppedCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].droppedCount
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
    // todo manthan

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

  const formateFirstLevelData = (data) => {
    setStoreFirstLevelLocal(data);
    let findSelectedRecData = data?.salesconsultant?.filter(
      (item) => item.emp_id === data.emp_id
    );
    setStoreFirstLevelSelectedRecData(findSelectedRecData);
  };

  const renderCRMtNewTreeVol2 = () => {
    // todo manthan

    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmVol2Level0.length > 0 &&
          crmVol2Level0.map((item, index) => {

            // if (item.empId === userData.empId) {
            return (
              <View
                key={`${item.empName} ${index}`}
                style={{
                  borderRadius: 10,
                  borderWidth: isViewExpanded ? 2 : 0,
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
                        </Animated.View>
                      )}
                    <SourceModelView
                      onClick={() => {


                        if (!isViewExpanded) {

                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.total.retailLeads)
                          Array.prototype.push.apply(tempArry, item.total.lostLeads)


                          handleSourcrModelNavigationVol2(tempArry, item.roleName)
                        } else {
                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.self.retailLeads)
                          Array.prototype.push.apply(tempArry, item.self.lostLeads)

                          handleSourcrModelNavigationVol2(tempArry, item.roleName)
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
                        branchName={item.branchName}
                        color={"#C62159"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {
                          setIsViewExpanded(!isViewExpanded);
                          // formateFirstLevelData(item);
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
                          isViewExpanded ? item.self.enquiryCount : item.total.enquiryCount || 0,

                          isViewExpanded ? item.self.bookingCount : item.total.bookingCount || 0,
                          isViewExpanded ? item.self.retailCount : item.total.retailCount || 0,
                          isViewExpanded ? item.self.lostCount : item.total.lostCount || 0
                        ].map((e, indexss) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections logic  first level
                                if (e > 0) {


                                  if (isViewExpanded) {
                                    if (indexss === 0) {
                                      navigateToEmsVol2(item.self.enquiryLeads)

                                    } else if (indexss === 1) {
                                      navigateToEmsVol2(item.self.bookingLeads)
                                    } else if (indexss === 2) {
                                      navigateToEmsVol2(item.self.retailLeads)
                                    } else if (indexss === 3) {
                                      navigateToDropAnalysisVol2(item.self.lostLeads)
                                    }
                                  } else {
                                    if (indexss === 0) {
                                      navigateToEmsVol2(item.total.enquiryLeads)

                                    } else if (indexss === 1) {
                                      navigateToEmsVol2(item.total.bookingLeads)
                                    } else if (indexss === 2) {
                                      navigateToEmsVol2(item.total.retailLeads)
                                    } else if (indexss === 3) {
                                      // todo navigate to lost

                                      navigateToDropAnalysisVol2(item.total.lostLeads)
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
                {isViewExpanded && renderCRMNewTreeLevel1()}
              </View>
            );
            // }
          })}
        {/* {renderCREFirstLevel()} */}
        {renderCRMNonReportingUserTreeVol2()}
      </View>
    );
  };


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
                key={`${item.selfUser.empName} ${index}`}
                style={{
                  borderRadius: 10,
                  borderWidth: item.selfUser.isOpenInner ? 2 : 0,
                  borderColor: borderColor,
                  backgroundColor: "#FFFFFF",
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
                      {item.selfUser.empName}
                      {"  "}
                      {"-   " + item.selfUser?.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}></View>
                  <View style={{ flexDirection: "row" }}>
                    {/* {selector.receptionistData?.fullResponse?.childUserCount >
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
                      )} */}
                    <SourceModelView
                      onClick={() => {


                        if (!item.selfUser.isOpenInner) {

                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item.selfUser.total.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.total.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.total.retailLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.total.lostLeads)


                          handleSourcrModelNavigationVol2(tempArry, item.roleName)
                        } else {
                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item.selfUser.self.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.self.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.self.retailLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.self.lostLeads)

                          handleSourcrModelNavigationVol2(tempArry, item.selfUser.roleName)
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
                        item={item.selfUser}
                        branchName={item.selfUser.branchName}
                        color={borderColor}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {

                          formateNonReportingUserData(item.selfUser, index, crmVol2NonReportingData, 0);
                        }}
                        roleName={item.selfUser.roleName}
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
                          item.selfUser.isOpenInner ? item.selfUser.self.enquiryCount : item.selfUser.total.enquiryCount || 0,

                          item.selfUser.isOpenInner ? item.selfUser.self.bookingCount : item.selfUser.total.bookingCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.retailCount : item.selfUser.total.retailCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.lostCount : item.selfUser.total.lostCount || 0
                        ].map((e, indexss) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections logic  first level
                                if (e > 0) {


                                  if (item.selfUser.isOpenInner) {
                                    if (indexss === 0) {
                                      navigateToEmsVol2(item.selfUser.self.enquiryLeads)

                                    } else if (indexss === 1) {
                                      navigateToEmsVol2(item.selfUser.self.bookingLeads)
                                    } else if (indexss === 2) {
                                      navigateToEmsVol2(item.selfUser.self.retailLeads)
                                    } else if (indexss === 3) {
                                      navigateToDropAnalysisVol2(item.selfUser.self.lostLeads)
                                    }
                                  } else {
                                    if (indexss === 0) {
                                      navigateToEmsVol2(item.selfUser.total.enquiryLeads)

                                    } else if (indexss === 1) {
                                      navigateToEmsVol2(item.selfUser.total.bookingLeads)
                                    } else if (indexss === 2) {
                                      navigateToEmsVol2(item.selfUser.total.retailLeads)
                                    } else if (indexss === 3) {
                                      // todo navigate to lost

                                      navigateToDropAnalysisVol2(item.selfUser.total.lostLeads)
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
                {item.selfUser.isOpenInner && renderReportingUserTree(item.selfUser)}
              </View>
            );
            // }
          })}
        {/* {renderCREFirstLevel()} */}
      </View>
    );
  };
  

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
                key={`${item.selfUser.empName} ${index}`}
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
                      {item?.selfUser?.empName}
                      {"  "}
                      {"-   " + item?.selfUser?.roleName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 12, }}>
                    {item?.selfUser?.childCount >
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
                            item?.selfUser?.childCount
                            }
                          </Text>
                        </View>
                        // </Animated.View>
                      )}
                    <SourceModelView
                      onClick={() => {


                        if (!item.selfUser.isOpenInner) {

                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item.selfUser.total.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.total.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.total.retailLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.total.lostLeads)


                          handleSourcrModelNavigationVol2(tempArry, item.roleName)
                        } else {
                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, item.selfUser.self.enquiryLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.self.bookingLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.self.retailLeads)
                          Array.prototype.push.apply(tempArry, item.selfUser.self.lostLeads)

                          handleSourcrModelNavigationVol2(tempArry, item.selfUser.roleName)
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
                        item={item.selfUser}
                        branchName={item.selfUser.branchName}
                        color={borderColor}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {
                      
                          formateReportingUserData(item.selfUser, index, crmVol2ReportingData,0);
                        }}
                        roleName={item.selfUser.roleName}
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
                          item.selfUser.isOpenInner ? item.selfUser.self.enquiryCount : item.selfUser.total.enquiryCount || 0,

                          item.selfUser.isOpenInner ? item.selfUser.self.bookingCount : item.selfUser.total.bookingCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.retailCount : item.selfUser.total.retailCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.lostCount : item.selfUser.total.lostCount || 0
                        ].map((e, indexss) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections logic  first level
                                if (e > 0) {


                                  if (item.selfUser.isOpenInner) {
                                    if (indexss === 0) {
                                      navigateToEmsVol2(item.selfUser.self.enquiryLeads)

                                    } else if (indexss === 1) {
                                      navigateToEmsVol2(item.selfUser.self.bookingLeads)
                                    } else if (indexss === 2) {
                                      navigateToEmsVol2(item.selfUser.self.retailLeads)
                                    } else if (indexss === 3) {
                                      navigateToDropAnalysisVol2(item.selfUser.self.lostLeads)
                                    }
                                  } else {
                                    if (indexss === 0) {
                                      navigateToEmsVol2(item.selfUser.total.enquiryLeads)

                                    } else if (indexss === 1) {
                                      navigateToEmsVol2(item.selfUser.total.bookingLeads)
                                    } else if (indexss === 2) {
                                      navigateToEmsVol2(item.selfUser.total.retailLeads)
                                    } else if (indexss === 3) {
                                      // todo navigate to lost

                                      navigateToDropAnalysisVol2(item.selfUser.total.lostLeads)
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
                {item.selfUser.isOpenInner && renderReportingUserTree(item.selfUser)}
              </View>
            );
            // }
          })}
        {/* {renderCREFirstLevel()} */}
      </View>
    );
  };

  const renderReceptionistNewTree = () => {
    // todo manthan
    
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {receptionistVol2Level0?.length > 0 &&
          receptionistVol2Level0?.map((item, index) => {
           
            // if (item.empId === userData.empId) {
              return (
                <View
                  key={`${item.empName} ${index}`}
                  style={{
                    borderRadius: 10,
                    borderWidth: isViewExpanded? 2: 0,
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
                              // marginBottom: 5,
                              alignSelf: "center",
                              marginLeft: 7,
                              transform: [{ translateX: translation }],
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
                           </Animated.View>
                        )}
                      <SourceModelView
                        onClick={() => {


                          if (!isViewExpanded) {

                            let tempArry = [];
                            Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                            Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                            Array.prototype.push.apply(tempArry, item.total.retailLeads)
                            Array.prototype.push.apply(tempArry, item.total.lostLeads)


                            handleSourcrModelNavigationVol2(tempArry, item.roleName)
                          } else {
                            let tempArry = [];
                            Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                            Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                            Array.prototype.push.apply(tempArry, item.self.retailLeads)
                            Array.prototype.push.apply(tempArry, item.self.lostLeads)

                            handleSourcrModelNavigationVol2(tempArry, item.roleName)
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
                          branchName={item.branchName}
                          color={"#C62159"}
                          receptionManager={true}
                          navigation={navigation}
                          titleClick={async (e) => {
                            setIsViewExpanded(!isViewExpanded);
                            formateFirstLevelData(item);
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
                          isViewExpanded ? item.enquiryCount :  selector.receptionistData.enquirysCount || 0,
                          isViewExpanded ? item.bookingCount :  selector.receptionistData.bookingsCount || 0,
                          isViewExpanded ? item.retailCount  :  selector.receptionistData.RetailCount || 0,
                          isViewExpanded ? item.droppedCount :  selector.receptionistData.totalLostCount || 0,
                        ] */}

                          {/* {[
                            isViewExpanded && storeFirstLevelSelectedRecData
                              ? storeFirstLevelSelectedRecData[0].enquiryCount
                              : selector.receptionistData?.fullResponse
                                ?.managerEnquiryCount || 0,
                            isViewExpanded && storeFirstLevelSelectedRecData
                              ? storeFirstLevelSelectedRecData[0].bookingCount
                              : selector.receptionistData?.fullResponse
                                ?.managerBookingCount || 0,
                            isViewExpanded && storeFirstLevelSelectedRecData
                              ? storeFirstLevelSelectedRecData[0].retailCount
                              : selector.receptionistData?.fullResponse
                                ?.managerRetailCount || 0,
                            isViewExpanded && storeFirstLevelSelectedRecData
                              ? storeFirstLevelSelectedRecData[0].droppedCount
                              : selector.receptionistData?.fullResponse
                                ?.managerLostCount || 0,
                          ].map((e, indexss) => { */}
                          {[
                            isViewExpanded ? item.self.enquiryCount : item.total.enquiryCount || 0,
                            
                            isViewExpanded ? item.self.bookingCount : item.total.bookingCount || 0,
                            isViewExpanded ? item.self.retailCount : item.total.retailCount || 0,
                            isViewExpanded ? item.self.lostCount : item.total.lostCount || 0
                          ].map((e, indexss) => {
                            return (
                              <Pressable
                                onPress={() => {
                                  // todo redirections logic  first level
                                  if (e > 0) {

                                    
                                  if (isViewExpanded) {
                                    if (indexss === 0) {
                                      navigateToEmsVol2(item.self.enquiryLeads)

                                    } else if (indexss === 1) {
                                      navigateToEmsVol2(item.self.bookingLeads)
                                    } else if (indexss === 2) {
                                      navigateToEmsVol2(item.self.retailLeads)
                                    } else if (indexss === 3) {
                                      navigateToDropAnalysisVol2(item.self.lostLeads)
                                    }
                                  } else {
                                    if (indexss === 0) {
                                      navigateToEmsVol2(item.total.enquiryLeads)

                                    } else if (indexss === 1) {
                                      navigateToEmsVol2(item.total.bookingLeads)
                                    } else if (indexss === 2) {
                                      navigateToEmsVol2(item.total.retailLeads)
                                    } else if (indexss === 3) {
                                      // todo navigate to lost

                                      navigateToDropAnalysisVol2(item.total.lostLeads)
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
                  {isViewExpanded && renderReceptionistNewTreeLevel1()}
                </View>
              );
            // }
          })}
        {/* {renderCREFirstLevel()} */}
      </View>
    );
  };

  const renderCRMNewTreeLevel1 = () => {
    // todo manthan

    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmVol2Level1.length > 0 &&
          crmVol2Level1.map((item, index) => {
            return renderDynamicTree(item, index, receptionistVol2Level1,
              color,
              0)

          })}
        {renderCRMReportingUserTreeVol2()}
      </View>
    );
  };

  const renderReportingUserTree = (item)=>{
 
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
  const renderReceptionistNewTreeLevel1 = () => {
    // todo manthan

    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {receptionistVol2Level1.length > 0 &&
          receptionistVol2Level1.map((item, index) => {
            return renderDynamicTree(item, index, receptionistVol2Level1,
              color,
              0)
          
          })}
        {/* {renderCREFirstLevel()} */}
      </View>
    );
  };

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
                </Animated.View>
              )}
            <SourceModelView
              onClick={() => {
                if (!item.isOpenInner) {

                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.total.retailLeads)
                  Array.prototype.push.apply(tempArry, item.total.lostLeads)


                  handleSourcrModelNavigationVol2(tempArry, item.roleName)
                } else {
                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.self.retailLeads)
                  Array.prototype.push.apply(tempArry, item.self.lostLeads)

                  handleSourcrModelNavigationVol2(tempArry, item.roleName)
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
            // item.isOpenInner && {
            //   borderRadius: 10,
            //   borderWidth: 2,
            //   borderColor: "#C62159",
            //   marginHorizontal: 6,
            //   overflow: "hidden",
            // },
          ]}
        >
          {/*RIGHT SIDE VIEW*/}
          <View style={[styles.view6]}>
            <View style={styles.view7}>
              <RenderLevel1NameViewCRM
                level={0}
                item={item}
                branchName={item.branchName}
                color={borderColor}
                receptionManager={true}
                navigation={navigation}
                titleClick={async (e) => {
                 
                  formateReportingUserDataForLevelN(item, index, crmVol2ReportingAllTree, hierarchyLevel)
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
                  item.isOpenInner ? item.self.enquiryCount : item.total.enquiryCount || 0,

                  item.isOpenInner ? item.self.bookingCount : item.total.bookingCount || 0,
                  item.isOpenInner ? item.self.retailCount : item.total.retailCount || 0,
                  item.isOpenInner ? item.self.lostCount : item.total.lostCount || 0
                ].map((e, indexss) => {
                  return (
                    <Pressable
                      onPress={() => {
                        // todo redirections logic  first level
                        // if (e > 0) {

                        if (item.isOpenInner) {
                          if (indexss === 0) {
                            navigateToEmsVol2(item.self.enquiryLeads)

                          } else if (indexss === 1) {
                            navigateToEmsVol2(item.self.bookingLeads)
                          } else if (indexss === 2) {
                            navigateToEmsVol2(item.self.retailLeads)
                          } else if (indexss === 3) {
                            navigateToDropAnalysisVol2(item.self.lostLeads)
                          }
                        } else {
                          if (indexss === 0) {
                            navigateToEmsVol2(item.total.enquiryLeads)

                          } else if (indexss === 1) {
                            navigateToEmsVol2(item.total.bookingLeads)
                          } else if (indexss === 2) {
                            navigateToEmsVol2(item.total.retailLeads)
                          } else if (indexss === 3) {
                            // todo navigate to lost

                            navigateToDropAnalysisVol2(item.total.lostLeads)

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


  const renderDynamicTree = (item, index,allData, levelColors, newLevel)=>{
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
            <Pressable
              style={{ alignSelf: "center" }}
              onPress={() => {
                if (!item.isOpenInner) {

                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.total.retailLeads)
                  Array.prototype.push.apply(tempArry, item.total.lostLeads)


                  handleSourcrModelNavigationVol2(tempArry, item.roleName)
                } else {
                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.self.retailLeads)
                  Array.prototype.push.apply(tempArry, item.self.lostLeads)

                  handleSourcrModelNavigationVol2(tempArry, item.roleName)
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
        <View
          style={[
            { flexDirection: "row" },
            // item.isOpenInner && {
            //   borderRadius: 10,
            //   borderWidth: 2,
            //   borderColor: "#C62159",
            //   marginHorizontal: 6,
            //   overflow: "hidden",
            // },
          ]}
        >
          {/*RIGHT SIDE VIEW*/}
          <View style={[styles.view6]}>
            <View style={styles.view7}>
              <RenderLevel1NameViewCRM
                level={0}
                item={item}
                branchName={item.branchName}
                color={borderColor}
                receptionManager={true}
                navigation={navigation}
                titleClick={async (e) => {
                  // setIsViewExpanded(!isViewExpanded);
                  if(userData.hrmsRole == "CRM"){
                    oncllickOfEmployeeForCRm(item, index, allData, newLevel);
                  }else{
                    oncllickOfEmployee(item, index, allData, newLevel);
                  }
                  
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
                  item.isOpenInner ? item.self.enquiryCount : item.total.enquiryCount || 0,

                  item.isOpenInner ? item.self.bookingCount : item.total.bookingCount || 0,
                  item.isOpenInner ? item.self.retailCount : item.total.retailCount || 0,
                  item.isOpenInner ? item.self.lostCount : item.total.lostCount || 0
                ].map((e, indexss) => {
                  return (
                    <Pressable
                      onPress={() => {
                        // todo redirections logic  first level
                        // if (e > 0) {

                        if (item.isOpenInner) {
                          if (indexss === 0) {
                            navigateToEmsVol2(item.self.enquiryLeads)
                            
                          } else if (indexss === 1) {
                            navigateToEmsVol2(item.self.bookingLeads)
                          } else if (indexss === 2) {
                            navigateToEmsVol2(item.self.retailLeads)
                          } else if (indexss === 3) {
                            navigateToDropAnalysisVol2(item.self.lostLeads)
                          }
                        } else {
                          if (indexss === 0) {
                            navigateToEmsVol2(item.total.enquiryLeads)

                          } else if (indexss === 1) {
                            navigateToEmsVol2(item.total.bookingLeads)
                          } else if (indexss === 2) {
                            navigateToEmsVol2(item.total.retailLeads)
                          } else if (indexss === 3) {
                            // todo navigate to lost

                            navigateToDropAnalysisVol2(item.total.lostLeads)
                            
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


  const renderCRMTree = () => {
    // todo manthan
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {selector.receptionistData.consultantList?.length > 0 &&
          selector.receptionistData.consultantList?.map((item, index) => {
            if (item.emp_id === userData.empId) {
              return (
                <View
                  key={`${item.emp_name} ${index}`}
                  style={{
                    borderColor: isViewExpanded ? "#C62159" : "",
                    borderWidth: isViewExpanded ? 2 : 0,
                    borderRadius: 10,
                    margin: isViewExpanded ? 10 : 0,
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
                            setIsViewExpanded(!isViewExpanded);
                            formateFirstLevelData(item);
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
                          isViewExpanded ? item.enquiryCount :  selector.receptionistData.enquirysCount || 0,
                          isViewExpanded ? item.bookingCount :  selector.receptionistData.bookingsCount || 0,
                          isViewExpanded ? item.retailCount  :  selector.receptionistData.RetailCount || 0,
                          isViewExpanded ? item.droppedCount :  selector.receptionistData.totalLostCount || 0,
                        ] */}

                          {[
                            isViewExpanded && storeFirstLevelSelectedRecData
                              ? storeFirstLevelSelectedRecData[0].enquiryCount
                              : selector.receptionistData?.fullResponse
                                  ?.managerEnquiryCount || 0,
                            isViewExpanded && storeFirstLevelSelectedRecData
                              ? storeFirstLevelSelectedRecData[0].bookingCount
                              : selector.receptionistData?.fullResponse
                                  ?.managerBookingCount || 0,
                            isViewExpanded && storeFirstLevelSelectedRecData
                              ? storeFirstLevelSelectedRecData[0].retailCount
                              : selector.receptionistData?.fullResponse
                                  ?.managerRetailCount || 0,
                            isViewExpanded && storeFirstLevelSelectedRecData
                              ? storeFirstLevelSelectedRecData[0].droppedCount
                              : selector.receptionistData?.fullResponse
                                  ?.managerLostCount || 0,
                          ].map((e, indexss) => {
                            return (
                              <Pressable
                                onPress={() => {
                                  // todo redirections logic  first level
                                  // if (e > 0) {

                                  if (!isViewExpanded) {
                                    if (indexss === 0) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [item.emp_id],
                                        true,
                                        userData.empId,
                                        true,
                                        true
                                      );
                                    } else if (indexss === 1) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [item.emp_id],
                                        true,
                                        userData.empId,
                                        true,
                                        true
                                      );
                                    } else if (indexss === 2) {
                                      navigateToEMS(
                                        "INVOICECOMPLETED",
                                        "",
                                        [item.emp_id],
                                        true,
                                        userData.empId,
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
                  {isViewExpanded && renderCRMTreeChild()}
                </View>
              );
            }
          })}
        {renderCREFirstLevel()}
      </View>
    );
  };

  const renderCRMTreeChild = () => {
    // todo manthan

    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {secondLevelCRMdata.length > 0 &&
          secondLevelCRMdata.map((item, index) => {
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
                    isShowSalesConsultant && indexLocal === index ? 2 : 0,
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
                        color={
                          item.roleName.toLowerCase() === "field dse"
                            ? "#2C97DE"
                            : "#FF4040"
                        }
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
    // todo manthan

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

  const handleSourcrModelNavigationVol2 = (listIdList, roleName)=>{

    navigation.navigate("RECEP_SOURCE_MODEL", {
      // empId: parentId ? parentId : item?.emp_id,
      // headerTitle: item?.emp_name,
      // loggedInEmpId: parentId ? parentId : item.emp_id,
      type: "TEAM",
      moduleType: "home",
      headerTitle: "Source/Model",
      orgId: userData.orgId,
      role: roleName,
      leadId_list: listIdList
      // branchList: userData.branchs.map((a) => a.branchId),
      // empList: empList,
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
        navigation.navigate("RECEP_SOURCE_MODEL", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "home",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: item.roleName,
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
        });
        break;
      case "cre":
        navigation.navigate("RECEP_SOURCE_MODEL", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "home",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: item.roleName,
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
        });
        break;
      case "field dse":
        navigation.navigate("RECEP_SOURCE_MODEL", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "home",
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
        navigation.navigate("RECEP_SOURCE_MODEL", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "home",
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

  return (
    <React.Fragment>
      {!selector.isLoading ? (
        <ScrollView style={styles.container}>
          {CRMRole.includes(userData.hrmsRole) ? (
            selector.isTeam ?
             (
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
                    contentContainerStyle={{
                      paddingRight: 0,
                      flexDirection: "column",
                    }}
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
                          style={{ width: 100, height: 20, marginRight: 5,alignItems:"center" }}
                        >
                          <Text style={{
                            fontSize:12,
                            color:Colors.RED,
                            fontWeight:"600",
                            alignSelf:"center",
                            textAlign:"center",

                            marginTop:6
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
                      {/* <View
                    
                      > */}

                        {/* vol 2 tree code start */}
                          {renderCRMtNewTreeVol2()}
                        {/* vol 2 tree code end */}

                        {/* vol 1 tree code start */}
                      {/* {!selector.saveCRMfilterObj.selectedempId
                        ? renderCRMTree()
                        : renderCRMTreeFilterApplied()} */}
                        {/* vol 1 tree code  end*/}
                      {/* {renderCREFirstLevel()} */}

                      {/* </View> */}
                    </View>
                    {/* Grand Total Section */}
                    {totalOfTeam && (
                      <View
                        style={{
                          width: Dimensions.get("screen").width - 35,
                          marginTop: 20,
                          marginBottom: 20,
                        }}
                      >
                        <View style={{ alignItems: "flex-end" }}>
                          <SourceModelView
                            onClick={() => {
                              
                                let tempArry = [];
                                Array.prototype.push.apply(tempArry, selector.receptionistDataV3CRM?.fullResponse?.totalEnquiryLeads)
                                Array.prototype.push.apply(tempArry, selector.receptionistDataV3CRM?.fullResponse?.totalBookingLeads)
                                Array.prototype.push.apply(tempArry, selector.receptionistDataV3CRM?.fullResponse?.totalRetailLeads)
                                Array.prototype.push.apply(tempArry, selector.receptionistDataV3CRM?.fullResponse?.totalLostLeads)
                                console.log("manthan jjjd ",tempArry);
                                handleSourcrModelNavigationVol2(tempArry, userData.hrmsRole)
                              

                             
                              // navigation.navigate("RECEP_SOURCE_MODEL", {
                              //   empId: userData.empId,
                              //   headerTitle: "Source/Model",
                              //   loggedInEmpId: userData.empId,
                              //   orgId: userData.orgId,
                              //   role: userData.hrmsRole,
                              // });
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
          ) : <View>
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
                contentContainerStyle={{
                  paddingRight: 0,
                  flexDirection: "column",
                }}
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
                          style={{ width: 100, height: 20, marginRight: 5,alignItems:"center" }}
                        >
                          <Text style={{
                            fontSize:12,
                            color:Colors.RED,
                            fontWeight:"600",
                            alignSelf:"center",
                            textAlign:"center",

                            marginTop:6
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
                  {/* <View
                    
                      > */}

                  {/* vol 2 tree code start */}
                  {renderReceptionistNewTree()}
                  {/* vol 2 tree code end */}

                  {/* vol 1 tree code start */}
                  {/* {!selector.saveCRMfilterObj.selectedempId
                        ? renderCRMTree()
                        : renderCRMTreeFilterApplied()} */}
                  {/* vol 1 tree code  end*/}
                  {/* {renderCREFirstLevel()} */}

                  {/* </View> */}
                </View>
                {/* Grand Total Section */}
                {totalOfTeam && (
                  <View
                    style={{
                      width: Dimensions.get("screen").width - 35,
                      marginTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    <View style={{ alignItems: "flex-end" }}>
                      <SourceModelView
                        onClick={() => {
                          let tempArry = [];
                          Array.prototype.push.apply(tempArry, selector.receptionistDataV3?.fullResponse?.totalEnquiryLeads)
                          Array.prototype.push.apply(tempArry, selector.receptionistDataV3?.fullResponse?.totalBookingLeads)
                          Array.prototype.push.apply(tempArry, selector.receptionistDataV3?.fullResponse?.totalRetailLeads)
                          Array.prototype.push.apply(tempArry, selector.receptionistDataV3?.fullResponse?.totalLostLeads)
                          handleSourcrModelNavigationVol2(tempArry, userData.hrmsRole)
                          // navigation.navigate("RECEP_SOURCE_MODEL", {
                          //   empId: userData.empId,
                          //   headerTitle: "Source/Model",
                          //   loggedInEmpId: userData.empId,
                          //   orgId: userData.orgId,
                          //   role: userData.hrmsRole,
                          // });
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
          </View>}

          {/* {selector.filterIds?.employeeName?.length > 0 && <View
            style={{
              width: "100%",
              height: 25,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextTicker
              duration={10000}
              loop={true}
              bounce={false}
              repeatSpacer={50}
              marqueeDelay={0}
              style={{
                marginBottom: 0,
              }}
            >
              {selector.filterIds?.employeeName?.length > 0 &&
                selector.filterIds?.employeeName?.map((e) => {
                  return (
                    <Text style={{ padding: 2, color: Colors.RED }}>{e+", "}</Text>
                  );
                })}
            </TextTicker>
          </View>} */}
          {selector.isTeam && !receptionistRole.includes(userData.hrmsRole) ? (
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
                <AnimLoaderComp visible={true} />
              ) : (
                <ScrollView
                  contentContainerStyle={styles.scrollview}
                  horizontal={true}
                  directionalLockEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  ref={scrollViewRef}
                  onContentSizeChange={(contentWidth, contentHeight) => {
                    scrollViewRef?.current?.scrollTo({ y: 0, animated: true });
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
                      style={{ height: Dimensions.get("screen").height / 3 }}
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
                                      {item.empName}
                                      {/* {item?.childCount > 1 ? "  |" : ""} */}
                                    </Text>
                                  </View>
                                  <View style={{ flexDirection: "row" }}>
                                    {item?.childCount > 0 && (
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
                                          AppNavigator.HomeStackIdentifiers
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
                                        stopLocation={true}
                                        teamLoader={teamLoader}
                                        teamMember={teamMember}
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
                                                    <View style={styles.view10}>
                                                      <Text
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
                                                        0 && (
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
                                                              .HomeStackIdentifiers
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
                                                      teamLoader={teamLoader}
                                                      teamMember={teamMember}
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
                                                              paddingTop: 4,
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
                                                                marginTop: 8,
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
                                                                0 && (
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
                                                              item={innerItem2}
                                                              color={"#2C97DE"}
                                                              navigation={
                                                                navigation
                                                              }
                                                              branchName={getBranchName(
                                                                innerItem2.branchId
                                                              )}
                                                              teamLoader={
                                                                teamLoader
                                                              }
                                                              teamMember={
                                                                teamMember
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
                                                                      style={[
                                                                        styles.view11,
                                                                        {
                                                                          width:
                                                                            Dimensions.get(
                                                                              "screen"
                                                                            )
                                                                              .width -
                                                                            (innerItem3.isOpenInner
                                                                              ? 53
                                                                              : 48),
                                                                        },
                                                                      ]}
                                                                    >
                                                                      <View
                                                                        style={{
                                                                          flexDirection:
                                                                            "row",
                                                                          marginTop: 8,
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
                                                                          0 && (
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
                                                                        teamLoader={
                                                                          teamLoader
                                                                        }
                                                                        teamMember={
                                                                          teamMember
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
                                                                                style={[
                                                                                  styles.view11,
                                                                                  {
                                                                                    width:
                                                                                      Dimensions.get(
                                                                                        "screen"
                                                                                      )
                                                                                        .width -
                                                                                      (innerItem4.isOpenInner
                                                                                        ? 59
                                                                                        : 55),
                                                                                  },
                                                                                ]}
                                                                              >
                                                                                <Text
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
                                                                                <View
                                                                                  style={{
                                                                                    flexDirection:
                                                                                      "row",
                                                                                  }}
                                                                                >
                                                                                  {innerItem4?.childCount >
                                                                                    0 && (
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
                                                                                            innerItem4?.childCount
                                                                                          }
                                                                                        </Text>
                                                                                      </View>
                                                                                    </Animated.View>
                                                                                  )}
                                                                                  <SourceModelView
                                                                                    onClick={() => {
                                                                                      navigation.navigate(
                                                                                        AppNavigator
                                                                                          .HomeStackIdentifiers
                                                                                          .sourceModel,
                                                                                        {
                                                                                          empId:
                                                                                            innerItem4.empId,
                                                                                          headerTitle:
                                                                                            innerItem4.empName,
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
                                                                                  teamLoader={
                                                                                    teamLoader
                                                                                  }
                                                                                  teamMember={
                                                                                    teamMember
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
                                                                                          style={[
                                                                                            styles.view11,
                                                                                            {
                                                                                              width:
                                                                                                Dimensions.get(
                                                                                                  "screen"
                                                                                                )
                                                                                                  .width -
                                                                                                (innerItem5.isOpenInner
                                                                                                  ? 65
                                                                                                  : 51),
                                                                                            },
                                                                                          ]}
                                                                                        >
                                                                                          <Text
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
                                                                                          <View
                                                                                            style={{
                                                                                              flexDirection:
                                                                                                "row",
                                                                                            }}
                                                                                          >
                                                                                            {innerItem5?.childCount >
                                                                                              0 && (
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
                                                                                                      innerItem5?.childCount
                                                                                                    }
                                                                                                  </Text>
                                                                                                </View>
                                                                                              </Animated.View>
                                                                                            )}
                                                                                            <SourceModelView
                                                                                              onClick={() => {
                                                                                                navigation.navigate(
                                                                                                  AppNavigator
                                                                                                    .HomeStackIdentifiers
                                                                                                    .sourceModel,
                                                                                                  {
                                                                                                    empId:
                                                                                                      innerItem5.empId,
                                                                                                    headerTitle:
                                                                                                      innerItem5.empName,
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
                                                                                            teamLoader={
                                                                                              teamLoader
                                                                                            }
                                                                                            teamMember={
                                                                                              teamMember
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
                                                                                                    style={[
                                                                                                      styles.view11,
                                                                                                      {
                                                                                                        width:
                                                                                                          Dimensions.get(
                                                                                                            "screen"
                                                                                                          )
                                                                                                            .width -
                                                                                                          (innerItem6.isOpenInner
                                                                                                            ? 71
                                                                                                            : 67),
                                                                                                      },
                                                                                                    ]}
                                                                                                  >
                                                                                                    <Text
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
                                                                                                    <SourceModelView
                                                                                                      onClick={() => {
                                                                                                        navigation.navigate(
                                                                                                          AppNavigator
                                                                                                            .HomeStackIdentifiers
                                                                                                            .sourceModel,
                                                                                                          {
                                                                                                            empId:
                                                                                                              innerItem6.empId,
                                                                                                            headerTitle:
                                                                                                              innerItem6.empName,
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
                                                                                                      teamLoader={
                                                                                                        teamLoader
                                                                                                      }
                                                                                                      teamMember={
                                                                                                        teamMember
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

                      <View style={styles.view12}>
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
                              <Text style={styles.txt7}>ACH</Text>
                            </View>

                            <View
                              style={{
                                height: 20,
                                justifyContent: "center",
                              }}
                            >
                              <Text style={styles.txt7}>TGT</Text>
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
                              totalParams={selector.totalParameters}
                              displayType={togglePercentage}
                              params={toggleParamsMetaData}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>
          ) : (
            // IF Self or insights
            !selector.isLoading &&
            // selfInsightsData.length > 0 && (
                 (
              <>
                {!receptionistRole.includes(userData.hrmsRole) && (
                  <View style={{ flexDirection: "row", marginVertical: 8 }}>
                    <View style={styles.view13}>
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
                        onClick={() => {
                          navigation.navigate(
                            AppNavigator.HomeStackIdentifiers.sourceModel,
                            {
                              empId: selector.login_employee_details.empId,
                              headerTitle: "Source/Model",
                              loggedInEmpId:
                                selector.login_employee_details.empId,
                              type: selector.isDSE ? "SELF" : "INSIGHTS",
                              moduleType: "home",
                            }
                          );
                        }}
                      />
                    </View>
                    <View style={{ width: "30%", flexDirection: "row" }}>
                      <Text style={styles.txt3}>Balance</Text>
                      <View style={{ marginRight: 15 }}></View>
                      <Text style={styles.txt3}>AR/Day</Text>
                    </View>
                  </View>
                )}
                <>
                  {receptionistRole.includes(userData.hrmsRole) &&
                  !selector.isTeam ? (
                    <>
                      {CRMRole.includes(userData.hrmsRole) && (
                        <View style={{ paddingHorizontal: "8%" }}>
                          <View style={styles.titleDashboardContainer}>
                            <Text style={styles.dashboardText}>Dashboard</Text>
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
                                Array.prototype.push.apply(tempArry, selector.receptionistDataV3CRM?.fullResponse?.totalEnquiryLeads)
                                Array.prototype.push.apply(tempArry, selector.receptionistDataV3CRM?.fullResponse?.totalBookingLeads)
                                Array.prototype.push.apply(tempArry, selector.receptionistDataV3CRM?.fullResponse?.totalRetailLeads)
                                Array.prototype.push.apply(tempArry, selector.receptionistDataV3CRM?.fullResponse?.totalLostLeads)
                                handleSourcrModelNavigationVol2(tempArry, userData.hrmsRole)
                                // navigation.navigate("RECEP_SOURCE_MODEL", {
                                //   empId: userData.empId,
                                //   headerTitle: "Source/Model",
                                //   loggedInEmpId: userData.empId,
                                //   orgId: userData.orgId,
                                //   role: userData.hrmsRole,
                                // });
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
                                ListFooterComponent={() => {
                                  return (<View style={{
                                    width: 300,
                                    height: 100,
                                    padding: 10,
                                    justifyContent: "center",
                                    marginVertical: 10,
                                    // marginStart:'8%'
                                  }}></View>)
                                }}
                          />
                        </View>
                      )}

                          {/* manthan old code receptions/tele/cre */}
                      {/* CRM exisiting code start */}
                      {/* {!CRMRole.includes(userData.hrmsRole) && (
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
                                });
                              }}
                            />
                          </View>
                          <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.recBoxContainer}>
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
                                      fontWeight: "500",
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
                                              item?.enquiryCount > 0 &&
                                                navigateToEMS("ENQUIRY", "", [
                                                  item.emp_id,
                                                ]);
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
                                                navigateToEMS("BOOKING", "", [
                                                  item.emp_id,
                                                ]);
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
                                                navigateToEMS(
                                                  "INVOICECOMPLETED",
                                                  "",
                                                  [item.emp_id]
                                                );
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
                                              navigateToDropLostCancel([
                                                item.emp_id,
                                              ]);
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
                                        if (
                                          selector.receptionistData
                                            .enquirysCount > 0
                                        ) {
                                          let empIdArry = [];
                                          const temp =
                                            selector.receptionistData.consultantList?.map(
                                              (item) => {
                                                empIdArry.push(item.emp_id);
                                              }
                                            );
                                          navigateToEMS(
                                            "ENQUIRY",
                                            "",
                                            empIdArry
                                          );
                                        }
                                      }}
                                      style={{
                                        padding: 2,
                                        textDecorationLine:
                                          selector.receptionistData
                                            .enquirysCount > 0
                                            ? "underline"
                                            : "none",
                                      }}
                                    >
                                      {selector.receptionistData.enquirysCount}
                                    </Text>
                                  </View>
                                  <View style={styles.view20}>
                                    <Text
                                      onPress={() => {
                                        if (
                                          selector.receptionistData
                                            .bookingsCount > 0
                                        ) {
                                          let empIdArry = [];
                                          const temp =
                                            selector.receptionistData.consultantList.map(
                                              (item) => {
                                                empIdArry.push(item.emp_id);
                                              }
                                            );
                                          navigateToEMS(
                                            "BOOKING",
                                            "",
                                            empIdArry
                                          );
                                        }
                                      }}
                                      style={{
                                        padding: 2,
                                        textDecorationLine:
                                          selector.receptionistData
                                            .bookingsCount > 0
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
                                        if (
                                          selector.receptionistData
                                            .RetailCount > 0
                                        ) {
                                          let empIdArry = [];
                                          const temp =
                                            selector.receptionistData.consultantList?.map(
                                              (item) => {
                                                empIdArry.push(item.emp_id);
                                              }
                                            );
                                          navigateToEMS(
                                            "INVOICECOMPLETED",
                                            "",
                                            empIdArry
                                          );
                                        }
                                      }}
                                      style={{
                                        padding: 2,
                                        textDecorationLine:
                                          selector.receptionistData
                                            .RetailCount > 0
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
                                        if (
                                          selector.receptionistData
                                            .totalLostCount > 0
                                        ) {
                                          let empIdArry = [];
                                          const temp =
                                            selector.receptionistData.consultantList?.map(
                                              (item) => {
                                                empIdArry.push(item.emp_id);
                                              }
                                            );
                                          navigateToDropLostCancel([
                                            ...empIdArry,
                                          ]);
                                        }
                                      }}
                                      style={{
                                        padding: 2,
                                        textDecorationLine:
                                          selector.receptionistData
                                            .totalLostCount > 0
                                            ? "underline"
                                            : "none",
                                      }}
                                    >
                                      {selector.receptionistData.totalLostCount}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View style={styles.view21}>
                              <View
                                style={{ ...styles.statWrap, width: "33%" }}
                              >
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
                              <View
                                style={{ ...styles.statWrap, width: "33%" }}
                              >
                                <Text style={styles.txt6}>B2R</Text>
                                {selector.receptionistData.bookingsCount !==
                                  null &&
                                selector.receptionistData.RetailCount !==
                                  null ? (
                                  <Text
                                    style={{
                                      color:
                                        Math.floor(
                                          (parseInt(
                                            selector.receptionistData
                                              .RetailCount
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
                                            selector.receptionistData
                                              .RetailCount
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
                              <View
                                style={{ ...styles.statWrap, width: "33%" }}
                              >
                                <Text style={styles.txt6}>E2R</Text>
                                {selector.receptionistData.enquirysCount !==
                                  null &&
                                selector.receptionistData.RetailCount !==
                                  null ? (
                                  <Text
                                    style={{
                                      color:
                                        Math.floor(
                                          (parseInt(
                                            selector.receptionistData
                                              .RetailCount
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
                                      selector.receptionistData.enquirysCount
                                    ) === 0 ||
                                    parseInt(
                                      selector.receptionistData.RetailCount
                                    ) === 0
                                      ? 0
                                      : Math.round(
                                          (parseInt(
                                            selector.receptionistData
                                              .RetailCount
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
                            </View>
                          </ScrollView>
                        </>
                      )} */}
                          {/* manthan old code receptions/tele/cre end */}
                      {/* CRM exisiting code end */}
                    </>
                  ) : null}
                </>
                {/* Header view end */}
                {!receptionistRole.includes(userData.hrmsRole) && (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <>
                      <View style={{ paddingRight: 10 }}>
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
                        {/* // todo here */}
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
                        justifyContent: "space-between",
                        marginHorizontal: 8,
                        marginTop: 16,
                      }}
                    >
                      <View style={{ flexGrow: 1 }}>
                        <View style={{ height: 4 }}></View>
                        <View style={styles.statWrap}>
                          <Text style={styles.txt5}>E2B</Text>
                          {bookingData !== null && enqData !== null ? (
                            <Text
                              style={{
                                color:
                                  Math.round(
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
                          <Text style={styles.txt6}>E2V</Text>
                          {enqData !== null && visitData !== null ? (
                            <Text
                              style={{
                                color:
                                  Math.round(
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
                          <Text style={styles.txt6}>FIN</Text>
                          {finData !== null && retailData !== null ? (
                            <Text
                              style={{
                                color:
                                  Math.round(
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
                          <Text style={styles.txt6}>B2R</Text>
                          {bookingData !== null && retailData !== null && (
                            <Text
                              style={{
                                color:
                                  Math.round(
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
                          <Text style={styles.txt6}>E2TD</Text>
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
                                : Math.round(
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
                          <Text style={styles.txt6}>INS</Text>
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
                                : Math.round(
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
                          <Text style={styles.txt6}>E2R</Text>
                          {retailData !== null && enqData !== null && (
                            <Text
                              style={{
                                color:
                                  Math.round(
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
                          <Text style={styles.txt6}>EXG</Text>
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
                                : Math.round(
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
                          <Text style={styles.txt6}>EXW</Text>
                          {exwData !== null && retailData !== null ? (
                            <Text
                              style={{
                                color:
                                  Math.round(
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
                        <Text style={styles.txt6}>Accessories/Car</Text>
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
                              : Math.round(
                                  parseInt(accData?.achievment) /
                                    parseInt(retailData?.achievment)
                                )}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={{ height: 20 }}></View>
                  </ScrollView>
                )}
              </>
            )
          )}
        </ScrollView>
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

export default TargetScreenCRM;

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
  stopLocation = false,
  teamLoader = false,
  teamMember = "",
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
        {teamLoader && teamMember === item?.empName ? (
          <View
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
          >
            <Lottie
              source={require("../../../../assets/Animations/lf20_qispmsyg.json")}
              autoPlay
              loop
            />
          </View>
        ) : (
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
        )}
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
            {item?.empName?.charAt(0)}
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

// vol 1 backup
// export const RenderLevel1NameViewCRM = ({
//   level,
//   item,
//   branchName = "",
//   color,
//   titleClick,
//   navigation,
//   disable = false,
//   receptionManager = false,
//   stopLocation = false,
// }) => {
//   return (
//     <View
//       style={{
//         width: 100,
//         justifyContent: "center",
//         textAlign: "center",
//         display: "flex",
//         flexDirection: "row",
//       }}
//     >
//       <View
//         style={{ width: 60, justifyContent: "center", alignItems: "center" }}
//       >
//         <TouchableOpacity
//           disabled={disable}
//           style={{
//             width: 30,
//             height: 30,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: color,
//             borderRadius: 20,
//             marginTop: 5,
//             marginBottom: 5,
//           }}
//           onPress={titleClick}
//         >
//           <Text
//             style={{
//               fontSize: 14,
//               color: "#fff",
//             }}
//           >
//             {item?.emp_name?.charAt(0)}
//           </Text>
//         </TouchableOpacity>
//         {/* {level === 0 && !!branchName && ( */}
//         {branchName ? (
//           <TouchableOpacity
//             disabled={stopLocation}
//             onPress={() => {
//               if (item.roleName !== "MD" && item.roleName !== "CEO") {
//                 navigation.navigate(
//                   AppNavigator.HomeStackIdentifiers.location,
//                   {
//                     empId: item.empId,
//                     orgId: item.orgId,
//                   }
//                 );
//               }
//             }}
//             style={{ flexDirection: "row", alignItems: "center" }}
//           >
//             <IconButton
//               icon="map-marker"
//               style={{ padding: 0, margin: 0 }}
//               color={Colors.RED}
//               size={8}
//             />
//             <Text style={{ fontSize: 8 }} numberOfLines={2}>
//               {branchName}
//             </Text>
//           </TouchableOpacity>
//         ) : null}
//         {/* )} */}
//       </View>
//       <View
//         style={{
//           width: "25%",
//           justifyContent: "space-around",
//           textAlign: "center",
//           alignItems: "center",
//           flex: 1,
//         }}
//       >
//         <Text style={{ fontSize: 10, fontWeight: "bold" }}>
//           {receptionManager ? "" : "ACH"}
//         </Text>
//         <Text style={{ fontSize: 10, fontWeight: "bold" }}>
//           {receptionManager ? "" : "TGT"}
//         </Text>
//       </View>
//     </View>
//   );
// };

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
    paddingTop: 4,
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
  recBoxContainer: {
    borderWidth: 1.5,
    borderColor: Colors.RED,
    borderRadius: 7,
    paddingBottom: 5,
    overflow: "hidden",
  },
  view15: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: Colors.BORDER_COLOR,
    paddingVertical: 10,
    marginRight: 1,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  txt4: {
    fontSize: 13,
    fontWeight: "500",
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
  scondView: {
    flexDirection: "column",
    marginHorizontal: 10,
  },
  txt10: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  titleDashboardContainer: {
    paddingVertical: 10,
    backgroundColor: Colors.LIGHT_GRAY,
    paddingHorizontal: 70,
    borderRadius: 50,
    alignSelf: "center",
  },
  dashboardText: {
    fontWeight: "600",
    fontSize: 20,
    color: Colors.PINK,
    textDecorationLine: "underline",
  },
  newView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginRight: 10,
  },
});
