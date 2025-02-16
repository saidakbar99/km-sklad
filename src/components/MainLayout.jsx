import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Sidebar} from "primereact/sidebar";
import {Menu} from "primereact/menu";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";

const MainLayout = ({children, header}) => {
	const navigate = useNavigate();
	const [visibleSidebar, setVisibleSidebar] = useState(false);
	const toast2 = useRef(null);

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	const menuItems = [
		{
			label: "Skladga qabul qilish",
			icon: "pi pi-warehouse",
			command: () => navigate("/recieve"),
			roles: ["warehouse"],
		},
		{
			label: "Sklad ostatok",
			icon: "pi pi-receipt",
			command: () => navigate("/balance"),
			roles: ["warehouse"],
		},
		{
			label: "Отгрузка",
			icon: "pi pi-truck",
			command: () => navigate("/release"),
			roles: ["security"],
		},
		{
			label: "Seriya nomerlar",
			icon: "pi pi-barcode",
			command: () => navigate("/generated"),
			roles: ["warehouse"],
		},
		{
			label: "Seriya nomer yaratish",
			icon: "pi pi-plus-circle",
			command: () => navigate("/generation"),
			roles: ["warehouse"],
		},
	];

	const items = [
		{
			label: "Seriya nomerlar",
			items: [
				{
					label: "Seriya namer yaratish",
					icon: "pi pi-plus",
					command: () => navigate(`/generation`),
				},
				{
					label: "Qidirish",
					icon: "pi pi-search",
					command: () => navigate(`/generated`),
				},
			],
		},
		{
			label: "Nakladnoylar",
			items: [
				{
					label: "Nakladnoy yaratish",
					icon: "pi pi-plus",
					command: () => navigate(`/invoice-creation`),
				},
				{
					label: "Qidirish",
					icon: "pi pi-search",
					command: () => navigate(`/invoice`),
				},
			],
		},
	];

	// const userRole = localStorage.getItem('role');
	// const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

	return (
		<div className="font-hyundai">
			<div className="flex items-center p-4 text-center text-white bg-blue">
				<Button
					icon="pi pi-bars"
					className="p-2 ml-4 text-white"
					onClick={() => setVisibleSidebar(true)}
				/>
				<h1 className="w-full text-3xl font-bold">{header}</h1>
				<button onClick={handleLogout} className="p-2 border rounded-lg">
					Chiqish
				</button>
			</div>

			<Sidebar visible={visibleSidebar} onHide={() => setVisibleSidebar(false)}>
				<Menu
					// model={filteredMenuItems}
					model={menuItems}
					className="w-full"
				/>
			</Sidebar>

			<div className="flex items-start justify-between gap-4 px-4 pt-8 max-[900px]:gap-2">
				<div className="flex pl-3 rounded-md card justify-content-center max-md:hidden min-w-[15em] max-[900px]:min-w-[13em]">
					<Toast ref={toast2} />
					<Menu className="w-full max-[900px]:text-[0.9em]" model={items} />
				</div>
				{children}
			</div>
		</div>
	);
};

export default MainLayout;
