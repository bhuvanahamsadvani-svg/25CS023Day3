package com.logistics.coldchain.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "reefers")
public class Reefer {
    @Id
    private String id;
    private String name;
    private String carrier;
    private String rigId;
    private String status;
    private String statusLabel;
    private BigDecimal temp;
    private BigDecimal targetTemp;
    private BigDecimal tolerance;
    private String cargo;
    private String doorStatus;
    private String corridor;
    private String statusDetail;
    private String trajectoryText;
    private String trajectoryTrend;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private Map<String, Object> specs;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<Object> sparklineData;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }
    public String getRigId() { return rigId; }
    public void setRigId(String rigId) { this.rigId = rigId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStatusLabel() { return statusLabel; }
    public void setStatusLabel(String statusLabel) { this.statusLabel = statusLabel; }
    public BigDecimal getTemp() { return temp; }
    public void setTemp(BigDecimal temp) { this.temp = temp; }
    public BigDecimal getTargetTemp() { return targetTemp; }
    public void setTargetTemp(BigDecimal targetTemp) { this.targetTemp = targetTemp; }
    public BigDecimal getTolerance() { return tolerance; }
    public void setTolerance(BigDecimal tolerance) { this.tolerance = tolerance; }
    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }
    public String getDoorStatus() { return doorStatus; }
    public void setDoorStatus(String doorStatus) { this.doorStatus = doorStatus; }
    public String getCorridor() { return corridor; }
    public void setCorridor(String corridor) { this.corridor = corridor; }
    public String getStatusDetail() { return statusDetail; }
    public void setStatusDetail(String statusDetail) { this.statusDetail = statusDetail; }
    public String getTrajectoryText() { return trajectoryText; }
    public void setTrajectoryText(String trajectoryText) { this.trajectoryText = trajectoryText; }
    public String getTrajectoryTrend() { return trajectoryTrend; }
    public void setTrajectoryTrend(String trajectoryTrend) { this.trajectoryTrend = trajectoryTrend; }
    public Map<String, Object> getSpecs() { return specs; }
    public void setSpecs(Map<String, Object> specs) { this.specs = specs; }
    public List<Object> getSparklineData() { return sparklineData; }
    public void setSparklineData(List<Object> sparklineData) { this.sparklineData = sparklineData; }
}
