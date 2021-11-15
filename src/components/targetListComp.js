import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Colors } from "../styles";

const NameComp = ({ label, labelStyle = {}, showColon = false }) => {

    return (
        <View style={{ justifyContent: "center", height: 30, padding: 5, flexDirection: 'row' }}>
            <Text style={[styles.textStyle, labelStyle]} numberOfLines={1}>{label}</Text>
            {showColon ? <Text style={[styles.textStyle]}>{":"}</Text> : null}
        </View>
    )
}

export const TargetListComp = ({ data, titlesData }) => {

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => "Target" + index.toString()}
            horizontal={true}
            renderItem={({ item, index }) => {

                if (index === 0) {
                    return (
                        <View style={{}}>
                            {titlesData.map((item, index) => {
                                return (
                                    <NameComp key={index} label={item} labelStyle={styles.titleStyle} showColon={true} />
                                )
                            })}
                        </View>
                    )
                }

                return (
                    <View style={{ alignItems: "center", paddingHorizontal: 5 }}>
                        <NameComp label={item.sno} labelStyle={styles.dataTextStyle} />
                        <NameComp label={item.empName} labelStyle={styles.dataTextStyle} />
                        <NameComp label={item.call} labelStyle={styles.dataTextStyle} />
                        <NameComp label={item.td} labelStyle={styles.dataTextStyle} />
                        <NameComp label={item.v} labelStyle={styles.dataTextStyle} />
                        <NameComp label={item.pb} labelStyle={styles.dataTextStyle} />
                        <NameComp label={item.d} labelStyle={styles.dataTextStyle} />
                    </View>
                )
            }}
        />
    )
}

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
    },
    dataTextStyle: {
        maxWidth: 100
    }
})