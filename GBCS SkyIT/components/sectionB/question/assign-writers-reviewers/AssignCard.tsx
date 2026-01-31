import React, { useState } from 'react';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ProfileCard from '../ProfileCard';

interface AssignCardProps {
  editType: string;
  onCancel: () => void;
}

const AssignCard: React.FC<AssignCardProps> = ({ editType, onCancel }) => {
    const profiles = [
        {
          name: 'Tom',
          email: 'xyz@skyit.services.com',
          image: '/images/create-proposal-2/tom.svg',
        },
        {
            name: 'Jerry',
            email: 'xyz@skyit.services.com',
            image: '/images/create-proposal-2/tom.svg',
          },
      ];

  return (
    <div className="bg-card-bg p-2 rounded-xl shadow-md flex flex-col items-center justify-start w-[400px] h-[500px] ">
      <div onClick={onCancel} className=" self-start">
                <ArrowCircleLeftIcon style={{ fill: 'gold' }} sx={{ fontSize: 40 }} />
        </div>
      <h3 className="text-lg font-semibold mb-4 text-white">{`Assign ${editType}`}</h3>
      <select className="border-b-yellow-500 border-2 w-[380px] h-[50px] rounded-xl bg-accent-color text-grey text-md  my-5">
            <option value="" disabled selected>Enter a member name or email</option>
            <option value="sectionA">Section A</option>
            <option value="sectionB">Section B</option>
            <option value="sectionC">Section C</option>
      </select>
      <div className="flex flex-wrap justify-between max-w-[400px] mr-3">
            {profiles.map((profile, index) => (
                <div key={index} className="flex items-center  mb-2 h-[50px]" style={{ width: '48%' }}>
                <ProfileCard profile={profile}  />
                </div>
            ))}
      </div>
    </div>
  );
};

export default AssignCard;


