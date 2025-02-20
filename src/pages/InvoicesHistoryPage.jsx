import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import { Calendar } from "primereact/calendar";

const InvoicesHistoryPage = () => {
  const [invoices, setInvoices] = useState([])
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  const navigate = useNavigate()

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const sehId = parseInt(sessionStorage.getItem('seh_id'))
      const invoices = await axios.get(`
        ${process.env.REACT_APP_BASE_URL}/api/invoice-history?seh_id=${sehId}&date=${date.toISOString()}
      `)
      setInvoices(invoices.data.invoices)
    } catch (error) {
      console.error("Error fetching invoices", error);
      toast.error('Nakladnoylar yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }

  const filteredData = invoices.filter((item) =>
		item.id.toString().includes(searchText.toLowerCase())
	);

  useEffect(() => {
    fetchInvoices()
  }, [date])

  return (
    <MainLayout header='Кабул килинган накладнойлар'>
      <div className="p-6 max-w-[1140px] mx-auto">
        <div className="flex mb-4">
          <div className="flex items-center w-full">
            <InputText
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-4 py-2 border"
              icon="pi pi-search"
              placeholder="Qidirish..."
            />
          </div>
          <div className="flex flex-col">
            <label
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Nakladnoy Oyi
            </label>
            <Calendar 
              value={date}
              onChange={(e) => setDate(e.value)} 
              className="px-4 py-2 border"
              view="month" 
              dateFormat="mm/yy" 
            />
          </div>
        </div>
        <DataTable
          value={filteredData}
          emptyMessage="Nakladnoylar yo'q"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
        >
          <Column field="id" header="Nakladnoy raqami" />
          <Column
            field="date"
            header="Nakladnoy sanasi"
            body={(rowData) => new Date(rowData.date).toLocaleDateString()}
          />
          <Column
            field="demands"
            header="Zakazlar"
            body={(rowData) =>
              Array.isArray(rowData.demands)
                ? rowData.demands.join(", ")
                : rowData.demands
            }
          />
          <Column
            field=""
            header="Action"
            body={(rowData) => (
              <Eye className="cursor-pointer" onClick={() => navigate(`/invoice/${rowData.id}`)} />
            )}
          />
        </DataTable>
      </div>
    </MainLayout>
  );
};

export default InvoicesHistoryPage;
