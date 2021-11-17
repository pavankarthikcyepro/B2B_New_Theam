import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, Pressable } from "react-native";
import { Colors, GlobalStyle } from "../styles";
import { DropDownSelectionItem, DateSelectItem } from "../pureComponents";
import { DatePickerComponent, DropDownComponant } from ".";
import moment from "moment";
import { IconButton } from "react-native-paper";

export const NameComp = ({ label, labelStyle = {}, showColon = false }) => {

    return (
        <View style={{ height: 20, paddingRight: 2, flexDirection: 'row' }}>
            <Text style={[targetStyle.textStyle, labelStyle]} numberOfLines={1}>{label}</Text>
            {showColon ? <Text style={[targetStyle.textStyle]}>{":"}</Text> : null}
        </View>
    )
}

const DateAndDropDownSelectItem = ({ label, value, type = "DROP_DOWN", onPress }) => {
    return (
        <Pressable onPress={onPress} >
            <View style={{ height: 45, backgroundColor: Colors.WHITE, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 10, marginLeft: 5, fontWeight: '400', color: Colors.GRAY }}>{value ? label : ""}</Text>
                <View style={[targetStyle.view3, { marginBottom: value ? 0 : 10 }]}>
                    <Text style={[targetStyle.text3, { color: value ? Colors.BLACK : Colors.GRAY }]}>{value ? value : label}</Text>
                    <IconButton
                        icon={type == "DROP_DOWN" ? "menu-down" : "calendar-range"}
                        color={Colors.BLACK}
                        size={15}
                        style={{ padding: 0, margin: 0 }}
                    />
                </View>
                <Text style={GlobalStyle.underline}></Text>
            </View>
        </Pressable>
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
                <View style={{ width: "40%" }}>
                    <DateAndDropDownSelectItem
                        label={"Branch"}
                        value={value}
                        onPress={() => setShowDropDownModel(true)}
                    />
                </View>

                <View style={{ width: "40%" }}>
                    <DateAndDropDownSelectItem
                        label={"Date"}
                        type={"DATE"}
                        value={selctedDate}
                        onPress={() => setShowDatePicker(true)}
                    />
                    {/* <DateSelectItem
                        label={"Date"}
                        value={selctedDate}
                        onPress={() => setShowDatePicker(true)}
                    /> */}
                </View>
            </View>
            {/* <View style={{ height: 10 }}></View> */}
            <View style={{ width: "100%", flexDirection: "row" }}>
                <View style={{ width: "15%", flexDirection: "column", backgroundColor: Colors.WHITE, paddingLeft: 8 }}>
                    {titlesData.map((item, index) => {
                        return (
                            <NameComp key={index} label={item} labelStyle={targetStyle.titleStyle} showColon={true} />
                        )
                    })}
                </View>
                <View style={{ width: "85%" }}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => "Target" + index.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {

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
            </View>

        </View>
    )
}

export const targetStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        paddingVertical: 10
    },
    textStyle: {
        fontSize: 10,
        fontWeight: "400",
        paddingTop: 3,
    },
    titleStyle: {
        fontSize: 10,
        color: Colors.GRAY
    },
    dataTextStyle: {
        maxWidth: 60
    },
    view3: {
        maxWidth: '100%',
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.WHITE
    },
    text3: {
        paddingLeft: 5,
        fontSize: 12,
        fontWeight: '400',
        color: Colors.GRAY,
        maxWidth: "85%"
    },
})