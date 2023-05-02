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
import { DataTable, List } from "react-native-paper";
import { Colors } from "../../../styles";
import { StyleSheet } from "react-native";
import { DatePickerComponent, TextinputComp } from "../../../components";
import { Dropdown } from "react-native-element-dropdown";
import { DateSelectItem } from "../../../pureComponents";
import { FloatingModal } from "./Component/FloatingModal";
import { SafeAreaView } from "react-native-safe-area-context";
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

const EventFormScreen = () => {
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
                title={"Event Schedule"}
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
                    label={"Event Number*"}
                    value={eventNumber}
                    onChangeText={(text) => {
                      console.log("tee", text);
                      setEventNumber(text);
                    }}
                  />
                  <TextinputComp
                    key={"2"}
                    style={styles.textInputStyle}
                    label="Event Name*"
                    value={eventName}
                    onChangeText={(text) => setEventName(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="Event Organiser*"
                    value={eventOrganiser}
                    onChangeText={(text) => setEventOrganiser(text)}
                  />
                  <Dropdown
                    placeholder="Event Planner-location*"
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
                    placeholder="Event Planner - Dealer Code*"
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
                    label="PinCode*"
                    value={pinCode}
                    onChangeText={(text) => setPinCode(text)}
                  />
                  <Dropdown
                    placeholder="Event Type*"
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
                  <Dropdown
                    placeholder="Event Category*"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setEventCategory(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={eventArea}
                    label={"Event Area*"}
                    onChangeText={(text) => setEventArea(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="Event Location*"
                    value={eventLocation}
                    onChangeText={(text) => setEventLocation(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="District*"
                    value={district}
                    onChangeText={(text) => setDistrict(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="State*"
                    value={state}
                    onChangeText={(text) => setState(text)}
                  />
                  {/* <TouchableOpacity
          style={styles.textInputStyle}
          label="Event Start Date*"
          value={eventStartDate}
          onChangeText={(text) => setEventStartDate(text)}
        /> */}
                  <DateSelectItem
                    label={"Event Start Date*"}
                    value={"nmnmn"}
                    onPress={() => {}}
                  />
                  <DateSelectItem
                    label={"Event End Date*"}
                    value={"nmnmn"}
                    onPress={() => {}}
                  />
                  {/* <TextinputComp
          style={styles.textInputStyle}
          label="Event End Date*"
          value={eventEndDate}
          onChangeText={(text) => setEventEndDate(text)}
        /> */}
                </View>
              </List.Accordion>

              <List.Accordion
                id={"2"}
                key={"2"}
                title={"Demo Vehicles list"}
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
                <>
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="RC.NO"
                    value={rcNumber}
                    onChangeText={(text) => setRcNumber(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="MODEL"
                    value={model}
                    onChangeText={(text) => setModel(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="VARIANT"
                    value={variant}
                    onChangeText={(text) => setVariant(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="COLOR"
                    value={color}
                    onChangeText={(text) => setColor(text)}
                  />
                  <TextinputComp
                    style={styles.textInputStyle}
                    label="FUEL TYPE"
                    value={fuelType}
                    onChangeText={(text) => setFuelType(text)}
                  />
                </>
              </List.Accordion>

              <List.Accordion
                id={"3"}
                key={"3"}
                title={"Employee List"}
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
                <>
                  <Dropdown
                    placeholder="Manager Name"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setManager(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <Dropdown
                    placeholder="TL Name"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setTl(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <Dropdown
                    placeholder="Consultant Name"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setConsultant(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <Dropdown
                    placeholder="Driver Name"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setDriver(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <Dropdown
                    placeholder="Finance Executive Name"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setFinanceExecutive(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                  <Dropdown
                    placeholder="Evaluator Name"
                    labelField="label"
                    valueField="value"
                    data={data}
                    onChange={(value) => setEvaluator(value)}
                    style={[styles.dropdownContainer]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                  />
                </>
              </List.Accordion>

              <List.Accordion
                id={"4"}
                key={"4"}
                title={"Item List"}
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
                  <ScrollView horizontal={true}>
                    <DataTable style={styles.table}>
                      <DataTable.Header>
                        <DataTable.Title style={styles.column}>
                          Name
                        </DataTable.Title>
                        <DataTable.Title style={styles.column}>
                          Office Allocated
                        </DataTable.Title>
                        <DataTable.Title style={styles.column}>
                          Remarks
                        </DataTable.Title>
                        <DataTable.Title style={styles.column}>
                          Quantity
                        </DataTable.Title>
                        <DataTable.Title style={styles.column}>
                          Cost
                        </DataTable.Title>
                        <DataTable.Title style={styles.column}>
                          Price
                        </DataTable.Title>
                      </DataTable.Header>
                      {ItemList.map((item, index) => {
                        return (
                          <DataTable.Row key={index}>
                            <DataTable.Cell style={styles.column}>
                              {item.Name}
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.column}>
                              {item["Office Allocated"]}
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.column}>
                              {item.Remarks}
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.column}>
                              {item.Quantity}
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.column}>
                              {"₹" + item.Cost}
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.column}>
                              {"₹" + item.Price}
                            </DataTable.Cell>
                          </DataTable.Row>
                        );
                      })}
                    </DataTable>
                  </ScrollView>
                  <Button
                    title="Add Item"
                    onPress={() => setModalVisible(true)}
                  />
                </View>
              </List.Accordion>

              <List.Accordion
                id={"5"}
                key={"5"}
                title={"Budget"}
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
                <TextinputComp
                  style={styles.textInputStyle}
                  label="Budget"
                  value={budget}
                  onChangeText={(text) => setBudget(text)}
                />
              </List.Accordion>

              <Button title="Submit" onPress={handleSubmit} />
            </List.AccordionGroup>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EventFormScreen;

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
});
