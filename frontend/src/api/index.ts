import axios from "axios";

export const API_URL = '';

const api = axios.create({
    baseURL: API_URL,
})

export default api