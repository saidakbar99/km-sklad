import { useState, useEffect } from "react";
import { GeneratedSerial } from "../components/GeneratedSerial";
// import { connectQZTray, getPrinters } from "../utils/qzHelper";
import MainLayout from "../components/MainLayout";
import { Link } from "react-router-dom";
import axios from "axios";

const GeneratedSerialsPage = () => {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [serials, setSerials] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const initializeQZTray = async () => {
        try {
          // await connectQZTray();
          // const printers = await getPrinters();
          // setPrinters(printers);
        } catch (err) {
          setError("Failed to connect to QZ Tray or retrieve printers.");
        } finally {
          setLoading(false);
        }
      };
  
      initializeQZTray();
      
      const fetchGeneratedSerials = async () => {
        const response = await axios.get("http://localhost:5000/api/serials")
        setSerials(response.data.serials)
      }

      fetchGeneratedSerials()
    }, []);
  
    if (loading) {
      return <div>Loading printers...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }

  return (
    <MainLayout header='Yaratilgan seriya nomerlar'>
      <div className="max-w-[1140px] mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Printerni tanlash</h2>
            <select
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
              className="border p-3 mt-2 rounded-lg"
            >
              <option value="">Printerni tanlang</option>
              {printers.map((printer, index) => (
                <option key={index} value={printer}>
                  {printer}
                </option>
              ))}
            </select>
          </div>
          <Link to='/generation'>
            <button className="w-full px-4 py-2 text-white bg-blue rounded-md hover:bg-opacity-90">
              Generatsiya qilish
            </button>
          </Link>
        </div>
        {serials.length ? (
          serials.map(serial => {
            return (
              <GeneratedSerial key={serial.id} selectedPrinter={'selectedPrinter'} />
            )
          })
        ) : (
          <div>Seriaya nomerlarni yaratilmagan</div>
        )}
        
      </div>
    </MainLayout>
  );
}

export default GeneratedSerialsPage;