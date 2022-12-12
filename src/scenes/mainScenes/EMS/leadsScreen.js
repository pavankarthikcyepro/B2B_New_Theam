import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, IconButton, Searchbar } from "react-native-paper";
import { EmptyListView } from "../../../pureComponents";
import {
  DatePickerComponent,
  DateRangeComp,
  LeadsFilterComp,
  SingleLeadSelectComp,
  SortAndFilterComp,
} from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from "../../../navigations";
import * as AsyncStore from "../../../asyncStore";
import {
  getEnquiryList,
  getMoreEnquiryList,
} from "../../../redux/enquiryReducer";
import moment from "moment";
import { Category_Type_List_For_Filter } from "../../../jsonData/enquiryFormScreenJsonData";
import { MyTaskNewItem } from "../MyTasks/components/MyTasksNewItem";
import { updateIsSearch, updateSearchKey } from "../../../redux/appReducer";
import { getPreBookingData } from "../../../redux/preBookingReducer";
import DateRangePicker from "../../../utils/DateRangePicker";
import {
  getLeadsList,
  getMenu,
  getStatus,
  getSubMenu,
} from "../../../redux/leaddropReducer";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/FontAwesome";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").endOf("month").format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);

const LeadsScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const selector = useSelector((state) => state.enquiryReducer);
  const appSelector = useSelector((state) => state.appReducer);
  const { vehicle_model_list_for_filters, source_of_enquiry_list } =
    useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  const [vehicleModelList, setVehicleModelList] = useState(
    vehicle_model_list_for_filters
  );
  const [sourceList, setSourceList] = useState(source_of_enquiry_list);
  const [categoryList, setCategoryList] = useState(
    Category_Type_List_For_Filter
  );

  const [tempVehicleModelList, setTempVehicleModelList] = useState([]);
  const [tempSourceList, setTempSourceList] = useState([]);
  const [tempCategoryList, setTempCategoryList] = useState([]);
  const [tempEmployee, setTempEmployee] = useState({});
  const [tempLeadStage, setTempLeadStage] = useState([]);
  const [tempLeadStatus, setTempLeadStatus] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerId, setDatePickerId] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [sortAndFilterVisible, setSortAndFilterVisible] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [orgId, setOrgId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [leadsFilterVisible, setLeadsFilterVisible] = useState(false);
  const [leadsFilterData, setLeadsFilterData] = useState([]);
  const [leadsFilterDropDownText, setLeadsFilterDropDownText] = useState("All");
  const [leadsList, setLeadsList] = useState([]);

  const [subMenu, setSubMenu] = useState([]);
  const [leadsSubMenuFilterVisible, setLeadsSubMenuFilterVisible] =
    useState(false);
  const [leadsSubMenuFilterDropDownText, setLeadsSubMenuFilterDropDownText] =
    useState("All");
  const [loader, setLoader] = useState(false);
  const [tempStore, setTempStore] = useState([]);
  const [tempFilterPayload, setTempFilterPayload] = useState([]);
  const [defualtLeadStage, setDefualtLeadStage] = useState([]);
  const [defualtLeadStatus, setdefualtLeadStatus] = useState([]);
  const [refreshed, setRefreshed] = useState(false);

  const orgIdStateRef = React.useRef(orgId);
  const empIdStateRef = React.useRef(employeeId);
  const fromDateRef = React.useRef(selectedFromDate);
  const toDateRef = React.useRef(selectedToDate);

  const setFromDateState = (date) => {
    fromDateRef.current = date;
    setSelectedFromDate((x) => date);
  };

  const setToDateState = (date) => {
    toDateRef.current = date;
    setSelectedToDate((x) => date);
  };

  useEffect(() => {
    if (appSelector.isSearch) {
      dispatch(updateIsSearch(false));
      if (appSelector.searchKey !== "") {
        let tempData = [];
        tempData = leadsList.filter((item) => {
          return (
            `${item.firstName} ${item.lastName}`
              .toLowerCase()
              .includes(appSelector.searchKey.toLowerCase()) ||
            item.phone
              .toLowerCase()
              .includes(appSelector.searchKey.toLowerCase()) ||
            item.enquirySource
              .toLowerCase()
              .includes(appSelector.searchKey.toLowerCase()) ||
            item.enquiryCategory
              ?.toLowerCase()
              .includes(appSelector.searchKey.toLowerCase()) ||
            item?.leadId
              .toString()
              ?.toLowerCase()
              .includes(appSelector.searchKey.toLowerCase()) ||
            item?.model
              ?.toLowerCase()
              .includes(appSelector.searchKey.toLowerCase())
          );
        });
        setSearchedData([]);
        setSearchedData(tempData);
        dispatch(updateSearchKey(""));
      } else {
        setSearchedData([]);
        setSearchedData(leadsList);
      }
    }
  }, [appSelector.isSearch]);

  useEffect(async () => {
    // Get Data From Server
    let isMounted = true;
    // setFromDateState(lastMonthFirstDate);
    // const tomorrowDate = moment().add(1, "day").format(dateFormat)
    // setToDateState(currentDate);
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setEmployeeId(jsonObj.empId);
      setOrgId(jsonObj.orgId);
    }
  }, []);

  const managerFilter = useCallback(
    (newArr) => {
      const alreadyFilterMenu = newArr.filter(
        (e) => e.menu == route?.params?.param
      );
      let modelList = [...newArr];
      const newArr2 = modelList.map((v) => ({
        ...v,
        checked: v.menu == route?.params?.param ? true : false,
      }));
      setLeadsFilterData([...newArr2]);
      setTempEmployee(
        route?.params?.employeeDetail ? route?.params?.employeeDetail : null
      );
      getSubMenuList(
        alreadyFilterMenu[0].menu,
        true,
        route?.params?.employeeDetail ? route?.params?.employeeDetail : null
      );
      setLeadsFilterDropDownText(alreadyFilterMenu[0].menu);
    },
    [route?.params, leadsFilterData]
  );

  useEffect(() => {
    if (route?.params) {
      const liveLeadsStartDate =
        route?.params?.moduleType === "live-leads"
          ? "2021-01-01"
          : lastMonthFirstDate;
      const liveLeadsEndDate =
        route?.params?.moduleType === "live-leads"
          ? moment().format(dateFormat)
          : currentDate;
      if (route?.params?.moduleType === "live-leads") {
        setRefreshed(false);
      } else {
        setRefreshed(true);
      }
      setFromDateState(liveLeadsStartDate);
      setToDateState(liveLeadsEndDate);
    } else {
      setFromDateState(lastMonthFirstDate);
      setToDateState(currentDate);
    }

    if (
      route &&
      route.params &&
      route.params.fromScreen &&
      (route.params.fromScreen === "contacts" ||
        route.params.fromScreen === "enquiry" ||
        route.params.fromScreen === "proceedToBookingApproval" ||
        route.params.fromScreen === "booking" ||
        route.params.fromScreen === "bookingApproval")
    ) {
      setLoader(true);
      onRefresh();
    } else if (isFocused) {
      Promise.all([dispatch(getMenu()), dispatch(getStatus())])
        .then(async ([res, res2]) => {
          setLoader(true);
          let path = res.payload;
          let path2 = res2.payload;
          let leadStage = [];
          let leadStatus = [];
          let newAre = path2 && path2.filter((e) => e.menu !== "Contact");
          for (let i = 0; i < newAre.length; i++) {
            let x = newAre[i].allLeadsSubstagesEntity;
            for (let j = 0; j < x.length; j++) {
              if (x[j].leadStage) {
                leadStage = [...leadStage, ...x[j].leadStage];
              }
            }
          }
          leadStage = leadStage.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) == index;
          });
          setDefualtLeadStage(leadStage);
          setdefualtLeadStatus(leadStatus);
          const newArr = path.map((v) => ({ ...v, checked: false }));
          setTempStore(newArr);
          if (route.params) {
            managerFilter(newArr);
          } else {
            defualtCall(newArr, leadStage, leadStatus);
          }
        })
        .catch((err) => {
          setLoader(false);
          setLeadsFilterDropDownText("All");
          setSubMenu([]);
        });
    } else {
      Promise.all([dispatch(getMenu()), dispatch(getStatus())])
        .then(async ([res, res2]) => {
          setLoader(true);
          let path = res.payload;
          let path2 = res2.payload;
          let leadStage = [];
          let leadStatus = [];
          let newAre = path2.filter((e) => e.menu !== "Contact");
          for (let i = 0; i < newAre.length; i++) {
            let x = newAre[i].allLeadsSubstagesEntity;
            for (let j = 0; j < x.length; j++) {
              if (x[j]?.leadStage) {
                leadStage = [...leadStage, ...x[j].leadStage];
              }
            }
          }
          leadStage = leadStage.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) == index;
          });
          setDefualtLeadStage(leadStage);
          setdefualtLeadStatus(leadStatus);
          const newArr = path.map((v) => ({ ...v, checked: false }));
          setTempStore(newArr);
          if (route.params) {
            managerFilter(newArr);
          } else {
            setLeadsFilterData(newArr);
            defualtCall(newArr, leadStage, leadStatus);
          }
        })
        .catch((err) => {
          setLoader(false);
          setLeadsFilterDropDownText("All");
          setSubMenu([]);
        });
    }
  }, [route.params]);

  const defualtCall = async (tempStores, leadStage, leadStatus) => {
    setLeadsFilterData(newArr);
    setSubMenu([]);
    setLeadsFilterDropDownText("All");
    // setFromDateState(lastMonthFirstDate);
    // const tomorrowDate = moment().add(1, "day").format(dateFormat)
    // setToDateState(currentDate);
    setLeadsFilterData(tempStores);
    const newArr = tempStores.map(function (x) {
      x.checked = false;
      return x;
    });
    setTempLeadStage(leadStage);
    setTempLeadStatus([]);
    onTempFliter(
      newArr,
      null,
      [],
      [],
      [],
      lastMonthFirstDate,
      currentDate,
      leadStage,
      [],
      true
    );
    // return
    // await applyLeadsFilter(newArr, lastMonthFirstDate, currentDate);
  };

  const getPayloadData = (
    leadType,
    empId,
    startDate,
    endDate,
    offSet = 0,
    modelFilters = [],
    categoryFilters = [],
    sourceFilters = []
  ) => {
    // const type = {enq: "ENQUIRY", bkgAprvl: 'PRE_BOOKING', bkg: 'BOOKING'}
    return {
      startdate: startDate,
      enddate: endDate,
      model: modelFilters,
      categoryType: categoryFilters,
      sourceOfEnquiry: sourceFilters,
      empId: empId,
      status: leadType,
      offset: offSet,
      limit: 500,
    };
  };

  const getMoreEnquiryListFromServer = async () => {
    if (selector.isLoadingExtraData) {
      return;
    }
    if (employeeId && selector.pageNumber + 1 < selector.totalPages) {
      const payload = getPayloadData(
        employeeId,
        selectedFromDate,
        selectedToDate,
        selector.pageNumber + 1
      );
      dispatch(getMoreEnquiryList(payload));
    }
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
        // getEnquiryListFromServer(employeeId, formatDate, selectedToDate);
        onTempFliter(
          tempFilterPayload,
          isEmpty(tempEmployee) ? null : tempEmployee,
          tempVehicleModelList,
          tempCategoryList,
          tempSourceList,
          formatDate,
          selectedToDate,
          tempLeadStage,
          tempLeadStatus
        );
        break;
      case "TO_DATE":
        setToDateState(formatDate);
        // getEnquiryListFromServer(employeeId, selectedFromDate, formatDate);
        onTempFliter(
          tempFilterPayload,
          isEmpty(tempEmployee) ? null : tempEmployee,
          tempVehicleModelList,
          tempCategoryList,
          tempSourceList,
          selectedFromDate,
          formatDate,
          tempLeadStage,
          tempLeadStatus
        );
        break;
    }
  };

  function isEmpty(obj) {
    return obj && Object.keys(obj).length === 0;
  }

  const applySelectedFilters = (payload) => {
    const modelData = payload.model;
    const sourceData = payload.source;
    const categoryData = payload.category;

    const categoryFilters = [];
    const modelFilters = [];
    const sourceFilters = [];
    categoryData.forEach((element) => {
      if (element.isChecked) {
        categoryFilters.push({
          id: element.id,
          name: element.name,
        });
      }
    });
    modelData.forEach((element) => {
      if (element.isChecked) {
        modelFilters.push({
          id: element.id,
          name: element.value,
        });
      }
    });
    sourceData.forEach((element) => {
      if (element.isChecked) {
        sourceFilters.push({
          id: element.id,
          name: element.name,
          orgId: orgId,
        });
      }
    });
    setCategoryList([...categoryFilters]);
    setVehicleModelList([...modelFilters]);
    setSourceList([...sourceFilters]);
    setTempVehicleModelList(modelFilters);
    setTempCategoryList(categoryFilters);
    setTempSourceList(sourceFilters);
    onTempFliter(
      tempFilterPayload,
      isEmpty(tempEmployee) ? null : tempEmployee,
      modelFilters,
      categoryFilters,
      sourceFilters,
      selectedFromDate,
      selectedToDate,
      tempLeadStage,
      tempLeadStatus
    );
    // return
    // // // Make Server call
    // // const payload2 = getPayloadData(employeeId, selectedFromDate, selectedToDate, 0, modelFilters, categoryFilters, sourceFilters)
    // // dispatch(getEnquiryList(payload2));
    // applyLeadsFilter(leadsFilterData, selectedFromDate, selectedToDate, modelFilters, categoryFilters, sourceFilters)
  };

  const applyLeadsFilter = async (
    data,
    startDate,
    endDate,
    modelFilters = [],
    categoryFilters = [],
    sourceFilters = []
  ) => {
    setLoader(true);
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      // const leadsData = data.filter(x => x.checked);
      const leadsData = data.filter((x) => x.status === "Active");
      const payload1 = getPayloadData(
        "ENQUIRY",
        jsonObj.empId,
        startDate,
        endDate,
        0,
        modelFilters,
        categoryFilters,
        sourceFilters
      );
      const payload2 = getPayloadData(
        "PREBOOKING",
        jsonObj.empId,
        startDate,
        endDate,
        0,
        modelFilters,
        categoryFilters,
        sourceFilters
      );
      const payload3 = getPayloadData(
        "BOOKING",
        jsonObj.empId,
        startDate,
        endDate,
        0,
        modelFilters,
        categoryFilters,
        sourceFilters
      );
      let dispatchData = [];
      leadsData.forEach((x) => {
        switch (x.id) {
          case 1:
            dispatchData.push(dispatch(getEnquiryList(payload1)));
            break;
          case 2:
            dispatchData.push(dispatch(getEnquiryList(payload2)));
            break;
          case 3:
            dispatchData.push(dispatch(getEnquiryList(payload3)));
            break;
          default:
            dispatchData = [
              dispatch(getEnquiryList(payload1)),
              dispatch(getPreBookingData(payload2)),
              dispatch(getPreBookingData(payload3)),
            ];
            break;
        }
      });
      Promise.all(dispatchData)
        .then(([data1, data2, data3]) => {
          let data = [];
          leadsData.filter((x, i) => {
            switch (i) {
              case 0:
                data = [
                  ...data,
                  ...data1.payload.dmsEntity.leadDtoPage.content,
                ];
                break;
              case 1:
                data = [
                  ...data,
                  ...data2.payload.dmsEntity.leadDtoPage.content,
                ];
                break;
              case 2:
                data = [
                  ...data,
                  ...data3.payload.dmsEntity.leadDtoPage.content,
                ];
                break;
            }
          });
          setLoader(false);
          const dataSorted = data.sort(
            (x, y) => y.modifiedDate - x.modifiedDate
          );
          setLeadsList([...dataSorted]);
          setSearchedData([]);
          setSearchedData(dataSorted);
        })
        .catch(() => {
          setLoader(false);
        });
    }
  };

  const getSubMenuList = async (
    item,
    getAllData = false,
    employeeDetail = {}
  ) => {
    Promise.all([dispatch(getSubMenu(item.toUpperCase()))])
      .then((response) => {
        let path = response[0]?.payload[0]?.allLeadsSubstagesEntity;
        if (getAllData) {
          setSearchedData([]);
          let condition = "";
          if (
            route?.params?.moduleType === "live-leads" &&
            route?.params?.param === "Retail"
          ) {
            condition = "ALL";
          } else if (route?.params?.moduleType === "live-leads") {
            condition = item;
          } else {
            condition = "ALL";
          }
          // const x = path.map(object => {
          //     if (object.subMenu == "ALL") {
          //         return { ...object, checked: true };
          //     }
          //     return object;
          // });
          // setTempFilterPayload(newArr);
          // onTempFliter(newArr, employeeDetail,);
          // setSubMenu(newArr);
        //   setLeadsSubMenuFilterDropDownText("ALL");
          const x =
            item === "Delivery"
              ? path.map((object) => {
                   return { ...object, checked: true };
                })
              : path.map((object) => {
                  if (object.subMenu === condition) {
                    return { ...object, checked: true };
                  }
                  return object;
                });
          setSubMenu([...x]);
          setTempFilterPayload(x);
          onTempFliter(
            x,
            employeeDetail,
            tempVehicleModelList,
            tempCategoryList,
            tempSourceList,
            selectedFromDate,
            selectedToDate
          );
          setLeadsSubMenuFilterVisible(false);
          const data = x.filter((y) => y.checked);
          if (data.length === subMenu.length) {
            setLeadsSubMenuFilterDropDownText("All");
          } else {
            const names = data.map((y) => y?.subMenu);
            setLeadsSubMenuFilterDropDownText(
              names.toString() ? names.toString() : "Select Sub Menu"
            );
          }
        } else if (path.length == 1) {
          // getFliteredList(path[0]);
          let newPath = path.map((v) => ({ ...v, checked: true }));
          setTempFilterPayload(newPath);
          onTempFliter(
            newPath,
            employeeDetail,
            tempVehicleModelList,
            tempCategoryList,
            tempSourceList,
            selectedFromDate,
            selectedToDate
          );
          NewSubMenu([]);
        } else {
          NewSubMenu(path);
        }
      })
      .catch((error) => {});
  };

  const NewSubMenu = (item) => {
    const newArr = item.map((v) => ({ ...v, checked: false, subData: [] }));
    setSubMenu(newArr);
    setLeadsSubMenuFilterDropDownText("Select Sub Menu");
  };

  const onTempFliter = async (
    item,
    employeeDetail = {},
    modelData,
    categoryFilters,
    sourceData,
    from,
    to,
    defLeadStage,
    defLeadStatus,
    isRefresh = false
  ) => {
    setSearchedData([]);
    setLeadsList([]);
    setSelectedToDate(moment().add(0, "day").endOf("month").format(dateFormat));
    setLoader(true);
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      let newArray = item.filter((i) => i.checked === true);
      const jsonObj = JSON.parse(employeeData);
      let leadStage = [];
      let leadStatus = [];
      let categoryType = [];
      let sourceOfEnquiry = [];
      let model = [];

      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i].leadStage) {
          for (let j = 0; j < newArray[i].leadStage.length; j++) {
            leadStage.push(newArray[i].leadStage[j]);
          }
        }
        if (newArray[i].leadStatus) {
          for (let j = 0; j < newArray[i].leadStatus.length; j++) {
            leadStatus.push(newArray[i].leadStatus[j]);
          }
        }
      }
      defLeadStage ? null : setTempLeadStage(leadStage);
      defLeadStatus ? null : setTempLeadStatus(leadStatus);
      if (modelData || categoryFilters || sourceData) {
        for (let i = 0; i < sourceData.length; i++) {
          let x = {
            id: sourceData[i].id,
            name: sourceData[i].name,
            orgId: jsonObj.orgId,
          };
          sourceOfEnquiry.push(x);
        }
        for (let i = 0; i < categoryFilters.length; i++) {
          let x = {
            id: categoryFilters[i].id,
            name: categoryFilters[i].name,
          };
          categoryType.push(x);
        }
        for (let i = 0; i < modelData.length; i++) {
          let x = {
            id: modelData[i].id,
            name: modelData[i].name ? modelData[i].name : modelData[i].key,
          };
          model.push(x);
        }
      } else {
        for (let i = 0; i < sourceList.length; i++) {
          let x = {
            id: sourceList[i].id,
            name: sourceList[i].name,
            orgId: jsonObj.orgId,
          };
          sourceOfEnquiry.push(x);
        }
        for (let i = 0; i < categoryList.length; i++) {
          let x = {
            id: categoryList[i].id,
            name: categoryList[i].name,
          };
          categoryType.push(x);
        }
        for (let i = 0; i < vehicleModelList.length; i++) {
          let x = {
            id: vehicleModelList[i].id,
            name: vehicleModelList[i].key,
          };
          model.push(x);
        }
      }
      const leadStages = defLeadStage
        ? defLeadStage
        : leadStage.length === 0
        ? defualtLeadStage
        : leadStage;
      if (
        leadStages &&
        leadStages.length > 0 &&
        route?.params?.param !== "Retail"
      ) {
        const invoiceIndex = leadStages.findIndex(
          (x) => x === "INVOICECOMPLETED"
        );
        if (invoiceIndex !== -1) {
          leadStages.splice(invoiceIndex, 1);
        }
      }

      let isLive = false;
      if (
        route?.params?.param &&
        route?.params?.moduleType == "live-leads" &&
        !isRefresh
      ) {
        isLive = true;
        from = "2021-01-01";
      } else if (route?.params?.param && route?.params?.moduleType == "home") {
        from = lastMonthFirstDate;
      } else {
      }

      let newPayload = {
        startdate: from ? from : selectedFromDate,
        enddate: to ? to : selectedToDate,
        model: modelData ? model : [],
        categoryType: categoryFilters ? categoryType : [],
        sourceOfEnquiry: sourceData ? sourceOfEnquiry : [],
        empId: employeeDetail
          ? route?.params?.employeeDetail?.empId
          : jsonObj.empId,
        status: "",
        offset: 0,
        limit: 5000,
        leadStage: leadStages,
        leadStatus: defLeadStatus
          ? defLeadStatus
          : leadStatus.length === 0
          ? defualtLeadStatus
          : leadStatus,
      };
      let data = {
        newPayload,
        isLive,
      };
      Promise.all([dispatch(getLeadsList(data))])
        .then((response) => {
          setLoader(false);
          let newData = response[0].payload?.dmsEntity?.leadDtoPage?.content;
          setSearchedData(newData);
          setLeadsList(newData);
        })
        .catch((error) => {
          setLoader(false);
        });
    }
  };

  const renderFooter = () => {
    if (!selector.isLoadingExtraData) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <Text style={styles.btnText}>Loading More...</Text>
        <ActivityIndicator color={Colors.GRAY} />
      </View>
    );
  };

  const getFirstLetterUpperCase = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    dispatch(updateSearchKey(query));
    dispatch(updateIsSearch(true));
  };

  function applyDateFilter(from, to) {
    updateSelectedDate(from, "FROM_DATE");
    updateSelectedDate(to, "TO_DATE");
    setShowDatePicker(false);
    // onTempFliter(tempFilterPayload, isEmpty(tempEmployee) ? null : tempEmployee,
    //     tempVehicleModelList, tempCategoryList, tempSourceList, from, to, tempLeadStage, tempLeadStatus);
    // return
    // setTimeout(() => {
    //     applyLeadsFilter(leadsFilterData, from, to);
    // }, 500);
  }

  const onRefresh = async () => {
    setSelectedFromDate(lastMonthFirstDate);
    Promise.all([dispatch(getMenu()), dispatch(getStatus())])
      .then(async ([res, res2]) => {
        let path = res.payload;
        let path2 = res2.payload;
        let leadStage = [];
        let leadStatus = [];
        let newAre = path2.filter((e) => e.menu !== "Contact");
        for (let i = 0; i < newAre.length; i++) {
          let x = newAre[i].allLeadsSubstagesEntity;
          for (let j = 0; j < x.length; j++) {
            if (x[j]?.leadStage) {
              leadStage = [...leadStage, ...x[j].leadStage];
            }
          }
        }
        leadStage = leadStage.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index;
        });
        setDefualtLeadStage(leadStage);
        setdefualtLeadStatus(leadStatus);
        const newArr = path.map((v) => ({ ...v, checked: false }));
        setTempStore(newArr);
        setLeadsFilterData(newArr);
        defualtCall(newArr, leadStage, leadStatus);
        setTempEmployee({});
      })
      .catch((err) => {
        setLoader(false);
        setLeadsFilterDropDownText("All");
        setSubMenu([]);
      });
  };

  // const liveLeadsStartDate = route?.params?.moduleType === 'live-leads' ? '2021-01-01' : lastMonthFirstDate;
  const liveLeadsEndDate =
    route?.params?.moduleType === "live-leads"
      ? moment().format(dateFormat)
      : currentDate;

  return (
    <SafeAreaView style={styles.container}>
      <DatePickerComponent
        visible={showDatePicker}
        mode={"date"}
        maximumDate={new Date(liveLeadsEndDate.toString())}
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
      <View>
        <SingleLeadSelectComp
          visible={leadsFilterVisible}
          modelList={leadsFilterData}
          submitCallback={(x) => {
            setLeadsFilterData([...x]);
            setLeadsFilterVisible(false);
            const data = x.filter((y) => y.checked);
            if (data.length === 3) {
              setLeadsFilterDropDownText("All");
            } else {
              const names = data.map((y) => y.menu);
              getSubMenuList(names.toString(), true);
              setLeadsFilterDropDownText(names.toString());
            }
          }}
          cancelClicked={() => {
            setLeadsFilterVisible(false);
          }}
          selectAll={async () => {
            setSubMenu([]);
            defualtCall(tempStore);
          }}
        />
        <LeadsFilterComp
          visible={leadsSubMenuFilterVisible}
          modelList={subMenu}
          submitCallback={(x) => {
            setSubMenu([...x]);
            setTempFilterPayload(x);
            onTempFliter(
              x,
              isEmpty(tempEmployee) ? null : tempEmployee,
              tempVehicleModelList,
              tempCategoryList,
              tempSourceList,
              selectedFromDate,
              selectedToDate
            );
            setLeadsSubMenuFilterVisible(false);
            const data = x.filter((y) => y.checked);
            if (data.length === subMenu.length) {
              setLeadsSubMenuFilterDropDownText("All");
            } else {
              const names = data.map((y) => y?.subMenu);
              setLeadsSubMenuFilterDropDownText(
                names.toString() ? names.toString() : "Select Sub Menu"
              );
            }
          }}
          cancelClicked={() => {
            setLeadsSubMenuFilterVisible(false);
          }}
          onChange={(x) => {}}
        />
      </View>

      <SortAndFilterComp
        visible={sortAndFilterVisible}
        categoryList={categoryList}
        modelList={vehicleModelList}
        sourceList={sourceList}
        submitCallback={(payload) => {
          applySelectedFilters(payload);
          setSortAndFilterVisible(false);
        }}
        onRequestClose={() => {
          setSortAndFilterVisible(false);
        }}
      />

      <View style={styles.view1}>
        <View style={{ width: "80%" }}>
          <DateRangeComp
            fromDate={selectedFromDate}
            toDate={selectedToDate}
            fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
            toDateClicked={() => showDatePickerMethod("TO_DATE")}
          />
        </View>
        <Pressable onPress={() => setSortAndFilterVisible(true)}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderColor: Colors.BORDER_COLOR,
              borderWidth: 1,
              borderRadius: 4,
              backgroundColor: Colors.WHITE,
              paddingLeft: 8,
              height: 50,
              justifyContent: "center",
            }}
          >
            <Text style={styles.text1}>{"Filter"}</Text>
            <IconButton
              icon={"filter-outline"}
              size={16}
              color={Colors.RED}
              style={{ margin: 0, padding: 0 }}
            />
          </View>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderColor: Colors.LIGHT_GRAY,
          paddingHorizontal: 6,
          paddingBottom: 4,
          backgroundColor: Colors.WHITE,
          marginTop: -6,
        }}
      >
        <View style={{ width: subMenu?.length > 1 ? "45%" : "100%" }}>
          <Pressable
            onPress={() => {
              setLeadsFilterVisible(true);
            }}
          >
            <View
              style={{
                borderWidth: 0.5,
                borderColor: Colors.BORDER_COLOR,
                borderRadius: 4,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  width: "80%",
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  fontSize: 12,
                  fontWeight: "600",
                }}
                numberOfLines={2}
              >
                {leadsFilterDropDownText}
              </Text>
              <IconButton
                icon={leadsFilterVisible ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.RED}
                style={{ margin: 0, padding: 0 }}
              />
            </View>
          </Pressable>
        </View>
        {subMenu?.length > 1 && (
          <View
            style={{
              width: "50%",
              alignSelf: "center",
              backgroundColor: "white",
              marginBottom: 5,
            }}
          >
            <Pressable
              onPress={() => {
                setLeadsSubMenuFilterVisible(true);
              }}
              disabled={true ? true : false}
            >
              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: true ? Colors.GRAY : Colors.BORDER_COLOR,
                  borderRadius: 4,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    width: "70%",
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    fontSize: 12,
                    fontWeight: "600",
                    color: true ? Colors.GRAY : Colors.BLACK,
                  }}
                  numberOfLines={2}
                >
                  {leadsSubMenuFilterDropDownText}
                </Text>
                <IconButton
                  icon={
                    leadsSubMenuFilterVisible ? "chevron-up" : "chevron-down"
                  }
                  size={20}
                  color={true ? Colors.GRAY : Colors.RED}
                  style={{ margin: 0, padding: 0 }}
                />
              </View>
            </Pressable>
          </View>
        )}
      </View>
      <View>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      {searchedData && searchedData.length === 0 ? (
        <EmptyListView
          title={"No Data Found"}
          isLoading={selector.isLoading || loader}
        />
      ) : (
        <View
          style={[
            { backgroundColor: Colors.LIGHT_GRAY, flex: 1, marginBottom: 10 },
          ]}
        >
          <FlatList
            data={searchedData}
            extraData={searchedData}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={selector.isLoading}
                // onRefresh={() => getEnquiryListFromServer(employeeId, selectedFromDate, selectedToDate)}
                progressViewOffset={200}
              />
            }
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0}
            // onEndReached={() => {
            //     if (appSelector.searchKey === '') {
            //         getMoreEnquiryListFromServer()
            //     }
            // }}
            ListFooterComponent={renderFooter}
            renderItem={({ item, index }) => {
              let color = Colors.WHITE;
              if (index % 2 !== 0) {
                color = Colors.LIGHT_GRAY;
              }
              return (
                <>
                  <View>
                    <MyTaskNewItem
                      from={item.leadStage}
                      name={
                        getFirstLetterUpperCase(item.firstName) +
                        " " +
                        getFirstLetterUpperCase(item.lastName)
                      }
                      navigator={navigation}
                      uniqueId={item.leadId}
                      type={
                        item.leadStage === "ENQUIRY"
                          ? "Enq"
                          : item.leadStage === "BOOKING"
                          ? "Book"
                          : "PreBook"
                      }
                      status={""}
                      created={item.modifiedDate}
                      dmsLead={item.salesConsultant}
                      phone={item.phone}
                      source={item.enquirySource}
                      model={item.model}
                      leadStatus={item.leadStatus}
                      leadStage={item.leadStage}
                      needStatus={"YES"}
                      enqCat={item.enquiryCategory}
                      onItemPress={() => {
                        navigation.navigate(
                          AppNavigator.EmsStackIdentifiers.task360,
                          {
                            universalId: item.universalId,
                            mobileNo: item.phone,
                            leadStatus: item.leadStatus,
                          }
                        );
                      }}
                      onDocPress={() => {
                        let route =
                          AppNavigator.EmsStackIdentifiers.detailsOverview;
                        switch (item.leadStage) {
                          case "BOOKING":
                            route =
                              AppNavigator.EmsStackIdentifiers.bookingForm;
                            break;
                          case "PRE_BOOKING":
                          case "PREBOOKING":
                            route =
                              AppNavigator.EmsStackIdentifiers.preBookingForm;
                            break;
                        }
                        console.log(route);
                        navigation.navigate(route, {
                          universalId: item.universalId,
                          enqDetails: item,
                          leadStatus: item.leadStatus,
                          leadStage: item.leadStage,
                        });
                      }}
                    />
                  </View>
                </>
              );
            }}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          setLoader(true);
          setRefreshed(true);
          onRefresh();
        }}
        style={[
          GlobalStyle.shadow,
          styles.floatingBtn,
          {
            bottom: 85,
          },
        ]}
      >
        <Entypo size={30} name="refresh" color={Colors.WHITE} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(AppNavigator.EmsStackIdentifiers.newEnquiry);
        }}
        style={[GlobalStyle.shadow, styles.floatingBtn]}
      >
        <Entypo size={35} name="plus" color={Colors.WHITE} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LeadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  view1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    backgroundColor: Colors.WHITE,
  },
  text1: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.RED,
  },
  view2: {
    flexDirection: "row",
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: Colors.GRAY,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  searchBar: { height: 40 },
  button: {
    borderRadius: 0,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: Colors.RED,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 8,
    textAlign: "center",
  },
  calContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // paddingHorizontal: 20
    justifyContent: "center",
    alignItems: "center",
  },
  calView1: {
    backgroundColor: Colors.WHITE,
    width: "80%",
  },
  calView2: {
    height: 50,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  floatingBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 65,
    backgroundColor: "rgba(255,21,107,6)",
    borderRadius: 100,
  },
});
