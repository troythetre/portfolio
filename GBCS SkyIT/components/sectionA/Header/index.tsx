import React from "react";
import Image from "next/image";
import back from "../../../public/images/backIcon.svg";

interface HeaderProps {
    number: number;
    label: string;
    onBack: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({number, onBack, label}) => {
    return (
        <div>
            <div className="text-18 flex text-white-color font-normal mb-5">
                <Image src={back} alt="back-icon" height="54" width="44" onClick={() => onBack("back")} />
                <span className="text-40 ml-8">{number}.</span>
                <p className="ml-3 text-40">{label}</p>
            </div>
        </div>
    );
};

export default Header;
