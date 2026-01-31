import React, {useState, useRef} from "react";
import ColorThief from "colorthief"; // Import ColorThief library
import {Button} from "@mantine/core";
import "./.d.ts";
import {useImageFile} from "./FormDataContext"
interface ColorSelectionComponentProps {
    onColorSelected: (colors: string[]) => void;
}

const ColorSwatches: React.FC<ColorSelectionComponentProps> = ({onColorSelected}) => {
    const [imageUrl, setImageUrl] = useState("");
    const {setImageFile} = useImageFile();

    const [colors, setColors] = useState<string[]>([]);
    const swatches = useRef<HTMLInputElement>(null);
    const [selectedFileName, setSelectedFileName] = useState<string>("");

    const handleButtonClick = () => {
        swatches.current?.click();
    };

    const componentToHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log(file);
        if (!file) return;
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageSrc = e.target?.result as string;
            setImageUrl(imageSrc);

            const image = document.createElement("img");
            image.crossOrigin = "Anonymous";
            image.onload = () => {
                const colorThief = new ColorThief();
                const colorPalette = colorThief.getPalette(image, 5);

                const hexColors = colorPalette.map((color: [number, number, number]) => rgbToHex(...color));
                setColors(hexColors);
                onColorSelected(hexColors);
            };

            image.src = imageSrc;
            setSelectedFileName(file.name);
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="relative">
            <div className="flex mx-auto">
                <Button
                    color="dark"
                    onClick={handleButtonClick}
                    className="relative mb-3 rounded-xl px-24 bg-gradient-border"
                    style={{width: "17vw"}}
                >
                    <span
                        style={{width: "auto", height: "33px", fontSize: "2vw"}}
                        className="text-[#DEBF1A] mx-auto mt-px font-normal text-25 absolute py-1 inset-0 bg-[#1a191a] flex flex-wrap content-center rounded-xl place-content-center"
                    >
                        Upload A Logo
                    </span>
                </Button>{" "}
                <span className="w-25 h-22 truncate mt-3 ml-1">{selectedFileName}</span>
            </div>

            <input type="file" ref={swatches} onChange={handleImageUpload} accept="image/*" className="hidden" />
            {colors.length > 0 && (
                <div className="flex justify-center">
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className="rounded-lg"
                            style={{
                                backgroundColor: color,
                                width: "50px",
                                height: "50px",
                                margin: "5px",
                            }}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ColorSwatches;
