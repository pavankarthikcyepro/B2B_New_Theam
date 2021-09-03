import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, FlatList, ActivityIndicator, Text, RefreshControl } from "react-native";
import { PageControlItem } from "../../../pureComponents/pageControlItem";
import { IconButton } from "react-native-paper";
import { PreEnquiryItem, EmptyListView } from "../../../pureComponents";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from '../../../asyncStore';
import { getEnquiryList, getMoreEnquiryList } from "../../../redux/enquiryReducer";
import { callNumber } from "../../../utils/helperFunctions";

const EnquiryScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.enquiryReducer);
  const dispatch = useDispatch();
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    getEnquiryListFromServer();
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
      {/* <View style={styles.view2}>
        <PageControlItem pageNumber={1} totalPages={7} />
        <IconButton
          icon={"refresh"}
          size={25}
          style={{ padding: 0, marginLeft: 150 }}
        />
      </View> */}
      <View style={{ height: 10 }}></View>

      {selector.enquiry_list.length === 0 ? <EmptyListView title={"No Data Found"} /> :
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
    // marginBottom: 5,
    // paddingHorizontal: 10,
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
