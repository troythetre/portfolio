import React from "react";
import Image from "next/image";
import { SquarePlus } from 'tabler-icons-react';

const ColorSwatch = ({ index, color, onColorSwatchClick }) => {
  // Use the `bgColor` prop to set the background color dynamically
  const customBgColor = color.hex || "#FFFFFF"; // Provide a default color if not provided

  if (index === 0) {
    // Render a custom gradient swatch for the first swatch
    return (
      <div
        key={index}
        className="rounded overflow-hidden shadow-3xl w-[60px] h-[60px] p-[16px] m-[10px] bg-gradient-to-r from-yellow-500 via-blue-500  to-red-500  flex content-center pt-2  order-last"
        onClick={() => {
          onColorSwatchClick(customBgColor);
        }}
      >
        <SquarePlus size={48} strokeWidth={2} color={'white'} onClick={() => onColorSwatchClick(customBgColor) } />
      
      </div>
    );
  } else {
    // Render a regular color swatch for the other swatches
    return (
      <div
        key={index}
        className="rounded overflow-hidden shadow-3xl w-[60px] h-[60px] p-[16px] m-[10px]"
        style={{ backgroundColor: customBgColor }}
        onClick={() => {
          onColorSwatchClick(customBgColor);
        }}
      ></div>
    );
  }
};

export default ColorSwatch;
