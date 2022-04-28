import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DataScreen, { LostScreen, DropScreen } from "../scenes/mainScenes/Home/TabScreens/dataScreen";
import TargetScreen, { ParameterScreen, LiveScreen, EventScreen, LeadSourceScreen, VehicleModelScreen } from "../scenes/mainScenes/Home/TabScreens/targetScreen";
import TasksScreen, { TodayScreen, UpcomingScreen, PendingScreen } from "../scenes/mainScenes/Home/TabScreens/tasksScreen";
import { SalesComparisonScreen } from "../scenes/mainScenes/Home/TabScreens/salesComparisonScreen";

import { Colors } from "../styles";

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
        fontSize: 12,
        fontWeight: "600",
    },
    style: {
        innerWidth: '90%'
    }
}

const DashboardTopTabNavigatorNew = () => {

    return (
        <DashboardTopTab.Navigator
            initialRouteName={DashboardTopTabNavigatorIdentifiers.target}
            tabBarOptions={tabBarOptions}
            screenOptions={{}}
        >
            <DashboardTopTab.Screen
                name={DashboardTopTabNavigatorIdentifiers.target}
                component={TargetScreen}
                options={{ title: "Target V/s Actual" }}
            />
            <DashboardTopTab.Screen
                name={DashboardTopTabNavigatorIdentifiers.Supporting}
                component={TargetScreen}
                options={{ title: "Supporting parameters" }}
            />
        </DashboardTopTab.Navigator>
    );
};

export { DashboardTopTabNavigatorNew };
