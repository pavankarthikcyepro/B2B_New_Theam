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
import { getTaskList, getBranchDropdown, getDeptDropdown, getDesignationDropdown, getEmployeeDetails } from "../../redux/taskTransferReducer";
import { useIsFocused } from '@react-navigation/native';
import { Checkbox, IconButton } from 'react-native-paper';
import moment from "moment";

const datalist = [
    {
        name: "Task Transfer",
    },
];

const dropdownData = [
    { Customername: "", number: "", created: "", status: "", empname: "", value: '1' },
    { Customername: "", number: "", created: "", status: "", empname: "", value: '2' },
    { Customername: "", number: "", created: "", status: "", empname: "", value: '3' },
    { Customername: "", number: "", created: "", status: "", empname: "", value: '4' },
    { Customername: "", number: "", created: "", status: "", empname: "", value: '5' }
];

const TaskTranferScreen = () => {
    const selector = useSelector((state) => state.taskTransferReducer);
    const dispatch = useDispatch();
    const [showTaskList, setShowTaskList] = useState(false);
    const [showTaskFlatlist, setShowTaskFlatlist] = useState(false);
    const [tasklistHeader, setTasklistHeader] = useState(false);

    const [showTrasnferFromDropdowns, setShowTrasnferFromDropdowns] = useState(false);
    const [taskNameHeader, setTaskNameHeader] = useState("Task List");
    const [checked, setChecked] = useState({});

    //task transfer to states
    const [branchDropDownItem, setbranchDropDownItem] = useState("");
    const [branchDropDownList, setbranchDropDownList] = useState([]);
    const [deptDropDownItem, setDeptDropDownItem] = useState("");
    const [deptDropDownList, setDeptDropDownList] = useState([]);
    const [designationDropDownItem, setDesignationDropDownItem] = useState("");
    const [designationDropDownList, setDesignationDropDownList] = useState([]);
    const [employeeDropDownItem, setEmployeeDropDownItem] = useState("");
    const [employeeDropDownList, setEmployeeDropDownList] = useState([]);

    //task trasnfer from status
    const [branchTransferFromDropDownItem, setbranchTransferFromDropDownItem] = useState("");
    const [branchTransferFromDropDownList, setbranchTransferFromDropDownList] = useState([]);
    const [deptTransferFromDropDownItem, setDeptTransferFromDropDownItem] = useState("");
    const [deptTransferFromDropDownList, setDeptTransferFromDropDownList] = useState([]);
    const [designationTransferFromDropDownItem, setDesignationTransferFromDropDownItem] = useState("");
    const [designationTransferFromDropDownList, setDesignationTransferFromDropDownList] = useState([]);
    const [employeeTransferFromDropDownItem, setEmployeeTransferFromDropDownItem] = useState("");
    const [employeeTransferFromDropDownList, setEmployeeTransferFromDropDownList] = useState([]);

    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        getTargetbranchDropDownListFromServer();
        setbranchDropDownList(selector.branchList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
        setbranchTransferFromDropDownList(selector.branchList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
    }, []);

    const getTaskListFromServer = async () => {
        dispatch(getTaskList(119));
        setShowTaskList(true);
    }

    const getTargetbranchDropDownListFromServer = async () => {
        const payload = {
            "orgId": 1,
            "parent": "organization",
            "child": "branch",
            "parentId": 1
        }
        return dispatch(getBranchDropdown(payload));
    }

    const getTargetDeptDropDownListFromServer = async () => {
        const payload = {
            "orgId": 1,
            "parent": branchDropDownItem,
            "child": "department",
            "parentId": 242
        }
        return dispatch(getDeptDropdown(payload));
    }

    const getTargetDesignationDropDownListFromServer = async () => {
        const payload = {
            "orgId": 1,
            "parent": deptDropDownItem,
            "child": "designation",
            "parentId": 2
        }
        return dispatch(getDesignationDropdown(payload));
    }

    const getEmployeeDetailsFromServer = async () => {
        const payload = {
            "orgId": 16,
            "branchId": 267,
            "deptId": 180,
            "desigId": 56
        }
        dispatch(getEmployeeDetails(payload));
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
                            if (checked.hasOwnProperty(index)) {
                                const temp = checked;
                                temp[index] = !temp[index];
                                setChecked({ ...temp, index: temp[index] });
                            } else {
                                const temp = checked;
                                temp[index] = true;
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
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }} >Select Employee to Transfer Tasks</Text>
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
                                getTargetDeptDropDownListFromServer();
                                setDeptDropDownList(selector.deptList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
                                setDeptTransferFromDropDownList(selector.deptList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
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
                                setDesignationDropDownItem(item.label);
                                getTargetDesignationDropDownListFromServer();
                                setDesignationDropDownList(selector.designationList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
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
                                setEmployeeDropDownItem(item.label);
                                getEmployeeDetailsFromServer();
                                setEmployeeDropDownList(selector.employeeList.map(({ empId: value, empName: label, ...rest }) => ({ value, label, ...rest })));
                                setEmployeeTransferFromDropDownList(selector.employeeList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
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
                                getTaskListFromServer();
                                setTaskList(selector.taskList);
                                setTasklistHeader(true);
                            }}
                        />
                    </View>

                    {tasklistHeader ? <View style={{ width: '100%', paddingHorizontal: 15, height: 60, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }} >{taskNameHeader}</Text>
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
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }} >Transfer Task from</Text>
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
                                    getTargetDeptDropDownListFromServer();
                                    setbranchTransferFromDropDownItem(selector.deptList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
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
                                    setDeptTransferFromDropDownItem(item.label);
                                    getTargetDesignationDropDownListFromServer();
                                    setDesignationTransferFromDropDownList(selector.designationList.map(({ id: value, value: label, ...rest }) => ({ value, label, ...rest })));
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
                                    setDesignationTransferFromDropDownItem(item.label);
                                    getEmployeeDetailsFromServer();
                                    setDesignationTransferFromDropDownList(selector.employeeList.map(({ empId: value, empName: label, ...rest }) => ({ value, label, ...rest })));
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
                                }}
                            />
                        </View>
                    </View> : null}
                </View>

                <View style={styles.nextBtnWrap}>
                    <View style={styles.nextBtn}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' }}>Next</Text>
                    </View>
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
        backgroundColor: 'white',
        padding: 16,
        borderWidth: 1,
        borderColor: '#000000',
        width: '100%',
        height: 57,
        borderRadius: 5
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
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
    dropHeadTextWrap: { height: 30, paddingHorizontal: 8, position: 'absolute', top: -8, left: 10, backgroundColor: '#fff', zIndex: 9 },
    dropHeadText: { color: '#B8B8B8', fontSize: 12 },
    dropWrap: { position: 'relative', marginBottom: 20 },
    nextBtnWrap: { width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 50, paddingBottom: 30 },
    nextBtn: { height: 50, width: 200, backgroundColor: '#FC291C', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }
});
