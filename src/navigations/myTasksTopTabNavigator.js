import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "../styles";
import CurrentTaskListScreen from "../scenes/mainScenes/MyTasks/currentTaskListScreen";
import PendingTaskListScreen from "../scenes/mainScenes/MyTasks/pendingTaskListScreen";

const MyTaskTopTabNavigatorIdentifiers = {
    currentTask: "CURRENT_TASK",
    pendingTask: "PENDING_TASK",
};

const EMSTopTab = createMaterialTopTabNavigator();

const MyTaskTopTabNavigator = () => {
    return (
        <EMSTopTab.Navigator
            initialRouteName={MyTaskTopTabNavigatorIdentifiers.currentTask}
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
                name={MyTaskTopTabNavigatorIdentifiers.currentTask}
                component={CurrentTaskListScreen}
                options={{ title: "Today's Tasks" }}
            />
            <EMSTopTab.Screen
                name={MyTaskTopTabNavigatorIdentifiers.pendingTask}
                component={PendingTaskListScreen}
                options={{ title: "Pending Tasks" }}
            />
        </EMSTopTab.Navigator>
    );
};

export { MyTaskTopTabNavigator };
