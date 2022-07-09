import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator, Text, RefreshControl, Pressable } from "react-native";
import { PageControlItem } from "../../../pureComponents/pageControlItem";
import { IconButton } from "react-native-paper";
import {  EmptyListView } from "../../pureComponents";
import { DateRangeComp, DatePickerComponent, SortAndFilterComp } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../styles";
import { AppNavigator } from '../../navigations';
import * as AsyncStore from '../../asyncStore';
import { getLeadDropList, getMoreLeadDropList, updateSingleApproval,updateBulkApproval } from "../../redux/leaddropReducer";
import { callNumber } from "../../utils/helperFunctions";
import moment from "moment";
import { Category_Type_List_For_Filter } from '../../jsonData/enquiryFormScreenJsonData';
import { DropAnalysisItem } from './MyTasks/components/DropAnalysisItem';
import { updateTAB, updateIsSearch, updateSearchKey } from '../../redux/appReducer';

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").format(dateFormat)
const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);

const DropAnalysisScreen = ({ navigation }) => {

    const selector = useSelector((state) => state.leaddropReducer);
    const appSelector = useSelector(state => state.appReducer);
    const { vehicle_model_list_for_filters, source_of_enquiry_list } = useSelector(state => state.homeReducer);
    const dispatch = useDispatch();
    const [vehicleModelList, setVehicleModelList] = useState(vehicle_model_list_for_filters);
    const [sourceList, setSourceList] = useState(source_of_enquiry_list);
    const [categoryList, setCategoryList] = useState(Category_Type_List_For_Filter);
    const [employeeId, setEmployeeId] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [branchId, setbranchId] = useState("");

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [datePickerId, setDatePickerId] = useState("");
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");
    const [sortAndFilterVisible, setSortAndFilterVisible] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [orgId, setOrgId] = useState("");
    const [selectedItemIds, setSelectedItemIds] = useState([]);
    const [isApprovalUIVisible, setisApprovalUIVisible] = useState(false);



    const orgIdStateRef = React.useRef(orgId);
    const empIdStateRef = React.useRef(employeeId);
    const fromDateRef = React.useRef(selectedFromDate);
    const toDateRef = React.useRef(selectedToDate);

    // const setMyState = data => {
    //     empIdStateRef.current = data.empId;
    //     orgIdStateRef.current = data.orgId;
    //     setEmployeeId(data.empId);
    //     setOrgId(data.orgId);
    // };

    const setFromDateState = date => {
        fromDateRef.current = date;
        setSelectedFromDate(date);
    }

    const setToDateState = date => {
        toDateRef.current = date;
        setSelectedToDate(date);
    }

    useEffect(() => {
        if (selector.leadDropList.length > 0) {
            console.log("ENQ DATA: ", JSON.stringify(selector.leadDropList));
            setSearchedData(selector.leadDropList)
        }
        else {
            setSearchedData([])
        }
    }, [selector.leadDropList])

    useEffect(() => {
        if (selector.approvalStatus === "sucess") {
           selector.approvalStatus = ""
           setSelectedItemIds([])
           setisApprovalUIVisible(false)
            getDropListFromServer(employeeId, employeeName, branchId, orgId, selectedFromDate, selectedToDate)
        }
        else {
            selector.approvalStatus = ""
            setSelectedItemIds([])
            setisApprovalUIVisible(false)
            getDropListFromServer(employeeId, employeeName, branchId, orgId, selectedFromDate, selectedToDate)
        }
    }, [selector.approvalStatus])

    useEffect(() => {
        if (appSelector.isSearch) {
            dispatch(updateIsSearch(false))
            if (appSelector.searchKey !== '') {
                let tempData = []
                tempData = selector.leadDropList.filter((item) => {
                    return item.firstName.toLowerCase().includes(appSelector.searchKey.toLowerCase()) || item.lastName.toLowerCase().includes(appSelector.searchKey.toLowerCase())
                })
                setSearchedData([]);
                setSearchedData(tempData);
                dispatch(updateSearchKey(''))
            }
            else {
                setSearchedData([]);
                setSearchedData(selector.leadDropList);
            }
        }
    }, [appSelector.isSearch])

    useEffect(async() => {

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
            setEmployeeName(jsonObj.empName)
        }
        // getAsyncData().then(data => {
        //     if (isMounted) {
        //         setMyState(data);
        //         getEnquiryListFromServer(empIdStateRef.current, lastMonthFirstDate, currentDate);
        //     }
        // });

        // return () => { isMounted = false };
    }, [])

    // Navigation Listner to Auto Referesh
    useEffect(() => {
        navigation.addListener('focus', () => {
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
        const branchId = await AsyncStore.getData(
            AsyncStore.Keys.SELECTED_BRANCH_ID
        );
       await setbranchId(branchId)
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        if (employeeData) {
            const jsonObj = await JSON.parse(employeeData);
            // await setOrgId(jsonObj.orgId)

            // await setEmployeeName(jsonObj.empName)
            // await setEmployeeId(jsonObj.empId)
            getDropListFromServer(jsonObj.empId, jsonObj.empName, branchId, jsonObj.orgId, lastMonthFirstDate, currentDate);
        }
    }
   

    const getDropListFromServer = (empId,empName, branchId,orgId, startDate, endDate) => {
        setisApprovalUIVisible(false)
        const payload = getPayloadData(empId,empName, branchId,orgId, startDate, endDate, 0)
        dispatch(getLeadDropList(payload));
    }

    const getPayloadData = (empId,empName, branchId,orgId, startDate, endDate, offSet, modelFilters = [], categoryFilters = [], sourceFilters = []) => {
        const payload = {
            "startdate": startDate,
            "enddate": endDate,
            "model": modelFilters,
            "categoryType": categoryFilters,
            "sourceOfEnquiry": sourceFilters,
            "empId": empId,
            "empName":empName,
            "branchId":branchId,
            "status": "ENQUIRY",
            "offset": offSet,
            "orgId":orgId,
            "limit": 10,
        }
        return payload;
    }

    const getMoreEnquiryListFromServer = async () => {
        if (selector.isLoadingExtraData) {
             return }

        if (employeeId && ((selector.pageNumber + 1) <= selector.totalPages)) {
            renderFooter()
            const payload = getPayloadData(employeeId,employeeName, branchId,orgId, selectedFromDate, selectedToDate, (selector.pageNumber + 1))
            dispatch(getMoreLeadDropList(payload));
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
                getDropListFromServer(employeeId,employeeName, branchId,orgId, formatDate, selectedToDate);
                break;
            case "TO_DATE":
                setToDateState(formatDate);
                getDropListFromServer(employeeId,employeeName, branchId,orgId, selectedFromDate, formatDate);
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
        dispatch(getLeadDropList(payload2));
    }
    const updateBulkStatus = async (status)=>{
        if(status === 'reject'){
            const arr = await selectedItemIds.map(item => 
                {
                const dmsLeadDropInfo =
                             {
                                "leadId": item.dmsLeadDropInfo.leadId,
                                "leadDropId": item.dmsLeadDropInfo.leadDropId,
                                "status": "REJECTED"
                            }                        
                return { dmsLeadDropInfo }
              
                })
            await dispatch(updateBulkApproval(arr));
        } else dispatch(updateBulkApproval(selectedItemIds));

    }
    const onItemSelected = async (uniqueId, leadDropId, type, operation) =>{
        try{
            if (type === 'multi') {
                if (operation === 'add') {
                    const data = {
                        "dmsLeadDropInfo": {
                            "leadId": uniqueId,
                            "leadDropId": leadDropId,
                            "status": "APPROVED"
                        }
                    }
                    await setSelectedItemIds([...selectedItemIds, data])
                    await setisApprovalUIVisible(true)

                } else {
                    let arr = await [...selectedItemIds]
                    const data = {
                        "dmsLeadDropInfo": {
                            "leadId": uniqueId,
                            "leadDropId": leadDropId,
                            "status": "APPROVED"
                        }
                    }
                   var index=  await arr.indexOf(data)
                   await arr.splice(index, 1)
                    await setSelectedItemIds([...arr])
                    if(arr.length === 0){
                        await setisApprovalUIVisible(false)
                    }
                }
            } else{
                if(operation === 'approve')
                 { // approve apic
                    const data = {
                        "dmsLeadDropInfo": {
                            "leadId": uniqueId,
                            "leadDropId": leadDropId,
                            "status": "APPROVED"
                        }
                    }
                    dispatch(updateSingleApproval(data));


                 } else { 

                    //reject api
                    const data = {
                        "dmsLeadDropInfo": {
                            "leadId": uniqueId,
                            "leadDropId": leadDropId,
                            "status": "REJECTED"
                        }
                    }
                    dispatch(updateSingleApproval(data));
                 }
            }
        }catch(error)
        {
        }
        

    }

    const renderFooter = () => {
        if (!selector.isLoadingExtraData) { return null }
        return (
            <View style={styles.footer}>
                <Text style={styles.btnText}>Loading More...</Text>
                <ActivityIndicator color={Colors.GRAY} />
            </View>
        );
    };
    const IconComp = ({ iconName, onPress, bgColor }) => {
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={{ width: 35, height: 35, justifyContent: "center", alignItems: "center", borderWidth: 1, backgroundColor: bgColor, borderColor: bgColor, borderRadius: 20 }}>
                    <IconButton
                        icon={iconName}
                        color={Colors.WHITE}
                        size={20}
                    />
                </View>
            </TouchableOpacity>
        )
    }
    const renderApprovalUi = () => {
        if (!isApprovalUIVisible) { return null }
        return (
            <View style={[styles.footer, { alignContent:'center', justifyContent:'center'}]}>
                <View style={{ padding:7,backgroundColor: Colors.WHITE, width: "40%", borderRadius: 10, elevation: 10 }}>
                   <Text style={{color:Colors.BLACK, textAlign:'center', marginBottom:8}}>Approve All</Text>
                   
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>

                       <View style={{flexDirection:'column'}}>
                            <IconComp
                                iconName={'window-close'}
                                onPress={()=>updateBulkStatus('reject')}
                                bgColor='#FF0000'
                            />
                        <Text style={{ color: Colors.BLUE, fontSize: 12, margin: 2 }}>Deny</Text>
                        </View> 
                        <View style={{ flexDirection: 'column' }}>
                            <IconComp
                                iconName={'check'}
                                onPress={()=>updateBulkStatus( 'approve')}
                                bgColor='#008000'
                            />
                            <Text style={{ color: Colors.BLUE, fontSize: 12, margin: 2 }}>Approve</Text>
                        </View> 
                    </View> 
                </View>
            </View>
        );
    };

    const getFirstLetterUpperCase = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
       
            <SafeAreaView style={styles.container}>

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
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.text1}>{'Filter'}</Text>
                            <IconButton icon={'filter-outline'} size={20} color={Colors.RED} style={{ margin: 0, padding: 0 }} />
                        </View>
                    </Pressable>
                </View>

                {searchedData.length === 0 ? <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} /> :
                    <View style={[{ backgroundColor: Colors.LIGHT_GRAY, flex: 1, marginBottom: 10 }]}>
                        <FlatList
                            data={searchedData}
                            extraData={searchedData}
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={selector.isLoading}
                                    onRefresh={() => getDropListFromServer(employeeId,employeeName,branchId,orgId, selectedFromDate, selectedToDate)}
                                    progressViewOffset={200}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0}
                            onEndReached={() => {
                                if (appSelector.searchKey === '') {
                                    getMoreEnquiryListFromServer()
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
                                            <DropAnalysisItem
                                            onItemSelected={onItemSelected}
                                                from='PRE_ENQUIRY'
                                                name={getFirstLetterUpperCase(item.firstName) + " " + getFirstLetterUpperCase(item.lastName)}
                                                enqCat={item.enquiryCategory}
                                                uniqueId={item.leadId}
                                                leadDropId={item.leadDropId}
                                                created={item.droppedDate}
                                                dmsLead={item.droppedby}
                                                source={item.enquirySource}
                                                lostReason={item.lostReason}
                                                leadStatus={item.status}
                                                leadStage={item.stage}
                                            />
                                        </View>
                                    </>
                                );
                            }}
                        />
                        {renderFooter()}
                        {renderApprovalUi()}
                    </View>}
            </SafeAreaView>
   
    );
};
export default DropAnalysisScreen;
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
});
