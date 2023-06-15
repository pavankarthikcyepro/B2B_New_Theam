import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList, Text, RefreshControl, Pressable } from "react-native";
import { PageControlItem } from "../../../pureComponents/pageControlItem";
import { Button, IconButton } from "react-native-paper";
import {  EmptyListView } from "../../pureComponents";
import { DateRangeComp, DatePickerComponent, SortAndFilterComp, ButtonComp, SingleLeadSelectComp, LeadsFilterComp, DropAnalysisSubFilterComp } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../styles";
import { AppNavigator } from '../../navigations';
import * as AsyncStore from '../../asyncStore';
import { getLeadDropList, getMoreLeadDropList, updateSingleApproval, updateBulkApproval, revokeDrop, leadStatusDropped, clearLeadDropState, getDropAnalysisFilter, getdropstagemenu, getDropstagesubmenu, updateLeadStage, getDropAnalysisRedirections, getDropAnalysisRedirectionsCRM, getDropAnalysisRedirectionsXrole, getDropAnalysisSalesHome } from "../../redux/leaddropReducer";
import { callNumber } from "../../utils/helperFunctions";
import moment from "moment";
import { Category_Type_List_For_Filter } from '../../jsonData/enquiryFormScreenJsonData';
import { DropAnalysisItem } from './MyTasks/components/DropAnalysisItem';
import { updateTAB, updateIsSearch, updateSearchKey } from '../../redux/appReducer';
import { showToast } from "../../utils/toast";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { current } from "@reduxjs/toolkit";
import AnimLoaderComp from "../../components/AnimLoaderComp";
import lodash from 'lodash'

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").format(dateFormat)
const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
// let tempArr = ['DROPPED ' + `${(10)}` , 'APPROVED ' + `${(12)}`, 'REJECTED ' + `${(22)}`]
const DropAnalysisScreen = ({ route, navigation }) => {
    
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
    const [isManager, setIsManager] = useState(false);
    const [droppedData,setDroppedData] = useState([]);
    const [approvedData, setApprovedData] = useState([]);
    const [rejectedData, setRejectedData] = useState([]);

    const orgIdStateRef = React.useRef(orgId);
    const empIdStateRef = React.useRef(employeeId);
    const fromDateRef = React.useRef(selectedFromDate);
    const toDateRef = React.useRef(selectedToDate);

    const [toggleParamsIndex, setToggleParamsIndex] = useState(0);
    const [toggelparamdata, setToggelparamdata] = useState([]);
    const [ isRefresh,setIsResfresh] = useState(false)

    const [leadsFilterVisible, setLeadsFilterVisible] = useState(false);
    const [leadsFilterData, setLeadsFilterData] = useState([]);
    const [leadsSubMenuFilterVisible, setLeadsSubMenuFilterVisible] =
        useState(false);
    const [subMenu, setSubMenu] = useState([]);
    const [leadsFilterDropDownText, setLeadsFilterDropDownText] = useState("All");
    const [leadsSubMenuFilterDropDownText, setLeadsSubMenuFilterDropDownText] =
        useState("All");
    const [tempFilterPayload, setTempFilterPayload] = useState([]);
    const [updateLeadStageArray, setupdateLeadStageArray] = useState([]);
    const [isAppvoedCalled, setisAppvoedCalled] = useState(false);

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
            // let data = [...selector.leadDropList];
            // data = data.filter(x => x.status.toLowerCase() !== 'rejected');
            // setSearchedData(data)
           
            // let dropDatatemp = [...selector.leadDropList].filter(item => item.status.toUpperCase() === "DROPPED");
            // setDroppedData(dropDatatemp);

            // let ApproveDatatemp = [...selector.leadDropList].filter(item => item.status.toUpperCase() === "APPROVED");
            // setApprovedData(ApproveDatatemp);

            // let rejectedDatatemp = [...selector.leadDropList].filter(item => item.status.toUpperCase() === "REJECTED");
            // setRejectedData(rejectedDatatemp);
            // // getCountValues();
            // let tempArr = ['DROPPED ' + `${(10)}`, 'APPROVED ' + `${(12)}`, 'REJECTED ' + `${(22)}`]
            // // let temp = ['DROPPED ' + `${(dropDatatemp.length)}`, 'APPROVED ' + `${(ApproveDatatemp.length)}`, 'REJECTED ' + `${(rejectedDatatemp.length)}`]
            // setToggelparamdata(tempArr)
            // setSelectedItemIds([]);
            // setIsResfresh(false);
            filterData();
            
        }
        else {
           
            filterData();
        }
    }, [selector.leadDropList])


    const getDropAnalysisWithFilterFromServer = async()=>{
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        const jsonObj = await JSON.parse(employeeData);
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
       
        const payload = getPayloadDataV3(CurrentMonthFirstDate, currentMonthLastDate, null, null, jsonObj.orgId, jsonObj.empName, "", jsonObj.empId)
       
        dispatch(getDropAnalysisFilter(payload))
    }

    const getDropAnalysisFromRedirections  = async (selectedEmpIds,from,branchCodes) => {
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        const jsonObj = await JSON.parse(employeeData);
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        let payload;
        
        if (from ==="targetScreen1"){
             payload = {
                "loginEmpId": jsonObj.empId,
                "startDate": CurrentMonthFirstDate,
                "endDate": currentMonthLastDate,
                "orgId": jsonObj.orgId,
                "limit": 1000,
                "offset": 0,
                "filterValue": "",
                "selectedEmpId": selectedEmpIds,
                 "branchCodes": lodash.isEmpty(branchCodes) ? [] : branchCodes
            }
            dispatch(getDropAnalysisRedirections(payload))
        } else if (from === "Home"){
            if (route.params.isForDropped){
              
                    payload = {
                        "loginEmpId": selectedEmpIds,
                        "startDate": CurrentMonthFirstDate,
                        "endDate": currentMonthLastDate,
                        "orgId": jsonObj.orgId,
                        "limit": 1000,
                        "offset": 0,
                        "filterValue": "",
                        "forDropped": true,
                        "branchCodes": lodash.isEmpty(branchCodes) ? [] : branchCodes
                    }
                    dispatch(getDropAnalysisRedirections(payload))
                
                
            }else{
                if (!route.params.isFilterApplied) {
                        payload = {
                            "loggedInEmpId": jsonObj.empId,
                            "startDate": CurrentMonthFirstDate,
                            "endDate": currentMonthLastDate,
                            "orgId": jsonObj.orgId,
                            "limit": 1000,
                            "offset": 0,
                            "filterValue": "",
                            "forDropped": true,
                        }
                        dispatch(getDropAnalysisRedirectionsCRM(payload))
                    } else {
                    payload = {
                        "loginEmpId": jsonObj.empId,
                        "startDate": CurrentMonthFirstDate,
                        "endDate": currentMonthLastDate,
                        "orgId": jsonObj.orgId,
                        "limit": 1000,
                        "offset": 0,
                        "filterValue": "",
                        "forDropped": true,
                        "branchCodes": lodash.isEmpty(branchCodes) ? [] : branchCodes
                    }
                    dispatch(getDropAnalysisRedirections(payload))
                }
            }

            
        } else if (from === "targetScreen1CRM") {
            
            if (!route.params.isFilterApplied){
                payload = {
                    "loggedInEmpId": selectedEmpIds,
                    "startDate": CurrentMonthFirstDate,
                    "endDate": currentMonthLastDate,
                    "orgId": jsonObj.orgId,
                    "limit": 1000,
                    "offset": 0,
                    "filterValue": "",
                    "forDropped": false,
                    "self":route.params.isSelf
                }
                dispatch(getDropAnalysisRedirectionsCRM(payload))
            }else{
                payload = {
                    "loginEmpId": selectedEmpIds,
                    "startDate": CurrentMonthFirstDate,
                    "endDate": currentMonthLastDate,
                    "orgId": jsonObj.orgId,
                    "limit": 1000,
                    "offset": 0,
                    "filterValue": "",
                    "selectedEmpId": route.params.parentId? [route.params.parentId] : [],
                    "branchCodes": lodash.isEmpty(branchCodes) ? [] : branchCodes,
                    "forDropped": false,
                }
                dispatch(getDropAnalysisRedirections(payload))
            }
           
        } else if (from === "targetScreenDigital"){

            if (route.params.xrole) {
                payload = {
                    "loggedInEmpId": selectedEmpIds,
                    "startDate": CurrentMonthFirstDate,
                    "endDate": currentMonthLastDate,
                    "orgId": jsonObj.orgId,
                    "limit": 1000,
                    "offset": 0,
                    "filterValue": "",
                    "forDropped": route.params.isForDropped ? route.params.isForDropped : false,
                    "self": route.params.isSelf
                }
                dispatch(getDropAnalysisRedirectionsXrole(payload))
            } else {
                
                if (!route.params.isFilterApplied) {
                    payload = {
                        "loggedInEmpId": selectedEmpIds,
                        "startDate": CurrentMonthFirstDate,
                        "endDate": currentMonthLastDate,
                        "orgId": jsonObj.orgId,
                        "limit": 1000,
                        "offset": 0,
                        "filterValue": "",
                        "forDropped": false,
                        "self": route.params.isSelf
                    }
                    dispatch(getDropAnalysisRedirectionsCRM(payload))
                } else {
                    if (route.params.isSelf){
                        payload = {
                            "loggedInEmpId": selectedEmpIds,
                            "startDate": CurrentMonthFirstDate,
                            "endDate": currentMonthLastDate,
                            "orgId": jsonObj.orgId,
                            "limit": 1000,
                            "offset": 0,
                            "filterValue": "",
                            "forDropped": route.params.isForDropped ? route.params.isForDropped : false,
                            "self": route.params.isSelf
                        }
                        dispatch(getDropAnalysisRedirectionsCRM(payload))
                    }else{
                        payload = {
                            "loginEmpId": selectedEmpIds,
                            "startDate": CurrentMonthFirstDate,
                            "endDate": currentMonthLastDate,
                            "orgId": jsonObj.orgId,
                            "limit": 1000,
                            "offset": 0,
                            "filterValue": "",
                            "selectedEmpId": route.params.parentId ? [route.params.parentId] : [],
                            "branchCodes": lodash.isEmpty(branchCodes) ? [] : branchCodes,
                            "forDropped": false,
                        }
                        dispatch(getDropAnalysisRedirections(payload))
                    }
                    
                }
            }
        }
        else if (from === "targetScreenReceptionist") {

            if (route.params.xrole) {
                payload = {
                    "loggedInEmpId": selectedEmpIds,
                    "startDate": CurrentMonthFirstDate,
                    "endDate": currentMonthLastDate,
                    "orgId": jsonObj.orgId,
                    "limit": 1000,
                    "offset": 0,
                    "filterValue": "",
                    "forDropped": route.params.isForDropped ? route.params.isForDropped : false,
                    "self": route.params.isSelf,
                    "dashboardType": "reception"
                }
                dispatch(getDropAnalysisRedirectionsXrole(payload))
            } else {
                
                if (!route.params.isFilterApplied) {
                    payload = {
                        "loggedInEmpId": selectedEmpIds,
                        "startDate": CurrentMonthFirstDate,
                        "endDate": currentMonthLastDate,
                        "orgId": jsonObj.orgId,
                        "limit": 1000,
                        "offset": 0,
                        "filterValue": "",
                        "forDropped": route.params.isForDropped ? route.params.isForDropped : false,
                        "self": route.params.isSelf,
                        "dashboardType": route.params.dashboardType,
                    }
                    dispatch(getDropAnalysisRedirectionsCRM(payload))
                } else {
                    payload = {
                        "loginEmpId": selectedEmpIds,
                        "startDate": CurrentMonthFirstDate,
                        "endDate": currentMonthLastDate,
                        "orgId": jsonObj.orgId,
                        "limit": 1000,
                        "offset": 0,
                        "filterValue": "",
                        "selectedEmpId": route.params.parentId ? [route.params.parentId] : [],
                        "branchCodes": lodash.isEmpty(branchCodes) ? [] : branchCodes,
                        "forDropped": route.params.isForDropped ? route.params.isForDropped : false,
                    }
                    dispatch(getDropAnalysisRedirections(payload))
                }
            }
        }
        else if (from === "targetSaleshome") {

            let payload = {
                "endDate": currentMonthLastDate,
                "loggedInEmpId": selectedEmpIds,
                "startDate": CurrentMonthFirstDate,
                "selectedEmpId": selectedEmpIds,
                "levelSelected": lodash.isEmpty(branchCodes) ? [] : branchCodes,
                "pageNo": 0,
                "size": 5000,
                "filterValue": "",
                "isSelf": route?.params?.isSelf ? route?.params?.isSelf : false,
                "stageName": "DROPPED"
            }
            dispatch(getDropAnalysisSalesHome(payload))


        }
        
        // const payload = getPayloadDataV3(CurrentMonthFirstDate, currentMonthLastDate, null, null, jsonObj.orgId, jsonObj.empName, "", jsonObj.empId)
       

       
    }


    const getDropAnalysisWithFilterFromServerFilterApply = async (startDate, endDate, stage, status, filterValue) => {
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        const jsonObj = await JSON.parse(employeeData);
        // const dateFormat = "YYYY-MM-DD";
        // const currentDate = moment().add(0, "day").format(dateFormat)
        // const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        // const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);

      
        if (leadsFilterDropDownText.toLowerCase() === "booking" && filterValue.toLowerCase() ==="booking"){
            filterValue = "bookingBoking";
           
        } else if (leadsFilterDropDownText.toLowerCase() === "retail" && filterValue.toLowerCase() === "retail"){
            filterValue = "reatailRetail";
           
        } else if (leadsFilterDropDownText.toLowerCase() === "delivery" && filterValue.toLowerCase() === "delivery") {
            filterValue = "deliveryDelivery";
           
        }else{
            filterValue = "";
         
        }
        
        const payload = getPayloadDataV3(startDate, endDate, stage, status, jsonObj.orgId, jsonObj.empName, filterValue, jsonObj.empId)
      
        dispatch(getDropAnalysisFilter(payload))
    }

    const filterData = () => {

        let data = [...selector.leadDropList];
        data = data.filter(x => x.status.toLowerCase() !== 'rejected');
        setSearchedData(data)

        let dropDatatemp = [...selector.leadDropList].filter(
          (item) =>
            item.status.toUpperCase() === "DROPPED" ||
            item.status.toUpperCase() === "APPROVED"
        );
        setDroppedData(dropDatatemp);

        // let ApproveDatatemp = [...selector.leadDropList].filter(item => item.status.toUpperCase() === "APPROVED");
        // setApprovedData(ApproveDatatemp);

        let rejectedDatatemp = [...selector.leadDropList].filter(item => item.status.toUpperCase() === "REJECTED");
        setRejectedData(rejectedDatatemp);
        // getCountValues();
        let tempArr = ['DROPPED ' + `${(10)}`, 'REJECTED ' + `${(22)}`]
        // let temp = ['DROPPED ' + `${(dropDatatemp.length)}`, 'APPROVED ' + `${(ApproveDatatemp.length)}`, 'REJECTED ' + `${(rejectedDatatemp.length)}`]
        setToggelparamdata(tempArr)
        setSelectedItemIds([]);
        setIsResfresh(false);
    }
    
    useEffect(() => {
       
        if (selector.approvalStatus === "sucess") {
        //    selector.approvalStatus = ""
           
            
           setisApprovalUIVisible(false)
           if(isAppvoedCalled){
               dispatch(updateLeadStage(updateLeadStageArray))
           }
           
            getDropListFromServerV2(employeeId, employeeName, branchId, orgId, selectedFromDate, selectedToDate)
            setIsResfresh(true);
            dispatch(clearLeadDropState())
            // getDropListFromServerV2(employeeId, employeeName, branchId, orgId, selectedFromDate, selectedToDate)
            // setIsResfresh(true);
            // dispatch(clearLeadDropState())
            
        }
        else {
       
            // selector.approvalStatus = ""
            // setSelectedItemIds([])
            // dispatch(clearLeadDropState())
            // setisApprovalUIVisible(true)
            // getDropListFromServerV2(employeeId, employeeName, branchId, orgId, selectedFromDate, selectedToDate)
        }
    }, [selector.approvalStatus])

    useEffect(() => {
      
        if (selector.updateLeadStage === "sucess") {
            setupdateLeadStageArray([])
            setisAppvoedCalled(false);
            // getDropListFromServerV2(employeeId, employeeName, branchId, orgId, selectedFromDate, selectedToDate)
            // setIsResfresh(true);
            // dispatch(clearLeadDropState())
        }
      
    }, [selector.updateLeadStage])
    

    useEffect(() => {
        if (appSelector.isSearch) {
            
            dispatch(updateIsSearch(false))
            if (appSelector.searchKey !== '') {
                let tempData = []
                let data = [...selector.leadDropList];
                // data = data.filter(x => x.status.toLowerCase() !== 'rejected');
                
                tempData = data.filter((item) => {
                    if (item.stage == "PREENQUIRY"){
                        return item.createdBy?.toLowerCase().includes(appSelector.searchKey.toLowerCase()) 
                            || item.firstName.toLowerCase().includes(appSelector.searchKey.toLowerCase()) ||
                            item.lastName.toLowerCase().includes(appSelector.searchKey.toLowerCase())
                            || item.droppedby?.toLowerCase().includes(appSelector.searchKey.toLowerCase())
                            || item.mobileNumber?.toLowerCase().includes(appSelector.searchKey.toLowerCase())
                    }else{
                        return item.firstName.toLowerCase().includes(appSelector.searchKey.toLowerCase()) ||
                            item.lastName.toLowerCase().includes(appSelector.searchKey.toLowerCase()) ||
                            item.salesConsultant?.toLowerCase().includes(appSelector.searchKey.toLowerCase())
                            || item.droppedby?.toLowerCase().includes(appSelector.searchKey.toLowerCase())
                            || item.mobileNumber?.toLowerCase().includes(appSelector.searchKey.toLowerCase())
                    }
                })
                setSearchedData([]);
                
                setSearchedData(tempData);
                if (toggleParamsIndex === 0){
                    let dropDatatemp = tempData.filter(
                      (item) =>
                        item.status.toUpperCase() === "DROPPED" ||
                        item.status.toUpperCase() === "APPROVED"
                    );
                    setDroppedData(dropDatatemp)
                }else if (toggleParamsIndex === 1){
                    // let ApproveDatatemp = tempData.filter(item => item.status.toUpperCase() === "APPROVED");
                    // setApprovedData(ApproveDatatemp);
                    let rejectedDatatemp = tempData.filter(item => item.status.toUpperCase() === "REJECTED");
                    setRejectedData(rejectedDatatemp);
                }else if(toggleParamsIndex===2) {
                }
                dispatch(updateSearchKey(''))
            }
            else {
                setSearchedData([]);
                setSearchedData(selector.leadDropList);
                filterData();
            }
        }
    }, [appSelector.isSearch])

    useEffect(async() => {

        // Get Data From Server
        let isMounted = true;
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().add(0, "day").format(dateFormat)
        const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        setFromDateState(CurrentMonthFirstDate);
        setToDateState(currentMonthLastDate);

        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            setEmployeeId(jsonObj.empId);
            setOrgId(jsonObj.orgId);
            setEmployeeName(jsonObj.empName)
        }
       
    }, [])

    useEffect(() => {
        navigation.addListener("focus", () => {
            getDataFromDB();
            // setLeadsFilterDropDownText("All")
            // setLeadsSubMenuFilterDropDownText("All");
            
            dispatch(getdropstagemenu());
         
            // if (route.params === undefined || route.params.fromScreen !== "targetScreen1" || route.params.fromScreen !== "Home"){
            //     setLeadsFilterDropDownText("All")
            //     setLeadsSubMenuFilterDropDownText("All");
            //     getDropAnalysisWithFilterFromServer()
            // }
          
            // if (route?.params?.fromScreen == "targetScreen1" || route?.params?.fromScreen !== "Home" && route?.params?.emp_id) {
          
            //     getDropAnalysisFromRedirections(route?.params?.emp_id)
            // }

            // if (route?.params?.fromScreen === "") {
           
            //     getDropAnalysisWithFilterFromServer()
            //     setLeadsFilterDropDownText("All")
            //     setLeadsSubMenuFilterDropDownText("All");
            // }
        });
    
    }, [navigation]);

    useEffect(() => {
       
        // Do something when the screen is focused
        if (route.params.fromScreen == "targetScreen1" && route?.params?.emp_id) {
           
            getDropAnalysisFromRedirections(route?.params?.emp_id, "targetScreen1",route?.params?.dealercodes)
            setLeadsFilterDropDownText("Enquiry")
            setLeadsSubMenuFilterDropDownText("All");
        }else if (route.params.fromScreen === "Home"){
            setLeadsFilterDropDownText("Contact")
            setLeadsSubMenuFilterDropDownText("Contact");
            getDropAnalysisFromRedirections(route?.params?.emp_id, "Home", route?.params?.dealercodes)
        } else if (route.params.fromScreen == "targetScreen1CRM" && route?.params?.emp_id) {
            getDropAnalysisFromRedirections(route?.params?.emp_id, "targetScreen1CRM", route?.params?.dealercodes)
            setLeadsFilterDropDownText("Enquiry")
            setLeadsSubMenuFilterDropDownText("All");
        } else if (route.params.fromScreen == "targetScreenDigital" && route?.params?.emp_id){
            getDropAnalysisFromRedirections(route?.params?.emp_id, "targetScreenDigital", route?.params?.dealercodes)
            setLeadsFilterDropDownText("Enquiry")
            setLeadsSubMenuFilterDropDownText("All");
        } else if (route.params.fromScreen == "targetScreenReceptionist" && route?.params?.emp_id) {
            getDropAnalysisFromRedirections(route?.params?.emp_id, "targetScreenReceptionist", route?.params?.dealercodes)
            setLeadsFilterDropDownText("Enquiry")
            setLeadsSubMenuFilterDropDownText("All");
        } else if (route.params.fromScreen == "targetSaleshome" && route?.params?.emp_id){
            getDropAnalysisFromRedirections(route?.params?.emp_id, "targetSaleshome", route?.params?.dealercodes)
            setLeadsFilterDropDownText("Enquiry")
            setLeadsSubMenuFilterDropDownText("All");
        }

        if (route.params.fromScreen === "") {
              const dateFormat = "YYYY-MM-DD";
              const currentDate = moment().add(0, "day").format(dateFormat);
              const CurrentMonthFirstDate = moment(currentDate, dateFormat)
                .subtract(0, "months")
                .startOf("month")
                .format(dateFormat);
              const currentMonthLastDate = moment(currentDate, dateFormat)
                .subtract(0, "months")
                .endOf("month")
                .format(dateFormat);
              setFromDateState(CurrentMonthFirstDate);
              setToDateState(currentMonthLastDate);

            getDropAnalysisWithFilterFromServer()
            setLeadsFilterDropDownText("All")
            setLeadsSubMenuFilterDropDownText("All");
        }
       
    }, [route.params])
    
    

    useEffect(() => {
       
      return () => {
          dispatch(clearLeadDropState())
      }
    }, [])
    
    useEffect(() => {
        
        if (selector.dropStageMenus){
            let path = selector.dropStageMenus;

            const newArr = path.map((v) => ({ ...v, checked: false }));
            // setTempStore(newArr);
            setLeadsFilterData(newArr);
        }
        
    
      
    }, [selector.dropStageMenus])
    
    useEffect(() => {
       
       
        if (selector.dropStageSubMenus.length >0 ){
           
            let path = selector.dropStageSubMenus[0].dropStageListSubMenu;
            const newArr = path.map((v) => ({ ...v, checked: false }));
            // setTempStore(newArr);
            setSubMenu(newArr);
           

        }
        


    }, [selector.dropStageSubMenus])
   
    const getSubMenuList=(name)=>{
        dispatch(getDropstagesubmenu(name));
    }

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
        const CurrentMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const currentMonthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        if (employeeData) {
            const jsonObj = await JSON.parse(employeeData);
            // await setOrgId(jsonObj.orgId)
            
            // if (
            //   jsonObj?.hrmsRole.toLowerCase().includes("manager") ||
            //   jsonObj?.hrmsRole.toLowerCase() == "admin" ||
            //   jsonObj?.hrmsRole.toLowerCase() == "sales head" ||
            //     jsonObj?.hrmsRole.toLowerCase() == "md" || jsonObj?.hrmsRole.toLowerCase() == "crm" || jsonObj?.hrmsRole.toLowerCase() == "tl"
            // ) {
               
            //   setIsManager(true);
            // }

              if (
                jsonObj?.isTeam.toLowerCase().includes("y") ||
                (jsonObj.orgName == "BikeWo Corporation" &&
                  jsonObj.isSelfManager == "Y")
              ) {
                setIsManager(true);
              }

            // await setEmployeeName(jsonObj.empName)
            // await setEmployeeId(jsonObj.empId)
            // getDropListFromServer(jsonObj.empId, jsonObj.empName, branchId, jsonObj.orgId, lastMonthFirstDate, currentDate);
            setisApprovalUIVisible(false)
            // const payload = getPayloadData(jsonObj.empId, jsonObj.empName, branchId, jsonObj.orgId, CurrentMonthFirstDate, currentMonthLastDate,0)
            // dispatch(getLeadDropList(payload)); 
        }
    }


    const getDropListFromServer = (empId,empName, branchId,orgId, startDate, endDate) => {
        // setisApprovalUIVisible(false)
        // const payload = getPayloadData(empId,empName, branchId,orgId, startDate, endDate, 0)
        // dispatch(getLeadDropList(payload));
    }
    const getDropListFromServerV2 = (empId, empName, branchId, orgId, startDate, endDate) => {
       
        setisApprovalUIVisible(false)
        // const payload = getPayloadData(empId,empName, branchId,orgId, startDate, endDate, 0)
        // dispatch(getLeadDropList(payload));
        setLeadsFilterDropDownText("All")
        setLeadsSubMenuFilterDropDownText("All");
        getDropAnalysisWithFilterFromServer()
        setIsResfresh(true)
    }

    const getPayloadData = (empId, empName, branchId, orgId, startDate, endDate, offSet, modelFilters = [], categoryFilters = [], sourceFilters = []) => {
        const payload = {
            "startdate": startDate,
            "enddate": endDate,
            // "model": modelFilters,
            // "categoryType": categoryFilters,
            // "sourceOfEnquiry": sourceFilters,
            "empId": empId,
            "empName":empName,
            "branchId":branchId,
            "status": "ENQUIRY",
            "offset": offSet,
            "orgId":orgId,
            "limit": 100,
        }
        return payload;

        
    }
    const getPayloadDataV3 = (CurrentMonthFirstDate, currentMonthLastDate, stages, status, orgId, empName, filterValue="",empId) => {
       

        const payload = {
            "offset": "0",
            "limit": "1000",
            "orgId": orgId,
            "loginUser": empName,
            "startDate": CurrentMonthFirstDate,
            "endDate": currentMonthLastDate,
            "stages":  stages,
            "status": status,
            "filterValue": filterValue!=="" ? filterValue:"",
            "empId": empId
        }
        return payload;
    }

    const getMoreEnquiryListFromServer = async () => {
        if (selector.isLoadingExtraData) {
             return }

        if (employeeId && ((selector.pageNumber + 1) <= selector.totalPages)) {
            renderFooter()
            // const payload = getPayloadData(employeeId,employeeName, branchId,orgId, selectedFromDate, selectedToDate, (selector.pageNumber + 1))
            // dispatch(getMoreLeadDropList(payload));
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
                setSubMenu([]);
           
                setLeadsFilterDropDownText("All")
                setLeadsSubMenuFilterDropDownText("All");
                let path = selector.dropStageMenus;
            
                const newArr = path.map((v) => ({ ...v, checked: false }));
                setLeadsFilterData(newArr);
            
                getDropAnalysisWithFilterFromServerFilterApply(formatDate,selectedToDate)
                // getDropListFromServer(employeeId,employeeName, branchId,orgId, formatDate, selectedToDate);
                break;
            case "TO_DATE":
                setToDateState(formatDate);
                setSubMenu([]);
           
                setLeadsFilterDropDownText("All")
              
                setLeadsSubMenuFilterDropDownText("All");
                let path2 = selector.dropStageMenus;

                const newArr1 = path2.map((v) => ({ ...v, checked: false }));
                setLeadsFilterData(newArr1);

                getDropAnalysisWithFilterFromServerFilterApply(selectedFromDate, formatDate)
                // getDropListFromServer(employeeId,employeeName, branchId,orgId, selectedFromDate, formatDate);
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
        // const payload2 = getPayloadData(employeeId, selectedFromDate, selectedToDate, 0, modelFilters, categoryFilters, sourceFilters)
        // dispatch(getLeadDropList(payload2));
    }
    const updateBulkStatus = async (status)=>{
        
        if(status === 'reject'){

            // let tempObj = {
            //     "dropLeadIdList": selectedItemIds.map(item => item.dmsLeadDropInfo.leadDropId)
            // }
            // setupdateLeadStageArray(tempObj)
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
        } else {
           
            let tempObj = {
                "dropLeadIdList": selectedItemIds.map(item => item.dmsLeadDropInfo.leadDropId)
            }
            
            setupdateLeadStageArray(tempObj)
            dispatch(updateBulkApproval(selectedItemIds));
            setisAppvoedCalled(true);
            
        } 

    }
    const onItemSelected = async (uniqueId, leadDropId, type, operation) => {
      
      try {
       
        if (type === "multi") {
            
          if (operation === "add") {
           
            const data = {
              dmsLeadDropInfo: {
                leadId: uniqueId,
                leadDropId: leadDropId,
                status: "APPROVED",
              },
            };
            await setSelectedItemIds([...selectedItemIds, data]);
            await setisApprovalUIVisible(true);
          } else {
             
            let arr = await [...selectedItemIds];
            const data = {
              dmsLeadDropInfo: {
                leadId: uniqueId,
                leadDropId: leadDropId,
                status: "APPROVED",
              },
            };
            var index = await arr.indexOf(data);
            await arr.splice(index, 1);
            await setSelectedItemIds([...arr]);
            if (arr.length === 0) {
              await setisApprovalUIVisible(false);
            }
          }
        } else {
            
          if (operation === "approve") {
            
            // approve apic
            const data = {
              dmsLeadDropInfo: {
                leadId: uniqueId,
                leadDropId: leadDropId,
                status: "APPROVED",
              },
            };
            Promise.all([dispatch(updateSingleApproval(data))]).then(() => {
              showToast("Successfully approved");
              let payload = {
                leadDropId: leadDropId,
              };
              Promise.all([dispatch(leadStatusDropped(payload))]).then(
                () => {}
              );
            //   getDataFromDB();
            });
          } else if (operation === "reject") {
         
            //reject api
            const data = {
              dmsLeadDropInfo: {
                leadId: uniqueId,
                leadDropId: leadDropId,
                status: "REJECTED",
              },
            };
            Promise.all([dispatch(updateSingleApproval(data))]).then(() => {
              showToast("Successfully rejected");
            //   getDataFromDB();
            });
          } else {
            
            //reject api
            const data = {
              leadId: uniqueId,
            };
            Promise.all([dispatch(revokeDrop(data))]).then(() => {
              showToast("Successfully revoked");
            //   getDataFromDB();
            });
          }
        }
      } catch (error) {}
    };

    const renderFooter = () => {
        if (!selector.isLoadingExtraData) { return null }
        return (
          <View style={styles.footer}>
            <Text style={styles.btnText}>Loading More...</Text>
            <AnimLoaderComp visible={true} />
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

    const toggleParamsView = (event) => {
       
     
        setToggleParamsIndex(event)
        // const index = event.nativeEvent.selectedSegmentIndex;
        // let data = [...paramsMetadata];
        // if (index !== 2) {
        //     data = data.filter((x) => x.toggleIndex === index);
        // } else {
        //     data = [...paramsMetadata];
        // }
        // setToggleParamsMetaData([...data]);
        // setToggleParamsIndex(index);
    };

    const getCountValues = ()=>{
    //    let tempArr = ['DROPPED ' + `${(10)}` , 'APPROVED ' + `${(12)}`, 'REJECTED ' + `${(22)}`]
        let temp = ['DROPPED ' + `${(droppedData.length)}`, 'APPROVED ' + `${(approvedData.length)}`, 'REJECTED ' + `${(rejectedData.length)}`]
        setToggelparamdata(temp)
    }

    const isCountAndFollowUpVisible = (leadsStage) => {
        let tempLeadStagre = leadsStage;
        
        if (tempLeadStagre === "PREENQUIRY") {
            tempLeadStagre = "Pre Enquiry Follow Up"
            return true;
        } else if (tempLeadStagre === "ENQUIRY") {
            tempLeadStagre = "Enquiry Follow Up"
            return true;
        } else if (tempLeadStagre === "PREBOOKING") {

            tempLeadStagre = "Pre Booking Follow Up"
            return true;
        } else if (tempLeadStagre === "BOOKING") {
            tempLeadStagre = "Booking Follow Up"
            return true;
        } else {
            return false;
        }

    }


    const liveLeadsEndDate = currentDate;

    return (
      <SafeAreaView style={styles.container}>
        {/* <DatePickerComponent
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
                /> */}

        {/* <SortAndFilterComp
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
                /> */}

        {/* <View style={styles.view1}>
                    <View style={{ width: "100%" }}>
                        <DateRangeComp
                            fromDate={selectedFromDate}
                            toDate={selectedToDate}
                            fromDateClicked={() => showDatePickerMethod("FROM_DATE")}
                            toDateClicked={() => showDatePickerMethod("TO_DATE")}
                        />
                    </View>
                </View> */}

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
            isContactVisible={true}
            visible={leadsFilterVisible}
            modelList={leadsFilterData}
            submitCallback={(x) => {
              setLeadsSubMenuFilterDropDownText("All");
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
              getDropAnalysisWithFilterFromServer();
              setLeadsFilterDropDownText("All");
              setLeadsSubMenuFilterDropDownText("All");
              let path = selector.dropStageMenus;

              const newArr = path.map((v) => ({ ...v, checked: false }));
              setLeadsFilterData(newArr);

              const dateFormat = "YYYY-MM-DD";
              const currentDate = moment().add(0, "day").format(dateFormat);
              const CurrentMonthFirstDate = moment(currentDate, dateFormat)
                .subtract(0, "months")
                .startOf("month")
                .format(dateFormat);
              const currentMonthLastDate = moment(currentDate, dateFormat)
                .subtract(0, "months")
                .endOf("month")
                .format(dateFormat);
              setFromDateState(CurrentMonthFirstDate);
              setToDateState(currentMonthLastDate);
            }}
          />
          <DropAnalysisSubFilterComp
            visible={leadsSubMenuFilterVisible}
            modelList={subMenu}
            submitCallback={(x) => {
              setSubMenu([...x]);
              setTempFilterPayload(x);
              setLeadsSubMenuFilterVisible(false);
              const data = x.filter((y) => y.checked);

              // if (data.length === subMenu.length) {
              //     setLeadsSubMenuFilterDropDownText("All");
              // } else {
              let names = data.map((y) => y?.subMenu);
              setLeadsSubMenuFilterDropDownText(
                names.toString() ? names.toString() : "Select Sub Menu"
              );
              let tmpArr = [];
              data.map((item) => tmpArr.push(item.leadStage));

              getDropAnalysisWithFilterFromServerFilterApply(
                selectedFromDate,
                selectedToDate,
                ...tmpArr,
                null,
                names.toString()
              );
              // }
            }}
            cancelClicked={() => {
              setLeadsSubMenuFilterVisible(false);
            }}
            onChange={(x) => {}}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.headerTitleContainer}
          onPress={() => toggleParamsView(0)}
        >
          <Text
            style={styles.headerTitleText}
          >{`DROPPED ${droppedData.length}`}</Text>
        </TouchableOpacity>

        {/* date and other filters UI start*/}
        <View style={styles.view1}>
          <View style={{ width: "100%" }}>
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
        {/* date and other filters UI END*/}

        {toggleParamsIndex === 0 && (
          <>
            {droppedData.length === 0 ? (
              <EmptyListView
                title={"No Data Found"}
                isLoading={selector.isLoading}
              />
            ) : (
              <View
                style={[
                  {
                    backgroundColor: Colors.LIGHT_GRAY,
                    flex: 1,
                    marginBottom: 10,
                    marginTop: 10,
                  },
                ]}
              >
                {isManager && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "flex-end",
                      marginTop: "2%",
                    }}
                  >
                    <View style={styles.modal}>
                      <TouchableOpacity
                        style={styles.tochable}
                        disabled={selectedItemIds.length > 0 ? false : true}
                        onPress={() => updateBulkStatus("approve")}
                      >
                        <Text style={styles.text4}>{"APPROVE"}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.tochable}
                        disabled={selectedItemIds.length > 0 ? false : true}
                        onPress={() => updateBulkStatus("reject")}
                      >
                        <Text style={styles.text4}>{"REJECT"}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <FlatList
                  initialNumToRender={droppedData.length}
                  data={droppedData}
                  extraData={droppedData}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={selector.isLoading}
                      onRefresh={() =>
                        getDropListFromServerV2(
                          employeeId,
                          employeeName,
                          branchId,
                          orgId,
                          selectedFromDate,
                          selectedToDate
                        )
                      }
                      progressViewOffset={200}
                    />
                  }
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0}
                  onEndReached={() => {
                    if (appSelector.searchKey === "") {
                      // getMoreEnquiryListFromServer()
                    }
                  }}
                  ListFooterComponent={renderFooter}
                  renderItem={({ item, index }) => {
                    let color = Colors.WHITE;
                    if (index % 2 != 0) {
                      color = Colors.LIGHT_GRAY;
                    }
                    isCountAndFollowUpVisible(item.stage);

                    return (
                      <>
                        <View>
                          <DropAnalysisItem
                            onItemSelected={onItemSelected}
                            from="PRE_ENQUIRY"
                            name={
                              getFirstLetterUpperCase(item.firstName) +
                              " " +
                              getFirstLetterUpperCase(item.lastName)
                            }
                            enqCat={item.enquiryCategory}
                            uniqueId={item.leadId}
                            leadDropId={item.leadDropId}
                            created={item.droppedDate}
                            dmsLead={item.droppedby}
                            source={item.enquirySource}
                            lostReason={item.lostReason}
                            status={item.status}
                            leadStage={item.stage}
                            isManager={isManager}
                            dropStatus={item.status}
                            mobileNo={item.mobileNumber}
                            isCheckboxVisible={true}
                            isRefresh={isRefresh}
                            navigation={navigation}
                            showBubble={true}
                            showThreeDots={true}
                            universalId={item.crmUniversalId}
                            count={item.count}
                            isThreeBtnClickable={isCountAndFollowUpVisible(
                              item.stage
                            )}
                            leadStatus={item.leadStatus}
                            dse={
                              item.stage == "PREENQUIRY"
                                ? item.createdBy
                                : item.salesConsultant
                            }
                            onItemPressed={() => {
                              navigation.navigate("BOOKING_FORM", {
                                universalId: item.crmUniversalId,
                                enqDetails: "",
                                leadStatus: item.leadStatus,
                                leadStage: item.stage,
                                fromScreen: "DROP_ANALYSIS",
                              });
                            }}
                          />
                        </View>
                      </>
                    );
                  }}
                />
                {renderFooter()}
                {/* {isManager && renderApprovalUi()} */}
              </View>
            )}
          </>
        )}
        {/* {toggleParamsIndex === 1 && <>
                {rejectedData.length === 0 ? <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} /> :
                    <View style={[{ backgroundColor: Colors.LIGHT_GRAY, flex: 1, marginBottom: 10,marginTop:10 }]}>
                        <FlatList
                            initialNumToRender={rejectedData.length}
                            data={rejectedData}
                            extraData={rejectedData}
                            keyExtractor={(item, index) => index.toString()}
                            refreshControl={(
                                <RefreshControl
                                    refreshing={selector.isLoading}
                                    onRefresh={() => getDropListFromServerV2(employeeId, employeeName, branchId, orgId, selectedFromDate, selectedToDate)}
                                    progressViewOffset={200}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0}
                            onEndReached={() => {
                                if (appSelector.searchKey === '') {
                                  
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
                                                status={item.status}
                                                leadStage={item.stage}
                                                isManager={isManager}
                                                dropStatus={item.status}
                                                mobileNo={item.mobileNumber}
                                                isCheckboxVisible={false}
                                                navigation={navigation}
                                                showBubble={false}
                                                showThreeDots={false}
                                                leadStatus={item.leadStatus}
                                                dse={
                                                    item.stage == "PREENQUIRY"
                                                        ? item.createdBy
                                                        : item.salesConsultant
                                                }
                                            />
                                        </View>
                                    </>
                                );
                            }}
                        />
                        {renderFooter()}
                      
                    </View>}
            </>} */}

        {/* {searchedData.length === 0 ? <EmptyListView title={"No Data Found"} isLoading={selector.isLoading} /> :
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
                                                isManager={isManager}
                                                dropStatus={item.status}
                                            />
                                        </View>
                                    </>
                                );
                            }}
                        />
                        {renderFooter()}
                        {isManager && renderApprovalUi()}
                    </View>} */}
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
    headerTitleContainer: {
        ...GlobalStyle.shadow,
        backgroundColor: Colors.PINK,
        width: "97%",
        alignSelf: "center",
        borderRadius: 5,
        paddingVertical: 8,
        alignItems: "center",
        marginTop: 8
    },
    headerTitleText: {
      fontWeight: "600",
      color: Colors.WHITE,
      fontSize: 13 
    },
    view1: {
        flexDirection: 'column',
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
    modal: {
        width:"100%",
        height: 40,
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: 5,
        flexDirection:'row',
        
    },
    text4: {
        color: Colors.WHITE,
        fontSize: 10,
        fontWeight: "bold",
       textAlign:'center'
        // textAlign: "center",
        // paddingHorizontal: 5
    },
    tochable:{
        backgroundColor: Colors.RED,
        height: 28,
        borderRadius: 8,
        width: "35%",
        alignContent:'center',
        
        justifyContent: 'center',
        alignItems: 'center',
        padding:5
    },
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
});
