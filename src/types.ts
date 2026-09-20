export type NavTab = 
  | 'fleet-telemetry'
  | 'compliance-and-audits'
  | 'financial-ledger-and-billing'
  | 'corridor-budgets-and-p-and-l';

export interface ReeferUnit {
  id: string;
  name: string;
  carrier: string;
  rigId?: string;
  status: 'critical' | 'optimal' | 'warning' | 'ultracold';
  statusLabel: string;
  temp: number;
  targetTemp: number;
  tolerance: number;
  cargo: string;
  doorStatus: 'SEALED' | 'UNSEALED';
  specs: {
    compressorOrBattery?: string;
    rh?: string;
    pumpLoad?: string;
    eta?: string;
    ln2Pressure?: string;
    dryIceLevel?: string;
    airSeal?: string;
    defrostStatus?: string;
  };
  corridor: string;
  statusDetail: string;
  sparklineData: number[];
  trajectoryText: string;
  trajectoryTrend: 'up' | 'stable' | 'down';
}

export interface ExcursionIncident {
  id: string;
  reeferId: string;
  client: string;
  cargoLot: string;
  thermalPeak: string;
  thermalVariance: string;
  duration: string;
  resolutionVerdict: string;
  statusStyle: 'error' | 'surface' | 'neutral';
  claimValue: string;
  penaltyValue: string;
  notes: string;
}

export interface CustomerInvoice {
  id: string;
  date: string;
  client: string;
  corridor: string;
  corridorIcon: string;
  orderRef: string;
  grossFreight: number;
  gxpDeductions: number;
  incidentRef?: string;
  netPayable: number;
  paymentStatus: 'pending' | 'paid' | 'sent';
  paymentStatusLabel: string;
}

export interface VendorBill {
  id: string;
  vendorName: string;
  vendorId: string;
  amount: number;
  status: string;
  description: string;
  purchaseOrder: string;
  disbursementLedger: string;
  warrantyToken?: string;
  terms?: string;
  targetAsset?: string;
  serviceLocation?: string;
  paid: boolean;
}

export interface JournalEntryLine {
  accountCode: string;
  accountTitle: string;
  entityRef: string;
  debit?: number;
  credit?: number;
  highlight?: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  autoPosted: boolean;
  note: string;
  lines: JournalEntryLine[];
  totalCheck: number;
}
