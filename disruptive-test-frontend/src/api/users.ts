import { UserType } from '../enums/domain.enums';
import axiosInstance from './axiosInstance';

export const registerUser = async (registerData: { username: string; email: string; password: string; userType: UserType }) => {
  const response = await axiosInstance.post('/users/register', registerData);
  return response.data;
};