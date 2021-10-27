import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Keyboard, Alert } from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp, SelectEmployeeComponant } from "../../../components";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { showToastSucess } from "../../../utils/toast";
import * as AsyncStorage from "../../../asyncStore";
import { clearState, getTaskDetailsApi, getEnquiryDetailsApi, getEmployeesListApi, updateTaskApi, updateEmployeeApi, changeEnquiryStatusApi } from '../../../redux/createEnquiryReducer';
import { getCurrentTasksListApi, getPendingTasksListApi } from "../../../redux/mytaskReducer";


const CreateEnquiryScreen = ({ route, navigation }) => {

    const { taskId, identifier, universalId } = route.params;
    const selector = useSelector(state => state.createEnquiryReducer);
    const dispatch = useDispatch();
    const [employeeId, setEmployeeId] = useState("");
    const [showEmployeeSelectModel, setEmployeeSelectModel] = useState(false);
    const [employeesData, setEmployeesData] = useState([]);

    useEffect(() => {
        getAsyncStorageData();
        dispatch(getTaskDetailsApi(taskId));
        dispatch(getEnquiryDetailsApi(universalId));
    }, [])

    const getAsyncStorageData = async () => {
        const empId = await AsyncStorage.getData(AsyncStorage.Keys.EMP_ID);
        if (empId) {
            setEmployeeId(empId);
        }
    }

    const updateTaskStatus = () => {
        if (!selector.task_details_response) {
            return;
        }

        const newTaskObj = { ...selector.task_details_response };
        newTaskObj.taskStatus = "CLOSED";
        dispatch(updateTaskApi(newTaskObj));
    }

    // Update, Close Task Response handle
    useEffect(() => {
        if (selector.update_task_response_status === "success") {

            const endUrl = `${universalId}` + '?' + 'stage=ENQUIRY';
            dispatch(changeEnquiryStatusApi(endUrl));
        }
    }, [selector.update_task_response_status])

    // Handle Enuiry update response
    useEffect(() => {
        if (selector.change_enquiry_status === "success" && selector.change_enquiry_response) {
            displayCreateEnquiryAlert(selector.change_enquiry_response);
        }
    }, [selector.change_enquiry_status, selector.change_enquiry_response])

    displayCreateEnquiryAlert = (data) => {
        Alert.alert(
            'Enquiry Created Successfully',
            "Enquiry Number: " + universalId + ", Allocated DSE: " + data.dmsEntity.task.assignee.empName,
            [
                {
                    text: 'OK', onPress: () => {
                        getMyTasksListFromServer();
                        navigation.popToTop();
                        dispatch(clearState());
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const getMyTasksListFromServer = () => {
        if (employeeId) {
            const endUrl = `employeeId=${employeeId}&limit=10&offset=${0}`;
            dispatch(getCurrentTasksListApi(endUrl));
            dispatch(getPendingTasksListApi(endUrl));
        }
    }

    const createEnquiryClicked = () => {

        if (selector.enquiry_details_response) {
            const id = selector.enquiry_details_response.dmsLeadDto.sourceOfEnquiry;
            dispatch(getEmployeesListApi(id));
        }
    }

    // Handle Employee list 
    useEffect(() => {

        if (selector.employees_list.length === 0 && selector.employees_list_status === "success") {
            updateTaskStatus();
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

    const updateEmployee = (employeeObj) => {
        if (!selector.enquiry_details_response) {
            return
        }
        let dmsLeadDto = { ...selector.enquiry_details_response.dmsLeadDto };
        dmsLeadDto.salesConsultant = employeeObj.name;
        dispatch(updateEmployeeApi(dmsLeadDto));
        setEmployeeSelectModel(false);
    }

    // Handle When employee updated
    useEffect(() => {
        if (selector.update_employee_status === "success") {
            updateTaskStatus();
        }
    }, [selector.update_employee_status])

    return (
        <SafeAreaView style={[styles.container]}>

            <SelectEmployeeComponant
                visible={showEmployeeSelectModel}
                headerTitle={"Select Employee"}
                data={employeesData}
                selectedEmployee={(employee) => updateEmployee(employee)}
                onRequestClose={() => setEmployeeSelectModel(false)}
            />

            <View style={styles.view1}>
                <Button
                    mode="contained"
                    color={Colors.RED}
                    disabled={selector.is_loading_for_task_update}
                    labelStyle={{ textTransform: "none" }}
                    onPress={createEnquiryClicked}
                >
                    Create Enquiry
                </Button>
            </View>
        </SafeAreaView>
    );
};

export default CreateEnquiryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputStyle: {
        height: 65,
        width: "100%",
    },
    view1: {
        marginTop: 50,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
});
