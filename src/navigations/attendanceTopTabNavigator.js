import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PreEnquiryScreen from "../scenes/mainScenes/EMS/preEnquiryScreen";
import EnquiryScreen from "../scenes/mainScenes/EMS/enquiryScreen";
import PreBookingScreen from "../scenes/mainScenes/EMS/prebookingScreen";
import BookingScreen from "../scenes/mainScenes/EMS/bookingScreen";
import { Colors } from "../styles";
import * as AsyncStore from "../asyncStore";
import ProceedToBookingScreen from "../scenes/mainScenes/MyTasks/proceedToBookingScreen";
import Leads from "../scenes/mainScenes/EMS/leadsScreen";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import AttendanceScreen from "../scenes/mainScenes/Attendance";
import AttendanceTopTabScreen from "../scenes/mainScenes/Attendance/AttendanceTop";

export const EmsTopTabNavigatorIdentifiers = {
  preEnquiry: "PRE_ENQUIRY",
  leads: "LEADS",
  enquiry: "ENQUIRY",
  preBooking: "PRE_BOOKING",
  booking: "BOOKING",
  proceedToBooking: "PROCEED_BOOKING",
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

const EMSTopTabNavigatorOne = () => {
  return (
    <AttendanceTopTab.Navigator
      initialRouteName={EmsTopTabNavigatorIdentifiers.preEnquiry}
      tabBarOptions={tabBarOptions}
    >
      <AttendanceTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.preEnquiry}
        component={PreEnquiryScreen}
        options={{ title: "Contacts" }}
      />
    </AttendanceTopTab.Navigator>
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
      {/* <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>
          {title == "CONTACTS"
            ? countList
              ? countList.length
              : 0
            : countList &&
              countList?.dmsEntity?.leadDtoPage?.numberOfElements > 0
            ? countList.dmsEntity.leadDtoPage.numberOfElements
            : 0}
        </Text>
      </View> */}
    </View>
  );
};

const AttendanceTopTabNavigatorTwo = () => {
  const { pre_enquiry_list } = useSelector((state) => state.preEnquiryReducer);
  const { leadList } = useSelector((state) => state.leaddropReducer);
  return (
    <AttendanceTopTab.Navigator
      initialRouteName={EmsTopTabNavigatorIdentifiers.preEnquiry}
      tabBarOptions={tabBarOptions}
    >
      <AttendanceTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.preEnquiry}
        component={AttendanceTopTabScreen}
        options={{
          title: ({ focused }) => (
            <Badge
              title={"Attendance"}
              focused={focused}
              //   countList={pre_enquiry_list}
            />
          ),
        }}
      />
      <AttendanceTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.leads}
        component={AttendanceScreen}
        options={{
          title: ({ focused }) => (
            <Badge
              title={"Leaves"}
              focused={focused}
              //  countList={leadList}
            />
          ),
        }}
      />
      {/*<EMSTopTab.Screen*/}
      {/*  name={EmsTopTabNavigatorIdentifiers.enquiry}*/}
      {/*  component={EnquiryScreen}*/}
      {/*  options={{ title: "Enquiry" }}*/}
      {/*/>*/}
      {/*<EMSTopTab.Screen*/}
      {/*  name={EmsTopTabNavigatorIdentifiers.preBooking}*/}
      {/*  component={PreBookingScreen}*/}
      {/*  options={{ title: "Booking Approval" }}*/}
      {/*/>*/}
      {/*<EMSTopTab.Screen*/}
      {/*  name={EmsTopTabNavigatorIdentifiers.booking}*/}
      {/*  component={BookingScreen}*/}
      {/*  options={{ title: "Booking View" }}*/}
      {/*/>*/}
      {/* <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.proceedToBooking}
        component={ProceedToBookingScreen}
        initialParams={{ accessoriesList: [] }}
        options={{ title: "Proceed To Booking" }}
      /> */}
    </AttendanceTopTab.Navigator>
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

export { EMSTopTabNavigatorOne, AttendanceTopTabNavigatorTwo };
