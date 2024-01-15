package org.ilisi.taxifleet.userlocation;

import lombok.RequiredArgsConstructor;
import org.ilisi.taxifleet.model.User;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class UserLocationService {

    private final UserLocationRepository userLocationRepository;


    public UserLocation saveUserLocation(UserLocationDto userLocationDto, User user) {
        AtomicReference<UserLocation> userLocation = new AtomicReference<>();
        userLocationRepository.findByUser(user).ifPresentOrElse(
                location -> {
                    location.setLatitude(userLocationDto.latitude());
                    location.setLongitude(userLocationDto.longitude());
                    location.setConnected(true);
                    userLocation.set(userLocationRepository.save(location));
                },
                () -> userLocation.set(
                        userLocationRepository
                                .save(UserLocation
                                        .builder()
                                        .latitude(userLocationDto.latitude())
                                        .longitude(userLocationDto.longitude())
                                        .user(user)
                                        .connected(true)
                                        .build())
                ));
        return userLocation.get();
    }

    public void disconnectUser(User user) {
        userLocationRepository.findByUser(user).ifPresentOrElse(
                location -> {
                    location.setConnected(false);
                    userLocationRepository.save(location);
                },
                () -> userLocationRepository.save(UserLocation
                        .builder()
                        .latitude(0)
                        .longitude(0)
                        .user(user)
                        .connected(false)
                        .build())
        );
    }
}
