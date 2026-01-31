// components/SaveCard.tsx
import React from "react";
import Image from "next/image";
import close from "../../../public/close.svg";

const SubmitSuccessfully: React.FC<{onClose: () => void; message: string}> = ({onClose, message}) => {
    return (
        <div className="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#555555] text-[#FFE34E] rounded-lg h-[172px] w-[435px] flex flex-col justify-center items-center relative">
                <div className="absolute top-0 right-0 m-2 cursor-pointer">
                    <Image
                        style={{cursor: "pointer"}}
                        src={close}
                        className="absolute"
                        onClick={onClose}
                        alt="Close Icon"
                    />
                </div>
                <div className="text-center relative ">
                    <p className="text-2xl  pb-[3%] w-[300px] h-[55px] px-[22px] py-[10px] rounded-lg border-2 border-yellow-500 justify-center items-center gap-2.5 inline-flex bg-transparent text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubmitSuccessfully;
