import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

const ForgotScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>{"Testing..."}</Text>
    </SafeAreaView>
  );
};

export default ForgotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
