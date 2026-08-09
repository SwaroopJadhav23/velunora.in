import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export type Universe = 'Singles' | 'Hearts' | 'Custom' | 'Bestsellers' | 'New' | 'Gifting';

export interface Product {
  id: number;
  slug: string;
  name: string;
  universe: Universe;
  src: string;
  price: string;
  originalPrice?: number | null;
  isSpecialOffer?: boolean;
  discountPercentage?: number | null;
  description: string;
  badge?: string;
  floatingDecos: string[];
}

export const universesList: { name: Universe; bg: string; text: string; plush: string; decos: string[]; tag: string }[] = [
  { name: 'Singles', bg: 'bg-gradient-soft-pink border-rose/20', text: 'text-rose', plush: '/images/bouquet-pink.jpeg', decos: ['🌸', '🩷', '✨'], tag: 'Single Stems' },
  { name: 'Hearts', bg: 'bg-gradient-soft-purple border-gold/20', text: 'text-gold', plush: '/images/bouquet-heart.jpeg', decos: ['💗', '💖', '✨'], tag: 'Heart Arrangements' },
  { name: 'Custom', bg: 'bg-gradient-soft-mint border-sage/20', text: 'text-sage', plush: '/images/bouquet-yellow.jpeg', decos: ['🎨', '🌸', '✨'], tag: 'Made For You' },
  { name: 'Bestsellers', bg: 'bg-gradient-soft-yellow border-gold/20', text: 'text-gold', plush: '/images/bouquet-pink.jpeg', decos: ['⭐', '🌸', '💛'], tag: 'Most Loved' },
  { name: 'New', bg: 'bg-gradient-soft-blue border-gold/15', text: 'text-gold', plush: '/images/bouquet-yellow.jpeg', decos: ['🆕', '✨', '🌼'], tag: 'Just Crafted' },
  { name: 'Gifting', bg: 'bg-gradient-soft-pink border-rose/20', text: 'text-rose', plush: '/images/bouquet-heart.jpeg', decos: ['🎁', '🩷', '🎀'], tag: 'Ready To Gift' },
];

export const products: Product[] = [
  {
    id: 1,
    slug: 'pink-bloom',
    name: 'Pink Bloom Bouquet',
    universe: 'Singles',
    src: '/images/bouquet-pink.jpeg',
    price: 'DM for price',
    description: 'A vibrant hot-pink pipe cleaner bloom wrapped in soft blush paper with gold trim and a satin ribbon. Handmade to last forever.',
    badge: 'Bestseller',
    floatingDecos: ['🌸', '🩷'],
  },
  {
    id: 2,
    slug: 'heart-arrangement',
    name: 'Heart Arrangement',
    universe: 'Hearts',
    src: '/images/bouquet-heart.jpeg',
    price: 'DM for price',
    description: 'Dozens of tiny pink fuzzy blooms shaped into a hollow heart — wrapped in blush paper with gold trim. Perfect for someone special.',
    badge: 'Romantic',
    floatingDecos: ['💗', '✨'],
  },
  {
    id: 3,
    slug: 'sunshine-lily',
    name: 'Sunshine Lily Bouquet',
    universe: 'New',
    src: '/images/bouquet-yellow.jpeg',
    price: 'DM for price',
    description: 'Sunny yellow and white fuzzy blooms with newspaper-style wrapping and a cream ribbon. Bright, lasting, and gift-ready.',
    badge: 'New',
    floatingDecos: ['🌼', '💛'],
  },
  {
    id: 4,
    slug: 'custom-bouquet',
    name: 'Custom Colour Bouquet',
    universe: 'Custom',
    src: '/images/bouquet-pink.jpeg',
    price: 'DM for price',
    description: 'Tell us your colours, occasion, and vibe — we handcraft a one-of-a-kind pipe cleaner bouquet just for you.',
    badge: 'Custom',
    floatingDecos: ['🎨', '🌸'],
  },
];

const getPortalParticles = (universe: string) => {
  if (universe === 'Hearts') return ['💗', '💖', '✨', '🩷', '💗'];
  if (universe === 'Custom') return ['🎨', '🌸', '✨', '🌼', '🎨'];
  if (universe === 'Bestsellers') return ['⭐', '🌸', '💛', '✨', '⭐'];
  if (universe === 'Gifting') return ['🎁', '🩷', '🎀', '✨', '🎁'];
  if (universe === 'New') return ['🆕', '🌼', '✨', '🌸', '🆕'];
  return ['🌸', '🩷', '✨', '💗', '🌸'];
};

interface UniversePortalsProps {
  selectedUniverse: Universe | 'All';
  onSelectUniverse: (u: Universe | 'All') => void;
}

export function UniversePortals({ selectedUniverse, onSelectUniverse }: UniversePortalsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="universe" className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 bg-[#FAF6EF] px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden scroll-mt-28">
      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="text-center mb-16 relative">
          <p className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-3">
            Collections
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-darkText font-semibold mb-4 leading-tight">
            Find Your Bouquet
          </h2>
          <p className="font-body text-base text-darkText/65 max-w-xl mx-auto">
            Singles, hearts, customs & more — tap a collection to explore.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {universesList.map((u) => {
            const isSelected = selectedUniverse === u.name;
            const isHovered = hoveredCard === u.name;
            return (
              <motion.div
                key={u.name}
                onClick={() => onSelectUniverse(isSelected ? 'All' : u.name)}
                onMouseEnter={() => setHoveredCard(u.name)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className={`cursor-pointer rounded-[28px] p-4 sm:p-5 border text-center relative overflow-hidden transition-all duration-300 group ${
                  isSelected
                    ? 'bg-white shadow-[0_15px_35px_rgba(196,163,90,0.18)] border-gold ring-1 ring-gold/20'
                    : 'bg-white/70 backdrop-blur-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] border-gold/15'
                }`}
              >
                <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300 ${u.bg}`} />

                {isHovered && !shouldReduceMotion && (
                  <>
                    {getPortalParticles(u.name).map((symbol, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.5, y: 15 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                          scale: [0.7, 1.2, 0.8],
                          y: [-25 - Math.random() * 35],
                        }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: idx * 0.15 }}
                        className="absolute text-[12px] pointer-events-none select-none z-30"
                        style={{ left: `${15 + idx * 16}%`, top: '12%' }}
                      >
                        {symbol}
                      </motion.span>
                    ))}
                  </>
                )}

                <div className="relative w-16 h-20 mx-auto mb-3">
                  <div className="arch-frame w-full h-full">
                    <motion.img
                      src={u.plush}
                      alt={u.name}
                      animate={isSelected || isHovered ? { y: [0, -6, 0] } : {}}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </div>

                <div className="relative z-10 mt-1">
                  <h3 className="font-heading font-semibold text-darkText text-sm group-hover:text-gold transition-colors leading-tight">
                    {u.name}
                  </h3>
                  <span className="text-[9px] text-darkText/45 font-medium block truncate mt-1.5 uppercase tracking-wider">
                    {u.tag}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface TrendingCollectionProps {
  selectedUniverse: Universe | 'All';
  onSelectUniverse: (u: Universe | 'All') => void;
}

export function TrendingCollection({ selectedUniverse, onSelectUniverse }: TrendingCollectionProps) {
  const [productList, setProductList] = useState<Product[]>(products);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (data && data.length > 0) {
          const formatted = data.map(p => ({
            ...p,
            price: typeof p.price === 'number' ? `₹${p.price.toLocaleString('en-IN')}` : p.price,
            src: p.src.startsWith('/') ? `${API_BASE_URL}${p.src}` : p.src,
          }));
          setProductList(formatted);
        }
      })
      .catch(err => console.warn('Failed to load products from API:', err));
  }, []);

  const filteredProducts = selectedUniverse === 'All'
    ? productList
    : productList.filter(p => p.universe === selectedUniverse);

  return (
    <section id="trending" className="relative w-full py-12 md:py-20 lg:py-24 bg-satin px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-3">
            Our Bouquets
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-darkText font-semibold mb-4 leading-tight">
            Flowers That Never Fade
          </h2>
          <p className="font-body text-base text-darkText/65 max-w-lg mx-auto">
            Handcrafted pipe cleaner bouquets — ready to gift, made to last.
          </p>
        </div>

        {selectedUniverse !== 'All' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center -mt-8 mb-12"
          >
            <button
              onClick={() => onSelectUniverse('All')}
              className="text-xs font-semibold text-gold bg-gold/5 hover:bg-gold hover:text-white border border-gold/25 px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5"
            >
              <span>Show all bouquets</span>
              <span>✕</span>
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => {
                  window.location.hash = `#/products/${p.slug}`;
                }}
                className="relative group rounded-[28px] bg-white/80 border border-gold/15 shadow-[0_4px_22px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(196,163,90,0.12)] hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="w-full aspect-[3/4] bg-cream overflow-hidden flex items-center justify-center p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose/5 to-gold/5 opacity-50 group-hover:opacity-85 transition-opacity" />

                  <img
                    src={p.src}
                    alt={p.name}
                    loading="lazy"
                    className="w-[88%] h-[88%] object-cover rounded-[20px] transition-transform duration-500 ease-out group-hover:scale-105 relative z-10 shadow-md"
                  />

                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15">
                    <Sparkles className="absolute text-gold w-4 h-4 top-4 left-4 animate-twinkle" />
                    <Sparkles className="absolute text-rose w-4 h-4 top-6 right-8 animate-pulse" />
                  </div>

                  <span className="absolute bottom-4 left-4 text-[9px] font-semibold uppercase tracking-wider bg-white/95 backdrop-blur-sm border border-gold/15 text-darkText px-3 py-1.5 rounded-full shadow-sm z-20">
                    {p.universe}
                  </span>

                  {p.badge && (
                    <span className="absolute top-4 left-4 text-[9px] font-semibold uppercase tracking-wider bg-gold text-white px-3 py-1.5 rounded-full shadow-sm z-20">
                      {p.badge}
                    </span>
                  )}

                  <div className="absolute top-4 right-4 z-25 order-pill text-white pointer-events-none select-none">
                    <MessageCircle size={15} className="text-white fill-white" />
                    <div className="order-pill-text text-[9px] font-heading font-semibold uppercase tracking-wider leading-none">
                      <span>Order</span>
                      <span className="order-pill-extra">via DM</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between border-t border-gold/10">
                  <div>
                    <h4 className="font-heading font-semibold text-darkText text-lg mb-1.5 truncate group-hover:text-gold transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-xs text-darkText/55 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-5">
                    <span className="font-heading font-semibold text-gold text-lg leading-tight">
                      {p.price}
                    </span>
                    <span className="text-[10px] font-semibold text-rose flex items-center gap-1 group-hover:underline">
                      <span>View Bouquet</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
