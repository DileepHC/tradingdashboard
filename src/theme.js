// src/theme.js
import { createTheme } from "@mui/material/styles";

// Function to define color tokens for consistent theming
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        // Dark Mode Colors - Aligned with html.dark in index.css
        primary: {
          // Lighter, Main, Darker shades of primary (from index.css --primary-color)
          light: '#66b3ff', // Derived from --primary-color
          main: '#66b3ff', // Directly from --primary-color
          dark: '#3388ff', // Derived for a darker shade from --primary-color gradient end
          contrastText: '#ffffff',
        },
        secondary: {
          // Shades of secondary (from index.css --secondary-color)
          light: '#e2e8f0', // Directly from --secondary-color (which is light text)
          main: '#e2e8f0', // Directly from --secondary-color
          dark: '#b0b8c4', // Derived for a darker shade
          contrastText: '#1a202c', // Contrast for secondary on dark mode
        },
        neutral: {
          // Neutral colors for text, axis, etc.
          dark: '#a0aec0', // Using --text-color for neutral.dark (e.g., Nivo axis/legend text on dark backgrounds)
          main: '#a0aec0', // Directly from --text-color
          light: '#718096', // Directly from --light-text-color
        },
        background: {
          default: '#2d3748', // Directly from --background-color
          paper: '#1a202c', // Directly from --card-background (for Nivo tooltip background, MUI Paper)
        },
        // Explicit CSS variables for direct use by other components/Tailwind
        "--primary-color": "#66b3ff",
        "--secondary-color": "#e2e8f0",
        "--accent-color": "#48bb78",
        "--warning-color": "#f6ad55",
        "--danger-color": "#fc8181",
        "--text-color": "#a0aec0",
        "--light-text-color": "#718096",
        "--background-color": "#2d3748",
        "--sidebarbackground-color": "#2d3748",
        "--card-background": "#1a202c",
        "--border-color": "#4a5568",
        "--shadow-light": "rgba(0, 0, 0, 0.2)",
        "--shadow-medium": "rgba(0, 0, 0, 0.3)",
        "--shadow-strong": "rgba(0, 0, 0, 0.4)",
        "--gradient-primary": "linear-gradient(135deg, #66b3ff, #3388ff)",
        "--gradient-secondary": "linear-gradient(135deg, #66b3ff, #3388ff)", // Using primary gradient for secondary as per index.css
        "--gradient-accent": "linear-gradient(135deg, #48bb78, #38a169)",
        "--gradient-warning": "linear-gradient(135deg, #f6ad55, #ed8936)",
        "--gradient-danger": "linear-gradient(135deg, #fc8181, #e53e3e)",
        "--gradient-card": "linear-gradient(135deg, #1a202c, #2d3748)",
        "--gradient-background": "linear-gradient(135deg, #2d3748, #1a202c)",
        "--gradient-text-color": "linear-gradient(135deg, #a0aec0, #718096)",
        "--gradient-light-text-color": "linear-gradient(135deg, #718096, #4a5568)",
        "--bg-hover": "#3a4a5a", // Added explicitly for use if needed
      }
    : {
        // Light Mode Colors - Aligned with :root in index.css
        primary: {
          light: '#3498db', // Derived from --primary-color
          main: '#3498db', // Directly from --primary-color
          dark: '#2980b9', // Derived for a darker shade from --primary-color gradient end
          contrastText: '#ffffff',
        },
        secondary: {
          light: '#34495e', // Derived from --secondary-color
          main: '#34495e', // Directly from --secondary-color
          dark: '#2c3e50', // Derived for a darker shade from --secondary-color gradient end
          contrastText: '#ffffff',
        },
        neutral: {
          // Neutral colors for text, axis, etc.
          dark: '#555e6c', // Using --text-color for neutral.dark (e.g., Nivo axis/legend text on light backgrounds)
          main: '#555e6c', // Directly from --text-color
          light: '#7f8c8d', // Directly from --light-text-color
        },
        background: {
          default: '#f3f7f9', // Directly from --background-color
          paper: '#ffffff', // Directly from --card-background (for Nivo tooltip background, MUI Paper)
        },
        // Explicit CSS variables for direct use by other components/Tailwind
        "--primary-color": "#3498db",
        "--secondary-color": "#34495e",
        "--accent-color": "#2ecc71",
        "--warning-color": "#f39c12",
        "--danger-color": "#e74c3c",
        "--text-color": "#555e6c",
        "--light-text-color": "#7f8c8d",
        "--background-color": "#f3f7f9",
        "--sidebarbackground-color": "white",
        "--card-background": "#ffffff",
        "--border-color": "#e6e9ed",
        "--shadow-light": "rgba(0, 0, 0, 0.04)",
        "--shadow-medium": "rgba(0, 0, 0, 0.08)",
        "--shadow-strong": "rgba(0, 0, 0, 0.1)",
        "--gradient-primary": "linear-gradient(135deg, #3498db, #2980b9)",
        "--gradient-secondary": "linear-gradient(135deg, #34495e, #2c3e50)",
        "--gradient-accent": "linear-gradient(135deg, #2ecc71, #27ae60)",
        "--gradient-warning": "linear-gradient(135deg, #f39c12, #e67e22)",
        "--gradient-danger": "linear-gradient(135deg, #e74c3c, #c0392b)",
        "--gradient-card": "linear-gradient(135deg, #ffffff, #fdfdfd)",
        "--gradient-background": "linear-gradient(135deg, #f3f7f9, #e9eff2)",
        "--gradient-text-color": "linear-gradient(135deg, #555e6c, #3d4a5c)",
        "--gradient-light-text-color": "linear-gradient(135deg, #7f8c8d, #6c7a89)",
        "--bg-hover": "#f5f5f5", // Added explicitly for use if needed
      }),
});

// Function to create and export the Material-UI theme
export const themeSettings = (mode) => {
  const colors = tokens(mode); // Get the color tokens for the current mode
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: colors.primary.main,
        light: colors.primary.light,
        dark: colors.primary.dark,
        contrastText: colors.primary.contrastText,
      },
      secondary: {
        main: colors.secondary.main,
        light: colors.secondary.light,
        dark: colors.secondary.dark,
        contrastText: colors.secondary.contrastText,
      },
      // Map neutral colors for text/UI elements
      neutral: {
        dark: colors.neutral.dark,
        main: colors.neutral.main,
        light: colors.neutral.light,
      },
      // Map background colors for surfaces
      background: {
        default: colors.background.default, // Main app background
        paper: colors.background.paper,     // Card/panel background
      },
    },
    typography: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 12,
        h1: { fontSize: 40 },
        h2: { fontSize: 32 },
        h3: { fontSize: 24 },
        h4: { fontSize: 20 },
        h5: { fontSize: 16 },
        h6: { fontSize: 14 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // Apply CSS variables to the root body for global access by Tailwind and custom CSS
          body: {
            '--primary-color': colors["--primary-color"],
            '--secondary-color': colors["--secondary-color"],
            '--accent-color': colors["--accent-color"],
            '--warning-color': colors["--warning-color"],
            '--danger-color': colors["--danger-color"],
            '--text-color': colors["--text-color"],
            '--light-text-color': colors["--light-text-color"],
            '--background-color': colors["--background-color"],
            '--sidebarbackground-color': colors["--sidebarbackground-color"],
            '--card-background': colors["--card-background"],
            '--border-color': colors["--border-color"],
            '--shadow-light': colors["--shadow-light"],
            '--shadow-medium': colors["--shadow-medium"],
            '--shadow-strong': colors["--shadow-strong"],
            '--gradient-primary': colors["--gradient-primary"],
            '--gradient-secondary': colors["--gradient-secondary"],
            '--gradient-accent': colors["--gradient-accent"],
            '--gradient-warning': colors["--gradient-warning"],
            '--gradient-danger': colors["--gradient-danger"],
            '--gradient-card': colors["--gradient-card"],
            '--gradient-background': colors["--gradient-background"],
            '--gradient-text-color': colors["--gradient-text-color"],
            '--gradient-light-text-color': colors["--gradient-light-text-color"],
            '--bg-hover': colors["--bg-hover"],
          },
        },
      },
    },
  });
};
