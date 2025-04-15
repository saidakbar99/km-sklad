import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";

const InvoicesPage = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [invoices, setInvoices] = useState([])
  const [searchText, setSearchText] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const sehId = parseInt(sessionStorage.getItem('seh_id'))
      const invoices = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/invoice?seh_id=${sehId}`)
      setInvoices(invoices.data.invoices)
    } catch (error) {
      console.error("Error fetching invoices", error);
      toast.error('Накладной юклашда хатолик')
    } finally {
      setLoading(false)
    }
  }

  const filteredData = invoices.filter((item) =>
		item.id.toString().includes(searchText.toLowerCase())
	);

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/invoice`, { data: { invoiceId: selectedInvoice.id } });
      setShowDialog(false);
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const handleDeleteSelection = async (rowData) => {
    setShowDialog(true);
    setSelectedInvoice(rowData)
  }

  const handleEdit = (rowData) => {
    navigate("/invoice-creation", { state: { invoice: rowData } });
  };

  useEffect(() => {
    fetchInvoices()
  }, [])

  return (
    <MainLayout header='Накладнойлар'>
      <div className="p-6 max-w-[1140px] mx-auto">
        <div className="flex justify-between mb-4">
          <div className="flex items-center w-full">
            <InputText
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="px-4 py-2 border"
              icon="pi pi-search"
              placeholder="Кидириш..."
            />
          </div>
          <Button
            icon="pi pi-plus"
            label="Кошиш" 
            className="px-4 text-white min-w-[100px] bg-blue rounded-md hover:bg-opacity-90 w-[200px] ml-4"
            onClick={() => navigate('/invoice-creation')}
          />
        </div>
        <DataTable
          value={filteredData}
          emptyMessage="Накладнойлар йок"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
        >
          <Column field="id" header="Накладной раками" />
          <Column
            field="date"
            header="Накладная дата"
            body={(rowData) => new Date(rowData.date).toLocaleDateString()}
          />
          <Column
            field="demands"
            header="Заказлар"
            body={(rowData) =>
              Array.isArray(rowData.demands)
                ? rowData.demands.join(", ")
                : rowData.demands
            }
          />
          <Column
            field=""
            header="Амал" 
            body={(rowData) => (
              <div className="flex justify-between cursor-pointer">
                <Pencil onClick={() => handleEdit(rowData)} />
                <Trash2 onClick={() => handleDeleteSelection(rowData)} />
              </div>
            )}
          />
        </DataTable>
      </div>
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Накладнойни очирмокчимисиз"
        footer={
          <div className="flex justify-between mt-2 min-w-[400px]">
            <Button label="Бекор килиш" icon="pi pi-times" onClick={() => setShowDialog(false)} className="p-button-text" />
            <Button label="Очириш" icon="pi pi-check" className="p-button-danger" onClick={handleDelete} />
          </div>
        }
      />
    </MainLayout>
  );
};

export default InvoicesPage;
