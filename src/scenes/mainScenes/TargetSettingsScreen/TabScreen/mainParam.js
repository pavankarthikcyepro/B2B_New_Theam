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
    editTargetMapping, saveSelfTargetParams, saveTeamTargetParams
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
    const [enqData, setEnqData] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [testDriveData, settestDriveData] = useState(null);
    const [visitData, setVisitData] = useState(null);

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
    const [editParameters, setEditParameters] = useState(false);
    const [updatedSelfParameters, setUpdatedSelfParameters] = useState({});
    const [masterSelfParameters, setMasterSelfParameters] = useState({});
    const [updateTeamsParamsData, setUpdateTeamsParamsData] = useState([]);
    const [masterTeamsParamsData, setMasterTeamsParamsData] = useState([]);

    const [dropdownData, setDropdownData] = useState([]);
    const [selectedDropdownData, setSelectedDropdownData] = useState([]);
    const [employeeDropDownDataLocal, setEmployeeDropDownDataLocal] = useState([]);
    const [showChild, setShowChild] = useState(false);
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

    const clearOwnData = () => {
        setIsNoTargetAvailable(true);
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

    useEffect(async () => {
        setEditParameters(false);
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
                        clearOwnData();
                    }
                }
                else {
                    clearOwnData();
                }
            }
            if (selector.isDataLoaded && selector.targetMapping.length === 0) {
                clearOwnData();
            }
        }
        else {
            setTargetName('');
        }
    }, [selector.isTeam, selector.selectedMonth])

    const setTeamEmployeeTargetParams = () => {
        const paramsArray = [];
        selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
            if (item.endDate === selector.endDate && item.startDate === selector.startDate && +item.employeeId !== +loggedInEmpDetails.empId) {
                const params = ['enquiry', 'testDrive', 'homeVisit', 'booking', 'exchange', 'finance', 'insurance', 'exWarranty', 'accessories'];
                params.forEach(x => {
                    const obj = { empId: item.employeeId, target: item[x], type: x, id: item.id };
                    paramsArray.push(obj);
                })
            }
        });
        console.log("paramsArray", paramsArray);
        setUpdateTeamsParamsData([...paramsArray]);
    }

    const setEmployeeTargetParams = () => {
        const data = { enquiry: getTargetParamValue(ownData?.enquiry), booking: getTargetParamValue(ownData?.booking), testDrive: getTargetParamValue(ownData?.testDrive), homeVisit: getTargetParamValue(ownData?.homeVisit), finance: getTargetParamValue(ownData?.finance), insurance: getTargetParamValue(ownData?.insurance), accessories: getTargetParamValue(ownData?.accessories), exchange: getTargetParamValue(ownData?.exchange), exWarranty: getTargetParamValue(ownData?.exWarranty) };
        setUpdatedSelfParameters({ ...data });
        setMasterSelfParameters({ ...data });
    }

    const getTargetParamValue = (param) => {
        const isDatesEqual = selector.endDate === ownData?.endDate && selector.startDate === ownData?.startDate;
        return param !== null && isDatesEqual ? param : 0;
    }

    useEffect(() => {
        if (ownData) {
            setEmployeeTargetParams();
        }
    }, [ownData]);

    useEffect(async () => {


        if (selector.targetMapping.length > 0 && loggedInEmpDetails !== null && selector.isDataLoaded) {
            setTeamEmployeeTargetParams();

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
                console.log("TTT 2: targetMapping", JSON.stringify(ownDataArray2));
                if (ownDataArray2.length > 0) {
                    setOwnData(ownDataArray2[0])
                    if (ownDataArray2[0]?.targetName) {
                        setTargetName(ownDataArray2[0]?.targetName)
                    }
                }
                else {
                    clearOwnData();
                }
            }
            else {
                clearOwnData();
            }
        }
        if (selector.isDataLoaded && selector.targetMapping.length === 0) {
            clearOwnData();
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
                clearOwnData();
            }
        }
        setTeamEmployeeTargetParams();

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
                    "targetName": targetName !== '' ? targetName : "DEFAULT"
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
                    "targetType": 'MONTHLY',
                    // "targetName": selector.targetType === 'MONTHLY' ? selector.selectedMonth.value : selector.selectedSpecial.keyId
                    "targetName": targetName !== '' ? targetName : "DEFAULT"
                }

                console.log("PAYLOAD EDIT:", payload);
                Promise.all([
                    dispatch(editTargetMapping(payload))
                ]).then((response) => {
                    console.log("response", response);
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
                }).catch((error) => {
                    console.log("ERROR", error);
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

    const onChangeSelfParamValue = (type, value) => {
        updatedSelfParameters[type] = value;
        const updatedParams = { ...updatedSelfParameters };
        setUpdatedSelfParameters(updatedParams)
    }

    function RenderTeamsSelfData(type) {
        return (
            <TextInput editable={editParameters} style={editParameters ? styles.textBox : styles.textBoxDisabled}
                value={`${updatedSelfParameters[type]}`} keyboardType={'number-pad'} onChangeText={(z) => onChangeSelfParamValue(type, z)}
            />
        );
    }

    const formParamsTargetPayloadData = () => {
        const targets = [];
        const data = { ...updatedSelfParameters };
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const target = data[key];
                const obj = { unit: key === 'accessories' ? 'number' : 'percentage', target, parameter: key };
                targets.push(obj);
            }
        }
        return targets;
    }
    const formTeamParamsTargetPayloadData = () => {
        const targets = [];
        const data = [...updateTeamsParamsData];
        const empIds = data.map(({ empId }) => empId);
        const teamMembers = new Set(empIds);
        teamMembers.forEach(x => {
            const internalTargets = [];
            const empData = data.filter(y => y.empId === x);
            const user = selector.targetMapping.find(y => y.employeeId === x);
            const branchInfo = {};
            if (user) {
                const { branch, department, designation } = user;
                branchInfo.branch = branch;
                branchInfo.department = department;
                branchInfo.designation = designation;
            }
            empData.forEach(e => {
                const obj = { unit: e.type === 'accessories' ? 'number' : 'percentage', target: e.target, parameter: e.type };
                internalTargets.push(obj);
            });
            const obj = { employeeId: x, ...branchInfo, targets: internalTargets };
            targets.push(obj);
        });
        return targets;
    }

    function saveSelfData() {
        // if (!updatedSelfParameters || Object.keys(updatedSelfParameters).length <=0 ) {
        //     return;
        // } else {
        //     Alert.alert('hello');
        //     return;
        // }
        setEditParameters(false);
        const data = { ...updatedSelfParameters };
        setMasterSelfParameters({ ...data });
        if (loggedInEmpDetails) {
            const { orgId, empId, branchId } = loggedInEmpDetails;
            const payload = {
                orgId: `${orgId}`,
                employeeId: `${empId}`,
                targets: formParamsTargetPayloadData(),
                branch: `${branchId}`,
                department: `${ownData.department}`,
                designation: `${ownData.designation}`,
                start_date: selector.startDate,
                end_date: selector.endDate
            }
            Promise.all([
                dispatch(saveSelfTargetParams(payload))
            ]).then((x) => {
                console.log('daata: ', x)
            }).catch((y) => {
                console.log('daata: errr', y)
            })
        }
    }

    function saveTeamData() {
        // if (!updatedSelfParameters || Object.keys(updatedSelfParameters).length <=0 ) {
        //     return;
        // } else {
        //     return;
        // }
        setEditParameters(false);
        const data = { ...updateTeamsParamsData };
        setMasterTeamsParamsData({ ...data });
        if (loggedInEmpDetails) {
            const { orgId, empId, branchId } = loggedInEmpDetails;
            const payload = {
                orgId: `${orgId}`,
                employeeId: `${empId}`,
                targets: formTeamParamsTargetPayloadData(),

                start_date: selector.startDate,
                end_date: selector.endDate
            }
            Promise.all([
                dispatch(saveTeamTargetParams(payload))
            ]).then((x) => {
                console.log('daata---: ', selector.targetMapping)
                if (Array.isArray(x) && x[0].payload.message.toLowerCase() === 'not updated') {
                    const payload2 = {
                        "empId": loggedInEmpDetails.empId,
                        "pageNo": 1,
                        "size": 500,
                        "targetType": selector.targetType
                    }
                    Promise.all([
                        dispatch(getAllTargetMapping(payload2))
                    ]).then((x) => {
                        console.log('daata: ', x)
                    }).catch((y) => {
                        console.log('daata: errr', y)
                    })
                }
            }).catch((y) => {
                console.log('daata---: errr', y)
            })
        }
    }

    function onChangeTeamParamValue(curIndex, x, ID, type) {
        const index = updateTeamsParamsData.findIndex(item => item.id === ID && item.type === type);
        updateTeamsParamsData[curIndex].target = x;
        const updatedParams = [...updateTeamsParamsData];
        setUpdateTeamsParamsData(updatedParams);
    }

    const RenderTeamsTargetData = (item, type, index) => {
        const curIndex = updateTeamsParamsData.findIndex(x => x.empId === item.employeeId && x.type === type && x.id === item.id);
        let param;
        if (curIndex !== -1) {
            const curParam = updateTeamsParamsData[curIndex];
            param = curParam.target;
        }
        return (
            <>
                {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                    <View key={index}>
                        <TextInput key={index} editable={editParameters} style={editParameters ? styles.textBox : styles.textBoxDisabled}
                            value={param} onChangeText={(x) => onChangeTeamParamValue(curIndex, x, item.id, type)} />
                    </View>
                }
            </>
        )
    }

    return (
        <>
            <View>
                {!editParameters &&
                    <View>
                        <Pressable style={[styles.editParamsButton, { borderColor: Colors.RED }]} onPress={() => {
                            setEditParameters(true);
                        }}>
                            <View style={styles.editParamsBtnView}>
                                <IconButton icon="pencil" size={16} color={Colors.RED} />
                                <Text>Edit Parameters</Text>
                            </View>
                        </Pressable>
                    </View>
                }
                {editParameters &&
                    <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <Pressable style={[styles.editParamsButton, { borderColor: 'green' }]} onPress={() => {
                            if ((homeSelector.isTeamPresent && selector.isTeam)) {
                                saveTeamData();
                            } else {
                                saveSelfData();
                            }
                        }}>
                            <View style={styles.editParamsBtnView}>
                                <IconButton icon="content-save" size={16} color={'green'} />
                                <Text>Save</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.editParamsButton, { borderColor: 'red' }]} onPress={() => {
                            setEditParameters(false);
                            if (homeSelector.isTeamPresent) {
                                if (selector.isTeam) {
                                    // const data = [...masterTeamsParamsData];
                                    // setMasterTeamsParamsData(data);
                                    const payload2 = {
                                        "empId": loggedInEmpDetails.empId,
                                        "pageNo": 1,
                                        "size": 500,
                                        "targetType": selector.targetType
                                    }
                                    Promise.all([
                                        dispatch(getAllTargetMapping(payload2))
                                    ]).then((x) => {
                                        console.log('daata: ', x)
                                    }).catch((y) => {
                                        console.log('daata: errr', y)
                                    })
                                } else {
                                    const data = { ...masterSelfParameters };
                                    setUpdatedSelfParameters(data);
                                }
                            } else {
                                const data = { ...masterSelfParameters };
                                setUpdatedSelfParameters(data);
                            }
                        }}>
                            <View style={styles.editParamsBtnView}>
                                <IconButton icon="cancel" size={16} color={'red'} style={{ padding: 0 }} />
                                <Text>Cancel</Text>
                            </View>
                        </Pressable>
                    </View>
                }
            </View>
            {/*Teams Data Section*/}
            {loggedInEmpDetails !== null && (homeSelector.isTeamPresent && selector.isTeam) &&
                <View>
                    <ScrollView contentContainerStyle={{ paddingRight: 20, flexDirection: 'column' }} horizontal={true} directionalLockEnabled={true}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: 100, height: 40 }}>

                            </View>
                            <View style={{ height: 40, flexDirection: 'row' }}>
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#FA03B9' }}>Retail</Text>
                                </View>
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#FA03B9' }}>Enquiry</Text>
                                </View>
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#9E31BE' }}>Test Drive</Text>
                                </View>
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#1C95A6' }}>Visit</Text>
                                </View>
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#C62159' }}>Booking</Text>
                                </View>
                                {/* <View style={styles.itemBox}>
                                    <Text style={{ color: '#9E31BE' }}>Retail</Text>
                                </View> */}
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#EC3466' }}>Exchange</Text>
                                </View>
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#1C95A6' }}>Finance</Text>
                                </View>
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#1C95A6' }}>Insurance</Text>
                                </View>
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#C62159' }}>Exwarranty</Text>
                                </View>
                                {/*<View style={styles.itemBox}>*/}
                                {/*  <Text style={{ color: '#EC3466' }}>Total</Text>*/}
                                {/*</View>*/}
                                <View style={styles.itemBox}>
                                    <Text style={{ color: '#0c0c0c' }}>Accessories</Text>
                                </View>
                            </View>
                        </View>
                        {selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                            return (
                                <>
                                    {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate && <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <View style={{ minHeight: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', }}>
                                            {/*// left side name section */}
                                            <View style={{ width: 100, marginTop: 5 }}>
                                                {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                    <View style={styles.nameBox}>
                                                        <Text style={styles.text} numberOfLines={1}>{item?.empName}</Text>
                                                    </View>
                                                }
                                            </View>

                                            <View style={{ width: 88, alignItems: "center" }}>
                                                {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                    <TouchableOpacity onPress={() => {
                                                        setSelectedDropdownData([{ label: item?.branchName, value: item?.branch }])
                                                        if (item?.retailTarget !== null && selector?.endDate === item?.endDate && selector?.startDate === item?.startDate) {
                                                            setSelectedBranch({ label: item?.branchName, value: item?.branch })
                                                            setDefaultBranch(item?.branch)
                                                            setAddOrEdit('E')
                                                        }
                                                        else {
                                                            setDefaultBranch(null);
                                                            setAddOrEdit('A')
                                                        }
                                                        if (item?.targetName) {
                                                            setTargetName(item?.targetName)
                                                        }
                                                        setIsNoTargetAvailable(false)
                                                        setRetail((item.retailTarget !== null && selector.endDate === item.endDate && selector.startDate === item.startDate) ? item.retailTarget : 0)
                                                        setSelectedUser(item)

                                                        setOpenRetail(true)
                                                    }} style={{ width: 80, height: 40, borderWidth: 1, borderRadius: 5, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} >
                                                        <Text style={styles.textInput}>{item?.retailTarget ? item?.retailTarget : 0}</Text>
                                                    </TouchableOpacity>}
                                            </View>

                                            {Number(item.employeeId) !== Number(loggedInEmpDetails?.empId) && selector.endDate === item.endDate && selector.startDate === item.startDate &&
                                                ["enquiry", "testDrive", "homeVisit", "booking", "exchange", "finance", "insurance", "exWarranty", "accessories"].map((subItem) => (
                                                    <View key={index} style={{ width: 88, alignItems: "center" }}>
                                                        {RenderTeamsTargetData(item, subItem, index)}
                                                    </View>
                                                ))}
                                            {/* <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C62159', borderRadius: 20, marginTop: 5, marginBottom: 5 }}>
                                    
                                </TouchableOpacity> */}
                                        </View>

                                    </View>}

                                </>
                            )
                        })}
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <View style={{ minHeight: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', }}>
                                {/*// left side name section */}
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ minHeight: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        {/*// left side name section */}
                                        <View style={{ width: 100, marginTop: 5 }}>
                                            <View style={styles.nameBox}>
                                                <Text style={styles.text} numberOfLines={1}>{'Team Total'}</Text>
                                            </View>
                                        </View>

                                        <View style={{ width: 88, alignItems: "center" }}>
                                            <TouchableOpacity style={{ width: 80, height: 40, borderWidth: 1, borderRadius: 5, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} >
                                                <Text style={styles.textInput}>{getTotal("retailTarget")}</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {["enquiry", "testDrive", "homeVisit", "booking", "exchange", "finance", "insurance", "exWarranty", "accessories"].map((item) => (
                                            <View style={{ width: 88, alignItems: "center" }}>
                                                <TouchableOpacity style={styles.textBoxDisabled} >
                                                    <Text style={styles.textInput}>{getTotal(item)}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))

                                        }
                                        {/* <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C62159', borderRadius: 20, marginTop: 5, marginBottom: 5 }}>
                                    
                                </TouchableOpacity> */}
                                    </View>
                                </View>

                                {/* <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C62159', borderRadius: 20, marginTop: 5, marginBottom: 5 }}>
                                    
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            }
            {/*Serlf Data Section*/}
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
                            setSelectedUser({ ...loggedInEmpDetails })
                            // if (isNoTargetAvailable) {
                            //     setAddOrEdit('A')
                            // }
                            // else {
                            //     setAddOrEdit('E')
                            // }
                            if (loggedInEmpDetails.primaryDepartment === 'Sales') {
                                if (ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate) {
                                    setSelectedBranch({ label: ownData.branchName, value: ownData.branch })
                                    setDefaultBranch(ownData.branch)
                                    setAddOrEdit('E')
                                }
                                else {
                                    setDefaultBranch(null);
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
                        {RenderTeamsSelfData('enquiry')}
                    </View>

                    <View style={styles.textBoxWrap}>

                        {RenderTeamsSelfData('booking')}
                    </View>

                    <View style={styles.textBoxWrap}>

                        {RenderTeamsSelfData('testDrive')}

                    </View>

                    <View style={styles.textBoxWrap}>

                        {RenderTeamsSelfData('homeVisit')}
                    </View>

                    <View style={styles.textBoxWrap}>
                        {RenderTeamsSelfData('finance')}
                    </View>

                    <View style={styles.textBoxWrap}>
                        {RenderTeamsSelfData('insurance')}
                    </View>

                    <View style={styles.textBoxWrap}>
                        {RenderTeamsSelfData('accessories')}
                    </View>

                    <View style={styles.textBoxWrap}>
                        {RenderTeamsSelfData('exchange')}
                    </View>

                    <View style={styles.textBoxWrap}>
                        {RenderTeamsSelfData('exWarranty')}
                    </View>
                </ScrollView>
            </View>
            }
            {/*DSE Login Self-only data*/}
            {ownData !== null && loggedInEmpDetails !== null && !homeSelector.isTeamPresent &&
                <View style={{ flexDirection: 'row' }}>
                    {/*Left side headings view*/}
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
                    {/*Right Side View*/}
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
                                if (loggedInEmpDetails.primaryDepartment === 'Sales') {
                                    console.log("==================================");
                                    console.log("ownData ===> ", JSON.stringify(ownData));
                                    console.log("selector.endDate ===> ", selector.endDate);
                                    console.log("selector.startDate ===> ", selector.startDate);
                                    console.log("==================================");
                                    if (ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate) {
                                        setSelectedBranch({ label: ownData.branchName, value: ownData.branch })
                                        setDefaultBranch(ownData.branch)
                                        setAddOrEdit('E')
                                    }
                                    else {
                                        setDefaultBranch(null);
                                        setAddOrEdit('A')
                                    }
                                    setSelectedUser({ ...loggedInEmpDetails });
                                    (ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate) ? setRetail(ownData.retailTarget.toString()) : setRetail('')

                                    setOpenRetail(true)
                                }
                                else showToast('Access Denied')

                            }}>
                                <Text style={styles.textInput}>{ownData.retailTarget !== null && selector.endDate === ownData.endDate && selector.startDate === ownData.startDate ? ownData.retailTarget : 0}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.textBoxWrap}>
                            {RenderTeamsSelfData('enquiry')}
                        </View>

                        <View style={styles.textBoxWrap}>
                            {RenderTeamsSelfData('booking')}
                        </View>

                        <View style={styles.textBoxWrap}>
                            {RenderTeamsSelfData('testDrive')}
                        </View>

                        <View style={styles.textBoxWrap}>
                            {RenderTeamsSelfData('homeVisit')}

                        </View>

                        <View style={styles.textBoxWrap}>
                            {RenderTeamsSelfData('finance')}

                        </View>

                        <View style={styles.textBoxWrap}>
                            {RenderTeamsSelfData('insurance')}

                        </View>

                        <View style={styles.textBoxWrap}>
                            {RenderTeamsSelfData('accessories')}

                        </View>

                        <View style={styles.textBoxWrap}>
                            {RenderTeamsSelfData('exchange')}

                        </View>

                        <View style={styles.textBoxWrap}>
                            {RenderTeamsSelfData('exWarranty')}

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
                                data={selector.isTeam ? selectedDropdownData : dropdownData}
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
    textBox: { width: 80, height: 40, borderWidth: 1, borderRadius: 5, borderColor: 'blue', marginRight: 5, justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
    textBoxDisabled: { width: 80, height: 40, borderWidth: 1, borderRadius: 5, borderColor: '#d1d1d1', marginRight: 5, justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
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
    editParamsButton: { borderStyle: 'solid', borderWidth: 1, paddingEnd: 4, margin: 4, alignSelf: 'flex-end' },
    editParamsBtnView: { display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    itemBox: { width: 88, height: 40, justifyContent: 'center', alignItems: 'center' },
    totalView: { width: 40, minHeight: 40, alignItems: 'center', justifyContent: 'center' },
    totalText: { width: 60, fontSize: 12, color: '#000', fontWeight: '500', textAlign: 'center' }
});

