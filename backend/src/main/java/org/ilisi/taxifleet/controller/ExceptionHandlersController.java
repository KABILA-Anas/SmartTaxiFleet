package org.ilisi.taxifleet.controller;

import lombok.extern.slf4j.Slf4j;
import org.ilisi.taxifleet.trip.exception.NotAllowedToChangeTripException;
import org.ilisi.taxifleet.trip.exception.TripNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class ExceptionHandlersController {

    @ExceptionHandler(TripNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleTripNotFoundException(TripNotFoundException e) {
        Map<String, Object> body = Map.of("message", e.getMessage());
        log.error("Trip not found", e);
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NotAllowedToChangeTripException.class)
    public ResponseEntity<Map<String, Object>> handleNotAllowedToChangeTripException(NotAllowedToChangeTripException e) {
        Map<String, Object> body = Map.of("message", e.getMessage());
        log.error("Not allowed to change trip", e);
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException e) {
        Map<String, Object> body = Map.of("message", e.getMessage());
        log.error("Authentication failed", e);
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException e) {
        Map<String, Object> body = Map.of("message", e.getMessage());
        log.error("Illegal argument", e);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {


        Map<String, String> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
        log.error("Method argument not valid", e);
        return new ResponseEntity<>(Map.of(
                "message", "Input validation failed",
                "errors", errors
        ), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", e.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        // add the cause of the exeption in the returned body
        Map<String, Object> body = Map.of("message", e.getMessage());
        log.error("Exception", e);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }


}