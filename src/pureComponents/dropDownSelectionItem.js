import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../styles';

export const DropDownSelectionItem = ({ label, value, onPress, disabled = false }) => {
    return (
        <Pressable onPress={onPress} disabled={disabled}>
            <View style={styles.container}>
                <Text style={styles.label}>{value ? label : ""}</Text>
                <View style={[styles.view3, { paddingBottom: value ? 0 : 20 }]}>
                    <Text style={[styles.text3, { color: value ? (disabled ? Colors.GRAY : Colors.BLACK) : Colors.GRAY }]}>{value ? value : label}</Text>
                    <IconButton
                        icon="menu-down"
                        color={disabled ? Colors.GRAY : Colors.BLACK}
                        size={25}
                        onPress={() => { }}
                    />
                </View>
                <Text style={GlobalStyle.underline}></Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: { height: 65, backgroundColor: Colors.WHITE, justifyContent: 'flex-end' },
    label: { fontSize: 12, marginLeft: 12, fontWeight: '400', color: Colors.GRAY },
    view3: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
    text3: {
        paddingLeft: 12,
        fontSize: 16,
        fontWeight: '400',
        color: Colors.GRAY
    },
})