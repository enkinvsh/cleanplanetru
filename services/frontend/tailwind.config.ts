import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Clean Planet Brand Colors
                brand: {
                    white: "#FFFFFF",
                    green: {
                        50: "#ECFDF5",
                        100: "#D1FAE5",
                        200: "#A7F3D0",
                        300: "#6EE7B7",
                        400: "#34D399",
                        500: "#10B981",  // Primary green
                        600: "#059669",  // Darker green
                        700: "#047857",
                        800: "#065F46",
                        900: "#064E3B",
                    },
                    orange: {
                        50: "#FFF7ED",
                        100: "#FFEDD5",
                        200: "#FED7AA",
                        300: "#FDBA74",
                        400: "#FB923C",  // Accent orange
                        500: "#F97316",
                        600: "#EA580C",  // Dark orange
                        700: "#C2410C",
                        800: "#9A3412",
                        900: "#7C2D12",
                    },
                    gray: {
                        50: "#F9FAFB",
                        100: "#F3F4F6",
                        200: "#E5E7EB",
                        300: "#D1D5DB",
                        400: "#9CA3AF",
                        500: "#6B7280",
                        600: "#4B5563",
                        700: "#374151",
                        800: "#1F2937",
                        900: "#111827",
                    }
                },
                // shadcn/ui colors
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontSize: {
                // Mobile-first typography
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],      // 16px base
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            },
            spacing: {
                // Touch-friendly spacing
                'touch': '44px',  // Minimum touch target size
            }
        },
    },
    plugins: [],
};

export default config;
