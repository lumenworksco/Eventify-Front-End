package be.ucll.fs.project;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(DbInitializer.class);

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
        City leuven = new City("Leuven", "Flemish Brabant", "Belgium");
        City bruges = new City("Bruges", "West Flanders", "Belgium");
        City liege = new City("Liège", "Wallonia", "Belgium");
        cityRepository.saveAll(Arrays.asList(brussels, antwerp, ghent, leuven, bruges, liege));

        // Create Users with hashed passwords and different roles
        User admin = new User("admin", passwordEncoder.encode("admin123"), Role.ADMIN, "Brussels Downtown", "Music Concerts", brussels);
        User jane = new User("jane", passwordEncoder.encode("jane123"), Role.ORGANIZER, "Antwerp Center", "Sports Events", antwerp);
        User john = new User("john", passwordEncoder.encode("john123"), Role.USER, "Ghent Historic District", "Theater", ghent);
        User diana = new User("diana", passwordEncoder.encode("diana123"), Role.USER, "Brussels", "Music Festivals", brussels);
        User peter = new User("peter", passwordEncoder.encode("peter123"), Role.ORGANIZER, "Leuven Center", "Comedy Shows", leuven);
        User sophie = new User("sophie", passwordEncoder.encode("sophie123"), Role.USER, "Bruges Old Town", "Classical Music", bruges);
        User marc = new User("marc", passwordEncoder.encode("marc123"), Role.USER, "Liège", "Rock Concerts", liege);
        userRepository.saveAll(Arrays.asList(admin, jane, john, diana, peter, sophie, marc));

        // Create Venues - Brussels (5 venues)
        Venue abConcertHall = new Venue("AB Concert Hall", "Boulevard Anspach 110, Brussels", 2000, brussels);
        Venue forestNational = new Venue("Forest National", "Avenue Victor Rousseau 208, Brussels", 8000, brussels);
        Venue brusselsExpo = new Venue("Brussels Expo", "Place de Belgique 1, Brussels", 15000, brussels);
        Venue abClub = new Venue("Ancienne Belgique - Club", "Boulevard Anspach 110, Brussels", 300, brussels);
        Venue bozar = new Venue("BOZAR", "Rue Ravenstein 23, Brussels", 2200, brussels);
        
        // Antwerp (4 venues)
        Venue sportpaleis = new Venue("Sportpaleis", "Schijnpoortweg 119, Antwerp", 23000, antwerp);
        Venue trix = new Venue("TRIX", "Noordersingel 28, Antwerp", 1200, antwerp);
        Venue stadsschouwburg = new Venue("Stadsschouwburg", "Komedieplaats 18, Antwerp", 1000, antwerp);
        Venue hetBos = new Venue("Het Bos", "Ankerrui 5, Antwerp", 400, antwerp);
        
        // Ghent (4 venues)
        Venue vooruit = new Venue("De Vooruit", "Sint-Pietersnieuwstraat 23, Ghent", 1000, ghent);
        Venue handelsbeurs = new Venue("Handelsbeurs", "Lange Violettestraat 41, Ghent", 600, ghent);
        Venue ntGent = new Venue("NTGent", "Sint-Baafsplein 17, Ghent", 800, ghent);
        Venue kinky = new Venue("Kinky Star", "Vlasmarkt 9, Ghent", 200, ghent);
        
        // Leuven (3 venues)
        Venue hetDepot = new Venue("Het Depot", "Martelarenplein 12, Leuven", 800, leuven);
        Venue stuk = new Venue("STUK", "Naamsestraat 96, Leuven", 500, leuven);
        Venue stelplaats = new Venue("Stelplaats", "Vaartkom 39, Leuven", 1200, leuven);
        
        // Bruges (3 venues)
        Venue concertgebouw = new Venue("Concertgebouw", "T'Zand 34, Bruges", 1300, bruges);
        Venue cactusMuziekcentrum = new Venue("Cactus Muziekcentrum", "Magdalenastraat 27, Bruges", 700, bruges);
        Venue stadsschouwburgBruges = new Venue("Stadsschouwburg Bruges", "Vlamingstraat 29, Bruges", 650, bruges);
        
        // Liège (3 venues)
        Venue reflektor = new Venue("Reflektor", "Rue de Bruxelles 1, Liège", 1500, liege);
        Venue operaRoyal = new Venue("Opéra Royal de Wallonie", "Place de l'Opéra, Liège", 1100, liege);
        Venue laMachine = new Venue("La Machine", "Rue Grétry 35, Liège", 350, liege);
        
        venueRepository.saveAll(Arrays.asList(
            abConcertHall, forestNational, brusselsExpo, abClub, bozar,
            sportpaleis, trix, stadsschouwburg, hetBos,
            vooruit, handelsbeurs, ntGent, kinky,
            hetDepot, stuk, stelplaats,
            concertgebouw, cactusMuziekcentrum, stadsschouwburgBruges,
            reflektor, operaRoyal, laMachine
        ));

        // ==========================================
        // Create Events - Brussels venues
        // ==========================================
        
        // AB Concert Hall events
        Event ab1 = new Event("Rock Festival 2025", LocalDate.of(2025, 12, 28), 
                             LocalTime.of(18, 0), LocalTime.of(23, 0));
        ab1.setAvailableTickets(500);
        ab1.addVenue(abConcertHall);
        eventRepository.save(ab1);
        
        Event ab2 = new Event("Belgian DJ Night", LocalDate.of(2026, 1, 18), 
                             LocalTime.of(22, 0), LocalTime.of(23, 59));
        ab2.setAvailableTickets(800);
        ab2.addVenue(abConcertHall);
        eventRepository.save(ab2);
        
        Event ab3 = new Event("Indie Showcase", LocalDate.of(2026, 2, 7), 
                             LocalTime.of(20, 0), LocalTime.of(23, 30));
        ab3.setAvailableTickets(600);
        ab3.addVenue(abConcertHall);
        eventRepository.save(ab3);
        
        // Forest National events
        Event fn1 = new Event("Pop Giants Tour", LocalDate.of(2026, 1, 25), 
                             LocalTime.of(19, 30), LocalTime.of(23, 0));
        fn1.setAvailableTickets(5000);
        fn1.addVenue(forestNational);
        eventRepository.save(fn1);
        
        Event fn2 = new Event("Comedy Gala 2026", LocalDate.of(2026, 2, 14), 
                             LocalTime.of(20, 0), LocalTime.of(23, 0));
        fn2.setAvailableTickets(4000);
        fn2.addVenue(forestNational);
        eventRepository.save(fn2);
        
        // Brussels Expo events
        Event be1 = new Event("Electronic Music Festival", LocalDate.of(2026, 1, 15), 
                             LocalTime.of(19, 0), LocalTime.of(23, 30));
        be1.setAvailableTickets(10000);
        be1.addVenue(brusselsExpo);
        eventRepository.save(be1);
        
        Event be2 = new Event("Spring Music Festival", LocalDate.of(2026, 3, 15), 
                             LocalTime.of(14, 0), LocalTime.of(23, 0));
        be2.setAvailableTickets(8000);
        be2.addVenue(brusselsExpo);
        eventRepository.save(be2);
        
        // AB Club events
        Event abc1 = new Event("Intimate Jazz Session", LocalDate.of(2026, 1, 11), 
                              LocalTime.of(20, 30), LocalTime.of(23, 0));
        abc1.setAvailableTickets(80);
        abc1.addVenue(abClub);
        eventRepository.save(abc1);
        
        Event abc2 = new Event("Experimental Night", LocalDate.of(2026, 2, 1), 
                              LocalTime.of(21, 0), LocalTime.of(23, 30));
        abc2.setAvailableTickets(100);
        abc2.addVenue(abClub);
        eventRepository.save(abc2);
        
        // BOZAR events
        Event bz1 = new Event("Classical Masterpieces", LocalDate.of(2026, 1, 20), 
                             LocalTime.of(19, 0), LocalTime.of(21, 30));
        bz1.setAvailableTickets(1500);
        bz1.addVenue(bozar);
        eventRepository.save(bz1);
        
        Event bz2 = new Event("Piano Recital: Chopin Evening", LocalDate.of(2026, 2, 22), 
                             LocalTime.of(19, 30), LocalTime.of(21, 0));
        bz2.setAvailableTickets(1200);
        bz2.addVenue(bozar);
        eventRepository.save(bz2);
        
        // ==========================================
        // Create Events - Antwerp venues
        // ==========================================
        
        // Sportpaleis events
        Event sp1 = new Event("New Year Concert", LocalDate.of(2025, 12, 31), 
                             LocalTime.of(21, 0), LocalTime.of(23, 59));
        sp1.setAvailableTickets(15000);
        sp1.addVenue(sportpaleis);
        eventRepository.save(sp1);
        
        Event sp2 = new Event("Metal Mayhem", LocalDate.of(2026, 2, 20), 
                             LocalTime.of(18, 0), LocalTime.of(23, 30));
        sp2.setAvailableTickets(12000);
        sp2.addVenue(sportpaleis);
        eventRepository.save(sp2);
        
        Event sp3 = new Event("K-Pop World Tour", LocalDate.of(2026, 3, 8), 
                             LocalTime.of(19, 0), LocalTime.of(22, 0));
        sp3.setAvailableTickets(18000);
        sp3.addVenue(sportpaleis);
        eventRepository.save(sp3);
        
        // TRIX events
        Event tr1 = new Event("Indie Rock Night", LocalDate.of(2026, 1, 22), 
                             LocalTime.of(20, 0), LocalTime.of(23, 0));
        tr1.setAvailableTickets(400);
        tr1.addVenue(trix);
        eventRepository.save(tr1);
        
        Event tr2 = new Event("Punk Revival", LocalDate.of(2026, 2, 8), 
                             LocalTime.of(20, 30), LocalTime.of(23, 30));
        tr2.setAvailableTickets(350);
        tr2.addVenue(trix);
        eventRepository.save(tr2);
        
        // Stadsschouwburg Antwerp events
        Event sa1 = new Event("Theater: Hamlet", LocalDate.of(2026, 2, 14), 
                             LocalTime.of(19, 0), LocalTime.of(22, 0));
        sa1.setAvailableTickets(350);
        sa1.addVenue(stadsschouwburg);
        eventRepository.save(sa1);
        
        Event sa2 = new Event("Ballet: Swan Lake", LocalDate.of(2026, 3, 5), 
                             LocalTime.of(19, 30), LocalTime.of(22, 30));
        sa2.setAvailableTickets(400);
        sa2.addVenue(stadsschouwburg);
        eventRepository.save(sa2);
        
        // Het Bos events
        Event hb1 = new Event("Underground Techno", LocalDate.of(2026, 1, 31), 
                             LocalTime.of(22, 0), LocalTime.of(23, 59));
        hb1.setAvailableTickets(150);
        hb1.addVenue(hetBos);
        eventRepository.save(hb1);
        
        // ==========================================
        // Create Events - Ghent venues
        // ==========================================
        
        // De Vooruit events
        Event vr1 = new Event("Jazz Night", LocalDate.of(2025, 12, 27), 
                             LocalTime.of(20, 0), LocalTime.of(23, 30));
        vr1.setAvailableTickets(150);
        vr1.addVenue(vooruit);
        eventRepository.save(vr1);
        
        Event vr2 = new Event("Folk & World Music", LocalDate.of(2026, 3, 22), 
                             LocalTime.of(19, 0), LocalTime.of(22, 30));
        vr2.setAvailableTickets(250);
        vr2.addVenue(vooruit);
        eventRepository.save(vr2);
        
        Event vr3 = new Event("Singer-Songwriter Evening", LocalDate.of(2026, 2, 15), 
                             LocalTime.of(20, 0), LocalTime.of(22, 30));
        vr3.setAvailableTickets(200);
        vr3.addVenue(vooruit);
        eventRepository.save(vr3);
        
        // Handelsbeurs events
        Event hd1 = new Event("Acoustic Sessions", LocalDate.of(2026, 1, 25), 
                             LocalTime.of(19, 0), LocalTime.of(21, 30));
        hd1.setAvailableTickets(100);
        hd1.addVenue(handelsbeurs);
        eventRepository.save(hd1);
        
        Event hd2 = new Event("World Jazz Fusion", LocalDate.of(2026, 2, 28), 
                             LocalTime.of(20, 0), LocalTime.of(23, 0));
        hd2.setAvailableTickets(180);
        hd2.addVenue(handelsbeurs);
        eventRepository.save(hd2);
        
        // NTGent events
        Event nt1 = new Event("Contemporary Dance", LocalDate.of(2026, 2, 10), 
                             LocalTime.of(19, 30), LocalTime.of(21, 30));
        nt1.setAvailableTickets(300);
        nt1.addVenue(ntGent);
        eventRepository.save(nt1);
        
        // Kinky Star events
        Event ks1 = new Event("Local Bands Showcase", LocalDate.of(2026, 1, 18), 
                             LocalTime.of(21, 0), LocalTime.of(23, 30));
        ks1.setAvailableTickets(80);
        ks1.addVenue(kinky);
        eventRepository.save(ks1);
        
        // ==========================================
        // Create Events - Leuven venues
        // ==========================================
        
        // Het Depot events
        Event dp1 = new Event("Stand-up Comedy Night", LocalDate.of(2026, 1, 10), 
                             LocalTime.of(20, 0), LocalTime.of(22, 30));
        dp1.setAvailableTickets(200);
        dp1.addVenue(hetDepot);
        eventRepository.save(dp1);
        
        Event dp2 = new Event("Alternative Rock Evening", LocalDate.of(2026, 2, 5), 
                             LocalTime.of(20, 0), LocalTime.of(23, 0));
        dp2.setAvailableTickets(250);
        dp2.addVenue(hetDepot);
        eventRepository.save(dp2);
        
        // STUK events
        Event st1 = new Event("Avant-Garde Performance", LocalDate.of(2026, 2, 18), 
                             LocalTime.of(19, 30), LocalTime.of(22, 0));
        st1.setAvailableTickets(150);
        st1.addVenue(stuk);
        eventRepository.save(st1);
        
        // Stelplaats events
        Event sl1 = new Event("Electronic Underground", LocalDate.of(2026, 1, 30), 
                             LocalTime.of(22, 0), LocalTime.of(23, 59));
        sl1.setAvailableTickets(500);
        sl1.addVenue(stelplaats);
        eventRepository.save(sl1);
        
        // ==========================================
        // Create Events - Bruges venues
        // ==========================================
        
        // Concertgebouw events
        Event cg1 = new Event("Classical Winter Concert", LocalDate.of(2026, 1, 18), 
                             LocalTime.of(19, 30), LocalTime.of(22, 0));
        cg1.setAvailableTickets(800);
        cg1.addVenue(concertgebouw);
        eventRepository.save(cg1);
        
        Event cg2 = new Event("Symphony Orchestra Gala", LocalDate.of(2026, 3, 1), 
                             LocalTime.of(19, 0), LocalTime.of(21, 30));
        cg2.setAvailableTickets(900);
        cg2.addVenue(concertgebouw);
        eventRepository.save(cg2);
        
        // Cactus Muziekcentrum events
        Event cm1 = new Event("Blues Night", LocalDate.of(2026, 2, 12), 
                             LocalTime.of(20, 0), LocalTime.of(23, 0));
        cm1.setAvailableTickets(250);
        cm1.addVenue(cactusMuziekcentrum);
        eventRepository.save(cm1);
        
        // Stadsschouwburg Bruges events
        Event sb1 = new Event("Theater: Romeo & Juliet", LocalDate.of(2026, 2, 21), 
                             LocalTime.of(19, 0), LocalTime.of(22, 0));
        sb1.setAvailableTickets(300);
        sb1.addVenue(stadsschouwburgBruges);
        eventRepository.save(sb1);
        
        // ==========================================
        // Create Events - Liège venues
        // ==========================================
        
        // Reflektor events
        Event rf1 = new Event("Hip-Hop Showcase", LocalDate.of(2026, 2, 5), 
                             LocalTime.of(21, 0), LocalTime.of(23, 59));
        rf1.setAvailableTickets(600);
        rf1.addVenue(reflektor);
        eventRepository.save(rf1);
        
        Event rf2 = new Event("Electro Beats Festival", LocalDate.of(2026, 3, 12), 
                             LocalTime.of(20, 0), LocalTime.of(23, 59));
        rf2.setAvailableTickets(800);
        rf2.addVenue(reflektor);
        eventRepository.save(rf2);
        
        // Opéra Royal events
        Event or1 = new Event("Opera: La Traviata", LocalDate.of(2026, 2, 25), 
                             LocalTime.of(19, 0), LocalTime.of(22, 30));
        or1.setAvailableTickets(500);
        or1.addVenue(operaRoyal);
        eventRepository.save(or1);
        
        Event or2 = new Event("Operetta Evening", LocalDate.of(2026, 3, 18), 
                             LocalTime.of(19, 30), LocalTime.of(22, 0));
        or2.setAvailableTickets(450);
        or2.addVenue(operaRoyal);
        eventRepository.save(or2);
        
        // La Machine events
        Event lm1 = new Event("Garage Rock Night", LocalDate.of(2026, 1, 24), 
                             LocalTime.of(21, 0), LocalTime.of(23, 30));
        lm1.setAvailableTickets(120);
        lm1.addVenue(laMachine);
        eventRepository.save(lm1);

        // ==========================================
        // Create Event Descriptions
        // ==========================================
        
        // Brussels events descriptions
        EventDescription descAb1 = new EventDescription(ab1, "Rock", 
                "The Killers, Arctic Monkeys, Foo Fighters", 
                "https://tickets.example.com/rock-festival", 
                "A spectacular rock festival featuring international artists!");
        ab1.setEventDescription(descAb1);
        
        EventDescription descAb2 = new EventDescription(ab2, "Electronic/DJ", 
                "Lost Frequencies, Netsky, Charlotte de Witte", 
                "https://tickets.example.com/belgian-dj", 
                "Belgium's world-famous DJs unite for one epic night!");
        ab2.setEventDescription(descAb2);
        
        EventDescription descAb3 = new EventDescription(ab3, "Indie Rock", 
                "Balthazar, Bazart, Warhaus", 
                "https://tickets.example.com/indie", 
                "Belgian indie rock at its finest!");
        ab3.setEventDescription(descAb3);
        
        EventDescription descFn1 = new EventDescription(fn1, "Pop", 
                "Ed Sheeran, Dua Lipa, The Weeknd", 
                "https://tickets.example.com/pop-giants", 
                "The biggest pop stars on one stage!");
        fn1.setEventDescription(descFn1);
        
        EventDescription descFn2 = new EventDescription(fn2, "Comedy", 
                "Various Belgian & International Comedians", 
                "https://tickets.example.com/comedy-gala", 
                "A night of laughter with top comedians!");
        fn2.setEventDescription(descFn2);
        
        EventDescription descBe1 = new EventDescription(be1, "Electronic/EDM", 
                "Calvin Harris, David Guetta, Martin Garrix", 
                "https://tickets.example.com/edm-fest", 
                "The biggest electronic music festival of the year!");
        be1.setEventDescription(descBe1);
        
        EventDescription descBe2 = new EventDescription(be2, "Multi-Genre", 
                "Various International Artists", 
                "https://tickets.example.com/spring-fest", 
                "A multi-stage festival celebrating spring!");
        be2.setEventDescription(descBe2);
        
        EventDescription descAbc1 = new EventDescription(abc1, "Jazz", 
                "Toots Thielemans Tribute", 
                "https://tickets.example.com/jazz-intimate", 
                "A tribute to the legendary Belgian jazz musician.");
        abc1.setEventDescription(descAbc1);
        
        EventDescription descAbc2 = new EventDescription(abc2, "Experimental", 
                "Various Experimental Artists", 
                "https://tickets.example.com/experimental", 
                "Pushing the boundaries of sound and music.");
        abc2.setEventDescription(descAbc2);
        
        EventDescription descBz1 = new EventDescription(bz1, "Classical", 
                "Brussels Philharmonic", 
                "https://tickets.example.com/classical", 
                "Experience the grandeur of classical music.");
        bz1.setEventDescription(descBz1);
        
        EventDescription descBz2 = new EventDescription(bz2, "Classical", 
                "Yuja Wang", 
                "https://tickets.example.com/chopin", 
                "An evening dedicated to Chopin's masterpieces.");
        bz2.setEventDescription(descBz2);
        
        // Antwerp events descriptions
        EventDescription descSp1 = new EventDescription(sp1, "Classical", 
                "Vienna Philharmonic Orchestra", 
                "https://tickets.example.com/new-year", 
                "Ring in the New Year with classical masterpieces!");
        sp1.setEventDescription(descSp1);
        
        EventDescription descSp2 = new EventDescription(sp2, "Metal", 
                "Amenra, Brutus, Stake", 
                "https://tickets.example.com/metal", 
                "Heavy metal night featuring Belgian metal legends!");
        sp2.setEventDescription(descSp2);
        
        EventDescription descSp3 = new EventDescription(sp3, "K-Pop", 
                "BTS, BLACKPINK, Stray Kids", 
                "https://tickets.example.com/kpop", 
                "K-Pop sensation takes over Belgium!");
        sp3.setEventDescription(descSp3);
        
        EventDescription descTr1 = new EventDescription(tr1, "Indie Rock", 
                "Fontaines D.C., Yard Act, Wet Leg", 
                "https://tickets.example.com/indie-night", 
                "The best of indie rock from UK and Ireland!");
        tr1.setEventDescription(descTr1);
        
        EventDescription descTr2 = new EventDescription(tr2, "Punk", 
                "IDLES, Amyl and The Sniffers", 
                "https://tickets.example.com/punk", 
                "Punk is not dead - experience the revival!");
        tr2.setEventDescription(descTr2);
        
        EventDescription descSa1 = new EventDescription(sa1, "Theater", 
                "National Theater Company", 
                "https://tickets.example.com/hamlet", 
                "Shakespeare's masterpiece performed by Belgium's finest actors.");
        sa1.setEventDescription(descSa1);
        
        EventDescription descSa2 = new EventDescription(sa2, "Ballet", 
                "Royal Ballet of Flanders", 
                "https://tickets.example.com/swan-lake", 
                "The timeless classic performed by world-class dancers.");
        sa2.setEventDescription(descSa2);
        
        EventDescription descHb1 = new EventDescription(hb1, "Electronic", 
                "Underground DJs", 
                "https://tickets.example.com/techno", 
                "Deep underground techno in an intimate setting.");
        hb1.setEventDescription(descHb1);
        
        // Ghent events descriptions
        EventDescription descVr1 = new EventDescription(vr1, "Jazz", 
                "John Coltrane Tribute Band", 
                "https://tickets.example.com/jazz-night", 
                "An intimate evening of smooth jazz.");
        vr1.setEventDescription(descVr1);
        
        EventDescription descVr2 = new EventDescription(vr2, "Folk/World", 
                "Ghent Folk Orchestra", 
                "https://tickets.example.com/folk-world", 
                "A journey through world music and traditional folk.");
        vr2.setEventDescription(descVr2);
        
        EventDescription descVr3 = new EventDescription(vr3, "Acoustic", 
                "Tamino, Oscar and the Wolf", 
                "https://tickets.example.com/singer-songwriter", 
                "Belgian singer-songwriters unplugged.");
        vr3.setEventDescription(descVr3);
        
        EventDescription descHd1 = new EventDescription(hd1, "Acoustic", 
                "Various Local Artists", 
                "https://tickets.example.com/acoustic", 
                "Intimate acoustic performances in a cozy setting.");
        hd1.setEventDescription(descHd1);
        
        EventDescription descHd2 = new EventDescription(hd2, "Jazz", 
                "Snarky Puppy", 
                "https://tickets.example.com/world-jazz", 
                "Jazz fusion at its finest with Grammy winners.");
        hd2.setEventDescription(descHd2);
        
        EventDescription descNt1 = new EventDescription(nt1, "Dance", 
                "Peeping Tom", 
                "https://tickets.example.com/dance", 
                "Boundary-pushing contemporary dance.");
        nt1.setEventDescription(descNt1);
        
        EventDescription descKs1 = new EventDescription(ks1, "Rock", 
                "Local Ghent Bands", 
                "https://tickets.example.com/local-bands", 
                "Discover the next big thing from Ghent's underground!");
        ks1.setEventDescription(descKs1);
        
        // Leuven events descriptions
        EventDescription descDp1 = new EventDescription(dp1, "Comedy", 
                "Local Belgian Comedians", 
                "https://tickets.example.com/comedy", 
                "A night of laughter with Belgium's finest!");
        dp1.setEventDescription(descDp1);
        
        EventDescription descDp2 = new EventDescription(dp2, "Alternative Rock", 
                "Deus, Triggerfinger", 
                "https://tickets.example.com/alt-rock", 
                "Belgian alternative rock legends!");
        dp2.setEventDescription(descDp2);
        
        EventDescription descSt1 = new EventDescription(st1, "Avant-Garde", 
                "Various Performance Artists", 
                "https://tickets.example.com/avant-garde", 
                "Experimental arts and performance.");
        st1.setEventDescription(descSt1);
        
        EventDescription descSl1 = new EventDescription(sl1, "Electronic", 
                "Amelie Lens, Charlotte de Witte", 
                "https://tickets.example.com/electronic", 
                "Belgium's techno queens take over!");
        sl1.setEventDescription(descSl1);
        
        // Bruges events descriptions
        EventDescription descCg1 = new EventDescription(cg1, "Classical", 
                "Brussels Philharmonic", 
                "https://tickets.example.com/winter-classical", 
                "Beautiful winter melodies in the stunning Concertgebouw.");
        cg1.setEventDescription(descCg1);
        
        EventDescription descCg2 = new EventDescription(cg2, "Classical", 
                "London Symphony Orchestra", 
                "https://tickets.example.com/symphony-gala", 
                "A spectacular evening of symphonic grandeur.");
        cg2.setEventDescription(descCg2);
        
        EventDescription descCm1 = new EventDescription(cm1, "Blues", 
                "Joe Bonamassa, Walter Trout", 
                "https://tickets.example.com/blues", 
                "The blues legends live in Bruges!");
        cm1.setEventDescription(descCm1);
        
        EventDescription descSb1 = new EventDescription(sb1, "Theater", 
                "Bruges Theater Company", 
                "https://tickets.example.com/romeo-juliet", 
                "Shakespeare's romantic tragedy comes to life.");
        sb1.setEventDescription(descSb1);
        
        // Liège events descriptions
        EventDescription descRf1 = new EventDescription(rf1, "Hip-Hop", 
                "Roméo Elvis, Damso, Angèle", 
                "https://tickets.example.com/hiphop", 
                "Belgian hip-hop and urban music showcase!");
        rf1.setEventDescription(descRf1);
        
        EventDescription descRf2 = new EventDescription(rf2, "Electronic", 
                "Various Belgian DJs", 
                "https://tickets.example.com/electro-beats", 
                "Non-stop electronic beats all night long!");
        rf2.setEventDescription(descRf2);
        
        EventDescription descOr1 = new EventDescription(or1, "Opera", 
                "Opéra Royal de Wallonie", 
                "https://tickets.example.com/la-traviata", 
                "Verdi's masterpiece in all its glory.");
        or1.setEventDescription(descOr1);
        
        EventDescription descOr2 = new EventDescription(or2, "Operetta", 
                "Opéra Royal de Wallonie", 
                "https://tickets.example.com/operetta", 
                "Light-hearted operatic entertainment.");
        or2.setEventDescription(descOr2);
        
        EventDescription descLm1 = new EventDescription(lm1, "Rock", 
                "Local Liège Rock Bands", 
                "https://tickets.example.com/garage-rock", 
                "Raw garage rock energy!");
        lm1.setEventDescription(descLm1);

        // Save all event descriptions
        eventDescriptionRepository.saveAll(Arrays.asList(
                descAb1, descAb2, descAb3, descFn1, descFn2, descBe1, descBe2, descAbc1, descAbc2, descBz1, descBz2,
                descSp1, descSp2, descSp3, descTr1, descTr2, descSa1, descSa2, descHb1,
                descVr1, descVr2, descVr3, descHd1, descHd2, descNt1, descKs1,
                descDp1, descDp2, descSt1, descSl1,
                descCg1, descCg2, descCm1, descSb1,
                descRf1, descRf2, descOr1, descOr2, descLm1
        ));

        // Save all events
        eventRepository.saveAll(Arrays.asList(
                ab1, ab2, ab3, fn1, fn2, be1, be2, abc1, abc2, bz1, bz2,
                sp1, sp2, sp3, tr1, tr2, sa1, sa2, hb1,
                vr1, vr2, vr3, hd1, hd2, nt1, ks1,
                dp1, dp2, st1, sl1,
                cg1, cg2, cm1, sb1,
                rf1, rf2, or1, or2, lm1
        ));

        log.info("Database initialized with seed data: {} cities, {} users, {} venues, {} events",
                cityRepository.count(), userRepository.count(),
                venueRepository.count(), eventRepository.count());
    }
}
