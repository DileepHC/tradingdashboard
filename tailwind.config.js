/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode based on the 'class' strategy (html.dark class)
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme Colors (Derived from your provided dashboard.css)
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        accent: 'var(--accent-color)',
        warning: 'var(--warning-color)',
        danger: 'var(--danger-color)',
        'text-base': 'var(--text-color)',
        'text-light': 'var(--light-text-color)',
        'bg-base': 'var(--background-color)',
        'bg-sidebar': 'var(--sidebarbackground-color)',
        'bg-card': 'var(--card-background)',
        'border-base': 'var(--border-color)',
        'shadow-light': 'var(--shadow-light)',
        'shadow-medium': 'var(--shadow-medium)',
        'shadow-strong': 'var(--shadow-strong)',
      },
      // Define custom gradients (these will still be applied via custom CSS classes)
      // Tailwind doesn't have a direct way to define `linear-gradient` strings in `colors`
      // So we'll define them as CSS variables and reference them in `index.css`
      // You can define custom widths for sidebar collapse
      spacing: {
        'header-height': '70px', // Directly set, or use var(--header-height) if defined as CSS var
        'sidebar-width': '250px', // Directly set, or use var(--sidebar-width)
        'sidebar-width-collapsed': '70px', // Directly set, or use var(--sidebar-width-collapsed)
      },
      // You can also define custom box shadows if needed, but we'll stick to CSS variables
      boxShadow: {
        'light': 'var(--shadow-light)',
        'medium': 'var(--shadow-medium)',
        'strong': 'var(--shadow-strong)',
      }
    },
  },
  plugins: [],
}
