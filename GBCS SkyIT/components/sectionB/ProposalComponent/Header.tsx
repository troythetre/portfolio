// Header.tsx
import React from "react";
import Image from "next/image";
import close from "../../../public/close.svg";

interface HeaderProps {
    handleClose: () => void;
}

const Header: React.FC<HeaderProps> = ({handleClose}) => {
    return (
        <div className="bg-[#000000] text-[#FFE34E] text-center relative rounded-t-3xl">
            <p className="text-30 w-[200px] px-[22px] py-[13px] rounded-lg border-2 border-yellow-500 justify-center items-center gap-2.5 inline-flex bg-transparent text-center text-transparent bg-clip-text bg-gradient-gold-gbcs">
                Milestones
            </p>
            <div className="absolute right-5 top-2">
                <Image
                    style={{cursor: "pointer"}}
                    width={18}
                    height={29}
                    src={close}
                    onClick={handleClose}
                    alt="Close Icon"
                />
            </div>
        </div>
    );
};

export default Header;
