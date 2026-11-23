import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Compass,
  Copy,
  Eye,
  Lightbulb,
  Sliders,
  Sparkles,
  Sun,
  Wand2,
  X,
} from 'lucide-react';
import type { LightingPreset, LightingRigState } from './LightingSimulatorLab';

interface ThreePointLightingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  presets: LightingPreset[];
  activePresetName: string | null;
  onSelectPreset: (preset: LightingPreset) => void;
  rig: LightingRigState;
  onChangeRig: React.Dispatch<React.SetStateAction<LightingRigState>>;
  activeSubject: {
    id: string;
    label: string;
    image: string;
  };
  previewStyles: {
    filter: string;
    keyGradient: string;
    shadowGradient: string;
    rimShadow: string;
    sideGradient: string;
    topGradient: string;
  };
  kelvinInfo: {
    hex: string;
    labelEs: string;
  };
  angleInfo: {
    es: string;
  };
  contrastRatio: string;
  diffuserLabel: string;
  diffuserBlurFactor: number;
  activePrompt: string;
  promptLang: 'es' | 'en';
  onChangePromptLang: (lang: 'es' | 'en') => void;
  onCopyPrompt: () => void;
  copied: boolean;
  onApplyToBuilder: () => void;
}

const CX = 210;
const CY = 162;
const ORBIT_R = 112;

function polarPoint(angleDeg: number, radius: number) {
  // 0 deg = camera front (+Y, bottom), -90 deg = camera-left (-X), +90 deg = camera-right (+X), 180 deg = directly behind (-Y)
  const rad = ((90 - angleDeg) * Math.PI) / 180;
  return {
    x: CX + Math.cos(rad) * radius,
    y: CY + Math.sin(rad) * radius,
  };
}

function buildConePolygon(
  source: { x: number; y: number },
  targetX: number,
  targetY: number,
  halfSpreadPx: number
) {
  const dx = targetX - source.x;
  const dy = targetY - source.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const p1x = targetX + nx * halfSpreadPx;
  const p1y = targetY + ny * halfSpreadPx;
  const p2x = targetX - nx * halfSpreadPx;
  const p2y = targetY - ny * halfSpreadPx;
  return `${source.x.toFixed(1)},${source.y.toFixed(1)} ${p1x.toFixed(1)},${p1y.toFixed(1)} ${p2x.toFixed(1)},${p2y.toFixed(1)}`;
}

const ANGLE_STATIONS = [-90, -45, 0, 45, 90] as const;

export const ThreePointLightingOverlay: React.FC<ThreePointLightingOverlayProps> = ({
  isOpen,
  onClose,
  presets,
  activePresetName,
  onSelectPreset,
  rig,
  onChangeRig,
  activeSubject,
  previewStyles,
  kelvinInfo,
  angleInfo,
  contrastRatio,
  diffuserLabel,
  diffuserBlurFactor,
  activePrompt,
  promptLang,
  onChangePromptLang,
  onCopyPrompt,
  copied,
  onApplyToBuilder,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDraggingKey, setIsDraggingKey] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activePreset = useMemo(
    () => presets.find((p) => p.name === activePresetName) || null,
    [presets, activePresetName]
  );

  // Standard 3-point coordinates derived live from current rig
  const keyPos = useMemo(() => polarPoint(rig.keyAngle, ORBIT_R), [rig.keyAngle]);
  const fillAngle = rig.keyAngle <= 0 ? 45 : -45;
  const fillPos = useMemo(() => polarPoint(fillAngle, ORBIT_R), [fillAngle]);
  const backAngle = rig.keyAngle === 0 ? 180 : rig.keyAngle < 0 ? 148 : -148;
  const backPos = useMemo(() => polarPoint(backAngle, ORBIT_R - 8), [backAngle]);

  // Shadow direction wedge opposite Key Light
  const shadowTip = useMemo(() => {
    const oppositeAngle = rig.keyAngle >= 0 ? rig.keyAngle - 180 : rig.keyAngle + 180;
    return polarPoint(oppositeAngle, 58);
  }, [rig.keyAngle]);

  const shadowCone = useMemo(() => {
    const spread = rig.shadowQuality === 'dura' ? 14 : rig.shadowQuality === 'media' ? 20 : 28;
    return buildConePolygon({ x: CX, y: CY }, shadowTip.x, shadowTip.y, spread);
  }, [shadowTip, rig.shadowQuality]);

  const keyCone = useMemo(() => {
    const spread = 24 + diffuserBlurFactor * 26;
    return buildConePolygon(keyPos, CX, CY, spread);
  }, [keyPos, diffuserBlurFactor]);

  const fillCone = useMemo(() => buildConePolygon(fillPos, CX, CY, 42), [fillPos]);
  const backCone = useMemo(() => buildConePolygon(backPos, CX, CY, 28), [backPos]);

  const shadowOpacity = useMemo(() => {
    const base =
      rig.shadowQuality === 'dura' ? 0.68 : rig.shadowQuality === 'media' ? 0.48 : 0.3;
    return Math.max(0.08, base - (rig.fillIntensity / 100) * 0.42);
  }, [rig.shadowQuality, rig.fillIntensity]);

  const updateKeyAngleFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 420;
    const y = ((clientY - rect.top) / rect.height) * 340;
    const dx = x - CX;
    const dy = y - CY;
    // Invert polarPoint: rad = atan2(dy, dx), angleDeg = 90 - deg
    let deg = Math.round(90 - (Math.atan2(dy, dx) * 180) / Math.PI);
    if (deg > 180) deg -= 360;
    if (deg < -180) deg += 360;
    const clamped = Math.max(-135, Math.min(135, Math.round(deg / 5) * 5));
    onChangeRig((prev) => ({ ...prev, keyAngle: clamped }));
  };

  const applyContrastShortcut = (targetRatio: number) => {
    // ratio = (key + fill) / fill => fill = key / (ratio - 1)
    const computedFill = Math.round(
      Math.max(0, Math.min(100, rig.keyIntensity / Math.max(0.5, targetRatio - 1)))
    );
    onChangeRig((prev) => ({ ...prev, fillIntensity: computedFill }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-5 overflow-y-auto nc-animate-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="three-point-overlay-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[94vh] overflow-y-auto rounded-3xl bg-[#101014] text-[#F4F2ED] border border-white/15 shadow-2xl nc-animate-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-4 bg-[#101014]/95 backdrop-blur-md border-b border-white/10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F8C300]">
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>Overlay Interactivo · Diagrama de Iluminación de 3 Puntos</span>
            </div>
            <h3
              id="three-point-overlay-title"
              className="font-serif text-xl sm:text-2xl font-bold text-[#F4F2ED] mt-0.5 truncate"
            >
              {activePreset ? activePreset.name : 'Configuración personalizada de 3 puntos'}
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 font-mono text-[11px] tabular-nums">
              <span className="text-white/70">
                Ratio <strong className="text-[#F8C300]">{contrastRatio}</strong>
              </span>
              <span className="text-white/25">|</span>
              <span className="inline-flex items-center gap-1.5 text-white/85">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/30"
                  style={{ backgroundColor: kelvinInfo.hex }}
                />
                {rig.kelvin}K
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar overlay de 3 puntos"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono uppercase tracking-wider text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar</span>
            </button>
          </div>
        </div>

        {/* Lighting Setup Switcher Strip */}
        <div className="px-5 sm:px-7 py-3.5 border-b border-white/10 bg-[#15151B]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              Cambiar esquema de iluminación (actualiza diagrama + intensidades)
            </span>
            <span className="font-mono text-[10px] text-white/45 hidden md:inline">
              Tip: arrastra el nodo KEY en el diagrama o ajusta los sliders
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {presets.map((preset) => {
              const isSelected = activePresetName === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className={`shrink-0 text-left px-3 py-2 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[#F8C300] bg-[#F8C300]/15 text-[#F4F2ED]'
                      : 'border-white/10 bg-white/[0.03] text-white/75 hover:border-white/30 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="text-xs font-bold whitespace-nowrap">{preset.name}</div>
                  <div className="font-mono text-[10px] text-white/55 whitespace-nowrap">
                    {preset.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Body: Interactive 3-Point Diagram + Live Preview (Left) | Intensity Sliders (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-5 sm:p-7">
          {/* Left 7 cols: Standard 3-Point Diagram SVG + Live Photo Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-[#09090D] border border-white/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
                  Planta estándar de 3 puntos · Vista cenital interactiva
                </div>
                <span className="font-mono text-[10px] text-[#8FB0FF] tabular-nums">
                  Key {rig.keyAngle}° · Fill {fillAngle > 0 ? `+${fillAngle}°` : `${fillAngle}°`} ·
                  Back {rig.rimEnabled ? `${rig.rimIntensity}%` : 'OFF'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Interactive 3-Point SVG Diagram */}
                <div className="sm:col-span-8">
                  <svg
                    ref={svgRef}
                    viewBox="0 0 420 340"
                    className="w-full h-auto select-none touch-none"
                    role="img"
                    aria-label="Diagrama interactivo estándar de iluminación de 3 puntos con luz principal, relleno y contraluz"
                    onPointerMove={(e) => {
                      if (!isDraggingKey) return;
                      updateKeyAngleFromPointer(e.clientX, e.clientY);
                    }}
                    onPointerUp={() => setIsDraggingKey(false)}
                    onPointerLeave={() => setIsDraggingKey(false)}
                  >
                    <defs>
                      <radialGradient id="keyBeamGrad" cx="50%" cy="50%" r="70%">
                        <stop offset="0%" stopColor={kelvinInfo.hex} stopOpacity="0.62" />
                        <stop offset="100%" stopColor={kelvinInfo.hex} stopOpacity="0.04" />
                      </radialGradient>
                      <radialGradient id="fillBeamGrad" cx="50%" cy="50%" r="70%">
                        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.03" />
                      </radialGradient>
                      <radialGradient id="backBeamGrad" cx="50%" cy="50%" r="70%">
                        <stop offset="0%" stopColor="#F8C300" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#F8C300" stopOpacity="0.04" />
                      </radialGradient>
                    </defs>

                    {/* Studio Backdrop Wall Line */}
                    <line
                      x1="60"
                      y1="26"
                      x2="360"
                      y2="26"
                      stroke="rgba(255,255,255,0.14)"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                    />
                    <text
                      x="210"
                      y="18"
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.4)"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      FONDO DE ESTUDIO
                    </text>

                    {/* Reference Concentric Studio Rings */}
                    <circle
                      cx={CX}
                      cy={CY}
                      r={ORBIT_R}
                      fill="none"
                      stroke="rgba(255,255,255,0.14)"
                      strokeDasharray="4 4"
                    />
                    <circle
                      cx={CX}
                      cy={CY}
                      r={68}
                      fill="none"
                      stroke="rgba(255,255,255,0.07)"
                    />

                    {/* Axis Crosshairs (Camera Axis & Lateral 90° Axis) */}
                    <line
                      x1={CX}
                      y1="38"
                      x2={CX}
                      y2="294"
                      stroke="rgba(255,255,255,0.07)"
                      strokeDasharray="3 4"
                    />
                    <line
                      x1="74"
                      y1={CY}
                      x2="346"
                      y2={CY}
                      stroke="rgba(255,255,255,0.07)"
                      strokeDasharray="3 4"
                    />

                    {/* Camera FOV Frustum */}
                    <polygon
                      points={`${CX},298 ${CX - 54},${CY + 8} ${CX + 54},${CY + 8}`}
                      fill="rgba(50,107,255,0.08)"
                      stroke="rgba(143,176,255,0.22)"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />

                    {/* Clickable Orbit Angle Snap Markers */}
                    {ANGLE_STATIONS.map((ang) => {
                      const pt = polarPoint(ang, ORBIT_R);
                      const labelPt = polarPoint(ang, ORBIT_R + 18);
                      const active = Math.abs(rig.keyAngle - ang) <= 5;
                      return (
                        <g
                          key={ang}
                          className="cursor-pointer"
                          onClick={() => onChangeRig((prev) => ({ ...prev, keyAngle: ang }))}
                        >
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={active ? 6 : 4}
                            fill={active ? '#F8C300' : 'rgba(255,255,255,0.24)'}
                          />
                          <text
                            x={labelPt.x}
                            y={labelPt.y + 3}
                            textAnchor="middle"
                            fill={active ? '#F8C300' : 'rgba(255,255,255,0.45)'}
                            fontSize="8.5"
                            fontFamily="monospace"
                          >
                            {ang > 0 ? `+${ang}°` : `${ang}°`}
                          </text>
                        </g>
                      );
                    })}

                    {/* Projected Shadow Wedge (opposite Key Light) */}
                    <polygon
                      points={shadowCone}
                      fill={`rgba(0,0,0,${shadowOpacity.toFixed(2)})`}
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />

                    {/* 2. FILL LIGHT CONE */}
                    {rig.fillIntensity > 0 && (
                      <polygon
                        points={fillCone}
                        fill="url(#fillBeamGrad)"
                        fillOpacity={Math.max(0.12, rig.fillIntensity / 100)}
                      />
                    )}

                    {/* 3. BACK / RIM LIGHT CONE */}
                    {rig.rimEnabled && rig.rimIntensity > 0 && (
                      <polygon
                        points={backCone}
                        fill="url(#backBeamGrad)"
                        fillOpacity={Math.max(0.18, rig.rimIntensity / 100)}
                      />
                    )}

                    {/* 1. KEY LIGHT CONE */}
                    <polygon
                      points={keyCone}
                      fill="url(#keyBeamGrad)"
                      fillOpacity={Math.max(0.2, rig.keyIntensity / 100)}
                    />

                    {/* Optional Side Light Accent */}
                    {rig.sideEnabled && rig.sideIntensity > 0 && (
                      <g>
                        <line
                          x1={rig.sideDirection === 'izquierda' ? 62 : 358}
                          y1={CY}
                          x2={rig.sideDirection === 'izquierda' ? CX - 26 : CX + 26}
                          y2={CY}
                          stroke="#58A6FF"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                          strokeOpacity={Math.max(0.3, rig.sideIntensity / 100)}
                        />
                        <rect
                          x={rig.sideDirection === 'izquierda' ? 46 : 358}
                          y={CY - 11}
                          width="16"
                          height="22"
                          rx="4"
                          fill="#58A6FF"
                          fillOpacity={Math.max(0.4, rig.sideIntensity / 100)}
                        />
                      </g>
                    )}

                    {/* Optional Top Light Overhead Ring */}
                    {rig.topEnabled && rig.topIntensity > 0 && (
                      <circle
                        cx={CX}
                        cy={CY}
                        r="34"
                        fill="none"
                        stroke="#FFF6D6"
                        strokeWidth="2.5"
                        strokeDasharray="6 4"
                        strokeOpacity={Math.max(0.35, rig.topIntensity / 100)}
                      />
                    )}

                    {/* 2. FILL LIGHT FIXTURE */}
                    <g>
                      <line
                        x1={fillPos.x}
                        y1={fillPos.y}
                        x2={CX}
                        y2={CY}
                        stroke="#60A5FA"
                        strokeWidth="1.5"
                        strokeDasharray="3 4"
                        strokeOpacity={Math.max(0.2, (rig.fillIntensity / 100) * 0.85)}
                      />
                      <circle
                        cx={fillPos.x}
                        cy={fillPos.y}
                        r="15"
                        fill="#17253B"
                        stroke="#60A5FA"
                        strokeWidth="2"
                        strokeOpacity={Math.max(0.3, rig.fillIntensity / 100)}
                      />
                      <text
                        x={fillPos.x}
                        y={fillPos.y + 3}
                        textAnchor="middle"
                        fill="#BFDBFE"
                        fontSize="8.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        FILL
                      </text>
                      <text
                        x={fillPos.x}
                        y={fillPos.y + 26}
                        textAnchor="middle"
                        fill="#93C5FD"
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        {rig.fillIntensity}%
                      </text>
                    </g>

                    {/* 3. BACK / RIM LIGHT FIXTURE */}
                    <g
                      className="cursor-pointer"
                      onClick={() =>
                        onChangeRig((prev) => ({
                          ...prev,
                          rimEnabled: !prev.rimEnabled,
                          rimIntensity: !prev.rimEnabled && prev.rimIntensity === 0 ? 55 : prev.rimIntensity,
                        }))
                      }
                    >
                      <line
                        x1={backPos.x}
                        y1={backPos.y}
                        x2={CX}
                        y2={CY}
                        stroke="#F8C300"
                        strokeWidth="1.75"
                        strokeDasharray="3 3"
                        strokeOpacity={rig.rimEnabled ? Math.max(0.3, rig.rimIntensity / 100) : 0.14}
                      />
                      <circle
                        cx={backPos.x}
                        cy={backPos.y}
                        r="15"
                        fill={rig.rimEnabled ? '#362B05' : '#18181F'}
                        stroke="#F8C300"
                        strokeWidth="2"
                        strokeOpacity={rig.rimEnabled ? Math.max(0.45, rig.rimIntensity / 100) : 0.25}
                      />
                      <text
                        x={backPos.x}
                        y={backPos.y + 3}
                        textAnchor="middle"
                        fill={rig.rimEnabled ? '#F8C300' : 'rgba(255,255,255,0.4)'}
                        fontSize="8"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        BACK
                      </text>
                      <text
                        x={backPos.x}
                        y={backPos.y - 20}
                        textAnchor="middle"
                        fill={rig.rimEnabled ? '#FDE68A' : 'rgba(255,255,255,0.35)'}
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        {rig.rimEnabled ? `RIM ${rig.rimIntensity}%` : 'RIM OFF'}
                      </text>
                    </g>

                    {/* 1. KEY LIGHT FIXTURE (Draggable) */}
                    <g
                      className={isDraggingKey ? 'cursor-grabbing' : 'cursor-grab'}
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setIsDraggingKey(true);
                        updateKeyAngleFromPointer(e.clientX, e.clientY);
                      }}
                    >
                      <line
                        x1={keyPos.x}
                        y1={keyPos.y}
                        x2={CX}
                        y2={CY}
                        stroke={kelvinInfo.hex}
                        strokeWidth="2.5"
                        strokeOpacity={Math.max(0.4, rig.keyIntensity / 100)}
                      />
                      <circle
                        cx={keyPos.x}
                        cy={keyPos.y}
                        r="22"
                        fill={kelvinInfo.hex}
                        fillOpacity="0.16"
                      />
                      <circle
                        cx={keyPos.x}
                        cy={keyPos.y}
                        r="16"
                        fill={kelvinInfo.hex}
                        fillOpacity={Math.max(0.45, rig.keyIntensity / 100)}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <text
                        x={keyPos.x}
                        y={keyPos.y + 3}
                        textAnchor="middle"
                        fill="#101014"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        KEY
                      </text>
                      <text
                        x={keyPos.x}
                        y={keyPos.y + 29}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {rig.keyIntensity}%
                      </text>
                    </g>

                    {/* SUBJECT CENTER (Head + Shoulders Top-Down Silhouette) */}
                    <g>
                      {/* Rim Glow Arc on Subject's Back Edge when Backlight is ON */}
                      {rig.rimEnabled && rig.rimIntensity > 0 && (
                        <path
                          d={`M ${CX - 18} ${CY - 6} A 20 20 0 0 1 ${CX + 18} ${CY - 6}`}
                          fill="none"
                          stroke="#F8C300"
                          strokeWidth="3"
                          strokeOpacity={Math.max(0.35, rig.rimIntensity / 100)}
                        />
                      )}
                      {/* Shoulders */}
                      <ellipse
                        cx={CX}
                        cy={CY}
                        rx="24"
                        ry="12"
                        fill="#23232D"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.5"
                      />
                      {/* Head + Nose facing camera (+Y) */}
                      <circle
                        cx={CX}
                        cy={CY}
                        r="12"
                        fill="#1A1A22"
                        stroke="#F4F2ED"
                        strokeWidth="2"
                      />
                      <polygon
                        points={`${CX - 3},${CY + 11} ${CX + 3},${CY + 11} ${CX},${CY + 16}`}
                        fill="#F4F2ED"
                      />
                      <text
                        x={CX}
                        y={CY + 3}
                        textAnchor="middle"
                        fill="#F4F2ED"
                        fontSize="6.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        SUJETO
                      </text>
                    </g>

                    {/* CAMERA BOTTOM */}
                    <g>
                      <rect
                        x={CX - 22}
                        y="296"
                        width="44"
                        height="20"
                        rx="5"
                        fill="#326BFF"
                        stroke="#93C5FD"
                        strokeWidth="1.5"
                      />
                      <rect x={CX - 8} y="290" width="16" height="6" rx="2" fill="#8FB0FF" />
                      <text
                        x={CX}
                        y="309"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="8"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        CAM
                      </text>
                      <text
                        x={CX}
                        y="330"
                        textAnchor="middle"
                        fill="rgba(143,176,255,0.85)"
                        fontSize="8.5"
                        fontFamily="monospace"
                      >
                        EJE DE CÁMARA (0°)
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Live Mini Subject Preview synced with 3-point sliders */}
                <div className="sm:col-span-4 flex flex-col gap-2.5">
                  <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black aspect-[3/4]">
                    <img
                      src={activeSubject.image}
                      alt={activeSubject.label}
                      className="w-full h-full object-cover transition-all duration-200"
                      style={{ filter: previewStyles.filter }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none transition-all duration-200"
                      style={{ background: previewStyles.shadowGradient }}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-screen transition-all duration-200"
                      style={{ background: previewStyles.keyGradient }}
                    />
                    {rig.sideEnabled && (
                      <div
                        className="absolute inset-0 pointer-events-none mix-blend-screen transition-all duration-200"
                        style={{ background: previewStyles.sideGradient }}
                      />
                    )}
                    {rig.topEnabled && (
                      <div
                        className="absolute inset-0 pointer-events-none mix-blend-screen transition-all duration-200"
                        style={{ background: previewStyles.topGradient }}
                      />
                    )}
                    <div
                      className="absolute inset-0 pointer-events-none transition-all duration-200"
                      style={{ boxShadow: previewStyles.rimShadow }}
                    />
                    <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 font-mono text-[9px] uppercase tracking-wider text-white/90">
                      <Eye className="w-3 h-3 text-[#F8C300]" />
                      Vista en vivo
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded-md bg-black/75 font-mono text-[9px] text-white/85">
                      <span className="truncate">{diffuserLabel}</span>
                      <span className="uppercase text-[#F8C300] shrink-0 ml-1">
                        {rig.globalIntensity}
                      </span>
                    </div>
                  </div>

                  {/* 3-Point Legend Mini Metrics */}
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="rounded-xl bg-white/[0.04] border border-white/10 py-1.5 px-1">
                      <div className="font-mono text-[9px] text-white/50">1. KEY</div>
                      <div className="font-mono text-xs font-bold text-[#F4F2ED] tabular-nums">
                        {rig.keyIntensity}%
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] border border-white/10 py-1.5 px-1">
                      <div className="font-mono text-[9px] text-[#93C5FD]">2. FILL</div>
                      <div className="font-mono text-xs font-bold text-[#93C5FD] tabular-nums">
                        {rig.fillIntensity}%
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/[0.04] border border-white/10 py-1.5 px-1">
                      <div className="font-mono text-[9px] text-[#F8C300]">3. BACK</div>
                      <div className="font-mono text-xs font-bold text-[#F8C300] tabular-nums">
                        {rig.rimEnabled ? `${rig.rimIntensity}%` : 'OFF'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pedagogical Note for Active Setup */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-[#F8C300] shrink-0 mt-0.5" />
              <div className="text-xs text-white/80 leading-relaxed">
                <span className="font-bold text-[#F4F2ED]">
                  Lectura técnica de 3 puntos:{' '}
                </span>
                {activePreset
                  ? activePreset.threePointNote
                  : `Luz principal ${angleInfo.es} al ${rig.keyIntensity}% modelando el volumen, relleno al ${rig.fillIntensity}% controlando un ratio de contraste ${contrastRatio}${
                      rig.rimEnabled
                        ? ` y contraluz al ${rig.rimIntensity}% separando el contorno del fondo.`
                        : ' sin contraluz activo.'
                    }`}
              </div>
            </div>
          </div>

          {/* Right 5 cols: Direct 3-Point Intensity & Angle Sliders */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <div className="rounded-2xl bg-[#16161E] border border-white/10 p-4 sm:p-5 space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] font-bold text-[#F4F2ED]">
                  <Sliders className="w-3.5 h-3.5 text-[#F8C300]" />
                  <span>Sliders de intensidad · 3 puntos</span>
                </div>
                <span className="font-mono text-[10px] text-white/50">Sincronizado</span>
              </div>

              {/* 1. KEY LIGHT */}
              <div className="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#F4F2ED]">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/40"
                      style={{ backgroundColor: kelvinInfo.hex }}
                    />
                    1. Luz Principal (Key Light)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#F8C300] tabular-nums">
                    {rig.keyIntensity}%
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Intensidad de luz principal"
                  min={10}
                  max={100}
                  value={rig.keyIntensity}
                  onChange={(e) =>
                    onChangeRig((prev) => ({ ...prev, keyIntensity: Number(e.target.value) }))
                  }
                  className="w-full accent-[#F8C300] cursor-pointer"
                />

                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/70">Posición / Ángulo Key</span>
                    <span className="font-mono text-white/90 tabular-nums">
                      {rig.keyAngle}° · {angleInfo.es}
                    </span>
                  </div>
                  <input
                    type="range"
                    aria-label="Ángulo de luz principal"
                    min={-135}
                    max={135}
                    step={5}
                    value={rig.keyAngle}
                    onChange={(e) =>
                      onChangeRig((prev) => ({ ...prev, keyAngle: Number(e.target.value) }))
                    }
                    className="w-full accent-[#326BFF] cursor-pointer"
                  />
                  <div className="grid grid-cols-5 gap-1">
                    {ANGLE_STATIONS.map((ang) => (
                      <button
                        key={ang}
                        type="button"
                        onClick={() => onChangeRig((prev) => ({ ...prev, keyAngle: ang }))}
                        className={`py-1 rounded-lg font-mono text-[10px] border transition-colors cursor-pointer ${
                          rig.keyAngle === ang
                            ? 'bg-[#F8C300] text-[#101014] border-transparent font-bold'
                            : 'bg-white/[0.04] text-white/65 border-white/10 hover:text-white'
                        }`}
                      >
                        {ang > 0 ? `+${ang}°` : `${ang}°`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. FILL LIGHT */}
              <div className="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#F4F2ED]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]" />
                    2. Luz de Relleno (Fill Light)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#93C5FD] tabular-nums">
                    {rig.fillIntensity}% · {contrastRatio}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Intensidad de luz de relleno"
                  min={0}
                  max={100}
                  value={rig.fillIntensity}
                  onChange={(e) =>
                    onChangeRig((prev) => ({ ...prev, fillIntensity: Number(e.target.value) }))
                  }
                  className="w-full accent-[#326BFF] cursor-pointer"
                />
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  <span className="font-mono text-[10px] text-white/50">Ratio rápido:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { label: '2:1 Suave', ratio: 2 },
                      { label: '4:1 Editorial', ratio: 4 },
                      { label: '8:1 Drama', ratio: 8 },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => applyContrastShortcut(opt.ratio)}
                        className="px-2 py-1 rounded-md bg-white/[0.06] hover:bg-white/15 border border-white/10 font-mono text-[10px] text-white/80 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. BACK / RIM LIGHT */}
              <div className="p-3.5 rounded-xl bg-black/35 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-[#F4F2ED] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rig.rimEnabled}
                      onChange={(e) =>
                        onChangeRig((prev) => ({
                          ...prev,
                          rimEnabled: e.target.checked,
                          rimIntensity:
                            e.target.checked && prev.rimIntensity === 0 ? 55 : prev.rimIntensity,
                        }))
                      }
                      className="w-4 h-4 accent-[#F8C300]"
                    />
                    3. Contraluz / Separación (Back / Rim)
                  </label>
                  <span className="font-mono text-xs font-bold text-[#F8C300] tabular-nums">
                    {rig.rimEnabled ? `${rig.rimIntensity}%` : 'Apagada'}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Intensidad de contraluz"
                  min={0}
                  max={100}
                  disabled={!rig.rimEnabled}
                  value={rig.rimEnabled ? rig.rimIntensity : 0}
                  onChange={(e) =>
                    onChangeRig((prev) => ({
                      ...prev,
                      rimEnabled: true,
                      rimIntensity: Number(e.target.value),
                    }))
                  }
                  className="w-full accent-[#F8C300] cursor-pointer disabled:opacity-35"
                />
              </div>

              {/* Compact Kelvin Temperature Slider */}
              <div className="pt-1 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-white/80">
                    <Sun className="w-3.5 h-3.5 text-[#F8C300]" />
                    Temperatura Kelvin
                  </span>
                  <span className="font-mono text-white/80 tabular-nums">
                    {rig.kelvin}K · {kelvinInfo.labelEs}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Temperatura Kelvin"
                  min={2700}
                  max={8000}
                  step={100}
                  value={rig.kelvin}
                  onChange={(e) =>
                    onChangeRig((prev) => ({ ...prev, kelvin: Number(e.target.value) }))
                  }
                  className="w-full accent-[#F8C300] cursor-pointer"
                />
                <div
                  className="h-1.5 rounded-full border border-white/10"
                  style={{
                    background: 'linear-gradient(90deg, #FF9E3D 0%, #FFF4E0 52%, #7EB8FF 100%)',
                  }}
                />
              </div>
            </div>

            {/* Live Prompt Output + Action Buttons */}
            <div className="rounded-2xl bg-black/50 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F8C300]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prompt sincronizado
                </span>
                <div className="inline-flex rounded-lg border border-white/15 overflow-hidden">
                  {(['es', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => onChangePromptLang(lang)}
                      className={`px-2 py-0.5 font-mono text-[10px] uppercase cursor-pointer ${
                        promptLang === lang
                          ? 'bg-[#F8C300] text-[#101014] font-bold'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <p className="font-mono text-[11px] text-white/85 leading-relaxed line-clamp-3 select-all">
                {activePrompt}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onCopyPrompt}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#F8C300] text-[#101014] font-mono text-[11px] uppercase tracking-wider font-bold hover:brightness-95 cursor-pointer whitespace-nowrap"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado' : 'Copiar prompt'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onApplyToBuilder();
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#326BFF] text-white font-mono text-[11px] uppercase tracking-wider font-bold hover:brightness-110 cursor-pointer whitespace-nowrap"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Aplicar al Constructor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
