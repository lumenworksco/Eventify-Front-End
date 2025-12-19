package be.ucll.fs.project.unit.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class EventDescriptionTest {

    private Validator validator;
    private Event testEvent;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        testEvent = new Event("Rock Concert", LocalDate.of(2025, 12, 25), 
                             LocalTime.of(20, 0), LocalTime.of(23, 0));
    }

    @Test
    void testCreateValidEventDescription_HappyPath() {
        // Arrange & Act
        EventDescription description = new EventDescription(
            testEvent, 
            "Concert", 
            "The Rolling Stones", 
            "http://tickets.example.com", 
            "Amazing rock concert with special effects"
        );

        // Assert
        assertNotNull(description);
        assertEquals(testEvent, description.getEvent());
        assertEquals("Concert", description.getEventType());
        assertEquals("The Rolling Stones", description.getFeaturedArtists());
        assertEquals("http://tickets.example.com", description.getTicketPurchaseLink());
        assertEquals("Amazing rock concert with special effects", description.getExtraDescription());
    }

    @Test
    void testEventDescriptionGettersAndSetters_HappyPath() {
        // Arrange
        EventDescription description = new EventDescription();
        Event newEvent = new Event("Jazz Night", LocalDate.of(2026, 1, 15), 
                                   LocalTime.of(19, 0), LocalTime.of(22, 0));

        // Act
        description.setDescriptionId(1L);
        description.setEvent(newEvent);
        description.setEventType("Jazz Concert");
        description.setFeaturedArtists("Miles Davis Tribute Band");
        description.setTicketPurchaseLink("http://jazz-tickets.com");
        description.setExtraDescription("Smooth jazz evening with dinner option");

        // Assert
        assertEquals(1L, description.getDescriptionId());
        assertEquals(newEvent, description.getEvent());
        assertEquals("Jazz Concert", description.getEventType());
        assertEquals("Miles Davis Tribute Band", description.getFeaturedArtists());
        assertEquals("http://jazz-tickets.com", description.getTicketPurchaseLink());
        assertEquals("Smooth jazz evening with dinner option", description.getExtraDescription());
    }

    @Test
    void testEventDescriptionWithNullEvent_UnhappyPath() {
        // Arrange
        EventDescription description = new EventDescription(
            null, 
            "Concert", 
            "Artist", 
            "http://tickets.com", 
            "Description"
        );

        // Act
        Set<ConstraintViolation<EventDescription>> violations = validator.validate(description);

        // Assert
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Event is required")));
    }

    @Test
    void testEventDescriptionWithNullEventType_HappyPath() {
        // Arrange
        EventDescription description = new EventDescription(
            testEvent, 
            null, 
            "Artist", 
            "http://tickets.com", 
            "Description"
        );

        // Act
        Set<ConstraintViolation<EventDescription>> violations = validator.validate(description);

        // Assert - EventType is optional, so no violations expected
        assertTrue(violations.isEmpty());
        assertNull(description.getEventType());
    }

    @Test
    void testEventDescriptionWithNullFeaturedArtists_HappyPath() {
        // Arrange
        EventDescription description = new EventDescription(
            testEvent, 
            "Concert", 
            null, 
            "http://tickets.com", 
            "Description"
        );

        // Act
        Set<ConstraintViolation<EventDescription>> violations = validator.validate(description);

        // Assert - FeaturedArtists is optional, so no violations expected
        assertTrue(violations.isEmpty());
        assertNull(description.getFeaturedArtists());
    }

    @Test
    void testEventDescriptionWithNullTicketLink_HappyPath() {
        // Arrange
        EventDescription description = new EventDescription(
            testEvent, 
            "Concert", 
            "Artist", 
            null, 
            "Description"
        );

        // Act
        Set<ConstraintViolation<EventDescription>> violations = validator.validate(description);

        // Assert - TicketPurchaseLink is optional, so no violations expected
        assertTrue(violations.isEmpty());
        assertNull(description.getTicketPurchaseLink());
    }

    @Test
    void testEventDescriptionWithNullExtraDescription_HappyPath() {
        // Arrange
        EventDescription description = new EventDescription(
            testEvent, 
            "Concert", 
            "Artist", 
            "http://tickets.com", 
            null
        );

        // Act
        Set<ConstraintViolation<EventDescription>> violations = validator.validate(description);

        // Assert - ExtraDescription is optional, so no violations expected
        assertTrue(violations.isEmpty());
        assertNull(description.getExtraDescription());
    }

    @Test
    void testEventDescriptionWithAllOptionalFieldsNull_HappyPath() {
        // Arrange
        EventDescription description = new EventDescription(testEvent, null, null, null, null);

        // Act
        Set<ConstraintViolation<EventDescription>> violations = validator.validate(description);

        // Assert - Only event is required, all other fields are optional
        assertTrue(violations.isEmpty());
        assertEquals(testEvent, description.getEvent());
        assertNull(description.getEventType());
        assertNull(description.getFeaturedArtists());
        assertNull(description.getTicketPurchaseLink());
        assertNull(description.getExtraDescription());
    }

    @Test
    void testEventDescriptionWithEmptyStrings_HappyPath() {
        // Arrange
        EventDescription description = new EventDescription(
            testEvent, 
            "", 
            "", 
            "", 
            ""
        );

        // Act
        Set<ConstraintViolation<EventDescription>> violations = validator.validate(description);

        // Assert - Empty strings are allowed for optional fields
        assertTrue(violations.isEmpty());
        assertEquals("", description.getEventType());
        assertEquals("", description.getFeaturedArtists());
        assertEquals("", description.getTicketPurchaseLink());
        assertEquals("", description.getExtraDescription());
    }

    @Test
    void testEventDescriptionWithLongText_HappyPath() {
        // Arrange
        String longArtists = "Artist 1, Artist 2, Artist 3, Artist 4, Artist 5, ".repeat(10);
        String longDescription = "This is a very detailed description. ".repeat(50);
        
        EventDescription description = new EventDescription(
            testEvent, 
            "Festival", 
            longArtists, 
            "http://very-long-url.example.com/tickets/event/12345", 
            longDescription
        );

        // Act
        Set<ConstraintViolation<EventDescription>> violations = validator.validate(description);

        // Assert - TEXT columns should handle long content
        assertTrue(violations.isEmpty());
        assertEquals(longArtists, description.getFeaturedArtists());
        assertEquals(longDescription, description.getExtraDescription());
    }

    @Test
    void testEventDescriptionMinimalValid_HappyPath() {
        // Arrange
        EventDescription description = new EventDescription();
        description.setEvent(testEvent);

        // Act
        Set<ConstraintViolation<EventDescription>> violations = validator.validate(description);

        // Assert - Only event is mandatory
        assertTrue(violations.isEmpty());
        assertEquals(testEvent, description.getEvent());
    }
}
