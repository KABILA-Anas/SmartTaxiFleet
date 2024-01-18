package org.ilisi.taxifleet.trip;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ilisi.taxifleet.model.Driver;
import org.ilisi.taxifleet.model.Passenger;
import org.ilisi.taxifleet.model.User;
import org.ilisi.taxifleet.trip.exception.NotAllowedToChangeTripException;
import org.ilisi.taxifleet.trip.exception.TripNotFoundException;
import org.ilisi.taxifleet.trip.model.Trip;
import org.ilisi.taxifleet.trip.model.TripStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Validated
@Slf4j
public class TripService {

    private final TripRepository tripRepository;

    public List<Trip> getTripNearbyPassengersTrips(Double latitude, Double longitude, Double minDistance) {
        if (minDistance == null) {
            minDistance = 2000.0;
        }
        return tripRepository.findTripNearbyPassengersTrips(latitude,longitude, minDistance);
    }

    public Trip createTrip(TripRequestDto trip, Passenger passenger) {
        // check if the passenger has a trip in progress
        if (!tripRepository.findByPassengerTipsInProgress(passenger.getId()).isEmpty()) {
            throw new NotAllowedToChangeTripException("You already have a trip in progress");
        }

        Trip tripToCreate = Trip.builder()
                .passenger(passenger)
                .departureLatitude(trip.pickupLatitude())
                .departureLongitude(trip.destinationLongitude())
                .destinationLatitude(trip.destinationLatitude())
                .destinationLongitude(trip.destinationLongitude())
                .status(TripStatus.PENDING)
                .build();
        return tripRepository.save(tripToCreate);
    }

    public Trip acceptTrip(Long tripId, Driver driver) {
        assertDriverHasNoTripInProgress(driver);

        Optional<Trip> trip = tripRepository.findById(tripId);
        if (trip.isPresent()) {
            Trip tripToAccept = trip.get();
            tripToAccept.setDriver(driver);
            tripToAccept.setStatus(TripStatus.ACCEPTED);
            return tripRepository.save(tripToAccept);
        }
        throw new TripNotFoundException("Trip not found");
    }

    private void assertDriverHasNoTripInProgress(Driver driver) {
        if (!tripRepository.findByDriverTipsInProgress(driver.getId()).isEmpty()) {
            throw new NotAllowedToChangeTripException("You already have a trip in progress");
        }
    }

    public Trip finishTrip(Long tripId, User user) {
        Optional<Trip> trip = tripRepository.findById(tripId);
        if (trip.isPresent()) {
            Trip tripToFinish = trip.get();
            //check if the user is the driver or the passenger of the trip
            if (Objects.equals(tripToFinish.getDriver(), user) || Objects.equals(tripToFinish.getPassenger(), user)) {
                tripToFinish.setStatus(TripStatus.FINISHED);
                return tripRepository.save(tripToFinish);
            }
            throw new NotAllowedToChangeTripException("You are not allowed to finish this trip");
        }
        throw new TripNotFoundException("Trip not found");
    }

    public Trip cancelTrip(Long tripId, User user) {
        Optional<Trip> trip = tripRepository.findById(tripId);
        if (trip.isPresent()) {
            Trip tripToCancel = trip.get();
            //check if the user is the driver or the passenger of the trip
            if (Objects.equals(tripToCancel.getDriver(), user)) {
                tripToCancel.setStatus(TripStatus.CANCELED);
                tripToCancel.setDriver(null);
                return tripRepository.save(tripToCancel);
            }
            if (Objects.equals(tripToCancel.getPassenger(), user)) {
                tripToCancel.setStatus(TripStatus.CANCELED);
                tripToCancel.setPassenger(null);
                return tripRepository.save(tripToCancel);
            }
            throw new NotAllowedToChangeTripException("You are not allowed to cancel this trip");
        }
        throw new TripNotFoundException("Trip not found");
    }

    public Trip getPassengerTripInProgress(Passenger passenger) {
        List<Trip> trips = tripRepository.findByPassengerTipsInProgress(passenger.getId());
        if (trips.isEmpty()) {
            throw new TripNotFoundException("you have no trip in progress");
        }
        if (trips.size() > 1) {
            log.error("Passenger {} has more than one trip in progress : {}", passenger.getId(), trips);
        }
        return trips.get(0);
    }
}
