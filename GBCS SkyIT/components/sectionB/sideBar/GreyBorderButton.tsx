import React from 'react';

interface GreyBorderButtonProps {
  label: string;
  onClick?: () => void;
  width?: string;
  height?: string; // Define a height prop
  dataBool: string;
}

const GreyBorderButton: React.FC<GreyBorderButtonProps> = ({ label, onClick, width, height, dataBool }) => {
  return (
    <button
      id='Edit-Mode-Toggle'
      data-bool={dataBool}
      className={`flex justify-center border-solid border-4 border-silver-gradient-gbcs bg-transparent rounded-xl p-3 items-center space-x-2 text-[#C0C0C0] text-lg font-sans  ${width} ${height}`}
      onClick={onClick}
    >
      <span className="pl-4">{label}</span>
    </button>
  );
};

export default GreyBorderButton;
