import { useState } from 'react';
import { useNavigate  } from "react-router-dom";
import { toast } from 'react-toastify';
import { login } from '../api/api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      const { access_token } = response.data.data;
      localStorage.setItem('token', access_token);
      navigate('/');
    } catch (err) {
      toast.error('Notog‘ri login yoki parol terilgan')
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#002A50]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-[#002A50]">
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
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-[#002A50] focus:border-[#002A50]"
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
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-[#002A50] focus:border-[#002A50]"
              placeholder="Parol kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-[#002A50] rounded-md hover:bg-opacity-90 mt-8"
            >
              Kirish
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
