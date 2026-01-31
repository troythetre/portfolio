import React from 'react';

import Image from 'next/image'

const NextButton: React.FC = () => {
  return (
    <button className="col-start-8  justify-end flex items-center bg-transparent border-none ml-2 ">
      <span className='text-yellow-400 text-sm underline mr-2'>Next!</span>
      <Image src='/images/create-proposal-2/right-arrow.svg' alt='right-arrow' width={20} height={20}/>
    </button>
  );
};

export default NextButton;
