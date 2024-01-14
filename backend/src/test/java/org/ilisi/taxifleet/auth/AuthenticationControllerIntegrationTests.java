package org.ilisi.taxifleet.auth;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.ilisi.taxifleet.auth.repository.UserRepository;
import org.ilisi.taxifleet.model.Passenger;
import org.ilisi.taxifleet.model.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
@Slf4j
class AuthenticationControllerIntegrationTests {

    @ServiceConnection
    @Container
    static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:latest");
    static ObjectMapper objectMapper = new ObjectMapper();
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
    }


    @AfterEach
    void afterEachSetup() {
        userRepository.deleteAll();
    }


    @Test()
    void loginReturns200WhenAuthenticationSucceeds() throws Exception {
        // given
        User user = getEnabledValidTestPassenger();
        userRepository.save(user);


        // when
        ResultActions test = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.format("{\"username\": \"%s\", \"password\": \"%s\"}", user.getEmail(), "test123456")));

        // then
        test.andExpect(status().isOk()).andExpect(result -> {
            String content = result.getResponse().getContentAsString();
            assert !content.isEmpty();

            log.info("Response content: {}", content);
            // parse content to JSON
            Map<String, Object> tokens = objectMapper.readValue(content, Map.class);
            log.info("Parsed response content: {}", tokens);
            log.info("********************************");
            // assert that it returned Access and Refresh tokens
            assertTrue(tokens.containsKey("accessToken"));
            assertTrue(tokens.containsKey("refreshToken"));
        });
    }

    @Test
    void loginReturns400WhenAuthenticationFails() throws Exception {
        // given
        User user = getEnabledInvalidTestPassenger();
        userRepository.save(user);


        // when
        ResultActions test = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                        String.format(
                                "{\"username\": \"%s\", \"password\": \"%s\"}",
                                user.getEmail(), "test123456")));

        // then
        test.andExpectAll(
                status().isBadRequest(),
                result -> {
                    String content = result.getResponse().getContentAsString();
                    assert !content.isBlank();

                    // parse content to JSON
                    Map<String, Object> body = objectMapper.readValue(content, new TypeReference<>() {
                    });

                    // assert that it returned an error message
                    assertTrue(body.containsKey("message"));
                    assertEquals("Input validation failed", body.get("message"));

                    // assert that it returned a list of errors
                    assertTrue(body.containsKey("errors"));
                    Map<String, String> errors = objectMapper.convertValue(body.get("errors"), new TypeReference<>() {
                    });

                    // assert that the list of errors contains the expected errors
                    assertTrue(errors.containsKey("username"));
                    assertEquals("must be a well-formed email address", errors.get("username"));

                }
        );
    }


    private Passenger getEnabledValidTestPassenger() {
        Passenger manager = new Passenger();
        manager.setEmail("test@mail.com");
        manager.setPassword(passwordEncoder.encode("test123456"));
        manager.setFirstName("test");
        manager.setLastName("test");
        manager.setPhone("test");
        manager.setCin("test");

        manager.setEnabled(true);
        return manager;
    }

    private Passenger getEnabledInvalidTestPassenger() {
        Passenger manager = new Passenger();
        manager.setEmail("test");
        manager.setPassword(passwordEncoder.encode("test123456"));
        manager.setFirstName("test");
        manager.setLastName("test");
        manager.setPhone("test");
        manager.setCin("test");

        manager.setEnabled(true);
        return manager;
    }
}