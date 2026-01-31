// components/RFPHeading.tsx
import React, { useState, useEffect } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditStatus from "./EditStatus";
import GoldBorderButton from "./GoldBorderButton";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";

const RFPHeading: React.FC = () => {
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [rfpName, setRFPName] = useState(""); // Current RFP Name
    const [originalRFPName, setOriginalRFPName] = useState(""); // Initial RFP Name
    // const proposalID = "RFP221";
    const { proposalID } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/single-proposal/${proposalID}`, {
                    method: "GET",
                    credentials: "include",
                });

                const jsonData = await response.json();
                // console.log(jsonData.singleProposal.proposalName);
                const name = jsonData.singleProposal.proposalName;
                setRFPName(name);
                setOriginalRFPName(name);
            } catch (error) {
                console.error("Fetch error", error);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/update-proposal-name`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    proposalID: proposalID,
                    new_name: rfpName,
                }),
            });

            if (response.ok) {
                console.log("Name updated successfully");
                setEditMode(false);
            } else {
                console.error("Failed to update name");
            }
        } catch (error) {
            console.error("Request error", error);
        }
    };

    const handleCancelClick = () => {
        setEditMode(false);
        setRFPName(originalRFPName); // Reset to the original value
    };

    return (
        <div className="flex flex-col text-white font-bold text-lg my-4 self-start mx-5">
            <div className="flex flex-row">
                {editMode ? (
                    <div className="flex flex-row">
                        <div className="relative z-0 w-[200px] h-10 rounded-lg shadow-xl bg-gradient-gold-gbcs mr-2">
                            <input
                                type="text"
                                value={rfpName}
                                className="absolute -mt-0.5 -ml-0.5 z-10 w-[202px] h-10 px-5 text-gray-color text-lg font-medium  leading-10 tracking-tight bg-accent-color rounded-lg  border-none justify-start items-center gap-2.5 inline-flex"
                                onChange={(e) => setRFPName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row mr-2">
                            <div className="mr-2">
                                <GoldBorderButton
                                    label="Save"
                                    onClick={handleSaveClick}
                                    width="w-[80px]"
                                    height="h-[20px]"
                                />
                            </div>
                            <GoldBorderButton
                                label="Cancel"
                                onClick={handleCancelClick}
                                width="w-[80px]"
                                height="h-[20px]"
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        {rfpName}
                        <div className="mx-3" onClick={handleEditClick}>
                            <EditOutlinedIcon style={{ fill: "gold", fontSize: 30 }} />
                        </div>
                    </>
                )}
            </div>
            <div className="flex-grow">
                <EditStatus />
            </div>
        </div>
    );
};

export default RFPHeading;
