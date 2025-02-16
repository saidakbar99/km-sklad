import {useState} from "react";
import MainLayout from "../components/MainLayout";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import ExportButton from "../components/ExcelButton";

const RealeseFurniturePage = () => {
	const [selectedItems, setSelectedItems] = useState([]);
	const [filter, setFilter] = useState(null);
	const [searchText, setSearchText] = useState("");

	const options = [
		{label: "Tanlanmagan", value: ""},
		{label: "A1-blok", value: "a1"},
		{label: "A2-blok", value: "a2"},
		{label: "B1-blok", value: "b1"},
		{label: "B2-blok", value: "b2"},
		{label: "C1-blok", value: "c1"},
		{label: "C2-blok", value: "c2"},
	];

	const data = Array.from({length: 10}, (_, i) => ({
		id: i + 1,
		clientId: "010AB",
		clientName: "Farxod aka",
		bundle: "SP / Barokko",
		furniture: i % 2 === 0 ? "Krovat" : "Stul",
		quantity: i % 2 === 0 ? 1 : 2,
		// date: new Date().toLocaleDateString(),
	}));

	const onSelectionChange = (e) => {
		setSelectedItems(e.value);
	};

	const handleRelease = () => {
		console.log(">>>release", selectedItems);
	};

	const filteredData = data.filter((item) =>
		item.clientId.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<MainLayout header="Отгрузка">
			<div className="w-full p-6 pt-2 overflow-x-auto">
				<div className="flex justify-between min-w-full mb-4">
					<div className="flex items-center w-full">
						<Dropdown
							value={filter}
							options={options}
							onChange={(e) => setFilter(e.value)}
							placeholder="Blokni tanlang"
							className="w-48 border"
						/>
						<InputText
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							placeholder="Qidirish..."
							className="w-full px-4 py-2 mx-4 border"
						/>
						<ExportButton data={filteredData} fileName="Отгрузка" />
					</div>
					<Button
						label="Отгрузка"
						className="px-4 min-w-[100px] text-white bg-blue rounded-md hover:bg-opacity-90 ml-4"
						onClick={handleRelease}
					/>
				</div>
				<div className="overflow-x-auto">
					<DataTable
						value={filteredData}
						selection={selectedItems}
						onSelectionChange={onSelectionChange}
						selectionMode="multiple"
						paginator
						className="min-w-[1000px]"
						rows={10}
						rowsPerPageOptions={[10, 25, 50, 100]}>
						<Column selectionMode="multiple" headerStyle={{width: "3rem"}} />
						<Column field="id" header="N" />
						<Column field="clientId" header="Заказ" />
						<Column field="clientName" header="Клиент" />
						<Column field="bundle" header="Комплект" />
						<Column field="furniture" header="Мебель" />
						<Column field="quantity" header="Сони" />
					</DataTable>
				</div>
			</div>
		</MainLayout>
	);
};

export default RealeseFurniturePage;
