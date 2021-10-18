import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PreEnquiryScreen from "../scenes/mainScenes/EMS/preEnquiryScreen";
import EnquiryScreen from "../scenes/mainScenes/EMS/enquiryScreen";
import PreBookingScreen from "../scenes/mainScenes/EMS/prebookingScreen";
import { Colors } from "../styles";
import * as AsyncStore from "../asyncStore";

const EmsTopTabNavigatorIdentifiers = {
  preEnquiry: "PRE_ENQUIRY",
  enquiry: "ENQUIRY",
  preBooking: "PRE_BOOKING"
};

const EMSTopTab = createMaterialTopTabNavigator();

const EMSTopTabNavigator = () => {

  const [handleTabDisplay, setHandleTabDisplay] = useState(0);

  useEffect(async () => {

    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (jsonObj.hrmsRole === "Reception" || jsonObj.hrmsRole === "Tele Caller") {
        setHandleTabDisplay(1)
      } else {
        setHandleTabDisplay(2)
      }
    }
  }, [])


  return (
    <EMSTopTab.Navigator
      initialRouteName={EmsTopTabNavigatorIdentifiers.preEnquiry}
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
        name={EmsTopTabNavigatorIdentifiers.preEnquiry}
        component={PreEnquiryScreen}
        options={{ title: "Pre-Enquiry" }}
      />
      {handleTabDisplay == 2 && (
        <EMSTopTab.Screen
          name={EmsTopTabNavigatorIdentifiers.enquiry}
          component={EnquiryScreen}
          options={{ title: "Enquiry" }}
        />
      )}
      {handleTabDisplay == 2 && (
        <EMSTopTab.Screen
          name={EmsTopTabNavigatorIdentifiers.preBooking}
          component={PreBookingScreen}
          options={{ title: "Pre-Booking" }}
        />
      )}
    </EMSTopTab.Navigator>
  );
};

export { EMSTopTabNavigator };
