import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp } from "../../../components";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import { DropDownSelectionItem } from "../../../pureComponents/dropDownSelectionItem";
import { DropDownComponant, DatePickerComponent } from "../../../components";
import {
  setDatePicker,
  setEnquiryFollowUpDetails,
  updateSelectedDate,
  setDropDownData,
} from "../../../redux/enquiryFollowUpReducer";

import { DateSelectItem } from "../../../pureComponents";
import { Dropdown } from "sharingan-rn-modal-dropdown";

const ScreenWidth = Dimensions.get("window").width;

const data = [
  {
    value: "1",
    label: "Tiger Nixon",
    employee_salary: "320800",
    employee_age: "61",
  },
  {
    value: "2",
    label: "Garrett Winters",
    employee_salary: "170750",
    employee_age: "63",
  },
  {
    value: "3",
    label: "Ashton Cox",
    employee_salary: "86000",
    employee_age: "66",
  },
];
const EnquiryFollowUpScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.enquiryFollowUpReducer);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={[styles.container]}>
      {selector.showDatepicker && (
        <DatePickerComponent
          visible={selector.showDatepicker}
          mode={"time"}
          value={new Date(Date.now())}
          onChange={(event, selectedDate) => {
            console.log("date: ", selectedDate);
            if (Platform.OS === "android") {
              //setDatePickerVisible(false);
            }
            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
          }}
          onRequestClose={() => dispatch(setDatePicker())}
        />
      )}

      <View style={[{ padding: 15 }, GlobalStyle.shadow]}>
        <View style={styles.drop_down_view_style}>
          <Dropdown
            label="Model"
            data={selector.dropDownData}
            required={true}
            floating={true}
            color={Colors.RED}
            value={selector.model}
            onChange={(value) =>
              dispatch(setDropDownData({ key: "MODEL", value: value }))
            }
          />
        </View>
        <View style={styles.drop_down_view_style}>
          <Dropdown
            label="Varient"
            data={selector.dropDownData}
            required={true}
            floating={true}
            value={selector.Varient}
            onChange={(value) =>
              dispatch(setDropDownData({ key: "VARIENT", value: value }))
            }
          />
        </View>

        <TextinputComp
          style={styles.textInputStyle}
          label={"Reason"}
          value={selector.reason}
          onChangeText={(text) => {
            dispatch(setEnquiryFollowUpDetails({ key: "REASON", text: text }));
          }}
        />
        <Text style={GlobalStyle.underline}></Text>
        <TextinputComp
          style={styles.textInputStyle}
          label={"Customer Remarks"}
          value={selector.customer_remarks}
          onChangeText={(text) =>
            dispatch(
              setEnquiryFollowUpDetails({
                key: "CUSTOMER_REMARKS",
                text: text,
              })
            )
          }
        />
        <Text style={GlobalStyle.underline}></Text>
        <TextinputComp
          style={styles.textInputStyle}
          label={"Employee Remarks*"}
          value={selector.employee_remarks}
          onChangeText={(text) =>
            dispatch(
              setEnquiryFollowUpDetails({
                key: "EMPLOYEE_REMARKS",
                text: text,
              })
            )
          }
        />
        <Text style={GlobalStyle.underline}></Text>
        <DateSelectItem
          label={"Actual Start Time"}
          value={selector.actual_start_time}
          onPress={() => dispatch(setDatePicker("ACTUAL_START_TIME"))}
        />
        <Text style={GlobalStyle.underline}></Text>
        <DateSelectItem
          label={"Actual End Time"}
          value={selector.actual_end_time}
          onPress={() => dispatch(setDatePicker("ACTUAL_END_TIME"))}
        />
        <Text style={GlobalStyle.underline}></Text>
      </View>

      <View style={styles.view1}>
        <Button
          style={{ width: 120 }}
          mode="contained"
          color={Colors.RED}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Update
        </Button>
        <Button
          style={{ width: 120 }}
          mode="contained"
          color={Colors.RED}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Close
        </Button>
      </View>
      <View style={styles.view1}>
        <Button
          style={{ width: 120 }}
          mode="contained"
          color={Colors.RED}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Cancel
        </Button>
        <Button
          style={{ width: 120 }}
          mode="contained"
          color={Colors.RED}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Reschedule
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default EnquiryFollowUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  view1: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  drop_down_view_style: {
    height: 65,
    width: "100%",
    backgroundColor: Colors.WHITE,
  },
});
