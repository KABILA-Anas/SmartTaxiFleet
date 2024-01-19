import {API_BASE_URL} from "../constants/api";

class TripService {
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
        return fetch(`${API_BASE_URL}/trip/${tripId}/finish`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                console.log("finishTrip", data);
                return data;
            });
    }

    static createTrip(sourceLocation, destinationLocation) {
        return fetch(`${API_BASE_URL}/trip`, {
            method: 'POST',
            body: JSON.stringify({
                sourceLocation,
                destinationLocation
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log("createTrip", data);
                return data;
            });
    }

    static checkProgress() {
        return fetch(`${API_BASE_URL}/trips/in-progress`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                console.log("checkProgress", data);
                return data;
            });
    }
}