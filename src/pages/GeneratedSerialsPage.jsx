import {useState, useEffect} from "react";
import {GeneratedSerial} from "../components/GeneratedSerial";
import { connectQZTray, getPrinters } from "../utils/qzHelper";
import MainLayout from "../components/MainLayout";
import {Link} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";

const GeneratedSerialsPage = () => {
	const [printers, setPrinters] = useState([]);
	const [selectedPrinter, setSelectedPrinter] = useState("");
	const [serials, setSerials] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchText, setSearchText] = useState("");

	console.log(error)

	const filteredSerials = serials.filter((serial) =>
		serial.unique?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
		(Array.isArray(serial.demand_furniture) && 
			serial.demand_furniture.some((df) => 
				df.demand?.doc_no?.toLowerCase().includes(searchText.toLowerCase())
			)
		)
	);

	const handlePrinterChange = (e) => {
		const printer = e.target.value;
		setSelectedPrinter(printer);
		localStorage.setItem("selectedPrinter", printer);
	};

	useEffect(() => {
		const initializeQZTray = async () => {
			try {
				await connectQZTray();
				const availablePrinters = await getPrinters();
				setPrinters(availablePrinters);
				const savedPrinter = localStorage.getItem("selectedPrinter");
				if (savedPrinter && availablePrinters.includes(savedPrinter)) {
					setSelectedPrinter(savedPrinter);
				}
			} catch (err) {
				setError("Failed to connect to QZ Tray or retrieve printers.");
			} finally {
				setLoading(false);
			}
		};

		initializeQZTray();

		const fetchGeneratedSerials = async () => {
			setLoading(true)
			try {
				const sehId = parseInt(sessionStorage.getItem('seh_id'))
				const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/serials`, { sehId });
				setSerials(response.data.serials);
			} catch (error) {
				toast.error("Серия ракамлари корсатишда хатолик")
			} finally {
				setLoading(false)
			}
			
		};

		fetchGeneratedSerials();
	}, []);

	return (
		<MainLayout header="Яратилган серия номерлар">
			<div className="max-w-[1140px] mx-auto">
				<div className="flex items-end justify-between mb-6">
					<div>
						<h2 className="text-lg font-bold">Принтерни танлаш</h2>
						<select
							value={selectedPrinter}
							onChange={handlePrinterChange}
							className="p-2.5 mt-2 border rounded-lg"
						>
							<option value="">Принтерни танлаш</option>
							{printers.map((printer, index) => (
								<option key={index} value={printer}>
									{printer}
								</option>
							))}
						</select>
					</div>
					<InputText
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="px-4 py-2 border w-full mx-4"
						icon="pi pi-search"
						placeholder="Кидириш..."
					/>
					<Link to="/generation">
						<button className="w-full px-4 py-2.5 text-white rounded-md bg-blue hover:bg-opacity-90 whitespace-nowrap">
						Генерация килиш 
						</button>
					</Link>
				</div>
				{loading ? (
					<div className="flex justify-center my-10">
						<ProgressSpinner />
					</div>
				) : filteredSerials.length ? (
					filteredSerials.map((serial) => (
						<GeneratedSerial key={serial.id} serial={serial} selectedPrinter={selectedPrinter} />
					))
				) : (
					<div className="text-center text-gray-600">Серия номерлари яратилмаган</div>
				)}
			</div>
		</MainLayout>
	);
};

export default GeneratedSerialsPage;
