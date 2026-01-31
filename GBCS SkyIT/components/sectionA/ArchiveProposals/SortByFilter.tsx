import React, { useState } from 'react';
import Image from "next/image";
//import styles from "./MenuStyle.module.css";

interface SortByFilterProps {
  setFilter: (filter: string) => void;
  dropdownOpen: boolean;
}
interface MenuItemProps {
  icon: string;
  children: React.ReactNode;
  onClose: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({icon, children, onClose}) => {
  return (
      <div className="flex items-center gap-3 px-4">
          <Image src={icon} alt={`${children} icon`} width={30} height={30} />
          <div className="w-full">
              <span className="font-poppins text-left text-white text-lg border border-solid border-zinc-500 border-l-0 border-r-0 border-t-0 block pb-4 my-1">
                  {children}
              </span>
          </div>
      </div>
  );
};
const SortByFilter: React.FC<SortByFilterProps> = ({ setFilter, dropdownOpen }) => {
  //const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSoftware, setShowSoftware] = useState(false);
  const [showCompany, setShowCompany] = useState(false);

  const handleSoftwareClick = () => {
    setShowSoftware(prevState => !prevState);
    setShowCompany(false);
  };

  const handleCompanyClick = () => {
    setShowSoftware(false);
    setShowCompany(prevState => !prevState);
  };

  const handleFilterSelect = (filter: string) => {
    setFilter(filter);
    setShowSoftware(false);
    setShowCompany(false);
  };

  return (
    <div className="relative inline-block text-left z-40" style={{
      background: 'none',
      //position: 'absolute',
      left: '85%',
      paddingTop: '2%'
     }}>
      {dropdownOpen && (
        <div
        className="origin-top-right pointer-events-auto absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
        style={{
          width: '170px',}}
         >
            <div className="bg-[#424242] text-white text-[23px] w-[180px] rounded-lg p-2 cursor-pointer" >Filters:
            <div onClick={handleSoftwareClick}>
                <MenuItem icon="/images/dashboard/icon/desktop.svg">Software</MenuItem>
            </div>
            <div onClick={handleCompanyClick}>
                <MenuItem icon="/images/dashboard/icon/groups.svg">Company</MenuItem>
            </div>
            </div>
            {showSoftware && (
              <div className="bg-accent-color text-[#F2F2F2] text-19  z-100 mt-12 absolute top-0 left-full  rounded-xl " style={{ top: '-30px', height: '100px', paddingTop: '10px'}}>
              {['Lokomotive', 'Aukai', 'Orion'].map((filter) => (
                  <div
                    key={filter}
                    className="mx-5 cursor-pointer w-[105px] h-[24px]"
                    role="menuitem"
                    style={{ top: '-50px',borderBottom: "0.2px solid grey", width: '140px'}}
                    onClick={() => handleFilterSelect(filter)}
                  >
                    {filter}
                  </div>
                ))}
                </div>
            )}
           
            {showCompany && (
             <div className="bg-accent-color text-[#F2F2F2] text-19  z-100 mt-12 absolute top-0 left-full  rounded-xl " style={{ top: '-30px', height: '70px', paddingTop: '10px'}}>
             {['GBCS', 'Skyit'].map((filter) => (
                 <div
                   key={filter}
                   className="mx-5 cursor-pointer w-[105px] h-[24px]"
                   role="menuitem"
                   style={{ top: '-50px',borderBottom: "0.2px solid grey", width: '140px'}}
                   onClick={() => handleFilterSelect(filter)}
                 >
                   {filter}
                 </div>
               ))}
               </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SortByFilter;