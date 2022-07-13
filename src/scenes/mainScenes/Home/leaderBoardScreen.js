import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, LogBox } from 'react-native'
import { Colors } from '../../../styles';
import * as AsyncStore from '../../../asyncStore';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import ArrowIcon from "react-native-vector-icons/FontAwesome";
import { getLeaderBoardList } from "../../../redux/homeReducer";
import { LoaderComponent } from '../../../components';
import moment from 'moment';
import { showToast } from '../../../utils/toast';

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

export default function leaderBoardScreen() {
    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [showTop5View, setShowTop5View] = useState(false);
    const [showBottom5View, setShowBottom5View] = useState(false);
    const [groupDealerRank, setGroupDealerRank] = useState(null);
    const [groupDealerCount, setGroupDealerCount] = useState(null);
    const [top5RankList, setTop5RankList] = useState([]);
    const [topRankList, setTopRankList] = useState([]);
    const [bottom5RankList, setBottom5RankList] = useState([]);
    const [reversebottomRankList, setReverseBottomRankList] = useState([]);

    
    useEffect(async () => {
        LogBox.ignoreAllLogs();
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
        };
    }, []);
    useEffect(()=>{

        if(selector.leaderboard_list && selector.leaderboard_list.length > 0)
        {
            let top = selector.leaderboard_list;
            let bottom = [];
            bottom = selector.leaderboard_list;
            setTimeout(() => {
                setTopRankList(top);
                setTop5RankList(top.slice(0, 5));
            }, 2000);

            setTimeout(() => {
                setBottom5RankList([...bottom].reverse().slice(0, 5));
                setReverseBottomRankList([...bottom].reverse());
            }, 2000);
        }
        

    }, [selector.leaderboard_list])


    const getLeaderboardListFromServer = async () => {
        var date = new Date();
       let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
       const jsonObj = await JSON.parse(employeeData);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let payload = {
            "endDate": moment.utc(lastDay).format('YYYY-MM-DD'),
            "levelSelected": null,
            "loggedInEmpId": jsonObj.empId,
            "pageNo": 1,
            "size": 50,
            "startDate": moment.utc(firstDay).format('YYYY-MM-DD')
        };
        console.log("leader board"+JSON.stringify(payload))
       // alert(JSON.stringify(payload))
        dispatch(getLeaderBoardList(payload));
    }

    useEffect(async () => {
        LogBox.ignoreAllLogs();
       // alert(JSON.stringify(topRankList))
       // if(topRankList && topRankList.length > 1)
        getLeaderboardListFromServer();

        let top = selector.leaderboard_list;
        let bottom = [];
        bottom = selector.leaderboard_list;
        setTimeout(() => {
            setTopRankList(top);
            setTop5RankList(top.slice(0, 5));
        }, 2000);
        
        setTimeout(() => {
            setBottom5RankList([...bottom].reverse().slice(0, 5));
            setReverseBottomRankList([...bottom].reverse());
        }, 2000);
    }, []);

    const renderItemLeaderTopList = (item, extraIndex) => {
        return (
            <View style={{ backgroundColor: "white", padding: 10, width: '100%' }}>
                {extraIndex == 0 ? <View style={{ flexDirection: 'row', width: '100%', marginBottom: 5 }}>
                    <Text style={{ color: '#F59D44', textAlign: 'center', flex: 1  }}>Rank</Text>
                    <Text style={{ color: '#D81F9F', textAlign: 'center', flex: 1 }}>Branch</Text>
                    <Text style={{ color: '#983AAA', textAlign: 'center', flex: 1 }}>Code</Text>
                    <Text style={{ color: '#328B91', textAlign: 'center', flex: 1 }}>Ret T/A%</Text>
                    <Text style={{ color: '#E54875', textAlign: 'center', flex: 1 }}>Retails</Text>
                </View> : null}
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.rank}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.branchName}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.branchCode}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.achivementPerc}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.targetAchivements}</Text>
                </View>
            </View>
        );
    };

    const renderItemLeaderBottomList = (item, extraIndex) => {
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
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.rank}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.branchName}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.branchCode}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.achivementPerc}</Text>
                    <Text style={{ color: 'black', textAlign: 'center', flex: 1 }}>{item.targetAchivements}</Text>
                </View>
            </View>
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

               {/*} <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, justifyContent: 'space-around', width: '100%', padding: 10 }}>
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
            */}
                {top5RankList.length && bottom5RankList.length ? null : <LoaderComponent
                    visible={selector.isLoading}
                    onRequestClose={() => { }}
                />}

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
                        height: showTop5View ? 480 : 280,
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
                        <View style={{
                            width: '98%', height: showTop5View ? 430 : 230
                        }}>
                            <FlatList
                                data={showTop5View ? topRankList : top5RankList}
                                nestedScrollEnabled={true}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => renderItemLeaderTopList(item, index)}
                                showsVerticalScrollIndicator={false}
                                maxToRenderPerBatch={5}
                            />
                        </View>

                        <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { setShowTop5View(!showTop5View); }}>
                            <Text style={{ color: 'red', alignSelf: 'flex-end', margin: 12 }}>{showTop5View ? 'View Less' : 'View All'}</Text>
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
                        height: showBottom5View ? 480 : 280,
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
                        <View style={{ width: '98%', height: showBottom5View ? 430 : 230 }}>
                            <FlatList
                                data={showBottom5View ? reversebottomRankList : bottom5RankList}
                                nestedScrollEnabled={true}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => renderItemLeaderBottomList(item, index)}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>

                        <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { setShowBottom5View(!showBottom5View); }}>
                            <Text style={{ color: 'red', alignSelf: 'flex-end', margin: 12 }}>{showBottom5View ? 'View Less' : 'View All'}</Text>
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
