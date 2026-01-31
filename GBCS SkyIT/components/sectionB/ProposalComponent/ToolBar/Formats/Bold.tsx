import React from 'react';
import Image from "next/image";
import bold from '../../../../../public/images/edit-proposal/bold.svg'

const Bold = () => {
  const handleBoldClick = () => {
    // Wrap the selected text in <strong> tags
    document.execCommand('bold');
  };
  return (
    <div className='flex justify-center rounded-md'>
      <Image src={bold} onClick={handleBoldClick} width={35} height={35} alt='bold'/>
    </div>
  );
};

export default Bold;