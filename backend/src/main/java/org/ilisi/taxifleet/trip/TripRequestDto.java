package org.ilisi.taxifleet.trip;

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
