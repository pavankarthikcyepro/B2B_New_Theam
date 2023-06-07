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
  getCRM_ReceptionistManagerData,
  getCRM_ReceptionistManagerDataDigital,
  getEmployeesList,
  getNewTargetParametersAllData,
  getReceptionistDataDigitalDashboard,
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
    name: "Enquiry"
  },
  {
    id: 1,
    name: "Booking"
  },
  {
    id: 2,
    name: "Retail"
  },
  {
    id: 3,
    name: "Lost"
  },


]
const receptionistRole = ["Reception", "CRM"];
const DigitalDashBoardTargetScreen = ({ route }) => {
  const navigation = useNavigation();
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
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
  const [storeFirstLevelSelectedRecData, setStoreFirstLevelSelectedRecData] = useState([]);
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

  const [crmSecondLevelSelectedData, setCrmSecondLevelSelectedData] = useState([]);
  const [indexLocalFirstLevel, setIndexLocalFirstLevel] = useState(-1);
  const [filterExapand, setfilterExapand] = useState(false);

  const [userData, setUserData] = useState({
    empId: 0,
    empName: "",
    hrmsRole: "",
    orgId: 0,
    branchs: [],
    isSelfManager: "N",
    orgName: "",
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
        isSelfManager: jsonObj.isSelfManager,
        orgName: jsonObj.orgName,
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


    if (!_.isEmpty(selector.receptionistData?.fullResponse) && _.isEmpty(selector.saveCRMfilterObj.selectedempId) && selector.receptionistData?.fullResponse !== undefined) {
      let tempArrCRMFIRst = []
      let tempArrCRMFirsttotal = [];
      let tempArrCRMSecond = [];
      let tempArrCRMFirstOwn = [];
      let firstLevelData = selector.receptionistData?.fullResponse?.CRM.map(item => {
       
          
          Array.prototype.push.apply(tempArrCRMFirsttotal, [item.data]);
        
        // setCrmFirstLevelTotalData(item.data)
 
        let firstLevel = item.data.manager.filter(item2 => item2.emp_id === item.emp_id)
        if (firstLevel.length > 0) {
          Array.prototype.push.apply(tempArrCRMFIRst, firstLevel);
        }

        let firstLevelOwn = item.data.manager.filter(item2 => {
          if (item2.emp_id === item.emp_id){
      
           let tempOwn = item2.salesconsultant.filter(item3 => item3.emp_id === item.emp_id)
           if(tempOwn.length > 0 ){
             Array.prototype.push.apply(tempArrCRMFirstOwn, tempOwn);
           }
          }
        })

      })
    
      setCrmFirstLevelDataOwn(tempArrCRMFirstOwn);
      setCrmFirstLevelTotalData(tempArrCRMFirsttotal)
     
      setCrmFirstLevelData(tempArrCRMFIRst)
     

      let tempArr = [];
      let tempArrSelf = selector.receptionistData.fullResponse.CRE?.map((item => item))

      let firstLevelDataLevel2 = selector.receptionistData.fullResponse.CRE?.map((item, index) => {
        let firstLevel = item.data.consultantList?.filter(item2 => item2.emp_id === item.emp_id)

        if (firstLevel.length > 0) {
          // tempArr.push(firstLevel);
          Array.prototype.push.apply(tempArr, firstLevel);

        }
      })
   
      setCreFirstLevelData(tempArr)
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
    
  }, [selector.receptionistData])

  useEffect(() => {


    if (selector.receptionistDataDigitalFilter ) {
      let totalKey1 = selector?.receptionistDataDigitalFilter?.fullResponse?.managerEnquiryCount;
      let totalKey2 = selector?.receptionistDataDigitalFilter?.fullResponse?.managerBookingCount;
      let totalKey3 = selector?.receptionistDataDigitalFilter?.fullResponse?.managerRetailCount;
      let totalKey4 = selector?.receptionistDataDigitalFilter?.fullResponse?.managerLostCount;

      let total = [totalKey1, totalKey2, totalKey3, totalKey4];
      setTotalofTeam(total);
    }
    
   
  }, [selector.receptionistDataDigitalFilter])

  useEffect(() => {


    if (selector.receptionistDataDigitalFilter_CRE) {
      let totalKey1 = selector?.receptionistDataDigitalFilter_CRE?.enquirysCount;
      let totalKey2 = selector?.receptionistDataDigitalFilter_CRE?.bookingsCount;
      let totalKey3 = selector?.receptionistDataDigitalFilter_CRE?.RetailCount;
      let totalKey4 = selector?.receptionistDataDigitalFilter_CRE?.totalLostCount;

      let total = [totalKey1, totalKey2, totalKey3, totalKey4];
      setTotalofTeam(total);
    }

    
  }, [selector.receptionistDataDigitalFilter_CRE])

  

  useEffect(() => {
    
    getDataBasedOnfilter()
    
  }, [selector.saveCRMfilterObj, isFocused])
  
  const getDataBasedOnfilter = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (selector.saveCRMfilterObj?.selectedempId) {
        
        if (!_.isEmpty(selector.saveCRMfilterObj?.selectedDesignation)) {
          
          if (selector.saveCRMfilterObj?.selectedDesignation[0] === "CRM") {
            // todo manager api call 
            let payloadXrole = {
              orgId: jsonObj.orgId,
              loggedInEmpId: selector.saveCRMfilterObj?.selectedempId[0],
              "dashboardType": "digital"
            };
            dispatch(getCRM_ReceptionistManagerDataDigital(payloadXrole))
          } else {
            // todo recep api call 
            let payload = {
              orgId: jsonObj.orgId,
              loggedInEmpId: selector.saveCRMfilterObj.selectedempId[0],
              "startDate": selector.saveCRMfilterObj.startDate,
              "endDate": selector.saveCRMfilterObj.endDate,
              "dealerCodes": selector.saveCRMfilterObj.dealerCodes
            };
            dispatch(getReceptionistDataDigitalDashboard(payload));
          }
        } else {

        }

      }
    }
  }

  const DigitalFilterApplied = () => {
    let payload = {
      orgId: userData.orgId,
      loggedInEmpId: selector.saveCRMfilterObj.selectedempId[0],
      "startDate": selector.saveCRMfilterObj.startDate,
      "endDate": selector.saveCRMfilterObj.endDate,
      "dealerCodes": selector.saveCRMfilterObj.dealerCodes,
          "dashboardType": "digital"
    };
    dispatch(getReceptionistData(payload));
  }

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
      setisShowSalesConsultant(false);
      setIsViewExpanded(false);
      setIsViewCreExpanded(false);
      dispatch(updatereceptionistDataObjectData({}))
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

  function navigateToEMS(params = "", screenName = "", selectedEmpId = [], isIgnore = false, parentId = "", istotalClick = false, isSelf) {
    navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
    setTimeout(() => {
      if (selector.saveCRMfilterObj?.selectedempId) {
        // setTimeout(() => {
        //   navigation.navigate("LEADS", {
        //     screenName: "Home",
        //     params: params,
        //     moduleType: "",
        //     employeeDetail: "",
        //     selectedEmpId: selector.saveCRMfilterObj?.selectedempId,
        //     startDate: selector.saveCRMfilterObj.startDate,
        //     endDate: selector.saveCRMfilterObj.endDate,
        //     dealerCodes: selector.saveCRMfilterObj.dealerCodes,
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
              self:isSelf
            });
          }, 1000);
        } else {
          setTimeout(() => {
            navigation.navigate("LEADS", {
              screenName: "Home",
              params: params,
              moduleType: "",
              employeeDetail: "",
              selectedEmpId: selector.saveCRMfilterObj?.selectedempId,
              startDate: selector.saveCRMfilterObj.startDate,
              endDate: selector.saveCRMfilterObj.endDate,
              dealerCodes: selector.saveCRMfilterObj.dealerCodes,
              ignoreSelectedId: isIgnore,
            });
          }, 1000);
        }
      }
      else if (isIgnore) {
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
                self: isSelf
              });
            }, 1000);
          }
          else {

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
                istotalClick: false
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
              ignoreSelectedId: isIgnore
            });
          }, 1000);
        }


      }
      else {
        navigation.navigate("LEADS", {
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

  function navigateToDropAnalysis(params, isfromTree = false, parentId = "", isSelf = false,xrole =false) {

    if (selector.saveCRMfilterObj.selectedempId) {
      if (selector.saveCRMfilterObj?.selectedDesignation && selector.saveCRMfilterObj?.selectedDesignation[0] === "CRM") {
        if(isfromTree){
          navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
            screen: "DROP_ANALYSIS",
            params: { emp_id: params, fromScreen: "targetScreenDigital", dealercodes: selector.saveCRMfilterObj.dealerCodes, isFilterApplied: true, parentId: parentId, isSelf: false, xrole: xrole, isForDropped: false },
          });
        }else{
          navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
            screen: "DROP_ANALYSIS",
            params: { emp_id: selector.saveCRMfilterObj.selectedempId[0], fromScreen: "targetScreenDigital", dealercodes: selector.saveCRMfilterObj.dealerCodes, isFilterApplied: true, isSelf: true, xrole: false, isForDropped: false },
          });
        }
       
      }else{
      navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
        screen: "DROP_ANALYSIS",
        params: { emp_id: params, fromScreen: "targetScreenDigital", dealercodes: selector.saveCRMfilterObj.dealerCodes, isFilterApplied: true, isSelf: isSelf, xrole: xrole, isForDropped: false, parentId: parentId },
      });
    }
    } else {

      if (isfromTree) {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: { emp_id: params, fromScreen: "targetScreenDigital", dealercodes: [], isFilterApplied: true, parentId: parentId, isSelf: isSelf, xrole: xrole, isForDropped: false },
        });
      } else {
        
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
          screen: "DROP_ANALYSIS",
          params: { emp_id: params, fromScreen: "targetScreenDigital", dealercodes: [], isFilterApplied: false, isSelf: isSelf, xrole: xrole, isForDropped: false },
        });
      }

    }



  }

  const renderCRETreeFilter = () => {
    // todo manthan

    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {selector.receptionistDataDigitalFilter_CRE.consultantList?.length > 0 &&
          selector.receptionistDataDigitalFilter_CRE.consultantList?.map((item, index) => {

            if (item.emp_id == selector.saveCRMfilterObj.selectedempId[0]) {

              return (
                <View key={`${item.emp_name} ${index}`}
                  style={{
                    borderColor: filterExapand ? Colors.PINK : "",
                    borderWidth: filterExapand ? 1 : 0,
                    borderRadius: 10,
                    margin: filterExapand ? 10 : 0
                  }}>
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

                          if (filterExapand) {

                            // handleSourceModalNavigation()
                            handleSourceModalNavigation(item, item?.emp_id, [item.emp_id], "CRM_INd")
                          } else {

                            handleSourceModalNavigation(item, "", [], "CRM", true)
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
                        <RenderLevel1NameViewCRM
                          level={0}
                          item={item}
                          branchName={checkIsSelfManager()
                            ? ""
                            : item.branch}
                          color={Colors.CORAL}
                          receptionManager={true}
                          navigation={navigation}
                          titleClick={async (e) => {
                            setfilterExapand(!filterExapand)
                          }}
                          roleName={item.roleName}
                          stopLocation={true}
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
                          {/* {[
                          isViewExpanded ? item.enquiryCount :  selector.receptionistData.enquirysCount || 0,
                          isViewExpanded ? item.bookingCount :  selector.receptionistData.bookingsCount || 0,
                          isViewExpanded ? item.retailCount  :  selector.receptionistData.RetailCount || 0,
                          isViewExpanded ? item.droppedCount :  selector.receptionistData.totalLostCount || 0,
                        ] */}

                          {[
                            filterExapand ? item.enquiryCount : selector.receptionistDataDigitalFilter_CRE.enquirysCount || 0,
                            filterExapand ? item.bookingCount : selector.receptionistDataDigitalFilter_CRE.bookingsCount || 0,
                            filterExapand ? item.retailCount : selector.receptionistDataDigitalFilter_CRE.RetailCount || 0,
                            filterExapand ? item.droppedCount : selector.receptionistDataDigitalFilter_CRE.totalLostCount || 0,
                          ].map((e, indexss) => {
                            return (
                              <Pressable onPress={() => {

                                // todo redirections logic  first level
                                // if (e > 0) {

                                if (!filterExapand) {
                                  if (indexss === 0) {
                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true);
                                    // navigateToEMS("ENQUIRY", "", [item.emp_id], true, item.emp_id, true, true);
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true);
                                  } else if (indexss === 3) {
                                    // navigateToDropAnalysis(item.emp_id, false, "", true,)
                                    navigateToDropAnalysis(selector.saveCRMfilterObj.selectedempId[0], true)

                                  }
                                }
                                else {
                                  if (indexss === 0) {

                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true, item.emp_id);
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true, item.emp_id);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, item.emp_id);
                                  } else if (indexss === 3) {
                                    // todo navigate to lost
                                    navigateToDropAnalysis(selector.saveCRMfilterObj.selectedempId[0], true, item.emp_id, false)
                                    // navigateToDropAnalysis(item.emp_id, true, item.emp_id, false)
                                  }
                                }
                                // }

                              }}>
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
                                      textDecorationLine: e > 0 ? "underline" : "none"
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
                  {filterExapand && renderCRETreeFilterChild()}
                </View>
              );
            }

          })}

      </View>)
  }

  const renderCRETreeFilterChild = () => {
    // todo manthan

    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {selector.receptionistDataDigitalFilter_CRE.consultantList?.length > 0 &&
          selector.receptionistDataDigitalFilter_CRE.consultantList?.map((item, index) => {

            if (item.emp_id !== selector.saveCRMfilterObj.selectedempId[0]) {

              return (
                <View key={`${item.emp_name} ${index}`}
                  style={{
                    // borderColor: isViewExpanded ? Colors.PINK : "",
                    // borderWidth: isViewExpanded ? 1 : 0,
                    // borderRadius: 10,
                    // margin: isViewExpanded ? 10 : 0
                  }}>
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

                          handleSourceModalNavigation(item, selector.saveCRMfilterObj.selectedempId[0], [item.emp_id])

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
                        <RenderLevel1NameViewCRM
                          level={0}
                          item={item}
                          branchName={checkIsSelfManager()
                            ? ""
                            : item.branch}
                          color={"#2C97DE"}
                          receptionManager={true}
                          navigation={navigation}
                          titleClick={async (e) => {
                            // setfilterExapand(!filterExapand)
                          }}
                          roleName={item.roleName}
                          stopLocation={true}
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
                          {/* {[
                          isViewExpanded ? item.enquiryCount :  selector.receptionistData.enquirysCount || 0,
                          isViewExpanded ? item.bookingCount :  selector.receptionistData.bookingsCount || 0,
                          isViewExpanded ? item.retailCount  :  selector.receptionistData.RetailCount || 0,
                          isViewExpanded ? item.droppedCount :  selector.receptionistData.totalLostCount || 0,
                        ] */}

                          {[
                            item.enquiryCount || 0,
                            item.bookingCount || 0,
                            item.retailCount || 0,
                            item.droppedCount || 0,
                          ].map((e, indexss) => {
                            return (
                              <Pressable onPress={() => {

                                // todo redirections logic  first level
                                // if (e > 0) {
                                  if (indexss === 0) {

                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true, selector.saveCRMfilterObj.selectedempId[0]);
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true, selector.saveCRMfilterObj.selectedempId[0]);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, selector.saveCRMfilterObj.selectedempId[0]);
                                  } else if (indexss === 3) {
                                    // todo navigate to lost 
                                    navigateToDropAnalysis(selector.saveCRMfilterObj.selectedempId[0], true, item.emp_id, false)
                                  }
                                // }

                              }}>
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
                                      textDecorationLine: e > 0 ? "underline" : "none"
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
                  {/* {filterExapand && renderCRMTreeChildFilter()} */}
                </View>
              );
            }

          })}

      </View>)
  }


  const renderCRMTreeFilter = () => {
    // todo manthan
    
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {selector.receptionistDataDigitalFilter.consultantList?.length > 0 &&
          selector.receptionistDataDigitalFilter.consultantList?.map((item, index) => {
            
            if (item.emp_id == selector.saveCRMfilterObj.selectedempId[0]) {
             
              return (
                <View key={`${item.emp_name} ${index}`}
                  style={{
                    borderColor: isViewExpanded ? Colors.PINK : "",
                    borderWidth: isViewExpanded ? 1 : 0,
                    borderRadius: 10,
                    margin: isViewExpanded ? 10 : 0
                  }}>
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
                      {selector.receptionistDataDigitalFilter?.fullResponse?.childUserCount > 0 && (
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
                            <Text>{selector.receptionistDataDigitalFilter?.fullResponse?.childUserCount}</Text>
                          </View>
                        </Animated.View>
                      )}
                      <SourceModelView
                        onClick={() => {

                          if (isViewExpanded) {

                            // handleSourceModalNavigation()
                            handleSourceModalNavigation(item, item?.emp_id, [item.emp_id], "CRM_INd")
                          } else {

                            handleSourceModalNavigation(item, "", [], "CRM", true)
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
                        <RenderLevel1NameViewCRM
                          level={0}
                          item={item}
                          branchName={checkIsSelfManager()
                            ? ""
                            : item.branch}
                          color={"#C62159"}
                          receptionManager={true}
                          navigation={navigation}
                          titleClick={async (e) => {

                            setIsViewExpanded(!isViewExpanded)
                            formateFirstLevelDataFilter(item)
                          }}
                          roleName={item.roleName}
                          stopLocation={true}
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
                          {/* {[
                          isViewExpanded ? item.enquiryCount :  selector.receptionistData.enquirysCount || 0,
                          isViewExpanded ? item.bookingCount :  selector.receptionistData.bookingsCount || 0,
                          isViewExpanded ? item.retailCount  :  selector.receptionistData.RetailCount || 0,
                          isViewExpanded ? item.droppedCount :  selector.receptionistData.totalLostCount || 0,
                        ] */}

                          {[
                            isViewExpanded && storeFirstLevelSelectedRecData ? storeFirstLevelSelectedRecData[0].enquiryCount : selector.receptionistDataDigitalFilter?.fullResponse?.managerEnquiryCount || 0,
                            isViewExpanded && storeFirstLevelSelectedRecData ? storeFirstLevelSelectedRecData[0].bookingCount : selector.receptionistDataDigitalFilter?.fullResponse?.managerBookingCount || 0,
                            isViewExpanded && storeFirstLevelSelectedRecData ? storeFirstLevelSelectedRecData[0].retailCount : selector.receptionistDataDigitalFilter?.fullResponse?.managerRetailCount || 0,
                            isViewExpanded && storeFirstLevelSelectedRecData ? storeFirstLevelSelectedRecData[0].droppedCount : selector.receptionistDataDigitalFilter?.fullResponse?.managerLostCount || 0,
                          ].map((e, indexss) => {
                            return (
                              <Pressable onPress={() => {

                                // todo redirections logic  first level
                                // if (e > 0) {

                                  if (!isViewExpanded) {
                                    if (indexss === 0) {

                                      navigateToEMS("ENQUIRY", "", [item.emp_id], true, item.emp_id, true, true);
                                    } else if (indexss === 1) {
                                      navigateToEMS("BOOKING", "", [item.emp_id], true, item.emp_id, true, true);
                                    } else if (indexss === 2) {
                                      navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, item.emp_id, true, true);
                                    } else if (indexss === 3) {
                                      navigateToDropAnalysis(item.emp_id, false, "", true,)
                                    }
                                  }
                                  else {
                                    if (indexss === 0) {

                                      navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                    } else if (indexss === 1) {
                                      navigateToEMS("BOOKING", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                    } else if (indexss === 2) {
                                      navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                    } else if (indexss === 3) {
                                      // todo navigate to lost

                                      navigateToDropAnalysis(item.emp_id, true, item.emp_id,false)
                                    }
                                  }
                                // }

                              }}>
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
                                      textDecorationLine: e > 0 ? "underline" : "none"
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
                  {isViewExpanded && renderCRMTreeChildFilter()}
                </View>
              );
            }

          })}
       
      </View>)
  }

  const renderItem = (item, index) => {

    return (
      <View style={{
        // width: 300,
        padding: 10,
        borderColor: index === 0 ? Colors.PURPLE : index === 2 ? Colors.RED : index === 3 ? Colors.YELLOW : Colors.BLUE_V2,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: "center",
        marginVertical: 10,
        // marginStart:'8%'


      }}>
        <View style={styles.scondView}>
          <Text style={{
            fontSize: 16,
            // color: index === 0 ? Colors.CORAL : Colors.GREEN_V2,
            color: Colors.BLACK,
            fontWeight: "700",
            paddingVertical: 10
          }}>{item.name}</Text>

          <TouchableOpacity onPress={() => {

            {
              // todo add logic for redirections filer applied manthan
              if (selector.saveCRMfilterObj.selectedempId) {
                if (selector.saveCRMfilterObj?.selectedDesignation && selector.saveCRMfilterObj?.selectedDesignation[0] === "CRM") {
                  item.id === 0 ? selector?.receptionistDataDigitalFilter?.fullResponse?.managerEnquiryCount > 0 && navigateToEMS("ENQUIRY", "", selector.saveCRMfilterObj.selectedempId, true, selector.saveCRMfilterObj.selectedempId[0], true, true) :
                    item.id === 1 ? selector?.receptionistDataDigitalFilter?.fullResponse?.managerBookingCount > 0 && navigateToEMS("BOOKING", "", selector.saveCRMfilterObj.selectedempId, true, selector.saveCRMfilterObj.selectedempId[0], true, true) :
                      item.id === 2 ? selector?.receptionistDataDigitalFilter?.fullResponse?.managerRetailCount > 0 && navigateToEMS("INVOICECOMPLETED", "", selector.saveCRMfilterObj.selectedempId, true, selector.saveCRMfilterObj.selectedempId[0], true, true) :
                        item.id === 3 ? selector?.receptionistDataDigitalFilter?.fullResponse?.managerLostCount > 0 &&  navigateToDropAnalysis(selector.saveCRMfilterObj.selectedempId[0]) : null
                }else{
                  item.id === 0 ? selector?.receptionistDataDigitalFilter_CRE?.enquirysCount > 0 && navigateToEMS("ENQUIRY", "", selector.saveCRMfilterObj.selectedempId, true, "",false,false) :
                    item.id === 1 ? selector?.receptionistDataDigitalFilter_CRE?.bookingsCount > 0 && navigateToEMS("BOOKING", "", selector.saveCRMfilterObj.selectedempId, true, "", false, false) :
                      item.id === 2 ? selector?.receptionistDataDigitalFilter_CRE?.RetailCount > 0 && navigateToEMS("INVOICECOMPLETED", "", selector.saveCRMfilterObj.selectedempId, true, "", false, false) :
                        item.id === 3 ? selector?.receptionistDataDigitalFilter_CRE?.totalLostCount > 0 && navigateToDropAnalysis(selector.saveCRMfilterObj.selectedempId[0]) : null
                }
              
              } else {
                item.id === 0 ? selector.receptionistData.enquirysCount > 0 && navigateToEMS("ENQUIRY", "", [userData.empId], false, userData.empId, true, false) :
                  item.id === 1 ? selector.receptionistData.bookingsCount > 0 && navigateToEMS("BOOKING", "", [userData.empId], false, userData.empId, true, false) :
                    item.id === 2 ? selector.receptionistData.RetailCount > 0 && navigateToEMS("INVOICECOMPLETED", "", [userData.empId], false, userData.empId, true, false) :
                      item.id === 3 ? selector.receptionistData.totalLostCount > 0 && navigateToDropAnalysis(userData.empId,false,"",false,true) : null
              }

            }
          }}>
            {selector.saveCRMfilterObj?.selectedDesignation ?
              selector.saveCRMfilterObj?.selectedDesignation[0] === "CRM" ?

                item.id === 0 ? <Text style={styles.txt10}> {selector?.receptionistDataDigitalFilter?.fullResponse?.managerEnquiryCount} </Text> :
                  item.id === 1 ? <Text style={styles.txt10}> {selector?.receptionistDataDigitalFilter?.fullResponse?.managerBookingCount} </Text> :
                    item.id === 2 ? <Text style={styles.txt10}>  {selector?.receptionistDataDigitalFilter?.fullResponse?.managerRetailCount} </Text> :
                      item.id === 3 ? <Text style={styles.txt10}> {selector?.receptionistDataDigitalFilter?.fullResponse?.managerLostCount} </Text> :
                        <Text style={styles.txt10}>0</Text>

                : item.id === 0 ? <Text style={styles.txt10}> {selector?.receptionistDataDigitalFilter_CRE?.enquirysCount} </Text> :
                  item.id === 1 ? <Text style={styles.txt10}> {selector?.receptionistDataDigitalFilter_CRE?.bookingsCount} </Text> :
                    item.id === 2 ? <Text style={styles.txt10}>  {selector?.receptionistDataDigitalFilter_CRE?.RetailCount} </Text> :
                      item.id === 3 ? <Text style={styles.txt10}> {selector?.receptionistDataDigitalFilter_CRE?.totalLostCount} </Text> :
                        <Text style={styles.txt10}>0</Text>
              :
              item.id === 0 ? <Text style={styles.txt10}> {selector.receptionistData.enquirysCount} </Text> :
                item.id === 1 ? <Text style={styles.txt10}> {selector.receptionistData.bookingsCount} </Text> :
                  item.id === 2 ? <Text style={styles.txt10}>  {selector.receptionistData.RetailCount} </Text> :
                    item.id === 3 ? <Text style={styles.txt10}> {selector.receptionistData.totalLostCount} </Text> :
                      <Text style={styles.txt10}>0</Text>

            }
            

          </TouchableOpacity>
        </View>
      </View>)
  }
  const renderCRMTreeFilterApplied = () => {


    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {CRM_filterParameters?.length > 0 &&
          CRM_filterParameters?.map((item, index) => {

            // if (item.emp_id === userData.empId) {
            return (
              <View key={`${item.emp_name} ${index}`}
                style={{
                  borderColor: isViewExpanded && indexLocalFirstLevel === index ? Colors.PINK : "",
                  borderWidth: isViewExpanded && indexLocalFirstLevel === index ? 1 : 0,
                  borderRadius: 10,
                  margin: isViewExpanded && indexLocalFirstLevel === index ? 10 : 0
                }}>
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
                    {selector.receptionistData?.fullResponse?.childUserCount > 0 && (
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
                          <Text>{selector.receptionistData?.fullResponse?.CRM[index].data.childUserCount}</Text>
                        </View>
                      </Animated.View>
                    )}
                    <SourceModelView
                      onClick={() => {

                        if (isViewExpanded) {

                          // handleSourceModalNavigation()
                          handleSourceModalNavigation(item, item?.emp_id, [item.emp_id], "CRM_INd")
                        } else {

                          handleSourceModalNavigation(item, "", [], "CRM", true)
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={checkIsSelfManager()
                          ? ""
                          : item.branch}
                        color={"#C62159"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {


                          formateFirstLevelData(item, index)
                        }}
                        roleName={item.roleName}
                        stopLocation={true}
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
                        {/* {[
                            isViewExpanded ? item.contactCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalEnquiryCount : 0 || 0,
                        isViewExpanded ? item.enquiryCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalBookingCount : 0 || 0,
                        isViewExpanded ? item.bookingCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalRetailCount : 0 || 0,
                        isViewExpanded ? item.retailCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalLostCount : 0 || 0,
                        ] */}

                        {[
                          isViewExpanded && indexLocalFirstLevel === index ? crmFirstLevelDataOwn[index].enquiryCount : crmFirstLevelTotalData ? crmFirstLevelTotalData[index]?.totalEnquiryCount : 0 || 0,
                          isViewExpanded && indexLocalFirstLevel === index ? crmFirstLevelDataOwn[index].bookingCount : crmFirstLevelTotalData ? crmFirstLevelTotalData[index]?.totalBookingCount : 0 || 0,
                          isViewExpanded && indexLocalFirstLevel === index ? crmFirstLevelDataOwn[index].retailCount : crmFirstLevelTotalData ? crmFirstLevelTotalData[index]?.totalRetailCount : 0 || 0,
                          isViewExpanded && indexLocalFirstLevel === index ? crmFirstLevelDataOwn[index].droppedCount : crmFirstLevelTotalData ? crmFirstLevelTotalData[index]?.totalLostCount : 0 || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable onPress={() => {

                              // todo redirections logic  first level
                              if (e > 0) {

                                if (!isViewExpanded) {
                                  if (indexss === 0) {

                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true, item.emp_id, true, true);
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true, item.emp_id, true, true);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, item.emp_id, true, true);
                                  } else if (indexss === 3) {

                                    navigateToDropAnalysis(item.emp_id, false, "", true)
                                  }
                                }
                                else {
                                  if (indexss === 0) {

                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                  } else if (indexss === 3) {
                                    // todo navigate to lost
                                    
                                    navigateToDropAnalysis(item.emp_id, true, item.emp_id)
                                  }
                                }
                              }

                            }}>
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
                                    textDecorationLine: e > 0 ? "underline" : "none"
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
                {isViewExpanded && indexLocalFirstLevel === index && renderCRMTreeChild()}
              </View>
            );
            // }

          })}
       
      </View>)
  }

  
  const renderCRMTree = () => {
    
    
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmFirstLevelData?.length > 0 &&
          crmFirstLevelData?.map((item, index) => {
            
            // if (item.emp_id === userData.empId) {
              return (
                <View key={`${item.emp_name} ${index}`}
                  style={{
                    borderColor: isViewExpanded && indexLocalFirstLevel === index ? Colors.PINK : "",
                    borderWidth: isViewExpanded && indexLocalFirstLevel === index ? 1 : 0,
                    borderRadius: 10,
                    margin: isViewExpanded && indexLocalFirstLevel === index ? 10 : 0
                  }}>
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
                      {selector.receptionistData?.fullResponse?.childUserCount > 0 && (
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
                            <Text>{selector.receptionistData?.fullResponse?.CRM[index].data.childUserCount}</Text>
                          </View>
                        </Animated.View>
                      )}
                      <SourceModelView
                        onClick={() => {

                          if (isViewExpanded) {

                            // handleSourceModalNavigation()
                            handleSourceModalNavigation(item, item?.emp_id, [item.emp_id], "CRM_INd")
                          } else {

                            handleSourceModalNavigation(item, "", [], "CRM", true)
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
                        <RenderLevel1NameViewCRM
                          level={0}
                          item={item}
                          branchName={checkIsSelfManager()
                            ? ""
                            : item.branch}
                          color={"#C62159"}
                          receptionManager={true}
                          navigation={navigation}
                          titleClick={async (e) => {

                           
                            formateFirstLevelData(item,index)
                          }}
                          roleName={item.roleName}
                          stopLocation={true}
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
                          {/* {[
                            isViewExpanded ? item.contactCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalEnquiryCount : 0 || 0,
                        isViewExpanded ? item.enquiryCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalBookingCount : 0 || 0,
                        isViewExpanded ? item.bookingCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalRetailCount : 0 || 0,
                        isViewExpanded ? item.retailCount : crmFirstLevelTotalData ? crmFirstLevelTotalData?.totalLostCount : 0 || 0,
                        ] */}

                          {[
                            isViewExpanded && indexLocalFirstLevel === index ? crmFirstLevelDataOwn[index].enquiryCount : crmFirstLevelTotalData ? crmFirstLevelTotalData[index]?.totalEnquiryCount : 0 || 0,
                            isViewExpanded && indexLocalFirstLevel === index ? crmFirstLevelDataOwn[index].bookingCount : crmFirstLevelTotalData ? crmFirstLevelTotalData[index]?.totalBookingCount : 0 || 0,
                            isViewExpanded && indexLocalFirstLevel === index ? crmFirstLevelDataOwn[index].retailCount : crmFirstLevelTotalData ? crmFirstLevelTotalData[index]?.totalRetailCount : 0 || 0,
                            isViewExpanded && indexLocalFirstLevel === index ? crmFirstLevelDataOwn[index].droppedCount : crmFirstLevelTotalData ? crmFirstLevelTotalData[index]?.totalLostCount : 0 || 0,
                          ].map((e, indexss) => {
                            return (
                              <Pressable onPress={() => {

                                // todo redirections logic  first level
                                if (e > 0) {

                                  if (!isViewExpanded) {
                                    if (indexss === 0) {

                                      navigateToEMS("ENQUIRY", "", [item.emp_id], true, item.emp_id, true, true);
                                    } else if (indexss === 1) {
                                      navigateToEMS("BOOKING", "", [item.emp_id], true, item.emp_id, true, true);
                                    } else if (indexss === 2) {
                                      navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, item.emp_id, true, true);
                                    } else if (indexss === 3) {
                                     
                                      navigateToDropAnalysis(item.emp_id, false, "", true)
                                    }
                                  }
                                  else {
                                    if (indexss === 0) {

                                      navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                    } else if (indexss === 1) {
                                      navigateToEMS("BOOKING", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                    } else if (indexss === 2) {
                                      navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                    } else if (indexss === 3) {
                                      // todo navigate to lost

                                      navigateToDropAnalysis(item.emp_id, true,item.emp_id)
                                    }
                                  }
                                }

                              }}>
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
                                      textDecorationLine: e > 0 ? "underline" : "none"
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
                  {isViewExpanded && indexLocalFirstLevel === index && renderCRMTreeChild()}
                </View>
              );
            // }

          })}
        {renderCREFirstLevel()}
      </View>)
  }

  const formatCRrSecondLeveleData = (item, index) => {

    setcreIndex(index)

    if (index === creIndex) {

      setIsViewCreExpanded(!isViewCREExpanded)
    } else {

      setIsViewCreExpanded(true)
    }

    setStoreCREFirstLevelLocal(item);
    
    let salesPeopleUnderCre = creFirstLevelSelfData[index].data.consultantList.filter(item2 => item2.emp_id !== item.emp_id)
    setCreSecondLevelData(salesPeopleUnderCre)



  }


  const renderCREFirstLevel = () => {
    
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {creFirstLevelData.length > 0 &&
          creFirstLevelData.map((item, index) => {

            return (
              <View key={`${item.emp_name} ${index}`}
                style={{
                  borderColor: isViewCREExpanded && index === creIndex ? Colors.BLUE : "",
                  borderWidth: isViewCREExpanded && index === creIndex ? 1 : 0,
                  borderRadius: 10,
                  margin: isViewCREExpanded && index === creIndex ? 10 : 0
                }}>
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
                          handleSourceModalNavigation(item, item?.emp_id, [item.emp_id])
                        } else {

                          handleSourceModalNavigation(item)
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={checkIsSelfManager()
                          ? ""
                          : item.branch}
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
                          backgroundColor:
                            "rgba(223,228,231,0.67)",
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
                          isViewCREExpanded && index === creIndex ? item.enquiryCount : creFirstLevelSelfData ? creFirstLevelSelfData[index].data.enquirysCount : 0 || 0,
                          isViewCREExpanded && index === creIndex ? item.bookingCount : creFirstLevelSelfData ? creFirstLevelSelfData[index].data.bookingsCount : 0 || 0,
                          isViewCREExpanded && index === creIndex ? item.retailCount : creFirstLevelSelfData ? creFirstLevelSelfData[index].data.RetailCount : 0 || 0,
                          isViewCREExpanded && index === creIndex ? item.droppedCount : creFirstLevelSelfData ? creFirstLevelSelfData[index].data.totalLostCount : 0 || 0,
                        ].
                          map((e, indexss) => {
                            return (
                              <Pressable onPress={() => {

                                // todo redirections logic  first level

                                if (e > 0) {


                                  if (isViewCREExpanded) {

                                    if (indexss === 0) {

                                      navigateToEMS("ENQUIRY", "", [item.emp_id], true, creFirstLevelSelfData[index].emp_id, false);
                                    } else if (indexss === 1) {
                                      navigateToEMS("BOOKING", "", [item.emp_id], true, creFirstLevelSelfData[index].emp_id, false);
                                    } else if (indexss === 2) {
                                      navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, creFirstLevelSelfData[index].emp_id, false);
                                    } else if (indexss === 3) {
                                      // todo navigate to lost 
                                      navigateToDropAnalysis(item.emp_id, true, item.emp_id)
                                    }
                                  }
                                  else {

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
                                      navigateToEMS("ENQUIRY", "", [item.emp_id], true,);
                                      // navigateToEMS("ENQUIRY", "", [item.emp_id] );
                                    } else if (indexss === 1) {
                                      navigateToEMS("BOOKING", "", [item.emp_id], true);
                                    } else if (indexss === 2) {
                                      navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true);
                                    } else if (indexss === 3) {
                                      // todo navigate to lost 
                                      navigateToDropAnalysis(item.emp_id, true)
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

                              }}>
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
                                      textDecorationLine: e > 0 ? "underline" : "none"
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
                {isViewCREExpanded && index === creIndex && renderCRETreeSaleConsultants()}
              </View>
            );


          })}

      </View>)
  }

  const renderCRETreeSaleConsultants = () => {
  

    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {creSecondLevelData?.length > 0 &&
          creSecondLevelData?.map((item, index) => {


            return (
              <View key={`${item.emp_name} ${index}`}
                style={{
                  // borderColor: isViewExpanded ? Colors.PINK : "",
                  // borderWidth: isViewExpanded ? 1 : 0,
                  // borderRadius: 10,
                  // margin: isViewExpanded ? 10 : 0
                }}>
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
                      handleSourceModalNavigation(item, storeCREFirstLevelLocal.emp_id, [item.emp_id])
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
                        branchName={checkIsSelfManager()
                          ? ""
                          : item.branch}
                        color={"#2C97DE"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => { }}
                        roleName={item.roleName}
                        stopLocation={true}
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
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                          item.droppedCount || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable onPress={() => {

                              // todo redirections logic  third level 

                              if (e > 0) {
                                if (indexss === 0) {

                                  navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeCREFirstLevelLocal.emp_id);
                                } else if (indexss === 1) {
                                  navigateToEMS("BOOKING", "", [item.emp_id], true, storeCREFirstLevelLocal.emp_id);
                                } else if (indexss === 2) {
                                  navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeCREFirstLevelLocal.emp_id);
                                } else if (indexss === 3) {
                                  // todo navigate to lost 
                                  navigateToDropAnalysis(storeCREFirstLevelLocal.emp_id, true, item.emp_id)
                                }
                              }
                            }}>
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
                                    textDecorationLine: e > 0 ? "underline" : "none"
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
      </View>)
  }


  const formateFirstLevelData = (data,index) => {
    setStoreFirstLevelLocal(data);
    let findSelectedRecData = data?.salesconsultant?.filter(item => item.emp_id === data.emp_id);
    setStoreFirstLevelSelectedRecData(findSelectedRecData)
    setIndexLocalFirstLevel(index);
    if(index === indexLocalFirstLevel){
      setIsViewExpanded(!isViewExpanded)
    }else{
      setIsViewExpanded(true);
    }

    let tempArr = [];
    let tempInside= [];
    let firstLevelData = selector.receptionistData?.fullResponse.CRM.map(item => {
      if(item.emp_id === data.emp_id){
            let temp = item.data.manager.filter(item2 => item2.emp_id !== data.emp_id)
        let temp2 = item.data.manager.filter(item3 =>{
          if (item3.emp_id === data.emp_id){
            
            tempInside  = item3.salesconsultant.filter(item4 => item4.emp_id !== data.emp_id);
           
          }
        })
        
        tempArr.unshift(...temp)
        Array.prototype.unshift.apply(tempArr, tempInside);
      }
      

    })
    
    setcrmSecondLevelData(tempArr)
  }


  const formateFirstLevelDataFilter = (data, index) => {
    setStoreFirstLevelLocal(data);
    let findSelectedRecData = data?.salesconsultant?.filter(item => item.emp_id === data.emp_id);
    
    setStoreFirstLevelSelectedRecData(findSelectedRecData)
    setIndexLocalFirstLevel(index);
    if (index === indexLocalFirstLevel) {
      setIsViewExpanded(!isViewExpanded)
    } else {
      setIsViewExpanded(true);
    }

    let tempArr = [];
    let tempInside = [];

    let data2 = selector.receptionistDataDigitalFilter.fullResponse?.manager
    if (data2?.length > 0) {
      let otherUserData = data2.filter((item) => {
        return item.emp_id !== data.emp_id
      })
      let consultantDataForCRM = data2.filter((item) => {
        return item.emp_id === data.emp_id
      })


      if (consultantDataForCRM.length > 0) {

        consultantDataForCRM.map((item) => {
          item.salesconsultant.forEach(element => {
            if (element.emp_id !== data.emp_id) {
              otherUserData.unshift(element)
            }

          });

        })
      }

      setcrmSecondLevelData([...otherUserData])
      // setSecondLevelCRMdata([...otherUserData])
    }

    // let firstLevelData = selector.receptionistDataDigitalFilter?.fullResponse.manager.map(item => {
    //   if (item.emp_id === data.emp_id) {
    //     let temp = item.filter(item2 => item2.emp_id !== data.emp_id)
    //     let temp2 = item.filter(item3 => {
    //       if (item3.emp_id === data.emp_id) {

    //         tempInside = item3.salesconsultant.filter(item4 => item4.emp_id !== data.emp_id);

    //       }
    //     })

    //     tempArr.push(...temp)
    //     Array.prototype.push.apply(tempArr, tempInside);
    //   }


    // })


    // let firstLevelData = selector.receptionistData?.fullResponse.CRM.map(item => {
    //   if (item.emp_id === data.emp_id) {
    //     let temp = item.data.manager.filter(item2 => item2.emp_id !== data.emp_id)
    //     let temp2 = item.data.manager.filter(item3 => {
    //       if (item3.emp_id === data.emp_id) {

    //         tempInside = item3.salesconsultant.filter(item4 => item4.emp_id !== data.emp_id);

    //       }
    //     })
        
    //     tempArr.push(...temp)
    //     Array.prototype.push.apply(tempArr, tempInside);
    //   }


    // })
    
    // setcrmSecondLevelData(tempArr)
  }

  const renderCRMTreeChildFilter = () => {


    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmSecondLevelData.length > 0 &&
          crmSecondLevelData.map((item, index) => {

            // if (item.emp_id == userData.empId) {
            return (
              <View key={`${item.emp_name} ${index}`}
                style={{
                  borderColor: isShowSalesConsultant && indexLocal === index ? Colors.BLUE : "",
                  borderWidth: isShowSalesConsultant && indexLocal === index ? 1 : 0,
                  borderRadius: 10,
                  margin: isShowSalesConsultant && indexLocal === index ? 10 : 0
                }}>
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

                        handleSourceModalNavigation(item, storeSecondLevelLocal.emp_id, [storeSecondLevelLocal.emp_id])
                      } else {

                        if (item.roleName === "Field DSE") {
                          handleSourceModalNavigation(item, storeFirstLevelLocal.emp_id, [item.emp_id])
                        } else {
                          handleSourceModalNavigation(item)
                        }

                      }

                    }}
                    style={{
                      transform: [
                        { translateX: translation },
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
                        branchName={checkIsSelfManager()
                          ? ""
                          : item.branch}
                        // color={"#C62159"}
                        color={item.roleName.toLowerCase() === "field dse" ? "#2C97DE" : "#FF4040"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {
                          // setThirdLevelCRMdata([])
                          // todo add condition for sales consultants 

                          formateSaleConsutantDataCRM(item, index)

                        }}
                        roleName={item.roleName}
                        stopLocation={true}
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
                          isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.enquiryCount : item.enquiryCount || 0,
                          isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.bookingCount : item.bookingCount || 0,
                          isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.retailCount : item.retailCount || 0,
                          isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.droppedCount : item.droppedCount || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable onPress={() => {


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

                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeSelectedRecData[0].emp_id, false);
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true, storeSelectedRecData[0].emp_id, false);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeSelectedRecData[0].emp_id, false);
                                  } else if (indexss === 3) {
                                    // todo navigate to lost 
                                    navigateToDropAnalysis(item.emp_id, true, item.emp_id)
                                  }
                                }
                                else {

                                  if (item.roleName.toLowerCase() === "field dse") {
                                    if (e > 0) {
                                      if (indexss === 0) {

                                        navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                      } else if (indexss === 1) {
                                        navigateToEMS("BOOKING", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                      } else if (indexss === 2) {
                                        navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                      } else if (indexss === 3) {
                                        // todo navigate to lost
                                        navigateToDropAnalysis(storeFirstLevelLocal.emp_id, true, item.emp_id)
                                      }
                                    }

                                    return;
                                  }

                                  if (indexss === 0) {
                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true,);
                                    // navigateToEMS("ENQUIRY", "", [item.emp_id] );
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true);
                                  } else if (indexss === 3) {
                                    // todo navigate to lost 
                                    navigateToDropAnalysis(item.emp_id, true)
                                  }


                                }
                              }

                            }}>
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
                                    textDecorationLine: e > 0 ? "underline" : "none"
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
                {isShowSalesConsultant && indexLocal === index && renderCRMTreeChildSaleConsultants()}
              </View>
            );
            // }

          })}
      </View>)
  }


  const renderCRMTreeChild = () => {


    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {crmSecondLevelData.length > 0 &&
          crmSecondLevelData.map((item, index) => {

            // if (item.emp_id == userData.empId) {
            return (
              <View key={`${item.emp_name} ${index}`}
                style={{
                  borderColor: isShowSalesConsultant && indexLocal === index ? Colors.BLUE : "",
                  borderWidth: isShowSalesConsultant && indexLocal === index ? 1 : 0,
                  borderRadius: 10,
                  margin: isShowSalesConsultant && indexLocal === index ? 10 : 0
                }}>
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

                        handleSourceModalNavigation(item, storeSecondLevelLocal.emp_id, [storeSecondLevelLocal.emp_id])
                      } else {

                        if (item.roleName === "Field DSE") {
                          handleSourceModalNavigation(item, storeFirstLevelLocal.emp_id, [item.emp_id])
                        } else {
                          handleSourceModalNavigation(item)
                        }

                      }

                    }}
                    style={{
                      transform: [
                        { translateX: translation },
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
                        branchName={checkIsSelfManager()
                          ? ""
                          : item.branch}
                        // color={"#C62159"}
                        color={item.roleName.toLowerCase() === "field dse" ? "#2C97DE" : "#FF4040"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => {
                          // setThirdLevelCRMdata([])
                          // todo add condition for sales consultants 

                          formateSaleConsutantDataCRM(item, index)

                        }}
                        roleName={item.roleName}
                        stopLocation={true}
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
                          isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.enquiryCount : item.enquiryCount || 0,
                          isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.bookingCount : item.bookingCount || 0,
                          isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.retailCount : item.retailCount || 0,
                          isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.droppedCount : item.droppedCount || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable onPress={() => {


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

                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeSelectedRecData[0].emp_id, false);
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true, storeSelectedRecData[0].emp_id, false);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeSelectedRecData[0].emp_id, false);
                                  } else if (indexss === 3) {
                                    // todo navigate to lost 
                                    navigateToDropAnalysis(item.emp_id, true, item.emp_id)
                                  }
                                }
                                else {

                                  if (item.roleName.toLowerCase() === "field dse") {
                                    if (e > 0) {
                                      if (indexss === 0) {

                                        navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                      } else if (indexss === 1) {
                                        navigateToEMS("BOOKING", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                      } else if (indexss === 2) {
                                        navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeFirstLevelLocal.emp_id);
                                      } else if (indexss === 3) {
                                        // todo navigate to lost
                                        navigateToDropAnalysis(storeFirstLevelLocal.emp_id, true, item.emp_id)
                                      }
                                    }

                                    return;
                                  }

                                  if (indexss === 0) {
                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true,);
                                    // navigateToEMS("ENQUIRY", "", [item.emp_id] );
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true);
                                  } else if (indexss === 3) {
                                    // todo navigate to lost 
                                    navigateToDropAnalysis(item.emp_id, true)
                                  }


                                }
                              }

                            }}>
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
                                    textDecorationLine: e > 0 ? "underline" : "none"
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
                {isShowSalesConsultant && indexLocal === index && renderCRMTreeChildSaleConsultants()}
              </View>
            );
            // }

          })}
      </View>)
  }

  const renderCRMTreeChildSaleConsultants = () => {
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {thirdLevelCRMdata?.length > 0 &&
          thirdLevelCRMdata?.map((item, index) => {
            if (item.emp_id !== userData.empId && storeSelectedRecData[0].emp_id !== item.emp_id) {

              return (
                <View key={`${item.emp_name} ${index}`}
                  style={{
                    // borderColor: isViewExpanded ? Colors.PINK : "",
                    // borderWidth: isViewExpanded ? 1 : 0,
                    // borderRadius: 10,
                    // margin: isViewExpanded ? 10 : 0
                  }}>
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

                        handleSourceModalNavigation(item, storeSecondLevelLocal.emp_id, [item.emp_id])



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
                          branchName={checkIsSelfManager()
                            ? ""
                            : item.branch}
                          color={"#2C97DE"}
                          receptionManager={true}
                          navigation={navigation}
                          titleClick={async (e) => { }}
                          roleName={item.roleName}
                          stopLocation={true}
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
                            item.enquiryCount || 0,
                            item.bookingCount || 0,
                            item.retailCount || 0,
                            item.droppedCount || 0,
                          ].map((e, indexss) => {
                            return (
                              <Pressable onPress={() => {

                                // todo redirections logic  third level 
                                if (e > 0) {
                                  if (indexss === 0) {

                                    navigateToEMS("ENQUIRY", "", [item.emp_id], true, storeSecondLevelLocal.emp_id);
                                  } else if (indexss === 1) {
                                    navigateToEMS("BOOKING", "", [item.emp_id], true, storeSecondLevelLocal.emp_id);
                                  } else if (indexss === 2) {
                                    navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true, storeSecondLevelLocal.emp_id);
                                  } else if (indexss === 3) {
                                    // todo navigate to lost 
                                    navigateToDropAnalysis(storeSecondLevelLocal.emp_id, true, item.emp_id)
                                  }
                                }
                              }}>
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
                                      textDecorationLine: e > 0 ? "underline" : "none"
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
      </View>)
  }
  const formateSaleConsutantDataCRM = (itemMain, index) => {
    // let salesconsultant = item.salesconsultant;

    setIndexLocal(index)

    if (index === indexLocal) {
      setisShowSalesConsultant(!isShowSalesConsultant)
    } else {
      setisShowSalesConsultant(true)
    }

    setThirdLevelCRMdata(itemMain?.salesconsultant)
    setstoreSecondLevelLocal(itemMain)

    let findSelectedRecData = itemMain?.salesconsultant?.filter(item => item.emp_id === itemMain.emp_id);
    setStoreSelectedRecData(findSelectedRecData)

  }

  const handleSourceModalNavigation = (item, parentId = "", empList = [], role = "", self = false) => {
    switch (item.roleName.toLowerCase()) {
      case "tele caller":
        navigation.navigate(
          "RECEP_SOURCE_MODEL_DEGITAL",
          {
            empId: parentId ? parentId : item?.emp_id,
            headerTitle: item?.emp_name,
            loggedInEmpId: parentId ? parentId : item.emp_id,
            type: "TEAM",
            moduleType: "DigitalDashboard",
            headerTitle: "Source/Model",
            orgId: userData.orgId,
            role: item.roleName,
            branchList: userData.branchs.map(
              (a) => a.branchId
            ),
            empList: empList
          }
        );
        break;
      case "cre":
        navigation.navigate(
          "RECEP_SOURCE_MODEL_DEGITAL",
          {
            empId: parentId ? parentId : item?.emp_id,
            headerTitle: item?.emp_name,
            loggedInEmpId: parentId ? parentId : item.emp_id,
            type: "TEAM",
            moduleType: "DigitalDashboard",
            headerTitle: "Source/Model",
            orgId: userData.orgId,
            role: item.roleName,
            branchList: userData.branchs.map(
              (a) => a.branchId
            ),
            empList: empList
          }
        );
        break;
      case "field dse":

        navigation.navigate(
          "RECEP_SOURCE_MODEL_DEGITAL",
          {
            empId: parentId ? parentId : item?.emp_id,
            headerTitle: item?.emp_name,
            loggedInEmpId: parentId ? parentId : item.emp_id,
            type: "TEAM",
            moduleType: "DigitalDashboard",
            headerTitle: "Source/Model",
            orgId: userData.orgId,
            role: item.roleName,
            branchList: userData.branchs.map(
              (a) => a.branchId
            ),
            empList: empList
          }
        );
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

        navigation.navigate(
          "RECEP_SOURCE_MODEL_DEGITAL",
          {
            empId: parentId ? parentId : item?.emp_id,
            headerTitle: item?.emp_name,
            loggedInEmpId: parentId ? parentId : item.emp_id,
            type: "TEAM",
            moduleType: "DigitalDashboard",
            headerTitle: "Source/Model",
            orgId: userData.orgId,
            role: role === "CRM" ? "CRM" : "CRM_INd",
            branchList: userData.branchs.map(
              (a) => a.branchId
            ),
            empList: empList,
            self: self
          }
        );
        break;
      default:
        break;
    }
  }

  function navigateToEMS(params) {
    navigation.navigate(AppNavigator.TabStackIdentifiers.ems, {
      screen: "EMS",
      params: {
        screen: "LEADS",
      },
    });
  }

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
                                        branchName={checkIsSelfManager()
                                          ? ""
                                          : item.branch}
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
                    {!selector.saveCRMfilterObj.selectedempId
                      ? renderCRMTree()
                      : selector.saveCRMfilterObj?.selectedDesignation &&
                        selector.saveCRMfilterObj?.selectedDesignation[0] ===
                          "CRM"
                      ? renderCRMTreeFilter()
                      : renderCRETreeFilter()}

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
                              if (selector.saveCRMfilterObj.selectedempId) {
                                if (
                                  selector.saveCRMfilterObj
                                    ?.selectedDesignation &&
                                  selector.saveCRMfilterObj
                                    ?.selectedDesignation[0] === "CRM"
                                ) {
                                  navigation.navigate(
                                    "RECEP_SOURCE_MODEL_DEGITAL",
                                    {
                                      empId:
                                        selector.saveCRMfilterObj
                                          .selectedempId[0],
                                      loggedInEmpId:
                                        selector.saveCRMfilterObj
                                          .selectedempId[0],
                                      // type: "TEAM",
                                      moduleType: "DigitalDashboard",
                                      headerTitle: "Source/Model",
                                      orgId: userData.orgId,
                                      role: "CRM",
                                      branchList: userData.branchs.map(
                                        (a) => a.branchId
                                      ),
                                      // empList: selector.saveCRMfilterObj.selectedempId,
                                      self: true,
                                    }
                                  );
                                } else {
                                  navigation.navigate(
                                    "RECEP_SOURCE_MODEL_DEGITAL",
                                    {
                                      empId:
                                        selector.saveCRMfilterObj
                                          .selectedempId[0],
                                      loggedInEmpId:
                                        selector.saveCRMfilterObj
                                          .selectedempId[0],
                                      // type: "TEAM",
                                      moduleType: "DigitalDashboard",
                                      headerTitle: "Source/Model",
                                      orgId: userData.orgId,
                                      role: selector.saveCRMfilterObj
                                        ?.selectedDesignation[0],
                                      branchList: userData.branchs.map(
                                        (a) => a.branchId
                                      ),
                                      // empList: selector.saveCRMfilterObj.selectedempId,
                                      self: true,
                                    }
                                  );
                                  // handleSourceModalNavigation(item, "", [], "CRM", true)
                                }
                              } else {
                                navigation.navigate(
                                  "RECEP_SOURCE_MODEL_DEGITAL",
                                  {
                                    empId: userData.empId,
                                    headerTitle: "Source/Model",
                                    loggedInEmpId: userData.empId,
                                    orgId: userData.orgId,
                                    role: "xrole",
                                    moduleType: "DigitalDashboard",
                                  }
                                );
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
                                  if (selector.saveCRMfilterObj.selectedempId) {
                                    if (
                                      selector.saveCRMfilterObj
                                        ?.selectedDesignation &&
                                      selector.saveCRMfilterObj
                                        ?.selectedDesignation[0] === "CRM"
                                    ) {
                                      navigation.navigate(
                                        "RECEP_SOURCE_MODEL_DEGITAL",
                                        {
                                          empId:
                                            selector.saveCRMfilterObj
                                              .selectedempId[0],
                                          loggedInEmpId:
                                            selector.saveCRMfilterObj
                                              .selectedempId[0],
                                          // type: "TEAM",
                                          moduleType: "DigitalDashboard",
                                          headerTitle: "Source/Model",
                                          orgId: userData.orgId,
                                          role: "CRM",
                                          branchList: userData.branchs.map(
                                            (a) => a.branchId
                                          ),
                                          // empList: selector.saveCRMfilterObj.selectedempId,
                                          self: true,
                                        }
                                      );
                                    } else {
                                      navigation.navigate(
                                        "RECEP_SOURCE_MODEL_DEGITAL",
                                        {
                                          empId:
                                            selector.saveCRMfilterObj
                                              .selectedempId[0],
                                          loggedInEmpId:
                                            selector.saveCRMfilterObj
                                              .selectedempId[0],
                                          // type: "TEAM",
                                          moduleType: "DigitalDashboard",
                                          headerTitle: "Source/Model",
                                          orgId: userData.orgId,
                                          role: selector.saveCRMfilterObj
                                            ?.selectedDesignation[0],
                                          branchList: userData.branchs.map(
                                            (a) => a.branchId
                                          ),
                                          // empList: selector.saveCRMfilterObj.selectedempId,
                                          self: true,
                                        }
                                      );
                                      // handleSourceModalNavigation(item, "", [], "CRM", true)
                                    }
                                  } else {
                                    navigation.navigate(
                                      "RECEP_SOURCE_MODEL_DEGITAL",
                                      {
                                        empId: userData.empId,
                                        headerTitle: "Source/Model",
                                        loggedInEmpId: userData.empId,
                                        orgId: userData.orgId,
                                        role: "xrole",
                                        moduleType: "DigitalDashboard",
                                      }
                                    );
                                  }
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
                                          selector.receptionistData.RetailCount
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
                                    selector.receptionistData.RetailCount
                                  ) === 0 ||
                                  parseInt(
                                    selector.receptionistData.enquirysCount
                                  ) === 0
                                    ? 0
                                    : Math.round(
                                        (parseInt(
                                          selector.receptionistData.RetailCount
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
