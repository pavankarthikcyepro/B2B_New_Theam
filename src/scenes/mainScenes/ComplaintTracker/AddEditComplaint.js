import { ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Keyboard, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, List, Button, IconButton, } from "react-native-paper";
import { Colors, GlobalStyle } from '../../../styles';
import { DatePickerComponent, DropDownComponant, ImagePickerComponent, TextinputComp } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerDetails, updateSelectedDate,clearState,setDatePicker,
    setDropDownData, setImagePicker, getDetailsFromPoneNumber, getComplainFactorDropDownData, getLocationList, getBranchData, getDepartment, getDesignation
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
const dateFormat = "DD/MM/YYYY";
const currentDate = moment().add(0, "day").format(dateFormat)
const AddEditComplaint = () => {
    const [openAccordian, setOpenAccordian] = useState(0);
    const selector = useSelector((state) => state.complaintTrackerReducer);
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [complaintDate,  setcomplaintDate] = useState("")
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownKey, setDropDownKey] = useState("");
    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
    const [imagePath, setImagePath] = useState("");
    const [userData, setUserData] = useState({
        orgId: "",
        employeeId: "",
        employeeName: "",
        isManager: false,
        editEnable: false,
        isPreBookingApprover: false,
        isSelfManager: ""
    });
    useEffect(() => {
        getUserData()
        setcomplaintDate(currentDate);
    
    }, [])

  
    
    

    const getUserData = async () => {
        try {
            const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
            );

            if (employeeData) {
                const jsonObj = JSON.parse(employeeData);

                let isManager = false,
                    editEnable = false;
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
                setUserData({
                    orgId: jsonObj.orgId,
                    employeeId: jsonObj.empId,
                    employeeName: jsonObj.empName,
                    isManager: isManager,
                    editEnable: editEnable,
                    isPreBookingApprover: isPreBookingApprover,
                    isSelfManager: jsonObj.isSelfManager
                });

                dispatch(getComplainFactorDropDownData(jsonObj.orgId))
                dispatch(getLocationList(jsonObj.orgId))
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



    const updateSelectedDate = (date, key) => {

        const formatDate = moment(date).format(dateFormat);
        switch (key) {
            case "COMPLAINT_DATE":
                setcomplaintDate(formatDate);
                break;
           
        }
    }

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

        switch (keyId) {
            case "UPLOAD_PAN":
                formData.append("documentType", "pan");
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
                        const dataObj = { ...uploadedImagesDataObj };
                        dataObj[response.documentType] = response;
                        setUploadedImagesDataObj({ ...dataObj });
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
                        id: item.id,
                        name: item.value
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
                setDataForDropDown([]);
                break;
           
        }
        setDropDownKey(key);
        setDropDownTitle(headerText);
        setShowDropDownModel(true);
    };

    const renderPickUpImageDoc = ()=>{
        return (<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: '80%' }}>
                <TextinputComp
                    style={styles.textInputStyle}
                    value={uploadedImagesDataObj?.pan?.fileName}
                    label={"Upload complaint document"}
                    keyboardType={"default"}
                    maxLength={10}
                    disabled={true}
                    autoCapitalize={"characters"}
                    onChangeText={(text) => {
                        dispatch(
                            setUploadDocuments({
                                key: "PAN",
                                text: text.replace(/[^a-zA-Z0-9]/g, ""),
                            })
                        );
                    }}
                />
                <Text style={GlobalStyle.underline}></Text>
            </View>

            <View style={styles.select_image_bck_vw}>
                <ImageSelectItem
                    name={""}
                    onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))}
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
          style={{ flex: 1 ,}}
          
    >

          <DropDownComponant
              visible={showDropDownModel}
              headerTitle={dropDownTitle}
              data={dataForDropDown}
              onRequestClose={() => setShowDropDownModel(false)}
              selectedItems={(item) => {
                
                  if (dropDownKey === "COMPLAINT_LOCATION") {
                    let payload ={
                        orgId:userData.orgId,
                        parent: "organization",
                        child:"branch",
                        parentId: item.id
                    }
                      dispatch(getBranchData(payload))
                  } else if (dropDownKey === "COMPLAINT_BRANCH"){
                      let payload = {
                          orgId: userData.orgId,
                          parent: "branch",
                          child: "department",
                          parentId: item.id
                      }
                      dispatch(getDepartment(payload))
                  } else if (dropDownKey === "COMPLAINT_DEPARTMENT"){
                      let payload = {
                          orgId: userData.orgId,
                          parent: "department",
                          child: "designation",
                          parentId: item.id
                      }
                      dispatch(getDesignation(payload))
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
              value={new Date()}
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
            
            <View style={{marginVertical:10}}>
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
                            <View style={{backgroundColor:Colors.WHITE}}>
                                  <TextinputComp
                                      style={styles.textInputStyle}
                                      value={selector.mobile}
                                      keyboardType={"number-pad"}
                                      // editable={false}
                                      disabled={false}
                                      label={"Mobile Number*"}
                                      onChangeText={(text) =>
                                          dispatch(
                                              setCustomerDetails({ key: "MOBILE", text: text.replace(/[^0-9]/g, ''), })
                                          )
                                      }
                                      showRightIcon={true}
                                      rightIconObj={{ name: "magnify", color: Colors.GRAY }}
                                      onRightIconPressed={() => {
                                          if (selector.mobile.length == 10){
                                            let payload = {
                                                phoneNum:selector.mobile,
                                                orgid:userData.orgId
                                            }
                                              dispatch(getDetailsFromPoneNumber(payload))
                                          }else{
                                              showToast("Please enter valid mobile number");
                                          }
                                          
                                          // todo API call here for phone APi
                                      }}
                                  />
                                  <Text style={GlobalStyle.underline}></Text>
                                  <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-between" }}>
                                      <View style={{ width: '40%' }}>
                                          <DateSelectItem
                                              label={"Complaint Date"}
                                              value={complaintDate}
                                              disabled={false}
                                              onPress={() => {
                                                  setShowDatePicker(true)
                                              }}
                                          />
                                      </View>

                                      <View style={{ width: '40%' }}>

                                          <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.location}
                                              //   keyboardType={}
                                              // editable={false}
                                              disabled={false}
                                              label={"Location"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "LOCATION", text: text })
                                                  )
                                              }
                                              showRightIcon={false}

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

                                  <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-between" }}>
                                      <View style={{ width: '40%' }}>
                                          <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.branch}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={false}
                                              label={"Branch"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "BRANCH", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
                                          />
                                      </View>
                                      <View style={{ width: '40%' }}>
                                          <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.model}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={false}
                                              label={"Model"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "MODEL", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
                                          />
                                      </View>
                                  </View>

                                  <TextinputComp
                                      style={styles.textInputStyle}
                                      value={selector.customerName}
                                      //   keyboardType={"number-pad"}
                                      // editable={false}
                                      disabled={false}
                                      label={"Customer Name"}
                                      onChangeText={(text) =>
                                          dispatch(
                                              setCustomerDetails({ key: "COUSTOMER_NAME", text: text })
                                          )
                                      }
                                      showRightIcon={false}

                                  />

                                  <TextinputComp
                                      style={styles.textInputStyle}
                                      value={selector.email}
                                      //   keyboardType={"number-pad"}
                                      // editable={false}
                                      disabled={false}
                                      label={"Email"}
                                      onChangeText={(text) =>
                                          dispatch(
                                              setCustomerDetails({ key: "EMAIL", text: text })
                                          )
                                      }
                                      showRightIcon={false}

                                  />

                                  <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-between" }}>
                                      <View style={{ width: '50%' }}>
                                          <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.stage}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={false}
                                              label={"Stage"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "STAGE", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
                                          />
                                      </View>
                                      <View style={{ width: '50%' }}>
                                          <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.stage_id}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={false}
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

                                  <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-between" }}>
                                      <View style={{ width: '50%' }}>
                                          <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.consultant}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={false}
                                              label={"Consultant*"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "CONSULTANT", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
                                          />
                                      </View>
                                      <View style={{ width: '50%' }}>
                                          <TextinputComp
                                              style={styles.textInputStyle}
                                              value={selector.reporting_manager}
                                              //   keyboardType={"number-pad"}
                                              // editable={false}
                                              disabled={false}
                                              label={"Reporting Manager"}
                                              onChangeText={(text) =>
                                                  dispatch(
                                                      setCustomerDetails({ key: "REPORTING_MANAGER", text: text })
                                                  )
                                              }
                                              showRightIcon={false}
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
                            <View style={{backgroundColor:Colors.WHITE}}>
                                  <DropDownSelectionItem
                                      label={"Complaint Factor Type*"}
                                      value={selector.complaintFactorType}
                                      onPress={() =>
                                          showDropDownModelMethod("COMPLAIN_FACTOR_TYPE", "Please Select")
                                      }
                                  />
                                  <DropDownSelectionItem
                                      label={"Location*"}
                                      value={selector.complainLocation}
                                      onPress={() =>
                                          showDropDownModelMethod("COMPLAINT_LOCATION", "Please Select")
                                      }
                                  />
                                  <DropDownSelectionItem
                                      label={"Branch*"}
                                      value={selector.complainBranch}
                                      onPress={() =>
                                          showDropDownModelMethod("COMPLAINT_BRANCH", "Please Select")
                                      }
                                  />
                                  <DropDownSelectionItem
                                      label={"Department*"}
                                      value={selector.complainDepartment}
                                      onPress={() =>
                                          showDropDownModelMethod("COMPLAINT_DEPARTMENT", "Please Select")
                                      }
                                  />
                                  <DropDownSelectionItem
                                      label={"Designation*"}
                                      value={selector.complainDesignation}
                                      onPress={() =>
                                          showDropDownModelMethod("COMPLAINT_DESIGNATION", "Please Select")
                                      }
                                  />

                                  <DropDownSelectionItem
                                      label={"Employee*"}
                                      value={selector.complainEmployee}
                                      onPress={() =>
                                          showDropDownModelMethod("COMPLAINT_EMPLOYEE", "Please Select")
                                      }
                                  />


                                  {renderPickUpImageDoc()}
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
                                      value={selector.customerName}
                                      //   keyboardType={"number-pad"}
                                      // editable={false}
                                      disabled={false}
                                      label={"Customer Name"}
                                      onChangeText={(text) =>
                                          dispatch(
                                              setCustomerDetails({ key: "COUSTOMER_NAME", text: text })
                                          )
                                      }
                                      showRightIcon={false}

                                  />

                                  <TextinputComp
                                      style={styles.textInputStyle}
                                      value={selector.email}
                                      //   keyboardType={"number-pad"}
                                      // editable={false}
                                      disabled={false}
                                      label={"Email"}
                                      onChangeText={(text) =>
                                          dispatch(
                                              setCustomerDetails({ key: "EMAIL", text: text })
                                          )
                                      }
                                      showRightIcon={false}

                                  />


                                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                      <View style={{ width: '80%' }}>
                                          <TextinputComp
                                              style={styles.textInputStyle}
                                              value={uploadedImagesDataObj?.pan?.fileName}
                                              label={"Upload complaint Closer Document"}
                                              keyboardType={"default"}
                                              maxLength={10}
                                              disabled={true}
                                              autoCapitalize={"characters"}
                                              onChangeText={(text) => {
                                                  dispatch(
                                                      setUploadDocuments({
                                                          key: "PAN",
                                                          text: text.replace(/[^a-zA-Z0-9]/g, ""),
                                                      })
                                                  );
                                              }}
                                          />
                                          <Text style={GlobalStyle.underline}></Text>
                                      </View>

                                      <View style={styles.select_image_bck_vw}>
                                          <ImageSelectItem
                                              name={""}
                                              onPress={() => dispatch(setImagePicker("UPLOAD_PAN"))}
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
                                      value={selector.email}
                                      //   keyboardType={"number-pad"}
                                      // editable={false}
                                      disabled={false}
                                      label={"Email"}
                                      onChangeText={(text) =>
                                          dispatch(
                                              setCustomerDetails({ key: "EMAIL", text: text })
                                          )
                                      }
                                      showRightIcon={false}

                                  />
                              </View>

                          </List.Accordion>
                      </List.AccordionGroup>
                  </View>

                
              
          </View>
    </ScrollView>
      </KeyboardAvoidingView>
  )
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
})