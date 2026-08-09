import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

const reviews = [
  {
    quote: "The pink bloom looks so luxurious — guests thought it was a real boutique flower! Perfect gift for my sister. 🌸",
    author: 'Ananya S.',
    location: 'Pune',
    avatar: '🌸',
    avatarBg: 'bg-gradient-soft-pink',
    floatDelay: 0,
    img: '/images/bouquet-pink.jpeg',
  },
  {
    quote: "Ordered the heart arrangement for an anniversary — she cried happy tears. And it still looks brand new weeks later! 💗",
    author: 'Rohan M.',
    location: 'Pune',
    avatar: '💗',
    avatarBg: 'bg-gradient-soft-yellow',
    floatDelay: 0.3,
    img: '/images/bouquet-heart.jpeg',
  },
  {
    quote: "Sunshine lily brightened my desk forever. Velunora’s packaging and care feel so premium. 🌼",
    author: 'Meera K.',
    location: 'Pune',
    avatar: '🌼',
    avatarBg: 'bg-gradient-soft-mint',
    floatDelay: 0.15,
    img: '/images/bouquet-yellow.jpeg',
  },
  {
    quote: "Budget-friendly but looks like a 2000+ bouquet. I’ll be gifting these often. Handmade love in every petal!",
    author: 'Priya D.',
    location: 'Pune',
    avatar: '🩷',
    avatarBg: 'bg-gradient-soft-purple',
    floatDelay: 0.45,
    img: '/images/bouquet-pink.jpeg',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: any = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export default function CustomerLove() {
  return (
    <section id="reviews" className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 lg:pb-28 bg-satin px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden scroll-mt-28">
      <div className="absolute inset-0 pointer-events-none select-none z-10 opacity-30">
        <Sparkles className="absolute text-gold w-5 h-5 top-12 left-1/4 animate-pulse" />
        <Sparkles className="absolute text-rose w-5 h-5 bottom-12 right-1/4 animate-pulse delay-300" />
      </div>

      <div className="max-w-[1500px] mx-auto relative z-20">
        <div className="text-center mb-16">
          <p className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-3">
            Customer Love
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-darkText font-semibold mb-4 leading-tight">
            Endless Smiles
          </h2>
          <p className="font-body text-base text-darkText/65 max-w-lg mx-auto">
            Real joy from handmade bouquets that never fade.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {reviews.map((r) => (
            <motion.div
              key={r.author}
              variants={item}
              className="relative bg-white/80 border border-gold/15 rounded-[28px] p-6 shadow-[0_4px_22px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(196,163,90,0.1)] transition-shadow"
            >
              <div className="flex gap-1 mb-4 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="font-body text-sm text-darkText/70 leading-relaxed mb-6">
                “{r.quote}”
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${r.avatarBg} flex items-center justify-center text-lg`}>
                  {r.avatar}
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-darkText">{r.author}</p>
                  <p className="text-[10px] text-darkText/45 uppercase tracking-wider">{r.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
