import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Alert,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { Colors, GlobalStyle } from "../../styles";
import { UpcomingDeliveriesItem } from "../../pureComponents/upcomingDeliveriesItem";
import { EmptyListView } from "../../pureComponents";
import { IconButton } from "react-native-paper";
import { DateRangeComp, DatePickerComponent } from "../../components";
import { callNumber } from "../../utils/helperFunctions";
import { useDispatch, useSelector } from "react-redux";
import * as AsyncStore from "../../asyncStore";
import {
  getUpcmoingDeliveriesListApi,
  getMoreUpcmoingDeliveriesListApi
} from "../../redux/upcomingDeliveriesReducer";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";

const UpcomingDeliveriesScreen = () => {

  const selector = useSelector(state => state.upcomingDeliveriesReducer);
  const dispatch = useDispatch();
  const [employeeId, setEmployeeId] = useState("");
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
    getAsyncData(lastMonthFirstDate, currentDate);
  }, [])

  const getAsyncData = async (startDate, endDate) => {
    let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
    if (empId) {
      getUpcomingDelivieriesListFromServer(empId, startDate, endDate);
      setEmployeeId(empId);
    }
  }

  const getUpcomingDelivieriesListFromServer = async (empId, startDate, endDate) => {
    const payload = getPayloadData(empId, startDate, endDate, 0)
    dispatch(getUpcmoingDeliveriesListApi(payload));
  }

  const getPayloadData = (empId, startDate, endDate, offSet, modelFilters = [], categoryFilters = [], sourceFilters = []) => {
    const payload = {
      "startdate": startDate,
      "enddate": endDate,
      "model": modelFilters,
      "categoryType": categoryFilters,
      "sourceOfEnquiry": sourceFilters,
      "empId": empId,
      "status": "DELIVERY",
      "offset": offSet,
      "limit": 10
    }
    return payload;
  }

  const getMorePreEnquiryListFromServer = async () => {
    if (selector.isLoadingExtraData) { return }
    if (employeeId && ((selector.pageNumber + 1) < selector.totalPages)) {
      const payload = getPayloadData(employeeId, selectedFromDate, selectedToDate, (selector.pageNumber + 1))
      dispatch(getMoreUpcmoingDeliveriesListApi(payload))
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
        getUpcomingDelivieriesListFromServer(employeeId, formatDate, selectedToDate);
        break;
      case "TO_DATE":
        setSelectedToDate(formatDate);
        getUpcomingDelivieriesListFromServer(employeeId, selectedFromDate, formatDate);
        break;
    }
  }

  const renderFooter = () => {
    if (!selector.isLoadingExtraData) { return null }
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

      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
        <View style={styles.view0}>
          <DateRangeComp
            fromDate={selectedFromDate}
            toDate={selectedToDate}
            fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
            toDateClicked={() => showDatePickerMethod("TO_DATE")}
          />
        </View>
        {/* // [GlobalStyle.shadow, { backgroundColor: 'white', flex: 1, marginBottom: 10 }] */}
        {selector.data_list.length === 0 ? (<EmptyListView title={"No Data Found"} isLoading={selector.isLoading} />) : (
          <View style={{}}>
            <FlatList
              data={selector.data_list}
              extraData={selector.data_list}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={(
                <RefreshControl
                  refreshing={selector.isLoading}
                  onRefresh={() => getUpcomingDelivieriesListFromServer(employeeId, selectedFromDate, selectedToDate)}
                  progressViewOffset={200}
                />
              )}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0}
              onEndReached={getMorePreEnquiryListFromServer}
              ListFooterComponent={renderFooter}
              ItemSeparatorComponent={() => {
                return <View style={styles.separator}></View>;
              }}
              renderItem={({ item, index }) => {

                let color = Colors.WHITE;
                if (index % 2 != 0) {
                  color = Colors.LIGHT_GRAY;
                }

                return (
                  <UpcomingDeliveriesItem
                    name={item.firstName + " " + item.lastName}
                    planning={item.commitmentDeliveryPreferredDate}
                    location={item.deliveryLocation}
                    dseName={item.createdBy}
                    modelName={item.model ? item.model : ""}
                    chasissNo={item.chassisNo}
                    bgColor={color}
                    onPress={() => {
                      console.log("onpress");
                    }}
                    onCallPress={() => callNumber(item.phone)}
                  />
                );
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UpcomingDeliveriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  view1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  text1: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.RED,
  },
  view0: {
    paddingHorizontal: 30,
    paddingBottom: 10
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
  separator: {
    height: 10,
  },
});
