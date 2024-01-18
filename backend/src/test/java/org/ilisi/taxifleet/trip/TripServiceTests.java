package org.ilisi.taxifleet.trip;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class TripServiceTests {

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private TripService tripService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }


}