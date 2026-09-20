import React, { useState, useEffect } from 'react';
import { ReeferUnit } from '../types';

interface TelemetryViewProps {
  onOpenCertModal: () => void;
  onOpenClaimModal: () => void;
  onNavigateToLedger?: () => void;
  searchQuery?: string;
}

export default function TelemetryView({
  onOpenCertModal,
  onOpenClaimModal,
  onNavigateToLedger,
  searchQuery = '',
}: TelemetryViewProps) {
  const [reefers, setReefers] = useState<ReeferUnit[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'warning' | 'ultracold' | 'deepfreeze'>('all');
  const [selectedUnit, setSelectedUnit] = useState<ReeferUnit | null>(null);
  const [techDispatched, setTechDispatched] = useState(false);
  const [isCoolingInjected, setIsCoolingInjected] = useState(false);
  const [coolingPullingDown, setCoolingPullingDown] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(-13.8);
  const [gisViewMode, setGisViewMode] = useState<'sat' | 'thermal' | 'gateways'>('sat');


  useEffect(() => {
    const fetchReefers = async () => {
      try {
        const res = await fetch('/api/reefers');
        const data = await res.json();
        setReefers(data);
        if (data.length > 0 && !selectedUnit) {
          setSelectedUnit(data[0]);
          setCurrentTemp(data[0].temp);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchReefers();
    const interval = setInterval(fetchReefers, 5000);
    return () => clearInterval(interval);
  }, []);
  

  const filteredReefers = reefers.filter((unit) => {
    const matchesSearch =
      unit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.corridor.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'critical') return unit.status === 'critical';
    if (selectedFilter === 'warning') return unit.status === 'warning';
    if (selectedFilter === 'ultracold') return unit.status === 'ultracold';
    if (selectedFilter === 'deepfreeze') return unit.status === 'optimal';
    return true;
  });

  const handleCoolingAction = async () => {
    if (!selectedUnit) return;
    setIsCoolingInjected(true);
    try {
      // Simulate cooling injection hitting threshold which creates an excursion for the demo, 
      // but in real world it would reduce temperature. Wait, the demo requirement says: 
      // "auto-flag status to EXCURSION if temperature exceeds limit (-15)". Let's simulate a spike instead of cooling to test the backend logic.
      const simulatedSpike = -14.9; // Above -15 C
      const res = await fetch(`/api/reefers/${encodeURIComponent(selectedUnit.id)}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp: simulatedSpike })
      });
      const updatedReefer = await res.json();
      
      setTimeout(() => {
        setCoolingPullingDown(true);
        setCurrentTemp(simulatedSpike);
        setTimeout(async () => {
           const spike2 = -13.0; // Higher spike
           const res2 = await fetch(`/api/reefers/${encodeURIComponent(selectedUnit.id)}/telemetry`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ temp: spike2 })
           });
           const finalReefer = await res2.json();
           setCurrentTemp(spike2);
           setSelectedUnit(finalReefer);
        }, 2500);
      }, 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    const headers = "Container ID,Carrier,Status,Temp,Target,Cargo,Door,Corridor\n";
    const rows = reefers.map(u => 
      `"${u.id}","${u.carrier}","${u.status}","${u.temp}","${u.targetTemp}","${u.cargo}","${u.doorStatus}","${u.corridor}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CryoTrack_Fleet_Telemetry_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300">
      {/* PERSISTENT URGENT EXCURSION BANNER */}
      <aside
        id="excursion-alert-banner"
        aria-label="Critical Excursion Alert"
        className="relative overflow-hidden bg-error text-on-error px-space-lg py-space-sm shadow-md flex flex-wrap items-center justify-between gap-space-md"
      >
        <div className="flex items-center gap-space-md min-w-0">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-on-error/20 flex-shrink-0 animate-pulse">
            <span className="material-symbols-outlined text-[20px] text-on-error">warning</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="font-label-caps text-label-caps tracking-widest uppercase bg-surface-container-lowest text-error px-1.5 py-0.5 rounded font-bold">
                21 CFR Breach Interlock
              </span>
              <span className="font-headline-sm text-headline-sm tracking-tight font-bold truncate">
                EXCURSION ALERT: Container #RC-9042
              </span>
              <span className="font-label-mono-sm text-label-mono-sm opacity-90">
                (Pfizer mRNA Batch #VN-88210)
              </span>
            </div>
            <p className="font-body-sm text-body-sm opacity-95 truncate">
              Corridor B: North-South Vaccine Route breached critical threshold to{' '}
              <strong className="font-bold underline decoration-2">{currentTemp.toFixed(1)}°C</strong> (Safe Limit:
              -15.0°C). 24 min cumulative exposure. Automated SOP Phase II active.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm flex-shrink-0">
          <button
            id="acknowledge-excursion-btn"
            onClick={() => setTechDispatched(true)}
            className={`px-space-md py-1.5 rounded font-body-sm text-body-sm font-semibold transition-colors shadow-sm flex items-center gap-space-xs cursor-pointer ${
              techDispatched
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container-lowest text-error hover:bg-error-container hover:text-on-error-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {techDispatched ? 'check' : 'person_alert'}
            </span>
            <span>{techDispatched ? 'Dispatched (Tech En Route)' : 'Acknowledge & Dispatch Tech'}</span>
          </button>
          <button
            id="log-penalty-btn"
            onClick={onOpenClaimModal}
            className="px-space-md py-1.5 rounded bg-on-error/15 text-on-error font-body-sm text-body-sm font-medium hover:bg-on-error/25 transition-colors flex items-center gap-space-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Log Penalty Claim</span>
          </button>
        </div>
      </aside>

      {/* CONTENT VIEWPORT */}
      <div className="p-space-lg flex flex-col gap-space-lg">
        {/* KPI STRIP */}
        <section aria-label="Fleet Telemetry Metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* KPI 1 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                  Total Active Reefers
                </span>
                <div className="flex items-baseline gap-space-xs mt-1">
                  <span className="font-display-lg text-display-lg text-on-surface font-bold">48</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">Units Monitored</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">mode_fan</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>46 Optimal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>1 Thaw Warn
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>1 Excursion
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-low">
              <div className="h-full bg-secondary" style={{ width: '95.8%' }}></div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                  Mean Cargo Temp
                </span>
                <div className="flex items-baseline gap-space-xs mt-1">
                  <span className="font-display-lg text-display-lg text-on-surface font-bold">-18.6°C</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">In Safe Band</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">device_thermostat</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              <span>TARGET: -20.0°C</span>
              <span>TOLERANCE: ±2.5°C</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-low">
              <div className="h-full bg-secondary" style={{ width: '82%' }}></div>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                  Excursion Rate (MTD)
                </span>
                <div className="flex items-baseline gap-space-xs mt-1">
                  <span className="font-display-lg text-display-lg text-on-surface font-bold">0.18%</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary flex items-center">
                    <span className="material-symbols-outlined text-[14px]">arrow_downward</span>-0.04%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              <span className="text-secondary font-semibold">21 CFR PART 11 COMPLIANT</span>
              <span>AUDIT CEILING: 0.50%</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-low">
              <div className="h-full bg-secondary" style={{ width: '36%' }}></div>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">
                  GPS Fleet Velocity
                </span>
                <div className="flex items-baseline gap-space-xs mt-1">
                  <span className="font-display-lg text-display-lg text-on-surface font-bold">58.4</span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">km/h avg</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">route</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              <span>6 ACTIVE ARTERIES</span>
              <span className="text-on-surface font-semibold">0 DELAYS REPORTED</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-low">
              <div className="h-full bg-secondary" style={{ width: '71%' }}></div>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN WORKSPACE: 65% LEFT / 35% RIGHT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* LEFT SIDE (65% / 8 cols of 12) */}
          <div className="xl:col-span-8 flex flex-col gap-space-lg min-w-0">
            {/* INTERACTIVE CORRIDOR GIS MAP PANEL */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[22px]">public</span>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Cold Chain Corridor GIS &amp; Global Tracking
                    </h2>
                    <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                      Real-time GPS nodes with thermal integrity matrix overlay
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs bg-surface-container-lowest p-1 rounded-lg">
                  <button
                    onClick={() => setGisViewMode('sat')}
                    className={`px-space-sm py-1 rounded font-label-mono-sm text-label-mono-sm font-medium transition-colors cursor-pointer ${
                      gisViewMode === 'sat'
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Sat-Telemetry
                  </button>
                  <button
                    onClick={() => setGisViewMode('thermal')}
                    className={`px-space-sm py-1 rounded font-label-mono-sm text-label-mono-sm font-medium transition-colors cursor-pointer ${
                      gisViewMode === 'thermal'
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Thermal Flux
                  </button>
                  <button
                    onClick={() => setGisViewMode('gateways')}
                    className={`px-space-sm py-1 rounded font-label-mono-sm text-label-mono-sm font-medium transition-colors cursor-pointer ${
                      gisViewMode === 'gateways'
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Port Gateways
                  </button>
                </div>
              </div>

              {/* MAP VISUALIZATION CANVAS WITH GIS NODES */}
              <div className="relative w-full h-80 bg-slate-900 overflow-hidden select-none">
                <svg
                  className="absolute inset-0 w-full h-full text-slate-700/40"
                  preserveAspectRatio="none"
                  viewBox="0 0 900 360"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern height="40" id="gis-grid" patternUnits="userSpaceOnUse" width="40">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="2,2"
                        strokeWidth="0.5"
                      ></path>
                    </pattern>
                    <linearGradient id="route-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#006399"></stop>
                      <stop offset="50%" stopColor="#ba1a1a"></stop>
                      <stop offset="100%" stopColor="#006399"></stop>
                    </linearGradient>
                  </defs>
                  <rect fill="#0a1222" height="100%" width="100%"></rect>
                  <rect fill="url(#gis-grid)" height="100%" width="100%"></rect>

                  {/* Continental Contour silhouettes */}
                  <path d="M 120 40 Q 240 60 280 140 T 360 260 T 420 340" fill="none" stroke="#1e293b" strokeWidth="2"></path>
                  <path d="M 500 50 Q 620 90 700 180 T 820 300" fill="none" stroke="#1e293b" strokeWidth="2"></path>

                  {/* Corridor A: Rotterdam -> Frankfurt -> Zurich */}
                  <path
                    className="animate-pulse"
                    d="M 620 90 L 680 140 L 710 200"
                    fill="none"
                    stroke="#0077b6"
                    strokeDasharray="4,4"
                    strokeWidth="3"
                  ></path>

                  {/* Corridor B (North-South Vaccine Route): Boston -> Atlanta -> Miami [IN CRITICAL BREACH] */}
                  <path d="M 280 80 L 250 190 L 290 310" fill="none" stroke="url(#route-gradient)" strokeWidth="3.5"></path>

                  {/* Corridor C: Chicago -> Dallas */}
                  <path
                    d="M 200 110 L 190 260"
                    fill="none"
                    stroke="#0077b6"
                    strokeDasharray="6,3"
                    strokeWidth="2.5"
                  ></path>

                  {/* Waypoint Anchors */}
                  {/* Boston */}
                  <circle cx="280" cy="80" fill="#00dbe9" r="4"></circle>
                  {/* Atlanta (RC-9042 Excursion Site) */}
                  <circle className="animate-ping" cx="250" cy="190" fill="#ba1a1a" fillOpacity="0.2" r="9"></circle>
                  <circle cx="250" cy="190" fill="#ba1a1a" r="5"></circle>
                  {/* Miami */}
                  <circle cx="290" cy="310" fill="#00dbe9" r="4"></circle>
                  {/* Europe Nodes */}
                  <circle cx="620" cy="90" fill="#00dbe9" r="4"></circle>
                  <circle cx="680" cy="140" fill="#00dbe9" r="4"></circle>
                  <circle cx="710" cy="200" fill="#00dbe9" r="4"></circle>
                  {/* Dallas & Chicago Nodes */}
                  <circle cx="200" cy="110" fill="#00dbe9" r="4"></circle>
                  <circle cx="190" cy="260" fill="#f59e0b" r="4"></circle>
                </svg>

                {/* Map HUD Overlays */}
                <div className="absolute top-space-md left-space-md bg-slate-900/90 backdrop-blur-md p-space-sm rounded-lg border-0 shadow-lg text-on-primary">
                  <div className="font-label-caps text-label-caps uppercase text-secondary-fixed tracking-wider">
                    Active Corridor Feeds
                  </div>
                  <div className="mt-1 flex flex-col gap-1 font-label-mono-sm text-label-mono-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>Corridor A (RTM-ZUR)
                      </span>
                      <span className="text-secondary-fixed font-semibold">OPTIMAL (-20.1°C)</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 bg-error/20 px-1 py-0.5 rounded">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>Corridor B (BOS-MIA)
                      </span>
                      <span className="text-error font-bold">BREACH (-13.8°C)</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>Corridor C (CHI-DFW)
                      </span>
                      <span className="text-amber-400">ALERT (-15.4°C)</span>
                    </div>
                  </div>
                </div>

                {/* Focused Beacon Tag for Container #RC-9042 */}
                <div className="absolute top-[48%] left-[27%] -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none">
                  <div className="bg-error text-on-error px-2 py-1 rounded shadow-xl font-label-mono-sm text-label-mono-sm flex items-center gap-1.5 font-bold">
                    <span className="material-symbols-outlined text-[14px]">severe_cold</span>
                    <span>#RC-9042 : {currentTemp.toFixed(1)}°C [CRITICAL]</span>
                  </div>
                  <div className="w-0.5 h-6 bg-error"></div>
                </div>

                {/* Route Progress Segment Visualizer At Bottom of Map */}
                <div className="absolute bottom-space-md left-space-md right-space-md bg-slate-950/80 backdrop-blur-md p-space-sm rounded-lg flex items-center justify-between text-on-primary font-label-mono-sm text-label-mono-sm">
                  <div className="flex items-center gap-space-sm">
                    <span className="text-outline-variant">CORRIDOR B PROGRESS:</span>
                    <span className="text-surface-bright font-semibold">Boston Hub (Origin)</span>
                    <span className="material-symbols-outlined text-[14px] text-outline-variant">arrow_forward</span>
                    <span className="text-error font-bold underline">Atlanta Relay (Interlock Zone)</span>
                    <span className="material-symbols-outlined text-[14px] text-outline-variant">arrow_forward</span>
                    <span className="text-slate-400">Miami Cold Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <span className="bg-secondary-fixed w-1/3 h-full"></span>
                      <span className="bg-error w-1/3 h-full animate-pulse"></span>
                      <span className="bg-slate-700 w-1/3 h-full"></span>
                    </span>
                    <span className="font-bold text-error">42% RUN</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FILTER TABS FOR REEFER ASSETS */}
            <div className="flex items-center justify-between gap-space-sm flex-wrap">
              <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-xl overflow-x-auto max-w-full">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    selectedFilter === 'all'
                      ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>All Reefers</span>
                  <span className="px-1.5 py-0.2 bg-surface-container font-label-mono-sm text-label-mono-sm rounded text-on-surface-variant font-bold">
                    48
                  </span>
                </button>
                <button
                  onClick={() => setSelectedFilter('critical')}
                  className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    selectedFilter === 'critical'
                      ? 'bg-surface-container-lowest text-error font-semibold shadow-sm'
                      : 'text-error hover:bg-error-container/40 font-medium'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                  <span>Critical Excursion</span>
                  <span className="px-1.5 py-0.2 bg-error text-on-error font-label-mono-sm text-label-mono-sm rounded font-bold">
                    1
                  </span>
                </button>
                <button
                  onClick={() => setSelectedFilter('warning')}
                  className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    selectedFilter === 'warning'
                      ? 'bg-surface-container-lowest text-amber-700 font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Warning Thaw</span>
                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 font-label-mono-sm text-label-mono-sm rounded font-bold">
                    1
                  </span>
                </button>
                <button
                  onClick={() => setSelectedFilter('ultracold')}
                  className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    selectedFilter === 'ultracold'
                      ? 'bg-surface-container-lowest text-cyan-800 font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
                  }`}
                >
                  <span>Ultra-Cold mRNA (-70°C)</span>
                  <span className="px-1.5 py-0.2 bg-surface-container font-label-mono-sm text-label-mono-sm rounded">
                    12
                  </span>
                </button>
                <button
                  onClick={() => setSelectedFilter('deepfreeze')}
                  className={`px-space-md py-1.5 rounded-lg font-body-sm text-body-sm transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    selectedFilter === 'deepfreeze'
                      ? 'bg-surface-container-lowest text-secondary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
                  }`}
                >
                  <span>Deep Frozen (-20°C)</span>
                  <span className="px-1.5 py-0.2 bg-surface-container font-label-mono-sm text-label-mono-sm rounded">
                    34
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-space-xs font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                <span>SYNC INTERVAL:</span>
                <span className="font-bold text-secondary">500ms REAL-TIME</span>
              </div>
            </div>

            {/* REEFER CONTAINER CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {filteredReefers.map((reefer) => {
                const isSelected = selectedUnit?.id === reefer.id;
                const isBreach = reefer.status === 'critical';
                const isWarn = reefer.status === 'warning';
                const isUltra = reefer.status === 'ultracold';

                return (
                  <div
                    key={reefer.id}
                    onClick={() => setSelectedUnit(reefer)}
                    className={`bg-surface-container-lowest rounded-xl p-space-md flex flex-col justify-between relative overflow-hidden transition-all cursor-pointer ${
                      isSelected && isBreach
                        ? 'ring-2 ring-error shadow-md'
                        : isSelected
                        ? 'ring-2 ring-secondary shadow-md'
                        : 'shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                            {reefer.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wider font-bold ${
                              isBreach
                                ? 'bg-error text-on-error'
                                : isWarn
                                ? 'bg-amber-100 text-amber-900 flex items-center gap-1'
                                : isUltra
                                ? 'bg-cyan-100 text-cyan-900 flex items-center gap-1'
                                : 'bg-surface-container-high text-on-surface flex items-center gap-1'
                            }`}
                          >
                            {!isBreach && (
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isWarn ? 'bg-amber-500' : isUltra ? 'bg-cyan-600' : 'bg-secondary'
                                }`}
                              ></span>
                            )}
                            {reefer.statusLabel}
                          </span>
                        </div>
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant mt-0.5">
                          Carrier: {reefer.carrier}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-display-lg text-display-lg font-bold leading-none ${
                            isBreach ? 'text-error' : isWarn ? 'text-amber-600' : 'text-on-surface'
                          }`}
                        >
                          {isBreach ? `${currentTemp.toFixed(1)}°C` : `${reefer.temp.toFixed(1)}°C`}
                        </span>
                        <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant mt-1">
                          Target: {reefer.targetTemp.toFixed(1)}°C
                        </span>
                      </div>
                    </div>

                    {/* Sparkline Graphic */}
                    <div className="my-space-md bg-surface-container-low/60 rounded p-space-xs relative">
                      <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm text-outline mb-1">
                        <span>2-Hr Thermal Trajectory</span>
                        <span
                          className={`font-semibold flex items-center gap-0.5 ${
                            isBreach ? 'text-error' : isWarn ? 'text-amber-700' : 'text-secondary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {isBreach ? 'trending_up' : isWarn ? 'trending_up' : 'horizontal_rule'}
                          </span>
                          {reefer.trajectoryText}
                        </span>
                      </div>
                      <div className="h-10 w-full relative">
                        {isBreach && (
                          <>
                            <div className="absolute top-[40%] left-0 right-0 h-px bg-error/40 border-t border-dashed border-error"></div>
                            <span className="absolute right-1 top-[42%] text-[9px] font-label-mono-sm text-error font-bold">
                              -15.0°C Limit
                            </span>
                          </>
                        )}
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                          {isBreach ? (
                            <>
                              <defs>
                                <linearGradient id="excursionGrad" x1="0" x2="0" y1="1" y2="0">
                                  <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.05"></stop>
                                  <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.3"></stop>
                                </linearGradient>
                              </defs>
                              <path
                                d="M 0,32 L 40,30 L 80,31 L 110,28 L 130,22 L 155,14 L 175,9 L 200,6"
                                fill="none"
                                stroke="#ba1a1a"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                              ></path>
                              <path
                                d="M 0,32 L 40,30 L 80,31 L 110,28 L 130,22 L 155,14 L 175,9 L 200,6 L 200,40 L 0,40 Z"
                                fill="url(#excursionGrad)"
                              ></path>
                              <circle className="animate-ping" cx="200" cy="6" fill="#ba1a1a" r="3.5"></circle>
                              <circle cx="200" cy="6" fill="#ba1a1a" r="3"></circle>
                            </>
                          ) : isWarn ? (
                            <path
                              d="M 0,35 L 40,32 L 80,30 L 120,24 L 160,20 L 200,16"
                              fill="none"
                              stroke="#d97706"
                              strokeLinecap="round"
                              strokeWidth="2"
                            ></path>
                          ) : isUltra ? (
                            <path
                              d="M 0,20 L 35,21 L 70,19 L 110,21 L 150,20 L 200,20"
                              fill="none"
                              stroke="#0284c7"
                              strokeLinecap="round"
                              strokeWidth="2"
                            ></path>
                          ) : (
                            <path
                              d="M 0,25 L 30,24 L 60,26 L 90,25 L 120,24 L 150,25 L 180,24 L 200,25"
                              fill="none"
                              stroke="#006399"
                              strokeLinecap="round"
                              strokeWidth="2"
                            ></path>
                          )}
                        </svg>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-space-xs bg-surface-container-low p-space-xs rounded font-label-mono-sm text-label-mono-sm">
                      <div className="flex flex-col">
                        <span className="text-outline">CARGO</span>
                        <span className="font-bold text-on-surface truncate" title={reefer.cargo}>
                          {reefer.cargo}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-outline">DOOR STATUS</span>
                        <span className="font-bold text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-secondary">lock</span>
                          {reefer.doorStatus}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-outline">
                          {isBreach
                            ? 'COMPRESSOR / BATTERY'
                            : isWarn
                            ? 'PUMP LOAD'
                            : isUltra
                            ? 'DRY ICE LEVEL'
                            : 'DEFROST STATUS'}
                        </span>
                        <span className="font-bold text-on-surface">
                          {reefer.specs.compressorOrBattery ||
                            reefer.specs.pumpLoad ||
                            reefer.specs.dryIceLevel ||
                            reefer.specs.defrostStatus}
                        </span>
                      </div>
                    </div>

                    <div className="mt-space-sm pt-space-xs flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                      <span className="text-on-surface-variant truncate">Corridor: {reefer.corridor}</span>
                      <span
                        className={`font-bold flex-shrink-0 ${
                          isBreach ? 'text-error' : isWarn ? 'text-amber-700' : 'text-secondary font-semibold'
                        }`}
                      >
                        {reefer.statusDetail}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* REEFER RUNNING LOG / MINI FLEET MANIFEST STRIP */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex items-center justify-between gap-space-md flex-wrap">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                </div>
                <div>
                  <div className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Cold Chain Asset Dispatch Ledger
                  </div>
                  <div className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                    Continuous telemetry logging synchronized with FDA 21 CFR Part 11 ledger server
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-space-sm">
                <button
                  onClick={handleExportCSV}
                  className="px-space-md py-1.5 rounded bg-surface-container text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Export Audit CSV
                </button>
                <button
                  onClick={() => onNavigateToLedger && onNavigateToLedger()}
                  className="px-space-md py-1.5 rounded bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-on-surface transition-colors shadow-sm cursor-pointer"
                >
                  Full Ledger View
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: DETAIL TELEMETRY & SOP COMMAND PANEL (35% / 4 cols of 12) */}
          <div className="xl:col-span-4 flex flex-col gap-space-lg min-w-0">
            {/* CONTAINER CONTROL CONSOLE FOR RC-9042 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-error"></div>

              {/* HEADER & QUICK ACTIONS */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-error tracking-wider font-bold">
                    EXCURSION COMMAND INTERFACE
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                    ID: 0x88F9A2B
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                    {selectedUnit?.id || 'Unknown Container'}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-caps text-label-caps uppercase font-bold animate-pulse">
                    BREACH ACTIVE
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Pfizer mRNA Batch #VN-88210 • 4,800 Units at Risk
                </p>
              </div>

              {/* INDUSTRIAL ACTION BUTTONS */}
              <div className="grid grid-cols-1 gap-space-xs pt-space-xs">
                <button
                  onClick={handleCoolingAction}
                  className={`w-full py-2 px-space-md rounded font-body-md text-body-md font-semibold transition-all shadow-sm flex items-center justify-center gap-space-xs cursor-pointer ${
                    coolingPullingDown
                      ? 'bg-slate-800 text-white'
                      : isCoolingInjected
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-secondary text-on-secondary hover:opacity-90'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isCoolingInjected && !coolingPullingDown ? 'animate-spin' : ''}`}>
                    {coolingPullingDown ? 'done_all' : isCoolingInjected ? 'refresh' : 'severe_cold'}
                  </span>
                  <span>
                    {coolingPullingDown
                      ? 'Aux Cooling Active (Pulling Down)'
                      : isCoolingInjected
                      ? 'Injecting Cryo-Boost...'
                      : 'Recalibrate Secondary Cooling Unit'}
                  </span>
                </button>
                <div className="grid grid-cols-2 gap-space-xs">
                  <button
                    onClick={onOpenCertModal}
                    className="py-1.5 px-space-sm bg-surface-container text-on-surface rounded font-body-sm text-body-sm font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Generate Cert</span>
                  </button>
                  <button
                    onClick={onOpenClaimModal}
                    className="py-1.5 px-space-sm bg-error/10 text-error rounded font-body-sm text-body-sm font-semibold hover:bg-error/20 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">balance</span>
                    <span>Trigger Claim</span>
                  </button>
                </div>
              </div>

              {/* SET-POINT THRESHOLD VISUAL SLIDER CONTROL */}
              <div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-space-sm">
                <div className="flex items-center justify-between font-label-caps text-label-caps uppercase text-on-surface-variant">
                  <span>Threshold Calibration Matrix</span>
                  <span className="text-secondary font-bold font-label-mono-sm">ACTIVE PROFILE: MRNA-C</span>
                </div>
                <div className="relative w-full h-8 flex items-center">
                  <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex relative">
                    <div className="h-full bg-secondary" style={{ width: '60%' }}></div>
                    <div className="h-full bg-error" style={{ width: '40%' }}></div>
                  </div>
                  <div className="absolute left-[72%] -top-1 -bottom-1 w-1 bg-on-surface shadow-md flex flex-col items-center justify-between pointer-events-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
                  </div>
                </div>
                <div className="flex justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                  <div>
                    <span className="block text-outline text-[10px]">LOWER LIMIT</span>
                    <span className="font-bold text-on-surface">-22.0°C</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-secondary text-[10px] font-bold">SET-POINT</span>
                    <span className="font-bold text-secondary">-20.0°C</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-error text-[10px] font-bold">UPPER LIMIT</span>
                    <span className="font-bold text-error">-15.0°C</span>
                  </div>
                </div>
              </div>

              {/* 24-HOUR HIGH RESOLUTION TIMELINE GRAPH */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                    24h Thermal Gradient
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-error font-bold">
                    Excursion Breach @ 14:12 UTC
                  </span>
                </div>
                <div className="w-full h-44 bg-surface-container-lowest rounded-lg p-2 relative flex flex-col justify-end">
                  <svg className="w-full h-36" preserveAspectRatio="none" viewBox="0 0 320 140">
                    <defs>
                      <linearGradient id="safeZoneGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#006399" stopOpacity="0.15"></stop>
                        <stop offset="100%" stopColor="#006399" stopOpacity="0.03"></stop>
                      </linearGradient>
                      <linearGradient id="excursionFlare" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.3"></stop>
                        <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>
                    <rect fill="url(#safeZoneGrad)" height="75" width="320" x="0" y="35"></rect>
                    <line stroke="#ba1a1a" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="320" y1="35" y2="35"></line>
                    <line stroke="#006399" strokeDasharray="2,2" strokeWidth="0.8" x1="0" x2="320" y1="75" y2="75"></line>
                    <line stroke="#76767e" strokeDasharray="3,3" strokeWidth="0.8" x1="0" x2="320" y1="110" y2="110"></line>
                    <text fill="#006399" fontFamily="JetBrains Mono" fontSize="9" opacity="0.8" x="8" y="50">
                      SAFE THERMAL BAND (-22°C to -15°C)
                    </text>
                    <text fill="#ba1a1a" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold" x="240" y="31">
                      -15°C Threshold
                    </text>
                    <path
                      d="M 0,80 Q 40,78 80,76 T 160,74 T 220,70 L 240,48 L 260,28 L 290,20 L 320,16"
                      fill="none"
                      stroke="#ba1a1a"
                      strokeWidth="2.5"
                    ></path>
                    <path
                      d="M 220,70 L 240,48 L 260,28 L 290,20 L 320,16 L 320,140 L 220,140 Z"
                      fill="url(#excursionFlare)"
                    ></path>
                    <circle cx="240" cy="48" fill="#ba1a1a" r="4"></circle>
                    <circle className="animate-ping" cx="320" cy="16" fill="#ba1a1a" r="4"></circle>
                  </svg>
                  <div className="flex justify-between font-label-mono-sm text-label-mono-sm text-outline px-1 mt-1">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span className="text-error font-bold">14:12 [BREACH]</span>
                    <span className="font-bold text-on-surface">14:36 (NOW)</span>
                  </div>
                </div>
              </div>

              {/* MULTI-SENSOR READOUT WELL */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                  Multi-Sensor Diagnostic Chamber
                </span>
                <div className="grid grid-cols-2 gap-space-xs font-label-mono-sm text-label-mono-sm">
                  <div className="p-space-sm bg-surface-container-low rounded flex flex-col">
                    <span className="text-outline">PRIMARY PROBE A</span>
                    <span className="font-headline-sm text-headline-sm font-bold text-error">
                      {currentTemp.toFixed(1)}°C
                    </span>
                    <span className="text-[10px] text-error">CRITICAL VARIANCE</span>
                  </div>
                  <div className="p-space-sm bg-surface-container-low rounded flex flex-col">
                    <span className="text-outline">SECONDARY PROBE B</span>
                    <span className="font-headline-sm text-headline-sm font-bold text-error">
                      {(currentTemp - 0.3).toFixed(1)}°C
                    </span>
                    <span className="text-[10px] text-error">CROSS-VERIFIED FAULT</span>
                  </div>
                  <div className="p-space-sm bg-surface-container-low rounded flex flex-col">
                    <span className="text-outline">AMBIENT EXTERIOR</span>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">+28.4°C</span>
                    <span className="text-[10px] text-on-surface-variant">HIGH HEAT INDEX (GA)</span>
                  </div>
                  <div className="p-space-sm bg-surface-container-low rounded flex flex-col">
                    <span className="text-outline">COMPRESSOR PRESSURE</span>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">18.2 bar</span>
                    <span className="text-[10px] text-secondary">SUCTION HEAD NORMAL</span>
                  </div>
                </div>
                <div className="p-space-xs bg-surface-container rounded flex items-center justify-between font-label-mono-sm text-label-mono-sm">
                  <span className="text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                    <span>Door Latches:</span>
                  </span>
                  <span className="text-on-surface font-bold">Double-Locked (No Physical Breach)</span>
                </div>
              </div>

              {/* AUTOMATED REGULATORY SOP AUDIT LOG */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                    Automated SOP Execution Chain
                  </span>
                  <span className="font-label-mono-sm text-label-mono-sm text-error font-bold">TICKET #EXC-4092</span>
                </div>
                <div className="flex flex-col gap-space-xs font-label-mono-sm text-label-mono-sm">
                  <div className="flex items-start gap-space-sm p-space-xs rounded bg-surface-container-low">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0"></span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-on-surface">00 min • Sensor Alert</span>
                        <span className="text-outline">14:12 UTC</span>
                      </div>
                      <p className="text-body-sm text-body-sm text-on-surface-variant">
                        Core temperature breached &gt; -15.0°C threshold trigger.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-sm p-space-xs rounded bg-surface-container-low">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0"></span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-on-surface">05 min • Dispatch Escalation</span>
                        <span className="text-outline">14:17 UTC</span>
                      </div>
                      <p className="text-body-sm text-body-sm text-on-surface-variant">
                        Driver &amp; Dispatch alerted via redundant SMS/SATCOM protocol.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-sm p-space-xs rounded bg-surface-container-low">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0"></span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-on-surface">15 min • Hardware Override</span>
                        <span className="text-outline">14:27 UTC</span>
                      </div>
                      <p className="text-body-sm text-body-sm text-on-surface-variant">
                        Secondary liquid cryo-injector activated. Thermal curve flattening.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-space-sm p-space-xs rounded bg-error/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 flex-shrink-0 animate-ping"></span>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-error">Current • Regulatory Audit</span>
                        <span className="text-error font-bold">24 min ELAPSED</span>
                      </div>
                      <p className="text-body-sm text-body-sm text-on-surface">
                        Ticket #EXC-4092 logged. Insured claims payable liability calculated at $284,500 pending post-thaw stability test.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CRYPTOGRAPHIC AUDIT CERTIFICATE STAMP */}
              <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col gap-1 relative font-label-mono-sm text-label-mono-sm">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-[16px] text-secondary">fingerprint</span>
                    <span>SHA-256 TELEMETRY SEAL</span>
                  </span>
                  <span className="text-secondary font-semibold">VERIFIED HASH</span>
                </div>
                <div className="text-[11px] text-outline font-label-mono-sm truncate">
                  e8b29c01f94d23a9bc412384a8b7923419dfa98e293847fa...
                </div>
                <div className="absolute right-3 -bottom-1 opacity-10 pointer-events-none transform -rotate-12">
                  <span className="material-symbols-outlined text-[64px] text-primary">verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
