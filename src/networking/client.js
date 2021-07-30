import * as AsyncStore from '../asyncStore';

export const client = async (url, { body, ...customConfig } = {}) => {

    const headers = {
        'Accept': "application/json",
        'Content-Type': 'application/json',
    }

    let userToken = getAuthToken();
    console.log('token: ', userToken)
    // if (useDispatch) {
    //     headers['auth-token'] = userToken;
    // }

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
    console.log('config: ', config);

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
        console.log('err: ', err);
        return Promise.reject(err.message ? err.message : data)
    }
}

const getAuthToken = async () => {
    let token = await AsyncStore.getData(AsyncStore.Keys.USER_TOKEN);
    console.log('token: ', token);
    return token
}

client.get = function (endpoint, customConfig = {}) {
    return client(endpoint, { ...customConfig, method: 'GET' })
}

client.post = function (endpoint, body, customConfig = {}) {
    return client(endpoint, { ...customConfig, body })
}

// 'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMGVmYzFiM2QxOWQ5OTRiMmY1Yjk0NCIsInJvbGUiOiJIT1NURUxfQURNSU4iLCJpYXQiOjE2MTE1OTQ3Nzl9.jBbCyKqtCHJ67VAhF1mzBGD-lpvG011lC2tpA0Fk0Ec'
