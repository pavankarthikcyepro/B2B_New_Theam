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
import { DateRangeComp } from "../../components/dateRangeComp";
import { callNumber } from "../../utils/helperFunctions";
import { useDispatch, useSelector } from "react-redux";
import * as AsyncStore from "../../asyncStore";
import {
  getUpcmoingDeliveriesListApi,
  getMoreUpcmoingDeliveriesListApi
} from "../../redux/upcomingDeliveriesReducer";

const UpcomingDeliveriesScreen = () => {

  const selector = useSelector(state => state.upcomingDeliveriesReducer);
  const dispatch = useDispatch();
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {

    getUpcomingDelivieriesListFromServer();
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
      <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
        <View style={styles.view0}>
          <DateRangeComp
            fromDate={'09/23/2209'}
            fromDateClicked={() => { console.log("from date") }}
            toDate={'89/09/2021'}
            toDateClicked={() => { console.log("to date") }}
          />
        </View>
        {selector.data_list.length === 0 ? <EmptyListView title={'No Data Found'} isLoading={selector.isLoading} /> :
          (<View style={[GlobalStyle.shadow, { backgroundColor: 'white', flex: 1, marginBottom: 10 }]}>
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
          </View>)}
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
});
