import React, { useState, useEffect } from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNotifications?: () => void;
}

export const PROFILE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuCkRpGlQn_Ai_XUxYXfmIqaxJYqvHle4Md4PTEuoTGSIKmlkWi0wq4cOE8bqUfrO9Y2W6rmlZsLS-bbMYe2Xho_3Hrdy5Zig4fM5Gb_-zcNSNx0cDd8ZL-XaNCDenLb0w1kIceBEPQ1p7568nkIfmA4vsgdBxUxUf3zYErEpWFpXqMgVJT-BQK29EF5kkHdSF8nqfOTKGYpmGfMMnRz5S0FRHwO9GsHhzbQIhL79M_DW_zdsbgJW628vg";

export default function Header({ searchQuery, onSearchChange, onOpenNotifications }: HeaderProps) {
  const [utcTime, setUtcTime] = useState('14:28:09');
  const [estTime, setEstTime] = useState('09:28:09');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // UTC time
      const utcHours = String(now.getUTCHours()).padStart(2, '0');
      const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
      const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${utcHours}:${utcMinutes}:${utcSeconds}`);

      // EST is UTC - 5 (or EDT UTC - 4)
      const estDate = new Date(now.getTime() - 5 * 3600000);
      const estHours = String(estDate.getUTCHours()).padStart(2, '0');
      const estMinutes = String(estDate.getUTCMinutes()).padStart(2, '0');
      const estSeconds = String(estDate.getUTCSeconds()).padStart(2, '0');
      setEstTime(`${estHours}:${estMinutes}:${estSeconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header 
      id="main-app-header"
      className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl z-40 flex items-center justify-between px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
    >
      {/* Search Bar */}
      <div className="flex items-center gap-space-md flex-1 max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            id="global-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-space-md py-space-xs bg-surface-container-low text-on-surface font-label-mono-sm text-label-mono-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/40 placeholder:text-outline"
            placeholder="Search Container ID (e.g. CRYO-8849) or Pharma Manifest..."
            type="text"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Clocks, Alert, Director Profile */}
      <div className="flex items-center gap-space-lg">
        {/* Real-time clocks */}
        <div className="hidden lg:flex items-center gap-space-md font-label-mono-sm text-label-mono-sm text-on-surface-variant">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
            <span className="text-outline">UTC</span>
            <span className="text-on-surface font-medium">{utcTime}</span>
          </div>
          <div className="w-px h-4 bg-surface-container-high"></div>
          <div className="flex items-center gap-space-xs">
            <span className="text-outline">EST</span>
            <span className="text-on-surface font-medium">{estTime}</span>
          </div>
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => {
              setShowNotificationPopup(!showNotificationPopup);
              if (onOpenNotifications) onOpenNotifications();
            }}
            className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-surface-container-lowest animate-pulse"></span>
          </button>

          {/* Quick Notification Dropdown */}
          {showNotificationPopup && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-space-md z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <span className="font-label-caps text-label-caps uppercase text-error font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  1 Active Alert
                </span>
                <span className="text-[11px] font-label-mono-sm text-outline">Real-Time</span>
              </div>
              <div className="mt-2 p-2 bg-error-container/30 rounded-lg flex flex-col gap-1 text-left">
                <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm font-bold text-error">
                  <span>EXCURSION: #RC-9042</span>
                  <span>-13.8°C</span>
                </div>
                <p className="text-body-sm text-[12px] text-on-surface">
                  Pfizer mRNA Batch #VN-88210 breached -15.0°C limit. Automated SOP active.
                </p>
                <span className="text-[10px] text-outline font-label-mono-sm">Corridor B: North-South Vaccine Artery</span>
              </div>
            </div>
          )}
        </div>

        {/* User Director Profile */}
        <div className="flex items-center gap-space-sm pl-space-sm">
          <div className="flex flex-col text-right">
            <span className="font-body-sm text-body-sm font-semibold text-on-surface leading-tight">
              Dr. Marcus Vance
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant leading-tight">
              Supply Chain Compliance Director
            </span>
          </div>
          <img
            alt="Dr. Marcus Vance Profile"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container"
            src={PROFILE_URL}
          />
        </div>
      </div>
    </header>
  );
}
