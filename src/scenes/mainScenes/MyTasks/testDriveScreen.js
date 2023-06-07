import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Colors, GlobalStyle } from "../../../styles";
import { useDispatch, useSelector } from "react-redux";
import {
  TextinputComp,
  DropDownComponant,
  DatePickerComponent,
  ImagePickerComponent,
} from "../../../components";
import {
  clearState,
  updateSelectedDate,
  getTestDriveDseEmployeeListApi,
  getDriversListApi,
  getTestDriveVehicleListApi,
  bookTestDriveAppointmentApi,
  updateTestDriveTaskApi,
  getTaskDetailsApi,
  getTestDriveAppointmentDetailsApi,
  validateTestDriveApi,
  generateOtpApi,
  validateOtpApi, postReOpenTestDrive, getTestDriveHistoryCount,
  clearOTP,
  PutUpdateListTestDriveHistory,
  updateSelectedScheduledata,
  getTestDriveHistoryDetails,
  saveReScheduleRemark,
  getDetailsWrokflowTask,
  putWorkFlowHistory,
  postDetailsWorkFlowTask,
  getDetailsWrokflowTaskForFormData,
  getDetailsWrokflowTaskReTestDrive,
  postReOpenTestDriveV2,
} from "../../../redux/testDriveReducer";
import {
  DateSelectItem,
  RadioTextItem,
  ImageSelectItem,
  DropDownSelectionItem,
} from "../../../pureComponents";
import { Dropdown } from 'react-native-element-dropdown';
import { Button, IconButton, RadioButton } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import {
  convertToDate,
  convertToTime,
  isEmail,
} from "../../../utils/helperFunctions";
import {
  showToast,
  showToastRedAlert,
  showAlertMessage,
} from "../../../utils/toast";
import URL from "../../../networking/endpoints";
import moment from "moment";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { client } from "../../../networking/client";
import { EmsTopTabNavigatorIdentifiers } from "../../../navigations/emsTopTabNavigator";
import { convertDateStringToMillisecondsUsingMoment } from "./../../../utils/helperFunctions";
import { getReasonList } from "../../../redux/enquiryFollowUpReducer";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AsyncStorage from "../../../asyncStore";
import _ from "lodash";
import { getWorkFlow } from "../../../redux/taskThreeSixtyReducer";
const LocalButtonComp = ({
  title,
  onPress,
  disabled,
  bgColor = Colors.RED,
}) => {
  return (
    <Button
      style={{ width: 120 }}
      mode="contained"
      color={bgColor}
      disabled={disabled}
      labelStyle={{ textTransform: "none" }}
      onPress={onPress}
    >
      {title}
    </Button>
  );
};

const TestDriveScreen = ({ route, navigation }) => {
  const {
    taskId,
    identifier,
    universalId,
    taskData,
    mobile,
    fromScreen = "",
  } = route.params;

  const dispatch = useDispatch();
  const selector = useSelector((state) => state.testDriveReducer);
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [dataForDropDown, setDataForDropDown] = useState([]);
  const [dropDownKey, setDropDownKey] = useState("");
  const [dropDownTitle, setDropDownTitle] = useState("Select Data");
  const [imagePath, setImagePath] = useState("");
  const [userData, setUserData] = useState({
    orgId: "",
    employeeId: "",
    employeeName: "",
    isSelfManager: "",
    isOtp: "",
    isTracker: "",
  });
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [showDatePickerModel, setShowDatePickerModel] = useState(false);
  const [datePickerKey, setDatePickerKey] = useState("");
  const [datePickerMode, setDatePickerMode] = useState("date");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerKey, setImagePickerKey] = useState("");
  const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
  const [isRecordEditable, setIsRecordEditable] = useState(true);
  const [expectedStartAndEndTime, setExpectedStartAndEndTime] = useState({
    start: "",
    end: "",
  });
  const [taskStatusAndName, setTaskStatusAndName] = useState({
    status: "",
    name: "",
  });
  const [addressType, setAddressType] = useState(0); // 0: nothing, 1: showroom, 2: customer
  const [customerHavingDrivingLicense, setCustomerHavingDrivingLicense] =
    useState(0); // 0: nothing, 1: yes, 2: no
  const [handleActionButtons, setHandleActionButtons] = useState(0); // 0 : nothing, 1: submit, 2: cancel
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState({
    model: "",
    varient: "",
    fuelType: "",
    transType: "",
    vehicleId: 0,
    varientId: 0,
  });
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerRemarks, setCustomerRemarks] = useState("");
  const [employeeRemarks, setEmployeeRemarks] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedDseDetails, setSelectedDseDetails] = useState({
    name: "",
    id: "",
  });
  const [selectedDriverDetails, setSelectedDriverDetails] = useState({
    name: "",
    id: "",
  });
  const [customerAddress, setCustomerAddress] = useState("");
  const [varientListForDropDown, setVarientListForDropDown] = useState([]);

  const CELL_COUNT = 4;
  const screenWidth = Dimensions.get("window").width;
  const otpViewHorizontalPadding = (screenWidth - (160 + 80)) / 2;

  const [isCloseSelected, setIsCloseSelected] = useState(false);

  const [otpValue, setOtpValue] = useState("");
  const ref = useBlurOnFulfill({ otpValue, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });
  const [isSubmitPress, setIsSubmitPress] = useState(false);
  const [isSubmitPressRescheduleModal, setIsSubmitPressRescheduleModal] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [isValuesEditable, setIsValuesEditable] = useState(true);
  const [isReopenSubmitVisible, setIsisReopenSubmitVisible] = useState(false);
  const [ischangeScreen, setIschangeScreen] = useState(false);
  const [isRechduleModalVisible, setIsRescheduleModalVisible] = useState(false);
  const [reasonList, setReasonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [defaultReasonIndex, setDefaultReasonIndex] = useState(null);
  const [storeLastupdatedTestDriveId, setStoreLastupdatedTestDriveId] = useState("");
  const [storeLastupdatedTestDriveDetails, setStoreLastupdatedTestDriveDetails] = useState([]);
  const [isClosedClicked, setIsClosedClicked] =useState(false);
  let date = new Date();
  date.setDate(date.getDate() + 9);
  const Task360selector = useSelector((state) => state.taskThreeSixtyReducer);
  useEffect(() => {
    //updateBasicDetails(taskData);
    // getAsyncstoreData();
    // getUserToken();
    isViewMode();
    isViewMode2("");

    if (route?.params?.taskStatus === "CLOSED") {
      dispatch(getTestDriveHistoryCount(universalId))
    }
   
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setIsCloseSelected(false);
      dispatch(clearState());
      setSelectedDriverDetails({
        name: "",
        id: "",
      });
      getAsyncstoreData();
      getUserToken();
      dispatch(getWorkFlow(universalId));

    });
    navigation.addListener("blur", () => {
      dispatch(clearState());
      setSelectedDriverDetails({
        name: "",
        id: "",
      });
    });

  }, [navigation]);

  useEffect(() => {
    if (selector.test_drive_history_details_statu === "successs") {
      let response = selector.test_drive_history_details;
      let tempData;
      if(response.length >0){
       tempData= response[response.length - 1]
        setStoreLastupdatedTestDriveDetails(tempData);
        setStoreLastupdatedTestDriveId(tempData?.id);
        // todo set last updated test drive data 
        
       
         // api to get task details 
            // dispatch(getTaskDetailsApi(taskId))
        if (!_.isEmpty(tempData)) {
          setTimeout(() => {
            // if (tempData.reTestdriveFlag == "ReTestDrive") {

              // let payloadForWorkFLow = {
              //   entityId: selector.task_details_response?.entityId,
              //   taskName: "Test Drive"
              // }
              // // reTestDrivePutCallWorkFlowHistory() //need to call after we get response for getDetailsWrokflowTask
              // // postWorkFlowTaskHistory()// need to call after we get response for getDetailsWrokflowTask
              // dispatch(getDetailsWrokflowTaskForFormData(payloadForWorkFLow)) //todo need to check and pass entityId

              setName(tempData.name);
              setEmail(tempData.email || "");
              setMobileNumber(tempData.mobileNumber);


            setSelectedVehicleDetails({
              model: tempData.model,
              varient: tempData.varient,
              fuelType: tempData.fuelType,
              transType: tempData.transmissionType,
              vehicleId: tempData.vehicleId,
              varientId: tempData.varientId,
            });




              const driverId = tempData.driverId || "";
              let driverName = "";

              if (selector.drivers_list.length > 0 && tempData.driverId) {
                const filterAry = selector.drivers_list.filter(
                  (object) => object.id == tempData.driverId
                );
                if (filterAry.length > 0) {
                  driverName = filterAry[0].name;
                }
              }
              setSelectedDriverDetails({ name: driverName, id: driverId });

              const customerHaveingDl = tempData.isCustomerHaveingDl
                ? tempData.isCustomerHaveingDl
                : false;
              if (customerHaveingDl) {
                const dataObj = { ...uploadedImagesDataObj };
                if (tempData.dlFrontUrl) {
                  dataObj.dlFrontUrl = {
                    documentPath: tempData.dlFrontUrl,
                    fileName: "driving license front",
                  };
                }
                if (tempData.dlBackUrl) {
                  dataObj.dlBackUrl = {
                    documentPath: tempData.dlBackUrl,
                    fileName: "driving license back",
                  };
                }
                setUploadedImagesDataObj({ ...dataObj });
              }
              setCustomerHavingDrivingLicense(customerHaveingDl ? 1 : 2);


              const testDriveDatetime = tempData.testDriveDatetime ? tempData.testDriveDatetime : "";
              const testDriveDatetimeAry = testDriveDatetime.split(" ");
              if (testDriveDatetimeAry.length > 0) {
                // state.customer_preferred_date = moment(testDriveDatetimeAry[0], "DD-MM-YYYY").format("DD/MM/YYYY")
                dispatch(
                  updateSelectedDate({ key: "PREFERRED_DATE", text: moment(testDriveDatetimeAry[0], "DD-MM-YYYY").format("DD/MM/YYYY") })
                );
              }
              if (testDriveDatetimeAry.length > 1) {
                // state.customer_preferred_time = testDriveDatetimeAry[1];
                dispatch(
                  updateSelectedDate({ key: "CUSTOMER_PREFERRED_TIME", text: testDriveDatetimeAry[1] })
                );
              }

              const startTime = tempData.startTime ? tempData.startTime : "";

              const startTimeAry = moment(startTime)
                .format("DD/MM/YY h:mm a")
                .split(" ");
              if (startTimeAry.length > 1) {
                // state.actual_start_time = startTimeAry[1];
                dispatch(
                  updateSelectedDate({ key: "ACTUAL_START_TIME", text: startTimeAry[1] })
                );
              }
              // state.driverId = tempData.driverId;
              const endTime = tempData.endTime ? tempData.endTime : "";
              const endTimeAry = moment(endTime)
                .format("DD/MM/YY h:mm a")
                .split(" ");;
              if (endTimeAry.length > 1) {
                // state.actual_end_time = endTimeAry[1];
                dispatch(
                  updateSelectedDate({ key: "ACTUAL_END_TIME", text: endTimeAry[1] })
                );
              }
            // }

          }, 2000);
       


        }
      }
     
    }


  }, [selector.test_drive_history_details_statu])

  useEffect(() => {
    if (selector.isReasonUpdate && reasonList.length > 0) {

      let reason = selector.reason;
      let findIndex = reasonList.findIndex((item) => {
        return item.value === selector.reason
      })
      
      if (findIndex !== -1) {
        setDefaultReasonIndex(reasonList[findIndex].value)
      }
      else if (reason) {
        dispatch(setEnquiryFollowUpDetails({ key: "REASON", text: "Other" }));
        setDefaultReasonIndex("Other");
        setOtherReason(reason);
      }
    }
  }, [selector.isReasonUpdate, reasonList]);


  const getReasonListData = async (taskName) => {

    setLoading(true)
    const employeeData = await AsyncStorage.getData(AsyncStorage.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      let payload = {
        orgId: jsonObj.orgId,
        taskName:
          taskName == "Booking approval task"
            ? "PreBooking FollowUp"
            : taskName,
      };
      Promise.all([
        dispatch(getReasonList(payload))
      ]).then((res) => {
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

  const getAsyncstoreData = async () => {
    const employeeData = await AsyncStore.getData(
      AsyncStore.Keys.LOGIN_EMPLOYEE
    );
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      const roles = jsonObj.roles || [];
      if (
        roles.includes("Testdrive_DSE") ||
        roles.includes("Testdrive_Manager")
      ) {
        setUserData({
          orgId: jsonObj.orgId,
          employeeId: jsonObj.empId,
          employeeName: jsonObj.empName,
          isSelfManager: jsonObj.isSelfManager,
          isOtp: jsonObj.isOtp,
          isTracker: jsonObj.isTracker,
        });

        // Get Branch Id
        AsyncStore.getData(AsyncStore.Keys.SELECTED_BRANCH_ID).then(
          (branchId) => {
            setSelectedBranchId(branchId);
            const payload = {
              barnchId: branchId,
              orgId: jsonObj.orgId,
            };

            Promise.all([
              dispatch(getTaskDetailsApi(taskId)),// commented to manage re test drive btn not clickable case
              dispatch(getTestDriveVehicleListApi(payload)),
              dispatch(getTestDriveDseEmployeeListApi(jsonObj.orgId)),
              dispatch(getDriversListApi(jsonObj.orgId)),
            ]).then(() => { });
          }
        );
      } else {
        showToast("You don't have access to view this task");
        dispatch(clearState());
        navigation.goBack();
      }
    }
  };

  const getUserToken = () => {
    AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
      if (token.length > 0) {
        getRecordDetailsFromServer(token);
      }
    });
  };

  const updateBasicDetails = (taskData) => {
    if (taskData) {
      const leadDtoObj = taskData.leadDto;
      setName(leadDtoObj.firstName + " " + leadDtoObj.lastName);
      setEmail(leadDtoObj.email || "");
      setMobileNumber(leadDtoObj.phone || "");
      setSelectedDseDetails({
        name: taskData.assignee.empName,
        id: taskData.assignee.empId,
      });
    }
  };

  const getRecordDetailsFromServer = async (token) => {
    const url = URL.ENQUIRY_DETAILS(universalId);
    // await fetch(url, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "auth-token": token,
    //   },
    // })
    await client.get(url)
      .then((json) => json.json())
      .then((resp) => {
        if (resp.dmsEntity?.dmsLeadDto) {
          const leadDtoObj = resp.dmsEntity?.dmsLeadDto;
          setName(leadDtoObj.firstName + " " + leadDtoObj.lastName);
          setEmail(leadDtoObj.email || "");
          setMobileNumber(mobile || leadDtoObj.phone);
          // setSelectedDseDetails({
          //   name: taskData.assignee.empName,
          //   id: taskData.assignee.empId,
          // });
          const dmsLeadProducts = resp.dmsEntity?.dmsLeadDto?.dmsLeadProducts;
          if (dmsLeadProducts.length > 0) {
            let primaryModel;
            if (dmsLeadProducts.length > 1) {
              const primaryProductIndex = dmsLeadProducts.findIndex(
                (x) => x.isPrimary === "Y"
              );
              if (primaryProductIndex !== -1) {
                primaryModel = dmsLeadProducts[primaryProductIndex];
              }
            } else {
              primaryModel = dmsLeadProducts[0];
            }

            const { model, variant, fuel, transimmisionType } = primaryModel;
            setSelectedVehicleDetails({
              model,
              varient: variant,
              fuelType: fuel,
              transType: transimmisionType,
              vehicleId: 0,
              varientId: 0,
            });
          }
        }
      })
      .catch((err) => {
        console.error("while fetching record details: ", err);
      });
  };

  // Handle Task Details Response
  useEffect(() => {
    if (
      selector.test_drive_vehicle_list_for_drop_down.length > 0 &&
      selectedVehicleDetails?.varient !== ""
    ) {
      let tempObj = { ...selectedVehicleDetails };
      let findModel = [];
      findModel = selector.test_drive_vehicle_list_for_drop_down.filter(
        (item) => {
          return item.model == selectedVehicleDetails.model;
        }
      );
      tempObj.vehicleId = findModel[0]?.vehicleId;

      if (findModel.length > 0) {
        let findVarient = [];
        findVarient = selector.test_drive_varients_obj_for_drop_down[
          findModel[0]?.model
        ].filter((item) => {
          return item.varientName == selectedVehicleDetails.varient;
        });
        if (findVarient.length > 0) {
          tempObj.varientId = findVarient[0].varientId;

          if (
            selector.test_drive_varients_obj_for_drop_down[findModel[0].model]
          ) {
            const varientsData =
              selector.test_drive_varients_obj_for_drop_down[
              findModel[0].model
              ];
            setVarientListForDropDown(varientsData);
          }
        } else {
          tempObj.varientId = findModel[0].varientId;
        }
      } else {
        tempObj.fuelType = "";
        tempObj.transType = "";
      }
      setSelectedVehicleDetails(tempObj);
    }
  }, [selector.test_drive_vehicle_list_for_drop_down]);

  useEffect(() => {
    if (selector.task_details_response) {
      getTestDriveAppointmentDetailsFromServer();
    }
  }, [selector.task_details_response, taskStatusAndName]);

  useEffect(() => {
    
    if (!_.isEmpty(selector.get_workFlow_task_details)){
      let modifiedObj = selector.get_workFlow_task_details[selector.get_workFlow_task_details.length -1];
      const dateFormat = "DD/MM/YYYY";
      const currentDate = moment().add(0, "day").format(dateFormat)
      const temp ={...modifiedObj};
      // temp.taskStatus =  "APPROVED";
      temp.taskName = "Re Test Drive";
      temp.taskStatus = compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED";
      // temp.taskUpdatedTime = compare(selector.customer_preferred_date, currentDate) == 0 ? moment().valueOf() : convertDateStringToMillisecondsUsingMoment(selector.customer_preferred_time);
      temp.taskUpdatedTime =  convertDateStringToMillisecondsUsingMoment(
        `${selector.customer_preferred_date} ${selector.customer_preferred_time}`,
        "DD/MM/YYYY HH:mm"
      );
      temp.taskCreatedTime = moment().valueOf();
      // const value = temp.taskId;
      const value = selector.get_workFlow_task_details[0].taskId;
      const valueassignee = temp.assignee;
      const valueProcessId = temp.dmsProcess;
      temp["assigneeId"] = valueassignee;
      temp["processId"] = valueProcessId;
      temp["taskIdRef"] =value;
      temp.taskSequence = Task360selector.wrokflow_response[Task360selector.wrokflow_response.length - 1].taskSequence + 1
      delete temp.taskId;
      delete temp.assignee;
      delete temp.dmsProcess;
      delete temp.taskUpdatedBy;


      if (storeLastupdatedTestDriveDetails?.reTestdriveFlag == "ReTestDrive") {
   
         temp.taskStatus = isClosedClicked ? "CLOSED" :"RESCHEDULED";
       
        
        reTestDrivePutCallWorkFlowHistory(temp, modifiedObj.taskId);
      }else{
        postWorkFlowTaskHistory(temp)// need to call after we get response for getDetailsWrokflowTask
      }
    
      // let newArr = modifiedObj
      // reTestDrivePutCallWorkFlowHistory() //need to call after we get response for getDetailsWrokflowTask
      
      setIschangeScreen(true);
    }
  
    
  }, [selector.get_workFlow_task_details])
  
  useEffect(() => {

    if (!_.isEmpty(selector.get_workFlow_task_details_reTestDrive)) {
      let modifiedObj = selector.get_workFlow_task_details_reTestDrive[selector.get_workFlow_task_details_reTestDrive.length - 1];
      const dateFormat = "DD/MM/YYYY";
      const currentDate = moment().add(0, "day").format(dateFormat)
      const temp = { ...modifiedObj };
      // temp.taskStatus =  "APPROVED";
      temp.taskName = "Re Test Drive";
      temp.taskStatus = compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED";
      // temp.taskUpdatedTime = compare(selector.customer_preferred_date, currentDate) == 0 ? moment().valueOf() : convertDateStringToMillisecondsUsingMoment(selector.customer_preferred_date);
      temp.taskUpdatedTime = convertDateStringToMillisecondsUsingMoment(
        `${selector.customer_preferred_date} ${selector.customer_preferred_time}`,
        "DD/MM/YYYY HH:mm"
      );
      temp.taskCreatedTime = moment().valueOf();
      // const value = temp.taskId;
      const value = selector.get_workFlow_task_details_reTestDrive[0].taskId;
      const valueassignee = temp.assignee;
      const valueProcessId = temp.dmsProcess;
      temp["assigneeId"] = valueassignee;
      temp["processId"] = valueProcessId;
      temp["taskIdRef"] = value;
      temp.taskSequence = Task360selector.wrokflow_response[Task360selector.wrokflow_response.length - 1].taskSequence+1;
      delete temp.taskId;
      delete temp.assignee;
      delete temp.dmsProcess;
      delete temp.taskUpdatedBy;


      // if (storeLastupdatedTestDriveDetails?.reTestdriveFlag == "ReTestDrive") {

      //   temp.taskStatus = isClosedClicked ? "CLOSED" : "RESCHEDULED";

      
      //   reTestDrivePutCallWorkFlowHistory(temp, modifiedObj.taskId);
      // } else {
        postWorkFlowTaskHistory(temp)// need to call after we get response for getDetailsWrokflowTask
      // }

     
      setIschangeScreen(true);
    }


  }, [selector.get_workFlow_task_details_reTestDrive])
  

  const getTestDriveAppointmentDetailsFromServer = async () => {
    if (selector.task_details_response.entityModuleId) {
      const employeeData = await AsyncStore.getData(
        AsyncStore.Keys.LOGIN_EMPLOYEE
      );
      if (employeeData) {
        const jsonObj = JSON.parse(employeeData);
        const payload = {
          barnchId: selectedBranchId,
          orgId: jsonObj.orgId,
          entityModuleId: selector.task_details_response.entityModuleId,
        };
        dispatch(getTestDriveAppointmentDetailsApi(payload));
      }
    }
  };

  useEffect(() => {
    if (selector.test_drive_appointment_details_response) {
      let vehicleId =
        selector.test_drive_appointment_details_response.vehicleId;
      let varientId =
        selector.test_drive_appointment_details_response.varientId;

      if (selector.test_drive_appointment_details_response.vehicleInfo) {
        vehicleId =
          selector.test_drive_appointment_details_response.vehicleInfo
            .vehicleId;
        varientId =
          selector.test_drive_appointment_details_response.vehicleInfo
            .varientId;
        setVehicleDetails(
          selector.test_drive_appointment_details_response.vehicleInfo
        );
      }

      const selectedModel = selector.test_drive_vehicle_list.filter((item) => {
        return item.varientId === varientId && item.vehicleId === vehicleId;
      });
      vehicleId = selector.test_drive_appointment_details_response.vehicleId;
      if (selectedModel.length > 0) {
        const { fuelType, model, transmission_type, varientName, varientId } =
          selectedModel[0].vehicleInfo;

        setTimeout(() => {
          setSelectedVehicleDetails({
            varient: varientName,
            fuelType,
            model,
            transType: transmission_type,
            varientId,
            vehicleId,
          });
        }, 2000);
      }
      setIsRecordEditable(false);
      updateTaskDetails(selector.test_drive_appointment_details_response);
    }
  }, [selector.test_drive_appointment_details_response]);

  useEffect(() => {
    if (selector.task_details_response) {
      const taskStatus = selector.task_details_response.taskStatus;
      const taskName = selector.task_details_response.taskName;
      
      if (taskStatus === "SENT_FOR_APPROVAL" && taskName === "Test Drive" || taskName === "Re Test Drive") {
        setHandleActionButtons(4);
      } else if (
        taskStatus === "ASSIGNED" &&
        taskName === "Test Drive Approval"
      ) {
        setHandleActionButtons(3);
      } else if (taskStatus === "APPROVED" && taskName === "Test Drive" || taskName === "Re Test Drive") {
        setHandleActionButtons(4); //
        // todo manthan
      
        
      } else if (taskStatus === "CANCELLED") {
        //
        setHandleActionButtons(5);
      } else if (taskStatus === "ASSIGNED" && taskName === "Test Drive" || taskName === "Re Test Drive") {
        setHandleActionButtons(1);
      } 
      
      if (taskStatus === "RESCHEDULED" && taskName === "Test Drive" || taskName === "Re Test Drive") {
        setHandleActionButtons(4);
      } 
      
      if (taskStatus !== "ASSIGNED" && taskName === "Test Drive" || taskName === "Re Test Drive") {
        // call history counts and reasons API
        getReasonListData("Enquiry Followup")
        dispatch(getTestDriveHistoryCount(universalId))
        if (universalId) {
          setTimeout(() => {
            dispatch(getTestDriveHistoryDetails(universalId)) // history listing API    
          }, 1000);
         
        }
      }

      setSelectedDseDetails({
        name: selector.task_details_response.assignee?.empName,
        id: selector.task_details_response.assignee?.empId,
      });
      setIsRecordEditable(false);
      updateTaskDetails(selector.task_details_response);
    }
  }, [selector.task_details_response]);

  useEffect(() => {
    if (selector.drivers_list.length > 0 && selector.driverId !== "") {
      let tempDriver = [];
      tempDriver = selector.drivers_list.filter((item) => {
        return Number(item.id) === Number(selector.driverId);
      });
      if (tempDriver.length > 0) {
        setSelectedDriverDetails({
          name: tempDriver[0].name,
          id: tempDriver[0].id,
        });
      }
    }
  }, [selector.drivers_list, selector.driverId]);

  const updateTaskDetails = (taskDetailsObj) => {
    if (taskDetailsObj.vehicleInfo) {
      const vehicleInfo = taskDetailsObj.vehicleInfo;

      // Pending
      updateSelectedVehicleDetails(vehicleInfo, false);
    }

    const locationType = taskDetailsObj.location ? taskDetailsObj.location : "";
    setAddressType(locationType === "customer" ? 2 : 1);
    setCustomerAddress(taskDetailsObj.address ? taskDetailsObj.address : "");

    const driverId = taskDetailsObj.driverId || "";
    let driverName = "";

    if (selector.drivers_list.length > 0 && taskDetailsObj.driverId) {
      const filterAry = selector.drivers_list.filter(
        (object) => object.id === taskDetailsObj.driverId
      );
      if (filterAry.length > 0) {
        driverName = filterAry[0].name;
      }
    }
    setSelectedDriverDetails({ name: driverName, id: driverId });

    const customerHaveingDl = taskDetailsObj.isCustomerHaveingDl
      ? taskDetailsObj.isCustomerHaveingDl
      : false;
    if (customerHaveingDl) {
      const dataObj = { ...uploadedImagesDataObj };
      if (taskDetailsObj.dlFrontUrl) {
        dataObj.dlFrontUrl = {
          documentPath: taskDetailsObj.dlFrontUrl,
          fileName: "driving license front",
        };
      }
      if (taskDetailsObj.dlBackUrl) {
        dataObj.dlBackUrl = {
          documentPath: taskDetailsObj.dlBackUrl,
          fileName: "driving license back",
        };
      }
      setUploadedImagesDataObj({ ...dataObj });
    }
    setCustomerHavingDrivingLicense(customerHaveingDl ? 1 : 2);
  };

  const uploadSelectedImage = async (selectedPhoto, keyId) => {
    const photoUri = selectedPhoto.uri;
    if (!photoUri) {
      return;
    }

    const formData = new FormData();
    const fileType = photoUri.substring(photoUri.lastIndexOf(".") + 1);
    const fileNameArry = photoUri
      .substring(photoUri.lastIndexOf("/") + 1)
      .split(".");
    const fileName = fileNameArry.length > 0 ? fileNameArry[0] : "None";
    formData.append("file", {
      name: `${fileName}-.${fileType}`,
      type: `image/${fileType}`,
      uri: Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri,
    });
    formData.append("universalId", universalId);
    if (keyId === "DRIVING_LICENSE_FRONT") {
      formData.append("documentType", "dlFrontUrl");
    } else if (keyId === "DRIVING_LICENSE_BACK") {
      formData.append("documentType", "dlBackUrl");
    }
    let tempToken1 = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    await fetch(URL.UPLOAD_DOCUMENT(), {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + tempToken1,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          const dataObj = { ...uploadedImagesDataObj };
          dataObj[response.documentType] = response;
          setUploadedImagesDataObj({ ...dataObj });
        }
      })
      .catch((error) => {
        showToastRedAlert(
          error.message ? error.message : "Something went wrong"
        );
        console.error("error", error);
      });
  };

  const showDropDownModelMethod = (key, headerText) => {
    Keyboard.dismiss();

    switch (key) {
      case "MODEL":
        if (selector.test_drive_vehicle_list_for_drop_down.length === 0) {
          showToast("No Vehicles Found");
          return;
        }
        setDataForDropDown([...selector.test_drive_vehicle_list_for_drop_down]);
        break;
      case "VARIENT":
        if (varientListForDropDown.length === 0) {
          showToast("No Varients Found");
          return;
        }
        setDataForDropDown([...varientListForDropDown]);
        break;
      case "LIST_OF_DRIVERS":
        if (selector.drivers_list.length === 0) {
          showToast("No Driver List Found");
          return;
        }
        setDataForDropDown([...selector.drivers_list]);
        break;
    }
    setDropDownKey(key);
    setDropDownTitle(headerText);
    setShowDropDownModel(true);
  };

  const showDatePickerModelMethod = (key, mode) => {
    Keyboard.dismiss();

    // if (selectedVehicleDetails.vehicleId == 0) {
    //     showToast("Please select model");
    //     return;
    // }

    setDatePickerMode(mode);
    setDatePickerKey(key);
    setShowDatePickerModel(true);
  };

  const showImagePickerMethod = (key) => {
    Keyboard.dismiss();
    setImagePickerKey(key);
    setShowImagePicker(true);
  };

  const submitClicked = (status, taskName) => {
    // if (email.length === 0) {
    //     showToast("Please enter email");
    //     return;
    // }
    // if (!isEmail(email)) {
    //     showToast("Please enter valid email");
    //     return;
    // }
    setIsSubmitPress(true);
    if (!mobileNumber || mobileNumber.length === 0) {
      showToast("Please enter mobile number");
      return;
    }
    if (selectedVehicleDetails.model.length === 0) {
      showToast("Please select model");
      return;
    }

    if (selectedVehicleDetails.varient.length === 0) {
      showToast("Please select model");
      return;
    }

    if (
      selectedVehicleDetails.vehicleId === 0 ||
      selectedVehicleDetails.varientId === 0
    ) {
      showToast("Please select model & variant");
      return;
    }
    // if (selectedDriverDetails.name.length === 0) {
    //     showToast("Please select driver");
    //     return;
    // }

    if (selector.customer_preferred_date.length === 0) {
      showToast("Please select customer preferred date");
      return;
    }

    if (addressType === 0) {
      showToast("Please select address type");
      return;
    }

    if (customerHavingDrivingLicense === 0) {
      showToast("Please select customer having driving license");
      return;
    }

    if (
      selector.customer_preferred_time.length === 0 ||
      selector.actual_start_time.length === 0 ||
      selector.actual_end_time.length === 0
    ) {
      showToast("Please select time");
      return;
    }

    const preferredTime = moment(selector.customer_preferred_time, "HH:mm");
    const startTime = moment(selector.actual_start_time, "HH:mm");
    const endTime = moment(selector.actual_end_time, "HH:mm");

    let preferredTimeDiff = moment(preferredTime).diff(startTime, "m");
    let diff = moment(endTime).diff(startTime, "m");

    if (0 == preferredTimeDiff) {
      showToast(
        "Customer Preferred Time and Actual Start Time Should not be Equal"
      );
      return;
    } else if (0 > preferredTimeDiff) {
      showToast("Customer Preferred Should not be less than Actual Start Time");
      return;
    } else if (0 == diff) {
      showToast("Actual Start Time and Actual End Time Should not be Equal");
      return;
    } else if (0 > diff) {
      showToast("Actual End Time Should not be less than Actual Start Time");
      return;
    }

    const currentTime = new Date();
    const curettime = moment(currentTime, "HH:mm");
   
    let preferredTimeDiffwithCurrent = moment(preferredTime).diff(curettime, "m");
   
    // if (0 > preferredTimeDiffwithCurrent) {
    //   showToast("Customer preffered Time should be greater than Current Time.");
    //   return;
    // }
  
    const dateFormat = "DD/MM/YYYY";
    const currentDate = moment().add(0, "day").format(dateFormat)
    if (compare(selector.customer_preferred_date, currentDate) == 0) {
     
      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm"
      ).format("HH:mm:ss");

      let currentTime = new Date();
      
      if (selector.customer_preferred_time.length > 0) {
        const selectedTime = new Date(); // Current date
        const timeParts = selector.customer_preferred_time.split(":");

        // const hours = parseInt(timeParts[0], 10);
        // const minutes = parseInt(timeParts[1], 10);
        // const seconds =.parseInt(timeParts[2], 10);

        // selectedTime.setHours(hours);
        // selectedTime.setMinutes(minutes);
        // selectedTime.setSeconds(seconds);
        
        if (preferredTimeDiffwithCurrent < 0 ) {
          showToast("Customer preffered Time should be greater than Current Time.");
          return;
        }
        const selectedTime2 = moment(selector.customer_preferred_time, 'HH:mm');
        if (selectedTime2.isSame(currentTime, 'minute')) {
          showToast("Customer preffered Time should be greater than Current Time.");
          return;
        }
        // if (0 > preferredTimeDiffwithCurrent) {
        //   showToast("Customer preffered Time should be greater than Current Time.");
        //   return;
        // }
        // if (isTimeGreaterThanCurrent(selectedTime) == false) {
        //   showToast("Customer preffered Time should be greater than Current Time.");
        //   return;
        // }
      }
    }


    if (
      selectedVehicleDetails.vehicleId === 0 ||
      selectedVehicleDetails.varientId === 0
    ) {
      showToast("Please select model & variant");
      return;
    }

    let varientId = selectedVehicleDetails.varientId;
    let vehicleId = selectedVehicleDetails.vehicleId;
    // selector.test_drive_vehicle_list.forEach(element => {
    //   if (element.vehicleInfo.vehicleId == selectedVehicleDetails.vehicleId && element.vehicleInfo.varientId == selectedVehicleDetails.varientId) {
    //     varientId = element.vehicleInfo.varientId;
    //     vehicleId = selectedVehicleDetails.vehicleId;
    //   }
    // });
    if (!varientId || !vehicleId) return;

    const location = addressType === 1 ? "showroom" : "customer";

    if (customerHavingDrivingLicense === 1) {
      if (
        !uploadedImagesDataObj.dlFrontUrl ||
        !uploadedImagesDataObj.dlBackUrl
      ) {
        showToast("Please upload driving license front & back");
        return;
      }
    }
    const date = moment(selector.customer_preferred_date, "DD/MM/YYYY").format(
      "DD-MM-YYYY"
    );
    let prefferedTime = "";
    let actualStartTime = "";
    let actualEndTime = "";

    if (Platform.OS === "ios") {
      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm"
      ).format("HH:mm:ss");
      const startTime = moment(selector.actual_start_time, "HH:mm").format(
        "HH:mm:ss"
      );
      const endTime = moment(selector.actual_end_time, "HH:mm").format(
        "HH:mm:ss"
      );
      prefferedTime = date + " " + preffTime;
      actualStartTime = date + " " + startTime;
      actualEndTime = date + " " + endTime;
    } else {
      prefferedTime = date + " " + selector.customer_preferred_time;
      actualStartTime = date + " " + selector.actual_start_time;
      actualEndTime = date + " " + selector.actual_end_time;
    }
    setExpectedStartAndEndTime({ start: actualStartTime, end: actualEndTime });
    setTaskStatusAndName({ status: status, name: taskName });
    let appointmentObj;
    // const dateFormat = "DD/MM/YYYY";
    // const currentDate = moment().add(0, "day").format(dateFormat)
    if (status == "APPROVED" || status == "RESCHEDULED" ){
      
       appointmentObj = {
        address: customerAddress,
        branchId: selectedBranchId,
        customerHaveingDl: customerHavingDrivingLicense === 1,
        customerId: universalId,
        dseId: selectedDseDetails.id,
        location: location,
        orgId: userData.orgId,
        source: "ShowroomWalkin",
        startTime: actualStartTime,
        endTime: actualEndTime,
        testDriveDatetime: prefferedTime,
        testdriveId: 0,
         status: compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED",
        varientId: varientId,
        vehicleId: vehicleId,
        driverId: selectedDriverDetails.id.toString(),
        dlBackUrl: "",
        dlFrontUrl: "",
        vehicleInfo: vehicleDetails,
      };
    }else{
      appointmentObj = {
        address: customerAddress,
        branchId: selectedBranchId,
        customerHaveingDl: customerHavingDrivingLicense === 1,
        customerId: universalId,
        dseId: selectedDseDetails.id,
        location: location,
        orgId: userData.orgId,
        source: "ShowroomWalkin",
        startTime: actualStartTime,
        endTime: actualEndTime,
        testDriveDatetime: prefferedTime,
        testdriveId: 0,
        status: status,
        varientId: varientId,
        vehicleId: vehicleId,
        driverId: selectedDriverDetails.id.toString(),
        dlBackUrl: "",
        dlFrontUrl: "",
        vehicleInfo: vehicleDetails,
      };
    }

    let prefferedTimeV2 = "";
    if (Platform.OS === "ios") {
      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm:ss"
      ).format("HH:mm:ss");
    
      prefferedTimeV2 = date + " " + preffTime;
     
    } else {
      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm:ss"
      ).format("HH:mm:ss");
      prefferedTimeV2 = date + " " + preffTime;
    
    }
    
    let appointmentObjsavetestDrive = {
      address: customerAddress,
      branchId: selectedBranchId,
      customerHaveingDl: customerHavingDrivingLicense === 1,
      customerId: universalId,
      dseId: selectedDseDetails.id,
      location: location,
      orgId: userData.orgId,
      source: "ShowroomWalkin",
      startTime: moment.utc(startTime).format(),
      endTime: moment.utc(endTime).format(),
      testDriveDatetime: prefferedTimeV2,
      testdriveId: 0,
      // status: "APPROVED",
      status: compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED",
      varientId: varientId,
      vehicleId: vehicleId,
      driverId: selectedDriverDetails.id.toString(),
      dlBackUrl: "",
      dlFrontUrl: "",
      vehicleInfo: vehicleDetails,
      reTestdriveFlag: "Original",
      mobileNumber:mobileNumber,
      name: name,
      emailId: email,
      model: selectedVehicleDetails.model,
      variant: selectedVehicleDetails.varient,
      fuelType: selectedVehicleDetails.fuelType,
      transmissionType: selectedVehicleDetails.transType,
      driver:selectedDriverDetails.name,
      employee: selectedDseDetails.name,
        customerRemarks: customerRemarks,
        employeeRemarks: employeeRemarks,
        reason: selector.reason,
    };
    // todo manthan

    if (customerHavingDrivingLicense === 1) {
      appointmentObj.dlBackUrl = uploadedImagesDataObj.dlBackUrl.documentPath;
      appointmentObj.dlFrontUrl = uploadedImagesDataObj.dlFrontUrl.documentPath;

      appointmentObjsavetestDrive.dlBackUrl = uploadedImagesDataObj.dlBackUrl.documentPath;
      appointmentObjsavetestDrive.dlFrontUrl = uploadedImagesDataObj.dlFrontUrl.documentPath;
    }

    const payload = {
      appointment: appointmentObj,
    };
    // const payloadForsubmitApi = {
    //   appointment: appointmentObj,
    // };
    if (storeLastupdatedTestDriveDetails?.reTestdriveFlag !== "ReTestDrive"){
      dispatch(bookTestDriveAppointmentApi(payload));
    }
   
    if (status === "APPROVED") {
      dispatch(postReOpenTestDrive(appointmentObjsavetestDrive));
    }
    if (status === "RESCHEDULED"){
      reTestDrivePutCallupdateList("RESCHEDULED");
      setIsClosedClicked(false);
      submitRescheduleRemarks()

      if (storeLastupdatedTestDriveDetails?.reTestdriveFlag == "ReTestDrive") {
        let payloadForWorkFLow = {
          entityId: selector.task_details_response.entityId,
          taskName: "Re Test Drive"
        }
        // reTestDrivePutCallWorkFlowHistory() //need to call after we get response for getDetailsWrokflowTask
        // postWorkFlowTaskHistory()// need to call after we get response for getDetailsWrokflowTask
        dispatch(getDetailsWrokflowTask(payloadForWorkFLow)) //todo need to check and pass entityId
      }
    }
   

    // navigation.goBack()
  };

  function isTimeGreaterThanCurrent(selectedTime) {
    const currentTime = new Date();
    const selectedHour = selectedTime?.getHours();
    const selectedMinutes = selectedTime?.getMinutes();

    const currentHour = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();

    if (selectedHour > currentHour) {
      return true;
    } else if (selectedHour === currentHour && selectedMinutes > currentMinutes) {
      return true;
    }

    return false;
  }

  const closeTask = (from) => {
    setIsClosedClicked(true);
    setIsSubmitPress(true);
    setIsisReopenSubmitVisible(false)
    if (selectedVehicleDetails.model.length === 0) {
      showToast("Please select model");
      return;
    }

    // if (selectedDriverDetails.name.length === 0) {
    //     showToast("Please select driver");
    //     return;
    // }

    if (selector.customer_preferred_date.length === 0) {
      showToast("Please select customer preffered date");
      return;
    }

    if (addressType === 0) {
      showToast("Please select address type");
      return;
    }

    if (customerHavingDrivingLicense === 0) {
      showToast("Please select customer having driving license");
      return;
    }

    if (
      selector.customer_preferred_time.length === 0 ||
      selector.actual_start_time.length === 0 ||
      selector.actual_end_time.length === 0
    ) {
      showToast("Please select time");
      return;
    }

    if (
      selectedVehicleDetails.vehicleId === 0 ||
      selectedVehicleDetails.varientId === 0
    ) {
      showToast("Please select model & varient");
      return;
    }

    let varientId = selectedVehicleDetails.vehicleId;
    let vehicleId = selectedVehicleDetails.varientId;
    // selector.test_drive_vehicle_list.forEach(element => {
    //   if (element.vehicleInfo.vehicleId == selectedVehicleDetails.vehicleId && element.vehicleInfo.varientId == selectedVehicleDetails.varientId) {
    //     varientId = element.vehicleInfo.varientId;
    //     vehicleId = selectedVehicleDetails.vehicleId;
    //   }
    // });
    if (!varientId || !vehicleId) return;

    const location = addressType === 1 ? "showroom" : "customer";

    if (customerHavingDrivingLicense === 1) {
      if (
        !uploadedImagesDataObj.dlFrontUrl ||
        !uploadedImagesDataObj.dlBackUrl
      ) {
        showToast("Please upload driving license front & back");
        return;
      }
    }

    if (userData.isOtp === "Y") {
      generateOtpToCloseTask();
      if (from === "reopen") {
        setIschangeScreen(false)
        reSubmitClick("ASSIGNED", "Test Drive Approval")
      } else {
        setIschangeScreen(true)
      }
    } else {

      if (from === "reopen") {

        setIschangeScreen(true)

        reSubmitClick("ASSIGNED", "Test Drive Approval")
        setIsCloseSelected(false);
        isViewMode2("reopen")
        setIsisReopenSubmitVisible(true)
        return;
      } else {

        submitClicked("CLOSED", "Test Drive");

        // need to check in org with no otp configure 
        if (storeLastupdatedTestDriveDetails?.reTestdriveFlag == "ReTestDrive") {
          let payloadForWorkFLow = {
            entityId: selector.task_details_response.entityId,
            taskName: "Re Test Drive"
          }
          // reTestDrivePutCallWorkFlowHistory() //need to call after we get response for getDetailsWrokflowTask
          // postWorkFlowTaskHistory()// need to call after we get response for getDetailsWrokflowTask
          dispatch(getDetailsWrokflowTask(payloadForWorkFLow)) //todo need to check and pass entityId
        }
      }

    }
    reTestDrivePutCallupdateList("CLOSED");
    setIsCloseSelected(true);
  };

  // Handle Book Test drive appointment response
  useEffect(() => {
    if (selector.book_test_drive_appointment_response) {
      // yyyy-MM-dd'T'HH:mm:ssXXX YYYY-MM-DDThh:mm:ssTZD
      const startTime = moment(
        expectedStartAndEndTime.start,
        "DD-MM-YYYY HH:mm:ss"
      ).toISOString();
      const endTime = moment(
        expectedStartAndEndTime.end,
        "DD-MM-YYYY HH:mm:ss"
      ).toISOString();

      const dateFormat = "DD/MM/YYYY";
      const currentDate = moment().add(0, "day").format(dateFormat)
      if(taskStatusAndName.status == "APPROVED" || taskStatusAndName.status == "RESCHEDULED"){
        const payload = {
          universalId: universalId,
          taskId: null,
          remarks: "Success",
          universalModuleId:
            selector.book_test_drive_appointment_response.confirmationId,
          status: compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED",
          taskName: taskStatusAndName.name,
          expectedStarttime: startTime,
          expectedEndTime: endTime,
          taskUpdatedTime: convertDateStringToMillisecondsUsingMoment(
            `${selector.customer_preferred_date} ${selector.customer_preferred_time}`,
            "DD/MM/YYYY HH:mm"
          ),
          updatedDateTime: convertDateStringToMillisecondsUsingMoment(
            `${selector.customer_preferred_date} ${selector.customer_preferred_time}`,
            "DD/MM/YYYY HH:mm"
          ),
        };

        dispatch(updateTestDriveTaskApi(payload));
      }else{
        const payload = {
          universalId: universalId,
          taskId: null,
          remarks: "Success",
          universalModuleId:
            selector.book_test_drive_appointment_response.confirmationId,
          status: taskStatusAndName.status,
          taskName: taskStatusAndName.name,
          expectedStarttime: startTime,
          expectedEndTime: endTime,
          taskUpdatedTime: convertDateStringToMillisecondsUsingMoment(
            `${selector.customer_preferred_date} ${selector.customer_preferred_time}`,
            "DD/MM/YYYY HH:mm"
          ),
          updatedDateTime: convertDateStringToMillisecondsUsingMoment(
            `${selector.customer_preferred_date} ${selector.customer_preferred_time}`,
            "DD/MM/YYYY HH:mm"
          ),
        };

        dispatch(updateTestDriveTaskApi(payload));
      }
      
    }
  }, [selector.book_test_drive_appointment_response]);

  const autoApproveTestDrive = () => {
    submitClicked("APPROVED", "Test Drive Approval");
  };
  // Handle Update Test Drive Task response
  useEffect(() => {
    if (
      selector.test_drive_update_task_response === "success" &&
      taskStatusAndName.status === "SENT_FOR_APPROVAL"
    ) {
      autoApproveTestDrive();
      // showAlertMsg(true);
    } else if (
      selector.test_drive_update_task_response === "success" &&
      taskStatusAndName.status === "CANCELLED"
    ) {
      showCancelAlertMsg();
    } else if (
      selector.test_drive_update_task_response === "success" &&
      taskStatusAndName.status === "APPROVED"
    ) {
      setTimeout(() => {
        dispatch(getTaskDetailsApi(taskId));
      }, 1000);
      // displayStatusSuccessMessage();
    } else if (selector.test_drive_update_task_response === "failed") {
      showAlertMsg(false);
    } else if (
      selector.test_drive_update_task_response === "success" &&
      (taskStatusAndName.status === "RESCHEDULED" ||
        taskStatusAndName.status === "CLOSED")
    ) {
      displayStatusSuccessMessage();
    }
  }, [selector.test_drive_update_task_response, taskStatusAndName]);

  const displayStatusSuccessMessage = () => {
    Alert.alert(
      selector.test_drive_update_task_response,
      taskStatusAndName.status,
      [
        {
          text: "OK",
          onPress: () => {
            dispatch(clearState());
            if (fromScreen == "taskThreeSixty") {
              navigation.navigate(EmsTopTabNavigatorIdentifiers.leads, {
                fromScreen: "testDrive",
              });
            } else {
              navigation.popToTop();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  useEffect(() => {
    
    if (selector.put_workflow_task_history == "success"){
      displayStatusSuccessMessageRetestDrive();
    }
  
   
  }, [selector.put_workflow_task_history])
  

  const displayStatusSuccessMessageRetestDrive = () => {
    Alert.alert(
      "success",
      taskStatusAndName.status,
      [
        {
          text: "OK",
          onPress: () => {
            dispatch(clearState());
            if (fromScreen == "taskThreeSixty") {
              navigation.navigate(EmsTopTabNavigatorIdentifiers.leads, {
                fromScreen: "testDrive",
              });
            } else {
              navigation.popToTop();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const showAlertMsg = (isSucess) => {
    let message = isSucess
      ? "TestDrive Appointment has sent for approval"
      : "TestDrive Appointment has failed";
    Alert.alert(
      "",
      message,
      [
        {
          text: "OK",
          onPress: () => {
            dispatch(clearState());
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const showCancelAlertMsg = () => {
    let message = "TestDrive Appointment has cancelled";
    Alert.alert(
      "",
      message,
      [
        {
          text: "OK",
          onPress: () => {
            dispatch(clearState());
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const validateSelectedDateForTestDrive = async (selectedDate) => {
    const date = convertToDate(selectedDate, "DD/MM/YYYY");
    const payload = {
      date: date,
      vehicleId: selectedVehicleDetails.vehicleId,
    };
    dispatch(validateTestDriveApi(payload));
  };

  // Handle Test drive date validation response
  useEffect(() => {
    if (selector.test_drive_date_validate_response) {
      if (selector.test_drive_date_validate_response.status === "SUCCESS") {
        showToast(selector.test_drive_date_validate_response.statusDescription);
      } else {
        //this.setState({ mtDate: new Date() })
      }
    }
  }, [selector.test_drive_date_validate_response]);

  const updateSelectedVehicleDetails = (vehicleInfo, fromVarient) => {
    //Update Varient List
    if (selector.test_drive_varients_obj_for_drop_down[vehicleInfo.model]) {
      const varientsData =
        selector.test_drive_varients_obj_for_drop_down[vehicleInfo.model];
      setVarientListForDropDown(varientsData);
    }
    setSelectedVehicleDetails({
      model: vehicleInfo.model,
      varient: fromVarient ? vehicleInfo.varientName : "",
      fuelType: fromVarient ? vehicleInfo.fuelType : "",
      transType: fromVarient ? vehicleInfo.transmission_type : "",
      // fuelType: vehicleInfo.fuelType || "",
      // transType: vehicleInfo.transmission_type || "",
      // vehicleId: vehicleInfo.vehicleId,
      vehicleId: fromVarient ? vehicleInfo.vehicleId : "",
      varientId: fromVarient ? vehicleInfo.varientId : "",
    });
  };

  const deteleButtonPressed = (from) => {
    const imagesDataObj = { ...uploadedImagesDataObj };
    switch (from) {
      case "DLFRONTURL":
        delete imagesDataObj.dlFrontUrl;
        break;
      case "DLBACKURL":
        delete imagesDataObj.dlBackUrl;
        break;
      default:
        break;
    }
    setUploadedImagesDataObj({ ...imagesDataObj });
  };

  const DisplaySelectedImage = ({ fileName, from }) => {
    return (
      <View style={styles.selectedImageBckVw}>
        <Text style={styles.selectedImageTextStyle}>{fileName}</Text>
        <IconButton
          icon="close-circle-outline"
          color={Colors.RED}
          style={{ padding: 0, margin: 0 }}
          size={15}
          onPress={() => deteleButtonPressed(from)}
        />
      </View>
    );
  };

  const generateOtpToCloseTask = () => {
    if (!mobileNumber) {
      showToastRedAlert("No mobile found");
      return;
    }

    const payload = {
      mobileNo: "91" + mobileNumber,
      message: null,
    };
    dispatch(generateOtpApi(payload));
  };

  const resendClicked = () => {
    generateOtpToCloseTask();
  };

  function compare(dateTimeA, dateTimeB) {
    var momentA = moment(dateTimeA, "DD/MM/YYYY");
    var momentB = moment(dateTimeB, "DD/MM/YYYY");
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
  }
  const reSubmitClick = (status, taskName) => {
    // call API here 

    setIsisReopenSubmitVisible(false)
    setIsSubmitPress(true);
    if (!mobileNumber || mobileNumber.length === 0) {
      showToast("Please enter mobile number");
      return;
    }

    if (selectedVehicleDetails.model.length === 0) {
      showToast("Please select model");
      return;
    }

    if (selectedVehicleDetails.varient.length === 0) {
      showToast("Please select model");
      return;
    }

    if (
      selectedVehicleDetails.vehicleId === 0 ||
      selectedVehicleDetails.varientId === 0
    ) {
      showToast("Please select model & variant");
      return;
    }
    // if (selectedDriverDetails.name.length === 0) {
    //     showToast("Please select driver");
    //     return;
    // }

    if (selector.customer_preferred_date.length === 0) {
      showToast("Please select customer preferred date");
      return;
    }
    const dateFormat = "DD/MM/YYYY";
    const currentDate = moment().add(0, "day").format(dateFormat)

    // conditon to show error for date older then today 
    if (compare(selector.customer_preferred_date, currentDate) === -1) {
      showToast("Please select customer preferred date greater than today's date");
      return;
    }

    if (addressType === 0) {
      showToast("Please select address type");
      return;
    }

    if (customerHavingDrivingLicense === 0) {
      showToast("Please select customer having driving license");
      return;
    }

    if (
      selector.customer_preferred_time.length === 0 ||
      selector.actual_start_time.length === 0 ||
      selector.actual_end_time.length === 0
    ) {
      showToast("Please select time");
      return;
    }

    // const dateFormat = "DD/MM/YYYY";
    // const currentDate = moment().add(0, "day").format(dateFormat)
    

    const preferredTime = moment(selector.customer_preferred_time, "HH:mm");
    const startTime = moment(selector.actual_start_time, "HH:mm");
    const endTime = moment(selector.actual_end_time, "HH:mm");

    let preferredTimeDiff = moment(preferredTime).diff(startTime, "m");
    let diff = moment(endTime).diff(startTime, "m");

    if (0 == preferredTimeDiff) {
      showToast(
        "Customer Preferred Time and Actual Start Time Should not be Equal"
      );
      return;
    } else if (0 > preferredTimeDiff) {
      showToast("Customer Preferred Should not be less than Actual Start Time");
      return;
    } else if (0 == diff) {
      showToast("Actual Start Time and Actual End Time Should not be Equal");
      return;
    } else if (0 > diff) {
      showToast("Actual End Time Should not be less than Actual Start Time");
      return;
    }
    const currentTime = new Date();
    const curettime = moment(currentTime, "HH:mm");

    let preferredTimeDiffwithCurrent = moment(preferredTime).diff(curettime, "m");

    // if (0 > preferredTimeDiffwithCurrent) {
    //   showToast("Customer preffered Time should be greater than Current Time.");
    //   return;
    // }
    if (compare(selector.customer_preferred_date, currentDate) == 0) {

      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm"
      ).format("HH:mm:ss");

      let currentTime = new Date();

      if (selector.customer_preferred_time.length > 0) {
        const selectedTime = new Date(); // Current date
        const timeParts = selector.customer_preferred_time.split(":");

        // const hours = parseInt(timeParts[0], 10);
        // const minutes = parseInt(timeParts[1], 10);
        // const seconds = parseInt(timeParts[2], 10);

        // selectedTime.setHours(hours);
        // selectedTime.setMinutes(minutes);
        // selectedTime.setSeconds(seconds);

        if (preferredTimeDiffwithCurrent < 0) {
          showToast("Customer preffered Time should be greater than Current Time.");
          return;
        }
        const selectedTime2 = moment(selector.customer_preferred_time, 'HH:mm');
        if (selectedTime2.isSame(currentTime, 'minute')) {
          showToast("Customer preffered Time should be greater than Current Time.");
          return;
        }
        // if (0 > preferredTimeDiffwithCurrent) {
        //   showToast("Customer preffered Time should be greater than Current Time.");
        //   return;
        // }
        // if (isTimeGreaterThanCurrent(selectedTime) == false) {
        //   showToast("Customer preffered Time should be greater than Current Time.");
        //   return;
        // }
      }
    }
   

    if (
      selectedVehicleDetails.vehicleId === 0 ||
      selectedVehicleDetails.varientId === 0
    ) {
      showToast("Please select model & variant");
      return;
    }

    let varientId = selectedVehicleDetails.varientId;
    let vehicleId = selectedVehicleDetails.vehicleId;
    // selector.test_drive_vehicle_list.forEach(element => {
    //   if (element.vehicleInfo.vehicleId == selectedVehicleDetails.vehicleId && element.vehicleInfo.varientId == selectedVehicleDetails.varientId) {
    //     varientId = element.vehicleInfo.varientId;
    //     vehicleId = selectedVehicleDetails.vehicleId;
    //   }
    // });
    if (!varientId || !vehicleId) return;

    const location = addressType === 1 ? "showroom" : "customer";

    if (customerHavingDrivingLicense === 1) {
      if (
        !uploadedImagesDataObj.dlFrontUrl ||
        !uploadedImagesDataObj.dlBackUrl
      ) {
        showToast("Please upload driving license front & back");
        return;
      }
    }
    const date = moment(selector.customer_preferred_date, "DD/MM/YYYY").format(
      "DD-MM-YYYY"
    );
    let prefferedTime;
    let actualStartTime;
    let actualEndTime;

    if (Platform.OS === "ios") {
      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm:ss"
      ).format("HH:mm:ss");
      const startTime = moment(selector.actual_start_time, "HH:mm").format(
        "HH:mm:ss"
      );
      const endTime = moment(selector.actual_end_time, "HH:mm").format(
        "HH:mm:ss"
      );
      prefferedTime = date + " " + preffTime;
      actualStartTime = date + " " + startTime;
      actualEndTime = date + " " + endTime;
    } else {
      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm:ss"
      ).format("HH:mm:ss");
      prefferedTime = date + " " + preffTime;
      actualStartTime = date + " " + selector.actual_start_time;
      actualEndTime = date + " " + selector.actual_end_time;
    }

    setExpectedStartAndEndTime({ start: actualStartTime, end: actualEndTime });
    setTaskStatusAndName({ status: status, name: taskName });


    let reopenSubmitObj = {
      id: taskId,
      address: customerAddress,
      allotmentId: 0,
      branchId: selectedBranchId,
      canceledBy: "",
      customerDropDatetime: "",
      customerId: universalId,
      customerPickupDatetime: "",
      customerQuery: "",
      datetime: "",
      dlBackUrl: "",
      dlFrontUrl: "",
      dseId: "",
      startTime: moment.utc(startTime).format(),
      endTime: moment.utc(endTime).format(),
      latitude: "",
      longitude: "",
      location: location,
      managerApprovedDatetime: "",
      managerId: "",
      orgId: userData.orgId,
      securityInId: "",
      securityOutId: "",
      source: taskData.sourceType,
      status: compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED",
      // status: compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED",
      testDriveDatetime: prefferedTime,
      // testDriveDatetime: prefferedTime,
      varientId: varientId,
      vehicleId: vehicleId,
      driverId: selectedDriverDetails.id.toString(),
      testdriveId: 0,
      customerHaveingDl: customerHavingDrivingLicense === 1,
      reTestdriveFlag: "ReTestDrive",
      mobileNumber: mobileNumber,
      name: name,
      emailId: email,
      model: selectedVehicleDetails.model,
      variant: selectedVehicleDetails.varient,
      fuelType: selectedVehicleDetails.fuelType,
      transmissionType: selectedVehicleDetails.transType,
      driver: selectedDriverDetails.name,
      employee: selectedDseDetails.name,
      customerRemarks: customerRemarks,
      employeeRemarks: employeeRemarks,
      reason: selector.reason,
    }
    

    dispatch(postReOpenTestDrive(reopenSubmitObj));

    if (storeLastupdatedTestDriveDetails?.reTestdriveFlag == "ReTestDrive"){
      let payloadForWorkFLow = {
        entityId: selector.task_details_response.entityId,
        taskName: "Re Test Drive"
      }
      // reTestDrivePutCallWorkFlowHistory() //need to call after we get response for getDetailsWrokflowTask
      // postWorkFlowTaskHistory()// need to call after we get response for getDetailsWrokflowTask
      dispatch(getDetailsWrokflowTaskReTestDrive(payloadForWorkFLow)) //todo need to check and pass entityId
    // setIschangeScreen(true)

    }else{
      let payloadForWorkFLow = {
        entityId: selector.task_details_response.entityId,
        taskName: "Test Drive"
      }
      // reTestDrivePutCallWorkFlowHistory() //need to call after we get response for getDetailsWrokflowTask
      // postWorkFlowTaskHistory()// need to call after we get response for getDetailsWrokflowTask
      dispatch(getDetailsWrokflowTask(payloadForWorkFLow)) //todo need to check and pass entityId
    // setIschangeScreen(true)

    }
    
   
  }
  
  const postWorkFlowTaskHistory = (payload)=>{
    // let payload = {

    //   "customerRemarks": null,
    //   "employeeRemarks": null,
    //   "errorDetail": null,
    //   "executionJob": "NULL",
    //   "isError": null,
    //   "isLastTask": false,
    //   "isMandatoryTask": false,
    //   "entityStatus": null,
    //   "reason": null,
    //   "repeatTask": null,
    //   "taskActualEndTime": null,
    //   "taskActualStartTime": 1682766855000,
    //   "taskCreatedTime": "", // send the time at that moment
    //   "taskExpectedEndTime": 1682939646000,
    //   "taskExpectedStartTime": 1682939646000,
    //   "taskName": "Test Drive",
    //   "entityName": "Werewr Er",
    //   "taskSequence": 4,
    //   "taskStatus": "",   //By Submit = "Approved",Reschedule ="Reschedule" update the status on customerpreeferdate
    //   "taskType": "Manual",
    //   "taskUpdatedTime": "", // send the time at that moment
    //   "triggerType": "NULL",
    //   "universalId": "18-287-057c88d6-73bd-4adb-9bf6-f99b0e7f32d2",
    //   "isParallelTask": true,
    //   "dmsProcess": 453914,
    //   "assignee": 935,
    //   "dmsTaskDef": 310,
    //   "entityId": 56946,
    //   "taskStageStatus": null,
    //   "dmsTaskCategory": 82,
    //   "entityModuleId": "9555",
    //   "reTask": "Y",
    //   "taskUpdatedBy": null,
    //   "lat": null,
    //   "lon": null,
    //   "taskIdRef": 1617945,
    // }
    dispatch(postDetailsWorkFlowTask(payload))
  }

  useEffect(() => {

    if (selector.reopen_test_drive_res_status === "successs" || selector.post_workFlow_task_details == "success") {
      if (ischangeScreen) {
        navigation.pop(2);
      }
    }

  }, [selector.reopen_test_drive_res_status, selector.post_workFlow_task_details == "success"])

  useEffect(() => {
    // if (route?.params?.taskStatus === "CLOSED"){

    if (selector.test_drive_history_count_statu === "successs") {

      navigation.setOptions({
        headerRight: () => <TestDriveHistoryIcon navigation={navigation} />,
      })
    }


    // }

  }, [selector.test_drive_history_count_statu])


  // useEffect(() => {
  //   if (route?.params?.taskStatus === "CLOSED" &&
  //     !isReopenSubmitVisible &&
  //     !isCloseSelected) {
  //         if (universalId) {
  //           dispatch(getTestDriveHistoryDetails(universalId))
  //         }
  //       // todo manthan
  //     }
  
  // }, [isCloseSelected, isReopenSubmitVisible, route?.params?.taskStatus])
  
  const reTestDrivePutCallWorkFlowHistory = (payload,id)=>{



    let masterPayload = {
      body: payload,
      recordid: id
    }
    
    dispatch(putWorkFlowHistory(masterPayload)); // need to add recordid

  }

  const reTestDrivePutCallupdateList = (status) => {

    const date = moment(selector.customer_preferred_date, "DD/MM/YYYY").format(
      "DD-MM-YYYY"
    );
    let prefferedTime = "";
    // let actualStartTime = "";
    // let actualEndTime = "";

    if (Platform.OS === "ios") {
      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm:ss"
      ).format("HH:mm:ss");
      // const startTime = moment(selector.actual_start_time, "HH:mm").format(
      //   "HH:mm:ss"
      // );
      // const endTime = moment(selector.actual_end_time, "HH:mm").format(
      //   "HH:mm:ss"
      // );
      prefferedTime = date + " " + preffTime;
      // actualStartTime = date + " " + startTime;
      // actualEndTime = date + " " + endTime;
    } else {
      const preffTime = moment(
        selector.customer_preferred_time,
        "HH:mm:ss"
      ).format("HH:mm:ss");
      prefferedTime = date + " " + preffTime;
      // actualStartTime = date + " " + selector.actual_start_time;
      // actualEndTime = date + " " + selector.actual_end_time;
    }
    const dateFormat = "DD/MM/YYYY";
    const currentDate = moment().add(0, "day").format(dateFormat)
    // const preferredTime = moment(selector.customer_preferred_time, "HH:mm");
    const startTime = moment(selector.actual_start_time, "HH:mm");
    const endTime = moment(selector.actual_end_time, "HH:mm");
    const location = addressType === 1 ? "showroom" : "customer";
    let varientId = selectedVehicleDetails.varientId;
    let vehicleId = selectedVehicleDetails.vehicleId;
    
    if (!varientId || !vehicleId) return;
    let retestflag = storeLastupdatedTestDriveDetails?.reTestdriveFlag == "ReTestDrive" ? "ReTestDrive" : "Original";

    let payload = {
      "address": customerAddress,
      "allotmentId": 0,
      "branchId": selectedBranchId,
      "canceledBy": null,
      "customerDropDatetime": null,
      "customerId": universalId,
      "customerPickupDatetime": null,
      "customerQuery": null,
      "datetime": null,
      "dlBackUrl": "",
      "dlFrontUrl": "",
      "dseId": selectedDseDetails.id,
      "endTime": moment(endTime).valueOf(),
      "latitude": null,
      "location": location,
      "longitude": null,
      "managerApprovedDatetime": null,
      "managerId": null,
      "orgId": userData.orgId,
      "securityInId": null,
      "securityOutId": null,
      "source": "ShowroomWalkin",
      "startTime": moment(startTime).valueOf(),
      "status": status,
      "testDriveDatetime": prefferedTime,
      "varientId": varientId,
      "vehicleId": vehicleId,
      "driverId": selectedDriverDetails.id.toString(),
      "testdriveId": 0,
      "reTestdriveFlag": retestflag,
      "customerHaveingDl": customerHavingDrivingLicense === 1,
      "mobileNumber": mobileNumber,
      "name": name,
      "emailId": email,
      "model": selectedVehicleDetails.model,
      "variant": selectedVehicleDetails.varient,
      "fuelType": selectedVehicleDetails.fuelType,
      "transmissionType": selectedVehicleDetails.transType,
      "driver": selectedDriverDetails.name,
      "employee": selectedDseDetails.name
    }
    

    let masterPayload ={
      body: payload,
      recordid:storeLastupdatedTestDriveId
    }
    // dispatch(PutUpdateListTestDriveHistory(masterPayload)); // commented as last moment changes asked by ranjith
    // todo manthan 

    if (status == "CLOSED"){
      let reopenSubmitObj = {
        id: taskId,
        address: customerAddress,
        allotmentId: 0,
        branchId: selectedBranchId,
        canceledBy: "",
        customerDropDatetime: "",
        customerId: universalId,
        customerPickupDatetime: "",
        customerQuery: "",
        datetime: "",
        dlBackUrl: "",
        dlFrontUrl: "",
        dseId: "",
        startTime: moment.utc(startTime).format(),
        endTime: moment.utc(endTime).format(),
        latitude: "",
        longitude: "",
        location: location,
        managerApprovedDatetime: "",
        managerId: "",
        orgId: userData.orgId,
        securityInId: "",
        securityOutId: "",
        source: taskData.sourceType,
        status: "CLOSED",
        // status: compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED",
        testDriveDatetime: prefferedTime,
        // testDriveDatetime: prefferedTime,
        varientId: varientId,
        vehicleId: vehicleId,
        driverId: selectedDriverDetails.id.toString(),
        testdriveId: 0,
        customerHaveingDl: customerHavingDrivingLicense === 1,
        reTestdriveFlag: retestflag,
        mobileNumber: mobileNumber,
        name: name,
        emailId: email,
        model: selectedVehicleDetails.model,
        variant: selectedVehicleDetails.varient,
        fuelType: selectedVehicleDetails.fuelType,
        transmissionType: selectedVehicleDetails.transType,
        driver: selectedDriverDetails.name,
        employee: selectedDseDetails.name,
        customerRemarks: customerRemarks,
        employeeRemarks: employeeRemarks,
        reason: selector.reason,
      }


      dispatch(postReOpenTestDriveV2(reopenSubmitObj));
    }else{
      let reopenSubmitObj = {
        id: taskId,
        address: customerAddress,
        allotmentId: 0,
        branchId: selectedBranchId,
        canceledBy: "",
        customerDropDatetime: "",
        customerId: universalId,
        customerPickupDatetime: "",
        customerQuery: "",
        datetime: "",
        dlBackUrl: "",
        dlFrontUrl: "",
        dseId: "",
        startTime: moment.utc(startTime).format(),
        endTime: moment.utc(endTime).format(),
        latitude: "",
        longitude: "",
        location: location,
        managerApprovedDatetime: "",
        managerId: "",
        orgId: userData.orgId,
        securityInId: "",
        securityOutId: "",
        source: taskData.sourceType,
        status: compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED",
        // status: compare(selector.customer_preferred_date, currentDate) == 0 ? "APPROVED" : "RESCHEDULED",
        testDriveDatetime: prefferedTime,
        // testDriveDatetime: prefferedTime,
        varientId: varientId,
        vehicleId: vehicleId,
        driverId: selectedDriverDetails.id.toString(),
        testdriveId: 0,
        customerHaveingDl: customerHavingDrivingLicense === 1,
        reTestdriveFlag: retestflag,
        mobileNumber: mobileNumber,
        name: name,
        emailId: email,
        model: selectedVehicleDetails.model,
        variant: selectedVehicleDetails.varient,
        fuelType: selectedVehicleDetails.fuelType,
        transmissionType: selectedVehicleDetails.transType,
        driver: selectedDriverDetails.name,
        employee: selectedDseDetails.name,
        customerRemarks: customerRemarks,
        employeeRemarks: employeeRemarks,
        reason: selector.reason,
      }


      dispatch(postReOpenTestDriveV2(reopenSubmitObj));
    }

    

  }



  const TestDriveHistoryIcon = ({ navigation }) => {
    return (


      <View style={{ flexDirection: 'row', alignItems: "center" }}>

        <IconButton
          style={{ marginEnd: 15 }}
          icon="history"
          color={Colors.WHITE}
          size={30}
          onPress={() =>
            navigation.navigate("TEST_HISTORY", {
              universalId: universalId,

            })

          }
        />


        <Text style={{ fontSize: 16, color: Colors.PINK, fontWeight: "bold", position: "absolute", top: 9, right: 10, }}>{selector.test_drive_history_count}</Text>
      </View>

    );
  };


  const verifyClicked = async () => {
    if (otpValue.length != 4) {
      showToastRedAlert("Please enter valid OTP");
      return;
    }

    if (!mobileNumber) {
      showToastRedAlert("No mobile found");
      return;
    }

    const payload = {
      mobileNo: "91" + mobileNumber,
      sessionKey: selector.otp_session_key,
      otp: otpValue,
    };
    dispatch(validateOtpApi(payload));
  };

  useEffect(() => {
    if (selector.validate_otp_response_status === "successs") {
      dispatch(clearOTP());
      if (storeLastupdatedTestDriveDetails?.reTestdriveFlag == "ReTestDrive"){
     
        let payloadForWorkFLow = {
          entityId: selector.task_details_response.entityId,
          taskName: "Re Test Drive"
        }
        // reTestDrivePutCallWorkFlowHistory() //need to call after we get response for getDetailsWrokflowTask
        // postWorkFlowTaskHistory()// need to call after we get response for getDetailsWrokflowTask
        dispatch(getDetailsWrokflowTask(payloadForWorkFLow)) //todo need to check and pass entityId
      

      }else{
        submitClicked("CLOSED", "Test Drive");  
      }
      
    }
  }, [selector.validate_otp_response_status]);

  const reOpenTask = () => {
    isViewMode2("reopen")
    setIsisReopenSubmitVisible(true)
  }
  const isViewMode = () => {
    if (route?.params?.taskStatus === "CLOSED") {
      return true;
    }
    return false;
  }

  const isViewMode2 = (from) => {
    // todo 
    setIsValuesEditable(false)
    // if(from ==="reopen"){
    //   setIsValuesEditable(false)


    // }else{
    //   if (route?.params?.taskStatus === "CLOSED") {
    //     setIsValuesEditable(true)
    //     // return true;
    //   } else {
    //     setIsValuesEditable(false)
    //   }
    // }

  };

  const onDropDownClear = (key) => {
    if (key) {
      setSelectedDriverDetails({ name: "", id: "" });
    }
  };

  const submitRescheduleRemarks = () =>{

    if (employeeRemarks === "" || selector.reason === "" || customerRemarks === "") {
      setIsSubmitPressRescheduleModal(true)
      return
    }

    let payload = {
      "orgId": userData.orgId,
      "customerId":universalId,
      "customerRemarks": customerRemarks,
      "employeeRemarks": employeeRemarks,
      "reason": selector.reason,
      "createdBy": userData.employeeId
    }
    
    dispatch(saveReScheduleRemark(payload))
  }

  const renderShowRecheduleModal = () => {

    return (<>
      <Modal
        animationType="fade"
        visible={isRechduleModalVisible}
        onRequestClose={() => {
          setImagePath("");
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
            width: "90%",
            backgroundColor: Colors.LIGHT_GRAY,
            padding: 10,
            borderWidth: 2,
            borderColor: Colors.BLACK,
            flexDirection: "column",
            // height: 300
          }}>
            <View style={{ position: "relative" }}>
              {selector.reason !== "" && (
                <View
                  style={{
                    position: "absolute",
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
                disable={isViewMode()}
                style={[styles.dropdownContainer]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={reasonList}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Reason*"}
                searchPlaceholder="Search..."
                value={defaultReasonIndex}
                // onFocus={() => setIsFocus(true)}
                // onBlur={() => setIsFocus(false)}
                onChange={(val) => {
                  dispatch(updateSelectedScheduledata({
                    key: "REASON",
                    text: val.value,
                  }))
                  // dispatch(
                  //   setEnquiryFollowUpDetails({
                  //     key: "REASON",
                  //     text: val.value,
                  //   })
                  // );
                }}
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPressRescheduleModal && selector.reason === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              ></Text>
            </View>
            <TextinputComp
              style={styles.textInputStyle}
              value={customerRemarks}
              label={"Customer Remarks*"}
              // maxLength={10}
              keyboardType={"default"}
              disabled={isValuesEditable}
              onChangeText={(text) => setCustomerRemarks(text)}
            />
            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPressRescheduleModal && customerRemarks === ""
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            ></Text>
            <TextinputComp
              style={styles.textInputStyle}
              value={employeeRemarks}
              label={"Employee Remarks*"}
              // maxLength={10}
              keyboardType={"default"}
              disabled={isValuesEditable}
              onChangeText={(text) => setEmployeeRemarks(text)}
            />
            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPressRescheduleModal && employeeRemarks === ""
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            ></Text>
            <View style={{ flexDirection: "row", height: 40, justifyContent: "space-between", marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  // position: "absolute",
                  // left: "37%",
                  // bottom: "15%",
                  borderRadius: 5,
                  backgroundColor: Colors.BLACK,
                }}
                onPress={() => {
                  setIsRescheduleModalVisible(false)
                  setCustomerRemarks("")
                  setEmployeeRemarks("")
                  setDefaultReasonIndex(null)
                  dispatch(updateSelectedScheduledata({
                    key: "REASON",
                    text: "",
                  }))
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: Colors.WHITE }}
                >
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  // position: "absolute",
                  // left: "37%",
                  // bottom: "15%",
                  borderRadius: 5,
                  backgroundColor: Colors.RED,
                }}
                onPress={() => {
                  // if (selector.task_details_response.taskStatus === "APPROVED" || selector.task_details_response.taskStatus === "ASSIGNED"){
                    // todo manthan
                    submitClicked("RESCHEDULED", "Test Drive") // API for reschdule existing flow

                  // }else{
                    // if (storeLastupdatedTestDriveDetails?.reTestdriveFlag == "ReTestDrive") {
                      // setIsClosedClicked(false);
                      // submitClicked("RESCHEDULED", "Test Drive")
                  // reTestDrivePutCallupdateList("RESCHEDULED"); // commented to aviod calling if any validations fails
                    // }
                  
                    // submitRescheduleRemarks()
                  // }
                  
                  setIsRescheduleModalVisible(false)
                }
                }
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: Colors.WHITE }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </Modal>


    </>)
  }

  return (
    <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
      <ImagePickerComponent
        visible={showImagePicker}
        keyId={imagePickerKey}
        selectedImage={(data, keyId) => {
          uploadSelectedImage(data, keyId);
          setShowImagePicker(false);
        }}
        onDismiss={() => setShowImagePicker(false)}
      />

      <DropDownComponant
        visible={showDropDownModel}
        headerTitle={dropDownTitle}
        data={dataForDropDown}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          if (dropDownKey === "MODEL") {
            updateSelectedVehicleDetails(item, false);
          }
          if (dropDownKey === "VARIENT") {
            updateSelectedVehicleDetails(item, true);
          }
          if (dropDownKey === "LIST_OF_DRIVERS") {
            setSelectedDriverDetails({ name: item.name, id: item.id });
          }
          setShowDropDownModel(false);
        }}
      />

      <DatePickerComponent
        visible={showDatePickerModel}
        mode={datePickerMode}
        minimumDate={new Date(Date.now())}
        maximumDate={date}
        value={new Date(Date.now())}
        onChange={(event, selectedDate) => {
          setShowDatePickerModel(false);

          let formatDate = "";
          if (selectedDate) {
            if (datePickerMode === "date") {
              formatDate = convertToDate(selectedDate);
              validateSelectedDateForTestDrive(selectedDate);
            } else {
              if (Platform.OS === "ios") {
                formatDate = convertToTime(selectedDate);
              } else {
                formatDate = convertToTime(selectedDate);
              }
            }
          }

          if (Platform.OS === "android") {
            if (selectedDate) {
              dispatch(
                updateSelectedDate({ key: datePickerKey, text: formatDate })
              );
            }
          } else {
            dispatch(
              updateSelectedDate({ key: datePickerKey, text: formatDate })
            );
          }
        }}
        onRequestClose={() => setShowDatePickerModel(false)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >
        {/* // 1. Test Drive */}
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, marginBottom: 20 }}
          keyboardShouldPersistTaps={"handled"}
          style={{ flex: 1 }}
        >
        
          <View style={styles.baseVw}>
            {/* // 1.Test Drive */}
            <View
              style={[
                styles.accordianBckVw,
                GlobalStyle.shadow,
                { backgroundColor: "white" },
              ]}
            >
              <TextinputComp
                style={styles.textInputStyle}
                value={name}
                label={"Name*"}
                disabled={isValuesEditable}
                onChangeText={(text) => setName(text)}
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && name === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              ></Text>
              <TextinputComp
                style={styles.textInputStyle}
                value={email}
                label={"Email ID"}
                keyboardType={"email-address"}
                disabled={isValuesEditable}
                onChangeText={(text) => setEmail(text)}
              />
              <Text style={[GlobalStyle.underline]}></Text>
              <TextinputComp
                style={styles.textInputStyle}
                value={mobileNumber}
                label={"Mobile Number*"}
                maxLength={10}
                keyboardType={"phone-pad"}
                disabled={isValuesEditable}
                onChangeText={(text) => setMobileNumber(text)}
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && !mobileNumber
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              ></Text>

              <DropDownSelectionItem
                label={"Model*"}
                value={
                  selectedVehicleDetails.model
                    ? selectedVehicleDetails.model
                    : ""
                }
                // disabled={!isRecordEditable}
                disabled={isValuesEditable}
                onPress={() => showDropDownModelMethod("MODEL", "Model")}
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selectedVehicleDetails.vehicleId === 0
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              ></Text>
              <DropDownSelectionItem
                label={"Varient*"}
                value={
                  selectedVehicleDetails.varient
                    ? selectedVehicleDetails.varient
                    : ""
                }
                // disabled={!isRecordEditable}
                disabled={isValuesEditable}
                onPress={() => showDropDownModelMethod("VARIENT", "Varient")}
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selectedVehicleDetails.varientId === 0
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              ></Text>
              <TextinputComp
                style={styles.textInputStyle}
                label={userData.isSelfManager == "Y" ? "Range" : "Fuel Type"}
                value={selectedVehicleDetails.fuelType}
                editable={false}
                disabled={true}
              />
              <Text style={GlobalStyle.underline}></Text>

              <TextinputComp
                style={styles.textInputStyle}
                label={
                  userData.isSelfManager == "Y"
                    ? "Battery Type"
                    : userData.isTracker == "Y"
                      ? "Clutch Type"
                      : "Transmission Type"
                }
                value={selectedVehicleDetails.transType}
                editable={false}
                disabled={true}
              />
              <Text style={GlobalStyle.underline}></Text>

              <Text style={styles.chooseAddressTextStyle}>
                {"Choose address:"}
              </Text>
              <View style={styles.view2}>
                <RadioTextItem
                  label={"Showroom address"}
                  value={"Showroom address"}
                  status={addressType === 1}
                  disabled={isValuesEditable}
                  onPress={() => setAddressType(1)}
                />
                <RadioTextItem
                  label={"Customer address"}
                  value={"Customer address"}
                  status={addressType === 2}
                  disabled={isValuesEditable}
                  onPress={() => setAddressType(2)}
                />
              </View>
              <Text style={GlobalStyle.underline}></Text>

              {addressType === 2 && (
                <View>
                  <TextinputComp
                    style={{ height: 65, maxHeight: 100, width: "100%" }}
                    value={customerAddress}
                    disabled={isValuesEditable}
                    label={"Customer Address"}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={(text) => setCustomerAddress(text)}
                  />
                  <Text style={GlobalStyle.underline}></Text>
                </View>
              )}

              <Text style={{ padding: 10 }}>
                {"Do Customer have Driving License?"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 12,
                  paddingBottom: 5,
                }}
              >
                <RadioTextItem
                  disabled={isValuesEditable}
                  label={"Yes"}
                  value={"Yes"}
                  status={customerHavingDrivingLicense === 1}
                  onPress={() => setCustomerHavingDrivingLicense(1)}
                />
                <RadioTextItem
                  disabled={isValuesEditable}
                  label={"No"}
                  value={"No"}
                  status={customerHavingDrivingLicense === 2}
                  onPress={() => setCustomerHavingDrivingLicense(2)}
                />
              </View>
              {customerHavingDrivingLicense === 1 && (
                <View>
                  <View style={styles.select_image_bck_vw}>
                    <ImageSelectItem
                      name={"Upload Driving License (Front)"}
                      onPress={() =>
                        showImagePickerMethod("DRIVING_LICENSE_FRONT")
                      }
                      disabled={isValuesEditable}
                    />
                  </View>
                  {uploadedImagesDataObj.dlFrontUrl ? (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{
                          width: "20%",
                          height: 30,
                          backgroundColor: Colors.SKY_BLUE,
                          borderRadius: 4,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          if (uploadedImagesDataObj.dlFrontUrl?.documentPath) {
                            setImagePath(
                              uploadedImagesDataObj.dlFrontUrl?.documentPath
                            );
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.WHITE,
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          Preview
                        </Text>
                      </TouchableOpacity>

                      <View style={{ width: "80%" }}>
                        <DisplaySelectedImage
                          fileName={uploadedImagesDataObj.dlFrontUrl.fileName}
                          from={"DLFRONTURL"}
                        />
                      </View>
                    </View>
                  ) : null}
                  <View style={styles.select_image_bck_vw}>
                    <ImageSelectItem
                      name={"Upload Driving License (Back)"}
                      onPress={() =>
                        showImagePickerMethod("DRIVING_LICENSE_BACK")
                      }
                      disabled={isValuesEditable}
                    />
                  </View>
                  {uploadedImagesDataObj.dlBackUrl ? (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        style={{
                          width: "20%",
                          height: 30,
                          backgroundColor: Colors.SKY_BLUE,
                          borderRadius: 4,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          if (uploadedImagesDataObj.dlBackUrl?.documentPath) {
                            setImagePath(
                              uploadedImagesDataObj.dlBackUrl?.documentPath
                            );
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: Colors.WHITE,
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          Preview
                        </Text>
                      </TouchableOpacity>
                      <View style={{ width: "80%" }}>
                        <DisplaySelectedImage
                          fileName={uploadedImagesDataObj.dlBackUrl.fileName}
                          from={"DLBACKURL"}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              )}

              <Text style={GlobalStyle.underline}></Text>

              <DateSelectItem
                label={"Customer Preferred Date*"}
                value={selector.customer_preferred_date}
                // disabled={!isRecordEditable}
                disabled={isValuesEditable}
                onPress={() =>
                  showDatePickerModelMethod("PREFERRED_DATE", "date")
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.customer_preferred_date === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              ></Text>
              <DropDownSelectionItem
                label={"List of Employees"}
                value={selectedDseDetails.name}
                disabled={true}
              />
              <DropDownSelectionItem
                label={"List of Drivers"}
                value={selectedDriverDetails.name}
                // disabled={!isRecordEditable}
                disabled={isValuesEditable}
                onPress={() =>
                  showDropDownModelMethod("LIST_OF_DRIVERS", "List of Drivers")
                }
                clearOption={true}
                clearKey={"LIST_OF_DRIVERS"}
                onClear={onDropDownClear}
              />
              <DateSelectItem
                label={"Customer Preferred Time*"}
                value={selector.customer_preferred_time}
                // disabled={!isRecordEditable}
                disabled={isValuesEditable}
                onPress={() =>
                  showDatePickerModelMethod("CUSTOMER_PREFERRED_TIME", "time")
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.customer_preferred_time === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              ></Text>
              {/* <View style={{ flexDirection: "row" }}>
                                <View style={{ width: "50%" }}> */}
              <DateSelectItem
                label={"Actual start Time*"}
                value={selector.actual_start_time}
                // disabled={!isRecordEditable}
                disabled={isValuesEditable}
                onPress={() =>
                  showDatePickerModelMethod("ACTUAL_START_TIME", "time")
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.actual_start_time === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              ></Text>
              {/* </View>
                                <View style={{ width: "50%" }}> */}
              <DateSelectItem
                label={"Actual End Time*"}
                value={selector.actual_end_time}
                disabled={isValuesEditable}
                // disabled={!isRecordEditable}
                onPress={() =>
                  showDatePickerModelMethod("ACTUAL_END_TIME", "time")
                }
              />
              <Text
                style={[
                  GlobalStyle.underline,
                  {
                    backgroundColor:
                      isSubmitPress && selector.actual_end_time === ""
                        ? "red"
                        : "rgba(208, 212, 214, 0.7)",
                  },
                ]}
              ></Text>
              {/* </View> */}
              {/* </View> */}

              {/* <View style={styles.space}></View> */}
              {/* <Text style={{ padding: 10 }}>{"Allotment ID"}</Text>
              <Text style={GlobalStyle.underline}></Text>
              <View style={styles.space}></View>
              <Text style={{ padding: 10 }}>{"Planned Start Date Time"} </Text>
              <Text style={GlobalStyle.underline}></Text>
              <View style={styles.space}></View>
              <Text style={{ padding: 10 }}>{"Planned End Date Time"}</Text>
              <Text style={GlobalStyle.underline}></Text> */}
            </View>
          </View>

          {handleActionButtons === 1 && !isViewMode() && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Back"}
                // disabled={selector.isLoading}
                onPress={() => navigation.goBack()}
              />
              <LocalButtonComp
                title={"Submit"}
                // disabled={selector.isLoading}
                onPress={() => // submitClicked("SENT_FOR_APPROVAL", "Test Drive") make it same as wef for live issues 
                  submitClicked("APPROVED", "Test Drive") 
                }
              />
            </View>
          )}
          {handleActionButtons === 2 && !isViewMode() && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Close"}
                // disabled={selector.isLoading}
                onPress={() => navigation.goBack()}
              />
              <LocalButtonComp
                title={"Cancel"}
                // disabled={selector.isLoading}
                onPress={() => submitClicked("CANCELLED", "Test Drive")}
              />
            </View>
          )}
          {handleActionButtons === 3 && !isViewMode() && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Reject"}
                // disabled={selector.isLoading}
                onPress={() =>
                  submitClicked("CANCELLED", "Test Drive Approval")
                }
              />
              <LocalButtonComp
                title={"Approve"}
                // disabled={selector.isLoading}
                bgColor={Colors.GREEN}
                onPress={() => submitClicked("APPROVED", "Test Drive Approval")}
              />
            </View>
          )}
          {handleActionButtons === 4 && !isViewMode() && (
            <View style={styles.view1}>
              <LocalButtonComp
                title={"Close"}
                // disabled={selector.isLoading}
                onPress={() => closeTask("")}
              />
              <LocalButtonComp
                title={"Reschedule"}
                // disabled={selector.isLoading}
                bgColor={Colors.GREEN}
                onPress={() => setIsRescheduleModalVisible(true)}
              // onPress={() => submitClicked("RESCHEDULED", "Test Drive")} // todo uncomment manthan
              />
            </View>
          )}
          {handleActionButtons === 5 && (
            <View style={styles.view1}>
              <Text style={styles.cancelText}>{"This task has cancelled"}</Text>
            </View>
          )}

          {isCloseSelected ? (
            <View
              style={{
                marginTop: 20,
                paddingHorizontal: otpViewHorizontalPadding,
              }}
            >
              <View
                style={{
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  {"We have sent an OTP to mobile number, please verify"}
                </Text>
              </View>
              <CodeField
                ref={ref}
                {...props}
                caretHidden={false} // when users can't paste a text value, because context menu doesn't appear
                value={otpValue}
                onChangeText={setOtpValue}
                cellCount={CELL_COUNT}
                rootStyle={otpStyles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[otpStyles.cell, isFocused && otpStyles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
          ) : null}

          {isCloseSelected ? (
            <View style={[styles.view1, { marginTop: 30 }]}>
              <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.GREEN}
                // disabled={selector.is_loading_for_task_update}
                labelStyle={{ textTransform: "none" }}
                onPress={verifyClicked}
              >
                Verify
              </Button>
              <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.RED}
                // disabled={selector.is_loading_for_task_update}
                labelStyle={{ textTransform: "none" }}
                onPress={resendClicked}
              >
                Resend
              </Button>
              {/* <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.RED}
                // disabled={selector.is_loading_for_task_update}
                labelStyle={{ textTransform: "none" }}
                onPress={()=>{ navigation.goBack()}}
              >
                Close
              </Button> */}
            </View>
          ) : null}

          {route?.params?.taskStatus === "CLOSED" &&
            !isReopenSubmitVisible &&
            !isCloseSelected 
            && storeLastupdatedTestDriveDetails?.status == "CLOSED" 
            // && storeLastupdatedTestDriveDetails?.reTestdriveFlag == "ReTestDrive" || storeLastupdatedTestDriveDetails?.reTestdriveFlag == "Original" 
           
             ? (
            <View style={[styles.view1, { marginTop: 30 }]}>
                <Button
                  mode="contained"
                  style={{ width: "45%" }}
                  color={Colors.GRAY}
                  // disabled={selector.is_loading_for_task_update}
                  labelStyle={{ textTransform: "none" }}
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  Back
                </Button>
              <Button
                mode="contained"
                style={{ width: "45%" }}
                color={Colors.RED}
                // disabled={selector.is_loading_for_task_update}
                labelStyle={{ textTransform: "none" }}
                // onPress={reOpenTask}
                  onPress={()=>{
                    reSubmitClick("ASSIGNED", "Test Drive Approval")
                  }}
                  // todo manthan 
              >
                {/* todo */}
                Re Testdrive
              </Button>
            </View>
          ) : null}

          {isReopenSubmitVisible ? (
            <View style={[styles.view1, { marginTop: 30 }]}>
              <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.GRAY}
                // disabled={selector.is_loading_for_task_update}
                labelStyle={{ textTransform: "none" }}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                Close
              </Button>
              <Button
                mode="contained"
                style={{ width: 120 }}
                color={Colors.RED}
                // disabled={selector.is_loading_for_task_update}
                labelStyle={{ textTransform: "none" }}
                onPress={() => {
                  // submitClicked("SENT_FOR_APPROVAL", "Test Drive") make it same as web for live issue
                  submitClicked("APPROVED", "Test Drive")
                  setIsisReopenSubmitVisible(false)
                  // reSubmitClick("ASSIGNED","Test Drive Approval")
                  // closeTask("reopen");
                }}
              >
                Submit
              </Button>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        visible={imagePath !== ""}
        onRequestClose={() => {
          setImagePath("");
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
          <View style={{ width: "90%" }}>
            <Image
              style={{ width: "100%", height: 400, borderRadius: 4 }}
              resizeMode="contain"
              source={{ uri: imagePath }}
            />
          </View>
          <TouchableOpacity
            style={{
              width: 100,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              left: "37%",
              bottom: "15%",
              borderRadius: 5,
              backgroundColor: Colors.RED,
            }}
            onPress={() => setImagePath("")}
          >
            <Text
              style={{ fontSize: 14, fontWeight: "600", color: Colors.WHITE }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {renderShowRecheduleModal()}
    </SafeAreaView>
  );
};

export default TestDriveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseVw: {
    paddingHorizontal: 10,
  },
  drop_down_view_style: {
    paddingTop: 5,
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  shadow: {
    shadowColor: Colors.DARK_GRAY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    elevation: 3,
  },

  accordianBckVw: {
    backgroundColor: Colors.WHITE,
  },
  space: {
    height: 10,
  },
  // view1: {
  //     marginVertical: 30,
  //     flexDirection: "row",
  //     justifyContent: "space-evenly",
  //     alignItems: "center",
  // },
  chooseAddressTextStyle: {
    padding: 10,
    justifyContent: "center",
    color: Colors.GRAY,
  },
  view2: {
    flexDirection: "row",
    paddingLeft: 12,
    paddingBottom: 5,
  },
  select_image_bck_vw: {
    minHeight: 50,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  selectedImageBckVw: {
    paddingLeft: 12,
    paddingRight: 15,
    paddingBottom: 5,
    backgroundColor: Colors.WHITE,
  },
  selectedImageTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.RED,
  },
  textInputStyle: {
    height: 65,
    width: "100%",
  },
  view1: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 8,
    // borderWidth: 1,
    width: '100%',
    height: 60,
    // borderRadius: 5
  },
});

const otpStyles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30, fontWeight: "400" },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },

  titleText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.PINK
  },
  badgeContainer: {
    marginLeft: 3,
    bottom: 4,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 13, color: Colors.PINK, fontWeight: "bold" },
});
