import React from "react";
import { ChromePicker } from "react-color"; // Import ChromePicker from react-color

const ColorWheel = ({ selectedColorSwatch, onColorChange, onClose }) => {
  return (
    <div>
      <ChromePicker
        color={selectedColorSwatch}
        onChange={(color) => onColorChange(color.hex)}
        onClose={onClose}
      />
    </div>
  );
};

export default ColorWheel;
