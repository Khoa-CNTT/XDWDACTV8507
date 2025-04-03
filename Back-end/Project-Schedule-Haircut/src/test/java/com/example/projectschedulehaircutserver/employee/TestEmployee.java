package com.example.projectschedulehaircutserver.employee;

import com.example.projectschedulehaircutserver.dto.EmployeeDTO;
import com.example.projectschedulehaircutserver.service.employee.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestEmployee {
    @Autowired
    private EmployeeService employeeService;

    @Test
    void create(){
//        EmployeeDTO employeeDTO = new EmployeeDTO("tuanvy14042k3", "12345", "Nguyễn Viên Tuấn Vỹ",21, "Điện Bàn, Quảng Name", "0327443333", "avatar1");
        EmployeeDTO employeeDTO = new EmployeeDTO("phapngu", "12345", "Nguyễn Văn Pháp",21, "Điện Bàn, Quảng Name", "0905045678", "avatar2");
        employeeService.createEmployee(employeeDTO);
    }
}
