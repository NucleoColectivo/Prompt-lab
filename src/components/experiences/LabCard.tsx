import React from 'react';
import { ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import type { CreativeLabExperience } from '../../data/creativeExperiencesData';
import { ResilientImage } from '../ResilientImage';

interface LabCardProps {
  lab: CreativeLabExperience;
  isCompleted?: boolean;
  isExperimental?: boolean;
  onOpenLab: (lab: CreativeLabExperience) => void;
}

export const LabCard: React.FC<LabCardProps> = ({
  lab,
  isCompleted = false,
  isExperimental = false,
  onOpenLab,
}) => {
  return (
    <article
      className={`group rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
        isExperimental
          ? 'bg-[#14131B] dark:bg-[#14131B] border-[#342F49] hover:border-[#F8C300] text-[#F4F2ED]'
          : 'bg-white dark:bg-[#16161C] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#F8C300] text-[#101014] dark:text-[#F4F2ED]'
      }`}
    >
      <div>
        {/* 16:9 Panoramic Cover */}
        <div className="relative aspect-video overflow-hidden bg-[#101014]">
          <ResilientImage
            src={lab.image}
            alt={lab.imageAlt}
            aspectRatio="16:9"
            containerClassName="w-full h-full"
            className="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/85 via-[#101014]/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 text-[11px] font-mono-code">
            <span className="font-bold text-[#F8C300] truncate">
              {lab.code} · {lab.category}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[#A7F3D0] font-semibold shrink-0 whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completado</span>
              </span>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-2.5">
          {/* Unboxed Typographic Metadata */}
          <div
            className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono-code ${
              isExperimental
                ? 'text-[#B9B3CC]'
                : 'text-[#5B5B66] dark:text-[#A09E97]'
            }`}
          >
            <span className="font-semibold">{lab.level}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="w-3 h-3" />
              <span>{lab.duration}</span>
            </span>
          </div>

          <h3
            className={`text-base font-bold font-display-sans leading-snug transition-colors ${
              isExperimental
                ? 'text-[#F4F2ED] group-hover:text-[#F8C300]'
                : 'text-[#101014] dark:text-[#F4F2ED] group-hover:text-[#326BFF] dark:group-hover:text-[#F8C300]'
            }`}
          >
            {lab.title}
          </h3>

          <p
            className={`text-xs leading-relaxed ${
              isExperimental
                ? 'text-[#CBC7D8]'
                : 'text-[#4A4A55] dark:text-[#B4B2AC]'
            }`}
          >
            {lab.description}
          </p>

          <p
            className={`text-xs pt-2.5 border-t leading-relaxed ${
              isExperimental
                ? 'border-[#2D2842] text-[#E6E2F0]'
                : 'border-[#ECE8DF] dark:border-[#24242C] text-[#2F2F38] dark:text-[#D7D4CC]'
            }`}
          >
            <span className="font-semibold">Ejercicio:</span> {lab.exercise}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-1">
        <button
          type="button"
          onClick={() => onOpenLab(lab)}
          className={`w-full min-h-[42px] px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
            isExperimental
              ? 'bg-[#7545D6] hover:bg-[#F8C300] text-white hover:text-[#101014]'
              : 'bg-[#F4F2ED] dark:bg-[#101014] hover:bg-[#F8C300] text-[#101014] dark:text-[#F4F2ED] hover:text-[#101014] border border-[#DEDAD0] dark:border-[#2C2C36] hover:border-[#F8C300]'
          }`}
        >
          {isExperimental && <Sparkles className="w-3.5 h-3.5 shrink-0" />}
          <span>Abrir laboratorio</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </article>
  );
};
