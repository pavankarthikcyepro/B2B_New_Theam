import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Pressable, Alert, TouchableOpacity, ScrollView, Keyboard, TextInput, Modal } from 'react-native';
import { Colors, GlobalStyle } from '../../../../styles';
import { IconButton, Card, Button } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER, SPEED } from '../../../assets/svg';
import { DateItem } from '../../../pureComponents/dateItem';
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from '../../../../asyncStore';
import { TargetDropdown } from "../../../../pureComponents";
import { Dropdown } from 'react-native-element-dropdown';
import { LoaderComponent } from '../../../../components';

import {
    getEmployeesDropDownData,
    addTargetMapping,
    getAllTargetMapping,
    editTargetMapping
} from '../../../../redux/targetSettingsReducer';
import {
    updateIsTeamPresent
} from '../../../../redux/homeReducer';
import { showToast, showToastRedAlert } from '../../../../utils/toast';
import { updateFuelAndTransmissionType } from '../../../../redux/preBookingFormReducer';

const color = [
    '#9f31bf', '#00b1ff', '#fb03b9', '#ffa239', '#d12a78', '#0800ff', '#1f93ab', '#ec3466'
]

const MainParamScreen = ({ route, navigation }) => {
    const selector = useSelector((state) => state.targetSettingsReducer);
    const homeSelector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();

    const [retailData, setRetailData] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [enqData, setEnqData] = useState(null);
    const [visitData, setVisitData] = useState(null);
    const [TDData, setTDData] = useState(null);
    const [dateDiff, setDateDiff] = useState(null);
    const [isTeamPresent, setIsTeamPresent] = useState(false);
    const [isTeam, setIsTeam] = useState(false);

    const [retail, setRetail] = useState("");
    const [openRetail, setOpenRetail] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [otherDropDownSelectedValue, setOtherDropDownSelectedValue] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loggedInEmpDetails, setLoggedInEmpDetails] = useState(null);
    const [ownData, setOwnData] = useState(null);
    const [isNoTargetAvailable, setIsNoTargetAvailable] = useState(false);
    const [addOrEdit, setAddOrEdit] = useState('');
    const [defaultBranch, setDefaultBranch] = useState(null);
    const [allOwnData, setAllOwnData] = useState(null);
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [targetName, setTargetName] = useState('');

    // const dropdownData = [
    //     { label: 'Item 1', value: '1' },
    //     { label: 'Item 2', value: '2' },
    //     { label: 'Item 3', value: '3' },
    //     { label: 'Item 4', value: '4' },
    //     { label: 'Item 5', value: '5' },
    //     { label: 'Item 6', value: '6' },
    //     { label: 'Item 7', value: '7' },
    //     { label: 'Item 8', value: '8' },
    // ];

    const [dropdownData, setDropdownData] = useState([]);
    const [employeeDropDownDataLocal, setEmployeeDropDownDataLocal] = useState([]);

    useEffect(async () => {
        navigation.addListener('focus', async () => {
            let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                jsonObj.employeeId = jsonObj.empId;
                setLoggedInEmpDetails(jsonObj)
            }
        })
    }, [navigation])

    useEffect(async () => {
        if (selector.activeBranches.length > 0) {
            let tempBranch = [];
            for (let i = 0; i < selector.activeBranches.length; i++) {
                tempBranch.push({ label: selector.activeBranches[i].name, value: selector.activeBranches[i].branch })
                if (i === selector.activeBranches.length - 1) {
                    setDropdownData(tempBranch)
                    setIsDataLoaded(true)
                }
            }
        } else {
        }
    }, [selector.activeBranches])

    useEffect(async () => {
        if (!selector.isTeam) {
            if (selector.targetMapping.length > 0 && loggedInEmpDetails !== null && selector.isDataLoaded) {
                let ownDataArray = [];
                if (selector.targetType === 'MONTHLY') {
                    ownDataArray = selector.targetMapping.filter((item) => {
                        // return Number(item.employeeId) === Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate
                        return Number(item.employeeId) === Number(loggedInEmpDetails?.empId)
                    })
                }
                else {
                    ownDataArray = selector.targetMapping.filter((item) => {
                        return Number(item.employeeId) === Number(loggedInEmpDetails?.empId)
                    })
                }
                console.log("TTT 1: ", JSON.stringify(ownDataArray));
                if (ownDataArray.length > 0) {
                    setAllOwnData(ownDataArray)
                    let ownDataArray2 = []
                    if (selector.targetType === 'MONTHLY') {
                        ownDataArray2 = ownDataArray.filter((item) => {
                            return selector.endDate === item.endDate && selector.startDate === item.startDate
                        })
                    }
                    else {
                        ownDataArray2 = ownDataArray.filter((item) => {
                            return selector.endDate === item.endDate && selector.startDate === item.startDate
                        })
                    }
                    console.log("TTT 2: ", JSON.stringify(ownDataArray2));
                    if (ownDataArray2.length > 0) {
                        setIsNoTargetAvailable(false)
                        setOwnData(ownDataArray2[0])
                        if (ownDataArray2[0]?.targetName) {
                            setTargetName(ownDataArray2[0]?.targetName)
                        }
                    }
                    else {
                        setTargetName('')
                        setIsNoTargetAvailable(true)
                        setOwnData({
                            "retailTarget": null,
                            "enquiry": null,
                            "testDrive": null,
                            "homeVisit": null,
                            "booking": null,
                            "exchange": null,
                            "finance": null,
                            "insurance": null,
                            "exWarranty": null,
                            "accessories": null,
                            "events": "10",
                            "startDate": selector.startDate,
                            "endDate": selector.endDate,
                            "empName": loggedInEmpDetails?.empName,
                            "employeeId": loggedInEmpDetails?.empId,
                        })
                    }
                }
                else {
                    setTargetName('')
                    setIsNoTargetAvailable(true)
                    setOwnData({
                        "retailTarget": null,
                        "enquiry": null,
                        "testDrive": null,
                        "homeVisit": null,
                        "booking": null,
                        "exchange": null,
                        "finance": null,
                        "insurance": null,
                        "exWarranty": null,
                        "accessories": null,
                        "events": null,
                        "startDate": selector.startDate,
                        "endDate": selector.endDate,
                        "empName": loggedInEmpDetails?.empName,
                        "employeeId": loggedInEmpDetails?.empId,
                    })
                }
            }
            if (selector.isDataLoaded && selector.targetMapping.length === 0) {
                setTargetName('')
                setIsNoTargetAvailable(true)
                setOwnData({
                    "retailTarget": null,
                    "enquiry": null,
                    "testDrive": null,
                    "homeVisit": null,
                    "booking": null,
                    "exchange": null,
                    "finance": null,
                    "insurance": null,
                    "exWarranty": null,
                    "accessories": null,
                    "events": null,
                    "startDate": selector.startDate,
                    "endDate": selector.endDate,
                    "empName": loggedInEmpDetails?.empName,
                    "employeeId": loggedInEmpDetails?.empId,
                })
            }
        }
        else {
            setTargetName('')
        }
    }, [selector.isTeam, selector.selectedMonth])

    useEffect(async () => {
        if (selector.targetMapping.length > 0 && loggedInEmpDetails !== null && selector.isDataLoaded) {
            let ownDataArray = [];
            if (selector.targetType === 'MONTHLY') {
                ownDataArray = selector.targetMapping.filter((item) => {
                    // return Number(item.employeeId) === Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate
                    return Number(item.employeeId) === Number(loggedInEmpDetails?.empId)
                })
            }
            else {
                ownDataArray = selector.targetMapping.filter((item) => {
                    return Number(item.employeeId) === Number(loggedInEmpDetails?.empId)
                })
            }
            console.log("TTT 1: ", JSON.stringify(ownDataArray));
            if (ownDataArray.length > 0) {
                setAllOwnData(ownDataArray)
                let ownDataArray2 = []
                if (selector.targetType === 'MONTHLY') {
                    ownDataArray2 = ownDataArray.filter((item) => {
                        return selector.endDate === item.endDate && selector.startDate === item.startDate
                    })
                }
                else {
                    ownDataArray2 = ownDataArray.filter((item) => {
                        return selector.endDate === item.endDate && selector.startDate === item.startDate
                    })
                }
                console.log("TTT 2: ", JSON.stringify(ownDataArray2));
                if (ownDataArray2.length > 0) {
                    setOwnData(ownDataArray2[0])
                    if (ownDataArray2[0]?.targetName) {
                        setTargetName(ownDataArray2[0]?.targetName)
                    }
                }
                else {
                    setIsNoTargetAvailable(true)
                    setOwnData({
                        "retailTarget": null,
                        "enquiry": null,
                        "testDrive": null,
                        "homeVisit": null,
                        "booking": null,
                        "exchange": null,
                        "finance": null,
                        "insurance": null,
                        "exWarranty": null,
                        "accessories": null,
                        "events": "10",
                        "startDate": selector.startDate,
                        "endDate": selector.endDate,
                        "empName": loggedInEmpDetails?.empName,
                        "employeeId": loggedInEmpDetails?.empId,
                    })
                }
            }
            else {
                setIsNoTargetAvailable(true)
                setOwnData({
                    "retailTarget": null,
                    "enquiry": null,
                    "testDrive": null,
                    "homeVisit": null,
                    "booking": null,
                    "exchange": null,
                    "finance": null,
                    "insurance": null,
                    "exWarranty": null,
                    "accessories": null,
                    "events": null,
                    "startDate": selector.startDate,
                    "endDate": selector.endDate,
                    "empName": loggedInEmpDetails?.empName,
                    "employeeId": loggedInEmpDetails?.empId,
                })
            }
        }
        if (selector.isDataLoaded && selector.targetMapping.length === 0) {
            setIsNoTargetAvailable(true)
            setOwnData({
                "retailTarget": null,
                "enquiry": null,
                "testDrive": null,
                "homeVisit": null,
                "booking": null,
                "exchange": null,
                "finance": null,
                "insurance": null,
                "exWarranty": null,
                "accessories": null,
                "events": null,
                "startDate": selector.startDate,
                "endDate": selector.endDate,
                "empName": loggedInEmpDetails?.empName,
                "employeeId": loggedInEmpDetails?.empId,
            })
        }
    }, [selector.targetMapping, loggedInEmpDetails, selector.isDataLoaded])

    useEffect(async () => {
        if (allOwnData) {
            let ownDataArray = [];
            if (selector.targetType === 'MONTHLY') {
                ownDataArray = allOwnData.filter((item) => {
                    return selector.endDate === item.endDate && selector.startDate === item.startDate
                })
            }
            else {
                ownDataArray = allOwnData.filter((item) => {
                    return selector.endDate === item.endDate && selector.startDate === item.startDate
                })
            }
            console.log("TTT: ", JSON.stringify(ownDataArray));
            if (ownDataArray.length > 0) {
                setOwnData(ownDataArray[0])
                if (ownDataArray[0]?.targetName) {
                    setTargetName(ownDataArray[0]?.targetName)
                }
            }
            else {
                setIsNoTargetAvailable(true)
                setOwnData({
                    "retailTarget": null,
                    "enquiry": null,
                    "testDrive": null,
                    "homeVisit": null,
                    "booking": null,
                    "exchange": null,
                    "finance": null,
                    "insurance": null,
                    "exWarranty": null,
                    "accessories": null,
                    "events": null,
                    "startDate": selector.startDate,
                    "endDate": selector.endDate,
                    "empName": loggedInEmpDetails?.empName,
                    "employeeId": loggedInEmpDetails?.empId,
                })
            }
        }

    }, [selector.selectedMonth])

    useEffect(async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        // console.log("$$$$$ LOGIN EMP:", employeeData);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData)
            const payload = {
                "empId": jsonObj.empId,
                "pageNo": 1,
                "size": 500,
                "targetType": selector.targetType
            }
            console.log("PAYLOAD", payload);
            //dispatch(getAllTargetMapping(payload))
        }
    }, [selector.targetType])

    const addTargetData = async () => {
        if (selectedBranch === null) {
            showToast("Please select branch")
        }
        else if (retail === '') {
            showToast("Please enter retail value")
        }
        else {
            console.log("CALLED ADD");
            setOpenRetail(false)
            let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                let payload = {
                    "branch": selectedBranch.value,
                    // "branchmangerId": otherDropDownSelectedValue.filter((item) => item.key === 'Managers').length > 0 ? otherDropDownSelectedValue.filter((item) => item.key === 'Managers')[0].value.value : '',
                    "employeeId": selectedUser?.employeeId,
                    "endDate": selector.endDate,
                    // "managerId": otherDropDownSelectedValue.filter((item) => item.key === 'Managers').length > 0 ? otherDropDownSelectedValue.filter((item) => item.key === 'Managers')[0].value.value : '',
                    "retailTarget": retail,
                    "startDate": selector.startDate,
                    // "teamLeadId": otherDropDownSelectedValue.filter((item) => item.key === 'Team Lead').length > 0 ? otherDropDownSelectedValue.filter((item) => item.key === 'Team Lead')[0].value.value : '',
                    "targetType": selector.targetType,
                    // "targetName": selector.targetType === 'MONTHLY' ? selector.selectedMonth.value : selector.selectedSpecial.keyId
                    "targetName": targetName !== '' ? targetName : (selector.targetType === 'MONTHLY' ? selector.selectedMonth.value : selector.selectedSpecial.keyId)
                }
                console.log("PAYLOAD:", payload);
                Promise.all([
                    dispatch(addTargetMapping(payload))
                ]).then(() => {
                    console.log('I did everything!');
                    setSelectedUser(null)
                    setRetail('')
                    setSelectedBranch(null)
                    setDefaultBranch(null)
                    setIsNoTargetAvailable(false)
                    const payload2 = {
                        "empId": jsonObj.empId,
                        "pageNo": 1,
                        "size": 500,
                        "targetType": selector.targetType
                    }
                    dispatch(getAllTargetMapping(payload2))
                });
            }
        }
    }

    const editTargetData = async () => {
        if (selectedBranch === null) {
            showToast("Please select branch")
        }
        else if (retail === '') {
            showToast("Please enter retail value")
        }
        else {
            console.log("CALLED EDIT");
            setOpenRetail(false)
            let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                let payload = {
                    "branch": selectedBranch.value,
                    // "branchmangerId": otherDropDownSelectedValue.filter((item) => item.key === 'Managers').length > 0 ? otherDropDownSelectedValue.filter((item) => item.key === 'Managers')[0].value.value : '',
                    "employeeId": selectedUser?.employeeId,
                    "endDate": selector.endDate,
                    // "managerId": otherDropDownSelectedValue.filter((item) => item.key === 'Managers').length > 0 ? otherDropDownSelectedValue.filter((item) => item.key === 'Managers')[0].value.value : '',
                    "retailTarget": retail,
                    "startDate": selector.startDate,
                    // "teamLeadId": otherDropDownSelectedValue.filter((item) => item.key === 'Team Lead').length > 0 ? otherDropDownSelectedValue.filter((item) => item.key === 'Team Lead')[0].value.value : '',
                    "targetType": selector.targetType,
                    // "targetName": selector.targetType === 'MONTHLY' ? selector.selectedMonth.value : selector.selectedSpecial.keyId
                    "targetName": targetName !== '' ? targetName : (selector.targetType === 'MONTHLY' ? selector.selectedMonth.value : selector.selectedSpecial.keyId)
                }

                console.log("PAYLOAD EDIT:", payload);
                Promise.all([
                    dispatch(editTargetMapping(payload))
                ]).then(() => {
                    setSelectedUser(null)
                    setRetail('')
                    setSelectedBranch(null)
                    setDefaultBranch(null)
                    setIsNoTargetAvailable(false)
                    console.log('I did everything!');
                    const payload2 = {
                        "empId": jsonObj.empId,
                        "pageNo": 1,
                        "size": 500,
                        "targetType": selector.targetType
                    }
                    dispatch(getAllTargetMapping(payload2))
                });
            }
        }
    }

    const getTotal = (key) => {
        let total = 0;
        for (let i = 0; i < selector.targetMapping.length; i++) {
            // console.log("RTRTRTRTRTR:", selector.targetMapping[i], selector.endDate, selector.startDate, selector.targetType);
            if (selector.targetMapping[i][key] !== null && selector.endDate === selector.targetMapping[i].endDate && selector.startDate === selector.targetMapping[i].startDate && selector.targetMapping[i].targetType === selector.targetType) {
                total += parseInt(selector.targetMapping[i][key])
            }
            if (i === selector.targetMapping.length - 1) {
                return total;
            }
        }
    }

    useEffect(() => {
        if (selector.employees_drop_down_data) {
            let names = [];
            let newDataList = [];
            for (let key in selector.employees_drop_down_data) {
                names.push(key);
                const arrayData = selector.employees_drop_down_data[key];
                const newArray = [];
                if (arrayData.length > 0) {
                    arrayData.forEach((element) => {
                        newArray.push({
                            ...element,
                            label: element.name,
                            value: element.code
                        })
                    })
                }
                newDataList.push({
                    title: key,
                    data: newArray
                })
            }
            setEmployeeDropDownDataLocal(newDataList);
        }
    }, [selector.employees_drop_down_data])

    return (
        <>
            {loggedInEmpDetails !== null && (homeSelector.isTeamPresent && selector.isTeam) &&
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '30%', }}>
                        <View style={{ height: 35, }}></View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: 'blue' }]}>Retail</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text]}>Enquiry</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Booking</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Test Drive</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Visit</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Finance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Insurance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Accessories</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Exchange</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Extended Warranty</Text>
                        </View>
                        {/* <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#00b1ff' }]}>Enquiry</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#fb03b9' }]}>Booking</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#ffa239' }]}>Test Drive</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#d12a78' }]}>Visit</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#00b1ff' }]}>Finance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#1f93ab' }]}>Insurance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#ec3466' }]}>Accessories</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#fb03b9' }]}>Exchange</Text>
                        </View> */}
                    </View>
                    <ScrollView style={{ width: '100%' }} contentContainerStyle={{ flexDirection: 'column' }} showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false} horizontal={true}>
                        <View style={styles.nameWrap}>
                            <View style={styles.nameBox} >
                                <Text style={styles.text}>Team Total</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.nameBox}>
                                                    <Text style={styles.text} numberOfLines={1}>{item.empName}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <TouchableOpacity style={styles.textBox}>
                                <Text style={styles.textInput}>{getTotal('retailTarget')}</Text>
                            </TouchableOpacity>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <TouchableOpacity style={styles.textBox} onPress={() => {
                                                    if (item.retailTarget !== null && selector.endDate === item.endDate && selector.startDate === item.startDate) {
                                                        setSelectedBranch({ label: item.branchName, value: item.branch })
                                                        setDefaultBranch(Number(item.branch))
                                                        setAddOrEdit('E')
                                                    }
                                                    else {
                                                        setAddOrEdit('A')
                                                    }
                                                    if (item?.targetName) {
                                                        setTargetName(item?.targetName)
                                                    }
                                                    setIsNoTargetAvailable(false)
                                                    setRetail((item.retailTarget !== null && selector.endDate === item.endDate && selector.startDate === item.startDate) ? item.retailTarget : 0)
                                                    setSelectedUser(item)

                                                    setOpenRetail(true)
                                                }}>
                                                    <Text style={styles.textInput}>{item.retailTarget !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.retailTarget : 0}</Text>
                                                </TouchableOpacity>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('enquiry')}</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.textBox2}>
                                                    <Text style={styles.textInput}>{item.enquiry !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.enquiry : 0}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('booking')}</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.textBox2}>
                                                    <Text style={styles.textInput}>{item.booking !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.booking : 0}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('testDrive')}</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.textBox2}>
                                                    <Text style={styles.textInput}>{item.testDrive !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.testDrive : 0}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>



                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('homeVisit')}</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.textBox2}>
                                                    <Text style={styles.textInput}>{item.homeVisit !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.homeVisit : 0}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('finance')}</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.textBox2}>
                                                    <Text style={styles.textInput}>{item.finance !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.finance : 0}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('insurance')}</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.textBox2}>
                                                    <Text style={styles.textInput}>{item.insurance !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.insurance : 0}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('accessories')}</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.textBox2}>
                                                    <Text style={styles.textInput}>{item.accessories !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.accessories : 0}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('exchange')}</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.textBox2}>
                                                    <Text style={styles.textInput}>{item.exchange !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.exchange : 0}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('exWarranty')}</Text>
                            </View>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <>
                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                <View style={styles.textBox2}>
                                                    <Text style={styles.textInput}>{item.exWarranty !== null && selector.endDate === item.endDate && selector.startDate === item.startDate ? item.exWarranty : 0}</Text>
                                                </View>
                                            }
                                        </>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
            }

            {ownData !== null && loggedInEmpDetails !== null && (homeSelector.isTeamPresent && !selector.isTeam) && <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '30%', }}>
                    <View style={{ height: 35, }}></View>
                    <View style={styles.paramBox}>
                        <Text style={[styles.text, { color: 'blue' }]}>Retail</Text>
                    </View>
                    <View style={styles.paramBox}>
                        <Text style={[styles.text,]}>Enquiry</Text>
                    </View>
                    <View style={styles.paramBox}>
                        <Text style={[styles.text,]}>Booking</Text>
                    </View>
                    <View style={styles.paramBox}>
                        <Text style={[styles.text,]}>Test Drive</Text>
                    </View>
                    <View style={styles.paramBox}>
                        <Text style={[styles.text,]}>Visit</Text>
                    </View>

                    <View style={styles.paramBox}>
                        <Text style={[styles.text,]}>Finance</Text>
                    </View>

                    <View style={styles.paramBox}>
                        <Text style={[styles.text,]}>Insurance</Text>
                    </View>

                    <View style={styles.paramBox}>
                        <Text style={[styles.text,]}>Accessories</Text>
                    </View>

                    <View style={styles.paramBox}>
                        <Text style={[styles.text,]}>Exchange</Text>
                    </View>
                    <View style={styles.paramBox}>
                        <Text style={[styles.text,]}>Extended Warranty</Text>
                    </View>
                </View>
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ flexDirection: 'column' }} showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} horizontal={true}>
                    <View style={styles.nameWrap}>
                        <View style={styles.nameBox}>
                            <Text style={styles.text}>Total</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <TouchableOpacity style={styles.textBox} onPress={() => {
                            setSelectedUser(loggedInEmpDetails)
                            // if (isNoTargetAvailable) {
                            //     setAddOrEdit('A')
                            // }
                            // else {
                            //     setAddOrEdit('E')
                            // }
                            if(loggedInEmpDetails.primaryDepartment === 'Sales'){
                                if (ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate) {
                                    setSelectedBranch({ label: ownData.branchName, value: ownData.branch })
                                    setDefaultBranch(Number(ownData.branch))
                                    setAddOrEdit('E')
                                }
                                else {
                                    setAddOrEdit('A')
                                }
                                (ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate) ? setRetail(ownData.retailTarget.toString()) : setRetail('')
                                setOpenRetail(true)
                            } else showToast('Access Denied')
                            
                        }}>
                            <Text style={styles.textInput}>{ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.retailTarget : 0}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{ownData.enquiry !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.enquiry : 0}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{ownData.booking !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.booking : 0}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{ownData.testDrive !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.testDrive : 0}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{ownData.homeVisit !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.homeVisit : 0}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{ownData.finance !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.finance : 0}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{ownData.insurance !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.insurance : 0}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{ownData.accessories !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.accessories : 0}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{ownData.exchange !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.exchange : 0}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{ownData.exWarranty !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.exWarranty : 0}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
            }
            {ownData !== null && loggedInEmpDetails !== null && !homeSelector.isTeamPresent &&
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '30%', }}>
                        <View style={{ height: 35, }}></View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: 'blue' }]}>Retail</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Enquiry</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Booking</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Test Drive</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Visit</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Finance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Insurance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Accessories</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Exchange</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text,]}>Extended Warranty</Text>
                        </View>
                    </View>
                    <ScrollView style={{ width: '100%' }} contentContainerStyle={{ flexDirection: 'column' }} showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false} horizontal={true}>
                        <View style={styles.nameWrap}>
                            <View style={styles.nameBox}>
                                <Text style={styles.text}>Total</Text>
                            </View>
                        </View>


                        <View style={styles.textBoxWrap}>
                            <TouchableOpacity style={styles.textBox} onPress={() => {
                                // if (isNoTargetAvailable) {
                                //     setAddOrEdit('A')
                                // }
                                // else {
                                //     setAddOrEdit('E')
                                // }
                                if (loggedInEmpDetails.primaryDepartment === 'Sales')
                                {
                                    if (ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate) {
                                        setSelectedBranch({ label: ownData.branchName, value: ownData.branch })
                                        setDefaultBranch(Number(ownData.branch))
                                        setAddOrEdit('E')
                                    }
                                    else {
                                        setAddOrEdit('A')
                                    }
                                    setSelectedUser(loggedInEmpDetails)
                                    console.log("OWN DATA", ownData, ownData.retailTarget !== null);
                                    (ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate) ? setRetail(ownData.retailTarget.toString()) : setRetail('')

                                    setOpenRetail(true)
                                }
                                else showToast('Access Denied')
                               
                            }}>
                                <Text style={styles.textInput}>{ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.retailTarget : 0}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{ownData.enquiry !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.enquiry : 0}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{ownData.booking !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.booking : 0}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{ownData.testDrive !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.testDrive : 0}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{ownData.homeVisit !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.homeVisit : 0}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{ownData.finance !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.finance : 0}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{ownData.insurance !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.insurance : 0}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{ownData.accessories !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.accessories : 0}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{ownData.exchange !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.exWarranty : 0}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{ownData.exWarranty !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.exWarranty : 0}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            }

            <Modal
                animationType="fade"
                visible={openRetail}
                onRequestClose={() => { setOpenRetail(false) }}
                transparent={true}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }}>
                    <ScrollView style={{ maxHeight: 500, width: '90%', backgroundColor: '#fff', padding: 10, borderRadius: 5, paddingTop: 50 }}>
                        {/* {isDataLoaded && */}
                        <View style={[{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }]}>
                            <Dropdown
                                style={[styles.dropdownContainer,]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={dropdownData}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select branch'}
                                searchPlaceholder="Search..."
                                value={defaultBranch}
                                disable={defaultBranch !== null}
                                // onFocus={() => setIsFocus(true)}
                                // onBlur={() => setIsFocus(false)}
                                onChange={async (item) => {
                                    console.log("£££", item);
                                    setSelectedBranch(item)
                                    if (selector.isTeam) {
                                        console.log("£££££££");
                                        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
                                        if (employeeData) {
                                            const jsonObj = JSON.parse(employeeData);
                                            const payload = {
                                                orgId: jsonObj.orgId,
                                                empId: jsonObj.empId,
                                                selectedIds: [item.value]
                                            }
                                            Promise.all([
                                                dispatch(getEmployeesDropDownData(payload))
                                            ]).then(() => {
                                                console.log('DROP', selector.employees_drop_down_data);
                                            })
                                        }
                                    }
                                }}
                            />
                        </View>
                        {
                            employeeDropDownDataLocal.length > 0 && employeeDropDownDataLocal.map((item, index) => {
                                return (
                                    <View style={[{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }]}>
                                        <Dropdown
                                            style={[styles.dropdownContainer,]}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            inputSearchStyle={styles.inputSearchStyle}
                                            iconStyle={styles.iconStyle}
                                            data={item.data}
                                            search
                                            maxHeight={300}
                                            labelField="label"
                                            valueField="value"
                                            placeholder={item.title}
                                            searchPlaceholder="Search..."
                                            // value={value}
                                            // onFocus={() => setIsFocus(true)}
                                            // onBlur={() => setIsFocus(false)}
                                            onChange={val => {
                                                // console.log("£££", val);
                                                let tempVal = otherDropDownSelectedValue;
                                                // console.log("$$$$", JSON.stringify(tempVal));
                                                tempVal.push({
                                                    key: item.title,
                                                    value: val
                                                })
                                                setOtherDropDownSelectedValue(tempVal)
                                            }}
                                        />
                                    </View>
                                )
                            })
                        }
                        {/* } */}

                        <View style={{ alignItems: 'center' }}>
                            <View style={{ width: '80%', height: 40, borderWidth: 1, borderColor: 'blue', borderRadius: 5, justifyContent: 'center', paddingHorizontal: 15, marginBottom: 20 }}>
                                <TextInput
                                    style={{ color: '#333', fontSize: 15, fontWeight: '500' }}
                                    placeholder={"Retail"}
                                    value={retail}
                                    placeholderTextColor={"#333"}
                                    onChangeText={(text) => {
                                        setRetail(text)
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: '38%', backgroundColor: Colors.RED, height: 40, marginRight: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                                // console.log("££££",selectedUser);
                                // if (addOrEdit === 'A') {
                                //     editTargetData()
                                // }
                                // else {
                                //     editTargetData()
                                // }
                                if (isNoTargetAvailable) {
                                    addTargetData()
                                }
                                else {
                                    editTargetData()
                                }
                            }}>
                                <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '38%', backgroundColor: Colors.GRAY, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                                setRetail('');
                                setSelectedUser(null)
                                setOpenRetail(false)
                                setEmployeeDropDownDataLocal([])
                            }}>
                                <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    {!selector.isLoading ? null : <LoaderComponent
                        visible={selector.isLoading}
                        onRequestClose={() => { }}
                    />}
                </View>
            </Modal>
        </>
    )
}

export default MainParamScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: Colors.LIGHT_GRAY,
    },
    text: { fontSize: 14, fontWeight: '500' },
    nameWrap: { width: '100%', flexDirection: 'row', marginBottom: 10, marginLeft: 10, marginTop: 10 },
    nameBox: { width: 80, justifyContent: 'center', alignItems: 'center', marginRight: 5 },
    textBox: { width: 80, height: 40, borderWidth: 1, borderRadius: 5, borderColor: 'blue', marginRight: 5, justifyContent: 'center', alignItems: 'center' },
    textBox2: { width: 80, height: 40, borderWidth: 1, borderRadius: 5, marginRight: 5, justifyContent: 'center', alignItems: 'center', borderColor: '#d1d1d1' },
    textInput: {
        fontSize: 14,
        // color: 'red'
    },
    textBoxWrap: { width: '100%', flexDirection: 'row', marginLeft: 10, marginBottom: 10 },
    paramBox: { marginHorizontal: 10, justifyContent: 'center', height: 45, marginBottom: 5 },
    dropdownContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderWidth: 1,
        width: '80%',
        height: 40,
        borderRadius: 5
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',
        fontWeight: '400'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
