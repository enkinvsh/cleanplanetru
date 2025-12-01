import { Metadata } from "next";
import { LeafyGreen, Phone, Clock, MapPin } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
    title: "Чистая Планета - Главная",
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
            <section className="container-mobile py-8 md:py-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-green-900 mb-4">
                        Вывоз металлолома
                    </h2>
                    <p className="text-lg text-brand-gray-600 max-w-2xl mx-auto">
                        Быстро, удобно, выгодно. Оставьте заявку, и мы приедем в удобное для вас время.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <FeatureCard
                        icon={<Clock className="h-8 w-8" />}
                        title="Быстро"
                        description="Приедем в течение 24 часов после заявки"
                    />
                    <FeatureCard
                        icon={<MapPin className="h-8 w-8" />}
                        title="Удобно"
                        description="Работаем по всему городу"
                    />
                    <FeatureCard
                        icon={<LeafyGreen className="h-8 w-8" />}
                        title="Экологично"
                        description="Утилизация с заботой о природе"
                    />
                </div>

                {/* Lead Form */}
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-brand-green-900 mb-6 text-center">
                        Оставить заявку
                    </h3>
                    <LeadForm />
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
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
                <div className="text-brand-green-600 mb-4">{icon}</div>
                <h3 className="font-bold text-lg text-brand-green-900 mb-2">{title}</h3>
                <p className="text-brand-gray-600 text-sm">{description}</p>
            </div>
        </div>
    );
}
