import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Import initial mock data and types
import { REEFER_UNITS, EXCURSION_INCIDENTS, CUSTOMER_INVOICES, VENDOR_BILLS, JOURNAL_ENTRIES } from './src/data/mockData.js';
import { ReeferUnit, ExcursionIncident, CustomerInvoice, VendorBill, JournalEntry } from './src/types.js';

dotenv.config();

const app = express();
app.use(express.json());

// In-memory data store
let reefers: ReeferUnit[] = [...REEFER_UNITS];
let incidents: ExcursionIncident[] = [...EXCURSION_INCIDENTS];
let invoices: CustomerInvoice[] = [...CUSTOMER_INVOICES];
let bills: VendorBill[] = [...VENDOR_BILLS];
let journals: JournalEntry[] = [...JOURNAL_ENTRIES];

// 1. Create Master Data: Register reefer container
app.post('/api/reefers', (req, res) => {
  const newReefer: ReeferUnit = {
    id: `#RC-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body
  };
  reefers.push(newReefer);
  res.status(201).json(newReefer);
});

// GET all reefers
app.get('/api/reefers', (req, res) => {
  res.json(reefers);
});

// 2. Monitor Telemetry: Post readings
app.post('/api/reefers/:id/telemetry', (req, res) => {
  const { id } = req.params;
  const { temp } = req.body;
  
  const reeferIndex = reefers.findIndex(r => r.id === id || r.id.includes(id));
  if (reeferIndex === -1) {
    return res.status(404).json({ error: 'Reefer not found' });
  }

  const reefer = reefers[reeferIndex];
  reefer.temp = temp;
  
  // Shift sparkline data
  reefer.sparklineData.shift();
  reefer.sparklineData.push(temp);

  // Check Excursion Limit (> -15°C for standard ultra-cold target -20°C, wait requirement says > -15°C)
  if (temp > -15.0) {
    reefer.status = 'critical';
    reefer.statusLabel = 'CRITICAL EXCURSION';
    reefer.statusDetail = 'BREACH ACTIVE';
    
    // Auto-flag and log compliance claim
    const incidentExists = incidents.find(i => i.reeferId.includes(reefer.id));
    if (!incidentExists) {
      const newIncident: ExcursionIncident = {
        id: `#EXC-${Math.floor(1000 + Math.random() * 9000)}`,
        reeferId: `Unit: ${reefer.id.replace('#', '')}`,
        client: 'Unknown Client',
        cargoLot: reefer.cargo,
        thermalPeak: `${temp.toFixed(1)}°C`,
        thermalVariance: `+${(temp - -15.0).toFixed(1)}°C above -15°C`,
        duration: '1 min',
        resolutionVerdict: 'UNDER TECH REVIEW',
        statusStyle: 'error',
        claimValue: '$10,000',
        penaltyValue: 'Penalty: $2,500',
        notes: 'Automated excursion flagged by telemetry system.'
      };
      incidents.unshift(newIncident);
    }
  } else if (temp > -18.0) {
    reefer.status = 'warning';
    reefer.statusLabel = 'THAW WARN';
  } else {
    reefer.status = 'optimal';
    reefer.statusLabel = 'OPTIMAL';
  }

  res.json(reefer);
});

// GET all incidents
app.get('/api/incidents', (req, res) => {
  res.json(incidents);
});

// GET all invoices
app.get('/api/invoices', (req, res) => {
  res.json(invoices);
});

// GET all bills
app.get('/api/bills', (req, res) => {
  res.json(bills);
});

// GET all journal entries
app.get('/api/journals', (req, res) => {
  res.json(journals);
});

// 3. Process Invoicing: Convert freight order to Customer Invoice
app.post('/api/invoices', (req, res) => {
  const { client, orderRef, grossFreight, corridor, incidentRef } = req.body;
  
  const gxpDeductions = incidentRef ? -4500 : 0; 
  const netPayable = grossFreight + gxpDeductions;

  const invoice: CustomerInvoice = {
    id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    client,
    corridor,
    corridorIcon: 'alt_route',
    orderRef,
    grossFreight,
    gxpDeductions,
    incidentRef,
    netPayable,
    paymentStatus: 'pending',
    paymentStatusLabel: 'Pending Approval'
  };
  
  invoices.unshift(invoice);
  
  // Log Journal Entry
  const je: JournalEntry = {
    id: `JE-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `Pharma Sales Order ${orderRef} Completion`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    autoPosted: true,
    note: 'Automated generation upon cold-chain delivery confirmation.',
    lines: [
      {
        accountCode: '1100',
        accountTitle: 'Accounts Receivable',
        entityRef: client,
        debit: netPayable,
      },
      ...(gxpDeductions < 0 ? [{
        accountCode: '5420',
        accountTitle: 'Temp Compliance Penalty Expense',
        entityRef: incidentRef,
        debit: Math.abs(gxpDeductions),
        highlight: true
      }] : []),
      {
        accountCode: '4000',
        accountTitle: 'Freight Service Revenue',
        entityRef: `Gross Manifest ${orderRef}`,
        credit: grossFreight,
      }
    ],
    totalCheck: grossFreight
  };
  journals.unshift(je);
  
  res.status(201).json({ invoice, journal: je });
});

// Process Bills / Settlement
app.post('/api/bills/settle', (req, res) => {
  const { billId } = req.body;
  const billIndex = bills.findIndex(b => b.id === billId);
  
  if (billIndex === -1) {
    return res.status(404).json({ error: 'Bill not found' });
  }
  
  bills[billIndex].paid = true;
  bills[billIndex].status = 'Disbursed via Bank';
  
  // Add Journal Entry for payment
  const je: JournalEntry = {
    id: `JE-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `Payment for ${bills[billIndex].description}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    autoPosted: true,
    note: 'Bank disbursement.',
    lines: [
      {
        accountCode: '2000',
        accountTitle: 'Accounts Payable',
        entityRef: bills[billIndex].vendorName,
        debit: bills[billIndex].amount,
      },
      {
        accountCode: '1010',
        accountTitle: 'Bank Operating Master Account',
        entityRef: 'JPMorgan Chase',
        credit: bills[billIndex].amount,
      }
    ],
    totalCheck: bills[billIndex].amount
  };
  journals.unshift(je);
  
  res.json({ bill: bills[billIndex], journal: je });
});

// 4. Generate Reports
app.get('/api/reports/budget', (req, res) => {
  res.json({
    corridor: 'North-South Vaccine Route',
    allocated: 150000,
    spent: bills.reduce((acc, b) => acc + (b.paid ? b.amount : 0), 0),
    variance: 150000 - bills.reduce((acc, b) => acc + (b.paid ? b.amount : 0), 0)
  });
});

app.get('/api/reports/pnl', (req, res) => {
  const revenue = invoices.reduce((acc, inv) => acc + inv.grossFreight, 0);
  const deductions = invoices.reduce((acc, inv) => acc + Math.abs(inv.gxpDeductions), 0);
  const maintenance = bills.reduce((acc, b) => acc + b.amount, 0);
  
  res.json({
    revenue,
    compliancePenalties: deductions,
    maintenanceCosts: maintenance,
    netProfit: revenue - deductions - maintenance
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Cold-Chain Logistics API running on http://localhost:${PORT}`);
});
