import {API_BASE_URL} from "../constants/api";
import {httpApi} from "./httpApi";

export default class LocationService {
    static sendLocation(location, token) {
        console.log("sendLocation", location);

        return httpApi.post('/userLocations', location).then(res => {
            console.log("sendLocation", res);
            return res.data;
        });
    }

    static getLocation(userId, token) {
        return fetch(`${API_BASE_URL}/userLocations/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log("getLocation", data);
                return data;
            });
    }
}