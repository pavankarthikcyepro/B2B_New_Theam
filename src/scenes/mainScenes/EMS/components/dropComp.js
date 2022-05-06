import React, { useState } from "react";
import { View, StyleSheet, Keyboard, Text } from "react-native";
import { DropDownSelectionItem } from "../../../../pureComponents";
import { TextinputComp, DropDownComponant } from "../../../../components";
import { GlobalStyle } from "../../../../styles";
import { showToast } from "../../../../utils/toast";

const lostToCompetitor = "Lost to Competitor".replace(/\s/g, "").toLowerCase();
const lostToUsedCarsFromCoDelear = "Lost to Used Cars from Co-Dealer".replace(/\s/g, "").toLowerCase();
const lostToCoDealer = "Lost to Co-Dealer".replace(/\s/g, "").toLowerCase();
const lostToCometitorName = "Lost to Competitor name".replace(/\s/g, "").toLowerCase();
const NoProperResponse = "No proper response from Sales Consultant".replace(/\s/g, "").toLowerCase();
const casualEnquiry = "Casual Enquiry".replace(/\s/g, "").toLowerCase();
const lostToSameDealer = "Lost to same dealer used vehicle".replace(/\s/g, "").toLowerCase();

export const DropComponent = ({
    from = "",
    data = [],
    reason,
    setReason = () => { },
    subReason,
    setSubReason = () => { },
    brandName,
    setBrandName = () => { },
    dealerName,
    setDealerName = () => { },
    location,
    setLocation = () => { },
    model,
    setModel = () => { },
    priceDiff,
    setPriceDiff = () => { },
    remarks,
    setRemarks
}) => {

    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dropDownKey, setDropDownKey] = useState("");
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    const [dataForDropDown, setDataForDropDown] = useState([]);

    const reasonInLowerCase = reason.replace(/\s/g, "").toLowerCase();


    const showDropDownModelMethod = (key, headerText) => {
        Keyboard.dismiss();

        switch (key) {
            case "DROP_REASON":
                setDataForDropDown([...data]);
                break;
            case "DROP_SUB_REASON":
                let updatedData = [];
                const selectedObj = data.filter((value, index) => {
                    return value.name == reason;
                })
                console.log("sub: ", JSON.stringify(selectedObj));
                if (selectedObj.length > 0) {
                    const subSlots = selectedObj[0]["sublostreasons"] || [];
                    subSlots.forEach((obj) => {
                        const newObj = { ...obj };
                        if (newObj.status === "Active") {
                            newObj.name = newObj.subReason;
                            updatedData.push(newObj)
                        }
                    })
                }
                if (updatedData.length == 0) {
                    showToast("No sub reasons found");
                    return;
                }
                setDataForDropDown([...updatedData]);
                break;
        }
        setDropDownKey(key);
        setDropDownTitle(headerText);
        setShowDropDownModel(true);
    };

    return (
        <View>

            <DropDownComponant
                visible={showDropDownModel}
                headerTitle={dropDownTitle}
                data={dataForDropDown}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {
                    if (dropDownKey === "DROP_REASON") {
                        setReason(item.name)
                    } else if (dropDownKey === "DROP_SUB_REASON") {
                        setSubReason(item.name)
                    }
                    setShowDropDownModel(false);
                }}
            />
            <View>
                <DropDownSelectionItem
                    label={"Drop Reasons"}
                    value={reason}
                    onPress={() =>
                        showDropDownModelMethod("DROP_REASON", "Drop Reason")
                    }
                />
                <Text style={GlobalStyle.underline}></Text>

                {(reasonInLowerCase === lostToCompetitor || reasonInLowerCase === lostToCoDealer || reasonInLowerCase === NoProperResponse || reasonInLowerCase === casualEnquiry || reasonInLowerCase == lostToSameDealer) ? (
                    <View>
                        <DropDownSelectionItem
                            label={"Drop Sub Reason"}
                            value={subReason}
                            onPress={() => showDropDownModelMethod("DROP_SUB_REASON", "Drop Sub Reason")}
                        />
                        <Text style={GlobalStyle.underline}></Text>
                    </View>
                ) : null}

                {reasonInLowerCase === lostToCompetitor || reasonInLowerCase === lostToUsedCarsFromCoDelear || reasonInLowerCase === lostToCometitorName ? (
                    <View>
                        <TextinputComp
                            style={styles.textInputStyle}
                            value={brandName}
                            label={"Brand Name"}
                            maxLength={50}
                            onChangeText={(text) => setBrandName(text)}
                        />
                        <Text style={GlobalStyle.underline}></Text>
                    </View>
                ) : null}

                {reasonInLowerCase === lostToCompetitor || reasonInLowerCase === lostToUsedCarsFromCoDelear || reasonInLowerCase === lostToCoDealer || reasonInLowerCase === lostToCometitorName ? (
                    <View>
                        <TextinputComp
                            style={styles.textInputStyle}
                            value={dealerName}
                            label={"Dealer Name"}
                            maxLength={50}
                            onChangeText={(text) => setDealerName(text)}
                        />
                        <Text style={GlobalStyle.underline}></Text>
                        <TextinputComp
                            style={styles.textInputStyle}
                            value={location}
                            label={"Location"}
                            maxLength={50}
                            onChangeText={(text) => setLocation(text)}
                        />
                        <Text style={GlobalStyle.underline}></Text>
                    </View>
                ) : null}

                {reasonInLowerCase === lostToCompetitor || reasonInLowerCase === lostToUsedCarsFromCoDelear || reasonInLowerCase === lostToCoDealer || reasonInLowerCase === lostToCometitorName ? (
                    <View>
                        <TextinputComp
                            style={styles.textInputStyle}
                            value={model}
                            label={"Model"}
                            maxLength={50}
                            onChangeText={(text) => setModel(text)}
                        />
                        <Text style={GlobalStyle.underline}></Text>
                    </View>
                ) : null}

                {reasonInLowerCase === lostToCometitorName ? (
                    <View>
                        <TextinputComp
                            style={styles.textInputStyle}
                            value={priceDiff}
                            label={"Price Diffrencess"}
                            maxLength={50}
                            onChangeText={(text) =>
                                setPriceDiff(text)
                            }
                        />
                        <Text style={GlobalStyle.underline}></Text>
                    </View>
                ) : null}

                <TextinputComp
                    style={styles.textInputStyle}
                    value={remarks}
                    label={"Remarks"}
                    maxLength={50}
                    onChangeText={(text) => setRemarks(text)}
                />
                <Text style={GlobalStyle.underline}></Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textInputStyle: {
        height: 65,
        width: "100%",
    },
})
