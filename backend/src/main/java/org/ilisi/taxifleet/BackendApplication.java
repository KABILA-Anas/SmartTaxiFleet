package org.ilisi.taxifleet;

import lombok.extern.slf4j.Slf4j;
import org.ilisi.taxifleet.auth.repository.UserRepository;
import org.ilisi.taxifleet.model.Passenger;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@Slf4j
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }


    @Bean
    public CommandLineRunner insertTestData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args ->
                // insert test data here
                userRepository.findByEmail("test@test.com").ifPresentOrElse(
                        user -> log.info("Test user already exists {}", user),
                        () -> {
                            Passenger passenger = new Passenger();
                            passenger.setEmail("test@test.com");
                            passenger.setPassword(passwordEncoder.encode("12345678"));
                            passenger.setFirstName("Test");
                            passenger.setLastName("Test");
                            passenger.setPhone("0000008800");
                            passenger.setCin("CD499889");
                            passenger.setEnabled(true);

                            Passenger saved = userRepository.save(passenger);
                            log.info("Saved test user with data {}", saved);

                        });

    }
}
