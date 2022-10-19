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
    View
} from "react-native";
import { Button, IconButton, Searchbar } from "react-native-paper";
import { EmptyListView } from "../../../pureComponents";
import { LeadsFilterComp, SingleLeadSelectComp, SortAndFilterComp } from "../../../components";
import { useDispatch, useSelector } from "react-redux";
import { Colors, GlobalStyle } from "../../../styles";
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from '../../../asyncStore';
import { getEnquiryList, getMoreEnquiryList } from "../../../redux/enquiryReducer";
import moment from "moment";
import { Category_Type_List_For_Filter } from '../../../jsonData/enquiryFormScreenJsonData';
import { MyTaskNewItem } from '../MyTasks/components/MyTasksNewItem';
import { updateIsSearch, updateSearchKey } from '../../../redux/appReducer';
import { getPreBookingData } from "../../../redux/preBookingReducer";
import DateRangePicker from "../../../utils/DateRangePicker";
import { getLeadsList, getMenu, getStatus, getSubMenu } from "../../../redux/leaddropReducer";
import { useIsFocused } from "@react-navigation/native";
import Entypo from "react-native-vector-icons/FontAwesome";

const dateFormat = "YYYY-MM-DD";
const currentDate = moment().add(0, "day").endOf('month').format(dateFormat);
const lastMonthFirstDate = moment(currentDate, dateFormat).subtract(0, 'months').startOf('month').format(dateFormat);

const LeadsScreen = ({ route, navigation }) => {
    const isFocused = useIsFocused();
    const selector = useSelector((state) => state.enquiryReducer);
    const appSelector = useSelector(state => state.appReducer);
    const { vehicle_model_list_for_filters, source_of_enquiry_list } = useSelector(state => state.homeReducer);
    const dispatch = useDispatch();
    const [vehicleModelList, setVehicleModelList] = useState(vehicle_model_list_for_filters);
    const [sourceList, setSourceList] = useState(source_of_enquiry_list);
    const [categoryList, setCategoryList] = useState(Category_Type_List_For_Filter);

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
    const [searchQuery, setSearchQuery] = useState('');
    const [leadsFilterVisible, setLeadsFilterVisible] = useState(false);
    const [leadsFilterData, setLeadsFilterData] = useState([]);
    const [leadsFilterDropDownText, setLeadsFilterDropDownText] = useState('All');
    const [leadsList, setLeadsList] = useState([]);

    const [subMenu, setSubMenu] = useState([]);
    const [leadsSubMenuFilterVisible, setLeadsSubMenuFilterVisible] = useState(false);
    const [leadsSubMenuFilterDropDownText, setLeadsSubMenuFilterDropDownText] = useState('All');
    const [loader, setLoader] = useState(false);
    const [tempStore, setTempStore] = useState([]);
    const [tempFilterPayload, setTempFilterPayload] = useState([]);
    const [defualtLeadStage, setDefualtLeadStage] = useState([]);
    const [defualtLeadStatus, setdefualtLeadStatus] = useState([]);

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
            checked: false
        },
        {
            id: 2,
            title: "Booking",
            checked: false
        },
        {
            id: 3,
            title: "Retail",
            checked: false
        },
        {
            id: 4,
            title: "Delivery",
            checked: false
        },

    ]

    const leadsFilterDataMainTemp = [
        // {
        //     id: 0,
        //     title: "All",
        //     checked: false
        // },
        {
            id: 1,
            title: "Enquiry",
            checked: false
        },
        {
            id: 2,
            title: "Booking",
            checked: false
        },
        {
            id: 3,
            title: "Retail",
            checked: false
        },
        {
            id: 4,
            title: "Delivery",
            checked: false
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

    const managerFilter = useCallback((newArr) => {
        const alreadyFilterMenu = newArr.filter(e => e.menu == route?.params?.param);
        let modelList = [...newArr];
        const newArr2 = modelList.map(v => ({ ...v, checked: v.menu == route?.params?.param ? true : false }));
        setLeadsFilterData([...newArr2]);
        setTempEmployee(route?.params?.employeeDetail ? route?.params?.employeeDetail : null);
        getSubMenuList(alreadyFilterMenu[0].menu, true, route?.params?.employeeDetail ? route?.params?.employeeDetail : null);
        setLeadsFilterDropDownText(alreadyFilterMenu[0].menu);
    }, [route?.params, leadsFilterData]);


    useEffect(() => {
        if (isFocused) {
            Promise.all([dispatch(getMenu()), dispatch(getStatus())]).then(async ([res, res2]) => {
                setLoader(true);
                let path = res.payload;
                let path2 = res2.payload;
                let leadStage = [];
                let leadStatus = [];
                let newAre = path2.filter(e => e.menu !== "Contact");
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
                const newArr = path.map(v => ({ ...v, checked: false }));
                setTempStore(newArr);
                if (route.params) {
                    managerFilter(newArr);
                }
                else {
                    defualtCall(newArr, leadStage, leadStatus);
                }

            }).catch((err) => {
                console.log("ERROdddR", err);
                setLoader(false);
                setLeadsFilterDropDownText("All");
                setSubMenu([]);
            });
        } else {
            Promise.all([dispatch(getMenu()), dispatch(getStatus())]).then(async ([res, res2]) => {
                setLoader(true);
                let path = res.payload;
                let path2 = res2.payload;
                let leadStage = [];
                let leadStatus = [];
                let newAre = path2.filter(e => e.menu !== "Contact");
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
                const newArr = path.map(v => ({ ...v, checked: false }));
                setTempStore(newArr);
                if (route.params) {
                    managerFilter(newArr);
                }
                else {
                    setLeadsFilterData(newArr);
                    defualtCall(newArr, leadStage, leadStatus);
                }

            }).catch((err) => {
                console.log("EdddRROR", err);
                setLoader(false);
                setLeadsFilterDropDownText("All");
                setSubMenu([]);
            });
        }

    }, [route.params]);

    const defualtCall = async (tempStores, leadStage, leadStatus) => {
        setLeadsFilterData(newArr);
        setSubMenu([]);
        setLeadsFilterDropDownText('All');
        setFromDateState(lastMonthFirstDate);
        const tomorrowDate = moment().add(1, "day").format(dateFormat)
        setToDateState(currentDate);
        setLeadsFilterData(tempStores);
        const newArr = tempStores.map(function (x) {
            x.checked = false;
            return x
        });;
        setTempLeadStage(leadStage);
        setTempLeadStatus([]);
        onTempFliter(newArr, null, [], [], [], lastMonthFirstDate, currentDate, leadStage, []);
        return
        await applyLeadsFilter(newArr, lastMonthFirstDate, currentDate);
    }

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
                break;
            case "TO_DATE":
                setToDateState(formatDate);
                // getEnquiryListFromServer(employeeId, selectedFromDate, formatDate);
                break;
        }
    }

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
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
                    name: element.name,
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
        setTempVehicleModelList(modelFilters);
        setTempCategoryList(categoryFilters);
        setTempSourceList(sourceFilters);
        onTempFliter(tempFilterPayload, isEmpty(tempEmployee) ? null : tempEmployee, modelFilters, categoryFilters, sourceFilters, selectedFromDate, selectedToDate, tempLeadStage, tempLeadStatus);
        return
        // // Make Server call
        // const payload2 = getPayloadData(employeeId, selectedFromDate, selectedToDate, 0, modelFilters, categoryFilters, sourceFilters)
        // dispatch(getEnquiryList(payload2));
        applyLeadsFilter(leadsFilterData, selectedFromDate, selectedToDate, modelFilters, categoryFilters, sourceFilters)
    }

    const applyLeadsFilter = async (data, startDate, endDate, modelFilters = [], categoryFilters = [], sourceFilters = []) => {
        setLoader(true);
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            // const leadsData = data.filter(x => x.checked);
            const leadsData = data.filter(x => x.status === "Active");
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
                setLoader(false);
                const dataSorted = data.sort((x, y) => y.modifiedDate - x.modifiedDate);
                setLeadsList([...dataSorted]);
                setSearchedData([]);
                setSearchedData(dataSorted);
            }).catch(() => {
                setLoader(false);
            });
        }


    }

    const getSubMenuList = async (item, getAllData = false, employeeDetail = {}) => {
        Promise.all([dispatch(getSubMenu(item.toUpperCase()))])
            .then((response) => {
                let path = response[0]?.payload[0]?.allLeadsSubstagesEntity;
                if (getAllData) {
                    setSearchedData([]);
                    const newArr = path.map(object => {
                        if (object.subMenu == "ALL") {
                            return { ...object, checked: true };
                        }
                        return object;
                    });
                    setTempFilterPayload(newArr);
                    onTempFliter(newArr, employeeDetail,);
                    setSubMenu(newArr);
                    setLeadsSubMenuFilterDropDownText("ALL");

                } else if (path.length == 1) {
                    // getFliteredList(path[0]);
                    let newPath = path.map(v => ({ ...v, checked: true }));
                    setTempFilterPayload(newPath);
                    onTempFliter(newPath, employeeDetail, tempVehicleModelList, tempCategoryList, tempSourceList, selectedFromDate, selectedToDate);
                    NewSubMenu([]);
                } else {
                    NewSubMenu(path);
                }
            }).catch((error) =>
                console.log("Error", error)
            );
    }

    const NewSubMenu = (item) => {
        const newArr = item.map(v => ({ ...v, checked: false, subData: [] }));
        setSubMenu(newArr);
        setLeadsSubMenuFilterDropDownText('Select Sub Menu');
    }

    const onTempFliter = async (item, employeeDetail = {}, modelData, categoryFilters, sourceData, from, to, defLeadStage, defLeadStatus) => {
        setSearchedData([]);
        setLoader(true);
        const employeeData = await AsyncStore.getData(
            AsyncStore.Keys.LOGIN_EMPLOYEE
        );
        if (employeeData) {
            let newArray = item.filter(i => i.checked === true);
            const jsonObj = JSON.parse(employeeData);
            let leadStage = [];
            let leadStatus = [];
            let categoryType = [];
            let sourceOfEnquiry = [];
            let model = [];

            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i].leadStage){
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
                        name: modelData[i].name ? modelData[i].name : modelData[i].key,
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
                "model": modelData ? model : [],
                "categoryType": categoryFilters ? categoryType : [],
                "sourceOfEnquiry": sourceData ? sourceOfEnquiry : [],
                "empId": employeeDetail ? route.params.employeeDetail.empId : jsonObj.empId,
                "status": "",
                "offset": 0,
                "limit": 500,
                "leadStage": defLeadStage ? defLeadStage : leadStage.length === 0 ? defualtLeadStage : leadStage,
                "leadStatus": defLeadStatus ? defLeadStatus : leadStatus.length === 0 ? defualtLeadStatus : leadStatus
            };
            Promise.all([dispatch(getLeadsList(newPayload))]).then((response) => {
                setLoader(false);
                let newData = response[0].payload?.dmsEntity?.leadDtoPage?.content;
                setSearchedData(newData);
            })
                .catch((error) => {
                    setLoader(false);
                    console.log(error);
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
                <ActivityIndicator color={Colors.GRAY} />
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
        onTempFliter(tempFilterPayload, isEmpty(tempEmployee) ? null : tempEmployee, tempVehicleModelList, tempCategoryList, tempSourceList, from, to);
        return
        setTimeout(() => {
            applyLeadsFilter(leadsFilterData, from, to);
        }, 500);
    }

    const onRefresh = async () => {
        Promise.all([dispatch(getMenu()), dispatch(getStatus())]).then(async ([res, res2]) => {
            let path = res.payload;
            let path2 = res2.payload;
            let leadStage = [];
            let leadStatus = [];
            let newAre = path2.filter(e => e.menu !== "Contact");
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
            const newArr = path.map(v => ({ ...v, checked: false }));
            setTempStore(newArr);
            setLeadsFilterData(newArr);
            defualtCall(newArr, leadStage, leadStatus);
            setTempEmployee({});
        }).catch((err) => {
            console.log("EdddRROR", err);
            setLoader(false);
            setLeadsFilterDropDownText("All");
            setSubMenu([]);
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType={Platform.OS === "ios" ? 'slide' : 'fade'}
                transparent={true}
                visible={showDatePicker}
                onRequestClose={() => {
                }}
            >
                <SafeAreaView style={styles.calContainer}>
                    <View style={styles.calView1}>
                        <View style={styles.calView2}>
                            <Button
                                mode="text"
                                labelStyle={{ textTransform: 'none', color: Colors.RED }}
                                onPress={() => setShowDatePicker(false)}
                            >
                                Close
                            </Button>
                        </View>
                        <DateRangePicker
                            initialRange={[selectedFromDate, selectedToDate]}
                            onSuccess={(from, to) => {
                                applyDateFilter(from, to);
                            }}
                            theme={{ markColor: Colors.RED, markTextColor: 'white' }} />
                    </View>
                </SafeAreaView>
            </Modal>
            <View>
                <SingleLeadSelectComp visible={leadsFilterVisible} modelList={leadsFilterData} submitCallback={(x) => {
                    setLeadsFilterData([...x]);
                    setLeadsFilterVisible(false);
                    const data = x.filter(y => y.checked);
                    if (data.length === 3) {
                        setLeadsFilterDropDownText('All')
                    } else {
                        const names = data.map(y => y.menu);
                        getSubMenuList(names.toString());
                        setLeadsFilterDropDownText(names.toString());
                    }
                }} cancelClicked={() => {
                    setLeadsFilterVisible(false)
                }}
                    selectAll={async () => {
                        setSubMenu([]);
                        defualtCall(tempStore);
                    }}
                />
                <LeadsFilterComp visible={leadsSubMenuFilterVisible} modelList={subMenu} submitCallback={(x) => {
                    setSubMenu([...x]);
                    setTempFilterPayload(x);
                    onTempFliter(x, isEmpty(tempEmployee) ? null : tempEmployee, tempVehicleModelList, tempCategoryList, tempSourceList, selectedFromDate, selectedToDate);
                    setLeadsSubMenuFilterVisible(false);
                    const data = x.filter(y => y.checked);
                    if (data.length === subMenu.length) {
                        setLeadsSubMenuFilterDropDownText('All')
                    } else {
                        const names = data.map(y => y?.subMenu);
                        setLeadsSubMenuFilterDropDownText(names.toString() ? names.toString() : "Select Sub Menu");
                    }
                }}
                    cancelClicked={() => {
                        setLeadsSubMenuFilterVisible(false)
                    }}
                    onChange={(x) => {
                        // console.log("onChange", x);
                    }}
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
                <View style={{ width: "30%" }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            paddingVertical: 10,
                        }}
                    >
                        <View>
                            <Pressable onPress={() => showDatePickerMethod('FROM_DATE')}>
                                <View style={{
                                    borderColor: Colors.GRAY,
                                    borderWidth: 0.5,
                                    borderRadius: 4,
                                    backgroundColor: Colors.WHITE,
                                    paddingHorizontal: 5,
                                    height: 50,
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: Colors.GRAY }}>Date
                                        range</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <View>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '400',
                                                color: '2022-08-23' ? Colors.BLACK : Colors.GRAY
                                            }}>{selectedFromDate ? selectedFromDate : moment(new Date()).format(dateFormat)
                                                }</Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '400',
                                                color: '2022-08-23' ? Colors.BLACK : Colors.GRAY
                                            }}>{selectedToDate ? selectedToDate : moment(new Date()).format(dateFormat)}</Text>
                                        </View>
                                        <IconButton
                                            icon={"calendar-month"}
                                            size={20}
                                            style={{ margin: 0 }}
                                            color={Colors.RED}
                                        />
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={{ width: '45%' }}>
                    <Pressable onPress={() => {
                        setLeadsFilterVisible(true);
                    }}>
                        <View style={{
                            borderWidth: 0.5,
                            borderColor: Colors.RED,
                            borderRadius: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={{ width: '70%', paddingHorizontal: 5, paddingVertical: 2, fontSize: 12, fontWeight: "600" }}
                                numberOfLines={2}>{leadsFilterDropDownText}</Text>
                            <IconButton icon={leadsFilterVisible ? 'chevron-up' : 'chevron-down'} size={20}
                                color={Colors.RED}
                                style={{ margin: 0, padding: 0, width: '20%' }} />
                        </View>
                    </Pressable>
                </View>
                <Pressable onPress={() => setSortAndFilterVisible(true)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.text1}>{'Filter'}</Text>
                        <IconButton icon={'filter-outline'} size={20} color={Colors.RED}
                            style={{ margin: 0, padding: 0 }} />
                    </View>
                </Pressable>
            </View>
            {subMenu?.length > 1 &&
                <View style={{ width: '90%', alignSelf: "center", backgroundColor: 'white', marginBottom: 5 }}>
                    <Pressable onPress={() => {
                        setLeadsSubMenuFilterVisible(true);
                    }}>
                        <View style={{
                            borderWidth: 0.5,
                            borderColor: Colors.RED,
                            borderRadius: 4,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={{ width: '70%', paddingHorizontal: 4, paddingVertical: 2, fontSize: 12, fontWeight: "600" }}
                                numberOfLines={2}>{leadsSubMenuFilterDropDownText}</Text>
                            <IconButton icon={leadsSubMenuFilterVisible ? 'chevron-up' : 'chevron-down'} size={20}
                                color={Colors.RED}
                                style={{ margin: 0, padding: 0, width: '10%' }} />
                        </View>
                    </Pressable>
                </View>}
            <View>

                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>
            {searchedData && searchedData.length === 0 ? <EmptyListView title={"No Data Found"} isLoading={selector.isLoading || loader} /> :
                <View style={[{ backgroundColor: Colors.LIGHT_GRAY, flex: 1, marginBottom: 10 }]}>
                    <FlatList
                        data={searchedData}
                        extraData={searchedData}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={(
                            <RefreshControl
                                refreshing={selector.isLoading}
                                // onRefresh={() => getEnquiryListFromServer(employeeId, selectedFromDate, selectedToDate)}
                                progressViewOffset={200} />
                        )}
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
            <TouchableOpacity
                onPress={() => {
                    setLoader(true); onRefresh();}}
                style={[GlobalStyle.shadow, styles.floatingBtn]}
            >
                <Entypo size={30} name="refresh" color={Colors.WHITE} />
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
    searchBar: { height: 40 },
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
    floatingBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        position: 'absolute',
        bottom: 10,
        right: 10,
        height: 65,
        backgroundColor: 'rgba(255,21,107,6)',
        borderRadius: 100,
    }
});
