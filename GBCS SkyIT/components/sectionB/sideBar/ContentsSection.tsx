// components/ContentsSection.tsx
import React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';



const ContentsSection: React.FC<{ toggleTableOfContents: () => void }> = ({ toggleTableOfContents }) => {
  
  return (
    <div className='text-white font-poppins flex flex-row self-start mx-5'>
      Contents
      <div className='ml-0 sm:ml-16 md:ml-32 lg:ml-64 xl:ml-[250px]' onClick={toggleTableOfContents}>
        <KeyboardArrowUpIcon style={{ fill: 'white', fontSize: 30 }} />
      </div>
    </div>
  );
};

export default ContentsSection;
