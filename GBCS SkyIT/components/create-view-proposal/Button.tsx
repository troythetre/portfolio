// components/Button.tsx

import React from 'react';


interface ButtonProps {
    label: string;
    icon: React.ReactElement;
    onClick?: () => void;
    className?: string;

}

const Button: React.FC<ButtonProps> = ({ label, onClick, icon }) => {
    return (

        <button
            onClick={onClick}
            className="text-yellow-400 text-2xl flex justify-center opacity-80 border-solid border-yellow-500 bg-black rounded-lg  flex items-center justify-center space-x-2   w-1/3 h-[100px] "
        >
            {icon}
            <span className='pl-4'> {label}</span>
        </button>

    );
};

export default Button;
