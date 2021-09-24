
import React from 'react';
import { View, Text, ActivityIndicator } from "react-native";
import { Colors } from '../styles';

export const EmptyListView = ({ title, isLoading = false }) => {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {isLoading ? <ActivityIndicator size="small" color={Colors.BLACK} /> :
                <Text style={{ fontSize: 14, fontWeight: "400", color: Colors.GRAY, textAlign: 'center' }}>{title}</Text>}
        </View>
    )
}