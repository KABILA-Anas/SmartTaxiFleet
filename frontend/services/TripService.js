import {API_BASE_URL} from "../constants/api";
import {httpApi} from "./httpApi";


export default class TripService {
    static nearbyTrips(location) {
        return fetch(`${API_BASE_URL}/nearby?latitude=${location.latitude}&longitude=${location.longitude}`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                console.log("nearbyTrips", data);
                return data;
            });
    }

    static acceptTrip(tripId) {
        return fetch(`${API_BASE_URL}/trip/${tripId}/accept`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                console.log("acceptTrip", data);
                return data;
            });
    }

    static finishTrip(tripId) {
        return httpApi.get(`/trip/${tripId}/finish`).then(res => {
            console.log("finishTrip", res.data);
            return res.data;
        });
    }

    static createTrip(pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude) {
        return httpApi.post('/trips/request', {
            pickupLatitude,
            pickupLongitude,
            destinationLatitude,
            destinationLongitude
        }).then(res => {
            console.log("createTrip", res.data);
            return res.data;
        });
    }

    static tripInProgress() {
        /*return fetch(`${API_BASE_URL}/trips/in-progress`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                console.log("checkProgress", data);
                return data;
            });*/
        
        return httpApi.get('/trips/in-progress').then(res => {
            console.log("tripInProgress", res.data);
            return res.data;
        });
    }
}