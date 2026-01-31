import React, {useState} from "react";
import vectorWhite from "../../public/images/button/switch-button/white_vector.svg";
import frameWhite from "../../public/images/button/switch-button/white_frame.svg";
import vector from "../../public/images/button/switch-button/black_vector.svg";
import frame from "../../public/images/button/switch-button/black_frame.svg";
import Image from "next/image";

function SwitchBtn() {
    const [isChecked, setIsChecked] = useState(false);
    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div
            className={`relative border-solid border-[2px] border-gray-400 inline-block w-[70px] h-[35px] rounded-full mx-8`}
        >
            <input type="checkbox" className="hidden" id="toggle" checked={isChecked} onChange={handleToggle} />

            <label
                htmlFor="toggle"
                className={`absolute left-[2px] top-0 w-[30px] h-[30px] bg-gradient-border rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                    isChecked ? "translate-x-full" : ""
                }`}
            >
                <Image src={isChecked ? frame : vector} alt="frame or vector image"></Image>
            </label>
            <div className="absolute flex left-[5px] top-0 w-[30px] h-[30px]" style={{pointerEvents: "none"}}>
                <Image src={vectorWhite} alt="Vector Image" className={isChecked ? "" : "opacity-0"} />
            </div>
            <div className="absolute flex right-[1px] top-0 w-[30px] h-[30px]" style={{pointerEvents: "none"}}>
                <Image src={frameWhite} alt="Frame Image" className={isChecked ? "opacity-0" : ""} />
            </div>
        </div>
    );
}

export default SwitchBtn;
