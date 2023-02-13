import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors } from "../styles";
import * as AsyncStore from "../asyncStore";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import AttendanceScreen from "../scenes/mainScenes/Attendance";
import AttendanceTopTabScreen from "../scenes/mainScenes/Attendance/AttendanceTop";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon } from "./appNavigator";
import TeamAttendanceScreen from "../scenes/mainScenes/Attendance/TeamAttendance";
import AttendanceTeamMemberScreen from "../scenes/mainScenes/Attendance/teamIndex";
import { IconButton } from "react-native-paper";
import { AppNavigator } from ".";
import AttendanceFilter from "../scenes/mainScenes/Attendance/AttendanceFilter";
import AttendanceDashboard from "../scenes/mainScenes/Attendance/Dashboard";
import FilterAttendanceDashBoardScreen from "../scenes/mainScenes/Attendance/DashboardFilter";

import OverviewScreen from "../scenes/mainScenes/MyStock/overview";
import OverviewDetailScreen from "../scenes/mainScenes/MyStock/overviewDetail";
import AvailableScreen from "../scenes/mainScenes/MyStock/availableTab";
import VariantDetailScreen from "../scenes/mainScenes/MyStock/variantDetail";
import InTransitScreen from "../scenes/mainScenes/MyStock/inTransitTab";
import MyStockFilter from "../scenes/mainScenes/MyStock/filter";
import InTransitDetailScreen from "../scenes/mainScenes/MyStock/inTransitDetails";

export const MyStockTopTabNavigatorIdentifiers = {
  overview: "OVERVIEW",
  available: "AVAILABLE",
  inTransit: "IN_TRANSIT",
  filter: "FILTER",
  myStock: "MY_STOCK",
  detail: "DETAIL",
  variant: "VARIANT",
  inTransitDetail: "IN_TRANSIT_DETAIL",
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

const MyStockTopTab = createMaterialTopTabNavigator();

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

const MyStockMainTopTab = createStackNavigator();

const MyStockMainTopTabNavigator = ({ navigation }) => {
  return (
    <MyStockMainTopTab.Navigator
      initialRouteName={MyStockTopTabNavigatorIdentifiers.myStock}
      tabBarOptions={tabBarOptions}
      screenOptions={{ headerShown: false }}
    >
      <MyStockMainTopTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.myStock}
        component={MyStockTopTabNavigator}
        options={{
          title: "My Stock",
          headerShown: true,
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => <MyTaskFilter navigation={navigation} />,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
      <MyStockMainTopTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.detail}
        component={OverviewDetailScreen}
        options={{
          title: "Detail",
          headerShown: true,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
      <MyStockMainTopTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.variant}
        component={VariantDetailScreen}
        options={{
          title: "Detail",
          headerShown: true,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
      <MyStockMainTopTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.inTransitDetail}
        component={InTransitDetailScreen}
        options={{
          title: "Detail",
          headerShown: true,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
      <MyStockMainTopTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.filter}
        component={MyStockFilter}
        options={{
          title: "Filter",
          headerShown: true,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
    </MyStockMainTopTab.Navigator>
  );
};

const Badge = ({ focused, title, countList }) => {
  return (
    <View style={styles.tabContainer}>
      <Text
        style={[
          styles.titleText,
          { color: focused ? Colors.RED : Colors.DARK_GRAY },
        ]}
      >
        {title}
      </Text>
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{25}</Text>
      </View>
    </View>
  );
};

const Badge1 = ({ focused, title, countList }) => {
  return (
    <View style={styles.tabContainer}>
      <Text
        style={[
          styles.titleText,
          { color: focused ? Colors.RED : Colors.DARK_GRAY },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

const MyStockTopTabNavigator = () => {
  return (
    <MyStockTopTab.Navigator
      initialRouteName={MyStockTopTabNavigatorIdentifiers.overview}
      tabBarOptions={tabBarOptions}
    >
      <MyStockTopTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.overview}
        component={OverviewTopTabNavigatorTeamsNav}
        options={{
          title: ({ focused }) => (
            <Badge1 title={"Overview"} focused={focused} />
          ),
        }}
      />
      <MyStockTopTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.available}
        component={AvailableScreen}
        options={{
          title: ({ focused }) => (
            <Badge1 title={"Detailed"} focused={focused} />
          ),
        }}
      />
      {/* <MyStockTopTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.available}
        component={AvailableScreen}
        options={{
          title: ({ focused }) => (
            <Badge title={"Available"} focused={focused} />
          ),
        }}
      /> */}
      {/* <MyStockTopTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.inTransit}
        component={InTransitScreen}
        options={{
          title: ({ focused }) => (
            <Badge title={"InTransit"} focused={focused} />
          ),
        }}
      /> */}
    </MyStockTopTab.Navigator>
  );
};

const OverviewTab = createStackNavigator();

const OverviewTopTabNavigatorTeamsNav = () => {
  return (
    <OverviewTab.Navigator
      initialRouteName={MyStockTopTabNavigatorIdentifiers}
      tabBarOptions={tabBarOptions}
      screenOptions={{ headerShown: false }}
    >
      <OverviewTab.Screen
        name={MyStockTopTabNavigatorIdentifiers.overview}
        component={OverviewScreen}
        options={{
          headerShown: false,
        }}
      />
    </OverviewTab.Navigator>
  );
};
const MyTaskFilter = ({ navigation }) => {
  const screen = useSelector((state) => state.myStockReducer.currentScreen);
  if (screen === "OVERVIEW") return <React.Fragment></React.Fragment>;
  return (
    <IconButton
      icon="filter-outline"
      style={{ paddingHorizontal: 0, marginHorizontal: 0 }}
      color={Colors.WHITE}
      size={25}
      onPress={() =>
        navigation.navigate(MyStockTopTabNavigatorIdentifiers.filter)
      }
    />
  );
};
// const MyDashboardTeamTab = createStackNavigator();

// const DAshboardTopTabNavigatorTeamsNav = () => {
//   return (
//     <MyDashboardTeamTab.Navigator
//       initialRouteName={AttendanceTopTabNavigatorIdentifiers.team}
//       tabBarOptions={tabBarOptions}
//       screenOptions={{ headerShown: false }}
//     >
//       <MyDashboardTeamTab.Screen
//         name={AttendanceTopTabNavigatorIdentifiers.dashboard}
//         component={AttendanceDashboard}
//         options={{
//           headerShown: false,
//           // title: ({ focused }) => <Badge title={"Team"} focused={focused} />,
//         }}
//       />
//       {/* <MyDashboardTeamTab.Screen
//         name={AttendanceTopTabNavigatorIdentifiers.dashboardFilter}
//         component={FilterAttendanceDashBoardScreen}
//         options={{
//           headerShown: false,
//           // title: ({ focused }) => <Badge title={"Leaves"} focused={focused} />,
//         }}
//       /> */}
//     </MyDashboardTeamTab.Navigator>
//   );
// };
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

export { MyStockTopTabNavigator, MyStockMainTopTabNavigator };
