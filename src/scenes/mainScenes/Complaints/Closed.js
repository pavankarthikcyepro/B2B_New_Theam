import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../../styles";
import { complaintsItem } from "../../../pureComponents/complaintsItem";
import { ComplaintsTopTabNavigator } from "../../../navigations/complaintsTopTabNavigator";

const ClosedScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Closed</Text>
    </View>
  );
};

export default ClosedScreen;
