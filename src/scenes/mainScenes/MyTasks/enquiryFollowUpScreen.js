import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { TextinputComp } from "../../../components";
import { Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { DropDownSelectionItem } from "../../../pureComponents";
import { DropDownComponant, DatePickerComponent, LoaderComponent } from "../../../components";
import Geolocation from '@react-native-community/geolocation';
import {
  clearState,
  setDatePicker,
  setEnquiryFollowUpDetails,
  updateSelectedDate,
  getTaskDetailsApi,
  updateTaskApi,
  getEnquiryDetailsApi,
  getReasonList
} from "../../../redux/enquiryFollowUpReducer";
import { DateSelectItem } from "../../../pureComponents";
import { convertDateStringToMillisecondsUsingMoment, GetCarModelList } from "../../../utils/helperFunctions";
import moment from "moment";
import {
  showToast,
  showToastRedAlert,
  showToastSucess,
} from "../../../utils/toast";
import {
  getCurrentTasksListApi,
  getPendingTasksListApi,
} from "../../../redux/mytaskReducer";
import * as AsyncStorage from "../../../asyncStore";
import { isValidateAlphabetics } from "../../../utils/helperFunctions";
import { Dropdown } from 'react-native-element-dropdown';

const ScreenWidth = Dimensions.get("window").width;

const LocalButtonComp = ({ title, onPress, disabled }) => {
  return (
    <Button
      style={{ width: 120 }}
      mode="contained"
      color={Colors.RED}
      disabled={disabled}
      labelStyle={{ textTransform: "none" }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};

const EnquiryFollowUpScreen = ({ route, navigation }) => {
  console.log('route-----', route?.params?.model);
  const { taskId, identifier, universalId, reasonTaskName } = route.params;
  const selector = useSelector((state) => state.enquiryFollowUpReducer);

  const dispatch = useDispatch();
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dropDownTitle, setDropDownTitle] = useState("");
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [carModelsData, setCarModelsData] = useState([]);
  const [modelVarientsData, setModelVarientsData] = useState([]);
  const [actionType, setActionType] = useState("");
  const [empId, setEmpId] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [defaultReasonIndex, setDefaultReasonIndex] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitPress, setIsSubmitPress] = useState(false);
  const [isDateError, setIsDateError] = useState(false);

  useLayoutEffect(() => {
    let title = "Enquiry Follow Up";
    switch (identifier) {
      case "PRE_ENQUIRY_FOLLOW_UP":
        title = "Contacts followup";
        break;
      case "PRE_BOOKING_FOLLOW_UP":
        title = "Booking approval task";
        break;
        case "BOOKING_FOLLOW_UP":
          title ="Booking follow up";
          break;
    }

    navigation.setOptions({
      title: title,
    });
  }, [navigation]);

  useEffect(() => {
    getAsyncStorageData();
    dispatch(getTaskDetailsApi(taskId));
    getEnquiryDetailsFromServer();
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      console.log("TYPE:", reasonTaskName);
      getCurrentLocation()
      let taskName = reasonTaskName;
      if (taskName ==='Contacts followup') { // this change is to send the previously used taskName value to the service call.
        taskName = 'Pre Enquiry Followup'
      }
      getReasonListData(taskName)
    })
  }, [navigation]);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(info)
      setCurrentLocation({
        lat: info.coords.latitude,
        long: info.coords.longitude
      })
    });
  }
  useEffect(() => {
    if(selector.isReasonUpdate && reasonList.length > 0){
      let reason = selector.reason;
      let findIndex = reasonList.findIndex((item) => {
        return item.value === selector.reason
      })
      console.log("DEFAULT INDEX:", findIndex);
      if(findIndex !== -1){
        setDefaultReasonIndex(reasonList[findIndex].value)
      }
      else if (reason) {
        dispatch(setEnquiryFollowUpDetails({ key: "REASON", text: "Other" }));
        setDefaultReasonIndex("Other");
        setOtherReason(reason);
      }
    }
  }, [selector.isReasonUpdate, reasonList]);

  useEffect(() => {
    const enquiryResponse = selector.enquiry_details_response;
    if (enquiryResponse && identifier === 'ENQUIRY_FOLLOW_UP') {
      const dmsLeadDto = enquiryResponse.dmsLeadDto;
      const dmsLeadProducts = dmsLeadDto.dmsLeadProducts;
      if (dmsLeadProducts && dmsLeadProducts.length) {
        const selectedModelData = dmsLeadProducts[0];
        const {model, variant} = selectedModelData;
        updateModelVarientsData(model, false);
      }

    }
  }, [selector.enquiry_details_response]);

  console.log(
      'selector.enquiry_detail---',
      selector.enquiry_details_response?.dmsLeadDto?.model
  );

  const getReasonListData = async (taskName) => {
    setLoading(true)
    const employeeData = await AsyncStorage.getData(AsyncStorage.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      let payload = {
        orgId: jsonObj.orgId,
        taskName: taskName
      }
      console.log('123421: ', payload)
      Promise.all([
        dispatch(getReasonList(payload))
      ]).then((res) => {
        console.log("all done", JSON.stringify(res));
        let tempReasonList = [];
        let allReasons = res[0].payload;
        if (allReasons.length > 0) {
          for (let i = 0; i < allReasons.length; i++) {
            allReasons[i].label = allReasons[i].reason;
            allReasons[i].value = allReasons[i].reason;
            if (i === allReasons.length - 1) {
              setTimeout(() => {
                setReasonList([
                  ...allReasons,
                  { label: "Other", value: "Other" },
                ]);
              }, 100);
              setLoading(false)
            }
          }
        }
        else {
          setLoading(false)
        }
      }).catch(() => {
        setLoading(false)
      })
    }
  };

  const getAsyncStorageData = async () => {
    const employeeData = await AsyncStorage.getData(AsyncStorage.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setEmpId(jsonObj.empId);
      getCarModelListFromServer(jsonObj.orgId);
    }
  };

  const getCarModelListFromServer = (orgId) => {
    // Call Api
    GetCarModelList(orgId).then((resolve) => {
      let modalList = [];
      if (resolve.length > 0) {
        resolve.forEach((item) => {
          modalList.push({ id: item.vehicleId, name: item.model, isChecked: false, ...item });
        });
      }
      setCarModelsData([...modalList]);
    }, (rejected) => {
      console.log("getCarModelListFromServer Failed")
    }).finally(() => {
      // Get Enquiry Details
      getEnquiryDetailsFromServer();
    })
  }

  const getEnquiryDetailsFromServer = () => {
    if (universalId) {
      dispatch(getEnquiryDetailsApi(universalId));
    }
  }

  const updateModelVarientsData = (selectedModelName) => {
    if (!selectedModelName || selectedModelName.length === 0) {
      return;
    }

    let arrTemp = carModelsData.filter(function (obj) {
      return obj.model === selectedModelName;
    });

    let carModelObj = arrTemp.length > 0 ? arrTemp[0] : undefined;
    if (carModelObj !== undefined) {
      let newArray = [];
      let mArray = carModelObj.varients;
      if (mArray.length) {
        mArray.forEach((item) => {
          newArray.push({
            id: item.id,
            name: item.name,
          });
        });
        setModelVarientsData([...newArray]);
      }
    }
  };

  const getMyTasksListFromServer = () => {
    if (empId) {
      const endUrl = `empid=${empId}&limit=10&offset=${0}`;
      dispatch(getCurrentTasksListApi(endUrl));
      dispatch(getPendingTasksListApi(endUrl));
    }
  };

  // Update, Close, Cancel, Reschedule Task Response handle
  useEffect(() => {
    if (selector.update_task_response_status === "success") {
      switch (actionType) {
        case "CLOSE":
          showToastSucess("Successfully Task Closed");
          getMyTasksListFromServer();
          break;
        case "RESCHEDULE":
          showToastSucess("Successfully Task Rescheduled");
          getMyTasksListFromServer();
          break;
        case "UPDATE":
          showToastSucess("Successfully Task Updated");
          break;
        case "CANCEL":
          showToastSucess("Successfully Task Cancelled");
          getMyTasksListFromServer();
          break;
      }
      navigation.popToTop();
      dispatch(clearState());
    } else if (selector.update_task_response_status === "failed") {
      showToastRedAlert("something went wrong");
    }
  }, [selector.update_task_response_status]);

  const updateTask = () => {
    changeTaskStatusBasedOnActionType("UPDATE");
  };

  const closeTask = () => {
    changeTaskStatusBasedOnActionType("CLOSE");
  };

  const rescheduleTask = () => {
    changeTaskStatusBasedOnActionType("RESCHEDULE");
  };

  const cancelTask = () => {
    changeTaskStatusBasedOnActionType("CANCEL");
  };

  const changeTaskStatusBasedOnActionType = (type) => {
    Keyboard.dismiss();
    setIsSubmitPress(true)
    if (selector.task_details_response?.taskId !== taskId) {
      return;
    }

    if (selector.reason.length === 0) {
      showToast("Please select reason");
      return;
    }
    if (selector.reason === 'Other' && otherReason.length === 0) {
      showToast("Please Enter Other Reason");
      return;
    }
    if (selector.customer_remarks === 0) {
      showToast("Please enter customer remarks");
      return;
    }
    if (!isValidateAlphabetics(selector.customer_remarks)) {
      showToast("Please enter alphabetics only in customer remarks");
      return;
    }

    if (selector.employee_remarks.length === 0) {
      showToast("Please enter employee remarks");
      return;
    }

    if (!isValidateAlphabetics(selector.employee_remarks)) {
      showToast("Please enter alphabetics only in employee remarks");
      return;
    }

    let startDate = moment(selector.actual_start_time, "DD/MM/YYYY");
    let endDate = moment(selector.actual_end_time, "DD/MM/YYYY");
    let diff = moment(endDate).diff(startDate, "d");

    if (0 == diff) {
      showToast("Actual Start Date and Actual End Date Should not be Equal");
      return;
    } else if (0 > diff) {
      showToast("Actual End Date Should not be less than Actual Start Date");
      return;
    }

    const newTaskObj = { ...selector.task_details_response };
    newTaskObj.reason = selector.reason === 'Other' ? otherReason : selector.reason;
    newTaskObj.customerRemarks = selector.customer_remarks;
    newTaskObj.employeeRemarks = selector.employee_remarks;
    newTaskObj.taskActualStartTime = convertDateStringToMillisecondsUsingMoment(
      selector.actual_start_time
    );
    newTaskObj.lat = currentLocation ? currentLocation.lat.toString() : null;
    newTaskObj.lon = currentLocation ? currentLocation.long.toString() : null;
    // dataObj.dmsExpectedDeliveryDate = convertDateStringToMillisecondsUsingMoment(selector.expected_delivery_date);
    newTaskObj.taskActualEndTime = convertDateStringToMillisecondsUsingMoment(
      selector.actual_end_time
    );
    switch (type) {
      case "CLOSE":
        newTaskObj.taskStatus = "CLOSED";
        break;
      case "CANCEL":
        newTaskObj.taskStatus = "CANCELLED";
        break;
      case "RESCHEDULE":
        var momentA = moment(selector.actual_start_time, "DD/MM/YYYY");
        var momentB = moment(); // current date
        if (momentA < momentB) {
          setIsDateError(true)
          showToast("Start date should not be less than current date");
          return;
        }
        newTaskObj.taskStatus = "RESCHEDULED";
        break;
    }
    setActionType(type);
    dispatch(updateTaskApi(newTaskObj));
  };
  const setDropDownDataForModel = (key, title) => {
    switch (key) {
      case "MODEL":
        setDataForDropDown([...carModelsData]);
        break;
      case "VARIENT":
        setDataForDropDown([...modelVarientsData]);
        break;
    }
    setShowDropDownModel(true);
    setDropDownTitle(title);
    setDropDownKey(key);
  };

  return (
      <SafeAreaView style={[styles.container]}>
          <DropDownComponant
              visible={showDropDownModel}
              headerTitle={dropDownTitle}
              data={dataForDropDown}
              onRequestClose={() => setShowDropDownModel(false)}
              selectedItems={(item) => {
                  if (dropDownKey === 'MODEL') {
                      updateModelVarientsData(item.name, false);
                  }
                  dispatch(
                      setEnquiryFollowUpDetails({
                          key: dropDownKey,
                          text: item.name,
                      })
                  );
                  setShowDropDownModel(false);
              }}
          />

          <DatePickerComponent
              visible={selector.showDatepicker}
              mode={'date'}
              minimumDate={selector.minDate}
              maximumDate={selector.maxDate}
              value={new Date(Date.now())}
              onChange={(event, selectedDate) => {
                  console.log('date: ', selectedDate);
                  if (Platform.OS === 'android') {
                      //setDatePickerVisible(false);
                  }
                  dispatch(updateSelectedDate({ key: '', text: selectedDate }));
              }}
              onRequestClose={() => dispatch(setDatePicker())}
          />

          <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              enabled
              keyboardVerticalOffset={100}
          >
              <ScrollView
                  automaticallyAdjustContentInsets={true}
                  bounces={true}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 15 }}
                  keyboardShouldPersistTaps={'handled'}
                  style={{ flex: 1 }}
              >
                  <View style={[GlobalStyle.shadow]}>
                      {(identifier === 'ENQUIRY_FOLLOW_UP' ||
                          identifier === 'PRE_ENQUIRY_FOLLOW_UP') && (
                          <View>
                              <DropDownSelectionItem
                                  label={'Model'}
                                  value={
                                      selector.enquiry_details_response
                                          ?.dmsLeadDto?.model
                                  }
                                  onPress={() =>
                                      setDropDownDataForModel(
                                          'MODEL',
                                          'Select Model'
                                      )
                                  }
                              />

                              {identifier === 'ENQUIRY_FOLLOW_UP' && (
                                  <DropDownSelectionItem
                                      label={'Varient'}
                                      value={selector.varient}
                                      onPress={() =>
                                          setDropDownDataForModel(
                                              'VARIENT',
                                              'Select Varient'
                                          )
                                      }
                                  />
                              )}
                          </View>
                      )}

                      {/* <TextinputComp
              style={styles.textInputStyle}
              label={"Reason*"}
              value={selector.reason}
              autoCapitalize={"words"}
              maxLength={50}
              onChangeText={(text) => {
                dispatch(
                  setEnquiryFollowUpDetails({ key: "REASON", text: text })
                );
              }}
            /> */}
                      <View style={{ position: 'relative' }}>
                          {selector.reason !== '' && (
                              <View
                                  style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 10,
                                      zIndex: 99,
                                  }}
                              >
                                  <Text
                                      style={{
                                          fontSize: 13,
                                          color: Colors.GRAY,
                                      }}
                                  >
                                      Reason*
                                  </Text>
                              </View>
                          )}
                          <Dropdown
                              style={[styles.dropdownContainer]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              inputSearchStyle={styles.inputSearchStyle}
                              iconStyle={styles.iconStyle}
                              data={reasonList}
                              search
                              maxHeight={300}
                              labelField='label'
                              valueField='value'
                              placeholder={'Reason*'}
                              searchPlaceholder='Search...'
                              value={defaultReasonIndex}
                              // onFocus={() => setIsFocus(true)}
                              // onBlur={() => setIsFocus(false)}
                              onChange={(val) => {
                                  console.log('£££', val);
                                  dispatch(
                                      setEnquiryFollowUpDetails({
                                          key: 'REASON',
                                          text: val.value,
                                      })
                                  );
                              }}
                          />
                          <Text
                              style={[
                                  GlobalStyle.underline,
                                  {
                                      backgroundColor:
                                          isSubmitPress &&
                                          selector.reason === ''
                                              ? 'red'
                                              : 'rgba(208, 212, 214, 0.7)',
                                  },
                              ]}
                          ></Text>
                      </View>
                      {selector.reason === 'Other' && (
                          <TextinputComp
                              style={styles.textInputStyle}
                              label={'Other reason'}
                              autoCapitalize='sentences'
                              value={otherReason}
                              maxLength={50}
                              onChangeText={(text) => {
                                  setOtherReason(text);
                              }}
                          />
                      )}
                      <Text style={GlobalStyle.underline}></Text>

                      <TextinputComp
                          style={styles.textInputStyle}
                          label={'Customer Remarks*'}
                          maxLength={50}
                          value={selector.customer_remarks}
                          autoCapitalize={'words'}
                          onChangeText={(text) =>
                              dispatch(
                                  setEnquiryFollowUpDetails({
                                      key: 'CUSTOMER_REMARKS',
                                      text: text,
                                  })
                              )
                          }
                      />
                      <Text
                          style={[
                              GlobalStyle.underline,
                              {
                                  backgroundColor:
                                      isSubmitPress &&
                                      selector.customer_remarks === ''
                                          ? 'red'
                                          : 'rgba(208, 212, 214, 0.7)',
                              },
                          ]}
                      ></Text>

                      <TextinputComp
                          style={styles.textInputStyle}
                          label={'Employee Remarks*'}
                          value={selector.employee_remarks}
                          maxLength={50}
                          autoCapitalize={'words'}
                          onChangeText={(text) =>
                              dispatch(
                                  setEnquiryFollowUpDetails({
                                      key: 'EMPLOYEE_REMARKS',
                                      text: text,
                                  })
                              )
                          }
                      />
                      <Text
                          style={[
                              GlobalStyle.underline,
                              {
                                  backgroundColor:
                                      isSubmitPress &&
                                      selector.employee_remarks === ''
                                          ? 'red'
                                          : 'rgba(208, 212, 214, 0.7)',
                              },
                          ]}
                      ></Text>
                      <DateSelectItem
                          label={'Actual Start Date'}
                          value={selector.actual_start_time}
                          onPress={() =>
                              dispatch(setDatePicker('ACTUAL_START_TIME'))
                          }
                          //  value={selector.expected_delivery_date}
                          // onPress={() =>
                          // dispatch(setDatePicker("EXPECTED_DELIVERY_DATE"))
                      />
                      <Text
                          style={[
                              GlobalStyle.underline,
                              {
                                  backgroundColor:
                                      isSubmitPress &&
                                      (selector.actual_start_time === '' ||
                                          isDateError)
                                          ? 'red'
                                          : 'rgba(208, 212, 214, 0.7)',
                              },
                          ]}
                      ></Text>
                      <DateSelectItem
                          label={'Actual End Date'}
                          value={selector.actual_end_time}
                          onPress={() =>
                              dispatch(setDatePicker('ACTUAL_END_TIME'))
                          }
                      />
                      <Text style={GlobalStyle.underline}></Text>
                  </View>

                  {selector.task_status !== 'CANCELLED' ? (
                      <View>
                          <View style={styles.view1}>
                              <LocalButtonComp
                                  title={'Update'}
                                  onPress={updateTask}
                                  disabled={selector.is_loading_for_task_update}
                              />
                              <LocalButtonComp
                                  title={'Close'}
                                  onPress={closeTask}
                                  disabled={selector.is_loading_for_task_update}
                              />
                          </View>

                          <View style={styles.view1}>
                              <LocalButtonComp
                                  title={'Cancel'}
                                  onPress={cancelTask}
                                  disabled={selector.is_loading_for_task_update}
                              />
                              <LocalButtonComp
                                  title={'Reschedule'}
                                  onPress={rescheduleTask}
                                  disabled={selector.is_loading_for_task_update}
                              />
                          </View>
                      </View>
                  ) : (
                      <View style={styles.cancelledVw}>
                          <Text style={styles.cancelledText}>
                              {'This task has been cancelled'}
                          </Text>
                      </View>
                  )}
              </ScrollView>
          </KeyboardAvoidingView>
          <LoaderComponent visible={loading} />
      </SafeAreaView>
  );
};

export default EnquiryFollowUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  view1: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  drop_down_view_style: {
    height: 65,
    width: "100%",
    backgroundColor: Colors.WHITE,
  },
  cancelledVw: {
    height: 60,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelledText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.RED,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 8,
    // borderWidth: 1,
    width: '100%',
    height: 60,
    // borderRadius: 5
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
    color: Colors.GRAY
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
