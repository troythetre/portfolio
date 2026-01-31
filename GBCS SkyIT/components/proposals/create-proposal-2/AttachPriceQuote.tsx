import React from 'react'
import { Plus } from 'tabler-icons-react';


const AttachPriceQuote:React.FC = () => {
    return (
        <div className="bg-black p-10 mb-4 border-solid border-gray-400 rounded-l flex justify-center items-center ">
            <button className="flex justify-center border-solid border-yellow-500 bg-transparent rounded-lg p-3 flex items-center justify-center space-x-2 text-white font-sans font-bold w-1/7 h-14 ">
                <Plus size={50} color={'yellow'}   strokeWidth={3}/>
                <span className='pl-4'>Attach Price Quote</span> 
            </button>
        </div>
            
    );
}

export default AttachPriceQuote