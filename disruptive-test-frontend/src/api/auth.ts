import axiosInstance from './axiosInstance';

export const loginUser = async (loginData: { email: string; password: string }) => {
    const response = await axiosInstance.post('/auth/login', loginData);
    return response.data;
};