import React, { useState, useEffect } from "react";
import { BASEURL } from "../../../constants";
import { useRouter } from "next/router";

const EditStatus = () => {
    const router = useRouter();
    const [authorName, setAuthorName] = useState("");
    const [authorNameLastEdit, setAuthorNameLastEdit] = useState("");
    // const proposalID = "RFP221";
    const { proposalID } = router.query;

    //Fetch single-proposal
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASEURL}/api/proposal/single-proposal/${proposalID}`, {
                    method: "GET",
                    credentials: "include",
                });

                const jsonData = await response.json();
                const name = jsonData.singleProposal.proposalName;
                const nameLastEdit = jsonData.singleProposal.last_modified_email;
                setAuthorName(name);
                setAuthorNameLastEdit(nameLastEdit);
            } catch (error) {
                console.error("Fetch error", error);
            }
        };

        fetchData();
    }, []);
    return (
        <span className="w-[200px] text-[#B5B5B5] text-xs">
            GBCS SkyBlue Template: By {authorName} (you)
            <span className="text-[#28A8EA]"> Last Edited by </span>
            {authorNameLastEdit} (Project Lead)
        </span>
    );
};

export default EditStatus;
