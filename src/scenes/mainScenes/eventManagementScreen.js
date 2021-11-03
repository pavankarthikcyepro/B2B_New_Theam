import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { EventManagementTopTabNavigator } from "../../navigations/eventManagementTopTabNavigator";
import { DateRangeComp } from "../../components/dateRangeComp";
import { DatePickerComponent } from "../../components";
import { getEventsListApi, getPendingEventListApi, getUpcomingEventListApi } from "../../redux/eventManagementReducer";
import { useDispatch, useSelector } from "react-redux";
import * as AsyncStore from "../../asyncStore";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";

const EventManagementScreen = ({ navigation }) => {

  const selector = useSelector((state) => state.eventmanagementReducer);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "" })
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  useEffect(() => {

    // Get Data From Server
    const currentDate = moment().format(dateFormat)
    const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(1, 'months').startOf('month').format(dateFormat);
    setSelectedFromDate(lastMonthFirstDate);
    setSelectedToDate(currentDate);
    getAsyncstoreData(lastMonthFirstDate, currentDate);
  }, []);

  const getAsyncstoreData = async (startDate, endDate) => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName });
      getEventListDataFromServer(jsonObj.empId, jsonObj.branchId, jsonObj.orgId, startDate, endDate)
    }
  }

  const getEventListDataFromServer = (empId, branchId, orgId, startDate, endDate) => {
    if (empId) {
      const payload = {
        startDate: startDate,
        endDate: endDate,
        managerId: empId,
        pageNo: 0,
        branchId: branchId,
        orgId: orgId
      }
      dispatch(getEventsListApi(payload));
      dispatch(getPendingEventListApi(payload));
      dispatch(getUpcomingEventListApi(payload));
    }
  }

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key);
  }

  const updateSelectedDate = (date, key) => {

    const formatDate = moment(date).format(dateFormat);
    switch (key) {
      case "FROM_DATE":
        setSelectedFromDate(formatDate);
        getEventListDataFromServer(userData.employeeId, userData.branchId, userData.orgId, formatDate, formatToDate);
        break;
      case "TO_DATE":
        setSelectedToDate(formatDate);
        getEventListDataFromServer(userData.employeeId, userData.branchId, userData.orgId, formatFromDate, formatDate)
        break;
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {
          console.log("date: ", selectedDate);
          if (Platform.OS === "android") {
            if (selectedDate) {
              updateSelectedDate(selectedDate, datePickerId);
            }
          } else {
            updateSelectedDate(selectedDate, datePickerId);
          }
          setShowDatePicker(false)
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />

      <View style={styles.view1}>
        <DateRangeComp
          fromDate={selectedFromDate}
          toDate={selectedToDate}
          fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
          toDateClicked={() => showDatePickerMethod("TO_DATE")}
        />
      </View>
      <EventManagementTopTabNavigator />
    </SafeAreaView>
  );
};

export default EventManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  view1: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});
