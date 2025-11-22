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

export const getStocks = async () => {
    const response = await fetch(`${API_URL}/stocks`);
    if (!response.ok) {
        throw new Error(`Error fetching stocks: ${response.status} ${response.statusText}`);
    }
    return await response.json();
};

export const updateStock = async (stock) => {
    try {
        const response = await fetch(`${API_URL}/stocks/${stock.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stock),
        });

        if (!response.ok) {
            throw new Error('Error updating stock');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const addStock = async (stock) => {
    try {
        const response = await fetch(`${API_URL}/stocks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stock),
        });

        if (!response.ok) {
            throw new Error('Error adding stock');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const deleteStock = async (stockId) => {
    try {
        const response = await fetch(`${API_URL}/stocks/${stockId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error deleting stock');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const fetchStockPrice = async (ticker) => {
    const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

    // If no key is set or it's the placeholder, return null
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.warn('Finnhub API key is not set. Please add VITE_FINNHUB_API_KEY to your .env file');
        return null;
    }

    try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`);

        if (!response.ok) {
            throw new Error('Error fetching stock price from Finnhub');
        }

        const data = await response.json();
        return data.c;
    } catch (error) {
        console.error('Finnhub API Error:', error);
        return null;
    }
};
