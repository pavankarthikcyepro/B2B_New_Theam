
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator, AppNavigator } from './navigations';
import { Provider } from 'react-redux';
import reduxStore from './redux/reduxStore';
import * as AsyncStore from './asyncStore';
import { AuthContext } from './utils/authContext';

const AppScreen = () => {

    const [state, dispatch] = React.useReducer((prevState, action) => {
        switch (action.type) {
            case "RESTORE_TOKEN":
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false
                }
            case "SIGN_IN":
                return {
                    ...prevState,
                    isSignout: false,
                    userToken: action.token,
                }
            case "SIGN_OUT":
                return {
                    ...prevState,
                    isSignout: true,
                    userToken: null,
                }
        }
    }, {
        isLoading: true,
        isSignout: false,
        userToken: null,
    })


    useEffect(async () => {

        // Fetch the token from storage then navigate to our appropriate place
        const checkUserToken = async () => {

            let userToken = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };

        checkUserToken();
    }, [])

    const authContext = React.useMemo(
        () => ({
            signIn: async data => {
                console.log('data: ', data);
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            signUp: async data => {
                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
            },
        }),
        []
    );

    return (
        <AuthContext.Provider value={authContext}>
            <Provider store={reduxStore}>
                <NavigationContainer>
                    {state.userToken ? <AppNavigator.MainStackDrawerNavigator /> : <AuthNavigator.AuthStackNavigator />}
                </NavigationContainer>
            </Provider>
        </AuthContext.Provider>
    )
}

export default AppScreen;
