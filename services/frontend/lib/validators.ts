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
        .optional()
        .refine((val) => !val || val.length >= 5, {
            message: 'Адрес должен содержать минимум 5 символов'
        })
        .transform((val) => val || ''),

    description: z.string()
        .optional()
        .transform((val) => val || ''),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
