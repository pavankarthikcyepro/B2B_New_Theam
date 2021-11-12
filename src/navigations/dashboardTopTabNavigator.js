import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DataScreen, { LostScreen, DropScreen } from "../scenes/mainScenes/Home/TabScreens/dataScreen";
import TargetScreen, { ParameterScreen, LiveScreen, EventScreen, LeadSourceScreen, VehicleModelScreen } from "../scenes/mainScenes/Home/TabScreens/targetScreen";
import TasksScreen, { TodayScreen, UpcomingScreen, PendingScreen } from "../scenes/mainScenes/Home/TabScreens/tasksScreen";

import { Colors } from "../styles";

const DashboardTopTabNavigatorIdentifiers = {
    data: "DATA",
    target: "TARGET",
    tasks: "TASKS"
};

const DataTopTabIdentifiers = {
    lost: "LOST",
    drop: "DROP"
}

const TaskTopTabIdentifiers = {
    today: "TODAY",
    upcoming: "UPCOMING",
    pending: "PENDING"
}

const TargetTopTabIdentifiers = {
    parameters: "TODAY",
    live: "UPCOMING",
    events: "PENDING"
}

const DashboardTopTab = createMaterialTopTabNavigator();
const DataTopTab = createMaterialTopTabNavigator();
const TaskTopTab = createMaterialTopTabNavigator();
const TargetTopTab = createMaterialTopTabNavigator();
const LiveTopTab = createMaterialTopTabNavigator();


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
            initialRouteName={DataTopTabIdentifiers.lost}
            tabBarOptions={tabBarOptions1}
        >
            <DataTopTab.Screen
                name={DataTopTabIdentifiers.lost}
                component={LostScreen}
                options={{ title: "Lost" }}
            />
            <DataTopTab.Screen
                name={DataTopTabIdentifiers.drop}
                component={DropScreen}
                options={{ title: "Drop" }}
            />
        </DataTopTab.Navigator>
    );
};

const TasksTopTabNavigator = () => {

    return (
        <TaskTopTab.Navigator
            initialRouteName={TaskTopTabIdentifiers.today}
            tabBarOptions={tabBarOptions1}
        >
            <TaskTopTab.Screen
                name={TaskTopTabIdentifiers.today}
                component={TodayScreen}
                options={{ title: "Today" }}
            />
            <TaskTopTab.Screen
                name={TaskTopTabIdentifiers.upcoming}
                component={UpcomingScreen}
                options={{ title: "Upcoming" }}
            />
            <TaskTopTab.Screen
                name={TaskTopTabIdentifiers.pending}
                component={PendingScreen}
                options={{ title: "Pending" }}
            />
        </TaskTopTab.Navigator>
    );
};

const LiveTopTabNavigator = () => {

    return (
        <LiveTopTab.Navigator
            initialRouteName={"LEAD_SOURCE"}
            tabBarOptions={tabBarOptions1}
        >
            <LiveTopTab.Screen
                name={"LEAD_SOURCE"}
                component={LeadSourceScreen}
                options={{ title: "Lead Source" }}
            />
            <LiveTopTab.Screen
                name={"VEHICLE_MODEL"}
                component={VehicleModelScreen}
                options={{ title: "Vehicle Model" }}
            />
        </LiveTopTab.Navigator>
    );
};

const TargetTopTabNavigator = () => {

    return (
        <TargetTopTab.Navigator
            initialRouteName={TargetTopTabIdentifiers.parameters}
            tabBarOptions={tabBarOptions1}
        >
            <TargetTopTab.Screen
                name={TargetTopTabIdentifiers.parameters}
                component={ParameterScreen}
                options={{ title: "Parameters" }}
            />
            <TargetTopTab.Screen
                name={TargetTopTabIdentifiers.live}
                component={LiveTopTabNavigator}
                options={{ title: "Live E/F" }}
            />
            <TargetTopTab.Screen
                name={TargetTopTabIdentifiers.events}
                component={EventScreen}
                options={{ title: "Events" }}
            />
        </TargetTopTab.Navigator>
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
                component={TasksTopTabNavigator}
                options={{ title: "Tasks" }}
            />
            <DashboardTopTab.Screen
                name={DashboardTopTabNavigatorIdentifiers.target}
                component={TargetTopTabNavigator}
                options={{ title: "Target/Achiv" }}
            />
        </DashboardTopTab.Navigator>
    );
};

export { DashboardTopTabNavigator };
