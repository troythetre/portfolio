import React from 'react'
import AddTeamMembers from './team-members/AddTeamMembers';
import AttachPriceQuote from './AttachPriceQuote';
import NextButton from './bottom-buttons/NextButton';
import SaveButton from './bottom-buttons/SaveButton';
import BottomButtons from './bottom-buttons/BottomButtons';


const Page2 : React.FC = () => {
    return (
        <div className='bg-black p-8 h-full flex flex-col justify-end'>
            {/* add title and progress bar here --> common elements for all pages */}
            <AddTeamMembers />
            <AttachPriceQuote />
            <BottomButtons/>
      </div>
      
    );
}


export default Page2;