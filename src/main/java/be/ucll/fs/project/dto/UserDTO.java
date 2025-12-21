package be.ucll.fs.project.dto;

import be.ucll.fs.project.unit.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserDTO {

    @NotBlank(message = "User name is required")
    private String name;

    @NotBlank(message = "Password is required")
    private String password;

    private Role role;

    private String location;

    private String eventPreference;

    @NotNull(message = "City ID is required")
    private Long cityId;

    private Long preferredCityId;

    public UserDTO() {
    }

    public UserDTO(String name, String password, Long cityId) {
        this.name = name;
        this.password = password;
        this.cityId = cityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEventPreference() {
        return eventPreference;
    }

    public void setEventPreference(String eventPreference) {
        this.eventPreference = eventPreference;
    }

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

    public Long getPreferredCityId() {
        return preferredCityId;
    }

    public void setPreferredCityId(Long preferredCityId) {
        this.preferredCityId = preferredCityId;
    }
}
