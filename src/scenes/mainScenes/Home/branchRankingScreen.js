import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, LogBox } from 'react-native';
import * as AsyncStore from '../../../asyncStore';
import { useDispatch, useSelector } from 'react-redux';
import { getBranchRanksList } from "../../../redux/homeReducer";
import { LoaderComponent } from '../../../components';
import moment from 'moment';

export default function branchRankingScreen() {
    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [branchName, setBranchName] = useState(null);
    const [branchCode, setBranchCode] = useState(null);
    const [branchList, setBranchList] = useState([]);

    const getBranchRankListFromServer = async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        const jsonObj = await JSON.parse(employeeData);
        const branchId = await AsyncStore.getData(
            AsyncStore.Keys.SELECTED_BRANCH_ID
        );
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let payload = {
            "endDate": moment.utc(lastDay).format('YYYY-MM-DD'),
            "levelSelected": null,
            "loggedInEmpId": jsonObj.empId,
            "pageNo": 1,
            "size": 50,
            "startDate": moment.utc(firstDay).format('YYYY-MM-DD'),
            //not for payload, just to add in params
            "orgId":jsonObj.orgId,
            "branchId":jsonObj.branchId

        };
        dispatch(getBranchRanksList(payload));
    }

    useEffect(async () => {
        LogBox.ignoreAllLogs();
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            setBranchCode(jsonObj.branchs[0]?.branchName.substring(0, (jsonObj.branchs[0]?.branchName).indexOf('-')));
            setBranchName(jsonObj.branchs[0]?.branchName.substring((jsonObj.branchs[0]?.branchName).indexOf("-") + 1));
        }
        getBranchRankListFromServer();
        setTimeout(() => {
            setBranchList(selector.branchrank_list);
        }, 2000);
    }, []);
    useEffect(()=>{
        if (selector.branchrank_list && selector.branchrank_list.length > 0){
            setTimeout(() => {
                setBranchList(selector.branchrank_list);
            }, 2000);
        }

    }, [selector.branchrank_list])

    const renderItemLeaderTopList = (item, extraIndex) => {
        return (
            <View style={{ backgroundColor: "white", padding: 10, width: '100%' }}>
                {extraIndex == 0 ? <View style={{ flexDirection: 'row', width: '100%', marginBottom: 5 }}>
                    <Text style={{ color: '#F59D44', textAlign: 'center', flex: 1 }}>Rank</Text>
                    <Text style={{ color: '#D81F9F', textAlign: 'center', flex: 1 }}>Employee Name</Text>
                    <Text style={{ color: '#983AAA', textAlign: 'center', flex: 1 }}>Branch</Text>
                    <Text style={{ color: '#328B91', textAlign: 'center', flex: 1 }}>Ret T/A%</Text>
                    <Text style={{ color: '#E54875', textAlign: 'center', flex: 1 }}>Retails</Text>
                </View> : null}
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{extraIndex + 1}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.empName}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.branchName}</Text>
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

                        {branchList.length ? null : <LoaderComponent
                            visible={selector.isLoading}
                            onRequestClose={() => { }}
                        />}

                        <FlatList
                            data={branchList}
                            nestedScrollEnabled={true}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => renderItemLeaderTopList(item, index)}
                            showsVerticalScrollIndicator={false}
                            extraData={branchList}
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
