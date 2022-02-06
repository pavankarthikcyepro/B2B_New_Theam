import React, { useEffect, useState } from "react";
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
} from "react-native";
import { ButtonComp } from "../../../components";
import { Checkbox, Button, IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp, DropDownComponant, DatePickerComponent } from "../../../components";
import { EmsStackIdentifiers } from "../../../navigations/appNavigator";
import {
  clearState,
  setCreateEnquiryCheckbox,
  setPreEnquiryDetails,
  setDropDownData,
  createPreEnquiry,
  updatePreEnquiry,
  setCustomerTypeList,
  setCarModalList,
  setExistingDetails,
  continueToCreatePreEnquiry,
  getEventListApi,
  updateSelectedDate
} from "../../../redux/addPreEnquiryReducer";
import { useDispatch, useSelector } from "react-redux";
import { isMobileNumber, isEmail, convertToDate } from "../../../utils/helperFunctions";
import { sales_url } from "../../../networking/endpoints";
import realm from "../../../database/realm";
import { AppNavigator } from "../../../navigations";
import { DropDownSelectionItem, DateSelectItem } from "../../../pureComponents";
import * as AsyncStore from "../../../asyncStore";
import { showAlertMessage, showToast, showToastRedAlert } from "../../../utils/toast";
import URL from "../../../networking/endpoints";
import { isValidateAlphabetics } from "../../../utils/helperFunctions";

const screenWidth = Dimensions.get("window").width;

const AddPreEnquiryScreen = ({ route, navigation }) => {
  const selector = useSelector((state) => state.addPreEnquiryReducer);
  const homeSelector = useSelector((state) => state.homeReducer);
  const { vehicle_modal_list, customer_type_list } = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [organizationId, setOrganizationId] = useState(0);
  const [branchId, setBranchId] = useState(0);
  const [employeeName, setEmployeeName] = useState("");
  const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "" })
  const [existingPreEnquiryDetails, setExistingPreEnquiryDetails] = useState({});
  const [fromEdit, setFromEdit] = useState(false);
  const [dataForCarModels, setDataForCarModels] = useState([]);
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showEventModel, setShowEventModel] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");

  useEffect(() => {
    getAsyncstoreData();
    setExistingData();
    updateCarModelsData();
    getBranchId()
    // getCustomerTypeListFromDB();
    // getCarModalListFromDB();
  }, []);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({ orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName })
      setOrganizationId(jsonObj.orgId);
      setEmployeeName(jsonObj.empName);

      if (jsonObj.hrmsRole === "Reception") {
        const resultAry = homeSelector.source_of_enquiry_list.filter(
          (item) => item.name == "Showroom"
        );
        if (resultAry.length > 0) {
          dispatch(setDropDownData({ key: "SOURCE_OF_ENQUIRY", value: resultAry[0].name, id: resultAry[0].id, })
          );
        }
      } else if (jsonObj.hrmsRole === "Tele Caller") {
        const resultAry = homeSelector.source_of_enquiry_list.filter(
          (item) => item.name == "Digital Marketing"
        );
        if (resultAry.length > 0) {
          dispatch(setDropDownData({ key: "SOURCE_OF_ENQUIRY", value: resultAry[0].name, id: resultAry[0].id, })
          );
        }
      }
    }
  };

  const getBranchId = () => {

    AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID).then((branchId) => {
      console.log("branch id:", branchId)
      setBranchId(branchId);
    });
  }

  const updateCarModelsData = () => {
    let modalList = [];
    if (vehicle_modal_list.length > 0) {
      vehicle_modal_list.forEach((item) => {
        modalList.push({ id: item.vehicleId, name: item.model });
      });
    }
    setDataForCarModels([...modalList]);
  };

  const setExistingData = () => {
    if (route.params != null && route.params !== undefined) {
      const preEnquiryDetails = route.params.preEnquiryDetails;
      const fromEdit = route.params.fromEdit;
      setExistingPreEnquiryDetails(preEnquiryDetails);
      setFromEdit(fromEdit);
      dispatch(setExistingDetails(preEnquiryDetails));
    }
  };

  const getCustomerTypeListFromDB = () => {
    const data = realm.objects("CUSTOMER_TYPE_TABLE");
    dispatch(setCustomerTypeList(JSON.stringify(data)));
  };

  const getCarModalListFromDB = () => {
    const data = realm.objects("CAR_MODAL_LIST_TABLE");
    dispatch(setCarModalList(JSON.stringify(data)));
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
      itemData.pincode = dms.dmsAddresses ? dms.dmsAddresses[0].pincode : "";
      itemData.leadStage = dms.leadStage;
      itemData.universalId = dms.crmUniversalId;
      if (!fromEdit) {
        navigation.navigate(AppNavigator.EmsStackIdentifiers.confirmedPreEnq, {
          itemData,
          fromCreatePreEnquiry: true,
        });
      } else {
        navigation.popToTop();
      }
      dispatch(clearState());
    } else {
      if (response.accountId != null && response.contactId != null) {
        confirmToCreateLeadAgain(response);
      } else {
        showToast(response.message);
      }
    }
  };

  const confirmToCreateLeadAgain = (response) => {
    Alert.alert(
      response.message,
      "Continue To Create a Lead",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Create Lead", onPress: () => proceedToCreateLead(response) },
      ],
      { cancelable: false }
    );
  };

  proceedToCreateLead = (data) => {
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
      eventCode: "",
      email: selector.email,
      referencenumber: "",
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

  const submitClicked = () => {
    Keyboard.dismiss();

    if (
      selector.firstName.length == 0 ||
      selector.lastName.length == 0 ||
      selector.mobile.length == 0 ||
      selector.carModel.length == 0 ||
      selector.enquiryType.length == 0 ||
      selector.sourceOfEnquiry.length == 0 ||
      selector.customerType.length == 0 ||
      selector.pincode.length == 0
    ) {
      showToastRedAlert("Please fill required fields");
      return;
    }

    if (!isValidateAlphabetics(selector.firstName)) {
      showToast("please enter alphabetics only in firstname ");
      return;
    }
    if (!isValidateAlphabetics(selector.lastName)) {
      showToast("please enter alphabetics only in lastname ");
      return;
    }

    if (selector.mobile.length != 10) {
      showToast("Please enter valid mobile number");
      return;
    }

    if (selector.alterMobile.length > 0 && selector.alterMobile.length != 10) {
      showToast("Please enter valid alternate mobile number");
      return;
    }

    if (selector.email.length > 0 && !isEmail(selector.email)) {
      showToast("Please enter valid email");
      return;
    }

    if (selector.pincode.length != 6) {
      showToast("Please enter valid pincode");
      return;
    }

    if (selector.sourceOfEnquiry === "Event") {
      if (selector.eventName.length === 0) {
        showToast("Please select event details");
        return;
      }
    }

    if (fromEdit) {
      updatePreEneuquiryDetails();
      return;
    }

    const dmsContactDtoObj = {
      branchId: branchId,
      createdBy: employeeName,
      customerType: selector.customerType,
      firstName: selector.firstName,
      lastName: selector.lastName,
      modifiedBy: employeeName,
      orgId: organizationId,
      phone: selector.mobile,
      company: selector.companyName,
      email: selector.email,
      enquirySource: selector.sourceOfEnquiryId,
      ownerName: employeeName,
      secondaryPhone: selector.alterMobile,
      status: "PREENQUIRY",
    };

    // TODO:-
    // "referencenumber": "PEQ11020421-391"

    const dmsLeadDtoObj = {
      branchId: branchId,
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
      eventCode: selector.eventName,
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

    // http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8081

    let url = sales_url;
    let formData = {};
    if (selector.customerType === "Individual") {
      url = url + "/contact?allocateDse=" + selector.create_enquiry_checked;
      formData = {
        dmsContactDto: dmsContactDtoObj,
        dmsLeadDto: dmsLeadDtoObj,
      };
    } else {
      url = url + "/account?allocateDse=" + selector.create_enquiry_checked;
      formData = {
        dmsAccountDto: dmsContactDtoObj,
        dmsLeadDto: dmsLeadDtoObj,
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
    if (selector.create_enquiry_response_obj.errorMessage === "") {
      //navigation.goBack();
      gotoConfirmPreEnquiryScreen(selector.create_enquiry_response_obj);
    } else if (selector.errorMsg) {
      showToast(selector.errorMsg);
    }
  }, [
    selector.status,
    selector.errorMsg,
    selector.create_enquiry_response_obj,
  ]);

  const updatePreEneuquiryDetails = () => {
    let url = sales_url;
    let dmsAccountOrContactDto = {};
    let dmsLeadDto = {};

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

    if (existingPreEnquiryDetails.hasOwnProperty("dmsLeadDto")) {
      dmsLeadDto = { ...existingPreEnquiryDetails.dmsLeadDto };
      dmsLeadDto.firstName = selector.firstName;
      dmsLeadDto.lastName = selector.lastName;
      dmsLeadDto.email = selector.email;
      dmsLeadDto.phone = selector.mobile;
      dmsLeadDto.secondaryPhone = selector.alterMobile;
      dmsLeadDto.model = selector.carModel;
    }

    let formData = {};
    if (existingPreEnquiryDetails.hasOwnProperty("dmsContactDto")) {
      formData = {
        dmsContactDto: dmsAccountOrContactDto,
        dmsLeadDto: dmsLeadDto,
        dmsEmployeeAllocationDtos:
          existingPreEnquiryDetails.dmsEmployeeAllocationDtos,
      };
    } else {
      formData = {
        dmsAccountDto: dmsAccountOrContactDto,
        dmsLeadDto: dmsLeadDto,
        dmsEmployeeAllocationDtos:
          existingPreEnquiryDetails.dmsEmployeeAllocationDtos,
      };
    }

    console.log("formData: ", formData);

    let dataObj = {
      url: url,
      body: formData,
    };
    dispatch(updatePreEnquiry(dataObj));
  };

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();

    switch (key) {
      case "CAR_MODEL":
        setDataForDropDown([...dataForCarModels]);
        break;
      case "ENQUIRY_SEGMENT":
        setDataForDropDown([...selector.enquiry_type_list]);
        break;
      case "CUSTOMER_TYPE":
        setDataForDropDown([...selector.customer_type_list]);
        break;
      case "SOURCE_OF_ENQUIRY":
        setDataForDropDown([...homeSelector.source_of_enquiry_list]);
        break;
      case "EVENT_NAME":
        setDataForDropDown([...selector.event_list]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key)
  }

  const getEventListFromServer = (startDate, endDate) => {

    const payload = {
      startDate: startDate,
      endDate: endDate,
      empId: userData.employeeId,
      branchId: userData.branchId,
      orgId: userData.orgId
    }
    dispatch(getEventListApi(payload));
  }

  // Handle When Event dates selected
  useEffect(() => {
    if (selector.eventStartDate && selector.eventEndDate) {
      getEventListFromServer(selector.eventStartDate, selector.eventEndDate);
    }
  }, [selector.eventStartDate, selector.eventEndDate]);

  return (
    <SafeAreaView style={styles.container}>

      {/* // select modal */}
      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          console.log("selected: ", item);

          if (dropDownKey === "SOURCE_OF_ENQUIRY" && item.name === "Event") {
            getEventListFromServer();
          }
          setShowDropDownModel(false);
          dispatch(setDropDownData({ key: dropDownKey, value: item.name, id: item.id }));
        }}
      />

      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {
          console.log("date: ", selectedDate);
          if (Platform.OS === "android") {
            if (selectedDate) {
              dispatch(updateSelectedDate({ key: datePickerId, text: selectedDate }))
            }
          } else {
            dispatch(updateSelectedDate({ key: datePickerId, text: selectedDate }))
          }
          setShowDatePicker(false)
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
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
          <Text style={styles.text1}>{"Create New Pre-Enquiry"}</Text>
          <View style={styles.view1}>
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

          <View style={[{ borderRadius: 6 }]}>
            <TextinputComp
              style={styles.textInputComp}
              value={selector.firstName}
              label={"First Name*"}
              keyboardType={"default"}
              onChangeText={(text) =>
                dispatch(
                  setPreEnquiryDetails({ key: "FIRST_NAME", text: text })
                )
              }
            />
            <Text style={styles.devider}></Text>

            <TextinputComp
              style={styles.textInputComp}
              value={selector.lastName}
              label={"Last Name*"}
              keyboardType={"default"}
              onChangeText={(text) =>
                dispatch(setPreEnquiryDetails({ key: "LAST_NAME", text: text }))
              }
            />
            <Text style={styles.devider}></Text>

            <TextinputComp
              style={styles.textInputComp}
              value={selector.mobile}
              label={"Mobile Number*"}
              keyboardType={"phone-pad"}
              maxLength={10}
              onChangeText={(text) =>
                dispatch(setPreEnquiryDetails({ key: "MOBILE", text: text }))
              }
            />
            <Text style={styles.devider}></Text>

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
            <DropDownSelectionItem
              label={"Enquiry Segment*"}
              value={selector.enquiryType}
              onPress={() =>
                showDropDownModelMethod(
                  "ENQUIRY_SEGMENT",
                  "Select Enquiry Segment"
                )
              }
            />
            <DropDownSelectionItem
              label={"Customer Type*"}
              value={selector.customerType}
              onPress={() =>
                showDropDownModelMethod("CUSTOMER_TYPE", "Select Customer Type")
              }
            />

            {selector.customerType === "Corporate" ||
              selector.customerType === "Government" ||
              selector.customerType === "Retired" ||
              selector.customerType === "Fleet" ||
              selector.customerType === "Institution" ? (
              <View>
                <TextinputComp
                  style={styles.textInputComp}
                  value={selector.companyName}
                  label={"Company Name"}
                  keyboardType={"default"}
                  onChangeText={(text) => dispatch(setPreEnquiryDetails({ key: "COMPANY_NAME", text: text }))}
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
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(setPreEnquiryDetails({ key: "OTHER", text: text }))
                  }
                />
                <Text style={styles.devider}></Text>
              </View>
            ) : null}

            <DropDownSelectionItem
              label={"Source of Create Lead*"}
              value={selector.sourceOfEnquiry}
              disabled={fromEdit}
              onPress={() => showDropDownModelMethod("SOURCE_OF_ENQUIRY", "Select Source of Pre-Enquiry")}
            />

            {selector.sourceOfEnquiry === "Event" ? (
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
                  onPress={() => showDropDownModelMethod("EVENT_NAME", "Select Event Name")}
                />
                {selector.event_list.length === 0 ? (
                  <View style={{ backgroundColor: Colors.WHITE, paddingLeft: 12 }}>
                    <Text style={styles.noEventsText}>{"No Events Found"}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

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
            <Text style={styles.devider}></Text>
          </View>

          <View style={styles.view2}>
            <ButtonComp
              disabled={selector.isLoading}
              title={fromEdit ? "UPDATE" : "SUBMIT"}
              width={screenWidth - 40}
              onPress={submitClicked}
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
    justifyContent: "flex-end",
    height: 60,
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
    height: 65,
  },
  noEventsText: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.RED,
    paddingVertical: 5
  }
});

{
  /* <DropDownComponant
                visible={multiDropdownVisible}
                multiple={true}
                selectedItems={(items) => {
                    console.log('selected: ', items);
                    setMultiDropDownVisible(false);
                }}
            /> */
}
