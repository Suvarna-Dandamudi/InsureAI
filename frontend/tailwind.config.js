/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#172033',
          900: '#0f172a',
          950: '#080d1a',
        },
        light: {
          theme: '#ffffff',
          bg: '#ffffff',
          card: '#ffffff',
          text: '#1e293b',
          muted: '#64748b',
          border: '#e2e8f0',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }, '50%': { boxShadow: '0 0 25px rgba(59, 130, 246, 0.6)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-light': 'radial-gradient(at 40% 20%, rgba(219, 234, 254, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(147, 197, 253, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.1) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 40% 20%, rgba(30, 64, 175, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(29, 78, 216, 0.4) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(30, 58, 138, 0.2) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}
