import React, { useState } from 'react';
import { ReactSVG } from 'react-svg';
interface Props {
    contentEditableRef: React.RefObject<HTMLDivElement>;
}
const Align: React.FC<Props> = ({ contentEditableRef }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDropdownClick = () => {
        setIsOpen(!isOpen); // Set isOpen state to true when the dropdown is clicked
    };

    const handleAlignChange = (value: string) => {
        console.log(value)
        switch (value) {
            case 'Left':
                document.execCommand('justifyLeft');
                break;
            case 'Center':
                document.execCommand('justifyCenter');
                break;
            case 'Right':
                document.execCommand('justifyRight');
                break;
            default:
                break;
        }
    };

    return (
        <div className='flex justify-center relative rounded-md items-center'>
            <ReactSVG src="/images/edit-proposal/align.svg"
                onClick={handleDropdownClick}
            />
            {isOpen && (
                    <div className="absolute right-14 text-[#FFFFFF] bg-[#555555] rounded-md p-4 text-[18px]">
                        <div
                            className="hover:bg-[#7d7d7d] rounded-md"
                            onClick={() => handleAlignChange('Left')}
                            onMouseDown={(event) => 
                                event.preventDefault()}
                        >
                            <ReactSVG src="/images/edit-proposal/align.svg" />
                        </div>
                        <div
                            className="hover:bg-[#7d7d7d] rounded-md"
                            onClick={() => handleAlignChange('Center')}
                            onMouseDown={(event) => 
                                event.preventDefault()}
                        >
                            <ReactSVG src="/images/edit-proposal/align_center.svg" />
                        </div>
                        <div
                            className="hover:bg-[#7d7d7d] rounded-md"
                            onClick={() => handleAlignChange('Right')}
                            onMouseDown={(event) => 
                                event.preventDefault()}
                        >
                            <ReactSVG src="/images/edit-proposal/align_right.svg" />
                        </div>
                    </div>
            )}
        </div>
    );
};

export default Align;
