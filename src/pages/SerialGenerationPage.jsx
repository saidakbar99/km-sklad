import { useState } from "react";
import MainLayout from "../components/MainLayout";
import { AutoComplete } from 'primereact/autocomplete';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
// import { Button } from "primereact/button";

const SerialGenerationPage = () => {
  const [order, setOrder] = useState('123');
  const [mebel, setMebel] = useState('');
  return (
    <MainLayout header='Seriya nomer yaratish'>
      <div className="flex justify-between gap-x-12 px-8 pb-8">
        <div className="w-full">
          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Zakaz nomeri
            </label>
            <AutoComplete
            className="border pl-4 py-3 rounded-lg"
              value={order}
              suggestions={['11', '2', '3', '4', '5']}
              // completeMethod={search}
              onChange={(e) => setOrder(e.value)}
              dropdown
            />
          </div>
          
          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Mebel
            </label>
            <Dropdown
              value={mebel} 
              onChange={(e) => setMebel(e.value)} 
              options={['bosfor', 'bosfor2', 'bosfor3']} 
              optionLabel="name" 
              placeholder="Mebel tanlang" 
              className="w-full border rounded-lg" 
            />
          </div>

          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Soni
            </label>
            <div className="flex items-end">
              <InputNumber
                value={mebel} 
                onChange={(e) => setMebel(e.value)} 
                optionLabel="name" 
                placeholder="Mebel tanlang" 
                className="w-fit px-4 py-3 mr-2"
                style={{border: '1px solid #ced4da', borderRadius: '0.5rem'}}
              />
              <p className="">шт</p>
            </div>
          </div>

          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Bitta mebel nechta qutiga joylandi
            </label>
            <div className="flex items-end">
              <InputNumber
                value={mebel} 
                onChange={(e) => setMebel(e.value)} 
                optionLabel="name" 
                placeholder="Mebel tanlang" 
                className="w-fit px-4 py-3 mr-2"
                style={{border: '1px solid #ced4da', borderRadius: '0.5rem'}}
              />
            </div>
          </div>

          {/* <Button label='123' /> */}
          <button
            className="w-full px-4 py-3 text-white bg-[#002A50] rounded-md hover:bg-opacity-90"
          >
            Generatsiya qilish
          </button>
          
        </div>
        <div className="w-full">
          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Kategoriya
            </label>
            <Dropdown
              value={mebel} 
              onChange={(e) => setMebel(e.value)} 
              options={['bosfor', 'bosfor2', 'bosfor3']} 
              optionLabel="name" 
              placeholder="Kategoriya tanlang" 
              className="w-full border rounded-lg" 
            />
          </div>

          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Komplekt
            </label>
            <Dropdown
              value={mebel} 
              onChange={(e) => setMebel(e.value)} 
              options={['bosfor', 'bosfor2', 'bosfor3']} 
              optionLabel="name" 
              placeholder="Komplektni tanlang" 
              className="w-full border rounded-lg" 
            />
          </div>

          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Mebel
            </label>
            <Dropdown
              value={mebel} 
              onChange={(e) => setMebel(e.value)} 
              options={['bosfor', 'bosfor2', 'bosfor3']} 
              optionLabel="name" 
              placeholder="Mebelni tanlang" 
              className="w-full border rounded-lg" 
            />
          </div>

          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Soni
            </label>
            <InputNumber
              value={mebel} 
              onChange={(e) => setMebel(e.value)} 
              optionLabel="name" 
              placeholder="Mebel tanlang" 
              className="w-fit px-4 py-3 mr-2"
              style={{border: '1px solid #ced4da', borderRadius: '0.5rem'}}
            />
          </div>

          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Rangi
            </label>
            <Dropdown
              value={mebel} 
              onChange={(e) => setMebel(e.value)} 
              options={['bosfor', 'bosfor2', 'bosfor3']} 
              optionLabel="name" 
              placeholder="Rangni tanlang" 
              className="w-full border rounded-lg" 
            />
          </div>

          <div className="flex flex-col mb-8">
            <label className="text-sm mb-1.5 font-semibold">
              Daraxt
            </label>
            <Dropdown
              value={mebel} 
              onChange={(e) => setMebel(e.value)} 
              options={['bosfor', 'bosfor2', 'bosfor3']} 
              optionLabel="name" 
              placeholder="Daraxtni tanlang" 
              className="w-full border rounded-lg" 
            />
          </div>

          {/* <Button label='123' /> */}
          <button
            className="w-full px-4 py-3 text-white bg-[#002A50] rounded-md hover:bg-opacity-90"
          >
            Generatsiya qilish
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default SerialGenerationPage;