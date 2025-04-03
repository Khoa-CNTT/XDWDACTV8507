package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.exeption.LogoutException;
import com.example.projectschedulehaircutserver.response.AuthenticationResponse;
import com.example.projectschedulehaircutserver.service.authentication.AuthenticationService;
import com.example.projectschedulehaircutserver.service.jwt.JwtService;
import com.example.projectschedulehaircutserver.utils.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/web")
@CrossOrigin
@RequiredArgsConstructor
public class LogoutController {
    private final JwtService jwtService;
    private final CookieUtil cookieUtil;

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            String refreshToken = getRefreshTokenFromCookies(request);

            if (refreshToken != null) {
                jwtService.revokeRefreshToken(refreshToken);
            }

            cookieUtil.removeCookies(response);

            return ResponseEntity.ok("Đăng xuất thành công");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Lỗi khi đăng xuất: " + e.getMessage());
        }
    }

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
