package org.ilisi.taxifleet.userlocation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.ilisi.taxifleet.model.User;

import java.time.Instant;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private double latitude;
    private double longitude;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private Instant createdOn;

    @UpdateTimestamp
    private Instant lastUpdatedOn;

    @Column(columnDefinition = "boolean default false")
    private boolean connected;


    @OneToOne(optional = false)
    @JsonIgnore
    private User user;

}
