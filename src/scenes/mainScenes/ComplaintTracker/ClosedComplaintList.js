import { SafeAreaView, StyleSheet, Text, View, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ComplaintTrackerSubFilterComp, DatePickerComponent, DateRangeComp, DropAnalysisSubFilterComp, LeadsFilterComp, SingleLeadSelectComp } from '../../../components';
import moment from 'moment';
import { Colors } from '../../../styles';
import * as AsyncStore from "../../../asyncStore";
import { IconButton, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getComplaintListFilterClosed, postDropComplaintSubMenu } from '../../../redux/complaintTrackerReducer';
import { ComplintLidtItem } from './ComplintLidtItem';
import { ComplainTrackerIdentifires } from '../../../navigations/appNavigator';
import { EmptyListView } from '../../../pureComponents';
import { RefreshControl } from 'react-native-gesture-handler';
import { updateIsSearch, updateSearchKey } from '../../../redux/appReducer';

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").format(dateFormat)
const ClosedComplaintList = (props) => {
    const selector = useSelector((state) => state.complaintTrackerReducer);
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");
    const fromDateRef = React.useRef(selectedFromDate);
    const toDateRef = React.useRef(selectedToDate);
    const [userData, setUserData] = useState({
        orgId: "",
        employeeId: "",
        employeeName: "",
        isManager: false,
        editEnable: false,
        isPreBookingApprover: false,
        isSelfManager: "",
        isCRM: false,
        isCRE: false,
    });
    const [closeComplaintList, setCloseComplaintList] = useState([])
    const appSelector = useSelector((state) => state.appReducer);   
    const [searchQuery, setSearchQuery] = useState("");
    const [leadsFilterVisible, setLeadsFilterVisible] = useState(false);
    const [leadsFilterData, setLeadsFilterData] = useState([]);
    const [leadsSubMenuFilterVisible, setLeadsSubMenuFilterVisible] =
        useState(false);
    const [subMenu, setSubMenu] = useState([]);
    const [leadsFilterDropDownText, setLeadsFilterDropDownText] = useState("All");
    const [leadsSubMenuFilterDropDownText, setLeadsSubMenuFilterDropDownText] =
        useState("All");


    // useEffect(() => {
    //     const dateFormat = "YYYY-MM-DD";
    //     const currentDate = moment().add(0, "day").format(dateFormat)
    //     const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
    //     const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
    //     setFromDateState(CurrentMonthFirstDate);
    //     setToDateState(currentMonthLastDate);
    //     getUserData()
    // }, [])
    useEffect(() => {
        props.navigation.addListener("focus", () => {
             const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        setFromDateState(CurrentMonthFirstDate);
        setToDateState(currentMonthLastDate);
        getUserData()
        });
    }, [props.navigation]);
    
    useEffect(() => {

        if (selector.closeComplainListres) {
            setCloseComplaintList(selector.closeComplainListres)
        }

    }, [selector.closeComplainListres])

    useEffect(() => {
        if (selector.complaintMainFilterData) {
            let path = selector.complaintMainFilterData;
            const newArr = path.map((v) => ({ ...v, checked: false }));
            setLeadsFilterData(newArr)
        }
    }, [selector.complaintMainFilterData])

    useEffect(() => {
        if (selector.complaintSubFilterData) {
            let path = selector.complaintSubFilterData;
            const newArr = path.map((v) => ({ ...v, checked: false }));
            // setTempStore(newArr);
            setSubMenu(newArr);
        }


    }, [selector.complaintSubFilterData])

    useEffect(() => {
        if (appSelector.isSearch) {
            dispatch(updateIsSearch(false));
            if (appSelector.searchKey !== "") {
                let tempData = [];
                tempData = selector.closeComplainListres.filter((item) => {
                 
                    return (
                        `${item.customerName}`
                            .toLowerCase()
                            .includes(appSelector.searchKey.toLowerCase())

                    );
                });
           
                // setActiveComplaintList([])
                setCloseComplaintList(tempData)
                // setSearchedData([]);
                // setSearchedData(tempData);
                dispatch(updateSearchKey(""));
            } else {
                // setActiveComplaintList([])
                setCloseComplaintList(selector.closeComplainListres)
            }
        }
    }, [appSelector.isSearch]);
    const onChangeSearch = (query) => {
        setSearchQuery(query);
        dispatch(updateSearchKey(query));
        dispatch(updateIsSearch(true));
    };
    const showDatePickerMethod = (key) => {
        setShowDatePicker(true);
        setDatePickerId(key);
    }

    const setFromDateState = date => {
        fromDateRef.current = date;
        setSelectedFromDate(date);
    }

    const setToDateState = date => {
        toDateRef.current = date;
        setSelectedToDate(date);
    }

    const getUserData = async () => {
        try {
            const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
            );

            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);

                let isManager = false,
                    editEnable = false, isCRE, isCRM;
                let isPreBookingApprover = false;
                if (
                    jsonObj.hrmsRole === "MD" ||
                    jsonObj.hrmsRole === "General Manager" ||
                    jsonObj.hrmsRole === "Manager" ||
                    jsonObj.hrmsRole === "Sales Manager" ||
                    jsonObj.hrmsRole === "branch manager"
                ) {
                    isManager = true;
                }
                if (jsonObj.roles.includes("PreBooking Approver")) {

                    editEnable = true;
                    isPreBookingApprover = true;
                }

                if (
                    jsonObj.hrmsRole === "CRE"

                ) {
                    isCRE = true;
                }

                if (
                    jsonObj.hrmsRole === "CRM"

                ) {
                    isCRM = true;
                }


                setUserData({
                    orgId: jsonObj.orgId,
                    employeeId: jsonObj.empId,
                    employeeName: jsonObj.empName,
                    isManager: isManager,
                    editEnable: editEnable,
                    isPreBookingApprover: isPreBookingApprover,
                    isSelfManager: jsonObj.isSelfManager,
                    isCRM: isCRM,
                    isCRE: isCRE,
                });

                // let payload = getPayloadData();
                const dateFormat = "YYYY-MM-DD";
                const currentDate = moment().add(0, "day").format(dateFormat)
                const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                const payload = {
                    "orgId": jsonObj.orgId,
                    "loginUser": jsonObj.empName,
                    "startDate": CurrentMonthFirstDate,
                    "endDate": currentMonthLastDate,
                    "status": "Closed"
                }
                dispatch(getComplaintListFilterClosed(payload))

            }
        } catch (error) {
            alert(error);
        }
    };
    const getFirstLetterUpperCase = (name) => {
        return name?.charAt(0).toUpperCase() + name?.slice(1);
    };

    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "FROM_DATE":
                setFromDateState(formatDate);
                const payload = getPayloadData(formatDate, selectedToDate);
                dispatch(getComplaintListFilterClosed(payload))
            case "TO_DATE":
                setToDateState(formatDate);
                const payload2 = getPayloadData(selectedFromDate, formatDate);
                dispatch(getComplaintListFilterClosed(payload2))
                break;
        }
    }
    const getPayloadData = (startdate, toDate, mainMenu, subMenu) => {


        const payload = {
            "orgId": userData.orgId,
            "loginUser": userData.employeeName,
            "startDate": startdate,
            "endDate": toDate,
            "status": "Closed",
            "mainManu": mainMenu,
            "subManu": subMenu
        }
        return payload;
    }

    const initialCallToserver=()=>{
        // let payload = getPayloadData();
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        setFromDateState(CurrentMonthFirstDate);
        setToDateState(currentMonthLastDate);
        const payload = {
            "orgId": userData.orgId,
            "loginUser": userData.employeeName,
            "startDate": CurrentMonthFirstDate,
            "endDate": currentMonthLastDate,
            "status": "Closed",
            "mainManu": "",
            "subManu": ""
        }
        dispatch(getComplaintListFilterClosed(payload))
    }

    const renderItem = ({ item, index }) => {
        return (
            <>
                <View style={{}}>
                    <ComplintLidtItem
                        ageing={item.ageing}
                        from={"CLOSED_LIST"}
                        name={
                            getFirstLetterUpperCase(item.customerName)
                        }
                        navigator={props.navigation}


                        created={item.createdDate}
                        salesExecutiveName={item.salesExecutiveName}
                        phone={item.mobileNo}
                        source={item.complaintFactor}
                        model={item.model}
                        userData={userData.hrmsRole}

                        onItemPress={() => {

                        }}
                        onDocPress={(from) => {
                            props.navigation.navigate(ComplainTrackerIdentifires.addEditComplaint, {
                                from: from,
                                complaintId: item.id
                            });
                        }}
                        complaintID={item.id}
                    />
                </View>
            </>
        );
    };

    const getSubMenuList = (name) => {
        //    call secound API here 
        const tempPayload = {
            "menu": name,
            "orgId": userData.orgId,
            "userId": userData.employeeId

        }
        dispatch(postDropComplaintSubMenu(tempPayload))

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                maximumDate={new Date(currentDate.toString())}
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
            <SingleLeadSelectComp
                isContactVisible={true}
                visible={leadsFilterVisible}
                modelList={leadsFilterData}
                submitCallback={(x) => {
                    setLeadsSubMenuFilterDropDownText("All")
                    setLeadsFilterData([...x]);
                    setLeadsFilterVisible(false);
                    const data = x.filter((y) => y.checked);
                    if (data.length === 3) {
                        setLeadsFilterDropDownText("All");
                    } else {
                        const names = data.map((y) => y.menu);
                        getSubMenuList(names.toString());
                        setLeadsFilterDropDownText(names.toString());
                    }
                }}
                cancelClicked={() => {
                    setLeadsFilterVisible(false);
                }}
                selectAll={async () => {
                    setSubMenu([]);
                    //   getDropAnalysisWithFilterFromServer();
                    setLeadsFilterDropDownText("All")
                    setLeadsSubMenuFilterDropDownText("All");
                    let path = selector.complaintMainFilterData;

                    const newArr = path.map((v) => ({ ...v, checked: false }));
                    setLeadsFilterData(newArr);

                    const dateFormat = "YYYY-MM-DD";
                    const currentDate = moment().add(0, "day").format(dateFormat)
                    const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                    const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                    setFromDateState(CurrentMonthFirstDate);
                    setToDateState(currentMonthLastDate);
                    initialCallToserver()
                }}
            />
            <ComplaintTrackerSubFilterComp
                visible={leadsSubMenuFilterVisible}
                modelList={subMenu}
                submitCallback={(x) => {
                    setSubMenu([...x]);

                    setLeadsSubMenuFilterVisible(false);
                    const data = x.filter((y) => y.checked);

                    // if (data.length === subMenu.length) {
                    //     setLeadsSubMenuFilterDropDownText("All");
                    // } else {
                    const names = data.map((y) => y?.menu);
                    setLeadsSubMenuFilterDropDownText(
                        names.toString() ? names.toString() : "Select Sub Menu"
                    );
                    let tmpArr = [];
                    data.map((item) =>
                        tmpArr.push(item.leadStage)
                    )
                    const payload = getPayloadData(selectedFromDate, selectedToDate, leadsFilterDropDownText, names.toString());
                    dispatch(getComplaintListFilterClosed(payload))
                    //   getDropAnalysisWithFilterFromServerFilterApply(selectedFromDate, selectedToDate, ...tmpArr, null)
                    // }
                }}
                cancelClicked={() => {
                    setLeadsSubMenuFilterVisible(false);
                }}
                onChange={(x) => {

                }}
            />

            <View style={styles.view1}>
                <View style={{ width: "100%" }}>
                    <DateRangeComp
                        fromDate={selectedFromDate}
                        toDate={selectedToDate}
                        fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
                        toDateClicked={() => showDatePickerMethod("TO_DATE")}
                    />
                </View>
                {/* <Pressable onPress={() => {}}>
                    <View style={styles.filterView}>
                        <Text style={styles.text1}>{"Filter"}</Text>
                        <IconButton
                            icon={"filter-outline"}
                            size={16}
                            color={Colors.RED}
                            style={{ margin: 0, padding: 0 }}
                        />
                    </View>
                </Pressable> */}
                <View style={styles.fliterView}>
                    <View style={{ width: '49%' }}>
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
            {closeComplaintList.length <= 0 ?
                <EmptyListView
                    title={"No Data Found"}
                    isLoading={selector.isLoading}
                /> : <View style={[styles.flatlistView]}>
                    <FlatList

                        initialNumToRender={closeComplaintList.length}
                        data={closeComplaintList}
                        extraData={closeComplaintList}
                        keyExtractor={(item, index) => index.toString()}
                          refreshControl={
                              <RefreshControl
                                  refreshing={selector.isExtraLoading}
                                  onRefresh={() => initialCallToserver()}
                                  progressViewOffset={200}
                              />
                          }
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0}
                        onEndReached={() => {
                            //   if (searchQuery === "") {
                            //       getMoreEnquiryListFromServer();
                            //   }
                        }}
                        //   ListFooterComponent={renderFooter}
                        renderItem={renderItem}
                    />
                </View>}
          
        </SafeAreaView>
    )
}

export default ClosedComplaintList

const styles = StyleSheet.create({
    view1: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        backgroundColor: Colors.WHITE,
    },
    filterView: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.BORDER_COLOR,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: Colors.WHITE,
        paddingLeft: 8,
        height: 50,
        justifyContent: "center",
    }, txt1: {
        width: "80%",
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontSize: 12,
        fontWeight: "600",
    },
    text1: {
        fontSize: 16,
        fontWeight: "400",
        color: Colors.RED,
    },
    flatlistView: {
        backgroundColor: Colors.LIGHT_GRAY,
        marginBottom: 10,
        flex:1

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
        width: "100%",
        alignItems: "center",
    },
})