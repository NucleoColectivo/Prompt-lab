import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Check,
  Copy,
  Download,
  Edit3,
  FileText,
  Plus,
  Search,
  Trash2,
  Wand2,
  X,
} from 'lucide-react';
import {
  deleteJournalEntry,
  readCreativeJournal,
  saveJournalEntry,
  saveUnifiedProject,
  type CreativeJournalEntry,
} from '../services/workspaceStore';
import type { PromptBuilderState } from './PromptBuilder';
import type { BuilderCategoryId } from '../data/promptBuilderConfig';

interface CreativeJournalTabProps {
  onSendPromptToBuilder?: (patch: Partial<PromptBuilderState>) => void;
  onChanged?: () => void;
}

const JOURNAL_DISCIPLINES: { label: string; category: BuilderCategoryId }[] = [
  { label: 'Fotografía & Retrato', category: 'photo' },
  { label: 'Cine & Video', category: 'video' },
  { label: 'Diseño Gráfico & Cartel', category: 'graphic' },
  { label: 'Publicidad & Producto', category: 'branding' },
  { label: 'Ilustración & Concept Art', category: 'illustration' },
  { label: 'Arquitectura & Espacios', category: 'architecture' },
  { label: 'Diseño Web & UI', category: 'web-ui' },
  { label: 'Arte Digital & Experimental', category: 'experimental' },
];

const SUGGESTED_TOOLS = [
  'Midjourney',
  'Google AI Studio / Gemini',
  'Imagen 3',
  'Runway',
  'Veo',
  'ChatGPT / GPT Image',
  'Ideogram',
  'Flux',
  'Kling',
  'Photoshop / Lightroom',
];

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function emptyDraft(): Omit<CreativeJournalEntry, 'id' | 'updatedAt'> {
  return {
    projectName: '',
    objective: '',
    discipline: JOURNAL_DISCIPLINES[0].label,
    originalPrompt: '',
    variations: [],
    results: '',
    tools: ['Midjourney'],
    date: new Date().toISOString().slice(0, 10),
    observations: '',
    learnings: '',
  };
}

export const CreativeJournalTab: React.FC<CreativeJournalTabProps> = ({
  onSendPromptToBuilder,
  onChanged,
}) => {
  const [entries, setEntries] = useState<CreativeJournalEntry[]>(() => readCreativeJournal());
  const [isFormOpen, setIsFormOpen] = useState<boolean>(() => readCreativeJournal().length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<CreativeJournalEntry, 'id' | 'updatedAt'>>(emptyDraft);
  const [variationInput, setVariationInput] = useState('');
  const [customToolInput, setCustomToolInput] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState<string>('Todas');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchDisc = filterDiscipline === 'Todas' || entry.discipline === filterDiscipline;
      const matchQuery =
        !q ||
        entry.projectName.toLowerCase().includes(q) ||
        entry.objective.toLowerCase().includes(q) ||
        entry.originalPrompt.toLowerCase().includes(q) ||
        entry.learnings.toLowerCase().includes(q) ||
        entry.tools.some((t) => t.toLowerCase().includes(q));
      return matchDisc && matchQuery;
    });
  }, [entries, filterDiscipline, search]);

  const handleToggleTool = (tool: string) => {
    setDraft((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter((t) => t !== tool)
        : [...prev.tools, tool],
    }));
  };

  const handleAddCustomTool = () => {
    const clean = customToolInput.trim();
    if (!clean) return;
    if (!draft.tools.includes(clean)) {
      setDraft((prev) => ({ ...prev, tools: [...prev.tools, clean] }));
    }
    setCustomToolInput('');
  };

  const handleAddVariation = () => {
    const clean = variationInput.trim();
    if (!clean) return;
    setDraft((prev) => ({ ...prev, variations: [...prev.variations, clean] }));
    setVariationInput('');
  };

  const handleRemoveVariation = (idx: number) => {
    setDraft((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!draft.projectName.trim()) {
      setFormError('Escribe el nombre del proyecto para guardar el registro.');
      return;
    }
    if (!draft.originalPrompt.trim()) {
      setFormError('Incluye el prompt original para documentar el proceso.');
      return;
    }

    const entry: CreativeJournalEntry = {
      id: editingId || `journal-${Date.now()}`,
      projectName: draft.projectName.trim(),
      objective: draft.objective.trim(),
      discipline: draft.discipline,
      originalPrompt: draft.originalPrompt.trim(),
      variations: draft.variations,
      results: draft.results.trim(),
      tools: draft.tools.length > 0 ? draft.tools : ['Sin especificar'],
      date: draft.date || new Date().toISOString().slice(0, 10),
      observations: draft.observations.trim(),
      learnings: draft.learnings.trim(),
      updatedAt: new Date().toISOString(),
    };

    const next = saveJournalEntry(entry);
    setEntries(next);

    // Non-destructive sync into common UnifiedCreativeProject model
    const discMeta = JOURNAL_DISCIPLINES.find((d) => d.label === entry.discipline);
    saveUnifiedProject({
      id: `proj-journal-${entry.id}`,
      title: entry.projectName,
      discipline: entry.discipline,
      category: discMeta?.category || 'photo',
      sourceModules: ['journal'],
      initialData: {
        concept: entry.objective || entry.projectName,
        objective: entry.objective,
        notes: `Registro de Bitácora · ${entry.date}`,
      },
      prompts: [
        {
          id: `pv-orig-${entry.id}`,
          versionLabel: 'v1 (Original)',
          promptEs: entry.originalPrompt,
          source: 'journal',
          createdAt: entry.updatedAt,
        },
        ...entry.variations.map((v, idx) => ({
          id: `pv-var-${entry.id}-${idx + 1}`,
          versionLabel: `v${idx + 2} (Variación)`,
          promptEs: v,
          source: 'journal' as const,
          createdAt: entry.updatedAt,
        })),
      ],
      references: [],
      results: entry.results,
      tools: entry.tools,
      observations: entry.observations,
      learnings: entry.learnings,
      createdAt: entry.date ? `${entry.date}T00:00:00.000Z` : entry.updatedAt,
      updatedAt: entry.updatedAt,
    });

    setEditingId(null);
    setDraft(emptyDraft());
    setIsFormOpen(false);
    onChanged?.();
  };

  const handleEdit = (entry: CreativeJournalEntry) => {
    setEditingId(entry.id);
    setDraft({
      projectName: entry.projectName,
      objective: entry.objective,
      discipline: entry.discipline,
      originalPrompt: entry.originalPrompt,
      variations: [...entry.variations],
      results: entry.results,
      tools: [...entry.tools],
      date: entry.date,
      observations: entry.observations,
      learnings: entry.learnings,
    });
    setIsFormOpen(true);
    setFormError(null);
  };

  const handleDelete = (id: string) => {
    const next = deleteJournalEntry(id);
    setEntries(next);
    if (editingId === id) {
      setEditingId(null);
      setDraft(emptyDraft());
    }
    onChanged?.();
  };

  const handleExportJson = (entry: CreativeJournalEntry) => {
    const slug = entry.projectName.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
    downloadBlob(
      `bitacora-${slug || 'proyecto'}.json`,
      JSON.stringify(
        {
          platform: 'Núcleo Colectivo · Visual Prompt Lab',
          type: 'creative-journal-entry',
          exportedAt: new Date().toISOString(),
          ...entry,
        },
        null,
        2
      ),
      'application/json'
    );
  };

  const handleExportTxt = (entry: CreativeJournalEntry) => {
    const slug = entry.projectName.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
    const lines = [
      '========================================================',
      'NÚCLEO COLECTIVO · BITÁCORA CREATIVA DE PROYECTO',
      '========================================================',
      `PROYECTO:     ${entry.projectName}`,
      `FECHA:        ${entry.date}`,
      `DISCIPLINA:   ${entry.discipline}`,
      `HERRAMIENTAS: ${entry.tools.join(', ')}`,
      '',
      '--- OBJETIVO ---',
      entry.objective || '(Sin especificar)',
      '',
      '--- PROMPT ORIGINAL ---',
      entry.originalPrompt,
      '',
      '--- VARIACIONES PROBADAS ---',
      ...(entry.variations.length > 0
        ? entry.variations.map((v, i) => `${i + 1}. ${v}`)
        : ['(Sin variaciones registradas)']),
      '',
      '--- RESULTADOS ---',
      entry.results || '(Sin especificar)',
      '',
      '--- OBSERVACIONES ---',
      entry.observations || '(Sin especificar)',
      '',
      '--- APRENDIZAJES ---',
      entry.learnings || '(Sin especificar)',
    ];
    downloadBlob(`bitacora-${slug || 'proyecto'}.txt`, lines.join('\n'), 'text/plain;charset=utf-8');
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSendToBuilder = (entry: CreativeJournalEntry) => {
    if (!onSendPromptToBuilder) return;
    const disc = JOURNAL_DISCIPLINES.find((d) => d.label === entry.discipline);
    const notesParts = [
      `Bitácora · ${entry.projectName}`,
      entry.tools.length > 0 ? `Herramientas: ${entry.tools.join(', ')}` : '',
      entry.observations ? `Obs: ${entry.observations.slice(0, 180)}` : '',
    ].filter(Boolean);
    onSendPromptToBuilder({
      mode: disc?.category === 'video' ? 'video' : 'photo',
      category: disc?.category || 'photo',
      subject: entry.originalPrompt,
      ...(entry.objective ? { setting: entry.objective } : {}),
      customNotes: notesParts.join(' · '),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#7545D6] dark:text-[#C5B0FF] font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bitácora Creativa · Registro de Procesos</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#101014] dark:text-[#F4F2ED] mt-1">
            Documenta tus proyectos, variaciones y aprendizajes.
          </h3>
          <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 mt-1">
            Registra el recorrido completo de cada experimento visual y expórtalo individualmente en formato .JSON o .TXT.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isFormOpen && editingId) {
              setEditingId(null);
              setDraft(emptyDraft());
            } else {
              setIsFormOpen((v) => !v);
            }
          }}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F8C300] text-[#101014] font-mono text-xs uppercase tracking-wider font-bold hover:brightness-95 cursor-pointer"
        >
          {isFormOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {isFormOpen ? 'Cerrar formulario' : 'Registrar proyecto'}
        </button>
      </div>

      {/* Collapsible Create / Edit Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white dark:bg-[#16161C] border-2 border-[#326BFF]/35 p-6 space-y-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/10 dark:border-white/10">
            <h4 className="font-mono text-xs uppercase tracking-[0.18em] font-bold text-[#326BFF] dark:text-[#8FB0FF]">
              {editingId ? 'Editando registro de bitácora' : 'Nuevo registro en Bitácora Creativa'}
            </h4>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptyDraft());
                }}
                className="text-xs font-mono text-black/55 dark:text-white/55 hover:underline cursor-pointer"
              >
                Cancelar edición
              </button>
            )}
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 dark:text-red-300 font-medium">
              {formError}
            </div>
          )}

          {/* Row 1: Nombre, Disciplina, Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
                Nombre del proyecto *
              </label>
              <input
                type="text"
                value={draft.projectName}
                onChange={(e) => setDraft((p) => ({ ...p, projectName: e.target.value }))}
                placeholder="Ej. Serie Retratos de Taller Cerámico"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:ring-2 focus:ring-[#326BFF]"
              />
            </div>
            <div className="md:col-span-4">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
                Disciplina
              </label>
              <select
                value={draft.discipline}
                onChange={(e) => setDraft((p) => ({ ...p, discipline: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:ring-2 focus:ring-[#326BFF]"
              >
                {JOURNAL_DISCIPLINES.map((d) => (
                  <option key={d.label} value={d.label}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
                Fecha
              </label>
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-xs font-mono text-[#101014] dark:text-[#F4F2ED]"
              />
            </div>
          </div>

          {/* Row 2: Objetivo */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
              Objetivo creativo o hipótesis visual
            </label>
            <input
              type="text"
              value={draft.objective}
              onChange={(e) => setDraft((p) => ({ ...p, objective: e.target.value }))}
              placeholder="¿Qué querías probar, comunicar o resolver con esta pieza?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-sm text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:ring-2 focus:ring-[#326BFF]"
            />
          </div>

          {/* Row 3: Prompt original */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
              Prompt original *
            </label>
            <textarea
              rows={3}
              value={draft.originalPrompt}
              onChange={(e) => setDraft((p) => ({ ...p, originalPrompt: e.target.value }))}
              placeholder="Pega aquí el prompt base con el que iniciaste el proyecto..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 font-mono text-xs text-[#101014] dark:text-[#F4F2ED] focus:outline-none focus:ring-2 focus:ring-[#326BFF]"
            />
          </div>

          {/* Row 4: Variaciones */}
          <div className="space-y-2.5">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60">
              Variaciones probadas ({draft.variations.length})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={variationInput}
                onChange={(e) => setVariationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddVariation();
                  }
                }}
                placeholder="Ej. v2: cambié lente 35mm por 85mm f/1.8 y luz Rembrandt cálida..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-xs text-[#101014] dark:text-[#F4F2ED]"
              />
              <button
                type="button"
                onClick={handleAddVariation}
                className="px-3.5 py-2 rounded-xl bg-[#101014] dark:bg-[#F4F2ED] text-white dark:text-[#101014] font-mono text-xs uppercase font-semibold cursor-pointer"
              >
                Añadir
              </button>
            </div>
            {draft.variations.length > 0 && (
              <ul className="space-y-1.5">
                {draft.variations.map((v, idx) => (
                  <li
                    key={`${idx}-${v.slice(0, 12)}`}
                    className="flex items-start justify-between gap-2 px-3 py-2 rounded-xl bg-[#F4F2ED]/80 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-xs"
                  >
                    <span className="text-black/80 dark:text-white/80">
                      <strong className="font-mono text-[#326BFF] mr-1.5">v{idx + 1}.</strong>
                      {v}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariation(idx)}
                      className="text-black/45 dark:text-white/45 hover:text-red-500 cursor-pointer"
                      aria-label="Quitar variación"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Row 5: Herramientas */}
          <div className="space-y-2.5">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60">
              Herramientas utilizadas
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TOOLS.map((tool) => {
                const active = draft.tools.includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => handleToggleTool(tool)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#101014] dark:bg-[#F8C300] text-white dark:text-[#101014] border-transparent font-semibold'
                        : 'bg-[#F4F2ED] dark:bg-white/5 text-black/70 dark:text-white/70 border-black/10 dark:border-white/10'
                    }`}
                  >
                    {tool}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customToolInput}
                onChange={(e) => setCustomToolInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTool();
                  }
                }}
                placeholder="Otra herramienta (ej. Blender, ComfyUI)..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-xs text-[#101014] dark:text-[#F4F2ED]"
              />
              <button
                type="button"
                onClick={handleAddCustomTool}
                className="px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-xs font-mono uppercase cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          </div>

          {/* Row 6: Resultados, Observaciones, Aprendizajes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
                Resultados obtenidos
              </label>
              <textarea
                rows={3}
                value={draft.results}
                onChange={(e) => setDraft((p) => ({ ...p, results: e.target.value }))}
                placeholder="¿Qué funcionó bien en la imagen o secuencia generada?"
                className="w-full px-3 py-2 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-xs text-[#101014] dark:text-[#F4F2ED]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
                Observaciones técnicas
              </label>
              <textarea
                rows={3}
                value={draft.observations}
                onChange={(e) => setDraft((p) => ({ ...p, observations: e.target.value }))}
                placeholder="Notas sobre consistencia, iluminación, sesgos o ajustes de cámara."
                className="w-full px-3 py-2 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-xs text-[#101014] dark:text-[#F4F2ED]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-black/60 dark:text-white/60 mb-1.5">
                Aprendizajes clave
              </label>
              <textarea
                rows={3}
                value={draft.learnings}
                onChange={(e) => setDraft((p) => ({ ...p, learnings: e.target.value }))}
                placeholder="¿Qué repetirías o cambiarías en tu próximo proyecto?"
                className="w-full px-3 py-2 rounded-xl bg-[#F4F2ED] dark:bg-[#0D0D12] border border-black/10 dark:border-white/15 text-xs text-[#101014] dark:text-[#F4F2ED]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingId(null);
                setDraft(emptyDraft());
              }}
              className="px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 text-xs font-mono uppercase tracking-wider text-black/70 dark:text-white/70 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#101014] dark:bg-[#F8C300] text-white dark:text-[#101014] font-mono text-xs uppercase tracking-wider font-bold hover:opacity-95 cursor-pointer"
            >
              {editingId ? 'Guardar cambios' : 'Guardar en Bitácora'}
            </button>
          </div>
        </form>
      )}

      {/* Search & Filter Bar */}
      {entries.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-black/45 dark:text-white/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por proyecto, prompt, herramienta o aprendizaje..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 text-xs text-[#101014] dark:text-[#F4F2ED]"
            />
          </div>
          <select
            value={filterDiscipline}
            onChange={(e) => setFilterDiscipline(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 text-xs font-mono text-[#101014] dark:text-[#F4F2ED]"
          >
            <option value="Todas">Todas las disciplinas ({entries.length})</option>
            {JOURNAL_DISCIPLINES.map((d) => (
              <option key={d.label} value={d.label}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-[#16161C] border border-dashed border-black/15 dark:border-white/15 p-10 text-center space-y-2">
          <p className="font-serif text-xl font-bold text-[#101014] dark:text-[#F4F2ED]">
            {entries.length === 0
              ? 'Tu Bitácora Creativa está lista para tu primer proyecto.'
              : 'No hay registros que coincidan con ese filtro.'}
          </p>
          <p className="text-xs text-black/55 dark:text-white/55 max-w-md mx-auto">
            Documenta tu objetivo, prompt inicial, iteraciones, herramientas y aprendizajes para construir memoria real de tu proceso creativo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-3xl bg-white dark:bg-[#16161C] border border-black/10 dark:border-white/10 p-6 space-y-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-black/55 dark:text-white/55">
                    <span className="uppercase tracking-wider font-semibold text-[#7545D6] dark:text-[#C5B0FF]">
                      {entry.discipline}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </span>
                    <span>·</span>
                    <span>{entry.tools.join(', ')}</span>
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#101014] dark:text-[#F4F2ED] mt-1">
                    {entry.projectName}
                  </h4>
                  {entry.objective && (
                    <p className="text-sm text-black/70 dark:text-white/70 mt-1">{entry.objective}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(entry)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-[11px] font-mono uppercase hover:border-[#326BFF] cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportJson(entry)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-[11px] font-mono uppercase hover:border-[#326BFF] cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    .JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportTxt(entry)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-[11px] font-mono uppercase hover:border-[#326BFF] cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    .TXT
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg text-black/45 dark:text-white/45 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
                    aria-label={`Eliminar ${entry.projectName}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Prompt original */}
              <div className="rounded-2xl bg-[#101014] text-[#F4F2ED] p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F8C300]">
                    Prompt original
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(entry.id, entry.originalPrompt)}
                      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-white/80 hover:text-[#F8C300] cursor-pointer"
                    >
                      {copiedId === entry.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedId === entry.id ? 'Copiado' : 'Copiar'}
                    </button>
                    {onSendPromptToBuilder && (
                      <button
                        type="button"
                        onClick={() => handleSendToBuilder(entry)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-[#8FB0FF] hover:underline cursor-pointer"
                      >
                        <Wand2 className="w-3 h-3" />
                        Enviar al Constructor
                      </button>
                    )}
                  </div>
                </div>
                <p className="font-mono text-xs text-white/90 leading-relaxed">
                  {entry.originalPrompt}
                </p>
              </div>

              {/* Variations */}
              {entry.variations.length > 0 && (
                <div className="space-y-1.5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/50 dark:text-white/50">
                    Variaciones ({entry.variations.length})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {entry.variations.map((v, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-xl bg-[#F4F2ED]/80 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-xs text-black/80 dark:text-white/80"
                      >
                        <span className="font-mono font-bold text-[#326BFF] mr-1.5">v{idx + 1}.</span>
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results, Observations, Learnings */}
              {(entry.results || entry.observations || entry.learnings) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {entry.results && (
                    <div className="p-3.5 rounded-2xl bg-[#F4F2ED]/60 dark:bg-white/[0.03] border border-black/10 dark:border-white/10">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50 mb-1">
                        Resultados
                      </div>
                      <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed">
                        {entry.results}
                      </p>
                    </div>
                  )}
                  {entry.observations && (
                    <div className="p-3.5 rounded-2xl bg-[#F4F2ED]/60 dark:bg-white/[0.03] border border-black/10 dark:border-white/10">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50 mb-1">
                        Observaciones
                      </div>
                      <p className="text-xs text-black/80 dark:text-white/80 leading-relaxed">
                        {entry.observations}
                      </p>
                    </div>
                  )}
                  {entry.learnings && (
                    <div className="p-3.5 rounded-2xl bg-[#F8C300]/10 dark:bg-[#F8C300]/10 border border-[#F8C300]/30">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#9A7600] dark:text-[#F8C300] mb-1">
                        Aprendizajes
                      </div>
                      <p className="text-xs text-black/85 dark:text-white/90 leading-relaxed">
                        {entry.learnings}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
