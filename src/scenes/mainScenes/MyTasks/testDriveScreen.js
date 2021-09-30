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
  Alert
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
  ImagePickerComponent
} from "../../../components";
import {
  clearState,
  setTestDriveDetails,
  updateSelectedDropDownData,
  updateSelectedDate,
  setDropDownData,
  updateSelectedTestDriveVehicle,
  getTestDriveDseEmployeeListApi,
  getDriversListApi,
  getTestDriveVehicleListApi,
  updateBasicDetails,
  bookTestDriveAppointmentApi,
  updateTestDriveTaskApi,
  getTaskDetailsApi,
  getTestDriveAppointmentDetailsApi
} from "../../../redux/testDriveReducer";
import { DateSelectItem, RadioTextItem, ImageSelectItem, DropDownSelectionItem } from "../../../pureComponents";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { RadioButton } from "react-native-paper";
import { Button } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import { convertToDate, convertToTime } from "../../../utils/helperFunctions";
import { showToast, showToastRedAlert } from "../../../utils/toast";
import URL from "../../../networking/endpoints";
import moment from 'moment';

const LocalButtonComp = ({ title, onPress, disabled, bgColor = Colors.RED }) => {
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
  )
}

const TestDriveScreen = ({ route, navigation }) => {

  const { taskId, identifier, universalId, taskData } = route.params;
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.testDriveReducer);
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "" })
  const [showDatePickerModel, setShowDatePickerModel] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState("");
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerKey, setImagePickerKey] = useState("");
  const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
  const [isRecordEditable, setIsRecordEditable] = useState(true);
  const [expectedStartTime, setExpectedStartTime] = useState("");
  const [expectedEndTime, setExpectedEndTime] = useState("");
  const [taskStatusAndName, setTaskStatusAndName] = useState({ status: "", name: "" });
  const [handleActionButtons, setHandleActionButtons] = useState(0) // 0 : nothing, 1: submit, 2: cancel

  useEffect(() => {

    dispatch(updateBasicDetails(taskData))
    getAsyncstoreData();
    dispatch(getTestDriveDseEmployeeListApi());
    dispatch(getDriversListApi());
  }, []);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName })
      const payload = {
        barnchId: jsonObj.branchId,
        orgId: jsonObj.orgId
      }
      dispatch(getTestDriveVehicleListApi(payload))
      dispatch(getTaskDetailsApi(taskId));
    }
  }

  // Handle Task Details Response
  useEffect(() => {
    if (selector.task_details_response) {
      if (selector.task_details_response.entityModuleId) {
        getTestDriveAppointmentDetailsFromServer();
      }
      else if (selector.task_details_response.taskStatus === "ASSIGNED" && selector.task_details_response.taskName === "Test Drive") {
        setHandleActionButtons(1);
      }
    }
  }, [selector.task_details_response])

  getTestDriveAppointmentDetailsFromServer = () => {

    if (selector.task_details_response.entityModuleId) {
      const payload = {
        barnchId: userData.branchId,
        orgId: userData.orgId,
        entityModuleId: selector.task_details_response.entityModuleId
      }
      dispatch(getTestDriveAppointmentDetailsApi(payload));
    }
  }

  useEffect(() => {
    if (selector.test_drive_appointment_details_response) {

      const taskStatus = selector.test_drive_appointment_details_response.status;
      const taskName = selector.task_details_response.taskName;

      if ((taskStatus === "SENT_FOR_APPROVAL" || taskStatus === "APPROVED") && taskName === "Test Drive") {
        setHandleActionButtons(1);
      }
      else if (taskStatus === "SENT_FOR_APPROVAL" && taskName === "Test Drive") {
        setHandleActionButtons(2);
      }
      else if (taskStatus === "SENT_FOR_APPROVAL" && taskName === "Test Drive Approval") {
        setHandleActionButtons(3);
      }
      else if (taskStatus === "APPROVED" && taskName === "Test Drive") {
        setHandleActionButtons(4);
      }
      else if (taskStatus === "CANCELLED") {
        setHandleActionButtons(5);
      }
      updateTaskDetails(selector.test_drive_appointment_details_response);
    }
  }, [selector.test_drive_appointment_details_response])

  const updateTaskDetails = (taskDetailsObj) => {

    const vehicleInfo = taskDetailsObj.vehicleInfo;

    const obj = {
      id: vehicleInfo.vehicleId,
      model: vehicleInfo.model,
      varient: vehicleInfo.varientName,
      fuelType: vehicleInfo.fuelType,
      transmissionType: vehicleInfo.transmission_type
    }
    dispatch(updateSelectedTestDriveVehicle(obj));
  }

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
    if (keyId === "DRIVING_LICENSE_FRONT") {
      formData.append("documentType", "dlFrontUrl");
    }
    else if (keyId === "DRIVING_LICENSE_BACK") {
      formData.append("documentType", "dlBackUrl");
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
        console.log('response', response);
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

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();

    switch (key) {
      case "MODEL":
        setDataForDropDown([...selector.test_drive_vehicle_list_for_drop_down]);
        break;
      case "LIST_OF_DRIVERS":
        setDataForDropDown([...selector.drivers_list]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  }

  const showDatePickerModelMethod = (key, mode) => {
    Keyboard.dismiss();
    setDatePickerMode(mode)
    setDatePickerKey(key);
    setShowDatePickerModel(true);
  }

  const showImagePickerMethod = (key) => {
    Keyboard.dismiss();
    setImagePickerKey(key);
    setShowImagePicker(true);
  }

  const submitClicked = (status, taskName) => {

    if (selector.model.length === 0) {
      showToast("Please select model");
      return;
    }

    if (selector.selected_driver.length === 0) {
      showToast("Please select driver");
      return;
    }

    if (selector.customer_preferred_date.length === 0) {
      showToast("Please select customer preffered date");
      return;
    }

    if (selector.customer_preferred_time.length === 0 || selector.actual_start_time.length === 0 || selector.actual_end_time.length === 0) {
      showToast("Please select time");
      return;
    }

    let varientId = "";
    let vehicleId = ""
    selector.test_drive_vehicle_list.forEach(element => {
      if (element.vehicleInfo.vehicleId == selector.selected_vehicle_id) {
        varientId = element.vehicleInfo.varientId;
        vehicleId = element.vehicleInfo.vehicleId;
      }
    });
    if (!varientId || !vehicleId) return;

    const location = selector.address_type_is_showroom === "true" ? "showroom" : "customer";

    if (selector.customer_having_driving_licence === "true") {
      if (!uploadedImagesDataObj.dlFrontUrl || !uploadedImagesDataObj.dlBackUrl) {
        showToast("Please upload driving license front & back");
        return;
      }
    }
    const date = moment(selector.customer_preferred_date, "DD/MM/YYYY").format("DD-MM-YYYY");
    let prefferedTime = "";
    let actualStartTime = "";
    let actualEndTime = "";

    if (Platform.OS === "ios") {
      const preffTime = moment(selector.customer_preferred_time, 'HH:mm').format('HH:mm:ss');
      const startTime = moment(selector.actual_start_time, 'HH:mm').format('HH:mm:ss');
      const endTime = moment(selector.actual_end_time, 'HH:mm').format('HH:mm:ss');
      prefferedTime = date + " " + preffTime;
      actualStartTime = date + " " + startTime;
      actualEndTime = date + " " + endTime;
    }
    else {
      prefferedTime = date + " " + selector.customer_preferred_time;
      actualStartTime = date + " " + selector.actual_start_time;
      actualEndTime = date + " " + selector.actual_end_time;
    }
    setExpectedStartTime(actualStartTime);
    setExpectedEndTime(actualEndTime);
    setTaskStatusAndName({ status: status, name: taskName });

    const payload = {
      "appointment": {
        "address": selector.customer_address,
        "branchId": userData.branchId,
        "customerHaveingDl": selector.customer_having_driving_licence === "true" ? true : false,
        "customerId": universalId,
        "dlBackUrl": uploadedImagesDataObj.dlBackUrl.documentPath,
        "dlFrontUrl": uploadedImagesDataObj.dlFrontUrl.documentPath,
        "dseId": selector.selected_dse_id,
        "location": location,
        "orgId": userData.orgId,
        "source": "ShowroomWalkin",
        "startTime": actualStartTime,
        "endTime": actualEndTime,
        "testDriveDatetime": prefferedTime,
        "testdriveId": 0,
        "status": status,
        "varientId": varientId,
        "vehicleId": vehicleId,
        "driverId": selector.selected_driver_id
      }
    }
    dispatch(bookTestDriveAppointmentApi(payload));
  }

  // Handle Book Test drive appointment response
  useEffect(() => {
    if (selector.book_test_drive_appointment_response) {

      const payload = {
        "universalId": universalId,
        "taskId": null,
        "remarks": "Success",
        "universalModuleId": selector.book_test_drive_appointment_response.confirmationId,
        "status": taskStatusAndName.status,
        "taskName": taskStatusAndName.name,
        "expectedStarttime": expectedStartTime,
        "expectedEndTime": expectedEndTime
      }
      dispatch(updateTestDriveTaskApi(payload));
    }
  }, [selector.book_test_drive_appointment_response])

  // Handle Update Test Drive Task response
  useEffect(() => {
    if (selector.test_drive_update_task_response === "success") {
      showAlertMessage(true);
    } else if (selector.test_drive_update_task_response === "failed") {
      showAlertMessage(false);
    }
  }, [selector.test_drive_update_task_response])

  showAlertMessage = (isSucess) => {
    let message = isSucess ? "TestDrive Appointment has succeeded" : "TestDrive Appointment has failed"
    Alert.alert(
      "",
      message,
      [
        {
          text: "OK",
          onPress: () => {
            dispatch(clearState());
            navigation.popToTop();
          }
        }
      ],
      { cancelable: false }
    );
  }

  const DisplaySelectedImage = ({ fileName }) => {
    return (
      <View style={styles.selectedImageBckVw}>
        <Text style={styles.selectedImageTextStyle}>{fileName}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>

      <ImagePickerComponent
        visible={showImagePicker}
        keyId={imagePickerKey}
        selectedImage={(data, keyId) => {
          console.log("imageObj: ", data, keyId);
          uploadSelectedImage(data, keyId);
          setShowImagePicker(false)
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
            dispatch(updateSelectedTestDriveVehicle(item));
          }
          setShowDropDownModel(false);
          dispatch(setDropDownData({ key: dropDownKey, value: item.name, id: item.id }));
        }}
      />

      <DatePickerComponent
        visible={showDatePickerModel}
        mode={datePickerMode}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {
          console.log("date: ", selectedDate);

          let formatDate = "";
          if (selectedDate) {
            if (datePickerMode === "date") {
              formatDate = convertToDate(selectedDate);
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
              dispatch(updateSelectedDate({ key: datePickerKey, text: formatDate }));
            }
            setShowDatePickerModel(false)
          } else {
            dispatch(updateSelectedDate({ key: datePickerKey, text: formatDate }));
            setShowDatePickerModel(false)
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
                value={selector.name}
                label={"Name*"}
                editable={false}
                disabled={true}
                onChangeText={(text) =>
                  dispatch(setTestDriveDetails({ key: "NAME", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.email}
                label={"Email ID*"}
                keyboardType={"email-address"}
                editable={false}
                disabled={true}
                onChangeText={(text) =>
                  dispatch(setTestDriveDetails({ key: "EMAIL", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.mobile}
                label={"Mobile Number*"}
                maxLength={10}
                keyboardType={"phone-pad"}
                editable={false}
                disabled={true}
                onChangeText={(text) =>
                  dispatch(setTestDriveDetails({ key: "MOBILE", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>

              <DropDownSelectionItem
                label={"Model"}
                value={selector.model}
                disabled={!isRecordEditable}
                onPress={() => showDropDownModelMethod("MODEL", "Model")}
              />

              <DropDownSelectionItem
                label={"Varient"}
                value={selector.varient}
                disabled={true}
              />

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Fuel Type"}
                value={selector.fuel_type}
                editable={false}
                disabled={true}
              />
              <Text style={GlobalStyle.underline}></Text>

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Transmission Type"}
                value={selector.transmission_type}
                editable={false}
                disabled={true}
              />
              <Text style={GlobalStyle.underline}></Text>

              <Text style={styles.chooseAddressTextStyle}>{"Choose address:"}</Text>
              <View style={styles.view2}>
                <RadioTextItem
                  label={"Showroom address"}
                  value={"Showroom address"}
                  status={selector.address_type_is_showroom === "true" ? true : false}
                  onPress={() => dispatch(setTestDriveDetails({ key: "CHOOSE_ADDRESS", text: "true" }))}
                />
                <RadioTextItem
                  label={"Customer address"}
                  value={"Customer address"}
                  status={selector.address_type_is_showroom === "false" ? true : false}
                  onPress={() => dispatch(setTestDriveDetails({ key: "CHOOSE_ADDRESS", text: "false" }))}
                />
              </View>
              <Text style={GlobalStyle.underline}></Text>

              {selector.address_type_is_showroom === "false" && (
                <View >
                  <TextinputComp
                    style={{ height: 65, maxHeight: 100, width: "100%" }}
                    value={selector.customer_address}
                    label={"Customer Address"}
                    multiline={true}
                    numberOfLines={4}
                    editable={isRecordEditable}
                    disabled={!isRecordEditable}
                    onChangeText={(text) =>
                      dispatch(setTestDriveDetails({ key: "CUSTOMER_ADDRESS", text: text }))
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </View>
              )}

              <Text style={{ padding: 10 }}>{"Do Customer have Driving License?"}</Text>
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
                  status={
                    selector.customer_having_driving_licence === "true"
                      ? true
                      : false
                  }
                  onPress={() =>
                    dispatch(
                      setTestDriveDetails({
                        key: "CUSTOMER_HAVING_DRIVING_LICENCE",
                        text: "true",
                      })
                    )
                  }
                />
                <RadioTextItem
                  label={"No"}
                  value={"No"}
                  status={selector.customer_having_driving_licence === "false" ? true : false}
                  onPress={() => dispatch(setTestDriveDetails({ key: "CUSTOMER_HAVING_DRIVING_LICENCE", text: "false", }))}
                />
              </View>
              {selector.customer_having_driving_licence === "true" && (
                <View>
                  <View style={styles.select_image_bck_vw}>
                    <ImageSelectItem
                      name={"Upload Driving License (Front)"}
                      onPress={() => showImagePickerMethod("DRIVING_LICENSE_FRONT")}
                    />
                  </View>
                  {uploadedImagesDataObj.dlFrontUrl ? <DisplaySelectedImage fileName={uploadedImagesDataObj.dlFrontUrl.fileName} /> : null}
                  <View style={styles.select_image_bck_vw}>
                    <ImageSelectItem
                      name={"Upload Driving License (Back)"}
                      onPress={() => showImagePickerMethod("DRIVING_LICENSE_BACK")}
                    />
                  </View>
                  {uploadedImagesDataObj.dlBackUrl ? <DisplaySelectedImage fileName={uploadedImagesDataObj.dlBackUrl.fileName} /> : null}
                </View>
              )}

              <Text style={GlobalStyle.underline}></Text>

              <DateSelectItem
                label={"Customer Preffered Date"}
                value={selector.customer_preferred_date}
                onPress={() => showDatePickerModelMethod("PREFERRED_DATE", "date")}
              />
              <DropDownSelectionItem
                label={"List of Employees"}
                value={selector.selected_dse_employee}
                disabled={true}
              />
              <DropDownSelectionItem
                label={"List of Drivers"}
                value={selector.selected_driver}
                onPress={() => showDropDownModelMethod("LIST_OF_DRIVERS", "List of Drivers")}
              />
              <DateSelectItem
                label={"Customer Preffered Time"}
                value={selector.customer_preferred_time}
                onPress={() => showDatePickerModelMethod("CUSTOMER_PREFERRED_TIME", "time")}
              />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '50%' }}>
                  <DateSelectItem
                    label={"Actual start Time"}
                    value={selector.actual_start_time}
                    onPress={() => showDatePickerModelMethod("ACTUAL_START_TIME", "time")}
                  />
                </View>
                <View style={{ width: '50%' }}>
                  <DateSelectItem
                    label={"Actual End Time"}
                    value={selector.actual_end_time}
                    onPress={() => showDatePickerModelMethod("ACTUAL_END_TIME", "time")}
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
                disabled={false}
                onPress={() => submitClicked('SENT_FOR_APPROVAL', 'Test Drive')}
              />
            </View>
          )}
          {handleActionButtons === 2 && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Cancel"}
                disabled={false}
                onPress={() => submitClicked('CANCELLED', 'Test Drive')}
              />
            </View>
          )}
          {handleActionButtons === 3 && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Reject"}
                disabled={false}
                onPress={() => submitClicked('CANCELLED', 'Test Drive Approval')}
              />
              <LocalButtonComp
                title={"Approve"}
                disabled={false}
                bgColor={Colors.GREEN}
                onPress={() => submitClicked('APPROVED', 'Test Drive Approval')}
              />
            </View>
          )}
          {handleActionButtons === 4 && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Reject"}
                disabled={false}
                onPress={() => submitClicked('CLOSED', 'Test Drive')}
              />
              <LocalButtonComp
                title={"Approve"}
                disabled={false}
                bgColor={Colors.GREEN}
                onPress={() => submitClicked('RESCHEDULED', 'Test Drive')}
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
    color: Colors.GRAY
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
    backgroundColor: Colors.WHITE
  },
  selectedImageTextStyle: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.DARK_GRAY
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.RED
  }
});
