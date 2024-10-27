import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { AuthContext } from '../context/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { access_token } = await loginUser({ email, password });
      login(access_token);
      navigate('/');
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;