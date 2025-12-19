package be.ucll.fs.project;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import be.ucll.fs.project.repository.CityRepository;
import be.ucll.fs.project.repository.EventDescriptionRepository;
import be.ucll.fs.project.repository.EventRepository;
import be.ucll.fs.project.repository.UserRepository;
import be.ucll.fs.project.repository.VenueRepository;
import be.ucll.fs.project.unit.model.City;
import be.ucll.fs.project.unit.model.Event;
import be.ucll.fs.project.unit.model.EventDescription;
import be.ucll.fs.project.unit.model.Role;
import be.ucll.fs.project.unit.model.User;
import be.ucll.fs.project.unit.model.Venue;

@Component
public class DbInitializer implements CommandLineRunner {

    private final CityRepository cityRepository;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final EventDescriptionRepository eventDescriptionRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DbInitializer(CityRepository cityRepository, UserRepository userRepository,
                        VenueRepository venueRepository, EventRepository eventRepository,
                        EventDescriptionRepository eventDescriptionRepository) {
        this.cityRepository = cityRepository;
        this.userRepository = userRepository;
        this.venueRepository = venueRepository;
        this.eventRepository = eventRepository;
        this.eventDescriptionRepository = eventDescriptionRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public void run(String... args) {
        if (cityRepository.count() > 0) {
            return; // Data already exists
        }

        // Create Cities
        City brussels = new City("Brussels", "Brussels-Capital", "Belgium");
        City antwerp = new City("Antwerp", "Flanders", "Belgium");
        City ghent = new City("Ghent", "Flanders", "Belgium");
        cityRepository.saveAll(Arrays.asList(brussels, antwerp, ghent));

        // Create Users with hashed passwords and different roles
        User admin = new User("admin", passwordEncoder.encode("admin123"), Role.ADMIN, "Brussels Downtown", "Music Concerts", brussels);
        User jane = new User("jane", passwordEncoder.encode("jane123"), Role.ORGANIZER, "Antwerp Center", "Sports Events", antwerp);
        User john = new User("john", passwordEncoder.encode("john123"), Role.USER, "Ghent Historic District", "Theater", ghent);
        User diana = new User("diana", passwordEncoder.encode("diana123"), Role.USER, "Brussels", "Music Festivals", brussels);
        userRepository.saveAll(Arrays.asList(admin, jane, john, diana));

        // Create Venues
        Venue venue1 = new Venue("AB Concert Hall", "Boulevard Anspach 110, Brussels", 2000, brussels);
        Venue venue2 = new Venue("Forest National", "Avenue Victor Rousseau 208, Brussels", 8000, brussels);
        Venue venue3 = new Venue("Sportpaleis", "Schijnpoortweg 119, Antwerp", 23000, antwerp);
        Venue venue4 = new Venue("De Vooruit", "Sint-Pietersnieuwstraat 23, Ghent", 1000, ghent);
        Venue venue5 = new Venue("Brussels Expo", "Place de Belgique 1, Brussels", 15000, brussels);
        venueRepository.saveAll(Arrays.asList(venue1, venue2, venue3, venue4, venue5));

        // Create Events
        Event event1 = new Event("Rock Festival 2025", LocalDate.of(2025, 12, 20), 
                                LocalTime.of(18, 0), LocalTime.of(23, 0));
        event1.addVenue(venue1);
        event1.addVenue(venue2);
        eventRepository.save(event1);

        Event event2 = new Event("Jazz Night", LocalDate.of(2025, 12, 22), 
                                LocalTime.of(20, 0), LocalTime.of(23, 30));
        event2.addVenue(venue4);
        eventRepository.save(event2);

        Event event3 = new Event("New Year Concert", LocalDate.of(2025, 12, 31), 
                                LocalTime.of(21, 0), LocalTime.of(23, 59));
        event3.addVenue(venue3);
        eventRepository.save(event3);

        Event event4 = new Event("Electronic Music Festival", LocalDate.of(2026, 1, 15), 
                                LocalTime.of(19, 0), LocalTime.of(23, 30));
        event4.addVenue(venue5);
        eventRepository.save(event4);

        // Create Event Descriptions
        EventDescription desc1 = new EventDescription(event1, "Music Festival", 
                "The Killers, Arctic Monkeys, Foo Fighters", 
                "https://tickets.example.com/rock-festival", 
                "A spectacular rock festival featuring international artists!");
        event1.setEventDescription(desc1);

        EventDescription desc2 = new EventDescription(event2, "Jazz Concert", 
                "John Coltrane Tribute Band", 
                "https://tickets.example.com/jazz-night", 
                "An intimate evening of smooth jazz in a historic venue.");
        event2.setEventDescription(desc2);

        EventDescription desc3 = new EventDescription(event3, "Classical Music", 
                "Vienna Philharmonic Orchestra", 
                "https://tickets.example.com/new-year", 
                "Ring in the New Year with classical masterpieces!");
        event3.setEventDescription(desc3);

        EventDescription desc4 = new EventDescription(event4, "Electronic/EDM", 
                "Calvin Harris, David Guetta, Martin Garrix", 
                "https://tickets.example.com/edm-fest", 
                "The biggest electronic music festival of the year!");
        event4.setEventDescription(desc4);

        eventDescriptionRepository.saveAll(Arrays.asList(desc1, desc2, desc3, desc4));
        eventRepository.saveAll(Arrays.asList(event1, event2, event3, event4));

        System.out.println("✅ Database initialized with test data!");
        System.out.println("📊 Created: " + cityRepository.count() + " cities, " + 
                          userRepository.count() + " users, " + 
                          venueRepository.count() + " venues, " + 
                          eventRepository.count() + " events");
    }
}
