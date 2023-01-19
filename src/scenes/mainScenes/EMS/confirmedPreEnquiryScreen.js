import React, { useState, useEffect, useCallback } from 'react';

import { SafeAreaView, ScrollView, View, Text, StyleSheet, Keyboard, Alert, Dimensions, KeyboardAvoidingView, BackHandler, Modal ,TouchableOpacity,FlatList} from 'react-native';
import { ButtonComp } from "../../../components/buttonComp";
import { Checkbox, Button, IconButton, Divider, List } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../styles';
import { TextinputComp } from '../../../components/textinputComp';
import { DropDownComponant } from '../../../components/dropDownComp';
import { convertTimeStampToDateString, GetDropList } from '../../../utils/helperFunctions';
import { clearState, getPreEnquiryDetails, noThanksApi, getaAllTasks, assignTaskApi, changeEnquiryStatusApi, getEmployeesListApi, updateEmployeeApi, customerLeadRef } from '../../../redux/confirmedPreEnquiryReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppNavigator } from '../../../navigations';
import { EmsTopTabNavigatorIdentifiers } from '../../../navigations/emsTopTabNavigator';
import * as AsyncStore from "../../../asyncStore";
import { LoaderComponent, SelectEmployeeComponant } from '../../../components';
import { getPreEnquiryData } from '../../../redux/preEnquiryReducer';
import { showToastRedAlert, showToast, showToastSucess } from '../../../utils/toast';
import {
    DropDownSelectionItem,
    setDropDownData
} from "../../../pureComponents";
import { setBookingDropDetails } from '../../../redux/preBookingFormReducer';
import { resolvePath } from 'react-native-reanimated/src/reanimated2/animation/styleAnimation';
import { isRejected } from '@reduxjs/toolkit';
import { DropComponent } from './components/dropComp';
import URL from '../../../networking/endpoints';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import Fontisto from "react-native-vector-icons/Fontisto"
import { client } from '../../../networking/client';
let EventListData = [
    {
        eventName: "omega thon",
        eventLocation: "Ahmedabad",
        Startdate: "10/12/2022",
        Enddate: "10/12/2022",
        isSelected: false,
        id: 0


    },
    {
        eventName: "omega thon22",
        eventLocation: "Ahmedabad",
        Startdate: "10/12/2022",
        Enddate: "10/12/2022",
        isSelected: false,
        id: 1
    },
    {
        eventName: "omega thon22",
        eventLocation: "Ahmedabad",
        Startdate: "10/12/2022",
        Enddate: "10/12/2022",
        isSelected: false
        ,
        id: 2
    },
    {
        eventName: "omega thon22",
        eventLocation: "Ahmedabad",
        Startdate: "10/12/2022",
        Enddate: "10/12/2022",
        isSelected: false,
        id: 3
    },
    {
        eventName: "omega thon22",
        eventLocation: "Ahmedabad",
        Startdate: "10/12/2022",
        Enddate: "10/12/2022",
        isSelected: false,
        id: 4
    },

]
const ConfirmedPreEnquiryScreen = ({ route, navigation }) => {

    const selector = useSelector(state => state.confirmedPreEnquiryReducer);
    const homeSelector = useSelector(state => state.homeReducer);
    const dispatch = useDispatch();
    const { itemData, fromCreatePreEnquiry } = route.params;
    const [employeeId, setEmployeeId] = useState("");
    const [organizationId, setOrganizationId] = useState("");
    const [showEmployeeSelectModel, setEmployeeSelectModel] = useState(false);
    const [employeesData, setEmployeesData] = useState([]);
    const [branchId, setBranchId] = useState("");
    const [isDropSelected, setIsDropSelected] = useState(false);
    const [openAccordian, setOpenAccordian] = useState(0);
    const [userToken, setUserToken] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [userData, setUserData] = useState({
        orgId: "",
        employeeId: "",
        employeeName: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    // drop section
    const [dropData, setDropData] = useState([]);
    const [dropReason, setDropReason] = useState("");
    const [dropSubReason, setDropSubReason] = useState("");
    const [dropBrandName, setDropBrandName] = useState("");
    const [dropDealerName, setDropDealerName] = useState("");
    const [dropLocation, setDropLocation] = useState("");
    const [dropModel, setDropModel] = useState("");
    const [dropPriceDifference, setDropPriceDifference] = useState("");
    const [dropRemarks, setDropRemarks] = useState("");
    const [currentLocation, setCurrentLocation] = useState(null);
    const [leadRefIdForEnq, setleadRefIdForEnq] = useState(null);

    const [isEventListModalVisible, setisEventListModalVisible] = useState(false);
    const [eventListdata, seteventListData] = useState([])
    const [selectedEventData, setSelectedEventData] = useState([])
    const [eventConfigRes, setEventConfigRes] = useState([])

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <IconButton
                    icon="arrow-left"
                    color={Colors.WHITE}
                    size={30}
                    onPress={goParentScreen}
                />
            ),
        });
    }, [navigation]);

    const goParentScreen = () => {

        if (fromCreatePreEnquiry) {
            getPreEnquiryListFromServer();
        }
        navigation.popToTop();
        dispatch(clearState());
    }

    const proceedToCancelPreEnquiry = () => {

        if (dropRemarks.length === 0 || dropReason.length === 0) {
            showToastRedAlert("Please enter details for drop");
            return;
        }

        if (!selector.pre_enquiry_details) {
            return;
        }

        let enquiryDetailsObj = { ...selector.pre_enquiry_details };
        let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
        dmsLeadDto.leadStage = "DROPPED";
        enquiryDetailsObj.dmsLeadDto = dmsLeadDto;

        let leadId = selector.pre_enquiry_details.dmsLeadDto.id;
        if (!leadId) {
            showToast("lead id not found");
            return;
        }

        const payload = {
          dmsLeadDropInfo: {
            additionalRemarks: dropRemarks,
            branchId: Number(branchId),
            brandName: dropBrandName,
            dealerName: dropDealerName,
            leadId: leadId,
            crmUniversalId: itemData.universalId,
            lostReason: dropReason,
            lostSubReason: dropSubReason,
            organizationId: userData.orgId,
            otherReason: "",
            droppedBy: userData.employeeId,
            location: dropLocation,
            model: dropModel,
            stage: "PREENQUIRY",
            status: "PREENQUIRY",
          },
        };
        DropPreEnquiryLead(payload, enquiryDetailsObj)
    };



    const DropPreEnquiryLead = async (payload, enquiryDetailsObj) => {
        setIsLoading(true);
        // await fetch(URL.DROP_ENQUIRY(), {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //         "auth-token": userToken
        //     },
        //     body: JSON.stringify(payload)
        // })
        await client.post(URL.DROP_ENQUIRY(), payload)
            .then(json => json.json())
            .then(response => {
                if (response.status === "SUCCESS") {
                    // Update Record
                    UpdateRecord(enquiryDetailsObj);
                } else {
                    showToast("Drop Lead Failed")
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                showToastRedAlert(err);
                setIsLoading(false);
            })
    }

    const UpdateRecord = async (enquiryDetailsObj) => {

        setIsLoading(true);
        // await fetch(URL.UPDATE_ENQUIRY_DETAILS(), {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //         "auth-token": userToken
        //     },
        //     body: JSON.stringify(enquiryDetailsObj)
        // })
        await client.post(URL.UPDATE_ENQUIRY_DETAILS(), enquiryDetailsObj)
            .then(json => json.json())
            .then(response => {
                if (response.success === true) {
                    // go to parent screen
                    // getPreEnquiryListFromServer();
                    // navigation.navigate(EmsTopTabNavigatorIdentifiers.enquiry);
                    showToastSucess("Sent for Manager Approval");
                    navigation.navigate(
                      EmsTopTabNavigatorIdentifiers.preEnquiry,
                      {
                        isContactRefresh: true,
                      }
                    );
                    dispatch(clearState());
                } else {
                    showToast("Update Drop Lead Failed")
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                showToastRedAlert(err);
                setIsLoading(false);
            })
    }

    const getPreEnquiryListFromServer = async () => {
      const dateFormat = "YYYY-MM-DD";
      const currentDate = moment()
        .add(0, "day")
        .endOf("month")
        .format(dateFormat);
      const lastMonthFirstDate = moment(currentDate, dateFormat)
        .subtract(0, "months")
        .startOf("month")
        .format(dateFormat);

      if (employeeId) {
        payload = {
          startdate: lastMonthFirstDate,
          enddate: currentDate,
          empId: employeeId,
          status: "PREENQUIRY",
          offset: 0,
          limit: 500,
        };
        dispatch(getPreEnquiryData(payload));
      }
    };

    useEffect(() => {
        getAsyncStorageData();
        getBranchId();
        // commented it as its getting called multiple time and here its not in use
        // getDropDownApi();

        // api calls
        dispatch(getPreEnquiryDetails(itemData.universalId));

        // Subscribe Listeners
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

        // UnSubscribe Listeners
        // return () => {
        //     BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        // }
    }, []);

    useEffect(() => {
        navigation.addListener('focus', () => {
            getCurrentLocation()
        })
        navigation.addListener('blur', () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        })
    }, [navigation]);
    // useEffect(() => {
    //     if (selector.lead_reference_data && selector.lead_reference_data.referencenumber ){
    //        // alert("hi")

    //     }
    // }, [selector.lead_reference_data]);


    const getBranchId = () => {

        AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID).then((branchId) => {
            setBranchId(branchId);
        });
    }

    const getAsyncStorageData = async () => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            setOrganizationId(jsonObj.orgId);
            setEmployeeId(jsonObj.empId);
            setUserData({
                orgId: jsonObj.orgId,
                employeeId: jsonObj.empId,
                employeeName: jsonObj.empName,
            });

            // Get Token
            AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
                if (token.length > 0) {
                    setUserToken(token);
                    GetPreEnquiryDropReasons(jsonObj.orgId, token);
                }
            });
        }
    };

    const GetPreEnquiryDropReasons = (orgId, token) => {

        GetDropList(orgId, token, "Pre%20Enquiry").then(resolve => {
            setDropData(resolve);
        }, reject => {})
    }

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(info => {
            setCurrentLocation({
                lat: info.coords.latitude,
                long: info.coords.longitude
            })
        });
    }

    // Handle Employees List Response
    useEffect(() => {
      if (
        selector.employees_list.length === 0 &&
        selector.employees_list_status === "success"
      ) {
        if (userData?.employeeId) {
          let newObj = {
            name: userData.employeeName,
            id: userData.employeeId,
          };
          updateEmployee(newObj);
        } else {
          const endUrl = `${itemData.universalId}` + "?" + "stage=PreEnquiry";
          dispatch(getaAllTasks(endUrl));
        }
      } else if (
        selector.employees_list.length > 0 &&
        selector.employees_list_status === "success"
      ) {
        let newData = [];
        selector.employees_list.forEach((element) => {
          const obj = {
            id: element.empId,
            name: element.empName,
            selected: false,
          };
          newData.push(obj);
        });
        setEmployeesData([...newData]);
        setEmployeeSelectModel(true);
      }
    }, [selector.employees_list, selector.employees_list_status]);

    // Handle Get All Tasks Response
    useEffect(() => {
        if (selector.update_employee_status === "success") {
            const endUrl = `${itemData.universalId}` + '?' + 'stage=PreEnquiry';
            dispatch(getaAllTasks(endUrl));
        }
    }, [selector.update_employee_status])

    useEffect(() => {
        if (selector.all_pre_enquiry_tasks.length > 0 && employeeId) {
            let arrTemp = selector.all_pre_enquiry_tasks.filter((obj, index) => {
                return obj.taskName === 'Create Enquiry' && obj.assignee.empId === employeeId;
            })
            let filteredObj = arrTemp.length > 0 ? { ...arrTemp[0] } : undefined;
            if (filteredObj !== undefined) {
                filteredObj.taskStatus = "CLOSED";
                filteredObj.lat = currentLocation ? currentLocation.lat.toString() : null;
                filteredObj.lon = currentLocation ? currentLocation.long.toString() : null;
                dispatch(assignTaskApi(filteredObj));
            }
        }
    }, [selector.all_pre_enquiry_tasks])

    useEffect(() => {
        if (selector.assign_task_status === "success") {
            const endUrl = `${itemData.universalId}` + '?' + 'stage=ENQUIRY';
            dispatch(changeEnquiryStatusApi(endUrl));
        }
    }, [selector.assign_task_status])

    useEffect(() => {
        if (selector.change_enquiry_status === "success") {
            if (selector.change_enquiry_response) {
                displayCreateEnquiryAlert(selector.change_enquiry_response);
            }
        }
    }, [selector.change_enquiry_status, selector.change_enquiry_response])

    const displayCreateEnquiryAlert = async (data) => {

        // "Enquiry Number: " + itemData.universalId
        Alert.alert(
            'Enquiry Created Successfully',
            "Allocated DSE: " + data.dmsEntity.task?.assignee?.empName,
            [
                {
                    text: 'OK', onPress: () => {

                        updateRefNumber()
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const updateRefNumber = async () => {
      let employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const payload = {
          branchid: Number(branchId),
          leadstage: "ENQUIRY",
          orgid: jsonObj.orgId,
          universalId: itemData.universalId,
        };
        customerLeadReference(payload);

        if (
          jsonObj.hrmsRole === "Reception" ||
          jsonObj.hrmsRole === "Tele Caller"
        ) {
            goToParentScreen();
            return;
        }
      }

      goToEnquiry();
    }

    const updateEnquiryDetailsCreateEnquiry = (leadRefIdForEnq) => {
        //SarathKumarUppuluri
        let enquiryDetailsObj = { ...selector.pre_enquiry_details };
        let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
        dmsLeadDto.leadStage = "ENQUIRY";
        dmsLeadDto.salesConsultant = selector.change_enquiry_response.dmsEntity.task?.assignee?.empName
        dmsLeadDto.referencenumber = leadRefIdForEnq;
        enquiryDetailsObj.dmsLeadDto = dmsLeadDto;

        //     alert("lead id" + leadRefIdForEnq + "\n" + dmsLeadDto.salesConsultant)

        let leadId = selector.pre_enquiry_details.dmsLeadDto.id;
        if (!leadId) {
            showToast("lead id not found");
            return;
        }


        UpdateRecord007(enquiryDetailsObj)
    };

    {/*  const PostPreEnquiryLead = async (enquiryDetailsObj) => {
        setIsLoading(true);
        await fetch(URL.DROP_ENQUIRY(), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "auth-token": userToken
            },
            body: JSON.stringify(payload)
        })
            .then(json => json.json())
            .then(response => {
                if (response.status === "SUCCESS") {
                    // Update Record
                    UpdateRecord(enquiryDetailsObj);
                } else {
                    showToast("Drop Lead Failed")
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                showToastRedAlert(err);
                setIsLoading(false);
            })
    } */}

    const UpdateRecord007 = async (enquiryDetailsObj) => {
        setIsLoading(true);
        // await fetch(URL.UPDATE_ENQUIRY_DETAILS(), {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //         "auth-token": userToken
        //     },
        //     body: JSON.stringify(enquiryDetailsObj)
        // })
        await client.post(URL.UPDATE_ENQUIRY_DETAILS(), enquiryDetailsObj)
            .then(json => json.json())
            .then(response => {
                return respone;
            })
            .catch(err => {
                if (typeof err === 'string') {
                    showToastRedAlert(err);
                }
                setIsLoading(false);
            })
    }

    const goToEnquiry = () => {
        getPreEnquiryListFromServer();
        navigation.navigate(EmsTopTabNavigatorIdentifiers.leads, {fromScreen : "contacts"});
        dispatch(clearState());
    }

    const goToParentScreen = () => {
        getPreEnquiryListFromServer();
        // navigation.navigate(EmsTopTabNavigatorIdentifiers.enquiry);
        navigation.popToTop();
        dispatch(clearState());
    }


    const handleBackButtonClick = () => {
        navigation.popToTop();
        return true;
    }

    const editButton = () => {
        if (!selector.isLoading) {
            navigation.push(AppNavigator.EmsStackIdentifiers.addPreEnq, {
                preEnquiryDetails: selector.pre_enquiry_details,
                fromEdit: true
            })
        }
    }

    const getDropDownApi = () => {
                return fetch('http://cyeprolive-1205754645.ap-south-1.elb.amazonaws.com:8091/Lost_SubLost_AllDetails?organizationId=1&stageName=Pre%20Enquiry')
          .then((response) => response.json())
          .then((json) => {
            return json.Drop;
          })
          .catch((error) => {
            console.error(error);
          });
    }

    const createEnquiryClicked = () => {
        setDisabled(true)
        if (selector.pre_enquiry_details) {
            if (!selector.pre_enquiry_details.dmsLeadDto) {
                showToastRedAlert("something went wrong")
                return
            }
            const sourceOfEnquiryId = selector.pre_enquiry_details.dmsLeadDto.sourceOfEnquiry;
            const data = {
                sourceId: sourceOfEnquiryId,
                orgId: organizationId,
                branchId: branchId
            }

            Promise.all([
                dispatch(getEmployeesListApi(data))
            ]).then(async (res) => {

                //  let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
                // if (employeeData) {
                //     const jsonObj = JSON.parse(employeeData);
                //     const payload = {
                //         "branchid": Number(branchId),
                //         "leadstage": "ENQUIRY",
                //         "orgid": jsonObj.orgId,
                //         "universalId": itemData.universalId
                //     }
                //     customerLeadReference(payload)
                //    // dispatch(customerLeadRef(payload))

                // }
            });
        }
    }
    const customerLeadReference = async (enquiryDetailsObj) => {

        setIsLoading(true);
            // await fetch(URL.CUSTOMER_LEAD_REFERENCE(), {
            //     method: "POST",
            //     headers: {
            //         Accept: "application/json",
            //         "Content-Type": "application/json",
            //         "auth-token": userToken
            //     },
        //     body: JSON.stringify(enquiryDetailsObj)
        // })
        await client.post(URL.CUSTOMER_LEAD_REFERENCE(), enquiryDetailsObj )
            .then(json => json.json())
            .then(response => {
                if (response && response.dmsEntity && response.dmsEntity.leadCustomerReference) {
                    dispatch(() => updateEnquiryDetailsCreateEnquiry(response.dmsEntity.leadCustomerReference.referencenumber));
                }
            })
            .catch(err => {
                console.error(err);
                showToastRedAlert(err);
                setIsLoading(false);
            })
    }
    const noThanksClicked = () => {
        dispatch(noThanksApi(itemData.leadId));
        navigation.popToTop();
    }

    const updateEmployee = (employeeObj) => {
        let dmsLeadDto = { ...selector.pre_enquiry_details.dmsLeadDto };
        dmsLeadDto.salesConsultant = employeeObj.name;
        dispatch(updateEmployeeApi(dmsLeadDto));
        setEmployeeSelectModel(false);
    }

    function checkForLeadStage() {
        let name = itemData.leadStage;
        if (name === 'PREENQUIRY') {
            name = 'Contacts';
        }
        return name;
    }

    const onEventInfoPress = ()=>{
        // todo
        
        let tempArr =[
            {
            eventName: itemData?.eventName,
            eventLocation: itemData?.eventLocation,
            Startdate: itemData?.eventStartDate,
            Enddate: itemData?.eventEndDate,
            isSelected: false,
            id: 0
            }
        ]
           
        
        if (itemData?.eventName !== null) {
            seteventListData(tempArr)
        }
        setisEventListModalVisible(true)
    }


    const eventListTableRow = useCallback((txt1, txt2, txt3, txt4, isDisplayRadio, isRadioSelected, isClickable, itemMain, index) => {

        return (
            <>

                <TouchableOpacity style={{
                    flexDirection: "row",
                    // justifyContent: "space-around",
                    alignItems: "center",
                    // height: '15%',
                    alignContent: "center",
                    width: '100%',
                    marginTop: 5


                }}
                    disabled={true}
                    onPress={() => {

                        // let temp = [...eventListdata].filter(item => item.id === itemMain.id).map(i => i.isSelected = true)
                        let temp = eventListdata.map(i =>
                            i.id === itemMain.id ? { ...i, isSelected: true } : { ...i, isSelected: false }
                        )
                     
                        seteventListData(temp);



                    }}
                >
                    {/* todo */}
                    {isDisplayRadio ?
                        <Fontisto name={itemMain.isSelected ? "radio-btn-active" : "radio-btn-passive"}
                            size={12} color={Colors.RED}
                            style={{ marginEnd: 10 }}
                        /> :
                        <View style={{ marginEnd: 10, width: 12, }}  >{ }</View>}

                    <Text numberOfLines={1} style={{ fontSize: 12, color: Colors.BLACK, textAlign: "left", marginEnd: 10, width: 100, }}  >{txt1}</Text>
                    <Text numberOfLines={1} style={{ fontSize: 12, color: Colors.BLACK, textAlign: "left", marginEnd: 10, width: 100 }}>{txt2}</Text>
                    <Text numberOfLines={1} style={{ fontSize: 12, color: Colors.BLACK, textAlign: "left", marginEnd: 10, width: 100 }}>{txt3}</Text>
                    <Text numberOfLines={1} style={{ fontSize: 12, color: Colors.BLACK, textAlign: "left", marginEnd: 10, width: 100 }}>{txt4}</Text>

                </TouchableOpacity>

            </>)
    })


    const addEventListModal = () => {

        return (
            <Modal
                animationType="fade"
                visible={isEventListModalVisible}
                onRequestClose={() => {

                }}
                transparent={true}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.7)",


                    }}
                >
                    <View style={{
                        width: '90%',
                        backgroundColor: Colors.WHITE,
                        padding: 10,
                        borderWidth: 2,
                        borderColor: Colors.BLACK,
                        flexDirection: "column",
                        height: '22%',
                    }}

                    >
                        <Text style={{ color: Colors.BLACK, fontSize: 16, fontWeight: "700", textAlign: "left", margin: 5 }}>Selected Event</Text>
                        <ScrollView style={{
                            width: '100%',

                        }}
                            horizontal={true}
                        >
                            <View style={{ flexDirection: "column" }}>

                                <Text style={GlobalStyle.underline} />
                                <View style={{
                                    height: 30, borderBottomColor: 'rgba(208, 212, 214, 0.7)',
                                    borderBottomWidth: 2,

                                }}>
                                    {eventListTableRow("Event Name", "Event location", "Start Date", "End Date", false, false, true, 0, 0)}
                                    {/* <Text style={GlobalStyle.underline} /> */}
                                </View>
                                <View>
                                    <FlatList
                                        key={"EVENT_LIST"}
                                        data={eventListdata}
                                        style={{ height: '80%' }}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListEmptyComponent={() => {
                                            return (<View style={{ alignItems: 'center', marginVertical: 20 }}><Text>{"Data Not Available"}</Text></View>)
                                        }}

                                        renderItem={({ item, index }) => {
                                           
                                            return (
                                                <>
                                                    <View style={{
                                                        height: 35, borderBottomColor: 'rgba(208, 212, 214, 0.7)',
                                                        borderBottomWidth: 4, marginTop: 5
                                                    }}>
                                                        {eventListTableRow(item.eventName, item.eventLocation, moment(item.Startdate).format("DD-MM-YYYY"), moment(item.Enddate).format("DD-MM-YYYY"), false, false, false, item, index)}
                                                        {/* {eventListTableRow(item.eventName, item.eventLocation, item.Startdate, item.Enddate, false, false, false, item, index)} */}
                                                    </View>

                                                </>
                                            );
                                        }}
                                    />

                                </View>
                            </View>

                        </ScrollView>
                        <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 10 }}>
                            <Button
                                mode="contained"

                                style={{ width: '30%', }}
                                color={Colors.GRAY}
                                labelStyle={{ textTransform: "none" }}
                                onPress={() => {
                                    setisEventListModalVisible(false)
                                    // todo
                                    seteventListData([]);
                                }}>
                                Close
                            </Button>
                            {/* <Button
                                mode="contained"

                                style={{ flex: 1 }}
                                color={Colors.PINK}
                                labelStyle={{ textTransform: "none" }}
                                onPress={() => addSelectedEvent()}>
                                Add
                            </Button> */}
                        </View>

                    </View>

                </View>
            </Modal>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* <LoaderComponent
                visible={selector.create_enquiry_loading}
                onRequestClose={() => { }}
            /> */}

            <SelectEmployeeComponant
                visible={showEmployeeSelectModel}
                headerTitle={'Select Employee'}
                data={employeesData}
                selectedEmployee={(employee) => updateEmployee(employee)}
                onRequestClose={() => {setDisabled(false)
                    setEmployeeSelectModel(false);}}
            />
            {addEventListModal()}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                enabled
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    style={{ flex: 1 }}
                >
                    <View style={styles.view1}>
                        <Text style={styles.text1}>{"Contacts"}</Text>
                        <IconButton
                            icon='square-edit-outline'
                            color={Colors.DARK_GRAY}
                            size={25}
                            onPress={editButton}
                        />
                    </View>

                    <View style={[{ borderRadius: 6 }]}>
                        <TextinputComp
                            style={{ height: 50 }}
                            value={itemData.firstName + ' ' + itemData.lastName}
                            label={'Customer Name'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>
                        <TextinputComp
                            style={{ height: 50 }}
                            value={itemData.phone}
                            label={'Mobile Number'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 50 }}
                            value={convertTimeStampToDateString(
                                itemData.createdDate
                            )}
                            label={'Date Created'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 50 }}
                            value={itemData.enquirySource}
                            label={"Source of Contact"}
                            editable={false}
                            rightIconObj={{ name: "information-outline", color: Colors.GRAY }}
                            showRightIcon={itemData.enquirySource ==="Events" ? true: false}
                            onRightIconPressed={onEventInfoPress}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 50 }}
                            value={itemData.model}
                            label={'Model'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 50 }}
                            value={checkForLeadStage()}
                            label={'Status'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        {isDropSelected && (
                            <DropComponent
                                from='PRE_ENQUIRY'
                                data={dropData}
                                reason={dropReason}
                                setReason={(text) => setDropReason(text)}
                                subReason={dropSubReason}
                                setSubReason={(text) => setDropSubReason(text)}
                                brandName={dropBrandName}
                                setBrandName={(text) => setDropBrandName(text)}
                                dealerName={dropDealerName}
                                setDealerName={(text) =>
                                    setDropDealerName(text)
                                }
                                location={dropLocation}
                                setLocation={(text) => setDropLocation(text)}
                                model={dropModel}
                                setModel={(text) => setDropModel(text)}
                                priceDiff={dropPriceDifference}
                                setPriceDiff={(text) =>
                                    setDropPriceDifference(text)
                                }
                                remarks={dropRemarks}
                                setRemarks={(text) => setDropRemarks(text)}
                            />
                        )}

                        {!isDropSelected && (
                            <View style={styles.view2}>
                                <Text
                                    style={[
                                        styles.text2,
                                        { color: Colors.GRAY },
                                    ]}
                                >
                                    {'Allocated DSE'}
                                </Text>

                                <View style={styles.view3}>
                                    <Button
                                        disabled={disabled}
                                        mode='contained'
                                        color={Colors.RED}
                                        labelStyle={{
                                            textTransform: 'none',
                                            color: Colors.WHITE,
                                        }}
                                        onPress={() => createEnquiryClicked()}
                                    >
                                        Create Enquiry
                                    </Button>

                                    <Button
                                        disabled={disabled}
                                        mode='contained'
                                        style={{ width: 120 }}
                                        color={Colors.GRAY}
                                        //   disabled={selector.isLoading}
                                        labelStyle={{
                                            textTransform: 'none',
                                            color: Colors.WHITE,
                                        }}
                                        onPress={() => setIsDropSelected(true)}
                                    >
                                        Drop
                                    </Button>
                                </View>
                            </View>
                        )}

                        {isDropSelected && (
                            <View style={styles.view4}>
                                <Button
                                    mode='contained'
                                    color={Colors.BLACK}
                                    labelStyle={{
                                        textTransform: 'none',
                                        color: Colors.WHITE,
                                    }}
                                    onPress={() =>
                                        setIsDropSelected(false)
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    mode='contained'
                                    color={Colors.RED}
                                    disabled={isLoading}
                                    labelStyle={{ textTransform: 'none' }}
                                    onPress={proceedToCancelPreEnquiry}
                                >
                                    Proceed To Cancellation
                                </Button>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            {!selector.isLoading ? null : (
                <LoaderComponent
                    visible={selector.isLoading}
                    onRequestClose={() => {}}
                />
            )}
        </SafeAreaView>
    );
}

export default ConfirmedPreEnquiryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 10
    },
    text1: {
        fontSize: 16,
        fontWeight: '700',
        paddingLeft: 5
    },
    view1: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
    },
    text2: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 20,

    },
    accordianBorder: {
        borderWidth: 0.5,
        borderRadius: 4,
        borderColor: "#7a7b7d"
    },
    preenquiryBtnView: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    textInputStyle: {
        height: 65,
        width: "100%",
    },
    devider: {
        width: '100%', height: 0.5, backgroundColor: Colors.GRAY
    },
    view2: {
        backgroundColor: Colors.WHITE,
        padding: 10
    },
    view3: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    view4: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: "space-evenly",
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
    }
})
