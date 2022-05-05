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
    addTargetMapping
} from '../../../../redux/targetSettingsReducer';

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

    const data = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
    ];

    useEffect(() => {
        if (selector.startDate !== "") {
            console.log("START DATE:", selector.startDate);
        } else {
        }
    }, [selector.startDate])

    const addTargetData = async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            let payload = {
                "branch": jsonObj.branchId,
                "branchmangerId": "",
                "employeeId": jsonObj.empId,
                "endDate": selector.endDate,
                "managerId": "",
                "retailTarget": retail,
                "startDate": selector.startDate,
                "teamLeadId": ""
            }
            console.log("PAYLOAD:", payload);
            Promise.all([
                dispatch(addTargetMapping(payload))
            ]).then(() => {
                console.log('I did everything!');
            });
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

    return (
        <>
            {(homeSelector.isTeamPresent && selector.isTeam) ?
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '25%', }}>
                        <View style={{ height: 35, }}></View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: 'blue' }]}>Retail</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text]}>Enquiry</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text]}>Booking</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text]}>Test Drive</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text]}>Visit</Text>
                        </View>
                        {/* <View style={styles.paramBox}>
                            <Text style={[styles.text]}>Enquiry</Text>
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
                    </ScrollView>
                </View> :

                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '20%', }}>
                        <View style={{ height: 40, }}></View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: 'blue' }]}>Retail</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text]}>Enquiry</Text>
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
                            <View style={styles.textBox}>
                                <Text style={styles.textInput}>10</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            }
            {!homeSelector.isTeamPresent &&
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '20%', }}>
                        <View style={{ height: 40, }}></View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text, { color: 'blue' }]}>Retail</Text>
                        </View>
                        <View style={styles.paramBox}>
                            <Text style={[styles.text]}>Enquiry</Text>
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
                            <View style={styles.textBox}>
                                <Text style={styles.textInput}>10</Text>
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
                    <View style={{height: 150, width: '90%', backgroundColor: '#fff', padding: 10, borderRadius: 5}}>
                        <View style={[ { justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 30 }]}>
                            <Dropdown
                                style={[styles.dropdownContainer,]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={data}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select item'}
                                searchPlaceholder="Search..."
                                // value={value}
                                // onFocus={() => setIsFocus(true)}
                                // onBlur={() => setIsFocus(false)}
                                onChange={item => {
                                    // setValue(item.value);
                                    // setIsFocus(false);
                                }}
                            />
                        </View>
                    </View>
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
    nameWrap: { width: '100%', flexDirection: 'row', marginBottom: 10, marginLeft: 5, marginTop: 10 },
    nameBox: { width: 100, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
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
