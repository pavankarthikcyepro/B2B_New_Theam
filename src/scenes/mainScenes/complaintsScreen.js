import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, FlatList, Text, RefreshControl } from "react-native";
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
import AnimLoaderComp from "../../components/AnimLoaderComp";

const dateFormat = "YYYY-MM-DD"

const ComplaintsScreen = ({ navigation }) => {

  const selector = useSelector((state) => state.complaintsReducer);
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
      getComplaintsListFromServer(jsonObj.empId, startDate, endDate);
    }
  }

  const getComplaintsListFromServer = async (empId, startDate, endDate) => {

    const payload = getPayloadData(empId, 0, startDate, endDate);
    dispatch(getComplaintsListApi(payload));
  }

  const getPayloadData = (empId, pageNo, startDate, endDate) => {

    return {
      "groupBy": [],
      "orderBy": [],
      "pageNo": pageNo,
      "size": 10,
      "orderByType": "asc",
      "reportIdentifier": 1215,
      "paginationRequired": true,
      "empId": empId,
      "where": [
        {
          "type": "date",
          "key": "from_date.fromDATE(dl.createddatetime)",
          "values": [
            {
              "value": startDate
            }
          ]
        },
        {
          "type": "date",
          "key": "to_date.toDATE(dl.createddatetime)",
          "values": [
            {
              "value": endDate
            }
          ]
        }
      ]
    }
  }

  const getMoreComplaintsListFromServer = (empId) => {
    if (selector.isExtraLoading) { return }
    if (selector.total_objects_count < selector.complaints_list.length) {
      const payload = getPayloadData(empId, selector.page_number + 1, selectedFromDate, selectedToDate)
      dispatch(getMoreComplaintsListApi(payload));
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
        getComplaintsListFromServer(userData.employeeId, formatDate, selectedToDate)
        break;
      case "TO_DATE":
        setSelectedToDate(formatDate);
        getComplaintsListFromServer(userData.employeeId, selectedFromDate, formatDate)
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
      showToastSucess("Your message was successfully sent!")
    });
  }

  const renderFooter = () => {
    if (!selector.isExtraLoading) { return null }
    return (
      <View style={styles.footer}>
        <Text style={styles.btnText}>Loading More...</Text>
        <AnimLoaderComp visible={true} />
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
                onRefresh={() => getComplaintsListFromServer(userData.employeeId, selectedFromDate, selectedToDate)}
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