// ProfileInfo.tsx
import React, { useState, useEffect } from "react";
import { Text } from "@mantine/core";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { BASEURL } from "../../constants";
import { useUser } from "../sectionA/NewProposal/FormDataContext";

// Define the user data type
interface UserData {
  displayName?: string;
  role?: string;
  photoURL?: string;
}

interface ProfileInfoProps {
  isAdmin: boolean;
  isMenuOpen: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ isAdmin, isMenuOpen }) => {
  const { user } = useUser();

  const displayImage = user.photoURL ? (
    <img
      src={user.photoURL}
      alt="Profile Picture"
      className="rounded-full"
      style={{ height: "54px", width: "54px" }} // Adjust size as needed
    />
  ) : (
    <AccountCircleIcon
      sx={{
        height: "54px",
        width: "54px",
      }}
      className="-ml-10"
    />
  );

  return (
    <div className="flex">
      <div className="relative">{displayImage}</div>

      <div className="text-center flex flex-col font-poppins">
        <Text className="text-25" style={{ fontFamily: "Poppins, sans-serif" }}>
          {user.displayName}
        </Text>
        <Text
          size="xs"
          style={{ fontFamily: "Poppins, sans-serif" }}
          className="bg-gradient-border w-4/5 m-auto font-bold rounded-xl text-black mt-1"
        >
          {user.role}
        </Text>
      </div>
    </div>
  );
};

export default ProfileInfo;
