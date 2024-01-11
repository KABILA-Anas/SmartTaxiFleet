package org.ilisi.taxifleet.auth.repository;

import org.ilisi.taxifleet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository is an interface that extends JpaRepository and UserDetailsService.
 * It provides CRUD operations and user details services for User entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String>, UserDetailsService {

    /**
     * Finds a User entity by its email.
     *
     * @param email the email of the User entity to retrieve.
     * @return an Optional that may contain the User entity if found.
     */
    Optional<User> findByEmail(String email);

    /**
     * Loads the user details by the username (in this case, the email).
     *
     * @param username the username of the user to load.
     * @return a UserDetails instance containing the details of the loaded user.
     * @throws UsernameNotFoundException if no user is found with the provided username.
     */
    @Override
    default UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("User with email=%s was not found",
                        username)));
    }
}