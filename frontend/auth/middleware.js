import axios from 'axios';
import {Service} from 'axios-middleware';
import * as SecureStore from "expo-secure-store";

const service = new Service(axios);


service.register({
    async onRequest(config) {
        console.log(`onRequest ${config.url}`);
        const user = JSON.parse(await SecureStore.getItemAsync('session') || null);
        if (user) {
            config.headers = {
                Authorization: `Bearer ${user.accessToken}`,
                ...config.headers
            }
        }

        config.headers = {
            ContentType: 'application/json',
            ...config.headers
        }

        return config;
    },
    onSync(promise) {
        console.log('onSync');
        return promise;
    },
    onResponse(response) {
        console.log('onResponse');
        return response;
    }
});

export default service;