import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // Check database connection (placeholder)
        // In production, you might want to ping the database or check other services

        return NextResponse.json(
            {
                status: 'ok',
                timestamp: new Date().toISOString(),
                service: 'clean-planet-frontend',
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
