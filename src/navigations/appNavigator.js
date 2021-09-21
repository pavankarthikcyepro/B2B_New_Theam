import * as React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { IconButton } from "react-native-paper";
import VectorImage from "react-native-vector-image";
import { Colors } from "../styles";
import {
  EMS_LINE,
  HOME_LINE,
  HOME_FILL,
  SCHEDULE_FILL,
  SCHEDULE_LINE,
} from "../assets/svg";

import HomeScreen from "../scenes/mainScenes/Home";
import EMSScreen from "../scenes/mainScenes/EMS";
import MyTasksScreen from "../scenes/mainScenes/MyTasks";

import EventManagementScreen from "../scenes/mainScenes/eventManagementScreen";
import SettingsScreen from "../scenes/mainScenes/settingsScreen";
import UpcomingDeliveriesScreen from "../scenes/mainScenes/upcomingDeliveriesScreen";
import ComplaintsScreen from "../scenes/mainScenes/complaintsScreen";
import SideMenuScreen from "../scenes/mainScenes/sideMenuScreen";
import NotificationScreen from "../scenes/mainScenes/notificationsScreen";
import AddPreEnquiryScreen from "../scenes/mainScenes/EMS/addPreEnquiryScreen";
import ConfirmedPreEnquiryScreen from "../scenes/mainScenes/EMS/confirmedPreEnquiryScreen";
import EnquiryFormScreen from "../scenes/mainScenes/EMS/enquiryFormScreen";
import PreBookingFormScreen from "../scenes/mainScenes/EMS/prebookingFormScreen";
import PreBookingScreen from "../scenes/mainScenes/EMS/prebookingScreen";
import HomeVisitScreen from "../scenes/mainScenes/MyTasks/homeVisitScreen";
import PreBookingFollowUpScreen from "../scenes/mainScenes/MyTasks/preBookingFollowUpScreen";
import TestDriveScreen from "../scenes/mainScenes/MyTasks/testDriveScreen";
import EnquiryFollowUpScreen from "../scenes/mainScenes/MyTasks/enquiryFollowUpScreen";
import TestEnquiryFormScreen from "../scenes/mainScenes/EMS/testEnquiryFormScreen";
import PaidAccessoriesScreen from "../scenes/mainScenes/EMS/paidAccessoriesScreen";
import ProceedToPreBookingScreen from "../scenes/mainScenes/MyTasks/proceedToPreBookingScreen";

const drawerWidth = 300;
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

const MenuIcon = ({ navigation }) => {
  return (
    <IconButton
      icon="menu"
      color={Colors.WHITE}
      size={30}
      onPress={() => navigation.openDrawer()}
    />
  );
};

const SearchIcon = () => {
  return (
    <IconButton
      icon="magnify"
      color={Colors.WHITE}
      size={25}
      onPress={() => console.log("Pressed")}
    />
  );
};

const NotficationIcon = ({ navigation, identifier }) => {
  return (
    <IconButton
      icon="bell"
      color={Colors.WHITE}
      size={25}
      onPress={() => {
        navigation.navigate(identifier);
      }}
    />
  );
};

export const DrawerStackIdentifiers = {
  home: "HOME_SCREEN",
  upcomingDeliveries: "UPCOMING_DELIVERIES",
  complaint: "COMPLAINTS",
  settings: "SETTINGS",
  notification: "NOTIFICATION",
  eventManagement: "EVENT_MANAGEMENT",
  preBooking: "PRE_BOOKING",
};

export const TabStackIdentifiers = {
  home: "HOME_TAB",
  ems: "EMS_TAB",
  myTask: "MY_TASK_TAB",
};

export const EmsStackIdentifiers = {
  addPreEnq: "ADD_PRE_ENQUIRY",
  confirmedPreEnq: "CONFIRMED_PRE_ENQUIRY",
  detailsOverview: "DETAILS_OVERVIEW",
  preBookingForm: "PRE_BOOKING_FORM",
  paidAccessories: "PAID_ACCESSORIES",
  proceedToPreBooking: "PROCEED_TO_PRE_BOOKING"
};

export const PreBookingStackIdentifiers = {
  preBooking: "PRE_BOOKING",
  preBookingForm: "PRE_BOOKING_FORM",
};

export const MyTasksStackIdentifiers = {
  mytasks: "MY_TASKS",
  homeVisit: "HOME_VISIT",
  preBookingFollowUp: "PREBOOKING_FOLLOWUP",
  testDrive: "TEST_DRIVE",
  enquiryFollowUp: "ENQUIRY_FOLLOW_UP",
  proceedToPreBooking: "PROCEED_TO_PRE_BOOKING"
};

const HomeStack = createStackNavigator();

const HomeStackNavigator = ({ navigation }) => {
  return (
    <HomeStack.Navigator
      initialRouteName={"Home"}
      screenOptions={screeOptionStyle}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Dashboard",
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => {
            return (
              <View style={{ flexDirection: "row" }}>
                <NotficationIcon
                  navigation={navigation}
                  identifier={"NOTIF_1"}
                />
              </View>
            );
          },
        }}
      />

      <HomeStack.Screen
        name={"NOTIF_1"}
        component={NotificationScreen}
        options={{ title: "Notfications" }}
      />
    </HomeStack.Navigator>
  );
};

const EmsStack = createStackNavigator();

const EmsStackNavigator = ({ navigation }) => {
  return (
    <EmsStack.Navigator
      initialRouteName={"EMS"}
      screenOptions={screeOptionStyle}
    >
      <EmsStack.Screen
        name="EMS"
        component={EMSScreen}
        options={{
          title: "EMS",
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => {
            return (
              <View style={{ flexDirection: "row" }}>
                <SearchIcon />
                <NotficationIcon
                  navigation={navigation}
                  identifier={"NOTIF_2"}
                />
              </View>
            );
          },
        }}
      />

      <EmsStack.Screen
        name={"NOTIF_2"}
        component={NotificationScreen}
        options={{ title: "Notfications" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.addPreEnq}
        component={AddPreEnquiryScreen}
        options={{ title: "Pre-Enquiry" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.confirmedPreEnq}
        component={ConfirmedPreEnquiryScreen}
        options={{ title: "Pre-Enquiry" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.detailsOverview}
        component={EnquiryFormScreen}
        options={{ title: "Enquiry Form" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.preBookingForm}
        component={PreBookingFormScreen}
        options={{ title: "Pre-Booking Form" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.paidAccessories}
        component={PaidAccessoriesScreen}
        options={{ title: "Paid Accessories" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.proceedToPreBooking}
        component={ProceedToPreBookingScreen}
        options={{ title: "Proceed To PreBooking" }}
      />
    </EmsStack.Navigator>
  );
};

const MyTaskStack = createStackNavigator();

const MyTaskStackNavigator = ({ navigation }) => {
  return (
    <MyTaskStack.Navigator
      initialRouteName={MyTasksStackIdentifiers.mytasks}
      screenOptions={screeOptionStyle}
    >
      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.mytasks}
        component={MyTasksScreen}
        options={{
          title: "My Tasks",
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => {
            return (
              <View style={{ flexDirection: "row" }}>
                <SearchIcon />
                <NotficationIcon
                  navigation={navigation}
                  identifier={"NOTIF_3"}
                />
              </View>
            );
          },
        }}
      />

      <MyTaskStack.Screen
        name={"NOTIF_3"}
        component={NotificationScreen}
        options={{ title: "Notfications" }}
      />

      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.homeVisit}
        component={HomeVisitScreen}
        options={{ title: "Home Visit" }}
      />
      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.preBookingFollowUp}
        component={PreBookingFollowUpScreen}
        options={{ title: "Prekbooking Followup" }}
      />

      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.testDrive}
        component={TestDriveScreen}
        options={{ title: "Test Drive" }}
      />

      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.enquiryFollowUp}
        component={EnquiryFollowUpScreen}
        options={{ title: "Enquiry Follow Up" }}
      />

      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.proceedToPreBooking}
        component={ProceedToPreBookingScreen}
        options={{ title: "Proceed To PreBooking" }}
      />
    </MyTaskStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === TabStackIdentifiers.home) {
            iconName = focused ? HOME_FILL : HOME_LINE;
          } else if (route.name === TabStackIdentifiers.ems) {
            iconName = focused ? HOME_FILL : EMS_LINE;
          } else if (route.name === TabStackIdentifiers.myTask) {
            iconName = focused ? SCHEDULE_FILL : SCHEDULE_LINE;
          }

          return (
            <VectorImage
              width={size}
              height={size}
              source={iconName}
              style={{ tintColor: color }}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.RED,
        inactiveTintColor: "gray",
      }}
      initialRouteName={TabStackIdentifiers.home}
    >
      <Tab.Screen
        name={TabStackIdentifiers.home}
        component={HomeStackNavigator}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name={TabStackIdentifiers.ems}
        component={EmsStackNavigator}
        options={{ title: "EMS" }}
      />
      <Tab.Screen
        name={TabStackIdentifiers.myTask}
        component={MyTaskStackNavigator}
        options={{ title: "My Tasks" }}
      />
    </Tab.Navigator>
  );
};

const ComplaintStack = createStackNavigator();

const ComplaintStackNavigator = ({ navigation }) => {
  return (
    <ComplaintStack.Navigator
      initialRouteName={"COMPLAINT_SCREEN"}
      screenOptions={screeOptionStyle}
    >
      <ComplaintStack.Screen
        name={"COMPLAINT_SCREEN"}
        component={ComplaintsScreen}
        options={{
          title: "Complaints",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </ComplaintStack.Navigator>
  );
};

const UpcomingDeliveriestStack = createStackNavigator();

const UpcomingDeliveriestStackNavigator = ({ navigation }) => {
  return (
    <UpcomingDeliveriestStack.Navigator
      initialRouteName={"UPCOMING_DELIVERIES_SCREEN"}
      screenOptions={screeOptionStyle}
    >
      <UpcomingDeliveriestStack.Screen
        name={"UPCOMING_DELIVERIES_SCREEN"}
        component={UpcomingDeliveriesScreen}
        options={{
          title: "Upcoming Deliveries",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </UpcomingDeliveriestStack.Navigator>
  );
};

const SettingsStack = createStackNavigator();

const SettingsStackNavigator = ({ navigation }) => {
  return (
    <SettingsStack.Navigator
      initialRouteName={"SETTINGS_SCREEN"}
      screenOptions={screeOptionStyle}
    >
      <SettingsStack.Screen
        name={"SETTINGS_SCREEN"}
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </SettingsStack.Navigator>
  );
};

const EventManagementStack = createStackNavigator();

const EventManagementStackNavigator = ({ navigation }) => {
  return (
    <EventManagementStack.Navigator
      initialRouteName={"EVENT_MANAGEMENT"}
      screenOptions={screeOptionStyle}
    >
      <ComplaintStack.Screen
        name={"EVENT_MANAGEMENT"}
        component={EventManagementScreen}
        options={{
          title: "Event Management",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </EventManagementStack.Navigator>
  );
};

const PreBookingStack = createStackNavigator();

const PreBookingStackNavigator = ({ navigation }) => {
  return (
    <PreBookingStack.Navigator
      initialRouteName={PreBookingStackIdentifiers.preBooking}
      screenOptions={screeOptionStyle}
    >
      <PreBookingStack.Screen
        name={PreBookingStackIdentifiers.preBooking}
        component={PreBookingScreen}
        options={{
          title: "Pre Booking",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />

      <PreBookingStack.Screen
        name={PreBookingStackIdentifiers.preBookingForm}
        component={PreBookingFormScreen}
        options={{
          title: "Pre Booking Form",
        }}
      />
    </PreBookingStack.Navigator>
  );
};

const MainDrawerNavigator = createDrawerNavigator();

const MainStackDrawerNavigator = () => {
  return (
    <MainDrawerNavigator.Navigator
      drawerStyle={{
        width: drawerWidth,
      }}
      drawerContent={(props) => <SideMenuScreen {...props} />}
      initialRouteName={DrawerStackIdentifiers.home}
    >
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.home}
        component={TabNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.upcomingDeliveries}
        component={UpcomingDeliveriestStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.complaint}
        component={ComplaintStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.settings}
        component={SettingsStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.eventManagement}
        component={EventManagementStackNavigator}
      />

      {/* <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.preBooking}
        component={PreBookingStackNavigator}
      /> */}
    </MainDrawerNavigator.Navigator>
  );
};

export { MainStackDrawerNavigator };
