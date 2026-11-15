import React from 'react';

interface ToolBrandLogoProps {
  toolId: string;
  brandColor: string;
  shortCode: string;
  name: string;
}

export const ToolBrandLogo: React.FC<ToolBrandLogoProps> = ({
  toolId,
  brandColor,
  shortCode,
  name,
}) => {
  const renderMark = () => {
    switch (toolId) {
      case 'tool-google-aistudio':
      case 'tool-gemini':
      case 'tool-veo':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
              fill="currentColor"
            />
          </svg>
        );
      case 'tool-notebooklm':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M4 17C4 12.58 7.58 9 12 9C16.42 9 20 12.58 20 17"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M7.5 17C7.5 14.51 9.51 12.5 12 12.5C14.49 12.5 16.5 14.51 16.5 17"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="17" r="1.6" fill="currentColor" />
          </svg>
        );
      case 'tool-claude':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M12 3V21M3 12H21M5.6 5.6L18.4 18.4M18.4 5.6L5.6 18.4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'tool-chatgpt':
      case 'tool-sora':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 4.5L16.5 9.5L14 16H10L7.5 9.5L12 4.5Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'tool-perplexity':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.9" />
            <path d="M12 4V20M4 12H20M7 7L17 17M17 7L7 17" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'tool-lovable':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M12 20.5C12 20.5 4.5 15.4 4.5 9.6C4.5 6.9 6.6 4.8 9.2 4.8C10.8 4.8 12 5.7 12 6.8C12 5.7 13.2 4.8 14.8 4.8C17.4 4.8 19.5 6.9 19.5 9.6C19.5 15.4 12 20.5 12 20.5Z"
              fill="currentColor"
            />
          </svg>
        );
      case 'tool-bolt':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M13.5 2L4.5 13.5H11.5L10.5 22L19.5 10.5H12.5L13.5 2Z"
              fill="currentColor"
            />
          </svg>
        );
      case 'tool-v0':
      case 'tool-cursor':
      case 'tool-replit':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M7 8L3.5 12L7 16M17 8L20.5 12L17 16M13.5 5.5L10.5 18.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'tool-capcut':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M5 7L19 17M19 7L5 17"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        );
      case 'tool-runway':
      case 'tool-kling':
      case 'tool-luma':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.9" />
            <path d="M10 9.5L15.5 12L10 14.5V9.5Z" fill="currentColor" />
          </svg>
        );
      case 'tool-midjourney':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M5 17C8 14 9 9 9 6C12 9 13 13 13 17M13 17C15 13 16 10 16 7.5C18 10.5 19 13.5 19 17M3.5 19H20.5"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'tool-flux':
      case 'tool-ideogram':
      case 'tool-krea':
      case 'tool-firefly':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.9" />
            <circle cx="9.5" cy="9.5" r="1.5" fill="currentColor" />
            <path
              d="M5.5 17.5L10.5 12.5L14 15.5L16.5 13L19.5 17.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'tool-elevenlabs':
      case 'tool-suno-udio':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M5 10V14M9 6V18M13 8V16M17 5V19M21 10V14"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'tool-davinci':
      case 'tool-premiere-ae':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <circle cx="12" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.9" />
            <circle cx="8" cy="15.5" r="3" stroke="currentColor" strokeWidth="1.9" />
            <circle cx="16" cy="15.5" r="3" stroke="currentColor" strokeWidth="1.9" />
          </svg>
        );
      case 'tool-blender':
      case 'tool-unreal-c4d':
      case 'tool-touchdesigner':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
            <path
              d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />
            <path d="M12 12L20 7.5M12 12V21M12 12L4 7.5" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        );
      case 'tool-figma-ps':
      case 'tool-canva':
      default:
        return (
          <span className="text-[11px] font-mono-code font-bold tracking-tighter">
            {shortCode}
          </span>
        );
    }
  };

  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-xs shrink-0 border border-black/10"
      style={{ backgroundColor: brandColor }}
      title={`Logo de ${name}`}
      aria-hidden="true"
    >
      {renderMark()}
    </div>
  );
};
