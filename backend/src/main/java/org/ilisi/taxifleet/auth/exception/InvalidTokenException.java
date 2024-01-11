package org.ilisi.taxifleet.auth.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

@EqualsAndHashCode(callSuper = true)
@Data
public class InvalidTokenException extends RuntimeException {
    private final ProblemDetail problemDetail;

    public InvalidTokenException(String message) {
        super(message);
        problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, message);
        problemDetail.setTitle(message);
    }

    public InvalidTokenException(String message, String detail) {
        super(message);
        problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, detail);
        problemDetail.setTitle(message);
    }

    public InvalidTokenException(String message, String detail, HttpStatus status) {
        super(message);
        problemDetail = ProblemDetail.forStatusAndDetail(status, detail);
        problemDetail.setTitle(message);
    }

}
