import React, { useState } from 'react';
import { CheckCircle2, Compass, Drum, Leaf, ArrowRight } from 'lucide-react';
import { PackageId, TRAVEL_PACKAGES, TravelPackage } from '../data/yungasData';

interface PackageSelectorProps {
  selectedPackageId: PackageId | null;
  onSelectPackage: (id: PackageId) => void;
  completedMissionIds: string[];
}

const PACKAGE_ORDER: PackageId[] = ['A', 'B', 'C'];

function getPackageIcon(id: PackageId) {
  switch (id) {
    case 'A':
      return <Leaf className="w-5 h-5" aria-hidden="true" />;
    case 'B':
      return <Drum className="w-5 h-5" aria-hidden="true" />;
    case 'C':
      return <Compass className="w-5 h-5" aria-hidden="true" />;
  }
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({
  selectedPackageId,
  onSelectPackage,
  completedMissionIds,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section aria-labelledby="selector-paquetes-titulo" className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#5A8259]">
            Paso previo obligatorio
          </p>
          <h2
            id="selector-paquetes-titulo"
            className="text-xl sm:text-2xl font-bold text-[#1E2421]"
          >
            Elige tu paquete de viaje
          </h2>
        </div>
        <p className="text-sm text-[#1E2421]/75 max-w-md">
          Selecciona únicamente la ruta que estás recorriendo hoy para ver tus 3 misiones.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {PACKAGE_ORDER.map((pkgId) => {
          const pkg: TravelPackage = TRAVEL_PACKAGES[pkgId];
          const isSelected = selectedPackageId === pkg.id;
          const completedCount = pkg.missions.filter((m) =>
            completedMissionIds.includes(m.id)
          ).length;
          const hasImageError = failedImages[pkg.id];

          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelectPackage(pkg.id)}
              aria-pressed={isSelected}
              className={`group text-left rounded-[20px] overflow-hidden transition-all duration-200 flex flex-col focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#E5A93C] ${
                isSelected
                  ? 'bg-[#2D4F3E] text-[#F8F7F2] shadow-md ring-2 ring-[#2D4F3E]'
                  : 'bg-white text-[#1E2421] border border-[#1E2421]/12 hover:border-[#5A8259] hover:shadow-sm'
              }`}
            >
              {/* 4:3 Image with Zero-Broken-Image fallback */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#5A8259]/20">
                {!hasImageError ? (
                  <img
                    src={pkg.image}
                    alt={pkg.imageAlt}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [pkg.id]: true }))
                    }
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#2D4F3E] to-[#5A8259] text-[#F8F7F2] p-6">
                    {getPackageIcon(pkg.id)}
                    <span className="font-display font-bold text-sm text-center">
                      {pkg.name}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2421]/65 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-semibold text-[#F8F7F2]">
                  <span>{pkg.regionTag}</span>
                  <span className="tabular-nums">
                    {completedCount}/3 completadas
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 text-xs font-semibold ${
                      isSelected ? 'text-[#E5A93C]' : 'text-[#5A8259]'
                    }`}
                  >
                    {getPackageIcon(pkg.id)}
                    <span>{pkg.optionLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pkg.durationLabel}</span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug">
                    {pkg.name} ({pkg.subtitle})
                  </h3>

                  <p
                    className={`text-sm leading-relaxed ${
                      isSelected ? 'text-[#F8F7F2]/85' : 'text-[#1E2421]/75'
                    }`}
                  >
                    {pkg.shortDescription}
                  </p>
                </div>

                {/* Clear single-line action row */}
                <div
                  className={`pt-3 border-t flex items-center justify-between min-h-[44px] ${
                    isSelected ? 'border-[#F8F7F2]/15' : 'border-[#1E2421]/10'
                  }`}
                >
                  {isSelected ? (
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#E5A93C] whitespace-nowrap shrink-0">
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      Paquete activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#2D4F3E] whitespace-nowrap shrink-0">
                      Elegir este paquete
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  )}

                  <span
                    className={`text-xs font-semibold tabular-nums whitespace-nowrap shrink-0 ${
                      isSelected ? 'text-[#F8F7F2]/80' : 'text-[#1E2421]/60'
                    }`}
                  >
                    +300 pts
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
