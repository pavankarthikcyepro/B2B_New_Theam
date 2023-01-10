import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  FlatList,
  ScrollView,
} from "react-native";
import { Colors, GlobalStyle } from "../../styles";
import { useDispatch, useSelector } from "react-redux";
import { NotificationItem, NotificationItemWithoutNav } from "../../pureComponents/notificationItem";
import { ActivityIndicator, Button } from "react-native-paper";
import URL from "../../networking/endpoints";
import { client } from "../../networking/client";
import * as AsyncStore from "../../asyncStore";
import { AppNavigator } from "../../navigations";
import {
  DOWN_ARROW,
  FINANCE,
  FOLLOW_UP,
  HOME_VISIT,
  INSURANCE,
  PENDING_TASK,
  TARGET,
  TEST_DRIVE,
  WARRANTY,
} from "../../assets/icon";

const NotificationScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.notificationReducer);
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(false);
 const [userData, setUserData] = useState({
   role: "",
 });
  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    setLoading(true);
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setUserData({ role: jsonObj.hrmsRole });
        const response = await client.get(URL.NOTIFICATION_LIST(jsonObj.empId));
        const json = await response.json();
        setNotificationList(json);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const navigateTo = () => {
    navigation.navigate(AppNavigator.TabStackIdentifiers.myTask);
    setTimeout(() => {
      navigation.navigate("NEW_PENDING");
    }, 750);
  };

  const navigateToTarget = () => {
    navigation.navigate("Target Settings");
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notificationList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{
          ...styles.listStyle,
          justifyContent: !notificationList.length ? "center" : "flex-start",
        }}
        ListEmptyComponent={() =>
          !notificationList.length ? (
            loading ? (
              <ActivityIndicator size="large" color={Colors.RED} />
            ) : (
              <Text style={styles.emptyMessageStyle}>Empty Notifications</Text>
            )
          ) : null
        }
        renderItem={({ item }) => {
          return (
            <ScrollView showsVerticalScrollIndicator={false} style={{}}>
              <Text style={styles.header}>{"Follow Up"}</Text>
              <View style={GlobalStyle.shadow}>
                {item.bookingFollowupTaskMessage && (
                  <NotificationItem
                    title={item?.bookingFollowupTaskMessage}
                    date={item?.date}
                    onPress={navigateTo}
                    icon={FOLLOW_UP}
                  />
                )}
                {item.enqFollowupTaskMessage && (
                  <NotificationItem
                    title={item?.enqFollowupTaskMessage}
                    date={item?.date}
                    onPress={navigateTo}
                    icon={FOLLOW_UP}
                  />
                )}
              </View>
              <Text style={styles.header}>{"Pending Task"}</Text>
              <View style={GlobalStyle.shadow}>
                {item.testDriveTaskMessage && (
                  <NotificationItem
                    title={item?.testDriveTaskMessage}
                    date={item?.date}
                    onPress={navigateTo}
                    icon={TEST_DRIVE}
                  />
                )}
                {item.totalPendingTasksMessage && (
                  <NotificationItem
                    title={item?.totalPendingTasksMessage}
                    date={item?.date}
                    onPress={navigateTo}
                    icon={PENDING_TASK}
                  />
                )}
                {item.homeVisitTaskMessage && (
                  <NotificationItem
                    title={item?.homeVisitTaskMessage}
                    date={item?.date}
                    onPress={navigateTo}
                    icon={HOME_VISIT}
                  />
                )}
                {item.isTarget && (
                  <NotificationItem
                    title={item?.isTarget}
                    date={item?.date}
                    onPress={navigateToTarget}
                    icon={TARGET}
                  />
                )}
                {item.zeroEnqSc && (
                  <NotificationItem
                    title={item?.zeroEnqSc}
                    date={item?.date}
                    onPress={navigateTo}
                    icon={DOWN_ARROW}
                  />
                )}
                {item.zeroBookingSc && (
                  <NotificationItem
                    title={item?.zeroBookingSc}
                    date={item?.date}
                    onPress={navigateTo}
                    icon={DOWN_ARROW}
                  />
                )}
                {item.zeroRetailSc && (
                  <NotificationItem
                    title={item?.zeroRetailSc}
                    date={item?.date}
                    onPress={navigateTo}
                    icon={DOWN_ARROW}
                  />
                )}
              </View>
              <Text style={styles.header}>
                {userData.role == "Sales Consulant" ||
                userData.role == "Field DSE"
                  ? "Performance"
                  : "Team Performance"}
              </Text>
              <View style={GlobalStyle.shadow}>
                {item.accessoriesMassage && (
                  <NotificationItemWithoutNav
                    title={item?.accessoriesMassage}
                    date={item?.date}
                    icon={TEST_DRIVE}
                  />
                )}
                {item.exchangeMessage && (
                  <NotificationItemWithoutNav
                    title={item?.exchangeMessage}
                    date={item?.date}
                    icon={PENDING_TASK}
                  />
                )}
                {item.insuranceMessage && (
                  <NotificationItemWithoutNav
                    title={item?.insuranceMessage}
                    date={item?.date}
                    icon={INSURANCE}
                  />
                )}
                {item.warrantyMessage && (
                  <NotificationItemWithoutNav
                    title={item?.warrantyMessage}
                    date={item?.date}
                    icon={WARRANTY}
                  />
                )}
                {item.finaceMessage && (
                  <NotificationItemWithoutNav
                    title={item?.finaceMessage}
                    date={item?.date}
                    icon={FINANCE}
                  />
                )}
              </View>
            </ScrollView>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold",
    backgroundColor: Colors.gray,
  },
  sectionHeaderVw: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  emptyMessageStyle: {
    textAlign: "center",
    fontSize: 20,
  },
  listStyle: {
    justifyContent: "center",
    flex: 1,
  },
});

export default NotificationScreen;
