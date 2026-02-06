import { api } from './api.js';

export const userService = {
    getAllUsers: async () => {
        return await api.get('/ranking'); // Use ranking for sorted list
    },
    getUserById: async (id) => {
        return await api.get(`/users/${id}`);
    },
    getProfile: async (id) => {
        return await api.get(`/users/${id}/profile`);
    },
    register: async (data) => {
        return await api.post('/auth/register', data);
    },
    login: async (email, password) => {
        return await api.post('/auth/login', { email, password });
    }
};
