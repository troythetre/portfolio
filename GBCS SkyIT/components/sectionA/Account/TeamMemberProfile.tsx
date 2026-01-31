import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUser } from "../NewProposal/FormDataContext";

export default function TeamMember() {
    const { user } = useUser();
    const [error, setError] = useState(null);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    const displayName = user.displayName || "your name";
    const role = user.role || "user";
    const displayImage = user.photoURL ? (
        <img
            src={user.photoURL}
            alt="User Photo"
            className="rounded-full"
            style={{ width: "180px", height: "180px", objectFit: "cover" }}
        />
    ) : (
        <AccountCircleIcon
            sx={{
                height: "180px",
                width: "180px",
            }}
        />
    );
    return (
        <div className="flex justify-between">
            <div className="pt-0">
                {/* <AccountCircleIcon className="text-150" /> */}
                {displayImage}
                <div className="inline pt-35 pl-10 absolute ">
                    <div className="inline text-30 mt-12 text-white">{displayName}</div>
                    <div className="pt-12">
                        <div className="absolute w-100 p-1 flex justify-center text-15 bg-GBCS-yellow text-black font-bold rounded-full">
                            {role}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8">{/* <GenerateCode /> */}</div>
        </div>
    );
}
