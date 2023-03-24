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
  });
  const [selfInsightsData, setSelfInsightsData] = useState([]);

  const [allParameters, setAllParameters] = useState([]);
  const [myParameters, setMyParameters] = useState([]);
  const [filterParameters, setFilterParameters] = useState([]);

  const [crmFirstLevelData, setCrmFirstLevelData] = useState([]);
  const [crmSecondLevelData, setcrmSecondLevelData] = useState([]);
  const [crmThirdLevelData, setCrmThirdLevelData] = useState([]);
  const [storeSecondLevelLocal, setstoreSecondLevelLocal] = useState([]);
  const [crmSecondLevelSelectedData, setCrmSecondLevelSelectedData] = useState([]);
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const [isSecondLevelExpanded, setIsSecondLevelExpanded] = useState(false);
  const [isThirdLevelExpanded, setIsThirdLevelExpanded] = useState(false);
  const [indexLocal, setIndexLocal] = useState(-1);

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
      "target": "0",
      "paramName": "PreEnquiry",
      "shortfall": "0",
      "achievment": "0",
      "shortFallPerc": "0%",
      "achivementPerc": "0%",
      "paramShortName": "Con"
    },
    {
      "target": "0",
      "paramName": "Enquiry",
      "shortfall": "0",
      "achievment": "0",
      "shortFallPerc": "0%",
      "achivementPerc": "0%",
      "paramShortName": "Enq"
    },
    {
      "target": "0",
      "paramName": "Booking",
      "shortfall": "0",
      "achievment": "0",
      "shortFallPerc": "0%",
      "achivementPerc": "0%",
      "paramShortName": "Bkg"
    },
    {
      "target": "0",
      "paramName": "INVOICE",
      "shortfall": "0",
      "achievment": "0",
      "shortFallPerc": "0%",
      "achivementPerc": "0%",
      "paramShortName": "Ret"
    }
  ]
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
    
      setIsViewExpanded(false);
      setIsSecondLevelExpanded(false);
      let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
      if(employeeData){
        const jsonObj = JSON.parse(employeeData);
        setUserData({
          empId: jsonObj.empId,
          empName: jsonObj.empName,
          hrmsRole: jsonObj.hrmsRole,
          orgId: jsonObj.orgId,
          branchs: jsonObj.branchs,
        })

        if (crmRole.includes(jsonObj.hrmsRole)) {
          let tempPayload = {
            "orgId": jsonObj.orgId,
            "loggedInEmpId": jsonObj.empId
          }
          dispatch(getCRM_ManagerLiveLeads(tempPayload))
        }
         
      
       
      }

    });
  }, [navigation]);

  useEffect(() => {
    
    if (!_.isEmpty(selector.crm_response_data) ){
      // console.log("manthan ---f ", selector.crm_response_data);
      let firstLevelData = selector.crm_response_data.CRM.map(item =>{
        // console.log("manthan sss ", JSON.stringify(item.data.manager));
        let firstLevel = item.data.manager.filter(item2 => item2.emp_id === userData.empId)
        setCrmFirstLevelData(firstLevel)
        // console.log("manthan ---ffirstLevel ", JSON.stringify(firstLevel));
        
        // console.log("manthan ---ffirstLevel 22 ", JSON.stringify([...consultantForCRM]));
        

        let consultantForCRM = item.data.manager.filter(item2 => item2.emp_id !== userData.empId)
        if (firstLevel.length > 0) {
          firstLevel.map((itemfrist) => {
            itemfrist.salesconsultant.forEach(element => {
              if (element.emp_id !== userData.empId) {
                consultantForCRM.push(element)
              }

            });
          })
        }
        // console.log("manthan ---secondLevel ", JSON.stringify([...consultantForCRM]));
        setcrmSecondLevelData([...consultantForCRM])
      })


      // set crm insights data 
      let updateReceptinistData = LocalDataForReceptionist.map(item => {
        if (item.paramName === "PreEnquiry") {
          item.achievment = selector.crm_response_data.totalPreInquiryCount;
        } else if (item.paramName === "Enquiry") {
          item.achievment = selector.crm_response_data.totalEnquiryCount;
        } else if (item.paramName === "Booking") {
          item.achievment = selector.crm_response_data.totalBookingCount;
        } else if (item.paramName === "INVOICE") {
          item.achievment = selector.crm_response_data.totalRetailCount;
        }
      })

      setSelfInsightsData([...LocalDataForReceptionist])
    }
  
    
  }, [selector.crm_response_data])
  

  useEffect(async() => {
    // navigation.addListener("focus", async () => {
     
      if (selector.saveLiveleadObject?.levelSelected) {
        
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
          const jsonObj = JSON.parse(employeeData);

          if (receptionistRole.includes(jsonObj.hrmsRole)) {
            let payload = { "orgId": jsonObj.orgId, "loggedInEmpId": jsonObj.empId, "branchList": selector.saveLiveleadObject?.levelSelected }
            dispatch(getTargetReceptionistData(payload));
          }

        }
      } else {
        
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
          const jsonObj = JSON.parse(employeeData);

          if (receptionistRole.includes(jsonObj.hrmsRole)) {
            let payload = { "orgId": jsonObj.orgId, "loggedInEmpId": jsonObj.empId }
            dispatch(getTargetReceptionistData(payload));
          }

        }
      }

    // })
   
    
    
  }, [selector.saveLiveleadObject])
  

  useEffect(() => {
    if (!_.isEmpty(selector.receptionist_self_data)){
      

      let updateReceptinistData = LocalDataForReceptionist.map(item => {
        if (item.paramName === "PreEnquiry"){
          item.achievment = selector.receptionist_self_data.contactsCount;
        } else if (item.paramName === "Enquiry"){
          item.achievment = selector.receptionist_self_data.enquirysCount;
        } else if (item.paramName === "Booking") {
          item.achievment = selector.receptionist_self_data.bookingsCount;
        } else if (item.paramName === "INVOICE") {
          item.achievment = selector.receptionist_self_data.RetailCount;
        }
      })
      
      setSelfInsightsData([...LocalDataForReceptionist])
    }  
    
  }, [selector.receptionist_self_data])
  

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
          if (!selector.saveLiveleadObject?.selectedempId) {
            setFilterParameters([])
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
  }, [selector.all_emp_parameters_data]);

  useEffect(async () => {
    try {
      setIsLoading(true);
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        if (selector.saveLiveleadObject?.selectedempId){
          getDataAfterFilter();
        }else{
          filterParameters([])
        }
       
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [selector.saveLiveleadObject]);


  
  

  const getDataAfterFilter = async()=>{
    
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
                targetAchievements: tempRawData[i]?.targetAchievements
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
          setFilterParameters([...tempRawData])
          // alert(JSON.stringify(tempRawData))
          // setAllParameters([...tempRawData]);
        }
      );

      // if (localData[index].employeeTargetAchievements.length > 0) {
      //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
      //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
      //   }
      // }
    }
  }

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

  const paramNameLabels = { preenquiry: "Contacts", invoice: "Retail" };

  function convertParamNameLabels(paramName) {
    paramName = paramName ? paramName : "";
    if (paramNameLabels.hasOwnProperty(paramName.toLowerCase())) {
      paramName = paramNameLabels[paramName.toLowerCase()];
    }
    return paramName;
  }

  function navigateToEmsScreen(item) {
    const leads = ["enquiry", "booking", "invoice"];
    const { paramName } = item;
    const isContact = paramName.toLowerCase() === "preenquiry";
    const isLead = leads.includes(paramName.toLowerCase());
    // let makeparams = paramName
    let employeeDetail;
    if(filterParameters.length>0){
       employeeDetail = {
        empName: "",
        empId: selector.saveLiveleadObject?.selectedempId[0],
        orgId: "",
        branchId: "",
      };
    }else{
       employeeDetail = {
        empName: "",
        empId: "",
        orgId: "",
        branchId: "",
      };
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
      }, 1000);
    } else if (isContact) {
      navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
      setTimeout(() => {
        navigation.navigate(EmsTopTabNavigatorIdentifiers.preEnquiry, {
          moduleType: "live-leads",
          employeeDetail: employeeDetail
        });
      }, 100);
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



  const renderCRMtreeFirstLevel = ()=>{
    return (
      <>{
        crmFirstLevelData.length > 0 &&
        crmFirstLevelData.map((item, index) => {
          return (

            <View style={{
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
                  console.log("manthan --- > ", isViewExpanded);
                  if(isViewExpanded){
                    handleSourceModalNavigation(item, item?.emp_id, [item.emp_id], "CRM_INd")
                  }else{
                    handleSourceModalNavigation(item, "", [], "CRM")
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
                        setIsViewExpanded(!isViewExpanded)


                        return;
                      }}
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
                        isViewExpanded ? item.contactCount : selector.crm_response_data.totalPreInquiryCount || 0,
                        isViewExpanded ? item.enquiryCount : selector.crm_response_data.totalEnquiryCount || 0,
                        isViewExpanded ? item.bookingCount : selector.crm_response_data.totalBookingCount || 0,
                        isViewExpanded ? item.retailCount : selector.crm_response_data.totalRetailCount || 0,
                      ].map((e, indexss) => {
                        return (
                          <Pressable onPress={() => {

                            // todo redirections logic filter UI 
                            // if (e > 0) {
                            //   if (indexss === 0) {

                            //     navigateToEMS("ENQUIRY", "", [item.emp_id], true);
                            //   } else if (indexss === 1) {
                            //     navigateToEMS("BOOKING", "", [item.emp_id], true);
                            //   } else if (indexss === 2) {
                            //     navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true);
                            //   } else if (indexss === 3) {
                            //     // todo navigate to lost 
                            //     navigateToDropAnalysis(selector.saveCRMfilterObj.selectedempId[0], true)
                            //   }
                            // }

                          }}>
                            <View
                              style={{
                                width: 55,
                                height: 30,
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft:10,
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
          })
      }
      
      </>)
  }


  const renderCRMtreeSecondLevel = () => {
    return (
      <>{
        crmSecondLevelData.length > 0 &&
        crmSecondLevelData.map((item, index) => {
          return (

            <View style={{
              borderColor: isSecondLevelExpanded && indexLocal === index ? Colors.BLUE : "",
              borderWidth: isSecondLevelExpanded && indexLocal === index ? 1 : 0,
              borderRadius: 10,
              margin: isSecondLevelExpanded && indexLocal === index ? 10 : 0
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
                        // setIsViewExpanded(!isViewExpanded)
                        // setIsSecondLevelExpanded(!isSecondLevelExpanded)
                        formateSaleConsutantDataCRM(item,index)
                        return;
                      }}
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
                        isSecondLevelExpanded && index === indexLocal && crmSecondLevelSelectedData ? crmSecondLevelSelectedData[0].contactCount : item.contactCount   || 0,
                        isSecondLevelExpanded && index === indexLocal && crmSecondLevelSelectedData ? crmSecondLevelSelectedData[0].enquiryCount : item.enquiryCount   || 0,
                        isSecondLevelExpanded && index === indexLocal && crmSecondLevelSelectedData ? crmSecondLevelSelectedData[0].bookingCount : item.bookingCount || 0,
                        isSecondLevelExpanded && index === indexLocal && crmSecondLevelSelectedData ? crmSecondLevelSelectedData[0].retailCount  : item.retailCount || 0,
                      ].map((e, indexss) => {
                        return (
                          <Pressable onPress={() => {

                            // todo redirections logic filter UI 
                            // if (e > 0) {
                            //   if (indexss === 0) {

                            //     navigateToEMS("ENQUIRY", "", [item.emp_id], true);
                            //   } else if (indexss === 1) {
                            //     navigateToEMS("BOOKING", "", [item.emp_id], true);
                            //   } else if (indexss === 2) {
                            //     navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true);
                            //   } else if (indexss === 3) {
                            //     // todo navigate to lost 
                            //     navigateToDropAnalysis(selector.saveCRMfilterObj.selectedempId[0], true)
                            //   }
                            // }

                          }}>
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
              {isSecondLevelExpanded && index === indexLocal && renderCRMtreeThirdLevel()}
            </View>
          );
        })
      }

      </>)
  }

  const formateSaleConsutantDataCRM = (itemMain, index) => {
    // let salesconsultant = item.salesconsultant;
    // console.log("manthan dd manthan d ", JSON.stringify(itemMain));
    setIndexLocal(index)

    if (index === indexLocal) {
     
      setIsSecondLevelExpanded(!isSecondLevelExpanded)
    } else {
   
      setIsSecondLevelExpanded(true)
    }
    console.log("manthan ---ddd ", itemMain);
    setCrmThirdLevelData(itemMain?.salesconsultant)
    setstoreSecondLevelLocal(itemMain)

    let findSelectedRecData = itemMain?.salesconsultant?.filter(item => item.emp_id === itemMain.emp_id);
    // console.log("manthan dd findSelectedRecData ", JSON.stringify(findSelectedRecData));
    setCrmSecondLevelSelectedData(findSelectedRecData)
  }

  const renderCRMtreeThirdLevel = () => {
    return (
      <>{
        crmThirdLevelData?.length > 0 &&
        crmThirdLevelData?.map((item, index) => {
          if (item.emp_id !== userData.empId && crmSecondLevelSelectedData[0].emp_id !== item.emp_id) {
            return (

              <View style={{
                // borderColor: isSecondLevelExpanded && indexLocal === index ? Colors.BLUE : "",
                // borderWidth: isSecondLevelExpanded && indexLocal === index ? 1 : 0,
                // borderRadius: 10,
                // margin: isSecondLevelExpanded && indexLocal === index ? 10 : 0
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
                        
                          return;
                        }}
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
                          item.contactCount || 0,
                          item.enquiryCount || 0,
                          item.bookingCount || 0,
                          item.retailCount || 0,
                        ].map((e, indexss) => {
                          return (
                            <Pressable onPress={() => {

                              // todo redirections logic filter UI 
                              // if (e > 0) {
                              //   if (indexss === 0) {

                              //     navigateToEMS("ENQUIRY", "", [item.emp_id], true);
                              //   } else if (indexss === 1) {
                              //     navigateToEMS("BOOKING", "", [item.emp_id], true);
                              //   } else if (indexss === 2) {
                              //     navigateToEMS("INVOICECOMPLETED", "", [item.emp_id], true);
                              //   } else if (indexss === 3) {
                              //     // todo navigate to lost 
                              //     navigateToDropAnalysis(selector.saveCRMfilterObj.selectedempId[0], true)
                              //   }
                              // }

                            }}>
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
        })
      }

      </>)
  }


  const handleSourceModalNavigation = (item, parentId = "", empList = [], role = "") => {
    console.log("manthan dddd ",role);
    switch (item.roleName.toLowerCase()) {
      case "tele caller":
        navigation.navigate(
          "RECEP_SOURCE_MODEL_CRM",
          {
            empId: parentId ? parentId : item?.emp_id,
            headerTitle: item?.emp_name,
            loggedInEmpId: parentId ? parentId : item.emp_id,
            type: "TEAM",
            moduleType: "live-leads",
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
          "RECEP_SOURCE_MODEL_CRM",
          {
            empId: parentId ? parentId : item?.emp_id,
            headerTitle: item?.emp_name,
            loggedInEmpId: parentId ? parentId : item.emp_id,
            type: "TEAM",
            moduleType: "live-leads",
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
          "RECEP_SOURCE_MODEL_CRM",
          {
            empId: parentId ? parentId : item?.emp_id,
            headerTitle: item?.emp_name,
            loggedInEmpId: parentId ? parentId : item.emp_id,
            type: "TEAM",
            moduleType: "live-leads",
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
        console.log("manthan dddd 22", role == "CRM" ? "CRM" : "CRM_INd");

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
       
        navigation.navigate(
          "RECEP_SOURCE_MODEL_CRM",
          {
            empId: parentId ? parentId : item?.emp_id,
            headerTitle: item?.emp_name,
            loggedInEmpId: parentId ? parentId : item.emp_id,
            type: "TEAM",
            moduleType: "live-leads",
            headerTitle: "Source/Model",
            orgId: userData.orgId,
            role: role == "CRM" ? "CRM" : "CRM_INd",
            branchList: userData.branchs.map(
              (a) => a.branchId
            ),
            empList: empList
          }
        );
        break;
      default:
        break;
    }
  }

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
                    <View
                      style={{ width: 70, height: 20, marginRight: 5 }}
                    ></View>
                    <View
                      style={{ width: "100%", height: 20, flexDirection: "row" }}
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

                    {crmRole.includes(userData.hrmsRole) ? <>
                      {renderCRMtreeFirstLevel()}
                    </> :<>

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
                                      AppNavigator.HomeStackIdentifiers.sourceModel,
                                      {
                                        empId: selector.saveLiveleadObject?.selectedempId[0],
                                        headerTitle: item?.empName,
                                        loggedInEmpId:
                                          selector.saveLiveleadObject?.selectedempId[0],
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
                                        branchName={getBranchName(item?.branch)}
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


                        {allParameters.length > 0 && filterParameters.length == 0 &&
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
                                    width: "100%",
                                  }}
                                >
                                  <Text style={{ fontSize: 12, fontWeight: "600" }}>
                                    {item.empName}
                                  </Text>
                                  <Pressable
                                    onPress={() => {
                                      navigation.navigate(
                                        AppNavigator.HomeStackIdentifiers.sourceModel,
                                        {
                                          empId: item.empId,
                                          headerTitle: item.empName,
                                          loggedInEmpId:
                                            selector.login_employee_details.empId,
                                          orgId: selector.login_employee_details.orgId,
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
                                      item.employeeTargetAchievements.length > 0 &&
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
                                                    justifyContent: "space-between",
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
                                                      }}
                                                    >
                                                      Source/Model
                                                    </Text>
                                                  </Pressable>
                                                </View>
                                                {/*Source/Model View END */}
                                                <View style={{ flexDirection: "row" }}>
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
                                                          ].isOpenInner = !current;
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
                                                            JSON.parse(employeeData);
                                                          const dateFormat =
                                                            "YYYY-MM-DD";
                                                          const currentDate =
                                                            moment().format(dateFormat);
                                                          const monthFirstDate = moment(
                                                            currentDate,
                                                            dateFormat
                                                          )
                                                            .subtract(0, "months")
                                                            .startOf("month")
                                                            .format(dateFormat);
                                                          const monthLastDate = moment(
                                                            currentDate,
                                                            dateFormat
                                                          )
                                                            .subtract(0, "months")
                                                            .endOf("month")
                                                            .format(dateFormat);
                                                          let payload = {
                                                            orgId: jsonObj.orgId,
                                                            selectedEmpId:
                                                              innerItem1.empId,
                                                            endDate: monthLastDate,
                                                            loggedInEmpId:
                                                              jsonObj.empId,
                                                            empId: innerItem1.empId,
                                                            startDate: monthFirstDate,
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
                                                              tempRawData.length > 0
                                                            ) {
                                                              for (
                                                                let i = 0;
                                                                i < tempRawData.length;
                                                                i++
                                                              ) {
                                                                tempRawData[i] = {
                                                                  ...tempRawData[i],
                                                                  isOpenInner: false,
                                                                  employeeTargetAchievements:
                                                                    [],
                                                                  tempTargetAchievements:
                                                                    tempRawData[i]
                                                                      ?.targetAchievements,
                                                                };
                                                                if (
                                                                  i ===
                                                                  tempRawData.length - 1
                                                                ) {
                                                                  localData[
                                                                    index
                                                                  ].employeeTargetAchievements[
                                                                    innerIndex1
                                                                  ].employeeTargetAchievements =
                                                                    tempRawData;
                                                                  let newIds =
                                                                    tempRawData.map(
                                                                      (emp) => emp.empId
                                                                    );
                                                                  if (
                                                                    newIds.length >= 2
                                                                  ) {
                                                                    for (
                                                                      let i = 0;
                                                                      i < newIds.length;
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
                                                  {renderData(innerItem1, "#F59D00")}
                                                </View>
                                                {innerItem1.isOpenInner &&
                                                  innerItem1.employeeTargetAchievements
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
                                                              flexDirection: "column",
                                                            },
                                                            innerItem2.isOpenInner && {
                                                              borderRadius: 10,
                                                              borderWidth: 1,
                                                              borderColor: "#2C97DE",
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
                                                              flexDirection: "row",
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
                                                                  fontWeight: "600",
                                                                  color: Colors.BLUE,
                                                                  marginLeft: 8,
                                                                }}
                                                              >
                                                                Source/Model
                                                              </Text>
                                                            </Pressable>
                                                          </View>
                                                          <View
                                                            style={{
                                                              flexDirection: "row",
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
                                                                  setSelectedName("");
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
                                                                    localData[index]
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
                                                                        .endOf("month")
                                                                        .format(
                                                                          dateFormat
                                                                        );
                                                                    let payload = {
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
                                                                      async (res) => {
                                                                        let tempRawData =
                                                                          [];
                                                                        tempRawData =
                                                                          res[0]?.payload?.employeeTargetAchievements.filter(
                                                                            (item) =>
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
                                                                          [...localData]
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
                                                                  setAllParameters([
                                                                    ...localData,
                                                                  ]);
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
                                                                    key={innerIndex3}
                                                                    style={[
                                                                      {
                                                                        width: "98%",
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
                                                                        .length > 0 &&
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
                    </>}   
            
                  {/* Grand Total Section */}
                  {selector.totalParameters.length > 0 && (
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


                </ScrollView>
              )}
            </View>  

          
          </>
        ) : (
          // IF Self or insights
          <>

              {!receptionistRole.includes(userData.hrmsRole) ? <>
                <View style={{ marginTop: 16, marginHorizontal: 24 }}>
                  <Pressable
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                      navigation.navigate(
                        AppNavigator.HomeStackIdentifiers.sourceModel,
                        {
                          empId: filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                          headerTitle: "Source/Model",
                          loggedInEmpId: filterParameters.length > 0 ? filterParameters[0].empId : selector.login_employee_details.empId,
                          type: selector.isDSE ? "SELF" : "INSIGHTS",
                          moduleType: "live-leads",
                          orgId: selector.login_employee_details.orgId,
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
              </> : null}
            
            {receptionistRole.includes(userData.hrmsRole) ? <>
                <View style={{ marginTop: 16, marginHorizontal: 24 }}>
                  <Pressable
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                      navigation.navigate(
                        "RECEP_SOURCE_MODEL",
                        {
                          empId: selector.login_employee_details.empId,
                          headerTitle: "Source/Model",
                          loggedInEmpId: selector.login_employee_details.empId,
                          type: "TEAM",
                          moduleType: "live-leads",
                          orgId: userData.orgId,
                          role: userData.hrmsRole,
                          branchList: userData.branchs.map(
                            (a) => a.branchId
                          ),
                        }
                      );
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
                          renderSelfInsightsView(item, index)
                        }
                      />
                    )}
                </View>
            </> : null }

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
});
