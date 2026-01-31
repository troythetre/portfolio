import React, { useState } from "react";
import glasses from "../../public/images/searchbar/magnifying_glass.svg";
import filter_icon from "../../public/images/searchbar/filter_icon.svg";
import Image from "next/image";

interface SearchBarProps {
  setResults: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ setResults }) => {
    const [input, setInput] = useState<string>("");
    const handleChange = (value: string) => {
        setInput(value);
        setResults(value);
    };

    return (
        <div className="relative bg-gradient-border w-full h-[36px] rounded">
            <input
                type="text"
                placeholder="Search..."
                className="relative bottom-[3px] bg-[#2F2F2F] w-full h-[38px] rounded border-0 px-30 py-1 text-white"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "5px",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    zIndex: "1", // Set a higher z-index to bring the image forward
                }}
            >
                <Image src={glasses} alt="Glasses" />
            </div>

            <button
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "5px",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    zIndex: "1",
                }}
            >
                <Image src={filter_icon} alt="filter" />
            </button>
        </div>
    );
};
