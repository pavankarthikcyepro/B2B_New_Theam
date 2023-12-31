import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Colors } from "../../../../styles";
import { TargetListComp } from "../../../../components";
import { ChartNameList, EmptyListView } from "../../../../pureComponents";
import { targetStyle } from "../../../../components/targetListComp";
import { useDispatch, useSelector } from 'react-redux';
import { LineGraphComp } from "../../../../components";
import { rgbaColor } from "../../../../utils/helperFunctions";
import { PATH1705, MONTH } from '../../../../assets/svg';

import VectorImage from 'react-native-vector-image';
import { IconButton } from 'react-native-paper';
import { ProgressBar } from 'react-native-paper';
import moment from 'moment';

import * as AsyncStore from '../../../../asyncStore';
import { ScrollView } from "react-native-gesture-handler";
import ShuffleIcon from "react-native-vector-icons/Entypo";
import { Dropdown } from 'react-native-element-dropdown';
import CloseIcon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import { LoaderComponent } from '../../../../components';

import {
  getEmployeesList,
  getReportingManagerList,
  updateEmployeeDataBasedOnDelegate,
  getDeptDropdown,
  getDesignationDropdown,
  delegateTask,
  getUserWiseTargetParameters,
  getNewTargetParametersAllData,
  getTotalTargetParametersData
} from "../../../../redux/homeReducer";
import { RenderGrandTotal } from "./components/RenderGrandTotal";
import { RenderEmployeeTotal } from "./components/RenderEmployeeTotal";
import { RenderEmployeeParameters } from "./components/RenderEmployeeParameters";
import { RenderSelfInsights } from "./components/RenderSelfInsights";


//const paramtersTitlesData = ["Parameter", "E", "TD", "HV", "VC", "B", "Ex", "R", "F", "I", "Ex-W", "Acc.", "Ev"]
const paramtersTitlesData = ["Parameter", "Target", "Achivement", "Achivement %", "ShortFall", "ShortFall %"]
const chartTitles = ["Target", "Achivement", "ShortFall"];
const parameterTitlesForData = ["Enquiry", "TestDrive", "HomeVisit", "Booking", "EX", "Retail", "Finance", "Invoice", "Ex-W", "Acc.", "Ev"];

const eventTitlesData = ["Event Name", "Enquiry", "TD", "HV", "B", "R", "L"];
const vehicleModelTitlesData = ["Model", "Enquiry", "TD", "HV", "B", "R", "L"];
const leadSourceTitlesData = ["Lead", "Enquiry", "TD", "HV", "B", "R", "L"];

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 100) / 4;

const NameComp = ({ label, labelStyle = {}, showColon = false }) => {

  return (
    <View style={{ height: 20, flexDirection: 'row', justifyContent: "center", alignItems: "center", }}>
      <Text style={[targetStyle.textStyle, labelStyle]} numberOfLines={1}>{label}</Text>
      {/* {showColon ? <Text style={[targetStyle.textStyle]}>{":"}</Text> : null} */}
    </View>
  )
}

export const ParameterScreen = () => {

  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [namesData, setNamesData] = useState([]);
  const [tableDataObject, setTableDataObject] = useState({});


  useEffect(() => {

    if (selector.target_parameters_data) {
      const chartDataLocal = [];
      const namesDataLocal = [];
      const dataObj = {};
      if (selector.target_parameters_data.length > 0) {
        selector.target_parameters_data.forEach((object) => {
          const rgbValue = rgbaColor();
          chartDataLocal.push({
            data: [Number(object.target), Number(object.achievment), Number(object.shortfall)],
            color: () => rgbValue, // optional
            strokeWidth: 2
          })
          namesDataLocal.push({ name: object.paramName, color: rgbValue })
          dataObj[object.paramShortName.toLowerCase()] = object;
        })
      }
      setTableDataObject(dataObj);
      setTableData(selector.target_parameters_data);
      setChartData(chartDataLocal);
      setNamesData(namesDataLocal);
    } else {
      setTableData([]);
    }
  }, [selector.target_parameters_data])

  return (
    <View style={[styles.container, { paddingTop: 10 }]}>
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={{ width: "23%", paddingLeft: 5 }}>
          {paramtersTitlesData.map((item, index) => {
            return (
              <NameComp key={index} label={item} labelStyle={targetStyle.titleStyle} showColon={true} />
            )
          })}
        </View>
        <View style={{ width: "78%" }}>
          <FlatList
            data={parameterTitlesForData}
            listKey="TARGET"
            keyExtractor={(item, index) => "Target" + index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {

              const object = tableDataObject[item.toLowerCase()];
              return (
                <View style={{ alignItems: "flex-start", paddingHorizontal: 5 }}>
                  <NameComp label={item} labelStyle={targetStyle.dataTextStyle} />
                  <NameComp label={object?.target} labelStyle={targetStyle.dataTextStyle} />
                  <NameComp label={object?.achievment} labelStyle={targetStyle.dataTextStyle} />
                  <NameComp label={object?.achivementPerc} labelStyle={targetStyle.dataTextStyle} />
                  <NameComp label={object?.shortfall} labelStyle={targetStyle.dataTextStyle} />
                  <NameComp label={object?.shortFallPerc} labelStyle={targetStyle.dataTextStyle} />
                </View>
              )
            }}
          />
        </View>
      </View>
      <View style={{ backgroundColor: Colors.WHITE, }}>
        <View style={{ paddingLeft: 5, paddingTop: 20, paddingBottom: 10 }}>
          <ChartNameList
            data={namesData}
            itemWidth={itemWidth}
            type={"TARGET_DATA_LIST"}
          />
        </View>
        {chartData.length > 0 && (
          <View style={{ alignItems: 'center', overflow: 'hidden' }}>
            <LineGraphComp chartTitles={chartTitles} chartData={chartData} width={Dimensions.get("window").width - 40} />
          </View>
        )}
      </View>
    </View>
  )
}

export const LeadSourceScreen = () => {

  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([])
  const [chartData, setChartData] = useState([]);
  const [namesData, setNamesData] = useState([]);

  useEffect(() => {
    if (selector.lead_source_table_data) {
      const namesDataLocal = [];
      const chartDataLocal = [];

      if (selector.lead_source_table_data.length > 0) {
        selector.lead_source_table_data.forEach((object) => {
          const rgbValue = rgbaColor();
          chartDataLocal.push({
            data: [Number(object.e), Number(object.t), Number(object.v), Number(object.b), Number(object.r), Number(object.l)],
            color: () => rgbValue, // optional
            strokeWidth: 2
          })
          namesDataLocal.push({ name: object.lead, color: rgbValue })
          // dataObj[object.paramShortName.toLowerCase()] = object;
        })
      }
      setNamesData(namesDataLocal);
      setChartData(chartDataLocal);
      setTableData(selector.lead_source_table_data);
    } else {
      setTableData([]);
    }
  }, [selector.lead_source_table_data])

  return (
    <View style={styles.container}>
      {tableData.length > 0 ? (<TargetListComp data={tableData} titlesData={leadSourceTitlesData} from={"LEAD_SOURCE"} totalWidth={screenWidth - 30} />) : (
        <EmptyListView title={"No Data Found"} />
      )}
      <View style={{ backgroundColor: Colors.WHITE, }}>
        <View style={{ paddingLeft: 5, paddingTop: 20, paddingBottom: 10 }}>
          <ChartNameList
            data={namesData}
            itemWidth={itemWidth}
            type={"LEAD_SOURCE_LIST"}
          />
        </View>
        {chartData.length > 0 && (
          <View style={{ alignItems: 'center', overflow: 'hidden' }}>
            <LineGraphComp chartTitles={leadSourceTitlesData.slice(1)} chartData={chartData} width={Dimensions.get("window").width - 40} />
          </View>
        )}
      </View>
    </View>
  )
}

export const VehicleModelScreen = () => {

  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [namesData, setNamesData] = useState([]);

  useEffect(() => {
    if (selector.vehicle_model_table_data) {
      const namesDataLocal = [];
      const chartDataLocal = [];

      if (selector.vehicle_model_table_data.length > 0) {
        selector.vehicle_model_table_data.forEach((object) => {
          const rgbValue = rgbaColor();
          chartDataLocal.push({
            data: [Number(object.e), Number(object.t), Number(object.v), Number(object.b), Number(object.r), Number(object.l)],
            color: () => rgbValue, // optional
            strokeWidth: 2
          })
          namesDataLocal.push({ name: object.model, color: rgbValue })
        })
      }
      setNamesData(namesDataLocal);
      setChartData(chartDataLocal);
      setTableData(selector.vehicle_model_table_data);
    } else {
      setTableData([]);
    }
  }, [selector.vehicle_model_table_data])

  return (
    <View style={styles.container}>
      {tableData.length > 0 ? (<TargetListComp data={tableData} titlesData={vehicleModelTitlesData} from={"VEHICLE_MODEL"} totalWidth={screenWidth - 30} />) : (
        <EmptyListView title={"No Data Found"} />
      )}
      <View style={{ backgroundColor: Colors.WHITE, }}>
        <View style={{ paddingLeft: 5, paddingTop: 20, paddingBottom: 10 }}>
          <ChartNameList
            data={namesData}
            itemWidth={itemWidth}
            type={"VEHICLE_MODEL_LIST"}
          />
        </View>
        {chartData.length > 0 && (
          <View style={{ alignItems: 'center', overflow: 'hidden' }}>
            <LineGraphComp chartTitles={vehicleModelTitlesData.slice(1)} chartData={chartData} width={Dimensions.get("window").width - 40} />
          </View>
        )}
      </View>
    </View>
  )
}

export const EventScreen = () => {

  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [namesData, setNamesData] = useState([]);

  useEffect(() => {
    if (selector.events_table_data) {
      const namesDataLocal = [];
      const chartDataLocal = [];

      if (selector.events_table_data.length > 0) {
        selector.events_table_data.forEach((object) => {
          const rgbValue = rgbaColor();
          chartDataLocal.push({
            data: [Number(object.e), Number(object.t), Number(object.v), Number(object.b), Number(object.r), Number(object.l)],
            color: () => rgbValue, // optional
            strokeWidth: 2
          })
          namesDataLocal.push({ name: object.eventName, color: rgbValue })
        })
      }
      setNamesData(namesDataLocal);
      setChartData(chartDataLocal);
      setTableData(selector.events_table_data);
    } else {
      setTableData([]);
    }
  }, [selector.events_table_data])

  return (
    <View style={styles.container}>
      {tableData.length > 0 ? (<TargetListComp data={tableData} titlesData={eventTitlesData} from={"EVENT"} totalWidth={screenWidth - 30} />) : (
        <EmptyListView title={"No Data Found"} />
      )}
      <View style={{ backgroundColor: Colors.WHITE, }}>
        <View style={{ paddingLeft: 5, paddingTop: 20, paddingBottom: 10 }}>
          <ChartNameList
            data={namesData}
            itemWidth={itemWidth}
            type={"EVENT_LIST"}
          />
        </View>
        {chartData.length > 0 && (
          <View style={{ alignItems: 'center', overflow: 'hidden' }}>
            <LineGraphComp chartTitles={vehicleModelTitlesData.slice(1)} chartData={chartData} width={Dimensions.get("window").width - 40} />
          </View>
        )}
      </View>
    </View>
  )
}
const data = {
  labels: ["Test1", "Test2"],
  legend: ["L1", "L2", "L3"],
  data: [
    [60, 60, 60],
    [30, 30, 60]
  ],
  barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
};

const targetData = [
  {
    title: 'Enquiry',
    total: 80,
    complete: 62,
    isUp: true,
    percent: 77,
    balance: 18,
    ar: 1.05,
    progress: 0.5,
    color: '#9f31bf'
  },
  {
    title: 'Test Drive',
    total: 60,
    complete: 17,
    isUp: false,
    percent: 23,
    balance: 43,
    ar: 2.05,
    progress: 0.2,
    color: '#00b1ff'
  },
  {
    title: 'Home Visit',
    total: 50,
    complete: 24,
    isUp: true,
    percent: 48,
    balance: 26,
    ar: 1.05,
    progress: 0.7,
    color: '#fb03b9'
  },

  {
    title: 'Booking',
    total: 80,
    complete: 68,
    isUp: true,
    percent: 85,
    balance: 36,
    ar: 1.05,
    progress: 0.8,
    color: '#ffa239'
  },
  {
    title: 'Finance',
    total: 55,
    complete: 37,
    isUp: true,
    percent: 67,
    balance: 18,
    ar: 1.05,
    progress: 0.3,
    color: '#d12a78'
  },
  {
    title: 'Insurance',
    total: 50,
    complete: 46,
    isUp: true,
    percent: 92,
    balance: 16,
    ar: 1.05,
    progress: 0.7,
    color: '#0800ff'
  },
  {
    title: 'Retail',
    total: 20,
    complete: 4,
    isUp: false,
    percent: 20,
    balance: 16,
    ar: 1.05,
    progress: 0.1,
    color: '#1f93ab'
  },
  {
    title: 'Delivery',
    total: 50,
    complete: 25,
    isUp: true,
    percent: 50,
    balance: 25,
    ar: 1.05,
    progress: 0.3,
    color: '#ec3466'
  }
]

const TargetScreen = ({ route, navigation }) => {
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
  const [selfInsightsData, setSelfInsightsData] = useState([]);

  const [dateDiff, setDateDiff] = useState(null);
  const [isTeamPresent, setIsTeamPresent] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [showShuffleModal, setShowShuffleModal] = useState(false);
  const [delegateButtonClick, setDelegateButtonClick] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("Selected employee has Active tasks. Please delegate to another employee");
  const [dropDownPlaceHolder, setDropDownPlaceHolder] = useState("Employees");
  const [allParameters, setAllParameters] = useState([])
  const [selectedName, setSelectedName] = useState('');

  const [employeeListDropdownItem, setEmployeeListDropdownItem] = useState(0);
  const [employeeDropdownList, setEmployeeDropdownList] = useState([]);
  const [reoprtingManagerListDropdownItem, setReoprtingManagerListDropdownItem] = useState(0);
  const [reoprtingManagerDropdownList, setReoprtingManagerDropdownList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isLevel2Available, setIsLevel2Available] = useState(false);
  const [isLevel3Available, setIsLevel3Available] = useState(false);
  const [isLevel4Available, setIsLevel4Available] = useState(false);
  const [isLevel5Available, setIsLevel5Available] = useState(false);

  const getEmployeeListFromServer = async (user) => {
    // dispatch(getEmployeesList(424));
    // const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    // if (employeeData) {
    //   const jsonObj = JSON.parse(employeeData);
    //   const payloadDept = {
    //     "orgId": user.orgId,
    //     "parent": "branch",
    //     "child": "department",
    //     "parentId": user.branchId
    //   }
    //   Promise.all([dispatch(getDeptDropdown(payloadDept))]).then((res1) => {
    //     let dept = [];
    //     dept = res1[0].payload.filter((item) => item.value === jsonObj.primaryDepartment)
    //     const payloadDesig = {
    //       "orgId": user.orgId,
    //       "parent": "department",
    //       "child": "designation",
    //       "parentId": dept ? dept[0].id : 0
    //     }

    //     Promise.all([dispatch(getDesignationDropdown(payloadDesig))]).then((res1) => {
    //       let desig = [];
    //       desig = res1[0].payload.filter((item) => item.value === jsonObj.primaryDesignation)
    //       const payload = {
    //         "empId": user.orgId,
    //         "branchId": user.branchId,
    //         "deptId": dept ? dept[0].id : 0,
    //         "desigId": desig ? desig[0].id : 0
    //       }
    //       dispatch(getEmployeesList(payload));
    //     })
    //   })

    // }

    const payload = {
      "empId": user.empId
    }
    dispatch(getEmployeesList(payload));
  }

  const getReportingManagerListFromServer = async (user) => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(delegateTask({
        fromUserId: jsonObj.empId,
        toUserId: user.empId
      }))
    }
    dispatch(getReportingManagerList(user.orgId));
  }

  const updateEmployeeData = async () => {
    if (employeeListDropdownItem !== 0 && reoprtingManagerListDropdownItem !== 0) {
      const payload = {
        empID: selectedUser.empId,
        managerID: reoprtingManagerListDropdownItem
      }
      Promise.all([dispatch(updateEmployeeDataBasedOnDelegate(payload))]).then(async () => {
        setDelegateButtonClick(false);
        setHeaderTitle("Selected employees has Active tasks. Please delegate to another employee");
        setDropDownPlaceHolder("Employees");

        setEmployeeListDropdownItem(0);
        setEmployeeDropdownList([]);
        setReoprtingManagerListDropdownItem(0);
        setReoprtingManagerDropdownList([]);
        setSelectedUser(null);
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
          const jsonObj = JSON.parse(employeeData);
          const dateFormat = "YYYY-MM-DD";
          const currentDate = moment().format(dateFormat)
          const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
          const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
          const payload2 = {
            "orgId": jsonObj.orgId,
            "selectedEmpId": jsonObj.empId,
            "endDate": monthLastDate,
            "loggedInEmpId": jsonObj.empId,
            "empId": jsonObj.empId,
            "startDate": monthFirstDate,
            "levelSelected": null,
            "pageNo": 0,
            "size": 100
          }
          Promise.allSettled([
            dispatch(getNewTargetParametersAllData(payload2)),
            dispatch(getTotalTargetParametersData(payload2)),
          ]).then(() => {
          });
        }
      })
    }
  }

  useEffect(() => {
    const dateFormat = "YYYY-MM-DD";
    const currentDate = moment().format(dateFormat)
    const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
    setDateDiff((new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24));

    const isInsights = selector.isTeamPresent && !selector.isDSE;
    const isSelf = selector.isDSE;
    const dashboardSelfParamsData = isSelf ? selector.self_target_parameters_data : selector.insights_target_parameters_data;

    if (dashboardSelfParamsData.length > 0) {
      let tempRetail = [];
      tempRetail = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'invoice'
      })
      if (tempRetail.length > 0) {
        setRetailData(tempRetail[0])
      }

      let tempBooking = [];
      tempBooking = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'booking'
      })
      if (tempBooking.length > 0) {
        setBookingData(tempBooking[0])
      }

      let tempEnq = [];
      tempEnq = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'enquiry'
      })
      if (tempEnq.length > 0) {
        setEnqData(tempEnq[0])
      }

      let tempVisit = [];
      tempVisit = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'home visit'
      })
      if (tempVisit.length > 0) {
        setVisitData(tempVisit[0])
      }

      let tempTD = [];
      tempTD = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'test drive'
      })
      if (tempTD.length > 0) {
        setTDData(tempTD[0])
      }


      let tempEXG = [];
      tempEXG = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'exchange'
      })
      if (tempEXG.length > 0) {
        setExgData(tempEXG[0])
      }

      let tempFin = [];
      tempFin = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'finance'
      })
      if (tempFin.length > 0) {
        setFinData(tempFin[0])
      }

      let tempIns = [];
      tempIns = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'insurance'
      })
      if (tempIns.length > 0) {
        setInsData(tempIns[0])
      }

      let tempExw = [];
      tempExw = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'extendedwarranty'
      })
      if (tempExw.length > 0) {
        setExwData(tempExw[0])
      }

      let tempAcc = [];
      tempAcc = dashboardSelfParamsData.filter((item) => {
        return item.paramName.toLowerCase() === 'accessories'
      })
      if (tempAcc.length > 0) {

        setAccData(tempAcc[0])
      }

      setSelfInsightsData([tempEnq[0], tempTD[0], tempVisit[0], tempBooking[0], tempRetail[0], tempEXG[0], tempFin[0], tempIns[0], tempExw[0], tempAcc[0]])

    } else {
    }

    const unsubscribe = navigation.addListener('focus', () => {
      const dateFormat = "YYYY-MM-DD";
      const currentDate = moment().format(dateFormat)
      const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
      setDateDiff((new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24));
    });

    return unsubscribe;

  }, [selector.self_target_parameters_data, selector.insights_target_parameters_data]) //selector.self_target_parameters_data]

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (selector.login_employee_details.hasOwnProperty('roles') && selector.login_employee_details.roles.length > 0) {
        let rolesArr = [];
        rolesArr = selector.login_employee_details?.roles.filter((item) => {
          return item === "Admin Prod" || item === "App Admin" || item === "Manager" || item === "TL" || item === "General Manager" || item === "branch manager" || item === "Testdrive_Manager"
        })
        if (rolesArr.length > 0) {
          setIsTeamPresent(true)
        }
      }
    }

  }, [selector.login_employee_details])

  useEffect(() => {
    setIsTeam(selector.isTeam)
  }, [selector.isTeam])

  const handleModalDropdownDataForShuffle = (user) => {
    if (delegateButtonClick) {
      getReportingManagerListFromServer(user);
      setShowShuffleModal(true);
      // setReoprtingManagerDropdownList(selector.reporting_manager_list.map(({ name: label, id: value, ...rest }) => ({ value, label, ...rest })));
    } else {
      getEmployeeListFromServer(user);
      setShowShuffleModal(true);
      // setEmployeeDropdownList(selector.employee_list.map(({ name: label, id: value, ...rest }) => ({ value, label, ...rest })));
    }
  }

  useEffect(() => {
    setEmployeeDropdownList(selector.employee_list.map(({ name: label, id: value, ...rest }) => ({ value, label, ...rest })));
  }, [selector.employee_list])

  useEffect(() => {
    setReoprtingManagerDropdownList(selector.reporting_manager_list.map(({ name: label, id: value, ...rest }) => ({ value, label, ...rest })));
  }, [selector.reporting_manager_list])

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (selector.all_emp_parameters_data.length > 0) {
        let tempParams = [...selector.all_emp_parameters_data.filter((item) => item.empId !== jsonObj.empId)];
        for (let i = 0; i < tempParams.length; i++) {
          tempParams[i] = {
            ...tempParams[i],
            isOpenInner: false,
            employeeTargetAchievements: []
          }
          // tempParams[i]["isOpenInner"] = false;
          // tempParams[i]["employeeTargetAchievements"] = [];
          if (i === tempParams.length - 1) {
            setAllParameters([...tempParams]);
          }
        }
      }
    }
  }, [selector.all_emp_parameters_data])

  const getColor = (ach, tar) => {
    if (ach > 0 && tar === 0) {
      return '#1C95A6'
    }
    else if (ach === 0 || tar === 0) {
      return '#FA03B9'
    }
    else {
      if ((ach / tar * 100) === 50) {
        return '#EC3466'
      }
      else if ((ach / tar * 100) > 50) {
        return '#1C95A6'
      }
      else if ((ach / tar * 100) < 50) {
        return '#FA03B9'
      }
    }
  }

  // Main Dashboard params Data
  const renderData = (item, color) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <RenderEmployeeParameters item={item} parameterType={'Enquiry'} />
        <RenderEmployeeParameters item={item} parameterType={'Test Drive'} />
        <RenderEmployeeParameters item={item} parameterType={'Home Visit'} />
        <RenderEmployeeParameters item={item} parameterType={'Booking'} />
        <RenderEmployeeParameters item={item} parameterType={'INVOICE'} />
        <RenderEmployeeParameters item={item} parameterType={'Exchange'} />
        <RenderEmployeeParameters item={item} parameterType={'Finance'} />
        <RenderEmployeeParameters item={item} parameterType={'Insurance'} />
        <RenderEmployeeParameters item={item} parameterType={'EXTENDEDWARRANTY'} />
        <RenderEmployeeParameters item={item} parameterType={'Accessories'} />

        <View style={styles.itemBox}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: color,
            }}
          >
            <TouchableOpacity activeOpacity={0.6} onPress={() => {
              setSelectedUser(item)
              handleModalDropdownDataForShuffle(item);
            }} style={{ ...styles.shuffleBGView, backgroundColor: color }}>
              <ShuffleIcon name="shuffle" color={Colors.WHITE} size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const renderTotalView = () => {
    return (
      <View style={styles.totalView}>
        <Text style={styles.totalText}>Total</Text>
      </View>
    )
  }

  return (
    <>
      <Modal
        visible={showShuffleModal}
        animationType={'fade'}
        transparent={true}
        onRequestClose={() => setShowShuffleModal(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          paddingHorizontal: 20
        }}>
          <View
            style={{
              width: "95%",
              height: "30%",
              alignSelf: "center",
              backgroundColor: "white",
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: "#d1d1d1",
                backgroundColor: "#d1d1d1",
                borderTopEndRadius: 8,
                borderTopStartRadius: 8,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: "500", margin: 10 }}>
                Team Shuffle
              </Text>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  setShowShuffleModal(false);
                  setHeaderTitle(
                    "Selected employees has Active tasks. Please delegate to another employee"
                  );
                  setDropDownPlaceHolder("Employees");
                  setDelegateButtonClick(false);
                  setEmployeeDropdownList([]);
                  setReoprtingManagerDropdownList([]);
                }}
              >
                <CloseIcon
                  style={{ margin: 10 }}
                  name="close"
                  color={Colors.BLACK}
                  size={20}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={{ color: Colors.GRAY, marginLeft: 12, marginTop: 5 }}
            >
              {headerTitle}
            </Text>
            <Dropdown
              style={styles.dropdownContainer}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={
                delegateButtonClick
                  ? reoprtingManagerDropdownList
                  : employeeDropdownList
              }
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={dropDownPlaceHolder}
              searchPlaceholder="Search..."
              renderRightIcon={() => (
                <Image
                  style={{ height: 5, width: 10 }}
                  source={require("../../../../assets/images/Polygon.png")}
                />
              )}
              onChange={async (item) => {
                if (delegateButtonClick) {
                  setReoprtingManagerListDropdownItem(item.value);
                } else {
                  setEmployeeListDropdownItem(item.value);
                }
              }}
            />

            <LoaderComponent
              visible={selector.isLoading}
              onRequestClose={() => { }}
            />

            <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, marginBottom: 10, flexDirection: 'row', width: '95%', justifyContent: 'space-around' }}>
              {dropDownPlaceHolder === 'Employees' ?
                <View style={{ flexDirection: 'row', width: '95%', justifyContent: 'space-around' }}>
                  <TouchableOpacity activeOpacity={0.6} style={{ padding: 5, borderRadius: 6, borderColor: Colors.RED, borderWidth: 0.8, width: '43%', alignItems: 'center', justifyContent: 'center', marginLeft: 18, marginRight: 12, backgroundColor: Colors.RED, height: 40 }} onPress={() => {
                    // updateEmployeeData();
                    if (employeeListDropdownItem !== 0) {
                      setDelegateButtonClick(true);
                      setHeaderTitle('Reporting Managers');
                      setDropDownPlaceHolder(state => state = 'Reporting Manager');
                      getReportingManagerListFromServer(selectedUser);
                    }
                  }}>
                    <Text style={{ fontSize: 13, fontWeight: '300', color: Colors.WHITE }}>DELEGATE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.6} style={{ padding: 5, borderRadius: 6, borderColor: Colors.RED, borderWidth: 0.8, width: '43%', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.RED, height: 40 }} onPress={() => {
                    if (employeeListDropdownItem !== 0) {
                      setHeaderTitle('Reporting Managers');
                      setDropDownPlaceHolder('Reporting Manager');
                      setDelegateButtonClick(true);
                      getReportingManagerListFromServer(selectedUser);
                    }
                  }}>
                    <Text style={{ fontSize: 13, fontWeight: '300', color: Colors.WHITE }}>NEXT</Text>
                  </TouchableOpacity>
                </View> :
                <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                  <TouchableOpacity activeOpacity={0.6} style={{ padding: 5, borderRadius: 6, borderColor: Colors.RED, borderWidth: 0.8, width: 80, alignItems: 'center', justifyContent: 'center', marginLeft: 18, marginRight: 12, backgroundColor: Colors.RED, height: 40 }} onPress={() => {
                    if (reoprtingManagerListDropdownItem !== 0) {
                      updateEmployeeData();
                      setShowShuffleModal(false);
                      setHeaderTitle('Selected employees has Active tasks. Please delegate to another employee');
                      setDropDownPlaceHolder('Employees');
                      setDelegateButtonClick(false);
                      setEmployeeDropdownList([]);
                      setReoprtingManagerDropdownList([]);
                    }
                  }}>
                    <Text style={{ fontSize: 13, fontWeight: '300', color: Colors.WHITE }}>SUBMIT</Text>
                  </TouchableOpacity>
                </View>}
            </View>
          </View>
        </View>

      </Modal>

      <Modal
        animationType={'fade'}
        transparent={true}
        visible={selectedName !== ''}
        onRequestClose={() => setSelectedName('')}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          // backgroundColor: 'rgba(0, 0, 0, 0.5)',
          paddingHorizontal: 20
        }}>
          <View style={{ maxWidth: '90%', minHeight: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: '#0c0c0c' }}>
            <Text style={{ fontSize: 16, color: '#0c0c0c', fontWeight: 'bold', textAlign: 'center' }}>{selectedName}</Text>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        {selector.isTeam ? (
          <View >
            <ScrollView contentContainerStyle={{ paddingRight: 20, flexDirection: 'column' }} horizontal={true} directionalLockEnabled={true}>
              {/* TOP Header view */}
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '8%', height: 40, marginRight: 5 }}>

                </View>
                <View style={{ width: '92%', height: 40, flexDirection: 'row' }}>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#FA03B9' }}>Enq</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#FA03B9' }}>TD</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#9E31BE' }}>Visit</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#1C95A6' }}>Bkg</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#C62159' }}>Retail</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#9E31BE' }}>Exg</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#EC3466' }}>Fin</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#1C95A6' }}>Ins</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#1C95A6' }}>ExW</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#C62159' }}>Acc</Text>
                  </View>
                  {/*<View style={styles.itemBox}>*/}
                  {/*  <Text style={{ color: '#EC3466' }}>Total</Text>*/}
                  {/*</View>*/}
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#0c0c0c' }}>Action</Text>
                  </View>
                </View>
              </View>
              {/* Employee params section */}
              {allParameters.length > 0 && allParameters.map((item, index) => {
                return (
                  <View key={`${item.empId} ${index}`}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: '8%', minHeight: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                        {/*// left side name section */}
                        <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C62159', borderRadius: 20, marginTop: item.isOpenInner ? 5 : 5, marginBottom: item.isOpenInner ? 5 : 5 }}
                          onPress={async () => {
                            setSelectedName(item.empName); // to display name on click of the left view - first letter
                            setTimeout(() => {
                              setSelectedName('')
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
                              let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
                              if (employeeData) {
                                const jsonObj = JSON.parse(employeeData);
                                const dateFormat = "YYYY-MM-DD";
                                const currentDate = moment().format(dateFormat)
                                const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                                const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                                let payload = {
                                  "orgId": jsonObj.orgId,
                                  "selectedEmpId": item.empId,
                                  "endDate": monthLastDate,
                                  "loggedInEmpId": jsonObj.empId,
                                  "empId": item.empId,
                                  "startDate": monthFirstDate,
                                  "levelSelected": null,
                                  "pageNo": 0,
                                  "size": 100
                                }
                                Promise.all([
                                  dispatch(getUserWiseTargetParameters(payload))
                                ]).then((res) => {
                                  let tempRawData = [];
                                  tempRawData = res[0]?.payload?.employeeTargetAchievements.filter((emp) => emp.empId !== item.empId);
                                  if (tempRawData.length > 0) {

                                    for (let i = 0; i < tempRawData.length; i++) {
                                      tempRawData[i].empName = tempRawData[i].empName,
                                        tempRawData[i] = {
                                          ...tempRawData[i],
                                          isOpenInner: false,
                                          employeeTargetAchievements: []
                                        }
                                      if (i === tempRawData.length - 1) {
                                        localData[index].employeeTargetAchievements = tempRawData;
                                      }
                                    }
                                  }
                                  // alert(JSON.stringify(localData))
                                  setAllParameters([...localData])
                                })

                                // if (localData[index].employeeTargetAchievements.length > 0) {
                                //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
                                //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
                                //   }
                                // }
                              }
                            }
                            else {
                              setAllParameters([...localData])
                            }
                          }}>
                          <Text style={{ fontSize: 14, color: '#fff' }}>{item.empName.charAt(0)}</Text>
                        </TouchableOpacity>
                        {/* <View style={{ position: 'absolute', left: 10, top: 5 }}>
                      <View style={{ alignSelf: 'center', minWidth: 80, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C62159', borderRadius: 20, paddingHorizontal: 5}}>
                        <Text style={{ fontSize: 14, color: '#fff' }}>{item.empName}</Text>
                      </View>
                    </View> */}
                        {/* <View style={{height: 30, minWidth: 50 , paddingHorizontal: 5, position: 'absolute' , borderWidth: 1, top: 0, left: 50, backgroundColor: '#fff', borderRadius: 3, justifyContent: 'center', }}>
                      <Text>{item.empName}</Text>
                    </View> */}
                        {item.isOpenInner && item.employeeTargetAchievements.length > 0 && item.employeeTargetAchievements.map((innerItem1, innerIndex1) => {
                          return (
                            <>
                              <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F59D00', borderRadius: 20, marginTop: item.isOpenInner ? 5 : 4, marginBottom: item.isOpenInner ? 5 : 4 }} onPress={async () => {
                                setSelectedName(innerItem1.empName);
                                setTimeout(() => {
                                  setSelectedName('')
                                }, 900);
                                let localData = [...allParameters];
                                let current = localData[index].employeeTargetAchievements[innerIndex1].isOpenInner;
                                for (let i = 0; i < localData[index].employeeTargetAchievements.length; i++) {
                                  localData[index].employeeTargetAchievements[i].isOpenInner = false;
                                  if (i === localData[index].employeeTargetAchievements.length - 1) {
                                    localData[index].employeeTargetAchievements[innerIndex1].isOpenInner = !current;
                                  }
                                }

                                if (!current) {
                                  let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
                                  if (employeeData) {
                                    const jsonObj = JSON.parse(employeeData);
                                    const dateFormat = "YYYY-MM-DD";
                                    const currentDate = moment().format(dateFormat)
                                    const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                                    const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                                    let payload = {
                                      "orgId": jsonObj.orgId,
                                      "selectedEmpId": innerItem1.empId,
                                      "endDate": monthLastDate,
                                      "loggedInEmpId": jsonObj.empId,
                                      "empId": innerItem1.empId,
                                      "startDate": monthFirstDate,
                                      "levelSelected": null,
                                      "pageNo": 0,
                                      "size": 100
                                    }
                                    Promise.all([
                                      dispatch(getUserWiseTargetParameters(payload))
                                    ]).then((res) => {
                                      let tempRawData = [];
                                      tempRawData = res[0]?.payload?.employeeTargetAchievements.filter((item) => item.empId !== innerItem1.empId);
                                      if (tempRawData.length > 0) {
                                        for (let i = 0; i < tempRawData.length; i++) {
                                          tempRawData[i] = {
                                            ...tempRawData[i],
                                            isOpenInner: false,
                                            employeeTargetAchievements: []
                                          }
                                          if (i === tempRawData.length - 1) {
                                            localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements = tempRawData;
                                          }
                                        }
                                      }
                                      setAllParameters([...localData])
                                    })

                                    // if (localData[index].employeeTargetAchievements.length > 0) {
                                    //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
                                    //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
                                    //   }
                                    // }
                                    // setAllParameters([...localData])
                                  }
                                }
                                else {
                                  setAllParameters([...localData])
                                }
                                // setAllParameters([...localData])
                              }}>
                                <Text style={{ fontSize: 14, color: '#fff' }}>{innerItem1.empName.charAt(0)}</Text>
                              </TouchableOpacity>
                              {
                                innerItem1.isOpenInner && innerItem1.employeeTargetAchievements.length > 0 && innerItem1.employeeTargetAchievements.map((innerItem2, innerIndex2) => {
                                  return (
                                    <>
                                      <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2C97DE', borderRadius: 20, marginTop: item.isOpenInner ? 5 : 4, marginBottom: item.isOpenInner ? 5 : 4 }} onPress={async () => {
                                        setSelectedName(innerItem2.empName);
                                        setTimeout(() => {
                                          setSelectedName('')
                                        }, 900);
                                        let localData = [...allParameters];
                                        let current = localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].isOpenInner;
                                        for (let i = 0; i < localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements.length; i++) {
                                          localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[i].isOpenInner = false;
                                          if (i === localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements.length - 1) {
                                            localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].isOpenInner = !current;
                                          }
                                        }

                                        if (!current) {
                                          let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
                                          if (employeeData) {
                                            const jsonObj = JSON.parse(employeeData);
                                            const dateFormat = "YYYY-MM-DD";
                                            const currentDate = moment().format(dateFormat)
                                            const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                                            const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                                            let payload = {
                                              "orgId": jsonObj.orgId,
                                              "selectedEmpId": innerItem2.empId,
                                              "endDate": monthLastDate,
                                              "loggedInEmpId": jsonObj.empId,
                                              "empId": innerItem2.empId,
                                              "startDate": monthFirstDate,
                                              "levelSelected": null,
                                              "pageNo": 0,
                                              "size": 100
                                            }
                                            Promise.all([
                                              dispatch(getUserWiseTargetParameters(payload))
                                            ]).then((res) => {
                                              let tempRawData = [];
                                              tempRawData = res[0]?.payload?.employeeTargetAchievements.filter((item) => item.empId !== innerItem2.empId);
                                              if (tempRawData.length > 0) {
                                                for (let i = 0; i < tempRawData.length; i++) {
                                                  tempRawData[i] = {
                                                    ...tempRawData[i],
                                                    isOpenInner: false,
                                                    employeeTargetAchievements: []
                                                  }
                                                  if (i === tempRawData.length - 1) {
                                                    localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements = tempRawData;
                                                  }
                                                }
                                              }
                                              setIsLevel2Available(tempRawData.length > 0);
                                              setAllParameters([...localData])
                                            })

                                            // if (localData[index].employeeTargetAchievements.length > 0) {
                                            //   for (let j = 0; j < localData[index].employeeTargetAchievements.length; j++) {
                                            //     localData[index].employeeTargetAchievements[j].isOpenInner = false;
                                            //   }
                                            // }
                                            // setAllParameters([...localData])
                                          }
                                        }
                                        else {
                                          setAllParameters([...localData])
                                        }
                                        // setAllParameters([...localData])
                                      }}>
                                        <Text style={{ fontSize: 14, color: '#fff' }}>{innerItem2.empName.charAt(0)}</Text>
                                      </TouchableOpacity>

                                      {
                                        innerItem2.isOpenInner && innerItem2.employeeTargetAchievements.length > 0 && innerItem2.employeeTargetAchievements.map((innerItem3, innerIndex3) => {
                                          return (
                                            <>
                                              <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EC3466', borderRadius: 20, marginTop: item.isOpenInner ? 5 : 4, marginBottom: item.isOpenInner ? 5 : 4 }} onPress={async () => {
                                                setSelectedName(innerItem3.empName);
                                                setTimeout(() => {
                                                  setSelectedName('')
                                                }, 900);
                                                let localData = [...allParameters];
                                                let current = localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].isOpenInner;
                                                for (let i = 0; i < localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements.length; i++) {
                                                  localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[i].isOpenInner = false;
                                                  if (i === localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements.length - 1) {
                                                    localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].isOpenInner = !current;
                                                  }
                                                }

                                                if (!current) {
                                                  let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
                                                  if (employeeData) {
                                                    const jsonObj = JSON.parse(employeeData);
                                                    const dateFormat = "YYYY-MM-DD";
                                                    const currentDate = moment().format(dateFormat)
                                                    const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                                                    const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                                                    let payload = {
                                                      "orgId": jsonObj.orgId,
                                                      "selectedEmpId": innerItem3.empId,
                                                      "endDate": monthLastDate,
                                                      "loggedInEmpId": jsonObj.empId,
                                                      "empId": innerItem3.empId,
                                                      "startDate": monthFirstDate,
                                                      "levelSelected": null,
                                                      "pageNo": 0,
                                                      "size": 100
                                                    }
                                                    Promise.all([
                                                      dispatch(getUserWiseTargetParameters(payload))
                                                    ]).then((res) => {
                                                      let tempRawData = [];
                                                      tempRawData = res[0]?.payload?.employeeTargetAchievements.filter((item) => item.empId !== innerItem3.empId);
                                                      if (tempRawData.length > 0) {
                                                        for (let i = 0; i < tempRawData.length; i++) {
                                                          tempRawData[i] = {
                                                            ...tempRawData[i],
                                                            isOpenInner: false,
                                                            employeeTargetAchievements: []
                                                          }
                                                          if (i === tempRawData.length - 1) {
                                                            localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements = tempRawData;
                                                          }
                                                        }
                                                      }
                                                      setIsLevel3Available(tempRawData.length > 0);
                                                      setAllParameters([...localData])
                                                    })
                                                  }
                                                }
                                                else {
                                                  setAllParameters([...localData])
                                                }
                                                // setAllParameters([...localData])
                                              }}>
                                                <Text style={{ fontSize: 14, color: '#fff' }}>{innerItem3.empName.charAt(0)}</Text>
                                              </TouchableOpacity>

                                              {
                                                innerItem3.isOpenInner && innerItem3.employeeTargetAchievements.length > 0 && innerItem3.employeeTargetAchievements.map((innerItem4, innerIndex4) => {
                                                  return (
                                                    <>
                                                      <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C95A6', borderRadius: 20, marginTop: item.isOpenInner ? 5 : 4, marginBottom: item.isOpenInner ? 5 : 4 }} onPress={async () => {
                                                        setSelectedName(innerItem4.empName);
                                                        setTimeout(() => {
                                                          setSelectedName('')
                                                        }, 900);
                                                        let localData = [...allParameters];
                                                        let current = localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].isOpenInner;
                                                        for (let i = 0; i < localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements.length; i++) {
                                                          localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[i].isOpenInner = false;
                                                          if (i === localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements.length - 1) {
                                                            localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].isOpenInner = !current;
                                                          }
                                                        }

                                                        if (!current) {
                                                          let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
                                                          if (employeeData) {
                                                            const jsonObj = JSON.parse(employeeData);
                                                            const dateFormat = "YYYY-MM-DD";
                                                            const currentDate = moment().format(dateFormat)
                                                            const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                                                            const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                                                            let payload = {
                                                              "orgId": jsonObj.orgId,
                                                              "selectedEmpId": innerItem4.empId,
                                                              "endDate": monthLastDate,
                                                              "loggedInEmpId": jsonObj.empId,
                                                              "empId": innerItem4.empId,
                                                              "startDate": monthFirstDate,
                                                              "levelSelected": null,
                                                              "pageNo": 0,
                                                              "size": 100
                                                            }
                                                            Promise.all([
                                                              dispatch(getUserWiseTargetParameters(payload))
                                                            ]).then((res) => {
                                                              let tempRawData = [];
                                                              tempRawData = res[0]?.payload?.employeeTargetAchievements.filter((item) => item.empId !== innerItem4.empId);
                                                              if (tempRawData.length > 0) {
                                                                for (let i = 0; i < tempRawData.length; i++) {
                                                                  tempRawData[i] = {
                                                                    ...tempRawData[i],
                                                                    isOpenInner: false,
                                                                    employeeTargetAchievements: []
                                                                  }
                                                                  if (i === tempRawData.length - 1) {
                                                                    localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements = tempRawData;
                                                                  }
                                                                }
                                                              }
                                                              setIsLevel4Available(tempRawData.length > 0);
                                                              setAllParameters([...localData])
                                                            })
                                                          }
                                                        }
                                                        else {
                                                          setAllParameters([...localData])
                                                        }
                                                        // setAllParameters([...localData])
                                                      }}>
                                                        <Text style={{ fontSize: 14, color: '#fff' }}>{innerItem4.empName.charAt(0)}</Text>
                                                      </TouchableOpacity>

                                                      {
                                                        innerItem4.isOpenInner && innerItem4.employeeTargetAchievements.length > 0 && innerItem4.employeeTargetAchievements.map((innerItem5, innerIndex5) => {
                                                          return (
                                                            <>
                                                              <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#9E31BE', borderRadius: 20, marginTop: item.isOpenInner ? 5 : 4, marginBottom: item.isOpenInner ? 5 : 4 }} onPress={async () => {
                                                                setSelectedName(innerItem5.empName);
                                                                setTimeout(() => {
                                                                  setSelectedName('')
                                                                }, 900);
                                                                let localData = [...allParameters];
                                                                let current = localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[innerIndex5].isOpenInner;
                                                                for (let i = 0; i < localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements.length; i++) {
                                                                  localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[i].isOpenInner = false;
                                                                  if (i === localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements.length - 1) {
                                                                    localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[innerIndex5].isOpenInner = !current;
                                                                  }
                                                                }

                                                                if (!current) {
                                                                  let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
                                                                  if (employeeData) {
                                                                    const jsonObj = JSON.parse(employeeData);
                                                                    const dateFormat = "YYYY-MM-DD";
                                                                    const currentDate = moment().format(dateFormat)
                                                                    const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                                                                    const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                                                                    let payload = {
                                                                      "orgId": jsonObj.orgId,
                                                                      "selectedEmpId": innerItem5.empId,
                                                                      "endDate": monthLastDate,
                                                                      "loggedInEmpId": jsonObj.empId,
                                                                      "empId": innerItem5.empId,
                                                                      "startDate": monthFirstDate,
                                                                      "levelSelected": null,
                                                                      "pageNo": 0,
                                                                      "size": 100
                                                                    }
                                                                    Promise.all([
                                                                      dispatch(getUserWiseTargetParameters(payload))
                                                                    ]).then((res) => {
                                                                      let tempRawData = [];
                                                                      tempRawData = res[0]?.payload?.employeeTargetAchievements.filter((item) => item.empId !== innerItem5.empId);
                                                                      if (tempRawData.length > 0) {
                                                                        for (let i = 0; i < tempRawData.length; i++) {
                                                                          tempRawData[i] = {
                                                                            ...tempRawData[i],
                                                                            isOpenInner: false,
                                                                            employeeTargetAchievements: []
                                                                          }
                                                                          if (i === tempRawData.length - 1) {
                                                                            localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[innerIndex5].employeeTargetAchievements = tempRawData;
                                                                          }
                                                                        }
                                                                      }
                                                                      setIsLevel5Available(tempRawData.length > 0);
                                                                      setAllParameters([...localData])
                                                                    })
                                                                  }
                                                                }
                                                                else {
                                                                  setAllParameters([...localData])
                                                                }
                                                                // setAllParameters([...localData])
                                                              }}>
                                                                <Text style={{ fontSize: 14, color: '#fff' }}>{innerItem5.empName.charAt(0)}</Text>
                                                              </TouchableOpacity>

                                                              {
                                                                innerItem5.isOpenInner && innerItem5.employeeTargetAchievements.length > 0 && innerItem5.employeeTargetAchievements.map((innerItem6, innerIndex6) => {
                                                                  return (
                                                                    <>
                                                                      <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#5BBD66', borderRadius: 20, marginTop: item.isOpenInner ? 5 : 4, marginBottom: item.isOpenInner ? 5 : 4 }} onPress={async () => {
                                                                        setSelectedName(innerItem6.empName);
                                                                        setTimeout(() => {
                                                                          setSelectedName('')
                                                                        }, 900);
                                                                        let localData = [...allParameters];
                                                                        let current = localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[innerIndex5].employeeTargetAchievements[innerIndex6].isOpenInner;
                                                                        for (let i = 0; i < localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[innerIndex5].employeeTargetAchievements.length; i++) {
                                                                          localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[innerIndex5].employeeTargetAchievements[i].isOpenInner = false;
                                                                          if (i === localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[innerIndex5].employeeTargetAchievements.length - 1) {
                                                                            localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[innerIndex5].employeeTargetAchievements[innerIndex6].isOpenInner = !current;
                                                                          }
                                                                        }

                                                                        if (!current) {
                                                                          let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
                                                                          if (employeeData) {
                                                                            const jsonObj = JSON.parse(employeeData);
                                                                            const dateFormat = "YYYY-MM-DD";
                                                                            const currentDate = moment().format(dateFormat)
                                                                            const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                                                                            const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                                                                            let payload = {
                                                                              "orgId": jsonObj.orgId,
                                                                              "selectedEmpId": innerItem6.empId,
                                                                              "endDate": monthLastDate,
                                                                              "loggedInEmpId": jsonObj.empId,
                                                                              "empId": innerItem6.empId,
                                                                              "startDate": monthFirstDate,
                                                                              "levelSelected": null,
                                                                              "pageNo": 0,
                                                                              "size": 100
                                                                            }
                                                                            Promise.all([
                                                                              dispatch(getUserWiseTargetParameters(payload))
                                                                            ]).then((res) => {
                                                                              let tempRawData = [];
                                                                              tempRawData = res[0]?.payload?.employeeTargetAchievements.filter((item) => item.empId !== innerItem6.empId);
                                                                              if (tempRawData.length > 0) {
                                                                                for (let i = 0; i < tempRawData.length; i++) {
                                                                                  tempRawData[i] = {
                                                                                    ...tempRawData[i],
                                                                                    isOpenInner: false,
                                                                                    employeeTargetAchievements: []
                                                                                  }
                                                                                  if (i === tempRawData.length - 1) {
                                                                                    localData[index].employeeTargetAchievements[innerIndex1].employeeTargetAchievements[innerIndex2].employeeTargetAchievements[innerIndex3].employeeTargetAchievements[innerIndex4].employeeTargetAchievements[innerIndex5].employeeTargetAchievements[innerIndex6].employeeTargetAchievements = tempRawData;
                                                                                  }
                                                                                }
                                                                              }
                                                                              setAllParameters([...localData])
                                                                            })
                                                                          }
                                                                        }
                                                                        else {
                                                                          setAllParameters([...localData])
                                                                        }
                                                                        // setAllParameters([...localData])
                                                                      }}>
                                                                        <Text style={{ fontSize: 14, color: '#fff' }}>{innerItem6.empName.charAt(0)}</Text>
                                                                      </TouchableOpacity>
                                                                    </>
                                                                  )
                                                                })
                                                              }

                                                              {isLevel5Available && <View>{renderTotalView()}</View>}
                                                            </>
                                                          )
                                                        })
                                                      }
                                                      {isLevel4Available && <View>{renderTotalView()}</View>}
                                                    </>
                                                  )
                                                })
                                              }
                                              {isLevel3Available && <View>{renderTotalView()}</View>}
                                            </>
                                          )
                                        })
                                      }
                                      {isLevel2Available && <View>{renderTotalView()}</View>}
                                    </>
                                  )
                                })
                              }
                              {/* <=== INNER ITEM 1 TOTAL ===> */}
                              <View>{renderTotalView()}</View>
                            </>
                          )
                        })
                        }
                      </View>
                      {/*RIGHT SIDE VIEW*/}
                      <View style={[{ width: '94%', minHeight: 40, flexDirection: 'column', paddingHorizontal: 5, }, item.isOpenInner && { backgroundColor: '#EEEEEE', borderRadius: 10, borderWidth: 1, borderColor: '#C62159', }]}>
                        <View style={{ width: '100%', minHeight: 40, flexDirection: 'row' }}>
                          {renderData(item, '#C62159')}
                        </View>

                        {item.isOpenInner && item.employeeTargetAchievements.length > 0 &&
                          item.employeeTargetAchievements.map((innerItem1, index) => {
                            return (
                              <View style={[{ width: '100%', minHeight: 40, flexDirection: 'column', }, innerItem1.isOpenInner && { borderRadius: 10, borderWidth: 1, borderColor: '#F59D00', backgroundColor: '#FFFFFF' }]}>
                                <View style={[{ width: '100%', minHeight: 40, flexDirection: 'column', },]}>
                                  {renderData(innerItem1, '#F59D00')}
                                  {
                                    innerItem1.isOpenInner && innerItem1.employeeTargetAchievements.length > 0 &&
                                    innerItem1.employeeTargetAchievements.map((innerItem2, innerIndex2) => {
                                      return (
                                        <View style={[{ width: '98%', minHeight: 40, flexDirection: 'column', }, innerItem2.isOpenInner && { borderRadius: 10, borderWidth: 1, borderColor: '#2C97DE', backgroundColor: '#EEEEEE', marginHorizontal: 5 }]}>
                                          {renderData(innerItem2, '#2C97DE')}
                                          {
                                            innerItem2.isOpenInner && innerItem2.employeeTargetAchievements.length > 0 &&
                                            innerItem2.employeeTargetAchievements.map((innerItem3, innerIndex3) => {
                                              return (
                                                <View style={[{ width: '98%', minHeight: 40, flexDirection: 'column', }, innerItem3.isOpenInner && { borderRadius: 10, borderWidth: 1, borderColor: '#EC3466', backgroundColor: '#FFFFFF', marginHorizontal: 5 }]}>
                                                  {renderData(innerItem3, '#EC3466')}
                                                  {
                                                    innerItem3.isOpenInner && innerItem3.employeeTargetAchievements.length > 0 &&
                                                    innerItem3.employeeTargetAchievements.map((innerItem4, innerIndex4) => {
                                                      return (
                                                        <View style={[{ width: '98%', minHeight: 40, flexDirection: 'column', }, innerItem4.isOpenInner && { borderRadius: 10, borderWidth: 1, borderColor: '#1C95A6', backgroundColor: '#EEEEEE', marginHorizontal: 5 }]}>
                                                          {renderData(innerItem4, '#1C95A6')}
                                                          {
                                                            innerItem4.isOpenInner && innerItem4.employeeTargetAchievements.length > 0 &&
                                                            innerItem4.employeeTargetAchievements.map((innerItem5, innerIndex5) => {
                                                              return (
                                                                <View style={[{ width: '98%', minHeight: 40, flexDirection: 'column', }, innerItem5.isOpenInner && { borderRadius: 10, borderWidth: 1, borderColor: '#C62159', backgroundColor: '#FFFFFF', marginHorizontal: 5 }]}>
                                                                  {renderData(innerItem5, '#C62159')}
                                                                  {
                                                                    innerItem5.isOpenInner && innerItem5.employeeTargetAchievements.length > 0 &&
                                                                    innerItem5.employeeTargetAchievements.map((innerItem6, innerIndex6) => {
                                                                      return (
                                                                        <View style={[{ width: '98%', minHeight: 40, flexDirection: 'column', }, innerItem6.isOpenInner && { borderRadius: 10, borderWidth: 1, borderColor: '#C62159', backgroundColor: '#FFFFFF', marginHorizontal: 5 }]}>
                                                                          {renderData(innerItem6, '#C62159')}
                                                                        </View>
                                                                      )
                                                                    })
                                                                  }
                                                                  {isLevel5Available &&
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                      <RenderEmployeeTotal empId={innerItem5.empId}
                                                                        branchId={innerItem5.branchId} level={5} />
                                                                    </View>
                                                                  }
                                                                </View>
                                                              )
                                                            })
                                                          }
                                                          {isLevel4Available &&
                                                            <View style={{ flexDirection: 'row' }}>
                                                              <RenderEmployeeTotal empId={innerItem4.empId}
                                                                branchId={innerItem4.branchId} level={4} />
                                                            </View>
                                                          }
                                                        </View>
                                                      )
                                                    })
                                                  }
                                                  {isLevel3Available &&
                                                    <View style={{ flexDirection: 'row' }}>
                                                      <RenderEmployeeTotal empId={innerItem3.empId}
                                                        branchId={innerItem3.branchId} level={3} />
                                                    </View>
                                                  }
                                                </View>
                                              )
                                            })
                                          }

                                          {isLevel2Available &&
                                            <View style={{ flexDirection: 'row' }}>
                                              <RenderEmployeeTotal empId={innerItem2.empId}
                                                branchId={innerItem2.branchId} level={2} />
                                            </View>
                                          }

                                        </View>
                                      )
                                    })
                                  }
                                  {/* GET EMPLOYEE TOTAL INNER ITEM 1 ITEM - LEVEL 1 */}
                                  <View style={{ flexDirection: 'row' }}>
                                    <RenderEmployeeTotal empId={innerItem1.empId} branchId={innerItem1.branchId} level={1} />
                                  </View>
                                </View>
                              </View>
                            )
                          })
                        }
                        {/* GET EMPLOYEE TOTAL MAIN ITEM */}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <RenderEmployeeTotal empId={item.empId} branchId={item.branchId} level={0} />
                    </View>
                  </View>
                )
              })}
              {/* Grand Total Section */}
              {selector.totalParameters.length > 0 &&
                <View style={{ flexDirection: 'row', height: 40, backgroundColor: Colors.DARK_GRAY }}>
                  <View style={{ width: '8%', minHeight: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Text style={[styles.grandTotalText, { textAlign: 'center' }]}>Grand Total</Text>
                  </View>
                  <View style={{ width: '92%', minHeight: 40, flexDirection: 'column', marginRight: 5, paddingHorizontal: 5, }}>
                    <View style={{ width: '92%', minHeight: 40, flexDirection: 'row' }}>
                      <RenderGrandTotal parameterType={'Enquiry'} totalParams={selector.totalParameters} />
                      <RenderGrandTotal parameterType={'Test Drive'} totalParams={selector.totalParameters} />
                      <RenderGrandTotal parameterType={'Home Visit'} totalParams={selector.totalParameters} />
                      <RenderGrandTotal parameterType={'Booking'} totalParams={selector.totalParameters} />
                      <RenderGrandTotal parameterType={'INVOICE'} totalParams={selector.totalParameters} />
                      <RenderGrandTotal parameterType={'Exchange'} totalParams={selector.totalParameters} />
                      <RenderGrandTotal parameterType={'Finance'} totalParams={selector.totalParameters} />
                      <RenderGrandTotal parameterType={'Insurance'} totalParams={selector.totalParameters} />
                      <RenderGrandTotal parameterType={'EXTENDEDWARRANTY'} totalParams={selector.totalParameters} />
                      <RenderGrandTotal parameterType={'Accessories'} totalParams={selector.totalParameters} />
                    </View>
                  </View>
                </View>
              }
            </ScrollView>
          </View>
        ) : ( // IF Self or insights
          <>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{ width: "12%", justifyContent: "center", height: 15 }}
              >

              </View>
              <View
                style={{ width: "35%", justifyContent: "space-between", height: 15, flexDirection: "row" }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600" }}>Ach</Text>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>Tar</Text>
              </View>
              {/* <View
                style={{ width: "18%", justifyContent: "center", height: 15, alignItems:"center" }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600" }}>Ach%</Text>
              </View> */}

              <View style={{ width: "45%", flexDirection: "row", marginLeft: 15, alignItems: "center"}}>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <Text style={{ fontSize: 14, fontWeight: "600" }}>Balance</Text>
                </View>
                <View style={{ width: "50%", alignItems: "center" }}>
                  <Text style={{ fontSize: 14, fontWeight: "600" }}>AR/Day</Text>
                </View>
              </View>
            </View>
            <>
              <RenderSelfInsights data={selfInsightsData} />
            </>
            <View
              style={{ flexDirection: "row", marginTop: 16, justifyContent: "space-between", marginHorizontal: 8 }}
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
                        marginRight: 4
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
                        marginRight: 4
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
                        marginRight: 4
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
                        marginRight: 4
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
                        marginRight: 4
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
                        marginRight: 4
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
                        marginRight: 4
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
                        marginRight: 4
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
                        marginRight: 4
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
                      marginRight: 4
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
          </>
        )}
      </View>
    </>
  );
}

export default TargetScreen;

const supportData = [
  {
    title: 'Exg (%)',
    total: 60,
    complete: 24,
    isUp: false,
    percent: 35,
    balance: 12,
    ar: 1.05,
    progress: 0.3,
    color: '#ecbd51'
  },
  {
    title: 'Acc (in rupees)',
    total: '50k',
    complete: '46k',
    isUp: false,
    percent: 92,
    balance: '4k',
    ar: '1.5k',
    progress: 0.3,
    color: '#24c2bd'
  },
  {
    title: 'EXW (%)',
    total: 110,
    complete: 50,
    isUp: true,
    percent: 45,
    balance: 60,
    ar: 1.05,
    progress: 0.5,
    color: '#4639ff'
  },

  {
    title: 'Eve',
    total: 75,
    complete: 29,
    isUp: false,
    percent: 38,
    balance: 46,
    ar: 1.05,
    progress: 0.4,
    color: '#ffcd04'
  },
  {
    title: 'VAS (in rupees)',
    total: '50k',
    complete: '8k',
    isUp: false,
    percent: 16,
    balance: 32,
    ar: '1.5k',
    progress: 0.1,
    color: '#8f39ff'
  },
]

const SupportingScreen = () => {

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: '65%', justifyContent: 'center', height: 30 }}>
          {/* <Text>Enq</Text> */}
        </View>
        <View style={{ width: '35%', flexDirection: 'row', }}>
          <Text>Balance</Text>
          <View style={{ marginRight: 10 }}></View>
          <Text>AR/Day</Text>
        </View>
      </View>
      {
        supportData.map((item, index) => {
          return (
            <View style={{ flexDirection: 'row', marginLeft: 8 }} key={index}>
              <View style={{ width: '10%', justifyContent: 'center', marginTop: 5 }}>
                <Text>{item.title}</Text>
              </View>
              <View style={{ width: '40%', marginTop: 10, position: 'relative' }}>
                <ProgressBar progress={item.progress} color={item.color} style={{ height: 20, borderRadius: 3, backgroundColor: '#eeeeee', }} />
                <View style={{ position: 'absolute', top: 1, left: 2 }}>
                  <Text style={{ color: Colors.WHITE }}>{item.complete}</Text>
                </View>
                <View style={{ position: 'absolute', top: 1, right: 3 }}>
                  <Text>{item.total}</Text>
                </View>
              </View>
              <View style={{ width: '10%', justifyContent: 'center', flexDirection: 'row', height: 25, marginTop: 8, alignItems: 'center', marginLeft: 8 }}>
                <IconButton
                  icon={item.isUp ? "menu-up" : "menu-down"}
                  color={item.isUp ? Colors.DARK_GREEN : Colors.RED}
                  size={30}
                />
                <View style={{ justifyContent: 'center', flexDirection: 'row', height: 25, marginTop: 0, alignItems: 'center', marginLeft: -20 }}>
                  <Text>{item.percent}%</Text>
                </View>
              </View>
              <View style={{ width: '25%', justifyContent: 'center', flexDirection: 'row', height: 25, alignItems: 'center', marginTop: 8, marginLeft: 20 }}>
                <View style={{ width: 30, height: 25, borderColor: item.color, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>{item.balance}</Text>
                </View>
                <View style={{ width: 35, height: 25, borderColor: item.color, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                  <Text>{item.ar}</Text>
                </View>
              </View>
            </View>
          )
        })
      }
      <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginRight: 30, fontSize: 10, fontWeight: "600" }}>Enquiry to Booking (%)</Text>
          <IconButton
            icon={"menu-up"}
            color={'#14ce40'}
            size={30}
          />
          <Text style={{ color: '#14ce40', marginLeft: -20, fontSize: 12, }}>45%</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
          <Text style={{ marginRight: -15, fontSize: 10, fontWeight: "600" }}>Booking to Retail (%)</Text>
          <IconButton
            icon={"menu-down"}
            color={'#ff0000'}
            size={30}
          />
          <Text style={{ color: '#ff0000', marginLeft: -20, fontSize: 12, }}>15%</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', marginTop: -20 }}>
        <Text style={{ marginRight: 30, fontSize: 10, fontWeight: "600" }}>Enquiry to Retail (%)</Text>
        <IconButton
          icon={"menu-up"}
          color={'#14ce40'}
          size={30}
        />
        <Text style={{ color: '#14ce40', marginLeft: -20, fontSize: 12, }}>69%</Text>
      </View>

      <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', marginTop: -15, justifyContent: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 10, fontWeight: "600", color: '#ff0000' }}>View all</Text>
        <VectorImage
          width={6}
          height={11}
          source={PATH1705}
        // style={{ tintColor: Colors.DARK_GRAY }}
        />
      </TouchableOpacity>
    </View>
  )
}

export { SupportingScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingTop: 10
  },
  statWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', height: 30, backgroundColor: "#F5F5F5"
  },
  itemBox: { width: 50, height: 40, justifyContent: 'center', alignItems: 'center' },
  shuffleBGView: {
    width: 30,
    height: 30,
    borderRadius: 60 / 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 13,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    width: '95%',
    height: 45,
    borderRadius: 5,
    margin: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400'
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  grandTotalText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  totalView: { minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  totalText: { fontSize: 12, color: '#000', fontWeight: '500', textAlign: 'center' }
})