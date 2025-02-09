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
				<QRCodeCanvas value={serial.unique_id} size={200} />
				<div className="">
					<p className="mb-4 text-4xl">Серия# 000014</p>
					<p className="mb-4 text-4xl">Заказ# 012DV</p>
					<p className="text-[28px] mb-4">СП Босфор Шкаф</p>
					<p className="text-lg text-right">Ранги: Тилла хал</p>
					<p></p>
				</div>
			</div>
			<div className="mx-8 cursor-pointer" onClick={handlePrint}>
				<Printer width={60} height={60} />
			</div>
		</div>
	);
};
