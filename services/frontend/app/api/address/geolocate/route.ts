import { NextRequest, NextResponse } from 'next/server';

const DADATA_API_KEY = process.env.NEXT_PUBLIC_DADATA_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { lat, lon } = body;

        if (!lat || !lon) {
            return NextResponse.json(
                { error: 'Latitude and longitude are required' },
                { status: 400 }
            );
        }

        const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${DADATA_API_KEY}`,
            },
            body: JSON.stringify({ lat, lon, count: 1 }),
        });

        if (!response.ok) {
            throw new Error(`DaData API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Geolocate error:', error);
        return NextResponse.json(
            { error: 'Failed to geolocate address' },
            { status: 500 }
        );
    }
}
