import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Colors, GlobalStyle } from "../../../../styles";
import { TasksListComp } from "../../../../components";
import { EmptyListView } from "../../../../pureComponents";
import { useDispatch, useSelector } from 'react-redux';

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
        "empName": " First",
        "call": 0,
        "td": 0,
        "v": 0,
        "pb": 0,
        "d": 0,
        "pending": 229,
        "sno": 1
    },
    {
        "empName": " Second",
        "call": 0,
        "td": 0,
        "v": 0,
        "pb": 0,
        "d": 0,
        "pending": 229,
        "sno": 1
    },
    {
        "empName": " First",
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

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        if (selector.task_table_data != undefined && selector.task_table_data.todaysData) {
            setTableData(selector.task_table_data.todaysData);
        } else {
            setTableData([]);
        }
    }, [selector.task_table_data])

    return (
        <View style={styles.container}>
            {tableData.length > 0 ? (<TasksListComp data={tableData} />) : (
                <EmptyListView title={"No Data Found"} />
            )}
        </View>
    )
}

export const UpcomingScreen = () => {

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        if (selector.task_table_data != undefined && selector.task_table_data.upcomingData) {
            setTableData(selector.task_table_data.upcomingData);
        } else {
            setTableData([]);
        }
    }, [selector.task_table_data])

    return (
        <View style={styles.container}>
            {tableData.length > 0 ? (<TasksListComp data={tableData} />) : (
                <EmptyListView title={"No Data Found"} />
            )}
        </View>
    )
}

export const PendingScreen = () => {

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        if (selector.task_table_data != undefined && selector.task_table_data.pendingData) {
            setTableData(selector.task_table_data.pendingData);
        } else {
            setTableData([]);
        }
    }, [selector.task_table_data])

    return (
        <View style={styles.container}>
            {tableData.length > 0 ? (<TasksListComp data={tableData} />) : (
                <EmptyListView title={"No Data Found"} />
            )}
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