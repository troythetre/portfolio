import React, { useState, useEffect } from 'react';
import glasses from '../../../../public/images/searchbar/magnifying_glass.svg';
import filter_icon from '../../../../public/images/searchbar/filter_icon.svg';
import Image from 'next/image';

function SearchBar({ data, setFilteredData, onSearch })  {
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setSearchInput('');
  }, []);

  // Search Items
  const searchItems = (searchValue) => { 
    setSearchInput(searchValue);
    console.log('Searched item:', searchValue); // Print Searched Item
    filterData(searchValue);
  };

// Filtering Data

const filterData = (searchValue) => {
  
  if (searchValue.trim().length > 0) {
    const filteredData = data?.filter((item) =>
      Object.values(item).some((value) =>
        value &&
        typeof value === 'string' &&
        value.toLowerCase().trim().replace(/\s+/g, " ").includes(searchValue.trim().replace(/\s+/g, " ").toLowerCase())
      )
    );    
    console.log('Filtered data:', filteredData);
    setFilteredData(filteredData || []); // Update filteredData state with filtered data or empty array if no match
  } else {
    // If nothing is typed in the search bar, set filteredData to all responses
    setFilteredData(data || []);
  }
};


  return (
    <div className="relative bg-gradient-border w-[100%] h-[40px] rounded mt-0">
      <input
        type="text"
        placeholder="Type to search..."
        className="relative bottom-[3px] bg-[#2F2F2F] w-[100%] h-[40px] rounded border-0 px-30 py-1 text-[#919191] text-[17px]"
        value={searchInput}
        onChange={(e) => searchItems(e.target.value)}
      />
      
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "5px",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          zIndex: "1", // Set a higher z-index to bring the image forward
        }}
      >
        <Image src={glasses} alt="Glasses" />
      </div>
      <button onClick={() => filterData(searchInput)}
        style={{
          position: 'absolute',
          top: '50%',
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