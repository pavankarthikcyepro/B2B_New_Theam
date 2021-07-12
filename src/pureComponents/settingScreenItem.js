import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Colors } from '../styles'

export const SettingsScreenItem = ({ name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>{name}</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  text1: {
    color: Colors.BLACK,
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  }
});
