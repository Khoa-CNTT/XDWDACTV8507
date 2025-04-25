package com.example.projectschedulehaircutserver.controller.customer;

import com.example.projectschedulehaircutserver.service.vnpay.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/customer/payment")
@AllArgsConstructor
public class VnPayController {
    private VnPayService vnPayService;

    // Tạo link thanh toán
    @GetMapping("/create-payment")
    public Map<String, String> createPayment(
            HttpServletRequest request,
            @RequestParam int amount,
            @RequestParam String orderInfo
    ) {
        String paymentUrl = vnPayService.createOrder(request, amount, orderInfo);

        Map<String, String> response = new HashMap<>();
        response.put("code", "00");
        response.put("message", "Tạo liên kết thanh toán thành công");
        response.put("data", paymentUrl);


        return response;
    }


    // Xử lý callback từ VNPay
    @GetMapping("/payment-return")
    public void paymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Gọi service để xử lý và chuyển hướng
        vnPayService.orderReturn(request, response);
    }
}
