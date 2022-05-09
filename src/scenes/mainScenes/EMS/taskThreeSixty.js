
import React, {useEffect, useState} from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, SectionList, ActivityIndicator, TouchableOpacity } from "react-native";
import {useDispatch, useSelector} from "react-redux";
import { getWorkFlow, getEnquiryDetails } from "../../../redux/taskThreeSixtyReducer";
import { Colors,GlobalStyle } from "../../../styles"
import moment from "moment";
import { AppNavigator } from "../../../navigations";
import { showToast } from "../../../utils/toast";

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

const TaskThreeSixtyScreen = ({ route, navigation}) => {

    const { universalId } = route.params;
    const dispatch = useDispatch();
    const selector = useSelector(state => state.taskThreeSixtyReducer);
    const [plannedTasks, setPlannedTasks] = useState([]);
    const [closedTasks, setClosedTasks] = useState([]);
    const [dataForSectionList, setDataForSectionList] = useState([]);

    useEffect(() => {
        
        dispatch(getEnquiryDetails(universalId));
    }, [])

    // Handle enquiry Details response
    useEffect(() => {
        if (selector.enquiry_leadDto_response_status === "success") {
            dispatch(getWorkFlow(universalId));
        }
    }, [selector.enquiry_leadDto_response, selector.enquiry_leadDto_response_status])


    // Handle work flow response
    useEffect(() => {
        if (selector.wrokflow_response_status === "success") {
            const plannedData = [];
            const closedData = [];
            if (selector.wrokflow_response.length > 0) {
                selector.wrokflow_response.forEach(element => {
                    if ((element.taskStatus != 'CLOSED' && selector.enquiry_leadDto_response.leadStage === element.taskCategory.taskCategory) || (element.taskCategory.taskCategory === 'APPROVAL' && element.taskStatus === 'ASSIGNED')) {
                        plannedData.push(element);
                    }
                    else if (element.taskStatus == 'CLOSED') {
                        closedData.push(element);
                    } 
                });
            }
            // console.log("planned: ", )
            setPlannedTasks(plannedData)
            const data = [
                {
                    title:"Planned Tasks",
                    data: plannedData
                },
                {
                    title: "Closed Tasks",
                    data: closedData
                }
            ]
            setDataForSectionList(data)
        }
    }, [selector.wrokflow_response_status, selector.wrokflow_response])

    const itemClicked = (item) => {

        const taskName = item.taskName;
        const taskId = item.taskId;
        const universalId = item.universalId;
        const taskStatus = item.taskStatus;
        const mobileNumber = item.assignee.mobile ? item.assignee.mobile : "";

        if (item.taskStatus == 'CLOSED') {
            showToast(item.taskName + " task has closed");
            return;
        }

        const trimName = taskName.toLowerCase().trim();
        const finalTaskName = trimName.replace(/ /g, "");
        let navigationId = ""
        switch (finalTaskName) {
            case "testdrive":
                navigationId = AppNavigator.EmsStackIdentifiers.testDrive;
                break;
            case "testdriveapproval":
                navigationId = AppNavigator.EmsStackIdentifiers.testDrive;
                break;
            case "proceedtoprebooking":
                navigationId = AppNavigator.EmsStackIdentifiers.proceedToPreBooking;
                break;
            case "proceedtobooking":
                navigationId = AppNavigator.EmsStackIdentifiers.proceedToPreBooking;
                break;
            case "homevisit":
                navigationId = AppNavigator.EmsStackIdentifiers.homeVisit;
                break;
            case "enquiryfollowup":
                navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
                break;
            case "preenquiryfollowup":
                navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
                break;
            case "prebookingfollowup":
                navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
                break;
            case "createenquiry":
                navigationId = AppNavigator.EmsStackIdentifiers.createEnquiry;
                break;
        }
        if (!navigationId) { return }
        navigation.navigate(navigationId, { identifier: mytasksIdentifires[finalTaskName], taskId, universalId, taskStatus, taskData: item, mobile: mobileNumber });
    };

    if (selector.isLoading) {
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="small" color={Colors.RED} />
            </View>
        )
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex:1}}>

                <SectionList
                    sections={dataForSectionList}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item, index, section}) => {
                        const date = moment(item.taskUpdatedTime).format("ddd MM/YY h:mm a").split(" ");

                        let topBcgColor = Colors.LIGHT_GRAY;
                        let bottomBcgColor = Colors.LIGHT_GRAY;
                        if (section.data[index - 1] != undefined) {
                            topBcgColor = Colors.GRAY;
                        }

                        if (section.data[index + 1] != undefined) {
                            bottomBcgColor = Colors.GRAY;
                        }

                        return (
                            <View style={{ width: "100%", flexDirection: "row" }}>
                                <View style={{ width: "25%", justifyContent: "center" }}>
                                    <View style={{ marginLeft: 8, flex: 1, width: 2, backgroundColor: topBcgColor }}></View>
                                    <View style={{ marginLeft: 8, flex: 1, width: 2, backgroundColor: bottomBcgColor }}></View>

                                    <View style={{ alignItems: "center", flexDirection: "row", position: "absolute" }}>
                                        <Text style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: Colors.GRAY }}></Text>
                                        <View style={{ marginLeft: 5 }}>
                                            <Text style={{ fontSize: 12, fontWeight: "400" }}>{date[0] + " " + date[1]}</Text>
                                            <Text style={{ fontSize: 12, fontWeight: "400" }}>{date[2] + " " + date[3]}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: "75%", padding: 5 }}>
                                    <View style={[{ backgroundColor: Colors.WHITE }, GlobalStyle.shadow]}>
                                        <TouchableOpacity onPress={() => itemClicked(item)}>
                                            <View style={[{ paddingVertical: 5, paddingLeft: 10, backgroundColor: Colors.WHITE },]}>
                                                <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 5 }}>{item.taskName}</Text>
                                                <Text style={{ fontSize: 14, fontWeight: "400" }}>{"Assignee: " + item.assignee.empName}</Text>
                                                <Text style={{ fontSize: 14, fontWeight: "400", color: Colors.GRAY }}>{"Remarks: " + (item.employeeRemarks ? item.employeeRemarks : "")}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ height: 50, justifyContent: "center"}}>
                            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 5 }}>{title}</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
};

export default TaskThreeSixtyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.LIGHT_GRAY
    },
})