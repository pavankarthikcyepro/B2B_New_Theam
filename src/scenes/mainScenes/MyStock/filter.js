import React, { useState, useEffect, useCallback } from "react";
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
import {
  getTargetParametersEmpDataInsights,
  updateTheTeamAttendanceFilter,
  updateTheTeamAttendanceFilterDate,
} from "../../../redux/homeReducer";
import * as AsyncStore from "../../../asyncStore";
import { DatePickerComponent, DropDownComponant } from "../../../components";
import {
  DateSelectItem,
  DropDownSelectionItem,
  NumberInput,
} from "../../../pureComponents";
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
import { MyStockTopTabNavigatorIdentifiers } from "../../../navigations/myStockNavigator";
import {
  updateAgingFrom,
  updateAgingTo,
  updateLocation,
  updateSelectedDealerCode,
} from "../../../redux/myStockReducer";
import _ from "lodash";
import URL from "../../../networking/endpoints";
import { client } from "../../../networking/client";
import { Dropdown } from "react-native-element-dropdown";

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

const MyStockFilter = ({ route, navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const stockSelector = useSelector((state) => state.myStockReducer);
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
    hrmsRole:"",
  });
  const [employeeTitleNameList, setEmloyeeTitleNameList] = useState([]);
  const [employeeDropDownDataLocal, setEmployeeDropDownDataLocal] = useState(
    {}
  );
  const [dropDownFrom, setDropDownFrom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState([]);
  const [stockyard, setStockyard] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [selectedStockyard, setSelectedStockyard] = useState({});
  useEffect(() => {
    getAsyncData();
  }, []);

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    try {
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const response = await client.get(
          URL.GET_INVENTORY_BY_STOCK_YARD_BRANCHES(jsonObj.orgId)
        );
        const json = await response.json();
        if (json.length > 0) {
          setLocation(json);
          if (stockSelector.dealerCode.stockyardName) {
            setSelectedLocation(stockSelector.location);
            setStockyard(stockSelector.location.stockyardBranches);
            setSelectedStockyard(stockSelector.dealerCode);
          }
        }
      }
    } catch (error) {}
  };

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
        hrmsRole: jsonObj.hrmsRole,
      });
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
    setFromDate("0");
    setToDate("0");
  }, [selector.filter_drop_down_data]);

  useEffect(() => {
    if (!_.isEmpty(totalDataObj) && nameKeyList.length > 0) {
      // Added();
      addTodo();
    }
  }, [nameKeyList]);

  const addTodo = useCallback(() => {
    Added();
  }, [nameKeyList]);

  function Added() {
    if (!_.isEmpty(totalDataObj) && nameKeyList) {
      if (!_.isEmpty(stockSelector.dealerCode)) {
        updateSelectedItems(stockSelector.dealerCode, 4);
        setFromDate(stockSelector.agingFrom);
        setToDate(stockSelector.agingTo);
      }
    }
  }

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
        // newData.push(id);
        for (let j = 0; j < jsonObj.branchs.length; j++) {
          const id2 = jsonObj.branchs[j];
          if (id2.locationId.toString() === id.parentId.toString()) {
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
    // index == 4 && submitBtnClicked(totalDataObjLocal);
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

  const clearBtnClicked2 = () => {
    setSelectedLocation({});
    setSelectedStockyard({});
    setFromDate("0");
    setToDate("0");
    dispatch(updateLocation({}));
    dispatch(updateSelectedDealerCode({}));
    dispatch(updateAgingFrom(null));
    dispatch(updateAgingTo(null));
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
    setFromDate("0");
    setToDate("0");
    dispatch(updateSelectedDealerCode({}));
    dispatch(updateAgingFrom(null));
    dispatch(updateAgingTo(null));
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
    let selectedDealerCode = totalDataObj["Dealer Code"].sublevels.filter(
      (i) => i.selected == true
    )[0];
    if (!selectedDealerCode) {
      showToast("Please select any Dealer Code");
      return;
    }
    if (selectedIds.length > 0) {
      setIsLoading(true);
      dispatch(updateSelectedDealerCode(selectedDealerCode));
      dispatch(updateAgingFrom(fromDate));
      dispatch(updateAgingTo(toDate));
      navigation.goBack();
      //   getDashboadTableDataFromServer(selectedIds, "LEVEL");
    } else {
      showToast("Please select any value");
    }
  };

  const submitBtnClicked2 = (initialData) => {
    if (_.isEmpty(selectedLocation)) {
      showToast("Please select any Location Code");
      return;
    }
    if (_.isEmpty(selectedStockyard)) {
      showToast("Please select any Stock Yard Code");
      return;
    }
    if (!_.isEmpty(selectedStockyard)) {
      setIsLoading(true);
      dispatch(updateLocation(selectedLocation));
      dispatch(updateSelectedDealerCode(selectedStockyard));
      dispatch(updateAgingFrom(fromDate));
      dispatch(updateAgingTo(toDate));
      navigation.goBack();
      //   getDashboadTableDataFromServer(selectedIds, "LEVEL");
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
      .then(() => {
        // Promise.all([
        // //   dispatch(getLeadSourceTableList(payload)),
        // //   dispatch(getVehicleModelTableList(payload)),
        // //   dispatch(getEventTableList(payload)),
        // //   dispatch(getLostDropChartData(payload)),
        // //   dispatch(updateFilterDropDownData(totalDataObj)),
        //   // // Table Data
        // //   dispatch(getTaskTableList(payload2)),
        // //   dispatch(getSalesData(payload2)),
        // //   dispatch(getSalesComparisonData(payload2)),
        //   // // Target Params Data
        // //   dispatch(getTargetParametersData(payload2)),
        // //   dispatch(getTargetParametersEmpDataInsights(payload2)), // Added to filter an Home Screen's INSIGHT
        // ])
        //   .then(() => {})
        //   .catch(() => {
        //     setIsLoading(false);
        //   });
      })
      .catch(() => {
        setIsLoading(false);
      });
    if (from == "EMPLOYEE") {
      if (true) {
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.monthlyTarget, {
          params: { from: "Filter" },
        });
      } else {
        navigation.goBack();
      }
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
    // return
    navigation.navigate("MONTHLY_TARGET_SCREEN", {
      params: {
        from: "Filter",
        selectedID: selectedID[0],
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

  return (
    <SafeAreaView style={styles.container}>
      <DropDown
        visible={showDropDownModel}
        multiple={false}
        headerTitle={"Select"}
        data={dropDownData}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (dropDownFrom === "ORG_TABLE") {
            updateSelectedItems(item, selectedItemIndex);
          } else {
            updateSelectedItemsForEmployeeDropDown(item, selectedItemIndex);
          }
          setShowDropDownModel(false);
        }}
      />
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        value={new Date(Date.now())}
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
          data={employeeTitleNameList.length > 0 ? [1, 2] : [1, 2]}
          keyExtractor={(item, index) => "MAIN" + index.toString()}
          renderItem={({ item, index }) => {
            if (index === 0) {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    paddingBottom: 5,
                    borderColor: Colors.BORDER_COLOR,
                    borderWidth: 1,
                  }}
                >
                  <View style={{ width: "48%" }}>
                    <NumberInput
                      label={"Aging From"}
                      value={fromDate}
                      onPress={() => {
                        showDatePickerMethod("FROM_DATE");
                      }}
                      onChange={(x) => {
                        setFromDate(x);
                      }}
                    />
                  </View>

                  <View style={{ width: "48%" }}>
                    <NumberInput
                      label={"Aging To"}
                      value={toDate}
                      onPress={() => {
                        showDatePickerMethod("TO_DATE");
                      }}
                      onChange={(x) => {
                        setToDate(x);
                      }}
                    />
                  </View>
                </View>
              );
            } else if (index === 1) {
              return (
                <View>
                  <View
                    style={{ borderColor: Colors.BORDER_COLOR, borderWidth: 1 }}
                  >
                    {userData.hrmsRole === "Admin" ? (
                      <>
                        <Dropdown
                          label={"Location"}
                          visible={true}
                          onChange={(item) => {
                            setSelectedLocation(item);
                            setStockyard(item.stockyardBranches);
                          }}
                          data={location || []}
                          value={selectedLocation ? selectedLocation.name : ""}
                          labelField={"name"}
                          valueField={"name"}
                          placeholder={"Location"}
                          style={[styles.dropdownElement]}
                          placeholderStyle={{
                            color: Colors.GRAY,
                          }}
                        />
                        <Dropdown
                          label={"Stock Yard"}
                          visible={true}
                          underLine
                          onChange={(item) => {
                            setSelectedStockyard(item);
                            // setSelectedLocation(item);
                          }}
                          data={stockyard || []}
                          value={
                            selectedStockyard
                              ? selectedStockyard.stockyardName
                              : ""
                          }
                          labelField={"stockyardName"}
                          valueField={"stockyardName"}
                          placeholder={"Stock Yard"}
                          style={[styles.dropdownElement]}
                          placeholderStyle={{
                            color: Colors.GRAY,
                          }}
                        />
                      </>
                    ) : (
                      <FlatList
                        data={nameKeyList}
                        listKey="ORG_TABLE"
                        scrollEnabled={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          const data = totalDataObj[item].sublevels;
                          let selectedNames = "";
                          data.forEach((obj, index) => {
                            if (
                              obj.selected != undefined &&
                              obj.selected == true
                            ) {
                              selectedNames += obj.name + ", ";
                            }
                          });

                          if (selectedNames.length > 0) {
                            selectedNames = selectedNames.slice(
                              0,
                              selectedNames.length - 1
                            );
                          }
                          return (
                            <View>
                              <DropDownSelectionItem
                                label={item}
                                value={selectedNames}
                                onPress={() => dropDownItemClicked(index)}
                                takeMinHeight={true}
                              />
                            </View>
                          );
                        }}
                      />
                    )}
                  </View>
                  <View style={styles.submitBtnBckVw}>
                    <Button
                      labelStyle={{
                        color: Colors.RED,
                        textTransform: "none",
                      }}
                      style={{ width: buttonWidth }}
                      mode="outlined"
                      onPress={
                        userData.hrmsRole === "Admin"
                          ? clearBtnClicked2
                          : clearBtnClicked
                      }
                    >
                      Clear
                    </Button>
                    <Button
                      labelStyle={{
                        color: Colors.WHITE,
                        textTransform: "none",
                      }}
                      style={{ width: buttonWidth }}
                      contentStyle={{ backgroundColor: Colors.BLACK }}
                      mode="contained"
                      onPress={() =>
                        userData.hrmsRole === "Admin"
                          ? submitBtnClicked2(null)
                          : submitBtnClicked(null)
                      }
                    >
                      Submit
                    </Button>
                  </View>
                </View>
              );
            } else if (index === 2) {
              return (
                <View>
                  {employeeTitleNameList.length > 0 && (
                    <View>
                      <View
                        style={{
                          borderColor: Colors.BORDER_COLOR,
                          borderWidth: 1,
                        }}
                      >
                        <FlatList
                          data={employeeTitleNameList}
                          listKey="EMPLOYEE_TABLE"
                          keyExtractor={(item, index) =>
                            "EMP_" + index.toString()
                          }
                          scrollEnabled={false}
                          renderItem={({ item, index }) => {
                            const data = employeeDropDownDataLocal[item];
                            let selectedNames = "";
                            data.forEach((obj, index) => {
                              if (
                                obj.selected != undefined &&
                                obj.selected == true
                              ) {
                                selectedNames += obj.name + ", ";
                              }
                            });

                            if (selectedNames.length > 0) {
                              selectedNames = selectedNames.slice(
                                0,
                                selectedNames.length - 1
                              );
                            }

                            return (
                              <View>
                                <DropDownSelectionItem
                                  label={item}
                                  value={selectedNames}
                                  onPress={() => dropDownItemClicked2(index)}
                                  takeMinHeight={true}
                                />
                              </View>
                            );
                          }}
                        />
                      </View>
                      <View style={styles.submitBtnBckVw}>
                        <Button
                          labelStyle={{
                            color: Colors.RED,
                            textTransform: "none",
                          }}
                          style={{ width: buttonWidth }}
                          mode="outlined"
                          onPress={clearBtnForEmployeeData}
                        >
                          Clear
                        </Button>
                        <Button
                          labelStyle={{
                            color: Colors.WHITE,
                            textTransform: "none",
                          }}
                          style={{ width: buttonWidth }}
                          contentStyle={{ backgroundColor: Colors.BLACK }}
                          mode="contained"
                          onPress={submitBtnForEmployeeData}
                        >
                          Submit
                        </Button>
                      </View>
                    </View>
                  )}
                </View>
              );
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MyStockFilter;

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
  view1: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 5,
    borderColor: Colors.BORDER_COLOR,
    borderWidth: 1,
  },
  dropdownElement: {
    height: 50,
    width: "100%",
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: Colors.WHITE,
    marginTop: 10,
    borderRadius: 6,
    padding: 15,
    color: Colors.BLACK,
    borderBottomColor: Colors.BLACK,
    borderBottomWidth: 1,
  },
});
