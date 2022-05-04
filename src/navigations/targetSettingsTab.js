import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DataScreen, { LostScreen, DropScreen } from "../scenes/mainScenes/Home/TabScreens/dataScreen";
import MainParamScreen from "../scenes/mainScenes/TargetSettingsScreen/TabScreen/mainParam";
import TasksScreen, { TodayScreen, UpcomingScreen, PendingScreen } from "../scenes/mainScenes/Home/TabScreens/tasksScreen";
import { SalesComparisonScreen } from "../scenes/mainScenes/Home/TabScreens/salesComparisonScreen";

import { Colors } from "../styles";

const TargetScreenTabIdentifiers = {
    target: "Main Parameter",
    Supporting: "Supporting parameters",
};

const TargetSettingsTopTab = createMaterialTopTabNavigator();

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

const TargetSettingsTab = () => {

    return (
        <TargetSettingsTopTab.Navigator
            initialRouteName={TargetScreenTabIdentifiers.target}
            tabBarOptions={tabBarOptions}
            screenOptions={{}}
        >
            <TargetSettingsTopTab.Screen
                name={TargetScreenTabIdentifiers.target}
                component={MainParamScreen}
                options={{ title: "Main Parameter" }}
            />
            <TargetSettingsTopTab.Screen
                name={TargetScreenTabIdentifiers.Supporting}
                component={MainParamScreen}
                options={{ title: "Supporting parameters" }}
            />
        </TargetSettingsTopTab.Navigator>
    );
};

export { TargetSettingsTab };
