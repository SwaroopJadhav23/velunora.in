import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import FloatingBackground from './components/FloatingBackground';
import Hero from './components/Hero';
import About from './components/About';
import WhyUs from './components/WhyUs';
import { UniversePortals, TrendingCollection, Universe } from './components/Creations';
import Spotlight from './components/Spotlight';
import CustomerLove from './components/CustomerLove';
import FromTheGram from './components/FromTheGram';
import HowItWorks from './components/HowItWorks';
import Contact from './components/Contact';
import BrandIntro from './components/BrandIntro';
import ProductDetails from './components/ProductDetails';
import AdminDashboard from './components/AdminDashboard';
import { CloudDivider, CurveDivider } from './components/Transitions';
import { logPageVisit } from './config/api';

function App() {
  const [introStage, setIntroStage] = useState<'playing' | 'revealing' | 'complete'>(() => {
    if (typeof window !== 'undefined') {
      const visited = sessionStorage.getItem('velunora-visited');
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (visited || prefersReduced) {
        return 'complete';
      }
    }
    return 'playing';
  });

  // Shared category selection state
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | 'All'>('All');

  // Simple SPA routing state (handles pathnames and hashes)
  interface RouteState {
    type: 'home' | 'product' | 'admin';
    slug?: string;
  }
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#/admin' || hash === '#admin' || path === '/admin' || path === '/admin/') {
        return { type: 'admin' };
      }
      if (hash.startsWith('#/products/')) {
        return { type: 'product', slug: hash.replace('#/products/', '') };
      }
      if (path.startsWith('/products/')) {
        return { type: 'product', slug: path.replace('/products/', '') };
      }
    }
    return { type: 'home' };
  });

  // Track page visits on route change
  useEffect(() => {
    const currentPath = window.location.hash || window.location.pathname || '#/';
    logPageVisit(currentPath);
  }, [route]);

  // Track navigation changes
  useEffect(() => {
    const handleRouting = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#/admin' || hash === '#admin' || path === '/admin' || path === '/admin/') {
        setRoute({ type: 'admin' });
      } else if (hash.startsWith('#/products/')) {
        setRoute({ type: 'product', slug: hash.replace('#/products/', '') });
      } else if (path.startsWith('/products/')) {
        setRoute({ type: 'product', slug: path.replace('/products/', '') });
      } else {
        setRoute({ type: 'home' });
      }
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', handleRouting);
    window.addEventListener('popstate', handleRouting);
    return () => {
      window.removeEventListener('hashchange', handleRouting);
      window.removeEventListener('popstate', handleRouting);
    };
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Custom sparkle particle cursor effect (extremely lightweight, DOM-based to avoid React render delay)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Control emission rate
      if (Math.random() > 0.18) return;

      const particle = document.createElement('div');
      particle.className = 'sparkle-particle';

      const size = Math.random() * 8 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;

      // Assign candy pink or sunny yellow randomly
      const colors = ['#C9A0A0', '#C4A35A', '#8A9A7B'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.background = chosenColor;
      particle.style.boxShadow = `0 0 10px ${chosenColor}`;

      document.body.appendChild(particle);

      // Clean up DOM after animation completes
      setTimeout(() => {
        particle.remove();
      }, 600);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleIntroComplete = () => {
    setIntroStage('revealing');
    setTimeout(() => {
      setIntroStage('complete');
      sessionStorage.setItem('velunora-visited', 'true');
    }, 600); // 600ms transition to complete stage
  };

  return (
    <div className="min-h-screen bg-bgMain font-body text-darkText relative overflow-x-hidden">
      {/* Decorative Interactive Background Objects */}
      <FloatingBackground isActive={introStage === 'complete'} />

      {/* Sticky Top Header Nav — fades in after intro */}
      {route.type !== 'admin' && (
        <div className={introStage === 'playing' ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-[800ms] delay-[300ms]'}>
          <Navbar />
        </div>
      )}

      <main className="relative z-20">
        {route.type === 'home' ? (
          <>
            {/* Section 1: Cinematic Magical Hero */}
            <Hero introStage={introStage} />

            {/* Section transition divider */}
            <CurveDivider topColor="#F7F0E6" bottomColor="#F7F0E6" />

            {/* Who We Are + What We Sell */}
            <About />

            <CloudDivider topColor="#FAF6EF" bottomColor="#FAF6EF" />

            <UniversePortals selectedUniverse={selectedUniverse} onSelectUniverse={setSelectedUniverse} />

            <Spotlight />

            <TrendingCollection selectedUniverse={selectedUniverse} onSelectUniverse={setSelectedUniverse} />

            <CloudDivider topColor="#FAF6EF" bottomColor="#FAF6EF" />

            <WhyUs />

            <FromTheGram />

            <CustomerLove />

            <HowItWorks />

            <Contact />
          </>
        ) : route.type === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            {route.slug && <ProductDetails slug={route.slug} />}
            <Contact />
          </>
        )}
      </main>

      {/* Premium Brand Intro Screen Overlay */}
      <AnimatePresence>
        {introStage === 'playing' && (
          <BrandIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
