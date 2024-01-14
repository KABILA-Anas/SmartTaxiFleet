package org.ilisi.taxifleet.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.ilisi.taxifleet.model.User;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@RequiredArgsConstructor
@Slf4j
public class WebSocketConnectHandler extends AbstractWebSocketHandler {

    private final Map<String, WebSocketSession> sessions;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        log.info("New connection established");
        User user = (User) ((Authentication) Objects.requireNonNull(session.getPrincipal())).getPrincipal();
        log.info("User {} connected", user.getId());
        if (user.getId() == null) {
            session.close(CloseStatus.SERVER_ERROR.withReason("User must be authenticated"));
            return;
        }
        if (sessions.containsKey(user.getId())) {
            log.warn("User {} already has a session", user.getId());
            sessions.get(user.getId()).close(CloseStatus.SERVER_ERROR.withReason("Connected with another session ! " +
                    "Please logout from other devices and try again."));
        }

        sessions.put(user.getId(), session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, @NonNull CloseStatus status) {
        User user = (User) ((Authentication) Objects.requireNonNull(session.getPrincipal())).getPrincipal();
        assert user != null;
        sessions.remove(user.getId());
        log.info("User {} disconnected", user.getId());
    }

}