
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, SectionList, TouchableOpacity, Image, Platform, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getWorkFlow, getEnquiryDetails, getLeadAge, getFollowUPCount, getTestDriveHistoryCount } from "../../../redux/taskThreeSixtyReducer";
import { Colors, GlobalStyle } from "../../../styles"
import moment from "moment";
import { AppNavigator } from "../../../navigations";
import { showToast } from "../../../utils/toast";
import * as AsyncStore from "../../../asyncStore";
import { EmsStackIdentifiers } from "../../../navigations/appNavigator";
import AnimLoaderComp from "../../../components/AnimLoaderComp";

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

const TaskThreeSixtyScreen = ({ route, navigation }) => {

  const { universalId, mobileNo, itemData, leadStatus } = route.params;
  const dispatch = useDispatch();
  const selector = useSelector(state => state.taskThreeSixtyReducer);
  const [plannedTasks, setPlannedTasks] = useState([]);
  const [closedTasks, setClosedTasks] = useState([]);
  const [dataForSectionList, setDataForSectionList] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [isApprovar, setIsApprovar] = useState(false);
  const [dataForFOllowUpCount, setdataForFOllowUpCount] = useState([]);

  useEffect(async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserRole(jsonObj.hrmsRole)
      if (jsonObj?.hrmsRole === "Test drive approver") {
        setIsApprovar(true)
      }
    }
    dispatch(getEnquiryDetails(universalId));
  }, [])

  useEffect(() => {
    navigation.addListener('focus', () => {
      dispatch(getLeadAge(universalId));
      dispatch(getFollowUPCount(universalId));
      dispatch(getTestDriveHistoryCount(universalId));
    })
  }, [navigation])

  useEffect(() => {
    if (selector.followUpcount_Status ==="fulfilled")  {
      
      setdataForFOllowUpCount(selector.followUpCount);
    }
  
    
  }, [selector.followUpCount])
  

  // Handle enquiry Details response
  useEffect(() => {
    if (selector.enquiry_leadDto_response_status === "success") {
      dispatch(getWorkFlow(universalId));
    }
  }, [selector.enquiry_leadDto_response, selector.enquiry_leadDto_response_status])


  // Handle work flow response
  useEffect(async () => {
    if (selector.wrokflow_response_status === "success") {
      const plannedData = [];
      const closedData = [];
      const data = [];
      if (selector.wrokflow_response.length > 0) {
        selector.wrokflow_response.forEach(element => {
          if (element.taskStatus === "CLOSED") {
            closedData.push(element);
          } else if (
            (element.taskStatus !== "CLOSED" &&
              selector.enquiry_leadDto_response.leadStage ===
              element.taskCategory.taskCategory) ||
            (element.taskCategory.taskCategory === "APPROVAL" &&
              element.taskStatus === "ASSIGNED") ||
            ((element.taskStatus && element.taskStatus !== "APPROVAL") &&
              (element.taskName === "Home Visit" ||
                element.taskName === "Test Drive"))
          ) {
            plannedData.push(element);
          }
        });
      }

      setPlannedTasks(plannedData);

      if (plannedData.length > 0)
        data.push({ title: "Planned Tasks", data: plannedData });

      if (closedData.length > 0)
        data.push({ title: "Closed Tasks", data: closedData });
      
      setDataForSectionList(data)
    }
  }, [selector.wrokflow_response_status, selector.wrokflow_response])

  function checkForTaskNames(taskName) {
    if (taskName.includes('Pre Enquiry')) {
      taskName = taskName.replace('Pre Enquiry', 'Contacts');
    } else if (taskName.includes('Pre Booking')) {
      taskName = taskName.replace('Pre Booking', 'Booking Approval');
    }
    // else if (taskName.includes('Booking')) {
    //     taskName = taskName.replace('Booking', 'Booking View');
    // }
    return taskName
  }

  const itemClicked = (item) => {
    const taskName = item.taskName;
    const taskId = item.taskId;
    const universalId = item.universalId;
    const taskStatus = item.taskStatus;
    const mobileNumber = item.assignee?.mobile ? item.assignee?.mobile : "";

    if (item.taskStatus === 'CLOSED') {
      const name = checkForTaskNames(taskName)
      showToast(name + " task has been closed");
      return;
    }

    const trimName = taskName.toLowerCase().trim();
    const finalTaskName1 = trimName.replace(/ /g, "");
    const finalTaskName = finalTaskName1.replace(/-/g, "");
    let navigationId = ""
    let taskNameNew = ''
    switch (finalTaskName) {
      case "testdrive":
        navigationId = AppNavigator.EmsStackIdentifiers.testDrive;
        taskNameNew = 'Test Drive'
        break;
      case "testdriveapproval":
        navigationId = AppNavigator.EmsStackIdentifiers.testDrive;
        taskNameNew = 'Test Drive'
        break;
      case "proceedtoprebooking":
        if (leadStatus === 'ENQUIRYCOMPLETED')
          navigationId = AppNavigator.EmsStackIdentifiers.proceedToPreBooking;
        else showToast('Please submit the enquiry form')
        taskNameNew = ''
        break;
      case "proceedtobooking":
        if (leadStatus === 'PREBOOKINGCOMPLETED')
          navigationId = AppNavigator.EmsStackIdentifiers.proceedToPreBooking;
        else showToast('Please complete the booking approval process')
        taskNameNew = ''
        break;
      case "homevisit":
        navigationId = AppNavigator.EmsStackIdentifiers.homeVisit;
        taskNameNew = 'Home Visit'
        break;
      case "enquiryfollowup":
        navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
        taskNameNew = 'Enquiry followup'
        break;
      case "preenquiryfollowup":
        navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
        taskNameNew = 'Contacts followup'
        break;
      case "bookingfollowupdse":
        navigationId = AppNavigator.EmsStackIdentifiers.bookingFollowUp;
        taskNameNew = "Booking Followup -DSE"
        break;
      case "prebookingfollowup":
        navigationId = AppNavigator.EmsStackIdentifiers.enquiryFollowUp;
        taskNameNew = 'Booking approval task'
        break;
      case "createenquiry":
        navigationId = AppNavigator.EmsStackIdentifiers.confirmedPreEnq;
        taskNameNew = ''
        break;
    }
    if (!navigationId) { return }
    if (navigationId === AppNavigator.EmsStackIdentifiers.confirmedPreEnq) {
      navigation.navigate(navigationId, { itemData: itemData, fromCreatePreEnquiry: false })
    }
    else {
      navigation.navigate(navigationId, { identifier: mytasksIdentifires[finalTaskName], taskId, universalId, taskStatus, taskData: item, mobile: mobileNo, reasonTaskName: taskNameNew, fromScreen: "taskThreeSixty" });
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
      android: "geo:" + latitude + "," + longitude
    });

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        const browser_url =
          "https://www.google.de/maps/@" +
          latitude +
          "," +
          longitude;
        return Linking.openURL(browser_url);
      }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>

        <SectionList
          sections={dataForSectionList}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index, section }) => {
            const date = moment(item.taskUpdatedTime).format("DD/MM/YY h:mm a").split(" ");

            let topBcgColor = Colors.LIGHT_GRAY;
            let bottomBcgColor = Colors.LIGHT_GRAY;
            if (section.data[index - 1] !== undefined) {
              topBcgColor = Colors.GRAY;
            }

            if (section.data[index + 1] !== undefined) {
              bottomBcgColor = Colors.GRAY;
            }

            function TaskNameView(taskName) {
              const name = checkForTaskNames(taskName)
              return (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    marginBottom: 5,
                    // flex:1
                    width: "60%",
                  }}
                >
                  {name}
                  {item?.taskUpdatedBy?.designationName ? (
                    <Text
                      style={styles.sideTitle}
                    >{` - ${item?.taskUpdatedBy?.designationName}`}</Text>
                  ) : null}
                </Text>
              );
            }


            // Pre Booking Follow Up = Booking approval follow up 
            // Booking Follow Up - DSE = booking followup
            // Enquiry Follow Up=Enquiry Follow Up
            // pre Enquiry Follow Up= Contact follow up 
            let isHistory = section.title == "Planned Tasks";
            let isDotVisible = item.taskName.includes("Pre Booking Follow Up")
              || item.taskName.includes("Booking Follow Up - DSE")
              || item.taskName.includes("Enquiry Follow Up")
              || item.taskName.includes("Pre Enquiry Follow Up");
            let isDotVisibleForClosed = item.taskName.includes("Pre Booking Follow Up")
              || item.taskName.includes("Booking Follow Up - DSE")
              || item.taskName.includes("Enquiry Follow Up")
              || item.taskName.includes("Pre Enquiry Follow Up") || item.taskName.includes("Test Drive");
            
            // let isDotVisible = item.taskName == "Pre Enquiry Follow Up" || item.taskName == "Enquiry Follow Up" 
            //   || item.taskName == "Pre Booking Follow Up" || item.taskName == "Enquiry Follow Up" ;

            return (
              <>
                {item.taskName === "Test Drive Approval" ? (
                  isApprovar ? (
                    <View
                      style={styles.view2}
                    >
                      <View
                        style={styles.view3}
                      >
                        <View
                          style={{
                            marginLeft: 8,
                            flex: 1,
                            width: 2,
                            backgroundColor: topBcgColor,
                          }}
                        ></View>
                        <View
                          style={{
                            marginLeft: 8,
                            flex: 1,
                            width: 2,
                            backgroundColor: bottomBcgColor,
                          }}
                        ></View>

                        <View
                          style={{
                            alignItems: "center",
                            flexDirection: "row",
                            position: "absolute",
                          }}
                        >
                          <Text
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              backgroundColor: Colors.GRAY,
                            }}
                          ></Text>
                          <View style={{ marginLeft: 5 }}>
                            <Text
                              style={styles.txt2}
                            >
                              {date[0]}
                            </Text>
                            <Text
                              style={styles.txt2}
                            >
                              {date[1] + " " + date[2]}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ width: "75%", padding: 5 }}>
                        <View
                          style={[
                            { backgroundColor: Colors.WHITE },
                            GlobalStyle.shadow,
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => itemClicked(item)}
                          >
                            <View
                              style={[
                                styles.view1,
                              ]}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  style={styles.txt1}
                                >
                                  {item.taskName}
                                </Text>
                                {item.lat && item.lon && (
                                  <TouchableOpacity
                                    style={styles.btn1}
                                    onPress={() =>
                                      openMap(item.lat, item.lon)
                                    }
                                  >
                                    <Image
                                      style={{
                                        height: 25,
                                        width: 15,
                                      }}
                                      source={require("../../../assets/images/location-pin.png")}
                                      tintColor={Colors.PINK}
                                    />
                                  </TouchableOpacity>
                                )}
                              </View>
                              <Text
                                style={styles.txt3}
                              >
                                {"Assignee: " +
                                  item.assignee?.empName}
                              </Text>
                              {item?.taskUpdatedBy?.empName ? (
                                <Text style={styles.followUpText}>
                                  Follow-up by:{" "}
                                  {item.taskUpdatedBy.empName}
                                </Text>
                              ) : null}
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "400",
                                  color: Colors.GRAY,
                                }}
                              >
                                {"Remarks: " +
                                  (item.employeeRemarks
                                    ? item.employeeRemarks
                                    : "")}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : null
                ) : (
                  <View
                    style={styles.view4}
                  >
                    <View
                      style={styles.view3}
                    >
                      <View
                        style={{
                          marginLeft: 8,
                          flex: 1,
                          width: 2,
                          backgroundColor: topBcgColor,
                        }}
                      ></View>
                      <View
                        style={{
                          marginLeft: 8,
                          flex: 1,
                          width: 2,
                          backgroundColor: bottomBcgColor,
                        }}
                      ></View>

                      <View
                        style={styles.view5}
                      >
                        <Text
                          style={{
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            backgroundColor: Colors.GRAY,
                          }}
                        ></Text>
                        <View style={{ marginLeft: 5 }}>
                          <Text
                            style={styles.txt2}
                          >
                            {date[0]}
                          </Text>
                          <Text
                            style={styles.txt2}
                          >
                            {date[1] + " " + date[2]}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        // width: isHistory ? "80%" : "80%",
                        padding: 5,
                        flex: 1
                      }}
                    >

                      <View
                        style={[
                          { backgroundColor: Colors.RED, flexDirection: "row" },
                          GlobalStyle.shadow, styles.view1,
                        ]}
                      >
                        <TouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => itemClicked(item)}
                        >
                          <View
                            style={[
                              styles.view1,
                            ]}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                                // backgroundColor:"red"
                              }}
                            >

                              {TaskNameView(item.taskName)}
                              {/* Bubble count UI  */}

                              {isDotVisibleForClosed && !isHistory && (
                                <View
                                  style={[styles.btn4, { marginEnd: item.lat && item.lon ? 10 : 0, }]}

                                >
                                  <Image
                                    source={require("./../../../assets/images/check-list.png")}
                                    resizeMode="contain"
                                    tintColor={Colors.GRAY}
                                    style={[styles.countCointaner]}
                                  />
                                    {dataForFOllowUpCount !== undefined ? <Text style={styles.txt8}>{item.taskName === "Pre Enquiry Follow Up" ?
                                      dataForFOllowUpCount?.conntactFollowUpCount?.toString().trim()
                                      : item.taskName === "Enquiry Follow Up" ? dataForFOllowUpCount?.enquiryFollowUpCount.toString().trim() :
                                        item.taskName === "Pre Booking Follow Up" ? dataForFOllowUpCount?.preBookingFollowUpCount.toString().trim() :
                                          item.taskName === "Booking Follow Up" ? dataForFOllowUpCount?.bookingFollowUpCount.toString().trim() : item.taskName === "Test Drive" ? selector.testDrivCount : 0}
                                    </Text> : null}
                                </View>
                                // <View
                                //   style={styles.btn3}

                                // >
                                //   <Text style={styles.txt7}>3</Text>
                                // </View>
                              )}
                              {isDotVisible && isHistory && (
                                <View
                                  style={[styles.btn4, { marginEnd: item.lat && item.lon ? 10 : 0, }]}

                                >
                                  <Image
                                    source={require("./../../../assets/images/check-list.png")}
                                    resizeMode="contain"
                                    tintColor={Colors.GRAY}
                                    style={[styles.countCointaner]}
                                  />
                                    {dataForFOllowUpCount !== undefined ? <Text style={styles.txt8}>{item.taskName === "Pre Enquiry Follow Up" ?
                                      dataForFOllowUpCount?.conntactFollowUpCount?.toString().trim()
                                      : item.taskName === "Enquiry Follow Up" ? dataForFOllowUpCount?.enquiryFollowUpCount?.toString().trim() :
                                        item.taskName === "Pre Booking Follow Up" ? dataForFOllowUpCount?.preBookingFollowUpCount?.toString().trim() :
                                          item.taskName === "Booking Follow Up" ? dataForFOllowUpCount?.bookingFollowUpCount?.toString().trim() : 0}
                                    </Text> : null }
                                    
                                </View>
                                // <View
                                //   style={styles.btn3}

                                // >
                                //   <Text style={styles.txt7}>3</Text>
                                // </View>
                              )}
                              {item.lat && item.lon && (
                                <TouchableOpacity
                                  style={styles.btn2}
                                  onPress={() =>
                                    openMap(item.lat, item.lon)
                                  }
                                >
                                  <Image
                                    style={{
                                      height: 25,
                                      width: 15,
                                    }}
                                    source={require("../../../assets/images/location-pin.png")}
                                    tintColor={Colors.PINK}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                            <Text
                              style={styles.txt3}
                            >
                              {"Assignee: " +
                                item.assignee?.empName}
                            </Text>
                            {item?.taskUpdatedBy?.empName ? (
                              <Text style={styles.followUpText}>
                                Follow-up by:{" "}
                                {item.taskUpdatedBy.empName}
                              </Text>
                            ) : null}
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "400",
                                  color: Colors.GRAY,
                                  flex: 1
                                }}
                              >
                                {"Remarks: " +
                                  (item.employeeRemarks
                                    ? item.employeeRemarks
                                    : "")}
                              </Text>

                            </View>

                          </View>
                        </TouchableOpacity>

                        {isHistory && isDotVisible ? (
                          <TouchableOpacity
                            style={{ justifyContent: "center" }}
                            onPress={() =>
                              navigation.navigate(
                                EmsStackIdentifiers.task360History,
                                {
                                  identifier:
                                    mytasksIdentifires.task360History,
                                  title: item.taskName,
                                  universalId: item.universalId,
                                }
                              )
                            }
                          >
                            <Image
                              source={require("./../../../assets/images/dots.png")}
                              resizeMode="contain"
                              style={styles.dotContainer}
                            />
                          </TouchableOpacity>
                        ) : null}
                        {!isHistory && isDotVisibleForClosed ? (
                          <TouchableOpacity
                            style={{ justifyContent: "center", }}
                            onPress={() => {
                              if (item.taskName !== "Test Drive") {
                                navigation.navigate(
                                  EmsStackIdentifiers.task360History,
                                  {
                                    identifier:
                                      mytasksIdentifires.task360History,
                                    title: item.taskName,
                                    universalId: item.universalId,
                                  }
                                )
                              } else {
                                navigation.navigate("TEST_HISTORY", {
                                  universalId: universalId,

                                })
                              }
                            }
                            }
                          >
                            <Image
                              source={require("./../../../assets/images/dots.png")}
                              resizeMode="contain"
                              style={styles.dotContainer}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>


                  </View>
                )}
              </>
            );
          }}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ height: 50, justifyContent: "center" }}>
              <Text style={styles.txt4}>{title}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
};

export default TaskThreeSixtyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  sideTitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  followUpText: {
    fontSize: 14,
    fontWeight: "400",
    marginVertical: 3,
  },

  dotContainer: {
    height: 55,
    width: 30,
    // backgroundColor:"red",
    marginTop: 40
  },
  view1: {
    paddingVertical: 5,
    paddingLeft: 10,
    backgroundColor: Colors.WHITE,
  },
  txt1: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    width: "75%"
  },
  btn1: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 5,
    marginTop: -5,
  },
  view2: {
    width: "100%",
    flexDirection: "row",
  },
  view3: {
    width: "25%",
    justifyContent: "center",
  },
  txt2: {
    fontSize: 12,
    fontWeight: "400",
  },
  txt3: {
    fontSize: 14,
    fontWeight: "400",
  },
  view4: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  view5: {
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  btn2: {
    alignSelf: "flex-start",
    marginTop: -5,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 5,
    // marginEnd:-15
  },
  btn3: {
    alignSelf: "flex-start",
    marginTop: -5,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 5,
    marginEnd: -15

  },
  txt4: { fontSize: 18, fontWeight: "700", marginBottom: 5 },
  txt7: { fontSize: 16, fontWeight: "500", color: Colors.RED },
  countCointaner: {
    height: 25,
    width: 25,

  },
  txt8: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.WHITE,
    position: "absolute",
    left: 28,
    top: -3,
    backgroundColor: Colors.PINK,
    borderWidth: 1,
    borderColor: Colors.PINK,
    borderRadius: 5,
    textAlign: "center",
    width: 15,
    overflow:"hidden",
    

  },
  txt9: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.WHITE,
    position: "absolute",
    left: 28,
    top: -3,
    backgroundColor: Colors.PINK,
    borderWidth: 1,
    borderColor: Colors.PINK,
    borderRadius: 5,
    textAlign: "center",
    width: 15,
    overflow: "hidden",
    height:15

  },
  btn4: {
    alignSelf: "flex-start",
    // marginTop: -5,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "#d1d1d1",
    // borderRadius: 5,


  },
});
