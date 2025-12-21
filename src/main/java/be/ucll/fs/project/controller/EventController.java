package be.ucll.fs.project.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.fs.project.dto.EventDTO;
import be.ucll.fs.project.service.EventService;
import be.ucll.fs.project.unit.model.Event;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Event Management", description = "Endpoints for event operations")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @Operation(summary = "Get all events", description = "Returns all events in the system")
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @Operation(summary = "Get event by ID", description = "Returns a specific event by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable @Parameter(description = "Event ID") Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @Operation(summary = "Get event by title", description = "Returns an event by its title")
    @GetMapping("/title/{title}")
    public ResponseEntity<Event> getEventByTitle(@PathVariable @Parameter(description = "Event title") String title) {
        return ResponseEntity.ok(eventService.getEventByTitle(title));
    }

    @Operation(summary = "Get events by date", description = "Returns all events on a specific date")
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Event>> getEventsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @Parameter(description = "Event date (YYYY-MM-DD)") LocalDate date) {
        return ResponseEntity.ok(eventService.getEventsByDate(date));
    }

    @Operation(summary = "Get events in date range", description = "Returns all events between two dates")
    @GetMapping("/date-range")
    public ResponseEntity<List<Event>> getEventsBetweenDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @Parameter(description = "Start date") LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @Parameter(description = "End date") LocalDate endDate) {
        return ResponseEntity.ok(eventService.getEventsBetweenDates(startDate, endDate));
    }

    @Operation(summary = "Get events by city", description = "Returns all events in a specific city")
    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<Event>> getEventsByCity(@PathVariable @Parameter(description = "City ID") Long cityId) {
        return ResponseEntity.ok(eventService.getEventsByCity(cityId));
    }

    @Operation(summary = "Get upcoming events", description = "Returns all upcoming events from today")
    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @Operation(summary = "Create new event", description = "Create a new event (ADMIN or ORGANIZER only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Event created successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - ADMIN or ORGANIZER role required")
    })
    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventDTO eventDTO, HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        // Only ADMIN and ORGANIZER can create events
        if (role == null || (!"ADMIN".equals(role) && !"ORGANIZER".equals(role))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Event event = new Event(eventDTO.getTitle(), eventDTO.getEventDate(), 
                               eventDTO.getStartTime(), eventDTO.getEndTime());
        event.setAvailableTickets(eventDTO.getAvailableTickets());
        Event createdEvent = eventService.createEvent(event, eventDTO.getVenueIds());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @Operation(summary = "Update event", description = "Update an existing event (ADMIN or ORGANIZER only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Event updated successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - ADMIN or ORGANIZER role required")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable @Parameter(description = "Event ID") Long id, 
                                             @Valid @RequestBody EventDTO eventDTO,
                                             HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        // Only ADMIN and ORGANIZER can update events
        if (role == null || (!"ADMIN".equals(role) && !"ORGANIZER".equals(role))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Event event = new Event(eventDTO.getTitle(), eventDTO.getEventDate(), 
                               eventDTO.getStartTime(), eventDTO.getEndTime());
        event.setAvailableTickets(eventDTO.getAvailableTickets());
        Event updatedEvent = eventService.updateEvent(id, event, eventDTO.getVenueIds());
        return ResponseEntity.ok(updatedEvent);
    }

    @Operation(summary = "Delete event", description = "Delete an event (ADMIN only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable @Parameter(description = "Event ID") Long id,
                                           HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        // Only ADMIN can delete events
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add venue to event", description = "Add a venue to an event (ADMIN or ORGANIZER only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping("/{eventId}/venues/{venueId}")
    public ResponseEntity<Event> addVenueToEvent(@PathVariable @Parameter(description = "Event ID") Long eventId, 
                                                  @PathVariable @Parameter(description = "Venue ID") Long venueId,
                                                  HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        if (role == null || (!"ADMIN".equals(role) && !"ORGANIZER".equals(role))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Event event = eventService.addVenueToEvent(eventId, venueId);
        return ResponseEntity.ok(event);
    }

    @Operation(summary = "Remove venue from event", description = "Remove a venue from an event (ADMIN or ORGANIZER only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @DeleteMapping("/{eventId}/venues/{venueId}")
    public ResponseEntity<Event> removeVenueFromEvent(@PathVariable @Parameter(description = "Event ID") Long eventId, 
                                                       @PathVariable @Parameter(description = "Venue ID") Long venueId,
                                                       HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        if (role == null || (!"ADMIN".equals(role) && !"ORGANIZER".equals(role))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        Event event = eventService.removeVenueFromEvent(eventId, venueId);
        return ResponseEntity.ok(event);
    }

    @Operation(summary = "Get events by type", description = "Returns all events of a specific type")
    @GetMapping("/type/{eventType}")
    public ResponseEntity<List<Event>> getEventsByType(@PathVariable @Parameter(description = "Event type") String eventType) {
        return ResponseEntity.ok(eventService.getEventsByType(eventType));
    }

    @Operation(summary = "Get all event types", description = "Returns a list of all event types")
    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllEventTypes() {
        return ResponseEntity.ok(eventService.getAllEventTypes());
    }
}
