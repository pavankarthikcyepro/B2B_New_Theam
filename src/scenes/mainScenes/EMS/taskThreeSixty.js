
import React, {useEffect, useState} from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, SectionList, ActivityIndicator, TouchableOpacity, Image, Platform, Linking } from "react-native";
import {useDispatch, useSelector} from "react-redux";
import { getWorkFlow, getEnquiryDetails, getLeadAge } from "../../../redux/taskThreeSixtyReducer";
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

    const { universalId, mobileNo } = route.params;
    const dispatch = useDispatch();
    const selector = useSelector(state => state.taskThreeSixtyReducer);
    const [plannedTasks, setPlannedTasks] = useState([]);
    const [closedTasks, setClosedTasks] = useState([]);
    const [dataForSectionList, setDataForSectionList] = useState([]);

    useEffect(() => {
        dispatch(getEnquiryDetails(universalId));
    }, [])

    useEffect(() => {
        navigation.addListener('focus', () => {
            dispatch(getLeadAge(universalId));
        })
    }, [navigation])

    // console.log({ dataForSectionList })
    // console.log("dataForSectionList", dataForSectionList[1].data)


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
            const data = [];
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

            setPlannedTasks(plannedData);

            if (plannedData.length > 0)
                data.push({ title: "Planned Tasks", data: plannedData });
            
            if (closedData.length > 0)
                data.push({ title: "Closed Tasks", data: closedData });

            setDataForSectionList(data)
        }
    }, [selector.wrokflow_response_status, selector.wrokflow_response])

    const itemClicked = (item) => {
        console.log("ITEM: ", JSON.stringify(item));
        const taskName = item.taskName;
        const taskId = item.taskId;
        const universalId = item.universalId;
        const taskStatus = item.taskStatus;
        const mobileNumber = item.assignee?.mobile ? item.assignee?.mobile : "";

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
        navigation.navigate(navigationId, { identifier: mytasksIdentifires[finalTaskName], taskId, universalId, taskStatus, taskData: item, mobile: mobileNo });
    };

    if (selector.isLoading) {
        return(
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size="small" color={Colors.RED} />
            </View>
        )
    }

    const openMap = (latitude, longitude) => {
        // if(Platform.OS === 'ios'){
        //     Linking.openURL(`maps://app?saddr=100+101&daddr=${latitude}+${longitude}`)
        // }
        // if (Platform.OS === 'android') {
        //     Linking.openURL(`google.navigation:q=${latitude}+${longitude}`)
        // }

        // const latitude = "40.7127753";
        // const longitude = "-74.0059728";
        const label = "New York, NY, USA";

        const url = Platform.select({
            ios: "maps:" + latitude + "," + longitude,
            android: "geo:" + latitude + "," + longitude
        });

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                return Linking.openURL(url);
            } else {
                const browser_url =
                    "https://www.google.de/maps/@" +
                    latitude +
                    "," +
                    longitude;
                return Linking.openURL(browser_url);
            }
        });
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
                                <View style={{ width: "75%", padding: 5, }}>
                                    <View style={[{ backgroundColor: Colors.WHITE }, GlobalStyle.shadow]}>
                                        <TouchableOpacity onPress={() => itemClicked(item)}>
                                            <View style={[{ paddingVertical: 5, paddingLeft: 10, backgroundColor: Colors.WHITE },]}>
                                                <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 5 }}>{item.taskName}</Text>
                                                <Text style={{ fontSize: 14, fontWeight: "400" }}>{"Assignee: " + item.assignee?.empName}</Text>
                                                <Text style={{ fontSize: 14, fontWeight: "400", color: Colors.GRAY }}>{"Remarks: " + (item.employeeRemarks ? item.employeeRemarks : "")}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {item.lat && item.lon &&
                                            <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0 }} onPress={() => openMap(item.lat, item.lon)}>
                                                <View style={{ width: 35, height: 35, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#d1d1d1", borderRadius: 5 }}>
                                                    <Image style={{ height: 25, width: 15 }} source={require('../../../assets/images/location-pin.png')} />
                                                </View>
                                            </TouchableOpacity>
                                        }
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