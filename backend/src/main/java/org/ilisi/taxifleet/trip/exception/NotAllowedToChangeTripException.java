package org.ilisi.taxifleet.trip.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class NotAllowedToChangeTripException extends RuntimeException {
    public NotAllowedToChangeTripException(String s) {
        super(s);
    }
}
