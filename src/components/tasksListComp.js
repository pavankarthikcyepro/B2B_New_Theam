import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Colors } from "../styles";

const NameComp = ({ label, labelStyle = {}, showColon = false }) => {

    return (
        <View style={{ justifyContent: "center", height: 20, paddingRight: 2, flexDirection: 'row' }}>
            <Text style={[styles.textStyle, labelStyle]} numberOfLines={1}>{label}</Text>
            {showColon ? <Text style={[styles.textStyle]}>{":"}</Text> : null}
        </View>
    )
}

export const TasksListComp = ({ data }) => {

    return (
        <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={{ width: "20%" }}>
                <NameComp label={"S.No."} labelStyle={styles.titleStyle} showColon={true} />
                <NameComp label={"Employee"} labelStyle={styles.titleStyle} showColon={true} />
                <NameComp label={"Call"} labelStyle={styles.titleStyle} showColon={true} />
                <NameComp label={"TD"} labelStyle={styles.titleStyle} showColon={true} />
                <NameComp label={"V"} labelStyle={styles.titleStyle} showColon={true} />
                <NameComp label={"PB"} labelStyle={styles.titleStyle} showColon={true} />
                <NameComp label={"D"} labelStyle={styles.titleStyle} showColon={true} />
                <NameComp label={"Pending"} labelStyle={styles.titleStyle} showColon={true} />
            </View>
            <View style={{ width: "80%" }}>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => "Task" + index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {

                        return (
                            <View style={{ alignItems: "center", paddingHorizontal: 5 }}>
                                <NameComp label={item.sno} labelStyle={styles.dataTextStyle} />
                                <NameComp label={item.empName} labelStyle={styles.dataTextStyle} />
                                <NameComp label={item.call} labelStyle={styles.dataTextStyle} />
                                <NameComp label={item.td} labelStyle={styles.dataTextStyle} />
                                <NameComp label={item.v} labelStyle={styles.dataTextStyle} />
                                <NameComp label={item.pb} labelStyle={styles.dataTextStyle} />
                                <NameComp label={item.d} labelStyle={styles.dataTextStyle} />
                                <NameComp label={item.pending} labelStyle={styles.dataTextStyle} />
                            </View>
                        )
                    }}
                />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        paddingVertical: 10
    },
    textStyle: {
        fontSize: 10,
        fontWeight: "400",
        paddingTop: 3,
    },
    titleStyle: {
        width: 60,
        paddingLeft: 5,
        color: Colors.GRAY
    },
    dataTextStyle: {
        maxWidth: 65
    }
})