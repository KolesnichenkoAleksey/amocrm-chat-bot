import axios from "axios";

export const API_URL = 'https://bce4-77-95-90-50.ngrok-free.app/bot';

const $api = axios.create({
    baseURL: API_URL,
    withCredentials: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Content-Type': 'application/json',
    }
})

export default $api