import React from 'react';
import { useState } from 'react';
import Image from 'next/image'
import SidebarButton from './SideBarButton';
import { Edit } from 'tabler-icons-react';
import { Upload } from 'tabler-icons-react';
import { PackgeExport } from 'tabler-icons-react';
import { Archive } from 'tabler-icons-react';
import { FileExport } from 'tabler-icons-react';
import { Eye } from 'tabler-icons-react';

const buttons = {
  admin: {
    'Edit Response Library': <Edit/>,
    'Upload Response Library': <Upload />,
    'Export Response Library': <PackgeExport />,
    'Archive': <Archive/>,
    'Export CSV': <FileExport />,
  },
  user: {
    'View Response': <Eye />,
  },
};

const Sidebar = ({ userRole }) => {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (label) => {
    setActiveButton(label);
  };

  const getIconForLabel = (label) => {
    return buttons[userRole][label] || null;
  };

  const buttonLabels = Object.keys(buttons[userRole]);

  return (
    <div className=" bg-black text-gray-300 p-2 h-screen flex flex-col ">
      <div className="self-center m-4">
        <Image
          src="/images/sidebar/sidebar_logo.svg"
          alt="Logo"
          width={225.13}
          height={85.5}
          className="mb-4" 
        />
      </div>
      <div className="space-y-2">
        {buttonLabels.map((label) => (
          <SidebarButton
            key={label}
            label={label}
            icon={getIconForLabel(label)}
            isActive={activeButton === label}
            onClick={() => handleButtonClick(label)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
