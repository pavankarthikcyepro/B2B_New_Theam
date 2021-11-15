import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../../../../styles";
import { TargetListComp } from "../../../../components";

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

const eventTitlesData = ["Event Name", "E", "T", "V", "B", "R", "L"]
const vehicleModelTitlesData = ["Model", "E", "T", "V", "B", "R", "L"]

export const ParameterScreen = () => {

    return (
        <View style={styles.container}>
            <TargetListComp data={todaysData} titlesData={eventTitlesData} />
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