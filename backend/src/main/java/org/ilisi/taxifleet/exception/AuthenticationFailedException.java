package org.ilisi.taxifleet.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ResponseStatus;

@EqualsAndHashCode(callSuper = true)
@ResponseStatus(HttpStatus.BAD_REQUEST)
@Data
public class AuthenticationFailedException extends RuntimeException {
    private final ProblemDetail problemDetail;

    public AuthenticationFailedException(String message) {
        super(message);
        problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, message);
        problemDetail.setTitle(message);
    }

    public AuthenticationFailedException(String message, String detail) {
        super(message);
        problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, detail);
        problemDetail.setTitle(message);
    }
}
