import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions, Text } from "react-native";
import { Colors } from "../../../../styles";
import { TargetListComp } from "../../../../components";
import { DropDownSelectionItem, DateSelectItem, ChartNameList, EmptyListView } from "../../../../pureComponents";
import { targetStyle } from "../../../../components/targetListComp";
import { useDispatch, useSelector } from 'react-redux';
import { LineChart } from "react-native-chart-kit";
import { random_color } from "../../../../utils/helperFunctions";

// const paramtersTitlesData = ["Parameter", "E", "TD", "HV", "VC", "B", "Ex", "R", "F", "I", "Ex-W", "Acc.", "Ev"]
const paramtersTitlesData = ["Parameter", "Target", "Achivement", "Achivement %", "ShortFall", "ShortFall %"]
const chartTitles = ["Target", "Achivement", "ShortFall"];
const parameterTitlesForData = ["E", "TD", "HV", "B", "EX", "R", "F", "I", "Ex-W", "Acc.", "Ev"];

const eventTitlesData = ["Event Name", "E", "T", "V", "B", "R", "L"]
const vehicleModelTitlesData = ["Model", "E", "T", "V", "B", "R", "L"]
const leadSourceTitlesData = ["Lead", "E", "T", "V", "B", "R", "L"]

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
                    // const randomColor = random_color("rgba");
                    var x = Math.floor(Math.random() * 256);
                    var y = Math.floor(Math.random() * 256);
                    var z = Math.floor(Math.random() * 256);
                    const rgbValue = `rgba(${x}, ${y}, ${z}, 1)`;
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
                                    <NameComp label={Number(object?.achivementPerc) + "%"} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={object?.shortfall} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={Number(object?.shortFallPerc) + "%"} labelStyle={targetStyle.dataTextStyle} />
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
                    />
                </View>
                {chartData.length > 0 && (
                    <View style={{ alignItems: 'center', overflow: 'hidden' }}>
                        <LineChart
                            data={{
                                labels: chartTitles,
                                datasets: chartData,
                                legend: [] // optional
                            }}
                            width={Dimensions.get("window").width - 40} // from react-native
                            height={200}
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: "#e8e7e6",
                                backgroundGradientFrom: "#dcdedc",
                                backgroundGradientTo: "#e1e6e1",
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => "#040504",
                                labelColor: (opacity = 1) => "#040504",
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 4,
                                borderRadius: 8,
                            }}
                        />
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

    useEffect(() => {
        if (selector.lead_source_table_data) {
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
        </View>
    )
}

export const VehicleModelScreen = () => {

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        if (selector.vehicle_model_table_data) {
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
        </View>
    )
}

export const EventScreen = () => {

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        if (selector.events_table_data) {
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
        </View>
    )
}

const TargetScreen = () => {

    return (
        <View style={styles.container}>

        </View>
    )
}

export default TargetScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE
    }
})