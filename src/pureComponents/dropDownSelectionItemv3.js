import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../styles';

export const DropDownSelectionItemV3 = ({ label, value, onPress, disabled = false, takeMinHeight = false }) => {
    return (
        <Pressable onPress={onPress} disabled={disabled} style={styles.press}>
            <View style={[styles.container,]}>
                {/* <Text style={[styles.label, { fontSize: 14, }]}>{value ? label : ""}</Text> */}
                {/* <Text style={[styles.label, { fontSize: !takeMinHeight ? 10 : 10 ,marginTop:2}]}>{value ? "Select" : ""}</Text> */}
                <View style={[styles.view3]}>
                    <Text style={[styles.text3,]} numberOfLines={1}>{value ? value : label}</Text>
                    <IconButton
                        icon="menu-down"
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
        height: 25,
        backgroundColor: Colors.WHITE,
        justifyContent: 'flex-end',
        alignContent: "center",
        alignItems: "center",
    },
    label: {
        fontSize: 12,
        marginLeft: 12,
        fontWeight: '400',
        color: Colors.GRAY
    },
    view3: {
        width: '100%',
        height: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
    text3: {
        paddingLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.GRAY,
        maxWidth: "85%"
    },
    press: {
        padding: 10, alignContent: "center",
        alignItems: "center",
    }
})