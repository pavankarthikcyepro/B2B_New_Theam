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

export const EmsTopTabNavigatorIdentifiers = {
  preEnquiry: "PRE_ENQUIRY",
  leads: 'LEADS',
  enquiry: "ENQUIRY",
  preBooking: "PRE_BOOKING",
  booking:"BOOKING",
  proceedToBooking: 'PROCEED_BOOKING'
};

const EMSTopTab = createMaterialTopTabNavigator();

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
        options={{ title: "Contacts" }}
      />
    </EMSTopTab.Navigator>
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
        <Text style={styles.badgeText}>
          {/* {title == "CONTACTS"
            ? countList
              ? countList.length
              : 0
            : countList && countList?.dmsEntity?.leadDtoPage?.totalElements > 0
            ? countList.dmsEntity.leadDtoPage.totalElements
            : 0} */}
          { countList && countList?.dmsEntity?.leadDtoPage?.totalElements > 0
              ? countList.dmsEntity.leadDtoPage.totalElements
              : 0}
        </Text>
      </View>
    </View>
  );
};

const EMSTopTabNavigatorTwo = () => {
  const { pre_enquiry_list_TotalElements } = useSelector((state) => state.preEnquiryReducer);
  const { leadList_totoalElemntData } = useSelector((state) => state.enquiryReducer);
  return (
    <EMSTopTab.Navigator
      initialRouteName={EmsTopTabNavigatorIdentifiers.preEnquiry}
      tabBarOptions={tabBarOptions}
    >
      <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.preEnquiry}
        component={PreEnquiryScreen}
        options={{
          title: ({ focused }) => (
            <Badge
              title={"CONTACTS"}
              focused={focused}
              countList={pre_enquiry_list_TotalElements}
            />
          ),
        }}
      />
      <EMSTopTab.Screen
        name={EmsTopTabNavigatorIdentifiers.leads}
        component={Leads}
        options={{
          title: ({ focused }) => (
            <Badge title={"LEADS"} focused={focused} countList={leadList_totoalElemntData} />
          ),
        }}
        initialParams={{
          screenName: "DEFAULT",
          params: "",
          moduleType: "",
          employeeDetail: "",
          selectedEmpId: "",
          startDate: "",
          endDate: "",
          dealerCodes: "",
          fromScreen:"DEFAULT"
        }}
        // listeners={({ navigation, route }) => ({
        //     tabPress: e => {
        //     navigation.setParams(
        //       {
        //         screenName: "DEFAULT",
        //         params: "",
        //         moduleType: "",
        //         employeeDetail: "",
        //         selectedEmpId: "",
        //         startDate: "",
        //         endDate: "",
        //         dealerCodes: "",
        //         fromScreen: "DEFAULT"
        //       })
        //     },
        // })}
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
    </EMSTopTab.Navigator>
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

export { EMSTopTabNavigatorOne, EMSTopTabNavigatorTwo };
