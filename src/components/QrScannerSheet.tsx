import React, { useEffect, useState } from 'react';
import { QrCode, CheckCircle2, X, MapPin } from 'lucide-react';
import { ALL_MISSIONS, Mission, PackageId, TRAVEL_PACKAGES } from '../data/yungasData';

interface QrScannerSheetProps {
  isOpen: boolean;
  targetMissionId: string | null;
  selectedPackageId: PackageId | null;
  verifiedMissionIds: string[];
  onClose: () => void;
  onVerifyMissionQr: (mission: Mission) => void;
}

export const QrScannerSheet: React.FC<QrScannerSheetProps> = ({
  isOpen,
  targetMissionId,
  selectedPackageId,
  verifiedMissionIds,
  onClose,
  onVerifyMissionQr,
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFeedback(null);
      if (targetMissionId) {
        const m = ALL_MISSIONS.find((item) => item.id === targetMissionId);
        setCodeInput(m ? m.qrCode : '');
      } else {
        setCodeInput('');
      }
    }
  }, [isOpen, targetMissionId]);

  if (!isOpen) return null;

  const activePackage = selectedPackageId ? TRAVEL_PACKAGES[selectedPackageId] : null;
  const missionsToSuggest = activePackage ? activePackage.missions : ALL_MISSIONS.slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = codeInput.trim().toUpperCase();
    const matched = ALL_MISSIONS.find(
      (m) => m.qrCode.toUpperCase() === normalized || m.id.toUpperCase() === normalized
    );

    if (!matched) {
      setFeedback({
        type: 'err',
        text: 'Código no reconocido. Revisa el letrero de madera de tu parada (ej. YUNGAS-A1).',
      });
      return;
    }

    onVerifyMissionQr(matched);
    setFeedback({
      type: 'ok',
      text: `Parada verificada: ${matched.title}. Ya puedes completar el reto y la trivia.`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1E2421]/60 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-sheet-title"
    >
      <div className="w-full sm:max-w-lg bg-[#F8F7F2] text-[#1E2421] rounded-t-[24px] sm:rounded-[24px] shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Drag handle on mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-[#1E2421]/20" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#1E2421]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#2D4F3E] text-[#F8F7F2] flex items-center justify-center">
              <QrCode className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="qr-sheet-title" className="font-display font-bold text-base sm:text-lg">
                Validar código QR de parada
              </h2>
              <p className="text-xs text-[#1E2421]/70">
                Funciona sin conexión en todo el recorrido
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar lector QR"
            className="min-w-[44px] min-h-[44px] rounded-[14px] flex items-center justify-center text-[#1E2421]/70 hover:bg-[#1E2421]/8 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Manual / QR Stop Input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="qr-code-input" className="block text-sm font-semibold text-[#1E2421]">
              Ingresa el código impreso bajo el QR del sendero
            </label>
            <div className="flex gap-2">
              <input
                id="qr-code-input"
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Ej. YUNGAS-A1 o A1"
                className="flex-1 min-h-[48px] px-4 rounded-[16px] bg-white border border-[#1E2421]/20 text-sm font-semibold uppercase tracking-wide focus:outline-none focus:ring-3 focus:ring-[#E5A93C]"
              />
              <button
                type="submit"
                className="min-h-[48px] px-5 rounded-[16px] bg-[#2D4F3E] text-[#F8F7F2] font-display font-bold text-sm hover:bg-[#243F31] transition-colors whitespace-nowrap shrink-0"
              >
                Validar
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3.5 rounded-[14px] text-xs font-semibold flex items-start gap-2 ${
                  feedback.type === 'ok'
                    ? 'bg-[#5A8259]/15 text-[#2D4F3E]'
                    : 'bg-[#C86D51]/15 text-[#C86D51]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{feedback.text}</span>
              </div>
            )}
          </form>

          {/* Quick-Select Paradas */}
          <div className="pt-4 border-t border-[#1E2421]/10 space-y-3">
            <p className="text-xs font-bold text-[#5A8259]">
              {activePackage
                ? `Paradas de tu ${activePackage.name} (toca para registrar)`
                : 'Paradas rápidas de prueba'}
            </p>

            <div className="space-y-2">
              {missionsToSuggest.map((mission) => {
                const isVerified = verifiedMissionIds.includes(mission.id);
                return (
                  <button
                    key={mission.id}
                    type="button"
                    onClick={() => {
                      onVerifyMissionQr(mission);
                      setCodeInput(mission.qrCode);
                      setFeedback({
                        type: 'ok',
                        text: `Parada ${mission.qrCode} verificada: ${mission.title}.`,
                      });
                    }}
                    className={`w-full min-h-[56px] px-4 py-3 rounded-[16px] border text-left flex items-center justify-between gap-3 transition-colors ${
                      isVerified
                        ? 'bg-[#5A8259]/12 border-[#5A8259] text-[#1E2421]'
                        : 'bg-white border-[#1E2421]/12 hover:border-[#5A8259] text-[#1E2421]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#5A8259] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{mission.qrCode}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{mission.stopLabel}</span>
                      </p>
                      <p className="text-sm font-bold truncate mt-0.5">{mission.title}</p>
                    </div>

                    <span className="text-xs font-bold whitespace-nowrap shrink-0 text-[#2D4F3E]">
                      {isVerified ? 'Verificada' : 'Registrar'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
