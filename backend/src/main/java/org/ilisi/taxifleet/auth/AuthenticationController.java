package org.ilisi.taxifleet.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ilisi.taxifleet.auth.dto.AuthRequestDTO;
import org.ilisi.taxifleet.auth.dto.RegisterUserDto;
import org.ilisi.taxifleet.auth.service.AuthenticationService;
import org.ilisi.taxifleet.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody @Valid AuthRequestDTO appUser) {
        log.info("Received login request for username: {}", appUser.getUsername());
        try {
            // Authentication logic
            Map<String, Object> tokens = authenticationService.authenticate(appUser);
            log.info("Authentication successful for user: {}", appUser.getUsername());
            return ResponseEntity.ok(tokens);
        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {}", appUser.getUsername(), e);
            throw e; // Rethrow the exception for handling in a global exception handler, if configured.
        }
    }

    @PostMapping("/register/{role}")
    public ResponseEntity<Map<String, Object>> register(@RequestBody @Valid RegisterUserDto user,
                                                        @PathVariable String role) {
        if (!role.equalsIgnoreCase("passenger") && !role.equalsIgnoreCase("driver")) {
            throw new IllegalArgumentException("Role must be either passenger or driver");
        }
        User registedUser = authenticationService.registerUser(user, role);
        log.info("Received registerUser request for username: {}", registedUser.getUsername());
        return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "user", registedUser
        ));

    }


    @PostMapping("/refreshToken")
    public ResponseEntity<Map<String, Object>> generateRefreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        log.info("Received refresh token request for token: {}", refreshToken);
        try {
            // Authentication logic
            Map<String, Object> tokens = authenticationService.generateNewAccessToken(refreshToken);
            log.info("Refresh token successful for token: {}", refreshToken);
            return ResponseEntity.ok(tokens);
        } catch (AuthenticationException e) {
            log.error("Refresh token failed for token: {}", refreshToken, e);
            throw e; // Rethrow the exception for handling in a global exception handler, if configured.
        }
    }

}