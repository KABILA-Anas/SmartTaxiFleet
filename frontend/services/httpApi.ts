import axios from "axios";
import {API_BASE_URL, AUTH_STORE_KEY} from "../constants/api";
import {AuthResponse} from "../auth/types";
import {getStorageItemAsync} from "./useStorageState";

const TOKEN_KEY = "token"
const httpApi = axios.create({
    baseURL: API_BASE_URL
})

httpApi.interceptors.request.use(async (config) => {
    console.log('interceptor 2')

    const newVar = await getStorageItemAsync(AUTH_STORE_KEY)
    console.log(newVar)

    const {accessToken} = JSON.parse(newVar ?? '{}') as AuthResponse

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
})


httpApi.interceptors.response.use(async (response) => {
    return response
}, async function (error) {
    console.error(error)
    // if (error.response.status === 401) {
    //     httpApi.defaults.headers.common['Authorization'] = ''
    //     // await SecureStore.deleteItemAsync(TOKEN_KEY)
    //     // navigation.navigate('SignIn')
    // }
    return Promise.reject(error);
});

export {httpApi}