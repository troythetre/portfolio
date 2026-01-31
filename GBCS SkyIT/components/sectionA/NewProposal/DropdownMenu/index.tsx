import React, {ChangeEvent, Fragment, useState} from "react";
import {Menu, Transition} from "@headlessui/react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface DropdownProps {
    label: string;
    options: string[];
    name: string;
    selectedValue: string;
    readOnly: boolean;
    onDropdownChange: (value: string) => void;
}
const DropdownMenu: React.FC<DropdownProps> = ({onDropdownChange, selectedValue, label, options, readOnly, name}) => {
    const [selectedOption, setSelectedOption] = useState("");
    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(" ");
    }
    const handleSelection = (e: ChangeEvent<HTMLSelectElement>) => {
        const itemSelected = e.currentTarget.getAttribute("data-value");
        if (itemSelected) {
            setSelectedOption(itemSelected);
        }
        onDropdownChange(itemSelected);
    };
    return (
        <div className="text-25 text-white-color py-5 relative" style={{width: "35vw"}}>
            <label>{label}</label>
            <Menu as="div" className="block mt-1 bg-card-bg rounded-md">
                <Menu.Button
                    name={name}
                    className="w-full h-10 flex items-center justify-between text-gray-400 bg-card-bg rounded-md pl-10"
                    style={{
                        border: "1px solid yellow",
                        borderTop: "none",
                        borderLeft: "none",
                        borderRight: "none",
                        height: "2.2rem",
                    }}
                >
                    {selectedValue || "Select Option"}
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
                        style={{borderBottom: "1px solid yellow", marginTop: "-6px"}}
                    >
                        {options.map((option, index) => (
                            <div
                                className="py-1"
                                key={option}
                                style={{
                                    borderBottom: index !== options.length - 1 ? "1px solid grey" : "none",
                                    margin: "0 9px",
                                }}
                            >
                                <Menu.Item>
                                    <ul className="pl-0">
                                        <li
                                            value={selectedValue}
                                            key={index}
                                            onClick={handleSelection}
                                            data-value={option} // Set the value using a data attribute
                                            className="block px-1 py-1 text-sm border-b-2 no-underline text-white-color"
                                        >
                                            {option}
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
