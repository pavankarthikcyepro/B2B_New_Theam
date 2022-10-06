import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Platform,
    Pressable,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {IconButton, Searchbar} from "react-native-paper";
import {EmptyListView} from "../../../pureComponents";
import {DatePickerComponent, DateRangeComp, SortAndFilterComp} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {Colors} from "../../../styles";
import {AppNavigator} from '../../../navigations';
import * as AsyncStore from '../../../asyncStore';
import {getEnquiryList, getMoreEnquiryList} from "../../../redux/enquiryReducer";
import moment from "moment";
import {Category_Type_List_For_Filter} from '../../../jsonData/enquiryFormScreenJsonData';
import {MyTaskNewItem} from '../MyTasks/components/MyTasksNewItem';
import {updateIsSearch, updateSearchKey} from '../../../redux/appReducer';
import {getPreBookingData} from "../../../redux/preBookingReducer";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").format(dateFormat)
const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);

const LeadsScreen = ({navigation}) => {

    const selector = useSelector((state) => state.enquiryReducer);
    const appSelector = useSelector(state => state.appReducer);
    const {vehicle_model_list_for_filters, source_of_enquiry_list} = useSelector(state => state.homeReducer);
    const dispatch = useDispatch();
    const [vehicleModelList, setVehicleModelList] = useState(vehicle_model_list_for_filters);
    const [sourceList, setSourceList] = useState(source_of_enquiry_list);
    const [categoryList, setCategoryList] = useState(Category_Type_List_For_Filter);
    const [employeeId, setEmployeeId] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");
    const [sortAndFilterVisible, setSortAndFilterVisible] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [orgId, setOrgId] = useState("");
    const [searchQuery, setSearchQuery] = useState('');
    const [leadsFilterVisible, setLeadsFilterVisible] = useState(false);
    const [leadsFilterData, setLeadsFilterData] = useState([]);
    const [leadsFilterDropDownText, setLeadsFilterDropDownText] = useState('All');
    const [leadsList, setLeadsList] = useState([]);

    const orgIdStateRef = React.useRef(orgId);
    const empIdStateRef = React.useRef(employeeId);
    const fromDateRef = React.useRef(selectedFromDate);
    const toDateRef = React.useRef(selectedToDate);

    const leadsFilterDataMain = [
        // {
        //     id: 0,
        //     title: "All",
        //     checked: false
        // },
        {
            id: 1,
            title: "Enquiry",
            checked: true
        },
        {
            id: 2,
            title: "Booking Approval",
            checked: true
        },
        {
            id: 3,
            title: "Booking",
            checked: true
        },

    ]

    const setFromDateState = date => {
        fromDateRef.current = date;
        setSelectedFromDate(date);
    }

    const setToDateState = date => {
        toDateRef.current = date;
        setSelectedToDate(date);
    }

    useEffect(() => {
        if (appSelector.isSearch) {
            dispatch(updateIsSearch(false))
            if (appSelector.searchKey !== '') {
                let tempData = []
                tempData = leadsList.filter((item) => {
                    if (item.leadStage.toLowerCase() === 'prebooking') {
                        item.leadStage = 'booking approval';
                    }
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
                        item.leadStage
                            .toLowerCase()
                            .includes(appSelector.searchKey.toLowerCase()) ||
                        item.model
                            .toLowerCase()
                            .includes(appSelector.searchKey.toLowerCase())
                    );
                })
                setSearchedData([]);
                setSearchedData(tempData);
                dispatch(updateSearchKey(''))
            } else {
                setSearchedData([]);
                setSearchedData(leadsList);
            }
        }
    }, [appSelector.isSearch])

    useEffect(async () => {
        // Get Data From Server
        let isMounted = true;
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
    }, [])

    // Navigation Listner to Auto Referesh
    useEffect(async () => {
        navigation.addListener('focus', async () => {
            setFromDateState(lastMonthFirstDate);
            const tomorrowDate = moment().add(1, "day").format(dateFormat)
            setToDateState(currentDate);
            setLeadsFilterData([...leadsFilterDataMain]);
            await applyLeadsFilter(leadsFilterDataMain, lastMonthFirstDate, currentDate);
        });
    }, [navigation]);


    const getPayloadData = (leadType, empId, startDate, endDate, offSet = 0, modelFilters = [], categoryFilters = [], sourceFilters = []) => {
        // const type = {enq: "ENQUIRY", bkgAprvl: 'PRE_BOOKING', bkg: 'BOOKING'}
        return {
            "startdate": startDate,
            "enddate": endDate,
            "model": modelFilters,
            "categoryType": categoryFilters,
            "sourceOfEnquiry": sourceFilters,
            "empId": empId,
            "status": leadType,
            "offset": offSet,
            "limit": 500,
        };
    }

    const getMoreEnquiryListFromServer = async () => {
        if (selector.isLoadingExtraData) {
            return
        }
        if (employeeId && ((selector.pageNumber + 1) < selector.totalPages)) {
            const payload = getPayloadData(employeeId, selectedFromDate, selectedToDate, (selector.pageNumber + 1))
            dispatch(getMoreEnquiryList(payload));
        }
    }

    const showDatePickerMethod = (key) => {
        setShowDatePicker(true);
        setDatePickerId(key);
    }

    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "FROM_DATE":
                setFromDateState(formatDate);
                // getEnquiryListFromServer(employeeId, formatDate, selectedToDate);
                applyLeadsFilter(leadsFilterData, formatDate, selectedToDate);
                break;
            case "TO_DATE":
                setToDateState(formatDate);
                // getEnquiryListFromServer(employeeId, selectedFromDate, formatDate);
                applyLeadsFilter(leadsFilterData, selectedFromDate, formatDate);
                break;
        }
    }

    const applySelectedFilters = payload => {
        const modelData = payload.model;
        const sourceData = payload.source;
        const categoryData = payload.category;

        const categoryFilters = [];
        const modelFilters = [];
        const sourceFilters = [];

        categoryData.forEach(element => {
            if (element.isChecked) {
                categoryFilters.push({
                    id: element.id,
                    name: element.name
                })
            }
        });
        modelData.forEach(element => {
            if (element.isChecked) {
                modelFilters.push({
                    id: element.id,
                    name: element.value
                })
            }
        });
        sourceData.forEach(element => {
            if (element.isChecked) {
                sourceFilters.push({
                    id: element.id,
                    name: element.name,
                    orgId: orgId
                })
            }
        });

        setCategoryList([...categoryFilters])
        setVehicleModelList([...modelData]);
        setSourceList([...sourceData]);

        // // Make Server call
        // const payload2 = getPayloadData(employeeId, selectedFromDate, selectedToDate, 0, modelFilters, categoryFilters, sourceFilters)
        // dispatch(getEnquiryList(payload2));
        applyLeadsFilter(leadsFilterData, selectedFromDate, selectedToDate, modelFilters, categoryFilters, sourceFilters)
    }

    const applyLeadsFilter = async (data, startDate, endDate, modelFilters = [], categoryFilters = [], sourceFilters = []) => {
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const leadsData = data.filter(x => x.checked);
            const payload1 = getPayloadData('ENQUIRY', jsonObj.empId, startDate, endDate, 0, modelFilters, categoryFilters, sourceFilters)
            const payload2 = getPayloadData('PREBOOKING', jsonObj.empId, startDate, endDate, 0, modelFilters, categoryFilters, sourceFilters)
            const payload3 = getPayloadData('BOOKING', jsonObj.empId, startDate, endDate, 0, modelFilters, categoryFilters, sourceFilters)
            let dispatchData = [];
            leadsData.forEach(x => {
                switch (x.id) {
                    case 1:
                        dispatchData.push(dispatch(getEnquiryList(payload1)))
                        break;
                    case 2:
                        dispatchData.push(dispatch(getEnquiryList(payload2)))
                        break;
                    case 3:
                        dispatchData.push(dispatch(getEnquiryList(payload3)))
                        break;
                    default:
                        dispatchData = [
                            dispatch(getEnquiryList(payload1)),
                            dispatch(getPreBookingData(payload2)),
                            dispatch(getPreBookingData(payload3)),
                        ]
                        break;

                }
            })
            Promise.all(dispatchData).then(([data1, data2, data3]) => {
                let data = []
                leadsData.filter((x, i) => {
                    switch (i) {
                        case 0:
                            data = [...data, ...data1.payload.dmsEntity.leadDtoPage.content];
                            break;
                        case 1:
                            data = [...data, ...data2.payload.dmsEntity.leadDtoPage.content];
                            break;
                        case 2:
                            data = [...data, ...data3.payload.dmsEntity.leadDtoPage.content];
                            break;
                    }
                });
                const dataSorted = data.sort((x, y) => y.modifiedDate - x.modifiedDate);
                setLeadsList([...dataSorted]);
                setSearchedData([]);
                setSearchedData(dataSorted);
            });
        }


    }

    const renderFooter = () => {
        if (!selector.isLoadingExtraData) {
            return null
        }
        return (
            <View style={styles.footer}>
                <Text style={styles.btnText}>Loading More...</Text>
                <ActivityIndicator color={Colors.GRAY}/>
            </View>
        );
    };

    const getFirstLetterUpperCase = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    const onChangeSearch = query => {
        setSearchQuery(query);
        dispatch(updateSearchKey(query));
        dispatch(updateIsSearch(true));
    };

    function applyDateFilter(from, to) {
        updateSelectedDate(from, 'FROM_DATE');
        updateSelectedDate(to, 'TO_DATE');
        setShowDatePicker(false);
        setTimeout(() => {
            applyLeadsFilter(leadsFilterData, from, to);
        }, 500);
    }

    return (
        <SafeAreaView style={styles.container}>

            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                value={new Date(Date.now())}
                onChange={(event, selectedDate) => {
                    setShowDatePicker(false)
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
                    applySelectedFilters(payload);
                    setSortAndFilterVisible(false);
                }}
                onRequestClose={() => {
                    setSortAndFilterVisible(false);
                }}
            />

            <View style={styles.view1}>
                <View style={{width: "80%"}}>
                    <DateRangeComp
                        fromDate={selectedFromDate}
                        toDate={selectedToDate}
                        fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
                        toDateClicked={() => showDatePickerMethod("TO_DATE")}
                    />
                </View>
                <Pressable onPress={() => setSortAndFilterVisible(true)}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.text1}>{'Filter'}</Text>
                        <IconButton icon={'filter-outline'} size={20} color={Colors.RED}
                                    style={{margin: 0, padding: 0}}/>
                    </View>
                </Pressable>
            </View>
            {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>*/}
            {/*    <LeadsStageFilter leadsFilterDropDownText={'All'} onStageClick={() => alert('Hi')}/>*/}

            {/*    <Pressable onPress={() => {*/}
            {/*        setLeadsFilterVisible(true);*/}
            {/*    }}>*/}
            {/*        <View style={{*/}
            {/*            borderWidth: 0.5,*/}
            {/*            borderColor: Colors.RED,*/}
            {/*            borderRadius: 4,*/}
            {/*            flexDirection: 'row',*/}
            {/*            justifyContent: 'space-between',*/}
            {/*            alignItems: 'center'*/}
            {/*        }}>*/}
            {/*            <Text style={{paddingHorizontal: 4, paddingVertical: 2, fontSize: 12}}*/}
            {/*                  numberOfLines={2}>{leadsFilterDropDownText}</Text>*/}
            {/*            <IconButton icon={leadsFilterVisible ? 'chevron-up' : 'chevron-down'} size={20}*/}
            {/*                        color={Colors.RED}*/}
            {/*                        style={{margin: 0, padding: 0, width: '30%'}}/>*/}
            {/*        </View>*/}
            {/*    </Pressable>*/}
            {/*</View>*/}
            <View>
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>
            {searchedData.length === 0 ? <EmptyListView title={"No Data Found"} isLoading={selector.isLoading}/> :
                <View style={[{backgroundColor: Colors.LIGHT_GRAY, flex: 1, marginBottom: 10}]}>
                    <FlatList
                        data={searchedData}
                        extraData={searchedData}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={(
                            <RefreshControl
                                refreshing={selector.isLoading}
                                // onRefresh={() => getEnquiryListFromServer(employeeId, selectedFromDate, selectedToDate)}
                                progressViewOffset={200}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        onEndReachedThreshold={0}
                        // onEndReached={() => {
                        //     if (appSelector.searchKey === '') {
                        //         getMoreEnquiryListFromServer()
                        //     }
                        // }}
                        ListFooterComponent={renderFooter}
                        renderItem={({item, index}) => {
                            let color = Colors.WHITE;
                            if (index % 2 !== 0) {
                                color = Colors.LIGHT_GRAY;
                            }
                            return (
                                <>
                                    <View>
                                        <MyTaskNewItem
                                            from={item.leadStage}
                                            name={getFirstLetterUpperCase(item.firstName) + " " + getFirstLetterUpperCase(item.lastName)}
                                            navigator={navigation}
                                            uniqueId={item.leadId}
                                            type={item.leadStage === 'ENQUIRY' ? 'Enq' : item.leadStage === 'BOOKING' ? 'Book' : 'PreBook'}
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
                                                navigation.navigate(AppNavigator.EmsStackIdentifiers.task360, {
                                                    universalId: item.universalId,
                                                    mobileNo: item.phone,
                                                    leadStatus: item.leadStatus
                                                })
                                            }}
                                            onDocPress={() => {
                                                let route = AppNavigator.EmsStackIdentifiers.detailsOverview;
                                                switch (item.leadStage) {
                                                    case 'BOOKING':
                                                        route = AppNavigator.EmsStackIdentifiers.bookingForm;
                                                        break;
                                                    case 'PRE_BOOKING':
                                                    case 'PREBOOKING':
                                                        route = AppNavigator.EmsStackIdentifiers.preBookingForm;
                                                        break;

                                                }
                                                navigation.navigate(route, {
                                                    universalId: item.universalId,
                                                    enqDetails: item,
                                                    leadStatus: item.leadStatus,
                                                    leadStage: item.leadStage
                                                })
                                            }}
                                        />
                                    </View>
                                </>
                            );
                        }}
                    />
                </View>}
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
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY,
        backgroundColor: Colors.WHITE
    },
    text1: {
        fontSize: 16,
        fontWeight: '400',
        color: Colors.RED
    },
    view2: {
        flexDirection: "row",
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: Colors.GRAY,
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 5
    },
    searchBar: {height: 40},
    button: {
        borderRadius: 0,
        padding: 10,
        elevation: 2
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
        textAlign: "center"
    },
    modalText: {
        marginBottom: 8,
        textAlign: "center"
    },
    calContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // paddingHorizontal: 20
        justifyContent: 'center',
        alignItems: 'center'
    },
    calView1: {
        backgroundColor: Colors.WHITE,
        width: '80%',
    },
    calView2: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: Colors.LIGHT_GRAY
    },
});
