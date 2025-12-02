'use client';

import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, AlertCircle, User, Phone, MapPin, FileText } from 'lucide-react';

export function LeadForm() {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Автокапитализация имени
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Разрешаем только буквы и пробелы
        value = value.replace(/[^а-яёА-ЯЁa-zA-Z\s]/g, '');

        // Капитализация каждого слова
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка отправки заявки');
            }

            setStatus('success');
            setFormData({
                name: '',
                phoneNumber: '',
                address: '',
                description: '',
            });

            setTimeout(() => {
                setStatus('idle');
            }, 5000);

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
            <div className="flex flex-col items-center justify-center text-center p-6">
                <CheckCircle2 className="h-16 w-16 text-brand-green-600 mb-4" />
                <h3 className="text-xl font-bold text-brand-green-900 mb-2">
                    Заявка отправлена!
                </h3>
                <p className="text-brand-gray-600 mb-4">
                    Спасибо! Мы свяжемся с вами в ближайшее время.
                </p>
                <Button
                    onClick={() => setStatus('idle')}
                    variant="outline"
                    className="btn-touch"
                >
                    Отправить еще одну заявку
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name" className="text-brand-gray-700 font-medium">Имя и Фамилия *</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-400" />
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Иван Иванов"
                        value={formData.name}
                        onChange={handleNameChange}
                        required
                        disabled={isSubmitting}
                        className="input-mobile pl-10 border-brand-gray-200 focus:border-brand-green-500 focus:ring-brand-green-500"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-brand-gray-700 font-medium">Телефон *</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-400" />
                    <InputMask
                        mask="+7 (999) 999-99-99"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        disabled={isSubmitting}
                    >
                        {(inputProps: any) => (
                            <Input
                                {...inputProps}
                                id="phoneNumber"
                                type="tel"
                                placeholder="+7 (999) 123-45-67"
                                required
                                className="input-mobile pl-10 border-brand-gray-200 focus:border-brand-green-500 focus:ring-brand-green-500"
                            />
                        )}
                    </InputMask>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-brand-gray-700 font-medium">Адрес</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-400" />
                    <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Улица, дом, подъезд..."
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        disabled={isSubmitting}
                        className="input-mobile pl-10 border-brand-gray-200 focus:border-brand-green-500 focus:ring-brand-green-500"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-brand-gray-700 font-medium">Что нужно вывезти?</Label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 h-5 w-5 text-brand-gray-400" />
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Например: старая ванна, батареи, холодильник..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        disabled={isSubmitting}
                        rows={3}
                        className="text-base resize-none pl-10 border-brand-gray-200 focus:border-brand-green-500 focus:ring-brand-green-500 min-h-[100px]"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-touch bg-brand-green-600 hover:bg-brand-green-700 text-white font-semibold shadow-lg shadow-brand-green-600/20 transition-all hover:shadow-brand-green-600/40 hover:-translate-y-0.5"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Отправка...
                    </>
                ) : (
                    'Отправить заявку'
                )}
            </Button>

            <p className="text-xs text-brand-gray-400 text-center leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности и обработки данных
            </p>
        </form>
    );
}
