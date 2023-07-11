import axios from "axios"

export const client = axios.create({
    baseURL: "https://emailer-rest.fly.dev",
    responseType: "json",
    withCredentials: false,
    params: {
        "api-key": "yIXhC73RKP4rpj2h5rl9tu7TneljxSBy"
    }
})
