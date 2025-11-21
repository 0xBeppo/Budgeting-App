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

export const updateCategory = async (type, category) => {
    try {
        const response = await fetch(`${API_URL}/${type}/${category.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        });

        if (!response.ok) {
            throw new Error('Error updating category');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getMonthlyBudget = async () => {
    try {
        const response = await fetch(`${API_URL}/monthlyBudget`);
        if (!response.ok) {
            throw new Error('Error fetching monthly budget');
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const updateMonthlyBudget = async (data) => {
    try {
        const response = await fetch(`${API_URL}/monthlyBudget`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error updating monthly budget');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
