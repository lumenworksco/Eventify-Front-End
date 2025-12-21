package be.ucll.fs.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import be.ucll.fs.project.repository.UserRepository;
import be.ucll.fs.project.unit.model.City;
import be.ucll.fs.project.unit.model.User;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final CityService cityService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, CityService cityService) {
        this.userRepository = userRepository;
        this.cityService = cityService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
    }

    public User getUserByName(String name) {
        return userRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("User not found with name: " + name));
    }

    public List<User> getUsersByCity(Long cityId) {
        return userRepository.findByCityCityId(cityId);
    }

    public List<User> getUsersByEventPreference(String eventPreference) {
        return userRepository.findByEventPreference(eventPreference);
    }

    public List<User> getUsersByLocation(String location) {
        return userRepository.findByLocation(location);
    }

    public User createUser(User user) {
        if (user.getCity() != null && user.getCity().getCityId() != null) {
            City city = cityService.getCityById(user.getCity().getCityId());
            user.setCity(city);
        }
        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole(be.ucll.fs.project.unit.model.Role.USER);
        }
        // Hash the password before saving
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        user.setName(userDetails.getName());
        user.setLocation(userDetails.getLocation());
        user.setEventPreference(userDetails.getEventPreference());
        
        if (userDetails.getCity() != null && userDetails.getCity().getCityId() != null) {
            City city = cityService.getCityById(userDetails.getCity().getCityId());
            user.setCity(city);
        }
        
        // Handle preferredCity update
        if (userDetails.getPreferredCity() != null && userDetails.getPreferredCity().getCityId() != null) {
            City preferredCity = cityService.getCityById(userDetails.getPreferredCity().getCityId());
            user.setPreferredCity(preferredCity);
        } else if (userDetails.getPreferredCity() == null) {
            user.setPreferredCity(null);
        }
        
        // Hash the password if it's being updated
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(userDetails.getPassword());
            user.setPassword(hashedPassword);
        }
        
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    public User setPreferredCity(Long userId, Long cityId) {
        User user = getUserById(userId);
        if (cityId != null) {
            City preferredCity = cityService.getCityById(cityId);
            user.setPreferredCity(preferredCity);
        } else {
            user.setPreferredCity(null);
        }
        return userRepository.save(user);
    }
}
