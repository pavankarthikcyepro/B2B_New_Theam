import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Pressable,
    RefreshControl
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { MyTaskItem } from "../../../pureComponents/myTaskItem";
import { useDispatch, useSelector } from "react-redux";
import { AppNavigator } from "../../../navigations";
import { getPendingTasksListApi, getMorePendingTasksListApi } from "../../../redux/mytaskReducer";
import * as AsyncStorage from "../../../asyncStore";
import { EmptyListView } from "../../../pureComponents";
import AnimLoaderComp from "../../../components/AnimLoaderComp";


const mytasksIdentifires = {
    testdrive: "TEST_DRIVE",
    testdriveapproval: "TEST_DRIVE_APPROVAL",
    proceedtobooking: "PROCEED_TO_BOOKING",
    proceedtoprebooking: "PROCEED_TO_PRE_BOOKING",
    prebookingfollowup: "PRE_BOOKING_FOLLOW_UP",
    homevisit: "HOME_VISIT",
    enquiryfollowup: "ENQUIRY_FOLLOW_UP",
    preenquiryfollowup: "PRE_ENQUIRY_FOLLOW_UP",
    createenquiry: "CREATE_ENQUIRY"
}

const taskNamesList = [
    "Pre Enquiry Follow Up",
    "Enquiry Follow Up",
    "Test Drive",
    "Test Drive Approval",
    "Home Visit",
    "Pre Booking Follow Up",
    "Booking Follow Up - DSE",
    "Proceed to Booking",
    "Proceed to Pre Booking",
    "Create Enquiry"
]

const PendingTaskListScreen = ({ navigation }) => {
    const selector = useSelector((state) => state.mytaskReducer);
    const dispatch = useDispatch();
    const [employeeId, setEmployeeId] = useState("");

    useEffect(() => {
        getMyTasksListFromServer();
    }, []);

    const getMyTasksListFromServer = async () => {
        const empId = await AsyncStorage.getData(AsyncStorage.Keys.EMP_ID);
        if (empId) {
            const endUrl = `empid=${empId}&limit=10&offset=${0}`;
            dispatch(getPendingTasksListApi(endUrl));
            setEmployeeId(empId);
        }
    }

    const getMoreMyTasksListFromServer = async () => {
        if (employeeId && ((selector.pendingPageNumber + 1) < selector.pendingTotalPages)) {
            const endUrl = `empid=${employeeId}&limit=10&offset=${selector.pendingPageNumber + 1}`;
            dispatch(getMorePendingTasksListApi(endUrl));
        }
    }

    const itemClicked = (item) => {

        const taskName = item.taskName;
        const taskId = item.taskId;
        const universalId = item.universalId;
        const taskStatus = item.taskStatus;
        const mobileNumber = item.leadDto.phone ? item.leadDto.phone : "";

        const trimName = taskName.toLowerCase().trim();
        const finalTaskName = trimName.replace(/ /g, "");
        let navigationId = ""
        switch (finalTaskName) {
            case "testdrive":
                navigationId = AppNavigator.MyTasksStackIdentifiers.testDrive;
                break;
            case "testdriveapproval":
                navigationId = AppNavigator.MyTasksStackIdentifiers.testDrive;
                break;
            case "proceedtoprebooking":
                navigationId = AppNavigator.MyTasksStackIdentifiers.proceedToPreBooking;
                break;
            case "proceedtobooking":
                navigationId = AppNavigator.MyTasksStackIdentifiers.proceedToPreBooking;
                break;
            case "homevisit":
                navigationId = AppNavigator.MyTasksStackIdentifiers.homeVisit;
                break;
            case "enquiryfollowup":
                navigationId = AppNavigator.MyTasksStackIdentifiers.enquiryFollowUp;
                break;
            case "preenquiryfollowup":
                navigationId = AppNavigator.MyTasksStackIdentifiers.enquiryFollowUp;
                break;
            case "prebookingfollowup":
                navigationId = AppNavigator.MyTasksStackIdentifiers.enquiryFollowUp;
                break;
            case "createenquiry":
                navigationId = AppNavigator.MyTasksStackIdentifiers.createEnquiry;
                break;
        }
        if (!navigationId) { return }
        navigation.navigate(navigationId, { identifier: mytasksIdentifires[finalTaskName], taskId, universalId, taskStatus, taskData: item, mobile: mobileNumber });
    };

    const renderFooter = () => {
        if (!selector.isLoadingExtraDataForPendingTask) { return null }
        return (
          <View style={styles.footer}>
            <Text style={styles.btnText}>Loading More...</Text>
            <AnimLoaderComp visible={true} />
          </View>
        );
    };

    if (selector.pendingTableData.length === 0) {
        return (
            <EmptyListView title={"No Data Found"} isLoading={selector.isLoadingForPendingTask} />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view1}>
                <FlatList
                    data={selector.pendingTableData}
                    extraData={selector.pendingTableData}
                    refreshControl={(
                        <RefreshControl
                            refreshing={selector.isLoadingForPendingTask}
                            onRefresh={getMyTasksListFromServer}
                            progressViewOffset={200}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0}
                    onEndReached={getMoreMyTasksListFromServer}
                    ListFooterComponent={renderFooter}
                    ItemSeparatorComponent={() => {
                        return <View style={styles.separator}></View>;
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ flex: 1, width: "100%" }}>
                                <View style={[styles.listBgVw]}>
                                    <Pressable onPress={() => itemClicked(item)}>
                                        <MyTaskItem
                                            taskName={item.taskName}
                                            dmsLead={item.leadDto.firstName + " " + item.leadDto.lastName}
                                            phone={item.leadDto.phone}
                                            created={item.leadDto.createdDate}
                                            status={item.taskStatus}
                                        />
                                    </Pressable>
                                </View>
                                <Text style={GlobalStyle.underline}></Text>
                            </View>
                        );
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

export default PendingTaskListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.LIGHT_GRAY,
    },
    view1: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    listBgVw: {
        width: "100%",
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    separator: {
        height: 10,
    },
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
