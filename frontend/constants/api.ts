/*import axios from "axios";

const hostIp = '192.168.1.44';
const hostPort = 8080;

const api = axios.create({
    baseURL: `http://${hostIp}:${hostPort}`,
});

export default api;*/

// const hostIp = '192.168.1.44';
const hostIp = '192.168.137.163';
const hostPort = 8080;
export const API_BASE_URL = `http://${hostIp}:${hostPort}`;


export const AUTH_STORE_KEY = 'session';

export default {API_BASE_URL};