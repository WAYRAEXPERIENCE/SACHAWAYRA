import React, { useRef, useState } from 'react';
import {
  Award,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  QrCode,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Mission } from '../data/yungasData';

export interface MissionProgressState {
  qrVerified: boolean;
  challengeDone: boolean;
  triviaAnswers: Record<string, 'A' | 'B' | 'C'>;
  photoDataUrl?: string;
}

interface MissionCardProps {
  mission: Mission;
  index: number;
  progress: MissionProgressState;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleChallenge: (missionId: string) => void;
  onSelectTriviaOption: (missionId: string, questionId: string, optionId: 'A' | 'B' | 'C') => void;
  onOpenQrScanner: (missionId: string) => void;
  onSavePhoto: (missionId: string, dataUrl?: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  index,
  progress,
  isCompleted,
  isExpanded,
  onToggleExpand,
  onToggleChallenge,
  onSelectTriviaOption,
  onOpenQrScanner,
  onSavePhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const trivia1 = mission.trivia[0];
  const trivia2 = mission.trivia[1];
  const ans1 = progress.triviaAnswers[trivia1.id];
  const ans2 = progress.triviaAnswers[trivia2.id];
  const isT1Correct = ans1 === trivia1.correctOptionId;
  const isT2Correct = ans2 === trivia2.correctOptionId;

  const stepsCompleted =
    (progress.challengeDone ? 1 : 0) + (isT1Correct ? 1 : 0) + (isT2Correct ? 1 : 0);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);

    if (file.size > 4 * 1024 * 1024) {
      setPhotoError('Elige una foto más liviana (menor a 4 MB) para guardarla sin conexión.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSavePhoto(mission.id, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <article
      id={`mission-${mission.id}`}
      className={`rounded-[20px] transition-colors duration-200 overflow-hidden ${
        isCompleted
          ? 'bg-white border-2 border-[#5A8259] shadow-sm'
          : 'bg-white border border-[#1E2421]/12 shadow-sm'
      }`}
    >
      {/* Header Trigger */}
      <button
        type="button"
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 min-h-[76px] hover:bg-[#F8F7F2]/60 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E5A93C]"
      >
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#5A8259]">
            <span>{mission.code}</span>
            <span aria-hidden="true">·</span>
            <span>{mission.stopLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums text-[#C86D51]">+{mission.points} pts</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[#1E2421] leading-snug">
            {index + 1}. {mission.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#1E2421]/70">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#2D4F3E]">
                <CheckCircle2 className="w-4 h-4 text-[#5A8259]" aria-hidden="true" />
                Misión completada · Insignia: {mission.badgeTitle}
              </span>
            ) : (
              <span className="tabular-nums">
                Progreso: {stepsCompleted} de 3 pasos · Insignia: {mission.badgeTitle}
              </span>
            )}
            {progress.qrVerified && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#2D4F3E]">QR verificado</span>
              </>
            )}
          </div>
        </div>

        <span
          className={`mt-1 w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 transition-colors ${
            isCompleted
              ? 'bg-[#5A8259]/15 text-[#2D4F3E]'
              : 'bg-[#F8F7F2] text-[#2D4F3E]'
          }`}
          aria-hidden="true"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-6 sm:px-6 sm:pb-7 space-y-6 border-t border-[#1E2421]/10 pt-5">
          {/* 1. Historia */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold tracking-wide text-[#5A8259]">
              Historia del lugar
            </p>
            <p className="text-[15px] sm:text-base text-[#1E2421] leading-relaxed">
              {mission.story}
            </p>
          </div>

          {/* 2. Reto Práctico */}
          <div className="pt-5 border-t border-[#1E2421]/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-xs font-bold tracking-wide text-[#C86D51]">
                Reto en ruta
              </p>
              <button
                type="button"
                onClick={() => onOpenQrScanner(mission.id)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#2D4F3E] hover:text-[#C86D51] transition-colors min-h-[44px] self-start sm:self-auto whitespace-nowrap shrink-0"
              >
                <QrCode className="w-4 h-4" aria-hidden="true" />
                {progress.qrVerified
                  ? `Parada verificada (${mission.qrCode})`
                  : `Validar código QR (${mission.qrCode})`}
              </button>
            </div>

            <p className="text-[15px] sm:text-base font-semibold text-[#1E2421] leading-relaxed">
              {mission.challenge}
            </p>

            {/* Primary Challenge Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onToggleChallenge(mission.id)}
                className={`flex-1 min-h-[48px] px-5 py-3 rounded-[20px] font-display font-bold text-sm inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E5A93C] whitespace-nowrap ${
                  progress.challengeDone
                    ? 'bg-[#5A8259] text-white'
                    : 'bg-[#2D4F3E] text-[#F8F7F2] hover:bg-[#243F31]'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>
                  {progress.challengeDone ? 'Reto cumplido en ruta' : 'Marcar reto cumplido'}
                </span>
              </button>

              {mission.allowsPhoto && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                    aria-label={`Adjuntar foto para ${mission.title}`}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[48px] px-5 py-3 rounded-[20px] font-display font-bold text-sm border border-[#2D4F3E]/25 text-[#2D4F3E] bg-[#F8F7F2] hover:bg-[#5A8259]/10 inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E5A93C]"
                  >
                    <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{progress.photoDataUrl ? 'Cambiar foto' : 'Guardar foto'}</span>
                  </button>
                </>
              )}
            </div>

            {photoError && (
              <p className="text-xs font-semibold text-[#C86D51]">{photoError}</p>
            )}

            {progress.photoDataUrl && (
              <div className="relative rounded-[14px] overflow-hidden border border-[#1E2421]/10 bg-[#F8F7F2] max-w-sm">
                <img
                  src={progress.photoDataUrl}
                  alt={`Recuerdo fotográfico de ${mission.title}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
                <div className="px-3 py-2 flex items-center justify-between text-xs text-[#1E2421]/75">
                  <span>Foto guardada en tu teléfono</span>
                  <button
                    type="button"
                    onClick={() => onSavePhoto(mission.id, undefined)}
                    className="inline-flex items-center gap-1 text-[#C86D51] font-semibold min-h-[36px] px-2"
                    aria-label="Quitar foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Quitar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Trivias */}
          <div className="pt-5 border-t border-[#1E2421]/10 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-[#2D4F3E]">
              <HelpCircle className="w-4 h-4 text-[#5A8259]" aria-hidden="true" />
              <span>Trivia de la parada (responde ambas preguntas)</span>
            </div>

            {mission.trivia.map((q, qIdx) => {
              const selectedOpt = progress.triviaAnswers[q.id];
              const isCorrect = selectedOpt === q.correctOptionId;

              return (
                <div key={q.id} className="space-y-2.5">
                  <p className="text-sm sm:text-[15px] font-bold text-[#1E2421]">
                    Trivia {qIdx + 1}: {q.question}
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {q.options.map((opt) => {
                      const isPicked = selectedOpt === opt.id;
                      const isRightOption = opt.id === q.correctOptionId;

                      let btnStyle =
                        'bg-[#F8F7F2] text-[#1E2421] border-[#1E2421]/12 hover:border-[#5A8259]';
                      if (isPicked && isRightOption) {
                        btnStyle =
                          'bg-[#5A8259] text-white border-[#5A8259] font-semibold';
                      } else if (isPicked && !isRightOption) {
                        btnStyle =
                          'bg-[#C86D51]/15 text-[#1E2421] border-[#C86D51] font-semibold';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => onSelectTriviaOption(mission.id, q.id, opt.id)}
                          className={`w-full text-left px-4 py-3 min-h-[48px] rounded-[16px] border text-sm transition-all flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E5A93C] ${btnStyle}`}
                        >
                          <span>
                            <strong className="font-display mr-2">{opt.id})</strong>
                            {opt.text}
                          </span>
                          {isPicked && isRightOption && (
                            <CheckCircle2 className="w-5 h-5 shrink-0 text-[#F8F7F2]" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedOpt && (
                    <p
                      className={`text-xs leading-relaxed ${
                        isCorrect ? 'text-[#2D4F3E] font-semibold' : 'text-[#C86D51] font-semibold'
                      }`}
                    >
                      {isCorrect
                        ? `Correcto: ${q.explanation}`
                        : 'Casi cerca. Pregunta a tu anfitrión o vuelve a intentarlo.'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* 4. Recompensa */}
          <div
            className={`pt-5 border-t border-[#1E2421]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? 'bg-[#E5A93C] text-[#1E2421]'
                    : 'bg-[#F8F7F2] text-[#2D4F3E]/50'
                }`}
              >
                {mission.isMaxMedal ? (
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Award className="w-6 h-6" aria-hidden="true" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#5A8259]">
                  {mission.isMaxMedal ? 'Recompensa y Medalla Máxima' : 'Recompensa de misión'}
                </p>
                <p className="font-display font-bold text-sm sm:text-base text-[#1E2421]">
                  +{mission.points} Puntos · Insignia “{mission.badgeTitle}”
                </p>
              </div>
            </div>

            <div className="text-xs font-bold whitespace-nowrap shrink-0">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1.5 text-[#2D4F3E]">
                  <CheckCircle2 className="w-4 h-4 text-[#5A8259]" aria-hidden="true" />
                  Insignia desbloqueada
                </span>
              ) : (
                <span className="text-[#1E2421]/60">
                  Completa el reto y las 2 trivias
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
