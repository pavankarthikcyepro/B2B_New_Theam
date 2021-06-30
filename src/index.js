
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './navigations';

const AppScreen = () => {

    return (
        <NavigationContainer>
            <AuthNavigator.AuthStackNavigator />
        </NavigationContainer>
    )
}

export default AppScreen;