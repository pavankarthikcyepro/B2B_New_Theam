import React from "react";
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Colors } from '../styles';
import { IconButton } from 'react-native-paper';

const ImageSelectItem = ({ name, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '400', color: Colors.BLUE }}>{name}</Text>
                <IconButton
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