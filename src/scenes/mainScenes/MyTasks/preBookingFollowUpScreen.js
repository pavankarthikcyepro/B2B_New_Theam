import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp } from "../../../components";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import {
  setPreBookingFollowUpDetails,
  setDatePicker,
  updateSelectedDate,
} from "../../../redux/preBookingFollowUpReducer";
import { DatePickerComponent } from "../../../components";
import { DateSelectItem } from "../../../pureComponents";
const ScreenWidth = Dimensions.get("window").width;

const PreBookingFollowUpScreen = () => {

  const selector = useSelector((state) => state.preBookingFollowUpReducer);
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
              if (!selectedDate) {
                dispatch(
                  updateSelectedDate({ key: "NONE", text: selectedDate })
                );
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

      <View style={{ padding: 15 }}>
        <View style={[GlobalStyle.shadow, { backgroundColor: Colors.WHITE }]}>
          <TextinputComp
            style={styles.textInputStyle}
            label={"Reason"}
            value={selector.reason}
            onChangeText={(text) => {
              dispatch(
                setPreBookingFollowUpDetails({ key: "REASON", text: text })
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
                setPreBookingFollowUpDetails({
                  key: "CUSTOMER_REMARKS",
                  text: text,
                })
              )
            }
          />
          <Text style={GlobalStyle.underline}></Text>
          <TextinputComp
            style={styles.textInputStyle}
            label={"Employee Remarks"}
            value={selector.employee_remarks}
            onChangeText={(text) =>
              dispatch(
                setPreBookingFollowUpDetails({
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
      </View>

      <View style={styles.view1}>
        <Button
          mode="contained"
          color={Colors.RED}
          style={{ width: 120 }}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Update
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
      <View style={styles.view1}>
        <Button
          mode="contained"
          color={Colors.RED}
          style={{ width: 120 }}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          color={Colors.RED}
          style={{ width: 120 }}
          labelStyle={{ textTransform: "none" }}
          onPress={() => console.log("Pressed")}
        >
          Reschedule
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PreBookingFollowUpScreen;

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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
