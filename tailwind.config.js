/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8A9A7B',
        candy: '#C9A0A0',
        gold: '#C4A35A',
        sage: '#6B7C5E',
        rose: '#D4A5A5',
        blush: '#F5E6E0',
        cream: '#F7F0E6',
        sky: '#C4A35A',
        sunny: '#C4A35A',
        mint: '#8A9A7B',
        white: '#FFFFFF',
        bgMain: '#F7F0E6',
        darkText: '#2C2C2C',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        body: ['"Outfit"', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-slower': 'float 8s ease-in-out infinite',
        'float-slowest': 'float 10s ease-in-out infinite',
        'drift-slow': 'drift 30s linear infinite',
        'drift-slower': 'drift 45s linear infinite',
        'drift-slowest': 'drift 60s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'blink': 'blink 4s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' },
        },
        drift: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.2, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
