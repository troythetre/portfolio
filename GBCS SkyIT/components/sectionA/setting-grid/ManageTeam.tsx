import React, { useState, useEffect, ReactNode } from "react";
import styles from "../../sectionB/sideBar/styles.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BASEURL } from "../../../constants";
import { FaRegEdit } from "react-icons/fa";
import GoldBorderButton from "../../sectionB/sideBar/GoldBorderButton";
import Image from "next/image";
import OverlayComponent from "../../sectionB/sideBar/OverlayComponent";
import SubmitSuccessfully from "../../sectionB/sideBar/SubmitSuccessfully";

interface User {
    isLead: string;
    teamMember_email: string;
    displayName: string;
    userEmail: string;
    photoURL: string;
    role: string;
    permissions: string[];
}

interface TeamMember {
    isLead: any;
    teamMember_email: string; // Define the type for team members
    userEmail: string;
}
interface ManageTeamProps {
    proposalID: string;
    onClose: () => void; // Ensure onClose is received as a prop
}

export default function ManageTeam({ proposalID, onClose }: ManageTeamProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState<
        {
            displayName: any;
            name: string;
            userEmail: string;

            role: string;
            permissions: string[];
        }[]
    >([]);

    console.log("proposalID:", proposalID);
    const [teamMemberData, setTeamMemberData] = useState<TeamMember[]>([]);

    const [overlays, setOverlays] = useState<{ showSuccessCard: boolean }>({
        showSuccessCard: false,
    });

    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: !prevOverlays[overlayName] }));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: false }));
    };

    const existingTeamMembers = async () => {
        const response = await fetch(`${BASEURL}/api/proposal/team-members/${proposalID}`, {
            method: "GET",
            credentials: "include",
        });
        const teamMember = await response.json();
        setTeamMemberData(teamMember.teamMembers);
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/all-users`, {
                method: "GET",
                credentials: "include"
            });
            const users = await response.json();
            console.log(users);
            setAllUsers(users);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // setErrorMessage("Invalid authentication token or expired token. Please login again.");
                // setErrorDet(true);
                // setFourOhOne(true);
                // setDefError(false);
            } else {
                // setErrorMessage("An unknown error occurred. Please try again later.");
                // setErrorDet(true);
                // setDefError(true);
                // setFourOhOne(false);
            }
        }
    };

    const toggleModal = async () => {
        setIsModalOpen(!isModalOpen);
        await fetchData();
    };

    useEffect(() => {
        existingTeamMembers();
        fetchData();
    }, []);
    const handleOnChange = async (
        index: number,
        userEmail: string,
        displayName: string,
        role: any,
        permissions: string[],
        photoURL: string
    ) => {
        setTeamMembers((prevTeamMembers) => {
            const isSelected = prevTeamMembers.some((user) => user.userEmail === userEmail);
            if (isSelected) {
                // If selected, remove the user from the list
                const updatedUsers = prevTeamMembers.filter((user) => user.userEmail !== userEmail);
                return updatedUsers;
            } else {
                // If not selected, add the user to the list
                const updatedUsers = [...prevTeamMembers, { userEmail, displayName, role, permissions }];
                return updatedUsers;
            }
        });
    };
    const addTeamMembers = async () => {
        const obj = {
            proposalID: proposalID,
            teamMembers: teamMembers.map((member) => ({
                userEmail: member?.userEmail,
            })),
        };
        try {
            const response = await fetch(`${BASEURL}/api/proposal/add-team-members`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error adding team members:", errorData);
                return;
            }

            const respData = await response.json();
            console.log("Team members added successfully:", respData);

            await existingTeamMembers();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error occurred while adding team members:", error);
        }
    };
    const handleDeleteClick = async (userEmail: string) => {
        const obj = {
            proposalID: proposalID,
            userEmail: userEmail,
        };

        try {
            const response = await fetch(`${BASEURL}/api/proposal/remove-team-members`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to remove user: ${response.status} - ${errorMessage}`);
            }

            const data = await response.json();
            toggleOverlay("showSuccessCard");

            console.log("User removed successfully:", data);

            await existingTeamMembers();
        } catch (error) {
            console.error("Error removing team member:", error);
        }
    };

    return (
        <div className="p-12 bg-accent-color rounded-md py-8">
            <div className="bg-accent-color rounded-md py-8">
                <ArrowBackIcon
                    className="hover:bg-yellow-600 bg-yellow-300 p-4 rounded-full text-black"
                    onClick={() => onClose()}
                />
            </div>

            <div className="flex gap-x-8 items-center">
                <h2>Team Members</h2>
                <FaRegEdit
                onClick={toggleModal}
                className="hover:border-yellow-600 hover:text-yellow-600 text-yellow-300 text-20 cursor-pointer "
                />
            </div>

            {isModalOpen && (
                <div
                    className="modal bg-accent-color absolute rounded p-15"
                    style={{ maxHeight: "367px", top: "150px", right: "190px" }}
                >
                    <div className="flex border-accent-color mb-2">
                        {/* // eslint-disable-next-line react/jsx-no-undef */}
                        {/* <Image src={user.photoURL} alt="user image" className="h-32 w-37" /> */}
                        <span className="text-28 text-[#F2F2F2] ml-2">Add Team Members</span>
                    </div>
                    <div className="mx-auto mb-2" style={{ borderBottom: "2px solid #2f2f2f", width: "90%" }}></div>

                    <div className="custom-scrollbar pr-10" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {Array.isArray(allUsers) &&
                            allUsers.map((user: User, index) => (
                                <li key={index} className="list-none">
                                    <div className="toppings-list-item">
                                        <div className="left-section flex mb-4 ml-2">
                                            <label className={`${styles.container} cursor-pointer mt-3`}>
                                                <input
                                                    type="checkbox"
                                                    id="index"
                                                    onChange={() =>
                                                        handleOnChange(
                                                            index,
                                                            user.userEmail,
                                                            user.displayName,
                                                            user.role,
                                                            user.permissions
                                                        )
                                                    }
                                                />
                                                <span className={`${styles.checkmark}`}></span>
                                            </label>
                                            <div className="ml-4">
                                                {" "}
                                                <label
                                                    htmlFor={`custom-checkbox-${index}`}
                                                    className="text-18  text-[#F2F2F2]"
                                                >
                                                    {user.displayName}
                                                </label>
                                                <p className="text-14">{user.userEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </div>
                    <div className="flex justify-center gap-x-4">
                        <GoldBorderButton
                            label="Add"
                            onClick={() => addTeamMembers()}
                            width="w-[120px]"
                            height="h-[40px]"
                        />
                        <GoldBorderButton
                            label="Close"
                            onClick={() => setIsModalOpen(!isModalOpen)}
                            width="w-[120px]"
                            height="h-[40px]"
                        />
                    </div>
                </div>
            )}
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {teamMemberData.map((user, index) => (
                    <li key={index} className="list-none rounded-lg">
                        <div className="toppings-list-item">
                            <div className="left-section flex mb-4 ml-2">
                                <div style={{ position: "relative", width: "40px", height: "40px" }}>
                                    <Image
                                        src={user.photoURL}
                                        alt="User Photo"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                </div>
                                <div className="ml-2 w-[40%] ">
                                    {" "}
                                    <label className="text-18  text-[#F2F2F2]">{user.displayName}</label>
                                    <p className="text-14 ">{user.userEmail}</p>
                                </div>
                                <div className="ml-28 mt-2 mr-8">
                                    {" "}
                                    <img
                                        src="/../minus.svg"
                                        height="20px"
                                        width="20px"
                                        alt="Delete"
                                        onClick={() => handleDeleteClick(user.userEmail)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </div>

            <OverlayComponent show={overlays.showSuccessCard} onClose={() => closeOverlay("showSuccessCard")}>
                <SubmitSuccessfully onClose={() => closeOverlay("showSuccessCard")} message={"Team Member Removed"} />
            </OverlayComponent>
        </div>
    );
}
