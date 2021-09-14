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
  KeyboardAvoidingView
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
  setImagePicker,
  getPrebookingDetailsApi,
  getCustomerTypesApi,
  updateFuelAndTransmissionType
} from "../../../redux/preBookingFormReducer";
import {
  RadioTextItem,
  CustomerAccordianHeaderItem,
  ImageSelectItem,
  DateSelectItem,
  DropDownSelectionItem
} from "../../../pureComponents";
import { ImagePickerComponent } from "../../../components";
import { Checkbox, List } from "react-native-paper";
import { Dropdown } from "sharingan-rn-modal-dropdown";
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
  Booking_Payment_Types
} from "../../../jsonData/prebookingFormScreenJsonData";

const rupeeSymbol = "\u20B9";

const TextAndAmountComp = ({
  title,
  amount,
  titleStyle = {},
  amoutStyle = {},
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        minHeight: 40,
        paddingVertical: 5,
        alignItems: "center",
      }}
    >
      <Text
        style={[
          { fontSize: 14, fontWeight: "400", maxWidth: "70%" },
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
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const { vehicle_modal_list } = useSelector(state => state.homeReducer);
  const [carModelsData, setCarModelsData] = useState([]);
  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({ varientList: [], varientListForDropDown: [] });
  const [carColorsData, setCarColorsData] = useState([]);

  useEffect(() => {
    setComponentAppear(true);
    getAsyncstoreData();
    dispatch(getCustomerTypesApi());
    getPreBookingDetailsFromServer();
    setCarModelsDataFromBase();
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
      // dispatch(updateDmsContactOrAccountDtoData(dmsContactOrAccountDto));
      // Update updateDmsLeadDtoData
      // dispatch(updateDmsLeadDtoData(dmsLeadDto));
      // Update Addresses
      // dispatch(updateDmsAddressData(dmsLeadDto.dmsAddresses));
      // // Updaet Model Selection
      // dispatch(updateModelSelectionData(dmsLeadDto.dmsLeadProducts));
      // // Update Finance Details
      // dispatch(updateFinancialData(dmsLeadDto.dmsfinancedetails));
      // // Update Customer Need Analysys
      // dispatch(updateCustomerNeedAnalysisData(dmsLeadDto.dmsLeadScoreCards));
      // // Update Additional ore Replacement Buyer Data
      // dispatch(updateAdditionalOrReplacementBuyerData(dmsLeadDto.dmsExchagedetails));
      // // Update Attachment details
      // saveAttachmentDetailsInLocalObject(dmsLeadDto.dmsAttachments);
      // dispatch(updateDmsAttachmentDetails(dmsLeadDto.dmsAttachments));
    }
  }, [selector.pre_booking_details_response])

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
      if (mArray.length) {
        mArray.forEach(item => {
          newArray.push({
            id: item.id,
            name: item.name
          })
        })
        setSelectedCarVarientsData({ varientList: [...mArray], varientListForDropDown: [...newArray] });
        if (fromInitialize) {
          updateColorsDataForSelectedVarient(selectedVarientName, [...mArray])
        }
      }
    }
  }

  const updateColorsDataForSelectedVarient = (selectedVarientName, varientList) => {

    if (!selectedVarientName || selectedVarientName.length === 0) { return }

    let arrTemp = varientList.filter(function (obj) {
      return obj.name === selectedVarientName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.vehicleImages;
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
        setCarColorsData([...newArray]);
      }
    }
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
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (dropDownKey === "MODEL") {
            updateVariantModelsData(item.name, false);
          }
          else if (dropDownKey === "VARIENT") {
            updateColorsDataForSelectedVarient(item.name, selectedCarVarientsData.varientList);
          }
          else if (dropDownKey === "C_MAKE" || dropDownKey === "R_MAKE" || dropDownKey === "A_MAKE") {
            // updateModelTypesForCustomerNeedAnalysis(item.name, dropDownKey);
          }
          setShowDropDownModel(false);
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
                titleStyle={{
                  color: openAccordian === "6" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={{
                  backgroundColor:
                    openAccordian === "6" ? Colors.RED : Colors.WHITE,
                }}
              >
                <TextAndAmountComp title={"Ex-Showroom Price:"} amount={"0.00"} />
                <View style={styles.radioGroupBcVw}>
                  <Checkbox.Android
                    style={{ margin: 0, padding: 0 }}
                    uncheckedColor={Colors.GRAY}
                    color={Colors.RED}
                    status={
                      selector.vechicle_registration ? "checked" : "unchecked"
                    }
                    onPress={() =>
                      dispatch(
                        setPriceConformationDetails({
                          key: "VECHILE_REGISTRATION",
                          text: "",
                        })
                      )
                    }
                  />
                  <Text style={styles.checkboxAddText}>
                    {"Any Other Vehicle Registration on Your Name"}
                  </Text>
                </View>
                <TextAndAmountComp title={"Life Tax:"} amount={"0.00"} />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp
                  title={"Registration Charges:"}
                  amount={"0.00"}
                />
                <Text style={GlobalStyle.underline}></Text>

                <View style={styles.symbolview}>
                  <View style={{ width: "70%" }}>
                    <View style={styles.drop_down_view_style}>
                      <Dropdown
                        label="Insurance Type"
                        data={selector.insurance_types_data}
                        required={true}
                        floating={true}
                        value={selector.insurance_type}
                        onChange={(value) =>
                          dispatch(
                            setDropDownData({
                              key: "INSURANCE_TYPE",
                              value: value,
                            })
                          )
                        }
                      />
                    </View>
                  </View>
                  <Text style={styles.shadowText}>{rupeeSymbol + " 0.00"}</Text>
                </View>

                <TextAndAmountComp title={"Add-on Insurance:"} amount={"0.00"} />
                <Text style={GlobalStyle.underline}></Text>

                <View style={styles.symbolview}>
                  <View style={{ width: "70%" }}>
                    <View style={styles.drop_down_view_style}>
                      <Dropdown
                        label="Warranty"
                        data={selector.warranty_types_data}
                        required={true}
                        floating={true}
                        value={selector.warranty}
                        onChange={(value) =>
                          dispatch(
                            setDropDownData({
                              key: "WARRANTY",
                              value: value,
                            })
                          )
                        }
                      />
                    </View>
                  </View>
                  <Text style={styles.shadowText}>{"\u20B9"} 0.00</Text>
                </View>
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp title={"Handling Charges:"} amount={"0.00"} />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp title={"Essential Kit:"} amount={"0.00"} />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp
                  title={"TCS(>10Lakhs -> %):"}
                  amount={"0.00"}
                />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp title={"Paid Accessories:"} amount={"0.00"} />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp title={"Fast Tag:"} amount={"0.00"} />
                <Text style={GlobalStyle.underline}></Text>

                <TextAndAmountComp
                  title={"On Road Price:"}
                  amount={"0.00"}
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
                titleStyle={{
                  color: openAccordian === "7" ? Colors.WHITE : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={{
                  backgroundColor:
                    openAccordian === "7" ? Colors.RED : Colors.WHITE,
                }}
              >
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Consumer Offer:"}
                  value={selector.consumer_offer}
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
                  style={{ height: 65, width: "100%" }}
                  label={"Exchange Offer:"}
                  value={selector.exchange_offer}
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
                  style={{ height: 65, width: "100%" }}
                  label={"Coporate Offer:"}
                  value={selector.corporate_offer}
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
                  style={{ height: 65, width: "100%" }}
                  label={"Promotional Offer:"}
                  value={selector.promotional_offer}
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
                  style={{ height: 65, width: "100%" }}
                  label={"Cash Discount:"}
                  value={selector.cash_discount}
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
                  style={{ height: 65, width: "100%" }}
                  label={"Foc Accessories:"}
                  value={selector.for_accessories}
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
                  style={{ height: 65, width: "100%" }}
                  label={"Additional Offer 1:"}
                  value={selector.additional_offer_1}
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
                  style={{ height: 65, width: "100%" }}
                  label={"Additional Offer 2:"}
                  value={selector.additional_offer_2}
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
                  amount={"0.00"}
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
            </List.AccordionGroup>
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
});
