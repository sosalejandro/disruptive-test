import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getCategories, getCategoryById } from '../api/categories';
import { Category } from '../enums/domain.enums';

interface CategoryContextProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  updateCategory: (category: Category) => void;
}

const CategoryContext = createContext<CategoryContextProps | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (err) {
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const updateCategory = (updatedCategory: Category) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  return (
    <CategoryContext.Provider value={{ categories, loading, error, setCategories, updateCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextProps => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};