import { useState } from "react";
import { GeneratedSerial } from "../components/GeneratedSerial";
// import { connectQZTray, getPrinters } from "../utils/qzHelper";
import MainLayout from "../components/MainLayout";
import { Link } from "react-router-dom";

const GeneratedSerialsPage = () => {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //     const initializeQZTray = async () => {
  //       try {
  //         await connectQZTray();
  //         const printers = await getPrinters();
  //         setPrinters(printers);
  //       } catch (err) {
  //         setError("Failed to connect to QZ Tray or retrieve printers.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  
  //     initializeQZTray();
  //   }, []);
  
    // if (loading) {
    //   return <div>Loading printers...</div>;
    // }
  
    // if (error) {
    //   return <div>{error}</div>;
    // }

  return (
    <MainLayout header='Yaratilgan seriya nomerlar'>
      <div className="">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Printerni tanlash</h2>
            <select
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
              className="border p-2 mt-2"
            >
              <option value="">Select Printer</option>
              {printers.map((printer, index) => (
                <option key={index} value={printer}>
                  {printer}
                </option>
              ))}
            </select>
          </div>
          <Link to='/generation'>
            <button className="w-full px-4 py-2 text-white bg-[#002A50] rounded-md hover:bg-opacity-90">
              Generatsiya qilish
            </button>
          </Link>
        </div>
        <GeneratedSerial selectedPrinter={selectedPrinter} />
        <GeneratedSerial selectedPrinter={selectedPrinter} />
        <GeneratedSerial selectedPrinter={selectedPrinter} />
        <GeneratedSerial selectedPrinter={selectedPrinter} />
        <GeneratedSerial selectedPrinter={selectedPrinter} />
      </div>
    </MainLayout>
  );
}

export default GeneratedSerialsPage;