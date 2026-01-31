import React from 'react';
import Image from "next/image";
import list from '../../../../../public/images/edit-proposal/list.svg';

const BulletedList = () => {
    const handleBulletedListClick = () => {
        // Insert a bulleted list at the current selection
        document.execCommand('insertUnorderedList');
    };

    return (
        <div className='flex justify-center rounded-md'>
            <Image src={list}
                onClick={handleBulletedListClick}
                width={35} height={35}
                alt='list'
            />
        </div>
    );
};

export default BulletedList;