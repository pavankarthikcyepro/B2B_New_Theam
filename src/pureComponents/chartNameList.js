import React from "react";
import { View, Text, FlatList } from "react-native";

export const ChartNameList = ({ data, itemWidth, }) => {

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            numColumns={4}
            horizontal={false}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
                return (
                    <View style={{ padding: 5 }}>
                        <View style={{ flexDirection: "row", width: itemWidth, alignItems: "center" }}>
                            <View style={{ width: 15, height: 15, backgroundColor: item.color }}></View>
                            <Text style={{ fontSize: 10, fontWeight: "600", paddingLeft: 5 }} numberOfLines={1}>{item.name}</Text>
                        </View>
                    </View>
                )
            }}
        />
    )
}