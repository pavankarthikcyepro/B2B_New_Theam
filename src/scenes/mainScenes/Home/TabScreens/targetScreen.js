import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Colors } from "../../../../styles";
import { TargetListComp } from "../../../../components";
import { DropDownSelectionItem, DateSelectItem } from "../../../../pureComponents";
import { NameComp, targetStyle } from "../../../../components/targetListComp";

const todaysData = [
    {

    },
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
        <View style={styles.container}>
            <FlatList
                data={todaysData}
                keyExtractor={(item, index) => "Target" + index.toString()}
                horizontal={true}
                renderItem={({ item, index }) => {

                    if (index === 0) {
                        return (
                            <View style={{}}>
                                {paramtersTitlesData.map((item, index) => {
                                    return (
                                        <NameComp key={index} label={item} labelStyle={targetStyle.titleStyle} showColon={true} />
                                    )
                                })}
                            </View>
                        )
                    }

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