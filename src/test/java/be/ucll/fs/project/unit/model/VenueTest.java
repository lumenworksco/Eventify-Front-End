package be.ucll.fs.project.unit.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class VenueTest {

    private Validator validator;
    private City testCity;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        testCity = new City("Brussels", "Brussels-Capital", "Belgium");
    }

    @Test
    void testCreateValidVenue_HappyPath() {
        // Arrange & Act
        Venue venue = new Venue("Concert Hall", "Main Street 100", 5000, testCity);

        // Assert
        assertNotNull(venue);
        assertEquals("Concert Hall", venue.getName());
        assertEquals("Main Street 100", venue.getAddress());
        assertEquals(5000, venue.getCapacity());
        assertEquals(testCity, venue.getCity());
    }

    @Test
    void testVenueGettersAndSetters_HappyPath() {
        // Arrange
        Venue venue = new Venue();
        City newCity = new City("Antwerp", "Flanders", "Belgium");

        // Act
        venue.setVenueId(1L);
        venue.setName("Stadium");
        venue.setAddress("Stadium Road 1");
        venue.setCapacity(50000);
        venue.setCity(newCity);

        // Assert
        assertEquals(1L, venue.getVenueId());
        assertEquals("Stadium", venue.getName());
        assertEquals("Stadium Road 1", venue.getAddress());
        assertEquals(50000, venue.getCapacity());
        assertEquals(newCity, venue.getCity());
    }

    @Test
    void testVenueWithBlankName_UnhappyPath() {
        // Arrange
        Venue venue = new Venue("", "Address", 1000, testCity);

        // Act
        Set<ConstraintViolation<Venue>> violations = validator.validate(venue);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Venue name is required")));
    }

    @Test
    void testVenueWithNullName_UnhappyPath() {
        // Arrange
        Venue venue = new Venue(null, "Address", 1000, testCity);

        // Act
        Set<ConstraintViolation<Venue>> violations = validator.validate(venue);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Venue name is required")));
    }

    @Test
    void testVenueWithNullCity_UnhappyPath() {
        // Arrange
        Venue venue = new Venue("Concert Hall", "Address", 1000, null);

        // Act
        Set<ConstraintViolation<Venue>> violations = validator.validate(venue);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("City is required")));
    }

    @Test
    void testVenueWithZeroCapacity_UnhappyPath() {
        // Arrange
        Venue venue = new Venue("Arena", "Address", 0, testCity);

        // Act
        Set<ConstraintViolation<Venue>> violations = validator.validate(venue);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Capacity must be greater than 0")));
    }

    @Test
    void testVenueWithNegativeCapacity_UnhappyPath() {
        // Arrange
        Venue venue = new Venue("Theater", "Address", -100, testCity);

        // Act
        Set<ConstraintViolation<Venue>> violations = validator.validate(venue);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Capacity must be greater than 0")));
    }

    @Test
    void testVenueWithNullAddress_HappyPath() {
        // Arrange
        Venue venue = new Venue("Music Hall", null, 2000, testCity);

        // Act
        Set<ConstraintViolation<Venue>> violations = validator.validate(venue);

        // Assert - Address is optional, so no violations expected
        assertTrue(violations.isEmpty());
        assertNull(venue.getAddress());
    }

    @Test
    void testVenueWithNullCapacity_HappyPath() {
        // Arrange
        Venue venue = new Venue("Open Air Venue", "Park Street", null, testCity);

        // Act
        Set<ConstraintViolation<Venue>> violations = validator.validate(venue);

        // Assert - Capacity is optional, so no violations expected
        assertTrue(violations.isEmpty());
        assertNull(venue.getCapacity());
    }

    @Test
    void testVenueEventsCollection_HappyPath() {
        // Arrange
        Venue venue = new Venue("Festival Grounds", "Festival Ave", 10000, testCity);

        // Assert - Events collection should be initialized
        assertNotNull(venue.getEvents());
        assertTrue(venue.getEvents().isEmpty());
    }

    @Test
    void testVenueWithMinimumCapacity_HappyPath() {
        // Arrange
        Venue venue = new Venue("Small Venue", "Side Street 5", 1, testCity);

        // Act
        Set<ConstraintViolation<Venue>> violations = validator.validate(venue);

        // Assert
        assertTrue(violations.isEmpty());
        assertEquals(1, venue.getCapacity());
    }

    @Test
    void testVenueWithLargeCapacity_HappyPath() {
        // Arrange
        Venue venue = new Venue("Mega Stadium", "Stadium Blvd", 100000, testCity);

        // Act
        Set<ConstraintViolation<Venue>> violations = validator.validate(venue);

        // Assert
        assertTrue(violations.isEmpty());
        assertEquals(100000, venue.getCapacity());
    }
}
