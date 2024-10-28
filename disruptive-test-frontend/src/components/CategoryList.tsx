import '../styles/CategoryList.css';
import React, { useContext } from 'react';
import { deleteCategory } from '../api/categories';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCategories } from '../context/CategoryContext';
import CategoryCard from './CategoryCard';

const CategoryList: React.FC = () => {
  const { categories, loading, error, setCategories } = useCategories();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

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
            onEdit={() => navigate(`/categories/edit/${category.id}`)}
            onDelete={() => handleDelete(category.id!)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;