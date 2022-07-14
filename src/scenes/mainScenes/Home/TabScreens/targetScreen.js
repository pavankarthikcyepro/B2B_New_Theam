import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Colors } from "../../../../styles";
import { TargetListComp } from "../../../../components";
import { DropDownSelectionItem, DateSelectItem, ChartNameList, EmptyListView } from "../../../../pureComponents";
import { targetStyle } from "../../../../components/targetListComp";
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, BarChart, StackedBarChart } from "react-native-chart-kit";
import { random_color } from "../../../../utils/helperFunctions";
import { LineGraphComp } from "../../../../components";
import { rgbaColor } from "../../../../utils/helperFunctions";
import { PATH1705, MONTH } from '../../../../assets/svg';

import Slider from "react-native-slider";
import { UPARROW } from '../../../../assets/svg';
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

import { getEmployeesList, getReportingManagerList, updateEmployeeDataBasedOnDelegate, getDeptDropdown, getDesignationDropdown, delegateTask, getUserWiseTargetParameters, getNewTargetParametersAllData } from "../../../../redux/homeReducer";


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
      // console.log("chartDataLocal: ", chartDataLocal)
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
      // console.log("test: ", selector.lead_source_table_data)
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
const color = [
  '#9f31bf', '#00b1ff', '#fb03b9', '#ffa239', '#d12a78', '#0800ff', '#1f93ab', '#ec3466'
]

const TargetScreen = ({ route, navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();

  const [retailData, setRetailData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [enqData, setEnqData] = useState(null);

  const [visitData, setVisitData] = useState(null);
  const [TDData, setTDData] = useState(null);
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

  const getEmployeeListFromServer = async (user) => {
    // dispatch(getEmployeesList(424));
    // const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    // console.log("EMP DTLS: ", employeeData);
    // if (employeeData) {
    //   const jsonObj = JSON.parse(employeeData);
    //   const payloadDept = {
    //     "orgId": user.orgId,
    //     "parent": "branch",
    //     "child": "department",
    //     "parentId": user.branchId
    //   }
    //   Promise.all([dispatch(getDeptDropdown(payloadDept))]).then((res1) => {
    //     console.log("TTTRRR: ", JSON.stringify(res1));
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
    //       console.log("EMP PAYLOAD: ", payload);
    //       dispatch(getEmployeesList(payload));
    //     })
    //   })

    // }

    const payload = {
      "empId": user.empId
    }
    console.log("EMP PAYLOAD: ", payload);
    dispatch(getEmployeesList(payload));
  }

  const getReportingManagerListFromServer = async (user) => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    console.log("EMP DTLS: ", employeeData);
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
        console.log("EMP DTLS: ", employeeData);
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
          console.log("$$$$PAYLOAD:", payload2);
          Promise.allSettled([
            dispatch(getNewTargetParametersAllData(payload2)),
            dispatch(getTotalTargetParametersData(payload2)),
          ]).then(() => {
            console.log('I did everything!');
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
    if (selector.self_target_parameters_data.length > 0) {
      let tempRetail = [];
      tempRetail = selector.self_target_parameters_data.filter((item) => {
        return item.paramName.toLowerCase() === 'invoice'
      })
      if (tempRetail.length > 0) {
        setRetailData(tempRetail[0])
      }

      let tempBooking = [];
      tempBooking = selector.self_target_parameters_data.filter((item) => {
        return item.paramName.toLowerCase() === 'booking'
      })
      console.log("%%%TEMP BOOK", tempBooking);
      if (tempBooking.length > 0) {
        setBookingData(tempBooking[0])
      }

      let tempEnq = [];
      tempEnq = selector.self_target_parameters_data.filter((item) => {
        return item.paramName.toLowerCase() === 'enquiry'
      })
      if (tempEnq.length > 0) {
        setEnqData(tempEnq[0])
      }

      let tempVisit = [];
      tempVisit = selector.self_target_parameters_data.filter((item) => {
        return item.paramName.toLowerCase() === 'home visit'
      })
      if (tempVisit.length > 0) {
        setVisitData(tempVisit[0])
      }

      let tempTD = [];
      tempTD = selector.self_target_parameters_data.filter((item) => {
        return item.paramName.toLowerCase() === 'test drive'
      })
      if (tempTD.length > 0) {
        setTDData(tempTD[0])
      }
    } else {
    }

    const unsubscribe = navigation.addListener('focus', () => {
      const dateFormat = "YYYY-MM-DD";
      const currentDate = moment().format(dateFormat)
      const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
      setDateDiff((new Date(monthLastDate).getTime() - new Date(currentDate).getTime()) / (1000 * 60 * 60 * 24));
    });

    return unsubscribe;

  }, [selector.self_target_parameters_data])

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (selector.login_employee_details?.roles.length > 0) {
        let rolesArr = [];
        rolesArr = selector.login_employee_details?.roles.filter((item) => {
          return item === "Admin Prod" || item === "App Admin" || item === "Manager" || item === "TL" || item === "General Manager" || item === "branch manager" || item === "Testdrive_Manager"
        })
        if (rolesArr.length > 0) {
          // console.log("%%%%% TEAM:", rolesArr);
          setIsTeamPresent(true)
        }
      }
    }

  }, [selector.login_employee_details])

  useEffect(() => {
    setIsTeam(selector.isTeam)
  }, [selector.isTeam])

  const getTotalAchivent = (params) => {
    console.log("USER DATA: ", JSON.stringify(params));
    let total = 0;
    for (let i = 0; i < params.length; i++) {
      total += Number(params[i].achievment);
    }
    return total;
  }

  const getTotalTarget = (params) => {
    let total = 0;
    for (let i = 0; i < params.length; i++) {
      total += Number(params[i].target);
    }
    return total;
  }

  const getGrandTotalTarget = (data) => {
    let total = 0;
    total += getTotalTargetByParam(data, 'Enquiry') + getTotalTargetByParam(data, 'Test Drive') + getTotalTargetByParam(data, 'Home Visit') + getTotalTargetByParam(data, 'Booking') + getTotalTargetByParam(data, 'Finance') + getTotalTargetByParam(data, 'Insurance') + getTotalTargetByParam(data, 'Accessories') + getTotalTargetByParam(data, 'INVOICE') + getTotalTargetByParam(data, 'Exchange') + getTotalTargetByParam(data, 'EXTENDEDWARRANTY')
    return total;
  }

  const getGrandTotalAchievement = (data) => {
    let total = 0;
    total += getTotalAchiventByParam(data, 'Enquiry') + getTotalAchiventByParam(data, 'Test Drive') + getTotalAchiventByParam(data, 'Home Visit') + getTotalAchiventByParam(data, 'Booking') + getTotalAchiventByParam(data, 'Finance') + getTotalAchiventByParam(data, 'Insurance') + getTotalAchiventByParam(data, 'Accessories') + getTotalAchiventByParam(data, 'INVOICE') + getTotalAchiventByParam(data, 'Exchange') + getTotalAchiventByParam(data, 'EXTENDEDWARRANTY')
    return total;
  }

  const getTotalAchiventByParam = (allData, paramName) => {
    let total = 0;
    total += Number(allData.targetAchievements.filter((item) => item.paramName === paramName)[0].achievment);
    if (allData.employeeTargetAchievements.length > 0) {
      for (let i = 0; i < allData.employeeTargetAchievements.length; i++) {
        total += Number(allData.employeeTargetAchievements[i].targetAchievements.filter((item) => item.paramName === paramName)[0].achievment);
        if (allData.employeeTargetAchievements[i].employeeTargetAchievements.length > 0) {
          for (let j = 0; j < allData.employeeTargetAchievements[i].employeeTargetAchievements.length; j++) {
            total += Number(allData.employeeTargetAchievements[i].employeeTargetAchievements[j].targetAchievements.filter((item) => item.paramName === paramName)[0].achievment);
          }
        }
      }
    }
    return total;
  }

  const getTotalTargetByParam = (allData, paramName) => {
    let total = 0;
    total += Number(allData.targetAchievements.filter((item) => item.paramName === paramName)[0].target);
    if (allData.employeeTargetAchievements.length > 0) {
      for (let i = 0; i < allData.employeeTargetAchievements.length; i++) {
        total += Number(allData.employeeTargetAchievements[i].targetAchievements.filter((item) => item.paramName === paramName)[0].target);
        if (allData.employeeTargetAchievements[i].employeeTargetAchievements.length > 0) {
          for (let j = 0; j < allData.employeeTargetAchievements[i].employeeTargetAchievements.length; j++) {
            total += Number(allData.employeeTargetAchievements[i].employeeTargetAchievements[j].targetAchievements.filter((item) => item.paramName === paramName)[0].target);
          }
        }
      }
    }
    return total;
  }

  const handleModalDropdownDataForShuffle = (user) => {
    console.log("USER: ", user);
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
          console.log("%%%%^^^:", tempParams[i]);
          if (i === tempParams.length - 1) {
            console.log("MODIFIED DATA: ", JSON.stringify(tempParams));
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

  const renderData = (item, color) => {
    return (
      <View style={{ width: '92%', minHeight: 40, flexDirection: 'row' }}>
        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].achievment) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].achievment) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].achievment) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].achievment) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Enquiry')[0].target)}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].achievment) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].achievment) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].achievment) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].achievment) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Test Drive')[0].target)}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].achievment) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].achievment) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].achievment) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].achievment) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Home Visit')[0].target)}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].achievment) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].achievment) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].achievment) > 999 ? (Math.round) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Booking')[0].target)}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].achievment) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].achievment) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].achievment) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].achievment) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Finance')[0].target)}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].achievment) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].achievment) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].achievment) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].achievment) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Insurance')[0].target)}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].achievment) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].achievment) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].achievment) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].achievment) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Accessories')[0].target)}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].achievment) > 99999 ? Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].achievment) / 100000 + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].achievment) > 999 ? Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].achievment) / 1000 + 'K' : item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'INVOICE')[0].target)}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].achievment) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].achievment) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].achievment) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].achievment) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'Exchange')[0].target)}</Text>
        </View>

        <View style={styles.itemBox}>
          <Text style={{ color: getColor(Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].achievment), Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].target)) }}>{Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].achievment) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].achievment) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].achievment) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].achievment) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].achievment)}/{Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].target) > 99999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].target) / 100000) + 'L' : (Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].target) > 999 ? Math.round(Number(item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].target) / 1000) + 'K' : item.targetAchievements.filter((param) => param.paramName === 'EXTENDEDWARRANTY')[0].target)}</Text>
        </View>
        <View style={styles.itemBox}>
          <Text style={{ color: getColor(getTotalAchivent(item.targetAchievements), getTotalTarget(item.targetAchievements)) }}>{getTotalAchivent(item.targetAchievements) > 99999 ? Math.round(getTotalAchivent(item.targetAchievements) / 100000) + 'L' : (getTotalAchivent(item.targetAchievements) > 999 ? Math.round(getTotalAchivent(item.targetAchievements) / 1000) + 'K' : getTotalAchivent(item.targetAchievements))}/{getTotalTarget(item.targetAchievements) > 99999 ? Math.round(getTotalTarget(item.targetAchievements) / 100000) + 'L' : (getTotalTarget(item.targetAchievements) > 999 ? Math.round(getTotalTarget(item.targetAchievements) / 1000) + 'K' : getTotalTarget(item.targetAchievements))}</Text>
        </View>

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
                console.log("£££", item.value);
                if (delegateButtonClick) {
                  setReoprtingManagerListDropdownItem(item.value);
                  console.log(reoprtingManagerListDropdownItem);
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
                      console.log("TDTDTDTDTDTD: ", employeeListDropdownItem);
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

          // <View>
          //   <View style={{ flexDirection: "row", marginLeft: 8 }}>
          //     <View
          //       style={{ width: "10%", justifyContent: "center", marginTop: 5 }}
          //     ></View>
          //     {/* <View style={{ width: '2%', borderRightWidth: 2, borderRightColor: '#d1d1d1', height: 53 }}>
          //                 </View> */}
          //     <View
          //       style={{
          //         width: "40%",
          //         justifyContent: "center",
          //         marginTop: 5,
          //         alignItems: "center",
          //       }}
          //     >
          //       <View
          //         style={{
          //           width: "100%",
          //           justifyContent: "center",
          //           alignItems: "center",
          //           height: 40,
          //           borderWidth: 1,
          //           borderColor: "#d1d1d1",
          //         }}
          //       >
          //         <Text
          //           style={{
          //             fontSize: 14,
          //             color: "#0600FF",
          //             fontWeight: "600",
          //           }}
          //         >
          //           Team Total
          //           </Text>
          //       </View>
          //       <View style={{ flexDirection: "row", height: 30 }}>
          //         <View
          //           style={{
          //             width: "33%",
          //             justifyContent: "center",
          //             alignItems: "center",
          //             borderWidth: 1,
          //             borderColor: "#d1d1d1",
          //             backgroundColor: "#d1d1d1",
          //           }}
          //         >
          //           <Text style={{ fontSize: 14, fontWeight: "600" }}>Ach</Text>
          //         </View>
          //         <View
          //           style={{
          //             width: "33%",
          //             justifyContent: "center",
          //             alignItems: "center",
          //             borderWidth: 1,
          //             borderColor: "#d1d1d1",
          //             backgroundColor: "#d1d1d1",
          //           }}
          //         >
          //           <Text style={{ fontSize: 14, fontWeight: "600" }}>Bal</Text>
          //         </View>
          //         <View
          //           style={{
          //             width: "33%",
          //             justifyContent: "center",
          //             alignItems: "center",
          //             borderWidth: 1,
          //             borderColor: "#d1d1d1",
          //             backgroundColor: "#d1d1d1",
          //           }}
          //         >
          //           <Text style={{ fontSize: 14, fontWeight: "600" }}>
          //             AR/D
          //             </Text>
          //         </View>
          //       </View>
          //     </View>
          //     {/* <View style={{ width: '2%', borderRightWidth: 2, borderRightColor: '#d1d1d1', height: 53 }}>
          //                 </View> */}
          //   </View>
          //   {selector.all_target_parameters_data.length > 0 && (
          //     <View style={{ flexDirection: "row", marginLeft: 8 }}>
          //       <View style={{ width: "10%", marginTop: 5 }}>
          //         {selector.all_target_parameters_data.map((item, index) => {
          //           return (
          //             <View style={{ height: 30 }} key={index}>
          //               <Text
          //                 style={{
          //                   color: color[index % color.length],
          //                   fontSize: 14,
          //                   fontWeight: "600",
          //                 }}
          //               >
          //                 {item.paramShortName}
          //               </Text>
          //             </View>
          //           );
          //         })}

          //         {/* <View style={{ marginBottom: 5 }}>
          //                         <Text>Eng</Text>
          //                     </View>
          //                     <View>
          //                         <Text>TD</Text>
          //                     </View> */}
          //       </View>
          //       {/* <View style={{ width: '2%', borderRightWidth: 2, borderRightColor: '#d1d1d1', minHeight: 300 }}></View> */}

          //       <View style={{ width: "40%" }}>
          //         {selector.all_target_parameters_data.map((item, index) => {
          //           return (
          //             <View
          //               style={{ flexDirection: "row", height: 30 }}
          //               key={index}
          //             >
          //               <View
          //                 style={{
          //                   width: "33%",
          //                   justifyContent: "center",
          //                   alignItems: "center",
          //                   borderWidth: 1,
          //                   borderColor: "#d1d1d1",
          //                 }}
          //               >
          //                 <Text style={{ fontSize: 12, fontWeight: "600" }}>
          //                   {Number(item.achievment) >= 100000
          //                     ? Math.round(Number(item.achievment) / 100000) +
          //                     "L"
          //                     : Number(item.achievment) >= 1000
          //                       ? Math.round(Number(item.achievment) / 1000) + "K"
          //                       : item.achievment}
          //                     /
          //                     {Number(item.target) >= 100000
          //                     ? Math.round(Number(item.target) / 100000) + "L"
          //                     : Number(item.target) >= 1000
          //                       ? Math.round(Number(item.target) / 1000) + "K"
          //                       : item.target}
          //                 </Text>
          //               </View>
          //               <View
          //                 style={{
          //                   width: "33%",
          //                   justifyContent: "center",
          //                   alignItems: "center",
          //                   borderWidth: 1,
          //                   borderColor: "#d1d1d1",
          //                 }}
          //               >
          //                 <Text style={{ fontSize: 12, fontWeight: "600" }}>
          //                   {Number(item.achievment) > Number(item.target)
          //                     ? 0
          //                     : Math.abs(Number(item.shortfall)) >= 100000
          //                       ? Math.round(
          //                         Math.abs(Number(item.shortfall)) / 100000
          //                       ) + "L"
          //                       : Math.round(Math.abs(Number(item.shortfall)))}
          //                 </Text>
          //               </View>
          //               <View
          //                 style={{
          //                   width: "33%",
          //                   justifyContent: "center",
          //                   alignItems: "center",
          //                   borderWidth: 1,
          //                   borderColor: "#d1d1d1",
          //                 }}
          //               >
          //                 <Text style={{ fontSize: 12, fontWeight: "600" }}>
          //                   {Number(item.achievment) > Number(item.target)
          //                     ? 0
          //                     : dateDiff > 0 && parseInt(item.shortfall) !== 0
          //                       ? Math.round(
          //                         parseInt(item.shortfall) / dateDiff
          //                       ) >= 100000
          //                         ? Math.round(
          //                           parseInt(item.shortfall) / dateDiff / 100000
          //                         ) + "L"
          //                         : Math.round(
          //                           parseInt(item.shortfall) / dateDiff
          //                         )
          //                       : 0}
          //                 </Text>
          //               </View>
          //             </View>
          //           );
          //         })}
          //       </View>

          //       {/* <View style={{ width: '2%', borderRightWidth: 2, borderRightColor: '#d1d1d1', minHeight: 300 }}></View> */}
          //       <ScrollView
          //         style={{ marginBottom: 0, marginTop: -80 }}
          //         contentContainerStyle={{ alignItems: "center" }}
          //         horizontal={true}
          //       >
          //         {selector.all_emp_parameters_data.map((item, index) => {
          //           return (
          //             <View
          //               style={{ flexDirection: "column", marginTop: 5 }}
          //               key={index}
          //             >
          //               <View
          //                 style={{
          //                   flexDirection: "row",
          //                   height: 40,
          //                   borderWidth: 1,
          //                   borderColor: "#d1d1d1",
          //                   width: 155,
          //                   justifyContent: "center",
          //                   alignItems: "center",
          //                 }}
          //               >
          //                 <View
          //                   style={{
          //                     width: 30,
          //                     height: 30,
          //                     borderRadius: 50,
          //                     justifyContent: "center",
          //                     alignItems: "center",
          //                     backgroundColor: color[index % color.length],
          //                   }}
          //                 >
          //                   <Text style={{ color: "#fff" }}>
          //                     {item.empName.charAt(0)}
          //                   </Text>
          //                 </View>
          //                 <View
          //                   style={{
          //                     height: "100%",
          //                     justifyContent: "center",
          //                     marginLeft: 10,
          //                     width: 80,
          //                   }}
          //                 >
          //                   <Text
          //                     style={{
          //                       fontSize: 12,
          //                       color: color[index % color.length],
          //                       fontWeight: "600",
          //                     }}
          //                     numberOfLines={2}
          //                   >
          //                     {item.empName}
          //                   </Text>
          //                 </View>

          //                 <View
          //                   style={{
          //                     width: 30,
          //                     height: 30,
          //                     borderRadius: 50,
          //                     justifyContent: "center",
          //                     alignItems: "center",
          //                     backgroundColor: color[index % color.length],
          //                   }}
          //                 >
          //                   <TouchableOpacity activeOpacity={0.6} onPress={() => {
          //                     setSelectedUser(item)
          //                     handleModalDropdownDataForShuffle(item);
          //                   }} style={{ ...styles.shuffleBGView, backgroundColor: color[index % color.length] }}>
          //                     <ShuffleIcon name="shuffle" color={Colors.WHITE} size={18} />
          //                   </TouchableOpacity>
          //                 </View>
          //               </View>
          //               <View style={{ flexDirection: "row", height: 30 }}>
          //                 <View
          //                   style={{
          //                     width: 51.6,
          //                     justifyContent: "center",
          //                     alignItems: "center",
          //                     borderWidth: 1,
          //                     borderColor: "#d1d1d1",
          //                     backgroundColor: "#d1d1d1",
          //                   }}
          //                 >
          //                   <Text style={{ fontSize: 14, fontWeight: "600" }}>
          //                     Ach
          //                     </Text>
          //                 </View>
          //                 <View
          //                   style={{
          //                     width: 51.6,
          //                     justifyContent: "center",
          //                     alignItems: "center",
          //                     borderWidth: 1,
          //                     borderColor: "#d1d1d1",
          //                     backgroundColor: "#d1d1d1",
          //                   }}
          //                 >
          //                   <Text style={{ fontSize: 14, fontWeight: "600" }}>
          //                     Bal
          //                     </Text>
          //                 </View>
          //                 <View
          //                   style={{
          //                     width: 51.6,
          //                     justifyContent: "center",
          //                     alignItems: "center",
          //                     borderWidth: 1,
          //                     borderColor: "#d1d1d1",
          //                     backgroundColor: "#d1d1d1",
          //                   }}
          //                 >
          //                   <Text style={{ fontSize: 14, fontWeight: "600" }}>
          //                     AR/D
          //                     </Text>
          //                 </View>
          //               </View>
          //               {item.targetAchievements.map(
          //                 (innerItem, innerIndex) => {
          //                   return (
          //                     <>
          //                       <View
          //                         style={{ flexDirection: "row", height: 30 }}
          //                         key={innerIndex}
          //                       >
          //                         <View
          //                           style={{
          //                             width: 51.6,
          //                             justifyContent: "center",
          //                             alignItems: "center",
          //                             borderWidth: 1,
          //                             borderColor: "#d1d1d1",
          //                           }}
          //                         >
          //                           <Text
          //                             style={{
          //                               fontSize: 12,
          //                               fontWeight: "600",
          //                             }}
          //                           >
          //                             {/* {innerItem.achievment}/{innerItem.target} */}
          //                             {Number(innerItem.achievment) >= 100000
          //                               ? Math.round(
          //                                 Number(innerItem.achievment) /
          //                                 100000
          //                               ) + "L"
          //                               : Number(innerItem.achievment) >= 1000
          //                                 ? Math.round(
          //                                   Number(innerItem.achievment) / 1000
          //                                 ) + "K"
          //                                 : innerItem.achievment}
          //                               /
          //                               {Number(innerItem.target) >= 100000
          //                               ? Math.round(
          //                                 Number(innerItem.target) / 100000
          //                               ) + "L"
          //                               : Number(innerItem.target) >= 1000
          //                                 ? Math.round(
          //                                   Number(innerItem.target) / 1000
          //                                 ) + "K"
          //                                 : innerItem.target}
          //                           </Text>
          //                         </View>
          //                         <View
          //                           style={{
          //                             width: 51.6,
          //                             justifyContent: "center",
          //                             alignItems: "center",
          //                             borderWidth: 1,
          //                             borderColor: "#d1d1d1",
          //                           }}
          //                         >
          //                           <Text
          //                             style={{
          //                               fontSize: 12,
          //                               fontWeight: "600",
          //                             }}
          //                           >
          //                             {Number(innerItem.achievment) >
          //                               Number(innerItem.target)
          //                               ? 0
          //                               : Math.abs(
          //                                 Number(innerItem.shortfall)
          //                               ) >= 100000
          //                                 ? Math.round(
          //                                   Math.abs(
          //                                     Number(innerItem.shortfall)
          //                                   ) / 100000
          //                                 ) + "L"
          //                                 : Math.round(
          //                                   Math.abs(
          //                                     Number(innerItem.shortfall)
          //                                   )
          //                                 )}
          //                           </Text>
          //                         </View>
          //                         <View
          //                           style={{
          //                             width: 51.6,
          //                             justifyContent: "center",
          //                             alignItems: "center",
          //                             borderWidth: 1,
          //                             borderColor: "#d1d1d1",
          //                           }}
          //                         >
          //                           <Text
          //                             style={{
          //                               fontSize: 12,
          //                               fontWeight: "600",
          //                             }}
          //                           >
          //                             {Number(innerItem.achievment) >
          //                               Number(innerItem.target)
          //                               ? 0
          //                               : dateDiff > 0 &&
          //                                 parseInt(innerItem.shortfall) !== 0
          //                                 ? // ? (
          //                                 //     parseInt(innerItem.shortfall) /
          //                                 //     dateDiff
          //                                 //   ).toFixed(1)
          //                                 Math.abs(
          //                                   Math.round(
          //                                     parseInt(innerItem.shortfall) /
          //                                     dateDiff
          //                                   )
          //                                 )
          //                                 : 0}
          //                           </Text>
          //                         </View>
          //                       </View>
          //                       {}
          //                     </>
          //                   );
          //                 }
          //               )}
          //             </View>
          //           );
          //         })}
          //       </ScrollView>
          //     </View>
          //   )}

          //   <Modal isVisible={showShuffleModal}>
          //     <View
          //       style={{
          //         width: "95%",
          //         height: "30%",
          //         alignSelf: "center",
          //         backgroundColor: "white",
          //         borderRadius: 8,
          //       }}
          //     >
          //       <View
          //         style={{
          //           flexDirection: "row",
          //           justifyContent: "space-between",
          //           borderWidth: 1,
          //           borderColor: "#d1d1d1",
          //           backgroundColor: "#d1d1d1",
          //           borderTopEndRadius: 8,
          //           borderTopStartRadius: 8,
          //         }}
          //       >
          //         <Text style={{ fontSize: 17, fontWeight: "500", margin: 10 }}>
          //           Team Shuffle
          //           </Text>

          //         <TouchableOpacity
          //           activeOpacity={0.6}
          //           onPress={() => {
          //             setShowShuffleModal(false);
          //             setHeaderTitle(
          //               "Selected employees has Active tasks. Please delegate to another employee"
          //             );
          //             setDropDownPlaceHolder("Employees");
          //             setDelegateButtonClick(false);
          //             setEmployeeDropdownList([]);
          //             setReoprtingManagerDropdownList([]);
          //           }}
          //         >
          //           <CloseIcon
          //             style={{ margin: 10 }}
          //             name="close"
          //             color={Colors.BLACK}
          //             size={20}
          //           />
          //         </TouchableOpacity>
          //       </View>

          //       <Text
          //         style={{ color: Colors.GRAY, marginLeft: 12, marginTop: 5 }}
          //       >
          //         {headerTitle}
          //       </Text>
          //       <Dropdown
          //         style={styles.dropdownContainer}
          //         placeholderStyle={styles.placeholderStyle}
          //         selectedTextStyle={styles.selectedTextStyle}
          //         inputSearchStyle={styles.inputSearchStyle}
          //         iconStyle={styles.iconStyle}
          //         data={
          //           delegateButtonClick
          //             ? reoprtingManagerDropdownList
          //             : employeeDropdownList
          //         }
          //         search
          //         maxHeight={300}
          //         labelField="label"
          //         valueField="value"
          //         placeholder={dropDownPlaceHolder}
          //         searchPlaceholder="Search..."
          //         renderRightIcon={() => (
          //           <Image
          //             style={{ height: 5, width: 10 }}
          //             source={require("../../../../assets/images/Polygon.png")}
          //           />
          //         )}
          //         onChange={async (item) => {
          //           console.log("£££", item.value);
          //           if (delegateButtonClick) {
          //             setReoprtingManagerListDropdownItem(item.value);
          //             console.log(reoprtingManagerListDropdownItem);
          //           } else {
          //             setEmployeeListDropdownItem(item.value);
          //           }
          //         }}
          //       />

          //       <LoaderComponent
          //         visible={selector.isLoading}
          //         onRequestClose={() => { }}
          //       />

          //       <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, marginBottom: 10, flexDirection: 'row', width: '95%', justifyContent: 'space-around' }}>
          //         {dropDownPlaceHolder === 'Employees' ?
          //           <View style={{ flexDirection: 'row', width: '95%', justifyContent: 'space-around' }}>
          //             <TouchableOpacity activeOpacity={0.6} style={{ padding: 5, borderRadius: 6, borderColor: Colors.RED, borderWidth: 0.8, width: 70, alignItems: 'center', justifyContent: 'center', marginLeft: 18, marginRight: 12, backgroundColor: Colors.RED }} onPress={() => {
          //               // updateEmployeeData();
          //               if (employeeListDropdownItem !== 0) {
          //                 setDelegateButtonClick(true);
          //                 setHeaderTitle('Reporting Managers');
          //                 setDropDownPlaceHolder(state => state = 'Reporting Manager');
          //                 console.log("TDTDTDTDTDTD: ", employeeListDropdownItem);
          //                 getReportingManagerListFromServer(selectedUser);
          //               }
          //             }}>
          //               <Text style={{ fontSize: 13, fontWeight: '300', color: Colors.WHITE }}>NEXT</Text>
          //             </TouchableOpacity>

          //             <TouchableOpacity activeOpacity={0.6} style={{ padding: 5, borderRadius: 6, borderColor: Colors.RED, borderWidth: 0.8, width: 220, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.RED }} onPress={() => {
          //               if (employeeListDropdownItem !== 0) {
          //                 setHeaderTitle('Reporting Managers');
          //                 setDropDownPlaceHolder('Reporting Manager');
          //                 setDelegateButtonClick(true);
          //                 getReportingManagerListFromServer(selectedUser);
          //               }
          //             }}>
          //               <Text style={{ fontSize: 13, fontWeight: '300', color: Colors.WHITE }}>CONTINUE WITHOUT DELEGATING</Text>
          //             </TouchableOpacity>
          //           </View> :
          //           <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
          //             <TouchableOpacity activeOpacity={0.6} style={{ padding: 5, borderRadius: 6, borderColor: Colors.RED, borderWidth: 0.8, width: 70, alignItems: 'center', justifyContent: 'center', marginLeft: 18, marginRight: 12, backgroundColor: Colors.RED }} onPress={() => {
          //               if (reoprtingManagerListDropdownItem !== 0) {
          //                 updateEmployeeData();
          //                 setShowShuffleModal(false);
          //                 setHeaderTitle('Selected employees has Active tasks. Please delegate to another employee');
          //                 setDropDownPlaceHolder('Employees');
          //                 setDelegateButtonClick(false);
          //                 setEmployeeDropdownList([]);
          //                 setReoprtingManagerDropdownList([]);
          //               }
          //             }}>
          //               <Text style={{ fontSize: 13, fontWeight: '300', color: Colors.WHITE }}>SUBMIT</Text>
          //             </TouchableOpacity>
          //           </View>}
          //       </View>
          //     </View>
          //   </Modal>
          // </View>
          <View >
            <ScrollView contentContainerStyle={{ paddingRight: 20, flexDirection: 'column' }} horizontal={true} directionalLockEnabled={true}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '8%', height: 40, marginRight: 5 }}>

                </View>
                <View style={{ width: '92%', height: 40, flexDirection: 'row' }}>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#C62159' }}>Enq</Text>
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
                    <Text style={{ color: '#EC3466' }}>Fin</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#1C95A6' }}>Ins</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#C62159' }}>Acc</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#FA03B9' }}>Retail</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#9E31BE' }}>Exg</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#1C95A6' }}>ExW</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#EC3466' }}>Total</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#0c0c0c' }}>Action</Text>
                  </View>
                </View>
              </View>

              {allParameters.length > 0 && allParameters.map((item, index) => {
                return (
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '8%', minHeight: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                      <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C62159', borderRadius: 20, marginTop: item.isOpenInner ? 5 : 5, marginBottom: item.isOpenInner ? 5 : 5 }} onPress={async () => {
                        setSelectedName(item.empName);
                        setTimeout(() => {
                          setSelectedName('')
                        }, 5000);
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
                          // console.log("$$$$$ LOGIN EMP:", employeeData);
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
                            console.log("PPPLLL", payload);
                            Promise.all([
                              dispatch(getUserWiseTargetParameters(payload))
                            ]).then((res) => {
                              console.log("DATA:", JSON.stringify(res));
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
                              }, 5000);
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
                                // console.log("$$$$$ LOGIN EMP:", employeeData);
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
                                  console.log("PPPLLL", payload);
                                  Promise.all([
                                    dispatch(getUserWiseTargetParameters(payload))
                                  ]).then((res) => {
                                    console.log("DATA:", JSON.stringify(res));
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
                                      }, 5000);
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
                                        // console.log("$$$$$ LOGIN EMP:", employeeData);
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
                                          console.log("PPPLLL", payload);
                                          Promise.all([
                                            dispatch(getUserWiseTargetParameters(payload))
                                          ]).then((res) => {
                                            console.log("DATA:", JSON.stringify(res));
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
                                              }, 5000);
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
                                                // console.log("$$$$$ LOGIN EMP:", employeeData);
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
                                                  console.log("PPPLLL", payload);
                                                  Promise.all([
                                                    dispatch(getUserWiseTargetParameters(payload))
                                                  ]).then((res) => {
                                                    console.log("DATA:", JSON.stringify(res));
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
                                                      }, 5000);
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
                                                        // console.log("$$$$$ LOGIN EMP:", employeeData);
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
                                                          console.log("PPPLLL", payload);
                                                          Promise.all([
                                                            dispatch(getUserWiseTargetParameters(payload))
                                                          ]).then((res) => {
                                                            console.log("DATA:", JSON.stringify(res));
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
                                                              }, 5000);
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
                                                                // console.log("$$$$$ LOGIN EMP:", employeeData);
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
                                                                  console.log("PPPLLL", payload);
                                                                  Promise.all([
                                                                    dispatch(getUserWiseTargetParameters(payload))
                                                                  ]).then((res) => {
                                                                    console.log("DATA:", JSON.stringify(res));
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
                                                                      }, 5000);
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
                                                                        // console.log("$$$$$ LOGIN EMP:", employeeData);
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
                                                                          console.log("PPPLLL", payload);
                                                                          Promise.all([
                                                                            dispatch(getUserWiseTargetParameters(payload))
                                                                          ]).then((res) => {
                                                                            console.log("DATA:", JSON.stringify(res));
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
                                                          </>
                                                        )
                                                      })
                                                    }
                                                  </>
                                                )
                                              })
                                            }
                                          </>
                                        )
                                      })
                                    }
                                  </>
                                )
                              })
                            }
                          </>
                        )
                      })
                      }
                      {item.employeeTargetAchievements.length > 0 &&
                        <View style={{ marginTop: 7, marginBottom: 7, }}>
                          <Text style={{ fontSize: 14, color: '#000', fontWeight: '600' }}>Total</Text>
                        </View>
                      }
                    </View>
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
                                                              </View>
                                                            )
                                                          })
                                                        }
                                                      </View>
                                                    )
                                                  })
                                                }
                                              </View>
                                            )
                                          })
                                        }
                                      </View>
                                    )
                                  })
                                  //   }
                                  // </View>
                                }
                              </View>
                            </View>
                          )
                        })
                        //   }
                        // </View>
                      }
                      {item.employeeTargetAchievements.length > 0 &&
                        <View style={{ width: '92%', minHeight: 40, flexDirection: 'row', backgroundColor: '#ECF0F1' }}>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'Enquiry') > 99999 ? Math.round(getTotalAchiventByParam(item, 'Enquiry') / 100000) + 'L' : (getTotalAchiventByParam(item, 'Enquiry') > 999 ? Math.round(getTotalAchiventByParam(item, 'Enquiry') / 1000) + 'K' : getTotalAchiventByParam(item, 'Enquiry'))}/{getTotalTargetByParam(item, 'Enquiry') > 99999 ? Math.round(getTotalTargetByParam(item, 'Enquiry') / 100000) + 'L' : (getTotalTargetByParam(item, 'Enquiry') > 999 ? Math.round(getTotalTargetByParam(item, 'Enquiry') / 1000) + 'K' : getTotalTargetByParam(item, 'Enquiry'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'Test Drive') > 99999 ? Math.round(getTotalAchiventByParam(item, 'Test Drive') / 100000) + 'L' : (getTotalAchiventByParam(item, 'Test Drive') > 999 ? Math.round(getTotalAchiventByParam(item, 'Test Drive') / 1000) + 'K' : getTotalAchiventByParam(item, 'Test Drive'))}/{getTotalTargetByParam(item, 'Test Drive') > 99999 ? Math.round(getTotalTargetByParam(item, 'Test Drive') / 100000) + 'L' : (getTotalTargetByParam(item, 'Test Drive') > 999 ? Math.round(getTotalTargetByParam(item, 'Test Drive') / 1000) + 'K' : getTotalTargetByParam(item, 'Test Drive'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'Home Visit') > 99999 ? Math.round(getTotalAchiventByParam(item, 'Home Visit') / 100000) + 'L' : (getTotalAchiventByParam(item, 'Home Visit') > 999 ? Math.round(getTotalAchiventByParam(item, 'Home Visit') / 1000) + 'K' : getTotalAchiventByParam(item, 'Home Visit'))}/{getTotalTargetByParam(item, 'Home Visit') > 99999 ? Math.round(getTotalTargetByParam(item, 'Home Visit') / 100000) + 'L' : (getTotalTargetByParam(item, 'Home Visit') > 999 ? Math.round(getTotalTargetByParam(item, 'Home Visit') / 1000) + 'K' : getTotalTargetByParam(item, 'Home Visit'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'Booking') > 99999 ? Math.round(getTotalAchiventByParam(item, 'Booking') / 100000) + 'L' : (getTotalAchiventByParam(item, 'Booking') > 999 ? Math.round(getTotalAchiventByParam(item, 'Booking') / 1000) + 'K' : getTotalAchiventByParam(item, 'Booking'))}/{getTotalTargetByParam(item, 'Booking') > 99999 ? Math.round(getTotalTargetByParam(item, 'Booking') / 100000) + 'L' : (getTotalTargetByParam(item, 'Booking') > 999 ? Math.round(getTotalTargetByParam(item, 'Booking') / 1000) + 'K' : getTotalTargetByParam(item, 'Booking'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'Finance') > 99999 ? Math.round(getTotalAchiventByParam(item, 'Finance') / 100000) + 'L' : (getTotalAchiventByParam(item, 'Finance') > 999 ? Math.round(getTotalAchiventByParam(item, 'Finance') / 1000) + 'K' : getTotalAchiventByParam(item, 'Finance'))}/{getTotalTargetByParam(item, 'Finance') > 99999 ? Math.round(getTotalTargetByParam(item, 'Finance') / 100000) + 'L' : (getTotalTargetByParam(item, 'Finance') > 999 ? Math.round(getTotalTargetByParam(item, 'Finance') / 1000) + 'K' : getTotalTargetByParam(item, 'Finance'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'Insurance') > 99999 ? Math.round(getTotalAchiventByParam(item, 'Insurance') / 100000) + 'L' : (getTotalAchiventByParam(item, 'Insurance') > 999 ? Math.round(getTotalAchiventByParam(item, 'Insurance') / 1000) + 'K' : getTotalAchiventByParam(item, 'Insurance'))}/{getTotalTargetByParam(item, 'Insurance') > 99999 ? Math.round(getTotalTargetByParam(item, 'Insurance') / 100000) + 'L' : (getTotalTargetByParam(item, 'Insurance') > 999 ? Math.round(getTotalTargetByParam(item, 'Insurance') / 1000) + 'K' : getTotalTargetByParam(item, 'Insurance'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'Accessories') > 99999 ? Math.round(getTotalAchiventByParam(item, 'Accessories') / 100000) + 'L' : (getTotalAchiventByParam(item, 'Accessories') > 999 ? Math.round(getTotalAchiventByParam(item, 'Accessories') / 1000) + 'K' : getTotalAchiventByParam(item, 'Accessories'))}/{getTotalTargetByParam(item, 'Accessories') > 99999 ? Math.round(getTotalTargetByParam(item, 'Accessories') / 100000) + 'L' : (getTotalTargetByParam(item, 'Accessories') > 999 ? Math.round(getTotalTargetByParam(item, 'Accessories') / 1000) + 'K' : getTotalTargetByParam(item, 'Accessories'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'INVOICE') > 99999 ? Math.round(getTotalAchiventByParam(item, 'INVOICE') / 100000) + 'L' : (getTotalAchiventByParam(item, 'INVOICE') > 999 ? Math.round(getTotalAchiventByParam(item, 'INVOICE') / 1000) + 'K' : getTotalAchiventByParam(item, 'INVOICE'))}/{getTotalTargetByParam(item, 'INVOICE') > 99999 ? Math.round(getTotalTargetByParam(item, 'INVOICE') / 100000) + 'L' : (getTotalTargetByParam(item, 'INVOICE') > 999 ? Math.round(getTotalTargetByParam(item, 'INVOICE') / 1000) + 'K' : getTotalTargetByParam(item, 'INVOICE'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'Exchange') > 99999 ? Math.round(getTotalAchiventByParam(item, 'Exchange') / 100000) + 'L' : (getTotalAchiventByParam(item, 'Exchange') > 999 ? Math.round(getTotalAchiventByParam(item, 'Exchange') / 1000) + 'K' : getTotalAchiventByParam(item, 'Exchange'))}/{getTotalTargetByParam(item, 'Exchange') > 99999 ? Math.round(getTotalTargetByParam(item, 'Exchange') / 100000) + 'L' : (getTotalTargetByParam(item, 'Exchange') > 999 ? Math.round(getTotalTargetByParam(item, 'Exchange') / 1000) + 'K' : getTotalTargetByParam(item, 'Exchange'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getTotalAchiventByParam(item, 'EXTENDEDWARRANTY') > 99999 ? Math.round(getTotalAchiventByParam(item, 'EXTENDEDWARRANTY') / 100000) + 'L' : (getTotalAchiventByParam(item, 'EXTENDEDWARRANTY') > 999 ? Math.round(getTotalAchiventByParam(item, 'EXTENDEDWARRANTY') / 1000) + 'K' : getTotalAchiventByParam(item, 'EXTENDEDWARRANTY'))}/{getTotalTargetByParam(item, 'EXTENDEDWARRANTY') > 99999 ? Math.round(getTotalTargetByParam(item, 'EXTENDEDWARRANTY') / 100000) + 'L' : (getTotalTargetByParam(item, 'EXTENDEDWARRANTY') > 999 ? Math.round(getTotalTargetByParam(item, 'EXTENDEDWARRANTY') / 1000) + 'K' : getTotalTargetByParam(item, 'EXTENDEDWARRANTY'))}</Text>
                          </View>
                          <View style={styles.itemBox}>
                            <Text style={{ color: '#000000', fontWeight: '600' }}>{getGrandTotalAchievement(item) > 99999 ? Math.round(getGrandTotalAchievement(item) / 100000) + 'L' : (getGrandTotalAchievement(item) > 999 ? Math.round(ggetGrandTotalAchievement(item) / 1000) + 'K' : getGrandTotalAchievement(item))}/{getGrandTotalTarget(item) > 99999 ? Math.round(getGrandTotalTarget(item) / 100000) + 'L' : (getGrandTotalTarget(item) > 999 ? Math.round(getGrandTotalTarget(item) / 1000) + 'K' : getGrandTotalTarget(item))}</Text>
                          </View>
                        </View>
                      }
                    </View>
                  </View>
                )
              })}
              {selector.totalParameters.length > 0 &&
                <View style={{ flexDirection: 'row', height: 40, backgroundColor: Colors.DARK_GRAY }}>
                  <View style={{ width: '8%', minHeight: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Text style={[styles.totalText, { textAlign: 'center' }]}>Grand Total</Text>
                  </View>
                  <View style={{ width: '92%', minHeight: 40, flexDirection: 'column', marginRight: 5, paddingHorizontal: 5, }}>

                    <View style={{ width: '92%', minHeight: 40, flexDirection: 'row' }}>
                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'Enquiry')[0].target)}</Text>
                      </View>

                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'Test Drive')[0].target)}</Text>
                      </View>

                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'Home Visit')[0].target)}</Text>
                      </View>

                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'Booking')[0].target)}</Text>
                      </View>

                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'Finance')[0].target)}</Text>
                      </View>

                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'Insurance')[0].target)}</Text>
                      </View>

                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'Accessories')[0].target)}</Text>
                      </View>

                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'INVOICE')[0].target)}</Text>
                      </View>

                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'Exchange')[0].target)}</Text>
                      </View>

                      <View style={styles.itemBox}>
                        <Text style={styles.totalText}>{Number(selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].achievment) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].achievment) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].achievment) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].achievment) / 1000) + 'K' : Number(selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].achievment))}/{Number(selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].target) > 99999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].target) / 100000) + 'L' : (Number(selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].target) > 999 ? Math.round(Number(selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].target) / 1000) + 'K' : selector.totalParameters.filter((item) => item.paramName === 'EXTENDEDWARRANTY')[0].target)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              }
            </ScrollView>
          </View>
        ) : (
          <>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{ width: "65%", justifyContent: "center", height: 15 }}
              ></View>
              <View style={{ width: "35%", flexDirection: "row" }}>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>Balance</Text>
                <View style={{ marginRight: 10 }}></View>
                <Text style={{ fontSize: 14, fontWeight: "600" }}>AR/Day</Text>
              </View>
            </View>
            {selector.self_target_parameters_data.map((item, index) => {
              return (
                <View
                  style={{ flexDirection: "row", marginLeft: 8 }}
                  key={index}
                >
                  <View
                    style={{
                      width: "10%",
                      justifyContent: "center",
                      marginTop: 5,
                    }}
                  >
                    <Text>{item.paramShortName}</Text>
                  </View>
                  <View
                    style={{
                      width: "10%",
                      marginTop: 10,
                      position: "relative",
                      backgroundColor: color[index % color.length],
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      borderTopLeftRadius: 3,
                      borderBottomLeftRadius: 3,
                    }}
                  >
                    <Text style={{ color: "#fff" }}>{item.achievment}</Text>
                  </View>
                  <View
                    style={{
                      width: "25%",
                      marginTop: 10,
                      position: "relative",
                    }}
                  >
                    <ProgressBar
                      progress={
                        item.achivementPerc.includes("%")
                          ? parseInt(
                            item.achivementPerc.substring(
                              0,
                              item.achivementPerc.indexOf("%")
                            )
                          ) === 0
                            ? 0
                            : parseInt(
                              item.achivementPerc.substring(
                                0,
                                item.achivementPerc.indexOf("%")
                              )
                            ) / 100
                          : parseFloat(item.achivementPerc) / 100
                      }
                      color={color[index % color.length]}
                      style={{
                        height: 20,
                        borderTopRightRadius: 3,
                        borderBottomRightRadius: 3,
                        backgroundColor: "#eeeeee",
                      }}
                    />
                    {/* <View style={{ position: 'absolute', top: 1, left: 2 }}>
                                            <Text style={{ color: Colors.WHITE }}>{item.achievment}</Text>
                                        </View> */}
                    <View style={{ position: "absolute", top: 1, right: 5 }}>
                      <Text
                        style={{
                          color:
                            parseInt(
                              item.achivementPerc.substring(
                                0,
                                item.achivementPerc.indexOf("%")
                              )
                            ) >= 90
                              ? Colors.WHITE
                              : Colors.BLACK,
                        }}
                      >
                        {item.target}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "10%",
                      justifyContent: "center",
                      flexDirection: "row",
                      height: 25,
                      marginTop: 8,
                      alignItems: "center",
                      marginLeft: 8,
                    }}
                  >
                    <IconButton
                      icon={
                        parseInt(
                          item.achivementPerc.substring(
                            0,
                            item.achivementPerc.indexOf("%")
                          )
                        ) > 40
                          ? "menu-up"
                          : "menu-down"
                      }
                      color={
                        parseInt(
                          item.achivementPerc.substring(
                            0,
                            item.achivementPerc.indexOf("%")
                          )
                        ) > 40
                          ? Colors.DARK_GREEN
                          : Colors.RED
                      }
                      // icon={"menu-up"}
                      // color={Colors.DARK_GREEN}
                      size={30}
                    />
                    <View
                      style={{
                        justifyContent: "center",
                        flexDirection: "row",
                        height: 25,
                        marginTop: 0,
                        alignItems: "center",
                        marginLeft: -20,
                      }}
                    >
                      <Text>{item.achivementPerc}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "35%",
                      justifyContent: "center",
                      flexDirection: "row",
                      height: 25,
                      alignItems: "center",
                      marginTop: 8,
                      marginLeft: 23,
                    }}
                  >
                    <View
                      style={{
                        width: 45,
                        height: 25,
                        borderColor: color[index % color.length],
                        borderWidth: 1,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>
                        {Number(item.achievment) > Number(item.target)
                          ? 0
                          : Math.abs(Number(item.shortfall)) >= 100000
                            ? Math.abs(Number(item.shortfall)) / 100000 + "L"
                            : Math.abs(item.shortfall)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 45,
                        height: 25,
                        borderColor: color[index % color.length],
                        borderWidth: 1,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 20,
                        marginLeft: 20,
                      }}
                    >
                      <Text>
                        {parseInt(item.achievment) > parseInt(item.target) ? 0 : (dateDiff > 0 && parseInt(item.shortfall) !== 0
                          ? (Math.abs(
                            Math.round(parseInt(item.shortfall) / dateDiff)
                          ) >= 100000 ? Math.abs(
                            Math.round(parseInt(item.shortfall) / dateDiff)
                          ) / 100000 + "L" : Math.abs(
                            Math.round(parseInt(item.shortfall) / dateDiff)
                          ))
                          : 0)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
            <View
              style={{ width: "100%", flexDirection: "row", marginTop: 20 }}
            >
              <View style={{ width: "50%" }}>
                <View style={styles.statWrap}>
                  <Text
                    style={{
                      marginRight: "60%",
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
                      }}
                    >
                      {parseInt(bookingData?.achievment) === 0 ||
                        parseInt(enqData?.achievment) === 0
                        ? 0
                        : Math.floor(
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
                <View style={{ height: 5 }}></View>
                <View style={styles.statWrap}>
                  <Text
                    style={{
                      marginRight: "60%",
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
                      }}
                    >
                      {parseInt(retailData?.achievment) === 0 ||
                        parseInt(enqData?.achievment) === 0
                        ? 0
                        : Math.floor(
                          (parseInt(retailData?.achievment) /
                            parseInt(enqData?.achievment)) *
                          100
                        )}
                      %
                    </Text>
                  )}
                </View>
                <View style={{ height: 5 }}></View>
                <View style={styles.statWrap}>
                  <Text
                    style={{
                      marginRight: "60%",
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
                      }}
                    >
                      {parseInt(enqData?.achievment) === 0 ||
                        parseInt(visitData?.achievment) === 0
                        ? 0
                        : Math.floor(
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
              </View>

              {/* <View style={{ height: 5 }}></View> */}

              <View style={{ width: "45%" }}>
                <View style={styles.statWrap}>
                  <Text
                    style={{
                      marginRight: "50%",
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
                      }}
                    >
                      {parseInt(bookingData?.achievment) === 0 ||
                        parseInt(retailData?.achievment) === 0
                        ? 0
                        : Math.floor(
                          (parseInt(retailData?.achievment) /
                            parseInt(bookingData?.achievment)) *
                          100
                        )}
                      %
                    </Text>
                  )}
                </View>
                <View style={{ height: 5 }}></View>
                <View style={styles.statWrap}>
                  <Text
                    style={{
                      marginRight: "45%",
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
                          Math.floor(
                            (parseInt(TDData?.achievment) /
                              parseInt(enqData?.achievment)) *
                            100
                          ) > 40
                            ? "#14ce40"
                            : "#ff0000",
                        fontSize: 12,
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
              </View>
            </View>
            <View style={{ height: 20 }}></View>
          </>
        )}

        {/* <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', marginTop: 0, marginRight: 10, justifyContent: 'flex-end', marginBottom: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: "600", color: '#ff0000' }}>View all</Text>
                <VectorImage
                    width={6}
                    height={11}
                    source={PATH1705}
                // style={{ tintColor: Colors.DARK_GRAY }}
                />
            </TouchableOpacity> */}
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
    backgroundColor: Colors.WHITE
  },
  statWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start', alignItems: 'center', height: 30, marginLeft: 10, backgroundColor: "#F5F5F5"
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
  totalText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
})