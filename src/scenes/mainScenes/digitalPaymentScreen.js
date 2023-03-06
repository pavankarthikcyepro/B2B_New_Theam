import React, { useState, useRef, useEffect } from "react";
import { Colors, GlobalStyle } from "../../styles";
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import uuid from "react-native-uuid";
import * as AsyncStore from "../../asyncStore";
import { client } from "../../networking/client";
import URL from "../../networking/endpoints";
import { clearDeleteApiRes, clearSaveApiRes, deleteQrCode, saveQrCode } from "../../redux/digitalPaymentReducer";
import { useDispatch, useSelector } from "react-redux";
import { DropDownSelectionItem } from "../../pureComponents";
import {
  DropDownComponant,
  ImagePickerComponent,
  LoaderComponent,
} from "../../components";
import { showToast, showToastRedAlert, showToastSucess } from "../../utils/toast";
import { useIsFocused } from "@react-navigation/native";

const noImagePreview = "https://www.bigpharmacy.com.my/scripts/timthumb.php";

const DigitalPaymentScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const selector = useSelector((state) => state.digitalPaymentReducer);
  const [dataList, setDataList] = useState([]);
  const [userData, setUserData] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [fileData, setFileData] = useState({
    type: "",
    name: "",
    uri: "",
    universalId: "",
  });
  const [showDropDownModel, setShowDropDownModel] = useState(false);
  const [locallyUploaded, setLocallyUploaded] = useState([]);
  const [dropDownData, setDropDownData] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState("");
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [shownUploadSection, setShownUploadSection] = useState(false);
  const [isSubmitPress, setIsSubmitPress] = useState(false);

  useEffect(() => {
    setLocallyUploaded([]);
    getUserData();
  }, [isFocused]);

  const getUserData = async () => {
    const data = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    const parsedData = JSON.parse(data);
    if (
      parsedData?.hrmsRole === "Business Head" ||
      parsedData?.hrmsRole === "MD" ||
      parsedData?.hrmsRole === "General Manager" ||
      parsedData?.hrmsRole === "Admin" ||
      parsedData?.hrmsRole === "App Admin" ||
      parsedData?.hrmsRole === "Admin Prod"
    ) {
      setShownUploadSection(true);
    } else {
      setShownUploadSection(false);
    }

    setUserData(parsedData);
    const { orgId, branchId, branchs } = parsedData;
    setBranchs(branchs);
    getQrCode(orgId, branchId);
    await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
      setAuthToken(token);
    });
  };

  const getQrCode = async (orgId, branchId) => {
    const response = await client.get(URL.QR(orgId));
    const qr = await response.json();
    if (qr.length > 0) {
      dispatch(clearSaveApiRes());
      dispatch(clearDeleteApiRes());
      qr.reverse();
      setDataList(qr);
      let flag = 0;
      for (let i = 0; i < qr.length; i++) {
        if (qr[i].branchId == branchId) {
          flag = 1;
          setFileData({
            ...fileData,
            uri: qr[i].documentPath,
            name: qr[i].fileName,
            universalId: qr[i].universalid,
            type: qr[i].fileName?.substring(qr[i].fileName?.lastIndexOf(".") + 1),
          });
          break;
        }
      }
      if (flag == 0) {
        setFileData({
          name: "",
          universalId: "",
          type: "",
          uri: noImagePreview,
        });
      }
    } else {
      setFileData({
        name: "",
        universalId: "",
        type: "",
        uri: noImagePreview,
      });
    }
  };

  const setBranchs = (data) => {
    data = data.map((item, index) => {
      return { ...item, name: item.branchName };
    });

    let newArr = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {
        ...data[i],
        selected: data[i].branchId == userData.branchId ? true : false,
      };
      newArr.push(obj);
      if (data[i].branchId == userData.branchId) {
        setSelectedBranches(data[i].name);
        setSelectedBranchIds([userData.branchId]);
      }
    }
    setBranchList(Object.assign([], newArr));
  };

  const dropDownItemClicked = async () => {
    setDropDownData([...branchList]);
    setShowDropDownModel(true);
  };

  const setImageData = async (data) => {
    const photoUri = data.uri;
    const fileType = photoUri.substring(photoUri.lastIndexOf(".") + 1);
    const name = photoUri.substring(photoUri.lastIndexOf("/") + 1);
    const fileName = data.fileName ? data.fileName : name ? name : uuid.v4();

    const formData = new FormData();
    formData.append("file", {
      name: `${fileName}`,
      type: `image/${fileType}`,
      uri: Platform.OS === "ios" ? photoUri.replace("file://", "") : photoUri,
    });

    await fetch(URL.UPLOAD_QR(userData.orgId, userData.branchId), {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + authToken,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          if (response.documentPath) {
            let newObj = {
              orgId: userData.orgId,
              uri: response.documentPath,
              type: fileType,
              name: response?.fileName ? response.fileName : fileName,
              universalId: response.universalId,
            };

            let branchArrPayload = [...locallyUploaded];

            if (branchArrPayload.length > 0) {
              for (let i = 0; i < selectedBranchIds.length; i++) {
                let flag = 0;
                for (let j = 0; j < branchArrPayload.length; j++) {
                  if (selectedBranchIds[i] === branchArrPayload[j].branchId) {
                    flag = 1;
                    branchArrPayload[j] = { ...branchArrPayload[j], ...newObj };
                    break;
                  }
                }
                if (flag == 0) {
                  branchArrPayload.push({
                    ...newObj,
                    branchId: selectedBranchIds[i],
                  });
                }
              };
            } else {
              for (let i = 0; i < selectedBranchIds.length; i++) {
                branchArrPayload.push({
                  ...newObj,
                  branchId: selectedBranchIds[i],
                });
              }
            }

            setLocallyUploaded(Object.assign([], branchArrPayload))
            setFileData({
              ...fileData,
              uri: response.documentPath,
              type: fileType,
              name: response?.fileName ? response.fileName : fileName,
              universalId: response.universalId,
            });
          } else {
            setFileData({
              uri: "",
              type: "",
              name: "",
              universalId: "",
            });
            showToastRedAlert("Something went wrong");
          }
        }
      })
      .catch((error) => {
        showToastRedAlert(
          error.message ? error.message : "Something went wrong"
        );
      });
  };

  useEffect(() => {
    if (selector.saveQrCodeSuccess == "success") {
      showToastSucess("QR Code updated successfully");
      getLatestQrList();
    }
  }, [selector.saveQrCodeSuccess]);

  const submitClick = () => {
    if (selectedBranchIds.length <= 0) {
      setIsSubmitPress(true);
      showToast("Please select Dealer Code");
      return;
    }

    if (!fileData.uri || fileData.uri === noImagePreview) {
      showToast("Please choose image");
      return;
    }

    let branchArrPayload = [];
    let tmpArr = [...locallyUploaded];

    for (let i = 0; i < selectedBranchIds.length; i++) {
      let obj = {
        branchId: selectedBranchIds[i],
        documentPath: fileData.uri,
        documentType: "qrcode",
        fileName: fileData.name,
        orgId: userData.orgId,
        universalid: fileData.universalId,
      };
      branchArrPayload.push(obj);

      for (let j = 0; j < tmpArr.length; j++) {
        if (selectedBranchIds[i] == tmpArr[j].branchId) {
          tmpArr.slice(j);
        }
      }
    }

    setLocallyUploaded([...tmpArr]);
    dispatch(saveQrCode(branchArrPayload));
  };
  
  const deleteConfirmation = () => {
    if (selectedBranchIds.length <= 0) {
      showToast("Please select Dealer Code");
      return;
    }

    if (!fileData.uri || fileData.uri === noImagePreview) {
      showToast("No record found");
      return;
    }

    Alert.alert("Are you sure?", "", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deleteClick(),
      },
    ]);
  };
  
  const deleteClick = () => {
    let recordIds = [];
    let tmpArr = [...locallyUploaded];
    for (let i = 0; i < selectedBranchIds.length; i++) {
      for (let j = 0; j < dataList.length; j++) {
        if(selectedBranchIds[i] == dataList[j].branchId){
          recordIds.push(dataList[j].id);
        }
      }

      for (let j = 0; j < tmpArr.length; j++) {
        if (selectedBranchIds[i] == tmpArr[j].branchId) {
          tmpArr.slice(j);
        }
      }
    }

    setLocallyUploaded([...tmpArr]);

    if (recordIds.length <= 0) {
      showToast("No record found");
      return;
    } 
    dispatch(deleteQrCode(recordIds));
  }

  useEffect(() => {
    if (selector.deleteQrCodeSuccess == "success") {
      showToastSucess("QR Code deleted successfully");
      getLatestQrList("delete");
    }
  }, [selector.deleteQrCodeSuccess]);

  const getLatestQrList = async (type = "") => {
    const response = await client.get(URL.QR(userData.orgId));
    const qr = await response.json();
    qr.reverse();
    setDataList([...qr]);
    if (type === "delete") {
      setFileData({
        uri: "",
        type: "",
        name: "",
        universalId: "",
      });
    }
    dispatch(clearSaveApiRes());
    dispatch(clearDeleteApiRes());
  };

  return (
    <SafeAreaView style={styles.container}>
      <DropDownComponant
        visible={showDropDownModel}
        multiple={true}
        headerTitle={"Select"}
        data={dropDownData}
        allOption={true}
        onRequestClose={() => setShowDropDownModel(false)}
        selectedItems={(item) => {
          setBranchList([...item]);
          let names = [];
          let branchIds = [];
          let selectedNames = [];

          if (item.length > 0) {
            setIsSubmitPress(false);
            item.forEach((obj) => {
              if (obj.selected != undefined && obj.selected == true) {
                names.push(obj.name);
                branchIds.push(obj.branchId);
              }
            });
            selectedNames = names?.join(", ");
          } else {
            setIsSubmitPress(true);
          }

          if (branchIds.length == 1) {
            let flag = 0;
            if (locallyUploaded.length > 0) {
              for (let i = 0; i < locallyUploaded.length; i++) {
                if (locallyUploaded[i].branchId == branchIds[0]) {
                  flag = 1;
                  setFileData({
                    uri: locallyUploaded[i].uri,
                    name: locallyUploaded[i].name,
                    universalId: locallyUploaded[i].universalid,
                    type: locallyUploaded[i].type,
                  });
                  break;
                }
              }
            }

            if (flag == 0) {
              if (dataList.length > 0) {
                let flag = 0;
                for (let i = 0; i < dataList.length; i++) {
                  if (dataList[i].branchId == branchIds[0]) {
                    flag = 1;
                    setFileData({
                      uri: dataList[i].documentPath,
                      name: dataList[i].fileName,
                      universalId: dataList[i].universalid,
                      type: dataList[i].fileName?.substring(
                        dataList[i].fileName?.lastIndexOf(".") + 1
                      ),
                    });
                    break;
                  }
                }
                if (flag == 0) {
                  setFileData({
                    name: "",
                    universalId: "",
                    type: "",
                    uri: noImagePreview,
                  });
                }
              } else {
                setFileData({
                  name: "",
                  universalId: "",
                  type: "",
                  uri: noImagePreview,
                });
              }
            }
          }
          setSelectedBranchIds(branchIds);
          setSelectedBranches(selectedNames);
          setShowDropDownModel(false);
        }}
      />

      <ImagePickerComponent
        visible={showImagePicker}
        onDismiss={() => setShowImagePicker(false)}
        selectedImage={(data) => setImageData(data)}
      />

      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.branchesContainer}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: fileData.uri ? fileData.uri : noImagePreview,
            }}
            resizeMode="contain"
          />
        </View>
        {shownUploadSection ? (
          <View style={[styles.branchesContainer, { padding: 15 }]}>
            <View style={styles.uploadingRow}>
              <TouchableOpacity
                style={styles.uploadBtnContainer}
                onPress={() => setShowImagePicker(true)}
              >
                <Text style={styles.uploadText}>Choose Image</Text>
              </TouchableOpacity>
              <Text numberOfLines={2} style={styles.fileNameText}>
                {fileData.name ? fileData.name : "No Image Chosen"}
              </Text>
            </View>

            <DropDownSelectionItem
              label={"Dealer Code*"}
              value={selectedBranches}
              onPress={() => dropDownItemClicked()}
              takeMinHeight={true}
            />

            <Text
              style={[
                GlobalStyle.underline,
                {
                  backgroundColor:
                    isSubmitPress && selectedBranchIds.length <= 0
                      ? "red"
                      : "rgba(208, 212, 214, 0.7)",
                },
              ]}
            />

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.submitBtnContainer}
                onPress={() => submitClick()}
              >
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtnContainer}
                onPress={() => deleteConfirmation()}
              >
                <Text style={styles.submitBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
      <LoaderComponent visible={selector.isLoading} />
    </SafeAreaView>
  );
};

export default DigitalPaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  branchesContainer: {
    marginTop: 25,
    marginHorizontal: 25,
    borderWidth: 1,
    borderRadius: 6,
    overflow: "hidden",
    borderColor: Colors.BORDER_COLOR,
  },
  tinyLogo: {
    width: "100%",
    height: 400,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  uploadingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  uploadBtnContainer: {
    padding: 5,
    backgroundColor: Colors.RED,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  uploadText: {
    color: Colors.WHITE,
  },
  fileNameText: {
    marginLeft: 5,
    flex: 1,
  },
  btnRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  submitBtnContainer: {
    padding: 7,
    backgroundColor: Colors.RED,
    borderRadius: 5,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  submitBtnText: {
    color: Colors.WHITE,
    fontSize: 16,
  },
});
