import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Pressable,
  Alert,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { IconButton, Divider, List, Button } from "react-native-paper";
import { Colors, GlobalStyle } from "../../styles";
import VectorImage from "react-native-vector-image";
import { useSelector, useDispatch } from "react-redux";
import { AppNavigator } from "../../navigations";
import { AuthContext } from "../../utils/authContext";
import realm from "../../database/realm";
import * as AsyncStore from "../../asyncStore";
// import { useNavigation } from '@react-navigation/native';
import { useIsFocused, useRoute } from "@react-navigation/native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Entypo from "react-native-vector-icons/FontAwesome";
import { client } from "../../networking/client";
import URL, { baseUrl, profileImageUpdate } from "../../networking/endpoints";
import BackgroundService from "react-native-background-actions";

// import { EVENT_MANAGEMENT, CUSTOMER_RELATIONSHIP, DOCUMENT_WALLET, HOME_LINE, BOOKING_TRACKER } from "../assets/svg";

import EVENT_MANAGEMENT from "../../assets/images/event_management.svg";
import CUSTOMER_RELATIONSHIP from "../../assets/images/customer_relationship.svg";
import DOCUMENT_WALLET from "../../assets/images/document_wallet.svg";
import HOME_LINE from "../../assets/images/home_line.svg";
import BOOKING_TRACKER from "../../assets/images/booking_tracker.svg";
import QR_CODE from "../../assets/images/qr-code.svg";
import GROUP from "../../assets/images/Group.svg";
import TRANSFER from "../../assets/images/Transfer.svg";
import {
  BOOKING_TRACKER_STR,
  CUSTOMER_RELATIONSHIP_STR,
  DOCUMENT_WALLET_STR,
  EVENT_MANAGEMENT_STR,
  HOME_LINE_STR,
  QR_CODE_STR,
  GROUP_STR,
  TRANSFER_STR,
} from "../../redux/sideMenuReducer";
import { clearState } from "../../redux/homeReducer";
import { clearEnqState } from "../../redux/enquiryReducer";
import { clearLeadDropState } from "../../redux/leaddropReducer";
import ReactNativeModal from "react-native-modal";
import { EventRegister } from "react-native-event-listeners";
import { setBranchId, setBranchName } from "../../utils/helperFunctions";
import { myTaskClearState } from "../../redux/mytaskReducer";
import Snackbar from "react-native-snackbar";
import NetInfo from "@react-native-community/netinfo";

const screenWidth = Dimensions.get("window").width;
const profileWidth = screenWidth / 6;
const profileBgWidth = profileWidth + 5;

const receptionMenu = [
  "Home",
  "Upcoming Deliveries",
  "Live Leads",
  "Settings",
  "Drop/Lost/Cancel",
  "Digital Payment",
  "My Attendance",
  "Helpdesk",
  // "Task Management",
  "Drop Analysis",
  "QR Code",
  "Sign Out",
];

const teleCollerMenu = [
  "Home",
  "Settings",
  "Digital Payment",
  "Target Planning",
  "My Attendance",
  "Helpdesk",
  // "Task Management",
  "QR Code",
  "Drop Analysis",
  "Sign Out",
];

const ShowRoomMenu = [
  "Home",
  "Live Leads",
  "Settings",
  "Digital Payment",
  "Target Planning",
  "My Attendance",
  "Geolocation",
  "Helpdesk",
  // "Task Management",
  "QR Code",
  "Drop Analysis",
  "Sign Out",
];

const FieldDSEMenu = [
  "Home",
  "Live Leads",
  "Settings",
  "Digital Payment",
  "Target Planning",
  "My Attendance",
  "Geolocation",
  "Helpdesk",
  // "Task Management",
  "QR Code",
  "Drop Analysis",
  "Sign Out",
];
const MDMenu = [
  "Home",
  "Live Leads",
  "Settings",
  "Digital Payment",
  "Digital Dashboard",
  "Target Planning",
  "My Attendance",
  "Helpdesk",
  // "Task Management",
  "Task Transfer",
  "QR Code",
  "Drop Analysis",
  "Sign Out",
];

const SalesConsultant = [
  "Home",
  "Live Leads",
  "Target Planning",
  "My Attendance",
  "Geolocation",
  "Drop/Lost/Cancel",
  "Task Transfer",
  "Helpdesk",
  "Settings",
  "QR Code",
  "Drop Analysis",
  "Sign Out",
];

const SideMenuScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.sideMenuReducer);
  const homeSelector = useSelector((state) => state.loginReducer);
  const homeSelectorNew = useSelector((state) => state.homeReducer);
  const dispatch = useDispatch();
  // const isFocused = useIsFocused();

  const { signOut } = React.useContext(AuthContext);
  const [empName, setEmpName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [newTableData, setNewTableData] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [hrmsRole, setHrmsRole] = useState("");
  const [isExist, setIsExist] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [isNetworkPoor, setisNetworkPoor] = useState(false);
  // const route = useRoute();

  useEffect(() => {
    getLoginEmployeeData();

    EventRegister.addEventListener("ForceLogout", (res) => {
      if (res) {
        signOutClicked();
      }
    });

    let isdiloadopen = false;
    EventRegister.addEventListener("poorNetwork", (res) => {
      if (res) {
        // todo

        if (!isdiloadopen) {
          isdiloadopen = true;

          RenderPoorNetWorkError();

          setTimeout(() => {
            isdiloadopen = false;

            Snackbar.dismiss();
          }, 4000);
        }
      }
    });
    return () => {
      EventRegister.removeEventListener();
    };
    // getProfilePic();
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getUserRole();
    });
  }, [navigation]);

  const getUserRole = async () => {
    let employeeData = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      setHrmsRole(jsonObj.hrmsRole);
    }
  };

  // useEffect(() => {
  //     if(userData){
  //         getProfilePic();
  //     }
  // }, [userData])

  useEffect(() => {
    if (homeSelector.login_employee_details) {
      const jsonObj = homeSelector.login_employee_details;
      updateUserData(jsonObj);
      getProfilePic(jsonObj);
    }
  }, [homeSelector.login_employee_details]);

  const getLoginEmployeeData = async () => {
    const jsonString = await AsyncStore.getData(AsyncStore.Keys.LOGIN_EMPLOYEE);
    if (jsonString) {
      const jsonObj = JSON.parse(jsonString);
      updateUserData(jsonObj);
      getProfilePic(jsonObj);
    }
  };

  const getProfilePic = (userData) => {
    if (
      userData.empId == undefined ||
      userData.orgId == undefined ||
      userData.branchId == undefined
    ) {
      return;
    }
    // client.get(`http://ec2-15-207-225-163.ap-south-1.compute.amazonaws.com:8008/sales/employeeprofilepic/get/${userData.empId}/${userData.orgId}/${userData.branchId}`)
    client
      .get(
        `${baseUrl}sales/employeeprofilepic/get/${userData.empId}/${userData.orgId}/${userData.branchId}`
      )
      .then((response) => response.json())
      .then((json) => {
        setDataList(json);
        if (json.length > 0) {
          setImageUri(json[json.length - 1].documentPath);
          setInitialData(json[json.length - 1]);
          setIsExist(true);
        } else {
          setIsExist(false);
          setImageUri(
            "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
          );
        }
      })
      .catch((error) => console.error(error));

    // fetch(
    //   `http://automatestaging-724985329.ap-south-1.elb.amazonaws.com:8081/sales/employeeprofilepic/get/${userData.empId}/${userData.orgId}/${userData.branchId}`
    // )
    //   .then((response) => response.json())
    //   .then((json) => {
    //
    //     setDataList(json);
    //     if (json.length > 0) {
    //       setImageUri(json[json.length - 1].documentPath);
    //       setInitialData(json[json.length - 1]);
    //       setIsExist(true);
    //     } else {
    //       setIsExist(false);
    //       setImageUri(
    //         "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
    //       );
    //     }
    //   })
    //   .catch((error) => console.error(error));
  };

  const updateUserData = (jsonObj) => {
    setEmpName(jsonObj.empName);
    setEmail(jsonObj.email);
    setRole(jsonObj.hrmsRole);
    setLocation(jsonObj.branchName);
    setUserData(jsonObj);
    // setUserData(jsonObj)
    getProfilePic(jsonObj);
    let newFilterData = [];
    if (jsonObj.hrmsRole === "Reception" || jsonObj.hrmsRole === "CRM") {
      newFilterData = selector.tableData.filter((item) =>
        receptionMenu.includes(item.title)
      );
    } else if (jsonObj.hrmsRole === "Tele Caller") {
      newFilterData = selector.tableData.filter((item) =>
        teleCollerMenu.includes(item.title)
      );
    } else if (jsonObj.hrmsRole === "Showroom DSE") {
      newFilterData = selector.tableData.filter((item) =>
        ShowRoomMenu.includes(item.title)
      );
    } else if (jsonObj.hrmsRole === "Field DSE") {
      newFilterData = selector.tableData.filter((item) =>
        FieldDSEMenu.includes(item.title)
      );
    } else if (jsonObj.hrmsRole === "Walkin DSE") {
      newFilterData = selector.tableData.filter((item) =>
        SalesConsultant.includes(item.title)
      );
    } else if (jsonObj.hrmsRole === "Sales Manager") {
      newFilterData = selector.tableData.filter((item) =>
        SalesConsultant.includes(item.title)
      );
    } else if (jsonObj.hrmsRole === "MD") {
      newFilterData = selector.tableData.filter((item) =>
        MDMenu.includes(item.title)
      );
    } else {
      newFilterData = selector.tableData;
    }
    setNewTableData([...newFilterData]);
  };

  const itemSelected = (item) => {
    switch (item.screen) {
      case 99:
        // navigation.navigate(AppNavigator.DrawerStackIdentifiers.home);
        navigation.navigate(MDMenu[0]);
        break;
      case 100:
        navigation.navigate(
          AppNavigator.DrawerStackIdentifiers.upcomingDeliveries
        );
        break;
      case 101:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.complaint);
        break;
      case 102:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.settings);
        break;
      case 103:
        navigation.navigate(
          AppNavigator.DrawerStackIdentifiers.eventManagement
        );
        break;
      case 104:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.preBooking);
        break;
      case 105:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.digitalPayment);
        break;
      case 106:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.monthlyTarget);
        break;
      case 107:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.helpdesk);
        break;
      case 108:
        navigation.navigate(AppNavigator.TabStackIdentifiers.myTask);
        break;
      case 109:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.taskTransfer);
        break;
      case 111:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.evtbrlReport);
        break;
      case 113:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropAnalysis);
        break;
      case 114:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.liveLeads);
        break;
      case 115:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.dropLostCancel);
        break;
      case 116:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.attendance);
        break;
      case 117:
        navigation.navigate(AppNavigator.DrawerStackIdentifiers.geolocation);
        break;
      case 118:
        navigation.navigate(
          AppNavigator.DrawerStackIdentifiers.digitalDashboard
        );
        break;
      case 112:
        signOutClicked();
        break;
      // case 999:
      //   navigation.navigate("Target Settings");
      //   break;
    }
  };

  const signOutClicked = async () => {
    AsyncStore.storeData(AsyncStore.Keys.USER_NAME, "");
    AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, "");
    AsyncStore.storeData(AsyncStore.Keys.EMP_ID, "");
    AsyncStore.storeData(AsyncStore.Keys.LOGIN_EMPLOYEE, "");
    AsyncStore.storeData(AsyncStore.Keys.EXTENSION_ID, "");
    AsyncStore.storeData(AsyncStore.Keys.EXTENSSION_PWD, "");
    AsyncStore.storeData(AsyncStore.Keys.IS_LOGIN, "false");
    AsyncStore.storeJsonData(AsyncStore.Keys.TODAYSDATE, new Date().getDate());
    AsyncStore.storeJsonData(AsyncStore.Keys.COORDINATES, []);
    await BackgroundService.stop();

    navigation.closeDrawer();
    //realm.close();
    setBranchId("");
    setBranchName("");
    dispatch(clearState());
    dispatch(clearState());
    dispatch(myTaskClearState());
    dispatch(clearEnqState());
    dispatch(clearLeadDropState());
    signOut();
  };

  const selectImage = () => {
    let options = {
      title: "you can choose anyimage",
      maxWidth: 256,
      maxHeight: 256,
      storageOptions: {
        skipBack: true,
      },
    };

    launchImageLibrary(options, (Response) => {
      setShowModal(false);
      if (Response.didCancel) {
        Alert.alert("user cancelled");
      } else if (Response.errorMessage) {
        Alert.alert(Response.errorMessage);
      } else if (Response.assets) {
        let Object = Response.assets[0];
        const uriLink = Object.uri;
        const uriObject = {
          uri: uriLink,
        };
        // setImageUri(uriObject);
        if (isExist) {
          updateProfilePic(uriObject);
        } else {
          uploadProfile(uriObject);
        }
      }
    });
  };

  const uploadProfile = (uri) => {
    const formdata = new FormData();
    formdata.append("documentType", "profilePic");
    formdata.append("file", {
      type: "image/jpg",
      uri: uri.uri,
      name: "image.jpg",
    });

    // client.post(URL.UPLOAD_PROFILE(userData.empId, userData.orgId, userData.branchId))
    //   .then((response) => response.json())
    //   .then(async (json) => {
    //
    //     const inputData = {
    //       ownerId: userData.empId,
    //       branchId: userData.branchId,
    //       orgId: userData.orgId,
    //       fileName: json.fileName,
    //       documentPath: json.documentPath,
    //       universalid: json.universalId,
    //     };
    //     const response = await client.post(URL.SAVE_PROFILE(), inputData);
    //     const saveProfile = await response.json();
    //     if (saveProfile.success) {
    //       setIsExist(true);
    //       let newInitial = {
    //         id: saveProfile.dmsEntity.employeeProfileDtos[0].id,
    //         universalid: json?.universalId,
    //       };
    //       setInitialData(newInitial);
    //       setImageUri(
    //         saveProfile.dmsEntity.employeeProfileDtos[0].documentPath ||
    //         "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
    //       );
    //     }
    //     // setDataList(json);
    //   })
    //   .catch((error) => console.error(error));
    AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
      fetch(
        URL.UPLOAD_PROFILE(userData.empId, userData.orgId, userData.branchId),
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
          body: formdata,
        }
      )
        .then((response) => response.json())
        .then(async (json) => {
          const inputData = {
            ownerId: userData.empId,
            branchId: userData.branchId,
            orgId: userData.orgId,
            fileName: json.fileName,
            documentPath: json.documentPath,
            universalid: json.universalId,
          };
          const response = await client.post(URL.SAVE_PROFILE(), inputData);
          const saveProfile = await response.json();
          if (saveProfile.success) {
            setIsExist(true);
            let newInitial = {
              id: saveProfile.dmsEntity.employeeProfileDtos[0].id,
              universalid: json?.universalId,
            };
            setInitialData(newInitial);
            setImageUri(
              saveProfile.dmsEntity.employeeProfileDtos[0].documentPath ||
                "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
            );
          }
          // setDataList(json);
        })
        .catch((error) => console.error(error));
    });
  };

  const updateProfilePic = async (uri) => {
    try {
      let newPayload = {
        ownerId: userData.empId,
        branchId: userData.branchId,
        orgId: userData.orgId,
        id: initialData.id,
        fileName: "image.jpg",
        documentPath: uri.uri,
        universalid: initialData.universalId,
      };
      const response = await client.post(
        profileImageUpdate + "/update",
        newPayload
      );
      const saveProfile = await response.json();
      setImageUri(
        saveProfile.dmsEntity.employeeProfileDtos[0].documentPath ||
          "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
      );
    } catch (err) {}
  };

  const deleteProfilePic = async () => {
    AsyncStore.getData(AsyncStore.Keys.USER_TOKEN).then((token) => {
      if (token.length > 0) {
        fetch(profileImageUpdate + "/delete?id=" + initialData?.id, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(),
        })
          .then((response) => response.json())
          .then((json) => {
            if (json?.success) {
              setImageUri(
                "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
              );
              setIsExist(false);
              setShowModal(false);
            }
          })
          .catch((error) => {
            setShowModal(false);
            console.error(error);
          });
      }
    });

    // try {
    //     // let newPayload = {
    //     //     ownerId: userData.empId,
    //     //     branchId: userData.branchId,
    //     //     orgId: userData.orgId,
    //     //     id: initialData.id,
    //     //     fileName: "image.jpg",
    //     //     documentPath: uri.uri,
    //     //     universalid: initialData.universalId,
    //     // };
    //     const response = await client.post(profileImageUpdate + "/delete");
    //     const saveProfile = await response.json();
    //     // setImageUri(
    //     //     saveProfile.dmsEntity.employeeProfileDtos[0].documentPath ||
    //     //     "https://www.treeage.com/wp-content/uploads/2020/02/camera.jpg"
    //     // );
    // } catch (err) {
    // }
  };

  const RenderPoorNetWorkError = () => {
    return Snackbar.show({
      text: "Poor network Please check your internet connection",
      textColor: Colors.WHITE,
      backgroundColor: Colors.GRAY,
      duration: Snackbar.LENGTH_INDEFINITE,
      position: "top",
    });
    // return Alert.alert(
    //   "Poor Network",
    //   "Please check your internet connection",
    //   [
    //     {
    //       text: "OK", onPress: () => {
    //         // isNetworkDialogopen = false;

    //       }
    //     }
    //   ]
    // );
  };

  const RenderModal = () => {
    return (
      <ReactNativeModal
        onBackdropPress={() => {
          setShowModal(false);
        }}
        transparent={true}
        visible={showModal}
      >
        <View style={styles.newModalContainer}>
          <TouchableWithoutFeedback
            style={styles.actionButtonContainer}
            onPress={() => {}}
          >
            <>
              <Button
                onPress={() => {
                  setImagePath(imageUri);
                  setShowModal(false);
                }}
                color="black"
              >
                {"View Image"}
              </Button>

              <View style={styles.divider} />
              <Button
                onPress={() => {
                  selectImage();
                }}
                color="black"
              >
                {"Upload Image"}
              </Button>
              <View style={styles.divider} />
              <Button
                onPress={deleteProfilePic}
                disabled={isExist ? false : true}
                color="black"
              >
                {"Delete Image"}
              </Button>
            </>
          </TouchableWithoutFeedback>
        </View>
      </ReactNativeModal>
    );
  };

  const ImageViewModal = () => {
    return (
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
              style={{ width: "100%", height: 300, borderRadius: 4 }}
              resizeMode="contain"
              source={{ uri: imagePath }}
            />
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImagePath("")}
          >
            <Text style={styles.closeButtonTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Image View Modal Starts */}
      <ImageViewModal />
      {/* Image View Modal End */}

      {/* <View style={styles.topView}>
                <IconButton
                    icon={"chevron-left"}
                    size={30}
                    color={Colors.DARK_GRAY}
                    onPress={() => {
                        navigation.closeDrawer();
                    }}
                />
                <Text style={styles.nameStyle}>
                    {"Welcome "}
                    <Text style={[styles.nameStyle, { fontSize: 12 }]}>
                        {empName + ","}
                    </Text>
                </Text>
            </View> */}

      <View style={styles.profileContainerView}>
        {/* Profile Pic Action Options */}
        <RenderModal />
        <View style={styles.profileBgVw}>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <View style={styles.editButton}>
              <Entypo size={12} name="pencil" color={Colors.WHITE} />
            </View>
            <Image
              style={{
                width: profileWidth,
                height: profileWidth,
                borderRadius: profileWidth / 2,
              }}
              source={{
                uri: imageUri,
              }}
              // source={imageUri}
              //  source={require("../../assets/images/bently.png")}
            />
          </TouchableOpacity>
          <View style={styles.profilDetailes}>
            <Text style={styles.nameStyle}>{empName}</Text>
            <Text style={styles.text1}>{role}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.text2}>
            {"Email:  "}
            <Text
              style={[styles.text2, { color: Colors.GRAY, fontWeight: "bold" }]}
            >
              {email}
            </Text>
          </Text>
          {/* <Text style={styles.text2}>{"Office Location: " + location}</Text> */}
          <Text style={styles.text2}>
            {"Office Location:  "}
            <Text style={{ color: Colors.GRAY, fontWeight: "bold" }}>
              {location || "No Location Set"}
            </Text>
          </Text>
        </View>
      </View>
      <Divider />
      {/* {userData !== null && */}
      <FlatList
        data={newTableData}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => {
          const isActive = false;
          const textColor = "gray";
          // const isActive = route?.state?.index == index;
          // const textColor = isActive ? Colors.PINK : "gray";
          return (
            <>
              {item.title === "Task Transfer" ? (
                !hrmsRole.toLowerCase().includes("dse") ? (
                  <Pressable onPress={() => itemSelected(item)}>
                    <View
                      style={{
                        paddingLeft: 10,
                        height: 55,
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          height: 25,
                          alignItems: "center",
                          paddingLeft: 10,
                          marginBottom: 5,
                        }}
                      >
                        <Image
                          style={{
                            height: 20,
                            width: 20,
                          }}
                          source={item.pngIcon}
                        />
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "bold",
                            marginLeft: 25,
                            color: textColor,
                          }}
                        >
                          {item.title}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ) : null
              ) : (
                <Pressable onPress={() => itemSelected(item)}>
                  <View
                    style={{
                      paddingLeft: 10,
                      height: 55,
                      justifyContent: "center",
                      backgroundColor: isActive
                        ? Colors.PINK + 15
                        : Colors.WHITE,
                      borderRadius: 10,
                    }}
                  >
                    {/* <List.Item
                  title={item.title}
                  titleStyle={{ fontSize: 16, fontWeight: "600" }}
                  left={(props) => <List.Icon {...props} icon="folder" style={{ margin: 0 }} />}
                /> */}
                    <View
                      style={{
                        flexDirection: "row",
                        height: 25,
                        alignItems: "center",
                        paddingLeft: 10,
                        marginBottom: 5,
                      }}
                    >
                      {/* <VectorImage source={item.icon} width={20} height={20} /> */}
                      <Image
                        style={{ height: 20, width: 20 }}
                        source={item.pngIcon}
                      />
                      {/* {item.icon === EVENT_MANAGEMENT_STR && <EVENT_MANAGEMENT width={20} height={20} color='green' />}
                                    {item.icon === CUSTOMER_RELATIONSHIP_STR && <CUSTOMER_RELATIONSHIP width={20} height={20} color={'black'} />}
                                    {item.icon === DOCUMENT_WALLET_STR && <DOCUMENT_WALLET width={20} height={20} color={'black'} />}
                                    {item.icon === HOME_LINE_STR && <HOME_LINE width={20} height={20} color={'black'} />}
                                    {item.icon === BOOKING_TRACKER_STR && <BOOKING_TRACKER width={20} height={20} color={'black'} />}
                                    {item.icon === QR_CODE_STR && <QR_CODE width={20} height={20} color={'black'} />}
                                    {item.icon === GROUP_STR && <GROUP width={20} height={20} color={'black'} />}
                                    {item.icon === TRANSFER_STR && <TRANSFER width={20} height={20} color={'black'} />} */}
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          marginLeft: 25,
                          color: textColor,
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                    {/* <Divider /> */}
                  </View>
                </Pressable>
              )}
            </>
          );
        }}
      />
      {/* } */}
      {/* <View style={styles.bottomVw}>
                <Button
                    icon="logout"
                    mode="contained"
                    style={{ marginHorizontal: 40 }}
                    contentStyle={{ backgroundColor: Colors.RED }}
                    labelStyle={{
                        fontSize: 14,
                        fontWeight: "600",
                        textTransform: "none",
                    }}
                    onPress={signOutClicked}
                >
                    Sign Out
        </Button>
            </View> */}
    </SafeAreaView>
  );
};

export default SideMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  topView: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
    overflow: "hidden",
  },
  profilDetailes: {
    marginLeft: 10,
    width: "75%",
  },
  nameStyle: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  text1: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "200",
    // textAlign: 'center',
    color: Colors.DARK_GRAY,
  },
  profileContainerView: {
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  text2: {
    marginTop: 5,
    fontSize: 14,
    // fontWeight: "400",
    color: Colors.GRAY,
  },
  profileBgVw: {
    // width: profileBgWidth,
    // height: profileBgWidth,
    // borderRadius: profileBgWidth / 2,
    backgroundColor: Colors.WHITE,
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  bottomVw: {
    bottom: 0,
    paddingVertical: 20,
  },
  editButton: {
    position: "absolute",
    top: -1,
    right: 0,
    zIndex: 2,
    backgroundColor: "#f81567e3",
    borderRadius: 30,
    padding: 4,
  },
  divider: {
    width: "85%",
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignSelf: "center",
    // opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  crossButton: {
    top: "-40%",
    right: -25,
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonContainer: {
    // backgroundColor: "white",
    justifyContent: "space-evenly",
    flexDirection: "column",
  },
  newModalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    maxHeight: "50%",
    maxWidth: "100%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
    marginTop: "30%",
    marginLeft: "15%",
    elevation: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    top: 0,
    position: "absolute",
  },
  closeButton: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: "37%",
    bottom: "15%",
    borderRadius: 5,
    backgroundColor: Colors.RED,
  },
  closeButtonTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.WHITE,
  },
});
