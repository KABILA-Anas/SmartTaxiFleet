package org.ilisi.taxifleet.trip;

import lombok.RequiredArgsConstructor;
import org.ilisi.taxifleet.model.Driver;
import org.ilisi.taxifleet.model.Passenger;
import org.ilisi.taxifleet.model.User;
import org.ilisi.taxifleet.trip.dto.TripInProgressDto;
import org.ilisi.taxifleet.trip.dto.TripRequestDto;
import org.ilisi.taxifleet.trip.model.Trip;
import org.ilisi.taxifleet.userlocation.UserLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class TripController {

    private final TripService tripService;
    private final UserLocationService userLocationService;

    @GetMapping("/trips/nearby")
    @PreAuthorize("hasRole('ROLE_DRIVER')")
    public ResponseEntity<List<Trip>> getTripNearbyPassengersTrips(
            @RequestParam(value = "minDistance", required = false, defaultValue = "2000.0") Double minDistance,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude) {
        var trips = tripService.getTripNearbyPassengersTrips(latitude, longitude, minDistance);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/trips/in-progress")
    public ResponseEntity<TripInProgressDto> getPassengerTripsInProgress(Principal principal) {
        User user = ((User) ((Authentication) principal).getPrincipal());
        var trip = tripService.getUserTripInProgress(user);

        var driverLocation = userLocationService.getUserLocation(user);
        return ResponseEntity.ok(TripInProgressDto
                .builder()
                .trip(trip)
                .userLocation(driverLocation)
                .build());
    }

    @PostMapping("/trips/request")
    @PreAuthorize("hasRole('ROLE_PASSENGER')")
    public ResponseEntity<Trip> requestTrip(@RequestBody TripRequestDto tripRequestDto, Principal principal) {
        Passenger passenger = ((Passenger) ((Authentication) principal).getPrincipal());
        Trip trip = tripService.createTrip(tripRequestDto, passenger);
        return ResponseEntity.ok(trip);
    }

    @GetMapping("/trip/{tripId}/accept")
    @PreAuthorize("hasRole('ROLE_DRIVER')")
    public ResponseEntity<TripInProgressDto> acceptTrip(@PathVariable("tripId") Long tripId, Principal principal) {
        Driver driver = ((Driver) ((Authentication) principal).getPrincipal());
        Trip trip = tripService.acceptTrip(tripId, driver);
        var passengerLocation = userLocationService.getUserLocation(trip.getPassenger());
        return ResponseEntity.ok(TripInProgressDto
                .builder()
                .trip(trip)
                .userLocation(passengerLocation)
                .build());
    }

    @GetMapping("/trip/auto/accept")
    @PreAuthorize("hasRole('ROLE_DRIVER')")
    public ResponseEntity<TripInProgressDto> acceptTrip(Principal principal) {
        Driver driver = ((Driver) ((Authentication) principal).getPrincipal());
        Trip trip = tripService.autoAcceptTrip(driver);
        var passengerLocation = userLocationService.getUserLocation(trip.getPassenger());
        return ResponseEntity.ok(TripInProgressDto
                .builder()
                .trip(trip)
                .userLocation(passengerLocation)
                .build());
    }

    @GetMapping("/trip/{tripId}/finish")
    @PreAuthorize("hasRole('ROLE_PASSENGER')")
    public ResponseEntity<Trip> finishTrip(@PathVariable("tripId") Long tripId, Principal principal) {
        Passenger passenger = ((Passenger) ((Authentication) principal).getPrincipal());
        Trip trip = tripService.finishTrip(tripId, passenger);
        return ResponseEntity.ok(trip);
    }

    @GetMapping("/trip/{tripId}/cancel")
    @PreAuthorize("hasRole('ROLE_DRIVER') or hasRole('ROLE_PASSENGER')")
    public ResponseEntity<Trip> cancelTrip(@PathVariable("tripId") Long tripId, Principal principal) {
        User user = ((User) ((Authentication) principal).getPrincipal());
        Trip trip = tripService.cancelTrip(tripId, user);
        return ResponseEntity.ok(trip);
    }
}
