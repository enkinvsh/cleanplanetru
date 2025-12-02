'use client';

import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { Phone, Clock, MapPin, Scale, Shield, Truck, Leaf, Zap, Droplet, Cpu, CheckCircle2, AlertCircle, Loader2, User, FileText } from 'lucide-react';

const serviceCategories = [
    {
        id: 'metal',
        name: 'Металл',
        icon: Scale,
        active: true,
        gradient: 'from-slate-700 to-slate-800'
    },
    {
        id: 'tires',
        name: 'Шины',
        icon: Truck,
        active: false,
        gradient: 'from-slate-600 to-slate-700'
    },
    {
        id: 'oil',
        name: 'Масло',
        icon: Droplet,
        active: false,
        gradient: 'from-amber-700 to-amber-800'
    },
    {
        id: 'tech',
        name: 'Электроника',
        icon: Cpu,
        active: false,
        gradient: 'from-blue-700 to-blue-800'
    },
];

const features = [
    { icon: Clock, text: 'За 24 часа', color: 'from-emerald-500 to-emerald-600' },
    { icon: Shield, text: 'Честные весы', color: 'from-blue-500 to-blue-600' },
    { icon: Truck, text: 'Свой транспорт', color: 'from-purple-500 to-purple-600' },
    { icon: Leaf, text: 'Легально', color: 'from-green-500 to-green-600' },
];

export default function HomePageContent() {
    const [activeCategory, setActiveCategory] = useState('metal');
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/[^а-яёА-ЯЁa-zA-Z\s]/g, '');
        value = value
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        setFormData(prev => ({ ...prev, name: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка отправки заявки');
            }

            setStatus('success');
            setFormData({ name: '', phoneNumber: '', address: '', description: '' });

            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            setStatus('error');
            setErrorMessage(
                error instanceof Error ? error.message : 'Произошла ошибка. Попробуйте позже.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#e0e0d8' }}>
                <div className="text-center max-w-sm w-full">
                    <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/30">
                        <CheckCircle2 className="h-14 w-14 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
                        Заявка принята!
                    </h2>
                    <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                        Менеджер свяжется с вами в течение 5 минут
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="w-full py-4 bg-white/80 backdrop-blur hover:bg-white text-slate-900 font-semibold rounded-2xl transition-all active:scale-95 shadow-lg border border-white/50"
                    >
                        Отправить ещё заявку
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full" style={{ background: '#e0e0d8' }}>
            <div className="max-w-md mx-auto min-h-screen bg-[#e0e0d8] shadow-2xl relative">
                {/* Header */}
                <header className="bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50">
                    <div className="px-5 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Leaf className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-slate-900 leading-none">Чистая Планета</h1>
                                    <p className="text-xs text-emerald-700 leading-none mt-1">Агрегатор утилизации</p>
                                </div>
                            </div>
                            <a
                                href="tel:+79999999999"
                                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/25"
                            >
                                <Phone className="h-4 w-4" />
                                <span>Звонок</span>
                            </a>
                        </div>
                    </div>
                </header>

                {/* Categories */}
                <div className="px-5 py-4">
                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                        {serviceCategories.map((category) => {
                            const Icon = category.icon;
                            const isActive = activeCategory === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => category.active && setActiveCategory(category.id)}
                                    disabled={!category.active}
                                    className={`
                    flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 whitespace-nowrap shadow-md
                    ${isActive
                                            ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                                            : category.active
                                                ? 'bg-white/70 backdrop-blur text-slate-700 hover:bg-white'
                                                : 'bg-white/40 text-slate-400 cursor-not-allowed opacity-60'
                                        }
                  `}
                                >
                                    <Icon className="h-4.5 w-4.5" />
                                    <span>{category.name}</span>
                                    {!category.active && (
                                        <span className="text-xs">скоро</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <main className="px-5 pb-8">
                    {/* Hero */}
                    <div className="mb-6">
                        <h2 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">
                            Вывезем металлолом
                            <span className="block text-slate-600 text-3xl mt-1.5">дорого и быстро</span>
                        </h2>
                        <p className="text-slate-600 text-base leading-relaxed">
                            Приедем за 24 часа. Цены уточняйте у оператора.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {features.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white/70 backdrop-blur border border-white/50 rounded-3xl p-4 shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900 leading-snug">{item.text}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Eco Badge */}
                    <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur border border-emerald-200/50 rounded-3xl p-5 mb-6 shadow-lg">
                        <div className="flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-base mb-1.5">Легальная утилизация</h4>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    Весь металлолом отправляется на сертифицированные заводы. Все документы в порядке.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            Оставить заявку
                        </h3>
                        <p className="text-slate-600 text-sm mb-6">
                            Перезвоним в течение 5 минут
                        </p>

                        <div className="space-y-4">
                            {status === 'error' && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800 leading-relaxed">{errorMessage}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Имя и Фамилия *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Иван Иванов"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        required
                                        disabled={isSubmitting}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200/50 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Телефон *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <InputMask
                                        mask="+7 (999) 999-99-99"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                        disabled={isSubmitting}
                                    >
                                        {(inputProps: any) => (
                                            <input
                                                {...inputProps}
                                                type="tel"
                                                placeholder="+7 (999) 123-45-67"
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200/50 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base shadow-sm"
                                            />
                                        )}
                                    </InputMask>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Адрес
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Улица, дом, подъезд"
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        disabled={isSubmitting}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200/50 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-base shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Что нужно вывезти?
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                    <textarea
                                        placeholder="Например: старая ванна, батареи..."
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        disabled={isSubmitting}
                                        rows={3}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 border border-slate-200/50 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-base shadow-sm"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:from-emerald-800 active:to-emerald-900 text-white font-bold rounded-2xl transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-base shadow-xl shadow-emerald-600/25"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Отправка...
                                    </>
                                ) : (
                                    'Отправить заявку'
                                )}
                            </button>

                            <p className="text-xs text-slate-500 text-center leading-relaxed pt-1">
                                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
