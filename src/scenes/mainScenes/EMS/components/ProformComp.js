import React, { useState, useEffect } from "react";
import { View, StyleSheet, Keyboard, Text, TextInput, Pressable, Image } from "react-native";
import { DropDownSelectionItem } from "../../../../pureComponents";
import { TextinputComp, DropDownComponant } from "../../../../components";
import { GlobalStyle, Colors } from "../../../../styles";
import { showToast } from "../../../../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, List, Button, IconButton } from "react-native-paper";
import moment from "moment";

import * as AsyncStore from "../../../../asyncStore";
import {
    getLogoNameApi, getOnRoadPriceAndInsurenceDetailsApi, setDropDownData, postProformaInvoiceDetails
 } from "../../../../redux/enquiryFormReducer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import {
    GetCarModelList,
} from "../../../../utils/helperFunctions";
import { PriceStackIdentifiers } from "../../../../navigations/appNavigator";

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
    text,
    titleStyle = {},
    amoutStyle = {},
}) => {
    return (
        <View style={styles.textAndAmountView}>
            <Text style={[styles.leftLabel, titleStyle]}>{title}</Text>
            
            {text && text != '' ? <Text style={[{ fontSize: 16, fontWeight: "400", width:'50%' }, amoutStyle]}>
                {text}
            </Text> : <Text style={[{ fontSize: 14, fontWeight: "400" }, amoutStyle]}>
                {rupeeSymbol + " " + amount}
            </Text>}
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
export const ProformaComp = ({ branchId, modelDetails, universalId }) => {
    const dispatch = useDispatch();

    const selector = useSelector((state) => state.enquiryFormReducer);
    const [orgId, setOrgId] = useState("");
    const [selectedVarientId, setSelectedVarientId] = useState(0);
    const [warrentyTypes, setWarrentyTypes] = useState([]);

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
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [showMultipleDropDownData, setShowMultipleDropDownData] =
        useState(false);
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownKey, setDropDownKey] = useState("");
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
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
    const [insurenceVarientTypes, setInsurenceVarientTypes] = useState([]);
    const [insurenceAddOnTypes, setInsurenceAddOnTypes] = useState([]);

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

    const [carModelsData, setCarModelsData] = useState([]);

    const [userToken, setUserToken] = useState("");
    useEffect(()=>{
      getUserData()
    },[])
    const getUserData = async()=>{
        try{
            let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
            AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
                setUserToken(token);
               
            });
            // console.log("$$$$$ LOGIN EMP:", employeeData);
            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                const data = {
                    branchId: branchId,
                    orgId: jsonObj.orgId
                }
                await setOrgId(jsonObj.orgId)
                dispatch(getLogoNameApi(data));
                getCarModelListFromServer(jsonObj.orgId)
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
    useEffect(() => {
        if (selector.vehicle_on_road_price_insurence_details_response) {
            console.log("ON ROAD PRICE INFO:", JSON.stringify(selector.vehicle_on_road_price_insurence_details_response));
            const varientTypes =
                selector.vehicle_on_road_price_insurence_details_response
                    .insurance_vareint_mapping || [];
            if (varientTypes.length > 0) {
                let newFormatVarientTypes = [];
                varientTypes.forEach((item) => {
                    newFormatVarientTypes.push({
                        ...item,
                        name: item.policy_name,
                    });
                    if (selector.insurance_type === item.policy_name) {
                        setSelectedInsurencePrice(item.cost);
                    }
                });
                setInsurenceVarientTypes([...newFormatVarientTypes]);
            }

            const allWarrentyTypes =
                selector.vehicle_on_road_price_insurence_details_response
                    .extended_waranty || [];
            if (allWarrentyTypes.length > 0) {
                for (const object of allWarrentyTypes) {
                    if (object.varient_id === selectedVarientId) {
                        const matchedWarrentyTypes = object.warranty || [];
                        if (matchedWarrentyTypes.length > 0) {
                            let newFormatWarrentyTypes = [];
                            matchedWarrentyTypes.forEach((item) => {
                                if (Number(item.cost) !== 0) {
                                    newFormatWarrentyTypes.push({
                                        ...item,
                                        name: item.document_name,
                                    });
                                }
                            });
                            setWarrentyTypes([...newFormatWarrentyTypes]);
                        }
                        break;
                    }
                }
            }

            const allInsuranceAddOnTypes =
                selector.vehicle_on_road_price_insurence_details_response
                    .insuranceAddOn || [];
            if (allInsuranceAddOnTypes.length > 0) {
                for (const object of allInsuranceAddOnTypes) {
                    if (object.varient_id === selectedVarientId) {

                        const matchedInsurenceAddOnTypes = object.add_on_price || [];
                        let newFormatAddOnTypes = [];
                        matchedInsurenceAddOnTypes.forEach((item) => {
                            newFormatAddOnTypes.push({
                                ...item,
                                selected: false,
                                name: item.document_name,
                            });
                        });
                        setInsurenceAddOnTypes([...newFormatAddOnTypes]);
                        break;
                    }
                }
            }

            setPriceInformationData({
                ...selector.vehicle_on_road_price_insurence_details_response,
            });
        }
    }, [selector.vehicle_on_road_price_insurence_details_response]);

    const saveProformaDetails = async(from)=>{
        var proformaStatus = ''
        if(from === 'save')
            proformaStatus = 'ENQUIRYCOMPLETED'
        else proformaStatus = 'SENTFORAPPROVAL'
        const data = await {
            "crmUniversalId": universalId, 
        "id": null, "performa_status": proformaStatus, 
        "performa_comments": "xyz", 
           "oth_performa_column": {
               "ex_showroom_price": priceInfomationData.ex_showroom_price, 
               "lifeTaxPercentage": taxPercent, "life_tax": lifeTaxAmount, "registration_charges": priceInfomationData.registration_charges,
        "insurance_type": selector.insurance_type, "insurance_value": selectedInsurencePrice, "add_on_covers": selectedAddOnsPrice, "waranty_name": selector.waranty_name,
         "waranty_value": selectedWarrentyPrice, "handling_charges":priceInfomationData.handling_charges, "essential_kit": priceInfomationData.essential_kit, 
         "tcs_amount": tcsAmount, 
         "paid_access": selectedPaidAccessoriesPrice, "fast_tag": priceInfomationData.fast_tag, "on_road_price": totalOnRoadPrice } }
        await dispatch(postProformaInvoiceDetails(data))
        }
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
    const getCarModelListFromServer = async(orgId) => {
        // Call Api
        GetCarModelList(orgId)
            .then(
                (resolve) => {
                    let modalList = [];
                    if (resolve.length > 0) {
                        resolve.forEach((item) => {
                            modalList.push({
                                id: item.vehicleId,
                                name: item.model,
                                isChecked: false,
                                ...item,
                            });
                        });
                    }
                    setCarModelsData([...modalList]);
                    updateVariantModelsData(modelDetails.model, true, modelDetails.variant)
                    //  alert("entry---------",JSON.stringify(selector.dmsLeadProducts))
                  
                },
                (rejected) => {
                    console.log("getCarModelListFromServer Failed");
                }
            )
            .finally(() => {
            });
    };
    const updateVariantModelsData = (
        selectedModelName,
        fromInitialize,
        selectedVarientName
    ) => {
        if (!selectedModelName || selectedModelName.length === 0) {
            return;
        }
        console.log("coming..: ", selectedModelName,
            fromInitialize,
            selectedVarientName);
        let arrTemp = carModelsData.filter(function (obj) {
            return obj.model === selectedModelName;
        });
        console.log("arrTemp: ", arrTemp);

        let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
        if (carModelObj !== undefined) {
            let newArray = [];
            let mArray = carModelObj.varients;
            if (mArray.length) {
                mArray.forEach((item) => {
                    newArray.push({
                        id: item.id,
                        name: item.name,
                    });
                });
             
             
                    updateColorsDataForSelectedVarient(
                        modelDetails.variant,
                        [...mArray],
                        carModelObj.vehicleId
                    );
            }
        }
    };
    const updateColorsDataForSelectedVarient = (
        selectedVarientName,
        varientList,
        modelId
    ) => {
        if (!selectedVarientName || selectedVarientName.length === 0) {
            return;
        }

        let arrTemp = varientList.filter(function (obj) {
            return obj.name === selectedVarientName;
        });
        console.log("VARIENT LIST: ", arrTemp[0]);
        let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
        if (carModelObj !== undefined) {
            let newArray = [];
            let mArray = carModelObj.vehicleImages;
            const varientId = carModelObj.id;
            setSelectedVarientId(varientId);

           // alert("success" + orgId + " varientId" + varientId)
            dispatch(
                getOnRoadPriceAndInsurenceDetailsApi({
                    orgId: orgId,
                    varientId: varientId,
                })
            );
           
        }
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
            <DropDownComponant
                visible={showDropDownModel}
                headerTitle={dropDownTitle}
                data={dataForDropDown}
                multiple={showMultipleDropDownData}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {
                    setShowDropDownModel(false);
                    setShowMultipleDropDownData(false);
                    if (dropDownKey === "MODEL") {
                        updateVariantModelsData(item.name, false);
                    } else if (dropDownKey === "VARIENT") {
                        updateColorsDataForSelectedVarient(
                            item.name,
                            selectedCarVarientsData.varientList,
                            selectedModelId
                        );
                    } else if (dropDownKey === "INSURANCE_TYPE") {
                        setSelectedInsurencePrice(item.cost);
                    } else if (dropDownKey === "WARRANTY") {
                        setSelectedWarrentyPrice(Number(item.cost));
                    } else if (dropDownKey === "DROP_REASON") {
                        const payload = {
                            bu: userData.orgId,
                            dropdownType: "PreBook_Lost_Com_Sub_Reas",
                            parentId: item.id,
                        };
                        dispatch(getDropSubReasonDataApi(payload));
                    } else if (dropDownKey === "INSURENCE_ADD_ONS") {
                        let totalCost = 0;
                        let names = "";
                        let insurenceAddOns = [];
                        console.log("ADD-ON ITEM:", JSON.stringify(item));
                        if (item.length > 0) {
                            item.forEach((obj, index) => {
                                totalCost += Number(obj.cost);
                                names += obj.name + (index + 1 < item.length ? ", " : "");
                                insurenceAddOns.push({
                                    insuranceAmount: obj.cost,
                                    insuranceAddonName: obj.name,
                                });
                            });
                        }
                        setSelectedAddOnsPrice(totalCost);
                        setSelectedInsurenceAddons([...insurenceAddOns]);
                        dispatch(
                            setDropDownData({ key: dropDownKey, value: names, id: "" })
                        );
                        return;
                    }
                    dispatch(
                        setDropDownData({ key: dropDownKey, value: item.name, id: item.id })
                    );
                }}
            />
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', padding:5}}>
                <Image
                    style={styles.ImageStyleS}
                    source={{ uri: selector.proforma_logo }}
                />
                <Text style={{ fontSize: 18, color: Colors.PINK, textAlign: 'center', marginLeft: 10 }}>{selector.proforma_orgName}</Text>
        </View>
            <Text style={{ fontSize: 14, color: Colors.BLACK, textAlign: 'center', marginLeft: 10, marginBottom:10 }}>{selector.proforma_branch + ", " + selector.proforma_city + ", " + selector.proforma_state}</Text>
            <View style={{margin:10, borderRadius:5, borderWidth:1, borderColor: Colors.BLACK, paddingBottom:10}}>
            <Text style={{ fontSize: 18, color: Colors.PINK, textAlign: 'center', margin: 10 }}>Proforma Invoice</Text>
            <TextAndAmountComp
                title={"Name"}
                text={modelDetails.model}
            /> 
            <TextAndAmountComp
                title={"Date"}
                    text={moment().format("DD/MM/YYYY")}
            />   
            <TextAndAmountComp
                title={"Model"}
                text={modelDetails.variant}
            />    
            <TextAndAmountComp
                title={"Color"}
                text={modelDetails.color}
            />  
            <TextAndAmountComp
                title={"Amount"}
                    text={totalOnRoadPrice.toFixed(2)}
            />  
            </View>

            <View style={{ margin: 10, borderRadius: 5, borderWidth: 1, borderColor: Colors.BLACK, paddingBottom: 10 }}>

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
            {/* <Text style={GlobalStyle.underline}></Text> */}
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', margin:15}}>
                <Button
                    mode="contained"
                    style={{ width: 120 }}
                    color={Colors.PINK}
                    labelStyle={{ textTransform: "none" }}
                    onPress={() => saveProformaDetails('save')}
                >
                    Save
                </Button>
                <Button
                    mode="contained"
                    style={{ width: 160 }}
                    color={Colors.PINK}
                    labelStyle={{ textTransform: "none" }}
                    onPress={() => saveProformaDetails('approval')}
                >
                    Sent For Approval
                </Button>
            </View>
           
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
