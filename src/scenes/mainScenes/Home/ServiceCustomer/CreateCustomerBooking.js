import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ScrollView,KeyboardAvoidingView, Keyboard, Pressable, TouchableOpacity } from "react-native";
import { Colors } from '../../../../styles';
import { DropDownServices } from '../../../../pureComponents/dropDownServices';
import { useDispatch, useSelector } from 'react-redux';
import { DatePickerComponent, DropDownComponant, LoaderComponent } from '../../../../components';
import * as AsyncStore from "../../../../asyncStore";
import {
  setDropDownData,
  getServiceTypesApi,
  getSubServiceTypesApi,
  setDatePicker,
  updateSelectedDate,
  getTimeSlots,
  setInputInfo,
  clearStateData,
  getCities,
  createCustomerBooking,
  getDrivers,
  getBookedSlotsList,
  getCenterCodes,
  setExistingBookingData,
  cancelCustomerBooking,
  rescheduleCustomerBooking,
} from "../../../../redux/serviceBookingReducer";
import { BOOKING_FACILITIES, NAME_LIST, REASON_LIST } from '../../../../jsonData/addCustomerScreenJsonData';
import { DateSelectServices } from '../../../../pureComponents/dateSelectServices';
import moment from 'moment';
import { Checkbox, IconButton } from 'react-native-paper';
import { FlatList } from 'react-native';
import Fontisto from "react-native-vector-icons/Fontisto";
import { TextInputServices } from '../../../../components/textInputServices';
import { convertTimeStampToDateString, convertToTime } from '../../../../utils/helperFunctions';
import { showToast, showToastRedAlert } from '../../../../utils/toast';
import BookedSlotsListModel from './BookedSlotsListModel';

var isInitial = false;

const CreateCustomerBooking = ({ navigation, route }) => {
  const { currentUserData, isRefreshList, fromType, existingBookingData } =
    route.params;
  const dispatch = useDispatch();
  let scrollRef = useRef(null);
  const selector = useSelector((state) => state.serviceBookingReducer);
  const customerInfoSelector = useSelector(
    (state) => state.customerInfoReducer
  );

  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [userData, setUserData] = useState("");
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [timeSlotListVisible, setTimeSlotListVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [sameAddress, setSameAddress] = useState("unchecked");
  const [isSubmitPress, setIsSubmitPress] = useState(false);
  const [bookedSlotsModal, setBookedSlotsModal] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

  useEffect(() => {
    if (currentUserData?.branchId) {
      setUserData(currentUserData);
      initialCall(currentUserData);
    } else {
      getCurrentUser();
    }

    if (fromType && fromType == "editBooking") {
      setExistingData();
    }

    if (existingBookingData) {
      isInitial = true;
    }

    return () => {
      dispatch(clearStateData());
      clearLocalStorage();
      isInitial = false;
    };
  }, []);

  const isEditEnabled = (type) => {
    if (type && type == "cancel") {
      if (existingBookingData?.serviceAppointmentStatus == "BOOKED") {
        return true;
      } else {
        return false;
      }
    } else if (fromType && fromType == "editBooking") {
      if (
        existingBookingData?.serviceAppointmentStatus == "BOOKED" &&
        !isCancel
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const setExistingData = () => {
    dispatch(setExistingBookingData(existingBookingData));
  };

  const clearLocalStorage = () => {
    setDropDownKey("");
    setDropDownTitle("Select Data");
    setShowDropDownModel(false);
    setDataForDropDown([]);
    setUserData("");
    setDatePickerMode("date");
    setTimeSlotListVisible(false);
    setSelectedIndex(null);
    setSameAddress("unchecked");
    setIsSubmitPress(false);
    setBookedSlotsModal(false);
  };

  const getCurrentUser = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData(jsonObj);
      initialCall(jsonObj);
    }
  };

  const initialCall = (data) => {
    const { branchId, orgId } = data;
    dispatch(getServiceTypesApi(branchId));
    dispatch(getCities(orgId));
    dispatch(getCenterCodes(orgId));
  };

  useEffect(() => {
    if (selector.location && selector.centerCodes.length > 0) {
      let arr = [];
      let cityId = getPayloadId("cities", selector.location);
      for (let i = 0; i < selector.centerCodes.length; i++) {
        if (cityId == selector.centerCodes[i].parentId) {
          arr.push(selector.centerCodes[i]);
        }
      }
      if (!isInitial) {
        dispatch(setDropDownData({ key: "SERVICE_CENTER_CODE", value: "" }));
      }
      dispatch(
        setDropDownData({ key: "SERVICE_CENTER_CODE_LIST", value: [...arr] })
      );
    } else {
      if (!isInitial) {
        dispatch(setDropDownData({ key: "SERVICE_CENTER_CODE", value: "" }));
      }
      dispatch(setDropDownData({ key: "SERVICE_CENTER_CODE_LIST", value: [] }));
    }
  }, [selector.location, selector.centerCodes]);

  useEffect(() => {
    if (selector.serviceType && selector.serviceTypeResponse.length > 0) {
      let serviceIndex = selector.serviceTypeResponse.findIndex(
        (item) => item.name == selector.serviceType
      );
      if (serviceIndex >= 0) {
        let payload = {
          tenantId: userData?.branchId,
          catId: selector.serviceTypeResponse[serviceIndex].id,
        };
        dispatch(getSubServiceTypesApi(payload));
      }
    }
  }, [selector.serviceType, selector.serviceTypeResponse]);

  useEffect(() => {
    if (selector.createCustomerBookingResponseStatus == "success") {
      showToastRedAlert("Booking Created Successfully");
      isRefreshList();
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [selector.createCustomerBookingResponseStatus]);

  useEffect(() => {
    if (selector.rescheduleCustomerBookingResponseStatus == "success") {
      showToastRedAlert("Booking Rescheduled Successfully");
      isRefreshList();
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [selector.rescheduleCustomerBookingResponseStatus]);

  useEffect(() => {
    if (selector.cancelCustomerBookingResponseStatus == "success") {
      showToastRedAlert("Booking Cancel Successfully");
      isRefreshList();
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [selector.cancelCustomerBookingResponseStatus]);

  useEffect(() => {
    if (selector.serviceReqDate) {
      let payload = {
        tenantId: userData.branchId,
        date: moment(selector.serviceReqDate).format("YYYY-MM-DD"),
      };
      setSelectedIndex(null);
      dispatch(getTimeSlots(payload));
    }
  }, [selector.serviceReqDate]);

  useEffect(() => {
    if (selector.selectedTimeSlot && selector.bookingTimeSlotsList.length > 0) {
      for (let i = 0; i < selector.bookingTimeSlotsList.length; i++) {
        if (
          selector.selectedTimeSlot == selector.bookingTimeSlotsList[i].slotId
        ) {
          setSelectedIndex(i);
          setTimeSlotListVisible(true);
          break;
        }
      }
    }
  }, [selector.selectedTimeSlot, selector.bookingTimeSlotsList]);

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();
    switch (key) {
      case "SERVICE_TYPE":
        setDataForDropDown([...selector.serviceTypeResponse]);
        break;
      case "SUB_SERVICE_TYPE":
        setDataForDropDown([...selector.subServiceTypeResponse]);
        break;
      case "BOOKING_FACILITIES":
        setDataForDropDown([...BOOKING_FACILITIES]);
        break;
      case "LOCATION":
        setDataForDropDown([...selector.cities]);
        break;
      case "SERVICE_CENTER_CODE":
        setDataForDropDown([...selector.serviceCenterCodeList]);
        break;
      case "SERVICE_ADVISOR_NAME":
        setDataForDropDown([...NAME_LIST]);
        break;
      case "DRIVER_NAME":
        setDataForDropDown([...selector.drivers]);
        break;
      case "CANCEL_REASON":
        setDataForDropDown([...REASON_LIST]);
        break;
      default:
        setDataForDropDown([]);
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const onDropDownClear = (key) => {
    if (key) {
      dispatch(setDropDownData({ key: key, value: "", id: "" }));
    }
  };

  const showDatePickerModelMethod = (key, mode = "date") => {
    Keyboard.dismiss();
    setDatePickerMode(mode);
    dispatch(setDatePicker(key));
  };

  const listTitle = () => {
    return (
      <View style={[styles.itemContainer, { borderTopWidth: 0 }]}>
        <View style={styles.radioView} />
        <Text style={styles.titleTimeText}>Time</Text>
        <Text style={styles.titleSlotBookText}>Slots Booked</Text>
      </View>
    );
  };

  const noData = () => {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No Slots Found !</Text>
      </View>
    );
  };

  const onClickTimeSlot = (item, index) => {
    setSelectedIndex(index);
    dispatch(setDropDownData({ key: "TIME_SLOT_ID", value: item.slotId }));
    let payload = {
      address: "",
      customerId:
        customerInfoSelector?.customerDetailsResponse?.customerDetail?.id,
      distance: 0,
      serviceAppointmentId: 0,
      endTimeSlot: `${convertDateForPayload(
        selector.serviceReqDate
      )} ${getSelectedTimeSlotDetail("toTime", index)}`,
      startTimeSlot: `${convertDateForPayload(
        selector.serviceReqDate
      )} ${getSelectedTimeSlotDetail("fromTime", index)}`,
      typeOfService: selector.bookingFacility,
    };

    dispatch(getDrivers(payload));
  };

  const onClickBookedTimeSlot = (item, index) => {
    const { vehicleDetail } = customerInfoSelector?.customerDetailsResponse;
    let payload = {
      tenantId: userData.branchId,
      vehicleRegNumber: 9080989080,
      slotId: item.slotId,
      // vehicleRegNumber: vehicleDetail.vehicleRegNumber,
    };
    setBookedSlotsModal(true);
    dispatch(getBookedSlotsList(payload));
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onClickTimeSlot(item, index)}
        key={index}
        style={styles.itemContainer}
        disabled={!isEditEnabled()}
      >
        <Fontisto
          name={
            selectedIndex == index ? "radio-btn-active" : "radio-btn-passive"
          }
          size={12}
          color={isEditEnabled() ? Colors.RED : Colors.LIGHT_GRAY2}
          style={{ marginEnd: 10 }}
        />
        <Text
          style={[
            styles.timeText,
            isEditEnabled() ? { color: Colors.BLACK } : styles.disableValueText,
          ]}
        >
          {item.fromTime} - {item.toTime}
        </Text>
        <TouchableOpacity
          disabled={item.booked <= 0 || !isEditEnabled()}
          onPress={() => onClickBookedTimeSlot(item, index)}
        >
          <Text
            style={[
              styles.slotBookText,
              item.booked <= 0 ? { textDecorationLine: "none" } : "",
            ]}
          >
            {item.booked}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const getSelectedTimeSlotDetail = (type = "", index = selectedIndex) => {
    if (selector.bookingTimeSlotsList.length > 0 && index != null) {
      if (type == "slotTime") {
        let data = selector.bookingTimeSlotsList[index];
        return `${data.fromTime} - ${data.toTime}`;
      }
      if (type == "fromTime") {
        let data = selector.bookingTimeSlotsList[index];
        return data.fromTime;
      }
      if (type == "toTime") {
        let data = selector.bookingTimeSlotsList[index];
        return data.toTime;
      }
    }
    return "";
  };

  const checkboxSelected = () => {
    if (sameAddress == "checked") {
      setSameAddress("unchecked");
    } else {
      setSameAddress("checked");
      dispatch(setInputInfo({ key: "SAME_ADDRESS" }));
    }
  };

  const convertDateForPayload = (value) => {
    if (value) {
      return moment(value, "YYYY/MM/DD").format("YYYY-MM-DD");
    }
    return value;
  };

  const convertTimeToIsoString = (date, time) => {
    if (date && time) {
      return new Date(`${date} ${time}`).toISOString();
    }
    return "";
  };

  const getPayloadId = (type, value) => {
    if (value) {
      if (type == "serviceType") {
        let index = selector.serviceTypeResponse.findIndex(
          (item) => item.name == value
        );
        return selector.serviceTypeResponse[index]?.id;
      }
      if (type == "subServiceType") {
        let index = selector.subServiceTypeResponse.findIndex(
          (item) => item.name == value
        );
        return selector.subServiceTypeResponse[index]?.id;
      }
      if (type == "driver") {
        let index = selector.drivers.findIndex((item) => item.name == value);
        return selector.drivers[index]?.id;
      }
      if (type == "cities") {
        let index = selector.cities.findIndex((item) => item.name == value);
        return selector.cities[index]?.id;
      }
    }
    return "";
  };

  const stringToNumber = (value) => {
    if (value) {
      return Number(value);
    } else {
      return 0;
    }
  };

  const proceedToCancel = () => {
    if (!selector.cancelReason) {
      showToast("Please Select Cancel Reason");
      return;
    }

    let payload = {
      id: existingBookingData.responseId,
      tenantId: userData.branchId,
      reason: selector.cancelReason,
      remark: selector.cancelRemarks,
    };
    dispatch(cancelCustomerBooking(payload));
  };

  const saveBooking = (submitType = "create") => {
    setIsSubmitPress(true);

    if (!selector.location) {
      showToast("Please Select Location");
      return;
    }
    if (!selector.serviceCenterCode) {
      showToast("Please Select Center Code");
      return;
    }
    if (!selector.serviceType) {
      showToast("Please Select Service Type");
      return;
    }
    if (!selector.subServiceType) {
      showToast("Please Select Sub Service Type");
      return;
    }
    if (!selector.serviceReqDate) {
      showToast("Please Select Service Request Date");
      return;
    }
    if (!selector.selectedTimeSlot) {
      showToast("Please Select Time Slot");
      return;
    }
    if (!selector.bookingFacility) {
      showToast("Please Select Booking Facility's");
      return;
    }

    let pickupRequired = false;
    let dropRequired = false;
    let doorStepService = false;
    let selfDrive = false;

    if (selector.bookingFacility == "Pick & Drop") {
      pickupRequired = true;
      dropRequired = true;
    } else if (selector.bookingFacility == "Only Pick") {
      pickupRequired = true;
    } else if (selector.bookingFacility == "Door Step Service") {
      doorStepService = true;
    } else if (selector.bookingFacility == "Self Drive") {
      selfDrive = true;
    }

    const { vehicleDetail, customerDetail } =
      customerInfoSelector.customerDetailsResponse;

    let data = {
      city: selector.location,
      doorStepService: doorStepService,
      selfDrive: selfDrive,
      dropRequired: dropRequired,
      pickupRequired: pickupRequired,
      serviceCenterCode: selector.serviceCenterCode,
      serviceRequestDate: convertDateForPayload(selector.serviceReqDate),
      timeSlotId: selector.selectedTimeSlot,
      advisorName: selector.serviceAdvisorName,
      sourceOfRequest: "",
      requestedTime: convertTimeToIsoString(
        selector.serviceReqDate,
        getSelectedTimeSlotDetail("fromTime")
      ),
      serviceCategoryId: getPayloadId("serviceType", selector.serviceType),
      subServiceId: getPayloadId("subServiceType", selector.subServiceType),
      vehicleDetails: {
        vehicleRegNumber: 9080989080,
        // vehicleRegNumber: vehicleDetail.vehicleRegNumber,
        vin: vehicleDetail.vin,
        chassisNumber: vehicleDetail.chassisNumber,
        vehicleModel: vehicleDetail.vehicleModel,
        vehicleVariant: vehicleDetail.variant,
        kmReading: stringToNumber(vehicleDetail.currentKmReading),
        purchaseDate: vehicleDetail.purchaseDate,
        fuelType: vehicleDetail.fuelType,
        engineNumber: vehicleDetail.engineNumber,
        variant: vehicleDetail.variant,
        color: vehicleDetail.color,
        sellingLocation: vehicleDetail.sellingLocation,
        sellingDealer: vehicleDetail.sellingDealer,
      },
      customerRequest: {
        firstName: customerDetail.firstName,
        lastName: customerDetail.lastName,
        leadSource: customerDetail.leadSource,
        parentLeadSource: customerDetail.parentLeadSource,
        contactNumber: customerDetail.contactNumber,
        email: customerDetail.email,
        addresses: customerDetail.address,
        gender: customerDetail.gender,
        customerType: customerDetail.customerType,
        occupation: customerDetail.occupation,
        dateOfBirth: customerDetail.dateOfBirth,
      },
    };

    if (pickupRequired || dropRequired) {
      if (!selector.driverName) {
        showToast("Please Select Driver");
        return;
      }
      data.driverId = getPayloadId("driver", selector.driverName);
    }

    if (pickupRequired) {
      if (!selector.driverName) {
        showToast("Please Select Driver Name");
        return;
      }

      if (
        !selector.pickAddress ||
        !selector.pickCity ||
        !selector.pickState ||
        !selector.pickPinCode ||
        !selector.pickUpTime
      ) {
        showToast("Please Select Pick-up Address Details");
        return;
      }

      data.pickupTime = convertTimeToIsoString(
        selector.serviceReqDate,
        selector.pickUpTime
      );
      data.pickupAddress = {
        address: selector.pickAddress,
        addressLabelIfOther: "",
        city: selector.pickCity,
        label: "HOME",
        latitude: 0,
        longitude: 0,
        pin: selector.pickPinCode,
        state: selector.pickState,
      };
    }
    if (dropRequired) {
      if (
        !selector.dropAddress ||
        !selector.dropCity ||
        !selector.dropState ||
        !selector.dropPinCode ||
        !selector.dropUpTime
      ) {
        showToast("Please Select Drop Address Details");
        return;
      }

      data.dropTime = convertTimeToIsoString(
        selector.serviceReqDate,
        selector.dropUpTime
      );
      data.dropAddress = {
        address: selector.dropAddress,
        addressLabelIfOther: "",
        city: selector.dropCity,
        label: "HOME",
        latitude: 0,
        longitude: 0,
        pin: selector.dropPinCode,
        state: selector.dropState,
      };
    }

    let payload = {
      tenantId: userData.branchId,
      bookingData: data,
    };
    if (submitType == "reschedule") {
      payload.id = existingBookingData.responseId;
      dispatch(rescheduleCustomerBooking(payload));
    } else {
      dispatch(createCustomerBooking(payload));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              }
              if (dropDownKey == "LOCATION") {
                isInitial = false;
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
              let formatDate = "";
              if (selectedDate) {
                // if (selector.datePickerKeyId == "SERVICE_REQ_DATE") {
                //   let payload = {
                //     tenantId: userData.branchId,
                //     date: moment(selectedDate).format("YYYY-MM-DD"),
                //   };
                //   setSelectedIndex(null);
                //   dispatch(getTimeSlots(payload));
                // }

                if (datePickerMode === "date") {
                  formatDate = convertTimeStampToDateString(
                    selectedDate,
                    "YYYY/MM/DD"
                  );
                } else {
                  if (Platform.OS === "ios") {
                    formatDate = convertToTime(selectedDate);
                  } else {
                    formatDate = convertToTime(selectedDate);
                  }
                }
              }

              if (Platform.OS === "android") {
                if (selectedDate) {
                  dispatch(
                    updateSelectedDate({
                      key: selector.datePickerKey,
                      text: formatDate,
                    })
                  );
                }
              } else {
                dispatch(
                  updateSelectedDate({
                    key: selector.datePickerKey,
                    text: formatDate,
                  })
                );
              }
            }}
            onRequestClose={() => dispatch(setDatePicker())}
          />

          <DropDownServices
            label={"Location*"}
            value={selector.location}
            onPress={() =>
              showDropDownModelMethod("LOCATION", "Select Location")
            }
            disabled={!isEditEnabled()}
            clearOption={true}
            clearKey={"LOCATION"}
            onClear={onDropDownClear}
            error={isSubmitPress && selector.location === ""}
          />
          <DropDownServices
            label={"Service Center Code"}
            value={selector.serviceCenterCode}
            onPress={() =>
              showDropDownModelMethod(
                "SERVICE_CENTER_CODE",
                "Select Service Center Code"
              )
            }
            disabled={!isEditEnabled()}
            clearOption={true}
            clearKey={"SERVICE_CENTER_CODE"}
            onClear={onDropDownClear}
            error={isSubmitPress && selector.serviceCenterCode === ""}
          />
          <DropDownServices
            label={"Service Advisor Name"}
            value={selector.serviceAdvisorName}
            onPress={() =>
              showDropDownModelMethod(
                "SERVICE_ADVISOR_NAME",
                "Select Service Advisor Name"
              )
            }
            disabled={!isEditEnabled()}
            clearOption={true}
            clearKey={"SERVICE_ADVISOR_NAME"}
            onClear={onDropDownClear}
            error={isSubmitPress && selector.serviceAdvisorName === ""}
          />
          <DropDownServices
            label={"Service Type*"}
            placeHolder={"Select Service Type"}
            value={selector.serviceType}
            onPress={() =>
              showDropDownModelMethod("SERVICE_TYPE", "Select Service Type")
            }
            disabled={!isEditEnabled()}
            clearOption={true}
            clearKey={"SERVICE_TYPE"}
            onClear={onDropDownClear}
            error={isSubmitPress && selector.serviceType === ""}
          />
          <DropDownServices
            label={"Sub Service Type*"}
            placeHolder={"Select Sub Service Type"}
            value={selector.subServiceType}
            onPress={() =>
              showDropDownModelMethod(
                "SUB_SERVICE_TYPE",
                "Select Sub Service Type"
              )
            }
            disabled={!isEditEnabled()}
            clearOption={true}
            clearKey={"SUB_SERVICE_TYPE"}
            onClear={onDropDownClear}
            error={isSubmitPress && selector.subServiceType === ""}
          />
          <DateSelectServices
            label={"Service Request Date*"}
            placeHolder={"Select Service Request Date"}
            value={selector.serviceReqDate}
            onPress={() => showDatePickerModelMethod("SERVICE_REQ_DATE")}
            error={isSubmitPress && selector.serviceReqDate === ""}
            disabled={!isEditEnabled()}
          />
          {selector.bookingTimeSlotsList.length > 0 ? (
            <>
              <Text style={styles.label}>Time Slot*</Text>
              <Pressable
                style={[
                  styles.valueContainer,
                  isSubmitPress && selectedIndex == null
                    ? styles.errorContainer
                    : "",
                ]}
                disabled={!isEditEnabled()}
                onPress={() => setTimeSlotListVisible(!timeSlotListVisible)}
              >
                <Text
                  style={[
                    styles.valueText,
                    getSelectedTimeSlotDetail("slotTime")
                      ? { color: Colors.BLACK }
                      : "",
                  ]}
                >{`${
                  selectedIndex != null
                    ? getSelectedTimeSlotDetail("slotTime")
                    : "Select Time Slot"
                }`}</Text>
                <IconButton
                  icon="menu-down"
                  size={25}
                  style={{
                    marginHorizontal: 0,
                    borderRadius: 0,
                  }}
                />
              </Pressable>
              {timeSlotListVisible && (
                <View style={{ backgroundColor: Colors.BRIGHT_GRAY }}>
                  <FlatList
                    data={selector.bookingTimeSlotsList}
                    ListEmptyComponent={noData}
                    renderItem={renderItem}
                    ListHeaderComponent={listTitle}
                    contentContainerStyle={{
                      paddingHorizontal: 10,
                      paddingBottom: 10,
                    }}
                  />
                </View>
              )}
            </>
          ) : null}

          <DropDownServices
            label={"Booking Facility's"}
            value={selector.bookingFacility}
            onPress={() =>
              showDropDownModelMethod(
                "BOOKING_FACILITIES",
                "Select Booking Facility's"
              )
            }
            disabled={!isEditEnabled()}
            clearOption={true}
            clearKey={"BOOKING_FACILITIES"}
            onClear={onDropDownClear}
            error={isSubmitPress && selector.bookingFacility === ""}
          />

          {selector.bookingFacility == "Door Step Service" && (
            <>
              <TextInputServices
                value={selector.doorKm}
                label={"Km"}
                autoCapitalize="words"
                keyboardType={"number-pad"}
                onChangeText={(text) =>
                  dispatch(
                    setInputInfo({
                      key: "DOOR_KM",
                      text: text,
                    })
                  )
                }
                error={isSubmitPress && selector.doorKm.trim() === ""}
              />
              <TextInputServices
                value={selector.doorAddress}
                label={"Address"}
                autoCapitalize="words"
                maxLength={50}
                keyboardType={"default"}
                onChangeText={(text) =>
                  dispatch(
                    setInputInfo({
                      key: "DOOR_ADDRESS",
                      text: text,
                    })
                  )
                }
                error={isSubmitPress && selector.doorAddress.trim() === ""}
              />
            </>
          )}

          {(selector.bookingFacility == "Pick & Drop" ||
            selector.bookingFacility == "Only Pick") && (
            <>
              <DropDownServices
                label={"Driver Name"}
                value={selector.driverName}
                onPress={() =>
                  showDropDownModelMethod("DRIVER_NAME", "Select Driver Name")
                }
                disabled={!isEditEnabled()}
                clearOption={true}
                clearKey={"DRIVER_NAME"}
                onClear={onDropDownClear}
                error={isSubmitPress && selector.driverName === ""}
              />

              <Text style={styles.pickUpTitleText}>Pick-up Address</Text>
              <View style={styles.addressMainContainer}>
                <TextInputServices
                  value={selector.pickAddress}
                  label={"Address"}
                  autoCapitalize="words"
                  maxLength={50}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    dispatch(
                      setInputInfo({
                        key: "PICK_ADDRESS",
                        text: text,
                      })
                    )
                  }
                  error={isSubmitPress && selector.pickAddress.trim() === ""}
                  editable={isEditEnabled()}
                />

                <View style={styles.inputRow}>
                  <TextInputServices
                    value={selector.pickCity}
                    label={"City"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setInputInfo({
                          key: "PICK_CITY",
                          text: text,
                        })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.pickCity.trim() === ""}
                    editable={isEditEnabled()}
                  />
                  <TextInputServices
                    value={selector.pickState}
                    label={"State"}
                    autoCapitalize="words"
                    maxLength={50}
                    keyboardType={"default"}
                    onChangeText={(text) =>
                      dispatch(
                        setInputInfo({
                          key: "PICK_STATE",
                          text: text,
                        })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.pickState.trim() === ""}
                    editable={isEditEnabled()}
                  />
                </View>
                <View style={styles.inputRow}>
                  <TextInputServices
                    value={selector.pickPinCode}
                    label={"Pincode"}
                    autoCapitalize="words"
                    maxLength={6}
                    keyboardType={"number-pad"}
                    onChangeText={(text) =>
                      dispatch(
                        setInputInfo({
                          key: "PICK_PINCODE",
                          text: text,
                        })
                      )
                    }
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.pickPinCode.trim() === ""}
                    editable={isEditEnabled()}
                  />
                  <DateSelectServices
                    label={"Pickup Time"}
                    value={selector.pickUpTime}
                    onPress={() =>
                      showDatePickerModelMethod("PICKUP_TIME", "time")
                    }
                    containerStyle={styles.rowInputBox}
                    error={isSubmitPress && selector.pickUpTime === ""}
                    disabled={!isEditEnabled()}
                  />
                </View>
              </View>

              {selector.bookingFacility == "Pick & Drop" && (
                <>
                  <View style={styles.dropRow}>
                    <Checkbox.Android
                      onPress={() => checkboxSelected()}
                      status={sameAddress}
                      color={Colors.PINK}
                      uncheckedColor={Colors.PINK}
                      disabled={!isEditEnabled()}
                    />
                    <Text style={styles.pickUpTitleText}>Drop Address</Text>
                  </View>
                  <View style={styles.addressMainContainer}>
                    <TextInputServices
                      value={selector.dropAddress}
                      label={"Address"}
                      autoCapitalize="words"
                      maxLength={50}
                      keyboardType={"default"}
                      onChangeText={(text) =>
                        dispatch(
                          setInputInfo({
                            key: "DROP_ADDRESS",
                            text: text,
                          })
                        )
                      }
                      error={
                        isSubmitPress && selector.dropAddress.trim() === ""
                      }
                      editable={isEditEnabled()}
                    />

                    <View style={styles.inputRow}>
                      <TextInputServices
                        value={selector.dropCity}
                        label={"City"}
                        autoCapitalize="words"
                        maxLength={50}
                        keyboardType={"default"}
                        onChangeText={(text) =>
                          dispatch(
                            setInputInfo({
                              key: "DROP_CITY",
                              text: text,
                            })
                          )
                        }
                        containerStyle={styles.rowInputBox}
                        error={isSubmitPress && selector.dropCity.trim() === ""}
                        editable={isEditEnabled()}
                      />
                      <TextInputServices
                        value={selector.dropState}
                        label={"State"}
                        autoCapitalize="words"
                        maxLength={50}
                        keyboardType={"default"}
                        onChangeText={(text) =>
                          dispatch(
                            setInputInfo({
                              key: "DROP_STATE",
                              text: text,
                            })
                          )
                        }
                        containerStyle={styles.rowInputBox}
                        error={
                          isSubmitPress && selector.dropState.trim() === ""
                        }
                        editable={isEditEnabled()}
                      />
                    </View>
                    <View style={styles.inputRow}>
                      <TextInputServices
                        value={selector.dropPinCode}
                        label={"Pincode"}
                        autoCapitalize="words"
                        maxLength={6}
                        keyboardType={"number-pad"}
                        onChangeText={(text) =>
                          dispatch(
                            setInputInfo({
                              key: "DROP_PINCODE",
                              text: text,
                            })
                          )
                        }
                        containerStyle={styles.rowInputBox}
                        error={
                          isSubmitPress && selector.dropPinCode.trim() === ""
                        }
                        editable={isEditEnabled()}
                      />
                      <DateSelectServices
                        label={"Dropup Time"}
                        value={selector.dropUpTime}
                        onPress={() =>
                          showDatePickerModelMethod("DROPUP_TIME", "time")
                        }
                        containerStyle={styles.rowInputBox}
                        error={isSubmitPress && selector.dropUpTime === ""}
                        disabled={!isEditEnabled()}
                      />
                    </View>
                  </View>
                </>
              )}
            </>
          )}

          {isCancel && (
            <View>
              <DropDownServices
                label={"Cancel Reason*"}
                placeHolder={"Cancel Reason"}
                value={selector.cancelReason}
                onPress={() =>
                  showDropDownModelMethod(
                    "CANCEL_REASON",
                    "Select Cancel Reason"
                  )
                }
                disabled={!isEditEnabled("cancel")}
                clearOption={true}
                clearKey={"CANCEL_REASON"}
                onClear={onDropDownClear}
                error={isSubmitPress && selector.cancelReason === ""}
              />
              <TextInputServices
                value={selector.cancelRemarks}
                label={"Remarks"}
                autoCapitalize="words"
                onChangeText={(text) =>
                  dispatch(
                    setInputInfo({
                      key: "CANCEL_REMARKS",
                      text: text,
                    })
                  )
                }
                editable={isEditEnabled("cancel")}
              />
            </View>
          )}

          {fromType && fromType == "createBooking" && (
            <View style={styles.buttonListRow}>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.btnText}>BACK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => saveBooking("create")}
              >
                <Text style={styles.btnText}>CREATE</Text>
              </TouchableOpacity>
            </View>
          )}

          {fromType &&
            fromType == "editBooking" &&
            !isCancel &&
            existingBookingData?.serviceAppointmentStatus == "BOOKED" && (
              <View style={styles.buttonListRow}>
                <TouchableOpacity
                  style={styles.btnContainer}
                  onPress={() => setIsCancel(true)}
                >
                  <Text style={styles.btnText}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnContainer}
                  onPress={() => saveBooking("reschedule")}
                >
                  <Text style={styles.btnText}>RESCHEDULE</Text>
                </TouchableOpacity>
              </View>
            )}

          {isCancel && (
            <View style={styles.buttonListRow}>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => setIsCancel(false)}
              >
                <Text style={styles.btnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => proceedToCancel()}
              >
                <Text style={styles.btnText}>Proceed To Cancellation</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <BookedSlotsListModel
        bookedSlotsModal={bookedSlotsModal}
        onRequestClose={() => setBookedSlotsModal(false)}
        slotList={selector.bookedSlotsList}
      />
      <LoaderComponent visible={selector.isLoading} />
    </SafeAreaView>
  );
};

export default CreateCustomerBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.WHITE,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.GRAY,
    marginBottom: 5,
  },
  valueContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.BRIGHT_GRAY,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 45,
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: "red",
  },
  valueText: {
    flex: 1,
    color: Colors.LIGHT_GRAY2,
  },

  radioView: {
    height: 12,
    width: 12,
    marginRight: 10,
  },
  titleTimeText: {
    fontWeight: "600",
    width: "55%",
  },
  titleSlotBookText: {
    fontWeight: "600",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_COLOR,
    padding: 5,
    paddingVertical: 10,
  },
  timeText: {
    width: "70%",
  },
  slotBookText: {
    color: Colors.GRAY,
    textDecorationLine: "underline",
  },

  noDataContainer: {},
  noDataText: {
    marginVertical: 25,
    fontSize: 18,
    color: Colors.BLACK,
    alignSelf: "center",
    fontWeight: "bold",
  },
  inputRow: { flexDirection: "row", justifyContent: "space-between" },
  rowInputBox: { width: "48%" },

  addressMainContainer: {
    borderWidth: 0.5,
    borderColor: Colors.LIGHT_GRAY2,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  pickUpTitleText: {
    marginVertical: 5,
    fontWeight: "600",
    fontSize: 14,
  },
  dropRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  buttonListRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
  },
  btnContainer: {
    width: "40%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: Colors.PINK,
    height: 45
  },
  btnText: {
    color: Colors.WHITE,
    fontSize: 13,
    fontWeight: "bold",
  },
  disableValueText: {
    color: Colors.LIGHT_GRAY2,
  },
});