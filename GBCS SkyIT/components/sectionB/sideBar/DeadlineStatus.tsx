// components/Table.js
import React, { useState, useEffect } from "react";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";

const DeadlineStatus = () => {
    const router = useRouter();
    const [data, setData] = useState("");
    const [deadline, setDeadline] = useState(Number);
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
                const date = new Date(jsonData.singleProposal.proposal_deadline);
                const options = { month: "long", day: "numeric", year: "numeric" };
                const formattedDate = date.toLocaleDateString("en-US", options);
                setData(formattedDate);
                //calcutate days left
                const currentDate = new Date();
                const timeDifference = date.getTime() - currentDate.getTime();
                const millisecondsInDay = 1000 * 60 * 60 * 24;
                const daysLeft = Math.ceil(timeDifference / millisecondsInDay);
                // Check if the deadline has passed
                if (daysLeft >= 0) {
                    setDeadline(daysLeft);
                } else {
                    // If the deadline has passed, calculate days overdue
                    const daysOverdue = Math.abs(daysLeft);
                    setDeadline(-daysOverdue); // Set negative value to indicate overdue days
                }
            } catch (error) {
                console.error("Fetch error", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="max-w-screen-md mx-auto">
            <div className="flex justify-between bg-transparent p-1 text-white font-semi-bold">
                <div className="w-[85px] font-poppins font-medium text-18">Deadline:</div>
                <div className="w-[140px] pl-4 font-poppins font-medium text-18">{data}</div>
                <div className="w-[132px] font-poppins font-medium text-18 text-transparent bg-clip-text bg-gradient-gold-gbcs pl-[12px]">
                    {deadline >= 0 ? `${deadline} days left` : `${Math.abs(deadline)} days overdue`}
                </div>
            </div>
        </div>
    );
};

export default DeadlineStatus;
