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
  getOrganaizationHirarchyList,
  updateEmpDropDown,
  updateFilterIds,
} from "../../../redux/homeReducer";
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
import { useIsFocused } from "@react-navigation/native";

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

const FilterScreen = ({ route, navigation }) => {
  const selector = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
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
    hrmsRole: "",
  });
  const [employeeTitleNameList, setEmployeeTitleNameList] = useState([]);
  const [employeeDropDownDataLocal, setEmployeeDropDownDataLocal] = useState(
    {}
  );
  const [dropDownFrom, setDropDownFrom] = useState("");
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
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
        hrmsRole: jsonObj.hrmsRole,
      });
    }
  };
  useEffect(async () => {
    if (selector.filter_drop_down_data && selector.filterIds) {
      let data = selector.filter_drop_down_data;
      let filterIds = selector.filterIds?.levelSelected;
      let names = [];
      let dealerIds = [];
      for (let key in data) {
        names.push(key);
        let localData =
          data[key] && data[key]?.sublevels?.length ? data[key].sublevels : [];
        let newData = localData?.map((obj) => {
          if (key === "Dealer Code" && filterIds.includes(obj?.id)) {
            dealerIds.push(obj?.id);
          }
          return {
            ...obj,
            selected: filterIds?.includes(obj?.id) ? true : false,
          };
        });
        data = {
          ...data,
          [key]: {
            sublevels: newData,
          },
        };
      }
      if (!dealerIds?.length) {
        dispatch(updateEmpDropDown());
        setEmployeeTitleNameList([]);
      }
      setTotalDataObj(data);
      setNameKeyList([...names]);
    }
  }, [selector.filter_drop_down_data]);

  useEffect(() => {
    if (selector.filterIds) {
      const currentDate = moment().format(dateFormat);
      const monthFirstDate =
        selector.filterIds?.startDate ||
        moment(currentDate, dateFormat)
          .subtract(0, "months")
          .startOf("month")
          .format(dateFormat);
      const monthLastDate =
        selector.filterIds?.endDate ||
        moment(currentDate, dateFormat)
          .subtract(0, "months")
          .endOf("month")
          .format(dateFormat);
      setFromDate(monthFirstDate);
      setToDate(monthLastDate);
    }
  }, [selector.filterIds]);

  useEffect(() => {
    if (
      nameKeyList.length > 0 &&
      isFocused &&
      selector.filterIds?.levelSelected?.length > 4
      // userData.hrmsRole != "Sales Consultant" &&
      // userData.hrmsRole != "Walkin DSE"
    ) {
      dispatch(updateEmpDropDown());
      setEmployeeTitleNameList([]);
      dropDownItemClicked(4, "Dealer Code", true);
    } else {
      dispatch(updateEmpDropDown());
      setEmployeeTitleNameList([]);
    }
  }, [nameKeyList, userData, isFocused]);

  const dropDownItemClicked = async (index, item, initalCall = false) => {
    setIsFilter(true);
    const topRowSelectedIds = [];
    if (index > 0) {
      let key = nameKeyList[index - 1];
      const topRowData = totalDataObj[key]?.sublevels;
      topRowData?.forEach((item) => {
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
        let levelIds = selector.filterIds?.levelSelected;
        let updatedMultipleData = [...newData];
        let nData = updatedMultipleData.map((val) => {
          return {
            ...val,
            selected: levelIds.includes(val.id) ? true : false,
          };
        });
        updatedMultipleData = nData;
        updateSelectedItems(updatedMultipleData, index, true);
      }
    } else {
      setDropDownData([...data]);
    }
    setSelectedItemIndex(index);
    !initalCall && setShowDropDownModel(true);
    setDropDownFrom("ORG_TABLE");
  };
  const dropDownItemClicked2 = (index) => {
    let dropdownDatas = employeeDropDownDataLocal[employeeTitleNameList[index]];
    if (index > 0) {
      let localIndex = index - 1;
      let selectedParentIds = [];
      let localData =
        employeeDropDownDataLocal[employeeTitleNameList[localIndex]];
      localData?.length &&
        localData.forEach((val) => {
          if (val.selected !== undefined && val.selected === true)
            selectedParentIds.push(val.id);
        });
      if (selectedParentIds?.length > 0) {
        let data = dropdownDatas.filter((item) =>
          selectedParentIds.includes(item.parentId)
        );
        dropdownDatas = [...data];
      }
    }
    setDropDownData([...dropdownDatas]);
    setSelectedItemIndex(index);
    setShowDropDownModel(true);
    setDropDownFrom("EMPLOYEE_TABLE");
  };

  const updateSelectedItems = async (data, index, initalCall = false) => {
    !initalCall && setIsFilter(true);
    let mainData = data;
    let mainKey = nameKeyList[index];
    const totalDataObjLocal = { ...totalDataObj };
    let localData = totalDataObjLocal[mainKey].sublevels;
    let isSelected = mainData.find(
      (val) => val?.selected === true && val?.selected !== undefined
    );
    let isChange = mainData?.find((val, j) => {
      return val?.selected !== localData[j]?.selected;
    });
    if (!isSelected || isChange || initalCall) {
      dispatch(updateEmpDropDown());
      setEmployeeTitleNameList([]);
    }

    if (!isChange && !initalCall) return;

    if (index > 0) {
      let selectedParendIds = [];
      let unselectedParentIds = [];
      mainData?.length &&
        mainData.forEach((item) => {
          if (item.selected != undefined && item.selected == true) {
            selectedParendIds.push(Number(item.parentId));
          } else {
            unselectedParentIds.push(Number(item.parentId));
          }
        });
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

    const newOBJ = {
      sublevels: mainData,
    };
    totalDataObjLocal[mainKey] = newOBJ;
    setTotalDataObj({ ...totalDataObjLocal });
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      initalCall &&
        jsonObj.hrmsRole != "Sales Consultant" &&
        jsonObj.hrmsRole != "Walkin DSE" &&
        submitBtnClicked(totalDataObjLocal);
    }
  };

  const updateSelectedItemsForEmployeeDropDown = (data, index) => {
    setIsFilter(true);
    const newTotalDataObjLocal = { ...employeeDropDownDataLocal };
    let key = employeeTitleNameList[index];
    let arrayCheck = newTotalDataObjLocal[key];
    let newData = arrayCheck?.map((val, j) => {
      let nData = data.find((v) => v.id === val.id);
      if (nData) return nData;
      return val;
    });
    let isChange = arrayCheck?.find((val, j) => {
      return val?.selected !== newData[j]?.selected;
    });
    if (!isChange) return;
    if (isChange) {
      if (index > 0) {
        let selectedParendIds = [];
        let unselectedParentIds = [];
        newData.forEach((item) => {
          if (item.selected != undefined && item.selected == true) {
            selectedParendIds.push(Number(item.parentId));
          } else {
            unselectedParentIds.push(Number(item.parentId));
          }
        });

        if (!selectedParendIds.length) {
          const tmpObj = { ...employeeDropDownDataLocal };
          delete tmpObj[key];
          let filterObj = [];
          Object.keys(tmpObj).map((newKey) => {
            if (tmpObj[newKey].length > 0) {
              if (arrayCheck.length > 0) {
                for (let i = 0; i < tmpObj[newKey].length; i++) {
                  if (tmpObj[newKey][i].order < arrayCheck[0].order) {
                    filterObj.push(tmpObj[newKey][i]);
                  }
                }
              }
            }
          });
          filterObj.forEach((item) => {
            if (item.selected != undefined && item.selected == true) {
              selectedParendIds.push(Number(item.id));
            }
          });
        }

        let localIndex = index - 1;
        for (localIndex; localIndex >= 0; localIndex--) {
          let selectedNewParentIds = [];
          let unselectedNewParentIds = [];

          let key = employeeTitleNameList[localIndex];
          const dataArray = newTotalDataObjLocal[key];
          if (dataArray.length > 0) {
            const newDataArry = dataArray.map((subItem, index) => {
              const obj = { ...subItem };
              if (selectedParendIds.includes(Number(obj.id))) {
                obj.selected = true;
                selectedNewParentIds.push(Number(obj.parentId));
              } else {
                obj.selected = false;
                unselectedNewParentIds.push(Number(obj.parentId));
              }
              return obj;
            });
            const newOBJ = newDataArry;
            newTotalDataObjLocal[key] = newOBJ;
          }
          selectedParendIds = selectedNewParentIds;
          unselectedParentIds = unselectedNewParentIds;
        }
      }

      let localIndex2 = index + 1;
      for (
        localIndex2;
        localIndex2 < employeeTitleNameList?.length;
        localIndex2++
      ) {
        let newData = [];
        let key = employeeTitleNameList[localIndex2];
        let array = newTotalDataObjLocal[key];
        array?.length &&
          array.forEach((item) => {
            newData.push({
              ...item,
              selected: false,
            });
          });
        newTotalDataObjLocal[key] = newData;
      }
    }
    newTotalDataObjLocal[key] = newData;
    setEmployeeDropDownDataLocal({ ...newTotalDataObjLocal });
  };

  const getFilterDropDownData = async () => {
    if (userData) {
      const payload = {
        orgId: userData.orgId,
        branchId: userData.branchId,
      };
      Promise.all([dispatch(getOrganaizationHirarchyList(payload))]);
    }
  };
  const clearBtnClicked = () => {
    setIsFilter(false);
    let payload = {
      startDate: "",
      endDate: "",
      levelSelected: [],
      empSelected: [],
      allEmpSelected: [],
    };
    Promise.all([dispatch(updateFilterIds(payload))]).then(() => {
      setEmployeeTitleNameList([]);
      dispatch(updateEmpDropDown());
      getFilterDropDownData();
    });
  };

  const submitBtnClicked = async (initialData = null) => {
    console.log( userData.hrmsRole,selector.isDSE,!isFilter);
    if (
      selector.isDSE
      // (userData.hrmsRole == "Sales Consultant" ||
      //   userData.hrmsRole == "Walkin DSE" ||
      //   userData.hrmsRole == "Field DSE")
         &&
      !isFilter == false
    ) {
      navigation.navigate(AppNavigator.TabStackIdentifiers.home, {
        screen: "Home",
        params: { from: "Filter" },
      });
      return;
    }
    let i = 0;
    const selectedIds = [];
    let dealerIds = [];
    for (i; i < nameKeyList.length; i++) {
      let key = nameKeyList[i];
      const dataArray = initialData
        ? initialData[key].sublevels
        : totalDataObj[key].sublevels;
      if (dataArray.length > 0) {
        dataArray.forEach((item, index) => {
          if (item.selected != undefined && item.selected == true) {
            if (key === "Dealer Code") {
              dealerIds.push(item.id);
            }
            selectedIds.push(item.id);
          }
        });
      }
    }
    if (dealerIds.length > 0) {
      setIsFilterLoading(true);
      if (!!!initialData) {
        let payload = { ...selector.flterIds };
        payload["empSelected"] = [];
        payload["allEmpSelected"] = [];
        setEmployeeTitleNameList([]);
        dispatch(updateEmpDropDown());
        dispatch(updateFilterIds(payload));
      }
      if (
        (userData.hrmsRole == "Sales Consultant" ||
          userData.hrmsRole == "Walkin DSE") &&
        !!!initialData
      ) {
        let payload = { ...selector.filterIds };
        payload["empSelected"] = [];
        payload["allEmpSelected"] = [];
        payload["levelSelected"] = selectedIds;
        payload["startDate"] = fromDate;
        payload["endDate"] = toDate;
        Promise.all([dispatch(updateFilterIds(payload))]).then(() => {
          navigation.navigate(AppNavigator.TabStackIdentifiers.home, {
            screen: "Home",
            params: { from: "Filter" },
          });
        });
        setIsFilterLoading(false);
      } else {
        getDashboadTableDataFromServer(selectedIds, "LEVEL", !!initialData);
      }
    } else {
      showToast("Please select Dealer Code");
    }
  };

  const getDashboadTableDataFromServer = (
    selectedIds,
    from,
    initalCall = false,
    selectedEmployee
  ) => {
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

    const payload1 = {
      orgId: userData.orgId,
      empId: userData.employeeId,
      selectedIds: selectedIds,
    };
    Promise.all([dispatch(getEmployeesDropDownData(payload1))])
      .then(() => {
        !initalCall && setIsFilterLoading(false);
        let keys = [];
        let allEmpIds = [];
        for (let key in employeeDropDownDataLocal) {
          keys.push(key);
          let localData = employeeDropDownDataLocal[key];
          localData.forEach((obj) => {
            if (obj.selected) {
              allEmpIds.push(obj.code);
            }
          });
        }
        let filterPayload = {
          ...selector.filterIds,
          startDate: payload.startDate,
          endDate: payload.endDate,
        };
        if (from == "LEVEL") {
          filterPayload["levelSelected"] = selectedIds;
          if (!initalCall) {
            filterPayload["empSelected"] = [];
            filterPayload["allEmpSelected"] = [];
            filterPayload["employeeName"] = [];
          }
        } else {
          filterPayload["empSelected"] = selectedIds;
          filterPayload["allEmpSelected"] = allEmpIds;
          filterPayload["employeeName"] = selectedEmployee;
        }
        Promise.all([
          // dispatch(getLeadSourceTableList(payload)), // h
          // dispatch(getVehicleModelTableList(payload)), //h
          // dispatch(getEventTableList(payload)), //h
          dispatch(getLostDropChartData(payload)), //c in home
          dispatch(updateFilterIds(filterPayload)),
          // getFilterDropDownData()
          // dispatch(updateFilterDropDownData(totalDataObj)), /// not for home
          // // Table Data
          // dispatch(getTaskTableList(payload2)), //h
          // dispatch(getSalesData(payload2)), //h
          // dispatch(getSalesComparisonData(payload2)), //h
          // // Target Params Data
          // dispatch(getTargetParametersData(payload2)), //h
          // dispatch(getTargetParametersEmpDataInsights(payload2)), // h // Added to filter an Home Screen's INSIGHT
        ])
          .then(() => {
            if (from == "EMPLOYEE") {
              navigation.navigate(AppNavigator.TabStackIdentifiers.home, {
                screen: "Home",
                params: { from: "Filter" },
              });
            }
            setIsEmployeeLoading(false);
          })
          .catch(() => {
            setIsEmployeeLoading(false);
            showToast("Something Went Wrong!");
          });
      })
      .catch(() => {
        setIsFilterLoading(false);
        setIsEmployeeLoading(false);
        showToast("Something Went Wrong!");
      });

    // navigation.navigate(AppNavigator.TabStackIdentifiers.home, { screen: "Home", params: { from: 'Filter' }, })
    // } else {
    // navigation.goBack(); // NEED TO COMMENT FOR ASSOCIATE FILTER
    // }
  };

  useEffect(() => {
    if (selector.employees_drop_down_data && selector.filterIds) {
      let filterIds = selector.filterIds?.allEmpSelected || [];
      let names = [];
      let newDataObj = {};
      for (let key in selector.employees_drop_down_data) {
        names.push(key);
        const arrayData = selector.employees_drop_down_data[key];
        const newArray = [];
        if (arrayData.length > 0) {
          arrayData.forEach((element) => {
            newArray.push({
              ...element,
              id: element.code,
              selected: filterIds.includes(element.code) ? true : false,
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
        setEmployeeTitleNameList(names);
        setEmployeeDropDownDataLocal(newDataObj);
        setIsFilterLoading(false);
      }
    },
    [employeeDropDownDataLocal, employeeTitleNameList]
  );

  const clearBtnForEmployeeData = () => {
    setIsFilter(false);
    let payload = { ...selector.filterIds };
    payload["empSelected"] = [];
    payload["allEmpSelected"] = [];
    Promise.all([dispatch(updateFilterIds(payload))]).then(() => {
      let data = employeeDropDownDataLocal;
      let newDataObj = {};
      for (let key in data) {
        const arrayData = data[key];
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
    });
  };

  const submitBtnForEmployeeData = async () => {
    if (!isFilter) {
      navigation.navigate(AppNavigator.TabStackIdentifiers.home, {
        screen: "Home",
        params: { from: "Filter" },
      });
      return;
    }
    let selectedIds = [];
    let keys = [];
    let selectedNames = [];
    for (let key in employeeDropDownDataLocal) {
      keys.push(key);
    }
    let localIndex = keys.length - 1;
    for (var i = localIndex; i >= 0; i--) {
      let key = keys[i];
      const arrayData = employeeDropDownDataLocal[key];
      let back = false;
      arrayData.forEach((element) => {
        if (element.selected === true) {
          back = true;
          selectedIds.push(element.code);
          selectedNames.push(element?.name);
        }
      });
      if (back) break;
    }
    if (selectedIds.length > 0) {
      setIsEmployeeLoading(true);
      getDashboadTableDataFromServer(
        selectedIds,
        "EMPLOYEE",
        false,
        selectedNames
      );
    } else {
      showToast("Please select any value");
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
      <DropDownComponant
        visible={showDropDownModel}
        multiple={true}
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
                      onPress={() => {
                        setIsFilter(true);
                        showDatePickerMethod("FROM_DATE");
                      }}
                    />
                  </View>

                  <View style={{ width: "48%" }}>
                    <DateSelectItem
                      label={"To Date"}
                      value={toDate}
                      onPress={() => {
                        setIsFilter(true);
                        showDatePickerMethod("TO_DATE");
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
                    <FlatList
                      data={nameKeyList}
                      listKey="ORG_TABLE"
                      scrollEnabled={false}
                      extraData={employeeTitleNameList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => {
                        const data = totalDataObj[item]?.sublevels;
                        let names = [];
                        let selectedNames = "";
                        if (data?.length > 0) {
                          data.forEach((obj) => {
                            if (
                              obj.selected != undefined &&
                              obj.selected == true
                            ) {
                              names.push(obj.name);
                            }
                          });
                          selectedNames = names?.join(", ");
                        }
                        if (userData.hrmsRole === "Reception") {
                          if (item === "Dealer Code") {
                            return (
                              <View>
                                <DropDownSelectionItem
                                  label={item}
                                  value={selectedNames}
                                  onPress={() =>
                                    dropDownItemClicked(index, item)
                                  }
                                  takeMinHeight={true}
                                />
                              </View>
                            );
                          }
                        } else {
                          return (
                            <View>
                              <DropDownSelectionItem
                                label={item}
                                value={selectedNames}
                                onPress={() => dropDownItemClicked(index, item)}
                                takeMinHeight={true}
                              />
                            </View>
                          );
                        }
                      }}
                    />
                  </View>
                  {!isFilterLoading ? (
                    <View style={styles.submitBtnBckVw}>
                      <Button
                        labelStyle={{
                          color: Colors.RED,
                          textTransform: "none",
                        }}
                        style={{ width: buttonWidth }}
                        mode="outlined"
                        onPress={() => clearBtnClicked()}
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
                        onPress={() => submitBtnClicked()}
                      >
                        Submit
                      </Button>
                    </View>
                  ) : (
                    <AcitivityLoader />
                  )}
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
                            let names = [];
                            let selectedNames = "";
                            if (data?.length > 0) {
                              data.forEach((obj) => {
                                if (
                                  obj.selected != undefined &&
                                  obj.selected == true
                                ) {
                                  names.push(obj.name);
                                }
                              });
                              selectedNames = names?.join(", ");
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
                      {!isEmployeeLoading ? (
                        <View style={styles.submitBtnBckVw}>
                          <Button
                            labelStyle={{
                              color: Colors.RED,
                              textTransform: "none",
                            }}
                            style={{ width: buttonWidth }}
                            mode="outlined"
                            onPress={() => clearBtnForEmployeeData()}
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
                            onPress={() => submitBtnForEmployeeData()}
                          >
                            Submit
                          </Button>
                        </View>
                      ) : (
                        <AcitivityLoader />
                      )}
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

export default FilterScreen;

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
