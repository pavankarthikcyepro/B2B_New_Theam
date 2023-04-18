import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
} from "react-native";
import { Colors } from "../../styles";
import { ButtonComp } from "../../components/buttonComp";
import { AuthNavigator } from "../../navigations";
import { useIsFocused } from "@react-navigation/native";
import Orientation from "react-native-orientation-locker";
import { getWidth } from "../../utils/helperFunctions";
import crashlytics from "@react-native-firebase/crashlytics";
import { firebase } from "@react-native-firebase/app";

const WelcomeScreen = ({ navigation }) => {

  const loginButtonClicked = () => {
    navigation.navigate(AuthNavigator.AuthStackIdentifiers.LOGIN);
  };
  // useEffect(() => {
  //   crashlytics().log("App mounted.");
  // }, []);

  useEffect(() => {
    firebase.initializeApp({
      // Your Firebase config object
    });

    // Initialize Crashlytics
    crashlytics().setCrashlyticsCollectionEnabled(true);
  }, [])
  
  // return null
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          height: 300,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: getWidth(80), height: 80 }}
          resizeMode={"center"}
          source={require("../../assets/images/logo.png")}
        />
      </View>
      {/* <Image
                style={{ width: '100%', height: 300 }}
                resizeMode={'center'}
                source={require('../../assets/images/welcome.png')}
            /> */}
      {/* source={require('../../assets/images/logo.png')}
            /> */}
      <ButtonComp
        title={"LOG IN"}
        width={getWidth(100) - 40}
        onPress={loginButtonClicked}
        color={Colors.PINK}
      />
      <Button title="Test Crash" onPress={() => crashlytics().crash()} />
      <View style={styles.bottomViewStyle}>
        <Text style={styles.textOneStyle}>{"Important Notice"}</Text>
        <Text style={styles.textTwoStyle}>
          {
            "By using this app, you agree to the use of cookies and data processing technologies by us."
          }
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.LIGHT_GRAY,
  },
  bottomViewStyle: {
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  textOneStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  textTwoStyle: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.DARK_GRAY,
  },
});
