import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Colors } from "../../../../styles";
import { TargetListComp } from "../../../../components";
import { DropDownSelectionItem, DateSelectItem } from "../../../../pureComponents";
import { NameComp, targetStyle } from "../../../../components/targetListComp";
import { Chart, Line, Area, HorizontalAxis, VerticalAxis } from 'react-native-responsive-linechart'

const todaysData = [
    {
        "empName": "Admin",
        "call": 0,
        "td": 0,
        "v": 0,
        "pb": 0,
        "d": 0,
        "pending": 229,
        "sno": 1
    },
    {
        "empName": "Admin First",
        "call": 0,
        "td": 0,
        "v": 0,
        "pb": 0,
        "d": 0,
        "pending": 229,
        "sno": 1
    },
    {
        "empName": "Admin Second",
        "call": 0,
        "td": 0,
        "v": 0,
        "pb": 0,
        "d": 0,
        "pending": 229,
        "sno": 1
    },
    {
        "empName": "Admin First",
        "call": 0,
        "td": 0,
        "v": 0,
        "pb": 0,
        "d": 0,
        "pending": 229,
        "sno": 1
    },
    {
        "empName": "Admin Second Frist",
        "call": 0,
        "td": 0,
        "v": 0,
        "pb": 0,
        "d": 0,
        "pending": 229,
        "sno": 1
    }
]

const paramtersTitlesData = ["Parameter", "E", "TD", "HV", "VC", "B", "Ex", "R", "F", "I", "Ex-W", "Acc.", "Ev"]
const eventTitlesData = ["Event Name", "E", "T", "V", "B", "R", "L"]
const vehicleModelTitlesData = ["Model", "E", "T", "V", "B", "R", "L"]

export const ParameterScreen = () => {

    return (
        <View style={[styles.container, { paddingTop: 10 }]}>
            <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ width: "20%", paddingLeft: 5 }}>
                    {paramtersTitlesData.map((item, index) => {
                        return (
                            <NameComp key={index} label={item} labelStyle={targetStyle.titleStyle} showColon={true} />
                        )
                    })}
                </View>
                <View style={{ width: "80%" }}>
                    <FlatList
                        data={todaysData}
                        keyExtractor={(item, index) => "Target" + index.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {

                            return (
                                <View style={{ alignItems: "center", paddingHorizontal: 5 }}>
                                    <NameComp label={item.sno} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.empName} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.call} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.td} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.v} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.pb} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.d} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.call} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.td} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.v} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.pb} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.d} labelStyle={targetStyle.dataTextStyle} />
                                    <NameComp label={item.d} labelStyle={targetStyle.dataTextStyle} />
                                </View>
                            )
                        }}
                    />
                </View>
            </View>
            <View style={{ backgroundColor: Colors.WHITE, }}>
                <Chart
                    style={{ height: 200, width: '100%', }}
                    data={[
                        { x: 8, y: 15 },
                        { x: 6, y: 12 },
                    ]}
                    padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
                    xDomain={{ min: 5, max: 8 }}
                >
                    <VerticalAxis
                        tickValues={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]}
                        theme={{
                            axis: { stroke: { color: '#0b03fc', width: 10 } },
                            ticks: { stroke: { color: '#fcba03', width: 10 } },
                            labels: { formatter: (v) => v.toFixed(2) },
                        }}
                    />
                    <HorizontalAxis
                        // tickValues={[50]}
                        tickCount={10}
                        theme={{
                            axis: { stroke: { color: '#aaa', width: 2 } },
                            ticks: { stroke: { color: '#aaa', width: 2 } },
                            labels: { label: { rotation: 0 }, formatter: (v) => v.toFixed(1) },
                        }}
                    />
                    <Line theme={{ stroke: { color: 'red', width: 2 } }} />
                    <Line smoothing="bezier" tension={0.15} theme={{ stroke: { color: 'blue', width: 2 } }} />
                    <Line smoothing="bezier" tension={0.3} theme={{ stroke: { color: 'green', width: 2 } }} />
                    <Line smoothing="cubic-spline" tension={0.3} theme={{ stroke: { color: 'orange', width: 2 } }} />
                </Chart>
            </View>
        </View>
    )
}

export const LeadSourceScreen = () => {

    return (
        <View style={styles.container}>
            <TargetListComp data={todaysData} titlesData={vehicleModelTitlesData} />
        </View>
    )
}

export const VehicleModelScreen = () => {

    return (
        <View style={styles.container}>
            <TargetListComp data={todaysData} titlesData={vehicleModelTitlesData} />
        </View>
    )
}

export const EventScreen = () => {

    return (
        <View style={styles.container}>
            <TargetListComp data={todaysData} titlesData={eventTitlesData} />
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