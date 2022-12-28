import * as AsyncStore from '../asyncStore';
import { EventRegister } from 'react-native-event-listeners'
import URL from './endpoints';
import { Alert } from 'react-native';
export const client = async (authToken, url, methodType, body, customConfig) => {

    const headers = {
        'Accept': "application/json",
        'Content-Type': 'application/json',
    }

    // if (authToken) {
    //     headers['auth-token'] = authToken;
    // }
    if (authToken) {
        headers['Authorization'] = "Bearer "+authToken;
    }

    const config = {
        method: methodType,
        headers: {
            ...headers,
            ...customConfig
        },
    }

    if (body) {
        config.body = JSON.stringify(body)
    }

    try {
        const response = await window.fetch(url, config)
       
        if (response.status == 401){
          
           
            let Refresh_token = await AsyncStore.getData(AsyncStore.Keys.REFRESH_TOKEN);
          
            // call refresh Token API
            let refreshApiUrl = URL.REFRESHTOKEN();
           
            const headers = {
                'Accept': "application/json",
                'Content-Type': 'application/json',
            }
            const config = {
                method: "POST",
                headers: {
                    ...headers,
                },
            }
            if (Refresh_token) {
                let payload = {
                    refreshToken:Refresh_token
                }
                config.body = JSON.stringify(payload)
            }
           

            const responseForRefreshApi = await window.fetch(refreshApiUrl, config)   
           
            let tempRes = await responseForRefreshApi.json();
            if (responseForRefreshApi.status == 200){
             
                await  AsyncStore.storeData(AsyncStore.Keys.ACCESS_TOKEN, tempRes.accessToken);
                await  AsyncStore.storeData(AsyncStore.Keys.REFRESH_TOKEN, tempRes.refreshToken);
            }
            if (responseForRefreshApi.status == 401 || responseForRefreshApi.status == 403){
                // handle  force logout in cash of refresh token expired 
                EventRegister.emit("ForceLogout", true)
                return;
            }
          
            return Alert.alert(
                "Authentication failed",
                "Please try again latter",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }
       
        return response;
    } catch (err) {
        console.error('err: ', err, url);
        return Promise.reject(err.message ? err.message : "something wrong")
    }
}

client.get = async function (endpoint, customConfig = {}) {
    let token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    return client(token, endpoint, "GET", null, customConfig)
}

client.post = async function (endpoint, body, customConfig = {}) {
    let token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    return client(token, endpoint, "POST", body, customConfig)
}

client.put = async function (endpoint, body, customConfig = {}) {
    let token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    return client(token, endpoint, "PUT", body, customConfig)
}

export const parseAPIResponse = response => {
    return new Promise(resolve => resolve(response.text()))
        .catch(err =>
            // eslint-disable-next-line prefer-promise-reject-errors
            Promise.reject({
                type: 'NetworkError',
                status: response.status,
                message: err,
            }))
        .then((responseBody) => {
            // Attempt to parse JSON
            try {
                const parsedJSON = JSON.parse(responseBody);
                if (response.ok) return parsedJSON;
                if (response.status >= 500) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject({
                        type: 'ServerError',
                        status: response.status,
                        body: parsedJSON,
                    });
                }
                if (response.status <= 501) {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject({
                        type: 'ApplicationError',
                        status: response.status,
                        body: parsedJSON,
                    });
                }
            } catch (e) {
                // We should never get these unless response is mangled
                // Or API is not properly implemented
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject({
                    type: 'InvalidJSON',
                    status: response.status,
                    body: responseBody,
                });
            }
        })
}