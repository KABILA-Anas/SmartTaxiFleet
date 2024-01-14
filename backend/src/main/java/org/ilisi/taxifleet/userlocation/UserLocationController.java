package org.ilisi.taxifleet.userlocation;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class UserLocationController {

    @MessageMapping("/userLocation")
    public void handleUserLocation(@Payload UserLocationMessage userLocationMessage) {
        // Handle the received user location message
        log.info("Received user location: " + userLocationMessage.getLocation());
    }
}
