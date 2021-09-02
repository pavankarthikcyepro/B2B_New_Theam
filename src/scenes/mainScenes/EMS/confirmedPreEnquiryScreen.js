import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Alert, Dimensions, KeyboardAvoidingView, BackHandler } from 'react-native';
import { ButtonComp } from "../../../components/buttonComp";
import { Checkbox, Button, IconButton, Divider } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../styles';
import { TextinputComp } from '../../../components/textinputComp';
import { DropDownComponant } from '../../../components/dropDownComp';
import { convertTimeStampToDateString } from '../../../utils/helperFunctions';
import { getPreEnquiryDetails, noThanksApi, getaAllTasks, assignTaskApi, changeEnquiryStatusApi, getEmployeesListApi, updateEmployeeApi } from '../../../redux/confirmedPreEnquiryReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from "../../../asyncStore";
import { LoaderComponent, SelectEmployeeComponant } from '../../../components';


const ConfirmedPreEnquiryScreen = ({ route, navigation }) => {

    const selector = useSelector(state => state.confirmedPreEnquiryReducer);
    const dispatch = useDispatch();
    const { itemData, fromCreatePreEnquiry } = route.params;
    const [employeeId, setEmployeeId] = useState("");
    const [showEmployeeSelectModel, setEmployeeSelectModel] = useState(false);
    const [employeesData, setEmployeesData] = useState([]);

    useEffect(() => {

        getAsyncStorageData();

        // api calls
        dispatch(getPreEnquiryDetails(itemData.universalId));

        // Subscribe Listeners
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

        // UnSubscribe Listeners
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        }
    }, []);

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
    }, [selector.employees_list])

    useEffect(() => {
        if (selector.update_employee_status === "success") {
            const endUrl = `${itemData.universalId}` + '?' + 'stage=PreEnquiry';
            dispatch(getaAllTasks(endUrl));
        }
    }, [selector.update_employee_status])

    useEffect(() => {
        if (selector.all_pre_enquiry_tasks.length > 0 && employeeId) {
            let arrTemp = selector.all_pre_enquiry_tasks.filter((obj, index) => {
                return obj.taskName === 'Create Enquiry' && obj.assignee.empId == employeeId;
            })
            let filteredObj = arrTemp.length > 0 ? { ...arrTemp[0] } : undefined;
            if (filteredObj !== undefined) {
                filteredObj.taskStatus = "CLOSED";
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

    const getAsyncStorageData = async () => {
        let empId = await AsyncStore.getData(AsyncStore.Keys.EMP_ID);
        if (empId) {
            setEmployeeId(empId);
        }
    }

    displayCreateEnquiryAlert = (data) => {
        Alert.alert(
            'Enquiry Created Successfully',
            "Enquiry Number: " + itemData.universalId + ", Allocated DSE: " + data.dmsEntity.task.assignee.empName,
            [
                {
                    text: 'OK', onPress: () => {
                        navigation.popToTop();
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const handleBackButtonClick = () => {
        console.log("back pressed")
        navigation.popToTop();
        return true;
    }

    const editButton = () => {
        if (!selector.isLoading) {
            navigation.navigate(AppNavigator.EmsStackIdentifiers.addPreEnq, {
                preEnquiryDetails: selector.pre_enquiry_details,
                fromEdit: true
            })
        }
    }

    const createEnquiryClicked = () => {

        if (selector.pre_enquiry_details) {
            const id = selector.pre_enquiry_details.dmsLeadDto.sourceOfEnquiry;
            dispatch(getEmployeesListApi(id));
        }
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

    return (
        <SafeAreaView style={styles.container}>

            {/* <LoaderComponent
                visible={selector.create_enquiry_loading}
                onRequestClose={() => { }}
            /> */}

            <SelectEmployeeComponant
                visible={showEmployeeSelectModel}
                headerTitle={"Select Employee"}
                data={employeesData}
                selectedEmployee={(employee) => updateEmployee(employee)}
                onRequestClose={() => setEmployeeSelectModel(false)}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                enabled
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    contentContainerStyle={{ padding: 10 }}
                    style={{ flex: 1 }}
                >
                    <View style={styles.view1}>
                        <Text style={styles.text1}>{'Pre-Enquiry'}</Text>

                        <IconButton
                            icon="square-edit-outline"
                            color={Colors.DARK_GRAY}
                            size={25}
                            onPress={editButton}
                        />
                    </View>

                    <View style={[{ borderRadius: 6, }]}>
                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.firstName + " " + itemData.lastName}
                            label={'Customer Name'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>
                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.phone}
                            label={'Mobile Number'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 70 }}
                            value={convertTimeStampToDateString(itemData.createdDate)}
                            label={'Date Created'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.enquirySource}
                            label={'Source of Pre-Enquiry'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.model}
                            label={'Modal'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <TextinputComp
                            style={{ height: 70 }}
                            value={itemData.leadStage}
                            label={'Status'}
                            editable={false}
                        />
                        <Text style={styles.devider}></Text>

                        <View style={styles.view2}>
                            <Text style={[styles.text2, { color: Colors.GRAY }]}>{'Allocated DSE'}</Text>
                            <View style={styles.view3}>
                                <Button
                                    mode="contained"
                                    color={Colors.RED}
                                    labelStyle={{ textTransform: 'none', color: Colors.WHITE }}
                                    onPress={createEnquiryClicked}
                                >
                                    Create Enuqiry
                                </Button>
                                <Button
                                    mode="contained"
                                    color={Colors.BLACK}
                                    labelStyle={{ textTransform: 'none', color: Colors.WHITE }}
                                    onPress={noThanksClicked}
                                >
                                    No Thanks
                                </Button>
                            </View>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView >
    )
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
        fontWeight: '600'
    },
    devider: {
        width: '100%', height: 0.5, backgroundColor: Colors.GRAY
    },
    view2: {
        backgroundColor: Colors.WHITE,
        padding: 10
    },
    view3: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})