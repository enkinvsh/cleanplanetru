const ESPO_API_URL = process.env.ESPO_API_URL;
const ESPO_API_KEY = process.env.ESPO_API_KEY;

if (!ESPO_API_URL || !ESPO_API_KEY) {
    console.warn('EspoCRM environment variables not configured');
}

interface LeadData {
    name: string;
    phoneNumber: string;
    address?: string;
    description?: string;
}

interface EspoLead {
    id: string;
    name: string;
    phoneNumber: string;
    [key: string]: unknown;
}

export async function createLead(data: LeadData): Promise<EspoLead> {
    if (!ESPO_API_URL || !ESPO_API_KEY) {
        throw new Error('EspoCRM not configured');
    }

    try {
        const response = await fetch(`${ESPO_API_URL}/api/v1/Lead`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': ESPO_API_KEY,
            },
            body: JSON.stringify({
                name: data.name,
                phoneNumber: data.phoneNumber,
                addressStreet: data.address || '',
                description: data.description || '',
                status: 'New',
                source: 'Website',
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`EspoCRM API error: ${response.status} - ${errorText}`);
        }

        const lead = await response.json();
        return lead as EspoLead;

    } catch (error) {
        console.error('Failed to create lead in EspoCRM:', error);
        throw error;
    }
}

export async function getLead(id: string): Promise<EspoLead | null> {
    if (!ESPO_API_URL || !ESPO_API_KEY) {
        throw new Error('EspoCRM not configured');
    }

    try {
        const response = await fetch(`${ESPO_API_URL}/api/v1/Lead/${id}`, {
            headers: {
                'X-Api-Key': ESPO_API_KEY,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`EspoCRM API error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch lead from EspoCRM:', error);
        throw error;
    }
}
