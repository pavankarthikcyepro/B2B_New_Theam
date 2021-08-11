import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../../styles";
import { PreEnquiryItem } from "../../../pureComponents/preEnquiryItem";
import { EnquiryItem } from "../../../pureComponents/enquiryItem";
import { EMSTopTabNavigator } from "../../../navigations/emsTopTabNavigator";

const EmsScreen = ({ navigation }) => {
  return <EMSTopTabNavigator />;
};

export default EmsScreen;
