import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "../styles";
import * as AsyncStore from "../asyncStore";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import GeolocationScreen from "../scenes/mainScenes/Geolocation";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon } from "./appNavigator";
import GeolocationMapScreen from "../scenes/mainScenes/Map/myGeolocationMap";
import TripListScreen from "../scenes/mainScenes/Map/ListScreen";

export const GeolocationTopTabNavigatorIdentifiers = {
  mygeolocation: "MY_GEOLOCATION",
  geolocation: "GEOLOCATION_1",
  map: "MAP",
  tripList :"TRIP_LIST"
};

const screeOptionStyle = {
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerStyle: {
    backgroundColor: Colors.DARK_GRAY,
  },
  headerTintColor: Colors.WHITE,
  headerBackTitleVisible: false,
};

const GeolocationTopTab = createStackNavigator();

const tabBarOptions = {
  activeTintColor: Colors.RED,
  inactiveTintColor: Colors.DARK_GRAY,
  indicatorStyle: {
    backgroundColor: Colors.RED,
  },
  labelStyle: {
    fontSize: 12,
    fontWeight: "600",
  },
};

const MyGeolocationTopTab = createStackNavigator();

const MyGeolocationTopTabNavigatorOne = ({ navigation }) => {
  return (
    <MyGeolocationTopTab.Navigator
      initialRouteName={GeolocationTopTabNavigatorIdentifiers.mygeolocation}
    //   tabBarOptions={tabBarOptions}
      screenOptions={{ headerShown: false }}
    >
      <MyGeolocationTopTab.Screen
        name={GeolocationTopTabNavigatorIdentifiers.mygeolocation}
        component={GeolocationTopTabNavigatorTwo}
      />
    </MyGeolocationTopTab.Navigator>
  );
};

const GeolocationTopTabNavigatorTwo = ({ navigation }) => {
  return (
    <GeolocationTopTab.Navigator
      initialRouteName={GeolocationTopTabNavigatorIdentifiers.geolocation}
      //   tabBarOptions={tabBarOptions}
    >
      <GeolocationTopTab.Screen
        name={GeolocationTopTabNavigatorIdentifiers.geolocation}
        component={GeolocationScreen}
        options={{
          title: "My Geolocation",
          headerShown: true,
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
      <GeolocationTopTab.Screen
        name={GeolocationTopTabNavigatorIdentifiers.tripList}
        component={TripListScreen}
        options={{
          title: "Trip List",
          headerShown: true,
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
      <GeolocationTopTab.Screen
        name={GeolocationTopTabNavigatorIdentifiers.map}
        component={GeolocationMapScreen}
        options={{
          title: "My Geolocation Map",
          headerShown: true,
          //   headerLeft: () => <MenuIcon navigation={navigation} />,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
    </GeolocationTopTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    position: "relative",
  },
  titleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeContainer: {
    marginLeft: 3,
    bottom: 4,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 13, color: Colors.PINK, fontWeight: "bold" },
});

export { MyGeolocationTopTabNavigatorOne, GeolocationTopTabNavigatorTwo };
