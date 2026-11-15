import React, { useMemo, useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import {
  BEGINNER_GLOSSARY,
  BEGINNER_STEPS_DATA,
  STUDIO_MEDIA_ASSETS,
} from '../../data/creativeStudiosData';
import { ResilientImage } from '../ResilientImage';
import type { PromptBuilderState } from '../PromptBuilder';

interface BeginnerFirstImageLabProps {
  onApplyToBuilder: (patch: Partial<PromptBuilderState>) => void;
  onOpenFundamentals?: () => void;
}

export const BeginnerFirstImageLab: React.FC<BeginnerFirstImageLabProps> = ({
  onApplyToBuilder,
  onOpenFundamentals,
}) => {
  const [subjectIdx, setSubjectIdx] = useState(0);
  const [customIdea, setCustomIdea] = useState('');
  const [styleIdx, setStyleIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const [settingIdx, setSettingIdx] = useState(0);
  const [moodIdx, setMoodIdx] = useState(0);
  const [formatIdx, setFormatIdx] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chosenSubject = BEGINNER_STEPS_DATA.subjects[subjectIdx];
  const chosenStyle = BEGINNER_STEPS_DATA.styles[styleIdx];
  const chosenColor = BEGINNER_STEPS_DATA.colors[colorIdx];
  const chosenSetting = BEGINNER_STEPS_DATA.settings[settingIdx];
  const chosenMood = BEGINNER_STEPS_DATA.moods[moodIdx];
  const chosenFormat = BEGINNER_STEPS_DATA.formats[formatIdx];

  const activeIdeaText = customIdea.trim() || chosenSubject.example;

  const builtPromptEs = useMemo(() => {
    return `${chosenStyle.label} de ${activeIdeaText}, ${chosenSetting.label.toLowerCase()}, colores ${chosenColor.label.toLowerCase()}, ambiente ${chosenMood.label.toLowerCase()}, formato ${chosenFormat.label}.`;
  }, [chosenStyle, activeIdeaText, chosenSetting, chosenColor, chosenMood, chosenFormat]);

  const builtPromptEn = useMemo(() => {
    const core = customIdea.trim() ? customIdea.trim() : chosenSubject.promptEn;
    return `${chosenStyle.promptEn} of ${core}, ${chosenSetting.promptEn}, ${chosenColor.promptEn}, ${chosenMood.promptEn}, ${chosenFormat.promptEn}.`;
  }, [chosenStyle, customIdea, chosenSubject, chosenSetting, chosenColor, chosenMood, chosenFormat]);

  // Quick 3-style comparison for Reto 06
  const threeStyleVariations = useMemo(() => {
    const core = customIdea.trim() ? customIdea.trim() : chosenSubject.promptEn;
    return [0, 1, 3].map((idx) => {
      const st = BEGINNER_STEPS_DATA.styles[idx];
      return {
        label: st.label,
        glossary: st.glossary,
        prompt: `${st.promptEn} of ${core}, ${chosenSetting.promptEn}, ${chosenColor.promptEn}, ${chosenMood.promptEn}, ${chosenFormat.promptEn}.`,
      };
    });
  }, [customIdea, chosenSubject, chosenSetting, chosenColor, chosenMood, chosenFormat]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Friendly Header without Technical Jargon */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code font-bold uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300]">
              <span>MÓDULO 12 · MI PRIMERA IMAGEN</span>
              <span aria-hidden="true">·</span>
              <span>NIVEL INICIAL SIN TECNICISMOS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] text-balance">
              Empieza desde una idea sencilla, sin hablar de cámaras ni lentes
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
              Un <strong>prompt</strong> es simplemente contarle con claridad a la inteligencia artificial qué quieres ver, en qué estilo, con qué colores y en qué lugar. Sigue estos 6 pasos en orden y obtén tu primer resultado en minutos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#recorrido-principiante"
              className="px-4 py-2.5 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Crear mi primer prompt</span>
            </a>
            {onOpenFundamentals && (
              <button
                type="button"
                onClick={onOpenFundamentals}
                className="px-4 py-2.5 text-xs font-semibold rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#326BFF]" />
                <span>¿Qué es un Prompt? (Módulo 00)</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl overflow-hidden border border-[#DEDAD0] dark:border-[#26262E] bg-[#101014] flex flex-col">
            <ResilientImage
              src={STUDIO_MEDIA_ASSETS.botanicalArt}
              alt="Ejemplo de ilustración botánica en acuarela y tinta"
              aspectRatio="3:2"
              containerClassName="w-full"
            />
            <div className="px-3 py-2 text-[11px] font-mono-code text-[#F4F2ED]">
              Estilo: Acuarela e Ilustración
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-[#DEDAD0] dark:border-[#26262E] bg-[#101014] flex flex-col">
            <ResilientImage
              src={STUDIO_MEDIA_ASSETS.sculpture3d}
              alt="Ejemplo de escena escultórica 3D"
              aspectRatio="3:2"
              containerClassName="w-full"
            />
            <div className="px-3 py-2 text-[11px] font-mono-code text-[#F4F2ED]">
              Estilo: Escena 3D Táctil
            </div>
          </div>
        </div>
      </div>

      {/* Guided 6-Step Builder */}
      <div
        id="recorrido-principiante"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24"
      >
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-6">
          {/* Paso 1 */}
          <div className="space-y-2">
            <div className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
              PASO 1 · ¿QUÉ QUIERES CREAR?
            </div>
            <div className="flex flex-wrap gap-2">
              {BEGINNER_STEPS_DATA.subjects.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSubjectIdx(idx)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    subjectIdx === idx
                      ? 'bg-[#101014] dark:bg-[#F8C300] text-[#F4F2ED] dark:text-[#101014] border-[#101014] dark:border-[#F8C300] font-bold'
                      : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              placeholder={`O escribe tu propia idea (ejemplo: ${chosenSubject.example})`}
              className="w-full p-2.5 text-xs rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
            />
          </div>

          {/* Paso 2 */}
          <div className="space-y-2">
            <div className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
              PASO 2 · ¿CÓMO QUIERES VERLO? (ESTILO)
            </div>
            <div className="flex flex-wrap gap-2">
              {BEGINNER_STEPS_DATA.styles.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStyleIdx(idx)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    styleIdx === idx
                      ? 'bg-[#F8C300] text-[#101014] border-[#F8C300] font-bold'
                      : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#4A4A55] dark:text-[#B4B2AC]">
              <strong>¿Qué significa {chosenStyle.label}?</strong> {chosenStyle.glossary}
            </p>
          </div>

          {/* Paso 3 & 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                PASO 3 · ¿QUÉ COLORES PREFIERES?
              </div>
              <div className="flex flex-col gap-1.5">
                {BEGINNER_STEPS_DATA.colors.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setColorIdx(idx)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-colors ${
                      colorIdx === idx
                        ? 'bg-[#326BFF] text-white border-[#326BFF]'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                PASO 4 · ¿EN QUÉ ESCENARIO?
              </div>
              <div className="flex flex-col gap-1.5">
                {BEGINNER_STEPS_DATA.settings.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSettingIdx(idx)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-colors ${
                      settingIdx === idx
                        ? 'bg-[#326BFF] text-white border-[#326BFF]'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Paso 5 & 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                PASO 5 · ¿QUÉ AMBIENTE QUIERES?
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BEGINNER_STEPS_DATA.moods.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMoodIdx(idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      moodIdx === idx
                        ? 'bg-[#7545D6] text-white border-[#7545D6]'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                PASO 6 · ¿QUÉ FORMATO NECESITAS?
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BEGINNER_STEPS_DATA.formats.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFormatIdx(idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      formatIdx === idx
                        ? 'bg-[#7545D6] text-white border-[#7545D6]'
                        : 'bg-[#F4F2ED] dark:bg-[#101014] border-[#DEDAD0] dark:border-[#26262E]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Simple Prompt Result + Reto 06 3-Style Comparison + Inline Glossary */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F4F2ED]">
                Tu primer prompt listo
              </span>
              <button
                type="button"
                onClick={() => handleCopy(builtPromptEn, 'beg-en')}
                className="px-3 py-1.5 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5"
              >
                {copiedId === 'beg-en' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'beg-en' ? 'Copiado' : 'Copiar prompt'}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                EN ESPAÑOL (Lectura clara)
              </div>
              <p className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] text-xs leading-relaxed">
                {builtPromptEs}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono-code font-bold text-[#326BFF] dark:text-[#F8C300]">
                EN INGLÉS (Recomendado en Gemini / ChatGPT / Midjourney)
              </div>
              <p className="p-3 rounded-xl bg-[#101014] text-[#F4F2ED] text-xs font-mono-code leading-relaxed">
                {builtPromptEn}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
              <a
                href="https://gemini.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 min-h-[42px] text-xs font-semibold rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36] hover:border-[#326BFF] inline-flex items-center justify-center gap-1"
              >
                <span>Probar en Gemini</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() =>
                  onApplyToBuilder({
                    mode: 'photo',
                    subject: builtPromptEn,
                    visualStyle: chosenStyle.label,
                    aspectRatio: chosenFormat.id,
                  })
                }
                className="sm:flex-1 px-3 py-2.5 min-h-[42px] text-xs font-bold rounded-lg bg-[#101014] dark:bg-[#F4F2ED] text-[#F4F2ED] dark:text-[#101014] inline-flex items-center justify-center gap-1.5"
              >
                <span>Pasar al Constructor Completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Reto 06 · Experimenta cambiando solo el estilo */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold uppercase text-[#7545D6] dark:text-[#F8C300]">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reto 06 · Prueba tu misma idea en 3 estilos</span>
            </div>
            <div className="space-y-2">
              {threeStyleVariations.map((v) => (
                <div
                  key={v.label}
                  className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#101014] dark:text-[#F4F2ED]">
                      {v.label}
                    </div>
                    <div className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC] truncate">
                      {v.prompt}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(v.prompt, `v-${v.label}`)}
                    className="px-2.5 py-1.5 text-[11px] font-semibold rounded border border-[#D4D0C5] dark:border-[#2C2C36] shrink-0"
                  >
                    {copiedId === `v-${v.label}` ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Plain Language Inline Glossary */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-2.5">
            <div className="text-xs font-mono-code font-bold uppercase text-[#326BFF] dark:text-[#F8C300]">
              Glosario amigable (sin jerga técnica)
            </div>
            <div className="space-y-2">
              {BEGINNER_GLOSSARY.map((g) => (
                <div key={g.term} className="text-xs">
                  <strong className="text-[#101014] dark:text-[#F4F2ED]">{g.term}:</strong>{' '}
                  <span className="text-[#4A4A55] dark:text-[#B4B2AC]">{g.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
