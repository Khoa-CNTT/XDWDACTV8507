package com.example.projectschedulehaircutserver.service.authentication;

import com.example.projectschedulehaircutserver.entity.Account;
import com.example.projectschedulehaircutserver.entity.Cart;
import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.entity.Role;
import com.example.projectschedulehaircutserver.exeption.*;
import com.example.projectschedulehaircutserver.repository.*;
import com.example.projectschedulehaircutserver.request.LoginRequest;
import com.example.projectschedulehaircutserver.request.RefreshTokenRequest;
import com.example.projectschedulehaircutserver.request.RegisterRequest;
import com.example.projectschedulehaircutserver.response.AuthenticationResponse;
import com.example.projectschedulehaircutserver.service.email.EmailService;
import com.example.projectschedulehaircutserver.service.jwt.JwtService;
import com.example.projectschedulehaircutserver.service.redis.RedisService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService{
    private final CustomerRepo customerRepo;
    private final CartRepo cartRepo;
    private final PasswordEncoder encoder;
    private final RoleRepo roleRepo;
    private final AccountRepo accountRepo;
    private final EmployeeRepo employeeRepo;
    private final ManagerRepo managerRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final RedisService redisService;
    private final EmailService emailService;


    @Override
    public String registerUser(RegisterRequest request) throws RegisterException {
            Role role = roleRepo.findById(2).orElseThrow(() -> new RuntimeException("No roles specified."));
            if (request.getUserName() != null){
                var customer = customerRepo.findCustomerByAccount_UserName(request.getUserName());
                if (customer.isPresent()){
                    throw new RegisterException("UserName Đã Được Sử Dụng");
                }
            }

            if(request.getPhone() != null){
                var customer = customerRepo.findCustomerByPhone(request.getPhone());
                if (customer.isPresent()){
                    throw new RegisterException("Số Điện Thoại Đã Được Sử Dụng");
                }
            }

            Account account = Account.builder()
                    .fullName(request.getFullName())
                    .userName(request.getUserName())
                    .email(request.getEmail())
                    .password(encoder.encode(request.getPassword()))
                    .age(request.getAge())
                    .address(request.getAddress())
                    .role(role)
                    .phone(request.getPhone())
                    .build();

            Account savedAccount = accountRepo.save(account);

            Customer customer = new Customer();
            customer.setFullName(request.getFullName());
            customer.setUserName(request.getUserName());
            customer.setEmail(request.getEmail());
            customer.setPassword(encoder.encode(request.getPassword()));
            customer.setRole(role);
            customer.setAge(request.getAge());
            customer.setAddress(request.getAddress());
            customer.setPhone(request.getPhone());
            customer.setIsBlocked(false);
            customer.setAccount(savedAccount);

            Cart cart = Cart.builder()
                    .customer(customer)
                    .build();

            try {
                customerRepo.save(customer);
                cartRepo.save(cart);
                return "Đăng Kí Thành Công";
            } catch (Exception e){
                throw new RegisterException(e.getMessage());
            }

    }

    @Override
    public AuthenticationResponse authenticate(LoginRequest request) throws LoginException {
        try {
            // Xác thực
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUserName(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Lấy thông tin user
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Tạo tokens
            String accessToken = jwtService.generateAccessToken(userDetails);
            String refreshToken = jwtService.generateAndSaveRefreshToken(userDetails);

            // Lấy role
            String role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(", "));

            return AuthenticationResponse.builder()
                    .token(accessToken)
                    .refreshToken(refreshToken)
                    .username(userDetails.getUsername())
                    .role(role)
                    .build();

        } catch (Exception e) {
            throw new LoginException("Đăng nhập thất bại: " + e.getMessage());
        }
    }

    @Override
    public AuthenticationResponse refreshToken(RefreshTokenRequest request) throws RefreshTokenException {
        try {
            // Kiểm tra và tạo token mới
            String newAccessToken = jwtService.generateNewAccessTokenFromRefreshToken(request.getRefreshToken());

            // Lấy thông tin user từ token
            String username = jwtService.extractUsername(request.getRefreshToken());
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Lấy role
            String role = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(", "));

            return AuthenticationResponse.builder()
                    .token(newAccessToken)
                    .refreshToken(request.getRefreshToken())
                    .username(username)
                    .role(role)
                    .build();

        } catch (Exception e) {
            throw new RefreshTokenException("Làm mới token thất bại: " + e.getMessage());
        }
    }

    @Override
    public String requestChangePassword(String email) throws CustomerException {
        Optional<Customer> customerOtp = customerRepo.findCustomerByEmail(email);
        if (customerOtp.isEmpty()) throw new CustomerException("Email không tồn tại");

        String code = UUID.randomUUID().toString().substring(0, 6);

        redisService.saveOTP(email, code, 10); // TTL = 10 phút

        emailService.send(email, "Mã xác thực đổi mật khẩu: <b>" + code + "</b>");
        return "Mã xác thực đã gửi qua email.";
    }

    @Override
    public String changePassword(String email, String code, String newPassword) throws CustomerException {
        String savedCode = redisService.getOTP(email);

        if (savedCode == null) throw new CustomerException("Mã xác thực hết hạn hoặc không tồn tại");
        if (!savedCode.equals(code)) throw new CustomerException("Mã xác thực không đúng");

        Customer customer = customerRepo.findCustomerByEmail(email).orElseThrow();
        customer.setPassword(encoder.encode(newPassword));
        customerRepo.save(customer);

        redisService.deleteOTP(email);

        return "Đổi mật khẩu thành công";
    }


}
