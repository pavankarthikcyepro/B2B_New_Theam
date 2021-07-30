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
        throw new Error(response.statusText)
    } catch (err) {
        console.log('err: ', err.message);
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