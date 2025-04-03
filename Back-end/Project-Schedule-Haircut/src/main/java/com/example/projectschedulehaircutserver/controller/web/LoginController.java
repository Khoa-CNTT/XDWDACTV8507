package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.exeption.RefreshTokenException;
import com.example.projectschedulehaircutserver.request.LoginRequest;
import com.example.projectschedulehaircutserver.request.RefreshTokenRequest;
import com.example.projectschedulehaircutserver.response.AuthenticationResponse;
import com.example.projectschedulehaircutserver.service.authentication.AuthenticationService;
import com.example.projectschedulehaircutserver.utils.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/web")
@CrossOrigin
@RequiredArgsConstructor
public class LoginController {
    private final AuthenticationService authenticationService;
    private final CookieUtil cookieUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest UserLoginRequest, HttpServletResponse response){
        try {
            AuthenticationResponse authResponse = authenticationService.authenticate(UserLoginRequest);

            // Kiểm tra response hợp lệ trước khi tạo cookie
            if (authResponse == null || authResponse.getToken() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authentication failed: Invalid credentials");
            }

            cookieUtil.generatorTokenCookie(response, authResponse);
            return ResponseEntity.ok(authResponse);

        } catch (LoginException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Authentication failed: " + e.getMessage());
        }
    }
}
