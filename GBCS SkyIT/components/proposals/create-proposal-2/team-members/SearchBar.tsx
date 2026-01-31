import React from 'react';
import { Search } from 'tabler-icons-react';

const SearchBar: React.FC = () => {
  return (
    <div className="mt-4">
    <div className="relative flex items-center mb-4 ">
      <Search className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" size={20}/>
      <input
        type="text"
        placeholder="Search members by name or email"
        className="border-b border-b-yellow-400 bg-[#2F2F2F] text-white py-2 px-10 rounded-md h-8 w-3/4 placeholder-gray-400"
      />
    </div>
    </div>
  );
};

export default SearchBar;
