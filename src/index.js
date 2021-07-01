
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './navigations';
import { Provider } from 'react-redux';
import reduxStore from './redux/reduxStore';

const AppScreen = () => {

    return (
        <Provider store={reduxStore}>
            <NavigationContainer>
                <AuthNavigator.AuthStackNavigator />
            </NavigationContainer>
        </Provider>
    )
}

export default AppScreen;