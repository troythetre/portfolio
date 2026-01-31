import React, { ReactNode } from 'react';

interface IconAndTextProps {
  icon: ReactNode; // Accepts any valid ReactNode as an icon
  text: string;
  color: string;
}

const IconAndText: React.FC<IconAndTextProps> = ({ icon, text, color }) => {
  return (
    <div className="max-w-screen-md">
      <div className="flex justify-between bg-transparent p-1 font-semibold">
        <div className="flex flex-row font-poppins text-[16px] cursor-pointer">
          <p>{icon}</p>
          <p className={`ml-5 ${color === 'text-[#DEBF1A]' ? 'text-[#DEBF1A]' : 'text-white'}`}>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default IconAndText;
