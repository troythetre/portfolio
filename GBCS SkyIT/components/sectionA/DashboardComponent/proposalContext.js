import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const ProposalContext = createContext();

export const useProposalContext = () => useContext(ProposalContext);

export const ProposalProvider = ({ children }) => {
  const [proposalDetails, setProposalDetails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASEURL}/api/proposal/allproposals`, {
                withCredentials: "include",
            });

            //setData(response.data);
            console.log(response.data);

            setProposals(response.data.proposals || []);
            // Update state with data from all proposals
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error("Invalid authentication token or token expired.");
                // Handle token refresh or reauthentication logic here
            } else {
                console.error("Error while fetching data:", error);
            }
        }
    };
    fetchData();
}, [page]);

useEffect(() => {
    const processedProposals = proposals
    .filter((proposal) => !results || proposal.proposalID.toLowerCase().includes(results.toLowerCase()))
    .map((proposal) => {
        // Process each proposal...
        const rawApproverDeadline = proposal.proposal_deadline;
        const approverDeadlineDate = new Date(rawApproverDeadline);
        const approverDeadline = approverDeadlineDate.toISOString().split("T")[0];

        const nanoseconds = proposal.lastModified?._nanoseconds || 0;
        const seconds = proposal.lastModified?._seconds || 0;
        const lastModifyDate = new Date(0);
        lastModifyDate.setUTCSeconds(seconds);
        lastModifyDate.setUTCMilliseconds(nanoseconds / 1e6);

        const fallbackImageURL = "https://example.com/proposal";
        const proposal_image =
            proposal.mediaFiles && proposal.mediaFiles.fileURL
                ? proposal.mediaFiles.fileURL
                : {src: fallbackImageURL, width: 100, height: 100};

        let daysAgo = "";
        if (!isNaN(lastModifyDate.getTime())) {
            daysAgo = Math.floor((new Date() - lastModifyDate) / (1000 * 60 * 60 * 24));
        }

        return {
            proposalId: proposal.proposalID,
            deadline: approverDeadline,
            modifyDate: lastModifyDate,
            daysAgo,
            image: proposal_image,
        };
    });

    setProposalDetails(processedProposals);
}, [results, proposals]);
  const deleteMenuItem = (itemId) => {
    // Update table data by removing the item with the given itemId
    setProposalDetails((prevData) => prevData.filter((item) => item.id !== itemId));
  };

  return (
    <ProposalContext.Provider value={{ proposalDetails, deleteMenuItem }}>
      {children}
    </ProposalContext.Provider>
  );
};
