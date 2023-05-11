import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DataScreen, { LostScreen, DropScreen } from "../scenes/mainScenes/Home/TabScreens/dataScreen";
import TargetScreen, { ParameterScreen, LiveScreen, EventScreen, LeadSourceScreen, VehicleModelScreen, SupportingScreen } from "../scenes/mainScenes/Home/TabScreens/targetScreen1";
import TasksScreen, { TodayScreen, UpcomingScreen, PendingScreen } from "../scenes/mainScenes/Home/TabScreens/tasksScreen";
import { SalesComparisonScreen } from "../scenes/mainScenes/Home/TabScreens/salesComparisonScreen";
import * as AsyncStore from "../asyncStore";
import { Colors } from "../styles";
import {View} from "react-native";
import TargetScreenCRM from "../scenes/mainScenes/Home/TabScreens/TargetScreenCRM";

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
    fontSize: 16,
    fontWeight: "600",
  },
  style: {
    innerWidth: '90%'
  }
}
const receptionistRole = ["CRM"];
const receptionistRoleV2 = ["Reception", "CRM", "Tele Caller", "CRE"];
const DashboardTopTabNavigatorNew = () => {
  const [userData, setUserData] = useState({
    empId: 0,
    empName: "",
    hrmsRole: "",
    orgId: 0,
  });

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({
        empId: jsonObj.empId,
        empName: jsonObj.empName,
        hrmsRole: jsonObj.hrmsRole,
        orgId: jsonObj.orgId,
      });
    }
  }, []);
  return (
      <View>
      {receptionistRoleV2.includes(userData.hrmsRole) ? 

        <TargetScreenCRM />
         : 
          <TargetScreen />}
        
      </View>
      // <DashboardTopTab.Navigator
      //     initialRouteName={DashboardTopTabNavigatorIdentifiers.target}
      //     tabBarOptions={tabBarOptions}
      //     screenOptions={{}}
      // >
      //     <DashboardTopTab.Screen
      //         name={DashboardTopTabNavigatorIdentifiers.target}
      //         component={TargetScreen}
      //         // options={{ title: "Target vs Actual" }}
      //         options={{ title: "Dashboard" }}
      //     />
      //      <DashboardTopTab.Screen
      //         name={DashboardTopTabNavigatorIdentifiers.Supporting}
      //         component={SupportingScreen}
      //         options={{ title: "Supporting parameters" }}
      //     />
      // </DashboardTopTab.Navigator>
  );
};

export { DashboardTopTabNavigatorNew };
