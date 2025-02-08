import React from 'react';
import { Button } from 'primereact/button';
import * as XLSX from 'xlsx';

const ExportButton = ({ data, fileName }) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName} ${new Date().toLocaleDateString()}.xlsx`);
  };

  return (
    <Button 
      className='min-w-[100px] h-[42px] px-2 py-1 text-white bg-[#247D4F] rounded-md hover:bg-opacity-90 flex items-center text-center leading-none justify-center' 
      label="Excel" 
      icon="pi pi-file-excel" 
      onClick={exportToExcel} 
    />
  );
};

export default ExportButton;
