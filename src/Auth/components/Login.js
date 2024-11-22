import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(userId, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="사용자 ID"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        required
      />
      <button type="submit">로그인</button>
    </form>
  );
};

export default Login;