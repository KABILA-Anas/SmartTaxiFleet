package org.ilisi.taxifleet.userlocation;

import lombok.Builder;

@Builder
public record UserLocationDto(
        double latitude,
        double longitude
) {
}
