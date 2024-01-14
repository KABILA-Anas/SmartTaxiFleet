package org.ilisi.taxifleet.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("jwt")
public record JwtProperties(
        String key,
        Long accessTokenExpirationInMinutes,
        Long refreshTokenExpirationInDays
) {

}