import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ButtonComp } from "../../../components";
import { Checkbox, Button, IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../../../styles";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
} from "../../../components";
import { EmsStackIdentifiers } from "../../../navigations/appNavigator";
import {
  clearState,
  setCreateEnquiryCheckbox,
  setPreEnquiryDetails,
  setDropDownData,
  createPreEnquiry,
  updatePreEnquiry,
  setCustomerTypeList,
  setExistingDetails,
  continueToCreatePreEnquiry,
  getEventListApi,
  updateSelectedDate,
  updateEnqStatus,
  getEventConfigList,
  getPreEnquiryDetails,
  getCustomerTypesApi,
  getEnquiryTypesApi,
} from "../../../redux/addPreEnquiryReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  isMobileNumber,
  isEmail,
  isPincode,
  convertToDate,
  GetCarModelList,
  PincodeDetailsNew,
} from "../../../utils/helperFunctions";
import { sales_url } from "../../../networking/endpoints";
import realm from "../../../database/realm";
import { AppNavigator } from "../../../navigations";
import { DropDownSelectionItem, DateSelectItem } from "../../../pureComponents";
import * as AsyncStore from "../../../asyncStore";
import {
  showAlertMessage,
  showToast,
  showToastRedAlert,
  showToastSucess,
} from "../../../utils/toast";
import URL from "../../../networking/endpoints";
import {
  isValidateAlphabetics,
  isValidate,
  PincodeDetails,
} from "../../../utils/helperFunctions";
import moment from "moment";
import { EmsTopTabNavigatorIdentifiers } from "../../../navigations/emsTopTabNavigator";
import Fontisto from "react-native-vector-icons/Fontisto";
import { client } from "../../../networking/client";

const screenWidth = Dimensions.get("window").width;
let EventListData = [
  {
    eventName: "omega thon",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 0,
  },
  {
    eventName: "omega thon22",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 1,
  },
  {
    eventName: "omega thon22",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 2,
  },
  {
    eventName: "omega thon22",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 3,
  },
  {
    eventName: "omega thon22",
    eventLocation: "Ahmedabad",
    Startdate: "10/12/2022",
    Enddate: "10/12/2022",
    isSelected: false,
    id: 4,
  },
];
const AddPreEnquiryScreen = ({ route, navigation }) => {
  const selector = useSelector((state) => state.addPreEnquiryReducer);
  const homeSelector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [organizationId, setOrganizationId] = useState(0);
  const [branchId, setBranchId] = useState(0);
  const [employeeName, setEmployeeName] = useState("");
  const [userData, setUserData] = useState({
    branchId: "",
    orgId: "",
    employeeId: "",
    employeeName: "",
  });
  const [existingPreEnquiryDetails, setExistingPreEnquiryDetails] = useState(
    {}
  );
  const [fromEdit, setFromEdit] = useState(false);
  const [isSubmitEnable, setIsSubmitEnable] = useState(true);
  const [dataForCarModels, setDataForCarModels] = useState([]);
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [oId, setOid] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showEventModel, setShowEventModel] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");
  const [userToken, setUserToken] = useState("");
  const [firstNameErrorHandler, setFirstNameErrorHandler] = useState({
    showError: false,
    msg: "",
  });
  const [lastNameErrorHandler, setLastNameErrorHandler] = useState({
    showError: false,
    msg: "",
  });
  const [subSourceData, setSubSourceData] = useState([]);
  const [address, setAddress] = useState({
    Name: "",
    Description: "",
    BranchType: "",
    DeliveryStatus: "",
    Circle: "",
    District: "",
    Division: "",
    Region: "",
    Block: "",
    State: "",
    Country: "",
    Pincode: "",
  });
  const [isSubmitPress, setIsSubmitPress] = useState(false);
  const [isEventListModalVisible, setisEventListModalVisible] = useState(false);

  const [eventListdata, seteventListData] = useState([]);
  const [selectedEventData, setSelectedEventData] = useState([]);
  const [eventConfigRes, setEventConfigRes] = useState([]);

  useEffect(async () => {
     getAsyncstoreData();
    getBranchId();
    getAuthToken();
    // getCustomerTypeListFromDB();
    const UnSubscribe = navigation.addListener("focus", () => {
      if (route.params?.fromEdit === false) {
        dispatch(clearState());
      }
    });

    return UnSubscribe;
  }, []);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );

    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({
        orgId: jsonObj.orgId,
        employeeId: jsonObj.empId,
        employeeName: jsonObj.empName,
      });
      setOrganizationId(jsonObj.orgId);
      setEmployeeName(jsonObj.empName);
      getCarModelListFromServer(jsonObj.orgId);
      Promise.all([
        dispatch(getCustomerTypesApi(jsonObj.orgId)),
        dispatch(getEnquiryTypesApi(jsonObj.orgId)),
      ])
        .then(() => {
          setExistingData();
        })
        .catch(() => {
          setExistingData();
        });

      if (jsonObj.hrmsRole === "Reception") {
        // const resultAry = homeSelector.source_of_enquiry_list.filter(
        //   (item) => item.name == "Showroom"
        // );
        // if (resultAry.length > 0) {
        //   dispatch(
        //     setDropDownData({
        //       key: "SOURCE_OF_ENQUIRY",
        //       value: resultAry[0].name,
        //       id: resultAry[0].id,
        //     })
        //   );
        // }
      } else if (jsonObj.hrmsRole === "Tele Caller") {
        // const resultAry = homeSelector.source_of_enquiry_list.filter(
        //   (item) => item.name == "Digital Marketing"
        // );
        // if (resultAry.length > 0) {
        //   dispatch(
        //     setDropDownData({
        //       key: "SOURCE_OF_ENQUIRY",
        //       value: resultAry[0].name,
        //       id: resultAry[0].id,
        //     })
        //   );
        // }
      }
    }
  };

  const setExistingData = async () => {
    if (route.params?.fromEdit != null && route.params.fromEdit === true) {
      const preEnquiryDetails = route.params.preEnquiryDetails;
      const fromEdit = route.params.fromEdit;
      // Promise.all([
      //     dispatch(getPreEnquiryDetails(preEnquiryDetails.universalId))
      // ]).then((res) => {
      // })
      setExistingPreEnquiryDetails(preEnquiryDetails);
      setFromEdit(fromEdit);
      dispatch(setExistingDetails(preEnquiryDetails));
    }
  };

  const getCustomerTypeListFromDB = () => {
    const data = realm.objects("CUSTOMER_TYPE_TABLE");
    dispatch(setCustomerTypeList(JSON.stringify(data)));
  };

  const showSucessAlert = (itemData) => {
    const title = `Contact Successfully Created \n Ref Num: ${itemData.referencenumber}`;

    Alert.alert(
      title,
      "Do you want to continue to create Enquiry",
      [
        {
          text: "No, Thanks",
          style: "cancel",
          onPress: () => {
            navigation.navigate(EmsTopTabNavigatorIdentifiers.preEnquiry, {
              isContactRefresh: true,
            });
          },
        },
        {
          text: "Create Enquiry",
          onPress: () => {
            navigation.navigate(
              AppNavigator.EmsStackIdentifiers.confirmedPreEnq,
              {
                itemData,
                fromCreatePreEnquiry: true,
              }
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  const confirmToCreateLeadAgain = (response) => {
    // "Continue To Create a Lead"
    Alert.alert(
      response.message,
      "",
      [
        {
          text: "Ok",
          style: "cancel",
        },
        // {
        //   text: "Create Lead",
        //   onPress: () => proceedToCreateLeadMethod(response),
        // },
      ],
      { cancelable: false }
    );
  };

  const checkPincode = (pincode) => {
    return new Promise((resolve, reject) => {
      PincodeDetailsNew(pincode).then((res) => {
        if (res) {
          if (res.length > 0) {
            if (res[0]?.Status === "Error") {
              resolve(false);
            } else {
              resolve(true);
            }
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    });
  };

  const getBranchId = () => {
    AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID).then((branchId) => {
      setBranchId(branchId);
    });
  };

  const getAuthToken = () => {
    AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
      setUserToken(token);
    });
  };

  const getCarModelListFromServer = (orgId) => {
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
              });
            });
          }
          setDataForCarModels([...modalList]);
        },
        (rejected) => {}
      )
      .finally(() => {
        // Get Enquiry Details
      });
  };

  const gotoConfirmPreEnquiryScreen = (response) => {
    if (response.hasOwnProperty("dmsEntity")) {
      let dmsEn;
      if (response.dmsEntity.hasOwnProperty("dmsContactDto")) {
        dmsEn = response.dmsEntity.dmsContactDto;
      } else {
        dmsEn = response.dmsEntity.dmsAccountDto;
      }
      let dms = response.dmsEntity.dmsLeadDto;
      let itemData = {};
      itemData.leadId = dms.id;
      itemData.firstName = dms.firstName;
      itemData.lastName = dms.lastName;
      itemData.phone = dms.phone;
      itemData.customerType = dmsEn.customerType;
      itemData.email = dms.email;
      itemData.model = dms.model;
      itemData.enquirySegment = dms.enquirySegment;
      itemData.createdDate = dms.createddatetime;
      itemData.enquirySource = dms.enquirySource;
      itemData.subSource = dms.subSource;
      itemData.pincode = dms.dmsAddresses ? dms.dmsAddresses[0].pincode : "";
      itemData.leadStage = dms.leadStage;
      itemData.universalId = dms.crmUniversalId;
      itemData.referencenumber = dms.referencenumber;
      if (selectedEventData.length > 0) {
        (itemData.eventId = selectedEventData[0].eventId),
          (itemData.eventName = selectedEventData[0].name),
          (itemData.eventLocation = selectedEventData[0]?.location),
          (itemData.eventStartDate = selectedEventData[0].startdate),
          (itemData.eventEndDate = selectedEventData[0].enddate);
      } else {
        (itemData.eventId = ""),
          (itemData.eventName = ""),
          (itemData.eventLocation = ""),
          (itemData.eventStartDate = ""),
          (itemData.eventEndDate = "");
      }
      if (!fromEdit) {
        showSucessAlert(itemData);
      } else {
        showSucessAlert("Successfully Updated");
        navigation.popToTop();
      }
      dispatch(clearState());
    } else {
      if (response.accountId != null && response.contactId != null) {
        confirmToCreateLeadAgain(response);
      } else {
        showToast(response.message || "something went wrong");
      }
    }
  };

  const proceedToCreateLeadMethod = (data) => {
    let formData = {
      branchId: branchId,
      createdBy: employeeName,
      dmsaccountid: data.accountId,
      dmscontactid: data.contactId,
      enquirySegment: selector.enquiryType,
      firstName: selector.firstName,
      lastName: selector.lastName,
      leadStage: "PREENQUIRY",
      model: selector.carModel,
      organizationId: organizationId,
      phone: selector.mobile,
      sourceOfEnquiry: selector.sourceOfEnquiryId,
      subSourceOfEnquiry: selector.subSourceOfEnquiry,
      eventCode: "",
      email: selector.email,
      referencenumber: "",
      pincode: selector.pincode,
      dmsAddresses: [
        {
          addressType: "Communication",
          houseNo: "",
          street: "",
          city: "",
          district: "",
          pincode: selector.pincode,
          state: "",
          village: "",
          county: "India",
          rural: false,
          urban: true,
          id: 0,
        },
        {
          addressType: "Permanent",
          houseNo: "",
          street: "",
          city: "",
          district: "",
          pincode: selector.pincode,
          state: "",
          village: "",
          county: "India",
          rural: false,
          urban: true,
          id: 0,
        },
      ],
    };

    const url = URL.CREATE_CONTACT() + "/lead?allocateDse=false";
    let dataObj = {
      url: url,
      body: formData,
    };
    dispatch(createPreEnquiry(dataObj));
  };

  const submitClicked = async () => {
    Keyboard.dismiss();
    setIsSubmitPress(true);
    // if (
    //     selector.enquiryType.length == 0 ||
    //     selector.customerType.length == 0 ||
    //     selector.firstName.length == 0 ||
    //     selector.lastName.length == 0 ||
    //     selector.mobile.length == 0 ||
    //     selector.carModel.length == 0 ||
    //     selector.sourceOfEnquiry.length == 0 ||
    //     selector.subSourceOfEnquiry.length == 0
    // ) {
    //     showToastRedAlert("Please fill required fields");
    //     return;
    // }
    if (selector.firstName.length == 0) {
      showToastRedAlert("Please enter first name");
      return;
    }
    if (selector.lastName.length == 0) {
      showToastRedAlert("Please enter last name");
      return;
    }
    if (selector.mobile.length == 0) {
      showToastRedAlert("Please enter mobile number");
      return;
    }
    if (selector.carModel.length == 0) {
      showToastRedAlert("Please select model");
      return;
    }
    if (selector.sourceOfEnquiry.length == 0) {
      showToastRedAlert("Please select source of lead");
      return;
    }
    if (!fromEdit && subSourceData.length > 0 && !selector.subSourceOfEnquiry) {
      showToastRedAlert("Please select sub source of lead");
      return;
    }
    if (selector.enquiryType.length == 0) {
      showToastRedAlert("Please select enquiry segment");
      return;
    }
    if (selector.customerType.length == 0) {
      showToastRedAlert("Please select customer type");
      return;
    }
    // if (selector.sourceOfEnquiry.length > 0 && selector.subSourceOfEnquiry.length == 0) {
    //     showToastRedAlert("Please select sub source of lead");
    //     return;
    // }
    if (selector.enquiryType === "Personal") {
      if (selector.customerType === "Government") {
        if (
          selector.companyName.length > 0 &&
          !isValidateAlphabetics(selector.companyName)
        ) {
          showToast("Please enter alphabetics only Company Name");
          return;
        }
      }
    }

    if (
      selector.enquiryType === "Personal" &&
      selector.customerType === "Other"
    ) {
      if (selector.other.length > 0 && !isValidateAlphabetics(selector.other)) {
        showToast("Please enter the alphabets only in other");
        return;
      }
    }

    if (!fromEdit) {
      if (selector.pincode.length == 0) {
        showToastRedAlert("Please fill pincode");
        return;
      }
    }

    checkPincode(selector.pincode).then((status) => {
      if (!status) {
        showToastRedAlert("Please enter valid pincode");
        return;
      }
    });

    const enquirySegmentName = selector.enquiryType
      .replace(/\s/g, "")
      .toLowerCase();
    if (
      enquirySegmentName !== "commercial" &&
      enquirySegmentName !== "company"
    ) {
      if (!isValidate(selector.firstName)) {
        // showToast("please enter alphabetics only in firstname ");
        setFirstNameErrorHandler({
          showError: true,
          msg: "please enter alphabetics only",
        });
        return;
      }
      if (!isValidate(selector.lastName)) {
        // showToast("please enter alphabetics only in lastname ");
        setLastNameErrorHandler({
          showError: true,
          msg: "please enter alphabetics only",
        });
        return;
      }
    }
    if (selector.mobile.length > 0 && !isMobileNumber(selector.mobile)) {
      showToast("Please enter valid number");
      return;
    }
    if (
      selector.alterMobile.length > 0 &&
      !isMobileNumber(selector.alterMobile)
    ) {
      showToast("Please enter valid alternate mobile number");
      return;
    }

    if (selector.email.length > 0 && !isEmail(selector.email)) {
      showToast("Please enter valid email");
      return;
    }

    if (!fromEdit) {
      if (selector.pincode.length > 0 && !isPincode(selector.pincode)) {
        showToast("Please enter valid pincode");
        return;
      }
    }

    // Get Pincode details from server
    if (selector.sourceOfEnquiry === "Event") {
      if (selector.eventName.length > 0) {
        showToast("Please select event details");
        return;
      }
    }

    // check if events are selected
    if (selector.sourceOfEnquiry === "Events") {
      if (selectedEventData.length <= 0) {
        showToast("Please select event details");
        return;
      }
    }

    setIsSubmitEnable(false);
    if (fromEdit) {
      updatePreEneuquiryDetails();
      return;
    }

    GetPincodeDetails(selector.pincode)
      .then((data) => {
        // Genereate new ref number
        getReferenceNumber(data);
      })
      .catch((err) => {
        setIsSubmitEnable(true);
      });
  };

  const GetPincodeDetails = (pincode) => {
    return new Promise((resolve, reject) => {
      PincodeDetails(pincode).then(
        (data) => {
          // update address
          // setAddress({ block: data.Block || "", district: data.District || "", region: data.Region || "", state: data.State || "" })
          setAddress(data);
          resolve(data);
        },
        (rejected) => {
          reject();
        }
      );
    });
  };

  const getReferenceNumber = async (addressObj) => {
    const bodyObj = {
      branchid: Number(branchId),
      leadstage: "PREENQUIRY",
      orgid: userData.orgId,
    };

    // await fetch(URL.CUSTOMER_LEAD_REFERENCE(), {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "auth-token": userToken,
    //   },
    //   body: JSON.stringify(bodyObj),
    // })
    await client
      .post(URL.CUSTOMER_LEAD_REFERENCE(), bodyObj)
      .then((response) => response.json())
      .then((jsonObj) => {
        if (jsonObj.success == true) {
          const dmsEntiry = jsonObj.dmsEntity;
          const refNumber = dmsEntiry.leadCustomerReference.referencenumber;
          makeCreatePreEnquiry(refNumber, addressObj);
        } else {
          showToast("Refrence number failed");
          setIsSubmitEnable(true);
        }
      })
      .catch((error) => {
        showToastRedAlert(error.message);
        setIsSubmitEnable(true);
      });
  };

  const makeCreatePreEnquiry = (refNumber, addressObj) => {
    const dmsContactDtoObj = {
      branchId: Number(branchId),
      createdBy: employeeName,
      customerType: selector.customerType,
      firstName: selector.firstName,
      lastName: selector.lastName,
      modifiedBy: employeeName,
      orgId: organizationId,
      phone: selector.mobile,
      company: selector.companyName ? selector.companyName : selector.other,
      otherCustomerType: selector.other,
      email: selector.email,
      enquirySource: selector.sourceOfEnquiryId,
      subSource: selector.subSourceOfEnquiryId,
      ownerName: employeeName,
      secondaryPhone: selector.alterMobile,
      status: "PREENQUIRY",
      pincode: selector.pincode,
    };

    let dmsLeadEventDto;
    if (selectedEventData.length > 0) {
      dmsLeadEventDto = {
        id: selectedEventData[0].id,
        eventId: selectedEventData[0].eventId,
        eventName: selectedEventData[0].name,
        eventLocation: selectedEventData[0]?.location,
        startDate: selectedEventData[0].startdate,
        endDate: selectedEventData[0].enddate,
      };
    } else {
      dmsLeadEventDto = {};
    }

    const dmsLeadDtoObj = {
      branchId: Number(branchId),
      createdBy: employeeName,
      enquirySegment: selector.enquiryType,
      firstName: selector.firstName,
      lastName: selector.lastName,
      email: selector.email,
      leadStage: "PREENQUIRY",
      organizationId: organizationId,
      phone: selector.mobile,
      model: selector.carModel,
      sourceOfEnquiry: selector.sourceOfEnquiryId,
      subSource: selector.subSourceOfEnquiry,
      eventCode: dmsLeadEventDto.id,
      referencenumber: refNumber,
      pincode: selector.pincode,
      dmsAddresses: [
        {
          addressType: "Communication",
          houseNo: "",
          street: "",
          city: addressObj.Circle,
          district: addressObj.District,
          pincode: selector.pincode,
          state: addressObj.State,
          village: "",
          county: addressObj.Country,
          rural: false,
          urban: true,
          id: 0,
        },
        {
          addressType: "Permanent",
          houseNo: "",
          street: "",
          city: addressObj.Circle,
          district: addressObj.District,
          pincode: selector.pincode,
          state: addressObj.State,
          village: "",
          county: addressObj.Country,
          rural: false,
          urban: true,
          id: 0,
        },
      ],
    };

    // http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8081

    let url = sales_url;
    let formData = {};
    if (selector.customerType === "Individual") {
      url = url + "/contact?allocateDse=" + selector.create_enquiry_checked;
      formData = {
        dmsContactDto: dmsContactDtoObj,
        dmsLeadDto: dmsLeadDtoObj,
        dmsLeadEventDto: dmsLeadEventDto,
      };
    } else {
      url = url + "/account?allocateDse=" + selector.create_enquiry_checked;
      formData = {
        dmsAccountDto: dmsContactDtoObj,
        dmsLeadDto: dmsLeadDtoObj,
        dmsLeadEventDto: dmsLeadEventDto,
      };
    }

    let dataObj = {
      url: url,
      body: formData,
    };
    dispatch(createPreEnquiry(dataObj));
  };

  // Handle Create Enquiry response
  useEffect(() => {
    if (selector.createEnquiryStatus === "success") {
      setIsSubmitEnable(true);
      gotoConfirmPreEnquiryScreen(selector.create_enquiry_response_obj);
    } else if (selector.createEnquiryStatus === "failed") {
      setIsSubmitEnable(true);
      if (
        selector.create_enquiry_response_obj &&
        selector.create_enquiry_response_obj.accountId != null &&
        selector.create_enquiry_response_obj.contactId != null
      ) {
        confirmToCreateLeadAgain(selector.create_enquiry_response_obj);
      } else {
        showToast(
          selector.create_enquiry_response_obj.message || "something went wrong"
        );
      }
    }
  }, [selector.createEnquiryStatus, selector.create_enquiry_response_obj]);

  // Handle update Enquiry response
  useEffect(() => {
    if (selector.updateEnquiryStatus === "success") {
      setIsSubmitEnable(true);
      dispatch(updateEnqStatus(""));
      showToastSucess("Contact successfully updated");
      navigation.navigate(EmsTopTabNavigatorIdentifiers.preEnquiry, {
        isContactRefresh: true,
      });
    } else if (selector.updateEnquiryStatus === "failed") {
      setIsSubmitEnable(true);
      if (
        selector.create_enquiry_response_obj &&
        selector.create_enquiry_response_obj.accountId != null &&
        selector.create_enquiry_response_obj.contactId != null
      ) {
        confirmToCreateLeadAgain(selector.create_enquiry_response_obj);
      } else {
        showToast(
          selector.create_enquiry_response_obj.message || "something went wrong"
        );
      }
    }
  }, [selector.updateEnquiryStatus, selector.create_enquiry_response_obj]);

  useEffect(() => {
    if (selector.event_list_response_Config_status === "success") {
      //todo

      let data = selector.event_list_Config;

      if (data) {
        let addSelectedFlag = data.content.map((i) => ({
          ...i,
          isSelected: false,
        }));

        // setEventConfigRes(addSelectedFlag)
        seteventListData(addSelectedFlag);
        setisEventListModalVisible(true);
      }
    }
  }, [selector.event_list_response_Config_status]);

  const updatePreEneuquiryDetails = () => {
    const { dmsAddressList } = route.params.preEnquiryDetails;
    let url = sales_url;
    let dmsAccountOrContactDto = {};
    let dmsLeadDto = {};
    let newDmsAddressList = [];

    // for (let i = 0; i < newDmsAddressList.length; i++) {
    //   newDmsAddressList[i].pincode = selector.pincode;
    // }

    dmsAddressList.forEach((item) => {
      let newObj = { ...item, pincode: selector.pincode };
      newDmsAddressList.push(newObj);
    });

    if (existingPreEnquiryDetails.hasOwnProperty("dmsContactDto")) {
      url = url + "/contact?allocateDse=" + selector.create_enquiry_checked;
      dmsAccountOrContactDto = { ...existingPreEnquiryDetails.dmsContactDto };
    } else if (existingPreEnquiryDetails.hasOwnProperty("dmsAccountDto")) {
      url = url + "/account?allocateDse=" + selector.create_enquiry_checked;
      dmsAccountOrContactDto = { ...existingPreEnquiryDetails.dmsAccountDto };
    }

    dmsAccountOrContactDto.firstName = selector.firstName;
    dmsAccountOrContactDto.lastName = selector.lastName;
    dmsAccountOrContactDto.email = selector.email;
    dmsAccountOrContactDto.phone = selector.mobile;
    dmsAccountOrContactDto.secondaryPhone = selector.alterMobile;
    dmsAccountOrContactDto.model = selector.carModel;
    dmsAccountOrContactDto.company = selector.companyName
      ? selector.companyName
      : selector.other;
    dmsAccountOrContactDto.otherCustomerType = selector.other;

    dmsAccountOrContactDto.customerType = selector.customerType;
    dmsAccountOrContactDto.enquirySource = selector.sourceOfEnquiryId;
    dmsAccountOrContactDto.subSource = selector.subSourceOfEnquiry;
    dmsAccountOrContactDto.pincode = selector.pincode;

    if (existingPreEnquiryDetails.hasOwnProperty("dmsLeadDto")) {
      dmsLeadDto = { ...existingPreEnquiryDetails.dmsLeadDto };
      dmsLeadDto.firstName = selector.firstName;
      dmsLeadDto.lastName = selector.lastName;
      dmsLeadDto.email = selector.email;
      dmsLeadDto.phone = selector.mobile;
      dmsLeadDto.secondaryPhone = selector.alterMobile;
      dmsLeadDto.model = selector.carModel;

      dmsLeadDto.enquirySegment = selector.enquiryType;
      dmsLeadDto.sourceOfEnquiry = selector.sourceOfEnquiryId;
      dmsLeadDto.subSourceOfEnquiry = selector.subSourceOfEnquiryId;
      dmsLeadDto.enquirySource = selector.sourceOfEnquiry;
      dmsLeadDto.subSource = selector.subSourceOfEnquiry;
      dmsLeadDto.dmsAddresses = newDmsAddressList;
      dmsAccountOrContactDto.company = selector.companyName
        ? selector.companyName
        : selector.other;
      dmsAccountOrContactDto.otherCustomerType = selector.other;
    }

    let formData = {};
    if (existingPreEnquiryDetails.hasOwnProperty("dmsContactDto")) {
      formData = {
        dmsContactDto: dmsAccountOrContactDto,
        dmsLeadDto: dmsLeadDto,
        dmsEmployeeAllocationDtos:
          existingPreEnquiryDetails.dmsEmployeeAllocationDtos,
        dmsAddressList: newDmsAddressList,
      };
    } else {
      formData = {
        dmsAccountDto: dmsAccountOrContactDto,
        dmsLeadDto: dmsLeadDto,
        dmsEmployeeAllocationDtos:
          existingPreEnquiryDetails.dmsEmployeeAllocationDtos,
        dmsAddressList: newDmsAddressList,
      };
    }

    let dataObj = {
      url: url,
      body: formData,
    };
    dispatch(updatePreEnquiry(dataObj));
  };

  const showDropDownModelMethod = (key, headerText, oid) => {
    Keyboard.dismiss();
    switch (key) {
      case "CAR_MODEL":
        setDataForDropDown([...dataForCarModels]);
        break;
      case "ENQUIRY_SEGMENT":
        if (selector.enquiry_type_list.length === 0) {
          showToast("No Enquiry Types found");
          return;
        }
        let eData = selector.enquiry_type_list;
        let eNewData = eData?.map((val) => {
          return {
            ...val,
            name: val?.segment_type,
          };
        });
        setDataForDropDown([...eNewData] || []);
        // }
        break;

      case "CUSTOMER_TYPE":
        if (
          selector.customer_type_list?.length === 0 ||
          !selector.enquiryType
        ) {
          showToast("No Customer Types found");
          return;
        }
        let cData = selector.customer_type_list;
        let cNewData = cData?.map((val) => {
          return {
            ...val,
            name: val?.customer_type,
          };
        });
        setDataForDropDown([...cNewData]);

        break;
      case "SOURCE_OF_ENQUIRY":
        if (homeSelector.source_of_enquiry_list.length === 0) {
          showToast("No data found");
          return;
        } else {
        }
        setDataForDropDown([...homeSelector.source_of_enquiry_list]);
        break;
      case "SUB_SOURCE_OF_ENQUIRY":
        setDataForDropDown([...subSourceData]);
        break;
      case "EVENT_NAME":
        if (homeSelector.event_list.length === 0) {
          showToast("No events found");
          return;
        }
        setDataForDropDown([...selector.event_list]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key);
  };

  const getEventListFromServer = (startDate, endDate) => {
    if (
      startDate === undefined ||
      startDate === null ||
      endDate === undefined ||
      endDate === null
    ) {
      return;
    }

    const payload = {
      startDate: startDate,
      endDate: endDate,
      empId: userData.employeeId,
      branchId: branchId,
      orgId: userData.orgId,
    };
    dispatch(getEventListApi(payload));
  };

  const getEventConfigListFromServer = (startDate, endDate) => {
    if (
      startDate === undefined ||
      startDate === null ||
      endDate === undefined ||
      endDate === null
    ) {
      return;
    }

    const payload = {
      startDate: startDate,
      endDate: endDate,
      empId: userData.employeeId,
      branchId: branchId,
      orgId: userData.orgId,
    };
    dispatch(getEventConfigList(payload));
  };

  // Handle When Event dates selected
  useEffect(() => {
    if (selector.eventStartDate && selector.eventEndDate) {
      getEventListFromServer(selector.eventStartDate, selector.eventEndDate);
    }
  }, [selector.eventStartDate, selector.eventEndDate]);

  const updateSubSourceData = (item) => {
    if (item.subsource && item.subsource.length > 0) {
      const updatedData = [];
      item.subsource.forEach((subItem, index) => {
        const newItem = { ...subItem };
        newItem.name = subItem.subSource;
        if (newItem.status === "Active") {
          updatedData.push(newItem);
        }
      });
      setSubSourceData(updatedData);
    } else {
      setSubSourceData([]);
    }
  };

  const addSelectedEvent = () => {
    // todo add api call

    let findSelected = eventListdata.filter((item) => {
      if (item.isSelected === true) {
        return item;
      }
    });

    if (findSelected.length > 0) {
      setSelectedEventData(findSelected);
      setisEventListModalVisible(false);
    } else {
      showToast("Please select event");
    }
  };

  const eventListTableRow = useCallback(
    (
      txt1,
      txt2,
      txt3,
      txt4,
      isDisplayRadio,
      isRadioSelected,
      isClickable,
      itemMain,
      index
    ) => {
      return (
        <>
          <TouchableOpacity
            style={styles.eventTouchable}
            disabled={isClickable}
            onPress={() => {
              // let temp = [...eventListdata].filter(item => item.id === itemMain.id).map(i => i.isSelected = true)
              let temp = eventListdata.map((i) =>
                i.id === itemMain.id
                  ? { ...i, isSelected: true }
                  : { ...i, isSelected: false }
              );

              seteventListData(temp);
            }}
          >
            {/* todo */}
            {isDisplayRadio ? (
              <Fontisto
                name={
                  itemMain.isSelected ? "radio-btn-active" : "radio-btn-passive"
                }
                size={12}
                color={Colors.RED}
                style={{ marginEnd: 10 }}
              />
            ) : (
              <View style={{ marginEnd: 10, width: 12 }}>{}</View>
            )}

            <Text numberOfLines={1} style={styles.eventText}>
              {txt1}
            </Text>
            <Text numberOfLines={1} style={styles.eventText}>
              {txt2}
            </Text>
            <Text numberOfLines={1} style={styles.eventText}>
              {txt3}
            </Text>
            <Text numberOfLines={1} style={styles.eventText}>
              {txt4}
            </Text>
          </TouchableOpacity>
        </>
      );
    }
  );

  const addEventListModal = () => {
    return (
      <Modal
        animationType="fade"
        visible={isEventListModalVisible}
        onRequestClose={() => {}}
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
          <View style={styles.modelView}>
            <Text style={styles.selectTitle}>Select Event</Text>
            <ScrollView
              style={{
                width: "100%",
              }}
              horizontal={true}
            >
              <View style={{ flexDirection: "column" }}>
                <Text style={GlobalStyle.underline} />
                <View
                  style={{
                    height: 30,
                    borderBottomColor: "rgba(208, 212, 214, 0.7)",
                    borderBottomWidth: 2,
                  }}
                >
                  {eventListTableRow(
                    "Event Name",
                    "Event location",
                    "Start Date",
                    "End Date",
                    false,
                    false,
                    true,
                    0,
                    0
                  )}
                  {/* <Text style={GlobalStyle.underline} /> */}
                </View>
                <View>
                  <FlatList
                    key={"EVENT_LIST"}
                    data={eventListdata}
                    style={{ height: "80%" }}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={{ alignItems: "center", marginVertical: 20 }}
                        >
                          <Text>{"Data Not Available"}</Text>
                        </View>
                      );
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <>
                          <View
                            style={{
                              height: 35,
                              borderBottomColor: "rgba(208, 212, 214, 0.7)",
                              borderBottomWidth: 4,
                              marginTop: 5,
                            }}
                          >
                            {eventListTableRow(
                              item.name,
                              item?.location,
                              moment(item.startdate).format("DD-MM-YYYY"),
                              moment(item.enddate).format("DD-MM-YYYY"),
                              true,
                              false,
                              false,
                              item,
                              index
                            )}
                          </View>
                        </>
                      );
                    }}
                  />
                </View>
              </View>
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                marginTop: 10,
              }}
            >
              <Button
                mode="contained"
                style={{ flex: 1, marginRight: 10 }}
                color={Colors.GRAY}
                labelStyle={{ textTransform: "none" }}
                onPress={() => {
                  setisEventListModalVisible(false);
                  // todo
                  seteventListData([]);
                }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                style={{ flex: 1 }}
                color={Colors.PINK}
                labelStyle={{ textTransform: "none" }}
                onPress={() => addSelectedEvent()}
              >
                Add
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* // select modal */}
      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (dropDownKey === "SOURCE_OF_ENQUIRY") {
            setSelectedEventData([]);
            if (item.name === "Events") {
              const startOfMonth = moment()
                .startOf("month")
                .format("YYYY-MM-DD");
              const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
              getEventConfigListFromServer(startOfMonth, endOfMonth);
              // setisEventListModalVisible(true);
            }
            if (item.name === "Event") {
              getEventListFromServer();
            }
            updateSubSourceData(item);
          }
          setShowDropDownModel(false);
          dispatch(
            setDropDownData({
              key: dropDownKey,
              value: item.name,
              id: item.id,
              orgId: userData.orgId,
            })
          );
        }}
      />

      {addEventListModal()}

      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {
          if (Platform.OS === "android") {
            if (selectedDate) {
              dispatch(
                updateSelectedDate({ key: datePickerId, text: selectedDate })
              );
            }
          } else {
            dispatch(
              updateSelectedDate({ key: datePickerId, text: selectedDate })
            );
          }
          setShowDatePicker(false);
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.view1}>
            <Text style={styles.text1}>{"Create New Contact"}</Text>
            {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox.Android
                status={
                  selector.create_enquiry_checked ? "checked" : "unchecked"
                }
                uncheckedColor={Colors.DARK_GRAY}
                color={Colors.RED}
                onPress={() => dispatch(setCreateEnquiryCheckbox())}
              />
              <Text style={styles.text2}>{"Create enquiry"}</Text>
            </View> */}
            <Button
              labelStyle={{
                fontSize: 12,
                fontWeight: "400",
                color: Colors.BLUE,
                textTransform: "none",
              }}
              onPress={() => dispatch(clearState())}
            >
              Reset
            </Button>
          </View>

          <View style={[{ borderRadius: 6, backgroundColor: Colors.WHITE }]}>
            <TextinputComp
              style={styles.textInputComp}
              value={selector.firstName}
              autoCapitalize="words"
              label={"First Name*"}
              maxLength={30}
              keyboardType={"default"}
              error={firstNameErrorHandler.showError}
              errorMsg={firstNameErrorHandler.msg}
              onChangeText={(text) => {
                if (firstNameErrorHandler.showError) {
                  setFirstNameErrorHandler({ showError: false, msg: "" });
                }
                dispatch(
                  setPreEnquiryDetails({ key: "FIRST_NAME", text: text })
                );
              }}
            />
            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPress && selector.firstName === ""
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            ></Text>

            <TextinputComp
              style={styles.textInputComp}
              value={selector.lastName}
              autoCapitalize="words"
              label={"Last Name*"}
              maxLength={30}
              keyboardType={"default"}
              error={lastNameErrorHandler.showError}
              errorMsg={lastNameErrorHandler.msg}
              onChangeText={(text) => {
                if (lastNameErrorHandler.showError) {
                  setFirstNameErrorHandler({ showError: false, msg: "" });
                }
                dispatch(
                  setPreEnquiryDetails({ key: "LAST_NAME", text: text })
                );
              }}
            />
            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPress && selector.lastName === ""
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            ></Text>

            <TextinputComp
              style={styles.textInputComp}
              value={selector.mobile}
              disabled={fromEdit}
              label={"Mobile Number*"}
              keyboardType={"phone-pad"}
              maxLength={10}
              onChangeText={(text) => {
                dispatch(setPreEnquiryDetails({ key: "MOBILE", text: text }));
              }}
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
              style={styles.textInputComp}
              value={selector.alterMobile}
              label={"Alternate Mobile Number"}
              keyboardType={"phone-pad"}
              maxLength={10}
              onChangeText={(text) =>
                dispatch(
                  setPreEnquiryDetails({ key: "ALTER_MOBILE", text: text })
                )
              }
            />
            <Text style={styles.devider}></Text>

            <TextinputComp
              style={styles.textInputComp}
              value={selector.email}
              label={"Email-Id"}
              maxLength={40}
              keyboardType={"email-address"}
              onChangeText={(text) =>
                dispatch(setPreEnquiryDetails({ key: "EMAIL", text: text }))
              }
            />
            <Text style={styles.devider}></Text>

            <DropDownSelectionItem
              label={"Model*"}
              value={selector.carModel}
              onPress={() =>
                showDropDownModelMethod("CAR_MODEL", "Select Model")
              }
            />
            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPress && selector.carModel === ""
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            ></Text>

            <DropDownSelectionItem
              label={"Source of Lead*"}
              value={selector.sourceOfEnquiry}
              disabled={fromEdit}
              onPress={() =>
                showDropDownModelMethod(
                  "SOURCE_OF_ENQUIRY",
                  "Select Source of Contact"
                )
              }
            />
            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPress && selector.sourceOfEnquiry === ""
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            ></Text>
            {subSourceData.length > 0 || selector.subSourceOfEnquiry ? (
              <DropDownSelectionItem
                label={"Sub Source of Lead*"}
                value={selector.subSourceOfEnquiry}
                disabled={fromEdit}
                onPress={() =>
                  showDropDownModelMethod(
                    "SUB_SOURCE_OF_ENQUIRY",
                    "Select Sub Source of Contact"
                  )
                }
              />
            ) : null}
            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPress && selector.subSourceOfEnquiry === ""
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            ></Text>
            {/* <Text style={[GlobalStyle.underline, { backgroundColor: isSubmitPress && selector.subSourceOfEnquiry === '' ? 'red' : 'rgba(208, 212, 214, 0.7)' }]}></Text> */}
            {selector.sourceOfEnquiry === "Other" ? (
              <View>
                <TextinputComp
                  style={styles.textInputComp}
                  value={selector.other_company_name}
                  label={"Other"}
                  keyboardType={"default"}
                  maxLength={50}
                  onChangeText={(text) =>
                    dispatch(
                      setPreEnquiryDetails({
                        key: "OTHER_COMPANY_NAME",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={styles.devider}></Text>
              </View>
            ) : null}

            <DropDownSelectionItem
              label={"Enquiry Segment*"}
              value={selector.enquiryType}
              onPress={() =>
                showDropDownModelMethod(
                  "ENQUIRY_SEGMENT",
                  "Select Enquiry Segment",
                  organizationId
                )
              }
            />
            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPress && selector.enquiryType === ""
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            ></Text>
            <DropDownSelectionItem
              label={"Customer Type*"}
              value={selector.customerType}
              onPress={() =>
                showDropDownModelMethod("CUSTOMER_TYPE", "Select Customer Type")
              }
            />
            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPress && selector.customerType === ""
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            ></Text>

            {selector.customerType === "Corporate" ||
            selector.customerType === "Government" ||
            selector.customerType === "Retired" ||
            selector.customerType === "Fleet" ||
            selector.customerType === "Institution" ? (
              <View>
                <TextinputComp
                  style={styles.textInputComp}
                  value={selector.companyName}
                  autoCapitalize="words"
                  label={"Company Name"}
                  maxLength={50}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setPreEnquiryDetails({
                        key: "COMPANY_NAME",
                        text: text,
                      })
                    )
                  }
                />
                <Text style={styles.devider}></Text>
              </View>
            ) : null}

            {selector.customerType === "Other" ? (
              <View>
                <TextinputComp
                  style={styles.textInputComp}
                  value={selector.other}
                  label={"Other"}
                  maxLength={50}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(setPreEnquiryDetails({ key: "OTHER", text: text }))
                  }
                />
                <Text style={styles.devider}></Text>
              </View>
            ) : null}

            {/* {selector.sourceOfEnquiry === "Event" ? (
                            <View>
                                <DateSelectItem
                                    label={"Event Start Date"}
                                    value={selector.eventStartDate}
                                    onPress={() => showDatePickerMethod("START_DATE")}
                                />
                                <DateSelectItem
                                    label={"Event End Date"}
                                    value={selector.eventEndDate}
                                    onPress={() => showDatePickerMethod("END_DATE")}
                                />
                                <DropDownSelectionItem
                                    label={"Event Name"}
                                    value={selector.eventName}
                                    disabled={fromEdit}
                                    onPress={() =>
                                        showDropDownModelMethod("EVENT_NAME", "Select Event Name")
                                    }
                                />
                                {selector.event_list.length === 0 ? (
                                    <View
                                        style={{ backgroundColor: Colors.WHITE, paddingLeft: 12 }}
                                    >
                                        <Text style={styles.noEventsText}>{"No Events Found"}</Text>
                                    </View>
                                ) : null}
                            </View>
                        ) : null} */}

            {/* {!fromEdit && ( */}
            <TextinputComp
              style={styles.textInputComp}
              value={selector.pincode}
              label={"Pincode*"}
              keyboardType={"number-pad"}
              maxLength={6}
              onChangeText={(text) =>
                dispatch(setPreEnquiryDetails({ key: "PINCODE", text: text }))
              }
            />
            {/* )} */}
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
          </View>

          <View style={styles.view2}>
            <ButtonComp
              // disabled={selector.isLoading}
              title={fromEdit ? "UPDATE" : "SUBMIT"}
              width={screenWidth - 40}
              onPress={() => {
                if (isSubmitEnable) {
                  submitClicked();
                }
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddPreEnquiryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
  },
  text1: {
    fontSize: 16,
    fontWeight: "700",
    paddingLeft: 5,
  },
  view1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
  },
  view2: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text2: {
    fontSize: 14,
    fontWeight: "600",
  },
  devider: {
    width: "100%",
    height: 0.5,
    backgroundColor: Colors.GRAY,
  },
  textInputComp: {
    height: 50,
  },
  noEventsText: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.RED,
    paddingVertical: 5,
  },
  eventTouchable: {
    flexDirection: "row",
    // justifyContent: "space-around",
    alignItems: "center",
    // height: '15%',
    alignContent: "center",
    width: "100%",
    marginTop: 5,
  },
  eventText: {
    fontSize: 12,
    color: Colors.BLACK,
    textAlign: "left",
    marginEnd: 10,
    width: 100,
  },
  modelView: {
    width: "90%",
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.BLACK,
    flexDirection: "column",
    height: "40%",
  },
  selectTitle: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    margin: 5,
  },
});
