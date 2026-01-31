import React from "react";
import DashboardPage from "../../../components/sectionA/DashboardPage";
import ProposalSideBar from "../../../components/sectionA/ProposalSideBar/ProposalSideBar";
import AwaitingApproval from "../../../components/sectionA/AwaitingApproval/AwaitingApproval";

const Dashboard = () => {
  return (
    <div className="flex">
      <ProposalSideBar />
      <AwaitingApproval />
    </div>
  );
};

export default Dashboard;
