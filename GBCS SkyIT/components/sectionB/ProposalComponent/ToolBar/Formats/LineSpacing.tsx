import React, { useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';

interface Props {
    contentEditableRef: React.RefObject<HTMLDivElement>;
}

const LineSpacing: React.FC<Props> = ({ contentEditableRef }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [lineSpacing, setLineSpacing] = useState('normal');

    const handleDropdownClick = () => {
        setIsOpen(!isOpen); // Set isOpen state to true when the dropdown is clicked
    };
    const handleLineSpacingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLineSpacing = e.target.value;
        contentEditableRef.current.style.lineHeight = selectedLineSpacing;
        setLineSpacing(selectedLineSpacing);    
    };

    return (
        <div className='flex justify-center relative rounded-md'>
            <ReactSVG src="/images/edit-proposal/line_spacing.svg"
                onClick={handleDropdownClick}
            />
            {isOpen && (
                <select onChange={handleLineSpacingChange} value={lineSpacing} className='absolute top-1 right-14 text-[#FFFFFF] bg-[#555555] p-4 text-[18px]' size={5}>
                    <option value="normal" className='p-2'>Normal</option>
                    <option value="1" className='p-2'>1</option>
                    <option value="1.15" className='p-2'>1.15</option>
                    <option value="1.5" className='p-2'>1.5</option>
                    <option value="2" className='p-2'>2</option>
                </select>
            )}

        </div>
    );
};

export default LineSpacing;