package be.ucll.fs.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.fs.project.dto.LoginRequest;
import be.ucll.fs.project.dto.LoginResponse;
import be.ucll.fs.project.dto.UserDTO;
import be.ucll.fs.project.service.UserService;
import be.ucll.fs.project.unit.model.City;
import be.ucll.fs.project.unit.model.Role;
import be.ucll.fs.project.unit.model.User;
import be.ucll.fs.project.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "Endpoints for user authentication and management")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Operation(summary = "Login user", description = "Authenticate a user and return a JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        User user = userService.getUserByName(loginRequest.getName());
        
        if (!userService.verifyPassword(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String token = jwtUtil.generateToken(user.getName(), user.getUserId(), user.getRole().name());
        LoginResponse response = new LoginResponse(token, user.getUserId(), user.getName(), user.getRole().name());
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Register new user", description = "Create a new user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "409", description = "Username already exists")
    })
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody UserDTO userDTO) {
        // Check if username already exists
        try {
            userService.getUserByName(userDTO.getName());
            // If we get here, user exists
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        } catch (Exception e) {
            // User doesn't exist, proceed with registration
        }
        
        // Create new user with default role USER
        City city = new City();
        city.setCityId(userDTO.getCityId() != null ? userDTO.getCityId() : 1L); // Default to city 1 if not provided
        User user = new User(userDTO.getName(), userDTO.getPassword(), 
                            Role.USER, 
                            userDTO.getLocation(), userDTO.getEventPreference(), city);
        User createdUser = userService.createUser(user);
        
        // Generate token and return login response
        String token = jwtUtil.generateToken(createdUser.getName(), createdUser.getUserId(), createdUser.getRole().name());
        LoginResponse response = new LoginResponse(token, createdUser.getUserId(), createdUser.getName(), createdUser.getRole().name());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Get all users", 
               description = "Returns all users. ADMIN sees full details including passwords, ORGANIZER sees user info without passwords, USER sees only basic info")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping
    public ResponseEntity<?> getAllUsers(HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        List<User> users = userService.getAllUsers();
        
        // ADMIN sees all user details including passwords (for admin purposes)
        if ("ADMIN".equals(role)) {
            return ResponseEntity.ok(users);
        }
        
        // ORGANIZER sees user details without passwords
        if ("ORGANIZER".equals(role)) {
            var organizerView = users.stream()
                .map(u -> java.util.Map.of(
                    "userId", u.getUserId(),
                    "name", u.getName(),
                    "location", u.getLocation() != null ? u.getLocation() : "",
                    "eventPreference", u.getEventPreference() != null ? u.getEventPreference() : "",
                    "role", u.getRole().name(),
                    "cityId", u.getCity() != null ? u.getCity().getCityId() : null
                ))
                .toList();
            return ResponseEntity.ok(organizerView);
        }
        
        // Regular USER sees only limited public information
        var limitedUsers = users.stream()
            .map(u -> java.util.Map.of(
                "userId", u.getUserId(),
                "name", u.getName(),
                "eventPreference", u.getEventPreference() != null ? u.getEventPreference() : ""
            ))
            .toList();
        
        return ResponseEntity.ok(limitedUsers);
    }

    @Operation(summary = "Get user by ID", description = "Returns a specific user by their ID")
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable @Parameter(description = "User ID") Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Operation(summary = "Get user by name", description = "Returns a specific user by their username")
    @GetMapping("/name/{name}")
    public ResponseEntity<User> getUserByName(@PathVariable @Parameter(description = "Username") String name) {
        return ResponseEntity.ok(userService.getUserByName(name));
    }

    @Operation(summary = "Get users by city", description = "Returns all users in a specific city")
    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<User>> getUsersByCity(@PathVariable @Parameter(description = "City ID") Long cityId) {
        return ResponseEntity.ok(userService.getUsersByCity(cityId));
    }

    @Operation(summary = "Get users by event preference", description = "Returns all users with a specific event preference")
    @GetMapping("/preference/{eventPreference}")
    public ResponseEntity<List<User>> getUsersByEventPreference(
            @PathVariable @Parameter(description = "Event preference") String eventPreference) {
        return ResponseEntity.ok(userService.getUsersByEventPreference(eventPreference));
    }

    @Operation(summary = "Get users by location", description = "Returns all users in a specific location")
    @GetMapping("/location/{location}")
    public ResponseEntity<List<User>> getUsersByLocation(@PathVariable @Parameter(description = "Location") String location) {
        return ResponseEntity.ok(userService.getUsersByLocation(location));
    }

    @Operation(summary = "Create new user", description = "Create a new user (admin only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDTO userDTO) {
        City city = new City();
        city.setCityId(userDTO.getCityId());
        Role role = userDTO.getRole() != null ? userDTO.getRole() : Role.USER;
        User user = new User(userDTO.getName(), userDTO.getPassword(), 
                            role, 
                            userDTO.getLocation(), userDTO.getEventPreference(), city);
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @Operation(summary = "Update user", description = "Update an existing user")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable @Parameter(description = "User ID") Long id, 
                                          @Valid @RequestBody UserDTO userDTO) {
        City city = new City();
        city.setCityId(userDTO.getCityId());
        Role role = userDTO.getRole() != null ? userDTO.getRole() : Role.USER;
        User user = new User(userDTO.getName(), userDTO.getPassword(), 
                            role, 
                            userDTO.getLocation(), userDTO.getEventPreference(), city);
        // Handle preferred city
        if (userDTO.getPreferredCityId() != null) {
            City preferredCity = new City();
            preferredCity.setCityId(userDTO.getPreferredCityId());
            user.setPreferredCity(preferredCity);
        }
        User updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Set preferred city", description = "Set the user's preferred city for personalized event recommendations")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Preferred city updated successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - can only update your own preference"),
        @ApiResponse(responseCode = "404", description = "User or city not found")
    })
    @PutMapping("/{id}/preferred-city")
    public ResponseEntity<User> setPreferredCity(
            @PathVariable @Parameter(description = "User ID") Long id,
            @RequestBody java.util.Map<String, Long> body,
            HttpServletRequest request) {
        Long authenticatedUserId = (Long) request.getAttribute("userId");
        
        // Users can only update their own preferred city
        if (!id.equals(authenticatedUserId)) {
            String role = (String) request.getAttribute("userRole");
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        
        Long cityId = body.get("cityId");
        User updatedUser = userService.setPreferredCity(id, cityId);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Logout user", description = "Logout the current user (token should be invalidated client-side)")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // For JWT-based authentication, the token invalidation is handled client-side
        // This endpoint confirms the logout request was received
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete user", description = "Delete a user (admin only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "User deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - Admin only"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable @Parameter(description = "User ID") Long id, 
                                          HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        // Only ADMIN can delete users
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
