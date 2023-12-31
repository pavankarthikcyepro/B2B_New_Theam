import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  BackHandler,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
} from "../../../components";
import { PreBookingModelListitemCom } from "./components/PreBookingModelListItem";
import { LoaderComponent } from "../../../components";

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
  updateDmsAttachments,
  updateOfferPriceData,
  getOnRoadPriceAndInsurenceDetailsApi,
  dropPreBooingApi,
  updatePrebookingDetailsApi,
  getOnRoadPriceDtoListApi,
  sendOnRoadPriceDetails,
  sendEditedOnRoadPriceDetails,
  setPreBookingPaymentDetials,
  getDropDataApi,
  getDropSubReasonDataApi,
  preBookingPaymentApi,
  postBookingAmountApi,
  getPaymentDetailsApi,
  getBookingAmountDetailsApi,
  getAssignedTasksApi,
  updateAddressByPincode,
  updateRef,
  updateResponseStatus,
  clearPermanentAddr,
  updateAddressByPincode2,
  getRulesConfiguration,
  getOtherPricesDropDown,
  getEnquiryTypesApi,
  postEvalutionApi,
  postFinanaceApi,
  getOrgTags,
  getOrgTagsById,
  postOrgTags,
} from "../../../redux/preBookingFormReducer";
import {
  clearBookingState,
  getEnquiryDetailsApi,
  updateEnquiryDetailsApi,
  getTaskDetailsApi,
  updateTaskApi,
  changeEnquiryStatusApi,
} from "../../../redux/proceedToBookingReducer";
import {
  RadioTextItem,
  CustomerAccordianHeaderItem,
  ImageSelectItem,
  DateSelectItem,
  DropDownSelectionItem,
} from "../../../pureComponents";
import {
  ImagePickerComponent,
  SelectOtherVehicleComponant,
} from "../../../components";
import { Checkbox, List, Button, IconButton } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import { Dropdown } from "react-native-element-dropdown";
import {
  Salutation_Types,
  Enquiry_Segment_Data,
  Marital_Status_Types,
  Finance_Types,
  Finance_Category_Types,
  Approx_Auual_Income_Types,
  Buyer_Type_Data,
  Gender_Types,
} from "../../../jsonData/enquiryFormScreenJsonData";
import {
  Payment_At_Types,
  Booking_Payment_Types,
  Vehicle_Types,
  Drop_reasons,
  Customer_Category_Types,
} from "../../../jsonData/prebookingFormScreenJsonData";
import { AppNavigator } from "../../../navigations";
import { getPreBookingData } from "../../../redux/preBookingReducer";
import {
  showToast,
  showToastRedAlert,
  showToastSucess,
} from "../../../utils/toast";
import {
  convertDateStringToMillisecondsUsingMoment,
  isValidateAlphabetics,
  isValidate,
  isMobileNumber,
  emiCalculator,
  GetCarModelList,
  PincodeDetails,
  GetFinanceBanksList,
  GetPaidAccessoriesList,
  GetDropList,
  isEmail,
  PincodeDetailsNew,
  isCheckPanOrAadhaar,
  convertDateStringToMilliseconds,
} from "../../../utils/helperFunctions";
import URL from "../../../networking/endpoints";
import uuid from "react-native-uuid";
import { DropComponent } from "./components/dropComp";
import * as AsyncStorage from "../../../asyncStore";
import moment from "moment";
import {
  CustomerTypesObj,
  CustomerTypesObj21,
  CustomerTypesObj22,
  EnquiryTypes21,
  EnquiryTypes22,
} from "../../../jsonData/preEnquiryScreenJsonData";
import { EmsTopTabNavigatorIdentifiers } from "../../../navigations/emsTopTabNavigator";
import Geolocation from "@react-native-community/geolocation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { client } from "../../../networking/client";
import AnimLoaderComp from "../../../components/AnimLoaderComp";
const rupeeSymbol = "\u20B9";

const dmsAttachmentsObj = {
  branchId: null,
  contentSize: 0,
  createdBy: convertDateStringToMilliseconds(new Date()),
  description: null,
  documentNumber: "",
  documentPath: "",
  documentType: "",
  documentVersion: 0,
  fileName: "",
  gstNumber: null,
  id: 0,
  isActive: null,
  isPrivate: null,
  keyName: "",
  modifiedBy: "",
  orgId: null,
  ownerId: null,
  ownerName: "",
  parentId: null,
  tinNumber: null,
};

const orgTagDateFormate = "YYYY-MM-DD hh:mm:ss";

const CheckboxTextAndAmountComp = ({
  title,
  amount,
  titleStyle = {},
  amoutStyle = {},
  isChecked = false,
  onPress,
  disabled,
}) => {
  return (
    <View style={[styles.textAndAmountView, { paddingLeft: 2 }]}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Checkbox.Android
          disabled={disabled}
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

let isProceedToBookingClicked = false;
let isChangedModelPrimary = true;

const PrebookingFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.preBookingFormReducer);
  const selectorBooking = useSelector((state) => state.proceedToBookingReducer);

  let scrollRef = useRef(null);
  const { universalId, accessoriesList, leadStatus, leadStage, enqDetails } =
    route.params;
  const [openAccordian, setOpenAccordian] = useState(0);
  const [componentAppear, setComponentAppear] = useState(false);
  const [otherPrices, setOtherPrices] = useState(0);
  const [userData, setUserData] = useState({
    orgId: "",
    employeeId: "",
    employeeName: "",
    isManager: false,
    editEnable: false,
    isPreBookingApprover: false,
    isSelfManager: "",
    isTracker: "",
    branchId: 0,
    approverId: "",
    orgName: ""
  });
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [showMultipleDropDownData, setShowMultipleDropDownData] =
    useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [carModelsData, setCarModelsData] = useState([]);
  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({
    varientList: [],
    varientListForDropDown: [],
  });
  const [carModelsList, setCarModelsList] = useState([]);
  const [updateModelList, setUpdateModelList] = useState(false);
  const [isPrimaryCureentIndex, setIsPrimaryCurrentIndex] = useState(0);

  const [carColorsData, setCarColorsData] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState(0);
  const [selectedVarientId, setSelectedVarientId] = useState(0);
  const [insurenceVarientTypes, setInsurenceVarientTypes] = useState([]);
  const [insurenceAddOnTypes, setInsurenceAddOnTypes] = useState([]);
  const [warrentyTypes, setWarrentyTypes] = useState([]);
  const [selectedInsurencePrice, setSelectedInsurencePrice] = useState(0);
  const [selectedAddOnsPrice, setSelectedAddOnsPrice] = useState(0);
  const [selectedWarrentyPrice, setSelectedWarrentyPrice] = useState(0);
  const [selectedPaidAccessoriesPrice, setSelectedPaidAccessoriesPrice] =
    useState(0);
  const [selectedFOCAccessoriesPrice, setSelectedFOCAccessoriesPrice] =
    useState(0);
  const [totalOnRoadPrice, setTotalOnRoadPrice] = useState(0);
  const [totalOnRoadPriceAfterDiscount, setTotalOnRoadPriceAfterDiscount] =
    useState(0);
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
  const [isDropSelected, setIsDropSelected] = useState(false);
  const [typeOfActionDispatched, setTypeOfActionDispatched] = useState("");
  const [selectedPaidAccessoriesList, setSelectedPaidAccessoriesList] =
    useState([]);
  const [paidAccessoriesListNew, setPaidAccessoriesListNew] = useState([]);
  const [selectedFOCAccessoriesList, setSelectedFOCAccessoriesList] = useState(
    []
  );
  const [selectedInsurenceAddons, setSelectedInsurenceAddons] = useState([]);
  const [showApproveRejectBtn, setShowApproveRejectBtn] = useState(false);
  const [showPrebookingPaymentSection, setShowPrebookingPaymentSection] =
    useState(false);
  const [showSubmitDropBtn, setShowSubmitDropBtn] = useState(false);
  const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
  const [isRejectSelected, setIsRejectSelected] = useState(false);
  const [userToken, setUserToken] = useState("");

  const [handlingChargSlctd, setHandlingChargSlctd] = useState(false);
  const [essentialKitSlctd, setEssentialKitSlctd] = useState(false);
  const [fastTagSlctd, setFastTagSlctd] = useState(false);
  const [financeBanksList, setFinanceBanksList] = useState([]);
  const [lifeTaxAmount, setLifeTaxAmount] = useState(0);
  const [tcsAmount, setTcsAmount] = useState(0);
  const [paidAccessoriesList, setPaidAccessoriesList] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  // drop section
  const [dropData, setDropData] = useState([]);
  const [dropReason, setDropReason] = useState("");
  const [dropSubReason, setDropSubReason] = useState("");
  const [dropBrandName, setDropBrandName] = useState("");
  const [dropDealerName, setDropDealerName] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [dropModel, setDropModel] = useState("");
  const [dropPriceDifference, setDropPriceDifference] = useState("");
  const [dropRemarks, setDropRemarks] = useState("");
  const [focPrice, setFocPrice] = useState(0);
  const [mrpPrice, setMrpPrice] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [taxPercent, setTaxPercent] = useState("");
  const [insuranceDiscount, setInsuranceDiscount] = useState("");
  const [accDiscount, setAccDiscount] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [initialTotalAmt, setInitialTotalAmt] = useState(0);
  const [addressData, setAddressData] = useState([]);
  const [addressData2, setAddressData2] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isReciptDocUpload, setIsReciptDocUpload] = useState(false);
  const [isSubmitPress, setIsSubmitPress] = useState(false);

  const [isEditButtonShow, setIsEditButtonShow] = useState(false);
  const [isAddModelButtonShow, setIsAddModelButtonShow] = useState(false);
  const [isSubmitCancelButtonShow, setIsSubmitCancelButtonShow] =
    useState(false);

  const [registrationChargesType, setRegistrationChargesType] = useState([]);
  const [selectedRegistrationCharges, setSelectedRegistrationCharges] =
    useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [addNewInput, setAddNewInput] = useState([]);
  const [otherPriceErrorNameIndex, setOtherPriceErrorNameIndex] =
    useState(null);
  const [otherPriceErrorAmountIndexInput, setOtherPriceErrorAmountIndex] =
    useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [authToken, setAuthToken] = useState("");

  const [isMinimumAmtModalVisible, setIsMinimumAmtModalVisible] =
    useState(false);
  const [configureRuleData, setConfigureRuleData] = useState("");
  const [isMiniAmountCheck, setisMiniAmountCheck] = useState(true);
  const [otherPriceDropDownIndex, setOtherPriceDropDownIndex] = useState(null);
  const [receiptDocModel, setReceiptDocModel] = useState(false);
  const [selectedTags, setSelectedTags] = useState("");
  const [tagList, setTagList] = useState([]);

  // Edit buttons shows
  useEffect(() => {
    if (
      selector &&
      selector.pre_booking_details_response &&
      selector.pre_booking_details_response.dmsLeadDto
    ) {
      const { leadStatus } = selector.pre_booking_details_response.dmsLeadDto;
      let isEditFlag = false;
      if (
        uploadedImagesDataObj.receipt &&
        uploadedImagesDataObj.receipt.fileName
      ) {
        isEditFlag = false;
      } else if (
        (leadStatus === "PREBOOKINGCOMPLETED" || leadStatus === "REJECTED") &&
        !isDropSelected
      ) {
        if (!userData.isManager || isLeadCreatedBySelf()) {
          isEditFlag = true;
        }
      }

      if (isEditFlag) {
        setIsEditButtonShow(true);
      } else {
        setIsEditButtonShow(false);
      }
    }
  }, [selector.pre_booking_details_response, uploadedImagesDataObj.receipt]);

  // Add Model buttons shows
  useEffect(() => {
    if (
      selector &&
      selector.pre_booking_details_response &&
      selector.pre_booking_details_response.dmsLeadDto
    ) {
      const { leadStatus } = selector.pre_booking_details_response.dmsLeadDto;
      if (leadStatus == "ENQUIRYCOMPLETED") {
        setIsAddModelButtonShow(true);
      } else {
        setIsAddModelButtonShow(false);
      }
    }
  }, [selector.pre_booking_details_response, uploadedImagesDataObj.receipt]);

  // Check for lead created by manager
  const isLeadCreatedBySelf = () => {
    let isCreatedBy = false;
    if (
      userData &&
      selector &&
      selector.pre_booking_details_response &&
      selector.pre_booking_details_response.dmsLeadDto
    ) {
      if (
        userData.employeeName ==
        selector.pre_booking_details_response.dmsLeadDto.createdBy
      ) {
        isCreatedBy = true;
      }
    }

    return isCreatedBy;
  };

  // Submit buttons shows
  const isSubmitShow = () => {
    let isSubmitFlag = false;
    if (!isDropSelected) {
      if (isSubmitCancelButtonShow) {
        isSubmitFlag = true;
      } else if (
        selector &&
        selector.pre_booking_details_response &&
        selector.pre_booking_details_response.dmsLeadDto
      ) {
        const { leadStatus } = selector.pre_booking_details_response.dmsLeadDto;

        if (
          selector.booking_amount !== "" &&
          leadStatus === "ENQUIRYCOMPLETED"
        ) {
          if (!userData.isManager || isLeadCreatedBySelf()) {
            isSubmitFlag = true;
          }
        }
      }
    }
    return isSubmitFlag;
  };

  // Check for Input Fields Editable
  const isInputsEditable = () => {
    let isInputEditFlag = false;
    if (
      selector &&
      selector.pre_booking_details_response &&
      selector.pre_booking_details_response.dmsLeadDto
    ) {
      const { leadStatus } = selector.pre_booking_details_response.dmsLeadDto;
      if (!userData.isManager || isLeadCreatedBySelf()) {
        if (leadStatus === "ENQUIRYCOMPLETED") {
          isInputEditFlag = true;
        } else if (!isEditButtonShow && leadStatus !== "SENTFORAPPROVAL") {
          isInputEditFlag = true;
        }
      }
    }

    return isInputEditFlag;
  };

  const isRejectRemarkEnable = () => {
    let isRejectFlag = false;
    if (!userData.isManager) {
      if (!isEditButtonShow) {
        isRejectFlag = true;
      }
    } else if (!isLeadCreatedBySelf() && isRejectSelected) {
      isRejectFlag = true;
    } else if (isLeadCreatedBySelf() && !isEditButtonShow) {
      isRejectFlag = true;
    }

    return isRejectFlag;
  };

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
    dispatch(clearState());
    setTotalOnRoadPriceAfterDiscount(0);
    setTotalOnRoadPrice(0);
    setOtherPrices(0);
    setOtherPriceErrorNameIndex(null);
    setOtherPriceErrorAmountIndex(null);
    clearLocalData();
    navigation.goBack();
  };

  const goToLeadScreen = () => {
    dispatch(clearState());
    setTotalOnRoadPriceAfterDiscount(0);
    setTotalOnRoadPrice(0);
    setOtherPrices(0);
    setOtherPriceErrorNameIndex(null);
    setOtherPriceErrorAmountIndex(null);
    clearLocalData();
    navigation.navigate(EmsTopTabNavigatorIdentifiers.leads, {
      fromScreen: "bookingApproval",
    });
  };

  useEffect(() => {
    setComponentAppear(true);
    getAsyncstoreData();
    getBranchId();
    getCustomerEnquiryType();

    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    // return () => {
    //     BackHandler.removeEventListener(
    //         "hardwareBackPress",
    //         handleBackButtonClick
    //     );
    // };
  }, [navigation]);

  useEffect(() => {
    navigation.addListener("blur", () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    });
  }, [navigation]);

  useEffect(() => {
    if (selector.orgTagListById.length > 0) {
      let newArr = [];
      let names = [];
      let selectedNames = [];
      for (let i = 0; i < selector.orgTagListById.length; i++) {
        const element = selector.orgTagListById[i];
        let obj = {
          ...element,
          selected: element.isActive == "Y" ? true : false,
        };
        if (obj.selected != undefined && obj.selected == true) {
          names.push(obj.name);
        }
        selectedNames = names?.join(", ");
        newArr.push(obj);
      }
      setTagList(Object.assign([], newArr));
      setSelectedTags(selectedNames);
    } else if (selector.orgTagList.length > 0) {
      let newArr = [];
      for (let i = 0; i < selector.orgTagList.length; i++) {
        const element = selector.orgTagList[i];
        let obj = {
          ...element,
          selected: false,
        };
        newArr.push(obj);
      }
      setTagList(Object.assign([], newArr));
    }
    return () => {};
  }, [selector.orgTagList, selector.orgTagListById]);

  // useEffect(() => {
  //   navigation.addListener("focus", () => {
  //     BackHandler.removeEventListener(
  //       "hardwareBackPress",
  //       removeExistingKeysFromAsync(route?.params?.lists?.names)
  //     );
  //   });
  // }, [navigation]);

  // useEffect(() => {
  //     navigation.addListener('blur', () => {
  //         setTotalOnRoadPriceAfterDiscount(0);
  //         setTotalOnRoadPrice(0)
  //         clearLocalData()
  //         dispatch(clearState())
  //     })
  // }, [navigation]);

  const clearLocalData = () => {
    setShowPrebookingPaymentSection(false);
    setShowApproveRejectBtn(false);
    setShowSubmitDropBtn(false);
    setIsEdit(false);
    setIsReciptDocUpload(false);
    setOpenAccordian(0);
    setComponentAppear(false);
    setUserData({
      orgId: "",
      employeeId: "",
      employeeName: "",
      isManager: false,
      editEnable: false,
      isPreBookingApprover: false,
      isSelfManager: "",
      isTracker: "",
      branchId: 0,
      approverId: "",
      orgName: "",
    });
    setShowDropDownModel(false);
    setShowMultipleDropDownData(false);
    setDataForDropDown([]);
    setDropDownKey("");
    setDropDownTitle("Select Data");
    setCarModelsData([]);
    setSelectedCarVarientsData({
      varientList: [],
      varientListForDropDown: [],
    });
    setCarColorsData([]);
    setSelectedModelId(0);
    setSelectedVarientId(0);
    setInsurenceVarientTypes([]);
    setInsurenceAddOnTypes([]);
    setWarrentyTypes([]);
    setSelectedInsurencePrice(0);
    setSelectedAddOnsPrice(0);
    setSelectedWarrentyPrice(0);
    setSelectedPaidAccessoriesPrice(0);
    setTotalOnRoadPrice(0);
    setTotalOnRoadPriceAfterDiscount(0);
    setOtherPrices(0);
    setPriceInformationData({
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
    setIsDropSelected(false);
    setTypeOfActionDispatched("");
    setSelectedPaidAccessoriesList([]);
    setSelectedInsurenceAddons([]);
    setShowApproveRejectBtn(false);
    setShowPrebookingPaymentSection(false);
    setShowSubmitDropBtn(false);
    setUploadedImagesDataObj({});
    setLifeTaxAmount(0);
    setTcsAmount(0);
    setFocPrice(0);
    setMrpPrice(0);
    setTaxPercent("");
    setInsuranceDiscount("");
    setAccDiscount("");
    setInitialTotalAmt(0);
    setIsEdit(false);
    setSelectedTags("");
    setTagList([]);
  };

  const getCustomerEnquiryType = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(getCustomerTypesApi(jsonObj.orgId));
      dispatch(getEnquiryTypesApi(jsonObj.orgId));
    }
  };

  useEffect(() => {
    if (route.params?.accessoriesList) {
      updatePaidAccessroies(route.params?.accessoriesList);
    }
  }, [route.params?.accessoriesList]);

  const handleBackButtonClick = () => {
    goParentScreen();
    setPaidAccessoriesListNew([]);
    return true;
  };

  const scrollToPos = (itemIndex) => {
    scrollRef.current.scrollTo({ y: itemIndex * 70 });
  };

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
    selectedRegistrationCharges,
  ]);

  useEffect(() => {
    if (selector.pan_number) {
      dispatch(
        setDocumentUploadDetails({
          key: "PAN_NUMBER",
          text: selector.pan_number,
        })
      );
      setDropDownData({ key: "FORM_60_PAN", value: "PAN", id: "" });
      setIsDataLoaded(true);
    }
  }, [selector.isDataLoaded, selector.pan_number]);

  useEffect(() => {
    // setTotalOnRoadPriceAfterDiscount(totalOnRoadPriceAfterDiscount - focPrice)
    dispatch(
      setOfferPriceDetails({
        key: "FOR_ACCESSORIES",
        text: focPrice.toString(),
      })
    );
  }, [focPrice]);

  useEffect(() => {
    if (selector.pincode) {
      if (selector.pincode.length != 6) {
        return;
      }
      PincodeDetailsNew(selector.pincode).then(
        (res) => {
          // dispatch an action to update address
          let tempAddr = [];
          if (res?.length > 0) {
            for (let i = 0; i < res.length; i++) {
              if (res[i].Block === selector.village) {
                setDefaultAddress(res[i]);
              }
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData([...tempAddr]);
              }
            }
          }
          // dispatch(updateAddressByPincode(resolve));
        },
        (rejected) => {}
      );
    }
  }, [selector.pincode]);

  // useEffect(() => {
  //     if (mrpPrice > 0){
  //         setTotalOnRoadPrice(totalOnRoadPrice + mrpPrice)
  //     }
  //     else{
  //         setTotalOnRoadPrice(initialTotalAmt)
  //     }
  // }, [mrpPrice]);

  useEffect(() => {
    calculateOnRoadPriceAfterDiscount();
  }, [
    selector.consumer_offer,
    selector.exchange_offer,
    selector.corporate_offer,
    selector.promotional_offer,
    selector.cash_discount,

    selector.for_accessories,
    selector.insurance_discount,
    selector.accessories_discount,
    selector.additional_offer_1,
    selector.additional_offer_2,
    totalOnRoadPrice,
    selector.registrationCharges,
  ]);

  const getBranchId = () => {
    AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID).then((branchId) => {
      setSelectedBranchId(branchId);
    });
  };

  const deleteModalFromServer = async ({ token, value }) => {
    //alert(value.id)
    await fetch(URL.DELETE_MODEL_CARD(value.id), {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    })
      .then((json) => {
        json.json();
      })
      .then((res) => {
        //alert("delete : ", res.status);
        //alert(res)
      })
      .catch((error) => {
        showToastRedAlert(error.message);
      });
  };

  const modelOnclick = async (index, value, type) => {
    try {
      if (type == "update") {
        let modelData = "";
        if (
          selector?.pre_booking_details_response?.dmsLeadDto?.dmsLeadProducts
            .length
        ) {
          const { dmsLeadProducts } =
            selector.pre_booking_details_response.dmsLeadDto;
          for (let i = 0; i < dmsLeadProducts.length; i++) {
            if (dmsLeadProducts[i].isPrimary == "Y") {
              modelData = dmsLeadProducts[i];
              break;
            }
          }
        }

        if (
          value?.model &&
          // selector?.pre_booking_details_response?.dmsLeadDto?.leadStatus !=
          //   "ENQUIRYCOMPLETED" &&
          modelData.model != value.model
        ) {
          dispatch(updateOfferPriceData());
          clearPriceConfirmationData();
        }

        if (
          value?.model &&
          // selector?.pre_booking_details_response?.dmsLeadDto?.leadStatus !=
          // "ENQUIRYCOMPLETED" &&
          modelData.model == value.model
        ) {
          if (modelData.variant == value.variant) {
            setVehicleOnRoadPriceInsuranceDetails();
            setPriceConfirmationData();
            setPaidAccessoriesData();
            dispatch(
              updateOfferPriceData(selector.on_road_price_dto_list_response)
            );
            // if (
            //   selector?.pre_booking_details_response?.dmsLeadDto?.leadStatus ==
            //   "PREBOOKINGCOMPLETED"
            // ) {
            setCarModelDataList(value, index);
            // } else {
            //   addingIsPrimary();
            // }
          } else if (!value.color && value.isPrimary == "Y") {
            dispatch(updateOfferPriceData());
            clearPriceConfirmationData();
            setCarModelDataList(value, index);
          } else {
            setCarModelDataList(value, index);
          }
        } else {
          setCarModelDataList(value, index);
        }
      } else {
        if (type == "delete") {
          let arr = await [...carModelsList];
          arr.splice(index, 1);
          deleteModalFromServer({ value });
          let findPrimaryData = [...arr].filter(
            (item) => item.isPrimary === "Y"
          );

          getConfigureRulesDetails(
            findPrimaryData[0].model,
            findPrimaryData[0].variant,
            findPrimaryData[0].fuel,
            userData.orgId
          );
          await setCarModelsList([...arr]);
        }
      }
    } catch (error) {
      // alert(error)
    }
  };

  const setCarModelDataList = async (value, index) => {
    let arr = Object.assign([], carModelsList);
    if (arr[index] && value) {
      arr[index] = value;
    }
    let primaryModel = [];
    primaryModel = arr.filter((item) => item.isPrimary === "Y");

    if (value?.isPrimary == "Y") {
      isChangedModelPrimary = true;
    } else {
      isChangedModelPrimary = false;
    }

    if (primaryModel.length > 0) {
      if (primaryModel[0].variant !== "" && primaryModel[0].model !== "") {
        updateVariantModelsData(
          primaryModel[0].model,
          true,
          primaryModel[0].variant
        );
      }
    }

    let findPrimaryData = [...arr].filter((item) => item.isPrimary === "Y");
    getConfigureRulesDetails(
      findPrimaryData[0].model,
      findPrimaryData[0].variant,
      findPrimaryData[0].fuel,
      userData.orgId
    );
    await setCarModelsList(Object.assign([], arr));
  };

  useEffect(() => {
    if (selector.configureRulesResponse_status == "fulfilled") {
      setConfigureRuleData(selector.configureRulesResponse);
    } else {
      setConfigureRuleData("");
    }
  }, [selector.configureRulesResponse]);

  const setPaidAccessoriesData = () => {
    const dmsLeadDto = selector.pre_booking_details_response.dmsLeadDto;
    // Update Paid Accesories
    if (dmsLeadDto.dmsAccessories.length > 0) {
      let totalPrice = 0,
        totalFOCPrice = 0;
      for (let i = 0; i < dmsLeadDto.dmsAccessories.length; i++) {
        if (dmsLeadDto.dmsAccessories[i].dmsAccessoriesType !== "FOC") {
          totalPrice += dmsLeadDto.dmsAccessories[i].amount;
        } else {
          totalFOCPrice += dmsLeadDto.dmsAccessories[i].amount;
        }
        if (i === dmsLeadDto.dmsAccessories.length - 1) {
          setSelectedPaidAccessoriesPrice(totalPrice);
          setSelectedFOCAccessoriesPrice(totalFOCPrice);
        }
      }
    }
    setSelectedPaidAccessoriesList([...dmsLeadDto.dmsAccessories]);
    setPaidAccessoriesListNew([
      ...dmsLeadDto.dmsAccessories.filter(
        (item) => item.dmsAccessoriesType !== "FOC"
      ),
    ]);
  };

  const isPrimaryOnclick = async (isPrimaryEnabled, index, item) => {
    try {
      if (isPrimaryEnabled === "Y") {
        await setIsPrimaryCurrentIndex(index);
        updateVariantModelsData(item.model, true, item.variant);
        dispatch(updateOfferPriceData());
        clearPriceConfirmationData();
      }
      if (carModelsList && carModelsList.length > 0) {
        let arr = await [...carModelsList];
        var data = arr[isPrimaryCureentIndex];
        const cardata = await {
          color: data.color,
          fuel: data.fuel,
          id: data.id,
          model: data.model,
          transimmisionType: data.transimmisionType,
          variant: data.variant,
          isPrimary: "N",
        };
        const selecteditem = await {
          color: item.color,
          fuel: item.fuel,
          id: item.id,
          model: item.model,
          transimmisionType: item.transimmisionType,
          variant: item.variant,
          isPrimary: "Y",
        };
        await setCarModelsList([]);
        arr[isPrimaryCureentIndex] = cardata;
        arr[index] = selecteditem;

        setisMiniAmountCheck(true);
        let findPrimaryData = [...arr].filter((item) => item.isPrimary === "Y");

        getConfigureRulesDetails(
          findPrimaryData[0].model,
          findPrimaryData[0].variant,
          findPrimaryData[0].fuel,
          userData.orgId
        );
        await setCarModelsList([...arr]);
        await setIsPrimaryCurrentIndex(index);
      }
    } catch (error) {
      // alert(error)
    }
  };
  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      let isManager = false,
        editEnable = false;
      let isPreBookingApprover = false;
      if (
        jsonObj.hrmsRole === "MD" ||
        jsonObj.hrmsRole === "General Manager" ||
        jsonObj.hrmsRole === "Manager" ||
        jsonObj.hrmsRole === "Sales Manager"
      ) {
        isManager = true;
      }
      if (jsonObj.roles.includes("PreBooking Approver")) {
        editEnable = true;
        isPreBookingApprover = true;
      }
      dispatch(getOrgTags(jsonObj.orgId));
      dispatch(getOrgTagsById(enqDetails.leadId));
      setUserData({
        orgId: jsonObj.orgId,
        employeeId: jsonObj.empId,
        employeeName: jsonObj.empName,
        isManager: isManager,
        editEnable: editEnable,
        isPreBookingApprover: isPreBookingApprover,
        isSelfManager: jsonObj.isSelfManager,
        isTracker: jsonObj.isTracker,
        branchId: jsonObj.branchId,
        approverId: jsonObj.approverId,
        orgName: jsonObj.orgName
      });

      const payload = {
        bu: jsonObj.orgId,
        dropdownType: "PreBookDropReas",
        parentId: 0,
      };

      // Make Api calls in parallel
      Promise.all([
        dispatch(getDropDataApi(payload)),
        dispatch(getOtherPricesDropDown(jsonObj.orgId)),
        getCarModelListFromServer(jsonObj.orgId),
      ]).then(() => {});

      // Get Token
      AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
        setUserToken(token);
        setAuthToken(token);
        getBanksListFromServer(jsonObj.orgId, token);
        GetPreBookingDropReasons(jsonObj.orgId, token);
      });
    }
  };

  const GetPreBookingDropReasons = (orgId, token) => {
    GetDropList(orgId, token, "Pre%20Booking").then(
      (resolve) => {
        setDropData(resolve);
      },
      (reject) => {
        console.error("Getting drop list faild");
      }
    );
  };

  const getConfigureRulesDetails = async (
    modalNAme,
    variantName,
    fuel,
    orgid
  ) => {
    //todo
    setisMiniAmountCheck(true);
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(
        getRulesConfiguration({
          model: modalNAme,
          variant: variantName,
          fuel: fuel,
          orgId: jsonObj.orgId,
        })
      );
    }
  };

  const getCarModelListFromServer = (orgId) => {
    // Call Api
    GetCarModelList(orgId)
      .then(
        (resolve) => {
          let modelList = [];
          if (resolve.length > 0) {
            resolve.forEach((item) => {
              modelList.push({
                id: item.vehicleId,
                name: item.model,
                isChecked: false,
                ...item,
              });
            });
          }
          setCarModelsData([...modelList]);
        },
        (rejected) => {}
      )
      .finally(() => {
        // Get PreBooking Details
        getPreBookingDetailsFromServer();
      });
  };

  const getPreBookingDetailsFromServer = () => {
    if (universalId) {
      dispatch(getPrebookingDetailsApi(universalId));
    }
  };

  const getBanksListFromServer = (orgId, token) => {
    GetFinanceBanksList(orgId, token).then(
      (resp) => {
        const bankList = resp.map((item) => {
          return { ...item, name: item.bank_name };
        });
        setFinanceBanksList([...bankList]);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  // Handle Pre-Booking Details Response
  useEffect(() => {
    if (selector.pre_booking_details_response) {
      setShowPrebookingPaymentSection(false);
      setShowApproveRejectBtn(false);
      setShowSubmitDropBtn(false);
      setIsEdit(false);
      setIsReciptDocUpload(false);
      let dmsContactOrAccountDto;
      if (
        selector.pre_booking_details_response.hasOwnProperty("dmsAccountDto")
      ) {
        dmsContactOrAccountDto =
          selector.pre_booking_details_response.dmsAccountDto;
      } else if (
        selector.pre_booking_details_response.hasOwnProperty("dmsContactDto")
      ) {
        dmsContactOrAccountDto =
          selector.pre_booking_details_response.dmsContactDto;
      }
      const dmsLeadDto = selector.pre_booking_details_response.dmsLeadDto;
      dispatch(getOnRoadPriceDtoListApi(dmsLeadDto.id));
      //if (dmsLeadDto.leadStatus === "ENQUIRYCOMPLETED" || dmsLeadDto.leadStatus === "SENTFORAPPROVAL" || dmsLeadDto.leadStatus === "REJECTED") {

      if (
        dmsLeadDto.leadStatus === "ENQUIRYCOMPLETED" ||
        dmsLeadDto.leadStatus === "REJECTED"
      ) {
        setShowSubmitDropBtn(true);
      }

      if (dmsLeadDto.leadStatus === "SENTFORAPPROVAL") {
        setShowApproveRejectBtn(true);
      }
      if (dmsLeadDto.leadStatus === "PREBOOKINGCOMPLETED") {
        setShowPrebookingPaymentSection(true);
        // Get Payment Details
        dispatch(getPaymentDetailsApi(dmsLeadDto.id));
        dispatch(getBookingAmountDetailsApi(dmsLeadDto.id));
        setShowApproveRejectBtn(false);
      }
      if (dmsLeadDto.leadStatus === "REJECTED") {
        setIsRejectSelected(true);
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
      dispatch(updateDmsAttachments(dmsLeadDto.dmsAttachments));
      if (dmsLeadDto.leadStatus === "PREBOOKINGCOMPLETED") {
        let newInd = dmsLeadDto.dmsAttachments.findIndex((obj) => {
          return obj.documentType == "receipt" && obj.documentPath != "";
        });
        if (newInd < 0) {
          setReceiptDocModel(true);
        } else {
          setReceiptDocModel(false);
        }
      }
      // Update Paid Accesories
      if (dmsLeadDto.dmsAccessories.length > 0) {
        let initialValue = 0;
        let totalPrice = 0,
          totalFOCPrice = 0;
        // const totalPrice = dmsLeadDto.dmsAccessories.reduce(
        //     (preValue, currentValue) => preValue + currentValue.amount,
        //     initialValue
        // );
        for (let i = 0; i < dmsLeadDto.dmsAccessories.length; i++) {
          if (dmsLeadDto.dmsAccessories[i].dmsAccessoriesType !== "FOC") {
            totalPrice += dmsLeadDto.dmsAccessories[i].amount;
          } else {
            totalFOCPrice += dmsLeadDto.dmsAccessories[i].amount;
          }
          if (i === dmsLeadDto.dmsAccessories.length - 1) {
            setSelectedPaidAccessoriesPrice(totalPrice);
            setSelectedFOCAccessoriesPrice(totalFOCPrice);
          }
        }
      }
      setSelectedPaidAccessoriesList([...dmsLeadDto.dmsAccessories]);
      setPaidAccessoriesListNew([
        ...dmsLeadDto.dmsAccessories.filter(
          (item) => item.dmsAccessoriesType !== "FOC"
        ),
      ]);
      // setSelectedFOCAccessoriesList([...dmsLeadDto.dmsAccessories.filter((item) => item.dmsAccessoriesType === "FOC")]);
    }
  }, [selector.pre_booking_details_response]);

  const saveAttachmentDetailsInLocalObject = (dmsAttachments) => {
    const attachments = [...dmsAttachments];
    if (attachments.length > 0) {
      const dataObj = {};
      attachments.forEach((item, index) => {
        const obj = {
          documentPath: item.documentPath,
          documentType: item.documentType,
          fileName: item.fileName,
          keyName: item.keyName,
          documentNumber: item.documentNumber,
        };
        dataObj[item.documentType] = obj;
      });
      setUploadedImagesDataObj({ ...dataObj });
    }
  };

  useEffect(() => {
    // if (selector.model_drop_down_data_update_status === "update") {
    //     updateVariantModelsData(selector.model, true, selector.varient);
    // }
  }, [selector.model_drop_down_data_update_status]);

  const getPreBookingListFromServer = async () => {
    if (userData.employeeId) {
      let endUrl =
        "?limit=10&offset=" +
        "0" +
        "&status=PREBOOKING&empId=" +
        userData.employeeId;
      dispatch(getPreBookingData(endUrl));
    }
  };

  // Handle getOnRoadPriceDtoListApi response
  useEffect(() => {
    setPriceConfirmationData();
  }, [selector.on_road_price_dto_list_response]);

  const setPriceConfirmationData = () => {
    if (selector.on_road_price_dto_list_response.length > 0) {
      const dmsOnRoadPriceDtoObj = selector.on_road_price_dto_list_response[0];
      // setSelectedInsurencePrice(dmsOnRoadPriceDtoObj.)
      setSelectedWarrentyPrice(dmsOnRoadPriceDtoObj.warrantyAmount);
      let handlingChargeSlctdLocal = handlingChargSlctd;
      let essentialKitSlctdLocal = essentialKitSlctd;
      let fastTagSlctdLocal = fastTagSlctd;

      if (
        dmsOnRoadPriceDtoObj.handlingCharges &&
        dmsOnRoadPriceDtoObj.handlingCharges > 0
      ) {
        setHandlingChargSlctd(true);
        handlingChargeSlctdLocal = true;
      }
      if (
        dmsOnRoadPriceDtoObj.essentialKit &&
        dmsOnRoadPriceDtoObj.essentialKit > 0
      ) {
        setEssentialKitSlctd(true);
        essentialKitSlctdLocal = true;
      }
      if (dmsOnRoadPriceDtoObj.fast_tag && dmsOnRoadPriceDtoObj.fast_tag > 0) {
        setFastTagSlctd(true);
        fastTagSlctdLocal = true;
      }
      calculateOnRoadPrice(
        handlingChargeSlctdLocal,
        essentialKitSlctdLocal,
        fastTagSlctdLocal
      );

      if (
        dmsOnRoadPriceDtoObj.insuranceAddonData &&
        dmsOnRoadPriceDtoObj.insuranceAddonData.length > 0
      ) {
        // let addOnPrice = 0;
        // dmsOnRoadPriceDtoObj.insuranceAddonData.forEach((element, index) => {
        //     addOnPrice += Number(element.add_on_price[0].cost);
        // });
        // setSelectedAddOnsPrice(addOnPrice);
      }
      if (dmsOnRoadPriceDtoObj.lifeTaxPercentage) {
        setTaxPercent(
          (
            (Number(dmsOnRoadPriceDtoObj.lifeTaxPercentage) * 1000) /
            10
          ).toString()
        );
        setLifeTaxAmount(
          getLifeTaxNew(Number(dmsOnRoadPriceDtoObj.lifeTaxPercentage) * 100)
        );
      }
      if (dmsOnRoadPriceDtoObj.insuranceDiscount) {
        setInsuranceDiscount(dmsOnRoadPriceDtoObj.insuranceDiscount.toString());
      }
      if (dmsOnRoadPriceDtoObj.accessoriesDiscount) {
        setAccDiscount(dmsOnRoadPriceDtoObj.accessoriesDiscount.toString());
      }

      if (dmsOnRoadPriceDtoObj.otherPricesData?.length > 0) {
        let newArr = [];
        dmsOnRoadPriceDtoObj.otherPricesData.forEach((item, i) => {
          newArr.push({
            name: item.name,
            amount: item.amount,
          });
        });
        if (newArr.length > 0) {
          var totalprice = 0;
          for (let data of newArr) {
            totalprice = totalprice + Number(data.amount);
            setOtherPrices(totalprice);
          }
        }
        setAddNewInput(Object.assign([], newArr));
      }
    }
  };

  useEffect(() => {
    if (addNewInput.length > 0) {
      var totalprice = 0;
      for (let data of addNewInput) {
        totalprice = totalprice + Number(data.amount);
        setOtherPrices(totalprice);
      }
    }
  }, [addNewInput]);

  useEffect(() => {
    calculateOnRoadPriceAfterDiscount();
  }, [insuranceDiscount, accDiscount]);

  useEffect(() => {
    setSelectedAddOnsPrice(selector.addOnPrice);
  }, [selector.addOnPrice]);

  useEffect(() => {
    setVehicleOnRoadPriceInsuranceDetails();
  }, [selector.vehicle_on_road_price_insurence_details_response]);

  const setVehicleOnRoadPriceInsuranceDetails = () => {
    if (selector.vehicle_on_road_price_insurence_details_response) {
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

      const allRegistrationCharges =
        selector.vehicle_on_road_price_insurence_details_response
          .registration || {};
      function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }
      if (!isEmpty(allRegistrationCharges)) {
        let x = Object.keys(allRegistrationCharges);
        let newArray = [];
        for (let i = 0; i < x.length; i++) {
          let ladel = x[i].toString();

          let temp = { name: ladel, cost: allRegistrationCharges[ladel] };
          if (selector.registrationCharges !== 0) {
            if (
              selector.registrationCharges === allRegistrationCharges[ladel]
            ) {
              setSelectedRegistrationCharges(temp);
            }
          }
          newArray.push(temp);
        }
        setRegistrationChargesType(newArray);
      }
      setPriceInformationData({
        ...selector.vehicle_on_road_price_insurence_details_response,
      });
    }
  };

  const clearPriceConfirmationData = () => {
    setAddNewInput([]);
    setOtherPrices(0);
    setSelectedPaidAccessoriesList([]);
    setSelectedFOCAccessoriesList([]);
    setSelectedRegistrationCharges({});
    setRegistrationChargesType([]);
    setInsurenceAddOnTypes([]);
    setSelectedInsurencePrice(0);
    setPriceInformationData({
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
    setSelectedWarrentyPrice(0);
    setHandlingChargSlctd(false);
    setEssentialKitSlctd(false);
    setFastTagSlctd(false);
    calculateOnRoadPrice(false, false, false);
    setTaxPercent("");
    setLifeTaxAmount(0);
    setInsuranceDiscount("");
    setAccDiscount("");
    setPaidAccessoriesListNew([]);
    setSelectedPaidAccessoriesPrice(0);
    setTotalOnRoadPrice(0);
    setTcsAmount(0);
    setTotalOnRoadPriceAfterDiscount(0);
  };

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    setShowMultipleDropDownData(false);
    const orgId = +userData.orgId;

    switch (key) {
      case "SALUTATION":
        setDataForDropDown([...Salutation_Types]);
        break;
      case "ENQUIRY_SEGMENT":
        if (selector.enquiry_type_list?.length === 0) {
          showToast("No Enquiry Types found");
          return;
        }
        let eData = selector.enquiry_type_list;
        let eNewData = eData?.map((val) => ({
          ...val,
          name: val?.segment_type || "",
        }));
        setDataForDropDown([...eNewData]);
        break;
      case "BUYER_TYPE":
        setDataForDropDown([...Buyer_Type_Data]);
        break;
      case "CUSTOMER_TYPE":
        if (selector.customer_types_data?.length === 0) {
          showToast("No Customer Types found");
          return;
        }
        let cData = selector.customer_types_data;
        let cNewData = cData.map((val) => ({
          ...val,
          name: val?.customer_type || "",
        }));
        setDataForDropDown([...cNewData]);
        break;

      case "GENDER":
        setDataForDropDown([...Gender_Types]);
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
        setDataForDropDown([...financeBanksList]);
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
      case "REGISTRATION_CHARGES":
        setDataForDropDown([...registrationChargesType]);
        break;
      case "CUSTOMER_TYPE_CATEGORY":
        setDataForDropDown([...Customer_Category_Types]);
        break;
      case "OTHER_PRICES":
        setDataForDropDown([...selector.otherPricesDropDown]);
        break;
      case "SELECT_TAG":
        setShowMultipleDropDownData(true);
        setDataForDropDown(tagList);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const updateVariantModelsData = (
    selectedModelName,
    fromInitialize,
    selectedVarientName
  ) => {
    if (!selectedModelName || selectedModelName.length === 0) {
      return;
    }
    let arrTemp = carModelsData.filter(function (obj) {
      return obj.model === selectedModelName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.varients;
      setSelectedModelId(carModelObj.vehicleId);
      GetPaidAccessoriesListFromServer(
        carModelObj.vehicleId,
        userData.orgId,
        userToken
      );
      if (mArray.length) {
        mArray.forEach((item) => {
          newArray.push({
            id: item.id,
            name: item.name,
          });
        });
        setSelectedCarVarientsData({
          varientList: [...mArray],
          varientListForDropDown: [...newArray],
        });
        if (fromInitialize) {
          updateColorsDataForSelectedVarient(
            selectedVarientName,
            [...mArray],
            carModelObj.vehicleId
          );
        }
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
    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.vehicleImages;
      const varientId = carModelObj.id;
      setSelectedVarientId(varientId);
      if (mArray.length) {
        mArray.map((item) => {
          newArray.push({
            id: item.id,
            name: item.color,
          });
        });
        const obj = {
          fuelType: carModelObj.fuelType,
          transmissionType: carModelObj.transmission_type,
        };
        dispatch(updateFuelAndTransmissionType(obj));
        dispatch(
          getOnRoadPriceAndInsurenceDetailsApi({
            orgId: userData.orgId,
            varientId: varientId,
          })
        );
        setCarColorsData([...newArray]);
      }
    }
  };

  const calculateOnRoadPrice = (
    handleSelected,
    essentialSelected,
    fastTagSelected
  ) => {
    let totalPrice = 0;
    totalPrice += priceInfomationData.ex_showroom_price;
    // const lifeTax = getLifeTax();
    let lifeTax = taxPercent !== "" ? getLifeTaxNew(Number(taxPercent)) : 0;
    setLifeTaxAmount(lifeTax);
    totalPrice += lifeTax;
    // totalPrice += priceInfomationData.registration_charges;
    totalPrice += selectedRegistrationCharges?.cost || 0;
    totalPrice += selectedInsurencePrice;
    if (selector.insurance_type !== "") {
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
    // setTotalOnRoadPriceAfterDiscount(totalPrice - selectedFOCAccessoriesPrice);
    totalPrice += selectedPaidAccessoriesPrice;
    setTotalOnRoadPrice(totalPrice);
    setInitialTotalAmt(totalPrice);
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
    // totalPrice -= Number(selector.registrationCharges);
    // if (accDiscount !== '') {
    //     totalPrice -= Number(accDiscount);
    // }
    // if (insuranceDiscount !== '') {
    //     totalPrice -= Number(insuranceDiscount);
    // }
    setTotalOnRoadPriceAfterDiscount(totalPrice);
  };

  const checkModelSelection = () => {
    let error = false;
    for (let i = 0; i < carModelsList.length; i++) {
      if (carModelsList[i].model.length == 0) {
        error = true;
        showToast("Please fill model");
        break;
      } else if (carModelsList[i].variant.length == 0) {
        error = true;
        showToast("Please fill model variant");
        break;
      } else if (carModelsList[i].color.length == 0) {
        error = true;
        showToast("Please fill model Color");
        break;
      }
    }
    if (error) {
      return true;
    }
    return false;
  };

  const postEvalutionForm = () => {
    // todo manthan
    if (selector.buyer_type.length !== 0) {
      let payload = {
        "universalId": universalId,
        "evaluationApproverId": userData.approverId,
        // "oldBuyerType": "",
        "status": "ASSIGNED",
        "newBuyerType": selector.buyer_type
      }
      dispatch(postEvalutionApi(payload));
    }
  }
  const postFinanceForm = () => {
    // todo manthan
    if (selector.retail_finance.length !== 0) {
      let payload = {
        "universalId": universalId,
        "evaluationApproverId": userData.approverId,
        // "oldBuyerType": "",
        "status": "ASSIGNED",
        "newBuyerType": selector.retail_finance
      }
      dispatch(postFinanaceApi(payload));
    }
  }

  const submitClicked = async () => {
    Keyboard.dismiss();
    setIsSubmitPress(true);

    if (selector.salutation.length === 0) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("please select salutation");
      return;
    }

    if (selector.first_name.length === 0) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("please enter first name");
      return;
    }
    if (!isValidate(selector.first_name)) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("please enter alphabetics only in firstname");
      return;
    }
    if (selector.last_name.length === 0) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("please enter last name");
      return;
    }
    if (!isValidate(selector.last_name)) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("please enter alphabetics only in lastname");
      return;
    }
    if (selector.mobile.length === 0) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("please enter mobile number");
      return;
    }
    if (selector.salutation.length === 0) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("Please select Salutation");
      return;
    }
    if (selector.email.length === 0 && userData.isTracker == "N") {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("please enter email");
      return;
    }

    if (!isEmail(selector.email) && userData.isTracker == "N") {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("please enter valid email");
      return;
    }
    if (selector.enquiry_segment.length == 0) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("Please select enquiry segment");
      return;
    }
    if (selector.buyer_type.length == 0) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("Please select buyer type");
      return;
    }
    if (selector.customer_type.length == 0) {
      scrollToPos(0);
      setOpenAccordian("1");
      showToast("Please select customer type");
      return;
    }
    if (selector.enquiry_segment.toLowerCase() === "personal") {
      if (selector.gender.length === 0) {
        scrollToPos(0);
        setOpenAccordian("1");
        showToast("please select Gender");
        return;
      }
      if (selector.date_of_birth.length === 0) {
        scrollToPos(0);
        setOpenAccordian("1");
        showToast("please select Date Of Birth");
        return;
      }
    }

    // Address fields
    if (selector.pincode.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter pincode");
      return;
    }

    // let isAddressSelected = false;

    // if (defaultAddress) {
    //   isAddressSelected = true;
    // } else {
    //   for (let i = 0; i < addressData.length; i++) {
    //     if (addressData[i].value == selector.defaultAddress) {
    //       isAddressSelected = true;
    //     }
    //   }
    // }

    // if (!isAddressSelected){
    //   scrollToPos(2);
    //   setOpenAccordian("2");
    //   showToast("please select address");
    //   return;
    // };

    if (selector.urban_or_rural == 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter urban or rural");
      return;
    }
    if (selector.house_number.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter H.No");
      return;
    }
    if (selector.street_name.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter street name");
      return;
    }
    if (selector.village.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter village");
      return;
    }
    if (selector.mandal.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter mandal");
      return;
    }
    if (selector.city.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter city");
      return;
    }
    if (selector.district.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter district");
      return;
    }
    if (selector.state.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter state");
      return;
    }

    // Permanant Address fields
    if (selector.p_pincode.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter permanant pincode");
      return;
    }
    if (selector.p_urban_or_rural == 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter permanant urban or rural");
      return;
    }
    if (selector.p_houseNum.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter permanant H.No");
      return;
    }
    if (selector.p_streetName.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter permanant street name");
      return;
    }
    if (selector.p_village.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter permanant village");
      return;
    }
    if (selector.p_mandal.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter permanant mandal");
      return;
    }
    if (selector.p_city.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter permanant city");
      return;
    }
    if (selector.p_district.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter permanant district");
      return;
    }
    if (selector.p_state.length === 0) {
      scrollToPos(2);
      setOpenAccordian("2");
      showToast("please enter permanant state");
      return;
    }

    if (checkModelSelection()) {
      scrollToPos(3);
      setOpenAccordian("3");
      return;
    }
    //todo
    if (isMiniAmountCheck) {
      if (configureRuleData != "") {
        if (
          parseInt(configureRuleData.bookingAmount) >
          parseInt(selector.booking_amount)
        ) {
          setIsMinimumAmtModalVisible(true);
          return;
        } else {
          setIsMinimumAmtModalVisible(false);
        }
      }
    }

     const bookingAmount = parseInt(selector.booking_amount);
    if (bookingAmount <= 0) {
      scrollToPos(8);
      setOpenAccordian("8");
      showToast("please enter booking amount greater than 0");
      return;
    }

    let primaryTempCars = [];
    primaryTempCars = carModelsList.filter((item) => {
      return item.isPrimary === "Y";
    });
    if (!primaryTempCars.length > 0) {
      scrollToPos(4);
      setOpenAccordian("4");
      showToast("Select is Primary for atleast one vehicle");
      return;
    }

    // if (selector.enquiry_segment.toLowerCase() === "personal" && selector.marital_status.length == 0) {
    //     showToast("Please fill the martial status");
    //     return;
    // }
    // if (selector.form_or_pan.length == 0 ||
    //     selector.adhaar_number.length == 0
    //     ) {
    //     showToast("Please upload document section")
    //     }
    // if (
    //     selector.form_or_pan.length == 0 ||
    //     selector.adhaar_number.length == 0 ||
    //     // selector.relationship_proof.length == 0 ||
    //     selector.customer_type_category.length == 0
    // ) {
    //     showToast("please enter document upload section");
    // }

    // if (
    //   selector.adhaar_number.length > 0 &&
    //   !isMobileNumber(selector.adhaar_number)
    // ) {
    //   showToast("Please enter valid adhar number");
    //   return;
    // }

    if (selector.form_or_pan === "PAN" && userData.isTracker === "N") {
      let error = false;
      if (selector.pan_number.length == 0) {
        error = true;
      } else if (isCheckPanOrAadhaar("pan", selector.pan_number)) {
        error = true;
      }

      if (error) {
        scrollToPos(4);
        setOpenAccordian("4");
        showToast("please enter PAN Number");
        return;
      }
    }

    if (
      selector.enquiry_segment.toLowerCase() === "personal" &&
      isCheckPanOrAadhaar("aadhaar", selector.adhaar_number)
    ) {
      scrollToPos(4);
      setOpenAccordian("4");
      showToast("Please enter proper Aadhaar number");
      return;
    }

    if (taxPercent === "" && userData.isTracker == "N") {
      scrollToPos(5);
      setOpenAccordian("5");
      showToast("please enter Life Tax");
      return;
    }

    if (
      selector.enquiry_segment.toLowerCase() === "company" &&
      selector.customer_type.toLowerCase() === "institution" &&
      (selector.customer_type_category == "B2B" ||
        selector.customer_type_category == "B2C")
    ) {
      if (selector.gstin_number.length == 0) {
        // showToast("please enter GSTIN number");
      }
    }
    // if (selector.retail_finance.length === 0) {
    //     scrollToPos(7)
    //     setOpenAccordian('7')
    //     showToast("Please select retail finance");
    //     return;
    // }
    // if (selector.retail_finance == "Leasing") {
    //     if (selector.leashing_name.length == 0) {
    //         scrollToPos(7)
    //         setOpenAccordian('7')
    //         showToast("Please fill required fields in leasing name");
    //         return;
    //     }
    //     if (!isValidateAlphabetics(selector.leashing_name)) {
    //         showToast("Please enter proper leasing name");
    //         scrollToPos(7)
    //         setOpenAccordian('7')
    //         return;
    //     }
    // }

    if (selector.retail_finance.length === 0) {
      scrollToPos(7);
      setOpenAccordian("7");
      showToast("Please select Retail Finance");
      return;
    }

    // const bookingAmount = parseInt(selector.booking_amount);
    // if (bookingAmount < 5000) {
    //   scrollToPos(8);
    //   setOpenAccordian("8");
    //   showToast("please enter booking amount minimum 5000");
    //   return;
    // }

    if (selector.booking_payment_mode.length === 0) {
      scrollToPos(8);
      setOpenAccordian("8");
      showToast("Please enter Booking Payment Mode");
      return;
    }

    if (!selector.pre_booking_details_response.dmsLeadDto) {
      return;
    }
    setIsLoading(true);
    let postOnRoadPriceTable = {};
    postOnRoadPriceTable.additionalOffer1 = selector.additional_offer_1;
    postOnRoadPriceTable.additionalOffer2 = selector.additional_offer_2;
    postOnRoadPriceTable.cashDiscount = selector.cash_discount;
    postOnRoadPriceTable.corporateCheck = "";
    postOnRoadPriceTable.corporateName = "";
    postOnRoadPriceTable.corporateOffer = selector.corporate_offer;
    postOnRoadPriceTable.exShowroomPrice =
      priceInfomationData.ex_showroom_price;
    postOnRoadPriceTable.offerData = [];
    postOnRoadPriceTable.focAccessories = selector.for_accessories;
    postOnRoadPriceTable.insuranceDiscount = selector.insurance_discount;
    postOnRoadPriceTable.accessoriesDiscount = selector.accessories_discount;
    postOnRoadPriceTable.handlingCharges = handlingChargSlctd
      ? priceInfomationData.handling_charges
      : 0;
    postOnRoadPriceTable.essentialKit = essentialKitSlctd
      ? priceInfomationData.essential_kit
      : 0;
    postOnRoadPriceTable.fast_tag = fastTagSlctd
      ? priceInfomationData.fast_tag
      : 0;
    postOnRoadPriceTable.id = selector.on_road_price_dto_list_response.length
      ? selector.on_road_price_dto_list_response[0].id
      : 0;
    postOnRoadPriceTable.insuranceAddonData = selectedInsurenceAddons;
    postOnRoadPriceTable.insuranceAmount = selectedInsurencePrice;
    postOnRoadPriceTable.insuranceType = selector.insurance_type;
    postOnRoadPriceTable.lead_id =
      selector.pre_booking_details_response.dmsLeadDto.id;
    postOnRoadPriceTable.lifeTax = lifeTaxAmount;
    postOnRoadPriceTable.lifeTaxPercentage =
      taxPercent !== "" ? Number(taxPercent) / 100 : 0;
    postOnRoadPriceTable.onRoadPrice = totalOnRoadPrice;
    postOnRoadPriceTable.finalPrice = totalOnRoadPriceAfterDiscount;
    postOnRoadPriceTable.promotionalOffers = selector.promotional_offer;
    // postOnRoadPriceTable.registrationCharges =
    //   priceInfomationData.registration_charges;
    postOnRoadPriceTable.registrationCharges = selectedRegistrationCharges?.cost
      ? selectedRegistrationCharges?.cost
      : 0;
    postOnRoadPriceTable.registrationType = selectedRegistrationCharges?.name
      ? selectedRegistrationCharges?.name
      : "";
    postOnRoadPriceTable.specialScheme = selector.consumer_offer;
    postOnRoadPriceTable.exchangeOffers = selector.exchange_offer;
    postOnRoadPriceTable.tcs = tcsAmount;
    postOnRoadPriceTable.warrantyAmount = selectedWarrentyPrice;
    postOnRoadPriceTable.warrantyName = selector.warranty;
    postOnRoadPriceTable.otherPricesData = addNewInput;

    postOnRoadPriceTable.form_or_pan = selector.form_or_pan;

    postEvalutionForm();
    postFinanceForm();
    if (isEdit) {
      setIsLoading(true);
      Promise.all([
        dispatch(sendEditedOnRoadPriceDetails(postOnRoadPriceTable)),
      ])
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      Promise.all([dispatch(sendOnRoadPriceDetails(postOnRoadPriceTable))])
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
    // Promise.all([
    //     dispatch(sendOnRoadPriceDetails(postOnRoadPriceTable))
    // ]).then(async (res) => {
    //     let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    //     if (employeeData) {
    //         const jsonObj = JSON.parse(employeeData);
    //         const payload = {
    //             "refNo": selector.refNo,
    //             "orgId": jsonObj.orgId,
    //             "stageCompleted": "PREBOOKING"
    //         }
    //         dispatch(updateRef(payload))
    //     }
    // });
    if (route?.params?.lists && route?.params?.lists.names) {
      removeExistingKeysFromAsync(route?.params?.lists.names);
    }
    //         if(selector.loading){

    // setIsSubmitPress(false)
    //         }
  };

  const removeExistingKeysFromAsync = async (keys) => {
    await AsyncStorage.multiRemove(keys);
  };

  // Handle On Road Price Response
  useEffect(async () => {
    if (selector.send_onRoad_price_details_response) {
      if (!selector.pre_booking_details_response) {
        return;
      }

      let dmsContactOrAccountDto = {};
      let dmsLeadDto = {};
      let formData;

      const dmsEntity = selector.pre_booking_details_response;
      if (dmsEntity.hasOwnProperty("dmsContactDto"))
        dmsContactOrAccountDto = mapContactOrAccountDto(
          dmsEntity.dmsContactDto
        );
      else if (dmsEntity.hasOwnProperty("dmsAccountDto"))
        dmsContactOrAccountDto = mapContactOrAccountDto(
          dmsEntity.dmsAccountDto
        );

      if (dmsEntity.hasOwnProperty("dmsLeadDto"))
        dmsLeadDto = mapLeadDto(dmsEntity.dmsLeadDto);

      let selectedModel = [];
      selectedModel = carModelsList.filter((item) => item.isPrimary === "Y");
      dmsLeadDto.firstName = selector.first_name;
      dmsLeadDto.lastName = selector.last_name;
      dmsLeadDto.phone = selector.mobile;
      dmsLeadDto.email = selector.email;
      dmsLeadDto.model =
        selectedModel.length > 0 ? selectedModel[0].model : selector.model;
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );

      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let empObj = {
          branchId: jsonObj.branchs[0]?.branchId,
          modifiedBy: jsonObj.empName,
          orgId: jsonObj.orgId,
          ownerName: jsonObj.empName,
        };

        let tempAttachments = Object.assign([], dmsLeadDto.dmsAttachments);

        let imgObjArr = [];
        if (Object.keys(uploadedImagesDataObj).length > 0) {
          imgObjArr = Object.entries(uploadedImagesDataObj).map((e) => ({
            name: e[0],
            value: e[1],
          }));
        }

        for (let i = 0; i < imgObjArr.length; i++) {
          let isAvailable = false;
          for (let j = 0; j < tempAttachments.length; j++) {
            if (tempAttachments[j].documentType == imgObjArr[i].name) {
              let finalObj = {
                ...tempAttachments[j],
                documentPath: imgObjArr[i].value.documentPath,
                fileName: imgObjArr[i].value.fileName,
                keyName: imgObjArr[i].value.keyName,
                documentType: imgObjArr[i].name,
                createdBy: convertDateStringToMilliseconds(new Date()),
              };

              if (imgObjArr[i].name === "pan" && selector.pan_number) {
                finalObj.documentNumber = selector.pan_number;
              } else if (
                imgObjArr[i].name == "aadhar" &&
                selector.adhaar_number
              ) {
                finalObj.documentNumber = selector.adhaar_number;
              } else if (
                imgObjArr[i].name == "employeeId" &&
                selector.employee_id
              ) {
                finalObj.documentNumber = selector.employee_id;
              }

              tempAttachments[j] = Object.assign({}, finalObj);
              isAvailable = true;
              break;
            }
          }

          if (!isAvailable) {
            let newObj = {
              ...dmsAttachmentsObj,
              documentPath: imgObjArr[i].value.documentPath,
              fileName: imgObjArr[i].value.fileName,
              keyName: imgObjArr[i].value.keyName,
              documentType: imgObjArr[i].name,
              createdBy: convertDateStringToMilliseconds(new Date()),
              ...empObj,
            };

            if (imgObjArr[i].name === "pan" && selector.pan_number) {
              newObj.documentNumber = selector.pan_number;
            } else if (
              imgObjArr[i].name == "aadhar" &&
              selector.adhaar_number
            ) {
              newObj.documentNumber = selector.adhaar_number;
            } else if (
              imgObjArr[i].name == "employeeId" &&
              selector.employee_id
            ) {
              newObj.documentNumber = selector.employee_id;
            }

            tempAttachments.push(Object.assign({}, newObj));
          }
        }

        let panArr = tempAttachments.filter((item) => {
          return item.documentType === "pan";
        });

        let aadharArr = tempAttachments.filter((item) => {
          return item.documentType === "aadhar";
        });

        let empArr = tempAttachments.filter((item) => {
          return item.documentType === "employeeId";
        });

        // if pan number
        if (!panArr.length && selector.pan_number) {
          let newObj = {
            ...dmsAttachmentsObj,
            documentNumber: selector.pan_number,
            documentType: "pan",
            ...empObj,
          };
          tempAttachments.push(Object.assign({}, newObj));
        }

        // if aadhar number
        if (!aadharArr.length && selector.adhaar_number) {
          newObj = {
            ...dmsAttachmentsObj,
            documentNumber: selector.adhaar_number,
            documentType: "aadhar",
            ...empObj,
          };
          tempAttachments.push(Object.assign({}, newObj));
        }

        // if emp id
        if (!empArr.length && selector.employee_id) {
          newObj = {
            ...dmsAttachmentsObj,
            documentNumber: selector.employee_id,
            documentType: "employeeId",
            ...empObj,
          };
          tempAttachments.push(Object.assign({}, newObj));
        }

        dmsLeadDto.dmsAttachments = Object.assign([], tempAttachments);
      }

      if (
        selector.pre_booking_details_response.hasOwnProperty("dmsContactDto")
      ) {
        formData = {
          dmsContactDto: dmsContactOrAccountDto,
          dmsLeadDto: dmsLeadDto,
        };
      } else {
        formData = {
          dmsAccountDto: dmsContactOrAccountDto,
          dmsLeadDto: dmsLeadDto,
        };
      }

      setTypeOfActionDispatched("UPDATE_PRE_BOOKING");
      // dispatch(updatePrebookingDetailsApi(formData));
      Promise.all([dispatch(updatePrebookingDetailsApi(formData))]).then(
        async (res) => {
          let employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
          );
          if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
              refNo: selector.refNo,
              orgId: jsonObj.orgId,
              stageCompleted: "PREBOOKING",
            };
            dispatch(updateRef(payload));
          }
        }
      );
    }
  }, [selector.send_onRoad_price_details_response]);

  const approveOrRejectMethod = (type) => {
    if (!selector.pre_booking_details_response) {
      return;
    }
    let dmsEntity = { ...selector.pre_booking_details_response };
    let dmsLeadDto = { ...dmsEntity.dmsLeadDto };
    if (type === "APPROVE") {
      dmsLeadDto.leadStatus = "PREBOOKINGCOMPLETED";
    } else if (type === "REJECT") {
      if (selector.reject_remarks.length == 0) {
        showToast("Please enter reject remarks");
        return;
      }

      dmsLeadDto.leadStatus = "REJECTED";
      dmsLeadDto.remarks = selector.reject_remarks;
    }
    dmsEntity.dmsLeadDto = dmsLeadDto;
    setTypeOfActionDispatched(type);
    dispatch(updatePrebookingDetailsApi(dmsEntity));
  };

  // Handle Update Pre-Booking Details Response
  useEffect(() => {
    if (selector.update_pre_booking_details_response === "success") {
      dispatch(updateResponseStatus(""));
      if (typeOfActionDispatched === "DROP_ENQUIRY") {
        // showToastSucess("Successfully Pre-Booking Dropped");
        // getPreBookingListFromServer();
      } else if (typeOfActionDispatched === "UPDATE_PRE_BOOKING") {
        setIsLoading(false);
        submitOrgTags();
        showToastSucess("Successfully Sent for Manager Approval");
        goToLeadScreen();
      } else if (typeOfActionDispatched === "APPROVE") {
        setIsLoading(false);
        showToastSucess("Booking Approval Approved");
        goToLeadScreen();
      } else if (typeOfActionDispatched === "REJECT") {
        showToastSucess("Booking Approval Rejected");
        goToLeadScreen();
      }
    }
  }, [selector.update_pre_booking_details_response]);

  const submitOrgTags = () => {
    const { leadId } = enqDetails;
    let newArr = [];
    if (selector.orgTagListById.length > 0) {
      for (let i = 0; i < selector.orgTagListById.length; i++) {
        const element = selector.orgTagListById[i];
        let defaultObj = {
          id: element.id,
          leadId: leadId,
          universalId: universalId,
          isActive: selectedTags.includes(element.tagName) ? "Y" : "N",
          tagName: element.tagName,
          createdDatetime: element.createdDatetime,
          updatedDatetime: moment().format(orgTagDateFormate),
        };
        newArr.push(defaultObj);
      }
    } else {
      let defaultObj = {
        leadId: leadId,
        universalId: universalId,
        isActive: "N",
        createdDatetime: moment().format(orgTagDateFormate),
        updatedDatetime: moment().format(orgTagDateFormate),
      };

      newArr = [
        { ...defaultObj, tagName: "VIP" },
        { ...defaultObj, tagName: "HNI" },
        { ...defaultObj, tagName: "SPL" },
      ];

      if (selectedTags.includes("VIP")) {
        payloadArr[0].isActive = "Y";
      }
      if (selectedTags.includes("HNI")) {
        payloadArr[1].isActive = "Y";
      }
      if (selectedTags.includes("SPL")) {
        payloadArr[2].isActive = "Y";
      }
    }
    dispatch(postOrgTags(newArr));
  };

  useEffect(() => {
    try {
      if (selector.dmsLeadProducts && selector.dmsLeadProducts.length > 0) {
        addingIsPrimary();
      }
    } catch (error) {
      // alert("useeffect"+error)
    }
  }, [selector.dmsLeadProducts]);

  const addingIsPrimary = async () => {
    try {
      let array = await [...selector.dmsLeadProducts];
      for (let i = 0; i < selector.dmsLeadProducts.length; i++) {
        var item = await array[i];
        // if (i == 0) {
        //     item = await {
        //         "color": item.color,
        //         "fuel": item.fuel,
        //         "id": item.id,
        //         "model": item.model,
        //         "transimmisionType": item.transimmisionType,
        //         "variant": item.variant,
        //         "isPrimary": true
        //     }
        //     // updateVariantModelsData(item.model, true, item.variant);
        // }
        // else {
        //     item = await {
        //         "color": item.color,
        //         "fuel": item.fuel,
        //         "id": item.id,
        //         "model": item.model,
        //         "transimmisionType": item.transimmisionType,
        //         "variant": item.variant,
        //         "isPrimary": false
        //     }
        // }
        var isPrimary = "N";
        if (item.isPrimary && item.isPrimary != null)
          isPrimary = item.isPrimary;
        item = await {
          color: item.color,
          fuel: item.fuel,
          id: item.id,
          model: item.model,
          transimmisionType: item.transimmisionType,
          variant: item.variant,
          isPrimary: isPrimary,
        };
        array[i] = await item;
        if (
          item.isPrimary &&
          item.isPrimary != null &&
          item.isPrimary === "Y"
        ) {
          await setIsPrimaryCurrentIndex(i);
          updateVariantModelsData(item.model, true, item.variant);
        }

        if (i === selector.dmsLeadProducts.length - 1) {
          let index = array.findIndex(
            (item) =>
              item.model ===
              selector.pre_booking_details_response?.dmsLeadDto?.model
          );
          if (index !== -1) {
            // array[index].isPrimary = "Y"
          }
        }
      }

      let findPrimaryData = array.filter((item) => item.isPrimary === "Y");

      getConfigureRulesDetails(
        findPrimaryData[0].model,
        findPrimaryData[0].variant,
        findPrimaryData[0].fuel,
        userData.orgId
      );
      await setCarModelsList(array);
    } catch (error) {}
  };
  const mapContactOrAccountDto = (prevData) => {
    let dataObj = { ...prevData };
    dataObj.salutation = selector.salutation;
    dataObj.firstName = selector.first_name;
    dataObj.lastName = selector.last_name;
    dataObj.phone = selector.mobile;
    dataObj.email = selector.email;
    dataObj.gender = selector.gender;
    dataObj.dateOfBirth = convertDateStringToMillisecondsUsingMoment(
      selector.date_of_birth
    );
    dataObj.age = selector.age ? Number(selector.age) : 0;
    dataObj.customerType = selector.customer_type;
    dataObj.buyerType = selector.buyer_type;
    return dataObj;
  };

  const mapLeadDto = (prevData) => {
    let dataObj = { ...prevData };
    dataObj.enquirySegment = selector.enquiry_segment;
    dataObj.buyerType = selector.buyer_type;
    dataObj.maritalStatus = selector.marital_status;
    dataObj.occasion = selector.occasion;

    dataObj.commitmentDeliveryPreferredDate =
      convertDateStringToMillisecondsUsingMoment(
        selector.customer_preferred_date
      );
    dataObj.commitmentDeliveryTentativeDate =
      convertDateStringToMillisecondsUsingMoment(
        selector.tentative_delivery_date
      );
    dataObj.otherVehicleRcNo = selector.vehicle_type;
    dataObj.otherVehicleType = selector.registration_number;
    dataObj.gstNumber = selector.gstin_number;
    dataObj.customerCategoryType = selector.customer_type_category;
    dataObj.documentType = selector.form_or_pan;

    dataObj.leadStatus = "SENTFORAPPROVAL";
    dataObj.leadStage = "PREBOOKING";
    dataObj.dmsAddresses = mapDMSAddress(dataObj.dmsAddresses);
    dataObj.dmsLeadProducts = mapLeadProducts(dataObj.dmsLeadProducts);
    dataObj.dmsfinancedetails = mapDmsFinanceDetails(dataObj.dmsfinancedetails);
    dataObj.dmsBooking = mapDmsBookingDetails(dataObj.dmsBooking, dataObj.id);
    dataObj.dmsAttachments = mapDmsAttachments(dataObj.dmsAttachments);
    dataObj.dmsAccessories = [
      ...selectedPaidAccessoriesList,
      ...selectedFOCAccessoriesList,
    ];
    return dataObj;
  };

  const mapDMSAddress = (prevDmsAddresses) => {
    let dmsAddresses = [...prevDmsAddresses];
    if (dmsAddresses.length == 2) {
      dmsAddresses.forEach((address, index) => {
        let dataObj = { ...address };
        if (address.addressType === "Communication") {
          dataObj.pincode = selector.pincode;
          dataObj.houseNo = selector.house_number;
          dataObj.street = selector.street_name;
          dataObj.village = selector.village;
          dataObj.mandal = selector.mandal;
          dataObj.city = selector.city;
          dataObj.district = selector.district;
          dataObj.state = selector.state;
          dataObj.urban = selector.urban_or_rural === 1 ? true : false;
          dataObj.rural = selector.urban_or_rural === 2 ? true : false;
        } else if (address.addressType === "Permanent") {
          dataObj.pincode = selector.p_pincode;
          dataObj.houseNo = selector.p_houseNum;
          dataObj.street = selector.p_streetName;
          dataObj.village = selector.p_village;
          dataObj.mandal = selector.p_mandal;
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
  };

  const mapLeadProducts = (prevDmsLeadProducts) => {
    let dmsLeadProducts = [...prevDmsLeadProducts];
    let dataObj = {};
    // if (dmsLeadProducts.length > 0) {
    //     dataObj = { ...dmsLeadProducts[0] };
    // }
    // dataObj.model = selector.model;
    // dataObj.variant = selector.varient;
    // dataObj.color = selector.color;
    // dataObj.fuel = selector.fuel_type;
    // dataObj.transimmisionType = selector.transmission_type;
    // dmsLeadProducts[0] = dataObj;
    let selectedModel = [],
      tempCarModels = [...carModelsList],
      index = -1;
    selectedModel = carModelsList.filter((item) => item.isPrimary === "Y");
    index = carModelsList.findIndex((item) => item.isPrimary === "Y");
    tempCarModels.splice(index, 1);
    tempCarModels.unshift(selectedModel[0]);
    dmsLeadProducts = tempCarModels;
    return dmsLeadProducts;
  };

  const mapDmsFinanceDetails = (prevDmsFinancedetails) => {
    let dmsfinancedetails = [...prevDmsFinancedetails];
    let dataObj = {};
    if (dmsfinancedetails.length > 0) {
      dataObj = { ...dmsfinancedetails[0] };
    }
    dataObj.financeType = selector.retail_finance;
    dataObj.financeCategory = selector.finance_category;
    dataObj.downPayment = selector.down_payment;
    dataObj.loanAmount = selector.loan_amount
      ? Number(selector.loan_amount)
      : null;
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
  };

  const mapDmsBookingDetails = (preDmsBooking, leadId) => {
    let dmsBooking = { ...preDmsBooking };
    dmsBooking.id = dmsBooking.id ? dmsBooking.id : 0;
    dmsBooking.leadId = leadId;
    dmsBooking.bookingAmount = Number(selector.booking_amount);
    let trimStr = selector.payment_at.replace(/\s+/g, "");
    dmsBooking.paymentAt = trimStr;
    let trimStr2 = selector.booking_payment_mode.replace(/\s+/g, "");
    dmsBooking.modeOfPayment = trimStr2;
    dmsBooking.otherVehicle = selector.vechicle_registration;
    dmsBooking.deliveryLocation = selector.delivery_location;
    return dmsBooking;
  };

  const mapDmsAttachments = (prevDmsAttachments) => {
    let dmsAttachments = [...prevDmsAttachments];
    if (dmsAttachments.length > 0) {
      dmsAttachments.forEach((obj, index) => {
        const item = uploadedImagesDataObj[obj.documentType];
        let finalObj = {};
        if (item) {
          finalObj = formatAttachment(
            { ...obj },
            item,
            index,
            obj.documentType
          );
        } else {
          let subItem = {
            documentType: obj.documentType,
            documentPath: "",
            keyName: "",
            fileName: "",
          };
          finalObj = formatAttachment(
            { ...obj },
            subItem,
            index,
            obj.documentType
          );
        }
      });
    } else {
      Object.keys(uploadedImagesDataObj).forEach((key, index) => {
        const item = uploadedImagesDataObj[key];
        const object = formatAttachment({}, item, index, item.documentType);
        dmsAttachments.push(object);
      });
    }
    return dmsAttachments;
  };

  const formatAttachment = (data, photoObj, index, typeOfDocument) => {
    let object = { ...data };
    object.branchId = selectedBranchId;
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
      case "form60":
        object.documentNumber = selector.pan_number;
        break;
      case "REGDOC":
        object.documentNumber = selector.r_reg_no;
        break;
      case "employeeId":
        object.documentNumber = selector.employee_id;
        break;
    }
    return object;
  };

  const proceedToCancelPreBooking = () => {
    if (dropRemarks.length === 0 || dropReason.length === 0) {
      showToastRedAlert("Please enter details for drop");
      scrollToPos(10);
      setOpenAccordian("10");
      return;
    }
    if (!selector.pre_booking_details_response) {
      return;
    }
    let enquiryDetailsObj = { ...selector.pre_booking_details_response };
    let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
    dmsLeadDto.leadStage = "DROPPED";
    enquiryDetailsObj.dmsLeadDto = dmsLeadDto;

    let leadId = selector.pre_booking_details_response.dmsLeadDto.id;
    if (!leadId) {
      showToast("lead id not found");
      return;
    }

    const payload = {
      dmsLeadDropInfo: {
        additionalRemarks: dropRemarks,
        branchId: Number(selectedBranchId),
        brandName: dropBrandName,
        dealerName: dropDealerName,
        location: dropLocation,
        model: dropModel,
        leadId: leadId,
        crmUniversalId: universalId,
        lostReason: dropReason,
        organizationId: userData.orgId,
        otherReason: "",
        droppedBy: userData.employeeId,
        lostSubReason: dropSubReason,
        stage: "PREBOOKING",
        status: "PREBOOKING",
      },
    };
    setTypeOfActionDispatched("DROP_ENQUIRY");
    dispatch(dropPreBooingApi(payload));
    dispatch(updatePrebookingDetailsApi(enquiryDetailsObj));
  };

  useEffect(() => {
    if (selector.pre_booking_drop_response_status === "success") {
      Alert.alert(
        "Sent For Approval",
        `Pre Booking Number: ${selector.refNo}`,
        [
          {
            text: "OK",
            onPress: () => {
              goToLeadScreen();
            },
          },
        ]
      );
    }
  }, [selector.pre_booking_drop_response_status]);

  const proceedToBookingClicked = async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (
        selector.pre_booking_details_response.dmsLeadDto.salesConsultant ==
        jsonObj.empName
      ) {
        let leadId = selector.pre_booking_details_response.dmsLeadDto.id;
        if (!leadId) {
          showToast("lead id not found");
          return;
        }

        let bookingId =
          selector.pre_booking_details_response.dmsLeadDto.dmsBooking.id;
        if (!bookingId) {
          showToast("lead id not found");
          return;
        }

        if (!uploadedImagesDataObj.hasOwnProperty("receipt")) {
          scrollToPos(12);
          setOpenAccordian("12");
          showToast("Please upload receipt doc");
          return;
        }
        
        const paymentMode = selector.booking_payment_mode.replace(/\s/g, "");
        let paymentDate = "";
        if (paymentMode === "InternetBanking") {
          paymentDate = convertDateStringToMillisecondsUsingMoment(
            selector.transaction_date
          );
        } else if (paymentMode === "Cheque") {
          paymentDate = convertDateStringToMillisecondsUsingMoment(
            selector.cheque_date
          );
        } else if (paymentMode === "DD") {
          paymentDate = convertDateStringToMillisecondsUsingMoment(
            selector.dd_date
          );
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
        dispatch(preBookingPaymentApi(payload));
      } else {
        alert("Permission Denied");
        // Alert.alert(
        //     'Permission Denied',
        //     [
        //         {
        //             text: 'OK',
        //         }
        //     ],
        //     { cancelable: false }
        // );
      }
    }
  };

  // 1. payment, lead, booking

  // Handle Payment Response
  useEffect(() => {
    if (selector.pre_booking_payment_response_status === "success") {
      sendBookingAmount();
    } else if (selector.pre_booking_payment_response_status === "failed") {
      showToastRedAlert("Something went wrong");
    }
  }, [selector.pre_booking_payment_response_status]);

  const sendBookingAmount = () => {
    let leadId = selector.pre_booking_details_response.dmsLeadDto.id;
    if (!leadId) {
      showToast("lead id not found");
      return;
    }

    let bookingAmount =
      selector.pre_booking_details_response.dmsLeadDto.dmsBooking.bookingAmount;
    if (!bookingAmount) {
      showToast("lead id not found");
      return;
    }

    let payload = {};
    if (
      selector.existing_booking_amount_response &&
      selector.existing_booking_amount_response.length > 0
    ) {
      payload = { ...selector.existing_booking_amount_response[0] };
    }
    payload.id = payload.id ? payload.id : 0;
    payload.paymentName = "Booking Advance Amount";
    payload.amount = bookingAmount;
    payload.leadId = leadId;
    payload.receiptDate = convertDateStringToMilliseconds(new Date());

    const finalPayload = [payload];
    dispatch(postBookingAmountApi(finalPayload));
  };

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
    if (
      selector.assigned_tasks_list_status === "success" &&
      selector.assigned_tasks_list
    ) {
      if (selector.assigned_tasks_list.length > 0) {
        const filteredAry = selector.assigned_tasks_list.filter(
          (item) => item.taskName === "Proceed to Booking"
        );
        if (filteredAry.length == 0) {
          return;
        }
        const taskData = filteredAry[0];
        const taskId = taskData.taskId;
        const taskStatus = taskData.taskStatus;
        dispatch(getTaskDetailsApi(taskId));
        // dispatch(clearState());
        // clearLocalData();
        // navigation.navigate(AppNavigator.EmsStackIdentifiers.proceedToBooking, {
        //   identifier: "PROCEED_TO_BOOKING",
        //   taskId,
        //   universalId,
        //   taskStatus,
        //   taskData: taskData,
        // });
      }
    } else if (selector.assigned_tasks_list_status === "failed") {
      showToastRedAlert("Something went wrong");
    }
  }, [selector.assigned_tasks_list_status]);

  // ================ PROCEED TO BOOKING ====================== //
  useEffect(() => {
    getCurrentLocation();
    if (universalId) {
      dispatch(getEnquiryDetailsApi(universalId));
    }
    return () => {
      dispatch(clearBookingState());
      isChangedModelPrimary = true;
    };
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition((info) => {
      setCurrentLocation({
        lat: info.coords.latitude,
        long: info.coords.longitude,
      });
    });
  };

  useEffect(() => {
    if (selectorBooking.task_details_response) {
      setTypeOfActionDispatched("PROCEED_TO_PREBOOKING");
      let taskId = "";
      if (selector.assigned_tasks_list.length > 0) {
        const filteredAry = selector.assigned_tasks_list.filter(
          (item) => item.taskName === "Proceed to Booking"
        );
        if (filteredAry.length == 0) {
          return;
        }
        const taskData = filteredAry[0];
        taskId = taskData.taskId;
      }

      if (selectorBooking.task_details_response?.taskId !== taskId) {
        return;
      }

      if (isProceedToBookingClicked) {
        isProceedToBookingClicked = false;
        proceedToPreBookingClicked();
      }
    }
  }, [selectorBooking.task_details_response]);

  const proceedToPreBookingClicked = async () => {
    const newTaskObj = { ...selectorBooking.task_details_response };
    newTaskObj.taskStatus = "CLOSED";
    newTaskObj.lat = currentLocation ? currentLocation.lat.toString() : null;
    newTaskObj.lon = currentLocation ? currentLocation.long.toString() : null;
    dispatch(updateTaskApi(newTaskObj));
  };

  useEffect(() => {
    if (selectorBooking.update_task_response_status === "success") {
      const endUrl = `${universalId}` + "?" + "stage=BOOKING";
      dispatch(changeEnquiryStatusApi(endUrl));
    } else if (selectorBooking.update_task_response_status === "failed") {
      showToastRedAlert("something went wrong");
    }
  }, [selectorBooking.update_task_response_status]);

  useEffect(() => {
    if (selectorBooking.change_enquiry_status === "success") {
      callCustomerLeadReferenceApi();
    } else if (selectorBooking.change_enquiry_status === "failed") {
      showToastRedAlert("something went wrong");
    }
  }, [selectorBooking.change_enquiry_status]);

  const callCustomerLeadReferenceApi = async () => {
    const payload = {
      branchid: userData.branchId,
      leadstage: "BOOKING",
      orgid: userData.orgId,
      universalId: universalId,
    };
    const url = URL.CUSTOMER_LEAD_REFERENCE();

    // await fetch(url, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "auth-token": authToken,
    //   },
    //   method: "POST",
    //   body: JSON.stringify(payload),
    // })
    await client
      .post(url, payload)
      .then((res) => res.json())
      .then((jsonRes) => {
        if (jsonRes.success === true) {
          if (jsonRes.dmsEntity?.leadCustomerReference) {
            const refNumber =
              jsonRes.dmsEntity?.leadCustomerReference.referencenumber;
            updateEnuiquiryDetails(refNumber);
          }
        }
      })
      .catch((err) => console.error(err));
  };

  const updateEnuiquiryDetails = (refNumber) => {
    if (!selectorBooking.enquiry_details_response) {
      return;
    }

    let enquiryDetailsObj = { ...selectorBooking.enquiry_details_response };
    let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
    dmsLeadDto.leadStage = "BOOKING";
    dmsLeadDto.referencenumber = refNumber;
    dmsLeadDto.dmsAttachments = mapDmsAttachments([]);
    enquiryDetailsObj.dmsLeadDto = dmsLeadDto;
    dispatch(updateEnquiryDetailsApi(enquiryDetailsObj));
  };

  useEffect(() => {
    if (
      selectorBooking.update_enquiry_details_response_status === "success" &&
      selectorBooking.update_enquiry_details_response
    ) {
      displayCreateEnquiryAlert(
        selectorBooking.update_enquiry_details_response.dmsLeadDto
          .referencenumber
      );
    } else if (
      selectorBooking.update_enquiry_details_response_status === "failed"
    ) {
      showToastRedAlert("something went wrong");
    }
  }, [
    selectorBooking.update_enquiry_details_response_status,
    selectorBooking.update_enquiry_details_response,
  ]);

  const displayCreateEnquiryAlert = (refNum) => {
    Alert.alert(
      `Booking Successfully Created`,
      `Ref Num: ${refNum}`,
      [
        {
          text: "OK",
          onPress: () => goToParentScreen(),
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  const goToParentScreen = () => {
    navigation.popToTop();
    navigation.navigate("EMS_TAB");
    navigation.navigate(EmsTopTabNavigatorIdentifiers.leads, {
      fromScreen: "booking",
    });
    dispatch(clearState());
    clearLocalData();
    dispatch(clearBookingState());
  };

  // ========================== //
  // ========================== //
  // ========================== //

  const updatePaidAccessroies = (tableData) => {
    let totalPrice = 0,
      totFoc = 0,
      totMrp = 0;
    let newFormatSelectedAccessories = [];
    let newFormatSelectedFOCAccessories = [];
    let tempPaidAcc = [];
    // selectedPaidAccessoriesList.forEach((item) => {
    //     totalPrice += Number(item.amount);
    //     if (item.dmsAccessoriesType === 'FOC') {
    //         totFoc += Number(item.amount);
    //         // totMrp += item.cost
    //     }
    //     if (item.dmsAccessoriesType !== 'FOC') {
    //         totMrp += Number(item.amount);
    //     }
    // });
    // selectedFOCAccessoriesList.forEach((item) => {
    //     totalPrice += Number(item.amount);
    //     if (item.dmsAccessoriesType === 'FOC') {
    //         totFoc += Number(item.amount);
    //         // totMrp += item.cost
    //     }
    //     // if (item.dmsAccessoriesType !== 'FOC') {
    //     //     totMrp += Number(item.amount);
    //     // }
    // });
    tableData.forEach((item) => {
      if (item.selected) {
        totalPrice += item.cost;
        if (item.item === "FOC") {
          totFoc += item.cost;
          // totMrp += item.cost
          newFormatSelectedAccessories.push({
            id: item.id,
            amount: item.cost,
            partName: item.partName,
            accessoriesName: item.partName,
            leadId: selector?.pre_booking_details_response?.dmsLeadDto?.id,
            allotmentStatus: null,
            dmsAccessoriesType: item.item,
          });
        }
        if (item.item !== "FOC") {
          totMrp += item.cost;
          newFormatSelectedAccessories.push({
            id: item.id,
            amount: item.cost,
            partName: item.partName,
            accessoriesName: item.partName,
            leadId: selector?.pre_booking_details_response?.dmsLeadDto?.id,
            allotmentStatus: null,
            dmsAccessoriesType: item.item,
          });
          tempPaidAcc.push({
            id: item.id,
            amount: item.cost,
            partName: item.partName,
            accessoriesName: item.partName,
            leadId: selector?.pre_booking_details_response?.dmsLeadDto?.id,
            allotmentStatus: null,
            dmsAccessoriesType: item.item,
          });
        }
      }
    });
    setSelectedPaidAccessoriesPrice(totMrp);
    // setSelectedFOCAccessoriesPrice(totFoc);
    if (totFoc > 0) {
      setFocPrice(totFoc);
    } else {
      dispatch(
        setOfferPriceDetails({
          key: "FOR_ACCESSORIES",
          text: "",
        })
      );
    }
    // if (totMrp > 0){
    //     setMrpPrice(totMrp)
    // }
    setMrpPrice(totMrp);
    setSelectedPaidAccessoriesList([...newFormatSelectedAccessories]);
    setPaidAccessoriesListNew([...tempPaidAcc]);
    // setSelectedFOCAccessoriesList([...newFormatSelectedFOCAccessories]);
  };

  const getLifeTax = () => {
    switch (selector.enquiry_segment) {
      case "Handicapped":
        return selector.vechicle_registration === true ? 1000 : 500;
      case "Personal":
        return selector.vechicle_registration === true
          ? priceInfomationData.ex_showroom_price * 0.14
          : priceInfomationData.ex_showroom_price * 0.12;
      default:
        return priceInfomationData.ex_showroom_price * 0.14;
    }
  };

  const getLifeTaxNew = (val) => {
    return priceInfomationData.ex_showroom_price * (val / 100);
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

  const GetPaidAccessoriesListFromServer = (vehicleId, orgId, token) => {
    // Paid Accessores List
    GetPaidAccessoriesList(vehicleId, orgId, token).then(
      (res) => {
        setPaidAccessoriesList([...res]);
      },
      (err) => {
        console.error("Paid Accossories List: ", err);
      }
    );
  };

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
    const fileNameArry = photoUri
      .substring(photoUri.lastIndexOf("/") + 1)
      .split(".");
    // const fileName = fileNameArry.length > 0 ? fileNameArry[0] : "None";
    const fileName = uuid.v4();
    formData.append("file", {
      name: `${fileName}-.${fileType}`,
      type: `image/${fileType}`,
      uri: Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri,
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
      case "UPLOAD_EMPLOYEE_ID":
        formData.append("documentType", "employeeId");
        break;
      case "UPLOAD_3_MONTHS_PAYSLIP":
        formData.append("documentType", "payslips");
        break;
      case "UPLOAD_PATTA_PASS_BOOK":
        formData.append("documentType", "pattaPassBook");
        break;
      case "UPLOAD_PENSION_LETTER":
        formData.append("documentType", "pensionLetter");
        break;
      case "UPLOAD_IMA_CERTIFICATE":
        formData.append("documentType", "imaCertificate");
        break;
      case "UPLOAD_LEASING_CONFIRMATION":
        formData.append("documentType", "leasingConfirmationLetter");
        break;
      case "UPLOAD_ADDRESS_PROOF":
        formData.append("documentType", "address");
        break;
      default:
        formData.append("documentType", "default");
        break;
    }

    await fetch(URL.UPLOAD_DOCUMENT(), {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + authToken,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          const dataObj = { ...uploadedImagesDataObj };
          dataObj[response.documentType] = response;
          setUploadedImagesDataObj({ ...dataObj });
          setIsReciptDocUpload(true);
        }
      })
      .catch((error) => {
        showToastRedAlert(
          error.message ? error.message : "Something went wrong"
        );
      });
  };

  const deteleButtonPressed = (from) => {
    const imagesDataObj = { ...uploadedImagesDataObj };
    switch (from) {
      case "PAN":
        delete imagesDataObj.pan;
        break;
      case "FORM60":
        delete imagesDataObj.form60;
        break;
      case "AADHAR":
        delete imagesDataObj.aadhar;
        break;
      case "RELATION_PROOF":
        delete imagesDataObj.relationshipProof;
        break;
      case "RECEIPT":
        delete imagesDataObj.receipt;
        break;
      case "EMPLOYEE_ID":
        delete imagesDataObj.employeeId;
        break;
      case "3_MONTHS_PAYSLIP":
        delete imagesDataObj.payslips;
        break;
      case "PATTA_PASS_BOOK":
        delete imagesDataObj.pattaPassBook;
        break;
      case "PENSION_LETTER":
        delete imagesDataObj.pensionLetter;
        break;
      case "IMA_CERTIFICATE":
        delete imagesDataObj.imaCertificate;
        break;
      case "LEASING_CONFIRMATION":
        delete imagesDataObj.leasingConfirmationLetter;
        break;
      case "ADDRESS_PROOF":
        delete imagesDataObj.address;
        break;
      default:
        break;
    }
    setUploadedImagesDataObj({ ...imagesDataObj });
  };

  const DisplaySelectedImage = ({ fileName, from }) => {
    return (
      <View style={styles.selectedImageBckVw}>
        <Text style={styles.selectedImageTextStyle} numberOfLines={1}>
          {fileName}
        </Text>
        <IconButton
          icon="close-circle-outline"
          color={Colors.RED}
          style={{ padding: 0, margin: 0 }}
          size={15}
          onPress={() => deteleButtonPressed(from)}
        />
      </View>
    );
  };

  const emiCal = (principle, tenure, interestRate) => {
    const amount = emiCalculator(principle, tenure, interestRate);
    dispatch(setFinancialDetails({ key: "EMI", text: amount }));
  };

  const updateAddressDetails = (pincode) => {
    if (pincode.length != 6) {
      return;
    }

    PincodeDetailsNew(pincode).then(
      (res) => {
        // dispatch an action to update address
        let tempAddr = [];
        if (res) {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData([...tempAddr]);
              }
            }
          }
        }
        // dispatch(updateAddressByPincode(resolve));
      },
      (rejected) => {}
    );
  };

  const updateAddressDetails2 = (pincode) => {
    if (pincode.length != 6) {
      return;
    }

    PincodeDetailsNew(pincode).then(
      (res) => {
        // dispatch an action to update address
        let tempAddr = [];
        if (res) {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData2([...tempAddr]);
              }
            }
          }
        }
        // dispatch(updateAddressByPincode(resolve));
      },
      (rejected) => {}
    );
  };

  if (!componentAppear) {
    return (
      <View style={styles.initialContainer}>
        <AnimLoaderComp visible={true} />
      </View>
    );
  }

  const randomNumberGenerator = () => {
    return Math.floor(Math.random() * 1000);
  };

  const addHandler = () => {
    let isEmpty = false;
    let toast = "please enter name";
    if (addNewInput.length > 0) {
      for (let i = 0; i < addNewInput.length; i++) {
        if (addNewInput[i].name == "") {
          setOtherPriceErrorAmountIndex(null);
          setOtherPriceErrorNameIndex(i);
          isEmpty = true;
          break;
        } else if (addNewInput[i].amount == "") {
          setOtherPriceErrorNameIndex(null);
          setOtherPriceErrorAmountIndex(i);
          toast = "please enter amount";
          isEmpty = true;
          break;
        }
      }
    }

    if (isEmpty) {
      showToast(toast);
      return;
    }
    setOtherPriceErrorAmountIndex(null);
    setOtherPriceErrorNameIndex(null);
    setAddNewInput([...addNewInput, { name: "", amount: "" }]);
  };

  const deleteHandler = (index) => {
    let newArr = Object.assign([], addNewInput);
    if (newArr[index]?.amount) {
      var amt = newArr[index].amount;
      setOtherPrices(otherPrices - Number(amt));
    }
    newArr.splice(index, 1);
    setAddNewInput(Object.assign([], newArr));
  };

  const inputHandlerName = (value, index) => {
    let newArr = Object.assign([], addNewInput);
    newArr[index].name = value;
    setAddNewInput(Object.assign([], newArr));
  };

  const inputHandlerPrice = (value, index) => {
    let newArr = Object.assign([], addNewInput);
    newArr[index].amount = value;
    setAddNewInput(Object.assign([], newArr));
  };

  const getActualPrice = () => {
    let amount = Number(totalOnRoadPrice) + Number(otherPrices);
    return amount;
  };

  const getActualPriceAfterDiscount = () => {
    let amount = Number(totalOnRoadPriceAfterDiscount) + Number(otherPrices);
    return amount;
  };

  const checkIsError = (type, index) => {
    let isError = false;
    if (type == "amount") {
      if (
        otherPriceErrorAmountIndexInput != null &&
        otherPriceErrorAmountIndexInput == index
      ) {
        isError = true;
      }
    } else {
      if (
        otherPriceErrorNameIndex != null &&
        otherPriceErrorNameIndex == index
      ) {
        isError = true;
      }
    }
    return isError;
  };

  const renderMinimumAmountModal = () => {
    //todo
    return (
      <Modal
        animationType="fade"
        visible={isMinimumAmtModalVisible}
        // onRequestClose={() => {
        //   setImagePath("");
        // }}
        transparent={true}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
            flex: 1,
            paddingHorizontal: 10,
          }}
        >
          <View
            style={{
              width: "100%",
              height: "20%",
              backgroundColor: Colors.WHITE,
              paddingHorizontal: 10,
              borderRadius: 10,
              justifyContent: "flex-start",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="cancel" size={60} color={Colors.BLACK} />

              <View style={{ flexDirection: "column" }}>
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                  <Text
                    style={{
                      color: Colors.BLACK,
                      fontSize: 16,
                      fontWeight: "700",
                      marginEnd: 10,
                      marginBottom: 1,
                    }}
                  >
                    Minimum Booking Amount Alert
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsMinimumAmtModalVisible(false);
                      setisMiniAmountCheck(false);
                    }}
                  >
                    <Entypo name="cross" size={20} color={Colors.BLACK} />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    color: Colors.BLACK,
                    fontSize: 14,
                    width: "30%",
                    fontWeight: "700",
                  }}
                >
                  For the selected vehicle Minimum booking amount{" "}
                  {configureRuleData.bookingAmount} Rs/-, but entered booking
                  amount not equal to minimum booking amount slab
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const onDropDownClear = (key) => {
    if (key) {
      if (key === "REGISTRATION_CHARGES") {
        setSelectedRegistrationCharges({});
      } else if (key === "INSURANCE_TYPE") {
        setSelectedInsurencePrice(0);
      } else if (key === "INSURENCE_ADD_ONS") {
        setSelectedAddOnsPrice(0);
        setSelectedInsurenceAddons([]);
      } else if (key === "WARRANTY") {
        setSelectedWarrentyPrice(0);
      }
      dispatch(setDropDownData({ key: key, value: "", id: "" }));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
      <LoaderComponent visible={isLoading} />
      {renderMinimumAmountModal()}
      <ImagePickerComponent
        visible={selector.showImagePicker}
        keyId={selector.imagePickerKeyId}
        onDismiss={() => dispatch(setImagePicker(""))}
        selectedImage={(data, keyId) => {
          uploadSelectedImage(data, keyId);
        }}
        // onDismiss={() => dispatch(setImagePicker(""))}
      />

      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        disabledData={addNewInput}
        multiple={showMultipleDropDownData}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (showMultipleDropDownData && dropDownKey === "SELECT_TAG") {
            setTagList([...item]);
            let names = [];
            let selectedNames = [];

            if (item.length > 0) {
              setIsSubmitPress(false);
              item.forEach((obj) => {
                if (obj.selected != undefined && obj.selected == true) {
                  names.push(obj.name);
                }
              });
              selectedNames = names?.join(", ");
            } else {
              setIsSubmitPress(true);
            }

            setSelectedTags(selectedNames);
            setShowDropDownModel(false);
          } else {
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
              setSelectedRegistrationCharges(item);
              let totalCost = 0;
              let names = "";
              let insurenceAddOns = [];
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
            } else if (dropDownKey === "REGISTRATION_CHARGES") {
              setSelectedRegistrationCharges(item);
            } else if (dropDownKey === "OTHER_PRICES") {
              inputHandlerName(item.name, otherPriceDropDownIndex);
            }

            if (
              selector.retail_finance !== item.name &&
              dropDownKey === "RETAIL_FINANCE"
            ) {
              dispatch(
                setFinancialDetails({ key: "BANK_R_FINANCE_NAME", text: "" })
              );
              dispatch(setFinancialDetails({ key: "LOAN_AMOUNT", text: "" }));
              dispatch(
                setFinancialDetails({ key: "RATE_OF_INTEREST", text: "" })
              );
            }

            dispatch(
              setDropDownData({
                key: dropDownKey,
                value: item.name,
                id: item.id,
              })
            );
          }
        }}
      />

      <DatePickerComponent
        visible={selector.showDatepicker}
        mode={"date"}
        value={new Date(Date.now())}
        minimumDate={selector.minDate}
        //   minimumDate={selector.minDate}
        maximumDate={selector.maxDate}
        onChange={(event, selectedDate) => {
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
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 }}
          ref={scrollRef}
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
                  color: openAccordian === "1" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "1" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                <DropDownSelectionItem
                  label={"Salutation*"}
                  disabled={!isInputsEditable()}
                  value={selector.salutation}
                  onPress={() =>
                    showDropDownModelMethod("SALUTATION", "Salutation")
                  }
                />
                {/* <Text style={GlobalStyle.underline} /> */}
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.salutation === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  disabled={!isInputsEditable()}
                  value={selector.first_name}
                  label={"First Name*"}
                  maxLength={50}
                  // editable={false}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerDetails({ key: "FIRST_NAME", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.first_name === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={{ height: 65, width: "100%" }}
                  value={selector.last_name}
                  label={"Last Name*"}
                  keyboardType={"default"}
                  maxLength={50}
                  // editable={false}
                  onChangeText={(text) =>
                    dispatch(
                      setCustomerDetails({ key: "LAST_NAME", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.last_name === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                {selector.enquiry_segment.toLowerCase() === "personal" ? (
                  <View>
                    <DropDownSelectionItem
                      disabled={!isInputsEditable()}
                      label={"Gender*"}
                      value={selector.gender}
                      onPress={() =>
                        showDropDownModelMethod("GENDER", "Gender")
                      }
                    />
                    <Text
                      style={[
                        GlobalStyle.underline,
                        {
                          backgroundColor:
                            isSubmitPress && selector.gender === ""
                              ? "red"
                              : "rgba(208, 212, 214, 0.7)",
                        },
                      ]}
                    ></Text>
                  </View>
                ) : null}
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={{ height: 65, width: "100%" }}
                  value={selector.mobile}
                  editable={false}
                  label={"Mobile Number*"}
                  maxLength={10}
                  onChangeText={(text) =>
                    dispatch(setCustomerDetails({ key: "MOBILE", text: text }))
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.mobile === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={{ height: 65, width: "100%" }}
                  value={selector.email}
                  label={userData.isTracker == "Y" ? "Email ID" : "Email ID*"}
                  keyboardType={"email-address"}
                  onChangeText={(text) =>
                    dispatch(setCustomerDetails({ key: "EMAIL", text: text }))
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.email === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <DropDownSelectionItem
                  disabled={!isInputsEditable()}
                  label={"Enquiry Segment*"}
                  value={selector.enquiry_segment}
                  onPress={() =>
                    showDropDownModelMethod(
                      "ENQUIRY_SEGMENT",
                      "Enquiry Segment"
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.enquiry_segment === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <DropDownSelectionItem
                  disabled={!isInputsEditable()}
                  label={"Buyer Type*"}
                  value={selector.buyer_type}
                  onPress={() =>
                    showDropDownModelMethod("BUYER_TYPE", "Buyer Type")
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.buyer_type === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <DropDownSelectionItem
                  disabled={!isInputsEditable()}
                  label={"Customer Type*"}
                  value={selector.customer_type}
                  onPress={() =>
                    showDropDownModelMethod("CUSTOMER_TYPE", "Customer Type")
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.customer_type === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <DropDownSelectionItem
                  label={"Select Tag"}
                  disabled={!isInputsEditable()}
                  value={selectedTags}
                  onPress={() => {
                    showDropDownModelMethod("SELECT_TAG", "Select Tag");
                  }}
                />
                <Text style={[GlobalStyle.underline]}></Text>
                {selector.enquiry_segment.toLowerCase() === "personal" ? (
                  <View>
                    <DateSelectItem
                      disabled={!isInputsEditable()}
                      label={"Date Of Birth*"}
                      value={selector.date_of_birth}
                      onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
                    />
                    <Text
                      style={[
                        GlobalStyle.underline,
                        {
                          backgroundColor:
                            isSubmitPress && selector.date_of_birth === ""
                              ? "red"
                              : "rgba(208, 212, 214, 0.7)",
                        },
                      ]}
                    ></Text>
                    <TextinputComp
                      disabled={!isInputsEditable()}
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
                      disabled={!isInputsEditable()}
                      label={"Marital Status"}
                      value={selector.marital_status}
                      onPress={() =>
                        showDropDownModelMethod(
                          "MARITAL_STATUS",
                          "Marital Status"
                        )
                      }
                      clearOption={true}
                      clearKey={"MARITAL_STATUS"}
                      onClear={onDropDownClear}
                    />
                  </View>
                ) : null}
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 2.Communication Address */}
              <List.Accordion
                id={"2"}
                title={"Communication Address"}
                titleStyle={{
                  color: openAccordian === "2" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "2" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.pincode}
                  label={"Pincode*"}
                  maxLength={6}
                  keyboardType={"number-pad"}
                  onChangeText={(text) => {
                    // get addreess by pincode
                    if (text.length === 6) {
                      updateAddressDetails(text);
                    }
                    dispatch(
                      setCommunicationAddress({ key: "PINCODE", text: text })
                    );
                    setDefaultAddress(null);
                  }}
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.pincode === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                {addressData.length > 0 && (
                  <>
                    <Text style={GlobalStyle.underline}></Text>
                    <Dropdown
                      disable={!isInputsEditable()}
                      style={[styles.dropdownContainer]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={addressData}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={"Select address"}
                      searchPlaceholder="Search..."
                      value={defaultAddress}
                      // onFocus={() => setIsFocus(true)}
                      // onBlur={() => setIsFocus(false)}
                      onChange={(val) => {
                        dispatch(updateAddressByPincode(val.value));
                      }}
                    />
                  </>
                )}
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && !defaultAddress
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <View style={styles.radioGroupBcVw}>
                  <RadioTextItem
                    disabled={!isInputsEditable()}
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
                    disabled={!isInputsEditable()}
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
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.house_number}
                  // keyboardType={"number-pad"}
                  label={"H.No*"}
                  maxLength={120}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "HOUSE_NO", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.house_number === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.street_name}
                  label={"Street Name*"}
                  maxLength={120}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "STREET_NAME",
                        text: text,
                      })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.street_name === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.village}
                  label={"Village*"}
                  maxLength={40}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "VILLAGE", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.village === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.mandal}
                  label={"Mandal/Tahsil*"}
                  maxLength={40}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "MANDAL", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.mandal === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.city}
                  label={"City*"}
                  maxLength={40}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "CITY", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.city === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.district}
                  label={"District*"}
                  maxLength={40}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "DISTRICT", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.district === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.state}
                  label={"State*"}
                  maxLength={40}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "STATE", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.state === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <View
                  style={{
                    height: 20,
                    backgroundColor: Colors.WHITE,
                  }}
                ></View>

                {/* // Permanent Addresss */}
                <View
                  style={{ backgroundColor: Colors.WHITE, paddingLeft: 12 }}
                >
                  <Text style={styles.permanentAddText}>
                    {"Permanent Address Same as Communication Address"}
                  </Text>
                </View>
                <View style={styles.radioGroupBcVw}>
                  <RadioTextItem
                    disabled={!isInputsEditable()}
                    label={"Yes"}
                    value={"yes"}
                    status={
                      selector.is_permanent_address_same === "YES"
                        ? true
                        : false
                    }
                    onPress={() =>
                      dispatch(
                        setCommunicationAddress({
                          key: "PERMANENT_ADDRESS",
                          text: "true",
                        })
                      )
                    }
                  />
                  <RadioTextItem
                    disabled={!isInputsEditable()}
                    label={"No"}
                    value={"no"}
                    status={
                      selector.is_permanent_address_same === "NO" ? true : false
                    }
                    onPress={() => {
                      dispatch(
                        setCommunicationAddress({
                          key: "PERMANENT_ADDRESS",
                          text: "false",
                        })
                      );
                      dispatch(clearPermanentAddr());
                    }}
                  />
                </View>
                <Text style={GlobalStyle.underline}></Text>

                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.p_pincode}
                  label={"Pincode*"}
                  maxLength={6}
                  keyboardType={"number-pad"}
                  onChangeText={(text) => {
                    // get addreess by pincode
                    if (text.length === 6) {
                      updateAddressDetails2(text);
                    }
                    dispatch(
                      setCommunicationAddress({
                        key: "P_PINCODE",
                        text: text,
                      })
                    );
                  }}
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.p_pincode === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>

                {addressData2.length > 0 && (
                  <>
                    <Text style={GlobalStyle.underline}></Text>
                    <Dropdown
                      disabled={!isInputsEditable()}
                      style={[styles.dropdownContainer]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={addressData2}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={"Select address"}
                      searchPlaceholder="Search..."
                      // value={defaultAddress}
                      // onFocus={() => setIsFocus(true)}
                      // onBlur={() => setIsFocus(false)}
                      onChange={(val) => {
                        dispatch(updateAddressByPincode2(val.value));
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </>
                )}

                <View style={styles.radioGroupBcVw}>
                  <RadioTextItem
                    disabled={!isInputsEditable()}
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
                    disabled={!isInputsEditable()}
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
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  label={"H.No*"}
                  // keyboardType={"number-pad"}
                  maxLength={120}
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
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.p_houseNum === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  label={"Street Name*"}
                  maxLength={120}
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
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.p_streetName === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.p_village}
                  maxLength={50}
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
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.p_village === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.p_mandal}
                  maxLength={50}
                  label={"Mandal*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "P_MANDAL",
                        text: text,
                      })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.p_mandal === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.p_city}
                  maxLength={50}
                  label={"City*"}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "P_CITY", text: text })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.p_city === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.p_district}
                  label={"District*"}
                  maxLength={50}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "P_DISTRICT",
                        text: text,
                      })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.p_district === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.textInputStyle}
                  value={selector.p_state}
                  label={"State*"}
                  maxLength={50}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({
                        key: "P_STATE",
                        text: text,
                      })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.p_state === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 3.Modal Selction */}
              <List.Accordion
                id={"3"}
                title={"Model Selection"}
                titleStyle={{
                  color: openAccordian === "3" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "3" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                {isAddModelButtonShow && (
                  <TouchableOpacity
                    disabled={!isInputsEditable()}
                    onPress={() => {
                      if (checkModelSelection()) {
                        scrollToPos(3);
                        setOpenAccordian("3");
                        return;
                      }
                      const carmodeldata = {
                        color: "",
                        fuel: "",
                        id: randomNumberGenerator(),
                        model: "",
                        transimmisionType: "",
                        variant: "",
                        isPrimary: "N",
                      };
                      let arr = [...carModelsList];
                      arr.push(carmodeldata);
                      setCarModelsList(arr);
                      // selector.dmsLeadProducts = [...selector.dmsLeadProducts, carmodeldata]
                    }}
                    style={styles.addmodelView}
                  >
                    <Text style={styles.addmodeltxt}>Add Model</Text>
                  </TouchableOpacity>
                )}
                <FlatList
                  data={carModelsList}
                  extraData={carModelsList}
                  keyExtractor={(item, index) =>
                    item && item.id ? item.id.toString() : index.toString()
                  }
                  renderItem={({ item, index }) => {
                    return (
                      // <Pressable onPress={() => selectedItem(item, index)}>
                      <View>
                        <PreBookingModelListitemCom
                          disabled={!isInputsEditable()}
                          modelOnclick={modelOnclick}
                          isPrimaryOnclick={isPrimaryOnclick}
                          index={index}
                          item={item}
                          leadStage={leadStage}
                          isSubmitPress={isSubmitPress}
                          carModelsList={carModelsList}
                          isOnlyOne={carModelsList.length == 1 ? true : false}
                          onChangeSubmit={() => setIsSubmitPress(false)}
                        />

                        {/* <Divider /> */}
                      </View>
                      // </Pressable>
                    );
                  }}
                />
                {/* <DropDownSelectionItem
                                    label={"Model"}
                                    value={selector.model}
                                    onPress={() => showDropDownModelMethod("MODEL", "Model")}
                                />
                                <DropDownSelectionItem
                                    label={"Variant"}
                                    value={selector.varient}
                                    onPress={() => showDropDownModelMethod("VARIENT", "Variant")}
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
                                <Text style={GlobalStyle.underline}></Text> */}
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 4.Document Upload */}
              <List.Accordion
                id={"4"}
                title={"Document Upload"}
                titleStyle={{
                  color: openAccordian === "4" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "4" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                {/* {isDataLoaded && */}
                <DropDownSelectionItem
                  disabled={!isInputsEditable()}
                  label={"Form60/PAN"}
                  value={selector.form_or_pan}
                  onPress={() =>
                    showDropDownModelMethod("FORM_60_PAN", "Retail Finance")
                  }
                  clearOption={true}
                  clearKey={"FORM_60_PAN"}
                  onClear={onDropDownClear}
                />
                {/* } */}

                {selector.form_or_pan === "PAN" && (
                  <View>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={styles.textInputStyle}
                      value={selector.pan_number}
                      label={
                        userData.isTracker == "Y" ? "PAN Number" : "PAN Number*"
                      }
                      maxLength={10}
                      autoCapitalize={"characters"}
                      onChangeText={(text) => {
                        dispatch(
                          setDocumentUploadDetails({
                            key: "PAN_NUMBER",
                            text: text.replace(/[^a-zA-Z0-9]/g, ""),
                          })
                        );
                      }}
                    />
                    <Text
                      style={[
                        GlobalStyle.underline,
                        {
                          backgroundColor:
                            isSubmitPress && selector.pan_number === ""
                              ? "red"
                              : "rgba(208, 212, 214, 0.7)",
                        },
                      ]}
                    ></Text>
                    <Text style={GlobalStyle.underline}></Text>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"PAN"}
                        onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))}
                      />
                    </View>
                    {uploadedImagesDataObj.pan?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          disabled={!isInputsEditable()}
                          style={styles.previewBtn}
                          onPress={() => {
                            if (uploadedImagesDataObj.pan?.documentPath) {
                              setImagePath(
                                uploadedImagesDataObj.pan?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            disabled={!isInputsEditable()}
                            fileName={uploadedImagesDataObj.pan.fileName}
                            from={"PAN"}
                          />
                        </View>
                      </View>
                    ) : null}
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {selector.form_or_pan === "Form60" && (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"Form60"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_FORM60"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.form60?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          disabled={!isInputsEditable()}
                          style={styles.previewBtn}
                          onPress={() => {
                            if (uploadedImagesDataObj.form60?.documentPath) {
                              setImagePath(
                                uploadedImagesDataObj.form60?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            disabled={!isInputsEditable()}
                            fileName={uploadedImagesDataObj.form60.fileName}
                            from={"FORM60"}
                          />
                        </View>
                      </View>
                    ) : null}
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {/* // Aadhar Number */}
                {selector.enquiry_segment.toLowerCase() === "personal" ? (
                  <View>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={styles.textInputStyle}
                      value={selector.adhaar_number}
                      label={"Aadhaar Number"}
                      keyboardType={"number-pad"}
                      maxLength={12}
                      onChangeText={(text) =>
                        dispatch(
                          setDocumentUploadDetails({
                            key: "ADHAR",
                            text: text.replace(/[^0-9]/g, ""),
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline} />
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"Upload Aadhaar"}
                        onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))}
                      />
                      {uploadedImagesDataObj.aadhar?.fileName ? (
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            disabled={!isInputsEditable()}
                            style={styles.previewBtn}
                            onPress={() => {
                              if (uploadedImagesDataObj.aadhar?.documentPath) {
                                setImagePath(
                                  uploadedImagesDataObj.aadhar?.documentPath
                                );
                              }
                            }}
                          >
                            <Text style={styles.previetxt}>Preview</Text>
                          </TouchableOpacity>
                          <View style={{ width: "80%" }}>
                            <DisplaySelectedImage
                              disabled={!isInputsEditable()}
                              fileName={uploadedImagesDataObj.aadhar.fileName}
                              from={"AADHAR"}
                            />
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </View>
                ) : null}

                {/* // Employeed ID */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                (selector.customer_type.toLowerCase() === "corporate" ||
                  selector.customer_type.toLowerCase() === "government" ||
                  selector.customer_type.toLowerCase() === "retired") ? (
                  <View>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={styles.textInputStyle}
                      value={selector.employee_id}
                      label={"Employee ID"}
                      maxLength={15}
                      onChangeText={(text) =>
                        dispatch(
                          setDocumentUploadDetails({
                            key: "EMPLOYEE_ID",
                            text: text,
                          })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"Employee ID"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_EMPLOYEE_ID"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.employeeId?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          disabled={!isInputsEditable()}
                          style={styles.previewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.employeeId?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.employeeId?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            disabled={!isInputsEditable()}
                            fileName={uploadedImagesDataObj.employeeId.fileName}
                            from={"EMPLOYEE_ID"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Last 3 month payslip */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                (selector.customer_type.toLowerCase() === "corporate" ||
                  selector.customer_type.toLowerCase() === "government") ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"Last 3 months payslip"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_3_MONTHS_PAYSLIP"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.payslips?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          disabled={!isInputsEditable()}
                          style={styles.previewBtn}
                          onPress={() => {
                            if (uploadedImagesDataObj.payslips?.documentPath) {
                              setImagePath(
                                uploadedImagesDataObj.payslips?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            disabled={!isInputsEditable()}
                            fileName={uploadedImagesDataObj.payslips.fileName}
                            from={"3_MONTHS_PAYSLIP"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Patta Pass book */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                selector.customer_type.toLowerCase() === "farmer" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"Patta Pass Book"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_PATTA_PASS_BOOK"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.pattaPassBook?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          disabled={!isInputsEditable()}
                          style={styles.previewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.pattaPassBook?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.pattaPassBook
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            disabled={!isInputsEditable()}
                            fileName={
                              uploadedImagesDataObj.pattaPassBook.fileName
                            }
                            from={"PATTA_PASS_BOOK"}
                          />
                        </View>
                      </View>
                    ) : uploadedImagesDataObj?.pattaPassBook?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          disabled={
                            userData.isManager ? (isEdit ? false : true) : false
                          }
                          style={styles.previewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj?.pattaPassBook?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj?.pattaPassBook
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            disabled={
                              userData.isManager
                                ? isEdit
                                  ? false
                                  : true
                                : false
                            }
                            fileName={
                              uploadedImagesDataObj?.pattaPassBook?.fileName
                            }
                            from={"PATTA_PASS_BOOK"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Pension Letter */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                selector.customer_type.toLowerCase() === "retired" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"Pension Letter"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_PENSION_LETTER"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.pensionLetter?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          disabled={!isInputsEditable()}
                          style={styles.previewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.pensionLetter?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.pensionLetter
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            disabled={!isInputsEditable()}
                            fileName={
                              uploadedImagesDataObj.pensionLetter.fileName
                            }
                            from={"PENSION_LETTER"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* IMA Certificate */}
                {selector.enquiry_segment.toLowerCase() === "personal" &&
                selector.customer_type.toLowerCase() === "doctor" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"IMA Certificate"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_IMA_CERTIFICATE"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.imaCertificate?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          disabled={!isInputsEditable()}
                          style={styles.previewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.imaCertificate?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.imaCertificate
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            disabled={!isInputsEditable()}
                            fileName={
                              uploadedImagesDataObj.imaCertificate.fileName
                            }
                            from={"IMA_CERTIFICATE"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Leasing Confirmation */}
                {selector.enquiry_segment.toLowerCase() === "commercial" &&
                selector.customer_type.toLowerCase() === "fleet" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"Leasing Confirmation"}
                        onPress={() =>
                          dispatch(
                            setImagePicker("UPLOAD_LEASING_CONFIRMATION")
                          )
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.leasingConfirmationLetter
                      ?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          disabled={!isInputsEditable()}
                          style={styles.previewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.leasingConfirmationLetter
                                ?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.leasingConfirmationLetter
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            disabled={!isInputsEditable()}
                            fileName={
                              uploadedImagesDataObj.leasingConfirmationLetter
                                .fileName
                            }
                            from={"LEASING_CONFIRMATION"}
                          />
                        </View>
                      </View>
                    ) : uploadedImagesDataObj.leasingConfirmationLetter ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.previewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.leasingConfirmationLetter
                                ?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.leasingConfirmationLetter
                                  ?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={
                              uploadedImagesDataObj.leasingConfirmationLetter
                                .fileName
                            }
                            from={"LEASING_CONFIRMATION"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* Address Proof */}
                {selector.enquiry_segment.toLowerCase() === "company" &&
                selector.customer_type.toLowerCase() === "institution" ? (
                  <View>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        disabled={!isInputsEditable()}
                        name={"Address Proof"}
                        onPress={() =>
                          dispatch(setImagePicker("UPLOAD_ADDRESS_PROOF"))
                        }
                      />
                    </View>
                    {uploadedImagesDataObj.address?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.previewBtn}
                          onPress={() => {
                            if (uploadedImagesDataObj.address?.documentPath) {
                              setImagePath(
                                uploadedImagesDataObj.address?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={uploadedImagesDataObj.address.fileName}
                            from={"ADDRESS_PROOF"}
                          />
                        </View>
                      </View>
                    ) : uploadedImagesDataObj.addressProof?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.previewBtn}
                          onPress={() => {
                            if (
                              uploadedImagesDataObj.addressProof?.documentPath
                            ) {
                              setImagePath(
                                uploadedImagesDataObj.addressProof?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={
                              uploadedImagesDataObj.addressProof.fileName
                            }
                            from={"ADDRESS_PROOF"}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                {/* // Customer Type Category */}
                {selector.customer_type === "Individual" && (
                  <View>
                    <DropDownSelectionItem
                      label={"Customer Type Category"}
                      disabled={!isInputsEditable()}
                      value={selector.customer_type_category}
                      onPress={() =>
                        showDropDownModelMethod(
                          "CUSTOMER_TYPE_CATEGORY",
                          "Customer Type Category"
                        )
                      }
                      clearOption={true}
                      clearKey={"CUSTOMER_TYPE_CATEGORY"}
                      onClear={onDropDownClear}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {/* GSTIN Number */}
                {(selector.enquiry_segment.toLowerCase() === "company" &&
                  selector.customer_type.toLowerCase() === "institution") ||
                selector.customer_type_category == "B2B" ||
                selector.customer_type_category == "B2C" ? (
                  <View>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={styles.textInputStyle}
                      value={selector.gstin_number}
                      maxLength={15}
                      label={"GSTIN Number"}
                      autoCapitalize={"characters"}
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

                {/* // Relationship Number */}
                <View>
                  {/* <TextinputComp
                                        style={styles.textInputStyle}
                                        value={selector.relationship_proof}
                                        label={"Relationship Number*"}
                                        keyboardType="number-pad"
                                        maxLength={10}
                                        onChangeText={(text) =>
                                            dispatch(
                                                setDocumentUploadDetails({
                                                    key: "RELATIONSHIP_PROOF",
                                                    text: text,
                                                })
                                            )
                                        }
                                    />
                                    <Text style={GlobalStyle.underline}></Text> */}
                  <View style={styles.select_image_bck_vw}>
                    <ImageSelectItem
                      name={"Others"}
                      onPress={() =>
                        dispatch(setImagePicker("UPLOAD_RELATION_PROOF"))
                      }
                      disabled={!isInputsEditable()}
                    />
                  </View>
                  {uploadedImagesDataObj.relationshipProof?.fileName ? (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={styles.previewBtn}
                        disabled={!isInputsEditable()}
                        onPress={() => {
                          if (
                            uploadedImagesDataObj.relationshipProof
                              ?.documentPath
                          ) {
                            setImagePath(
                              uploadedImagesDataObj.relationshipProof
                                ?.documentPath
                            );
                          }
                        }}
                      >
                        <Text style={styles.previetxt}>Preview</Text>
                      </TouchableOpacity>
                      <View style={{ width: "80%" }}>
                        <DisplaySelectedImage
                          fileName={
                            uploadedImagesDataObj.relationshipProof.fileName
                          }
                          from={"RELATION_PROOF"}
                        />
                      </View>
                    </View>
                  ) : null}
                  <Text style={GlobalStyle.underline}></Text>
                </View>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 5.Price Confirmation */}
              <List.Accordion
                id={"5"}
                title={"Price Confirmation"}
                description={rupeeSymbol + " " + getActualPrice().toFixed(2)}
                titleStyle={{
                  color: openAccordian === "5" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                descriptionStyle={{
                  color: openAccordian === "5" ? Colors.BLACK : Colors.BLACK,
                  paddingTop: 5,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "5" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                <TextAndAmountComp
                  title={"Ex-Showroom Price*:"}
                  amount={priceInfomationData.ex_showroom_price.toFixed(2)}
                />
                {/* <View style={styles.radioGroupBcVw}>
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
                                            );
                                        }}
                                    />
                                    <Text style={styles.checkboxAddText}>
                                        {"Any Other Vehicle Registration on Your Name"}
                                    </Text>
                                </View> */}

                {selector.vechicle_registration ? (
                  <View>
                    <DropDownSelectionItem
                      label={"Vehicle Type"}
                      value={selector.vehicle_type}
                      onPress={() =>
                        showDropDownModelMethod("VEHICLE_TYPE", "Vehicle Type")
                      }
                      clearOption={true}
                      clearKey={"VEHICLE_TYPE"}
                      onClear={onDropDownClear}
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
                  <Text style={[styles.leftLabel]}>
                    {userData.isTracker == "Y" ? "Life Tax:" : "Life Tax*:"}
                  </Text>
                  {/* </View> */}
                  <View
                    style={{
                      width: 100,
                      // height: 30,
                      // justifyContent: 'center',
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderBottomColor:
                        isSubmitPress && taxPercent == "" ? "red" : "#d1d1d1",
                    }}
                  >
                    <TextInput
                      editable={isInputsEditable()}
                      value={taxPercent}
                      maxLength={2}
                      style={[
                        {
                          fontSize: 14,
                          fontWeight: "400",
                          color: isInputsEditable()
                            ? Colors.BLACK
                            : Colors.GRAY,
                        },
                      ]}
                      maxLength={5}
                      keyboardType={"number-pad"}
                      onChangeText={(text) => {
                        setTaxPercent(text);
                        if (text !== "") {
                          setLifeTaxAmount(getLifeTaxNew(Number(text)));
                        } else {
                          setLifeTaxAmount(0);
                        }
                      }}
                    />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: "400" }}>
                    {rupeeSymbol + " " + lifeTaxAmount.toFixed(2)}
                  </Text>
                </View>

                <Text style={GlobalStyle.underline}></Text>

                <View style={styles.symbolview}>
                  <View style={{ width: "70%" }}>
                    <DropDownSelectionItem
                      disabled={!isInputsEditable()}
                      label={"Registration Charges:"}
                      value={selectedRegistrationCharges?.name}
                      onPress={() =>
                        showDropDownModelMethod(
                          "REGISTRATION_CHARGES",
                          "Registration Charges"
                        )
                      }
                      clearOption={true}
                      clearKey={"REGISTRATION_CHARGES"}
                      onClear={onDropDownClear}
                    />
                  </View>

                  <Text style={styles.shadowText}>
                    {rupeeSymbol +
                      " " +
                      `${
                        selectedRegistrationCharges?.cost
                          ? selectedRegistrationCharges?.cost
                          : "0.00"
                      }`}
                  </Text>
                </View>
                {/* <TextAndAmountComp
                    title={"Registration Charges:"}
                    amount={priceInfomationData.registration_charges.toFixed(2)}
                  /> */}
                <Text style={GlobalStyle.underline}></Text>

                <View style={styles.symbolview}>
                  <View style={{ width: "70%" }}>
                    <DropDownSelectionItem
                      disabled={!isInputsEditable()}
                      label={"Insurance Type"}
                      value={selector.insurance_type}
                      onPress={() =>
                        showDropDownModelMethod(
                          "INSURANCE_TYPE",
                          "Insurance Type"
                        )
                      }
                      clearOption={true}
                      clearKey={"INSURANCE_TYPE"}
                      onClear={onDropDownClear}
                    />
                  </View>
                  <Text style={styles.shadowText}>
                    {rupeeSymbol + " " + selectedInsurencePrice.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.symbolview}>
                  <View style={{ width: "70%" }}>
                    <DropDownSelectionItem
                      disabled={
                        userData.isManager || !selector.insurance_type
                          ? true
                          : false
                      }
                      label={"Add-on Insurance"}
                      value={
                        selector.insurance_type !== ""
                          ? selector.add_on_insurance
                          : ""
                      }
                      onPress={() =>
                        showDropDownModelMethod(
                          "INSURENCE_ADD_ONS",
                          "Add-on Insurance"
                        )
                      }
                      clearOption={true}
                      clearKey={"INSURENCE_ADD_ONS"}
                      onClear={onDropDownClear}
                    />
                  </View>
                  {selector.insurance_type !== "" ? (
                    <Text style={styles.shadowText}>
                      {rupeeSymbol + " " + selectedAddOnsPrice.toFixed(2)}
                    </Text>
                  ) : (
                    <Text style={styles.shadowText}>
                      {rupeeSymbol + " 0.00"}
                    </Text>
                  )}
                </View>

                <View style={styles.symbolview}>
                  <View style={{ width: "70%" }}>
                    <DropDownSelectionItem
                      disabled={!isInputsEditable()}
                      label={"Warranty"}
                      value={selector.warranty}
                      onPress={() =>
                        showDropDownModelMethod("WARRANTY", "Warranty")
                      }
                      clearOption={true}
                      clearKey={"WARRANTY"}
                      onClear={onDropDownClear}
                    />
                  </View>
                  <Text style={styles.shadowText}>
                    {rupeeSymbol + " " + selectedWarrentyPrice.toFixed(2)}
                  </Text>
                </View>
                <Text style={GlobalStyle.underline}></Text>

                <CheckboxTextAndAmountComp
                  disabled={!isInputsEditable()}
                  title={"Handling Charges:"}
                  amount={
                    handlingChargSlctd
                      ? priceInfomationData.handling_charges.toFixed(2)
                      : 0
                  }
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
                  disabled={!isInputsEditable()}
                  title={"Essential Kit:"}
                  amount={
                    essentialKitSlctd
                      ? priceInfomationData.essential_kit.toFixed(2)
                      : 0
                  }
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
                  title={"TCS(>=10Lakhs = 1%Tax):"}
                  amount={tcsAmount.toFixed(2)}
                />
                <Text style={GlobalStyle.underline}></Text>

                <Pressable
                  disabled={!isInputsEditable()}
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
                  disabled={!isInputsEditable()}
                  title={"Fast Tag:"}
                  amount={
                    fastTagSlctd
                      ? priceInfomationData.fast_tag === null
                        ? 0
                        : priceInfomationData.fast_tag.toFixed(2)
                      : 0
                  }
                  //amount={fastTagSlctd ? priceInfomationData.fast_tag.toFixed(2) : 0}
                  // \\\\amount={fastTagSlctd ? priceInfomationData.fast_tag.toFixed(2) : "0.00"}
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

                <View style={styles.otherPriceTitleRow}>
                  <Text style={styles.otherPriceTextStyle}>
                    Add Other Prices
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.addIcon,
                      {
                        backgroundColor: isInputsEditable()
                          ? Colors.RED
                          : Colors.GRAY,
                      },
                    ]}
                    disabled={!isInputsEditable()}
                    onPress={() => addHandler()}
                  >
                    <Text
                      style={{
                        color: Colors.WHITE,
                        fontSize: 13,
                      }}
                    >
                      +
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: Colors.WHITE,
                    paddingTop: 5,
                  }}
                >
                  <FlatList
                    data={addNewInput}
                    extraData={[
                      addNewInput,
                      otherPriceErrorAmountIndexInput,
                      otherPriceErrorNameIndex,
                    ]}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 10,
                          }}
                        >
                          <View style={{ width: "45%" }}>
                            <DropDownSelectionItem
                              label={"Name"}
                              disabled={!isInputsEditable()}
                              value={item.name}
                              style={{
                                height: 50,
                                borderColor: checkIsError("name", index)
                                  ? Colors.RED
                                  : Colors.BLACK,
                              }}
                              takeMinHeight={true}
                              otherPrices={true}
                              onPress={() => {
                                showDropDownModelMethod(
                                  "OTHER_PRICES",
                                  "Select Name"
                                );
                                setOtherPriceDropDownIndex(index);
                              }}
                              clearOption={true}
                              clearKey={"OTHER_PRICES"}
                              onClear={onDropDownClear}
                            />
                          </View>

                          {/* <TextInput
                            editable={isInputsEditable()}
                            style={[
                              styles.otherPriceInput,
                              {
                                borderColor: checkIsError("name", index)
                                  ? Colors.RED
                                  : null,
                              },
                            ]}
                            placeholder={"Name"}
                            onChangeText={(name) =>
                              inputHandlerName(name, index)
                            }
                            value={item.name}
                          /> */}
                          <TextInput
                            editable={isInputsEditable()}
                            style={[
                              styles.otherPriceInput,
                              {
                                marginLeft: 20,
                                borderColor: checkIsError("amount", index)
                                  ? Colors.RED
                                  : null,
                              },
                            ]}
                            placeholder={"Amount"}
                            keyboardType={"decimal-pad"}
                            onChangeText={(value) =>
                              inputHandlerPrice(value, index)
                            }
                            value={`${item?.amount ?? "0"}`}
                          />
                          <TouchableOpacity
                            disabled={!isInputsEditable()}
                            onPress={() => deleteHandler(index)}
                            style={{ marginLeft: 10 }}
                          >
                            <IconButton
                              icon="trash-can-outline"
                              color={Colors.PINK}
                              size={25}
                              disabled={!isInputsEditable()}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </View>

                <TextAndAmountComp
                  title={"On Road Price:"}
                  amount={getActualPrice().toFixed(2)}
                  titleStyle={{ fontSize: 18, fontWeight: "800" }}
                  amoutStyle={{ fontSize: 18, fontWeight: "800" }}
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 6.Offer Price */}
              <List.Accordion
                id={"6"}
                title={"Offer Price"}
                description={
                  rupeeSymbol + " " + getActualPriceAfterDiscount().toFixed(2)
                }
                titleStyle={{
                  color: openAccordian === "6" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                descriptionStyle={{
                  color: openAccordian === "6" ? Colors.BLACK : Colors.BLACK,
                  paddingTop: 5,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "6" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Consumer Offer:"}
                  value={selector.consumer_offer}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  keyboardType="number-pad"
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
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Exchange Offer:"}
                  value={selector.exchange_offer}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
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
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Corporate Offer:"}
                  value={selector.corporate_offer}
                  showLeftAffixText={true}
                  leftAffixText={rupeeSymbol}
                  keyboardType="number-pad"
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
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Promotional Offer:"}
                  value={selector.promotional_offer}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
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
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Cash Discount:"}
                  value={selector.cash_discount}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
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
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Foc Accessories:"}
                  value={selector.for_accessories}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
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
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Insurance Discount:"}
                  value={selector.insurance_discount}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "INSURANCE_DISCOUNT",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Accessories Discount:"}
                  value={selector.accessories_discount}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
                  leftAffixText={rupeeSymbol}
                  onChangeText={(text) =>
                    dispatch(
                      setOfferPriceDetails({
                        key: "ACCESSORIES_DISCOUNT",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>

                {/* <View style={styles.textAndAmountView}>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: Colors.GRAY }}>{"Insurance Discount:"}</Text>
                                    <View style={{ width: 80, height: 30, justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#d1d1d1' }}>
                                        <TextInput
                                            value={insuranceDiscount}
                                            style={[{ fontSize: 14, fontWeight: "400", }]}
                                            keyboardType={"number-pad"}
                                            onChangeText={(text) => {
                                                setInsuranceDiscount(text)
                                            }}
                                        />
                                    </View>
                                </View> */}
                {/* <View style={styles.textAndAmountView}>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: Colors.GRAY }}>{"Accessories Discount:"}</Text>
                                    <View style={{ width: 80, height: 30, justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#d1d1d1' }}>
                                        <TextInput
                                            value={accDiscount}
                                            style={[{ fontSize: 14, fontWeight: "400", }]}
                                            keyboardType={"number-pad"}
                                            onChangeText={(text) => {
                                                setAccDiscount(text)
                                            }}
                                        />
                                    </View>
                                </View> */}
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Additional Offer 1:"}
                  value={selector.additional_offer_1}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
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
                  disabled={!isInputsEditable()}
                  style={styles.offerPriceTextInput}
                  label={"Additional Offer 2:"}
                  value={selector.additional_offer_2}
                  showLeftAffixText={true}
                  keyboardType="number-pad"
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
                  amount={getActualPriceAfterDiscount().toFixed(2)}
                  titleStyle={{ fontSize: 18, fontWeight: "800" }}
                  amoutStyle={{ fontSize: 18, fontWeight: "800" }}
                />
                <Text style={GlobalStyle.underline}></Text>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 7.Finance Details */}
              <List.Accordion
                id={"7"}
                title={"Finance Details"}
                titleStyle={{
                  color: openAccordian === "7" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "7" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                <DropDownSelectionItem
                  disabled={!isInputsEditable()}
                  label={"Retail Finance*"}
                  value={selector.retail_finance}
                  onPress={() =>
                    showDropDownModelMethod("RETAIL_FINANCE", "Retail Finance")
                  }
                />

                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.retail_finance === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>

                {selector.retail_finance === "Out House" ? (
                  <View>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"Bank/Finance Name"}
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
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"Location"}
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

                {selector.retail_finance === "Leasing" && (
                  <View>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"Leasing Name"}
                      maxLength={50}
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
                    disabled={!isInputsEditable()}
                    label={"Finance Category"}
                    value={selector.finance_category}
                    onPress={() =>
                      showDropDownModelMethod(
                        "FINANCE_CATEGORY",
                        "Finance Category"
                      )
                    }
                    clearOption={true}
                    clearKey={"FINANCE_CATEGORY"}
                    onClear={onDropDownClear}
                  />
                )}

                {selector.retail_finance === "In House" && (
                  <View>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"Down Payment"}
                      value={selector.down_payment}
                      keyboardType={"number-pad"}
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

                {selector.retail_finance === "In House" && (
                  <View>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"Loan Amount"}
                      keyboardType={"number-pad"}
                      value={selector.loan_amount}
                      onChangeText={(text) => {
                        // Calculate EMI
                        emiCal(
                          selector.loan_of_tenure,
                          selector.rate_of_interest
                        );
                        dispatch(
                          setFinancialDetails({
                            key: "LOAN_AMOUNT",
                            text: text,
                          })
                        );
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"Rate of Interest"}
                      keyboardType={"number-pad"}
                      value={selector.rate_of_interest?.toString()}
                      onChangeText={(text) => {
                        // Calculate EMI
                        emiCal(
                          selector.loan_amount,
                          selector.loan_of_tenure,
                          text
                        );
                        dispatch(
                          setFinancialDetails({
                            key: "RATE_OF_INTEREST",
                            text: text,
                          })
                        );
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}
                {selector.retail_finance === "Out House" && (
                  <View>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"Loan Amount"}
                      keyboardType={"number-pad"}
                      value={selector.loan_amount}
                      onChangeText={(text) => {
                        // Calculate EMI
                        emiCal(
                          selector.loan_of_tenure,
                          selector.rate_of_interest
                        );
                        dispatch(
                          setFinancialDetails({
                            key: "LOAN_AMOUNT_OUT",
                            text: text,
                          })
                        );
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"Rate of Interest"}
                      keyboardType={"number-pad"}
                      value={selector.rate_of_interest?.toString()}
                      onChangeText={(text) => {
                        // Calculate EMI
                        emiCal(
                          selector.loan_amount,
                          selector.loan_of_tenure,
                          text
                        );
                        dispatch(
                          setFinancialDetails({
                            key: "RATE_OF_INTEREST",
                            text: text,
                          })
                        );
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>
                  </View>
                )}

                {selector.retail_finance === "In House" && (
                  <View>
                    <DropDownSelectionItem
                      disabled={!isInputsEditable()}
                      label={"Bank/Financer"}
                      value={selector.bank_or_finance}
                      onPress={() =>
                        showDropDownModelMethod("BANK_FINANCE", "Bank/Financer")
                      }
                      clearOption={true}
                      clearKey={"BANK_FINANCE"}
                      onClear={onDropDownClear}
                    />

                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"Loan of Tenure(Months)"}
                      value={selector.loan_of_tenure?.toString()}
                      keyboardType={"number-pad"}
                      onChangeText={(text) => {
                        // Calculate EMI
                        emiCal(
                          selector.loan_amount,
                          text,
                          selector.rate_of_interest
                        );
                        dispatch(
                          setFinancialDetails({
                            key: "LOAN_OF_TENURE",
                            text: text,
                          })
                        );
                      }}
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <TextinputComp
                      disabled={!isInputsEditable()}
                      style={{ height: 65, width: "100%" }}
                      label={"EMI"}
                      value={selector.emi}
                      keyboardType={"number-pad"}
                      onChangeText={(text) =>
                        dispatch(
                          setFinancialDetails({ key: "EMI", text: text })
                        )
                      }
                    />
                    <Text style={GlobalStyle.underline}></Text>

                    <DropDownSelectionItem
                      disabled={!isInputsEditable()}
                      label={"Approx Annual Income"}
                      value={selector.approx_annual_income}
                      onPress={() =>
                        showDropDownModelMethod(
                          "APPROX_ANNUAL_INCOME",
                          "Approx Annual Income"
                        )
                      }
                      clearOption={true}
                      clearKey={"APPROX_ANNUAL_INCOME"}
                      onClear={onDropDownClear}
                    />
                  </View>
                )}
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 8.Booking Payment Mode */}
              <List.Accordion
                id={"8"}
                title={"Booking Payment Mode"}
                titleStyle={{
                  color: openAccordian === "8" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "8" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={{ height: 65, width: "100%" }}
                  value={selector.booking_amount}
                  label={"Booking Amount*"}
                  keyboardType={"number-pad"}
                  maxLength={9}
                  onChangeText={(text) =>
                    dispatch(
                      setBookingPaymentDetails({
                        key: "BOOKING_AMOUNT",
                        text: text.replace(/[^0-9]/g, ''),
                      })
                    )
                  }
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.booking_amount === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>

                <DropDownSelectionItem
                  disabled={!isInputsEditable()}
                  label={"Payment At"}
                  value={selector.payment_at}
                  onPress={() =>
                    showDropDownModelMethod("PAYMENT_AT", "Payment At")
                  }
                  clearOption={true}
                  clearKey={"PAYMENT_AT"}
                  onClear={onDropDownClear}
                />
                <Text style={GlobalStyle.underline} />

                <DropDownSelectionItem
                  disabled={!isInputsEditable()}
                  label={"Booking Payment Mode*"}
                  value={selector.booking_payment_mode}
                  onPress={() =>
                    showDropDownModelMethod(
                      "BOOKING_PAYMENT_MODE",
                      "Booking Payment Mode"
                    )
                  }
                  clearOption={true}
                  clearKey={"BOOKING_PAYMENT_MODE"}
                  onClear={onDropDownClear}
                />
                <Text
                  style={[
                    GlobalStyle.underline,
                    {
                      backgroundColor:
                        isSubmitPress && selector.booking_payment_mode === ""
                          ? "red"
                          : "rgba(208, 212, 214, 0.7)",
                    },
                  ]}
                ></Text>
              </List.Accordion>
              <View style={styles.space}></View>

              {/* // 9.DOD Confirmation */}
              <List.Accordion
                id={"9"}
                title={"DOD Confirmation"}
                titleStyle={{
                  color: openAccordian === "9" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "9" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                <DateSelectItem
                  disabled={!isInputsEditable()}
                  label={"Customer Preferred Date"}
                  value={selector.customer_preferred_date}
                  onPress={() =>
                    dispatch(setDatePicker("CUSTOMER_PREFERRED_DATE"))
                  }
                />
                <Text style={GlobalStyle.underline} />
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={{ height: 65, width: "100%" }}
                  label={"Occasion"}
                  value={selector.occasion}
                  maxLength={50}
                  onChangeText={(text) =>
                    dispatch(
                      setCommitmentDetails({ key: "OCCASION", text: text })
                    )
                  }
                />
                <Text style={GlobalStyle.underline}></Text>
                <DateSelectItem
                  disabled={!isInputsEditable()}
                  label={"Tentative Delivery Date"}
                  value={selector.tentative_delivery_date}
                  onPress={() =>
                    dispatch(setDatePicker("TENTATIVE_DELIVERY_DATE"))
                  }
                />
                <Text style={GlobalStyle.underline} />
                <TextinputComp
                  disabled={!isInputsEditable()}
                  style={{ height: 65, width: "100%" }}
                  label={"Delivery Location"}
                  maxLength={50}
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
              {isRejectSelected ? <View style={styles.space}></View> : null}
              {isRejectSelected && (
                <List.Accordion
                  id={"11"}
                  title={"Manager Reject Remarks"}
                  titleStyle={{
                    color: openAccordian === "11" ? Colors.BLACK : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={[
                    {
                      backgroundColor:
                        openAccordian === "11" ? Colors.RED : Colors.WHITE,
                    },
                    styles.accordianBorder,
                  ]}
                >
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.reject_remarks}
                    disabled={!isRejectRemarkEnable()}
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

              {showPrebookingPaymentSection ? (
                <View style={styles.space}></View>
              ) : null}
              {showPrebookingPaymentSection && !userData.isManager ? (
                <List.Accordion
                  id={"12"}
                  title={"Booking Payment Details"}
                  titleStyle={{
                    color: openAccordian === "12" ? Colors.BLACK : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={[
                    {
                      backgroundColor:
                        openAccordian === "12" ? Colors.RED : Colors.WHITE,
                    },
                    styles.accordianBorder,
                  ]}
                >
                  <View>
                    <DateSelectItem
                      label={"Receipt Date*"}
                      value={moment().format("DD/MM/YYYY")}
                      onPress={() => dispatch(setDatePicker("RECEIPT_DATE"))}
                      disabled={true}
                    />
                    <Text style={GlobalStyle.underline} />
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Receipt Doc*"}
                        onPress={() => dispatch(setImagePicker("RECEIPT_DOC"))}
                      />
                    </View>
                    {uploadedImagesDataObj.receipt?.fileName ? (
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                          style={styles.previewBtn}
                          onPress={() => {
                            if (uploadedImagesDataObj.receipt?.documentPath) {
                              setImagePath(
                                uploadedImagesDataObj.receipt?.documentPath
                              );
                            }
                          }}
                        >
                          <Text style={styles.previetxt}>Preview</Text>
                        </TouchableOpacity>
                        <View style={{ width: "80%" }}>
                          <DisplaySelectedImage
                            fileName={uploadedImagesDataObj.receipt.fileName}
                            from={"RECEIPT"}
                          />
                        </View>
                      </View>
                    ) : null}
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
                        value={selector.transfer_from_mobile + ""}
                        label={"Transfer From Mobile"}
                        keyboardType={"number-pad"}
                        maxLength={10}
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
                        value={selector.transfer_to_mobile + ""}
                        label={"Transfer To Mobile"}
                        keyboardType={"number-pad"}
                        maxLength={10}
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

                  {(selector.booking_payment_mode === "InternetBanking" ||
                    selector.booking_payment_mode === "Internet Banking") && (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.utr_no}
                        label={"UTR No"}
                        onChangeText={(text) =>
                          dispatch(
                            setPreBookingPaymentDetials({
                              key: "UTR_NO",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <DateSelectItem
                        label={"Transaction Date"}
                        value={selector.transaction_date}
                        onPress={() =>
                          dispatch(setDatePicker("TRANSACTION_DATE"))
                        }
                      />
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.comapany_bank_name}
                        label={"Company Bank Name"}
                        onChangeText={(text) =>
                          dispatch(
                            setPreBookingPaymentDetials({
                              key: "COMPANY_BANK_NAME",
                              text: text,
                            })
                          )
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
                        keyboardType={"number-pad"}
                        maxLength={9}
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
                        onPress={() => dispatch(setDatePicker("CHEQUE_DATE"))}
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
                        onPress={() => dispatch(setDatePicker("DD_DATE"))}
                      />
                    </View>
                  )}
                </List.Accordion>
              ) : null}

              {isDropSelected ? <View style={styles.space}></View> : null}
              {isDropSelected ? (
                <List.Accordion
                  id={"10"}
                  title={"Booking Approval Lost Section"}
                  titleStyle={{
                    color: openAccordian === "10" ? Colors.BLACK : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={[
                    {
                      backgroundColor:
                        openAccordian === "10" ? Colors.RED : Colors.WHITE,
                    },
                    styles.accordianBorder,
                  ]}
                >
                  <DropComponent
                    from="PRE_BOOKING"
                    data={dropData}
                    reason={dropReason}
                    setReason={(text) => setDropReason(text)}
                    subReason={dropSubReason}
                    setSubReason={(text) => setDropSubReason(text)}
                    brandName={dropBrandName}
                    setBrandName={(text) => setDropBrandName(text)}
                    dealerName={dropDealerName}
                    setDealerName={(text) => setDropDealerName(text)}
                    location={dropLocation}
                    setLocation={(text) => setDropLocation(text)}
                    model={dropModel}
                    setModel={(text) => setDropModel(text)}
                    priceDiff={dropPriceDifference}
                    setPriceDiff={(text) => setDropPriceDifference(text)}
                    remarks={dropRemarks}
                    setRemarks={(text) => setDropRemarks(text)}
                  />
                </List.Accordion>
              ) : null}
              {/* // 11.Reject */}
            </List.AccordionGroup>

            {/* Lead created by self */}
            {showApproveRejectBtn &&
              !isLeadCreatedBySelf() &&
              userData.isPreBookingApprover &&
              !isDropSelected && (
                <View style={styles.actionBtnView}>
                  {!isRejectSelected && (
                    <Button
                      mode="contained"
                      style={{ width: 120 }}
                      color={Colors.GREEN}
                      labelStyle={{ textTransform: "none" }}
                      onPress={() => approveOrRejectMethod("APPROVE")}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    mode="contained"
                    color={Colors.RED}
                    labelStyle={{ textTransform: "none" }}
                    onPress={() =>
                      isRejectSelected
                        ? approveOrRejectMethod("REJECT")
                        : setIsRejectSelected(true)
                    }
                  >
                    {isRejectSelected ? "Submit" : "Reject"}
                  </Button>
                </View>
              )}

            {/* User Self Manager */}
            {showApproveRejectBtn && userData.isSelfManager == "Y" ? (
              <View style={styles.actionBtnView}>
                {!isRejectSelected && (
                  <Button
                    mode="contained"
                    style={{ width: 120 }}
                    color={Colors.GREEN}
                    labelStyle={{ textTransform: "none" }}
                    onPress={() => approveOrRejectMethod("APPROVE")}
                  >
                    Approve
                  </Button>
                )}
                <Button
                  mode="contained"
                  color={Colors.RED}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() =>
                    isRejectSelected
                      ? approveOrRejectMethod("REJECT")
                      : setIsRejectSelected(true)
                  }
                >
                  {isRejectSelected ? "Submit" : "Reject"}
                </Button>
              </View>
            ) : null}

            {isSubmitShow() && (
              <View style={styles.actionBtnView}>
                <Button
                  mode="contained"
                  style={{ width: 120 }}
                  color={Colors.BLACK}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => {
                    setIsDropSelected(true);
                    setOpenAccordian("10");
                    setTimeout(() => {
                      scrollRef.current.scrollToEnd({ animated: true });
                    }, 500);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  disabled={selector.isLoading || isLoading}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => {
                    submitClicked();
                  }}
                >
                  SUBMIT
                </Button>
              </View>
            )}

            {showPrebookingPaymentSection &&
            !userData.isManager &&
            !isSubmitShow() &&
            !isDropSelected ? (
              <View style={styles.actionBtnView}>
                <Button
                  mode="contained"
                  color={Colors.BLACK}
                  labelStyle={{ textTransform: "none", fontSize: 10 }}
                  onPress={() => {
                    setIsDropSelected(true);
                    setOpenAccordian("10");
                    setIsEditButtonShow(false);
                    setTimeout(() => {
                      scrollRef.current.scrollToEnd({ animated: true });
                    }, 500);
                  }}
                >
                  Drop
                </Button>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  labelStyle={{ textTransform: "none", fontSize: 10 }}
                  onPress={() => {
                    setIsEdit(true);
                    if (userData.orgName !== "BikeWo Corporation") {
                      setShowApproveRejectBtn(true);
                    }
                    setIsEditButtonShow(false);
                    setIsSubmitCancelButtonShow(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  labelStyle={{ textTransform: "none", fontSize: 10 }}
                  onPress={() => {
                    isProceedToBookingClicked = true;
                    proceedToBookingClicked();
                  }}
                >
                  Proceed To Booking View
                </Button>
              </View>
            ) : isEditButtonShow ? (
              <View style={styles.actionBtnView}>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => {
                    setIsEdit(true);
                    if (userData.orgName !== "BikeWo Corporation") {
                      setShowApproveRejectBtn(true);
                    }
                    // new conditions
                    setIsEditButtonShow(false);
                    setIsSubmitCancelButtonShow(true);
                  }}
                >
                  Edit
                </Button>
              </View>
            ) : null}

            {isDropSelected && (
              <View style={styles.prebookingBtnView}>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => setIsDropSelected(false)}
                >
                  Back
                </Button>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  // disabled={selector.isLoading}
                  labelStyle={{ textTransform: "none" }}
                  onPress={proceedToCancelPreBooking}
                >
                  Proceed To Cancellation
                </Button>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        visible={receiptDocModel}
        onRequestClose={() => setReceiptDocModel(false)}
        transparent={true}
      >
        <View style={styles.modelMainContainer}>
          <View style={styles.modelContainer}>
            <TouchableOpacity
              onPress={() => {
                setReceiptDocModel(false);
                // setIsEdit(true);
                setShowApproveRejectBtn(true);
                // new conditions
                setIsEditButtonShow(false);
                setIsSubmitCancelButtonShow(true);
              }}
              style={styles.TochableClose}
            >
              <View style={styles.closeVIew}>
                <Text style={{ fontSize: 16 }}>{"X"}</Text>
              </View>
            </TouchableOpacity>
            {/* <View style={styles.closeContainer}
             >
              <IconButton
                icon="close-circle"
                color={Colors.RED}
                style={{ margin: 0 }}
                size={25}
                onPress={() => {
                  setReceiptDocModel(false);
                  // setIsEdit(true);
                  setShowApproveRejectBtn(true);
                  // new conditions
                  setIsEditButtonShow(false);
                  setIsSubmitCancelButtonShow(true);
                }}
              />
            </View> */}

            <View style={styles.recDocTitleContainer}>
              <Text style={styles.recDocTitleText}>
                Please upload receipt or Edit details
              </Text>
            </View>

            <View style={styles.photoOptionContainer}>
              <TouchableOpacity
                style={styles.photoOptionBtn}
                onPress={() => {
                  setReceiptDocModel(false);
                  setOpenAccordian("12");
                  scrollToPos(12);
                }}
              >
                <Text style={styles.photoOptionBtnText}>Upload Recepit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoOptionBtn, { paddingHorizontal: 30 }]}
                onPress={() => {
                  setReceiptDocModel(false);
                  setIsEdit(true);
                  setShowApproveRejectBtn(false);
                  // new conditions
                  setIsEditButtonShow(false);
                  setIsSubmitCancelButtonShow(true);
                }}
              >
                <Text style={styles.photoOptionBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        visible={imagePath !== ""}
        onRequestClose={() => {
          setImagePath("");
        }}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View style={{ width: "90%" }}>
            <Image
              style={{ width: "100%", height: 400, borderRadius: 4 }}
              resizeMode="contain"
              source={{ uri: imagePath }}
            />
          </View>
          <TouchableOpacity
            style={{
              width: 100,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              left: "37%",
              bottom: "15%",
              borderRadius: 5,
              backgroundColor: Colors.RED,
            }}
            onPress={() => setImagePath("")}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: Colors.WHITE,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* {selector.isLoading ? <LoaderComponent
                visible={true}
                onRequestClose={() => { }}
            /> :null } */}
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
    paddingVertical: 5,
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
    fontWeight: "700",
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
  prebookingBtnView: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  selectedImageBckVw: {
    paddingLeft: 12,
    paddingRight: 10,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  selectedImageTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    width: "80%",
    color: Colors.DARK_GRAY,
  },
  accordianBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
  },
  accessoriText: {
    fontSize: 10,
    fontWeight: "400",
    color: Colors.GRAY,
  },
  leftLabel: {
    fontSize: 14,
    fontWeight: "400",
    maxWidth: "70%",
    color: Colors.GRAY,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 16,
    // borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  otherPriceInput: {
    backgroundColor: Colors.LIGHT_GRAY,
    width: "25%",
    height: 50,
    borderBottomWidth: 1,
  },
  otherPriceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    paddingTop: 7,
  },
  addIcon: {
    backgroundColor: Colors.RED,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 20,
  },
  otherPriceTextStyle: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.GRAY,
    paddingLeft: 12,
  },
  addmodelView: {
    width: "40%",
    margin: 5,
    borderRadius: 5,
    backgroundColor: Colors.PINK,
    height: 40,
    alignSelf: "flex-end",
    alignContent: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  addmodeltxt: {
    fontSize: 16,
    textAlign: "center",
    textAlignVertical: "center",
    color: Colors.WHITE,
    width: "100%",
  },
  previewBtn: {
    width: "20%",
    height: 30,
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  previetxt: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: "600",
  },

  modelMainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modelContainer: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
    padding: 15,
    alignSelf: "center",
  },
  closeContainer: {
    position: "absolute",
    right: 0,
    top: -35,
  },
  recDocTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  recDocTitleText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  photoOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 7,
  },
  chooseTitleText: {
    marginTop: 15,
    alignSelf: "center",
  },
  photoOptionBtn: {
    borderRadius: 5,
    backgroundColor: Colors.RED,
    padding: 10,
  },
  photoOptionBtnText: {
    color: Colors.WHITE,
  },
  TochableClose: { position: 'absolute', right: -40, top: -40, padding: 30 },
  closeVIew: {

  borderRadius: 15, width: 30, height: 30, 
    borderColor: Colors.PINK, borderWidth: 1, backgroundColor: Colors.PINK,
      justifyContent: 'center', alignItems: 'center'
}
});
