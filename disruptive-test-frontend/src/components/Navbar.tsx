import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {isAuthenticated && (
          <>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/topics">Topics</Link></li>
          </>
        )}
        {!isAuthenticated ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <li><button onClick={logout}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;