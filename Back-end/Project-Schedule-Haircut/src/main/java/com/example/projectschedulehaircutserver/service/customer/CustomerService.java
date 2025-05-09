package com.example.projectschedulehaircutserver.service.customer;

import com.example.projectschedulehaircutserver.dto.CustomerDTO;
import com.example.projectschedulehaircutserver.exeption.CustomerException;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.response.CustomerManagementResponse;

import java.util.Set;

public interface CustomerService {
    void createCustomer(CustomerDTO customerDTO);

    CustomerDTO getInformationCustomer(String username) throws CustomerException;

    String updateProfileCustomer(CustomerDTO customerDTO) throws LoginException;

    Set<CustomerManagementResponse> getAccountManagement() throws CustomerException;
}