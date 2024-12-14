"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../utils/api'

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const success = await login({ email, password });
      if (success) {
        router.push('/dashboard');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;