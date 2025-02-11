import {Printer} from "lucide-react";
import {printLabel} from "../utils/qzHelper";
import {QRCodeCanvas} from "qrcode.react";

export const GeneratedSerial = ({selectedPrinter, serial}) => {
	const handlePrint = () => {
		if (!selectedPrinter) {
			alert("Please select a printer.");
			return;
		}
		printLabel(selectedPrinter);
	};

	console.log(serial);

	return (
		<div className="flex items-center mb-12">
			<div className="flex items-center w-full gap-8 p-8 border-2 rounded-2xl">
				<QRCodeCanvas value={serial.unique.name} size={200} />
				<div className="">
					<p className="mb-4 text-4xl">Серия# {serial.unique.name}</p>
					{serial.demand_furniture && (
						<p className="mb-4 text-4xl">Заказ# {serial?.demand_furniture?.demand?.doc_no}</p>
					)}
					<p className="text-[28px] mb-4">{serial.furniture.category_furniture.name} KOMPLEKT {serial.furniture.name}</p>
					<p className="text-lg text-right">Ранги: {serial?.unique?.color?.name || serial?.demand_furniture?.color?.name}</p>
					<p></p>
				</div>
			</div>
			<div className="mx-8 cursor-pointer" onClick={handlePrint}>
				<Printer width={60} height={60} />
			</div>
		</div>
	);
};
