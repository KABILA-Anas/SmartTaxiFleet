package org.ilisi.taxifleet.userLocation;

import org.ilisi.taxifleet.model.Passenger;
import org.ilisi.taxifleet.model.User;
import org.ilisi.taxifleet.userlocation.UserLocation;
import org.ilisi.taxifleet.userlocation.UserLocationDto;
import org.ilisi.taxifleet.userlocation.UserLocationRepository;
import org.ilisi.taxifleet.userlocation.UserLocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserLocationServiceTest {

    @Mock
    private UserLocationRepository userLocationRepository;

    @InjectMocks
    private UserLocationService userLocationService;

    private User user;
    private UserLocationDto userLocationDto;
    private UserLocation userLocation;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        user = new Passenger();
        userLocationDto = new UserLocationDto(1.0, 1.0);
        userLocation = new UserLocation();
        userLocation.setUser(user);
        userLocation.setLatitude(1.0);
        userLocation.setLongitude(1.0);
        userLocation.setConnected(true);
    }

    @Test
    void saveUserLocation_whenLocationExists_updatesLocation() {
        when(userLocationRepository.findByUser(user)).thenReturn(Optional.of(userLocation));

        userLocationService.saveUserLocation(userLocationDto, user);

        verify(userLocationRepository, times(1)).save(userLocation);
    }

    @Test
    void saveUserLocation_whenLocationDoesNotExist_createsNewLocation() {
        when(userLocationRepository.findByUser(user)).thenReturn(Optional.empty());

        userLocationService.saveUserLocation(userLocationDto, user);

        verify(userLocationRepository, times(1)).save(any(UserLocation.class));
    }

    @Test
    void disconnectUser_whenLocationExists_updatesLocation() {
        when(userLocationRepository.findByUser(user)).thenReturn(Optional.of(userLocation));

        userLocationService.disconnectUser(user);

        verify(userLocationRepository, times(1)).save(userLocation);
    }

    @Test
    void disconnectUser_whenLocationDoesNotExist_createsNewLocation() {
        when(userLocationRepository.findByUser(user)).thenReturn(Optional.empty());

        userLocationService.disconnectUser(user);

        verify(userLocationRepository, times(1)).save(any(UserLocation.class));
    }
}