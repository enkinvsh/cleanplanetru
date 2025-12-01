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
            <body className={inter.className}>{children}</body>
        </html>
    );
}
