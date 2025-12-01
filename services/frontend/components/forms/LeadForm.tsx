'use client';

import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';

// Yandex Geocoder API types
interface YandexGeocoderResponse {
    response: {
        GeoObjectCollection: {
            featureMember: Array<{
                GeoObject: {
                    name: string;
                    description: string;
                    Point: {
                        pos: string;
                    };
                };
            }>;
        };
    };
}

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
    const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Debounce для поиска адреса
    useEffect(() => {
        if (formData.address.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        const timer = setTimeout(() => {
            searchAddress(formData.address);
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.address]);

    // Поиск адреса через Yandex Suggest API
    const searchAddress = async (query: string) => {
        if (!query || query.length < 3) return;

        try {
            const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
            // Используем Suggest API для автоподстановки
            const url = `https://suggest-maps.yandex.ru/v1/suggest?apikey=${apiKey}&text=${encodeURIComponent(query)}&results=5&types=house,street`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.results && Array.isArray(data.results)) {
                const suggestions = data.results.map((item: any) =>
                    item.title?.text || item.subtitle?.text || item.text
                ).filter(Boolean);

                setAddressSuggestions(suggestions);
                setShowSuggestions(suggestions.length > 0);
            }
        } catch (error) {
            console.error('Address search error:', error);
            setAddressSuggestions([]);
        }
    };

    // Получение адреса по геолокации
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Геолокация не поддерживается вашим браузером');
            return;
        }

        setIsLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
                    // Geocoder для обратного геокодирования (координаты → адрес)
                    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${longitude},${latitude}&format=json&kind=house&results=1`;

                    const response = await fetch(url);

                    if (!response.ok) {
                        throw new Error('Ошибка API Яндекс.Карт');
                    }

                    const data: YandexGeocoderResponse = await response.json();

                    const geoObject = data.response.GeoObjectCollection.featureMember[0]?.GeoObject;
                    if (geoObject) {
                        const address = geoObject.name;
                        setFormData(prev => ({ ...prev, address }));
                    } else {
                        alert('Адрес не найден. Попробуйте ввести вручную.');
                    }
                } catch (error) {
                    console.error('Reverse geocode error:', error);
                    alert('Не удалось определить адрес. Проверьте подключение к интернету.');
                } finally {
                    setIsLoadingLocation(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Не удалось получить координаты. ';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Вы запретили доступ к геолокации. Разрешите доступ в настройках браузера.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Информация о местоположении недоступна.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Превышено время ожидания.';
                        break;
                    default:
                        errorMessage += 'Неизвестная ошибка.';
                }

                alert(errorMessage);
                setIsLoadingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

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
        <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Имя и Фамилия *</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    disabled={isSubmitting}
                    className="input-mobile"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Телефон *</Label>
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
                            className="input-mobile"
                        />
                    )}
                </InputMask>
            </div>

            <div className="space-y-2 relative">
                <Label htmlFor="address">Адрес</Label>
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="Начните вводить адрес..."
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            onFocus={() => setShowSuggestions(addressSuggestions.length > 0)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            disabled={isSubmitting}
                            className="input-mobile"
                        />

                        {showSuggestions && addressSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {addressSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, address: suggestion }));
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGetLocation}
                        disabled={isSubmitting || isLoadingLocation}
                        className="btn-touch"
                        title="Определить мое местоположение"
                    >
                        {isLoadingLocation ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <MapPin className="h-5 w-5" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-gray-500">Начните вводить адрес для автоподстановки</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Опишите тип и количество металлолома..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
