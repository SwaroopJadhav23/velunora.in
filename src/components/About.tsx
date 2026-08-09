import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const gallery = [
  { src: '/images/bouquet-pink.jpeg', alt: 'Pink pipe cleaner bouquet', label: 'Pink Bloom' },
  { src: '/images/bouquet-yellow.jpeg', alt: 'Yellow pipe cleaner bouquet', label: 'Sunshine Lily' },
  { src: '/images/bouquet-heart.jpeg', alt: 'Heart pipe cleaner bouquet', label: 'Heart Arrangement' },
];

export default function About() {
  return (
    <section id="about" className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 lg:pb-28 bg-satin px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden scroll-mt-28">
      <div className="absolute inset-0 pointer-events-none select-none opacity-40">
        <Sparkles className="absolute text-gold w-4 h-4 top-[15%] left-[10%] animate-twinkle" />
        <Sparkles className="absolute text-rose w-5 h-5 bottom-[20%] right-[15%] animate-twinkle delay-300" />
      </div>

      <div className="max-w-[1200px] mx-auto text-center mb-16 md:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-4"
        >
          Who We Are
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-5xl md:text-6xl text-darkText font-semibold mb-6 tracking-wide"
        >
          Velunora
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-body text-base md:text-lg text-darkText/70 leading-relaxed max-w-2xl mx-auto"
        >
          We create thoughtfully arranged pipe cleaner bouquets. Each bouquet is made with love,
          bringing joy, warmth and beauty to every moment.
        </motion.p>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-10">
          <p className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-3">
            What We Sell
          </p>
          <h3 className="font-script text-4xl md:text-5xl text-darkText">
            Pipe Cleaner Bouquet
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 max-w-4xl mx-auto">
          {gallery.map((item, idx) => (
            <motion.div
              key={item.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="arch-frame w-full max-w-[260px] aspect-[3/4] bg-cream mx-auto">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="mt-4 font-heading text-lg text-darkText/80 tracking-wide">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
