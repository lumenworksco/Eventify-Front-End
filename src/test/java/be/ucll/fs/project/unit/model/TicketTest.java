package be.ucll.fs.project.unit.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class TicketTest {

    private Validator validator;
    private User testUser;
    private Event testEvent;
    private City testCity;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        
        testCity = new City("Brussels", "Brussels-Capital", "Belgium");
        testUser = new User("John Doe", "hashedpass", Role.USER, "Downtown", "Music", testCity);
        testEvent = new Event("Rock Concert", LocalDate.of(2025, 12, 25), 
                             LocalTime.of(20, 0), LocalTime.of(23, 0));
    }

    @Test
    void testCreateValidTicket_HappyPath() {
        // Arrange & Act
        Ticket ticket = new Ticket(testUser, testEvent, 50.0);

        // Assert
        assertNotNull(ticket);
        assertEquals(testUser, ticket.getUser());
        assertEquals(testEvent, ticket.getEvent());
        assertEquals(50.0, ticket.getPrice());
        assertNotNull(ticket.getPurchaseDate());
        assertNull(ticket.getSeatNumber());
    }

    @Test
    void testCreateValidTicketWithSeatNumber_HappyPath() {
        // Arrange & Act
        Ticket ticket = new Ticket(testUser, testEvent, 75.0, "A15");

        // Assert
        assertNotNull(ticket);
        assertEquals(testUser, ticket.getUser());
        assertEquals(testEvent, ticket.getEvent());
        assertEquals(75.0, ticket.getPrice());
        assertEquals("A15", ticket.getSeatNumber());
        assertNotNull(ticket.getPurchaseDate());
    }

    @Test
    void testTicketGettersAndSetters_HappyPath() {
        // Arrange
        Ticket ticket = new Ticket();
        LocalDateTime purchaseDate = LocalDateTime.now();

        // Act
        ticket.setTicketId(1L);
        ticket.setUser(testUser);
        ticket.setEvent(testEvent);
        ticket.setPrice(100.0);
        ticket.setSeatNumber("B20");
        ticket.setPurchaseDate(purchaseDate);

        // Assert
        assertEquals(1L, ticket.getTicketId());
        assertEquals(testUser, ticket.getUser());
        assertEquals(testEvent, ticket.getEvent());
        assertEquals(100.0, ticket.getPrice());
        assertEquals("B20", ticket.getSeatNumber());
        assertEquals(purchaseDate, ticket.getPurchaseDate());
    }

    @Test
    void testTicketWithNullUser_UnhappyPath() {
        // Arrange
        Ticket ticket = new Ticket(null, testEvent, 50.0);

        // Act
        Set<ConstraintViolation<Ticket>> violations = validator.validate(ticket);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("User is required")));
    }

    @Test
    void testTicketWithNullEvent_UnhappyPath() {
        // Arrange
        Ticket ticket = new Ticket(testUser, null, 50.0);

        // Act
        Set<ConstraintViolation<Ticket>> violations = validator.validate(ticket);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Event is required")));
    }

    @Test
    void testTicketWithZeroPrice_UnhappyPath() {
        // Arrange
        Ticket ticket = new Ticket();
        ticket.setUser(testUser);
        ticket.setEvent(testEvent);
        ticket.setPrice(0.0);

        // Act
        Set<ConstraintViolation<Ticket>> violations = validator.validate(ticket);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Price must be positive")));
    }

    @Test
    void testTicketWithNegativePrice_UnhappyPath() {
        // Arrange
        Ticket ticket = new Ticket();
        ticket.setUser(testUser);
        ticket.setEvent(testEvent);
        ticket.setPrice(-10.0);

        // Act
        Set<ConstraintViolation<Ticket>> violations = validator.validate(ticket);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Price must be positive")));
    }

    @Test
    void testTicketWithNullPurchaseDate_UnhappyPath() {
        // Arrange
        Ticket ticket = new Ticket();
        ticket.setUser(testUser);
        ticket.setEvent(testEvent);
        ticket.setPrice(50.0);
        ticket.setPurchaseDate(null);

        // Act
        Set<ConstraintViolation<Ticket>> violations = validator.validate(ticket);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Purchase date is required")));
    }

    @Test
    void testTicketWithNullSeatNumber_HappyPath() {
        // Arrange
        Ticket ticket = new Ticket(testUser, testEvent, 50.0, null);

        // Act
        Set<ConstraintViolation<Ticket>> violations = validator.validate(ticket);

        // Assert - Seat number is optional, so no violations expected
        assertTrue(violations.isEmpty());
        assertNull(ticket.getSeatNumber());
    }

    @Test
    void testTicketPurchaseDateAutoSet_HappyPath() {
        // Arrange
        LocalDateTime beforeCreation = LocalDateTime.now().minusSeconds(1);
        
        // Act
        Ticket ticket = new Ticket(testUser, testEvent, 50.0);
        
        LocalDateTime afterCreation = LocalDateTime.now().plusSeconds(1);

        // Assert
        assertNotNull(ticket.getPurchaseDate());
        assertTrue(ticket.getPurchaseDate().isAfter(beforeCreation));
        assertTrue(ticket.getPurchaseDate().isBefore(afterCreation));
    }

    @Test
    void testTicketWithMinimalPrice_HappyPath() {
        // Arrange
        Ticket ticket = new Ticket(testUser, testEvent, 0.01);

        // Act
        Set<ConstraintViolation<Ticket>> violations = validator.validate(ticket);

        // Assert
        assertTrue(violations.isEmpty());
        assertEquals(0.01, ticket.getPrice());
    }

    @Test
    void testTicketWithLargePrice_HappyPath() {
        // Arrange
        Ticket ticket = new Ticket(testUser, testEvent, 9999.99);

        // Act
        Set<ConstraintViolation<Ticket>> violations = validator.validate(ticket);

        // Assert
        assertTrue(violations.isEmpty());
        assertEquals(9999.99, ticket.getPrice());
    }
}
