import React from "react";
import SubmittedProposals from "../../../components/sectionA/SubmittedProposalsComponent/SubmittedProposals";
import ProposalSideBar from "../../../components/sectionA/ProposalSideBar/ProposalSideBar";

const SubmittedProposalPage = () => {
  return (
    <div className="flex">
      <ProposalSideBar />
      <SubmittedProposals />      
    </div>
  );
};

export default SubmittedProposalPage;
