import React, { useState, useEffect } from 'react';
import glasses from '../../../../public/images/searchbar/magnifying_glass.svg';
import filter_icon from '../../../../public/images/searchbar/filter_icon.svg';
import Image from 'next/image';

function SearchBar({ data, setFilteredData, onSearch })  {
  const [searchInput, setSearchInput] = useState('');

  // Search Items
  const searchItems = (searchValue) => { 
    setSearchInput(searchValue);
    console.log('Searched item:', searchValue); // Print Searched Item
    filterData(searchValue);
  };


// Filtering Data

const filterData = (searchValue) => {
  try {
    if (searchValue !== '') {
      const filteredData = (data?.responses?.filter((item) =>
        Object.values(item).some((value) =>
          value && typeof value === 'string' && value.toLowerCase().includes(searchValue.toLowerCase())
        )
      )) || [];
      console.log('Filtered data:', filteredData);
      onSearch(filteredData); // Call onSearch with filtered data
    } else {
      // If nothing is typed in the search bar, set filteredData to all responses
      setFilteredData(data?.responses || []);
    }
  } catch (error) {
    console.error('Error filtering data:', error);
    setFilteredData(data?.responses || []);
  }
};


 
return (
  <div className="relative bg-gradient-border w-[100%] h-[50px] rounded mt-0 ml-0">
    <input
      type="text"
      placeholder="Type to search"
      value={searchInput}
      onChange={(e) => searchItems(e.target.value)}
      className="absolute inset-x-0 top-0 bg-[#2F2F2F] w-[100%] h-[20px] px-6 rounded-bottom-lg
                 pt-35 pb-10 mt-0 text-[#919191] text-xl text-left"
    />
    
      
      <div
        style={{
          position: 'absolute',
          top: '75%',
          left: '5px',
          transform: 'translateY(-60%)',
          background: 'none',
          border: 'none',
          zIndex: '1', // Set a higher z-index to bring the image forward
        }}
      >
        <Image src={glasses} alt="Glasses" />
      </div>
      <button
        onClick={() => filterData(searchInput)}
        style={{
          position: 'absolute',
          top: '70%',
          right: '10px',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: '1',
        }}
      >
        <Image src={filter_icon} alt="filter" />
      </button>
    </div>
  );
}

export default SearchBar; 
