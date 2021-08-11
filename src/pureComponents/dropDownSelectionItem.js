import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../styles';

export const DropDownSelectionItem = ({ label, value, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <View style={{ height: 65, backgroundColor: Colors.WHITE, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 12, marginLeft: 15, fontWeight: '400', color: Colors.GRAY }}>{value ? label : ""}</Text>
                <View style={styles.view3}>
                    <Text style={[styles.text3, { color: value ? Colors.BLACK : Colors.GRAY }]}>{value ? value : label}</Text>
                    <IconButton
                        icon="menu-down"
                        color={Colors.BLACK}
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
    view3: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
    text3: {
        paddingLeft: 15,
        fontSize: 16,
        fontWeight: '400',
        color: Colors.GRAY
    },
})