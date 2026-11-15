import React, { useMemo, useState } from 'react';
import {
  ShoppingBag,
  Upload,
  Copy,
  Check,
  Sparkles,
  Film,
  ShieldAlert,
  Camera,
} from 'lucide-react';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_PHOTO_TECHNIQUES,
  PRODUCT_PRESERVATION_RULES,
  STUDIO_MEDIA_ASSETS,
} from '../../data/creativeStudiosData';
import { ResilientImage } from '../ResilientImage';
import type { PromptBuilderState } from '../PromptBuilder';

interface ProductCommerceLabProps {
  onApplyToBuilder: (patch: Partial<PromptBuilderState>) => void;
  externalSeedSubject?: string;
}

export const ProductCommerceLab: React.FC<ProductCommerceLabProps> = ({
  onApplyToBuilder,
  externalSeedSubject,
}) => {
  const [productCategory, setProductCategory] = useState(PRODUCT_CATEGORIES[6]); // Artesanías
  const [selectedTechId, setSelectedTechId] = useState(PRODUCT_PHOTO_TECHNIQUES[0].id);
  const [productName, setProductName] = useState(
    externalSeedSubject || 'Taza de cerámica esmaltada artesanal con pájaro de madera tallada'
  );
  const [visualFeatures, setVisualFeatures] = useState(
    'Forma cilíndrica orgánica, esmalte blanco moteado con azul mineral, veta de nogal natural sin barniz brillante.'
  );
  const [backdrop, setBackdrop] = useState('Piedra caliza mate cálida y fondo neutro limpio');
  const [lighting, setLighting] = useState('Softbox lateral grande 4800K con rebote suave y sombra de contacto natural');
  const [composition, setComposition] = useState('Tres cuartos equilibrado con espacio negativo superior para texto');
  const [adStyle, setAdStyle] = useState('Editorial artesanal premium');
  const [deliverable, setDeliverable] = useState('Fotografía de catálogo / tienda virtual');
  const [preserveLogo, setPreserveLogo] = useState(true);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedTechnique = useMemo(
    () =>
      PRODUCT_PHOTO_TECHNIQUES.find((t) => t.id === selectedTechId) ||
      PRODUCT_PHOTO_TECHNIQUES[0],
    [selectedTechId]
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setUploadedPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const productPromptEn = useMemo(() => {
    return `${selectedTechnique.name} commercial photography for "${deliverable}" (${productCategory}): ${productName}. Visual details to preserve: ${visualFeatures}. Setting/Backdrop: ${backdrop}. Lighting: ${lighting}. Composition: ${composition}. Advertising aesthetic: ${adStyle}. ${selectedTechnique.promptEn}. ${
      preserveLogo
        ? 'STRICT PRODUCT CONSISTENCY: preserve exact original silhouette, proportions, authentic textures, true colors and original label/logo without inventing extra features or fake certifications.'
        : ''
    }`;
  }, [
    selectedTechnique,
    deliverable,
    productCategory,
    productName,
    visualFeatures,
    backdrop,
    lighting,
    composition,
    adStyle,
    preserveLogo,
  ]);

  const productPromptEs = useMemo(() => {
    return `Fotografía comercial tipo ${selectedTechnique.name} (${deliverable}) para ${productCategory}: ${productName}. Rasgos a conservar: ${visualFeatures}. Fondo/Escenario: ${backdrop}. Iluminación: ${lighting}. Composición: ${composition}. Estética: ${adStyle}. ${selectedTechnique.promptEs}. ${
      preserveLogo
        ? 'CONSERVAR SIEMPRE la forma, proporciones, materiales, colores reales y logotipo del producto original sin inventar características inexistentes.'
        : ''
    }`;
  }, [
    selectedTechnique,
    deliverable,
    productCategory,
    productName,
    visualFeatures,
    backdrop,
    lighting,
    composition,
    adStyle,
    preserveLogo,
  ]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header + Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code font-bold uppercase tracking-wider text-[#326BFF] dark:text-[#F8C300]">
              <span>MÓDULO 11 · PRODUCT & COMMERCE LAB</span>
              <span aria-hidden="true">·</span>
              <span>EMPRENDEDORES, ARTESANÍAS Y COMERCIO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display-sans text-[#101014] dark:text-[#F4F2ED] text-balance">
              De objeto cotidiano a catálogo comercial y campaña publicitaria
            </h2>
            <p className="text-sm text-[#4A4A55] dark:text-[#B4B2AC] leading-relaxed">
              Pensado para pequeños negocios, juguetería, cerámica, moda y productos hechos a mano. Convierte una foto cotidiana en Packshot de tienda, escena Lifestyle, Flat Lay o campaña para redes sin deformar el producto ni alterar el logotipo original.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
              <ShieldAlert className="w-4 h-4" />
              <span>REGLA DE FIDELIDAD COMERCIAL</span>
            </div>
            <ul className="text-xs text-[#4A4A55] dark:text-[#B4B2AC] space-y-1 list-disc pl-4">
              {PRODUCT_PRESERVATION_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {[
            { img: STUDIO_MEDIA_ASSETS.productCommerceStudio, label: 'Packshot Artesanal' },
            { img: STUDIO_MEDIA_ASSETS.productSplash, label: 'Hero Splash 1/4000s' },
            { img: STUDIO_MEDIA_ASSETS.productLuxury, label: 'Bodegón Mineral' },
            { img: STUDIO_MEDIA_ASSETS.productFloating, label: 'Gravedad Cero' },
          ].map((ex) => (
            <div
              key={ex.label}
              className="rounded-xl overflow-hidden border border-[#DEDAD0] dark:border-[#26262E] bg-[#101014] flex flex-col justify-between"
            >
              <ResilientImage
                src={ex.img}
                alt={`Ejemplo comercial de producto: ${ex.label}`}
                aspectRatio="3:2"
                containerClassName="w-full"
              />
              <div className="px-3 py-1.5 text-[11px] font-mono-code text-[#F4F2ED] border-t border-white/10">
                {ex.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Commercial Photography Techniques */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
          10 Técnicas de Fotografía Comercial (clic para seleccionar)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PRODUCT_PHOTO_TECHNIQUES.map((tech) => {
            const active = tech.id === selectedTechId;
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => setSelectedTechId(tech.id)}
                className={`p-3.5 rounded-xl border text-left transition-colors space-y-1 ${
                  active
                    ? 'bg-[#F8C300] text-[#101014] border-[#F8C300]'
                    : 'bg-white dark:bg-[#16161C] text-[#101014] dark:text-[#F4F2ED] border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF]'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 shrink-0" />
                  <span>{tech.name}</span>
                </div>
                <p
                  className={`text-[11px] leading-snug ${
                    active ? 'text-[#101014]/85' : 'text-[#4A4A55] dark:text-[#B4B2AC]'
                  }`}
                >
                  {tech.application}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Prompt Builder + Upload Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DEDAD0] dark:border-[#26262E] pb-3">
            <div>
              <span className="text-[11px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300] block">
                RETO 03 · DE OBJETO COTIDIANO A PRODUCTO COMERCIAL
              </span>
              <h3 className="text-lg font-bold font-display-sans text-[#101014] dark:text-[#F4F2ED]">
                Product Prompt Builder
              </h3>
            </div>
            <label className="px-3 py-2 text-xs font-bold bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] hover:border-[#326BFF] rounded-lg cursor-pointer inline-flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploadedPreview ? 'Cambiar foto' : 'Subir foto del objeto'}</span>
              <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
            </label>
          </div>

          {uploadedPreview && (
            <div className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] flex items-center gap-4">
              <img
                src={uploadedPreview}
                alt="Producto cargado como referencia original"
                className="w-24 h-24 object-cover rounded-lg border border-[#D4D0C5] dark:border-[#2C2C36]"
              />
              <div className="text-xs space-y-1">
                <div className="font-bold text-[#101014] dark:text-[#F4F2ED]">
                  Referencia cargada en sesión local
                </div>
                <p className="text-[11px] text-[#4A4A55] dark:text-[#B4B2AC]">
                  Adjunta esta misma imagen junto al prompt generado en Gemini, FLUX Kontext o ChatGPT para mantener forma y logotipo exactos.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono-code font-bold block">1. Categoría de producto (14)</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono-code font-bold block">2. Salida comercial requerida</label>
              <select
                value={deliverable}
                onChange={(e) => setDeliverable(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              >
                <option value="Fotografía de catálogo / tienda virtual">Fotografía de catálogo / tienda virtual</option>
                <option value="Fondo limpio de estudio">Fondo limpio de estudio</option>
                <option value="Escenario lifestyle en uso">Escenario lifestyle en uso</option>
                <option value="Imagen publicitaria Hero de campaña">Imagen publicitaria Hero de campaña</option>
                <option value="Detalle macro de materiales">Detalle macro de materiales</option>
                <option value="Imagen vertical 4:5 para redes sociales">Imagen para redes sociales (4:5)</option>
                <option value="Mockup de empaque y unboxing">Mockup de empaque y unboxing</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-mono-code font-bold block">3. Producto / objeto</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-mono-code font-bold block">4. Rasgos visuales a conservar (forma, color, textura, logo)</label>
            <textarea
              rows={2}
              value={visualFeatures}
              onChange={(e) => setVisualFeatures(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono-code font-bold block">5. Fondo / superficie</label>
              <input
                type="text"
                value={backdrop}
                onChange={(e) => setBackdrop(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono-code font-bold block">6. Iluminación</label>
              <input
                type="text"
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-mono-code font-bold block">7. Composición</label>
              <input
                type="text"
                value={composition}
                onChange={(e) => setComposition(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono-code font-bold block">8. Estilo publicitario</label>
              <input
                type="text"
                value={adStyle}
                onChange={(e) => setAdStyle(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={preserveLogo}
              onChange={(e) => setPreserveLogo(e.target.checked)}
              className="accent-[#326BFF]"
            />
            <span>Añadir candado estricto: no deformar logo ni inventar funciones comerciales</span>
          </label>
        </div>

        {/* Output Prompt + Cross-Module Actions */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#16161C] border border-[#DEDAD0] dark:border-[#26262E] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code font-bold uppercase text-[#101014] dark:text-[#F4F2ED] inline-flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#7545D6] dark:text-[#F8C300]" />
                <span>Prompt Comercial Generado (EN / ES)</span>
              </span>
              <button
                type="button"
                onClick={() => handleCopy(productPromptEn, 'prod-en')}
                className="px-3 py-1.5 text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center gap-1.5"
              >
                {copiedId === 'prod-en' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'prod-en' ? 'Copiado (EN)' : 'Copiar EN'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-mono-code font-bold text-[#326BFF] dark:text-[#F8C300]">
                ENGLISH (Recomendado para FLUX / Midjourney / Runway)
              </div>
              <p className="p-3 rounded-xl bg-[#101014] text-[#F4F2ED] text-xs font-mono-code leading-relaxed">
                {productPromptEn}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-code font-bold text-[#7545D6] dark:text-[#F8C300]">
                  ESPAÑOL
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(productPromptEs, 'prod-es')}
                  className="text-xs font-mono-code text-[#326BFF] dark:text-[#F8C300] hover:underline"
                >
                  {copiedId === 'prod-es' ? 'Copiado ✓' : 'Copiar ES'}
                </button>
              </div>
              <p className="p-3 rounded-xl bg-[#F4F2ED] dark:bg-[#101014] border border-[#DEDAD0] dark:border-[#26262E] text-xs leading-relaxed">
                {productPromptEs}
              </p>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  onApplyToBuilder({
                    mode: 'photo',
                    subject: productPromptEn,
                    lighting,
                    setting: backdrop,
                    composition,
                    visualStyle: adStyle,
                    aspectRatio: deliverable.includes('4:5') ? '4:5' : '3:2',
                  })
                }
                className="py-2.5 px-4 min-h-[44px] text-xs font-bold bg-[#F8C300] hover:bg-[#e5b400] text-[#101014] rounded-lg inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Abrir en Constructor (Foto)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onApplyToBuilder({
                    mode: 'video',
                    subject: `${productPromptEn} — Smooth 180-degree turntable studio reveal with subtle rim highlight sweep at 24fps`,
                    lighting,
                    setting: backdrop,
                    motion: 'Continuous smooth 360-degree orbit shot',
                    fps: '24 fps',
                    duration: '6 segundos',
                    aspectRatio: '9:16',
                  })
                }
                className="py-2.5 px-4 min-h-[44px] text-xs font-bold bg-[#326BFF] hover:bg-[#2555d6] text-white rounded-lg inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Film className="w-3.5 h-3.5 shrink-0" />
                <span>Convertir a Video Comercial</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
