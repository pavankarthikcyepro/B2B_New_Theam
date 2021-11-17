import React from "react";
import { View, StyleSheet, Dimensions, FlatList, Text } from "react-native";
import { Colors } from "../../../../styles";
import { DonutChartComp } from "../../../../components";
import { ChartNameList } from "../../../../pureComponents";
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'

const graphicData = [
    { y: 5, x: '5%' },
    { y: 20, x: '20%' },
    { y: 50, x: '50%' },
    { y: 30, x: '30%' },
    { y: 70, x: '70%' },
]

const graphicColor = ['red', 'blue', 'yellow', 'green', 'tomato']
const tableData = [
    {
        name: "Duster",
        color: "red"
    },
    {
        name: "Kiger",
        color: "blue"
    },
    {
        name: "Kwid",
        color: "yellow"
    },
    {
        name: "Triber",
        color: "green"
    },
    {
        name: "Verna",
        color: "tomato"
    }
]
const screenWidth = Dimensions.get("window").width;
const chartWidth = (screenWidth / 2) + 100;

const itemWidth = (screenWidth - 100) / 4;

export const LostScreen = () => {

    React.useEffect(() => {
        console.log("re: ", itemWidth);
    })

    return (
        <View style={styles.container2}>

            <View style={{ alignItems: "center", }}>
                <ChartNameList
                    data={tableData}
                    itemWidth={itemWidth}
                />
            </View>

            <View style={{ width: "100%", alignItems: "center" }}>
                <DonutChartComp
                    data={graphicData}
                    width={chartWidth}
                    height={chartWidth}
                    colorScale={graphicColor}
                />
            </View>
        </View>
    )
}

export const DropScreen = () => {

    return (
        <View style={styles.container2}>

            <View style={{ alignItems: "center" }}>
                <ChartNameList
                    data={tableData}
                    itemWidth={itemWidth}
                />
            </View>

            <View style={{ width: "100%", alignItems: "center" }}>
                <DonutChartComp
                    data={graphicData}
                    width={chartWidth}
                    height={chartWidth}
                    colorScale={graphicColor}
                />
            </View>

            {/* <Chart
                style={{ height: 200, width: 400 }}
                data={[
                    { x: -2, y: 15 },
                    { x: -1, y: 10 },
                    { x: 0, y: 12 },
                    { x: 1, y: 7 },
                    { x: 2, y: 6 },
                    { x: 3, y: 8 },
                    { x: 4, y: 10 },
                    { x: 5, y: 8 },
                    { x: 6, y: 12 },
                    { x: 7, y: 14 },
                    { x: 8, y: 12 },
                    { x: 9, y: 13.5 },
                    { x: 10, y: 18 },
                ]}
                padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
                xDomain={{ min: -2, max: 10 }}
                yDomain={{ min: 0, max: 20 }}
            >
                <VerticalAxis tickCount={11} theme={{ labels: { formatter: (v) => v.toFixed(2) } }} />
                <HorizontalAxis tickCount={5} />
                <Area theme={{ gradient: { from: { color: '#ffa502' }, to: { color: '#ffa502', opacity: 0.4 } } }} />
                <Line theme={{ stroke: { color: '#ffa502', width: 5 }, scatter: { default: { width: 4, height: 4, rx: 2 } } }} />
            </Chart> */}
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