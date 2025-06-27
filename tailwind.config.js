// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // It's good practice to purge only files that contain Tailwind classes.
  // Make sure to include all your component and scene files.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/scenes/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode based on the presence of the 'dark' class on the HTML tag

  theme: {
    extend: {
      // Define custom colors based on your CSS variables
      colors: {
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
        'accent': 'var(--accent-color)',
        'warning': 'var(--warning-color)',
        'danger': 'var(--danger-color)',
        'text-base': 'var(--text-color)',
        'text-light': 'var(--light-text-color)',
        'bg-base': 'var(--background-color)',
        'sidebar-bg': 'var(--sidebarbackground-color)',
        'card-bg': 'var(--card-background)', // Use card-bg for consistency with other background properties
        'border-base': 'var(--border-color)',
      },
      // Define custom background colors specifically for gradients
      // This allows you to use classes like 'bg-gradient-primary'
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-warning': 'var(--gradient-warning)',
        'gradient-danger': 'var(--gradient-danger)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-background': 'var(--gradient-background)',
        'gradient-text-color': 'var(--gradient-text-color)',
        'gradient-light-text-color': 'var(--gradient-light-text-color)',
      },
      // Define custom box shadows
      boxShadow: {
        'light': '0 4px 15px var(--shadow-light)',
        'medium': '0 6px 20px var(--shadow-medium)',
        'strong': '0 8px 25px var(--shadow-strong)',
      },
      // Define custom heights for consistency
      height: {
        'header': 'var(--header-height)',
      },
      // Define custom widths for consistency
      width: {
        'sidebar': 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-width-collapsed)',
      },
      // Keyframes for custom animations
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          'to': { left: '100%' },
        },
        radialShine: {
            'to': { background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0) 0%, transparent 70%)', transform: 'scale(1.5)' },
        },
      },
      // Apply animations
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
        'shine': 'shine 0.7s forwards',
        'radial-shine': 'radialShine 0.8s forwards',
      },
    },
  },
  plugins: [],
}