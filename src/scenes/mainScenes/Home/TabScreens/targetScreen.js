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

// const paramtersTitlesData = ["Parameter", "E", "TD", "HV", "VC", "B", "Ex", "R", "F", "I", "Ex-W", "Acc.", "Ev"]
const paramtersTitlesData = ["Parameter", "Target", "Achivement", "Achivement %", "ShortFall", "ShortFall %"]
const chartTitles = ["Target", "Achivement", "ShortFall"];
const parameterTitlesForData = ["E", "TD", "HV", "B", "EX", "R", "F", "I", "Ex-W", "Acc.", "Ev"];

const eventTitlesData = ["Event Name", "E", "TD", "HV", "B", "R", "L"]
const vehicleModelTitlesData = ["Model", "E", "TD", "HV", "B", "R", "L"]
const leadSourceTitlesData = ["Lead", "E", "TD", "HV", "B", "R", "L"]

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
            console.log("chartDataLocal: ", chartDataLocal)
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
            console.log("test: ", selector.lead_source_table_data)
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
        title: 'Enq',
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
        title: 'TD',
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
        title: 'HV',
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
        title: 'Bkg',
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
        title: 'Fin(%)',
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
        title: 'Insu(%)',
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
        title: 'Del',
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

    useEffect(() => {

        if (selector.target_parameters_data.length > 0) {
            let tempRetail = [];
            tempRetail = selector.target_parameters_data.filter((item) => {
                return item.paramName.toLowerCase() === 'invoice'
            })
            if (tempRetail.length > 0) {
                setRetailData(tempRetail[0])
            }

            let tempBooking = [];
            tempBooking = selector.target_parameters_data.filter((item) => {
                return item.paramName.toLowerCase() === 'booking'
            })
            // console.log("%%%TEMP BOOK", tempBooking);
            if (tempBooking.length > 0) {
                setBookingData(tempBooking[0])
            }

            let tempEnq = [];
            tempEnq = selector.target_parameters_data.filter((item) => {
                return item.paramName.toLowerCase() === 'enquiry'
            })
            if (tempEnq.length > 0) {
                setEnqData(tempEnq[0])
            }

            let tempVisit = [];
            tempVisit = selector.target_parameters_data.filter((item) => {
                return item.paramName.toLowerCase() === 'home visit'
            })
            if (tempVisit.length > 0) {
                setVisitData(tempVisit[0])
            }

            let tempTD = [];
            tempTD = selector.target_parameters_data.filter((item) => {
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

    }, [selector.target_parameters_data])

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
                    console.log("%%%%% TEAM:", rolesArr);
                    setIsTeamPresent(true)
                }
            }
        }

    }, [selector.login_employee_details])

    useEffect(() => {
        setIsTeam(selector.isTeam)
    }, [selector.isTeam])

    return (
        <View style={styles.container}>
            {/* {!selector.isTeam &&
                
            } */}

            {selector.isTeam ?
                <View>
                    <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                        <View style={{ width: '10%', justifyContent: 'center', marginTop: 5, }}>

                        </View>
                        {/* <View style={{ width: '2%', borderRightWidth: 2, borderRightColor: '#d1d1d1', height: 53 }}>

                        </View> */}
                        <View style={{ width: '40%', justifyContent: 'center', marginTop: 5, alignItems: 'center', }}>
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: 40, borderWidth: 1, borderColor: '#d1d1d1' }}>
                                <Text style={{ fontSize: 14, color: '#0600FF', fontWeight: '600', }}>Team Total</Text>
                            </View>
                            <View style={{ flexDirection: 'row', height: 30 }}>
                                <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1', backgroundColor: "#d1d1d1" }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600' }}>Ach</Text>
                                </View>
                                <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1', backgroundColor: "#d1d1d1" }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600' }}>Bal</Text>
                                </View>
                                <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1', backgroundColor: "#d1d1d1" }}>
                                    <Text style={{ fontSize: 14, fontWeight: '600' }}>AR/D</Text>
                                </View>
                            </View>
                        </View>
                        {/* <View style={{ width: '2%', borderRightWidth: 2, borderRightColor: '#d1d1d1', height: 53 }}>

                        </View> */}

                    </View>
                    {selector.all_target_parameters_data.length > 0 &&
                        <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                            <View style={{ width: '10%', marginTop: 5, }}>
                                {
                                    selector.all_target_parameters_data.map((item, index) => {
                                        return (
                                            <View style={{ height: 30 }}>
                                                <Text style={{ color: color[index % color.length], fontSize: 14, fontWeight: '600' }}>{item.paramShortName}</Text>
                                            </View>
                                        )
                                    })
                                }

                                {/* <View style={{ marginBottom: 5 }}>
                                <Text>Eng</Text>
                            </View>
                            <View>
                                <Text>TD</Text>
                            </View> */}
                            </View>
                            {/* <View style={{ width: '2%', borderRightWidth: 2, borderRightColor: '#d1d1d1', minHeight: 300 }}></View> */}

                            <View style={{ width: '40%', }}>
                                {
                                    selector.all_target_parameters_data.map((item, index) => {
                                        return (
                                            <View style={{ flexDirection: 'row', height: 30 }}>
                                                <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1' }}>
                                                    <Text style={{ fontSize: 12, fontWeight: '600' }}>{item.achievment}/{item.target}</Text>
                                                </View>
                                                <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1' }}>
                                                    <Text style={{ fontSize: 12, fontWeight: '600' }}>{item.shortfall}</Text>
                                                </View>
                                                <View style={{ width: '33%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1' }}>
                                                    <Text style={{ fontSize: 12, fontWeight: '600' }}>{dateDiff > 0 && parseInt(item.shortfall) !== 0 ? (parseInt(item.shortfall) / dateDiff).toFixed(2) : 0}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>

                            {/* <View style={{ width: '2%', borderRightWidth: 2, borderRightColor: '#d1d1d1', minHeight: 300 }}></View> */}
                            <ScrollView style={{ marginBottom: 0, marginTop: -80, }} contentContainerStyle={{ alignItems: 'center', }} horizontal={true}>
                                {
                                    selector.all_emp_parameters_data.map((item, index) => {
                                        return (
                                            <View style={{ flexDirection: 'column', marginTop: 5 }}>
                                                <View style={{ flexDirection: 'row', height: 40, borderWidth: 1, borderColor: '#d1d1d1', width: 150, justifyContent: 'center', alignItems: 'center' }}>
                                                    <View style={{ width: 30, height: 30, borderRadius: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: color[index % color.length] }}>
                                                        <Text style={{ color: '#fff' }}>{item.empName.charAt(0)}</Text>
                                                    </View>
                                                    <View style={{ height: 30, justifyContent: 'center', alignItems: 'center', marginLeft: 10, width: 80 }}>
                                                        <Text style={{ fontSize: 14, color: color[index % color.length], fontWeight: '600', }}>{item.empName}</Text>
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: 'row', height: 30, }}>
                                                    <View style={{ width: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1', backgroundColor: "#d1d1d1" }}>
                                                        <Text style={{ fontSize: 14, fontWeight: '600' }}>Ach</Text>
                                                    </View>
                                                    <View style={{ width: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1', backgroundColor: "#d1d1d1" }}>
                                                        <Text style={{ fontSize: 14, fontWeight: '600' }}>Bal</Text>
                                                    </View>
                                                    <View style={{ width: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1', backgroundColor: "#d1d1d1" }}>
                                                        <Text style={{ fontSize: 14, fontWeight: '600' }}>AR/D</Text>
                                                    </View>
                                                </View>
                                                {
                                                    item.targetAchievements.map((innerItem, innerIndex) => {
                                                        return (
                                                            <>
                                                                <View style={{ flexDirection: 'row', height: 30 }}>
                                                                    <View style={{ width: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1' }}>
                                                                        <Text style={{ fontSize: 12, fontWeight: '600' }}>{innerItem.achievment}/{innerItem.target}</Text>
                                                                    </View>
                                                                    <View style={{ width: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1' }}>
                                                                        <Text style={{ fontSize: 12, fontWeight: '600' }}>{innerItem.shortfall}</Text>
                                                                    </View>
                                                                    <View style={{ width: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d1d1d1' }}>
                                                                        <Text style={{ fontSize: 12, fontWeight: '600' }}>{dateDiff > 0 && parseInt(innerItem.shortfall) !== 0 ? (parseInt(innerItem.shortfall) / dateDiff).toFixed(2) : 0}</Text>
                                                                    </View>
                                                                </View>
                                                                {

                                                                }
                                                            </>

                                                        )
                                                    })
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>

                        </View>
                    }
                </View> :
                <>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: '65%', justifyContent: 'center', height: 15 }}>
                        </View>
                        <View style={{ width: '35%', flexDirection: 'row', }}>
                            <Text style={{ fontSize: 14, fontWeight: '600' }}>Balance</Text>
                            <View style={{ marginRight: 10 }}></View>
                            <Text style={{ fontSize: 14, fontWeight: '600' }}>AR/Day</Text>
                        </View>
                    </View>
                    {
                        selector.target_parameters_data.map((item, index) => {
                            return (
                                <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                                    <View style={{ width: '10%', justifyContent: 'center', marginTop: 5 }}>
                                        <Text>{item.paramShortName}</Text>
                                    </View>
                                    <View style={{ width: '10%', marginTop: 10, position: 'relative', backgroundColor: color[index % color.length], height: 20, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }}>
                                        <Text style={{ color: '#fff' }}>{item.achievment}</Text>
                                    </View>
                                    <View style={{ width: '25%', marginTop: 10, position: 'relative' }}>
                                        <ProgressBar progress={item.achivementPerc.includes('%') ? parseInt(item.achivementPerc.substring(0, item.achivementPerc.indexOf('%'))) === 0 ? 0 : (parseInt(item.achivementPerc.substring(0, item.achivementPerc.indexOf('%'))) / 100) : (parseFloat(item.achivementPerc) / 100)} color={color[index % color.length]} style={{ height: 20, borderTopRightRadius: 3, borderBottomRightRadius: 3, backgroundColor: '#eeeeee', }} />
                                        {/* <View style={{ position: 'absolute', top: 1, left: 2 }}>
                                            <Text style={{ color: Colors.WHITE }}>{item.achievment}</Text>
                                        </View> */}
                                        <View style={{ position: 'absolute', top: 1, right: 3 }}>
                                            <Text style={{ color: parseInt(item.achivementPerc.substring(0, item.achivementPerc.indexOf('%'))) >= 90 ? Colors.WHITE : Colors.BLACK }}>{item.target}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '10%', justifyContent: 'center', flexDirection: 'row', height: 25, marginTop: 8, alignItems: 'center', marginLeft: 8 }}>
                                        <IconButton
                                            icon={parseInt(item.achivementPerc.substring(0, item.achivementPerc.indexOf('%'))) > 40 ? "menu-up" : "menu-down"}
                                            color={parseInt(item.achivementPerc.substring(0, item.achivementPerc.indexOf('%'))) > 40 ? Colors.DARK_GREEN : Colors.RED}
                                            // icon={"menu-up"}
                                            // color={Colors.DARK_GREEN}
                                            size={30}
                                        />
                                        <View style={{ justifyContent: 'center', flexDirection: 'row', height: 25, marginTop: 0, alignItems: 'center', marginLeft: -20 }}>
                                            <Text>{item.achivementPerc}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '35%', justifyContent: 'center', flexDirection: 'row', height: 25, alignItems: 'center', marginTop: 8, marginLeft: 23 }}>
                                        <View style={{ width: 35, height: 25, borderColor: color[index % color.length], borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text>{item.shortfall}</Text>
                                        </View>
                                        <View style={{ width: 40, height: 25, borderColor: color[index % color.length], borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 20, marginLeft: 20 }}>
                                            <Text>{dateDiff > 0 && parseInt(item.shortfall) !== 0 ? (parseInt(item.shortfall) / dateDiff).toFixed(2) : 0}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ width: '49%', }}>
                            <View style={styles.statWrap}>
                                <Text style={{ marginRight: 5, fontSize: 10, fontWeight: "600" }}>Enquiry to Booking (%)</Text>
                                {bookingData !== null && enqData !== null &&
                                    <Text style={{ color: (Math.floor(parseInt(bookingData?.achievment) / parseInt(enqData?.achievment) * 100)) > 40 ? '#14ce40' : '#ff0000', fontSize: 12, }}>{(parseInt(bookingData?.achievment) === 0 || parseInt(enqData?.achievment) === 0) ? 0 : (Math.floor(parseInt(bookingData?.achievment) / parseInt(enqData?.achievment) * 100))}%</Text>
                                }
                            </View>

                            <View style={styles.statWrap}>
                                <Text style={{ marginRight: 5, fontSize: 10, fontWeight: "600" }}>Enquiry to Retail (%)</Text>
                                {retailData !== null && enqData !== null &&
                                    <Text style={{ color: (Math.floor(parseInt(retailData?.achievment) / parseInt(enqData?.achievment) * 100)) > 40 ? '#14ce40' : '#ff0000', fontSize: 12, }}>{(parseInt(retailData?.achievment) === 0 || parseInt(enqData?.achievment) === 0) ? 0 : (Math.floor(parseInt(retailData?.achievment) / parseInt(enqData?.achievment) * 100))}%</Text>
                                }
                            </View>

                            <View style={styles.statWrap}>
                                <Text style={{ marginRight: 5, fontSize: 10, fontWeight: "600" }}>Enquiry to Test drive (%)</Text>
                                {TDData !== null && enqData !== null &&
                                    <Text style={{ color: (Math.floor(parseInt(TDData?.achievment) / parseInt(enqData?.achievment) * 100)) > 40 ? '#14ce40' : '#ff0000', fontSize: 12, }}>{(parseInt(TDData?.achievment) === 0 || parseInt(enqData?.achievment) === 0) ? 0 : (Math.floor(parseInt(TDData?.achievment) / parseInt(enqData?.achievment) * 100))}%</Text>
                                }
                            </View>
                        </View>

                        <View style={{ width: '1%', borderRightColor: Colors.GRAY, height: 60, borderRightWidth: 1 }}></View>

                        <View style={{ width: '49%', }}>
                            <View style={styles.statWrap}>
                                <Text style={{ marginRight: 5, fontSize: 10, fontWeight: "600" }}>Booking to Retail (%)</Text>
                                {bookingData !== null && retailData !== null &&
                                    <Text style={{ color: (Math.floor(parseInt(retailData?.achievment) / parseInt(bookingData?.achievment) * 100)) > 40 ? '#14ce40' : '#ff0000', fontSize: 12, }}>{(parseInt(bookingData?.achievment) === 0 || parseInt(retailData?.achievment) === 0) ? 0 : (Math.floor(parseInt(retailData?.achievment) / parseInt(bookingData?.achievment) * 100))}%</Text>
                                }
                            </View>

                            <View style={styles.statWrap}>
                                <Text style={{ marginRight: 5, fontSize: 10, fontWeight: "600" }}>Booking to Visit (%)</Text>
                                {bookingData !== null && visitData !== null &&
                                    <Text style={{ color: (Math.floor(parseInt(visitData?.achievment) / parseInt(bookingData?.achievment) * 100)) > 40 ? '#14ce40' : '#ff0000', fontSize: 12, }}>{(parseInt(bookingData?.achievment) === 0 || parseInt(visitData?.achievment) === 0) ? 0 : (Math.floor(parseInt(visitData?.achievment) / parseInt(bookingData?.achievment) * 100))}%</Text>
                                }
                            </View>
                        </View>
                    </View>
                </>
            }

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
    )
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
    }
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
                supportData.map((item) => {
                    return (
                        <View style={{ flexDirection: 'row', marginLeft: 8 }}>
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
                    <Text style={{ marginRight: -15, fontSize: 10, fontWeight: "600" }}>Enquiry to Booking (%)</Text>
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
                <Text style={{ marginRight: -15, fontSize: 10, fontWeight: "600" }}>Enquiry to Retail (%)</Text>
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
    statWrap: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 20, marginLeft: 10 }
})