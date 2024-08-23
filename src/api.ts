import axios from "axios"

const baseURL = process.env.API_URL

export const client = axios.create({
    baseURL,
    responseType: "json",
    withCredentials: false,
})
