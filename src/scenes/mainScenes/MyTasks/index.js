import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { GlobalStyle, Colors, } from "../../../styles"
import { MyTaskTopTabNavigator } from "../../../navigations/myTasksTopTabNavigator";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ListComponent from "./components/ListComponent";
import URL from "../../../networking/endpoints";
import * as AsyncStore from "../../../asyncStore";
import { getMyTasksListApi, getMyTeamsTasksListApi, role, getPendingMyTasksListApi, getRescheduleMyTasksListApi, getUpcomingMyTasksListApi, getTodayMyTasksListApi, getTodayTeamTasksListApi, getUpcomingTeamTasksListApi, getPendingTeamTasksListApi, getRescheduleTeamTasksListApi, updateIndex } from "../../../redux/mytaskReducer";
import { useDispatch, useSelector } from "react-redux";


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

const SecondTopTab = createMaterialTopTabNavigator()

const SecondTopTabNavigator = ({ todaysData = [], upcomingData = [], pendingData = [], reScheduleData = [], completedData = [] }) => {

  return (
    <SecondTopTab.Navigator
      initialRouteName={"NEW_TODAY_TOP_TAB"}
      tabBarOptions={tabBarOptions}
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
        options={{ title: `RE-\nSCHEDULE` }}
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


  useEffect(() => {
    navigation.addListener('focus', () => {
      setIsDataLoaded(false)
      getAsyncstoreData();
      dispatch(updateIndex(0))
    });
  }, [navigation])

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      // const payload = { empId: jsonObj.empId, role: jsonObj.hrmsRole}
      const payload = {
        "loggedInEmpId": jsonObj.empId,
        "onlyForEmp": true
      }
      // dispatch(getMyTasksListApi(jsonObj.empId));
      // dispatch(getMyTeamsTasksListApi(jsonObj.empId));
      dispatch(role(jsonObj.hrmsRole));

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
      "loggedInEmpId": userId,
      "onlyForEmp": true
    }

    await fetch(URL.GET_MY_TASKS_NEW_DATA(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(payload),
    })
      .then(json => json.json())
      .then(resp => {
        setResponse(resp);
      })
      .catch(err => {
        console.error("While fetching table data: ", err);
      })
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={[{ flex: 1, backgroundColor: Colors.WHITE }, GlobalStyle.shadow]}>
        <View style={[{ flex: 1, backgroundColor: Colors.WHITE }]}>
          {/* {isDataLoaded && */}
            <SecondTopTabNavigator />
          {/* } */}
        </View>
      </View>
    </SafeAreaView>
  )
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
    backgroundColor: Colors.LIGHT_GRAY
  }
})