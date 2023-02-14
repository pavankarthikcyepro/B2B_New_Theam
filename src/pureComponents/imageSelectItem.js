import React from "react";
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Colors } from '../styles';
import { IconButton } from 'react-native-paper';

const ImageSelectItem = ({ name, onPress, disabled = false }) => {
    return (
        <TouchableOpacity onPress={() => {
            if(!disabled){
                onPress()
            }
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text disabled={true} style={{ fontSize: 14, fontWeight: '400', color: disabled ? Colors.GRAY : Colors.BLUE }}>{name}</Text>
                <IconButton
                    disabled={disabled}
                    icon={'file-upload'}
                    color={Colors.GRAY}
                    size={20}
                    style={{ paddingRight: 0 }}
                />
            </View>
        </TouchableOpacity>
    )
}

export { ImageSelectItem };