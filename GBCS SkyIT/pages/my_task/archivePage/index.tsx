import React from "react";

import ArchivePRoposals from "../../../components/sectionA/ArchiveProposals/ArchiveProposals";
import ProposalSideBar from "../../../components/sectionA/ProposalSideBar/ProposalSideBar";

const Dashboard = () => {
  return (
    <div className="flex">
      <ProposalSideBar />
      <ArchivePRoposals/>
    </div>
  );
};

export default Dashboard;
