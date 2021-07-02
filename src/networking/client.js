
export async function client(url, { body, ...customConfig } = {}) {
    const headers = {
        'Accept': "application/json",
        'Content-Type': 'application/json',
        'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMGVmYzFiM2QxOWQ5OTRiMmY1Yjk0NCIsInJvbGUiOiJIT1NURUxfQURNSU4iLCJpYXQiOjE2MTE1OTQ3Nzl9.jBbCyKqtCHJ67VAhF1mzBGD-lpvG011lC2tpA0Fk0Ec'
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

    let data
    try {
        console.log('API: ' + url + " : body: " + JSON.stringify(body));
        const response = await window.fetch(url + endpoint, config)
        data = await response.json()
        if (response.ok) {
            return data
        }
        throw new Error(response.statusText)
    } catch (err) {
        return Promise.reject(err.message ? err.message : data)
    }
}

client.get = function (endpoint, customConfig = {}) {
    return client(endpoint, { ...customConfig, method: 'GET' })
}

client.post = function (endpoint, body, customConfig = {}) {
    return client(endpoint, { ...customConfig, body })
}