import React, { useState, useEffect } from "react";
import { connectQZTray, getPrinters, printLabel } from "../utils/qzHelper";

const LabelPrinter = () => {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeQZTray = async () => {
      try {
        await connectQZTray();
        const printers = await getPrinters();
        setPrinters(printers);
      } catch (err) {
        setError("Failed to connect to QZ Tray or retrieve printers.");
      } finally {
        setLoading(false);
      }
    };

    initializeQZTray();
  }, []);

  const handlePrint = () => {
    if (!selectedPrinter) {
      alert("Please select a printer.");
      return;
    }
    printLabel(selectedPrinter);
  };

  if (loading) {
    return <div>Loading printers...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Label Printer</h2>
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
      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        Print Label
      </button>
    </div>
  );
};

export default LabelPrinter;
