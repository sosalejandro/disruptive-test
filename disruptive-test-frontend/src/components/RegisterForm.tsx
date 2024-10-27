import React, { useState } from 'react';
import { registerUser } from '../api/users';
import { UserType } from '../enums/domain.enums';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>(UserType.READER);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }
    setEmailError('');
    try {
      await registerUser({ username, email, password, userType });
      alert('User registered successfully');
    } catch (error) {
      alert('Error registering user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>User Type:</label>
        <select value={userType} onChange={(e) => setUserType(e.target.value as UserType)}>
          {Object.values(UserType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;