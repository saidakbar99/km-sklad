import {useState, useEffect} from "react";
import MainLayout from "../components/MainLayout";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import ExportButton from "../components/ExcelButton";
// import {Bookmark, BookmarkCheck} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

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
		block: 0,
		client: "",
		clients: "all",
		bundle: "all",
		category: "all",
		furniture: "all",
	});
	const [searchText, setSearchText] = useState("");
	const [uniques, setUniques] = useState([]);
	const [showDialog, setShowDialog] = useState(false);
	const [selectedBlock, setSelectedBlock] = useState(null);
	const [selectedUnique, setSelectedUnique] = useState(null);
	const [blocks,	setBlocks] = useState([]);
	const [loading, setLoading] = useState(false);
	
	let filteredUniques = uniques.filter((item) =>
		!filters.block || item.unique.block?.id === filters.block
	);

	if (filters.client) {
		filteredUniques = uniques.filter((item) =>
			item?.demand_furniture.demand.customer.name.toLowerCase().includes(filters.client.toLowerCase())
		);
	}
	
	// if (filters.furniture !== "all") {
	// 	filteredData = data.filter((item) => item.furniture === filters.furniture);
	// }

	// let filteredData = data.filter((item) =>
	// 	item.clientId.toLowerCase().includes(searchText.toLowerCase())
	// );

	const fetchRecievedInvoices = async () => {
		setLoading(true)
		try {
			const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/storage`)
			setUniques(response.data.uniques)
		} catch (error) {
			console.log(error)
			toast.error("Skladni ko'rsatishda xatolik")
		} finally {
			setLoading(false)
		}
	}

	const handleBlockChange = (e) => {
		setShowDialog(true)
		setSelectedBlock(e.rowData?.unique?.block?.id || null)
		setSelectedUnique(e.rowData.unique_id)
	}

	const handleStorageEdit = async () => {
		setLoading(true)
		try {
			await axios.put(`${process.env.REACT_APP_BASE_URL}/api/storage-blocks`, {
				blockId: selectedBlock, 
				uniqueId: selectedUnique
			})
			await fetchRecievedInvoices()
			toast.success("Sklad o'zgartirildi")
			setShowDialog(false)
		} catch (error) {
			toast.error("Skladni o'zgartirishda xatolik")
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const fetchBlocks = async () => {
			try {
				const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/storage-blocks`)
				setBlocks(response.data.blocks)
			} catch (error) {
				console.log(error)
				toast.error("Skladni ko'rsatishda xatolik")
			}
		}

		fetchRecievedInvoices()
		fetchBlocks()
	}, [])

	return (
		<MainLayout header="Sklad ostatok">
			<div className="p-6">
				<div className="flex mb-4 max-[1350px]:grid max-[1350px]:grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
					<Dropdown
						value={filters.category}
						options={categoryOptions}
						onChange={(e) => setFilters({...filters, category: e.value})}
						className="border"
						disabled
					/>
					<Dropdown
						value={filters.bundle}
						options={bundleOptions}
						onChange={(e) => setFilters({...filters, bundle: e.value})}
						className="border"
						disabled
					/>
					<Dropdown
						value={filters.block}
						options={blocks.map((block) => ({label: block.name, value: block.id}))}
						onChange={(e) => setFilters({...filters, block: e.value})}
						className="border"
						placeholder="Hamma bloklar"
						showClear={filters.block}
					/>
					<Dropdown
						value={filters.furniture}
						options={furnitureOptions}
						onChange={(e) => setFilters({...filters, furniture: e.value})}
						className="border"
						disabled
					/>
					<InputText
						className="pl-3 border max-[480px]:h-[2.5em] h-[2.5em]"
						placeholder="Mijozlarni qidiring..."
						onChange={(e) => setFilters({...filters, client: e.target.value})}
					/>
					<InputText
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						placeholder="Zakazni qidiring..."
						className="flex w-full px-4 pt-1 border max-[1350px]:col-span-2 max-[900px]:col-span-1 max-[480px]:h-[2.5em]"
					/>
					<ExportButton
						className="col-span-2"
						data={filteredUniques}
						fileName="Склад Остаток"
					/>
				</div>

				<DataTable
					value={filteredUniques}
					paginator
					rows={10}
					rowsPerPageOptions={[10, 25, 50, 100]}
					cellSelection
					selectionMode="single"
					onCellSelect={(e) => handleBlockChange(e)}
					loading={loading}
				>
					<Column 
            field="" 
            header="N" 
            headerClassName="w-fit" 
            body={(_, { rowIndex }) => rowIndex + 1}
          />
					<Column field="unique.block.name" header="Блок" />
					<Column field="unique.name" header="Заказ" />
					<Column 
            field='' 
            header="Клиент" 
            body={(rowData) => rowData.demand_furniture_id 
              ? rowData.demand_furniture.demand.customer.name
              : 'Supermarket'
            }
          />
					<Column field="" header="Комплект"
            body={(rowData) => 
              `${rowData.furniture.category_furniture.name} ${rowData.furniture.komplekt_furniture[0].komplekt.name}`
            }
          />
          <Column field="furniture.name" header="Мебель" />
					<Column field="amount" header="Сони" />
					{/* <Column field="selected" header="tanlangan" /> */}
					{/* <Column field="date" header="Сана" /> */}
				</DataTable>
			</div>
			{showDialog && (
				<Dialog
					visible={showDialog}
					onHide={() => setShowDialog(false)}
					header="Blockni o'zgartirish"
					footer={
						<div className="flex justify-between mt-2 min-w-[400px]">
							<Button 
								label="Bekor qilish" 
								icon="pi pi-times" 
								onClick={() => setShowDialog(false)} 
								className="p-button-text"
								loading={loading}
							/>
							<Button 
								label="O'zgartirish" 
								icon="pi pi-check" 
								className="p-button-danger" 
								onClick={handleStorageEdit}
								loading={loading}
							/>
						</div>
					}
				>
					<div className="flex flex-col w-[400px]">
						<label className="text-lg mb-1">
							Block
						</label>
						<Dropdown
							value={selectedBlock}
							options={blocks.map((block) => ({label: block.name, value: block.id}))}
							onChange={(e) => setSelectedBlock(e.value)}
							className="w-full border rounded-lg"
							disabled={loading}
						/>
					</div>
				</Dialog>
			)}
		</MainLayout>
	);
};

export default StorageBalancePage;
