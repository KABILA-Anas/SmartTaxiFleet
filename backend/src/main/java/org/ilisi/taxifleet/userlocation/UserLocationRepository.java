package org.ilisi.taxifleet.userlocation;

import org.ilisi.taxifleet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserLocationRepository extends JpaRepository<UserLocation, Long> {


    Optional<UserLocation> findByUser(User user);

}
