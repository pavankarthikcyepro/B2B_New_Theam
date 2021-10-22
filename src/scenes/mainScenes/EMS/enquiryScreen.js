import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, FlatList, ActivityIndicator, Text, RefreshControl, Pressable } from "react-native";
import { PageControlItem } from "../../../pureComponents/pageControlItem";
import { IconButton } from "react-native-paper";
import { PreEnquiryItem, EmptyListView } from "../../../pureComponents";
import { DateRangeComp, DatePickerComponent } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from '../../../asyncStore';
import { getEnquiryList, getMoreEnquiryList } from "../../../redux/enquiryReducer";
import { callNumber } from "../../../utils/helperFunctions";
import moment from "moment";

const EnquiryScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.enquiryReducer);
  const dispatch = useDispatch();
  const [employeeId, setEmployeeId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");

  useEffect(() => {
    getEnquiryListFromServer();

    const currentDate = moment().format("DD/MM/YYYY");
    setSelectedFromDate(currentDate);
    setSelectedToDate(currentDate);
  }, []);

  const getEnquiryListFromServer = async () => {
    let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
    if (empId) {
      let endUrl = "?limit=10&offset=" + "0" + "&status=ENQUIRY&empId=" + empId;
      dispatch(getEnquiryList(endUrl));
      setEmployeeId(empId);
    }
  }

  const getMoreEnquiryListFromServer = async () => {
    if (employeeId && ((selector.pageNumber + 1) < selector.totalPages)) {
      let endUrl = "?limit=10&offset=" + (selector.pageNumber + 1) + "&status=ENQUIRY&empId=" + employeeId;
      dispatch(getMoreEnquiryList(endUrl));
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
        <View style={{ width: "80%" }}>
          <DateRangeComp
            fromDate={selectedFromDate}
            toDate={selectedToDate}
            fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
            toDateClicked={() => showDatePickerMethod("TO_DATE")}
          />
        </View>
        <Pressable onPress={() => { }}>
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
                onRefresh={getEnquiryListFromServer}
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
                <PreEnquiryItem
                  bgColor={color}
                  name={item.firstName + " " + item.lastName}
                  subName={item.enquirySource}
                  date={item.createdDate}
                  modelName={item.model}
                  onPress={() => navigation.navigate(AppNavigator.EmsStackIdentifiers.detailsOverview, { universalId: item.universalId })}
                  onCallPress={() => callNumber(item.phone)}
                />
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
