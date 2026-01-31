import React, { useRef, useState, useEffect } from 'react';
import Image from "next/image";
import text_color from '../../../../../public/images/edit-proposal/text_color.svg'
import { ColorResult, SketchPicker} from 'react-color';


const TextColor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#000000");

    const handleDropdownClick = () => {
        setIsOpen(!isOpen);
    };

    const handleColorChange = (color: ColorResult) => {
        const hexColor = color.hex;
        setSelectedColor(hexColor);
        document.execCommand("foreColor", false, hexColor);
    };


    return (
        <div className='flex justify-center rounded-md'>
            <Image src={text_color} onClick={handleDropdownClick} width={35} height={35} alt='Color icon'/>
            {isOpen && (
                <SketchPicker
                color={selectedColor} 
                onChange={handleColorChange}
                presetColors={[]}
                styles={{
                    picker: {
                        width: '210px',
                        height: '250px',
                        position: 'absolute',
                        top: 60,
                        right: 60,
                        padding: '10px 10px 0px',
                        boxSizing: 'initial',
                        background: '#555555',
                        borderRadius: '4px',
                        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px',
                    },
                }}/>
                
            )}
        </div>
    );
};

export default TextColor;