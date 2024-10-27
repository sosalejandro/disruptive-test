import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCategories } from '../api/categories';
import { Category } from '../enums/domain.enums';

interface CategoryContextProps {
  categories: Category[];
  fetchCategories: () => void;
}

export const CategoryContext = createContext<CategoryContextProps>({
  categories: [],
  fetchCategories: () => {},
});

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};