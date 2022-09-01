
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, SectionList, ActivityIndicator, TouchableOpacity, Image, Platform, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getWorkFlow, getEnquiryDetails, getLeadAge } from "../../../redux/taskThreeSixtyReducer";
import { Colors, GlobalStyle } from "../../../styles"
import moment from "moment";
import { AppNavigator } from "../../../navigations";
import { showToast } from "../../../utils/toast";
import * as AsyncStore from "../../../asyncStore";

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
  bookingfollowupdse: "BOOKING_FOLLOW_UP",
};

const TaskThreeSixtyScreen = ({ route, navigation }) => {

    const { universalId, mobileNo, itemData, leadStatus } = route.params;
    const dispatch = useDispatch();
    const selector = useSelector(state => state.taskThreeSixtyReducer);
    const [plannedTasks, setPlannedTasks] = useState([]);
    const [closedTasks, setClosedTasks] = useState([]);
    const [dataForSectionList, setDataForSectionList] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [isApprovar, setIsApprovar] = useState(false);

    useEffect(async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        console.log("$$$$$ LOGIN EMP:", employeeData);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            setUserRole(jsonObj.hrmsRole)
            if (jsonObj?.hrmsRole === "Test drive approver" ) {
                setIsApprovar(true)
            }
        }
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
    useEffect(async () => {
        if (selector.wrokflow_response_status === "success") {
            const plannedData = [];
            const closedData = [];
            const data = [];
            if (selector.wrokflow_response.length > 0) {
                selector.wrokflow_response.forEach(element => {
                    if (
                      (element.taskStatus !== "CLOSED" && selector.enquiry_leadDto_response.leadStage ===  element.taskCategory.taskCategory) ||
                      (element.taskCategory.taskCategory === "APPROVAL" && element.taskStatus === "ASSIGNED") ||
                      ((element.taskStatus && element.taskStatus !== "APPROVAL") && (element.taskName === "Home Visit" || element.taskName === "Test Drive"))) {
                      plannedData.push(element);
                    } else if (element.taskStatus === "CLOSED") {
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

    function checkForTaskNames(taskName) {
        if (taskName.includes('Pre Enquiry')) {
            taskName = taskName.replace('Pre Enquiry', 'Contacts');
        } else if (taskName.includes('Pre Booking')) {
            taskName = taskName.replace('Pre Booking', 'Booking Approval');
        } else if (taskName.includes('Booking')) {
            taskName = taskName.replace('Booking', 'Booking View');
        }
        return taskName
    }

    const itemClicked = (item) => {
        console.log("ITEM: ", JSON.stringify(item));
        const taskName = item.taskName;
        const taskId = item.taskId;
        const universalId = item.universalId;
        const taskStatus = item.taskStatus;
        const mobileNumber = item.assignee?.mobile ? item.assignee?.mobile : "";

        if (item.taskStatus === 'CLOSED') {
            const name =  checkForTaskNames(taskName)
            showToast(name + " task has been closed");
            return;
        }

        const trimName = taskName.toLowerCase().trim();
        console.log({trimName})
        const finalTaskName1 = trimName.replace(/ /g, "");
      const finalTaskName = finalTaskName1.replace(/-/g, "");
        let navigationId = ""
        let taskNameNew = ''
        console.log("FINAL TASK NAME: ", finalTaskName);
        switch (finalTaskName) {
            case "testdrive":
                navigationId = AppNavigator.EmsStackIdentifiers.testDrive;
                taskNameNew = 'Test Drive'
                break;
            case "testdriveapproval":
                navigationId = AppNavigator.EmsStackIdentifiers.testDrive;
                taskNameNew = 'Test Drive'
                break;
            case "proceedtoprebooking":
                if (leadStatus === 'ENQUIRYCOMPLETED')
                navigationId = AppNavigator.EmsStackIdentifiers.proceedToPreBooking;
                else showToast('Please submit the enquiry form')
                taskNameNew = ''
                break;
            case "proceedtobooking":
                if (leadStatus === 'PREBOOKINGCOMPLETED')
                navigationId = AppNavigator.EmsStackIdentifiers.proceedToPreBooking;
                else showToast('Please complete the booking approval process')
                taskNameNew = ''
                break;
            case "homevisit":
                navigationId = AppNavigator.EmsStackIdentifiers.homeVisit;
                taskNameNew = 'Home Visit'
                break;
            case "enquiryfollowup":
                navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
                taskNameNew = 'Enquiry follow-up'
                break;
            case "preenquiryfollowup":
                navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
                taskNameNew = 'Contacts follow-up'
                break;
                case "bookingfollowupdse":
                    navigationId = AppNavigator.EmsStackIdentifiers.bookingFollowUp;
                    taskNameNew = "Booking Followup"
                    break;
            case "prebookingfollowup":
                navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
                taskNameNew = 'Booking approval task'
                break;
            case "createenquiry":
                navigationId = AppNavigator.EmsStackIdentifiers.confirmedPreEnq;
                taskNameNew = ''
                break;
        }
        console.log("NAVIGATION ID: ", navigationId);
        if (!navigationId) { return }
        if (navigationId === AppNavigator.EmsStackIdentifiers.confirmedPreEnq) {
            console.log("ITEM DATA:", JSON.stringify(itemData));
            navigation.navigate(navigationId, { itemData: itemData, fromCreatePreEnquiry: false })
        }
        else {
            navigation.navigate(navigationId, { identifier: mytasksIdentifires[finalTaskName], taskId, universalId, taskStatus, taskData: item, mobile: mobileNo, reasonTaskName: taskNameNew });
        }
    };

    if (selector.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
            <View style={{ flex: 1 }}>

                <SectionList
                    sections={dataForSectionList}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item, index, section }) => {
                        const date = moment(item.taskUpdatedTime).format("ddd MM/YY h:mm a").split(" ");

                        let topBcgColor = Colors.LIGHT_GRAY;
                        let bottomBcgColor = Colors.LIGHT_GRAY;
                        if (section.data[index - 1] !== undefined) {
                            topBcgColor = Colors.GRAY;
                        }

                        if (section.data[index + 1] !== undefined) {
                            bottomBcgColor = Colors.GRAY;
                        }

                        function TaskNameView(taskName) {
                            const name = checkForTaskNames(taskName)
                            return (
                                <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 5 }}>{name}</Text>
                            )
                        }

                        return (
                            <>
                                {item.taskName === 'Test Drive Approval' ?
                                    (isApprovar ?
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
                                        :
                                        null)
                                    :
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
                                                        {TaskNameView(item.taskName)}
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
                                }
                            </>
                        )
                    }}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ height: 50, justifyContent: "center" }}>
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
