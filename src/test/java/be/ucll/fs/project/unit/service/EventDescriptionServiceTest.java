package be.ucll.fs.project.unit.service;

import be.ucll.fs.project.repository.EventDescriptionRepository;
import be.ucll.fs.project.service.EventDescriptionService;
import be.ucll.fs.project.unit.model.Event;
import be.ucll.fs.project.unit.model.EventDescription;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventDescriptionServiceTest {

    @Mock
    private EventDescriptionRepository eventDescriptionRepository;

    @InjectMocks
    private EventDescriptionService eventDescriptionService;

    @Test
    void testGetAllEventDescriptions_ReturnsAllDescriptions() {
        // Arrange
        Event event1 = new Event("Rock Festival", LocalDate.of(2025, 12, 20), 
                                LocalTime.of(18, 0), LocalTime.of(23, 0));
        Event event2 = new Event("Jazz Night", LocalDate.of(2025, 12, 25), 
                                LocalTime.of(20, 0), LocalTime.of(23, 30));
        
        EventDescription desc1 = new EventDescription(event1, "Concert", "The Rolling Stones", 
                                                      "http://tickets.com/1", "Amazing rock festival");
        EventDescription desc2 = new EventDescription(event2, "Concert", "Miles Davis Tribute", 
                                                      "http://tickets.com/2", "Jazz classics night");
        
        when(eventDescriptionRepository.findAll()).thenReturn(Arrays.asList(desc1, desc2));

        // Act
        List<EventDescription> descriptions = eventDescriptionService.getAllEventDescriptions();

        // Assert
        assertEquals(2, descriptions.size());
        assertEquals("Concert", descriptions.get(0).getEventType());
        assertEquals("The Rolling Stones", descriptions.get(0).getFeaturedArtists());
        verify(eventDescriptionRepository, times(1)).findAll();
    }

    @Test
    void testGetEventDescriptionById_ReturnsDescriptionWhenFound() {
        // Arrange
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        EventDescription description = new EventDescription(event, "Concert", "Artist Name", 
                                                            "http://tickets.com", "Great show");
        description.setDescriptionId(1L);
        
        when(eventDescriptionRepository.findById(1L)).thenReturn(Optional.of(description));

        // Act
        EventDescription result = eventDescriptionService.getEventDescriptionById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Concert", result.getEventType());
        assertEquals("Artist Name", result.getFeaturedArtists());
        assertEquals("Great show", result.getExtraDescription());
        verify(eventDescriptionRepository, times(1)).findById(1L);
    }

    @Test
    void testGetEventDescriptionByEventId_ReturnsDescriptionWhenFound() {
        // Arrange
        Long eventId = 1L;
        Event event = new Event("Rock Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        event.setEventId(eventId);
        
        EventDescription description = new EventDescription(event, "Concert", "AC/DC", 
                                                            "http://tickets.com", "Rock legends live");
        
        when(eventDescriptionRepository.findByEventEventId(eventId)).thenReturn(Optional.of(description));

        // Act
        EventDescription result = eventDescriptionService.getEventDescriptionByEventId(eventId);

        // Assert
        assertNotNull(result);
        assertEquals("AC/DC", result.getFeaturedArtists());
        assertEquals(event, result.getEvent());
        verify(eventDescriptionRepository, times(1)).findByEventEventId(eventId);
    }

    @Test
    void testGetEventDescriptionsByType_ReturnsDescriptionsByType() {
        // Arrange
        Event event1 = new Event("Concert 1", LocalDate.of(2025, 12, 20), 
                                LocalTime.of(18, 0), LocalTime.of(23, 0));
        Event event2 = new Event("Concert 2", LocalDate.of(2025, 12, 25), 
                                LocalTime.of(20, 0), LocalTime.of(23, 30));
        
        EventDescription desc1 = new EventDescription(event1, "Concert", "Artist 1", 
                                                      "http://tickets.com/1", "Description 1");
        EventDescription desc2 = new EventDescription(event2, "Concert", "Artist 2", 
                                                      "http://tickets.com/2", "Description 2");
        
        when(eventDescriptionRepository.findByEventType("Concert")).thenReturn(Arrays.asList(desc1, desc2));

        // Act
        List<EventDescription> descriptions = eventDescriptionService.getEventDescriptionsByType("Concert");

        // Assert
        assertEquals(2, descriptions.size());
        assertTrue(descriptions.stream().allMatch(d -> d.getEventType().equals("Concert")));
        verify(eventDescriptionRepository, times(1)).findByEventType("Concert");
    }

    @Test
    void testCreateEventDescription_SavesAndReturnsDescription() {
        // Arrange
        Event event = new Event("New Concert", LocalDate.of(2025, 12, 30), 
                               LocalTime.of(19, 0), LocalTime.of(22, 0));
        EventDescription newDescription = new EventDescription(event, "Concert", "New Artist", 
                                                               "http://tickets.com/new", "New event");
        EventDescription savedDescription = new EventDescription(event, "Concert", "New Artist", 
                                                                 "http://tickets.com/new", "New event");
        savedDescription.setDescriptionId(1L);
        
        when(eventDescriptionRepository.save(any(EventDescription.class))).thenReturn(savedDescription);

        // Act
        EventDescription result = eventDescriptionService.createEventDescription(newDescription);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getDescriptionId());
        assertEquals("New Artist", result.getFeaturedArtists());
        verify(eventDescriptionRepository, times(1)).save(any(EventDescription.class));
    }

    @Test
    void testUpdateEventDescription_UpdatesAndReturnsDescription() {
        // Arrange
        Long descriptionId = 1L;
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        
        EventDescription existingDescription = new EventDescription(event, "Concert", "Old Artist", 
                                                                    "http://old-link.com", "Old description");
        existingDescription.setDescriptionId(descriptionId);
        
        EventDescription updateDetails = new EventDescription(event, "Festival", "New Artist", 
                                                              "http://new-link.com", "Updated description");
        
        when(eventDescriptionRepository.findById(descriptionId)).thenReturn(Optional.of(existingDescription));
        when(eventDescriptionRepository.save(any(EventDescription.class))).thenReturn(existingDescription);

        // Act
        EventDescription result = eventDescriptionService.updateEventDescription(descriptionId, updateDetails);

        // Assert
        assertNotNull(result);
        assertEquals("Festival", result.getEventType());
        assertEquals("New Artist", result.getFeaturedArtists());
        assertEquals("http://new-link.com", result.getTicketPurchaseLink());
        assertEquals("Updated description", result.getExtraDescription());
        verify(eventDescriptionRepository, times(1)).findById(descriptionId);
        verify(eventDescriptionRepository, times(1)).save(any(EventDescription.class));
    }

    @Test
    void testDeleteEventDescription_DeletesDescription() {
        // Arrange
        Long descriptionId = 1L;
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        EventDescription description = new EventDescription(event, "Concert", "Artist", 
                                                            "http://tickets.com", "Description");
        description.setDescriptionId(descriptionId);
        
        when(eventDescriptionRepository.findById(descriptionId)).thenReturn(Optional.of(description));
        doNothing().when(eventDescriptionRepository).delete(description);

        // Act
        eventDescriptionService.deleteEventDescription(descriptionId);

        // Assert
        verify(eventDescriptionRepository, times(1)).findById(descriptionId);
        verify(eventDescriptionRepository, times(1)).delete(description);
    }
}
