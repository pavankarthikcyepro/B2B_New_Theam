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
import DownloadReportScreen from "../scenes/mainScenes/Attendance/DownloadReport";
import ProfileScreen from "../scenes/mainScenes/Profile/Profile";

export const ProfileTopTabNavigatorIdentifiers = {
  myattendance: "MY_ATTENDANCE",
  attendance: "ATTENDANCE_1",
  leave: "LEAVE",
  team: "TEAM",
  team_attendance: "TEAM_ATTENDANCE",
  filter: "FILTER",
  dashboard: "DASHBOARD",
  dashboardFilter: "DASHBOARD FILTER",
  report: "REPORT",
  profile: "PROFILE",
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

const AttendanceTopTab = createMaterialTopTabNavigator();

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

const MyProfileTopTab = createStackNavigator();

const MyProfileTopTabNavigatorOne = ({ navigation }) => {
  const selector = useSelector((state) => state.homeReducer);

  return (
    <MyProfileTopTab.Navigator
      initialRouteName={ProfileTopTabNavigatorIdentifiers.profile}
      tabBarOptions={tabBarOptions}
      screenOptions={{ headerShown: false }}
    >
      <MyProfileTopTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.profile}
        component={ProfileScreen}
        options={{
          title: "Customer Information",
          headerShown: true,
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
      <MyProfileTopTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.filter}
        component={AttendanceFilter}
        options={{
          title: "Filter",
          headerShown: true,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
      <MyDashboardTeamTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.dashboardFilter}
        component={FilterAttendanceDashBoardScreen}
        options={{
          title: "Filter",
          headerShown: true,
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
    </MyProfileTopTab.Navigator>
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
    </View>
  );
};

const AttendanceTopTabNavigatorTwo = () => {
  return (
    <AttendanceTopTab.Navigator
      initialRouteName={ProfileTopTabNavigatorIdentifiers.attendance}
      tabBarOptions={tabBarOptions}
    >
      <AttendanceTopTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.attendance}
        component={AttendanceTopTabScreen}
        options={{
          title: ({ focused }) => (
            <Badge title={"Attendance"} focused={focused} />
          ),
        }}
      />
      <AttendanceTopTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.leave}
        component={AttendanceScreen}
        options={{
          title: ({ focused }) => <Badge title={"Leaves"} focused={focused} />,
        }}
      />
    </AttendanceTopTab.Navigator>
  );
};

const AttendanceTopTabNavigatorTeams = () => {
  return (
    <AttendanceTopTab.Navigator
      initialRouteName={ProfileTopTabNavigatorIdentifiers.dashboard}
      tabBarOptions={tabBarOptions}
    >
      <AttendanceTopTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.dashboard}
        component={AttendanceDashboard}
        options={{
          title: ({ focused }) => (
            <Badge title={"Dashboard"} focused={focused} />
          ),
        }}
      />
      <AttendanceTopTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.attendance}
        component={AttendanceTopTabScreen}
        options={{
          title: ({ focused }) => (
            <Badge title={"Attendance"} focused={focused} />
          ),
        }}
      />
      <AttendanceTopTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.leave}
        component={AttendanceScreen}
        options={{
          title: ({ focused }) => <Badge title={"Leaves"} focused={focused} />,
        }}
      />
      <AttendanceTopTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.team}
        component={AttendanceTopTabNavigatorTeamsNav}
        options={{
          title: ({ focused }) => <Badge title={"Team"} focused={focused} />,
        }}
      />
      {/* <AttendanceTopTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.report}
        component={DownloadReportScreen}
        options={{
          title: ({ focused }) => <Badge title={"Report"} focused={focused} />,
        }}
      /> */}
    </AttendanceTopTab.Navigator>
  );
};

const MyAttendanceTeamTab = createStackNavigator();

const AttendanceTopTabNavigatorTeamsNav = () => {
  return (
    <MyAttendanceTeamTab.Navigator
      initialRouteName={ProfileTopTabNavigatorIdentifiers.team}
      tabBarOptions={tabBarOptions}
      screenOptions={{ headerShown: false }}
    >
      <MyAttendanceTeamTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.team}
        component={TeamAttendanceScreen}
        options={{
          headerShown: false,
          // title: ({ focused }) => <Badge title={"Team"} focused={focused} />,
        }}
      />
      <MyAttendanceTeamTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.team_attendance}
        component={AttendanceTeamMemberScreen}
        options={{
          headerShown: false,
          // title: ({ focused }) => <Badge title={"Leaves"} focused={focused} />,
        }}
      />
    </MyAttendanceTeamTab.Navigator>
  );
};

const MyDashboardTeamTab = createStackNavigator();

const DAshboardTopTabNavigatorTeamsNav = () => {
  return (
    <MyDashboardTeamTab.Navigator
      initialRouteName={ProfileTopTabNavigatorIdentifiers.team}
      tabBarOptions={tabBarOptions}
      screenOptions={{ headerShown: false }}
    >
      <MyDashboardTeamTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.dashboard}
        component={AttendanceDashboard}
        options={{
          headerShown: false,
          // title: ({ focused }) => <Badge title={"Team"} focused={focused} />,
        }}
      />
      {/* <MyDashboardTeamTab.Screen
        name={ProfileTopTabNavigatorIdentifiers.dashboardFilter}
        component={FilterAttendanceDashBoardScreen}
        options={{
          headerShown: false,
          // title: ({ focused }) => <Badge title={"Leaves"} focused={focused} />,
        }}
      /> */}
    </MyDashboardTeamTab.Navigator>
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

export { MyProfileTopTabNavigatorOne, AttendanceTopTabNavigatorTwo };
