package com.example.projectschedulehaircutserver.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServiceDTO {
    private Integer id;
    private String name;
    private BigDecimal price;
    private Integer haircutTime;

    public ServiceDTO(Integer id, String name, BigDecimal price, Integer haircutTime) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.haircutTime = haircutTime;
    }
}
