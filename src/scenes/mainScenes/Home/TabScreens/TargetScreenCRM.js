import React, { useEffect, useRef, useState ,useMemo} from "react";
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
import { IconButton } from "react-native-paper";
import { client } from "../../../../networking/client";
import URL from "../../../../networking/endpoints";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TextTicker from "react-native-text-ticker";
import AnimLoaderComp from "../../../../components/AnimLoaderComp";
import { isArrayBufferView } from "util/types";
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

const receptionistRole = ["Reception", "CRM", "Tele Caller", "CRE"];
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

  const [secondLevelCRMdata, setSecondLevelCRMdata] = useState([]);
  const [thirdLevelCRMdata, setThirdLevelCRMdata] = useState([]);
  const [storeSelectedRecData, setStoreSelectedRecData] = useState([]);
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const [isShowSalesConsultant, setisShowSalesConsultant] = useState(false);
  const [indexLocal, setIndexLocal] = useState(-1);
  const [storeSecondLevelLocal, setstoreSecondLevelLocal] = useState([]);

  const [userData, setUserData] = useState({
    empId: 0,
    empName: "",
    hrmsRole: "",
    orgId: 0,
    branchs: [],
  });
  const [isParentClicked, setisParentClicked] = useState(false)
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
      empName: 'pallavi sanjay ',
      id:1,
      isOpen: true,
      children: [
        {
          empName: 'Nivedithas',
          isOpen: true,
          id: 11,
          parentId:1,
          children: [
            {
              empName: 'cheten',
              id: 111,
              isOpen: false,
              // children: [],
            },
          ],
        }, {
          empName: 'kartika',
          isOpen: true,
          parentId: 1,
          id: 22,
          children: [
            {
              empName: 'cheten',
              id:222,
              isOpen: false,
              // children: [],
            },
          ],
        },

        {
          empName: 'cheten',
          id:33,
          parentId: 1,
          isOpen: false,
          // children: [],
        },
      ],
    },

    {
      empName: 'Node 2',
      isOpen: true,
      id:2,
      children: [
        {
          empName: 'Nivedithas',
          isOpen: true,
          id: 12,
          parentId: 2,
          children: [
            {
              empName: 'cheten',
              id: 121,
              isOpen: false,
              // children: [],
            },
          ],
        }, {
          empName: 'kartika',
          isOpen: true,
          parentId: 2,
          id: 22,
          children: [
            {
              empName: 'cheten',
              id: 222,
              isOpen: false,
              // children: [],
            },
          ],
        },

        {
          empName: 'cheten',
          id: 33,
          parentId:2,
          isOpen: false,
          // children: [],
        },
      ]
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
      let data =
        userData.hrmsRole == "CRM" ? [...crmMetaData] : [...paramsMetadata];
      data = data.filter((x) => x.toggleIndex === 0);
      setToggleParamsMetaData([...data]);
    }
  }, [selector.isTeam]);

  useEffect(() => {

   
    if (selector.receptionistData?.fullResponse){
      let data = selector.receptionistData.fullResponse?.manager
      
      let otherUserData = data.filter((item)=>{
        return item.emp_id !== userData.empId 
      })
      let consultantDataForCRM = data.filter((item) => {
        return item.emp_id === userData.empId
      })
      console.log("manthan--dddsssss ", consultantDataForCRM);
     
      setSecondLevelCRMdata([...otherUserData])
    }
    
   
  }, [selector.receptionistData])
  

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
      setIsViewExpanded(false)
      setisShowSalesConsultant(false)
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
        loggedInEmpId: userData.empId,
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

  function navigateToEMS(params = "", screenName = "", selectedEmpId = []) {
    navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
    setTimeout(() => {
      navigation.navigate("LEADS", {
        screenName: "TARGETSCREEN1",
        params: params,
        moduleType: "",
        employeeDetail: "",
        selectedEmpId: selectedEmpId,
        startDate: selector.receptionistFilterIds.startDate,
        endDate: selector.receptionistFilterIds.endDate,
        dealerCodes: selector.receptionistFilterIds.dealerCodes
      });
    }, 1000);
  }

  function navigateToDropLostCancel(params) {
  
    navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis, {
      screen: "DROP_ANALYSIS",
      params: { emp_id: params, fromScreen: "targetScreen1", dealercodes: selector.receptionistFilterIds.dealerCodes },
    });
    

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
              item.id === 0 ? selector.receptionistData.enquirysCount > 0 && navigateToEMS("ENQUIRY", "", [userData.empId]) :
                item.id === 1 ? navigateToEMS("BOOKING", "", [userData.empId]) :
                  item.id === 2 ? selector.receptionistData.RetailCount > 0 && navigateToEMS("INVOICECOMPLETED", "", [userData.empId]) :
                    item.id === 3 ? navigateToDropLostCancel([userData.empId]) : null
            }
          }}>
            {item.id === 0 ? <Text style={styles.txt10}> {selector.receptionistData.enquirysCount} </Text> : 
              item.id === 1 ? <Text style={styles.txt10}> {selector.receptionistData.bookingsCount} </Text> : 
                item.id === 2 ? <Text style={styles.txt10}>  {selector.receptionistData.RetailCount} </Text> : 
                  item.id === 3 ? <Text style={styles.txt10}> {selector.receptionistData.totalLostCount} </Text> : 
            <Text style={styles.txt10}>0</Text> }
           
          </TouchableOpacity>
        </View>
      </View>)
  }
    
  // const renderTree = (item) => {
  //   if (!item || item.length === 0) {
  //     return null;
  //   }
  //   return item.map((item, index) => (
     
  //     <>
  //       <ScrollView key={index + 1}>
         
  //         <View
  //           style={{
  //             paddingHorizontal: 8,
  //             display: "flex",
  //             flexDirection: "row",
  //             justifyContent: "space-between",
  //             marginTop: 12,
  //             width: Dimensions.get("screen").width - 28,
  //           }}
  //         >
  //           <View style={{ flexDirection: "row" }}>
  //             <Text
  //               style={{
  //                 fontSize: 12,
  //                 fontWeight: "600",
  //                 textTransform: "capitalize",
  //               }}
  //             >
  //               {item.empName}
  //               {"  "}
  //               {"-   " + item?.roleName}
  //             </Text>
  //           </View>
  //           <View style={{ flexDirection: "row" }}></View>
  //         </View>
  //         {/*Source/Model View END */}
  //         <View
  //           style={[
  //             { flexDirection: "row" },
  //             item.isOpenInner && {
  //               borderRadius: 10,
  //               borderWidth: 2,
  //               borderColor: "#C62159",
  //               marginHorizontal: 6,
  //               overflow: "hidden",
  //             },
  //           ]}
  //         >
  //           {/*RIGHT SIDE VIEW*/}
  //           <View style={[styles.view6]}>
  //             <View style={styles.view7}>
  //               <RenderLevel1NameView
  //                 level={0}
  //                 item={item}
  //                 branchName={item.branch}
  //                 color={"#C62159"}
  //                 receptionManager={true}
  //                 navigation={navigation}
  //                 titleClick={async () => {
                   
  //                   if(item.isOpen){
  //                     setisParentClicked(true);
  //                   }else{
  //                     setisParentClicked(false);
  //                   }

  //                 }}
  //                 roleName={item.roleName}
  //                 stopLocation={true}
  //               />
  //               <View
  //                 style={{
  //                   flex: 1,
  //                   backgroundColor:
  //                     "rgba(223,228,231,0.67)",
  //                   alignItems: "center",
  //                   flexDirection: "row",
  //                 }}
  //               >
  //                 {[
  //                   item.totalAllocatedCount || 0,
  //                   item.bookingCount || 0,
  //                   item.RetailCount || 0,
  //                   item.totalDroppedCount || 0,
  //                 ].map((e) => {
  //                   return (
  //                     <View
  //                       style={{
  //                         width: 55,
  //                         height: 30,
  //                         justifyContent: "center",
  //                         alignItems: "center",
  //                       }}
  //                     >
  //                       <Text
  //                         style={{
  //                           fontSize: 16,
  //                           fontWeight: "700",
  //                           // marginLeft: 50,
  //                         }}
  //                       >
  //                         {e || 0}
  //                       </Text>
  //                     </View>
  //                   );
  //                 })}
  //               </View>
  //             </View>
  //             {/* GET EMPLOYEE TOTAL MAIN ITEM */}
  //           </View>
  //         </View>
  //       </ScrollView>
  //       <View style={{borderColor:"red",borderWidth:1 ,marginVertical:10,marginLeft:10}}>
  //         {isParentClicked && renderTree(item.children)}
  //       </View>
        
        
  //     </>
  //   ));
  // };
  // const renderTreeView = (item,index)=>{
  //   return (<View key={`${item.empName} ${index}`}>
  //     <View
  //       style={{
  //         paddingHorizontal: 8,
  //         display: "flex",
  //         flexDirection: "row",
  //         justifyContent: "space-between",
  //         marginTop: 12,
  //         width: Dimensions.get("screen").width - 28,
  //       }}
  //     >
  //       <View style={{ flexDirection: "row" }}>
  //         <Text
  //           style={{
  //             fontSize: 12,
  //             fontWeight: "600",
  //             textTransform: "capitalize",
  //           }}
  //         >
  //           {item.empName}
  //           {"  "}
  //           {"-   " + item?.roleName}
  //         </Text>
  //       </View>
  //       <View style={{ flexDirection: "row" }}></View>
  //     </View>
  //     {/*Source/Model View END */}
  //     <View
  //       style={[
  //         { flexDirection: "row" },
  //         item.isOpenInner && {
  //           borderRadius: 10,
  //           borderWidth: 2,
  //           borderColor: "#C62159",
  //           marginHorizontal: 6,
  //           overflow: "hidden",
  //         },
  //       ]}
  //     >
  //       {/*RIGHT SIDE VIEW*/}
  //       <View style={[styles.view6]}>
  //         <View style={styles.view7}>
  //           <RenderLevel1NameView
  //             level={0}
  //             item={item}
  //             branchName={item.branch}
  //             color={"#C62159"}
  //             receptionManager={true}
  //             navigation={navigation}
  //             titleClick={async () => {}}
  //             roleName={item.roleName}
  //             stopLocation={true}
  //           />
  //           <View
  //             style={{
  //               flex: 1,
  //               backgroundColor:
  //                 "rgba(223,228,231,0.67)",
  //               alignItems: "center",
  //               flexDirection: "row",
  //             }}
  //           >
  //             {[
  //               item.totalAllocatedCount || 0,
  //               item.bookingCount || 0,
  //               item.RetailCount || 0,
  //               item.totalDroppedCount || 0,
  //             ].map((e) => {
  //               return (
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
  //                       // marginLeft: 50,
  //                     }}
  //                   >
  //                     {e || 0}
  //                   </Text>
  //                 </View>
  //               );
  //             })}
  //           </View>
  //         </View>
  //         {/* GET EMPLOYEE TOTAL MAIN ITEM */}
  //       </View>
  //     </View>
  //   </View>)
  // }


  const renderCRMTree = ()=>{
    // todo manthan
    return(
    <View
    // style={{ height: selector.isMD ? "81%" : "80%" }}
    >
      {selector.receptionistData.consultantList.length > 0 &&
        selector.receptionistData.consultantList.map((item, index) => {
         
          if (item.emp_id === userData.empId) {
            return (
              <View key={`${item.emp_name} ${index}`} 
              style={{ 
                borderColor: isViewExpanded ? Colors.PINK : "",
                borderWidth:isViewExpanded? 1: 0, 
                borderRadius:10,
                margin: isViewExpanded?10:0
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
                          <Text>{selector.receptionistData?.fullResponse?.childUserCount}</Text>
                        </View>
                      </Animated.View>
                    )}
                    <SourceModelView
                      onClick={() => {
                        navigation.navigate(
                          "RECEP_SOURCE_MODEL",
                          {
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={item.branch}
                        color={"#C62159"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => { 

                          setIsViewExpanded(!isViewExpanded)  
                        
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
                          isViewExpanded ? item.enquiryCount :  selector.receptionistData.enquirysCount || 0,
                          isViewExpanded ? item.bookingCount :  selector.receptionistData.bookingsCount || 0,
                          isViewExpanded ? item.retailCount  :  selector.receptionistData.RetailCount || 0,
                          isViewExpanded ? item.droppedCount :  selector.receptionistData.totalLostCount || 0,
                        ].map((e) => {
                          return (
                            <Pressable onPress={()=>{
                             
                              // todo redirections logic 
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
                                    textDecorationLine: e  > 0 ?"underline":"none"
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
                {isViewExpanded  && renderCRMTreeChild()}
              </View>
            );
            }
        
        })}
       
    </View>)
  }

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
                            formateSaleConsutantDataCRM(item,index)
                            
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
                          {/* {console.log("manthanddddddd ", !_.isEmpty(storeSelectedRecData[0].enquiryCount))} */}
                          {[
                            isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.enquiryCount:  item.enquiryCount || 0,
                            isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.bookingCount :  item.bookingCount || 0,
                            isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.retailCount :  item.retailCount || 0,
                            isShowSalesConsultant && indexLocal === index && storeSelectedRecData ? storeSelectedRecData[0]?.droppedCount : item.droppedCount || 0,
                          ].map((e) => {
                            return (
                              <Pressable onPress={() => {

                                // todo redirections logic 
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
    // todo manthan
   
    return (
      <View
      // style={{ height: selector.isMD ? "81%" : "80%" }}
      >
        {thirdLevelCRMdata.length > 0 &&
          thirdLevelCRMdata.map((item, index) => {
            if (item.emp_id !== userData.empId) {
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
                      {"-   " + "sales Consultant"}
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
                      <RenderLevel1NameViewCRM
                        level={0}
                        item={item}
                        branchName={item.branch}
                        color={"#C62159"}
                        receptionManager={true}
                        navigation={navigation}
                        titleClick={async (e) => { console.log("manthan---ff ", item); }}
                        roleName={"sales Consultant"}
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
                        ].map((e) => {
                          return (
                            <Pressable onPress={() => {

                              // todo redirections logic 
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
  const formateSaleConsutantDataCRM = (itemMain,index)=>{
    // let salesconsultant = item.salesconsultant;
    setIndexLocal(index)
    setisShowSalesConsultant(!isShowSalesConsultant);
    setThirdLevelCRMdata(itemMain.salesconsultant)
    // console.log("manthan---dd ", itemMain.salesconsultant);

    let findSelectedRecData = itemMain.salesconsultant.filter(item => item.emp_id === itemMain.emp_id);
    setStoreSelectedRecData(findSelectedRecData)
    // console.log("manthan---dd findSelectedRecData ", findSelectedRecData);
  }
  
  return (
    <React.Fragment>
      {!selector.isLoading ? (
        <ScrollView style={styles.container}  >
          {receptionistRole.includes(userData.hrmsRole) ? (
            selector.isTeam ? (
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
                      {/* <View
                    
                      > */}
                        
                          {renderCRMTree()}
                          
                          
                      {/* </View> */}
                       
                        
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
                      style={{ height: Dimensions.get("screen").height / 2.7 }}
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
            selfInsightsData.length > 0 && (
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
                          {CRMRole.includes(userData.hrmsRole) && <View style={{ paddingHorizontal: '8%' }}>
                            <View style={styles.newView}>
                              <Text style={{
                                fontSize: 12,
                                fontWeight: "600",
                                color: Colors.BLUE,
                                marginLeft: 8,
                              }}>Leads Allocated</Text>
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
                            {/* todo */}
                            <FlatList
                              data={data}
                              bounces={false}
                              renderItem={({ item, index }) => renderItem(item, index)}
                              contentContainerStyle={{ width: '100%' }}
                            />
                          </View> 
                            }
                    
                        

                        {/* CRM exisiting code start */}
                          {!CRMRole.includes(userData.hrmsRole) && <>
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
                                                  navigateToEMS("ENQUIRY", "", [item.emp_id]);
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
                                                  navigateToEMS("BOOKING", "", [item.emp_id]);
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
                                                  navigateToEMS("INVOICECOMPLETED", "", [item.emp_id]);
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
                                              
                                                navigateToDropLostCancel([item.emp_id]);
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
                                          if (selector.receptionistData.enquirysCount >0){
                                            let empIdArry = [];
                                            const temp = selector.receptionistData.consultantList.map((item) => {
                                              empIdArry.push(item.emp_id);

                                            })
                                            navigateToEMS("ENQUIRY", "", empIdArry);
                                          }
                                            
                                            
                                        }}
                                        style={{
                                          padding: 2,
                                          textDecorationLine:
                                            selector.receptionistData.enquirysCount >
                                              0
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
                                          if (selector.receptionistData.bookingsCount > 0) {
                                            let empIdArry = [];
                                            const temp = selector.receptionistData.consultantList.map((item) => {
                                              empIdArry.push(item.emp_id);

                                            })
                                            navigateToEMS("BOOKING", "", empIdArry);
                                          }
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
                                          if (selector.receptionistData.RetailCount > 0) {
                                            let empIdArry = [];
                                            const temp = selector.receptionistData.consultantList.map((item) => {
                                              empIdArry.push(item.emp_id);

                                            })
                                            navigateToEMS("INVOICECOMPLETED", "", empIdArry);
                                          }
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
                                          if (selector.receptionistData.totalLostCount > 0) {
                                            let empIdArry = [];
                                            const temp = selector.receptionistData.consultantList.map((item) => {
                                              empIdArry.push(item.emp_id);
                                            })
                                            navigateToDropLostCancel([...empIdArry]);
                                          }
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
                              </View>
                              <View style={styles.view21}>
                                <View style={{ ...styles.statWrap, width: "33%" }}>
                                  <Text style={styles.txt5}>E2B</Text>
                                  {selector.receptionistData.bookingsCount !== null &&
                                    selector.receptionistData.enquirysCount !== null ? (
                                    <Text
                                      style={{
                                        color:
                                          Math.floor(
                                            (parseInt(
                                              selector.receptionistData.bookingsCount
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
                                            selector.receptionistData.bookingsCount
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
                                  {selector.receptionistData.bookingsCount !== null &&
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
                                  {selector.receptionistData.enquirysCount !== null &&
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
                                        selector.receptionistData.enquirysCount
                                      ) === 0 ||
                                        parseInt(
                                          selector.receptionistData.RetailCount
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
                            </ScrollView>
                          </>}
                     
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
        <LoaderComponent
          visible={selector.isLoading}
          onRequestClose={() => {}}
        />
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
    textAlign: "center"
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
    textDecorationLine: 'underline'
  },
  newView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginRight: 10,
  }
});
