import React, { useEffect, useState } from "react";
import Image from "next/image";
import smallCheck from "../../../public/smallCheck.svg";
import underReview from "../../../public/underReview.svg";
import dueSoon from "../../../public/dueSoon.svg";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";

interface MilestoneProps {
    milestone: {
        name: string;
        date: string;
    };
}

const Milestone: React.FC<MilestoneProps> = ({ milestone }) => {
    // console.log(milestone);
    const router = useRouter();
    const { proposalID } = router.query;
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (proposalID) {
            getProposalStatus(proposalID as string);
        }
    }, [proposalID]);

    const getProposalStatus = async (proposalID: string) => {
        try {
            const response = await fetch(`${BASEURL}/api/proposal/status/${proposalID}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const proposalStatus = await response.json();
            setStatus(proposalStatus.status);
            // console.log(status);
        } catch (error) {
            console.error("Error submitting approval request:", error);
        }
    };

    let icon;

    if (status === "Complete") {
        icon = <Image src={smallCheck} alt="Complete Icon" />;
    } else if (status === "under review") {
        icon = <Image src={underReview} alt="Under Review Icon" />;
    } else {
        icon = <Image src={dueSoon} alt="Due Soon Icon" />;
    }

    return (
        <div style={{ borderTop: "1px white solid" }}>
            <div className="flex justify-between font-light py-12 content-center text-white px-30">
                <p className="text-25">{milestone.name}</p>
                <div className="flex text-24 font-semibold w-[45%]">
                    <div className="flex justify-start content-center gap-2 w-[60%] items-center">
                        <p>{icon}</p>
                        <p style={{ marginBottom: "5px" }}>{status}</p>
                    </div>
                    <p>{milestone.date ? milestone.date.split('T')[0] : null}</p>
                </div>
            </div>
        </div>
    );
};

export default Milestone;
