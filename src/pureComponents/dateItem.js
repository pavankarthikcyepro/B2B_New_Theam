import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, GlobalStyle } from '../styles'

export const DateItem = ({ month, date, day, selected = false }) => {

    const textColor = selected ? Colors.RED : Colors.GRAY;
    const shadow = selected ? GlobalStyle.shadow : {};

    return (
        <View style={[styles.conatiner, { borderColor: textColor, ...shadow }]}>
            <Text style={[styles.text1, { color: textColor }]}>{month}</Text>
            <Text style={[styles.text1, { color: textColor }]}>{date}</Text>
            <Text style={[styles.text2, { color: textColor }]}>{day}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: Colors.WHITE
    },
    text1: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    text2: {
        fontSize: 12,
        fontWeight: '400'
    }
})