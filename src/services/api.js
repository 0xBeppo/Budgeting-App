const API_URL = 'http://localhost:3001';

export const getFinancialData = async () => {
    try {
        const [assetsResponse, liabilitiesResponse] = await Promise.all([
            fetch(`${API_URL}/assets`),
            fetch(`${API_URL}/liabilities`)
        ]);

        if (!assetsResponse.ok || !liabilitiesResponse.ok) {
            throw new Error('Error fetching data');
        }

        const assets = await assetsResponse.json();
        const liabilities = await liabilitiesResponse.json();

        return {
            assets,
            liabilities
        };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
