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
      toast.error('Login va parolni kiriting');
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
      if (err.status === 403) {
        toast.error('Login yoki parol noto‘g‘ri');
      } else {
        toast.error('Server xatosi, keyinroq urinib ko‘ring');
      }
    }
  };

  const searchUsers = async (event) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users?search=${event.query}`);
      setFilteredUsers(response.data.users.map(user => user.username));
    } catch (err) {
      toast.error("Xatolik yuz berdi")
      console.error("Error fetching users", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue">
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
            <AutoComplete
              id="username"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue focus:border-blue"
              inputClassName='w-full'
              placeholder="Login kiriting"
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
              className="w-full px-4 py-2 mt-8 text-white rounded-md bg-blue hover:bg-opacity-90"
            >
              Kirish
            </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
