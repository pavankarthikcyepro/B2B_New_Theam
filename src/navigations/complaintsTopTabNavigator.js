import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import OpenScreen from "../scenes/mainScenes/Complaints/Open";
import ClosedScreen from "../scenes/mainScenes/Complaints/Closed";
import InprogressScreen from "../scenes/mainScenes/Complaints/Inprogress";
import { DateRangeComp } from "../components/dateRangeComp";
import { Colors } from "../styles";

const ComplaintsTopTabNavigatorIdentifiers = {
  open: "OPEN",
  inprogress: "INPROGRESS",
  closed: "CLOSED",
};

const ComplaintsTopTab = createMaterialTopTabNavigator();

const ComplaintsTopTabNavigator = () => {
  return (
    <ComplaintsTopTab.Navigator
      initialRouteName={ComplaintsTopTabNavigatorIdentifiers.open}
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
      <ComplaintsTopTab.Screen
        name={ComplaintsTopTabNavigatorIdentifiers.open}
        component={OpenScreen}
        options={{ title: "open" }}
      />
      <ComplaintsTopTab.Screen
        name={ComplaintsTopTabNavigatorIdentifiers.inprogress}
        component={InprogressScreen}
        options={{ title: "inprogress" }}
      />
      <ComplaintsTopTab.Screen
        name={ComplaintsTopTabNavigatorIdentifiers.closed}
        component={ClosedScreen}
        options={{ title: "closed" }}
      />
    </ComplaintsTopTab.Navigator>
  );
};

export { ComplaintsTopTabNavigator };
