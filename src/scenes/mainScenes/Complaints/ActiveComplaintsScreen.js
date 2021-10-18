import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { ComplaintsItem, EmptyListView } from "../../../pureComponents";
import { useDispatch, useSelector } from "react-redux";
import { getComplaintsListApi, getMoreComplaintsListApi } from "../../../redux/complaintsReducer";
import * as AsyncStorage from "../../../asyncStore";

const ActiveComplaintsScreen = ({ navigation }) => {

  const selector = useSelector((state) => state.complaintsReducer);
  const dispatch = useDispatch();
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {

    getAsyncStorageData();
  }, [])

  const getAsyncStorageData = async () => {
    const empId = await AsyncStorage.getData(AsyncStorage.Keys.EMP_ID);
    if (empId) {
      getComplaintsListFromServer(empId)
      setEmployeeId(empId);
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

  const renderFooter = () => {
    if (!selector.isExtraLoading) { return null }
    return (
      <View style={styles.footer}>
        <Text style={styles.btnText}>Loading More...</Text>
        <ActivityIndicator color={Colors.GRAY} />
      </View>
    );
  };

  if (selector.complaints_list.length === 0) {
    return (
      <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <FlatList
          data={selector.complaints_list}
          extraData={selector.complaints_list}
          refreshControl={(
            <RefreshControl
              refreshing={selector.isLoading}
              onRefresh={() => getComplaintsListFromServer(employeeId)}
              progressViewOffset={200}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0}
          onEndReached={getMoreComplaintsListFromServer(employeeId)}
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
                />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ActiveComplaintsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  view1: {
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
});
