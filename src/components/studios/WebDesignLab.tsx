import React, { useMemo, useState } from 'react';
import {
  Globe,
  Copy,
  Check,
  Download,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  STUDIO_MEDIA_ASSETS,
  WEB_CATEGORIES,
  WEB_CONCEPTS_LIBRARY,
} from '../../data/creativeStudiosData';
import { ResilientImage } from '../ResilientImage';

interface WebDesignLabProps {
  onOpenChallenges?: () => void;
}

const TARGET_AI_TOOLS = [
  { name: 'Google AI Studio', url: 'https://aistudio.google.com/' },
  { name: 'Bolt.new', url: 'https://bolt.new/' },
  { name: 'Replit Agent', url: 'https://replit.com/' },
  { name: 'Lovable', url: 'https://lovable.dev/' },
];

export const WebDesignLab: React.FC<WebDesignLabProps> = ({ onOpenChallenges }) => {
  const [siteType, setSiteType] = useState(WEB_CATEGORIES[0].name);
  const [projectTitle, setProjectTitle] = useState('Archivo Vivo · Taller de Cerámica y Arte Comunitario');
  const [objective, setObjective] = useState('Dar a conocer el catálogo de obras, abrir inscripciones a talleres y facilitar contacto directo.');
  const [audience, setAudience] = useState('Visitantes culturales, compradores de arte local y estudiantes jóvenes en móvil y escritorio.');
  const [visualIdentity, setVisualIdentity] = useState('Papel cálido (#F4F2ED), negro grafito (#101014) y acento amarillo editorial (#F8C300)');
  const [graphicStyle, setGraphicStyle] = useState('Editorial contemporáneo con retícula modular');
  const [pages, setPages] = useState('Inicio (Hero + Propuesta), Catálogo/Galería filtrable, Talleres e Inscripción, Sobre el Proyecto y Contacto');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([
    'Header limpio 3 zonas',
    'Hero editorial con CTA único',
    'Rejilla de tarjetas filtrable',
    'Visor Lightbox con ficha técnica',
    'Formulario accesible de contacto',
  ]);
  const [interactions, setInteractions] = useState('Transiciones suaves ≤ 200ms, filtros instantáneos sin recarga y respeto a prefers-reduced-motion');
  const [functionalities, setFunctionalities] = useState('Buscador en tiempo real, guardado de favoritos en navegador (localStorage) y exportación de resumen');
  const [techStack, setTechStack] = useState('React + TypeScript + Vite + Tailwind CSS');
  const [responsiveMode, setResponsiveMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [targetTool, setTargetTool] = useState('Google AI Studio');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const availableComponents = [
    'Header limpio 3 zonas',
    'Hero editorial con CTA único',
    'Rejilla de tarjetas filtrable',
    'Visor Lightbox con ficha técnica',
    'Tabla comparativa clara',
    'Acordeón de preguntas frecuentes',
    'Formulario accesible de contacto',
    'Modo claro / oscuro coherente',
  ];

  const toggleComponent = (comp: string) => {
    setSelectedComponents((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  const generatedWebPrompt = useMemo(() => {
    return [
      `PROMPT DE IMPLEMENTACIÓN WEB — LISTO PARA ${targetTool.toUpperCase()}`,
      `==================================================================`,
      `Actúa como diseñador UX/UI senior y desarrollador frontend especialista en ${techStack}.`,
      ``,
      `1. PROYECTO Y TIPO DE SITIO`,
      `- Tipo: ${siteType}`,
      `- Nombre del proyecto: ${projectTitle}`,
      `- Objetivo principal: ${objective}`,
      `- Público objetivo: ${audience}`,
      ``,
      `2. DIRECCIÓN VISUAL, ESTÉTICA Y TIPOGRAFÍA`,
      `- Estilo gráfico: ${graphicStyle}`,
      `- Identidad cromática (regla 60-30-10): ${visualIdentity}`,
      `- Jerarquía tipográfica: 1 fuente Display expresiva + 1 fuente limpia para lectura (15–16px, interlineado 1.6) + monoespaciada tabular para datos.`,
      ``,
      `3. ARQUITECTURA DE PÁGINAS Y COMPONENTES`,
      `- Estructura de vistas/secciones: ${pages}`,
      `- Componentes obligatorios: ${selectedComponents.join(', ') || 'Hero, Grid de tarjetas, Navegación y Footer'}`,
      `- Funcionalidades reales requeridas: ${functionalities}`,
      ``,
      `4. INTERACCIÓN, RESPONSIVE Y ACCESIBILIDAD (WCAG AA)`,
      `- Microinteracciones: ${interactions}`,
      `- Diseño Responsive (Mobile-First): adaptación fluida para móvil (375px), tablet (768px) y escritorio (1440px), sin desbordamiento horizontal y áreas táctiles ≥ 44px.`,
      `- Accesibilidad obligatoria: contraste mínimo 4.5:1, navegación completa por teclado con foco visible, HTML semántico (<header>, <main>, <nav>, <footer>) y textos alt descriptivos.`,
      `- Código limpio, modular y listo para producción sin datos inventados ni elementos decorativos rotos.`,
    ].join('\n');
  }, [
    targetTool,
    techStack,
    siteType,
    projectTitle,
    objective,
    audience,
    graphicStyle,
    visualIdentity,
    pages,
    selectedComponents,
    functionalities,
    interactions,
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1700);
  };

  const handleDownloadPrompt = () => {
    const blob = new Blob([generatedWebPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-sitio-web-nucleo-colectivo.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header Split with Visual Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code font-bold uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300]">
              <span>MÓDULO 09 · WEB DESIGN & WEBSITE BUILDER</span>
              <span aria-hidden="true">·</span>
              <span>CONSTRUCCIÓN DE SITIOS REALES CON IA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] text-balance">
              Diseña sitios web funcionales, accesibles y responsive con IA
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
              Este laboratorio no genera únicamente maquetas visuales estáticas: enseña arquitectura de información, sistemas UI/UX, diseño adaptable, accesibilidad WCAG y genera un prompt técnico estructurado para construir tu sitio en <strong>Google AI Studio, Bolt, Replit o Lovable</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#website-builder-form"
              className="px-4 py-2.5 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <Globe className="w-4 h-4" />
              <span>Ir al Website Prompt Builder</span>
            </a>
            {onOpenChallenges && (
              <button
                type="button"
                onClick={onOpenChallenges}
                className="px-4 py-2.5 text-xs font-semibold rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7545D6] dark:text-[#F8C300]" />
                <span>Ver Reto 05 · Mi primera página web</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#DEDAD0] dark:border-[#26262E] bg-[#101014] flex flex-col">
          <ResilientImage
            src={STUDIO_MEDIA_ASSETS.webDesignShowcase}
            alt="Referencia editorial de arquitectura web responsive en escritorio, papel reticular y móvil"
            aspectRatio="16:9"
            containerClassName="w-full h-full min-h-[220px]"
          />
          <div className="px-4 py-2.5 text-[11px] font-mono-code text-[#B4B2AC] border-t border-white/10">
            Referencia UI/UX · Retícula editorial, escala tipográfica y vista móvil
          </div>
        </div>
      </div>

      {/* 12 Web Categories */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
              12 Tipologías de Proyectos Web (clic para precargar en el constructor)
            </h3>
            <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC]">
              Selecciona qué vas a construir para adaptar componentes, flujo y estructura del prompt.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {WEB_CATEGORIES.map((cat) => {
            const active = siteType === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSiteType(cat.name)}
                className={`p-4 rounded-xl border text-left transition-colors space-y-1 ${
                  active
                    ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300]'
                    : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                <div className="text-xs font-bold">{cat.name}</div>
                <p
                  className={`text-[11px] leading-snug ${
                    active ? 'opacity-90' : 'text-[#4A4A55] dark:text-[#B4B2AC]'
                  }`}
                >
                  {cat.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Concept Library UI / UX / Dev / Accessibility */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
          Biblioteca de Conceptos UI, UX, Desarrollo y Accesibilidad
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {WEB_CONCEPTS_LIBRARY.map((item) => (
            <div
              key={item.topic}
              className="p-4 rounded-xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2"
            >
              <div className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                {item.topic}
              </div>
              <div className="text-[11px] font-mono-code text-[#101014] dark:text-[#F4F2ED]">
                {item.concepts.join(' · ')}
              </div>
              <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Website Prompt Builder + Responsive Wireframe Preview */}
      <div
        id="website-builder-form"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24"
      >
        {/* Left: Form Controls */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
          <div className="flex items-center justify-between border-b border-[#DEDAD0] dark:border-[#26262E] pb-3">
            <div>
              <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                Website Prompt Builder
              </h3>
              <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC]">
                Configura arquitectura, estética, componentes y pila técnica
              </p>
            </div>
            <Layers className="w-5 h-5 text-[#326BFF] dark:text-[#F8C300]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
                Tipo de sitio
              </label>
              <select
                value={siteType}
                onChange={(e) => setSiteType(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              >
                {WEB_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
                Tecnología / Stack
              </label>
              <select
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              >
                <option value="React + TypeScript + Vite + Tailwind CSS">React + TypeScript + Tailwind</option>
                <option value="Next.js App Router + TypeScript + Tailwind CSS">Next.js + TypeScript + Tailwind</option>
                <option value="HTML5 semántico + CSS Grid/Flexbox + JavaScript limpio">HTML + CSS + JS puro</option>
                <option value="Astro + Tailwind CSS (sitio editorial rápido)">Astro + Tailwind (Editorial)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
              Nombre del proyecto / sitio
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
                Objetivo principal
              </label>
              <textarea
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
                Público objetivo
              </label>
              <textarea
                rows={2}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
                Estilo gráfico
              </label>
              <select
                value={graphicStyle}
                onChange={(e) => setGraphicStyle(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              >
                <option value="Editorial contemporáneo con retícula modular">Editorial contemporáneo</option>
                <option value="Minimalismo suizo de alto contraste">Minimalismo suizo</option>
                <option value="Brutalismo tipográfico cultural">Brutalismo tipográfico</option>
                <option value="Limpio cálido artesanal para emprendimientos">Cálido artesanal</option>
                <option value="Futurista sobrio con estética de laboratorio">Laboratorio sobrio</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
                Paleta e identidad visual
              </label>
              <input
                type="text"
                value={visualIdentity}
                onChange={(e) => setVisualIdentity(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
              Páginas y estructura de navegación
            </label>
            <input
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
            />
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
              Componentes UI incluidos
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableComponents.map((comp) => {
                const selected = selectedComponents.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleComponent(comp)}
                    className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                      selected
                        ? 'bg-[#326BFF] text-white border-[#326BFF]'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] text-[#4A4A55] dark:text-[#B4B2AC] border-[#DEDAD0] dark:border-[#26262E]'
                    }`}
                  >
                    {comp}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
                Funcionalidades interactivas
              </label>
              <input
                type="text"
                value={functionalities}
                onChange={(e) => setFunctionalities(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono-code font-bold text-[#101014] dark:text-[#F4F2ED] block">
                Animación e interacción
              </label>
              <input
                type="text"
                value={interactions}
                onChange={(e) => setInteractions(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
          </div>
        </div>

        {/* Right: Responsive Wireframe Simulator + Generated Prompt Output */}
        <div className="lg:col-span-6 space-y-5">
          {/* Interactive Responsive Layout Preview */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
                Previsualización estructural Responsive
              </span>
              <div className="inline-flex rounded-lg border border-[#DEDAD0] dark:border-[#26262E] p-0.5 bg-[#F4F2ED] dark:bg-[#101014] text-xs">
                {[
                  { id: 'desktop' as const, label: 'Desktop', icon: <Monitor className="w-3.5 h-3.5" /> },
                  { id: 'tablet' as const, label: 'Tablet', icon: <Tablet className="w-3.5 h-3.5" /> },
                  { id: 'mobile' as const, label: 'Móvil', icon: <Smartphone className="w-3.5 h-3.5" /> },
                ].map((vp) => (
                  <button
                    key={vp.id}
                    type="button"
                    onClick={() => setResponsiveMode(vp.id)}
                    className={`px-2.5 py-1 rounded-md inline-flex items-center gap-1 font-semibold ${
                      responsiveMode === vp.id
                        ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014]'
                        : 'text-[#4A4A55] dark:text-[#B4B2AC]'
                    }`}
                  >
                    {vp.icon}
                    <span>{vp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] flex justify-center">
              <div
                className={`bg-white dark:bg-[#16161C] border border-[#D4D0C5] dark:border-[#2C2C36] rounded-xl p-3.5 sm:p-4 space-y-3 transition-all w-full ${
                  responsiveMode === 'desktop'
                    ? 'max-w-full'
                    : responsiveMode === 'tablet'
                    ? 'max-w-[460px]'
                    : 'max-w-[270px]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#DEDAD0] dark:border-[#26262E] pb-2 text-[10px] font-mono-code font-bold">
                  <span className="truncate">{projectTitle}</span>
                  <span>{responsiveMode === 'mobile' ? '☰ Menú' : 'Inicio · Galería · Contacto'}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#101014] text-[#F4F2ED] space-y-1.5">
                  <div className="text-[10px] font-mono-code text-[#F8C300]">{siteType}</div>
                  <div className="text-xs font-bold leading-snug">{projectTitle}</div>
                  <div className="text-[10px] text-[#B4B2AC] line-clamp-2">{objective}</div>
                </div>
                <div
                  className={`grid gap-2 ${
                    responsiveMode === 'desktop'
                      ? 'grid-cols-3'
                      : responsiveMode === 'tablet'
                      ? 'grid-cols-2'
                      : 'grid-cols-1'
                  }`}
                >
                  {(selectedComponents.slice(0, 3).length > 0
                    ? selectedComponents.slice(0, 3)
                    : ['Tarjeta 1', 'Tarjeta 2', 'Tarjeta 3']
                  ).map((c) => (
                    <div
                      key={c}
                      className="p-2 rounded border border-[#DEDAD0] dark:border-[#26262E] text-[10px] font-mono-code text-[#4A4A55] dark:text-[#B4B2AC] truncate"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generated Implementation Prompt */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F4F2ED]">
                <CheckCircle2 className="w-4 h-4 text-[#326BFF] dark:text-[#F8C300]" />
                <span>Prompt listo para entorno de desarrollo IA</span>
              </div>
              <select
                aria-label="Herramienta destino"
                value={targetTool}
                onChange={(e) => setTargetTool(e.target.value)}
                className="px-2.5 py-1 text-xs font-mono-code rounded border border-[#DEDAD0] dark:border-[#26262E] bg-[#F4F2ED] dark:bg-[#101014]"
              >
                {TARGET_AI_TOOLS.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <pre className="p-3.5 rounded-xl bg-[#101014] text-[#F4F2ED] text-[11px] font-mono-code overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap">
              {generatedWebPrompt}
            </pre>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(generatedWebPrompt, 'web-prompt')}
                className="px-4 py-2.5 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                {copiedId === 'web-prompt' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'web-prompt' ? 'Prompt copiado' : 'Copiar prompt completo'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPrompt}
                className="px-3.5 py-2.5 text-xs font-semibold rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar .MD</span>
              </button>

              {TARGET_AI_TOOLS.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-[11px] font-mono-code font-semibold rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>{tool.name}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
