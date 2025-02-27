import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";

const InvoiceDetailsPage = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [date, setDate] = useState();
  const [invoice, setInvoice] = useState([])
  const [seh, setSeh] = useState()
  const [loading, setLoading] = useState(false)
  const [selectedFurnitures, setSelectedFurnitures] = useState([]);
  const [blocks,	setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const invoiceNumber = location.pathname.split('/')[2]
  const role = sessionStorage.getItem('role')
  const scannerInputRef = useRef(null);

  const handleScannerInput = (scannedId) => {
    const invoiceToSelect = invoice.find(inv => inv.unique_id === scannedId);
    if (invoiceToSelect) {
      setSelectedFurnitures(prev => {
        const isAlreadySelected = prev.some(item => item.unique_id === scannedId);
        return isAlreadySelected ? prev : [...prev, invoiceToSelect];
      });
      toast.success(`Накладной ${scannedId} выбран`);
    } else {
      toast.error(`Накладной ${scannedId} не найден`);
    }
    if (scannerInputRef.current) {
      scannerInputRef.current.value = '';
      scannerInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (scannerInputRef.current) {
      scannerInputRef.current.focus();
    }
  }, []);
  
  const onSelectionChange = (e) => {
    setSelectedFurnitures(e.value);
  };

  const handleRecieve = async () => {
    try {
      const invoiceIds = selectedFurnitures.map(item => item.unique_id)
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/invoice-recieve`, { 
        invoiceId: parseInt(invoiceNumber), 
        invoiceUniqueIds: invoiceIds,
        blockId: selectedBlock,
      })

      toast.success('Накладнойлар кабул килинди')
      navigate('/recieve')
    } catch (error) {
      console.log(error)
      toast.error('Накладнойларни кабул килишда хатолик')
    }
  }

  useEffect(() => {
    const fetchVipusk = async () => {
      setLoading(true)
      const invoiceRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/invoice/${invoiceNumber}`);
      const invoiceData = invoiceRes.data
      const vipuskRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/serials`, { sehId: invoiceData.seh_id });
      const blocksRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/storage-blocks`)
      
      const invoiceUniques = vipuskRes.data.serials.filter((item) =>
        invoiceData.uniques.some((inv) => inv.id === item.unique_id)
      );

      setBlocks(blocksRes.data.blocks)
      setDate(new Date(invoiceData.date));
      setSeh(invoiceData.seh)
      setInvoice(invoiceUniques);
      setLoading(false)
    };

    fetchVipusk();
  }, [invoiceNumber]);

  // useEffect(() => {
  //   let scannedCode = "";
  //   const handleBarcodeScan = (event) => {
  //     scannedCode += event.key;
      
  //     if (event.key === "Enter") {
  //       const trimmedCode = scannedCode.trim();
  //       const matchingInvoice = invoice.find((item) => item.unique.name === trimmedCode);
  //       if (matchingInvoice) {
  //         setSelectedFurnitures((prev) => 
  //           prev.some((item) => item.unique_id === matchingInvoice.unique_id)
  //             ? prev
  //             : [...prev, matchingInvoice]
  //         );
  //       }
  //       scannedCode = "";
  //     }
  //   };
  
  //   window.addEventListener("keydown", handleBarcodeScan);
  //   return () => window.removeEventListener("keydown", handleBarcodeScan);
  // }, [invoice]);

  return (
    <MainLayout header={`Накладной №${invoiceNumber}`}> 
      <div className="max-w-[1140px] mx-auto">
        {/* Hidden Scanner Input */}
        <InputText 
          ref={scannerInputRef}
          style={{ position: 'absolute', left: '-9999px' }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const scannedId = e.target.value.trim();
              handleScannerInput(scannedId);
            }
          }}
          onBlur={() => scannerInputRef.current?.focus()}
        />
        <div className="p-6 pt-0">
          <div className="flex w-full">
            <div className="flex flex-col mr-8 w-full">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Sklad block
              </label>
              <Dropdown
                value={selectedBlock}
                options={blocks.map((block) => ({label: block.name, value: block.id}))}
                onChange={(e) => setSelectedBlock(e.value)}
                className="w-full border"
                placeholder="Blockni tanlang"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col mr-8 w-fit">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Nakladnoy raqami
              </label>
              <InputText
                value={invoiceNumber || ''}
                className="px-4 py-2 border"
                disabled
              />
            </div>
            <div className="flex flex-col mr-8 w-full">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Seh
              </label>
              <InputText
                value={seh || ''}
                className="w-full px-4 py-2 border"
                disabled
              />
            </div>
            <div className="flex flex-col w-full">
              <label
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Nakladnoy sanasi
              </label>
              <Calendar 
                value={date}
                onChange={(e) => setDate(e.value)} 
                className="w-full px-4 py-2 border"
                disabled
                />
            </div>
            {role === 'sklad_rahbari' && (
              <div className="flex items-end w-full">
                <Button
                  label="Qabul qilish" 
                  className="h-[42px] text-white min-w-[100px] bg-blue rounded-md hover:bg-opacity-90 w-[200px] ml-4"
                  onClick={handleRecieve}
                  disabled={!selectedFurnitures.length}
                />
              </div>
            )}
          </div>
        </div>
        <DataTable
          value={invoice}
          paginator
          rows={10} 
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          selectionMode="multiple"
          selection={selectedFurnitures}
          onSelectionChange={onSelectionChange}
        >
          {role === 'sklad_rahbari' && (
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          )}
          <Column 
            field="" 
            header="N" 
            headerClassName="w-fit" 
            body={(_, { rowIndex }) => rowIndex + 1}
          />
          <Column field="unique.name" header="Unikal nomer" />
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
        </DataTable>
      </div>
    </MainLayout>
  );
};

export default InvoiceDetailsPage;
