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
  ScrollView
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
  clearUserNameAndPass
} from "../../redux/loginReducer";
import { AuthNavigator } from "../../navigations";
import { IconButton } from "react-native-paper";
import { AuthContext } from "../../utils/authContext";
import { LoaderComponent } from '../../components';
import * as AsyncStore from '../../asyncStore';
import { showAlertMessage, showToast } from "../../utils/toast";
// import { TextInput } from 'react-native-paper';


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
  }, [selector.offlineStatus])

  const loginClicked = () => {

    const employeeId = selector.employeeId;
    const password = selector.password;

    if (employeeId.length === 0) {
      let object = {
        key: "EMPLOYEEID",
        message: "Please enter Username",
      };
      dispatch(showErrorMessage(object));
      return;
    }

    if (password.length === 0) {
      let object = {
        key: "PASSWORD",
        message: "Please enter Password",
      };
      dispatch(showErrorMessage(object));
      return;
    }

    let object = {
      "empname": employeeId,
      "password": password
    }

    dispatch(postUserData(object));
  };

  // Handle Login Success Response
  useEffect(() => {

    if (selector.status == "sucess") {
      console.log("$$$$$$$$ USER DATA:", JSON.stringify(selector.userData));
      //signIn(selector.authToken);
      AsyncStore.storeData(AsyncStore.Keys.USER_NAME, selector.userData.userName);
      AsyncStore.storeData(AsyncStore.Keys.ORG_ID, selector.userData.orgId);
      AsyncStore.storeData(AsyncStore.Keys.REFRESH_TOKEN, selector.userData.refreshToken);

      AsyncStore.storeData(AsyncStore.Keys.USER_TOKEN, selector.userData.idToken).then(() => {
        dispatch(getMenuList(selector.userData.userName));
        // dispatch(getCustomerTypeList());
        // dispatch(getCarModalList(selector.userData.orgId))
        // signIn(selector.authToken);
        // dispatch(clearState());
      });
      dispatch(clearUserNameAndPass())
    } else {
    }
  }, [selector.status])

  useEffect(() => {

    if (selector.menuListStatus == "completed") {
      console.log("branchList: ", selector.branchesList.length);
      // if (selector.branchesList.length > 1) {
      //   navigation.navigate(AuthNavigator.AuthStackIdentifiers.SELECT_BRANCH, { isFromLogin: true, branches: selector.branchesList })
      // }
      if (selector.branchesList.length > 0) {
        const branchId = selector.branchesList[0].branchId;
        const branchName = selector.branchesList[0].branchName;
        AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_ID, branchId.toString());
        AsyncStore.storeData(AsyncStore.Keys.SELECTED_BRANCH_NAME, branchName);
        signIn(selector.authToken);
        dispatch(clearState());
      } else {
        showToast("No branches found")
      }
      //getPreEnquiryListFromServer();
    }
    else if (selector.menuListStatus == "failed") {
      showToast("something went wrong");
    }
  }, [selector.menuListStatus, selector.branchesList])

  const getPreEnquiryListFromServer = async () => {
    let endUrl = "?limit=10&offset=" + "0" + "&status=PREENQUIRY&empId=" + selector.empId;
    dispatch(getPreEnquiryData(endUrl))
  }

  const forgotClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.FORGOT);
  };

  const closeBottomView = () => {
    console.log("clicked");
    Animated.timing(fadeAnima, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <LoaderComponent
        visible={selector.isLoading}
        onRequestClose={() => { }}
      />
      <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps="always">
      {/* <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
        keyboardShouldPersistTaps="always"
      > */}

        <View style={{ flexDirection: 'column', backgroundColor: Colors.WHITE }}>

          <View style={{ width: "100%", height: ScreenHeight * 0.23, alignItems: "center", justifyContent: 'center', }}>
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
            rightIconObj={{ name: selector.securePassword ? "eye-off-outline" : "eye-outline", color: Colors.GRAY }}
            onChangeText={(text) => dispatch(updatePassword(text))}
            onRightIconPressed={() => dispatch(updateSecurePassword())}
          />
          {/* <View style={styles.forgotView}>
            <Pressable onPress={forgotClicked}>
              <Text style={styles.forgotText}>{"Forgot Password?"}</Text>
            </Pressable>
          </View> */}
          <View style={{ height: 40 }}></View>
          <Pressable 
            style={styles.loginButton}
            onPress={() => loginClicked()}
          >
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
    fontWeight: "bold"
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
    elevation: 3
  },
  buttonText: {
    fontWeight: "bold",
    color: Colors.WHITE
  },
  loginImage: {
    width: ScreenWidth - 40,
    height: 100,
    marginTop:30
  },
  signUpText: {
    alignSelf: "center",
    marginTop: 25
  },
  signUpSubtext: {
    fontWeight: "bold"
  }
});
