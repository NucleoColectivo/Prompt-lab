import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookmarkCheck,
  Check,
  Copy,
  Download,
  FileText,
  FolderOpen,
  ImagePlus,
  Layers,
  Palette,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  X,
} from 'lucide-react';
import { GALLERY_VISUAL_ITEMS, type GalleryVisualItem } from '../../data/galleryCollectionsData';
import type { BuilderCategoryId } from '../../data/promptBuilderConfig';
import type { PromptBuilderState } from '../PromptBuilder';
import {
  buildMoodboardBuilderPatch,
  deleteMoodboard,
  readMoodboards,
  saveMoodboard,
  saveUnifiedProject,
  type MoodboardReferenceItem,
  type SavedMoodboard,
} from '../../services/workspaceStore';

interface MoodboardBuilderLabProps {
  onApplyToBuilder: (patch: Partial<PromptBuilderState>) => void;
  onOpenProjects?: () => void;
}

interface PalettePreset {
  id: string;
  name: string;
  description: string;
  colors: string[];
  promptEn: string;
}

const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: 'editorial-nucleo',
    name: 'Editorial Núcleo',
    description: 'Crema mineral, carbón profundo, amarillo solar y azul cobalto.',
    colors: ['#F4F2ED', '#101014', '#F8C300', '#326BFF', '#7545D6'],
    promptEn: 'warm archival cream, deep charcoal, solar yellow accents and cobalt blue editorial balance',
  },
  {
    id: 'terracota-andina',
    name: 'Terracota & Tierra',
    description: 'Arcilla cocida, ocre cálido, arena seca y sombra volcánica.',
    colors: ['#C85A32', '#E09F5A', '#EDE0CE', '#5A3E36', '#1F1A18'],
    promptEn: 'warm terracotta clay, toasted ochre, dry sand and deep volcanic umber earthy palette',
  },
  {
    id: 'neo-noir-cian',
    name: 'Neo-Noir Cian & Ámbar',
    description: 'Contraste cinematográfico entre sombras frías y luces cálidas.',
    colors: ['#0B1D26', '#184E5E', '#3FA7B8', '#F29F3D', '#FFF1D6'],
    promptEn: 'cinematic teal shadows and warm amber highlights with controlled neo-noir color contrast',
  },
  {
    id: 'botanico-organico',
    name: 'Botánico Orgánico',
    description: 'Verde musgo, salvia húmeda, lino crudo y madera envejecida.',
    colors: ['#1E352F', '#4A6B5D', '#9BB0A5', '#E9E5DC', '#7D5A44'],
    promptEn: 'deep forest moss, muted sage green, raw linen cream and organic weathered timber tones',
  },
  {
    id: 'brutalista-mono',
    name: 'Brutalista Monocromo',
    description: 'Concreto arquitectónico, plata grafito y acento rojo señal.',
    colors: ['#121215', '#3A3A42', '#8E8E98', '#E5E5EA', '#D92D20'],
    promptEn: 'architectural concrete monochrome grayscale with sharp graphite contrast and a subtle crimson accent',
  },
  {
    id: 'editorial-moda',
    name: 'Pasarela Mineral',
    description: 'Marfil, topo suave, bronce satinado y azul pizarra.',
    colors: ['#FAF7F2', '#D4C5B9', '#9E8570', '#3D4856', '#17191E'],
    promptEn: 'refined ivory, soft taupe, satin bronze and slate blue contemporary fashion color harmony',
  },
  {
    id: 'ciber-experimental',
    name: 'Experimental Luminoso',
    description: 'Índigo nocturno, violeta eléctrico, lima ácido y cian óptico.',
    colors: ['#0E0B1E', '#3D2782', '#7545D6', '#00D4FF', '#D4FF2A'],
    promptEn: 'deep nocturnal indigo, electric violet, optical cyan and sharp acid lime experimental lighting palette',
  },
  {
    id: 'kodak-analogico',
    name: 'Película 35mm Cálida',
    description: 'Tonos piel orgánicos, grano suave, cielos pastel y verdes suaves.',
    colors: ['#F3E2C7', '#D99E73', '#8AA6A3', '#495D5B', '#282320'],
    promptEn: 'Kodak Portra 400 analog color rendition with soft golden highlights, organic skin tones and muted cyan shadows',
  },
];

const DISCIPLINE_OPTIONS: { id: BuilderCategoryId; label: string }[] = [
  { id: 'photo', label: 'Fotografía & Retrato' },
  { id: 'video', label: 'Cine & Video' },
  { id: 'graphic', label: 'Diseño Gráfico & Cartel' },
  { id: 'branding', label: 'Publicidad & Producto' },
  { id: 'illustration', label: 'Ilustración & Concept Art' },
  { id: 'architecture', label: 'Arquitectura & Espacios' },
  { id: 'web-ui', label: 'Diseño Web & UI' },
  { id: 'experimental', label: 'Arte Digital & Experimental' },
];

const STYLE_OPTIONS = [
  { label: 'Editorial Contemporáneo', en: 'contemporary editorial photography' },
  { label: 'Cinematográfico 35mm', en: '35mm cinematic film aesthetic' },
  { label: 'Minimalismo Arquitectónico', en: 'architectural minimalism' },
  { label: 'Documental Crudo', en: 'raw documentary authenticity' },
  { label: 'Surrealismo Poético', en: 'poetic conceptual surrealism' },
  { label: 'Brutalismo Gráfico', en: 'Swiss graphic brutalism' },
  { label: 'Alta Costura / Estudio', en: 'high-fashion studio direction' },
  { label: 'Orgánico & Táctil', en: 'tactile organic materiality' },
  { label: 'Escultórico 3D PBR', en: 'sculptural 3D PBR art direction' },
  { label: 'Neo-Noir Atmosférico', en: 'atmospheric neo-noir chiaroscuro' },
];

const REFERENCE_ROLES: MoodboardReferenceItem['role'][] = [
  'Composición',
  'Iluminación',
  'Color',
  'Textura',
  'Sujeto',
  'Atmósfera',
];

const SUGGESTED_KEYWORDS = [
  'luz natural lateral',
  'textura táctil',
  'espacio negativo',
  'grano analógico 35mm',
  'encuadre simétrico',
  'contraste suave',
  'arquitectura viva',
  'paleta sobria',
  'atmósfera contemplativa',
  'materiales nobles',
];

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagen no compatible.'));
      img.onload = () => {
        const maxSide = 480;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof reader.result === 'string' ? reader.result : '');
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
  });
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const MoodboardBuilderLab: React.FC<MoodboardBuilderLabProps> = ({
  onApplyToBuilder,
  onOpenProjects,
}) => {
  const [boardId, setBoardId] = useState<string>(() => `mb-${Date.now()}`);
  const [title, setTitle] = useState('Dirección de Arte · Serie Editorial');
  const [concept, setConcept] = useState(
    'Explorar la tensión entre materia mineral y luz cálida oblicua en retratos y objetos culturales contemporáneos.'
  );
  const [discipline, setDiscipline] = useState<BuilderCategoryId>('photo');
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>(PALETTE_PRESETS[0].id);
  const [colors, setColors] = useState<string[]>(PALETTE_PRESETS[0].colors);
  const [customHex, setCustomHex] = useState('#F8C300');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    'Editorial Contemporáneo',
    'Orgánico & Táctil',
  ]);
  const [keywords, setKeywords] = useState<string[]>([
    'luz natural lateral',
    'textura táctil',
    'espacio negativo',
  ]);
  const [keywordInput, setKeywordInput] = useState('');
  const [references, setReferences] = useState<MoodboardReferenceItem[]>(() => {
    const initial = GALLERY_VISUAL_ITEMS.slice(0, 3);
    const defaultRoles: MoodboardReferenceItem['role'][] = ['Iluminación', 'Composición', 'Textura'];
    return initial.map((item, idx) => ({
      id: `ref-${item.id}`,
      title: `${item.code} · ${item.title}`,
      image: item.image,
      role: defaultRoles[idx] || 'Atmósfera',
      note: item.specs.lighting,
      source: 'galeria',
    }));
  });

  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [gallerySearch, setGallerySearch] = useState('');
  const [promptLang, setPromptLang] = useState<'es' | 'en'>('es');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savedBoards, setSavedBoards] = useState<SavedMoodboard[]>(() => readMoodboards());

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activePalette = useMemo(
    () => PALETTE_PRESETS.find((p) => p.id === selectedPaletteId) || PALETTE_PRESETS[0],
    [selectedPaletteId]
  );

  const activeDisciplineLabel =
    DISCIPLINE_OPTIONS.find((d) => d.id === discipline)?.label || 'Fotografía & Retrato';

  const filteredGallery = useMemo(() => {
    const q = gallerySearch.trim().toLowerCase();
    if (!q) return GALLERY_VISUAL_ITEMS.slice(0, 16);
    return GALLERY_VISUAL_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.collection.toLowerCase().includes(q) ||
        item.style.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
    ).slice(0, 16);
  }, [gallerySearch]);

  const creativeSummary = useMemo(() => {
    const stylesText = selectedStyles.length > 0 ? selectedStyles.join(' + ') : 'Dirección libre';
    const kwText = keywords.length > 0 ? keywords.join(', ') : 'sin palabras clave todavía';
    const refSummary =
      references.length > 0
        ? references.map((r) => `${r.role}: ${r.title}${r.note ? ` (${r.note})` : ''}`).join(' · ')
        : 'Sin referencias visuales cargadas aún.';
    return [
      `PROYECTO: ${title || 'Tablero sin título'} (${activeDisciplineLabel})`,
      `CONCEPTO: ${concept || 'Definir intención visual del proyecto.'}`,
      `ESTILOS: ${stylesText}`,
      `PALETA (${activePalette.name}): ${colors.join(', ')}`,
      `PALABRAS CLAVE: ${kwText}`,
      `REFERENCIAS (${references.length}): ${refSummary}`,
    ].join('\n');
  }, [title, activeDisciplineLabel, concept, selectedStyles, activePalette.name, colors, keywords, references]);

  const generatedPrompts = useMemo(() => {
    const stylesEn = selectedStyles
      .map((s) => STYLE_OPTIONS.find((opt) => opt.label === s)?.en || s)
      .join(', ');
    const roleClues = references
      .filter((r) => r.note.trim())
      .map((r) => `${r.role.toLowerCase()}: ${r.note.trim()}`)
      .slice(0, 4)
      .join('; ');
    const kwLine = keywords.join(', ');

    const es = [
      `Dirección de arte para ${activeDisciplineLabel.toLowerCase()}: ${concept || title}.`,
      selectedStyles.length > 0 ? `Estética visual: ${selectedStyles.join(', ')}.` : '',
      `Paleta cromática inspirada en ${activePalette.name} (${colors.join(', ')}).`,
      roleClues ? `Claves de referencia del moodboard: ${roleClues}.` : '',
      kwLine ? `Atributos y palabras clave: ${kwLine}.` : '',
      'Composición editorial equilibrada, materiales auténticos, iluminación coherente y acabado fotográfico profesional sin artefactos.',
    ]
      .filter(Boolean)
      .join(' ');

    const en = [
      `Art direction piece (${activeDisciplineLabel}): ${concept || title}.`,
      stylesEn ? `Visual language: ${stylesEn}.` : '',
      `Color palette: ${activePalette.promptEn} (${colors.join(', ')}).`,
      roleClues ? `Moodboard reference cues: ${roleClues}.` : '',
      kwLine ? `Key visual motifs: ${kwLine}.` : '',
      'Cohesive editorial composition, tactile natural materials, controlled lighting hierarchy, ultra-clean studio grade output.',
    ]
      .filter(Boolean)
      .join(' ');

    return { es, en };
  }, [activeDisciplineLabel, concept, title, selectedStyles, activePalette, colors, references, keywords]);

  const activePrompt = promptLang === 'es' ? generatedPrompts.es : generatedPrompts.en;

  const handleSelectPalette = (preset: PalettePreset) => {
    setSelectedPaletteId(preset.id);
    setColors([...preset.colors]);
  };

  const handleAddColor = () => {
    const clean = customHex.toUpperCase();
    if (!colors.includes(clean) && colors.length < 7) {
      setColors((prev) => [...prev, clean]);
    }
  };

  const handleRemoveColor = (hex: string) => {
    if (colors.length <= 2) return;
    setColors((prev) => prev.filter((c) => c !== hex));
  };

  const handleToggleStyle = (label: string) => {
    setSelectedStyles((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label].slice(0, 4)
    );
  };

  const handleAddKeyword = (word?: string) => {
    const clean = (word ?? keywordInput).trim();
    if (!clean) return;
    if (!keywords.includes(clean)) {
      setKeywords((prev) => [...prev, clean].slice(0, 12));
    }
    if (!word) setKeywordInput('');
  };

  const handleRemoveKeyword = (word: string) => {
    setKeywords((prev) => prev.filter((k) => k !== word));
  };

  const handleAddGalleryRef = (item: GalleryVisualItem) => {
    if (references.length >= 8) return;
    const newRef: MoodboardReferenceItem = {
      id: `ref-${item.id}-${Date.now()}`,
      title: `${item.code} · ${item.title}`,
      image: item.image,
      role: 'Composición',
      note: `${item.specs.lighting} · ${item.specs.color}`,
      source: 'galeria',
    };
    setReferences((prev) => [...prev, newRef]);
    setShowGalleryPicker(false);
  };

  const handleUploadLocalImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Selecciona un archivo de imagen válido (JPG, PNG o WebP).');
      return;
    }
    try {
      const dataUrl = await compressImageFile(file);
      const newRef: MoodboardReferenceItem = {
        id: `upload-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, '').slice(0, 36),
        image: dataUrl,
        role: 'Atmósfera',
        note: 'Referencia visual local',
        source: 'archivo',
      };
      setReferences((prev) => [...prev, newRef].slice(0, 8));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'No se pudo procesar la imagen.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const moveReference = (index: number, direction: -1 | 1) => {
    const nextIdx = index + direction;
    if (nextIdx < 0 || nextIdx >= references.length) return;
    setReferences((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(nextIdx, 0, item);
      return copy;
    });
  };

  const updateReference = (id: string, patch: Partial<MoodboardReferenceItem>) => {
    setReferences((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeReference = (id: string) => {
    setReferences((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleSaveToProjects = () => {
    const now = new Date().toISOString();
    const board: SavedMoodboard = {
      id: boardId,
      title: title.trim() || 'Moodboard sin título',
      concept: concept.trim(),
      discipline: activeDisciplineLabel,
      paletteName: activePalette.name,
      colors,
      styles: selectedStyles,
      keywords,
      references,
      creativeSummary,
      generatedPrompt: activePrompt,
      createdAt: savedBoards.find((b) => b.id === boardId)?.createdAt || now,
      updatedAt: now,
    };
    const next = saveMoodboard(board);
    setSavedBoards(next);
    // Sync non-destructively into Unified Creative Project store
    const builderPatch = buildMoodboardBuilderPatch(board);
    saveUnifiedProject({
      id: `proj-${board.id}`,
      title: board.title,
      discipline: board.discipline,
      category: discipline,
      sourceModules: ['moodboard'],
      initialData: {
        concept: board.concept,
        objective: `Dirección de arte · Paleta ${board.paletteName} · Estilos: ${board.styles.join(', ')}`,
        notes: board.creativeSummary,
      },
      prompts: [
        {
          id: `pv-${Date.now()}`,
          versionLabel: 'v1',
          promptEs: generatedPrompts.es,
          promptEn: generatedPrompts.en,
          source: 'moodboard',
          createdAt: now,
          builderSnapshot: builderPatch,
        },
      ],
      references: board.references.map((r) => ({
        id: r.id,
        title: r.title,
        image: r.image,
        role: r.role,
        source: r.source === 'gallery' ? 'gallery' : 'upload',
        note: r.note,
      })),
      palette: {
        name: board.paletteName,
        colors: [...board.colors],
      },
      results: '',
      tools: ['Moodboard Builder', 'Constructor Modular'],
      observations: board.keywords.length > 0 ? `Palabras clave: ${board.keywords.join(', ')}` : '',
      createdAt: board.createdAt,
      updatedAt: now,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2400);
  };

  const handleLoadBoard = (board: SavedMoodboard) => {
    setBoardId(board.id);
    setTitle(board.title);
    setConcept(board.concept);
    const matchedDisc = DISCIPLINE_OPTIONS.find((d) => d.label === board.discipline);
    if (matchedDisc) setDiscipline(matchedDisc.id);
    const matchedPal = PALETTE_PRESETS.find((p) => p.name === board.paletteName);
    if (matchedPal) setSelectedPaletteId(matchedPal.id);
    setColors(board.colors.length > 0 ? board.colors : PALETTE_PRESETS[0].colors);
    setSelectedStyles(board.styles);
    setKeywords(board.keywords);
    setReferences(board.references);
  };

  const handleDeleteBoard = (id: string) => {
    const next = deleteMoodboard(id);
    setSavedBoards(next);
    if (boardId === id) {
      setBoardId(`mb-${Date.now()}`);
    }
  };

  const handleNewBoard = () => {
    setBoardId(`mb-${Date.now()}`);
    setTitle('Nuevo Tablero de Dirección de Arte');
    setConcept('');
    setSelectedStyles(['Editorial Contemporáneo']);
    setKeywords([]);
    setReferences([]);
  };

  const handleSendToBuilder = () => {
    const patch = buildMoodboardBuilderPatch({
      title: title.trim() || 'Dirección de arte',
      concept: concept.trim(),
      discipline: activeDisciplineLabel,
      paletteName: activePalette.name,
      colors,
      styles: selectedStyles,
      keywords,
      references,
    });
    onApplyToBuilder({
      ...patch,
      mode: discipline === 'video' ? 'video' : 'photo',
      category: discipline,
      lighting: patch.lighting || 'Luz direccional natural controlada según moodboard',
      composition: patch.composition || 'Composición editorial equilibrada con espacio negativo',
      texture: patch.texture || keywords.slice(0, 3).join(', ') || 'Textura orgánica y táctil',
    });
  };

  const handleExportJson = () => {
    const payload = {
      platform: 'Núcleo Colectivo · Visual Prompt Lab',
      type: 'moodboard',
      exportedAt: new Date().toISOString(),
      title,
      discipline: activeDisciplineLabel,
      concept,
      palette: { name: activePalette.name, colors },
      styles: selectedStyles,
      keywords,
      references: references.map(({ title: t, role, note, source }) => ({ title: t, role, note, source })),
      creativeSummary,
      prompts: generatedPrompts,
    };
    downloadFile(
      `moodboard-${(title || 'tablero').toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.json`,
      JSON.stringify(payload, null, 2),
      'application/json'
    );
  };

  const handleExportTxt = () => {
    const text = [
      '====================================================',
      'NÚCLEO COLECTIVO · VISUAL PROMPT LAB — MOODBOARD',
      '====================================================',
      '',
      creativeSummary,
      '',
      '--- PROMPT EN ESPAÑOL ---',
      generatedPrompts.es,
      '',
      '--- PROMPT IN ENGLISH ---',
      generatedPrompts.en,
    ].join('\n');
    downloadFile(
      `moodboard-${(title || 'tablero').toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.txt`,
      text,
      'text/plain;charset=utf-8'
    );
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#7545D6] dark:text-[#C5B0FF] font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Estudio de Dirección de Arte · Moodboard Builder</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#101014] dark:text-[#F4F2ED] tracking-tight leading-tight">
              Construye tu tablero visual y tradúcelo a un prompt estructurado.
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-black/65 dark:text-white/65 leading-relaxed">
              Reúne referencias visuales de la galería o desde tu equipo, define una paleta cromática, selecciona estilos y palabras clave para generar un resumen creativo listo para el Constructor Modular o para archivar en Mis proyectos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleNewBoard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#F4F2ED] dark:bg-white/5 text-xs font-mono uppercase tracking-wider font-semibold text-[#101014] dark:text-[#F4F2ED] hover:border-black/35 dark:hover:border-white/35 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Nuevo tablero
            </button>
            <button
              type="button"
              onClick={handleSaveToProjects}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8C300] text-[#101014] text-xs font-mono uppercase tracking-wider font-bold hover:brightness-95 transition-all cursor-pointer"
            >
              {savedFeedback ? <Check className="w-3.5 h-3.5" /> : <BookmarkCheck className="w-3.5 h-3.5" />}
              {savedFeedback ? 'Guardado en Mis proyectos' : 'Guardar en Mis proyectos'}
            </button>
            {onOpenProjects && (
              <button
                type="button"
                onClick={onOpenProjects}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-[#1E1E26] text-xs font-mono uppercase tracking-wider font-semibold text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF] transition-colors cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Mis proyectos ({savedBoards.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left 7 columns: Visual Board + Controls */}
        <div className="xl:col-span-7 space-y-6">
          {/* 1. Concepto y Disciplina */}
          <section className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#101014] dark:text-[#F4F2ED]">
                01. Concepto y disciplina del tablero
              </h3>
              <span className="font-mono text-[11px] text-black/45 dark:text-white/45">
                {references.length}/8 referencias
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
                  Título del moodboard
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Campaña Botánica 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:ring-2 focus:ring-[#326BFF]"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
                  Disciplina creativa
                </label>
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value as BuilderCategoryId)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:ring-2 focus:ring-[#326BFF]"
                >
                  {DISCIPLINE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
                Concepto narrativo o intención visual
              </label>
              <textarea
                rows={3}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Describe qué atmósfera, historia o emoción debe transmitir este universo visual..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:ring-2 focus:ring-[#326BFF] resize-y"
              />
            </div>
          </section>

          {/* 2. Referencias Visuales */}
          <section className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#101014] dark:text-[#F4F2ED]">
                  02. Tablero de referencias visuales
                </h3>
                <p className="text-xs text-black/55 dark:text-white/55 mt-0.5">
                  Organiza el orden de prioridad, asigna el rol de cada imagen y anota qué elemento tomarás de ella.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGalleryPicker((v) => !v)}
                  disabled={references.length >= 8}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#101014] dark:bg-[#F4F2ED] text-[#F4F2ED] dark:text-[#101014] text-xs font-mono uppercase tracking-wider font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  Desde Galería
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={references.length >= 8}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#F4F2ED] dark:bg-white/5 text-xs font-mono uppercase tracking-wider font-semibold text-[#101014] dark:text-[#F4F2ED] hover:border-[#326BFF] disabled:opacity-40 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Subir foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadLocalImage}
                  className="hidden"
                />
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{uploadError}</p>
            )}

            {/* Inline Gallery Picker */}
            {showGalleryPicker && (
              <div className="rounded-2xl border border-[#326BFF]/30 bg-[#F4F2ED] dark:bg-[#0D0D12] p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-black/45 dark:text-white/45 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      placeholder="Buscar entre las 40 láminas por título, colección o estilo..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:ring-2 focus:ring-[#326BFF]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGalleryPicker(false)}
                    className="p-2 rounded-lg text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                    aria-label="Cerrar selector de galería"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {filteredGallery.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddGalleryRef(item)}
                      className="group text-left rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#16161C] hover:border-[#326BFF] transition-colors cursor-pointer"
                    >
                      <div className="aspect-[3/2] bg-black/5 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2">
                        <div className="font-mono text-[10px] text-black/50 dark:text-white/50 truncate">
                          {item.code} · {item.collection}
                        </div>
                        <div className="text-[11px] font-semibold text-[#101014] dark:text-[#F4F2ED] truncate">
                          {item.title}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* References Grid */}
            {references.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/20 dark:border-white/20 p-8 text-center">
                <p className="text-sm text-black/60 dark:text-white/60">
                  Tu tablero todavía no tiene imágenes. Añade referencias de la Galería o sube fotografías desde tu dispositivo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {references.map((ref, idx) => (
                  <div
                    key={ref.id}
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#F4F2ED]/60 dark:bg-[#0D0D12] overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[3/2] bg-black/10 overflow-hidden">
                      <img
                        src={ref.image}
                        alt={ref.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white font-mono text-[10px] uppercase tracking-wider">
                        0{idx + 1} · {ref.source === 'galeria' ? 'Galería' : 'Archivo'}
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveReference(idx, -1)}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-black/70 text-white disabled:opacity-30 hover:bg-black cursor-pointer"
                          title="Subir prioridad"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveReference(idx, 1)}
                          disabled={idx === references.length - 1}
                          className="p-1.5 rounded-lg bg-black/70 text-white disabled:opacity-30 hover:bg-black cursor-pointer"
                          title="Bajar prioridad"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeReference(ref.id)}
                          className="p-1.5 rounded-lg bg-red-600/85 text-white hover:bg-red-600 cursor-pointer"
                          title="Quitar referencia"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#101014] dark:text-[#F4F2ED] truncate">
                          {ref.title}
                        </span>
                        <select
                          value={ref.role}
                          onChange={(e) =>
                            updateReference(ref.id, {
                              role: e.target.value as MoodboardReferenceItem['role'],
                            })
                          }
                          className="px-2 py-1 rounded-lg bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/15 font-mono text-[10px] uppercase text-[#101014] dark:text-[#F4F2ED]"
                        >
                          {REFERENCE_ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        value={ref.note}
                        onChange={(e) => updateReference(ref.id, { note: e.target.value })}
                        placeholder="¿Qué elemento tomas de esta referencia?"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 text-xs text-black/80 dark:text-white/80 focus:outline-none focus:ring-1 focus:ring-[#326BFF]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 3. Paleta Cromática */}
          <section className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#7545D6] dark:text-[#C5B0FF]" />
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#101014] dark:text-[#F4F2ED]">
                  03. Paleta cromática
                </h3>
              </div>
              <span className="font-mono text-[11px] text-black/50 dark:text-white/50">
                {activePalette.name}
              </span>
            </div>

            {/* Active Swatches Strip */}
            <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
              <div className="grid" style={{ gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))` }}>
                {colors.map((hex) => (
                  <div
                    key={hex}
                    className="group relative h-20 flex flex-col justify-end p-2"
                    style={{ backgroundColor: hex }}
                  >
                    {colors.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(hex)}
                        className="opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 p-1 rounded bg-black/70 text-white transition-opacity cursor-pointer"
                        title={`Quitar ${hex}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <span className="inline-block self-start px-1.5 py-0.5 rounded bg-black/65 text-white font-mono text-[10px]">
                      {hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add custom swatch */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                aria-label="Selector de color personalizado"
                className="w-10 h-9 rounded-lg border border-black/15 dark:border-white/15 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                className="w-28 px-3 py-2 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 font-mono text-xs text-[#101014] dark:text-[#F4F2ED]"
              />
              <button
                type="button"
                onClick={handleAddColor}
                disabled={colors.length >= 7}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#F4F2ED] dark:bg-white/5 text-xs font-mono uppercase tracking-wider font-semibold text-[#101014] dark:text-[#F4F2ED] disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir color
              </button>
            </div>

            {/* Preset Palettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {PALETTE_PRESETS.map((preset) => {
                const isSelected = preset.id === selectedPaletteId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPalette(preset)}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#326BFF] bg-[#326BFF]/5 dark:bg-[#326BFF]/10'
                        : 'border-black/10 dark:border-white/10 bg-[#F4F2ED]/50 dark:bg-white/[0.02] hover:border-black/25 dark:hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]">
                        {preset.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {preset.colors.map((c) => (
                          <span
                            key={c}
                            className="w-3.5 h-3.5 rounded-sm border border-black/15"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-black/55 dark:text-white/55 leading-snug">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4. Estilos Visuales y Palabras Clave */}
          <section className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#101014] dark:text-[#F4F2ED]">
                  04. Estilos visuales (hasta 4)
                </h3>
                <span className="font-mono text-[11px] text-black/45 dark:text-white/45">
                  {selectedStyles.length}/4 activos
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STYLE_OPTIONS.map((style) => {
                  const active = selectedStyles.includes(style.label);
                  return (
                    <button
                      key={style.label}
                      type="button"
                      onClick={() => handleToggleStyle(style.label)}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-transparent font-semibold'
                          : 'bg-[#F4F2ED] dark:bg-white/5 text-black/75 dark:text-white/75 border-black/10 dark:border-white/10 hover:border-black/30'
                      }`}
                    >
                      {style.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#101014] dark:text-[#F4F2ED]">
                05. Palabras clave y atmósfera
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                  placeholder="Añade una palabra clave (ej. luz difusa, lino crudo)..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:ring-2 focus:ring-[#326BFF]"
                />
                <button
                  type="button"
                  onClick={() => handleAddKeyword()}
                  className="px-4 py-2 rounded-xl bg-[#101014] dark:bg-[#F4F2ED] text-[#F4F2ED] dark:text-[#101014] font-mono text-xs uppercase font-semibold cursor-pointer"
                >
                  Añadir
                </button>
              </div>

              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#7545D6]/10 dark:bg-[#7545D6]/25 text-[#582CB2] dark:text-[#D5C4FF] font-mono text-[11px]"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="hover:text-red-500 cursor-pointer"
                        aria-label={`Quitar ${kw}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-black/45 dark:text-white/45 mr-1">
                  Sugerencias:
                </span>
                {SUGGESTED_KEYWORDS.filter((k) => !keywords.includes(k)).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleAddKeyword(sug)}
                    className="px-2 py-0.5 rounded-md border border-black/10 dark:border-white/10 text-[11px] text-black/65 dark:text-white/65 hover:border-[#326BFF] hover:text-[#326BFF] transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right 5 columns: Sticky Live Preview, Creative Summary & Generated Prompt */}
        <div className="xl:col-span-5 space-y-6 xl:sticky xl:top-24">
          {/* Live Board Preview Card */}
          <div className="rounded-3xl bg-[#101014] text-[#F4F2ED] border border-white/10 p-6 space-y-5 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F8C300]">
                  TABLERO DE DIRECCIÓN · {activeDisciplineLabel}
                </div>
                <h3 className="font-serif text-2xl font-bold mt-1 leading-snug">
                  {title || 'Tablero sin título'}
                </h3>
              </div>
              <div className="flex -space-x-1">
                {colors.slice(0, 5).map((c) => (
                  <span
                    key={c}
                    className="w-5 h-5 rounded-full border border-black/40"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Mini visual collage preview */}
            {references.length > 0 && (
              <div className="grid grid-cols-3 gap-1.5 rounded-2xl overflow-hidden">
                {references.slice(0, 6).map((ref) => (
                  <div key={ref.id} className="relative aspect-[4/3] bg-white/5 overflow-hidden">
                    <img src={ref.image} alt={ref.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 font-mono text-[9px] uppercase text-white/90">
                      {ref.role}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Resumen creativo */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Resumen creativo
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('summary', creativeSummary)}
                  className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-[#F8C300] hover:underline cursor-pointer"
                >
                  {copiedKey === 'summary' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedKey === 'summary' ? 'Copiado' : 'Copiar resumen'}
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs text-white/80 leading-relaxed">
                {creativeSummary}
              </pre>
            </div>

            {/* Generated Prompt from Moodboard */}
            <div className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F8C300]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Prompt generado desde el tablero
                </span>
                <div className="inline-flex rounded-lg border border-white/15 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPromptLang('es')}
                    className={`px-2 py-0.5 font-mono text-[10px] uppercase cursor-pointer ${
                      promptLang === 'es' ? 'bg-[#F8C300] text-[#101014] font-bold' : 'text-white/70'
                    }`}
                  >
                    ES
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromptLang('en')}
                    className={`px-2 py-0.5 font-mono text-[10px] uppercase cursor-pointer ${
                      promptLang === 'en' ? 'bg-[#F8C300] text-[#101014] font-bold' : 'text-white/70'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
              <p className="font-mono text-xs text-white/90 leading-relaxed select-all">
                {activePrompt}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCopy('prompt', activePrompt)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#F8C300] text-[#101014] font-mono text-xs uppercase tracking-wider font-bold hover:brightness-95 cursor-pointer"
                >
                  {copiedKey === 'prompt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'prompt' ? 'Prompt copiado' : 'Copiar prompt'}
                </button>
                <button
                  type="button"
                  onClick={handleSendToBuilder}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#326BFF] text-white font-mono text-xs uppercase tracking-wider font-bold hover:brightness-110 cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Enviar al Constructor
                </button>
              </div>
            </div>

            {/* Export Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveToProjects}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-[#F8C300]" />
                {savedFeedback ? 'Guardado' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                .JSON
              </button>
              <button
                type="button"
                onClick={handleExportTxt}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10 text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                .TXT
              </button>
            </div>
          </div>

          {/* Saved Moodboards Drawer */}
          <div className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs uppercase tracking-[0.16em] font-bold text-[#101014] dark:text-[#F4F2ED]">
                Tableros guardados ({savedBoards.length})
              </h4>
              {onOpenProjects && (
                <button
                  type="button"
                  onClick={onOpenProjects}
                  className="font-mono text-[11px] text-[#326BFF] hover:underline cursor-pointer"
                >
                  Ver en Mis proyectos →
                </button>
              )}
            </div>

            {savedBoards.length === 0 ? (
              <p className="text-xs text-black/55 dark:text-white/55">
                Guarda tu primer moodboard para reutilizarlo después desde este estudio o desde Mis proyectos.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {savedBoards.map((board) => (
                  <div
                    key={board.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-colors ${
                      board.id === boardId
                        ? 'border-[#326BFF] bg-[#326BFF]/5 dark:bg-[#326BFF]/10'
                        : 'border-black/10 dark:border-white/10 bg-[#F4F2ED]/60 dark:bg-white/[0.02]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleLoadBoard(board)}
                      className="text-left min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED] truncate">
                        {board.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-black/50 dark:text-white/50">
                          {board.discipline} · {board.references.length} refs
                        </span>
                        <span className="inline-flex gap-0.5">
                          {board.colors.slice(0, 4).map((c) => (
                            <span
                              key={c}
                              className="w-2.5 h-2.5 rounded-full border border-black/15"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBoard(board.id)}
                      className="p-1.5 rounded-lg text-black/45 dark:text-white/45 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
                      aria-label={`Eliminar tablero ${board.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
