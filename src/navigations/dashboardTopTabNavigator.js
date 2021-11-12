import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DataScreen from "../scenes/mainScenes/Home/TabScreens/dataScreen";
import TargetScreen from "../scenes/mainScenes/Home/TabScreens/targetScreen";
import TasksScreen from "../scenes/mainScenes/Home/TabScreens/tasksScreen";

import { Colors } from "../styles";

const DashboardTopTabNavigatorIdentifiers = {
    data: "DATA",
    target: "TARGET",
    tasks: "TASKS"
};

const DashboardTopTab = createMaterialTopTabNavigator();
const DataTopTab = createMaterialTopTabNavigator();

const tabBarOptions = {
    activeTintColor: Colors.RED,
    inactiveTintColor: Colors.DARK_GRAY,
    indicatorStyle: {
        backgroundColor: Colors.RED,
    },
    labelStyle: {
        fontSize: 12,
        fontWeight: "600",
    }
}

const tabBarOptions1 = {
    activeTintColor: Colors.BLUE,
    inactiveTintColor: Colors.DARK_GRAY,
    indicatorStyle: {
        backgroundColor: Colors.BLUE,
    },
    labelStyle: {
        fontSize: 10,
        fontWeight: "600",
        height: 25
    },
    tabStyle: {
        height: 40
    }
}

const DataTopTabNavigator = () => {

    return (
        <DataTopTab.Navigator
            initialRouteName={DashboardTopTabNavigatorIdentifiers.data}
            tabBarOptions={tabBarOptions1}
        >
            <DataTopTab.Screen
                name={DashboardTopTabNavigatorIdentifiers.data}
                component={DataScreen}
                options={{ title: "Lost" }}
            />
            <DataTopTab.Screen
                name={DashboardTopTabNavigatorIdentifiers.tasks}
                component={TasksScreen}
                options={{ title: "Drop" }}
            />
        </DataTopTab.Navigator>
    );
};

const DashboardTopTabNavigator = () => {

    return (
        <DashboardTopTab.Navigator
            initialRouteName={DashboardTopTabNavigatorIdentifiers.data}
            tabBarOptions={tabBarOptions}
            screenOptions={{}}
        >
            <DashboardTopTab.Screen
                name={DashboardTopTabNavigatorIdentifiers.data}
                component={DataTopTabNavigator}
                options={{ title: "Data" }}
            />
            <DashboardTopTab.Screen
                name={DashboardTopTabNavigatorIdentifiers.tasks}
                component={TasksScreen}
                options={{ title: "Tasks" }}
            />
            <DashboardTopTab.Screen
                name={DashboardTopTabNavigatorIdentifiers.target}
                component={TargetScreen}
                options={{ title: "Target/Achiv" }}
            />
        </DashboardTopTab.Navigator>
    );
};

export { DashboardTopTabNavigator };
