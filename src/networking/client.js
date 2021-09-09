import * as AsyncStore from '../asyncStore';

export const client = async (authToken, url, methodType, body) => {

    const headers = {
        'Accept': "application/json",
        'Content-Type': 'application/json',
    }

    if (authToken) {
        headers['auth-token'] = authToken;
    }

    const config = {
        method: methodType,
        headers: {
            ...headers,
        },
    }

    if (body) {
        config.body = JSON.stringify(body)
    }
    // console.log('config: ', config);

    try {
        console.log('API: ' + url);
        console.log("body: " + JSON.stringify(body));
        const response = await window.fetch(url, config)
        return response;
    } catch (err) {
        console.error('err: ', err);
        return Promise.reject(err.message ? err.message : "something wrong")
    }
}

client.get = async function (endpoint, customConfig = {}) {
    let token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    return client(token, endpoint, "GET")
}

client.post = async function (endpoint, body, customConfig = {}) {
    let token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    return client(token, endpoint, "POST", body)
}

client.put = async function (endpoint, body, customConfig = {}) {
    let token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    return client(token, endpoint, "PUT", body)
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