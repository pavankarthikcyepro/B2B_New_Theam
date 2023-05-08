import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../styles';

export const DateSelectItem = ({ label, value, disabled = false, onPress, iconsName = "calendar-range" }) => {
    return (
        <Pressable onPress={onPress} disabled={disabled}>
            <View style={styles.container}>
                <Text style={styles.label}>{value ? label : ""}</Text>
                <View style={[styles.view3]}>
                    <Text style={[styles.text3, { color: value ? (disabled ? Colors.GRAY : Colors.BLACK) : Colors.GRAY }]}>{value ? value : label}</Text>
                    <IconButton
                        icon={iconsName}
                        color={disabled ? Colors.GRAY : Colors.BLACK}
                        size={25}
                    />
                </View>
                <Text style={GlobalStyle.underline}></Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        backgroundColor: Colors.WHITE,
        justifyContent: 'flex-end'
    },
    label: {
        fontSize: 12,
        marginLeft: 12,
        fontWeight: '400',
        color: Colors.GRAY
    },
    view3: {
        maxWidth: '100%',
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
    text3: {
        paddingLeft: 12,
        fontSize: 16,
        fontWeight: '400',
        color: Colors.GRAY,
        maxWidth: "85%"
    },
})
