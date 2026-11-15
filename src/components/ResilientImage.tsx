import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

export type VisualAspectRatio = '4:5' | '3:4' | '3:2' | '16:9' | '1:1' | '9:16' | 'auto';

export interface ResilientImageProps {
  src: string;
  alt: string;
  aspectRatio?: VisualAspectRatio;
  objectPosition?: 'center' | 'top' | 'bottom';
  className?: string;
  containerClassName?: string;
  fallbackLabel?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export function getAspectRatioClass(ratio?: VisualAspectRatio): string {
  switch (ratio) {
    case '4:5':
      return 'aspect-[4/5]';
    case '3:4':
      return 'aspect-[3/4]';
    case '3:2':
      return 'aspect-[3/2]';
    case '16:9':
      return 'aspect-video';
    case '1:1':
      return 'aspect-square';
    case '9:16':
      return 'aspect-[9/16]';
    default:
      return '';
  }
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  aspectRatio = 'auto',
  objectPosition = 'center',
  className = '',
  containerClassName = '',
  fallbackLabel,
  priority = false,
  style,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const aspectCls = getAspectRatioClass(aspectRatio);
  const posCls =
    objectPosition === 'top'
      ? 'object-top'
      : objectPosition === 'bottom'
        ? 'object-bottom'
        : 'object-center';

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative overflow-hidden bg-stone-900 text-stone-300 flex flex-col items-center justify-center p-4 text-center border border-stone-800 ${aspectCls} ${containerClassName}`}
      >
        <ImageOff className="w-6 h-6 text-amber-400/80 mb-2" />
        <span className="text-[11px] font-mono-code uppercase tracking-wider text-amber-300 font-semibold">
          Referencia Visual
        </span>
        <span className="text-xs text-stone-400 mt-1 line-clamp-2 max-w-[220px]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-stone-900 ${aspectCls} ${containerClassName}`}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={style}
        className={`w-full h-full object-cover ${posCls} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-85'
        } ${className}`}
      />
    </div>
  );
};
