import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([])
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInvoices = async () => {
      const sehId = parseInt(localStorage.getItem('seh_id'))
      const invoices = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/invoice`, { sehId })
      setInvoices(invoices.data.invoices)
    }

    fetchInvoices()
  }, [])

  const filteredData = invoices.filter((item) =>
		item.id.toString().includes(searchText.toLowerCase())
	);

  return (
    <MainLayout header='Nakladnoylar'>
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
          <Button
            icon="pi pi-plus"
            label="Qo'shish" 
            className="px-4 text-white min-w-[100px] bg-blue rounded-md hover:bg-opacity-90 w-[200px] ml-4"
            onClick={() => navigate('/invoice-creation')}
          />
        </div>

        <DataTable
          value={filteredData}
          // selection={selectedItems} 
          // onSelectionChange={onSelectionChange} 
          emptyMessage="Nakladnoylar yo'q"
          paginator 
          rows={5} 
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column field="id" header="Nakladnoy raqami" />
          <Column 
            field="date" 
            header="Nakladnoy sanasi"
            body={(rowData) => new Date(rowData.date).toLocaleDateString()}
          />
          <Column field="demand" header="Zakazlar" />
          <Column 
            field=""
            header="Action"
            body={(rowData) => 
              <div className="flex justify-between">
                <Pencil />
                <Trash2 />
              </div>
            }
          />
        </DataTable>
      </div>
    </MainLayout>
  );
};

export default InvoicesPage;
