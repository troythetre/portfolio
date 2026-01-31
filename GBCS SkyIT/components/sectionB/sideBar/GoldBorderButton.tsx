import React from 'react';

interface GoldBorderButtonProps {
  label: string;
  onClick?: () => void;
  width?: string;
  height?: string; // Define a height prop
  type?: "button" | "submit" | "reset"; 
  
}

const GoldBorderButton: React.FC<GoldBorderButtonProps> = ({ label, onClick, width, height,type }) => {
  return (

    <button
    type={type} 
      className={`flex justify-center border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3  items-center  text-[#FFE34E] text-lg font-sans font-bold ${width} ${height}`}
      onClick={onClick}
    >
      <span className="text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">{label}</span>
    </button>
  );
};

export default GoldBorderButton;
