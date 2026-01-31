import React from "react";

interface ProfileDetailsButtonProps {
    onClick: () => void;
    text: string;
    style?: React.CSSProperties;
}

const ProfileDetailsButton: React.FC<ProfileDetailsButtonProps> = ({ onClick, text,style }) => {
  return (
    <button
      onClick={onClick}
      className="bg-transparent bg-clip-text text-transparent bg-white hover:bg-gradient-text bg-gradient-text font-poppins text-18 font-medium py-[0.6rem] border-0 focus:outline-none hover:underline hover:text-GBCS-yellow"
      style={style} 
    >
      {text}
    </button>
  );
};

export default ProfileDetailsButton;
