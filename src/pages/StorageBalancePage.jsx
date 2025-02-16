import {useState} from "react";
import MainLayout from "../components/MainLayout";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import ExportButton from "../components/ExcelButton";
import {Bookmark, BookmarkCheck} from "lucide-react";

const placementOptions = [
	{label: "Hamma bloklar", value: "all"},
	{label: "A1-blok", value: "a1"},
	{label: "A2-blok", value: "a2"},
	{label: "B1-blok", value: "b1"},
	{label: "B2-blok", value: "b2"},
	{label: "C1-blok", value: "c1"},
	{label: "C2-blok", value: "c2"},
];

const bundleOptions = [
	{label: "Hamma komplektlar", value: "all"},
	{label: "Босфор", value: "123"},
	{label: "Шедевр", value: "222"},
	{label: "Граф", value: "4112"},
	{label: "Барокко", value: "A234"},
	{label: "Принц", value: "B231"},
	{label: "Дукале", value: "E213"},
];

const categoryOptions = [
	{label: "Hamma kategoriyalar", value: "all"},
	{label: "СП", value: "A12"},
	{label: "Стул", value: "B21"},
	{label: "Стол", value: "D22"},
	{label: "Мягкий", value: "A2664"},
];

const furnitureOptions = [
	{label: "Hamma mebellar", value: "all"},
	{label: "Kravat", value: "Krovat"},
	{label: "stul", value: "Stul"},
];

const StorageBalancePage = () => {
	const [filters, setFilters] = useState({
		placement: "all",
		users: "",
		clients: "all",
		bundle: "all",
		category: "all",
		furniture: "all",
	});
	const [searchText, setSearchText] = useState("");
	const [selectedRow, setSelectedRow] = useState([]);

	const data = Array.from({length: 5}, (_, i) => ({
		id: i + 1,
		clientId: "010AB",
		clientName: "Farxod aka",
		bundle: "SP / Barokko",
		furniture: i % 2 === 0 ? "Krovat" : "Stul",
		quantity: i % 2 === 0 ? 1 : 2,
		selected: !selectedRow.includes(++i) ? (
			<Bookmark
				className="cursor-pointer"
				onClick={() => setSelectedRow([...selectedRow, i])}
			/>
		) : (
			<BookmarkCheck
				className="text-red-400 cursor-pointer"
				onClick={() => {
					const filteredIds = selectedRow.filter((value) => value !== i);
					setSelectedRow([...filteredIds]);
				}}
			/>
		),
		// date: new Date().toLocaleDateString(),
	}));

	let filteredData = data.filter((item) =>
		item.clientId.toLowerCase().includes(searchText.toLowerCase())
	);

	if (filters.furniture !== "all") {
		filteredData = data.filter((item) => item.furniture === filters.furniture);
	}

	if (filters.users) {
		filteredData = data.filter((item) =>
			item.clientName.toLowerCase().includes(filters.users.toLowerCase())
		);
	}

	return (
		<MainLayout header="Sklad ostatok">
			<div className="p-6 max-[1150px]:p-0 max-[1150px]:pt-2 w-full overflow-x-auto">
				<div className="flex mb-4 max-[1520px]:grid max-[1520px]:grid-cols-5 gap-4 max-[1150px]:grid-cols-2 max-[480px]:grid-cols-1 max-[850px]:w-full">
					<Dropdown
						value={filters.category}
						options={categoryOptions}
						onChange={(e) => setFilters({...filters, category: e.value})}
						className="border max-[850px]:w-full"
					/>
					<Dropdown
						value={filters.bundle}
						options={bundleOptions}
						onChange={(e) => setFilters({...filters, bundle: e.value})}
						className="border max-[850px]:w-full"
					/>
					<Dropdown
						value={filters.placement}
						options={placementOptions}
						onChange={(e) => setFilters({...filters, placement: e.value})}
						className="border max-[850px]:w-full"
						placeholder="asdasd"
					/>
					<Dropdown
						value={filters.furniture}
						options={furnitureOptions}
						onChange={(e) => setFilters({...filters, furniture: e.value})}
						className="border max-[850px]:w-full"
					/>
					<InputText
						className="pl-3 border max-[480px]:h-[2.5em] h-[2.5em] max-[850px]:w-full"
						placeholder="Mijozlarni qidiring..."
						onChange={(e) => setFilters({...filters, users: e.target.value})}
					/>
					<InputText
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="Qidirish..."
						className="flex w-full px-4 pt-1 border max-[1350px]:col-span-2 max-[900px]:col-span-1 max-[480px]:h-[2.5em] max-[850px]:w-full"
					/>
					<ExportButton
						className="col-span-2"
						data={filteredData}
						fileName="Склад Остаток"
					/>
				</div>

				<div className="overflow-x-auto">
					<DataTable
						value={filteredData}
						paginator
						rows={10}
						className="min-w-[740px]"
						rowsPerPageOptions={[10, 25, 50, 100]}
						rowClassName={(value) =>
							selectedRow.includes(value.id) ? "selected-row" : ""
						}>
						<Column field="id" header="N" />
						<Column field="clientId" header="Заказ" />
						<Column field="clientName" header="Клиент" />
						<Column field="bundle" header="Комплект" />
						<Column field="furniture" header="Мебель" />
						<Column field="quantity" header="Сони" />
						<Column field="selected" header="tanlangan" />
					</DataTable>
				</div>
			</div>
		</MainLayout>
	);
};

export default StorageBalancePage;
