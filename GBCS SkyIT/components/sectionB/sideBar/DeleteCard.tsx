
import React from 'react';
import GoldBorderButton from './GoldBorderButton';

interface DeleteCardProps {
    onCancelDeleteCard: () => void;
    onConfirmDeleteClick: () => void
  }

  

const DeleteCard: React.FC<DeleteCardProps> = ({onCancelDeleteCard,onConfirmDeleteClick }) => {

   
    return (
        <div className='bg-[#555555] rounded-lg w-[524px] h-[220px] flex  flex-col items-center justify-center p-2 '>
            <div className='font-poppins text-white text-xl'>Are you sure you would like to delete this section?</div>
            <div className='flex flex-row  '>
                <div className='m-5'>
                    <GoldBorderButton label='Cancel' onClick={onCancelDeleteCard} height='h-[35px]' width='w-[109px]' />
                </div>
                <div className='m-5'>
                    <GoldBorderButton label='Delete' height='h-[35px]' width='w-[109px]' onClick={onConfirmDeleteClick}/>
                </div>
            </div>
        </div>
    );
};

export default DeleteCard;
