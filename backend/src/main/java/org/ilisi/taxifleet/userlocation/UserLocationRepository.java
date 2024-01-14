package org.ilisi.taxifleet.userlocation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserLocationRepository extends JpaRepository<UserLocation, Long> {


    @Query(value = "SELECT ul FROM UserLocation ul ")
    List<UserLocation> findNearbyUsers(double latitude, double longitude, double radius);

}
