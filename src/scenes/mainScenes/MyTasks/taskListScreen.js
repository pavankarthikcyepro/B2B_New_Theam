import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    TextInput
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { MyTaskItem } from "../../../pureComponents/myTaskItem";
import { useDispatch, useSelector } from "react-redux";
import { MyTaskNewItem } from "./components/MyTasksNewItem";
import { AppNavigator } from "../../../navigations";
import { getPendingTasksListApi, getMorePendingTasksListApi } from "../../../redux/mytaskReducer";
import * as AsyncStorage from "../../../asyncStore";
import { EmptyListView } from "../../../pureComponents";

const mytasksIdentifires = {
  testdrive: "TEST_DRIVE",
  testdriveapproval: "TEST_DRIVE_APPROVAL",
  proceedtobooking: "PROCEED_TO_BOOKING",
  proceedtoprebooking: "PROCEED_TO_PRE_BOOKING",
  prebookingfollowup: "PRE_BOOKING_FOLLOW_UP",
  homevisit: "HOME_VISIT",
  enquiryfollowup: "ENQUIRY_FOLLOW_UP",
  preenquiryfollowup: "PRE_ENQUIRY_FOLLOW_UP",
  createenquiry: "CREATE_ENQUIRY",
  "bookingfollowup-dse": "BOOKING_FOLLOW_UP",
};

const TaskListScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const [employeeId, setEmployeeId] = useState("");
    const [searchedData, setSearchedData] = useState([]);

    useEffect(() => {
        navigation.addListener('focus', () => {
            setSearchedData(route.params.data);
        })
    }, [navigation]);

    const itemClicked = (item) => {

        const taskName = item.taskName;
        const taskId = item.taskId;
        const universalId = item.universalId;
        const taskStatus = item.taskStatus;
        const mobileNumber = item.phoneNo ? item.phoneNo : "";

        const trimName = taskName.toLowerCase().trim();
        const finalTaskName = trimName.replace(/ /g, "");
        let navigationId = ""
        let taskNameNew = ''
        switch (finalTaskName) {
            case "testdrive":
                navigationId = AppNavigator.MyTasksStackIdentifiers.testDrive;
                taskNameNew = 'Test Drive'
                break;
            case "testdriveapproval":
                navigationId = AppNavigator.MyTasksStackIdentifiers.testDrive;
                taskNameNew = 'Test Drive'
                break;
            case "proceedtoprebooking":
                navigationId = AppNavigator.MyTasksStackIdentifiers.proceedToPreBooking;
                taskNameNew = ''
                break;
            case "proceedtobooking":
                navigationId = AppNavigator.MyTasksStackIdentifiers.proceedToPreBooking;
                taskNameNew = ''
                break;
            case "homevisit":
                navigationId = AppNavigator.MyTasksStackIdentifiers.homeVisit;
                taskNameNew = 'Home Visit'
                break;
            case "enquiryfollowup":
                navigationId = AppNavigator.MyTasksStackIdentifiers.enquiryFollowUp;
                taskNameNew = 'Enquiry Followup'
                break;
            case "preenquiryfollowup":
                navigationId = AppNavigator.MyTasksStackIdentifiers.enquiryFollowUp;
                taskNameNew = 'Contacts followup'
                break;
            case "prebookingfollowup":
                navigationId = AppNavigator.MyTasksStackIdentifiers.enquiryFollowUp;
                taskNameNew = 'Booking approval task'
                break;
            case "bookingfollowup-dse":
                navigationId = AppNavigator.MyTasksStackIdentifiers.bookingFollowUp;
                taskNameNew = "Booking Followup -DSE";
                break;
            case "createenquiry":
                navigationId = AppNavigator.MyTasksStackIdentifiers.createEnquiry;
                taskNameNew = ''
                break;
        }
        if (!navigationId) { return }
        navigation.navigate(navigationId, { identifier: mytasksIdentifires[finalTaskName], taskId, universalId, taskStatus, taskData: item, mobile: mobileNumber, reasonTaskName: taskNameNew });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view1}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{ width: '90%', height: 40, borderWidth: 1, borderColor: '#333', borderRadius: 5, justifyContent: 'center', paddingHorizontal: 15, marginBottom: 10, marginTop: 5 }}>
                        <TextInput
                            style={{ color: '#333', fontSize: 15, fontWeight: '500' }}
                            placeholder={"Search"}
                            placeholderTextColor={"#333"}
                            onChangeText={(text) => {
                                if(text.trim() === ''){
                                    setSearchedData(route.params.data);
                                }
                                else{
                                    let tempData = [];
                                    tempData = route.params.data.filter(item => {
                                        return (
                                          item.customerName
                                            .toLowerCase()
                                            .includes(text.toLowerCase()) ||
                                          item.phoneNo
                                            .toLowerCase()
                                            .includes(text.toLowerCase()) ||
                                          item.model
                                            .toLowerCase()
                                            .includes(text.toLowerCase()) ||
                                          item.sourceType
                                            .toLowerCase()
                                            .includes(text.toLowerCase()) ||
                                          item.salesExecutive
                                            .toLowerCase()
                                            .includes(text.toLowerCase())
                                        );
                                    })
                                    if(tempData.length > 0){
                                        setSearchedData([...tempData])
                                    }
                                    else{
                                        setSearchedData([])
                                    }
                                }
                            }}
                        />
                    </View>
                </View>
                <FlatList
                    data={searchedData}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0}
                    // ItemSeparatorComponent={() => {
                    //     return <View style={styles.separator}></View>;
                    // }}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{marginHorizontal: 10}}>
                                <MyTaskNewItem
                                        name={item.customerName}
                                        uniqueId={item.taskId}
                                        navigator={navigation}
                                        type='task'
                                        status={item.taskStatus}
                                        created={item.createdOn}
                                        dmsLead={item.salesExecutive}
                                        phone={item.phoneNo}
                                        source={item.sourceType}
                                        model={item.model}
                                        onDocPress={() =>{
                                             itemClicked(item)}}
                                />
                                {/* <Text style={GlobalStyle.underline}></Text> */}
                            </View>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default TaskListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.LIGHT_GRAY,
    },
    view1: {
        // paddingHorizontal: 15,
        marginTop: 20,
        marginBottom: '15%'
    },
    listBgVw: {
        // width: "100%",
        // backgroundColor: Colors.WHITE,
        // paddingHorizontal: 10,
        // paddingVertical: 5,
        // borderRadius: 8,
        // elevation: 3
    },
    // separator: {
        // height: 9,
    // },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: Colors.GRAY,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 5
    },
});
