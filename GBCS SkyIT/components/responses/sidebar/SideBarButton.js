import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

const SidebarButton = ({ label, icon, isActive, onClick }) => {
  return (
    <div
      className={`py-2 px-4 my-2 cursor-pointer ${
        isActive ? 'border-b-2 border-yellow-400 text-yellow-400 underline' : 'text-white'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center ">
        <span className="mr-5">{icon}</span>
        <span className="text-base">{label}</span>
      </div>
    </div>
  );
};
export default SidebarButton;