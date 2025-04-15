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
      toast.error('Логин ва парольни киритинг');
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
        toast.error('Логин йоки пароль нотогри');
      } else {
        toast.error('Сервер хатоси, кейинрок кириб коринг');
      }
    }
  };

  const searchUsers = async (event) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users?search=${event.query}`);
      setFilteredUsers(response.data.users.map(user => user.username));
    } catch (err) {
      toast.error("Хатолик юз берди")
      console.error("Error fetching users", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-blue">
          Логин
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
              placeholder="Логин киритинг"
              value={username}
              onChange={(e) => setUsername(e.value)}
              suggestions={filteredUsers}
              completeMethod={searchUsers}
              dropdown
            />
          </div>
          <div>
            <label
              htmlFor="Пароль"
              className="text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue focus:border-blue"
              placeholder="Пароль киритинг"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue rounded-md hover:bg-opacity-90 mt-8"
            >
              Кириш
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
