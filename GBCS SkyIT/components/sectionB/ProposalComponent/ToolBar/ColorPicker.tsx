import React, {useState, useEffect, useRef} from "react";
import {ColorResult, SketchPicker} from "react-color";

interface ColorPickerProps {
    style: boolean;
    htmlContent: string;
    setHtmlContent: React.Dispatch<React.SetStateAction<string>>;
}

const ColorPicker: React.FC<ColorPickerProps> = ({style, htmlContent, setHtmlContent}) => {
    // console.log(htmlContent);

    const [selectedColor, setSelectedColor] = useState("#000000");
    const focusedElementRef = useRef<HTMLElement | null>(null);

    const handleBackgroundColorChange = (color: ColorResult) => {
        const hexColor = color.hex;
        setSelectedColor(hexColor);
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlContent;
        console.log(tempDiv);
        console.log(htmlContent);

        const contentEditableElement = tempDiv.querySelector("[contentEditable]");
        if (contentEditableElement) {
            contentEditableElement.style.backgroundColor = hexColor;
        }
        // Get the updated HTML content with the modified style
        const updatedContent = tempDiv.innerHTML;
        setHtmlContent(updatedContent);
        console.log(updatedContent);
    };

    return (
        <div className={`${style ? "block" : "hidden"}`}>
            <SketchPicker
                color={selectedColor}
                onChange={handleBackgroundColorChange}
                styles={{
                    picker: {
                        width: "225px",
                        height: "350px",
                        padding: "10px 10px 0px",
                        boxSizing: "initial",
                        background: "#555555",
                        borderRadius: "4px",
                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px",
                    },
                }}
            />
        </div>
    );
};

export default ColorPicker;
