import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Keyboard, Dimensions, KeyboardAvoidingView } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp, LoaderComponent } from "../../../components";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from 'react-native-element-dropdown';
import Geolocation from '@react-native-community/geolocation';
import {
  clearState,
  setHomeVisitDetails,
  getTaskDetailsApi,
  updateTaskApi,
  generateOtpApi,
  validateOtpApi
} from "../../../redux/homeVisitReducer";
import {
  showToastSucess,
  showToast,
  showToastRedAlert,
} from "../../../utils/toast";
import * as AsyncStorage from "../../../asyncStore";
import {
  getCurrentTasksListApi,
  getPendingTasksListApi,
} from "../../../redux/mytaskReducer";
import { isValidateAlphabetics } from "../../../utils/helperFunctions";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import URL from "../../../networking/endpoints";

import {
  getReasonList
} from "../../../redux/enquiryFollowUpReducer";

const otpStyles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30, fontWeight: "400" },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});

const CELL_COUNT = 4;
const screenWidth = Dimensions.get("window").width;
const otpViewHorizontalPadding = (screenWidth - (160 + 80)) / 2;

const HomeVisitScreen = ({ route, navigation }) => {
  const { taskId, identifier, mobile, reasonTaskName } = route.params;
  const selector = useSelector((state) => state.homeVisitReducer);
  const dispatch = useDispatch();
  const [actionType, setActionType] = useState("");
  const [empId, setEmpId] = useState("");
  const [isCloseSelected, setIsCloseSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otpValue, setOtpValue] = useState('');
  const ref = useBlurOnFulfill({ otpValue, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });
  const [reasonList, setReasonList] = useState([{
    label: 'Other',
    value: 'Other'
  }]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [otherReason, setOtherReason] = useState('');
  const [defaultReasonIndex, setDefaultReasonIndex] = useState(null);

  useEffect(() => {
    getAsyncStorageData();
    dispatch(getTaskDetailsApi(taskId));
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      console.log("TYPE:", reasonTaskName);
      getCurrentLocation()
      getReasonListData(reasonTaskName)
    })
  }, [navigation]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(info)
      setCurrentLocation({
        lat: info.coords.latitude,
        long: info.coords.longitude
      })
    });
  }

  useEffect(() => {
    if (selector.isReasonUpdate && reasonList.length > 0) {
      let reason = selector.reason;
      let findIndex = reasonList.findIndex((item) => {
        return item.value === selector.reason
      })
      console.log("DEFAULT INDEX:", findIndex);
      if (findIndex !== -1) {
        setDefaultReasonIndex(reasonList[findIndex].value)
      }
      else{
        dispatch(setHomeVisitDetails({ key: "REASON", text: 'Other' }));
        setDefaultReasonIndex('Other')
        setOtherReason(reason)
      }
    }
  }, [selector.isReasonUpdate, reasonList]);

  const getReasonListData = async (taskName) => {
    setLoading(true)
    const employeeData = await AsyncStorage.getData(AsyncStorage.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      let payload = {
        orgId: jsonObj.orgId,
        taskName: taskName
      }
      Promise.all([
        dispatch(getReasonList(payload))
      ]).then((res) => {
        console.log("all done", JSON.stringify(res));
        let tempReasonList = [];
        let allReasons = res[0].payload;
        if (allReasons.length > 0) {
          for (let i = 0; i < allReasons.length; i++) {
            allReasons[i].label = allReasons[i].reason;
            allReasons[i].value = allReasons[i].reason;
            if (i === allReasons.length - 1) {
              setReasonList([...reasonList,...allReasons])
              setLoading(false)
            }
          }
        }
        else {
          setLoading(false)
        }
      }).catch(() => {
        setLoading(false)
      })
    }
  };

  const getAsyncStorageData = async () => {
    const employeeId = await AsyncStorage.getData(AsyncStorage.Keys.EMP_ID);
    if (employeeId) {
      setEmpId(employeeId);
    }
  };

  const getMyTasksListFromServer = () => {
    if (empId) {
      const endUrl = `empid=${empId}&limit=10&offset=${0}`;
      dispatch(getCurrentTasksListApi(endUrl));
      dispatch(getPendingTasksListApi(endUrl));
    }
  };

  // Update, Close Task Response handle
  useEffect(() => {
    if (selector.update_task_response_status === "success") {
      if (actionType === "CLOSE_TASK") {
        showToastSucess("Successfully Task Closed");
        getMyTasksListFromServer();
      } else {
        showToastSucess("Successfully Task Updated");
      }
      navigation.popToTop();
      dispatch(clearState());
    }
  }, [selector.update_task_response_status]);

  const updateTask = () => {
    changeStatusForTask("UPDATE_TASK");
  };

  const closeTask = () => {

    if (selector.reason.length === 0) {
      showToast("Please Select Reason");
      return;
    }

    if (selector.customer_remarks.length === 0) {
      showToast("Please enter customer remarks");
      return;
    }

    if (selector.employee_remarks.length === 0) {
      showToast("Please Enter employee remarks");
      return;
    }

    generateOtpToCloseTask();
    setIsCloseSelected(true)
  };

  const changeStatusForTask = (actionType) => {
    Keyboard.dismiss();

    if (selector.task_details_response?.taskId !== taskId) {
      return;
    }

    if (selector.reason.length === 0) {
      showToast("Please Select Reason");
      return;
    }

    if (selector.reason === 'Other' && otherReason.length === 0) {
      showToast("Please Enter Other Reason");
      return;
    }

    if (selector.customer_remarks.length === 0) {
      showToast("Please enter customer remarks");
      return;
    }

    if (selector.employee_remarks.length === 0) {
      showToast("Please Enter employee remarks");
      return;
    }

    const newTaskObj = { ...selector.task_details_response };
    newTaskObj.reason = selector.reason === 'Other' ? otherReason : selector.reason;
    newTaskObj.customerRemarks = selector.customer_remarks;
    newTaskObj.employeeRemarks = selector.employee_remarks;
    newTaskObj.lat = currentLocation ? currentLocation.lat.toString() : null;
    newTaskObj.lon = currentLocation ? currentLocation.long.toString() : null;
    if (actionType === "CLOSE_TASK") {
      newTaskObj.taskStatus = "CLOSED";
    }
    console.log("PAYLOAD:", JSON.stringify(newTaskObj));
    dispatch(updateTaskApi(newTaskObj));
    setActionType(actionType);
  };

  const generateOtpToCloseTask = () => {

    if (!mobile) {
      showToastRedAlert("No mobile found");
      return
    }

    const payload = {
      mobileNo: "91" + mobile,
      message: null
    }
    dispatch(generateOtpApi(payload));
  }

  const resendClicked = () => {

    generateOtpToCloseTask();
  }

  const verifyClicked = async () => {

    if (otpValue.length != 4) {
      showToastRedAlert("Please enter valid OTP")
      return;
    }

    if (!mobile) {
      showToastRedAlert("No mobile found");
      return
    }

    const payload = {
      mobileNo: "91" + mobile,
      sessionKey: selector.otp_session_key,
      otp: otpValue
    }
    dispatch(validateOtpApi(payload));
  }

  // Verify otp response
  useEffect(() => {
    if (selector.validate_otp_response_status === "successs") {
      changeStatusForTask("CLOSE_TASK");
    }
  }, [selector.validate_otp_response_status])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      enabled
      keyboardVerticalOffset={100}
    >
      <SafeAreaView style={[styles.container]}>

        <View style={{ padding: 15 }}>
          <View style={[GlobalStyle.shadow, { backgroundColor: Colors.WHITE }]}>
            {/* <TextinputComp
              style={styles.textInputStyle}
              label={"Reason"}
              value={selector.reason}
              maxLength={50}
              onChangeText={(text) => {
                dispatch(setHomeVisitDetails({ key: "REASON", text: text }));
              }}
            /> */}
            <View style={{ position: 'relative' }}>
              {selector.reason !== '' &&
                <View style={{ position: 'absolute', top: 0, left: 10, zIndex: 99 }}>
                  <Text style={{ fontSize: 13, color: Colors.GRAY }}>Reason*</Text>
                </View>
              }
              <Dropdown
                style={[styles.dropdownContainer,]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={reasonList}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Reason*"}
                searchPlaceholder="Search..."
                value={defaultReasonIndex}
                // onFocus={() => setIsFocus(true)}
                // onBlur={() => setIsFocus(false)}
                onChange={val => {
                  console.log("£££", val);
                  dispatch(setHomeVisitDetails({ key: "REASON", text: val.value }));
                }}
              />
            </View>
            {selector.reason === 'Other' &&
              <TextinputComp
                style={styles.textInputStyle}
                label={"Other reason"}
                value={otherReason}
                maxLength={50}
                onChangeText={(text) => {
                  setOtherReason(text)
                }}
              />
            }
            <Text style={GlobalStyle.underline}></Text>
            <TextinputComp
              style={styles.textInputStyle}
              label={"Customer Remarks*"}
              maxLength={50}
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
              label={"Employee Remarks*"}
              maxLength={50}
              value={selector.employee_remarks}
              onChangeText={(text) =>
                dispatch(
                  setHomeVisitDetails({ key: "EMPLOYEE_REMARKS", text: text })
                )
              }
            />
            <Text style={GlobalStyle.underline}></Text>
          </View>

          {isCloseSelected ? (
            <View style={{ marginTop: 20, paddingHorizontal: otpViewHorizontalPadding }}>
              <View style={{ height: 60, justifyContent: 'center', alignItems: "center" }}>
                <Text style={{ textAlign: "center" }}>{"We have sent an OTP to mobile number, please verify"}</Text>
              </View>
              <CodeField
                ref={ref}
                {...props}
                caretHidden={false} // when users can't paste a text value, because context menu doesn't appear
                value={otpValue}
                onChangeText={setOtpValue}
                cellCount={CELL_COUNT}
                rootStyle={otpStyles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[otpStyles.cell, isFocused && otpStyles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
          ) : null}

        </View>

        {!isCloseSelected ? (
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
        ) : null}

        {isCloseSelected ? (
          <View style={[styles.view1, { marginTop: 30 }]}>
            <Button
              mode="contained"
              style={{ width: 120 }}
              color={Colors.GREEN}
              disabled={selector.is_loading_for_task_update}
              labelStyle={{ textTransform: "none" }}
              onPress={verifyClicked}
            >
              Verify
            </Button>
            <Button
              mode="contained"
              style={{ width: 120 }}
              color={Colors.RED}
              disabled={selector.is_loading_for_task_update}
              labelStyle={{ textTransform: "none" }}
              onPress={resendClicked}
            >
              Resend
            </Button>
          </View>
        ) : null}
      </SafeAreaView>
      <LoaderComponent visible={loading} />
    </KeyboardAvoidingView>
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
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 8,
    // borderWidth: 1,
    width: '100%',
    height: 50,
    borderRadius: 5
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.GRAY
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
