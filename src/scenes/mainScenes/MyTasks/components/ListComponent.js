import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TurboModuleRegistry,
} from "react-native";
import { GlobalStyle, Colors } from "../../../../styles";
import PieChart from "react-native-pie-chart";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useSelector } from "react-redux";
import { MyTasksStackIdentifiers } from "../../../../navigations/appNavigator";
import { EmptyListView } from "../../../../pureComponents";
import * as AsyncStore from "../../../../asyncStore";
import { useDispatch } from "react-redux";
import {
  getMyTasksListApi,
  getMyTeamsTasksListApi,
  role,
  getPendingMyTasksListApi,
  getRescheduleMyTasksListApi,
  getUpcomingMyTasksListApi,
  getTodayMyTasksListApi,
  getTodayTeamTasksListApi,
  getUpcomingTeamTasksListApi,
  getPendingTeamTasksListApi,
  getRescheduleTeamTasksListApi,
  getCompletedMyTasksListApi,
  getCompletedTeamTasksListApi,
} from "../../../../redux/mytaskReducer";
import moment from "moment";
import { showToast } from "../../../../utils/toast";
import { useIsFocused } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const item1Width = screenWidth - 10;
const item2Width = item1Width - 10;
const baseItemWidth = item2Width / 3.4;
const itemWidth = baseItemWidth - 10;

const series = [60, 40];
const sliceColor = ["#5BBD66", Colors.RED];

const globalDateFormat = "YYYY-MM-DD";
const globalCurrentDate = moment().format(globalDateFormat);
const globalStartDate = moment(globalCurrentDate, globalDateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(globalDateFormat);
const globalEndDate = moment(globalCurrentDate, globalDateFormat)
  .subtract(0, "months")
  .endOf("month")
  .format(globalDateFormat);

const NoDataFound = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 14, fontWeight: "600", textAlign: "center" }}>
        {"No Data Found"}
      </Text>
    </View>
  );
};

const taskNames = [
  "testdrive",
  "testdriveapproval",
  "homevisit",
  "enquiryfollowup",
  "preenquiryfollowup",
  "prebookingfollowup",
  "bookingfollowup-dse",
];

const ListComponent = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);
  const [myTasksData, setMyTasksData] = useState([]);
  const [myTeamsData, setMyTeamsData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("TODAY");
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [employeeData, setEmployeeData] = useState();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.mytaskReducer);
  const homeSelector = useSelector((state) => state.homeReducer);

  useEffect(() => {
    if (isFocused) {
      if (route.params) {
        if (homeSelector.isTeamPresent && !homeSelector.isDSE) {
          setIndex(1);
          changeTab(1);
        }
        initialTask(route.params.from ? "MONTH" : "TODAY");
        setSelectedFilter("MONTH");
        setIsOpenFilter(false);
      } else {
        initialTask(selectedFilter);
      }
    }
  }, [isFocused]);

  const defaultData = [
    {
      taskCnt: 0,
      taskName: "Booking Follow Up - DSE",
      myTaskList: [],
    },
    {
      taskCnt: 0,
      taskName: "Pre Booking Follow Up",
      myTaskList: [],
    },
    {
      taskCnt: 0,
      taskName: "Enquiry Follow Up",
      myTaskList: [],
    },
    {
      taskCnt: 0,
      taskName: "Test Drive",
      myTaskList: [],
    },
    {
      taskCnt: 0,
      taskName: "Test Drive Approval",
      myTaskList: [],
    },
    {
      taskCnt: 0,
      taskName: "Home Visit",
      myTaskList: [],
    },
    {
      taskCnt: 0,
      taskName: "Pre Enquiry Follow Up",
      myTaskList: [],
    },
  ];
  useEffect(() => {
    setSelectedFilter("TODAY");
    setIndex(0);
    initialTask("TODAY");
  }, []);

  // useEffect(() => {
  //   navigation.addListener("focus", () => {
  //     setSelectedFilter("TODAY");
  //     setIndex(0);
  //     // setMyTasksData([...defaultData]);
  //     // setMyTeamsData([...defaultData])
  //     initialTask("TODAY");
  //   });
  // }, [navigation]);

  useEffect(() => {
    setMyTasksData([...defaultData]);
    setMyTeamsData([...defaultData]);
    initialTask(selectedFilter);
  }, [index]);

  const initialTask = async (selectedFilterLocal) => {
    try {
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      setMyTasksData([...defaultData]);
      setMyTeamsData([...defaultData]);
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setEmployeeData(jsonObj);
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().format(dateFormat);
        let startDate, endDate;
        if (selectedFilterLocal === "TODAY") {
          startDate = currentDate;
          endDate = currentDate;
        } else if (selectedFilterLocal === "MONTH") {
          startDate = moment(currentDate, dateFormat)
            .subtract(0, "months")
            .startOf("month")
            .format(dateFormat);
          endDate = moment(currentDate, dateFormat)
            .subtract(0, "months")
            .endOf("month")
            .format(dateFormat);
        } else if (selectedFilterLocal === "WEEK") {
          var curr = new Date(); // get current date
          var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
          var last = first + 6; // last day is the first day + 6
          var firstday = new Date(curr.setDate(first)).toUTCString();
          var lastday = new Date(curr.setDate(last)).toUTCString();
          startDate = moment(firstday).format(dateFormat);
          endDate = moment(lastday).format(dateFormat);
        }
        if (route.params.from === "TODAY") {
          if (index === 0) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "todaysData",
                // "startDate": startDate,
                // "endDate": endDate,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "todaysData",
              };
            }
            Promise.all([dispatch(getTodayMyTasksListApi(payload))]).then(
              (res) => {
                let tempData = [...defaultData];
                const todaysData = res[0].payload.todaysData[0];
                const filteredData = todaysData.tasksList.filter((element) => {
                  const trimName = element.taskName.toLowerCase().trim();
                  const finalTaskName = trimName.replace(/ /g, "");
                  return taskNames.includes(finalTaskName);
                });
                if (filteredData.length > 0) {
                  for (let i = 0; i < filteredData.length; i++) {
                    let index = -1;
                    index = tempData.findIndex(
                      (item) => item.taskName === filteredData[i].taskName
                    );
                    if (index !== -1) {
                      tempData[index].taskCnt = filteredData[i].taskCnt;
                      tempData[index].myTaskList = filteredData[i].myTaskList;
                    }
                    if (i === filteredData.length - 1) {
                      setMyTasksData(tempData);
                    }
                  }
                }
                // else{
                //     // setMyTasksData([])
                //     setMyTasksData([...defaultData]);
                // }
              }
            );
          } else if (index === 1) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "todaysData",
                // "startDate": startDate,
                // "endDate": endDate,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "todaysData",
              };
            }
            Promise.all([dispatch(getTodayTeamTasksListApi(payload))]).then(
              (res) => {
                let tempArr = [];
                let tempTaskName = "";
                let allData = res[0].payload.todaysData;
                if (allData.length > 0) {
                  for (
                    let nameIndex = 0;
                    nameIndex < taskNames.length;
                    nameIndex++
                  ) {
                    let taskLists = [];
                    for (let index = 0; index < allData.length; index++) {
                      if (allData[index].tasksList.length > 0) {
                        let userWiseTasks = allData[index].tasksList;
                        for (
                          let taskIndex = 0;
                          taskIndex < userWiseTasks.length;
                          taskIndex++
                        ) {
                          let trimName = userWiseTasks[taskIndex].taskName
                            .toLowerCase()
                            .trim();
                          let finalTaskName = trimName.replace(/ /g, "");
                          if (userWiseTasks[taskIndex].myTaskList.length > 0) {
                            let allTasks = userWiseTasks[taskIndex].myTaskList;
                            for (
                              let innerIndex = 0;
                              innerIndex < allTasks.length;
                              innerIndex++
                            ) {
                              if (finalTaskName === taskNames[nameIndex]) {
                                tempTaskName =
                                  userWiseTasks[taskIndex].taskName;
                                taskLists.push(allTasks[innerIndex]);
                              }
                            }
                          }
                        }
                      }
                      if (index === allData.length - 1) {
                        if (taskLists.length > 0) {
                          tempArr.push({
                            taskCnt: taskLists.length,
                            taskName: tempTaskName,
                            myTaskList: taskLists,
                          });
                        }
                      }
                    }
                    if (nameIndex === taskNames.length - 1) {
                      // setMyTeamsData(tempArr);
                      let tempData = [...defaultData];
                      if (tempArr.length > 0) {
                        for (let i = 0; i < tempArr.length; i++) {
                          let index = -1;
                          index = tempData.findIndex(
                            (item) => item.taskName === tempArr[i].taskName
                          );
                          if (index !== -1) {
                            tempData[index].taskCnt = tempArr[i].taskCnt;
                            tempData[index].myTaskList = tempArr[i].myTaskList;
                          }
                          if (i === tempArr.length - 1) {
                            setMyTeamsData(tempData);
                          }
                        }
                      }
                    }
                  }
                }
                // else {
                //     setMyTeamsData([...defaultData]);
                // }
              }
            );
          }
        } else if (route.params.from === "UPCOMING") {
          if (index === 0) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "upcomingData",
                startDate: startDate,
                endDate: endDate,
                ignoreDateFilter: false,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "upcomingData",
                ignoreDateFilter: true,
              };
            }
            Promise.all([dispatch(getUpcomingMyTasksListApi(payload))]).then(
              (res) => {
                const todaysData = res[0].payload.upcomingData[0];
                let tempData = [...defaultData];
                const filteredData = todaysData.tasksList.filter((element) => {
                  const trimName = element.taskName.toLowerCase().trim();
                  const finalTaskName = trimName.replace(/ /g, "");
                  return taskNames.includes(finalTaskName);
                });
                if (filteredData.length > 0) {
                  for (let i = 0; i < filteredData.length; i++) {
                    let index = -1;
                    index = tempData.findIndex(
                      (item) => item.taskName === filteredData[i].taskName
                    );
                    if (index !== -1) {
                      tempData[index].taskCnt = filteredData[i].taskCnt;
                      tempData[index].myTaskList = filteredData[i].myTaskList;
                    }
                    if (i === filteredData.length - 1) {
                      setMyTasksData(tempData);
                    }
                  }
                }
              }
            );
          } else if (index === 1) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "upcomingData",
                startDate: startDate,
                endDate: endDate,
                ignoreDateFilter: false,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "upcomingData",
                ignoreDateFilter: true,
              };
            }
            Promise.all([dispatch(getUpcomingTeamTasksListApi(payload))]).then(
              (res) => {
                // const todaysData = res[0].payload.upcomingData[0];
                // const filteredData = todaysData.tasksList.filter(element => {
                //     const trimName = element.taskName.toLowerCase().trim();
                //     const finalTaskName = trimName.replace(/ /g, "");
                //     return taskNames.includes(finalTaskName);
                // });
                // setMyTeamsData(filteredData);
                let tempArr = [];
                let tempTaskName = "";
                let allData = res[0].payload.upcomingData;
                if (allData.length > 0) {
                  for (
                    let nameIndex = 0;
                    nameIndex < taskNames.length;
                    nameIndex++
                  ) {
                    let taskLists = [];
                    for (let index = 0; index < allData.length; index++) {
                      if (allData[index].tasksList.length > 0) {
                        let userWiseTasks = allData[index].tasksList;
                        for (
                          let taskIndex = 0;
                          taskIndex < userWiseTasks.length;
                          taskIndex++
                        ) {
                          let trimName = userWiseTasks[taskIndex].taskName
                            .toLowerCase()
                            .trim();
                          let finalTaskName = trimName.replace(/ /g, "");
                          if (userWiseTasks[taskIndex].myTaskList.length > 0) {
                            let allTasks = userWiseTasks[taskIndex].myTaskList;
                            for (
                              let innerIndex = 0;
                              innerIndex < allTasks.length;
                              innerIndex++
                            ) {
                              if (finalTaskName === taskNames[nameIndex]) {
                                tempTaskName =
                                  userWiseTasks[taskIndex].taskName;
                                taskLists.push(allTasks[innerIndex]);
                              }
                            }
                          }
                        }
                      }
                      if (index === allData.length - 1) {
                        if (taskLists.length > 0) {
                          tempArr.push({
                            taskCnt: taskLists.length,
                            taskName: tempTaskName,
                            myTaskList: taskLists,
                          });
                        }
                      }
                    }
                    if (nameIndex === taskNames.length - 1) {
                      // setMyTeamsData(tempArr);
                      let tempData = [...defaultData];
                      if (tempArr.length > 0) {
                        for (let i = 0; i < tempArr.length; i++) {
                          let index = -1;
                          index = tempData.findIndex(
                            (item) => item.taskName === tempArr[i].taskName
                          );
                          if (index !== -1) {
                            tempData[index].taskCnt = tempArr[i].taskCnt;
                            tempData[index].myTaskList = tempArr[i].myTaskList;
                          }
                          if (i === tempArr.length - 1) {
                            setMyTeamsData(tempData);
                          }
                        }
                      }
                    }
                  }
                } else {
                  setMyTeamsData([...defaultData]);
                }
              }
            );
          }
        } else if (route.params.from === "PENDING") {
          if (index === 0) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "pendingData",
                startDate: startDate,
                endDate: endDate,
                ignoreDateFilter: false,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "pendingData",
                ignoreDateFilter: true,
              };
            }
            Promise.all([dispatch(getPendingMyTasksListApi(payload))]).then(
              (res) => {
                const todaysData = res[0].payload.pendingData[0];
                let tempData = [...defaultData];
                const filteredData = todaysData.tasksList.filter((element) => {
                  const trimName = element.taskName.toLowerCase().trim();
                  const finalTaskName = trimName.replace(/ /g, "");
                  return taskNames.includes(finalTaskName);
                });
                if (filteredData.length > 0) {
                  for (let i = 0; i < filteredData.length; i++) {
                    let index = -1;
                    index = tempData.findIndex(
                      (item) => item.taskName === filteredData[i].taskName
                    );
                    if (index !== -1) {
                      tempData[index].taskCnt = filteredData[i].taskCnt;
                      tempData[index].myTaskList = filteredData[i].myTaskList;
                    }
                    if (i === filteredData.length - 1) {
                      setMyTasksData(tempData);
                    }
                  }
                }
              }
            );
          } else if (index === 1) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "pendingData",
                startDate: startDate,
                endDate: endDate,
                ignoreDateFilter: false,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "pendingData",
                ignoreDateFilter: true,
              };
            }
            Promise.all([dispatch(getPendingTeamTasksListApi(payload))]).then(
              (res) => {
                // const todaysData = res[0].payload.pendingData[0];
                // const filteredData = todaysData.tasksList.filter(element => {
                //     const trimName = element.taskName.toLowerCase().trim();
                //     const finalTaskName = trimName.replace(/ /g, "");
                //     return taskNames.includes(finalTaskName);
                // });
                // setMyTeamsData(filteredData);

                let tempArr = [];
                let tempTaskName = "";
                let allData = res[0].payload.pendingData;
                if (allData.length > 0) {
                  for (
                    let nameIndex = 0;
                    nameIndex < taskNames.length;
                    nameIndex++
                  ) {
                    let taskLists = [];
                    for (let index = 0; index < allData.length; index++) {
                      if (allData[index].tasksList.length > 0) {
                        let userWiseTasks = allData[index].tasksList;
                        for (
                          let taskIndex = 0;
                          taskIndex < userWiseTasks.length;
                          taskIndex++
                        ) {
                          let trimName = userWiseTasks[taskIndex].taskName
                            .toLowerCase()
                            .trim();
                          let finalTaskName = trimName.replace(/ /g, "");
                          if (userWiseTasks[taskIndex].myTaskList.length > 0) {
                            let allTasks = userWiseTasks[taskIndex].myTaskList;
                            for (
                              let innerIndex = 0;
                              innerIndex < allTasks.length;
                              innerIndex++
                            ) {
                              if (finalTaskName === taskNames[nameIndex]) {
                                tempTaskName =
                                  userWiseTasks[taskIndex].taskName;
                                taskLists.push(allTasks[innerIndex]);
                              }
                            }
                          }
                        }
                      }
                      if (index === allData.length - 1) {
                        if (taskLists.length > 0) {
                          tempArr.push({
                            taskCnt: taskLists.length,
                            taskName: tempTaskName,
                            myTaskList: taskLists,
                          });
                        }
                      }
                    }
                    if (nameIndex === taskNames.length - 1) {
                      // setMyTeamsData(tempArr);
                      let tempData = [...defaultData];
                      if (tempArr.length > 0) {
                        for (let i = 0; i < tempArr.length; i++) {
                          let index = -1;
                          index = tempData.findIndex(
                            (item) => item.taskName === tempArr[i].taskName
                          );
                          if (index !== -1) {
                            tempData[index].taskCnt = tempArr[i].taskCnt;
                            tempData[index].myTaskList = tempArr[i].myTaskList;
                          }
                          if (i === tempArr.length - 1) {
                            setMyTeamsData(tempData);
                          }
                        }
                      }
                    }
                  }
                } else {
                  setMyTeamsData([...defaultData]);
                }
              }
            );
          }
        } else if (route.params.from === "RESCHEDULE") {
          if (index === 0) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "rescheduledData",
                startDate: startDate,
                endDate: endDate,
                ignoreDateFilter: false,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "rescheduledData",
                ignoreDateFilter: true,
              };
            }
            Promise.all([dispatch(getRescheduleMyTasksListApi(payload))]).then(
              (res) => {
                const todaysData = res[0].payload.rescheduledData[0];
                let tempData = [...defaultData];
                const filteredData = todaysData.tasksList.filter((element) => {
                  const trimName = element.taskName.toLowerCase().trim();
                  const finalTaskName = trimName.replace(/ /g, "");
                  return taskNames.includes(finalTaskName);
                });
                if (filteredData.length > 0) {
                  for (let i = 0; i < filteredData.length; i++) {
                    let index = -1;
                    index = tempData.findIndex(
                      (item) => item.taskName === filteredData[i].taskName
                    );
                    if (index !== -1) {
                      tempData[index].taskCnt = filteredData[i].taskCnt;
                      tempData[index].myTaskList = filteredData[i].myTaskList;
                    }
                    if (i === filteredData.length - 1) {
                      setMyTasksData(tempData);
                    }
                  }
                }
              }
            );
          } else if (index === 1) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "rescheduledData",
                startDate: startDate,
                endDate: endDate,
                ignoreDateFilter: false,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "rescheduledData",
                ignoreDateFilter: true,
              };
            }
            Promise.all([
              dispatch(getRescheduleTeamTasksListApi(payload)),
            ]).then((res) => {
              let tempArr = [];
              let tempTaskName = "";
              let allData = res[0].payload.rescheduledData;
              if (allData.length > 0) {
                for (
                  let nameIndex = 0;
                  nameIndex < taskNames.length;
                  nameIndex++
                ) {
                  let taskLists = [];
                  for (let index = 0; index < allData.length; index++) {
                    if (allData[index].tasksList.length > 0) {
                      let userWiseTasks = allData[index].tasksList;
                      for (
                        let taskIndex = 0;
                        taskIndex < userWiseTasks.length;
                        taskIndex++
                      ) {
                        let trimName = userWiseTasks[taskIndex].taskName
                          .toLowerCase()
                          .trim();
                        let finalTaskName = trimName.replace(/ /g, "");
                        if (userWiseTasks[taskIndex].myTaskList.length > 0) {
                          let allTasks = userWiseTasks[taskIndex].myTaskList;
                          for (
                            let innerIndex = 0;
                            innerIndex < allTasks.length;
                            innerIndex++
                          ) {
                            if (finalTaskName === taskNames[nameIndex]) {
                              tempTaskName = userWiseTasks[taskIndex].taskName;
                              taskLists.push(allTasks[innerIndex]);
                            }
                          }
                        }
                      }
                    }
                    if (index === allData.length - 1) {
                      if (taskLists.length > 0) {
                        tempArr.push({
                          taskCnt: taskLists.length,
                          taskName: tempTaskName,
                          myTaskList: taskLists,
                        });
                      }
                    }
                  }
                  if (nameIndex === taskNames.length - 1) {
                    // setMyTeamsData(tempArr);
                    let tempData = [...defaultData];
                    if (tempArr.length > 0) {
                      for (let i = 0; i < tempArr.length; i++) {
                        let index = -1;
                        index = tempData.findIndex(
                          (item) => item.taskName === tempArr[i].taskName
                        );
                        if (index !== -1) {
                          tempData[index].taskCnt = tempArr[i].taskCnt;
                          tempData[index].myTaskList = tempArr[i].myTaskList;
                        }
                        if (i === tempArr.length - 1) {
                          setMyTeamsData(tempData);
                        }
                      }
                    }
                  }
                }
              } else {
                setMyTeamsData([...defaultData]);
              }
            });
          }
        } else if (route.params.from === "CLOSED") {
          if (index === 0) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "completedData",
                startDate: startDate,
                endDate: endDate,
                ignoreDateFilter: false,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: true,
                dataType: "completedData",
                ignoreDateFilter: true,
              };
            }
            Promise.all([dispatch(getCompletedMyTasksListApi(payload))]).then(
              (res) => {
                const todaysData = res[0].payload.completedData[0];
                let tempData = [...defaultData];
                const filteredData = todaysData.tasksList.filter((element) => {
                  const trimName = element.taskName.toLowerCase().trim();
                  const finalTaskName = trimName.replace(/ /g, "");
                  return taskNames.includes(finalTaskName);
                });
                if (filteredData.length > 0) {
                  for (let i = 0; i < filteredData.length; i++) {
                    let index = -1;
                    index = tempData.findIndex(
                      (item) => item.taskName === filteredData[i].taskName
                    );
                    if (index !== -1) {
                      tempData[index].taskCnt = filteredData[i].taskCnt;
                      tempData[index].myTaskList = filteredData[i].myTaskList;
                    }
                    if (i === filteredData.length - 1) {
                      setMyTasksData(tempData);
                    }
                  }
                }
              }
            );
          } else if (index === 1) {
            let payload = {};
            if (selectedFilterLocal !== "ALL") {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "completedData",
                startDate: route.params.from ? globalStartDate : startDate,
                endDate: route.params.from ? globalEndDate : endDate,
                ignoreDateFilter: false,
              };
            } else {
              payload = {
                orgId: jsonObj.orgId,
                loggedInEmpId: jsonObj.empId,
                onlyForEmp: false,
                dataType: "completedData",
                ignoreDateFilter: true,
              };
            }
            Promise.all([dispatch(getCompletedTeamTasksListApi(payload))]).then(
              (res) => {
                let tempArr = [];
                let tempTaskName = "";
                let allData = res[0].payload.completedData;
                if (allData.length > 0) {
                  for (
                    let nameIndex = 0;
                    nameIndex < taskNames.length;
                    nameIndex++
                  ) {
                    let taskLists = [];
                    for (let index = 0; index < allData.length; index++) {
                      if (allData[index].tasksList.length > 0) {
                        let userWiseTasks = allData[index].tasksList;
                        for (
                          let taskIndex = 0;
                          taskIndex < userWiseTasks.length;
                          taskIndex++
                        ) {
                          let trimName = userWiseTasks[taskIndex].taskName
                            .toLowerCase()
                            .trim();
                          let finalTaskName = trimName.replace(/ /g, "");
                          if (userWiseTasks[taskIndex].myTaskList.length > 0) {
                            let allTasks = userWiseTasks[taskIndex].myTaskList;
                            for (
                              let innerIndex = 0;
                              innerIndex < allTasks.length;
                              innerIndex++
                            ) {
                              if (finalTaskName === taskNames[nameIndex]) {
                                tempTaskName =
                                  userWiseTasks[taskIndex].taskName;
                                taskLists.push(allTasks[innerIndex]);
                              }
                            }
                          }
                        }
                      }
                      if (index === allData.length - 1) {
                        if (taskLists.length > 0) {
                          tempArr.push({
                            taskCnt: taskLists.length,
                            taskName: tempTaskName,
                            myTaskList: taskLists,
                          });
                        }
                      }
                    }
                    if (nameIndex === taskNames.length - 1) {
                      // setMyTeamsData(tempArr);
                      let tempData = [...defaultData];
                      if (tempArr.length > 0) {
                        for (let i = 0; i < tempArr.length; i++) {
                          let index = -1;
                          index = tempData.findIndex(
                            (item) => item.taskName === tempArr[i].taskName
                          );
                          if (index !== -1) {
                            tempData[index].taskCnt = tempArr[i].taskCnt;
                            tempData[index].myTaskList = tempArr[i].myTaskList;
                          }
                          if (i === tempArr.length - 1) {
                            setMyTeamsData(tempData);
                          }
                        }
                      }
                    }
                  }
                } else {
                  setMyTeamsData([...defaultData]);
                }
              }
            );
          }
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    let data = {
      // todaysData: selector.myTodayData,
      // upcomingData: selector.myUpcomingData,
      // pendingData: selector.myPendingData,
      // rescheduledData: selector.myReData,
      // todaysTeamData: selector.teamTodayData,
      // upcomingTeamData: selector.teamUpcomingData,
      // pendingTeamData: selector.teamPendingData,
      // rescheduledTeamData: selector.teamReData,
    };
    let status = "";
    // if (index === 0) {
    //     data.todaysData = selector.myTodayData;
    //     data.upcomingData = selector.myUpcomingData;
    //     data.pendingData = selector.myPendingData;
    //     data.rescheduledData = selector.myReData;
    // } else if (index === 1) {
    //     data.todaysData = selector.teamTodayData;
    //     data.upcomingData = selector.teamUpcomingData;
    //     data.pendingData = selector.teamPendingData;
    //     data.rescheduledData = selector.teamReData;
    // }

    // if (status === "success") {
    // if (route.params.from === "TODAY") {
    //     const todaysData = data.todaysData[0];
    //     const filteredData = todaysData.tasksList.filter(element => {
    //         const trimName = element.taskName.toLowerCase().trim();
    //         const finalTaskName = trimName.replace(/ /g, "");
    //         return taskNames.includes(finalTaskName);
    //     });

    //     if (homeSelector.isTeamPresent) {
    //         const todaysTeamData = data.todaysTeamData[0];
    //         const filteredTeamData = todaysTeamData.tasksList.filter(element => {
    //             const trimName = element.taskName.toLowerCase().trim();
    //             const finalTaskName = trimName.replace(/ /g, "");
    //             return taskNames.includes(finalTaskName);
    //         });
    //         setMyTeamsData(filteredTeamData);
    //     }

    //     // if (index === 0)
    //     // else if (index === 1)
    //     //     setMyTeamsData(filteredData);
    // }
    // else if (route.params.from === "UPCOMING") {
    //     const todaysData = data.upcomingData[0];
    //     const filteredData = todaysData.tasksList.filter(element => {
    //         const trimName = element.taskName.toLowerCase().trim();
    //         const finalTaskName = trimName.replace(/ /g, "");
    //         return taskNames.includes(finalTaskName);
    //     });

    //     if (homeSelector.isTeamPresent) {
    //         const todaysTeamData = data.upcomingTeamData[0];
    //         const filteredTeamData = todaysTeamData.tasksList.filter(element => {
    //             const trimName = element.taskName.toLowerCase().trim();
    //             const finalTaskName = trimName.replace(/ /g, "");
    //             return taskNames.includes(finalTaskName);
    //         });
    //         setMyTeamsData(filteredTeamData);
    //     }

    //     // if (index === 0)
    //     // else if (index === 1)
    //     //     setMyTeamsData(filteredData);
    // }
    // else if (route.params.from === "PENDING") {
    //     const todaysData = data.pendingData[0];
    //     const filteredData = todaysData.tasksList.filter(element => {
    //         const trimName = element.taskName.toLowerCase().trim();
    //         const finalTaskName = trimName.replace(/ /g, "");
    //         return taskNames.includes(finalTaskName);
    //     });

    //     if (homeSelector.isTeamPresent) {
    //         const todaysTeamData = data.pendingTeamData[0];
    //         const filteredTeamData = todaysTeamData.tasksList.filter(element => {
    //             const trimName = element.taskName.toLowerCase().trim();
    //             const finalTaskName = trimName.replace(/ /g, "");
    //             return taskNames.includes(finalTaskName);
    //         });
    //         setMyTeamsData(filteredTeamData);
    //     }
    //     // if (index === 0)
    //     // else if (index === 1)
    //     //     setMyTeamsData(filteredData);
    // }
    // else if (route.params.from === "RESCHEDULE") {
    //     const todaysData = data.rescheduledData[0];
    //     const filteredData = todaysData.tasksList.filter(element => {
    //         const trimName = element.taskName.toLowerCase().trim();
    //         const finalTaskName = trimName.replace(/ /g, "");
    //         return taskNames.includes(finalTaskName);
    //     });

    //     if (homeSelector.isTeamPresent) {
    //         const todaysTeamData = data.rescheduledTeamData[0];
    //         const filteredTeamData = todaysTeamData.tasksList.filter(element => {
    //             const trimName = element.taskName.toLowerCase().trim();
    //             const finalTaskName = trimName.replace(/ /g, "");
    //             return taskNames.includes(finalTaskName);
    //         });
    //         setMyTeamsData(filteredTeamData);
    //     }
    //     // if (index === 0)
    //     // else if (index === 1)
    //     //     setMyTeamsData(filteredData);
    // }
    // }
  }, [
    selector.myTodayData,
    selector.myUpcomingData,
    selector.myPendingData,
    selector.myReData,
    selector.teamTodayData,
    selector.teamUpcomingData,
    selector.teamPendingData,
    selector.teamReData,
  ]);

  const changeTab = async (index) => {
    // const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    // const jsonObj = JSON.parse(employeeData);
    // let payload = {};
    // if (index === 0) {
    //      payload = {
    //         "loggedInEmpId": jsonObj.empId,
    //         "onlyForEmp": true
    //     }
    // } else if (index === 1) {
    //     payload = {
    //         "loggedInEmpId": jsonObj.empId,
    //         "onlyForEmp": false
    //     }
    // }
    // dispatch(getMyTasksListApi(payload));
  };

  const itemClicked = (item) => {
    if (item.myTaskList.length > 0) {
      navigation.navigate(MyTasksStackIdentifiers.tasksListScreen, {
        data: item.myTaskList,
      });
    } else {
      showToast("No tasks available");
    }
  };

  const checkForTaskNames = (taskName) => {
    if (taskName.includes("Pre Enquiry")) {
      taskName = taskName.replace("Pre Enquiry", "Contacts");
    } else if (taskName.includes("Pre Booking")) {
      taskName = taskName.replace("Pre Booking", "Booking Approval");
    } else if (taskName.includes("Booking")) {
      taskName = taskName.replace("Booking", "Booking View");
    }
    if (taskName.toLowerCase() === "booking view follow up - dse") {
      taskName = "Booking Followup";
    }
    return taskName;
  };

  const checkForTaskData = (data) => {
    let newData = data;

    if (
      employeeData &&
      (employeeData.hrmsRole === "Reception" ||
        employeeData.hrmsRole === "Tele Caller")
    ) {
      newData = newData.filter((value) =>
        value.taskName === "Pre Enquiry Follow Up" ? true : false
      );
    } else {
      newData = newData.filter((value) =>
        value.taskName === "Test Drive Approval" ? false : true
      );
    }

    return newData;
  };

  return (
    <View style={styles.mainView}>
      <View
        style={styles.view2}
      >
        {/* <View style={{ width: "75%" }}>
                    <SegmentedControl
                        values={['My Tasks', 'Team Tasks']}
                        enabled={true}
                        backgroundColor={Colors.WHITE}
                        fontStyle={{ color: Colors.BLACK, fontSize: 16, fontWeight: "700" }}
                        activeFontStyle={{ color: Colors.WHITE, fontSize: 16, fontWeight: "700" }}
                        style={{ backgroundColor: "white", height: 50, borderColor: "red", borderWidth: 1, borderRadius: 4 }}
                        tabStyle={{ borderRadius: 1 }}
                        tintColor={Colors.RED}
                        selectedIndex={index}
                        onChange={(event) => {
                            setIndex(event.nativeEvent.selectedSegmentIndex);
                        }}
                    />
                </View> */}

        {/* Hide the tabs only for sales  */}
        {/* {
                    selector.role != "Showroom DSE" && (
                        <View style={styles.selfBtnWrap}>
                            <TouchableOpacity onPress={() => {
                                setIndex(0)
                            }} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: index ? Colors.WHITE : Colors.RED, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
                                <Text style={{ fontSize: 16, color: index ? Colors.BLACK : Colors.WHITE, fontWeight: '600' }}>Self</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setIndex(1)
                            }} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: index ? Colors.RED : Colors.WHITE, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                                <Text style={{ fontSize: 16, color: index ? Colors.WHITE : Colors.BLACK, fontWeight: '600' }}>Teams</Text>
                            </TouchableOpacity>
                        </View>
                    )
                } */}
        {homeSelector.isTeamPresent &&
          !homeSelector.isDSE &&
          (route.params.from !== "TODAY" ? (
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.selfBtnWrap,
                  { width: route.params.from !== "TODAY" ? "75%" : "100%" },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    setIndex(0);
                    changeTab(0);
                  }}
                  style={{
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: index ? Colors.WHITE : Colors.RED,
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: index ? Colors.BLACK : Colors.WHITE,
                      fontWeight: "600",
                    }}
                  >
                    Self
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIndex(1);
                    changeTab(1);
                  }}
                  style={{
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: index ? Colors.RED : Colors.WHITE,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: index ? Colors.WHITE : Colors.BLACK,
                      fontWeight: "600",
                    }}
                  >
                    Teams
                  </Text>
                </TouchableOpacity>
              </View>
              {route.params.from !== "TODAY" && (
                <View>
                  <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => setIsOpenFilter(true)}
                  >
                    <Image
                      style={{ height: 20, width: 10 }}
                      source={require("../../../../assets/images/more_new.png")}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#fff",
                        marginLeft: 10,
                      }}
                    >
                      Filter
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.selfBtnWrap}>
              <TouchableOpacity
                onPress={() => {
                  setIndex(0);
                  changeTab(0);
                }}
                style={{
                  width: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: index ? Colors.WHITE : Colors.RED,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: index ? Colors.BLACK : Colors.WHITE,
                    fontWeight: "600",
                  }}
                >
                  Self
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIndex(1);
                  changeTab(1);
                }}
                style={{
                  width: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: index ? Colors.RED : Colors.WHITE,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: index ? Colors.WHITE : Colors.BLACK,
                    fontWeight: "600",
                  }}
                >
                  Teams
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        {homeSelector.isDSE &&
          (route.params.from !== "TODAY" ? (
            <View style={{ flexDirection: "row" }}>
              <View style={[styles.selfBtnWrap, { width: "75%" }]}>
                <View
                  style={styles.selfbtn}
                >
                  <Text
                    style={styles.txt1}
                  >
                    Self
                  </Text>
                </View>
              </View>
              {route.params.from !== "TODAY" && (
                <View>
                  <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => setIsOpenFilter(true)}
                  >
                    <Image
                      style={{ height: 20, width: 10 }}
                      source={require("../../../../assets/images/more_new.png")}
                    />
                    <Text
                      style={styles.txt5}
                    >
                      Filter
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={[styles.selfBtnWrap]}>
              <View
                style={styles.view3}
              >
                <Text
                  style={styles.txt2}
                >
                  Self
                </Text>
              </View>
            </View>
          ))}
      </View>
      {/* {route.params.from !== "TODAY" &&
            <View style={{alignItems: 'flex-end'}}>
                <TouchableOpacity style={{ width: 80, height: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: Colors.RED, borderRadius: 5}} onPress={() => setIsOpenFilter(true)}>
                    <Image style={{height: 20, width: 10}} source={require('../../../../assets/images/more_new.png')} />
                    <Text style={{fontSize: 16, fontWeight: '600', color: '#fff', marginLeft: 10}}>Filter</Text>
                </TouchableOpacity>
            </View>
} */}
      {index === 0 && myTasksData.length > 0 && (
        <FlatList
          data={checkForTaskData(myTasksData)}
          extraData={myTasksData}
          style={{ flex: 1 }}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const chartHeight = itemWidth - 20;
            const overlayViewHeight = chartHeight - 10;
            return (
              <View style={styles.list}>
                <TouchableOpacity onPress={() => itemClicked(item)}>
                  <View
                    style={[
                      {
                        height: 180,
                        width: itemWidth,
                        backgroundColor: Colors.WHITE,
                        flexDirection: "column",
                        alignItems: "center",
                        paddingBottom: 10,
                        borderRadius: 5,
                      },
                    ]}
                  >
                    {/* // pie chart */}
                    <View
                      style={{
                        width: itemWidth - 10,
                        height: 120,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PieChart
                        widthAndHeight={chartHeight}
                        series={series}
                        sliceColor={sliceColor}
                      />
                      {/* <PIEICON width={chartHeight} height={chartHeight} /> */}
                      {/* // Overlay View */}
                      <View
                        style={{
                          position: "absolute",
                          width: overlayViewHeight,
                          height: overlayViewHeight,
                          borderRadius: overlayViewHeight / 2,
                          backgroundColor: Colors.WHITE,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={styles.txt3}
                        >
                          {item.taskCnt}
                        </Text>
                        <Text
                          style={styles.txt4}
                        >
                          {"follow up"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={styles.view4}
                    >
                      <View
                        style={styles.emptyView}
                      ></View>
                      <Text
                        style={styles.txt6}
                        numberOfLines={3}
                      >
                        {checkForTaskNames(item.taskName)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {index === 1 && myTeamsData.length > 0 && (
        <FlatList
          data={checkForTaskData(myTeamsData)}
          style={{ flex: 1 }}
          numColumns={3}
          extraData={myTeamsData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const chartHeight = itemWidth - 20;
            const overlayViewHeight = chartHeight - 10;
            return (
              <View style={styles.list}>
                <TouchableOpacity onPress={() => itemClicked(item)}>
                  <View
                    style={[
                      {
                        height: 180,
                        width: itemWidth,
                        backgroundColor: Colors.WHITE,
                        flexDirection: "column",
                        alignItems: "center",
                        paddingBottom: 10,
                        borderRadius: 5,
                      },
                    ]}
                  >
                    {/* // pie chart */}
                    <View
                      style={{
                        width: itemWidth - 10,
                        height: 120,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PieChart
                        widthAndHeight={chartHeight}
                        series={series}
                        sliceColor={sliceColor}
                      />
                      {/* <PIEICON width={chartHeight} height={chartHeight} /> */}
                      {/* // Overlay View */}
                      <View
                        style={{
                          position: "absolute",
                          width: overlayViewHeight,
                          height: overlayViewHeight,
                          borderRadius: overlayViewHeight / 2,
                          backgroundColor: Colors.WHITE,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={styles.txt3}
                        >
                          {item.taskCnt}
                        </Text>
                        <Text
                          style={styles.txt4}
                        >
                          {"follow up"}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={styles.view4}
                    >
                      <View
                        style={styles.emptyView}
                      ></View>
                      <Text
                        style={styles.txt6}
                        numberOfLines={2}
                      >
                        {checkForTaskNames(item.taskName)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {index === 0 && myTasksData.length == 0 && (
        // <NoDataFound />
        <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} />
      )}
      {index === 1 && myTeamsData.length == 0 && (
        <EmptyListView
          title={"No Data Found"}
          isLoading={selector.isTeamsTaskLoading}
        />
      )}

      <Modal
        // animationType={Platform.OS === "ios" ? 'slide' : 'fade'}
        transparent={true}
        visible={isOpenFilter}
        onRequestClose={() => setIsOpenFilter(false)}
      >
        <TouchableOpacity
          style={{ width: "100%", height: "100%" }}
          activeOpacity={1}
          onPress={() => {
            setIsOpenFilter(false);
          }}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={[
                styles.btnWrap,
                {
                  backgroundColor:
                    selectedFilter === "TODAY" ? Colors.RED : "#fff",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  marginTop: 2,
                },
              ]}
              onPress={() => {
                if (selectedFilter !== "TODAY") {
                  initialTask("TODAY");
                }
                setSelectedFilter("TODAY");
                setIsOpenFilter(false);
              }}
            >
              <Text
                style={[
                  styles.textWrap,
                  { color: selectedFilter === "TODAY" ? "#fff" : "#333" },
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnWrap,
                {
                  backgroundColor:
                    selectedFilter === "WEEK" ? Colors.RED : "#fff",
                },
              ]}
              onPress={() => {
                if (selectedFilter !== "WEEK") {
                  initialTask("WEEK");
                }
                setSelectedFilter("WEEK");
                setIsOpenFilter(false);
              }}
            >
              <Text
                style={[
                  styles.textWrap,
                  { color: selectedFilter === "WEEK" ? "#fff" : "#333" },
                ]}
              >
                This week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnWrap,
                {
                  backgroundColor:
                    selectedFilter === "MONTH" ? Colors.RED : "#fff",
                },
              ]}
              onPress={() => {
                if (selectedFilter !== "MONTH") {
                  initialTask("MONTH");
                }
                setSelectedFilter("MONTH");
                setIsOpenFilter(false);
              }}
            >
              <Text
                style={[
                  styles.textWrap,
                  { color: selectedFilter === "MONTH" ? "#fff" : "#333" },
                ]}
              >
                This month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnWrap,
                {
                  backgroundColor:
                    selectedFilter === "ALL" ? Colors.RED : "#fff",
                },
              ]}
              onPress={() => {
                if (selectedFilter !== "ALL") {
                  initialTask("ALL");
                }
                setSelectedFilter("ALL");
                setIsOpenFilter(false);
              }}
            >
              <Text
                style={[
                  styles.textWrap,
                  { color: selectedFilter === "ALL" ? "#fff" : "#333" },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ListComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  selfBtnWrap: {
    flexDirection: "row",
    borderColor: Colors.RED,
    borderWidth: 1,
    borderRadius: 5,
    height: 41,
    marginTop: 10,
    justifyContent: "center",
    width: "80%",
  },
  list: {
    height: 185,
    width: baseItemWidth,
    paddingBottom: 5,
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 7,
    marginHorizontal: 7,
    elevation: 5,
  },
  modalContainer: {
    width: "100%",
    height: 180,
    backgroundColor: Colors.RED,
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  textWrap: { fontSize: 14, color: "#333" },
  btnWrap: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomColor: "#d1d1d1",
    borderBottomWidth: 1,
  },
  selectBtnWrap: { backgroundColor: Colors.RED },
  selectText: { color: "#fff" },
  mainView: { flex: 1, backgroundColor: Colors.LIGHT_GRAY, padding: 5 },
  view2: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  touchable: {
    width: 80,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.RED,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
  },
  selfbtn: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.RED,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  txt1: {
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: "600",
  },
  view3: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.RED,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  txt2: {
    fontSize: 16,
    color: Colors.WHITE,
    fontWeight: "600",
  },
  txt3: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  txt4: {
    fontSize: 11,
    fontWeight: "400",
    textAlign: "center",
  },
  view4: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
 emptyView: {
    width: "75%",
    backgroundColor: Colors.DARK_GRAY,
    height: 2,
    marginBottom: 13,
  },
   txt5: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 10,
  },
  txt6: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  }
});
