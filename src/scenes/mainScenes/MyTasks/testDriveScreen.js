import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform
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
  setTestDriveDetails,
  updateSelectedDropDownData,
  updateSelectedDate,
  setDropDownData,
  updateFuelAndTransmissionType,
  getTestDriveDseEmployeeListApi,
  getDriversListApi,
  getTestDriveVehicleListApi
} from "../../../redux/testDriveReducer";
import { DateSelectItem, RadioTextItem, ImageSelectItem, DropDownSelectionItem } from "../../../pureComponents";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { RadioButton } from "react-native-paper";
import { Button } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import { convertToDate, convertToTime } from "../../../utils/helperFunctions";
import { showToastRedAlert } from "../../../utils/toast";
import URL from "../../../networking/endpoints";

const TestDriveScreen = ({ route, navigation }) => {

  const { taskId, identifier, universalId } = route.params;
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.testDriveReducer);
  const { vehicle_modal_list } = useSelector(state => state.homeReducer);
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "" })
  const [carModelsData, setCarModelsData] = useState([]);
  const [selectedCarVarientsData, setSelectedCarVarientsData] = useState({ varientList: [], varientListForDropDown: [] });
  const [showDatePickerModel, setShowDatePickerModel] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState("");
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerKey, setImagePickerKey] = useState("");
  const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});


  useEffect(() => {
    getAsyncstoreData();
    //dispatch(getTestDriveDseEmployeeListApi());
    dispatch(getDriversListApi());
    setCarModelsDataFromBase();
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
    }
  }

  const setCarModelsDataFromBase = () => {
    let modalList = [];
    if (vehicle_modal_list.length > 0) {
      vehicle_modal_list.forEach(item => {
        modalList.push({ id: item.vehicleId, name: item.model })
      });
    }
    setCarModelsData([...modalList]);
  }

  const updateVariantModelsData = (selectedModelName) => {

    if (!selectedModelName || selectedModelName.length === 0) { return }

    let arrTemp = vehicle_modal_list.filter(function (obj) {
      return obj.model === selectedModelName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.varients;
      if (mArray.length) {
        mArray.forEach(item => {
          newArray.push({
            id: item.id,
            name: item.name
          })
        })
        setSelectedCarVarientsData({ varientList: [...mArray], varientListForDropDown: [...newArray] });
      }
    }
  }

  const updateColorsDataForSelectedVarient = (selectedVarientName, varientList) => {

    if (!selectedVarientName || selectedVarientName.length === 0) { return }

    let arrTemp = varientList.filter(function (obj) {
      return obj.name === selectedVarientName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.vehicleImages;
      if (mArray.length) {
        mArray.map(item => {
          newArray.push({
            id: item.id,
            name: item.color
          })
        })
        const obj = {
          fuelType: carModelObj.fuelType,
          transmissionType: carModelObj.transmission_type
        }
        dispatch(updateFuelAndTransmissionType(obj));
      }
    }
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
    formData.append("documentType", "dl");

    await fetch(URL.UPLOAD_DOCUMENT(), {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then((response) => {
        //console.log('response', response);
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
        setDataForDropDown([...carModelsData]);
        break;
      case "VARIENT":
        setDataForDropDown([...selectedCarVarientsData.varientListForDropDown]);
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
            updateVariantModelsData(item.name);
          }
          else if (dropDownKey === "VARIENT") {
            updateColorsDataForSelectedVarient(item.name, selectedCarVarientsData.varientList);
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
              formatDate = convertToTime(selectedDate);
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
                label={"Name"}
                onChangeText={(text) =>
                  dispatch(setTestDriveDetails({ key: "NAME", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.email}
                label={"Email ID"}
                keyboardType={"email-address"}
                onChangeText={(text) =>
                  dispatch(setTestDriveDetails({ key: "EMAIL", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.mobile}
                label={"Mobile Number"}
                maxLength={10}
                keyboardType={"phone-pad"}
                onChangeText={(text) =>
                  dispatch(setTestDriveDetails({ key: "MOBILE", text: text }))
                }
              />
              <Text style={GlobalStyle.underline}></Text>

              <DropDownSelectionItem
                label={"Model"}
                value={selector.model}
                onPress={() => showDropDownModelMethod("MODEL", "Model")}
              />

              <DropDownSelectionItem
                label={"Varient"}
                value={selector.varient}
                onPress={() => showDropDownModelMethod("VARIENT", "Varient")}
              />

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Fuel Type"}
                value={selector.fuel_type}
                editable={false}
              />
              <Text style={GlobalStyle.underline}></Text>

              <TextinputComp
                style={{ height: 65, width: "100%" }}
                label={"Transmission Type"}
                value={selector.transmission_type}
                editable={false}
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
                <View style={styles.select_image_bck_vw}>
                  <ImageSelectItem
                    name={"Upload Driving License"}
                    onPress={() => showImagePickerMethod("DRIVING_LICENSE")}
                  />
                </View>
              )}
              {uploadedImagesDataObj.dl ? <DisplaySelectedImage fileName={uploadedImagesDataObj.dl.fileName} /> : null}

              <Text style={GlobalStyle.underline}></Text>

              <DateSelectItem
                label={"Customer Preffered Date"}
                value={selector.customer_preferred_date}
                onPress={() => showDatePickerModelMethod("PREFERRED_DATE", "date")}
              />
              <DropDownSelectionItem
                label={"List of Employees"}
                value={userData.employeeName}
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
              <DateSelectItem
                label={"Actual start Time (24 hours Format)"}
                value={selector.actual_start_time}
                onPress={() => showDatePickerModelMethod("ACTUAL_START_TIME", "time")}
              />
              <DateSelectItem
                label={"Actual End Time (24 hours Format)"}
                value={selector.actual_end_time}
                onPress={() => showDatePickerModelMethod("ACTUAL_END_TIME", "time")}
              />
              <View style={styles.space}></View>
              <Text style={{ padding: 10 }}>{"Allotment ID"}</Text>
              <Text style={GlobalStyle.underline}></Text>
              <View style={styles.space}></View>
              <Text style={{ padding: 10 }}>{"Planned Start Date Time"} </Text>
              <Text style={GlobalStyle.underline}></Text>
              <View style={styles.space}></View>
              <Text style={{ padding: 10 }}>{"Planned End Date Time"}</Text>
              <Text style={GlobalStyle.underline}></Text>
            </View>
          </View>
          <View style={styles.view1}>
            <Button
              mode="contained"
              style={{ width: 120 }}
              color={Colors.RED}
              labelStyle={{ textTransform: "none" }}
              onPress={() => console.log("Pressed")}
            >
              Submit
            </Button>
            <Button
              mode="contained"
              style={{ width: 120 }}
              color={Colors.RED}
              labelStyle={{ textTransform: "none" }}
              onPress={() => console.log("Pressed")}
            >
              Close
            </Button>
          </View>
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
  }
});
