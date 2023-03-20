import React, { useEffect, useState } from 'react';
import { Keyboard, Text } from 'react-native';
import { View, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { IconButton, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { DatePickerComponent, DropDownComponant, TextinputComp } from '../../../components';
import { Gender_Types, Salutation_Types } from '../../../jsonData/enquiryFormScreenJsonData';
import { DateSelectItem, DropDownSelectionItem, RadioTextItem } from '../../../pureComponents';
import { clearStateData, getCustomerTypesApi, getSourceTypesApi, setCommunicationAddress, setDatePicker, setDropDownData, setPersonalIntro, setServiceInfo, setVehicleInformation, updateAddressByPincode, updateSelectedDate } from '../../../redux/customerInfoReducer';
import { Colors, GlobalStyle } from '../../../styles';
import * as AsyncStore from "../../../asyncStore";
import { showToast } from '../../../utils/toast';
import { PincodeDetailsNew } from '../../../utils/helperFunctions';
import { Dropdown } from 'react-native-element-dropdown';

const AddCustomerInfo = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.customerInfoReducer);

  const [openAccordion, setOpenAccordion] = useState(0);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [isSubmitPress, setIsSubmitPress] = useState(false);
  const [addressData, setAddressData] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [datePickerMode, setDatePickerMode] = useState("date");

  useEffect(() => {
    getCustomerType();
    return () => {
      clearLocalData();
      dispatch(clearStateData());
    }
  }, []);

  const clearLocalData = () => {
    setOpenAccordion("0");
    setDropDownKey("");
    setDropDownTitle("Select Data");
    setShowDropDownModel(false);
    setDataForDropDown([]);
    setIsSubmitPress(false);
    setAddressData([]);
    setDefaultAddress(null);
    setDatePickerMode("date");
  }
  
  const getCustomerType = async () => {
    let employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      dispatch(getCustomerTypesApi(jsonObj.orgId));
      dispatch(getSourceTypesApi(jsonObj.branchId));
    }
  };
  
  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    switch (key) {
      case "SALUTATION":
        setDataForDropDown([...Salutation_Types]);
        break;
      case "GENDER":
        setDataForDropDown([...Gender_Types]);
        break;
      case "RELATION":
        setDataForDropDown([...selector.relation_types_data]);
        break;
      case "CUSTOMER_TYPE":
        if (selector.customerTypesResponse?.length === 0) {
          showToast("No Customer Types found");
          return;
        }
        let cData = selector.customerTypesResponse;
        let cNewData = cData?.map((val) => {
          return {
            ...val,
            name: val?.customer_type,
          };
        });
        setDataForDropDown([...cNewData]);
        break;
      case "SOURCE_TYPE":
        if (selector.sourceTypesResponse?.length === 0) {
          showToast("No Source Types found");
          return;
        }
        // let cNewData = cData?.map((val) => {
        //   return {
        //     ...val,
        //     name: val?.customer_type,
        //   };
        // });
        // setDataForDropDown([...cNewData]);
        break;
      case "SUB_SOURCE_TYPE":
        if (selector.sourceTypesResponse?.length === 0) {
          showToast("No Sub Source Types found");
          return;
        }
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const updateAccordion = (selectedIndex) => {
    if (selectedIndex != openAccordion) {
      setOpenAccordion(selectedIndex);
    } else {
      setOpenAccordion(0);
    }
  };

  const onDropDownClear = (key) => {
    if (key) {
      dispatch(setDropDownData({ key: key, value: "", id: "" }));
    }
  };

  const updateAddressDetails = (pincode) => {
    if (pincode.length != 6) {
      return;
    }
    PincodeDetailsNew(pincode).then(
      (res) => {
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
      },
      (rejected) => {}
    );
  }

  const showDatePickerModelMethod = (key, mode = "date") => {
    Keyboard.dismiss();
    setDatePickerMode(mode);
    dispatch(setDatePicker(key));
  };

  return (
    <SafeAreaView style={styles.container}>
      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          setShowDropDownModel(false);
          dispatch(
            setDropDownData({
              key: dropDownKey,
              value: item.name,
              id: item.id,
            })
          );
        }}
      />

      <DatePickerComponent
        visible={selector.showDatepicker}
        mode={datePickerMode}
        value={new Date(Date.now())}
        minimumDate={selector.minDate}
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
        style={{ flex: 1, justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          <List.AccordionGroup
            expandedId={openAccordion}
            onAccordionPress={(expandedId) => updateAccordion(expandedId)}
          >
            <List.Accordion
              id={"1"}
              title={"Customer Info"}
              titleStyle={{
                color: openAccordion === "1" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "1" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            >
              <DropDownSelectionItem
                label={"Salutation"}
                value={selector.salutation}
                onPress={() =>
                  showDropDownModelMethod("SALUTATION", "Select Salutation")
                }
                clearOption={true}
                clearKey={"SALUTATION"}
                onClear={onDropDownClear}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.firstName}
                label={"First Name*"}
                autoCapitalize="words"
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "FIRST_NAME", text: text }))
                }
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
              />
              <TextinputComp
                value={selector.lastName}
                label={"Last Name*"}
                autoCapitalize="words"
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "LAST_NAME", text: text }))
                }
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
              />
              <DropDownSelectionItem
                label={"Gender*"}
                value={selector.gender}
                onPress={() => showDropDownModelMethod("GENDER", "Gender")}
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
              />
              <DropDownSelectionItem
                label={"Relation"}
                value={selector.relation}
                onPress={() => showDropDownModelMethod("RELATION", "Relation")}
                clearOption={true}
                clearKey={"RELATION"}
                onClear={onDropDownClear}
              />
              <DateSelectItem
                label={"Date Of Birth"}
                value={selector.dateOfBirth}
                onPress={() => showDatePickerModelMethod("DATE_OF_BIRTH")}
              />
              <TextinputComp
                value={selector?.age?.toString()}
                label={"Age"}
                keyboardType={"phone-pad"}
                maxLength={5}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "AGE", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"Anniversary Date"}
                value={selector.anniversaryDate}
                onPress={() => showDatePickerModelMethod("ANNIVERSARY_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.mobile}
                label={"Mobile Number*"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "MOBILE", text: text }))
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
              />
              <TextinputComp
                value={selector.alterMobile}
                label={"Alternate Mobile Number"}
                keyboardType={"phone-pad"}
                maxLength={10}
                onChangeText={(text) =>
                  dispatch(
                    setPersonalIntro({ key: "ALTER_MOBILE", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.email}
                label={"Email ID"}
                keyboardType={"email-address"}
                onChangeText={(text) =>
                  dispatch(setPersonalIntro({ key: "EMAIL", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.occupation}
                autoCapitalize="words"
                label={"Occupation"}
                keyboardType={"default"}
                maxLength={40}
                onChangeText={(text) =>
                  dispatch(
                    setCustomerProfile({ key: "OCCUPATION", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Source Type*"}
                value={selector.sourceType}
                onPress={() =>
                  showDropDownModelMethod("SOURCE_TYPE", "Select Source Type")
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.sourceType === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <DropDownSelectionItem
                label={"Sub Source Type*"}
                value={selector.subSourceType}
                onPress={() =>
                  showDropDownModelMethod(
                    "SUB_SOURCE_TYPE",
                    "Select Sub Source Type"
                  )
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.subSourceType === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <DropDownSelectionItem
                label={"Customer Type*"}
                value={selector.customerTypes}
                onPress={() =>
                  showDropDownModelMethod(
                    "CUSTOMER_TYPE",
                    "Select Customer Type"
                  )
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.customerTypes === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
            </List.Accordion>
            <View style={styles.space} />
            <List.Accordion
              id={"2"}
              title={"Customer Address"}
              titleStyle={{
                color: openAccordion === "2" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "2" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            >
              <TextinputComp
                value={selector.pincode}
                label={"Pincode*"}
                maxLength={6}
                keyboardType={"phone-pad"}
                onChangeText={(text) => {
                  if (text.length === 6) {
                    updateAddressDetails(text);
                  }
                  dispatch(
                    setCommunicationAddress({ key: "PINCODE", text: text })
                  );
                  setDefaultAddress(null);
                }}
              />
              {addressData.length > 0 && (
                <>
                  <Text style={GlobalStyle.underline}></Text>
                  <View style={styles.addressDropDownRow}>
                    <Dropdown
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
                      onChange={(val) => {
                        dispatch(updateAddressByPincode(val.value));
                      }}
                    />

                    {selector.isAddressSet ? (
                      <IconButton
                        onPress={() => {
                          let tmp = addressData;
                          setAddressData([]);
                          setAddressData([...tmp]);
                          dispatch(updateAddressByPincode(""));
                        }}
                        icon="close-circle-outline"
                        color={Colors.BLACK}
                        size={20}
                        style={styles.addressClear}
                      />
                    ) : null}
                  </View>
                </>
              )}
              <Text style={GlobalStyle.underline} />
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
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.houseNum}
                label={"H.No"}
                maxLength={50}
                keyboardType={"number-pad"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({ key: "HOUSE_NO", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.streetName}
                label={"Street Name"}
                autoCapitalize="words"
                maxLength={120}
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
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.village}
                label={"Village/Town"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "VILLAGE",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.mandal}
                label={"Mandal/Tahsil"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "MANDAL",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.city}
                label={"City"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(setCommunicationAddress({ key: "CITY", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.district}
                label={"District"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "DISTRICT",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.state}
                label={"State"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setCommunicationAddress({
                      key: "STATE",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
            </List.Accordion>
            <View style={styles.space} />
            <List.Accordion
              id={"3"}
              title={"Vehicle Information"}
              titleStyle={{
                color: openAccordion === "3" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "3" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            >
              <TextinputComp
                value={selector.vehicleRegNo}
                label={"Vehicle Reg. No"}
                onChangeText={(text) =>
                  dispatch(
                    setVehicleInformation({ key: "VEHICLE_REG_NO", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Vehicle Make"}
                onPress={() =>
                  showDropDownModelMethod("VEHICLE_MAKE", "Select Vehicle Make")
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Model"}
                onPress={() =>
                  showDropDownModelMethod(
                    "VEHICLE_MODEL",
                    "Select Vehicle Model"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Variant"}
                onPress={() =>
                  showDropDownModelMethod(
                    "VEHICLE_VARIANT",
                    "Select Vehicle Variant"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Transmission Type"}
                onPress={() =>
                  showDropDownModelMethod(
                    "TRANSMISSION_TYPE",
                    "Select Vehicle Transmission Type"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Fuel Type"}
                onPress={() =>
                  showDropDownModelMethod(
                    "FUEL_TYPE",
                    "Select Vehicle Fuel Type"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Color"}
                onPress={() =>
                  showDropDownModelMethod(
                    "VEHICLE_COLOR",
                    "Select Vehicle Color"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.vin}
                label={"VIN"}
                onChangeText={(text) =>
                  dispatch(setVehicleInformation({ key: "VIN", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.engineNumber}
                label={"Engine Number"}
                onChangeText={(text) =>
                  dispatch(
                    setVehicleInformation({ key: "ENGINE_NUMBER", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.kmReading}
                label={"Km Reading"}
                onChangeText={(text) =>
                  dispatch(
                    setVehicleInformation({ key: "KM_READING", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"Sale Date"}
                value={selector.saleDate}
                onPress={() => showDatePickerModelMethod("SALE_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"Making Month"}
                value={selector.makingMonth}
                // onPress={() => showDatePickerModelMethod("MAKING_MONTH")}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.sellingDealer}
                label={"Selling Dealer"}
                onChangeText={(text) =>
                  dispatch(
                    setVehicleInformation({ key: "SELLING_DEALER", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.sellingLocation}
                label={"Selling Location"}
                onChangeText={(text) =>
                  dispatch(
                    setVehicleInformation({
                      key: "SELLING_LOCATION",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
            </List.Accordion>
            <View style={styles.space} />
            <List.Accordion
              id={"4"}
              title={"Last Service Information"}
              titleStyle={{
                color: openAccordion === "4" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "4" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            >
              <DateSelectItem
                label={"Service Date"}
                value={selector.serviceDate}
                onPress={() => showDatePickerModelMethod("SERVICE_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Service Type*"}
                value={selector.serviceType}
                onPress={() =>
                  showDropDownModelMethod("SERVICE_TYPE", "Select Service Type")
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.ServiceType === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <DropDownSelectionItem
                label={"Sub Service Type*"}
                value={selector.subServiceType}
                onPress={() =>
                  showDropDownModelMethod(
                    "SUB_SERVICE_TYPE",
                    "Select Sub Service Type"
                  )
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.subServiceType === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <TextinputComp
                value={selector.serviceAmount}
                label={"Service Amount"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(
                    setServiceInfo({ key: "SERVICE_AMOUNT", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.serviceCenter}
                label={"Service Center"}
                onChangeText={(text) =>
                  dispatch(
                    setServiceInfo({ key: "SERVICE_CENTER", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.readingAtService}
                label={"Reading at Service"}
                onChangeText={(text) =>
                  dispatch(
                    setServiceInfo({ key: "READING_AT_SERVICE", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.readingAtService}
                label={"Reading at Service"}
                onChangeText={(text) =>
                  dispatch(
                    setServiceInfo({ key: "READING_AT_SERVICE", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.serviceAdvisor}
                label={"Service Advisor"}
                onChangeText={(text) =>
                  dispatch(
                    setServiceInfo({ key: "SERVICE_ADVISOR", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.serviceDealerName}
                label={"Dealer Name"}
                onChangeText={(text) =>
                  dispatch(
                    setServiceInfo({ key: "SERVICE_DEALER_NAME", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.serviceDealerLocation}
                label={"Dealer Location"}
                onChangeText={(text) =>
                  dispatch(
                    setServiceInfo({
                      key: "SERVICE_DEALER_LOCATION",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Last Service Feedback"}
                value={selector.serviceFeedback}
                onPress={() =>
                  showDropDownModelMethod(
                    "SERVICE_FEEDBACK",
                    "Select Last Service Feedback"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Complaint Reason"}
                value={selector.complaintReason}
                onPress={() =>
                  showDropDownModelMethod(
                    "COMPLAINT_REASON",
                    "Select Complaint Reason"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Complaint Status"}
                value={selector.complaintStatus}
                onPress={() =>
                  showDropDownModelMethod(
                    "COMPLAINT_STATUS",
                    "Select Complaint Status"
                  )
                }
              />
            </List.Accordion>
            <List.Accordion
              id={"5"}
              title={"Insurance"}
              titleStyle={{
                color: openAccordion === "5" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "5" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            >

            </List.Accordion>
          </List.AccordionGroup>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  accordionBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
  },
  space: {
    height: 5,
  },
  addressDropDownRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  addressClear: {
    marginHorizontal: 0,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    borderRadius: 0,
    borderLeftColor: Colors.GRAY,
    alignSelf: "center",
  },
  dropdownContainer: {
    flex: 1,
    padding: 16,
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
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
});

export default AddCustomerInfo;