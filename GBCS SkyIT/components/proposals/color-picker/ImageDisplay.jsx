import React from 'react';
import Image from 'next/image';

const ImageDisplay = ({ imageSrc }) => {
  return (
    imageSrc && (
      <div className="mb-4">
        <Image src={imageSrc} alt="Uploaded Image" width={300} height={200} />
      </div>
    )
  );
};

export default ImageDisplay;
