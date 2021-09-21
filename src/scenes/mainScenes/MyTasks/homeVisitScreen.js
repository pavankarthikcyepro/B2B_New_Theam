import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Keyboard } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp } from "../../../components";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import {
  clearState,
  setHomeVisitDetails,
  getTaskDetailsApi,
  updateTaskApi
} from "../../../redux/homeVisitReducer";
import { showToastSucess } from "../../../utils/toast";
import * as AsyncStorage from "../../../asyncStore";
import { getMyTasksList } from "../../../redux/mytaskReducer";

const HomeVisitScreen = ({ route, navigation }) => {

  const { taskId, identifier } = route.params;
  const selector = useSelector((state) => state.homeVisitReducer);
  const dispatch = useDispatch();
  const [actionType, setActionType] = useState("");

  useEffect(() => {

    dispatch(getTaskDetailsApi(taskId));
  }, [])

  const getMyTasksListFromServer = async () => {
    const empId = await AsyncStorage.getData(AsyncStorage.Keys.EMP_ID);
    if (empId) {
      const endUrl = `empId=${empId}&limit=10&offset=${0}`;
      dispatch(getMyTasksList(endUrl));
    }
  }

  // Update Task Response handle
  useEffect(() => {
    if (selector.update_task_response_status === "success") {
      showToastSucess("Successfully updated");
      navigation.popToTop();
      dispatch(clearState());
    }
  }, [selector.update_task_response_status])

  // Close Task Response handle
  useEffect(() => {
    if (selector.update_response_status === "success") {
      if (actionType === "CLOSE_TASK") {
        showToastSucess("Successfully Task Closed");
        getMyTasksListFromServer();
      } else {
        showToastSucess("Successfully Task Updated");
      }
      navigation.popToTop();
      dispatch(clearState());
    }
  }, [selector.update_response_status])

  const updateTask = () => {

    Keyboard.dismiss();
    if (selector.task_details_response?.taskId !== taskId) {
      return
    }

    const newTaskObj = { ...selector.task_details_response };
    newTaskObj.reason = selector.reason;
    newTaskObj.customerRemarks = selector.customer_remarks;
    newTaskObj.employeeRemarks = selector.employee_remarks;
    dispatch(updateTaskApi(newTaskObj));
    setActionType("UPDATE_TASK");
  }

  const closeTask = () => {

    Keyboard.dismiss();
    if (selector.task_details_response?.taskId !== taskId) {
      return
    }

    const newTaskObj = { ...selector.task_details_response };
    newTaskObj.reason = selector.reason;
    newTaskObj.customerRemarks = selector.customer_remarks;
    newTaskObj.employeeRemarks = selector.employee_remarks;
    newTaskObj.taskStatus = "CLOSED";
    dispatch(updateTaskApi(newTaskObj));
    setActionType("CLOSE_TASK");
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{ padding: 15 }}>
        <View style={[GlobalStyle.shadow, { backgroundColor: Colors.WHITE }]}>
          <TextinputComp
            style={styles.textInputStyle}
            label={"Reason"}
            value={selector.reason}
            onChangeText={(text) => {
              dispatch(setHomeVisitDetails({ key: "REASON", text: text }));
            }}
          />
          <Text style={GlobalStyle.underline}></Text>
          <TextinputComp
            style={styles.textInputStyle}
            label={"Customer Remarks"}
            value={selector.customer_remarks}
            onChangeText={(text) =>
              dispatch(
                setHomeVisitDetails({ key: "CUSTOMER_REMARKS", text: text })
              )
            }
          />
          <Text style={GlobalStyle.underline}></Text>
          <TextinputComp
            style={styles.textInputStyle}
            label={"Employee Remarks"}
            value={selector.employee_remarks}
            onChangeText={(text) =>
              dispatch(
                setHomeVisitDetails({ key: "EMPLOYEE_REMARKS", text: text })
              )
            }
          />
          <Text style={GlobalStyle.underline}></Text>
        </View>
      </View>

      <View style={styles.view1}>
        <Button
          mode="contained"
          style={{ width: 120 }}
          color={Colors.RED}
          disabled={selector.is_loading_for_task_update}
          labelStyle={{ textTransform: "none" }}
          onPress={updateTask}
        >
          Update
        </Button>
        <Button
          mode="contained"
          style={{ width: 120 }}
          color={Colors.RED}
          disabled={selector.is_loading_for_task_update}
          labelStyle={{ textTransform: "none" }}
          onPress={closeTask}
        >
          Close
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default HomeVisitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  view1: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
