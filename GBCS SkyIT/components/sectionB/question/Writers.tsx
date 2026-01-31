import React from 'react';
import ProfileCard from './ProfileCard';
import { Edit } from 'tabler-icons-react';

interface WritersProps {

}

const Writers: React.FC<WritersProps> = () => {
  const profiles = [
    {
      name: 'Tom',
      email: 'xyz@skyit.services.com',
      image: '/images/create-proposal-2/tom.svg',
    },
    {
      name: 'Spike',
      email: 'xyz@skyit.services.com',
      image: '/images/create-proposal-2/spike1.svg',
    },
  ];

  return (
    <div className="flex flex-col overflow-y-auto m-2">
    {profiles.map((profile, index) => (
      <div key={index} className="flex items-center ">
        <ProfileCard profile={profile} />
      </div>
    ))}
  </div>
  );
};

export default Writers;
