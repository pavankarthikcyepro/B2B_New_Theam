import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
} from "react-native";
import { Colors, GlobalStyle } from "../../styles";
import { useDispatch, useSelector } from "react-redux";
import { NotificationItem } from "../../pureComponents/notificationItem";
import { Button } from "react-native-paper";
import URL from "../../networking/endpoints";
import { client } from "../../networking/client";
import * as AsyncStore from "../../asyncStore";

const NotificationScreen = () => {
  const selector = useSelector((state) => state.notificationReducer);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const response = await client.get(
          URL.NOTIFICATION_LIST(
            jsonObj.empId,
          )
        );
        const json = await response.json();
        console.log(json);
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={selector.tableData}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <View style={{}}>
              <View style={GlobalStyle.shadow}>
                <NotificationItem title={item.name} date={item.date} />
              </View>
            </View>
          );
        }}
        renderSectionHeader={({ section: { title } }) => {
          let showMarkAllRead = false;
          if (title === "Today") {
            showMarkAllRead = true;
          }

          return (
            <View style={styles.sectionHeaderVw}>
              <Text style={styles.header}>{title}</Text>
              {showMarkAllRead ? (
                <Button
                  mode="text"
                  labelStyle={{
                    fontSize: 14,
                    color: Colors.RED,
                    textTransform: "none",
                    textAlign: "right",
                    paddingRight: 0,
                    marginRight: 0,
                  }}
                  contentStyle={{ margin: 0, padding: 0 }}
                  onPress={() => {}}
                >
                  Mark all read
                </Button>
              ) : null}
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
});

export default NotificationScreen;
