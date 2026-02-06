const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'testmybaby-production.up.railway.app'; // Remplacer par l'URL de production

class Api {
    async get(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`);
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Erreur HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    }

    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Erreur HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    }

    async put(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `Erreur HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API PUT Error:', error);
            throw error;
        }
    }
}

export const api = new Api();
