import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles'

const NameComp = ({ label, value }) => {

    return (
        <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 5 }}>
            <Text style={styles.text1}>{label}</Text>
            <Text style={styles.text2}>{value}</Text>
        </View>
    )
}

export const MyTaskItem = ({ taskName, status, created, dmsLead, phone }) => {

    return (
        <View style={{ alignSelf: 'stretch' }}>
            <NameComp label={'Task Name   : '} value={taskName} />
            <NameComp label={'Task Status : '} value={status} />
            <NameComp label={'Created On  : '} value={created} />
            <NameComp label={'DMS Lead    : '} value={dmsLead} />
            <NameComp label={'Phone No    : '} value={phone} />
        </View>
    )
}

const styles = StyleSheet.create({
    text1: {
        color: Colors.GRAY,
        fontSize: 12,
        fontWeight: '400'
    },
    text2: {
        fontSize: 16,
        fontWeight: '400'
    }
})