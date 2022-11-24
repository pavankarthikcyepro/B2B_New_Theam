import moment from "moment";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import * as AsyncStore from "../../../asyncStore";
import { DatePickerComponent } from "../../../components";
import { DateSelectItem } from "../../../pureComponents";
import { Colors } from "../../../styles";

const dateFormat = "YYYY-MM-DD";

const MyTaskFilterScreen = ({ navigation }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    const currentDate = moment().format(dateFormat);
    const monthFirstDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .startOf("month")
      .format(dateFormat);
    const monthLastDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .endOf("month")
      .format(dateFormat);
    setFromDate(monthFirstDate);
    setToDate(monthLastDate);
  }, []);
  
  // get loggedIn user data
  useEffect(async() => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = await JSON.parse(employeeData);
      if (jsonObj?.hrmsRole.toLowerCase().includes("manager")) {
        setIsManager(true);
      }
    }
  }, []);

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key);
  };

  const updateSelectedDate = (date, key) => {
    const formatDate = moment(date).format(dateFormat);
    switch (key) {
      case "FROM_DATE":
        setFromDate(formatDate);
        break;
      case "TO_DATE":
        setToDate(formatDate);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {
          if (Platform.OS === "android") {
            if (selectedDate) {
              updateSelectedDate(selectedDate, datePickerId);
            }
          } else {
            updateSelectedDate(selectedDate, datePickerId);
          }
          setShowDatePicker(false);
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />

      <View style={styles.subContainer}>
        <View style={styles.topDateContainer}>
          <View style={{ width: "48%" }}>
            <DateSelectItem
              label={"From Date"}
              value={fromDate}
              onPress={() => showDatePickerMethod("FROM_DATE")}
            />
          </View>

          <View style={{ width: "48%" }}>
            <DateSelectItem
              label={"To Date"}
              value={toDate}
              onPress={() => showDatePickerMethod("TO_DATE")}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  subContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.WHITE,
  },
  topDateContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 5,
    borderColor: Colors.BORDER_COLOR,
    borderWidth: 1,
  },
});

export default MyTaskFilterScreen;

