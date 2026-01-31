import React from "react";

import DashboardPage from "../../../components/sectionA/DashboardPage";
import ProposalSideBar from "../../../components/sectionA/ProposalSideBar/ProposalSideBar";

const Dashboard = () => {
  return (
    <div className="flex">
      <ProposalSideBar />
      <DashboardPage page='In-progress' />
    </div>
  );
};

export default Dashboard;
