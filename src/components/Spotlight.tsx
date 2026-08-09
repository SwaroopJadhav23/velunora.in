import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { API_BASE_URL, WHATSAPP_NUMBER } from '../config/api';

interface Slide {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  desc: string;
  src: string;
  price: string;
  bg: string;
  glow: string;
  textColor: string;
  emojis: string[];
}

const spotlightSlides: Slide[] = [
  {
    id: 1,
    slug: 'pink-bloom',
    name: 'Pink Bloom Bouquet',
    tagline: 'A bloom that never wilts 🌸',
    desc: 'Handcrafted hot-pink pipe cleaner flower, wrapped in blush paper with gold trim and a satin ribbon. Soft, lasting, and gift-ready.',
    src: '/images/bouquet-pink.jpeg',
    price: 'DM for price',
    bg: 'from-[#FBF4F1] via-[#F5E6E0] to-[#EFD8D0]',
    glow: 'rgba(201, 160, 160, 0.3)',
    textColor: 'text-rose',
    emojis: ['🌸', '🩷', '✨'],
  },
  {
    id: 2,
    slug: 'heart-arrangement',
    name: 'Heart Arrangement',
    tagline: 'Love, shaped by hand 💗',
    desc: 'A hollow heart of tiny pink fuzzy blooms — wrapped with gold-edged paper and a pearl-kissed bow. Made for the ones who mean the most.',
    src: '/images/bouquet-heart.jpeg',
    price: 'DM for price',
    bg: 'from-[#FAF6EF] via-[#F5EDE3] to-[#EFE4D4]',
    glow: 'rgba(196, 163, 90, 0.28)',
    textColor: 'text-gold',
    emojis: ['💗', '✨', '🎁'],
  },
  {
    id: 3,
    slug: 'sunshine-lily',
    name: 'Sunshine Lily Bouquet',
    tagline: 'Sunshine you can hold 🌼',
    desc: 'Yellow and white fuzzy blooms with newspaper-style wrapping and a cream ribbon. Cheerful, handmade, and forever fresh.',
    src: '/images/bouquet-yellow.jpeg',
    price: 'DM for price',
    bg: 'from-[#FBF6EC] via-[#F3E8D0] to-[#EADFC4]',
    glow: 'rgba(196, 163, 90, 0.3)',
    textColor: 'text-gold',
    emojis: ['🌼', '💛', '✨'],
  },
];

export default function Spotlight() {
  const [slides, setSlides] = useState<Slide[]>(spotlightSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then((data: any[]) => {
        if (data && data.length > 0) {
          const offers = data.filter(p => p.isSpecialOffer);
          const displayData = offers.length > 0 ? offers : data;

          const formatted = displayData.map((p, index) => {
            const colors = [
              { bg: 'from-[#FBF4F1] via-[#F5E6E0] to-[#EFD8D0]', glow: 'rgba(201, 160, 160, 0.3)', textColor: 'text-rose' },
              { bg: 'from-[#FAF6EF] via-[#F5EDE3] to-[#EFE4D4]', glow: 'rgba(196, 163, 90, 0.28)', textColor: 'text-gold' },
              { bg: 'from-[#FBF6EC] via-[#F3E8D0] to-[#EADFC4]', glow: 'rgba(196, 163, 90, 0.3)', textColor: 'text-gold' },
            ];
            const colorScheme = colors[index % colors.length];
            return {
              id: p.id,
              slug: p.slug,
              name: p.name,
              tagline: p.badge ? `${p.badge} ✨` : 'Featured Bouquet 🌸',
              desc: p.description,
              src: p.src.startsWith('/') ? `${API_BASE_URL}${p.src}` : p.src,
              price: typeof p.price === 'number' ? `₹${p.price}` : p.price,
              bg: colorScheme.bg,
              glow: colorScheme.glow,
              textColor: colorScheme.textColor,
              emojis: p.floatingDecos || ['✨', '🌸'],
            };
          });
          setSlides(formatted);
        }
      })
      .catch(err => console.warn('Failed to load spotlight slides from API:', err));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => handleNext(), 6000);
    return () => clearInterval(timer);
  }, [activeIndex, slides.length]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[activeIndex] || spotlightSlides[0];

  const handleOrder = () => {
    const fullImageUrl = current.src.startsWith('http')
      ? current.src
      : `${window.location.origin}${current.src.startsWith('/') ? '' : '/'}${current.src}`;

    const lines = [
      'Hello Velunora!',
      '',
      'I want to order this bouquet:',
      '',
      `Product: *${current.name}*`,
      `Price: *${current.price}*`,
      `Image: ${fullImageUrl}`,
      '',
      'Please confirm availability. (Prepaid orders only)',
      '',
      'Thank you! 🌸',
    ];
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  };

  const handleMeet = () => {
    window.location.hash = `#/products/${current.slug}`;
  };

  const slideVariants: any = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } }),
  };

  return (
    <section id="spotlight" className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 lg:pb-28 px-4 sm:px-8 md:px-12 lg:px-20 bg-[#FAF6EF] overflow-hidden scroll-mt-28">
      <div className="max-w-[1500px] mx-auto relative z-20">
        <div className="text-center mb-10 sm:mb-16">
          <p className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-3">
            Featured Spotlight
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-darkText font-semibold mb-4 leading-tight">
            Bouquet Of The Moment
          </h2>
          <p className="font-body text-sm sm:text-base text-darkText/65 max-w-xl mx-auto">
            Sit back as our handcrafted favourites rotate — or swipe to explore.
          </p>
        </div>

        <div className={`relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-tr ${current.bg} border border-gold/20 p-5 sm:p-8 md:p-12 lg:p-16 shadow-xl transition-colors duration-700 min-h-0 flex items-center`}>
          <div
            className="absolute inset-0 rounded-[32px] sm:rounded-[40px] blur-3xl opacity-20 transition-all duration-700"
            style={{ backgroundColor: current.glow }}
          />

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center relative z-10"
            >
              <div className="lg:col-span-6 flex justify-center relative">
                {!shouldReduceMotion && (
                  <div className="absolute inset-0 pointer-events-none select-none">
                    <Sparkles className="absolute text-gold w-5 h-5 top-4 left-6 animate-twinkle" />
                    <Sparkles className="absolute text-rose w-5 h-5 top-10 right-10 animate-pulse" />
                    <span className="absolute text-xl top-1/2 left-2 animate-bounce-soft">{current.emojis[0]}</span>
                    <span className="absolute text-xl bottom-1/2 right-2 animate-float-slow">{current.emojis[1]}</span>
                  </div>
                )}

                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  className="w-full max-w-[380px] aspect-[3/4] flex items-center justify-center relative"
                >
                  <div className="arch-frame w-[85%] h-[90%] bg-cream">
                    <img
                      src={current.src}
                      alt={current.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-center">
                <span className={`text-xs font-semibold uppercase tracking-[0.15em] mb-3 inline-block ${current.textColor}`}>
                  {current.tagline}
                </span>

                <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl text-darkText font-semibold mb-5 tracking-tight leading-tight">
                  {current.name}
                </h3>

                <p className="font-body text-sm sm:text-base text-darkText/70 leading-relaxed mb-8">
                  {current.desc}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <motion.button
                    onClick={handleOrder}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gradient-to-r from-rose to-gold text-white font-heading font-semibold px-8 py-4 rounded-full flex items-center justify-center gap-2.5 shadow-[0_6px_25px_rgba(196,163,90,0.3)] transition-all text-sm sm:text-base cursor-pointer"
                  >
                    <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain shrink-0" />
                    <span>DM to Order — {current.price}</span>
                  </motion.button>

                  <motion.button
                    onClick={handleMeet}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="border border-gold/30 text-darkText/80 hover:bg-white hover:border-gold/50 py-3.5 px-6 rounded-full font-heading font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Details</span>
                    <span>→</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute left-4 lg:left-6 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-gold/20 items-center justify-center text-darkText/60 hover:text-gold transition-all hover:scale-105 active:scale-95 shadow-sm z-30 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="hidden sm:flex absolute right-4 lg:right-6 w-11 h-11 rounded-full bg-white/80 backdrop-blur-md border border-gold/20 items-center justify-center text-darkText/60 hover:text-gold transition-all hover:scale-105 active:scale-95 shadow-sm z-30 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            className="sm:hidden w-9 h-9 rounded-full bg-white border border-gold/20 flex items-center justify-center text-darkText/70 active:scale-95 shadow-sm cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx ? 'w-8 bg-gold' : 'w-2.5 bg-darkText/15 hover:bg-darkText/35'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="sm:hidden w-9 h-9 rounded-full bg-white border border-gold/20 flex items-center justify-center text-darkText/70 active:scale-95 shadow-sm cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
