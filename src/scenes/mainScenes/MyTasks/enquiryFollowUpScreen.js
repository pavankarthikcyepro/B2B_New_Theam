import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp } from "../../../components";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import { DropDownSelectionItem } from "../../../pureComponents/dropDownSelectionItem";
import { DropDownComponant, DatePickerComponent } from "../../../components";
// import {
//   setDatePicker,
//   setEnquiryFollowUpDetails,
//   updateSelectedDropDownData,
//   updateSelectedDate,
//   setDropDownData,
// } from "../../../redux/enquiryFollowUpReducer";
import {
  setDatePicker,
  setEnquiryFollowUpDetails,
  updateSelectedDropDownData,
  updateSelectedDate,
  setDropDownData,
} from "../../../redux/preBookingFormReducer";
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
  const [text, setText] = React.useState("");
  const selector = useSelector((state) => state.enquiryFollowUpReducer);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={[styles.container]}>
      {selector.showDatepicker && (
        <DatePickerComponent
          visible={selector.showDatepicker}
          mode={"date"}
          value={new Date(Date.now())}
          onChange={(event, selectedDate) => {
            console.log("date: ", selectedDate);
            if (Platform.OS === "android") {
              // setDatePickerVisible(false)
            }
            dispatch(updateSelectedDate({ key: "", text: selectedDate }));
          }}
          onRequestClose={() => dispatch(setDatePicker())}
        />
      )}

      <View style={{ padding: 15 }}>
        <View
          style={[
            GlobalStyle.shadow,
            { backgroundColor: Colors.WHITE, width: "100%" },
          ]}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              height: 65,
              backgroundColor: Colors.RED,
            }}
          >
            {/* <Dropdown
              label="Model"
              data={selector.dropDownData}
              required={true}
              floating={true}
              value={selector.model}
              onChange={(value) =>
                dispatch(setDropDownData({ key: "MODEL", value: value }))
              }
            /> */}
          </View>
          <TextinputComp
            style={styles.textInputStyle}
            label={"Reason"}
            value={selector.reason}
            onChangeText={(text) => {
              dispatch(
                setEnquiryFollowUpDetails({ key: "REASON", text: text })
              );
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
            value={selector.actualStartTime}
            onPress={() => dispatch(setDatePicker("ACTUAL_START_TIME"))}
          />
          <DateSelectItem
            label={"Actual End Time"}
            value={selector.actualEndTime}
            onPress={() => dispatch(setDatePicker("ACTUAL_END_TIME"))}
          />
        </View>
      </View>

      <View style={styles.view1}>
        <Button
          mode="contained"
          color={Colors.RED}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Update
        </Button>
        <Button
          mode="contained"
          color={Colors.RED}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Close
        </Button>
        <Button
          mode="contained"
          color={Colors.RED}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Cancel
        </Button>
        <Button
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
  container1: {
    paddingTop: 30,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
  },

  view1: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  drop_down_view_style: {
    paddingTop: 5,
    height: 65,
    width: "100%",
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
