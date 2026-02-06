import { api } from './api.js';

export const babyfootService = {
    getAllBabyfoots: async () => {
        return await api.get('/babyfoots');
    },
    getAllLieux: async () => {
        return await api.get('/babyfoots/lieux');
    },
    getBabyfootById: async (id) => {
        return await api.get(`/babyfoots/${id}`);
    },
    createBabyfoot: async (data) => {
        return await api.post('/babyfoots', data);
    },
    getModels: async () => {
        try {
            return await api.get('/babyfoots/modeles');
        } catch (e) {
            console.warn('Pas de route modeles, fallback local');
            return [];
        }
    }
};
