import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Linking,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { IconButton, Searchbar } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import VectorImage from "react-native-vector-image";
import { Colors } from "../styles";
// import {
//   EMS_LINE,
//   HOME_LINE,
//   HOME_FILL,
//   SCHEDULE_FILL,
//   SCHEDULE_LINE,
// } from "../assets/svg";
import { EventRegister } from 'react-native-event-listeners'
import EMS_LINE from "../assets/images/ems_line.svg"; // import SVG
import HOME_LINE from "../assets/images/home_line.svg"; // import SVG
import HOME_FILL from "../assets/images/home_fill.svg"; // import SVG
import { HOME_LINE_STR } from "../redux/sideMenuReducer"; //import SVG

import SCHEDULE_FILL from "../assets/images/schedule_fill.svg"; // import SVG
import SCHEDULE_LINE from "../assets/images/my_schedule.svg"; // import SVG
import PRICE from "../assets/images/price.svg"; // import SVG

import HomeScreen from "../scenes/mainScenes/Home";
import EMSScreen from "../scenes/mainScenes/EMS";
import MyTasksScreen from "../scenes/mainScenes/MyTasks";

import DigitalPaymentScreen from "../scenes/mainScenes/digitalPaymentScreen";
import MonthlyTargetScreen from "../scenes/mainScenes/monthlyTargetScreen";
import HelpDeskScreen from "../scenes/mainScenes/helpDeskScreen";
import taskManagementScreen from "../scenes/mainScenes/taskManagementScreen";
import TaskTranferScreen from "../scenes/mainScenes/taskTransferScreen";
import DropAnalysisScreen from "../scenes/mainScenes/dropAnalysisScreen";

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
import TestDriveScreen from "../scenes/mainScenes/MyTasks/testDriveScreen";
import EnquiryFollowUpScreen from "../scenes/mainScenes/MyTasks/enquiryFollowUpScreen";
import TestEnquiryFormScreen from "../scenes/mainScenes/EMS/testEnquiryFormScreen";
import PaidAccessoriesScreen from "../scenes/mainScenes/EMS/paidAccsories";
import ProceedToPreBookingScreen from "../scenes/mainScenes/MyTasks/proceedToPreBookingScreen";
import CreateEnquiryScreen from "../scenes/mainScenes/MyTasks/createEnquiryScreen";
import FilterScreen from "../scenes/mainScenes/Home/filterScreen";
import SelectBranchComp from "../scenes/loginScenes/selectBranchComp";
import TargetSettingsScreen from "../scenes/mainScenes/TargetSettingsScreen";
import TestScreen from "../scenes/mainScenes/Home/testScreen";
import TaskListScreen from "../scenes/mainScenes/MyTasks/taskListScreen";
import PriceScreen from "../scenes/mainScenes/price";
import TaskThreeSixtyScreen from "../scenes/mainScenes/EMS/taskThreeSixty";
import ChangePasswordScreen from "../scenes/mainScenes/changePasswordScreen";
import BookingScreen from "../scenes/mainScenes/EMS/bookingScreen";
import BookingFormScreen from "../scenes/mainScenes/EMS/bookingFormScreen";
import ProceedToBookingScreen from "../scenes/mainScenes/MyTasks/proceedToBookingScreen";
import TestDriveHistory from "../scenes/mainScenes/MyTasks/testDriveHistory";

import { useSelector, useDispatch } from "react-redux";
import {
  updateModal,
  updateSearchKey,
  updateIsSearch,
} from "../redux/appReducer";
import etvbrlReportScreen from "../scenes/mainScenes/etvbrlReportScreen";
import webViewComp from "../scenes/mainScenes/EMS/components/webViewComp";
import ProformaScreen from "../scenes/mainScenes/EMS/ProformaScreen";

import leaderBoardScreen from "../scenes/mainScenes/Home/leaderBoardScreen";
import branchRankingScreen from "../scenes/mainScenes/Home/branchRankingScreen";
import SourceModel from "../scenes/mainScenes/Home/TabScreens/components/EmployeeView/SourceModel";
import LiveLeadsScreen from "../scenes/mainScenes/LiveLeads";
import { EMSTopTabNavigatorTwo } from "./emsTopTabNavigator";
import { AppNavigator } from ".";
import MapScreen from "../scenes/mainScenes/Map";
import AttendanceScreen from "../scenes/mainScenes/Attendance";
import RecepSourceModel from "../scenes/mainScenes/Home/TabScreens/components/EmployeeView/RecepSourceModel";
import DropLostCancelScreen from "../scenes/mainScenes/DropLostCancel/DropLostCancel";
import AddNewEnquiryScreen from "../scenes/mainScenes/EMS/addNewEnquiry";
import FilterTargetScreen from "../scenes/mainScenes/TargetSettingsScreen/TabScreen/filterTarget";
import MyTaskFilterScreen from "../scenes/mainScenes/MyTasks/myTaskFilterScreen";
import ReceptionistFilterScreen from "../scenes/mainScenes/Home/receptionistFilter";
import {
  AttendanceTopTabNavigatorTwo,
  MyAttendanceTopTabNavigatorOne,
} from "./attendanceTopTabNavigator";
import GeoLocationScreen from "../scenes/mainScenes/Geolocation";
import { MyGeolocationTopTabNavigatorOne } from "./geolocationNavigator";
import TaskThreeSixtyHistory from "../scenes/mainScenes/EMS/taskThreeSixtyHistory";
import NotificationIcon from "../components/NotificationIcon";
import DigitalDashBoardScreen from "../scenes/mainScenes/DigitalDashboard";
import EventDashBoardScreen from "../scenes/mainScenes/EventDashboard";
import EventSourceModel from "../scenes/mainScenes/EventDashboard/EventSourceModel";
import LeaderShipFilter from "../scenes/mainScenes/Home/TabScreens/leaderShipFilter";
import Orientation from "react-native-orientation-locker";
import { detectIsOrientationLock, isReceptionist } from "../utils/helperFunctions";
import TaskthreeSixtyhistoryFilter from "../scenes/mainScenes/EMS/components/TaskthreeSixtyhistoryFilter";
import DownloadReportScreen from "../scenes/mainScenes/Attendance/DownloadReport";
import ComplaintTrackerMain, { ComplaintsTrackerTopTabNavigator } from "../scenes/mainScenes/ComplaintTracker/ComplaintTrackerMain";
import ComplaintList from "../scenes/mainScenes/ComplaintTracker/ComplaintList";
import { ComplaintsTopTabNavigator } from "./complaintsTopTabNavigator";
import AddEditComplaint from "../scenes/mainScenes/ComplaintTracker/AddEditComplaint";
import ClosedComplaintList from "../scenes/mainScenes/ComplaintTracker/ClosedComplaintList";
import * as AsyncStore from "../asyncStore";
import LiveLeadsfilterScreen from "../scenes/mainScenes/LiveLeads/LiveLeadsfilterScreen";
import CRMFilterscreen from "../scenes/mainScenes/Home/CRMFilterscreen";
import CRMLiveleadsFilterscreen from "../scenes/mainScenes/LiveLeads/CRMLiveleadsFilterscreen";
import RecepSourceModelCRM from "../scenes/mainScenes/LiveLeads/RecepSourceModelCRM";
import LiveLeadsScreenReceptionist from "../scenes/mainScenes/LiveLeadsReceptionist";
import LiveLeadsfilterScreen_receptionist from "../scenes/mainScenes/LiveLeadsReceptionist/LiveLeadsfilterScreen_receptionist";
import CRMLiveleadsFilterscreen_recep from "../scenes/mainScenes/LiveLeadsReceptionist/CRMLiveleadsFilterscreen_recep";
import RecepSourceModelCRM_Recep from "../scenes/mainScenes/LiveLeadsReceptionist/RecepSourceModelCRM_Recep";
import DigitalDashBoardTargetScreen from "../scenes/mainScenes/DigitalDashboard/targetScreen";
import DigitalDashboardFilter from "../scenes/mainScenes/DigitalDashboard/DigitalDashboardFilter";
import DigitalRecepSourceModel from "../scenes/mainScenes/DigitalDashboard/DigitalRecepSourceModel";
import ReceptionistDashboardScreen from "../scenes/mainScenes/ReceptionistDashboard";
import ReceptionistDashbordSourceModel from "../scenes/mainScenes/ReceptionistDashboard/ReceptionistDashbordSourceModel";
import ReceptionistDashboardFilter from "../scenes/mainScenes/ReceptionistDashboard/ReceptionistDashboardFilter";
import { updateCrm_employees_drop_down_data, updateDealerFilterData, updateDealerFilterData_Recep, updateEmpDropDown_Local, updateFilterIds, updateFilterLevelSelectedDataReceptionist, updateFilterSelectedData, updateFilterSelectedDataReceptionist, updateLiveLeadObjectData, updateReceptionistObjectData } from "../redux/homeReducer";
import HomeVisitHistory from "../scenes/mainScenes/MyTasks/homeVisitHistory";
import leaderShipFilterNewLogic from "../scenes/mainScenes/Home/TabScreens/leaderShipFilterNewLogic";
import WebCallScreen from "../scenes/mainScenes/MyTasks/webCallScreen";
import RecordedCalls from "../scenes/mainScenes/EMS/RecordedCalls";

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

export const MenuIcon = ({ navigation }) => {
  return (
    <IconButton
      icon="menu"
      color={Colors.WHITE}
      size={30}
      onPress={() => navigation.openDrawer()}
    />
  );
};

export const TestDriveHistoryIcon = ({ navigation }) => {
  return (
    <IconButton
      icon="history"
      color={Colors.WHITE}
      size={30}
      onPress={() =>
        navigation.navigate(MyTasksStackIdentifiers.testDriveHistory)
      }
    />
  );
};

const MyTaskFilter = ({ navigation }) => {
  const [isIconShow, setIsIconShow] = useState(false);

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      if (isReceptionist(jsonObj.hrmsRole)) {
        setIsIconShow(false);
      } else {
        setIsIconShow(true);
      }
    }
  }, []);

  if (isIconShow) {
    return (
      <IconButton
        icon="filter-outline"
        style={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        color={Colors.WHITE}
        size={25}
        onPress={() =>
          navigation.navigate(MyTasksStackIdentifiers.myTaskFilterScreen)
        }
      />
    );
  }

  return null;
};

const SearchIcon = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const selector = useSelector((state) => state.appReducer);
  const dispatch = useDispatch();

  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <>
      <IconButton
        icon="magnify"
        color={Colors.WHITE}
        size={25}
        onPress={() => {
          dispatch(updateModal(true));
        }}
      />
      <Modal
        animationType="fade"
        visible={selector.isOpenModal}
        onRequestClose={() => {
          dispatch(updateModal(false));
        }}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            style={{
              height: 170,
              width: "90%",
              backgroundColor: "#fff",
              borderRadius: 5,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "90%",
                height: 40,
                borderWidth: 1,
                borderColor: "#333",
                borderRadius: 5,
                justifyContent: "center",
                paddingHorizontal: 15,
                marginBottom: 20,
                marginTop: 40,
              }}
            >
              <TextInput
                style={{ color: "#333", fontSize: 15, fontWeight: "500" }}
                placeholder={"Search"}
                value={selector.searchKey}
                placeholderTextColor={"#333"}
                onChangeText={(text) => {
                  dispatch(updateSearchKey(text));
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "90%",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  width: "48%",
                  backgroundColor: Colors.RED,
                  borderRadius: 5,
                  marginRight: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 40,
                }}
                onPress={() => {
                  dispatch(updateIsSearch(true));
                  dispatch(updateModal(false));
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "48%",
                  backgroundColor: Colors.GRAY,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 40,
                }}
                onPress={() => {
                  dispatch(updateSearchKey(""));
                  dispatch(updateIsSearch(true));
                  dispatch(updateModal(false));
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const LeadAge = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const selector = useSelector((state) => state.taskThreeSixtyReducer);
  const dispatch = useDispatch();

  return (
    <View
      style={{
        width: 110,
        height: 30,
        borderRadius: 15,
        borderColor: Colors.RED,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5,
        flexDirection: "row",
      }}
    >
      <Image
        source={require("../assets/images/calendar.png")}
        style={{ width: 20, height: 20 }}
      />
      <Text
        style={{
          fontSize: 15,
          fontWeight: "600",
          color: "#fff",
          marginLeft: 5,
        }}
      >{`${selector.leadAge} ${selector.leadAge > 1 ? "days" : "day"}`}</Text>
      {/* <Text style={{ fontSize: 15, fontWeight: '600', color: '#fff' }}>200 days</Text> */}
    </View>
  );
};

const MapIcon = ({ navigation }) => {
  return (
    <IconButton
      icon="google-maps"
      color={Colors.WHITE}
      size={25}
      onPress={() => {
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=india`
        );
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
  digitalPayment: "DIGITAL_PAYMENT",
  monthlyTarget: "MONTHLY_TARGET",
  helpdesk: "HELP_DESK",
  taskManagement: "TASK_MANAGEMENT",
  taskTransfer: "TASK_TRANSFER",
  evtbrlReport: "EVTBRL_REPORT",
  dropAnalysis: "DROP_ANALYSIS",
  liveLeads: "LIVE_LEADS",
  liveLeadsReceptionist: "LIVE_LEADS_RECEPTIONIST",
  dropLostCancel: "DROP_LOST_CANCEL",
  eventDashboard: "EVENT_DASHBOARD",
  attendance: "Attendance",
  geolocation: "Geolocation",
  digitalDashboard: "DIGITAL_DASHBOARD",
  reportDownload:"REPORT_DOWNLOAD",
  complaintTracker:"COMPLAINT_TRACKER",
  receptionistDashboard: "RECEPTIONIST_DASHBOARD",
};

export const TabStackIdentifiers = {
  home: "HOME_SCREEN",
  ems: "EMS_TAB",
  myTask: "MY_TASK_TAB",
  planning: "MONTHLY_TARGET",
  etvbrl: "EVTBRL_REPORT",
};

export const HomeStackIdentifiers = {
  filter: "FILTER",
  select_branch: "SELECT_BRANCH",
  test: "TEST",
  leaderboard: "LEADERBOARD",
  branchRanking: "BRANCH_RANKING",
  sourceModel: "SOURCE_MODEL",
  home: "HOME_SCREEN",
  location: "MAP_TRACKER",
  receptionistFilter: "REECEPTION_FILTER",
  laderfilterScreen: "LEADER_FLITER_SCREEN",
  crmFilter:"CRM_FILTER",
  laderfilterScreen_new: "LEADER_FLITER_SCREEN_NEW",
};

export const EmsStackIdentifiers = {
  addPreEnq: "ADD_PRE_ENQUIRY",
  confirmedPreEnq: "CONFIRMED_PRE_ENQUIRY",
  detailsOverview: "DETAILS_OVERVIEW",
  preBookingForm: "PRE_BOOKING_FORM",

  paidAccessories: "PAID_ACCESSORIES",
  task360: "TASK_360",
  task360History: "TASK_360_HISTORY",
  homeVisit: "HOME_VISIT_1",
  preBookingFollowUp: "PREBOOKING_FOLLOWUP_1",
  bookingFollowUp: "PREBOOKING_FOLLOWUP_1",
  testDrive: "TEST_DRIVE_1",
  enquiryFollowUp: "ENQUIRY_FOLLOW_UP_1",
  proceedToPreBooking: "PROCEED_TO_PRE_BOOKING_1",
  proceedToBooking: "PROCEED_TO_BOOKING_1",
  createEnquiry: "CREATE_ENQUIRY_1",
  bookingForm: "BOOKING_FORM",
  webViewComp: "webViewComp",
  ProformaScreen: "PROFORMA_SCREEN",
  newEnquiry: "NEW_ENQUIRY",
  testDriveHistory: "TEST_HISTORY",
  recordedCalls: "RECORDED_CALLS",
  task360HistoryFilter: "TASK_360_HISTORY_FILTER",
  homeVisitHistry: "HOME_VISIT_HISTORY",
};

export const PreBookingStackIdentifiers = {
  preBooking: "PRE_BOOKING",
  preBookingForm: "PRE_BOOKING_FORM",
};

export const BookingStackIdentifiers = {
  booking: "BOOKING",
  bookingForm: "BOOKING_FORM",
};

export const MyTasksStackIdentifiers = {
  mytasks: "MY_TASKS",
  homeVisit: "HOME_VISIT",
  preBookingFollowUp: "PREBOOKING_FOLLOWUP",
  bookingFollowUp: "PREBOOKING_FOLLOWUP",
  testDrive: "TEST_DRIVE",
  enquiryFollowUp: "ENQUIRY_FOLLOW_UP",
  proceedToPreBooking: "PROCEED_TO_PRE_BOOKING",
  proceedToBooking: "PROCEED_TO_BOOKING",
  createEnquiry: "CREATE_ENQUIRY",
  tasksListScreen: "TASKS_LIST_SCREEN",
  myTaskFilterScreen: "MYTASK_FILTER",
  webCallScreen: "WEB_CALL",
  testDriveHistory: "TEST_HISTORY",
  homevisitHistory :"HOME_VISIT_HISTORY"
};

export const PriceStackIdentifiers = {
  price: "PRICE",
};

export const EventDashboardStackIdentifiers = {
  home: "EVENT_DASHBOARD",
  event: "EVENT",
  sourceModel: "EVENT_SOURCE_MODEL",
};

export const ComplainTrackerIdentifires = {
  complainTrackerDashboard: "COMPLAIN_TRACKER",
  complainTrackerList: "COMPLAINT_LIST",
  complainTrackerTop:"COMPLAINT_TRACKER_TOP",
  closedComplainTeackerList:"CLOCSED_LIST",
  addEditComplaint:"ADD_EDIT_COMPLAINT"
  
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
        initialParams={{ branchName: "" }}
        options={{
          title: "Dashboard",
          headerShown: false,
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.filter}
        component={FilterScreen}
        options={{ title: "Filters" }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.select_branch}
        component={SelectBranchComp}
        options={{ title: "Select Branch" }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.test}
        component={TestScreen}
        options={{ title: "Test Screen" }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.leaderboard}
        component={leaderBoardScreen}
        options={{ title: "Leader Board - Dealer Ranking" }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.branchRanking}
        component={branchRankingScreen}
        options={{ title: "Leader Board - Branch Ranking" }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.laderfilterScreen}
        component={LeaderShipFilter}
        options={{ title: "Filter" }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.laderfilterScreen_new}
        component={leaderShipFilterNewLogic}
        options={{ title: "Filter" }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.sourceModel}
        component={SourceModel}
        options={{
          title: "Source/Model",
        }}
      />
      <HomeStack.Screen
        name={"RECEP_SOURCE_MODEL"}
        component={RecepSourceModel}
        options={{
          title: "Source/Model",
        }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.receptionistFilter}
        component={ReceptionistFilterScreen}
        options={{ title: "Filters" }}
      />
      <HomeStack.Screen
        name={HomeStackIdentifiers.crmFilter}
        component={CRMFilterscreen}
        options={{ title: "Filters" }}
      />
      <MainDrawerNavigator.Screen
        name={HomeStackIdentifiers.location}
        component={MapScreen}
        options={{
          title: "Map",
        }}
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
        component={EMSTopTabNavigatorTwo}
        options={{
          title: "EMS",
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => <NotificationIcon navigation={navigation} />,
        }}
      />

      <EmsStack.Screen
        name={"NOTIF_2"}
        component={NotificationScreen}
        options={{ title: "Notifications" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.addPreEnq}
        component={AddPreEnquiryScreen}
        options={{ title: "Contacts" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.confirmedPreEnq}
        component={ConfirmedPreEnquiryScreen}
        options={{ title: "Contacts" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.detailsOverview}
        component={EnquiryFormScreen}
        options={{ title: "Enquiry Form" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.newEnquiry}
        component={AddNewEnquiryScreen}
        options={{ title: "Enquiry Form" }}
      />

      <EmsStack.Screen
        name={EmsStackIdentifiers.preBookingForm}
        component={PreBookingFormScreen}
        initialParams={{ accessoriesList: [] }}
        options={{ title: "Booking Approval Form" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.bookingForm}
        component={BookingFormScreen}
        initialParams={{ accessoriesList: [] }}
        options={{ title: "Booking View Form" }}
      />

      <EmsStack.Screen
        name={EmsStackIdentifiers.paidAccessories}
        component={PaidAccessoriesScreen}
        options={{
          title: "Paid Accessories",
          headerRight: () => {
            return (
              <View style={{ flexDirection: "row" }}>
                <SearchIcon />
              </View>
            );
          },
        }}
      />

      <EmsStack.Screen
        name={EmsStackIdentifiers.proceedToPreBooking}
        component={ProceedToPreBookingScreen}
        options={{ title: "Proceed to Booking approval" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.proceedToBooking}
        component={ProceedToBookingScreen}
        initialParams={{ accessoriesList: [] }}
        options={{ title: "Proceed To Booking View" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.task360}
        component={TaskThreeSixtyScreen}
        options={{
          title: "Task 360",
          headerRight: () => {
            return <LeadAge />;
          },
        }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.recordedCalls}
        component={RecordedCalls}
        options={{ title: "Recorded Calls" }}
      />

      <EmsStack.Screen
        name={EmsStackIdentifiers.task360History}
        component={TaskThreeSixtyHistory}
        options={({ route }) => ({
          headerTitle: route?.params?.title ?? "History",
        })}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.task360HistoryFilter}
        component={TaskthreeSixtyhistoryFilter}
        options={({ route }) => ({
          headerTitle: "History Filter",
        })}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.homeVisit}
        component={HomeVisitScreen}
        options={{ title: "Visit" }}
      />

      <EmsStack.Screen
        name={EmsStackIdentifiers.testDrive}
        component={TestDriveScreen}
        options={{ title: "Test Drive" }}
      />

      <EmsStack.Screen
        name={EmsStackIdentifiers.enquiryFollowUp}
        component={EnquiryFollowUpScreen}
        options={{ title: "Enquiry Follow Up" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.bookingFollowUp}
        component={EnquiryFollowUpScreen}
        options={{ title: "Booking View Follow Up" }}
      />

      <EmsStack.Screen
        name={EmsStackIdentifiers.createEnquiry}
        component={CreateEnquiryScreen}
        options={{ title: "Create Enquiry" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.webViewComp}
        component={webViewComp}
        options={{ title: "Call Record" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.ProformaScreen}
        component={ProformaScreen}
        options={{ title: "Proforma Invoice" }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.testDriveHistory}
        component={TestDriveHistory}
        options={{
          title: "Test Drive History",
          // headerRight: () => <TestDriveHistoryIcon navigation={navigation} />,
        }}
      />
      <EmsStack.Screen
        name={EmsStackIdentifiers.homeVisitHistry}
        component={HomeVisitHistory}
        options={{
          title: "Home Visit History",
          // headerRight: () => <TestDriveHistoryIcon navigation={navigation} />,
        }}
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
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <SearchIcon /> */}
              <MyTaskFilter navigation={navigation} />
              <NotificationIcon
                navigation={navigation}
                identifier={"NOTIF_3"}
              />
            </View>
          ),
        }}
      />

      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.myTaskFilterScreen}
        component={MyTaskFilterScreen}
        options={{ title: "Filters" }}
      />

      <MyTaskStack.Screen
        name={"NOTIF_3"}
        component={NotificationScreen}
        options={{ title: "Notifications" }}
      />

      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.tasksListScreen}
        component={TaskListScreen}
        options={{ title: "My Tasks" }}
      />

      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.bookingFollowUp}
        component={EnquiryFollowUpScreen}
        options={{ title: "Booking Follow Up" }}
      />
      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.createEnquiry}
        component={CreateEnquiryScreen}
        options={{ title: "Create Enquiry" }}
      />

      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.enquiryFollowUp}
        component={EnquiryFollowUpScreen}
        options={{ title: "Enquiry Follow Up" }}
      />
      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.testDrive}
        component={TestDriveScreen}
        options={{ title: "Test Drive" }}
      />
      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.testDriveHistory}
        component={TestDriveHistory}
        options={{
          title: "Test Drive History",
          // headerRight: () => <TestDriveHistoryIcon navigation={navigation} />,
        }}
      />
      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.homevisitHistory}
        component={HomeVisitHistory}
        options={{
          title: "Home Visit History",
          // headerRight: () => <TestDriveHistoryIcon navigation={navigation} />,
        }}
      />
      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.homeVisit}
        component={HomeVisitScreen}
        options={{ title: "Visit" }}
      />

      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.proceedToPreBooking}
        component={ProceedToPreBookingScreen}
        options={{ title: "Proceed to Booking approval" }}
      />
      <MyTaskStack.Screen
        name={MyTasksStackIdentifiers.proceedToBooking}
        component={ProceedToBookingScreen}
        options={{ title: "Proceed To Booking View" }}
      />
    </MyTaskStack.Navigator>
  );
};

const PriceStack = createStackNavigator();

const PriceStackNavigator = ({ navigation }) => {
  return (
    <PriceStack.Navigator
      initialRouteName={PriceStackIdentifiers.price}
      screenOptions={screeOptionStyle}
    >
      <PriceStack.Screen
        name={PriceStackIdentifiers.price}
        component={PriceScreen}
        options={{
          title: "Price",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </PriceStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation, route }) => {
  const nav = useRoute();
  // let routeName = getFocusedRouteNameFromRoute(route);
  let routeName = nav.params.screen;
  const dispatch = useDispatch();
  return (
    <Tab.Navigator
      // initialRouteName={routeName.name === "MONTHLY_TARGET" ? TabStackIdentifiers.planning : TabStackIdentifiers.home}
      initialRouteName={routeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === TabStackIdentifiers.home) {
            return focused ? (
              <HOME_LINE width={size} height={size} fill={color} />
            ) : (
              <HOME_LINE width={size} height={size} fill={color} />
            );
          } else if (route.name === TabStackIdentifiers.ems) {
            return focused ? (
              <EMS_LINE width={size} height={size} fill={color} />
            ) : (
              <EMS_LINE width={size} height={size} fill={color} />
            );
          } else if (route.name === TabStackIdentifiers.myTask) {
            return focused ? (
              <SCHEDULE_LINE width={size} height={size} fill={color} />
            ) : (
              <SCHEDULE_LINE width={size} height={size} fill={color} />
            );
          } else if (route.name === TabStackIdentifiers.planning) {
            return focused ? (
              <PRICE width={size} height={size} fill={color} />
            ) : (
              <PRICE width={size} height={size} fill={color} />
            );
          } else if (route.name === TabStackIdentifiers.etvbrl) {
            return focused ? (
              <PRICE width={size} height={size} fill={color} />
            ) : (
              <PRICE width={size} height={size} fill={color} />
            );
          }

          // return (
          //   <VectorImage
          //     width={size}
          //     height={size}
          //     source={iconName}
          //     style={{ tintColor: color }}
          //   />
          // );
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.PINK,
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name={TabStackIdentifiers.home}
        component={HomeStackNavigator}
        options={{ title: "Home" }}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // todo manthan 
            let obj = {
              startDate: "",
              endDate: "",
              levelSelected: "",
              selectedempId: "",
              dealerCodes: "",
            }
            dispatch(updateDealerFilterData({}))
            // dispatch(updateFilterSelectedData({}))
            dispatch(updateLiveLeadObjectData(obj))
            dispatch(updateFilterSelectedData({}));
            dispatch(updateReceptionistObjectData({}));
            dispatch(updateFilterSelectedDataReceptionist({}));
            dispatch(updateFilterLevelSelectedDataReceptionist({}));
            dispatch(updateDealerFilterData_Recep({}));
            dispatch(updateCrm_employees_drop_down_data({}))
            dispatch(updateFilterIds({}))
            dispatch(updateEmpDropDown_Local({}))
            
          },
        })}
      />
      <Tab.Screen
        name={TabStackIdentifiers.ems}
        component={EmsStackNavigator}
        options={{ title: "EMS" }}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // todo manthan 
            EventRegister.emit("EMSBOTTOMTAB_CLICKED", true)
            navigation.setParams(
              {
                screenName: "DEFAULT",
                params: "",
                moduleType: "",
                employeeDetail: "",
                selectedEmpId: "",
                startDate: "",
                endDate: "",
                dealerCodes: "",
                fromScreen: "DEFAULT",
                ignoreSelectedId: false
              })
          },
        })}
        // listeners={({ navigation, route }) => ({
        //     tabPress: e => {
        //         if (route.state && route.state.routeNames.length > 0) {
        //             navigation.navigate(AppNavigator.TabStackIdentifiers.myTask)
        //         }
        //     },
        // })}
      />
      <Tab.Screen
        name={TabStackIdentifiers.myTask}
        component={MyTaskStackNavigator}
        options={{ title: "My Tasks" }}
      />
      {routeName === "MONTHLY_TARGET" && (
        <Tab.Screen
          name={TabStackIdentifiers.planning}
          component={MonthlyTargetStackNavigator}
          options={{ title: "Planning" }}
        />
      )}
      {routeName === "EVTBRL_REPORT" && (
        <Tab.Screen
          name={TabStackIdentifiers.etvbrl}
          component={EvtbrlReportStackNavigator}
          options={{ title: "ETVBRL" }}
        />
      )}
    </Tab.Navigator>
  );
};

const fun = () => {
  return (
    <Tab.Screen
      name={TabStackIdentifiers.planning}
      component={MonthlyTargetStackNavigator}
      options={{ title: "Planning" }}
    />
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
      <SettingsStack.Screen
        name={"CHANGE_PASSWORD_SCREEN"}
        component={ChangePasswordScreen}
        options={{
          title: "Change Password",
        }}
      />
    </SettingsStack.Navigator>
  );
};

const DigitalPaymentStack = createStackNavigator();

const DigitalPaymentStackNavigator = ({ navigation }) => {
  return (
    <DigitalPaymentStack.Navigator screenOptions={screeOptionStyle}>
      <DigitalPaymentStack.Screen
        name={"DIGITAL_PAYMENT_SCREEN"}
        component={DigitalPaymentScreen}
        options={{
          title: "QR Code",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </DigitalPaymentStack.Navigator>
  );
};


const DigitalDashboardStack = createStackNavigator();

const DigitalDashboardStackNavigator = ({ navigation }) => {
  return (
    <DigitalDashboardStack.Navigator screenOptions={screeOptionStyle}>
      <DigitalDashboardStack.Screen
        name={DrawerStackIdentifiers.digitalDashboard}
        component={DigitalDashBoardScreen}
        options={{
          headerShown:false
          // title: "QR Code",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <DigitalDashboardStack.Screen
        name={"DIGITAL_DASHBOARD_FILTER"}
        component={DigitalDashboardFilter}
        options={{
          // headerShown: false
          title: "Filter",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <DigitalDashboardStack.Screen
        name={"RECEP_SOURCE_MODEL_DEGITAL"}
        component={DigitalRecepSourceModel}
        options={{
          title: "Source/Model",
        }}
      />
    </DigitalDashboardStack.Navigator>
  );
};

const ReceptionistDashboardStack = createStackNavigator();

const ReceptionistDashboardNavigator = ({ navigation }) => {
  return (
    <ReceptionistDashboardStack.Navigator screenOptions={screeOptionStyle}>
      <ReceptionistDashboardStack.Screen
        name={DrawerStackIdentifiers.receptionistDashboard}
        component={ReceptionistDashboardScreen}
        options={{
          headerShown: false
          // title: "QR Code",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <ReceptionistDashboardStack.Screen
        name={"RECEPTIONIST_DASHBOARD_FILTER"}
        component={ReceptionistDashboardFilter}
        options={{
          // headerShown: false
          title: "Filter",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <ReceptionistDashboardStack.Screen
        name={"RECEP_SOURCE_MODEL_RECEPTIONIST"}
        component={ReceptionistDashbordSourceModel}
        options={{
          title: "Source/Model",
        }}
      />
    </ReceptionistDashboardStack.Navigator>
  );
};

const MonthlyTargetStack = createStackNavigator();

const MonthlyTargetStackNavigator = ({ navigation }) => {
  return (
    <MonthlyTargetStack.Navigator screenOptions={screeOptionStyle}>
      <MonthlyTargetStack.Screen
        name={"MONTHLY_TARGET_SCREEN"}
        component={TargetSettingsScreen}
        options={{
          title: "Monthly Target planning",
          headerShown: false,
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <MonthlyTargetStack.Screen
        name={"FILTER_TARGET_SCREEN"}
        component={FilterTargetScreen}
        options={{
          title: "Filter",
          headerShown: true,
        }}
      />
    </MonthlyTargetStack.Navigator>
  );
};

const HelpDeskStack = createStackNavigator();

const HelpDeskStackNavigator = ({ navigation }) => {
  return (
    <HelpDeskStack.Navigator screenOptions={screeOptionStyle}>
      <HelpDeskStack.Screen
        name={"HELP_DESK_SCREEN"}
        component={HelpDeskScreen}
        options={{
          title: "Help Desk",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </HelpDeskStack.Navigator>
  );
};

const DropAnalysisStack = createStackNavigator();

const DropAnalysisStackNavigator = ({ navigation }) => {
  return (
    <DropAnalysisStack.Navigator screenOptions={screeOptionStyle} initialRouteName={"DROP_ANALYSIS"} >
      <DropAnalysisStack.Screen
        name={"DROP_ANALYSIS"}
        component={DropAnalysisScreen}
        options={{
          title: "Drop List",
          headerLeft: () => <MenuIcon navigation={navigation} />,
          headerRight: () => {
            return (
              <View style={{ flexDirection: "row" }}>
                <SearchIcon />
                {/* <RefreshIcon /> */}
                {/* <MapIcon /> */}
              </View>
            );
          },
        }}
        initialParams={{ emp_id: "", fromScreen: "" }}
      />
      <DropAnalysisStack.Screen
        name={"DROP_ANALYSIS_HISTORY"}
        component={TaskThreeSixtyHistory}
        options={({ route }) => ({
          headerTitle: route?.params?.title ?? "History",
        })}
      />
      <DropAnalysisStack.Screen
        name={"BOOKING_FORM"}
        component={BookingFormScreen}
        initialParams={{ accessoriesList: [] }}
        options={{ title: "Booking View Form" }}
      />
    </DropAnalysisStack.Navigator>
  );
};

const LiveLeadsStack = createStackNavigator();

const LiveLeadsStackNavigator = ({ navigation }) => {
  return (
    <LiveLeadsStack.Navigator
      initialRouteName={"LIVE_LEADS"}
      screenOptions={screeOptionStyle}
    >
      <LiveLeadsStack.Screen
        name={"LIVE_LEADS"}
        component={LiveLeadsScreen}
        options={{
          title: "Live Leads",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
        initialParams={{
          fromScreen: "",
          selectedID: "",
          fromDate: "",
          toDate: "",
        }}
      />
      <LiveLeadsStack.Screen
        name={"LIVE_LEADS_FILTERS"}
        component={LiveLeadsfilterScreen}
        options={{
          title: "Live Leads Filters",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />

      <LiveLeadsStack.Screen
        name={"CRM_LIVE_FILTERS"}
        component={CRMLiveleadsFilterscreen}
        options={{ title: "Filters" }}
      />

      <LiveLeadsStack.Screen
        name={"RECEP_SOURCE_MODEL_CRM"}
        component={RecepSourceModelCRM}
        options={{
          title: "Source/Model",
        }}
      />
    </LiveLeadsStack.Navigator>
  );
};


const LiveLeadsStackReceptionist = createStackNavigator();

const LiveLeadsStackNavigatorReceptionist = ({ navigation }) => {
  return (
    <LiveLeadsStackReceptionist.Navigator
      initialRouteName={"LIVE_LEADS_RECEPTIONIST"}
      screenOptions={screeOptionStyle}
    >
      <LiveLeadsStackReceptionist.Screen
        name={"LIVE_LEADS_RECEPTIONIST"}
        component={LiveLeadsScreenReceptionist}
        options={{
          title: "Live Leads Receptionist",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
        initialParams={{
          fromScreen: "",
          selectedID: "",
          fromDate: "",
          toDate: "",
        }}
      />
      <LiveLeadsStackReceptionist.Screen
        name={"LIVE_LEADS_FILTERS_RECEP"}
        component={LiveLeadsfilterScreen_receptionist}
        options={{
          title: "Live Leads Filters",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />

      <LiveLeadsStackReceptionist.Screen
        name={"CRM_LIVE_FILTERS_RECEP"}
        component={CRMLiveleadsFilterscreen_recep}
        options={{ title: "Filters" }}
      />

      <LiveLeadsStackReceptionist.Screen
        name={"RECEP_SOURCE_MODEL_CRM_RECEP"}
        component={RecepSourceModelCRM_Recep}
        options={{
          title: "Source/Model",
        }}
      />
    </LiveLeadsStackReceptionist.Navigator>
  );
};

const ComplainTrackgerStack = createStackNavigator();

const ComplainTrackgerStackNavigator = ({ navigation }) => {
  return (
    <ComplainTrackgerStack.Navigator
      initialRouteName={ComplainTrackerIdentifires.complainTrackerDashboard}
      screenOptions={screeOptionStyle}
    >
      <ComplainTrackgerStack.Screen
        name={ComplainTrackerIdentifires.complainTrackerDashboard}
        component={ComplaintTrackerMain}
        options={{
          title: "Complaint Tracker",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <ComplainTrackgerStack.Screen
        name={ComplainTrackerIdentifires.complainTrackerTop}
        component={ComplaintsTrackerTopTabNavigator}
        options={{
          title: "Complaints",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <ComplainTrackgerStack.Screen
        name={ComplainTrackerIdentifires.complainTrackerList}
        component={ComplaintList}
        options={{
          title: "Complaints",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <ComplainTrackgerStack.Screen
        name={ComplainTrackerIdentifires.closedComplainTeackerList}
        component={ClosedComplaintList}
        options={{
          title: "Complaints",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <ComplainTrackgerStack.Screen
        name={ComplainTrackerIdentifires.addEditComplaint}
        component={AddEditComplaint}
        options={{
          title: "Complaint Tracker",
          // headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </ComplainTrackgerStack.Navigator>
  );
};

const TaskManagementStack = createStackNavigator();

const TaskManagementStackNavigator = ({ navigation }) => {
  return (
    <TaskManagementStack.Navigator screenOptions={screeOptionStyle}>
      <TaskManagementStack.Screen
        name={"TASK_MANAGEMENT"}
        component={taskManagementScreen}
        options={{
          title: "Task Management",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </TaskManagementStack.Navigator>
  );
};

const TaskTransferStack = createStackNavigator();

const TaskTransferStackNavigator = ({ navigation }) => {
  return (
    <TaskTransferStack.Navigator screenOptions={screeOptionStyle}>
      <TaskTransferStack.Screen
        name={"TASK_TRANSFER"}
        component={TaskTranferScreen}
        options={{
          title: "Task Transfer",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </TaskTransferStack.Navigator>
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

const EvtbrlReportStack = createStackNavigator();

const EvtbrlReportStackNavigator = ({ navigation }) => {
  return (
    <EvtbrlReportStack.Navigator
      initialRouteName={"EVENT_MANAGEMENT"}
      screenOptions={screeOptionStyle}
    >
      <EvtbrlReportStack.Screen
        name={"ETVBRL Report"}
        component={etvbrlReportScreen}
        options={{
          title: "ETVBRL Report",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </EvtbrlReportStack.Navigator>
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
          title: "Booking Approval Form",
        }}
      />
    </PreBookingStack.Navigator>
  );
};

const BookingStack = createStackNavigator();

const BookingStackNavigator = ({ navigation }) => {
  return (
    <BookingStack.Navigator
      initialRouteName={BookingStackIdentifiers.booking}
      screenOptions={screeOptionStyle}
    >
      <BookingStack.Screen
        name={BookingStackIdentifiers.booking}
        component={BookingScreen}
        options={{
          title: "Booking",
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />

      <BookingStack.Screen
        name={BookingStackIdentifiers.bookingForm}
        component={BookingFormScreen}
        options={{
          title: "Booking Form",
        }}
      />
    </BookingStack.Navigator>
  );
};

const MainDrawerNavigator = createDrawerNavigator();

const MainStackDrawerNavigator = ({ navigation }) => {
  const isLock = detectIsOrientationLock(navigation);
  if (isLock) {
    Orientation.lockToPortrait();
  } 
  return (
    <MainDrawerNavigator.Navigator
      drawerStyle={{
        width: drawerWidth,
      }}
      screenOptions={{
        animationEnabled: false,
      }}
      drawerContent={(props) => <SideMenuScreen {...props} />}
      initialRouteName={DrawerStackIdentifiers.home}
    >
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.home}
        component={TabNavigator}
        initialParams={{ screen: DrawerStackIdentifiers.home }}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.liveLeads}
        component={LiveLeadsStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.liveLeadsReceptionist}
        component={LiveLeadsStackNavigatorReceptionist}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.complaintTracker}
        component={ComplainTrackgerStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.monthlyTarget}
        component={MonthlyTargetStackNavigator}
        initialParams={{ screen: DrawerStackIdentifiers.monthlyTarget }}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.attendance}
        component={MyAttendanceTopTabNavigatorOne}
        options={
          {
            // title: "My Attendance",
            // headerLeft: () => <MenuIcon navigation={navigation} />,
            // headerShown: true,
            // headerStyle: screeOptionStyle.headerStyle,
            // headerTitleStyle: screeOptionStyle.headerTitleStyle,
            // headerTintColor: screeOptionStyle.headerTintColor,
            // headerBackTitleVisible: screeOptionStyle.headerBackTitleVisible,
          }
        }
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.geolocation}
        component={MyGeolocationTopTabNavigatorOne}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.dropLostCancel}
        component={DropLostCancelNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.eventDashboard}
        component={EventDashboardNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.taskTransfer}
        component={TaskTransferStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.helpdesk}
        component={HelpDeskStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.settings}
        component={SettingsStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.digitalPayment}
        component={DigitalPaymentStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.dropAnalysis}
        component={DropAnalysisStackNavigator}
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
        name={DrawerStackIdentifiers.taskManagement}
        component={TaskManagementStackNavigator}
      />

      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.eventManagement}
        component={EventManagementStackNavigator}
      />

      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.evtbrlReport}
        component={TabNavigator}
        initialParams={{ screen: "EVTBRL_REPORT" }}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.digitalDashboard}
        component={DigitalDashboardStackNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.receptionistDashboard}
        component={ReceptionistDashboardNavigator}
      />
      <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.reportDownload}
        component={DownloadReportNavigator}
      />
      {/* <MainDrawerNavigator.Screen
        name={DrawerStackIdentifiers.preBooking}
        component={PreBookingStackNavigator}
      /> */}
      <MainDrawerNavigator.Screen
        name={"Target Settings"}
        component={TargetSettingsScreen}
      />
    </MainDrawerNavigator.Navigator>
  );
};
const DownloadReportStack = createStackNavigator();

const DownloadReportNavigator = ({ navigation }) => {
  return (
    <DownloadReportStack.Navigator
      initialRouteName={"REPORT_DOWNLOAD"}
      screenOptions={screeOptionStyle}
    >
      <DownloadReportStack.Screen
        name={"REPORT_DOWNLOAD"}
        component={DownloadReportScreen}
        options={{
          title: "Download Report",
          headerShown: true,
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </DownloadReportStack.Navigator>
  );
};

const DropLostStack = createStackNavigator();

const DropLostCancelNavigator = ({ navigation }) => {
  return (
    <DropLostStack.Navigator
      initialRouteName={"DROP_LOST_CANCEL"}
      screenOptions={screeOptionStyle}
    >
      <DropLostStack.Screen
        name={"DROP_LOST_CANCEL"}
        component={DropLostCancelScreen}
        options={{
          title: "Drop/Lost/Cancel",
          headerShown: true,
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
    </DropLostStack.Navigator>
  );
};

const EventDashboardStack = createStackNavigator();

const EventDashboardNavigator = ({ navigation }) => {
  return (
    <EventDashboardStack.Navigator
      initialRouteName={EventDashboardStackIdentifiers.home}
      screenOptions={screeOptionStyle}
    >
      <EventDashboardStack.Screen
        name={EventDashboardStackIdentifiers.home}
        component={EventDashBoardScreen}
        options={{
          title: "Event Dashboard",
          headerShown: true,
          headerLeft: () => <MenuIcon navigation={navigation} />,
        }}
      />
      <EventDashboardStack.Screen
        name={EventDashboardStackIdentifiers.sourceModel}
        component={EventSourceModel}
        options={{
          title: "Event Source/Model",
        }}
      />
    </EventDashboardStack.Navigator>
  );
};
// const MainStackNavigator = createStackNavigator();

// const MainStackNavigator = ({ navigation }) => {
//     return (

//     )
// }
const MainStack = createStackNavigator();

const MainStackNavigator = ({ navigation }) => {
  return (
    <MainStack.Navigator
      initialRouteName={"MAIN_SCREEN"}
      screenOptions={screeOptionStyle}
    >
      <MainStack.Screen
        name={"MAIN_SCREEN"}
        component={MainStackDrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name={"NOTIF_1"}
        component={NotificationScreen}
        options={{ title: "Notifications" }}
      />
      <MainStack.Screen
        name={MyTasksStackIdentifiers.webCallScreen}
        component={WebCallScreen}
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerTintColor: Colors.BLACK,
        }}
      />
    </MainStack.Navigator>
  );
};

export { MainStackDrawerNavigator, MainStackNavigator };
