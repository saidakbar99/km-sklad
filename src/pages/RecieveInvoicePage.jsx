import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Eye } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecieveInvoicePage = () => {
  const [invoices, setInvoices] = useState([])
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const filteredData = invoices.filter((item) =>
		item.id.toString().includes(searchText.toLowerCase())
	);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      try {
        const invoices = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/invoice`)
        setInvoices(invoices.data.invoices)
      } catch (error) {
        console.error("Error fetching invoices", error);
        toast.error('Ошибка при загрузке накладных')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])
  
  return (
    <MainLayout header='Складга кабул килиш'>
      <div className="p-6 max-w-[1140px] mx-auto">
        <div className="flex justify-between mb-4">
          <div className="flex items-center w-full">
            <InputText
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-4 py-2 border"
              icon="pi pi-search"
              placeholder="Qidirish..."
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
          <Column 
            field="" 
            header="N" 
            headerClassName="w-fit" 
            body={(_, { rowIndex }) => rowIndex + 1}
          />
          <Column field="seh" header="Цех" />
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

export default RecieveInvoicePage;
