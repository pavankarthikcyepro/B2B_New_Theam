import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image, TouchableOpacity, ScrollView
} from "react-native";
import { Colors } from "../../styles";
import { SettingsScreenItem } from "../../pureComponents/settingScreenItem";
const screenWidth = Dimensions.get("window").width;
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch, useSelector } from "react-redux";
import { getTaskList, getBranchDropdown, getDeptDropdown, getDesignationDropdown, getEmployeeDetails, getDeptDropdownTrans, getDesignationDropdownTrans, getEmployeeDetailsTrans, updateStatus, submitTaskTransfer } from "../../redux/taskTransferReducer";
import { useIsFocused } from '@react-navigation/native';
import { Checkbox, IconButton } from 'react-native-paper';
import moment from "moment";
import * as AsyncStore from "../../asyncStore";
import { showToast } from "../../utils/toast";

const datalist = [
    {
        name: "Task Transfer",
    },
];

const dropdownData = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' }
];

const TaskTranferScreen = () => {
    const selector = useSelector((state) => state.taskTransferReducer);
    const dispatch = useDispatch();
    const [showTaskList, setShowTaskList] = useState(false);
    const [showTaskFlatlist, setShowTaskFlatlist] = useState(false);
    const [tasklistHeader, setTasklistHeader] = useState(false);

    const [showTrasnferFromDropdowns, setShowTrasnferFromDropdowns] = useState(false);
    const [taskNameHeader, setTaskNameHeader] = useState("Task Name");
    const [checked, setChecked] = useState({});

    //task transfer to states
    const [branchDropDownItem, setbranchDropDownItem] = useState("");
    const [branchDropDownList, setbranchDropDownList] = useState([]);
    const [deptDropDownItem, setDeptDropDownItem] = useState("");
    const [deptDropDownList, setDeptDropDownList] = useState([]);
    const [designationDropDownItem, setDesignationDropDownItem] = useState("");
    const [designationDropDownList, setDesignationDropDownList] = useState([]);
    const [employeeDropDownItem, setEmployeeDropDownItem] = useState(null);
    const [employeeDropDownList, setEmployeeDropDownList] = useState([]);

    const [taskList, setTaskList] = useState([]);
    const [selectedTaskList, setSelectedTaskList] = useState([]);

    //task trasnfer from status
    const [branchTransferFromDropDownItem, setbranchTransferFromDropDownItem] = useState("");
    const [branchTransferFromDropDownList, setbranchTransferFromDropDownList] = useState([]);
    const [deptTransferFromDropDownItem, setDeptTransferFromDropDownItem] = useState("");
    const [deptTransferFromDropDownList, setDeptTransferFromDropDownList] = useState([]);
    const [designationTransferFromDropDownItem, setDesignationTransferFromDropDownItem] = useState("");
    const [designationTransferFromDropDownList, setDesignationTransferFromDropDownList] = useState([]);
    const [employeeTransferFromDropDownItem, setEmployeeTransferFromDropDownItem] = useState(null);
    const [employeeTransferFromDropDownList, setEmployeeTransferFromDropDownList] = useState([]);
    const [isAllSelect, setIsAllSelect] = useState(false);
    // const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        getTargetbranchDropDownListFromServer();
        // setbranchDropDownList(selector.branchList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
        // setbranchTransferFromDropDownList(selector.branchList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
    }, []);

    useEffect(() => {
        if (selector.taskTransferStatus === 'success') {
            showToast("Transferred Successfully")
            dispatch(updateStatus(''))
            clearData()
        }
        if (selector.taskTransferStatus === 'faild') {
            showToast("Transferred Failed")
            dispatch(updateStatus(''))
        }
    }, [selector.taskTransferStatus]);

    useEffect(() => {
        if (selector.branchList.length > 0) {
            setbranchDropDownList(selector.branchList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
            setbranchTransferFromDropDownList(selector.branchList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
        }
    }, [selector.branchList]);

    useEffect(() => {
        if (selector.deptList.length > 0) {
            setDeptDropDownList(selector.deptList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
        }
    }, [selector.deptList]);

    useEffect(() => {
        if (selector.deptListTrans.length > 0) {
            setDeptTransferFromDropDownList(selector.deptListTrans.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
        }
    }, [selector.deptListTrans]);

    useEffect(() => {
        if (selector.employeeList.length > 0) {
            setEmployeeDropDownList(selector.employeeList.map(({ empId: value, empName: label, ...rest }) => ({ value, label, ...rest })));
        }
    }, [selector.employeeList]);

    useEffect(() => {
        if (selector.employeeListTrans.length > 0) {
            setEmployeeTransferFromDropDownList(selector.employeeListTrans.map(({ empId: value, empName: label, ...rest }) => ({ value, label, ...rest })));
        }
    }, [selector.employeeListTrans]);

    useEffect(() => {
        if (selector.designationList.length > 0) {
            setDesignationDropDownList(selector.designationList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
        }
    }, [selector.designationList]);

    useEffect(() => {
        if (selector.designationListTrans.length > 0) {
            setDesignationTransferFromDropDownList(selector.designationListTrans.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
        }
    }, [selector.designationListTrans]);

    useEffect(() => {
        if (selector.taskList.length > 0) {
            setTaskList(selector.taskList);
        }
    }, [selector.taskList]);

    const clearData = () => {
        setbranchDropDownItem("");
        setDeptDropDownItem("");
        setDeptDropDownList([]);
        setDesignationDropDownItem("");
        setDesignationDropDownList([]);
        setEmployeeDropDownItem(null);
        setEmployeeDropDownList([]);

        setTaskList([]);

        //task trasnfer from status
        setbranchTransferFromDropDownItem("");
        setDeptTransferFromDropDownItem("");
        setDeptTransferFromDropDownList([]);
        setDesignationTransferFromDropDownItem("");
        setDesignationTransferFromDropDownList([]);
        setEmployeeTransferFromDropDownItem(null);
        setEmployeeTransferFromDropDownList([]);
        setShowTrasnferFromDropdowns(false)
        setShowTaskFlatlist(false)
        setSelectedTaskList([])
    }

    const getTaskListFromServer = async () => {
        dispatch(getTaskList(119));
        setShowTaskList(true);
    }

    const getTargetbranchDropDownListFromServer = async () => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                "orgId": jsonObj.orgId,
                "parent": "organization",
                "child": "branch",
                "parentId": 1
            }
            return dispatch(getBranchDropdown(payload));
        }
    }

    const getTargetDeptDropDownListFromServer = async (item) => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                "orgId": jsonObj.orgId,
                "parent": "branch",
                "child": "department",
                "parentId": item.value
            }
            return dispatch(getDeptDropdown(payload));
        }
    }

    const getTargetDeptDropDownListTransFromServer = async (item) => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                "orgId": employeeDropDownItem.orgId,
                "parent": "branch",
                "child": "department",
                "parentId": item.value
            }
            return dispatch(getDeptDropdownTrans(payload));
        }
    }

    const getTargetDesignationDropDownListFromServer = async (item) => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                "orgId": jsonObj.orgId,
                "parent": "department",
                "child": "designation",
                "parentId": item.value
            }
            return dispatch(getDesignationDropdown(payload));
        }
    }

    const getTargetDesignationDropDownListTransFromServer = async (item) => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                "orgId": employeeDropDownItem.orgId,
                "parent": "department",
                "child": "designation",
                "parentId": item.value
            }
            return dispatch(getDesignationDropdownTrans(payload));
        }
    }

    const getEmployeeDetailsFromServer = async (item) => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                "orgId": jsonObj.orgId,
                "branchId": branchDropDownItem,
                "deptId": deptDropDownItem,
                "desigId": item.value
                // "orgId": 16,
                // "branchId": 267,
                // "deptId": 180,
                // "desigId": 56
            }
            console.log("EMP PAYLOAD: ", payload);
            dispatch(getEmployeeDetails(payload));
        }
    }

    const getEmployeeDetailsTransFromServer = async (item) => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            const payload = {
                "orgId": jsonObj.orgId,
                "branchId": branchTransferFromDropDownItem,
                "deptId": deptTransferFromDropDownItem,
                "desigId": item.value
            }
            dispatch(getEmployeeDetailsTrans(payload));
        }
    }

    const submitTransfer = () => {
        if (!employeeDropDownItem || !employeeTransferFromDropDownItem || selectedTaskList.length === 0) {
            showToast("Please select all value")
        }
        else {
            const payload = {
                "fromUserId": employeeDropDownItem.value,
                "toUserId": employeeTransferFromDropDownItem.value,
                "taskIdList": selectedTaskList
            }
            dispatch(submitTaskTransfer(payload));
        }
    }

    const renderItem = (item, index) => {
        return (
            <TouchableOpacity onPress={() => {
                setShowTrasnferFromDropdowns(true);
                setTaskNameHeader(item.item.taskName);
                setShowTaskFlatlist(true);
                setShowTaskList(false);
            }} style={{
                backgroundColor: "white",
                borderTopWidth: 0.6,
                borderBottomWidth: index === item.item.length ? 0.6 : 0,
                borderColor: "#333",
                padding: 10
            }}>
                <Text>{item.item.taskName}</Text>
            </TouchableOpacity>
        );
    };

    const updatedItem = (index) => {
        if (checked[index] !== undefined) {
            return checked[index];
        } else {
            return false;
        }
    }

    //Add this line to tell the function that it's in focuse
    useIsFocused();

    const renderItemTaskTransferList = (item, index) => {
        return (
            <TouchableOpacity style={{
                backgroundColor: "white",
                borderTopWidth: 0.6,
                borderBottomWidth: index === item.length ? 0.6 : 0,
                borderColor: "#333",
                padding: 10
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Checkbox.Android
                        status={updatedItem(index) ? 'checked' : 'unchecked'}
                        uncheckedColor={Colors.DARK_GRAY}
                        color={Colors.RED}
                        onPress={() => {
                            console.log("ITEM $$$", item);
                            if (checked.hasOwnProperty(index)) {
                                const temp = checked;
                                temp[index] = !temp[index];
                                if (temp[index]) {
                                    console.log("INSIDE IF");
                                    let tempArr = [...selectedTaskList];
                                    tempArr.push(item.taskId)
                                    if(tempArr.length === taskList.length){
                                        setIsAllSelect(true)
                                    }
                                    else{
                                        setIsAllSelect(false)
                                    }
                                    setSelectedTaskList(tempArr)
                                }
                                else {
                                    let tempArr = [...selectedTaskList];
                                    let taskIndex = -1;
                                    console.log("Temp arr", tempArr);
                                    taskIndex = tempArr.findIndex((taskId) => taskId === item.taskId)
                                    console.log("INSIDE ELSE ", taskIndex);
                                    if (taskIndex !== -1) {
                                        tempArr.splice(taskIndex, 1)
                                        if (tempArr.length === taskList.length) {
                                            setIsAllSelect(true)
                                        }
                                        else {
                                            setIsAllSelect(false)
                                        }
                                        setSelectedTaskList(tempArr)
                                    }
                                }
                                setChecked({ ...temp, index: temp[index] });
                            } else {
                                console.log("INSIDE ELSE out");
                                const temp = checked;
                                temp[index] = true;
                                let tempArr = [...selectedTaskList];
                                tempArr.push(item.taskId)
                                setSelectedTaskList(tempArr)
                                if (tempArr.length === taskList.length) {
                                    setIsAllSelect(true)
                                }
                                else {
                                    setIsAllSelect(false)
                                }
                                setChecked({ ...temp, index: temp[index] });
                            }
                        }}
                    />
                    <Text>{item.customerName}</Text>
                    <Text>{item.mobileNumber}</Text>
                    <Text>{moment(item.createdOn).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                    <Text>{item.taskStatus}</Text>
                    <Text>{item.employeeName}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.view2}>
                <FlatList
                    data={datalist}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={() => {
                        return <View style={styles.view1}></View>;
                    }}
                    renderItem={({ item, index }) => {
                        return <SettingsScreenItem name={item.name} />;
                    }}
                />
            </View> */}

            <ScrollView>
                <View style={{ width: '100%', paddingHorizontal: 15, height: 60, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }} > Transfer Tasks From</Text>
                </View>
                <View style={{ width: '100%', paddingHorizontal: 15, justifyContent: 'center' }}>
                    <View style={styles.dropWrap}>
                        <View style={styles.dropHeadTextWrap}>
                            <Text style={styles.dropHeadText}>Branch</Text>
                        </View>
                        <Dropdown
                            style={[styles.dropdownContainer,]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={branchDropDownList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={'Select Branch'}
                            searchPlaceholder="Search..."
                            renderRightIcon={() => (
                                <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                            )}
                            onChange={async (item) => {
                                console.log("£££", item);
                                setbranchDropDownItem(item.value);
                                getTargetDeptDropDownListFromServer(item);

                            }}
                        />
                    </View>
                    <View style={styles.dropWrap}>
                        <View style={styles.dropHeadTextWrap}>
                            <Text style={styles.dropHeadText}>Department</Text>
                        </View>
                        <Dropdown
                            style={[styles.dropdownContainer,]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={deptDropDownList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={'Select Department'}
                            searchPlaceholder="Search..."
                            renderRightIcon={() => (
                                <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                            )}
                            onChange={async (item) => {
                                console.log("£££", item);
                                setDeptDropDownItem(item.value)
                                getTargetDesignationDropDownListFromServer(item);

                            }}
                        />

                    </View>
                    <View style={styles.dropWrap}>
                        <View style={styles.dropHeadTextWrap}>
                            <Text style={styles.dropHeadText}>Designation</Text>
                        </View>
                        <Dropdown
                            style={[styles.dropdownContainer,]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={designationDropDownList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={'Select Designation'}
                            searchPlaceholder="Search..."
                            renderRightIcon={() => (
                                <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                            )}
                            onChange={async (item) => {
                                console.log("£££", item);
                                setDesignationDropDownItem(item.value);
                                getEmployeeDetailsFromServer(item);
                            }}
                        />
                    </View>
                    <View style={styles.dropWrap}>
                        <View style={styles.dropHeadTextWrap}>
                            <Text style={styles.dropHeadText}>Employee</Text>
                        </View>
                        <Dropdown
                            style={[styles.dropdownContainer,]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={employeeDropDownList}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={'Select Employee'}
                            searchPlaceholder="Search..."
                            renderRightIcon={() => (
                                <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                            )}
                            onChange={async (item) => {
                                console.log("£££", item);
                                setEmployeeDropDownItem(item)
                                getTaskListFromServer();
                                setTasklistHeader(true);
                            }}
                        />
                    </View>

                    {tasklistHeader ? <View style={{ width: '100%', paddingHorizontal: 15, height: 60, justifyContent: 'center' }}>
                        {showTaskFlatlist ?

                            <View style={{ flexDirection: 'row', alignItems: 'center',  }}>
                                <Checkbox.Android
                                    status={isAllSelect ? 'checked' : 'unchecked'}
                                    uncheckedColor={Colors.DARK_GRAY}
                                    color={Colors.RED}
                                    onPress={() => {
                                        console.log("IS ALL", isAllSelect, checked, selectedTaskList);
                                        let preveState = isAllSelect;
                                        setIsAllSelect(!isAllSelect)
                                        if(!preveState){
                                            let obj = {};
                                            let tempSelectTask = [];
                                            for(let i = 0; i < taskList.length; i++){
                                                obj[i] = true;
                                                tempSelectTask.push(taskList[i].taskId);
                                                if(i === taskList.length - 1){
                                                    setChecked({ ...obj, index: true });
                                                    setSelectedTaskList([...tempSelectTask])
                                                }
                                            }
                                        }
                                        else{
                                            setChecked({});
                                            setSelectedTaskList([])
                                        }
                                    }}
                                />
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }} >{taskNameHeader}</Text>
                            </View>
                            :
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }} >{taskNameHeader}</Text>
                        }
                    </View> : null}

                    {showTaskList ? <View style={{ paddingVertical: 18, height: 350 }}>
                        <FlatList
                            data={taskList}
                            nestedScrollEnabled={true}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item, index) => renderItem(item, index)}
                        />
                    </View> : null}

                    {showTaskFlatlist ? <ScrollView horizontal={true} style={{ paddingVertical: 5, height: 350, marginLeft: 8, marginRight: 8 }}>
                        <View style={{ width: 800 }}>
                            <FlatList
                                data={taskList}
                                nestedScrollEnabled={true}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={checked}
                                renderItem={({ item, index }) => renderItemTaskTransferList(item, index)}
                            />
                        </View>
                    </ScrollView> : null}

                    {showTrasnferFromDropdowns ? <View style={{ width: '100%', paddingHorizontal: 15, height: 60, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }} > To</Text>
                    </View> : null}

                    {showTrasnferFromDropdowns ? <View>
                        <View style={styles.dropWrap}>
                            <View style={styles.dropHeadTextWrap}>
                                <Text style={styles.dropHeadText}>Branch</Text>
                            </View>
                            <Dropdown
                                style={[styles.dropdownContainer,]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={branchTransferFromDropDownList}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select Branch'}
                                searchPlaceholder="Search..."
                                renderRightIcon={() => (
                                    <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                                )}
                                onChange={async (item) => {
                                    console.log("£££", item);
                                    setbranchTransferFromDropDownItem(item.value);
                                    getTargetDeptDropDownListTransFromServer(item);
                                }}
                            />
                        </View>
                        <View style={styles.dropWrap}>
                            <View style={styles.dropHeadTextWrap}>
                                <Text style={styles.dropHeadText}>Department</Text>
                            </View>
                            <Dropdown
                                style={[styles.dropdownContainer,]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={deptTransferFromDropDownList}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select Department'}
                                searchPlaceholder="Search..."
                                renderRightIcon={() => (
                                    <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                                )}
                                onChange={async (item) => {
                                    console.log("£££", item);
                                    setDeptTransferFromDropDownItem(item.value);
                                    getTargetDesignationDropDownListTransFromServer(item);
                                }}
                            />
                        </View>
                        <View style={styles.dropWrap}>
                            <View style={styles.dropHeadTextWrap}>
                                <Text style={styles.dropHeadText}>Designation</Text>
                            </View>
                            <Dropdown
                                style={[styles.dropdownContainer,]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={designationDropDownList}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select Designation'}
                                searchPlaceholder="Search..."
                                renderRightIcon={() => (
                                    <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                                )}
                                onChange={async (item) => {
                                    console.log("£££", item);
                                    setDesignationTransferFromDropDownItem(item.value);
                                    getEmployeeDetailsTransFromServer(item);
                                }}
                            />
                        </View>
                        <View style={styles.dropWrap}>
                            <View style={styles.dropHeadTextWrap}>
                                <Text style={styles.dropHeadText}>Employee</Text>
                            </View>
                            <Dropdown
                                style={[styles.dropdownContainer,]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={employeeTransferFromDropDownList}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={'Select Employee'}
                                searchPlaceholder="Search..."
                                renderRightIcon={() => (
                                    <Image style={{ height: 5, width: 10 }} source={require('../../assets/images/Polygon.png')} />
                                )}
                                onChange={async (item) => {
                                    console.log("£££", item);
                                    setEmployeeTransferFromDropDownItem(item);
                                    // getTaskListFromServer();
                                }}
                            />
                        </View>
                    </View> : null}
                </View>

                <View style={styles.nextBtnWrap}>
                    <TouchableOpacity style={styles.nextBtn} onPress={submitTransfer}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TaskTranferScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.LIGHT_GRAY,
    paddingTop: 10,
  },
  view2: {
    flex: 1,
    padding: 10,
  },
  list: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
  },
  view1: {
    height: 10,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  dropdownContainer: {
    backgroundColor: "white",
    padding: 16,
    borderWidth: 1,
    borderColor: "#000000",
    width: "100%",
    height: 57,
    borderRadius: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropHeadTextWrap: {
    height: 30,
    paddingHorizontal: 8,
    position: "absolute",
    top: -8,
    left: 10,
    backgroundColor: "#fff",
    zIndex: 9,
  },
  dropHeadText: { color: "#B8B8B8", fontSize: 12 },
  dropWrap: { position: "relative", marginBottom: 20 },
  nextBtnWrap: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },
  nextBtn: {
    height: 50,
    width: 200,
    backgroundColor: "#FF156B",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});