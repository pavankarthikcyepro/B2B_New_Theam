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
  Keyboard
} from "react-native";
import { ButtonComp } from "../../../components/buttonComp";
import { Checkbox, Button, IconButton } from "react-native-paper";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp } from "../../../components/textinputComp";
import { DropDownComponant } from "../../../components/dropDownComp";
import { EmsStackIdentifiers } from "../../../navigations/appNavigator";
import {
  clearState,
  setCreateEnquiryCheckbox,
  setPreEnquiryDetails,
  setCarModel,
  setEnquiryType,
  setCustomerType,
  setSourceOfEnquiry,
  showModelSelect,
  showCustomerTypeSelect,
  showEnquirySegmentSelect,
  showSourceOfEnquirySelect,
  createPreEnquiry,
  updatePreEnquiry,
  setCustomerTypeList,
  setCarModalList,
  setExistingDetails
} from "../../../redux/addPreEnquiryReducer";
import { useDispatch, useSelector } from "react-redux";
import { isMobileNumber, isEmail } from "../../../utils/helperFunctions";
import { sales_url } from "../../../networking/endpoints";
import realm from "../../../database/realm";
import { AppNavigator } from "../../../navigations";
import { DropDownSelectionItem } from "../../../pureComponents/dropDownSelectionItem";
import * as AsyncStore from "../../../asyncStore";

const screenWidth = Dimensions.get("window").width;

const AddPreEnquiryScreen = ({ route, navigation }) => {

  const selector = useSelector((state) => state.addPreEnquiryReducer);
  const { vehicle_modal_list, customer_type_list } = useSelector(state => state.homeReducer);
  const dispatch = useDispatch();
  const [organizationId, setOrganizationId] = useState(0);
  const [branchId, setBranchId] = useState(0);
  const [employeeName, setEmployeeName] = useState("");
  const [existingPreEnquiryDetails, setExistingPreEnquiryDetails] = useState({});
  const [fromEdit, setFromEdit] = useState(false);


  useEffect(() => {
    getAsyncstoreData();
    setExistingData();
    // getCustomerTypeListFromDB();
    // getCarModalListFromDB();
  }, []);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setOrganizationId(jsonObj.orgId);
      setBranchId(jsonObj.branchId);
      setEmployeeName(jsonObj.empName);
    }
  }

  const setExistingData = () => {

    if (route.params != null && route.params !== undefined) {
      const preEnquiryDetails = route.params.preEnquiryDetails;
      const fromEdit = route.params.fromEdit;
      setExistingPreEnquiryDetails(preEnquiryDetails);
      setFromEdit(fromEdit);
      dispatch(setExistingDetails(preEnquiryDetails));
    }
  }

  const getCustomerTypeListFromDB = () => {
    const data = realm.objects("CUSTOMER_TYPE_TABLE");
    dispatch(setCustomerTypeList(JSON.stringify(data)));
  };

  const getCarModalListFromDB = () => {
    const data = realm.objects("CAR_MODAL_LIST_TABLE");
    dispatch(setCarModalList(JSON.stringify(data)));
  };

  useEffect(() => {
    if (selector.create_enquiry_response_obj.errorMessage === "") {
      //navigation.goBack();
      gotoConfirmPreEnquiryScreen(selector.create_enquiry_response_obj);
    } else if (selector.errorMsg) {
      Alert.alert("", selector.errorMsg);
    }
  }, [selector.status, selector.errorMsg, selector.create_enquiry_response_obj]);

  const gotoConfirmPreEnquiryScreen = (response) => {
    let dmsEn;
    if (response.dmsEntity.hasOwnProperty("dmsContactDto")) {
      dmsEn = response.dmsEntity.dmsContactDto;
    } else {
      dmsEn = response.dmsEntity.dmsAccountDto;
    }
    let dms = response.dmsEntity.dmsLeadDto;
    let itemData = {};
    itemData.firstName = dms.firstName;
    itemData.lastName = dms.lastName;
    itemData.phone = dms.phone;
    itemData.customerType = dmsEn.customerType;
    itemData.email = dms.email;
    itemData.model = dms.model;
    itemData.enquirySegment = dms.enquirySegment;
    itemData.createdDate = dms.createddatetime;
    itemData.enquirySource = dms.enquirySource;
    itemData.pincode = dms.dmsAddresses ? dms.dmsAddresses[0].pincode : '';
    itemData.leadStage = dms.leadStage;
    itemData.universalId = dms.crmUniversalId;
    navigation.navigate(AppNavigator.EmsStackIdentifiers.confirmedPreEnq, { itemData, fromCreatePreEnquiry: true })
    dispatch(clearState());
  }

  const submitClicked = () => {

    Keyboard.dismiss();

    if (
      selector.firstName.length == 0 ||
      selector.mobile.length == 0 ||
      selector.enquiryType.length == 0 ||
      selector.sourceOfEnquiry == 0
    ) {
      Alert.alert("Please fill required fields");
      return;
    }

    if (!isMobileNumber(selector.mobile)) {
      Alert.alert("Please enter valid mobile number");
      return;
    }

    if (selector.email.length > 0 && !isEmail(selector.email)) {
      Alert.alert("Please enter valid email");
      return;
    }

    if (fromEdit) {
      updatePreEneuquiryDetails();
      return;
    }

    const eventName = "";

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
      eventCode: eventName,
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

  const updatePreEneuquiryDetails = () => {

    let url = sales_url;
    let dmsAccountOrContactDto = {};
    let dmsLeadDto = {}

    if (existingPreEnquiryDetails.hasOwnProperty("dmsContactDto")) {
      url = url + "/contact?allocateDse=" + selector.create_enquiry_checked;
      dmsAccountOrContactDto = { ...existingPreEnquiryDetails.dmsContactDto };
    }
    else if (existingPreEnquiryDetails.hasOwnProperty("dmsAccountDto")) {
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
        "dmsContactDto": dmsAccountOrContactDto,
        "dmsLeadDto": dmsLeadDto,
        "dmsEmployeeAllocationDtos": existingPreEnquiryDetails.dmsEmployeeAllocationDtos
      }
    } else {
      formData = {
        "dmsAccountDto": dmsAccountOrContactDto,
        "dmsLeadDto": dmsLeadDto,
        "dmsEmployeeAllocationDtos": existingPreEnquiryDetails.dmsEmployeeAllocationDtos
      }
    }

    console.log("formData: ", formData);

    let dataObj = {
      url: url,
      body: formData,
    };
    dispatch(updatePreEnquiry(dataObj));
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* // select modal */}
      <DropDownComponant
        visible={selector.show_model_drop_down}
        headerTitle={"Select Model"}
        data={vehicle_modal_list}
        selectedItems={(item) => {
          console.log("selected: ", item);
          dispatch(setCarModel(item.name));
        }}
      />

      {/* // select enquiry segment */}
      <DropDownComponant
        visible={selector.show_enquiry_segment_drop_down}
        headerTitle={"Select Enquiry Segment"}
        data={selector.enquiry_type_list}
        selectedItems={(item) => {
          console.log("selected: ", item);
          dispatch(setEnquiryType(item));
        }}
      />

      {/* // customer type */}
      <DropDownComponant
        visible={selector.show_customer_type_drop_down}
        headerTitle={"Select Customer Type"}
        data={selector.customer_type_list}
        selectedItems={(item) => {
          console.log("selected: ", item);
          dispatch(setCustomerType(item.name));
        }}
      />

      {/* // source of pre-enquiry */}
      <DropDownComponant
        visible={selector.show_source_type_drop_down}
        headerTitle={"Select Source of Pre-Enquiry"}
        data={selector.source_of_enquiry_type_list}
        selectedItems={(item) => {
          console.log("selected: ", item);
          dispatch(setSourceOfEnquiry(item));
        }}
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox.Android
                status={
                  selector.create_enquiry_checked ? "checked" : "unchecked"
                }
                uncheckedColor={Colors.DARK_GRAY}
                color={Colors.RED}
                onPress={() => dispatch(setCreateEnquiryCheckbox())}
              />
              <Text style={styles.text2}>{"Create enquiry"}</Text>
            </View>
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
              onChangeText={(text) => dispatch(setPreEnquiryDetails({ key: "FIRST_NAME", text: text }))}
            />
            <Text style={styles.devider}></Text>

            <TextinputComp
              style={styles.textInputComp}
              value={selector.lastName}
              label={"Last Name*"}
              keyboardType={"default"}
              onChangeText={(text) => dispatch(setPreEnquiryDetails({ key: "LAST_NAME", text: text }))}
            />
            <Text style={styles.devider}></Text>

            <TextinputComp
              style={styles.textInputComp}
              value={selector.mobile}
              label={"Mobile Number*"}
              keyboardType={"phone-pad"}
              maxLength={10}
              onChangeText={(text) => dispatch(setPreEnquiryDetails({ key: "MOBILE", text: text }))}
            />
            <Text style={styles.devider}></Text>

            <TextinputComp
              style={styles.textInputComp}
              value={selector.alterMobile}
              label={"Alternate Mobile Number"}
              keyboardType={"phone-pad"}
              maxLength={10}
              onChangeText={(text) => dispatch(setPreEnquiryDetails({ key: "ALTER_MOBILE", text: text }))}
            />
            <Text style={styles.devider}></Text>

            <TextinputComp
              style={styles.textInputComp}
              value={selector.email}
              editable={fromEdit}
              label={"Email-Id"}
              keyboardType={"email-address"}
              onChangeText={(text) => dispatch(setPreEnquiryDetails({ key: "EMAIL", text: text }))}
            />
            <Text style={styles.devider}></Text>

            <DropDownSelectionItem
              label={"Select Model*"}
              value={selector.carModel}
              onPress={() => dispatch(showModelSelect())}
            />
            <DropDownSelectionItem
              label={"Select Enquiry Segment*"}
              value={selector.enquiryType}
              disabled={fromEdit}
              onPress={() => dispatch(showEnquirySegmentSelect())}
            />
            <DropDownSelectionItem
              label={"Select Customer Type*"}
              value={selector.customerType}
              disabled={fromEdit}
              onPress={() => dispatch(showCustomerTypeSelect())}
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
                  editable={fromEdit}
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
                  onChangeText={(text) => dispatch(setPreEnquiryDetails({ key: "OTHER", text: text }))}
                />
                <Text style={styles.devider}></Text>
              </View>
            ) : null}

            <DropDownSelectionItem
              label={"Select Source of Pre-Enquiry*"}
              value={selector.sourceOfEnquiry}
              disabled={fromEdit}
              onPress={() => dispatch(showSourceOfEnquirySelect())}
            />

            <TextinputComp
              style={styles.textInputComp}
              value={selector.pincode}
              label={"Pincode*"}
              keyboardType={"number-pad"}
              disabled={fromEdit}
              onChangeText={(text) => dispatch(setPreEnquiryDetails({ key: "PINCODE", text: text }))}
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
    justifyContent: "space-between",
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
