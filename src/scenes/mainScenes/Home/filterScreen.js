
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Image, Pressable, ScrollView, ActivityIndicator } from 'react-native';
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
    getLostDropChartData,
    getTargetParametersData,
    getEmployeesDropDownData,
    getSalesData,
    getSalesComparisonData
} from '../../../redux/homeReducer';
import { showAlertMessage, showToast } from '../../../utils/toast';

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 100) / 2;
const dateFormat = "YYYY-MM-DD";

const AcitivityLoader = () => {
    return (
        <View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={"small"} color={Colors.GRAY} />
        </View>
    )
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
    const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "" })
    const [employeeTitleNameList, setEmloyeeTitleNameList] = useState([]);
    const [employeeDropDownDataLocal, setEmployeeDropDownDataLocal] = useState({});
    const [dropDownFrom, setDropDownFrom] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getAsyncData();
    }, [])

    const getAsyncData = async (startDate, endDate) => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName })
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

        const topRowSelectedIds = [];
        if (index > 0) {
            const topRowData = totalDataObj[nameKeyList[index - 1]].sublevels;
            topRowData.forEach((item) => {
                if (item.selected != undefined && item.selected === true) {
                    topRowSelectedIds.push(Number(item.id));
                }
            })
        }

        let data = [];
        if (topRowSelectedIds.length > 0) {
            const subLevels = totalDataObj[nameKeyList[index]].sublevels;
            subLevels.forEach((subItem) => {
                const obj = { ...subItem };
                obj.selected = false;
                if (topRowSelectedIds.includes(Number(subItem.parentId))) {
                    data.push(obj);
                }
            })
        }
        else {
            data = totalDataObj[nameKeyList[index]].sublevels
        }

        setDropDownData([...data])
        setSelectedItemIndex(index);
        setShowDropDownModel(true);
        setDropDownFrom("ORG_TABLE")
    }

    const dropDownItemClicked2 = (index) => {

        // const topRowSelectedIds = [];
        // if (index > 0) {
        //     const topRowData = employeeDropDownDataLocal[employeeTitleNameList[index]];
        //     topRowData.forEach((item) => {
        //         if (item.selected != undefined && item.selected === true) {
        //             topRowSelectedIds.push(Number(item.id));
        //         }
        //     })
        // }

        const data = employeeDropDownDataLocal[employeeTitleNameList[index]];
        setDropDownData([...data])
        setSelectedItemIndex(index);
        setShowDropDownModel(true);
        setDropDownFrom("EMPLOYEE_TABLE")
    }

    const updateSelectedItems = (data, index) => {

        // console.log("index: ", index)

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

    const updateSelectedItemsForEmployeeDropDown = (data, index) => {
        let key = employeeTitleNameList[index];
        const newTotalDataObjLocal = { ...employeeDropDownDataLocal };
        newTotalDataObjLocal[key] = data;
        setEmployeeDropDownDataLocal({ ...newTotalDataObjLocal });
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
        if (selectedIds.length > 0) {
            setIsLoading(true);
            getDashboadTableDataFromServer(selectedIds, "LEVEL");
        } else {
            showToast("Please select any value")
        }
    }

    const getDashboadTableDataFromServer = (selectedIds, from) => {

        const payload = {
            "startDate": fromDate,
            "endDate": toDate,
            "loggedInEmpId": userData.employeeId,
        }
        if (from == "LEVEL") {
            payload["levelSelected"] = selectedIds;
        } else {
            payload["empSelected"] = selectedIds;
        }

        const payload2 = {
            ...payload,
            "pageNo": 0,
            "size": 5
        }

        const payload1 = {
            orgId: userData.orgId,
            empId: userData.employeeId,
            selectedIds: selectedIds
        }

        // console.log("PAYLOAD 1:", payload1);
        Promise.all([
            dispatch(getEmployeesDropDownData(payload1))
        ]).then(() => {
            console.log("CALLED");
            Promise.all([
                dispatch(getLeadSourceTableList(payload)),
                dispatch(getVehicleModelTableList(payload)),
                dispatch(getEventTableList(payload)),
                dispatch(getLostDropChartData(payload)),
                dispatch(updateFilterDropDownData(totalDataObj)),
                // // Table Data
                dispatch(getTaskTableList(payload2)),
                dispatch(getSalesData(payload2)),
                dispatch(getSalesComparisonData(payload2)),
                // // Target Params Data
                dispatch(getTargetParametersData(payload2))
            ]).then(() => {
                console.log("SUCCESS");
            }).catch(() => {

            })
        }).catch(() => {
            
        })
        if (from == "EMPLOYEE") {
            navigation.goBack();
        }
        else{
            navigation.goBack();
        }
    }

    useEffect(() => {
        if (selector.employees_drop_down_data) {
            let names = [];
            let newDataObj = {};
            for (let key in selector.employees_drop_down_data) {
                names.push(key);
                const arrayData = selector.employees_drop_down_data[key];
                const newArray = [];
                if (arrayData.length > 0) {
                    arrayData.forEach((element) => {
                        newArray.push({
                            ...element,
                            id: element.code,
                            selected: false
                        })
                    })
                }
                newDataObj[key] = newArray;
            }
            setEmloyeeTitleNameList(names);
            setEmployeeDropDownDataLocal(newDataObj);
        }
        setIsLoading(false);
    }, [selector.employees_drop_down_data])

    const clearBtnForEmployeeData = () => {
        let newDataObj = {};
        for (let key in employeeDropDownDataLocal) {
            const arrayData = employeeDropDownDataLocal[key];
            const newArray = [];
            if (arrayData.length > 0) {
                arrayData.forEach((element) => {
                    newArray.push({
                        ...element,
                        selected: false
                    })
                })
            }
            newDataObj[key] = newArray;
        }
        setEmployeeDropDownDataLocal(newDataObj);
    }

    const submitBtnForEmployeeData = () => {
        let selectedIds = [];
        for (let key in employeeDropDownDataLocal) {
            const arrayData = employeeDropDownDataLocal[key];
            arrayData.forEach((element) => {
                if (element.selected === true) {
                    selectedIds.push(element.code);
                }
            })
        }
        // console.log("selectedIds: ", selectedIds);
        if (selectedIds.length > 0) {
            getDashboadTableDataFromServer(selectedIds, "EMPLOYEE");
        }
        else {
            showToast("Please select any value")
        }
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
                    if (dropDownFrom === "ORG_TABLE") {
                        updateSelectedItems(item, selectedItemIndex);
                    } else {
                        updateSelectedItemsForEmployeeDropDown(item, selectedItemIndex);
                    }
                    setShowDropDownModel(false);
                }}
            />
            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                value={new Date(Date.now())}
                onChange={(event, selectedDate) => {
                    // console.log("date: ", selectedDate);
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

            <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 10, backgroundColor: Colors.WHITE }}>

                <FlatList
                    data={[1, 2]}
                    keyExtractor={(item, index) => "MAIN" + index.toString()}
                    renderItem={({ item, index }) => {

                        if (index === 0) {
                            return (
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
                            )
                        }
                        else if (index === 1) {
                            return (
                                <View>
                                    <View style={{ borderColor: Colors.BORDER_COLOR, borderWidth: 1 }}>
                                        <FlatList
                                            data={nameKeyList}
                                            listKey='ORG_TABLE'
                                            scrollEnabled={false}
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
                                                            takeMinHeight={true}
                                                        />
                                                    </View>
                                                )
                                            }}
                                        />
                                    </View>
                                    {!isLoading ? (
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
                                    ) : <AcitivityLoader />}
                                </View>
                            )
                        }
                        else if (index === 2) {
                            return (
                                <View>
                                    {employeeTitleNameList.length > 0 && (
                                        <View>
                                            <View style={{ borderColor: Colors.BORDER_COLOR, borderWidth: 1 }}>
                                                <FlatList
                                                    data={employeeTitleNameList}
                                                    listKey='EMPLOYEE_TABLE'
                                                    keyExtractor={(item, index) => "EMP_" + index.toString()}
                                                    scrollEnabled={false}
                                                    renderItem={({ item, index }) => {

                                                        const data = employeeDropDownDataLocal[item];
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
                                                                    onPress={() => dropDownItemClicked2(index)}
                                                                    takeMinHeight={true}
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
                                                    onPress={clearBtnForEmployeeData}
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
                                                    onPress={submitBtnForEmployeeData}
                                                >
                                                    Submit
                                                </Button>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )
                        }
                    }}
                />
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