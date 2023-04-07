import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Text } from 'react-native';
import { View, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Button, IconButton, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { DatePickerComponent, DropDownComponant, LoaderComponent, TextinputComp } from '../../../components';
import { Gender_Types, Salutation_Types } from '../../../jsonData/enquiryFormScreenJsonData';
import { DateSelectItem, DropDownSelectionItem, RadioTextItem } from '../../../pureComponents';
import { addCustomer, clearStateData, getComplaintReasonsApi, getCustomerTypesApi, getInsuranceCompanyApi, getServiceTypesApi, getSourceTypesApi, getSubServiceTypesApi, getVehicleInfo, setAmcInfo, setCommunicationAddress, setDatePicker, setDropDownData, setExWarrantyInfo, setInsuranceInfo, setOemWarrantyInfo, setPersonalIntro, setServiceInfo, setVehicleInformation, updateAddressByPincode, updateSelectedDate } from '../../../redux/customerInfoReducer';
import { Colors, GlobalStyle } from '../../../styles';
import * as AsyncStore from "../../../asyncStore";
import { showToast } from '../../../utils/toast';
import { PincodeDetailsNew } from '../../../utils/helperFunctions';
import { Dropdown } from 'react-native-element-dropdown';
import {
  COMPLAINT_STATUS,
  EW_TYPE,
  FASTAG,
  LAST_SERVICE_FEEDBACK,
  MONTH,
  OEM_PERIOD,
  VEHICLE_MAKER,
} from "../../../jsonData/addCustomerScreenJsonData";
import moment from 'moment';

const AddCustomerInfo = ({ navigation, route }) => {
  const dispatch = useDispatch();
  let scrollRef = useRef(null);
  const selector = useSelector((state) => state.customerInfoReducer);

  const [userData, setUserData] = useState("");
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
      setUserData(jsonObj);
      dispatch(getCustomerTypesApi(jsonObj.orgId));
      dispatch(getSourceTypesApi(jsonObj.branchId));
      dispatch(getServiceTypesApi(jsonObj.branchId));

      let complainReasonPayload = {
        menu: "Factor Type",
        orgId: jsonObj.orgId,
        // userId: jsonObj.empId,
        userId: 912,
      };
      dispatch(getComplaintReasonsApi(complainReasonPayload));
      dispatch(getInsuranceCompanyApi(jsonObj.orgId));
      dispatch(getVehicleInfo(jsonObj.orgId));
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
        setDataForDropDown([...selector.sourceTypesResponse]);
        break;
      case "SUB_SOURCE_TYPE":
        let flag = 0;
        if (selector.sourceType != "") {
          for (let i = 0; i < selector.sourceTypesResponse.length; i++) {
            const element = selector.sourceTypesResponse[i];
            if (
              element.name == selector.sourceType &&
              element?.subtypeMap?.length > 0
            ) {
              flag = 1;
              dispatch(
                setPersonalIntro({
                  key: "SUB_SOURCE_RES",
                  text: element.subtypeMap,
                })
              );
              setDataForDropDown([...element.subtypeMap]);
              break;
            }
          }
        }
        if (flag == 0) {
          setDataForDropDown([]);
          break;
        }
        break;
      case "VEHICLE_MAKER":
        setDataForDropDown([...VEHICLE_MAKER]);
        break;
      case "VEHICLE_MODEL":
        setDataForDropDown([...selector.vehicleModelList]);
        break;
      case "VEHICLE_VARIANT":
        setDataForDropDown([...selector.vehicleVariantList]);
        break;
      case "VEHICLE_COLOR":
        setDataForDropDown([...selector.vehicleColorList]);
        break;
      case "MAKING_MONTH":
        setDataForDropDown([...MONTH]);
        break;
      case "SERVICE_TYPE":
        setDataForDropDown([...selector.serviceTypeResponse]);
        break;
      case "SUB_SERVICE_TYPE":
        setDataForDropDown([...selector.subServiceTypeResponse]);
        break;
      case "SERVICE_FEEDBACK":
        setDataForDropDown([...LAST_SERVICE_FEEDBACK]);
        break;
      case "COMPLAINT_REASON":
        setDataForDropDown([...selector.complaintReasonResponse]);
        break;
      case "COMPLAINT_STATUS":
        setDataForDropDown([...COMPLAINT_STATUS]);
        break;
      case "INSURANCE_COMPANY":
        setDataForDropDown([...selector.insuranceCompanyResponse]);
        break;
      case "OEM_PERIOD":
        setDataForDropDown([...OEM_PERIOD]);
        break;
      case "EW_TYPE":
        setDataForDropDown([...EW_TYPE]);
        break;
      case "FASTAG":
        setDataForDropDown([...FASTAG]);
        break;
      case "AMC_NAME":
        setDataForDropDown([...EW_TYPE]);
        break;
      default:
        setDataForDropDown([]);
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

  const convertDateForPayload = (value) => {
    if (value) {
      return moment(value, "YYYY/MM/DD").format("YYYY-MM-DD");
    }
    return value;
  };

  const getPayloadId = (type, value) => {
    if (value) {
      if (type == "serviceType") {
        let index = selector.serviceTypeResponse.findIndex(
          (item) => item.name == value
        );
        return selector.serviceTypeResponse[index].id;
      } else if (type == "sourceType") {
        let index = selector.sourceTypesResponse.findIndex(
          (item) => item.name == value
        );
        return selector.sourceTypesResponse[index].id;
      } else if (type == "subSourceType") {
        let index = selector.subSourceTypesResponse.findIndex(
          (item) => item.name == value
        );
        return selector.subSourceTypesResponse[index].id;
      }
    }
    return "";
  };

  const submitClick = () => {
    setIsSubmitPress(true);
    if (!selector.firstName) {
      scrollToPos(0);
      setOpenAccordion("1");
      showToast("Please Enter First Name");
      return;
    }
    
    if (!selector.lastName) {
      scrollToPos(0);
      setOpenAccordion("1");
      showToast("Please Enter Last Name");
      return;
    }
    
    if (!selector.mobile) {
      scrollToPos(2);
      setOpenAccordion("1");
      showToast("Please Enter Mobile Number");
      return;
    }
    
    if (!selector.sourceType) {
      scrollToPos(4);
      setOpenAccordion("1");
      showToast("Please Enter Source Type");
      return;
    }
    
    if (!selector.subSourceType) {
      scrollToPos(4);
      setOpenAccordion("1");
      showToast("Please Enter Sub Source Type");
      return;
    }
    
    if (!selector.vehicleRegNo) {
      scrollToPos(0);
      setOpenAccordion("3");
      showToast("Please Enter Vehicle Reg. No");
      return;
    }
    
    if (!selector.vin) {
      setOpenAccordion("3");
      scrollToPos(6);
      showToast("Please Enter Vin");
      return;
    }
    
    if (!selector.readingAtService) {
      setOpenAccordion("3");
      scrollToPos(6);
      showToast("Please Enter Km Reading");
      return;
    }
    
    if (!selector.saleDate) {
      setOpenAccordion("3");
      scrollToPos(6);
      showToast("Please Enter Sale Date");
      return;
    }

    if (!selector.makingMonth) {
      setOpenAccordion("3");
      scrollToPos(6);
      showToast("Please Enter Making Month");
      return;
    }

    if (!selector.makingYear) {
      setOpenAccordion("3");
      scrollToPos(6);
      showToast("Please Enter Making Year");
      return;
    }

    if (selector.makingYear && selector.makingYear.length !== 4) {
      setOpenAccordion("3");
      scrollToPos(6);
      showToast("Please Enter valid making year");
      return;
    }

    let newData = {
      vehicleHistoryRequest: {
        serviceManager: selector.serviceAdvisor,
        complaintStatus: selector.complaintStatus,
        lastServiceFeedback: selector.serviceFeedback,
        reasonForComplaint: selector.complaintReason,
        dealerName: selector.serviceDealerName,
        dealerLocation: selector.serviceDealerLocation,
        serviceDate: convertDateForPayload(selector.serviceDate),
        kmReadingAtService: selector.readingAtService,
        serviceCenter: selector.serviceCenter,
        serviceAmount: selector.serviceAmount,
        serviceType: getPayloadId("serviceType", selector.serviceType),
        // subServiceType: selector.subServiceType, (available in ui, need to add in api)
      },
      vehicleDetails: {
        vehicleRegNumber: selector.vehicleRegNo,
        vehicleMake: selector.vehicleMaker,
        vehicleModel: selector.vehicleModel,
        variant: selector.vehicleVariant,
        color: selector.vehicleColor,
        fuelType: selector.vehicleFuelType,
        transmisionType: selector.vehicleTransmissionType,
        vin: selector.vin,
        engineNumber: selector.engineNumber,
        purchaseDate: convertDateForPayload(selector.saleDate),
        chassisNumber: selector.chassisNumber,
        sellingLocation: selector.sellingLocation,
        sellingDealer: selector.sellingDealer,
        makingMonth: selector.makingMonth,
        vehicleMakeYear: selector.makingYear,
        isFastag: selector.fastag == "Available" ? true : false,
        currentKmReading: selector.kmReading,
      },
      customer: {
        salutation: selector.salutation,
        firstName: selector.firstName,
        lastName: selector.lastName,
        relationName: selector.relation,
        age: selector.age,
        leadSource: getPayloadId("subSourceType", selector.subSourceType),
        parentLeadSource: getPayloadId("sourceType", selector.sourceType),
        contactNumber: selector.mobile,
        alternateContactNumber: selector.alterMobile,
        email: selector.email,
        addresses: [
          {
            houseNo: selector.houseNum,
            street: selector.streetName,
            villageOrTown: selector.village,
            mandalOrTahasil: selector.mandal,
            isUrban: selector.urban_or_rural === 1 ? true : false,
            pin: selector.pincode,
            state: selector.state,
            city: selector.city,
            district: selector.district,
          },
        ],
        gender: selector.gender,
        customerType: selector.customerTypes,
        occupation: selector.occupation,
        dateOfBirth: convertDateForPayload(selector.dateOfBirth),
        // refered_by: "dsfsdf", (not in UI)
        // dateOfArrival: "2023-03-22", (not in UI)
      },
      insuranceRequest: {
        insuranceAmount: selector.insuranceAmount,
        startDate: convertDateForPayload(selector.insuranceStartDate),
        endDate: convertDateForPayload(selector.insuranceExpiryDate),
        vendor: selector.insuranceCompany,
        insuranceIdentifier: selector.insurancePolicyNo,
      },
      warrantyRequests: [
        {
          startDate: convertDateForPayload(selector.amcStartDate),
          expiryDate: convertDateForPayload(selector.amcExpiryDate),
          amountPaid: selector.amcAmountPaid,
          warrantyType: "MCP",
          amc_name: selector.amcName,
          number: selector.amcPolicyNo,
        },
        {
          startDate: convertDateForPayload(selector.ewStartDate),
          expiryDate: convertDateForPayload(selector.ewExpiryDate),
          amountPaid: selector.ewAmountPaid,
          warrantyType: "EW",
          ewName: selector.ewType,
          number: selector.ewPolicyNo,
        },
        {
          startDate: convertDateForPayload(selector.oemStartDate),
          expiryDate: convertDateForPayload(selector.oemEndDate),
          amountPaid: selector.oemWarrantyAmount,
          warrantyType: "OEM",
          oemPeriod: selector.oemPeriod,
          number: selector.oemWarrantyNo,
        },
      ],
    };
    
    let payload = {
      tenantId: userData?.branchId,
      customerData: newData,
    };
    
    console.log("payload -> ", payload);
    return;
    dispatch(addCustomer(payload));
  }

  const scrollToPos = (itemIndex) => {
    scrollRef.current.scrollTo({ y: itemIndex * 70 });
  };

  useEffect(() => {
    if (selector.addCustomerResponseStatus == "success") {
      navigation.popToTop();
      showToast("Customer Added Successfully");
    }
  }, [selector.addCustomerResponseStatus]);
  

  return (
    <SafeAreaView style={styles.container}>
      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          setShowDropDownModel(false);
          if (dropDownKey == "SERVICE_TYPE") {
            let payload = {
              tenantId: userData?.branchId,
              catId: item.id,
            };
            dispatch(getSubServiceTypesApi(payload));
          } else if (dropDownKey == "VEHICLE_MODEL") {
            dispatch(
              setVehicleInformation({
                key: "VEHICLE_VARIANT_LIST",
                text: item.varients,
              })
            );
          } else if (dropDownKey == "VEHICLE_VARIANT") {
            let colors = [];
            for (let i = 0; i < item.vehicleImages.length; i++) {
              let data = {
                ...item.vehicleImages[i],
                name: item.vehicleImages[i].color,
              };
              colors.push(Object.assign({}, data));
            }
            dispatch(
              setVehicleInformation({ key: "VEHICLE_COLOR_LIST", text: colors })
            );
            dispatch(
              setVehicleInformation({
                key: "VEHICLE_FUEL_TYPE",
                text: item.fuelType,
              })
            );
            dispatch(
              setVehicleInformation({
                key: "VEHICLE_TRANSMISSION_TYPE",
                text: item.transmission_type,
              })
            );
          }
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
          ref={scrollRef}
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
                      isSubmitPress && selector.firstName.trim() === ""
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
                      isSubmitPress && selector.lastName.trim() === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <DropDownSelectionItem
                label={"Gender"}
                value={selector.gender}
                onPress={() => showDropDownModelMethod("GENDER", "Gender")}
              />

              <Text style={GlobalStyle.underline} />
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
                maxLength={2}
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
                      isSubmitPress && selector.mobile.trim() === ""
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
                  dispatch(setPersonalIntro({ key: "OCCUPATION", text: text }))
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
                label={"Customer Type"}
                value={selector.customerTypes}
                onPress={() =>
                  showDropDownModelMethod(
                    "CUSTOMER_TYPE",
                    "Select Customer Type"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
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
                label={"Pincode"}
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
                label={"Vehicle Reg. No*"}
                onChangeText={(text) =>
                  dispatch(
                    setVehicleInformation({ key: "VEHICLE_REG_NO", text: text })
                  )
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.vehicleRegNo.trim() === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <DropDownSelectionItem
                label={"Vehicle Make"}
                value={selector.vehicleMaker}
                onPress={() =>
                  showDropDownModelMethod(
                    "VEHICLE_MAKER",
                    "Select Vehicle Make"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Model"}
                value={selector.vehicleModel}
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
                value={selector.vehicleVariant}
                onPress={() =>
                  showDropDownModelMethod(
                    "VEHICLE_VARIANT",
                    "Select Vehicle Variant"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Color"}
                value={selector.vehicleColor}
                onPress={() =>
                  showDropDownModelMethod(
                    "VEHICLE_COLOR",
                    "Select Vehicle Color"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.vehicleFuelType}
                label={"Fuel Type"}
                editable={false}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.vehicleTransmissionType}
                label={"Transmission Type"}
                editable={false}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.vin}
                label={"VIN*"}
                onChangeText={(text) =>
                  dispatch(setVehicleInformation({ key: "VIN", text: text }))
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.vin.trim() === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
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
                value={selector.chassisNumber}
                label={"Chassis Number"}
                onChangeText={(text) =>
                  dispatch(
                    setVehicleInformation({ key: "CHASSIS_NUMBER", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.kmReading}
                label={"Km Reading*"}
                onChangeText={(text) =>
                  dispatch(
                    setVehicleInformation({ key: "KM_READING", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"Sale Date*"}
                value={selector.saleDate}
                onPress={() => showDatePickerModelMethod("SALE_DATE")}
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.saleDate === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <DropDownSelectionItem
                label={"Making Month*"}
                value={selector.makingMonth}
                onPress={() =>
                  showDropDownModelMethod("MAKING_MONTH", "Select Making Month")
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.makingMonth === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
              <TextinputComp
                value={selector.makingYear}
                maxLength={4}
                keyboardType="number-pad"
                label={"Making Year*"}
                onChangeText={(text) =>
                  dispatch(
                    setVehicleInformation({ key: "MAKING_YEAR", text: text })
                  )
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.makingYear.trim() === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              />
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
              <DropDownSelectionItem
                label={"Fastag"}
                value={selector.fastag}
                onPress={() =>
                  showDropDownModelMethod("FASTAG", "Select Fastag")
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
                label={"Service Type"}
                value={selector.serviceType}
                onPress={() =>
                  showDropDownModelMethod("SERVICE_TYPE", "Select Service Type")
                }
              />
              <Text style={GlobalStyle.underline} />
              <DropDownSelectionItem
                label={"Sub Service Type"}
                value={selector.subServiceType}
                onPress={() =>
                  showDropDownModelMethod(
                    "SUB_SERVICE_TYPE",
                    "Select Sub Service Type"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
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
            <View style={styles.space} />
            <List.Accordion
              id={"5"}
              title={"Insurance Information"}
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
              <DropDownSelectionItem
                label={"Insurance Company"}
                value={selector.insuranceCompany}
                onPress={() =>
                  showDropDownModelMethod(
                    "INSURANCE_COMPANY",
                    "Select Insurance Company"
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"Insurance Start Date"}
                value={selector.insuranceStartDate}
                onPress={() =>
                  showDatePickerModelMethod("INSURANCE_START_DATE")
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"Insurance Expiry Date"}
                value={selector.insuranceExpiryDate}
                onPress={() =>
                  showDatePickerModelMethod("INSURANCE_EXPIRY_DATE")
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.insuranceAmount}
                label={"Insurance Amount"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(
                    setInsuranceInfo({ key: "INSURANCE_AMOUNT", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.insurancePolicyNo}
                label={"Insurance Policy No"}
                onChangeText={(text) =>
                  dispatch(
                    setInsuranceInfo({ key: "INSURANCE_POLICY_NO", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
            </List.Accordion>
            <View style={styles.space} />
            <List.Accordion
              id={"6"}
              title={"OEM Warranty Information"}
              titleStyle={{
                color: openAccordion === "6" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "6" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            >
              <DropDownSelectionItem
                label={"OEM Period"}
                value={selector.oemPeriod}
                onPress={() =>
                  showDropDownModelMethod("OEM_PERIOD", "Select OEM Period")
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.oemWarrantyNo}
                label={"OEM Warranty No"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(
                    setOemWarrantyInfo({ key: "OEM_WARRANTY_NO", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"OEM Start Date"}
                value={selector.oemStartDate}
                onPress={() => showDatePickerModelMethod("OEM_START_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"OEM End Date"}
                value={selector.oemEndDate}
                onPress={() => showDatePickerModelMethod("OEM_END_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.oemWarrantyAmount}
                label={"OEM Warranty Amount"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(
                    setOemWarrantyInfo({
                      key: "OEM_WARRANTY_AMOUNT",
                      text: text,
                    })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
            </List.Accordion>
            <View style={styles.space} />
            <List.Accordion
              id={"7"}
              title={"EX-Warranty Information"}
              titleStyle={{
                color: openAccordion === "7" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "7" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            >
              <DropDownSelectionItem
                label={"EW Type"}
                value={selector.ewType}
                onPress={() =>
                  showDropDownModelMethod("EW_TYPE", "Select EW Type")
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.ewPolicyNo}
                label={"EW Policy No"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(
                    setExWarrantyInfo({ key: "EW_POLICY_NO", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"EW Start Date"}
                value={selector.ewStartDate}
                onPress={() => showDatePickerModelMethod("EW_START_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"EW Expiry Date"}
                value={selector.ewExpiryDate}
                onPress={() => showDatePickerModelMethod("EW_EXPIRY_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.ewAmountPaid}
                label={"EW Amount Paid"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(
                    setExWarrantyInfo({ key: "EW_AMOUNT_PAID", text: text })
                  )
                }
              />
              <Text style={GlobalStyle.underline} />
            </List.Accordion>
            <View style={styles.space} />
            <List.Accordion
              id={"8"}
              title={"AMC Information"}
              titleStyle={{
                color: openAccordion === "8" ? Colors.BLACK : Colors.BLACK,
                fontSize: 16,
                fontWeight: "600",
              }}
              style={[
                {
                  backgroundColor:
                    openAccordion === "8" ? Colors.RED : Colors.WHITE,
                },
                styles.accordionBorder,
              ]}
            >
              <DropDownSelectionItem
                label={"AMC Name"}
                value={selector.amcName}
                onPress={() =>
                  showDropDownModelMethod("AMC_NAME", "Select AMC Name")
                }
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.amcPolicyNo}
                label={"AMC Policy No"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(setAmcInfo({ key: "AMC_POLICY_NO", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"AMC Start Date"}
                value={selector.amcStartDate}
                onPress={() => showDatePickerModelMethod("AMC_START_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <DateSelectItem
                label={"AMC Expiry Date"}
                value={selector.amcExpiryDate}
                onPress={() => showDatePickerModelMethod("AMC_EXPIRY_DATE")}
              />
              <Text style={GlobalStyle.underline} />
              <TextinputComp
                value={selector.amcAmountPaid}
                label={"AMC Amount Paid"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(setAmcInfo({ key: "AMC_AMOUNT_PAID", text: text }))
                }
              />
              <Text style={GlobalStyle.underline} />
            </List.Accordion>
          </List.AccordionGroup>

          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              style={{ width: "30%" }}
              color={Colors.GRAY}
              labelStyle={{ textTransform: "none", color: Colors.WHITE }}
              onPress={() => navigation.goBack()}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              style={{ width: "30%" }}
              color={Colors.PINK}
              labelStyle={{ textTransform: "none", color: Colors.WHITE }}
              onPress={() => submitClick()}
            >
              Submit
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoaderComponent visible={selector.isLoading} />
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 15
  },
});

export default AddCustomerInfo;