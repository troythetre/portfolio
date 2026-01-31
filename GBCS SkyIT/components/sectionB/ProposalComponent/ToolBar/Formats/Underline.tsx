import React from 'react';
import Image from "next/image";
import underline from '../../../../../public/images/edit-proposal/underline.svg';

const Underline = () => {

  const handleUnderlineClick = () => {
    // Wrap the selected text in <u> tags
    document.execCommand('underline');
  };

  return (
    <div className='flex justify-center rounded-md'  >
      <Image src={underline} onClick={handleUnderlineClick} width={35} height={35} alt='underline'/>
    </div>
  );
};

export default Underline;