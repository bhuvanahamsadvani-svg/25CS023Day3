package com.logistics.coldchain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vendor_bills")
public class VendorBill {
    @Id
    private String id;
    private String vendorName;
    private String vendorId;
    private BigDecimal amount;
    private String status;
    private String description;
    private String purchaseOrder;
    private String disbursementLedger;
    private String warrantyToken;
    private String terms;
    private String targetAsset;
    private String serviceLocation;
    private Boolean paid;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
    public String getVendorId() { return vendorId; }
    public void setVendorId(String vendorId) { this.vendorId = vendorId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPurchaseOrder() { return purchaseOrder; }
    public void setPurchaseOrder(String purchaseOrder) { this.purchaseOrder = purchaseOrder; }
    public String getDisbursementLedger() { return disbursementLedger; }
    public void setDisbursementLedger(String disbursementLedger) { this.disbursementLedger = disbursementLedger; }
    public String getWarrantyToken() { return warrantyToken; }
    public void setWarrantyToken(String warrantyToken) { this.warrantyToken = warrantyToken; }
    public String getTerms() { return terms; }
    public void setTerms(String terms) { this.terms = terms; }
    public String getTargetAsset() { return targetAsset; }
    public void setTargetAsset(String targetAsset) { this.targetAsset = targetAsset; }
    public String getServiceLocation() { return serviceLocation; }
    public void setServiceLocation(String serviceLocation) { this.serviceLocation = serviceLocation; }
    public Boolean getPaid() { return paid; }
    public void setPaid(Boolean paid) { this.paid = paid; }
}
