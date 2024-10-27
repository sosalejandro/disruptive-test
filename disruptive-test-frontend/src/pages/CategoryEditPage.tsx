import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';

const CategoryEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/categories');
  };

  return (
    <div>
      <h1>Edit Category</h1>
      <CategoryForm categoryId={id} onSuccess={handleSuccess} />
    </div>
  );
};

export default CategoryEditPage;