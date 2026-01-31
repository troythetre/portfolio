import React from 'react';

const Button = ({ text }) => {
  return (
    <button className='bg-transparent border border-yellow-500 rounded-xl w-[120px] h-[30px]'>
      <span className='text-yellow-500  text-xs'>{text}</span>
    </button>
  );
};

export default Button;
