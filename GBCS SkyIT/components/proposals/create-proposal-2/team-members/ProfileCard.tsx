import React from 'react';
import Image from 'next/image';

interface Profile {
  name: string;
  email: string;
  image: string;
}

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const { name, email, image } = profile;

  return (
    <div className="flex flex-col bg-[#555555] rounded-xl shadow-lg p-1 w-2/6 h-26 mr-4">
      <div className="flex items-center ml-3 mr-1 mt-2">
        {/* profile photo */}
        <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0">
          <Image
            src={image} // Path to your image in the public directory
            alt="Profile Photo"
            width={100} // Set the desired width
            height={100} // Set the desired height
            className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"
          />
        </div>
        {/* name and email */}
        <div className="ml-2">
          <span className="text-[#FFFFFF] font-bold">{name}<p className="text-[10px] text-[#B5B5B5] font-normal m-0">{email}</p></span>
        </div>
      </div>
      {/* buttons */}
      <div className="flex justify-between mt-4 mb-1">
        <button className="text-black text-[10px] border-none bg-gradient-to-t from-[#DEBF1A] via-[#F2E28A] via-[#CDB016] to-[#EDDA75] rounded-xl  w-20 h-5">
          Assign Lead
        </button>
        <button className="text-[#B5B5B5] bg-transparent border-[##B5B5B5] border-solid rounded-xl text-[9px] w-16 h-5">
          Remove
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
