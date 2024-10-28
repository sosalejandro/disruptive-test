import axiosInstance from './axiosInstance';

export const createContent = async (content: {
  title: string;
  description: string;
  categoryId: string;
  topicId: string;
  type: string;
  credits: string;
}) => {
  try {
    const response = await axiosInstance.post('/content', content);
    return response.data;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};