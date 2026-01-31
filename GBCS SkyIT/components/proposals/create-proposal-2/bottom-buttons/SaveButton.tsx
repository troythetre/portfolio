import React from 'react';
import { Download } from 'tabler-icons-react';

const SaveButton: React.FC = () => {
  return (
    <button className="flex items-center bg-gradient-to-t from-[#DEBF1A] via-[#F2E28A] via-[#CDB016] to-[#EDDA75] rounded-lg p-3 font-bold text-black text-xs w-24 h-3 pr-5 pl-5">
      <Download size={15} className="mr-1" />
      Save
    </button>
  );
};

export default SaveButton;
