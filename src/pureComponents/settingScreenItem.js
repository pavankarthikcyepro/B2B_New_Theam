import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Colors } from '../styles'
import { AppNavigator } from "../navigations";
import { useNavigation } from '@react-navigation/native';


export const SettingsScreenItem = ({ name, screen }) => {
  const navigation = useNavigation();

  return (
    <Pressable 
      style={styles.container}
      onPress={() => navigation.navigate("CHANGE_PASSWORD_SCREEN")}
    >
      <Text style={styles.text1}>{name}</Text>
    </Pressable>
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
