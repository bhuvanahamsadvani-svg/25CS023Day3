package com.logistics.coldchain.controller;

import com.logistics.coldchain.model.*;
import com.logistics.coldchain.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For development with Vite
public class LogisticsController {

    @Autowired private ReeferRepository reeferRepo;
    @Autowired private ExcursionIncidentRepository incidentRepo;
    @Autowired private CustomerInvoiceRepository invoiceRepo;
    @Autowired private VendorBillRepository billRepo;
    @Autowired private JournalEntryRepository journalRepo;

    // --- REEFERS ---
    @GetMapping("/reefers")
    public List<Reefer> getAllReefers() {
        return reeferRepo.findAll();
    }

    @PostMapping("/reefers")
    public ResponseEntity<Reefer> createReefer(@RequestBody Reefer reefer) {
        reefer.setId("#RC-" + (1000 + new Random().nextInt(9000)));
        return new ResponseEntity<>(reeferRepo.save(reefer), HttpStatus.CREATED);
    }

    @PostMapping("/reefers/{id}/telemetry")
    public ResponseEntity<?> updateTelemetry(@PathVariable String id, @RequestBody Map<String, Object> payload) {
        Optional<Reefer> opt = reeferRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Reefer reefer = opt.get();
        BigDecimal temp = new BigDecimal(payload.get("temp").toString());
        reefer.setTemp(temp);
        
        // Threshold check (> -15.0)
        if (temp.compareTo(new BigDecimal("-15.0")) > 0) {
            reefer.setStatus("critical");
            reefer.setStatusLabel("CRITICAL EXCURSION");
            reefer.setStatusDetail("BREACH ACTIVE");
            
            // Auto-flag compliance claim
            List<ExcursionIncident> existing = incidentRepo.findAll(); // Should query by reeferId, simplified for now
            boolean found = existing.stream().anyMatch(i -> i.getReeferId().equals(reefer.getId()));
            
            if (!found) {
                ExcursionIncident inc = new ExcursionIncident();
                inc.setId("#EXC-" + (1000 + new Random().nextInt(9000)));
                inc.setReeferId(reefer.getId());
                inc.setClient("Unknown Client");
                inc.setCargoLot(reefer.getCargo());
                inc.setThermalPeak(temp.toString() + "°C");
                inc.setThermalVariance("+" + temp.subtract(new BigDecimal("-15.0")).toString() + "°C above -15°C");
                inc.setDuration("1 min");
                inc.setResolutionVerdict("UNDER TECH REVIEW");
                inc.setStatusStyle("error");
                inc.setClaimValue("$10,000");
                inc.setPenaltyValue("Penalty: $2,500");
                inc.setNotes("Automated excursion flagged by telemetry system.");
                incidentRepo.save(inc);
            }
        } else if (temp.compareTo(new BigDecimal("-18.0")) > 0) {
            reefer.setStatus("warning");
            reefer.setStatusLabel("THAW WARN");
        } else {
            reefer.setStatus("optimal");
            reefer.setStatusLabel("OPTIMAL");
        }
        
        return ResponseEntity.ok(reeferRepo.save(reefer));
    }

    // --- INCIDENTS ---
    @GetMapping("/incidents")
    public List<ExcursionIncident> getAllIncidents() {
        return incidentRepo.findAll();
    }

    // --- INVOICES ---
    @GetMapping("/invoices")
    public List<CustomerInvoice> getAllInvoices() {
        return invoiceRepo.findAll();
    }

    @PostMapping("/invoices")
    public ResponseEntity<?> createInvoice(@RequestBody Map<String, Object> payload) {
        String client = (String) payload.get("client");
        String orderRef = (String) payload.get("orderRef");
        BigDecimal grossFreight = new BigDecimal(payload.get("grossFreight").toString());
        String corridor = (String) payload.get("corridor");
        String incidentRef = (String) payload.get("incidentRef");
        
        BigDecimal gxpDeductions = incidentRef != null ? new BigDecimal("-4500") : BigDecimal.ZERO;
        BigDecimal netPayable = grossFreight.add(gxpDeductions);
        
        CustomerInvoice invoice = new CustomerInvoice();
        invoice.setId("INV-2026-" + (1000 + new Random().nextInt(9000)));
        invoice.setDate(LocalDate.now());
        invoice.setClient(client);
        invoice.setCorridor(corridor);
        invoice.setCorridorIcon("alt_route");
        invoice.setOrderRef(orderRef);
        invoice.setGrossFreight(grossFreight);
        invoice.setGxpDeductions(gxpDeductions);
        invoice.setIncidentRef(incidentRef);
        invoice.setNetPayable(netPayable);
        invoice.setPaymentStatus("pending");
        invoice.setPaymentStatusLabel("Pending Approval");
        invoiceRepo.save(invoice);
        
        // Journal Entry
        JournalEntry je = new JournalEntry();
        je.setId("JE-" + (1000 + new Random().nextInt(9000)));
        je.setTitle("Pharma Sales Order " + orderRef + " Completion");
        je.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) + " UTC");
        je.setAutoPosted(true);
        je.setNote("Automated generation upon cold-chain delivery confirmation.");
        je.setTotalCheck(grossFreight);
        
        List<JournalEntryLine> lines = new ArrayList<>();
        
        JournalEntryLine l1 = new JournalEntryLine();
        l1.setJournalEntry(je);
        l1.setAccountCode("1100");
        l1.setAccountTitle("Accounts Receivable");
        l1.setEntityRef(client);
        l1.setDebit(netPayable);
        lines.add(l1);
        
        if (gxpDeductions.compareTo(BigDecimal.ZERO) < 0) {
            JournalEntryLine l2 = new JournalEntryLine();
            l2.setJournalEntry(je);
            l2.setAccountCode("5420");
            l2.setAccountTitle("Temp Compliance Penalty Expense");
            l2.setEntityRef(incidentRef);
            l2.setDebit(gxpDeductions.abs());
            l2.setHighlight(true);
            lines.add(l2);
        }
        
        JournalEntryLine l3 = new JournalEntryLine();
        l3.setJournalEntry(je);
        l3.setAccountCode("4000");
        l3.setAccountTitle("Freight Service Revenue");
        l3.setEntityRef("Gross Manifest " + orderRef);
        l3.setCredit(grossFreight);
        lines.add(l3);
        
        je.setLines(lines);
        journalRepo.save(je);
        
        Map<String, Object> res = new HashMap<>();
        res.put("invoice", invoice);
        res.put("journal", je);
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    // --- BILLS ---
    @GetMapping("/bills")
    public List<VendorBill> getAllBills() {
        return billRepo.findAll();
    }

    @PostMapping("/bills/settle")
    public ResponseEntity<?> settleBill(@RequestBody Map<String, Object> payload) {
        String billId = (String) payload.get("billId");
        Optional<VendorBill> opt = billRepo.findById(billId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        VendorBill bill = opt.get();
        bill.setPaid(true);
        bill.setStatus("Disbursed via Bank");
        billRepo.save(bill);
        
        JournalEntry je = new JournalEntry();
        je.setId("JE-" + (1000 + new Random().nextInt(9000)));
        je.setTitle("Payment for " + bill.getDescription());
        je.setDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) + " UTC");
        je.setAutoPosted(true);
        je.setNote("Bank disbursement.");
        je.setTotalCheck(bill.getAmount());
        
        List<JournalEntryLine> lines = new ArrayList<>();
        
        JournalEntryLine l1 = new JournalEntryLine();
        l1.setJournalEntry(je);
        l1.setAccountCode("2000");
        l1.setAccountTitle("Accounts Payable");
        l1.setEntityRef(bill.getVendorName());
        l1.setDebit(bill.getAmount());
        lines.add(l1);
        
        JournalEntryLine l2 = new JournalEntryLine();
        l2.setJournalEntry(je);
        l2.setAccountCode("1010");
        l2.setAccountTitle("Bank Operating Master Account");
        l2.setEntityRef("JPMorgan Chase");
        l2.setCredit(bill.getAmount());
        lines.add(l2);
        
        je.setLines(lines);
        journalRepo.save(je);
        
        Map<String, Object> res = new HashMap<>();
        res.put("bill", bill);
        res.put("journal", je);
        return ResponseEntity.ok(res);
    }

    // --- JOURNALS ---
    @GetMapping("/journals")
    public List<JournalEntry> getAllJournals() {
        return journalRepo.findAll();
    }
}
