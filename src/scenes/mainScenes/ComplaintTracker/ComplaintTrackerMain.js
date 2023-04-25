import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import { Colors, GlobalStyle } from '../../../styles'
import Entypo from "react-native-vector-icons/FontAwesome";
import { ComplainTrackerIdentifires, HomeStackIdentifiers } from '../../../navigations/appNavigator';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ComplaintList from './ComplaintList';
import ClosedComplaintList from './ClosedComplaintList';
import { useState } from 'react';
import { useEffect } from 'react';
import * as AsyncStore from "../../../asyncStore";
import { useDispatch, useSelector } from 'react-redux';
import { getComplaintTrackerDashboardFiltered, getCountsComplaintsDashboard, getEmpComplaintDashboard } from '../../../redux/complaintTrackerReducer';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { IconButton } from 'react-native-paper';
import _ from "lodash"
import { getOrganaizationHirarchyList } from '../../../redux/homeReducer';
const data = [
    {
        id: 0,
        name: "Active"
    },
    {
        id: 1,
        name: "Closed"
    }
]
const tabBarOptions = {
    activeTintColor: Colors.RED,
    inactiveTintColor: Colors.DARK_GRAY,
    indicatorStyle: {
        backgroundColor: Colors.RED,
    },
    labelStyle: {
        fontSize: 12,
        fontWeight: "600",
    },
}


const Badge = ({ focused, title, countList }) => {
    return (
        <View style={styles.tabContainer}>
            <Text
                style={[
                    styles.titleText,
                    { color: focused ? Colors.RED : Colors.DARK_GRAY },
                ]}
            >
                {title}
            </Text>
            <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                    {/* {title == "CONTACTS"
            ? countList
              ? countList.length
              : 0
            : countList && countList?.dmsEntity?.leadDtoPage?.totalElements > 0
            ? countList.dmsEntity.leadDtoPage.totalElements
            : 0} */}
                    {countList && countList}
                </Text>
            </View>
        </View>
    );
};

const ComplaintsTrackerTopTab = createMaterialTopTabNavigator();


export const ComplaintsTrackerTopTabNavigator = () => {
    const { activeTotalCount, closeTotalCount } = useSelector((state) => state.complaintTrackerReducer);
   
    return (
        <ComplaintsTrackerTopTab.Navigator
            initialRouteName={ComplainTrackerIdentifires.complainTrackerList}
            tabBarOptions={tabBarOptions}
        >
            <ComplaintsTrackerTopTab.Screen
                name={"Active"}
                component={ComplaintList}
                options={{
                    title: ({ focused }) => (
                        <Badge
                            title={"Active"}
                            focused={focused}
                            countList={activeTotalCount}
                        />
                    ),
                }}
                initialParams={{
                    screenName: "",
                    params: ""
                }}
            />
            <ComplaintsTrackerTopTab.Screen
                name={"Closed"}
                component={ClosedComplaintList}
                options={{
                    title: ({ focused }) => (
                        <Badge title={"Closed"} focused={focused} countList={closeTotalCount} />
                    ),
                }}
            />

        </ComplaintsTrackerTopTab.Navigator>
    );
};

const receptionistRole = ["Reception", "Tele Caller", "CRE"];
const ComplaintTrackerMain = ({ route, navigation }) => {
    const selector = useSelector((state) => state.complaintTrackerReducer);
    const dispatch = useDispatch();
    const [totalActiveCounts, setTotalActiveCounts] = useState(0);
    const [totalCloseCounts, setTotalCloseCounts] = useState(0);
    const [userData, setUserData] = useState({
        orgId: "",
        employeeId: "",
        employeeName: "",
        isManager: false,
        editEnable: false,
        isPreBookingApprover: false,
        isSelfManager: "",
        isCRM: false,
        isCRE: false,
        hrmsRole:"",
    });

    useEffect(() => {
        // navigation.addListener("focus", () => {
            getUserData()
        // });
    }, [selector.receptionistFilterIds, selector.postComplaintFirstTimeRes, selector.postComplaintCloseRes, selector.saveCRMfilterObj]);

    useEffect(() => {
        if (!_.isEmpty(selector.complaintTrackerDashboardData.dropDownData)){
            let tempActiveCount = 0;
            let tempCloseCount = 0;
            let tempActive = selector.complaintTrackerDashboardData.dropDownData.forEach((item)=>{
                tempActiveCount = tempActiveCount+item.activeCount;
                tempCloseCount = tempCloseCount + item.closedCount;
            })
            setTotalCloseCounts(tempCloseCount);
            setTotalActiveCounts(tempActiveCount);
            
        }
    
      
    }, [selector.complaintTrackerDashboardData])
    
    
    const getUserData = async () => {
        try {
            const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
            );

            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);

                let isManager = false,
                    editEnable = false, isCRE, isCRM;
                let isPreBookingApprover = false;
                if (
                    jsonObj.hrmsRole === "MD" ||
                    jsonObj.hrmsRole === "General Manager" ||
                    jsonObj.hrmsRole === "Manager" ||
                    jsonObj.hrmsRole === "Sales Manager" ||
                    jsonObj.hrmsRole === "branch manager"
                ) {
                    isManager = true;
                }
                if (jsonObj.roles.includes("PreBooking Approver")) {

                    editEnable = true;
                    isPreBookingApprover = true;
                }

                if (
                    jsonObj.hrmsRole === "CRE" || receptionistRole.includes(jsonObj.hrmsRole)

                ) {
                    isCRE = true;
                }

                if (
                    jsonObj.hrmsRole === "CRM" || jsonObj?.isTeam.toLowerCase().includes("y")

                ) {
                    isCRM = true;
                }

               
                setUserData({
                    orgId: jsonObj.orgId,
                    employeeId: jsonObj.empId,
                    employeeName: jsonObj.empName,
                    isManager: isManager,
                    editEnable: editEnable,
                    isPreBookingApprover: isPreBookingApprover,
                    isSelfManager: jsonObj.isSelfManager,
                    isCRM: isCRM,
                    isCRE: isCRE,
                    hrmsRole:jsonObj.hrmsRole
                });
                let payload = {
                    empId: jsonObj.empId
                }

                // dispatch(getCountsComplaintsDashboard(payload));

                if (!_.isEmpty(selector.receptionistFilterIds)){
                   
                    let payload=
                    {
                        "orgId": jsonObj.orgId,
                        "startDate": selector.receptionistFilterIds.startDate,
                        "endDate": selector.receptionistFilterIds.endDate,
                        "loginEmpName": jsonObj.empName,
                        "dealerName": selector.receptionistFilterIds.dealerCodes,
                        "designation": [],
                        "selectedEmpName": [],
                        "locationName": []
                    }
                    dispatch(getComplaintTrackerDashboardFiltered(payload))
                    
                } else if (!_.isEmpty(selector.saveCRMfilterObj?.selectedDesignation)) {
                    let payload =
                    {
                        "orgId": jsonObj.orgId,
                        "startDate": selector.saveCRMfilterObj?.startDate,
                        "endDate": selector.saveCRMfilterObj?.endDate,
                        "loginEmpName": jsonObj.empName,
                        "dealerName": selector.saveCRMfilterObj?.dealerCodes,
                        "designation": selector.saveCRMfilterObj?.selectedDesignation,
                        "selectedEmpName": selector.saveCRMfilterObj?.selectedEmpNAme,
                        "locationName": []
                    }
                    dispatch(getComplaintTrackerDashboardFiltered(payload))

                }else{
                    
                    dispatch(getEmpComplaintDashboard(payload));
                }
                

                navigation.setOptions(
                    {
                        headerTitleStyle: {
                            fontSize: 16,
                            fontWeight: "600",
                          
                      
                        },
                        headerStyle: {
                            backgroundColor: Colors.DARK_GRAY,
                         
                        },
                        title:jsonObj.empName,
                        headerTintColor: Colors.WHITE,
                        headerBackTitleVisible: false,
                        headerRight: () => (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {/* <SearchIcon /> */}
                                {/* <MyTaskFilter navigation={navigation} /> */}
                                <IconButton
                                    icon="filter-outline"
                                    style={{ paddingHorizontal: 0, marginHorizontal: 0 }}
                                    color={Colors.WHITE}
                                    size={25}
                                    onPress={() => {
                                        if (jsonObj.hrmsRole == "CRM" || jsonObj?.isTeam.toLowerCase().includes("y")) {
                                            navigation.navigate(ComplainTrackerIdentifires.complaintTrackerCRMFilter);
                                        } else {
                                            navigation.navigate(ComplainTrackerIdentifires.complaintTrackerBasicFilter);
                                        }

                                    }
                                    }
                                />
                            </View>
                        ),
                    });
            }
        } catch (error) {
            alert(error);
        }
    };

    const MyTaskFilter = ({ navigation }) => {
        const screen = useSelector((state) => state.mytaskReducer.currentScreen);
        if (screen === "TODAY") return <React.Fragment></React.Fragment>;
        return (
            <IconButton
                icon="filter-outline"
                style={{ paddingHorizontal: 0, marginHorizontal: 0 }}
                color={Colors.WHITE}
                size={25}
                onPress={() => {
                    if(userData.hrmsRole == "CRM"){
                        navigation.navigate(ComplainTrackerIdentifires.complaintTrackerCRMFilter);       
                    }else{
                        navigation.navigate(ComplainTrackerIdentifires.complaintTrackerBasicFilter);
                    }
                  
                }
                }
            />
        );
    };
    const renderItem = (item, index) => {

        return (
            <View style={{
                width: '100%',
                padding: 10,
                borderColor: index === 0 ? Colors.PURPLE : Colors.BLUE_V2,
                borderWidth: 1,
                borderRadius: 10,
                justifyContent: "center",
                marginVertical: 10

            }}>
                <View style={styles.scondView}>
                    <Text style={{
                        fontSize: 16,
                        color: index === 0 ? Colors.CORAL : Colors.GREEN_V2,
                        fontWeight: "700",
                        paddingVertical: 10
                    }}>{item.name}</Text>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate(ComplainTrackerIdentifires.complainTrackerTop);
                    }}>
                        {selector.complaintCountDashboard !== "" ? <Text style={styles.txt1}>{item.id === 0 ? selector.complaintCountDashboard?.activeCount
                            : selector.complaintCountDashboard?.closedCount}</Text> : <Text style={styles.txt1}>0</Text>}   
                    </TouchableOpacity>
                </View>
            </View>)
    }

    const totalofListRow = useCallback(
        (
            empName, AtiveCount, ClosedCount, isViewDetailsVisible = false, isShowUnderLine = false, itemData
        ) => {
            return (<>
                <View style={{
                    flexDirection: "row",
                    // justifyContent: "space-around",
                    // alignItems: "center",
                    // // height: '15%',
                    // alignContent: "center",
                    width: "100%",
                    // backgroundColor:"red"
                    // marginTop: 5,
                    // justifyContent:"space-between"

                }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.TitleTabelText,{color:Colors.BLUE,fontSize:14}]}>{empName}</Text>
                    </View>
                    <View style={{ flexDirection: "row", flex: 1 }}>
                        <Pressable
                            style={{ flex: 1 }}
                            onPress={() => {
                                // navigation.navigate(ComplainTrackerIdentifires.complainTrackerTop);
                                // setTimeout(() => {
                                //     navigation.navigate("Active", {
                                //         screenName: "ComplaintMaster",
                                //         params: itemData,

                                //     });
                                // }, 500);
                            }}>
                            <Text style={{
                                fontSize: 12,
                                color: Colors.BLACK,
                                textAlign: "center",
                                marginEnd: 10,
                                textDecorationLine: isShowUnderLine ? "underline" : "none"
                                // flex: 1
                                // width: 50,
                            }}>{AtiveCount}</Text>
                        </Pressable>
                        <Pressable
                            style={{ flex: 1 }}
                            onPress={() => {
                                // navigation.navigate(ComplainTrackerIdentifires.complainTrackerTop);
                                // setTimeout(() => {
                                //     navigation.navigate("Closed", {
                                //         screenName: "ComplaintMaster",
                                //         params: itemData,

                                //     });
                                // }, 500);
                            }}>
                            <Text style={{
                                fontSize: 12,
                                color: Colors.BLACK,
                                textAlign: "center",
                                marginEnd: 10,
                                textDecorationLine: isShowUnderLine ? "underline" : "none"
                                // flex: 1
                                // width: 50,
                            }}>{ClosedCount}</Text>
                        </Pressable>

                    </View>
                    {isViewDetailsVisible ? <Pressable style={{ flexDirection: "row", flex: 1 }}
                        onPress={() => {
                            // navigation.navigate(ComplainTrackerIdentifires.complaintTrackerMaster, {
                            //     isFromLogin: false,
                            //     dataObject: itemData
                            // });
                        }}
                    >
                        <Text style={[styles.TitleTabelText, { color: Colors.BLUE, textDecorationLine: "underline", textAlign: "center", }]}>Detailed view</Text>

                    </Pressable> : <View style={{ fflexDirection: "row", flex: 1 }}>
                        <Text style={styles.TitleTabelText}></Text>

                    </View>}
                </View>

            </>)
        }
    );

    
    const eventListTableRow = useCallback(
        (
            empName,AtiveCount,ClosedCount, isViewDetailsVisible=false,isShowUnderLine=false, itemData,isDisabled= true
        ) => {
            return (<>
                <View style={{
                    flexDirection: "row",
                    // justifyContent: "space-around",
                    // alignItems: "center",
                    // // height: '15%',
                    // alignContent: "center",
                    width: "100%",
                    // backgroundColor:"red"
                    // marginTop: 5,
                    // justifyContent:"space-between"

                }}>
                    <View style={{flex:1}}>
                        <Text style={styles.TitleTabelText}>{empName}</Text>
                    </View>
                    <View style={{flexDirection:"row",flex:1   }}>
                        <Pressable
                            disabled={isDisabled}
                            style={{ flex: 1 }}
                        onPress={()=>{
                            navigation.navigate(ComplainTrackerIdentifires.complainTrackerTop);
                            setTimeout(() => {
                                navigation.navigate("Active", {
                                    screenName: "ComplaintMaster",
                                    params: itemData,

                                });
                            }, 500);
                        }}>
                            <Text style={{
                                fontSize: 12,
                                color: Colors.BLACK,
                                textAlign: "center",
                                marginEnd: 10,
                                textDecorationLine: isShowUnderLine?"underline" : "none"
                                // flex: 1
                                // width: 50,
                            }}>{AtiveCount}</Text>
                        </Pressable>
                       <Pressable 
                            disabled={isDisabled}
                            style={{ flex: 1 }}
                       onPress ={()=>{
                            navigation.navigate(ComplainTrackerIdentifires.complainTrackerTop);
                            setTimeout(() => {
                                navigation.navigate("Closed", {
                                    screenName: "ComplaintMaster",
                                    params: itemData,

                                });
                            }, 500);
                       }}>
                            <Text style={{
                                fontSize: 12,
                                color: Colors.BLACK,
                                textAlign: "center",
                                marginEnd: 10,
                                textDecorationLine: isShowUnderLine ? "underline" : "none"
                                // flex: 1
                                // width: 50,
                            }}>{ClosedCount}</Text>
                       </Pressable>
                        
                    </View>
                    {isViewDetailsVisible ? <Pressable style={{ flexDirection: "row",flex:1 }}
                     onPress={()=>{
                         navigation.navigate(ComplainTrackerIdentifires.complaintTrackerMaster, {
                             isFromLogin: false,
                             dataObject:itemData
                         });
                     }}
                    >
                        <Text style={[styles.TitleTabelText, { color: Colors.BLUE, textDecorationLine: "underline", textAlign: "center", }]}>Detailed view</Text>

                    </Pressable> : <View style={{ fflexDirection: "row", flex: 1 }}>
                            <Text style={styles.TitleTabelText}></Text>

                    </View>} 
                </View>

            </>)
        }
    );
    
    const renderItemV2 = (item, index) => {
        
       
        return (<>
           
            <View style={{
                width: '100%',
                padding: 10,
                // borderColor: index === 0 ? Colors.PURPLE : Colors.BLUE_V2,
                // borderWidth: 1,
                borderRadius: 10,
                justifyContent: "center",
                marginVertical: 10,
                backgroundColor:Colors.WHITE

            }}>
               
               
            </View></>)
    }


    return (
        <SafeAreaView style={styles.conatiner}>
            <View style={{ padding: 10, }}>
                <View
                    style={{
                       backgroundColor:Colors.WHITE,
                       padding:10,
                    }}
                >
                    <View
                        style={{
                            padding: 10
                        }}>
                        {eventListTableRow("Employee Name", "Active", "Closed")}    
                    </View>
                    <View style={{
                        padding: 10
                    }}>
                        {!_.isEmpty(selector.receptionistFilterIds) && !_.isEmpty(selector.complaintDashboardFilterData_CRE) ? 
                        <>
                                <FlatList
                                    data={selector.complaintDashboardFilterData_CRE}
                                    bounces={false}
                                    renderItem={({ item, index }) => {


                                        return (
                                            <>
                                                <View style={{ marginVertical: 10 }}>
                                                    {eventListTableRow(item.employeeName + "\n" + item.designation, item.activeCount, item.closedCount, true, true, item,false)}

                                                </View>


                                            </>
                                        );
                                    }


                                    }
                                />
                        </> 
                        
                        :
                        <>
                                {userData.hrmsRole.includes("DSE") && !_.isEmpty(selector.complaintTrackerDashboardData) ? <View style={{ marginVertical: 10 }}>
                                    {eventListTableRow(selector.complaintTrackerDashboardData?.employeeName + "\n" + selector.complaintTrackerDashboardData?.designation,
                                        selector.complaintTrackerDashboardData?.activeCount, selector.complaintTrackerDashboardData?.closedCount, true, true, selector.complaintTrackerDashboardData,false)}

                                </View> : 
                                <>
                                        <FlatList
                                            data={selector.complaintTrackerDashboardData.dropDownData}
                                            bounces={false}
                                            renderItem={({ item, index }) => {


                                                return (
                                                    <>
                                                        <View style={{ marginVertical: 10 }}>
                                                            {eventListTableRow(item.employeeName + "\n" + item.designation, item.activeCount, item.closedCount, true, true, item,false)}

                                                        </View>


                                                    </>
                                                );
                                            }


                                            }
                                        />
                                        <View style={{marginVertical:10}}>
                                            {totalofListRow("Total", totalActiveCounts, totalCloseCounts)}
                                        </View>
                                        
                                        </>
                                
                                }
                        </>
                        } 
                        
                       
                

                    </View>
                    
                </View>
               
                
            </View>

            {/* <View style={{ padding: 10, }}>
                <FlatList
                    data={data}
                    bounces={false}
                    renderItem={({ item, index }) => renderItem(item, index)}
                />
            </View> */}
            {userData.isCRE || userData.isCRM ? <TouchableOpacity
                onPress={() => {
                    navigation.navigate(ComplainTrackerIdentifires.addEditComplaint, {
                        from: "ADD_NEW"
                    });
                }}
                style={[GlobalStyle.shadow, styles.floatingBtn]}
            >
                <Entypo size={25} name="plus" color={Colors.WHITE} />
            </TouchableOpacity> : null}


        </SafeAreaView>
    )
}

export default ComplaintTrackerMain

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,

        backgroundColor: Colors.LIGHT_GRAY,
    },
    scondView: {
        flexDirection: "column",
        margin: 10,
    },
    txt1: {
        fontSize: 16,
        color: Colors.BLACK,
        fontWeight: "600",
        textDecorationLine: 'underline'
    },
    floatingBtn: {
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        position: "absolute",
        bottom: 40,
        right: 10,
        height: 50,
        backgroundColor: "rgba(255,21,107,6)",
        borderRadius: 100,
    },

    tabContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        position: "relative",
    },
    titleText: {
        fontSize: 12,
        fontWeight: "600",
    },
    badgeContainer: {
        marginLeft: 3,
        bottom: 4,
        alignSelf: "flex-start",
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: { fontSize: 13, color: Colors.PINK, fontWeight: "bold" },
    TitleTabelText: {
        fontSize: 12,
        color: Colors.BLACK,
        textAlign: "left",
        marginEnd: 10,
        flex:1
        // width: 100,
    },
})