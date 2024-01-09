package org.ilisi.taxifleet.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.ilisi.taxifleet.model.User;
import org.ilisi.taxifleet.security.JwtProperties;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtService {

    public static final String ACCESS_TOKEN_ATTR = "accessToken";
    public static final String REFRESH_TOKEN_ATTR = "refreshToken";

    private final JwtProperties jwtProperties;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Date extractIssuedAt(String token) {
        return extractClaim(token, Claims::getIssuedAt);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateAccessToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        if (!extractAllClaims(token).get("type", String.class).equals(ACCESS_TOKEN_ATTR)) return false;
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public Boolean validateRefreshToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        if (!extractAllClaims(token).get("type", String.class).equals(REFRESH_TOKEN_ATTR)) return false;
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token) && isRefreshToken(token));
    }

    public Boolean isRefreshToken(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class)).equals(REFRESH_TOKEN_ATTR);
    }

    public String generateAccessToken(User user) {
        if (user == null) throw new IllegalArgumentException("User cannot be null");
        if (user.getAuthorities() == null) throw new IllegalArgumentException("User authorities cannot be null"
        );
        if (user.getId() == null) throw new IllegalArgumentException("User id cannot be null");
        Map<String, Object> claims = Map.of(
                "roles", user.getAuthorities(),
                "userId", user.getId(),
                "type", ACCESS_TOKEN_ATTR
        );
        Instant instant = Instant.now();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(Date.from(instant))
                .setExpiration(Date.from(instant.plus(jwtProperties.accessTokenExpirationInMinutes(),
                        java.time.temporal.ChronoUnit.MINUTES)))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    public String generateRefreshToken(User user) {
        Map<String, Object> claims = Map.of(
                "roles", user.getAuthorities(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "userId", user.getId(),
                "type", REFRESH_TOKEN_ATTR
        );
        Instant instant = Instant.now();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getEmail())
                .setIssuedAt(Date.from(instant))
                .setExpiration(Date.from(instant.plus(jwtProperties.refreshTokenExpirationInDays(),
                        java.time.temporal.ChronoUnit.DAYS)))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.key());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}