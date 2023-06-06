import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, SectionList, ActivityIndicator, TouchableOpacity, Image, Platform, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getWorkFlow, getEnquiryDetails, getLeadAge, getFollowUPCount, getTestDriveHistoryCount, clearListData } from "../../../redux/taskThreeSixtyReducer";
import { Colors, GlobalStyle } from "../../../styles"
import moment from "moment";
import { AppNavigator } from "../../../navigations";
import { showToast } from "../../../utils/toast";
import * as AsyncStore from "../../../asyncStore";
import { EmsStackIdentifiers } from "../../../navigations/appNavigator";
import AnimLoaderComp from "../../../components/AnimLoaderComp";
import { IconButton } from "react-native-paper";
import { callNumber } from "../../../utils/helperFunctions";

const mytasksIdentifires = {
  testdrive: "TEST_DRIVE",
  testdriveapproval: "TEST_DRIVE_APPROVAL",
  proceedtobooking: "PROCEED_TO_BOOKING",
  proceedtoprebooking: "PROCEED_TO_PRE_BOOKING",
  prebookingfollowup: "PRE_BOOKING_FOLLOW_UP",
  homevisit: "HOME_VISIT",
  enquiryfollowup: "ENQUIRY_FOLLOW_UP",
  preenquiryfollowup: "PRE_ENQUIRY_FOLLOW_UP",
  createenquiry: "CREATE_ENQUIRY",
  bookingfollowupdse: "BOOKING_FOLLOW_UP",
  task360History: "TASK_360_HISTORY",
};

const disabledColor = Colors.TARGET_GRAY;
const activeColor = Colors.PINK;

const TaskThreeSixtyScreen = ({ route, navigation }) => {
  const { universalId, mobileNo, itemData, leadStatus } = route.params;
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.taskThreeSixtyReducer);
  const [plannedTasks, setPlannedTasks] = useState([]);
  const [closedTasks, setClosedTasks] = useState([]);
  const [dataForSectionList, setDataForSectionList] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [isApprovar, setIsApprovar] = useState(false);
  const [dataForFOllowUpCount, setdataForFOllowUpCount] = useState([]);
  const [userData, setUserData] = useState({ orgName: "" });

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({ orgName: jsonObj.orgName });
      setUserRole(jsonObj.hrmsRole);
      if (jsonObj?.hrmsRole === "Test drive approver") {
        setIsApprovar(true);
      }
    }
    dispatch(getEnquiryDetails(universalId));
  }, []);

  useEffect(() => {
     return () => {
      setPlannedTasks([]);
      dispatch(clearListData());
    };
  }, []);
  
  useEffect(() => {
    navigation.addListener('focus', () => {
      dispatch(getLeadAge(universalId));
      dispatch(getFollowUPCount(universalId));
      dispatch(getTestDriveHistoryCount(universalId));
    });
  }, [navigation]);

  useEffect(() => {
    if (selector.followUpcount_Status === "fulfilled") {
      setdataForFOllowUpCount(selector.followUpCount);
    }
  }, [selector.followUpCount]);

  // Handle enquiry Details response
  useEffect(() => {
    if (selector.enquiry_leadDto_response_status === "success") {
      dispatch(getWorkFlow(universalId));
    }
  }, [
    selector.enquiry_leadDto_response,
    selector.enquiry_leadDto_response_status,
  ]);

  // Handle work flow response
  useEffect(async () => {
    if (selector.wrokflow_response_status === "success") {
      const plannedData = [];
      const closedData = [];
      const data = [];
      if (selector.wrokflow_response.length > 0) {
        selector.wrokflow_response.forEach((element) => {
            if (element.taskStatus === "CLOSED") {
              closedData.push(element);
            } else if (
              (element.taskStatus !== "CLOSED" &&
                selector.enquiry_leadDto_response.leadStage ===
                  element.taskCategory.taskCategory) ||
              (element.taskCategory.taskCategory === "APPROVAL" &&
                element.taskStatus === "ASSIGNED")  || 
              (element.taskStatus &&
                element.taskStatus !== "APPROVAL" &&
                (element.taskName === "Home Visit" ||
                  element.taskName === "Test Drive")) 
                  // || (selector.enquiry_leadDto_response.leadStage === "PREBOOKING") && element.taskCategory.taskCategory ==="ENQUIRY"
            ) {
              plannedData.push(element);
            } else if (element.taskStatus !== "CLOSED"  && element.taskName === "Evaluation" || element.taskName === "Finance"){
              if (selector.enquiry_leadDto_response.leadStage !== "PREENQUIRY"){ // added to manage not display in contacts 
                plannedData.push(element);
              }
            
            }
        });
      }

      setPlannedTasks(plannedData);

      if (plannedData.length > 0)
        data.push({ title: "Planned Tasks", data: plannedData });

      if (closedData.length > 0)
        data.push({ title: "Closed Tasks", data: closedData });

      setDataForSectionList(data);
    }
  }, [selector.wrokflow_response_status, selector.wrokflow_response]);

  function checkForTaskNames(taskName) {
    if (taskName.includes("Pre Enquiry")) {
      taskName = taskName.replace("Pre Enquiry", "Contacts");
    } else if (taskName.includes("Pre Booking")) {
      taskName = taskName.replace("Pre Booking", "Booking Approval");
    }
    // else if (taskName.includes('Booking')) {
    //     taskName = taskName.replace('Booking', 'Booking View');
    // }
    return taskName;
  }

  const itemClicked = (item) => {
    const taskName = item.taskName;
    const taskId = item.taskId;
    const universalId = item.universalId;
    const taskStatus = item.taskStatus;
    const mobileNumber = item.assignee?.mobile ? item.assignee?.mobile : "";

    if (item.taskStatus === "CLOSED" && taskName !== "Test Drive" && taskName !== "Home Visit" && taskName !== "Re Test Drive" && taskName !== "Re Home Visit") {
      const name = checkForTaskNames(taskName);
      
      showToast(name + " task has been closed");
      return;
    }

    const trimName = taskName.toLowerCase().trim();
    const finalTaskName1 = trimName.replace(/ /g, "");
    const finalTaskName = finalTaskName1.replace(/-/g, "");
    let navigationId = "";
    let taskNameNew = "";
    switch (finalTaskName) {
      case "testdrive":
        navigationId = AppNavigator.EmsStackIdentifiers.testDrive;
        taskNameNew = "Test Drive";
        break;
      case "retestdrive":
        navigationId = AppNavigator.EmsStackIdentifiers.testDrive;
        taskNameNew = "Test Drive";
        break;
      case "testdriveapproval":
        navigationId = AppNavigator.EmsStackIdentifiers.testDrive;
        taskNameNew = "Test Drive";
        break;
      case "proceedtoprebooking":
        if (leadStatus === "ENQUIRYCOMPLETED")
          navigationId = AppNavigator.EmsStackIdentifiers.proceedToPreBooking;
        else showToast("Please submit the enquiry form");
        taskNameNew = "";
        break;
      case "proceedtobooking":
        if (leadStatus === "PREBOOKINGCOMPLETED")
          navigationId = AppNavigator.EmsStackIdentifiers.proceedToPreBooking;
        else showToast("Please complete the booking approval process");
        taskNameNew = "";
        break;
      case "homevisit":
        navigationId = AppNavigator.EmsStackIdentifiers.homeVisit;
        taskNameNew = "Home Visit";
        break;
      case "rehomevisit":
        navigationId = AppNavigator.EmsStackIdentifiers.homeVisit;
        taskNameNew = "Home Visit";
        break;
      case "enquiryfollowup":
        navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
        taskNameNew = "Enquiry followup";
        break;
      case "preenquiryfollowup":
        navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
        taskNameNew = "Contacts followup";
        break;
      case "bookingfollowupdse":
        navigationId = AppNavigator.EmsStackIdentifiers.bookingFollowUp;
        taskNameNew = "Booking Followup -DSE";
        break;
      case "prebookingfollowup":
        navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
        taskNameNew = "Booking approval task";
        break;
      case "createenquiry":
        navigationId = AppNavigator.EmsStackIdentifiers.confirmedPreEnq;
        taskNameNew = "";
        break;
    }
    if (!navigationId) {
      return;
    }
    if (navigationId === AppNavigator.EmsStackIdentifiers.confirmedPreEnq) {
      navigation.navigate(navigationId, {
        itemData: itemData,
        fromCreatePreEnquiry: false,
      });
    } else {
      navigation.navigate(navigationId, {
        identifier: mytasksIdentifires[finalTaskName],
        taskId,
        universalId,
        taskStatus,
        taskData: item,
        mobile: mobileNo,
        reasonTaskName: taskNameNew,
        fromScreen: "taskThreeSixty",
      });
    }
  };

  if (selector.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AnimLoaderComp visible={true} />
      </View>
    );
  }

  const openMap = (latitude, longitude) => {
    // if(Platform.OS === 'ios'){
    //     Linking.openURL(`maps://app?saddr=100+101&daddr=${latitude}+${longitude}`)
    // }
    // if (Platform.OS === 'android') {
    //     Linking.openURL(`google.navigation:q=${latitude}+${longitude}`)
    // }

    // const latitude = "40.7127753";
    // const longitude = "-74.0059728";
    const label = "New York, NY, USA";

    const url = Platform.select({
      ios: "maps:" + latitude + "," + longitude,
      android: "geo:" + latitude + "," + longitude,
    });

    Linking.canOpenURL(url).then((supported) => {
      // if (supported) {
      //   return Linking.openURL(url);
      // } else 
      {
        const browser_url =
          "https://www.google.de/maps?q=" + latitude + "," + longitude;
        return Linking.openURL(browser_url);
        // const browser_url =
        //   "https://www.google.de/maps/@" + latitude + "," + longitude;
        // return Linking.openURL(browser_url);
      }
    });
  };

  const checkForEnqFollow = (item, section) => {
    if (
      item.taskName == "Enquiry Follow Up" &&
      section?.title == "Planned Tasks"
    ) {
      let formate = "DD/MM/YYYY hh:mm a";
      const { taskUpdatedTime } = item;
      const current = moment().format(formate);
      const startDate = moment(current, formate);
      const create = moment(taskUpdatedTime).format(formate);
      const createDate = moment(create, formate);
      const timeDiff = startDate.diff(createDate, "hours");
      return timeDiff;
    } else {
      return 0;
    }
  };

  const renderItem = ({ item, index, section }) => {
    let isHistory = section.title == "Planned Tasks";
    let isDotVisible =
      item.taskName.includes("Pre Booking Follow Up") ||
      item.taskName.includes("Booking Follow Up - DSE") ||
      item.taskName.includes("Enquiry Follow Up") ||
      item.taskName.includes("Pre Enquiry Follow Up");
    let isDotVisibleForClosed =
      item.taskName.includes("Pre Booking Follow Up") ||
      item.taskName.includes("Booking Follow Up - DSE") ||
      item.taskName.includes("Enquiry Follow Up") ||
      item.taskName.includes("Pre Enquiry Follow Up") ||
      item.taskName.includes("Test Drive");

    function TaskNameView(taskName) {
      const name = checkForTaskNames(taskName);
      return (
        <Text style={styles.taskNameText}>
          {name}
          {item?.taskUpdatedBy?.designationName ? (
            <Text
              style={styles.sideTitle}
            >{` - ${item?.taskUpdatedBy?.designationName}`}</Text>
          ) : null}
        </Text>
      );
    }

    function isIconEnable(type = "", item) {
      if (type == "location") {
        if (item.lat && item.lon) {
          return true;
        } else {
          return false;
        }
      }

      if (type == "history") {
        if (isHistory && isDotVisible) {
          return true;
        } else if (!isHistory && isDotVisibleForClosed) {
          return true;
        } else {
          return false;
        }
      }

      return true;
    }

    const date = moment(item.taskUpdatedTime)
      .format("DD/MM/YY h:mm a")
      .split(" ");
    const radioColor =
      item.taskStatus === "CLOSED" ? Colors.DARK_GREEN : Colors.LIGHT_GRAY2;
    const isHoursVisible = checkForEnqFollow(item, section) >= 2;

    return (
      <View style={styles.itemContainer}>
        {section.data[index + 1] ? (
          <View
            style={[styles.progressColumn, { backgroundColor: radioColor }]}
          />
        ) : null}
        <View style={styles.radioContainer}>
          <View style={[styles.radioRound, { backgroundColor: radioColor }]} />
        </View>
        <TouchableOpacity
          onPress={() => itemClicked(item)}
          style={[
            styles.itemDetailsContainer,
            isHoursVisible ? styles.cardBorder : null,
          ]}
        >
          {isHoursVisible ? (
            <View style={styles.itemTopRow}>
              <View style={styles.hourContainer}>
                <Text
                  style={styles.hourText}
                >{`Last follow up >${checkForEnqFollow(
                  item,
                  section
                )}hrs`}</Text>
              </View>
              <Text style={styles.dateTimeText}>
                {date[0]} | {date[1] + " " + date[2]}
              </Text>
            </View>
          ) : (
            <Text style={styles.dateTimeText}>
              {date[0]} | {date[1] + " " + date[2]}
            </Text>
          )}

          {TaskNameView(item.taskName)}
          <Text style={styles.assigneeNameText}>
            {"Assignee: " + item.assignee?.empName}
          </Text>
          {item?.taskUpdatedBy?.empName ? (
            <Text style={styles.followUpText}>
              Follow-up by: {item.taskUpdatedBy.empName}
            </Text>
          ) : null}
          {item.employeeRemarks ? (
            <View style={styles.remarksContainer}>
              <Text style={styles.remarksTitleText}>Remarks</Text>
              <Text style={styles.remarksValueText}>
                {item.employeeRemarks}
              </Text>
            </View>
          ) : null}
          <View style={styles.iconContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                if (userData.orgName.includes("BikeWo Corporation")) {
                  callNumber(mobileNo);
                } else {
                  navigation.navigate(
                    AppNavigator.MyTasksStackIdentifiers.webCallScreen,
                    {
                      phone: mobileNo,
                      uniqueId: item.taskId,
                    }
                  );
                }
              }}
              style={styles.iconBoxView}
            >
              <View style={styles.iconView}>
                <IconButton
                  icon={"phone"}
                  borderless={true}
                  size={19}
                  style={styles.playIcon}
                  color={activeColor}
                />
              </View>
              <Text style={styles.iconText}>Call</Text>
            </TouchableOpacity>
            <View style={styles.iconDivider} />
            {userData.orgName !== "BikeWo Corporation" ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    navigation.navigate(
                      AppNavigator.EmsStackIdentifiers.recordedCalls,
                      {
                        taskId: item.taskId,
                      }
                    );
                  }}
                  style={styles.iconBoxView}
                >
                  <View style={styles.iconView}>
                    <IconButton
                      icon={"play"}
                      size={20}
                      style={styles.playIcon}
                      color={activeColor}
                    />
                  </View>
                  <Text numberOfLines={1} style={styles.iconText}>
                    Recordings
                  </Text>
                </TouchableOpacity>
                <View style={styles.iconDivider} />
                <TouchableOpacity
                  onPress={() => openMap(item.lat, item.lon)}
                  activeOpacity={0.6}
                  style={styles.iconBoxView}
                  disabled={!isIconEnable("location", item)}
                >
                  <View style={styles.iconView}>
                    <IconButton
                      icon={"map-marker"}
                      size={18}
                      style={styles.playIcon}
                      color={
                        isIconEnable("location", item)
                          ? activeColor
                          : disabledColor
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.iconText,
                      !isIconEnable("location", item)
                        ? styles.disabledText
                        : "",
                    ]}
                  >
                    Geo
                  </Text>
                </TouchableOpacity>
                <View style={styles.iconDivider} />
              </>
            ) : null}

            <View style={styles.iconBoxView}>
              <View style={styles.iconView}>
                <IconButton
                  icon={"checkbox-marked-circle-outline"}
                  size={18}
                  style={styles.playIcon}
                  color={activeColor}
                />
                {dataForFOllowUpCount !== undefined ? (
                  <Text style={styles.followUpCountText}>
                    {item.taskName === "Pre Enquiry Follow Up"
                      ? dataForFOllowUpCount?.conntactFollowUpCount
                          ?.toString()
                          .trim()
                      : item.taskName === "Enquiry Follow Up"
                      ? dataForFOllowUpCount?.enquiryFollowUpCount
                          ?.toString()
                          .trim()
                      : item.taskName === "Pre Booking Follow Up"
                      ? dataForFOllowUpCount?.preBookingFollowUpCount
                          ?.toString()
                          .trim()
                      : item.taskName === "Booking Follow Up"
                      ? dataForFOllowUpCount?.bookingFollowUpCount
                          ?.toString()
                          .trim()
                      : item.taskName === "Booking Follow Up - DSE"
                      ? dataForFOllowUpCount?.bookingFollowUpCountDse
                          ?.toString()
                          .trim()
                      : 0}
                  </Text>
                ) : null}
              </View>
              <Text numberOfLines={1} style={styles.iconText}>
                Follow-ups
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isHistory && isDotVisible) {
              navigation.navigate(EmsStackIdentifiers.task360History, {
                identifier: mytasksIdentifires.task360History,
                title: item.taskName,
                universalId: item.universalId,
              });
            } else if (!isHistory && isDotVisibleForClosed) {
              if (item.taskName !== "Test Drive") {
                navigation.navigate(EmsStackIdentifiers.task360History, {
                  identifier: mytasksIdentifires.task360History,
                  title: item.taskName,
                  universalId: item.universalId,
                });
              } else {
                navigation.navigate("TEST_HISTORY", {
                  universalId: universalId,
                });
              }
            } else {
              showToast("Not Available");
            }
          }}
        >
          <Image
            source={require("./../../../assets/images/dots_sixty.png")}
            resizeMode="contain"
            style={[
              styles.dotContainer,
              {
                tintColor: isIconEnable("history")
                  ? Colors.BLACK
                  : disabledColor,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <SectionList
          sections={dataForSectionList}
          keyExtractor={(item, index) => item + index}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ height: 50, justifyContent: "center" }}>
              <Text style={styles.txt4}>{title}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default TaskThreeSixtyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.WHITE,
  },
  txt4: { fontSize: 18, fontWeight: "700", marginBottom: 5 },
  progressColumn: {
    height: "100%",
    width: 3,
    backgroundColor: Colors.LIGHT_GRAY2,
    marginTop: 27,
    position: "absolute",
    marginHorizontal: 8
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  radioContainer: {
    padding: 1,
    height: 18,
    width: 18,
    borderRadius: 18 / 2,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    backgroundColor: Colors.WHITE,
    overflow: "hidden",
    marginTop: 10,
  },
  radioRound: {
    height: "100%",
    width: "100%",
    borderRadius: 18 / 2,
    backgroundColor: Colors.LIGHT_GRAY2,
  },
  itemDetailsContainer: {
    ...GlobalStyle.shadow,
    flex: 1,
    padding: 10,
    backgroundColor: Colors.WHITE,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  cardBorder: {
    borderLeftColor: Colors.PINK,
    borderLeftWidth: 1.5,
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  hourContainer: {
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.PINK,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  hourText: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.BLACK,
  },
  dateTimeText: {
    fontSize: 12,
    fontWeight: "400",
    alignSelf: "flex-end",
  },
  sideTitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  taskNameText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  assigneeNameText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
  },
  followUpText: {
    fontSize: 14,
    fontWeight: "400",
    marginVertical: 5,
  },
  remarksContainer: {
    backgroundColor: Colors.LIGHT_GRAY,
    padding: 5,
    borderRadius: 3,
    marginTop: 5,
  },
  remarksTitleText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.GRAY,
  },
  remarksValueText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.BLACK,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  iconBoxView: {
    alignItems: "center",
    justifyContent: "center",
    width: "24%",
    borderRadius: 3,
    padding: 3,
  },
  iconView: {
    height: 33,
    justifyContent: "center",
  },
  iconText: {
    marginTop: 3,
    fontSize: 10,
    color: Colors.BLACK,
    fontWeight: "500",
  },
  disabledText: {
    color: disabledColor,
  },
  playIcon: {
    margin: 0,
  },
  locationIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.PINK,
    borderRadius: 5,
  },
  locationDisableIcon: {
    borderColor: Colors.TARGET_GRAY,
  },
  followUpCountText: {
    fontSize: 9,
    fontWeight: "500",
    color: Colors.WHITE,
    position: "absolute",
    left: 15,
    top: 0,
    backgroundColor: Colors.PINK,
    borderWidth: 1,
    borderColor: Colors.PINK,
    borderRadius: 5,
    textAlign: "center",
    width: 15,
    overflow: "hidden",
  },
  countContainer: {
    height: 18,
    width: 18,
  },
  dotContainer: {
    height: 30,
    width: 20,
  },
  iconDivider: {
    height: "80%",
    width: 1,
    backgroundColor: Colors.LIGHT_GRAY2,
    alignSelf: "center",
  },
});
