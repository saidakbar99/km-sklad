import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Eye } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecieveInvoicePage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [invoices, setInvoices] = useState([])
  const [searchText, setSearchText] = useState("");
  // const [selectedInvoice, setSelectedInvoice] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const filteredData = invoices.filter((item) =>
		item.id.toString().includes(searchText.toLowerCase())
	);

  const onSelectionChange = (e) => {
    setSelectedItems(e.value);
  };

  const handleRecieve = async () => {
    try {
      const invoiceIds = selectedItems.map(item => item.id)
      await axios.post(`${process.env.REACT_APP_BASE_URL}/api/invoice-recieve`, { invoiceIds })
      toast.success('Накладнойлар кабул килинди')
    } catch (error) {
      console.log(error)
      toast.error('Накладнойларни кабул килишда хатолик')
    }
  }

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      try {
        const invoices = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/invoice`)
        setInvoices(invoices.data.invoices)
      } catch (error) {
        console.error("Error fetching invoices", error);
        toast.error('Nakladnoylar yuklashda xatolik')
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
          <Button
            label="Qabul qilish" 
            className="px-4 text-white min-w-[100px] bg-blue rounded-md hover:bg-opacity-90 w-[200px] ml-4"
            onClick={handleRecieve}
            disabled={!selectedItems.length}
          />
        </div>
        <DataTable
          value={filteredData}
          selection={selectedItems}
          onSelectionChange={onSelectionChange}
          emptyMessage="Nakladnoylar yo'q"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          selectionMode="multiple"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
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
              <Eye onClick={() => navigate(`/invoice/${rowData.id}`)} />
            )}
          />
        </DataTable>
      </div>
    </MainLayout>
  );
};

export default RecieveInvoicePage;
