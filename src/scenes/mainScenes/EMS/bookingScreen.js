import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    FlatList,
    RefreshControl,
    Text,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { IconButton } from "react-native-paper";
import { PreEnquiryItem, EmptyListView } from "../../../pureComponents";
import {
    DateRangeComp,
    DatePickerComponent,
    SortAndFilterComp,
} from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from "../../../navigations";
import * as AsyncStore from "../../../asyncStore";
import {
    getPreBookingData,
    getMorePreBookingData,
} from "../../../redux/bookingReducer";

import { callNumber } from "../../../utils/helperFunctions";
import moment from "moment";
import { Category_Type_List_For_Filter } from "../../../jsonData/enquiryFormScreenJsonData";
import { MyTaskNewItem } from "../MyTasks/components/MyTasksNewItem";
import { updateTAB, updateIsSearch, updateSearchKey } from '../../../redux/appReducer';


const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").format(dateFormat)
const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);

const BookingScreen = ({ navigation }) => {
    const selector = useSelector((state) => state.bookingReducer);
    const appSelector = useSelector(state => state.appReducer);


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
    const [employeeId, setEmployeeId] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");
    const [sortAndFilterVisible, setSortAndFilterVisible] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [orgId, setOrgId] = useState("");

    const orgIdStateRef = React.useRef(orgId);
    const empIdStateRef = React.useRef(employeeId);
    const fromDateRef = React.useRef(selectedFromDate);
    const toDateRef = React.useRef(selectedToDate);

    const setMyState = data => {
        empIdStateRef.current = data.empId;
        orgIdStateRef.current = data.orgId;
        setEmployeeId(data.empId);
        setOrgId(data.orgId);
    };

    const setFromDateState = date => {
        fromDateRef.current = date;
        setSelectedFromDate(date);
    }

    const setToDateState = date => {
        toDateRef.current = date;
        setSelectedToDate(date);
    }


    useEffect(() => {
        if (selector.pre_booking_list.length > 0) {
            setSearchedData(selector.pre_booking_list)
        }
        else {
            setSearchedData([])
        }
    }, [selector.pre_booking_list])

    useEffect(() => {
        if (appSelector.isSearch) {
            dispatch(updateIsSearch(false))
            if (appSelector.searchKey !== '') {
                let tempData = []
                tempData = selector.pre_booking_list.filter((item) => {
                    return item.firstName.toLowerCase().includes(appSelector.searchKey.toLowerCase()) || item.lastName.toLowerCase().includes(appSelector.searchKey.toLowerCase())
                })
                setSearchedData([]);
                setSearchedData(tempData);
                dispatch(updateSearchKey(''))
            }
            else {
                setSearchedData([]);
                setSearchedData(selector.pre_booking_list);
            }
        }
    }, [appSelector.isSearch])

    useEffect(async () => {

        // Get Data From Server
        // let isMounted = true;
        setFromDateState(lastMonthFirstDate);
        const tomorrowDate = moment().add(1, "day").format(dateFormat)
        setToDateState(currentDate);

        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            setEmployeeId(jsonObj.empId);
            setOrgId(jsonObj.orgId);
        }
        // getAsyncData().then(data => {
        //     if (isMounted) {
        //         setMyState(data);
        //         getBookingListFromServer(empIdStateRef.current, lastMonthFirstDate, currentDate);
        //     }
        // });

        // return () => { isMounted = false };
    }, [])

    // Navigation Listner to Auto Referesh
    useEffect(() => {
        navigation.addListener('focus', () => {
            setFromDateState(lastMonthFirstDate);
            const tomorrowDate = moment().add(1, "day").format(dateFormat)
            setToDateState(currentDate);
            console.log("$$$$$$$$$$$$$ BOOKING SCREEN $$$$$$$$$$$$$$$");
            getDataFromDB()
        });

        // return () => {
        //     unsubscribe;
        // };
    }, [navigation]);

    const getDataFromDB = async () => {
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            // setEmployeeId(jsonObj.empId);
            getBookingListFromServer(jsonObj.empId, lastMonthFirstDate, currentDate);
        }
    }

    const getAsyncData = async () => {
        let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
        let orgId = await AsyncStore.getData(AsyncStore.Keys.ORG_ID);
        return { empId, orgId };
    }

    const getBookingListFromServer = (empId, startDate, endDate) => {
        const payload = getPayloadData(empId, startDate, endDate, 0);
        dispatch(getPreBookingData(payload));
    };

    const getPayloadData = (
        empId,
        startDate,
        endDate,
        offSet,
        modelFilters = [],
        categoryFilters = [],
        sourceFilters = []
    ) => {
        const payload = {
            startdate: startDate,
            enddate: endDate,
            model: modelFilters,
            categoryType: categoryFilters,
            sourceOfEnquiry: sourceFilters,
            empId: empId,
            status: "BOOKING",
            offset: offSet,
            limit: 500,
        };
        return payload;
    };

    const getMorePreBookingListFromServer = async () => {
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
            dispatch(getMorePreBookingData(payload));
        }
    };

    const showDatePickerMethod = (key) => {
        setShowDatePicker(true);
        setDatePickerId(key);
    };

    const getPreBookingListFromServer = (empId, startDate, endDate) => {
        const payload = getPayloadData(empId, startDate, endDate, 0)
        dispatch(getPreBookingData(payload));
    }

    const updateSelectedDate = (date, key) => {
        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "FROM_DATE":
                setFromDateState(formatDate);
                getPreBookingListFromServer(employeeId, formatDate, selectedToDate);
                break;
            case "TO_DATE":
                setToDateState(formatDate);
                getPreBookingListFromServer(employeeId, selectedFromDate, formatDate);
                break;
        }
    };

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
                    orgId: orgId
                });
            }
        });

        setCategoryList([...categoryFilters]);
        setVehicleModelList([...modelData]);
        setSourceList([...sourceData]);

        // Make Server call
        const payload2 = getPayloadData(
            employeeId,
            selectedFromDate,
            selectedToDate,
            0,
            modelFilters,
            categoryFilters,
            sourceFilters
        );
        dispatch(getPreBookingData(payload2));
    };

    const getFirstLetterUpperCase = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

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

    return (
        <SafeAreaView style={styles.container}>
            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                value={new Date(Date.now())}
                onChange={(event, selectedDate) => {
                    console.log("date: ", selectedDate);
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

            <SortAndFilterComp
                visible={sortAndFilterVisible}
                categoryList={categoryList}
                modelList={vehicleModelList}
                sourceList={sourceList}
                submitCallback={(payload) => {
                    // console.log("payload: ", payload);
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
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.text1}>{"Filter"}</Text>
                        <IconButton
                            icon={"filter-outline"}
                            size={20}
                            color={Colors.RED}
                            style={{ margin: 0, padding: 0 }}
                        />
                    </View>
                </Pressable>
            </View>

            {searchedData.length === 0 ? (
                <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} />
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
                                onRefresh={() =>
                                    getPreBookingListFromServer(
                                        employeeId,
                                        selectedFromDate,
                                        selectedToDate
                                    )
                                }
                                progressViewOffset={200}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0}
                        // onEndReached={() => {
                        //     if (appSelector.searchKey === '') {
                        //         getMorePreBookingListFromServer()
                        //     }
                        // }}
                        ListFooterComponent={renderFooter}
                        renderItem={({ item, index }) => {
                            let color = Colors.WHITE;
                            if (index % 2 != 0) {
                                color = Colors.LIGHT_GRAY;
                            }

                            return (
                                <>
                                    <View>
                                        <MyTaskNewItem
                                            from="BOOKING"
                                            name={getFirstLetterUpperCase(item.firstName) + " " + getFirstLetterUpperCase(item.lastName)}
                                            navigator={navigation}
                                            uniqueId={item.leadId} 
                                            type='Book'
                                            status={""}
                                            created={item.modifiedDate}
                                            dmsLead={item.createdBy}
                                            phone={item.phone}
                                            source={item.enquirySource}
                                            model={item.model}
                                            leadStatus={item.leadStatus}
                                            enqCat={item.enquiryCategory}
                                            onItemPress={() =>
                                                navigation.navigate(
                                                    AppNavigator.EmsStackIdentifiers.task360,
                                                    { universalId: item.universalId, mobileNo: item.phone }
                                                )
                                            }
                                            onDocPress={() => {
                                                console.log("BK DTLS:", item);
                                                navigation.navigate(
                                                    AppNavigator.EmsStackIdentifiers.bookingForm,
                                                    { universalId: item.universalId }
                                                )
                                                // navigation.navigate(
                                                //     AppNavigator.EmsStackIdentifiers.bookingForm                                            
                                                // )
                                                // alert(AppNavigator.EmsStackIdentifiers.bookingForm)
                                            }}
                                        />
                                    </View>
                                </>
                            );
                        }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default BookingScreen;

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
});
