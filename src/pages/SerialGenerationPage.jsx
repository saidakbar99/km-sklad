import { useState } from "react";
import MainLayout from "../components/MainLayout";
import { AutoComplete } from 'primereact/autocomplete';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { TabView, TabPanel } from "primereact/tabview";
import { RadioButton } from "primereact/radiobutton";

const SerialGenerationPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [order, setOrder] = useState('123');
  const [mebel, setMebel] = useState('');
  const [position, setPosition] = useState(null)
  
  return (
    <MainLayout header='Seriya nomer yaratish'>
      <div className="w-full flex justify-center mb-12">
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
          className="border-none w-full"
        >
          <TabPanel header={<span className={`pb-2 ${activeIndex === 0 ? 'border-b-2 border-blue-500' : ''}`}>Mijozniki</span>}>
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

              <button
                className="w-full px-4 py-3 text-white bg-blue rounded-md hover:bg-opacity-90"
              >
                Generatsiya qilish
              </button>
              
            </div>
          </TabPanel>
          <TabPanel header={<span className={`pb-2 ${activeIndex === 1 ? 'border-b-2 border-blue-500' : ''}`}>Magazin</span>}>
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

              <div className="flex flex-col mb-8">
                <label className="text-sm mb-1.5 font-semibold">
                  Позиция
                </label>
                <div className="flex flex-col flex-wrap gap-3">
                  <div className="flex align-items-center">
                      <RadioButton className="opacity-100 !w-5 !h-5"  inputId="ingredient1" onChange={() => setPosition(1)} checked={position === 1} />
                      <label htmlFor="ingredient1" className="ml-2">I</label>
                  </div>
                  <div className="flex align-items-center">
                      <RadioButton inputId="ingredient2" onChange={() => setPosition(2)} checked={position === 2} />
                      <label htmlFor="ingredient2" className="ml-2">II</label>
                  </div>
                  <div className="flex align-items-center">
                      <RadioButton inputId="ingredient3" onChange={() => setPosition(3)} checked={position === 3} />
                      <label htmlFor="ingredient3" className="ml-2">III</label>
                  </div>
                </div>
              </div>

              <button
                className="w-full px-4 py-3 text-white bg-blue rounded-md hover:bg-opacity-90"
              >
                Generatsiya qilish
              </button>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </MainLayout>
  );
}

export default SerialGenerationPage;