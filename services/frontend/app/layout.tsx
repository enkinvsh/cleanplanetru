import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: "#10B981",
};

export const metadata: Metadata = {
    title: "Чистая Планета - Вывоз металлолома",
    description: "Быстрый и удобный вывоз металлолома. Оставьте заявку онлайн или через Telegram.",
    keywords: ["вывоз металлолома", "прием металлолома", "утилизация металла", "чистая планета"],
    authors: [{ name: "Clean Planet" }],
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Чистая Планета",
    },
    formatDetection: {
        telephone: true,
    },
    icons: {
        icon: "/icon-192.png",
        apple: "/icon-192.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <head>
                <link rel="dns-prefetch" href="https://crm.meybz.asia" />
                <script dangerouslySetInnerHTML={{
                    __html: `
                        if ('serviceWorker' in navigator) {
                            window.addEventListener('load', () => {
                                navigator.serviceWorker.register('/sw.js')
                                    .then(reg => {
                                        console.log('[PWA] Service Worker registered');
                                        
                                        // Check for updates
                                        reg.addEventListener('updatefound', () => {
                                            const newWorker = reg.installing;
                                            newWorker.addEventListener('statechange', () => {
                                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                                    console.log('[PWA] New version available');
                                                }
                                            });
                                        });
                                    })
                                    .catch(err => console.error('[PWA] SW registration failed:', err));
                            });
                        }
                        
                        // Install prompt
                        let deferredPrompt;
                        window.addEventListener('beforeinstallprompt', (e) => {
                            e.preventDefault();
                            deferredPrompt = e;
                            console.log('[PWA] Install prompt available');
                        });
                    `
                }} />
            </head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
