import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Checkbox, DataTable, List, Button } from "react-native-paper";
import { Colors } from "../../../styles";
import { StyleSheet } from "react-native";
import {
  ButtonComp,
  DatePickerComponent,
  DropDownComponant,
  ImagePickerComponent,
  TextinputComp,
} from "../../../components";
import { Dropdown } from "react-native-element-dropdown";
import { DateSelectItem, RadioTextItem } from "../../../pureComponents";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "./Component/CustomTextInput";
import Entypo from "react-native-vector-icons/Entypo";
import CustomEvaluationDropDown from "./Component/CustomEvaluationDropDown";
import CustomDatePicker from "./Component/CustomDatePicker";
import CustomRadioButton from "./Component/RadioComponent";
import CustomSelection from "./Component/CustomSelection";
import CustomUpload from "./Component/CustomUpload";
import Table from "./Component/CustomTable";

const LocalButtonComp = ({ title, onPress, disabled, color }) => {
  return (
    <Button
      style={{
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 5,
      }}
      mode="contained"
      color={color ? color : Colors.RED}
      disabled={disabled}
      labelStyle={{ textTransform: "none", color: Colors.WHITE }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};
const SAMPLELIST = [
  {
    Name: "Product A",
    "Office Allocated": "Office 1",
    Remarks: "Lorem ipsum dolor sit amet",
    Quantity: 10,
    Cost: 50,
    Price: 70,
  },
  {
    Name: "Product B",
    "Office Allocated": "Office 2",
    Remarks: "Consectetur adipiscing elit",
    Quantity: 5,
    Cost: 20,
    Price: 30,
  },
  {
    Name: "Product C",
    "Office Allocated": "Office 1",
    Remarks: "Sed do eiusmod tempor incididunt",
    Quantity: 15,
    Cost: 30,
    Price: 40,
  },
];

const EvaluationForm = () => {
  const [showDropDown, setShowDropDown] = useState(false);
  const [dropDownTitle, setDropDownTitle] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [eventNumber, setEventNumber] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventOrganiser, setEventOrganiser] = useState("");
  const [eventPlannerLocation, setEventPlannerLocation] = useState("");
  const [eventPlannerCode, setEventPlannerCode] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventArea, setEventArea] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");

  const [eventNumberError, setEventNumberError] = useState(null);
  const [eventNameError, setEventNameError] = useState(null);
  const [eventOrganiserError, setEventOrganiserError] = useState(null);
  const [eventPlannerLocationError, setEventPlannerLocationError] =
    useState(null);
  const [eventPlannerDealerCodeError, setEventPlannerDealerCodeError] =
    useState(null);
  const [pincodeError, setPincodeError] = useState(null);
  const [eventTypeError, setEventTypeError] = useState(null);
  const [eventCategoryError, setEventCategoryError] = useState(null);
  const [eventAreaError, setEventAreaError] = useState(null);
  const [eventLocationError, setEventLocationError] = useState(null);
  const [districtError, setDistrictError] = useState(null);
  const [stateError, setStateError] = useState(null);
  const [eventStartDateError, setEventStartDateError] = useState(null);
  const [eventEndDateError, setEventEndDateError] = useState(null);

  const [rcNumber, setRcNumber] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [color, setColor] = useState("");
  const [fuelType, setFuelType] = useState("");

  const [rcNumberError, setRcNumberError] = useState(null);
  const [modelError, setModelError] = useState(null);
  const [variantError, setVariantError] = useState(null);
  const [colorError, setColorError] = useState(null);
  const [fuelTypeError, setFuelTypeError] = useState(null);

  const [manager, setManager] = useState("");
  const [managerError, setManagerError] = useState(null);
  const [tl, setTl] = useState("");
  const [tlError, setTlError] = useState(null);
  const [consultant, setConsultant] = useState("");
  const [consultantError, setConsultantError] = useState(null);
  const [driver, setDriver] = useState("");
  const [driverError, setDriverError] = useState(null);
  const [financeExecutive, setFinanceExecutive] = useState("");
  const [financeExecutiveError, setFinanceExecutiveError] = useState(null);
  const [evaluator, setEvaluator] = useState("");
  const [evaluatorError, setEvaluatorError] = useState(null);
  const [openAccordian, setOpenAccordian] = useState("1");
  const [openAccordian2, setOpenAccordian2] = useState("1");
  const [openAccordianError, setOpenAccordianError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerError, setShowDatePickerError] = useState(null);

  const [budget, setBudget] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [ItemList, setItemList] = useState(SAMPLELIST);
  let scrollRef = useRef(null);

  const handleSave = (item) => {
    // handle form submit here
    // Keyboard.dismiss();
    setItemList([...ItemList, item]);
    setModalVisible(false);
  };

  const scrollToPos = (itemIndex) => {
    scrollRef.current.scrollTo({ y: itemIndex * 70 });
  };

  const handleLogin = () => {
    // Handle login logic here
  };

  const validation = () => {
    let isValid = true;
    if (!eventNumber || isNaN(eventNumber)) {
      setEventNumberError("Please enter a valid event number.");
      isValid = false;
    }
    if (!eventName || eventName.length < 3) {
      setEventNameError(
        "Please enter a valid event name (at least 3 characters)."
      );
      isValid = false;
    }
    if (!eventOrganiser || eventOrganiser.length < 3) {
      setEventOrganiserError(
        "Please enter a valid event organiser (at least 3 characters)."
      );
      isValid = false;
    }
    if (!eventPlannerLocation) {
      setEventPlannerLocationError("Please select an event planner location.");
      isValid = false;
    }
    if (!eventPlannerCode) {
      setEventPlannerDealerCodeError(
        "Please select an event planner dealer code."
      );
      isValid = false;
    }
    if (!pinCode || pinCode.length !== 6) {
      setPincodeError("Please enter a valid pincode (6 digits).");
      isValid = false;
    }
    if (!eventType) {
      setEventTypeError("Please select an event type.");
      isValid = false;
    }
    if (!eventCategory) {
      setEventCategoryError("Please select an event category.");
      isValid = false;
    }
    if (!eventArea) {
      setEventAreaError("Please enter an event area.");
      isValid = false;
    }
    if (!eventLocation) {
      setEventLocationError("Please enter an event location.");
      isValid = false;
    }
    if (!district) {
      setDistrictError("Please enter a district.");
      isValid = false;
    }
    if (!state) {
      setStateError("Please enter a state.");
      isValid = false;
    }
    if (!eventStartDate) {
      setEventStartDateError("Please select a start date.");
      isValid = false;
    }
    if (!eventEndDate) {
      setEventEndDateError("Please select an end date.");
      isValid = false;
    }

    if (!rcNumber || rcNumber.length !== 12) {
      setRcNumberError("Please enter a valid RC number (12 characters).");
      isValid = false;
    }
    if (!model || model.length < 2) {
      setModelError("Please enter a valid model name (at least 2 characters).");
      isValid = false;
    }
    if (!variant || variant.length < 2) {
      setVariantError(
        "Please enter a valid variant name (at least 2 characters)."
      );
      isValid = false;
    }
    if (!color || color.length < 2) {
      setColorError("Please enter a valid color name (at least 2 characters).");
      isValid = false;
    }
    if (!fuelType || fuelType.length < 2) {
      setFuelTypeError(
        "Please enter a valid fuel type (at least 2 characters)."
      );
      isValid = false;
    }

    if (!manager || manager.length < 2) {
      setManagerError(
        "Please enter a valid manager name (at least 2 characters)."
      );
      isValid = false;
    }
    if (!tl || tl.length < 2) {
      setTlError(
        "Please enter a valid team leader name (at least 2 characters)."
      );
      isValid = false;
    }
    if (!consultant || consultant.length < 2) {
      setConsultantError(
        "Please enter a valid consultant name (at least 2 characters)."
      );
      isValid = false;
    }
    if (!driver || driver.length < 2) {
      setDriverError(
        "Please enter a valid driver name (at least 2 characters)."
      );
      isValid = false;
    }
    if (!financeExecutive || financeExecutive.length < 2) {
      setFinanceExecutiveError(
        "Please enter a valid finance executive name (at least 2 characters)."
      );
      isValid = false;
    }
    if (!evaluator || evaluator.length < 2) {
      setEvaluatorError(
        "Please enter a valid evaluator name (at least 2 characters)."
      );
      isValid = false;
    }

    if (!openAccordian) {
      setOpenAccordianError("Please select an accordion panel.");
      isValid = false;
    }

    if (!showDatePicker) {
      setShowDatePickerError("Please select a date.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validation()) {
    }
    // handle form submission logic
    scrollToPos(0);
    setOpenAccordian("2");
  };

  const updateAccordian = (selectedIndex) => {
    // Keyboard.dismiss();
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
    }
  };

  const updateSecondAccordian = (selectedIndex) => {
    // Keyboard.dismiss();
    if (selectedIndex != openAccordian2) {
      setOpenAccordian2(selectedIndex);
    } else {
      setOpenAccordian2(0);
    }
  };

  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];

  return (
    <SafeAreaView style={[{ flex: 1 }]}>
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {}}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <DropDownComponant
        visible={showDropDown}
        headerTitle={dropDownTitle}
        data={[]}
        onRequestClose={() => setShowDropDown(false)}
        selectedItems={(item) => {}}
      />
      <ImagePickerComponent
        visible={showImagePicker}
        selectedImage={(data, keyId) => {}}
        onDismiss={() => {
          setShowImagePicker(false);
        }}
      />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          ref={scrollRef}
        >
          <View style={{ marginHorizontal: 10 }}>
            <List.AccordionGroup
              expandedId={openAccordian}
              onAccordionPress={(expandedId) => updateAccordian(expandedId)}
            >
              <List.Accordion
                id={"1"}
                key={"1"}
                title={"Customer Information"}
                titleStyle={{
                  color: openAccordian === "1" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "1" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <CustomEvaluationDropDown
                    label="Salutation"
                    buttonText="Select Salutation"
                    onPress={() => {
                      setShowDropDown(true);
                    }}
                  />
                  <CustomTextInput
                    placeholder="Enter First Name"
                    label="First Name"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Last Name"
                    label="Last Name"
                    mandatory={true}
                  />
                  <CustomEvaluationDropDown
                    label="Gender"
                    buttonText="Select Gender"
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Relation Name"
                    label="Relation Name"
                  />
                  <CustomDatePicker
                    label="Date of Birth"
                    value="17/05/1995"
                    onPress={() => {
                      setShowDatePicker(true);
                    }}
                  />
                  <CustomTextInput placeholder="Enter Age" label="Age" />
                  <CustomDatePicker
                    label="Anniversary Date"
                    value="17/05/1995"
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Mobile Number"
                    label="Mobile Number"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Alternate Mobile Number"
                    label="Alternate Mobile Number"
                  />
                  <CustomTextInput
                    placeholder="Enter Email ID"
                    label="Email ID"
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"2"}
                key={"2"}
                title={"Customer Address"}
                titleStyle={{
                  color: openAccordian === "2" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "2" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Entypo size={17} name="home" color={Colors.RED} />
                    <Text style={{ fontSize: 17, fontWeight: "600" }}>
                      {" Communication Address"}
                    </Text>
                  </View>
                  <CustomTextInput
                    placeholder="Enter Pincode"
                    label="Pincode"
                    mandatory={true}
                  />
                  <View style={{ flexDirection: "row" }}>
                    <RadioTextItem
                      label={"Urban"}
                      value={"urban"}
                      status={true}
                      onPress={() => {}}
                    />
                    <RadioTextItem
                      label={"Rural"}
                      value={"rural"}
                      status={false}
                      onPress={() => {}}
                    />
                  </View>
                  <CustomTextInput placeholder="Enter H-No" label="H-No" />
                  <CustomTextInput placeholder="Enter Street" label="Street" />
                  <CustomEvaluationDropDown
                    label="Village/Town"
                    buttonText="Select Village/Town"
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Mandal/Tahsil"
                    label="Mandal/Tahsil"
                  />
                  <CustomTextInput placeholder="Enter City" label="City" />
                  <CustomTextInput
                    placeholder="Enter District"
                    label="District"
                  />
                  <CustomTextInput placeholder="Enter State" label="State" />
                  <View style={{ flexDirection: "row", marginTop: 15 }}>
                    <Entypo size={17} name="home" color={Colors.RED} />
                    <Text style={{ fontSize: 17, fontWeight: "600" }}>
                      {" Permanent Address"}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 15, fontWeight: "600", marginTop: 10 }}
                    >
                      {"Permanent Address Same as Communication Address"}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <RadioTextItem
                      label={"Yes"}
                      value={"yes"}
                      status={true}
                      onPress={() => {}}
                    />
                    <RadioTextItem
                      label={"No"}
                      value={"no"}
                      status={false}
                      onPress={() => {}}
                    />
                  </View>
                  <CustomTextInput
                    placeholder="Enter Pincode"
                    label="Pincode"
                    mandatory={true}
                  />
                  <View style={{ flexDirection: "row" }}>
                    <RadioTextItem
                      label={"Urban"}
                      value={"urban"}
                      status={true}
                      onPress={() => {}}
                    />
                    <RadioTextItem
                      label={"Rural"}
                      value={"rural"}
                      status={false}
                      onPress={() => {}}
                    />
                  </View>
                  <CustomTextInput placeholder="Enter H-No" label="H-No" />
                  <CustomTextInput placeholder="Enter Street" label="Street" />
                  <CustomEvaluationDropDown
                    label="Village/Town"
                    buttonText="Select Village/Town"
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Mandal/Tahsil"
                    label="Mandal/Tahsil"
                  />
                  <CustomTextInput placeholder="Enter City" label="City" />
                  <CustomTextInput
                    placeholder="Enter District"
                    label="District"
                  />
                  <CustomTextInput placeholder="Enter State" label="State" />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"3"}
                key={"3"}
                title={"Vehicle Information"}
                titleStyle={{
                  color: openAccordian === "3" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "3" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <CustomTextInput
                    placeholder="Enter RC Number"
                    label="RC Number"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Name On RC"
                    label="Name On RC"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Mobile Number"
                    label="Mobile Number"
                    mandatory={true}
                  />
                  <CustomEvaluationDropDown
                    label="Brand"
                    buttonText="Select Brand"
                    onPress={() => {}}
                  />
                  <CustomEvaluationDropDown
                    label="Model"
                    buttonText="Select Model"
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Variant"
                    label="Variant"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Colour"
                    label="Colour"
                    mandatory={true}
                  />
                  <CustomEvaluationDropDown
                    label="Fuel Type"
                    buttonText="Select Fuel Type"
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Transmission"
                    label="Transmission"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Vin Number"
                    label="Vin Number"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Engine Number"
                    label="Engine Number"
                    mandatory={true}
                  />
                  <CustomEvaluationDropDown
                    label="Month"
                    buttonText="Select Month"
                    onPress={() => {}}
                  />
                  <CustomEvaluationDropDown
                    label="Year"
                    buttonText="Select Year"
                    onPress={() => {}}
                  />
                  <CustomDatePicker
                    label="Date of Registration"
                    value="17/05/1995"
                    onPress={() => {}}
                  />
                  <CustomDatePicker
                    label="Regn. Valid Upto"
                    value="17/05/1995"
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Pincode"
                    label="Pincode"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Registration State"
                    label="Registration State"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Registration District"
                    label="Registration District"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Registration City"
                    label="Registration City"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Emission"
                    label="Emission"
                    mandatory={true}
                  />
                  <CustomEvaluationDropDown
                    label="Vehicle Type"
                    buttonText="Select Vehicle Type"
                    onPress={() => {}}
                  />
                  <CustomEvaluationDropDown
                    label="Type of Body"
                    buttonText="Select Type of Body"
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter KM's driven"
                    label="KM's driven"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Cubic Capacity"
                    label="Cubic Capacity"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter No Owners"
                    label="No Owners"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter No. of Challan Pending"
                    label="No. of Challan Pending"
                    mandatory={true}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"4"}
                key={"4"}
                title={"Tyre Conditions"}
                titleStyle={{
                  color: openAccordian === "4" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "4" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <CustomRadioButton
                    label="Front right"
                    onPress={() => {}}
                    mandatory={true}
                  />
                  <CustomRadioButton
                    label="Front left"
                    onPress={() => {}}
                    mandatory={true}
                  />
                  <CustomRadioButton
                    label="Rear right"
                    onPress={() => {}}
                    mandatory={true}
                  />
                  <CustomRadioButton
                    label="Rear left"
                    onPress={() => {}}
                    mandatory={true}
                  />
                  <CustomRadioButton
                    label="Spare Disk Wheel"
                    onPress={() => {}}
                    mandatory={true}
                  />
                  <CustomRadioButton
                    label="Spare Alli Wheel"
                    onPress={() => {}}
                    mandatory={true}
                  />
                  <CustomSelection
                    label="Any Minor Accident"
                    onPress={() => {}}
                    mandatory={true}
                  />
                  <CustomSelection
                    label="Any Major Accident"
                    onPress={() => {}}
                    mandatory={true}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"5"}
                key={"5"}
                title={"Hypothication"}
                titleStyle={{
                  color: openAccordian === "5" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "5" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox.Android
                      status={true ? "checked" : "unchecked"}
                      color={Colors.RED}
                      onPress={() => {}}
                    />
                    <Text>{"* Agree to enter Hypothication details"}</Text>
                  </View>
                  <CustomTextInput
                    placeholder="Enter Hypothecated To"
                    label="Hypothecated To"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Hypothecated Branch"
                    label="Hypothecated Branch"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Loan amount due"
                    label="Loan amount due"
                    mandatory={true}
                  />
                  <CustomDatePicker
                    label="Hypothication Completed Date"
                    value="17/05/1995"
                    onPress={() => {}}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"6"}
                key={"6"}
                title={"Insurance"}
                titleStyle={{
                  color: openAccordian === "6" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "6" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox.Android
                      status={true ? "checked" : "unchecked"}
                      color={Colors.RED}
                      onPress={() => {}}
                    />
                    <Text>{"* Agree to enter Insurance details"}</Text>
                  </View>
                  <CustomEvaluationDropDown
                    label="Insurance Type"
                    buttonText="Choose your Insurance Type"
                    onPress={() => {}}
                  />
                  <CustomTextInput
                    placeholder="Enter Insurance Company Name"
                    label="Insurance Company Name"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Policy Number"
                    label="Policy Number"
                    mandatory={true}
                  />
                  <CustomDatePicker
                    label="Insurance From Date"
                    value="17/05/1995"
                    onPress={() => {}}
                  />
                  <CustomDatePicker
                    label="Insurance To Date"
                    value="17/05/1995"
                    onPress={() => {}}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"7"}
                key={"7"}
                title={"Upload Images of Car - Evaluation Time"}
                titleStyle={{
                  color: openAccordian === "7" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "7" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <CustomUpload
                    label="Front Side"
                    buttonText="Upload Front Side Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Back Side"
                    buttonText="Upload Back Side Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Left Side"
                    buttonText="Upload Left Side Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Right Side"
                    buttonText="Upload Right Side Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Speedo meter"
                    buttonText="Upload Speedo meter Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Front Side"
                    buttonText="Upload Front Side Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Chassis"
                    buttonText="Upload Chassis Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Interior Front"
                    buttonText="Upload Interior Front Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Interior Back"
                    buttonText="Upload Interior Back Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Extra Fitment"
                    buttonText="Upload Extra Fitment Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Scratch Damage"
                    buttonText="Upload Scratch Damage Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Dent Damage"
                    buttonText="Upload Dent Damage Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Functions"
                    buttonText="Upload Functions Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Break Damage"
                    buttonText="Upload Break Damage Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Number Plate"
                    buttonText="Upload Number Plate Image"
                    onPress={() => {}}
                  />
                  <LocalButtonComp
                    title={"Add Other Image"}
                    onPress={() => {}}
                    disabled={false}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"8"}
                key={"8"}
                title={"Upload Images of Documents - Evaluation Time"}
                titleStyle={{
                  color: openAccordian === "8" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "8" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <CustomUpload
                    label="Rc Front"
                    buttonText="Upload Rc Front Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Rc Back"
                    buttonText="Upload Rc Back Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Insurance Copy"
                    buttonText="Upload Insurance Copy Image"
                    mandatory={true}
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Invoice"
                    buttonText="Upload Invoice Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Hypothication Document"
                    buttonText="Upload Hypothication Document Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Bank/Finance - old car NOC"
                    buttonText="Upload Bank/Finance - old car NOC Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="CC"
                    buttonText="Upload CC Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="Pollution"
                    buttonText="Upload Pollution Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="ID Proof"
                    buttonText="Upload Id Proof Image"
                    onPress={() => {}}
                  />
                  <CustomUpload
                    label="PAN Card"
                    buttonText="Upload PAN Card Image"
                    onPress={() => {}}
                  />
                  <LocalButtonComp
                    title={"Add Other Image"}
                    onPress={() => {}}
                    disabled={false}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"9"}
                key={"9"}
                title={"Check List"}
                titleStyle={{
                  color: openAccordian === "9" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "9" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View
                  style={{
                    marginHorizontal: 15,
                  }}
                >
                  <List.AccordionGroup
                    expandedId={openAccordian2}
                    onAccordionPress={(expandedId) =>
                      updateSecondAccordian(expandedId)
                    }
                  >
                    <List.Accordion
                      id={"1"}
                      key={"1"}
                      title={"General Appearance"}
                      titleStyle={{
                        color:
                          openAccordian2 === "1" ? Colors.BLACK : Colors.BLACK,
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                      style={[
                        {
                          backgroundColor:
                            openAccordian2 === "1" ? Colors.RED : Colors.WHITE,
                          height: 60,
                        },
                        styles.accordianBorder2,
                      ]}
                    >
                      <View></View>
                    </List.Accordion>
                  </List.AccordionGroup>
                </View>
              </List.Accordion>
              <List.Accordion
                id={"10"}
                key={"10"}
                title={"Refurbishment Cost"}
                titleStyle={{
                  color: openAccordian === "10" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "10" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <Table label={"Items"} />
                  <View style={{ height: 25 }} />
                  <Table label={"Additional Expenses"} />
                  <Text
                    style={{ fontSize: 14, color: "#000", fontWeight: "500" }}
                  >
                    {"Total Refurbishment Cost: 0"}
                  </Text>
                  <LocalButtonComp
                    title={"Add Other Cost"}
                    onPress={() => {}}
                    disabled={false}
                  />
                </View>
              </List.Accordion>
              <List.Accordion
                id={"11"}
                key={"11"}
                title={"Price Declaration"}
                titleStyle={{
                  color: openAccordian === "11" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "11" ? Colors.RED : Colors.WHITE,
                    height: 60,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View>
                  <CustomTextInput
                    placeholder="Enter Customer Expected Price"
                    label="Customer Expected Price"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Evaluator Offered Price"
                    label="Evaluator Offered Price"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Manager Approved Price"
                    label="Manager Approved Price"
                    mandatory={true}
                  />
                  <CustomTextInput
                    placeholder="Enter Price Gap"
                    label="Price Gap"
                    mandatory={true}
                  />
                  <CustomDatePicker
                    label="Approval Expiry Date"
                    value="17/05/1995"
                    onPress={() => {}}
                  />
                </View>
              </List.Accordion>
            </List.AccordionGroup>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <LocalButtonComp
                title={"Save as Draft"}
                onPress={() => {}}
                disabled={false}
                color={Colors.GRAY}
              />
              <LocalButtonComp
                title={"Submit"}
                onPress={() => {}}
                disabled={false}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EvaluationForm;

const styles = StyleSheet.create({
  accordianBorder: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
    justifyContent: "center",
    marginVertical: 3,
  },
  accordianBorder2: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: "#7a7b7d",
    justifyContent: "center",
    marginVertical: 3,
  },
  textInputStyle: {
    height: 50,
    width: "100%",
    marginVertical: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 16,
    // borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 5,
    paddingLeft: 25,
    paddingRight: 25,
    marginVertical: 10,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  table: {
    width: "100%",
    marginTop: 20,
  },
  column: {
    flex: 1,
    maxWidth: 100,
    minWidth: 100,
    marginHorizontal: 5,
  },
});
