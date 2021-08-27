import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { MyTaskItem } from "../../../pureComponents/myTaskItem";
import { useDispatch, useSelector } from "react-redux";
import { AppNavigator } from "../../../navigations";
import { getMyTasksList, getMoreMyTasksList } from "../../../redux/mytaskReducer";
import * as AsyncStorage from "../../../asyncStore";
import { EmptyListView } from "../../../pureComponents";

const screenWidth = Dimensions.get("window").width;

const MyTasksScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.mytaskReducer);
  const dispatch = useDispatch();
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    getMyTasksListFromServer();
  }, []);

  const getMyTasksListFromServer = async () => {
    const empId = await AsyncStorage.getData(AsyncStorage.Keys.EMP_ID);
    if (empId) {
      const endUrl = `empId=${empId}&limit=10&offset=${0}`;
      dispatch(getMyTasksList(endUrl));
      setEmployeeId(empId);
    }
  }

  const getMoreMyTasksListFromServer = async () => {
    if (employeeId && ((selector.pageNumber + 1) < selector.totalPages)) {
      const endUrl = `empId=${employeeId}&limit=10&offset=${selector.pageNumber + 1}`;
      dispatch(getMoreMyTasksList(endUrl));
    }
  }

  const itemClicked = (taskName) => {
    const trimName = taskName.toLowerCase().trim();
    const finalTaskName = trimName.replace(/ /g, "");
    switch (finalTaskName) {
      case "testdrive":
        navigation.navigate(AppNavigator.MyTasksStackIdentifiers.testDrive);
        break;
      case "proceedtobooking":
        navigation.navigate(
          AppNavigator.MyTasksStackIdentifiers.preBookingFollowUp
        );
        break;
      case "prebookingfollowup":
        navigation.navigate(
          AppNavigator.MyTasksStackIdentifiers.preBookingFollowUp
        );
        break;
      case "homevisit":
        navigation.navigate(AppNavigator.MyTasksStackIdentifiers.homeVisit);
        break;
      case "enquiryfollowup":
        navigation.navigate(
          AppNavigator.MyTasksStackIdentifiers.enquiryFollowUp
        );
        break;
    }
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

  if (selector.tableData.length === 0) {
    return (
      <EmptyListView title={"No Data Found"} />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <FlatList
          data={selector.tableData}
          extraData={selector.tableData}
          refreshControl={(
            <RefreshControl
              refreshing={selector.isLoading}
              onRefresh={getMyTasksListFromServer}
              progressViewOffset={200}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0}
          onEndReached={getMoreMyTasksListFromServer}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator}></View>;
          }}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1, width: "100%" }}>
                <View style={[styles.listBgVw]}>
                  <Pressable onPress={() => itemClicked(item.taskName)}>
                    <MyTaskItem
                      taskName={item.taskName}
                      dmsLead={item.leadDto.firstName + " " + item.leadDto.lastName}
                      phone={item.leadDto.phone}
                      created={item.leadDto.createdDate}
                      status={item.taskStatus}
                    />
                  </Pressable>
                </View>
                <Text style={GlobalStyle.underline}></Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MyTasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  view1: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  listBgVw: {
    width: "100%",
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
