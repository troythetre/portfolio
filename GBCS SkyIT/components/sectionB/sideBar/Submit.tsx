/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Image from "next/image";
import back from "../../../public/images/backIcon.svg";
import styles from "./styles.module.css";
import GoldBorderButton from "./GoldBorderButton";
import SubmitSuccessfully from "./SubmitSuccessfully";
import OverlayComponent from "./OverlayComponent";
import add_notified from "../../../public/images/edit-proposal/add_notified.svg";
import user_img from "../../../public/images/edit-proposal/user_img.svg";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";
import AccountCircle from "@mui/icons-material/AccountCircle";

interface SubmitProps {
    onClose: () => void;
}

interface User {
    displayName: string;
    userEmail: string;
    photoURL: string;
}

const Submit: React.FC<SubmitProps> = ({ onClose }) => {
    const router = useRouter();
    // const {proposalID} = useProposalID();
    const { proposalID } = router.query;
    const [proposalStatus, setProposalStatus] = useState("");
    const [proposalDeadline, setProposalDeadline] = useState("");

    const initialFormData = {
        section: "",
    };
    const [formData, setFormData] = useState(initialFormData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminUserData, setAdminUserData] = useState([]);

    const [overlays, setOverlays] = useState<{
        showSubmitSuccessfullyCard: boolean;
        showCurrentInReviewCard: boolean;
        showNoApproversAssignedCard: boolean;
    }>({
        showSubmitSuccessfullyCard: false,
        showCurrentInReviewCard: false,
        showNoApproversAssignedCard: false,
    });
    const toggleOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: !prevOverlays[overlayName] }));
    };

    const closeOverlay = (overlayName: keyof typeof overlays) => {
        setOverlays((prevOverlays) => ({ ...prevOverlays, [overlayName]: false }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    const toggleModal = async () => {
        setIsModalOpen(!isModalOpen);
        await adminUsers();
    };

    const [selectedUsers, setSelectedUsers] = useState<{ email: string; photoURL: string }[]>([]);
    const [userEmail, setUserEmail] = useState<string[]>([]);

    const adminUsers = async () => {
        const response = await fetch(`${BASEURL}/api/proposal/admin-users`, {
            method: "GET",
            credentials: "include",
        });
        const adminUsers = await response.json();
        setAdminUserData(adminUsers);
        console.log(adminUserData);
    };
    const handleOnChange = async (index: number, email: string, photoURL: string) => {
        const isSelected = selectedUsers.some((user) => user.email === email);
        if (isSelected) {
            // If selected, remove the user from the list
            const updatedUsers = selectedUsers.filter((user) => user.email !== email);
            setSelectedUsers(updatedUsers);
            console.log(selectedUsers);
        } else {
            // If not selected, add the user to the list
            setSelectedUsers([...selectedUsers, { email, photoURL }]);
            await setUserEmail([...userEmail, email]);
        }
    };

    const showSelectedImages = () => {
        return selectedUsers.map((user, index) => (
            <div key={index} className="mr-4">
                {user.photoURL ? (
                    <Image
                        src={user.photoURL}
                        width={40}
                        height={40}
                        alt={user.photoURL ? `Selected user ${index}` : `${index}`}
                        className="rounded-full"
                    />
                ) : (
                    <AccountCircle
                        sx={{
                            height: "48px",
                            width: "48px",
                            marginTop: "-4px",
                        }}
                    />
                )}
            </div>
        ));
    };
    const changeProposalStatus = async () => {
        const statusChangeBody = {
            proposalID: proposalID,
            status: "REVIEW",
            note: "change again",
        };
        const changeStatus = await fetch(`${BASEURL}/api/proposal/update-status`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(statusChangeBody),
        });
    };
    const sendApprovalRequest = async () => {
        console.log("Sending approval request...");

        // Fetch current proposal status
        try {
            const response = await fetch(`${BASEURL}/api/proposal/single-proposal/${proposalID}`, {
                method: "GET",
                credentials: "include",
            });

            const jsonData = await response.json();
            console.log("Fetched proposal data:", jsonData);

            const status = jsonData.singleProposal.proposalStatus;
            const approverDeadline = jsonData.singleProposal.approver_deadline;

            setProposalStatus(status);
            setProposalDeadline(approverDeadline);

            // Check proposal status
            if (status === "INPROGRESS") {
                if (userEmail.length === 0) {
                    // No approvers assigned
                    toggleOverlay("showNoApproversAssignedCard");
                    return;
                }
                let requestBody = {
                    proposalID: proposalID,
                    approverEmails: userEmail,
                    approvalDeadline: approverDeadline,
                    comment: formData.section,
                };

                console.log("Request body:", requestBody);

                // Send approval request
                const approvalResponse = await fetch(`${BASEURL}/api/proposal/approval-request`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!approvalResponse.ok) {
                    console.error("Request failed with status:", approvalResponse.status);
                    const responseBody = await approvalResponse.json().catch(() => approvalResponse.text());
                    console.error("Response body:", responseBody);
                } else {
                    console.log("Approval request successful");
                    toggleOverlay("showSubmitSuccessfullyCard");

                    // Update proposal status to REVIEW
                    await changeProposalStatus();
                }
            } else {
                console.log("Proposal status is not INPROGRESS. Current status:", status);
                toggleOverlay("showCurrentInReviewCard");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleSubmit = async () => {
        await sendApprovalRequest();
    };

    return (
        <div className="fixed  inset-0 w-full bg-black bg-opacity-50 flex justify-center items-center">
            <div
                className=" bg-[#2F2F2F] h-[490px] justify-between py-15 rounded-xl text-white text-20"
                style={{ width: "35%", margin: "0 auto", minHeight: "490px", overflowY: "auto" }}
            >
                <div className="ml-6">
                    <Image src={back} alt="back-icon" height="44px" width="46px" onClick={onClose}></Image>
                </div>
                <div className="pl-20">
                    <p className="px-auto text-white text-22 text-center justify-center ">
                        Are you sure you want to <br></br> submit for approval?
                    </p>
                    <div className="items-center justify-center m-10 mb-4 mt-4">
                        <div className="mb-2">
                            <div className="text-white text-16 font-normal">Comments:</div>
                            <div className=" w-[25vw] h-[128px] rounded-lg shadow-xl bg-gradient-gold-gbcs mt-1">
                                <textarea
                                    name="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                    className="w-[25vw] h-[126px] px-5 text-gray-color text-lg font-medium 
                                     bg-accent-color rounded-lg  border-none justify-start items-center mx-auto gap-2.5 inline-flex"
                                    placeholder=""
                                />
                            </div>
                        </div>{" "}
                        <div className="text-white text-16 font-normal">Who will be notified:</div>
                    </div>{" "}
                    <div className="flex flex-row mt-4 ml-3 mb-3 pl-25">
                        {showSelectedImages()}
                        <div className="mr-4">
                            <Image src={add_notified} width={45} alt="admin users" height={45} onClick={toggleModal} />
                        </div>
                    </div>
                    {isModalOpen && (
                        <div
                            className="modal bg-accent-color absolute rounded p-15"
                            style={{ maxHeight: "367px", top: "150px", right: "190px" }}
                        >
                            <div className="flex border-accent-color mb-2">
                                <Image src={user_img} alt="user image" className="h-32 w-37" />
                                <span className="text-28 text-[#F2F2F2] ml-2">Admin Users</span>
                            </div>
                            <div
                                className="mx-auto mb-2"
                                style={{ borderBottom: "2px solid #2f2f2f", width: "90%" }}
                            ></div>

                            <div className="custom-scrollbar pr-10" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {Array.isArray(adminUserData) &&
                                    adminUserData.map((user: User, index) => (
                                        <li key={index} className="list-none">
                                            <div className="toppings-list-item">
                                                <div className="left-section flex mb-4 ml-2">
                                                    <label className={`${styles.container} cursor-pointer mt-3`}>
                                                        <input
                                                            type="checkbox"
                                                            id="index"
                                                            onChange={() =>
                                                                handleOnChange(index, user.userEmail, user.photoURL)
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
                            <div className="flex justify-center">
                                <GoldBorderButton
                                    label="Close"
                                    onClick={() => setIsModalOpen(false)}
                                    width="w-[120px]"
                                    height="h-[40px]"
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex flex-row justify-around mx-3">
                        <div className="mr-4">
                            <GoldBorderButton label="No" onClick={onClose} width="w-[120px]" height="h-[40px]" />
                        </div>
                        <div className="ml-4">
                            <GoldBorderButton
                                label="Submit"
                                onClick={handleSubmit}
                                width="w-[120px]"
                                height="h-[40px]"
                            />
                        </div>
                    </div>
                </div>
                <OverlayComponent
                    show={overlays.showSubmitSuccessfullyCard}
                    onClose={() => closeOverlay("showSubmitSuccessfullyCard")}
                >
                    <SubmitSuccessfully onClose={onClose} message="Submitted" />
                </OverlayComponent>
                <OverlayComponent
                    show={overlays.showCurrentInReviewCard}
                    onClose={() => closeOverlay("showCurrentInReviewCard")}
                >
                    <SubmitSuccessfully onClose={onClose} message="Proposal Under Review" />
                </OverlayComponent>
                <OverlayComponent
                    show={overlays.showNoApproversAssignedCard}
                    onClose={() => closeOverlay("showNoApproversAssignedCard")}
                >
                    <SubmitSuccessfully onClose={onClose} message="No Approvers Assigned" />
                </OverlayComponent>
            </div>
        </div>
    );
};

export default Submit;
