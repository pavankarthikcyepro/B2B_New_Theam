import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View, Text, ScrollView } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
} from "../../../components";
import {
  setDatePicker,
  setTestDriveDetails,
  updateSelectedDropDownData,
  updateSelectedDate,
  setDropDownData,
} from "../../../redux/testDriveReducer";
import { DateSelectItem, RadioTextItem } from "../../../pureComponents";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { RadioButton } from "react-native-paper";
import { Button } from "react-native-paper";


const TestDriveScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.testDriveReducer);
  const [checked, setChecked] = React.useState("first");

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>

      {selector.showDatepicker && (
        <DatePickerComponent
          visible={selector.showDatepicker}
          mode={selector.date_picker_mode}
          value={new Date(Date.now())}
          onChange={(event, selectedDate) => {
            console.log("date: ", selectedDate);
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
          onRequestClose={() => dispatch(updateSelectedDate({ key: "NONE", text: "" }))}
        />
      )}

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
              value={selector.mobile}
              label={"Mobile Number"}
              keyboardType={"phone-pad"}
              onChangeText={(text) =>
                dispatch(setTestDriveDetails({ key: "MOBILE", text: text }))
              }
            />
            <Text style={GlobalStyle.underline}></Text>
            <TextinputComp
              style={{ height: 65, width: "100%" }}
              value={selector.name}
              label={"Name"}
              keyboardType={"default"}
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
            <Dropdown
              label="Model"
              data={selector.drop_down_data}
              floating={true}
              value={selector.model}
              onChange={(value) =>
                dispatch(setDropDownData({ key: "MODEL", value: value }))
              }
            />
            <Dropdown
              label="Fuel Type"
              data={selector.drop_down_data}
              floating={true}
              value={selector.fuel_type}
              onChange={(value) =>
                dispatch(setDropDownData({ key: "FUEL_TYPE", value: value }))
              }
            />
            <Dropdown
              label="Transmission Type"
              data={selector.drop_down_data}
              floating={true}
              value={selector.transmission_type}
              onChange={(value) =>
                dispatch(setDropDownData({ key: "TRANSMISSION_TYPE", value: value }))
              }
            />
            <Dropdown
              label="Varient"
              data={selector.drop_down_data}
              floating={true}
              value={selector.varient}
              onChange={(value) =>
                dispatch(setDropDownData({ key: "VARIENT", value: value, }))
              }
            />
            <Text style={{ padding: 10, justifyContent: "center" }}>
              {"Choose address:"}
            </Text>
            <View style={{ flexDirection: "row", paddingLeft: 12, paddingBottom: 5 }}>
              <RadioTextItem
                label={"Showroom address"}
                value={"Showroom address"}
                status={selector.address_type_is_showroom === "true" ? true : false}
                onPress={() => dispatch(setTestDriveDetails({ key: "CHOOSE_ADDRESS", text: "true", }))}
              />
              <RadioTextItem
                label={"Customer address"}
                value={"Customer address"}
                status={selector.address_type_is_showroom === "false" ? true : false}
                onPress={() => dispatch(setTestDriveDetails({ key: "CHOOSE_ADDRESS", text: "false", }))}
              />
            </View>

            <Text style={GlobalStyle.underline}></Text>
            <Text style={{ padding: 10 }}>
              {"Do Customer have Driving License?"}
            </Text>
            <View style={{ flexDirection: "row", paddingLeft: 12, paddingBottom: 5 }}>
              <RadioTextItem
                label={"Yes"}
                value={"Yes"}
                status={selector.customer_having_driving_licence === "true" ? true : false}
                onPress={() => dispatch(setTestDriveDetails({ key: "CUSTOMER_HAVING_DRIVING_LICENCE", text: "true", }))}
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
              onPress={() => dispatch(setDatePicker({ key: "PREFERRED_DATE", mode: "date" }))}
            />
            <Dropdown
              label="List of DSE employees:"
              data={selector.drop_down_data}
              floating={true}
              value={selector.selected_dse_employee}
              onChange={(value) =>
                dispatch(
                  setDropDownData({ key: "LIST_OF_DSE_EMPLOYEES", value: value })
                )
              }
            />
            <Dropdown
              label="List of Drivers:"
              data={selector.drop_down_data}
              floating={true}
              value={selector.selected_driver}
              onChange={(value) =>
                dispatch(
                  setDropDownData({ key: "LIST_OF_DRIVERS", value: value })
                )
              }
            />
            <DateSelectItem
              label={"Customer Preffered Time (24 hours Format)"}
              value={selector.customer_preferred_time}
              onPress={() => dispatch(setDatePicker({ key: "CUSTOMER_PREFERRED_TIME", mode: "time" }))}
            />
            <DateSelectItem
              label={"Actual start Time (24 hours Format)"}
              value={selector.actual_start_time}
              onPress={() => dispatch(setDatePicker({ key: "ACTUAL_START_TIME", mode: "time" }))}
            />
            <DateSelectItem
              label={"Actual End Time (24 hours Format)"}
              value={selector.actual_end_time}
              onPress={() => dispatch(setDatePicker({ key: "ACTUAL_END_TIME", mode: "time" }))}
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
});
