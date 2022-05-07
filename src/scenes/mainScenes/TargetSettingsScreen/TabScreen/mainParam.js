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

import {
    getEmployeesDropDownData,
    addTargetMapping,
    getAllTargetMapping
} from '../../../../redux/targetSettingsReducer';
import {
    updateIsTeamPresent
} from '../../../../redux/homeReducer';
import { showToast, showToastRedAlert } from '../../../../utils/toast';

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

    useEffect(() => {
        if (selector.activeBranches.length > 0) {
            let tempBranch = [];
            for (let i = 0; i < selector.activeBranches.length; i++) {
                tempBranch.push({ label: selector.activeBranches[i].name, value: selector.activeBranches[i].id })
                if (i === selector.activeBranches.length - 1) {
                    setDropdownData(tempBranch)
                    setIsDataLoaded(true)
                }
            }
        } else {
        }
    }, [selector.activeBranches])

    const addTargetData = async () => {
        console.log(JSON.stringify(otherDropDownSelectedValue));
        if (selectedBranch === null) {
            showToast("Please select branch")
        }
        else if (retail === '') {
            showToast("Please enter retail value")
        }
        else {
            setOpenRetail(false)
            let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                let payload = {
                    "branch": selectedBranch.value,
                    "branchmangerId": otherDropDownSelectedValue.filter((item) => item.key === 'Managers').length > 0 ? otherDropDownSelectedValue.filter((item) => item.key === 'Managers')[0].value.value : '',
                    "employeeId": jsonObj.empId,
                    "endDate": selector.endDate,
                    "managerId": otherDropDownSelectedValue.filter((item) => item.key === 'Managers').length > 0 ? otherDropDownSelectedValue.filter((item) => item.key === 'Managers')[0].value.value : '',
                    "retailTarget": retail,
                    "startDate": selector.startDate,
                    "teamLeadId": otherDropDownSelectedValue.filter((item) => item.key === 'Team Lead').length > 0 ? otherDropDownSelectedValue.filter((item) => item.key === 'Team Lead')[0].value.value : '',
                }
                console.log("PAYLOAD:", payload);
                Promise.all([
                    dispatch(addTargetMapping(payload))
                ]).then(() => {
                    console.log('I did everything!');
                    const payload2 = {
                        "empId": jsonObj.empId,
                        "pageNo": 1,
                        "size": 10
                    }
                    dispatch(getAllTargetMapping(payload2))
                });
            }
        }
    }

    const getTotal = (key) => {
        let total = 0;
        for (let i = 0; i < selector.targetMapping.length; i++) {
            if (selector.targetMapping[i][key] !== null) {
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
            {(homeSelector.isTeamPresent && selector.isTeam) &&
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '25%', }}>
                        <View style={{ height: 35, }}></View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: 'blue' }]}>Retail</Text>
                        </View>
                        <View style={styles.paramBox}>
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
                            <Text style={[styles.text, { color: '#0800ff' }]}>Finance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#1f93ab' }]}>Insurance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#ec3466' }]}>Accessories</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: 'blue' }]}>Exchange</Text>
                        </View>
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
                                        <View style={styles.nameBox}>
                                            <Text style={styles.text} numberOfLines={1}>{item.empName}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>

                        <View style={styles.textBoxWrap}>
                            <TouchableOpacity style={styles.textBox} onPress={() => setOpenRetail(true)}>
                                <Text style={styles.textInput}>{getTotal('retailTarget')}</Text>
                            </TouchableOpacity>
                            {
                                selector.targetMapping.length > 0 && selector.targetMapping.map((item, index) => {
                                    return (
                                        <View style={styles.textBox}>
                                            <Text style={styles.textInput}>{item.retailTarget !== null ? item.retailTarget : 0}</Text>
                                        </View>
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
                                        <View style={styles.textBox2}>
                                            <Text style={styles.textInput}>{item.enquiry !== null ? item.enquiry : 0}</Text>
                                        </View>
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
                                        <View style={styles.textBox2}>
                                            <Text style={styles.textInput}>{item.booking !== null ? item.booking : 0}</Text>
                                        </View>
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
                                        <View style={styles.textBox2}>
                                            <Text style={styles.textInput}>{item.testDrive !== null ? item.testDrive : 0}</Text>
                                        </View>
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
                                        <View style={styles.textBox2}>
                                            <Text style={styles.textInput}>{item.homeVisit !== null ? item.homeVisit : 0}</Text>
                                        </View>
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
                                    <View style={styles.textBox2}>
                                        <Text style={styles.textInput}>{item.finance !== null ? item.finance : 0}</Text>
                                    </View>
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
                                    <View style={styles.textBox2}>
                                        <Text style={styles.textInput}>{item.insurance !== null ? item.insurance : 0}</Text>
                                    </View>
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
                                    <View style={styles.textBox2}>
                                        <Text style={styles.textInput}>{item.accessories !== null ? item.accessories : 0}</Text>
                                    </View>
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
                                    <View style={styles.textBox2}>
                                        <Text style={styles.textInput}>{item.exchange !== null ? item.exchange : 0}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                    </ScrollView>
                </View>}

            {(homeSelector.isTeamPresent && !selector.isTeam) && <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '25%', }}>
                    <View style={{ height: 35, }}></View>
                    <View style={styles.paramBox}>
                        <Text style={[styles.text, { color: 'blue' }]}>Retail</Text>
                    </View>
                    <View style={styles.paramBox}>
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
                        <Text style={[styles.text, { color: '#0800ff' }]}>Finance</Text>
                    </View>

                    <View style={styles.paramBox}>
                        <Text style={[styles.text, { color: '#1f93ab' }]}>Insurance</Text>
                    </View>

                    <View style={styles.paramBox}>
                        <Text style={[styles.text, { color: '#ec3466' }]}>Accessories</Text>
                    </View>

                    <View style={styles.paramBox}>
                        <Text style={[styles.text, { color: 'blue' }]}>Exchange</Text>
                    </View>
                </View>
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ flexDirection: 'column' }} showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} horizontal={true}>
                    <View style={styles.nameWrap}>
                        <View style={styles.nameBox} onPress={() => setOpenRetail(true)}>
                            <Text style={styles.text}>Total</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <TouchableOpacity style={styles.textBox} onPress={() => setOpenRetail(true)}>
                            <Text style={styles.textInput}>{getTotal('retailTarget')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('enquiry')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('booking')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('testDrive')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('homeVisit')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('finance')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('insurance')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('accessories')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('exchange')}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
            }
            {!homeSelector.isTeamPresent &&
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '25%', }}>
                        <View style={{ height: 35, }}></View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: 'blue' }]}>Retail</Text>
                        </View>
                        <View style={styles.paramBox}>
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
                            <Text style={[styles.text, { color: '#0800ff' }]}>Finance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#1f93ab' }]}>Insurance</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: '#ec3466' }]}>Accessories</Text>
                        </View>

                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: 'blue' }]}>Exchange</Text>
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
                            <TouchableOpacity style={styles.textBox} onPress={() => setOpenRetail(true)}>
                                <Text style={styles.textInput}>{getTotal('retailTarget')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('enquiry')}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('booking')}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('testDrive')}</Text>
                            </View>
                        </View>

                        <View style={styles.textBoxWrap}>
                            <View style={styles.textBox2}>
                                <Text style={styles.textInput}>{getTotal('homeVisit')}</Text>
                            </View>
                        </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('finance')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('insurance')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('accessories')}</Text>
                        </View>
                    </View>

                    <View style={styles.textBoxWrap}>
                        <View style={styles.textBox2}>
                            <Text style={styles.textInput}>{getTotal('exchange')}</Text>
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
                                // value={value}
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
                                    placeholderTextColor={"#333"}
                                    onChangeText={(text) => {
                                        setRetail(text)
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: '38%', backgroundColor: Colors.RED, height: 40, marginRight: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={addTargetData}>
                                <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '38%', backgroundColor: Colors.GRAY, height: 40, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                                setRetail('');
                                setOpenRetail(false)
                                setEmployeeDropDownDataLocal([])
                            }}>
                                <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
    nameBox: { width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 5 },
    textBox: { width: 100, height: 40, borderWidth: 1, borderRadius: 5, borderColor: 'blue', marginRight: 5, justifyContent: 'center', alignItems: 'center' },
    textBox2: { width: 100, height: 40, borderWidth: 1, borderRadius: 5, marginRight: 5, justifyContent: 'center', alignItems: 'center' },
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
