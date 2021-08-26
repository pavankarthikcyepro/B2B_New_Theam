import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../styles'
import { convertTimeStampToDateString } from "../utils/helperFunctions";

const NameComp = ({ label, value, labelStyle = {}, valueStyle = {} }) => {

    return (
        <View style={styles.bckVw}>
            <Text style={[styles.text1, labelStyle]}>{label}</Text>
            <Text style={[styles.text2, valueStyle]}>{":  " + value}</Text>
        </View>
    )
}

export const MyTaskItem = ({ taskName, status, created, dmsLead, phone }) => {

    const date = convertTimeStampToDateString(created);

    return (

        <View style={{ flex: 1 }}>
            <NameComp label={'Task Name'} value={taskName} valueStyle={{ fontSize: 16, fontWeight: '600' }} />
            <NameComp label={'DMS Lead'} value={dmsLead} />
            <NameComp label={'Phone No'} value={phone} />
            <NameComp label={'Created On'} value={date} valueStyle={{ fontSize: 14 }} />
            <View style={styles.bckVw}>
                <Text style={[styles.text1]}>{'Task Status'}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.text2]}>{":  "}</Text>
                    <Text style={[styles.text2, styles.text3]}>{status}</Text>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    text1: {
        color: Colors.GRAY,
        fontSize: 12,
        fontWeight: '400',
        width: 80
    },
    text2: {
        fontSize: 14,
        fontWeight: '400'
    },
    text3: {
        backgroundColor: Colors.RED,
        color: Colors.WHITE,
        paddingHorizontal: 5,
        paddingVertical: 2.5,
        borderRadius: 8,
    },
    bckVw: {
        flexDirection: "row",
        alignItems: 'center',
        height: 28
    }
})