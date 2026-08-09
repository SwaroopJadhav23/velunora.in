import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface BrandIntroProps {
  onComplete: () => void;
}

const BRAND = 'VELUNORA';
const letters = BRAND.split('');

export default function BrandIntro({ onComplete }: BrandIntroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    // Hold the finished composition, then fade out
    const exitTimer = setTimeout(() => setVisible(false), 3000);
    const doneTimer = setTimeout(() => onComplete(), 3750);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return null;
  }

  const sparkles = [
    { top: '18%', left: '12%', size: 10, delay: 0.15 },
    { top: '22%', left: '82%', size: 14, delay: 0.35 },
    { top: '72%', left: '18%', size: 12, delay: 0.25 },
    { top: '68%', left: '78%', size: 11, delay: 0.45 },
    { top: '42%', left: '8%', size: 8, delay: 0.55 },
    { top: '48%', left: '90%', size: 9, delay: 0.4 },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="velunora-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, #FFF9F2 0%, #F7F0E6 45%, #EFE4D4 100%)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage: `
                radial-gradient(ellipse at 20% 25%, rgba(255,255,255,0.7) 0%, transparent 45%),
                radial-gradient(ellipse at 80% 75%, rgba(196,163,90,0.14) 0%, transparent 42%),
                radial-gradient(ellipse at 50% 100%, rgba(201,160,160,0.12) 0%, transparent 50%)
              `,
            }}
          />

          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(180,150,100,0.12)]" />

          {sparkles.map((s, i) => (
            <motion.svg
              key={i}
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{
                opacity: [0, 0.9, 0.45, 0.9],
                scale: [0, 1, 0.85, 1],
                rotate: 0,
              }}
              transition={{
                duration: 2.4,
                delay: s.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute text-gold fill-current pointer-events-none"
              style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
            </motion.svg>
          ))}

          <div className="relative z-10 flex flex-col items-center px-6 text-center select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 sm:mb-10"
            >
              <div className="relative">
                <motion.div
                  animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-[-18%] rounded-full bg-gradient-to-tr from-gold/30 via-rose/20 to-sage/20 blur-2xl"
                />
                <div className="relative w-[96px] h-[96px] sm:w-[112px] sm:h-[112px] rounded-full p-[2px] bg-gradient-to-tr from-gold via-rose/80 to-sage shadow-[0_12px_40px_rgba(196,163,90,0.28)]">
                  <img
                    src="/logo.jpeg"
                    alt="Velunora"
                    className="w-full h-full rounded-full object-cover bg-cream"
                  />
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.38em' }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="font-heading text-[10px] sm:text-xs uppercase text-gold/90 mb-4 sm:mb-5"
            >
              Fuzzy Wire Crafts
            </motion.p>

            <h1
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-darkText tracking-[0.18em] sm:tracking-[0.22em] uppercase flex justify-center"
              aria-label="Velunora"
            >
              {letters.map((letter, i) => (
                <motion.span
                  key={`${letter}-${i}`}
                  initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.55,
                    delay: 0.45 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 sm:mt-6 h-px w-40 sm:w-52 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.35 }}
              className="-mt-[5px] text-gold"
              aria-hidden
            >
              <svg width="10" height="10" viewBox="0 0 24 24" className="fill-current">
                <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 1.45, ease: [0.22, 1, 0.36, 1] }}
              className="font-script text-2xl sm:text-3xl md:text-4xl text-rose mt-4 sm:mt-5"
            >
              Where Flowers Never Fade
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-10 sm:mt-12 flex items-center gap-2"
              aria-hidden
            >
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.1, 0.85] }}
                  transition={{
                    duration: 1.1,
                    delay: d * 0.18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-gold"
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
