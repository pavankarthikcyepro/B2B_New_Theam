
import React from 'react';
import { View, Text } from "react-native";
import { Colors } from '../styles';

export const EmptyListView = ({ title }) => {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: "400", color: Colors.GRAY, textAlign: 'center' }}>{title}</Text>
        </View>
    )
}