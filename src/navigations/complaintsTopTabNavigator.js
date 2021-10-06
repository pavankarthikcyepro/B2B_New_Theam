import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import ActiveComplaintsScreen from "../scenes/mainScenes/Complaints/ActiveComplaintsScreen";
import InActiveComplaintsScreen from "../scenes/mainScenes/Complaints/InActiveComplaintsScreen";
import { Colors } from "../styles";

const ComplaintsTopTabNavigatorIdentifiers = {
  active: "ACTIVE",
  inActive: "CLOSED",
};

const ComplaintsTopTab = createMaterialTopTabNavigator();

const ComplaintsTopTabNavigator = () => {
  return (
    <ComplaintsTopTab.Navigator
      initialRouteName={ComplaintsTopTabNavigatorIdentifiers.active}
      tabBarOptions={{
        activeTintColor: Colors.RED,
        inactiveTintColor: Colors.DARK_GRAY,
        indicatorStyle: {
          backgroundColor: Colors.RED,
        },
        labelStyle: {
          fontSize: 14,
          fontWeight: "600",
          textTransform: "none",
        },
      }}
    >
      <ComplaintsTopTab.Screen
        name={ComplaintsTopTabNavigatorIdentifiers.active}
        component={ActiveComplaintsScreen}
        options={{ title: "ACTIVE" }}
      />
      <ComplaintsTopTab.Screen
        name={ComplaintsTopTabNavigatorIdentifiers.inActive}
        component={InActiveComplaintsScreen}
        options={{ title: "IN ACTIVE" }}
      />
    </ComplaintsTopTab.Navigator>
  );
};

export { ComplaintsTopTabNavigator };
