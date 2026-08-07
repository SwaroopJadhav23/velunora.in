import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Truck, Star, ShieldCheck, Heart, Instagram } from 'lucide-react';

const cards = [
  {
    icon: Sparkles,
    title: 'Premium Imported',
    desc: 'Carefully curated collectibles sourced directly from Japan, Korea, and official global distributors. Genuine character plushies — and some are thrifted finds.',
    color: 'bg-gradient-soft-pink text-candy',
    animation: { rotate: [0, -10, 10, 0] },
  },
  {
    icon: Star,
    title: 'Imported & Thrifted',
    desc: 'Our plushies are imported and thrifted — carefully chosen character friends ready to join your collection.',
    color: 'bg-gradient-soft-yellow text-sunny',
    animation: { scale: [1, 1.15, 1] },
  },
  {
    icon: Truck,
    title: 'Pan India',
    desc: 'Safe, express tracked courier delivery straight to your doorstep across any city or state in India.',
    color: 'bg-gradient-soft-blue text-sky',
    animation: { x: [0, -4, 4, 0] },
  },
  {
    icon: Heart,
    title: 'Trusted Store',
    desc: 'Highly rated by thousands of character collectors and parents. See our reviews and Instagram stories!',
    color: 'bg-[#FFF5F8] text-[#FF6FB5]',
    animation: { scale: [1, 1.2, 1] },
  },
  {
    icon: ShieldCheck,
    title: 'Safe Packaging',
    desc: 'Each plush is wrapped in dual-layer protective dust covers and shipped in solid carton boxes to prevent transit squeezing.',
    color: 'bg-gradient-soft-mint text-mint',
    animation: { y: [0, -4, 0] },
  },
  {
    icon: Instagram,
    title: 'Instagram Support',
    desc: 'Quick, friendly support on DMs and WhatsApp. Send us photos, ask questions, or request custom plush sourcing easily!',
    color: 'bg-gradient-soft-purple text-primary',
    animation: { rotate: [0, 15, -15, 0] },
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item: any = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export default function WhyUs() {
  const [tiltStyle, setTiltStyle] = useState<{ [key: number]: string }>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;

    // Maximum degrees of rotation
    const maxTilt = 10;
    const rotateX = -(y / (height / 2)) * maxTilt;
    const rotateY = (x / (width / 2)) * maxTilt;

    setTiltStyle({
      [index]: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    });
  };

  const handleMouseLeave = (index: number) => {
    setTiltStyle({
      [index]: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  return (
    <section id="why" className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 bg-white px-4 sm:px-8 md:px-12 lg:px-20 border-b border-darkText/[0.02] overflow-hidden scroll-mt-28">
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/5 px-4 py-1.5 rounded-full mb-3 inline-block">
            Our Brand Promise
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-darkText font-extrabold mb-4 leading-tight select-none">
            Why Everyone Loves Plush.Palz.
          </h2>
          <p className="font-body text-base text-darkText/70 max-w-xl mx-auto">
            We deliver imported character companions to India with premium care. Hover over a card to experience the magic!
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                variants={item}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                style={{
                  transform: tiltStyle[idx] || 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                  transition: 'transform 0.1s ease-out',
                  transformStyle: 'preserve-3d',
                }}
                className="bg-bgMain rounded-[32px] p-8 border border-darkText/5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_45px_rgba(124,58,237,0.08)] transition-shadow duration-300 group cursor-pointer"
              >
                {/* Icon Container with Custom Hover Animations */}
                <motion.div
                  whileHover={c.animation}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${c.color} shadow-sm`}
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <Icon size={26} className="filter drop-shadow-sm" />
                </motion.div>
                
                <h3
                  className="font-heading font-bold text-xl text-darkText mb-3 group-hover:text-primary transition-colors"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {c.title}
                </h3>
                <p
                  className="font-body text-sm text-darkText/70 leading-relaxed font-medium"
                  style={{ transform: 'translateZ(10px)' }}
                >
                  {c.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
