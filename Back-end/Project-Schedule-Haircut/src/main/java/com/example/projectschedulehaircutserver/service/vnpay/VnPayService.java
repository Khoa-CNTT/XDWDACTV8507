package com.example.projectschedulehaircutserver.service.vnpay;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface VnPayService {
    String createOrder(HttpServletRequest request, int amount, String orderInfo);

    void orderReturn(HttpServletRequest request, HttpServletResponse response) throws IOException;
}
