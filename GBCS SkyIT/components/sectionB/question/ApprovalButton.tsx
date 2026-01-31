import React from 'react';

interface ApprovalButtonProps {
    label: string;
    onClick?: () => void; // Define an optional onClick function prop
}

const ApprovalButton: React.FC<ApprovalButtonProps> = ({ label, onClick }) => {
    return (
        <button
            className="flex justify-center border-solid border-2 border-gold-gradient-gcbs bg-transparent rounded-xl p-3  items-center  space-x-2  text-[#FFD700] text-lg font-sans font-bold w-[220px] h-[40px]"
            onClick={onClick} // Attach the onClick function to the button
        >
            <span className="pl-4">{label}</span>
        </button>
    );
}

export default ApprovalButton;
