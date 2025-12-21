package be.ucll.fs.project.unit.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "event_descriptions")
public class EventDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "description_id")
    private Long descriptionId;

    @NotNull(message = "Event is required")
    @OneToOne
    @JoinColumn(name = "event_id", nullable = false, unique = true)
    @JsonBackReference
    private Event event;

    @Column(name = "event_type", length = 100)
    private String eventType;

    @Column(name = "featured_artists", columnDefinition = "TEXT")
    private String featuredArtists;

    @Column(name = "ticket_purchase_link", columnDefinition = "TEXT")
    private String ticketPurchaseLink;

    @Column(name = "extra_description", columnDefinition = "TEXT")
    private String extraDescription;

    public EventDescription() {
    }

    public EventDescription(Event event, String eventType, String featuredArtists, 
                          String ticketPurchaseLink, String extraDescription) {
        this.event = event;
        this.eventType = eventType;
        this.featuredArtists = featuredArtists;
        this.ticketPurchaseLink = ticketPurchaseLink;
        this.extraDescription = extraDescription;
    }

    // Getters and Setters
    public Long getDescriptionId() {
        return descriptionId;
    }

    public void setDescriptionId(Long descriptionId) {
        this.descriptionId = descriptionId;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getFeaturedArtists() {
        return featuredArtists;
    }

    public void setFeaturedArtists(String featuredArtists) {
        this.featuredArtists = featuredArtists;
    }

    public String getTicketPurchaseLink() {
        return ticketPurchaseLink;
    }

    public void setTicketPurchaseLink(String ticketPurchaseLink) {
        this.ticketPurchaseLink = ticketPurchaseLink;
    }

    public String getExtraDescription() {
        return extraDescription;
    }

    public void setExtraDescription(String extraDescription) {
        this.extraDescription = extraDescription;
    }
}
