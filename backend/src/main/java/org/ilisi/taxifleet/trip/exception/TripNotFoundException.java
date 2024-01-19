package org.ilisi.taxifleet.trip.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TripNotFoundException extends RuntimeException {
    public TripNotFoundException(String tripNotFound) {
        super(tripNotFound);
    }
}
