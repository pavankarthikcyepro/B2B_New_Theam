import React, { useState, useEffect, useLayoutEffect } from "react";
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
  Pressable,
  BackHandler
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
} from "../../../components";
import {
  clearState,
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
  getPaidAccessoriesListApi,
  dropPreBooingApi,
  updatePrebookingDetailsApi,
  getOnRoadPriceDtoListApi,
  sendOnRoadPriceDetails,
  setPreBookingPaymentDetials,
  getDropDataApi,
  getDropSubReasonDataApi,
  preBookingPaymentApi,
  postBookingAmountApi,
  getPaymentDetailsApi,
  getBookingAmountDetailsApi,
  getAssignedTasksApi
} from "../../../redux/preBookingFormReducer";
import {
  RadioTextItem,
  CustomerAccordianHeaderItem,
  ImageSelectItem,
  DateSelectItem,
  DropDownSelectionItem
} from "../../../pureComponents";
import { ImagePickerComponent, SelectOtherVehicleComponant } from "../../../components";
import { Checkbox, List, Button, IconButton } from "react-native-paper";
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
  Drop_reasons,
  Customer_Category_Types
} from "../../../jsonData/prebookingFormScreenJsonData";
import { AppNavigator } from "../../../navigations";
import { getPreBookingData } from "../../../redux/preBookingReducer";
import { showToast, showToastRedAlert, showToastSucess } from "../../../utils/toast";
import { convertDateStringToMillisecondsUsingMoment } from "../../../utils/helperFunctions";
import URL from "../../../networking/endpoints";

const rupeeSymbol = "\u20B9";

const CheckboxTextAndAmountComp = ({
  title,
  amount,
  titleStyle = {},
  amoutStyle = {},
  isChecked = false,
  onPress
}) => {
  return (
    <View style={[styles.textAndAmountView, { paddingLeft: 2 }]} >
      <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
        <Checkbox.Android
          style={{ padding: 0, margin: 0 }}
          status={isChecked ? 'checked' : 'unchecked'}
          color={Colors.BLUE}
          uncheckedColor={Colors.GRAY}
          onPress={onPress}
        />
        <Text
          style={[
            { fontSize: 14, fontWeight: "400", maxWidth: "70%", color: Colors.GRAY },
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
  const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "", isManager: false, editEnable: false, isPreBookingApprover: false })
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
  const [typeOfActionDispatched, setTypeOfActionDispatched] = useState("");
  const [selectedPaidAccessories, setSelectedPaidAccessories] = useState([]);
  const [selectedInsurenceAddons, setSelectedInsurenceAddons] = useState([]);
  const [showApproveRejectBtn, setShowApproveRejectBtn] = useState(false);
  const [showPrebookingPaymentSection, setShowPrebookingPaymentSection] = useState(false);
  const [showSubmitDropBtn, setShowSubmitDropBtn] = useState(false);
  const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
  const [isRejectSelected, setIsRejectSelected] = useState(false);
  const [userToken, setUserToken] = useState("");

  const [handlingChargSlctd, setHandlingChargSlctd] = useState(false);
  const [essentialKitSlctd, setEssentialKitSlctd] = useState(false);
  const [fastTagSlctd, setFastTagSlctd] = useState(false);

  useLayoutEffect(() => {

    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          color={Colors.WHITE}
          size={30}
          onPress={goParentScreen}
        />
      ),
    });
  }, [navigation]);

  const goParentScreen = () => {
    navigation.goBack();
    dispatch(clearState());
  }

  useEffect(() => {

    setComponentAppear(true);
    getAsyncstoreData();
    getAuthToken();
    dispatch(getCustomerTypesApi());
    setCarModelsDataFromBase();
    getPreBookingDetailsFromServer();
    getBanksListFromServer();

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, [navigation]);

  const handleBackButtonClick = () => {
    goParentScreen();
    return true;
  }

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
      let isManager = false, editEnable = false;
      let isPreBookingApprover = false;
      if (jsonObj.hrmsRole === "MD" || jsonObj.hrmsRole === "General Manager" || jsonObj.hrmsRole === "Manager") {
        isManager = true;
      }
      if (jsonObj.roles.includes('PreBooking Approver')) {
        editEnable = true;
        isPreBookingApprover = true;
      }
      setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName, isManager: isManager, editEnable: editEnable, isPreBookingApprover: isPreBookingApprover })
      dispatch(getPaidAccessoriesListApi(jsonObj.orgId));

      const payload = {
        "bu": jsonObj.orgId,
        "dropdownType": "PreBookDropReas",
        "parentId": 0
      }
      dispatch(getDropDataApi(payload));
    }
  }

  const getAuthToken = () => {

    AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
      setUserToken(token);
    });
  }

  const getPreBookingDetailsFromServer = () => {
    if (universalId) {
      dispatch(getPrebookingDetailsApi(universalId));
    }
  }

  const getBanksListFromServer = async () => {

    await fetch(URL.GET_BANK_DETAILS(), {
      method: "GET",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'auth-token': userToken
      }
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
      })
      .catch((error) => { })

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

  // Handle Pre-Booking Details Response
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
      dispatch(getOnRoadPriceDtoListApi(dmsLeadDto.id))
      if (dmsLeadDto.leadStatus === 'ENQUIRYCOMPLETED') {
        setShowSubmitDropBtn(true);
      }
      if (dmsLeadDto.leadStatus === 'SENTFORAPPROVAL') {
        setShowApproveRejectBtn(true);
      }
      if (dmsLeadDto.leadStatus === 'PREBOOKINGCOMPLETED') {
        setShowPrebookingPaymentSection(true);
        // Get Payment Details
        dispatch(getPaymentDetailsApi(dmsLeadDto.id));
        dispatch(getBookingAmountDetailsApi(dmsLeadDto.id));
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
      // // Update Booking Payment Data
      dispatch(updateBookingPaymentData(dmsLeadDto.dmsBooking));
      // Update Attachment details
      saveAttachmentDetailsInLocalObject(dmsLeadDto.dmsAttachments);

      // Update Paid Accesories
      if (dmsLeadDto.dmsAccessories.length > 0) {
        let initialValue = 0
        const totalPrice = dmsLeadDto.dmsAccessories.reduce((preValue, currentValue) => preValue + currentValue.amount, initialValue);
        setSelectedPaidAccessoriesPrice(totalPrice);
      }
      setSelectedPaidAccessories([...dmsLeadDto.dmsAccessories])
    }
  }, [selector.pre_booking_details_response])

  const saveAttachmentDetailsInLocalObject = (dmsAttachments) => {
    const attachments = [...dmsAttachments];
    if (attachments.length > 0) {
      const dataObj = {};
      attachments.forEach((item, index) => {
        const obj = {
          documentPath: item.documentPath,
          documentType: item.documentType,
          fileName: item.fileName,
          keyName: item.keyName
        }
        dataObj[item.documentType] = obj;
      })
      setUploadedImagesDataObj({ ...dataObj })
    }
  }

  useEffect(() => {
    if (selector.model_drop_down_data_update_status === "update") {
      updateVariantModelsData(selector.model, true, selector.varient);
    }
  }, [selector.model_drop_down_data_update_status]);

  const getPreBookingListFromServer = async () => {
    if (userData.employeeId) {
      let endUrl = "?limit=10&offset=" + "0" + "&status=PREBOOKING&empId=" + empId;
      dispatch(getPreBookingData(endUrl));
    }
  }

  useEffect(() => {
    if (selector.on_road_price_dto_list_response.length > 0) {
      const dmsOnRoadPriceDtoObj = selector.on_road_price_dto_list_response[0];
      // setSelectedInsurencePrice(dmsOnRoadPriceDtoObj.)
      setSelectedWarrentyPrice(dmsOnRoadPriceDtoObj.warrantyAmount);
      if (dmsOnRoadPriceDtoObj.insuranceAddonData && dmsOnRoadPriceDtoObj.insuranceAddonData.length > 0) {
        let addOnPrice = 0;
        dmsOnRoadPriceDtoObj.insuranceAddonData.forEach((element, index) => {
          addOnPrice += element.insuranceAmount;
        });
        setSelectedAddOnsPrice(addOnPrice);
      }
    }
  }, [selector.on_road_price_dto_list_response])

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
        setDataForDropDown([...selector.drop_reasons_list]);
        break;
      case "DROP_SUB_REASON":
        setDataForDropDown([...selector.drop_sub_reasons_list]);
        break;
      case "CUSTOMER_TYPE_CATEGORY":
        setDataForDropDown([...Customer_Category_Types]);
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
        dispatch(getOnRoadPriceAndInsurenceDetailsApi({ orgId: userData.orgId, varientId: varientId }))
        setCarColorsData([...newArray]);
      }
    }
  }

  const calculateOnRoadPrice = (handleSelected, essentialSelected, fastTagSelected) => {

    let totalPrice = 0;
    totalPrice += priceInfomationData.ex_showroom_price;
    totalPrice += getLifeTax();
    totalPrice += priceInfomationData.registration_charges;
    totalPrice += selectedInsurencePrice;
    totalPrice += selectedAddOnsPrice;
    totalPrice += selectedWarrentyPrice;
    if (handleSelected) {
      totalPrice += priceInfomationData.handling_charges;
    }
    if (essentialSelected) {
      totalPrice += priceInfomationData.essential_kit;
    }
    totalPrice += getTcsAmount();
    totalPrice += selectedPaidAccessoriesPrice;
    if (fastTagSelected) {
      totalPrice += priceInfomationData.fast_tag;
    }
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

  const submitClicked = () => {

    Keyboard.dismiss();

    if (selector.booking_amount.length === 0 || selector.payment_at.length === 0 || selector.booking_payment_mode.length === 0) {
      showToast("Please enter booking details");
      return
    }

    if (selector.customer_preferred_date.length === 0 || selector.tentative_delivery_date.length === 0) {
      showToast("Please enter commitment details");
      return
    }

    if (!selector.pre_booking_details_response.dmsLeadDto) {
      return
    }

    let postOnRoadPriceTable = {};
    postOnRoadPriceTable.additionalOffer1 = selector.additional_offer_1;
    postOnRoadPriceTable.additionalOffer2 = selector.additional_offer_2;
    postOnRoadPriceTable.cashDiscount = selector.cash_discount;
    postOnRoadPriceTable.corporateCheck = "";
    postOnRoadPriceTable.corporateName = "";
    postOnRoadPriceTable.corporateOffer = selector.corporate_offer;
    postOnRoadPriceTable.essentialKit = priceInfomationData.essential_kit;
    postOnRoadPriceTable.exShowroomPrice = priceInfomationData.ex_showroom_price;
    postOnRoadPriceTable.offerData = [];
    postOnRoadPriceTable.focAccessories = selector.for_accessories;
    postOnRoadPriceTable.handlingCharges = priceInfomationData.handling_charges;
    postOnRoadPriceTable.id = postOnRoadPriceTable.id ? postOnRoadPriceTable.id : 0;
    postOnRoadPriceTable.insuranceAddonData = selectedInsurenceAddons;
    postOnRoadPriceTable.insuranceAmount = selectedInsurencePrice;
    postOnRoadPriceTable.insuranceType = selector.insurance_type;
    postOnRoadPriceTable.lead_id = selector.pre_booking_details_response.dmsLeadDto.id;
    postOnRoadPriceTable.lifeTax = getLifeTax();
    postOnRoadPriceTable.onRoadPrice = totalOnRoadPrice;
    postOnRoadPriceTable.finalPrice = totalOnRoadPriceAfterDiscount;
    postOnRoadPriceTable.promotionalOffers = selector.promotional_offer;
    postOnRoadPriceTable.registrationCharges = priceInfomationData.registration_charges;
    postOnRoadPriceTable.specialScheme = selector.consumer_offer;
    postOnRoadPriceTable.exchangeOffers = selector.exchange_offer;
    postOnRoadPriceTable.tcs = getTcsAmount();
    postOnRoadPriceTable.warrantyAmount = selectedWarrentyPrice;
    postOnRoadPriceTable.warrantyName = selector.warranty;

    dispatch(sendOnRoadPriceDetails(postOnRoadPriceTable));
  }

  // Handle On Road Price Response
  useEffect(() => {

    if (selector.send_onRoad_price_details_response) {

      if (!selector.pre_booking_details_response) {
        return
      }

      let dmsContactOrAccountDto = {};
      let dmsLeadDto = {};
      let formData;

      const dmsEntity = selector.pre_booking_details_response;
      if (dmsEntity.hasOwnProperty('dmsContactDto'))
        dmsContactOrAccountDto = mapContactOrAccountDto(dmsEntity.dmsContactDto);
      else if (dmsEntity.hasOwnProperty('dmsAccountDto'))
        dmsContactOrAccountDto = mapContactOrAccountDto(dmsEntity.dmsAccountDto);

      if (dmsEntity.hasOwnProperty('dmsLeadDto'))
        dmsLeadDto = mapLeadDto(dmsEntity.dmsLeadDto);

      if (selector.pre_booking_details_response.hasOwnProperty('dmsContactDto')) {
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

      console.log("Data: ", JSON.stringify(formData));

      setTypeOfActionDispatched("UPDATE_PRE_BOOKING")
      dispatch(updatePrebookingDetailsApi(formData));
    }
  }, [selector.send_onRoad_price_details_response])

  const approveOrRejectMethod = (type) => {

    if (!selector.pre_booking_details_response) {
      return
    }

    let dmsEntity = { ...selector.pre_booking_details_response };
    let dmsLeadDto = { ...dmsEntity.dmsLeadDto };
    if (type === "APPROVE") {
      dmsLeadDto.leadStatus = 'PREBOOKINGCOMPLETED';
    }
    else if (type === "REJECT") {

      if (selector.reject_remarks.length == 0) {
        showToast("Please enter reject remarks");
        return;
      }

      dmsLeadDto.leadStatus = 'REJECTED';
      dmsLeadDto.remarks = selector.reject_remarks;
    }
    dmsEntity.dmsLeadDto = dmsLeadDto;
    setTypeOfActionDispatched("UPDATE_PRE_BOOKING")
    dispatch(updatePrebookingDetailsApi(dmsEntity));
  }

  // Handle Update Pre-Booking Details Response
  useEffect(() => {
    if (selector.update_pre_booking_details_response === "success") {
      if (typeOfActionDispatched === "DROP_ENQUIRY") {
        showToastSucess("Successfully Pre-Booking Dropped");
        getPreBookingListFromServer();
      } else if (typeOfActionDispatched === "UPDATE_PRE_BOOKING") {
        showToastSucess("Successfully Pre-Booking Updated");
      }
      dispatch(clearState());
      navigation.goBack();
    }
  }, [selector.update_pre_booking_details_response]);

  const mapContactOrAccountDto = (prevData) => {

    let dataObj = { ...prevData };
    dataObj.salutation = selector.salutation;
    dataObj.firstName = selector.first_name;
    dataObj.lastName = selector.last_name;
    dataObj.phone = selector.mobile;
    dataObj.email = selector.email;
    dataObj.gender = selector.gender;
    dataObj.dateOfBirth = convertDateStringToMillisecondsUsingMoment(selector.date_of_birth);
    dataObj.age = selector.age ? Number(selector.age) : 0;
    dataObj.customerType = selector.customer_type;
    return dataObj;
  }

  const mapLeadDto = (prevData) => {

    let dataObj = { ...prevData };
    dataObj.enquirySegment = selector.enquiry_segment;
    dataObj.maritalStatus = selector.marital_status;
    dataObj.occasion = selector.occasion;

    dataObj.commitmentDeliveryPreferredDate = convertDateStringToMillisecondsUsingMoment(selector.customer_preferred_date);
    dataObj.commitmentDeliveryTentativeDate = convertDateStringToMillisecondsUsingMoment(selector.tentative_delivery_date);
    dataObj.otherVehicleRcNo = selector.vehicle_type;
    dataObj.otherVehicleType = selector.registration_number;
    dataObj.gstNumber = selector.gstin_number;
    dataObj.customerCategoryType = selector.customer_type_category;
    dataObj.documentType = selector.form_or_pan;

    dataObj.leadStatus = 'SENTFORAPPROVAL';
    dataObj.leadStage = "PREBOOKING";
    dataObj.dmsAddresses = mapDMSAddress(dataObj.dmsAddresses);
    dataObj.dmsLeadProducts = mapLeadProducts(dataObj.dmsLeadProducts);
    dataObj.dmsfinancedetails = mapDmsFinanceDetails(dataObj.dmsfinancedetails);
    dataObj.dmsBooking = mapDmsBookingDetails(dataObj.dmsBooking, dataObj.id);
    dataObj.dmsAttachments = mapDmsAttachments(dataObj.dmsAttachments);
    dataObj.dmsAccessories = selectedPaidAccessories;
    return dataObj;
  }

  const mapDMSAddress = (prevDmsAddresses) => {

    let dmsAddresses = [...prevDmsAddresses];
    if (dmsAddresses.length == 2) {
      dmsAddresses.forEach((address, index) => {
        let dataObj = { ...address };
        if (address.addressType === 'Communication') {

          dataObj.pincode = selector.pincode;
          dataObj.houseNo = selector.house_number;
          dataObj.street = selector.street_name;
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
    let dataObj = {};
    if (dmsLeadProducts.length > 0) {
      dataObj = { ...dmsLeadProducts[0] };
    }
    dataObj.model = selector.model;
    dataObj.variant = selector.varient;
    dataObj.color = selector.color;
    dataObj.fuel = selector.fuel_type;
    dataObj.transimmisionType = selector.transmission_type;
    dmsLeadProducts[0] = dataObj;
    return dmsLeadProducts;
  }

  const mapDmsFinanceDetails = (prevDmsFinancedetails) => {

    let dmsfinancedetails = [...prevDmsFinancedetails];
    let dataObj = {};
    if (dmsfinancedetails.length > 0) {
      dataObj = { ...dmsfinancedetails[0] };
    }
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
    return dmsfinancedetails;
  }

  const mapDmsBookingDetails = (preDmsBooking, leadId) => {
    let dmsBooking = { ...preDmsBooking };
    dmsBooking.id = dmsBooking.id ? dmsBooking.id : 0;
    dmsBooking.leadId = leadId;
    dmsBooking.bookingAmount = Number(selector.booking_amount)
    let trimStr = selector.payment_at.replace(/\s+/g, '');
    dmsBooking.paymentAt = trimStr;
    let trimStr2 = selector.booking_payment_mode.replace(/\s+/g, '');
    dmsBooking.modeOfPayment = trimStr2;
    dmsBooking.otherVehicle = selector.vechicle_registration;
    dmsBooking.deliveryLocation = selector.delivery_location;
    console.log("dmsBooking: ", dmsBooking);
    return dmsBooking;
  }

  const mapDmsAttachments = (prevDmsAttachments) => {

    let dmsAttachments = [...prevDmsAttachments];
    if (dmsAttachments.length > 0) {
      dmsAttachments.forEach((obj, index) => {
        const item = uploadedImagesDataObj[obj.documentType];
        console.log("uploadedImagesDataObj2: ", uploadedImagesDataObj);
        const object = formatAttachment({ ...obj }, item, index, obj.documentType);
        dmsAttachments[index] = object;
      })
    } else {
      console.log("uploadedImagesDataObj1: ", uploadedImagesDataObj);
      Object.keys(uploadedImagesDataObj).forEach((key, index) => {
        const item = uploadedImagesDataObj[key];
        const object = formatAttachment({}, item, index, item.documentType);
        dmsAttachments.push(object);
      })
    }
    return dmsAttachments;
  }

  const formatAttachment = (data, photoObj, index, typeOfDocument) => {
    let object = { ...data };
    object.branchId = userData.branchId;
    object.ownerName = userData.employeeName;
    object.orgId = userData.orgId;
    object.documentType = photoObj.documentType;
    object.documentPath = photoObj.documentPath;
    object.keyName = photoObj.keyName;
    object.fileName = photoObj.fileName;
    object.createdBy = new Date().getTime();
    object.id = `${index}`;
    object.modifiedBy = userData.employeeName;
    object.ownerId = userData.employeeId;
    switch (typeOfDocument) {
      case "pan":
        object.documentNumber = selector.pan_number;
        break;
      case "aadhar":
        object.documentNumber = selector.adhaar_number;
        break;
      case "REGDOC":
        object.documentNumber = selector.r_reg_no;
        break;
    }
    return object
  }

  const proceedToCancelPreBooking = () => {

    if (selector.drop_remarks.length === 0 || selector.drop_reason.length === 0) {
      showToastRedAlert("Please enter details for drop")
      return
    }

    if (!selector.pre_booking_details_response) {
      return
    }

    let enquiryDetailsObj = { ...selector.pre_booking_details_response };
    let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
    dmsLeadDto.leadStage = "DROPPED";
    enquiryDetailsObj.dmsLeadDto = dmsLeadDto;

    let leadId = selector.pre_booking_details_response.dmsLeadDto.id;
    if (!leadId) {
      showToast("lead id not found")
      return
    }

    const payload = {
      "dmsLeadDropInfo": {
        "additionalRemarks": selector.drop_remarks,
        "branchId": userData.branchId,
        "brandName": selector.d_brand_name,
        "dealerName": selector.d_dealer_name,
        "leadId": leadId,
        "crmUniversalId": universalId,
        "lostReason": selector.drop_reason,
        "lostSubReason": selector.drop_sub_reason,
        "organizationId": userData.orgId,
        "otherReason": "",
        "droppedBy": userData.employeeId,
        "location": selector.d_location,
        "model": selector.d_model,
        "stage": "PREBOOKING",
        "status": "PREBOOKING"
      }
    }
    setTypeOfActionDispatched("DROP_ENQUIRY");
    dispatch(dropPreBooingApi(payload));
    dispatch(updatePrebookingDetailsApi(enquiryDetailsObj));
  }

  const proceedToBookingClicked = () => {

    let leadId = selector.pre_booking_details_response.dmsLeadDto.id;
    if (!leadId) {
      showToast("lead id not found")
      return
    }

    let bookingId = selector.pre_booking_details_response.dmsLeadDto.dmsBooking.id;
    if (!bookingId) {
      showToast("lead id not found")
      return
    }

    const paymentMode = selector.booking_payment_mode.replace(/\s/g, "");
    let paymentDate = ""
    if (paymentMode === "InternetBanking") {
      paymentDate = convertDateStringToMillisecondsUsingMoment(selector.transaction_date);
    }
    else if (paymentMode === "Cheque") {
      paymentDate = convertDateStringToMillisecondsUsingMoment(selector.cheque_date);
    }
    else if (paymentMode === "DD") {
      paymentDate = convertDateStringToMillisecondsUsingMoment(selector.dd_date);
    }

    let payload = {};
    if (selector.existing_payment_details_response) {
      payload = { ...selector.existing_payment_details_response };
    }

    payload.bankName = selector.comapany_bank_name;
    payload.bookingId = bookingId;
    payload.chequeNo = selector.cheque_number;
    payload.date = paymentDate;
    payload.ddNo = selector.dd_number;
    payload.id = payload.id ? payload.id : 0;
    payload.leadId = leadId;
    payload.paymentMode = paymentMode;
    payload.transferFromMobile = selector.transfer_from_mobile;
    payload.transferToMobile = selector.transfer_to_mobile;
    payload.typeUpi = selector.type_of_upi;
    payload.utrNo = selector.utr_no;
    dispatch(preBookingPaymentApi(payload))
  }

  // 1. payment, lead, booking

  // Handle Payment Response
  useEffect(() => {
    if (selector.pre_booking_payment_response_status === "success") {
      sendBookingAmount();
    } else if (selector.pre_booking_payment_response_status === "failed") {
      showToastRedAlert("Something went wrong");
    }
  }, [selector.pre_booking_payment_response_status])

  const sendBookingAmount = () => {

    let leadId = selector.pre_booking_details_response.dmsLeadDto.id;
    if (!leadId) {
      showToast("lead id not found")
      return
    }

    let bookingAmount = selector.pre_booking_details_response.dmsLeadDto.dmsBooking.bookingAmount;
    if (!bookingAmount) {
      showToast("lead id not found")
      return
    }

    let payload = {};
    if (selector.existing_booking_amount_response && selector.existing_booking_amount_response.length > 0) {
      payload = { ...selector.existing_booking_amount_response[0] };
    }
    payload.id = payload.id ? payload.id : 0
    payload.paymentName = "Booking Advance Amount";
    payload.amount = bookingAmount;
    payload.leadId = leadId;

    const finalPayload = [payload]
    dispatch(postBookingAmountApi(finalPayload))
  }

  // Handle Booking Amount Response
  useEffect(() => {
    if (selector.booking_amount_response_status === "success") {
      // Get Assigned tasks
      dispatch(getAssignedTasksApi(universalId));
    } else if (selector.booking_amount_response_status === "failed") {
      showToastRedAlert("Something went wrong");
    }
  }, [selector.booking_amount_response_status]);

  // Handle Assigned Tasks Response
  useEffect(() => {
    if (selector.assigned_tasks_list_status === "success" && selector.assigned_tasks_list) {
      if (selector.assigned_tasks_list.length > 0) {
        const filteredAry = selector.assigned_tasks_list.filter(item => item.taskName === "Proceed to Booking");
        if (filteredAry.length == 0) { return }
        const taskData = filteredAry[0];
        const taskId = taskData.taskId;
        const taskStatus = taskData.taskStatus;
        navigation.navigate(AppNavigator.MyTasksStackIdentifiers.proceedToPreBooking, { identifier: "PROCEED_TO_BOOKING", taskId, universalId, taskStatus, taskData: taskData });
        dispatch(clearState());
      }
    } else if (selector.assigned_tasks_list_status === "failed") {
      showToastRedAlert("Something went wrong");
    }
  }, [selector.assigned_tasks_list_status]);

  const updatePaidAccessroies = (tableData) => {

    let totalPrice = 0;
    let newFormatSelectedAccessories = [];
    tableData.forEach((item) => {
      if (item.selected) {
        totalPrice += item.cost;
        newFormatSelectedAccessories.push({
          "amount": item.cost,
          "accessoriesName": item.partNo,
          "leadId": selector.pre_booking_details_response.dmsLeadDto.id,
          "allotmentStatus": null
        })
      }
    })
    setSelectedPaidAccessoriesPrice(totalPrice);
    setSelectedPaidAccessories([...newFormatSelectedAccessories]);
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

  const uploadSelectedImage = async (selectedPhoto, keyId) => {

    const photoUri = selectedPhoto.uri;
    if (!photoUri) {
      return;
    }

    const formData = new FormData();
    const fileType = photoUri.substring(photoUri.lastIndexOf(".") + 1);
    const fileNameArry = photoUri.substring(photoUri.lastIndexOf('/') + 1).split('.');
    const fileName = fileNameArry.length > 0 ? fileNameArry[0] : "None";
    formData.append('file', {
      name: `${fileName}-.${fileType}`,
      type: `image/${fileType}`,
      uri: Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri
    });
    formData.append("universalId", universalId);

    switch (keyId) {
      case "UPLOAD_PAN":
        formData.append("documentType", "pan");
        break;
      case "UPLOAD_ADHAR":
        formData.append("documentType", "aadhar");
        break;
      case "UPLOAD_FORM60":
        formData.append("documentType", "form60");
        break;
      case "UPLOAD_RELATION_PROOF":
        formData.append("documentType", "relationshipProof");
        break;
      case "RECEIPT_DOC":
        formData.append("documentType", "receipt");
        break;
      default:
        formData.append("documentType", "default");
        break;
    }

    await fetch(URL.UPLOAD_DOCUMENT(), {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then((response) => {
        //console.log('response', response);
        if (response) {
          const dataObj = { ...uploadedImagesDataObj };
          dataObj[response.documentType] = response;
          setUploadedImagesDataObj({ ...dataObj });
        }
      })
      .catch((error) => {
        showToastRedAlert(error.message ? error.message : "Something went wrong");
        console.error('error', error);
      });
  }

  const DisplaySelectedImage = ({ fileName }) => {
    return (
      <View style={styles.selectedImageBckVw}>
        <Text style={styles.selectedImageTextStyle}>{fileName}</Text>
      </View>
    )
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
        onDismiss={() => dispatch(setImagePicker(""))}
        selectedImage={(data, keyId) => {
          console.log("imageObj: ", data, keyId);
          uploadSelectedImage(data, keyId);
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
          else if (dropDownKey === "DROP_REASON") {
            const payload = {
              "bu": userData.orgId,
              "dropdownType": "PreBook_Lost_Com_Sub_Reas",
              "parentId": item.id
            }
            dispatch(getDropSubReasonDataApi(payload))
          }
          else if (dropDownKey === "INSURENCE_ADD_ONS") {
            let totalCost = 0;
            let names = "";
            let insurenceAddOns = [];
            if (item.length > 0) {
              item.forEach((obj, index) => {
                totalCost += Number(obj.cost);
                names += obj.name + ((index + 1) < item.length ? ", " : "");
                insurenceAddOns.push({ insuranceAmount: obj.cost, insuranceAddonName: obj.name })
              })
            }
            setSelectedAddOnsPrice(totalCost);
            setSelectedInsurenceAddons([...insurenceAddOns]);
            dispatch(setDropDownData({ key: dropDownKey, value: names, id: "" }));
            return
          }
          dispatch(setDropDownData({ key: dropDownKey, value: item.name, id: item.id }));
        }}
      />

      <DatePickerComponent
        visible={selector.showDatepicker}
        mode={"date"}
        value={new Date(Date.now())}
        minimumDate={selector.minDate}
        maximumDate={selector.maxDate}
        onChange={(event, selectedDate) => {
          console.log("date: ", selectedDate);
          if (Platform.OS === "android") {
            if (!selectedDate) {
              dispatch(updateSelectedDate({ key: "NONE", text: selectedDate }));
            } else {
              dispatch(updateSelectedDate({ key: "", text: selectedDate }));
            }
          }
          else {
            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
          }
        }}
        onRequestClose={() => dispatch(setDatePicker())}
      />

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
                    maxLength={3}
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

                {selector.form_or_pan === "PAN" && (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"PAN"}
                        onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))}
                      />
                    </View>
                    {uploadedImagesDataObj.pan ? <DisplaySelectedImage fileName={uploadedImagesDataObj.pan.fileName} /> : null}
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {selector.form_or_pan === "Form60" && (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Form60"}
                        onPress={() => dispatch(setImagePicker("UPLOAD_FORM60"))}
                      />
                    </View>
                    {uploadedImagesDataObj.form60 ? <DisplaySelectedImage fileName={uploadedImagesDataObj.form60.fileName} /> : null}
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

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
                  {uploadedImagesDataObj.aadhar ? <DisplaySelectedImage fileName={uploadedImagesDataObj.aadhar.fileName} /> : null}
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
                    onPress={() => dispatch(setImagePicker("UPLOAD_RELATION_PROOF"))}
                  />
                </View>
                {uploadedImagesDataObj.relationshipProof ? <DisplaySelectedImage fileName={uploadedImagesDataObj.relationshipProof.fileName} /> : null}
                <Text style={GlobalStyle.underline}></Text>

                {selector.customer_type === "Individual" && (
                  <View>
                    <DropDownSelectionItem
                      label={"Customer Type Category"}
                      value={selector.customer_type_category}
                      onPress={() => showDropDownModelMethod("CUSTOMER_TYPE_CATEGORY", "Customer Type Category")}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {(selector.enquiry_segment === "Company" && selector.customer_type === "Institution") || (selector.customer_type_category == "B2B" || selector.customer_type_category == "B2C") ? (
                  <View>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.gstin_number}
                      label={"GSTIN Number"}
                      onChangeText={(text) =>
                        dispatch(
                          setDocumentUploadDetails({
                            key: "GSTIN_NUMBER",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                ) : null}

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
                  color: openAccordian === "6" ? Colors.WHITE : Colors.BLUE,
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

                <CheckboxTextAndAmountComp
                  title={"Handling Charges:"}
                  amount={handlingChargSlctd ? priceInfomationData.handling_charges.toFixed(2) : "0.00"}
                  isChecked={handlingChargSlctd}
                  onPress={() => {
                    setHandlingChargSlctd(!handlingChargSlctd);
                    calculateOnRoadPrice(!handlingChargSlctd, essentialKitSlctd, fastTagSlctd);
                  }}
                />
                <Text style={GlobalStyle.underline}></Text>

                <CheckboxTextAndAmountComp
                  title={"Essential Kit:"}
                  amount={essentialKitSlctd ? priceInfomationData.essential_kit.toFixed(2) : "0.00"}
                  isChecked={essentialKitSlctd}
                  onPress={() => {
                    setEssentialKitSlctd(!essentialKitSlctd);
                    calculateOnRoadPrice(handlingChargSlctd, !essentialKitSlctd, fastTagSlctd);
                  }}
                />
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

                <CheckboxTextAndAmountComp
                  title={"Fast Tag:"}
                  amount={fastTagSlctd ? priceInfomationData.fast_tag.toFixed(2) : "0.00"}
                  isChecked={fastTagSlctd}
                  onPress={() => {
                    setFastTagSlctd(!fastTagSlctd)
                    calculateOnRoadPrice(handlingChargSlctd, essentialKitSlctd, !fastTagSlctd);
                  }}
                />
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
                  color: openAccordian === "7" ? Colors.WHITE : Colors.BLUE,
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
                  keyboardType='number-pad'
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
                  keyboardType='number-pad'
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
                  keyboardType='number-pad'
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
                  keyboardType='number-pad'
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
                  keyboardType='number-pad'
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
                  keyboardType='number-pad'
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
                  keyboardType='number-pad'
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
                  keyboardType='number-pad'
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
                  maxLength={9}
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
              {/* // 10.Drop */}
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
                  <DropDownSelectionItem
                    label={"Drop Sub Reason"}
                    value={selector.drop_sub_reason}
                    onPress={() => showDropDownModelMethod("DROP_SUB_REASON", "Drop Sub Reason")}
                  />
                  {(selector.drop_reason === "Lost to Competitor" || selector.drop_reason === "Lost to Used Cars from Co-Dealer") ? (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.d_brand_name}
                        label={"Brand Name"}
                        onChangeText={(text) =>
                          dispatch(
                            setBookingDropDetails({
                              key: "DROP_BRAND_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  ) : null}

                  {(selector.drop_reason === "Lost to Competitor" || selector.drop_reason === "Lost to Used Cars from Co-Dealer" || selector.drop_reason === "Lost to Co-Dealer") ? (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.d_dealer_name}
                        label={"Dealer Name"}
                        onChangeText={(text) =>
                          dispatch(
                            setBookingDropDetails({
                              key: "DROP_DEALER_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.d_location}
                        label={"Location"}
                        onChangeText={(text) =>
                          dispatch(
                            setBookingDropDetails({
                              key: "DROP_LOCATION",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  ) : null}

                  {(selector.drop_reason === "Lost to Competitor" || selector.drop_reason === "Lost to Used Cars from Co-Dealer") ? (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.d_model}
                        label={"Model"}
                        onChangeText={(text) => dispatch(setBookingDropDetails({ key: "DROP_MODEL", text: text }))}
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  ) : null}

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
              {/* // 11.Reject */}
              {isRejectSelected ? (<View style={styles.space}></View>) : null}
              {isRejectSelected && (
                <List.Accordion
                  id={"11"}
                  title={"Manager Reject Remarks"}
                  titleStyle={{
                    color: openAccordian === "11" ? Colors.WHITE : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={{
                    backgroundColor:
                      openAccordian === "11" ? Colors.RED : Colors.WHITE,
                  }}
                >
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.reject_remarks}
                    label={"Remarks"}
                    onChangeText={(text) =>
                      dispatch(
                        setBookingDropDetails({
                          key: "REJECT_REMARKS",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </List.Accordion>
              )}
              {/* // 12.Payment Details */}
              {showPrebookingPaymentSection ? (<View style={styles.space}></View>) : null}
              {showPrebookingPaymentSection ? (
                <List.Accordion
                  id={"12"}
                  title={"PreBooking Payment Details"}
                  titleStyle={{
                    color: openAccordian === "12" ? Colors.WHITE : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={{
                    backgroundColor: openAccordian === "12" ? Colors.RED : Colors.WHITE,
                  }}
                >
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Receipt Doc"}
                        onPress={() => dispatch(setImagePicker("RECEIPT_DOC"))}
                      />
                    </View>
                    {uploadedImagesDataObj.receipt ? <DisplaySelectedImage fileName={uploadedImagesDataObj.receipt.fileName} /> : null}
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                  {selector.booking_payment_mode === "UPI" && (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.type_of_upi}
                        label={"Type of UPI"}
                        onChangeText={(text) =>
                          dispatch(
                            setPreBookingPaymentDetials({
                              key: "TYPE_OF_UPI",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.transfer_from_mobile}
                        label={"Transfer From Mobile"}
                        keyboardType={'number-pad'}
                        onChangeText={(text) =>
                          dispatch(
                            setPreBookingPaymentDetials({
                              key: "TRANSFER_FROM_MOBILE",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.transfer_to_mobile}
                        label={"Transfer To Mobile"}
                        keyboardType={'number-pad'}
                        onChangeText={(text) =>
                          dispatch(
                            setPreBookingPaymentDetials({
                              key: "TRANSFER_TO_MOBILE",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}

                  {(selector.booking_payment_mode === "InternetBanking" || selector.booking_payment_mode === "Internet Banking") && (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.utr_no}
                        label={"UTR No"}
                        onChangeText={(text) =>
                          dispatch(setPreBookingPaymentDetials({ key: "UTR_NO", text: text }))
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <DateSelectItem
                        label={"Transaction Date"}
                        value={selector.transaction_date}
                        onPress={() => dispatch(setDatePicker("TRANSACTION_DATE"))}
                      />
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.comapany_bank_name}
                        label={"Company Bank Name"}
                        onChangeText={(text) =>
                          dispatch(setPreBookingPaymentDetials({ key: "COMPANY_BANK_NAME", text: text }))
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  )}

                  {selector.booking_payment_mode === "Cheque" && (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.cheque_number}
                        label={"Cheque Number"}
                        onChangeText={(text) =>
                          dispatch(
                            setPreBookingPaymentDetials({
                              key: "CHEQUE_NUMBER",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <DateSelectItem
                        label={"Cheque Date"}
                        value={selector.cheque_date}
                        onPress={() =>
                          dispatch(setDatePicker("CHEQUE_DATE"))
                        }
                      />
                    </View>
                  )}

                  {selector.booking_payment_mode === "DD" && (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.dd_number}
                        label={"DD Number"}
                        onChangeText={(text) =>
                          dispatch(
                            setPreBookingPaymentDetials({
                              key: "DD_NUMBER",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <DateSelectItem
                        label={"DD Date"}
                        value={selector.dd_date}
                        onPress={() =>
                          dispatch(setDatePicker("DD_DATE"))
                        }
                      />
                    </View>
                  )}

                </List.Accordion>
              ) : null}

            </List.AccordionGroup>

            {!isDropSelected && showSubmitDropBtn && !userData.isManager && (
              <View style={styles.actionBtnView}>
                <Button
                  mode="contained"
                  style={{ width: 120 }}
                  color={Colors.BLACK}
                  disabled={selector.isLoading}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => setIsDropSelected(true)}
                >
                  Drop
                </Button>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  disabled={selector.isLoading}
                  labelStyle={{ textTransform: "none" }}
                  onPress={submitClicked}
                >
                  SUBMIT
                </Button>
              </View>
            )}

            {showApproveRejectBtn && userData.isPreBookingApprover && !isDropSelected && (
              <View style={styles.actionBtnView}>
                <Button
                  mode="contained"
                  style={{ width: 120 }}
                  color={Colors.GREEN}
                  disabled={selector.isLoading}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => approveOrRejectMethod("APPROVE")}
                >
                  Approve
                </Button>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  disabled={selector.isLoading}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => isRejectSelected ? approveOrRejectMethod("REJECT") : setIsRejectSelected(true)}
                >
                  {isRejectSelected ? "Send" : "Reject"}
                </Button>
              </View>
            )}

            {showPrebookingPaymentSection && !userData.isManager && !isDropSelected && (
              <View style={styles.actionBtnView}>
                <Button
                  mode="contained"
                  style={{ width: 120 }}
                  color={Colors.BLACK}
                  disabled={selector.isLoading}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => setIsDropSelected(true)}
                >
                  Drop
                </Button>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  disabled={uploadedImagesDataObj.receipt ? (selector.isLoading == true ? true : false) : true}
                  labelStyle={{ textTransform: "none" }}
                  onPress={proceedToBookingClicked}
                >
                  Proceed To Booking
                </Button>
              </View>
            )}

            {isDropSelected && (<View style={styles.prebookingBtnView}>
              <Button
                mode="contained"
                color={Colors.RED}
                disabled={selector.isLoading}
                labelStyle={{ textTransform: "none" }}
                onPress={proceedToCancelPreBooking}
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
  selectedImageBckVw: {
    paddingLeft: 12,
    paddingRight: 15,
    paddingBottom: 5,
    backgroundColor: Colors.WHITE
  },
  selectedImageTextStyle: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.DARK_GRAY
  }
});
