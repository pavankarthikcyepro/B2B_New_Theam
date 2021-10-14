import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import EventListScreen from "../scenes/mainScenes/EventManagement/eventlist";
import PendingListScreen from "../scenes/mainScenes/EventManagement/pending";
import UpcomingEventListScreen from "../scenes/mainScenes/EventManagement/upcoming";
import { Colors } from "../styles";

const EventManagementTopTabNavigatorIdentifiers = {
  eventlist: "EVENTLIST",
  pending: "PENDING",
  upcoming: "UPCOMING",
};

const EventManagementTopTab = createMaterialTopTabNavigator();

const EventManagementTopTabNavigator = () => {
  return (
    <EventManagementTopTab.Navigator
      initialRouteName={EventManagementTopTabNavigatorIdentifiers.eventlist}
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
      <EventManagementTopTab.Screen
        name={EventManagementTopTabNavigatorIdentifiers.eventlist}
        component={EventListScreen}
        options={{ title: "Event List" }}
      />
      <EventManagementTopTab.Screen
        name={EventManagementTopTabNavigatorIdentifiers.pending}
        component={PendingListScreen}
        options={{ title: "Pending" }}
      />
      <EventManagementTopTab.Screen
        name={EventManagementTopTabNavigatorIdentifiers.upcoming}
        component={UpcomingEventListScreen}
        options={{ title: "Upcoming" }}
      />
    </EventManagementTopTab.Navigator>
  );
};

export { EventManagementTopTabNavigator };
