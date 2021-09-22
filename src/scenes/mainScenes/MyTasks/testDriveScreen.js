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
} from "../../../components";
import { DropDownSelectionItem } from "../../../pureComponents";
import {
  setTestDriveDetails,
  updateSelectedDropDownData,
  updateSelectedDate,
  setDropDownData,
  updateFuelAndTransmissionType,
  getTestDriveDseEmployeeListApi,
  getDriversListApi
} from "../../../redux/testDriveReducer";
import { DateSelectItem, RadioTextItem } from "../../../pureComponents";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { RadioButton } from "react-native-paper";
import { Button } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import { convertToDate, convertToTime } from "../../../utils/helperFunctions";

const TestDriveScreen = ({ navigation }) => {

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
  const [driversList, setDrivesList] = useState([]);

  useEffect(() => {
    getAsyncstoreData();
    dispatch(getTestDriveDseEmployeeListApi());
    dispatch(getDriversListApi());
    setCarModelsDataFromBase();
  }, []);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName })
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


  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>

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
                label={"Customer Preffered Time (24 hours Format)"}
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
  }
});
