
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "../styles";

import MainParameterScreen from "../scenes/mainScenes/MonthlyTarget/mainParameter";
import SupportingParameterScreen from "../scenes/mainScenes/MonthlyTarget/supportingParameter";

const MonthlyTargetTopTabNavigatorIdentifiers = {
  mainParameter: "MAIN_PARAMETER",
  supportingParameter: "SUPPORTING_PARAMETER",
};

const MonthlyTargetTopTab = createMaterialTopTabNavigator();

const MonthlyTargetTopTabNavigator = () => {
  return (
    <MonthlyTargetTopTab.Navigator
      initialRouteName={MonthlyTargetTopTabNavigatorIdentifiers.mainParameter}
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
      <MonthlyTargetTopTab.Screen
        name={MonthlyTargetTopTabNavigatorIdentifiers.mainParameter}
        component={MainParameterScreen}
        options={{ title: "Main Parameter" }}
      />
      <MonthlyTargetTopTab.Screen
        name={MonthlyTargetTopTabNavigatorIdentifiers.supportingParameter}
        component={SupportingParameterScreen}
        options={{ title: "Supporting Parameter" }}
      />
    </MonthlyTargetTopTab.Navigator>
  );
};

export { MonthlyTargetTopTabNavigator };
