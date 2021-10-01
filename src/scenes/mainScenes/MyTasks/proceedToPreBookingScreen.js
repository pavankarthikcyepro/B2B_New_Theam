
import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp, DropDownComponant } from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents";
import { Button } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import { useDispatch, useSelector } from "react-redux";
import {
    clearState,
    getEnquiryDetailsApi,
    updateEnquiryDetailsApi,
    dropEnquiryApi,
    getTaskDetailsApi,
    updateTaskApi,
    changeEnquiryStatusApi
} from "../../../redux/proceedToPreBookingReducer";
import { showToast, showToastSucess } from "../../../utils/toast";
import { getCurrentTasksListApi, getPendingTasksListApi } from "../../../redux/mytaskReducer";
import URL from "../../../networking/endpoints";

const dropReasonsData = [
    { "id": 1, "name": "Looking For More Discount" },
    { "id": 2, "name": "Lost To Co-Dealer" },
    { "id": 3, "name": "Lost To Competition" },
    { "id": 4, "name": "Duplicate Enquiry" },
    { "id": 5, "name": "Call Not Connected" },
    { "id": 6, "name": "Casual Enquiry" },
    { "id": 7, "name": "Lost To Used Car" },
    { "id": 8, "name": "Out of Station" },
    { "id": 9, "name": "Out of Stock" },
    { "id": 10, "name": "Loan not Approved" },
    { "id": 11, "name": "More Waiting Period" },
    { "id": 12, "name": "Old Car Price not matched" },
    { "id": 13, "name": "Poor response from Salesteam" },
    { "id": 14, "name": "Other" }
]

const FirstDependencyArray = ["Lost To Competition", "Lost To Used Car"];
const SecondDependencyArray = ["Lost To Co-Dealer", "Lost To Competition", "Lost To Used Car"];

const ProceedToPreBookingScreen = ({ route, navigation }) => {

    const { taskId, identifier, universalId, taskStatus } = route.params;
    const selector = useSelector(state => state.proceedToPreBookingReducer);
    const dispatch = useDispatch();
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dropReason, setDropReason] = useState("");
    const [dropRemarks, setDropRemarks] = useState("");
    const [brandName, setBrandName] = useState("");
    const [dealerName, setDealerName] = useState("");
    const [location, setLocation] = useState("");
    const [model, setModel] = useState("");
    const [isDropSelected, setIsDropSelected] = useState(false);
    const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "" });
    const [typeOfActionDispatched, setTypeOfActionDispatched] = useState("");
    const [authToken, setAuthToken] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");

    useEffect(() => {
        getAuthToken();
        getAsyncstoreData();
        dispatch(getTaskDetailsApi(taskId));
        getPreBookingDetailsFromServer();
    }, []);

    const getAsyncstoreData = async () => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName })
        }
    }

    const getAuthToken = async () => {
        const token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
        if (token) {
            setAuthToken(token)
        }
    }

    const getPreBookingDetailsFromServer = () => {
        if (universalId) {
            dispatch(getEnquiryDetailsApi(universalId));
        }
    }

    const getMyTasksListFromServer = () => {
        if (userData.employeeId) {
            const endUrl = `empid=${userData.employeeId}&limit=10&offset=${0}`;
            dispatch(getCurrentTasksListApi(endUrl));
            dispatch(getPendingTasksListApi(endUrl));
        }
    }

    const proceedToCancellation = () => {

        setTypeOfActionDispatched("DROP_ENQUIRY");

        if (dropReason.length === 0 || dropRemarks.length === 0) {
            showToastRedAlert("Please enter details for drop")
            return
        }

        if (dropReason === "Lost To Co-Dealer") {
            if (dealerName.length === 0 || location.length === 0 || model.length === 0) {
                showToast("please enter details");
                return;
            }
        }

        if (dropReason === "Lost To Competition" || dropReason === "Lost To Used Car") {
            if (brandName.length === 0 || dealerName.length === 0 || location.length === 0 || model.length === 0) {
                showToast("please enter details");
                return;
            }
        }

        if (!selector.enquiry_details_response) {
            return;
        }

        let leadId = selector.enquiry_details_response.dmsLeadDto.id;
        if (!leadId) {
            showToast("lead id not found");
            return;
        }

        const payload = {
            "dmsLeadDropInfo": {
                "additionalRemarks": dropRemarks,
                "branchId": userData.branchId,
                "brandName": brandName,
                "dealerName": dealerName,
                "leadId": leadId,
                // "crmUniversalId": universalId,
                "lostReason": dropReason,
                "organizationId": userData.orgId,
                "otherReason": "",
                "droppedBy": userData.employeeId,
                "location": location,
                "model": model,
                "stage": "PREBOOKING",
                "status": "PREBOOKING",
            }
        }

        dispatch(dropEnquiryApi(payload));
    }

    // Handle Drop Enquiry
    useEffect(() => {
        if (selector.enquiry_drop_response_status === "success") {
            updateEnuiquiryDetails();
        }
    }, [selector.enquiry_drop_response_status])

    const proceedToPreBookingClicked = () => {

        setTypeOfActionDispatched("PROCEED_TO_PREBOOKING");
        if (selector.task_details_response?.taskId !== taskId) {
            return
        }

        const newTaskObj = { ...selector.task_details_response };
        newTaskObj.taskStatus = "CLOSED";
        dispatch(updateTaskApi(newTaskObj));
    }

    // Handle Update Current Task Response
    useEffect(() => {
        if (selector.update_task_response_status === "success") {
            const endUrl = `${universalId}` + '?' + 'stage=PREBOOKING';
            dispatch(changeEnquiryStatusApi(endUrl));
        }
    }, [selector.update_task_response_status])

    // Handle Change Enquiry Status response
    useEffect(() => {
        if (selector.change_enquiry_status === "success") {
            callCustomerLeadReferenceApi();
        }
    }, [selector.change_enquiry_status])

    const callCustomerLeadReferenceApi = async () => {

        const payload = { "branchid": userData.branchId, "leadstage": "PREBOOKING", "orgid": userData.orgId }
        const url = URL.CUSTOMER_LEAD_REFERENCE();

        await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken
            },
            method: "POST",
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(jsonRes => {
                if (jsonRes.success === true) {
                    if (jsonRes.dmsEntity?.leadCustomerReference) {
                        const refNumber = jsonRes.dmsEntity?.leadCustomerReference.referencenumber;
                        setReferenceNumber(refNumber)
                        updateEnuiquiryDetails(refNumber);
                    }
                }
            })
            .catch((err) => console.error(err));
    }

    const updateEnuiquiryDetails = (refNumber) => {

        if (!selector.enquiry_details_response) {
            return
        }

        let enquiryDetailsObj = { ...selector.enquiry_details_response };
        let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
        if (typeOfActionDispatched === "DROP_ENQUIRY") {
            dmsLeadDto.leadStage = "DROPPED";
        }
        else if (typeOfActionDispatched === "PROCEED_TO_PREBOOKING") {
            dmsLeadDto.leadStage = "PREBOOKING";
            dmsLeadDto.referencenumber = refNumber;
        }
        enquiryDetailsObj.dmsLeadDto = dmsLeadDto;
        dispatch(updateEnquiryDetailsApi(enquiryDetailsObj));
    }

    // Handle Enquiry Update response
    useEffect(() => {
        if (selector.update_enquiry_details_response === "success") {
            if (typeOfActionDispatched === "DROP_ENQUIRY") {
                showToastSucess("Successfully Enquiry Dropped");
                goToParentScreen();
            }
            else if (typeOfActionDispatched === "PROCEED_TO_PREBOOKING") {
                displayCreateEnquiryAlert();
            }
        }
    }, [selector.update_enquiry_details_response]);

    displayCreateEnquiryAlert = () => {
        Alert.alert(
            'Pre Booking Created Successfully',
            "Pre Booking Number: " + referenceNumber
            [
            {
                text: 'OK', onPress: () => {
                    goToParentScreen();
                }
            }
            ],
            { cancelable: false }
        );
    }

    const goToParentScreen = () => {
        getMyTasksListFromServer();
        navigation.goBack();
        dispatch(clearState());
    }

    if (taskStatus === "CANCELLED") {
        return (
            <SafeAreaView style={[styles.cancelContainer]}>
                <Text style={styles.cancelText}>{"This task has been cancelled"}</Text>
            </SafeAreaView>
        )
    }

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                flexDirection: "column",
            }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            enabled
            keyboardVerticalOffset={100}
        >
            <SafeAreaView style={[styles.container]}>

                <DropDownComponant
                    visible={showDropDownModel}
                    headerTitle={"Drop Reason"}
                    data={dropReasonsData}
                    onRequestClose={() => setShowDropDownModel(false)}
                    selectedItems={(item) => {
                        setShowDropDownModel(false);
                        setDropReason(item.name)
                    }}
                />

                <View style={{ padding: 15 }}>
                    {isDropSelected && (
                        <View style={[GlobalStyle.shadow, { backgroundColor: Colors.WHITE }]}>

                            <DropDownSelectionItem
                                label={"Drop Reason"}
                                value={dropReason}
                                onPress={() => setShowDropDownModel(true)}
                            />

                            {FirstDependencyArray.includes(dropReason) && (
                                <View>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        label={"Brand Name"}
                                        value={brandName}
                                        onChangeText={(text) => setBrandName(text)}
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                </View>
                            )}

                            {SecondDependencyArray.includes(dropReason) && (
                                <View>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        label={"Dealer Name"}
                                        value={dealerName}
                                        onChangeText={(text) => setDealerName(text)}
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        label={"Location"}
                                        value={location}
                                        onChangeText={(text) => setLocation(text)}
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                    <TextinputComp
                                        style={styles.textInputStyle}
                                        label={"Model"}
                                        value={model}
                                        onChangeText={(text) => setModel(text)}
                                    />
                                    <Text style={GlobalStyle.underline}></Text>
                                </View>
                            )}

                            <TextinputComp
                                style={styles.textInputStyle}
                                label={"Remarks"}
                                keyboardType={"default"}
                                value={dropRemarks}
                                onChangeText={(text) => setDropRemarks(text)}
                            />
                            <Text style={GlobalStyle.underline}></Text>
                        </View>
                    )}
                </View>

                {!isDropSelected && (
                    <View style={styles.view1}>
                        <Button
                            mode="contained"
                            color={Colors.RED}
                            labelStyle={{ textTransform: "none" }}
                            disabled={selector.isLoading}
                            onPress={() => setIsDropSelected(true)}
                        >
                            Drop
                        </Button>
                        <Button
                            mode="contained"
                            color={Colors.RED}
                            labelStyle={{ textTransform: "none" }}
                            disabled={selector.isLoading}
                            onPress={proceedToPreBookingClicked}
                        >
                            Proceed To PreBooking
                        </Button>
                    </View>
                )}
                {isDropSelected && (
                    <View style={styles.view1}>
                        <Button
                            mode="contained"
                            color={Colors.RED}
                            labelStyle={{ textTransform: "none" }}
                            disabled={selector.isLoading}
                            onPress={proceedToCancellation}
                        >
                            Proceed To Cancellation
                        </Button>
                    </View>
                )}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default ProceedToPreBookingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputStyle: {
        height: 65,
        width: "100%",
    },
    view1: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    cancelContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancelText: {
        fontSize: 14,
        fontWeight: "400",
        color: Colors.RED
    }
});
