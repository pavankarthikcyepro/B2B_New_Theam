import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PreEnquiryScreen from "../scenes/mainScenes/EMS/preEnquiryScreen";
import { Colors } from "../styles";

const EmsTopTabNavigatorIdentifiers = {
  preEnquiry: "PRE_ENQUIRY",
  enquiry: "ENQUIRY",
};

const EMSTopTab = createMaterialTopTabNavigator();

const EMSTopTabNavigator = () => {
  return (
    <EMSTopTab.Navigator
      initialRouteName={EmsTopTabNavigatorIdentifiers.preEnquiry}
      tabBarOptions={{
        activeTintColor: Colors.RED,
        inactiveTintColor: Colors.DARK_GRAY,
        indicatorStyle: {
          backgroundColor: Colors.RED,
        },
        labelStyle: {
          fontSize: 14,
          fontWeight: "600",
        },
      }}
    >
      <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.preEnquiry}
        component={PreEnquiryScreen}
        options={{ title: "Pre-Enquiry" }}
      />
      <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.enquiry}
        component={PreEnquiryScreen}
        options={{ title: "Pre-Enquiry" }}
      />
    </EMSTopTab.Navigator>
  );
};

export { EMSTopTabNavigator };
