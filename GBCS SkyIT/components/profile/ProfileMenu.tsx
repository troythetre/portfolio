import React, { FC, useState } from "react";
import ProfileMenuDropdown from "./ProfileMenuDropdown";
import ProfileInfo from "./ProfileInfo";
import { getAuth, signOut } from "firebase/auth";
import Typography from "@mui/material/Typography";

interface ProfileMenuProps {
    name: string;
    role1: string;
    email?: string;
}

const ProfileMenu = React.forwardRef<HTMLDivElement, ProfileMenuProps>(
    ({ name, role1, email }, ref) => {
        const isAdmin = role1 === "admin";
        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [isModalOpen, setIsModalOpen] = useState(false);

        const toggleMenu = () => {
            setIsMenuOpen(!isMenuOpen);
        };
        const toggleModal = () => {
            setIsModalOpen(!isModalOpen);
        }
        const handleMenuItemClick = (item: string) => {
            // Handle menu item click here
            console.log(`Clicked on ${item}`);
        };
        const handleLogout = () => {
            const auth = getAuth();
            signOut(auth)
                .then(() => {
                    // Redirect to login page upon successful logout
                    window.location.href = "/login";
                })
                .catch((error) => {
                    // Handle logout error
                    console.error("Logout error", error);
                });
        };

        return (
            <div className="flex flex-col relative" onClick={toggleMenu} ref={ref}>
                <ProfileInfo isMenuOpen={isMenuOpen} role1={role1} isAdmin={isAdmin} name={name} />

                {/* {!isMenuOpen && <div style={{borderBottom: "1px solid #DEBF1A"}} className="mt-3"></div>} */}

                <div className="mt-3 ">
                    {isMenuOpen && (
                        <ProfileMenuDropdown
                            onMenuItemClick={handleMenuItemClick}
                            onLogoutClick={toggleModal}
                            email={email}
                            role1={role1}
                        />
                    )}
                    {isModalOpen && (
                        <dialog
                            className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center">
                            <div className="w-[450px] h-[200px] rounded-[15px] bg-[#555555] shadow-lg relative">
                                <div className="flex flex-col items-center text-white py-[30px]">
                                    <br></br>
                                    <Typography
                                        display={'flex'}
                                        color={'F4F2F2'}
                                        font-family="Poppins"
                                        fontSize={25}
                                        font-style="normal"
                                        fontWeight={400}
                                        lineHeight={'41px'}
                                        letterSpacing={0.375}
                                    >
                                        Are you sure you want to log out?
                                    </Typography>
                                    <br />

                                    <div className="flex px-[30px] gap-[45px]">
                                        <button type="button" className="flex h-[35px] bg-inherit border-solid border-2 border-GBCS-yellow rounded-[5px] text-GBCS-yellow px-6 py-4 rounded-x1  hover:text-black hover:mantine-Text-root hover:bg-gradient-border " onClick={toggleModal}> <Typography
                                            display={'flex'}
                                            color={'F4F2F2'}
                                            font-family="Poppins"
                                            fontSize={15}
                                            font-style="bold"
                                            fontWeight={400}
                                            lineHeight={'25px'}
                                            letterSpacing={0.375}
                                        >Cancel </Typography></button>

                                        <button type="button" className="flex h-[35px] bg-inherit border-solid border-2 border-GBCS-yellow rounded-[5px] text-GBCS-yellow px-6 py-4 rounded-x1  hover:text-black hover:mantine-Text-root hover:bg-gradient-border " onClick={handleLogout}> <Typography
                                            display={'flex'}
                                            color={'F4F2F2'}
                                            font-family="Poppins"
                                            fontSize={15}
                                            font-style="bold"
                                            fontWeight={400}
                                            lineHeight={'25px'}
                                            letterSpacing={0.375}
                                        >Log Out</Typography></button>
                                    </div>
                                </div>

                            </div>
                        </dialog>
                    )}
                </div>
            </div>
        );
    }
);
ProfileMenu.displayName = "ProfileMenu";

export default ProfileMenu;
