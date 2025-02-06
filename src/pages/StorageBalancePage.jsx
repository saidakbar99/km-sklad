import { useState } from "react";
import MainLayout from "../components/MainLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const StorageBalancePage = () => {
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState("");

  const options = [
    { label: "Hammasi", value: "all" },
    { label: "A1-blok", value: "a1" },
    { label: "A2-blok", value: "a2" },
    { label: "B1-blok", value: "b1" },
    { label: "B2-blok", value: "b2" },
    { label: "C1-blok", value: "c1" },
    { label: "C2-blok", value: "c2" },
  ];

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
            value={filter} 
            options={options} 
            onChange={(e) => setFilter(e.value)} 
            className="w-48 border"
          />
          <InputText
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Qidirish..."
            className="px-4 py-2 border w-full mx-4"
          />
        </div>

        <DataTable value={filteredData}>
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
