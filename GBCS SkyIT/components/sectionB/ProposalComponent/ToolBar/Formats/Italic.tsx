import React from 'react';
import Image from "next/image";
import italic from '../../../../../public/images/edit-proposal/italic.svg';

const Italic = () => {
  const handleItalicClick = () => {
    // Wrap the selected text in <em> tags
    document.execCommand('italic');
  };

  return (
    <div className='flex justify-center rounded-md' >
      <Image src={italic} onClick={handleItalicClick} width={35} height={35} alt='italic'/>
    </div>
  );
};

export default Italic;