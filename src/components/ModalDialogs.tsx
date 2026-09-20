import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BaseModal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-surface-container relative">
        <div className="flex items-center justify-between p-space-md bg-surface-container-low border-b border-surface-container">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="p-space-lg">{children}</div>
      </div>
    </div>
  );
}

export function CertificateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="21 CFR Part 11 Telemetry Certificate">
      <div className="flex flex-col gap-space-md font-label-mono-sm text-label-mono-sm">
        <div className="p-space-md bg-surface-container-low rounded-lg border border-secondary/30 relative">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-label-caps text-secondary uppercase text-[10px]">Official Release Record</span>
              <div className="font-bold text-on-surface text-[14px]">CERT-2025-CRYO-0984</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-bold text-[10px]">
              VERIFIED VALID
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-outline block text-[9px]">CONSIGNEE:</span>
              <span className="font-bold text-on-surface">Genentech Labs Inc.</span>
            </div>
            <div>
              <span className="text-outline block text-[9px]">MANIFEST:</span>
              <span className="font-bold text-on-surface">#SHP-88492 (mRNA-1273)</span>
            </div>
            <div>
              <span className="text-outline block text-[9px]">MKT MEAN:</span>
              <span className="font-bold text-secondary">-19.7°C (STABLE)</span>
            </div>
            <div>
              <span className="text-outline block text-[9px]">COMPLIANCE:</span>
              <span className="font-bold text-emerald-600">100% GxP PASS</span>
            </div>
          </div>

          <div className="mt-3 p-2 bg-surface-container-lowest rounded text-[10px] text-outline break-all">
            SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-space-md py-2 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              alert('Certificate downloaded with cryptographic signature.');
              onClose();
            }}
            className="px-space-md py-2 rounded bg-secondary text-on-secondary font-semibold hover:bg-secondary/90 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download Cryptographic PDF
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

export function ClaimModal({
  isOpen,
  onClose,
  reeferId = '#RC-9042',
}: {
  isOpen: boolean;
  onClose: () => void;
  reeferId?: string;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Log 21 CFR Excursion Claim">
      <div className="flex flex-col gap-space-md font-body-sm text-body-sm">
        <div className="p-space-sm bg-error-container/30 text-error rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">warning</span>
          <span className="font-semibold">Excursion Event Active on {reeferId}</span>
        </div>

        <div className="flex flex-col gap-2 font-label-mono-sm text-label-mono-sm">
          <div>
            <label className="text-outline text-[11px] block uppercase">Carrier Liability Assignment</label>
            <input
              type="text"
              readOnly
              value="ThermoTrans Logistics LLC (Rig #812)"
              className="w-full mt-1 p-2 bg-surface-container-low rounded border border-surface-container text-on-surface"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-outline text-[11px] block uppercase">Contractual Penalty</label>
              <input
                type="text"
                readOnly
                value="$4,500.00 USD"
                className="w-full mt-1 p-2 bg-surface-container-low rounded border border-surface-container text-error font-bold"
              />
            </div>
            <div>
              <label className="text-outline text-[11px] block uppercase">Cargo Value at Risk</label>
              <input
                type="text"
                readOnly
                value="$284,500.00 USD"
                className="w-full mt-1 p-2 bg-surface-container-low rounded border border-surface-container text-on-surface font-bold"
              />
            </div>
          </div>
          <div>
            <label className="text-outline text-[11px] block uppercase">Underwriter Policy Reference</label>
            <input
              type="text"
              readOnly
              value="Chubb Pharma Marine #CPM-992-01"
              className="w-full mt-1 p-2 bg-surface-container-low rounded border border-surface-container text-on-surface"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-space-md py-2 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-mono-sm text-label-mono-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert(`Formal Claim Ticket #EXC-4092 registered. Electronic audit trail record created with timestamp.`);
              onClose();
            }}
            className="px-space-md py-2 rounded bg-error text-on-error font-semibold hover:bg-error/90 shadow-sm transition-colors font-label-mono-sm text-label-mono-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            Register CFR-21 Claim
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
