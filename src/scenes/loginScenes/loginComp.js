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
import { Colors } from "../../styles";
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
import { showAlertMessage, showToast } from "../../utils/toast";
import BackgroundService from "react-native-background-actions";
import Geolocation from "@react-native-community/geolocation";
import { distanceFilterValue, getDistanceBetweenTwoPoints, officeRadius, options, sendAlertLocalNotification, sendLocalNotification, sleep } from "../../service";
import {
  getDetailsByempIdAndorgId,
  locationUpdate,
  saveLocation,
} from "../../networking/endpoints";
import { client } from "../../networking/client";
import { setBranchId, setBranchName } from "../../utils/helperFunctions";

// import { TextInput } from 'react-native-paper';
const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

const LoginScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const fadeAnima = useRef(new Animated.Value(0)).current;
  const { signIn } = React.useContext(AuthContext);
  const [text, setText] = React.useState("");
  const [number, onChangeNumber] = React.useState(null);

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
      "username": employeeId,
      "password": password
    }

    dispatch(postUserData(object));
  };

  // Handle Login Success Response

  useEffect(() => {
    if (selector.status == "sucess") {
      //signIn(selector.authToken);
     
      AsyncStore.storeData(AsyncStore.Keys.USER_NAME, selector.userData.userName);
      AsyncStore.storeData(AsyncStore.Keys.ORG_ID,  String(selector.userData.orgId));
      AsyncStore.storeData(AsyncStore.Keys.REFRESH_TOKEN, selector.userData.refreshToken);

      AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, selector.userData.accessToken).then(() => {
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
              console.log("lastPOSTION", lastPosition);
              let speed =
                lastPosition?.coords?.speed <= -1
                  ? 0
                  : lastPosition?.coords?.speed * 3.6;
              // console.log("SPEED=============", speed);
              const employeeData = await AsyncStore.getData(
                AsyncStore.Keys.LOGIN_EMPLOYEE
              );
              // console.log("employeeData", employeeData);
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
                  lastPosition?.coords?.latitude,
                  lastPosition?.coords?.longitude
                );
                if (dist > officeRadius) {
                  // sendAlertLocalNotification();
                } else {
                  // seteReason(false);
                }
                let parsedValue =
                  trackingJson.length > 0
                    ? JSON.parse(trackingJson[trackingJson.length - 1].location)
                    : null;
                console.log("ssgfgfgfgfgs", newLatLng, parsedValue);

                // if (newLatLng && parsedValue) {
                //   if (
                //     objectsEqual(newLatLng, parsedValue[parsedValue.length - 1])
                //   ) {
                //     return;
                //   }
                // }

                let newArray = [...coordinates, ...[newLatLng]];
                let date = new Date(
                  trackingJson[trackingJson.length - 1]?.createdtimestamp
                );

                let condition =
                  new Date(date).getDate() == new Date().getDate();
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
                    kmph: speed.toString(),
                    speed: speed.toString(),
                  };

                  if (speed <= 10) {
                    await AsyncStore.storeJsonData(
                      AsyncStore.Keys.COORDINATES,
                      newArray
                    );
                    const response = await client.put(
                      locationUpdate +
                        `/${trackingJson[trackingJson.length - 1].id}`,
                      tempPayload
                    );
                    const json = await response.json();
                  }
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
                    kmph: speed.toString(),
                    speed: speed.toString(),
                  };

                  if (speed <= 10) {

                    await AsyncStore.storeJsonData(
                      AsyncStore.Keys.COORDINATES,
                      newArray
                    );
                    const response = await client.post(saveLocation, payload);
                    const json = await response.json();
                  }
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <LoaderComponent visible={selector.isLoading} onRequestClose={() => {}} />
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        keyboardShouldPersistTaps="always"
      >
        {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
        keyboardShouldPersistTaps="always"
      > */}

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
        <View
          style={{
            flex: 1,
            position: "absolute",
            paddingHorizontal: 20,
            paddingTop: 30,
            marginTop: ScreenHeight * 0.18,
            backgroundColor: Colors.WHITE,
            borderTopEndRadius: 4,
          }}
        >
          <Text style={styles.welcomeStyle}>{"Login"}</Text>
          <TextinputComp
            value={selector.employeeId}
            error={selector.showLoginErr}
            errorMsg={selector.loginErrMessage}
            label={"Email or Username"}
            mode={"outlined"}
            onChangeText={(text) => dispatch(updateEmployeeId(text))}
          />
          <View style={{ height: 20 }}></View>
          <TextinputComp
            value={selector.password}
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
            onChangeText={(text) => dispatch(updatePassword(text))}
            onRightIconPressed={() => dispatch(updateSecurePassword())}
          />
          {/* <View style={styles.forgotView}>
            <Pressable onPress={forgotClicked}>
              <Text style={styles.forgotText}>{"Forgot Password?"}</Text>
            </Pressable>
          </View> */}
          <View style={{ height: 40 }}></View>
          <Pressable style={styles.loginButton} onPress={() => loginClicked()}>
            <Text style={styles.buttonText}>Login to Account</Text>
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
        </View>
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: Colors.WHITE,
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
});
