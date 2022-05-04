/** @format */

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { EmptyListView, EventManagementItem } from "../../../pureComponents";
import { useDispatch, useSelector } from "react-redux";
import * as AsyncStore from "../../../asyncStore";
import {
  getPendingEventListApi,
  getMorePendingEventListApi,
} from "../../../redux/eventManagementReducer";

const MainParameterScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.eventmanagementReducer);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    branchId: "",
    orgId: "",
    employeeId: "",
    employeeName: "",
  });

  useEffect(() => {
    getAsyncstoreData();
  }, []);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({
        branchId: jsonObj.branchId,
        orgId: jsonObj.orgId,
        employeeId: jsonObj.empId,
        employeeName: jsonObj.empName,
      });
      // getListDataFromServer(jsonObj.empId, jsonObj.branchId, jsonObj.orgId);
    }
  };

  const getListDataFromServer = (empId, branchId, orgId) => {
    if (empId) {
      const payload = {
        startDate: "2021-09-01",
        endDate: "2021-10-31",
        managerId: empId,
        pageNo: 0,
        branchId: branchId,
        orgId: orgId,
      };
      dispatch(getPendingEventListApi(payload));
    }
  };

  const getMoreListDataFromServer = (empId, branchId, orgId) => {
    if (empId && selector.pageNumber + 1 < selector.totalPages) {
      const payload = {
        startDate: "2021-10-01",
        endDate: "2021-10-31",
        managerId: empId,
        pageNo: 0,
        branchId: branchId,
        orgId: orgId,
      };
      dispatch(getMorePendingEventListApi(payload));
    }
  };

  const renderFooter = () => {
    if (!selector.isLoadingExtraData) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <Text style={styles.btnText}>Loading More...</Text>
        <ActivityIndicator color={Colors.GRAY} />
      </View>
    );
  };

  if (selector.eventList.length === 0) {
    return (
      <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <FlatList
          data={selector.eventList}
          extraData={selector.eventList}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={selector.isLoading}
              onRefresh={() =>
                getListDataFromServer(
                  userData.employeeId,
                  userData.branchId,
                  userData.orgId
                )
              }
              progressViewOffset={200}
            />
          }
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0}
          onEndReached={getMoreListDataFromServer(
            userData.employeeId,
            userData.branchId,
            userData.orgId
          )}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator}></View>;
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={[styles.listBgVw]}>
                <EventManagementItem
                  eventid={item.id}
                  eventName={item.name}
                  organizer={item.organiserName}
                  startDate={item.startdate}
                  endDate={item.enddate}
                  location={item.location}
                  eventType={item.eventType.name}
                  status={item.status}
                  eventEmpDetails={item.eventEmpDetails}
                />
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MainParameterScreen;

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
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: Colors.GRAY,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
});
