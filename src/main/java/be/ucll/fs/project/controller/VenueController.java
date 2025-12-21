package be.ucll.fs.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.fs.project.dto.VenueDTO;
import be.ucll.fs.project.service.VenueService;
import be.ucll.fs.project.unit.model.City;
import be.ucll.fs.project.unit.model.Venue;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/venues")
@Tag(name = "Venue Management", description = "Endpoints for venue operations")
public class VenueController {

    private final VenueService venueService;

    @Autowired
    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @Operation(summary = "Get all venues", description = "Returns all venues in the system")
    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @Operation(summary = "Get venue by ID", description = "Returns a specific venue by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable @Parameter(description = "Venue ID") Long id) {
        return ResponseEntity.ok(venueService.getVenueById(id));
    }

    @Operation(summary = "Get venue by name", description = "Returns a venue by its name")
    @GetMapping("/name/{name}")
    public ResponseEntity<Venue> getVenueByName(@PathVariable @Parameter(description = "Venue name") String name) {
        return ResponseEntity.ok(venueService.getVenueByName(name));
    }

    @Operation(summary = "Get venues by city", description = "Returns all venues in a specific city")
    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<Venue>> getVenuesByCity(@PathVariable @Parameter(description = "City ID") Long cityId) {
        return ResponseEntity.ok(venueService.getVenuesByCity(cityId));
    }

    @Operation(summary = "Get venues by minimum capacity", description = "Returns all venues with at least the specified capacity")
    @GetMapping("/capacity/{capacity}")
    public ResponseEntity<List<Venue>> getVenuesByMinimumCapacity(@PathVariable @Parameter(description = "Minimum capacity") Integer capacity) {
        return ResponseEntity.ok(venueService.getVenuesByMinimumCapacity(capacity));
    }

    @Operation(summary = "Create new venue", description = "Create a new venue (ADMIN or ORGANIZER only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Venue created successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - ADMIN or ORGANIZER role required")
    })
    @PostMapping
    public ResponseEntity<Venue> createVenue(@Valid @RequestBody VenueDTO venueDTO, HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        if (role == null || (!"ADMIN".equals(role) && !"ORGANIZER".equals(role))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        City city = new City();
        city.setCityId(venueDTO.getCityId());
        Venue venue = new Venue(venueDTO.getName(), venueDTO.getAddress(), 
                                venueDTO.getCapacity(), city);
        Venue createdVenue = venueService.createVenue(venue);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdVenue);
    }

    @Operation(summary = "Update venue", description = "Update an existing venue (ADMIN or ORGANIZER only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable @Parameter(description = "Venue ID") Long id, 
                                             @Valid @RequestBody VenueDTO venueDTO,
                                             HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        if (role == null || (!"ADMIN".equals(role) && !"ORGANIZER".equals(role))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        City city = new City();
        city.setCityId(venueDTO.getCityId());
        Venue venue = new Venue(venueDTO.getName(), venueDTO.getAddress(), 
                                venueDTO.getCapacity(), city);
        Venue updatedVenue = venueService.updateVenue(id, venue);
        return ResponseEntity.ok(updatedVenue);
    }

    @Operation(summary = "Delete venue", description = "Delete a venue (ADMIN only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Venue deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable @Parameter(description = "Venue ID") Long id,
                                           HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
}
