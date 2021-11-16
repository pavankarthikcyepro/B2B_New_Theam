import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Colors } from "../styles";
import { DropDownSelectionItem, DateSelectItem } from "../pureComponents";
import { DatePickerComponent, DropDownComponant } from ".";
import moment from "moment";

export const NameComp = ({ label, labelStyle = {}, showColon = false }) => {

    return (
        <View style={{ justifyContent: "center", height: 30, padding: 5, flexDirection: 'row' }}>
            <Text style={[targetStyle.textStyle, labelStyle]} numberOfLines={1}>{label}</Text>
            {showColon ? <Text style={[targetStyle.textStyle]}>{":"}</Text> : null}
        </View>
    )
}

const dummyData = [
    {
        id: "1",
        name: "Test 1"
    },
    {
        id: "2",
        name: "Test 2"
    }
]

export const TargetListComp = ({ data, titlesData }) => {

    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [value, setValue] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selctedDate, setSelectedDate] = useState("");

    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format("MM-DD-YYYY");
        setSelectedDate(formatDate);
    }

    return (
        <View>
            <DropDownComponant
                visible={showDropDownModel}
                headerTitle={"Select"}
                data={dummyData}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {
                    setValue(item.name)
                    setShowDropDownModel(false);
                }}
            />
            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                value={new Date(Date.now())}
                onChange={(event, selectedDate) => {
                    console.log("date: ", selectedDate);
                    if (Platform.OS === "android") {
                        if (selectedDate) {
                            updateSelectedDate(selectedDate);
                        }
                    } else {
                        updateSelectedDate(selectedDate);
                    }
                    setShowDatePicker(false)
                }}
                onRequestClose={() => setShowDatePicker(false)}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 5, paddingBottom: 5, borderColor: Colors.BORDER_COLOR, borderWidth: 1 }}>
                <View style={{ width: "48%" }}>
                    <DropDownSelectionItem
                        label={"Branch"}
                        value={value}
                        onPress={() => setShowDropDownModel(true)}
                    />
                </View>

                <View style={{ width: "48%" }}>
                    <DateSelectItem
                        label={"Date"}
                        value={selctedDate}
                        onPress={() => setShowDatePicker(true)}
                    />
                </View>
            </View>
            <View style={{ height: 20 }}></View>
            <FlatList
                data={data}
                keyExtractor={(item, index) => "Target" + index.toString()}
                horizontal={true}
                renderItem={({ item, index }) => {

                    if (index === 0) {
                        return (
                            <View style={{}}>
                                {titlesData.map((item, index) => {
                                    return (
                                        <NameComp key={index} label={item} labelStyle={targetStyle.titleStyle} showColon={true} />
                                    )
                                })}
                            </View>
                        )
                    }

                    return (
                        <View style={{ alignItems: "center", paddingHorizontal: 5 }}>
                            <NameComp label={item.sno} labelStyle={targetStyle.dataTextStyle} />
                            <NameComp label={item.empName} labelStyle={targetStyle.dataTextStyle} />
                            <NameComp label={item.call} labelStyle={targetStyle.dataTextStyle} />
                            <NameComp label={item.td} labelStyle={targetStyle.dataTextStyle} />
                            <NameComp label={item.v} labelStyle={targetStyle.dataTextStyle} />
                            <NameComp label={item.pb} labelStyle={targetStyle.dataTextStyle} />
                            <NameComp label={item.d} labelStyle={targetStyle.dataTextStyle} />
                        </View>
                    )
                }}
            />
        </View>
    )
}

export const targetStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        paddingVertical: 10
    },
    textStyle: {
        fontSize: 14,
        fontWeight: "400",
        paddingTop: 5,
    },
    titleStyle: {
        width: 80,
        color: Colors.GRAY
    },
    dataTextStyle: {
        maxWidth: 100
    }
})