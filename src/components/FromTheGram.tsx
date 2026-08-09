import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Heart, Play, MessageCircle } from 'lucide-react';

const posts = [
  {
    id: 1,
    type: 'Post',
    src: '/images/bouquet-pink.jpeg',
    likes: '1.2k',
    comments: '48',
    caption: 'Pink bloom that never fades 🌸 Handmade with love.',
    bg: 'bg-gradient-soft-pink',
  },
  {
    id: 2,
    type: 'Reel',
    src: '/images/bouquet-heart.jpeg',
    likes: '2.4k',
    comments: '96',
    caption: 'Heart arrangements for the ones who matter 💗',
    bg: 'bg-gradient-soft-purple',
  },
  {
    id: 3,
    type: 'Post',
    src: '/images/bouquet-yellow.jpeg',
    likes: '980',
    comments: '32',
    caption: 'Sunshine lily — bright, soft, forever 🌼',
    bg: 'bg-gradient-soft-yellow',
  },
  {
    id: 4,
    type: 'Reel',
    src: '/images/bouquet-pink.jpeg',
    likes: '1.8k',
    comments: '61',
    caption: 'Custom colours? We craft them just for you 🎨',
    bg: 'bg-gradient-soft-mint',
  },
];

export default function FromTheGram() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="gram" className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 bg-[#FAF6EF] px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden scroll-mt-28">
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-14">
          <p className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-3">
            From The Gram
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-darkText font-semibold mb-4">
            Velunora Moments
          </h2>
          <p className="font-body text-base text-darkText/65 max-w-lg mx-auto">
            Peek at our fuzzy wire crafts — then DM to order your own.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {posts.map((post) => (
            <motion.a
              key={post.id}
              href="https://instagram.com/velunora"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHovered(post.id)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ y: -4 }}
              className={`relative aspect-square rounded-[24px] overflow-hidden border border-gold/15 ${post.bg} group`}
            >
              <img
                src={post.src}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {post.type === 'Reel' && (
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white rounded-full p-1.5">
                  <Play size={12} fill="white" />
                </div>
              )}
              <AnimatePresence>
                {hovered === post.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-darkText/45 flex flex-col items-center justify-center text-white p-4"
                  >
                    <div className="flex items-center gap-4 text-sm font-medium mb-3">
                      <span className="flex items-center gap-1"><Heart size={14} fill="white" /> {post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={14} /> {post.comments}</span>
                    </div>
                    <p className="text-xs text-center leading-relaxed opacity-90 line-clamp-3">{post.caption}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.a>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="https://instagram.com/velunora"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-heading font-semibold text-sm tracking-wide bg-white border border-gold/25 text-darkText px-8 py-3.5 rounded-full hover:border-gold hover:text-gold transition-all shadow-sm"
          >
            <Instagram size={18} className="text-rose" />
            <span>Follow @velunora</span>
          </a>
        </div>
      </div>
    </section>
  );
}
