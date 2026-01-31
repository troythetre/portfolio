import React, { ChangeEvent, Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/router';
import editIconWhite from '../../../../../public/images/editIconWhite.svg';
import { BackgroundImage, ThemeIcon } from '@mantine/core';

interface DropdownProps {
  label: string;
  options: String[];
  name: string;
  className?: string;
  selectedValue: string;
  selectedDefalutValue: string;
  createNewValueFunction: () => void;
  createNewValueLabel: String;
  onDropdownChange: (value: string) => void;
  onDropdownEdit: (value: string) => void;
}
const DropdownMenu: React.FC<DropdownProps> = ({
  onDropdownChange,
  selectedValue,
  className,
  label,
  options,
  name,
  selectedDefalutValue,
  createNewValueFunction,
  createNewValueLabel,
  onDropdownEdit,
}) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }
  const handleEditClick = (value: String) => {
    onDropdownEdit(value);
  };

  const handleNewClick = () => {
    createNewValueFunction();
    //handleSelection();
  };

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
                  <ul className="pl-2 pt-0">
                    <li
                      value={selectedValue}
                      key={index}
                      onClick={handleSelection}
                      data-value={option} // Set the value using a data attribute
                      className="block  text-sm border-b-2 no-underline text-white-color"
                    >
                      <span
                        // fontFamily="Poppins"
                        // fontSize="30"
                        // fontStyle="normal"
                        // fontWeight="400"
                        // lineHeight="40px"
                        // letterSpacing="0.035px"
                        // className="inline-block "
                        // style={{ width: '85%' }}
                      >
                        {option}
                      </span>
                      <span className="inline-block" style={{ width: '15%' }}>
                        <BackgroundImage
                          src={editIconWhite}
                          className="cursor-pointer bg-no-repeat shadow-none hover:shadow-lg transition-all"
                          onClick={() => {
                            handleEditClick(option);
                          }}
                        >
                          <div className="w-full h-full flex justify-center items-center hover:opacity-100 opacity-0 z-10 transition">
                            <ThemeIcon size="xl" variant="filled" color="dark">
                              <Image
                                src={editIconWhite}
                                alt="infoImage"
                                width={18}
                                height={18}
                              />
                            </ThemeIcon>
                          </div>
                        </BackgroundImage>
                      </span>
                    </li>
                  </ul>
                </Menu.Item>
              </div>
            ))}
            <Menu.Item as={Fragment}>
              <ul className="pl-2">
                <li
                  value="New value"
                  key="New value"
                  onClick={handleNewClick}
                  data-value="New Value"
                  className="block px-2 text-sm border-b-2 no-underline text-white-color"
                >
                  <Divider color="#B5B5B5" sx={{ width: '98%', height: 1 }} />
                  <Typography
                    component="div"
                    display={'flex'}
                    paddingTop={2}
                    paddingBottom={2}
                    color={'#CDB016'}
                    font-family="Poppins"
                    font-size={30}
                    font-style={'normal'}
                    font-weight={'400'}
                    line-height="40px"
                    letter-spacing="0.03"
                    style={{ cursor: 'pointer' }}
                  >
                    {createNewValueLabel}
                  </Typography>
                </li>
              </ul>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
export default DropdownMenu;
