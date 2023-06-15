import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Keyboard, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, List, Button, IconButton, } from "react-native-paper";
import { Colors, GlobalStyle } from '../../../styles';
import { DatePickerComponent, DropDownComponant, ImagePickerComponent, TextinputComp } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerDetails, updateSelectedDate,clearState,setDatePicker,
    setDropDownData, setImagePicker, getDetailsFromPoneNumber, getComplainFactorDropDownData, getLocationList, getBranchData, getDepartment, getDesignation, getEmployeeDetails, postComplaintFirstTime, clearStateFormData, getComplaitDetailsfromId, postComplaintClose, clearStateFormDataBtnClick, getBranchDataForRegister, getComplaintEmployees, getComplaintManager
} from '../../../redux/complaintTrackerReducer';
import { DateSelectItem, DropDownSelectionItem, ImageSelectItem } from '../../../pureComponents';
import { UserState } from 'realm';
import moment from 'moment';
import uuid from "react-native-uuid";
import URL from '../../../networking/endpoints';
import { useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AsyncStore from "../../../asyncStore";
import { showToast } from '../../../utils/toast';
import { useRef } from 'react';
import { GetCarModelList, isEmail } from '../../../utils/helperFunctions';
import _ from "lodash";

const dateFormat = "DD/MM/YYYY";
const currentDate = moment().add(0, "day").format(dateFormat)
let deptId_local, branchid_local="";
const stageDataLocal = [
    {
        "id": 1,
        "name": "Contact",
    },
    {
        "id": 2,
        "name": "Enquiry",
    },
    {
        "id": 3,
        "name": "Booking",
    },
    {
        "id": 4,
        "name": "Retail",
    },
   
    {
        "id": 5,
        "name": "Delivery",
    }
]
const AddEditComplaint = (props) => {
    const [openAccordian, setOpenAccordian] = useState(0);
    const selector = useSelector((state) => state.complaintTrackerReducer);
    const dispatch = useDispatch();
    let scrollRef = useRef(null);
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [complaintDate,  setcomplaintDate] = useState("")
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownKey, setDropDownKey] = useState("");
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
    const [uploadedImagesDataObjForClose, setUploadedImagesDataObjForClose] = useState({});
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    const [imagePath, setImagePath] = useState("");
    const [userData, setUserData] = useState({
        orgId: "",
        employeeId: "",
        employeeName: "",
        isManager: false,
        editEnable: false,
        isPreBookingApprover: false,
        isSelfManager: "",
        branchId:"",
        isCRM: false,
        isCRE: false,
        isCRMorCRE:false,
    });
    const [isSubmitPress, setIsSubmitPress] = useState(false);
    const [carModelsList, setCarModelsList] = useState([]);
    const [selectedRegLocationid, setSelectedRegLocationid] = useState("");
    const [defaultDateTime, setDefaultDateTime] = useState(
      new Date(Date.now())
    );

    useEffect(() => {
        getUserData()
        setcomplaintDate(currentDate);
        
    }, [])

    useEffect(() => {
        props.navigation.addListener("focus", () => {
            
            dispatch(clearStateFormData())
            if (props.route.params.from === "CLOSED_LIST" || props.route.params.from === "ACTIVE_LIST"){
                let payload = {
                    complaintId: props.route.params.complaintId
                }
                dispatch(getComplaitDetailsfromId(payload))
            }
                
        })
    }, [props.navigation])
    
    useEffect(()=>{
       
        if(selector.postComplaintFirstTimeRes){
            dispatch(clearStateFormData())
            props.navigation.goBack();
            
        }
       else if (selector.postComplaintCloseRes) {
            dispatch(clearStateFormData())
            props.navigation.goBack();

        }
    }, [selector.postComplaintFirstTimeRes, selector.postComplaintCloseRes])
    
    useEffect(() => {
      
        
    }, [selector.complaintDetailsFromIdRes])
    

    const getUserData = async () => {
        try {
            const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
            );

            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
               
                let isManager = false,
                    editEnable = false, isCRE= false, isCRM =false,iscrmOrcre= false;
                let isPreBookingApprover = false;
                if (
                    jsonObj.hrmsRole === "MD" ||
                    jsonObj.hrmsRole === "General Manager" ||
                    jsonObj.hrmsRole === "Manager" ||
                    jsonObj.hrmsRole === "Sales Manager" ||
                    jsonObj.hrmsRole === "branch manager"
                ) {
                    isManager = true;
                }
                if (jsonObj.roles.includes("PreBooking Approver")) {

                    editEnable = true;
                    isPreBookingApprover = true;
                }

                if (
                    jsonObj.hrmsRole === "CRE"

                ) {
                    isCRE = true;
                     iscrmOrcre= true;
                }

                if (
                    jsonObj.hrmsRole === "CRM"

                ) {
                    isCRM = true;
                    iscrmOrcre = true;
                }

                setUserData({
                    orgId: jsonObj.orgId,
                    employeeId: jsonObj.empId,
                    employeeName: jsonObj.empName,
                    isManager: isManager,
                    editEnable: editEnable,
                    isPreBookingApprover: isPreBookingApprover,
                    isSelfManager: jsonObj.isSelfManager,
                    branchId: jsonObj.branchId, 
                     isCRM: isCRM,
                    isCRE: isCRE,
                    isCRMorCRE:iscrmOrcre
                });

               
                // todo
                dispatch(getComplainFactorDropDownData(jsonObj.orgId))
                dispatch(getLocationList(jsonObj.orgId))
                getCarModelListFromServer(jsonObj.orgId)
               
            }
        } catch (error) {
            alert(error);
        }
    };


    const updateAccordian = (selectedIndex) => {
        if (selectedIndex != openAccordian) {
            setOpenAccordian(selectedIndex);
        } else {
            setOpenAccordian(0);
        }
    };
    const scrollToPos = (itemIndex) => {
        scrollRef.current.scrollTo({ y: itemIndex * 70 });
    };


    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "COMPLAINT_DATE":
                setcomplaintDate(formatDate);
                break;
           
        }
    }

    const isEditbaleForRegistration = ()=>{
        if (props.route.params.from === "ADD_NEW" && selector.getDetailsFromPhoneRespnse) {
            return true;
        }else{
            return false;
        }
    }
    const isEditable = ()=>{
     
        if (props.route.params.from ==="ADD_NEW"){
           
            return false;
        } else if (props.route.params.from === "ACTIVE_LIST" && userData.isCRMorCRE){
          
            return false;
        } else if (props.route.params.from === "CLOSED_LIST"){
          
            return true;
        }else{
           
            return true;
        }
    }

    const submitClicked = async (status) => {
        
        setIsSubmitPress(true);
        
            if (selector.mobile.length == 0) {
                scrollToPos(0);
                setOpenAccordian("1");
                showToast("Please enter valid phone number");
                return;
            }

        if (!_.isEmpty(selector.email) && !isEmail(selector.email)){
            scrollToPos(0);
            setOpenAccordian("1");
            showToast("Please enter valid Email Id");
            return;
        }
        // if (selector.consultant.length == 0) {
        //     scrollToPos(0);
        //     setOpenAccordian("1");
        //     showToast("Please select consultant");
        //     return;
        // }
        
        // if (selector.consultant.length == 0) {
        //     scrollToPos(0);
        //     setOpenAccordian("1");
        //     showToast("Please select consultant");
        //     return;
        // }


        if (selector.complaintFactorType.length == 0) {
            scrollToPos(1);
            setOpenAccordian("2");
            showToast("Please select complaint factor type");
            return;
        }
        if (selector.complainLocation.length == 0) {
            scrollToPos(1);
            setOpenAccordian("2");
            showToast("Please select location");
            return;
        }
        if (selector.complainBranch.length == 0) {
            scrollToPos(1);
            setOpenAccordian("2");
            showToast("Please select branch");
            return;
        }
        if (selector.complainDepartment.length == 0) {
            scrollToPos(1);
            setOpenAccordian("2");
            showToast("Please select department");
            return;
        }
        if (selector.complainDesignation.length == 0) {
            scrollToPos(1);
            setOpenAccordian("2");
            showToast("Please select designation");
            return;
        }
        if (selector.complainEmployee.length == 0) {
            scrollToPos(1);
            setOpenAccordian("2");
            showToast("Please select employee");
            return;
        }

        if (selector.complaintDescription.length == 0) {
            scrollToPos(1);
            setOpenAccordian("2");
            showToast("Please select complaint description");
            return;
        }
        if (status ==="Closed"){
          
            if (selector.closeComplaintSource.length == 0) {
                scrollToPos(2);
                setOpenAccordian("3");
                showToast("Please select complaint closing source");
                return;
            }
            
            if (selector.closeComplaintRemarks === undefined || selector.closeComplaintRemarks.length == 0) {
                scrollToPos(2);
                setOpenAccordian("3");
                showToast("Please select complaint closing remarks");
                return;
            }
        }
        
        if(status==="Active"){
            let payload = {
                "id": selector.complaintDetailsFromIdRes ? selector.complaintDetailsFromIdRes?.id : 0,
                "customerName": selector.customerName,
                "customeLocation": selector.location,
                "currentStage": selector.stage,
                "currentStageIdNo": selector.stage_id,
                "employee": selector.consultant,
                "manager": selector.reporting_manager,
                "branch": selector.branch,
                "complaintLocation": selector.complainLocation,
                "designation": selector.complainDesignation,
                "salesExecutiveName": selector.complainEmployee,
                "complaintDecription": selector.complaintDescription,
                "mobileNo": selector.mobile,
                "email": selector.email,
                "model": selector.model,
                "complaintFactor": selector.complaintFactorType,
                "closingSource": selector.closeComplaintSource,
                "orgId": userData.orgId,
                "department": selector.complainDepartment,
                "createdBy": userData.employeeName,// need to give loggedin empid
                "updatedBy": userData.employeeName,// need to give loggedin empid for first time and in update case need to give  
                "createdDate": selector.complaintDetailsFromIdRes?.createdDate ? selector.complaintDetailsFromIdRes?.createdDate : moment.utc().format(),
                "updatedDate": moment.utc().format(),
                "compliantBranch": selector.complainBranch,
                "complaintDocument": uploadedImagesDataObj?.complaint?.documentPath || selector.complaintdoc,
                "complaintCloserDocument": uploadedImagesDataObjForClose?.complaint?.documentPath || selector.complainCloserDoc,
                "aging": null,
                "status": status
            }

            dispatch(postComplaintFirstTime(payload));
        } else if (status ==="Closed"){
            let payload = {
                "id": selector.complaintDetailsFromIdRes ? selector.complaintDetailsFromIdRes?.id : 0,
                "customerName": selector.customerName,
                "customeLocation": selector.location,
                "currentStage": selector.stage,
                "currentStageIdNo": selector.stage_id,
                "employee": selector.consultant,
                "manager": selector.reporting_manager,
                "branch": selector.branch,
                "complaintLocation": selector.complainLocation,
                "designation": selector.complainDesignation,
                "salesExecutiveName": selector.complainEmployee,
                "complaintDecription": selector.complaintDescription,
                "mobileNo": selector.mobile,
                "email": selector.email,
                "model": selector.model,
                "complaintFactor": selector.complaintFactorType,
                "closingSource": selector.closeComplaintSource,
                "orgId": userData.orgId,
                "department": selector.complainDepartment,
                // "createdBy": userData.employeeName,// need to give loggedin empid
                "updatedBy": userData.employeeName,// need to give loggedin empid for first time and in update case need to give  
                // "createdDate": selector.complaintDetailsFromIdRes?.createdDate ? selector.complaintDetailsFromIdRes?.createdDate : moment.utc().format(),
                "updatedDate": moment.utc().format(),
                "compliantBranch": selector.complainBranch,
                "complaintDocument": uploadedImagesDataObj?.complaint?.documentPath || selector.complaintdoc,
                "complaintCloserDocument": uploadedImagesDataObjForClose?.complaint?.documentPath || selector.complainCloserDoc,
                "aging": null,
                "status": status,
                "rating": selector.closeComplaintFinalRate,
                "remarks": selector.closeComplaintRemarks,
            }
            
            dispatch(postComplaintClose(payload));
        } else if (status === "Update") {
            let payload = {
                "id": selector.complaintDetailsFromIdRes ? selector.complaintDetailsFromIdRes?.id : 0,
                "customerName": selector.customerName,
                "customeLocation": selector.location,
                "currentStage": selector.stage,
                "currentStageIdNo": selector.stage_id,
                "employee": selector.consultant,
                "manager": selector.reporting_manager,
                "branch": selector.branch,
                "complaintLocation": selector.complainLocation,
                "designation": selector.complainDesignation,
                "salesExecutiveName": selector.complainEmployee,
                "complaintDecription": selector.complaintDescription,
                "mobileNo": selector.mobile,
                "email": selector.email,
                "model": selector.model,
                "complaintFactor": selector.complaintFactorType,
                "closingSource": selector.closeComplaintSource,
                "orgId": userData.orgId,
                "department": selector.complainDepartment,
                // "createdBy": userData.employeeName,// need to give loggedin empid
                "updatedBy": userData.employeeName,// need to give loggedin empid for first time and in update case need to give  
                // "createdDate": selector.complaintDetailsFromIdRes?.createdDate ? selector.complaintDetailsFromIdRes?.createdDate : moment.utc().format(),
                "updatedDate": moment.utc().format(),
                "compliantBranch": selector.complainBranch,
                "complaintDocument": uploadedImagesDataObj?.complaint?.documentPath || selector.complaintdoc,
                "complaintCloserDocument": uploadedImagesDataObjForClose?.complaint?.documentPath || selector.complainCloserDoc,
                "aging": null,
                "status": "Active"
            }

            dispatch(postComplaintClose(payload));
        }


        
        
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
        // const fileName = fileNameArry.length > 0 ? fileNameArry[0] : "None";
        const fileName = uuid.v4();
        formData.append("file", {
            name: `${fileName}-.${fileType}`,
            type: `image/${fileType}`,
            uri: Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri,
            // randomNumber: userData.employeeId, //logedd in employeeID
        });
        formData.append("randomNumber", userData.employeeId);
        //todo
        switch (keyId) {
            case "UPLOAD_COMPLAINT_DOC":
                formData.append("documentType", "complaint");
                break;
            case "UPLOAD_CLOSED_COMPLAINT":
                formData.append("documentType", "complaint");
                break;
            
            default:
                formData.append("documentType", "default");
                break;
        }
        const token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
       
        await fetch(URL.UPLOAD_RANDOM_DOCUMENT(), {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) {
                    if (keyId === "UPLOAD_REG_DOC") {
                        dispatch(
                            setReplacementBuyerDetails({
                                key: "R_REG_DOC_KEY",
                                text: response.keyName,
                            })
                        );
                        dispatch(
                            setReplacementBuyerDetails({
                                key: "R_REG_DOC_PATH",
                                text: response.documentPath,
                            })
                        );
                    } else if (keyId === "UPLOAD_INSURENCE") {
                        dispatch(
                            setReplacementBuyerDetails({
                                key: "R_INS_DOC_KEY",
                                text: response.keyName,
                            })
                        );
                        dispatch(
                            setReplacementBuyerDetails({
                                key: "R_INS_DOC_PATH",
                                text: response.documentPath,
                            })
                        );
                    } else {
                        if (keyId === "UPLOAD_CLOSED_COMPLAINT"){
                            const dataObj = { ...uploadedImagesDataObjForClose };
                            dataObj[response.documentType] = response;
                            setUploadedImagesDataObjForClose({ ...dataObj });
                        }else{
                            const dataObj = { ...uploadedImagesDataObj };
                            dataObj[response.documentType] = response;
                            setUploadedImagesDataObj({ ...dataObj });
                        }
                        
                    }
                }
            })
            .catch((error) => {
                showToastRedAlert(
                    error.message ? error.message : "Something went wrong"
                );
                console.error("error", error);
            });
    };


    const DisplaySelectedImage = ({ fileName, from }) => {
        return (
            <View style={styles.selectedImageBckVw}>
                <Text style={styles.selectedImageTextStyle} numberOfLines={1}>
                    {fileName}
                </Text>
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

    const showDropDownModelMethod = (key, headerText, oid) => {
        Keyboard.dismiss();
        switch (key) {
            case "COMPLAIN_FACTOR_TYPE":
                let objData = selector.complaintFactorTypeDropdown;
                let newObjData = objData.map((item)=>{
                   
                    let obj = {
                        id: item.id,
                        name: item.factor
                    }
                    return obj 
                })
                
                setDataForDropDown([...newObjData]);
                break;
            case "COMPLAINT_LOCATION":

                let objData2 = selector.complainLocationDropDown;
                let newObjData2 = objData2.map((item) => {

                    let obj = {
                        id: item.id,
                        name: item.name
                    }
                    return obj
                })

                setDataForDropDown([...newObjData2]);
               
                break;
            case "COMPLAINT_BRANCH":

                let objData3 = selector.complainBranchDropDown;
                let newObjData3 = objData3.map((item) => {

                    let obj = {
                        id: item.branchId,
                        name: item.branchName
                    }
                    return obj
                })
                setDataForDropDown([...newObjData3]);
                break;
            case "COMPLAINT_DEPARTMENT":

                let objData4 = selector.complainDepartmentDropDown;
                let newObjData4 = objData4.map((item) => {

                    let obj = {
                        id: item.id,
                        name: item.value
                    }
                    return obj
                })
                setDataForDropDown([...newObjData4]);
                
                break;
            case "COMPLAINT_DESIGNATION":
                let objData5 = selector.complainDesignationDropDown;
                let newObjData5 = objData5.map((item) => {

                    let obj = {
                        id: item.id,
                        name: item.value
                    }
                    return obj
                })
                setDataForDropDown([...newObjData5]);
                break;
            case "COMPLAINT_EMPLOYEE":
                let objData6 = selector.complainEmployeeDropDown;
                let newObjData6 = objData6.map((item) => {

                    let obj = {
                        id: item.empId,
                        name: item.empName
                    }
                    return obj
                })
                setDataForDropDown([...newObjData6]);
                break;

            case "REG_LOCATION":
                let objData7 = selector.complainLocationDropDown;
                let newObjData7 = objData7.map((item) => {

                    let obj = {
                        id: item.id,
                        name: item.name
                    }
                    return obj
                })

                setDataForDropDown([...newObjData7]);
                break;
            case "REG_BRANCH":
                let objData9 = selector.complaintRegisterBranchDropDown;
                // let tempArr = [];
                // let newObjData9 = objData9.filter((item) => {
                    
                //         if (selectedRegLocationid == item.parentId) {
                           
                           
                //                 let obj = {
                //                     id: item.locationNodeDefId,
                //                     name: item.name
                //                 }
                //                 // return obj
                //                 tempArr.push(obj)
                            
                //         }
                
                    
                    
                // })
                // setDataForDropDown([...tempArr]);
                let newObjData9 = objData9.map((item) => {

                    let obj = {
                        id: item.branchId,
                        name: item.branchName
                    }
                    return obj
                })

                setDataForDropDown([...newObjData9]);
                
                break;
            case "REG_MODEL":
                let objData10 = carModelsList;
                let newObjData10 = objData10.map((item) => {

                    let obj = {
                        id: item.id,
                        name: item.model
                    }
                    return obj
                })

                setDataForDropDown([...newObjData10]);
                break;
            case "REG_STAGE":
                setDataForDropDown([...stageDataLocal]);
                break;
            case "REG_CONSULTANT":
                let objData11 = selector.complaintEmployees;
                let newObjData11 = objData11.map((item) => {

                    let obj = {
                        id: item.empId,
                        name: item.empName
                    }
                    return obj
                })
                setDataForDropDown([...newObjData11])
                break;

            case "REG_MANAGER":
            
                let obj  = [];
                if (!_.isEmpty(selector.complaintManagers)){
                    let temp = {
                        id: selector.complaintManagers?.empId,
                        name: selector.complaintManagers?.empName
                    }
                    obj.push(temp);
                }                   
                
                setDataForDropDown(obj)
                break;
           
        }
        setDropDownKey(key);
        setDropDownTitle(headerText);
        setShowDropDownModel(true);
    };

    const getCarModelListFromServer = (orgId) => {
    // Call Api
    GetCarModelList(orgId)
      .then(
        (resolve) => {
          let modalList = [];
          if (resolve.length > 0) {
            // resolve.forEach((item) => {
            //   modalList.push({
            //     id: item.vehicleId,
            //     name: item.model,
            //     isChecked: false,
            //     ...item,
            //   });
            // });
              setCarModelsList(resolve);
          }
        
             
        
        },
        (rejected) => {}
      )
  };

    const renderPickUpImageDoc = ()=>{
        return (<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: '80%' }}>
                <TextinputComp
                    style={styles.textInputStyle}
                    value={uploadedImagesDataObj?.complaint?.fileName || selector.complaintdoc}
                    label={"Upload complaint document"}
                    keyboardType={"default"}
                    maxLength={10}
                    disabled={isEditable()}
                    autoCapitalize={"characters"}
                    onChangeText={(text) => {
                        // dispatch(
                        //     setUploadDocuments({
                        //         key: "COMPLAINT_DOC",
                        //         text: text.replace(/[^a-zA-Z0-9]/g, ""),
                        //     })
                        // );
                    }}
                />
                <Text style={GlobalStyle.underline}></Text>
            </View>

            <View style={styles.select_image_bck_vw}>
                <ImageSelectItem
                    name={""}
                    disabled={isEditable()}
                    onPress={() => dispatch(setImagePicker("UPLOAD_COMPLAINT_DOC"))}
                />
            </View>
            {/* {true ? (
                                  <View style={{ flexDirection: "row" }}>
                                      <TouchableOpacity
                                          style={styles.previewbtn}
                                          onPress={() => {
                                              if (uploadedImagesDataObj.pan?.documentPath) {
                                                  setImagePath(uploadedImagesDataObj.pan?.documentPath);
                                              }
                                          }}
                                      >
                                          <Text style={styles.previewtxt}>Preview</Text>
                                      </TouchableOpacity>
                                      <View style={{ width: "80%" }}>
                                          <DisplaySelectedImage
                                              fileName={uploadedImagesDataObj.pan.fileName}
                                              from={"PAN"}
                                          />
                                      </View>
                                  </View>
                              ) : null} */}
        </View>)
        
    }

    const convertToDefaultDateTime = (date = "", time = "") => {
      if (date || time) {
        let newDateFormate = date
          ? moment(date, "DD/MM/YYYY").format("MM/DD/YYYY")
          : moment().format("MM/DD/YYYY");
        return new Date(`${newDateFormate} ${time}`);
      } else {
        return new Date(Date.now());
      }
    };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
      }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      enabled
      keyboardVerticalOffset={100}
    >
      <ImagePickerComponent
        visible={selector.showImagePicker}
        keyId={selector.imagePickerKeyId}
        selectedImage={(data, keyId) => {
          uploadSelectedImage(data, keyId);
        }}
        onDismiss={() => dispatch(setImagePicker(""))}
      />
      <ScrollView
        automaticallyAdjustContentInsets={true}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}
        keyboardShouldPersistTaps={"handled"}
        style={{ flex: 1 }}
        ref={scrollRef}
      >
        <DropDownComponant
          visible={showDropDownModel}
          headerTitle={dropDownTitle}
          data={dataForDropDown}
          onRequestClose={() => setShowDropDownModel(false)}
          selectedItems={async (item) => {
            if (dropDownKey === "COMPLAINT_LOCATION") {
              let payload = {
                orgId: userData.orgId,
                parent: "organization",
                child: "branch",
                parentId: item.id,
              };

              dispatch(getBranchData(payload));

              dispatch(
                setDropDownData({
                  key: "COMPLAINT_BRANCH",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
              dispatch(
                setDropDownData({
                  key: "COMPLAINT_DEPARTMENT",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
              dispatch(
                setDropDownData({
                  key: "COMPLAINT_DESIGNATION",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
              dispatch(
                setDropDownData({
                  key: "COMPLAINT_EMPLOYEE",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
            } else if (dropDownKey === "COMPLAINT_BRANCH") {
              let payload = {
                orgId: userData.orgId,
                parent: "branch",
                child: "department",
                parentId: item.id,
              };
              branchid_local = item.id;
              dispatch(getDepartment(payload));
              dispatch(
                setDropDownData({
                  key: "COMPLAINT_DEPARTMENT",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
              dispatch(
                setDropDownData({
                  key: "COMPLAINT_DESIGNATION",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
              dispatch(
                setDropDownData({
                  key: "COMPLAINT_EMPLOYEE",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
            } else if (dropDownKey === "COMPLAINT_DEPARTMENT") {
              let payload = {
                orgId: userData.orgId,
                parent: "department",
                child: "designation",
                parentId: item.id,
              };
              deptId_local = item.id;
              dispatch(getDesignation(payload));
              dispatch(
                setDropDownData({
                  key: "COMPLAINT_DESIGNATION",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
              dispatch(
                setDropDownData({
                  key: "COMPLAINT_EMPLOYEE",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
            } else if (dropDownKey === "COMPLAINT_DESIGNATION") {
              //    let   branchId = await AsyncStore.getData(
              //           AsyncStore.Keys.SELECTED_BRANCH_ID
              //       );
              let payload = {
                orgId: userData.orgId,
                branchId: branchid_local,
                deptId: deptId_local,
                desigId: item.id,
              };

              dispatch(getEmployeeDetails(payload));
              dispatch(
                setDropDownData({
                  key: "COMPLAINT_EMPLOYEE",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
            } else if (dropDownKey === "REG_LOCATION") {
              let payload = {
                orgId: userData.orgId,
                parent: "organization",
                child: "branch",
                parentId: item.id,
              };

              setSelectedRegLocationid(item.id);
              dispatch(getBranchDataForRegister(payload));

              dispatch(
                setDropDownData({
                  key: "REG_CONSULTANT",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
              dispatch(
                setDropDownData({
                  key: "REG_MANAGER",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
              dispatch(
                setDropDownData({
                  key: "REG_BRANCH",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
            } else if (dropDownKey === "REG_CONSULTANT") {
              dispatch(getComplaintManager(item.id));
              dispatch(
                setDropDownData({
                  key: "REG_MANAGER",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
            } else if (dropDownKey === "REG_BRANCH") {
              const payload = {
                orgId: userData.orgId,
                branchId: item.id,
              };

              dispatch(getComplaintEmployees(payload));
              dispatch(
                setDropDownData({
                  key: "REG_CONSULTANT",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
              dispatch(
                setDropDownData({
                  key: "REG_MANAGER",
                  value: "",
                  id: "",
                  orgId: userData.orgId,
                })
              );
            }
            setShowDropDownModel(false);
            dispatch(
              setDropDownData({
                key: dropDownKey,
                value: item.name,
                id: item.id,
                orgId: userData.orgId,
              })
            );
          }}
        />

        <DatePickerComponent
          visible={showDatePicker}
          mode={"date"}
          //   maximumDate={new Date(currentDate.toString())}
          value={defaultDateTime}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (Platform.OS === "android") {
              if (selectedDate) {
                updateSelectedDate(selectedDate, "COMPLAINT_DATE");
              }
            } else {
              updateSelectedDate(selectedDate, "COMPLAINT_DATE");
            }
          }}
          onRequestClose={() => setShowDatePicker(false)}
        />
        <View style={{}}>
          <View style={{ marginVertical: 10 }}>
            <List.AccordionGroup
              expandedId={openAccordian}
              onAccordionPress={(expandedId) => updateAccordian(expandedId)}
            >
              {/* // 1.Customer Details */}
              <List.Accordion
                id={"1"}
                title={"Register a Complaint"}
                titleStyle={{
                  color: openAccordian === "1" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "1" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View style={{ backgroundColor: Colors.WHITE }}>
                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.mobile}
                    keyboardType={"number-pad"}
                    maxLength={10}
                    // editable={false}
                    disabled={isEditable() || isEditbaleForRegistration()}
                    label={"Mobile Number*"}
                    onChangeText={(text) =>
                      dispatch(
                        setCustomerDetails({
                          key: "MOBILE",
                          text: text.replace(/[^0-9]/g, ""),
                        })
                      )
                    }
                    showRightIcon={true}
                    rightIconObj={{ name: "magnify", color: Colors.GRAY }}
                    onRightIconPressed={() => {
                      if (selector.mobile.length == 10) {
                        let payload = {
                          phoneNum: selector.mobile,
                          orgid: userData.orgId,
                        };
                        dispatch(getDetailsFromPoneNumber(payload));
                      } else {
                        showToast("Please enter valid mobile number");
                      }

                      // todo API call here for phone APi
                    }}
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.mobile === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "40%" }}>
                      <DateSelectItem
                        label={"Complaint Date"}
                        value={complaintDate}
                        disabled={isEditable()}
                        onPress={() => {
                          setDefaultDateTime(
                            convertToDefaultDateTime(complaintDate)
                          );
                          setShowDatePicker(true);
                        }}
                      />
                    </View>

                    <View style={{ width: "40%" }}>
                      {/* <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.location}
                                              //   keyboardType={}
                                              // editable={false}
                                              disabled={isEditable() || isEditbaleForRegistration()}
                                              label={"Location"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "LOCATION", text: text })
                                                  )
                                              }
                                              showRightIcon={false}

                                          /> */}
                      <DropDownSelectionItem
                        disabled={isEditable() || isEditbaleForRegistration()}
                        label={"Location"}
                        value={selector.location}
                        onPress={() =>
                          showDropDownModelMethod(
                            "REG_LOCATION",
                            "Please Select"
                          )
                        }
                      />

                      {/* <DropDownSelectionItem
                                  label={"Model*"}
                                  value={selector.carModel}
                                  onPress={() =>
                                      showDropDownModelMethod("CAR_MODEL", "Select Model")
                                  }
                              /> */}
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "40%" }}>
                      {/* <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.branch}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={isEditable() || isEditbaleForRegistration()}
                                              label={"Branch"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "BRANCH", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
                                          /> */}
                      <DropDownSelectionItem
                        disabled={isEditable() || isEditbaleForRegistration()}
                        label={"Branch"}
                        value={selector.branch}
                        onPress={() =>
                          showDropDownModelMethod("REG_BRANCH", "Please Select")
                        }
                      />
                    </View>
                    <View style={{ width: "40%" }}>
                      {/* <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.model}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={isEditable() || isEditbaleForRegistration()}
                                              label={"Model"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "MODEL", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
                                          /> */}

                      <DropDownSelectionItem
                        disabled={isEditable() || isEditbaleForRegistration()}
                        label={"Model"}
                        value={selector.model}
                        onPress={() =>
                          showDropDownModelMethod("REG_MODEL", "Please Select")
                        }
                      />
                    </View>
                  </View>

                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.customerName}
                    //   keyboardType={"number-pad"}
                    // editable={false}
                    disabled={isEditable()}
                    label={"Customer Name"}
                    onChangeText={(text) =>
                      dispatch(
                        setCustomerDetails({
                          key: "COUSTOMER_NAME",
                          text: text,
                        })
                      )
                    }
                    showRightIcon={false}
                  />

                  <TextinputComp
                    style={styles.textInputStyle}
                    value={selector.email}
                    //   keyboardType={"number-pad"}
                    // editable={false}
                    disabled={isEditable()}
                    label={"Email"}
                    onChangeText={(text) =>
                      dispatch(setCustomerDetails({ key: "EMAIL", text: text }))
                    }
                    showRightIcon={false}
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.email === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>

                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      {/* <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.stage}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={isEditable() || isEditbaleForRegistration()}
                                              label={"Stage"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "STAGE", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
                                          /> */}

                      <DropDownSelectionItem
                        disabled={isEditable() || isEditbaleForRegistration()}
                        label={"Stage"}
                        value={selector.stage}
                        onPress={() =>
                          showDropDownModelMethod("REG_STAGE", "Please Select")
                        }
                      />
                    </View>
                    <View style={{ width: "50%" }}>
                      <TextinputComp
                        style={styles.textInputStyle}
                        value={selector.stage_id}
                        //   keyboardType={"number-pad"}
                        // editable={false}
                        disabled={isEditable() || isEditbaleForRegistration()}
                        label={"Stage ID"}
                        onChangeText={(text) =>
                          dispatch(
                            setCustomerDetails({ key: "STAGE_ID", text: text })
                          )
                        }
                        showRightIcon={false}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      {/* <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.consultant}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={isEditable() || isEditbaleForRegistration()}
                                              label={"Consultant*"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "CONSULTANT", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
                                          /> */}
                      <DropDownSelectionItem
                        disabled={isEditable() || isEditbaleForRegistration()}
                        label={"Consultant"}
                        value={selector.consultant}
                        onPress={() =>
                          showDropDownModelMethod(
                            "REG_CONSULTANT",
                            "Please Select"
                          )
                        }
                      />
                      {/* <Text
                                              style={[
                                                  GlobalStyle.underline,
                                                  {
                                                      backgroundColor:
                                                          isSubmitPress && selector.consultant === ""
                                                              ? "red"
                                                              : "rgba(208, 212, 214, 0.7)",
                                                  },
                                              ]}
                                          ></Text> */}
                    </View>
                    <View style={{ width: "50%" }}>
                      {/* <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.reporting_manager}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={isEditable() || isEditbaleForRegistration()}
                                              label={"Reporting Manager"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "REPORTING_MANAGER", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
                                          /> */}

                      <DropDownSelectionItem
                        disabled={isEditable() || isEditbaleForRegistration()}
                        label={"Reporting Manager"}
                        value={selector.reporting_manager}
                        onPress={() =>
                          showDropDownModelMethod(
                            "REG_MANAGER",
                            "Please Select"
                          )
                        }
                      />
                    </View>
                  </View>
                </View>
              </List.Accordion>
            </List.AccordionGroup>
          </View>

          <View style={{ marginBottom: 10 }}>
            <List.AccordionGroup
              expandedId={openAccordian}
              onAccordionPress={(expandedId) => updateAccordian(expandedId)}
            >
              {/* // 1.Customer Details */}
              <List.Accordion
                id={"2"}
                title={"Complaint Info"}
                titleStyle={{
                  color: openAccordian === "2" ? Colors.BLACK : Colors.BLACK,
                  fontSize: 16,
                  fontWeight: "600",
                }}
                style={[
                  {
                    backgroundColor:
                      openAccordian === "2" ? Colors.RED : Colors.WHITE,
                  },
                  styles.accordianBorder,
                ]}
              >
                <View style={{ backgroundColor: Colors.WHITE }}>
                  <DropDownSelectionItem
                    disabled={isEditable()}
                    label={"Complaint Factor Type*"}
                    value={selector.complaintFactorType}
                    onPress={() =>
                      showDropDownModelMethod(
                        "COMPLAIN_FACTOR_TYPE",
                        "Please Select"
                      )
                    }
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.complaintFactorType === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>
                  <DropDownSelectionItem
                    disabled={isEditable()}
                    label={"Location*"}
                    value={selector.complainLocation}
                    onPress={() =>
                      showDropDownModelMethod(
                        "COMPLAINT_LOCATION",
                        "Please Select"
                      )
                    }
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.complainLocation === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>
                  <DropDownSelectionItem
                    disabled={isEditable()}
                    label={"Branch*"}
                    value={selector.complainBranch}
                    onPress={() =>
                      showDropDownModelMethod(
                        "COMPLAINT_BRANCH",
                        "Please Select"
                      )
                    }
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.complainBranch === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>
                  <DropDownSelectionItem
                    disabled={isEditable()}
                    label={"Department*"}
                    value={selector.complainDepartment}
                    onPress={() =>
                      showDropDownModelMethod(
                        "COMPLAINT_DEPARTMENT",
                        "Please Select"
                      )
                    }
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.complainDepartment === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>
                  <DropDownSelectionItem
                    disabled={isEditable()}
                    label={"Designation*"}
                    value={selector.complainDesignation}
                    onPress={() =>
                      showDropDownModelMethod(
                        "COMPLAINT_DESIGNATION",
                        "Please Select"
                      )
                    }
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.complainDesignation === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>

                  <DropDownSelectionItem
                    disabled={isEditable()}
                    label={"Employee*"}
                    value={selector.complainEmployee}
                    onPress={() =>
                      showDropDownModelMethod(
                        "COMPLAINT_EMPLOYEE",
                        "Please Select"
                      )
                    }
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.complainEmployee === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>

                  {renderPickUpImageDoc()}
                  <TextinputComp
                    disabled={isEditable()}
                    style={styles.textInputStyle}
                    value={selector.complaintDescription}
                    //   keyboardType={"number-pad"}
                    // editable={false}
                    label={"Complaint Description*"}
                    onChangeText={(text) =>
                      dispatch(
                        setCustomerDetails({
                          key: "COMPLAINT_DESCRIPTION",
                          text: text,
                        })
                      )
                    }
                    showRightIcon={false}
                  />
                  <Text
                    style={[
                      GlobalStyle.underline,
                      {
                        backgroundColor:
                          isSubmitPress && selector.complaintDescription === ""
                            ? "red"
                            : "rgba(208, 212, 214, 0.7)",
                      },
                    ]}
                  ></Text>
                </View>
              </List.Accordion>
            </List.AccordionGroup>
          </View>

          {props.route.params.from === "CLOSED_LIST" ||
          props.route.params.which_btn === "Close_Btn" ? (
            <View style={{ marginBottom: 10 }}>
              <List.AccordionGroup
                expandedId={openAccordian}
                onAccordionPress={(expandedId) => updateAccordian(expandedId)}
              >
                {/* // 1.Customer Details */}
                <List.Accordion
                  id={"3"}
                  title={"Close Complaint"}
                  titleStyle={{
                    color: openAccordian === "3" ? Colors.BLACK : Colors.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  style={[
                    {
                      backgroundColor:
                        openAccordian === "3" ? Colors.RED : Colors.WHITE,
                    },
                    styles.accordianBorder,
                  ]}
                >
                  <View style={{ backgroundColor: Colors.WHITE }}>
                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.closeComplaintSource}
                      //   keyboardType={"number-pad"}
                      // editable={false}
                      disabled={isEditable()}
                      label={"Complaint Closing Source*"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerDetails({
                            key: "CLOSE_SOURCE",
                            text: text,
                          })
                        )
                      }
                      showRightIcon={false}
                    />
                    <Text
                      style={[
                        GlobalStyle.underline,
                        {
                          backgroundColor:
                            isSubmitPress &&
                            selector.closeComplaintSource === ""
                              ? "red"
                              : "rgba(208, 212, 214, 0.7)",
                        },
                      ]}
                    ></Text>

                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.closeComplaintFinalRate}
                      keyboardType={"number-pad"}
                      // editable={false}
                      disabled={isEditable()}
                      label={"Final Rating"}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerDetails({
                            key: "CLOSE_FINALRATING",
                            text: text,
                          })
                        )
                      }
                      showRightIcon={false}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: "80%" }}>
                        <TextinputComp
                          style={styles.textInputStyle}
                          value={
                            uploadedImagesDataObjForClose?.complaint
                              ?.fileName || selector.complainCloserDoc
                          }
                          label={"Upload complaint Closer Document"}
                          keyboardType={"default"}
                          maxLength={10}
                          disabled={isEditable()}
                          autoCapitalize={"characters"}
                          onChangeText={(text) => {
                            //   dispatch(
                            //       setUploadDocuments({
                            //           key: "PAN",
                            //           text: text.replace(/[^a-zA-Z0-9]/g, ""),
                            //       })
                            //   );
                          }}
                        />
                        <Text style={GlobalStyle.underline}></Text>
                      </View>

                      <View style={styles.select_image_bck_vw}>
                        <ImageSelectItem
                          disabled={isEditable()}
                          name={""}
                          onPress={() =>
                            dispatch(setImagePicker("UPLOAD_CLOSED_COMPLAINT"))
                          }
                        />
                      </View>
                      {/* {true ? (
                                  <View style={{ flexDirection: "row" }}>
                                      <TouchableOpacity
                                          style={styles.previewbtn}
                                          onPress={() => {
                                              if (uploadedImagesDataObj.pan?.documentPath) {
                                                  setImagePath(uploadedImagesDataObj.pan?.documentPath);
                                              }
                                          }}
                                      >
                                          <Text style={styles.previewtxt}>Preview</Text>
                                      </TouchableOpacity>
                                      <View style={{ width: "80%" }}>
                                          <DisplaySelectedImage
                                              fileName={uploadedImagesDataObj.pan.fileName}
                                              from={"PAN"}
                                          />
                                      </View>
                                  </View>
                              ) : null} */}
                    </View>

                    <TextinputComp
                      style={styles.textInputStyle}
                      value={selector.closeComplaintRemarks}
                      //   keyboardType={"number-pad"}
                      // editable={false}
                      disabled={isEditable()}
                      label={"Complaint Closer Remarks* "}
                      onChangeText={(text) =>
                        dispatch(
                          setCustomerDetails({
                            key: "COMPLAINT_CLOSE_REMARKS",
                            text: text,
                          })
                        )
                      }
                      showRightIcon={false}
                    />
                    <Text
                      style={[
                        GlobalStyle.underline,
                        {
                          backgroundColor:
                            isSubmitPress &&
                            selector.closeComplaintRemarks === ""
                              ? "red"
                              : "rgba(208, 212, 214, 0.7)",
                        },
                      ]}
                    ></Text>
                  </View>
                </List.Accordion>
              </List.AccordionGroup>
            </View>
          ) : null}
          {props.route.params.from === "ADD_NEW" && (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Button
                mode="contained"
                style={styles.subBtnStyv2}
                color={Colors.PINK}
                labelStyle={{ textTransform: "none" }}
                onPress={() => {
                  dispatch(clearStateFormDataBtnClick());
                  setcomplaintDate(currentDate);
                }}
              >
                Clear
              </Button>
              <Button
                mode="contained"
                style={styles.subBtnStyv2}
                color={Colors.PINK}
                labelStyle={{ textTransform: "none" }}
                onPress={() => {
                  submitClicked("Active");
                }}
              >
                Submit
              </Button>
            </View>
          )}
          {props.route.params.from === "ACTIVE_LIST" &&
          props.route.params.which_btn !== "Close_Btn" &&
          userData.isCRMorCRE ? (
            <Button
              mode="contained"
              style={styles.subBtnSty}
              color={Colors.PINK}
              labelStyle={{ textTransform: "none" }}
              onPress={() => {
                submitClicked("Update");
              }}
            >
              Update
            </Button>
          ) : null}
          {props.route.params.which_btn === "Close_Btn" &&
          userData.isCRMorCRE ? (
            <Button
              mode="contained"
              style={styles.subBtnSty}
              color={Colors.PINK}
              labelStyle={{ textTransform: "none" }}
              onPress={() => {
                submitClicked("Closed");
              }}
            >
              Close
            </Button>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default AddEditComplaint

const styles = StyleSheet.create({
    textInputStyle: {
        height: 50,
        width: "100%",
    },
    previewbtn: {
        width: "20%",
        height: 30,
        backgroundColor: Colors.SKY_BLUE,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    previewtxt: {
        color: Colors.WHITE,
        fontSize: 14,
        fontWeight: "600",
    },
    select_image_bck_vw: {
        minHeight: 50,
        paddingLeft: 12,
        backgroundColor: Colors.WHITE,
    },
    selectedImageBckVw: {
        paddingLeft: 12,
        paddingRight: 10,
        paddingBottom: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.WHITE,
    },
    selectedImageTextStyle: {
        fontSize: 12,
        fontWeight: "400",
        width: "80%",
        color: Colors.DARK_GRAY,
    },
    accordianBorder: {
        borderWidth: 0.5,
        borderRadius: 4,
        borderColor: "#7a7b7d",
    },
    subBtnSty:{ width: '50%', marginVertical: 10, alignSelf: "flex-end" },
    subBtnStyv2: { width: '40%', marginVertical: 10, alignSelf: "flex-end" }
})