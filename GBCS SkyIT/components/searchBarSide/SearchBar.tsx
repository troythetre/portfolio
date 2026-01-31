import React from 'react';
import glasses from '../../public/images/searchbar/magnifying_glass.svg';
import filter_icon from '../../public/images/searchbar/filter_icon.svg';
import Image from 'next/image';

function SearchBar(){
  const filter = () => {

  }

  return (
    <div className='relative bg-gradient-border w-[100%] h-[40px] rounded mt-5'>
      <input
        type='text'
        placeholder='Search...'
        className="relative bottom-[3px] bg-[#2F2F2F] w-[100%] h-[38px] rounded border-0 px-8 py-1 text-[#919191]"
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '5px',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          zIndex: '1', // Set a higher z-index to bring the image forward
        }}
      >
        <Image src={glasses} alt="Glasses" />
      </div>

      <button onClick={filter}
        style={{
          position: 'absolute',
          top: '50%',
          right: '5px',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: '1',
        }}>
        <Image src={filter_icon} alt='filter'/>
      </button>
    </div>
  )
}

export default SearchBar;