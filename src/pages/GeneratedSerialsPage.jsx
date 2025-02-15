import {useState, useEffect} from "react";
import {GeneratedSerial} from "../components/GeneratedSerial";
import { connectQZTray, getPrinters } from "../utils/qzHelper";
import MainLayout from "../components/MainLayout";
import {Link} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";

const GeneratedSerialsPage = () => {
	const [printers, setPrinters] = useState([]);
	const [selectedPrinter, setSelectedPrinter] = useState("");
	const [serials, setSerials] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	console.log(error)
	console.log(loading)

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
				toast.error("Seriya raqamlarni ko'rsatishda xatolik")
			} finally {
				setLoading(false)
			}
			
		};

		fetchGeneratedSerials();
	}, []);

	const handlePrinterChange = (e) => {
		const printer = e.target.value;
		setSelectedPrinter(printer);
		localStorage.setItem("selectedPrinter", printer);
	};

	// if (loading) {
	// 	return <div>Loading printers...</div>;
	// }

	// if (error) {
	// 	return <div>{error}</div>;
	// }

	return (
		<MainLayout header="Yaratilgan seriya nomerlar">
			<div className="max-w-[1140px] mx-auto">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-lg font-bold">Printerni tanlash</h2>
						<select
							value={selectedPrinter}
							onChange={handlePrinterChange}
							className="p-3 mt-2 border rounded-lg"
						>
							<option value="">Printerni tanlang</option>
							{printers.map((printer, index) => (
								<option key={index} value={printer}>
									{printer}
								</option>
							))}
						</select>
					</div>
					<Link to="/generation">
						<button className="w-full px-4 py-2 text-white rounded-md bg-blue hover:bg-opacity-90">
							Generatsiya qilish
						</button>
					</Link>
				</div>
				{loading ? (
					<div className="flex justify-center my-10">
						<ProgressSpinner />
					</div>
				) : serials.length ? (
					serials.map((serial) => (
						<GeneratedSerial key={serial.id} serial={serial} selectedPrinter={selectedPrinter} />
					))
				) : (
					<div className="text-center text-gray-600">Seriaya nomerlarni yaratilmagan</div>
				)}
			</div>
		</MainLayout>
	);
};

export default GeneratedSerialsPage;
