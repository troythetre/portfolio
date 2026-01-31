import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';

const FontStyle: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [font, setFont] = useState<string>('Arial'); // Default font

    const handleDropdownClick = () => {
        setIsOpen(!isOpen); // Set isOpen state to true when the dropdown is clicked
    };

    const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFont = e.target.value;
        setFont(selectedFont);
        document.execCommand('fontName', false, selectedFont);
    };

    return (
        <div className='flex justify-center relative rounded-md'>
            <ReactSVG src="/images/edit-proposal/font.svg"
                onClick={handleDropdownClick}
            />
            {isOpen && (
                <select onChange={handleFontChange} className='absolute top-1 right-14 text-[#FFFFFF] bg-[#555555] p-2 text-[18px]' size={6}>
                    <option value="Arial" selected>Arial</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Poppins">Poppins</option>
                </select>
            )}
        </div>
    );
};

export default FontStyle;
