import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Colors, GlobalStyle } from '../styles';
import VectorImage from 'react-native-vector-image';
import { TODAY } from '../assets/svg';

export const TargetDropdown = ({ label, value, onPress, disabled = false, takeMinHeight = false }) => {
    return (
        <Pressable onPress={onPress} disabled={disabled}>
            <View style={[styles.container, { height: takeMinHeight == false ? 40 : 30 }]}>
                {/* <Text style={[styles.label, { fontSize: !takeMinHeight ? 12 : 10 }]}>{value ? label : ""}</Text> */}
                <View style={[styles.view3, { height: !takeMinHeight ? 38 : 30, }]}>
                    <View style={{width: '80%', flexDirection: 'row'}}>
                        <View style={{marginLeft: 10}}>
                            <VectorImage
                                width={20}
                                height={20}
                                source={TODAY}
                            // style={{ tintColor: Colors.DARK_GRAY }}
                            />
                        </View>
                        <Text style={[styles.text3, { color: value ? (disabled ? Colors.GRAY : Colors.BLACK) : Colors.GRAY, fontSize: !takeMinHeight ? 14 : 14 }]} numberOfLines={1}>{value ? value : label}</Text>
                    </View>
                    <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center', }}>
                        <IconButton
                            icon="menu-down"
                            color={disabled ? Colors.GRAY : Colors.RED}
                            size={25}
                        />
                    </View>
                </View>
                {/* <Text style={GlobalStyle.underline}></Text> */}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 25,
        marginTop: 10
    },
    label: {
        fontSize: 12,
        marginLeft: 12,
        fontWeight: '400',
        color: Colors.GRAY
    },
    view3: {
        width: '100%',
        height: 38,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        borderRadius: 25
    },
    text3: {
        paddingLeft: 12,
        fontSize: 16,
        fontWeight: '400',
        color: Colors.GRAY,
        maxWidth: "85%"
    },
})