import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LoaderComponent } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import * as AsyncStore from "../../../asyncStore";
import { ScrollView } from "react-native-gesture-handler";
import { Colors } from "../../../styles";

import {
  delegateTask,
  getCRM_ManagerLiveLeads,
  getCRM_Recp_LiveLeadsVol2,
  getCRM_Recp_LiveLeadsVol2_CRM_ROLE,
  getEmployeesList,
  getReportingManagerList,
  getTargetReceptionistData,
  getUserWiseTargetParameters,
} from "../../../redux/liveLeadsReducer";
import { useNavigation } from "@react-navigation/native";
import { Card, IconButton } from "react-native-paper";
import { RenderGrandTotal } from "../Home/TabScreens/components/RenderGrandTotal";
import { RenderEmployeeParameters } from "../Home/TabScreens/components/RenderEmployeeParameters";
import { AppNavigator } from "../../../navigations";
import {
  EmsTopTabNavigatorIdentifiers,
  EMSTopTabNavigatorTwo,
} from "../../../navigations/emsTopTabNavigator";
import URL from "../../../networking/endpoints";
import { client } from "../../../networking/client";
import AnimLoaderComp from "../../../components/AnimLoaderComp";
import _ from "lodash";
import Lottie from "lottie-react-native";

const receptionistRole = ["Reception", "Tele Caller", "CRE"];
const crmRole = ["CRM"];
const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 5;
const boxHeight = 35;
const ParametersScreen = ({ route }) => {
  const navigation = useNavigation();
  const selector = useSelector((state) => state.liveLeadsReducer);
  const dispatch = useDispatch();

  const [retailData, setRetailData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [enqData, setEnqData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [userData, setUserData] = useState({
    empId: 0,
    empName: "",
    hrmsRole: "",
    orgId: 0,
    branchs: [],
    isSelfManager: "N",
    orgName: "",
  });
  const [selfInsightsData, setSelfInsightsData] = useState([]);

  const [allParameters, setAllParameters] = useState([]);
  const [myParameters, setMyParameters] = useState([]);
  const [filterParameters, setFilterParameters] = useState([]);
  const [filterParametersApplied, setfilterParametersApplied] = useState(false);

  const [isFilterViewExapanded, setisFilterViewExapanded] = useState(false);
  const [CRM_filterParameters, setCRM_filterParameters] = useState([]);
  const [CRM_filterParametersSecondLevel, setCRM_filterParametersSecondLevel] =
    useState([]);
  const [crmFirstLevelData, setCrmFirstLevelData] = useState([]);
  const [crmFirstLevelTotalData, setCrmFirstLevelTotalData] = useState([]);
  const [creFirstLevelData, setCreFirstLevelData] = useState([]);
  const [creIndex, setcreIndex] = useState(false);
  const [creSecondLevelData, setCreSecondLevelData] = useState([]);
  const [creFirstLevelSelfData, setCreFirstLevelSelfData] = useState([]);
  const [crmSecondLevelData, setcrmSecondLevelData] = useState([]);
  const [crmThirdLevelData, setCrmThirdLevelData] = useState([]);
  const [storeSecondLevelLocal, setstoreSecondLevelLocal] = useState([]);
  const [crmSecondLevelSelectedData, setCrmSecondLevelSelectedData] = useState(
    []
  );
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const [isViewCREExpanded, setIsViewCreExpanded] = useState(false);
  const [isSecondLevelExpanded, setIsSecondLevelExpanded] = useState(false);
  const [isThirdLevelExpanded, setIsThirdLevelExpanded] = useState(false);
  const [indexLocal, setIndexLocal] = useState(-1);
  const [storeFirstLevelLocal, setStoreFirstLevelLocal] = useState([]);
  const [totalOfTeam, setTotalofTeam] = useState([]);
  const [totalOfTeamAfterFilter, settotalOfTeamAfterFilter] = useState([]);
  const [storeCREFirstLevelLocal, setStoreCREFirstLevelLocal] = useState([]);

  const [employeeListDropdownItem, setEmployeeListDropdownItem] = useState(0);
  const [
    reoprtingManagerListDropdownItem,
    setReoprtingManagerListDropdownItem,
  ] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);

  const [branches, setBranches] = useState([]);
  const [togglePercentage, setTogglePercentage] = useState(0);
  const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
  const [toggleParamsMetaData, setToggleParamsMetaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [teamLoader, setTeamLoader] = useState(false);
  const [teamMember, setTeamMember] = useState("");

  const [receptionistVol2AlluserData, setReceptionistVol2AlluserData] = useState([])
  const [receptionistVol2Level0, setReceptionistVol2Level0] = useState([])
  const [receptionistVol2Level1, setReceptionistVol2Level1] = useState([])
  const [isRecepVol2Level0Expanded, setIsRecepVol2Level0Expanded] = useState(false);
  const [crmVol2Level0, setCrmVol2Level0] = useState([])
  const [crmVol2Level1, setCrmVol2Level1] = useState([])
  const [crmVol2AlluserData, setCrmVol2AlluserData] = useState([])
  const [crmVol2ReportingData, setCrmVol2ReportingData] = useState([])
  const [crmVol2ReportingAllTree, setCrmVol2ReportingAllTree] = useState([])
  const [crmVol2NonReportingData, setCrmVol2NonReportingData] = useState([])
  const [isCRM_Non_reportingVol2Level0Expanded, seIsCRM_Non_reportingVol2Level0Expanded] = useState(false);
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

  const paramsMetadata = [
    // 'Enquiry', 'Test Drive', 'Home Visit', 'Booking', 'INVOICE', 'Finance', 'Insurance', 'Exchange', 'EXTENDEDWARRANTY', 'Accessories'
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
    // {color: '#FA03B9', paramName: 'Test Drive', shortName: 'TD', initial: 'T', toggleIndex: 0},
    // {color: '#9E31BE', paramName: 'Home Visit', shortName: 'Visit', initial: 'V', toggleIndex: 0},
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
    // {color: '#9E31BE', paramName: 'Exchange', shortName: 'Exg', initial: 'Ex', toggleIndex: 1},
    // {color: '#EC3466', paramName: 'Finance', shortName: 'Fin', initial: 'F', toggleIndex: 1},
    // {color: '#1C95A6', paramName: 'Insurance', shortName: 'Ins', initial: 'I', toggleIndex: 1},
    // {color: '#1C95A6', paramName: 'EXTENDEDWARRANTY', shortName: 'ExW', initial: 'ExW', toggleIndex: 1},
    // {color: '#C62159', paramName: 'Accessories', shortName: 'Acc', initial: 'A', toggleIndex: 1},
  ];

  const LocalDataForReceptionist = [
    {
      target: "0",
      paramName: "PreEnquiry",
      shortfall: "0",
      achievment: "0",
      shortFallPerc: "0%",
      achivementPerc: "0%",
      paramShortName: "Con",
      leadsList:[]
    },
    {
      target: "0",
      paramName: "Enquiry",
      shortfall: "0",
      achievment: "0",
      shortFallPerc: "0%",
      achivementPerc: "0%",
      paramShortName: "Enq",
      leadsList: []
    },
    {
      target: "0",
      paramName: "Booking",
      shortfall: "0",
      achievment: "0",
      shortFallPerc: "0%",
      achivementPerc: "0%",
      paramShortName: "Bkg",
      leadsList: []
    },
    {
      target: "0",
      paramName: "INVOICE",
      shortfall: "0",
      achievment: "0",
      shortFallPerc: "0%",
      achivementPerc: "0%",
      paramShortName: "Ret",
      leadsList: []
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

  useEffect(() => {
    navigation.addListener("focus", async () => {
      // setSelfInsightsData([]);
      setIsRecepVol2Level0Expanded(false);
      setisFilterViewExapanded(false);
      setIsViewCreExpanded(false);
      setIsViewExpanded(false);
      setIsSecondLevelExpanded(false);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setUserData({
          empId: jsonObj.empId,
          empName: jsonObj.empName,
          hrmsRole: jsonObj.hrmsRole,
          orgId: jsonObj.orgId,
          branchs: jsonObj.branchs,
          isSelfManager: jsonObj.isSelfManager,
          orgName: jsonObj.orgName,
        });

        // CRM vol1 api call
        // if (
        //   crmRole.includes(jsonObj.hrmsRole) &&
        //   _.isEmpty(selector.saveLiveleadObjectCRM)
        // ) {
        //   let tempPayload = {
        //     orgId: jsonObj.orgId,
        //     loggedInEmpId: jsonObj.empId,
        //   };
        //   dispatch(getCRM_ManagerLiveLeads(tempPayload));
        // }

       
        // vol2 crm api call 
        // if (
        //   crmRole.includes(jsonObj.hrmsRole) &&
        //   _.isEmpty(selector.saveLiveleadObjectCRM)
        // ) {
        //   let tempPayload = {
        //     orgId: jsonObj.orgId,
        //     loggedInEmpId: jsonObj.empId,
        //   };
        //   dispatch(getCRM_Recp_LiveLeadsVol2_CRM_ROLE(tempPayload));
        // }
      }
    });
  }, [navigation]);
  
  useEffect(() => {
    if (
      !_.isEmpty(selector.crm_response_data) &&
      _.isEmpty(selector.saveLiveleadObjectCRM)
    ) {
      let totalKey1 = selector.crm_response_data?.totalPreInquiryCount;
      let totalKey2 = selector.crm_response_data?.totalEnquiryCount;
      let totalKey3 = selector.crm_response_data?.totalBookingCount;
      let totalKey4 = selector.crm_response_data?.totalRetailCount;

      let total = [totalKey1, totalKey2, totalKey3, totalKey4];
      setTotalofTeam(total);
      let firstLevelData = selector.crm_response_data.CRM.map((item) => {
        setCrmFirstLevelTotalData(item.data);

        let firstLevel = item.data.manager.filter(
          (item2) => item2.emp_id === userData.empId
        );
        setCrmFirstLevelData(firstLevel);

        let consultantForCRM = item.data.manager.filter(
          (item2) => item2.emp_id !== userData.empId
        );
        if (firstLevel.length > 0) {
          firstLevel.map((itemfrist) => {
            itemfrist.salesconsultant.forEach((element) => {
              if (element.emp_id !== userData.empId) {
                consultantForCRM.unshift(element);
              }
            });
          });
        }

        setcrmSecondLevelData([...consultantForCRM]);
      });

      let tempArr = [];
      let tempArrSelf = selector.crm_response_data.CRE?.map(
        (item) => item.data
      );

      let firstLevelDataLevel2 = selector.crm_response_data.CRE?.map(
        (item, index) => {
          let firstLevel = item.data.consultantList?.filter(
            (item2) => item2.emp_id === item.emp_id
          );

          // if(salesPeopleUnderCre.length > 0){
          //   Array.prototype.push.apply(tempArrSelf, salesPeopleUnderCre);
          // }
          if (firstLevel.length > 0) {
            Array.prototype.push.apply(tempArr, firstLevel);
          }
        }
      );

      setCreFirstLevelData(tempArr);
      setCreFirstLevelSelfData(tempArrSelf);

      // let firstLevelDataLevel2 = selector.crm_response_data.CRE.map(item => {

      //   setCreFirstLevelSelfData(item.data);
      //   let firstLevel = item.data.consultantList.filter(item2 => item2.emp_id === item.emp_id)
      //   let salesPeopleUnderCre = item.data.consultantList.filter(item2 => item2.emp_id !== item.emp_id)

      //   // let consultantForCRM = item.data.filter(item2 => item2.emp_id !== userData.empId)
      //   if(salesPeopleUnderCre.length > 0){
      //     setCreSecondLevelData(salesPeopleUnderCre)
      //   }
      //   if (firstLevel.length > 0) {
      //     setCreFirstLevelData(firstLevel)
      //   }
      // })

      // set crm insights data
      let updateReceptinistData = LocalDataForReceptionist.map((item) => {
        if (item.paramName === "PreEnquiry") {
          item.achievment = selector.crm_response_data.totalPreInquiryCount;
        } else if (item.paramName === "Enquiry") {
          item.achievment = selector.crm_response_data.totalEnquiryCount;
        } else if (item.paramName === "Booking") {
          item.achievment = selector.crm_response_data.totalBookingCount;
        } else if (item.paramName === "INVOICE") {
          item.achievment = selector.crm_response_data.totalRetailCount;
        }
      });

      setSelfInsightsData([...LocalDataForReceptionist]);
    }
  }, [selector.crm_response_data]);

  useEffect(async () => {
    // navigation.addListener("focus", async () => {

    if (selector.saveLiveleadObject?.levelSelected) {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);

        if (receptionistRole.includes(jsonObj.hrmsRole)) {
          // let payload = {
          //   orgId: jsonObj.orgId,
          //   loggedInEmpId: jsonObj.empId,
          //   branchList: selector.saveLiveleadObject?.levelSelected,
          // };
          // dispatch(getTargetReceptionistData(payload));

          let payload = {
            orgId: jsonObj.orgId,
            loggedInEmpId: jsonObj.empId,
            levelSelected: selector.saveLiveleadObject?.levelSelected,
          };
          dispatch(getCRM_Recp_LiveLeadsVol2(payload)); // new api for live leads recep/tele/cre/crm
        }
      }
    } else {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);

        if (receptionistRole.includes(jsonObj.hrmsRole)) {
          let payload = { orgId: jsonObj.orgId, loggedInEmpId: jsonObj.empId };
          // dispatch(getTargetReceptionistData(payload));
          dispatch(getCRM_Recp_LiveLeadsVol2(payload)); // new api for live leads recep/tele/cre/crm
        }
      }
    }

    // })
  }, [selector.saveLiveleadObject]);

  useEffect(() => {
    if (!_.isEmpty(selector.receptionist_self_data)) {
      let updateReceptinistData = LocalDataForReceptionist.map((item) => {
        if (item.paramName === "PreEnquiry") {
          item.achievment = selector.receptionist_self_data.contactsCount;
        } else if (item.paramName === "Enquiry") {
          item.achievment = selector.receptionist_self_data.enquirysCount;
        } else if (item.paramName === "Booking") {
          item.achievment = selector.receptionist_self_data.bookingsCount;
        } else if (item.paramName === "INVOICE") {
          item.achievment = selector.receptionist_self_data.RetailCount;
        }
      });

      setSelfInsightsData([...LocalDataForReceptionist]);

      if (!_.isEmpty(selector.saveLiveleadObjectCRM)) {
        let filterSelectedUSerdata =
          selector.receptionist_self_data.consultantList.filter(
            (item) =>
              item.emp_id === selector.saveLiveleadObjectCRM?.selectedempId[0]
          );
        let filterOtherData =
          selector.receptionist_self_data.consultantList.filter(
            (item) =>
              item.emp_id !== selector.saveLiveleadObjectCRM?.selectedempId[0]
          );
        setCRM_filterParametersSecondLevel(filterOtherData);
        setCRM_filterParameters(filterSelectedUSerdata);

        let totalKey1 = selector.receptionist_self_data.contactsCount;
        let totalKey2 = selector.receptionist_self_data.enquirysCount;
        let totalKey3 = selector.receptionist_self_data.bookingsCount;
        let totalKey4 = selector.receptionist_self_data.RetailCount;

        let total = [totalKey1, totalKey2, totalKey3, totalKey4];
        settotalOfTeamAfterFilter(total);
      }
    }
  }, [selector.receptionist_self_data]);

  useEffect(() => {
    if (!_.isEmpty(selector.saveLiveleadObjectCRM)) {
      // let payload = {
      //   orgId: userData.orgId,
      //   loggedInEmpId: selector.saveLiveleadObjectCRM?.selectedempId[0],
      //   branchList: selector.saveLiveleadObjectCRM?.levelSelected,
      // };
      // dispatch(getTargetReceptionistData(payload));
      let payload = {
        orgId: userData.orgId,
        loggedInEmpId: selector.saveLiveleadObjectCRM?.selectedempId[0],
        levelSelected: selector.saveLiveleadObjectCRM?.levelSelected,
      };
      dispatch(getCRM_Recp_LiveLeadsVol2_CRM_ROLE(payload)); // new api for live leads recep/tele/cre/crm
    } else {
      let tempPayload = {
        orgId: userData.orgId,
        loggedInEmpId: userData.empId,
      };
      dispatch(getCRM_Recp_LiveLeadsVol2_CRM_ROLE(tempPayload));
      setCRM_filterParameters([]);
      settotalOfTeamAfterFilter([]);
    }
  }, [selector.saveLiveleadObjectCRM,userData]);

  useEffect(() => {
    const dateFormat = "YYYY-MM-DD";
    const currentDate = moment().format(dateFormat);
    const monthLastDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .endOf("month")
      .format(dateFormat);
    // setDateDiff((new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24));

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
        const params = { ...tempRetail[0] };
        params.paramShortName = "Ret";
        tempRetail[0] = params;
        setRetailData(tempRetail[0]);
      }

      let tempBooking = [];
      tempBooking = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "booking";
      });
      if (tempBooking.length > 0) {
        const params = { ...tempBooking[0] };
        params.paramShortName = "Bkg";
        tempBooking[0] = params;
        setBookingData(tempBooking[0]);
      }

      let tempEnq = [];
      tempEnq = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "enquiry";
      });
      if (tempEnq.length > 0) {
        const params = { ...tempEnq[0] };
        params.paramShortName = "Enq";
        tempEnq[0] = params;
        setEnqData(tempEnq[0]);
      }

      let tempCon = [];
      tempCon = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === "preenquiry";
      });
      if (tempCon.length > 0) {
        const params = { ...tempCon[0] };
        params.paramShortName = "Con";
        tempCon[0] = params;
        setContactData(tempCon[0]);
      }

      setSelfInsightsData([
        tempCon[0],
        tempEnq[0],
        tempBooking[0],
        tempRetail[0],
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
      // setDateDiff((new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24));
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
          // setIsTeamPresent(true)
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
    // setIsTeam(selector.isTeam);
    if (selector.isTeam) {
      setToggleParamsIndex(0);
      let data = [...paramsMetadata];
      data = data.filter((x) => x.toggleIndex === 0);
      setToggleParamsMetaData([...data]);
    }
  }, [selector.isTeam]);


  useEffect(() => {
    if (!_.isEmpty(selector.crm_recep_response_data_vol2.fullResponse))  {
      console.log("manthan kk ", );
      let modified = selector.crm_recep_response_data_vol2?.fullResponse?.self?.allTreeData?.map(v => ({ ...v, isOpenInner: false, innerData: [] }))
      setReceptionistVol2AlluserData(modified);
      let tempFilterIds = selector.crm_recep_response_data_vol2?.fullResponse?.self?.level1?.map((item) => item.empId)

      let tempArr = modified.filter((item) => tempFilterIds.includes(item.empId))


      setReceptionistVol2Level1(tempArr);
      setReceptionistVol2Level0([selector.crm_recep_response_data_vol2.fullResponse.self.selfUser]);

      if (selector.crm_recep_response_data_vol2) {
        let totalKey1 = selector?.crm_recep_response_data_vol2?.enquirysCount;
        let totalKey2 = selector?.crm_recep_response_data_vol2?.bookingsCount;
        let totalKey3 = selector?.crm_recep_response_data_vol2?.RetailCount;
        let totalKey4 = selector?.crm_recep_response_data_vol2?.contactsCount;

        let total = [totalKey4,totalKey1, totalKey2, totalKey3];
        
        setTotalofTeam(total);
      }

    }
  
    
  }, [selector.crm_recep_response_data_vol2])
  
  useEffect(() => {

    // findDataFromObject(selector.receptionistDataV3.fullResponse);
    if (!_.isEmpty(selector.crm_recep_response_data_vol2_CRM_ROLE?.fullResponse)) {

      let modified = selector.crm_recep_response_data_vol2_CRM_ROLE?.fullResponse?.self?.allTreeData?.map(v => ({ ...v, isOpenInner: false, innerData: [] }))

      setCrmVol2AlluserData(modified);
      let tempFilterIds = selector.crm_recep_response_data_vol2_CRM_ROLE?.fullResponse?.self?.level1?.map((item) => item.empId)

      let tempArr = modified.filter((item) => tempFilterIds.includes(item.empId))


      setCrmVol2Level1(tempArr);
      setCrmVol2Level0([selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.self.selfUser]);

      setCrmVol2ReportingData(selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.reportingUser)

      setCrmVol2NonReportingData(selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.nonReportingUser)


      if (selector.crm_recep_response_data_vol2_CRM_ROLE) {
        let totalKey1 = selector?.crm_recep_response_data_vol2_CRM_ROLE?.enquirysCount;
        let totalKey2 = selector?.crm_recep_response_data_vol2_CRM_ROLE?.bookingsCount;
        let totalKey3 = selector?.crm_recep_response_data_vol2_CRM_ROLE?.RetailCount;
        let totalKey4 = selector?.crm_recep_response_data_vol2_CRM_ROLE?.contactsCount;

        let total = [totalKey4, totalKey1, totalKey2, totalKey3];
        setTotalofTeam(total);


        let updateReceptinistData = LocalDataForReceptionist.map((item) => {
          if (item.paramName === "PreEnquiry") {
            item.achievment = selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.totalContactCount;
            item.leadsList = selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.totalContactLeads;
          } else if (item.paramName === "Enquiry") {
            item.achievment = selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.totalEnquiryCount;
            item.leadsList = selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.totalEnquiryLeads;
          } else if (item.paramName === "Booking") {
            item.achievment = selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.totalBookingCount;
            item.leadsList = selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.totalBookingLeads;
          } else if (item.paramName === "INVOICE") {
            item.achievment = selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.totalRetailCount;
            item.leadsList = selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse.totalRetailLeads;
          }
        });

        setSelfInsightsData([...LocalDataForReceptionist]);
      }
    }

   

  }, [selector.crm_recep_response_data_vol2_CRM_ROLE])

  useEffect(() => {
    setTogglePercentage(0);
    // setIsTeam(selector.isTeam);
    // if (selector.isTeam) {
      setToggleParamsIndex(0);
      let data = [...paramsMetadata];
      data = data.filter((x) => x.toggleIndex === 0);
      setToggleParamsMetaData([...data]);
    // }
  }, [userData]);

  useEffect(() => {
    allParameters[0] = {
      ...allParameters[0],
      targetAchievements: selector.totalParameters,
    };

    setAllParameters(allParameters);
  }, [selector.totalParameters]);

  useEffect(async () => {
    try {
      setIsLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        if (selector.all_emp_parameters_data.length > 0) {
          if (!_.isEmpty(selector.saveLiveleadObject?.selectedempId)) {
            myParams = [
              ...selector.all_emp_parameters_data.filter(
                (item) =>
                  item.empId == selector.saveLiveleadObject?.selectedempId[0]
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
          } else {
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
          }

          if (!selector.saveLiveleadObject?.selectedempId) {
            setFilterParameters([]);
            setfilterParametersApplied(false);
          }
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
          //       URL.GET_LIVE_LEADS_INSIGHTS(),
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
  }, [selector.all_emp_parameters_data, selector.totalParameters]);

  useEffect(async () => {
    try {
      setIsLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        if (selector.saveLiveleadObject?.selectedempId) {
          // getDataAfterFilter();
        } else {
          setFilterParameters([]);
          setfilterParametersApplied(false);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [selector.saveLiveleadObject]);

  const getDataAfterFilter = async () => {
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
      let payload = {
        orgId: jsonObj.orgId,
        selectedEmpId: selector.saveLiveleadObject?.selectedempId[0],
        endDate: monthLastDate,
        loggedInEmpId: jsonObj.empId,
        empId: selector.saveLiveleadObject?.selectedempId[0],
        startDate: monthFirstDate,
        levelSelected: null,
        pageNo: 0,
        size: 100,
      };
      Promise.all([dispatch(getUserWiseTargetParameters(payload))]).then(
        async (res) => {
          let tempRawData = [];
          tempRawData = res[0]?.payload?.employeeTargetAchievements.filter(
            (emp) => emp.empId == selector.saveLiveleadObject?.selectedempId[0]
          );
          if (tempRawData.length > 0) {
            for (let i = 0; i < tempRawData.length; i++) {
              (tempRawData[i].empName = tempRawData[i].empName),
                (tempRawData[i] = {
                  ...tempRawData[i],
                  isOpenInner: false,
                  branchName: getBranchName(tempRawData[i].branchId),
                  employeeTargetAchievements: [],
                  tempTargetAchievements: tempRawData[i]?.targetAchievements,
                  targetAchievements: tempRawData[i]?.targetAchievements,
                });
              // if (i === tempRawData.length - 1) {
              // localData[index].employeeTargetAchievements = tempRawData;
              // let newIds = tempRawData.map((emp) => emp.empId);
              // if (newIds.length >= 2 || true) {
              //   for (let i = 0; i < newIds.length; i++) {
              //     const element = newIds[i].toString();
              //     let tempPayload = getTotalPayload(employeeData, element);
              //     const response = await client.post(
              //       URL.GET_LIVE_LEADS_INSIGHTS(),
              //       tempPayload
              //     );
              //     const json = await response.json();
              //     if (Array.isArray(json)) {
              //       localData[index].employeeTargetAchievements[
              //         i
              //       ].targetAchievements = json;
              //     }
              //   }
              // }
              // }
            }
          }
          // setFilterParameters([...tempRawData])
          // alert(JSON.stringify(tempRawData))
          setfilterParametersApplied(true);
          setAllParameters([...tempRawData]);
        }
      );

      // if (localData[index].employeeTargetAchievements.length > 0) {
      //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
      //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
      //   }
      // }
    }
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

  // for filter data
  const renderFilterData = (item, color) => {
    return (
      <View
        style={{ flexDirection: "row", backgroundColor: Colors.BORDER_COLOR }}
      >
        <RenderEmployeeParameters
          item={item}
          displayType={togglePercentage}
          params={toggleParamsMetaData}
          navigation={navigation}
          moduleType={"live-leads"}
        />
        {/* <RenderEmployeeParameters
          item={item}
          displayType={togglePercentage}
          params={toggleParamsMetaData}
          navigation={navigation}
          moduleType={"home"}
          editParameters={editParameters}
          editAndUpdate={(x) => {
            if (item?.isAccess == "false") {
              showToastRedAlert(
                `Target has been already set by ${item?.updatedUserName}`
              );
            } else {
              let branchName = item?.branchName;
              let branch = item?.branch;

              if (!branchName) {
                branchName = getBranchName(item.branchId, true);
              }
              if (!branch) {
                branch = item.branchId;
              }

              setSelectedDropdownData([
                {
                  label: branchName,
                  value: branch,
                },
              ]);
              if (
                item?.retailTarget !== null &&
                selector?.endDate === item?.endDate &&
                selector?.startDate === item?.startDate
              ) {
                setSelectedBranch({
                  label: branchName,
                  value: branch,
                });
                setDefaultBranch(branch);
                setAddOrEdit("E");
              } else {
                setDefaultBranch(null);
                setAddOrEdit("A");
              }
              if (item?.targetName) {
                setTargetName(item?.targetName);
              }

              // if (x === "0" || x === 0) {
              //   setIsNoTargetAvailable(true);
              // } else {
              //   setIsNoTargetAvailable(false);
              // }
              if (item.recordId) {
                setIsNoTargetAvailable(false);
              } else {
                setIsNoTargetAvailable(true);
              }

              setRetail(x);
              setSelectedUser(item);
              setOpenRetail(true);
            }
          }}
          onChangeTeamParamValue={(index, x, id, param) => {
            onChangeTeamParamValue2(index, x, item.empId, param);
          }}
        /> */}
      </View>
    );
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
          moduleType={"live-leads"}
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
      empId: item,
      endDate: monthLastDate,
      levelSelected: null,
      loggedInEmpId: item,
      orgId: jsonObj.orgId,
      pageNo: 0,
      selectedEmpId: item,
      size: 100,
      startDate: "2021-01-01",
    };
  };
  const onEmployeeNameClick = async (item, index) => {
    setSelectedName(item.empName); // to display name on click of the left view - first letter
    setTimeout(() => {
      setSelectedName("");
    }, 900);
    let localData = [...allParameters];
    let current = localData[index].isOpenInner;
    for (let i = 0; i < localData.length; i++) {
      localData[i].isOpenInner = false;
      if (i === localData.length - 1) {
        localData[index].isOpenInner = !current;
      }
    }
    if (!current) {
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
        let payload = {
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
        Promise.all([dispatch(getUserWiseTargetParameters(payload))]).then(
          async (res) => {
            let tempRawData = [];
            tempRawData = res[0]?.payload?.employeeTargetAchievements.filter(
              (emp) => emp.empId !== item.empId
            );
            if (tempRawData.length > 0) {
              for (let i = 0; i < tempRawData.length; i++) {
                (tempRawData[i].empName = tempRawData[i].empName),
                  (tempRawData[i] = {
                    ...tempRawData[i],
                    isOpenInner: false,
                    branchName: getBranchName(tempRawData[i].branchId),
                    employeeTargetAchievements: [],
                    tempTargetAchievements: tempRawData[i]?.targetAchievements,
                  });
                if (i === tempRawData.length - 1) {
                  localData[index].employeeTargetAchievements = tempRawData;
                  let newIds = tempRawData.map((emp) => emp.empId);
                  if (newIds.length >= 2 || true) {
                    for (let i = 0; i < newIds.length; i++) {
                      const element = newIds[i].toString();
                      let tempPayload = getTotalPayload(employeeData, element);
                      const response = await client.post(
                        URL.GET_LIVE_LEADS_INSIGHTS(),
                        tempPayload
                      );
                      const json = await response.json();
                      if (Array.isArray(json)) {
                        localData[index].employeeTargetAchievements[
                          i
                        ].targetAchievements = json;
                      }
                    }
                  }
                }
              }
            }
            // alert(JSON.stringify(localData))

            setAllParameters([...localData]);
          }
        );

        // if (localData[index].employeeTargetAchievements.length > 0) {
        //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
        //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
        //   }
        // }
      }
    } else {
      setAllParameters([...localData]);
    }
  };

  const onEmployeeNameClick2 = async (item, index, lastParameter) => {
    try {
      setTeamMember(item.empName);
      let localData = [...allParameters];
      let current = lastParameter[index].isOpenInner;
      setSelectedName(item.empName);
      setTimeout(() => {
        setSelectedName("");
      }, 900);
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
          let payload = {
            orgId: jsonObj.orgId,
            selectedEmpId: item.empId,
            endDate: monthLastDate,
            loggedInEmpId: item.empId,
            empId: item.empId,
            startDate: monthFirstDate,
            levelSelected: null,
            pageNo: 0,
            size: 100,
          };
          Promise.all([dispatch(getUserWiseTargetParameters(payload))]).then(
            async (res) => {
              let tempRawData = [];
              tempRawData = res[0]?.payload?.employeeTargetAchievements.filter(
                (emp) => emp.empId !== item.empId
              );
              if (tempRawData.length > 0) {
                for (let i = 0; i < tempRawData.length; i++) {
                  tempRawData[i] = {
                    ...tempRawData[i],
                    isOpenInner: false,
                    employeeTargetAchievements: [],
                    tempTargetAchievements: tempRawData[i]?.targetAchievements,
                  };
                  if (i === tempRawData.length - 1) {
                    lastParameter[index].employeeTargetAchievements =
                      tempRawData;
                    let newIds = tempRawData.map((emp) => emp.empId);
                    if (newIds.length >= 2) {
                      for (let i = 0; i < newIds.length; i++) {
                        const element = newIds[i].toString();
                        let tempPayload = getTotalPayload(
                          employeeData,
                          element
                        );
                        const response = await client.post(
                          URL.GET_LIVE_LEADS_INSIGHTS(),
                          tempPayload
                        );
                        const json = await response.json();
                        if (Array.isArray(json)) {
                          console.log("ssss", json);
                          console.log(
                            "lastParameter[index].employeeTargetAchievements[i]",
                            lastParameter[index].employeeTargetAchievements[i]
                              .targetAchievements
                          );
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
    } catch (error) {
      setTeamLoader(false);
    }
  };

  const paramNameLabels = { preenquiry: "Contacts", invoice: "Retail" };

  function convertParamNameLabels(paramName) {
    paramName = paramName ? paramName : "";
    if (paramNameLabels.hasOwnProperty(paramName.toLowerCase())) {
      paramName = paramNameLabels[paramName.toLowerCase()];
    }
    return paramName;
  }

  function navigateToEMS(
    params = "",
    screenName = "",
    selectedEmpId = [],
    isIgnore = false,
    parentId = "",
    isCRMOwnDATA = false,
    isgetCRMTotalData = false
  ) {
    navigation.navigate(AppNavigator.TabStackIdentifiers.ems);

    // receptionist filter applied
    if (selector.saveLiveleadObject?.levelSelected) {
      setTimeout(() => {
        if (params === "Contact") {
          navigation.navigate("PRE_ENQUIRY", {
            screenName: "ParametersScreen",
            params: params,
            moduleType: "live-leadsV2",
            employeeDetail: "",
            selectedEmpId: selectedEmpId,
            startDate: selector.saveLiveleadObject.startDate,
            endDate: selector.saveLiveleadObject.endDate,
            dealerCodes: selector.saveLiveleadObject.levelSelected,
            ignoreSelectedId: isIgnore,
            parentId: parentId,
          });
        } else {
          navigation.navigate("LEADS", {
            screenName: "ParametersScreen",
            params: params,
            moduleType: "live-leadsV2",
            employeeDetail: "",
            selectedEmpId: selectedEmpId,
            startDate: selector.saveLiveleadObject.startDate,
            endDate: selector.saveLiveleadObject.endDate,
            dealerCodes: selector.saveLiveleadObject.levelSelected,
            ignoreSelectedId: isIgnore,
            parentId: parentId,
          });
        }
      }, 1000);
    } else if (selector.saveLiveleadObjectCRM.selectedempId) {
      setTimeout(() => {
        // crm filter applied case
        if (params === "Contact") {
          navigation.navigate("PRE_ENQUIRY", {
            screenName: "ParametersScreen",
            params: params,
            moduleType: "live-leadsV2",
            employeeDetail: "",
            selectedEmpId: selectedEmpId,
            startDate: selector.saveLiveleadObjectCRM.startDate,
            endDate: selector.saveLiveleadObjectCRM.endDate,
            dealerCodes: selector.saveLiveleadObjectCRM.levelSelected,
            ignoreSelectedId: isIgnore,
            parentId: selector.saveLiveleadObjectCRM.selectedempId[0],
            isCRMOwnDATA: false,
          });
        } else {
          navigation.navigate("LEADS", {
            screenName: "ParametersScreen",
            params: params,
            moduleType: "live-leadsV2",
            employeeDetail: "",
            selectedEmpId: selectedEmpId,
            startDate: selector.saveLiveleadObjectCRM.startDate,
            endDate: selector.saveLiveleadObjectCRM.endDate,
            dealerCodes: selector.saveLiveleadObjectCRM.levelSelected,
            ignoreSelectedId: isIgnore,
            parentId: selector.saveLiveleadObjectCRM.selectedempId[0],
            isCRMOwnDATA: false,
          });
        }
      }, 1000);
    } else {
      // tree structure redirections also here
      setTimeout(() => {
        // receptionist filter not applied
        if (params === "Contact") {
          navigation.navigate("PRE_ENQUIRY", {
            screenName: "ParametersScreen",
            params: params,
            moduleType: "live-leadsV2",
            employeeDetail: "",
            selectedEmpId: selectedEmpId,
            startDate: "",
            endDate: "",
            dealerCodes: [],
            parentId: parentId,
            isCRMOwnDATA: isCRMOwnDATA,
            isgetCRMTotalData: isgetCRMTotalData,
            // ignoreSelectedId: isIgnore
          });
        } else {
          navigation.navigate("LEADS", {
            screenName: "ParametersScreen",
            params: params,
            moduleType: "live-leadsV2",
            employeeDetail: "",
            selectedEmpId: selectedEmpId,
            startDate: "",
            endDate: "",
            dealerCodes: [],
            parentId: parentId,
            isCRMOwnDATA: isCRMOwnDATA,
            isgetCRMTotalData: isgetCRMTotalData,
            // ignoreSelectedId: isIgnore
          });
        }
      }, 1000);
    }
  }

  async function navigateToEmsScreen(item) {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      const leads = ["enquiry", "booking", "invoice"];
      const { paramName } = item;
      const isContact = paramName.toLowerCase() === "preenquiry";
      const isLead = leads.includes(paramName.toLowerCase());
      // let makeparams = paramName
      let employeeDetail;
      let empIdLocal;
      // if(filterParameters.length>0){
      if (!_.isEmpty(selector.saveLiveleadObject)) {
        if (selector.saveLiveleadObject.selectedempId !== undefined) {
          employeeDetail = {
            empName: "",
            empId: selector.saveLiveleadObject?.selectedempId[0],
            orgId: "",
            branchId: "",
          };
          empIdLocal = selector.saveLiveleadObject?.selectedempId[0];
        }
      } else {
        employeeDetail = {
          empName: "",
          empId: jsonObj.empId,
          orgId: "",
          branchId: "",
        };
        empIdLocal = jsonObj.empId;
      }

      if (isLead) {
        navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
        setTimeout(() => {
          navigation.navigate("LEADS", {
            param: paramName === "INVOICE" ? "Retail" : paramName,
            moduleType: "live-leads",
            employeeDetail: employeeDetail,
            // screenName: "",
            // selectedEmpId: "",
            // startDate: "",
            // endDate: "",
            // dealerCodes: "",
            // fromScreen: ""
          });
        }, 2000);
      } else if (isContact) {
        navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
        setTimeout(() => {
          navigation.navigate(EmsTopTabNavigatorIdentifiers.preEnquiry, {
            moduleType: "live-leads",
            employeeDetail: employeeDetail,
            selectedEmpId: empIdLocal,
          });
        }, 2000);
      }
    }
  }

  const renderSelfInsightsView = (item, index) => {
    return (
      <Card
        onPress={() =>
          item?.achievment && item?.achievment > 0
            ? navigateToEmsScreen(item)
            : null
        }
        style={[
          styles.paramCard,
          {
            borderColor: color[index % color.length],
          },
        ]}
      >
        <View style={styles.insightParamsContainer}>
          <Text style={styles.insightParamsLabel}>
            {convertParamNameLabels(item?.paramName)}
          </Text>
          <Text
            style={[
              styles.achievementCountView,
              {
                textDecorationLine:
                  item?.achievment && item?.achievment > 0
                    ? "underline"
                    : "none",
              },
            ]}
          >
            {item?.achievment && item?.achievment > 0 ? item?.achievment : 0}
          </Text>
          <View></View>
        </View>
      </Card>
      // <View
      //     style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, marginHorizontal: 8, alignItems: 'center'}}>
      //     <Text
      //         style={{width: '40%'}}>{convertParamNameLabels(item?.paramName)}</Text>
      //     <Text style={{ minWidth: 45,
      //         height: 25,
      //         borderColor: color[index % color.length],
      //         borderWidth: 1,
      //         borderRadius: 8,
      //         justifyContent: "center",
      //         alignItems: "center",
      //         textAlign: 'center',
      //         paddingTop: 4}} onPress={() => navigateToEmsScreen(item)}>{item?.achievment}</Text>
      //     <View></View>
      // </View>
    );
  };

  const renderSelfInsightsViewRecepToCRMVol2 = (item, index) => {
    return (
      <Card
        onPress={() => {
          console.log("manthan item ",item);
          if (item?.achievment && item?.achievment > 0) {
            if (crmRole.includes(userData.hrmsRole)) {
              if (index === 0) {
                navigateToContactVol2(item.leadsList)
                // navigateToEmsVol2(item.);
              } else {
                navigateToEmsVol2(item.leadsList);
              }
            } else {
              if (index === 0) {
                navigateToContactVol2(item.leadsList)
                // navigateToEmsVol2(item.);
              } else {
                navigateToEmsVol2(item.leadsList);
              }
            }
          }

          // item?.achievment && item?.achievment > 0
          //   ? navigateToEMS("","","","","","",item)
          //   : null
        }}
        style={[
          styles.paramCard,
          {
            borderColor: color[index % color.length],
          },
        ]}
      >
        <View style={styles.insightParamsContainer}>
          <Text style={styles.insightParamsLabel}>
            {convertParamNameLabels(item?.paramName)}
          </Text>
          <Text
            style={[
              styles.achievementCountView,
              {
                textDecorationLine:
                  item?.achievment && item?.achievment > 0
                    ? "underline"
                    : "none",
              },
            ]}
          >
            {item?.achievment && item?.achievment > 0 ? item?.achievment : 0}
          </Text>
          <View></View>
        </View>
      </Card>
      // <View
      //     style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, marginHorizontal: 8, alignItems: 'center'}}>
      //     <Text
      //         style={{width: '40%'}}>{convertParamNameLabels(item?.paramName)}</Text>
      //     <Text style={{ minWidth: 45,
      //         height: 25,
      //         borderColor: color[index % color.length],
      //         borderWidth: 1,
      //         borderRadius: 8,
      //         justifyContent: "center",
      //         alignItems: "center",
      //         textAlign: 'center',
      //         paddingTop: 4}} onPress={() => navigateToEmsScreen(item)}>{item?.achievment}</Text>
      //     <View></View>
      // </View>
    );
  };

  const renderSelfInsightsViewRecepToCRM = (item, index) => {
    return (
      <Card
        onPress={() => {
          if (item?.achievment && item?.achievment > 0) {
            if (crmRole.includes(userData.hrmsRole)) {
              if (index === 0) {
                navigateToEMS("Contact", "", [], false, userData.empId, true);
              } else if (index === 1) {
                navigateToEMS("ENQUIRY", "", [], false, userData.empId, true);
              } else if (index === 2) {
                navigateToEMS("BOOKING", "", [], false, userData.empId, true);
              } else if (index === 3) {
                navigateToEMS("Invoice", "", [], false, userData.empId, true);
              }
            } else {
              if (index === 0) {
                navigateToEMS("Contact", "", [], false, userData.empId, false);
              } else if (index === 1) {
                navigateToEMS("ENQUIRY", "", [], false, userData.empId, false);
              } else if (index === 2) {
                navigateToEMS("BOOKING", "", [], false, userData.empId, false);
              } else if (index === 3) {
                navigateToEMS("Invoice", "", [], false, userData.empId, false);
              }
            }
          }

          // item?.achievment && item?.achievment > 0
          //   ? navigateToEMS("","","","","","",item)
          //   : null
        }}
        style={[
          styles.paramCard,
          {
            borderColor: color[index % color.length],
          },
        ]}
      >
        <View style={styles.insightParamsContainer}>
          <Text style={styles.insightParamsLabel}>
            {convertParamNameLabels(item?.paramName)}
          </Text>
          <Text
            style={[
              styles.achievementCountView,
              {
                textDecorationLine:
                  item?.achievment && item?.achievment > 0
                    ? "underline"
                    : "none",
              },
            ]}
          >
            {item?.achievment && item?.achievment > 0 ? item?.achievment : 0}
          </Text>
          <View></View>
        </View>
      </Card>
      // <View
      //     style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, marginHorizontal: 8, alignItems: 'center'}}>
      //     <Text
      //         style={{width: '40%'}}>{convertParamNameLabels(item?.paramName)}</Text>
      //     <Text style={{ minWidth: 45,
      //         height: 25,
      //         borderColor: color[index % color.length],
      //         borderWidth: 1,
      //         borderRadius: 8,
      //         justifyContent: "center",
      //         alignItems: "center",
      //         textAlign: 'center',
      //         paddingTop: 4}} onPress={() => navigateToEmsScreen(item)}>{item?.achievment}</Text>
      //     <View></View>
      // </View>
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
    ].consultantList.filter((item2) => item2.emp_id !== item.emp_id);
    setCreSecondLevelData(salesPeopleUnderCre);
  };

  const renderCREtreeFirstLevel = () => {
    return (
      <>
        {creFirstLevelData.length > 0 &&
          creFirstLevelData.map((item, index) => {
            return (
              <View
                style={{
                  borderColor:
                    isViewCREExpanded && index === creIndex
                      ? Colors.YELLOW
                      : "",
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
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.emp_name}
                  </Text>
                </View>
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    if (isViewCREExpanded) {
                      handleSourceModalNavigation(
                        item,
                        item?.emp_id,
                        [item.emp_id],
                        "CRM_INd"
                      );
                    } else {
                      handleSourceModalNavigation(item, "", [], "CRM");
                    }

                    // navigation.navigate(
                    //   AppNavigator.HomeStackIdentifiers.sourceModel,
                    //   {
                    //     empId: selector.saveLiveleadObject?.selectedempId[0],
                    //     headerTitle: item?.emp_name,
                    //     loggedInEmpId:
                    //       selector.saveLiveleadObject?.selectedempId[0],
                    //     type: "TEAM",
                    //     moduleType: "live-leads",
                    //   }
                    // );
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={getBranchName(item?.branch)}
                        color={Colors.CORAL}
                        titleClick={async () => {
                          formatCRrSecondLeveleData(item, index);
                          // setIsViewCreExpanded(!isViewCREExpanded)
                          // setStoreCREFirstLevelLocal(item);
                          // setStoreFirstLevelLocal(item)

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
                        {[
                          isViewCREExpanded && index === creIndex
                            ? item.contactCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].contactsCount
                            : 0 || 0,
                          isViewCREExpanded && index === creIndex
                            ? item.enquiryCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].enquirysCount
                            : 0 || 0,
                          isViewCREExpanded && index === creIndex
                            ? item.bookingCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].bookingsCount
                            : 0 || 0,
                          isViewCREExpanded && index === creIndex
                            ? item.retailCount
                            : creFirstLevelSelfData
                            ? creFirstLevelSelfData[index].RetailCount
                            : 0 || 0,
                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (isViewCREExpanded) {
                                    if (index === 0) {
                                      navigateToEMS(
                                        "Contact",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    } else if (index === 1) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    } else if (index === 2) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    } else if (index === 3) {
                                      navigateToEMS(
                                        "Invoice",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToEMS(
                                        "Contact",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false,
                                        false
                                      );
                                    } else if (index === 1) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false,
                                        false
                                      );
                                    } else if (index === 2) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false,
                                        false
                                      );
                                    } else if (index === 3) {
                                      navigateToEMS(
                                        "Invoice",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false,
                                        false
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
                {isViewCREExpanded &&
                  index === creIndex &&
                  renderCREtreeSecondLevel()}
              </View>
            );
          })}
      </>
    );
  };

  const renderCREtreeSecondLevel = () => {
    return (
      <>
        {creSecondLevelData.length > 0 &&
          creSecondLevelData.map((item, index) => {
            return (
              <View
                style={
                  {
                    // borderColor: isSecondLevelExpanded && indexLocal === index ? Colors.BLUE : "",
                    // borderWidth: isSecondLevelExpanded && indexLocal === index ? 1 : 0,
                    // borderRadius: 10,
                    // margin: isSecondLevelExpanded && indexLocal === index ? 10 : 0
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
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.emp_name}
                  </Text>
                </View>
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    handleSourceModalNavigation(
                      item,
                      storeCREFirstLevelLocal?.emp_id,
                      [item.emp_id]
                    );
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={getBranchName(item?.branch)}
                        color={"#2C97DE"}
                        titleClick={async () => {
                          // setIsViewExpanded(!isViewExpanded)
                          // setIsSecondLevelExpanded(!isSecondLevelExpanded)
                          formateSaleConsutantDataCRM(item, index);
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
                        {[
                          item.contactCount || 0,
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (index === 0) {
                                    navigateToEMS(
                                      "Contact",
                                      "",
                                      [item.emp_id],
                                      false,
                                      storeCREFirstLevelLocal?.emp_id,
                                      false
                                    );
                                  } else if (index === 1) {
                                    navigateToEMS(
                                      "ENQUIRY",
                                      "",
                                      [item.emp_id],
                                      false,
                                      storeCREFirstLevelLocal?.emp_id,
                                      false
                                    );
                                  } else if (index === 2) {
                                    navigateToEMS(
                                      "BOOKING",
                                      "",
                                      [item.emp_id],
                                      false,
                                      storeCREFirstLevelLocal?.emp_id,
                                      false
                                    );
                                  } else if (index === 3) {
                                    navigateToEMS(
                                      "Invoice",
                                      "",
                                      [item.emp_id],
                                      false,
                                      storeCREFirstLevelLocal?.emp_id,
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
                {/* {isSecondLevelExpanded && index === indexLocal && renderCRMtreeThirdLevel()} */}
              </View>
            );
          })}
      </>
    );
  };

  const renderCRMtreeFirstLevel = () => {
    return (
      <>
        {crmFirstLevelData.length > 0 &&
          crmFirstLevelData.map((item, index) => {
            return (
              <View
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
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.emp_name}
                  </Text>
                </View>
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    if (isViewExpanded) {
                      handleSourceModalNavigation(
                        item,
                        item?.emp_id,
                        [item.emp_id],
                        "CRM_INd",
                        true
                      );
                    } else {
                      handleSourceModalNavigation(item, "", [], "CRM", true);
                    }

                    // navigation.navigate(
                    //   AppNavigator.HomeStackIdentifiers.sourceModel,
                    //   {
                    //     empId: selector.saveLiveleadObject?.selectedempId[0],
                    //     headerTitle: item?.emp_name,
                    //     loggedInEmpId:
                    //       selector.saveLiveleadObject?.selectedempId[0],
                    //     type: "TEAM",
                    //     moduleType: "live-leads",
                    //   }
                    // );
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={getBranchName(item?.branch)}
                        color={"#C62159"}
                        titleClick={async () => {
                          setIsViewExpanded(!isViewExpanded);
                          setStoreFirstLevelLocal(item);

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
                        isViewExpanded ? item.contactCount : selector.crm_response_data.totalPreInquiryCount || 0,
                        isViewExpanded ? item.enquiryCount : selector.crm_response_data.totalEnquiryCount || 0,
                        isViewExpanded ? item.bookingCount : selector.crm_response_data.totalBookingCount || 0,
                        isViewExpanded ? item.retailCount : selector.crm_response_data.totalRetailCount || 0,
                      ]. */}
                        {[
                          isViewExpanded
                            ? item.contactCount
                            : crmFirstLevelTotalData
                            ? crmFirstLevelTotalData?.totalPreInquiryCount
                            : 0 || 0,
                          isViewExpanded
                            ? item.enquiryCount
                            : crmFirstLevelTotalData
                            ? crmFirstLevelTotalData?.totalEnquiryCount
                            : 0 || 0,
                          isViewExpanded
                            ? item.bookingCount
                            : crmFirstLevelTotalData
                            ? crmFirstLevelTotalData?.totalBookingCount
                            : 0 || 0,
                          isViewExpanded
                            ? item.retailCount
                            : crmFirstLevelTotalData
                            ? crmFirstLevelTotalData?.totalRetailCount
                            : 0 || 0,
                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections
                                if (e > 0) {
                                  if (isViewExpanded) {
                                    if (index === 0) {
                                      navigateToEMS(
                                        "Contact",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    } else if (index === 1) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    } else if (index === 2) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    } else if (index === 3) {
                                      navigateToEMS(
                                        "Invoice",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToEMS(
                                        "Contact",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        true,
                                        true
                                      );
                                    } else if (index === 1) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        true,
                                        true
                                      );
                                    } else if (index === 2) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        true,
                                        true
                                      );
                                    } else if (index === 3) {
                                      navigateToEMS(
                                        "Invoice",
                                        "",
                                        [],
                                        false,
                                        item.emp_id,
                                        true,
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
                {isViewExpanded && renderCRMtreeSecondLevel()}
              </View>
            );
          })}
      </>
    );
  };

  const renderCRMtreeSecondLevel = () => {
    return (
      <>
        {crmSecondLevelData.length > 0 &&
          crmSecondLevelData.map((item, index) => {
            return (
              <View
                style={{
                  borderColor:
                    isSecondLevelExpanded && indexLocal === index
                      ? Colors.BLUE
                      : "",
                  borderWidth:
                    isSecondLevelExpanded && indexLocal === index ? 1 : 0,
                  borderRadius: 10,
                  margin:
                    isSecondLevelExpanded && indexLocal === index ? 10 : 0,
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
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.emp_name}
                  </Text>
                </View>
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    // navigation.navigate(
                    //   AppNavigator.HomeStackIdentifiers.sourceModel,
                    //   {
                    //     empId: selector.saveLiveleadObject?.selectedempId[0],
                    //     headerTitle: item?.emp_name,
                    //     loggedInEmpId:
                    //       selector.saveLiveleadObject?.selectedempId[0],
                    //     type: "TEAM",
                    //     moduleType: "live-leads",
                    //   }
                    // );

                    if (isSecondLevelExpanded) {
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={getBranchName(item?.branch)}
                        color={
                          item.roleName.toLowerCase() === "field dse"
                            ? "#2C97DE"
                            : "#FF4040"
                        }
                        titleClick={async () => {
                          // setIsViewExpanded(!isViewExpanded)
                          // setIsSecondLevelExpanded(!isSecondLevelExpanded)
                          formateSaleConsutantDataCRM(item, index);
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
                        {[
                          isSecondLevelExpanded &&
                          index === indexLocal &&
                          crmSecondLevelSelectedData
                            ? crmSecondLevelSelectedData[0].contactCount
                            : item.contactCount || 0,
                          isSecondLevelExpanded &&
                          index === indexLocal &&
                          crmSecondLevelSelectedData
                            ? crmSecondLevelSelectedData[0].enquiryCount
                            : item.enquiryCount || 0,
                          isSecondLevelExpanded &&
                          index === indexLocal &&
                          crmSecondLevelSelectedData
                            ? crmSecondLevelSelectedData[0].bookingCount
                            : item.bookingCount || 0,
                          isSecondLevelExpanded &&
                          index === indexLocal &&
                          crmSecondLevelSelectedData
                            ? crmSecondLevelSelectedData[0].retailCount
                            : item.retailCount || 0,
                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (isSecondLevelExpanded) {
                                    if (index === 0) {
                                      navigateToEMS(
                                        "Contact",
                                        "",
                                        [item.emp_id],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    } else if (index === 1) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [item.emp_id],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    } else if (index === 2) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [item.emp_id],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    } else if (index === 3) {
                                      navigateToEMS(
                                        "Invoice",
                                        "",
                                        [item.emp_id],
                                        false,
                                        item.emp_id,
                                        false
                                      );
                                    }
                                  } else {
                                    if (item.roleName == "Field DSE") {
                                      if (index === 0) {
                                        navigateToEMS(
                                          "Contact",
                                          "",
                                          [item.emp_id],
                                          false,
                                          storeFirstLevelLocal.emp_id,
                                          false
                                        );
                                      } else if (index === 1) {
                                        navigateToEMS(
                                          "ENQUIRY",
                                          "",
                                          [item.emp_id],
                                          false,
                                          storeFirstLevelLocal.emp_id,
                                          false
                                        );
                                      } else if (index === 2) {
                                        navigateToEMS(
                                          "BOOKING",
                                          "",
                                          [item.emp_id],
                                          false,
                                          storeFirstLevelLocal.emp_id,
                                          false
                                        );
                                      } else if (index === 3) {
                                        navigateToEMS(
                                          "Invoice",
                                          "",
                                          [item.emp_id],
                                          false,
                                          storeFirstLevelLocal.emp_id,
                                          false
                                        );
                                      }
                                    } else {
                                      if (index === 0) {
                                        navigateToEMS(
                                          "Contact",
                                          "",
                                          [],
                                          false,
                                          item.emp_id,
                                          false
                                        );
                                      } else if (index === 1) {
                                        navigateToEMS(
                                          "ENQUIRY",
                                          "",
                                          [],
                                          false,
                                          item.emp_id,
                                          false
                                        );
                                      } else if (index === 2) {
                                        navigateToEMS(
                                          "BOOKING",
                                          "",
                                          [],
                                          false,
                                          item.emp_id,
                                          false
                                        );
                                      } else if (index === 3) {
                                        navigateToEMS(
                                          "Invoice",
                                          "",
                                          [],
                                          false,
                                          item.emp_id,
                                          false
                                        );
                                      }
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
                {isSecondLevelExpanded &&
                  index === indexLocal &&
                  renderCRMtreeThirdLevel()}
              </View>
            );
          })}
      </>
    );
  };

  const formateSaleConsutantDataCRM = (itemMain, index) => {
    // let salesconsultant = item.salesconsultant;

    setIndexLocal(index);

    if (index === indexLocal) {
      setIsSecondLevelExpanded(!isSecondLevelExpanded);
    } else {
      setIsSecondLevelExpanded(true);
    }

    setCrmThirdLevelData(itemMain?.salesconsultant);
    setstoreSecondLevelLocal(itemMain);

    let findSelectedRecData = itemMain?.salesconsultant?.filter(
      (item) => item.emp_id === itemMain.emp_id
    );

    setCrmSecondLevelSelectedData(findSelectedRecData);
  };

  const renderCRMtreeThirdLevel = () => {
    return (
      <>
        {crmThirdLevelData?.length > 0 &&
          crmThirdLevelData?.map((item, index) => {
            if (
              item.emp_id !== userData.empId &&
              crmSecondLevelSelectedData[0].emp_id !== item.emp_id
            ) {
              return (
                <View
                  style={
                    {
                      // borderColor: isSecondLevelExpanded && indexLocal === index ? Colors.BLUE : "",
                      // borderWidth: isSecondLevelExpanded && indexLocal === index ? 1 : 0,
                      // borderRadius: 10,
                      // margin: isSecondLevelExpanded && indexLocal === index ? 10 : 0
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
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item?.emp_name}
                    </Text>
                  </View>
                  <Pressable
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                      handleSourceModalNavigation(
                        item,
                        storeSecondLevelLocal.emp_id,
                        [item.emp_id]
                      );
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
                        <RenderLevel1NameViewCRM
                          level={0}
                          item={item}
                          branchName={getBranchName(item?.branch)}
                          color={"#2C97DE"}
                          titleClick={async () => {
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
                          {[
                            item.contactCount || 0,
                            item.enquiryCount || 0,
                            item.bookingCount || 0,
                            item.retailCount || 0,
                          ].map((e, index) => {
                            return (
                              <Pressable
                                onPress={() => {
                                  if (e > 0) {
                                    if (index === 0) {
                                      navigateToEMS(
                                        "Contact",
                                        "",
                                        [item.emp_id],
                                        false,
                                        storeSecondLevelLocal.emp_id,
                                        false
                                      );
                                    } else if (index === 1) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [item.emp_id],
                                        false,
                                        storeSecondLevelLocal.emp_id,
                                        false
                                      );
                                    } else if (index === 2) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [item.emp_id],
                                        false,
                                        storeSecondLevelLocal.emp_id,
                                        false
                                      );
                                    } else if (index === 3) {
                                      navigateToEMS(
                                        "Invoice",
                                        "",
                                        [item.emp_id],
                                        false,
                                        storeSecondLevelLocal.emp_id,
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
                </View>
              );
            }
          })}
      </>
    );
  };

  const handleNavigationTOSourcrModelVol2 = (item,leadlist)=>{
    navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
      empId:"",
      headerTitle: item.empName,
      loggedInEmpId: "",
      type: "TEAM",
      moduleType: "live-leads",
      // headerTitle: "Source/Model",
      orgId: userData.orgId,
      role: item.roleName,
      branchList: userData.branchs.map((a) => a.branchId),
      empList: leadlist,
      self: false,
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
        navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "live-leads",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: item.roleName,
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
          self: false,
        });
        break;
      case "cre":
        navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "live-leads",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: item.roleName,
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
          self: false,
        });
        break;
      case "field dse":
        navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "live-leads",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: item.roleName,
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
          self: false,
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
        // navigation.navigate(
        //   AppNavigator.HomeStackIdentifiers.sourceModel,
        //   {
        //     empId: parentId ? parentId : item.emp_id,
        //     headerTitle: item?.emp_name,
        //     loggedInEmpId:
        //       parentId ? parentId : item.emp_id,
        //     type: "TEAM",
        //     moduleType: "live-leads",
        //   }
        // )

        navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
          empId: parentId ? parentId : item?.emp_id,
          headerTitle: item?.emp_name,
          loggedInEmpId: parentId ? parentId : item.emp_id,
          type: "TEAM",
          moduleType: "live-leads",
          headerTitle: "Source/Model",
          orgId: userData.orgId,
          role: role == "CRM" ? "CRM" : "CRM_INd",
          branchList: userData.branchs.map((a) => a.branchId),
          empList: empList,
          self: self,
        });
        break;
      default:
        break;
    }
  };

  const oncllickOfEmployeeForCRm = async (item = [], index, allData, herirarchyLevel) => {

    let modifeidArray = [...crmVol2AlluserData];
    let storeTemp = [...crmVol2Level1];

    let tempNewArray = await modifeidArray.filter(i => i.managerId != i.empId && i.managerId == item.empId)

    await item.isOpenInner ? (item.isOpenInner = false,
      item.innerData = []) : (item.isOpenInner = true, item.innerData.push(...tempNewArray))

    await setCrmVol2Level1(storeTemp);
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

  const oncllickOfEmployee = async (item = [], index, allData, herirarchyLevel) => {

    let modifeidArray = [...receptionistVol2AlluserData];
    let storeTemp = [...receptionistVol2Level1];



    //   let temp = modifeidArray.map((itemLocal, indexLocal) =>
    //     index == indexLocal ?
    //       { ...itemLocal, isOpenInner: true } : { ...itemLocal, isOpenInner: false }
    //   )

    let tempNewArray = await modifeidArray.filter(i => i.managerId != i.empId && i.managerId == item.empId)


    await item.isOpenInner ? (item.isOpenInner = false,
      item.innerData = []) : (item.isOpenInner = true, item.innerData.push(...tempNewArray))





    // Array.prototype.push.apply(storeTemp, tempNewArray)


    await setReceptionistVol2Level1(storeTemp);


  }

  function navigateToContactVol2(leadidList) {
    navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
      screen: "EMS",
      params: {
        screen: "PRE_ENQUIRY",
        params: {
          screenName: "TargetScreenCRMVol2",
          params: "",
          moduleType: "live-leadsV2",
          employeeDetail: "",
          selectedEmpId: "",
          startDate: "",
          endDate: "",
          dealerCodes: leadidList, // sending lead ids in this 
          ignoreSelectedId: "",
          parentId: "",
        },
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
          moduleType: "live-leadsV2",
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

  // todo manthan
  const renderCRMFirstLevelVol2 = () => {
    return (
      <>
        {crmVol2Level0.length > 0 &&
          crmVol2Level0.map((item, index) => {
            return (
              <View
                style={{
                  borderRadius: 10,
                  borderWidth: isRecepVol2Level0Expanded ? 2 : 0,
                  borderColor: "#C62159",
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
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    if (!isRecepVol2Level0Expanded) {
                      let tempArry = [];
                      Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                      Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                      Array.prototype.push.apply(tempArry, item.total.retailLeads)
                      Array.prototype.push.apply(tempArry, item.total.contactLeads)


                      // handleSourcrModelNavigationVol2(item, tempArry,)
                      handleNavigationTOSourcrModelVol2(item, tempArry)
                    } else {
                      let tempArry = [];
                      Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                      Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                      Array.prototype.push.apply(tempArry, item.self.retailLeads)
                      Array.prototype.push.apply(tempArry, item.self.contactLeads)

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
                          isRecepVol2Level0Expanded ? item.self.contactCount : item.total.contactCount || 0,
                          isRecepVol2Level0Expanded ? item.self.enquiryCount : item.total.enquiryCount || 0,

                          isRecepVol2Level0Expanded ? item.self.bookingCount : item.total.bookingCount || 0,
                          isRecepVol2Level0Expanded ? item.self.retailCount : item.total.retailCount || 0,

                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (isRecepVol2Level0Expanded) {
                                    if (index === 0) {
                                      navigateToContactVol2(item.self.contactLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.self.enquiryLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.self.bookingLeads)
                                    } else if (index === 3) {
                                      navigateToEmsVol2(item.self.retailLeads)
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToContactVol2(item.total.contactLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.total.enquiryLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.total.bookingLeads)
                                    } else if (index === 3) {
                                      navigateToEmsVol2(item.total.retailLeads)
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
                {isRecepVol2Level0Expanded && renderCRMNewTreeLevel1()}
              </View>
            );
          })}
        {renderCRMNonReportingUserTreeVol2()}
      </>
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
                    {item.selfUser.empName}
                    {"  "}
                       {"-   " + item.selfUser?.roleName}
                  </Text>
                </View>
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    if (!item.selfUser.isOpenInner) {
                      let tempArry = [];
                      Array.prototype.push.apply(tempArry, item.selfUser.total.contactLeads)
                      Array.prototype.push.apply(tempArry, item.selfUser.total.enquiryLeads)
                      Array.prototype.push.apply(tempArry, item.selfUser.total.bookingLeads)
                      Array.prototype.push.apply(tempArry, item.selfUser.total.retailLeads)



                      // handleSourcrModelNavigationVol2(item, tempArry,)
                      handleNavigationTOSourcrModelVol2(item.selfUser, tempArry)
                    } else {
                      let tempArry = [];
                      Array.prototype.push.apply(tempArry, item.selfUser.self.enquiryLeads)
                      Array.prototype.push.apply(tempArry, item.selfUser.self.bookingLeads)
                      Array.prototype.push.apply(tempArry, item.selfUser.self.retailLeads)
                      Array.prototype.push.apply(tempArry, item.selfUser.self.contactLeads)

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
                          item.selfUser.isOpenInner ? item.selfUser.self.contactCount : item.selfUser.total.contactCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.enquiryCount : item.selfUser.total.enquiryCount || 0,

                          item.selfUser.isOpenInner ? item.selfUser.self.bookingCount : item.selfUser.total.bookingCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.retailCount : item.selfUser.total.retailCount || 0,

                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (item.selfUser.isOpenInner) {
                                    if (index === 0) {
                                      navigateToContactVol2(item.selfUser.self.contactLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.selfUser.self.enquiryLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.selfUser.self.bookingLeads)
                                    } else if (index === 3) {
                                      navigateToEmsVol2(item.selfUser.self.retailLeads)
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToContactVol2(item.selfUser.total.contactLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.selfUser.total.enquiryLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.selfUser.total.bookingLeads)
                                    } else if (index === 3) {
                                      navigateToEmsVol2(item.selfUser.total.retailLeads)
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
              // <View
              //   key={`${item.selfUser.empName} ${index}`}
              //   style={{
              //     borderRadius: 10,
              //     borderWidth: item.selfUser.isOpenInner ? 2 : 0,
              //     borderColor: borderColor,
              //     backgroundColor: "#FFFFFF",
              //   }}
              // >
              //   <View
              //     style={{
              //       paddingHorizontal: 8,
              //       display: "flex",
              //       flexDirection: "row",
              //       justifyContent: "space-between",
              //       marginTop: 12,
              //       width: Dimensions.get("screen").width - 28,
              //     }}
              //   >
              //     <View style={{ flexDirection: "row" }}>
              //       <Text
              //         style={{
              //           fontSize: 12,
              //           fontWeight: "600",
              //           textTransform: "capitalize",
              //         }}
              //       >
              //         {item.selfUser.empName}
              //         {"  "}
              //         {"-   " + item.selfUser?.roleName}
              //       </Text>
              //     </View>
              //     <View style={{ flexDirection: "row" }}></View>
              //     <View style={{ flexDirection: "row" }}>
              //       {/* {selector.receptionistData?.fullResponse?.childUserCount >
              //         0 && (
              //           <Animated.View
              //             style={{
              //               transform: [{ translateX: translation }],
              //             }}
              //           >
              //             <View
              //               style={{
              //                 backgroundColor: "lightgrey",
              //                 flexDirection: "row",
              //                 paddingHorizontal: 7,
              //                 borderRadius: 10,
              //                 alignItems: "center",
              //                 justifyContent: "space-between",
              //                 marginBottom: 5,
              //                 alignSelf: "flex-start",
              //                 marginLeft: 7,
              //                 // transform: [{ translateX: translation }],
              //               }}
              //             >
              //               <MaterialIcons
              //                 name="person"
              //                 size={15}
              //                 color={Colors.BLACK}
              //               />
              //               <Text>
              //                 {
              //                   selector.receptionistData?.fullResponse
              //                     ?.childUserCount
              //                 }
              //               </Text>
              //             </View>
              //           </Animated.View>
              //         )} */}
              //       <SourceModelView
              //         onClick={() => {


              //           if (!item.selfUser.isOpenInner) {

              //             let tempArry = [];
              //             Array.prototype.push.apply(tempArry, item.selfUser.total.enquiryLeads)
              //             Array.prototype.push.apply(tempArry, item.selfUser.total.bookingLeads)
              //             Array.prototype.push.apply(tempArry, item.selfUser.total.retailLeads)
              //             Array.prototype.push.apply(tempArry, item.selfUser.total.lostLeads)


              //             handleSourcrModelNavigationVol2(tempArry, item.roleName)
              //           } else {
              //             let tempArry = [];
              //             Array.prototype.push.apply(tempArry, item.selfUser.self.enquiryLeads)
              //             Array.prototype.push.apply(tempArry, item.selfUser.self.bookingLeads)
              //             Array.prototype.push.apply(tempArry, item.selfUser.self.retailLeads)
              //             Array.prototype.push.apply(tempArry, item.selfUser.self.lostLeads)

              //             handleSourcrModelNavigationVol2(tempArry, item.selfUser.roleName)
              //           }

              //           // navigation.navigate(
              //           //   "RECEP_SOURCE_MODEL",
              //           //   {
              //           //     empId: item?.emp_id,
              //           //     headerTitle: item?.emp_name,
              //           //     loggedInEmpId: item.emp_id,
              //           //     type: "TEAM",
              //           //     moduleType: "home",
              //           //     headerTitle: "Source/Model",
              //           //     orgId: userData.orgId,
              //           //     role: userData.hrmsRole,
              //           //     branchList: userData.branchs.map(
              //           //       (a) => a.branchId
              //           //     ),
              //           //   }
              //           // );
              //         }}
              //         style={{
              //           // transform: [{ translateX: translation }],
              //         }}
              //       />
              //     </View>
              //   </View>

              //   {/*Source/Model View END */}
              //   <View
              //     style={[
              //       { flexDirection: "row" },
              //       item.isOpenInner && {
              //         borderRadius: 10,
              //         borderWidth: 2,
              //         borderColor: "#C62159",
              //         marginHorizontal: 6,
              //         overflow: "hidden",
              //       },
              //     ]}
              //   >
              //     {/*RIGHT SIDE VIEW*/}
              //     <View style={[styles.view6]}>
              //       <View style={styles.view7}>
              //         <RenderLevel1NameViewCRM
              //           level={0}
              //           item={item.selfUser}
              //           branchName={item.selfUser.branchName}
              //           color={borderColor}
              //           receptionManager={true}
              //           navigation={navigation}
              //           titleClick={async (e) => {

              //             formateNonReportingUserData(item.selfUser, index, crmVol2NonReportingData, 0);
              //           }}
              //           roleName={item.selfUser.roleName}
              //           stopLocation={true}
              //         />
              //         <View
              //           style={{
              //             flex: 1,
              //             backgroundColor: "rgba(223,228,231,0.67)",
              //             alignItems: "center",
              //             flexDirection: "row",
              //           }}
              //         >
              //           {[
              //             item.selfUser.isOpenInner ? item.selfUser.self.enquiryCount : item.selfUser.total.enquiryCount || 0,

              //             item.selfUser.isOpenInner ? item.selfUser.self.bookingCount : item.selfUser.total.bookingCount || 0,
              //             item.selfUser.isOpenInner ? item.selfUser.self.retailCount : item.selfUser.total.retailCount || 0,
              //             item.selfUser.isOpenInner ? item.selfUser.self.lostCount : item.selfUser.total.lostCount || 0
              //           ].map((e, indexss) => {
              //             return (
              //               <Pressable
              //                 onPress={() => {
              //                   // todo redirections logic  first level
              //                   if (e > 0) {


              //                     if (item.selfUser.isOpenInner) {
              //                       if (indexss === 0) {
              //                         navigateToEmsVol2(item.selfUser.self.enquiryLeads)

              //                       } else if (indexss === 1) {
              //                         navigateToEmsVol2(item.selfUser.self.bookingLeads)
              //                       } else if (indexss === 2) {
              //                         navigateToEmsVol2(item.selfUser.self.retailLeads)
              //                       } else if (indexss === 3) {
              //                         navigateToDropAnalysisVol2(item.selfUser.self.lostLeads)
              //                       }
              //                     } else {
              //                       if (indexss === 0) {
              //                         navigateToEmsVol2(item.selfUser.total.enquiryLeads)

              //                       } else if (indexss === 1) {
              //                         navigateToEmsVol2(item.selfUser.total.bookingLeads)
              //                       } else if (indexss === 2) {
              //                         navigateToEmsVol2(item.selfUser.total.retailLeads)
              //                       } else if (indexss === 3) {
              //                         // todo navigate to lost

              //                         navigateToDropAnalysisVol2(item.selfUser.total.lostLeads)
              //                       }
              //                     }
              //                   }
              //                 }}
              //               >
              //                 <View
              //                   style={{
              //                     width: 55,
              //                     height: 30,
              //                     justifyContent: "center",
              //                     alignItems: "center",
              //                   }}
              //                 >
              //                   <Text
              //                     style={{
              //                       fontSize: 16,
              //                       fontWeight: "700",
              //                       textDecorationLine:
              //                         e > 0 ? "underline" : "none",
              //                       // marginLeft: 50,
              //                     }}
              //                   >
              //                     {e || 0}
              //                   </Text>
              //                 </View>
              //               </Pressable>
              //             );
              //           })}
              //         </View>
              //       </View>
              //       {/* GET EMPLOYEE TOTAL MAIN ITEM */}
              //     </View>
              //   </View>
              //   {item.selfUser.isOpenInner && renderReportingUserTree(item.selfUser)}
              // </View>
            );
            // }
          })}
        {/* {renderCREFirstLevel()} */}
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
                    {item.selfUser.empName}
                       {"  "}
                       {"-   " + item.selfUser?.roleName}
                  </Text>
                </View>
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    if (!isRecepVol2Level0Expanded) {
                      let tempArry = [];
                      Array.prototype.push.apply(tempArry, item.total.contactLeads)
                      Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                      Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                      Array.prototype.push.apply(tempArry, item.total.retailLeads)



                      // handleSourcrModelNavigationVol2(item, tempArry,)
                      handleNavigationTOSourcrModelVol2(item, tempArry)
                    } else {
                      let tempArry = [];
                      Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                      Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                      Array.prototype.push.apply(tempArry, item.self.retailLeads)
                      Array.prototype.push.apply(tempArry, item.self.contactLeads)

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
                          item.selfUser.isOpenInner ? item.selfUser.self.contactCount : item.selfUser.total.contactCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.enquiryCount : item.selfUser.total.enquiryCount || 0,

                          item.selfUser.isOpenInner ? item.selfUser.self.bookingCount : item.selfUser.total.bookingCount || 0,
                          item.selfUser.isOpenInner ? item.selfUser.self.retailCount : item.selfUser.total.retailCount || 0,

                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (item.selfUser.isOpenInner) {
                                    if (index === 0) {
                                      navigateToContactVol2(item.selfUser.self.contactLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.selfUser.self.enquiryLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.selfUser.self.bookingLeads)
                                    } else if (index === 3) {
                                      navigateToEmsVol2(item.selfUser.self.retailLeads)
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToContactVol2(item.selfUser.total.contactLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.selfUser.total.enquiryLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.selfUser.total.bookingLeads)
                                    } else if (index === 3) {
                                      navigateToEmsVol2(item.selfUser.total.retailLeads)
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

// todo manthan
  const renderReceptionistFirstLevelVol2 = () => {
    return (
      <>
        {receptionistVol2Level0.length > 0 &&
          receptionistVol2Level0.map((item, index) => {
            return (
              <View
                style={{
                  borderRadius: 10,
                  borderWidth: isRecepVol2Level0Expanded ? 2 : 0,
                  borderColor: "#C62159",
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
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    if (!isRecepVol2Level0Expanded) {
                      let tempArry = [];
                      Array.prototype.push.apply(tempArry, item.total.contactLeads)
                      Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                      Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                      Array.prototype.push.apply(tempArry, item.total.retailLeads)
                    


                      // handleSourcrModelNavigationVol2(item, tempArry,)
                      handleNavigationTOSourcrModelVol2(item, tempArry)
                    } else {
                      let tempArry = [];
                      Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                      Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                      Array.prototype.push.apply(tempArry, item.self.retailLeads)
                      Array.prototype.push.apply(tempArry, item.self.contactLeads)

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
                          isRecepVol2Level0Expanded ? item.self.contactCount : item.total.contactCount || 0,
                          isRecepVol2Level0Expanded ? item.self.enquiryCount : item.total.enquiryCount || 0,

                          isRecepVol2Level0Expanded ? item.self.bookingCount : item.total.bookingCount || 0,
                          isRecepVol2Level0Expanded ? item.self.retailCount : item.total.retailCount || 0,
                          
                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (isRecepVol2Level0Expanded) {
                                    if (index === 0) {
                                      navigateToContactVol2(item.self.contactLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.self.enquiryLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.self.bookingLeads)
                                    } else if (index === 3) {
                                      navigateToEmsVol2(item.self.retailLeads)
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToContactVol2(item.total.contactLeads)

                                    } else if (index === 1) {
                                      navigateToEmsVol2(item.total.enquiryLeads)
                                    } else if (index === 2) {
                                      navigateToEmsVol2(item.total.bookingLeads)
                                    } else if (index === 3) {
                                      navigateToEmsVol2(item.total.retailLeads)
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
                {isRecepVol2Level0Expanded && renderReceptionistNewTreeLevel1()}
              </View>
            );
          })}
      </>
    );
  };


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
        {/* {renderCRMReportingUserTreeVol2()} */}
      </View>
    );
  };

  const formateReportingUserDataForLevelN = async (item, index, originalData, heirarchyLevel) => {


    let modifiedData = _.cloneDeep(originalData);

    let filtrData = modifiedData.filter((itemInn) => itemInn.managerId != itemInn.empId && itemInn.managerId == item.empId)

    await item.isOpenInner ? (item.isOpenInner = false,
      item.innerData = []) : (item.isOpenInner = true, item.innerData.push(...filtrData))

    setCrmVol2ReportingData([...crmVol2ReportingData])


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
                    // transform: [{ translateX: translation }],
                  }}
                >
                  {/* <View
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
                  </View> */}
                </Animated.View>
              )}
            <SourceModelView
              onClick={() => {
                if (!item.isOpenInner) {

                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.total.retailLeads)
                  Array.prototype.push.apply(tempArry, item.total.contactLeads)


                  handleNavigationTOSourcrModelVol2(item, tempArry)
                } else {
                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.self.retailLeads)
                  Array.prototype.push.apply(tempArry, item.self.contactLeads)

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
                  item.isOpenInner ? item.self.contactCount : item.total.contactCount || 0,
                  item.isOpenInner ? item.self.enquiryCount : item.total.enquiryCount || 0,

                  item.isOpenInner ? item.self.bookingCount : item.total.bookingCount || 0,
                  item.isOpenInner ? item.self.retailCount : item.total.retailCount || 0,

                ].map((e, index) => {
                  return (
                    <Pressable
                      onPress={() => {
                        if (e > 0) {
                          if (item.isOpenInner) {
                            if (index === 0) {
                              navigateToContactVol2(item.self.contactLeads)

                            } else if (index === 1) {
                              navigateToEmsVol2(item.self.enquiryLeads)
                            } else if (index === 2) {
                              navigateToEmsVol2(item.self.bookingLeads)
                            } else if (index === 3) {
                              navigateToEmsVol2(item.total.retailLeads)
                            }
                          } else {
                            if (index === 0) {
                              navigateToContactVol2(item.total.contactLeads)

                            } else if (index === 1) {
                              navigateToEmsVol2(item.total.enquiryLeads)
                            } else if (index === 2) {
                              navigateToEmsVol2(item.total.bookingLeads)
                            } else if (index === 3) {
                              navigateToEmsVol2(item.total.retailLeads)

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
                    // transform: [{ translateX: translation }],
                  }}
                >
                  {/* <View
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
                  </View> */}
                </Animated.View>
              )}
            <SourceModelView
              onClick={() => {
                if (!item.isOpenInner) {

                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.total.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.total.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.total.retailLeads)
                  Array.prototype.push.apply(tempArry, item.total.contactLeads)


                  handleNavigationTOSourcrModelVol2( item,tempArry)
                } else {
                  let tempArry = [];
                  Array.prototype.push.apply(tempArry, item.self.enquiryLeads)
                  Array.prototype.push.apply(tempArry, item.self.bookingLeads)
                  Array.prototype.push.apply(tempArry, item.self.retailLeads)
                  Array.prototype.push.apply(tempArry, item.self.contactLeads)

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
                    oncllickOfEmployee(item, index, allData, newLevel);
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
                  item.isOpenInner ? item.self.contactCount : item.total.contactCount || 0,
                  item.isOpenInner ? item.self.enquiryCount : item.total.enquiryCount || 0,

                  item.isOpenInner ? item.self.bookingCount : item.total.bookingCount || 0,
                  item.isOpenInner ? item.self.retailCount : item.total.retailCount || 0,
                
                ].map((e, index) => {
                  return (
                    <Pressable
                      onPress={() => {
                        if (e > 0) {
                           if (item.isOpenInner) {
                             if (index === 0) {
                               navigateToContactVol2(item.self.contactLeads)
                            
                             } else if (index === 1) {
                               navigateToEmsVol2(item.self.enquiryLeads)
                             } else if (index === 2) {
                               navigateToEmsVol2(item.self.bookingLeads)
                             } else if (index === 3) {
                               navigateToEmsVol2(item.total.retailLeads)
                          }
                        } else {
                             if (index === 0) {
                               navigateToContactVol2(item.total.contactLeads)

                             } else if (index === 1) {
                               navigateToEmsVol2(item.total.enquiryLeads)
                             } else if (index === 2) {
                               navigateToEmsVol2(item.total.bookingLeads)
                             } else if (index === 3) {
                               navigateToEmsVol2(item.total.retailLeads)
                            
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


  const renderCRMFilterView = () => {
    return (
      <>
        {CRM_filterParameters.length > 0 &&
          CRM_filterParameters.map((item, index) => {
            return (
              <View
                style={{
                  borderColor: isFilterViewExapanded ? Colors.BLUE : "",
                  borderWidth: isFilterViewExapanded ? 1 : 0,
                  borderRadius: 10,
                  margin: isFilterViewExapanded ? 5 : 0,
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
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.emp_name}
                  </Text>
                </View>
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    if (isFilterViewExapanded) {
                      handleSourceModalNavigation(item, item.emp_id, [
                        item.emp_id,
                      ]);
                    } else {
                      handleSourceModalNavigation(item, item.emp_id, []);
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={getBranchName(item?.branch)}
                        color={Colors.CORAL}
                        titleClick={async () => {
                          setisFilterViewExapanded(!isFilterViewExapanded);
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
                          isFilterViewExapanded
                            ? item.contactCount
                            : selector.receptionist_self_data?.contactsCount ||
                              0,
                          isFilterViewExapanded
                            ? item.enquiryCount
                            : selector.receptionist_self_data?.enquirysCount ||
                              0,
                          isFilterViewExapanded
                            ? item.bookingCount
                            : selector.receptionist_self_data?.bookingsCount ||
                              0,
                          isFilterViewExapanded
                            ? item.retailCount
                            : selector.receptionist_self_data?.RetailCount || 0,
                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                if (e > 0) {
                                  if (isFilterViewExapanded) {
                                    if (index === 0) {
                                      navigateToEMS(
                                        "Contact",
                                        "",
                                        [item.emp_id],
                                        false,
                                        userData.empId,
                                        true
                                      );
                                    } else if (index === 1) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [item.emp_id],
                                        false,
                                        userData.empId,
                                        true
                                      );
                                    } else if (index === 2) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [item.emp_id],
                                        false,
                                        userData.empId,
                                        true
                                      );
                                    } else if (index === 3) {
                                      navigateToEMS(
                                        "Invoice",
                                        "",
                                        [item.emp_id],
                                        false,
                                        userData.empId,
                                        true
                                      );
                                    }
                                  } else {
                                    if (index === 0) {
                                      navigateToEMS(
                                        "Contact",
                                        "",
                                        [],
                                        false,
                                        userData.empId,
                                        true
                                      );
                                    } else if (index === 1) {
                                      navigateToEMS(
                                        "ENQUIRY",
                                        "",
                                        [],
                                        false,
                                        userData.empId,
                                        true
                                      );
                                    } else if (index === 2) {
                                      navigateToEMS(
                                        "BOOKING",
                                        "",
                                        [],
                                        false,
                                        userData.empId,
                                        true
                                      );
                                    } else if (index === 3) {
                                      navigateToEMS(
                                        "Invoice",
                                        "",
                                        [],
                                        false,
                                        userData.empId,
                                        true
                                      );
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
                {isFilterViewExapanded && renderCRMFilterViewSecondLevel()}
              </View>
            );
          })}
      </>
    );
  };

  const renderCRMFilterViewSecondLevel = () => {
    return (
      <>
        {CRM_filterParametersSecondLevel.length > 0 &&
          CRM_filterParametersSecondLevel.map((item, index) => {
            return (
              <View
                style={
                  {
                    // borderColor: isSecondLevelExpanded && indexLocal === index ? Colors.BLUE : "",
                    // borderWidth: isSecondLevelExpanded && indexLocal === index ? 1 : 0,
                    // borderRadius: 10,
                    // margin: isSecondLevelExpanded && indexLocal === index ? 10 : 0
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
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.emp_name}
                  </Text>
                </View>
                <Pressable
                  style={{ alignSelf: "flex-end" }}
                  onPress={() => {
                    handleSourceModalNavigation(
                      item,
                      selector.saveLiveleadObjectCRM?.selectedempId[0],
                      [item.emp_id]
                    );
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={getBranchName(item?.branch)}
                        color={"#2C97DE"}
                        titleClick={async () => {
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
                        {[
                          item?.contactCount || 0,
                          item?.enquiryCount || 0,
                          item?.bookingCount || 0,
                          item?.retailCount || 0,
                        ].map((e, index) => {
                          return (
                            <Pressable
                              onPress={() => {
                                // todo redirections logic filter UI
                                if (e > 0) {
                                  if (index === 0) {
                                    navigateToEMS(
                                      "Contact",
                                      "",
                                      [item.emp_id],
                                      false,
                                      selector.saveLiveleadObjectCRM
                                        ?.selectedempId[0],
                                      true
                                    );
                                  } else if (index === 1) {
                                    navigateToEMS(
                                      "ENQUIRY",
                                      "",
                                      [item.emp_id],
                                      false,
                                      selector.saveLiveleadObjectCRM
                                        ?.selectedempId[0],
                                      true
                                    );
                                  } else if (index === 2) {
                                    navigateToEMS(
                                      "BOOKING",
                                      "",
                                      [item.emp_id],
                                      false,
                                      selector.saveLiveleadObjectCRM
                                        ?.selectedempId[0],
                                      true
                                    );
                                  } else if (index === 3) {
                                    navigateToEMS(
                                      "Invoice",
                                      "",
                                      [item.emp_id],
                                      false,
                                      selector.saveLiveleadObjectCRM
                                        ?.selectedempId[0],
                                      true
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
              </View>
            );
          })}
      </>
    );
  };

  const renderCRMFilterViewTeamTotal = () => {
    return (
      <>
        {totalOfTeamAfterFilter && (
          <View>
            <Pressable
              style={{ alignSelf: "flex-end" }}
              onPress={() => {
                navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
                  empId: selector.login_employee_details.empId,
                  headerTitle: "Grand Total",
                  loggedInEmpId: selector.login_employee_details.empId,
                  type: "TEAM",
                  moduleType: "live-leads",
                  orgId: userData.orgId,
                  role: userData.hrmsRole,
                  branchList: userData.branchs.map((a) => a.branchId),
                  self: false,
                });
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
                {/* Source/Model */}
              </Text>
            </Pressable>

            <View style={{ flexDirection: "row", height: 40 }}>
              <View
                style={{
                  width: 70,
                  minHeight: 40,
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: Colors.RED,
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: 6,
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
              </View>
              <View
                style={{
                  minHeight: 40,
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    // minHeight: 40,
                    flexDirection: "row",
                    // backgroundColor:"yellow"
                  }}
                >
                  {totalOfTeamAfterFilter.map((e) => {
                    return (
                      <View
                        style={{
                          width: 70,
                          height: 40,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: Colors.RED,
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
        )}
      </>
    );
  };

  const RenderEmployee = (item, index, allData, levelColors, newLevel) => {
    const hierarchyLevel = newLevel;
    const borderColor = levelColors[hierarchyLevel % levelColors.length];
    return (
      <View key={`${item.empId} ${index}`}>
        <View
          style={{
            paddingHorizontal: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 12,
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "600" }}>
            {item.empName}
          </Text>
          <Pressable
            onPress={() => {
              // navigation.navigate(
              //   AppNavigator.HomeStackIdentifiers.sourceModel,
              //   {
              //     empId: item.empId,
              //     headerTitle: item.empName,
              //     loggedInEmpId: selector.login_employee_details.empId,
              //     orgId: selector.login_employee_details.orgId,
              //     type: "TEAM",
              //     moduleType: "live-leads",
              //   }
              // );
              navigation.navigate(
                AppNavigator.HomeStackIdentifiers.sourceModel,
                {
                  empId: item.empId,
                  headerTitle: item.empName,
                  loggedInEmpId: selector.login_employee_details.empId,
                  orgId: selector.login_employee_details.orgId,
                  type: "TEAM",
                  moduleType: "live-leads",
                  isOpenner: item.isOpenInner, // added to manage source/model issue
                  isFromHome: true, // added to manage source/model issue
                }
              );
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: Colors.BLUE,
              }}
            >
              Source/Model
            </Text>
          </Pressable>
        </View>
        {/*Source/Model View END */}
        <View
          style={[
            { flexDirection: "row" },
            item.isOpenInner && {
              borderRadius: 10,
              borderWidth: 1,
              borderColor: borderColor,
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
                paddingHorizontal: 5,
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
                branchName={
                  checkIsSelfManager() ? "" : getBranchName(item.branchId)
                }
                color={borderColor}
                teamLoader={teamLoader}
                teamMember={teamMember}
                titleClick={async () => {
                  await onEmployeeNameClick2(item, index, allData);
                }}
              />
              {renderData(item, borderColor)}
            </View>
            {item.isOpenInner &&
              item.employeeTargetAchievements.length > 0 &&
              item.employeeTargetAchievements.map((innerItem1, innerIndex1) => {
                return RenderEmployee(
                  innerItem1,
                  innerIndex1,
                  item.employeeTargetAchievements,
                  levelColors,
                  hierarchyLevel + 1
                );
              })}
          </View>
        </View>
      </View>
    );
  };

  const checkIsSelfManager = () => {
    if (
      userData?.orgName?.includes("BikeWo Corporation") &&
      userData.isSelfManager == "Y"
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <View style={styles.container}>
        {selector.isTeam ? (
          <>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  // borderBottomWidth: 2,
                  // borderBottomColor: Colors.RED,
                  paddingBottom: 8,
                }}
              >
                {/*<SegmentedControl*/}
                {/*    style={{*/}
                {/*        marginHorizontal: 4,*/}
                {/*        justifyContent: 'center',*/}
                {/*        alignSelf: 'flex-end',*/}
                {/*        height: 24,*/}
                {/*        marginTop: 8,*/}
                {/*        width: '75%'*/}
                {/*    }}*/}
                {/*    values={['ETVBRL', 'Allied', 'View All']}*/}
                {/*    selectedIndex={toggleParamsIndex}*/}
                {/*    tintColor={Colors.RED}*/}
                {/*    fontStyle={{color: Colors.BLACK, fontSize: 10}}*/}
                {/*    activeFontStyle={{color: Colors.WHITE, fontSize: 10}}*/}
                {/*    onChange={event => {*/}
                {/*        const index = event.nativeEvent.selectedSegmentIndex;*/}
                {/*        let data = [...paramsMetadata];*/}
                {/*        if (index !== 2) {*/}
                {/*            data = data.filter(x => x.toggleIndex === index);*/}
                {/*        } else {*/}
                {/*            data = [...paramsMetadata];*/}
                {/*        }*/}
                {/*        setToggleParamsMetaData([...data]);*/}
                {/*        setToggleParamsIndex(index);*/}
                {/*    }}*/}
                {/*/>*/}
                {/*<View style={{height: 24, width: '20%', marginLeft: 4}}>*/}
                {/*    <View style={styles.percentageToggleView}>*/}
                {/*        <PercentageToggleControl toggleChange={(x) => setTogglePercentage(x)}/>*/}
                {/*    </View>*/}
                {/*</View>*/}
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
                >
                    <View style={styles.titleDashboardContainer}>
                      <Text style={styles.dashboardText}>Dashboard</Text>
                    </View>
                  {/* TOP Header view */}
                  <View
                    key={"headers"}
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 0.5,
                      paddingBottom: 4,
                      borderBottomColor: Colors.GRAY,
                    }}
                  >
                    {/* <View
                      style={{ width: 70, height: 20, marginRight: 5 }}
                    ></View> */}
                    {/* <View
                        // style={styles.itemBox}
                        style={{ width: 70, height: 20, marginRight: 5, alignItems: "center" }}
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
                        width: 70,
                        height: 20,
                        marginRight: 5,
                        alignItems: "flex-start",
                      }}
                    >
                      <View
                        style={[
                          styles.itemBox,
                          {
                            // width: 55,
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
                    <View
                      style={{
                        width: "100%",
                        height: 20,
                        flexDirection: "row",
                      }}
                    >
                      {toggleParamsMetaData.map((param) => {
                        return (
                          <View style={styles.itemBox} key={param.shortName}>
                            <Text
                              style={{
                                color: param.color,
                                fontSize: 12,
                              }}
                            >
                              {param.shortName}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {crmRole.includes(userData.hrmsRole) ? (
                    <>
                      {/*  vol2 new code  */}
                        {renderCRMFirstLevelVol2()}
                        
                        {/* Grand Total Section */}

                        {totalOfTeam && CRM_filterParameters.length == 0 && (
                          <View>
                            <Pressable
                              style={{ alignSelf: "flex-end" }}
                              onPress={() => {
                                let tempArry = [];

                                Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse?.totalEnquiryLeads)
                                Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse?.totalBookingLeads)
                                Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse?.totalRetailLeads)
                                Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse?.totalContactLeads)


                                let item = {
                                  empName: "Grand Total",
                                  roleName: ""
                                }
                                handleNavigationTOSourcrModelVol2(item, tempArry)
                                // navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
                                //   empId: selector.login_employee_details.empId,
                                //   headerTitle: "Grand Total",
                                //   loggedInEmpId:
                                //     selector.login_employee_details.empId,
                                //   type: "TEAM",
                                //   moduleType: "live-leads",
                                //   orgId: userData.orgId,
                                //   role: userData.hrmsRole,
                                //   branchList: userData.branchs.map(
                                //     (a) => a.branchId
                                //   ),
                                //   self: false,
                                // });
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

                            <View style={{ flexDirection: "row", height: 40 }}>
                              <View
                                style={{
                                  width: 70,
                                  minHeight: 40,
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  backgroundColor: Colors.RED,
                                }}
                              >
                                <View
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginLeft: 6,
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
                              </View>
                              <View
                                style={{
                                  minHeight: 40,
                                  flexDirection: "column",
                                }}
                              >
                                <View
                                  style={{
                                    // minHeight: 40,
                                    flexDirection: "row",
                                    // backgroundColor:"yellow"
                                  }}
                                >
                                  {totalOfTeam.map((e) => {
                                    return (
                                      <View
                                        style={{
                                          width: 70,
                                          height: 40,
                                          justifyContent: "center",
                                          alignItems: "center",
                                          backgroundColor: Colors.RED,
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
                        )}


                    {/* CRM vol1 working code  start */}
                    
                      {/* {CRM_filterParameters.length > 0
                        ? renderCRMFilterView()
                        : null}
                      {CRM_filterParameters.length > 0
                        ? renderCRMFilterViewTeamTotal()
                        : null}
                      {CRM_filterParameters.length == 0
                        ? renderCRMtreeFirstLevel()
                        : null}
                      {CRM_filterParameters.length == 0
                        ? renderCREtreeFirstLevel()
                        : null}
                      {/* Grand Total Section */}

                      {/* {totalOfTeam && CRM_filterParameters.length == 0 && (
                        <View>
                          <Pressable
                            style={{ alignSelf: "flex-end" }}
                            onPress={() => {
                              navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
                                empId: selector.login_employee_details.empId,
                                headerTitle: "Grand Total",
                                loggedInEmpId:
                                  selector.login_employee_details.empId,
                                type: "TEAM",
                                moduleType: "live-leads",
                                orgId: userData.orgId,
                                role: userData.hrmsRole,
                                branchList: userData.branchs.map(
                                  (a) => a.branchId
                                ),
                                self: false,
                              });
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

                          <View style={{ flexDirection: "row", height: 40 }}>
                            <View
                              style={{
                                width: 70,
                                minHeight: 40,
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                backgroundColor: Colors.RED,
                              }}
                            >
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginLeft: 6,
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
                            </View>
                            <View
                              style={{
                                minHeight: 40,
                                flexDirection: "column",
                              }}
                            >
                              <View
                                style={{
                                  // minHeight: 40,
                                  flexDirection: "row",
                                  // backgroundColor:"yellow"
                                }}
                              >
                                {totalOfTeam.map((e) => {
                                  return (
                                    <View
                                      style={{
                                        width: 70,
                                        height: 40,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: Colors.RED,
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
                      )}  */}
                        {/* CRM vol1 working code  end */}

                      {/* {selector.totalParameters.length > 0 && (
                        <View>
                          <Pressable
                            style={{ alignSelf: "flex-end" }}
                            onPress={() => {
                              navigation.navigate(
                                AppNavigator.HomeStackIdentifiers.sourceModel,
                                {
                                  empId: filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                                  headerTitle: "Grand Total",
                                  loggedInEmpId:
                                    filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                                  type: "TEAM",
                                  moduleType: "live-leads",
                                }
                              );
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

                          <View style={{ flexDirection: "row", height: 40 }}>
                            <View
                              style={{
                                width: 70,
                                minHeight: 40,
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                backgroundColor: Colors.RED,
                              }}
                            >
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginLeft: 6,
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
                                  moduleType={"live-leads"}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      )} */}
                    </>
                  ) : (
                    <>
                      {/* Employee params section */}
                      {filterParameters.length > 0 &&
                        filterParameters.map((item, index) => {
                          return (
                            <View>
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
                                  {item?.empName}
                                </Text>
                              </View>
                              <Pressable
                                style={{ alignSelf: "flex-end" }}
                                onPress={() => {
                                  navigation.navigate(
                                    AppNavigator.HomeStackIdentifiers
                                      .sourceModel,
                                    {
                                      empId:
                                        selector.saveLiveleadObject
                                          ?.selectedempId[0],
                                      headerTitle: item?.empName,
                                      loggedInEmpId:
                                        selector.saveLiveleadObject
                                          ?.selectedempId[0],
                                      type: "TEAM",
                                      moduleType: "live-leads",
                                    }
                                  );
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
                                    <RenderLevel1NameView
                                      level={0}
                                      item={item}
                                      branchName={
                                        checkIsSelfManager()
                                          ? ""
                                          : getBranchName(item?.branch)
                                      }
                                      color={"#C62159"}
                                      titleClick={async () => {
                                        return;
                                      }}
                                    />
                                    <View
                                      style={{
                                        width: "100%",
                                        height: boxHeight,
                                        flexDirection: "row",
                                        alignSelf: "center",
                                        // backgroundColor: "red",
                                      }}
                                    >
                                      {renderFilterData(item, "#C62159")}
                                    </View>
                                  </View>
                                  {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      {allParameters.length > 0 &&
                        allParameters.map((item, index) => {
                          return RenderEmployee(
                            item,
                            index,
                            allParameters,
                            color,
                            0
                          );
                        })}

                      {/* {allParameters.length > 0 && filterParameters.length == 0 && */}
                      {allParameters.length > 0 &&
                        allParameters.map((item, index) => {
                          return;
                          return (
                            <View key={`${item.empId} ${index}`}>
                              <View
                                style={{
                                  paddingHorizontal: 8,
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  marginTop: 12,
                                  width: "100%",
                                }}
                              >
                                <Text
                                  style={{ fontSize: 12, fontWeight: "600" }}
                                >
                                  {item.empName}
                                </Text>
                                <Pressable
                                  onPress={() => {
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
                                        moduleType: "live-leads",
                                      }
                                    );
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 12,
                                      fontWeight: "600",
                                      color: Colors.BLUE,
                                    }}
                                  >
                                    Source/Model
                                  </Text>
                                </Pressable>
                              </View>
                              {/*Source/Model View END */}
                              <View
                                style={[
                                  { flexDirection: "row" },
                                  item.isOpenInner && {
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: "#C62159",
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
                                      paddingHorizontal: 5,
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
                                        await onEmployeeNameClick(item, index);
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
                                              },
                                              innerItem1.isOpenInner && {
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                borderColor: "#F59D00",
                                                backgroundColor: "#FFFFFF",
                                              },
                                            ]}
                                          >
                                            <View
                                              style={[
                                                {
                                                  width: "100%",
                                                  minHeight: 40,
                                                  flexDirection: "column",
                                                },
                                              ]}
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
                                                <Pressable
                                                  onPress={() => {
                                                    navigation.navigate(
                                                      AppNavigator
                                                        .HomeStackIdentifiers
                                                        .sourceModel,
                                                      {
                                                        empId: innerItem1.empId,
                                                        headerTitle:
                                                          innerItem1.empName,
                                                        type: "TEAM",
                                                        moduleType:
                                                          "live-leads",
                                                      }
                                                    );
                                                  }}
                                                >
                                                  <Text
                                                    style={{
                                                      fontSize: 12,
                                                      fontWeight: "600",
                                                      color: Colors.BLUE,
                                                      marginLeft: 8,
                                                    }}
                                                  >
                                                    Source/Model
                                                  </Text>
                                                </Pressable>
                                              </View>
                                              {/*Source/Model View END */}
                                              <View
                                                style={{ flexDirection: "row" }}
                                              >
                                                <RenderLevel1NameView
                                                  level={1}
                                                  item={innerItem1}
                                                  color={"#F59D00"}
                                                  titleClick={async () => {
                                                    setSelectedName(
                                                      innerItem1.empName
                                                    );
                                                    setTimeout(() => {
                                                      setSelectedName("");
                                                    }, 900);
                                                    let localData = [
                                                      ...allParameters,
                                                    ];
                                                    let current =
                                                      localData[index]
                                                        .employeeTargetAchievements[
                                                        innerIndex1
                                                      ].isOpenInner;
                                                    for (
                                                      let i = 0;
                                                      i <
                                                      localData[index]
                                                        .employeeTargetAchievements
                                                        .length;
                                                      i++
                                                    ) {
                                                      localData[
                                                        index
                                                      ].employeeTargetAchievements[
                                                        i
                                                      ].isOpenInner = false;
                                                      if (
                                                        i ===
                                                        localData[index]
                                                          .employeeTargetAchievements
                                                          .length -
                                                          1
                                                      ) {
                                                        localData[
                                                          index
                                                        ].employeeTargetAchievements[
                                                          innerIndex1
                                                        ].isOpenInner =
                                                          !current;
                                                      }
                                                    }

                                                    if (!current) {
                                                      let employeeData =
                                                        await AsyncStore.getData(
                                                          AsyncStore.Keys
                                                            .LOGIN_EMPLOYEE
                                                        );
                                                      if (employeeData) {
                                                        const jsonObj =
                                                          JSON.parse(
                                                            employeeData
                                                          );
                                                        const dateFormat =
                                                          "YYYY-MM-DD";
                                                        const currentDate =
                                                          moment().format(
                                                            dateFormat
                                                          );
                                                        const monthFirstDate =
                                                          moment(
                                                            currentDate,
                                                            dateFormat
                                                          )
                                                            .subtract(
                                                              0,
                                                              "months"
                                                            )
                                                            .startOf("month")
                                                            .format(dateFormat);
                                                        const monthLastDate =
                                                          moment(
                                                            currentDate,
                                                            dateFormat
                                                          )
                                                            .subtract(
                                                              0,
                                                              "months"
                                                            )
                                                            .endOf("month")
                                                            .format(dateFormat);
                                                        let payload = {
                                                          orgId: jsonObj.orgId,
                                                          selectedEmpId:
                                                            innerItem1.empId,
                                                          endDate:
                                                            monthLastDate,
                                                          loggedInEmpId:
                                                            jsonObj.empId,
                                                          empId:
                                                            innerItem1.empId,
                                                          startDate:
                                                            monthFirstDate,
                                                          levelSelected: null,
                                                          pageNo: 0,
                                                          size: 100,
                                                        };
                                                        Promise.all([
                                                          dispatch(
                                                            getUserWiseTargetParameters(
                                                              payload
                                                            )
                                                          ),
                                                        ]).then(async (res) => {
                                                          let tempRawData = [];
                                                          tempRawData =
                                                            res[0]?.payload?.employeeTargetAchievements.filter(
                                                              (item) =>
                                                                item.empId !==
                                                                innerItem1.empId
                                                            );
                                                          if (
                                                            tempRawData.length >
                                                            0
                                                          ) {
                                                            for (
                                                              let i = 0;
                                                              i <
                                                              tempRawData.length;
                                                              i++
                                                            ) {
                                                              tempRawData[i] = {
                                                                ...tempRawData[
                                                                  i
                                                                ],
                                                                isOpenInner: false,
                                                                employeeTargetAchievements:
                                                                  [],
                                                                tempTargetAchievements:
                                                                  tempRawData[i]
                                                                    ?.targetAchievements,
                                                              };
                                                              if (
                                                                i ===
                                                                tempRawData.length -
                                                                  1
                                                              ) {
                                                                localData[
                                                                  index
                                                                ].employeeTargetAchievements[
                                                                  innerIndex1
                                                                ].employeeTargetAchievements =
                                                                  tempRawData;
                                                                let newIds =
                                                                  tempRawData.map(
                                                                    (emp) =>
                                                                      emp.empId
                                                                  );
                                                                if (
                                                                  newIds.length >=
                                                                  2
                                                                ) {
                                                                  for (
                                                                    let i = 0;
                                                                    i <
                                                                    newIds.length;
                                                                    i++
                                                                  ) {
                                                                    const element =
                                                                      newIds[
                                                                        i
                                                                      ].toString();
                                                                    let tempPayload =
                                                                      getTotalPayload(
                                                                        employeeData,
                                                                        element
                                                                      );
                                                                    const response =
                                                                      await client.post(
                                                                        URL.GET_LIVE_LEADS_INSIGHTS(),
                                                                        tempPayload
                                                                      );
                                                                    const json =
                                                                      await response.json();
                                                                    if (
                                                                      Array.isArray(
                                                                        json
                                                                      )
                                                                    ) {
                                                                      localData[
                                                                        index
                                                                      ].employeeTargetAchievements[
                                                                        innerIndex1
                                                                      ].employeeTargetAchievements[
                                                                        i
                                                                      ].targetAchievements =
                                                                        json;
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                          setAllParameters([
                                                            ...localData,
                                                          ]);
                                                        });

                                                        // if (localData[index].employeeTargetAchievements.length > 0) {
                                                        //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
                                                        //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
                                                        //   }
                                                        // }
                                                        // setAllParameters([...localData])
                                                      }
                                                    } else {
                                                      setAllParameters([
                                                        ...localData,
                                                      ]);
                                                    }
                                                    // setAllParameters([...localData])
                                                  }}
                                                />
                                                {renderData(
                                                  innerItem1,
                                                  "#F59D00"
                                                )}
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
                                                            width: "98%",
                                                            minHeight: 40,
                                                            flexDirection:
                                                              "column",
                                                          },
                                                          innerItem2.isOpenInner && {
                                                            borderRadius: 10,
                                                            borderWidth: 1,
                                                            borderColor:
                                                              "#2C97DE",
                                                            backgroundColor:
                                                              "#EEEEEE",
                                                            marginHorizontal: 5,
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
                                                          <Pressable
                                                            onPress={() => {
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
                                                                    "live-leads",
                                                                }
                                                              );
                                                            }}
                                                          >
                                                            <Text
                                                              style={{
                                                                fontSize: 12,
                                                                fontWeight:
                                                                  "600",
                                                                color:
                                                                  Colors.BLUE,
                                                                marginLeft: 8,
                                                              }}
                                                            >
                                                              Source/Model
                                                            </Text>
                                                          </Pressable>
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
                                                              setSelectedName(
                                                                innerItem2.empName
                                                              );
                                                              setTimeout(() => {
                                                                setSelectedName(
                                                                  ""
                                                                );
                                                              }, 900);
                                                              let localData = [
                                                                ...allParameters,
                                                              ];
                                                              let current =
                                                                localData[index]
                                                                  .employeeTargetAchievements[
                                                                  innerIndex1
                                                                ]
                                                                  .employeeTargetAchievements[
                                                                  innerIndex2
                                                                ].isOpenInner;
                                                              for (
                                                                let i = 0;
                                                                i <
                                                                localData[index]
                                                                  .employeeTargetAchievements[
                                                                  innerIndex1
                                                                ]
                                                                  .employeeTargetAchievements
                                                                  .length;
                                                                i++
                                                              ) {
                                                                localData[
                                                                  index
                                                                ].employeeTargetAchievements[
                                                                  innerIndex1
                                                                ].employeeTargetAchievements[
                                                                  i
                                                                ].isOpenInner = false;
                                                                if (
                                                                  i ===
                                                                  localData[
                                                                    index
                                                                  ]
                                                                    .employeeTargetAchievements[
                                                                    innerIndex1
                                                                  ]
                                                                    .employeeTargetAchievements
                                                                    .length -
                                                                    1
                                                                ) {
                                                                  localData[
                                                                    index
                                                                  ].employeeTargetAchievements[
                                                                    innerIndex1
                                                                  ].employeeTargetAchievements[
                                                                    innerIndex2
                                                                  ].isOpenInner =
                                                                    !current;
                                                                }
                                                              }

                                                              if (!current) {
                                                                let employeeData =
                                                                  await AsyncStore.getData(
                                                                    AsyncStore
                                                                      .Keys
                                                                      .LOGIN_EMPLOYEE
                                                                  );
                                                                if (
                                                                  employeeData
                                                                ) {
                                                                  const jsonObj =
                                                                    JSON.parse(
                                                                      employeeData
                                                                    );
                                                                  const dateFormat =
                                                                    "YYYY-MM-DD";
                                                                  const currentDate =
                                                                    moment().format(
                                                                      dateFormat
                                                                    );
                                                                  const monthFirstDate =
                                                                    moment(
                                                                      currentDate,
                                                                      dateFormat
                                                                    )
                                                                      .subtract(
                                                                        0,
                                                                        "months"
                                                                      )
                                                                      .startOf(
                                                                        "month"
                                                                      )
                                                                      .format(
                                                                        dateFormat
                                                                      );
                                                                  const monthLastDate =
                                                                    moment(
                                                                      currentDate,
                                                                      dateFormat
                                                                    )
                                                                      .subtract(
                                                                        0,
                                                                        "months"
                                                                      )
                                                                      .endOf(
                                                                        "month"
                                                                      )
                                                                      .format(
                                                                        dateFormat
                                                                      );
                                                                  let payload =
                                                                    {
                                                                      orgId:
                                                                        jsonObj.orgId,
                                                                      selectedEmpId:
                                                                        innerItem2.empId,
                                                                      endDate:
                                                                        monthLastDate,
                                                                      loggedInEmpId:
                                                                        innerItem2.empId,
                                                                      empId:
                                                                        innerItem2.empId,
                                                                      startDate:
                                                                        monthFirstDate,
                                                                      levelSelected:
                                                                        null,
                                                                      pageNo: 0,
                                                                      size: 100,
                                                                    };
                                                                  Promise.all([
                                                                    dispatch(
                                                                      getUserWiseTargetParameters(
                                                                        payload
                                                                      )
                                                                    ),
                                                                  ]).then(
                                                                    async (
                                                                      res
                                                                    ) => {
                                                                      let tempRawData =
                                                                        [];
                                                                      tempRawData =
                                                                        res[0]?.payload?.employeeTargetAchievements.filter(
                                                                          (
                                                                            item
                                                                          ) =>
                                                                            item.empId !==
                                                                            innerItem2.empId
                                                                        );
                                                                      if (
                                                                        tempRawData.length >
                                                                        0
                                                                      ) {
                                                                        for (
                                                                          let i = 0;
                                                                          i <
                                                                          tempRawData.length;
                                                                          i++
                                                                        ) {
                                                                          tempRawData[
                                                                            i
                                                                          ] = {
                                                                            ...tempRawData[
                                                                              i
                                                                            ],
                                                                            isOpenInner: false,
                                                                            employeeTargetAchievements:
                                                                              [],
                                                                            tempTargetAchievements:
                                                                              tempRawData[
                                                                                i
                                                                              ]
                                                                                ?.targetAchievements,
                                                                          };
                                                                          if (
                                                                            i ===
                                                                            tempRawData.length -
                                                                              1
                                                                          ) {
                                                                            localData[
                                                                              index
                                                                            ].employeeTargetAchievements[
                                                                              innerIndex1
                                                                            ].employeeTargetAchievements[
                                                                              innerIndex2
                                                                            ].employeeTargetAchievements =
                                                                              tempRawData;
                                                                            let newIds =
                                                                              tempRawData.map(
                                                                                (
                                                                                  emp
                                                                                ) =>
                                                                                  emp.empId
                                                                              );
                                                                            if (
                                                                              newIds.length >=
                                                                              2
                                                                            ) {
                                                                              for (
                                                                                let i = 0;
                                                                                i <
                                                                                newIds.length;
                                                                                i++
                                                                              ) {
                                                                                const element =
                                                                                  newIds[
                                                                                    i
                                                                                  ].toString();
                                                                                let tempPayload =
                                                                                  getTotalPayload(
                                                                                    employeeData,
                                                                                    element
                                                                                  );
                                                                                const response =
                                                                                  await client.post(
                                                                                    URL.GET_LIVE_LEADS_INSIGHTS(),
                                                                                    tempPayload
                                                                                  );
                                                                                const json =
                                                                                  await response.json();
                                                                                if (
                                                                                  Array.isArray(
                                                                                    json
                                                                                  )
                                                                                ) {
                                                                                  localData[
                                                                                    index
                                                                                  ].employeeTargetAchievements[
                                                                                    innerIndex1
                                                                                  ].employeeTargetAchievements[
                                                                                    innerIndex2
                                                                                  ].employeeTargetAchievements[
                                                                                    i
                                                                                  ].targetAchievements =
                                                                                    json;
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                      setAllParameters(
                                                                        [
                                                                          ...localData,
                                                                        ]
                                                                      );
                                                                    }
                                                                  );

                                                                  // if (localData[index].employeeTargetAchievements.length > 0) {
                                                                  //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
                                                                  //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
                                                                  //   }
                                                                  // }
                                                                  // setAllParameters([...localData])
                                                                }
                                                              } else {
                                                                setAllParameters(
                                                                  [...localData]
                                                                );
                                                              }
                                                              // setAllParameters([...localData])
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
                                                                    <Pressable
                                                                      onPress={() => {
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
                                                                              "live-leads",
                                                                          }
                                                                        );
                                                                      }}
                                                                    >
                                                                      <Text
                                                                        style={{
                                                                          fontSize: 12,
                                                                          fontWeight:
                                                                            "600",
                                                                          color:
                                                                            Colors.BLUE,
                                                                          marginLeft: 8,
                                                                        }}
                                                                      >
                                                                        Source/Model
                                                                      </Text>
                                                                    </Pressable>
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
                                                                        setSelectedName(
                                                                          innerItem3.empName
                                                                        );
                                                                        setTimeout(
                                                                          () => {
                                                                            setSelectedName(
                                                                              ""
                                                                            );
                                                                          },
                                                                          900
                                                                        );
                                                                        let localData =
                                                                          [
                                                                            ...allParameters,
                                                                          ];
                                                                        let current =
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
                                                                            .isOpenInner;
                                                                        for (
                                                                          let i = 0;
                                                                          i <
                                                                          localData[
                                                                            index
                                                                          ]
                                                                            .employeeTargetAchievements[
                                                                            innerIndex1
                                                                          ]
                                                                            .employeeTargetAchievements[
                                                                            innerIndex2
                                                                          ]
                                                                            .employeeTargetAchievements
                                                                            .length;
                                                                          i++
                                                                        ) {
                                                                          localData[
                                                                            index
                                                                          ].employeeTargetAchievements[
                                                                            innerIndex1
                                                                          ].employeeTargetAchievements[
                                                                            innerIndex2
                                                                          ].employeeTargetAchievements[
                                                                            i
                                                                          ].isOpenInner = false;
                                                                          if (
                                                                            i ===
                                                                            localData[
                                                                              index
                                                                            ]
                                                                              .employeeTargetAchievements[
                                                                              innerIndex1
                                                                            ]
                                                                              .employeeTargetAchievements[
                                                                              innerIndex2
                                                                            ]
                                                                              .employeeTargetAchievements
                                                                              .length -
                                                                              1
                                                                          ) {
                                                                            localData[
                                                                              index
                                                                            ].employeeTargetAchievements[
                                                                              innerIndex1
                                                                            ].employeeTargetAchievements[
                                                                              innerIndex2
                                                                            ].employeeTargetAchievements[
                                                                              innerIndex3
                                                                            ].isOpenInner =
                                                                              !current;
                                                                          }
                                                                        }

                                                                        if (
                                                                          !current
                                                                        ) {
                                                                          let employeeData =
                                                                            await AsyncStore.getData(
                                                                              AsyncStore
                                                                                .Keys
                                                                                .LOGIN_EMPLOYEE
                                                                            );
                                                                          if (
                                                                            employeeData
                                                                          ) {
                                                                            const jsonObj =
                                                                              JSON.parse(
                                                                                employeeData
                                                                              );
                                                                            const dateFormat =
                                                                              "YYYY-MM-DD";
                                                                            const currentDate =
                                                                              moment().format(
                                                                                dateFormat
                                                                              );
                                                                            const monthFirstDate =
                                                                              moment(
                                                                                currentDate,
                                                                                dateFormat
                                                                              )
                                                                                .subtract(
                                                                                  0,
                                                                                  "months"
                                                                                )
                                                                                .startOf(
                                                                                  "month"
                                                                                )
                                                                                .format(
                                                                                  dateFormat
                                                                                );
                                                                            const monthLastDate =
                                                                              moment(
                                                                                currentDate,
                                                                                dateFormat
                                                                              )
                                                                                .subtract(
                                                                                  0,
                                                                                  "months"
                                                                                )
                                                                                .endOf(
                                                                                  "month"
                                                                                )
                                                                                .format(
                                                                                  dateFormat
                                                                                );
                                                                            let payload =
                                                                              {
                                                                                orgId:
                                                                                  jsonObj.orgId,
                                                                                selectedEmpId:
                                                                                  innerItem3.empId,
                                                                                endDate:
                                                                                  monthLastDate,
                                                                                loggedInEmpId:
                                                                                  innerItem3.empId,
                                                                                empId:
                                                                                  innerItem3.empId,
                                                                                startDate:
                                                                                  monthFirstDate,
                                                                                levelSelected:
                                                                                  null,
                                                                                pageNo: 0,
                                                                                size: 100,
                                                                              };
                                                                            Promise.all(
                                                                              [
                                                                                dispatch(
                                                                                  getUserWiseTargetParameters(
                                                                                    payload
                                                                                  )
                                                                                ),
                                                                              ]
                                                                            ).then(
                                                                              async (
                                                                                res
                                                                              ) => {
                                                                                let tempRawData =
                                                                                  [];
                                                                                tempRawData =
                                                                                  res[0]?.payload?.employeeTargetAchievements.filter(
                                                                                    (
                                                                                      item
                                                                                    ) =>
                                                                                      item.empId !==
                                                                                      innerItem3.empId
                                                                                  );
                                                                                if (
                                                                                  tempRawData.length >
                                                                                  0
                                                                                ) {
                                                                                  for (
                                                                                    let i = 0;
                                                                                    i <
                                                                                    tempRawData.length;
                                                                                    i++
                                                                                  ) {
                                                                                    tempRawData[
                                                                                      i
                                                                                    ] =
                                                                                      {
                                                                                        ...tempRawData[
                                                                                          i
                                                                                        ],
                                                                                        isOpenInner: false,
                                                                                        employeeTargetAchievements:
                                                                                          [],
                                                                                        tempTargetAchievements:
                                                                                          tempRawData[
                                                                                            i
                                                                                          ]
                                                                                            ?.targetAchievements,
                                                                                      };
                                                                                    if (
                                                                                      i ===
                                                                                      tempRawData.length -
                                                                                        1
                                                                                    ) {
                                                                                      localData[
                                                                                        index
                                                                                      ].employeeTargetAchievements[
                                                                                        innerIndex1
                                                                                      ].employeeTargetAchievements[
                                                                                        innerIndex2
                                                                                      ].employeeTargetAchievements[
                                                                                        innerIndex3
                                                                                      ].employeeTargetAchievements =
                                                                                        tempRawData;
                                                                                      let newIds =
                                                                                        tempRawData.map(
                                                                                          (
                                                                                            emp
                                                                                          ) =>
                                                                                            emp.empId
                                                                                        );
                                                                                      if (
                                                                                        newIds.length >=
                                                                                        2
                                                                                      ) {
                                                                                        for (
                                                                                          let i = 0;
                                                                                          i <
                                                                                          newIds.length;
                                                                                          i++
                                                                                        ) {
                                                                                          const element =
                                                                                            newIds[
                                                                                              i
                                                                                            ].toString();
                                                                                          let tempPayload =
                                                                                            getTotalPayload(
                                                                                              employeeData,
                                                                                              element
                                                                                            );
                                                                                          const response =
                                                                                            await client.post(
                                                                                              URL.GET_LIVE_LEADS_INSIGHTS(),
                                                                                              tempPayload
                                                                                            );
                                                                                          const json =
                                                                                            await response.json();
                                                                                          if (
                                                                                            Array.isArray(
                                                                                              json
                                                                                            )
                                                                                          ) {
                                                                                            localData[
                                                                                              index
                                                                                            ].employeeTargetAchievements[
                                                                                              innerIndex1
                                                                                            ].employeeTargetAchievements[
                                                                                              innerIndex2
                                                                                            ].employeeTargetAchievements[
                                                                                              innerIndex3
                                                                                            ].employeeTargetAchievements[
                                                                                              i
                                                                                            ].targetAchievements =
                                                                                              json;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                                setAllParameters(
                                                                                  [
                                                                                    ...localData,
                                                                                  ]
                                                                                );
                                                                              }
                                                                            );
                                                                          }
                                                                        } else {
                                                                          setAllParameters(
                                                                            [
                                                                              ...localData,
                                                                            ]
                                                                          );
                                                                        }
                                                                        // setAllParameters([...localData])
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
                                                                                  innerItem4.empName
                                                                                }
                                                                              </Text>
                                                                              <Pressable
                                                                                onPress={() => {
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
                                                                                        "live-leads",
                                                                                    }
                                                                                  );
                                                                                }}
                                                                              >
                                                                                <Text
                                                                                  style={{
                                                                                    fontSize: 12,
                                                                                    fontWeight:
                                                                                      "600",
                                                                                    color:
                                                                                      Colors.BLUE,
                                                                                    marginLeft: 8,
                                                                                  }}
                                                                                >
                                                                                  Source/Model
                                                                                </Text>
                                                                              </Pressable>
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
                                                                                titleClick={async () => {
                                                                                  setSelectedName(
                                                                                    innerItem4.empName
                                                                                  );
                                                                                  setTimeout(
                                                                                    () => {
                                                                                      setSelectedName(
                                                                                        ""
                                                                                      );
                                                                                    },
                                                                                    900
                                                                                  );
                                                                                  let localData =
                                                                                    [
                                                                                      ...allParameters,
                                                                                    ];
                                                                                  let current =
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
                                                                                      .isOpenInner;
                                                                                  for (
                                                                                    let i = 0;
                                                                                    i <
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
                                                                                      .employeeTargetAchievements
                                                                                      .length;
                                                                                    i++
                                                                                  ) {
                                                                                    localData[
                                                                                      index
                                                                                    ].employeeTargetAchievements[
                                                                                      innerIndex1
                                                                                    ].employeeTargetAchievements[
                                                                                      innerIndex2
                                                                                    ].employeeTargetAchievements[
                                                                                      innerIndex3
                                                                                    ].employeeTargetAchievements[
                                                                                      i
                                                                                    ].isOpenInner = false;
                                                                                    if (
                                                                                      i ===
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
                                                                                        .employeeTargetAchievements
                                                                                        .length -
                                                                                        1
                                                                                    ) {
                                                                                      localData[
                                                                                        index
                                                                                      ].employeeTargetAchievements[
                                                                                        innerIndex1
                                                                                      ].employeeTargetAchievements[
                                                                                        innerIndex2
                                                                                      ].employeeTargetAchievements[
                                                                                        innerIndex3
                                                                                      ].employeeTargetAchievements[
                                                                                        innerIndex4
                                                                                      ].isOpenInner =
                                                                                        !current;
                                                                                    }
                                                                                  }

                                                                                  if (
                                                                                    !current
                                                                                  ) {
                                                                                    let employeeData =
                                                                                      await AsyncStore.getData(
                                                                                        AsyncStore
                                                                                          .Keys
                                                                                          .LOGIN_EMPLOYEE
                                                                                      );
                                                                                    if (
                                                                                      employeeData
                                                                                    ) {
                                                                                      const jsonObj =
                                                                                        JSON.parse(
                                                                                          employeeData
                                                                                        );
                                                                                      const dateFormat =
                                                                                        "YYYY-MM-DD";
                                                                                      const currentDate =
                                                                                        moment().format(
                                                                                          dateFormat
                                                                                        );
                                                                                      const monthFirstDate =
                                                                                        moment(
                                                                                          currentDate,
                                                                                          dateFormat
                                                                                        )
                                                                                          .subtract(
                                                                                            0,
                                                                                            "months"
                                                                                          )
                                                                                          .startOf(
                                                                                            "month"
                                                                                          )
                                                                                          .format(
                                                                                            dateFormat
                                                                                          );
                                                                                      const monthLastDate =
                                                                                        moment(
                                                                                          currentDate,
                                                                                          dateFormat
                                                                                        )
                                                                                          .subtract(
                                                                                            0,
                                                                                            "months"
                                                                                          )
                                                                                          .endOf(
                                                                                            "month"
                                                                                          )
                                                                                          .format(
                                                                                            dateFormat
                                                                                          );
                                                                                      let payload =
                                                                                        {
                                                                                          orgId:
                                                                                            jsonObj.orgId,
                                                                                          selectedEmpId:
                                                                                            innerItem4.empId,
                                                                                          endDate:
                                                                                            monthLastDate,
                                                                                          loggedInEmpId:
                                                                                            innerItem4.empId,
                                                                                          empId:
                                                                                            innerItem4.empId,
                                                                                          startDate:
                                                                                            monthFirstDate,
                                                                                          levelSelected:
                                                                                            null,
                                                                                          pageNo: 0,
                                                                                          size: 100,
                                                                                        };
                                                                                      Promise.all(
                                                                                        [
                                                                                          dispatch(
                                                                                            getUserWiseTargetParameters(
                                                                                              payload
                                                                                            )
                                                                                          ),
                                                                                        ]
                                                                                      ).then(
                                                                                        async (
                                                                                          res
                                                                                        ) => {
                                                                                          let tempRawData =
                                                                                            [];
                                                                                          tempRawData =
                                                                                            res[0]?.payload?.employeeTargetAchievements.filter(
                                                                                              (
                                                                                                item
                                                                                              ) =>
                                                                                                item.empId !==
                                                                                                innerItem4.empId
                                                                                            );
                                                                                          if (
                                                                                            tempRawData.length >
                                                                                            0
                                                                                          ) {
                                                                                            for (
                                                                                              let i = 0;
                                                                                              i <
                                                                                              tempRawData.length;
                                                                                              i++
                                                                                            ) {
                                                                                              tempRawData[
                                                                                                i
                                                                                              ] =
                                                                                                {
                                                                                                  ...tempRawData[
                                                                                                    i
                                                                                                  ],
                                                                                                  isOpenInner: false,
                                                                                                  employeeTargetAchievements:
                                                                                                    [],
                                                                                                  tempTargetAchievements:
                                                                                                    tempRawData[
                                                                                                      i
                                                                                                    ]
                                                                                                      ?.targetAchievements,
                                                                                                };
                                                                                              if (
                                                                                                i ===
                                                                                                tempRawData.length -
                                                                                                  1
                                                                                              ) {
                                                                                                localData[
                                                                                                  index
                                                                                                ].employeeTargetAchievements[
                                                                                                  innerIndex1
                                                                                                ].employeeTargetAchievements[
                                                                                                  innerIndex2
                                                                                                ].employeeTargetAchievements[
                                                                                                  innerIndex3
                                                                                                ].employeeTargetAchievements[
                                                                                                  innerIndex4
                                                                                                ].employeeTargetAchievements =
                                                                                                  tempRawData;
                                                                                                let newIds =
                                                                                                  tempRawData.map(
                                                                                                    (
                                                                                                      emp
                                                                                                    ) =>
                                                                                                      emp.empId
                                                                                                  );
                                                                                                if (
                                                                                                  newIds.length >=
                                                                                                  2
                                                                                                ) {
                                                                                                  for (
                                                                                                    let i = 0;
                                                                                                    i <
                                                                                                    newIds.length;
                                                                                                    i++
                                                                                                  ) {
                                                                                                    const element =
                                                                                                      newIds[
                                                                                                        i
                                                                                                      ].toString();
                                                                                                    let tempPayload =
                                                                                                      getTotalPayload(
                                                                                                        employeeData,
                                                                                                        element
                                                                                                      );
                                                                                                    const response =
                                                                                                      await client.post(
                                                                                                        URL.GET_LIVE_LEADS_INSIGHTS(),
                                                                                                        tempPayload
                                                                                                      );
                                                                                                    const json =
                                                                                                      await response.json();
                                                                                                    if (
                                                                                                      Array.isArray(
                                                                                                        json
                                                                                                      )
                                                                                                    ) {
                                                                                                      localData[
                                                                                                        index
                                                                                                      ].employeeTargetAchievements[
                                                                                                        innerIndex1
                                                                                                      ].employeeTargetAchievements[
                                                                                                        innerIndex2
                                                                                                      ].employeeTargetAchievements[
                                                                                                        innerIndex3
                                                                                                      ].employeeTargetAchievements[
                                                                                                        innerIndex4
                                                                                                      ].employeeTargetAchievements[
                                                                                                        i
                                                                                                      ].targetAchievements =
                                                                                                        json;
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                          setAllParameters(
                                                                                            [
                                                                                              ...localData,
                                                                                            ]
                                                                                          );
                                                                                        }
                                                                                      );
                                                                                    }
                                                                                  } else {
                                                                                    setAllParameters(
                                                                                      [
                                                                                        ...localData,
                                                                                      ]
                                                                                    );
                                                                                  }
                                                                                  // setAllParameters([...localData])
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
                                                                                            innerItem5.empName
                                                                                          }
                                                                                        </Text>
                                                                                        <Pressable
                                                                                          onPress={() => {
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
                                                                                                  "live-leads",
                                                                                              }
                                                                                            );
                                                                                          }}
                                                                                        >
                                                                                          <Text
                                                                                            style={{
                                                                                              fontSize: 12,
                                                                                              fontWeight:
                                                                                                "600",
                                                                                              color:
                                                                                                Colors.BLUE,
                                                                                              marginLeft: 8,
                                                                                            }}
                                                                                          >
                                                                                            Source/Model
                                                                                          </Text>
                                                                                        </Pressable>
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
                                                                                          titleClick={async () => {
                                                                                            setSelectedName(
                                                                                              innerItem5.empName
                                                                                            );
                                                                                            setTimeout(
                                                                                              () => {
                                                                                                setSelectedName(
                                                                                                  ""
                                                                                                );
                                                                                              },
                                                                                              900
                                                                                            );
                                                                                            let localData =
                                                                                              [
                                                                                                ...allParameters,
                                                                                              ];
                                                                                            let current =
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
                                                                                                .isOpenInner;
                                                                                            for (
                                                                                              let i = 0;
                                                                                              i <
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
                                                                                                .employeeTargetAchievements
                                                                                                .length;
                                                                                              i++
                                                                                            ) {
                                                                                              localData[
                                                                                                index
                                                                                              ].employeeTargetAchievements[
                                                                                                innerIndex1
                                                                                              ].employeeTargetAchievements[
                                                                                                innerIndex2
                                                                                              ].employeeTargetAchievements[
                                                                                                innerIndex3
                                                                                              ].employeeTargetAchievements[
                                                                                                innerIndex4
                                                                                              ].employeeTargetAchievements[
                                                                                                i
                                                                                              ].isOpenInner = false;
                                                                                              if (
                                                                                                i ===
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
                                                                                                  .employeeTargetAchievements
                                                                                                  .length -
                                                                                                  1
                                                                                              ) {
                                                                                                localData[
                                                                                                  index
                                                                                                ].employeeTargetAchievements[
                                                                                                  innerIndex1
                                                                                                ].employeeTargetAchievements[
                                                                                                  innerIndex2
                                                                                                ].employeeTargetAchievements[
                                                                                                  innerIndex3
                                                                                                ].employeeTargetAchievements[
                                                                                                  innerIndex4
                                                                                                ].employeeTargetAchievements[
                                                                                                  innerIndex5
                                                                                                ].isOpenInner =
                                                                                                  !current;
                                                                                              }
                                                                                            }

                                                                                            if (
                                                                                              !current
                                                                                            ) {
                                                                                              let employeeData =
                                                                                                await AsyncStore.getData(
                                                                                                  AsyncStore
                                                                                                    .Keys
                                                                                                    .LOGIN_EMPLOYEE
                                                                                                );
                                                                                              if (
                                                                                                employeeData
                                                                                              ) {
                                                                                                const jsonObj =
                                                                                                  JSON.parse(
                                                                                                    employeeData
                                                                                                  );
                                                                                                const dateFormat =
                                                                                                  "YYYY-MM-DD";
                                                                                                const currentDate =
                                                                                                  moment().format(
                                                                                                    dateFormat
                                                                                                  );
                                                                                                const monthFirstDate =
                                                                                                  moment(
                                                                                                    currentDate,
                                                                                                    dateFormat
                                                                                                  )
                                                                                                    .subtract(
                                                                                                      0,
                                                                                                      "months"
                                                                                                    )
                                                                                                    .startOf(
                                                                                                      "month"
                                                                                                    )
                                                                                                    .format(
                                                                                                      dateFormat
                                                                                                    );
                                                                                                const monthLastDate =
                                                                                                  moment(
                                                                                                    currentDate,
                                                                                                    dateFormat
                                                                                                  )
                                                                                                    .subtract(
                                                                                                      0,
                                                                                                      "months"
                                                                                                    )
                                                                                                    .endOf(
                                                                                                      "month"
                                                                                                    )
                                                                                                    .format(
                                                                                                      dateFormat
                                                                                                    );
                                                                                                let payload =
                                                                                                  {
                                                                                                    orgId:
                                                                                                      jsonObj.orgId,
                                                                                                    selectedEmpId:
                                                                                                      innerItem5.empId,
                                                                                                    endDate:
                                                                                                      monthLastDate,
                                                                                                    loggedInEmpId:
                                                                                                      innerItem5.empId,
                                                                                                    empId:
                                                                                                      innerItem5.empId,
                                                                                                    startDate:
                                                                                                      monthFirstDate,
                                                                                                    levelSelected:
                                                                                                      null,
                                                                                                    pageNo: 0,
                                                                                                    size: 100,
                                                                                                  };
                                                                                                Promise.all(
                                                                                                  [
                                                                                                    dispatch(
                                                                                                      getUserWiseTargetParameters(
                                                                                                        payload
                                                                                                      )
                                                                                                    ),
                                                                                                  ]
                                                                                                ).then(
                                                                                                  async (
                                                                                                    res
                                                                                                  ) => {
                                                                                                    let tempRawData =
                                                                                                      [];
                                                                                                    tempRawData =
                                                                                                      res[0]?.payload?.employeeTargetAchievements.filter(
                                                                                                        (
                                                                                                          item
                                                                                                        ) =>
                                                                                                          item.empId !==
                                                                                                          innerItem5.empId
                                                                                                      );
                                                                                                    if (
                                                                                                      tempRawData.length >
                                                                                                      0
                                                                                                    ) {
                                                                                                      for (
                                                                                                        let i = 0;
                                                                                                        i <
                                                                                                        tempRawData.length;
                                                                                                        i++
                                                                                                      ) {
                                                                                                        tempRawData[
                                                                                                          i
                                                                                                        ] =
                                                                                                          {
                                                                                                            ...tempRawData[
                                                                                                              i
                                                                                                            ],
                                                                                                            isOpenInner: false,
                                                                                                            employeeTargetAchievements:
                                                                                                              [],
                                                                                                            tempTargetAchievements:
                                                                                                              tempRawData[
                                                                                                                i
                                                                                                              ]
                                                                                                                ?.targetAchievements,
                                                                                                          };
                                                                                                        if (
                                                                                                          i ===
                                                                                                          tempRawData.length -
                                                                                                            1
                                                                                                        ) {
                                                                                                          localData[
                                                                                                            index
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex1
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex2
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex3
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex4
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex5
                                                                                                          ].employeeTargetAchievements =
                                                                                                            tempRawData;
                                                                                                          let newIds =
                                                                                                            tempRawData.map(
                                                                                                              (
                                                                                                                emp
                                                                                                              ) =>
                                                                                                                emp.empId
                                                                                                            );
                                                                                                          if (
                                                                                                            newIds.length >=
                                                                                                            2
                                                                                                          ) {
                                                                                                            for (
                                                                                                              let i = 0;
                                                                                                              i <
                                                                                                              newIds.length;
                                                                                                              i++
                                                                                                            ) {
                                                                                                              const element =
                                                                                                                newIds[
                                                                                                                  i
                                                                                                                ].toString();
                                                                                                              let tempPayload =
                                                                                                                getTotalPayload(
                                                                                                                  employeeData,
                                                                                                                  element
                                                                                                                );
                                                                                                              const response =
                                                                                                                await client.post(
                                                                                                                  URL.GET_LIVE_LEADS_INSIGHTS(),
                                                                                                                  tempPayload
                                                                                                                );
                                                                                                              const json =
                                                                                                                await response.json();
                                                                                                              if (
                                                                                                                Array.isArray(
                                                                                                                  json
                                                                                                                )
                                                                                                              ) {
                                                                                                                localData[
                                                                                                                  index
                                                                                                                ].employeeTargetAchievements[
                                                                                                                  innerIndex1
                                                                                                                ].employeeTargetAchievements[
                                                                                                                  innerIndex2
                                                                                                                ].employeeTargetAchievements[
                                                                                                                  innerIndex3
                                                                                                                ].employeeTargetAchievements[
                                                                                                                  innerIndex4
                                                                                                                ].employeeTargetAchievements[
                                                                                                                  innerIndex5
                                                                                                                ].employeeTargetAchievements[
                                                                                                                  i
                                                                                                                ].targetAchievements =
                                                                                                                  json;
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                    setAllParameters(
                                                                                                      [
                                                                                                        ...localData,
                                                                                                      ]
                                                                                                    );
                                                                                                  }
                                                                                                );
                                                                                              }
                                                                                            } else {
                                                                                              setAllParameters(
                                                                                                [
                                                                                                  ...localData,
                                                                                                ]
                                                                                              );
                                                                                            }
                                                                                            // setAllParameters([...localData])
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
                                                                                                      innerItem6.empName
                                                                                                    }
                                                                                                  </Text>
                                                                                                  <Pressable
                                                                                                    onPress={() => {
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
                                                                                                            "live-leads",
                                                                                                        }
                                                                                                      );
                                                                                                    }}
                                                                                                  >
                                                                                                    <Text
                                                                                                      style={{
                                                                                                        fontSize: 12,
                                                                                                        fontWeight:
                                                                                                          "600",
                                                                                                        color:
                                                                                                          Colors.BLUE,
                                                                                                        marginLeft: 8,
                                                                                                      }}
                                                                                                    >
                                                                                                      Source/Model
                                                                                                    </Text>
                                                                                                  </Pressable>
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
                                                                                                    titleClick={async () => {
                                                                                                      setSelectedName(
                                                                                                        innerItem6.empName
                                                                                                      );
                                                                                                      setTimeout(
                                                                                                        () => {
                                                                                                          setSelectedName(
                                                                                                            ""
                                                                                                          );
                                                                                                        },
                                                                                                        900
                                                                                                      );
                                                                                                      let localData =
                                                                                                        [
                                                                                                          ...allParameters,
                                                                                                        ];
                                                                                                      let current =
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
                                                                                                          .employeeTargetAchievements[
                                                                                                          innerIndex6
                                                                                                        ]
                                                                                                          .isOpenInner;
                                                                                                      for (
                                                                                                        let i = 0;
                                                                                                        i <
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
                                                                                                          .employeeTargetAchievements
                                                                                                          .length;
                                                                                                        i++
                                                                                                      ) {
                                                                                                        localData[
                                                                                                          index
                                                                                                        ].employeeTargetAchievements[
                                                                                                          innerIndex1
                                                                                                        ].employeeTargetAchievements[
                                                                                                          innerIndex2
                                                                                                        ].employeeTargetAchievements[
                                                                                                          innerIndex3
                                                                                                        ].employeeTargetAchievements[
                                                                                                          innerIndex4
                                                                                                        ].employeeTargetAchievements[
                                                                                                          innerIndex5
                                                                                                        ].employeeTargetAchievements[
                                                                                                          i
                                                                                                        ].isOpenInner = false;
                                                                                                        if (
                                                                                                          i ===
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
                                                                                                            .employeeTargetAchievements
                                                                                                            .length -
                                                                                                            1
                                                                                                        ) {
                                                                                                          localData[
                                                                                                            index
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex1
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex2
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex3
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex4
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex5
                                                                                                          ].employeeTargetAchievements[
                                                                                                            innerIndex6
                                                                                                          ].isOpenInner =
                                                                                                            !current;
                                                                                                        }
                                                                                                      }

                                                                                                      if (
                                                                                                        !current
                                                                                                      ) {
                                                                                                        let employeeData =
                                                                                                          await AsyncStore.getData(
                                                                                                            AsyncStore
                                                                                                              .Keys
                                                                                                              .LOGIN_EMPLOYEE
                                                                                                          );
                                                                                                        if (
                                                                                                          employeeData
                                                                                                        ) {
                                                                                                          const jsonObj =
                                                                                                            JSON.parse(
                                                                                                              employeeData
                                                                                                            );
                                                                                                          const dateFormat =
                                                                                                            "YYYY-MM-DD";
                                                                                                          const currentDate =
                                                                                                            moment().format(
                                                                                                              dateFormat
                                                                                                            );
                                                                                                          const monthFirstDate =
                                                                                                            moment(
                                                                                                              currentDate,
                                                                                                              dateFormat
                                                                                                            )
                                                                                                              .subtract(
                                                                                                                0,
                                                                                                                "months"
                                                                                                              )
                                                                                                              .startOf(
                                                                                                                "month"
                                                                                                              )
                                                                                                              .format(
                                                                                                                dateFormat
                                                                                                              );
                                                                                                          const monthLastDate =
                                                                                                            moment(
                                                                                                              currentDate,
                                                                                                              dateFormat
                                                                                                            )
                                                                                                              .subtract(
                                                                                                                0,
                                                                                                                "months"
                                                                                                              )
                                                                                                              .endOf(
                                                                                                                "month"
                                                                                                              )
                                                                                                              .format(
                                                                                                                dateFormat
                                                                                                              );
                                                                                                          let payload =
                                                                                                            {
                                                                                                              orgId:
                                                                                                                jsonObj.orgId,
                                                                                                              selectedEmpId:
                                                                                                                innerItem6.empId,
                                                                                                              endDate:
                                                                                                                monthLastDate,
                                                                                                              loggedInEmpId:
                                                                                                                innerItem6.empId,
                                                                                                              empId:
                                                                                                                innerItem6.empId,
                                                                                                              startDate:
                                                                                                                monthFirstDate,
                                                                                                              levelSelected:
                                                                                                                null,
                                                                                                              pageNo: 0,
                                                                                                              size: 100,
                                                                                                            };
                                                                                                          Promise.all(
                                                                                                            [
                                                                                                              dispatch(
                                                                                                                getUserWiseTargetParameters(
                                                                                                                  payload
                                                                                                                )
                                                                                                              ),
                                                                                                            ]
                                                                                                          ).then(
                                                                                                            async (
                                                                                                              res
                                                                                                            ) => {
                                                                                                              let tempRawData =
                                                                                                                [];
                                                                                                              tempRawData =
                                                                                                                res[0]?.payload?.employeeTargetAchievements.filter(
                                                                                                                  (
                                                                                                                    item
                                                                                                                  ) =>
                                                                                                                    item.empId !==
                                                                                                                    innerItem6.empId
                                                                                                                );
                                                                                                              if (
                                                                                                                tempRawData.length >
                                                                                                                0
                                                                                                              ) {
                                                                                                                for (
                                                                                                                  let i = 0;
                                                                                                                  i <
                                                                                                                  tempRawData.length;
                                                                                                                  i++
                                                                                                                ) {
                                                                                                                  tempRawData[
                                                                                                                    i
                                                                                                                  ] =
                                                                                                                    {
                                                                                                                      ...tempRawData[
                                                                                                                        i
                                                                                                                      ],
                                                                                                                      isOpenInner: false,
                                                                                                                      employeeTargetAchievements:
                                                                                                                        [],
                                                                                                                      tempTargetAchievements:
                                                                                                                        tempRawData[
                                                                                                                          i
                                                                                                                        ]
                                                                                                                          ?.targetAchievements,
                                                                                                                    };
                                                                                                                  if (
                                                                                                                    i ===
                                                                                                                    tempRawData.length -
                                                                                                                      1
                                                                                                                  ) {
                                                                                                                    localData[
                                                                                                                      index
                                                                                                                    ].employeeTargetAchievements[
                                                                                                                      innerIndex1
                                                                                                                    ].employeeTargetAchievements[
                                                                                                                      innerIndex2
                                                                                                                    ].employeeTargetAchievements[
                                                                                                                      innerIndex3
                                                                                                                    ].employeeTargetAchievements[
                                                                                                                      innerIndex4
                                                                                                                    ].employeeTargetAchievements[
                                                                                                                      innerIndex5
                                                                                                                    ].employeeTargetAchievements[
                                                                                                                      innerIndex6
                                                                                                                    ].employeeTargetAchievements =
                                                                                                                      tempRawData;
                                                                                                                    let newIds =
                                                                                                                      tempRawData.map(
                                                                                                                        (
                                                                                                                          emp
                                                                                                                        ) =>
                                                                                                                          emp.empId
                                                                                                                      );
                                                                                                                    if (
                                                                                                                      newIds.length >=
                                                                                                                      2
                                                                                                                    ) {
                                                                                                                      for (
                                                                                                                        let i = 0;
                                                                                                                        i <
                                                                                                                        newIds.length;
                                                                                                                        i++
                                                                                                                      ) {
                                                                                                                        const element =
                                                                                                                          newIds[
                                                                                                                            i
                                                                                                                          ].toString();
                                                                                                                        let tempPayload =
                                                                                                                          getTotalPayload(
                                                                                                                            employeeData,
                                                                                                                            element
                                                                                                                          );
                                                                                                                        const response =
                                                                                                                          await client.post(
                                                                                                                            URL.GET_LIVE_LEADS_INSIGHTS(),
                                                                                                                            tempPayload
                                                                                                                          );
                                                                                                                        const json =
                                                                                                                          await response.json();
                                                                                                                        if (
                                                                                                                          Array.isArray(
                                                                                                                            json
                                                                                                                          )
                                                                                                                        ) {
                                                                                                                          localData[
                                                                                                                            index
                                                                                                                          ].employeeTargetAchievements[
                                                                                                                            innerIndex1
                                                                                                                          ].employeeTargetAchievements[
                                                                                                                            innerIndex2
                                                                                                                          ].employeeTargetAchievements[
                                                                                                                            innerIndex3
                                                                                                                          ].employeeTargetAchievements[
                                                                                                                            innerIndex4
                                                                                                                          ].employeeTargetAchievements[
                                                                                                                            innerIndex5
                                                                                                                          ].employeeTargetAchievements[
                                                                                                                            innerIndex6
                                                                                                                          ].employeeTargetAchievements[
                                                                                                                            i
                                                                                                                          ].targetAchievements =
                                                                                                                            json;
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                              setAllParameters(
                                                                                                                [
                                                                                                                  ...localData,
                                                                                                                ]
                                                                                                              );
                                                                                                            }
                                                                                                          );
                                                                                                        }
                                                                                                      } else {
                                                                                                        setAllParameters(
                                                                                                          [
                                                                                                            ...localData,
                                                                                                          ]
                                                                                                        );
                                                                                                      }
                                                                                                      // setAllParameters([...localData])
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

                      {/* Grand Total Section */}
                      {selector.totalParameters.length > 0 && (
                        <View>
                          <Pressable
                            style={{ alignSelf: "flex-end" }}
                            onPress={() => {
                              navigation.navigate(
                                AppNavigator.HomeStackIdentifiers.sourceModel,
                                {
                                  empId: !_.isEmpty(
                                    selector.saveLiveleadObject?.selectedempId
                                  )
                                    ? selector.saveLiveleadObject
                                        ?.selectedempId[0]
                                    : selector.login_employee_details.empId,
                                  headerTitle: "Grand Total",
                                  loggedInEmpId: !_.isEmpty(
                                    selector.saveLiveleadObject?.selectedempId
                                  )
                                    ? selector.saveLiveleadObject
                                        ?.selectedempId[0]
                                    : selector.login_employee_details.empId,
                                  type: "TEAM",
                                  moduleType: "live-leads",
                                }
                              );
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

                          <View style={{ flexDirection: "row", height: 40 }}>
                            <View
                              style={{
                                width: 70,
                                minHeight: 40,
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                backgroundColor: Colors.RED,
                              }}
                            >
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginLeft: 6,
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
                              {/*<View>*/}
                              {/*    <Text style={{*/}
                              {/*        fontSize: 6,*/}
                              {/*        fontWeight: 'bold',*/}
                              {/*        paddingVertical: 6,*/}
                              {/*        paddingRight: 2,*/}
                              {/*        height: 20,*/}
                              {/*        color: Colors.WHITE*/}
                              {/*    }}>CNT</Text>*/}
                              {/*    <Text style={{*/}
                              {/*        fontSize: 6,*/}
                              {/*        fontWeight: 'bold',*/}
                              {/*        paddingVertical: 6,*/}
                              {/*        height: 20,*/}
                              {/*        color: Colors.WHITE*/}
                              {/*    }}>TGT</Text>*/}
                              {/*</View>*/}
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
                                  moduleType={"live-leads"}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    </>
                  )}
                </ScrollView>
              )}
            </View>
          </>
        ) : (
          // IF Self or insights
          <>
              <View style={styles.titleDashboardContainer}>
                <Text style={styles.dashboardText}>Dashboard</Text>
              </View>
              {receptionistRole.includes(userData.hrmsRole) ? (<>
                <View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      // borderBottomWidth: 2,
                      // borderBottomColor: Colors.RED,
                      paddingBottom: 8,
                    }}
                  >
                    {/*<SegmentedControl*/}
                    {/*    style={{*/}
                    {/*        marginHorizontal: 4,*/}
                    {/*        justifyContent: 'center',*/}
                    {/*        alignSelf: 'flex-end',*/}
                    {/*        height: 24,*/}
                    {/*        marginTop: 8,*/}
                    {/*        width: '75%'*/}
                    {/*    }}*/}
                    {/*    values={['ETVBRL', 'Allied', 'View All']}*/}
                    {/*    selectedIndex={toggleParamsIndex}*/}
                    {/*    tintColor={Colors.RED}*/}
                    {/*    fontStyle={{color: Colors.BLACK, fontSize: 10}}*/}
                    {/*    activeFontStyle={{color: Colors.WHITE, fontSize: 10}}*/}
                    {/*    onChange={event => {*/}
                    {/*        const index = event.nativeEvent.selectedSegmentIndex;*/}
                    {/*        let data = [...paramsMetadata];*/}
                    {/*        if (index !== 2) {*/}
                    {/*            data = data.filter(x => x.toggleIndex === index);*/}
                    {/*        } else {*/}
                    {/*            data = [...paramsMetadata];*/}
                    {/*        }*/}
                    {/*        setToggleParamsMetaData([...data]);*/}
                    {/*        setToggleParamsIndex(index);*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<View style={{height: 24, width: '20%', marginLeft: 4}}>*/}
                    {/*    <View style={styles.percentageToggleView}>*/}
                    {/*        <PercentageToggleControl toggleChange={(x) => setTogglePercentage(x)}/>*/}
                    {/*    </View>*/}
                    {/*</View>*/}
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
                    >
                      {/* TOP Header view */}
                      <View
                        key={"headers"}
                        style={{
                          flexDirection: "row",
                          borderBottomWidth: 0.5,
                          paddingBottom: 4,
                          borderBottomColor: Colors.GRAY,
                        }}
                      >
                        {/* <View
                      style={{ width: 70, height: 20, marginRight: 5 }}
                    ></View> */}
                        {/* <View
                        // style={styles.itemBox}
                        style={{ width: 70, height: 20, marginRight: 5, alignItems: "center" }}
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
                            width: 70,
                            height: 20,
                            marginRight: 5,
                            alignItems: "flex-start",
                          }}
                        >
                          <View
                            style={[
                              styles.itemBox,
                              {
                                // width: 55,
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
                        <View
                          style={{
                            width: "100%",
                            height: 20,
                            flexDirection: "row",
                          }}
                        >
                          {toggleParamsMetaData.map((param) => {
                            return (
                              <View style={styles.itemBox} key={param.shortName}>
                                <Text
                                  style={{
                                    color: param.color,
                                    fontSize: 12,
                                  }}
                                >
                                  {param.shortName}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>

                      {crmRole.includes(userData.hrmsRole) ? (
                        <>
                          {CRM_filterParameters.length > 0
                            ? renderCRMFilterView()
                            : null}
                          {CRM_filterParameters.length > 0
                            ? renderCRMFilterViewTeamTotal()
                            : null}
                          {CRM_filterParameters.length == 0
                            ? renderCRMtreeFirstLevel()
                            : null}
                          {CRM_filterParameters.length == 0
                            ? renderCREtreeFirstLevel()
                            : null}
                          {/* Grand Total Section */}
                          {/* isViewExpanded ? item.contactCount : selector.crm_response_data.totalPreInquiryCount || 0,
                      isViewExpanded ? item.enquiryCount : selector.crm_response_data.totalEnquiryCount || 0,
                      isViewExpanded ? item.bookingCount : selector.crm_response_data.totalBookingCount || 0,
                      isViewExpanded ? item.retailCount : selector.crm_response_data.totalRetailCount || 0, */}

                          {totalOfTeam && CRM_filterParameters.length == 0 && (
                            <View>
                              <Pressable
                                style={{ alignSelf: "flex-end" }}
                                onPress={() => {
                                  navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
                                    empId: selector.login_employee_details.empId,
                                    headerTitle: "Grand Total",
                                    loggedInEmpId:
                                      selector.login_employee_details.empId,
                                    type: "TEAM",
                                    moduleType: "live-leads",
                                    orgId: userData.orgId,
                                    role: userData.hrmsRole,
                                    branchList: userData.branchs.map(
                                      (a) => a.branchId
                                    ),
                                    self: false,
                                  });
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

                              <View style={{ flexDirection: "row", height: 40 }}>
                                <View
                                  style={{
                                    width: 70,
                                    minHeight: 40,
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    backgroundColor: Colors.RED,
                                  }}
                                >
                                  <View
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                      marginLeft: 6,
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
                                </View>
                                <View
                                  style={{
                                    minHeight: 40,
                                    flexDirection: "column",
                                  }}
                                >
                                  <View
                                    style={{
                                      // minHeight: 40,
                                      flexDirection: "row",
                                      // backgroundColor:"yellow"
                                    }}
                                  >
                                    {totalOfTeam.map((e) => {
                                      return (
                                        <View
                                          style={{
                                            width: 70,
                                            height: 40,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: Colors.RED,
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
                          )}
                          {/* {selector.totalParameters.length > 0 && (
                        <View>
                          <Pressable
                            style={{ alignSelf: "flex-end" }}
                            onPress={() => {
                              navigation.navigate(
                                AppNavigator.HomeStackIdentifiers.sourceModel,
                                {
                                  empId: filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                                  headerTitle: "Grand Total",
                                  loggedInEmpId:
                                    filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                                  type: "TEAM",
                                  moduleType: "live-leads",
                                }
                              );
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

                          <View style={{ flexDirection: "row", height: 40 }}>
                            <View
                              style={{
                                width: 70,
                                minHeight: 40,
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexDirection: "row",
                                backgroundColor: Colors.RED,
                              }}
                            >
                              <View
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginLeft: 6,
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
                                  moduleType={"live-leads"}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      )} */}
                        </>
                      ) : (
                        <>
                            
                            {renderReceptionistFirstLevelVol2()}
                          {/* Grand Total Section */}
                              {selector.totalParameters.length > 0 ? 
                                receptionistRole.includes(userData.hrmsRole) ? (
                                  <View>
                                    {totalOfTeam && (
                                      <View>
                                        <Pressable
                                          style={{ alignSelf: "flex-end" }}
                                          onPress={() => {
                                            let tempArry = [];
                                            
                                            Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2.fullResponse?.totalEnquiryLeads)
                                            Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2.fullResponse?.totalBookingLeads)
                                            Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2.fullResponse?.totalRetailLeads)
                                            Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2.fullResponse?.totalContactLeads)
                                            
                                           
                                            let item = {
                                              empName:"Grand Total",
                                              roleName:""
                                            }
                                            handleNavigationTOSourcrModelVol2(item, tempArry)
                                            // navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
                                            //   empId: selector.login_employee_details.empId,
                                            //   headerTitle: "Grand Total",
                                            //   loggedInEmpId:
                                            //     selector.login_employee_details.empId,
                                            //   type: "TEAM",
                                            //   moduleType: "live-leads",
                                            //   orgId: userData.orgId,
                                            //   role: userData.hrmsRole,
                                            //   branchList: userData.branchs.map(
                                            //     (a) => a.branchId
                                            //   ),
                                            //   self: false,
                                            // });
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

                                        <View style={{ flexDirection: "row", height: 40 }}>
                                          <View
                                            style={{
                                              width: 70,
                                              minHeight: 40,
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                              flexDirection: "row",
                                              backgroundColor: Colors.RED,
                                            }}
                                          >
                                            <View
                                              style={{
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginLeft: 6,
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
                                          </View>
                                          <View
                                            style={{
                                              minHeight: 40,
                                              flexDirection: "column",
                                            }}
                                          >
                                            <View
                                              style={{
                                                // minHeight: 40,
                                                flexDirection: "row",
                                                // backgroundColor:"yellow"
                                              }}
                                            >
                                              {totalOfTeam.map((e) => {
                                                return (
                                                  <View
                                                    style={{
                                                      width: 70,
                                                      height: 40,
                                                      justifyContent: "center",
                                                      alignItems: "center",
                                                      backgroundColor: Colors.RED,
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
                                    )}
                                  </View>
                                ) : (
                                <View>
                                  <Pressable
                                    style={{ alignSelf: "flex-end" }}
                                    onPress={() => {
                                      navigation.navigate(
                                        AppNavigator.HomeStackIdentifiers.sourceModel,
                                        {
                                          empId: !_.isEmpty(
                                            selector.saveLiveleadObject?.selectedempId
                                          )
                                            ? selector.saveLiveleadObject
                                              ?.selectedempId[0]
                                            : selector.login_employee_details.empId,
                                          headerTitle: "Grand Total",
                                          loggedInEmpId: !_.isEmpty(
                                            selector.saveLiveleadObject?.selectedempId
                                          )
                                            ? selector.saveLiveleadObject
                                              ?.selectedempId[0]
                                            : selector.login_employee_details.empId,
                                          type: "TEAM",
                                          moduleType: "live-leads",
                                        }
                                      );
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

                                  <View style={{ flexDirection: "row", height: 40 }}>
                                    <View
                                      style={{
                                        width: 70,
                                        minHeight: 40,
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: "row",
                                        backgroundColor: Colors.RED,
                                      }}
                                    >
                                      <View
                                        style={{
                                          justifyContent: "center",
                                          alignItems: "center",
                                          marginLeft: 6,
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
                                      {/*<View>*/}
                                      {/*    <Text style={{*/}
                                      {/*        fontSize: 6,*/}
                                      {/*        fontWeight: 'bold',*/}
                                      {/*        paddingVertical: 6,*/}
                                      {/*        paddingRight: 2,*/}
                                      {/*        height: 20,*/}
                                      {/*        color: Colors.WHITE*/}
                                      {/*    }}>CNT</Text>*/}
                                      {/*    <Text style={{*/}
                                      {/*        fontSize: 6,*/}
                                      {/*        fontWeight: 'bold',*/}
                                      {/*        paddingVertical: 6,*/}
                                      {/*        height: 20,*/}
                                      {/*        color: Colors.WHITE*/}
                                      {/*    }}>TGT</Text>*/}
                                      {/*</View>*/}
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
                                          moduleType={"live-leads"}
                                        />
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              ):null  }
                        </>
                      )}
                    </ScrollView>
                  )}
                </View>
              </>) : null}


            {!receptionistRole.includes(userData.hrmsRole) &&
            !crmRole.includes(userData.hrmsRole) ? (
              <>
                <View style={{ marginTop: 16, marginHorizontal: 24 }}>
                  <Pressable
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                      navigation.navigate(
                        AppNavigator.HomeStackIdentifiers.sourceModel,
                        {
                          empId: !_.isEmpty(
                            selector.saveLiveleadObject?.selectedempId
                          )
                            ? selector.saveLiveleadObject?.selectedempId[0]
                            : selector.login_employee_details.empId,
                          headerTitle: "Source/Model",
                          loggedInEmpId: !_.isEmpty(
                            selector.saveLiveleadObject?.selectedempId
                          )
                            ? selector.saveLiveleadObject?.selectedempId[0]
                            : selector.login_employee_details.empId,
                          type: selector.isDSE ? "SELF" : "INSIGHTS",
                          moduleType: "live-leads",
                          orgId: selector.login_employee_details.orgId,
                          isOpenner : false
                        }
                      );
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: Colors.BLUE,
                        textDecorationLine: "underline",
                      }}
                    >
                      Source/Model
                    </Text>
                  </Pressable>
                </View>

                <View>
                  {/*<RenderSelfInsights data={selfInsightsData} type={togglePercentage} navigation={navigation} moduleType={'live-leads'}/>*/}
                  {selfInsightsData &&
                    selfInsightsData.length > 0 &&
                    !selector.isLoading && (
                      <FlatList
                        data={selfInsightsData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                          renderSelfInsightsView(item, index)
                        }
                      />
                    )}
                </View>
              </>
            ) : null}

            {/* {receptionistRole.includes(userData.hrmsRole) ? (
              <>
                <View style={{ marginTop: 16, marginHorizontal: 24 }}>
                  <Pressable
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                      navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
                        empId: selector.login_employee_details.empId,
                        headerTitle: "Source/Model",
                        loggedInEmpId: selector.login_employee_details.empId,
                        type: "TEAM",
                        moduleType: "live-leads",
                        orgId: userData.orgId,
                        role: userData.hrmsRole,
                        branchList: userData.branchs.map((a) => a.branchId),
                        self: false,
                      });
                      // navigation.navigate(
                      //   AppNavigator.HomeStackIdentifiers.sourceModel,
                      //   {
                      //     empId: filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                      //     headerTitle: "Source/Model",
                      //     loggedInEmpId: filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                      //     type: selector.isDSE ? "SELF" : "INSIGHTS",
                      //     moduleType: "live-leads",
                      //     orgId: selector.login_employee_details.orgId,
                      //   }
                      // );
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: Colors.BLUE,
                        textDecorationLine: "underline",
                      }}
                    >
                      Source/Model
                    </Text>
                  </Pressable>
                </View>

                <View>
             
                  {selfInsightsData &&
                    selfInsightsData.length > 0 &&
                    !selector.isLoading && (
                      <FlatList
                        data={selfInsightsData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                          renderSelfInsightsViewRecepToCRM(item, index)
                        }
                      />
                    )}
                </View>
              </>
            ) : null} */}

            {crmRole.includes(userData.hrmsRole) ? (
              <>
                <View style={{ marginTop: 16, marginHorizontal: 24 }}>
                  <Pressable
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {

                      let tempArry = [];

                      Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse?.totalEnquiryLeads)
                      Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse?.totalBookingLeads)
                      Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse?.totalRetailLeads)
                      Array.prototype.push.apply(tempArry, selector.crm_recep_response_data_vol2_CRM_ROLE.fullResponse?.totalContactLeads)


                      let item = {
                        empName: "Grand Total",
                        roleName: ""
                      }
                      handleNavigationTOSourcrModelVol2(item, tempArry)

                      // if (CRM_filterParameters.length > 0) {
                      //   handleSourceModalNavigation(
                      //     CRM_filterParameters[0],
                      //     CRM_filterParameters[0].emp_id
                      //   );
                      //   // navigation.navigate(
                      //   //   "RECEP_SOURCE_MODEL_CRM",
                      //   //   {
                      //   //     empId: CRM_filterParameters[0].emp_id,
                      //   //     headerTitle: "Source/Model",
                      //   //     loggedInEmpId: CRM_filterParameters[0].emp_id,
                      //   //     type: "TEAM",
                      //   //     moduleType: "live-leads",
                      //   //     orgId: userData.orgId,
                      //   //     role: CRM_filterParameters[0].roleName,
                      //   //     branchList: userData.branchs.map(
                      //   //       (a) => a.branchId
                      //   //     ),
                      //   //   }
                      //   // );
                      // } else {
                      //   navigation.navigate("RECEP_SOURCE_MODEL_CRM", {
                      //     empId: selector.login_employee_details.empId,
                      //     headerTitle: "Source/Model",
                      //     loggedInEmpId: selector.login_employee_details.empId,
                      //     type: "TEAM",
                      //     moduleType: "live-leads",
                      //     orgId: userData.orgId,
                      //     role: userData.hrmsRole,
                      //     branchList: userData.branchs.map((a) => a.branchId),
                      //     self: false,
                      //   });
                      // }

                      // navigation.navigate(
                      //   AppNavigator.HomeStackIdentifiers.sourceModel,
                      //   {
                      //     empId: filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                      //     headerTitle: "Source/Model",
                      //     loggedInEmpId: filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                      //     type: selector.isDSE ? "SELF" : "INSIGHTS",
                      //     moduleType: "live-leads",
                      //     orgId: selector.login_employee_details.orgId,
                      //   }
                      // );
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: Colors.BLUE,
                        textDecorationLine: "underline",
                      }}
                    >
                      Source/Model
                    </Text>
                  </Pressable>
                </View>

                <View>
                  {/*<RenderSelfInsights data={selfInsightsData} type={togglePercentage} navigation={navigation} moduleType={'live-leads'}/>*/}
                  {selfInsightsData &&
                    selfInsightsData.length > 0 &&
                    !selector.isLoading && (
                      <FlatList
                        data={selfInsightsData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) =>
                          renderSelfInsightsViewRecepToCRMVol2(item,index)
                          // renderSelfInsightsViewRecepToCRM(item, index)
                        }
                      />
                    )}
                </View>
              </>
            ) : null}
          </>
        )}
      </View>
      {!selector.isLoading ? null : (
        <LoaderComponent
          visible={selector.isLoading}
          onRequestClose={() => {}}
        />
      )}
    </>
  );
};

export default ParametersScreen;

export const RenderLevel1NameView = ({
  level,
  item,
  branchName = "",
  color,
  titleClick,
  disable = false,
  teamLoader = false,
  teamMember = "",
}) => {
  return (
    <View
      style={{
        width: 70,
        justifyContent: "center",
        textAlign: "center",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
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
              source={require("../../../assets/Animations/lf20_qispmsyg.json")}
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
        {level === 0 && !!branchName && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="map-marker"
              style={{ padding: 0, margin: 0 }}
              color={Colors.RED}
              size={8}
            />
            <Text style={{ fontSize: 8, width: "70%" }} numberOfLines={1}>
              {branchName}
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
        width: 70,
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
        {level === 0 && !!item.branchName && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="map-marker"
              style={{ padding: 0, margin: 0 }}
              color={Colors.RED}
              size={8}
            />
            <Text style={{ fontSize: 8, width: "70%" }} numberOfLines={1}>
              {item.branchName}
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

export const RenderLevel1NameViewCRM = ({
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
        width: 70,
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
            {item?.emp_name?.charAt(0)}
          </Text>
        </TouchableOpacity>
        {level === 0 && !!item.branch && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="map-marker"
              style={{ padding: 0, margin: 0 }}
              color={Colors.RED}
              size={8}
            />
            <Text style={{ fontSize: 8, width: "70%" }} numberOfLines={1}>
              {item.branch}
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

export const SourceModelView = ({ style = null, onClick }) => {
  return (
    <View style={style}>
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
    width: "48%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    backgroundColor: "#F5F5F5",
  },
  itemBox: {
    width: 68,
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
  insightParamsContainer: {
    marginHorizontal: 16,
  },
  insightParamsLabel: {},
  achievementCountView: {
    marginTop: 6,
    fontSize: 24,
  },
  paramCard: {
    padding: 8,
    margin: 16,
    borderWidth: 1,
    // height: '75%',
    width: "90%",
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
