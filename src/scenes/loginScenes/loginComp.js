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
  showToast,
} from "../../utils/toast";
import crashlytics from "@react-native-firebase/crashlytics";
import {
  getHeight,
  getWidth,
  setBranchId,
  setBranchName,
} from "../../utils/helperFunctions";
import moment from "moment";

const dateFormat = "YYYY-MM-DD";
const currentDateMoment = moment().format(dateFormat);

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
