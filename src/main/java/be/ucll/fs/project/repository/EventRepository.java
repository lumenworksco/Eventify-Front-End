package be.ucll.fs.project.repository;

import be.ucll.fs.project.unit.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    Optional<Event> findByTitle(String title);
    
    List<Event> findByEventDate(LocalDate eventDate);
    
    List<Event> findByEventDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT DISTINCT e FROM Event e LEFT JOIN FETCH e.venues v WHERE v.city.cityId = :cityId")
    List<Event> findEventsByCityId(@Param("cityId") Long cityId);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate >= :date ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(@Param("date") LocalDate date);
    
    @Query("SELECT e FROM Event e JOIN e.eventDescription ed WHERE LOWER(ed.eventType) = LOWER(:eventType)")
    List<Event> findByEventType(@Param("eventType") String eventType);
    
    @Query("SELECT DISTINCT ed.eventType FROM EventDescription ed WHERE ed.eventType IS NOT NULL ORDER BY ed.eventType")
    List<String> findAllEventTypes();
}
