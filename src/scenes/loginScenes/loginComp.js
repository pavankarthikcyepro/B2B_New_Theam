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
import {
  showAlertMessage,
  showToast,
  showToastRedAlert,
} from "../../utils/toast";
import BackgroundService from "react-native-background-actions";
// import Geolocation from "react-native-geolocation-service";
import crashlytics from "@react-native-firebase/crashlytics";
import {
  GlobalSpeed,
  distanceFilterValue,
  getDistanceBetweenTwoPoints,
  getDistanceBetweenTwoPointsLatLong,
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
  getHeight,
  getWidth,
  setBranchId,
  setBranchName,
} from "../../utils/helperFunctions";
import moment from "moment";
// import Geolocation from "@react-native-community/geolocation";
import GetLocation from "react-native-get-location";

// import { TextInput } from 'react-native-paper';
const officeLocation = {
  latitude: 37.33233141,
  longitude: -122.0312186,
};
const dateFormat = "YYYY-MM-DD";
const currentDateMoment = moment().format(dateFormat);

const LoginScreen = ({ navigation }) => {
  const selector = useSelector((state) => state.loginReducer);
  const dispatch = useDispatch();
  const fadeAnima = useRef(new Animated.Value(0)).current;
  const { signIn } = React.useContext(AuthContext);
  const [text, setText] = React.useState("");
  const [number, onChangeNumber] = React.useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);
  useEffect(() => {
    return () => {
      clearWatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    setSubscriptionId(null);
  };
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
      username: employeeId,
      password: password,
      deviceId: selector.token,
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
        Promise.all([
          dispatch(getMenuList(selector.userData.userName)),
          dispatch(getEmpId(selector.userData.userName)),
        ])
          .then((res) => {
            onSignIn(res[0].payload.dmsEntity.loginEmployee);
            const condition =
              res[0].payload.dmsEntity.loginEmployee.isGeolocation === "Y";
            if (condition) {
              startTracking();
            }
          })
          .catch(() => {});

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

  async function onSignIn(user) {
    crashlytics().log("User signed in.");
    await Promise.all([
      crashlytics().setUserId(user.empId.toString()),
      crashlytics().setAttribute("credits", "Crash User"),
      crashlytics().setAttributes({
        role: user.primaryDesignation,
        email: user.email,
        username: user.empName,
      }),
    ]);
  }

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

  const checkTheDate = async (employeeData, lastPosition) => {
    const { longitude, latitude, speed } = lastPosition;
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      // const trackingResponse = await client.get(
      //   getDetailsByempIdAndorgId + `/${jsonObj.empId}/${jsonObj.orgId}`
      // );
      const trackingResponse = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(
          jsonObj.empId,
          jsonObj.orgId,
          currentDateMoment
        )
      );
      const trackingJson = await trackingResponse.json();
      const currentDate = new Date();
      const hasObjectWithCurrentDate1 = trackingJson.filter((obj) => {
        const selectedDate = new Date(obj.createdtimestamp);
        return (
          selectedDate.getDate() === currentDate.getDate() &&
          selectedDate.getMonth() === currentDate.getMonth() &&
          selectedDate.getFullYear() === currentDate.getFullYear()
        );
      });
      const hasObjectWithCurrentDate =
        hasObjectWithCurrentDate1[hasObjectWithCurrentDate1.length - 1];
      if (hasObjectWithCurrentDate) {
       
        if (
          hasObjectWithCurrentDate.isStart === "true" &&
          hasObjectWithCurrentDate.isEnd === "false"
        ) {
          const tempArray = JSON.parse(
            JSON.parse(hasObjectWithCurrentDate.location)
          );
          
          const finalArray = tempArray.concat([{ longitude, latitude }]);
          const distanceCheck = tempArray[tempArray.length - 1];
          let distance = getDistanceBetweenTwoPointsLatLong(
            distanceCheck.latitude,
            distanceCheck.longitude,
            latitude,
            longitude
          );
          if (distance >= 10) {
            const payload = {
              id: hasObjectWithCurrentDate.id,
              orgId: jsonObj?.orgId,
              empId: jsonObj?.empId,
              branchId: jsonObj?.branchId,
              currentTimestamp: new Date(
                hasObjectWithCurrentDate.createdtimestamp
              ).getTime(),
              updateTimestamp: new Date().getTime(),
              purpose: "",
              location: JSON.stringify(finalArray),
              kmph: speed.toString(),
              speed: speed.toString(),
              isStart: "true",
              isEnd: "false",
            };
            const response = await client.put(
              locationUpdate + `/${trackingJson[trackingJson.length - 1].id}`,
              payload
            );
            const json = await response.json();
          }
        }
        if (
          hasObjectWithCurrentDate.isStart === "true" &&
          hasObjectWithCurrentDate.isEnd === "true"
        ) {
          const tempArray = JSON.parse(
            JSON.parse(hasObjectWithCurrentDate.location)
          );
          const finalArray = tempArray.concat([{ longitude, latitude }]);
          const distanceCheck = tempArray[tempArray.length - 1];
          let distance = getDistanceBetweenTwoPointsLatLong(
            distanceCheck.latitude,
            distanceCheck.longitude,
            latitude,
            longitude
          );
          if (true) {
            const payload = {
              id: 0,
              orgId: jsonObj?.orgId,
              empId: jsonObj?.empId,
              branchId: jsonObj?.branchId,
              currentTimestamp: new Date().getTime(),
              updateTimestamp: new Date().getTime(),
              purpose: "",
              location: JSON.stringify([{ longitude, latitude }]),
              kmph: speed.toString(),
              speed: speed.toString(),
              isStart: "true",
              isEnd: "false",
            };
            const response = await client.post(saveLocation, payload);
            const json = await response.json();
          }
        }
      } else {
       
        const payload = {
          id: 0,
          orgId: jsonObj?.orgId,
          empId: jsonObj?.empId,
          branchId: jsonObj?.branchId,
          currentTimestamp: new Date().getTime(),
          updateTimestamp: new Date().getTime(),
          purpose: "",
          location: JSON.stringify([{ longitude, latitude }]),
          kmph: speed.toString(),
          speed: speed.toString(),
          isStart: "true",
          isEnd: "false",
        };
        const response = await client.post(saveLocation, payload);
        const json = await response.json();
      }
    }
  };

  const checkTheEndDate = async (employeeData, lastPosition) => {
    const { longitude, latitude, speed } = lastPosition;
    if (employeeData) {
      const jsonObj = JSON.parse(employeeData);
      // const trackingResponse = await client.get(
      //   getDetailsByempIdAndorgId + `/${jsonObj.empId}/${jsonObj.orgId}`
      // );
      const trackingResponse = await client.get(
        URL.GET_MAP_COORDINATES_BY_ID(
          jsonObj.empId,
          jsonObj.orgId,
          currentDateMoment
        )
      );
      const trackingJson = await trackingResponse.json();
      const currentDate = new Date();
      const hasObjectWithCurrentDate1 = trackingJson.filter((obj) => {
        const selectedDate = new Date(obj.createdtimestamp);
        return (
          selectedDate.getDate() === currentDate.getDate() &&
          selectedDate.getMonth() === currentDate.getMonth() &&
          selectedDate.getFullYear() === currentDate.getFullYear()
        );
      });
      const hasObjectWithCurrentDate =
        hasObjectWithCurrentDate1[hasObjectWithCurrentDate1.length - 1];
      if (hasObjectWithCurrentDate) {
       
        if (
          hasObjectWithCurrentDate.isStart === "true" &&
          hasObjectWithCurrentDate.isEnd === "false"
        ) {
          const tempArray = JSON.parse(
            JSON.parse(hasObjectWithCurrentDate.location)
          );
          const finalArray = tempArray.concat([{ longitude, latitude }]);
          const distanceCheck = tempArray[tempArray.length - 1];
          let distance = getDistanceBetweenTwoPointsLatLong(
            distanceCheck.latitude,
            distanceCheck.longitude,
            latitude,
            longitude
          );
          console.log("LOGIN distanssssce", distance);
          if (true) {
            const payload = {
              id: hasObjectWithCurrentDate.id,
              orgId: jsonObj?.orgId,
              empId: jsonObj?.empId,
              branchId: jsonObj?.branchId,
              currentTimestamp: new Date(
                hasObjectWithCurrentDate.createdtimestamp
              ).getTime(),
              updateTimestamp: new Date().getTime(),
              purpose: "",
              location: JSON.stringify(finalArray),
              kmph: speed.toString(),
              speed: speed.toString(),
              isStart: "true",
              isEnd: "true",
            };
            const response = await client.put(
              locationUpdate + `/${trackingJson[trackingJson.length - 1].id}`,
              payload
            );
            const json = await response.json();
          }
        }
      } else {
      
      }
    }
  };

  const getCoordinates = async () => {
    try {
      if (true) {
        // setInterval(() => {
        const watchID = GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
        }).then(
          async (lastPosition) => {
            let speed = lastPosition?.speed <= -1 ? 0 : lastPosition?.speed;
            const employeeData = await AsyncStore.getData(
              AsyncStore.Keys.LOGIN_EMPLOYEE
            );
            console.log("SPEDDd", speed);
            if (speed >= GlobalSpeed) {
              checkTheDate(employeeData, lastPosition);
            }
            if (speed < GlobalSpeed && speed >= 0) {
              checkTheEndDate(employeeData, lastPosition);
            }

            return;
            if (employeeData) {
              const jsonObj = JSON.parse(employeeData);
              const trackingResponse = await client.get(
                getDetailsByempIdAndorgId + `/${jsonObj.empId}/${jsonObj.orgId}`
              );
              const trackingJson = await trackingResponse.json();

              var newLatLng = {
                latitude: lastPosition.coords.latitude,
                longitude: lastPosition.coords.longitude,
              };
              if (trackingJson.length > 0) {
                let parsedValue =
                  trackingJson.length > 0
                    ? JSON.parse(trackingJson[trackingJson.length - 1].location)
                    : [];

                let x = trackingJson;
                let y = x[x.length - 1].location;
                let z = JSON.parse(y);
                let lastlocation = z[z.length - 1];

                let dist = getDistanceBetweenTwoPoints(
                  lastlocation.latitude,
                  lastlocation.longitude,
                  lastPosition?.coords?.latitude,
                  lastPosition?.coords?.longitude
                );
                let distance = dist * 1000;
                let newArray = [...parsedValue, ...[newLatLng]];
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
                    currentTimestamp:
                      trackingJson[trackingJson.length - 1]?.createdtimestamp,
                    updateTimestamp: new Date().getTime(),
                    purpose: "",
                    location: JSON.stringify(newArray),
                    kmph: speed.toString(),
                    speed: speed.toString(),
                  };
                  if (speed <= 10 && distance > distanceFilterValue) {
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
                    location: JSON.stringify([newLatLng]),
                    kmph: speed.toString(),
                    speed: speed.toString(),
                  };
                  if (speed <= 10) {
                    const response = await client.post(saveLocation, payload);
                    const json = await response.json();
                  }
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
                  location: JSON.stringify([newLatLng]),
                  kmph: speed.toString(),
                  speed: speed.toString(),
                };
                if (speed <= 10) {
                  const response = await client.post(saveLocation, payload);
                  const json = await response.json();
                }
              }
            }
          },
          (error) => {},
          {
            enableHighAccuracy: true,
            //  distanceFilter: distanceFilterValue,
            //  timeout: 2000,
            //  maximumAge: 0,
            //  interval: 5000,
            //  fastestInterval: 2000,
            accuracy: {
              android: "high",
            },
            // useSignificantChanges: true,
          }
        ).catch(()=>{});
        setSubscriptionId(watchID);
        // }, 5000);
      }
    } catch (error) {
      // showToastRedAlert(error);
    }
  };

  const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        var startDate = createDateTime("8:30");
        var startBetween = createDateTime("9:30");
        var endBetween = createDateTime("20:30");
        var endDate = createDateTime("21:30");
        var now = new Date();
        if (startDate <= now && now <= startBetween) {
          // sendLocalNotification();
        }
        if (endBetween <= now && now <= endDate) {
          // sendLocalNotification();
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
      Geolocation.requestAuthorization("always");
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
              height: getHeight(23),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ width: getWidth(80), height: 70 }}
              resizeMode={"contain"}
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
            marginTop: getHeight(18),
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
            width={getWidth(100) - 40}
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
    width: getWidth(100) - 40,
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
    width: getWidth(100) - 40,
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
