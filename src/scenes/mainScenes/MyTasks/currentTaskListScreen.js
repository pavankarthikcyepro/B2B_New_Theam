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
    RefreshControl
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { MyTaskItem } from "../../../pureComponents/myTaskItem";
import { useDispatch, useSelector } from "react-redux";
import { AppNavigator } from "../../../navigations";
import { getCurrentTasksListApi, getMoreCurrentTasksListApi } from "../../../redux/mytaskReducer";
import * as AsyncStorage from "../../../asyncStore";
import { EmptyListView } from "../../../pureComponents";

const screenWidth = Dimensions.get("window").width;

const mytasksIdentifires = {
    testdrive: "TEST_DRIVE",
    proceedtobooking: "PROCEED_TO_BOOKING",
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

const CurrentTaskListScreen = ({ navigation }) => {
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
            dispatch(getCurrentTasksListApi(endUrl));
            setEmployeeId(empId);
        }
    }

    const getMoreMyTasksListFromServer = async () => {
        if (employeeId && ((selector.currentPageNumber + 1) < selector.currnetTotalPages)) {
            const endUrl = `empid=${employeeId}&limit=10&offset=${selector.currentPageNumber + 1}`;
            dispatch(getMoreCurrentTasksListApi(endUrl));
        }
    }

    const itemClicked = (taskName, taskId, universalId, taskStatus) => {
        const trimName = taskName.toLowerCase().trim();
        const finalTaskName = trimName.replace(/ /g, "");
        let navigationId = ""
        switch (finalTaskName) {
            case "testdrive":
                navigationId = AppNavigator.MyTasksStackIdentifiers.testDrive;
                break;
            case "proceedtoprebooking":
                navigationId = AppNavigator.MyTasksStackIdentifiers.proceedToPreBooking;
                break;
            case "proceedtobooking":
                console.log("not implemented");
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
        navigation.navigate(navigationId, { identifier: mytasksIdentifires[finalTaskName], taskId, universalId, taskStatus });
    };

    const renderFooter = () => {
        if (!selector.isLoadingExtraDataForCurrentTask) { return null }
        return (
            <View style={styles.footer}>
                <Text style={styles.btnText}>Loading More...</Text>
                <ActivityIndicator color={Colors.GRAY} />
            </View>
        );
    };

    if (selector.currentTableData.length === 0) {
        return (
            <EmptyListView title={"No Data Found"} isLoading={selector.isLoadingForCurrentTask} />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view1}>
                <FlatList
                    data={selector.currentTableData}
                    extraData={selector.currentTableData}
                    refreshControl={(
                        <RefreshControl
                            refreshing={selector.isLoadingForCurrentTask}
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
                                    <Pressable onPress={() => itemClicked(item.taskName, item.taskId, item.universalId, item.taskStatus)}>
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

export default CurrentTaskListScreen;

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