import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ComplaintsTopTabNavigator } from "../../navigations/complaintsTopTabNavigator";
import { DateRangeComp } from '../../components/dateRangeComp';

const ComplaintsScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view1}>
        <DateRangeComp fromDate={'09/23/2209'} toDate={'89/09/2021'} />
      </View>
      <ComplaintsTopTabNavigator />
    </SafeAreaView>
  );
};

export default ComplaintsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  view1: {
    paddingHorizontal: 30,
    paddingVertical: 10
  }
})