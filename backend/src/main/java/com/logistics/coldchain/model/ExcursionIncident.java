package com.logistics.coldchain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "excursion_incidents")
public class ExcursionIncident {
    @Id
    private String id;
    private String reeferId;
    private String client;
    private String cargoLot;
    private String thermalPeak;
    private String thermalVariance;
    private String duration;
    private String resolutionVerdict;
    private String statusStyle;
    private String claimValue;
    private String penaltyValue;
    @Column(columnDefinition="TEXT")
    private String notes;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getReeferId() { return reeferId; }
    public void setReeferId(String reeferId) { this.reeferId = reeferId; }
    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }
    public String getCargoLot() { return cargoLot; }
    public void setCargoLot(String cargoLot) { this.cargoLot = cargoLot; }
    public String getThermalPeak() { return thermalPeak; }
    public void setThermalPeak(String thermalPeak) { this.thermalPeak = thermalPeak; }
    public String getThermalVariance() { return thermalVariance; }
    public void setThermalVariance(String thermalVariance) { this.thermalVariance = thermalVariance; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getResolutionVerdict() { return resolutionVerdict; }
    public void setResolutionVerdict(String resolutionVerdict) { this.resolutionVerdict = resolutionVerdict; }
    public String getStatusStyle() { return statusStyle; }
    public void setStatusStyle(String statusStyle) { this.statusStyle = statusStyle; }
    public String getClaimValue() { return claimValue; }
    public void setClaimValue(String claimValue) { this.claimValue = claimValue; }
    public String getPenaltyValue() { return penaltyValue; }
    public void setPenaltyValue(String penaltyValue) { this.penaltyValue = penaltyValue; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
