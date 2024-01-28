import {httpApi} from "./httpApi";


export default class TripService {
    
    static nearbyTrips(location) {
        console.log("Location", location);
        return httpApi.get(`/trips/nearby?latitude=${location.latitude}&longitude=${location.longitude}`)
        .then(res => {
            console.log("nearbyTrips", res.data);
            return res.data;
        });
            
    }

    static acceptTrip(tripId) {
        return httpApi.get(`/trip/${tripId}/accept`).then(res => {
            console.log("acceptTrip", res.data);
            return res.data;
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
        return httpApi.get('/trips/in-progress').then(res => {
            console.log("tripInProgress", res.data);
            return res.data;
        });
    }

    static autoMatchTrip() {
        return httpApi.get('/trip/auto/accept').then(res => {
            console.log("autoMatchTrip", res.data);
            return res.data;
        });
    }


}