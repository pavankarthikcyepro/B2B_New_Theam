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

    getUpcomingDelivieriesListFromServer();

    // Get Data From Server
    const currentDate = moment().format("DD/MM/YYYY");
    setSelectedFromDate(currentDate);
    setSelectedToDate(currentDate);
  }, [])

  const getUpcomingDelivieriesListFromServer = async () => {
    let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
    if (empId) {
      let endUrl = "?limit=10&offset=" + "0" + "&status=DELIVERY&empId=" + empId;
      dispatch(getUpcmoingDeliveriesListApi(endUrl));
      setEmployeeId(empId);
    }
  }

  const getMorePreEnquiryListFromServer = async () => {
    if (employeeId && ((selector.pageNumber + 1) < selector.totalPages)) {
      let endUrl = "?limit=10&offset=" + (selector.pageNumber + 1) + "&status=DELIVERY&empId=" + empId;
      dispatch(getMoreUpcmoingDeliveriesListApi(endUrl))
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

  const renderFooter = () => {
    if (!selector.isLoadingExtraData) { return null }
    return (
      <View style={styles.footer}>
        <Text style={styles.btnText}>Loading More...</Text>
        <ActivityIndicator color={Colors.GRAY} />
      </View>
    );
  };

  if (selector.data_list.length === 0) {
    return (
      <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} />
    )
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
                  onRefresh={getUpcomingDelivieriesListFromServer}
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
                    planning={""}
                    location={""}
                    dseName={item.createdBy}
                    modelName={item.model ? item.model : ""}
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
