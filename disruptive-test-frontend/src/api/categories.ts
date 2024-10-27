import axiosInstance from './axiosInstance';
import { Category } from '../enums/domain.enums';

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (category: Category): Promise<Category> => {
  const response = await axiosInstance.post('/categories', category);
  return response.data;
};

export const updateCategory = async (id: string, category: Category): Promise<Category> => {
  const response = await axiosInstance.patch(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`);
};