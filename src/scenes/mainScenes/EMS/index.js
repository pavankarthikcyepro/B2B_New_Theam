import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../../styles";
import { EnquiryItem } from "../../../pureComponents/enquiryItem";
import { EMSTopTabNavigatorOne, EMSTopTabNavigatorTwo } from "../../../navigations/emsTopTabNavigator";
import * as AsyncStore from "../../../asyncStore";

const EmsScreen = ({ navigation }) => {

  const [handleTabDisplay, setHandleTabDisplay] = useState(0);

  useEffect(async () => {

    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (jsonObj.hrmsRole === "Reception" || jsonObj.hrmsRole === "Tele Caller") {
        setHandleTabDisplay(1)
      } else {
        setHandleTabDisplay(2)
      }
    }
  }, [])

  if (handleTabDisplay == 2) {
    return <EMSTopTabNavigatorTwo />;
  }
  return <EMSTopTabNavigatorOne />;
};

export default EmsScreen;
