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
} from "react-native";
import { Colors } from "../../../../styles";
import { IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getTargetParametersEmpDataInsights } from "../../../../redux/homeReducer";
import * as AsyncStore from "../../../../asyncStore";
import { DatePickerComponent, DropDownComponant } from "../../../../components";
import {
  DateSelectItem,
  DropDownSelectionItem,
} from "../../../../pureComponents";
import moment from "moment";
 import _ from "lodash";
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
} from "../../../../redux/homeReducer";
import { showAlertMessage, showToast } from "../../../../utils/toast";
import { AppNavigator } from "../../../../navigations";
import { DropDown } from "./dropDown";
import {
  saveFilterPayload,
  updateDealerFilterData,
  updateFilterSelectedData,
} from "../../../../redux/targetSettingsReducer";
import { useIsFocused } from "@react-navigation/native";
import AnimLoaderComp from "../../../../components/AnimLoaderComp";

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

const FilterTargetScreen = ({ route, navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const targetSelector = useSelector((state) => state.targetSettingsReducer);
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
  const isFocused = useIsFocused();
  useEffect(() => {
    getAsyncData();
  }, []);

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
    setToDate(monthLastDate);
  }, [selector.filter_drop_down_data]);

  useEffect(() => {
    // navigation.addListener("focus", () => {
    // if (!isEmpty(targetSelector.filterSelectedData)) {
    //   const temp = { ...targetSelector.filterSelectedData };
    //   setEmployeeDropDownDataLocal(temp);
    // }
    // });
  }, [isFocused]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      if (!isEmpty(targetSelector.dealerFilter)) {
        const temp = { ...targetSelector.dealerFilter };
        setTotalDataObj(temp);
      }
    });
  }, [navigation]);
  //   useEffect(() => {
  //     if (nameKeyList.length > 0) {
  //       dropDownItemClicked(4, true);
  //     }
  //   }, [nameKeyList, userData]);
  function isEmpty(obj = {}) {
    return Object.keys(obj).length === 0;
  }

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
    // if (tempArr.length == 0) {
    //   const data = employeeDropDownDataLocal[employeeTitleNameList[index]];
    //   let newIndex = index == 0 ? 0 : index - 2;

    //   let newItem = Object.keys(employeeDropDownDataLocal)[newIndex];
    //   const tempData = employeeDropDownDataLocal[newItem];
    //   const isSelected = tempData?.filter((e) => e.selected == true);
    //   let newArr = [];
    //   if (isSelected[0]?.id && index !== 0) {
    //     const newList = data.filter((e) => e.parentId == isSelected[0]?.id);
    //     newArr = [...newList];
    //   }
    //   let tempArr = index == 0 ? data : newArr;
    //   setDropDownData([...tempArr]);
    // } else {
      setDropDownData([...tempArr]);
    // }
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
    dispatch(updateDealerFilterData({ ...totalDataObjLocal }));
    setTotalDataObj({ ...totalDataObjLocal });
    index == 4 && submitBtnClicked(totalDataObjLocal);
  };

  const updateSelectedItemsForEmployeeDropDown = (data, index, index1) => {
    let key = employeeTitleNameList[index];
    const newTotalDataObjLocal = Object.assign(employeeDropDownDataLocal);
    let objIndex = newTotalDataObjLocal[key].findIndex(
      (obj) => obj.id == data.id
    );
    const a = newTotalDataObjLocal[key].map((data, index) =>
      index === objIndex
        ? { ...newTotalDataObjLocal[key][index], selected: true }
        : { ...newTotalDataObjLocal[key][index], selected: false }
    );
    newTotalDataObjLocal[key] = a;
    setEmployeeDropDownDataLocal(newTotalDataObjLocal);
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
        if (!isEmpty(targetSelector.filterSelectedData)) {
          const temp = { ...targetSelector.filterSelectedData };
          setEmployeeDropDownDataLocal(temp);
        } else {
          setEmployeeDropDownDataLocal(newDataObj);
        }
        setIsLoading(false);
      }
    },
    [employeeDropDownDataLocal, employeeTitleNameList]
  );

  const clearBtnForEmployeeData = () => {
    clearBtnClicked();
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
    dispatch(saveFilterPayload({}));
    dispatch(updateFilterSelectedData({}));
    dispatch(updateDealerFilterData({}));
    setEmployeeDropDownDataLocal(newDataObj);
  };

  const submitBtnForEmployeeData = () => {
    if (!_.isEmpty(targetSelector.dealerFilter)){
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
      let temp = [];
      Object.keys(employeeDropDownDataLocal).map(function (key, index) {
        Object.values(employeeDropDownDataLocal)[index].map(
          (innerItem, innerIndex) => {
            if (innerItem.selected == true) {
              temp.push(innerItem);
            }
          }
        );
      });

      dispatch(updateFilterSelectedData(employeeDropDownDataLocal));
      if (temp.length > 0) {
        navigation.navigate("MONTHLY_TARGET_SCREEN", {
          params: {
            from: "Filter",
            // selectedID: selectedIds[selectedIds.length - 1],
            selectedID: temp[temp.length - 1].id,
            fromDate: fromDate,
            toDate: toDate,
          },
        });
      }

    // let selectedID = x[x-1];
    // return;
    // if (selectedIds.length > 0) {
    //   getDashboadTableDataFromServer(selectedIds, "EMPLOYEE");
    // } else {
    //   showToast("Please select any value");
    // }
    }else{
      showToast("Please select Dealer Code");
    }
    
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
        selectedItems={(item, o, index) => {
          if (dropDownFrom === "ORG_TABLE") {
            updateSelectedItems(item, selectedItemIndex);
          } else {
            updateSelectedItemsForEmployeeDropDown(
              item,
              selectedItemIndex,
              index
            );
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
          data={employeeTitleNameList.length > 0 ? [1, 2, 3] : [1, 2]}
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
                    <DateSelectItem
                      label={"From Date"}
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
                    <FlatList
                      data={nameKeyList}
                      listKey="ORG_TABLE"
                      scrollEnabled={false}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => {
                        const data = totalDataObj[item].sublevels;

                        let selectedNames = "";
                        let disabletemp = false;
                        data.forEach((obj, index) => {
                          if (
                            obj.selected != undefined &&
                            obj.selected == true
                          ) {
                            selectedNames += obj.name + ", ";
                          }

                          if (obj.disabled === "Y") {
                            disabletemp = true;
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
                              // disabled={disabletemp}
                            />
                          </View>
                        );
                      }}
                    />
                  </View>
                  {/* {!isLoading ? (
                    <View style={styles.submitBtnBckVw}>
                      <Button
                        labelStyle={{
                          color: Colors.RED,
                          textTransform: "none",
                        }}
                        style={{ width: buttonWidth }}
                        mode="outlined"
                        onPress={clearBtnClicked}
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
                        onPress={()=>submitBtnClicked(null)}
                      >
                        Submit
                      </Button>
                    </View>
                  ) : (
                    <AcitivityLoader />
                  )} */}
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
                            // if (item) {
                            //   for (let i = 1; i < employeeTitleNameList.length; i++) {
                            //     let notSelected =
                            //       employeeTitleNameList[index - i];
                            //     if (notSelected) {
                            //       const data1 =
                            //         employeeDropDownDataLocal[notSelected];
                            //       const filterData = data1.filter(
                            //         (e) => e.selected == true
                            //       );
                            //       if (filterData.length > 0) {
                            //         const isAnyData = data.filter(
                            //           (e) => e.parentId == filterData[0]?.code
                            //         );
                            //         if (isAnyData.length == 0) {
                            //           return;
                            //         }
                            //       }
                            //     }
                            //   }
                            //   // let notSelected =
                            //   //   employeeTitleNameList[index - 1];
                            //   // if (notSelected) {
                            //   //   const data1 =
                            //   //     employeeDropDownDataLocal[notSelected];
                            //   //   const filterData = data1.filter(
                            //   //     (e) => e.selected == true
                            //   //   );
                            //   //   if (filterData.length > 0) {
                            //   //     const isAnyData = data.filter(
                            //   //       (e) => e.parentId == filterData[0]?.code
                            //   //     );
                            //   //     if (isAnyData.length == 0) {
                            //   //       return;
                            //   //     }
                            //   //   }
                            //   // }
                            // }
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

export default FilterTargetScreen;

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
