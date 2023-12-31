import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { Colors } from "../styles";
import { IconButton, Checkbox, Button } from "react-native-paper";
import { RadioTextItem } from "../pureComponents";
import { Dropdown } from "react-native-element-dropdown";
import { TextinputComp } from "./textinputComp";
import * as AsyncStore from "../asyncStore";
import { client } from "../networking/client";
import URL, { reasonDropDown } from "../networking/endpoints";
import { createDateTime } from "../service";
import { useNavigation } from "@react-navigation/native";
import { AppNavigator } from "../navigations";
import moment from "moment";
import { monthNamesCap } from "../scenes/mainScenes/Attendance/AttendanceTop";

const LocalButtonComp = ({ title, onPress, disabled }) => {
  return (
    <Button
      style={{ width: 120, marginHorizontal: 20 }}
      mode="contained"
      color={Colors.RED}
      disabled={disabled}
      labelStyle={{ textTransform: "none" }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};

var startDate = createDateTime("8:30");
var midDate = createDateTime("12:00");
var endDate = createDateTime("16:00");
var endBetween = createDateTime("20:30");
var endDate2 = createDateTime("21:30");
var now = new Date();
var isBetween = startDate <= now && now <= midDate;
var isAfterNoon = midDate <= now && now <= endDate;
const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);

const AttendanceForm = ({ visible, onRequestClose, inVisible, showReason }) => {
  const navigation = useNavigation();
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [present, setPresent] = useState(true);
  const [workFromHome, setWorkFromHome] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [userData, setUserData] = useState({});
  const [punched, setPunched] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    getReason();
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        setUserData(jsonObj);
        var d = new Date();
        const response = await client.get(
          URL.GET_ATTENDANCE_EMPID(
            jsonObj.empId,
            jsonObj.orgId,
            monthNamesCap[d.getMonth()]
          )
        );
        const json = await response.json();
        const lastDate = moment().format(dateFormat);
        const lastPresentDate = new Date(
          json[json?.length - 1]?.createdtimestamp
        ).getDate();
        const todaysDate = new Date().getDate();
        let present = json[json?.length - 1].isPresent;
        let wfh = json[json?.length - 1].wfh;
        if (todaysDate === lastPresentDate) {
          if (present == 1) {
            setPresent(true);
            setWorkFromHome(false);
          } else if (wfh == 1) {
            setWorkFromHome(true);
            setPresent(false);
          }
          setPunched(true);
        }
      }
    } catch (error) {}
  };

  const getReason = async () => {
    try {
      let payload = {
        bu: "18",
        dropdownType: "AttendanceReason",
        parentId: 0,
      };
      const response = await client.post(reasonDropDown, payload);
      const json = await response.json();
      const newArr1 = json.map((v) => ({ ...v, label: v.key }));
      setReasonList(newArr1);
    } catch (error) {}
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const validation = () => {
    let error = false;
    if (showReason) {
      if (isEmpty(reason)) {
        setReasonError("Please Select a Reason");
        error = true;
      }
      if (comment.trim().length == 0) {
        setCommentError("Please enter your comments");
        error = true;
      }
    }
    if (!error) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = () => {
    Keyboard.dismiss();
    if (!validation()) {
      return;
    }
    callAPI();
  };

  const callAPI = async (absentRequest = false) => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        var n = new Date().toString().split(" ")[4];
        let payload = {
          id: 0,
          orgId: jsonObj.orgId,
          empId: jsonObj.empId,
          branchId: jsonObj.branchId,
          isPresent: present && !workFromHome ? 1 : 0,
          isAbsent: present ? 0 : 1,
          wfh: workFromHome ? 1 : 0,
          status: "Active",
          comments: comment.trim(),
          isLogOut: present && endBetween <= now && now <= endDate2 ? 1 : 0,
          reason: reason ? reason : "",
          punchIn: n,
          punchOut: null,
        };
        var d = new Date();
        const response = await client.get(
          URL.GET_ATTENDANCE_EMPID(
            jsonObj.empId,
            jsonObj.orgId,
            monthNamesCap[d.getMonth()]
          )
        );
        const json = await response.json();
        let latestDate = new Date(
          json[json?.length - 1]?.createdtimestamp
        )?.getDate();
        let todaysDate = new Date().getDate();
        if (json.length == 0 || latestDate !== todaysDate) {
          saveData(payload, absentRequest);
        } else {
          updateData(payload, json, absentRequest);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveData = async (payload, absentRequest = false) => {
    try {
      const saveData = await client.post(
        URL.SAVE_EMPLOYEE_ATTENDANCE(),
        payload
      );
      const savedJson = await saveData.json();
      !absentRequest &&
        AsyncStore.storeJsonData(
          AsyncStore.Keys.IS_PRESENT,
          new Date().getDate().toString()
        );
      !absentRequest && inVisible();
      inVisible();
      // if (savedJson.success) {
      //   !absentRequest && inVisible();
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const updateData = async (payload, json, absentRequest = false) => {
    try {
      var n = new Date().toString().split(" ")[4];
      let tempPayload = {
        id: json[json.length - 1].id,
        orgId: payload.orgId,
        empId: payload.empId,
        branchId: payload.branchId,
        isPresent: present && !workFromHome ? 1 : 0,
        isAbsent: present ? 0 : 1,
        wfh: workFromHome ? 1 : 0,
        status: "Active",
        comments: comment.trim(),
        reason: reason ? reason : "",
        isLogOut: present && endBetween <= now && now <= endDate2 ? 1 : 0,
        punchIn: json[json.length - 1].punchIn
          ? json[json.length - 1].punchIn
          : n,
        punchOut: present && endBetween <= now && now <= endDate2 ? n : null,
      };
      const updateData = await client.put(
        URL.UPDATE_EMPLOYEE_ATTENDANCE(json[json.length - 1].id),
        tempPayload
      );
      const updatedJson = await updateData.json();
      present &&
        AsyncStore.storeData(
          AsyncStore.Keys.IS_PRESENT,
          new Date().getDate().toString()
        );
      !absentRequest && inVisible();
      inVisible();
      // if (updatedJson.success) {
      //   !absentRequest && inVisible();
      // }
    } catch (error) {
      console.error(error);
    }
  };

  function onClose() {
    setPresent(false);
  }

  return (
    <Modal
      animationType={Platform.OS === "ios" ? "slide" : "fade"}
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        <View style={styles.view1}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Text style={styles.greetingText}>
                {"Hi, " + userData.empName}
              </Text>
              {}
              <Text style={styles.greetingText}>
                {isBetween
                  ? "Good Morning,"
                  : isAfterNoon
                  ? "Good Afternoon,"
                  : "Good Evening,"}
              </Text>
              {present || !active ? (
                <Text style={styles.greetingText}>
                  {!punched
                    ? "Please Punch Your Attendance"
                    : "Please LogOut Your Attendance"}
                </Text>
              ) : (
                <Text style={styles.greetingText}>
                  {"Today your Attendance is Locked as Absent, For More info "}
                  <Text
                    onPress={() => {
                      navigation.navigate(
                        AppNavigator.DrawerStackIdentifiers.attendance
                      );
                      inVisible();
                    }}
                    style={{
                      textDecorationLine: "underline",
                      color: Colors.BLUE,
                    }}
                  >
                    {"Click Here"}
                  </Text>
                </Text>
              )}
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <RadioTextItem
              label={"Present"}
              value={"Present"}
              disabled={false}
              status={present && !workFromHome ? true : false}
              onPress={() => {
                setPresent(true);
                setWorkFromHome(false);
              }}
            />
            <RadioTextItem
              label={"Leave"}
              value={"Absent"}
              disabled={false}
              status={!present ? true : false}
              onPress={() => {
                setWorkFromHome(false);
                setPresent(false);
              }}
            />
            <RadioTextItem
              label={"WFH"}
              value={"WFH"}
              disabled={false}
              status={workFromHome ? true : false}
              onPress={() => {
                setWorkFromHome(!workFromHome);
                setPresent(!workFromHome);
              }}
            />
          </View>
          {showReason ||
            ((workFromHome || !present) && (
              <>
                <View style={styles.view2}>
                  {/* <Dropdown
                    disable={false}
                    style={[styles.dropdownContainer]}
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
                    value={reason.label}
                    searchPlaceholder="Search..."
                    onChange={(val) => {
                      setReason(val);
                      setReasonError("");
                    }}
                  /> */}
                  <TextinputComp
                    disabled={false}
                    style={styles.textInputStyle}
                    label={"Reason"}
                    autoCapitalize="sentences"
                    value={reason}
                    maxLength={150}
                    onChangeText={(text) => {
                      setReason(text);
                      setReasonError("");
                    }}
                  />
                </View>
                <View
                  style={styles.view3}
                >
                  {reasonError.length > 0 && (
                    <Text style={styles.errorText}>{reasonError}</Text>
                  )}
                </View>
              <View style={styles.view2}>
                  <TextinputComp
                    disabled={false}
                    style={styles.textInputStyle}
                    label={"Comments"}
                    autoCapitalize="sentences"
                    value={comment}
                    maxLength={150}
                    onChangeText={(text) => {
                      setComment(text);
                      setCommentError("");
                    }}
                  />
                </View>
                <View
                style={styles.view3}
                >
                  {commentError.length > 0 && (
                    <Text style={styles.errorText}>{commentError}</Text>
                  )}
                </View>
              </>
            ))}
          <View style={{ flexDirection: "row", marginTop: 10, width: "100%" }}>
            {present || !active ? (
              <>
                <LocalButtonComp
                  title={"Submit"}
                  onPress={() => onSubmit()}
                  disabled={false}
                />
                <LocalButtonComp
                  title={"Close"}
                  onPress={() => {
                    inVisible();
                  }}
                  disabled={false}
                />
              </>
            ) : (
              <LocalButtonComp
                title={"Close"}
                onPress={() => {
                  inVisible();
                }}
                disabled={false}
              />
            )}
          </View>
          <View
            style={styles.view3}
          >
            {!isEmpty(reason) && reason.id == 1265 && (
              <Text style={{ ...styles.errorText, fontSize: 12, marginTop: 5 }}>
                {"Hint: Test Drive, Home Visit"}
              </Text>
            )}
          </View>
          {/* <ActivityIndicator size="large" color={Colors.RED} /> */}
          {/* <Text style={styles.text1}>{'We are fetching data from server, please wait until the process completed.'}</Text> */}
        </View>
      </View>
    </Modal>
  );
};

export default AttendanceForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  view1: {
    // width: screenWidth - 100,
    // height: 200,
    // width: 100,
    // height: 100,
    backgroundColor: Colors.WHITE,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    margin: 10,
  },
  text1: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  dropdownContainer: {
    backgroundColor: "white",
    padding: 8,
    borderWidth: 1,
    width: "100%",
    height: 60,
    borderColor: Colors.GRAY,
    borderRadius: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.GRAY,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 5,
  },
  errorText: {
    color: Colors.RED,
    fontSize: 15,
  },
  greetingText: {
    fontSize: 15,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
  view2:{ flexDirection: "row", marginTop: 10 },
  view3:{
    flexDirection: "row",
    width: "100%",
    alignSelf: "flex-start",
  }
});
