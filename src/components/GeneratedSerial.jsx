import {Printer} from "lucide-react";
import {printLabel} from "../utils/qzHelper";
import {QRCodeCanvas} from "qrcode.react";
import { toast } from "react-toastify";

export const GeneratedSerial = ({selectedPrinter, serial}) => {
	const category = serial.furniture.category_furniture.name
	const komplekt = serial.furniture.komplekt_furniture[0].komplekt.name
	const mebel = serial.furniture.name
	const furnitureFullname = `${category} ${komplekt} ${mebel}`
	const demandNumber = serial?.demand_furniture?.demand?.doc_no
	const color = serial?.unique?.color?.name || serial?.demand_furniture?.color?.name
	const packageQuantity = serial?.unique?.package_quantity

	const handlePrint = () => {
		if (!selectedPrinter) {
			toast.error('Printerni tanlang: G500')
			return;
		}
		printLabel(
			selectedPrinter, 
			serial.unique.name,
			demandNumber,
			furnitureFullname,
			color,
			packageQuantity
		);
	};

	return (
		<div className="flex items-center mb-12">
			<div className="flex items-center w-full gap-8 p-8 border-2 rounded-2xl">
				<QRCodeCanvas value={serial.unique.name} size={200} />
				<div className="w-full">
					<p className="mb-4 text-4xl">Серия# {serial.unique.name}</p>
					<p className="text-[28px] mb-4">{category} {komplekt} {mebel}</p>
					{serial.demand_furniture && (
						<p className="mb-4 text-4xl">Заказ# {demandNumber}</p>
					)}
				</div>
			</div>
			<div className="mx-8 cursor-pointer" onClick={handlePrint}>
				<Printer width={60} height={60} />
			</div>
		</div>
	);
};
