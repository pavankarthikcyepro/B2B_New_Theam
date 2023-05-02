import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { DataTable, IconButton, List } from "react-native-paper";
import { Colors } from "../../../styles";
import { StyleSheet } from "react-native";
import { DatePickerComponent, TextinputComp } from "../../../components";
import { Dropdown } from "react-native-element-dropdown";
import { DateSelectItem, ImageSelectItem } from "../../../pureComponents";
import { FloatingModal } from "./Component/FloatingModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
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

const CampaignFormScreen = () => {
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

  const [rcNumber, setRcNumber] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [color, setColor] = useState("");
  const [fuelType, setFuelType] = useState("");

  const [manager, setManager] = useState("");
  const [tl, setTl] = useState("");
  const [consultant, setConsultant] = useState("");
  const [driver, setDriver] = useState("");
  const [financeExecutive, setFinanceExecutive] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [openAccordian, setOpenAccordian] = useState("1");
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleLogin = () => {
    // Handle login logic here
  };
  const handleSubmit = () => {
    // handle form submission logic
  };

  const updateAccordian = (selectedIndex) => {
    // Keyboard.dismiss();
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
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
  const DisplaySelectedImage = ({ fileName, from }) => {
    return (
      <View style={styles.selectedImageBckVw}>
        <Text style={styles.selectedImageTextStyle} numberOfLines={1}>
          {fileName}
        </Text>
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
    <SafeAreaView style={[{ flex: 1 }]}>
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {}}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <FloatingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleSave={handleSave}
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
                title={"Campaign Schedule"}
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
                  <TextinputComp
                    key={"1"}
                    style={styles.textInputStyle}
                    label={"Campaign Id*"}
                    value={eventNumber}
                    onChangeText={(text) => {
                      console.log("tee", text);
                      setEventNumber(text);
                    }}
                  />
                  <TextinputComp
                    key={"1"}
                    style={styles.textInputStyle}
                    label={"Social Media Campaign Id*"}
                    value={eventNumber}
                    onChangeText={(text) => {
                      console.log("tee", text);
                      setEventNumber(text);
                    }}
                  />
                  <TextinputComp
                    key={"2"}
                    style={styles.textInputStyle}
                    label="Campaign Name*"
                    value={eventName}
                    onChangeText={(text) => setEventName(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="Campaign Organiser*"
                    value={eventOrganiser}
                    onChangeText={(text) => setEventOrganiser(text)}
                  />
                  <Dropdown
                    placeholder="Campaign Planner-location*"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setEventPlannerLocation(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <Dropdown
                    placeholder="Campaign Planner - Dealer Code*"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setEventPlannerCode(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <Dropdown
                    placeholder="Social Media*"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setEventPlannerCode(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="Target Location"
                    value={pinCode}
                    onChangeText={(text) => setPinCode(text)}
                  />
                  <Dropdown
                    placeholder="Target Gender"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setEventType(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="Target Age From"
                    value={eventLocation}
                    onChangeText={(text) => setEventLocation(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="Target Age To"
                    value={district}
                    onChangeText={(text) => setDistrict(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="Budget"
                    value={state}
                    onChangeText={(text) => setState(text)}
                  />
                  <DateSelectItem
                    label={"Campaign Start Date*"}
                    value={"nmnmn"}
                    onPress={() => {}}
                  />
                  <DateSelectItem
                    label={"Campaign End Date*"}
                    value={"nmnmn"}
                    onPress={() => {}}
                  />
                </View>
              </List.Accordion>

              <List.Accordion
                id={"2"}
                key={"2"}
                title={"Upload Campaign Images & Video"}
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
                <View style={{marginHorizontal:10}}>
                  <>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Upload Campaign Images"}
                        onPress={() => {}}
                      />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={styles.preViewBtn}
                        onPress={() => {}}
                      >
                        <Text style={styles.previewTxt}>Preview</Text>
                      </TouchableOpacity>
                      <View style={{ width: "80%" }}>
                        <DisplaySelectedImage fileName={"sssss"} from={"PAN"} />
                      </View>
                    </View>
                  </>
                  <>
                    <View style={styles.select_image_bck_vw}>
                      <ImageSelectItem
                        name={"Upload Campaign Video"}
                        onPress={() => {}}
                      />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={styles.preViewBtn}
                        onPress={() => {}}
                      >
                        <Text style={styles.previewTxt}>Preview</Text>
                      </TouchableOpacity>
                      <View style={{ width: "80%" }}>
                        <DisplaySelectedImage fileName={"sssss"} from={"PAN"} />
                      </View>
                    </View>
                  </>
                </View>
              </List.Accordion>

              <Button title="Submit" onPress={handleSubmit} />
            </List.AccordionGroup>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CampaignFormScreen;

const styles = StyleSheet.create({
  accordianBorder: {
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
  select_image_bck_vw: {
    minHeight: 50,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  preViewBtn: {
    width: "20%",
    height: 30,
    backgroundColor: Colors.SKY_BLUE,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  previewTxt: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: "600",
  },
  selectedImageBckVw: {
    paddingLeft: 12,
    paddingRight: 10,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  selectedImageTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    width: "80%",
    color: Colors.DARK_GRAY,
  },
});
