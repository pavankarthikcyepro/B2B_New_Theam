
import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp, DropDownComponant } from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents";
import { Button } from "react-native-paper";

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

const ProceedToPreBookingScreen = () => {

    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dropReason, setDropReason] = useState("");
    const [dropRemarks, setDropRemarks] = useState("");
    const [brandName, setBrandName] = useState("");
    const [dealerName, setDealerName] = useState("");
    const [location, setLocation] = useState("");
    const [model, setModel] = useState("");
    const [isDropSelected, setIsDropSelected] = useState(false);

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
                            onPress={() => console.log("Pressed")}
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
});
