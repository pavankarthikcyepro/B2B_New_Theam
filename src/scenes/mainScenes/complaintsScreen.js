import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Colors, GlobalStyle } from "../../styles";
import { ComplaintsItem } from "../../pureComponents/complaintsItem";
import { useDispatch, useSelector } from "react-redux";
import { ComplaintsTopTabNavigator } from "../../navigations/complaintsTopTabNavigator";

const screenWidth = Dimensions.get("window").width;

const ComplaintsScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.complaintsReducer);

  return <ComplaintsTopTabNavigator />;
};

export default ComplaintsScreen;
