import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Browse our bouquets, then tap “DM to Order” or message us on WhatsApp with the bouquet you love. We’ll confirm details and share prepaid payment options to lock in your order.',
  },
  {
    question: 'Do you accept COD?',
    answer: 'No — Velunora accepts prepaid orders only (UPI and other secure online payments). This keeps our handmade bouquets affordable and ensures every order is reserved just for you.',
  },
  {
    question: 'Where are you based?',
    answer: 'We’re based in Pune. Message us for delivery options and timelines for your area.',
  },
  {
    question: 'Can I request a custom bouquet?',
    answer: 'Yes! Custom colour palettes, heart arrangements, and occasion-specific designs are our specialty. Share your idea (and inspo photos) over DM and we’ll craft it by hand.',
  },
  {
    question: 'How long do pipe cleaner bouquets last?',
    answer: 'That’s the magic — they never wilt. Made with high-quality fuzzy wire, your bouquet keeps its shape and colour for years with normal indoor care.',
  },
  {
    question: 'What is your refund or return policy?',
    answer: 'Because each piece is handmade, we don’t accept general returns. If something arrives damaged, send us unboxing photos within 24 hours and we’ll make it right.',
  },
];

export default function HowItWorks() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 bg-[#FAF6EF] px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden scroll-mt-28">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <p className="font-heading text-sm tracking-[0.35em] uppercase text-gold mb-3">
            Have Questions?
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-darkText font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-sm md:text-base text-darkText/65 max-w-xl mx-auto">
            Ordering, prepaid payments, customs & more — tap a question below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <motion.div
                key={index}
                layout
                onClick={() => toggleExpand(index)}
                className={`bg-white/80 border border-gold/15 rounded-[28px] p-6 md:p-8 cursor-pointer relative overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${
                  isExpanded
                    ? 'shadow-[0_10px_30px_rgba(196,163,90,0.1)] border-gold/35'
                    : 'hover:shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isExpanded ? 'bg-gold/15 text-gold' : 'bg-cream text-darkText/50'
                    }`}>
                      <HelpCircle size={16} />
                    </div>
                    <h3 className="font-heading font-semibold text-darkText text-sm md:text-base leading-tight">
                      {faq.question}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-darkText/40"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden relative z-10"
                    >
                      <p className="font-body text-xs md:text-sm text-darkText/70 leading-relaxed pl-11 border-l-2 border-gold/25">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
