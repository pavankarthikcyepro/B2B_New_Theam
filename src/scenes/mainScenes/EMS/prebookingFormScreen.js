import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
} from "../../../components";
import {
  setDatePicker,
  setCustomerDetails,
  updateSelectedDate,
  setCommunicationAddress,
  setFinancialDetails,
  setCommitmentDetails,
  setBookingPaymentDetails,
  setPriceConformationDetails,
  setOfferPriceDetails,
  setDropDownData,
  setDocumentUploadDetails,
  setBookingDropDetails,
  setImagePicker,
  getPrebookingDetailsApi,
  getCustomerTypesApi,
  updateFuelAndTransmissionType,
  updateDmsContactOrAccountDtoData,
  updateDmsLeadDtoData,
  updateDmsAddressData,
  updateModelSelectionData,
  updateFinancialData,
  updateBookingPaymentData,
  getOnRoadPriceAndInsurenceDetailsApi,
  getPaidAccessoriesListApi
} from "../../../redux/preBookingFormReducer";
import {
  RadioTextItem,
  CustomerAccordianHeaderItem,
  ImageSelectItem,
  DateSelectItem,
  DropDownSelectionItem
} from "../../../pureComponents";
import { ImagePickerComponent, SelectOtherVehicleComponant } from "../../../components";
import { Checkbox, List, Button } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import {
  Salutation_Types,
  Enquiry_Segment_Data,
  Marital_Status_Types,
  Finance_Types,
  Finance_Category_Types,
  Bank_Financer_Types,
  Approx_Auual_Income_Types
} from "../../../jsonData/enquiryFormScreenJsonData";
import {
  Payment_At_Types,
  Booking_Payment_Types,
  Vehicle_Types,
  Drop_reasons
} from "../../../jsonData/prebookingFormScreenJsonData";
import { AppNavigator } from "../../../navigations";

const rupeeSymbol = "\u20B9";

const TextAndAmountComp = ({
  title,
  amount,
  titleStyle = {},
  amoutStyle = {},
}) => {
  return (
    <View style={styles.textAndAmountView} >
      <Text
        style={[
          { fontSize: 14, fontWeight: "400", maxWidth: "70%", color: Colors.GRAY },
          titleStyle,
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

const PrebookingFormScreen = ({ route, navigation }) => {

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.preBookingFormReducer);
  const { universalId } = route.params;
  const [openAccordian, setOpenAccordian] = useState(0);
  const [componentAppear, setComponentAppear] = useState(false);
  const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "" })
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [showMultipleDropDownData, setShowMultipleDropDownData] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const { vehicle_modal_list } = useSelector(state => state.homeReducer);
  const [carModelsData, setCarModelsData] = useState([]);
  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({ varientList: [], varientListForDropDown: [] });
  const [carColorsData, setCarColorsData] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(0);
  const [selectedVarientId, setSelectedVarientId] = useState(0);
  const [insurenceVarientTypes, setInsurenceVarientTypes] = useState([]);
  const [insurenceAddOnTypes, setInsurenceAddOnTypes] = useState([]);
  const [warrentyTypes, setWarrentyTypes] = useState([]);
  const [selectedInsurencePrice, setSelectedInsurencePrice] = useState(0);
  const [selectedAddOnsPrice, setSelectedAddOnsPrice] = useState(0);
  const [selectedWarrentyPrice, setSelectedWarrentyPrice] = useState(0);
  const [selectedPaidAccessoriesPrice, setSelectedPaidAccessoriesPrice] = useState(0);
  const [totalOnRoadPrice, setTotalOnRoadPrice] = useState(0);
  const [totalOnRoadPriceAfterDiscount, setTotalOnRoadPriceAfterDiscount] = useState(0);
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
  })
  const [isDropSelected, setIsDropSelected] = useState(false);


  useEffect(() => {
    setComponentAppear(true);
    getAsyncstoreData();
    dispatch(getCustomerTypesApi());
    setCarModelsDataFromBase();
    getPreBookingDetailsFromServer();
  }, []);

  useEffect(() => {
    calculateOnRoadPrice();
  }, [priceInfomationData, selectedInsurencePrice, selectedAddOnsPrice, selectedWarrentyPrice, selectedPaidAccessoriesPrice, selector.vechicle_registration])

  useEffect(() => {
    calculateOnRoadPriceAfterDiscount();
  }, [selector.consumer_offer, selector.exchange_offer, selector.corporate_offer, selector.promotional_offer, selector.cash_discount, selector.for_accessories, selector.additional_offer_1, selector.additional_offer_2]);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName })
      dispatch(getPaidAccessoriesListApi(jsonObj.orgId));
    }
  }

  const getPreBookingDetailsFromServer = () => {
    if (universalId) {
      dispatch(getPrebookingDetailsApi(universalId));
    }
  }

  const setCarModelsDataFromBase = () => {
    let modalList = [];
    if (vehicle_modal_list.length > 0) {
      vehicle_modal_list.forEach(item => {
        modalList.push({ id: item.vehicleId, name: item.model })
      });
    }
    setCarModelsData([...modalList]);
  }

  useEffect(() => {
    if (selector.pre_booking_details_response) {

      let dmsContactOrAccountDto;
      if (selector.pre_booking_details_response.hasOwnProperty("dmsAccountDto")) {
        dmsContactOrAccountDto = selector.pre_booking_details_response.dmsAccountDto;
      }
      else if (selector.pre_booking_details_response.hasOwnProperty("dmsContactDto")) {
        dmsContactOrAccountDto = selector.pre_booking_details_response.dmsContactDto;
      }
      const dmsLeadDto = selector.pre_booking_details_response.dmsLeadDto;

      // Update dmsContactOrAccountDto
      dispatch(updateDmsContactOrAccountDtoData(dmsContactOrAccountDto));
      // Update updateDmsLeadDtoData
      dispatch(updateDmsLeadDtoData(dmsLeadDto));
      // Update Addresses
      dispatch(updateDmsAddressData(dmsLeadDto.dmsAddresses));
      // Updaet Model Selection
      dispatch(updateModelSelectionData(dmsLeadDto.dmsLeadProducts));
      // Update Finance Details
      dispatch(updateFinancialData(dmsLeadDto.dmsfinancedetails));
      // // Update Booking Payment Data
      dispatch(updateBookingPaymentData(dmsLeadDto.dmsBooking));
      // // Update Additional ore Replacement Buyer Data
      // dispatch(updateAdditionalOrReplacementBuyerData(dmsLeadDto.dmsExchagedetails));
      // // Update Attachment details
      // saveAttachmentDetailsInLocalObject(dmsLeadDto.dmsAttachments);
      // dispatch(updateDmsAttachmentDetails(dmsLeadDto.dmsAttachments));
    }
  }, [selector.pre_booking_details_response])

  useEffect(() => {
    if (selector.model_drop_down_data_update_status === "update") {
      updateVariantModelsData(selector.model, true, selector.varient);
    }
  }, [selector.model_drop_down_data_update_status]);

  useEffect(() => {
    if (selector.vehicle_on_road_price_insurence_details_response) {

      const varientTypes = selector.vehicle_on_road_price_insurence_details_response.insurance_vareint_mapping || [];
      if (varientTypes.length > 0) {
        let newFormatVarientTypes = [];
        varientTypes.forEach((item) => {
          newFormatVarientTypes.push({
            ...item,
            name: item.policy_name
          })
          if (selector.insurance_type === item.policy_name) {
            setSelectedInsurencePrice(item.cost);
          }
        })
        setInsurenceVarientTypes([...newFormatVarientTypes]);
      }

      const allWarrentyTypes = selector.vehicle_on_road_price_insurence_details_response.extended_waranty || [];
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
                    name: item.document_name
                  })
                }
              })
              setWarrentyTypes([...newFormatWarrentyTypes]);
            }
            break;
          }
        }
      }

      const allInsuranceAddOnTypes = selector.vehicle_on_road_price_insurence_details_response.insuranceAddOn || [];
      if (allInsuranceAddOnTypes.length > 0) {
        for (const object of allInsuranceAddOnTypes) {
          if (object.varient_id === selectedVarientId) {
            const matchedInsurenceAddOnTypes = object.add_on_price || [];
            let newFormatAddOnTypes = [];
            matchedInsurenceAddOnTypes.forEach((item) => {
              newFormatAddOnTypes.push({
                ...item,
                selected: false,
                name: item.document_name
              })
            })
            setInsurenceAddOnTypes([...newFormatAddOnTypes]);
            break;
          }
        }
      }

      setPriceInformationData({ ...selector.vehicle_on_road_price_insurence_details_response });
    }
  }, [selector.vehicle_on_road_price_insurence_details_response])

  const showDropDownModelMethod = (key, headerText) => {

    Keyboard.dismiss();

    switch (key) {
      case "SALUTATION":
        setDataForDropDown([...Salutation_Types]);
        break;
      case "ENQUIRY_SEGMENT":
        setDataForDropDown([...Enquiry_Segment_Data]);
        break;
      case "CUSTOMER_TYPE":
        setDataForDropDown([...selector.customer_types_data]);
        break;
      case "GENDER":
        setDataForDropDown([...selector.gender_types_data]);
        break;
      case "MARITAL_STATUS":
        setDataForDropDown([...Marital_Status_Types]);
        break;
      case "MODEL":
        setDataForDropDown([...carModelsData]);
        break;
      case "VARIENT":
        setDataForDropDown([...selectedCarVarientsData.varientListForDropDown]);
        break;
      case "COLOR":
        setDataForDropDown([...carColorsData]);
        break;
      case "RETAIL_FINANCE":
        setDataForDropDown([...Finance_Types]);
        break;
      case "FINANCE_CATEGORY":
        setDataForDropDown([...Finance_Category_Types]);
        break;
      case "BANK_FINANCE":
        setDataForDropDown([...Bank_Financer_Types]);
        break;
      case "APPROX_ANNUAL_INCOME":
        setDataForDropDown([...Approx_Auual_Income_Types]);
        break;
      case "FORM_60_PAN":
        setDataForDropDown([...selector.form_types_data]);
        break;
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
        setDataForDropDown([...insurenceVarientTypes]);
        break;
      case "WARRANTY":
        setDataForDropDown([...warrentyTypes]);
        break;
      case "INSURENCE_ADD_ONS":
        setDataForDropDown([...insurenceAddOnTypes]);
        setShowMultipleDropDownData(true);
        break;
      case "VEHICLE_TYPE":
        setDataForDropDown([...Vehicle_Types]);
        break;
      case "DROP_REASON":
        setDataForDropDown([...Drop_reasons]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  }

  const updateVariantModelsData = (selectedModelName, fromInitialize, selectedVarientName) => {

    if (!selectedModelName || selectedModelName.length === 0) { return }

    let arrTemp = vehicle_modal_list.filter(function (obj) {
      return obj.model === selectedModelName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.varients;
      setSelectedModelId(carModelObj.vehicleId);
      if (mArray.length) {
        mArray.forEach(item => {
          newArray.push({
            id: item.id,
            name: item.name
          })
        })
        setSelectedCarVarientsData({ varientList: [...mArray], varientListForDropDown: [...newArray] });
        if (fromInitialize) {
          updateColorsDataForSelectedVarient(selectedVarientName, [...mArray], carModelObj.vehicleId)
        }
      }
    }
  }

  const updateColorsDataForSelectedVarient = (selectedVarientName, varientList, modelId) => {

    if (!selectedVarientName || selectedVarientName.length === 0) { return }

    let arrTemp = varientList.filter(function (obj) {
      return obj.name === selectedVarientName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.vehicleImages;
      const varientId = carModelObj.id;
      setSelectedVarientId(varientId)
      if (mArray.length) {
        mArray.map(item => {
          newArray.push({
            id: item.id,
            name: item.color
          })
        })
        const obj = {
          fuelType: carModelObj.fuelType,
          transmissionType: carModelObj.transmission_type
        }
        dispatch(updateFuelAndTransmissionType(obj));
        dispatch(getOnRoadPriceAndInsurenceDetailsApi({ vehicleId: modelId, varientId: varientId }))
        setCarColorsData([...newArray]);
      }
    }
  }

  const calculateOnRoadPrice = () => {

    let totalPrice = 0;
    totalPrice += priceInfomationData.ex_showroom_price;
    totalPrice += getLifeTax();
    totalPrice += priceInfomationData.registration_charges;
    totalPrice += selectedInsurencePrice;
    totalPrice += selectedAddOnsPrice;
    totalPrice += selectedWarrentyPrice;
    totalPrice += priceInfomationData.handling_charges;
    totalPrice += priceInfomationData.essential_kit;
    totalPrice += getTcsAmount();
    totalPrice += selectedPaidAccessoriesPrice;
    totalPrice += priceInfomationData.fast_tag;
    setTotalOnRoadPrice(totalPrice);
    setTotalOnRoadPriceAfterDiscount(totalPrice);
  }

  const calculateOnRoadPriceAfterDiscount = () => {

    let totalPrice = totalOnRoadPrice;
    totalPrice -= Number(selector.consumer_offer);
    totalPrice -= Number(selector.exchange_offer);
    totalPrice -= Number(selector.corporate_offer);
    totalPrice -= Number(selector.promotional_offer);
    totalPrice -= Number(selector.cash_discount);
    totalPrice -= Number(selector.for_accessories);
    totalPrice -= Number(selector.additional_offer_1);
    totalPrice -= Number(selector.additional_offer_2);
    setTotalOnRoadPriceAfterDiscount(totalPrice);
  }

  const updatePaidAccessroies = (totalPrice) => {
    setSelectedPaidAccessoriesPrice(totalPrice);
  }

  const getLifeTax = () => {
    switch (selector.enquiry_segment) {
      case 'Handicapped':
        return selector.vechicle_registration === true ? 1000 : 500;
      case 'Personal':
        return selector.vechicle_registration === true ? priceInfomationData.ex_showroom_price * 0.14 : priceInfomationData.ex_showroom_price * 0.12;
      default:
        return priceInfomationData.ex_showroom_price * 0.14;
    }
  }

  const getTcsAmount = () => {
    let amount = 0;
    if (priceInfomationData.ex_showroom_price > 1000000) {
      amount = priceInfomationData.ex_showroom_price * (priceInfomationData.tcs_percentage / 100);
    } else {
      amount = priceInfomationData.tcs_amount;
    }
    return amount
  }

  const updateAccordian = (selectedIndex) => {
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
    }
  };

  if (!componentAppear) {
    return (
      <View style={styles.initialContainer}>
        <ActivityIndicator size="small" color={Colors.RED} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
      <ImagePickerComponent
        visible={selector.showImagePicker}
        keyId={selector.imagePickerKeyId}
        selectedImage={(data, keyId) => {
          console.log("imageObj: ", data, keyId);
        }}
        onDismiss={() => dispatch(setImagePicker(""))}
      />

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
          }
          else if (dropDownKey === "VARIENT") {
            updateColorsDataForSelectedVarient(item.name, selectedCarVarientsData.varientList, selectedModelId);
          }
          else if (dropDownKey === "INSURANCE_TYPE") {
            setSelectedInsurencePrice(item.cost);
          }
          else if (dropDownKey === "WARRANTY") {
            setSelectedWarrentyPrice(Number(item.cost));
          }
          else if (dropDownKey === "INSURENCE_ADD_ONS") {
            let totalCost = 0;
            let names = "";
            if (item.length > 0) {
              item.forEach((obj, index) => {
                totalCost += Number(obj.cost);
                names += obj.name + ((index + 1) < item.length ? ", " : "");
              })
            }
            setSelectedAddOnsPrice(totalCost);
            dispatch(setDropDownData({ key: dropDownKey, value: names, id: "" }));
            return
          }
          dispatch(setDropDownData({ key: dropDownKey, value: item.name, id: item.id }));
        }}
      />

      {selector.showDatepicker && (
        <DatePickerComponent
          visible={selector.showDatepicker}
          mode={"date"}
          value={new Date(Date.now())}
          onChange={(event, selectedDate) => {
            console.log("date: ", selectedDate);
            if (Platform.OS === "android") {
              // setDatePickerVisible(false)
            }
            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
          }}
          onRequestClose={() => dispatch(setDatePicker())}
        />
      )}

      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >

        {/* // 1. Customer Details */}
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            <List.AccordionGroup
              expandedId={openAccordian}
              onAccordionPress={(expandedId) => updateAccordian(expandedId)}
            >
              {/* // 1.Customer Details */}
              <List.Accordion
                id={"1"}
                title={"Customer Details"}
                titleStyle={{
                  color: openAccordian === "1" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={{
                  backgroundColor:
                    openAccordian === "1" ? Colors.RED : Colors.WHITE,
                }}
              >
                <DropDownSelectionItem
                  label={"Salutation"}
                  value={selector.salutation}
                  onPress={() => showDropDownModelMethod("SALUTATION", "Salutation")}
                />

                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  value={selector.first_name}
                  label={"First Name*"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerDetails({ key: "FIRST_NAME", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  value={selector.last_name}
                  label={"Last Name*"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(setCustomerDetails({ key: "LAST_NAME", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  value={selector.mobile}
                  editable={false}
                  label={"Mobile Number*"}
                  onChangeText={(text) =>
                    dispatch(setCustomerDetails({ key: "MOBILE", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  value={selector.email}
                  label={"Email ID*"}
                  keyboardType={"email-address"}
                  onChangeText={(text) =>
                    dispatch(setCustomerDetails({ key: "EMAIL", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <DropDownSelectionItem
                  label={"Enquiry Segment"}
                  value={selector.enquiry_segment}
                  onPress={() => showDropDownModelMethod("ENQUIRY_SEGMENT", "Enquiry Segment")}
                />
                <DropDownSelectionItem
                  label={"Customer Type"}
                  value={selector.customer_type}
                  onPress={() => showDropDownModelMethod("CUSTOMER_TYPE", "Customer Type")}
                />
                {selector.enquiry_segment.toLowerCase() === "personal" ? <View>
                  <DropDownSelectionItem
                    label={"Gender"}
                    value={selector.gender}
                    onPress={() => showDropDownModelMethod("GENDER", "Gender")}
                  />
                  <DateSelectItem
                    label={"Date Of Birth"}
                    value={selector.date_of_birth}
                    onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
                  />
                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    value={selector.age}
                    label={"Age"}
                    keyboardType={"number-pad"}
                    onChangeText={(text) =>
                      dispatch(setCustomerDetails({ key: "AGE", text: text }))
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <DropDownSelectionItem
                    label={"Marital Status"}
                    value={selector.marital_status}
                    onPress={() => showDropDownModelMethod("MARITAL_STATUS", "Marital Status")}
                  />
                </View> : null}
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 2.Communication Address */}
              <List.Accordion
                id={"2"}
                title={"Communication Address"}
                titleStyle={{
                  color: openAccordian === "2" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={{
                  backgroundColor:
                    openAccordian === "2" ? Colors.RED : Colors.WHITE,
                }}
              >
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.pincode}
                  label={"Pincode*"}
                  keyboardType={"number-pad"}
                  onChangeText={(text) => dispatch(setCommunicationAddress({ key: "PINCODE", text: text }))}
                />
                <Text style={GlobalStyle.underline}></Text>
                <View style={styles.radioGroupBcVw}>
                  <RadioTextItem
                    label={"Urban"}
                    value={"urban"}
                    status={selector.urban_or_rural === 1 ? true : false}
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "RURAL_URBAN",
                          text: "1",
                        })
                      )
                    }
                  />
                  <RadioTextItem
                    label={"Rural"}
                    value={"rural"}
                    status={selector.urban_or_rural === 2 ? true : false}
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "RURAL_URBAN",
                          text: "2",
                        })
                      )
                    }
                  />
                </View>
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.house_number}
                  keyboardType={"number-pad"}
                  label={"H.No*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "HOUSE_NO", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.street_name}
                  label={"Street Name*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "STREET_NAME",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.village}
                  label={"Village*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "VILLAGE", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.city}
                  label={"City*"}
                  onChangeText={(text) =>
                    dispatch(setCommunicationAddress({ key: "CITY", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.district}
                  label={"District*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "DISTRICT", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.state}
                  label={"State*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "STATE", text: text })
                    )
                  }
                />
                {/* // Permanent Addresss */}
                <View style={styles.radioGroupBcVw}>
                  <Text style={styles.permanentAddText}>
                    {"Permanent Address"}
                  </Text>
                  <Checkbox.Android
                    uncheckedColor={Colors.GRAY}
                    color={Colors.RED}
                    status={selector.permanent_address ? "checked" : "unchecked"}
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "PERMANENT_ADDRESS",
                          text: "",
                        })
                      )
                    }
                  />
                </View>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.p_pincode}
                  label={"Pincode*"}
                  keyboardType={"number-pad"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "P_PINCODE",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                <View style={styles.radioGroupBcVw}>
                  <RadioTextItem
                    label={"Urban"}
                    value={"urban"}
                    status={selector.p_urban_or_rural === 1 ? true : false}
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "P_RURAL_URBAN",
                          text: "1",
                        })
                      )
                    }
                  />
                  <RadioTextItem
                    label={"Rural"}
                    value={"rural"}
                    status={selector.p_urban_or_rural === 2 ? true : false}
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "P_RURAL_URBAN",
                          text: "2",
                        })
                      )
                    }
                  />
                </View>
                <Text style={GlobalStyle.underline}></Text>

                <TextinputComp
                  style={styles.textInputStyle}
                  label={"H.No*"}
                  keyboardType={"number-pad"}
                  value={selector.p_houseNum}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "P_HOUSE_NO",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  label={"Street Name*"}
                  value={selector.p_streetName}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "P_STREET_NAME",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.p_village}
                  label={"Village*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "P_VILLAGE",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.p_city}
                  label={"City*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "P_CITY", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.p_district}
                  label={"District*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "P_DISTRICT",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.p_state}
                  label={"State*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "P_STATE",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 3.Modal Selction */}
              <List.Accordion
                id={"3"}
                title={"Modal Selection"}
                titleStyle={{
                  color: openAccordian === "3" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={{
                  backgroundColor:
                    openAccordian === "3" ? Colors.RED : Colors.WHITE,
                }}
              >
                <DropDownSelectionItem
                  label={"Model"}
                  value={selector.model}
                  onPress={() => showDropDownModelMethod("MODEL", "Model")}
                />
                <DropDownSelectionItem
                  label={"Varient"}
                  value={selector.varient}
                  onPress={() => showDropDownModelMethod("VARIENT", "Varient")}
                />
                <DropDownSelectionItem
                  label={"Color"}
                  value={selector.color}
                  onPress={() => showDropDownModelMethod("COLOR", "Color")}
                />
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  value={selector.fuel_type}
                  label={"Fuel Type"}
                  editable={false}
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  value={selector.transmission_type}
                  label={"Transmission Type"}
                  editable={false}
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 4.Financial Details */}
              <List.Accordion
                id={"4"}
                title={"Financial Details"}
                titleStyle={{
                  color: openAccordian === "4" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={{
                  backgroundColor:
                    openAccordian === "4" ? Colors.RED : Colors.WHITE,
                }}
              >
                <DropDownSelectionItem
                  label={"Retail Finance"}
                  value={selector.retail_finance}
                  onPress={() => showDropDownModelMethod("RETAIL_FINANCE", "Retail Finance")}
                />

                {selector.retail_finance === "Out House" ? (
                  <View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Bank/Finance Name"}
                      value={selector.bank_or_finance_name}
                      onChangeText={(text) => dispatch(setFinancialDetails({ key: "BANK_R_FINANCE_NAME", text: text, }))}
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Location"}
                      value={selector.location}
                      onChangeText={(text) => dispatch(setFinancialDetails({ key: "LOCATION", text: text }))}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                ) : null}

                {selector.retail_finance === "Leashing" && (
                  <View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Leashing Name"}
                      value={selector.leashing_name}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({
                            key: "LEASHING_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {selector.retail_finance === "In House" && (
                  <DropDownSelectionItem
                    label={"Finance Category"}
                    value={selector.finance_category}
                    onPress={() => showDropDownModelMethod("FINANCE_CATEGORY", "Finance Category")}
                  />)}

                {selector.retail_finance === "In House" && (
                  <View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Down Payment*"}
                      value={selector.down_payment}
                      keyboardType={"number-pad"}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({ key: "DOWN_PAYMENT", text: text })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {(selector.retail_finance === "In House" ||
                  selector.retail_finance === "Out House") && (
                    <View>
                      <TextinputComp
                        style={{ height: 65, width: "100%" }}
                        label={"Loan Amount*"}
                        keyboardType={"number-pad"}
                        value={selector.loan_amount}
                        onChangeText={(text) =>
                          dispatch(
                            setFinancialDetails({ key: "LOAN_AMOUNT", text: text })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <TextinputComp
                        style={{ height: 65, width: "100%" }}
                        label={"Rate of Interest*"}
                        keyboardType={"number-pad"}
                        value={selector.rate_of_interest}
                        onChangeText={(text) =>
                          dispatch(
                            setFinancialDetails({
                              key: "RATE_OF_INTEREST",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}

                {selector.retail_finance === "In House" && (
                  <View>
                    <DropDownSelectionItem
                      label={"Bank/Financer"}
                      value={selector.bank_or_finance}
                      onPress={() => showDropDownModelMethod("BANK_FINANCE", "Bank/Financer")}
                    />

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Loan of Tenure(Months)"}
                      value={selector.loan_of_tenure}
                      keyboardType={"number-pad"}
                      onChangeText={(text) => dispatch(setFinancialDetails({ key: "LOAN_OF_TENURE", text: text }))}
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"EMI*"}
                      value={selector.emi}
                      keyboardType={"number-pad"}
                      onChangeText={(text) => dispatch(setFinancialDetails({ key: "EMI", text: text }))}
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <DropDownSelectionItem
                      label={"Approx Annual Income"}
                      value={selector.approx_annual_income}
                      onPress={() => showDropDownModelMethod("APPROX_ANNUAL_INCOME", "Approx Annual Income")}
                    />
                  </View>
                )}
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 5.Document Upload */}
              <List.Accordion
                id={"5"}
                title={"Document Upload"}
                titleStyle={{
                  color: openAccordian === "5" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={{
                  backgroundColor:
                    openAccordian === "5" ? Colors.RED : Colors.WHITE,
                }}
              >
                <DropDownSelectionItem
                  label={"Form60/PAN"}
                  value={selector.form_or_pan}
                  onPress={() => showDropDownModelMethod("FORM_60_PAN", "Retail Finance")}
                />

                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.adhaar_number}
                  label={"Aadhaar Number*"}
                  onChangeText={(text) =>
                    dispatch(
                      setDocumentUploadDetails({ key: "ADHAR", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <View style={styles.select_image_bck_vw}>
                  <ImageSelectItem
                    name={"Upload Adhar"}
                    onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))}
                  />
                </View>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.relationship_proof}
                  label={"Relationship Number*"}
                  onChangeText={(text) =>
                    dispatch(
                      setDocumentUploadDetails({
                        key: "RELATIONSHIP_PROOF",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <View style={styles.select_image_bck_vw}>
                  <ImageSelectItem
                    name={"Relationship Proof"}
                    onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))}
                  />
                </View>
                {/* <DropDownSelectionItem
                  label={"Customer Type Category"}
                  value={selector.customer_type_category} // selector.dropDownData
                  onPress={() => showDropDownModelMethod("CUSTOMER_TYPE_CATEGORY", "Retail Finance")}
                /> */}
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 6.Price Confirmation */}
              <List.Accordion
                id={"6"}
                title={"Price Confirmation"}
                description={rupeeSymbol + " " + totalOnRoadPrice.toFixed(2)}
                titleStyle={{
                  color: openAccordian === "6" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                descriptionStyle={{
                  color: openAccordian === "6" ? Colors.WHITE : Colors.RED,
                  paddingTop: 5, fontSize: 16, fontWeight: "600"
                }}
                style={{
                  backgroundColor:
                    openAccordian === "6" ? Colors.RED : Colors.WHITE,
                }}
              >
                <TextAndAmountComp title={"Ex-Showroom Price:"} amount={priceInfomationData.ex_showroom_price.toFixed(2)} />
                <View style={styles.radioGroupBcVw}>
                  <Checkbox.Android
                    style={{ margin: 0, padding: 0 }}
                    uncheckedColor={Colors.GRAY}
                    color={Colors.RED}
                    status={
                      selector.vechicle_registration ? "checked" : "unchecked"
                    }
                    onPress={() => {
                      dispatch(
                        setPriceConformationDetails({
                          key: "VECHILE_REGISTRATION",
                          text: "",
                        })
                      )
                    }}
                  />
                  <Text style={styles.checkboxAddText}>
                    {"Any Other Vehicle Registration on Your Name"}
                  </Text>
                </View>

                {selector.vechicle_registration ? <View>
                  <DropDownSelectionItem
                    label={"Vehicle Type"}
                    value={selector.vehicle_type}
                    onPress={() => showDropDownModelMethod("VEHICLE_TYPE", "Vehicle Type")}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.registration_number}
                    label={"Reg. No"}
                    onChangeText={(text) =>
                      dispatch(
                        setPriceConformationDetails({ key: "REGISTRATION_NUMBER", text: text })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </View> : null}

                <TextAndAmountComp title={"Life Tax:"} amount={getLifeTax().toFixed(2)} />
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
                      onPress={() => showDropDownModelMethod("INSURANCE_TYPE", "Insurance Type")}
                    />
                  </View>
                  <Text style={styles.shadowText}>{rupeeSymbol + " " + selectedInsurencePrice.toFixed(2)}</Text>
                </View>

                <View style={styles.symbolview}>
                  <View style={{ width: "70%" }}>
                    <DropDownSelectionItem
                      label={"Add-on Insurance"}
                      value={selector.add_on_insurance}
                      onPress={() => showDropDownModelMethod("INSURENCE_ADD_ONS", "Add-on Insurance")}
                    />
                  </View>
                  <Text style={styles.shadowText}>{rupeeSymbol + " " + selectedAddOnsPrice.toFixed(2)}</Text>
                </View>

                <View style={styles.symbolview}>
                  <View style={{ width: "70%" }}>
                    <DropDownSelectionItem
                      label={"Warranty"}
                      value={selector.warranty}
                      onPress={() => showDropDownModelMethod("WARRANTY", "Warranty")}
                    />
                  </View>
                  <Text style={styles.shadowText}>{rupeeSymbol + " " + selectedWarrentyPrice.toFixed(2)}</Text>
                </View>
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp title={"Handling Charges:"} amount={priceInfomationData.handling_charges.toFixed(2)} />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp title={"Essential Kit:"} amount={priceInfomationData.essential_kit.toFixed(2)} />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp
                  title={"TCS(>10Lakhs -> %):"}
                  amount={getTcsAmount().toFixed(2)}
                />
                <Text style={GlobalStyle.underline}></Text>

                <Pressable onPress={() => navigation.navigate(AppNavigator.EmsStackIdentifiers.paidAccessories, { accessorylist: selector.paid_accessories_list, callback: updatePaidAccessroies })}>
                  <TextAndAmountComp title={"Paid Accessories:"} amount={selectedPaidAccessoriesPrice.toFixed(2)} />
                </Pressable>
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp title={"Fast Tag:"} amount={priceInfomationData.fast_tag.toFixed(2)} />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp
                  title={"On Road Price:"}
                  amount={totalOnRoadPrice.toFixed(2)}
                  titleStyle={{ fontSize: 18, fontWeight: "800" }}
                  amoutStyle={{ fontSize: 18, fontWeight: "800" }}
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 7.Offer Price */}
              <List.Accordion
                id={"7"}
                title={"Offer Price"}
                description={rupeeSymbol + " " + totalOnRoadPriceAfterDiscount.toFixed(2)}
                titleStyle={{
                  color: openAccordian === "7" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                descriptionStyle={{
                  color: openAccordian === "7" ? Colors.WHITE : Colors.RED,
                  paddingTop: 5, fontSize: 16, fontWeight: "600"
                }}
                style={{
                  backgroundColor:
                    openAccordian === "7" ? Colors.RED : Colors.WHITE,
                }}
              >
                <TextinputComp
                  style={styles.offerPriceTextInput}
                  label={"Consumer Offer:"}
                  value={selector.consumer_offer}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "CONSUMER_OFFER",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.offerPriceTextInput}
                  label={"Exchange Offer:"}
                  value={selector.exchange_offer}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "EXCHANGE_OFFER",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.offerPriceTextInput}
                  label={"Coporate Offer:"}
                  value={selector.corporate_offer}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "CORPORATE_OFFER",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.offerPriceTextInput}
                  label={"Promotional Offer:"}
                  value={selector.promotional_offer}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "PROMOTIONAL_OFFER",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.offerPriceTextInput}
                  label={"Cash Discount:"}
                  value={selector.cash_discount}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "CASH_DISCOUNT",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.offerPriceTextInput}
                  label={"Foc Accessories:"}
                  value={selector.for_accessories}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "FOR_ACCESSORIES",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.offerPriceTextInput}
                  label={"Additional Offer 1:"}
                  value={selector.additional_offer_1}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "ADDITIONAL_OFFER_1",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.offerPriceTextInput}
                  label={"Additional Offer 2:"}
                  value={selector.additional_offer_2}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "ADDITIONAL_OFFER_2",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp
                  title={"On Road Price After Discount:"}
                  amount={totalOnRoadPriceAfterDiscount.toFixed(2)}
                  titleStyle={{ fontSize: 18, fontWeight: "800" }}
                  amoutStyle={{ fontSize: 18, fontWeight: "800" }}
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 8.Booking Payment Mode */}
              <List.Accordion
                id={"8"}
                title={"Booking Payment Mode"}
                titleStyle={{
                  color: openAccordian === "8" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={{
                  backgroundColor:
                    openAccordian === "8" ? Colors.RED : Colors.WHITE,
                }}
              >
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  value={selector.booking_amount}
                  label={"Booking Amount*"}
                  keyboardType={"number-pad"}
                  onChangeText={(text) =>
                    dispatch(
                      setBookingPaymentDetails({
                        key: "BOOKING_AMOUNT",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                <DropDownSelectionItem
                  label={"Payment At"}
                  value={selector.payment_at}
                  onPress={() => showDropDownModelMethod("PAYMENT_AT", "Payment At")}
                />

                <DropDownSelectionItem
                  label={"Booking Payment Mode"}
                  value={selector.booking_payment_mode}
                  onPress={() => showDropDownModelMethod("BOOKING_PAYMENT_MODE", "Booking Payment Mode")}
                />
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 9.Commitment */}
              <List.Accordion
                id={"9"}
                title={"Commitment"}
                titleStyle={{
                  color: openAccordian === "9" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={{
                  backgroundColor:
                    openAccordian === "9" ? Colors.RED : Colors.WHITE,
                }}
              >
                <DateSelectItem
                  label={"Customer Preferred Date*"}
                  value={selector.customer_preferred_date}
                  onPress={() =>
                    dispatch(setDatePicker("CUSTOMER_PREFERRED_DATE"))
                  }
                />
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Occasion*"}
                  value={selector.occasion}
                  onChangeText={(text) =>
                    dispatch(
                      setCommitmentDetails({ key: "OCCASION", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <DateSelectItem
                  label={"Tentative Delivery Date*"}
                  value={selector.tentative_delivery_date}
                  onPress={() =>
                    dispatch(setDatePicker("TENTATIVE_DELIVERY_DATE"))
                  }
                />
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Delivery Location*"}
                  value={selector.delivery_location}
                  onChangeText={(text) =>
                    dispatch(
                      setCommitmentDetails({
                        key: "DELIVERY_LOCATON",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              <View style={styles.space}></View>
              {isDropSelected ? (<View style={styles.space}></View>) : null}
              {isDropSelected ? (
                <List.Accordion
                  id={"10"}
                  title={"PreBooking Drop Section"}
                  titleStyle={{
                    color: openAccordian === "10" ? Colors.WHITE : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={{
                    backgroundColor:
                      openAccordian === "10" ? Colors.RED : Colors.WHITE,
                  }}
                >
                  <DropDownSelectionItem
                    label={"Drop Reason"}
                    value={selector.drop_reason}
                    onPress={() => showDropDownModelMethod("DROP_REASON", "Drop Reason")}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.drop_remarks}
                    label={"Remarks"}
                    onChangeText={(text) =>
                      dispatch(
                        setBookingDropDetails({
                          key: "DROP_REMARKS",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </List.Accordion>
              ) : null}
            </List.AccordionGroup>
            {!isDropSelected && (
              <View style={styles.actionBtnView}>
                <Button
                  mode="contained"
                  style={{ width: 120 }}
                  color={Colors.BLACK}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => setIsDropSelected(true)}
                >
                  Drop
                </Button>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => { }}
                >
                  SUBMIT
                </Button>
              </View>
            )}
            {isDropSelected && (<View style={styles.prebookingBtnView}>
              <Button
                mode="contained"
                color={Colors.RED}
                labelStyle={{ textTransform: "none" }}
                onPress={() => { }}
              >
                Proceed To Cancellation
              </Button>
            </View>)}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PrebookingFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  baseVw: {
    paddingHorizontal: 10,
  },
  drop_down_view_style: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  shadow: {
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 3,
  },
  view1: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 5,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "600",
  },
  accordianBckVw: {
    backgroundColor: Colors.WHITE,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  accordianTitleStyle: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.BLACK,
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 35,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  permanentAddText: {
    fontSize: 16,
    fontWeight: "600",
  },
  view2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    paddingTop: 20,
    paddingLeft: 12,
  },
  looking_any_text: {
    fontSize: 16,
    fontWeight: "500",
  },
  space: {
    height: 10,
  },
  checkboxAddText: {
    fontSize: 12,
    fontWeight: "400",
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
  select_image_bck_vw: {
    minHeight: 50,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  textAndAmountView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    minHeight: 40,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: Colors.WHITE
  },
  offerPriceTextInput: {
    height: 55,
    width: "100%"
  },
  actionBtnView: {
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  prebookingBtnView: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
  },
});
