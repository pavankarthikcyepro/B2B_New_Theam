import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
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

  const [retailData, setRetailData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [enqData, setEnqData] = useState(null);

  const [visitData, setVisitData] = useState(null);
  const [TDData, setTDData] = useState(null);
  const [dateDiff, setDateDiff] = useState(null);
  const [isTeamPresent, setIsTeamPresent] = useState(false);
  const [isTeam, setIsTeam] = useState(false);

  const [tempData, setTempData] = useState([
    {
      name: 'Karthik',
      isOpenInner: false,
      users: [
        {
          name: 'Atanu',
          isOpenInner: false,
          users: [
            {
              name: 'Pritam'
            },
            {
              name: 'Pratim'
            }
          ]
        },
        {
          name: 'Sutanu',
          isOpenInner: false,
          users: [
            {
              name: 'Pritam'
            },
            {
              name: 'Pratim'
            },
            {
              name: 'Ajay'
            },
            {
              name: 'Bijay'
            }
          ]
        }
      ]
    },
    {
      name: 'Karthik',
      isOpenInner: false,
      users: [
        {
          name: 'Atanu',
          isOpenInner: false,
          users: [
            {
              name: 'Pritam'
            },
            {
              name: 'Pratim'
            }
          ]
        }
      ]
    },
    {
      name: 'Karthik',
      isOpenInner: false,
      users: [
        {
          name: 'Atanu',
          isOpenInner: false,
          users: [
            {
              name: 'Pritam'
            },
            {
              name: 'Pratim'
            }
          ]
        }
      ]
    },
    {
      name: 'Karthik',
      isOpenInner: false,
      users: [
        {
          name: 'Atanu',
          isOpenInner: false,
          users: [
            {
              name: 'Pritam'
            },
            {
              name: 'Pratim'
            }
          ]
        }
      ]
    },
    {
      name: 'Karthik',
      isOpenInner: false,
      users: [
        {
          name: 'Atanu',
          isOpenInner: false,
          users: [
            {
              name: 'Pritam'
            },
            {
              name: 'Pratim'
            }
          ]
        }
      ]
    }
  ])

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

  // let tempData = [
  //   {
  //     name: 'Karthik',
  //     isOpenInner: true,
  //     users: [
  //       {
  //         name: 'Atanu',
  //         isOpenInner: true,
  //         users: [
  //           {
  //             name: 'Pritam'
  //           },
  //           {
  //             name: 'Pratim'
  //           }
  //         ]
  //       },
  //       {
  //         name: 'Sutanu',
  //         isOpenInner: false,
  //         users: [
  //           {
  //             name: 'Pritam'
  //           },
  //           {
  //             name: 'Pratim'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Karthik',
  //     isOpenInner: false,
  //     users: [
  //       {
  //         name: 'Atanu',
  //         isOpenInner: false,
  //         users: [
  //           {
  //             name: 'Pritam'
  //           },
  //           {
  //             name: 'Pratim'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Karthik',
  //     isOpenInner: false,
  //     users: [
  //       {
  //         name: 'Atanu',
  //         isOpenInner: false,
  //         users: [
  //           {
  //             name: 'Pritam'
  //           },
  //           {
  //             name: 'Pratim'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Karthik',
  //     isOpenInner: false,
  //     users: [
  //       {
  //         name: 'Atanu',
  //         isOpenInner: false,
  //         users: [
  //           {
  //             name: 'Pritam'
  //           },
  //           {
  //             name: 'Pratim'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Karthik',
  //     isOpenInner: false,
  //     users: [
  //       {
  //         name: 'Atanu',
  //         isOpenInner: false,
  //         users: [
  //           {
  //             name: 'Pritam'
  //           },
  //           {
  //             name: 'Pratim'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ]
  return (
    <View style={styles.container}>
      {/* {!selector.isTeam &&
                
            } */}

      {selector.isTeam ? (
        // <View>
        //   <View style={{ flexDirection: "row", marginLeft: 8 }}>
        //     <View
        //       style={{ width: "10%", justifyContent: "center", marginTop: 5 }}
        //     ></View>

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
        //         </Text>
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
        //           </Text>
        //         </View>
        //       </View>
        //     </View>

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

        //       </View>


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
        //                   {Number(item.achievment) >= 100000 ? Math.round(Number(item.achievment) / 100000) + "L" : (Number(item.achievment) >= 1000 ? Math.round(Number(item.achievment) / 1000) + "K" : item.achievment)}/{Number(item.target) >= 100000 ? Math.round(Number(item.target) / 100000) + "L" : (Number(item.target) >= 1000 ? Math.round(Number(item.target) / 1000) + "K" : item.target)}
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
        //                   {Number(item.achievment) > Number(item.target) ? 0 : (Math.abs(Number(item.shortfall)) >= 100000
        //                     ? Math.round(Math.abs(Number(item.shortfall)) / 100000) + "L"
        //                     : Math.round(Math.abs(Number(item.shortfall))))}
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
        //                   {Number(item.achievment) > Number(item.target) ? 0 : (dateDiff > 0 && parseInt(item.shortfall) !== 0
        //                     ? 
        //                     (Math.round(
        //                       parseInt(item.shortfall) / dateDiff
        //                     ) >= 100000
        //                       ? Math.round(parseInt(item.shortfall) / dateDiff / 100000) + "L"
        //                       : (Math.round(
        //                         parseInt(item.shortfall) / dateDiff
        //                       )))
        //                     : 0)}
        //                 </Text>
        //               </View>
        //             </View>
        //           );
        //         })}
        //       </View>

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
        //                   width: 150,
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
        //                     height: 30,
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                     marginLeft: 10,
        //                     width: 80,
        //                   }}
        //                 >
        //                   <Text
        //                     style={{
        //                       fontSize: 14,
        //                       color: color[index % color.length],
        //                       fontWeight: "600",
        //                     }}
        //                     numberOfLines={1}
        //                   >
        //                     {item.empName}
        //                   </Text>
        //                 </View>
        //               </View>
        //               <View style={{ flexDirection: "row", height: 30 }}>
        //                 <View
        //                   style={{
        //                     width: 50,
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                     borderWidth: 1,
        //                     borderColor: "#d1d1d1",
        //                     backgroundColor: "#d1d1d1",
        //                   }}
        //                 >
        //                   <Text style={{ fontSize: 14, fontWeight: "600" }}>
        //                     Ach
        //                   </Text>
        //                 </View>
        //                 <View
        //                   style={{
        //                     width: 50,
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                     borderWidth: 1,
        //                     borderColor: "#d1d1d1",
        //                     backgroundColor: "#d1d1d1",
        //                   }}
        //                 >
        //                   <Text style={{ fontSize: 14, fontWeight: "600" }}>
        //                     Bal
        //                   </Text>
        //                 </View>
        //                 <View
        //                   style={{
        //                     width: 50,
        //                     justifyContent: "center",
        //                     alignItems: "center",
        //                     borderWidth: 1,
        //                     borderColor: "#d1d1d1",
        //                     backgroundColor: "#d1d1d1",
        //                   }}
        //                 >
        //                   <Text style={{ fontSize: 14, fontWeight: "600" }}>
        //                     AR/D
        //                   </Text>
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
        //                             width: 50,
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
        //                             {Number(innerItem.achievment) >= 100000 ? Math.round(Number(innerItem.achievment) / 100000) + "L" : (Number(innerItem.achievment) >= 1000 ? Math.round(Number(innerItem.achievment) / 1000) + "K" : innerItem.achievment)}/{Number(innerItem.target) >= 100000 ? Math.round(Number(innerItem.target) / 100000) + "L" : (Number(innerItem.target) >= 1000 ? Math.round(Number(innerItem.target) / 1000) + "K" : innerItem.target)}
        //                           </Text>
        //                         </View>
        //                         <View
        //                           style={{
        //                             width: 50,
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
        //                             {Number(innerItem.achievment) > Number(innerItem.target) ? 0 : (Math.abs(Number(innerItem.shortfall)) >=
        //                             100000
        //                               ? Math.round(Math.abs(
        //                                 Number(innerItem.shortfall)
        //                               ) /
        //                                 100000) +
        //                                 "L"
        //                               : Math.round(Math.abs(Number(innerItem.shortfall))))}
        //                           </Text>
        //                         </View>
        //                         <View
        //                           style={{
        //                             width: 50,
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
        //                             {Number(innerItem.achievment) > Number(innerItem.target) ? 0 : (dateDiff > 0 &&
        //                             parseInt(innerItem.shortfall) !== 0
        //                               ? // ? (
        //                                 //     parseInt(innerItem.shortfall) /
        //                                 //     dateDiff
        //                                 //   ).toFixed(1)
        //                                 Math.abs(
        //                                   Math.round(
        //                                     parseInt(innerItem.shortfall) /
        //                                       dateDiff
        //                                   )
        //                                 )
        //                               : 0)}
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
        // </View>
        <View >
          <ScrollView contentContainerStyle={{ paddingRight: 20, flexDirection: 'column' }} horizontal={true} directionalLockEnabled={true}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '10%', height: 40, }}>

              </View>
              <View style={{ width: '90%', height: 40, flexDirection: 'row' }}>
                <View style={styles.itemBox}>
                  <Text style={{ color: '#FF8600' }}>Enq</Text>
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
                  <Text style={{ color: '#EC3466' }}>Fin %</Text>
                </View>
                <View style={styles.itemBox}>
                  <Text style={{ color: '#1C95A6' }}>Ins %</Text>
                </View>
                <View style={styles.itemBox}>
                  <Text style={{ color: '#CC2D79' }}>Retail</Text>
                </View>
                <View style={styles.itemBox}>
                  <Text style={{ color: '#FA03B9' }}>Del</Text>
                </View>
                <View style={styles.itemBox}>
                  <Text style={{ color: '#FA03B9' }}>Total</Text>
                </View>
              </View>
            </View>

            

            {tempData.length > 0 && tempData.map((item, index) => {
              return (
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '10%', minHeight: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF8600', borderRadius: 20, marginTop: item.isOpenInner ? 0 : 8 }} onPress={() => {
                      let localData = [...tempData];
                      let current = localData[index].isOpenInner;
                      for(let i = 0; i < localData.length; i++){
                        localData[i].isOpenInner = false;
                        if (i === localData.length - 1){
                          localData[index].isOpenInner = !current;
                        }
                      }
                      if(localData[index].users.length > 0){
                        for (let j = 0; j < localData[index].users.length; j++){
                          localData[index].users[j].isOpenInner = false;
                        }
                      }

                      setTempData([...localData])
                    }}>
                      <Text style={{ fontSize: 14, color: '#fff' }}>{item.name.charAt(0)}</Text>
                    </TouchableOpacity>
                    {item.isOpenInner && item.users.length > 0 && item.users.map((innerItem1, innerIndex1) => {
                      return (
                        <>
                          <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', borderRadius: 20, marginTop: item.isOpenInner ? 12 : 8 }} onPress={() => {
                            let localData = [...tempData];
                            let current = localData[index].users[innerIndex1].isOpenInner;
                            for (let i = 0; i < localData[index].users.length; i++) {
                              localData[index].users[i].isOpenInner = false;
                              if (i === localData[index].users.length - 1) {
                                localData[index].users[innerIndex1].isOpenInner = !current;
                              }
                            }
                            // if (localData[index].users.length > 0) {
                            //   for (let j = 0; j < localData[index].users.length; j++) {
                            //     localData[index].users[j].isOpenInner = false;
                            //   }
                            // }

                            setTempData([...localData])
                          }}>
                            <Text style={{ fontSize: 14, color: '#fff' }}>{innerItem1.name.charAt(0)}</Text>
                          </TouchableOpacity>
                          {
                            innerItem1.isOpenInner && innerItem1.users.length > 0 && innerItem1.users.map((innerItem2, index) => {
                              return (
                                <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#A5A5A5', borderRadius: 20, marginTop: item.isOpenInner ? 10 : 8 }}>
                                  <Text style={{ fontSize: 14, color: '#fff' }}>{innerItem2.name.charAt(0)}</Text>
                                </View>
                              )
                            })
                          }
                        </>
                      )
                    })
                    }
                    <View style={{marginTop: 5}}>
                      <Text style={{ fontSize: 14, color: '#000', fontWeight: '600' }}>Team Total</Text>
                    </View>
                  </View>
                  <View style={[{ width: '85%', minHeight: 40, flexDirection: 'column', padding: 5, }, item.isOpenInner && { backgroundColor: '#EEEEEE', borderRadius: 10, borderWidth: 1, borderColor: '#FF8600',}]}>
                    <View style={{ width: '100%', minHeight: 40, flexDirection: 'row' }}>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#EC3466' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000' }}>8/10</Text>
                      </View>
                    </View>

                    {item.isOpenInner && item.users.length > 0 && 
                      <View style={[{ width: '100%', minHeight: 40, flexDirection: 'column', }, item.isOpenInner && { borderRadius: 10, borderWidth: 1, borderColor: '#d1d1d1', backgroundColor: '#FFFFFF' }]}>
                      {
                        item.users.map((innerItem1, index) => {
                          return (
                            <View style={[{ width: '100%', minHeight: 40, flexDirection: 'column', },]}>
                              <View style={{ width: '90%', minHeight: 40, flexDirection: 'row' }}>
                                <View style={styles.itemBox}>
                                  <Text style={{ color: '#FA03B9' }}>8/10</Text>
                                </View>
                                <View style={styles.itemBox}>
                                  <Text style={{ color: '#EC3466' }}>8/10</Text>
                                </View>
                                <View style={styles.itemBox}>
                                  <Text style={{ color: '#1C95A6' }}>8/10</Text>
                                </View>
                                <View style={styles.itemBox}>
                                  <Text style={{ color: '#FA03B9' }}>8/10</Text>
                                </View>
                                <View style={styles.itemBox}>
                                  <Text style={{ color: '#1C95A6' }}>8/10</Text>
                                </View>
                                <View style={styles.itemBox}>
                                  <Text style={{ color: '#1C95A6' }}>8/10</Text>
                                </View>
                                <View style={styles.itemBox}>
                                  <Text style={{ color: '#FA03B9' }}>8/10</Text>
                                </View>
                                <View style={styles.itemBox}>
                                  <Text style={{ color: '#1C95A6' }}>8/10</Text>
                                </View>
                                <View style={styles.itemBox}>
                                  <Text style={{ color: '#000000' }}>8/10</Text>
                                </View>
                              </View>
                              {
                                innerItem1.isOpenInner && innerItem1.users.length > 0 &&
                                // <View style={[{ width: '100%', minHeight: 40, flexDirection: 'column', }, innerItem1.isOpenInner && { borderRadius: 10, borderWidth: 1, borderColor: '#d1d1d1', backgroundColor: '#FFFFFF' }]}>
                                //   {
                                    innerItem1.users.map((innerItem2, innerIndex2) => {
                                      return (
                                        <View style={{ width: '90%', minHeight: 40, flexDirection: 'row' }}>
                                          <View style={styles.itemBox}>
                                            <Text style={{ color: '#FA03B9' }}>8/10</Text>
                                          </View>
                                          <View style={styles.itemBox}>
                                            <Text style={{ color: '#EC3466' }}>8/10</Text>
                                          </View>
                                          <View style={styles.itemBox}>
                                            <Text style={{ color: '#1C95A6' }}>8/10</Text>
                                          </View>
                                          <View style={styles.itemBox}>
                                            <Text style={{ color: '#FA03B9' }}>8/10</Text>
                                          </View>
                                          <View style={styles.itemBox}>
                                            <Text style={{ color: '#1C95A6' }}>8/10</Text>
                                          </View>
                                          <View style={styles.itemBox}>
                                            <Text style={{ color: '#1C95A6' }}>8/10</Text>
                                          </View>
                                          <View style={styles.itemBox}>
                                            <Text style={{ color: '#FA03B9' }}>8/10</Text>
                                          </View>
                                          <View style={styles.itemBox}>
                                            <Text style={{ color: '#1C95A6' }}>8/10</Text>
                                          </View>
                                          <View style={styles.itemBox}>
                                            <Text style={{ color: '#000000' }}>8/10</Text>
                                          </View>
                                        </View>
                                      )
                                    })
                                //   }
                                // </View>
                              }
                            </View>
                          )
                        })
                      }
                      
                    </View>
                    }
                    <View style={{ width: '90%', minHeight: 40, flexDirection: 'row' }}>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                      </View>
                      <View style={styles.itemBox}>
                        <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}

            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '10%', minHeight: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Text style={{ fontSize: 14, color: '#000', fontWeight: '600' }}>Total</Text>
              </View>
              <View style={{ width: '90%', minHeight: 40, flexDirection: 'column', marginRight: 5, padding: 5, }}>
                <View style={{ width: '90%', minHeight: 40, flexDirection: 'row' }}>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                  </View>
                  <View style={styles.itemBox}>
                    <Text style={{ color: '#000000', fontWeight: '600' }}>8/10</Text>
                  </View>
                </View>
              </View>
            </View>
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
                      {Number(item.achievment) > Number(item.target) ? 0 : (Math.abs(Number(item.shortfall)) >= 100000
                        ? Math.abs(Number(item.shortfall)) / 100000 + "L"
                        : Math.abs(item.shortfall))}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 40,
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
                        ? Math.abs(
                          Math.round(parseInt(item.shortfall) / dateDiff)
                        )
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
  },
  statWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start', alignItems: 'center', height: 30, marginLeft: 10, backgroundColor: "#F5F5F5"
  },
  itemBox: { width: 45, height: 40, justifyContent: 'center', alignItems: 'center' }

})