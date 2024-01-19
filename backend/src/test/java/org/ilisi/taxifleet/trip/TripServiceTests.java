package org.ilisi.taxifleet.trip;

import org.ilisi.taxifleet.model.Driver;
import org.ilisi.taxifleet.model.Passenger;
import org.ilisi.taxifleet.trip.dto.TripRequestDto;
import org.ilisi.taxifleet.trip.exception.NotAllowedToChangeTripException;
import org.ilisi.taxifleet.trip.model.Trip;
import org.ilisi.taxifleet.trip.model.TripStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

class TripServiceTests {

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private TripService tripService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateTripWhenNoTripInProgress() {
        // given
        Passenger passenger = getSamplePassenger();
        TripRequestDto tripRequestDto = TripRequestDto.builder()
                .pickupLatitude(1.0)
                .pickupLongitude(1.0)
                .destinationLatitude(2.0)
                .destinationLongitude(2.0)
                .passengerId(passenger.getId())
                .build();
        when(tripRepository.findByPassengerTipsInProgress(passenger.getId())).thenReturn(List.of());
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Trip result = tripService.createTrip(tripRequestDto, passenger);

        // then
        assertNotNull(result);
        assertEquals(TripStatus.PENDING, result.getStatus());
        assertEquals(passenger, result.getPassenger());
    }

    @Test
    void shouldThrowExceptionWhenCreatingTripWithTripInProgress() {
        // given
        Passenger passenger = new Passenger();
        TripRequestDto tripRequestDto = new TripRequestDto(
                1L,
                1.0,
                1.0,
                2.0,
                2.0
        );
        when(tripRepository.findByPassengerTipsInProgress(passenger.getId())).thenReturn(List.of(new Trip()));

        // then
        assertThrows(NotAllowedToChangeTripException.class, () -> tripService.createTrip(tripRequestDto, passenger));
    }

    @Test
    void shouldAcceptTripWhenDriverHasNoTripInProgress() {
        // given
        Driver driver = new Driver();
        Long tripId = 1L;
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(new Trip()));
        when(tripRepository.findByDriverTipsInProgress(driver.getId())).thenReturn(List.of());
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Trip result = tripService.acceptTrip(tripId, driver);

        // then
        assertNotNull(result);
        assertEquals(TripStatus.ACCEPTED, result.getStatus());
    }

    @Test
    void shouldThrowExceptionWhenAcceptingTripWithTripInProgress() {
        // given
        Driver driver = new Driver();
        Long tripId = 1L;
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(new Trip()));
        when(tripRepository.findByDriverTipsInProgress(driver.getId())).thenReturn(List.of(new Trip()));

        // then
        assertThrows(NotAllowedToChangeTripException.class, () -> tripService.acceptTrip(tripId, driver));
    }

    @Test
    void shouldFinishTripWhenUserIsDriverOrPassenger() {
        // given
        Passenger passenger = new Passenger();
        Long tripId = 1L;
        Trip trip = new Trip();
        trip.setPassenger(passenger);
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Trip result = tripService.finishTrip(tripId, passenger);

        // then
        assertNotNull(result);
        assertEquals(TripStatus.FINISHED, result.getStatus());
    }

    @Test
    void shouldThrowExceptionWhenFinishingTripWithUserNotDriverOrPassenger() {
        // given
        Passenger user = new Passenger();
        user.setId(2000L);
        Driver driver = new Driver();
        driver.setId(1000L);
        Long tripId = 1L;
        Trip trip = new Trip();
        trip.setDriver(driver);
        when(tripRepository.findById(tripId))
                .thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // then
        assertThrows(NotAllowedToChangeTripException.class, () -> tripService.finishTrip(tripId, user));
    }

    @Test
    void shouldCancelTripWhenUserIsDriver() {
        // given
        Driver user = new Driver();
        Long tripId = 1L;
        Trip trip = new Trip();
        trip.setDriver(user);
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Trip result = tripService.cancelTrip(tripId, user);

        // then
        assertNotNull(result);
        assertEquals(TripStatus.CANCELED, result.getStatus());
        assertNull(result.getDriver());
    }

    @Test
    void shouldCancelTripWhenUserIsPassenger() {
        // given
        Passenger passenger = new Passenger();
        Long tripId = 1L;
        Trip trip = new Trip();
        trip.setPassenger(passenger);
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        Trip result = tripService.cancelTrip(tripId, passenger);

        // then
        assertNotNull(result);
        assertEquals(TripStatus.CANCELED, result.getStatus());
        assertNull(result.getPassenger());
    }

    @Test
    void shouldThrowExceptionWhenCancelingTripWithUserNotDriverOrPassenger() {
        // given
        Driver user = new Driver();
        user.setId(2000L);
        Long tripId = 1L;
        Trip trip = new Trip();
        Driver driver = new Driver();
        driver.setId(1000L);
        trip.setDriver(driver);
        Passenger passenger = new Passenger();
        passenger.setId(3000L);
        trip.setPassenger(passenger);
        when(tripRepository.findById(tripId)).thenReturn(Optional.of(trip));
        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // then
        assertThrows(NotAllowedToChangeTripException.class, () -> tripService.cancelTrip(tripId, user));
    }


    private Passenger getSamplePassenger() {
        Passenger passenger = new Passenger();
        passenger.setId(1L);
        passenger.setCin("CIN");
        passenger.setFirstName("First Name");
        passenger.setLastName("Last Name");
        passenger.setPhone("Phone Number");
        passenger.setEmail("Email");
        passenger.setEnabled(true);
        passenger.setPassword("Password");
        return passenger;
    }
}