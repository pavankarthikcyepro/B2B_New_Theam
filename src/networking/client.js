import * as AsyncStore from '../asyncStore';

export const client = async (authToken, url, { body, ...customConfig } = {}) => {

    const headers = {
        'Accept': "application/json",
        'Content-Type': 'application/json',
    }

    if (authToken) {
        headers['auth-token'] = authToken;
    }

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    }

    if (body) {
        config.body = JSON.stringify(body)
    }
    // console.log('config: ', config);

    let data
    try {
        console.log('API: ' + url + " : body: " + JSON.stringify(body));
        const response = await window.fetch(url, config)
        data = await response.json()
        if (response.ok) {
            return data
        }

        // if (response.status === 400) {
        //     return Promise.reject({
        //         type: 'Error',
        //         body: data,
        //     })
        // }

        throw new Error(response.statusText)
    } catch (err) {
        console.error('err: ', err);
        console.log('data: ', data);
        return Promise.reject(err.message ? err.message : data)
    }
}

client.get = async function (endpoint, customConfig = {}) {
    let token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    return client(token, endpoint, { ...customConfig, method: 'GET' })
}

client.post = async function (endpoint, body, customConfig = {}) {
    let token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    return client(token, endpoint, { ...customConfig, body })
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