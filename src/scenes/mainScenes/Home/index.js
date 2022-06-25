
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Dimensions, Pressable, Alert, TouchableOpacity, ScrollView, Keyboard, Image, Platform } from 'react-native';
import { Colors, GlobalStyle } from '../../../styles';
import { IconButton, Card, Button } from 'react-native-paper';
import VectorImage from 'react-native-vector-image';
import { useDispatch, useSelector } from 'react-redux';
import { FILTER, SPEED } from '../../../assets/svg';
import { DateItem } from '../../../pureComponents/dateItem';
import { AppNavigator } from '../../../navigations';
import {
    dateSelected,
    showDateModal,
    getCustomerTypeList,
    getSourceOfEnquiryList,
    getVehicalModalList,
    getOrganaizationHirarchyList,
    getLeadSourceTableList,
    getVehicleModelTableList,
    getEventTableList,
    getTaskTableList,
    getLostDropChartData,
    getTargetParametersData,
    getTargetParametersAllData,
    getTargetParametersEmpData,
    getSalesData,
    getSalesComparisonData,
    getDealerRanking,
    getGroupDealerRanking,
    updateIsTeam,
    updateIsTeamPresent,
    getBranchIds,
    downloadFile,
    updateIsMD,
    updateIsDSE,
    updateTargetData
} from '../../../redux/homeReducer';
import { getCallRecordingCredentials } from '../../../redux/callRecordingReducer'
import {
    updateData,
    updateIsManager,
} from '../../../redux/sideMenuReducer';
import * as acctionCreator from '../../../redux/targetSettingsReducer';
import { DateRangeComp, DatePickerComponent, SortAndFilterComp } from '../../../components';
import { DateModalComp } from "../../../components/dateModalComp";
import { getMenuList } from '../../../redux/homeReducer';
import { DashboardTopTabNavigator } from '../../../navigations/dashboardTopTabNavigator';
import { DashboardTopTabNavigatorNew } from '../../../navigations/dashboardTopTabNavigatorNew';
import { HomeStackIdentifiers } from '../../../navigations/appNavigator';
import * as AsyncStore from '../../../asyncStore';
import moment from 'moment';
import { TargetAchivementComp } from './targetAchivementComp';
import { HeaderComp, DropDownComponant, LoaderComponent } from '../../../components';
import { TargetDropdown } from "../../../pureComponents";
import RNFetchBlob from 'rn-fetch-blob'

import empData from '../../../get_target_params_for_emp.json'
import allData from '../../../get_target_params_for_all_emps.json'
import targetData from '../../../get_target_params.json'

const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 30) / 2;

const widthForBoxItem = (screenWidth - 30) / 3;

const BoxComp = ({ width, name, value, iconName, bgColor }) => {
    return (
        <View style={{ width: width, padding: 2 }}>
            <View style={[styles.boxView, { backgroundColor: bgColor }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconButton icon={iconName} size={12} color={Colors.WHITE} style={{ margin: 0, padding: 0 }} />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.WHITE }}>{value}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.WHITE }}>{name}</Text>
            </View>
        </View>
    )
}

const titleNames = ["Live Bookings", "Complaints", "Deliveries", "Loss In Revenue", "Pending Tasks"];
const iconNames = ["shopping", "account-supervisor", "currency-usd", "cart", "currency-usd"];
const colorNames = ["#85b1f4", "#f1ab48", "#79e069", "#e36e7a", "#5acce8"]


const HomeScreen = ({ route, navigation }) => {
    const selector = useSelector((state) => state.homeReducer);
    const dispatch = useDispatch();
    const [salesDataAry, setSalesDataAry] = useState([]);
    const [selectedBranchName, setSelectedBranchName] = useState("");

    const [dropDownKey, setDropDownKey] = useState("");
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownData, setDropDownData] = useState(null);
    const [retailData, setRetailData] = useState(null);
    const [dealerRank, setDealerRank] = useState(null);
    const [dealerCount, setDealerCount] = useState(null);
    const [groupDealerRank, setGroupDealerRank] = useState(null);
    const [groupDealerCount, setGroupDealerCount] = useState(null);
    const [isTeamPresent, setIsTeamPresent] = useState(false);
    const [isTeam, setIsTeam] = useState(false);
    const [roles, setRoles] = useState([]);
    const [headerText, setHeaderText] = useState('');
    const [isButtonPresent, setIsButtonPresent] = useState(false);
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {

        // if (route.params?.branchName) {
        //   navigation.setOptions({
        //     headerRight: () => (
        //       <TouchableOpacity onPress={moveToSelectBranch}>
        //         <View style={{ paddingLeft: 5, paddingRight: 2, paddingVertical: 2, borderColor: Colors.WHITE, borderWidth: 1, borderRadius: 4, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        //           <Text style={{ fontSize: 10, fontWeight: "600", color: Colors.WHITE, width: 65 }} numberOfLines={1} >{route.params?.branchName || ""}</Text>
        //           <IconButton
        //             icon="menu-down"
        //             style={{ padding: 0, margin: 0 }}
        //             color={Colors.WHITE}
        //             size={15}
        //           />
        //         </View>
        //       </TouchableOpacity>
        //     ),
        //   });
        // }
        // setInterval(() => {
        //     console.log("CALLED INTERVAL");
        //     getHomeData()
        // }, 10000);
        navigation.addListener('focus', () => {
            setTargetData()
        })

    }, [navigation]);

    // useEffect(() => {
    //     setTargetData()
    // }, [])

    const setTargetData = async () => {
        // let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        // if (employeeData) {
        //     const jsonObj = JSON.parse(employeeData);
        //     if (await AsyncStore.getData('TARGET_EMP_ID') && Number(jsonObj.empId) === Number(await AsyncStore.getData('TARGET_EMP_ID'))){
        //         console.log("INSIDE IF", await AsyncStore.getData('TARGET_EMP_ID'), jsonObj.empId);
        //         let obj = {
        //             empData: JSON.parse(await AsyncStore.getData('TARGET_EMP')),
        //             allEmpData: JSON.parse(await AsyncStore.getData('TARGET_EMP_ALL')),
        //             allTargetData: JSON.parse(await AsyncStore.getData('TARGET_ALL')),
        //             targetData: JSON.parse(await AsyncStore.getData('TARGET_DATA')),
        //         }
        //         dispatch(updateTargetData(obj))
        //     }
        //     else{
        //         AsyncStore.storeData('TARGET_EMP_ID', jsonObj.empId.toString())
        //         let obj = {
        //             empData: empData,
        //             allEmpData: allData.employeeTargetAchievements,
        //             allTargetData: allData.overallTargetAchivements,
        //             targetData: targetData,
        //         }
        //         dispatch(updateTargetData(obj))
        //     }
        // }

        console.log("TTTTT CALLED: ", await AsyncStore.getData('TARGET_EMP'));
        let obj = {
            empData: await AsyncStore.getData('TARGET_EMP') ? JSON.parse(await AsyncStore.getData('TARGET_EMP')) : empData,
            allEmpData: await AsyncStore.getData('TARGET_EMP_ALL') ? JSON.parse(await AsyncStore.getData('TARGET_EMP_ALL')) : allData.employeeTargetAchievements,
            allTargetData: await AsyncStore.getData('TARGET_ALL') ? JSON.parse(await AsyncStore.getData('TARGET_ALL')) : allData.overallTargetAchivements,
            targetData: await AsyncStore.getData('TARGET_DATA') ? JSON.parse(await AsyncStore.getData('TARGET_DATA')) : targetData,
        }
        dispatch(updateTargetData(obj))
    }

    useEffect(() => {
        if (selector.target_parameters_data.length > 0) {
            let tempRetail = [];
            tempRetail = selector.target_parameters_data.filter((item) => {
                return item.paramName.toLowerCase() === 'invoice'
            })
            if (tempRetail.length > 0) {
                setRetailData(tempRetail[0])
            }
        } else {
        }
    }, [selector.target_parameters_data])

    useEffect(async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            if (selector.allDealerData.length > 0) {
                let tempArr = [], allArray = selector.allDealerData;
                setDealerCount(selector.allDealerData.length)
                tempArr = allArray.filter((item) => {
                    return item.empId === jsonObj.empId
                })
                if (tempArr.length > 0) {
                    // console.log("RANK", tempArr[0].rank);
                    setDealerRank(tempArr[0].rank)
                }
                else {

                }
            }
        }

    }, [selector.allDealerData])

    useEffect(async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            // const dateFormat = "YYYY-MM-DD";
            // const currentDate = moment().format(dateFormat)
            // const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
            // const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
            // const payload = {
            //     "endDate": monthLastDate,
            //     "loggedInEmpId": jsonObj.empId,
            //     "startDate": monthFirstDate,
            //     "levelSelected": null,
            //     "pageNo": 0,
            //     "size": 5
            // }
            // console.log("jsonObj: ", jsonObj);
            // if (selector.login_employee_details?.roles.length > 0) {
            //     let rolesArr = [];
            //     rolesArr = selector.login_employee_details?.roles.filter((item) => {
            //         return item === "Admin Prod" || item === "App Admin" || item === "Manager" || item === "TL" || item === "General Manager" || item === "branch manager" || item === "Testdrive_Manager"
            //     })
            //     if (rolesArr.length > 0) {
            //         console.log("%%%%% TEAM:", rolesArr);
            //         setIsTeamPresent(true)
            //         // Promise.all([
            //         //     dispatch(getTargetParametersAllData(payload))
            //         // ]).then(() => {
            //         //     console.log('I did everything!');
            //         // });
            //     }
            // }
        }

    }, [selector.login_employee_details])

    useEffect(async () => {
        // if (selector.groupDealerRank > 0) {
        //     console.log("DDDDDDD", selector.groupDealerRank);
        //     setGroupDealerRank(selector.groupDealerRank)
        //     setGroupDealerCount(selector.groupDealerCount)
        // }
        // if (selector.dealerRank > 0) {
        //     setDealerRank(selector.dealerRank)
        //     setDealerCount(selector.dealerCount)
        // }
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            if (selector.allGroupDealerData.length > 0) {
                // console.log("£££££RRRRR:", selector.allGroupDealerData[0]);
                let tempArr = [], allArray = selector.allGroupDealerData;
                setGroupDealerCount(selector.allGroupDealerData.length)
                tempArr = allArray.filter((item) => {
                    return item.empId === jsonObj.empId
                })
                if (tempArr.length > 0) {
                    // console.log("RANK", tempArr[0].rank);
                    setGroupDealerRank(tempArr[0].rank)
                }
                else {

                }
            }
        }

    }, [selector.allGroupDealerData])

    useEffect(async () => {
        // if (await AsyncStore.getData(AsyncStore.Keys.IS_LOGIN) === 'true'){
            updateBranchNameInHeader()
            getMenuListFromServer();
            getLoginEmployeeDetailsFromAsyn();
        getCustomerType()
            checkLoginUserAndEnableReportButton();
        // }
        
        const unsubscribe = navigation.addListener('focus', () => {
            updateBranchNameInHeader()
            getLoginEmployeeDetailsFromAsyn();
        });

        return unsubscribe;
    }, [navigation]);

    const getCustomerType = async() => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        // console.log("$$$$$ LOGIN EMP:", employeeData);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            dispatch(getCustomerTypeList(jsonObj.orgId));
        }
    }

    const updateBranchNameInHeader = async () => {
        await AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_NAME).then((branchName) => {
            // console.log("branchNameTest: ", branchName)
            if (branchName) {
                setSelectedBranchName(branchName);
            }
        });
    }

    const moveToSelectBranch = () => {
        navigation.navigate(AppNavigator.HomeStackIdentifiers.select_branch, { isFromLogin: false, })
    }
    const moveToFilter = () => {
        navigation.navigate(AppNavigator.HomeStackIdentifiers.filter, { isFromLogin: false, })
    }
    const getMenuListFromServer = async () => {
        let name = await AsyncStore.getData(AsyncStore.Keys.USER_NAME);
        if (name) {
            dispatch(getMenuList(name));
        }
    }

    const checkLoginUserAndEnableReportButton = async () => {
        let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
        let orgId = await AsyncStore.getData(AsyncStore.Keys.ORG_ID);
        let data = {
            empId: empId,
            orgId: orgId
        }

        dispatch(getCallRecordingCredentials(data))


        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
         console.log("SSSSSSSSSSSSSSSSSSSSS$$$$$ LOGIN EMP:", employeeData);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            let findMdArr = [];
            
            findMdArr = jsonObj.roles.filter((item) => {
                return item === 'MD'
            })
            if (findMdArr.length > 0) {
                setIsButtonPresent(true)
            }
        }
    }

    const getLoginEmployeeDetailsFromAsyn = async () => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        // console.log("$$$$$ LOGIN EMP:", employeeData);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                orgId: jsonObj.orgId,
                branchId: jsonObj.branchId
            }
            setHeaderText(jsonObj.empName)
            const dateFormat = "YYYY-MM-DD";
            const currentDate = moment().format(dateFormat)
            const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
            const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);

            Promise.all([
                dispatch(getOrganaizationHirarchyList(payload)),
                dispatch(getSourceOfEnquiryList(jsonObj.orgId)),
                dispatch(getVehicalModalList({
                    "bu": jsonObj.orgId,
                    "dropdownType": "model",
                    "parentId": 0
                })),
                dispatch(getDealerRanking({
                    payload: {
                        "endDate": monthLastDate,
                        "loggedInEmpId": jsonObj.empId,
                        "startDate": monthFirstDate,
                        "levelSelected": null,
                        "pageNo": 0,
                        "size": 0
                    },
                    orgId: jsonObj.orgId,
                    branchId: jsonObj.branchId
                })),
                dispatch(getGroupDealerRanking({
                    payload: {
                        "endDate": monthLastDate,
                        "loggedInEmpId": jsonObj.empId,
                        "startDate": monthFirstDate,
                        "levelSelected": null,
                        "pageNo": 0,
                        "size": 0
                    },
                    orgId: jsonObj.orgId
                }))
            ]).then(() => {
                console.log('I did everything!');
            });
            console.log("LOGIN DATA:>>>>>>>>>>>>>>>>>>>>>>>>>", JSON.stringify(jsonObj.hrmsRole));
            if (jsonObj?.hrmsRole === "Admin Prod" || jsonObj?.hrmsRole === "App Admin" || jsonObj?.hrmsRole === "Manager" || jsonObj?.hrmsRole === "TL" || jsonObj?.hrmsRole === "General Manager" || jsonObj?.hrmsRole === "branch manager" || jsonObj?.hrmsRole === "Testdrive_Manager" || jsonObj?.hrmsRole === "MD"){
                dispatch(updateIsTeamPresent(true))
                setIsTeamPresent(true)
                if (jsonObj?.hrmsRole === 'MD' || jsonObj?.hrmsRole === "App Admin" ) {
                    // dispatch(updateData(sidemenuSelector.managerData))
                    // dispatch(updateIsTeam(true))
                    // dispatch(acctionCreator.updateIsTeam(true))
                    dispatch(updateIsMD(true))
                    if (jsonObj?.hrmsRole === 'MD') {
                        setIsButtonPresent(true)
                    }
                }
                else {
                    // dispatch(updateData(sidemenuSelector.normalData))
                    dispatch(updateIsMD(false))
                }
                // console.log("%%%%% TEAM:", rolesArr);
                const dateFormat = "YYYY-MM-DD";
                const currentDate = moment().format(dateFormat)
                const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                const payload = {
                    "endDate": monthLastDate,
                    "loggedInEmpId": jsonObj.empId,
                    "startDate": monthFirstDate,
                    "levelSelected": null,
                    "empId": jsonObj.empId
                }
                // console.log("PAYLOAD:", payload);
                getAllTargetParametersDataFromServer(payload)
            }
            if (jsonObj?.hrmsRole.toLowerCase().includes('manager')) {
                // dispatch(updateData(sidemenuSelector.managerData))
                dispatch(updateIsManager(true))
            }
            else {
                // dispatch(updateData(sidemenuSelector.normalData))
                dispatch(updateIsManager(false))
            }

            if (jsonObj?.hrmsRole.toLowerCase().includes('dse')) {
                // dispatch(updateData(sidemenuSelector.managerData))
                dispatch(updateIsDSE(true))
            }
            else {
                // dispatch(updateData(sidemenuSelector.normalData))
                dispatch(updateIsDSE(false))
            }
            console.log("<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+jsonObj?.hrmsRole);

            

            if (jsonObj?.roles.length > 0) {
                let rolesArr = [], mdArr = [], dseArr = [];
                console.log("ROLLS:", jsonObj.roles);
                rolesArr = jsonObj.roles.filter((item) => {
                    return item === "Admin Prod" || item === "App Admin" || item === "Manager" || item === "TL" || item === "General Manager" || item === "branch manager" || item === "Testdrive_Manager"
                })
                // rolesArr2 = jsonObj.roles.filter((item) => {
                //     return item.toLowerCase().includes('manager')
                // })

                // mdArr = jsonObj.roles.filter((item) => {
                //     return item.toLowerCase().includes('md')
                // })

                // dseArr = jsonObj.roles.filter((item) => {
                //     return item.toLowerCase().includes('dse')
                // })

                // if (item.toLowerCase().includes('manager')) {
                //     // dispatch(updateData(sidemenuSelector.managerData))
                //     dispatch(updateIsManager(true))
                // }
                // else {
                //     // dispatch(updateData(sidemenuSelector.normalData))
                //     dispatch(updateIsManager(false))
                // }

                // if (dseArr.length > 0) {
                //     // dispatch(updateData(sidemenuSelector.managerData))
                //     dispatch(updateIsDSE(true))
                // }
                // else {
                //     // dispatch(updateData(sidemenuSelector.normalData))
                //     dispatch(updateIsDSE(false))
                // }

                // if (mdArr.length > 0) {
                //     // dispatch(updateData(sidemenuSelector.managerData))
                //     dispatch(updateIsTeam(true))
                //     dispatch(acctionCreator.updateIsTeam(true))
                //     dispatch(updateIsMD(true))
                // }
                // else {
                //     // dispatch(updateData(sidemenuSelector.normalData))
                //     dispatch(updateIsMD(false))
                // }
                if (rolesArr.length > 0) {
                    setRoles(rolesArr)
                    // dispatch(updateIsTeamPresent(true))
                    // setIsTeamPresent(true)
                    // // console.log("%%%%% TEAM:", rolesArr);
                    // const dateFormat = "YYYY-MM-DD";
                    // const currentDate = moment().format(dateFormat)
                    // const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                    // const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                    // const payload = {
                    //     "endDate": monthLastDate,
                    //     "loggedInEmpId": jsonObj.empId,
                    //     "startDate": monthFirstDate,
                    //     "levelSelected": null,
                    //     "empId": jsonObj.empId
                    // }
                    // // console.log("PAYLOAD:", payload);
                    // getAllTargetParametersDataFromServer(payload)
                }
            }
            getDashboadTableDataFromServer(jsonObj.empId);
        }
    }

    const getHomeData = async() => {
        let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        // console.log("$$$$$ LOGIN EMP:", employeeData);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const dateFormat = "YYYY-MM-DD";
            const currentDate = moment().format(dateFormat)
            const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
            const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
            const payload = {
                "endDate": monthLastDate,
                "loggedInEmpId": jsonObj.empId,
                "startDate": monthFirstDate,
                "levelSelected": null,
                "empId": jsonObj.empId
            }
            if(isTeamPresent){
                dispatch(getTargetParametersData({
                    ...payload,
                    "pageNo": 0,
                    "size": 5
                })),
                getAllTargetParametersDataFromServer(payload);
            }
            else{
                getTargetParametersDataFromServer(payload);
            }
        }
    }

    const getDashboadTableDataFromServer = (empId) => {
        const dateFormat = "YYYY-MM-DD";
        const currentDate = moment().format(dateFormat)
        const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
        const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
        const payload = {
            "endDate": monthLastDate,
            "loggedInEmpId": empId,
            "startDate": monthFirstDate,
            "levelSelected": null,
            "empId": empId
        }

        Promise.all([
            dispatch(getLeadSourceTableList(payload)),
            dispatch(getVehicleModelTableList(payload)),
            dispatch(getEventTableList(payload)),
            // dispatch(getLostDropChartData(payload))
        ]).then(() => {
            console.log('I did everything!');
        });

        getTaskTableDataFromServer(empId, payload);
        getTargetParametersDataFromServer(payload);
    }

    const getTaskTableDataFromServer = (empId, oldPayload) => {

        const payload = {
            ...oldPayload,
            "pageNo": 0,
            "size": 5
        }
        Promise.all([
            dispatch(getTaskTableList(payload)),
            dispatch(getSalesData(payload)),
            dispatch(getSalesComparisonData(payload))
        ]).then(() => {
            console.log('I did everything!');
        });
    }

    const getTargetParametersDataFromServer = (payload) => {
        const payload1 = {
            ...payload,
            "pageNo": 0,
            "size": 5
        }
        Promise.allSettled([
            dispatch(getTargetParametersData(payload1)),
            dispatch(getTargetParametersEmpData(payload1))
        ]).then(() => {
            console.log('I did everything!');
        });
    }

    const getAllTargetParametersDataFromServer = (payload) => {
        const payload1 = {
            ...payload,
            "pageNo": 0,
            "size": 5
        }
        // console.log("PAYLOAD:", payload1);
        Promise.allSettled([
            dispatch(getTargetParametersAllData(payload1)),
            dispatch(getTargetParametersEmpData(payload1))
        ]).then(() => {
            console.log('I did everything!');
        });
    }

    useEffect(() => {
        if (Object.keys(selector.sales_data).length > 0) {
            const dataObj = selector.sales_data;
            const data = [dataObj.liveBookings, dataObj.complaints, dataObj.deliveries, dataObj.dropRevenue, dataObj.pendingOrders]
            setSalesDataAry(data);
        }
    }, [selector.sales_data])

    useEffect(() => {
        setIsTeam(selector.isTeam)
    }, [selector.isTeam])


    const showDropDownModelMethod = (key, headerText) => {
        Keyboard.dismiss();
        switch (key) {
            case "TARGET_MODEL":
                setDataForDropDown([
                    {
                        id: 1,
                        name: "Target 1",
                        isChecked: false,
                    },
                    {
                        id: 2,
                        name: "Target 2",
                        isChecked: false,
                    },
                    {
                        id: 3,
                        name: "Target 3",
                        isChecked: false,
                    },
                ]);
                break;
        }
        setDropDownKey(key);
        setDropDownTitle(headerText);
        setShowDropDownModel(true);
    };

    const downloadFileFromServer = async () => {
        setLoading(true)
        Promise.all([
            dispatch(getBranchIds({}))
        ]).then(async (res) => {
            // console.log('DATA', res[0]);
            let branchIds = []
            let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                if (res[0]?.payload.length > 0) {
                    let braches = res[0]?.payload;
                    for (let i = 0; i < braches.length; i++) {
                        branchIds.push(braches[i].id);
                        if (i == braches.length - 1) {
                            const dateFormat = "YYYY-MM-DD";
                            const currentDate = moment().format(dateFormat)
                            const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                            const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                            let payload = {
                                branchIdList: branchIds,
                                orgId: jsonObj.orgId,
                                fromDate: monthFirstDate + " 00:00:00",
                                toDate: monthLastDate + " 23:59:59"
                            }
                            // console.log("PAYLOAD:", payload);
                            Promise.all([
                                dispatch(downloadFile(payload))
                            ]).then(async (res) => {
                                // console.log('DATA', JSON.stringify(res));
                                if (res[0]?.payload?.downloadUrl) {
                                    downloadInLocal(res[0]?.payload?.downloadUrl)
                                }
                                else {
                                    setLoading(false)
                                }
                            }).catch(() => {
                                setLoading(false)
                            })

                            // try {
                            //     const response = await client.post(URL.DOWNLOAD_FILE(), payload)
                            //     const json = await response.json()
                            //     console.log("DOWNLOAD: ", json);
                            // } catch (error) {
                            //     setLoading(false)
                            // }
                        }
                    }
                }
            }

        }).catch(() => {
            setLoading(false)
        })
    }


    const downloadFileFromServer1 = async () => {
        setLoading(true)
        Promise.all([
            dispatch(getBranchIds({}))
        ]).then(async (res) => {
            // console.log('DATA', res[0]);
            let branchIds = []
            let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                //  if (res[0]?.payload.length > 0) {
                //     let braches = res[0]?.payload;
                //    for (let i = 0; i < braches.length; i++) {
                //       branchIds.push(braches[i].id);
                //   if (i == braches.length - 1) {
                const dateFormat = "YYYY-MM-DD";
                const currentDate = moment().format(dateFormat)
                const monthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);
                const monthLastDate = moment(currentDate, dateFormat).subtract(0, 'months').endOf('month').format(dateFormat);
                let payload7 = {
                    orgId: jsonObj.orgId,
                    reportFrequency: "MONTHLY",
                    reportType: "ORG",
                    location: "Khammam"
                }
                // console.log("PAYLOAD:", payload7);
                Promise.all([
                    dispatch(downloadFile(payload7))
                ]).then(async (res) => {
                    // console.log('DATA', JSON.stringify(res));
                    if (res[0]?.payload?.downloadUrl) {
                        downloadInLocal(res[0]?.payload?.downloadUrl)
                    }
                    else {
                        setLoading(false)
                    }
                }).catch(() => {
                    setLoading(false)
                })

                // try {
                //     const response = await client.post(URL.DOWNLOAD_FILE(), payload)
                //     const json = await response.json()
                //     console.log("DOWNLOAD: ", json);
                // } catch (error) {
                //     setLoading(false)
                // }
                //  }
                //   }
                //    }
            }

        }).catch(() => {
            setLoading(false)
        })
    }

    const downloadInLocal = async (url) => {
        const { config, fs } = RNFetchBlob;
        let downloadDir = Platform.select({ ios: fs.dirs.DocumentDir, android: fs.dirs.DownloadDir });
        let date = new Date();
        let file_ext = getFileExtention(url);
        file_ext = '.' + file_ext[0];
        // console.log({ file_ext })
        let options = {}
        if (Platform.OS === 'android') {
            options = {
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                    notification: true,
                    path: downloadDir + "/ETVBRL_" + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext, // this is the path where your downloaded file will live in
                    description: 'Downloading image.'
                }
            }
            config(options)
                .fetch('GET', url)
                .then((res) => {
                    // console.log(JSON.stringify(res), "sucess");
                    setLoading(false);
                    RNFetchBlob.android.actionViewIntent(res.path());
                    // do some magic here
                }).catch((err) => {
                    console.error(err);
                    setLoading(false)
                })
        }
        if (Platform.OS === 'ios') {
            options = {
                fileCache: true,
                path: downloadDir + "/ETVBRL_" + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext,
                // mime: 'application/xlsx',
                // appendExt: 'xlsx',
                //path: filePath,
                //appendExt: fileExt,
                notification: true,
            }

            config(options)
                .fetch('GET', url)
                .then(res => {
                    setLoading(false);
                    setTimeout(() => {
                        // RNFetchBlob.ios.previewDocument('file://' + res.path());   //<---Property to display iOS option to save file
                        RNFetchBlob.ios.openDocument(res.data);                      //<---Property to display downloaded file on documaent viewer
                        // Alert.alert(CONSTANTS.APP_NAME,'File download successfully');
                    }, 300);

                })
                .catch(errorMessage => {
                    setLoading(false);
                });
        }
    }

    const getFileExtention = fileUrl => {
        // To get the file extension
        return /[.]/.exec(fileUrl) ?
            /[^.]+$/.exec(fileUrl) : undefined;
    };

    return (
        <SafeAreaView style={styles.container}>
            <DropDownComponant
                visible={showDropDownModel}
                headerTitle={dropDownTitle}
                data={dataForDropDown}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {

                    setShowDropDownModel(false);
                    setDropDownData({ key: dropDownKey, value: item.name, id: item.id })
                }}
            />
            <HeaderComp
                // title={"Dashboard"}
                // title={roles.length > 0 ? roles[0] : ''}
                title={headerText}
                branchName={selectedBranchName}
                menuClicked={() => navigation.openDrawer()}
                branchClicked={() => moveToSelectBranch()}
                filterClicked={() => moveToFilter()}
            />
            <View style={{ flex: 1, padding: 10 }}>
                <FlatList
                    data={[1, 2, 3]}
                    listKey={"TOP_FLAT_LIST"}
                    keyExtractor={(item, index) => "TOP" + index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {

                        if (index === 0) {
                            return (
                                <>
                                    {isButtonPresent &&
                                        <View style={{ width: '100%', alignItems: 'flex-end', marginBottom: 15 }}>
                                            <TouchableOpacity style={{ width: 130, height: 30, backgroundColor: Colors.RED, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }} onPress={downloadFileFromServer1}>
                                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>ETVBRL Report</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                    {!selector.isMD &&
                                        <>
                                        <View style={styles.rankView}>
                                            <View style={styles.rankBox}>
                                                {/* <Text style={styles.rankHeadingText}>Group Dealer Ranking</Text> */}
                                                <Text style={styles.rankHeadingText}>Dealer Ranking</Text>
                                                <View style={{
                                                    flexDirection: 'row'
                                                }}>
                                                    <TouchableOpacity style={styles.rankIconBox} onPress={() => { 
                                                        navigation.navigate(AppNavigator.HomeStackIdentifiers.leaderboard)
                                                     }}>
                                                        {/* <VectorImage
                                                    width={25}
                                                    height={16}
                                                    source={SPEED}
                                                // style={{ tintColor: Colors.DARK_GRAY }}
                                                /> */}
                                                        <Image style={styles.rankIcon} source={require("../../../assets/images/perform_rank.png")} />
                                                    </TouchableOpacity>
                                                    <View style={{
                                                        marginTop: 5,
                                                        marginLeft: 3
                                                    }}>
                                                        {groupDealerRank !== null &&
                                                            <Text style={styles.rankText}>{groupDealerRank}/{groupDealerCount}</Text>
                                                        }
                                                        {/* <View style={{
                                                    marginTop: 5
                                                }}>
                                                    <Text style={styles.baseText}>Based on city</Text>
                                                </View> */}
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={styles.rankBox}>
                                                {/* <Text style={styles.rankHeadingText}>Dealer Ranking</Text> */}
                                                <Text style={styles.rankHeadingText}>Branch Ranking</Text>
                                                <View style={{
                                                    flexDirection: 'row'
                                                }}>
                                                    <View style={styles.rankIconBox}>
                                                        {/* <VectorImage
                                                    width={25}
                                                    height={16}
                                                    source={SPEED}
                                                // style={{ tintColor: Colors.DARK_GRAY }}
                                                /> */}
                                                        <Image style={styles.rankIcon} source={require("../../../assets/images/perform_rank.png")} />
                                                    </View>
                                                    <View style={{
                                                        marginTop: 5,
                                                        marginLeft: 3,
                                                        // justifyContent: 'center'
                                                    }}>
                                                        {/* <Text style={styles.rankText}>14/50</Text> */}
                                                        {dealerRank !== null &&
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <Text style={[styles.rankText]}>{dealerRank}</Text>
                                                                <Text style={[styles.rankText]}>/{dealerCount}</Text>
                                                            </View>
                                                        }
                                                        {/* <View style={{
                                                    marginTop: 5
                                                }}>
                                                    <Text style={styles.baseText}>Based on city</Text>
                                                </View> */}
                                                    </View>
                                                </View>
                                            </View>

                                            {/* <View style={styles.retailBox}>
                                        <View style={{
                                            flexDirection: 'row',
                                            marginBottom: 5
                                        }}>
                                            {retailData !== null &&
                                                <>
                                                    <Text style={{ color: 'red' }}>{retailData?.achievment}/ </Text>
                                                    <Text>{retailData?.target}</Text>
                                                </>
                                            }
                                        </View>
                                        <Text style={{ color: 'red', fontSize: 14 }}>Retails</Text>
                                        <View style={{ marginTop: 5 }}>
                                            <Text style={{ fontSize: 12, color: '#aaa3a3' }}>Ach v/s Tar</Text>
                                        </View>
                                    </View> */}

                                            <View style={styles.rankBox}>
                                                <Text style={styles.rankHeadingText}>Retails</Text>
                                                <View style={{
                                                    flexDirection: 'row'
                                                }}>
                                                    <View style={styles.rankIconBox}>
                                                        {/* <VectorImage
                                                    width={25}
                                                    height={16}
                                                    source={SPEED}
                                                // style={{ tintColor: Colors.DARK_GRAY }}
                                                /> */}
                                                        <Image style={styles.rankIcon} source={require("../../../assets/images/retail.png")} />
                                                    </View>
                                                    <View style={{
                                                        marginTop: 5,
                                                        marginLeft: 5,
                                                    }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={[styles.rankText, { color: 'red' }]}>{retailData?.achievment} </Text>
                                                            <Text style={styles.rankText}>/{retailData?.target}</Text>
                                                        </View>
                                                        <View style={{
                                                            marginTop: 5
                                                        }}>
                                                            <Text style={styles.baseText}>Ach v/s Tar</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                            {/* <TouchableOpacity style={{ position: 'absolute', top: -10, right: -10 }}
                                            onPress={() => navigation.navigate(HomeStackIdentifiers.filter)}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
                                            {/* <Text style={[styles.text1, { color: Colors.RED }]}>{'Filters'}</Text> */}
                                            {/* <IconButton icon={'filter-outline'} size={25} color={Colors.RED} style={{ margin: 0, padding: 0 }} />
                                            </View>
                                        </TouchableOpacity> */}
                                        </View>
                                        </>
                                    }
                                </>
                            )
                        }
                        else if (index === 1) {
                            return (
                                <>
                                    {/* <View style={{ marginBottom: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>

                                        <View style={styles.performView}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ marginBottom: 5 }}>
                                                    <Text style={styles.text3}>{"My Performance"}</Text>
                                                </View>
                                                <Text style={{ fontSize: 12, color: '#aaa3a3' }}>Last updated March 29 2020 11:40 am</Text>
                                            </View>
                                         
                                        </View>
                                        {!isTeamPresent &&
                                            <View >
                                                <TargetDropdown
                                                    label={"Select Target"}
                                                    value={dropDownData ? dropDownData.value : ''}
                                                    onPress={() =>
                                                        showDropDownModelMethod("TARGET_MODEL", "Select Target")
                                                    }
                                                />
                                            </View>
                                        }
                                    </View> */}

                                    {isTeamPresent && !selector.isDSE &&
                                        <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', borderColor: Colors.RED, borderWidth: 1, borderRadius: 5, height: 41, marginTop: 10, justifyContent: 'center', width: '80%' }}>

                                                <TouchableOpacity onPress={() => {
                                                    // setIsTeam(true)
                                                    dispatch(updateIsTeam(false))
                                                }} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: selector.isTeam ? Colors.WHITE : Colors.RED, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
                                                    <Text style={{ fontSize: 16, color: selector.isTeam ? Colors.BLACK : Colors.WHITE, fontWeight: '600' }}>Self</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => {
                                                    // setIsTeam(false)
                                                    dispatch(updateIsTeam(true))
                                                }} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: selector.isTeam ? Colors.RED : Colors.WHITE, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                                                    <Text style={{ fontSize: 16, color: selector.isTeam ? Colors.WHITE : Colors.BLACK, fontWeight: '600' }}>Teams</Text>
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    }
                                    {selector.isDSE &&
                                        <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', borderColor: Colors.RED, borderWidth: 1, borderRadius: 5, height: 41, marginTop: 10, justifyContent: 'center', width: '80%' }}>
                                                <TouchableOpacity onPress={() => {
                                                    // setIsTeam(true)
                                                    dispatch(updateIsTeam(false))
                                                }} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.RED, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>
                                                    <Text style={{ fontSize: 16, color: Colors.WHITE, fontWeight: '600' }}>Self</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    }
                                    {/* {selector.isMD &&
                                        <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', borderColor: Colors.RED, borderWidth: 1, borderRadius: 5, height: 41, marginTop: 10, justifyContent: 'center', width: '80%' }}>
                                                <TouchableOpacity onPress={() => {
                                                    // setIsTeam(false)
                                                    dispatch(updateIsTeam(true))
                                                }} style={{ width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.RED, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                                                    <Text style={{ fontSize: 16, color: Colors.WHITE, fontWeight: '600' }}>Teams</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    } */}
                                </>
                            )
                        }
                        else if (index === 2) {
                            return (
                                // <View style={[]}>
                                //   <View style={[GlobalStyle.shadow, { padding: 10, backgroundColor: Colors.WHITE, borderRadius: 8 }]}>
                                //     <TargetAchivementComp />
                                //   </View>
                                // </View>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{
                                        width: '95%',
                                        minHeight: 400,
                                        // borderWidth: 1,
                                        shadowColor: Colors.DARK_GRAY,
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowRadius: 4,
                                        shadowOpacity: 0.5,
                                        // elevation: 3,
                                        marginHorizontal: 20
                                    }}>
                                        {(selector.target_parameters_data.length > 0 || (isTeamPresent && selector.all_target_parameters_data.length > 0)) &&
                                            <DashboardTopTabNavigatorNew />
                                        }
                                    </View>
                                </View>
                            )
                        }
                    }}
                />
            </View>
            {/* <ScrollView style={{}}>
        <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 15, }}>
          <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', justifyContent: 'space-between' }}>

          <Searchbar
            style={{ width: "90%" }}
            placeholder="Search"
            onChangeText={(text) => { }}
            value={selector.serchtext}
          />
          <VectorImage
            width={25}
            height={25}
            source={FILTER}
            style={{ tintColor: Colors.DARK_GRAY }}
          />
        </View>

        </View>
      </ScrollView> */}
            <LoaderComponent visible={loading} />
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: Colors.LIGHT_GRAY,
    },
    shadow: {
        //   overflow: 'hidden',
        borderRadius: 4,
        width: "100%",
        height: 250,
        shadowColor: Colors.DARK_GRAY,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 2,
        shadowOpacity: 0.5,
        // elevation: 3,
        position: "relative",
    },
    text1: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.WHITE,
    },
    barVw: {
        backgroundColor: Colors.WHITE,
        width: 40,
        height: "70%",
        justifyContent: "center",
    },
    text2: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    text3: {
        fontSize: 18,
        fontWeight: "800",
    },
    dateVw: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.WHITE,
        marginBottom: 5,
        paddingLeft: 5,
        height: 50,
    },
    boxView: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.WHITE,
        paddingVertical: 5
    },

    performView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.WHITE,
        marginBottom: 5,
        // paddingLeft: 5,
        // height: 100,
        // backgroundColor: 'red'
    },

    rankView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // backgroundColor: Colors.WHITE,
        marginBottom: 5,
        paddingLeft: 3,
        height: 80,
        width: '100%',
    },
    rankIconBox: {
        height: 40,
        width: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        // elevation: 0.4,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#d2d2d2",
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    rankHeadingText: {
        fontSize: 10,
        fontWeight: "500"
    },
    rankText: {
        fontSize: 16,
        fontWeight: "700"
    },
    rankText2: {
        fontSize: 20,
        fontWeight: "700"
    },
    baseText: {
        fontSize: 10,
        fontWeight: "800"
    },
    rankBox: {
        paddingTop: 5,
        height: 80,
        width: '32%',
        // backgroundColor: 'red',
        marginRight: 10
    },
    rankBox2: {
        paddingTop: 5,
        height: 80,
        width: '30%',
        // backgroundColor: 'red',
        marginRight: 10
    },

    retailBox: {
        paddingTop: 5,
        height: 80,
        width: '20%',
        // backgroundColor: 'red',
        marginRight: 10,
        alignItems: 'flex-end'
    },
    rankIcon: { width: 25, height: 25 }
});


// const cardClicked = (index) => {

//   if (index === 0) {
//     navigation.navigate(AppNavigator.TabStackIdentifiers.ems);
//   } else if (index === 1) {
//     navigation.navigate(AppNavigator.TabStackIdentifiers.myTask);
//   }
// };

{/* <FlatList
          data={selector.tableData}
          numColumns={2}
          horizontal={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <Pressable onPress={() => cardClicked(index)}>
                <View style={{ flex: 1, width: itemWidth, padding: 5 }}>
                  <View
                    style={[
                      styles.shadow,
                      {
                        backgroundColor:
                          index == 0 ? Colors.YELLOW : Colors.GREEN,
                      },
                    ]}
                  >
                    <View style={{ overflow: "hidden" }}>
                      <Image
                        style={{
                          width: "100%",
                          height: 150,
                          overflow: "hidden",
                        }}
                        resizeMode={"cover"}
                        source={require("../../../assets/images/bently.png")}
                      />

                      <View
                        style={{
                          width: "100%",
                          height: 100,
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.text1}>{item.title}</Text>
                        <View
                          style={{
                            height: 100,
                            width: 50,
                            alignItems: "center",
                          }}
                        >
                          <View style={styles.barVw}>
                            <Text style={styles.text2}>{item.count}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          }}
        /> */}

{/* <View style={{ maxHeight: 100, marginBottom: 15 }}>
          <FlatList
            data={selector.datesData}
            style={{}}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Pressable onPress={() => dispatch(dateSelected(index))}>
                  <View style={{ paddingRight: 10 }}>
                    <DateItem
                      month={item.month}
                      date={item.date}
                      day={item.day}
                      selected={
                        selector.dateSelectedIndex === index ? true : false
                      }
                    />
                  </View>
                </Pressable>
              );
            }}
          />
        </View> */}