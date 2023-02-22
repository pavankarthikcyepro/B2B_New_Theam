import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import React, { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as AsyncStore from "../../../asyncStore";
import { DropDownComponant } from "../../../components";
import { MyTasksStackIdentifiers } from "../../../navigations/appNavigator";
import { DropDownSelectionItem } from "../../../pureComponents";
import {
  getEmployeesDropDownData,
  getOrganizationHierarchyList,
  updateEmpDropDown,
  updateFilterIds,
} from "../../../redux/mytaskReducer";
import { Colors } from "../../../styles";
import { showToast } from "../../../utils/toast";

const dateFormat = "YYYY-MM-DD";
const screenWidth = Dimensions.get("window").width;
const buttonWidth = (screenWidth - 100) / 2;

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

const MyTaskFilterScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.mytaskReducer);
  const isFocused = useIsFocused();
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dropDownData, setDropDownData] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState();
  const [isSalesConsultant, setIsSalesConsultant] = useState(false);
  const [isFilter, setIsFilter] = useState(true);
  const [nameKeyList, setNameKeyList] = useState([]);
  const [totalData, setTotalData] = useState({});
  const [employeeTitleNameList, setEmployeeTitleNameList] = useState([]);
  const [employeeDropDownDataLocal, setEmployeeDropDownDataLocal] = useState(
    {}
  );
  const [dropDownFrom, setDropDownFrom] = useState("");
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isEmployeeLoading, setIsEmployeeLoading] = useState(false);
  const dispatch = useDispatch();

  const getFilterDropDownData = async () => {
    const payload = {
      orgId: "",
      branchId: "",
    };
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = await JSON.parse(employeeData);
      payload["orgId"] = jsonObj?.orgId;
      payload["branchId"] = jsonObj?.branchId;
    }
    Promise.all([dispatch(getOrganizationHierarchyList(payload))]);
  };

  // get loggedIn user data
  useEffect(async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = await JSON.parse(employeeData);
      setIsSalesConsultant(
        jsonObj?.hrmsRole == "Sales Consultant" ||
          jsonObj?.hrmsRole == "Walkin DSE"
      );
    }
  }, []);

  useEffect(async () => {
    if (selector.filter_drop_down_data && selector.filterIds) {
      let data = selector.filter_drop_down_data;
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = await JSON.parse(employeeData);
        if (
          jsonObj.hrmsRole == "Sales Consultant" ||
          jsonObj?.hrmsRole == "Walkin DSE"
        ) {
          let newData = {};
          newData["Dealer Code"] = {
            sublevels: selector.filter_drop_down_data["Dealer Code"]?.sublevels
              ?.length
              ? selector.filter_drop_down_data["Dealer Code"].sublevels
              : [],
          };
          data = newData;
        }
      }
      let filterIds = selector.filterIds?.levelSelectedIds || [];
      let dealerIds = [];
      let names = [];
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
      setTotalData(data);
      setNameKeyList(names);
    }
  }, [selector.filter_drop_down_data]);

  useEffect(() => {
    if (selector.employees_drop_down_data && selector.filterIds) {
      let filterIds = selector.filterIds?.empSelectedIds || [];
      let names = [];
      let newDataObj = {};
      for (let key in selector.employees_drop_down_data) {
        names.push(key);
        const arrayData = selector.employees_drop_down_data[key];
        const newArray = [];
        if (arrayData.length > 0) {
          arrayData?.forEach((element) => {
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

  useEffect(() => {
    if (
      nameKeyList.length > 0 &&
      isFocused &&
      selector.filterIds?.levelSelectedIds?.length > 0 &&
      !isSalesConsultant
    ) {
      dispatch(updateEmpDropDown());
      setEmployeeTitleNameList([]);
      dropDownItemClicked("Dealer Code", 4, true);
    } else {
      dispatch(updateEmpDropDown());
      setEmployeeTitleNameList([]);
    }
  }, [nameKeyList, isSalesConsultant, isFocused]);

  const dropDownItemClicked = async (item, index, initalCall = false) => {
    setIsFilter(true);
    const topRowSelectedIds = [];
    if (index > 0) {
      const topRowData = totalData[nameKeyList[index - 1]]?.sublevels;
      topRowData?.forEach((item) => {
        if (item.selected != undefined && item.selected === true) {
          topRowSelectedIds.push(Number(item.id));
        }
      });
    }

    let data = [];
    if (topRowSelectedIds.length > 0) {
      const subLevels = totalData[nameKeyList[index]]?.sublevels;
      subLevels.forEach((subItem) => {
        const obj = { ...subItem };
        if (topRowSelectedIds.includes(Number(subItem.parentId))) {
          data.push(obj);
        }
      });
    } else {
      data = totalData[nameKeyList[index]]?.sublevels;
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
        let levelIds = selector.filterIds?.levelSelectedIds;
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
      setDropDownData([...newData]);
    }
    setSelectedItemIndex(index);
    !initalCall && setShowDropDownModel(true);
    setDropDownFrom("ORG_TABLE");
  };
  const dropDownItemClicked2 = (item, index) => {
    let dropdownDatas =
      employeeDropDownDataLocal[employeeTitleNameList[index]] || [];

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

  const updateSelectedItems = (data, index, initalCall = false) => {
    !initalCall && setIsFilter(true);
    let mainData = data;
    let mainKey = nameKeyList[index];
    const totalDataObjLocal = { ...totalData };
    let localData = totalDataObjLocal[mainKey].sublevels;
    let isSelected = mainData.find(
      (val) => val?.selected === true && val?.selected !== undefined
    );
    let isChange = mainData?.find((val, j) => {
      return val?.selected !== localData[j]?.selected;
    });
    if (!isSelected || isChange) {
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
    setTotalData({ ...totalDataObjLocal });
    initalCall && submitBtnClick(totalDataObjLocal);
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

  const submitBtnClick = async (initialData = null) => {
    if (isSalesConsultant && !isFilter) {
      navigation.navigate(MyTasksStackIdentifiers.mytasks);
      return;
    }
    let data = { ...totalData };
    let dealerIds = [];
    let dealerCodes = [];
    let allIds = [];
    for (let i = 0; i < nameKeyList?.length; i++) {
      let key = nameKeyList[i];
      let localData = initialData
        ? initialData[key]?.sublevels
        : data[key]?.sublevels;
      localData?.forEach((val) => {
        if (val.selected === true && val.selected !== undefined) {
          if (key === "Dealer Code") {
            dealerIds.push(val?.id);
            dealerCodes.push(val?.code);
          }
          allIds.push(val?.id);
        }
      });
    }

    let payload = { ...selector.filterIds };
    payload["dealerCodes"] = dealerCodes;
    payload["levelSelectedIds"] = allIds;
    if (!!!initialData) {
      payload["empSelectedIds"] = [];
    }
    if (dealerIds?.length > 0) {
      setIsFilterLoading(true);
      if (!!!initialData) {
        dispatch(updateEmpDropDown());
        setEmployeeTitleNameList([]);
      }
      await Promise.all([dispatch(updateFilterIds(payload))]).then(() => {
        if (!isSalesConsultant) {
          getDashboadTableDataFromServer(allIds, "LEVEL", !!initialData);
        } else {
          navigation.navigate(MyTasksStackIdentifiers.mytasks);
        }
      });
    } else {
      showToast("Please select Dealer Code");
    }
  };

  const submitBtnForEmployeeData = async () => {
    if (!isFilter) {
      navigation.navigate(MyTasksStackIdentifiers.mytasks);
      return;
    }
    let selectedIds = [];
    let lastSelectedIds = [];
    let keys = [];
    for (let key in employeeDropDownDataLocal) {
      keys.push(key);
    }

    let localIndex = keys.length - 1;
    for (var i = localIndex; i >= 0; i--) {
      let key = keys[i];
      const arrayData = employeeDropDownDataLocal[key] || [];
      let back = false;
      arrayData?.forEach((element) => {
        if (element.selected === true) {
          back = true;
          lastSelectedIds.push(element.code);
        }
      });
      if (back) break;
    }

    for (let i = 0; i < keys?.length; i++) {
      let key = keys[i];
      const arrayData = employeeDropDownDataLocal[key] || [];
      arrayData?.forEach((element) => {
        if (element.selected === true) {
          selectedIds.push(element.code);
        }
      });
    }

    let filterPayoad = { ...selector.filterIds };
    if (selectedIds?.length > 0) {
      setIsEmployeeLoading(true);
      filterPayoad["empSelectedIds"] = selectedIds;
      filterPayoad["empLastSelectedIds"] = lastSelectedIds;
      Promise.all([dispatch(updateFilterIds(filterPayoad))])
        .then(() => {
          navigation.navigate(MyTasksStackIdentifiers.mytasks);
          setIsEmployeeLoading(false);
        })
        .catch(() => {
          setIsEmployeeLoading(false);
        });
    } else {
      showToast("Please select any value");
    }
  };

  const getDashboadTableDataFromServer = async (
    selectedIds,
    fro,
    initalCall = false
  ) => {
    const currentDate = moment().format(dateFormat);
    const monthFirstDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .startOf("month")
      .format(dateFormat);
    const monthLastDate = moment(currentDate, dateFormat)
      .subtract(0, "months")
      .endOf("month")
      .format(dateFormat);

    const payload = {
      startDate: monthFirstDate,
      endDate: monthLastDate,
      loggedInEmpId: "",
    };

    const payload1 = {
      orgId: "",
      empId: "",
      selectedIds: selectedIds,
    };

    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = await JSON.parse(employeeData);
      payload["loggedInEmpId"] = jsonObj.empId;
      payload1["orgId"] = jsonObj.orgId;
      payload1["empId"] = jsonObj.empId;
    }
    payload["levelSelected"] = selectedIds;
    await Promise.all([dispatch(getEmployeesDropDownData(payload1))])
      .then(() => {
        !initalCall && setIsFilterLoading(false);
      })
      .catch(() => {
        setIsFilterLoading(false);
        showToast("Something Went Wrong!");
      });
  };

  const clearBtnClick = () => {
    let payload = { ...selector.filterIds };
    payload["empSelectedIds"] = [];
    payload["levelSelectedIds"] = [];
    payload["dealerCodes"] = [];

    Promise.all([dispatch(updateFilterIds(payload))]).then(() => {
      if (isSalesConsultant) {
        setIsFilter(false);
      }
      dispatch(updateEmpDropDown());
      setEmployeeTitleNameList([]);
      getFilterDropDownData();
    });
  };

  const clearBtnForEmployeeData = () => {
    setIsFilter(false);
    let payload = { ...selector.filterIds };
    payload["empSelectedIds"] = [];
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
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.subContainer}
      >
        <View style={styles.subContainer}>
          <View style={{ borderColor: Colors.BORDER_COLOR, borderWidth: 1 }}>
            <FlatList
              data={nameKeyList}
              listKey="ORG_TABLE"
              scrollEnabled={false}
              extraData={employeeTitleNameList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                const data = totalData[item]?.sublevels;
                let names = [];
                let selectedNames = "";
                if (data?.length > 0) {
                  data.forEach((obj) => {
                    if (obj.selected != undefined && obj.selected == true) {
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
                      onPress={() => dropDownItemClicked(item, index)}
                      takeMinHeight={true}
                    />
                  </View>
                );
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
                onPress={() => clearBtnClick()}
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
                onPress={() => submitBtnClick()}
              >
                Submit
              </Button>
            </View>
          ) : (
            <AcitivityLoader />
          )}

          <View>
            {employeeTitleNameList?.length > 0 && (
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
                    keyExtractor={(item, index) => "EMP_" + index.toString()}
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
                            onPress={() => dropDownItemClicked2(item, index)}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  subContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.WHITE,
  },
  topDateContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 5,
    borderColor: Colors.BORDER_COLOR,
    borderWidth: 1,
  },
  submitBtnBckVw: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});

export default MyTaskFilterScreen;
