import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicAdminDuplicateResponses = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="max-w-screen-sm bg-zinc-900 text-white p-0 border border-solid border-yellow-300 rounded-lg flex flex-col items-center justify-center mx-auto h-full relative" style={{ width: '800px', height: '300px' }}>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-yellow-300 font-bold cursor-pointer bg-transparent border-none"
          >
            X
          </button>
          <div className="inner-container flex flex-col items-center justify-center text-center mt-2">
            <h2 className="text-white-300 text-2xl mb-4 font-normal font-poppins">Duplicate Responses Detected</h2><p></p>
            <p className="text-white-300 text-xl mb-8"> 
              Some responses already exist in the library. Would <br /> you like to keep both sets or replace the duplicates?
            </p>
          </div>
          <div style={{ height: '18px' }}></div> 
          <div className="flex justify-between mt-2">
            <button 
              className="bg-transparent border-2 border-yellow-300 rounded-lg p-2 ml-2 text-center text-yellow-300 font-poppins text-base cursor-pointer"
              style={{ width: '100px', height: '40px' }}
              
            >
             Keep
            </button>
            <div style={{ width: '300px' }}></div> 
            <button
              className="bg-transparent border-2 border-yellow-300 rounded-lg p-2 mr-2 text-center text-yellow-300 font-poppins text-base cursor-pointer"
              style={{ width: '100px', height: '40px' }}
            >
              Replace
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Used dynamic import for client-side rendering to avoid unhandled hydrating runtime error
const AdminDuplicateResponses = dynamic(() => Promise.resolve(DynamicAdminDuplicateResponses), { ssr: false });

export default AdminDuplicateResponses;
