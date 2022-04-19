import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
  ImagePickerComponent,
} from "../../../components";
import {
  clearState,
  updateSelectedDate,
  getTestDriveDseEmployeeListApi,
  getDriversListApi,
  getTestDriveVehicleListApi,
  bookTestDriveAppointmentApi,
  updateTestDriveTaskApi,
  getTaskDetailsApi,
  getTestDriveAppointmentDetailsApi,
  validateTestDriveApi,
} from "../../../redux/testDriveReducer";
import {
  DateSelectItem,
  RadioTextItem,
  ImageSelectItem,
  DropDownSelectionItem,
} from "../../../pureComponents";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { Button, IconButton, RadioButton } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import { convertToDate, convertToTime } from "../../../utils/helperFunctions";
import {
  showToast,
  showToastRedAlert,
  showAlertMessage,
} from "../../../utils/toast";
import URL from "../../../networking/endpoints";
import moment from "moment";

const LocalButtonComp = ({
  title,
  onPress,
  disabled,
  bgColor = Colors.RED,
}) => {
  return (
    <Button
      style={{ width: 120 }}
      mode="contained"
      color={bgColor}
      disabled={disabled}
      labelStyle={{ textTransform: "none" }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};

const TestDriveScreen = ({ route, navigation }) => {
  const { taskId, identifier, universalId, taskData } = route.params;
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.testDriveReducer);
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [userData, setUserData] = useState({
    orgId: "",
    employeeId: "",
    employeeName: "",
  });
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [showDatePickerModel, setShowDatePickerModel] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState("");
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerKey, setImagePickerKey] = useState("");
  const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
  const [isRecordEditable, setIsRecordEditable] = useState(true);
  const [expectedStartAndEndTime, setExpectedStartAndEndTime] = useState({
    start: "",
    end: "",
  });
  const [taskStatusAndName, setTaskStatusAndName] = useState({
    status: "",
    name: "",
  });
  const [addressType, setAddressType] = useState(0); // 0: nothing, 1: showroom, 2: customer
  const [customerHavingDrivingLicense, setCustomerHavingDrivingLicense] =
    useState(0); // 0: nothing, 1: yes, 2: no
  const [handleActionButtons, setHandleActionButtons] = useState(0); // 0 : nothing, 1: submit, 2: cancel
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState({
    model: "",
    varient: "",
    fuelType: "",
    transType: "",
    vehicleId: 0,
    varientId: 0,
  });
  const [mobie, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedDseDetails, setSelectedDseDetails] = useState({
    name: "",
    id: "",
  });
  const [selectedDriverDetails, setSelectedDriverDetails] = useState({
    name: "",
    id: "",
  });
  const [customerAddress, setCustomerAddress] = useState("");
  const [varientListForDropDown, setVarientListForDropDown] = useState([]);

  useEffect(() => {
    updateBasicDetails(taskData);
    getAsyncstoreData();
  }, []);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      const roles = jsonObj.roles || [];
      if (
        roles.includes("Testdrive_DSE") ||
        roles.includes("Testdrive_Manager")
      ) {
        setUserData({
          orgId: jsonObj.orgId,
          employeeId: jsonObj.empId,
          employeeName: jsonObj.empName,
        });

        // Get Branch Id
        AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID).then(
          (branchId) => {
            setSelectedBranchId(branchId);
            const payload = {
              barnchId: branchId,
              orgId: jsonObj.orgId,
            };

            Promise.all([
              dispatch(getTaskDetailsApi(taskId)),
              dispatch(getTestDriveVehicleListApi(payload)),
              dispatch(getTestDriveDseEmployeeListApi(jsonObj.orgId)),
              dispatch(getDriversListApi(jsonObj.orgId)),
            ]).then(() => {
              console.log("all done");
            });
          }
        );
      } else {
        showToast("You don't have access to view this task");
        dispatch(clearState());
        navigation.goBack();
      }
    }
  };

  const updateBasicDetails = (taskData) => {
    if (taskData) {
      const leadDtoObj = taskData.leadDto;
      setName(leadDtoObj.firstName + " " + leadDtoObj.lastName);
      setEmail(leadDtoObj.email || "");
      setMobile(leadDtoObj.phone || "");
      setSelectedDseDetails({
        name: taskData.assignee.empName,
        id: taskData.assignee.empId,
      });
    }
  };

  // Handle Task Details Response
  useEffect(() => {
    if (selector.task_details_response) {
      if (selector.task_details_response.entityModuleId) {
        getTestDriveAppointmentDetailsFromServer();
      } else if (
        selector.task_details_response.taskStatus === "ASSIGNED" &&
        selector.task_details_response.taskName === "Test Drive"
      ) {
        setHandleActionButtons(1);
      }
    }
  }, [selector.task_details_response]);

  const getTestDriveAppointmentDetailsFromServer = () => {
    if (selector.task_details_response.entityModuleId) {
      const payload = {
        barnchId: selectedBranchId,
        orgId: userData.orgId,
        entityModuleId: selector.task_details_response.entityModuleId,
      };
      dispatch(getTestDriveAppointmentDetailsApi(payload));
    }
  };

  useEffect(() => {
    if (selector.test_drive_appointment_details_response) {
      const taskStatus =
        selector.test_drive_appointment_details_response.status;
      const taskName = selector.task_details_response.taskName;

      if (taskStatus === "SENT_FOR_APPROVAL" && taskName === "Test Drive") {
        setHandleActionButtons(2);
      } else if (
        taskStatus === "SENT_FOR_APPROVAL" &&
        taskName === "Test Drive Approval"
      ) {
        setHandleActionButtons(3);
      } else if (taskStatus === "APPROVED" && taskName === "Test Drive") {
        setHandleActionButtons(4);
      } else if (taskStatus === "CANCELLED") {
        setHandleActionButtons(5);
      }
      setIsRecordEditable(false);
      updateTaskDetails(selector.test_drive_appointment_details_response);
    }
  }, [selector.test_drive_appointment_details_response]);

  const updateTaskDetails = (taskDetailsObj) => {
    console.log("taskDetailsObj: ", taskDetailsObj);
    if (taskDetailsObj.vehicleInfo) {
      const vehicleInfo = taskDetailsObj.vehicleInfo;

      // Pending
      updateSelectedVehicleDetails(vehicleInfo, false);
    }

    const locationType = taskDetailsObj.location ? taskDetailsObj.location : "";
    setAddressType(locationType === "customer" ? 2 : 1);
    setCustomerAddress(taskDetailsObj.address ? taskDetailsObj.address : "");

    const driverId = taskDetailsObj.driverId || "";
    let driverName = "";

    if (selector.drivers_list.length > 0 && taskDetailsObj.driverId) {
      const filterAry = selector.drivers_list.filter(
        (object) => object.id == taskDetailsObj.driverId
      );
      if (filterAry.length > 0) {
        driverName = filterAry[0].name;
      }
    }
    setSelectedDriverDetails({ name: driverName, id: driverId });

    const customerHaveingDl = taskDetailsObj.isCustomerHaveingDl
      ? taskDetailsObj.isCustomerHaveingDl
      : false;
    if (customerHaveingDl) {
      const dataObj = { ...uploadedImagesDataObj };
      if (taskDetailsObj.dlFrontUrl) {
        dataObj.dlFrontUrl = {
          documentPath: taskDetailsObj.dlFrontUrl,
          fileName: "driving license front",
        };
      }
      if (taskDetailsObj.dlBackUrl) {
        dataObj.dlBackUrl = {
          documentPath: taskDetailsObj.dlBackUrl,
          fileName: "driving license back",
        };
      }
      setUploadedImagesDataObj({ ...dataObj });
    }
    setCustomerHavingDrivingLicense(customerHaveingDl ? 1 : 2);
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
    const fileName = fileNameArry.length > 0 ? fileNameArry[0] : "None";
    formData.append("file", {
      name: `${fileName}-.${fileType}`,
      type: `image/${fileType}`,
      uri: Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri,
    });
    formData.append("universalId", universalId);
    if (keyId === "DRIVING_LICENSE_FRONT") {
      formData.append("documentType", "dlFrontUrl");
    } else if (keyId === "DRIVING_LICENSE_BACK") {
      formData.append("documentType", "dlBackUrl");
    }

    await fetch(URL.UPLOAD_DOCUMENT(), {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response", response);
        if (response) {
          const dataObj = { ...uploadedImagesDataObj };
          dataObj[response.documentType] = response;
          setUploadedImagesDataObj({ ...dataObj });
        }
      })
      .catch((error) => {
        showToastRedAlert(
          error.message ? error.message : "Something went wrong"
        );
        console.error("error", error);
      });
  };

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();

    switch (key) {
      case "MODEL":
        if (selector.test_drive_vehicle_list_for_drop_down.length == 0) {
          showToast("No Vehicles Found");
          return;
        }
        setDataForDropDown([...selector.test_drive_vehicle_list_for_drop_down]);
        break;
      case "VARIENT":
        if (varientListForDropDown.length == 0) {
          showToast("No Varients Found");
          return;
        }
        setDataForDropDown([...varientListForDropDown]);
        break;
      case "LIST_OF_DRIVERS":
        if (selector.drivers_list.length == 0) {
          showToast("No Driver List Found");
          return;
        }
        setDataForDropDown([...selector.drivers_list]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const showDatePickerModelMethod = (key, mode) => {
    Keyboard.dismiss();

    if (selectedVehicleDetails.vehicleId == 0) {
      showToast("Please select model");
      return;
    }

    setDatePickerMode(mode);
    setDatePickerKey(key);
    setShowDatePickerModel(true);
  };

  const showImagePickerMethod = (key) => {
    Keyboard.dismiss();
    setImagePickerKey(key);
    setShowImagePicker(true);
  };

  const submitClicked = (status, taskName) => {
    if (selectedVehicleDetails.model.length === 0) {
      showToast("Please select model");
      return;
    }

    if (selectedDriverDetails.name.length === 0) {
      showToast("Please select driver");
      return;
    }

    if (selector.customer_preferred_date.length === 0) {
      showToast("Please select customer preffered date");
      return;
    }

    if (addressType === 0) {
      showToast("Please select address type");
      return;
    }

    if (customerHavingDrivingLicense === 0) {
      showToast("Please select customer having driving license");
      return;
    }

    if (
      selector.customer_preferred_time.length === 0 ||
      selector.actual_start_time.length === 0 ||
      selector.actual_end_time.length === 0
    ) {
      showToast("Please select time");
      return;
    }

    if (
      selectedVehicleDetails.vehicleId == 0 ||
      selectedVehicleDetails.varientId == 0
    ) {
      showToast("Please select model & varient");
      return;
    }

    let varientId = selectedVehicleDetails.vehicleId;
    let vehicleId = selectedVehicleDetails.varientId;
    // selector.test_drive_vehicle_list.forEach(element => {
    //   if (element.vehicleInfo.vehicleId == selectedVehicleDetails.vehicleId && element.vehicleInfo.varientId == selectedVehicleDetails.varientId) {
    //     varientId = element.vehicleInfo.varientId;
    //     vehicleId = selectedVehicleDetails.vehicleId;
    //   }
    // });
    if (!varientId || !vehicleId) return;

    const location = addressType === 1 ? "showroom" : "customer";

    if (customerHavingDrivingLicense === 1) {
      if (
        !uploadedImagesDataObj.dlFrontUrl ||
        !uploadedImagesDataObj.dlBackUrl
      ) {
        showToast("Please upload driving license front & back");
        return;
      }
    }
    const date = moment(selector.customer_preferred_date, "DD/MM/YYYY").format(
      "DD-MM-YYYY"
    );
    let prefferedTime = "";
    let actualStartTime = "";
    let actualEndTime = "";

    if (Platform.OS === "ios") {
      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm"
      ).format("HH:mm:ss");
      const startTime = moment(selector.actual_start_time, "HH:mm").format(
        "HH:mm:ss"
      );
      const endTime = moment(selector.actual_end_time, "HH:mm").format(
        "HH:mm:ss"
      );
      prefferedTime = date + " " + preffTime;
      actualStartTime = date + " " + startTime;
      actualEndTime = date + " " + endTime;
    } else {
      prefferedTime = date + " " + selector.customer_preferred_time;
      actualStartTime = date + " " + selector.actual_start_time;
      actualEndTime = date + " " + selector.actual_end_time;
    }
    setExpectedStartAndEndTime({ start: actualStartTime, end: actualEndTime });
    setTaskStatusAndName({ status: status, name: taskName });

    let appointmentObj = {
      address: customerAddress,
      branchId: selectedBranchId,
      customerHaveingDl: customerHavingDrivingLicense === 1 ? true : false,
      customerId: universalId,
      dseId: selectedDseDetails.id,
      location: location,
      orgId: userData.orgId,
      source: "ShowroomWalkin",
      startTime: actualStartTime,
      endTime: actualEndTime,
      testDriveDatetime: prefferedTime,
      testdriveId: 0,
      status: status,
      varientId: varientId,
      vehicleId: vehicleId,
      driverId: selectedDriverDetails.id.toString(),
      dlBackUrl: "",
      dlFrontUrl: "",
    };

    if (customerHavingDrivingLicense === 1) {
      appointmentObj.dlBackUrl = uploadedImagesDataObj.dlBackUrl.documentPath;
      appointmentObj.dlFrontUrl = uploadedImagesDataObj.dlFrontUrl.documentPath;
    }

    const payload = {
      appointment: appointmentObj,
    };
    dispatch(bookTestDriveAppointmentApi(payload));
  };

  // Handle Book Test drive appointment response
  useEffect(() => {
    if (selector.book_test_drive_appointment_response) {
      // yyyy-MM-dd'T'HH:mm:ssXXX YYYY-MM-DDThh:mm:ssTZD
      const startTime = moment(
        expectedStartAndEndTime.start,
        "DD-MM-YYYY HH:mm:ss"
      ).toISOString();
      const endTime = moment(
        expectedStartAndEndTime.end,
        "DD-MM-YYYY HH:mm:ss"
      ).toISOString();

      const payload = {
        universalId: universalId,
        taskId: null,
        remarks: "Success",
        universalModuleId:
          selector.book_test_drive_appointment_response.confirmationId,
        status: taskStatusAndName.status,
        taskName: taskStatusAndName.name,
        expectedStarttime: startTime,
        expectedEndTime: endTime,
      };
      dispatch(updateTestDriveTaskApi(payload));
    }
  }, [selector.book_test_drive_appointment_response]);

  // Handle Update Test Drive Task response
  useEffect(() => {
    if (selector.test_drive_update_task_response === "success") {
      showAlertMsg(true);
    } else if (selector.test_drive_update_task_response === "failed") {
      showAlertMsg(false);
    }
  }, [selector.test_drive_update_task_response]);

  const showAlertMsg = (isSucess) => {
    let message = isSucess
      ? "TestDrive Appointment has succeeded"
      : "TestDrive Appointment has failed";
    Alert.alert(
      "",
      message,
      [
        {
          text: "OK",
          onPress: () => {
            dispatch(clearState());
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const validateSelectedDateForTestDrive = async (selectedDate) => {
    const date = convertToDate(selectedDate, "DD/MM/YYYY");
    const payload = {
      date: date,
      vehicleId: selectedVehicleDetails.vehicleId,
    };
    dispatch(validateTestDriveApi(payload));
  };

  // Handle Test drive date validation response
  useEffect(() => {
    if (selector.test_drive_date_validate_response) {
      if (selector.test_drive_date_validate_response.status === "SUCCESS") {
        showToast(selector.test_drive_date_validate_response.statusDescription);
      } else {
        //this.setState({ mtDate: new Date() })
      }
    }
  }, [selector.test_drive_date_validate_response]);

  const updateSelectedVehicleDetails = (vehicleInfo, fromVarient) => {
    //Update Varient List
    if (selector.test_drive_varients_obj_for_drop_down[vehicleInfo.model]) {
      const varientsData =
        selector.test_drive_varients_obj_for_drop_down[vehicleInfo.model];
      setVarientListForDropDown(varientsData);
    }
    setSelectedVehicleDetails({
      model: vehicleInfo.model,
      varient: fromVarient ? vehicleInfo.varientName : "",
      fuelType: fromVarient ? vehicleInfo.fuelType : "",
      transType: fromVarient ? vehicleInfo.transmission_type : "",
      vehicleId: vehicleInfo.vehicleId,
      varientId: fromVarient ? vehicleInfo.varientId : 0,
    });
  };

  const deteleButtonPressed = (from) => {
    const imagesDataObj = { ...uploadedImagesDataObj };
    switch (from) {
      case "DlFRONTURL":
        delete imagesDataObj.dlFrontUrl;
        break;
      case "DLBACKURL":
        delete imagesDataObj.dlBackUrl;
        break;
      default:
        break;
    }
    setUploadedImagesDataObj({ ...imagesDataObj });
  };

  const DisplaySelectedImage = ({ fileName, from }) => {
    return (
      <View style={styles.selectedImageBckVw}>
        <Text style={styles.selectedImageTextStyle}>{fileName}</Text>
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

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
      <ImagePickerComponent
        visible={showImagePicker}
        keyId={imagePickerKey}
        selectedImage={(data, keyId) => {
          console.log("imageObj: ", data, keyId);
          uploadSelectedImage(data, keyId);
          setShowImagePicker(false);
        }}
        onDismiss={() => setShowImagePicker(false)}
      />

      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (dropDownKey === "MODEL") {
            updateSelectedVehicleDetails(item, false);
          }
          if (dropDownKey === "VARIENT") {
            updateSelectedVehicleDetails(item, true);
          }
          if (dropDownKey === "LIST_OF_DRIVERS") {
            setSelectedDriverDetails({ name: item.name, id: item.id });
          }
          setShowDropDownModel(false);
        }}
      />

      <DatePickerComponent
        visible={showDatePickerModel}
        mode={datePickerMode}
        minimumDate={new Date(Date.now())}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {
          console.log("date: ", selectedDate);
          setShowDatePickerModel(false);

          let formatDate = "";
          if (selectedDate) {
            if (datePickerMode === "date") {
              formatDate = convertToDate(selectedDate);
              validateSelectedDateForTestDrive(selectedDate);
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
                updateSelectedDate({ key: datePickerKey, text: formatDate })
              );
            }
          } else {
            dispatch(
              updateSelectedDate({ key: datePickerKey, text: formatDate })
            );
          }
        }}
        onRequestClose={() => setShowDatePickerModel(false)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >
        {/* // 1. Test Drive */}
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, marginBottom: 20 }}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 }}
        >
          <View style={styles.baseVw}>
            {/* // 1.Test Drive */}
            <View
              style={[
                styles.accordianBckVw,
                GlobalStyle.shadow,
                { backgroundColor: "white" },
              ]}
            >
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={name}
                label={"Name*"}
                editable={true}
                disabled={false}
                onChangeText={(text) => setName(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={email}
                label={"Email ID*"}
                keyboardType={"email-address"}
                editable={true}
                disabled={false}
                onChangeText={(text) => setEmail(text)}
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={mobie}
                label={"Mobile Number*"}
                maxLength={10}
                keyboardType={"phone-pad"}
                editable={true}
                disabled={false}
                onChangeText={(text) => setMobile(text)}
              />
              <Text style={GlobalStyle.underline}></Text>

              <DropDownSelectionItem
                label={"Model"}
                value={selectedVehicleDetails.model}
                disabled={!isRecordEditable}
                onPress={() => showDropDownModelMethod("MODEL", "Model")}
              />

              <DropDownSelectionItem
                label={"Varient"}
                value={selectedVehicleDetails.varient}
                disabled={!isRecordEditable}
                onPress={() => showDropDownModelMethod("VARIENT", "Model")}
              />

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Fuel Type"}
                value={selectedVehicleDetails.fuelType}
                editable={false}
                disabled={true}
              />
              <Text style={GlobalStyle.underline}></Text>

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Transmission Type"}
                value={selectedVehicleDetails.transType}
                editable={false}
                disabled={true}
              />
              <Text style={GlobalStyle.underline}></Text>

              <Text style={styles.chooseAddressTextStyle}>
                {"Choose address:"}
              </Text>
              <View style={styles.view2}>
                <RadioTextItem
                  label={"Showroom address"}
                  value={"Showroom address"}
                  status={addressType === 1 ? true : false}
                  onPress={() => setAddressType(1)}
                />
                <RadioTextItem
                  label={"Customer address"}
                  value={"Customer address"}
                  status={addressType === 2 ? true : false}
                  onPress={() => setAddressType(2)}
                />
              </View>
              <Text style={GlobalStyle.underline}></Text>

              {addressType === 2 && (
                <View>
                  <TextinputComp
                    style={{ height: 65, maxHeight: 100, width: "100%" }}
                    value={customerAddress}
                    label={"Customer Address"}
                    multiline={true}
                    numberOfLines={4}
                    editable={isRecordEditable}
                    disabled={!isRecordEditable}
                    onChangeText={(text) => setCustomerAddress(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </View>
              )}

              <Text style={{ padding: 10 }}>
                {"Do Customer have Driving License?"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 12,
                  paddingBottom: 5,
                }}
              >
                <RadioTextItem
                  label={"Yes"}
                  value={"Yes"}
                  status={customerHavingDrivingLicense === 1 ? true : false}
                  onPress={() => setCustomerHavingDrivingLicense(1)}
                />
                <RadioTextItem
                  label={"No"}
                  value={"No"}
                  status={customerHavingDrivingLicense === 2 ? true : false}
                  onPress={() => setCustomerHavingDrivingLicense(2)}
                />
              </View>
              {customerHavingDrivingLicense === 1 && (
                <View>
                  <View style={styles.select_image_bck_vw}>
                    <ImageSelectItem
                      name={"Upload Driving License (Front)"}
                      onPress={() =>
                        showImagePickerMethod("DRIVING_LICENSE_FRONT")
                      }
                    />
                  </View>
                  {uploadedImagesDataObj.dlFrontUrl ? (
                    <DisplaySelectedImage
                      fileName={uploadedImagesDataObj.dlFrontUrl.fileName}
                      from={"DLFRONTURL"}
                    />
                  ) : null}
                  <View style={styles.select_image_bck_vw}>
                    <ImageSelectItem
                      name={"Upload Driving License (Back)"}
                      onPress={() =>
                        showImagePickerMethod("DRIVING_LICENSE_BACK")
                      }
                    />
                  </View>
                  {uploadedImagesDataObj.dlBackUrl ? (
                    <DisplaySelectedImage
                      fileName={uploadedImagesDataObj.dlBackUrl.fileName}
                      from={"DLBACKURL"}
                    />
                  ) : null}
                </View>
              )}

              <Text style={GlobalStyle.underline}></Text>

              <DateSelectItem
                label={"Customer Preffered Date"}
                value={selector.customer_preferred_date}
                disabled={!isRecordEditable}
                onPress={() =>
                  showDatePickerModelMethod("PREFERRED_DATE", "date")
                }
              />
              <DropDownSelectionItem
                label={"List of Employees"}
                value={selectedDseDetails.name}
                disabled={true}
              />
              <DropDownSelectionItem
                label={"List of Drivers"}
                value={selectedDriverDetails.name}
                disabled={!isRecordEditable}
                onPress={() =>
                  showDropDownModelMethod("LIST_OF_DRIVERS", "List of Drivers")
                }
              />
              <DateSelectItem
                label={"Customer Preffered Time"}
                value={selector.customer_preferred_time}
                disabled={!isRecordEditable}
                onPress={() =>
                  showDatePickerModelMethod("CUSTOMER_PREFERRED_TIME", "time")
                }
              />
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <DateSelectItem
                    label={"Actual start Time"}
                    value={selector.actual_start_time}
                    disabled={!isRecordEditable}
                    onPress={() =>
                      showDatePickerModelMethod("ACTUAL_START_TIME", "time")
                    }
                  />
                </View>
                <View style={{ width: "50%" }}>
                  <DateSelectItem
                    label={"Actual End Time"}
                    value={selector.actual_end_time}
                    disabled={!isRecordEditable}
                    onPress={() =>
                      showDatePickerModelMethod("ACTUAL_END_TIME", "time")
                    }
                  />
                </View>
              </View>

              {/* <View style={styles.space}></View> */}
              {/* <Text style={{ padding: 10 }}>{"Allotment ID"}</Text>
              <Text style={GlobalStyle.underline}></Text>
              <View style={styles.space}></View>
              <Text style={{ padding: 10 }}>{"Planned Start Date Time"} </Text>
              <Text style={GlobalStyle.underline}></Text>
              <View style={styles.space}></View>
              <Text style={{ padding: 10 }}>{"Planned End Date Time"}</Text>
              <Text style={GlobalStyle.underline}></Text> */}
            </View>
          </View>

          {handleActionButtons === 1 && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Submit"}
                disabled={selector.isLoading}
                onPress={() => submitClicked("SENT_FOR_APPROVAL", "Test Drive")}
              />
            </View>
          )}
          {handleActionButtons === 2 && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Cancel"}
                disabled={selector.isLoading}
                onPress={() => submitClicked("CANCELLED", "Test Drive")}
              />
            </View>
          )}
          {handleActionButtons === 3 && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Reject"}
                disabled={selector.isLoading}
                onPress={() =>
                  submitClicked("CANCELLED", "Test Drive Approval")
                }
              />
              <LocalButtonComp
                title={"Approve"}
                disabled={selector.isLoading}
                bgColor={Colors.GREEN}
                onPress={() => submitClicked("APPROVED", "Test Drive Approval")}
              />
            </View>
          )}
          {handleActionButtons === 4 && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Reject"}
                disabled={selector.isLoading}
                onPress={() => submitClicked("CLOSED", "Test Drive")}
              />
              <LocalButtonComp
                title={"Approve"}
                disabled={selector.isLoading}
                bgColor={Colors.GREEN}
                onPress={() => submitClicked("RESCHEDULED", "Test Drive")}
              />
            </View>
          )}
          {handleActionButtons === 5 && (
            <View style={styles.view1}>
              <Text style={styles.cancelText}>{"This task has cancelled"}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TestDriveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  accordianBckVw: {
    backgroundColor: Colors.WHITE,
  },
  space: {
    height: 10,
  },
  view1: {
    marginVertical: 30,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  chooseAddressTextStyle: {
    padding: 10,
    justifyContent: "center",
    color: Colors.GRAY,
  },
  view2: {
    flexDirection: "row",
    paddingLeft: 12,
    paddingBottom: 5,
  },
  select_image_bck_vw: {
    minHeight: 50,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  selectedImageBckVw: {
    paddingLeft: 12,
    paddingRight: 15,
    paddingBottom: 5,
    backgroundColor: Colors.WHITE,
  },
  selectedImageTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.RED,
  },
});
