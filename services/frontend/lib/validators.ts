import { z } from 'zod';

// Lead form validation schema
export const leadFormSchema = z.object({
    name: z.string()
        .min(2, 'Имя должно содержать минимум 2 символа')
        .max(100, 'Имя слишком длинное'),

    phoneNumber: z.string()
        .regex(/^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/,
            'Некорректный номер телефона. Пример: +7 (999) 123-45-67'),

    address: z.string()
        .min(5, 'Адрес должен содержать минимум 5 символов')
        .max(500, 'Адрес слишком длинный')
        .optional(),

    description: z.string()
        .max(1000, 'Описание слишком длинное')
        .optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
