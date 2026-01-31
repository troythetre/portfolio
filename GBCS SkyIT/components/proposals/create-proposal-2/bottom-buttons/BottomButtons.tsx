import React from 'react';
import NextButton from './NextButton';
import SaveButton from './SaveButton';
const BottomButtons: React.FC = () => {
    return (
        <div className='grid grid-cols-8 gap-4 '>
            <SaveButton/>
            <NextButton/>
        </div>
    )
}

export default BottomButtons;