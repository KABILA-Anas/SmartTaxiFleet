package org.ilisi.taxifleet.trip;

import lombok.RequiredArgsConstructor;
import org.ilisi.taxifleet.model.Driver;
import org.ilisi.taxifleet.model.Passenger;
import org.ilisi.taxifleet.model.User;
import org.ilisi.taxifleet.trip.model.Trip;
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
    @PreAuthorize("hasRole('ROLE_PASSENGER')")
    public ResponseEntity<Trip> getPassengerTripsInProgress(Principal principal) {
        Passenger passenger = ((Passenger) ((Authentication) principal).getPrincipal());
        var trip = tripService.getPassengerTripInProgress(passenger);
        return ResponseEntity.ok(trip);
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
    public ResponseEntity<Trip> acceptTrip(@PathVariable("tripId") Long tripId, Principal principal) {
        Driver driver = ((Driver) ((Authentication) principal).getPrincipal());
        Trip trip = tripService.acceptTrip(tripId, driver);
        return ResponseEntity.ok(trip);
    }

    @GetMapping("/trip/{tripId}/finish")
    @PreAuthorize("hasRole('ROLE_DRIVER') or hasRole('ROLE_PASSENGER')")
    public ResponseEntity<Trip> finishTrip(@PathVariable("tripId") Long tripId, Principal principal) {
        User user = ((User) ((Authentication) principal).getPrincipal());
        Trip trip = tripService.finishTrip(tripId, user);
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
