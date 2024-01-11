package org.ilisi.taxifleet.auth;

import jakarta.validation.ConstraintViolation;
import org.ilisi.taxifleet.auth.dto.AuthRequestDTO;
import org.ilisi.taxifleet.auth.service.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthenticationControllerUnitTests {

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private AuthenticationController authenticationController;


    private LocalValidatorFactoryBean localValidatorFactory;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        localValidatorFactory = new LocalValidatorFactoryBean();
        localValidatorFactory.afterPropertiesSet();
    }


    @Test
    void loginReturnsTokenWhenAuthenticationSucceeds() {
        AuthRequestDTO authRequestDTO = new AuthRequestDTO();
        authRequestDTO.setUsername("test@example.com");
        authRequestDTO.setPassword("test123456");

        when(authenticationService.authenticate(any(AuthRequestDTO.class)))
                .thenReturn(Map.of(
                        "accessToken", "dummy-access-token",
                        "refreshToken", "dummy-refresh-token"
                ));

        ResponseEntity<Map<String, Object>> response = authenticationController.login(authRequestDTO);

        assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

        Map<String, ?> tokens = response.getBody();
        assert tokens != null;
        assertTrue(tokens.containsKey("accessToken"));
        assertEquals("dummy-access-token", tokens.get("accessToken"));
        assertTrue(tokens.containsKey("refreshToken"));
        assertEquals("dummy-refresh-token", tokens.get("refreshToken"));
    }

    @Test
    void loginThrowsExceptionWhenAuthenticationFails() {
        AuthRequestDTO authRequestDTO = new AuthRequestDTO();
        authRequestDTO.setUsername("test@example.com");
        authRequestDTO.setPassword("wrong-password");

        when(authenticationService.authenticate(any(AuthRequestDTO.class)))
                .thenThrow(new org.springframework.security.core.AuthenticationException("Authentication failed") {
                });

        assertThrows(org.springframework.security.core.AuthenticationException.class,
                () -> authenticationController.login(authRequestDTO));
    }


    @Test
    void loginThrowsExceptionWhenInputIsInvalid() {
        AuthRequestDTO authRequestDTO = new AuthRequestDTO();
        authRequestDTO.setUsername("invalid-email");
        authRequestDTO.setPassword("short");

        var violations = localValidatorFactory.validate(authRequestDTO);

        assertFalse(violations.isEmpty(), "Expected validation errors did not occur");

        for (ConstraintViolation<AuthRequestDTO> violation : violations) {
            String propertyPath = violation.getPropertyPath().toString();
            String message = violation.getMessage();

            if ("username".equals(propertyPath)) {
                assertEquals("must be a well-formed email address", message);
            } else if ("password".equals(propertyPath)) {
                assertEquals("Password must be at least 8 characters long", message);
            }
        }

    }

    @Test
    void loginThrowsExceptionWhenAuthenticationServiceThrowsException() {
        AuthRequestDTO authRequestDTO = new AuthRequestDTO();
        authRequestDTO.setUsername("test@example.com");
        authRequestDTO.setPassword("test123456");

        when(authenticationService.authenticate(any(AuthRequestDTO.class)))
                .thenThrow(new RuntimeException("Unexpected error"));

        Exception exception = assertThrows(
                RuntimeException.class,
                () -> authenticationController.login(authRequestDTO)
        );
        assertEquals("Unexpected error", exception.getMessage());
    }

}