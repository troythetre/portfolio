import React from "react";
import ProfileDetailsButton from "./ProfileDetailsButton";
import logout from "../../public/images/logout.svg";
import settings from "../../public/images/manage_accounts.svg";
import Image from "next/image";
import {useRouter} from "next/router";

interface ProfileMenuDropdownProps {
    onMenuItemClick: (item: string) => void;
    onLogoutClick: () => void;
    email?: string;
    approvalsCount?: number;
    role1?: string;
}

const ProfileMenuDropdown: React.FC<ProfileMenuDropdownProps> = ({
    onMenuItemClick,
    onLogoutClick,
    role1,
}) => {
    const router = useRouter();

    const navigateToPath = (path: string) => {
        router.push({
            pathname: "/" + path,
        });
    };

    return (
        <div className="absolute transform w-[182px] -right-2 -top-2 bg-[#2f2f2f] rounded-xl shadow-lg z-50 mt-[5rem]">
            <div className="flex ml-2 p-3">
                <Image width={28} height={28} src={settings} alt="setting"></Image>
                <ProfileDetailsButton
                    style={{fontSize: "18px", cursor: "pointer"}}
                    onClick={() => navigateToPath("UserSettings")}
                    text="Settings"
                />
            </div>
            <div style={{borderBottom: "0.5px solid white", marginLeft: "25%", width: "58%"}}></div>
            <div className="flex ml-2 p-3">
                <Image style={{flexShrink: "0"}} width={28} height={28} src={logout} alt="logout"></Image>
                <ProfileDetailsButton
                    style={{fontSize: "18px", cursor: "pointer"}}
                    onClick={onLogoutClick}
                    text="Log Out"
                />
            </div>
        </div>
    );
};

export default ProfileMenuDropdown;
