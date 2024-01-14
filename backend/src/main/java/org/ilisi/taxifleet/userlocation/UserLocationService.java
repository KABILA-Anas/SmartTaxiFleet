package org.ilisi.taxifleet.userlocation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserLocationService {

    private final UserLocationRepository userLocationRepository;


    public List<UserLocation> getNearbyUsers(double latitude, double longitude, double radius) {

        return userLocationRepository.findAll();
    }

}
