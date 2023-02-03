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
import { Colors } from "../../styles";
import { useDispatch, useSelector } from "react-redux";
import { NotificationItem } from "../../pureComponents/notificationItem";
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
  EXCHANGE,
  ACCESSORIES,
  LEAD_ALLOCATION,
} from "../../assets/icon";
import { getNotificationList, notificationReadClearState, readNotification, setNotificationMyTaskAllFilter } from "../../redux/notificationReducer";

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.notificationReducer);

  const [loading, setLoading] = useState(selector.loading);
  const [isInitial, setIsInitial] = useState(true);
  const [empId, setEmpId] = useState("");

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (selector.notificationList.length == 0) {
        dispatch(getNotificationList(jsonObj.empId));
      }
      setEmpId(jsonObj.empId);
    }
    return () => {
      dispatch(notificationReadClearState());
      setIsInitial(true);
    };
  }, []);
  
  useEffect(() => {
    if (selector.readNotificationResponseStatus == "success"){
      dispatch(getNotificationList(empId));
    }
  }, [selector.readNotificationResponseStatus]);

  useEffect(() => {
    if (selector.loading && isInitial) {
      setLoading(selector.loading);
      setIsInitial(false);
    } else {
      setLoading(false);
    }
  }, [selector.loading]);

  const navigateTo = (screenName, item) => {
    if (screenName) {
      if (screenName == AppNavigator.TabStackIdentifiers.myTask) {
        dispatch(setNotificationMyTaskAllFilter(true));
      }
      navigation.navigate(screenName);
      if (screenName != "Target Settings") {
        setTimeout(() => {
          navigation.navigate("NEW_PENDING");
        }, 750);
      }
    }
    readingNotification(item.id);
  };

  const readingNotification = (notificationId) => {
    dispatch(readNotification(notificationId));
  };

  const renderList = ({ item, index }) => {
    const { notificationName } = item;
    let icon = LEAD_ALLOCATION;
    let screenName = "";

    if (notificationName == "Test Drive") {
      icon = TEST_DRIVE;
      screenName = AppNavigator.TabStackIdentifiers.myTask;
    } else if (notificationName == "Home Visit") {
      icon = HOME_VISIT;
      screenName = AppNavigator.TabStackIdentifiers.myTask;
    } else if (notificationName == "Enquiry Follow Up") {
      icon = FOLLOW_UP;
      screenName = AppNavigator.TabStackIdentifiers.myTask;
    } else if (notificationName == "Booking Follow Up - DSE") {
      icon = FOLLOW_UP;
      screenName = AppNavigator.TabStackIdentifiers.myTask;
    } else if (notificationName == "Target Setting") {
      icon = TARGET;
      screenName = "Target Settings";
    } else if (notificationName == "Accessories") {
      icon = ACCESSORIES;
    } else if (notificationName == "Exchange") {
      icon = EXCHANGE;
    } else if (notificationName == "Finance") {
      icon = FINANCE;
    } else if (notificationName == "Insurance") {
      icon = INSURANCE;
    } else if (notificationName == "Warranty") {
      icon = WARRANTY;
    } else if (notificationName == "Lead Allocation") {
      icon = LEAD_ALLOCATION;
    } else if (
      notificationName == "Zero Enquiry Sc" ||
      notificationName == "Zero Booking Sc" ||
      notificationName == "Zero Retail Sc"
    ) {
      icon = DOWN_ARROW;
    }

    let bg = "#e5f4fe";
    if (item.isRead == "Y") {
      bg = Colors.WHITE;
    }

    return (
      <View>
        <NotificationItem
          title={item.eventNotificationsMessage}
          onPress={() => navigateTo(screenName, item)}
          icon={icon}
          style={{ backgroundColor: bg }}
          isFlag={item.isFlag}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={selector.notificationList}
        renderItem={renderList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          ...styles.listStyle,
          justifyContent: !selector.notificationList.length
            ? "center"
            : "flex-start",
        }}
        ListEmptyComponent={() =>
          !selector.notificationList.length ? (
            loading ? (
              <ActivityIndicator size="large" color={Colors.RED} />
            ) : (
              <Text style={styles.emptyMessageStyle}>Empty Notifications</Text>
            )
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: Colors.WHITE,
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
  },
});

export default NotificationScreen;
