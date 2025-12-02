import { NextRequest, NextResponse } from 'next/server';

const DADATA_API_KEY = process.env.NEXT_PUBLIC_DADATA_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query || query.length < 3) {
            return NextResponse.json({ suggestions: [] });
        }

        const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${DADATA_API_KEY}`,
            },
            body: JSON.stringify({ query, count: 5 }),
        });

        if (!response.ok) {
            throw new Error(`DaData API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Address suggest error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch address suggestions' },
            { status: 500 }
        );
    }
}
