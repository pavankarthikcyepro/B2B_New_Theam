import React from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";

const EvaluationForm = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
};
export default EvaluationForm;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});
