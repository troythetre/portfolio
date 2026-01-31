import React from 'react';

interface SetDeadlineTitleProps {
    title: string;
}

export const SetDeadlineTitle: React.FC<SetDeadlineTitleProps> = ({ title }) => {
    return <span className='text-white text-xl'>Set a Deadline for {title}</span>;
};

