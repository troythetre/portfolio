import React from 'react';
import { Search } from 'tabler-icons-react';
import SearchBar from './SearchBar';
import ProfileCard from './ProfileCard'

const profiles = [
  {
    name: 'Tom',
    email: 'tom@skyit.services.com',
    image: '/images/create-proposal-2/tom.svg',
  },
  {
    name: 'Spike',
    email: 'tom@skyit.services.com',
    image: '/images/create-proposal-2/spike1.svg',
  },
  {
    name: 'Spike',
    email: 'tom@skyit.services.com',
    image: '/images/create-proposal-2/spike2.svg',
  },
  {
    name: 'Spike',
    email: 'tom@skyit.services.com',
    image: '/images/create-proposal-2/spike3.svg',
  },

];

const AddTeamMembers: React.FC = () => {
  return (
      <div className="bg-black p-4 mb-4 border-solid border-gray-400 rounded-lg ">
          <span className="text-lg font-semibold text-white mb-4 font-['ui-serif']">
            Add your team members for this project!!
          </span>
          <SearchBar />
          <div className="mt-8">
            <span className="text-md font-semibold text-white mb-4 font-['ui-serif']">
              Currently selected team
            </span>
          </div>
          <div className="mt-3 mb-20">
          <div className="flex overflow-x-auto ">
              {profiles.map((profile, index) => (
                <ProfileCard key={index} profile={profile} />
              ))}
            </div>
          </div>
      </div>
  );
};

export default AddTeamMembers;
