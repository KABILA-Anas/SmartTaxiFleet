package org.ilisi.taxifleet.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ilisi.taxifleet.dto.AuthRequestDTO;
import org.ilisi.taxifleet.exception.AuthenticationFailedException;
import org.ilisi.taxifleet.exception.InvalidTokenException;
import org.ilisi.taxifleet.model.Session;
import org.ilisi.taxifleet.model.User;
import org.ilisi.taxifleet.repository.SessionRepository;
import org.ilisi.taxifleet.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

    public Map<String, Object> authenticate(AuthRequestDTO appUser) {
        User user = (User) userRepository.loadUserByUsername(appUser.getUsername());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(appUser.getUsername(), appUser.getPassword())
        );
        // check if authentication is successful
        if (!authentication.isAuthenticated()) {
            throw new AuthenticationFailedException("username or password is incorrect !", "INVALID_CREDENTIALS");
        }
        // save refresh token
        String refreshToken = jwtService.generateRefreshToken(user);
        Session sessionEntity = new Session();
        sessionEntity.setToken(refreshToken);
        sessionEntity.setUser(user);
        sessionEntity.setCreatedAt(jwtService.extractIssuedAt(refreshToken).toInstant());
        sessionEntity.setExpiresAt(Instant.now().plusMillis(jwtService.extractExpiration(refreshToken).getTime()));

        log.info("saving refresh token : {}", sessionRepository.save(sessionEntity).getToken());
        // return tokens
        return Map.of(
                "accessToken", jwtService.generateAccessToken(user),
                "refreshToken", refreshToken
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

}