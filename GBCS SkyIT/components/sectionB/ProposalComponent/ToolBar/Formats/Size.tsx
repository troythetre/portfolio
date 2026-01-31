import React, { useRef, useState } from "react";
import { ReactSVG } from "react-svg";

interface ToolbarProps {
  htmlContent: string;
  setHtmlContent: (newHtmlContent: string) => void;
}

const FontSize = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<string>("16px"); // Default font size

  const handleDropdownClick = () => {
    setIsOpen(!isOpen); // Set isOpen state to true when the dropdown is clicked
  };
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFontSize = e.target.value;
    let commandArg: string;

    switch (selectedFontSize) {
      case "10px":
        commandArg = "1";
        break;
      case "13px":
        commandArg = "2";
        break;
      case "16px":
        commandArg = "3";
        break;
      case "18px":
        commandArg = "4";
        break;
      case "24px":
        commandArg = "5";
        break;
      case "32px":
        commandArg = "6";
        break;
      case "48px":
        commandArg = "7";
        break;
      default:
        commandArg = "3"; // Default to font size "16px" (size "3" in execCommand)
        break;
    }

    setFontSize(selectedFontSize);
    document.execCommand("fontSize", false, commandArg);
  };

  return (
    <div className="flex justify-center relative rounded-md">
      <ReactSVG
        src="/images/edit-proposal/size.svg"
        onClick={handleDropdownClick}
      />
      {isOpen && (
        <select
          onChange={handleFontSizeChange}
          value={fontSize}
          className="absolute right-14 text-[#FFFFFF] bg-[#555555] p-4 text-[24px]"
          size={7}
        >
          <option value="10px" className="p-2">
            10
          </option>
          <option value="13px" className="p-2">
            13
          </option>
          <option value="16px" className="p-2">
            16
          </option>
          <option value="18px" className="p-2">
            18
          </option>
          <option value="24px" className="p-2">
            24{" "}
          </option>
          <option value="32px" className="p-2">
            32
          </option>
          <option value="48px" className="p-2">
            48
          </option>
        </select>
      )}
    </div>
  );
};

export default FontSize;
