import { TextCursor } from 'lucide-react';
import { axiosInstance } from './axious.js';

export const signup = async (signupData) => {
    const response = await axiosInstance.post('/auth/signup', signupData);
    return response.data;
}

export const getAuthUser = async () => {
    try {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching auth user:', error);
        return null;
    }
}