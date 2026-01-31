import React from 'react';

interface SetButtonProps {
    label: string;
    onClick?: () => void; // Define an optional onClick function prop
}

const SetButton: React.FC<SetButtonProps> = ({ label, onClick }) => {
    return (
        <div className='mt-2'>
            <button
            className="flex justify-center items-center border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl   text-[#FFD700] text-lg font-sans font-bold w-[120px] h-[40px]"
            onClick={onClick} // Attach the onClick function to the button
        >
            <span >{label}</span>
        </button>

        </div>
        
    );
}

export default SetButton;