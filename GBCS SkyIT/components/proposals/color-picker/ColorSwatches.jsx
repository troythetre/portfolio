import React from "react";
import ColorSwatch from "./ColorSwatch"; // Import your ColorSwatch component

const ColorSwatches = ({ colors, onColorSwatchClick }) => {
  const containerStyle = {
    maxHeight: "10rem",
    overflowY: "scroll",
    scrollbarColor: "",
    maxWidth: "100%",
    overflowX: "hidden",
  };

  return (
    <div className="color-swatches-container overflow-visible" style={containerStyle}>
      <div className="grid grid-cols-4 grid-flow-row gap-2">
        {colors.map((color, index) => (
          <ColorSwatch
            key={index}
            index={index}
            color={color}
            onColorSwatchClick={onColorSwatchClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSwatches;
