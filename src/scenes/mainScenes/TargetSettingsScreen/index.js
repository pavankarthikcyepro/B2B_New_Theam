
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Pressable, Alert, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { Colors, GlobalStyle } from '../../../styles';
import { IconButton, Card, Button } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER, SPEED } from '../../../assets/svg';
import { DateItem } from '../../../pureComponents/dateItem';
import { AppNavigator } from '../../../navigations';
import { DateModalComp } from "../../../components/dateModalComp";
import { getMenuList } from '../../../redux/homeReducer';
import { DashboardTopTabNavigator } from '../../../navigations/dashboardTopTabNavigator';
import { TargetSettingsTab } from '../../../navigations/targetSettingsTab';
import { HomeStackIdentifiers } from '../../../navigations/appNavigator';
import * as AsyncStore from '../../../asyncStore';
import moment from 'moment';
import { TargetAchivementComp } from './targetAchivementComp';
import { HeaderComp, DropDownComponant, DatePickerComponent } from '../../../components';
import { DateSelectItem, TargetDropdown, DateSelectItemForTargetSettings } from '../../../pureComponents';

import {
    getEmployeesActiveBranch,
    getEmployeesRolls,
    updateStartDate,
    updateEndDate,
    addTargetMapping,
    updateIsTeam,
    getAllTargetMapping,
    getEmployeesDropDownData
} from '../../../redux/targetSettingsReducer';

import {
    updateIsTeamPresent,
} from '../../../redux/homeReducer';

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 30) / 2;

const widthForBoxItem = (screenWidth - 30) / 3;
const dateFormat = "YYYY-MM-DD";

const BoxComp = ({ width, name, value, iconName, bgColor }) => {
    return (
        <View style={{ width: width, padding: 2 }}>
            <View style={[styles.boxView, { backgroundColor: bgColor }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton icon={iconName} size={12} color={Colors.WHITE} style={{ margin: 0, padding: 0 }} />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.WHITE }}>{value}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.WHITE }}>{name}</Text>
            </View>
        </View>
    )
}

const titleNames = ["Live Bookings", "Complaints", "Deliveries", "Loss In Revenue", "Pending Tasks"];
const iconNames = ["shopping", "account-supervisor", "currency-usd", "cart", "currency-usd"];
const colorNames = ["#85b1f4", "#f1ab48", "#79e069", "#e36e7a", "#5acce8"]


const TargetSettingsScreen = ({ route, navigation }) => {
    const homeSelector = useSelector((state) => state.homeReducer);
    const selector = useSelector((state) => state.targetSettingsReducer);
    const dispatch = useDispatch();
    const [salesDataAry, setSalesDataAry] = useState([]);
    const [selectedBranchName, setSelectedBranchName] = useState("");

    const [dropDownKey, setDropDownKey] = useState("");
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownData, setDropDownData] = useState(null);
    const [retailData, setRetailData] = useState(null);
    const [dealerRank, setDealerRank] = useState(null);
    const [dealerCount, setDealerCount] = useState(null);
    const [groupDealerRank, setGroupDealerRank] = useState(null);
    const [groupDealerCount, setGroupDealerCount] = useState(null);
    const [isTeamPresent, setIsTeamPresent] = useState(false);
    const [isTeam, setIsTeam] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [datePickerId, setDatePickerId] = useState("");

    useEffect(() => {

        

        const unsubscribe = navigation.addListener('focus', () => {
            initialTask()
        });

        return unsubscribe;
    }, [navigation]);

    const initialTask = async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        // console.log("$$$$$ LOGIN EMP:", employeeData);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                orgId: jsonObj.orgId,
                empId: jsonObj.empId,
            }

            const payload3 = {
                orgId: jsonObj.orgId,
                empId: jsonObj.empId,
                selectedIds: []
            }

            const payload2 = {
                "empId": jsonObj.empId,
                "pageNo": 1, 
                "size": 10
            }
            const dateFormat = "YYYY-MM-DD";
            const currentDate = moment().format(dateFormat)
            const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
            const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
            dispatch(updateStartDate(monthFirstDate))
            setFromDate(monthFirstDate);

            dispatch(updateEndDate(monthLastDate))
            setToDate(monthLastDate);

            if (jsonObj.roles.length > 0) {
                let rolesArr = [];
                console.log("ROLLS2:", jsonObj.roles);
                rolesArr = jsonObj.roles.filter((item) => {
                    return item === "Admin Prod" || item === "App Admin" || item === "Manager" || item === "TL" || item === "General Manager" || item === "branch manager" || item === "Testdrive_Manager"
                })
                if (rolesArr.length > 0) {
                    console.log("FOUND");
                    dispatch(updateIsTeamPresent(true))
                }
            }
            // console.log("$$$$$$$ PAYLOAD: ", payload2)
            Promise.all([
                dispatch(getEmployeesActiveBranch(payload)),
                dispatch(getEmployeesRolls(payload)),
                dispatch(getAllTargetMapping(payload2)),
            ]).then(() => {
                console.log('SUCCESS');
            });

            
        }
    }

    const showDropDownModelMethod = (key, headerText) => {
        Keyboard.dismiss();
        switch (key) {
            case "TARGET_MODEL":
                setDataForDropDown([
                    {
                        id: 1,
                        name: "Target 1",
                        isChecked: false,
                    },
                    {
                        id: 2,
                        name: "Target 2",
                        isChecked: false,
                    },
                    {
                        id: 3,
                        name: "Target 3",
                        isChecked: false,
                    },
                ]);
                break;
        }
        setDropDownKey(key);
        setDropDownTitle(headerText);
        setShowDropDownModel(true);
    };

    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "START_DATE":
                dispatch(updateStartDate(formatDate))
                setFromDate(formatDate);
                break;
            case "END_DATE":
                dispatch(updateEndDate(formatDate))
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
                headerTitle={dropDownTitle}
                data={dataForDropDown}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {
                    setShowDropDownModel(false);
                    setDropDownData({ key: dropDownKey, value: item.name, id: item.id })
                }}
            />
            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                value={new Date(Date.now())}
                onChange={(event, selectedDate) => {
                    console.log("date: ", selectedDate, moment(selectedDate).format(dateFormat));
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
            <HeaderComp
                // title={"Dashboard"}
                title={"Monthly Target Planning"}
                // branchName={selectedBranchName}
                menuClicked={() => navigation.openDrawer()}
                // branchClicked={() => moveToSelectBranch()}
            />
            <View style={{ flex: 1, padding: 10 }}>
                <FlatList
                    data={[1, 2, 3]}
                    listKey={"TOP_FLAT_LIST"}
                    keyExtractor={(item, index) => "TOP" + index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {

                        if (index === 0) {
                            return (
                                <>
                                    {homeSelector.isTeamPresent &&
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ width: '50%', justifyContent: 'center', flexDirection: 'row', borderColor: Colors.RED, borderWidth: 1, borderRadius: 5, height: 41, marginTop: 10, }}>
                                                <TouchableOpacity onPress={() => {
                                                    // setIsTeam(true)
                                                    dispatch(updateIsTeam(false))
                                                }} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: selector.isTeam ? Colors.WHITE : Colors.RED, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
                                                <Text style={{ fontSize: 16, color: selector.isTeam ? Colors.BLACK : Colors.WHITE, fontWeight: '600' }}>Self</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {
                                                    // setIsTeam(false)
                                                    dispatch(updateIsTeam(true))
                                                }} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: selector.isTeam ? Colors.RED : Colors.WHITE, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                                                <Text style={{ fontSize: 16, color: selector.isTeam ? Colors.WHITE : Colors.BLACK, fontWeight: '600' }}>Teams</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
                                </>
                            )
                        }
                        else if (index === 1) {
                            return (
                                <>
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingBottom: 20, paddingTop: 10, }}>
                                        <View style={{ width: "45%", }}>
                                            <DateSelectItemForTargetSettings
                                                label={"Start Date"}
                                                placeholder={"Set Target"}
                                                value={fromDate}
                                                onPress={() => showDatePickerMethod("START_DATE")}
                                            />
                                        </View>

                                        <View style={{ width: "45%",  }}>
                                            <DateSelectItemForTargetSettings
                                                label={"End Date"}
                                                placeholder={"Set Target"}
                                                value={toDate}
                                                onPress={() => showDatePickerMethod("END_DATE")}
                                            />
                                        </View>
                                    </View>
                                </>
                            )
                        }
                        else if (index === 2) {
                            return (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{
                                        width: '95%',
                                        minHeight: 400,
                                        // borderWidth: 1,
                                        shadowColor: Colors.DARK_GRAY,
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowRadius: 4,
                                        shadowOpacity: 0.5,
                                        elevation: 3,
                                        marginHorizontal: 20
                                    }}>
                                        <TargetSettingsTab />
                                    </View>
                                </View>
                            )
                        }
                    }}
                />
            </View>
            
        </SafeAreaView>
    );
};

export default TargetSettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: Colors.LIGHT_GRAY,
    },
    shadow: {
        //   overflow: 'hidden',
        borderRadius: 4,
        width: "100%",
        height: 250,
        shadowColor: Colors.DARK_GRAY,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 3,
        position: "relative",
    },
    text1: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.WHITE,
    },
    barVw: {
        backgroundColor: Colors.WHITE,
        width: 40,
        height: "70%",
        justifyContent: "center",
    },
    text2: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    text3: {
        fontSize: 18,
        fontWeight: "800",
    },
    dateVw: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.WHITE,
        marginBottom: 5,
        paddingLeft: 5,
        height: 50,
    },
    boxView: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.WHITE,
        paddingVertical: 5
    },

    performView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.WHITE,
        marginBottom: 5,
        // paddingLeft: 5,
        // height: 100,
        // backgroundColor: 'red'
    },

    rankView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // backgroundColor: Colors.WHITE,
        marginBottom: 5,
        paddingLeft: 3,
        height: 80,
        width: '100%',
    },
    rankIconBox: {
        height: 40,
        width: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#d2d2d2",
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    rankHeadingText: {
        fontSize: 10,
        fontWeight: "500"
    },
    rankText: {
        fontSize: 16,
        fontWeight: "700"
    },
    rankText2: {
        fontSize: 20,
        fontWeight: "700"
    },
    baseText: {
        fontSize: 10,
        fontWeight: "800"
    },
    rankBox: {
        paddingTop: 5,
        height: 80,
        width: '32%',
        // backgroundColor: 'red',
        marginRight: 10
    },
    rankBox2: {
        paddingTop: 5,
        height: 80,
        width: '30%',
        // backgroundColor: 'red',
        marginRight: 10
    },

    retailBox: {
        paddingTop: 5,
        height: 80,
        width: '20%',
        // backgroundColor: 'red',
        marginRight: 10,
        alignItems: 'flex-end'
    }
});
