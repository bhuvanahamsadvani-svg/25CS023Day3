package com.logistics.coldchain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "journal_entries")
public class JournalEntry {
    @Id
    private String id;
    private String title;
    private String date;
    private Boolean autoPosted;
    private String note;
    private BigDecimal totalCheck;

    @OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<JournalEntryLine> lines;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public Boolean getAutoPosted() { return autoPosted; }
    public void setAutoPosted(Boolean autoPosted) { this.autoPosted = autoPosted; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public BigDecimal getTotalCheck() { return totalCheck; }
    public void setTotalCheck(BigDecimal totalCheck) { this.totalCheck = totalCheck; }
    public List<JournalEntryLine> getLines() { return lines; }
    public void setLines(List<JournalEntryLine> lines) { this.lines = lines; }
}
