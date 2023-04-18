import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, Text, TouchableOpacity } from 'react-native';
import { View, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Button, IconButton, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { DatePickerComponent, DropDownComponant, LoaderComponent, TextinputComp } from '../../../../components';
import { Salutation_Types } from '../../../../jsonData/enquiryFormScreenJsonData';
import { DateSelectItem, DropDownSelectionItem, RadioTextItem, RadioTextItem2 } from '../../../../pureComponents';
import { addCustomer, clearStateData, editCustomer, getComplaintReasonsApi, getCustomerDetails, getCustomerTypesApi, getInsuranceCompanyApi, getServiceTypesApi, getSourceTypesApi, getSubServiceTypesApi, getVehicleInfo, setAmcInfo, setCommunicationAddress, setDatePicker, setDropDownData, setExWarrantyInfo, setInsuranceInfo, setOemWarrantyInfo, setPersonalIntro, setServiceInfo, setVehicleInformation, updateAddressByPincode, updateSelectedDate } from '../../../../redux/customerInfoReducer';
import { Colors, GlobalStyle } from '../../../../styles';
import * as AsyncStore from "../../../../asyncStore";
import { showToast, showToastRedAlert } from '../../../../utils/toast';
import { PincodeDetailsNew, isEmail } from '../../../../utils/helperFunctions';
import {
  COMPLAINT_STATUS,
  EW_TYPE,
  FASTAG,
  GENDER_TYPES,
  LAST_SERVICE_FEEDBACK,
  MONTH,
  OEM_PERIOD,
} from "../../../../jsonData/addCustomerScreenJsonData";
import moment from 'moment';
import { DropDownServices } from '../../../../pureComponents/dropDownServices';
import { TextInputServices } from '../../../../components/textInputServices';
import { DateSelectServices } from '../../../../pureComponents/dateSelectServices';

const AddCustomerInfo = ({ navigation, route }) => {
  const { fromScreen, vehicleRegNumber } = route.params;
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
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    getCustomerType();
    return () => {
      clearLocalData();
      dispatch(clearStateData());
    };
  }, []);

  // Getting Source type from api
  useEffect(() => {
    if (
      vehicleRegNumber &&
      fromScreen == "search" &&
      selector.customerDetailsResponse &&
      selector.sourceTypesResponse.length > 0
    ) {
      const { customerDetail } = selector.customerDetailsResponse;
      const { parentLeadSource, leadSource } = customerDetail;

      let sourceIndex = selector.sourceTypesResponse.findIndex(
        (item) => item.id == parentLeadSource
      );
      if (sourceIndex >= 0) {
        dispatch(
          setDropDownData({
            key: "SOURCE_TYPE",
            value: selector.sourceTypesResponse[sourceIndex].name,
          })
        );

        const element = selector.sourceTypesResponse[sourceIndex];
        if (element?.subtypeMap?.length > 0) {
          dispatch(
            setPersonalIntro({
              key: "SUB_SOURCE_RES",
              text: element.subtypeMap,
            })
          );

          let subSourceIndex = element.subtypeMap.findIndex(
            (item) => item.id == leadSource
          );
          if (subSourceIndex >= 0) {
            dispatch(
              setDropDownData({
                key: "SUB_SOURCE_TYPE",
                value: element.subtypeMap[subSourceIndex].name,
              })
            );
          }
        }
      }
    }
  }, [selector.customerDetailsResponse, selector.sourceTypesResponse]);

  // Getting Vehicle models from api
  useEffect(() => {
    if (
      vehicleRegNumber &&
      fromScreen == "search" &&
      selector.customerDetailsResponse &&
      selector.vehicleModelList.length > 0
    ) {
      const { vehicleDetail } = selector.customerDetailsResponse;
      const { vehicleModel, variant } = vehicleDetail;

      if (vehicleModel) {
        let modelIndex = selector.vehicleModelList.findIndex(
          (item) => item.model == vehicleModel
        );

        if (modelIndex >= 0) {
          const variantList = selector.vehicleModelList[modelIndex].varients;
          dispatch(
            setVehicleInformation({
              key: "VEHICLE_VARIANT_LIST",
              text: variantList,
            })
          );
          let variantIndex = variantList.findIndex(
            (item) => item.name == variant
          );

          if (variantIndex >= 0) {
            const selectedVariant = variantList[variantIndex];
            let colors = [];
            for (let i = 0; i < selectedVariant.vehicleImages.length; i++) {
              let data = {
                ...selectedVariant.vehicleImages[i],
                name: selectedVariant.vehicleImages[i].color,
              };
              colors.push(Object.assign({}, data));
            }
            dispatch(
              setVehicleInformation({ key: "VEHICLE_COLOR_LIST", text: colors })
            );
          }
        }
      }
    }
  }, [selector.customerDetailsResponse, selector.vehicleModelList]);

  // Getting Service type from api
  useEffect(async () => {
    if (
      vehicleRegNumber &&
      fromScreen == "search" &&
      selector.customerDetailsResponse &&
      selector.serviceTypeResponse.length > 0
    ) {
      const { historyDetail } = selector.customerDetailsResponse;
      const { serviceType, subServiceType } = historyDetail;
      if (serviceType) {
        let serviceTypeIndex = selector.serviceTypeResponse.findIndex(
          (item) => item.id == serviceType
        );
        if (serviceTypeIndex >= 0) {
          const selectedService =
            selector.serviceTypeResponse[serviceTypeIndex];
          dispatch(
            setDropDownData({
              key: "SERVICE_TYPE",
              value: selectedService.name,
            })
          );

          let payload = {
            tenantId: userData?.branchId,
            catId: selectedService.id,
          };
          const response = await dispatch(getSubServiceTypesApi(payload));

          if (response?.payload?.statusCode == 200) {
            const { body } = response.payload;
            let newArr = [];
            for (let i = 0; i < body.length; i++) {
              let data = { ...body[i], name: body[i].serviceName };
              newArr.push(Object.assign({}, data));
            }
            dispatch(
              setDropDownData({
                key: "SUB_SERVICE_TYPE_LIST",
                value: [...newArr],
              })
            );

            let subServiceTypeIndex = body.findIndex(
              (item) => item.id == subServiceType
            );

            if (subServiceTypeIndex >= 0) {
              const selectedSubService = body[subServiceTypeIndex];
              dispatch(
                setDropDownData({
                  key: "SUB_SERVICE_TYPE",
                  value: selectedSubService.serviceName,
                })
              );
            }
          }
        }
      }
    }
  }, [selector.customerDetailsResponse, selector.serviceTypeResponse]);

  const clearLocalData = () => {
    setOpenAccordion("0");
    setDropDownKey("");
    setDropDownTitle("Select Data");
    setShowDropDownModel(false);
    setDataForDropDown([]);
    setIsSubmitPress(false);
    setAddressData([]);
    setDatePickerMode("date");
  };

  const getCustomerType = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData(jsonObj);
      dispatch(getCustomerTypesApi(jsonObj.orgId));
      dispatch(getSourceTypesApi(jsonObj.branchId));
      dispatch(getServiceTypesApi(jsonObj.branchId));

      if (vehicleRegNumber && fromScreen == "search") {
        let customerDetailsPayload = {
          tenantId: jsonObj.branchId,
          vehicleRegNumber: vehicleRegNumber,
        };
        dispatch(getCustomerDetails(customerDetailsPayload));
      }

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
        setDataForDropDown([...GENDER_TYPES]);
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
      case "ADDRESS":
        setDataForDropDown([...addressData]);
        break;
      case "VEHICLE_MAKER":
        setDataForDropDown([...selector.vehicleMakerList]);
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
              tempAddr.push({ name: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                dispatch(setCommunicationAddress({ key: "ADDRESS", text: "" }));
                setAddressData([...tempAddr]);
              }
            }
          }
        }
      },
      (rejected) => {}
    );
  };

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

  const stringToNumber = (value) => {
    if (value) {
      return Number(value);
    } else {
      return 0;
    }
  };

  const getPayloadId = (type, value) => {
    if (value) {
      if (type == "serviceType") {
        let index = selector.serviceTypeResponse.findIndex(
          (item) => item.name == value
        );
        return selector.serviceTypeResponse[index].id;
      } else if (type == "subServiceType") {
        let index = selector.subServiceTypeResponse.findIndex(
          (item) => item.name == value
        );
        return selector.subServiceTypeResponse[index].id;
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

    if (selector.email.length > 0 && !isEmail(selector.email)) {
      scrollToPos(2);
      setOpenAccordion("1");
      showToast("Please enter valid email");
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
        kmReadingAtService: stringToNumber(selector.readingAtService),
        serviceCenter: selector.serviceCenter,
        serviceAmount: stringToNumber(selector.serviceAmount),
        // serviceType: getPayloadId("serviceType", selector.serviceType),
        serviceType: getPayloadId("subServiceType", selector.subServiceType),
        // subServiceType: getPayloadId("subServiceType", selector.subServiceType),
      },
      vehicleDetails: {
        vehicleRegNumber: selector.vehicleRegNo,
        vehicleMake: selector.vehicleMaker,
        vehicleModel: selector.vehicleModel,
        variant: selector.vehicleVariant,
        color: selector.vehicleColor,
        fuelType: selector.vehicleFuelType
          ? selector.vehicleFuelType.toUpperCase()
          : "",
        transmisionType: selector.vehicleTransmissionType,
        vin: selector.vin,
        engineNumber: selector.engineNumber,
        currentKmReading: stringToNumber(selector.kmReading),
        purchaseDate: convertDateForPayload(selector.saleDate),
        makingMonth: selector.makingMonth,
        makingYear: selector.makingYear,
        chassisNumber: selector.chassisNumber,
        sellingLocation: selector.sellingLocation,
        sellingDealer: selector.sellingDealer,
        isFastag: selector.fastag == "Yes" ? true : false,
      },
      customer: {
        salutation: selector.salutation,
        firstName: selector.firstName,
        lastName: selector.lastName,
        relationName: selector.relation,
        age: stringToNumber(selector.age),
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
        dateOfArrival: convertDateForPayload(selector.anniversaryDate),
        // refered_by: "dsfsdf", (not in UI)
      },
      insuranceRequest: {
        insuranceAmount: stringToNumber(selector.insuranceAmount),
        startDate: convertDateForPayload(selector.insuranceStartDate),
        endDate: convertDateForPayload(selector.insuranceExpiryDate),
        vendor: selector.insuranceCompany,
        insuranceIdentifier: selector.insurancePolicyNo,
      },
      warrantyRequests: [
        {
          startDate: convertDateForPayload(selector.amcStartDate),
          expiryDate: convertDateForPayload(selector.amcExpiryDate),
          amountPaid: stringToNumber(selector.amcAmountPaid),
          warrantyType: "MCP",
          amc_name: selector.amcName,
          number: selector.amcPolicyNo,
        },
        {
          startDate: convertDateForPayload(selector.ewStartDate),
          expiryDate: convertDateForPayload(selector.ewExpiryDate),
          amountPaid: stringToNumber(selector.ewAmountPaid),
          warrantyType: "EW",
          ewName: selector.ewType,
          number: selector.ewPolicyNo,
        },
        {
          startDate: convertDateForPayload(selector.oemStartDate),
          expiryDate: convertDateForPayload(selector.oemEndDate),
          amountPaid: stringToNumber(selector.oemWarrantyAmount),
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

    if (fromScreen == "search") {
      payload.customerData.vehicleHistoryRequest.id =
        selector.customerDetailsResponse.historyDetail.id;
      payload.customerData.vehicleDetails.id =
        selector.customerDetailsResponse.vehicleDetail.id;
      payload.customerData.customer.id =
        selector.customerDetailsResponse.customerDetail.id;
      payload.customerData.insuranceRequest.id =
        selector.customerDetailsResponse.insuranceDetail.id;

      let mcpId = "";
      let ewId = "";
      let oemId = "";

      const element = selector.customerDetailsResponse.warrantyDetail;
      for (let i = 0; i < element.length; i++) {
        if (element[i].warrantyType == "MCP") {
          mcpId = element[i].id;
        } else if (element[i].warrantyType == "EW") {
          ewId = element[i].id;
        } else if (element[i].warrantyType == "OEM") {
          oemId = element[i].id;
        }
      }

      const newElement = payload.customerData.warrantyRequests;
      for (let i = 0; i < element.length; i++) {
        if (newElement[i].warrantyType == "MCP") {
          payload.customerData.warrantyRequests[i].id = mcpId;
        } else if (newElement[i].warrantyType == "EW") {
          payload.customerData.warrantyRequests[i].id = ewId;
        } else if (newElement[i].warrantyType == "OEM") {
          payload.customerData.warrantyRequests[i].id = oemId;
        }
      }

      dispatch(editCustomer(payload));
    } else {
      dispatch(addCustomer(payload));
    }
  };

  const scrollToPos = (itemIndex) => {
    scrollRef.current.scrollTo({ y: itemIndex * 70 });
  };

  useEffect(() => {
    if (selector.addCustomerResponseStatus == "success") {
      showToastRedAlert("Customer Added Successfully");
      setTimeout(() => {
        navigation.popToTop();
      }, 500);
    }
  }, [selector.addCustomerResponseStatus]);

  useEffect(() => {
    if (selector.editCustomerResponseStatus == "success") {
      showToastRedAlert("Information Updated Successfully");
      setIsEditable(false);
    }
  }, [selector.editCustomerResponseStatus]);

  const isEditEnabled = () => {
    if (fromScreen == "search" && isEditable) {
      return true;
    } else if (fromScreen == "addCustomer") {
      return true;
    } else {
      return false;
    }
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
          if (dropDownKey == "ADDRESS") {
            dispatch(updateAddressByPincode(item.value));
          } else if (dropDownKey == "SERVICE_TYPE") {
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
              <View style={styles.accordionContainer}>
                <DropDownServices
                  label={"Salutation"}
                  value={selector.salutation}
                  onPress={() =>
                    showDropDownModelMethod("SALUTATION", "Select Salutation")
                  }
                  clearOption={true}
                  clearKey={"SALUTATION"}
                  onClear={onDropDownClear}
                  disabled={!isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <TextInputServices
                    value={selector.firstName}
                    label={"First Name*"}
                    placeholder={"Enter First Name"}
                    autoCapitalize="words"
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setPersonalIntro({ key: "FIRST_NAME", text: text })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.firstName.trim() === ""}
                    editable={isEditEnabled()}
                  />

                  <TextInputServices
                    value={selector.lastName}
                    label={"Last Name*"}
                    placeholder={"Enter Last Name"}
                    autoCapitalize="words"
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setPersonalIntro({ key: "LAST_NAME", text: text })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.lastName.trim() === ""}
                    editable={isEditEnabled()}
                  />
                </View>

                <View style={styles.inputRow}>
                  <DropDownServices
                    label={"Gender"}
                    value={selector.gender}
                    onPress={() => showDropDownModelMethod("GENDER", "Gender")}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                    clearOption={true}
                    clearKey={"GENDER"}
                    onClear={onDropDownClear}
                  />

                  <DropDownServices
                    label={"Relation Name"}
                    value={selector.relation}
                    onPress={() =>
                      showDropDownModelMethod("RELATION", "Relation")
                    }
                    clearOption={true}
                    clearKey={"RELATION"}
                    onClear={onDropDownClear}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                </View>

                <View style={styles.inputRow}>
                  <DateSelectServices
                    label={"Date Of Birth"}
                    value={selector.dateOfBirth}
                    onPress={() => showDatePickerModelMethod("DATE_OF_BIRTH")}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />

                  <TextInputServices
                    value={selector?.age?.toString()}
                    label={"Age"}
                    keyboardType={"number-pad"}
                    maxLength={2}
                    onChangeText={(text) =>
                      dispatch(setPersonalIntro({ key: "AGE", text: text }))
                    }
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                </View>

                <DateSelectServices
                  label={"Anniversary Date"}
                  value={selector.anniversaryDate}
                  onPress={() => showDatePickerModelMethod("ANNIVERSARY_DATE")}
                  disabled={!isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <TextInputServices
                    value={selector.mobile}
                    label={"Mobile Number*"}
                    placeholder={"Enter Mobile Number"}
                    maxLength={10}
                    keyboardType={"phone-pad"}
                    onChangeText={(text) =>
                      dispatch(setPersonalIntro({ key: "MOBILE", text: text }))
                    }
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.mobile.trim() === ""}
                    editable={isEditEnabled()}
                  />

                  <TextInputServices
                    value={selector.alterMobile}
                    label={"Alternate Mobile Number"}
                    keyboardType={"phone-pad"}
                    maxLength={10}
                    onChangeText={(text) =>
                      dispatch(
                        setPersonalIntro({ key: "ALTER_MOBILE", text: text })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                </View>

                <TextInputServices
                  value={selector.email}
                  label={"Email ID"}
                  keyboardType={"email-address"}
                  onChangeText={(text) =>
                    dispatch(setPersonalIntro({ key: "EMAIL", text: text }))
                  }
                  editable={isEditEnabled()}
                />

                <TextInputServices
                  value={selector.occupation}
                  autoCapitalize="words"
                  label={"Occupation"}
                  keyboardType={"default"}
                  maxLength={40}
                  onChangeText={(text) =>
                    dispatch(
                      setPersonalIntro({ key: "OCCUPATION", text: text })
                    )
                  }
                  editable={isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <DropDownServices
                    label={"Source Type*"}
                    value={selector.sourceType}
                    onPress={() =>
                      showDropDownModelMethod(
                        "SOURCE_TYPE",
                        "Select Source Type"
                      )
                    }
                    error={isSubmitPress && selector.sourceType === ""}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />

                  <DropDownServices
                    label={"Sub Source Type*"}
                    value={selector.subSourceType}
                    onPress={() =>
                      showDropDownModelMethod(
                        "SUB_SOURCE_TYPE",
                        "Select Sub Source Type"
                      )
                    }
                    error={isSubmitPress && selector.subSourceType === ""}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                </View>

                <DropDownServices
                  label={"Customer Type"}
                  value={selector.customerTypes}
                  onPress={() =>
                    showDropDownModelMethod(
                      "CUSTOMER_TYPE",
                      "Select Customer Type"
                    )
                  }
                  disabled={!isEditEnabled()}
                />
              </View>
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
              <View style={styles.accordionContainer}>
                <TextInputServices
                  value={selector.pincode}
                  label={"Pincode"}
                  maxLength={6}
                  keyboardType={"number-pad"}
                  onChangeText={(text) => {
                    if (text.length === 6) {
                      updateAddressDetails(text);
                    }
                    dispatch(
                      setCommunicationAddress({ key: "PINCODE", text: text })
                    );
                  }}
                  editable={isEditEnabled()}
                />

                {addressData.length > 0 && (
                  <DropDownServices
                    label={"Address"}
                    value={selector.addressName}
                    onPress={() =>
                      showDropDownModelMethod("ADDRESS", "Select Address")
                    }
                    clearOption={true}
                    clearKey={"ADDRESS"}
                    onClear={() => {
                      let tmp = addressData;
                      setAddressData([]);
                      setAddressData([...tmp]);
                      dispatch(updateAddressByPincode(""));
                    }}
                    disabled={!isEditEnabled()}
                  />
                )}

                <View style={styles.radioGroupBcVw}>
                  <RadioTextItem2
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
                    disabled={!isEditEnabled()}
                  />
                  <RadioTextItem2
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
                    disabled={!isEditEnabled()}
                  />
                </View>

                <TextInputServices
                  value={selector.houseNum}
                  label={"H.No"}
                  maxLength={50}
                  onChangeText={(text) =>
                    dispatch(
                      setCommunicationAddress({ key: "HOUSE_NO", text: text })
                    )
                  }
                  editable={isEditEnabled()}
                />

                <TextInputServices
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
                  editable={isEditEnabled()}
                />

                <TextInputServices
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
                  editable={isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <TextInputServices
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
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                  <TextInputServices
                    value={selector.city}
                    label={"City"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setCommunicationAddress({ key: "CITY", text: text })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                </View>

                <View style={styles.inputRow}>
                  <TextInputServices
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
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                  <TextInputServices
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
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                </View>
              </View>
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
              <View style={styles.accordionContainer}>
                <TextInputServices
                  value={selector.vehicleRegNo}
                  label={"Vehicle Reg. No*"}
                  placeholder={"Enter Vehicle Reg. No"}
                  onChangeText={(text) =>
                    dispatch(
                      setVehicleInformation({
                        key: "VEHICLE_REG_NO",
                        text: text,
                      })
                    )
                  }
                  error={isSubmitPress && selector.vehicleRegNo.trim() === ""}
                  editable={isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <DropDownServices
                    label={"Vehicle Make"}
                    value={selector.vehicleMaker}
                    onPress={() =>
                      showDropDownModelMethod(
                        "VEHICLE_MAKER",
                        "Select Vehicle Make"
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                    clearOption={true}
                    clearKey={"VEHICLE_MAKER"}
                    onClear={onDropDownClear}
                  />
                  <DropDownServices
                    label={"Model"}
                    value={selector.vehicleModel}
                    onPress={() =>
                      showDropDownModelMethod(
                        "VEHICLE_MODEL",
                        "Select Vehicle Model"
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                    clearOption={true}
                    clearKey={"VEHICLE_MODEL"}
                    onClear={onDropDownClear}
                  />
                </View>

                <View style={styles.inputRow}>
                  <DropDownServices
                    label={"Variant"}
                    value={selector.vehicleVariant}
                    onPress={() =>
                      showDropDownModelMethod(
                        "VEHICLE_VARIANT",
                        "Select Vehicle Variant"
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                    clearOption={true}
                    clearKey={"VEHICLE_VARIANT"}
                    onClear={onDropDownClear}
                  />
                  <DropDownServices
                    label={"Color"}
                    value={selector.vehicleColor}
                    onPress={() =>
                      showDropDownModelMethod(
                        "VEHICLE_COLOR",
                        "Select Vehicle Color"
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                    clearOption={true}
                    clearKey={"VEHICLE_COLOR"}
                    onClear={onDropDownClear}
                  />
                </View>

                <View style={styles.inputRow}>
                  <TextInputServices
                    value={selector.vehicleFuelType}
                    label={"Fuel Type"}
                    editable={false}
                    containerStyle={styles.rowInputBox}
                  />
                  <TextInputServices
                    value={selector.vehicleTransmissionType}
                    label={"Transmission Type"}
                    editable={false}
                    containerStyle={styles.rowInputBox}
                  />
                </View>

                <TextInputServices
                  value={selector.vin}
                  label={"VIN*"}
                  placeholder={"Enter VIN"}
                  onChangeText={(text) =>
                    dispatch(setVehicleInformation({ key: "VIN", text: text }))
                  }
                  error={isSubmitPress && selector.vin.trim() === ""}
                  editable={isEditEnabled()}
                />

                <TextInputServices
                  value={selector.engineNumber}
                  label={"Engine Number"}
                  onChangeText={(text) =>
                    dispatch(
                      setVehicleInformation({
                        key: "ENGINE_NUMBER",
                        text: text,
                      })
                    )
                  }
                  editable={isEditEnabled()}
                />

                <TextInputServices
                  value={selector.chassisNumber}
                  label={"Chassis Number"}
                  onChangeText={(text) =>
                    dispatch(
                      setVehicleInformation({
                        key: "CHASSIS_NUMBER",
                        text: text,
                      })
                    )
                  }
                  editable={isEditEnabled()}
                />

                <TextInputServices
                  value={selector.kmReading}
                  label={"Km Reading*"}
                  onChangeText={(text) =>
                    dispatch(
                      setVehicleInformation({ key: "KM_READING", text: text })
                    )
                  }
                  error={isSubmitPress && selector.kmReading.trim() == ""}
                  editable={isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <DropDownServices
                    label={"Making Month*"}
                    placeholder={"Enter Making Month"}
                    value={selector.makingMonth}
                    onPress={() =>
                      showDropDownModelMethod(
                        "MAKING_MONTH",
                        "Select Making Month"
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.makingMonth === ""}
                    disabled={!isEditEnabled()}
                  />
                  <TextInputServices
                    value={selector.makingYear}
                    maxLength={4}
                    keyboardType="number-pad"
                    label={"Making Year*"}
                    placeholder={"Enter Making Year"}
                    onChangeText={(text) =>
                      dispatch(
                        setVehicleInformation({
                          key: "MAKING_YEAR",
                          text: text,
                        })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.makingYear === ""}
                    editable={isEditEnabled()}
                  />
                </View>

                <View style={styles.inputRow}>
                  <DateSelectServices
                    label={"Sale Date*"}
                    value={selector.saleDate}
                    onPress={() => showDatePickerModelMethod("SALE_DATE")}
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.saleDate === ""}
                    disabled={!isEditEnabled()}
                  />
                  <TextInputServices
                    value={selector.sellingDealer}
                    label={"Selling Dealer"}
                    onChangeText={(text) =>
                      dispatch(
                        setVehicleInformation({
                          key: "SELLING_DEALER",
                          text: text,
                        })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                </View>

                <View style={styles.inputRow}>
                  <TextInputServices
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
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                  <DropDownServices
                    label={"Fastag"}
                    value={selector.fastag}
                    onPress={() =>
                      showDropDownModelMethod("FASTAG", "Select Fastag")
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                </View>
              </View>
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
              <View style={styles.accordionContainer}>
                <DateSelectServices
                  label={"Service Date"}
                  value={selector.serviceDate}
                  onPress={() => showDatePickerModelMethod("SERVICE_DATE")}
                  disabled={!isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <DropDownServices
                    label={"Service Type"}
                    value={selector.serviceType}
                    onPress={() =>
                      showDropDownModelMethod(
                        "SERVICE_TYPE",
                        "Select Service Type"
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                    clearOption={true}
                    clearKey={"SERVICE_TYPE"}
                    onClear={onDropDownClear}
                  />
                  <DropDownServices
                    label={"Sub Service Type"}
                    value={selector.subServiceType}
                    onPress={() =>
                      showDropDownModelMethod(
                        "SUB_SERVICE_TYPE",
                        "Select Sub Service Type"
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                    clearOption={true}
                    clearKey={"SUB_SERVICE_TYPE"}
                    onClear={onDropDownClear}
                  />
                </View>

                <View style={styles.inputRow}>
                  <TextInputServices
                    value={selector.serviceAmount}
                    label={"Service Amount"}
                    maxLength={10}
                    keyboardType={"number-pad"}
                    onChangeText={(text) =>
                      dispatch(
                        setServiceInfo({ key: "SERVICE_AMOUNT", text: text })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                  <TextInputServices
                    value={selector.serviceCenter}
                    label={"Service Center"}
                    onChangeText={(text) =>
                      dispatch(
                        setServiceInfo({ key: "SERVICE_CENTER", text: text })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                </View>

                <View style={styles.inputRow}>
                  <TextInputServices
                    value={selector.readingAtService}
                    label={"Reading at Service"}
                    onChangeText={(text) =>
                      dispatch(
                        setServiceInfo({
                          key: "READING_AT_SERVICE",
                          text: text,
                        })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                  <TextInputServices
                    value={selector.serviceAdvisor}
                    label={"Service Advisor"}
                    onChangeText={(text) =>
                      dispatch(
                        setServiceInfo({ key: "SERVICE_ADVISOR", text: text })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                </View>

                <View style={styles.inputRow}>
                  <TextInputServices
                    value={selector.serviceDealerName}
                    label={"Dealer Name"}
                    onChangeText={(text) =>
                      dispatch(
                        setServiceInfo({
                          key: "SERVICE_DEALER_NAME",
                          text: text,
                        })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                  <TextInputServices
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
                    containerStyle={styles.rowInputBox}
                    editable={isEditEnabled()}
                  />
                </View>

                <DropDownServices
                  label={"Last Service Feedback"}
                  value={selector.serviceFeedback}
                  onPress={() =>
                    showDropDownModelMethod(
                      "SERVICE_FEEDBACK",
                      "Select Last Service Feedback"
                    )
                  }
                  disabled={!isEditEnabled()}
                  clearOption={true}
                  clearKey={"SERVICE_FEEDBACK"}
                  onClear={onDropDownClear}
                />

                <View style={styles.inputRow}>
                  <DropDownServices
                    label={"Complaint Reason"}
                    value={selector.complaintReason}
                    onPress={() =>
                      showDropDownModelMethod(
                        "COMPLAINT_REASON",
                        "Select Complaint Reason"
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                    clearOption={true}
                    clearKey={"COMPLAINT_REASON"}
                    onClear={onDropDownClear}
                  />
                  <DropDownServices
                    label={"Complaint Status"}
                    value={selector.complaintStatus}
                    onPress={() =>
                      showDropDownModelMethod(
                        "COMPLAINT_STATUS",
                        "Select Complaint Status"
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                    clearOption={true}
                    clearKey={"COMPLAINT_STATUS"}
                    onClear={onDropDownClear}
                  />
                </View>
              </View>
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
              <View style={styles.accordionContainer}>
                <DropDownServices
                  label={"Insurance Company"}
                  value={selector.insuranceCompany}
                  onPress={() =>
                    showDropDownModelMethod(
                      "INSURANCE_COMPANY",
                      "Select Insurance Company"
                    )
                  }
                  disabled={!isEditEnabled()}
                  clearOption={true}
                  clearKey={"INSURANCE_COMPANY"}
                  onClear={onDropDownClear}
                />

                <TextInputServices
                  value={selector.insurancePolicyNo}
                  label={"Insurance Policy No"}
                  onChangeText={(text) =>
                    dispatch(
                      setInsuranceInfo({
                        key: "INSURANCE_POLICY_NO",
                        text: text,
                      })
                    )
                  }
                  editable={isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <DateSelectServices
                    label={"Insurance Start Date"}
                    value={selector.insuranceStartDate}
                    onPress={() =>
                      showDatePickerModelMethod("INSURANCE_START_DATE")
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                  <DateSelectServices
                    label={"Insurance Expiry Date"}
                    value={selector.insuranceExpiryDate}
                    onPress={() =>
                      showDatePickerModelMethod("INSURANCE_EXPIRY_DATE")
                    }
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                </View>

                <TextInputServices
                  value={selector.insuranceAmount}
                  label={"Insurance Amount"}
                  maxLength={10}
                  keyboardType={"number-pad"}
                  onChangeText={(text) =>
                    dispatch(
                      setInsuranceInfo({
                        key: "INSURANCE_AMOUNT",
                        text: text,
                      })
                    )
                  }
                  editable={isEditEnabled()}
                />
              </View>
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
              <View style={styles.accordionContainer}>
                <DropDownServices
                  label={"OEM Period"}
                  value={selector.oemPeriod}
                  onPress={() =>
                    showDropDownModelMethod("OEM_PERIOD", "Select OEM Period")
                  }
                  disabled={!isEditEnabled()}
                  clearOption={true}
                  clearKey={"OEM_PERIOD"}
                  onClear={onDropDownClear}
                />

                <TextInputServices
                  value={selector.oemWarrantyNo}
                  label={"OEM Warranty No"}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) =>
                    dispatch(
                      setOemWarrantyInfo({
                        key: "OEM_WARRANTY_NO",
                        text: text,
                      })
                    )
                  }
                  editable={isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <DateSelectServices
                    label={"OEM Start Date"}
                    value={selector.oemStartDate}
                    onPress={() => showDatePickerModelMethod("OEM_START_DATE")}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                  <DateSelectServices
                    label={"OEM End Date"}
                    value={selector.oemEndDate}
                    onPress={() => showDatePickerModelMethod("OEM_END_DATE")}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                </View>

                <TextInputServices
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
                  editable={isEditEnabled()}
                />
              </View>
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
              <View style={styles.accordionContainer}>
                <DropDownServices
                  label={"EW Type"}
                  value={selector.ewType}
                  onPress={() =>
                    showDropDownModelMethod("EW_TYPE", "Select EW Type")
                  }
                  disabled={!isEditEnabled()}
                  clearOption={true}
                  clearKey={"EW_TYPE"}
                  onClear={onDropDownClear}
                />

                <TextInputServices
                  value={selector.ewPolicyNo}
                  label={"EW Policy No"}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) =>
                    dispatch(
                      setExWarrantyInfo({ key: "EW_POLICY_NO", text: text })
                    )
                  }
                  editable={isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <DateSelectServices
                    label={"EW Start Date"}
                    value={selector.ewStartDate}
                    onPress={() => showDatePickerModelMethod("EW_START_DATE")}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                  <DateSelectServices
                    label={"EW Expiry Date"}
                    value={selector.ewExpiryDate}
                    onPress={() => showDatePickerModelMethod("EW_EXPIRY_DATE")}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                </View>

                <TextInputServices
                  value={selector.ewAmountPaid}
                  label={"EW Amount Paid"}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) =>
                    dispatch(
                      setExWarrantyInfo({ key: "EW_AMOUNT_PAID", text: text })
                    )
                  }
                  editable={isEditEnabled()}
                />
              </View>
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
              <View style={styles.accordionContainer}>
                <DropDownServices
                  label={"AMC Name"}
                  value={selector.amcName}
                  onPress={() =>
                    showDropDownModelMethod("AMC_NAME", "Select AMC Name")
                  }
                  disabled={!isEditEnabled()}
                  clearOption={true}
                  clearKey={"AMC_NAME"}
                  onClear={onDropDownClear}
                />

                <TextInputServices
                  value={selector.amcPolicyNo}
                  label={"AMC Policy No"}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) =>
                    dispatch(setAmcInfo({ key: "AMC_POLICY_NO", text: text }))
                  }
                  editable={isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <DateSelectServices
                    label={"AMC Start Date"}
                    value={selector.amcStartDate}
                    onPress={() => showDatePickerModelMethod("AMC_START_DATE")}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                  <DateSelectServices
                    label={"AMC Expiry Date"}
                    value={selector.amcExpiryDate}
                    onPress={() => showDatePickerModelMethod("AMC_EXPIRY_DATE")}
                    containerStyle={styles.rowInputBox}
                    disabled={!isEditEnabled()}
                  />
                </View>

                <TextInputServices
                  value={selector.amcAmountPaid}
                  label={"AMC Amount Paid"}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  onChangeText={(text) =>
                    dispatch(setAmcInfo({ key: "AMC_AMOUNT_PAID", text: text }))
                  }
                  editable={isEditEnabled()}
                />
              </View>
            </List.Accordion>
          </List.AccordionGroup>

          {fromScreen == "search" && !isEditable && (
            <TouchableOpacity
              style={styles.editBtnContainer}
              onPress={() => setIsEditable(true)}
            >
              <Text style={styles.editBtnText}>EDIT DETAILS</Text>
            </TouchableOpacity>
          )}

          {(fromScreen == "search" && isEditable) ||
          fromScreen == "addCustomer" ? (
            <View style={styles.buttonRow}>
              <Button
                mode="contained"
                style={{ width: "30%" }}
                color={Colors.GRAY}
                labelStyle={{ textTransform: "none", color: Colors.WHITE }}
                onPress={() => {
                  if (fromScreen == "addCustomer") {
                    navigation.goBack();
                  } else {
                    setIsEditable(false);
                  }
                }}
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
                {fromScreen == "search" ? "Save" : "Submit"}
              </Button>
            </View>
          ) : null}
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
    backgroundColor: Colors.WHITE,
  },
  accordionBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
  },
  space: {
    height: 5,
  },
  accordionContainer: {
    marginHorizontal: 15,
    marginTop: 5,
  },
  rowInputBox: { width: "48%" },
  inputRow: { flexDirection: "row", justifyContent: "space-between" },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 15,
  },
  editBtnContainer: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.PINK,
    marginTop: 20,
    paddingVertical: 14,
  },
  editBtnText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default AddCustomerInfo;