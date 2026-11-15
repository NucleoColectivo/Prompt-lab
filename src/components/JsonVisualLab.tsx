import React, { useState, useEffect } from 'react';
import {
  Braces,
  Upload,
  Wand2,
  Loader2,
  Copy,
  Check,
  Download,
  Star,
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle,
  FolderTree,
  Sparkles,
  FileCode2,
  ExternalLink,
} from 'lucide-react';
import {
  JSON_STYLE_PRESETS,
  READY_PROMPTS_PDF3,
  JSON_TROUBLESHOOTING,
  FOLDER_STRUCTURE_SUGGESTION,
  JsonStyleProfile,
} from '../data/videoAndJsonData';
import { VISUAL_LIBRARY_PATHS } from '../data/visualLibraryRegistry';
import { ResilientImage } from './ResilientImage';

interface JsonVisualLabProps {
  onApplyStyleToBuilder: (profile: JsonStyleProfile) => void;
}

const FAV_JSON_KEY = 'nc_fav_json_styles_v1';

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0').toUpperCase())
      .join('')
  );
}

async function analyzeImageLocallyWithCanvas(
  dataUrl: string,
  notes: string
): Promise<Omit<JsonStyleProfile, 'id'>> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const size = 96;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('No se pudo inicializar el analizador visual del navegador.');
        }
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let sumLuma = 0;
        let sumWarmth = 0;
        let sumSat = 0;
        const lumas: number[] = [];
        const bucketCounts = new Map<string, { count: number; r: number; g: number; b: number }>();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          lumas.push(luma);
          sumLuma += luma;
          sumWarmth += r - b;
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          sumSat += maxC === 0 ? 0 : (maxC - minC) / maxC;

          // Quantize into 24-step color buckets to extract dominant swatches
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const key = `${qr}-${qg}-${qb}`;
          const prev = bucketCounts.get(key);
          if (prev) {
            prev.count += 1;
            prev.r += r;
            prev.g += g;
            prev.b += b;
          } else {
            bucketCounts.set(key, { count: 1, r, g, b });
          }
        }

        const totalPixels = lumas.length || 1;
        const avgLuma = sumLuma / totalPixels;
        const avgWarmth = sumWarmth / totalPixels;
        const avgSat = sumSat / totalPixels;
        const variance =
          lumas.reduce((acc, l) => acc + Math.pow(l - avgLuma, 2), 0) / totalPixels;
        const contrastStd = Math.sqrt(variance);

        const topSwatches = Array.from(bucketCounts.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map((item) => rgbToHex(item.r / item.count, item.g / item.count, item.b / item.count));

        const keyLight =
          avgLuma < 85
            ? 'Low Key (sombras profundas y altas luces contenidas)'
            : avgLuma > 168
            ? 'High Key (iluminación envolvente brillante y limpia)'
            : 'Mid Key equilibrada con transición gradual de tonos medios';

        const contrastLabel =
          contrastStd > 62
            ? 'alto contraste direccional'
            : contrastStd > 38
            ? 'contraste medio editorial'
            : 'contraste suave difuso';

        const tempLabel =
          avgWarmth > 18
            ? 'cálida dorada (~3600K–4400K)'
            : avgWarmth < -14
            ? 'fría atmosférica (~6500K–7600K)'
            : 'neutra equilibrada (~5200K–5600K)';

        const satLabel =
          avgSat < 0.14
            ? 'monocromática o muy desaturada'
            : avgSat > 0.45
            ? 'saturación cromática rica y expresiva'
            : 'saturación natural orgánica y contenida';

        const ratio =
          img.naturalWidth && img.naturalHeight
            ? img.naturalWidth > img.naturalHeight * 1.15
              ? 'encuadre horizontal cinematográfico'
              : img.naturalHeight > img.naturalWidth * 1.15
              ? 'encuadre vertical editorial'
              : 'encuadre equilibrado próximo a cuadrado'
            : 'encuadre balanceado';

        const customNote = notes.trim() ? ` Prioridad indicada: ${notes.trim()}.` : '';

        resolve({
          style_name:
            avgLuma < 90
              ? 'Chiaroscuro Extraído'
              : avgWarmth > 18
              ? 'Editorial Cálido Analizado'
              : 'Natural Balanceado Extraído',
          category: 'Análisis Local',
          photography: `Dirección fotográfica con ${contrastLabel}, lectura visual limpia y ${ratio}.${customNote}`,
          camera: 'Referencia de rango dinámico amplio tipo medio formato / full-frame',
          lens: 'Óptica fija aparente 50mm–85mm sin distorsión angular perceptible',
          aperture: 'Profundidad de campo media-superficial (aparente f/2.0–f/2.8)',
          lighting: `${keyLight}, ${contrastLabel} y temperatura ${tempLabel}`,
          composition: `Composición en ${ratio} (${img.naturalWidth}x${img.naturalHeight}px) con aire respirable alrededor del foco`,
          color: `Paleta ${satLabel}; muestras dominantes medidas: ${topSwatches.join(', ')}`,
          focus: 'Nitidez selectiva enfocada en el sujeto principal con transición progresiva',
          depth_of_field: 'Separación suave figura-fondo sin desenfoque artificial de software',
          texture: 'Textura orgánica natural, grano sutil y microdetalles preservados en luces y sombras',
          atmosphere:
            avgLuma < 90
              ? 'Atmósfera íntima, contenida y dramática'
              : 'Atmósfera serena, editorial y luminosa',
          background:
            avgLuma < 90
              ? 'Fondo oscuro controlado en penumbra limpia'
              : 'Fondo armónico desenfocado acorde a la paleta medida',
          post_processing: `Gradación sutil conservando la curva tonal observada (${topSwatches.slice(0, 3).join(' / ')})`,
          preservation: {
            keep_subject_identity: true,
            keep_facial_features: true,
            keep_natural_pose: true,
          },
          observable_notes: `Medición directa en navegador (${img.naturalWidth}x${img.naturalHeight}px): luminancia media ${Math.round(avgLuma)}/255, contraste σ=${Math.round(contrastStd)}, temperatura ${tempLabel}. Paleta extraída: ${topSwatches.join(', ')}.`,
        });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('No se pudo leer la imagen subida.'));
    img.src = dataUrl;
  });
}

function toYamlString(profile: JsonStyleProfile): string {
  return `style_name: "${profile.style_name}"
category: "${profile.category}"
photography: "${profile.photography}"
camera: "${profile.camera}"
lens: "${profile.lens}"
aperture: "${profile.aperture}"
lighting: "${profile.lighting}"
composition: "${profile.composition}"
color: "${profile.color}"
focus: "${profile.focus}"
depth_of_field: "${profile.depth_of_field}"
texture: "${profile.texture}"
atmosphere: "${profile.atmosphere}"
background: "${profile.background}"
post_processing: "${profile.post_processing}"
preservation:
  keep_subject_identity: ${profile.preservation.keep_subject_identity}
  keep_facial_features: ${profile.preservation.keep_facial_features}
  keep_natural_pose: ${profile.preservation.keep_natural_pose}`;
}

export const JsonVisualLab: React.FC<JsonVisualLabProps> = ({ onApplyStyleToBuilder }) => {
  const [activeProfile, setActiveProfile] = useState<JsonStyleProfile>(JSON_STYLE_PRESETS[0]);
  const [compareProfileId, setCompareProfileId] = useState<string>(JSON_STYLE_PRESETS[2].id);
  const [showCompare, setShowCompare] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'json' | 'yaml'>('json');
  const [activeTab, setActiveTab] = useState<'editor' | 'prompts' | 'troubleshooting'>('editor');

  // Image Upload + Local Canvas Analyzer State
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [analysisNotes, setAnalysisNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  // Copy & Favorites
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [savedFavorites, setSavedFavorites] = useState<JsonStyleProfile[]>(() => {
    try {
      const raw = localStorage.getItem(FAV_JSON_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAV_JSON_KEY, JSON.stringify(savedFavorites));
    } catch {
      // ignore quota issues
    }
  }, [savedFavorites]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzeError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedPreview) {
      setAnalyzeError('Sube primero una fotografía de referencia para analizar su paleta, luz y proporción.');
      return;
    }
    setAnalyzeError(null);
    setIsAnalyzing(true);
    try {
      const extracted = await analyzeImageLocallyWithCanvas(uploadedPreview, analysisNotes);
      setActiveProfile({
        id: `custom-${Date.now()}`,
        ...extracted,
      });
    } catch (err: any) {
      console.error(err);
      setAnalyzeError(
        err?.message || 'No se pudo procesar la imagen. Intenta con otro archivo JPG, PNG o WebP.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formattedCode =
    outputFormat === 'json'
      ? JSON.stringify(
          {
            style_name: activeProfile.style_name,
            category: activeProfile.category,
            photography: activeProfile.photography,
            camera: activeProfile.camera,
            lens: activeProfile.lens,
            aperture: activeProfile.aperture,
            lighting: activeProfile.lighting,
            composition: activeProfile.composition,
            color: activeProfile.color,
            focus: activeProfile.focus,
            depth_of_field: activeProfile.depth_of_field,
            texture: activeProfile.texture,
            atmosphere: activeProfile.atmosphere,
            background: activeProfile.background,
            post_processing: activeProfile.post_processing,
            preservation: activeProfile.preservation,
          },
          null,
          2
        )
      : toYamlString(activeProfile);

  const fullApplicationPrompt = `${READY_PROMPTS_PDF3[1].prompt}\n\n\`\`\`${outputFormat}\n${formattedCode}\n\`\`\``;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(key);
    setTimeout(() => setCopiedState(null), 1800);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([formattedCode], {
      type: outputFormat === 'json' ? 'application/json' : 'text/yaml',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = activeProfile.style_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
    a.href = url;
    a.download = `${slug || 'estilo_visual'}.${outputFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveFavorite = () => {
    setSavedFavorites((prev) => {
      const exists = prev.some((p) => p.style_name === activeProfile.style_name);
      if (exists) {
        return prev.map((p) =>
          p.style_name === activeProfile.style_name ? activeProfile : p
        );
      }
      return [{ ...activeProfile, id: `fav-${Date.now()}` }, ...prev];
    });
  };

  const compareProfile =
    [...JSON_STYLE_PRESETS, ...savedFavorites].find((p) => p.id === compareProfileId) ||
    JSON_STYLE_PRESETS[2];

  const updateField = (field: keyof JsonStyleProfile, value: string) => {
    setActiveProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section
      id="json-lab"
      className="py-16 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 transition-colors scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header + Visual Demo Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
              <Braces className="w-3.5 h-3.5" />
              <span>MÓDULO 07 · GUÍA PRÁCTICA JSON</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 dark:text-stone-100">
              Laboratorio JSON Visual
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
              Convierte una imagen inspiradora en una receta estructurada reutilizable (sin inventar EXIF ocultos ni alterar tu identidad). Sube una fotografía para extraer su luz, contraste y paleta cromática en tu navegador, edita cada campo, compara estilos lado a lado y genera el prompt listo para practicar en tus herramientas IA favoritas.
            </p>

            {/* 3-Step Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] font-mono-code font-bold text-amber-700 dark:text-amber-400">
                  PASO 01 · ANALIZAR
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                  Sube una foto de referencia o elige una de las 10 categorías base.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] font-mono-code font-bold text-amber-700 dark:text-amber-400">
                  PASO 02 · EXTRAER JSON
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                  Ajusta luz, lente aparente, color, textura y reglas de preservación.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] font-mono-code font-bold text-amber-700 dark:text-amber-400">
                  PASO 03 · APLICAR
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-1">
                  Copia el prompt de transferencia conservando rostro y postura natural.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-950 shadow-sm">
              <ResilientImage
                src={VISUAL_LIBRARY_PATHS.colorJsonTransfer}
                alt="Ejemplo de transferencia de estilo vía JSON manteniendo identidad del sujeto"
                objectPosition="top"
                containerClassName="w-full h-56"
              />
              <div className="p-3 flex items-center justify-between text-[11px] font-mono-code text-stone-300">
                <span>Original → Chiaroscuro Monochrome JSON</span>
                <span className="text-amber-400">Identidad 100% preservada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs inside Module 07 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'editor', label: 'Analizador & Editor JSON' },
              { id: 'prompts', label: '5 Prompts Listos & Carpetas' },
              { id: 'troubleshooting', label: 'Solución de Problemas (7 casos)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors ${
                  activeTab === t.id
                    ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950'
                    : 'bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCompare((prev) => !prev)}
            className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded border transition-colors flex items-center gap-1.5 ${
              showCompare
                ? 'bg-amber-400 text-stone-950 border-amber-400'
                : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{showCompare ? 'Ocultar Comparador' : 'Comparar 2 Estilos'}</span>
          </button>
        </div>

        {/* Side-by-Side Comparison Drawer */}
        {showCompare && (
          <div className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold font-serif-title text-stone-900 dark:text-stone-100">
                Comparador Técnico Lado a Lado
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono-code text-stone-500">Comparar con:</span>
                <select
                  value={compareProfileId}
                  onChange={(e) => setCompareProfileId(e.target.value)}
                  aria-label="Seleccionar segundo estilo JSON para comparar"
                  className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-stone-900 dark:text-stone-100"
                >
                  {[...JSON_STYLE_PRESETS, ...savedFavorites].map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.style_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { label: 'Estilo A (Activo)', data: activeProfile },
                { label: 'Estilo B (Comparado)', data: compareProfile },
              ].map((col) => (
                <div
                  key={col.label}
                  className="p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2"
                >
                  <div className="text-[11px] font-mono-code uppercase text-amber-700 dark:text-amber-400 font-bold">
                    {col.label} · {col.data.category}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {col.data.style_name}
                  </h4>
                  <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                    <p><strong>Luz:</strong> {col.data.lighting}</p>
                    <p><strong>Color:</strong> {col.data.color}</p>
                    <p><strong>Óptica / Apertura:</strong> {col.data.lens} · {col.data.aperture}</p>
                    <p><strong>Textura:</strong> {col.data.texture}</p>
                    <p><strong>Atmósfera:</strong> {col.data.atmosphere}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: ANALYZER + EDITOR */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            {/* Presets & Saved Favorites Strip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-code text-stone-500">
                <span>10 CATEGORÍAS PREDEFINIDAS (+ TUS FAVORITOS GUARDADOS)</span>
                <span>{savedFavorites.length} guardados en este navegador</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {JSON_STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActiveProfile(preset)}
                    className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                      activeProfile.id === preset.id
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold'
                        : 'bg-[#FAF8F5] dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-amber-400'
                    }`}
                  >
                    {preset.category}
                  </button>
                ))}
                {savedFavorites.map((fav) => (
                  <button
                    key={fav.id}
                    type="button"
                    onClick={() => setActiveProfile(fav)}
                    className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors flex items-center gap-1 ${
                      activeProfile.id === fav.id
                        ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 border-stone-900'
                        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>{fav.style_name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Cols: Gemini Multimodal Uploader + Field Editor */}
              <div className="lg:col-span-7 space-y-6">
                {/* Upload Image Box */}
                <div className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-amber-600" />
                        <span>Extraer Estilo JSON desde una Fotografía (Análisis Local)</span>
                      </h3>
                      <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                        Sube una foto de referencia para medir clave tonal, temperatura, contraste y 5 colores dominantes directamente en tu dispositivo.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <label className="sm:col-span-5 cursor-pointer rounded-lg border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 bg-white dark:bg-stone-900 h-36 flex flex-col items-center justify-center p-3 text-center overflow-hidden transition-colors">
                      {uploadedPreview ? (
                        <img
                          src={uploadedPreview}
                          alt="Referencia subida para análisis JSON"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-amber-600 mb-2" />
                          <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
                            Seleccionar imagen (JPG / PNG / WebP)
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="sm:col-span-7 space-y-3">
                      <input
                        type="text"
                        value={analysisNotes}
                        onChange={(e) => setAnalysisNotes(e.target.value)}
                        placeholder="Nota opcional: ej. 'Enfócate en la luz lateral y textura fílmica'"
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAnalyzeImage}
                        disabled={isAnalyzing}
                        className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Analizando imagen localmente...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4" />
                            <span>Extraer Perfil JSON</span>
                          </>
                        )}
                      </button>
                      {analyzeError && (
                        <p className="text-xs text-rose-600 dark:text-rose-400">{analyzeError}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Individual Parameter Editor */}
                <div className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Editor de Parámetros del Estilo
                    </h3>
                    <button
                      type="button"
                      onClick={() => onApplyStyleToBuilder(activeProfile)}
                      className="px-3 py-1.5 text-xs font-semibold bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 rounded flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Enviar al Constructor</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { key: 'style_name', label: 'Nombre del estilo' },
                      { key: 'camera', label: 'Apariencia de cámara' },
                      { key: 'lens', label: 'Óptica aparente' },
                      { key: 'aperture', label: 'Apertura / Profundidad' },
                      { key: 'lighting', label: 'Iluminación (lighting)' },
                      { key: 'composition', label: 'Composición' },
                      { key: 'color', label: 'Colorimetría' },
                      { key: 'texture', label: 'Textura orgánica' },
                      { key: 'atmosphere', label: 'Atmósfera' },
                      { key: 'background', label: 'Fondo (background)' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-[11px] font-mono-code text-stone-500 mb-1">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={(activeProfile[field.key as keyof JsonStyleProfile] as string) || ''}
                          onChange={(e) =>
                            updateField(field.key as keyof JsonStyleProfile, e.target.value)
                          }
                          className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Identity Preservation Rule */}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Reglas de Preservación de Identidad</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-stone-700 dark:text-stone-300">
                      {(
                        [
                          ['keep_subject_identity', 'Conservar identidad del sujeto'],
                          ['keep_facial_features', 'Conservar rasgos faciales'],
                          ['keep_natural_pose', 'Conservar postura natural'],
                        ] as const
                      ).map(([k, label]) => (
                        <label key={k} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={activeProfile.preservation[k]}
                            onChange={(e) =>
                              setActiveProfile((prev) => ({
                                ...prev,
                                preservation: { ...prev.preservation, [k]: e.target.checked },
                              }))
                            }
                            className="accent-amber-500"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Live JSON/YAML Viewer + Application Prompt */}
              <div className="lg:col-span-5 space-y-4 sticky top-20">
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-950 p-4 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-mono-code font-bold uppercase text-stone-800 dark:text-stone-200">
                        Estructura {outputFormat.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setOutputFormat('json')}
                        className={`px-2 py-1 text-[11px] font-mono-code rounded ${
                          outputFormat === 'json'
                            ? 'bg-amber-400 text-stone-950 font-bold'
                            : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        JSON
                      </button>
                      <button
                        type="button"
                        onClick={() => setOutputFormat('yaml')}
                        className={`px-2 py-1 text-[11px] font-mono-code rounded ${
                          outputFormat === 'yaml'
                            ? 'bg-amber-400 text-stone-950 font-bold'
                            : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        YAML
                      </button>
                    </div>
                  </div>

                  <pre className="p-3.5 rounded bg-stone-950 text-stone-200 font-mono-code text-[11px] leading-relaxed max-h-72 overflow-y-auto border border-stone-800 select-all">
                    {formattedCode}
                  </pre>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(formattedCode, 'code')}
                      className="flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-stone-950 rounded flex items-center justify-center gap-1.5"
                    >
                      {copiedState === 'code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedState === 'code' ? 'Copiado' : `Copiar ${outputFormat.toUpperCase()}`}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadJson}
                      className="py-2 px-3 text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded hover:border-amber-500 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-600" />
                      <span>.{outputFormat}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveFavorite}
                      className="py-2 px-3 text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded hover:border-amber-500 flex items-center gap-1.5"
                      title="Guardar estilo favorito en el navegador"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>Guardar</span>
                    </button>
                  </div>

                  {/* Full Apply Prompt Box */}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono-code font-bold uppercase text-emerald-700 dark:text-emerald-400">
                        Prompt completo para aplicar sobre tu foto
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(fullApplicationPrompt, 'full-apply')}
                        className="text-xs font-mono-code text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        {copiedState === 'full-apply' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Prompt + JSON</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                      Copia el bloque y adjunta tu retrato en ChatGPT, Gemini Web o Flux para aplicar el estilo conservando identidad.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <a
                        href="https://chatgpt.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleCopy(fullApplicationPrompt, 'full-apply')}
                        className="px-2.5 py-1.5 text-[11px] font-mono-code font-semibold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Practicar en ChatGPT</span>
                        <ExternalLink className="w-3 h-3 text-amber-600" />
                      </a>
                      <a
                        href="https://gemini.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleCopy(fullApplicationPrompt, 'full-apply')}
                        className="px-2.5 py-1.5 text-[11px] font-mono-code font-semibold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 rounded inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Practicar en Gemini Web</span>
                        <ExternalLink className="w-3 h-3 text-amber-600" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 5 READY PROMPTS + FOLDER STRUCTURE + JSON VS YAML */}
        {activeTab === 'prompts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
              {READY_PROMPTS_PDF3.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {item.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.prompt, item.id)}
                      className="px-3 py-1 text-xs font-mono-code bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded flex items-center gap-1 shrink-0"
                    >
                      {copiedState === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedState === item.id ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400">{item.description}</p>
                  <pre className="p-3 rounded bg-stone-950 text-stone-200 font-mono-code text-[11px] whitespace-pre-wrap leading-relaxed">
                    {item.prompt}
                  </pre>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-code font-bold text-amber-700 dark:text-amber-400 uppercase">
                  <FolderTree className="w-4 h-4" />
                  <span>Organización de Carpetas (Talleres)</span>
                </div>
                <pre className="p-3 rounded bg-stone-950 text-stone-200 font-mono-code text-[11px] overflow-x-auto leading-relaxed">
                  {FOLDER_STRUCTURE_SUGGESTION}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs text-stone-700 dark:text-stone-300">
                <h4 className="font-bold text-stone-900 dark:text-stone-100">
                  ¿Cuándo usar JSON vs YAML?
                </h4>
                <p>
                  <strong>JSON:</strong> Estándar universal cuando intercambias estilos entre APIs, web apps o archivos descargables <code>.json</code> con llaves estrictas.
                </p>
                <p>
                  <strong>YAML:</strong> Más ligero para leer e imprimir en apuntes de clase o pegado rápido en chat por su indentación limpia sin comillas ni llaves.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TROUBLESHOOTING */}
        {activeTab === 'troubleshooting' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {JSON_TROUBLESHOOTING.map((row) => (
              <div
                key={row.problem}
                className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2"
              >
                <div className="flex items-start gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{row.problem}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  <strong>Causa probable:</strong> {row.cause}
                </p>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 rounded border border-emerald-200 dark:border-emerald-900/50">
                  <strong>Solución:</strong> {row.solution}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
