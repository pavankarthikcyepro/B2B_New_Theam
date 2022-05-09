import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../styles';

export const DateSelectItemForTargetSettings = ({ placeholder, label, value, disabled = false, onPress }) => {
    return (
        <Pressable onPress={onPress} disabled={disabled}>
            <View style={styles.container}>
                <View style={{marginBottom: 5}}>
                    <Text style={styles.label}>{label}</Text>
                </View>
                <View style={[styles.view3,]}>
                    <Text style={[styles.text3, { color: value ? (disabled ? Colors.GRAY : Colors.BLACK) : Colors.GRAY }]}>{value ? value : placeholder}</Text>
                    <IconButton
                        icon="calendar-range"
                        color={Colors.RED}
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
        height: 65,
        backgroundColor: Colors.WHITE,
        justifyContent: 'flex-end',
        
    },
    label: {
        fontSize: 14,
        marginLeft: 0,
        fontWeight: '600',
        color: '#1D1D1F'
    },
    view3: {
        maxWidth: '100%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        borderColor: '#1D1D1F',
        borderWidth: 1, borderRadius: 5
    },
    text3: {
        paddingLeft: 12,
        fontSize: 16,
        fontWeight: '400',
        color: Colors.GRAY,
        maxWidth: "85%"
    },
})