import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  StatusBar,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Colors, GlobalStyle } from "../../styles";
import { TextinputComp } from "../../components/textinputComp";
import { ButtonComp } from "../../components/buttonComp";
import { useSelector, useDispatch } from "react-redux";
import {
  clearState,
  updateEmployeeId,
  updatePassword,
  updateSecurePassword,
  showErrorMessage,
  postUserData,
  getPreEnquiryData,
  getMenuList,
  getCustomerTypeList,
  getCarModalList,
  clearUserNameAndPass,
  getEmpId,
} from "../../redux/loginReducer";
import { getCallRecordingCredentials } from "../../../redux/callRecordingReducer";
import { AuthNavigator } from "../../navigations";
import { IconButton } from "react-native-paper";
import { AuthContext } from "../../utils/authContext";
import { LoaderComponent } from "../../components";
import * as AsyncStore from "../../asyncStore";
import {
  showAlertMessage,
  showToast,
  showToastRedAlert,
} from "../../utils/toast";
import BackgroundService from "react-native-background-actions";
import Geolocation from "@react-native-community/geolocation";
import {
  distanceFilterValue,
  getDistanceBetweenTwoPoints,
  officeRadius,
  options,
  sendAlertLocalNotification,
  sendLocalNotification,
  sleep,
} from "../../service";
import URL, {
  getDetailsByempIdAndorgId,
  locationUpdate,
  saveLocation,
} from "../../networking/endpoints";
import { client } from "../../networking/client";
import {
  isEmail,
  isValidate,
  PincodeDetailsNew,
  setBranchId,
  setBranchName,
} from "../../utils/helperFunctions";
import { DropDownSelectionItem, RadioTextItem } from "../../pureComponents";
import { NewDropDownComponent } from "../../components/dropDownComponent";
import { Dropdown } from "react-native-element-dropdown";
import { AuthStackIdentifiers } from "../../navigations/authNavigator";

// import { TextInput } from 'react-native-paper';
const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

const RegisterScreen = ({ navigation }) => {
  const { signOut } = React.useContext(AuthContext);

  const selector = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const fadeAnima = useRef(new Animated.Value(0)).current;
  const { signIn } = React.useContext(AuthContext);
  const [text, setText] = React.useState("");
  const [number, onChangeNumber] = React.useState(null);
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [Designation, setDesignation] = useState("");
  const [rolelist, setRolelist] = useState("");
  const [Designationlist, setDesignationlist] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [addressData2, setAddressData2] = useState([]);
  const [permanentAddress, setPermanentAddress] = useState({
    pincode: "",
    isUrban: "",
    isRural: null,
    houseNo: "",
    street: "",
    village: "",
    city: "",
    district: "",
    state: "",
    mandal: "",
    country: null,
  });
  const [communicationAddress, setCommunication] = useState({
    pincode: "",
    isUrban: "",
    isRural: null,
    houseNo: "",
    street: "",
    village: "",
    city: "",
    district: "",
    state: "",
    mandal: "",
    country: null,
  });

  useEffect(() => {
    Animated.timing(fadeAnima, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // if (selector.offlineStatus == "completed") {
    //   setTimeout(() => {
    //     signIn(selector.authToken);
    //     dispatch(clearState());
    //   }, 3000);
    // }
  }, [selector.offlineStatus]);

  useEffect(async () => {
    try {
      const response = await client.get(URL.GET_ROLES_LIST());
      const response2 = await client.get(URL.GET_DESGINATION_LIST());
      const json = await response.json();
      const json2 = await response2.json();
      if (json && json2) {
        setRolelist(json);
        setDesignationlist(json2);
      }
    } catch (error) {}
  }, []);

  const loginClicked = () => {
    const employeeId = selector.employeeId;
    const password = selector.password;

    if (employeeId.length === 0) {
      let object = {
        key: "EMPLOYEEID",
        message: "Please enter username",
      };
      dispatch(showErrorMessage(object));
      return;
    }

    if (password.length === 0) {
      let object = {
        key: "PASSWORD",
        message: "Please enter password",
      };
      dispatch(showErrorMessage(object));
      return;
    }

    let object = {
      username: employeeId,
      password: password,
    };

    dispatch(postUserData(object));
  };

  // Handle Login Success Response

  useEffect(() => {
    if (selector.status == "sucess") {
      //signIn(selector.authToken);

      AsyncStore.storeData(
        AsyncStore.Keys.USER_NAME,
        selector.userData.userName
      );
      AsyncStore.storeData(
        AsyncStore.Keys.ORG_ID,
        String(selector.userData.orgId)
      );
      AsyncStore.storeData(
        AsyncStore.Keys.REFRESH_TOKEN,
        selector.userData.refreshToken
      );

      AsyncStore.storeData(
        AsyncStore.Keys.USER_TOKEN,
        selector.userData.accessToken
      ).then(() => {
        dispatch(getMenuList(selector.userData.userName));
        dispatch(getEmpId(selector.userData.userName));

        let data = {
          userName: selector.userData.userName,
          orgId: selector.userData.orgId,
        };

        // dispatch(getCallRecordingCredentials(data))
        // dispatch(getCustomerTypeList());
        // dispatch(getCarModalList(selector.userData.orgId))
        // signIn(selector.authToken);
        // dispatch(clearState());
      });
      dispatch(clearUserNameAndPass());
    } else {
    }
  }, [selector.status]);

  useEffect(() => {
    if (selector.menuListStatus == "completed") {
      // if (selector.branchesList.length > 1) {
      //   navigation.navigate(AuthNavigator.AuthStackIdentifiers.SELECT_BRANCH, { isFromLogin: true, branches: selector.branchesList })
      // }
      if (selector.branchesList.length > 0) {
        const branchId = selector.branchesList[0].branchId;
        const branchName = selector.branchesList[0].branchName;
        AsyncStore.storeData(
          AsyncStore.Keys.SELECTED_BRANCH_ID,
          branchId.toString()
        );
        AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_NAME, branchName);
        setBranchId(branchId);
        setBranchName(branchName);
        signIn(selector.authToken);
        dispatch(clearState());
      } else {
        showToast("No branches found");
      }
      //getPreEnquiryListFromServer();
    } else if (selector.menuListStatus == "failed") {
      showToast("something went wrong");
    }
  }, [selector.menuListStatus, selector.branchesList]);

  const getPreEnquiryListFromServer = async () => {
    let endUrl =
      "?limit=10&offset=" + "0" + "&status=PREENQUIRY&empId=" + selector.empId;
    dispatch(getPreEnquiryData(endUrl));
  };

  const forgotClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.FORGOT);
  };

  const initialData = async () => {
    AsyncStore.storeJsonData(AsyncStore.Keys.TODAYSDATE, new Date().getDate());
    AsyncStore.storeJsonData(AsyncStore.Keys.COORDINATES, []);
    getCoordinates();
  };

  function createDateTime(time) {
    var splitted = time.split(":");
    if (splitted.length != 2) return undefined;

    var date = new Date();
    date.setHours(parseInt(splitted[0], 10));
    date.setMinutes(parseInt(splitted[1], 10));
    date.setSeconds(0);
    return date;
  }

  const objectsEqual = (o1, o2) =>
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every((p) => o1[p] === o2[p]);

  const getCoordinates = async () => {
    try {
      let coordinates = await AsyncStore.getJsonData(
        AsyncStore.Keys.COORDINATES
      );
      let todaysDate = await AsyncStore.getData(AsyncStore.Keys.TODAYSDATE);
      if (todaysDate != new Date().getDate()) {
        initialData();
      } else {
        var startDate = createDateTime("8:30");
        var startBetween = createDateTime("9:30");
        var endBetween = createDateTime("20:30");
        var endDate = createDateTime("21:30");
        var now = new Date();
        var isBetween = startDate <= now && now <= endDate;
        if (isBetween) {
          Geolocation.watchPosition(
            async (lastPosition) => {
              const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
              );
              if (employeeData) {
                const jsonObj = JSON.parse(employeeData);
                const trackingResponse = await client.get(
                  getDetailsByempIdAndorgId +
                    `/${jsonObj.empId}/${jsonObj.orgId}`
                );
                const trackingJson = await trackingResponse.json();
                var newLatLng = {
                  latitude: lastPosition.coords.latitude,
                  longitude: lastPosition.coords.longitude,
                };
                let dist = getDistanceBetweenTwoPoints(
                  officeLocation.latitude,
                  officeLocation.longitude,
                  lastPosition.coords.latitude,
                  lastPosition.coords.longitude
                );

                if (dist > officeRadius) {
                  sendAlertLocalNotification();
                } else {
                  // seteReason(false);
                }
                let parsedValue =
                  trackingJson.length > 0
                    ? JSON.parse(trackingJson[trackingJson.length - 1].location)
                    : null;
                if (coordinates.length > 0 && parsedValue) {
                  if (
                    objectsEqual(
                      coordinates[coordinates.length - 1],
                      parsedValue[parsedValue.length - 1]
                    )
                  ) {
                    return;
                  }
                }
                let newArray = [...coordinates, ...[newLatLng]];
                let date = new Date(
                  trackingJson[trackingJson.length - 1]?.createdtimestamp
                );
                let condition = date.getDate() == new Date().getDate();
                if (trackingJson.length > 0 && condition) {
                  let tempPayload = {
                    id: trackingJson[trackingJson.length - 1]?.id,
                    orgId: jsonObj?.orgId,
                    empId: jsonObj?.empId,
                    branchId: jsonObj?.branchId,
                    currentTimestamp: new Date().getTime(),
                    updateTimestamp: new Date().getTime(),
                    purpose: "",
                    location: JSON.stringify(newArray),
                  };
                  const response = await client.put(
                    locationUpdate +
                      `/${trackingJson[trackingJson.length - 1].id}`,
                    tempPayload
                  );
                  const json = await response.json();
                  await AsyncStore.storeJsonData(
                    AsyncStore.Keys.COORDINATES,
                    newArray
                  );
                } else {
                  let payload = {
                    id: 0,
                    orgId: jsonObj?.orgId,
                    empId: jsonObj?.empId,
                    branchId: jsonObj?.branchId,
                    currentTimestamp: new Date().getTime(),
                    updateTimestamp: new Date().getTime(),
                    purpose: "",
                    location: JSON.stringify(newArray),
                  };
                  const response = await client.post(saveLocation, payload);
                  const json = await response.json();
                  await AsyncStore.storeJsonData(
                    AsyncStore.Keys.COORDINATES,
                    newArray
                  );
                }
              }
            },
            (error) => {
              console.error(error);
            },
            { enableHighAccuracy: true, distanceFilter: distanceFilterValue }
          );
        }
      }
    } catch (error) {}
  };

  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        // console.log(i);
        var startDate = createDateTime("8:30");
        var startBetween = createDateTime("9:30");
        var endBetween = createDateTime("20:30");
        var endDate = createDateTime("21:30");
        var now = new Date();
        if (startDate <= now && now <= startBetween) {
          sendLocalNotification();
        }
        if (endBetween <= now && now <= endDate) {
          sendLocalNotification();
        }
        try {
          let todaysDate = await AsyncStore.getData(AsyncStore.Keys.TODAYSDATE);
          if (todaysDate) {
            getCoordinates();
          } else {
            initialData();
          }
        } catch (error) {}
        await sleep(delay);
      }
    });
  };

  const startTracking = async () => {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization();
    }
    await Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: "always" | "whenInUse" | "auto",
      locationProvider: "playServices" | "android" | "auto",
    });
    await BackgroundService.start(veryIntensiveTask, options);
  };

  const closeBottomView = () => {
    Animated.timing(fadeAnima, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const updateAddressDetails = (pincode) => {
    if (pincode.length != 6) {
      return;
    }

    PincodeDetailsNew(pincode).then(
      (res) => {
        // dispatch an action to update address
        let tempAddr = [];
        if (res) {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData([...tempAddr]);
              }
            }
          }
        }
        // dispatch(updateAddressByPincode(resolve));
      },
      (rejected) => {}
    );
  };

  const updateAddressDetails2 = (pincode) => {
    if (pincode.length != 6) {
      return;
    }

    PincodeDetailsNew(pincode).then(
      (res) => {
        // dispatch an action to update address
        let tempAddr = [];
        if (res) {
          if (res.length > 0) {
            for (let i = 0; i < res.length; i++) {
              tempAddr.push({ label: res[i].Name, value: res[i] });
              if (i === res.length - 1) {
                setAddressData2([...tempAddr]);
              }
            }
          }
        }
        // dispatch(updateAddressByPincode(resolve));
      },
      (rejected) => {}
    );
  };

  const onSubmit = async () => {
    if (email.length == 0) {
      showToastRedAlert("Please enter Email");
      return;
    }

    if (!isEmail(email)) {
      showToast("Please enter valid email");
      return;
    }
    if (userName.length == 0) {
      showToastRedAlert("Please enter Name");
      return;
    }
    if (!isValidate(userName)) {
      showToast("Please enter alphabetics only in Name");
      return;
    }

    if (mobileNo.length == 0) {
      showToastRedAlert("Please enter mobile number");
      return;
    }
    if (role.length === 0) {
      showToast("Please Select Any Role");
      return;
    }
    if (Designation.length === 0) {
      showToast("Please Select Any Designaion");
      return;
    }
    //  if (password.length > 8) {
    //    showToastRedAlert("Password length must be greater than 8");
    //    return;
    //  }
    //  if (password !== confirmPassword) {
    //    showToastRedAlert("Please Enter Confirm Password Same as Password");
    //    return;
    //  }
    if (communicationAddress.pincode.length === 0) {
      showToast("Please enter Communication pincode");
      return;
    }
    if (permanentAddress.pincode.length === 0) {
      showToast("Please enter Permanent pincode");
      return;
    }

    let payload = {
      email: email,
      empName: userName,
      dmsRole: role,
      mobile: mobileNo,
      dmsDesignation: Designation,
      // password: password,
      address: {
        presentAddress: {
          pincode: communicationAddress.pincode,
          isUrban: communicationAddress.isUrban,
          isRural: communicationAddress.isRural,
          houseNo: communicationAddress.houseNo,
          street: communicationAddress.street,
          village: communicationAddress.village,
          city: communicationAddress.city,
          district: communicationAddress.district,
          state: communicationAddress.state,
          country: null,
        },
        permanentAddress: {
          pincode: permanentAddress.pincode,
          isUrban: permanentAddress.isUrban,
          isRural: permanentAddress.isRural,
          houseNo: permanentAddress.houseNo,
          street: permanentAddress.street,
          village: permanentAddress.village,
          city: permanentAddress.city,
          district: permanentAddress.district,
          state: permanentAddress.state,
          country: null,
        },
      },
    };

    const response = await client.post(URL.SAVE_EMPLOYEE(), payload);
    const json = await response.json();
    console.log("SAVESDDDD", json);
    if (json) {
      showToastRedAlert("Your Account is Successfully created");
      navigation.reset({
        index: 0,
        routes: [{ name: AuthStackIdentifiers.LOGIN }],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <LoaderComponent visible={selector.isLoading} onRequestClose={() => {}} />
      <ScrollView
        // contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="always"
        scrollEnabled
        style={{
          //   flexGrow: 1,
          //   position: "absolute",
          paddingHorizontal: 20,
          //   paddingTop: 30,
          //   marginTop: ScreenHeight * 0.18,
          backgroundColor: Colors.WHITE,
          //   borderTopEndRadius: 4,
        }}
      >
        <View
          style={{ flexDirection: "column", backgroundColor: Colors.WHITE }}
        >
          <View
            style={{
              width: "100%",
              height: ScreenHeight * 0.23,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: 200, height: ScreenHeight * 0.4 }}
              resizeMode={"center"}
              source={require("../../assets/images/logo.png")}
            />
          </View>
        </View>
        <Text style={styles.welcomeStyle}>{"Register"}</Text>
        <TextinputComp
          value={email}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Email"}
          mode={"outlined"}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={{ height: 10 }} />
        <TextinputComp
          value={userName}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Name"}
          mode={"outlined"}
          onChangeText={(text) => setUserName(text)}
        />
        <View style={{ height: 10 }} />
        <TextinputComp
          value={mobileNo}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Mobile Number"}
          mode={"outlined"}
          maxLength={10}
          onChangeText={(text) => setMobileNo(text)}
        />
        <View style={{ height: 10 }} />
        <NewDropDownComponent
          // value={selector.employeeId}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Role"}
          mode={"outlined"}
          labelField={"roleName"}
          valueField={"roleName"}
          data={rolelist ? rolelist : []}
          showDropDown={() => setShowMultiSelectDropDown(true)}
          onDismiss={() => setShowMultiSelectDropDown(false)}
          visible={showMultiSelectDropDown}
          onChangeText={(text) => {
            setRole(text.roleId);
          }}
        />
        <View style={{ height: 10 }} />
        <NewDropDownComponent
          // value={selector.employeeId}
          error={selector.showLoginErr}
          errorMsg={selector.loginErrMessage}
          label={"Designation"}
          mode={"outlined"}
          labelField={"designationName"}
          valueField={"designationName"}
          data={Designationlist ? Designationlist : []}
          showDropDown={() => setShowMultiSelectDropDown(false)}
          onDismiss={() => setShowMultiSelectDropDown(false)}
          visible={showMultiSelectDropDown}
          onChangeText={(text) => {
            console.log(text);
            setDesignation(text.dmsDesignationId);
          }}
        />

        {/* <View style={{ height: 20 }}></View> */}
        {/* <TextinputComp
          value={password}
          error={selector.showPasswordErr}
          errorMsg={selector.passwordErrMessage}
          label={"Password"}
          mode={"outlined"}
          isSecure={selector.securePassword}
          showRightIcon={true}
          rightIconObj={{
            name: selector.securePassword ? "eye-off-outline" : "eye-outline",
            color: Colors.GRAY,
          }}
          onChangeText={(text) => setPassword(text)}
          onRightIconPressed={() => dispatch(updateSecurePassword())}
        /> */}
        {/* <View style={{ height: 20 }}></View> */}
        {/* <TextinputComp
          value={confirmPassword}
          error={selector.showPasswordErr}
          errorMsg={selector.passwordErrMessage}
          label={"Confirm Password"}
          mode={"outlined"}
          isSecure={selector.securePassword}
          showRightIcon={true}
          rightIconObj={{
            name: selector.securePassword ? "eye-off-outline" : "eye-outline",
            color: Colors.GRAY,
          }}
          onChangeText={(text) => setConfirmPassword(text)}
          onRightIconPressed={() => dispatch(updateSecurePassword())}
        /> */}
        <View style={{ height: 10 }} />
        <TextinputComp
          // style={styles.textInputStyle}
          mode={"outlined"}
          value={communicationAddress.pincode}
          label={"Pincode*"}
          maxLength={6}
          keyboardType={"phone-pad"}
          onChangeText={(text) => {
            // get addreess by pincode
            setCommunication({
              ...communicationAddress,
              ...(communicationAddress.pincode = text),
            });
            sameAsPermanent &&
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.pincode = text),
              });
            if (text.length === 6) {
              updateAddressDetails(text);
            }
          }}
        />
        <Text
          style={[
            GlobalStyle.underline,
            {
              backgroundColor: false ? "red" : "rgba(208, 212, 214, 0.7)",
            },
          ]}
        ></Text>

        {addressData?.length > 0 && (
          <>
            <View style={{ height: 10 }} />
            <Text style={GlobalStyle.underline}></Text>
            <Dropdown
              style={[
                styles.dropdownContainer,
                {
                  height: 50,
                  width: "100%",
                  fontSize: 16,
                  fontWeight: "400",
                  backgroundColor: Colors.WHITE,
                  borderColor: Colors.BLACK,
                  borderWidth: 1,
                  marginTop: 10,
                  borderRadius: 6,
                  padding: 15,
                },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={addressData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={"Select address"}
              searchPlaceholder="Search..."
              value={"defaultAddress"}
              // onFocus={() => setIsFocus(true)}
              // onBlur={() => setIsFocus(false)}
              onChange={(val) => {
                setCommunication({
                  ...communicationAddress,
                  ...((communicationAddress.village = val.value.Block),
                  (communicationAddress.mandal = val.value.Mandal),
                  (communicationAddress.district = val.value.District),
                  (communicationAddress.city = val.value.District),
                  (communicationAddress.state = val.value.State)),
                });
              }}
            />
          </>
        )}
        <Text style={GlobalStyle.underline}></Text>
        <View style={styles.radioGroupBcVw}>
          <RadioTextItem
            label={"Urban"}
            value={"urban"}
            status={communicationAddress.isUrban ? true : false}
            onPress={() => {
              setCommunication({
                ...communicationAddress,
                ...((communicationAddress.isUrban = true),
                (communicationAddress.isRural = false)),
              });
              sameAsPermanent &&
                setPermanentAddress({
                  ...permanentAddress,
                  ...((permanentAddress.isRural = false),
                  (permanentAddress.isUrban = true)),
                });
            }}
          />
          <RadioTextItem
            label={"Rural"}
            value={"rural"}
            status={communicationAddress.isRural ? true : false}
            onPress={() => {
              setCommunication({
                ...communicationAddress,
                ...((communicationAddress.isRural = true),
                (communicationAddress.isUrban = false)),
              });
              sameAsPermanent &&
                setPermanentAddress({
                  ...permanentAddress,
                  ...((permanentAddress.isRural = true),
                  (permanentAddress.isUrban = false)),
                });
            }}
          />
        </View>
        <TextinputComp
          mode={"outlined"}
          value={communicationAddress.houseNo}
          label={"H.No"}
          maxLength={50}
          keyboardType={"number-pad"}
          onChangeText={(text) => {
            setCommunication({
              ...communicationAddress,
              ...(communicationAddress.houseNo = text),
            });
            sameAsPermanent &&
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.houseNo = text),
              });
          }}
        />
        <View style={{ height: 10 }} />
        <TextinputComp
          mode={"outlined"}
          value={communicationAddress.street}
          label={"Street Name"}
          autoCapitalize="words"
          maxLength={120}
          keyboardType={"default"}
          onChangeText={(text) => {
            setCommunication({
              ...communicationAddress,
              ...(communicationAddress.street = text),
            });
            sameAsPermanent &&
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.street = text),
              });
          }}
        />
        <View style={{ height: 10 }} />
        <>
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.village}
            label={"Village/Town"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) => {
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.village = text),
              });
              sameAsPermanent &&
                setPermanentAddress({
                  ...permanentAddress,
                  ...(permanentAddress.village = text),
                });
            }}
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.mandal}
            label={"Mandal/Tahsil"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) => {
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.mandal = text),
              });
              sameAsPermanent &&
                setPermanentAddress({
                  ...permanentAddress,
                  ...(permanentAddress.mandal = text),
                });
            }}
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.city}
            label={"City"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.city = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.district}
            label={"District"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.district = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={communicationAddress.state}
            label={"State"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setCommunication({
                ...communicationAddress,
                ...(communicationAddress.state = text),
              })
            }
          />
          <View style={{ height: 10 }} />
        </>
        {/* )} */}
        <View style={{ height: 20, backgroundColor: Colors.WHITE }}></View>

        {/* // Permanent Addresss */}
        <View style={{ backgroundColor: Colors.WHITE, paddingLeft: 12 }}>
          <Text style={styles.permanentAddText}>
            {"Permanent Address Same as Communication Address"}
          </Text>
        </View>
        <View style={styles.radioGroupBcVw}>
          <RadioTextItem
            label={"Yes"}
            value={"yes"}
            status={sameAsPermanent ? true : false}
            onPress={() => {
              setSameAsPermanent(true);
              setPermanentAddress(communicationAddress);
            }}
          />
          <RadioTextItem
            label={"No"}
            value={"no"}
            status={!sameAsPermanent ? true : false}
            onPress={() => {
              setSameAsPermanent(false);
              setPermanentAddress({
                pincode: "",
                isUrban: "",
                isRural: null,
                houseNo: "",
                street: "",
                village: "",
                city: "",
                district: "",
                state: "",
                mandal: "",
                country: null,
              });
            }}
          />
        </View>
        <View style={{ height: 10 }} />
        <View>
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.pincode}
            label={"Pincode*"}
            maxLength={6}
            keyboardType={"phone-pad"}
            onChangeText={(text) => {
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.pincode = text),
              });
              if (text.length === 6) {
                updateAddressDetails2(text);
              }
            }}
          />
          <Text
            style={[
              GlobalStyle.underline,
              {
                backgroundColor: false ? "red" : "rgba(208, 212, 214, 0.7)",
              },
            ]}
          ></Text>

          {addressData2?.length > 0 && (
            <>
              <View style={{ height: 10 }} />
              <Text style={GlobalStyle.underline}></Text>
              <Dropdown
                mode={"outlined"}
                style={[
                  styles.dropdownContainer,
                  {
                    height: 50,
                    width: "100%",
                    fontSize: 16,
                    fontWeight: "400",
                    backgroundColor: Colors.WHITE,
                    borderColor: Colors.BLACK,
                    borderWidth: 1,
                    marginTop: 10,
                    borderRadius: 6,
                    padding: 15,
                  },
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={addressData2}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Select address"}
                searchPlaceholder="Search..."
                // value={defaultAddress}
                // onFocus={() => setIsFocus(true)}
                // onBlur={() => setIsFocus(false)}
                onChange={(val) => {
                  setPermanentAddress({
                    ...permanentAddress,
                    ...((permanentAddress.village = val.value.Block),
                    (permanentAddress.mandal = val.value.Mandal),
                    (permanentAddress.district = val.value.District),
                    (permanentAddress.city = val.value.District),
                    (permanentAddress.state = val.value.State)),
                  });
                }}
              />
            </>
          )}

          <View style={styles.radioGroupBcVw}>
            <RadioTextItem
              label={"Urban"}
              value={"urban"}
              status={permanentAddress.isUrban ? true : false}
              onPress={() =>
                setPermanentAddress({
                  ...permanentAddress,
                  ...((permanentAddress.isUrban = true),
                  (permanentAddress.isRural = false)),
                })
              }
            />
            <RadioTextItem
              label={"Rural"}
              value={"rural"}
              status={permanentAddress.isRural ? true : false}
              onPress={() =>
                setPermanentAddress({
                  ...permanentAddress,
                  ...((permanentAddress.isUrban = false),
                  (permanentAddress.isRural = true)),
                })
              }
            />
          </View>
          <TextinputComp
            mode={"outlined"}
            label={"H.No"}
            // keyboardType={"number-pad"}
            maxLength={50}
            value={permanentAddress.houseNo}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.houseNo = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            label={"Street Name"}
            autoCapitalize="words"
            keyboardType={"default"}
            maxLength={50}
            value={permanentAddress.street}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.street = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.village}
            label={"Village/Town"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.village = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.mandal}
            label={"Mandal"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.mandal = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.city}
            label={"City"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.city = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.district}
            label={"District"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.district = text),
              })
            }
          />
          <View style={{ height: 10 }} />
          <TextinputComp
            mode={"outlined"}
            value={permanentAddress.state}
            label={"State"}
            autoCapitalize="words"
            maxLength={50}
            keyboardType={"default"}
            onChangeText={(text) =>
              setPermanentAddress({
                ...permanentAddress,
                ...(permanentAddress.state = text),
              })
            }
          />
          <View style={{ height: 10 }} />
        </View>
        {/* <View style={styles.forgotView}>
            <Pressable onPress={forgotClicked}>
              <Text style={styles.forgotText}>{"Forgot Password?"}</Text>
            </Pressable>
          </View> */}
        <View style={{ height: 40 }}></View>
        <Pressable style={styles.loginButton} onPress={() => onSubmit()}>
          <Text style={styles.buttonText}>Register your Account</Text>
        </Pressable>
        <Image
          source={require("../../assets/images/loginCar.jpg")}
          style={styles.loginImage}
        />
        {/* <Pressable
            style={styles.signUpButton}
            // onPress={loginClicked()}
          >
            <Text style={styles.signUpText}>Don't have an account? <Text style={styles.signUpSubtext}>Sign Up</Text></Text>
          </Pressable> */}
        {/* <ButtonComp
            title={"Login to Account"}
            width={ScreenWidth - 40}
            onPress={loginClicked}
            disabled={selector.isLoading ? true : false}
          /> */}
        {/* <View style={{ width: "100%", height: 50, justifyContent: "center", alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: "400", color: Colors.GRAY }}>{"Version: 0.4"}</Text>
          </View> */}

        {/* Bottom Popup */}
        {/* <Animated.View style={[styles.bottomView, { opacity: fadeAnima }]}>
            <View style={styles.bottomVwSubVw}>
              <Text style={styles.text1}>{"User’s Profile"}</Text>
              <Text style={styles.text2}>
                {
                  "Thanks to user’s profile your vehicles, service books and messages will be stored safely in a cloud, so you do not have to worry about that anymore."
                }
              </Text>
            </View>
            <IconButton
              style={styles.closeStyle}
              icon="close"
              color={Colors.DARK_GRAY}
              size={20}
              onPress={closeBottomView}
            />
          </Animated.View> */}

        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
    justifyContent: "center",
  },
  welcomeStyle: {
    fontSize: 24,
    color: Colors.BLACK,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  forgotView: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  forgotText: {
    paddingTop: 15,
    fontSize: 12,
    fontWeight: "400",
    color: Colors.BLACK,
    fontWeight: "bold",
    textAlign: "right",
  },
  bottomView: {
    // position: "absolute",
    bottom: 0,
    backgroundColor: Colors.LIGHT_GRAY,
    // paddingVertical: 20,
  },
  bottomVwSubVw: {
    paddingHorizontal: 30,
  },
  text1: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 15,
  },
  text2: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
  closeStyle: {
    position: "absolute",
    marginTop: 10,
    right: 20,
  },
  loginButton: {
    backgroundColor: "#f81567",
    height: 50,
    width: ScreenWidth - 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  loginImage: {
    width: ScreenWidth - 40,
    height: 100,
    marginTop: 30,
  },
  signUpText: {
    alignSelf: "center",
    marginTop: 25,
  },
  signUpSubtext: {
    fontWeight: "bold",
  },
  textInputStyle: {
    height: 50,
    width: "100%",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 16,
    // borderWidth: 1,
    width: "100%",
    height: 50,
    borderRadius: 5,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  radioGroupBcVw: {
    flexDirection: "row",
    alignItems: "center",
    height: 65,
    paddingLeft: 12,
    backgroundColor: Colors.WHITE,
  },
  permanentAddText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
