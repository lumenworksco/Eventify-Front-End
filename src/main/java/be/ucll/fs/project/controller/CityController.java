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

import be.ucll.fs.project.dto.CityDTO;
import be.ucll.fs.project.service.CityService;
import be.ucll.fs.project.unit.model.City;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cities")
@Tag(name = "City Management", description = "Endpoints for city operations")
public class CityController {

    private final CityService cityService;

    @Autowired
    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @Operation(summary = "Get all cities", description = "Returns all cities in the system")
    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCities());
    }

    @Operation(summary = "Get city by ID", description = "Returns a specific city by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable @Parameter(description = "City ID") Long id) {
        return ResponseEntity.ok(cityService.getCityById(id));
    }

    @Operation(summary = "Get city by name", description = "Returns a city by its name")
    @GetMapping("/name/{name}")
    public ResponseEntity<City> getCityByName(@PathVariable @Parameter(description = "City name") String name) {
        return ResponseEntity.ok(cityService.getCityByName(name));
    }

    @Operation(summary = "Get cities by country", description = "Returns all cities in a specific country")
    @GetMapping("/country/{country}")
    public ResponseEntity<List<City>> getCitiesByCountry(@PathVariable @Parameter(description = "Country name") String country) {
        return ResponseEntity.ok(cityService.getCitiesByCountry(country));
    }

    @Operation(summary = "Get cities by region", description = "Returns all cities in a specific region")
    @GetMapping("/region/{region}")
    public ResponseEntity<List<City>> getCitiesByRegion(@PathVariable @Parameter(description = "Region name") String region) {
        return ResponseEntity.ok(cityService.getCitiesByRegion(region));
    }

    @Operation(summary = "Create new city", description = "Create a new city (ADMIN only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "City created successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required")
    })
    @PostMapping
    public ResponseEntity<City> createCity(@Valid @RequestBody CityDTO cityDTO, HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        City city = new City(cityDTO.getName(), cityDTO.getRegion(), cityDTO.getCountry());
        City createdCity = cityService.createCity(city);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCity);
    }

    @Operation(summary = "Update city", description = "Update an existing city (ADMIN only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(@PathVariable @Parameter(description = "City ID") Long id, 
                                           @Valid @RequestBody CityDTO cityDTO,
                                           HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        City city = new City(cityDTO.getName(), cityDTO.getRegion(), cityDTO.getCountry());
        City updatedCity = cityService.updateCity(id, city);
        return ResponseEntity.ok(updatedCity);
    }

    @Operation(summary = "Delete city", description = "Delete a city (ADMIN only)")
    @SecurityRequirement(name = "Bearer Authentication")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "City deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable @Parameter(description = "City ID") Long id,
                                          HttpServletRequest request) {
        String role = (String) request.getAttribute("userRole");
        
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        cityService.deleteCity(id);
        return ResponseEntity.noContent().build();
    }
}
