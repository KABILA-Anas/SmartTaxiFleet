package org.ilisi.taxifleet.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterUserDto(
        @Email
        @NotBlank(message = "Email is mandatory")
        String email,

        @NotBlank(message = "Password is mandatory")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password,

        @NotBlank(message = "First name is mandatory")
        String firstName,

        @NotBlank(message = "Last name is mandatory")
        String lastName,

        @NotBlank(message = "Phone number is mandatory")
//        @Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Phone number is invalid")
        String phone,

        @NotBlank(message = "CIN is mandatory")
        @Pattern(regexp = "^[A-Z]{1,2}\\d{6}$", message = "CIN is invalid")
        String cin) {
}