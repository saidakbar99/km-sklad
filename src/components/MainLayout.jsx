import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';

const MainLayout = ({children, header}) => {
  const navigate = useNavigate();
  const [visibleSidebar, setVisibleSidebar] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { 
      label: 'Skladga qabul qilish',
      icon: 'pi pi-warehouse',
      command: () => navigate('/recieve'),
      roles: ['warehouse']
    },
    { 
      label: 'Sklad ostatok', 
      icon: 'pi pi-receipt', 
      command: () => navigate('/balance'),
      roles: ['warehouse']
    },
    { 
      label: 'Отгрузка', 
      icon: 'pi pi-truck', 
      command: () => navigate('/release'), 
      roles: ['security']
    },
    { 
      label: 'Seriya nomerlar', 
      icon: 'pi pi-barcode', 
      command: () => navigate('/generated'),
      roles: ['warehouse']
    },
    { 
      label: 'Seriya nomer yaratish', 
      icon: 'pi pi-plus-circle', 
      command: () => navigate('/generation'),
      roles: ['warehouse']
    },
  ];
  
  const userRole = localStorage.getItem('role');
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="font-hyundai">
      <div className="flex bg-blue text-white p-4 text-center items-center">
        <Button 
          icon="pi pi-bars" 
          className="ml-4 p-2 text-white" 
          onClick={() => setVisibleSidebar(true)} 
        />
        <h1 className="w-full text-3xl font-bold">
          {header}
        </h1>
        <button onClick={handleLogout} className="border rounded-lg p-2">Chiqish</button>
        
      </div>

      <Sidebar 
        visible={visibleSidebar} 
        onHide={() => setVisibleSidebar(false)}
      >
        <Menu 
          model={filteredMenuItems}
          className="w-full"
        />
      </Sidebar>

      <div className="px-4 pt-8">
        {children}
      </div>
    </div>
    
  );
};

export default MainLayout;
