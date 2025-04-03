package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.exeption.RefreshTokenException;
import com.example.projectschedulehaircutserver.request.RefreshTokenRequest;
import com.example.projectschedulehaircutserver.response.AuthenticationResponse;
import com.example.projectschedulehaircutserver.service.authentication.AuthenticationService;
import com.example.projectschedulehaircutserver.utils.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/web")
@CrossOrigin
@RequiredArgsConstructor
public class RefreshTokenController {
    private final AuthenticationService authenticationService;
    private final CookieUtil cookieUtil;

    @GetMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest servletRequest, HttpServletResponse response) {
        try {
            Cookie[] cookies = servletRequest.getCookies();
            if (cookies == null) {
                throw new RefreshTokenException("Cookies are null");
            }

            String refreshToken = null;
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                }
            }

            if (refreshToken != null && !refreshToken.isEmpty()) {
                var refreshTokenRequest = RefreshTokenRequest.builder()
                        .refreshToken(refreshToken)
                        .build();
                AuthenticationResponse authenticationResponse = authenticationService.refreshToken(refreshTokenRequest);
                cookieUtil.saveAccessTokenCookie(response, authenticationResponse);
                return ResponseEntity.status(200).body(authenticationResponse);
            } else {
                throw new RefreshTokenException("Refresh token is empty or null");
            }
        } catch (RefreshTokenException e) {
//            var authenticationResponse = AuthenticationResponse.builder()
//                    .token(null)
//                    .refreshToken(null)
//                    .build();
//            cookieUtil.generatorTokenCookie(response, authenticationResponse);
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
