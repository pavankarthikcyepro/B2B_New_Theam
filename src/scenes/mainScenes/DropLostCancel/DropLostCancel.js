import { useIsFocused } from "@react-navigation/native";
import moment from "moment";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  Alert,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import { IconButton, Searchbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  DatePickerComponent,
  DateRangeComp,
  LeadsFilterComp,
  SingleLeadSelectComp,
} from "../../../components";
import { Category_Type_List_For_Filter } from "../../../jsonData/enquiryFormScreenJsonData";
import { updateIsSearch, updateSearchKey } from "../../../redux/appReducer";
import { Colors } from "../../../styles";
import * as AsyncStore from "../../../asyncStore";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").endOf("month").format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat)
  .subtract(0, "months")
  .startOf("month")
  .format(dateFormat);

const DropLostCancelScreen = ({ route, navigation }) => {
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

  const orgIdStateRef = React.useRef(orgId);
  const empIdStateRef = React.useRef(employeeId);
  const fromDateRef = React.useRef(selectedFromDate);
  const toDateRef = React.useRef(selectedToDate);

  useEffect(async () => {
    // Get Data From Server
    let isMounted = true;
    setFromDateState(lastMonthFirstDate);
    // const tomorrowDate = moment().add(1, "day").format(dateFormat)
    setToDateState(currentDate);
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setEmployeeId(jsonObj.empId);
      setOrgId(jsonObj.orgId);
    }
  }, []);

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
            item.model
              .toLowerCase()
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

  const setFromDateState = (date) => {
    fromDateRef.current = date;
    setSelectedFromDate((x) => date);
  };

  const setToDateState = (date) => {
    toDateRef.current = date;
    setSelectedToDate((x) => date);
  };

  const getFirstLetterUpperCase = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    dispatch(updateSearchKey(query));
    dispatch(updateIsSearch(true));
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
        break;
      case "TO_DATE":
        setToDateState(formatDate);
        break;
    }
  };
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
              //   getSubMenuList(names.toString());
              setLeadsFilterDropDownText(names.toString());
            }
          }}
          cancelClicked={() => {
            setLeadsFilterVisible(false);
          }}
          selectAll={async () => {
            setSubMenu([]);
          }}
        />
        <LeadsFilterComp
          visible={leadsSubMenuFilterVisible}
          modelList={subMenu}
          submitCallback={(x) => {
            setSubMenu([...x]);
            setTempFilterPayload(x);
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
          onChange={(x) => {
           
          }}
        />
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <View style={styles.view1}>
          <View style={{ width: "50%" }}>
            <DateRangeComp
              fromDate={selectedFromDate}
              toDate={selectedToDate}
              fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
              toDateClicked={() => showDatePickerMethod("TO_DATE")}
            />
          </View>
          <View style={styles.fliterView}>
            <View style={{ width: "49%" }}>
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
                      width: "65%",
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
                    color={Colors.BLACK}
                    style={{ margin: 0, padding: 0 }}
                  />
                </View>
              </Pressable>
            </View>
            <View
              style={{
                width: "49%",
              }}
            >
              <Pressable
                onPress={() => {
                  setLeadsSubMenuFilterVisible(true);
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
                      width: "65%",
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      fontSize: 12,
                      fontWeight: "600",
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
                    color={Colors.BLACK}
                    style={{
                      margin: 0,
                      padding: 0,
                    }}
                  />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        <View>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default DropLostCancelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "center",
    backgroundColor: Colors.LIGHT_GRAY,
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
  searchBar: { height: 40 },
  fliterView: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: Colors.LIGHT_GRAY,
    paddingHorizontal: 6,
    paddingBottom: 4,
    backgroundColor: Colors.WHITE,
    marginTop: -6,
    width: "50%",
    alignItems: "center",
  },
});
