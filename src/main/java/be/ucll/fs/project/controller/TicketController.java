package be.ucll.fs.project.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.fs.project.dto.TicketDTO;
import be.ucll.fs.project.service.TicketService;
import be.ucll.fs.project.unit.model.Ticket;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Ticket Management", description = "Endpoints for ticket purchase and management")
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @Operation(summary = "Get all tickets", description = "Returns all tickets in the system")
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @Operation(summary = "Get ticket by ID", description = "Returns a specific ticket by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable @Parameter(description = "Ticket ID") Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @Operation(summary = "Get tickets by user", description = "Returns all tickets purchased by a specific user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ticket>> getTicketsByUserId(@PathVariable @Parameter(description = "User ID") Long userId) {
        return ResponseEntity.ok(ticketService.getTicketsByUserId(userId));
    }

    @Operation(summary = "Get tickets by event", description = "Returns all tickets for a specific event")
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Ticket>> getTicketsByEventId(@PathVariable @Parameter(description = "Event ID") Long eventId) {
        return ResponseEntity.ok(ticketService.getTicketsByEventId(eventId));
    }

    @Operation(summary = "Get available tickets for event", description = "Returns the number of available tickets for an event")
    @GetMapping("/event/{eventId}/available")
    public ResponseEntity<Map<String, Object>> getAvailableTickets(@PathVariable @Parameter(description = "Event ID") Long eventId) {
        Long availableTickets = ticketService.getAvailableTicketsForEvent(eventId);
        return ResponseEntity.ok(Map.of(
            "eventId", eventId,
            "availableTickets", availableTickets != null ? availableTickets : "unlimited"
        ));
    }

    @Operation(summary = "Purchase ticket", description = "Purchase a ticket for an event (requires authentication)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Ticket purchased successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request or no tickets available"),
        @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    @PostMapping("/purchase")
    public ResponseEntity<Ticket> purchaseTicket(@Valid @RequestBody TicketDTO ticketDTO) {
        Ticket ticket = ticketService.purchaseTicket(ticketDTO.getUserId(), ticketDTO.getEventId(), 
                                                     ticketDTO.getPrice(), ticketDTO.getSeatNumber());
        return ResponseEntity.status(HttpStatus.CREATED).body(ticket);
    }

    @Operation(summary = "Cancel ticket", description = "Cancel a ticket (requires authentication)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Ticket cancelled successfully"),
        @ApiResponse(responseCode = "400", description = "Cannot cancel ticket less than 24 hours before event"),
        @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelTicket(@PathVariable @Parameter(description = "Ticket ID") Long id) {
        ticketService.cancelTicket(id);
        return ResponseEntity.ok(Map.of("message", "Ticket cancelled successfully"));
    }

    @Operation(summary = "Get user tickets for event", description = "Returns all tickets a specific user has for a specific event")
    @GetMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<List<Ticket>> getUserTicketsForEvent(
            @PathVariable @Parameter(description = "User ID") Long userId, 
            @PathVariable @Parameter(description = "Event ID") Long eventId) {
        return ResponseEntity.ok(ticketService.getUserTicketsForEvent(userId, eventId));
    }
}
