import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { GlobalStyle, Colors } from "../../../styles";
import { MyTaskTopTabNavigator } from "../../../navigations/myTasksTopTabNavigator";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ListComponent from "./components/ListComponent";
import URL from "../../../networking/endpoints";
import * as AsyncStore from "../../../asyncStore";
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
  updateIndex,
  getRescheduled,
  getOrganizationHierarchyList,
} from "../../../redux/mytaskReducer";
import { useDispatch, useSelector } from "react-redux";
import { client } from "../../../networking/client";
import { getMenuList } from "../../../redux/homeReducer";
import { TouchableOpacity } from "react-native";

const tabBarOptions = {
  activeTintColor: Colors.RED,
  inactiveTintColor: Colors.DARK_GRAY,
  indicatorStyle: {
    backgroundColor: Colors.RED,
  },
  labelStyle: {
    fontSize: 11,
    fontWeight: "600",
  },
  style: {
    elevation: 0,
  },
};

const SecondTopTab = createMaterialTopTabNavigator();

const MyTabBar = ({ state, descriptors, navigation, position }) => {
  return (
    <View style={styles.tabView}>
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              style={[
                styles.tabItemContainer,
                isFocused ? { backgroundColor: Colors.PINK } : "",
              ]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
            >
              <Text
                style={[
                  styles.tabItemText,
                  isFocused ? { color: Colors.WHITE } : "",
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const SecondTopTabNavigator = ({
  todaysData = [],
  upcomingData = [],
  pendingData = [],
  reScheduleData = [],
  completedData = [],
}) => {
  return (
    <SecondTopTab.Navigator
      initialRouteName={"NEW_TODAY_TOP_TAB"}
      tabBarOptions={tabBarOptions}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <SecondTopTab.Screen
        name={"NEW_TODAY"}
        component={ListComponent}
        initialParams={{ data: todaysData, from: "TODAY" }}
        options={{ title: "TODAY" }}
      />
      {/* <SecondTopTab.Screen
        name={"NEW_UPCOMING"}
        component={ListComponent}
        initialParams={{ data: upcomingData, from: "UPCOMING" }}
        options={{ title: "UPCOMING" }}
      /> */}
      <SecondTopTab.Screen
        name={"NEW_PENDING"}
        component={ListComponent}
        initialParams={{ data: pendingData, from: "PENDING" }}
        options={{ title: "PENDING" }}
      />
      <SecondTopTab.Screen
        name={"NEW_RESCHEDULE"}
        component={ListComponent}
        initialParams={{ data: reScheduleData, from: "RESCHEDULE" }}
        options={{ title: `RE-SCHEDULE` }}
      />
      <SecondTopTab.Screen
        name={"CLOSED"}
        component={ListComponent}
        initialParams={{ data: completedData, from: "CLOSED" }}
        options={{ title: "CLOSED" }}
      />
    </SecondTopTab.Navigator>
  );
};

const MyTasksScreen = ({ navigation }) => {
  const [response, setResponse] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.mytaskReducer);
  const homeSelector = useSelector((state) => state.homeReducer);
  const [userData, setUserData] = useState({
    branchId: "",
    orgId: "",
    employeeId: "",
    employeeName: "",
    primaryDesignation: "",
    hrmsRole: "",
  });

  useEffect(() => {
    navigation.addListener("focus", () => {
      setIsDataLoaded(false);
      getAsyncstoreData();
      dispatch(updateIndex(0));
      getMenuListFromServer();
    });
  }, [navigation]);

  const getMenuListFromServer = async () => {
    let name = await AsyncStore.getData(AsyncStore.Keys.USER_NAME);
    if (name) {
      dispatch(getMenuList(name));
    }
  };

  useEffect(() => {
    let unSubscribe = navigation.addListener("focus", async () => {
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );

      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setUserData({
          empId: jsonObj.empId,
          empName: jsonObj.empName,
          hrmsRole: jsonObj.hrmsRole,
          orgId: jsonObj.orgId,
        });
        const payload = {
          orgId: jsonObj.orgId,
          empId: jsonObj.empId,
        };
        dispatch(getOrganizationHierarchyList(payload))
          .then((res) => {
          })
          .catch((err) => {
          });
      }
    });
    return unSubscribe
  }, [navigation]);

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );

    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);

      // const payload = { empId: jsonObj.empId, role: jsonObj.hrmsRole}
      const payload = {
        loggedInEmpId: jsonObj.empId,
        onlyForEmp: true,
      };
      // dispatch(getMyTasksListApi(jsonObj.empId));
      // dispatch(getMyTeamsTasksListApi(jsonObj.empId));
      dispatch(role(jsonObj.hrmsRole));
      dispatch(getRescheduled(jsonObj.empId));

      // if (homeSelector.isTeamPresent){
      //   Promise.all([
      //     dispatch(getPendingMyTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": true,
      //       "dataType": "pendingData"
      //     })),
      //     dispatch(getRescheduleMyTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": true,
      //       "dataType": "rescheduledData"
      //     })),
      //     dispatch(getUpcomingMyTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": true,
      //       "dataType": "upcomingData"
      //     })),
      //     dispatch(getTodayMyTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": true,
      //       "dataType": "todaysData"
      //     })),
      //     dispatch(getPendingTeamTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": false,
      //       "dataType": "pendingData"
      //     })),
      //     dispatch(getRescheduleTeamTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": false,
      //       "dataType": "rescheduledData"
      //     })),
      //     dispatch(getUpcomingTeamTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": false,
      //       "dataType": "upcomingData"
      //     })),
      //     dispatch(getTodayTeamTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": false,
      //       "dataType": "todaysData"
      //     }))
      //   ]).then(() => {
      //     setIsDataLoaded(true)
      //   });
      // }
      // else{
      //   Promise.all([
      //     dispatch(getPendingMyTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": true,
      //       "dataType": "pendingData"
      //     })),
      //     dispatch(getRescheduleMyTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": true,
      //       "dataType": "rescheduledData"
      //     })),
      //     dispatch(getUpcomingMyTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": true,
      //       "dataType": "upcomingData"
      //     })),
      //     dispatch(getTodayMyTasksListApi({
      //       "loggedInEmpId": jsonObj.empId,
      //       "onlyForEmp": true,
      //       "dataType": "todaysData"
      //     }))
      //   ]).then(() => {
      //     setIsDataLoaded(true)
      //   });
      // }

      // AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
      //   getTableDataFromServer(jsonObj.empId, token);
      // });
    }
  };

  const getTableDataFromServer = async (userId, token) => {
    const payload = {
      loggedInEmpId: userId,
      onlyForEmp: true,
    };

    // await fetch(URL.GET_MY_TASKS_NEW_DATA(), {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     "auth-token": token,
    //   },
    //   body: JSON.stringify(payload),
    // })
    await client
      .post(URL.GET_MY_TASKS_NEW_DATA2(), payload)
      .then((json) => json.json())
      .then((resp) => {
        setResponse(resp);
      })
      .catch((err) => {
        console.error("While fetching table data: ", err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[{ flex: 1, backgroundColor: Colors.WHITE }, GlobalStyle.shadow]}
      >
        <View style={[{ flex: 1, backgroundColor: Colors.WHITE }]}>
          {/* {isDataLoaded && */}
          <SecondTopTabNavigator />
          {/* } */}
        </View>
      </View>
    </SafeAreaView>
  );
};

// const MyTasksScreen = ({ navigation }) => {
//   return (
//     <MyTaskTopTabNavigator />
//   )
// };

export default MyTasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  tabView: {
    backgroundColor: Colors.LIGHT_GRAY,
    marginTop: 15,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    backgroundColor: Colors.BORDER_COLOR,
    width: "95%",
    alignSelf: "center",
    borderRadius: 5,
  },
  tabItemContainer: {
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    width: "23.75%",
    borderRadius: 5,
  },
  tabItemText: {
    color: Colors.BLACK,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});
