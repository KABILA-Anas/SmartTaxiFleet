package org.ilisi.taxifleet.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ilisi.taxifleet.auth.dto.AuthRequestDTO;
import org.ilisi.taxifleet.auth.dto.RegisterUserDto;
import org.ilisi.taxifleet.auth.exception.AuthenticationFailedException;
import org.ilisi.taxifleet.auth.exception.InvalidTokenException;
import org.ilisi.taxifleet.auth.repository.SessionRepository;
import org.ilisi.taxifleet.auth.repository.UserRepository;
import org.ilisi.taxifleet.model.Driver;
import org.ilisi.taxifleet.model.Passenger;
import org.ilisi.taxifleet.model.Session;
import org.ilisi.taxifleet.model.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Map<String, Object> authenticate(AuthRequestDTO appUser) {
        User user = (User) userRepository.loadUserByUsername(appUser.getUsername());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(appUser.getUsername(), appUser.getPassword())
        );
        // check if authentication is successful
        if (!authentication.isAuthenticated()) {
            throw new AuthenticationFailedException("username or password is incorrect !", "INVALID_CREDENTIALS");
        }
        // generate tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        // save refresh token
        Session sessionEntity = new Session();
        sessionEntity.setToken(refreshToken);
        sessionEntity.setUser(user);
        sessionEntity.setCreatedAt(jwtService.extractIssuedAt(refreshToken).toInstant());
        sessionEntity.setExpiresAt(Instant.now().plusMillis(jwtService.extractExpiration(refreshToken).getTime()));

        log.info("saving refresh token : {}", sessionRepository.save(sessionEntity).getToken());
        // return tokens
        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "user", user
        );
    }


    public Map<String, Object> generateNewAccessToken(String refreshToken) {
        Session session = sessionRepository.findByToken(refreshToken)
                .orElse(null);
        if (session == null) {
            throw new InvalidTokenException("login again, session not valid !", "REFRESH_TOKEN_SESSION_NOT_FOUND");
        }
        User user = session.getUser();
        if (jwtService.validateRefreshToken(refreshToken, user)) {
            // update refresh token
            session.setLastRefreshedAt(Instant.now());
            sessionRepository.save(session);
            // refresh access token and return tokens
            String accessToken = jwtService.generateAccessToken(user);
            return Map.of(
                    "accessToken", accessToken
            );
        }
        throw new InvalidTokenException("login again, session not valid !", "REFRESH_TOKEN_SESSION_NOT_VALID");
    }

    public User registerUser(RegisterUserDto user, String role) {
        User userEntity = role.equals("passenger") ? new Passenger() : new Driver();

        userEntity.setEmail(user.email());
        userEntity.setCin(user.cin());
        userEntity.setFirstName(user.firstName());
        userEntity.setLastName(user.lastName());
        userEntity.setPassword(passwordEncoder.encode(user.password()));
        userEntity.setPhone(user.phone());
        userEntity.setEnabled(true);
        return userRepository.save(userEntity);
    }
}