import { NextRequest, NextResponse } from 'next/server';
import { leadFormSchema } from '@/lib/validators';
import { createLead } from '@/lib/espo';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = req.headers.get('x-forwarded-for') ||
            req.headers.get('x-real-ip') ||
            'unknown';

        // Rate limiting
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                {
                    error: 'Слишком много запросов. Попробуйте позже.',
                    code: 'RATE_LIMIT_EXCEEDED'
                },
                { status: 429 }
            );
        }

        // Parse and validate request body
        const body = await req.json();
        const validatedData = leadFormSchema.parse(body);

        // Create lead in EspoCRM
        const lead = await createLead(validatedData);

        return NextResponse.json({
            success: true,
            leadId: lead.id,
            message: 'Заявка успешно создана. Мы свяжемся с вами в ближайшее время.'
        });

    } catch (error) {
        console.error('Lead creation error:', error);

        // Handle validation errors
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json(
                {
                    error: 'Неверные данные формы',
                    code: 'VALIDATION_ERROR',
                    details: error.message
                },
                { status: 400 }
            );
        }

        // Handle other errors
        return NextResponse.json(
            {
                error: 'Ошибка создания заявки. Пожалуйста, попробуйте позже.',
                code: 'INTERNAL_ERROR'
            },
            { status: 500 }
        );
    }
}
