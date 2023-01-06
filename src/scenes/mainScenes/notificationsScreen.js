import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  FlatList,
} from "react-native";
import { Colors, GlobalStyle } from "../../styles";
import { useDispatch, useSelector } from "react-redux";
import { NotificationItem } from "../../pureComponents/notificationItem";
import { ActivityIndicator, Button } from "react-native-paper";
import URL from "../../networking/endpoints";
import { client } from "../../networking/client";
import * as AsyncStore from "../../asyncStore";
import { AppNavigator } from "../../navigations";
import { DOWN_ARROW, FOLLOW_UP, HOME_VISIT, PENDING_TASK, TARGET, TEST_DRIVE } from "../../assets/icon";

const NotificationScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.notificationReducer);
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(false);

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
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notificationList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
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
            <View style={{}}>
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
                    onPress={navigateTo}
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
            </View>
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
