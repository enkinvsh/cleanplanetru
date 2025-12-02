import { Metadata } from "next";
import { LeafyGreen, Phone, Clock, MapPin } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
    title: "Вывоз металлолома в Алматы | Чистая Планета",
    description: "Быстрый и выгодный вывоз металлолома в Алматы. Приедем в течение 24 часов, честные весы, высокие цены. Оставьте заявку на сайте!",
};

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-brand-green-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container-mobile py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <LeafyGreen className="h-8 w-8 text-brand-green-600" />
                            <h1 className="text-xl font-bold text-brand-green-900">
                                Чистая Планета
                            </h1>
                        </div>
                        <a
                            href="tel:+79999999999"
                            className="flex items-center gap-2 text-brand-green-600 font-semibold"
                        >
                            <Phone className="h-5 w-5" />
                            <span className="hidden sm:inline">Позвонить</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container-mobile py-8 md:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Content */}
                    <div className="space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl font-bold text-brand-green-900 mb-6 leading-tight">
                                Вывоз металлолома <br className="hidden lg:block" />
                                <span className="text-brand-green-600">дорого и быстро</span>
                            </h2>
                            <p className="text-lg md:text-xl text-brand-gray-600 max-w-xl mx-auto lg:mx-0">
                                Оставьте заявку прямо сейчас, и мы приедем в удобное для вас время. Работаем без выходных.
                            </p>
                        </div>

                        {/* Features Grid - Horizontal on mobile, Grid on desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                            <FeatureCard
                                icon={<Clock className="h-6 w-6" />}
                                title="Быстро"
                                description="Приезд в течение 24 часов"
                            />
                            <FeatureCard
                                icon={<MapPin className="h-6 w-6" />}
                                title="Удобно"
                                description="Работаем по всему городу"
                            />
                            <FeatureCard
                                icon={<LeafyGreen className="h-6 w-6" />}
                                title="Экологично"
                                description="Честная утилизация"
                            />
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl shadow-xl border border-brand-green-100 p-6 md:p-8">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-brand-green-900">
                                    Оставить заявку
                                </h3>
                                <p className="text-brand-gray-500 text-sm mt-2">
                                    Менеджер перезвонит в течение 5 минут
                                </p>
                            </div>
                            <LeadForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-brand-green-900 text-white py-8 mt-16">
                <div className="container-mobile">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-lg mb-4">Чистая Планета</h4>
                            <p className="text-brand-green-100">
                                Профессиональный вывоз металлолома
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Контакты</h4>
                            <p className="text-brand-green-100 mb-2">
                                Телефон: +7 (999) 999-99-99
                            </p>
                            <p className="text-brand-green-100">
                                Email: info@cleanplanet.ru
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-brand-green-700 mt-8 pt-8 text-center text-brand-green-200 text-sm">
                        © 2025 Чистая Планета. Все права защищены.
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-brand-green-50 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="bg-brand-green-100 p-3 rounded-full text-brand-green-700 shrink-0">
                {icon}
            </div>
            <div className="text-left">
                <h3 className="font-bold text-brand-green-900">{title}</h3>
                <p className="text-brand-gray-600 text-sm leading-tight">{description}</p>
            </div>
        </div>
    );
}
