import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { Colors } from "../../../styles";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getTargetParametersEmpDataInsights } from "../../../redux/homeReducer";
import * as AsyncStore from "../../../asyncStore";
import {
  DatePickerComponent,
  DropDownComponant,
  LoaderComponent,
} from "../../../components";
import { DateSelectItem, DropDownSelectionItem } from "../../../pureComponents";
import moment from "moment";
import { Button } from "react-native-paper";
import {
  updateFilterDropDownData,
  getLeadSourceTableList,
  getVehicleModelTableList,
  getEventTableList,
  getTaskTableList,
  getLostDropChartData,
  getTargetParametersData,
  getEmployeesDropDownData,
  getSalesData,
  getSalesComparisonData,
} from "../../../redux/homeReducer";
import {
  showAlertMessage,
  showToast,
  showToastRedAlert,
} from "../../../utils/toast";
import { AppNavigator } from "../../../navigations";
import { DropDown } from "../TargetSettingsScreen/TabScreen/dropDown";
import { AttendanceTopTabNavigatorIdentifiers } from "../../../navigations/attendanceTopTabNavigator";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import RNFetchBlob from "rn-fetch-blob";
import _ from "lodash";
import AnimLoaderComp from "../../../components/AnimLoaderComp";

const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 100) / 2;
const dateFormat = "YYYY-MM-DD";

const AcitivityLoader = () => {
  return (
    <View
      style={{
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimLoaderComp visible={true} />
    </View>
  );
};

const DownloadReportScreen = ({ route, navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();

  const [totalDataObj, setTotalDataObj] = useState([]);
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dropDownData, setDropDownData] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [nameKeyList, setNameKeyList] = useState([]);
  const [userData, setUserData] = useState({
    branchId: "",
    orgId: "",
    employeeId: "",
    employeeName: "",
    primaryDesignation: "",
  });
  const [employeeTitleNameList, setEmloyeeTitleNameList] = useState([]);
  const [employeeDropDownDataLocal, setEmployeeDropDownDataLocal] = useState(
    {}
  );
  const [dropDownFrom, setDropDownFrom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState([]);
  const [dealerCode, setDealerCode] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [selectedDealerCode, setSelectedDealerCode] = useState({});
  const [Designation, setDesignation] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    getAsyncData();
  }, []);

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      clearBtn();
      // setEmloyeeTitleNameList([]);
    });
  }, [navigation]);

  const getAsyncData = async (startDate, endDate) => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setUserData({
        branchId: jsonObj.branchId,
        orgId: jsonObj.orgId,
        employeeId: jsonObj.empId,
        employeeName: jsonObj.empName,
        primaryDesignation: jsonObj.primaryDesignation,
      });
      getDropDown(jsonObj);
    }
  };

  const getDropDown = async (user) => {
    try {
      const response = await client.get(URL.LOCATION_LIST(user.orgId));
      const json = await response.json();
      if (json) {
        setLocation(json);
      }
    } catch (error) {}
  };

  const getDealerDropDown = async (user) => {
    try {
      const response1 = await client.get(URL.DEALER_CODE_LIST1(user.orgId));
      const json1 = await response1.json();
      if (json1) {
        setDealerCode(json1);
      }
    } catch (error) {}
  };

  const getDesignationDropdown = async (item) => {
    try {
      const response = await client.get(
        URL.GET_DESIGNATION(item.orgId, item.id)
      );
      const json = await response.json();
      if (json) {
        const newArr2 = json.map((v) =>
          Object.assign(v, { name: v?.designationName })
        );
        setDesignation(newArr2);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEmployeesDropdown = async (item) => {
    try {
      const response = await client.get(
        URL.GET_EMPLOYEES(item.dmsDesignationId, selectedDealerCode.id)
      );
      const json = await response.json();
      if (json) {
        const newArr2 = json.map((v) =>
          Object.assign(v, { name: v?.empName })
        );
        setEmployees(newArr2);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selector.filter_drop_down_data) {
      let names = [];
      for (let key in selector.filter_drop_down_data) {
        names.push(key);
      }
      setNameKeyList(names);
      setTotalDataObj(selector.filter_drop_down_data);
    }

    const currentDate = moment().format(dateFormat);
    const monthFirstDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .startOf("month")
      .format(dateFormat);
    const monthLastDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .endOf("month")
      .format(dateFormat);
    setFromDate(monthFirstDate);
    setToDate(currentDate);
  }, [selector.filter_drop_down_data]);

  const updateSelectedDate = (date, key) => {
    const formatDate = moment(date).format(dateFormat);
    switch (key) {
      case "FROM_DATE":
        setFromDate(formatDate);
        break;
      case "TO_DATE":
        setToDate(formatDate);
        break;
    }
  };

  const showDatePickerMethod = (key) => {
    setShowDatePicker(true);
    setDatePickerId(key);
  };

  const dropDownItemClicked3 = (item) => {
    switch (item) {
      case "Location":
        setDropDownFrom("Location");
        setDropDownData([...location]);
        setShowDropDownModel(true);

        break;
      case "Dealer Code":
        setDropDownFrom("Dealer Code");
        setDropDownData([...dealerCode]);
        setShowDropDownModel(true);

        break;
      case "Designation":
        setDropDownFrom("Designation");
        setDropDownData([...Designation]);
        setShowDropDownModel(true);

        break;
      case "Employee Name":
        setDropDownFrom("Employee Name");
        setDropDownData([...employees]);
        setShowDropDownModel(true);

        break;
      default:
        break;
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
      AsyncStore.getData(AsyncStore.Keys.ACCESS_TOKEN).then((token) => {
        config(options)
          .fetch("GET", url, {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          })
          .then((res) => {
            RNFetchBlob.android.actionViewIntent(res.path());
            // do some magic here
            setLoader(false);
          })
          .catch((err) => {
            setLoader(false);
          });
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
        mime: "application/xlsx",
        // appendExt: 'xlsx',
        //path: filePath,
        //appendExt: fileExt,
        notification: true,
      };
      AsyncStore.getData(AsyncStore.Keys.ACCESS_TOKEN).then((token) => {
        config(options)
          .fetch("GET", url, {
            Accept: "application/octet-stream",
            "Content-Type": "application/octet-stream",
            Authorization: "Bearer " + token,
          })
          .then((res) => {
            setLoader(false);
            setTimeout(() => {
              // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
              RNFetchBlob.ios.openDocument(res.data); //<---Property to display downloaded file on documaent viewer
              // Alert.alert(CONSTANTS.APP_NAME,'File download successfully');
            }, 300);
          })
          .catch((errorMessage) => {
            setLoader(false);
          });
      });
    }
  };

  const clearBtn = () => {
    setSelectedLocation({});
    setSelectedLocation({});
    setDealerCode([]);
    setSelectedDealerCode({});
    setSelectedDesignation([]);
    setDesignation([]);
    setSelectedEmployeeName([]);
    setEmployees([]);
  };

  const validation = () => {
    let error = false;
    if (_.isEmpty(selectedLocation)) {
      showToastRedAlert("Please Select a Location");
      error = true;
      return true;
    }
    if (_.isEmpty(selectedDealerCode)) {
      showToastRedAlert("Please Select a Dealer Code");
      error = true;
      return true;
    }
    if (_.isEmpty(selectedDesignation)) {
      showToastRedAlert("Please Select a Designation");
      error = true;
      return true;
    }
    if (_.isEmpty(selectedEmployeeName)) {
      showToastRedAlert("Please Select a Employee Name");
      error = true;
      return true;
    }
    if (!error) {
      return true;
    } else {
      return false;
    }
  };

  const submit = async () => {
    try {
      validation();
      setLoader(true);
      let empIds = [];
      for (let i = 0; i < selectedEmployeeName.length; i++) {
        const element = selectedEmployeeName[i];
        if (element?.selected == true) {
          empIds.push(element.empId);
        }
      }
      let payload = {
        fromDate: fromDate,
        toDate: toDate,
        orgId: userData.orgId,
        userId: userData.employeeId,
        dealerCodes: [selectedDealerCode.id],
        empIds: empIds,
      };
      const response = await client.post(URL.GET_ATTENDANCE_REPORT(), payload);
      const json = await response.json();
      console.log(json,payload);
      if (json.downloadUrl) {
        downloadInLocal(URL.GET_DOWNLOAD_URL(json.downloadUrl));
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  function formatName(list) {
    let names = "";
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        names += element.name + ", ";
      }
      return names;
    } else {
      return names;
    }
  }

  function selectedDropDown(item) {
    if (dropDownFrom === "Location") {
      setDealerCode([]);
      setSelectedDealerCode({});
      setSelectedDesignation({});
      setDesignation([]);
      setSelectedEmployeeName([]);
      setEmployees([]);
      setSelectedLocation(item);
      getDealerDropDown(item);
    } else if (dropDownFrom === "Dealer Code") {
      setSelectedDesignation({});
      setDesignation([]);
      setSelectedEmployeeName([]);
      setEmployees([]);
      setSelectedDealerCode(item);
      getDesignationDropdown(item);
    } else if (dropDownFrom === "Designation") {
      setSelectedEmployeeName([]);
      setEmployees([]);
      setSelectedDesignation(item);
      getEmployeesDropdown(item);
    } else if (dropDownFrom === "Employee Name") {
      setSelectedEmployeeName(item);
      setEmployees(item);
    }
    setShowDropDownModel(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <DropDown
        visible={showDropDownModel}
        multiple={dropDownFrom === "Employee Name" ? true : false}
        headerTitle={"Select"}
        data={dropDownData}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          selectedDropDown(item);
        }}
      />
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
        maximumDate={new Date()}
        onChange={(event, selectedDate) => {
          if (Platform.OS === "android") {
            if (selectedDate) {
              updateSelectedDate(selectedDate, datePickerId);
            }
          } else {
            updateSelectedDate(selectedDate, datePickerId);
          }
          setShowDatePicker(false);
        }}
        onRequestClose={() => setShowDatePicker(false)}
      />

      <View
        style={{
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: Colors.WHITE,
        }}
      >
        <FlatList
          data={[1, 2]}
          keyExtractor={(item, index) => "MAIN" + index.toString()}
          renderItem={({ item, index }) => {
            if (index === 0) {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    // justifyContent: "space-evenly",
                    paddingBottom: 5,
                    borderColor: Colors.BORDER_COLOR,
                    borderWidth: 1,
                  }}
                >
                  <View style={{ width: "48%", alignSelf: "flex-start" }}>
                    <DateSelectItem
                      label={"Select Date"}
                      value={fromDate}
                      onPress={() => showDatePickerMethod("FROM_DATE")}
                    />
                  </View>

                  <View style={{ width: "48%" }}>
                    <DateSelectItem
                      label={"To Date"}
                      value={toDate}
                      onPress={() => showDatePickerMethod("TO_DATE")}
                    />
                  </View>
                </View>
              );
            } else if (index === 1) {
              // todo country list
              return (
                <View>
                  <View
                    style={{ borderColor: Colors.BORDER_COLOR, borderWidth: 1 }}
                  >
                    <View>
                      <DropDownSelectionItem
                        label={"Location"}
                        value={selectedLocation?.name}
                        onPress={() => dropDownItemClicked3("Location")}
                        takeMinHeight={true}
                        // disabled={disabletemp}
                      />
                    </View>
                    <View>
                      <DropDownSelectionItem
                        label={"Dealer Code"}
                        value={selectedDealerCode?.name}
                        onPress={() => dropDownItemClicked3("Dealer Code")}
                        takeMinHeight={true}
                        // disabled={disabletemp}
                      />
                    </View>
                    <View>
                      <DropDownSelectionItem
                        label={"Designation"}
                        value={selectedDesignation?.name}
                        onPress={() => dropDownItemClicked3("Designation")}
                        takeMinHeight={true}
                        // disabled={disabletemp}
                      />
                    </View>
                    <View>
                      <DropDownSelectionItem
                        label={"Employee Name"}
                        value={formatName(selectedEmployeeName)}
                        onPress={() => dropDownItemClicked3("Employee Name")}
                        takeMinHeight={true}
                        // disabled={disabletemp}
                      />
                    </View>
                  </View>
                  <View style={styles.submitBtnBckVw}>
                    <Button
                      labelStyle={{
                        color: Colors.RED,
                        textTransform: "none",
                      }}
                      style={{ width: buttonWidth }}
                      mode="outlined"
                      onPress={clearBtn}
                    >
                      Clear
                    </Button>
                    <Button
                      labelStyle={{
                        color: Colors.WHITE,
                        textTransform: "none",
                      }}
                      // style={{ width: buttonWidth }}
                      contentStyle={{ backgroundColor: Colors.RED }}
                      // mode="contained"
                      // onPress={() => downloadReport}
                      onPress={() => submit()}
                    >
                      Download Report
                    </Button>
                  </View>
                </View>
              );
            }
          }}
        />
      </View>
      <LoaderComponent visible={loader} onRequestClose={() => {}} />
    </SafeAreaView>
  );
};

export default DownloadReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  view3: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  submitBtnBckVw: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
