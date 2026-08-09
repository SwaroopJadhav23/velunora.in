import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config/api';

const floatingBouquets = [
  {
    name: 'Pink Bloom',
    src: '/images/bouquet-pink.jpeg',
    position: 'top-[14%] left-[3%] md:top-[16%] md:left-[5%]',
    size: 'w-20 h-28 sm:w-28 sm:h-36 md:w-36 md:h-48 lg:w-44 lg:h-60',
    floatDuration: 5.5,
    glowColor: 'rgba(201, 160, 160, 0.35)',
    tag: '🌸 Pink Bloom',
  },
  {
    name: 'Heart Bouquet',
    src: '/images/bouquet-heart.jpeg',
    position: 'bottom-[10%] left-[2%] md:bottom-[12%] md:left-[7%]',
    size: 'w-20 h-28 sm:w-28 sm:h-36 md:w-36 md:h-48 lg:w-44 lg:h-60',
    floatDuration: 6.5,
    glowColor: 'rgba(196, 163, 90, 0.3)',
    tag: '💗 Heart Arrangement',
  },
  {
    name: 'Yellow Lily',
    src: '/images/bouquet-yellow.jpeg',
    position: 'top-[12%] right-[3%] md:top-[14%] md:right-[5%]',
    size: 'w-20 h-28 sm:w-28 sm:h-36 md:w-40 md:h-52 lg:w-48 lg:h-64',
    floatDuration: 6,
    glowColor: 'rgba(196, 163, 90, 0.35)',
    tag: '🌼 Sunshine Lily',
  },
];

interface HeroProps {
  introStage?: 'playing' | 'revealing' | 'complete';
}

export default function Hero({ introStage = 'complete' }: HeroProps) {
  const isPlaying = introStage === 'playing';
  const orderHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Velunora! I would like to order a bouquet 🌸')}`;

  return (
    <section
      id="hero"
      className="relative min-h-[70vh] lg:min-h-[95vh] flex items-center justify-center pt-28 pb-16 lg:pt-32 lg:pb-24 px-6 overflow-hidden bg-satin"
    >
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4A35A' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[40vh] bg-gradient-to-r from-rose/20 via-gold/10 to-sage/15 rounded-full blur-[110px] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none z-10 select-none">
        <Sparkles className="absolute text-gold w-4 h-4 top-[18%] left-[22%] animate-twinkle" />
        <Sparkles className="absolute text-rose w-3 h-3 bottom-[28%] left-[30%] animate-twinkle delay-100" />
        <Sparkles className="absolute text-gold w-5 h-5 top-[28%] right-[30%] animate-pulse" />
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20 hidden md:block">
          {floatingBouquets.map((bouquet, index) => (
            <motion.div
              key={bouquet.name}
              className={`absolute ${bouquet.position} ${bouquet.size} pointer-events-auto`}
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.25 + index * 0.15,
                type: 'spring',
                stiffness: 90,
                damping: 18,
              }}
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: bouquet.floatDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.04 }}
                className="relative group cursor-pointer w-full h-full"
              >
                <div
                  className="absolute inset-0 rounded-[40%] blur-3xl transition-all duration-500 opacity-50 group-hover:opacity-80"
                  style={{ backgroundColor: bouquet.glowColor }}
                />
                <div className="arch-frame relative z-10 w-full h-full">
                  <img
                    src={bouquet.src}
                    alt={bouquet.name}
                  />
                </div>
                <div className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold/20 text-[10px] font-semibold text-darkText shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-25">
                  {bouquet.tag}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-30 max-w-[1500px] mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-6"
        >
          <img
            src="/logo.jpeg"
            alt="Velunora"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mx-auto shadow-[0_10px_40px_rgba(196,163,90,0.25)] ring-2 ring-gold/30"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="font-heading text-xs sm:text-sm tracking-[0.35em] uppercase text-gold mb-4"
        >
          Fuzzy Wire Crafts
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 80 }}
          className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-darkText font-semibold tracking-[0.04em] leading-[1.05] mb-4 max-w-5xl select-none"
        >
          Velunora
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-script text-3xl sm:text-4xl md:text-5xl text-rose mb-6"
        >
          Where Flowers Never Fade
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48 }}
          className="font-body text-sm md:text-lg text-darkText/70 max-w-xl mx-auto mb-8 leading-relaxed tracking-wide"
        >
          PIPE CLEANER BOUQUET • CUSTOM BOUQUETS
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/80 border border-gold/20 px-4 py-2 rounded-full text-darkText/80 shadow-sm">
            <MapPin size={13} className="text-gold" />
            Pune
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/80 border border-gold/20 px-4 py-2 rounded-full text-darkText/80 shadow-sm">
            Prepaid orders only
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
        >
          <motion.a
            href="#trending"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2.5 bg-gradient-to-r from-rose to-gold text-white font-heading font-semibold tracking-wide px-10 py-4 rounded-full shadow-[0_6px_25px_rgba(196,163,90,0.35)] hover:shadow-[0_10px_35px_rgba(196,163,90,0.45)] transition-all duration-300 w-full sm:w-auto justify-center text-base"
          >
            <span>Browse Bouquets</span>
            <ArrowRight size={18} />
          </motion.a>

          <motion.a
            href={orderHref}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2.5 bg-white text-darkText font-heading font-semibold tracking-wide px-10 py-4 rounded-full border border-gold/30 shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:bg-cream transition-all duration-300 w-full sm:w-auto justify-center text-base"
          >
            <span>DM to Order</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
