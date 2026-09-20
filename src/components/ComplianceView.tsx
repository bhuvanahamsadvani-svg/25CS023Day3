import React, { useState, useEffect } from 'react';
import { ExcursionIncident } from '../types';

interface ComplianceViewProps {
  onOpenCertModal: () => void;
  onOpenClaimModal: () => void;
}

export const LAB_TECH_PHOTO = "https://lh3.googleusercontent.com/aida-public/AB6AXuCK18v2Lg824s8Y1J4qD-wQ19zZ1Xo-W-6wI8N5g4d12y1Zc3Xk2mY0vU9tL8bA7qO4rP2sT1uV5wX3yZ7aB9cD8eF2gH1iJ3kL5mN7oP9qR1sT3uV5wX7yZ9aB=w600";

export default function ComplianceView({
  onOpenCertModal,
  onOpenClaimModal,
}: ComplianceViewProps) {
  const [incidents, setIncidents] = useState<ExcursionIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<ExcursionIncident | null>(null);

  useEffect(() => {
    fetch('/api/incidents')
      .then(r => r.json())
      .then(data => {
        setIncidents(data);
        if (data.length > 0 && !selectedIncident) {
          setSelectedIncident(data[0]);
        }
      })
      .catch(e => console.error(e));
  }, []);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
  const [clientFilter, setClientFilter] = useState('All BioPharma Accounts');
  const [capaEndorsed, setCapaEndorsed] = useState(false);

  const handleBatchCert = () => {
    alert('Batch Generation Complete: 48 21-CFR Part 11 certificates signed and sealed with SHA-256 HMAC.');
  };

  const handleExportAuditTrail = () => {
    alert('21 CFR Part 11 Audit Trail exported: Downloaded compliance packet (Hash: SHA-256 Verified).');
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300 p-space-lg gap-space-lg">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[26px]">verified</span>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
              Regulatory Compliance &amp; Audits
            </h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            CFR 21 Part 11 Electronic Records, Mean Kinetic Temperature (MKT) Certificates, and Incident Root-Cause Analysis
          </p>
        </div>
        <div className="flex items-center gap-space-sm flex-wrap">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-label-mono-sm text-label-mono-sm border-0 focus:ring-2 focus:ring-secondary/40"
          >
            <option>All BioPharma Accounts</option>
            <option>Pfizer Inc.</option>
            <option>Novartis Global</option>
            <option>Moderna Therapeutics</option>
            <option>Sanofi Pasteur</option>
            <option>Genentech Labs</option>
          </select>
          <button
            onClick={handleExportAuditTrail}
            className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-space-xs cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">history_edu</span>
            <span>Export 21 CFR Part 11 Audit Trail</span>
          </button>
          <button
            onClick={handleBatchCert}
            className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-body-sm text-body-sm font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-space-xs cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            <span>Batch Generate Certificates</span>
          </button>
        </div>
      </div>

      {/* COMPLIANCE STATUS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Certificates Issued
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-lg text-display-lg text-on-surface font-bold">1,420</span>
                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">100% Sealed</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>DIGITALLY SIGNED</span>
            <span className="text-secondary font-semibold">SHA-256 HMAC</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Regulatory Audits Passed
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-lg text-display-lg text-on-surface font-bold">38 / 38</span>
                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">100.0%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">policy</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>FDA, EMA, &amp; Swissmedic</span>
            <span className="text-secondary font-semibold">0 NON-CONFORMANCES</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Open Excursion Claims
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-lg text-display-lg text-error font-bold">2</span>
                <span className="font-label-mono-sm text-label-mono-sm text-error font-semibold">$34,500 Exposure</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-error-container/40 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[24px]">gavel</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>UNDER CAPA INVESTIGATION</span>
            <span className="text-error font-semibold">1 PENDING CARRIER</span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                Mean Time to Resolution
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-display-lg text-display-lg text-on-surface font-bold">18.4</span>
                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">min (Avg)</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[24px]">timer</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>TARGET: &lt; 30 min</span>
            <span className="text-secondary font-semibold">SLA ZERO VIOLATIONS</span>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SPLIT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN: OFFICIAL 21 CFR CERTIFICATE DOSSIER (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-space-lg min-w-0">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border-t-4 border-secondary flex flex-col gap-space-md relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest font-bold block">
                  Official Release Record
                </span>
                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-0.5">
                  Temperature Compliance Certificate
                </h3>
                <span className="font-label-mono-sm text-label-mono-sm text-outline block">
                  CERT-2025-CRYO-0984
                </span>
              </div>
              <div className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase tracking-wider font-bold">
                VALIDATED CFR 21
              </div>
            </div>

            {/* Consignee & Shipment Manifest */}
            <div className="grid grid-cols-2 gap-space-xs bg-surface-container-low p-space-sm rounded-lg font-label-mono-sm text-label-mono-sm">
              <div>
                <span className="text-outline text-[11px] block">CONSIGNEE</span>
                <span className="font-bold text-on-surface">Genentech Labs Inc.</span>
                <span className="text-[10px] text-outline block">GNT-BIO-4491</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block">MANIFEST / LOT</span>
                <span className="font-bold text-on-surface">#SHP-88492 (mRNA-1273)</span>
                <span className="text-[10px] text-outline block">Container: CRYO-8849</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block">DISPATCH ORIGIN</span>
                <span className="font-bold text-on-surface">Basel Bio-Hub A</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block">CORRIDOR</span>
                <span className="font-bold text-on-surface">Transatlantic Air Direct</span>
              </div>
            </div>

            {/* Compliance Badge & Verification QR */}
            <div className="p-space-md bg-secondary/5 rounded-lg flex items-center justify-between border border-secondary/20">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">verified</span>
                </div>
                <div>
                  <span className="font-headline-sm text-headline-sm font-bold text-secondary">
                    100% COMPLIANT - PASS
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Zero thermal excursions outside allowable ±2.0°C envelope.
                  </p>
                </div>
              </div>
              {/* Dynamic Mock QR Code */}
              <div className="w-12 h-12 bg-white p-1 rounded shadow-xs flex flex-wrap gap-0.5 justify-center items-center shrink-0">
                <div className="w-4 h-4 bg-slate-900"></div>
                <div className="w-4 h-4 bg-slate-900 border border-white"></div>
                <div className="w-4 h-4 bg-slate-900"></div>
                <div className="w-4 h-4 bg-slate-900 border border-white"></div>
              </div>
            </div>

            {/* Thermal Kinetics Data */}
            <div className="flex flex-col gap-space-xs font-label-mono-sm text-label-mono-sm">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                Thermal Telemetry Kinetics (PT100 Triple-Probe)
              </span>
              <div className="grid grid-cols-2 gap-space-xs">
                <div className="p-space-xs bg-surface-container-low rounded">
                  <span className="text-outline block text-[10px]">MIN TEMP RECORDED</span>
                  <span className="font-bold text-on-surface text-[14px]">-72.4°C</span>
                </div>
                <div className="p-space-xs bg-surface-container-low rounded">
                  <span className="text-outline block text-[10px]">MAX TEMP RECORDED</span>
                  <span className="font-bold text-on-surface text-[14px]">-67.8°C</span>
                </div>
                <div className="p-space-xs bg-surface-container-low rounded">
                  <span className="text-outline block text-[10px]">MKT KINETIC VALUE</span>
                  <span className="font-bold text-secondary text-[14px]">-70.2°C (STABLE)</span>
                </div>
                <div className="p-space-xs bg-surface-container-low rounded">
                  <span className="text-outline block text-[10px]">TRANSIT DURATION</span>
                  <span className="font-bold text-on-surface text-[14px]">14.5 hrs (1,740 pts)</span>
                </div>
              </div>

              {/* Kinetic curve SVG */}
              <div className="h-16 w-full bg-surface-container-low/50 rounded mt-1 p-1 relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                  <line stroke="#006399" strokeDasharray="2,2" strokeWidth="0.8" x1="0" x2="200" y1="20" y2="20"></line>
                  <path
                    d="M 0,21 L 25,20 L 50,19 L 75,22 L 100,20 L 125,19 L 150,21 L 175,20 L 200,20"
                    fill="none"
                    stroke="#006399"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div className="flex justify-between text-[9px] text-outline px-1">
                  <span>Takeoff (Basel)</span>
                  <span className="text-secondary font-bold">Optimal Band (-70°C)</span>
                  <span>Landing (JFK)</span>
                </div>
              </div>
            </div>

            {/* Electronic Signature Record */}
            <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-1 font-label-mono-sm text-label-mono-sm">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant text-[10px]">
                Electronic Signature Record (21 CFR Part 11 Compliant)
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface block">Dr. Marcus Vance, MD</span>
                  <span className="text-outline text-[11px]">Signer Token: #VNC-2948-CFR21</span>
                </div>
                <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
              </div>
              <div className="p-1 bg-surface-container-lowest rounded text-[9px] text-outline break-all mt-1">
                HMAC-SHA256: 4f9812bc88029a1e0992c3491fae948123bfcd8810293847291a20394857b01
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-space-sm pt-space-xs">
              <button
                onClick={onOpenCertModal}
                className="flex-1 py-2 px-space-sm bg-secondary text-on-secondary rounded-lg font-body-sm text-body-sm font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download Validated PDF</span>
              </button>
              <button
                onClick={() => alert('Certificate transmitted directly to Genentech Quality Vault.')}
                className="py-2 px-space-md bg-surface-container text-on-surface rounded-lg font-body-sm text-body-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Send to Genentech Portal
              </button>
            </div>
          </div>

          {/* HUB BAY AUDIT PHOTO CARD */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                Hub Bay NIST-Traceable Audit
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-label-mono-sm text-label-mono-sm font-bold">
                CALIBRATED (18h AGO)
              </span>
            </div>
            <div className="h-44 w-full rounded-lg overflow-hidden relative">
              <img
                src={LAB_TECH_PHOTO}
                alt="Sterile Cleanroom Quality Technician"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-space-sm text-white">
                <span className="font-label-caps text-label-caps uppercase text-cyan-300">
                  Cleanroom QA Checkpoint 4
                </span>
                <span className="font-body-sm text-body-sm font-semibold">
                  Frankfurt Air Logistics Center (Sterile Bay 2)
                </span>
              </div>
            </div>
            <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              Probe calibration certificates verified annually in compliance with USP &lt;1079&gt; Good Storage and Shipping Practices.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: EXCURSION INCIDENTS & CAPA INVESTIGATION (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-space-lg min-w-0">
          {/* INCIDENT LEDGER TABLE */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Excursion Incidents &amp; Insurance Claims
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Electronic CAPA (Corrective and Preventive Action) Root-Cause Register
                </p>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-space-md py-1 rounded font-label-mono-sm text-label-mono-sm font-semibold cursor-pointer ${
                    activeTab === 'active'
                      ? 'bg-surface-container-lowest text-error shadow-xs'
                      : 'text-on-surface-variant'
                  }`}
                >
                  ACTIVE (3)
                </button>
                <button
                  onClick={() => setActiveTab('resolved')}
                  className={`px-space-md py-1 rounded font-label-mono-sm text-label-mono-sm font-semibold cursor-pointer ${
                    activeTab === 'resolved'
                      ? 'bg-surface-container-lowest text-secondary shadow-xs'
                      : 'text-on-surface-variant'
                  }`}
                >
                  RESOLVED (142)
                </button>
              </div>
            </div>

            {/* Incidents Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-label-mono-sm text-label-mono-sm">
                <thead>
                  <tr className="border-b border-surface-container text-outline text-[11px]">
                    <th className="pb-2">INCIDENT #</th>
                    <th className="pb-2">CLIENT / LOT</th>
                    <th className="pb-2">PEAK / DURATION</th>
                    <th className="pb-2">STATUS</th>
                    <th className="pb-2 text-right">CLAIM / PENALTY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {incidents.map((inc) => {
                    const isSelected = selectedIncident?.id === inc.id;
                    return (
                      <tr
                        key={inc.id}
                        onClick={() => setSelectedIncident(inc)}
                        className={`hover:bg-surface-container-low/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-surface-container-low' : ''
                        }`}
                      >
                        <td className="py-space-sm font-bold text-on-surface">
                          <span className="block">{inc.id}</span>
                          <span className="text-[10px] text-outline font-normal">{inc.reeferId}</span>
                        </td>
                        <td className="py-space-sm">
                          <span className="font-semibold text-on-surface block">{inc.client}</span>
                          <span className="text-[10px] text-on-surface-variant">{inc.cargoLot}</span>
                        </td>
                        <td className="py-space-sm">
                          <span className="font-bold text-error block">{inc.thermalPeak}</span>
                          <span className="text-[10px] text-outline">{inc.duration} exposure</span>
                        </td>
                        <td className="py-space-sm">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              inc.statusStyle === 'error'
                                ? 'bg-error-container text-on-error-container'
                                : inc.statusStyle === 'surface'
                                ? 'bg-secondary-fixed text-on-secondary-fixed'
                                : 'bg-surface-container-high text-on-surface'
                            }`}
                          >
                            {inc.resolutionVerdict}
                          </span>
                        </td>
                        <td className="py-space-sm text-right">
                          <span className="font-bold text-on-surface block">{inc.claimValue}</span>
                          <span className="text-[10px] text-outline">{inc.penaltyValue}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CAPA INVESTIGATION DOSSIER PANEL */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md border border-surface-container">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-error tracking-wider font-bold">
                  CAPA Investigation File
                </span>
                <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Incident {selectedIncident?.id} ({selectedIncident?.client})
                </h4>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                Auditor: Elena Rostova (Senior QA Lead)
              </span>
            </div>

            {/* Carrier & Insurance Callout */}
            <div className="grid grid-cols-2 gap-space-sm font-label-mono-sm text-label-mono-sm bg-surface-container-low p-space-sm rounded-lg">
              <div>
                <span className="text-outline text-[11px] block">CARRIER AT FAULT</span>
                <span className="font-bold text-on-surface">ThermoTrans Logistics LLC (Rig #812)</span>
                <span className="text-[10px] text-error block font-bold">Contractual SLA Penalty: $4,500.00</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block">INSURANCE CLAIM REFERENCE</span>
                <span className="font-bold text-on-surface">Chubb Pharma Marine #CPM-992-01</span>
                <span className="text-[10px] text-outline block">Underwriter Policy Coverage: $18,200.00</span>
              </div>
            </div>

            {/* Root Cause Assessment */}
            <div className="flex flex-col gap-1 font-body-sm text-body-sm">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                Root-Cause Engineering Assessment
              </span>
              <p className="text-on-surface bg-surface-container-low/40 p-space-sm rounded border border-surface-container">
                {selectedIncident?.notes} Primary compressor disengaged for 28 minutes. Driver initiated auxiliary backup dry ice injection at 14:27 UTC, arresting further thermal rise. Lot sampling protocol initiated for post-thaw stability testing at destination depot.
              </p>
            </div>

            {/* Forensic Thermal Graph */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                <span className="text-on-surface-variant">FORENSIC EXCURSION WAVE</span>
                <span className="text-error font-bold">Max Breach +1.2°C Above Limit</span>
              </div>
              <div className="h-28 w-full bg-slate-950 rounded-lg p-2 relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 80">
                  <line stroke="#ba1a1a" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="300" y1="35" y2="35"></line>
                  <line stroke="#0077b6" strokeDasharray="2,2" strokeWidth="0.8" x1="0" x2="300" y1="55" y2="55"></line>
                  <text fill="#ba1a1a" fontFamily="JetBrains Mono" fontSize="9" x="5" y="30">
                    -15.0°C Critical Limit
                  </text>
                  <text fill="#0077b6" fontFamily="JetBrains Mono" fontSize="9" x="5" y="70">
                    -20.0°C Set Point
                  </text>
                  <path
                    d="M 0,55 L 70,55 L 90,45 L 120,20 L 150,15 L 180,25 L 210,48 L 240,55 L 300,55"
                    fill="none"
                    stroke="#ba1a1a"
                    strokeWidth="2.5"
                  ></path>
                  <circle cx="150" cy="15" fill="#ba1a1a" r="4"></circle>
                </svg>
              </div>
            </div>

            {/* CAPA Sign-off controls */}
            <div className="flex items-center justify-between pt-space-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCapaEndorsed(!capaEndorsed)}
                  className={`px-space-md py-2 rounded-lg font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    capaEndorsed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {capaEndorsed ? 'check_circle' : 'draw'}
                  </span>
                  <span>{capaEndorsed ? 'CAPA Digitally Endorsed' : 'Digitally Endorse CAPA'}</span>
                </button>
                <button
                  onClick={onOpenClaimModal}
                  className="px-space-md py-2 rounded-lg bg-error text-on-error font-body-sm text-body-sm font-semibold hover:bg-error/90 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">gavel</span>
                  <span>Escalate to Carrier Insurance</span>
                </button>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm text-outline">
                Record Locked: 21 CFR Part 11
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
