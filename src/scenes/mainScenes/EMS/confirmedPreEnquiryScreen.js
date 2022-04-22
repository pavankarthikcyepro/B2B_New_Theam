import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Keyboard, Alert, Dimensions, KeyboardAvoidingView, BackHandler } from 'react-native';
import { ButtonComp } from "../../../components/buttonComp";
import { Checkbox, Button, IconButton, Divider, List } from 'react-native-paper';
import { Colors, GlobalStyle } from '../../../styles';
import { TextinputComp } from '../../../components/textinputComp';
import { DropDownComponant } from '../../../components/dropDownComp';
import { convertTimeStampToDateString } from '../../../utils/helperFunctions';
import { clearState, getPreEnquiryDetails, noThanksApi, getaAllTasks, assignTaskApi, changeEnquiryStatusApi, getEmployeesListApi, updateEmployeeApi } from '../../../redux/confirmedPreEnquiryReducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppNavigator } from '../../../navigations';
import * as AsyncStore from "../../../asyncStore";
import { LoaderComponent, SelectEmployeeComponant } from '../../../components';
import { getPreEnquiryData } from '../../../redux/preEnquiryReducer';
import { showToastRedAlert,showToast } from '../../../utils/toast';
import {
    DropDownSelectionItem,
    setDropDownData
} from "../../../pureComponents";
import { setBookingDropDetails } from '../../../redux/preBookingFormReducer';
import { resolvePath } from 'react-native-reanimated/src/reanimated2/animation/styleAnimation';
import { isRejected } from '@reduxjs/toolkit';
const ConfirmedPreEnquiryScreen = ({ route, navigation }) => {

    const selector = useSelector(state => state.confirmedPreEnquiryReducer);
    const dispatch = useDispatch();
    const { itemData, fromCreatePreEnquiry } = route.params;
    const [employeeId, setEmployeeId] = useState("");
    const [organizationId, setOrganizationId] = useState("");
    const [showEmployeeSelectModel, setEmployeeSelectModel] = useState(false);
    const [employeesData, setEmployeesData] = useState([]);
    const [branchId, setBranchId] = useState("");
    const [isDropSelected, setIsDropSelected] = useState(false);
  const [openAccordian, setOpenAccordian] = useState(0);
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    

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

 const updateAccordian = (selectedIndex) => {
    if (selectedIndex != openAccordian) {
      setOpenAccordian(selectedIndex);
    } else {
      setOpenAccordian(0);
    }
  };
    
    const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();

    switch (key) {
      
      case "DROP_REASON":
        if (selector.drop_reasons_list.length === 0) {
          showToast("No Drop Reasons found");
          return;
        }
        setDataForDropDown([...selector.drop_reasons_list]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

    const proceedToCancelPreEnquiry = () => {
    if (
      selector.drop_remarks.length === 0 ||
      selector.drop_reason.length === 0
    ) {
      showToastRedAlert("Please enter details for drop");
      return;
    }

    if (!selector.pre_enquiry_details_response) {
      return;
    }

    let enquiryDetailsObj = { ...selector.pre_enquiry_details_response };
    let dmsLeadDto = { ...enquiryDetailsObj.dmsLeadDto };
    dmsLeadDto.leadStage = "DROPPED";
    enquiryDetailsObj.dmsLeadDto = dmsLeadDto;

    let leadId = selector.pre_enquiry_details_response.dmsLeadDto.id;
    if (!leadId) {
      showToast("lead id not found");
      return;
    }

    const payload = {
      dmsLeadDropInfo: {
        additionalRemarks: selector.drop_remarks,
        branchId: userData.branchId,
        brandName: selector.d_brand_name,
        dealerName: selector.d_dealer_name,
        leadId: leadId,
        crmUniversalId: universalId,
        lostReason: selector.drop_reason,
        organizationId: userData.orgId,
        otherReason: "",
        droppedBy: userData.employeeId,
        location: selector.d_location,
        model: selector.d_model,
        stage: "PREENQUIRY",
        status: "PREENQUIRY",
      },
    };
    setTypeOfActionDispatched("DROP_PREENQUIRY");
    dispatch(dropPreBooingApi(payload));
    dispatch(updatePrebookingDetailsApi(enquiryDetailsObj));
  };

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
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        }
    }, []);

    const getBranchId = () => {

        AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID).then((branchId) => {
            console.log("branch id:", branchId)
            setBranchId(branchId);
        });
    }

    const getAsyncStorageData = async () => {
        const employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);

        if (employeeData) {
            const jsonObj = JSON.parse(employeeData);
            console.log("json:", jsonObj);
            setOrganizationId(jsonObj.orgId);
            setEmployeeId(jsonObj.empId);
        }
    };

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

    displayCreateEnquiryAlert = (data) => {
        Alert.alert(
            'Enquiry Created Successfully',
            "Enquiry Number: " + itemData.universalId + ", Allocated DSE: " + data.dmsEntity.task?.assignee?.empName,
            [
                {
                    text: 'OK', onPress: () => {
                        getPreEnquiryListFromServer();
                        navigation.popToTop();
                        dispatch(clearState());
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
            dispatch(getEmployeesListApi(data));
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
              {isDropSelected ? <View style={styles.space}></View> : null}
              {isDropSelected ? (
                <List.Accordion
                  id={"10"}
                  title={"Pre Enquiry Drop Section"}
                  titleStyle={{
                    color: openAccordian === "10" ? Colors.WHITE : Colors.BLACK,
                    fontSize: 16,
                    marginRight:20,
                    fontWeight: "600",
                  }}
                  style={[{
                    backgroundColor: openAccordian === "10" ? Colors.RED : Colors.WHITE,
                  }, styles.accordianBorder]}
                >
                  <DropDownSelectionItem
                    label={"Drop Reasons"}
                    value={selector.drop_reason}
                    onPress={() =>
                      showDropDownModelMethod("DROP_REASON", "Drop Reason")
                    }
                  />
                   {selector.drop_reason.replace(/\s/g, "").toLowerCase() ==
                    "losttocompetitor" ||
                    selector.drop_reason.replace(/\s/g, "").toLowerCase() ==
                    "losttoco-dealer" ? (
                    <DropDownSelectionItem
                      label={"Drop Sub Reason"}
                      value={selector.drop_sub_reason}
                      onPress={() =>
                        showDropDownModelMethod(
                          "DROP_SUB_REASON",
                          "Drop Sub Reason"
                        )
                      }
                    />
                  ) : null} 

                  {selector.drop_reason === "Lost to Competitor" ||
                    selector.drop_reason ===
                    "Lost to Used Cars from Co-Dealer" ? (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.d_brand_name}
                        label={"Brand Name"}
                        maxLength={50}
                        onChangeText={(text) =>
                          dispatch(
                            setBookingDropDetails({
                              key: "DROP_BRAND_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  ) : null}

                  {selector.drop_reason === "Lost to Competitor" ||
                    selector.drop_reason === "Lost to Used Cars from Co-Dealer" ||
                    selector.drop_reason === "Lost to Co-Dealer" ? (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.d_dealer_name}
                        label={"Dealer Name"}
                        maxLength={50}
                        onChangeText={(text) =>
                          dispatch(
                            setBookingDropDetails({
                              key: "DROP_DEALER_NAME",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.d_location}
                        label={"Location"}
                        maxLength={50}
                        onChangeText={(text) =>
                          dispatch(
                            setBookingDropDetails({
                              key: "DROP_LOCATION",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  ) : null}

                  {selector.drop_reason === "Lost to Competitor" ||
                    selector.drop_reason ===
                    "Lost to Used Cars from Co-Dealer" ? (
                    <View>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.d_model}
                        label={"Model"}
                        maxLength={50}
                        onChangeText={(text) =>
                          dispatch(
                            setBookingDropDetails({
                              key: "DROP_MODEL",
                              text: text,
                            })
                          )
                        }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                    </View>
                  ) : null}

                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.drop_remarks}
                    label={"Remarks"}
                    maxLength={50}
                    onChangeText={(text) =>
                      dispatch(
                        setBookingDropDetails({
                          key: "DROP_REMARKS",
                          text: text,
                        })
                      )
                    }
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </List.Accordion>
                ) : null}
                {isDropSelected && (
              <View style={styles.preenquiryBtnView}>
                <Button
                  mode="contained"
                  color={Colors.RED}
                  disabled={selector.isLoading}
                  labelStyle={{ textTransform: "none" }}
                  onPress={proceedToCancelPreEnquiry}
                >
                  Proceed To Cancellation
                </Button>
              </View>
            )}
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
                                  style={{ width: 120 }}
                                  color={Colors.RED}
                                  disabled={selector.isLoading}
                                  labelStyle={{ textTransform: "none" }}
                                  onPress={() => setIsDropSelected(true)}
                                >
                                    Drop
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
      fontWeight: '600',
      marginBottom:20,

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
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})