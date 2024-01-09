package org.ilisi.taxifleet.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Session {

    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    @Id
    private String id;
    @Column(unique = true, nullable = false, length = 512)
    private String token;
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    private Instant lastRefreshedAt;
    @Column(nullable = false, updatable = false)
    private Instant expiresAt;

    // relation with user
    @ManyToOne
    private User user;
}
