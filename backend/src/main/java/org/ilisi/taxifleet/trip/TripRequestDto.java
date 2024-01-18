package org.ilisi.taxifleet.trip;

import lombok.Builder;

@Builder
public record TripRequestDto(
        int passengerId,
        double pickupLatitude,
        double pickupLongitude,
        double destinationLatitude,
        double destinationLongitude
) {
}
