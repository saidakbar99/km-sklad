import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';

const MainLayout = ({children, header}) => {
  const navigate = useNavigate();
  const [visibleSidebar, setVisibleSidebar] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('seh_id');
    navigate('/login');
  };

  const menuItems = [
		{
			label: "Seriya nomerlar",
			items: [
				{ 
          label: 'Seriya nomer yaratish', 
          icon: 'pi pi-plus-circle', 
          command: () => navigate('/generation'),
          roles: ['admin', 'seh_brigadir']
        },
				{ 
          label: 'Qidirish', 
          icon: 'pi pi-barcode', 
          command: () => navigate('/generated'),
          roles: ['admin', 'seh_brigadir']
        },
			],
		},
		{
			label: "Nakladnoylar",
			items: [
				{ 
          label: 'Nakladnoy yaratish', 
          icon: 'pi pi-plus-circle', 
          command: () => navigate('/invoice-creation'),
          roles: ['admin', 'seh_brigadir']
        },
				{ 
          label: 'Qidirish', 
          icon: 'pi pi-receipt', 
          command: () => navigate('/invoice'),
          roles: ['admin', 'seh_brigadir']
        },
        { 
          label: 'Tarix', 
          icon: 'pi pi-history', 
          command: () => navigate('/invoice-history'),
          roles: ['admin', 'seh_brigadir']
        },
			],
		},
    {
			label: "Sklad",
			items: [
				{ 
          label: 'Qabul qilish', 
          icon: 'pi pi-plus-circle', 
          command: () => navigate('/recieve'),
          roles: ['admin', 'sklad_rahbari']
        },
				{ 
          label: 'Остаток', 
          icon: 'pi pi-receipt', 
          command: () => navigate('/balance'),
          roles: ['admin', 'sklad_rahbari']
        },
        { 
          label: 'Отгрузка', 
          icon: 'pi pi-truck', 
          command: () => navigate('/release'), 
          roles: ['admin', 'sklad_rahbari', 'security']
        },
			],
		},
	];
  
  const userRole = sessionStorage.getItem('role');
  const filteredMenuItems = menuItems
    .map(route => ({
      ...route,
      items: route.items.filter(item => item.roles.includes(userRole))
    }))
    .filter(route => route.items.length > 0); 

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
          // model={menuItems}
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
