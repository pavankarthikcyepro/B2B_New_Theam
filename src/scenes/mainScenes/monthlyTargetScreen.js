/** @format */

import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { EventManagementTopTabNavigator } from "../../navigations/eventManagementTopTabNavigator";


import {
  CallUserComponent,
  SortAndFilterComp,
  DateRangeComp,
  DatePickerComponent,
  DropDownComponant,
  TextinputComp,
} from "../../components";
import { getPreEnquiryData,
  setPreEnquiryList,moremainListApi,mainListApi
  ,} from "../../redux/monthlyTargetReducer"
import { MonthlyTargetTopTabNavigator } from "../../navigations/monthlyTargetTopTabNavigator";
import { useDispatch, useSelector } from "react-redux";

import * as AsyncStore from "../../asyncStore";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";

const MonthlyTargetScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.eventmanagementReducer);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    branchId: "",
    orgId: "",
    employeeId: "",
    employeeName: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
 const [employeeId, setEmployeeId] = useState("");
  const [datePickerId, setDatePickerId] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  useEffect(() => {
    // Get Data From Server
    const currentDate = moment().add(0, "day").format(dateFormat);
    const lastMonthFirstDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .startOf("month")
      .format(dateFormat);
    setSelectedFromDate(lastMonthFirstDate);
    const tomorrowDate = moment().add(1, "day").format(dateFormat);
    setSelectedToDate(tomorrowDate);
    getAsyncData(lastMonthFirstDate, tomorrowDate);
  }, []);

const getPreEnquiryListFromDB = () => {
  const data = realm.objects("PRE_ENQUIRY_TABLE");
  dispatch(setPreEnquiryList(JSON.stringify(data)));
};
  const getAsyncstoreData = async (startDate, endDate) => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({
        branchId: jsonObj.branchId,
        orgId: jsonObj.orgId,
        employeeId: jsonObj.empId,
        employeeName: jsonObj.empName,
      });
      getEventListDataFromServer(
        jsonObj.empId,
        jsonObj.branchId,
        jsonObj.orgId,
        startDate,
        endDate
      );
    }
  };
   const getAsyncData = async (startDate, endDate) => {
     let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
     if (empId) {
       getPreEnquiryListFromServer(empId, startDate, endDate);
       setEmployeeId(empId);
     }
   };
  
const getPreEnquiryListFromServer = (empId, startDate, endDate) => {
  const payload = getPayloadData(empId, startDate, endDate, 0);
  dispatch(mainListApi(payload));
};

const getPayloadData = (
  empId,
  startDate,
  endDate,
  offSet,
  modelFilters = [],
  categoryFilters = [],
  sourceFilters = []
) => {
  const payload = {
    startdate: startDate,
    enddate: endDate,
    model: modelFilters,
    categoryType: categoryFilters,
    sourceOfEnquiry: sourceFilters,
    empId: empId,
    status: "MONTHLTARGET",
    offset: offSet,
    limit: 10,
  };
  return payload;
};

    const getMorePreEnquiryListFromServer = async () => {
      if (selector.isLoadingExtraData) {
        return;
      }
      if (employeeId && selector.pageNumber + 1 < selector.totalPages) {
        const payload = getPayloadData(
          employeeId,
          selectedFromDate,
          selectedToDate,
          selector.pageNumber + 1
        );
        dispatch(moremainListApi(payload));
      }
    };
  // const getEventListDataFromServer = (
  //   empId,
  //   branchId,
  //   orgId,
  //   startDate,
  //   endDate
  // ) => {
  //   if (empId) {
  //     const payload = {
  //       startDate: startDate,
  //       endDate: endDate,
  //       managerId: empId,
  //       pageNo: 0,
  //       branchId: branchId,
  //       orgId: orgId,
  //     };
  //     dispatch(getEventsListApi(payload));
  //     dispatch(getPendingEventListApi(payload));
  //     dispatch(getUpcomingEventListApi(payload));
  //   }
  // };

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key);
  };

  const updateSelectedDate = (date, key) => {
    const formatDate = moment(date).format(dateFormat);
    switch (key) {
      case "FROM_DATE":
        setSelectedFromDate(formatDate);
        getPreEnquiryListFromServer(employeeId, formatDate, selectedToDate);
        break;
      case "TO_DATE":
        setSelectedToDate(formatDate);
        getPreEnquiryListFromServer(employeeId, selectedFromDate, formatDate);
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
          console.log("date: ", selectedDate);
          setShowDatePicker(false);
          if (Platform.OS === "android") {
            if (selectedDate) {
              updateSelectedDate(selectedDate, datePickerId);
            }
          } else {
            updateSelectedDate(selectedDate, datePickerId);
          }
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

        <View style={styles.view2}>
          <TextinputComp label={"Retail Target"} />
        </View>
      </View>
      <MonthlyTargetTopTabNavigator />
      <View style={styles.container}>
       
      </View>
    </SafeAreaView>
  );
};

export default MonthlyTargetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  view1: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  view2: {
    height: 50,
    width: 152,
    paddingHorizontal: 6,
  },
});
