import React, { useState } from 'react';
import { NavTab } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SubHeader from './components/SubHeader';
import TelemetryView from './components/TelemetryView';
import ComplianceView from './components/ComplianceView';
import FinancialView from './components/FinancialView';
import BudgetsView from './components/BudgetsView';
import { CertificateModal, ClaimModal } from './components/ModalDialogs';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('fleet-telemetry');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex">
      {/* PERSISTENT LEFT SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        excursionCount={1}
        monitoredCount={48}
      />

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* FIXED APP HEADER */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNotifications={() => setActiveTab('fleet-telemetry')}
        />

        {/* FIXED COMPLIANCE SUB-HEADER */}
        <SubHeader
          integrityIndex="98.4%"
          activeFleet="48 / 50 UNITS"
          thermalPreset="-20.0°C to -15.0°C (STANDARD ULTRA-COLD)"
        />

        {/* SCROLLABLE MAIN VIEWPORT */}
        <main className="mt-26 flex-1 flex flex-col bg-surface min-h-[calc(100vh-6.5rem)]">
          {activeTab === 'fleet-telemetry' && (
            <TelemetryView
              searchQuery={searchQuery}
              onOpenCertModal={() => setIsCertModalOpen(true)}
              onOpenClaimModal={() => setIsClaimModalOpen(true)}
              onNavigateToLedger={() => setActiveTab('financial-ledger-and-billing')}
            />
          )}

          {activeTab === 'compliance-and-audits' && (
            <ComplianceView
              onOpenCertModal={() => setIsCertModalOpen(true)}
              onOpenClaimModal={() => setIsClaimModalOpen(true)}
            />
          )}

          {activeTab === 'financial-ledger-and-billing' && <FinancialView />}

          {activeTab === 'corridor-budgets-and-p-and-l' && <BudgetsView />}
        </main>
      </div>

      {/* INTERACTIVE MODALS */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      <ClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        reeferId="#RC-9042"
      />
    </div>
  );
}
