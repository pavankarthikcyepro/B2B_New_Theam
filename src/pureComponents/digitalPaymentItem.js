import React,{useEffect} from "react";
import { View, StyleSheet, Image } from "react-native";
import { Colors } from "../styles";

export const DigitalPaymentItem = ({ Image, Text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>{Image}{Text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: Colors.WHITE,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  text1: {
    color: Colors.BLACK,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});