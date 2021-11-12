import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Colors, GlobalStyle } from "../../../../styles";


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
        "empName": "Admin Second",
        "call": 0,
        "td": 0,
        "v": 0,
        "pb": 0,
        "d": 0,
        "pending": 229,
        "sno": 1
    }
]

const NameComp = ({ label, labelStyle = {}, showColon = false }) => {

    return (
        <View style={{ justifyContent: "center", height: 30, padding: 5, flexDirection: 'row' }}>
            <Text style={[styles.textStyle, labelStyle]}>{label}</Text>
            {showColon ? <Text style={[styles.textStyle]}>{":"}</Text> : null}
        </View>
    )
}

const TasksScreen = () => {

    return (
        <View style={styles.container}>
            <FlatList
                data={todaysData}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                renderItem={({ item, index }) => {

                    if (index === 0) {
                        return (
                            <View style={{}}>
                                <NameComp label={"S.No."} labelStyle={styles.titleStyle} showColon={true} />
                                <NameComp label={"Employee"} labelStyle={styles.titleStyle} showColon={true} />
                                <NameComp label={"Call"} labelStyle={styles.titleStyle} showColon={true} />
                                <NameComp label={"TD"} labelStyle={styles.titleStyle} showColon={true} />
                                <NameComp label={"V"} labelStyle={styles.titleStyle} showColon={true} />
                                <NameComp label={"PB"} labelStyle={styles.titleStyle} showColon={true} />
                                <NameComp label={"D"} labelStyle={styles.titleStyle} showColon={true} />
                                <NameComp label={"Pending"} labelStyle={styles.titleStyle} showColon={true} />
                            </View>
                        )
                    }

                    return (
                        <View style={{ alignItems: "center", paddingHorizontal: 5 }}>
                            <NameComp label={item.sno} />
                            <NameComp label={item.empName} />
                            <NameComp label={item.call} />
                            <NameComp label={item.td} />
                            <NameComp label={item.v} />
                            <NameComp label={item.pb} />
                            <NameComp label={item.d} />
                            <NameComp label={item.pending} />
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default TasksScreen;

const styles = StyleSheet.create({
    container: {
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
    }
})