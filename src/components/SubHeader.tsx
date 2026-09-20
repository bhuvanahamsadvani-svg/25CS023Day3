import React from 'react';

interface SubHeaderProps {
  integrityIndex?: string;
  activeFleet?: string;
  thermalPreset?: string;
}

export default function SubHeader({
  integrityIndex = '98.4%',
  activeFleet = '48 / 50 UNITS',
  thermalPreset = '-20.0°C to -15.0°C (STANDARD ULTRA-COLD)',
}: SubHeaderProps) {
  return (
    <div 
      id="compliance-subheader-strip"
      className="fixed top-16 left-64 right-0 h-10 bg-surface-container-low px-space-lg z-30 flex items-center justify-between font-label-mono-sm text-label-mono-sm text-on-surface shadow-[0_1px_3px_rgba(11,19,43,0.03)] select-none"
    >
      <div className="flex items-center gap-space-xl overflow-x-auto">
        <div className="flex items-center gap-space-xs shrink-0">
          <span className="text-on-surface-variant">INTEGRITY INDEX:</span>
          <span className="font-semibold text-on-surface">{integrityIndex}</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary ml-1 animate-pulse"></span>
        </div>
        <div className="flex items-center gap-space-xs shrink-0">
          <span className="text-on-surface-variant">REEFER FLEET ACTIVE:</span>
          <span className="font-semibold text-on-surface">{activeFleet}</span>
        </div>
        <div className="hidden md:flex items-center gap-space-xs shrink-0">
          <span className="text-on-surface-variant">THERMAL PRESET:</span>
          <span className="font-semibold text-on-surface">{thermalPreset}</span>
        </div>
      </div>
      <div className="flex items-center gap-space-sm text-on-surface-variant shrink-0">
        <span className="material-symbols-outlined text-[15px] text-secondary">lock</span>
        <span className="font-medium">21 CFR PART 11 ENFORCED</span>
      </div>
    </div>
  );
}
