package org.ilisi.taxifleet.trip;

import org.ilisi.taxifleet.trip.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    @Query("SELECT t FROM Trip t WHERE t.passenger.id = ?1 and t.status = 'PENDING' or t.status = 'ACCEPTED'")
    List<Trip> findByPassengerTipsInProgress(Long passengerId);

    @Query("""
            SELECT t FROM Trip t
                WHERE t.status = 'PENDING' and t.driver is null
                     and ST_Distance(ST_MakePoint(t.departureLongitude, t.departureLatitude),
                        (select ST_MakePoint(ul.longitude, ul.latitude)
                            from UserLocation ul
                            where ul.user.id = ?1)) <= 2000
                order by ST_Distance(ST_MakePoint(t.departureLongitude, t.departureLatitude),
                        (select ST_MakePoint(ul.longitude, ul.latitude)
                            from UserLocation ul
                            where ul.user.id = ?1)) asc
                limit 1
            """)
    Optional<Trip> findByClosestPassengerTip(long driverId);

    @Query("SELECT t FROM Trip t WHERE t.driver.id = ?1 and t.status = 'PENDING' or t.status = 'ACCEPTED'")
    List<Trip> findByDriverTipsInProgress(Long driverId);

    @Query("""
                SELECT t FROM Trip t
                WHERE t.status = 'PENDING'
                AND ST_Distance(ST_MakePoint(t.departureLongitude, t.departureLatitude), ST_MakePoint(?2, ?1)) <= ?3
            """)
    List<Trip> findTripNearbyPassengersTrips(double latitude, double longitude, double minDistance);
}
