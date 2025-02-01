import React from "react";
import { useNavigate } from "react-router-dom";

const MainLayout = ({children, header}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="font-hyundai">
      <div className="flex bg-blue text-white p-4 text-center items-center">
        <h1 className="w-full text-3xl font-bold">
          {header}
        </h1>
        <button onClick={handleLogout} className="border rounded-lg p-2">Chiqish</button>
      </div>
      <div className="px-4 pt-8">
        {children}
      </div>
    </div>
    
  );
};

export default MainLayout;
