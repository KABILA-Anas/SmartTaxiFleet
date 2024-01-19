import {API_BASE_URL} from "../constants/api";

export default class LocationService {
    static sendLocation(location) {
        fetch(`${API_BASE_URL}/userLocation`, {
            method: 'POST',
            body: JSON.stringify(location),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log("sendLocation", data);
            })
            .catch(err => {
                console.error("sendLocation_ERROR :", err);
            });
    }

    static getLocation(userId) {
        return fetch(`${API_BASE_URL}/userLocation/${userId}`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                console.log("getLocation", data);
                return data;
            });
    }
}