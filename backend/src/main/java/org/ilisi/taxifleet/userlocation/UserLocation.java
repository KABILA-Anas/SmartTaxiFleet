package org.ilisi.taxifleet.userlocation;

import jakarta.persistence.*;
import lombok.Data;
import org.ilisi.taxifleet.model.User;

@Data
@Entity
public class UserLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private double latitude;
    private double longitude;

    @ManyToOne
    private User user;

}
