
import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp, DropDownComponant } from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents";
import { Button } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import { useDispatch, useSelector } from "react-redux";
import {
    clearState,
    getPrebookingDetailsApi,
    updatePrebookingDetailsApi,
    dropPreBooingApi
} from "../../../redux/proceedToPreBookingReducer";
import { showToast, showToastSucess } from "../../../utils/toast";
import { getCurrentTasksListApi, getPendingTasksListApi } from "../../../redux/mytaskReducer";

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

    useEffect(() => {
        getAsyncstoreData();
        getPreBookingDetailsFromServer();
    }, []);

    const getAsyncstoreData = async () => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName })
        }
    }

    const getPreBookingDetailsFromServer = () => {
        if (universalId) {
            dispatch(getPrebookingDetailsApi(universalId));
        }
    }

    const getMyTasksListFromServer = () => {
        if (userData.employeeId) {
            const endUrl = `empid=${userData.employeeId}&limit=10&offset=${0}`;
            dispatch(getCurrentTasksListApi(endUrl));
            dispatch(getPendingTasksListApi(endUrl));
        }
    }

    useEffect(() => {
        if (selector.update_pre_booking_details_response === "success") {
            if (typeOfActionDispatched === "DROP_ENQUIRY") {
                showToastSucess("Successfully Enquiry Dropped");
                getMyTasksListFromServer();
            } else if (typeOfActionDispatched === "UPDATE_ENQUIRY") {
                showToastSucess("Successfully Enquiry Updated");
            }
            dispatch(clearState());
            navigation.goBack();
        }
    }, [selector.update_pre_booking_details_response]);

    const proceedToCancellation = () => {

        if (dropReason.length === 0 || dropRemarks.length === 0) {
            showToastRedAlert("Please enter details for drop")
            return
        }

        if (!selector.pre_booking_details_response) {
            return
        }

        let prebookingDetailsObj = { ...selector.pre_booking_details_response };
        let dmsLeadDto = { ...prebookingDetailsObj.dmsLeadDto };
        dmsLeadDto.leadStage = "DROPPED";
        prebookingDetailsObj.dmsLeadDto = dmsLeadDto;

        let leadId = selector.pre_booking_details_response.dmsLeadDto.id;
        if (!leadId) {
            showToast("lead id not found")
            return
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

        setTypeOfActionDispatched("DROP_ENQUIRY");
        dispatch(dropPreBooingApi(payload));
        dispatch(updatePrebookingDetailsApi(prebookingDetailsObj));
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
                            onPress={() => setIsDropSelected(true)}
                        >
                            Drop
                        </Button>
                        <Button
                            mode="contained"
                            color={Colors.RED}
                            labelStyle={{ textTransform: "none" }}
                            onPress={() => console.log("Pressed")}
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
