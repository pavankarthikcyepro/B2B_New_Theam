import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, Pressable, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { PreEnquiryItem, PageControlItem, EmptyListView } from '../../../pureComponents';
import { Colors, GlobalStyle } from '../../../styles';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from 'react-native-paper';
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

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").format(dateFormat)
const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);

const PreEnquiryScreen = ({ navigation }) => {

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

        // Get Data From Server
        let isMounted = true;
        setFromDateState(lastMonthFirstDate);
        const tomorrowDate = moment().add(1, "day").format(dateFormat)
        setToDateState(currentDate);
        // getAsyncData().then(data => {
        //     if (isMounted) {
        //         setMyState(data);
        //         getPreEnquiryListFromServer(empIdStateRef.current, lastMonthFirstDate, currentDate);
        //     }
        // });

        // return () => { isMounted = false };
    }, [])

    const getDataFromDB = async () => {
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            getPreEnquiryListFromServer(jsonObj.empId, lastMonthFirstDate, currentDate);
        }
    }

    useEffect(() => {
        if (selector.pre_enquiry_list.length > 0){
            setSearchedData(selector.pre_enquiry_list)
            // console.log("PreEnquiryAfterScreen:", selector.pre_enquiry_list[0])
        }
        else{
            setSearchedData([])
        }
    }, [selector.pre_enquiry_list]);

    useEffect(() => {
        navigation.addListener('focus', () => {
            // getAsyncData(lastMonthFirstDate, currentDate).then(data => {
            //     console.log(data)
            // });
            console.log(fromDateRef.current, toDateRef.current)
            getDataFromDB()
        });

        // return () => {
        //     unsubscribe;
        // };
    }, [navigation]);

    useEffect(() => {
        if (appSelector.isSearch) {
            dispatch(updateIsSearch(false))
            if (appSelector.searchKey !== ''){
                let tempData = []
                tempData = selector.pre_enquiry_list.filter((item) => {
                    return item.firstName.toLowerCase().includes(appSelector.searchKey.toLowerCase()) || item.lastName.toLowerCase().includes(appSelector.searchKey.toLowerCase())
                })
                setSearchedData([]);
                setSearchedData(tempData);
                dispatch(updateSearchKey(''))
            }
            else{
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

        return {empId, orgId};
        // if (empId) {
        //     getPreEnquiryListFromServer(empId, startDate, endDate);
        //     setEmployeeId(empId);
        //     setOrgId(orgId);
        // }
    }

    const getPreEnquiryListFromServer = (empId, startDate, endDate) => {
        const payload = getPayloadData(empId, startDate, endDate, 0);
        console.log("payload called")
        dispatch(getPreEnquiryData(payload));
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
            "limit": 1000,
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
                getPreEnquiryListFromServer(employeeId, formatDate, selectedToDate);
                break;
            case "TO_DATE":
                setToDateState(formatDate);
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
        setVehicleModelList([...modelData]);
        setSourceList([...sourceData]);
        

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

    return (
        <SafeAreaView style={styles.conatiner}>

            <DatePickerComponent
                visible={showDatePicker}
                mode={"date"}
                value={new Date(Date.now())}
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

                {searchedData.length === 0 ? <EmptyListView title={'No Data Found'} isLoading={selector.isLoading} /> :
                    <View style={[ { backgroundColor: Colors.LIGHT_GRAY, flex: 1, marginBottom: 10 }]}>
                        <FlatList
                            data={searchedData}
                            extraData={searchedData}
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={selector.isLoading}
                                    onRefresh={() => getPreEnquiryListFromServer(employeeId, selectedFromDate, selectedToDate)}
                                    progressViewOffset={200}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0}
                            onEndReached={() => {
                                if (appSelector.searchKey === ''){
                                    getMorePreEnquiryListFromServer()
                                }
                            }}
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

                <View style={[styles.addView, GlobalStyle.shadow]}>
                    <Pressable onPress={() => navigation.navigate(AppNavigator.EmsStackIdentifiers.addPreEnq, { fromEdit: false })}>
                        {/* <View style={[GlobalStyle.shadow, { height: 60, width: 60, borderRadius: 30, shadowRadius: 5 }]}> */}
                        {/* <VectorImage source={CREATE_NEW} width={60} height={60} color={"rgba(76,24,197,0.8)"} /> */}
                        <CREATE_NEW width={60} height={60} fill={"rgba(255,21,107,6)"} />
                        {/* </View> */}
                    </Pressable>
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
})