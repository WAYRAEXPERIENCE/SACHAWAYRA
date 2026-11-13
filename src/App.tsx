import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Compass,
  Map as MapIcon,
  QrCode,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import {
  ALL_MISSIONS,
  HERO_IMAGE,
  Mission,
  PackageId,
  TRAVEL_PACKAGES,
} from './data/yungasData';
import { WayraLogo } from './components/WayraLogo';
import { PackageSelector } from './components/PackageSelector';
import { MissionCard, MissionProgressState } from './components/MissionCard';
import { QrScannerSheet } from './components/QrScannerSheet';
import { BadgesPassportView } from './components/BadgesPassportView';

type ActiveTab = 'ruta' | 'insignias';

interface PersistedState {
  selectedPackageId: PackageId | null;
  missions: Record<string, MissionProgressState>;
}

const STORAGE_KEY = 'sacha_wayra_progress_v1';

const EMPTY_MISSION_STATE: MissionProgressState = {
  qrVerified: false,
  challengeDone: false,
  triviaAnswers: {},
};

function isMissionCompleted(
  mission: Mission,
  progress?: MissionProgressState
): boolean {
  if (!progress) return false;
  const t1 = mission.trivia[0];
  const t2 = mission.trivia[1];
  return (
    progress.challengeDone &&
    progress.triviaAnswers[t1.id] === t1.correctOptionId &&
    progress.triviaAnswers[t2.id] === t2.correctOptionId
  );
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { selectedPackageId: null, missions: {} };
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      selectedPackageId: parsed.selectedPackageId ?? null,
      missions: parsed.missions ?? {},
    };
  } catch {
    return { selectedPackageId: null, missions: {} };
  }
}

export default function App() {
  const [state, setState] = useState<PersistedState>(() => loadInitialState());
  const [activeTab, setActiveTab] = useState<ActiveTab>('ruta');
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);
  const [qrSheetOpen, setQrSheetOpen] = useState(false);
  const [qrTargetMissionId, setQrTargetMissionId] = useState<string | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [qrBannerNotice, setQrBannerNotice] = useState<string | null>(null);

  // Persist offline progress in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors if photos exceed storage
    }
  }, [state]);

  // Handle physical QR code URL parameters (?parada=A1 or ?qr=YUNGAS-A1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paradaParam = (params.get('parada') || params.get('qr') || '').trim().toUpperCase();
    if (!paradaParam) return;

    const matchedMission = ALL_MISSIONS.find(
      (m) => m.id.toUpperCase() === paradaParam || m.qrCode.toUpperCase() === paradaParam
    );

    if (matchedMission) {
      const pkgId = matchedMission.id[0] as PackageId;
      setState((prev) => ({
        selectedPackageId: pkgId,
        missions: {
          ...prev.missions,
          [matchedMission.id]: {
            ...(prev.missions[matchedMission.id] ?? EMPTY_MISSION_STATE),
            qrVerified: true,
          },
        },
      }));
      setExpandedMissionId(matchedMission.id);
      setActiveTab('ruta');
      setQrBannerNotice(`Parada desbloqueada por QR: ${matchedMission.title}`);
    }
  }, []);

  // Automatically expand first uncompleted mission when choosing a package
  useEffect(() => {
    if (!state.selectedPackageId) {
      setExpandedMissionId(null);
      return;
    }
    const pkgMissions = TRAVEL_PACKAGES[state.selectedPackageId].missions;
    if (expandedMissionId && pkgMissions.some((m) => m.id === expandedMissionId)) {
      return;
    }
    const firstPending = pkgMissions.find(
      (m) => !isMissionCompleted(m, state.missions[m.id])
    );
    setExpandedMissionId(firstPending ? firstPending.id : pkgMissions[0].id);
  }, [state.selectedPackageId]);

  const completedMissionIds = useMemo(() => {
    return ALL_MISSIONS.filter((m) =>
      isMissionCompleted(m, state.missions[m.id])
    ).map((m) => m.id);
  }, [state.missions]);

  const verifiedMissionIds = useMemo(() => {
    return ALL_MISSIONS.filter((m) => state.missions[m.id]?.qrVerified).map(
      (m) => m.id
    );
  }, [state.missions]);

  const totalPoints = useMemo(() => {
    return ALL_MISSIONS.reduce((sum, m) => {
      return completedMissionIds.includes(m.id) ? sum + m.points : sum;
    }, 0);
  }, [completedMissionIds]);

  const activePackage = state.selectedPackageId
    ? TRAVEL_PACKAGES[state.selectedPackageId]
    : null;

  const activeCompletedCount = activePackage
    ? activePackage.missions.filter((m) => completedMissionIds.includes(m.id)).length
    : 0;

  const progressTotalCount = activePackage ? 3 : 9;
  const progressDoneCount = activePackage
    ? activeCompletedCount
    : completedMissionIds.length;
  const progressPercent = Math.round((progressDoneCount / progressTotalCount) * 100);

  const handleSelectPackage = (pkgId: PackageId) => {
    setState((prev) => ({
      ...prev,
      selectedPackageId: pkgId,
    }));
    setActiveTab('ruta');
    const firstMission = TRAVEL_PACKAGES[pkgId].missions[0];
    setExpandedMissionId(firstMission.id);
  };

  const handleToggleChallenge = (missionId: string) => {
    setState((prev) => {
      const current = prev.missions[missionId] ?? EMPTY_MISSION_STATE;
      return {
        ...prev,
        missions: {
          ...prev.missions,
          [missionId]: {
            ...current,
            challengeDone: !current.challengeDone,
          },
        },
      };
    });
  };

  const handleSelectTriviaOption = (
    missionId: string,
    questionId: string,
    optionId: 'A' | 'B' | 'C'
  ) => {
    setState((prev) => {
      const current = prev.missions[missionId] ?? EMPTY_MISSION_STATE;
      return {
        ...prev,
        missions: {
          ...prev.missions,
          [missionId]: {
            ...current,
            triviaAnswers: {
              ...current.triviaAnswers,
              [questionId]: optionId,
            },
          },
        },
      };
    });
  };

  const handleSavePhoto = (missionId: string, dataUrl?: string) => {
    setState((prev) => {
      const current = prev.missions[missionId] ?? EMPTY_MISSION_STATE;
      return {
        ...prev,
        missions: {
          ...prev.missions,
          [missionId]: {
            ...current,
            photoDataUrl: dataUrl,
          },
        },
      };
    });
  };

  const handleVerifyMissionQr = (mission: Mission) => {
    const pkgId = mission.id[0] as PackageId;
    setState((prev) => {
      const current = prev.missions[mission.id] ?? EMPTY_MISSION_STATE;
      return {
        selectedPackageId: pkgId,
        missions: {
          ...prev.missions,
          [mission.id]: {
            ...current,
            qrVerified: true,
          },
        },
      };
    });
    setExpandedMissionId(mission.id);
    setActiveTab('ruta');
  };

  const handleResetProgress = () => {
    setState({ selectedPackageId: null, missions: {} });
    setExpandedMissionId(null);
    setQrBannerNotice(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage removal errors
    }
  };

  const openQrModal = (missionId: string | null = null) => {
    setQrTargetMissionId(missionId);
    setQrSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#1E2421] pb-24 md:pb-12">
      {/* Top Bar (Clean 3-Zone Contract on Desktop, Compact on Mobile) */}
      <header className="bg-[#F8F7F2] border-b border-[#1E2421]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Mark + Title */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('ruta');
            }}
            className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E5A93C] rounded-[14px]"
          >
            <WayraLogo className="w-10 h-10 shrink-0" />
            <span className="font-display font-extrabold text-lg sm:text-xl text-[#2D4F3E] tracking-tight">
              Sacha Wayra
            </span>
          </a>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#1E2421]/75"
          >
            <button
              type="button"
              onClick={() => setActiveTab('ruta')}
              className={`min-h-[44px] px-2 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'ruta'
                  ? 'text-[#2D4F3E] border-[#2D4F3E]'
                  : 'border-transparent hover:text-[#2D4F3E]'
              }`}
            >
              Mi Ruta
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('insignias')}
              className={`min-h-[44px] px-2 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeTab === 'insignias'
                  ? 'text-[#2D4F3E] border-[#2D4F3E]'
                  : 'border-transparent hover:text-[#2D4F3E]'
              }`}
            >
              Mis Insignias
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openQrModal(null)}
              className="min-h-[44px] px-4 py-2 rounded-[20px] bg-[#2D4F3E] text-[#F8F7F2] font-display font-bold text-xs sm:text-sm inline-flex items-center gap-2 hover:bg-[#243F31] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E5A93C]"
            >
              <QrCode className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Escanear QR</span>
            </button>
          </div>
        </div>
      </header>

      <main id="inicio" className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-7">
        {/* Hero Card: Saludo, Agencia & Barra de Progreso General */}
        <section
          aria-labelledby="hero-saludo"
          className="relative rounded-[20px] overflow-hidden bg-[#2D4F3E] text-[#F8F7F2] shadow-sm"
        >
          <div className="relative min-h-[250px] sm:min-h-[290px] flex flex-col justify-end p-5 sm:p-8">
            {!heroImgFailed ? (
              <img
                src={HERO_IMAGE}
                alt="Montañas verdes y senderos con neblina en los Yungas de La Paz, Bolivia"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2D4F3E] via-[#3A634E] to-[#5A8259]" />
            )}

            {/* Measured scrim for WCAG AA contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2421]/92 via-[#1E2421]/55 to-[#1E2421]/25" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs sm:text-sm font-semibold text-[#E5A93C]">
                  Wayra Experience · Los Yungas de La Paz, Bolivia
                </p>
                <h1
                  id="hero-saludo"
                  className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight"
                >
                  ¡Hola, Explorador!
                </h1>
                <p className="text-sm sm:text-base text-[#F8F7F2]/90 leading-relaxed max-w-xl">
                  Bienvenido a <strong>Sacha Wayra</strong>, tu compañero de ruta para vivir la cultura, el ritmo y el bosque nuboso de los Yungas.
                </p>
              </div>

              {/* Barra de Progreso General */}
              <div className="w-full lg:w-80 bg-[#1E2421]/70 backdrop-blur-md rounded-[20px] p-4 border border-[#F8F7F2]/15 space-y-2.5 shrink-0">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#F8F7F2]/90">
                    {activePackage
                      ? `Progreso · ${activePackage.name}`
                      : 'Progreso general'}
                  </span>
                  <span className="text-[#E5A93C] tabular-nums font-bold">
                    {totalPoints} pts
                  </span>
                </div>

                <div
                  className="w-full h-3 rounded-full bg-[#F8F7F2]/20 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progreso de misiones completadas"
                >
                  <div
                    className="h-full bg-[#E5A93C] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#F8F7F2]/80 tabular-nums">
                  <span>
                    {progressDoneCount} de {progressTotalCount} misiones
                  </span>
                  <span>{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QR arrival confirmation if opened via URL */}
        {qrBannerNotice && (
          <div className="rounded-[20px] bg-[#5A8259]/15 border border-[#5A8259]/35 px-5 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-[#2D4F3E]">
              <CheckCircle2 className="w-5 h-5 text-[#5A8259] shrink-0" aria-hidden="true" />
              <span>{qrBannerNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setQrBannerNotice(null)}
              className="text-xs font-bold text-[#2D4F3E] min-h-[36px] px-3"
            >
              Cerrar
            </button>
          </div>
        )}

        {activeTab === 'ruta' ? (
          <>
            {/* Aviso Offline: Tarjeta terracota suave */}
            <section
              aria-label="Aviso de modo sin señal"
              className="rounded-[20px] bg-[#C86D51]/12 border border-[#C86D51]/35 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-[14px] bg-[#C86D51] text-[#F8F7F2] flex items-center justify-center shrink-0">
                  <WifiOff className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-sm sm:text-base text-[#1E2421]">
                    Modo Ruta Sin Señal
                  </h2>
                  <p className="text-sm text-[#1E2421]/85 leading-relaxed">
                    Carga esta página antes de salir de La Paz. Escanea los códigos QR en cada parada para desbloquear tus retos sin internet.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openQrModal(null)}
                className="min-h-[48px] px-5 py-3 rounded-[20px] bg-[#C86D51] text-[#F8F7F2] font-display font-bold text-sm inline-flex items-center justify-center gap-2 hover:bg-[#B55E43] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E5A93C]"
              >
                <QrCode className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Validar parada QR</span>
              </button>
            </section>

            {/* Selector de Paquete (Paso previo obligatorio) */}
            <PackageSelector
              selectedPackageId={state.selectedPackageId}
              onSelectPackage={handleSelectPackage}
              completedMissionIds={completedMissionIds}
            />

            {/* Misiones Específicas por Paquete (solo al elegir el paquete) */}
            {activePackage ? (
              <section
                aria-labelledby="misiones-paquete-titulo"
                className="space-y-5 pt-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[#5A8259]">
                      {activePackage.optionLabel} · {activePackage.regionTag}
                    </p>
                    <h2
                      id="misiones-paquete-titulo"
                      className="text-xl sm:text-2xl font-bold text-[#1E2421]"
                    >
                      Tus 3 misiones: {activePackage.name} ({activePackage.subtitle})
                    </h2>
                  </div>

                  <p className="text-sm font-semibold text-[#2D4F3E] tabular-nums">
                    {activeCompletedCount} de 3 misiones completadas
                  </p>
                </div>

                {/* Package Completion Celebration */}
                {activeCompletedCount === 3 && (
                  <div className="rounded-[20px] bg-[#2D4F3E] text-[#F8F7F2] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-[16px] bg-[#E5A93C] text-[#1E2421] flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-display font-bold text-lg text-[#E5A93C]">
                          {activePackage.id === 'C'
                            ? '¡Felicidades! Obtuviste la medalla máxima “Espíritu Sacha Wayra”'
                            : `¡Ruta completada! Terminaste el ${activePackage.name}`}
                        </h3>
                        <p className="text-sm text-[#F8F7F2]/85">
                          Has sumado +300 puntos en esta experiencia con Wayra Experience. Revisa todas tus insignias en tu pasaporte.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('insignias')}
                      className="min-h-[48px] px-5 py-3 rounded-[20px] bg-[#E5A93C] text-[#1E2421] font-display font-bold text-sm hover:bg-[#d89c31] transition-colors whitespace-nowrap shrink-0"
                    >
                      Ver mis insignias
                    </button>
                  </div>
                )}

                {/* Exclusively the 3 missions of the chosen package */}
                <div className="space-y-4">
                  {activePackage.missions.map((mission, idx) => {
                    const mProgress = state.missions[mission.id] ?? EMPTY_MISSION_STATE;
                    const completed = isMissionCompleted(mission, mProgress);

                    return (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        index={idx}
                        progress={mProgress}
                        isCompleted={completed}
                        isExpanded={expandedMissionId === mission.id}
                        onToggleExpand={() =>
                          setExpandedMissionId((prev) =>
                            prev === mission.id ? null : mission.id
                          )
                        }
                        onToggleChallenge={handleToggleChallenge}
                        onSelectTriviaOption={handleSelectTriviaOption}
                        onOpenQrScanner={(id) => openQrModal(id)}
                        onSavePhoto={handleSavePhoto}
                      />
                    );
                  })}
                </div>
              </section>
            ) : (
              <section
                aria-label="Esperando selección de paquete"
                className="rounded-[20px] bg-white border border-[#1E2421]/10 p-7 sm:p-10 text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-[16px] bg-[#5A8259]/15 text-[#2D4F3E] flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#1E2421]">
                  Elige tu paquete arriba para desplegar tus misiones
                </h3>
                <p className="text-sm text-[#1E2421]/70 max-w-md mx-auto leading-relaxed">
                  Al seleccionar el Paquete Vivencial, Cultural o de Naturaleza, verás únicamente las 3 paradas, retos y trivias de tu viaje.
                </p>
              </section>
            )}
          </>
        ) : (
          <BadgesPassportView
            selectedPackageId={state.selectedPackageId}
            completedMissionIds={completedMissionIds}
            totalPoints={totalPoints}
            onSelectPackage={handleSelectPackage}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-xs text-[#1E2421]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>Sacha Wayra · Wayra Experience · Yungas de La Paz, Bolivia</span>
        <span>Turismo vivencial, cultural y de naturaleza con propósito</span>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (<= 8% viewport height, well under 15% cap) */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#F8F7F2]/95 backdrop-blur-md border-t border-[#1E2421]/12 grid grid-cols-3 items-center"
      >
        <button
          type="button"
          onClick={() => setActiveTab('ruta')}
          className={`h-full flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors ${
            activeTab === 'ruta' ? 'text-[#2D4F3E]' : 'text-[#1E2421]/60'
          }`}
        >
          <MapIcon className="w-5 h-5" aria-hidden="true" />
          <span>Mi Ruta</span>
        </button>

        <button
          type="button"
          onClick={() => openQrModal(null)}
          className="h-full flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-[#C86D51]"
        >
          <QrCode className="w-5 h-5" aria-hidden="true" />
          <span>Escanear QR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('insignias')}
          className={`h-full flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors ${
            activeTab === 'insignias' ? 'text-[#2D4F3E]' : 'text-[#1E2421]/60'
          }`}
        >
          <Award className="w-5 h-5" aria-hidden="true" />
          <span>Insignias ({completedMissionIds.length})</span>
        </button>
      </nav>

      {/* Offline QR Scanner / Validator Modal Sheet */}
      <QrScannerSheet
        isOpen={qrSheetOpen}
        targetMissionId={qrTargetMissionId}
        selectedPackageId={state.selectedPackageId}
        verifiedMissionIds={verifiedMissionIds}
        onClose={() => setQrSheetOpen(false)}
        onVerifyMissionQr={handleVerifyMissionQr}
      />
    </div>
  );
}
