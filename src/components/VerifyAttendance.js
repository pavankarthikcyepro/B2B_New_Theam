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
  Image,
} from "react-native";
import { Colors, GlobalStyle } from "../styles";
import { IconButton, Checkbox, Button } from "react-native-paper";
import { RadioTextItem } from "../pureComponents";
import { Dropdown } from "react-native-element-dropdown";
import { TextinputComp } from "./textinputComp";
import * as AsyncStore from "../asyncStore";
import { client } from "../networking/client";
import URL, { baseUrl, reasonDropDown } from "../networking/endpoints";
import { createDateTime } from "../service";
import { useNavigation } from "@react-navigation/native";
import { AppNavigator } from "../navigations";
import moment from "moment";
import { monthNamesCap } from "../scenes/mainScenes/Attendance/AttendanceTop";

const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 6;
const profileBgWidth = profileWidth + 5;
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

const VerifyAttendance = ({
  visible,
  onRequestClose,
  inVisible,
  showReason,
  logOut = false,
  onLogin,
}) => {
  const navigation = useNavigation();
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [present, setPresent] = useState(true);
  const [workFromHome, setWorkFromHome] = useState(false);
  const [reason, setReason] = useState({});
  const [reasonError, setReasonError] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [userData, setUserData] = useState({});
  const [punched, setPunched] = useState(false);
  const [active, setActive] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(formatAMPM(new Date()));
    setInterval(() => {
      setCurrentDate(formatAMPM(new Date()));
    }, 30000);
  }, []);

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm.toUpperCase();
    return strTime;
  }
  // useEffect(() => {
  //   if (!present) {
  //     callAPI(true);
  //   }
  // }, [present]);

  useEffect(() => {
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
        getProfilePic(jsonObj);
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
        if (todaysDate === lastPresentDate && present == 1) {
          setPunched(true);
        }
      }
    } catch (error) {}
  };

  const getProfilePic = (userData) => {
    client
      .get(
        `${baseUrl}sales/employeeprofilepic/get/${userData.empId}/${userData.orgId}/${userData.branchId}`
      )
      .then((response) => response.json())
      .then((json) => {
        if (json.length > 0) {
          setImageUri(json[json.length - 1].documentPath);
        } else {
          setImageUri(
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
          );
        }
      })
      .catch((error) => {
        setImageUri(
          "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
        );
        console.error(error);
      });
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
          isPresent: present ? 1 : 0,
          isAbsent: present ? 0 : 1,
          status: "Active",
          comments: comment.trim(),
          isLogOut: present && endBetween <= now && now <= endDate2 ? 1 : 0,
          reason: reason?.value ? reason?.value : "",
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
      console.error("MAIN", error);
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
      // if (savedJson.success) {
      //   !absentRequest && inVisible();
      // }
    } catch (error) {
      console.error("ERROR", error);
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
        isPresent: present ? 1 : 0,
        isAbsent: present ? 0 : 1,
        status: "Active",
        comments: comment.trim(),
        reason: reason?.value ? reason?.value : "",
        isLogOut: present && endBetween <= now && now <= endDate2 ? 1 : 0,
        punchIn: json[json.length - 1].punchIn
          ? json[json.length - 1].punchIn
          : n,
        punchOut: logOut ? n : null,
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
    } catch (error) {
      console.error("ERROR", error);
    }
  };

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
              {/* <Text style={styles.profileMatched}>{"Profile Matched!!"}</Text> */}
            </View>
          </View>
          <View style={styles.ProfileView}>
            <View
              style={{
                ...GlobalStyle.shadow,
                ...styles.profilePicBG,
              }}
            >
              <Image
                style={styles.profilePic}
                source={{
                  uri: imageUri,
                }}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.greetingText}>{userData?.empName}</Text>
              <Text style={styles.greetingText}>{userData?.hrmsRole}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.clockTxt}>
              {`Clocked in for `}
              <Text style={styles.time}>{`${currentDate}`}</Text>
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10, width: "100%" }}>
            <LocalButtonComp
              title={"Cancel"}
              disabled={false}
              onPress={() => {
                inVisible();
              }}
            />
            <LocalButtonComp
              title={"Submit"}
              onPress={() => onLogin()}
              disabled={false}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  view1: {
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
  profileMatched: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.BLACK,
  },
  profilePic: {
    width: profileWidth,
    height: profileWidth,
    borderRadius: profileWidth / 2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profilePicBG: {
    width: profileWidth,
    height: profileWidth,
    borderRadius: profileWidth / 2,
    borderColor: "#fff",
  },
  time: {
    color: Colors.RED,
    fontSize: 18,
    fontWeight: "600",
  },
  clockTxt: {
    color: Colors.BLACK,
    fontSize: 17,
    fontWeight: "600",
  },
  ProfileView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});
