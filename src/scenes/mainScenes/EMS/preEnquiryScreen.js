import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, Pressable, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { PreEnquiryItem, PageControlItem, EmptyListView } from '../../../pureComponents';
import { Colors, GlobalStyle } from '../../../styles';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Searchbar } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
// import { CREATE_NEW } from '../../../assets/svg';
import CREATE_NEW from '../../../assets/images/create_new.svg';

import { AppNavigator } from '../../../navigations';
import { CallUserComponent, SortAndFilterComp, DateRangeComp, DatePickerComponent } from '../../../components';
import { callPressed, getPreEnquiryData, setPreEnquiryList, getMorePreEnquiryData } from '../../../redux/preEnquiryReducer';
import { updateTAB, updateIsSearch, updateSearchKey } from '../../../redux/appReducer';
import * as AsyncStore from '../../../asyncStore';
import realm from '../../../database/realm';
import { callNumber } from '../../../utils/helperFunctions';
import moment from "moment";
import {
    Category_Type_List_For_Filter,
    Category_Type,
} from "../../../jsonData/enquiryFormScreenJsonData";
import { MyTaskNewItem } from '../MyTasks/components/MyTasksNewItem';
import { getLeadsList, getStatus } from '../../../redux/leaddropReducer';
import { useIsFocused } from '@react-navigation/native';

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").endOf('month').format(dateFormat)
const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);

const PreEnquiryScreen = ({ route, navigation }) => {
    const moduleType = route?.params?.moduleType ? route?.params?.moduleType : null;
    const selector = useSelector(state => state.preEnquiryReducer);
    const appSelector = useSelector(state => state.appReducer);
    const { vehicle_model_list_for_filters, source_of_enquiry_list } = useSelector(state => state.homeReducer);
    const dispatch = useDispatch();
    const [vehicleModelList, setVehicleModelList] = useState(vehicle_model_list_for_filters);
    const [sourceList, setSourceList] = useState(source_of_enquiry_list);
    const [categoryList, setCategoryList] = useState(Category_Type);
    const [employeeId, setEmployeeId] = useState("");
    const [orgId, setOrgId] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");
    const [sortAndFilterVisible, setSortAndFilterVisible] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [defualtLeadStage, setDefualtLeadStage] = useState([]);
    const [defualtLeadStatus, setdefualtLeadStatus] = useState([]);
    const [loader, setLoader] = useState(false);

    const [tempVehicleModelList, setTempVehicleModelList] = useState([]);
    const [tempSourceList, setTempSourceList] = useState([]);
    const [tempCategoryList, setTempCategoryList] = useState([]);

    const orgIdStateRef = React.useRef(orgId);
    const empIdStateRef = React.useRef(employeeId);
    const fromDateRef = React.useRef(selectedFromDate);
    const toDateRef = React.useRef(selectedToDate);

    const isFocused = useIsFocused();

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

    // useEffect(() => {
    //     if (route && route.params) {
    //         alert('---> ' + moduleType);
    //     }
    // }, [route])

    useEffect(async () => {
        setLoader(true);
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
        // Promise.all([dispatch(getStatus())]).then((res) => {
        //     let contact = res[0].payload.filter((e) => e.menu === "Contact");
        //     let newIndex = contact[0].allLeadsSubstagesEntity;
        //     setDefualtLeadStage(newIndex[0].leadStage ? newIndex[0].leadStage : []);
        //     setdefualtLeadStatus(newIndex[0].leadStatus ? newIndex[0].leadStatus : []);
        //     console.log('GDFDB: 1');
        //     getDataFromDB(newIndex[0].leadStage ? newIndex[0].leadStage : [], newIndex[0].leadStatus ? newIndex[0].leadStatus : []);
        // }).catch((err) => {
        //     console.log(err);
        //     setLoader(false);
        // })
        // getAsyncData().then(data => {
        //     if (isMounted) {
        //         setMyState(data);
        //         getPreEnquiryListFromServer(empIdStateRef.current, lastMonthFirstDate, currentDate);
        //     }
        // });

        // return () => { isMounted = false };
    }, [])

    const getDataFromDB = async (leadStage, leadStatus) => {
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        const dateFormat = "YYYY-MM-DD";
        // const currentDate = moment().add(0, "day").format(dateFormat)
        let currentDateLocal = currentDate;
        let lastMonthFirstDateLocal = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        if (route && route.params && route.params.moduleType) {
            lastMonthFirstDateLocal = route?.params?.moduleType === 'live-leads' ? '2021-01-01' : lastMonthFirstDateLocal;
            currentDateLocal = route?.params?.moduleType === 'live-leads' ? moment().format(dateFormat) : currentDate;
            setFromDateState(lastMonthFirstDateLocal);
            setToDateState(currentDateLocal);
        } else {
            setFromDateState(lastMonthFirstDate);
            setToDateState(currentDate);
        }
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            // setEmployeeId(jsonObj.empId);
            // onTempFliter(jsonObj.empId, lastMonthFirstDate, currentDate, [], [], [], leadStage, leadStatus);
            getPreEnquiryListFromServer(jsonObj.empId, lastMonthFirstDateLocal, currentDateLocal);
        }
    }

    useEffect(() => {
        setSearchQuery('');
        console.log('selector.pre_enquiry_list----->', selector.pre_enquiry_list);
        if (selector.pre_enquiry_list.length > 0) {
            setSearchedData(selector.pre_enquiry_list)
            // console.log("PreEnquiryAfterScreen:", selector.pre_enquiry_list[0])
        }
        else {
            setSearchedData([])
        }
    }, [selector.pre_enquiry_list]);

    useEffect(() => {
        navigation.addListener('focus', () => {
            // getAsyncData(lastMonthFirstDate, currentDate).then(data => {
            //     console.log(data)
            // });
            if (route && route.params && route.params.moduleType) {
                const liveLeadsStartDate = route?.params?.moduleType === 'live-leads' ? '2021-01-01' : lastMonthFirstDate;
                const liveLeadsEndDate = route?.params?.moduleType === 'live-leads' ? moment().format(dateFormat) : currentDate;
                setFromDateState(liveLeadsStartDate);
                setToDateState(liveLeadsEndDate);
            } else {
                setFromDateState(lastMonthFirstDate);
                setToDateState(currentDate);
            }
            console.log("DATE &&&&", fromDateRef.current, toDateRef.current, lastMonthFirstDate, currentDate)
            getDataFromDB()});

        // return () => {
        //     unsubscribe;
        // };
    }, [navigation]);

    useEffect(() => {
        if (appSelector.isSearch) {
            dispatch(updateIsSearch(false))
            if (appSelector.searchKey !== '') {
                let tempData = []
                tempData = selector.pre_enquiry_list.filter((item) => {
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
                })
                setSearchedData([]);
                setSearchedData(tempData);
                dispatch(updateSearchKey(''))
            }
            else {
                setSearchedData([]);
                setSearchedData(selector.pre_enquiry_list);
            }
        }
    }, [appSelector.isSearch])

    const getPreEnquiryListFromDB = () => {
        const data = realm.objects('PRE_ENQUIRY_TABLE');
        dispatch(setPreEnquiryList(JSON.stringify(data)));
    }

    const getAsyncData = async () => {
        let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
        let orgId = await AsyncStore.getData(AsyncStore.Keys.ORG_ID);

        return { empId, orgId };
        // if (empId) {
        //     getPreEnquiryListFromServer(empId, startDate, endDate);
        //     setEmployeeId(empId);
        //     setOrgId(orgId);
        // }
    }

    const getPreEnquiryListFromServer = (empId, startDate, endDate) => {
        const payload = getPayloadData(empId, startDate, endDate, 0);
        console.log("payload called", payload)
        dispatch(getPreEnquiryData(payload));
    }

    const onTempFliter = async (id, from, to, modelData, categoryFilters, sourceData, leadStage, leadStatus) => {
        setLoader(true);
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            let categoryType = [];
            let sourceOfEnquiry = [];
            let model = [];
            if (modelData || categoryFilters || sourceData) {
                for (let i = 0; i < sourceData.length; i++) {
                    let x = {
                        id: sourceData[i].id,
                        name: sourceData[i].name,
                        orgId: jsonObj.orgId
                    }
                    sourceOfEnquiry.push(x);
                }
                for (let i = 0; i < categoryFilters.length; i++) {
                    let x = {
                        id: categoryFilters[i].id,
                        name: categoryFilters[i].name,
                    }
                    categoryType.push(x);
                }
                for (let i = 0; i < modelData.length; i++) {
                    let x = {
                        id: modelData[i].id,
                        name: modelData[i].name,
                    }
                    model.push(x);
                }
            } else {
                for (let i = 0; i < sourceList.length; i++) {
                    let x = {
                        id: sourceList[i].id,
                        name: sourceList[i].name,
                        orgId: jsonObj.orgId
                    }
                    sourceOfEnquiry.push(x);
                }
                for (let i = 0; i < categoryList.length; i++) {
                    let x = {
                        id: categoryList[i].id,
                        name: categoryList[i].name,
                    }
                    categoryType.push(x);
                }
                for (let i = 0; i < vehicleModelList.length; i++) {

                    let x = {
                        id: vehicleModelList[i].id,
                        name: vehicleModelList[i].key,
                    }
                    model.push(x);
                }
            }

            let newPayload = {
                "startdate": from ? from : selectedFromDate,
                "enddate": to ? to : selectedToDate,
                "model": modelData ? modelData : [],
                "categoryType": [],
                "sourceOfEnquiry": sourceData ? sourceData : [],
                "empId": jsonObj.empId,
                "status": "",
                "offset": 0,
                "limit": 500,
                "leadStage": leadStage ? leadStage : defualtLeadStage,
                "leadStatus": leadStatus ? leadStatus : defualtLeadStatus
            };
            Promise.all([dispatch(getLeadsList(newPayload))]).then((response) => {
                setLoader(false);
                let newData = response[0].payload?.dmsEntity?.leadDtoPage?.content;
                setSearchedData(newData);
            })
                .catch((error) => {
                    console.log(error);
                    setLoader(false);
                });
        }
    }


    const getPayloadData = (empId, startDate, endDate, offSet, modelFilters = [], categoryFilters = [], sourceFilters = []) => {
        let payload = new Object();
        payload = {
            "startdate": startDate,
            "enddate": endDate,
            "model": modelFilters,
            "categoryType": categoryFilters,
            "sourceOfEnquiry": sourceFilters,
            "empId": empId,
            "status": "PREENQUIRY",
            "offset": offSet,
            "limit": 500,
        }
        return payload;
    }

    const getMorePreEnquiryListFromServer = async () => {
        if (selector.isLoadingExtraData) { return }
        if (employeeId && ((selector.pageNumber + 1) < selector.totalPages)) {
            const payload = getPayloadData(employeeId, selectedFromDate, selectedToDate, (selector.pageNumber + 1))
            dispatch(getMorePreEnquiryData(payload))
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
                // onTempFliter(employeeId, formatDate, selectedToDate, vehicleModelList, categoryList, sourceList);
                getPreEnquiryListFromServer(employeeId, formatDate, selectedToDate);
                break;
            case "TO_DATE":
                setToDateState(formatDate);
                // onTempFliter(employeeId, selectedFromDate, formatDate, vehicleModelList, categoryList, sourceList)
                getPreEnquiryListFromServer(employeeId, selectedFromDate, formatDate);
                break;
        }
    }

    const applySelectedFilters = (payload) => {
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
        setVehicleModelList([...modelFilters]);
        setSourceList([...sourceFilters]);
        // onTempFliter(employeeId, selectedFromDate, selectedToDate, modelFilters, categoryFilters, sourceFilters);
        // return
        // Make Server call
        const payload2 = getPayloadData(employeeId, selectedFromDate, selectedToDate, 0, modelFilters, categoryFilters, sourceFilters)
        dispatch(getPreEnquiryData(payload2));
    }

    // console.log({vehicleModelList})

    const renderFooter = () => {
        if (!selector.isLoadingExtraData) { return null }
        return (
            <View style={styles.footer}>
                <Text style={styles.btnText}>Loading More...</Text>
                <ActivityIndicator color={Colors.GRAY} />
            </View>
        );
    };

    const getFirstLetterUpperCase = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const onChangeSearch = query => {
        setSearchQuery(query);
        dispatch(updateSearchKey(query));
        dispatch(updateIsSearch(true));
    };

    const liveLeadsEndDate = route?.params?.moduleType === 'live-leads' ? moment().format(dateFormat) : currentDate;
    return (
        <SafeAreaView style={styles.conatiner}>

            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                maximumDate={new Date(liveLeadsEndDate.toString())}
                value={new Date(Date.now()) + 9}
                onChange={(event, selectedDate) => {
                    console.log("date: ", selectedDate);
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

            {/* <CallUserComponent
                visible={selector.modelVisible}
                onRequestClose={() => dispatch(callPressed())}
            /> */}

            <SortAndFilterComp
                visible={sortAndFilterVisible}
                // categoryList={categoryList}
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

            <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 5 }}>

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
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.text1}>{'Filter'}</Text>
                            <IconButton icon={'filter-outline'} size={20} color={Colors.RED} style={{ margin: 0, padding: 0 }} />
                        </View>
                    </Pressable>
                </View>
                {/* // filter */}
                {/*Search View*/}
                <View>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        style={styles.searchBar}
                    />
                </View>

                {searchedData && searchedData.length === 0 ? <EmptyListView title={'No Data Found'} isLoading={selector.isLoading || loader} /> :
                    <View style={[{ backgroundColor: Colors.LIGHT_GRAY, flex: 1, marginBottom: 10 }]}>
                        <FlatList
                            data={searchedData}
                            extraData={searchedData}
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={selector.isLoading}
                                    // onRefresh={() => onTempFliter(employeeId, selectedFromDate, selectedToDate, vehicleModelList, categoryList, sourceList)}
                                    onRefresh={() => getPreEnquiryListFromServer(employeeId, selectedFromDate, selectedToDate)}
                                    progressViewOffset={200}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0}
                            // onEndReached={() => {
                            //     if (appSelector.searchKey === ''){
                            //         getMorePreEnquiryListFromServer()
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
                                                from='PRE_ENQUIRY'
                                                name={getFirstLetterUpperCase(item.firstName) + " " + getFirstLetterUpperCase(item.lastName)}
                                                navigator={navigation}
                                                uniqueId={item.leadId}
                                                type='PreEnq'
                                                status={""}
                                                created={item.createdDate}
                                                dmsLead={item.createdBy}
                                                phone={item.phone}
                                                source={item.enquirySource}
                                                model={item.model}
                                                leadStatus={item.leadStatus}
                                                needStatus={"YES"}
                                                onItemPress={() => {
                                                    console.log("ENQ: ", JSON.stringify(item));
                                                    navigation.navigate(AppNavigator.EmsStackIdentifiers.task360, { universalId: item.universalId, itemData: item })
                                                }}
                                                onDocPress={() => {
                                                    console.log("ITEM:", JSON.stringify(item));
                                                    navigation.navigate(AppNavigator.EmsStackIdentifiers.confirmedPreEnq, { itemData: item, fromCreatePreEnquiry: false })
                                                }}
                                            />
                                        </View>
                                    </>
                                )
                            }}
                        />
                    </View>
                }

                <View style={[styles.addView, GlobalStyle.shadow, { justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF' }}>
                        <Pressable onPress={() => navigation.navigate(AppNavigator.EmsStackIdentifiers.addPreEnq, { fromEdit: false })}>
                            {/* <View style={[GlobalStyle.shadow, { height: 60, width: 60, borderRadius: 30, shadowRadius: 5 }]}> */}
                            {/* <VectorImage source={CREATE_NEW} width={60} height={60} color={"rgba(76,24,197,0.8)"} /> */}
                            <CREATE_NEW width={60} height={60} fill={"rgba(255,21,107,6)"} />
                            {/* </View> */}
                        </Pressable>
                    </View>
                </View>

            </View>
        </SafeAreaView >
    )
}

export default PreEnquiryScreen;

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
    },
    view1: {
        flexDirection: 'row',
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
        fontWeight: '400',
        color: Colors.RED
    },
    addView: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'white'
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
    searchBar: { height: 40 }

})
