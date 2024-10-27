import React from 'react';
import CategoryForm from '../components/CategoryForm';
import { useNavigate } from 'react-router-dom';

const CategoryCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/categories');
  };

  return (
    <div>
      <h1>Create Category</h1>
      <CategoryForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CategoryCreatePage;