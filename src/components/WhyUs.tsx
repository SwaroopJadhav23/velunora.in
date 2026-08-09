import { motion } from 'framer-motion';
import { Diamond, Gift, Tag, Heart, Star } from 'lucide-react';

const points = [
  {
    icon: Diamond,
    title: 'Looks Expensive, Feels Special',
    desc: 'Luxury in every detail that makes every moment memorable.',
  },
  {
    icon: Gift,
    title: 'Elegant Gifting, Made Budget Friendly',
    desc: "Beautifully curated bouquets that don't break the bank.",
  },
  {
    icon: Tag,
    title: 'Looks Like 2000+, But Not Actually About 2000',
    desc: 'Premium look and feel, without the premium price tag.',
  },
  {
    icon: Heart,
    title: 'Affordable Enough To Gift Often',
    desc: 'Because your loved ones deserve flowers, more often.',
  },
  {
    icon: Star,
    title: 'Best Quality, Always',
    desc: 'Handmade with love using high quality pipe cleaners for a fresh, lasting beauty.',
  },
];

export default function WhyUs() {
  return (
    <section id="why" className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 bg-[#FAF6EF] px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden scroll-mt-28">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-14">
          <p className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-4">
            Why To Choose Us
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-darkText font-semibold mb-4 leading-tight">
            Beautiful Bouquets. Thoughtful Prices.
          </h2>
          <p className="font-body text-base text-darkText/65 max-w-lg mx-auto">
            Endless smiles — handmade fuzzy wire crafts from Pune.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          {points.map((point, idx) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.08, duration: 0.45 }}
                className="flex items-start gap-5 group"
              >
                <div className="w-14 h-14 shrink-0 rounded-full border border-gold/50 flex items-center justify-center text-gold bg-white/60 group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <div className="pt-1">
                  <h3 className="font-heading text-lg md:text-xl font-semibold tracking-wide uppercase text-darkText mb-1.5">
                    {point.title}
                  </h3>
                  <p className="font-body text-sm md:text-base text-darkText/65 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 font-heading text-sm md:text-base tracking-[0.2em] uppercase text-gold"
        >
          ✦ Beautiful Bouquets. Thoughtful Prices. Endless Smiles. ✦
        </motion.p>
      </div>
    </section>
  );
}
