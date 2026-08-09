import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config/api';

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'Who We Are', href: '#about' },
  { label: 'Bouquets', href: '#trending' },
  { label: 'Why Us', href: '#why' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Order', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const orderHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Velunora! I would like to order a bouquet 🌸')}`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAF6EF]/90 backdrop-blur-lg shadow-[0_4px_30px_rgba(44,44,44,0.06)] border-b border-gold/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <motion.img
            src="/logo.jpeg"
            alt="Velunora Logo"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-[0_4px_14px_rgba(196,163,90,0.28)] ring-1 ring-gold/30"
          />
          <div className="flex flex-col leading-none">
            <span className="font-heading text-2xl tracking-[0.08em] text-darkText font-semibold select-none uppercase">
              Velunora
            </span>
            <span className="text-[9px] tracking-[0.22em] uppercase text-sage/80 font-medium mt-1 hidden sm:block">
              Fuzzy Wire Crafts
            </span>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <motion.a
              key={l.href}
              href={l.href}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="text-sm font-medium text-darkText/75 hover:text-gold transition-colors duration-200 relative group py-1"
            >
              {l.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold rounded-full transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}

          <motion.a
            href={orderHref}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs uppercase tracking-[0.14em] font-heading font-semibold bg-gradient-to-r from-rose to-gold text-white px-5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(196,163,90,0.3)] hover:shadow-[0_6px_20px_rgba(196,163,90,0.45)] transition-all duration-300"
          >
            DM to Order
          </motion.a>
        </div>

        <button
          className="md:hidden text-darkText focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-[#FAF6EF]/95 backdrop-blur-xl border-b border-gold/20"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-darkText hover:text-gold transition-colors py-1 block"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={orderHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="text-sm font-heading font-semibold bg-gradient-to-r from-rose to-gold text-white px-6 py-3 rounded-full text-center shadow-md hover:shadow-lg transition-all"
              >
                DM to Order
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
