import React from 'react';
import Image from 'next/image';

interface Profile {
  name: string;
  email: string;
  image: string;
}

interface ProfileCardProps {
  profile: Profile;
  width?: string;
  height?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile , width, height }) => {
  const { name, email, image } = profile;

  return (
    <div className={`flex flex-col bg-white rounded-xl shadow-lg w-${width} max-w-md sm:max-w-xl m-1  my-2 p-1`}>
      <div className="flex items-center ">
        {/* profile photo */}
        <div className="w-16 h-16 sm:w-10 sm:h-10 bg-white rounded  ">
          <Image
            src={image} // Path to your image in the public directory
            alt="Profile Photo"
            width="100px" // Set the desired width
            height="100px" // Set the desired height
            className="w-full h-full object-cover bg-white rounded flex-shrink-0"
          />
        </div>
        {/* name and email */}
        <div className="ml-1">
          <span className="text-black font-bold text-xs ">
            {name}
          </span>
          <p className="text-xs text-gray-600 m-0">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
