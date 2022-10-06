import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DataScreen, { LostScreen, DropScreen } from "../scenes/mainScenes/Home/TabScreens/dataScreen";
import TargetScreen, { ParameterScreen, LiveScreen, EventScreen, LeadSourceScreen, VehicleModelScreen, SupportingScreen } from "../scenes/mainScenes/Home/TabScreens/targetScreen1";
import TasksScreen, { TodayScreen, UpcomingScreen, PendingScreen } from "../scenes/mainScenes/Home/TabScreens/tasksScreen";
import { SalesComparisonScreen } from "../scenes/mainScenes/Home/TabScreens/salesComparisonScreen";

import { Colors } from "../styles";
import {View} from "react-native";

const DashboardTopTabNavigatorIdentifiers = {
  target: "Target V/s Actual",
  Supporting: "Supporting parameters",
};

const DashboardTopTab = createMaterialTopTabNavigator();

const tabBarOptions = {
  activeTintColor: Colors.RED,
  inactiveTintColor: Colors.TARGET_GRAY,
  indicatorStyle: {
    backgroundColor: Colors.RED,
    // width: 140,
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: "600",
  },
  style: {
    innerWidth: '90%'
  }
}

const DashboardTopTabNavigatorNew = () => {

  return (
      <View>
        <TargetScreen />
      </View>
      // <DashboardTopTab.Navigator
      //     initialRouteName={DashboardTopTabNavigatorIdentifiers.target}
      //     tabBarOptions={tabBarOptions}
      //     screenOptions={{}}
      // >
      //     <DashboardTopTab.Screen
      //         name={DashboardTopTabNavigatorIdentifiers.target}
      //         component={TargetScreen}
      //         // options={{ title: "Target vs Actual" }}
      //         options={{ title: "Dashboard" }}
      //     />
      //      <DashboardTopTab.Screen
      //         name={DashboardTopTabNavigatorIdentifiers.Supporting}
      //         component={SupportingScreen}
      //         options={{ title: "Supporting parameters" }}
      //     />
      // </DashboardTopTab.Navigator>
  );
};

export { DashboardTopTabNavigatorNew };
