import { useState, useEffect } from 'react';
import { useNavigate  } from "react-router-dom";
import { toast } from 'react-toastify';
import { roleRedirects } from '../components/ProtectedRoute';
import axiosInstance from '../api/axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      navigate(roleRedirects[role]);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Login va parolni kiriting');
      return;
    }

    try {
      const response = await axiosInstance.post(`/auth/login`, { username, password })
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('seh_id', user.seh_id);
      // localStorage.setItem('role', user.role_id);
      localStorage.setItem('role', 'seh_brigadir');

      // navigate(roleRedirects[role]);
      // navigate(roleRedirects['warehouse']);
      navigate('/invoice')
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Login yoki parol noto‘g‘ri');
      } else {
        toast.error('Server xatosi, keyinroq urinib ko‘ring');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-blue">
          Login
        </h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Login
            </label>
            <input
              type="username"
              id="username"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue focus:border-blue"
              placeholder="Login kiriting"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue focus:border-blue"
              placeholder="Parol kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue rounded-md hover:bg-opacity-90 mt-8"
            >
              Kirish
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
