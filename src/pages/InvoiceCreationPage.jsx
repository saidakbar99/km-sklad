import { useCallback, useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Trash2, Plus } from 'lucide-react';
import { Calendar } from 'primereact/calendar';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const InvoiceCreationPage = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [date, setDate] = useState(new Date());
  const [vipusk, setVipusk] = useState([])
  const [invoice, setInvoice] = useState([])
  const [seh, setSeh] = useState()
  const [invoiceNumber, setInvoiceNumber] = useState()
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [usedUniqueIds, setUsedUniqueIds] = useState([])

  const fetchVipusk = useCallback(async () => {
    const sehId = parseInt(localStorage.getItem('seh_id'));
  
    const [sehRes, lastInvoiceRes, allUniquesRes] = await Promise.all([
      axios.post(`${process.env.REACT_APP_BASE_URL}/api/seh`, { sehId }),
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/last-invoice`),
      axios.get(`${process.env.REACT_APP_BASE_URL}/api/invoice`),
    ]);

    setSeh(sehRes.data.seh);
    setUsedUniqueIds(allUniquesRes.data.uniques)
  
    const vipuskRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/serials`, { sehId });
  
    let selectedInvoiceData = [];
    if (editingInvoice) {
      const invoiceRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/invoice/${editingInvoice.id}`);
      selectedInvoiceData = invoiceRes.data.uniques;

      setDate(new Date(invoiceRes.data.date));
      setInvoiceNumber(editingInvoice.id - 1);
    } else {
      setInvoiceNumber(lastInvoiceRes.data.lastInvoiceId?.id);
    }

    const selectedInvoiceData2 = vipuskRes.data.serials.filter((item) =>
      selectedInvoiceData.some((inv) => inv.id === item.unique_id)
    );

    const availableVipusk = vipuskRes.data.serials.filter((item) =>
      !selectedInvoiceData.some((inv) => inv.id === item.unique_id)
    );
  
    setVipusk(availableVipusk);
    setInvoice(selectedInvoiceData2);
  }, [editingInvoice]);

  useEffect(() => {
    if (location.state?.invoice) {
      setEditingInvoice(location.state.invoice);
    }
  }, [location.state])

  useEffect(() => {
    fetchVipusk();
  }, [editingInvoice, fetchVipusk]);

  const saveInvoice = async () => {
    try {
      const uniqueIds = invoice.map(item => item.unique_id)

      if (editingInvoice) {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/api/invoice`, {
          invoiceId: editingInvoice.id,
          sehId: seh.id,
          date,
          uniqueIds,
        });
        toast.success("Nakladnoy yangilandi");
      } else {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/api/invoice-creation`, {
          sehId: seh.id,
          date,
          uniqueIds,
        });
        toast.success("Nakladnoy yaratildi");
      }

      navigate('/invoice')
    } catch (error) {
      console.log("Error: ", error)
      toast.error('Xatolik yuz berdi')
    }
  }

  const handleAddToInvoice = (rowData) => {
    setInvoice([...invoice, rowData]);
    setVipusk(vipusk.filter(item => item.id !== rowData.id));
  };

  const handleRemoveFromInvoice = (rowData) => {
    setInvoice(invoice.filter(item => item.id !== rowData.id));
    setVipusk([...vipusk, rowData]);
  }

  const filteredData = vipusk.filter((item) =>
    item.unique.name.toLowerCase().includes(searchText.toLowerCase()) &&
    !usedUniqueIds.includes(item.unique_id)
  );
  // const filteredData = vipusk.filter((item) =>

	// 	item.unique.name.toLowerCase().includes(searchText.toLowerCase())
	// );
  console.log('>>>123', usedUniqueIds)
  return (
    <MainLayout header='Nakladnoy yaratish'> 
      <div className="max-w-[1140px] mx-auto">
        <div className="p-6 pt-0">
          <div className="flex">
            <div className="flex flex-col mr-12">
              <label
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Nakladnoy raqami
              </label>
              <InputText
                value={invoiceNumber + 1 || ''}
                className="px-4 py-2 border"
                disabled
              />
            </div>
            <div className="flex flex-col mr-12">
              <label
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Seh
              </label>
              <InputText
                value={seh?.name || ''}
                className="px-4 py-2 border"
                disabled
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Nakladnoy sanasi
              </label>
              <Calendar 
                value={date}
                onChange={(e) => setDate(e.value)} 
                className="px-4 py-2 border"
                />
            </div>
          </div>
        </div>
        <DataTable
          value={invoice}
          paginator
          rows={5} 
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
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
          <Column 
            body={(rowData) => (
              <Trash2 
                className="cursor-pointer" 
                onClick={() => handleRemoveFromInvoice(rowData)} 
              />
            )} 
          />
        </DataTable>

        <InputText
          className="pl-3 border max-[480px]:h-[2.5em] h-[2.5em] my-4"
          placeholder="Unikal nomer"
          onChange={(e) => setSearchText(e.target.value)}
        />
        <DataTable
          value={filteredData}
          paginator 
          rows={5} 
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
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
          <Column 
            body={(rowData) => (
              <Plus 
                className="cursor-pointer" 
                onClick={() => handleAddToInvoice(rowData)} 
              />
            )} 
          />
        </DataTable>
        <button 
          className="px-4 py-2 text-white rounded-md bg-blue hover:bg-opacity-90 my-8"
          onClick={saveInvoice}
        >
          {editingInvoice ? "Yangilash" : "Generatsiya qilish"}
        </button>
      </div>
    </MainLayout>
  );
};

export default InvoiceCreationPage;
