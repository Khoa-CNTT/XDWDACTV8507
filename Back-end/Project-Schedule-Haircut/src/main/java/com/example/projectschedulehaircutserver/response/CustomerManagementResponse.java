package com.example.projectschedulehaircutserver.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomerManagementResponse {
    private Integer id;
    private String fullName;
    private String phone;
    private String email;
    private Boolean isBlocked;
    private Long bookings;
}
