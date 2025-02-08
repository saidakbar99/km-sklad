import { useState } from "react";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import ExportButton from "../components/ExcelButton";

const placementOptions = [
  { label: "Hamma bloklar", value: "all" },
  { label: "A1-blok", value: "a1" },
  { label: "A2-blok", value: "a2" },
  { label: "B1-blok", value: "b1" },
  { label: "B2-blok", value: "b2" },
  { label: "C1-blok", value: "c1" },
  { label: "C2-blok", value: "c2" },
];

const bundleOptions = [
  { label: "Hamma komplektlar", value: "all" },
  { label: "Босфор", value: "123" },
  { label: "Шедевр", value: "222" },
  { label: "Граф", value: "4112" },
  { label: "Барокко", value: "A234" },
  { label: "Принц", value: "B231" },
  { label: "Дукале", value: "E213" },
];

const categoryOptions = [
  { label: "Hamma kategoriyalar", value: "all" },
  { label: "СП", value: "A12" },
  { label: "Стул", value: "B21" },
  { label: "Стол", value: "D22" },
  { label: "Мягкий", value: "A2664" },
];

const StorageBalancePage = () => {
  const [filters, setFilters] = useState({
    placement: 'all',
    bundle: 'all',
    category: 'all',
  });
  const [searchText, setSearchText] = useState("");

  const data = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    clientId: '010AB',
    clientName: 'Farxod aka',
    bundle: 'SP / Barokko',
    furniture: i % 2 === 0 ? 'Krovat' : 'Stul',
    quantity: i % 2 === 0 ? 1 : 2,
    // date: new Date().toLocaleDateString(),
  }));

  const filteredData = data.filter((item) =>
    item.clientId.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <MainLayout header='Sklad ostatok'>
      <div className="p-6">
        <div className="flex mb-4">
          <Dropdown 
            value={filters.placement} 
            options={placementOptions} 
            onChange={(e) => setFilters({...filters, placement: e.value})} 
            className="max-w-[300px] border mr-4"
            placeholder="asdasd"
          />
          <Dropdown 
            value={filters.bundle} 
            options={bundleOptions} 
            onChange={(e) => setFilters({...filters, bundle: e.value})} 
            className="max-w-[300px] border mr-4"
          />
          <Dropdown 
            value={filters.category} 
            options={categoryOptions} 
            onChange={(e) => setFilters({...filters, category: e.value})} 
            className="max-w-[300px] border"
          />
          <InputText
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Qidirish..."
            className="px-4 pt-1 border mx-4 w-full flex"
          />
          <ExportButton data={filteredData} fileName='Склад Остаток' />
        </div>

        <DataTable 
          value={filteredData} 
          paginator 
          rows={10} 
          rowsPerPageOptions={[10, 25, 50, 100]}
        >
          <Column field="id" header="N" />
          <Column field="clientId" header="Заказ" />
          <Column field="clientName" header="Клиент" />
          <Column field="bundle" header="Комплект" />
          <Column field="furniture" header="Мебель" />
          <Column field="quantity" header="Сони" />
          {/* <Column field="date" header="Сана" /> */}
        </DataTable>
      </div>
    </MainLayout>
  );
};

export default StorageBalancePage;
