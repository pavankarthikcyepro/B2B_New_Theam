import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DatePickerComponent, DateRangeComp } from '../../../components';
import moment from 'moment';
import { Colors } from '../../../styles';

import { IconButton } from 'react-native-paper';

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").format(dateFormat)
const ClosedComplaintList = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");
    const fromDateRef = React.useRef(selectedFromDate);
    const toDateRef = React.useRef(selectedToDate);

    useEffect(() => {
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        setFromDateState(CurrentMonthFirstDate);
        setToDateState(currentMonthLastDate);
    
    }, [])
    

    const showDatePickerMethod = (key) => {
        setShowDatePicker(true);
        setDatePickerId(key);
    }

    const setFromDateState = date => {
        fromDateRef.current = date;
        setSelectedFromDate(date);
    }

    const setToDateState = date => {
        toDateRef.current = date;
        setSelectedToDate(date);
    }



    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "FROM_DATE":
                setFromDateState(formatDate);
                break;
            case "TO_DATE":
                setToDateState(formatDate);
                break;
        }
    }
    return (
        <SafeAreaView>
            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                maximumDate={new Date(currentDate.toString())}
                value={new Date()}
                onChange={(event, selectedDate) => {

                    setShowDatePicker(false);
                    if (Platform.OS === "android") {
                        if (selectedDate) {
                            updateSelectedDate(selectedDate, datePickerId);
                        }
                    } else {
                        updateSelectedDate(selectedDate, datePickerId);
                    }
                }}
                onRequestClose={() => setShowDatePicker(false)}
            />

            <View style={styles.view1}>
                <View style={{ width: "80%" }}>
                    <DateRangeComp
                        fromDate={selectedFromDate}
                        toDate={selectedToDate}
                        fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
                        toDateClicked={() => showDatePickerMethod("TO_DATE")}
                    />
                </View>
                <Pressable onPress={() => {}}>
                    <View style={styles.filterView}>
                        <Text style={styles.text1}>{"Filter"}</Text>
                        <IconButton
                            icon={"filter-outline"}
                            size={16}
                            color={Colors.RED}
                            style={{ margin: 0, padding: 0 }}
                        />
                    </View>
                </Pressable>
            </View>

        </SafeAreaView>
    )
}

export default ClosedComplaintList

const styles = StyleSheet.create({
    view1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        backgroundColor: Colors.WHITE,
    },
    filterView: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.BORDER_COLOR,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: Colors.WHITE,
        paddingLeft: 8,
        height: 50,
        justifyContent: "center",
    }, txt1: {
        width: "80%",
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontSize: 12,
        fontWeight: "600",
    },
    text1: {
        fontSize: 16,
        fontWeight: "400",
        color: Colors.RED,
    },
})