import React, { useState } from 'react';

export const ASSET_IMAGE_1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCK18v2Lg824s8Y1J4qD-wQ19zZ1Xo-W-6wI8N5g4d12y1Zc3Xk2mY0vU9tL8bA7qO4rP2sT1uV5wX3yZ7aB9cD8eF2gH1iJ3kL5mN7oP9qR1sT3uV5wX7yZ9aB=w600";

export default function BudgetsView() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q1 2025 (Jan - Mar)');
  const [selectedCorridor, setSelectedCorridor] = useState('All Active Corridors');

  const handleExportDeck = () => {
    alert('Export Deck generated: Biopharma Corridor P&L Deck compiled for Executive Committee.');
  };

  const handleDownloadXLSX = () => {
    alert('Spreadsheet generated: CryoTrack_Corridor_PL_Q1_2025.xlsx downloaded.');
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300 p-space-lg gap-space-lg">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[26px]">monitoring</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
              Corridor Budgets &amp; P&amp;L
            </h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Operating Statement, Cost Variances, and Capital Asset Lifecycle Tracking
          </p>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-label-mono-sm text-label-mono-sm border-0 focus:ring-2 focus:ring-secondary/40"
          >
            <option>Q1 2025 (Jan - Mar)</option>
            <option>Q4 2024 (Oct - Dec)</option>
            <option>FY 2024 Full Year</option>
          </select>
          <select
            value={selectedCorridor}
            onChange={(e) => setSelectedCorridor(e.target.value)}
            className="px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-label-mono-sm text-label-mono-sm border-0 focus:ring-2 focus:ring-secondary/40"
          >
            <option>All Active Corridors</option>
            <option>North-South Vaccine Route</option>
            <option>Trans-Alpine Cryo Route</option>
            <option>Nordic Deep-Freeze Bio</option>
          </select>
          <button
            onClick={handleExportDeck}
            className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-space-xs cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">presentation</span>
            <span>Export Deck</span>
          </button>
          <button
            onClick={handleDownloadXLSX}
            className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-body-sm text-body-sm font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-space-xs cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            <span>Download XLSX</span>
          </button>
        </div>
      </div>

      {/* TOP ROUTE ANALYTIC BUDGET CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Route 1 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col justify-between border-t-4 border-error">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider font-bold">
                Analytic Acct #8812
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-0.5">
                North-South Vaccine Route
              </h3>
              <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Boston (BOS) → Atlanta (ATL) → Miami (MIA)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm font-bold text-[11px]">
              -6.6% EXCEEDED
            </span>
          </div>

          <div className="my-space-md">
            <div className="flex justify-between font-label-mono-sm text-label-mono-sm mb-1">
              <span className="text-outline">SPENT: $341,200</span>
              <span className="font-bold text-on-surface">BUDGET: $320,000</span>
            </div>
            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
              <div className="h-full bg-error" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="flex justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant pt-space-xs border-t border-surface-container">
            <span>UNFAVORABLE VARIANCE</span>
            <span className="text-error font-bold">-$21,200 (Fuel + Repair)</span>
          </div>
        </div>

        {/* Route 2 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col justify-between border-t-4 border-secondary">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider font-bold">
                Analytic Acct #8845
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-0.5">
                Trans-Alpine Cryo Corridor
              </h3>
              <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Rotterdam (RTM) → Frankfurt → Zurich (ZUR)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-bold text-[11px]">
              +12.6% FAVORABLE
            </span>
          </div>

          <div className="my-space-md">
            <div className="flex justify-between font-label-mono-sm text-label-mono-sm mb-1">
              <span className="text-outline">SPENT: $218,500</span>
              <span className="font-bold text-on-surface">BUDGET: $250,000</span>
            </div>
            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
              <div className="h-full bg-secondary" style={{ width: '87.4%' }}></div>
            </div>
          </div>

          <div className="flex justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant pt-space-xs border-t border-surface-container">
            <span>FAVORABLE SURPLUS</span>
            <span className="text-secondary font-bold">+$31,500 (Zurich Bypass)</span>
          </div>
        </div>

        {/* Route 3 */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col justify-between border-t-4 border-secondary">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider font-bold">
                Analytic Acct #8890
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-0.5">
                Nordic Deep-Freeze Bio Corridor
              </h3>
              <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Stockholm (ARN) → Copenhagen → Hamburg
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-bold text-[11px]">
              +5.9% FAVORABLE
            </span>
          </div>

          <div className="my-space-md">
            <div className="flex justify-between font-label-mono-sm text-label-mono-sm mb-1">
              <span className="text-outline">SPENT: $169,400</span>
              <span className="font-bold text-on-surface">BUDGET: $180,000</span>
            </div>
            <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
              <div className="h-full bg-secondary" style={{ width: '94.1%' }}></div>
            </div>
          </div>

          <div className="flex justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant pt-space-xs border-t border-surface-container">
            <span>FAVORABLE SURPLUS</span>
            <span className="text-secondary font-bold">+$10,600 (LN2 Efficiency)</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN FINANCIAL STATEMENTS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: P&L OPERATING STATEMENT (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-space-lg min-w-0">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div>
                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Logistics Profit &amp; Loss Statement
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  GAAP Accrual Basis • Period: Q1 2025 Normalized
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-surface-container font-label-mono-sm text-label-mono-sm font-bold text-on-surface">
                AUDITED FINANCIALS
              </span>
            </div>

            {/* P&L Line Items */}
            <div className="flex flex-col gap-space-sm font-label-mono-sm text-label-mono-sm">
              {/* Revenue */}
              <div className="p-space-sm bg-surface-container-low/70 rounded-lg flex flex-col gap-1">
                <div className="flex justify-between font-bold text-on-surface text-[14px]">
                  <span>OPERATING REVENUE &amp; SURCHARGES</span>
                  <span>$1,499,500</span>
                </div>
                <div className="pl-space-md flex flex-col gap-0.5 text-on-surface-variant text-[12px]">
                  <div className="flex justify-between">
                    <span>Active Cryo Freight Billings</span>
                    <span>$1,289,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dry Ice &amp; LN2 Recharge Consumables</span>
                    <span>$142,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>21 CFR Compliance &amp; Certification Fees</span>
                    <span>$68,000</span>
                  </div>
                </div>
              </div>

              {/* Direct Costs */}
              <div className="p-space-sm bg-surface-container-low/70 rounded-lg flex flex-col gap-1">
                <div className="flex justify-between font-bold text-on-surface text-[14px]">
                  <span>COST OF FLEET SERVICES (COFS)</span>
                  <span className="text-error">-$852,700</span>
                </div>
                <div className="pl-space-md flex flex-col gap-0.5 text-on-surface-variant text-[12px]">
                  <div className="flex justify-between">
                    <span>Linehaul Driver &amp; Fuel Surcharges</span>
                    <span>-$498,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refrigeration Compressor Overhauls &amp; OEM Kits</span>
                    <span>-$184,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Depot Cryo-Charge &amp; Dry Ice Refill</span>
                    <span>-$94,800</span>
                  </div>
                  <div className="flex justify-between text-error font-semibold">
                    <span>Excursion Penalty Deductions &amp; SLA Penalties</span>
                    <span>-$75,500</span>
                  </div>
                </div>
              </div>

              {/* Gross Margin */}
              <div className="p-space-sm bg-secondary/10 rounded-lg flex justify-between font-bold text-secondary text-[15px] border border-secondary/20">
                <span>GROSS OPERATING MARGIN</span>
                <span>$646,800 (43.1%)</span>
              </div>

              {/* OPEX */}
              <div className="p-space-sm bg-surface-container-low/70 rounded-lg flex flex-col gap-1">
                <div className="flex justify-between font-bold text-on-surface text-[14px]">
                  <span>QUALITY ASSURANCE &amp; TELEMETRY OPEX</span>
                  <span>-$145,000</span>
                </div>
                <div className="pl-space-md flex flex-col gap-0.5 text-on-surface-variant text-[12px]">
                  <div className="flex justify-between">
                    <span>IoT Sensor Probe Recalibrations (NIST)</span>
                    <span>-$54,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satellite Uplink &amp; Telemetry Data Infrastructure</span>
                    <span>-$38,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GxP Audit &amp; 21 CFR Compliance Personnel</span>
                    <span>-$53,000</span>
                  </div>
                </div>
              </div>

              {/* Operating Profit (EBITDA) */}
              <div className="p-space-md bg-secondary text-on-secondary rounded-lg flex justify-between font-bold text-[16px] shadow-sm">
                <span>OPERATING PROFIT (EBITDA)</span>
                <span>$501,800 (33.5% Margin)</span>
              </div>
            </div>

            {/* Key Corridor Unit Economics */}
            <div className="grid grid-cols-3 gap-space-xs pt-space-xs font-label-mono-sm text-label-mono-sm">
              <div className="p-space-xs bg-surface-container-low rounded text-center">
                <span className="text-outline text-[10px] block">REV / REEFER</span>
                <span className="font-bold text-on-surface text-[13px]">$31,239</span>
              </div>
              <div className="p-space-xs bg-surface-container-low rounded text-center">
                <span className="text-outline text-[10px] block">EXCURSION LEAKAGE</span>
                <span className="font-bold text-error text-[13px]">1.23% Gross</span>
              </div>
              <div className="p-space-xs bg-surface-container-low rounded text-center">
                <span className="text-outline text-[10px] block">NET CORRIDOR PROFIT</span>
                <span className="font-bold text-secondary text-[13px]">$10,454 / run</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BALANCE SHEET & COST VARIANCE DRILLDOWN (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-space-lg min-w-0">
          {/* BALANCE SHEET SUMMARY */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                Cold-Chain Balance Sheet
              </h3>
              <span className="font-label-mono-sm text-label-mono-sm text-secondary font-bold">
                ASSETS = $4,920,000
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-sm font-label-mono-sm text-label-mono-sm">
              <div className="flex flex-col gap-1 p-space-sm bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-label-caps text-secondary font-bold uppercase">
                  Current &amp; Capital Assets
                </span>
                <div className="flex justify-between text-on-surface">
                  <span>Reefer Fleet (48 Units)</span>
                  <span className="font-bold">$3,450,000</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span>Accounts Receivable</span>
                  <span className="font-bold">$412,800</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span>Cash &amp; Bank Reserves</span>
                  <span className="font-bold">$1,057,200</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-space-sm bg-surface-container-low rounded-lg">
                <span className="font-label-caps text-label-caps text-on-surface font-bold uppercase">
                  Liabilities &amp; Equity
                </span>
                <div className="flex justify-between text-on-surface">
                  <span>Accounts Payable</span>
                  <span className="font-bold">$184,200</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span>Reefer Term Debt</span>
                  <span className="font-bold">$1,850,000</span>
                </div>
                <div className="flex justify-between text-secondary font-bold">
                  <span>Retained Earnings</span>
                  <span>$2,885,800</span>
                </div>
              </div>
            </div>
          </div>

          {/* COST CATEGORY VARIANCE DRILLDOWN */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                Cost Category Variances
              </h4>
              <span className="font-label-mono-sm text-label-mono-sm text-outline">Budget vs. Actual</span>
            </div>

            <div className="flex flex-col gap-space-md font-label-mono-sm text-label-mono-sm">
              {/* Category 1 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-on-surface">Linehaul &amp; Surcharges</span>
                  <span>$498.2k / $480k <span className="text-error font-bold">(+3.8%)</span></span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex">
                  <div className="h-full bg-error" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Category 2 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-on-surface">Refrigeration Overhauls</span>
                  <span>$184.2k / $160k <span className="text-error font-bold">(+15.1%)</span></span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex">
                  <div className="h-full bg-error" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Category 3 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-on-surface">Cryo LN2 Recharging</span>
                  <span>$94.8k / $110k <span className="text-secondary font-bold">(-13.8%)</span></span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex">
                  <div className="h-full bg-secondary" style={{ width: '86.2%' }}></div>
                </div>
              </div>

              {/* Category 4 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-on-surface">IoT Probes &amp; Calibrations</span>
                  <span>$54.0k / $60k <span className="text-secondary font-bold">(-10.0%)</span></span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex">
                  <div className="h-full bg-secondary" style={{ width: '90.0%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ASSET & OPERATIONS PHOTO GALLERY */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
          <div>
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              Cold Chain Infrastructure Assets
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Field operational depots, certified cleanrooms, and ISO-9001 inspected refrigerated fleets
            </p>
          </div>
          <span className="font-label-mono-sm text-label-mono-sm text-secondary font-bold">
            VALIDATED HUBS: 8 GLOBAL SITES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {/* Card 1 */}
          <div className="flex flex-col gap-2 rounded-lg overflow-hidden border border-surface-container bg-surface-container-low">
            <div className="h-44 w-full overflow-hidden relative">
              <img
                src={ASSET_IMAGE_1}
                alt="Basel Central Depot Re-icing Terminal"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white font-label-mono-sm text-[10px]">
                DEPOT HUB #01
              </span>
            </div>
            <div className="p-space-sm flex flex-col gap-0.5">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Basel Central Depot Re-icing Terminal
              </span>
              <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Direct automated liquid nitrogen filling with dual-redundant vacuum jacketed manifolds.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col gap-2 rounded-lg overflow-hidden border border-surface-container bg-surface-container-low">
            <div className="h-44 w-full overflow-hidden relative bg-slate-900 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                alt="Fleet Unit CRYO-77 Hybrid Electric Reefers"
                className="w-full h-full object-cover opacity-90"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white font-label-mono-sm text-[10px]">
                REEFER FLEET UNIT
              </span>
            </div>
            <div className="p-space-sm flex flex-col gap-0.5">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Fleet Unit CRYO-77 Hybrid Reefers
              </span>
              <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Electric standby power with dual hermetic scroll compressors and real-time sat-modems.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col gap-2 rounded-lg overflow-hidden border border-surface-container bg-surface-container-low">
            <div className="h-44 w-full overflow-hidden relative bg-slate-900 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
                alt="QA Audit Station GxP Custody Checkpoints"
                className="w-full h-full object-cover opacity-90"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white font-label-mono-sm text-[10px]">
                GxP AUDIT BAY
              </span>
            </div>
            <div className="p-space-sm flex flex-col gap-0.5">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                QA Audit Station GxP Checkpoints
              </span>
              <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Temperature data loggers calibrated and sealed before transfer to pharmaceutical consignees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
