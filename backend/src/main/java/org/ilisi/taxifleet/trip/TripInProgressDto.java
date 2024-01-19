package org.ilisi.taxifleet.trip;

import lombok.AllArgsConstructor;
import lombok.Builder;
import org.ilisi.taxifleet.trip.model.Trip;
import org.ilisi.taxifleet.userlocation.UserLocation;

@Builder
public record TripInProgressDto(
        Trip trip,
        UserLocation userLocation
) {

}
