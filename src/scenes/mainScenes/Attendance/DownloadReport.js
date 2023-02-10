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
  ActivityIndicator,
} from "react-native";
import { Colors } from "../../../styles";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getTargetParametersEmpDataInsights } from "../../../redux/homeReducer";
import * as AsyncStore from "../../../asyncStore";
import { DatePickerComponent, DropDownComponant } from "../../../components";
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
import { showAlertMessage, showToast } from "../../../utils/toast";
import { AppNavigator } from "../../../navigations";
import { DropDown } from "../TargetSettingsScreen/TabScreen/dropDown";
import { AttendanceTopTabNavigatorIdentifiers } from "../../../navigations/attendanceTopTabNavigator";
import { client } from "../../../networking/client";
import URL from "../../../networking/endpoints";
import RNFetchBlob from "rn-fetch-blob";

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
      <ActivityIndicator size={"small"} color={Colors.GRAY} />
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
  const [selectedDesignation, setSelectedDesignation] = useState({});
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState({});

  useEffect(() => {
    getAsyncData();
  }, []);

  useLayoutEffect(() => {
    navigation.addListener("focus", () => {
      setEmloyeeTitleNameList([]);
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
      // const response1 = await client.get(URL.DEALER_CODE_LIST1(user.orgId));
      const json = await response.json();
      // const json1 = await response1.json();
      if (json) {
        setLocation(json);
        // setDealerCode(json1);
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
        setDesignation(json);
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
        setEmployees(json);
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
      console.log(names);
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

  //   useEffect(() => {
  //     if (nameKeyList.length > 0) {
  //       dropDownItemClicked(4, true);
  //     }
  //   }, [nameKeyList, userData]);

  const dropDownItemClicked = async (index, initalCall = false) => {
    const topRowSelectedIds = [];
    if (index > 0) {
      const topRowData = totalDataObj[nameKeyList[index - 1]].sublevels;
      topRowData.forEach((item) => {
        if (item.selected != undefined && item.selected === true) {
          topRowSelectedIds.push(Number(item.id));
        }
      });
    }

    let data = [];
    if (topRowSelectedIds.length > 0) {
      const subLevels = totalDataObj[nameKeyList[index]].sublevels;
      subLevels.forEach((subItem) => {
        const obj = { ...subItem };
        obj.selected = false;
        if (topRowSelectedIds.includes(Number(subItem.parentId))) {
          data.push(obj);
        }
      });
    } else {
      data = totalDataObj[nameKeyList[index]].sublevels;
    }
    let newData = [];
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      for (let i = 0; i < data.length; i++) {
        const id = data[i];
        for (let j = 0; j < jsonObj.branchs.length; j++) {
          const id2 = jsonObj.branchs[j];
          if (id2.branchName === id.name) {
            newData.push(id);
          }
        }
      }
    }

    if (index === 4) {
      setDropDownData([...newData]);
      if (initalCall) {
        let updatedMultipleData = [...newData];
        const obj = { ...updatedMultipleData[0] };
        if (obj.selected != undefined) {
          obj.selected = !obj.selected;
        } else {
          obj.selected = true;
        }
        updatedMultipleData[0] = obj;
        updateSelectedItems(updatedMultipleData, index, true);
      } else {
        // updateSelectedItemsForEmployeeDropDown(newData, index);
      }
      //   submitBtnClicked(null)
    } else {
      setDropDownData([...data]);
    }
    setSelectedItemIndex(index);
    !initalCall && setShowDropDownModel(true);
    setDropDownFrom("ORG_TABLE");
  };

  const dropDownItemClicked2 = (index) => {
    // const topRowSelectedIds = [];
    // if (index > 0) {
    //     const topRowData = employeeDropDownDataLocal[employeeTitleNameList[index]];
    //     topRowData.forEach((item) => {
    //         if (item.selected != undefined && item.selected === true) {
    //             topRowSelectedIds.push(Number(item.id));
    //         }
    //     })
    // }
    const data = employeeDropDownDataLocal[employeeTitleNameList[index]];
    let newIndex = index == 0 ? 0 : index - 1;
    let newItem = Object.keys(employeeDropDownDataLocal)[newIndex];
    const tempData = employeeDropDownDataLocal[newItem];
    const isSelected = tempData.filter((e) => e.selected == true);
    let newArr = [];
    if (isSelected[0]?.id && index !== 0) {
      const newList = data.filter((e) => e.parentId == isSelected[0]?.id);
      newArr = [...newList];
    }
    let tempArr = index == 0 ? data : newArr;

    setDropDownData([...tempArr]);
    setSelectedItemIndex(index);
    setShowDropDownModel(true);
    setDropDownFrom("EMPLOYEE_TABLE");
  };

  const updateSelectedItems = (data, index, initalCall = false) => {
    const totalDataObjLocal = { ...totalDataObj };
    if (index > 0) {
      let selectedParendIds = [];
      let unselectedParentIds = [];
      selectedParendIds.push(Number(data.parentId));
      // data.forEach((item) => {
      //   if (item.selected != undefined && item.selected == true) {
      //     selectedParendIds.push(Number(item.parentId));
      //   } else {
      //     unselectedParentIds.push(Number(item.parentId));
      //   }
      // });

      let localIndex = index - 1;

      for (localIndex; localIndex >= 0; localIndex--) {
        let selectedNewParentIds = [];
        let unselectedNewParentIds = [];

        let key = nameKeyList[localIndex];
        const dataArray = totalDataObjLocal[key].sublevels;

        if (dataArray.length > 0) {
          const newDataArry = dataArray.map((subItem, index) => {
            const obj = { ...subItem };
            if (selectedParendIds.includes(Number(obj.id))) {
              obj.selected = true;
              selectedNewParentIds.push(Number(obj.parentId));
            } else if (unselectedParentIds.includes(Number(obj.id))) {
              if (obj.selected == undefined) {
                obj.selected = false;
              }
              unselectedNewParentIds.push(Number(obj.parentId));
            }
            return obj;
          });
          const newOBJ = {
            sublevels: newDataArry,
          };
          totalDataObjLocal[key] = newOBJ;
        }
        selectedParendIds = selectedNewParentIds;
        unselectedParentIds = unselectedNewParentIds;
      }
    }

    let localIndex2 = index + 1;
    for (localIndex2; localIndex2 < nameKeyList.length; localIndex2++) {
      let key = nameKeyList[localIndex2];
      const dataArray = totalDataObjLocal[key].sublevels;
      if (dataArray.length > 0) {
        const newDataArry = dataArray.map((subItem, index) => {
          const obj = { ...subItem };
          obj.selected = false;
          return obj;
        });
        const newOBJ = {
          sublevels: newDataArry,
        };
        totalDataObjLocal[key] = newOBJ;
      }
    }

    let key = nameKeyList[index];
    var newArr = totalDataObjLocal[key].sublevels;
    const result = newArr.map((file) => {
      return { ...file, selected: false };
    });
    let objIndex = result.findIndex((obj) => obj.id == data.id);
    for (let i = 0; i < result.length; i++) {
      if (objIndex === i) {
        result[i].selected = true;
      } else {
        result[i].selected = false;
      }
    }
    const newOBJ = {
      sublevels: result,
    };
    totalDataObjLocal[key] = newOBJ;
    setTotalDataObj({ ...totalDataObjLocal });
    index == 4 && submitBtnClicked(totalDataObjLocal);
  };

  const updateSelectedItemsForEmployeeDropDown = (data, index) => {
    let key = employeeTitleNameList[index];
    const newTotalDataObjLocal = { ...employeeDropDownDataLocal };
    let objIndex = newTotalDataObjLocal[key].findIndex(
      (obj) => obj.id == data.id
    );
    for (let i = 0; i < newTotalDataObjLocal[key].length; i++) {
      if (objIndex === i) {
        newTotalDataObjLocal[key][i].selected = true;
      } else {
        newTotalDataObjLocal[key][i].selected = false;
      }
    }
    setEmployeeDropDownDataLocal({ ...newTotalDataObjLocal });
  };

  const clearBtnClicked = () => {
    const totalDataObjLocal = { ...totalDataObj };
    let i = 0;
    for (i; i < nameKeyList.length; i++) {
      let key = nameKeyList[i];
      const dataArray = totalDataObjLocal[key].sublevels;
      if (dataArray.length > 0) {
        const newDataArry = dataArray.map((subItem, index) => {
          const obj = { ...subItem };
          obj.selected = false;
          return obj;
        });
        const newOBJ = {
          sublevels: newDataArry,
        };
        totalDataObjLocal[key] = newOBJ;
      }
    }
    setTotalDataObj({ ...totalDataObjLocal });
  };

  const submitBtnClicked = (initialData) => {
    let i = 0;
    const selectedIds = [];
    for (i; i < nameKeyList.length; i++) {
      let key = nameKeyList[i];
      const dataArray = initialData
        ? initialData[key].sublevels
        : totalDataObj[key].sublevels;
      if (dataArray.length > 0) {
        dataArray.forEach((item, index) => {
          if (item.selected != undefined && item.selected == true) {
            selectedIds.push(item.id);
          }
        });
      }
    }
    if (selectedIds.length > 0) {
      setIsLoading(true);
      getDashboadTableDataFromServer(selectedIds, "LEVEL");
    } else {
      showToast("Please select any value");
    }
  };

  const getDashboadTableDataFromServer = (selectedIds, from) => {
    const payload = {
      startDate: fromDate,
      endDate: toDate,
      loggedInEmpId: userData.employeeId,
    };
    if (from == "LEVEL") {
      payload["levelSelected"] = selectedIds;
    } else {
      payload["empSelected"] = selectedIds;
    }

    const payload2 = {
      ...payload,
      pageNo: 0,
      size: 5,
    };

    const payload1 = {
      orgId: userData.orgId,
      empId: userData.employeeId,
      selectedIds: selectedIds,
    };

    Promise.all([dispatch(getEmployeesDropDownData(payload1))])
      .then(() => {})
      .catch(() => {
        setIsLoading(false);
      });
    if (from == "EMPLOYEE") {
      // if (true) {
      //   navigation.navigate(AppNavigator.DrawerStackIdentifiers.monthlyTarget, {
      //     params: { from: "Filter" },
      //   });
      // } else {
      //   navigation.goBack();
      // }
      // navigation.navigate(AppNavigator.TabStackIdentifiers.home, { screen: "Home", params: { from: 'Filter' }, })
    } else {
      // navigation.goBack(); // NEED TO COMMENT FOR ASSOCIATE FILTER
    }
  };

  useEffect(() => {
    if (selector.employees_drop_down_data) {
      let names = [];
      let newDataObj = {};
      for (let key in selector.employees_drop_down_data) {
        const arrayData = selector.employees_drop_down_data[key];
        if (arrayData.length != 0) {
          names.push(key);
        }
        const newArray = [];
        if (arrayData.length > 0) {
          arrayData.forEach((element) => {
            newArray.push({
              ...element,
              id: element.code,
              selected: false,
            });
          });
        }
        newDataObj[key] = newArray;
      }
      setName(names, newDataObj);
    }
  }, [selector.employees_drop_down_data]);

  const setName = useCallback(
    (names, newDataObj) => {
      function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }
      if (!isEmpty(names) && !isEmpty(newDataObj)) {
        setEmloyeeTitleNameList(names);
        setEmployeeDropDownDataLocal(newDataObj);
        setIsLoading(false);
      }
    },
    [employeeDropDownDataLocal, employeeTitleNameList]
  );

  const clearBtnForEmployeeData = () => {
    let newDataObj = {};
    for (let key in employeeDropDownDataLocal) {
      const arrayData = employeeDropDownDataLocal[key];
      const newArray = [];
      if (arrayData.length > 0) {
        arrayData.forEach((element) => {
          newArray.push({
            ...element,
            selected: false,
          });
        });
      }
      newDataObj[key] = newArray;
    }
    setEmployeeDropDownDataLocal(newDataObj);
  };

  const submitBtnForEmployeeData = () => {
    let selectedIds = [];
    for (let key in employeeDropDownDataLocal) {
      const arrayData = employeeDropDownDataLocal[key];
      if (arrayData.length != 0) {
        arrayData.forEach((element) => {
          if (element.selected === true) {
            selectedIds.push(element.code);
          }
        });
      }
    }

    let x =
      employeeDropDownDataLocal[
        Object.keys(employeeDropDownDataLocal)[
          Object.keys(employeeDropDownDataLocal).length - 1
        ]
      ];
    let selectedID = x.filter((e) => e.selected == true);

    let orgID = totalDataObj["Dealer Code"].sublevels.filter(
      (e) => e.selected == true
    );
    // return
    // navigation.goBack()
    navigation.navigate(AttendanceTopTabNavigatorIdentifiers.dashboard, {
      params: {
        from: "Filter",
        selectedID: selectedIds[selectedIds.length - 1],
        orgId: orgID[0]?.orgId,
        fromDate: fromDate,
        toDate: toDate,
      },
    });
    // let selectedID = x[x-1];
    // return;
    // if (selectedIds.length > 0) {
    //   getDashboadTableDataFromServer(selectedIds, "EMPLOYEE");
    // } else {
    //   showToast("Please select any value");
    // }
  };

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

  const downloadReport = async () => {
    try {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const payload = {
          orgId: jsonObj.orgId,
          fromDate: fromDate,
          toDate: toDate,
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
          })
          .catch((err) => {
            console.error(err);
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
      });
    }
  };

  const clearBtn = () => {
    setSelectedDealerCode({});
    setSelectedLocation({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <DropDown
        visible={showDropDownModel}
        multiple={false}
        headerTitle={"Select"}
        data={dropDownData}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (dropDownFrom === "Location") {
            setDealerCode([]);
            setSelectedDealerCode({});
            setSelectedDesignation({});
            setDesignation([]);
            setSelectedEmployeeName({});
            setEmployees([]);
            setSelectedLocation(item);
            getDealerDropDown(item);
          } else if (dropDownFrom === "Dealer Code") {
            setSelectedDesignation({});
            setDesignation([]);
            setSelectedEmployeeName({});
            setEmployees([]);
            setSelectedDealerCode(item);
            getDesignationDropdown(item);
          } else if (dropDownFrom === "Designation") {
            setSelectedEmployeeName({});
            setEmployees([]);
            setSelectedDesignation(item);
            getEmployeesDropdown(item);
          } else if (dropDownFrom === "Employee Name") {
            setSelectedEmployeeName(item);
          }
          setShowDropDownModel(false);
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
          data={employeeTitleNameList.length > 0 ? [1, 2, 3] : [1, 2]}
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
                        value={selectedDesignation?.designationName}
                        onPress={() => dropDownItemClicked3("Designation")}
                        takeMinHeight={true}
                        // disabled={disabletemp}
                      />
                    </View>
                    <View>
                      <DropDownSelectionItem
                        label={"Employee Name"}
                        value={selectedEmployeeName?.empName}
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
                      onPress={() => downloadReport}
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
