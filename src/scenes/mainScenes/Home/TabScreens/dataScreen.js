import React from "react";
import { View, StyleSheet, Dimensions, FlatList, Text } from "react-native";
import { Colors } from "../../../../styles";
import { DonutChartComp } from "../../../../components";
import { ChartNameList } from "../../../../pureComponents";

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
const chartWidth = screenWidth - 50;

const itemWidth = (screenWidth - 100) / 4;

export const LostScreen = () => {

    React.useEffect(() => {
        console.log("re: ", itemWidth);
    })

    return (
        <View style={styles.container2}>

            <View style={{ alignItems: "center" }}>
                <ChartNameList
                    data={tableData}
                    itemWidth={itemWidth}
                />
            </View>

            <DonutChartComp
                data={graphicData}
                width={chartWidth}
                height={chartWidth}
                colorScale={graphicColor}
            />
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

            <DonutChartComp
                data={graphicData}
                width={chartWidth}
                height={chartWidth}
                colorScale={graphicColor}
            />
        </View>
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