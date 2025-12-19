package be.ucll.fs.project.unit.service;

import be.ucll.fs.project.repository.TicketRepository;
import be.ucll.fs.project.service.EventService;
import be.ucll.fs.project.service.TicketService;
import be.ucll.fs.project.service.UserService;
import be.ucll.fs.project.unit.model.City;
import be.ucll.fs.project.unit.model.Event;
import be.ucll.fs.project.unit.model.Role;
import be.ucll.fs.project.unit.model.Ticket;
import be.ucll.fs.project.unit.model.User;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private EventService eventService;

    @Mock
    private UserService userService;

    @InjectMocks
    private TicketService ticketService;

    @Test
    void testGetAllTickets_ReturnsAllTickets() {
        // Arrange
        City city = new City("Brussels", "Brussels-Capital", "Belgium");
        Venue venue = new Venue("Concert Hall", "Main Street 1", 5000, city);
        Event event = new Event("Rock Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        User user1 = new User("Alice", "hashedpass", Role.USER, "Brussels", "Music", city);
        User user2 = new User("Bob", "hashedpass", Role.USER, "Brussels", "Music", city);
        
        Ticket ticket1 = new Ticket(user1, event, 50.0);
        Ticket ticket2 = new Ticket(user2, event, 50.0);
        
        when(ticketRepository.findAll()).thenReturn(Arrays.asList(ticket1, ticket2));

        // Act
        List<Ticket> tickets = ticketService.getAllTickets();

        // Assert
        assertEquals(2, tickets.size());
        verify(ticketRepository, times(1)).findAll();
    }

    @Test
    void testGetTicketById_ReturnsTicketWhenFound() {
        // Arrange
        City city = new City("Brussels", "Brussels-Capital", "Belgium");
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        User user = new User("Alice", "hashedpass", Role.USER, "Brussels", "Music", city);
        
        Ticket ticket = new Ticket(user, event, 75.0);
        ticket.setTicketId(1L);
        
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        // Act
        Ticket result = ticketService.getTicketById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(75.0, result.getPrice());
        verify(ticketRepository, times(1)).findById(1L);
    }

    @Test
    void testGetTicketsByUserId_ReturnsUserTickets() {
        // Arrange
        Long userId = 1L;
        City city = new City("Brussels", "Brussels-Capital", "Belgium");
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        User user = new User("Alice", "hashedpass", Role.USER, "Brussels", "Music", city);
        user.setUserId(userId);
        
        Ticket ticket1 = new Ticket(user, event, 50.0);
        Ticket ticket2 = new Ticket(user, event, 60.0);
        
        when(userService.getUserById(userId)).thenReturn(user);
        when(ticketRepository.findByUserUserId(userId)).thenReturn(Arrays.asList(ticket1, ticket2));

        // Act
        List<Ticket> tickets = ticketService.getTicketsByUserId(userId);

        // Assert
        assertEquals(2, tickets.size());
        verify(userService, times(1)).getUserById(userId);
        verify(ticketRepository, times(1)).findByUserUserId(userId);
    }

    @Test
    void testGetTicketsByEventId_ReturnsEventTickets() {
        // Arrange
        Long eventId = 1L;
        City city = new City("Brussels", "Brussels-Capital", "Belgium");
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        event.setEventId(eventId);
        User user1 = new User("Alice", "hashedpass", Role.USER, "Brussels", "Music", city);
        User user2 = new User("Bob", "hashedpass", Role.USER, "Brussels", "Music", city);
        
        Ticket ticket1 = new Ticket(user1, event, 50.0);
        Ticket ticket2 = new Ticket(user2, event, 50.0);
        
        when(eventService.getEventById(eventId)).thenReturn(event);
        when(ticketRepository.findByEventEventId(eventId)).thenReturn(Arrays.asList(ticket1, ticket2));

        // Act
        List<Ticket> tickets = ticketService.getTicketsByEventId(eventId);

        // Assert
        assertEquals(2, tickets.size());
        verify(eventService, times(1)).getEventById(eventId);
        verify(ticketRepository, times(1)).findByEventEventId(eventId);
    }

    @Test
    void testGetAvailableTicketsForEvent_ReturnsAvailableCount() {
        // Arrange
        Long eventId = 1L;
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        event.setEventId(eventId);
        event.setAvailableTickets(100);
        
        when(eventService.getEventById(eventId)).thenReturn(event);
        when(ticketRepository.countTicketsByEventId(eventId)).thenReturn(30L);

        // Act
        Long availableTickets = ticketService.getAvailableTicketsForEvent(eventId);

        // Assert
        assertEquals(70L, availableTickets);
        verify(eventService, times(1)).getEventById(eventId);
        verify(ticketRepository, times(1)).countTicketsByEventId(eventId);
    }

    @Test
    void testPurchaseTicket_SuccessfulPurchase() {
        // Arrange
        Long userId = 1L;
        Long eventId = 1L;
        Double price = 50.0;
        
        City city = new City("Brussels", "Brussels-Capital", "Belgium");
        User user = new User("Alice", "hashedpass", Role.USER, "Brussels", "Music", city);
        user.setUserId(userId);
        
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        event.setEventId(eventId);
        event.setAvailableTickets(100);
        
        Ticket savedTicket = new Ticket(user, event, price);
        savedTicket.setTicketId(1L);
        
        when(userService.getUserById(userId)).thenReturn(user);
        when(eventService.getEventById(eventId)).thenReturn(event);
        when(ticketRepository.countTicketsByEventId(eventId)).thenReturn(30L);
        when(ticketRepository.save(any(Ticket.class))).thenReturn(savedTicket);

        // Act
        Ticket result = ticketService.purchaseTicket(userId, eventId, price);

        // Assert
        assertNotNull(result);
        assertEquals(price, result.getPrice());
        assertEquals(user, result.getUser());
        assertEquals(event, result.getEvent());
        verify(userService, times(1)).getUserById(userId);
        verify(eventService, times(2)).getEventById(eventId); // Called twice: once to verify, once in getAvailableTickets
        verify(ticketRepository, times(1)).save(any(Ticket.class));
    }

    @Test
    void testPurchaseTicketWithSeatNumber_SuccessfulPurchase() {
        // Arrange
        Long userId = 1L;
        Long eventId = 1L;
        Double price = 75.0;
        String seatNumber = "A15";
        
        City city = new City("Brussels", "Brussels-Capital", "Belgium");
        User user = new User("Alice", "hashedpass", Role.USER, "Brussels", "Music", city);
        user.setUserId(userId);
        
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        event.setEventId(eventId);
        event.setAvailableTickets(100);
        
        Ticket savedTicket = new Ticket(user, event, price, seatNumber);
        savedTicket.setTicketId(1L);
        
        when(userService.getUserById(userId)).thenReturn(user);
        when(eventService.getEventById(eventId)).thenReturn(event);
        when(ticketRepository.countTicketsByEventId(eventId)).thenReturn(30L);
        when(ticketRepository.save(any(Ticket.class))).thenReturn(savedTicket);

        // Act
        Ticket result = ticketService.purchaseTicket(userId, eventId, price, seatNumber);

        // Assert
        assertNotNull(result);
        assertEquals(price, result.getPrice());
        assertEquals(seatNumber, result.getSeatNumber());
        verify(ticketRepository, times(1)).save(any(Ticket.class));
    }

    @Test
    void testGetUserTicketsForEvent_ReturnsTickets() {
        // Arrange
        Long userId = 1L;
        Long eventId = 1L;
        
        City city = new City("Brussels", "Brussels-Capital", "Belgium");
        User user = new User("Alice", "hashedpass", Role.USER, "Brussels", "Music", city);
        user.setUserId(userId);
        
        Event event = new Event("Concert", LocalDate.of(2025, 12, 25), 
                               LocalTime.of(20, 0), LocalTime.of(23, 0));
        event.setEventId(eventId);
        
        Ticket ticket1 = new Ticket(user, event, 50.0, "A10");
        Ticket ticket2 = new Ticket(user, event, 50.0, "A11");
        
        when(userService.getUserById(userId)).thenReturn(user);
        when(eventService.getEventById(eventId)).thenReturn(event);
        when(ticketRepository.findByUserIdAndEventId(userId, eventId))
            .thenReturn(Arrays.asList(ticket1, ticket2));

        // Act
        List<Ticket> tickets = ticketService.getUserTicketsForEvent(userId, eventId);

        // Assert
        assertEquals(2, tickets.size());
        verify(userService, times(1)).getUserById(userId);
        verify(eventService, times(1)).getEventById(eventId);
        verify(ticketRepository, times(1)).findByUserIdAndEventId(userId, eventId);
    }
}
