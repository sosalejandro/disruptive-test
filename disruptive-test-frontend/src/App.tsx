import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;