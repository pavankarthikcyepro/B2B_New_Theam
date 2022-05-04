import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PreEnquiryScreen from "../scenes/mainScenes/EMS/preEnquiryScreen";
import EnquiryScreen from "../scenes/mainScenes/EMS/enquiryScreen";
import PreBookingScreen from "../scenes/mainScenes/EMS/prebookingScreen";
import BookingScreen from "../scenes/mainScenes/EMS/bookingScreen";

import { Colors } from "../styles";
import * as AsyncStore from "../asyncStore";

const EmsTopTabNavigatorIdentifiers = {
  preEnquiry: "PRE_ENQUIRY",
  enquiry: "ENQUIRY",
  preBooking: "PRE_BOOKING",
  booking: "BOOKING"
};

const EMSTopTab = createMaterialTopTabNavigator();

const tabBarOptions = {
  activeTintColor: Colors.RED,
  inactiveTintColor: Colors.DARK_GRAY,
  indicatorStyle: {
    backgroundColor: Colors.RED,
  },
  labelStyle: {
    fontSize: 14,
    fontWeight: "600",
  },
}

const EMSTopTabNavigatorOne = () => {

  return (
    <EMSTopTab.Navigator
      initialRouteName={EmsTopTabNavigatorIdentifiers.preEnquiry}
      tabBarOptions={tabBarOptions}
    >
      <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.preEnquiry}
        component={PreEnquiryScreen}
        options={{ title: "Pre-Enquiry" }}
      />
    </EMSTopTab.Navigator>
  );
};

const EMSTopTabNavigatorTwo = () => {

  return (
    <EMSTopTab.Navigator
      initialRouteName={EmsTopTabNavigatorIdentifiers.preEnquiry}
      tabBarOptions={tabBarOptions}
    >
      <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.preEnquiry}
        component={PreEnquiryScreen}
        options={{ title: "Pre-Enquiry" }}
      />
      <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.enquiry}
        component={EnquiryScreen}
        options={{ title: "Enquiry" }}
      />
      <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.preBooking}
        component={PreBookingScreen}
        options={{ title: "Pre-Booking" }}
      />
      <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.booking}
        component={BookingScreen}
        options={{ title: "Booking" }}
      />
    </EMSTopTab.Navigator>
  );
};

export { EMSTopTabNavigatorOne, EMSTopTabNavigatorTwo };
