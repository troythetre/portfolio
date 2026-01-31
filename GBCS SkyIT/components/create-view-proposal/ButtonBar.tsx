// components/create-view-proposal/ButtonBar.tsx

import React from 'react';
import Button from './Button';
import { Plus } from 'tabler-icons-react';
import { FileDescription } from 'tabler-icons-react';
import { useRouter } from 'next/router';

const ButtonBar: React.FC = () => {
    const router = useRouter();

     const handleButtonClick = () => {
         router.push('/proposals'); // Navigate to the specified path
         };
    return (
        <div className="absolute bottom-40 left-20 right-20 flex justify-between p-4">
            <Button label="Create A New Proposal" icon={<Plus size={40} color="yellow" strokeWidth={3} />} />
            <Button label="Review Existing Proposal" icon={<FileDescription size={40} color="yellow" strokeWidth={2} onClick={handleButtonClick}/>} />
        </div>
    );
};

export default ButtonBar;
