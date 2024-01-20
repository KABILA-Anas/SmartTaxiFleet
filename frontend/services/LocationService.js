import {API_BASE_URL} from "../constants/api";

export default class LocationService {
    static sendLocation(location, token) {
        console.log("sendLocation", location);
        return fetch(`${API_BASE_URL}/userLocations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(location),
        })
            .then(res => res.json())
            .then(data => {
                console.log("sendLocation", data);
                return data;
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