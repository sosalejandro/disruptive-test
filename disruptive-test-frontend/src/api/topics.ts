import { AssignCategoriesDto, CreateTopicDto, Topic } from '../enums/domain.enums';
import axiosInstance from './axiosInstance';

const API_URL = '/topics';

export const getTopics = async (): Promise<Topic[]> => {
  const response = await axiosInstance.get(API_URL);
  return response.data;
};

export const createTopic = async (data: CreateTopicDto): Promise<Topic> => {
  const response = await axiosInstance.post(API_URL, data);
  return response.data;
};

export const assignCategoriesToTopic = async (id: string, data: AssignCategoriesDto): Promise<void> => {
  await axiosInstance.post(`${API_URL}/${id}/categories`, data);
};

export const searchTopicsByName = async (name: string): Promise<Topic[]> => {
  const response = await axiosInstance.get(`${API_URL}/search`, { params: { name } });
  return response.data;
};