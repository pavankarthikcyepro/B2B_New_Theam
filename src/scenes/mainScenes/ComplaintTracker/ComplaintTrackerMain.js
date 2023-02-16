import { SafeAreaView, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors, GlobalStyle } from '../../../styles'
import Entypo from "react-native-vector-icons/FontAwesome";
import { ComplainTrackerIdentifires } from '../../../navigations/appNavigator';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ComplaintList from './ComplaintList';
import ClosedComplaintList from './ClosedComplaintList';
import { useState } from 'react';
import { useEffect } from 'react';
import * as AsyncStore from "../../../asyncStore";
import { useDispatch, useSelector } from 'react-redux';
import { getCountsComplaintsDashboard } from '../../../redux/complaintTrackerReducer';
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
                            countList={"30"}
                        />
                    ),
                }}
            />
            <ComplaintsTrackerTopTab.Screen
                name={"Closed"}
                component={ClosedComplaintList}
                options={{
                    title: ({ focused }) => (
                        <Badge title={"Closed"} focused={focused} countList={"20"} />
                    ),
                }}
            />

        </ComplaintsTrackerTopTab.Navigator>
    );
};

const ComplaintTrackerMain = ({ route, navigation }) => {
    const selector = useSelector((state) => state.complaintTrackerReducer);
    const dispatch = useDispatch();

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
    });

    useEffect(() => {
        navigation.addListener("focus", () => {
            getUserData()
        });
    }, [navigation]);
    
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
                    jsonObj.hrmsRole === "CRE"

                ) {
                    isCRE = true;
                }

                if (
                    jsonObj.hrmsRole === "CRM"

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
                });
                let payload = {
                    empId: jsonObj.empId
                }

                dispatch(getCountsComplaintsDashboard(payload));
            }
        } catch (error) {
            alert(error);
        }
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

    return (
        <SafeAreaView style={styles.conatiner}>
            <View style={{ padding: 10, }}>
                <FlatList
                    data={data}
                    bounces={false}
                    renderItem={({ item, index }) => renderItem(item, index)}
                //   contentContainerStyle={styles.titleRow}
                //   bounces={false}
                />
            </View>
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

        backgroundColor: Colors.WHITE,
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

})