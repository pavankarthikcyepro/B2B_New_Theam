
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../styles';

import WelcomeScreen from '../scenes/loginScenes/welcomeComp';
import LoginScreen from '../scenes/loginScenes/loginComp';
import ForgotScreen from '../scenes/loginScenes/forgotComp';
import SelectBranchComp from '../scenes/loginScenes/selectBranchComp';
import Orientation from 'react-native-orientation-locker';

const AuthStackIdentifiers = {
    WELCOME: 'WELCOME',
    LOGIN: 'LOGIN',
    FORGOT: 'FORGOT',
    SELECT_BRANCH: "SELECT_BRANCH"
}

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
    Orientation.lockToPortrait()
    return (
        <Stack.Navigator
            initialRouteName={AuthStackIdentifiers.WELCOME}
            screenOptions={{
                headerTintColor: Colors.WHITE,
                headerStyle: { backgroundColor: Colors.DARK_GRAY },
            }}
        >
            <Stack.Screen name={AuthStackIdentifiers.WELCOME} component={WelcomeScreen} options={{ headerShown: false, }} />
            <Stack.Screen 
                name={AuthStackIdentifiers.LOGIN} 
                component={LoginScreen} 
                options={{headerShown: false }}
            />
            <Stack.Screen name={AuthStackIdentifiers.FORGOT} component={ForgotScreen} options={{ title: 'Forgot', headerBackTitleVisible: false }} />
            <Stack.Screen name={AuthStackIdentifiers.SELECT_BRANCH} component={SelectBranchComp} options={{ title: 'Select Branch', headerBackTitleVisible: false }} />
        </Stack.Navigator>
    )
}

export { AuthStackNavigator, AuthStackIdentifiers };