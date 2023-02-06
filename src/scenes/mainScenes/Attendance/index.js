import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  DatePickerComponent,
  DateRangeComp,
  LoaderComponent,
} from "../../../components";
import { Colors, GlobalStyle } from "../../../styles";
import { client } from "../../../networking/client";
import URL, { baseUrl } from "../../../networking/endpoints";
import { Button, IconButton } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import * as AsyncStore from "../../../asyncStore";
import moment from "moment";
import AttendanceForm from "../../../components/AttendanceForm";
import { MenuIcon } from "../../../navigations/appNavigator";
import Geolocation from "@react-native-community/geolocation";
import { getDistanceBetweenTwoPoints, officeRadius } from "../../../service";
import { monthNamesCap } from "./AttendanceTop";
import ReactNativeModal from "react-native-modal";
import Entypo from "react-native-vector-icons/FontAwesome";
import RNFetchBlob from "rn-fetch-blob";
import AttendanceDetail from "../../../components/AttendanceDetail";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);
const lastMonthLastDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .endOf("month")
  .format(dateFormat);
const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};
const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 6;
const profileBgWidth = profileWidth + 5;
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AttendanceScreen = ({ route, navigation }) => {
  // const navigation = useNavigation();
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isWeek, setIsWeek] = useState(false);
  const [marker, setMarker] = useState({});
  const [attendance, setAttendance] = useState(false);
  const [weeklyRecord, setWeeklyRecord] = useState([]);
  const [reason, setReason] = useState(false);
  const [initialPosition, setInitialPosition] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [attendanceCount, setAttendanceCount] = useState({
    holidays: 0,
    leave: 0,
    present: 0,
    wfh: 0,
    totalTime: "0",
    total: 0,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [payRoll, setPayRoll] = useState("");
  const [datePickerId, setDatePickerId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hoverReasons, setHoverReasons] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [userName, setUserName] = useState("");
  const [filterStart, SetFilterStart] = useState(false);
  const [userData, setUserData] = useState({
    orgId: "",
    empId: "",
    empName: "",
    role: "",
  });
  const fromDateRef = useRef(selectedFromDate);
  const toDateRef = useRef(selectedToDate);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <MenuIcon navigation={navigation} />,
    });
  }, [navigation]);

  useEffect(() => {
    if (route?.params) {
      setFromDateState(lastMonthFirstDate);
      setToDateState(lastMonthLastDate);
      // getAttendanceFilter(route?.params);
    }
  }, [route.params]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      // getCurrentLocation();
      setFromDateState(lastMonthFirstDate);
      setToDateState(lastMonthLastDate);
      GetCountByMonth(lastMonthFirstDate, lastMonthLastDate);
      getAttendanceByMonth(lastMonthFirstDate, lastMonthLastDate);
      getProfilePic();
      // setLoading(true);
      // getAttendance();
    });
  }, [navigation]);

  useEffect(() => {
    if (route.params) {
      setLoading(true);
      getAttendance(route?.params);
    } else {
      // setLoading(true);
      // getAttendance();
    }
  }, [currentMonth]);

  // useEffect(() => {
  //   setLoading(true);
  //   getAttendanceFilter();
  // }, [selectedFromDate, selectedToDate]);

  useEffect(() => {
    var from = new Date(selectedFromDate);
    var toDate = new Date(
      new Date(selectedFromDate).setDate(from.getDate() + 30)
    );
    // setToDateState(moment(toDate).format(dateFormat));
    setPayRoll(moment(toDate).format(dateFormat));
  }, [selectedFromDate]);

  const setFromDateState = (date) => {
    fromDateRef.current = date;
    setSelectedFromDate((x) => date);
  };

  const setToDateState = (date) => {
    toDateRef.current = date;
    setSelectedToDate((x) => date);
  };

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key);
  };

  const updateSelectedDate = (date, key) => {
    const formatDate = moment(date).format(dateFormat);
    switch (key) {
      case "FROM_DATE":
        setFromDateState(formatDate);
        setLoading(true);
        getAttendanceFilter(route?.params);
        SetFilterStart(true);
        break;
      case "TO_DATE":
        setToDateState(formatDate);
        setLoading(true);
        getAttendanceFilter(route?.params);
        SetFilterStart(true);
        break;
    }
  };

  const getAttendanceFilter = async (newUser) => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        // getProfilePic(newUser ? newUser : jsonObj);
        getFilterAttendanceCount(newUser ? newUser : jsonObj);
        setUserName(newUser ? newUser.empName : jsonObj.empName);
        var d = currentMonth;
        const response = await client.get(
          URL.GET_ATTENDANCE_EMPID2(
            newUser ? newUser.empId : jsonObj.empId,
            newUser ? newUser.orgId : jsonObj.orgId,
            selectedFromDate,
            selectedToDate
          )
        );
        const json = await response.json();
        if (json) {
          let newArray = [];
          let dateArray = [];
          let weekArray = [];
          for (let i = 0; i < json.length; i++) {
            const element = json[i];
            let format = {
              customStyles: {
                container: {
                  backgroundColor:
                    element.isPresent === 1
                      ? element.wfh === 1
                        ? Colors.SKY_LIGHT_BLUE_COLOR
                        : Colors.GREEN
                      : element.holiday === 1
                      ? Colors.DARK_GRAY
                      : element.wfh === 1
                      ? Colors.SKY_LIGHT_BLUE_COLOR
                      : Colors.RED,
                },
                text: {
                  color: Colors.WHITE,
                  fontWeight: "bold",
                },
              },
            };

            let date = new Date(element.createdtimestamp);
            let formatedDate = moment(date).format(dateFormat);
            let weekReport = {
              start: formatedDate,
              // duration: "00:20:00",
              note: element.comments,
              reason: element.reason,
              color: element.isPresent === 1 ? Colors.GREEN : Colors.RED,
              status:
                element.isPresent === 1
                  ? "Present"
                  : element.wfh === 1
                  ? "WFH"
                  : "Absent",
            };
            dateArray.push(formatedDate);
            newArray.push(format);
            weekArray.push(weekReport);
          }
          var obj = {};
          for (let i = 0; i < newArray.length; i++) {
            const element = newArray[i];
            obj[dateArray[i]] = element;
          }
          setLoading(false);
          setWeeklyRecord(weekArray);
          setMarker(obj);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const getAttendance = async (newUser) => {
    console.log("KKKK");
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        // getProfilePic(newUser ? newUser : jsonObj);
        getAttendanceCount(newUser ? newUser : jsonObj);
        var d = currentMonth;
        const response = await client.get(
          URL.GET_ATTENDANCE_EMPID(
            newUser ? newUser.empId : jsonObj.empId,
            newUser ? newUser.orgId : jsonObj.orgId,
            monthNamesCap[d.getMonth()]
          )
        );
        setUserData({
          orgId: jsonObj.orgId,
          empId: jsonObj.empId,
          empName: jsonObj.empName,
          role: jsonObj.hrmsRole,
        });
        setUserName(jsonObj.empName);
        const json = await response.json();
        if (json) {
          let newArray = [];
          let dateArray = [];
          let weekArray = [];
          for (let i = 0; i < json.length; i++) {
            const element = json[i];
            let format = {
              customStyles: {
                container: {
                  backgroundColor:
                    element.isPresent === 1
                      ? element.wfh === 1
                        ? Colors.SKY_LIGHT_BLUE_COLOR
                        : Colors.GREEN
                      : element.holiday === 1
                      ? Colors.DARK_GRAY
                      : element.wfh === 1
                      ? Colors.SKY_LIGHT_BLUE_COLOR
                      : Colors.RED,
                },
                text: {
                  color: Colors.WHITE,
                  fontWeight: "bold",
                },
              },
            };

            let date = new Date(element.createdtimestamp);
            let formatedDate = moment(date).format(dateFormat);
            let weekReport = {
              start: formatedDate,
              // duration: "00:20:00",
              note: element.comments,
              reason: element.reason,
              color: element.isPresent === 1 ? Colors.GREEN : Colors.RED,
              status:
                element.isPresent === 1
                  ? element.wfh === 1
                    ? "WFH"
                    : "Present"
                  : element.holiday === 1
                  ? "Holiday"
                  : element.wfh === 1
                  ? "WFH"
                  : "Absent",
              // element.isPresent === 1
              //   ? "Present"
              //   : element.wfh === 1
              //   ? "WFH"
              //   : "Absent",
            };
            console.log(element);
            dateArray.push(formatedDate);
            newArray.push(format);
            weekArray.push(weekReport);
          }
          var obj = {};
          for (let i = 0; i < newArray.length; i++) {
            const element = newArray[i];
            obj[dateArray[i]] = element;
          }
          setLoading(false);
          setWeeklyRecord(weekArray);
          setMarker(obj);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const isCurrentDate = (day) => {
    let selectedDate = day.dateString;
    if (route?.params) {
      return;
    } else if (currentDate === selectedDate) {
      setAttendance(true);
    }
  };

  const isCurrentDateForWeekView = (day) => {
    let selectedDate = moment(day).format(dateFormat);
    if (currentDate === selectedDate) {
      setAttendance(true);
    }
  };

  const getProfilePic = async (userData) => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        await client
          .get(
            `${baseUrl}sales/employeeprofilepic/get/${jsonObj.empId}/${jsonObj.orgId}/${jsonObj.branchId}`
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
      }
    } catch (error) {}
  };

  const getAttendanceCount = async (jsonObj) => {
    try {
      let d = currentMonth;
      const response = await client.get(
        URL.GET_ATTENDANCE_COUNT(
          jsonObj.empId,
          jsonObj.orgId,
          monthNamesCap[d.getMonth()]
        )
      );
      const json = await response.json();
      if (json) {
        setAttendanceCount({
          holidays: json?.holidays || 0,
          leave: json?.leave || 0,
          present: json?.present || 0,
          wfh: json?.wfh || 0,
          totalTime: json?.totalTime || "0",
          total: json?.total || 0,
        });
      }
    } catch (error) {}
  };

  const getFilterAttendanceCount = async (jsonObj) => {
    try {
      let d = currentMonth;
      const response = await client.get(
        URL.GET_ATTENDANCE_COUNT2(
          jsonObj.empId,
          jsonObj.orgId,
          selectedFromDate,
          selectedToDate
          // monthNamesCap[d.getMonth()]
        )
      );
      const json = await response.json();
      if (json) {
        setAttendanceCount({
          holidays: json?.holidays || 0,
          leave: json?.leave || 0,
          present: json?.present || 0,
          wfh: json?.wfh || 0,
          totalTime: json?.totalTime || "0",
          total: json?.total || 0,
        });
      }
    } catch (error) {}
  };

  const GetCountByMonth = async (start, end) => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        let d = currentMonth;
        const response = await client.get(
          URL.GET_ATTENDANCE_COUNT2(
            jsonObj.empId,
            jsonObj.orgId,
            start,
            end
            // monthNamesCap[d.getMonth()]
          )
        );
        const json = await response.json();
        if (json) {
          setAttendanceCount({
            holidays: json?.holidays || 0,
            leave: json?.leave || 0,
            present: json?.present || 0,
            wfh: json?.wfh || 0,
            totalTime: json?.totalTime || "0",
            total: json?.total || 0,
          });
        }
      }
    } catch (error) {}
  };

  const getAttendanceByMonth = async (start, end) => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        // getProfilePic(jsonObj);
        var d = currentMonth;
        const response = await client.get(
          URL.GET_ATTENDANCE_EMPID2(jsonObj.empId, jsonObj.orgId, start, end)
        );
        const json = await response.json();
        const response1 = await client.get(URL.GET_HOLIDAYS(jsonObj.orgId));
        const json1 = await response1.json();
        // console.log(json1);
        if (json) {
          let newArray = [];
          let dateArray = [];
          let weekArray = [];
          for (let i = 0; i < json.length; i++) {
            const element = json[i];
            let format = {
              customStyles: {
                container: {
                  backgroundColor:
                    element.isPresent === 1
                      ? element.wfh === 1
                        ? Colors.SKY_LIGHT_BLUE_COLOR
                        : Colors.GREEN
                      : element.holiday === 1
                      ? Colors.DARK_GRAY
                      : element.wfh === 1
                      ? Colors.SKY_LIGHT_BLUE_COLOR
                      : Colors.RED,
                },
                text: {
                  color: Colors.WHITE,
                  fontWeight: "bold",
                },
              },
            };

            let date = new Date(element.createdtimestamp);
            let formatedDate = moment(date).format(dateFormat);
            let weekReport = {
              start: formatedDate,
              // duration: "00:20:00",
              note: element.comments,
              reason: element.reason,
              color: element.isPresent === 1 ? Colors.GREEN : Colors.RED,
              status:
                element.isPresent === 1
                  ? element.wfh === 1
                    ? "WFH"
                    : "Present"
                  : element.holiday === 1
                  ? "Holiday"
                  : element.wfh === 1
                  ? "WFH"
                  : "Absent",
            };
            dateArray.push(formatedDate);
            newArray.push(format);
            weekArray.push(weekReport);
          }

          setLoading(false);
          setWeeklyRecord(weekArray);
          if (json1.length > 0) {
            for (let i = 0; i <= json1.length - 1; i++) {
              let format = {
                customStyles: {
                  container: {
                    backgroundColor: Colors.DARK_GRAY,
                  },
                  text: {
                    color: Colors.WHITE,
                    fontWeight: "bold",
                  },
                },
              };
              let date = new Date(json1[i].date);
              let formatedDate = moment(date).format(dateFormat);
              dateArray.push(formatedDate);
              newArray.push(format);
            }
          }
          var obj = {};
          for (let i = 0; i < newArray.length; i++) {
            const element = newArray[i];
            obj[dateArray[i]] = element;
          }
          // for (let i = 1; i <= 31; i++) {
          //   const date = new Date(
          //     new Date(start).getFullYear(),
          //     new Date(start).getMonth(),
          //     i
          //   );
          //   if (date.getDay() === 0 || date.getDay() === 6) {
          //     obj[
          //       moment(date).format(dateFormat)
          //     ] = {
          //       // disabled: true,
          //       //  let format = {
          //     customStyles: {
          //       container: {
          //         backgroundColor: Colors.GRAY_LIGHT
          //       },
          //       text: {
          //         color: Colors.WHITE,
          //         fontWeight: "bold",
          //       },
          //     },
          //     };
          //   }
          // }
          setMarker(obj);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const payload = {
          orgId: jsonObj.orgId,
          fromDate: selectedFromDate,
          toDate: selectedToDate,
        };
        const response = await client.post(
          URL.GET_ATTENDANCE_REPORT(),
          payload
        );
        const json = await response.json();
        if (json.downloadUrl) {
          downloadInLocal(URL.GET_DOWNLOAD_URL(json.downloadUrl));
        }
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const downloadInLocal = async (url) => {
    const { config, fs } = RNFetchBlob;
    let downloadDir = Platform.select({
      ios: fs.dirs.DocumentDir,
      android: fs.dirs.DownloadDir,
    });
    let date = new Date();
    let file_ext = getFileExtention(url);
    file_ext = "." + file_ext[0];
    let options = {};
    if (Platform.OS === "android") {
      options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification: true,
          path:
            downloadDir +
            "/ATTENDANCE_" +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            file_ext, // this is the path where your downloaded file will live in
          description: "Downloading image.",
        },
      };
      config(options)
        .fetch("GET", url)
        .then((res) => {
          setLoading(false);
          RNFetchBlob.android.actionViewIntent(res.path());
          // do some magic here
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
    if (Platform.OS === "ios") {
      options = {
        fileCache: true,
        path:
          downloadDir +
          "/ATTENDANCE_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        // mime: 'application/xlsx',
        // appendExt: 'xlsx',
        //path: filePath,
        //appendExt: fileExt,
        notification: true,
      };

      config(options)
        .fetch("GET", url)
        .then((res) => {
          setLoading(false);
          setTimeout(() => {
            // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
            RNFetchBlob.ios.openDocument(res.data); //<---Property to display downloaded file on documaent viewer
            // Alert.alert(CONSTANTS.APP_NAME,'File download successfully');
          }, 300);
        })
        .catch((errorMessage) => {
          setLoading(false);
        });
    }
  };

  // const RenderModal = () => {
  //   return (
  //     <ReactNativeModal
  //       onBackdropPress={() => {
  //         setShowModal(false);
  //       }}
  //       transparent={true}
  //       visible={showModal}
  //     >
  //       <View style={styles.newModalContainer}>
  //         <Text>{"Reason: " + hoverReasons}</Text>
  //         <Text>{"Note: " + notes}</Text>
  //       </View>
  //     </ReactNativeModal>
  //   );
  // };

  return (
    <SafeAreaView style={styles.container}>
      {/* <RenderModal /> */}
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        maximumDate={payRoll != "" ? new Date(payRoll) : new Date()}
        value={new Date()}
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (Platform.OS === "android") {
            if (selectedDate) {
              updateSelectedDate(selectedDate, datePickerId);
            }
          } else {
            updateSelectedDate(selectedDate, datePickerId);
          }
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />
      <AttendanceDetail
        visible={attendance}
        showReason={reason}
        inVisible={() => {
          setAttendance(false);
        }}
        reasonText={hoverReasons || "No Reason Available"}
        noteText={notes || "No Notes Available"}
        status={status}
        userName={route?.params?.empName ? route?.params?.empName : userName}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.DatePickerView}>
          <DateRangeComp
            fromDate={selectedFromDate}
            toDate={selectedToDate}
            fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
            toDateClicked={() => showDatePickerMethod("TO_DATE")}
          />
        </View>
        <View style={styles.profilePicView}>
          <View style={styles.profileView}>
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
            <Text style={styles.employeeName}>{route?.params?.empName}</Text>
          </View>
          <View style={styles.hoursView}>
            <Text style={styles.totalHours}>{"Total Hours"}</Text>
            <Text style={styles.totalHoursValue}>
              {attendanceCount.totalTime}
            </Text>
          </View>
        </View>
        <View>
          <Calendar
            // disabledDaysIndexes={[6, 7]}
            onDayPress={(day) => {
              // isCurrentDate(day);
              if (
                new Date(day.timestamp).getDay() !== 6 ||
                new Date(day.timestamp).getDay() !== 0
              ) {
                let newData = weeklyRecord.filter(
                  (e) => e.start === day.dateString
                )[0];
                console.log(newData);
                if (newData?.status == "Absent" || newData?.status == "WFH") {
                  setHoverReasons(newData?.reason || "");
                  setStatus(newData?.status == "Absent" ? "Leave" : "WFH");
                  console.log(newData?.status);
                  setNotes(newData?.note || "");
                  setAttendance(true);
                }
              }
            }}
            onDayLongPress={(day) => {
              // let newData = weeklyRecord.filter(
              //   (e) => e.start === day.dateString
              // )[0];
              // setHoverReasons(newData?.reason || "");
              // setNotes(newData?.note || "");
              // let week = new Date(day.dateString);
              // const weekDay = week.getDay();
              // if (weekDay == 0 || weekDay == 6) {
              // } else {
              //   // setShowModal(true);
              // }
            }}
            monthFormat={"MMM yyyy"}
            onMonthChange={(month) => {
              const startDate = moment(month.dateString, dateFormat)
                .subtract(0, "months")
                .startOf("month")
                .format(dateFormat);
              const endDate = moment(month.dateString, dateFormat)
                .subtract(0, "months")
                .endOf("month")
                .format(dateFormat);

              if (!filterStart) {
                GetCountByMonth(startDate, endDate);
                getAttendanceByMonth(startDate, endDate);
                // setCurrentMonth(new Date(month.dateString));
              }
            }}
            // dayComponent={({ date, state }) => {
            //   return (
            //     <View>
            //       <Text
            //         style={{
            //           textAlign: "center",
            //           color: state === "disabled" ? "gray" : "black",
            //         }}
            //       >
            //         {date.day}
            //       </Text>
            //     </View>
            //   );
            // }}
            hideExtraDays={true}
            // firstDay={1}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            enableSwipeMonths={true}
            theme={{
              "stylesheet.calendar.header": {
                dayTextAtIndex0: {
                  color: Colors.GRAY,
                },
                dayTextAtIndex6: {
                  color: Colors.GRAY,
                },
              },
              "stylesheet.day.basic": {
                dayTextAtIndex0: {
                  color: Colors.GRAY,
                },
                dayTextAtIndex6: {
                  color: Colors.GRAY,
                },
              },
              arrowColor: Colors.RED,
              dotColor: Colors.RED,
              textMonthFontWeight: "500",
              monthTextColor: Colors.RED,
              indicatorColor: Colors.RED,
              dayTextColor: Colors.BLACK,
              selectedDayBackgroundColor: Colors.GRAY,
              textDayFontWeight: "500",
              textDayStyle: {
                color: Colors.BLACK,
              },
              textSectionTitleColor: Colors.BLACK,
            }}
            markingType={"custom"}
            markedDates={marker}
          />
        </View>
        <View style={styles.parameterListContain}>
          <View style={styles.parameterView}>
            <View
              style={{
                ...styles.parameterMarker,
                backgroundColor: Colors.GREEN,
              }}
            />
            <View style={styles.parameterCountView}>
              <Text style={styles.parameterText}>{"Present"}</Text>
              <Text style={styles.parameterText}>
                {attendanceCount.present}
              </Text>
            </View>
          </View>
          <View style={styles.parameterView}>
            <View
              style={{ ...styles.parameterMarker, backgroundColor: Colors.RED }}
            />
            <View style={styles.parameterCountView}>
              <Text style={styles.parameterText}>{"Leave"}</Text>
              <Text style={styles.parameterText}>{attendanceCount.leave}</Text>
            </View>
          </View>
          <View style={styles.parameterView}>
            <View
              style={{
                ...styles.parameterMarker,
                backgroundColor: Colors.DARK_GRAY,
              }}
            />
            <View style={styles.parameterCountView}>
              <Text style={styles.parameterText}>{"Holiday"}</Text>
              <Text style={styles.parameterText}>
                {attendanceCount.holidays}
              </Text>
            </View>
          </View>
          <View style={styles.parameterView}>
            <View
              style={{
                ...styles.parameterMarker,
                backgroundColor: Colors.SKY_LIGHT_BLUE_COLOR,
              }}
            />
            <View style={styles.parameterCountView}>
              <Text style={styles.parameterText}>{"WFH"}</Text>
              <Text style={styles.parameterText}>{attendanceCount.wfh}</Text>
            </View>
          </View>
          {/* <View style={styles.parameterView}>
            <View
              style={{
                width: 25,
                marginRight: 5,
              }}
            />
            <View style={styles.parameterCountView}>
              <Text style={styles.parameterText}>{"No Logged"}</Text>
              <Text style={styles.parameterText}>{attendanceCount.total}</Text>
            </View>
          </View> */}
          <View style={styles.parameterView}>
            <View
              style={{
                width: 25,
                marginRight: 5,
              }}
            />
            <View style={styles.parameterCountView}>
              <Text style={styles.parameterText}>{"Total"}</Text>
              <Text style={styles.parameterText}>{attendanceCount.total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {selector.isDSE ? null : (
        <TouchableOpacity
          onPress={() => {
            downloadReport();
          }}
          style={[GlobalStyle.shadow, styles.floatingBtn]}
        >
          <Entypo size={30} name="download" color={Colors.WHITE} />
        </TouchableOpacity>
      )}
      <LoaderComponent visible={loading} />
    </SafeAreaView>
  );
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  component: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "grey",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  arrowButton: {
    paddingHorizontal: 10,
  },
  title: {
    color: "grey",
    fontWeight: "bold",
  },
  week: {
    width: "100%",
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 5,
  },
  weekdayLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  weekdayLabel: {
    flex: 1,
    alignItems: "center",
  },
  weekdayLabelText: {
    color: "grey",
  },
  weekdayNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  weekDayNumber: {
    flex: 1,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDayNumberCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
  },
  weekDayNumberTextToday: {
    color: "white",
  },
  schedule: {
    width: "100%",
  },
  pickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  picker: {
    backgroundColor: "white",
    paddingBottom: 20,
  },
  modal: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  blurredArea: {
    flex: 1,
    opacity: 0.7,
    backgroundColor: "black",
  },
  modalButton: {
    padding: 15,
  },
  modalButtonText: {
    fontSize: 20,
  },
  indicator: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    position: "absolute",
  },
  day: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopColor: "grey",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dayLabel: {
    width: "20%",
    alignItems: "center",
    padding: 10,
    borderRightColor: "grey",
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  monthDateText: {
    fontSize: 20,
  },
  dayText: {},
  allEvents: {
    width: "80%",
  },
  event: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  eventDuration: {
    width: "30%",
    justifyContent: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationDot: {
    width: 4,
    height: 4,
    backgroundColor: "grey",
    marginRight: 5,
    alignSelf: "center",
    borderRadius: 4 / 2,
  },
  durationDotConnector: {
    height: 20,
    borderLeftColor: "grey",
    borderLeftWidth: StyleSheet.hairlineWidth,
    position: "absolute",
    left: 2,
  },
  durationText: {
    color: "grey",
    fontSize: 12,
  },
  eventNote: {
    backgroundColor: "skyblue",
    flex: 1,
    justifyContent: "center",
    paddingLeft: 15,
  },
  lineSeparator: {
    width: "100%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: 4,
    height: 4,
    marginTop: 1,
    alignSelf: "center",
    borderRadius: 4 / 2,
    position: "absolute",
    bottom: "10%",
  },
  eventText: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.WHITE,
  },
  parameterCountView: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-between",
  },
  parameterMarker: {
    height: 25,
    width: 25,
    backgroundColor: "red",
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: "#646464",
  },
  parameterView: {
    flexDirection: "row",
    width: "60%",
    alignItems: "center",
    marginTop: 10,
  },
  parameterListContain: {
    width: "100%",
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 25,
  },
  parameterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  totalHours: {
    color: "#646464",
    fontSize: 16,
    fontWeight: "700",
  },
  totalHoursValue: {
    color: "#252525",
    fontSize: 17,
    fontWeight: "700",
  },
  hoursView: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePicView: {
    marginHorizontal: 25,
    marginVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
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
  newModalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    maxHeight: "50%",
    maxWidth: "100%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: "30%",
    marginLeft: "30%",
    elevation: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    top: 5,

    position: "absolute",
  },
  floatingBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 25,
    right: 25,
    height: 60,
    backgroundColor: "rgba(255,21,107,6)",
    borderRadius: 100,
  },
  employeeName: {
    color: "#252525",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
  },
  DatePickerView: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "column",
  },
  profileView: {
    justifyContent: "center",
    alignItems: "center",
  },
});
