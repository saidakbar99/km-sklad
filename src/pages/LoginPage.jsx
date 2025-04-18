import { useState, useEffect } from 'react';
import { useNavigate  } from "react-router-dom";
import { toast } from 'react-toastify';
import { roleRedirects } from '../components/ProtectedRoute';
import axiosInstance from '../api/axios';
import { AutoComplete } from 'primereact/autocomplete';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (token && role) {
      navigate(roleRedirects[role]);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Введите логин и пароль');
      return;
    }

    try {
      const response = await axiosInstance.post(`/api/login`, { username, password })
      const { token, user } = response.data;

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('seh_id', user.seh_id);
      sessionStorage.setItem('role', user.role.name);
      
      navigate(roleRedirects[user.role.name]);
      // navigate('/invoice-creation')
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Логин или пароль неверный');
      } else {
        toast.error('Ошибка сервера, попробуйте позже');
      }
    }
  };

  const searchUsers = async (event) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users?search=${event.query}`);
      setFilteredUsers(response.data.users.map(user => user.username));
    } catch (err) {
      toast.error("Произошла ошибка")
      console.error("Error fetching users", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-blue">
          Вход 
        </h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Логин
            </label>
            <AutoComplete
              id="username"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue focus:border-blue"
              inputClassName='w-full'
              placeholder="Введите логин"
              value={username}
              onChange={(e) => setUsername(e.value)}
              suggestions={filteredUsers}
              completeMethod={searchUsers}
              dropdown
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue focus:border-blue"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
            <button
              type="submit"
              className="w-full px-4 py-2 mt-8 text-white rounded-md bg-blue hover:bg-opacity-90"
            >
              Войти
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
