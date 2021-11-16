
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable } from 'react-native';
import { Colors } from '../../../styles';
import { IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { } from '../../../redux/homeReducer';
import * as AsyncStore from '../../../asyncStore';
import { DatePickerComponent, DropDownComponant } from '../../../components';
import { DateSelectItem, DropDownSelectionItem } from '../../../pureComponents';
import moment from 'moment';
import { Button } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 100) / 2;
const dateFormat = "YYYY-MM-DD";

const FilterScreen = ({ navigation }) => {

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();

    const [tableData, setTableData] = useState([]);
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dropDownData, setDropDownData] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState([]);
    const [value, setValue] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [nameKeyList, setNameKeyList] = useState([]);

    useEffect(() => {
        if (selector.filter_drop_down_data) {
            let names = [];
            for (let key in selector.filter_drop_down_data) {
                names.push(key);
            }
            setNameKeyList(names);
        }

        const currentDate = moment().format(dateFormat)
        const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        setFromDate(monthFirstDate);
        setToDate(monthLastDate);
    }, [])

    const dropDownItemClicked = (index) => {

        const data = selector.filter_drop_down_data[nameKeyList[index]].sublevels;
        setDropDownData([...data])
        setSelectedItemIndex(index);
        setShowDropDownModel(true);
    }

    const updateSelectedItems = (item, index) => {

        if (item.length > 0) {
            const data = selector.filter_drop_down_data[nameKeyList[index]].sublevels;

        }
    }

    const clearBtnClicked = () => {

    }

    const submitBtnClicked = () => {

    }

    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format("MM-DD-YYYY");
        switch (key) {
            case "FROM_DATE":
                setFromDate(formatDate);
                break;
            case "TO_DATE":
                setToDate(formatDate);
                break;
        }
    }

    const showDatePickerMethod = (key) => {

        setShowDatePicker(true);
        setDatePickerId(key);
    }

    return (
        <SafeAreaView style={styles.container}>

            <DropDownComponant
                visible={showDropDownModel}
                multiple={true}
                headerTitle={"Select"}
                data={dropDownData}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {
                    updateSelectedItems(item, selectedItemIndex);
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
                            updateSelectedDate(selectedDate, datePickerId);
                        }
                    } else {
                        updateSelectedDate(selectedDate, datePickerId);
                    }
                    setShowDatePicker(false)
                }}
                onRequestClose={() => setShowDatePicker(false)}
            />
            <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15, backgroundColor: Colors.WHITE }}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingBottom: 5, borderColor: Colors.BORDER_COLOR, borderWidth: 1 }}>
                    <View style={{ width: "48%" }}>
                        <DateSelectItem
                            label={"From Date"}
                            value={fromDate}
                            onPress={() => showDatePickerMethod("FROM_DATE")}
                        />
                    </View>

                    <View style={{ width: "48%" }}>
                        <DateSelectItem
                            label={"To Date"}
                            value={toDate}
                            onPress={() => showDatePickerMethod("TO_DATE")}
                        />
                    </View>
                </View>
                <View style={{ borderColor: Colors.BORDER_COLOR, borderWidth: 1 }}>
                    <FlatList
                        data={nameKeyList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {

                            return (
                                <View>
                                    <DropDownSelectionItem
                                        label={item}
                                        value={""}
                                        onPress={() => dropDownItemClicked(index)}
                                    />
                                </View>
                            )
                        }}
                    />
                </View>

            </View>
            <View style={styles.view3}>
                <Button
                    labelStyle={{ color: Colors.RED, textTransform: "none" }}
                    style={{ width: buttonWidth }}
                    mode="outlined"
                    onPress={clearBtnClicked}
                >
                    Clear
                </Button>
                <Button
                    labelStyle={{
                        color: Colors.WHITE,
                        textTransform: "none",
                    }}
                    style={{ width: buttonWidth }}
                    contentStyle={{ backgroundColor: Colors.BLACK }}
                    mode="contained"
                    onPress={submitBtnClicked}
                >
                    Apply
                </Button>
            </View>
        </SafeAreaView>
    );
};

export default FilterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.LIGHT_GRAY,
    },
    view3: {
        width: "100%",
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
});