
const BASE_URL = "";

const URLS = {
    LOGIN: ""
}

export const KEYS = {
    login: "LOGIN"
}

export const ENDPOINT = (key) => {
    return BASE_URL + URLS[key];
}