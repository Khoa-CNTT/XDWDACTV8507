package com.example.projectschedulehaircutserver.service.customer;

import com.example.projectschedulehaircutserver.dto.CustomerDTO;
import com.example.projectschedulehaircutserver.entity.Account;
import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.entity.Role;
import com.example.projectschedulehaircutserver.repository.AccountRepo;
import com.example.projectschedulehaircutserver.repository.CustomerRepo;
import com.example.projectschedulehaircutserver.repository.RoleRepo;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomerServiceImpl implements CustomerService{
    private CustomerRepo customerRepo;
    private AccountRepo accountRepo;
    private RoleRepo roleRepo;
    private PasswordEncoder encoder;
    @Override
    public void createCustomer(CustomerDTO customerDTO) {
        try {
            Role role = roleRepo.findById(2).orElseThrow(() -> new RuntimeException("No roles specified."));

            Account account = Account.builder()
                    .fullName(customerDTO.getFullName())
                    .userName(customerDTO.getUserName())
                    .password(encoder.encode(customerDTO.getPassword()))
                    .age(customerDTO.getAge())
                    .address(customerDTO.getAddress())
                    .role(role)
                    .phone(customerDTO.getPhone())
                    .build();

            Account savedAccount = accountRepo.save(account);

            Customer customer = new Customer();
                customer.setFullName(customerDTO.getFullName());
                customer.setUserName(customerDTO.getUserName());
                customer.setPassword(encoder.encode(customerDTO.getPassword()));
                customer.setRole(role);
                customer.setAge(customerDTO.getAge());
                customer.setAddress(customerDTO.getAddress());
                customer.setPhone(customerDTO.getPhone());
                customer.setIsBlocked(false);
                customer.setAccount(savedAccount);

                customerRepo.save(customer);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
