import React, { useContext } from 'react';
import CategoryList from '../components/CategoryList';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CategoryListPage: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Category List</h1>
      {/* {user?.role === 'ADMIN' && <Link to="/categories/create">Create New Category</Link>} */}
      <CategoryList />
    </div>
  );
};

export default CategoryListPage;