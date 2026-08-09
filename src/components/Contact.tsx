import { motion } from 'framer-motion';
import { Instagram, MessageCircle, MapPin, Heart } from 'lucide-react';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY_NUMBER } from '../config/api';

const contactCards = [
  {
    icon: MessageCircle,
    isWhatsApp: true,
    label: 'WhatsApp / DM',
    value: WHATSAPP_DISPLAY_NUMBER,
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi Velunora! I would like to order a bouquet 🌸')}`,
    color: 'hover:border-[#25D366]/30 hover:text-[#25D366]',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@velunora',
    href: 'https://instagram.com/velunora',
    color: 'hover:border-rose/40 hover:text-rose',
  },
  {
    icon: MapPin,
    label: 'Based In',
    value: 'Pune',
    href: '#contact',
    color: 'hover:border-gold/40 hover:text-gold',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative pt-28 sm:pt-32 md:pt-36 pb-0 overflow-hidden scroll-mt-28 bg-satin">
      <div className="max-w-4xl mx-auto text-center px-6 mb-10 md:mb-20">
        <p className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-4">
          DM to Order
        </p>
        <h2 className="font-heading text-4xl md:text-5xl text-darkText font-semibold mb-4 leading-tight">
          Ready for flowers that never fade?
        </h2>
        <p className="font-body text-base text-darkText/65 max-w-lg mx-auto mb-4">
          Custom bouquets & pipe cleaner blooms — message us to place your order.
        </p>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-rose mb-10">
          Prepaid orders only
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {contactCards.map((c) => {
            const Icon = c.icon;
            return (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                whileHover={{ y: -3, scale: 1.02 }}
                className={`flex items-center gap-3 bg-white/80 rounded-3xl px-6 py-4 border border-gold/15 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 min-w-[220px] justify-center ${c.color}`}
              >
                <div className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center">
                  {'isWhatsApp' in c && c.isWhatsApp ? (
                    <img src="/whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                  ) : (
                    <Icon size={18} />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-darkText/40 font-semibold uppercase tracking-wider">{c.label}</p>
                  <p className="font-heading font-semibold text-xs md:text-sm">{c.value}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      <footer className="relative bg-[#2C2C2C] text-white py-16 px-6 rounded-t-[48px] md:rounded-t-[64px] overflow-hidden z-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(196,163,90,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(201,160,160,0.2), transparent 40%)`,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-20 flex flex-col items-center text-center">
          <img
            src="/logo.jpeg"
            alt="Velunora Logo"
            className="w-16 h-16 rounded-full object-cover shadow-md ring-1 ring-gold/40 mb-4"
          />
          <span className="font-heading text-2xl font-semibold tracking-[0.12em] uppercase mb-1">
            Velunora
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold/80 mb-4">
            Fuzzy Wire Crafts
          </span>

          <p className="font-script text-2xl text-rose mb-3">
            Where Flowers Never Fade
          </p>

          <p className="text-xs text-white/50 max-w-sm mb-6 leading-relaxed">
            Pipe Cleaner Bouquet • Custom Bouquets<br />
            Beautiful bouquets. Thoughtful prices. Endless smiles.
          </p>

          <div className="flex items-center gap-1.5 text-xs text-white/70 bg-white/5 border border-white/10 px-4.5 py-2.5 rounded-full mb-8">
            <MapPin size={12} className="text-gold" />
            <span>Pune • DM to Order • Prepaid only</span>
          </div>

          <Heart size={16} className="text-gold mb-4 fill-gold/30" />

          <div className="w-24 h-px bg-white/10 my-2" />

          <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider mt-4">
            © 2026 Velunora. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  );
}
