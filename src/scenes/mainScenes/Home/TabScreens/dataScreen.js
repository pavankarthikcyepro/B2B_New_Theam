import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList, Text } from "react-native";
import { Colors } from "../../../../styles";
import { DonutChartComp } from "../../../../components";
import { ChartNameList } from "../../../../pureComponents";
import { useDispatch, useSelector } from 'react-redux';
import { random_color } from "../../../../utils/helperFunctions";

const graphicData = [
    { y: 5, x: '5%' },
    { y: 20, x: '20%' },
]
const graphicColor = ['red', 'blue', 'yellow', 'green', 'tomato']
const tableData = [
    {
        name: "Duster",
        color: "red"
    },
]

const screenWidth = Dimensions.get("window").width;
const chartWidth = (screenWidth / 2) + 100;

const itemWidth = (screenWidth - 100) / 4;

export const LostScreen = () => {

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [chartData, setChartData] = useState([]);
    const [chartColorData, setChartColorData] = useState([]);
    const [namesData, setNamesData] = useState([]);

    useEffect(() => {
        if (selector.lost_drop_chart_data != undefined && selector.lost_drop_chart_data.lostData) {
            const dataArray = selector.lost_drop_chart_data.lostData;
            let chartDataLocal = [];
            let chartColorLocal = [];
            let namesDataLocal = [];
            if (dataArray.length > 0) {
                dataArray.forEach(element => {
                    const randomColor = random_color("hexa");
                    const percentage = Number(element.lostPercentage);
                    if (percentage > 0) {
                        chartDataLocal.push({
                            x: percentage + "%",
                            y: percentage
                        })
                    }
                    chartColorLocal.push(randomColor);
                    namesDataLocal.push({ name: percentage + "%" + " " + element.modelName, color: randomColor, value: percentage + "%" })
                });
            }
            setChartData(chartDataLocal);
            setChartColorData(chartColorLocal);
            setNamesData(namesDataLocal);
        } else {
            setChartData([]);
        }
    }, [selector.lost_drop_chart_data])

    return (
        <View style={styles.container2}>

            <View style={{ alignItems: "center", }}>
                <ChartNameList
                    data={namesData}
                    itemWidth={itemWidth}
                />
            </View>

            <View style={{ width: "100%", alignItems: "center" }}>
                <DonutChartComp
                    data={chartData}
                    width={chartWidth}
                    height={chartWidth}
                    colorScale={chartColorData}
                />
            </View>
        </View>
    )
}

export const DropScreen = () => {

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [chartData, setChartData] = useState([]);
    const [chartColorData, setChartColorData] = useState([]);
    const [namesData, setNamesData] = useState([]);

    useEffect(() => {
        if (selector.lost_drop_chart_data != undefined && selector.lost_drop_chart_data.dropData) {
            const dataArray = selector.lost_drop_chart_data.dropData;
            let chartDataLocal = [];
            let chartColorLocal = [];
            let namesDataLocal = [];
            if (dataArray.length > 0) {
                dataArray.forEach(element => {
                    const randomColor = random_color("hexa");
                    const percentage = Number(element.dropPercentage);
                    if (percentage > 0) {
                        chartDataLocal.push({
                            x: percentage + "%",
                            y: percentage
                        })
                    }
                    chartColorLocal.push(randomColor);
                    namesDataLocal.push({ name: percentage + "%" + " " + element.modelName, color: randomColor })
                });
            }
            setChartData(chartDataLocal);
            setChartColorData(chartColorLocal);
            setNamesData(namesDataLocal);
        } else {
            setChartData([]);
        }
    }, [selector.lost_drop_chart_data])


    return (
        <View style={styles.container2}>

            <View style={{ alignItems: "center" }}>
                <ChartNameList
                    data={namesData}
                    itemWidth={itemWidth}
                />
            </View>

            <View style={{ width: "100%", alignItems: "center" }}>
                <DonutChartComp
                    data={chartData}
                    width={chartWidth}
                    height={chartWidth}
                    colorScale={chartColorData}
                />
            </View>
        </View >
    )
}


const DataScreen = () => {

    return (
        <View style={styles.container}>

        </View>
    )
}

export default DataScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    container2: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: Colors.WHITE
    }
})