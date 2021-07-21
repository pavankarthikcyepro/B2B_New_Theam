
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator, AppNavigator } from './navigations';
import { Provider } from 'react-redux';
import reduxStore from './redux/reduxStore';
import * as AsyncStore from './asyncStore';
import { useDispatch, useSelector } from 'react-redux';

const AppScreen = () => {

    const [state, dispatch] = React.useReducer((prevState, action) => {
        switch (action.type) {
            case "RESTORE_TOKEN":
                break;
            case "SIGN_IN":
                break;
            case "SIGN_OUT":
                break;
        }
    })

    // const selector = useSelector(state => state.routeReducer);

    useEffect(() => {

        let token = AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
        if (token !== null) {
            console.log('token1: ', token);
        } else if (token) {
            console.log('token2: ', token);
        } else {
            console.log('token3: ', token);
        }

    }, [])

    return (
        <Provider store={reduxStore}>
            <NavigationContainer>
                <AppNavigator.MainStackDrawerNavigator />
                {/* {selector.userToken ? <AppNavigator.MainStackDrawerNavigator /> : <AuthNavigator.AuthStackNavigator />} */}
            </NavigationContainer>
        </Provider>
    )
}

export default AppScreen;
