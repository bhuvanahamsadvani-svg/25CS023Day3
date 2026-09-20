import React from 'react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  excursionCount?: number;
  monitoredCount?: number;
}

export const LOGO_URL = "https://lh3.googleusercontent.com/aida/AEtjO1X3SIlScW7pyjBZy599vILSXPzPNp3nLDgW2FygU9blcS2zEDo9baNkIifJEzw4UQToowY7p1KfLLyGHnTCvsxWPOy3rOSS3wN4nbPnJV8pTqunNJ5sWyJzOuCs_9RSZ9bQ1zzTAa0hvxUkfvNUi1a_mdN0DlC_ZgjKdfmU4awVvvoD61jCmi5nUjMNmxFFC-CMZz-ZuUEZohmcOnqqUr_Sx5-Oa0ZISV5pv9bFbaun7FbQWQaK1IcuhNVe";

export default function Sidebar({
  activeTab,
  onSelectTab,
  excursionCount = 1,
  monitoredCount = 48,
}: SidebarProps) {
  const navItems: { id: NavTab; label: string; icon: string }[] = [
    {
      id: 'fleet-telemetry',
      label: 'Fleet Telemetry',
      icon: 'sensors',
    },
    {
      id: 'compliance-and-audits',
      label: 'Compliance & Audits',
      icon: 'verified',
    },
    {
      id: 'financial-ledger-and-billing',
      label: 'Financial Ledger & Billing',
      icon: 'receipt_long',
    },
    {
      id: 'corridor-budgets-and-p-and-l',
      label: 'Corridor Budgets & P&L',
      icon: 'monitoring',
    },
  ];

  return (
    <aside 
      id="cryotrack-sidebar"
      className="fixed left-0 top-0 h-full w-64 bg-primary-container text-inverse-on-surface z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.08)] select-none"
    >
      {/* Brand Header */}
      <div className="h-16 px-space-md flex items-center justify-between bg-inverse-surface/40">
        <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => onSelectTab('fleet-telemetry')}>
          <img
            alt="CryoTrack Logistics Logo"
            className="h-8 w-auto object-contain"
            src={LOGO_URL}
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-primary tracking-tight font-bold">
              CryoTrack
            </span>
            <span className="font-label-caps text-label-caps tracking-wider text-on-primary-container uppercase">
              Biopharma Telemetry
            </span>
          </div>
        </div>
      </div>

      {/* Monitored Counters */}
      <div className="px-space-md py-space-sm bg-inverse-surface/20 flex flex-col gap-space-xs">
        <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
          <span className="text-on-primary-container flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            CONTAINERS
          </span>
          <span className="text-inverse-on-surface font-semibold">{monitoredCount} MONITORED</span>
        </div>
        <div className="flex items-center justify-between font-label-mono-sm text-label-mono-sm">
          <span className="text-on-primary-container flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-error"></span>
            STATUS
          </span>
          <span className="text-error font-semibold">
            {excursionCount} {excursionCount === 1 ? 'EXCURSION' : 'EXCURSIONS'}
          </span>
        </div>
      </div>

      {/* Section Label */}
      <div className="px-space-md pt-space-md pb-space-xs">
        <span className="font-label-caps text-label-caps tracking-widest text-on-primary-container uppercase">
          Operational Systems
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-space-sm flex flex-col gap-space-xs overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-body-md transition-colors text-left w-full cursor-pointer ${
                isActive
                  ? 'bg-secondary text-on-secondary shadow-[0_1px_3px_rgba(11,19,43,0.12)] font-semibold'
                  : 'text-inverse-on-surface/80 hover:bg-inverse-surface/40 hover:text-inverse-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Gateway Telemetry Footer */}
      <div className="p-space-md bg-inverse-surface/30 flex flex-col gap-space-xs font-label-mono-sm text-label-mono-sm text-on-primary-container">
        <div className="flex justify-between">
          <span>GATEWAY:</span>
          <span className="text-inverse-on-surface font-medium">ONLINE [US-EAST]</span>
        </div>
        <div className="flex justify-between">
          <span>LATENCY:</span>
          <span className="text-secondary-fixed font-medium">24ms CRYPTO-OK</span>
        </div>
      </div>
    </aside>
  );
}
