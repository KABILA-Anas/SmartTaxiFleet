package org.ilisi.taxifleet.userlocation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ilisi.taxifleet.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;
import java.util.Map;

@Controller
@Slf4j
@RequestMapping("/userLocations")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class UserLocationController {

    private final UserLocationService userLocationService;

    @PostMapping("/")
    public ResponseEntity<UserLocation> handleUserLocation(@RequestBody UserLocationDto userLocationDto,
                                                           Principal principal) {
        User user = ((User) ((Authentication) principal).getPrincipal());
        // Handle the received user location message
        log.info("Received user location message: {} from user: {}", userLocationDto, user.getUsername());
        UserLocation userLocation = userLocationService.saveUserLocation(userLocationDto, user);
        return ResponseEntity.ok(userLocation);
    }

//    @GetMapping("getLocations")
//    @PreAuthorize("hasRole('ROLE_DRIVER')")
//    public ResponseEntity<Map<String, Object>> handleUserLocations(Principal principal) {
//        User user = ((User) ((Authentication) principal).getPrincipal());
//        // Handle the received user location message
//
//    }


    @GetMapping("/disconnect")
    public ResponseEntity<Map<String, Object>> handleUserConnection(Principal principal) {
        User user = ((User) ((Authentication) principal).getPrincipal());
        // Handle the received user location message
        log.info("Received user connection message from user: {}", user.getUsername());
        userLocationService.disconnectUser(user);
        return ResponseEntity.ok(Map.of(
                "message", "User disconnected successfully"
        ));
    }


}
