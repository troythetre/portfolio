// components/SaveCard.tsx
import React from "react";
import Image from "next/image";
import close from "../../../public/close.svg";

const SaveCard: React.FC<{ onCloseSaveCard: () => void }> = ({ onCloseSaveCard }) => {
    return (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
            <div className="relative mx-auto w-[435px] h-[172px] rounded overflow-hidden bg-accent-color">
                <div className="absolute top-0 right-0 m-2 cursor-pointer">
                    <Image src={close} alt="close" width={18} height={25} onClick={onCloseSaveCard} />
                </div>
                <div className="flex flex-col items-center justify-center h-full text-3xl font-normal font-poppins leading-10 tracking-tight text-transparent bg-gradient-text bg-clip-text">
                    Saved!
                </div>
            </div>
        </div>
    );
};

export default SaveCard;
