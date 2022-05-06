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
import {
  Category_Type_List_For_Filter,
  Model_Types,
} from "../../jsonData/enquiryFormScreenJsonData";
import {
  getEnquiryList,
  getMoreEnquiryList,
} from "../../redux/enquiryFormReducer";
import { Colors, GlobalStyle } from "../../styles";
import { UpcomingDeliveriesItem } from "../../pureComponents/upcomingDeliveriesItem";
import { EmptyListView } from "../../pureComponents";
import { IconButton } from "react-native-paper";
import {
  DateRangeComp,
  DatePickerComponent,
  SortAndFilterComp,
} from "../../components";
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
  
  const { vehicle_model_list_for_filters, source_of_enquiry_list } =
    useSelector((state) => state.homeReducer);
  const [employeeId, setEmployeeId] = useState("");
  const [userData, setUserData] = useState({ branchId: "", orgId: "", employeeId: "", employeeName: "" })
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [sortAndFilterVisible, setSortAndFilterVisible] = useState(false);
   const [vehicleModelList, setVehicleModelList] = useState(
     vehicle_model_list_for_filters
   );
   const [sourceList, setSourceList] = useState(source_of_enquiry_list);
   const [categoryList, setCategoryList] = useState(
     Category_Type_List_For_Filter
   );
 

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
  const applySelectedFilters = (payload) => {
    const modelData = payload.model;
    const sourceData = payload.source;
    const categoryData = payload.category;

    const categoryFilters = [];
    const modelFilters = [];
    const sourceFilters = [];

    categoryData.forEach((element) => {
      if (element.isChecked) {
        categoryFilters.push({
          id: element.id,
          name: element.name,
        });
      }
    });
    modelData.forEach((element) => {
      if (element.isChecked) {
        modelFilters.push({
          id: element.id,
          name: element.name,
        });
      }
    });
    sourceData.forEach((element) => {
      if (element.isChecked) {
        sourceFilters.push({
          id: element.id,
          name: element.name,
        });
      }
    });

    setCategoryList([...categoryFilters]);
    setVehicleModelList([...modelData]);
    setSourceList([...sourceData]);

    // Make Server call
    const payload2 = getPayloadData(
      employeeId,
      selectedFromDate,
      selectedToDate,
      0,
      modelFilters,
      categoryFilters,
      sourceFilters
    );
    dispatch(getEnquiryList(payload2));
  };


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
          setShowDatePicker(false);
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />

      <SortAndFilterComp
        visible={sortAndFilterVisible}
        categoryList={categoryList}
        modelList={vehicleModelList}
        sourceList={sourceList}
        submitCallback={(payload) => {
          // console.log("payload: ", payload);
          applySelectedFilters(payload);
          setSortAndFilterVisible(false);
        }}
        onRequestClose={() => {
          setSortAndFilterVisible(false);
        }}
      />

      <View style={styles.view1}>
        <View style={{ width: "80%" }}>
          <DateRangeComp
            fromDate={selectedFromDate}
            toDate={selectedToDate}
            fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
            toDateClicked={() => showDatePickerMethod("TO_DATE")}
          />
        </View>
        <Pressable onPress={() => setSortAndFilterVisible(true)}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.text1}>{"Filter"}</Text>
            <IconButton
              icon={"filter-outline"}
              size={30}
              color={Colors.RED}
              style={{ margin: 0, padding: 0 }}
            />
          </View>
        </Pressable>
      </View>

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
        {selector.data_list.length === 0 ? (
          <EmptyListView
            title={"No Data Found"}
            isLoading={selector.isLoading}
          />
        ) : (
          <View style={{}}>
            <FlatList
              data={selector.data_list}
              extraData={selector.data_list}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={selector.isLoading}
                  onRefresh={() =>
                    getUpcomingDelivieriesListFromServer(
                      employeeId,
                      selectedFromDate,
                      selectedToDate
                    )
                  }
                  progressViewOffset={200}
                />
              }
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
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    backgroundColor: Colors.WHITE,
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.RED,
  },
  view0: {
    paddingHorizontal: 30,
    paddingBottom: 10,
  },
  text1: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.RED,
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: Colors.GRAY,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  separator: {
    height: 10,
  },
});
