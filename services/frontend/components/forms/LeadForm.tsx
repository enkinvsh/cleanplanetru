'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

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

            // Auto-hide success message after 5 seconds
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
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
        <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Имя *</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="input-mobile"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Телефон *</Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="input-mobile"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Адрес</Label>
                <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="г. Москва, ул. Примерная, д. 1"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="input-mobile"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Опишите тип и количество металлолома..."
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={4}
                    className="text-base resize-none"
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-touch bg-brand-green-600 hover:bg-brand-green-700 text-white"
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

            <p className="text-xs text-brand-gray-500 text-center">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
            </p>
        </form>
    );
}
