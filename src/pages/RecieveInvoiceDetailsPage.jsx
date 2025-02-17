import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { useNavigate, useLocation } from "react-router-dom";

const RecieveInvoiceDetailsPage = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [date, setDate] = useState(new Date());
  const [invoice, setInvoice] = useState([])
  const [seh, setSeh] = useState()
  const [loading, setLoading] = useState(false)
  const invoiceNumber = location.pathname.split('/')[2]

  useEffect(() => {
    const fetchVipusk = async () => {
      setLoading(true)
  
      const invoiceRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/invoice/${invoiceNumber}`);
      const invoiceData = invoiceRes.data
      const vipuskRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/serials`, { sehId: invoiceData.seh_id });

      const invoiceUniques = vipuskRes.data.serials.filter((item) =>
        invoiceData.uniques.some((inv) => inv.id === item.unique_id)
      );

      setDate(new Date(invoiceData.date));
      setSeh(invoiceData.seh)
      setInvoice(invoiceUniques);
      setLoading(false)
    };

    fetchVipusk();
  }, []);

  return (
    <MainLayout header={`Накладной №${invoiceNumber}`}> 
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
                value={invoiceNumber || ''}
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
                value={seh || ''}
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
                disabled
                />
            </div>
          </div>
        </div>
        <DataTable
          value={invoice}
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
        <button 
          className="px-4 py-2 text-white rounded-md bg-blue hover:bg-opacity-90 my-8"
          onClick={() => navigate('/recieve')}
        >
          Накладнойларга кайтиш
        </button>
      </div>
    </MainLayout>
  );
};

export default RecieveInvoiceDetailsPage;
