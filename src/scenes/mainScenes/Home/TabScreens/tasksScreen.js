import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Colors, GlobalStyle } from "../../../../styles";
import { TasksListComp } from "../../../../components";

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

export const TodayScreen = () => {

    return (
        <View style={styles.container}>
            <TasksListComp data={todaysData} />
        </View>
    )
}

export const UpcomingScreen = () => {

    return (
        <View style={styles.container}>
            <TasksListComp data={todaysData} />
        </View>
    )
}

export const PendingScreen = () => {

    return (
        <View style={styles.container}>
            <TasksListComp data={todaysData} />
        </View>
    )
}


const TasksScreen = () => {

    return (
        <View style={styles.container}>
            <TasksListComp data={todaysData} />
        </View>
    )
}

export default TasksScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        paddingVertical: 10
    },
    textStyle: {
        fontSize: 14,
        fontWeight: "400",
        paddingTop: 5,
    },
    titleStyle: {
        width: 80,
        color: Colors.GRAY
    },
    dataTextStyle: {
        maxWidth: 100
    }
})