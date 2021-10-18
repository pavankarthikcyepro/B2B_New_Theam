import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, FlatList, Text, RefreshControl, ActivityIndicator } from "react-native";
import { ComplaintsTopTabNavigator } from "../../navigations/complaintsTopTabNavigator";
import { DateRangeComp, DatePickerComponent } from '../../components';
import { ComplaintsItem, EmptyListView } from "../../pureComponents";
import { useDispatch, useSelector } from "react-redux";
import * as AsyncStore from "../../asyncStore";
import moment from "moment";
import { getComplaintsListApi, getMoreComplaintsListApi } from "../../redux/complaintsReducer";
import { Colors } from "../../styles";
import { callNumber, sendEmail } from "../../utils/helperFunctions";
import { showToastSucess } from "../../utils/toast";

const ComplaintsScreen = ({ navigation }) => {

  const selector = useSelector((state) => state.complaintsReducer);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "" })
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  useEffect(() => {

    getAsyncstoreData();

    // Get Data From Server
    const currentDate = moment().format("DD/MM/YYYY");
    setSelectedFromDate(currentDate);
    setSelectedToDate(currentDate);
  }, []);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({ branchId: jsonObj.branchId, orgId: jsonObj.orgId, employeeId: jsonObj.empId, employeeName: jsonObj.empName });

      const currentDate = moment().format("YYYY-MM-DD");
      console.log("date: ", currentDate); // 2021-09-01
      getComplaintsListFromServer(jsonObj.empId)

    }
  }

  const getComplaintsListFromServer = async (empId) => {

    const payload = {
      "groupBy": [],
      "orderBy": [],
      "pageNo": selector.page_number,
      "size": 5,
      "orderByType": "asc",
      "reportIdentifier": "1215",
      "paginationRequired": true,
      "empId": empId
    }
    dispatch(getComplaintsListApi(payload));
  }

  const getMoreComplaintsListFromServer = (empId) => {

    if (selector.total_objects_count < selector.complaints_list.length) {
      const payload = {
        "groupBy": [],
        "orderBy": [],
        "pageNo": selector.page_number + 1,
        "size": 5,
        "orderByType": "asc",
        "reportIdentifier": "1215",
        "paginationRequired": true,
        "empId": empId
      }
      dispatch(getMoreComplaintsListApi(payload));
    }
  }

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key);
  }

  const updateSelectedDate = (date, key) => {

    const formatDate = moment(date).format("DD/MM/YYYY");
    const payloadDate = moment(date).format("YYYY-DD-MM");
    switch (key) {
      case "FROM_DATE":
        setSelectedFromDate(formatDate);
        const formatToDate = moment(selectedToDate, "DD/MM/YYYY").format("YYYY-MM-DD");
        console.log("format formatToDate: ", formatToDate)
        break;
      case "TO_DATE":
        setSelectedToDate(formatDate);
        const formatFromDate = moment(selectedFromDate, "DD/MM/YYYY").format("YYYY-MM-DD");
        break;
    }
  }

  const clickedOnEmail = (email) => {

    if (!email) {
      return;
    }

    sendEmail(
      email,
      'Test Subject',
      'Test body',
      { cc: '' }
    ).then(() => {
      console.log('Your message was successfully sent!');
      showToastSucess("Your message was successfully sent!")
    });
  }

  const renderFooter = () => {
    if (!selector.isExtraLoading) { return null }
    return (
      <View style={styles.footer}>
        <Text style={styles.btnText}>Loading More...</Text>
        <ActivityIndicator color={Colors.GRAY} />
      </View>
    );
  };

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
      {/* <ComplaintsTopTabNavigator /> */}
      {selector.complaints_list.length === 0 ? (<EmptyListView title={"No Data Found"} isLoading={selector.isLoading} />) : (
        <View style={styles.view2}>
          <FlatList
            data={selector.complaints_list}
            extraData={selector.complaints_list}
            refreshControl={(
              <RefreshControl
                refreshing={selector.isLoading}
                onRefresh={() => getComplaintsListFromServer(userData.employeeId)}
                progressViewOffset={200}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0}
            onEndReached={getMoreComplaintsListFromServer(userData.employeeId)}
            ListFooterComponent={renderFooter}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator}></View>;
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={[styles.listBgVw]}>
                  <ComplaintsItem
                    complaintFactor={item["Complaint Factor"]}
                    name={item["Customer Name"]}
                    mobile={item["Mobile No."]}
                    email={item["E-Mail"]}
                    model={item["Model"]}
                    source={item["Closing Source"]}
                    status={item["Status"]}
                    onCallPress={() => callNumber(item["Mobile No."])}
                    onEmailPress={() => clickedOnEmail(item["E-Mail"])}
                  />
                </View>
              );
            }}
          />
        </View>
      )}

    </SafeAreaView>
  );
};

export default ComplaintsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  view1: {
    paddingHorizontal: 30,
    paddingVertical: 10
  },
  view2: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  listBgVw: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
  },
  separator: {
    height: 10,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: Colors.GRAY,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5
  },
})