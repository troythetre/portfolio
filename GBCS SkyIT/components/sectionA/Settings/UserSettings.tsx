import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import TeamMember from "../Account/TeamMemberProfile";
import { BASEURL } from "../../../constants";
import GenerateCode from "../CodeGen/CodeGen";
import { useUser } from "../NewProposal/FormDataContext";


export default function User() {
    const [firstName, setFirstName] = useState<string | null>("");
    const [lastName, setLastName] = useState<string | null>("");
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>("");
    const [role, setRole] = useState<string | null>("");
    const { user } = useUser();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const fullName = user?.displayName;
            setEmail(user?.userEmail);
            setRole(user?.role)
            setFirstName(fullName?.split(" ")[0] ?? "Your name");
            setLastName(fullName?.split(" ")[1] ?? "");
        }
    }, [user]);

    const handleChangePassword = async () => {
        setError(null);
        setSuccess(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all the fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password don't match");
            return;
        }

        try {
            const payload = {
                email: email,
                oldPassword: currentPassword,
                newPassword: newPassword,
            };

            const response = await fetch(`${BASEURL}/api/proposal/change-password`, {
                method: "POST", // Added method attribute
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const jsonData = await response.json();
            console.log(jsonData);

            if (response.ok) {
                setSuccess("Password updated successfully");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(jsonData.message || "Failed to update password");
            }
        } catch (error) {
            console.error("Fetch error", error);
            setError("An error occurred while updating the password");
        }
    };
    return (
        <div className="w-4/5 flex flex-col ml-[22%] mt-20">
            <div className="flex flex-row justify-between w-[90%] ml-9 text-white text-30">
                <div>
                    <p className="text-white pl text-30">Settings</p>
                    <TeamMember />
                </div>
                <div className="self-center">{role === "ADMIN" && <GenerateCode />}</div>
            </div>
            <div className="w-[90%]">
                <Accordion
                    defaultExpanded
                    style={{ backgroundColor: "transparent", color: "white" }}
                    className="text-white shadow-none bg-transparent bg-[#1A1B1E]"
                >
                    <AccordionSummary
                        className="pr-0"
                        expandIcon={<ArrowDropDownIcon className="text-yellow-300 text-44 -mb-1.5" />}
                    >
                        <Typography className="text-lg inline-block ">
                            <div className="absolute text-25 inline-block w-full font-bold border-2 border-gray-400 border-solid  border-r-0 border-l-0 border-t-0">
                                Account Information
                            </div>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ backgroundColor: "transparent" }}>
                        <Typography>
                            <div className="text-20 flex justify-between">
                                <div className="inline text-gray-400">{"FIRST NAME"}</div>
                                <div className="inline text-gray-400">{"LAST NAME"}</div>
                            </div>
                            <div className="flex text-18 justify-between">
                                <div className="inline">{firstName}</div>
                                <div className="inline">{lastName}</div>
                            </div>
                            <div className="pt-11">
                                <div className="inline text-gray-400 text-25">{"EMAIL"}</div>
                                <div className="text-18">{email}</div>
                            </div>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className="pt-10 w-[90%] mb-16">
                <Accordion
                    defaultExpanded
                    style={{ backgroundColor: "transparent", color: "white" }}
                    className="text-white shadow-none bg-transparent"
                >
                    <AccordionSummary
                        className=" pr-0 "
                        expandIcon={<ArrowDropDownIcon className="text-yellow-300 text-44 -mb-1.5" />}
                    >
                        <Typography className="text-lg inline-block ">
                            <div className=" absolute w-full text-25 border-gray-400 font-bold border-2  border-solid  border-r-0 border-l-0 border-t-0">
                                Account Security
                            </div>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <div className="inline">
                                <div className="mt-2 text-22">
                                    {"To change password, please fill in the fields below"}
                                </div>
                                <div className="pt-[32px]">
                                    CURRENT PASSWORD
                                    <div className="pt-7">
                                        <Input
                                            type="password"
                                            className="p-1 text-white text-md rounded-lg pl-2 w-500 border-solid border-2 border-yellow-300 border-t-0 border-r-0 border-l-0 bg-card-bg"
                                            placeholder="Current Password"
                                            id="input-with-icon-adornment"
                                            startAdornment={<InputAdornment position="start"></InputAdornment>}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="pt-[42px]">
                                    NEW PASSWORD
                                    <div className="pt-7">
                                        <Input
                                            type="password"
                                            className="p-1 text-white text-md rounded-lg pl-2 w-500 border-solid border-2 border-yellow-300 border-t-0 border-r-0 border-l-0 bg-card-bg"
                                            placeholder="New Password"
                                            id="input-with-icon-adornment"
                                            startAdornment={<InputAdornment position="start"></InputAdornment>}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="pt-[42px]">
                                    CONFIRM PASSWORD
                                    <div className="pt-7">
                                        <Input
                                            type="password"
                                            className="p-1 text-white text-md rounded-lg pl-2 w-500 border-solid border-2 border-yellow-300 border-t-0 border-r-0 border-l-0 bg-card-bg"
                                            placeholder="Confirm Password"
                                            id="input-with-icon-adornment"
                                            startAdornment={<InputAdornment position="start"></InputAdornment>}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="pt-30">
                                    <button
                                        onClick={handleChangePassword}
                                        className=" bg-transparent hover:border-yellow-600 hover:text-yellow-600 p-5 text-sm border-solid text-GBCS-yellow border-yellow-400 border-1 rounded-xl w-220 cursor-pointer"
                                    >
                                        Change Password
                                    </button>
                                </div>
                                {error && <div style={{ color: "red" }}>{error}</div>}
                                {success && <div style={{ color: "green" }}>{success}</div>}
                            </div>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
}
