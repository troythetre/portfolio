
import React, { useState, useEffect } from 'react';
import UploadButton from './UploadButton';
import ColorSwatches from './ColorSwatches';
import ImageDisplay from './ImageDisplay';
import { extractColors } from 'extract-colors';
import Button from './Button';
import ColorWheel from './ColorWheel';

const MainPage = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [colors, setColors] = useState([]);
  // color wheel code
  const [selectedColorSwatch, setSelectedColorSwatch] = useState(null); // State to manage selected color
  const [showColorWheel, setShowColorWheel] = useState(false);// State to manage color wheel visibility


  const handleColorWheelColorSelect = (selectedColor) => {
    // Add the selected color to the colors state
    setColors([...colors, { hex: selectedColor }]);
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    setShowColorWheel(false)
  };
  const handleColorSwatchClick = (color) => {
    if (selectedColorSwatch === color) {
      showColorWheel ? setShowColorWheel(false): setShowColorWheel(true); // switch the color wheel if the same color is clicked
    } else {
      setSelectedColorSwatch(color);
      setShowColorWheel(true); // Open the color wheel if a different color is clicked
    }
  };
  useEffect(() => {
    const extractImageColors = async () => {
      if (imageSrc ) {
        try {
          const colorPalette = await extractColors(imageSrc);
          setColors(colorPalette);
        } catch (error) {
          console.error(error);
        }
      }
    };

    extractImageColors();
  }, [imageSrc]);

  return (
    <div className="p-3 flex flex-row">
      <div className="basis-1/4 flex flex-col ">
       {/* Temporary image and upload button to test */}

       <ImageDisplay imageSrc={imageSrc} />
      <UploadButton onChange={handleFileChange} />
      </div>
     
      <div className='basis-1/2 max-w-xs rounded-xl shadow-lg p-10 bg-[#2F2F2F]  sm:w-[90%] sm:max-w-sm md:w-[80%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] mx-auto flex flex-col ml-2 '>
        <div className='flex justify-center flex-col  mb-8 '>
          <span className='text-center text-white mb-2 text-lg'>From the File you have uploaded, we found these colors</span>
          {/* Colors in the image */}
          {imageSrc && <ColorSwatches colors={colors} onColorSwatchClick={handleColorSwatchClick}/>} 
        </div>
        <div className='mt-auto flex flex-wrap flex-row justify-center gap-6  '>
          <Button text="Retry"  />
          <Button text="Okay" />
        </div>
      </div>
      <div className='basis-1/2 m-5'>
        {/* Conditionally render the ColorWheel */}
      {showColorWheel && (
        <ColorWheel 
          selectedColorSwatch={selectedColorSwatch} 
          onColorChange={handleColorWheelColorSelect} // Pass the color selection function
        />
      )}
    </div>
      
    </div>
  );
}
export default MainPage;