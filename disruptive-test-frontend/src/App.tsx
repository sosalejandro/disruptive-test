import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import HomePage from './pages/HomePage';
import CategoryListPage from './pages/CategoryListPage';
import CategoryCreatePage from './pages/CategoryCreatePage';
import CategoryEditPage from './pages/CategoryEditPage';
import TopicsPage from './pages/TopicsPage';
import { CategoryProvider } from './context/CategoryContext';

const PrivateRoute = ({ element, ...rest }: any) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CategoryProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route path="/categories" element={<PrivateRoute element={<CategoryListPage />} />} />
            <Route path="/categories/create" element={<PrivateRoute element={<CategoryCreatePage />} />} />
            <Route path="/categories/edit/:id" element={<PrivateRoute element={<CategoryEditPage />} />} />
            <Route path="/topics" element={<PrivateRoute element={<TopicsPage />} />} />
          </Routes>
        </Router>
      </CategoryProvider>
    </AuthProvider>
  );
};

export default App;