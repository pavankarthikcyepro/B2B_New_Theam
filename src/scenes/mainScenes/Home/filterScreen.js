
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
import {
    updateFilterDropDownData,
    getLeadSourceTableList,
    getVehicleModelTableList,
    getEventTableList,
    getTaskTableList,
    getLostDropChartData
} from '../../../redux/homeReducer';

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 100) / 2;
const dateFormat = "YYYY-MM-DD";

const tempData = {
    "Level1": {
        "sublevels": [
            {
                "id": 261,
                "cananicalName": "Asia",
                "code": "Asia",
                "name": "Asia",
                "parentId": "0",
                "type": "Level1",
                "refParentId": "0",
                "orgId": 1,
                "active": "Y",
                "locationNodeDefId": 169,
                "childs": null,
                "disabled": "Y",
                "order": 1
            }
        ]
    },
    "Level2": {
        "sublevels": [
            {
                "id": 262,
                "cananicalName": "Asia/India",
                "code": "India",
                "name": "India",
                "parentId": "261",
                "type": "Level2",
                "refParentId": "261",
                "orgId": 1,
                "active": "Y",
                "locationNodeDefId": 170,
                "childs": null,
                "disabled": "Y",
                "order": 2
            },
            {
                "id": 266,
                "cananicalName": "Asia/Japan",
                "code": "Japan",
                "name": "Japan",
                "parentId": "261",
                "type": "Level2",
                "refParentId": "261",
                "orgId": 1,
                "active": "Y",
                "locationNodeDefId": 170,
                "childs": null,
                "disabled": "Y",
                "order": 2
            }
        ]
    },
    "Level3": {
        "sublevels": [
            {
                "id": 263,
                "cananicalName": "Asia/India/Telangana",
                "code": "Telangana",
                "name": "Telangana",
                "parentId": "262",
                "type": "Level3",
                "refParentId": "262",
                "orgId": 1,
                "active": "Y",
                "locationNodeDefId": 171,
                "childs": null,
                "disabled": "Y",
                "order": 3
            },
            {
                "id": 267,
                "cananicalName": "Asia/Japan/Tokyo",
                "code": "Tokyo",
                "name": "Tokyo",
                "parentId": "266",
                "type": "Level3",
                "refParentId": "266",
                "orgId": 1,
                "active": "Y",
                "locationNodeDefId": 171,
                "childs": null,
                "disabled": "Y",
                "order": 3
            }
        ]
    },
    "Level4": {
        "sublevels": [
            {
                "id": 264,
                "cananicalName": "Asia/India/Telangana/Hyderabad",
                "code": "Hyderabad",
                "name": "Hyderabad",
                "parentId": "263",
                "type": "Level4",
                "refParentId": "263",
                "orgId": 1,
                "active": "Y",
                "locationNodeDefId": 172,
                "childs": null,
                "disabled": "Y",
                "order": 4
            }
        ]
    },
    "Level5": {
        "sublevels": [
            {
                "id": 265,
                "cananicalName": "Asia/India/Telangana/Hyderabad/500089",
                "code": "500089",
                "name": "Manikonda",
                "parentId": "264",
                "type": "Level5",
                "refParentId": "264",
                "orgId": 1,
                "active": "Y",
                "locationNodeDefId": 173,
                "childs": null,
                "disabled": "Y",
                "order": 5
            }
        ]
    }
}

const FilterScreen = ({ navigation }) => {

    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();

    const [totalDataObj, setTotalDataObj] = useState([]);
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dropDownData, setDropDownData] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [nameKeyList, setNameKeyList] = useState([]);
    const [employeeId, setEmployeeId] = useState("");

    useEffect(() => {
        getAsyncData();
    }, [])

    const getAsyncData = async (startDate, endDate) => {
        let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
        if (empId) {
            setEmployeeId(empId);
        }
    }

    useEffect(() => {
        if (selector.filter_drop_down_data) {
            let names = [];
            for (let key in selector.filter_drop_down_data) {
                names.push(key);
            }
            setNameKeyList(names);
            setTotalDataObj(selector.filter_drop_down_data);
        }

        const currentDate = moment().format(dateFormat)
        const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        setFromDate(monthFirstDate);
        setToDate(monthLastDate);
    }, [selector.filter_drop_down_data])

    const dropDownItemClicked = (index) => {

        const data = totalDataObj[nameKeyList[index]].sublevels;
        setDropDownData([...data])
        setSelectedItemIndex(index);
        setShowDropDownModel(true);
    }

    const updateSelectedItems = (data, index) => {

        console.log("index: ", index)

        const totalDataObjLocal = { ...totalDataObj };
        if (index > 0) {
            let selectedParendIds = [];
            let unselectedParentIds = [];
            data.forEach((item) => {
                if (item.selected != undefined && item.selected == true) {
                    selectedParendIds.push(Number(item.parentId));
                } else {
                    unselectedParentIds.push(Number(item.parentId));
                }
            })

            let localIndex = index - 1;

            for (localIndex; localIndex >= 0; localIndex--) {

                let selectedNewParentIds = [];
                let unselectedNewParentIds = [];

                let key = nameKeyList[localIndex];
                const dataArray = totalDataObjLocal[key].sublevels;

                if (dataArray.length > 0) {
                    const newDataArry = dataArray.map((subItem, index) => {
                        const obj = { ...subItem };
                        if (selectedParendIds.includes(Number(obj.id))) {
                            obj.selected = true;
                            selectedNewParentIds.push(Number(obj.parentId));
                        }
                        else if (unselectedParentIds.includes(Number(obj.id))) {
                            if (obj.selected == undefined) {
                                obj.selected = false;
                            }
                            unselectedNewParentIds.push(Number(obj.parentId));
                        }
                        return obj;
                    })
                    const newOBJ = {
                        "sublevels": newDataArry
                    }
                    totalDataObjLocal[key] = newOBJ;
                }
                selectedParendIds = selectedNewParentIds;
                unselectedParentIds = unselectedNewParentIds;
            }
        }

        let localIndex2 = index + 1;
        for (localIndex2; localIndex2 < nameKeyList.length; localIndex2++) {

            let key = nameKeyList[localIndex2];
            const dataArray = totalDataObjLocal[key].sublevels;
            if (dataArray.length > 0) {
                const newDataArry = dataArray.map((subItem, index) => {
                    const obj = { ...subItem };
                    obj.selected = false;
                    return obj;
                })
                const newOBJ = {
                    "sublevels": newDataArry
                }
                totalDataObjLocal[key] = newOBJ;
            }
        }

        let key = nameKeyList[index];
        const newOBJ = {
            "sublevels": data
        }
        totalDataObjLocal[key] = newOBJ;
        // console.log("totalDataObjLocal: ", JSON.stringify(totalDataObjLocal));
        setTotalDataObj({ ...totalDataObjLocal });
    }

    const clearBtnClicked = () => {

        const totalDataObjLocal = { ...totalDataObj };
        let i = 0;
        for (i; i < nameKeyList.length; i++) {

            let key = nameKeyList[i];
            const dataArray = totalDataObjLocal[key].sublevels;
            if (dataArray.length > 0) {
                const newDataArry = dataArray.map((subItem, index) => {
                    const obj = { ...subItem };
                    obj.selected = false;
                    return obj;
                })
                const newOBJ = {
                    "sublevels": newDataArry
                }
                totalDataObjLocal[key] = newOBJ;
            }
        }
        setTotalDataObj({ ...totalDataObjLocal });
    }

    const submitBtnClicked = () => {

        let i = 0;
        const selectedIds = [];
        for (i; i < nameKeyList.length; i++) {
            let key = nameKeyList[i];
            const dataArray = totalDataObj[key].sublevels;
            if (dataArray.length > 0) {
                dataArray.forEach((item, index) => {
                    if (item.selected != undefined && item.selected == true) {
                        selectedIds.push(item.id)
                    }
                })
            }
        }
        // console.log("selectedIds: ", selectedIds);
        getDashboadTableDataFromServer(selectedIds);
    }

    const getDashboadTableDataFromServer = (selectedIds) => {

        const payload = {
            "startDate": fromDate,
            "endDate": toDate,
            "loggedInEmpId": employeeId,
            "levelSelected": selectedIds
        }
        dispatch(getLeadSourceTableList(payload));
        dispatch(getVehicleModelTableList(payload));
        dispatch(getEventTableList(payload));
        dispatch(getLostDropChartData(payload));
        getTaskTableDataFromServer(employeeId, payload);
        dispatch(updateFilterDropDownData(totalDataObj))
        navigation.goBack();
    }

    const getTaskTableDataFromServer = (oldPayload) => {

        const payload = {
            ...oldPayload,
            "pageNo": 0,
            "size": 10
        }
        dispatch(getTaskTableList(payload));
    }

    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format(dateFormat);
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

                            const data = totalDataObj[item].sublevels;
                            let selectedNames = "";
                            data.forEach((obj, index) => {
                                if (obj.selected != undefined && obj.selected == true) {
                                    selectedNames += obj.name + ", "
                                }
                            })

                            if (selectedNames.length > 0) {
                                selectedNames = selectedNames.slice(0, selectedNames.length - 1);
                            }

                            return (
                                <View>
                                    <DropDownSelectionItem
                                        label={item}
                                        value={selectedNames}
                                        onPress={() => dropDownItemClicked(index)}
                                    />
                                </View>
                            )
                        }}
                    />
                </View>
                <View style={styles.submitBtnBckVw}>
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
                        Submit
                    </Button>
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
    submitBtnBckVw: {
        width: "100%",
        height: 70,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    }
});