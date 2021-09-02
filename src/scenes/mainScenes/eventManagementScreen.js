import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { EventManagementTopTabNavigator } from "../../navigations/eventManagementTopTabNavigator";
import { DateRangeComp } from "../../components/dateRangeComp";

const EventManagementScreen = ({ navigation }) => {


  return (
    <SafeAreaView style={styles.container}>



      <View style={styles.view1}>
        <DateRangeComp
          fromDate={"01/01/2021"}
          toDate={"19/11/2021"}
          fromDateClicked={() => console.log("from date")}
          toDateClicked={() => console.log("to date")}
        />
      </View>
      <EventManagementTopTabNavigator />
    </SafeAreaView>
  );
};

export default EventManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  view1: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});
