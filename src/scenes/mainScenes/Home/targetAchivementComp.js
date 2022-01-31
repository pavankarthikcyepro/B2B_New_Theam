import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { GlobalStyle, Colors } from "../../../styles";

const dummydATA = [
    {
        title: "Enq",
        tValue: 80,
        aValue: 60,
        percentage: 77,
        balence: 18,
        ar: 2.06
    },
    {
        title: "TD",
        tValue: 80,
        aValue: 60,
        percentage: 77,
        balence: 18,
        ar: 2.06
    },
    {
        title: "HV",
        tValue: 80,
        aValue: 60,
        percentage: 77,
        balence: 18,
        ar: 2.06
    }
]

export const TargetAchivementComp = () => {

    return (
        <View style={styles.container}>
            <FlatList
                data={dummydATA}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {

                    return (
                        <View style={styles.itemBaseView}>
                            <View style={styles.subView1}>
                                <Text style={styles.titleStyle}>{item.title}</Text>
                                <View style={styles.verticleLine}></View>
                            </View>
                            <View style={styles.subView2}>
                                <Text style={styles.titleStyle}>{item.title}</Text>
                            </View>
                        </View>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    itemBaseView: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    titleStyle: {
        width: 40,
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center"
    },
    subView1: {
        flexDirection: "row",
        alignItems: "center"
    },
    subView2: {

    },
    verticleLine: {
        height: "100%",
        width: 1,
        backgroundColor: Colors.GRAY
    }
})