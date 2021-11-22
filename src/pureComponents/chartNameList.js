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
                    <View style={{ paddingRight: 5, paddingVertical: 5, overflow: "hidden" }}>
                        <View style={{ flexDirection: "row", width: itemWidth, alignItems: "center", overflow: "hidden" }}>
                            <View style={{ width: 15, height: 15, backgroundColor: item.color }}></View>
                            <Text style={{ fontSize: 10, fontWeight: "600", paddingLeft: 3 }} numberOfLines={1}>{item.name}</Text>
                        </View>
                    </View>
                )
            }}
        />
    )
}