package org.ilisi.taxifleet.trip.dto;

import lombok.Builder;

@Builder
public record TripRequestDto(
        long passengerId,
        double pickupLatitude,
        double pickupLongitude,
        double destinationLatitude,
        double destinationLongitude
) {
}
