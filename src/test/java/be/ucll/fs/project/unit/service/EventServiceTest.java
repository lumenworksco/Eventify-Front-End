package be.ucll.fs.project.unit.service;

import be.ucll.fs.project.repository.EventRepository;
import be.ucll.fs.project.service.EventDescriptionService;
import be.ucll.fs.project.service.EventService;
import be.ucll.fs.project.service.VenueService;
import be.ucll.fs.project.unit.model.Event;
import be.ucll.fs.project.unit.model.Venue;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private VenueService venueService;

    @Mock
    private EventDescriptionService eventDescriptionService;

    @InjectMocks
    private EventService eventService;

    @Test
    void testGetAllEvents_ReturnsAllEvents() {
        // Arrange
        Event event1 = new Event("Rock Festival", LocalDate.of(2025, 12, 20), 
                                LocalTime.of(18, 0), LocalTime.of(23, 0));
        Event event2 = new Event("Jazz Night", LocalDate.of(2025, 12, 25), 
                                LocalTime.of(20, 0), LocalTime.of(23, 30));
        when(eventRepository.findAll()).thenReturn(Arrays.asList(event1, event2));

        // Act
        List<Event> events = eventService.getAllEvents();

        // Assert
        assertEquals(2, events.size());
        assertEquals("Rock Festival", events.get(0).getTitle());
        assertEquals("Jazz Night", events.get(1).getTitle());
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void testGetEventById_ReturnsEventWhenFound() {
        // Arrange
        Event event = new Event("Concert", LocalDate.of(2025, 12, 30), 
                               LocalTime.of(19, 0), LocalTime.of(22, 0));
        event.setEventId(1L);
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        // Act
        Event result = eventService.getEventById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Concert", result.getTitle());
        assertEquals(LocalDate.of(2025, 12, 30), result.getEventDate());
        verify(eventRepository, times(1)).findById(1L);
    }

    @Test
    void testGetEventByTitle_ReturnsEventWhenFound() {
        // Arrange
        Event event = new Event("Rock Festival", LocalDate.of(2025, 12, 20), 
                               LocalTime.of(18, 0), LocalTime.of(23, 0));
        when(eventRepository.findByTitle("Rock Festival")).thenReturn(Optional.of(event));

        // Act
        Event result = eventService.getEventByTitle("Rock Festival");

        // Assert
        assertNotNull(result);
        assertEquals("Rock Festival", result.getTitle());
        verify(eventRepository, times(1)).findByTitle("Rock Festival");
    }

    @Test
    void testGetEventsByDate_ReturnsEventsOnSpecificDate() {
        // Arrange
        LocalDate date = LocalDate.of(2025, 12, 25);
        Event event1 = new Event("Christmas Concert", date, LocalTime.of(19, 0), LocalTime.of(22, 0));
        Event event2 = new Event("Holiday Party", date, LocalTime.of(20, 0), LocalTime.of(23, 0));
        when(eventRepository.findByEventDate(date)).thenReturn(Arrays.asList(event1, event2));

        // Act
        List<Event> events = eventService.getEventsByDate(date);

        // Assert
        assertEquals(2, events.size());
        assertTrue(events.stream().allMatch(e -> e.getEventDate().equals(date)));
        verify(eventRepository, times(1)).findByEventDate(date);
    }

    @Test
    void testGetEventsBetweenDates_ReturnsEventsInRange() {
        // Arrange
        LocalDate startDate = LocalDate.of(2025, 12, 1);
        LocalDate endDate = LocalDate.of(2025, 12, 31);
        Event event1 = new Event("Event 1", LocalDate.of(2025, 12, 15), 
                                LocalTime.of(18, 0), LocalTime.of(22, 0));
        Event event2 = new Event("Event 2", LocalDate.of(2025, 12, 20), 
                                LocalTime.of(19, 0), LocalTime.of(23, 0));
        when(eventRepository.findByEventDateBetween(startDate, endDate))
            .thenReturn(Arrays.asList(event1, event2));

        // Act
        List<Event> events = eventService.getEventsBetweenDates(startDate, endDate);

        // Assert
        assertEquals(2, events.size());
        verify(eventRepository, times(1)).findByEventDateBetween(startDate, endDate);
    }

    @Test
    void testGetUpcomingEvents_ReturnsUpcomingEvents() {
        // Arrange
        LocalDate today = LocalDate.now();
        Event event1 = new Event("Future Event 1", today.plusDays(5), 
                                LocalTime.of(18, 0), LocalTime.of(22, 0));
        Event event2 = new Event("Future Event 2", today.plusDays(10), 
                                LocalTime.of(19, 0), LocalTime.of(23, 0));
        when(eventRepository.findUpcomingEvents(today)).thenReturn(Arrays.asList(event1, event2));

        // Act
        List<Event> events = eventService.getUpcomingEvents();

        // Assert
        assertEquals(2, events.size());
        verify(eventRepository, times(1)).findUpcomingEvents(today);
    }

    @Test
    void testCreateEvent_SavesAndReturnsEvent() {
        // Arrange
        Event newEvent = new Event("New Concert", LocalDate.of(2026, 1, 15), 
                                  LocalTime.of(20, 0), LocalTime.of(23, 0));
        Venue venue = new Venue();
        venue.setVenueId(1L);
        
        when(venueService.getVenueById(1L)).thenReturn(venue);
        when(eventRepository.save(any(Event.class))).thenReturn(newEvent);

        // Act
        Event result = eventService.createEvent(newEvent, Arrays.asList(1L));

        // Assert
        assertNotNull(result);
        assertEquals("New Concert", result.getTitle());
        verify(venueService, times(1)).getVenueById(1L);
        verify(eventRepository, times(2)).save(any(Event.class)); // Called twice: once to set venue, once to finalize
    }

    @Test
    void testDeleteEvent_DeletesEventSuccessfully() {
        // Arrange
        Event event = new Event("Delete Me", LocalDate.of(2026, 1, 1), 
                               LocalTime.of(18, 0), LocalTime.of(22, 0));
        event.setEventId(1L);
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        doNothing().when(eventRepository).delete(event);

        // Act
        eventService.deleteEvent(1L);

        // Assert
        verify(eventRepository, times(1)).findById(1L);
        verify(eventRepository, times(1)).delete(event);
    }
}
