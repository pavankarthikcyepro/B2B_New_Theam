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
} from "../../../redux/preBookingFormReducer";
import { DateSelectItem } from "../../../pureComponents";

import { Dropdown } from "sharingan-rn-modal-dropdown";
import { RadioButton } from "react-native-paper";
import { Button } from "react-native-paper";


const TestDriveScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.preBookingFormReducer);
  const [checked, setChecked] = React.useState("first");

  const [valueSS, setValueSS] = useState("");
  const onChangeSS = (value) => {
    setValueSS(value);
  };

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
      {selector.showDropDownpicker && (
        <DropDownComponant
          visible={selector.showDropDownpicker}
          headerTitle={selector.dropDownTitle}
          data={selector.dropDownData}
          keyId={selector.dropDownKeyId}
          selectedItems={(item, keyId) => {
            console.log("selected: ", item, keyId);
            dispatch(
              updateSelectedDropDownData({
                id: item.id,
                name: item.name,
                keyId: keyId,
              })
            );
          }}
        />
      )}

      {selector.showDatepicker && (
        <DatePickerComponent
          visible={selector.showDatepicker}
          mode={"date"}
          value={new Date(Date.now())}
          onChange={(event, selectedDate) => {
            console.log("date: ", selectedDate);
            if (Platform.OS === "android") {
            }
            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
          }}
          onRequestClose={() => dispatch(setDatePicker())}
        />
      )}

      {/* // 1. Test Drive */}
      <ScrollView
        automaticallyAdjustContentInsets={true}
        bounces={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10 }}
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
            <View style={styles.drop_down_view_style}>
              <TextinputComp
                style={{ height: 65, width: "100%" }}
                value={selector.mobile}
                label={"Mobile Number"}
                keyboardType={"numeric"}
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
                data={selector.dropDownData}
                floating={true}
                value={""}
                onChange={(value) =>
                  dispatch(setDropDownData({ key: "Model", value: value }))
                }
              />
              <Dropdown
                label="Fuel Type"
                data={selector.dropDownData}
                floating={true}
                value={""}
                onChange={(value) =>
                  dispatch(setDropDownData({ key: "Fuel Type", value: value }))
                }
              />
              <Dropdown
                label="Transmission Type"
                data={selector.dropDownData}
                floating={true}
                value={""}
                onChange={(value) =>
                  dispatch(
                    setDropDownData({
                      key: "Transmission Type",
                      value: value,
                    })
                  )
                }
              />
              <Dropdown
                label="Varient"
                data={selector.dropDownData}
                floating={true}
                value={""}
                onChange={(value) =>
                  dispatch(
                    setDropDownData({
                      key: "Varient",
                      value: value,
                    })
                  )
                }
              />
            </View>
            <Text style={{ padding: 10, justifyContent: "center" }}>
              {"Choose address:"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <RadioButton
                value="first"
                status={checked === "first" ? "checked" : "unchecked"}
                onPress={() => setChecked("first")}
              />
              <Text style={{ marginTop: 8 }}>{"Showroom address"}</Text>
              <RadioButton
                value="second"
                status={checked === "second" ? "checked" : "unchecked"}
                onPress={() => setChecked("second")}
              />
              <Text style={{ marginTop: 8 }}>{"Customer address"}</Text>
            </View>

            <Text style={GlobalStyle.underline}></Text>
            <Text style={{ padding: 10 }}>
              {"Do Customer have Driving License?"}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <RadioButton
                value="Third"
                status={checked === "Third" ? "checked" : "unchecked"}
                onPress={() => setChecked("Third")}
              />
              <Text style={{ marginTop: 8 }}>{"Yes"}</Text>
              <RadioButton
                value="Fourth"
                status={checked === "Fourth" ? "checked" : "unchecked"}
                onPress={() => setChecked("Fourth")}
              />
              <Text style={{ marginTop: 8 }}>{"No"}</Text>
            </View>
            <Text style={GlobalStyle.underline}></Text>
            <DateSelectItem
              label={"Customer Preffered Date"}
              value={selector.date_of_birth}
              onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
            />

            <Dropdown
              label="List of DSE employees:"
              data={selector.dropDownData}
              floating={true}
              value={""}
              onChange={(value) =>
                dispatch(
                  setDropDownData({
                    key: "List of DSE employees",
                    value: value,
                  })
                )
              }
            />
            <Dropdown
              label="List of Drivers:"
              data={selector.dropDownData}
              floating={true}
              value={"EEDURA GANESH"}
              onChange={(value) =>
                dispatch(
                  setDropDownData({
                    key: "List of Drivers",
                    value: value,
                  })
                )
              }
            />
            <DateSelectItem
              label={"Customer Preffered Time (24 hours Format)"}
              value={selector.date_of_birth}
              onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
            />
            <DateSelectItem
              label={"Actual start Time (24 hours Format)"}
              value={selector.date_of_birth}
              onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
            />
            <DateSelectItem
              label={"Actual End Time (24 hours Format)"}
              value={selector.date_of_birth}
              onPress={() => dispatch(setDatePicker("DATE_OF_BIRTH"))}
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
            color={Colors.RED}
            labelStyle={{ textTransform: "none" }}
            onPress={() => console.log("Pressed")}
          >
            Submit
          </Button>
          <Button
            mode="contained"
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
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
