import axios from "axios"

const baseURL = process.env.API_URL
const apiKey = process.env.API_KEY

export const client = axios.create({
    baseURL,
    responseType: "json",
    withCredentials: false,
    params: {
        "api-key": apiKey
    }
})
