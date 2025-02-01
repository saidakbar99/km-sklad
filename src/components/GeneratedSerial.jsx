import { Printer } from 'lucide-react';
import { printLabel } from '../utils/qzHelper';

export const GeneratedSerial = ({selectedPrinter}) => {
  const handlePrint = () => {
    if (!selectedPrinter) {
      alert("Please select a printer.");
      return;
    }
    printLabel(selectedPrinter);
  };
  return (
    <div className="flex items-center mb-12">
      <div className="flex w-full border-2 rounded-2xl">
        <img className="w-[300px] rounded-2xl" src="/qrcode.svg" alt="QR CODE" />
        <div className="my-8">
          <p className="text-4xl mb-4">Серия# 000014</p>
          <p className="text-4xl mb-4">Заказ# 012DV</p>
          <p className="text-[28px] mb-4">СП Босфор Шкаф</p>
          <p className="text-lg text-right">Ранги: Тилла хал</p>
        </div>
      </div>
      <div className="cursor-pointer mx-8" onClick={handlePrint}>
        <Printer width={60} height={60} />
      </div>
    </div>
  )
}