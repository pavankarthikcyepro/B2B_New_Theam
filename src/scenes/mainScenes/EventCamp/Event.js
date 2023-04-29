import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  Keyboard,
} from "react-native";
import { List, TextInput } from "react-native-paper";
import DropDown from "react-native-element-dropdown";
import { Colors } from "../../../styles";
import { StyleSheet } from "react-native";
import { TextinputComp } from "../../../components";

const EventFormScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = () => {
    // Handle login logic here
  };
  const handleSubmit = () => {
    // handle form submission logic
  };
  const updateAccordian = (selectedIndex) => {
    Keyboard.dismiss();
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
    }
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <List.AccordionGroup
            expandedId={openAccordian}
            onAccordionPress={(expandedId) => updateAccordian(expandedId)}
          >
            <List.Accordion
              id="1"
              title="Event Schedule"
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
              left={(props) => (
                <List.Icon color={Colors.RED} {...props} icon="calendar" />
              )}
            >
              <TextinputComp
                style={styles.textInputStyle}
                label="Event Number*"
                value={eventNumber}
                onChangeText={(text) => setEventNumber(text)}
              />
              <TextinputComp
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
              {/* <DropDown
              label="Event Planner-location*"
              data={["Option 1", "Option 2", "Option 3"]} // replace with your data
              onSelect={(value) => setEventPlannerLocation(value)}
            />
            <DropDown
              label="Event Planner - Dealer Code*"
              data={["Option 1", "Option 2", "Option 3"]} // replace with your data
              onSelect={(value) => setEventPlannerCode(value)}
            /> */}
              <TextinputComp
                style={styles.textInputStyle}
                label="PinCode*"
                value={pinCode}
                onChangeText={(text) => setPinCode(text)}
              />
              {/* <DropDown
              label="Event Type*"
              data={["Option 1", "Option 2", "Option 3"]} // replace with your data
              onSelect={(value) => setEventType(value)}
            />
            <DropDown
              label="Event Category*"
              data={["Option 1", "Option 2", "Option 3"]} // replace with your data
              onSelect={(value) => setEventCategory(value)}
            /> */}
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
              <TextinputComp
                style={styles.textInputStyle}
                label="Event Start Date*"
                value={eventStartDate}
                onChangeText={(text) => setEventStartDate(text)}
              />
              <TextinputComp
                style={styles.textInputStyle}
                label="Event End Date*"
                value={eventEndDate}
                onChangeText={(text) => setEventEndDate(text)}
              />
            </List.Accordion>
            <List.Accordion
              id="2"
              title="Demo Vehicles list"
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
              left={(props) => (
                <List.Icon color={Colors.RED} {...props} icon="car" />
              )}
            >
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
            </List.Accordion>
            <List.Accordion
              id="3"
              title="Employee List"
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
              left={(props) => (
                <List.Icon color={Colors.RED} {...props} icon="account-group" />
              )}
            >
              <View>
                {/* <DropDown
                placeholder="Manager Name"
                data={["Option 1", "Option 2", "Option 3"]} // replace with your data
                onChange={(value) => setManager(value)}
              /> */}
              </View>
              {/* <View>
              <DropDown
                label="Manager Name"
                data={["Option 1", "Option 2", "Option 3"]} // replace with your data
                onSelect={(value) => setManager(value)}
              />
              <DropDown
                label="TL Name"
                data={["Option 1", "Option 2", "Option 3"]} // replace with your data
                onSelect={(value) => setTl(value)}
              />
              <DropDown
                label="Consultant Name"
                data={["Option 1", "Option 2", "Option 3"]} // replace with your data
                onSelect={(value) => setConsultant(value)}
              />
              <DropDown
                label="Driver Name"
                data={["Option 1", "Option 2", "Option 3"]} // replace with your data
                onSelect={(value) => setDriver(value)}
              />
              <DropDown
                label="Finance Executive Name"
                data={["Option 1", "Option 2", "Option 3"]} // replace with your data
                onSelect={(value) => setFinanceExecutive(value)}
              />
              <DropDown
                label="Evaluator Name"
                data={["Option 1", "Option 2", "Option 3"]} // replace with your data
                onSelect={(value) => setEvaluator(value)}
              />
            </View> */}
            </List.Accordion>
            <Button title="Submit" onPress={handleSubmit} />
          </List.AccordionGroup>
        </View>
      </ScrollView>
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
    marginVertical:2,
  },
});
