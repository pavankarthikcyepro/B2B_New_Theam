import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, FlatList, ActivityIndicator, Text, RefreshControl, Pressable } from "react-native";
import { PageControlItem } from "../../../pureComponents/pageControlItem";
import { IconButton } from "react-native-paper";
import { PreEnquiryItem, EmptyListView } from "../../../pureComponents";
import { DateRangeComp, DatePickerComponent, SortAndFilterComp } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from '../../../asyncStore';
import { getEnquiryList, getMoreEnquiryList } from "../../../redux/enquiryReducer";
import { callNumber } from "../../../utils/helperFunctions";
import moment from "moment";
import { Category_Type_List_For_Filter } from '../../../jsonData/enquiryFormScreenJsonData';

const dateFormat = "YYYY-MM-DD";

const EnquiryScreen = ({ navigation }) => {

  const selector = useSelector((state) => state.enquiryReducer);
  const { vehicle_model_list_for_filters, source_of_enquiry_list } = useSelector(state => state.homeReducer);
  const dispatch = useDispatch();
  const [vehicleModelList, setVehicleModelList] = useState(vehicle_model_list_for_filters);
  const [sourceList, setSourceList] = useState(source_of_enquiry_list);
  const [categoryList, setCategoryList] = useState(Category_Type_List_For_Filter);
  const [employeeId, setEmployeeId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [sortAndFilterVisible, setSortAndFilterVisible] = useState(false);

  useEffect(() => {

    // Get Data From Server
    const currentDate = moment().add(0, "day").format(dateFormat)
    const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
    setSelectedFromDate(lastMonthFirstDate);
    const tomorrowDate = moment().add(1, "day").format(dateFormat)
    setSelectedToDate(tomorrowDate);
    getAsyncData(lastMonthFirstDate, tomorrowDate);
  }, []);

  const getAsyncData = async (startDate, endDate) => {
    let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
    if (empId) {
      getEnquiryListFromServer(empId, startDate, endDate);
      setEmployeeId(empId);
    }
  }

  const getEnquiryListFromServer = (empId, startDate, endDate) => {
    const payload = getPayloadData(empId, startDate, endDate, 0)
    dispatch(getEnquiryList(payload));
  }

  const getPayloadData = (empId, startDate, endDate, offSet, modelFilters = [], categoryFilters = [], sourceFilters = []) => {
    const payload = {
      "startdate": startDate,
      "enddate": endDate,
      "model": modelFilters,
      "categoryType": categoryFilters,
      "sourceOfEnquiry": sourceFilters,
      "empId": empId,
      "status": "ENQUIRY",
      "offset": offSet,
      "limit": 10
    }
    return payload;
  }

  const getMoreEnquiryListFromServer = async () => {
    if (selector.isLoadingExtraData) { return }
    if (employeeId && ((selector.pageNumber + 1) < selector.totalPages)) {
      const payload = getPayloadData(employeeId, selectedFromDate, selectedToDate, (selector.pageNumber + 1))
      dispatch(getMoreEnquiryList(payload));
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
        getEnquiryListFromServer(employeeId, formatDate, selectedToDate);
        break;
      case "TO_DATE":
        setSelectedToDate(formatDate);
        getEnquiryListFromServer(employeeId, selectedFromDate, formatDate);
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

    categoryData.forEach(element => {
      if (element.isChecked) {
        categoryFilters.push({
          id: element.id,
          name: element.name
        })
      }
    });
    modelData.forEach(element => {
      if (element.isChecked) {
        modelFilters.push({
          id: element.id,
          name: element.name
        })
      }
    });
    sourceData.forEach(element => {
      if (element.isChecked) {
        sourceFilters.push({
          id: element.id,
          name: element.name
        })
      }
    });

    setCategoryList([...categoryFilters])
    setVehicleModelList([...modelData]);
    setSourceList([...sourceData]);

    // Make Server call
    const payload2 = getPayloadData(employeeId, selectedFromDate, selectedToDate, 0, modelFilters, categoryFilters, sourceFilters)
    dispatch(getEnquiryList(payload2));
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.text1}>{'Filter'}</Text>
            <IconButton icon={'filter-outline'} size={20} color={Colors.RED} style={{ margin: 0, padding: 0 }} />
          </View>
        </Pressable>
      </View>

      {selector.enquiry_list.length === 0 ? <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} /> :
        <View style={[GlobalStyle.shadow, { backgroundColor: 'white', flex: 1, marginBottom: 10 }]}>
          <FlatList
            data={selector.enquiry_list}
            extraData={selector.enquiry_list}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={(
              <RefreshControl
                refreshing={selector.isLoading}
                onRefresh={() => getEnquiryListFromServer(employeeId, selectedFromDate, selectedToDate)}
                progressViewOffset={200}
              />
            )}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0}
            onEndReached={getMoreEnquiryListFromServer}
            ListFooterComponent={renderFooter}
            renderItem={({ item, index }) => {

              let color = Colors.WHITE;
              if (index % 2 != 0) {
                color = Colors.LIGHT_GRAY;
              }

              return (
                <>
                  <PreEnquiryItem
                    bgColor={color}
                    name={item.firstName + " " + item.lastName}
                    subName={item.enquirySource}
                    enquiryCategory={item.enquiryCategory}
                    date={item.createdDate}
                    modelName={item.model}
                    onPress={() => navigation.navigate(AppNavigator.EmsStackIdentifiers.detailsOverview, { universalId: item.universalId })}
                    onCallPress={() => callNumber(item.phone)}
                  />
                  <View style={GlobalStyle.underline}></View>
                </>
              );
            }}
          />
        </View>}
    </SafeAreaView>
  );
};

export default EnquiryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  view1: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    backgroundColor: Colors.WHITE
  },
  text1: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.RED
  },
  view2: {
    flexDirection: "row",
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
});
