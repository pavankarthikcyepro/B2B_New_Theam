import React, { useState, useEffect } from "react";
import { View, StyleSheet, Keyboard, Text, TextInput, Pressable, Image } from "react-native";
import { DropDownSelectionItem } from "../../../../pureComponents";
import { TextinputComp, DropDownComponant } from "../../../../components";
import { GlobalStyle, Colors } from "../../../../styles";
import { showToast } from "../../../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, List, Button, IconButton } from "react-native-paper";
import * as AsyncStore from "../../../../asyncStore";
import { getLogoNameApi } from "../../../../redux/enquiryFormReducer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";


const lostToCompetitor = "Lost to Competitor".replace(/\s/g, "").toLowerCase();
const lostToUsedCarsFromCoDelear = "Lost to Used Cars from Co-Dealer".replace(/\s/g, "").toLowerCase();
const lostToCoDealer = "Lost to Co-Dealer".replace(/\s/g, "").toLowerCase();
const lostToCometitorName = "Lost to Competitor name".replace(/\s/g, "").toLowerCase();
const NoProperResponse = "No proper response from Sales Consultant".replace(/\s/g, "").toLowerCase();
const casualEnquiry = "Casual Enquiry".replace(/\s/g, "").toLowerCase();
const lostToSameDealer = "Lost to same dealer used vehicle".replace(/\s/g, "").toLowerCase();
const rupeeSymbol = "\u20B9";

const CheckboxTextAndAmountComp = ({
    title,
    amount,
    titleStyle = {},
    amoutStyle = {},
    isChecked = false,
    onPress,
}) => {
    return (
        <View style={[styles.textAndAmountView, { paddingLeft: 2 }]}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <Checkbox.Android
                    style={{ padding: 0, margin: 0 }}
                    status={isChecked ? "checked" : "unchecked"}
                    color={Colors.BLUE}
                    uncheckedColor={Colors.GRAY}
                    onPress={onPress}
                />
                <Text
                    style={[
                        {
                            fontSize: 14,
                            fontWeight: "400",
                            maxWidth: "70%",
                            color: Colors.GRAY,
                        },
                        titleStyle,
                    ]}
                >
                    {title}
                </Text>
            </View>
            <Text style={[{ fontSize: 14, fontWeight: "400" }, amoutStyle]}>
                {rupeeSymbol + " " + amount}
            </Text>
        </View>
    );
};

const TextAndAmountComp = ({
    title,
    amount,
    titleStyle = {},
    amoutStyle = {},
}) => {
    return (
        <View style={styles.textAndAmountView}>
            <Text style={[styles.leftLabel, titleStyle]}>{title}</Text>
            <Text style={[{ fontSize: 14, fontWeight: "400" }, amoutStyle]}>
                {rupeeSymbol + " " + amount}
            </Text>
        </View>
    );
};

const PaidAccessoriesTextAndAmountComp = ({
    title,
    amount,
    titleStyle = {},
    amoutStyle = {},
}) => {
    return (
        <View style={styles.textAndAmountView}>
            <Text
                style={[
                    styles.leftLabel,
                    titleStyle,
                    {
                        color: Colors.BLUE,
                        textDecorationLine: "underline",
                        textDecorationStyle: "solid",
                        textDecorationColor: Colors.BLUE,
                    },
                ]}
            >
                {title}
            </Text>
            <Text style={[{ fontSize: 14, fontWeight: "400" }, amoutStyle]}>
                {rupeeSymbol + " " + amount}
            </Text>
        </View>
    );
};
export const ProformaComp = ({branchId}) => {
    const dispatch = useDispatch();

    const selector = useSelector((state) => state.enquiryFormReducer);
    const [handlingChargSlctd, setHandlingChargSlctd] = useState(false);

    const [priceInfomationData, setPriceInformationData] = useState({
        ex_showroom_price: 0,
        ex_showroom_price_csd: 0,
        registration_charges: 0,
        handling_charges: 0,
        tcs_percentage: 0,
        tcs_amount: 0,
        essential_kit: 0,
        fast_tag: 0,
        vehicle_road_tax: 0,
    });
    const [essentialKitSlctd, setEssentialKitSlctd] = useState(false);

    const [fastTagSlctd, setFastTagSlctd] = useState(false);
    const [financeBanksList, setFinanceBanksList] = useState([]);
    const [lifeTaxAmount, setLifeTaxAmount] = useState(0);
    const [tcsAmount, setTcsAmount] = useState(0);
    const [paidAccessoriesList, setPaidAccessoriesList] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState("");
    const [totalOnRoadPrice, setTotalOnRoadPrice] = useState(0);
    const [totalOnRoadPriceAfterDiscount, setTotalOnRoadPriceAfterDiscount] =
        useState(0);
    const [selectedInsurencePrice, setSelectedInsurencePrice] = useState(0);
    const [selectedAddOnsPrice, setSelectedAddOnsPrice] = useState(0);
    const [selectedWarrentyPrice, setSelectedWarrentyPrice] = useState(0);
    const [selectedPaidAccessoriesPrice, setSelectedPaidAccessoriesPrice] =
        useState(0);
    const [selectedFOCAccessoriesPrice, setSelectedFOCAccessoriesPrice] =
        useState(0);
    const [taxPercent, setTaxPercent] = useState('');
    const [insuranceDiscount, setInsuranceDiscount] = useState('');
    const [accDiscount, setAccDiscount] = useState('');
    const [initialTotalAmt, setInitialTotalAmt] = useState(0);

    const [paidAccessoriesListNew, setPaidAccessoriesListNew] =
        useState([]);
    const [selectedFOCAccessoriesList, setSelectedFOCAccessoriesList] =
        useState([]);
    const [selectedInsurenceAddons, setSelectedInsurenceAddons] = useState([]);
    const [showApproveRejectBtn, setShowApproveRejectBtn] = useState(false);
    const [showPrebookingPaymentSection, setShowPrebookingPaymentSection] =
        useState(false);
    const [showSubmitDropBtn, setShowSubmitDropBtn] = useState(false);
    const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
    const [isRejectSelected, setIsRejectSelected] = useState(false);
    const [userToken, setUserToken] = useState("");
    useEffect(()=>{
      getUserData()
    },[])
    const getUserData = async()=>{
        try{
            let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
            // console.log("$$$$$ LOGIN EMP:", employeeData);
            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                const data = {
                    branchId: branchId,
                    orgId: jsonObj.orgId
                }
                dispatch(getLogoNameApi(data));
            }
        }catch(error){
            alert(error)
        }
       
    }
    useEffect(() => {
        
        calculateOnRoadPrice(handlingChargSlctd, essentialKitSlctd, fastTagSlctd);
    }, [
        priceInfomationData,
        selectedInsurencePrice,
        selectedAddOnsPrice,
        selectedWarrentyPrice,
        selectedPaidAccessoriesPrice,
        selector.vechicle_registration,
        taxPercent,
    ]);
    const showDropDownModelMethod = (key, headerText) => {
        Keyboard.dismiss();

        switch (key) {
           
          
            case "PAYMENT_AT":
                setDataForDropDown([...Payment_At_Types]);
                break;
            case "PAYMENT_AT":
                setDataForDropDown([...Payment_At_Types]);
                break;
            case "BOOKING_PAYMENT_MODE":
                setDataForDropDown([...Booking_Payment_Types]);
                break;
            case "INSURANCE_TYPE":
                if (insurenceVarientTypes.length <= 0) {
                    showToast("No Insurence Types Data Found");
                    return;
                }
                setDataForDropDown([...insurenceVarientTypes]);
                break;
            case "WARRANTY":
                if (warrentyTypes.length <= 0) {
                    showToast("No Warranty Data Found");
                    return;
                }
                setDataForDropDown([...warrentyTypes]);
                break;
            case "INSURENCE_ADD_ONS":
                if (insurenceAddOnTypes.length <= 0) {
                    showToast("No AddOns Insurence Data Found");
                    return;
                }
                setDataForDropDown([...insurenceAddOnTypes]);
                setShowMultipleDropDownData(true);
                break;
            case "VEHICLE_TYPE":
                setDataForDropDown([...Vehicle_Types]);
                break;
            case "CUSTOMER_TYPE_CATEGORY":
                setDataForDropDown([...Customer_Category_Types]);
                break;
        }
        setDropDownKey(key);
        setDropDownTitle(headerText);
        setShowDropDownModel(true);
    };
    const calculateOnRoadPrice = (
        handleSelected,
        essentialSelected,
        fastTagSelected
    ) => {
        console.log("CALLED");
        let totalPrice = 0;
        totalPrice += priceInfomationData.ex_showroom_price;
        // const lifeTax = getLifeTax();
        let lifeTax = taxPercent !== '' ? getLifeTaxNew(Number(taxPercent)) : 0;
        setLifeTaxAmount(lifeTax);
        totalPrice += lifeTax;
        totalPrice += priceInfomationData.registration_charges;
        totalPrice += selectedInsurencePrice;
        if (selector.insurance_type !== '') {
            totalPrice += selectedAddOnsPrice;
        }
        totalPrice += selectedWarrentyPrice;
        if (handleSelected) {
            totalPrice += priceInfomationData.handling_charges;
        }
        if (essentialSelected) {
            totalPrice += priceInfomationData.essential_kit;
        }
        const tcsPrice = getTcsAmount();
        setTcsAmount(tcsPrice);
        totalPrice += tcsPrice;

        if (fastTagSelected) {
            totalPrice += priceInfomationData.fast_tag;
        }
        console.log("LIFE TAX PRICE: ", lifeTax, priceInfomationData.registration_charges, selectedInsurencePrice, selectedAddOnsPrice, selectedWarrentyPrice, handleSelected, priceInfomationData.handling_charges, essentialSelected, priceInfomationData.essential_kit, tcsPrice, fastTagSelected, priceInfomationData.fast_tag, selectedPaidAccessoriesPrice);
        // setTotalOnRoadPriceAfterDiscount(totalPrice - selectedFOCAccessoriesPrice);
        totalPrice += selectedPaidAccessoriesPrice;
        setTotalOnRoadPrice(totalPrice);
        setInitialTotalAmt(totalPrice)
        // setTotalOnRoadPriceAfterDiscount(totalPrice);
    };

    const calculateOnRoadPriceAfterDiscount = () => {
        let totalPrice = totalOnRoadPrice;
        totalPrice -= Number(selector.consumer_offer);
        totalPrice -= Number(selector.exchange_offer);
        totalPrice -= Number(selector.corporate_offer);
        totalPrice -= Number(selector.promotional_offer);
        totalPrice -= Number(selector.cash_discount);
        totalPrice -= Number(selector.for_accessories);
        totalPrice -= Number(selector.insurance_discount);
        totalPrice -= Number(selector.accessories_discount);
        totalPrice -= Number(selector.additional_offer_1);
        totalPrice -= Number(selector.additional_offer_2);
        // if (accDiscount !== '') {
        //     totalPrice -= Number(accDiscount);
        // }
        // if (insuranceDiscount !== '') {
        //     totalPrice -= Number(insuranceDiscount);
        // }
        console.log("OFFER DISCOUNT: ", totalOnRoadPrice, selector.consumer_offer, selector.exchange_offer, selector.corporate_offer, selector.promotional_offer, selector.cash_discount, selector.for_accessories, selector.insurance_discount, selector.accessories_discount, selector.additional_offer_1, selector.additional_offer_2, accDiscount, insuranceDiscount);
        setTotalOnRoadPriceAfterDiscount(totalPrice);
    };
    const getLifeTaxNew = (val) => {
        return priceInfomationData.ex_showroom_price * (val / 100)
    };

    const getTcsAmount = () => {
        let amount = 0;
        if (priceInfomationData.ex_showroom_price > 1000000) {
            amount =
                priceInfomationData.ex_showroom_price *
                (priceInfomationData.tcs_percentage / 100);
        } else {
            amount = priceInfomationData.tcs_amount;
        }
        return amount;
    };

    return (
        <View>

        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', padding:5}}>
                <Image
                    style={styles.ImageStyleS}
                    source={{ uri: selector.proforma_logo }}
                />
                <Text style={{ fontSize: 18, color: Colors.PINK, textAlign: 'center', marginLeft: 10 }}>{selector.proforma_orgName}</Text>
        </View>
            <Text style={{ fontSize: 14, color: Colors.BLACK, textAlign: 'center', marginLeft: 10 }}>{selector.proforma_branch + ", " + selector.proforma_city + ", " + selector.proforma_state}</Text>
            <Text style={{ fontSize: 18, color: Colors.PINK, textAlign: 'center', margin: 10 }}>Proforma Invoice</Text>
            <TextAndAmountComp
                title={"Name"}
                amount={"Kwid"}
            /> 
            <TextAndAmountComp
                title={"Date"}
                amount={"02/12/12"}
            />   
            <TextAndAmountComp
                title={"Model"}
                amount={"Kwid"}
            />    
            <TextAndAmountComp
                title={"Color"}
                amount={"Kwid"}
            />  
            <TextAndAmountComp
                title={"Amount"}
                amount={"Kwid"}
            />  
            <Text style={{ fontSize: 18, color: Colors.PINK, textAlign: 'center', margin: 10 }}>Description</Text>

            <TextAndAmountComp
                title={"Ex-Showroom Price:"}
                amount={priceInfomationData.ex_showroom_price.toFixed(2)}
            />           

            {selector.vechicle_registration ? (
                <View>
                    <DropDownSelectionItem
                        label={"Vehicle Type"}
                        value={selector.vehicle_type}
                        onPress={() =>
                            showDropDownModelMethod("VEHICLE_TYPE", "Vehicle Type")
                        }
                    />
                    <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.registration_number}
                        label={"Reg. No"}
                        maxLength={15}
                        autoCapitalize={"characters"}
                        onChangeText={(text) =>
                            dispatch(
                                setPriceConformationDetails({
                                    key: "REGISTRATION_NUMBER",
                                    text: text,
                                })
                            )
                        }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                </View>
            ) : null}

            {/* <TextAndAmountComp
                                    title={"Life Tax:"}
                                    amount={lifeTaxAmount.toFixed(2)}
                                /> */}
            <View style={styles.textAndAmountView}>
                {/* <View style={{width: '60%', flexDirection: 'row'}}> */}
                <Text style={[styles.leftLabel]}>{"Life Tax:"}</Text>
                {/* </View> */}
                <View style={{
                    width: 100,
                    // height: 30,
                    // justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderBottomWidth: 1, borderBottomColor: '#d1d1d1'
                }}>
                    <TextInput
                        value={taxPercent}
                        style={[{ fontSize: 14, fontWeight: "400", }]}
                        keyboardType={"number-pad"}
                        onChangeText={(text) => {
                            setTaxPercent(text);
                            if (text !== '') {
                                setLifeTaxAmount(getLifeTaxNew(Number(text)))
                            }
                            else {
                                setLifeTaxAmount(0)
                            }
                        }}
                    />

                </View>
                <Text style={{ fontSize: 14, fontWeight: "400", }}>{rupeeSymbol + " " + lifeTaxAmount.toFixed(2)}</Text>
            </View>

            <Text style={GlobalStyle.underline}></Text>

            <TextAndAmountComp
                title={"Registration Charges:"}
                amount={priceInfomationData.registration_charges.toFixed(2)}
            />
            <Text style={GlobalStyle.underline}></Text>

            <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                    <DropDownSelectionItem
                        label={"Insurance Type"}
                        value={selector.insurance_type}
                        onPress={() =>
                            showDropDownModelMethod(
                                "INSURANCE_TYPE",
                                "Insurance Type"
                            )
                        }
                    />
                </View>
                <Text style={styles.shadowText}>
                    {rupeeSymbol + " " + selectedInsurencePrice.toFixed(2)}
                </Text>
            </View>
            <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                    <DropDownSelectionItem
                        label={"Add-on Insurance"}
                        value={selector.insurance_type !== '' ? selector.add_on_insurance : ''}
                        disabled={!selector.insurance_type}
                        onPress={() =>
                            showDropDownModelMethod(
                                "INSURENCE_ADD_ONS",
                                "Add-on Insurance"
                            )
                        }
                    />
                </View>
                {selector.insurance_type !== '' ?
                    <Text style={styles.shadowText}>
                        {rupeeSymbol + " " + selectedAddOnsPrice.toFixed(2)}
                    </Text>
                    :
                    <Text style={styles.shadowText}>
                        {rupeeSymbol + " 0.00"}
                    </Text>
                }
            </View>

            <View style={styles.symbolview}>
                <View style={{ width: "70%" }}>
                    <DropDownSelectionItem
                        label={"Warranty"}
                        value={selector.warranty}
                        onPress={() =>
                            showDropDownModelMethod("WARRANTY", "Warranty")
                        }
                    />
                </View>
                <Text style={styles.shadowText}>
                    {rupeeSymbol + " " + selectedWarrentyPrice.toFixed(2)}
                </Text>
            </View>
            <Text style={GlobalStyle.underline}></Text>

            <CheckboxTextAndAmountComp
                title={"Handling Charges:"}
                amount={handlingChargSlctd ? priceInfomationData.handling_charges.toFixed(2) : 0}
                // amount={handlingChargSlctd ? priceInfomationData.handling_charges.toFixed(2) : "0.00"}
                isChecked={handlingChargSlctd}
                onPress={() => {
                    setHandlingChargSlctd(!handlingChargSlctd);
                    calculateOnRoadPrice(
                        !handlingChargSlctd,
                        essentialKitSlctd,
                        fastTagSlctd
                    );
                }}
            />
            <Text style={GlobalStyle.underline}></Text>

            <CheckboxTextAndAmountComp
                title={"Essential Kit:"}
                amount={essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : 0}
                // amount={essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : "0.00"}
                isChecked={essentialKitSlctd}
                onPress={() => {
                    setEssentialKitSlctd(!essentialKitSlctd);
                    calculateOnRoadPrice(
                        handlingChargSlctd,
                        !essentialKitSlctd,
                        fastTagSlctd
                    );
                }}
            />
            <Text style={GlobalStyle.underline}></Text>

            <TextAndAmountComp
                title={"TCS(>=10Lakhs -> 1%):"}
                amount={tcsAmount.toFixed(2)}
            />
            <Text style={GlobalStyle.underline}></Text>

            <Pressable
                onPress={() =>
                    navigation.navigate(
                        AppNavigator.EmsStackIdentifiers.paidAccessories,
                        {
                            accessorylist: paidAccessoriesList,
                            selectedAccessoryList: selectedPaidAccessoriesList,
                            selectedFOCAccessoryList: selectedFOCAccessoriesList,
                        }
                    )
                }
            >
                <PaidAccessoriesTextAndAmountComp
                    title={"Paid Accessories:"}
                    amount={selectedPaidAccessoriesPrice.toFixed(2)}
                />
            </Pressable>
            <Text style={GlobalStyle.underline}></Text>
            {paidAccessoriesListNew.length > 0 ? (
                <View
                    style={{
                        backgroundColor: Colors.WHITE,
                        paddingLeft: 12,
                        paddingTop: 5,
                    }}
                >
                    {paidAccessoriesListNew.map((item, index) => {
                        return (
                            <Text style={styles.accessoriText} key={"ACC" + index}>
                                {item.accessoriesName + " - " + item.amount}
                            </Text>
                        );
                    })}
                    <Text
                        style={[GlobalStyle.underline, { marginTop: 5 }]}
                    ></Text>
                </View>
            ) : null}

            <CheckboxTextAndAmountComp
                title={"Fast Tag:"}
                amount={fastTagSlctd ? priceInfomationData.fast_tag.toFixed(2) : 0}
                // amount={fastTagSlctd ? priceInfomationData.fast_tag.toFixed(2) : "0.00"}
                isChecked={fastTagSlctd}
                onPress={() => {
                    setFastTagSlctd(!fastTagSlctd);
                    calculateOnRoadPrice(
                        handlingChargSlctd,
                        essentialKitSlctd,
                        !fastTagSlctd
                    );
                }}
            />
            {/* <TextAndAmountComp
                  title={"Fast Tag:"}
                  amount={priceInfomationData.fast_tag.toFixed(2)}
                /> */}
            <Text style={GlobalStyle.underline}></Text>

            <TextAndAmountComp
                title={"On Road Price:"}
                amount={totalOnRoadPrice.toFixed(2)}
                titleStyle={{ fontSize: 18, fontWeight: "800" }}
                amoutStyle={{ fontSize: 18, fontWeight: "800" }}
            />
            <Text style={GlobalStyle.underline}></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    textInputStyle: {
        height: 65,
        width: "100%",
    },
    textAndAmountView: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        minHeight: 40,
        paddingVertical: 5,
        alignItems: "center",
        backgroundColor: Colors.WHITE,
    },
    offerPriceTextInput: {
        height: 55,
        width: "100%",
    },
    actionBtnView: {
        paddingTop: 20,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    symbolview: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingRight: 12,
        backgroundColor: Colors.WHITE,
    },
    shadowText: {
        width: "30%",
        backgroundColor: Colors.WHITE,
        textAlign: "right",
        fontSize: 14,
        fontWeight: "400",
    },
    ImageStyleS: {
        width: 50,
        height: 50
    },
})
