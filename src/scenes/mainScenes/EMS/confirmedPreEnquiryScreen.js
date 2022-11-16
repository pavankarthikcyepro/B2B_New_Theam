import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Keyboard, Alert, Dimensions, KeyboardAvoidingView, BackHandler } from 'react-native';
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
        console.log("DATA:", JSON.stringify(route.params.itemData));
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
        console.log("DROP PAY: ", URL.DROP_ENQUIRY(), payload);
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
    }

    const UpdateRecord = async (enquiryDetailsObj) => {

        setIsLoading(true);
        console.log("UPDATE PAY: ", URL.UPDATE_ENQUIRY_DETAILS(), userToken, enquiryDetailsObj);
        await fetch(URL.UPDATE_ENQUIRY_DETAILS(), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "auth-token": userToken
            },
            body: JSON.stringify(enquiryDetailsObj)
        })
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
        if (employeeId) {
            let endUrl = "?limit=10&offset=" + "0" + "&status=PREENQUIRY&empId=" + employeeId;
            dispatch(getPreEnquiryData(endUrl));
        }
    }

    useEffect(() => {

        getAsyncStorageData();
        getBranchId();
        getDropDownApi();

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
            // console.log("branch id:", branchId)
            setBranchId(branchId);
        });
    }

    const getAsyncStorageData = async () => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            // console.log("json:", jsonObj);
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
        }, reject => {
            console.log("Getting pre enquiry list faild")
        })
    }

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(info => {
            console.log(info)
            setCurrentLocation({
                lat: info.coords.latitude,
                long: info.coords.longitude
            })
        });
    }

    // Handle Employees List Response
    useEffect(() => {

        if (selector.employees_list.length === 0 && selector.employees_list_status === "success") {
            const endUrl = `${itemData.universalId}` + '?' + 'stage=PreEnquiry';
            dispatch(getaAllTasks(endUrl));
        }
        else if (selector.employees_list.length > 0 && selector.employees_list_status === "success") {
            let newData = [];
            selector.employees_list.forEach(element => {
                const obj = {
                    id: element.empId,
                    name: element.empName,
                    selected: false,
                }
                newData.push(obj);
            });
            setEmployeesData([...newData]);
            setEmployeeSelectModel(true);
        }
    }, [selector.employees_list, selector.employees_list_status])

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
                // console.log("filteredObj: ", filteredObj);
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
        console.log("PAYLOAD LEAD REF:", payload);
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
        console.log("DROP PAY: ", URL.DROP_ENQUIRY(), payload);
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
        console.log("<<<<<<<WE ARE DONE>>>>>>>>>>>: ", URL.UPDATE_ENQUIRY_DETAILS(), userToken, enquiryDetailsObj);
        await fetch(URL.UPDATE_ENQUIRY_DETAILS(), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "auth-token": userToken
            },
            body: JSON.stringify(enquiryDetailsObj)
        })
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
        console.log("back pressed")
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
        return fetch('http://automatestaging-724985329.ap-south-1.elb.amazonaws.com:8091/Lost_SubLost_AllDetails?organizationId=1&stageName=Pre%20Enquiry')
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
                //     console.log("PAYLOAD LEAD REF:", payload);
                //     customerLeadReference(payload)
                //    // dispatch(customerLeadRef(payload))

                // }
            });
        }
    }
    const customerLeadReference = async (enquiryDetailsObj) => {

        setIsLoading(true);
        console.log("<<<<<<<WE ARE DONE>>>>>>>>>>>: ", URL.UPDATE_ENQUIRY_DETAILS(), userToken, enquiryDetailsObj);
        await fetch(URL.CUSTOMER_LEAD_REFERENCE(), {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "auth-token": userToken
            },
            body: JSON.stringify(enquiryDetailsObj)
        })
            .then(json => json.json())
            .then(response => {
                console.log("Customer Refernce=====", response)
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
        console.log("employee: ", employeeObj)
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
                                        onPress={createEnquiryClicked}
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
