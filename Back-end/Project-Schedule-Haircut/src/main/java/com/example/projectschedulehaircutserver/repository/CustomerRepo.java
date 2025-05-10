package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.response.CustomerManagementResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface CustomerRepo extends JpaRepository<Customer, Integer> {
    Optional<Customer> findCustomerByAccount_UserName(String account_username);

//    @Query("select c from Customer c where c.userName = :username")
//    Optional<Customer> findCustomerByUsername(@Param("username") String username);

    @Query("select c from Customer c where c.id = :id")
    Optional<Customer> findByCustomerId(@Param("id") Integer id);

    @Query("select c from Customer c where c.phone = :phone")
    Optional<Customer> findCustomerByPhone(@Param("phone") String phone);

    @Query("select c from Customer c where c.email = :email")
    Optional<Customer> findCustomerByEmail(@Param("email") String email);

    @Query("select c from Customer c where c.userName = :username")
    Optional<Customer> findByCustomerUsername(@Param("username") String username);

    @Query("SELECT new com.example.projectschedulehaircutserver.response.CustomerManagementResponse(" +
            "c.id, " +
            "a.fullName, " +
            "a.phone, " +
            "a.email, " +
            "c.isBlocked, " +
            "COUNT(o.id)) " +
            "FROM Account a " +
            "JOIN Customer c ON a.id = c.account.id " +
            "LEFT JOIN Orders o ON o.customer.id = c.id " +
            "GROUP BY c.id, a.fullName, a.phone, a.email, c.isBlocked " +
            "ORDER BY c.id ASC")
    Set<CustomerManagementResponse> getAccountManagement();
}
