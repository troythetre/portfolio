import React, { ChangeEvent, Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Image from 'next/image';
import { useRouter } from 'next/router';
import infoImage from '../../../../../public/images/infoImage.png';

interface DropdownProps {
  label: string;
  options: String[];
  name: string;
  selectedValue: string;
  selectedDefalutValue: string;
  onDropdownChange: (value: any) => void;
}
const DropdownMenu: React.FC<DropdownProps> = ({
  onDropdownChange,
  selectedValue,
  label,
  options,
  name,
  selectedDefalutValue,
}) => {
  const [selectedOption, setSelectedOption] = useState('');

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  const handleSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const itemSelected = e.currentTarget.getAttribute('data-value');
    onDropdownChange(itemSelected);
    if (itemSelected) {
      setSelectedOption(itemSelected);
    }
  };

  return (
    <div
      className="text-22 text-white-color py-1 relative"
      style={{ width: '35vw' }}
    >
      <label style={{ paddingBottom: '5px' }}>{label}</label>
      <Menu as="div" className="block mt-1 bg-card-bg rounded-md">
        <Menu.Button
          name={name}
          className="w-full h-10 flex items-center justify-between text-gray-400 bg-card-bg rounded-md pl-3"
          style={{
            border: '1px solid yellow',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            paddingBottom: '2px',
          }}
        >
          {selectedOption || selectedDefalutValue}

          <ArrowDropDownIcon className="text-white absolute right-1" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="w-76 origin-top-right bg-card-bg rounded-b-md absolute w-full z-10"
            style={{
              borderBottom: '1px solid yellow',
              marginTop: '-6px',
              position: 'relative',
            }}
          >
            {options?.map((option, index) => (
              <div
                key={option}
                style={{
                  borderBottom:
                    index !== options.length - 1 ? '1px solid grey' : 'none',
                  margin: '0 9px',
                }}
              >
                <Menu.Item as={Fragment}>
                  <ul className="pl-0">
                    <li
                      value={selectedValue}
                      key={index}
                      onClick={handleSelection}
                      data-value={option} // Set the value using a data attribute
                      className="block px-1 text-sm border-b-2 no-underline text-white-color"
                    >
                      <span
                      // fontFamily="Poppins"
                      // fontSize="30"
                      // fontStyle="normal"
                      // fontWeight="400"
                      // lineHeight="40px"
                      // letterSpacing="0.035px"
                      // className="inline-block "
                      // style={{width: "85%", marginTop: "2%"}}
                      >
                        {option}
                      </span>
                      <span className="inline-block float-right" style={{ width: '15%' }}>
                        <Image
                          src={infoImage}
                          alt="infoImage"
                          width={20}
                          height={20}
                        />
                      </span>
                    </li>
                  </ul>
                </Menu.Item>
              </div>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
export default DropdownMenu;
