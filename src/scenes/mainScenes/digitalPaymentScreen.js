import React, { useState, useRef, useEffect } from "react";
import { Colors } from "../../styles";
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import uuid from "react-native-uuid";
import * as AsyncStore from "../../asyncStore";
import { client } from "../../networking/client";
import URL from "../../networking/endpoints";
import { clearSaveApiRes, getBranchesList, saveQrCode } from "../../redux/digitalPaymentReducer";
import { useDispatch, useSelector } from "react-redux";
import { DropDownSelectionItem } from "../../pureComponents";
import {
  DropDownComponant,
  ImagePickerComponent,
  LoaderComponent,
} from "../../components";
import { showToast, showToastRedAlert, showToastSucess } from "../../utils/toast";
import { useIsFocused } from "@react-navigation/native";

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
  const [dropDownData, setDropDownData] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState("");
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [shownUploadSection, setShownUploadSection] = useState(false);

  useEffect(() => {
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
    const { orgId, branchId } = parsedData;
    await dispatch(getBranchesList(orgId));
    getQrCode(orgId, branchId);
    await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
      setAuthToken(token);
    });
  };

  const getLatestQrList = async () => {
    const response = await client.get(URL.QR(orgId));
    const qr = await response.json();
    qr.reverse();
    setDataList(qr);
    dispatch(clearSaveApiRes());
  }

  const getQrCode = async (orgId, branchId) => {
    const response = await client.get(URL.QR(orgId));
    const qr = await response.json();
    if (qr.length > 0) {
      dispatch(clearSaveApiRes());
      qr.reverse();
      setDataList(qr);
      for (let i = 0; i < qr.length; i++) {
        if (qr[i].branchId == branchId) {
          setFileData({
            ...fileData,
            uri: qr[i].documentPath,
            name: qr[i].fileName,
            universalId: qr[i].universalid,
            type: qr[i].fileName.substring(qr[i].fileName.lastIndexOf(".") + 1),
          });
          break;
        }
      }
    } else {
      setFileData({
        ...fileData,
        uri: "https://www.bigpharmacy.com.my/scripts/timthumb.php",
      });
    }
  };

  useEffect(() => {
    let newArr = [];
    for (let i = 0; i < selector.branches.length; i++) {
      let obj = {
        ...selector.branches[i],
        selected:
          selector.branches[i].branchId == userData.branchId ? true : false,
      };
      newArr.push(obj);
      if (selector.branches[i].branchId == userData.branchId) {
        setSelectedBranches(selector.branches[i].name);
      }
    }
    setBranchList(Object.assign([], newArr));
  }, [selector.branches]);

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
            setFileData({
              ...fileData,
              uri: response.documentPath,
              type: fileType,
              name: response.fileName ? response.fileName : fileName,
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

  const submitClick = () => {
    if (selectedBranchIds.length <= 0) {
      showToast("Please select Dealer Code");
      return;
    }
    if (!fileData.uri) {
      showToast("Please choose image");
      return;
    }

    let branchArrPayload = [];
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
    }

    dispatch(saveQrCode(branchArrPayload));
  };

  useEffect(() => {
    if(selector.saveQrCodeSuccess == "success"){
      showToastSucess("QR Code updated successfully");
      getLatestQrList();
    }
  }, [selector.saveQrCodeSuccess]);
  

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
          if (item?.length > 0) {
            item.forEach((obj) => {
              if (obj.selected != undefined && obj.selected == true) {
                names.push(obj.name);
                branchIds.push(obj.branchId);
              }
            });
            selectedNames = names?.join(", ");
          }

          if (branchIds.length == 1) {
            if (dataList.length > 0) {
              let flag = 0;
              for (let i = 0; i < dataList.length; i++) {
                if (dataList[i].branchId == branchIds[0]) {
                  flag = 1;
                  setFileData({
                    ...fileData,
                    uri: dataList[i].documentPath,
                    name: dataList[i].fileName,
                    universalId: dataList[i].universalid,
                    type: dataList[i].fileName.substring(
                      dataList[i].fileName.lastIndexOf(".") + 1
                    ),
                  });
                  break;
                }
              }
              if (flag == 0) {
                setFileData({
                  ...fileData,
                  name: "",
                  universalId: "",
                  type: "",
                  uri: "https://www.bigpharmacy.com.my/scripts/timthumb.php",
                });
              }
            } else {
              setFileData({
                ...fileData,
                uri: "https://www.bigpharmacy.com.my/scripts/timthumb.php",
              });
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
              uri: fileData.uri
                ? fileData.uri
                : "https://www.bigpharmacy.com.my/scripts/timthumb.php",
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
              label={"Dealer Code"}
              value={selectedBranches}
              onPress={() => dropDownItemClicked()}
              takeMinHeight={true}
            />

            <TouchableOpacity
              style={styles.submitBtnContainer}
              onPress={() => submitClick()}
            >
              <Text style={styles.submitBtnText}>Submit</Text>
            </TouchableOpacity>
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
  submitBtnContainer: {
    padding: 7,
    backgroundColor: Colors.RED,
    borderRadius: 5,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginTop: 15,
  },
  submitBtnText: {
    color: Colors.WHITE,
    fontSize: 16,
  },
});
