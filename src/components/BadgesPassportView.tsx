import React, { useState } from 'react';
import { Award, CheckCircle2, Lock, RotateCcw, Sparkles } from 'lucide-react';
import { Mission, PackageId, TRAVEL_PACKAGES } from '../data/yungasData';

interface BadgesPassportViewProps {
  selectedPackageId: PackageId | null;
  completedMissionIds: string[];
  totalPoints: number;
  onSelectPackage: (id: PackageId) => void;
  onResetProgress: () => void;
}

export const BadgesPassportView: React.FC<BadgesPassportViewProps> = ({
  selectedPackageId,
  completedMissionIds,
  totalPoints,
  onSelectPackage,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const activePackage = selectedPackageId ? TRAVEL_PACKAGES[selectedPackageId] : null;
  const missionsToDisplay: Mission[] = activePackage
    ? activePackage.missions
    : [
        ...TRAVEL_PACKAGES.A.missions,
        ...TRAVEL_PACKAGES.B.missions,
        ...TRAVEL_PACKAGES.C.missions,
      ];

  const earnedInView = missionsToDisplay.filter((m) =>
    completedMissionIds.includes(m.id)
  ).length;

  return (
    <section aria-labelledby="pasaporte-titulo" className="space-y-6">
      {/* Summary Header Card */}
      <div className="rounded-[20px] bg-[#2D4F3E] text-[#F8F7F2] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-[#E5A93C]">
            Pasaporte de Explorador · Wayra Experience
          </p>
          <h2 id="pasaporte-titulo" className="text-2xl font-bold">
            Tus Insignias de los Yungas
          </h2>
          <p className="text-sm text-[#F8F7F2]/80 max-w-xl">
            {activePackage
              ? `Mostrando las insignias de tu ${activePackage.name} (${earnedInView} de 3 logradas).`
              : 'Aquí se guardan todas las insignias que ganes en las rutas de los Yungas.'}
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div>
            <p className="text-xs text-[#F8F7F2]/75">Puntos totales</p>
            <p className="font-display text-3xl font-extrabold text-[#E5A93C] tabular-nums">
              {totalPoints}
            </p>
          </div>
          <div className="h-10 w-px bg-[#F8F7F2]/20" aria-hidden="true" />
          <div>
            <p className="text-xs text-[#F8F7F2]/75">Insignias</p>
            <p className="font-display text-3xl font-extrabold tabular-nums">
              {completedMissionIds.length}
            </p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {missionsToDisplay.map((mission) => {
          const unlocked = completedMissionIds.includes(mission.id);
          return (
            <div
              key={mission.id}
              className={`rounded-[20px] p-5 border flex flex-col justify-between gap-4 transition-colors ${
                unlocked
                  ? 'bg-white border-[#5A8259] shadow-sm'
                  : 'bg-white/60 border-[#1E2421]/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 ${
                    unlocked
                      ? mission.isMaxMedal
                        ? 'bg-[#E5A93C] text-[#1E2421]'
                        : 'bg-[#C86D51] text-[#F8F7F2]'
                      : 'bg-[#1E2421]/8 text-[#1E2421]/35'
                  }`}
                >
                  {unlocked ? (
                    mission.isMaxMedal ? (
                      <Sparkles className="w-7 h-7" aria-hidden="true" />
                    ) : (
                      <Award className="w-7 h-7" aria-hidden="true" />
                    )
                  ) : (
                    <Lock className="w-6 h-6" aria-hidden="true" />
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <p className="text-xs font-semibold text-[#5A8259]">
                    {mission.code} · +{mission.points} pts
                  </p>
                  <h3 className="font-display font-bold text-base text-[#1E2421] leading-snug">
                    {mission.badgeTitle}
                  </h3>
                  <p className="text-xs text-[#1E2421]/70">
                    Misión: {mission.title}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E2421]/10 flex items-center justify-between text-xs font-bold">
                {unlocked ? (
                  <span className="inline-flex items-center gap-1.5 text-[#2D4F3E]">
                    <CheckCircle2 className="w-4 h-4 text-[#5A8259]" aria-hidden="true" />
                    {mission.isMaxMedal ? 'Medalla Máxima lograda' : 'Insignia obtenida'}
                  </span>
                ) : (
                  <span className="text-[#1E2421]/55">Por desbloquear en ruta</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions: Choose Package or Reset */}
      <div className="pt-4 border-t border-[#1E2421]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {!activePackage ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[#1E2421]/75 mr-2">Ir directo a una ruta:</span>
            {(['A', 'B', 'C'] as PackageId[]).map((pkgId) => (
              <button
                key={pkgId}
                type="button"
                onClick={() => onSelectPackage(pkgId)}
                className="min-h-[44px] px-4 py-2 rounded-[16px] bg-white border border-[#1E2421]/15 text-sm font-bold text-[#2D4F3E] hover:border-[#5A8259] whitespace-nowrap"
              >
                {TRAVEL_PACKAGES[pkgId].name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#1E2421]/70">
            Tu progreso se guarda automáticamente en este teléfono sin necesidad de internet.
          </p>
        )}

        <div>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-[44px] px-4 py-2 rounded-[16px] text-xs font-bold text-[#C86D51] hover:bg-[#C86D51]/10 inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              Reiniciar recorrido
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1E2421]">¿Borrar avance?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="min-h-[40px] px-4 py-1.5 rounded-[14px] bg-[#C86D51] text-white text-xs font-bold whitespace-nowrap"
              >
                Sí, reiniciar
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[40px] px-3 py-1.5 rounded-[14px] bg-white border border-[#1E2421]/15 text-xs font-bold text-[#1E2421] whitespace-nowrap"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
