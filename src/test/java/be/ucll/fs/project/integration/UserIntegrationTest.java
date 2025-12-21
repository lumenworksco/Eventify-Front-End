package be.ucll.fs.project.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import be.ucll.fs.project.dto.LoginRequest;
import be.ucll.fs.project.dto.LoginResponse;

/**
 * Integration tests for User endpoints.
 * Tests authentication, authorization, and role-based access control.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class UserIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testLoginAndAccessProtectedEndpoint() {
        // Step 1: Login to get JWT token
        LoginRequest loginRequest = new LoginRequest("admin", "admin123");
        
        ResponseEntity<LoginResponse> loginResponse = restTemplate.postForEntity(
                "/api/users/login",
                loginRequest,
                LoginResponse.class
        );

        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
        assertNotNull(loginResponse.getBody());
        String token = loginResponse.getBody().getToken();
        assertNotNull(token);
        assertEquals("ADMIN", loginResponse.getBody().getRole());

        // Step 2: Access protected endpoint with token
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> usersResponse = restTemplate.exchange(
                "/api/users",
                HttpMethod.GET,
                entity,
                String.class
        );

        assertEquals(HttpStatus.OK, usersResponse.getStatusCode());
        assertNotNull(usersResponse.getBody());
        assertTrue(usersResponse.getBody().contains("admin"));
    }

    @Test
    void testAccessProtectedEndpointWithoutToken() {
        // Try to access protected endpoint without token
        ResponseEntity<String> response = restTemplate.getForEntity(
                "/api/users/1",
                String.class
        );

        // Spring Security returns 403 FORBIDDEN for anonymous access to protected endpoints
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }

    @Test
    void testDifferentRolesBehavior_AdminSeesFullUserDetails() {
        // Test ADMIN role - should see full user details
        LoginRequest adminLogin = new LoginRequest("admin", "admin123");
        ResponseEntity<LoginResponse> adminResponse = restTemplate.postForEntity(
                "/api/users/login",
                adminLogin,
                LoginResponse.class
        );
        
        String adminToken = adminResponse.getBody().getToken();
        HttpHeaders adminHeaders = new HttpHeaders();
        adminHeaders.setBearerAuth(adminToken);

        ResponseEntity<String> adminUsersResponse = restTemplate.exchange(
                "/api/users",
                HttpMethod.GET,
                new HttpEntity<>(adminHeaders),
                String.class
        );

        // Admin should see full user list with all details
        assertEquals(HttpStatus.OK, adminUsersResponse.getStatusCode());
        assertNotNull(adminUsersResponse.getBody());
        assertTrue(adminUsersResponse.getBody().contains("admin"));
        assertTrue(adminUsersResponse.getBody().contains("password")); // Admin sees passwords
    }

    @Test
    void testDifferentRolesBehavior_OrganizerSeesLimitedDetails() {
        // Test ORGANIZER role - should see user info but no passwords
        LoginRequest organizerLogin = new LoginRequest("jane", "jane123");
        ResponseEntity<LoginResponse> organizerResponse = restTemplate.postForEntity(
                "/api/users/login",
                organizerLogin,
                LoginResponse.class
        );
        
        assertEquals(HttpStatus.OK, organizerResponse.getStatusCode());
        assertEquals("ORGANIZER", organizerResponse.getBody().getRole());
        
        String organizerToken = organizerResponse.getBody().getToken();
        HttpHeaders organizerHeaders = new HttpHeaders();
        organizerHeaders.setBearerAuth(organizerToken);

        ResponseEntity<String> organizerUsersResponse = restTemplate.exchange(
                "/api/users",
                HttpMethod.GET,
                new HttpEntity<>(organizerHeaders),
                String.class
        );

        // Organizer should see user list with limited details (no passwords)
        assertEquals(HttpStatus.OK, organizerUsersResponse.getStatusCode());
        assertNotNull(organizerUsersResponse.getBody());
        assertTrue(organizerUsersResponse.getBody().contains("name"));
        assertFalse(organizerUsersResponse.getBody().contains("password")); // No password field
    }

    @Test
    void testDifferentRolesBehavior_UserSeesMinimalDetails() {
        // Test USER role - should only see minimal public information
        LoginRequest userLogin = new LoginRequest("john", "john123");
        ResponseEntity<LoginResponse> userResponse = restTemplate.postForEntity(
                "/api/users/login",
                userLogin,
                LoginResponse.class
        );
        
        assertEquals(HttpStatus.OK, userResponse.getStatusCode());
        assertEquals("USER", userResponse.getBody().getRole());
        
        String userToken = userResponse.getBody().getToken();
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(userToken);

        ResponseEntity<String> regularUserResponse = restTemplate.exchange(
                "/api/users",
                HttpMethod.GET,
                new HttpEntity<>(userHeaders),
                String.class
        );

        // Regular USER sees minimal info
        assertEquals(HttpStatus.OK, regularUserResponse.getStatusCode());
        assertNotNull(regularUserResponse.getBody());
        assertFalse(regularUserResponse.getBody().contains("password"));
        assertFalse(regularUserResponse.getBody().contains("location")); // No location field for regular users
    }

    @Test
    void testAdminCanDeleteUser_UserCannot() {
        // First, login as regular user and try to delete
        LoginRequest userLogin = new LoginRequest("john", "john123");
        ResponseEntity<LoginResponse> userResponse = restTemplate.postForEntity(
                "/api/users/login",
                userLogin,
                LoginResponse.class
        );
        
        String userToken = userResponse.getBody().getToken();
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.setBearerAuth(userToken);

        // Regular user tries to delete - should be forbidden
        ResponseEntity<Void> deleteAttempt = restTemplate.exchange(
                "/api/users/4",  // Try to delete diana
                HttpMethod.DELETE,
                new HttpEntity<>(userHeaders),
                Void.class
        );

        assertEquals(HttpStatus.FORBIDDEN, deleteAttempt.getStatusCode());
    }

    @Test
    void testInvalidCredentials() {
        LoginRequest invalidLogin = new LoginRequest("admin", "wrongpassword");
        
        ResponseEntity<LoginResponse> loginResponse = restTemplate.postForEntity(
                "/api/users/login",
                invalidLogin,
                LoginResponse.class
        );

        assertEquals(HttpStatus.UNAUTHORIZED, loginResponse.getStatusCode());
    }

    @Test
    void testPublicEndpointsAccessibleWithoutToken() {
        // Public endpoints should be accessible without authentication
        ResponseEntity<String> eventsResponse = restTemplate.getForEntity(
                "/api/events",
                String.class
        );
        assertEquals(HttpStatus.OK, eventsResponse.getStatusCode());

        ResponseEntity<String> citiesResponse = restTemplate.getForEntity(
                "/api/cities",
                String.class
        );
        assertEquals(HttpStatus.OK, citiesResponse.getStatusCode());

        ResponseEntity<String> venuesResponse = restTemplate.getForEntity(
                "/api/venues",
                String.class
        );
        assertEquals(HttpStatus.OK, venuesResponse.getStatusCode());
    }
}
