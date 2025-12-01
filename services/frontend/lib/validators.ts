import { z } from 'zod';

// Lead form validation schema
export const leadFormSchema = z.object({
    name: z.string()
        .min(2, 'Имя должно содержать минимум 2 символа')
        .max(100, 'Имя слишком длинное'),

    phoneNumber: z.string()
        .min(10, 'Номер телефона слишком короткий')
        .regex(/^[\d\s\-\+\(\)]+$/, 'Номер может содержать только цифры, пробелы и символы +-()')
        .refine((val) => {
            const digits = val.replace(/\D/g, '');
            return digits.length >= 10 && digits.length <= 15;
        }, 'Номер должен содержать от 10 до 15 цифр'),

    address: z.string()
        .min(5, 'Адрес должен содержать минимум 5 символов')
        .max(500, 'Адрес слишком длинный')
        .optional(),

    description: z.string()
        .max(1000, 'Описание слишком длинное')
        .optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
