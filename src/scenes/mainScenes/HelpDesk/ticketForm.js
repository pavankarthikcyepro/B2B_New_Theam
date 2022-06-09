import React, { useEffect , useState} from 'react'
import {View ,Text, StyleSheet, SafeAreaView ,Dimensions, KeyboardAvoidingView,
    Alert,
    Keyboard,} from 'react-native'
import { Colors, GlobalStyle } from "../../../styles";
import { DropDownSelectionItem, ImageSelectItem } from "../../../pureComponents";
import {
    TextinputComp,
    DropDownComponant,
    DatePickerComponent,
    ButtonComp,
    ImagePickerComponent
} from "../../../components";

import { useDispatch, useSelector } from "react-redux";
import { clearState, setDropDownData, setDescriptionDetails, setImagePicker } from './../../../redux/raiseTicketReducer';

const screenWidth = Dimensions.get("window").width;


 const TicketFormScreen =({route ,navigation})=>{
   const selector = useSelector((state) => state.raiseTicketReducer);
   const dispatch = useDispatch();

    const [showDropDownModel, setShowDropDownModel] = useState(false);
    const [dataForDropDown, setDataForDropDown] = useState([]);
    const [dropDownKey, setDropDownKey] = useState("");
    const [dropDownTitle, setDropDownTitle] = useState("Select Data");
      const [uploadedImagesDataObj, setUploadedImagesDataObj] = useState({});



  useEffect(()=>{
         () => {
                if (route.params?.fromEdit === false) {
                dispatch(clearState());
            }
        }
  });

      const showDropDownModelMethod = (key, headerText) => {
        Keyboard.dismiss();

        switch (key) {
            case "ISSUE_STATES":
                if (selector.issue_states_list.length === 0) {
                    showToast("No Issue States found");
                    return;
                }
                setDataForDropDown([...selector.issue_states_list]);
                break;
             case "ISSUE_CATEGORIES":
                if (selector.issue_categories_list.length === 0) {
                    showToast("No Issue States found");
                    return;
                }
                setDataForDropDown([...selector.issue_categories_list]);
                break;
             case "TICKET_STATUS":
                if (selector.ticket_status_list.length === 0) {
                    showToast("No Issue States found");
                    return;
                }
                setDataForDropDown([...selector.ticket_status_list]);
                break;
        
        }
        setDropDownKey(key);
        setDropDownTitle(headerText);
        setShowDropDownModel(true);
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
    // console.log("uuid: ", fileName);
    formData.append("file", {
      name: `${fileName}-.${fileType}`,
      type: `image/${fileType}`,
      uri: Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri,
    });
    formData.append("universalId", universalId);

    switch (keyId) {
      case "UPLOAD_PAN":
        formData.append("documentType", "pan");
        break;
      case "UPLOAD_ADHAR":
        formData.append("documentType", "aadhar");
        break;
      case "UPLOAD_REG_DOC":
        formData.append("documentType", "REGDOC");
        break;
      case "UPLOAD_INSURENCE":
        formData.append("documentType", "insurance");
        break;
      case "UPLOAD_EMPLOYEE_ID":
        formData.append("documentType", "employeeId");
        break;
      case "UPLOAD_3_MONTHS_PAYSLIP":
        formData.append("documentType", "payslips");
        break;
      case "UPLOAD_PATTA_PASS_BOOK":
        formData.append("documentType", "passbook");
        break;
      case "UPLOAD_PENSION_LETTER":
        formData.append("documentType", "pension");
        break;
      case "UPLOAD_IMA_CERTIFICATE":
        formData.append("documentType", "imaCertificate");
        break;
      case "UPLOAD_LEASING_CONFIRMATION":
        formData.append("documentType", "leasingConfirm");
        break;
      case "UPLOAD_ADDRESS_PROOF":
        formData.append("documentType", "address");
        break;
      default:
        formData.append("documentType", "default");
        break;
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
        //console.log('response', response);
        if (response) {
          const dataObj = { ...uploadedImagesDataObj };
          console.log("UPLOADED IMAGES: ", JSON.stringify(dataObj));
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

  const submitClicked=()=>{
      console.log(selector.issue_state,selector.issue_category,selector.description,selector.imagePickerKeyId , uploadedImagesDataObj),"data alll";
  }

  return(
      <SafeAreaView style={styles.container}>
            <ImagePickerComponent
            visible={selector.showImagePicker}
            keyId={selector.imagePickerKeyId}
            selectedImage={(data, keyId) => {
          // console.log("imageObj: ", data, keyId);
          uploadSelectedImage(data, keyId);
        }}
        onDismiss={() => dispatch(setImagePicker(""))}
      />
           <DropDownComponant
                visible={showDropDownModel}
                headerTitle={dropDownTitle}
                data={dataForDropDown}
                onRequestClose={() => setShowDropDownModel(false)}
                selectedItems={(item) => {
                    console.log("selected: ", item);
                    setShowDropDownModel(false);
                    dispatch(
                        setDropDownData({ key: dropDownKey, value: item.name, id: item.id })
                    );
                }}
            />
           <View style={[{ borderRadius: 6, backgroundColor: Colors.WHITE }]}>
                        <DropDownSelectionItem
                            label={"Issue Stage*"}
                             value={selector.issue_state}
                            onPress={() =>
                                showDropDownModelMethod(
                                    "ISSUE_STATES",
                                    "Select Issue State"
                                )
                            }
                        />
                         <DropDownSelectionItem
                            label={"Issue Category*"}     
                            value={selector.issue_category}                     
                            onPress={() =>
                                showDropDownModelMethod("ISSUE_CATEGORIES", "Select Issue Categories")
                            }
                        />
                          <DropDownSelectionItem
                            label={"Status"}
                            value={selector.ticket_status}
                            onPress={() =>
                                showDropDownModelMethod("TICKET_STATUS", "Select Ticket Status")
                            }
                        />
                         <TextinputComp
                            style={styles.textInputComp}
                            value={selector.description}
                            // autoCapitalize="words"
                            label={"Description*"}
                            // editable={
                            //     selector.enquiryType.length > 0 &&
                            //         selector.customerType.length > 0
                            //         ? true
                            //         : false
                            // }
                            maxLength={30}
                            // disabled={
                            //     selector.enquiryType.length > 0 &&
                            //         selector.customerType.length > 0
                            //         ? false
                            //         : true
                            // }
                            // keyboardType={"default"}
                            // error={firstNameErrorHandler.showError}
                            // errorMsg={firstNameErrorHandler.msg}
                            onChangeText={(text) => {
                                // if (firstNameErrorHandler.showError) {
                                //     setFirstNameErrorHandler({ showError: false, msg: "" });
                                // }
                                dispatch(
                                    setDescriptionDetails({ key: "DESCRIPTION", text: text })
                                );
                            }}
                        />
                         <ImageSelectItem
                                    name={"Choose File"}
                                     onPress={() => dispatch(setImagePicker("UPLOAD_ADHAR"))}
                                />
             </View>
              <View style={styles.view2}>
                        <ButtonComp
                            // disabled={selector.isLoading}
                            title={ "SUBMIT"}
                           // width={screenWidth - 40}
                            onPress={submitClicked}
                        />
                    </View>
      </SafeAreaView>
  )
}
export default TicketFormScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 10,
    },
    text1: {
        fontSize: 16,
        fontWeight: "700",
        paddingLeft: 5,
    },
    view1: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        height: 60,
    },
    view2: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    text2: {
        fontSize: 14,
        fontWeight: "600",
    },
    devider: {
        width: "100%",
        height: 0.5,
        backgroundColor: Colors.GRAY,
    },
    textInputComp: {
        height: 65,
    },
    noEventsText: {
        fontSize: 12,
        fontWeight: "400",
        color: Colors.RED,
        paddingVertical: 5,
    },
})