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
    Alert,Image,
    Dimensions,TouchableOpacity,Modal,
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
    validateOtpApi,
    clearOTP
} from "../../../redux/testDriveReducer";
import {
    DateSelectItem,
    RadioTextItem,
    ImageSelectItem,
    DropDownSelectionItem,
} from "../../../pureComponents";
import { Dropdown } from "sharingan-rn-modal-dropdown";
import { Button, IconButton, RadioButton } from "react-native-paper";
import * as AsyncStore from "../../../asyncStore";
import { convertToDate, convertToTime, isEmail } from "../../../utils/helperFunctions";
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
} from 'react-native-confirmation-code-field';

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
    const { taskId, identifier, universalId, taskData, mobile } = route.params;
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

    const [otpValue, setOtpValue] = useState('');
    const ref = useBlurOnFulfill({ otpValue, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: otpValue,
        setValue: setOtpValue,
    });
    const [isSubmitPress, setIsSubmitPress] = useState(false);
    let date = new Date();
    date.setDate(date.getDate() + 9);

    useEffect(() => {
        //updateBasicDetails(taskData);
        // getAsyncstoreData();
        // getUserToken();
    }, []);

    useEffect(() => {
        navigation.addListener('focus', () => {
            setIsCloseSelected(false)
            dispatch(clearState())
            setSelectedDriverDetails({
                name: "",
                id: "",
            })
            getAsyncstoreData();
            getUserToken();
        });
        navigation.addListener('blur', () => {
            dispatch(clearState())
            setSelectedDriverDetails({
                name: "",
                id: "",
            })
        });
    }, [navigation])

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
                            dispatch(getTaskDetailsApi(taskId)),
                            dispatch(getTestDriveVehicleListApi(payload)),
                            dispatch(getTestDriveDseEmployeeListApi(jsonObj.orgId)),
                            dispatch(getDriversListApi(jsonObj.orgId)),
                        ]).then(() => {
                            console.log("all done");
                        });
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
    }

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
        console.log("url: ", url);
        await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        })
            .then(json => json.json())
            .then(resp => {
                console.log("$$$$resp: ", JSON.stringify(resp))
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
                            const primaryProductIndex = dmsLeadProducts.findIndex(x => x.isPrimary === 'Y');
                            if (primaryProductIndex !== -1) {
                                primaryModel = dmsLeadProducts[primaryProductIndex];
                            }
                        } else {
                            primaryModel = dmsLeadProducts[0];
                        }
                        const {model, variant, fuel, transimmisionType} = primaryModel;
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
            .catch(err => {
                console.error("while fetching record details: ", err);
            })
    }

    // Handle Task Details Response
    useEffect(() => {
        if (selector.test_drive_vehicle_list_for_drop_down.length > 0 && selectedVehicleDetails?.varient !== '') {
            let tempObj = { ...selectedVehicleDetails };
            let findModel = [];
            console.log("MODELS: ", selector.test_drive_vehicle_list_for_drop_down);
            findModel = selector.test_drive_vehicle_list_for_drop_down.filter((item) => {
                return item.varientName === selectedVehicleDetails.varient || item.model === selectedVehicleDetails.model
            })
            if (findModel.length > 0) {
                console.log('find model: ', findModel)
                tempObj.vehicleId = findModel[0].vehicleId;
                tempObj.varientId = findModel[0].varientId;

                if (selector.test_drive_varients_obj_for_drop_down[findModel[0].model]) {
                    const varientsData =
                        selector.test_drive_varients_obj_for_drop_down[findModel[0].model];
                    setVarientListForDropDown(varientsData);
                }
            }
            else{
                tempObj.fuelType = '';
                tempObj.transType = '';
            }
            setSelectedVehicleDetails(tempObj)
        }
    }, [selector.test_drive_vehicle_list_for_drop_down]);

    useEffect(() => {
        if (selector.task_details_response) {
            getTestDriveAppointmentDetailsFromServer();
        }
    }, [selector.task_details_response, taskStatusAndName])

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
                console.log("getTestDriveAppointmentDetailsApi PAYLOAD:", payload);
                dispatch(getTestDriveAppointmentDetailsApi(payload));
            }

        }
    };

    useEffect(() => {
        if (selector.test_drive_appointment_details_response) {
            const {status, vehicleId, varientId} = selector.test_drive_appointment_details_response; // /testdrive/history?branchId
            if (status === "SENT_FOR_APPROVAL") {
                const selectedModel = selector.test_drive_vehicle_list.filter((item) => { // demoVehicle/vehicles?branchId
                    return item.varientId === varientId && item.vehicleId === vehicleId
                })
                if (selectedModel.length > 0) {
                        const {fuelType, model, transmission_type, varientName, varientId, vehicleId} = selectedModel[0].vehicleInfo;
                        setSelectedVehicleDetails({varient: varientName, fuelType, model, transType: transmission_type, varientId, vehicleId});
                }
            }
            setIsRecordEditable(false);
            updateTaskDetails(selector.test_drive_appointment_details_response)
        }
    }, [selector.test_drive_appointment_details_response]);

    useEffect(() => {
        if (selector.task_details_response) {
            const taskStatus =
                selector.task_details_response.taskStatus;
            const taskName = selector.task_details_response.taskName;
            console.log("TASK STATUS:", taskStatus, taskName);
            if (taskStatus === "SENT_FOR_APPROVAL" && taskName === "Test Drive") {
                setHandleActionButtons(2);
            } else if (
                taskStatus === "ASSIGNED" &&
                taskName === "Test Drive Approval"
            ) {
                console.log("INSIDE A");
                setHandleActionButtons(3);
            } else if (taskStatus === "APPROVED" && taskName === "Test Drive") {
                console.log("INSIDE B");
                setHandleActionButtons(4);
            } else if (taskStatus === "CANCELLED") {
                setHandleActionButtons(5);
            }
            else if (taskStatus === "ASSIGNED" && taskName === "Test Drive") {
                setHandleActionButtons(1);
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
        if (selector.drivers_list.length > 0 && selector.driverId !== '') {
            let tempDriver = [];
            tempDriver = selector.drivers_list.filter((item) => {
                return Number(item.id) === Number(selector.driverId)
            })
            if (tempDriver.length > 0) {
                setSelectedDriverDetails({ name: tempDriver[0].name, id: tempDriver[0].id });
            }
        }
    }, [selector.drivers_list, selector.driverId]);

    const updateTaskDetails = (taskDetailsObj) => {
        console.log("taskDetailsObj: ", taskDetailsObj);
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

        await fetch(URL.UPLOAD_DOCUMENT(), {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((response) => {
                console.log("response", response);
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
        setIsSubmitPress(true)
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

        if (selectedVehicleDetails.vehicleId === 0 || selectedVehicleDetails.varientId === 0) {
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
          showToast("Customer Preferred Time and Actual Start Time Should not be Equal");
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

        if (selectedVehicleDetails.vehicleId === 0 || selectedVehicleDetails.varientId === 0) {
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

        let appointmentObj = {
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
        };

        if (customerHavingDrivingLicense === 1) {
            appointmentObj.dlBackUrl = uploadedImagesDataObj.dlBackUrl.documentPath;
            appointmentObj.dlFrontUrl = uploadedImagesDataObj.dlFrontUrl.documentPath;
        }

        const payload = {
            appointment: appointmentObj,
        };
        dispatch(bookTestDriveAppointmentApi(payload));
        // navigation.goBack()
    };

    const closeTask = () => {
        setIsSubmitPress(true)
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

        if (selectedVehicleDetails.vehicleId === 0 || selectedVehicleDetails.varientId === 0) {
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
        generateOtpToCloseTask();
        setIsCloseSelected(true)
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
            };
            dispatch(updateTestDriveTaskApi(payload));
        }
    }, [selector.book_test_drive_appointment_response]);

    const autoApproveTestDrive = () => {
        submitClicked("APPROVED", "Test Drive Approval");
    }
    // Handle Update Test Drive Task response
    useEffect(() => {
        console.log('repsonse: ', selector.test_drive_update_task_response, ', task status: ', taskStatusAndName)
        if (selector.test_drive_update_task_response === "success" && taskStatusAndName.status === 'SENT_FOR_APPROVAL') {
            autoApproveTestDrive();
                // showAlertMsg(true);
        } else if (selector.test_drive_update_task_response === "success" && taskStatusAndName.status === 'CANCELLED') {
            showCancelAlertMsg();
        } else if (selector.test_drive_update_task_response === "success" && taskStatusAndName.status === 'APPROVED') {
                setTimeout(() => {
                    dispatch(getTaskDetailsApi(taskId))
                }, 1000);
                // displayStatusSuccessMessage();
        } else if (selector.test_drive_update_task_response === "failed") {
            showAlertMsg(false);
        }  else if (selector.test_drive_update_task_response === "success" &&
            (taskStatusAndName.status === 'RESCHEDULED' || taskStatusAndName.status === 'CLOSED')) {
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
                        navigation.goBack();
                    },
                },
            ],
            { cancelable: false }
        );
    }

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
        console.log("VEHICLE INFO: ", JSON.stringify(vehicleInfo));
        if (selector.test_drive_varients_obj_for_drop_down[vehicleInfo.model]) {
            const varientsData =
                selector.test_drive_varients_obj_for_drop_down[vehicleInfo.model];
            setVarientListForDropDown(varientsData);
        }
        setSelectedVehicleDetails({
            model: vehicleInfo.model,
            varient: fromVarient ? vehicleInfo.varientName : '',
            fuelType: fromVarient ? vehicleInfo.fuelType : "",
            transType: fromVarient ? vehicleInfo.transmission_type : "",
            // fuelType: vehicleInfo.fuelType || "",
            // transType: vehicleInfo.transmission_type || "",
            vehicleId: vehicleInfo.vehicleId,
            varientId: fromVarient ? vehicleInfo.varientId : '',
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
            return
        }

        const payload = {
            mobileNo: "91" + mobileNumber,
            message: null
        }
        dispatch(generateOtpApi(payload));
    }

    const resendClicked = () => {

        generateOtpToCloseTask();
    }

    const verifyClicked = async () => {

        if (otpValue.length != 4) {
            showToastRedAlert("Please enter valid OTP")
            return;
        }

        if (!mobileNumber) {
            showToastRedAlert("No mobile found");
            return
        }

        const payload = {
            mobileNo: "91" + mobileNumber,
            sessionKey: selector.otp_session_key,
            otp: otpValue
        }
        dispatch(validateOtpApi(payload));
    }

    useEffect(() => {
        if (selector.validate_otp_response_status === "successs") {
            dispatch(clearOTP())
            submitClicked("CLOSED", "Test Drive")
        }
    }, [selector.validate_otp_response_status])

    return (
      <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
        <ImagePickerComponent
          visible={showImagePicker}
          keyId={imagePickerKey}
          selectedImage={(data, keyId) => {
            console.log("imageObj: ", data, keyId);
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
            console.log("date: ", selectedDate);
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
                  style={{ height: 65, width: "100%" }}
                  value={name}
                  label={"Name*"}
                  editable={true}
                  disabled={false}
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
                  style={{ height: 65, width: "100%" }}
                  value={email}
                  label={"Email ID"}
                  keyboardType={"email-address"}
                  editable={true}
                  disabled={false}
                  onChangeText={(text) => setEmail(text)}
                />
                <Text style={[GlobalStyle.underline]}></Text>
                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  value={mobileNumber}
                  label={"Mobile Number*"}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  editable={true}
                  disabled={false}
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
                  disabled={false}
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
                  disabled={false}
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
                  style={{ height: 65, width: "100%" }}
                  label={"Fuel Type"}
                  value={selectedVehicleDetails.fuelType}
                  editable={false}
                  disabled={true}
                />
                <Text style={GlobalStyle.underline}></Text>

                <TextinputComp
                  style={{ height: 65, width: "100%" }}
                  label={"Transmission Type"}
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
                    onPress={() => setAddressType(1)}
                  />
                  <RadioTextItem
                    label={"Customer address"}
                    value={"Customer address"}
                    status={addressType === 2}
                    onPress={() => setAddressType(2)}
                  />
                </View>
                <Text style={GlobalStyle.underline}></Text>

                {addressType === 2 && (
                  <View>
                    <TextinputComp
                      style={{ height: 65, maxHeight: 100, width: "100%" }}
                      value={customerAddress}
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
                    label={"Yes"}
                    value={"Yes"}
                    status={customerHavingDrivingLicense === 1}
                    onPress={() => setCustomerHavingDrivingLicense(1)}
                  />
                  <RadioTextItem
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
                            if (
                              uploadedImagesDataObj.dlFrontUrl?.documentPath
                            ) {
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
                  label={"Customer Preffered Date"}
                  value={selector.customer_preferred_date}
                  // disabled={!isRecordEditable}
                  disabled={false}
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
                  disabled={false}
                  onPress={() =>
                    showDropDownModelMethod(
                      "LIST_OF_DRIVERS",
                      "List of Drivers"
                    )
                  }
                />
                <DateSelectItem
                  label={"Customer Preffered Time"}
                  value={selector.customer_preferred_time}
                  // disabled={!isRecordEditable}
                  disabled={false}
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
                  label={"Actual start Time"}
                  value={selector.actual_start_time}
                  // disabled={!isRecordEditable}
                  disabled={false}
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
                  label={"Actual End Time"}
                  value={selector.actual_end_time}
                  disabled={false}
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

            {handleActionButtons === 1 && (
              <View style={styles.view1}>
                <LocalButtonComp
                  title={"Close"}
                  // disabled={selector.isLoading}
                  onPress={() => navigation.goBack()}
                />
                <LocalButtonComp
                  title={"Submit"}
                  // disabled={selector.isLoading}
                  onPress={() =>
                    submitClicked("SENT_FOR_APPROVAL", "Test Drive")
                  }
                />
              </View>
            )}
            {handleActionButtons === 2 && (
              <View style={styles.view1}>
                <LocalButtonComp
                  title={"Cancel"}
                  // disabled={selector.isLoading}
                  onPress={() => submitClicked("CANCELLED", "Test Drive")}
                />
              </View>
            )}
            {handleActionButtons === 3 && (
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
                  onPress={() =>
                    submitClicked("APPROVED", "Test Drive Approval")
                  }
                />
              </View>
            )}
            {handleActionButtons === 4 && (
              <View style={styles.view1}>
                <LocalButtonComp
                  title={"Close"}
                  // disabled={selector.isLoading}
                  onPress={() => closeTask()}
                />
                <LocalButtonComp
                  title={"Reschedule"}
                  // disabled={selector.isLoading}
                  bgColor={Colors.GREEN}
                  onPress={() => submitClicked("RESCHEDULED", "Test Drive")}
                />
              </View>
            )}
            {handleActionButtons === 5 && (
              <View style={styles.view1}>
                <Text style={styles.cancelText}>
                  {"This task has cancelled"}
                </Text>
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
});

const otpStyles = StyleSheet.create({
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30, fontWeight: "400" },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 1,
        borderColor: '#00000030',
        textAlign: 'center',
    },
    focusCell: {
        borderColor: '#000',
    },
});
