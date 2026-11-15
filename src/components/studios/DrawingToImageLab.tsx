import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  PencilRuler,
  Upload,
  RotateCw,
  Download,
  Copy,
  Check,
  Sparkles,
  ShoppingBag,
  Film,
  RotateCcw,
} from 'lucide-react';
import {
  DRAWING_FIDELITY_LEVELS,
  DRAWING_TARGET_MODES,
  DRAWING_TRANSFORMATION_TABLE,
  STUDIO_MEDIA_ASSETS,
} from '../../data/creativeStudiosData';
import { ResilientImage } from '../ResilientImage';
import type { PromptBuilderState } from '../PromptBuilder';

interface DrawingToImageLabProps {
  onApplyToBuilder: (patch: Partial<PromptBuilderState>) => void;
  onSendToProductLab?: (subject: string) => void;
}

export const DrawingToImageLab: React.FC<DrawingToImageLabProps> = ({
  onApplyToBuilder,
  onSendToProductLab,
}) => {
  const [sourceType, setSourceType] = useState('Boceto a lápiz en papel');
  const [drawingSubject, setDrawingSubject] = useState(
    'Personaje robot amigable con antena de estrella y corazón en el pecho'
  );
  const [preserveDetails, setPreserveDetails] = useState(
    'Conservar la antena superior de estrella, ojos redondos simétricos, placa de corazón en el pecho y proporción regordeta.'
  );
  const [targetModeId, setTargetModeId] = useState('3d-char');
  const [fidelityId, setFidelityId] = useState('high');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Real Upload + Canvas Paper Cleanup Workbench (Paso 1 & Paso 2)
  const [uploadedSketchUrl, setUploadedSketchUrl] = useState<string | null>(null);
  const [sketchFileName, setSketchFileName] = useState('');
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [paperWhiteLevel, setPaperWhiteLevel] = useState<number>(115);
  const [lineContrast, setLineContrast] = useState<number>(135);
  const [desaturatePaper, setDesaturatePaper] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const chosenMode = useMemo(
    () =>
      DRAWING_TARGET_MODES.find((m) => m.id === targetModeId) ||
      DRAWING_TARGET_MODES[0],
    [targetModeId]
  );

  const chosenFidelity = useMemo(
    () =>
      DRAWING_FIDELITY_LEVELS.find((f) => f.id === fidelityId) ||
      DRAWING_FIDELITY_LEVELS[0],
    [fidelityId]
  );

  const handleSketchUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSketchFileName(file.name);
    setRotationDeg(0);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setUploadedSketchUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!uploadedSketchUrl || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const isSwapped = rotationDeg % 180 !== 0;
      const maxDim = 900;
      const baseW = isSwapped ? img.height : img.width;
      const baseH = isSwapped ? img.width : img.height;
      const scale = Math.max(baseW, baseH) > maxDim ? maxDim / Math.max(baseW, baseH) : 1;

      canvas.width = Math.round(baseW * scale);
      canvas.height = Math.round(baseH * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotationDeg * Math.PI) / 180);
      ctx.filter = `brightness(${paperWhiteLevel}%) contrast(${lineContrast}%) ${
        desaturatePaper ? 'grayscale(100%)' : ''
      }`;
      const drawW = Math.round(img.width * scale);
      const drawH = Math.round(img.height * scale);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    };
    img.src = uploadedSketchUrl;
  }, [uploadedSketchUrl, rotationDeg, paperWhiteLevel, lineContrast, desaturatePaper]);

  const downloadCleanSketch = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `boceto-limpio-${sketchFileName || 'dibujo'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const generatedDrawingPromptEn = useMemo(() => {
    return `Transform the uploaded ${sourceType} showing "${drawingSubject}" into ${chosenMode.en}. ${chosenFidelity.en}. Specific author elements to keep untouched: ${preserveDetails}. Studio-grade coherence without inventing unrelated elements.`;
  }, [sourceType, drawingSubject, chosenMode, chosenFidelity, preserveDetails]);

  const generatedDrawingPromptEs = useMemo(() => {
    return `Transformar el ${sourceType.toLowerCase()} adjunto ("${drawingSubject}") a estilo ${chosenMode.label}. ${chosenFidelity.es}. Elementos específicos del autor que deben mantenerse: ${preserveDetails}.`;
  }, [sourceType, drawingSubject, chosenMode, chosenFidelity, preserveDetails]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header + Mandatory Visual Transformation Studies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300]">
              <span>MÓDULO 13 · DRAWING TO IMAGE LAB</span>
              <span aria-hidden="true">·</span>
              <span>DEL TRAZO EN PAPEL A LA REALIDAD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] text-balance">
              Convierte tus dibujos en papel, croquis y bocetos en ilustraciones, 3D o fotografía
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
              Sube la fotografía o escaneo de cualquier dibujo hecho a mano, limpia sombras de papel en Canvas, controla el nivel de fidelidad a tu silueta original y llévalo luego hacia Product Lab o Video.
            </p>
          </div>

          <div className="text-xs font-mono-code text-[#5B5B66] dark:text-[#A09E97] pt-2 border-t border-[#DEDAD0] dark:border-[#26262E]">
            Flujo completo: 1. Subir dibujo → 2. Limpiar papel → 3. Elegir lenguaje → 4. Controlar fidelidad → 5. Prompt → 6. Producir
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden border border-[#DEDAD0] dark:border-[#26262E] bg-[#101014] flex flex-col">
            <ResilientImage
              src={STUDIO_MEDIA_ASSETS.drawingTo3dRender}
              alt="Transformación de boceto infantil en papel a personaje 3D de cerámica vidriada conservando silueta exacta"
              aspectRatio="16:9"
              containerClassName="w-full"
            />
            <div className="p-3 text-xs text-[#F4F2ED]">
              <strong className="text-[#F8C300] block font-mono-code text-[10px]">
                RETO 04 · BOCETO INFANTIL / JUGUETE → PERSONAJE 3D
              </strong>
              Misma silueta y detalles de autor convertidos a render táctil de cerámica.
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#DEDAD0] dark:border-[#26262E] bg-[#101014] flex flex-col">
            <ResilientImage
              src={STUDIO_MEDIA_ASSETS.drawingArchRender}
              alt="Transformación de croquis arquitectónico a mano alzada sobre papel calco en pabellón arquitectónico real iluminado con sol"
              aspectRatio="16:9"
              containerClassName="w-full"
            />
            <div className="p-3 text-xs text-[#F4F2ED]">
              <strong className="text-[#F8C300] block font-mono-code text-[10px]">
                CROQUIS A MANO → RENDER ARQUITECTÓNICO
              </strong>
              Perspectiva fiel de papel transformada en madera, hormigón y luz solar.
            </div>
          </div>
        </div>
      </div>

      {/* Paso 1 & Paso 2: Upload & Real HTML5 Canvas Paper Cleanup */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DEDAD0] dark:border-[#26262E] pb-4">
          <div>
            <div className="text-xs font-mono-code font-bold text-[#326BFF] dark:text-[#F8C300]">
              PASO 1 Y 2 · CARGAR BOCETO Y LIMPIAR SOMBRAS DEL PAPEL (CANVAS REAL)
            </div>
            <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
              Prepara tu dibujo antes de enviarlo a la IA generativa
            </h3>
          </div>
          <label className="w-full sm:w-auto justify-center text-center px-4 py-2.5 min-h-[44px] text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg cursor-pointer inline-flex items-center gap-2 shrink-0">
            <Upload className="w-4 h-4 shrink-0" />
            <span>{uploadedSketchUrl ? 'Cambiar dibujo' : 'Subir dibujo o foto de boceto'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleSketchUpload}
              className="sr-only"
            />
          </label>
        </div>

        {!uploadedSketchUrl ? (
          <div className="p-8 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-dashed border-[#D4D0C5] dark:border-[#2C2C36] text-center space-y-2">
            <PencilRuler className="w-7 h-7 mx-auto text-[#7545D6] dark:text-[#F8C300]" />
            <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED]">
              Sube la foto tomada con celular o escaneo de tu dibujo en papel
            </p>
            <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] max-w-xl mx-auto">
              Aquí podrás rotar el encuadre, blanquear el papel eliminando sombras de fotografía y reforzar el trazo en tiempo real para descargarlo limpio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono-code font-bold text-[#5B5B66] dark:text-[#A09E97]">
                  DIBUJO ORIGINAL ({sketchFileName})
                </div>
                <img
                  src={uploadedSketchUrl}
                  alt="Dibujo original subido por el autor"
                  className="w-full h-72 object-contain rounded-xl bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono-code font-bold text-[#326BFF] dark:text-[#F8C300]">
                  BOCETO PREPARADO (FONDO LIMPIO Y TRAZO REFORZADO)
                </div>
                <canvas
                  ref={canvasRef}
                  className="w-full h-72 object-contain rounded-xl bg-white border border-[#DEDAD0] dark:border-[#26262E]"
                />
              </div>
            </div>

            <div className="lg:col-span-4 p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono-code font-bold">Controles de limpieza</span>
                <button
                  type="button"
                  onClick={() => {
                    setRotationDeg(0);
                    setPaperWhiteLevel(100);
                    setLineContrast(100);
                    setDesaturatePaper(false);
                  }}
                  className="text-[11px] font-mono-code text-[#326BFF] hover:underline inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Original</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setRotationDeg((prev) => (prev + 90) % 360)}
                className="w-full py-2 px-3 rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] bg-white dark:bg-[#16161C] font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotar 90° ({rotationDeg}°)</span>
              </button>

              <div>
                <div className="flex justify-between font-mono-code mb-1">
                  <span>Blanquear papel / quitar sombra</span>
                  <span className="tabular-nums">{paperWhiteLevel}%</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={170}
                  value={paperWhiteLevel}
                  onChange={(e) => setPaperWhiteLevel(Number(e.target.value))}
                  className="w-full accent-[#326BFF]"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono-code mb-1">
                  <span>Reforzar contraste del trazo</span>
                  <span className="tabular-nums">{lineContrast}%</span>
                </div>
                <input
                  type="range"
                  min={90}
                  max={230}
                  value={lineContrast}
                  onChange={(e) => setLineContrast(Number(e.target.value))}
                  className="w-full accent-[#326BFF]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={desaturatePaper}
                  onChange={(e) => setDesaturatePaper(e.target.checked)}
                  className="accent-[#326BFF]"
                />
                <span>Convertir papel a tinta neutra B&N</span>
              </label>

              <button
                type="button"
                onClick={downloadCleanSketch}
                className="w-full py-2.5 px-3 text-xs font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar boceto limpio (PNG)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Paso 3, 4, 5 & 6: Transformation Modes + Fidelity Control + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
          <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
            Paso 3–5 · Configurar Transformación y Fidelidad
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono-code font-bold block">Técnica del original</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              >
                <option value="Boceto a lápiz en papel">Boceto a lápiz en papel</option>
                <option value="Dibujo infantil colorido">Dibujo infantil</option>
                <option value="Croquis arquitectónico a mano">Croquis arquitectónico</option>
                <option value="Diseño de juguete o producto">Diseño de juguete o producto</option>
                <option value="Dibujo a tinta / marcador">Dibujo a tinta / marcador</option>
                <option value="Acuarela sobre papel">Acuarela sobre papel</option>
                <option value="Garabato espontáneo">Garabato libre</option>
                <option value="Collage físico recortado">Collage físico</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono-code font-bold block">¿Qué dibujaste?</label>
              <input
                type="text"
                value={drawingSubject}
                onChange={(e) => setDrawingSubject(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-mono-code font-bold block">
              Paso 3 · Elige modo de transformación (14 modos)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DRAWING_TARGET_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTargetModeId(m.id)}
                  className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                    targetModeId === m.id
                      ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                      : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-mono-code font-bold block">
              Paso 4 · Control conceptual de fidelidad al trazo
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DRAWING_FIDELITY_LEVELS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFidelityId(f.id)}
                  className={`p-2.5 rounded-xl border text-left transition-colors ${
                    fidelityId === f.id
                      ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                      : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E]'
                  }`}
                >
                  <div className="text-xs font-bold">{f.label}</div>
                  <p className="text-[10px] opacity-85 mt-0.5 leading-snug">{f.summary}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-mono-code font-bold block">
              Elementos clave del autor que deben conservarse intactos
            </label>
            <textarea
              rows={2}
              value={preserveDetails}
              onChange={(e) => setPreserveDetails(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
            />
          </div>
        </div>

        {/* Paso 5 & 6 Output + Cross-Module Flow */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F4F2ED]">
                Prompt de Transformación (EN / ES)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(generatedDrawingPromptEn, 'draw-en')}
                className="px-3 py-1.5 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5"
              >
                {copiedId === 'draw-en' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'draw-en' ? 'Copiado (EN)' : 'Copiar EN'}</span>
              </button>
            </div>

            <p className="p-3.5 rounded-xl bg-[#101014] text-[#F4F2ED] text-xs font-mono-code leading-relaxed">
              {generatedDrawingPromptEn}
            </p>
            <p className="p-3.5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-xs leading-relaxed">
              {generatedDrawingPromptEs}
            </p>

            {/* Cross-Module Pipeline: Drawing -> Product Lab / Builder / Video */}
            <div className="pt-1 space-y-2">
              <div className="text-[11px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                FLUJO CRUZADO ENTRE MÓDULOS (DIBUJO → PRODUCTO → VIDEO)
              </div>
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                {onSendToProductLab && (
                  <button
                    type="button"
                    onClick={() => onSendToProductLab(drawingSubject)}
                    className="px-3 py-2.5 min-h-[42px] text-xs font-bold rounded-lg bg-[#7545D6] hover:bg-[#5e34b5] text-white inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                    <span>Llevar a Product Lab</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    onApplyToBuilder({
                      mode: 'photo',
                      subject: generatedDrawingPromptEn,
                      visualStyle: chosenMode.label,
                    })
                  }
                  className="px-3 py-2.5 min-h-[42px] text-xs font-bold rounded-lg bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Abrir en Constructor</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onApplyToBuilder({
                      mode: 'video',
                      subject: `${generatedDrawingPromptEn} — Bring the transformed character/scene to life with subtle natural motion and gentle 24fps dolly-in`,
                      motion: 'Slow smooth dolly-in moving physically towards the subject',
                      fps: '24 fps',
                    })
                  }
                  className="px-3 py-2.5 min-h-[42px] text-xs font-bold rounded-lg bg-[#326BFF] hover:bg-[#2555d6] text-white inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Film className="w-3.5 h-3.5 shrink-0" />
                  <span>Animar en Modo Video</span>
                </button>
              </div>
            </div>
          </div>

          {/* 10 Drawing -> Target Matrix Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
            <div className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F4F2ED]">
              Guía de 10 transformaciones habituales
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#DEDAD0] dark:border-[#26262E] text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
                    <th className="py-1.5 pr-3">Original</th>
                    <th className="py-1.5 pr-3">Transformación</th>
                    <th className="py-1.5">Criterio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEDAD0] dark:divide-[#26262E]">
                  {DRAWING_TRANSFORMATION_TABLE.map((row) => (
                    <tr key={row.original}>
                      <td className="py-2 pr-3 font-semibold">{row.original}</td>
                      <td className="py-2 pr-3 text-[#7545D6] dark:text-[#F8C300] font-semibold">
                        {row.target}
                      </td>
                      <td className="py-2 text-[#4A4A55] dark:text-[#B4B2AC]">{row.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
