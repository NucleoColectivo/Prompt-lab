import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  History,
  Upload,
  Copy,
  Check,
  Download,
  ShieldCheck,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  RESTORATION_CATEGORIES,
  RESTORATION_ETHICS_RULES,
  RESTORATION_TOOLS,
  STUDIO_MEDIA_ASSETS,
} from '../../data/creativeStudiosData';
import { ResilientImage } from '../ResilientImage';
import type { PromptBuilderState } from '../PromptBuilder';

interface PhotoRestorationLabProps {
  onApplyToBuilder?: (patch: Partial<PromptBuilderState>) => void;
}

export const PhotoRestorationLab: React.FC<PhotoRestorationLabProps> = ({
  onApplyToBuilder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(RESTORATION_CATEGORIES[0]);
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'Eliminación de rayones',
    'Recuperación de contraste',
    'Recuperación de rostros',
    'Restauración de textura',
  ]);
  const [damageLevel, setDamageLevel] = useState<'leve' | 'moderado' | 'severo'>('moderado');
  const [colorPreference, setColorPreference] = useState<
    'bw-original' | 'sepia-original' | 'restore-color' | 'historical-colorize'
  >('bw-original');
  const [preserveIdentity, setPreserveIdentity] = useState(true);
  const [preserveAnalogGrain, setPreserveAnalogGrain] = useState(true);
  const [contextNote, setContextNote] = useState(
    'Retrato familiar en patio exterior, década de 1950, conservar ropa original y mirada.'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Real user photo upload + real HTML5 Canvas inspection/pre-cleaning workbench
  const [uploadedDataUrl, setUploadedDataUrl] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string>('');
  const [brightnessAdj, setBrightnessAdj] = useState<number>(106);
  const [contrastAdj, setContrastAdj] = useState<number>(118);
  const [grayscaleAdj, setGrayscaleAdj] = useState<number>(100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive reference slider on our curated archival example
  const [compareSlider, setCompareSlider] = useState<number>(50);

  const toggleTool = (toolEs: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolEs) ? prev.filter((t) => t !== toolEs) : [...prev, toolEs]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!uploadedDataUrl || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxW = 900;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.filter = `brightness(${brightnessAdj}%) contrast(${contrastAdj}%) grayscale(${grayscaleAdj}%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = uploadedDataUrl;
  }, [uploadedDataUrl, brightnessAdj, contrastAdj, grayscaleAdj]);

  const downloadPreparedCanvas = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `preparada-${uploadedName || 'fotografia-archivo'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const restorationPrompt = useMemo(() => {
    const colorClause =
      colorPreference === 'bw-original'
        ? 'Keep authentic monochrome silver-gelatin black and white tonal palette without adding color.'
        : colorPreference === 'sepia-original'
        ? 'Preserve natural warm archival sepia tone faithfully.'
        : colorPreference === 'restore-color'
        ? 'Recover faded original photographic colors neutrally without artificial oversaturation.'
        : 'Apply subtle historically accurate period colorization clearly labeled as interpretive restoration.';

    const toolsEn = selectedTools
      .map((t) => RESTORATION_TOOLS.find((rt) => rt.es === t)?.en || t)
      .join(', ');

    return [
      `PHOTO RESTORATION PROMPT (ES / EN) · NIVEL ${damageLevel.toUpperCase()}`,
      `Categoría: ${selectedCategory}`,
      ``,
      `PROMPT EN INGLÉS (para Gemini / FLUX Kontext / ChatGPT / Photoshop IA):`,
      `Archival conservation restoration of the uploaded photograph (${selectedCategory}; damage level: ${damageLevel}). Apply: ${toolsEn || 'scratch removal, dust cleanup, balanced tonal recovery'}. ${colorClause} ${
        preserveIdentity
          ? 'STRICT IDENTITY PRESERVATION: do not invent facial features, do not change eyes, nose, mouth, age, expression or original clothing.'
          : ''
      } ${
        preserveAnalogGrain
          ? 'Preserve authentic natural analog film grain and paper fiber character; strictly avoid plastic smooth skin or modern HDR look.'
          : ''
      } Context note: ${contextNote}.`,
      ``,
      `CLÁUSULA ÉTICA:`,
      `If missing torn corners or occluded areas require generative fill, treat reconstructed fragments strictly as visual restoration rather than primary historical evidence.`,
    ].join('\n');
  }, [
    selectedCategory,
    selectedTools,
    damageLevel,
    colorPreference,
    preserveIdentity,
    preserveAnalogGrain,
    contextNote,
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header + Conservation Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code font-bold uppercase tracking-wider text-[#7545D6] dark:text-[#F8C300]">
              <span>MÓDULO 10 · PHOTO RESTORATION LAB</span>
              <span aria-hidden="true">·</span>
              <span>MEMORIA Y PATRIMONIO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] text-balance">
              Recuperación ética de fotografías antiguas y archivos familiares
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
              Diagnostica deterioros reales, ajusta contraste y neutralidad de tono localmente en tu navegador, y construye instrucciones precisas que reparan rayones y manchas sin inventar rostros ni borrar la memoria material del papel.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-[#101014] dark:text-[#F8C300]">
              <ShieldCheck className="w-4 h-4 text-[#326BFF] dark:text-[#F8C300]" />
              <span>REGLA DE CONSERVACIÓN DOCUMENTAL</span>
            </div>
            <ul className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] space-y-1 list-disc pl-4">
              {RESTORATION_ETHICS_RULES.slice(0, 3).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Before / After Curated Conservation Showcase */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
              EJERCICIO · RETO 02 «RESCATANDO LA MEMORIA»
            </span>
            <span className="text-[11px] font-mono-code text-[#5B5B66] dark:text-[#A09E97]">
              Ejemplo comparativo Original / Conservación
            </span>
          </div>
          <ResilientImage
            src={STUDIO_MEDIA_ASSETS.restorationBeforeAfter}
            alt="Comparativa lado a lado de retrato familiar de los años cincuenta deteriorado a la izquierda y restaurado conservando identidad y grano a la derecha"
            aspectRatio="16:9"
            containerClassName="w-full rounded-xl overflow-hidden"
          />
          <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC]">
            Nota documental: la restauración limpia dobleces, polvo y desvanecimiento manteniendo intactas las facciones y el grano argéntico original.
          </p>
        </div>
      </div>

      {/* Real Upload + Local Canvas Pre-Cleaning vs Original Comparison */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DEDAD0] dark:border-[#26262E] pb-4">
          <div>
            <div className="text-xs font-mono-code font-bold text-[#326BFF] dark:text-[#F8C300]">
              MESA DE INSPECCIÓN Y COMPARACIÓN LOCAL (CANVAS REAL)
            </div>
            <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
              Sube tu fotografía antigua, inspecciona tonos y prepara el archivo base
            </h3>
          </div>
          <label className="w-full sm:w-auto justify-center text-center px-4 py-2.5 min-h-[44px] text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg cursor-pointer inline-flex items-center gap-2 shrink-0">
            <Upload className="w-4 h-4 shrink-0" />
            <span>{uploadedDataUrl ? 'Cambiar fotografía' : 'Subir fotografía (JPG/PNG)'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>

        {!uploadedDataUrl ? (
          <div className="p-8 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-dashed border-[#D4D0C5] dark:border-[#2C2C36] text-center space-y-2">
            <History className="w-7 h-7 mx-auto text-[#7545D6] dark:text-[#F8C300]" />
            <p className="text-sm font-semibold text-[#101014] dark:text-[#F4F2ED]">
              Aún no has cargado una fotografía propia.
            </p>
            <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] max-w-xl mx-auto">
              Todo el procesamiento previo ocurre en tu navegador sin subir imágenes a servidores externos. También puedes usar directamente el Restoration Prompt Builder de abajo para preparar tu instrucción.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code">
                <span className="truncate max-w-[230px] sm:max-w-md">
                  ORIGINAL ({uploadedName}) vs AJUSTE TONAL
                </span>
                <span className="tabular-nums shrink-0">{compareSlider}% vista</span>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]">
                <img
                  src={uploadedDataUrl}
                  alt="Fotografía original cargada por el usuario sin modificar"
                  className="w-full max-h-[420px] object-contain mx-auto"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - compareSlider}% 0 0)` }}
                >
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full max-h-[420px] object-contain mx-auto"
                  />
                </div>
                <div
                  className="absolute inset-y-0 w-0.5 bg-[#F8C300] pointer-events-none"
                  style={{ left: `${compareSlider}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={compareSlider}
                onChange={(e) => setCompareSlider(Number(e.target.value))}
                aria-label="Deslizador de comparación Original vs Preparada"
                className="w-full accent-[#F8C300]"
              />
            </div>

            <div className="lg:col-span-4 p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code font-bold inline-flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#326BFF]" />
                  <span>Ajustes previos reales</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBrightnessAdj(100);
                    setContrastAdj(100);
                    setGrayscaleAdj(0);
                  }}
                  className="text-[11px] font-mono-code text-[#326BFF] hover:underline inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reiniciar</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-mono-code mb-1">
                    <span>Exposición / Brillo</span>
                    <span className="tabular-nums">{brightnessAdj}%</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={150}
                    value={brightnessAdj}
                    onChange={(e) => setBrightnessAdj(Number(e.target.value))}
                    className="w-full accent-[#326BFF]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono-code mb-1">
                    <span>Recuperación de contraste</span>
                    <span className="tabular-nums">{contrastAdj}%</span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={180}
                    value={contrastAdj}
                    onChange={(e) => setContrastAdj(Number(e.target.value))}
                    className="w-full accent-[#326BFF]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono-code mb-1">
                    <span>Neutralizar oxidación (B&N)</span>
                    <span className="tabular-nums">{grayscaleAdj}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={grayscaleAdj}
                    onChange={(e) => setGrayscaleAdj(Number(e.target.value))}
                    className="w-full accent-[#326BFF]"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                Descarga esta base limpia y súbela junto al Restoration Prompt de abajo en Gemini, ChatGPT o FLUX Kontext. No simulamos reconstrucción IA falsa en local.
              </p>

              <button
                type="button"
                onClick={downloadPreparedCanvas}
                className="w-full py-2.5 px-3 text-xs font-bold bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] rounded-lg inline-flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar base preparada (PNG)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Restoration Prompt Builder + 15 Categories & 12 Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
          <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
            Restoration Prompt Builder
          </h3>

          <div className="space-y-1 text-xs">
            <label className="font-mono-code font-bold block">1. Tipo de archivo / deterioro principal (15 categorías)</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
            >
              {RESTORATION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono-code font-bold block">2. Nivel de daño</label>
              <select
                value={damageLevel}
                onChange={(e) => setDamageLevel(e.target.value as 'leve' | 'moderado' | 'severo')}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              >
                <option value="leve">Leve (polvo y contraste)</option>
                <option value="moderado">Moderado (rayones y manchas)</option>
                <option value="severo">Severo (roturas y zonas faltantes)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono-code font-bold block">3. Tratamiento de color</label>
              <select
                value={colorPreference}
                onChange={(e) =>
                  setColorPreference(
                    e.target.value as
                      | 'bw-original'
                      | 'sepia-original'
                      | 'restore-color'
                      | 'historical-colorize'
                  )
                }
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              >
                <option value="bw-original">Conservar Blanco y Negro original</option>
                <option value="sepia-original">Conservar tono Sepia original</option>
                <option value="restore-color">Recuperar color original desvanecido</option>
                <option value="historical-colorize">Colorización histórica opcional</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-mono-code font-bold block">4. Herramientas conceptuales de restauración</span>
            <div className="flex flex-wrap gap-1.5">
              {RESTORATION_TOOLS.map((tool) => {
                const active = selectedTools.includes(tool.es);
                return (
                  <button
                    key={tool.es}
                    type="button"
                    onClick={() => toggleTool(tool.es)}
                    title={tool.desc}
                    className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                      active
                        ? 'bg-[#7545D6] text-white border-[#7545D6]'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E]'
                    }`}
                  >
                    {tool.es}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveIdentity}
                onChange={(e) => setPreserveIdentity(e.target.checked)}
                className="accent-[#326BFF]"
              />
              <span>Exigir preservación estricta de identidad facial y vestuario</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveAnalogGrain}
                onChange={(e) => setPreserveAnalogGrain(e.target.checked)}
                className="accent-[#326BFF]"
              />
              <span>Conservar grano analógico real (evitar piel plástica)</span>
            </label>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-mono-code font-bold block">5. Nota de contexto histórico o familiar</label>
            <input
              type="text"
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F4F2ED]">
                Prompt de restauración generado
              </span>
              <button
                type="button"
                onClick={() => handleCopy(restorationPrompt, 'rest-prompt')}
                className="px-3 py-1.5 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5"
              >
                {copiedId === 'rest-prompt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'rest-prompt' ? 'Copiado' : 'Copiar prompt'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-[#101014] text-[#F4F2ED] text-[11px] font-mono-code overflow-x-auto max-h-64 leading-relaxed whitespace-pre-wrap">
              {restorationPrompt}
            </pre>

            {onApplyToBuilder && (
              <button
                type="button"
                onClick={() =>
                  onApplyToBuilder({
                    mode: 'photo',
                    subject: restorationPrompt,
                    visualStyle: 'Restauración Documental de Archivo',
                    texture: 'Authentic analog silver-gelatin film grain, no plastic skin',
                  })
                }
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] inline-flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                <span>Abrir en Constructor Maestro (12 Módulos)</span>
              </button>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2.5">
            <div className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
              Principios éticos de restauración patrimonial
            </div>
            <ul className="space-y-1.5 text-xs text-[#4A4A55] dark:text-[#B4B2AC] list-disc pl-4">
              {RESTORATION_ETHICS_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
