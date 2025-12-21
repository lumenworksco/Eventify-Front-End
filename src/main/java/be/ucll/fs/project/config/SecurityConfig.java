package be.ucll.fs.project.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import be.ucll.fs.project.filter.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - Read operations
                .requestMatchers(HttpMethod.GET, "/api/cities/**", "/api/venues/**", "/api/events/**").permitAll()
                
                // Event management - ADMIN and ORGANIZER can create/update/delete events
                .requestMatchers(HttpMethod.POST, "/api/events/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/events/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/events/**").authenticated()
                
                // Venue management - ADMIN and ORGANIZER can create/update/delete venues
                .requestMatchers(HttpMethod.POST, "/api/venues/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/venues/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/venues/**").authenticated()
                
                // Ticket operations - purchase requires authentication
                .requestMatchers("/api/tickets/purchase").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/tickets/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/tickets/**").authenticated()
                
                // User management - login/register public, other operations protected
                .requestMatchers("/api/users/login", "/api/users/register", "/api/users/logout").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/users").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").authenticated()
                
                // Swagger documentation
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
