import React, { useState } from 'react';
import { DiagramConfig, DiagramType } from '../data/modulesData';
import { VISUAL_COMPARISONS } from '../data/videoAndJsonData';
import { Eye, Sliders, Thermometer, Aperture, ArrowLeftRight } from 'lucide-react';

interface TechnicalDiagramSVGProps {
  type: DiagramType;
  config?: DiagramConfig;
  compact?: boolean;
}

export const TechnicalDiagramSVG: React.FC<TechnicalDiagramSVGProps> = ({
  type,
  config = {},
  compact = false,
}) => {
  if (type === 'none') return null;

  const heightClass = compact ? 'h-28' : 'h-44';

  if (type === 'color-palette') {
    const swatches = config.swatches || ['#1C1917', '#D97706', '#FAF8F5', '#57534E'];
    return (
      <div className="w-full rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-3">
        <div className="flex items-center justify-between text-[10px] font-mono-code uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
          <span>Paleta Cromática</span>
          <span>HEX</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 h-14">
          {swatches.slice(0, 5).map((hex) => (
            <div key={hex} className="flex flex-col">
              <div
                className="flex-1 rounded-sm border border-stone-300/60 dark:border-stone-700/60"
                style={{ backgroundColor: hex }}
              />
              <span className="text-[10px] font-mono-code text-stone-600 dark:text-stone-400 mt-1 text-center truncate">
                {hex}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'lighting') {
    const angle = config.keyAngle ?? -45;
    const rad = ((angle - 90) * Math.PI) / 180;
    const cx = 120;
    const cy = 66;
    const radius = 44;
    const keyX = cx + Math.cos(rad) * radius;
    const keyY = cy + Math.sin(rad) * radius;
    const fillLevel = config.fillLevel || 'low';

    return (
      <div className="w-full rounded border border-stone-200 dark:border-stone-800 bg-stone-950 text-stone-200 p-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono-code uppercase tracking-wider text-amber-400 mb-1">
          <span>Planta de Iluminación (Vista Superior)</span>
          <span className="text-stone-400">{angle}° · Relleno {fillLevel}</span>
        </div>
        <svg viewBox="0 0 240 132" className={`w-full ${heightClass}`} role="img" aria-label="Diagrama de ubicación de luces">
          <defs>
            <radialGradient id="keyBeam" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Studio Grid */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#292524" strokeDasharray="3 3" />
          {/* Light Cone */}
          <line x1={keyX} y1={keyY} x2={cx} y2={cy} stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx={cx} cy={cy} r="28" fill="url(#keyBeam)" />

          {/* Rim light if active */}
          {config.rimActive && (
            <g>
              <line x1={cx + 38} y1={16} x2={cx} y2={cy - 8} stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="2 2" />
              <circle cx={cx + 38} cy={16} r="5" fill="#38BDF8" />
              <text x={cx + 47} y={19} fill="#7DD3FC" fontSize="8" fontFamily="monospace">RIM</text>
            </g>
          )}

          {/* Fill indicator */}
          {fillLevel !== 'none' && (
            <g>
              <rect x={cx + 46} y={cy + 14} width="12" height="20" rx="2" fill="none" stroke="#A8A29E" strokeWidth="1.2" />
              <text x={cx + 62} y={cy + 27} fill="#A8A29E" fontSize="8" fontFamily="monospace">FILL</text>
            </g>
          )}

          {/* Key Light Source */}
          <circle cx={keyX} cy={keyY} r="7" fill="#FBBF24" stroke="#FEF3C7" strokeWidth="1.5" />
          <text x={keyX > cx ? keyX + 10 : keyX - 32} y={keyY + 3} fill="#FDE68A" fontSize="8" fontFamily="monospace">
            KEY
          </text>

          {/* Subject */}
          <circle cx={cx} cy={cy} r="10" fill="#44403C" stroke="#E7E5E4" strokeWidth="1.5" />
          <text x={cx} y={cy + 3} textAnchor="middle" fill="#FAF8F5" fontSize="7" fontFamily="monospace">
            SUJ
          </text>

          {/* Camera at bottom */}
          <rect x={cx - 9} y="112" width="18" height="12" rx="2" fill="#292524" stroke="#A8A29E" strokeWidth="1.2" />
          <polygon points={`${cx - 5},112 ${cx + 5},112 ${cx + 7},107 ${cx - 7},107`} fill="#78716C" />
          <text x={cx + 15} y="121" fill="#A8A29E" fontSize="8" fontFamily="monospace">CÁMARA</text>
        </svg>
      </div>
    );
  }

  if (type === 'lens-fov') {
    const focal = config.focalMm ?? 50;
    const halfSpread = Math.max(8, Math.min(82, (2400 / focal) * 0.9));
    const camX = 28;
    const camY = 66;
    const endX = 215;
    const topY = Math.max(8, camY - halfSpread);
    const botY = Math.min(124, camY + halfSpread);

    return (
      <div className="w-full rounded border border-stone-200 dark:border-stone-800 bg-stone-950 text-stone-200 p-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono-code uppercase tracking-wider text-amber-400 mb-1">
          <span>Ángulo de Visión Óptico</span>
          <span className="text-stone-400">{focal} mm</span>
        </div>
        <svg viewBox="0 0 240 132" className={`w-full ${heightClass}`} role="img" aria-label={`Ángulo visual para lente ${focal}mm`}>
          <polygon
            points={`${camX},${camY} ${endX},${topY} ${endX},${botY}`}
            fill="#F59E0B"
            fillOpacity="0.14"
            stroke="#FBBF24"
            strokeWidth="1.2"
          />
          <rect x="14" y={camY - 8} width="16" height="16" rx="2" fill="#292524" stroke="#E7E5E4" strokeWidth="1.2" />
          <line x1={camX} y1={camY} x2={endX} y2={camY} stroke="#57534E" strokeDasharray="3 3" />
          <circle cx="135" cy={camY} r="9" fill="#44403C" stroke="#E7E5E4" strokeWidth="1.2" />
          <rect x="195" y={camY - 22} width="8" height="44" rx="1" fill="#57534E" />
          <text x="135" y={camY + 22} textAnchor="middle" fill="#D6D3D1" fontSize="8" fontFamily="monospace">Sujeto</text>
          <text x="199" y={camY + 34} textAnchor="middle" fill="#A8A29E" fontSize="8" fontFamily="monospace">Fondo</text>
          <text x="20" y="18" fill="#FDE68A" fontSize="9" fontFamily="monospace">
            {focal <= 20 ? 'Ultra Amplio' : focal <= 35 ? 'Angular Contextual' : focal <= 60 ? 'Perspectiva Natural' : 'Compresión Tele'}
          </text>
        </svg>
      </div>
    );
  }

  if (type === 'aperture-dof') {
    const fStop = config.fStop ?? 2.8;
    const zoneWidth = Math.max(18, Math.min(130, fStop * 11));
    const focusX = 120;

    return (
      <div className="w-full rounded border border-stone-200 dark:border-stone-800 bg-stone-950 text-stone-200 p-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono-code uppercase tracking-wider text-amber-400 mb-1">
          <span>Zona Nítida / Profundidad de Campo</span>
          <span className="text-stone-400">f/{fStop}</span>
        </div>
        <svg viewBox="0 0 240 120" className={`w-full ${heightClass}`} role="img" aria-label={`Profundidad de campo a f/${fStop}`}>
          <rect x="20" y="34" width="200" height="46" rx="3" fill="#1C1917" stroke="#44403C" />
          <rect
            x={focusX - zoneWidth / 2}
            y="34"
            width={zoneWidth}
            height="46"
            fill="#F59E0B"
            fillOpacity="0.28"
            stroke="#FBBF24"
            strokeWidth="1.5"
          />
          <circle cx={focusX} cy="57" r="8" fill="#FAF8F5" />
          <text x="35" y="61" fill="#78716C" fontSize="8" fontFamily="monospace">DESENFOQUE</text>
          <text x="188" y="61" fill="#78716C" fontSize="8" fontFamily="monospace" textAnchor="middle">BOKEH</text>
          <text x={focusX} y="96" textAnchor="middle" fill="#FDE68A" fontSize="8.5" fontFamily="monospace">
            Plano Nítido (f/{fStop})
          </text>
        </svg>
      </div>
    );
  }

  if (type === 'camera-motion') {
    const m = config.motionType || 'dolly-in';
    return (
      <div className="w-full rounded border border-stone-200 dark:border-stone-800 bg-stone-950 text-stone-200 p-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono-code uppercase tracking-wider text-amber-400 mb-1">
          <span>Trayectoria Espacial de Cámara</span>
          <span className="text-stone-400 uppercase">{m}</span>
        </div>
        <svg viewBox="0 0 240 128" className={`w-full ${heightClass}`} role="img" aria-label={`Diagrama de movimiento ${m}`}>
          <defs>
            <marker id="arrowAmber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#FBBF24" />
            </marker>
          </defs>
          {/* Subject center or top */}
          <circle cx="120" cy="44" r="10" fill="#44403C" stroke="#FAF8F5" strokeWidth="1.5" />
          <text x="120" y="47" textAnchor="middle" fill="#FAF8F5" fontSize="7" fontFamily="monospace">SUJ</text>

          {m === 'orbit' && (
            <g>
              <path
                d="M 65 78 A 62 44 0 1 0 175 78"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
                strokeDasharray="4 2"
                markerEnd="url(#arrowAmber)"
              />
              <rect x="57" y="75" width="14" height="10" rx="2" fill="#292524" stroke="#FBBF24" />
            </g>
          )}
          {m === 'dolly-in' && (
            <g>
              <line x1="120" y1="108" x2="120" y2="66" stroke="#FBBF24" strokeWidth="2.2" markerEnd="url(#arrowAmber)" />
              <rect x="111" y="106" width="18" height="11" rx="2" fill="#292524" stroke="#FBBF24" />
            </g>
          )}
          {m === 'pan' && (
            <g>
              <rect x="111" y="96" width="18" height="11" rx="2" fill="#292524" stroke="#E7E5E4" />
              <path d="M 85 80 Q 120 68 155 80" fill="none" stroke="#FBBF24" strokeWidth="2" markerEnd="url(#arrowAmber)" />
            </g>
          )}
          {m === 'crane-up' && (
            <g>
              <path d="M 62 106 Q 82 52 104 26" fill="none" stroke="#FBBF24" strokeWidth="2" markerEnd="url(#arrowAmber)" />
              <rect x="52" y="102" width="16" height="10" rx="2" fill="#292524" stroke="#FBBF24" />
            </g>
          )}
          {(m === 'tracking' || m === 'steadicam') && (
            <g>
              <line x1="48" y1="96" x2="188" y2="96" stroke="#FBBF24" strokeWidth="2" markerEnd="url(#arrowAmber)" />
              <line x1="65" y1="44" x2="175" y2="44" stroke="#78716C" strokeDasharray="3 3" />
              <rect x="40" y="91" width="16" height="10" rx="2" fill="#292524" stroke="#FBBF24" />
            </g>
          )}
          {m === 'fpv' && (
            <g>
              <path d="M 32 104 C 74 102, 72 24, 120 44 S 176 86, 208 24" fill="none" stroke="#FBBF24" strokeWidth="2" markerEnd="url(#arrowAmber)" />
            </g>
          )}
          {(m === 'zoom' || m === 'rack-focus' || m === 'whip-pan' || m === 'roll' || m === 'parallax' || m === 'static') && (
            <g>
              <rect x="111" y="98" width="18" height="11" rx="2" fill="#292524" stroke="#FBBF24" />
              <line x1="120" y1="96" x2="96" y2="30" stroke="#FBBF24" strokeOpacity="0.5" />
              <line x1="120" y1="96" x2="144" y2="30" stroke="#FBBF24" strokeOpacity="0.5" />
              <circle cx="120" cy="70" r="14" fill="none" stroke="#FBBF24" strokeDasharray="2 2" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Composition / Shot Size / Camera Angle reticles
  const mode = config.overlayMode || 'thirds';
  return (
    <div className="w-full rounded border border-stone-200 dark:border-stone-800 bg-stone-950 text-stone-200 p-2.5">
      <div className="flex items-center justify-between text-[10px] font-mono-code uppercase tracking-wider text-amber-400 mb-1">
        <span>Estructura de Encuadre</span>
        <span className="text-stone-400 uppercase">{mode}</span>
      </div>
      <svg viewBox="0 0 240 128" className={`w-full ${heightClass}`} role="img" aria-label={`Retícula de composición ${mode}`}>
        <rect x="20" y="12" width="200" height="104" fill="#1C1917" stroke="#57534E" strokeWidth="1.2" />
        {(mode === 'thirds' || mode === 'negative-space') && (
          <g stroke="#FBBF24" strokeOpacity="0.45" strokeWidth="0.9">
            <line x1="86" y1="12" x2="86" y2="116" />
            <line x1="153" y1="12" x2="153" y2="116" />
            <line x1="20" y1="46" x2="220" y2="46" />
            <line x1="20" y1="81" x2="220" y2="81" />
            <circle cx={mode === 'negative-space' ? 60 : 153} cy={mode === 'negative-space' ? 88 : 46} r="5" fill="#FBBF24" />
          </g>
        )}
        {(mode === 'symmetry' || mode === 'central') && (
          <g stroke="#FBBF24" strokeOpacity="0.6" strokeWidth="1">
            <line x1="120" y1="12" x2="120" y2="116" strokeDasharray="3 2" />
            <line x1="20" y1="64" x2="220" y2="64" strokeDasharray="3 2" />
            <circle cx="120" cy="64" r="16" fill="none" stroke="#FBBF24" />
          </g>
        )}
        {(mode === 'leading-lines' || mode === 'framing' || mode === 'depth-layers') && (
          <g>
            <line x1="20" y1="116" x2="120" y2="54" stroke="#FBBF24" strokeWidth="1.3" />
            <line x1="220" y1="116" x2="120" y2="54" stroke="#FBBF24" strokeWidth="1.3" />
            <rect x="64" y="24" width="112" height="80" fill="none" stroke="#38BDF8" strokeDasharray="3 2" />
            <circle cx="120" cy="54" r="6" fill="#FBBF24" />
          </g>
        )}
        {(mode === 'gpg' || mode === 'pm' || mode === 'pp') && (
          <g>
            <rect
              x={mode === 'gpg' ? 105 : mode === 'pm' ? 88 : 74}
              y={mode === 'gpg' ? 54 : mode === 'pm' ? 32 : 20}
              width={mode === 'gpg' ? 30 : mode === 'pm' ? 64 : 92}
              height={mode === 'gpg' ? 42 : mode === 'pm' ? 76 : 90}
              fill="#F59E0B"
              fillOpacity="0.16"
              stroke="#FBBF24"
              strokeDasharray="3 2"
            />
            <circle cx="120" cy={mode === 'gpg' ? 68 : 48} r={mode === 'gpg' ? 5 : mode === 'pm' ? 11 : 20} fill="#E7E5E4" />
          </g>
        )}
        {(mode === 'low-angle' || mode === 'birds-eye' || mode === 'dutch') && (
          <g>
            <line
              x1="36"
              y1={mode === 'dutch' ? 92 : 64}
              x2="204"
              y2={mode === 'dutch' ? 36 : 64}
              stroke="#FBBF24"
              strokeWidth="1.4"
              strokeDasharray="4 2"
            />
            <polygon
              points={
                mode === 'low-angle'
                  ? '120,26 104,54 136,54'
                  : mode === 'birds-eye'
                    ? '120,100 104,72 136,72'
                    : '120,42 108,68 132,68'
              }
              fill="#FBBF24"
              fillOpacity="0.4"
              stroke="#FBBF24"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

// ============================================================================
// COMPARACIONES VISUALES LADO A LADO + SIMULADORES ÓPTICOS EN VIVO
// ============================================================================
export const VisualComparisonStrip: React.FC = () => {
  const [selectedAperture, setSelectedAperture] = useState<'1.4' | '2.8' | '5.6' | '11'>('1.4');
  const [selectedKelvin, setSelectedKelvin] = useState<'3200K' | '5500K' | '7200K'>('5500K');

  const apertureBlurMap: Record<string, string> = {
    '1.4': 'blur-md scale-105',
    '2.8': 'blur-[3px] scale-[1.02]',
    '5.6': 'blur-[1px]',
    '11': 'blur-none',
  };

  const kelvinFilterMap: Record<string, { filter: string; tint: string; desc: string }> = {
    '3200K': {
      filter: 'sepia(0.35) saturate(1.25) brightness(0.98)',
      tint: 'bg-amber-500/15',
      desc: 'Luz cálida de tungsteno / atardecer íntimo (ámbar y dorado).',
    },
    '5500K': {
      filter: 'contrast(1.03)',
      tint: 'bg-transparent',
      desc: 'Luz día neutra calibrada (fidelidad documental y editorial).',
    },
    '7200K': {
      filter: 'hue-rotate(15deg) saturate(0.9) brightness(0.95)',
      tint: 'bg-sky-600/20',
      desc: 'Luz fría de hora azul / sombra nublada (tonos azulados introspectivos).',
    },
  };

  return (
    <div className="space-y-10">
      {/* 1. Comparaciones reales con imágenes generadas */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold mb-1">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Comparaciones Visuales Lado a Lado</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              Qué cambia realmente cuando modificas un parámetro
            </h3>
          </div>
          <span className="text-xs font-mono-code text-stone-500 dark:text-stone-400">
            Óptica · Iluminación · Transferencia JSON
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {VISUAL_COMPARISONS.map((comp) => (
            <article
              key={comp.id}
              className="rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs flex flex-col"
            >
              <div className="relative h-56 bg-stone-100 dark:bg-stone-950 overflow-hidden">
                <img
                  src={comp.image}
                  alt={comp.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-400/90 shadow-sm pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2 text-[10px] font-mono-code">
                  <span className="px-2 py-0.5 bg-stone-950/85 text-stone-100 rounded">
                    {comp.leftLabel}
                  </span>
                  <span className="px-2 py-0.5 bg-stone-950/85 text-amber-300 rounded">
                    {comp.rightLabel}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-mono-code text-amber-700 dark:text-amber-400 mb-1">
                    {comp.relatedModule}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {comp.title}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                    {comp.lesson}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                  <div className="text-stone-600 dark:text-stone-400">
                    <strong className="block text-stone-800 dark:text-stone-200 font-semibold">Izquierda</strong>
                    {comp.leftSpecs}
                  </div>
                  <div className="text-stone-600 dark:text-stone-400">
                    <strong className="block text-stone-800 dark:text-stone-200 font-semibold">Derecha</strong>
                    {comp.rightSpecs}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 2. Simuladores interactivos en vivo: Apertura f/ y Temperatura Kelvin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulador de Apertura */}
        <div className="rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                <Aperture className="w-3.5 h-3.5" />
                <span>Simulador de Apertura & Bokeh</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Observa cómo cambia la separación del fondo manteniendo nítido el primer plano.
              </p>
            </div>
            <div className="flex items-center gap-1">
              {(['1.4', '2.8', '5.6', '11'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedAperture(f)}
                  className={`px-2.5 py-1 text-xs font-mono-code rounded border transition-colors ${
                    selectedAperture === f
                      ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                      : 'bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  f/{f}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-48 rounded overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900">
            {/* Background blurred layer */}
            <img
              src="/src/assets/images/mod_territory_memory_1794593014725.jpg"
              alt="Fondo arquitectónico de prueba óptica"
              className={`w-full h-full object-cover transition-all duration-300 ${apertureBlurMap[selectedAperture]}`}
              loading="lazy"
            />
            {/* Foreground sharp subject card */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
              <div className="w-28 h-32 rounded border-2 border-amber-400/90 overflow-hidden shadow-xl bg-stone-950">
                <img
                  src="/src/assets/images/recipe_neo_noir_portrait_1794436191840.jpg"
                  alt="Sujeto en plano de enfoque"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[11px] font-mono-code bg-stone-950/80 text-stone-100 px-2.5 py-1 rounded">
              <span>Diafragma: f/{selectedAperture}</span>
              <span className="text-amber-300">
                {selectedAperture === '1.4'
                  ? 'Bokeh extremo · Aislamiento total'
                  : selectedAperture === '2.8'
                    ? 'Separación editorial limpia'
                    : selectedAperture === '5.6'
                      ? 'Entorno reconocible'
                      : 'Nitidez profunda paisaje'}
              </span>
            </div>
          </div>
        </div>

        {/* Simulador de Temperatura de Color */}
        <div className="rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                <Thermometer className="w-3.5 h-3.5" />
                <span>Simulador de Temperatura (Kelvin)</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Impacto emocional del balance de blancos en una misma escena.
              </p>
            </div>
            <div className="flex items-center gap-1">
              {(['3200K', '5500K', '7200K'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedKelvin(k)}
                  className={`px-2.5 py-1 text-xs font-mono-code rounded border transition-colors ${
                    selectedKelvin === k
                      ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                      : 'bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-48 rounded overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900">
            <img
              src="/src/assets/images/mod_composition_cinematography_1794593015294.jpg"
              alt="Escena arquitectónica con temperatura de color variable"
              style={{ filter: kelvinFilterMap[selectedKelvin].filter }}
              className="w-full h-full object-cover transition-all duration-300"
              loading="lazy"
            />
            <div className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${kelvinFilterMap[selectedKelvin].tint}`} />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 text-[11px] font-mono-code bg-stone-950/80 text-stone-100 px-2.5 py-1 rounded">
              <span className="text-amber-300 shrink-0">{selectedKelvin}</span>
              <span className="truncate">{kelvinFilterMap[selectedKelvin].desc}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
