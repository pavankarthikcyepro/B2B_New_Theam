import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import { Colors, GlobalStyle } from '../../../styles';
import * as acctionCreator from '../../../redux/targetSettingsReducer';
import { DateRangeComp, DatePickerComponent, SortAndFilterComp } from '../../../components';
import { DateModalComp } from "../../../components/dateModalComp";
import { getMenuList } from '../../../redux/homeReducer';
import { DashboardTopTabNavigator } from '../../../navigations/dashboardTopTabNavigator';
import { DashboardTopTabNavigatorNew } from '../../../navigations/dashboardTopTabNavigatorNew';
import { HomeStackIdentifiers } from '../../../navigations/appNavigator';
import * as AsyncStore from '../../../asyncStore';
import moment from 'moment';
import { TargetAchivementComp } from './targetAchivementComp';
import { HeaderComp, DropDownComponant, LoaderComponent } from '../../../components';
import { TargetDropdown } from "../../../pureComponents";
import RNFetchBlob from 'rn-fetch-blob';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import ArrowIcon from "react-native-vector-icons/FontAwesome";

const dropdownData = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
];

const rankList = [
    {
        "empId": 146,
        "orgId": 1,
        "rank": 1,
        "targetAchivements": 21,
        "branchId": 242,
        "empName": "E Ravi",
        "achivementPerc": 23
    },
    {
        "empId": 102,
        "orgId": 1,
        "rank": 2,
        "targetAchivements": 1,
        "branchId": 244,
        "empName": "GUDIPATI LAXMIKANTH",
        "achivementPerc": 0
    },
    {
        "empId": 97,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 244,
        "empName": "M Rakesh",
        "achivementPerc": 0
    },
    {
        "empId": 100,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 244,
        "empName": "Mohammed Saarvar Ali",
        "achivementPerc": 0
    },
    {
        "empId": 101,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 244,
        "empName": "V Vinay ",
        "achivementPerc": 0
    },
    {
        "empId": 174,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 244,
        "empName": "GEETHA",
        "achivementPerc": 0
    },
    {
        "empId": 182,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 242,
        "empName": "Rekha",
        "achivementPerc": 0
    },
    {
        "empId": 682,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 242,
        "empName": "Vidhya Sagar",
        "achivementPerc": 0
    },
    {
        "empId": 685,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 242,
        "empName": "Babu Rao Dhesha",
        "achivementPerc": 0
    },
    {
        "empId": 699,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 244,
        "empName": "Masthan Reddy Kalluri",
        "achivementPerc": 0
    },
    {
        "empId": 700,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 244,
        "empName": "Mujtaba Shaik Mohammed",
        "achivementPerc": 0
    }
]

export default function leaderBoardScreen() {
    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [groupDealerRank, setGroupDealerRank] = useState(null);
    const [groupDealerCount, setGroupDealerCount] = useState(null);

    useEffect(async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            if (selector.allGroupDealerData.length > 0) {
                let tempArr = [], allArray = selector.allGroupDealerData;
                setGroupDealerCount(selector.allGroupDealerData.length)
                tempArr = allArray.filter((item) => {
                    return item.empId === jsonObj.empId
                })
                if (tempArr.length > 0) {
                    setGroupDealerRank(tempArr[0].rank)
                }
                else {

                }
            }
        }
    }, [selector.allGroupDealerData]);

    const renderItemTaskTransferList = (item, index) => {
        return (
            <TouchableOpacity style={{
                backgroundColor: "white",
                padding: 10
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: index === 0 ? '#F59D44' : 'black', alignSelf: 'center'}}>{index === 0 ? 'Rank' : index}</Text>
                    <Text style={{ color: index === 0 ? '#D81F9F' : 'black', textAlign: 'center', }}>{index === 0 ? 'Branch' : item.branchId}</Text>
                    <Text style={{ color: index === 0 ? '#983AAA' : 'black', alignSelf: 'center' }}>{index === 0 ? 'Code' : item.branchId}</Text>
                    <Text style={{ color: index === 0 ? '#328B91' : 'black', textAlign: 'center' }}>{index === 0 ? 'Ret T/A%' : item.achivementPerc}</Text>
                    <Text style={{ color: index === 0 ? '#E54875' : 'black', textAlign: 'center' }}>{index === 0 ? 'Retails' : item.targetAchivements}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.rankBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                    <View style={styles.rankIconBox}>
                        <Image style={styles.rankIcon} source={require("../../../assets/images/perform_rank.png")} />
                    </View>
                    <View style={{
                        marginTop: 5,
                        marginLeft: 3
                    }}>
                        <Text style={styles.rankHeadingText}>Dealer Ranking</Text>
                        {groupDealerRank !== null &&
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.rankText}>{groupDealerRank}</Text>
                                <Text style={{ ...styles.rankText, color: Colors.GRAY }}>/</Text>
                                <Text style={{ ...styles.rankText, color: Colors.GRAY }}>{groupDealerCount}</Text>
                            </View>
                        }
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'space-around', width: '100%', padding: 10 }}>
                    <View style={styles.dropWrap} pointerEvents="none">
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
                            placeholder={'All Branches'}
                            searchPlaceholder="Search..."
                            renderRightIcon={() => (
                                <Image style={{ height: 5, width: 10 }} source={require('../../../assets/images/Polygon.png')} />
                            )}
                            onChange={async (item) => {
                                console.log("£££", item);
                            }}
                        />
                    </View>

                    <View style={styles.dropWrap} pointerEvents="none">
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
                            placeholder={'Target Title'}
                            searchPlaceholder="Search..."
                            renderRightIcon={() => (
                                <Image style={{ height: 5, width: 10 }} source={require('../../../assets/images/Polygon.png')} />
                            )}
                            onChange={async (item) => {
                                console.log("£££", item);
                            }}
                        />
                    </View>
                </View>

                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <View style={{
                            transform: [{ rotate: '45deg' }], width: 35, height: 35, borderRadius: 5, backgroundColor: '#BCE0BE', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <View style={{ transform: [{ rotate: '315deg' }] }}>
                                <ArrowIcon name="long-arrow-up" color={"#447E56"} size={20} />
                            </View>
                        </View>
                        <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '400' }}>Top 5 Ranks</Text>
                    </View>

                    <View style={{
                        height: 250,
                        width: '95%',
                        backgroundColor: 'white',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 1,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#d2d2d2",
                        borderRadius: 7,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 5,
                        alignSelf: 'center'
                    }}>
                        <View style={{ width: '98%', height: 200, backgroundColor: 'pink' }}>
                            <FlatList
                                data={rankList}
                                nestedScrollEnabled={true}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => renderItemTaskTransferList(item, index)}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>

                        <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
                            <Text style={{ color: 'red', alignSelf: 'flex-end', margin: 12 }}>View All &gt;</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <View style={{
                            transform: [{ rotate: '45deg' }], width: 38, height: 38, borderRadius: 5, backgroundColor: '#FC827D', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <View style={{ transform: [{ rotate: '315deg' }] }}>
                                <ArrowIcon name="long-arrow-down" color={"#E40603"} size={20} />
                            </View>
                        </View>
                        <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '400' }}>Low 5 Ranks</Text>
                    </View>

                    <View style={{
                        height: 250,
                        width: '95%',
                        backgroundColor: 'white',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 1,
                        borderStyle: "solid",
                        borderWidth: 1,
                        borderColor: "#d2d2d2",
                        borderRadius: 7,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 5,
                        alignSelf: 'center'
                    }}>
                        <View style={{ width: '98%', height: 200, backgroundColor: 'pink' }}>
                            <FlatList
                                data={rankList}
                                nestedScrollEnabled={true}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => renderItemTaskTransferList(item, index)}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>

                        <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
                            <Text style={{ color: 'red', alignSelf: 'flex-end', margin: 12 }}>View All &gt;</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    rankIconBox: {
        height: 50,
        width: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#d2d2d2",
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    rankHeadingText: {
        fontSize: 17,
        fontWeight: "500"
    },
    rankText: {
        fontSize: 18,
        fontWeight: "700"
    },
    rankBox: {
        paddingTop: 5,
        paddingBottom: 10
    },
    rankIcon: { width: 35, height: 35 },



    dropdownContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderWidth: 1,
        borderColor: '#000000',
        width: '100%',
        height: 50,
        borderRadius: 5
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
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
    dropWrap: { position: 'relative', marginBottom: 20, width: '45%' },
});
