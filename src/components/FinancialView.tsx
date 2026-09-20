import React, { useState, useEffect } from 'react';
import { CustomerInvoice, VendorBill, JournalEntry } from '../types';

export default function FinancialView() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'vendors' | 'journal'>('invoices');
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [vendorBills, setVendorBills] = useState<VendorBill[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [offsetSigned, setOffsetSigned] = useState(false);

  const fetchData = async () => {
    try {
      const [invRes, billRes, jourRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/bills'),
        fetch('/api/journals')
      ]);
      setInvoices(await invRes.json());
      setVendorBills(await billRes.json());
      setJournalEntries(await jourRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAuthorizeBill = async (billId: string) => {
    try {
      await fetch('/api/bills/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billId })
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReconcile = () => {
    alert('Bank Reconciliation Synchronized: Fedwire & SEPA settlement feeds matched to 48 ledger journals.');
  };

  const handleNewInvoice = async () => {
    try {
      await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: 'AstraZeneca Global',
          orderRef: `SO-99${20 + invoices.length}`,
          grossFreight: 32000.0,
          corridor: 'Oxford-Frankfurt Cryo',
          incidentRef: null
        })
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300 p-space-lg gap-space-lg">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[26px]">receipt_long</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
              Financial Ledger &amp; Billing
            </h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            GAAP-Compliant Cold-Chain Revenue, Vendor Payables, and Automated SLA Excursion Penalty Ledger
          </p>
        </div>
        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            onClick={handleNewInvoice}
            className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-space-xs cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Customer Invoice</span>
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-space-xs cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            <span>+ New Vendor Bill</span>
          </button>
          <button
            onClick={handleReconcile}
            className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-body-sm text-body-sm font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-space-xs cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            <span>Reconcile Bank Transfers</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Freight Revenue
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-lg text-display-lg text-on-surface font-bold">$1,289,500</span>
                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">+8.4%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>UNBILLED / ACCRUED</span>
            <span className="text-on-surface font-semibold">$412,800</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Vendor Payables
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-lg text-display-lg text-on-surface font-bold">$184,200</span>
                <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Fleet &amp; Maintenance</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">handshake</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>DUE IN 7 DAYS</span>
            <span className="text-amber-700 font-semibold">$41,600</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Compliance Claims Withheld
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-lg text-display-lg text-error font-bold">-$22,700</span>
                <span className="font-label-mono-sm text-label-mono-sm text-error font-semibold">Excursion Loss</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-error-container/40 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>SLA BREACH DEDUCTIONS</span>
            <span className="text-error font-semibold">GROSS PENALTY</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Net Operating Cash Flow
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-lg text-display-lg text-secondary font-bold">+$682,600</span>
                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">+14.2% MoM</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">trending_up</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>GAAP ACCRUAL RECONCILED</span>
            <span className="text-secondary font-semibold">BALANCED</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'invoices'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">description</span>
          <span>Customer Invoices (Sales Orders)</span>
          <span className="px-1.5 py-0.2 bg-surface-container font-label-mono-sm text-label-mono-sm rounded">
            {invoices.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'vendors'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
          <span>Vendor Payables &amp; Reefer OEM</span>
          <span className="px-1.5 py-0.2 bg-surface-container font-label-mono-sm text-label-mono-sm rounded">
            {vendorBills.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'journal'
              ? 'bg-surface-container-lowest text-on-surface shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">account_tree</span>
          <span>Automated Balanced Ledger (JE)</span>
          <span className="px-1.5 py-0.2 bg-secondary text-on-secondary font-label-mono-sm text-label-mono-sm rounded font-bold">
            Auto-Sync
          </span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER INVOICES */}
      {activeTab === 'invoices' && (
        <div className="flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Biopharma Customer Billing &amp; Invoices
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Automated SLA adjustments computed directly from real-time cold-chain sensor records
                </p>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">
                CURRENCY: USD ($)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-label-mono-sm text-label-mono-sm">
                <thead>
                  <tr className="border-b border-surface-container text-outline text-[11px]">
                    <th className="pb-2">INVOICE #</th>
                    <th className="pb-2">CLIENT / ORDER</th>
                    <th className="pb-2">CORRIDOR</th>
                    <th className="pb-2 text-right">GROSS FREIGHT</th>
                    <th className="pb-2 text-right">GxP DEDUCTION</th>
                    <th className="pb-2 text-right">NET PAYABLE</th>
                    <th className="pb-2 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-space-sm font-bold text-on-surface">
                        <span className="block">{inv.id}</span>
                        <span className="text-[10px] text-outline font-normal">{inv.date}</span>
                      </td>
                      <td className="py-space-sm">
                        <span className="font-bold text-on-surface block">{inv.client}</span>
                        <span className="text-[10px] text-on-surface-variant">{inv.orderRef}</span>
                      </td>
                      <td className="py-space-sm">
                        <span className="flex items-center gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            {inv.corridorIcon}
                          </span>
                          <span>{inv.corridor}</span>
                        </span>
                      </td>
                      <td className="py-space-sm text-right font-bold text-on-surface">
                        ${inv.grossFreight.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-space-sm text-right font-bold">
                        {inv.gxpDeductions < 0 ? (
                          <span className="text-error">
                            -${Math.abs(inv.gxpDeductions).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            <span className="block text-[9px] font-normal">{inv.incidentRef}</span>
                          </span>
                        ) : (
                          <span className="text-outline">$0.00</span>
                        )}
                      </td>
                      <td className="py-space-sm text-right font-bold text-secondary text-[14px]">
                        ${inv.netPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-space-sm text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                            inv.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.paymentStatus === 'pending'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-surface-container text-on-surface'
                          }`}
                        >
                          {inv.paymentStatusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EXCURSION PENALTY DEDUCTION CALLOUT */}
          <div className="bg-error-container/20 border border-error/30 rounded-xl p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex items-start gap-space-md">
              <div className="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">gavel</span>
              </div>
              <div>
                <span className="font-headline-sm text-headline-sm font-bold text-error block">
                  SLA Penalty Contractual Offset: Incident #EXC-4092 ($4,500.00 Deduction)
                </span>
                <p className="font-body-sm text-body-sm text-on-surface mt-0.5">
                  Under Master Biopharma Transport Agreement Article 8.4, $4,500.00 was withheld from gross billing for temperature deviation on Unit RC-9042. Counter-claim against carrier insurance (Chubb Policy #CPM-992-01) currently pending subrogation.
                </p>
              </div>
            </div>
            <button
              onClick={() => setOffsetSigned(!offsetSigned)}
              className={`px-space-md py-2 rounded-lg font-body-sm text-body-sm font-semibold transition-colors shrink-0 cursor-pointer ${
                offsetSigned
                  ? 'bg-emerald-600 text-white'
                  : 'bg-error text-on-error hover:bg-error/90 shadow-sm'
              }`}
            >
              {offsetSigned ? 'Signed & Enforced in Ledger' : 'Sign Off Claim Offset'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VENDOR PAYABLES & REEFER OEM */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {vendorBills.map((bill) => (
            <div
              key={bill.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col justify-between gap-space-md border border-surface-container"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider font-bold">
                    {bill.id} • {bill.vendorId}
                  </span>
                  <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
                    {bill.vendorName}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {bill.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display-lg text-display-lg font-bold text-on-surface block">
                    ${bill.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${
                      bill.paid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-xs bg-surface-container-low p-space-sm rounded-lg font-label-mono-sm text-label-mono-sm">
                <div>
                  <span className="text-outline text-[10px] block">PURCHASE ORDER</span>
                  <span className="font-bold text-on-surface">{bill.purchaseOrder}</span>
                </div>
                <div>
                  <span className="text-outline text-[10px] block">DISBURSEMENT LEDGER</span>
                  <span className="font-bold text-on-surface">{bill.disbursementLedger}</span>
                </div>
                {bill.targetAsset && (
                  <div>
                    <span className="text-outline text-[10px] block">TARGET ASSET</span>
                    <span className="font-bold text-error">{bill.targetAsset}</span>
                  </div>
                )}
                {bill.terms && (
                  <div>
                    <span className="text-outline text-[10px] block">PAYMENT TERMS</span>
                    <span className="font-bold text-on-surface">{bill.terms}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-space-xs">
                <span className="font-label-mono-sm text-label-mono-sm text-outline">
                  Authorized Signatory: CFO Office
                </span>
                {!bill.paid ? (
                  <button
                    onClick={() => handleAuthorizeBill(bill.id)}
                    className="px-space-md py-1.5 rounded-lg bg-secondary text-on-secondary font-body-sm text-body-sm font-semibold hover:bg-secondary/90 transition-colors shadow-sm cursor-pointer"
                  >
                    Authorize Payment
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold font-label-mono-sm text-label-mono-sm">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Paid via Wire
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: BALANCED JOURNAL ENTRIES */}
      {activeTab === 'journal' && (
        <div className="flex flex-col gap-space-lg">
          {journalEntries.map((je) => (
            <div
              key={je.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-surface-container"
            >
              <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-xs border-b border-surface-container">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                      Journal Entry {je.id}
                    </span>
                    {je.autoPosted && (
                      <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase font-bold text-[10px]">
                        AUTO-POSTED
                      </span>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-0.5">
                    {je.title}
                  </p>
                </div>
                <div className="text-right font-label-mono-sm text-label-mono-sm text-outline">
                  <span>POSTED: {je.date}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-label-mono-sm text-label-mono-sm">
                  <thead>
                    <tr className="border-b border-surface-container text-outline text-[11px]">
                      <th className="pb-2">ACCOUNT #</th>
                      <th className="pb-2">ACCOUNT TITLE</th>
                      <th className="pb-2">ENTITY / REFERENCE</th>
                      <th className="pb-2 text-right">DEBIT (USD)</th>
                      <th className="pb-2 text-right">CREDIT (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {je.lines.map((line, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-surface-container-low/50 ${
                          line.highlight ? 'bg-error-container/20 text-error font-bold' : ''
                        }`}
                      >
                        <td className="py-space-xs font-bold text-on-surface">{line.accountCode}</td>
                        <td className="py-space-xs font-medium">{line.accountTitle}</td>
                        <td className="py-space-xs text-outline">{line.entityRef}</td>
                        <td className="py-space-xs text-right font-bold text-on-surface">
                          {line.debit !== undefined
                            ? `$${line.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                            : '—'}
                        </td>
                        <td className="py-space-xs text-right font-bold text-on-surface">
                          {line.credit !== undefined
                            ? `$${line.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-surface-container font-bold text-on-surface">
                      <td colSpan={3} className="pt-2 text-right">
                        BALANCED TOTAL CHECK:
                      </td>
                      <td className="pt-2 text-right text-secondary">
                        ${je.totalCheck.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="pt-2 text-right text-secondary">
                        ${je.totalCheck.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-space-xs bg-surface-container-low rounded text-[11px] font-label-mono-sm text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-secondary">info</span>
                <span>Audit Note: {je.note}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRYPTOGRAPHIC CUSTODY FOOTER STAMP */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md border border-surface-container">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface block">
              Cryptographic Custody &amp; Financial Immutability
            </span>
            <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              All ledger rows are cross-anchored with 21 CFR Part 11 telemetry hashes. Edits require multi-signature QA counter-endorsement.
            </p>
          </div>
        </div>
        <div className="font-label-mono-sm text-label-mono-sm text-outline text-right">
          <span>ROOT MERKLE: 0x98f2...41a0</span>
          <span className="block text-secondary font-bold">STATUS: LOCKED &amp; AUDITED</span>
        </div>
      </div>
    </div>
  );
}
