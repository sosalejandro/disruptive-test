import '../styles/CategoryList.css';
import React, { useEffect, useState, useContext } from 'react';
import { getCategories, deleteCategory } from '../api/categories';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CategoryCard from './CategoryCard';
import { Category } from '../enums/domain.enums';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div>
      <h1>Categories</h1>
      {isAuthenticated && user?.role === 'ADMIN' && (
        <Link to="/categories/create">Create New Category</Link>
      )}
      <div className="category-list">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            imageUrl={category.coverImage || ''}
            title={category.name}
            type={category.type}
            isAdmin={isAuthenticated && user?.role === 'ADMIN'}
            onEdit={() => window.location.href = `/categories/edit/${category.id}`}
            onDelete={() => handleDelete(category.id!)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;