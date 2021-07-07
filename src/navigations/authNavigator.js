import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from "../styles";

import WelcomeScreen from "../scenes/loginScenes/welcomeComp";
import LoginScreen from "../scenes/loginScenes/loginComp";
import ForgotScreen from "../scenes/loginScenes/forgotComp";

const AuthStackIdentifiers = {
  WELCOME: "WELCOME",
  LOGIN: "LOGIN",
  FORGOT: "FORGOT",
};

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={AuthStackIdentifiers.WELCOME}
      screenOptions={{
        headerTintColor: Colors.WHITE,
        headerStyle: { backgroundColor: Colors.DARK_GRAY },
      }}
    >
      <Stack.Screen
        name={AuthStackIdentifiers.WELCOME}
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={AuthStackIdentifiers.LOGIN}
        component={LoginScreen}
        options={{ title: "Sign In", headerBackTitleVisible: false }}
      />
      <Stack.Screen
        name={AuthStackIdentifiers.FORGOT}
        component={ForgotScreen}
        options={{ title: "Forgot", headerBackTitleVisible: false }}
      />
    </Stack.Navigator>
  );
};

export { AuthStackNavigator, AuthStackIdentifiers };
