import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, LogBox } from 'react-native';
import * as AsyncStore from '../../../asyncStore';
import { useDispatch, useSelector } from 'react-redux';
import { getBranchRanksList } from "../../../redux/homeReducer";

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

const toprankList = [
    {
        "empId": 146,
        "orgId": 1,
        "rank": 1,
        "targetAchivements": 23,
        "branchId": 242,
        "empName": "E Ravi",
        "achivementPerc": 26
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
    },
    {
        "empId": 731,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 245,
        "empName": "Sayanna",
        "achivementPerc": 0
    },
    {
        "empId": 732,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 245,
        "empName": "Anil",
        "achivementPerc": 0
    },
    {
        "empId": 733,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 266,
        "empName": "Sai Krishna Vulvila",
        "achivementPerc": 0
    },
    {
        "empId": 734,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 266,
        "empName": "Manibushan Gangaram",
        "achivementPerc": 0
    },
    {
        "empId": 735,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 266,
        "empName": "Udaya Bhargavi Ayancha",
        "achivementPerc": 0
    },
    {
        "empId": 741,
        "orgId": 1,
        "rank": 3,
        "targetAchivements": 0,
        "branchId": 242,
        "empName": "Charjun",
        "achivementPerc": 0
    }
];

export default function branchRankingScreen() {
    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [branchName, setBranchName] = useState(null);
    const [branchCode, setBranchCode] = useState(null);

    const getBranchRankListFromServer = async () => {
        let payload = { 
            "endDate": "2022-06-30", 
            "levelSelected": null, 
            "loggedInEmpId": 146, 
            "pageNo": 0, 
            "size": 0, 
            "startDate": "2022-06-01" 
        };
        dispatch(getBranchRanksList(payload));
    }

    useEffect(async () => {
        LogBox.ignoreAllLogs();
        getBranchRankListFromServer();
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            setBranchCode(jsonObj.branchs[0]?.branchName.substring(0, (jsonObj.branchs[0]?.branchName).indexOf('-')));
            setBranchName(jsonObj.branchs[0]?.branchName.substring((jsonObj.branchs[0]?.branchName).indexOf("-") + 1));
        }
    }, [branchName, branchCode]);

    const renderItemLeaderTopList = (item, extraIndex) => {
        return (
            <View style={{ backgroundColor: "white", padding: 10, width: '100%' }}>
                {extraIndex == 0 ? <View style={{ flexDirection: 'row', width: '100%', marginBottom: 5 }}>
                    <Text style={{ color: '#F59D44', textAlign: 'center', flex: 1 }}>Rank</Text>
                    <Text style={{ color: '#D81F9F', textAlign: 'center', flex: 1 }}>Branch</Text>
                    <Text style={{ color: '#983AAA', textAlign: 'center', flex: 1 }}>Code</Text>
                    <Text style={{ color: '#328B91', textAlign: 'center', flex: 1 }}>Ret T/A%</Text>
                    <Text style={{ color: '#E54875', textAlign: 'center', flex: 1 }}>Retails</Text>
                </View> : null}
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{extraIndex + 1}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{branchName}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{branchCode}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.achivementPerc}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.targetAchivements}</Text>
                </View>
            </View>
        );
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.rankBox}>
                <View style={styles.listView}>
                    <View style={{
                        width: '98%', height: '98%'
                    }}>
                        <FlatList
                            data={toprankList}
                            nestedScrollEnabled={true}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => renderItemLeaderTopList(item, index)}
                            showsVerticalScrollIndicator={false}
                            maxToRenderPerBatch={5}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    listView: {
        height: '95%',
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
    },
    rankBox: {
        paddingTop: 5,
        paddingBottom: 10
    },
});
