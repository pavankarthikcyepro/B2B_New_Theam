import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { DefaultTheme, Checkbox, IconButton, List, Button } from "react-native-paper";
import { Colors, GlobalStyle } from "../../../styles";
import VectorImage from "react-native-vector-image";
import {
  MODEL_SELECTION,
  COMMUNICATION_DETAILS,
  CUSTOMER_PROFILE,
  FINANCE_DETAILS,
  DOCUMENT_UPLOAD,
  CUSTOMER_NEED_ANALYSIS,
  PERSONAL_DETAILS,
} from "../../../assets/svg";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
} from "../../../components";
import {
  setEditable,
  setDatePicker,
  setPersonalIntro,
  setCommunicationAddress,
  setCustomerProfile,
  updateSelectedDate,
  setFinancialDetails,
  setCustomerNeedAnalysis,
  setImagePicker,
  setUploadDocuments,
  setDropDownData,
  setAdditionalBuyerDetails,
  setReplacementBuyerDetails,
  setEnquiryDropDetails,
  getEnquiryDetailsApi,
  updateDmsContactOrAccountDtoData,
  updateDmsLeadDtoData,
  updateDmsAddressData,
  updateModelSelectionData,
  updateFinancialData,
  setDropDownDataNew,
  getCustomerTypesApi,
  updateFuelAndTransmissionType,
  updateCustomerNeedAnalysisData,
  updateAdditionalOrReplacementBuyerData,
  dropEnquiryApi,
  updateEnquiryDetailsApi
} from "../../../redux/enquiryFormReducer";
import {
  RadioTextItem,
  DropDownSelectionItem,
  ImageSelectItem,
  DateSelectItem,
} from "../../../pureComponents";
import { ImagePickerComponent } from "../../../components";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import {
  Salutation_Types,
  Enquiry_Segment_Data,
  Enquiry_Sub_Source_Type_Data,
  Enquiry_Category_Type_Data,
  Buyer_Type_Data,
  Kms_Travelled_Type_Data,
  Who_Drive_Type_Data,
  How_Many_Family_Members_Data,
  Prime_Exception_Types_Data,
  Finance_Types,
  Finance_Category_Types,
  Bank_Financer_Types,
  Approx_Auual_Income_Types,
  All_Car_Brands,
  Transmission_Types,
  Fuel_Types,
  Enquiry_Drop_Reasons,
  Insurence_Types
} from "../../../jsonData/enquiryFormScreenJsonData";
import { showToast, showToastSucess } from "../../../utils/toast";
import * as AsyncStore from "../../../asyncStore";
import { convertDateStringToMilliseconds } from "../../../utils/helperFunctions";

const theme = {
  ...DefaultTheme,
  // Specify custom property
  roundness: 0,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    background: Colors.WHITE,
  },
};

const DetailsOverviewScreen = ({ route, navigation }) => {

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.enquiryFormReducer);
  const { vehicle_modal_list } = useSelector(state => state.homeReducer);
  const [openAccordian, setOpenAccordian] = useState("0");
  const [componentAppear, setComponentAppear] = useState(false);
  const { universalId } = route.params;
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [carModelsData, setCarModelsData] = useState([]);
  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({ varientList: [], varientListForDropDown: [] });
  const [carColorsData, setCarColorsData] = useState([]);
  const [c_model_types, set_c_model_types] = useState([]);
  const [r_model_types, set_r_model_types] = useState([]);
  const [a_model_types, set_a_model_types] = useState([]);
  const [showPreBookingBtn, setShowPreBookingBtn] = useState(false);
  const [isDropSelected, setIsDropSelected] = useState(false);
  const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "" })

  useEffect(() => {
    getAsyncstoreData();
    setComponentAppear(true);
    getEnquiryDetailsFromServer();
    dispatch(getCustomerTypesApi());
    setCarModelsDataFromBase();
  }, []);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId })
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
    if (selector.enquiry_details_response) {

      let dmsContactOrAccountDto;
      if (selector.enquiry_details_response.hasOwnProperty("dmsAccountDto")) {
        dmsContactOrAccountDto = selector.enquiry_details_response.dmsAccountDto;
      }
      else if (selector.enquiry_details_response.hasOwnProperty("dmsContactDto")) {
        dmsContactOrAccountDto = selector.enquiry_details_response.dmsContactDto;
      }
      const dmsLeadDto = selector.enquiry_details_response.dmsLeadDto;
      if (dmsLeadDto.leadStatus === "ENQUIRYCOMPLETED") {
        setShowPreBookingBtn(true);
      }

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
      // Update Customer Need Analysys
      dispatch(updateCustomerNeedAnalysisData(dmsLeadDto.dmsLeadScoreCards));
      // Update Additional ore Replacement Buyer Data
      dispatch(updateAdditionalOrReplacementBuyerData(dmsLeadDto.dmsExchagedetails));
    }
  }, [selector.enquiry_details_response])

  useEffect(() => {
    if (selector.model_drop_down_data_update_statu === "update") {
      updateVariantModelsData(selector.model, true, selector.varient);
    }
  }, [selector.model_drop_down_data_update_statu]);

  const getEnquiryDetailsFromServer = () => {
    if (universalId) {
      dispatch(getEnquiryDetailsApi(universalId));
    }
  }

  const updateAccordian = (selectedIndex) => {
    Keyboard.dismiss();
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
    }
  };

  useEffect(() => {
    if (selector.enquiry_drop_response_status === "success") {
      showToastSucess("Sucessfully Enquiry Dropped.")
      navigation.goBack();
    }
  }, [selector.enquiry_drop_response_status]);

  const submitClicked = () => {

    if (!selector.enquiry_details_response) {
      return
    }

    let dmsContactOrAccountDto = {};
    let dmsLeadDto = {};
    let formData;

    const dmsEntity = selector.enquiry_details_response;
    if (dmsEntity.hasOwnProperty('dmsContactDto'))
      dmsContactOrAccountDto = mapContactOrAccountDto(dmsEntity.dmsContactDto);
    else if (dmsEntity.hasOwnProperty('dmsAccountDto'))
      dmsContactOrAccountDto = mapContactOrAccountDto(dmsEntity.dmsAccountDto);

    if (dmsEntity.hasOwnProperty('dmsLeadDto'))
      dmsLeadDto = mapLeadDto(dmsEntity.dmsLeadDto);

    if (selector.enquiry_details_response.hasOwnProperty('dmsContactDto')) {
      formData = {
        "dmsContactDto": dmsContactOrAccountDto,
        "dmsLeadDto": dmsLeadDto
      }
    } else {
      formData = {
        "dmsAccountDto": dmsContactOrAccountDto,
        "dmsLeadDto": dmsLeadDto
      }
    }
    dispatch(updateEnquiryDetailsApi(formData));
  }

  const mapContactOrAccountDto = (prevData) => {

    let dataObj = { ...prevData };
    dataObj.dateOfBirth = selector.dateOfBirth;
    dataObj.email = selector.email;
    dataObj.firstName = selector.firstName;
    dataObj.lastName = selector.lastName;
    dataObj.phone = selector.mobile;
    dataObj.secondaryPhone = selector.alterMobile;
    dataObj.gender = selector.gender;
    dataObj.relation = selector.relation;
    dataObj.salutation = selector.salutaion;
    dataObj.relationName = selector.relationName;
    dataObj.age = selector.age;

    dataObj.occupation = selector.occupation;
    dataObj.designation = selector.designation;
    dataObj.customerType = selector.customer_type;
    dataObj.anniversaryDate = selector.anniversaryDate;
    dataObj.annualRevenue = selector.approx_annual_income;
    dataObj.company = selector.company_name;
    dataObj.companyName = selector.company_name;
    dataObj.kmsTravelledInMonth = selector.kms_travelled_month;
    dataObj.membersInFamily = selector.members;
    dataObj.primeExpectationFromCar = selector.prime_expectation_from_car;
    dataObj.whoDrives = selector.who_drives;
    return dataObj;
  }

  const mapLeadDto = (prevData) => {

    let dataObj = { ...prevData };
    dataObj.buyerType = selector.buyer_type;
    dataObj.enquiryCategory = selector.enquiry_category;
    dataObj.enquirySegment = selector.enquiry_segment;
    dataObj.enquirySource = selector.source_of_enquiry;
    dataObj.subSource = selector.sub_source_of_enquiry;
    dataObj.dmsExpectedDeliveryDate = convertDateStringToMilliseconds(selector.expected_delivery_date);
    dataObj.model = selector.model;
    // dataObj.leadStatus = 'ENQUIRYCOMPLETED';

    dataObj.dmsAddresses = mapDMSAddress(dataObj.dmsAddresses);
    dataObj.dmsLeadProducts = mapLeadProducts(dataObj.dmsLeadProducts);
    dataObj.dmsfinancedetails = mapDmsFinanceDetails(dataObj.dmsfinancedetails);
    dataObj.dmsLeadScoreCards = mapDmsLeadScoreCards(dataObj.dmsLeadScoreCards);
    dataObj.dmsExchagedetails = mapExchangeDetails(dataObj.dmsExchagedetails);

    // dataObj.dmsAttachments = mapDMSAttachments();
    return dataObj;
  }

  const mapDMSAddress = (prevDmsAddresses) => {

    let dmsAddresses = [...prevDmsAddresses];
    if (dmsAddresses.length == 2) {
      dmsAddresses.forEach((address, index) => {
        let dataObj = { ...address };
        if (address.addressType === 'Communication') {

          dataObj.pincode = selector.pincode;
          dataObj.houseNo = selector.houseNum;
          dataObj.street = selector.streetName;
          dataObj.village = selector.village;
          dataObj.city = selector.city;
          dataObj.district = selector.district;
          dataObj.state = selector.state;
          dataObj.urban = selector.urban_or_rural === 1 ? true : false;
          dataObj.rural = selector.urban_or_rural === 2 ? true : false;

        } else if (address.addressType === 'Permanent') {

          dataObj.pincode = selector.p_pincode;
          dataObj.houseNo = selector.p_houseNum;
          dataObj.street = selector.p_streetName;
          dataObj.village = selector.p_village;
          dataObj.city = selector.p_city;
          dataObj.district = selector.p_district;
          dataObj.state = selector.p_state;
          dataObj.urban = selector.p_urban_or_rural === 1 ? true : false;
          dataObj.rural = selector.p_urban_or_rural === 2 ? true : false;
        }
        dmsAddresses[index] = dataObj;
      });
    }
    return dmsAddresses;
  }

  const mapLeadProducts = (prevDmsLeadProducts) => {

    let dmsLeadProducts = [...prevDmsLeadProducts];
    if (dmsLeadProducts.length > 0) {
      const dataObj = { ...dmsLeadProducts[0] };
      dataObj.id = selector.lead_product_id;
      dataObj.model = selector.model;
      dataObj.variant = selector.varient;
      dataObj.color = selector.color;
      dataObj.fuel = selector.fuel_type;
      dataObj.transimmisionType = selector.transmission_type;
      dmsLeadProducts[0] = dataObj;
    }
    return dmsLeadProducts;
  }

  const mapDmsFinanceDetails = (prevDmsFinancedetails) => {

    let dmsfinancedetails = [...prevDmsFinancedetails];
    if (dmsfinancedetails.length > 0) {
      const dataObj = { ...dmsfinancedetails[0] };
      dataObj.financeType = selector.retail_finance;
      dataObj.financeCategory = selector.finance_category;
      dataObj.downPayment = selector.down_payment;
      dataObj.loanAmount = selector.loan_amount ? Number(selector.loan_amount) : null;
      dataObj.rateOfInterest = selector.rate_of_interest;
      dataObj.expectedTenureYears = selector.loan_of_tenure;
      dataObj.emi = selector.emi;
      dataObj.annualIncome = selector.approx_annual_income;
      dataObj.location = selector.location;
      if (selector.retail_finance === "In House") {
        dataObj.financeCompany = selector.bank_or_finance;
      } else if (selector.retail_finance === "Out House") {
        dataObj.financeCompany = selector.bank_or_finance_name;
      } else if (selector.retail_finance === "Leashing") {
        dataObj.financeCompany = selector.leashing_name;
      }
      dmsfinancedetails[0] = dataObj;
    }
    return dmsfinancedetails;
  }

  const mapDmsLeadScoreCards = (prevDmsLeadScoreCards) => {
    let dmsLeadScoreCards = [...prevDmsLeadScoreCards];
    if (dmsLeadScoreCards.length > 0) {
      const dataObj = { ...dmsLeadScoreCards[0] };
      dataObj.lookingForAnyOtherBrand = selector.c_looking_for_any_other_brand_checked;
      dataObj.brand = selector.c_make;
      dataObj.model = selector.c_model;
      dataObj.otherMake = selector.c_make_other_name;
      dataObj.otherModel = selector.c_model_other_name;
      dataObj.variant = selector.c_variant;
      dataObj.color = selector.c_color;
      dataObj.fuel = selector.c_fuel_type;
      dataObj.priceRange = selector.c_price_range;
      dataObj.onRoadPriceanyDifference = selector.c_on_road_price;
      dataObj.dealershipName = selector.c_dealership_name;
      dataObj.dealershipLocation = selector.c_dealership_location;
      dataObj.decisionPendingReason = selector.c_dealership_pending_reason;
      dataObj.voiceofCustomerRemarks = selector.c_voice_of_customer_remarks;
      dmsLeadScoreCards[0] = dataObj;
    }
    return dmsLeadScoreCards;
  }

  const mapExchangeDetails = (prevDmsExchagedetails) => {
    let dmsExchagedetails = [...prevDmsExchagedetails];
    if (dmsExchagedetails.length > 0) {
      const dataObj = { ...dmsExchagedetails[0] };
      if (selector.buyer_type === "Additional Buyer") {
        dataObj.buyerType = selector.buyer_type;
        dataObj.brand = selector.a_make;
        dataObj.model = selector.a_model;
        dataObj.varient = selector.a_varient;
        dataObj.color = selector.a_color;
        dataObj.regNo = selector.a_reg_no;
      }
      else if (selector.buyer_type === "Replacement Buyer") {

        dataObj.buyerType = selector.buyer_type;
        dataObj.regNo = selector.r_reg_no;
        dataObj.brand = selector.r_make;
        dataObj.model = selector.r_model;
        dataObj.varient = selector.r_varient;
        dataObj.color = selector.r_color;
        dataObj.fuelType = selector.r_fuel_type;
        dataObj.transmission = selector.r_transmission_type;
        // Pending
        dataObj.yearofManufacture = selector.r_mfg_year;
        dataObj.kiloMeters = selector.r_kms_driven_or_odometer_reading;
        dataObj.expectedPrice = selector.r_expected_price ? Number(selector.r_expected_price) : null;
        dataObj.hypothicationRequirement = selector.r_hypothication_checked;
        dataObj.hypothication = selector.r_hypothication_name;
        dataObj.hypothicationBranch = selector.r_hypothication_branch;
        // Pending
        dataObj.registrationDate = selector.r_registration_date;
        dataObj.registrationValidityDate = selector.r_registration_validity_date;
        dataObj.insuranceAvailable = `${selector.r_insurence_checked}`;
        dataObj.insuranceDocumentAvailable = selector.r_insurence_document_checked;
        dataObj.insuranceCompanyName = selector.r_insurence_company_name;
        // Pending
        dataObj.insuranceExpiryDate = selector.r_insurence_expiry_date;
        dataObj.insuranceType = selector.r_insurence_type;
        // Pending
        dataObj.insuranceFromDate = selector.r_insurence_from_date;
        dataObj.insuranceToDate = selector.r_insurence_to_date;
      }
      dmsExchagedetails[0] = dataObj;
    }
    return dmsExchagedetails;
  }

  const proceedToPreBookingClicked = () => {

  }

  const proceedToCancelEnquiry = () => {

    let leadId = "";
    if (selector.enquiry_details_response) {
      leadId = selector.enquiry_details_response.dmsLeadDto.id;
    }

    if (!leadId) {
      showToast("lead id not found")
      return
    }

    const payload = {
      "dmsLeadDropInfo": {
        "additionalRemarks": selector.drop_remarks,
        "branchId": userData.branchId,
        "brandName": "",
        "dealerName": "",
        "leadId": leadId,
        "crmUniversalId": universalId,
        "lostReason": selector.drop_reason,
        "organizationId": userData.orgId,
        "otherReason": "",
        "droppedBy": userData.employeeId,
        "location": "",
        "model": "",
        "stage": "ENQUIRY",
        "status": "ENQUIRY"
      }
    }
    dispatch(dropEnquiryApi(payload));
  }

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();

    switch (key) {
      case "ENQUIRY_SEGMENT":
        setDataForDropDown([...Enquiry_Segment_Data]);
        break;
      case "CUSTOMER_TYPE":
        setDataForDropDown([...selector.customer_types_data]);
        break;
      case "SUB_SOURCE_OF_ENQUIRY":
        setDataForDropDown([...Enquiry_Sub_Source_Type_Data]);
        break;
      case "ENQUIRY_CATEGORY":
        setDataForDropDown([...Enquiry_Category_Type_Data]);
        break;
      case "BUYER_TYPE":
        setDataForDropDown([...Buyer_Type_Data]);
        break;
      case "KMS_TRAVELLED":
        setDataForDropDown([...Kms_Travelled_Type_Data]);
        break;
      case "WHO_DRIVES":
        setDataForDropDown([...Who_Drive_Type_Data]);
        break;
      case "MEMBERS":
        setDataForDropDown([...How_Many_Family_Members_Data]);
        break;
      case "PRIME_EXPECTATION_CAR":
        setDataForDropDown([...Prime_Exception_Types_Data]);
        break;
      case "SALUTATION":
        setDataForDropDown([...Salutation_Types]);
        break;
      case "GENDER":
        setDataForDropDown([...selector.gender_types_data]);
        break;
      case "RELATION":
        setDataForDropDown([...selector.relation_types_data]);
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
      case "C_MAKE":
        setDataForDropDown([...All_Car_Brands]);
        break;
      case "C_MODEL":
        setDataForDropDown([...c_model_types]);
        break;
      case "C_FUEL_TYPE":
        setDataForDropDown([...Fuel_Types]);
        break;
      case "C_TRANSMISSION_TYPE":
        setDataForDropDown([...Transmission_Types]);
        break;
      case "R_MAKE":
        setDataForDropDown([...All_Car_Brands]);
        break;
      case "R_MODEL":
        setDataForDropDown([...r_model_types]);
        break;
      case "R_FUEL_TYPE":
        setDataForDropDown([...Fuel_Types]);
        break;
      case "R_TRANSMISSION_TYPE":
        setDataForDropDown([...Transmission_Types]);
        break;
      case "R_INSURENCE_TYPE":
        setDataForDropDown([...Insurence_Types]);
        break;
      case "A_MAKE":
        setDataForDropDown([...All_Car_Brands]);
        break;
      case "A_MODEL":
        setDataForDropDown([...a_model_types]);
        break;
      case "DROP_REASON":
        setDataForDropDown([...Enquiry_Drop_Reasons]);
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

  updateModelTypesForCustomerNeedAnalysis = (brandName, dropDownKey) => {

    let modelsData = [];
    All_Car_Brands.forEach((item) => {
      if (item.name === brandName) {
        modelsData = item.models
      }
    })
    console.log("modelsData: ", modelsData)
    switch (dropDownKey) {
      case "C_MAKE":
        return set_c_model_types([...modelsData]);
      case "R_MAKE":
        return set_r_model_types([...modelsData]);
      case "A_MAKE":
        return set_a_model_types([...modelsData]);
    }
  }

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
            updateModelTypesForCustomerNeedAnalysis(item.name, dropDownKey);
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
              if (!selectedDate) {
                dispatch(updateSelectedDate({ key: "NONE", text: selectedDate }));
              } else {
                dispatch(updateSelectedDate({ key: "", text: selectedDate }));
              }
            } else {
              dispatch(updateSelectedDate({ key: "", text: selectedDate }));
            }
          }}
          onRequestClose={() => dispatch(setDatePicker())}
        />
      )}

      <View style={styles.view1}>
        <Text style={styles.titleText}>{"Details Overview"}</Text>
        <IconButton
          icon={selector.enableEdit ? "account-edit" : "account-edit-outline"}
          color={Colors.DARK_GRAY}
          size={30}
          style={{ paddingRight: 0 }}
          onPress={() => dispatch(setEditable())}
        />
      </View>

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
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            <List.AccordionGroup expandedId={openAccordian} onAccordionPress={(expandedId) => updateAccordian(expandedId)}>
              {/* 1.Customer Profile */}
              <List.Accordion
                id={"1"}
                title={"Customer Profile"}
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
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.occupation}
                  label={"Occupation*"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerProfile({ key: "OCCUPATION", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.designation}
                  label={"Designation*"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerProfile({ key: "DESIGNATION", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                <DropDownSelectionItem
                  label={"Enquiry Segment*"}
                  value={selector.enquiry_segment}
                  onPress={() => showDropDownModelMethod("ENQUIRY_SEGMENT", "Select Enquiry Segment")}
                />

                <DropDownSelectionItem
                  label={"Customer Type"}
                  value={selector.customer_type}
                  onPress={() => showDropDownModelMethod("CUSTOMER_TYPE", "Select Customer Type")}
                />

                {selector.customer_type.toLowerCase() === "fleet" ||
                  selector.customer_type.toLowerCase() === "institution" ||
                  selector.customer_type.toLowerCase() === "corporate" ||
                  selector.customer_type.toLowerCase() === "government" ||
                  selector.customer_type.toLowerCase() === "retired" ||
                  selector.customer_type.toLowerCase() === "other" ? (
                  <View>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.company_name}
                      label={"Company Name"}
                      keyboardType={"default"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerProfile({
                            key: "COMPANY_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                ) : null}

                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.source_of_enquiry}
                  label={"Source Of Enquiry"}
                  editable={false}
                />
                <Text style={GlobalStyle.underline}></Text>

                <DropDownSelectionItem
                  label={"Sub Source Of Enquiry"}
                  value={selector.sub_source_of_enquiry}
                  onPress={() => showDropDownModelMethod("SUB_SOURCE_OF_ENQUIRY", "Sub Source Of Enquiry")}
                />

                <DateSelectItem
                  label={"Expected Delivery Date"}
                  value={selector.expected_delivery_date}
                  onPress={() =>
                    dispatch(setDatePicker("EXPECTED_DELIVERY_DATE"))
                  }
                />

                <DropDownSelectionItem
                  label={"Enquiry Category"}
                  value={selector.enquiry_category}
                  onPress={() => showDropDownModelMethod("ENQUIRY_CATEGORY", "Enquiry Category")}
                />

                <DropDownSelectionItem
                  label={"Buyer Type"}
                  value={selector.buyer_type}
                  onPress={() => showDropDownModelMethod("BUYER_TYPE", "Buyer Type")}
                />

                <DropDownSelectionItem
                  label={"KMs Travelled in Month"}
                  value={selector.kms_travelled_month}
                  onPress={() => showDropDownModelMethod("KMS_TRAVELLED", "KMs Travelled in Month")}
                />

                <DropDownSelectionItem
                  label={"Who Drives"}
                  value={selector.who_drives}
                  onPress={() => showDropDownModelMethod("WHO_DRIVES", "Who Drives")}
                />

                <DropDownSelectionItem
                  label={"How many members in your family?"}
                  value={selector.members}
                  onPress={() => showDropDownModelMethod("MEMBERS", "How many members in your family?")}
                />

                <DropDownSelectionItem
                  label={"What is prime expectation from the car?"}
                  value={selector.prime_expectation_from_car}
                  onPress={() => showDropDownModelMethod("PRIME_EXPECTATION_CAR", "What is prime expectation from the car?")}
                />
              </List.Accordion>
              <View style={styles.space}></View>
              {/* 2. Personal Intro */}
              <List.Accordion
                id={"2"}
                title="Personal Intro"
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

                <DropDownSelectionItem
                  label={"Salutation*"}
                  value={selector.salutaion}
                  onPress={() => showDropDownModelMethod("SALUTATION", "Select Salutation")}
                />

                {selector.enquiry_segment.toLowerCase() == "personal" ? (
                  <DropDownSelectionItem
                    label={"Gender"}
                    value={selector.gender}
                    onPress={() => showDropDownModelMethod("GENDER", "Gender")}
                  />
                ) : null}

                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.firstName}
                  label={"First Name*"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setPersonalIntro({ key: "FIRST_NAME", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.lastName}
                  label={"Last Name*"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "LAST_NAME", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <DropDownSelectionItem
                  label={"Relation"}
                  value={selector.relation}
                  onPress={() => showDropDownModelMethod("RELATION", "Relation")}
                />

                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.relationName}
                  label={"Relation Name*"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setPersonalIntro({ key: "RELATION_NAME", text: text })
                    )
                  }
                />
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.mobile}
                  label={"Mobile Number*"}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "MOBILE", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.alterMobile}
                  label={"Alternate Mobile Number*"}
                  keyboardType={"phone-pad"}
                  maxLength={10}
                  onChangeText={(text) =>
                    dispatch(
                      setPersonalIntro({ key: "ALTER_MOBILE", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.email}
                  label={"Email ID*"}
                  keyboardType={"email-address"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "EMAIL", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                {selector.enquiry_segment.toLowerCase() == "personal" ? (
                  <View>
                    <DateSelectItem
                      label={"Date Of Birth"}
                      value={selector.dateOfBirth}
                      onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
                    />
                    <DateSelectItem
                      label={"Anniversary Date"}
                      value={selector.anniversaryDate}
                      onPress={() =>
                        dispatch(setDatePicker("ANNIVERSARY_DATE"))
                      }
                    />
                  </View>
                ) : null}
              </List.Accordion>
              <View style={styles.space}></View>
              {/* // 3.Communication Address */}
              <List.Accordion
                id={"3"}
                title={"Communication Address"}
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
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.pincode}
                  label={"Pincode*"}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "PINCODE", text: text })
                    )
                  }
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
                  value={selector.houseNum}
                  label={"H.No*"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "HOUSE_NO", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.streetName}
                  label={"Street Name*"}
                  keyboardType={"default"}
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
                  keyboardType={"default"}
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
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "CITY", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.district}
                  label={"District*"}
                  keyboardType={"default"}
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
                  keyboardType={"default"}
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
                    status={
                      selector.permanent_address ? "checked" : "unchecked"
                    }
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
                  keyboardType={"phone-pad"}
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
                  keyboardType={"default"}
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
                  keyboardType={"default"}
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
                  keyboardType={"default"}
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
                  keyboardType={"default"}
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
                  keyboardType={"default"}
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
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "P_STATE", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              <View style={styles.space}></View>
              {/* // 4.Modal Selection */}
              <List.Accordion
                id={"4"}
                title={"Modal Selection"}
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
                  label={"Model"}
                  value={selector.model}
                  onPress={() => showDropDownModelMethod("MODEL", "Select Model")}
                />

                <DropDownSelectionItem
                  label={"Varient"}
                  value={selector.varient}
                  onPress={() => showDropDownModelMethod("VARIENT", "Select Varient")}
                />

                <DropDownSelectionItem
                  label={"Color"}
                  value={selector.color}
                  onPress={() => showDropDownModelMethod("COLOR", "Select Color")}
                />

                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Fuel Type"}
                  editable={false}
                  value={selector.fuel_type}
                />
                <Text style={GlobalStyle.underline}></Text>

                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Transmission Type"}
                  editable={false}
                  value={selector.transmission_type}
                />
                <Text style={GlobalStyle.underline}></Text>

              </List.Accordion>
              <View style={styles.space}></View>
              {/* // 5.Financial Details*/}
              <List.Accordion
                id={"5"}
                title={"Financial Details"}
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
                  label={"Retail Finance"}
                  value={selector.retail_finance}
                  onPress={() => showDropDownModelMethod("RETAIL_FINANCE", "Retail Finance")}
                />

                {selector.retail_finance === "Out House" ? (
                  <View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Bank/Finance Name"}
                      keyboardType={"default"}
                      value={selector.bank_or_finance_name}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({
                            key: "BANK_R_FINANCE_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Location"}
                      keyboardType={"default"}
                      value={selector.location}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({ key: "LOCATION", text: text })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                ) : null}

                {selector.retail_finance === "Leashing" && (
                  <View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Leashing Name"}
                      keyboardType={"default"}
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
                      keyboardType={"default"}
                      value={selector.down_payment}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({
                            key: "DOWN_PAYMENT",
                            text: text,
                          })
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
                        keyboardType={"default"}
                        value={selector.loan_amount}
                        onChangeText={(text) =>
                          dispatch(
                            setFinancialDetails({
                              key: "LOAN_AMOUNT",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <TextinputComp
                        style={{ height: 65, width: "100%" }}
                        label={"Rate of Interest*"}
                        keyboardType={"default"}
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
                      keyboardType={"default"}
                      value={selector.loan_of_tenure}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({
                            key: "LOAN_OF_TENURE",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"EMI*"}
                      keyboardType={"default"}
                      value={selector.emi}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({ key: "EMI", text: text })
                        )
                      }
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
              {/* // 6.Upload Documents */}
              <List.Accordion
                id={"6"}
                title={"Upload Documents"}
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
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.pan_number}
                  label={"Pan Number*"}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(setUploadDocuments({ key: "PAN", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <View style={styles.select_image_bck_vw}>
                  <ImageSelectItem
                    name={"Upload Pan"}
                    onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))}
                  />
                </View>
                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.adhaar_number}
                  label={"Aadhaar Number*"}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) =>
                    dispatch(setUploadDocuments({ key: "ADHAR", text: text }))
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <View style={styles.select_image_bck_vw}>
                  <ImageSelectItem
                    name={"Upload Adhar"}
                    onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))}
                  />
                </View>
              </List.Accordion>
              <View style={styles.space}></View>
              {/* // 7.Customer Need Analysis */}
              <List.Accordion
                id={"7"}
                title={"Customer Need Analysis"}
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
                <View style={styles.view2}>
                  <Text style={styles.looking_any_text}>
                    {"Looking for any other brand"}
                  </Text>
                  <Checkbox.Android
                    status={
                      selector.c_looking_for_any_other_brand_checked
                        ? "checked"
                        : "unchecked"
                    }
                    uncheckedColor={Colors.DARK_GRAY}
                    color={Colors.RED}
                    onPress={() =>
                      dispatch(
                        setCustomerNeedAnalysis({ key: "CHECK_BOX", text: "" })
                      )
                    }
                  />
                </View>

                {selector.c_looking_for_any_other_brand_checked && (
                  <View>
                    <DropDownSelectionItem
                      label={"Make"}
                      value={selector.c_make}
                      onPress={() => showDropDownModelMethod("C_MAKE", "Make")}
                    />
                    {selector.c_make === "Other" && (<View>
                      <TextinputComp
                        style={{ height: 65, width: "100%" }}
                        label={"Make Other Name"}
                        editable={true}
                        value={selector.c_make_other_name}
                        onChangeText={(text) =>
                          dispatch(
                            setCustomerNeedAnalysis({
                              key: "C_MAKE_OTHER_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>)}
                    <DropDownSelectionItem
                      label={"Model"}
                      value={selector.c_model}
                      onPress={() => showDropDownModelMethod("C_MODEL", "Model")}
                    />
                    {selector.c_model === "Other" && (<View>
                      <TextinputComp
                        style={{ height: 65, width: "100%" }}
                        label={"Model Other Name"}
                        editable={true}
                        value={selector.c_model_other_name}
                        onChangeText={(text) =>
                          dispatch(
                            setCustomerNeedAnalysis({
                              key: "C_MODEL_OTHER_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>)}

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Variant"}
                      editable={true}
                      value={selector.c_variant}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "C_VARIANT",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Color"}
                      editable={true}
                      value={selector.c_color}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "C_COLOR",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <DropDownSelectionItem
                      label={"Fuel Type"}
                      value={selector.c_fuel_type}
                      onPress={() => showDropDownModelMethod("C_FUEL_TYPE", "Variant")}
                    />
                    <DropDownSelectionItem
                      label={"Transmission Type"}
                      value={selector.c_transmission_type}
                      onPress={() => showDropDownModelMethod("C_TRANSMISSION_TYPE", "Color")}
                    />

                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_price_range}
                      label={"Price Range"}
                      keyboardType={"number-pad"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "PRICE_RANGE",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_on_road_price}
                      label={"On Road Price"}
                      keyboardType={"number-pad"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "ON_ROAD_PRICE",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_dealership_name}
                      label={"DealerShip Name"}
                      keyboardType={"default"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "DEALERSHIP_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_dealership_location}
                      label={"DealerShip Location"}
                      keyboardType={"default"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "DEALERSHIP_LOCATION",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.c_dealership_pending_reason}
                      label={"Dealership Pending Reason"}
                      keyboardType={"default"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerNeedAnalysis({
                            key: "DEALERSHIP_PENDING_REASON",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                <TextinputComp
                  style={styles.textInputStyle}
                  value={selector.c_voice_of_customer_remarks}
                  label={"Voice of Customer Remarks "}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerNeedAnalysis({
                        key: "VOICE_OF_CUSTOMER_REMARKS",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              {selector.buyer_type == "Additional Buyer" ||
                selector.buyer_type == "Replacement Buyer" ? (
                <View style={styles.space}></View>
              ) : null}
              {/* // 8.Additional Buyer */}
              {selector.buyer_type == "Additional Buyer" ? (
                <List.Accordion
                  id={"8"}
                  title={"Additional Buyer"}
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
                  <DropDownSelectionItem
                    label={"Make"}
                    value={selector.a_make}
                    onPress={() => showDropDownModelMethod("A_MAKE", "Make")}
                  />
                  {selector.a_make === "Other" && (<View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Make Other Name"}
                      editable={true}
                      value={selector.a_make_other_name}
                      onChangeText={(text) =>
                        dispatch(
                          setAdditionalBuyerDetails({
                            key: "A_MAKE_OTHER_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>)}
                  <DropDownSelectionItem
                    label={"Model"}
                    value={selector.a_model}
                    onPress={() => showDropDownModelMethod("A_MODEL", "Model")}
                  />
                  {selector.a_model === "Other" && (<View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Model Other Name"}
                      editable={true}
                      value={selector.a_model_other_name}
                      onChangeText={(text) =>
                        dispatch(
                          setAdditionalBuyerDetails({
                            key: "A_MODEL_OTHER_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>)}

                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.a_varient}
                    label={"Varient"}
                    onChangeText={(text) =>
                      dispatch(
                        setAdditionalBuyerDetails({
                          key: "A_VARIENT",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.a_color}
                    label={"Color"}
                    onChangeText={(text) =>
                      dispatch(
                        setAdditionalBuyerDetails({
                          key: "A_COLOR",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.a_reg_no}
                    label={"Reg. No."}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setAdditionalBuyerDetails({
                          key: "A_REG_NO",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </List.Accordion>
              ) : null}

              {/* // 9.Replacement Buyer */}
              {selector.buyer_type == "Replacement Buyer" ? (
                <List.Accordion
                  id={"9"}
                  title={"Replacement Buyer"}
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
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.r_reg_no}
                    label={"Reg. No."}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_REG_NO",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <View style={styles.select_image_bck_vw}>
                    <ImageSelectItem
                      name={"Upload Reg Doc"}
                      onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))}
                    />
                  </View>
                  <DropDownSelectionItem
                    label={"Make"}
                    value={selector.r_make}
                    onPress={() => showDropDownModelMethod("R_MAKE", "Make")}
                  />
                  {selector.r_make === "Other" && (<View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Make Other Name"}
                      editable={true}
                      value={selector.r_make_other_name}
                      onChangeText={(text) =>
                        dispatch(
                          setReplacementBuyerDetails({
                            key: "R_MAKE_OTHER_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>)}
                  <DropDownSelectionItem
                    label={"Model"}
                    value={selector.r_model}
                    onPress={() => showDropDownModelMethod("R_MODEL", "Model")}
                  />
                  {selector.r_model === "Other" && (<View>
                    <TextinputComp
                      style={{ height: 65, width: "100%" }}
                      label={"Model Other Name"}
                      editable={true}
                      value={selector.r_model_other_name}
                      onChangeText={(text) =>
                        dispatch(
                          setReplacementBuyerDetails({
                            key: "R_MODEL_OTHER_NAME",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>)}

                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"Varient"}
                    editable={true}
                    value={selector.r_varient}
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_VARIENT",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>

                  <TextinputComp
                    style={{ height: 65, width: "100%" }}
                    label={"Color"}
                    editable={true}
                    value={selector.r_color}
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_COLOR",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>

                  <DropDownSelectionItem
                    label={"Fuel Type"}
                    value={selector.r_fuel_type}
                    onPress={() => showDropDownModelMethod("R_FUEL_TYPE", "Fuel Type")}
                  />
                  <DropDownSelectionItem
                    label={"Transmission Type"}
                    value={selector.r_transmission_type}
                    onPress={() => showDropDownModelMethod("R_TRANSMISSION_TYPE", "Transmission Type")}
                  />

                  <DateSelectItem
                    label={"Mth.Yr. of MFG"}
                    value={selector.r_mfg_year}
                    onPress={() => dispatch(setDatePicker("R_MFG_YEAR"))}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.r_kms_driven_or_odometer_reading}
                    label={"Kms-Driven/Odometer Reading"}
                    keyboardType={"number-pad"}
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_KMS_DRIVEN_OR_ODOMETER_READING",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>

                  <View style={styles.view2}>
                    <Text style={styles.looking_any_text}>
                      {"Hopothication"}
                    </Text>
                    <Checkbox.Android
                      status={
                        selector.r_hypothication_checked
                          ? "checked"
                          : "unchecked"
                      }
                      uncheckedColor={Colors.DARK_GRAY}
                      color={Colors.RED}
                      onPress={() =>
                        dispatch(
                          setReplacementBuyerDetails({
                            key: "R_HYPOTHICATION_CHECKED",
                            text: "",
                          })
                        )
                      }
                    />
                  </View>

                  {selector.r_hypothication_checked && (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.r_hypothication_name}
                        label={"Hypothication Name"}
                        keyboardType={"default"}
                        onChangeText={(text) =>
                          dispatch(
                            setReplacementBuyerDetails({
                              key: "R_HYPOTHICATION_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.r_hypothication_branch}
                        label={"Hypothication Branch"}
                        keyboardType={"default"}
                        onChangeText={(text) =>
                          dispatch(
                            setReplacementBuyerDetails({
                              key: "R_HYPOTHICATION_BRANCH",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}

                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.r_expected_price}
                    label={"Expected Price"}
                    keyboardType={"number-pad"}
                    onChangeText={(text) =>
                      dispatch(
                        setReplacementBuyerDetails({
                          key: "R_EXP_PRICE",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                  <DateSelectItem
                    label={"Registration Date"}
                    value={selector.r_registration_date}
                    onPress={() => dispatch(setDatePicker("R_REG_DATE"))}
                  />
                  <DateSelectItem
                    label={"Registration Validity Date"}
                    value={selector.r_registration_validity_date}
                    onPress={() =>
                      dispatch(setDatePicker("R_REG_VALIDITY_DATE"))
                    }
                  />
                  <View style={styles.view2}>
                    <Text style={styles.looking_any_text}>{"Insurence"}</Text>
                    <Checkbox.Android
                      status={
                        selector.r_insurence_checked ? "checked" : "unchecked"
                      }
                      uncheckedColor={Colors.DARK_GRAY}
                      color={Colors.RED}
                      onPress={() =>
                        dispatch(
                          setReplacementBuyerDetails({
                            key: "R_INSURENCE_CHECKED",
                            text: "",
                          })
                        )
                      }
                    />
                  </View>
                  {selector.r_insurence_checked && (
                    <View>
                      <View style={styles.view2}>
                        <Text style={styles.looking_any_text}>
                          {"Insurence Document"}
                        </Text>
                        <Checkbox.Android
                          status={
                            selector.r_insurence_document_checked
                              ? "checked"
                              : "unchecked"
                          }
                          uncheckedColor={Colors.DARK_GRAY}
                          color={Colors.RED}
                          onPress={() =>
                            dispatch(
                              setReplacementBuyerDetails({
                                key: "R_INSURENCE_DOC_CHECKED",
                                text: "",
                              })
                            )
                          }
                        />
                      </View>
                    </View>
                  )}
                  {selector.r_insurence_document_checked && (
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Upload Insurence"}
                        onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))}
                      />
                    </View>
                  )}
                  {!selector.r_insurence_checked && (
                    <View>
                      <DateSelectItem
                        label={"Insurence Policy Expiry Date"}
                        value={selector.r_insurence_expiry_date}
                        onPress={() =>
                          dispatch(
                            setDatePicker("R_INSURENCE_POLICIY_EXPIRY_DATE")
                          )
                        }
                      />
                    </View>
                  )}
                  {selector.r_insurence_checked &&
                    !selector.r_insurence_document_checked && (
                      <View>
                        <DropDownSelectionItem
                          label={"Insurence Type"}
                          value={selector.r_insurence_type}
                          onPress={() => showDropDownModelMethod("R_INSURENCE_TYPE", "Fuel Type")}
                        />
                        <DateSelectItem
                          label={"Insurence From Date"}
                          value={selector.r_insurence_from_date}
                          onPress={() =>
                            dispatch(setDatePicker("R_INSURENCE_FROM_DATE"))
                          }
                        />
                        <DateSelectItem
                          label={"Insurence To Date"}
                          value={selector.r_insurence_to_date}
                          onPress={() =>
                            dispatch(setDatePicker("R_INSURENCE_TO_DATE"))
                          }
                        />
                      </View>
                    )}

                  {!selector.r_insurence_document_checked && (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.r_insurence_company_name}
                        label={"Insurence Company Name"}
                        keyboardType={"default"}
                        onChangeText={(text) =>
                          dispatch(
                            setReplacementBuyerDetails({
                              key: "R_INSURENCE_CMPNY_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}
                </List.Accordion>
              ) : null}

              {isDropSelected ? (<View style={styles.space}></View>) : null}
              {isDropSelected ? (
                <List.Accordion
                  id={"9"}
                  title={"Enquiry Drop Section"}
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
                        setEnquiryDropDetails({
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
          </View>
          {!isDropSelected && (
            <View style={styles.actionBtnView}>
              <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.RED}
                labelStyle={{ textTransform: "none" }}
                onPress={() => setIsDropSelected(true)}
              >
                Drop
              </Button>
              <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.BLACK}
                labelStyle={{ textTransform: "none" }}
                onPress={submitClicked}
              >
                Submit
              </Button>
            </View>
          )}
          {showPreBookingBtn && !isDropSelected && (<View style={styles.prebookingBtnView}>
            <Button
              mode="contained"
              color={Colors.BLACK}
              labelStyle={{ textTransform: "none" }}
              onPress={proceedToPreBookingClicked}
            >
              Proceed To PreBooking
            </Button>
          </View>)}
          {isDropSelected && (<View style={styles.prebookingBtnView}>
            <Button
              mode="contained"
              color={Colors.RED}
              labelStyle={{ textTransform: "none" }}
              onPress={proceedToCancelEnquiry}
            >
              Proceed To Cancellation
            </Button>
          </View>)}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DetailsOverviewScreen;

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
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  space: {
    height: 10,
  },
  drop_down_view_style: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: Colors.WHITE,
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
    // marginVertical: 5,
    // borderRadius: 10,
    backgroundColor: Colors.WHITE,
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
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
  select_image_bck_vw: {
    minHeight: 50,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  actionBtnView: {
    marginTop: 30,
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

// left={(props) => (
//   <VectorImage height={25} width={25} source={PERSONAL_DETAILS} />
// )}

{
  /* <View style={[styles.accordianBckVw, GlobalStyle.shadow, { backgroundColor: "white" }]}>
 
</View> */
}
