package org.ilisi.taxifleet.trip.model;

public enum TripStatus {
    PENDING, // when the passenger creates the trip
    ACCEPTED, // when the driver accepts the trip
    CANCELED, // when the driver or the passenger cancels the trip
    FINISHED // when the trip is finished
}
