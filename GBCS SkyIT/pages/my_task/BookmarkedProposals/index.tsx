import React from "react";

import BookMarkedProposals from "../../../components/sectionA/BookmarkedProposals/BookMarkedProposals";
import ProposalSideBar from "../../../components/sectionA/ProposalSideBar/ProposalSideBar";

const Dashboard = () => {
  return (
    <div className="flex">
      <ProposalSideBar />
      <BookMarkedProposals/>
    </div>
  );
};

export default Dashboard;
