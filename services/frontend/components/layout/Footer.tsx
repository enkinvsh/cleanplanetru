'use client';

import { Leaf, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-xl">
            <div className="max-w-md md:max-w-7xl mx-auto px-5 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Logo & Company */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md">
                            <Leaf className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">Чистая Планета</h3>
                            <p className="text-xs text-slate-600">Екатеринбург</p>
                        </div>
                    </div>

                    {/* Contacts */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <a
                            href="tel:+79999999999"
                            className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition-colors"
                        >
                            <Phone className="h-4 w-4" />
                            <span className="text-sm font-medium">+7 (999) 999-99-99</span>
                        </a>
                        <a
                            href="mailto:info@cleanplanet.ru"
                            className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition-colors"
                        >
                            <Mail className="h-4 w-4" />
                            <span className="text-sm font-medium">info@cleanplanet.ru</span>
                        </a>
                    </div>
                </div>

                {/* Copyright & Links */}
                <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-600">
                    <p>© 2025 Чистая Планета. Все права защищены.</p>
                    <a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors">
                        Политика конфиденциальности
                    </a>
                </div>
            </div>
        </footer>
    );
}
