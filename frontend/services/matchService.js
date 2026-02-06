import { api } from './api.js';

export const matchService = {
    getAllMatches: async () => {
        return await api.get('/matches');
    },
    getMatchById: async (id) => {
        return await api.get(`/matches/${id}`);
    },
    createMatch: async (data) => {
        return await api.post('/matches', data);
    },
    validateMatch: async (id, data) => {
        return await api.put(`/matches/${id}/result`, data);
    },
    updateResult: async (id, result) => {
        return await api.put(`/matches/${id}/result`, result);
    }
};
