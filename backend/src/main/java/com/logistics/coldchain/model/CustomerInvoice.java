package com.logistics.coldchain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "customer_invoices")
public class CustomerInvoice {
    @Id
    private String id;
    private LocalDate date;
    private String client;
    private String corridor;
    private String corridorIcon;
    private String orderRef;
    private BigDecimal grossFreight;
    private BigDecimal gxpDeductions;
    private String incidentRef;
    private BigDecimal netPayable;
    private String paymentStatus;
    private String paymentStatusLabel;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }
    public String getCorridor() { return corridor; }
    public void setCorridor(String corridor) { this.corridor = corridor; }
    public String getCorridorIcon() { return corridorIcon; }
    public void setCorridorIcon(String corridorIcon) { this.corridorIcon = corridorIcon; }
    public String getOrderRef() { return orderRef; }
    public void setOrderRef(String orderRef) { this.orderRef = orderRef; }
    public BigDecimal getGrossFreight() { return grossFreight; }
    public void setGrossFreight(BigDecimal grossFreight) { this.grossFreight = grossFreight; }
    public BigDecimal getGxpDeductions() { return gxpDeductions; }
    public void setGxpDeductions(BigDecimal gxpDeductions) { this.gxpDeductions = gxpDeductions; }
    public String getIncidentRef() { return incidentRef; }
    public void setIncidentRef(String incidentRef) { this.incidentRef = incidentRef; }
    public BigDecimal getNetPayable() { return netPayable; }
    public void setNetPayable(BigDecimal netPayable) { this.netPayable = netPayable; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getPaymentStatusLabel() { return paymentStatusLabel; }
    public void setPaymentStatusLabel(String paymentStatusLabel) { this.paymentStatusLabel = paymentStatusLabel; }
}
