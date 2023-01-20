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

export const AttendanceTopTabNavigatorIdentifiers = {
  myattendance: "MY_ATTENDANCE",
  attendance: "ATTENDANCE_1",
  leave: "LEAVE",
  team: "TEAM",
  team_attendance: "TEAM_ATTENDANCE",
  filter: "FILTER",
  dashboard: "DASHBOARD",
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

const MyAttendanceTopTab = createStackNavigator();

const MyAttendanceTopTabNavigatorOne = ({ navigation }) => {
  const selector = useSelector((state) => state.homeReducer);

  const [handleTabDisplay, setHandleTabDisplay] = useState(0);

  useEffect(async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (
        jsonObj.hrmsRole === "branch manager" ||
        jsonObj.hrmsRole === "MD" ||
        jsonObj.hrmsRole === "Sales Manager"
      ) {
        setHandleTabDisplay(2);
      } else {
        setHandleTabDisplay(1);
      }
    }
  }, []);

  return (
    <MyAttendanceTopTab.Navigator
      initialRouteName={AttendanceTopTabNavigatorIdentifiers.myattendance}
      tabBarOptions={tabBarOptions}
      screenOptions={{ headerShown: false }}
    >
      <MyAttendanceTopTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.myattendance}
        component={
          selector?.isDSE
            ? AttendanceTopTabNavigatorTwo
            : AttendanceTopTabNavigatorTeams
        }
        options={{
          title: "My Attendance",
          headerShown: true,
          headerLeft: () => <MenuIcon navigation={navigation} />,
          // headerRight: () =>
          //   selector?.isDSE ? null : (
          //     <IconButton
          //       icon="filter-outline"
          //       style={{ padding: 0, margin: 0 }}
          //       color={Colors.WHITE}
          //       size={30}
          //       onPress={() =>
          //         navigation.navigate(
          //           AttendanceTopTabNavigatorIdentifiers.filter
          //         )
          //       }
          //     />
          //   ),
          headerStyle: screeOptionStyle.headerStyle,
          headerTitleStyle: screeOptionStyle.headerTitleStyle,
          headerTintColor: screeOptionStyle.headerTintColor,
          headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
        }}
      />
      <MyAttendanceTopTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.filter}
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
    </MyAttendanceTopTab.Navigator>
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
      initialRouteName={AttendanceTopTabNavigatorIdentifiers.attendance}
      tabBarOptions={tabBarOptions}
    >
      <AttendanceTopTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.attendance}
        component={AttendanceTopTabScreen}
        options={{
          title: ({ focused }) => (
            <Badge title={"Attendance"} focused={focused} />
          ),
        }}
      />
      <AttendanceTopTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.leave}
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
      initialRouteName={AttendanceTopTabNavigatorIdentifiers.dashboard}
      tabBarOptions={tabBarOptions}
    >
      <AttendanceTopTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.dashboard}
        component={AttendanceDashboard}
        options={{
          title: ({ focused }) => (
            <Badge title={"Dashboard"} focused={focused} />
          ),
        }}
      />
      <AttendanceTopTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.attendance}
        component={AttendanceTopTabScreen}
        options={{
          title: ({ focused }) => (
            <Badge title={"Attendance"} focused={focused} />
          ),
        }}
      />
      <AttendanceTopTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.leave}
        component={AttendanceScreen}
        options={{
          title: ({ focused }) => <Badge title={"Leaves"} focused={focused} />,
        }}
      />
      <AttendanceTopTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.team}
        component={AttendanceTopTabNavigatorTeamsNav}
        options={{
          title: ({ focused }) => <Badge title={"Team"} focused={focused} />,
        }}
      />
    </AttendanceTopTab.Navigator>
  );
};

const MyAttendanceTeamTab = createStackNavigator();

const AttendanceTopTabNavigatorTeamsNav = () => {
  return (
    <MyAttendanceTeamTab.Navigator
      initialRouteName={AttendanceTopTabNavigatorIdentifiers.team}
      tabBarOptions={tabBarOptions}
      screenOptions={{ headerShown: false }}
    >
      <MyAttendanceTeamTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.team}
        component={TeamAttendanceScreen}
        options={{
          headerShown: false,
          // title: ({ focused }) => <Badge title={"Team"} focused={focused} />,
        }}
      />
      <MyAttendanceTeamTab.Screen
        name={AttendanceTopTabNavigatorIdentifiers.team_attendance}
        component={AttendanceTeamMemberScreen}
        options={{
          headerShown: false,
          // title: ({ focused }) => <Badge title={"Leaves"} focused={focused} />,
        }}
      />
    </MyAttendanceTeamTab.Navigator>
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

export { MyAttendanceTopTabNavigatorOne, AttendanceTopTabNavigatorTwo };
